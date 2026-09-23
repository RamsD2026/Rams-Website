"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type * as THREE_NS from "three";
import { createSstKit, loadFork, type Mounts } from "@/components/sections/sst/sst-3d";
import { ORDER, TECH, type TechKey } from "./loc-data";

/**
 * The hero film — one truck, one building, four ways of knowing where it is.
 *
 * Scroll-driven, like the AI Vision, OmniBox and Sensor Stack heroes, and built
 * from the Sensor Stack's own kit: the same forklift, the same point-cloud
 * warehouse, the real L2 LiDAR on its roof. A 3D hero was tried on this page
 * once and dropped because "a film of an empty shed said less than the floor
 * plan"; the point cloud is the answer to that — the building is drawn as what
 * a sensor sees, not as a shed.
 *
 *   p 0.00–0.16  the headline, the truck driving the aisles
 *   p 0.18–0.34  LiDAR — the sweep lights the building from the truck itself;
 *                the accuracy ring hugs the truck
 *   p 0.36–0.52  UWB — anchors on the walls, ranging lines to a tag on the truck
 *   p 0.54–0.70  Bluetooth — gateways on the rack ends, a wider ring
 *   p 0.72–0.86  Wi-Fi — access points on the ceiling, soft coverage pools
 *   p 0.88–1.00  a plan view straight down: all four rings round the same truck, keyed
 *
 * ── The ring is honest ──────────────────────────────────────────────
 * It is where the system would say the truck could be: the truck's own
 * footprint plus the technology's accuracy (`TECH[k].acc`, metres), drawn at
 * that size on a floor drawn in metres. LiDAR's ±10 mm therefore hugs the truck
 * and Wi-Fi's 5–15 m takes in half an aisle, which is the page's whole
 * argument, made before the reader has scrolled past the hero.
 *
 * ── Figures ─────────────────────────────────────────────────────────
 * Every number is `TECH`'s, and only LiDAR's is a RAMS measurement. The other
 * three chapters say "typical industry range" beside theirs, per the honesty
 * constraint at the head of `loc-data.ts`.
 *
 * ── If it cannot run ────────────────────────────────────────────────
 * Ten seconds without a WebGL2 context, or any throw, and `onUnavailable()`
 * puts the page into `.no-film`: this track goes, and `LocHero` — the 2D floor
 * plan — takes its place.
 */

const ss = (t: number) => t * t * (3 - 2 * t);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1);

/** Where each technology's chapter sits on the track: [in, full, out, gone]. */
const CH: Record<TechKey, [number, number, number, number]> = {
  lidar: [0.15, 0.2, 0.32, 0.37],
  uwb: [0.33, 0.38, 0.5, 0.55],
  ble: [0.51, 0.56, 0.68, 0.73],
  wifi: [0.69, 0.74, 0.84, 0.89],
};
const CLOSE_AT: [number, number] = [0.86, 0.92];
/** The truck's footprint radius: the ring is this plus the accuracy. */
const FOOT = 1.35;

const hex = (s: string) => parseInt(s.slice(1), 16);

