"use client";

import { useEffect, useId, useRef, useState } from "react";
import type * as THREE_NS from "three";
import { Head, Reveal } from "@/components/sections/hardware/hw-shared";
import { BAY, RACK_X, createSstKit, loadFork, type Mounts } from "./sst-3d";
import { LIDAR_COPY, LIDAR_FACTS, LIDAR_NOTE, LIDAR_TABS, type LidarMode } from "./sst-data";

/**
 * 04 — One LiDAR layer. Three answers.
 *
 * The page's centrepiece, and the section that has to carry the hardest idea on
 * it: that crash, speed and location monitoring are not three sensors. So it is
 * literally one scene — one point-cloud warehouse, one truck driving one loop —
 * with three read-outs taken off it. Switching tabs does not load a different
 * picture; it changes what the picture is being asked.
 *
 *   **Location** — an orange trail behind the truck, and a read-out naming the
 *   aisle and the bay it is passing, logged each time it changes aisle.
 *   **Speed** — the walkway and the dock light up as zones with their own
 *   limits, a live graph runs the truck's speed, the trace turns red whenever
 *   it is over the limit for the zone it is *actually in*, and going over logs
 *   an overspeed with the place.
 *   **Impact** — the truck drifts into the third upright of rack A, the point
 *   cloud takes a red shockwave out from the contact, and the impact is logged
 *   with what it hit and that the operator was verified at start.
 *
 * ── Nothing here is a number we do not have ─────────────────────────
 * The graph has no units and the read-out has no figures; the spec forbids
 * both. Speed is a proportion of a zone limit, an impact is a place and a time.
 * See the head of `sst-data.ts`.
 *
 * ── Where the split is ──────────────────────────────────────────────
 * The scene is imperative and owns its own 60fps state; React owns the read-out
 * panel, which it updates four times a second — fast enough to read as live,
 * slow enough that the text can be read at all. The floating tags are the
 * exception: they are positioned every frame straight onto DOM refs, because
 * they track a moving truck.
 *
 * `mode` is lifted to the page shell so a sensor card three sections up, or a
 * sheet, can open this section already switched to the answer it was talking
 * about.
 */

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

type Read = { state: string; sub: string; cls: string };
type LogRow = { id: number; m: LidarMode; t: string; txt: string };

