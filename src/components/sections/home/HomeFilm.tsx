"use client";

import { useEffect, useRef, useState } from "react";
import type * as THREE_NS from "three";
import { createSstKit, loadFork } from "@/components/sections/sst/sst-3d";
import { BAY as BAYW, CHARGE, CROSSING, LANE, ROUTES, createHomeKit } from "./home-3d";

/**
 * The homepage film — one warehouse, and everything RAMS does in it, one
 * chapter at a time. A dark isometric building, as on the Location
 * Intelligence page, lit by its own data.
 *
 *   0  Clarity in Motion — the floor working
 *   1  Every move, traced — each truck leaves a glowing trail
 *   2  Heatmaps — the trails become traffic heat, then near-miss heat
 *   3  MHE safety — a blind crossing, a pedestrian, a truck over its limit
 *   4  MHE health — every truck says what it is doing
 *   5  Rack safety — a drone sweeps the rack face; bays get a state
 *   6  Inventory — slots checked against the system; mismatches light
 *   7  Execution — task flows from the dock to the rack and back
 *   8  One platform — the whole site, and where to start
 *
 * Design and decisions: docs/superpowers/specs/2026-09-21-homepage-digital-twin-design.md
 *
 * ── Words and states, never figures ─────────────────────────────────
 * Every label says what something *is* — "Service due", "Mismatch", "Damaged".
 * None carries a sample number: on the front door a specimen figure reads as a
 * promise.
 *
 * ── If it cannot run ────────────────────────────────────────────────
 * No WebGL2, or ten seconds without a frame, and `onUnavailable()` puts the
 * page into `.no-film`; the existing video hero takes over.
 */

const ss = (t: number) => t * t * (3 - 2 * t);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1);

/** Each chapter's stretch of the track. */
const CH: [number, number][] = [
  [0, 0.09],
  [0.1, 0.2],
  [0.21, 0.32],
  [0.33, 0.45],
  [0.46, 0.55],
  [0.56, 0.67],
  [0.68, 0.78],
  [0.79, 0.88],
  [0.89, 1.06],
];
/** Chapter 2 switches from traffic heat to near-miss heat here. */
const NEAR_AT = 0.265;

function Chips({ items }: { items: string[] }) {
  return (
    <div className="chips">
      {items.map((c) => (
        <span key={c}>{c}</span>
      ))}
    </div>
  );
}

/**
 * `ambient` runs the same film as a framed visual instead of a full-screen
 * one: it sizes itself to its own box rather than the window, plays its
 * chapters on a loop rather than on scroll, and renders no copy of its own —
 * the page around it carries that. The hero on /homepage uses it; nothing
 * else does, and the scroll build is untouched by it.
 */