export function LocFilm({ onUnavailable }: { onUnavailable: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const spaceRef = useRef<HTMLDivElement>(null);
  const truckTagRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (failed) return;
    const canvas = canvasRef.current, film = filmRef.current, tagsRoot = tagsRef.current, space = spaceRef.current;
    if (!canvas || !film || !tagsRoot || !space) return;

    let disposed = false, raf = 0;
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
      R.setClearColor(0x06080a, 1);
      R.toneMapping = THREE.ACESFilmicToneMapping;
      clearTimeout(bail);

      const scene = new THREE.Scene();
      scene.add(new THREE.HemisphereLight(0xbfd8ff, 0x101418, 1.1));
      const sun = new THREE.DirectionalLight(0xffffff, 1.6);
      sun.position.set(6, 12, 4);
      scene.add(sun);
      const cam = new THREE.PerspectiveCamera(36, 16 / 9, 0.1, 220);

      /* ── the building, as LiDAR returns ──
         Bigger than the Sensor Stack's warehouse, which is built to sit behind
         one truck at close range: seven rack rows over a 44 × 35 m floor, so a
         wide shot reads as a real building. The rows either side of the
         truck's loop run the full length, broken by a cross-aisle; the row
         inside the loop stays short so the truck can turn round its ends.
         Same point shader as the Sensor Stack cloud (`kind` 0 floor, 1
         structure), so the sweep and colours match. */
      const buildWarehouse = (density: number) => {
        const P: number[] = [], K: number[] = [];
        const push = (x: number, y: number, z: number, k: number) => {
          P.push(x, y, z);
          K.push(k);
        };
        const j = () => (Math.random() - 0.5) * 0.03;
        const st = (v: number) => v / Math.sqrt(density);
        const BAY = 2.7;
        for (let x = -22; x <= 22; x += st(0.42)) for (let z = -15; z <= 20; z += st(0.42)) push(x + j() * 4, 0, z + j() * 4, 0);
        const block = (zc: number, x0: number, x1: number) => {
          const bays = Math.max(1, Math.round((x1 - x0) / BAY));
          for (const fz of [zc - 0.6, zc + 0.6]) {
            for (let b = 0; b <= bays; b++) for (let y = 0; y <= 5; y += st(0.08)) push(x0 + b * BAY + j(), y, fz + j(), 1);
            for (const by of [1.5, 3, 4.5]) for (let x = x0; x <= x0 + bays * BAY; x += st(0.1)) push(x, by + j(), fz + j(), 1);
            for (let b = 0; b < bays; b++) {
              for (let lv = 0; lv < 4; lv++) {
                for (let sI = 0; sI < 2; sI++) {
                  // A fifth of the slots left empty, or the racking reads as a wall.
                  if (Math.random() < 0.22) continue;
                  const px0 = x0 + b * BAY + 0.2 + sI * 1.25, py0 = lv * 1.5 + 0.12;
                  for (let px = 0; px <= 1.1; px += st(0.17)) {
                    for (let py = 0; py <= 1.15; py += st(0.17)) push(px0 + px + j(), py0 + py + j(), fz + (fz < zc ? -0.02 : 0.02) + j(), 1);
                  }
                }
              }
            }
          }
        };
        for (const zc of [-11.25, -6.75, -2.25, 6.75, 11.25, 15.75]) {
          block(zc, -19, -2.8);
          block(zc, 0.8, 16.2);
        }
        block(2.25, -9, 7.2);
        for (const wx of [-22, 22]) for (let z = -15; z <= 20; z += st(0.45)) for (let y = 0; y <= 7; y += st(0.45)) push(wx, y + j(), z + j(), 1);
        for (let x = -22; x <= 22; x += st(0.45)) for (let y = 0; y <= 7; y += st(0.45)) push(x + j(), y, -15, 1);
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(P, 3));
        geo.setAttribute("aKind", new THREE.Float32BufferAttribute(K, 1));
        return geo;
      };
      const cloud = new THREE.Points(buildWarehouse(isMobile ? 0.4 : 0.7), kit.cloudMaterial());
      scene.add(cloud);
      const U = cloud.material.uniforms;
      // A wider sweep, so the far rows light up as it passes, not just the near ones.
      U.uRange.value = 26;

      /* the truck, driving the loop, with its LiDAR on the roof */
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
      let mounts: Mounts | null = null;
      loadFork()
        .then(async (src) => {
          if (disposed) return;
          const f = kit.fitFork(src);
          truck.add(f);
          mounts = kit.mountsOf(f);
          const lidar = await kit.loadDevice("lidar");
          if (disposed || !mounts) return;
          lidar.group.scale.setScalar(1.6);
          lidar.group.position.copy(mounts.lidar);
          truck.add(lidar.group);
        })
        .catch((e) => console.warn("Location Intelligence: forklift unavailable —", e));

      /* ── the four technologies' kit ── */
      const col = (k: TechKey) => new THREE.Color(hex(TECH[k].colour));
      const glow = (k: TechKey) => new THREE.MeshBasicMaterial({ color: col(k), transparent: true, opacity: 0, toneMapped: false });
      const fading: { m: THREE_NS.Material & { opacity: number }; k: TechKey; peak: number }[] = [];
      const fade = <M extends THREE_NS.Material & { opacity: number }>(m: M, k: TechKey, peak = 1) => {
        fading.push({ m, k, peak });
        return m;
      };

      // UWB: six anchors on the walls, and a ranging line from each to the truck.
      // Up at the roof line, as anchors are mounted — clear of the racking.
      const ANCHORS = [V3(-14, 6.6, -4.4), V3(0, 6.8, -4.6), V3(14, 6.6, -4.4), V3(-14, 6.6, 9), V3(0, 6.8, 9.2), V3(14, 6.6, 9)];
      const anchorMeshes = ANCHORS.map((a) => {
        const m = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.34, 0.12), fade(glow("uwb"), "uwb"));
        m.position.copy(a);
        scene.add(m);
        return m;
      });
      const rangeGeo = new THREE.BufferGeometry();
      const rangePos = new Float32Array(ANCHORS.length * 6);
      rangeGeo.setAttribute("position", new THREE.BufferAttribute(rangePos, 3));
      const rangeMat = fade(
        new THREE.LineDashedMaterial({ color: col("uwb"), dashSize: 0.5, gapSize: 0.35, transparent: true, opacity: 0, toneMapped: false }),
        "uwb", 0.85,
      );
      const ranges = new THREE.LineSegments(rangeGeo, rangeMat);
      scene.add(ranges);

      // Bluetooth: gateways on rack ends.
      const GATEWAYS = [V3(-9.4, 2.6, 2.25), V3(16.6, 2.6, -2.25), V3(-19.4, 2.6, 6.75), V3(16.6, 2.6, 11.25)];
      for (const g of GATEWAYS) {
        const box = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.1, 20), fade(glow("ble"), "ble"));
        box.position.copy(g);
        scene.add(box);
      }

      // Wi-Fi: two access points on the ceiling, each over a soft pool of coverage.
      const APS = [V3(-11, 7, 2.25), V3(8, 7, 2.25), V3(-2, 7, 13.5)];
      const pools: THREE_NS.Mesh[] = [];
      for (const a of APS) {
        const ap = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.08, 28), fade(glow("wifi"), "wifi"));
        ap.position.copy(a);
        scene.add(ap);
        const pool = new THREE.Mesh(
          new THREE.CircleGeometry(10.5, 72),
          new THREE.MeshBasicMaterial({ color: col("wifi"), transparent: true, opacity: 0, depthWrite: false, toneMapped: false }),
        );
        pool.rotation.x = -Math.PI / 2;
        pool.position.set(a.x, 0.03, a.z);
        scene.add(pool);
        pools.push(pool);
      }

      /* ── the accuracy ring under the truck ──
         One ring that eases between the four sizes and colours as the chapters
         change, and four more for the closing shot, one per technology. */
      const ringOf = (color: THREE_NS.Color) => {
        const g = new THREE.Group();
        const edge = new THREE.Mesh(
          new THREE.RingGeometry(0.97, 1, 128),
          new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }),
        );
        const fill = new THREE.Mesh(
          new THREE.CircleGeometry(1, 128),
          new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false, toneMapped: false }),
        );
        edge.rotation.x = fill.rotation.x = -Math.PI / 2;
        edge.position.y = 0.06;
        fill.position.y = 0.05;
        g.add(fill, edge);
        scene.add(g);
        return { g, edge, fill };
      };
      const ring = ringOf(col("lidar"));
      const closing = ORDER.map((k) => ({ k, ...ringOf(col(k)) }));

      /* camera keys: [p, offset from the truck, how far the picture shifts
         sideways, and down] — the subject is moved off whichever side (or
         the top, for the close) the chapter's type is on */
      const KEYS: [number, THREE_NS.Vector3, number, number][] = [
        [0, V3(10, 26, 24), -0.14, 0],
        [0.16, V3(10, 26, 24), -0.14, 0],
        [0.26, V3(-12, 18, 20), -0.12, 0],
        [0.44, V3(14, 19, 20), 0.16, 0],
        [0.62, V3(-15, 24, 22), -0.14, 0],
        [0.8, V3(14, 34, 28), 0.14, 0],
        // Straight down — a true plan view. The hair of z keeps lookAt stable.
        [0.94, V3(0, 72, 0.6), 0, 0.19],
        [1, V3(0, 72, 0.6), 0, 0.19],
      ];
      const off = V3();
      let shift = 0, drop = 0;
      const keyed = (p: number) => {
        let i = 0;
        while (i < KEYS.length - 2 && p > KEYS[i + 1][0]) i++;
        const [a, oa, sa, da] = KEYS[i], [b, ob, sb, db] = KEYS[i + 1];
        const t = ss(seg(p, a, b));
        off.lerpVectors(oa, ob, t);
        shift = sa + (sb - sa) * t;
        drop = da + (db - da) * t;
      };

      const state = { p: 0, pT: 0, time: 0, s: LEN * 0.08 };
      const secs = [...film.querySelectorAll<HTMLElement>(".sec")].map((el) => ({ el, a: +el.dataset.a!, b: +el.dataset.b! }));
      const maxScroll = () => Math.max(1, space.offsetHeight - window.innerHeight);
      const onScroll = () => {
        state.pT = clamp(window.scrollY / maxScroll(), 0, 1);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      cleanups.push(() => window.removeEventListener("scroll", onScroll));

      const pos = V3(), tan = V3(), look = V3(), tmp = V3(), ndc = V3();
      let lastOp = -1;
      const truckTag = truckTagRef.current;

      const weight = (k: TechKey, p: number) => {
        const [a, b, c, d] = CH[k];
        return ss(seg(p, a, b)) * (1 - ss(seg(p, c, d)));
      };

      const frame = (dt: number) => {
        state.p += (state.pT - state.p) * Math.min(1, dt * (reduceMotion ? 20 : 4));
        const p = state.p;
        state.time += dt;
        const w = Object.fromEntries(ORDER.map((k) => [k, weight(k, p)])) as Record<TechKey, number>;
        const close = ss(seg(p, CLOSE_AT[0], CLOSE_AT[1]));

        /* the truck: it drives, and parks for the overhead shot */
        const speed = (1 - close) * (reduceMotion ? 0 : 2.6);
        state.s += speed * dt;
        const u = (state.s % LEN) / LEN;
        path.getPointAt(u, pos);
        path.getTangentAt(u, tan);
        truck.position.copy(pos);
        truck.rotation.y = Math.atan2(-tan.x, -tan.z);

        /* the cloud: bright with the sweep in the LiDAR chapter, a dim map otherwise */
        if (mounts) {
          truck.updateMatrixWorld(true);
          truck.localToWorld(tmp.copy(mounts.lidar));
          U.uO.value.copy(tmp);
        } else U.uO.value.set(pos.x, 2.3, pos.z);
        U.uAng.value = reduceMotion ? 1.2 : state.time * 3.2;
        U.uTime.value = state.time;
        // Full brightness for LiDAR and for the plan view (from that height a
        // dimmed cloud reads as black); a quieter map under the other three.
        U.uOp.value = Math.max(0.42 + 0.58 * Math.max(w.lidar, 1 - Math.max(w.uwb, w.ble, w.wifi) * 0.6), close);
        // Points are sized in world units; from far up they need to be bigger
        // or the building thins to nothing.
        U.uSize.value = 0.09 + 0.04 * close;
        U.uScale.value = (window.innerHeight / (2 * Math.tan((cam.fov * Math.PI) / 360))) * R.getPixelRatio();

        for (const f of fading) f.m.opacity = w[f.k] * f.peak;
        // UWB ranging lines, anchor → the tag on the truck's roof.
        ANCHORS.forEach((a, i) => {
          rangePos.set([a.x, a.y, a.z, pos.x, 2.2, pos.z], i * 6);
        });
        rangeGeo.attributes.position.needsUpdate = true;
        ranges.computeLineDistances();
        (rangeMat as unknown as { dashOffset?: number }).dashOffset = -state.time * 2;
        // Wi-Fi pools, breathing.
        pools.forEach((pl, i) => {
          const b = reduceMotion ? 1 : 0.8 + 0.2 * Math.sin(state.time * 1.4 + i * 1.9);
          (pl.material as THREE_NS.MeshBasicMaterial).opacity = w.wifi * 0.06 * b;
        });

        /* the ring: size and colour blended across whichever chapters are live */
        let sw = 0, rad = 0;
        const c = new THREE.Color(0, 0, 0);
        for (const k of ORDER) {
          sw += w[k];
          rad += w[k] * (FOOT + TECH[k].acc);
          c.add(col(k).multiplyScalar(w[k]));
        }
        const ringOp = Math.min(1, sw);
        if (sw > 0.001) {
          rad /= sw;
          c.multiplyScalar(1 / sw);
        }
        ring.g.position.set(pos.x, 0, pos.z);
        ring.g.scale.setScalar(Math.max(rad, 0.01));
        (ring.edge.material as THREE_NS.MeshBasicMaterial).color.copy(c);
        (ring.fill.material as THREE_NS.MeshBasicMaterial).color.copy(c);
        (ring.edge.material as THREE_NS.MeshBasicMaterial).opacity = ringOp * 0.95;
        // The fill thins as the ring grows, or Wi-Fi's floods the frame.
        (ring.fill.material as THREE_NS.MeshBasicMaterial).opacity = ringOp * 0.1 * Math.min(1, 3 / Math.max(rad, 0.01));
        for (const r of closing) {
          r.g.position.set(pos.x, 0, pos.z);
          r.g.scale.setScalar(FOOT + TECH[r.k].acc);
          (r.edge.material as THREE_NS.MeshBasicMaterial).opacity = close * 0.95;
          (r.fill.material as THREE_NS.MeshBasicMaterial).opacity = close * 0.05 * Math.min(1, 3 / (FOOT + TECH[r.k].acc));
        }

        /* camera: follows the truck on the keyed offset, the picture shifted
           away from whichever side the chapter's type is on */
        keyed(p);
        look.lerp(pos, Math.min(1, dt * 2.2));
        if (look.lengthSq() === 0) look.copy(pos);
        const W = window.innerWidth, H = window.innerHeight;
        const narrow = W / H < 1;
        const o = tmp.copy(off).multiplyScalar(narrow ? 1.35 : 1);
        cam.position.set(look.x + o.x, o.y, look.z + o.z);
        cam.lookAt(look.x, 0.4, look.z);
        cam.setViewOffset(W, H, narrow ? 0 : shift * W, -drop * H, W, H);
        // An anchor that ends up beside the camera reads as a big blue block,
        // not a small unit on a wall; its ranging line still makes the point.
        for (const m of anchorMeshes) m.visible = m.position.distanceTo(cam.position) > 10;

        /* tags */
        const place = (el: HTMLElement | null, v: THREE_NS.Vector3, op: number) => {
          if (!el) return;
          ndc.copy(v).project(cam);
          el.style.opacity = ndc.z < 1 ? op.toFixed(3) : "0";
          el.style.transform = `translate(${((ndc.x * 0.5 + 0.5) * W).toFixed(1)}px,${((-ndc.y * 0.5 + 0.5) * H).toFixed(1)}px)`;
        };
        if (truckTag) {
          let best: TechKey = "lidar";
          for (const k of ORDER) if (w[k] > w[best]) best = k;
          const T = TECH[best];
          const s = truckTag.querySelector("span");
          const txt = `${T.name} · ${T.accTxt} ${T.accUnit}`;
          if (s && s.textContent !== txt) s.textContent = txt;
          const dot = truckTag.querySelector("i") as HTMLElement | null;
          if (dot) dot.style.background = T.colour;
          place(truckTag, V3(pos.x, 3.6, pos.z), Math.min(1, sw) * (1 - close));
        }
        if (legendRef.current) legendRef.current.style.opacity = close.toFixed(3);

        for (const s of secs) {
          const f = 0.035;
          const op = (s.a === 0 ? 1 : ss(seg(p, s.a, s.a + f))) * (1 - ss(seg(p, s.b - f, s.b)));
          s.el.style.opacity = op.toFixed(3);
          s.el.style.transform = `translateY(${((1 - op) * 14).toFixed(1)}px)`;
          s.el.style.visibility = op < 0.005 ? "hidden" : "visible";
        }

        /* past the end of the track the whole film fades out over 60% of a
           viewport, handing the page to the document underneath */
        const past = Math.max(0, (window.scrollY - maxScroll()) / Math.max(1, H * 0.6));
        const fop = 1 - Math.min(1, past);
        if (Math.abs(fop - lastOp) > 0.004) {
          lastOp = fop;
          const vis = fop < 0.01 ? "hidden" : "visible";
          for (const el of [film, tagsRoot, canvas as HTMLElement]) {
            el.style.opacity = fop.toFixed(3);
            el.style.visibility = vis;
          }
        }
        if (fop >= 0.01) R.render(scene, cam);
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
      console.warn("Location Intelligence: hero film unavailable —", err);
      giveUp();
    });

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
    };
  }, [failed, onUnavailable]);

  if (failed) return null;

  const chapter = (k: TechKey, side: "left" | "right", h: ReactNode, lead: string) => {
    const T = TECH[k];
    return (
      <section className={"sec " + side} data-a={CH[k][0]} data-b={CH[k][3]}>
        <span className="label" style={{ color: T.colour }}>
          {T.name} · {T.badge}
        </span>
        <h2>{h}</h2>
        <p className="lead">{lead}</p>
        <div className="chips">
          <span>
            <b style={{ color: T.colour }}>
              {T.accTxt} {T.accUnit}
            </b>
          </span>
          <span>{T.infra}</span>
          <span>{T.rate}</span>
        </div>
        {!T.live && <p className="fnote">Typical industry range, not a RAMS measurement.</p>}
      </section>
    );
  };

  return (
    <>
      <canvas ref={canvasRef} className="hw-gl" aria-hidden />

      <div className="film" ref={filmRef}>
        <section className="sec hero" data-a="0" data-b="0.16">
          <div className="heroblock">
            <p className="kicker">RAMS Digital</p>
            <h1>
              Location
              <br />
              Intelligence
            </h1>
            <p className="tag">
              Know where everything is <b>inside the building</b> — where GPS gives up.
            </p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#accuracy">
                See what accuracy buys you
              </a>
              <a className="btn btn-secondary" href="#contact">
                Talk to us
              </a>
            </div>
            <p className="hero-support">
              LiDAR <span aria-hidden>·</span> UWB <span aria-hidden>·</span> Bluetooth <span aria-hidden>·</span> Wi-Fi
            </p>
          </div>
          <div className="scrollcue" aria-hidden>
            Scroll<i />
          </div>
        </section>

        {chapter(
          "lidar",
          "left",
          <>
            It sees the
            <br />
            building itself.
          </>,
          TECH.lidar.can + " No tags, and nothing fitted to the walls.",
        )}
        {chapter(
          "uwb",
          "right",
          <>
            Anchors on the walls.
            <br />
            A tag on the truck.
          </>,
          TECH.uwb.can,
        )}
        {chapter(
          "ble",
          "left",
          <>
            Cheap tags,
            <br />
            answered by aisle.
          </>,
          TECH.ble.can,
        )}
        {chapter(
          "wifi",
          "right",
          <>
            The network
            <br />
            you already have.
          </>,
          TECH.wifi.can,
        )}

        <section className="sec top" data-a="0.88" data-b="1.08">
          <span className="label">Same truck</span>
          <h2>Four circles.</h2>
          <p className="lead">
            How precise you need to be decides the technology. Start with one aisle, and measure it
            on your own floor.
          </p>
          <div className="hero-cta" style={{ justifyContent: "center", marginTop: 24 }}>
            <a className="btn btn-primary" href="#accuracy">
              See what accuracy buys you
            </a>
          </div>
        </section>
      </div>

      <div className="hw-tags" ref={tagsRef} aria-hidden>
        <div className="loc-tag" ref={truckTagRef}>
          <div className="in">
            <b>
              <i /> Truck 07
            </b>
            <span />
          </div>
        </div>
        {/* The closing plan view's key. A legend, not labels on the rings:
            LiDAR's and UWB's rings are within a few centimetres of each other
            at this scale, and labels pinned to them sat on top of each other. */}
        <div className="loc-legend" ref={legendRef}>
          {ORDER.map((k) => (
            <div key={k} className="row">
              <i style={{ borderColor: TECH[k].colour }} />
              <b style={{ color: TECH[k].colour }}>{TECH[k].name}</b>
              <span>
                {TECH[k].accTxt} {TECH[k].accUnit}
              </span>
            </div>
          ))}
          <p>Rings to scale: the truck plus each one’s accuracy.</p>
        </div>
      </div>

      <div className="hw-scrollspace" ref={spaceRef} aria-hidden />
    </>
  );
}