export function SstLidar({
  mode,
  onMode,
}: {
  mode: LidarMode;
  onMode: (m: LidarMode) => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const truckTagRef = useRef<HTMLDivElement>(null);
  const hitTagRef = useRef<HTMLDivElement>(null);
  const zoneTagRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [noGl, setNoGl] = useState(false);
  const [read, setRead] = useState<Read>({ state: "Aisle 2", sub: "Heading east, loaded.", cls: "" });
  /* The speed graph is drawn by the scene every frame, straight onto these
     paths — through React it would step four times a second, not flow. */
  const spdRef = useRef<SVGPathElement>(null);
  const areaRef = useRef<SVGPathElement>(null);
  const overRef = useRef<SVGPathElement>(null);
  const clipRef = useRef<SVGPathElement>(null);
  const clipId = useId().replace(/:/g, "");
  const [log, setLog] = useState<LogRow[]>([]);

  const modeRef = useRef(mode);
  /** Published by the scene so the tab effect can reset it without owning it. */
  const resetRef = useRef<((m: LidarMode) => void) | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    let disposed = false;
    let raf = 0;
    const cleanups: (() => void)[] = [];

    (async () => {
      const THREE = (await import("three")) as typeof THREE_NS;
      if (disposed) return;

      const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile = matchMedia("(max-width:760px)").matches || /Mobi|Android/i.test(navigator.userAgent);
      const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
      const kit = createSstKit(THREE, isMobile);

      let R: THREE_NS.WebGLRenderer;
      try {
        R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
        if (!R.capabilities.isWebGL2) throw new Error("webgl2");
      } catch {
        setNoGl(true);
        return;
      }
      R.setClearColor(0x000000, 0);
      R.toneMapping = THREE.ACESFilmicToneMapping;

      const scene = new THREE.Scene();
      scene.add(new THREE.HemisphereLight(0xbfd8ff, 0x101418, 1.1));
      const sun = new THREE.DirectionalLight(0xffffff, 1.6);
      sun.position.set(6, 12, 4);
      scene.add(sun);
      const cam = new THREE.PerspectiveCamera(38, 16 / 10, 0.1, 200);

      const cloud = new THREE.Points(kit.buildCloud(1), kit.cloudMaterial());
      scene.add(cloud);
      const U = cloud.material.uniforms;

      /* The two zones, for the speed view. A walkway across the aisles and the
         dock at the east end — the two places on a real floor where a
         site-wide limit is either far too fast or pointlessly slow. */
      const zoneMat = (c: number) =>
        new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
      const ZONES = [
        { name: "Walkway", limit: 0.42, col: 0xffd60a, x: [-1.1, 0.4], z: [-1.1, 5.6] },
        { name: "Dock", limit: 0.28, col: 0xff453a, x: [9.2, 13.6], z: [-1.6, 6.1] },
      ].map((z) => {
        const w = z.x[1] - z.x[0], d = z.z[1] - z.z[0];
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), zoneMat(z.col));
        m.rotation.x = -Math.PI / 2;
        m.position.set((z.x[0] + z.x[1]) / 2, 0.02, (z.z[0] + z.z[1]) / 2);
        scene.add(m);
        const e = new THREE.LineSegments(
          new THREE.EdgesGeometry(new THREE.PlaneGeometry(w, d)),
          new THREE.LineBasicMaterial({ color: z.col, transparent: true, opacity: 0 }),
        );
        e.rotation.x = -Math.PI / 2;
        e.position.copy(m.position);
        e.position.y = 0.03;
        scene.add(e);
        return { ...z, mesh: m, edge: e };
      });
      type Zone = (typeof ZONES)[number];
      const zoneAt = (x: number, z: number): Zone | undefined =>
        ZONES.find((q) => x >= q.x[0] && x <= q.x[1] && z >= q.z[0] && z <= q.z[1]);

      /* The loop: down aisle 1, round the dock, back along aisle 2. */
      const path = new THREE.CatmullRomCurve3(
        [
          V3(-11, 0, 0), V3(-4, 0, 0), V3(3, 0, 0), V3(9.6, 0, 0.2), V3(11.2, 0, 2.2),
          V3(9.6, 0, 4.4), V3(3, 0, 4.5), V3(-4, 0, 4.5), V3(-11, 0, 4.4), V3(-12.6, 0, 2.2),
        ],
        true, "catmullrom", 0.4,
      );
      const LEN = path.getLength();

      const truck = new THREE.Group();
      scene.add(truck);
      let mountsL: Mounts | null = null;
      loadFork()
        .then((src) => {
          if (disposed) return;
          const f = kit.fitFork(src);
          truck.add(f);
          mountsL = kit.mountsOf(f);
        })
        .catch(() => {});

      /* The trail: a ring buffer of 260 points dropped every 60ms. */
      const trailN = 260;
      const trailPos = new Float32Array(trailN * 3);
      const trail = new THREE.Points(
        new THREE.BufferGeometry(),
        new THREE.PointsMaterial({ color: 0xff8a3d, size: 0.16, sizeAttenuation: true, transparent: true, opacity: 0, depthWrite: false }),
      );
      trail.geometry.setAttribute("position", new THREE.BufferAttribute(trailPos, 3));
      scene.add(trail);
      let trailCount = 0, trailTick = 0;

      const hitRing = new THREE.Mesh(
        new THREE.RingGeometry(0.9, 1, 64),
        new THREE.MeshBasicMaterial({ color: 0xff453a, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }),
      );
      hitRing.rotation.x = -Math.PI / 2;
      scene.add(hitRing);

      /* Upright 3 on the south face of aisle 1 — the thing that gets hit. */
      const HIT_X = RACK_X[0] + 2 * BAY;
      const HIT = V3(HIT_X, 0.45, -1.62);

      const S = {
        s: 0, v: 1, stop: 0, hitAt: -99, hitDone: false, clock: 0,
        lastAisle: "", lastZone: null as Zone | null | undefined, over: false, time: 0,
      };
      let logId = 0;
      const pushLog = (txt: string) => {
        const mm = String(Math.floor(S.clock / 60) % 60).padStart(2, "0");
        const sec = String(Math.floor(S.clock) % 60).padStart(2, "0");
        const m = modeRef.current;
        const row = { id: logId++, m, t: mm + ":" + sec, txt };
        /* Rows carry the answer that produced them and are filtered on render,
           so switching tabs empties the log without a setState in an effect —
           the log belongs to the answer, not to the section. */
        setLog((prev) => [row, ...prev.filter((r) => r.m === m)].slice(0, 4));
      };

      /* ── the speed graph ──
         A rolling window of (time, speed, zone limit), drawn right to left:
         now at the right edge, the last WINDOW seconds behind it. Speed is a
         proportion of the open-aisle pace, like the rest of this section — no
         units, no figures. */
      const WINDOW = 9, GW = 300, GT = 32, GB = 118;
      const samples: { t: number; v: number; lim: number }[] = [];
      const gy = (v: number) => GB - (clamp(v, 0, 1.15) / 1.15) * (GB - GT);
      const drawGraph = (now: number) => {
        const spd = spdRef.current, area = areaRef.current, over = overRef.current, clip = clipRef.current;
        if (!spd || !area || !over || !clip || samples.length < 2) return;
        const gx = (t: number) => GW - ((now - t) / WINDOW) * GW;
        let d = "", c = "";
        samples.forEach((p, i) => {
          const x = gx(p.t).toFixed(1), y = gy(p.v).toFixed(1), ly = gy(p.lim).toFixed(1);
          d += (i ? "L" : "M") + x + " " + y;
          c += (i ? "L" : "M") + x + " " + ly;
        });
        const x0 = gx(samples[0].t).toFixed(1), xN = gx(samples[samples.length - 1].t).toFixed(1);
        spd.setAttribute("d", d);
        over.setAttribute("d", d);
        area.setAttribute("d", d + "L" + xN + " " + GB + "L" + x0 + " " + GB + "Z");
        // The zone limit is not drawn, only used to clip: whatever part of the
        // trace is above it shows red.
        clip.setAttribute("d", c + "L" + xN + " 0L" + x0 + " 0Z");
      };

      /** Hand the scene back to the start of whichever answer is now selected. */
      const reset = (m: LidarMode) => {
        samples.length = 0;
        S.hitDone = false;
        S.over = false;
        trailCount = 0;
        trail.geometry.setDrawRange(0, 0);
        S.lastAisle = "";
        S.lastZone = null;
        // Start the crash run early on the straight, so the drift has room.
        if (m === "impact" && !reduceMotion) S.s = LEN * 0.06;
      };
      resetRef.current = reset;
      cleanups.push(() => {
        resetRef.current = null;
      });

      const aisleName = (x: number, z: number) => {
        if (x > 9) return "Dock";
        if (x < -11.3) return "West cross-aisle";
        return Math.abs(z) < 1.6 ? "Aisle 1" : Math.abs(z - 4.5) < 1.6 ? "Aisle 2" : "Cross-aisle";
      };
      const bayOf = (x: number) => clamp(Math.floor((x - RACK_X[0]) / BAY) + 1, 1, 7);

      const pos = V3(), tan = V3(), ndc = V3(), look = V3(), tmp = V3();
      let camAng = -0.55;
      let drag: { x: number } | null = null;
      let readT = 0;

      const onDown = (ev: PointerEvent) => {
        if ((ev.target as HTMLElement).closest(".lidar-seg")) return;
        drag = { x: ev.clientX };
        stage.setPointerCapture(ev.pointerId);
      };
      const onMove = (ev: PointerEvent) => {
        if (!drag) return;
        camAng -= (ev.clientX - drag.x) * 0.006;
        drag = { x: ev.clientX };
      };
      const endDrag = () => {
        drag = null;
      };
      stage.addEventListener("pointerdown", onDown);
      stage.addEventListener("pointermove", onMove);
      stage.addEventListener("pointerup", endDrag);
      stage.addEventListener("pointercancel", endDrag);
      cleanups.push(() => {
        stage.removeEventListener("pointerdown", onDown);
        stage.removeEventListener("pointermove", onMove);
        stage.removeEventListener("pointerup", endDrag);
        stage.removeEventListener("pointercancel", endDrag);
      });

      /* Still poses for reduced motion: mid-aisle with a trail already laid,
         inside the walkway zone, and at the moment of impact. The picture has
         to make each point without moving. */
      const uAtX = (x: number) => {
        let best = 0, bd = 1e9;
        for (let i = 0; i < 600; i++) {
          const q = i / 600;
          path.getPointAt(q, pos);
          path.getTangentAt(q, tan);
          if (tan.x > 0.8 && Math.abs(pos.z) < 1) {
            const d = Math.abs(pos.x - x);
            if (d < bd) { bd = d; best = q; }
          }
        }
        return best;
      };
      const POSE: Record<LidarMode, number> = { position: uAtX(2.5), speed: uAtX(-0.4), impact: uAtX(HIT_X) };

      const frame = (dt: number) => {
        const m = modeRef.current;
        S.time += dt;
        S.clock += dt;

        if (reduceMotion) {
          S.s = LEN * POSE[m];
          S.v = m === "speed" ? 0.62 : 0.8;
          if (m === "position" && trailCount < trailN) {
            for (let i = 0; i < trailN; i++) {
              path.getPointAt(((POSE.position - i * 0.0009) % 1 + 1) % 1, tmp);
              trailPos[i * 3] = tmp.x;
              trailPos[i * 3 + 1] = 0.05;
              trailPos[i * 3 + 2] = tmp.z;
            }
            trailCount = trailN;
            trail.geometry.setDrawRange(0, trailN);
            trail.geometry.attributes.position.needsUpdate = true;
          }
          if (m === "impact") {
            S.hitAt = S.time - 0.45;
            S.hitDone = true;
            U.uHit.value.copy(HIT);
            U.uHitT.value = S.time - 0.45;
          }
        }

        const u = (S.s % LEN) / LEN;
        path.getPointAt(u, pos);
        path.getTangentAt(u, tan);

        /* Crash: on the aisle-1 straight the truck drifts toward the rack on a
           bell curve centred on the upright, touches it, stops, and pulls away.
           The drift is what makes it read as a mistake rather than a teleport. */
        let lateral = 0;
        if (m === "impact" && tan.x > 0.8 && Math.abs(pos.z) < 1) {
          const k = Math.exp(-Math.pow((pos.x - HIT_X) / 2.2, 2));
          lateral = -1.02 * k;
          if (!S.hitDone && Math.abs(pos.x - HIT_X) < 0.12) {
            S.hitDone = true;
            S.hitAt = S.time;
            S.stop = 1.4;
            U.uHit.value.copy(HIT);
            U.uHitT.value = S.time;
            pushLog("Impact · rack A, upright 3 · operator verified at start");
          }
        }
        if (m === "impact" && tan.x < -0.5) S.hitDone = false;
        pos.z += lateral;

        const zone = zoneAt(pos.x, pos.z);
        /* In every mode but speed the truck slows for a zone *before* it gets
           there, as a driver would; in speed it reacts late, which is the whole
           reason the overspeed is worth logging. */
        const ahead = V3().copy(pos).addScaledVector(tan, m === "speed" ? 0.2 : 2.2);
        const zAhead = zoneAt(ahead.x, ahead.z);
        let target = zAhead || zone ? (zAhead || zone)!.limit : 1;
        if (m === "speed") target = zone ? zone.limit : 1;
        if (S.stop > 0) {
          S.stop -= dt;
          target = 0;
        }
        const rate = m === "speed" && zone && S.v > target ? 0.35 : 1.4;
        S.v += (target - S.v) * Math.min(1, dt * rate);
        if (!reduceMotion) S.s += S.v * dt * 3.1;

        truck.position.copy(pos);
        truck.rotation.y = Math.atan2(-tan.x, -tan.z);
        if (mountsL) {
          truck.localToWorld(tmp.copy(mountsL.lidar));
          U.uO.value.copy(tmp);
        } else U.uO.value.set(pos.x, 2.3, pos.z);
        U.uAng.value = reduceMotion ? Math.atan2(tan.z, tan.x) + 2.2 : S.time * 3.2;
        U.uTime.value = S.time;
        U.uScale.value = (stage.clientHeight / (2 * Math.tan((cam.fov * Math.PI) / 360))) * R.getPixelRatio();

        const zOp = m === "speed" ? 1 : 0;
        for (const z of ZONES) {
          z.mesh.material.opacity += (zOp * 0.16 - z.mesh.material.opacity) * Math.min(1, dt * 4);
          z.edge.material.opacity += (zOp * 0.8 - z.edge.material.opacity) * Math.min(1, dt * 4);
        }
        trail.material.opacity += ((m === "position" ? 0.95 : 0) - trail.material.opacity) * Math.min(1, dt * 4);
        if (!reduceMotion && (trailTick += dt) > 0.06) {
          trailTick = 0;
          trailPos.copyWithin(3, 0, (trailN - 1) * 3);
          trailPos[0] = pos.x;
          trailPos[1] = 0.05;
          trailPos[2] = pos.z;
          trailCount = Math.min(trailN, trailCount + 1);
          trail.geometry.setDrawRange(0, trailCount);
          trail.geometry.attributes.position.needsUpdate = true;
        }

        const age = S.time - S.hitAt;
        hitRing.material.opacity = m === "impact" && age < 2.2 ? (1 - age / 2.2) * 0.9 : 0;
        hitRing.position.set(HIT.x, 0.04, HIT.z);
        hitRing.scale.setScalar(0.3 + age * 2.2);

        /* Camera: above and behind, easing after the truck, drag to orbit. */
        look.lerp(pos, Math.min(1, dt * 2.4));
        if (look.lengthSq() === 0) look.copy(pos);
        if (!drag && !reduceMotion) camAng += dt * 0.04;
        const dist = stage.clientWidth < 600 ? 22 : 17;
        cam.position.set(look.x + Math.sin(camAng) * dist * 0.5, dist * 0.9, look.z + Math.cos(camAng) * dist * 0.5);
        cam.lookAt(look.x, 0.6, look.z);

        /* speed graph, every frame */
        if (m === "speed") {
          const lim = zone ? zone.limit : 1;
          const last = samples[samples.length - 1];
          if (!last || S.time - last.t > 1 / 40) samples.push({ t: S.time, v: S.v, lim });
          while (samples.length && samples[0].t < S.time - WINDOW - 0.5) samples.shift();
          drawGraph(S.time);
        }

        /* tags, every frame — they ride a moving truck */
        const w = stage.clientWidth, h = stage.clientHeight;
        const place = (t: HTMLElement | null, v: THREE_NS.Vector3, op: number) => {
          if (!t) return;
          ndc.copy(v).project(cam);
          const vis = ndc.z < 1 && op > 0;
          t.style.opacity = vis ? String(op) : "0";
          t.style.transform =
            `translate(${((ndc.x * 0.5 + 0.5) * w).toFixed(1)}px,${((-ndc.y * 0.5 + 0.5) * h).toFixed(1)}px)`;
        };
        const aisle = aisleName(pos.x, pos.z);
        const truckTag = truckTagRef.current;
        if (truckTag) {
          let tsub = "";
          if (m === "position") tsub = aisle + (aisle.startsWith("Aisle") ? " · bay " + bayOf(pos.x) : "");
          if (m === "speed")
            tsub = zone
              ? S.v > zone.limit + 0.04
                ? "Over the " + zone.name.toLowerCase() + " limit"
                : "Within " + zone.name.toLowerCase() + " limit"
              : "Open aisle";
          if (m === "impact") tsub = age < 3 ? "Impact recorded" : "Operator verified";
          const sub = truckTag.querySelector("span");
          if (sub) sub.textContent = tsub;
          truckTag.classList.toggle(
            "alert",
            (m === "speed" && !!zone && S.v > zone.limit + 0.04) || (m === "impact" && age < 3),
          );
        }
        place(truckTag, tmp.set(pos.x, 3.3, pos.z), 1);
        ZONES.forEach((z, i) =>
          place(zoneTagRefs.current[i], tmp.set((z.x[0] + z.x[1]) / 2, 0.1, (z.z[0] + z.z[1]) / 2), m === "speed" ? 1 : 0),
        );
        place(hitTagRef.current, tmp.set(HIT.x, 0.2, HIT.z - 1.2), m === "impact" && age < 3.5 ? 1 : 0);
        /* the read-out, four times a second */
        if ((readT += dt) > 0.25) {
          readT = 0;
          let st = "", sub = "", cls = "";
          if (m === "position") {
            st = aisle;
            sub = aisle.startsWith("Aisle")
              ? "Bay " + bayOf(pos.x) + ", heading " +
                (tan.x > 0.5 ? "east" : tan.x < -0.5 ? "west" : tan.z > 0 ? "north" : "south") + "."
              : "Crossing between aisles.";
            if (aisle !== S.lastAisle) {
              if (S.lastAisle) pushLog("Truck 07 → " + aisle);
              S.lastAisle = aisle;
            }
          }
          if (m === "speed") {
            const lim = zone ? zone.limit : 1;
            const over = S.v > lim + 0.04;
            st = zone ? zone.name + " zone" : "Open aisle";
            sub = over
              ? "Over the zone limit — logged with place and driver."
              : "Within the limit for this zone.";
            cls = over ? "alert" : zone ? "warn" : "";
            if (over && !S.over) pushLog("Overspeed · " + (zone ? zone.name.toLowerCase() + " zone" : "open aisle") + " · Truck 07");
            S.over = over;
            if (zone !== S.lastZone) {
              if (zone) pushLog("Entered " + zone.name.toLowerCase() + " zone");
              S.lastZone = zone;
            }
          }
          if (m === "impact") {
            const recent = age < 3;
            st = recent ? "Impact recorded" : "Driving";
            sub = recent
              ? "Rack A, upright 3 — saved with the place and the operator."
              : "Watching the space around the truck.";
            cls = recent ? "alert" : "";
          }
          setRead({ state: st, sub, cls });
        }

        R.render(scene, cam);
      };

      const resize = () => {
        const w = stage.clientWidth, h = stage.clientHeight;
        if (!w || !h) return;
        R.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        R.setSize(w, h, false);
        cam.aspect = w / h;
        cam.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(stage);
      resize();
      reset(modeRef.current);

      let running = false, last = 0;
      const loop = (t: number) => {
        if (!running || disposed) {
          raf = 0;
          return;
        }
        raf = requestAnimationFrame(loop);
        const dt = Math.min(0.05, (t - last) / 1000 || 0);
        last = t;
        frame(dt);
      };
      const io = new IntersectionObserver(
        ([en]) => {
          running = en.isIntersecting;
          if (running && !raf) {
            last = performance.now();
            raf = requestAnimationFrame(loop);
          }
        },
        { rootMargin: "80px" },
      );
      io.observe(stage);

      cleanups.push(() => {
        running = false;
        io.disconnect();
        ro.disconnect();
        R.dispose();
      });
    })().catch((err) => {
      console.warn("Sensor Stack: LiDAR view unavailable —", err);
      setNoGl(true);
    });

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  /* A tab switch hands the scene back to the start of that answer, so each one
     is read from its own beginning. Nothing is set here: the log clears itself
     (its rows carry their mode) and the graph only renders under speed, where
     the scene's reset has already emptied its samples. */
  useEffect(() => {
    modeRef.current = mode;
    resetRef.current?.(mode);
  }, [mode]);

  const copy = LIDAR_COPY[mode];
  const onTabKey = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const i = LIDAR_TABS.findIndex((t) => t.mode === mode);
    const next = LIDAR_TABS[(i + d + LIDAR_TABS.length) % LIDAR_TABS.length];
    onMode(next.mode);
    document.getElementById("lt-" + next.mode)?.focus();
  };

  return (
    <section className="section dark" id="lidar">
      <div className="wrap">
        <Head
          label="Location · Speed · Impact Detection"
          top="One LiDAR layer."
          bottom="Three answers."
          intro="The LiDAR sees the space around the truck in 3D, many times a second. From that one picture the truck knows where it is, how fast it’s going — and the moment it touches something it shouldn’t."
        />

        <Reveal className="lidar">
          <div ref={stageRef} className={"lidar-stage" + (noGl ? " no-gl" : "")}>
            <canvas
              ref={canvasRef}
              role="img"
              aria-label="A live LiDAR point cloud of a warehouse, with a forklift driving through it. The view switches between its position, its speed against zone limits, and an impact with a rack."
            />
            <div className="lidar-hud" aria-hidden>
              <i />
              LIDAR · SIMULATED VIEW
            </div>

            <div aria-hidden>
              <div className="lidar-tag" ref={truckTagRef}>
                <div className="in">
                  <b>Truck 07</b>
                  <span />
                </div>
              </div>
              <div className="lidar-tag alert" ref={hitTagRef}>
                <div className="in">
                  <b>Impact</b>
                  <span>Rack A · upright 3</span>
                </div>
              </div>
              {["Walkway", "Dock"].map((n, i) => (
                <div
                  key={n}
                  className="lidar-tag"
                  ref={(el) => {
                    zoneTagRefs.current[i] = el;
                  }}
                >
                  <div className="in">
                    <b>{n} zone</b>
                    <span>{n === "Dock" ? "Lowest limit" : "Slow limit"}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="lidar-seg" role="tablist" aria-label="What the LiDAR shows" onKeyDown={onTabKey}>
              {LIDAR_TABS.map((t) => (
                <button
                  key={t.mode}
                  id={"lt-" + t.mode}
                  type="button"
                  role="tab"
                  aria-selected={mode === t.mode}
                  tabIndex={mode === t.mode ? 0 : -1}
                  onClick={() => onMode(t.mode)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="lfb">
              The live LiDAR view needs WebGL.
              <br />
              Every truck’s position, speed and impacts still land in the RAMS Digital Twin.
            </div>
          </div>

          <aside className="lidar-read" aria-live="polite">
            <span className="k">{copy.k}</span>
            <h3>{copy.h}</h3>
            <p>{copy.p}</p>
            <div className="live">
              <div className={"lr-state " + read.cls}>
                <i />
                <span>{read.state}</span>
              </div>
              <p className="lr-sub">{read.sub}</p>

              {mode === "speed" && (
                <div className={"sgraph " + read.cls}>
                  <svg viewBox="0 0 300 136" role="img" aria-label="Live graph of the truck's speed against the limit for the zone it is in">
                    <defs>
                      <clipPath id={clipId}>
                        <path ref={clipRef} />
                      </clipPath>
                      <linearGradient id={clipId + "g"} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0" stopColor="#30d158" stopOpacity=".28" />
                        <stop offset="1" stopColor="#30d158" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[32, 60.7, 89.3, 118].map((y) => (
                      <line key={y} className="grid" x1="0" x2="300" y1={y} y2={y} />
                    ))}
                    <path ref={areaRef} fill={`url(#${clipId}g)`} />
                    <path ref={spdRef} className="spd" />
                    <path ref={overRef} className="over" clipPath={`url(#${clipId})`} />
                    <text className="ax" x="2" y="10">
                      Speed
                    </text>
                    <text className="ax" x="2" y="132">
                      Time
                    </text>
                    <text className="ax" x="298" y="132" textAnchor="end">
                      Now
                    </text>
                  </svg>
                </div>
              )}

              <ul className="lr-log">
                {log
                  .filter((r) => r.m === mode)
                  .map((r) => (
                    <li key={r.id}>
                      <b>{r.t}</b>
                      <span>{r.txt}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </aside>
        </Reveal>

        <div className="lidar-facts">
          {LIDAR_FACTS.map((f, i) => (
            <Reveal key={f.b} delay={i * 60}>
              <b>{f.b}</b>
              <span>{f.s}</span>
            </Reveal>
          ))}
        </div>

        <p className="note">{LIDAR_NOTE}</p>

      </div>
    </section>
  );
}
