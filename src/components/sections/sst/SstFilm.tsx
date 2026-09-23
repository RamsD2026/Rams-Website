"use client";

import { useEffect, useRef, useState } from "react";
import type * as THREE_NS from "three";
import { createSstKit, loadFork, type DevKey, type Mounts } from "./sst-3d";

/**
 * The hero film — the four sensors, then the truck, then the LiDAR chapter.
 *
 * A fixed canvas behind fixed type, driven entirely by how far the page has been
 * scrolled. Four chapters over one scroll track:
 *
 *   p 0.00–0.20  the four devices in a lineup, under the headline
 *   p 0.24–0.45  "Four units. Six senses." — the row turns to face the orbiting
 *                camera, each unit with a name tag pinned under it
 *   p 0.40–0.54  the handover: the lineup fades as the truck rises into frame
 *   p 0.50–0.80  "One LiDAR layer. Three answers." — the room fills with a
 *                point cloud sweeping out from the truck's own LiDAR, and the
 *                canvas washes to near-black under it
 *   p 0.85–1.00  "Know every truck." — back to the opening frame
 *
 * ── Why it opens on the lineup, not the truck ───────────────────────
 * It opened on a finished forklift, which answered a question the page had not
 * asked yet and quietly made the stack look like one fitted product. It is not:
 * the whole argument of this page is that you buy the sensors that answer your
 * question and add the rest later. So the film now opens the way the OmniBox
 * film opens on its four boxes — the family first, the thing you bolt them to
 * second. The truck is still the subject from the LiDAR chapter on, where the
 * point is precisely that these units are mounted on a moving vehicle.
 *
 * ── Why the sensors are placed by the model, not by hand ────────────
 * `mountsOf()` reads the GLB's own named parts, so the Access Control unit is on
 * the rider panel, the pallet sensor is on the lift carriage, the LiDAR is on
 * the roof and the battery chip is at the battery — because that is where
 * they are on the model, not because five vectors were typed in until they
 * looked right. It also means the halos and the tags point at the real thing.
 *
 * ── The LiDAR chapter dims the page ─────────────────────────────────
 * `R.setClearColor(0x06080a, ch3 * .96)` fades the canvas itself to near-black
 * as chapter three comes in, and `.film.dark-bg` flips the fixed type to its
 * light colours over it. The cloud has to be read against black; a point cloud
 * on `#F5F5F7` is invisible. That is the one moment the page goes dark under
 * the type rather than in a section of its own.
 *
 * ── If it cannot run ────────────────────────────────────────────────
 * Ten seconds without a WebGL2 context, or any throw, and `onUnavailable()`
 * puts the page into `.no-film`: this whole track is removed, `SstHero` takes
 * its place, and the page reads as an ordinary hero with a photograph. That is
 * the reference's own designed state.
 */

/** The four devices: the lineup in chapter two, and where they mount later. */
const TAGS: { k: DevKey; name: string; tag: string }[] = [
  { k: "access", name: "Access Control", tag: "Who can drive" },
  { k: "lidar", name: "LiDAR", tag: "Location, Speed, Impact detection" },
  { k: "pds", name: "Pallet Detection", tag: "What’s on the forks" },
  { k: "bms", name: "Battery Management", tag: "Charge and health" },
];

const ss = (t: number) => t * t * (3 - 2 * t);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1);