export function HomeFilm({ onUnavailable, ambient = false }: { onUnavailable: () => void; ambient?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const spaceRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (failed) return;
    const canvas = canvasRef.current, tagsRoot = tagsRef.current;
    // In ambient mode there is no copy track and no scroll spacer.
    const film = filmRef.current, space = spaceRef.current;
    if (!canvas || !tagsRoot || (!ambient && (!film || !space))) return;

    /* Everything below measured the window. Framed, it measures the canvas's
       own box, which is the frame the hero gives it. */
    const vw = () => (ambient ? canvas.clientWidth || 1 : window.innerWidth);
    const vh = () => (ambient ? canvas.clientHeight || 1 : window.innerHeight);
    /* One pass through all nine chapters. Slow enough to read a chapter, short
       enough that the loop comes round while someone is still on the page. */
    const LOOP = 64;

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
      const kit = createHomeKit(THREE, isMobile);
      const V3 = kit.V3;

      let R: THREE_NS.WebGLRenderer;
      try {
        R = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
        if (!R.capabilities.isWebGL2) throw new Error("webgl2");
      } catch {
        giveUp();
        return;
      }
      /* Lifted from near-black. The scene is a dark warehouse by design, but
         at 0x0b0c0f with the old light levels the racking read as one mass and
         the trucks disappeared into it — worse in a small frame than it ever
         was full-screen. The ground, the fog and the lights all come up
         together, so the picture is lighter without the contrast flattening. */
      R.setClearColor(0x16181d, 1);
      R.toneMapping = THREE.ACESFilmicToneMapping;
      R.toneMappingExposure = 1.22;
      R.shadowMap.enabled = !isMobile;
      R.shadowMap.type = THREE.PCFShadowMap;
      clearTimeout(bail);

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x16181d, 150, 320);
      scene.add(new THREE.HemisphereLight(0xdfe7f2, 0x20242b, 1.5));
      const sun = new THREE.DirectionalLight(0xffffff, 1.9);
      sun.position.set(20, 40, 18);
      sun.castShadow = !isMobile;
      if (!isMobile) {
        sun.shadow.mapSize.set(2048, 2048);
        Object.assign(sun.shadow.camera, { left: -45, right: 45, top: 35, bottom: -35, near: 5, far: 120 });
        sun.shadow.bias = -0.0005;
      }
      scene.add(sun);
      // A long lens from far back: close to isometric, the look the Location film set.
      const cam = new THREE.PerspectiveCamera(24, 16 / 9, 1, 600);

      kit.buildHall(scene);
      const racks = kit.buildRacks(scene);
      const overlay = kit.makeOverlay(scene);

      /* ── the trucks ── */
      const routes = isMobile ? ROUTES.slice(0, 4) : ROUTES;
      const trucks = routes.map((r) => {
        const m = kit.makeMhe(r.kind);
        scene.add(m.g);
        const path = kit.routePath(r.pts);
        const len = path.getLength();
        return { r, ...m, path, len, s: r.phase * len, pos: V3(), last: V3(), tan: V3() };
      });
      // Two more parked in the charging bay; one of them is charging.
      const parked = [0, 1].map((i) => {
        const m = kit.makeMhe("forklift");
        m.loadG.visible = false;
        m.g.position.set(CHARGE.x, 0, CHARGE.z0 + 2 + i * 3.6);
        m.g.rotation.y = -Math.PI / 2;
        scene.add(m.g);
        return m;
      });

      /* ── people on foot ── */
      const walker = kit.makePerson(); // the one who steps out at the crossing
      const people = [
        { g: kit.makePerson(), a: V3(-20, 0, 22.8), b: V3(-6, 0, 22.8), sp: 0.9, t: 0 },
        { g: kit.makePerson(), a: V3(14, 0, 12.2), b: V3(22, 0, 16.5), sp: 0.7, t: 0.4 },
        { g: kit.makePerson(), a: V3(-33.4, 0, 10.5), b: V3(-33.4, 0, 20), sp: 0.6, t: 0.2 },
      ];
      scene.add(walker, ...people.map((q) => q.g));

      const place = (tk: (typeof trucks)[number], s: number) => {
        const u = (((s % tk.len) + tk.len) % tk.len) / tk.len;
        tk.path.getPointAt(u, tk.pos);
        tk.path.getTangentAt(u, tk.tan);
        tk.g.position.copy(tk.pos);
        tk.g.rotation.y = Math.atan2(-tk.tan.x, -tk.tan.z);
        // Loaded for half of each lap, empty for the other.
        tk.loadG.visible = u < 0.5;
      };

      /* ── pre-warm: run the floor for a minute before the first frame, so
         the trails and heat are already there whenever their chapters arrive ── */
      {
        const step = 0.1;
        for (const tk of trucks) {
          place(tk, tk.s);
          tk.last.copy(tk.pos);
        }
        for (let t = 0, k = 0; t < 70; t += step, k++) {
          for (const tk of trucks) {
            tk.s += tk.r.speed * step;
            place(tk, tk.s);
            overlay.paint(tk.last.x, tk.last.z, tk.pos.x, tk.pos.z);
            tk.last.copy(tk.pos);
          }
          if (k % 30 === 29) overlay.fade(0.03);
        }
        // Near-misses: where people and trucks share floor — the crossing
        // worst, then the lane ends and the dock lanes.
        overlay.nearMiss(CROSSING.x, LANE.main, 6);
        overlay.nearMiss(LANE.eastEnd, LANE.main, 2.2);
        overlay.nearMiss(LANE.westEnd, LANE.main, 2.6);
        overlay.nearMiss(-8, 18.5, 2);
        overlay.nearMiss(8, 13.2, 1.6);
        overlay.nearMiss(-30.8, -8, 1.2);
        overlay.nearMiss(LANE.cross, -14, 1.4);
        overlay.upload();
      }


      /* ════ the chapters' own props ════ */
      const orange = new THREE.Color(0xff6a00), red = new THREE.Color(0xff453a), amber = new THREE.Color(0xffb340), green = new THREE.Color(0x30d158);
      const basic = (c: THREE_NS.ColorRepresentation, o = 0) =>
        new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, toneMapped: false });

      /* DOM tags: created here rather than in JSX, and placed every frame by
         projecting a world point — the copy stays real text. */
      const mkTag = (cls: string, b: string, span = "") => {
        const el = document.createElement("div");
        el.className = "home-tag " + cls;
        el.innerHTML = `<div class="in"><b><i></i>${b}</b><span>${span}</span></div>`;
        tagsRoot.appendChild(el);
        return el;
      };
      const setTag = (el: HTMLElement, sub: string, cls?: string) => {
        const sp = el.querySelector("span")!;
        if (sp.textContent !== sub) sp.textContent = sub;
        if (cls !== undefined && el.dataset.s !== cls) {
          el.dataset.s = cls;
        }
      };
      const ndcV = V3();
      const placeTag = (el: HTMLElement, v: THREE_NS.Vector3, op: number) => {
        ndcV.copy(v).project(cam);
        const vis = op > 0.01 && ndcV.z < 1 && Math.abs(ndcV.x) < 1.1 && Math.abs(ndcV.y) < 1.1;
        el.style.opacity = vis ? op.toFixed(3) : "0";
        if (vis) {
          const W = vw(), H = vh();
          let x = (ndcV.x * 0.5 + 0.5) * W, y = (-ndcV.y * 0.5 + 0.5) * H;
          /* Framed, a tag on something near an edge lands half outside it, and
             one low on the floor sits on the asset key in the bottom-left
             corner. Keep them inside a margin that clears both. The tag is
             drawn up and left of this point, hence the asymmetry. */
          if (ambient) {
            x = clamp(x, 62, W - 62);
            y = clamp(y, 38, H - 52);
          }
          el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
        }
      };

      /* ── 3: the blind crossing ── */
      const camHead = V3(CROSSING.x + 3.4, 4.6, 10.6), camAim = V3(CROSSING.x, 0, LANE.main);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 4.6, 10), kit.M.dark);
      pole.position.set(camHead.x, 2.3, camHead.z);
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.26, 0.5), kit.M.dark);
      head.position.copy(camHead);
      head.lookAt(camAim);
      const coneLen = camHead.distanceTo(camAim) + 1.5;
      const coneGeo = new THREE.ConeGeometry(3.4, coneLen, 32, 1, true).translate(0, -coneLen / 2, 0);
      const coneMat = basic(0xff9b4d);
      coneMat.side = THREE.DoubleSide;
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.copy(camHead);
      cone.quaternion.setFromUnitVectors(V3(0, -1, 0), camAim.clone().sub(camHead).normalize());
      scene.add(pole, head, cone);
      // The zone the truck is over its limit in: a dashed outline on the floor.
      const zonePts = [V3(-8, 0.06, 2.8), V3(8, 0.06, 2.8), V3(8, 0.06, 9.3), V3(-8, 0.06, 9.3), V3(-8, 0.06, 2.8)];
      const zoneMat = new THREE.LineDashedMaterial({ color: 0xff9b4d, dashSize: 0.9, gapSize: 0.6, transparent: true, opacity: 0, toneMapped: false });
      const zone = new THREE.Line(new THREE.BufferGeometry().setFromPoints(zonePts), zoneMat);
      zone.computeLineDistances();
      scene.add(zone);
      const ringMat = basic(0xff453a);
      ringMat.side = THREE.DoubleSide;
      const alertRing = new THREE.Mesh(new THREE.RingGeometry(0.9, 1.15, 40), ringMat);
      alertRing.rotation.x = -Math.PI / 2;
      scene.add(alertRing);
      /* Chapter 3 has its own truck, driven by the scroll along the main lane,
         so it always reaches the crossing while the chapter is on screen —
         the route trucks keep their own time and could be anywhere. */
      const hero = kit.makeMhe("forklift");
      hero.g.visible = false;
      scene.add(hero.g);

      /* ── the real forklift ──
         The CAD truck the AI Camera and Sensor Stack pages show
         (`rams-forklift.glb`, 2.3 MB, cached if the visitor has seen either).
         The box trucks are on screen from the first frame; when this arrives
         each counterbalance and reach truck swaps its boxes for the model, and
         its pallet moves onto the model's forks. The pallet truck stays boxes —
         the GLB is a counterbalance truck and it would be the wrong machine. */
      void loadFork()
        .then((src) => {
          if (disposed) return;
          const sst = createSstKit(THREE, isMobile);
          const swap = (m: { g: THREE_NS.Group; loadG: THREE_NS.Group }) => {
            const real = sst.fitFork(src);
            // fitFork sizes to a 2.3 m truck; ours are drawn a little larger
            // so they read from this distance.
            real.scale.setScalar(1.12);
            real.updateMatrixWorld(true);
            const bb = new THREE.Box3().setFromObject(real);
            for (const c of m.g.children) if (c !== m.loadG) c.visible = false;
            m.g.add(real);
            // The load's pallet sits at z −1.15 in the box truck; put it just
            // inside the model's fork tips instead.
            m.loadG.position.set(0, 0, bb.min.z + 0.6 + 1.15);
          };
          trucks.forEach((tk) => tk.r.kind !== "pallet" && swap(tk));
          parked.forEach(swap);
          swap(hero);
        })
        .catch((e) => console.warn("Homepage: the CAD forklift did not load — keeping the stand-ins", e));
      const heroPos = V3();
      const tagTruck = mkTag("t-truck", "FLT 21", "Main lane");
      const tagWalker = mkTag("t-person", "Pedestrian", "In view");

      /* ── 4: every truck says what it is doing ── */
      const FIXED: Record<string, string> = { "FLT 14": "Service due" };
      const stateTags = trucks.map((tk) => mkTag("t-state", tk.r.name, "Moving"));
      const parkedTags = parked.map((_, i) => mkTag("t-state", i ? "FLT 09" : "FLT 02", i ? "Idle" : "Charging"));
      const fleet = document.createElement("div");
      fleet.className = "home-fleet";
      fleet.innerHTML =
        '<span class="k">Fleet, this shift</span><div class="bar"><i class="m"></i><i class="l"></i><i class="c"></i><i class="d"></i></div>' +
        '<div class="lg"><span><i class="m"></i>Moving</span><span><i class="l"></i>Loaded</span><span><i class="c"></i>Charging</span><span><i class="d"></i>Idle</span></div>';
      tagsRoot.appendChild(fleet);

      /* ── 5: the drone and the rack face ── */
      const drone = new THREE.Group();
      {
        const bodyD = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.14, 0.5), kit.M.dark);
        drone.add(bodyD);
        for (const [x, z] of [[-0.36, -0.36], [0.36, -0.36], [-0.36, 0.36], [0.36, 0.36]]) {
          const r = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.02, 16), basic(0xc9ccd2, 0.55));
          r.position.set(x, 0.1, z);
          drone.add(r);
        }
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), basic(0xff6a00, 1));
        eye.position.set(0, -0.05, -0.28);
        drone.add(eye);
      }
      scene.add(drone);
      const faceZ = kit.FRONT_ROW_Z + 0.58;
      const scanMat = basic(0xff9b4d);
      const scan = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 6), scanMat);
      scene.add(scan);
      const bays = kit.inspectBays;
      // Most bays fine, a few to watch, one damaged — fixed, so every load tells the same story.
      const DAMAGED = 12;
      const bayState = bays.map((_, i) => (i === DAMAGED ? red : i % 7 === 3 || i === 5 ? amber : green));
      const bayMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.32, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
      const bayQuads = new THREE.InstancedMesh(new THREE.PlaneGeometry(BAYW, 5.8), bayMat, bays.length);
      {
        const d = new THREE.Object3D();
        bays.forEach((b, i) => {
          d.position.set((b.x0 + b.x1) / 2, 3, faceZ + 0.02);
          d.updateMatrix();
          bayQuads.setMatrixAt(i, d.matrix);
          bayQuads.setColorAt(i, new THREE.Color(0, 0, 0));
        });
      }
      scene.add(bayQuads);
      const hurt = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.6, 0.2), basic(0xff453a));
      hurt.position.set(bays[DAMAGED].x0, 1.3, faceZ - 0.05);
      scene.add(hurt);
      const DRONE_X: [number, number] = [bays[0].x0 - 1, bays[bays.length - 1].x1 + 1];
      let droneX = DRONE_X[0];
      const card = document.createElement("div");
      card.className = "home-card";
      tagsRoot.appendChild(card);
      const cardSet = (h: string, rows: [string, string][]) => {
        const html = `<b>${h}</b>` + rows.map(([k, v]) => `<div><span>${k}</span><em>${v}</em></div>`).join("");
        if (card.dataset.h !== h) {
          card.dataset.h = h;
          card.innerHTML = html;
        }
      };

      /* ── 6: inventory states ── */
      const mismatch = new Set<number>();
      racks.filled.forEach((sl, i) => {
        if ((sl.row === 4 || sl.row === 5 || sl.row === 3) && (i * 7) % 23 === 0) mismatch.add(i);
      });
      const emptySlots = kit.slots.filter((sl) => !sl.filled && sl.row >= 2 && sl.row <= 5);
      const ghostGeo = new THREE.BoxGeometry(1.0, 1.0, 0.92);
      const ghostMat = new THREE.MeshBasicMaterial({ color: 0xe8eef7, wireframe: true, transparent: true, opacity: 0, toneMapped: false });
      const ghosts = new THREE.InstancedMesh(ghostGeo, ghostMat, emptySlots.length);
      const flagged = emptySlots.filter((_, i) => i % 9 === 4);
      const flagMat = basic(0xff6a00);
      const flags = new THREE.InstancedMesh(ghostGeo, flagMat, flagged.length);
      {
        const d = new THREE.Object3D();
        emptySlots.forEach((sl, i) => {
          d.position.set(sl.x, sl.y + 0.64, sl.z);
          d.updateMatrix();
          ghosts.setMatrixAt(i, d.matrix);
        });
        flagged.forEach((sl, i) => {
          d.position.set(sl.x, sl.y + 0.64, sl.z);
          d.updateMatrix();
          flags.setMatrixAt(i, d.matrix);
        });
      }
      scene.add(ghosts, flags);
      // The card goes on the flagged slot nearest the middle of chapter 6's shot.
      const cardSlot = [...flagged].sort((a, b) => Math.hypot(a.x, a.z + 5) - Math.hypot(b.x, b.z + 5))[0] ?? emptySlots[0];
      const tmpC = new THREE.Color();

      /* ── 7: task flows ── */
      const flowMat = (c: number) =>
        new THREE.ShaderMaterial({
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          toneMapped: false,
          uniforms: { uColor: { value: new THREE.Color(c) }, uTime: { value: 0 }, uOp: { value: 0 } },
          vertexShader: "varying float vU;void main(){vU=uv.x;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
          fragmentShader:
            "uniform vec3 uColor;uniform float uTime,uOp;varying float vU;void main(){float w=.5+.5*sin((vU*14.-uTime)*6.28318);" +
            "gl_FragColor=vec4(uColor*(.55+.9*pow(w,3.)),uOp*(.55+.45*w));}",
        });
      const polyline = (pts: [number, number][]) => {
        const cp = new THREE.CurvePath<THREE_NS.Vector3>();
        for (let i = 1; i < pts.length; i++) cp.add(new THREE.LineCurve3(V3(pts[i - 1][0], 0.35, pts[i - 1][1]), V3(pts[i][0], 0.35, pts[i][1])));
        return cp;
      };
      const FLOWS: { pts: [number, number][]; c: number; label: string; sub: string }[] = [
        { pts: [[0, 24], [0, 12.5], [LANE.cross, LANE.main], [LANE.cross, -2], [-15, -2]], c: 0xe8eef7, label: "Inbound", sub: "Putaway to rack" },
        { pts: [[16, 24], [16, 8.8], [LANE.eastEnd, 8.8], [LANE.eastEnd, -8], [14, -8]], c: 0xe8eef7, label: "Inbound", sub: "Putaway to rack" },
        { pts: [[-19, -14], [LANE.westEnd, -14], [LANE.westEnd, 11], [-24, 11], [-24, 24]], c: 0xff6a00, label: "Outbound", sub: "Pick to dock" },
        { pts: [[20, -2], [LANE.eastEnd, -2], [LANE.eastEnd, 11], [24, 11], [24, 24]], c: 0xff6a00, label: "Outbound", sub: "Pick to dock" },
      ];
      const flows = FLOWS.map((f) => {
        const curve = polyline(f.pts);
        const mat = flowMat(f.c);
        const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, f.pts.length * 40, 0.16, 8, false), mat);
        scene.add(mesh);
        const mid = curve.getPointAt(0.5);
        return { mat, tag: mkTag("t-flow", f.label, f.sub), at: V3(mid.x, 1.2, mid.z) };
      });

      /* ── 8: the building answering, all round the edge ── */
      const panels = document.createElement("div");
      panels.className = "home-panels";
      panels.innerHTML = [
        ["Racks", "Inspected, damage located"],
        ["MHE", "Every truck, every shift"],
        ["Inventory", "Counted where it sits"],
        ["People", "Near-misses located"],
        ["Dock", "Every door, live"],
      ]
        .map(([h, v]) => `<div class="p"><span>${h}</span><b>${v}</b></div>`)
        .join("");
      tagsRoot.appendChild(panels);

      /* ── camera: [p, target, offset from target, sideways shift, drop] ──
         Each chapter's key sits mid-chapter; the camera moves between them. */
      type Key = [number, THREE_NS.Vector3 | "drone", THREE_NS.Vector3, number, number];
      const KEYS: Key[] = [
        [0, V3(0, 0, 2), V3(48, 64, 74), -0.12, 0],
        [0.07, V3(0, 0, 2), V3(48, 64, 74), -0.12, 0],
        [0.15, V3(0, 0, -2), V3(-50, 68, 66), 0.13, 0],
        [0.265, V3(0, 0, 0), V3(0.01, 120, 34), -0.13, 0],
        [0.39, V3(CROSSING.x - 3, 0, LANE.main + 1), V3(22, 20, 27), 0.15, 0],
        [0.505, V3(0, 0, 8), V3(-38, 48, 50), -0.13, 0],
        [0.615, "drone", V3(12, 9, 22), 0.13, 0],
        [0.73, V3(0, 2.4, -6), V3(-28, 34, 34), -0.13, 0],
        [0.835, V3(0, 0, 12), V3(32, 56, 56), 0.13, 0],
        [0.95, V3(0, 0, 0), V3(0.01, 140, 90), 0, 0.1],
        [1, V3(0, 0, 0), V3(0.01, 140, 90), 0, 0.1],
      ];
      const tA = V3(), tB = V3(), oA = V3(), oB = V3(), tgt = V3(), off = V3();
      let shift = 0, drop = 0;
      const resolve = (t: Key[1], out: THREE_NS.Vector3) =>
        t === "drone" ? out.set(droneX, 2.6, faceZ) : out.copy(t);
      const keyed = (p: number) => {
        let i = 0;
        while (i < KEYS.length - 2 && p > KEYS[i + 1][0]) i++;
        const a = KEYS[i], b = KEYS[i + 1];
        const t = ss(seg(p, a[0], b[0]));
        resolve(a[1], tA);
        resolve(b[1], tB);
        tgt.lerpVectors(tA, tB, t);
        off.lerpVectors(oA.copy(a[2]), oB.copy(b[2]), t);
        shift = a[3] + (b[3] - a[3]) * t;
        drop = a[4] + (b[4] - a[4]) * t;
      };

      /* ── scroll ── */
      const state = { p: 0, pT: 0, time: 0 };
      const secs = film ? [...film.querySelectorAll<HTMLElement>(".hsec")].map((el) => ({ el, a: +el.dataset.a!, b: +el.dataset.b! })) : [];
      const maxScroll = () => Math.max(1, (space?.offsetHeight ?? 1) - window.innerHeight);
      if (!ambient) {
        const onScroll = () => {
          state.pT = clamp(window.scrollY / maxScroll(), 0, 1);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        cleanups.push(() => window.removeEventListener("scroll", onScroll));
      }

      const look = V3(), camPos = V3();
      let lastOp = -1, fadeK = 0, heatK = 0, first = true, lastInv = 0;
      const U = overlay.mat.uniforms;

      const frame = (dt: number) => {
        state.time += dt;
        /* Framed, the track is the clock: one pass every LOOP seconds, driven
           straight rather than through the scroll smoothing, because there is
           no input to catch up with. Reduced motion parks it on the opening
           chapter, which is the floor simply working. */
        if (ambient) state.p = reduceMotion ? 0.02 : (state.time % LOOP) / LOOP;
        else state.p += (state.pT - state.p) * Math.min(1, dt * (reduceMotion ? 20 : 3.5));
        const p = state.p;
        const w = CH.map(([a, b]) => ss(seg(p, a, a + 0.03)) * (1 - ss(seg(p, b - 0.03, b))));

        /* the floor works */
        const run = reduceMotion ? 0 : 1;
        // The trails and heat are only painted and re-uploaded while their
        // chapters are near the screen — a 1400px canvas every other frame is
        // not free, and for seven chapters nobody can see it.
        const floorLive = CH[1][0] - 0.04 < p && p < CH[2][1] + 0.02;
        for (const tk of trucks) {
          tk.s += tk.r.speed * dt * run;
          place(tk, tk.s);
          if (floorLive) overlay.paint(tk.last.x, tk.last.z, tk.pos.x, tk.pos.z);
          tk.last.copy(tk.pos);
        }
        if (floorLive) {
          if (++fadeK % 30 === 0) overlay.fade(0.03);
          // Every other frame: continuous to the eye, half the upload cost.
          else if (fadeK % 2 === 0) overlay.flush();
        }
        for (const q of people) {
          q.t += (dt * q.sp * run) / q.a.distanceTo(q.b);
          const tri = 1 - Math.abs((q.t % 2) - 1);
          q.g.position.lerpVectors(q.a, q.b, tri);
          q.g.rotation.y = Math.atan2(q.b.x - q.a.x, q.b.z - q.a.z) + (q.t % 2 > 1 ? Math.PI : 0);
        }
        parked.forEach((m, i) => (m.g.visible = !isMobile || i === 0));

        /* 3 — the crossing. The walker's step-out is timed off the followed
           truck, so the two always meet: they start across as it closes on the
           walkway, and the camera flags them while they are in its path. */
        const drive = seg(p, 0.335, 0.445);
        hero.g.visible = p > 0.325 && p < 0.455;
        heroPos.set(-26 + 40 * drive, 0, LANE.main - 0.9);
        hero.g.position.copy(heroPos);
        hero.g.rotation.y = -Math.PI / 2;
        hero.loadG.visible = true;
        const t0 = { pos: heroPos };
        const eastbound = true;
        const ahead = CROSSING.x - heroPos.x;
        // Mid-lane while the truck is closing on the walkway, clear as it arrives.
        const cross = seg(ahead, 17, 1.5);
        /* Once the truck is past, he keeps walking — out of the cross aisle
           and off to the side. He used to stop on the walkway at x 0.2, which
           is the line FLT 14 runs up (x 0.3, z −2 → 8.8): the truck drove
           straight through him a few seconds later. Stepping him 2.4 m clear
           puts him beside that lane instead of in it. */
        const cross2 = seg(-ahead, 0.5, 7);
        walker.position.set(CROSSING.x + 0.5 + cross2 * 2.4, 0, 10.9 - cross * 8.8 - cross2 * 1.4);
        walker.rotation.y = Math.PI - cross2 * 1.15;
        const inLane = walker.position.z > 2.8 && walker.position.z < 8.6;
        const alert = eastbound && inLane && ahead > 0 && ahead < 14 ? 1 : 0;
        const inZone = t0.pos.x > -8 && t0.pos.x < 8 && t0.pos.z > 2.8 && t0.pos.z < 9.3;
        pole.visible = head.visible = w[3] > 0.01;
        coneMat.opacity = w[3] * (alert ? 0.3 : 0.16);
        coneMat.color.set(alert ? 0xff453a : 0xff9b4d);
        zoneMat.opacity = w[3] * 0.9;
        ringMat.opacity = w[3] * alert * (reduceMotion ? 1 : 0.6 + 0.4 * Math.sin(state.time * 9));
        alertRing.position.set(walker.position.x, 0.07, walker.position.z);
        setTag(tagTruck, inZone ? "Over zone limit" : "Main lane", inZone ? "alert" : "");
        setTag(tagWalker, alert ? "Detected · truck alerted" : "In view", alert ? "alert" : "");

        /* 5 — the drone sweeps the face as the page scrolls, not on a clock:
           the reader drives the inspection. Bays light as it passes them. */
        const sweep = seg(p, 0.575, 0.655);
        droneX = DRONE_X[0] + (DRONE_X[1] - DRONE_X[0]) * sweep;
        drone.visible = w[5] > 0.01;
        drone.position.set(droneX, 2.8 + (reduceMotion ? 0 : Math.sin(state.time * 1.6) * 1.4), faceZ + 1.6);
        drone.rotation.y = Math.PI;
        scan.position.set(droneX, 3, faceZ + 0.05);
        scanMat.opacity = w[5] * 0.85;
        bayQuads.visible = w[5] > 0.001;
        if (bayQuads.visible) {
          bays.forEach((b, i) => {
            const lit = droneX > (b.x0 + b.x1) / 2 ? 1 : 0;
            tmpC.copy(bayState[i]).multiplyScalar(lit * w[5]);
            bayQuads.setColorAt(i, tmpC);
          });
          if (bayQuads.instanceColor) bayQuads.instanceColor.needsUpdate = true;
        }
        const hurtSeen = droneX > bays[DAMAGED].x0 ? 1 : 0;
        (hurt.material as THREE_NS.MeshBasicMaterial).opacity = w[5] * hurtSeen * (reduceMotion ? 1 : 0.7 + 0.3 * Math.sin(state.time * 6));

        /* 6 — inventory: mismatches pulse, the rest steps back */
        const pulse = reduceMotion ? 1 : 0.5 + 0.5 * Math.sin(state.time * 4);
        if (w[6] > 0.001 || lastInv > 0.001) {
          racks.filled.forEach((_, i) => {
            const bc = i % 3 ? racks.base : racks.alt;
            if (mismatch.has(i)) tmpC.copy(bc).lerp(orange, w[6] * (0.55 + 0.45 * pulse));
            else tmpC.copy(bc).multiplyScalar(1 - 0.45 * w[6]);
            racks.load.setColorAt(i, tmpC);
          });
          if (racks.load.instanceColor) racks.load.instanceColor.needsUpdate = true;
        }
        lastInv = w[6];
        ghostMat.opacity = w[6] * 0.28;
        flagMat.opacity = w[6] * (0.35 + 0.35 * pulse);

        /* 7 — task flows */
        flows.forEach((f, i) => {
          f.mat.uniforms.uOp.value = w[7];
          f.mat.uniforms.uTime.value = (reduceMotion ? 0 : state.time * 1.2) + i * 0.3;
        });

        /* trails and heat */
        U.uTrailOp.value = Math.max(w[1], w[0] * 0.0, w[2] * 0.25);
        U.uHeatOp.value = w[2];
        overlay.show(p > NEAR_AT ? "near" : "heat");
        if (w[1] + w[2] > 0.01 && ++heatK % 60 === 0 && p <= NEAR_AT) overlay.upload();

        /* camera */
        keyed(p);
        if (first) {
          look.copy(tgt);
          first = false;
        }
        look.lerp(tgt, Math.min(1, dt * 3));
        const W = vw(), H = vh();
        const narrow = W / H < 1;
        camPos.copy(look).add(off.clone().multiplyScalar(narrow ? 1.4 : 1));
        cam.position.lerp(camPos, first ? 1 : Math.min(1, dt * 4));
        cam.lookAt(look);
        cam.setViewOffset(W, H, narrow ? 0 : shift * W, -drop * H, W, H);
        cam.updateMatrixWorld();

        /* tags, cards and panels */
        const tp = V3();
        placeTag(tagTruck, tp.set(t0.pos.x, 3.4, t0.pos.z), w[3]);
        placeTag(tagWalker, tp.set(walker.position.x, 2.3, walker.position.z), w[3]);
        trucks.forEach((tk, i) => {
          const st = FIXED[tk.r.name] ?? (tk.loadG.visible ? "Loaded" : "Moving");
          setTag(stateTags[i], st, st === "Service due" ? "warn" : st === "Loaded" ? "load" : "");
          placeTag(stateTags[i], tp.set(tk.pos.x, tk.h + 0.9, tk.pos.z), w[4]);
        });
        parked.forEach((m, i) => {
          setTag(parkedTags[i], i ? "Idle" : "Charging", i ? "idle" : "ok");
          placeTag(parkedTags[i], tp.set(m.g.position.x, 3.4, m.g.position.z), m.g.visible ? w[4] : 0);
        });
        fleet.style.opacity = w[4].toFixed(3);
        flows.forEach((f) => placeTag(f.tag, f.at, w[7]));
        panels.style.opacity = w[8].toFixed(3);
        // One card, reused: the damaged upright in chapter 5, the mismatch in 6.
        if (w[5] > w[6]) {
          cardSet("Upright damaged", [["Where", "Front run, bay " + (DAMAGED + 1)], ["State", "Unload and rectify"], ["Found by", "Drone inspection"]]);
          placeTag(card, tp.set(bays[DAMAGED].x0, 5.2, faceZ), w[5] * hurtSeen);
        } else {
          cardSet("Stock mismatch", [["System", "Stocked"], ["Found", "Empty"], ["Next", "Recount raised"]]);
          placeTag(card, tp.set(cardSlot.x, cardSlot.y + 1.6, cardSlot.z), w[6]);
        }

        for (const s of secs) {
          const f = 0.03;
          const op = (s.a === 0 ? 1 : ss(seg(p, s.a, s.a + f))) * (1 - ss(seg(p, s.b - f, s.b)));
          s.el.style.opacity = op.toFixed(3);
          s.el.style.transform = `translateY(${((1 - op) * 14).toFixed(1)}px)`;
          s.el.style.visibility = op < 0.005 ? "hidden" : "visible";
        }

        /* Past the end of the track the scrolling film fades out, handing over
           to the page. Framed, there is no end to be past. */
        const past = ambient ? 0 : Math.max(0, (window.scrollY - maxScroll()) / Math.max(1, H * 0.6));
        const fop = 1 - Math.min(1, past);
        if (!ambient && Math.abs(fop - lastOp) > 0.004) {
          lastOp = fop;
          const vis = fop < 0.01 ? "hidden" : "visible";
          for (const el of [film as HTMLElement, tagsRoot, canvas as HTMLElement]) {
            el.style.opacity = fop.toFixed(3);
            el.style.visibility = vis;
          }
        }
        if (fop >= 0.01) R.render(scene, cam);
      };

      const resize = () => {
        const W = vw(), H = vh();
        if (W < 2 || H < 2) return;
        R.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
        R.setSize(W, H, false);
        cam.aspect = W / H;
        cam.updateProjectionMatrix();
      };
      if (ambient) {
        // The frame is laid out by CSS, so watch the box, not the window.
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        cleanups.push(() => ro.disconnect());
      } else {
        window.addEventListener("resize", resize);
        cleanups.push(() => window.removeEventListener("resize", resize));
      }
      resize();

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
      console.warn("Homepage: film unavailable —", err);
      giveUp();
    });

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
    };
  }, [failed, onUnavailable, ambient]);

  if (failed) return null;

  const at = (i: number) => ({ "data-a": CH[i][0], "data-b": CH[i][1] });

  if (ambient) {
    return (
      <>
        <canvas ref={canvasRef} className="home-gl" aria-hidden />
        <div className="home-tags" ref={tagsRef} aria-hidden />
      </>
    );
  }

  return (
    <>
      <canvas ref={canvasRef} className="home-gl" aria-hidden />

      <div className="home-film" ref={filmRef}>
        <section className="hsec hero" {...at(0)}>
          <p className="kicker">RAMS Digital</p>
          <h1>Clarity in Motion.</h1>
          <p className="tag">
            Your warehouse already produces the answers. We make them <b>visible, located and live.</b>
          </p>
          <div className="hero-cta">
            <a className="btn btn-primary" href="#start">
              Find your starting point
            </a>
            <a className="btn btn-secondary" href="#systems">
              See the platform
            </a>
          </div>
          <div className="scrollcue" aria-hidden>
            Scroll<i />
          </div>
        </section>

        <section className="hsec right" {...at(1)}>
          <span className="label">Digital twin</span>
          <h2>Every move, traced.</h2>
          <p className="lead">
            Every truck leaves a line. Together they are a live map of how work actually moves through
            the building — not how the layout says it should.
          </p>
          <Chips items={["Location Intelligence", "Digital Twin"]} />
        </section>

        <section className="hsec left" {...at(2)}>
          <span className="label">Heatmaps</span>
          <h2>
            Where it’s busy.
            <br />
            Where it’s risky.
          </h2>
          <p className="lead">
            Traffic becomes heat — the lanes and crossings that carry the day. Then the near-misses,
            placed where they happened, so they can be fixed where they happen.
          </p>
          <Chips items={["Management Intelligence"]} />
        </section>

        <section className="hsec right" {...at(3)}>
          <span className="label">MHE safety</span>
          <h2>Seen before it happens.</h2>
          <p className="lead">
            A camera watches the blind crossing. A pedestrian steps out and a truck is over its zone
            limit — both flagged, located and logged.
          </p>
          <Chips items={["AI Vision", "Sensor Stack", "OmniBox"]} />
        </section>

        <section className="hsec left" {...at(4)}>
          <span className="label">MHE health & productivity</span>
          <h2>Every truck, every shift.</h2>
          <p className="lead">
            Moving, loaded, idle, charging, due for service — each truck says what it is doing, and the
            fleet says how hard it is working.
          </p>
          <Chips items={["Sensor Stack", "MHE Diagnostics"]} />
        </section>

        <section className="hsec right" {...at(5)}>
          <span className="label">Rack safety</span>
          <h2>Damage found, not reported.</h2>
          <p className="lead">
            A drone sweeps the rack face. Every bay gets a state, and the damaged upright gets a work
            order before it gets worse.
          </p>
          <Chips items={["Rack Intelligence", "Guided Inspection", "Rack Inspection"]} />
        </section>

        <section className="hsec left" {...at(6)}>
          <span className="label">Inventory</span>
          <h2>Counted where it sits.</h2>
          <p className="lead">
            Every slot, full or empty, checked against what the system believes. The mismatches light up
            — nobody walks the building to settle it.
          </p>
          <Chips items={["Inventory Intelligence"]} />
        </section>

        <section className="hsec right" {...at(7)}>
          <span className="label">Warehouse execution</span>
          <h2>Work that flows.</h2>
          <p className="lead">
            From the dock to the rack and back out again, each task goes to the right truck at the right
            time.
          </p>
          <Chips items={["Warehouse Execution"]} />
        </section>

        <section className="hsec center" {...at(8)}>
          <span className="label">One platform</span>
          <h2>One building. Every answer.</h2>
          <p className="lead">Racks, MHEs, pallets and people — one live picture, and one place to start.</p>
          <div className="hero-cta">
            <a className="btn btn-primary" href="#start">
              Find your starting point
            </a>
          </div>
        </section>
      </div>

      <div className="home-tags" ref={tagsRef} aria-hidden />

      <div className="home-space" ref={spaceRef} aria-hidden />
    </>
  );
}