export function SstFilm({ onUnavailable }: { onUnavailable: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const spaceRef = useRef<HTMLDivElement>(null);
  const secRefs = useRef<(HTMLElement | null)[]>([]);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (failed) return;
    const canvas = canvasRef.current;
    const film = filmRef.current;
    const tagsRoot = tagsRef.current;
    const space = spaceRef.current;
    if (!canvas || !film || !tagsRoot || !space) return;

    let disposed = false;
    let raf = 0;
    const cleanups: (() => void)[] = [];
    const giveUp = () => {
      if (disposed) return;
      setFailed(true);
      onUnavailable();
    };
    const bail = window.setTimeout(giveUp, 10000);
    cleanups.push(() => clearTimeout(bail));

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
        giveUp();
        return;
      }
      kit.setupRenderer(R);
      clearTimeout(bail);

      const scene = await kit.makeScene(R, 6);
      if (disposed) {
        R.dispose();
        return;
      }
      const cam = new THREE.PerspectiveCamera(30, 1, 0.05, 200);
      const truck = new THREE.Group();
      scene.add(truck);
      /* Hidden until the LiDAR chapter — the film now opens on the sensors
         themselves, not on the truck they end up bolted to. */
      truck.visible = false;

      /* ── the lineup ──────────────────────────────────────────────
         Four devices standing in a row, the way the OmniBox film opens on its
         four boxes. The page's argument is that the stack is modular — you buy
         the sensors that answer your question, not a fitted truck — and opening
         on a finished forklift undercut that before the first section.

         Materials are cloned per mesh. `createSstKit` builds its materials once
         and every `DEV.*()` call shares them, so fading the lineup by setting
         `material.opacity` would fade the same units where they sit on the
         truck in chapter three. */
      const lineup = new THREE.Group();
      scene.add(lineup);
      const lineMats: THREE_NS.Material[] = [];
      const LINEUP_LIDAR = 1.35;
      const lineItems = TAGS.map((t) => {
        const d = kit.DEV[t.k]();
        d.group.traverse((o) => {
          const mesh = o as THREE_NS.Mesh;
          if (!mesh.isMesh) return;
          const one = (m: THREE_NS.Material) => {
            const c = m.clone();
            c.transparent = true;
            lineMats.push(c);
            return c;
          };
          mesh.material = Array.isArray(mesh.material)
            ? mesh.material.map(one)
            : one(mesh.material as THREE_NS.Material);
          mesh.castShadow = !isMobile;
        });
        /* The PDS swaps to the real CAD model once it has loaded — same group,
           so its place in the row is kept, and the same material cloning so
           the lineup's fade still leaves the truck's unit alone. */
        if (kit.hasDevGlb(t.k)) {
          void kit.upgradeInPlace(d, t.k, (mesh) => {
            const one = (m: THREE_NS.Material) => {
              const c = m.clone();
              c.transparent = true;
              lineMats.push(c);
              return c;
            };
            mesh.material = Array.isArray(mesh.material) ? mesh.material.map(one) : one(mesh.material);
            mesh.castShadow = !isMobile;
          });
        }
        /* The LiDAR is the smallest unit by far and read as an afterthought in
           the row, so the lineup — only the lineup — shows it at about the
           PDS's size. The viewer and the truck keep it true to scale. */
        if (t.k === "lidar") {
          d.group.scale.setScalar(LINEUP_LIDAR);
          return { k: t.k, g: d.group, size: d.size.clone().multiplyScalar(LINEUP_LIDAR) };
        }
        return { k: t.k, g: d.group, size: d.size };
      });

      /* Laid out along X on a common centre line, spaced by each unit's own
         width so the larger ones get the room they need. The row is then scaled
         as a group, not per device: scaling each one to a common size would
         flatten the differences between them, and those differences are real
         product information. */
      {
        const GAP = 0.09;
        const total = lineItems.reduce((n, it) => n + it.size.x, 0) + GAP * (lineItems.length - 1);
        let x = -total / 2;
        for (const it of lineItems) {
          it.g.position.set(x + it.size.x / 2, 0, 0);
          /* The board is flat: stood level it is a sliver edge-on to this
             camera. Tilted up to face it, lifted so its front edge still
             touches the ground. */
          if (it.k === "bms") {
            it.g.rotation.x = 1.05;
            it.g.position.y = (it.size.z / 2) * Math.sin(1.05);
          }
          x += it.size.x + GAP;
          lineup.add(it.g);
        }
        /* Sized and placed to OmniFilm's composition, because that one is known
           to sit clear of the headline at every aspect: the row spans ~9 units
           and stands on the ground, while its camera looks at a point 2.2 above
           it. Do not lift this to the camera target — that is exactly what put
           the devices behind the type the first time. */
        lineup.scale.setScalar(9 / Math.max(total, 1e-6));
        lineup.position.y = 0;
      }

      const cloud = new THREE.Points(kit.buildCloud(0.55), kit.cloudMaterial());
      cloud.rotation.y = Math.PI / 2;
      scene.add(cloud);
      cloud.material.uniforms.uRange.value = 13;
      cloud.material.uniforms.uSize.value = 0.06;

      /* The orange glow under each sensor, so the eye finds five small things
         on a large truck. A sprite, so it faces the camera at every angle. */
      const halo = (() => {
        const c = document.createElement("canvas");
        c.width = c.height = 128;
        const x = c.getContext("2d")!;
        const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
        g.addColorStop(0, "rgba(255,138,61,.95)");
        g.addColorStop(0.35, "rgba(255,106,0,.45)");
        g.addColorStop(1, "rgba(255,106,0,0)");
        x.fillStyle = g;
        x.fillRect(0, 0, 128, 128);
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
      })();

      const halos: Partial<Record<DevKey, THREE_NS.Sprite>> = {};
      const anchors: Partial<Record<DevKey, THREE_NS.Vector3>> = {};
      let mounts: Mounts | null = null;

      loadFork()
        .then((src) => {
          if (disposed) return;
          const f = kit.fitFork(src);
          truck.add(f);
          mounts = kit.mountsOf(f);

          /* `mountsOf` measures world-space bounding boxes, but every device
             below is added as a child of `truck` — so the numbers have to be
             converted or they are read as local coordinates under whatever
             transform `truck` is carrying.

             That used to be none. The lineup handover now scales `truck` to
             0.94 and lifts it as it rises into frame, and a world point used
             as a local one under that lands the LiDAR inside the cab instead
             of on top of the overhead guard. */
          truck.updateMatrixWorld(true);
          for (const k of ["access", "lidar", "pds", "bms"] as const) {
            truck.worldToLocal(mounts[k]);
          }
          for (const t of TAGS) {
            const d = kit.DEV[t.k]();
            // The chip is tiny next to a forklift, so it is drawn larger than
            // life — the film is making the point that it is there at all.
            d.group.scale.setScalar(t.k === "bms" ? 2.4 : 1.5);
            d.group.position.copy(mounts[t.k]);
            // Upright on the carriage face, windows looking down the forks (−Z);
            // the TF-Lunas inside it aim 45° down.
            if (t.k === "pds") d.group.rotation.y = Math.PI;
            if (kit.hasDevGlb(t.k)) {
              void kit.upgradeInPlace(d, t.k, (mesh) => {
                mesh.castShadow = !isMobile;
              });
            }
            if (t.k === "access") d.group.rotation.set(-0.5, Math.PI, 0);
            truck.add(d.group);
            anchors[t.k] = mounts[t.k].clone();

            const sp = new THREE.Sprite(
              new THREE.SpriteMaterial({
                map: halo, transparent: true, depthWrite: false, depthTest: false,
                blending: THREE.AdditiveBlending, opacity: 0,
              }),
            );
            sp.scale.setScalar(0.55);
            sp.position.copy(mounts[t.k]);
            truck.add(sp);
            halos[t.k] = sp;
          }
        })
        .catch((e) => console.warn("Sensor Stack: forklift unavailable —", e));

      /* Camera keyframes: [p, position, target]. Chapter three pulls up and
         back, because the cloud is 28 m of warehouse and the truck is 2.3 m. */
      const KW: [number, THREE_NS.Vector3, THREE_NS.Vector3][] = [
        [0, V3(7.4, 3.6, -8.1), V3(0, 2.65, 0)],
        [0.2, V3(7.4, 3.6, -8.1), V3(0, 2.65, 0)],
        [0.4, V3(-10.2, 4.4, 3.4), V3(0, 1.75, 0)],
        [0.56, V3(-8.5, 8.5, 10.5), V3(0, 0.6, 0)],
        [0.8, V3(6, 9, 11), V3(0, 0.6, 0)],
        [0.94, V3(7.4, 3.6, -8.1), V3(0, 2.65, 0)],
        [1, V3(7.4, 3.6, -8.1), V3(0, 2.65, 0)],
      ];
      /* The lineup's own rails, modelled on the OmniBox film's: straight on,
         well back, looking above the row. Blended into `KW` across the handover
         so the move to the truck is one continuous camera rather than a cut. */
      const KL: [number, THREE_NS.Vector3, THREE_NS.Vector3][] = [
        [0, V3(0, 4.4, 17), V3(0, 2.2, 0)],
        [0.2, V3(0, 4.4, 17), V3(0, 2.2, 0)],
        [0.4, V3(2.4, 4.0, 15.5), V3(0, 2.0, 0)],
        [1, V3(2.4, 4.0, 15.5), V3(0, 2.0, 0)],
      ];
      const camPos = V3(), camTgt = V3(), linePos = V3(), lineTgt = V3(), ndc = V3(), wp = V3();
      const keyed = (
        keys: [number, THREE_NS.Vector3, THREE_NS.Vector3][],
        p: number,
        outP: THREE_NS.Vector3,
        outT: THREE_NS.Vector3,
      ) => {
        let i = 0;
        while (i < keys.length - 2 && p > keys[i + 1][0]) i++;
        const [a, pa, ta] = keys[i], [b, pb, tb] = keys[i + 1];
        const t = ss(seg(p, a, b));
        outP.lerpVectors(pa, pb, t);
        outT.lerpVectors(ta, tb, t);
      };

      const state = { p: 0, pT: 0, time: 0, drag: 0, dragT: 0, dragging: false, px: 0, placed: false };
      const secs = secRefs.current
        .filter(Boolean)
        .map((el) => ({ el: el as HTMLElement, a: +(el as HTMLElement).dataset.a!, b: +(el as HTMLElement).dataset.b! }));

      const maxScroll = () => Math.max(1, space.offsetHeight - window.innerHeight);
      const onScroll = () => {
        state.pT = clamp(window.scrollY / maxScroll(), 0, 1);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      cleanups.push(() => window.removeEventListener("scroll", onScroll));

      /* Drag turns the sensors in the lineup, each on its own axis — not the
         camera, which is on rails, and not the truck. */
      const onDown = (e: PointerEvent) => {
        state.dragging = true;
        state.px = e.clientX;
        canvas.setPointerCapture(e.pointerId);
      };
      const onMove = (e: PointerEvent) => {
        if (!state.dragging) return;
        state.dragT += (e.clientX - state.px) * 0.006;
        state.px = e.clientX;
      };
      const endDrag = () => {
        state.dragging = false;
      };
      canvas.addEventListener("pointerdown", onDown);
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerup", endDrag);
      canvas.addEventListener("pointercancel", endDrag);
      canvas.style.cursor = "grab";
      cleanups.push(() => {
        canvas.removeEventListener("pointerdown", onDown);
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerup", endDrag);
        canvas.removeEventListener("pointercancel", endDrag);
      });

      let lastOp = -1;
      const frame = (dt: number) => {
        state.p += (state.pT - state.p) * Math.min(1, dt * (reduceMotion ? 20 : 4));
        const p = state.p;
        state.time += dt;
        state.drag += (state.dragT - state.drag) * Math.min(1, dt * 6);

        /* How far the handover has run. Computed here rather than lower down
           because the camera has to blend with it: the lineup and the truck
           need different framing and a cut between them would be jarring. */
        const truckIn = ss(seg(p, 0.44, 0.54));

        keyed(KW, p, camPos, camTgt);
        if (truckIn < 0.999) {
          keyed(KL, p, linePos, lineTgt);
          camPos.lerpVectors(linePos, camPos, truckIn);
          camTgt.lerpVectors(lineTgt, camTgt, truckIn);
        }
        /* Same clearance guard as the Guided Inspection film: in the opening
           and closing chapters the type owns the middle of the screen, so the
           camera target is lifted by a fraction of the visible frame height and
           the subject drops into the lower third. A fraction rather than a
           fixed offset, so it holds at any viewport. */
        const heroHold = (1 - ss(seg(p, 0.14, 0.26))) + ss(seg(p, 0.9, 0.97));
        if (heroHold > 0.001) {
          const frameH = 2 * camPos.distanceTo(camTgt) * Math.tan((cam.fov * Math.PI) / 360);
          camTgt.y += Math.min(1, heroHold) * frameH * 0.18;
        }

        /* Pull the camera back on a narrow viewport rather than change the
           keyframes: the truck is long, and a portrait phone crops it. */
        const a = cam.aspect;
        const push = a < 1 ? clamp(1.05 / a, 1.2, 2.1) : clamp(1.6 / a, 1, 1.5);
        camPos.sub(camTgt).multiplyScalar(push).add(camTgt);
        if (!state.placed) {
          cam.position.copy(camPos);
          state.placed = true;
        }
        cam.position.lerp(camPos, Math.min(1, dt * 5));
        cam.lookAt(camTgt);
        // Not tied to the drag: turning the sensors in the lineup must not turn the truck.
        truck.rotation.y = reduceMotion ? 0 : Math.sin(state.time * 0.2) * 0.04;

        const ch2 = ss(seg(p, 0.22, 0.3)) * (1 - ss(seg(p, 0.44, 0.5)));
        const ch3 = ss(seg(p, 0.48, 0.56)) * (1 - ss(seg(p, 0.8, 0.88)));

        /* ── lineup → truck ──────────────────────────────────────────
           The handover, and the one place in this film where two subjects share
           the track. The lineup fades out over 0.40–0.50 and the truck rises in
           over 0.44–0.54, so for a tenth of the track they overlap rather than
           one popping in where the other vanished. Both are driven off the same
           `seg` easing the chapter envelopes use.

           The camera is mid-orbit here and the background is washing to black
           for the point cloud, which is what makes the swap read as a cut in a
           film rather than as a component unmounting. */
        const lineOp = 1 - ss(seg(p, 0.4, 0.5));
        lineup.visible = lineOp > 0.01;
        if (lineup.visible) {
          for (const m of lineMats) m.opacity = lineOp;
          /* The row turns to face wherever the camera has orbited to, so it is
             never seen edge-on. `KW` swings from +x to −x across chapter two and
             a fixed row would present its own end for half of it. */
          lineup.rotation.y = Math.atan2(cam.position.x - lineup.position.x, cam.position.z - lineup.position.z);
          /* Dragging turns each unit on its own axis, where it stands — as the
             OmniBox film does — not the whole row round like a carousel. */
          lineItems.forEach((it, i) => {
            it.g.rotation.y = (reduceMotion ? 0 : Math.sin(state.time * 0.25 + i * 1.7) * 0.06) + state.drag;
          });
        }

        truck.visible = truckIn > 0.01;
        /* Transform, not opacity: the truck's own materials are shared with the
           hardware viewer, and this is a rise into frame rather than a fade. */
        truck.scale.setScalar(0.94 + truckIn * 0.06);
        truck.position.y = (1 - truckIn) * -0.45;

        const u = cloud.material.uniforms;
        u.uOp.value = ch3;
        u.uTime.value = state.time;
        u.uAng.value = reduceMotion ? 1.2 : state.time * 2.4;
        cloud.visible = ch3 > 0.01;
        R.setClearColor(0x06080a, ch3 * 0.96);
        film.classList.toggle("dark-bg", ch3 > 0.5);
        u.uScale.value = (window.innerHeight / (2 * Math.tan((cam.fov * Math.PI) / 360))) * R.getPixelRatio();
        if (mounts) {
          truck.localToWorld(wp.copy(mounts.lidar));
          u.uO.value.copy(wp);
        }

        lineup.updateMatrixWorld(true);
        /* One baseline for all four tags. Each used to hang half its own unit's
           height below it, so the tall Access Control box dropped its tag far
           below the others. Now every unit's front-bottom edge is projected,
           the lowest one sets the line, and each tag sits on it under its
           unit's centre. */
        let base = -Infinity;
        const tagX: number[] = [];
        lineItems.forEach((item, i) => {
          item.g.getWorldPosition(wp);
          ndc.copy(wp).project(cam);
          tagX[i] = (ndc.x * 0.5 + 0.5) * window.innerWidth;
          wp.y = lineup.position.y;
          wp.z += (item.size.z / 2) * lineup.scale.z;
          ndc.copy(wp).project(cam);
          base = Math.max(base, (-ndc.y * 0.5 + 0.5) * window.innerHeight);
        });
        TAGS.forEach((t, i) => {
          const el = tagRefs.current[i];
          if (!el) return;
          /* The halos existed to find five small things on a large truck. The
             lineup is those same things at full height with nothing else in
             frame, so there is nothing left for them to point out — and the
             truck they are parented to is not on screen during chapter two. */
          const h = halos[t.k];
          if (h) h.material.opacity = 0;

          const item = lineItems[i];
          if (!item) {
            el.style.opacity = "0";
            return;
          }
          el.style.transform = `translate(${tagX[i].toFixed(1)}px,${(base + 28).toFixed(1)}px) translate(-50%,0)`;
          el.style.opacity = (ch2 * lineOp).toFixed(3);
        });

        for (const s of secs) {
          const f = 0.04;
          const o = (s.a === 0 ? 1 : ss(seg(p, s.a, s.a + f))) * (1 - ss(seg(p, s.b - f, s.b)));
          s.el.style.opacity = o.toFixed(3);
          s.el.style.transform = `translateY(${((1 - o) * 14).toFixed(1)}px)`;
          s.el.style.visibility = o < 0.005 ? "hidden" : "visible";
        }

        /* Past the end of the track the whole film fades out over 60% of a
           viewport, handing the page to the document underneath. */
        const past = Math.max(0, (window.scrollY - maxScroll()) / Math.max(1, window.innerHeight * 0.6));
        const op = 1 - Math.min(1, past);
        if (Math.abs(op - lastOp) > 0.004) {
          lastOp = op;
          const vis = op < 0.01 ? "hidden" : "visible";
          for (const el of [film, tagsRoot, canvas as HTMLElement]) {
            el.style.opacity = op.toFixed(3);
            el.style.visibility = vis;
          }
        }
        if (op >= 0.01) R.render(scene, cam);
      };

      const resize = () => {
        R.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
        R.setSize(window.innerWidth, window.innerHeight, false);
        cam.aspect = window.innerWidth / window.innerHeight;
        cam.updateProjectionMatrix();
      };
      window.addEventListener("resize", resize);
      resize();
      cleanups.push(() => window.removeEventListener("resize", resize));

      let last = performance.now();
      const tick = (t: number) => {
        if (disposed) return;
        raf = requestAnimationFrame(tick);
        const dt = Math.min(0.05, (t - last) / 1000 || 0);
        last = t;
        frame(dt);
      };
      raf = requestAnimationFrame(tick);
      cleanups.push(() => R.dispose());
    })().catch((err) => {
      console.warn("Sensor Stack: hero film unavailable —", err);
      giveUp();
    });

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
    };
  }, [failed, onUnavailable]);

  if (failed) return null;

  return (
    <>
      <canvas ref={canvasRef} className="hw-gl" aria-hidden />

      <div className="film" ref={filmRef}>
        <section
          className="sec hero center"
          data-a="0"
          data-b="0.2"
          ref={(el) => {
            secRefs.current[0] = el;
          }}
        >
          <div className="heroblock">
            <p className="kicker">RAMS Digital</p>
            <h1>Sensor Stack</h1>
            <p className="tag">
              Who’s driving, how fast, what it hit, where it is, what’s on the forks —{" "}
              <b>and how the battery is holding up.</b>
            </p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#sensors">
                Meet the sensors
              </a>
              <a className="btn btn-secondary" href="#lidar">
                See the LiDAR
              </a>
            </div>
          </div>
          <div className="scrollcue" aria-hidden>
            Scroll<i />
          </div>
        </section>

        <section
          className="sec top"
          data-a="0.24"
          data-b="0.45"
          ref={(el) => {
            secRefs.current[1] = el;
          }}
        >
          <span className="label">The stack</span>
          <h2>
            Four units.
            <br />
            Six senses.
          </h2>
          <p className="lead">
            Each one answers a single question, and each one can be bought on its own. Together
            they tell you everything that happened on a shift.
          </p>
        </section>

        <section
          className="sec top"
          data-a="0.5"
          data-b="0.8"
          ref={(el) => {
            secRefs.current[2] = el;
          }}
        >
          <span className="label">LiDAR</span>
          <h2>
            One LiDAR layer.
            <br />
            Three answers.
          </h2>
          <p className="lead">
            The truck sees the space around it in 3D — and from that picture knows its speed, its
            place, and the moment it hits something.
          </p>
        </section>

        <section
          className="sec top"
          data-a="0.85"
          data-b="1.08"
          ref={(el) => {
            secRefs.current[3] = el;
          }}
        >
          <h2>
            Know every truck.
            <br />
            Every shift.
          </h2>
          <div className="hero-cta" style={{ justifyContent: "center", marginTop: 28 }}>
            <a className="btn btn-primary" href="#sensors">
              Meet the sensors
            </a>
          </div>
        </section>
      </div>

      <div className="hw-tags" ref={tagsRef} aria-hidden>
        {TAGS.map((t, i) => (
          <div
            key={t.k}
            className="box-tag"
            ref={(el) => {
              tagRefs.current[i] = el;
            }}
          >
            <b>{t.name}</b>
            <span>{t.tag}</span>
          </div>
        ))}
      </div>

      <div className="hw-scrollspace" ref={spaceRef} aria-hidden />
    </>
  );
}
