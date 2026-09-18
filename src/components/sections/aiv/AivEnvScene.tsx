"use client";

import { useEffect, useRef } from "react";
import type * as THREE_NS from "three";

/**
 * The environments diorama — the second WebGL canvas on the page.
 *
 * Four procedural low-poly scenes in a restrained clay-grey with orange
 * accents, showing *where* the camera goes rather than what it is: on a
 * forklift's overhead guard, on a robot cell fence post, above a dock door, on
 * a ceiling drop over a press. Each carries a translucent vision cone, a
 * footprint ring on the floor, and one figure who walks into it. On entry the
 * cone and ring tint from teal to red and the HUD chip over the walker's head
 * changes its reading.
 *
 * Ported from the reference build's second inline module.
 *
 * ── Why the camera is modelled again here, not reused ───────────────
 * The film above takes the loaded GLB apart and re-homes its nodes into eleven
 * explode groups, so it cannot be cloned afterwards. At this framing the full
 * model would add nothing anyway — the unit is a few dozen pixels across — so
 * the diorama builds its own stylised one at 2.6× real size, which is what
 * makes it readable on a fence post at this distance.
 *
 * ── Cost control ────────────────────────────────────────────────────
 * All four scenes are built once and toggled by `group.visible`, so a tab
 * change costs nothing. An IntersectionObserver stops the loop entirely while
 * the section is off screen — this canvas and the film's would otherwise
 * compete for the GPU on the same page.
 */

const CONE_DEG = 21;

type SceneCfg = {
  view: { pos: [number, number, number]; tgt: [number, number, number] };
  mount: [number, number, number];
  aim: [number, number, number];
  ringR: number;
  path: [[number, number, number], [number, number, number]];
  period: number;
  helmet?: boolean;
  inZone: (p: THREE_NS.Vector3) => boolean;
  chipIdle: string;
  chipAlert: string;
  build: (g: THREE_NS.Group, s: SceneState) => void;
  update?: (s: SceneState, dt: number, t: number) => void;
};

type SceneState = {
  key: string;
  group: THREE_NS.Group;
  cfg: SceneCfg;
  alertK: number;
  robT: number;
  person: THREE_NS.Group;
  coneMat: THREE_NS.MeshBasicMaterial;
  ringMat: THREE_NS.MeshBasicMaterial;
  discMat: THREE_NS.MeshBasicMaterial;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extra: any;
};

export function AivEnvScene({
  active,
  onUnavailable,
}: {
  active: string;
  onUnavailable: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<{ show: (k: string) => void } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const chip = chipRef.current;
    const stage = canvas?.parentElement;
    if (!canvas || !chip || !stage) return;

    let disposed = false;
    let raf = 0;
    const cleanups: (() => void)[] = [];

    (async () => {
      const THREE = (await import("three")) as typeof THREE_NS;
      if (disposed) return;

      const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile =
        matchMedia("(max-width:760px)").matches || /Mobi|Android/i.test(navigator.userAgent);
      const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
      const v = (a: [number, number, number]) => V3(a[0], a[1], a[2]);

      let R: THREE_NS.WebGLRenderer;
      try {
        R = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        });
      } catch {
        onUnavailable();
        return;
      }
      R.setClearColor(0x000000, 0);
      R.toneMapping = THREE.ACESFilmicToneMapping;
      R.toneMappingExposure = 1.0;
      R.shadowMap.enabled = true;
      R.shadowMap.type = THREE.PCFSoftShadowMap;

      const scene = new THREE.Scene();
      const cam = new THREE.PerspectiveCamera(30, 16 / 9, 0.1, 120);
      scene.add(new THREE.HemisphereLight(0xffffff, 0xd6d6de, 1.5));
      const sun = new THREE.DirectionalLight(0xffffff, 2.3);
      sun.position.set(5, 10, 6);
      sun.castShadow = true;
      sun.shadow.mapSize.set(isMobile ? 1024 : 2048, isMobile ? 1024 : 2048);
      Object.assign(sun.shadow.camera, {
        left: -9,
        right: 9,
        top: 9,
        bottom: -9,
        near: 1,
        far: 30,
      });
      sun.shadow.bias = -0.0004;
      sun.shadow.normalBias = 0.02;
      scene.add(sun);
      const fillL = new THREE.DirectionalLight(0xe8eeff, 0.55);
      fillL.position.set(-6, 4, -3);
      scene.add(fillL);
      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(80, 80),
        new THREE.ShadowMaterial({ opacity: 0.13 }),
      );
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      /* ── the clay palette ─────────────────────────────────── */
      const mat = (color: number, o: Partial<THREE_NS.MeshStandardMaterialParameters> = {}) =>
        new THREE.MeshStandardMaterial({ color, roughness: 0.82, metalness: 0, ...o });
      const MT = {
        clay: mat(0xe6e6eb),
        clay2: mat(0xc8c8d0),
        ink: mat(0x2b2d31, { roughness: 0.55, metalness: 0.25 }),
        orange: mat(0xff6a00, { roughness: 0.5 }),
        yellow: mat(0xffc107, { roughness: 0.6 }),
        white: mat(0xf7f7f9, { roughness: 0.5 }),
        vest: mat(0xd7e021, { roughness: 0.7 }),
        skin: mat(0xc99b76),
        pants: mat(0x4a5568, { roughness: 0.9 }),
        shirt: mat(0x5b6b7f),
        hair: mat(0x2a2420),
        green: mat(0x4caf7a),
        glass: mat(0xd4d4dc, { transparent: true, opacity: 0.34, roughness: 0.3 }),
        trailer: mat(0xf2f2f5, { roughness: 0.6 }),
      };

      const box = (
        w: number, h: number, d: number, m: THREE_NS.Material,
        x: number, y: number, z: number, parent: THREE_NS.Object3D,
      ) => {
        const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
        o.position.set(x, y, z);
        o.castShadow = o.receiveShadow = true;
        parent.add(o);
        return o;
      };
      const cyl = (
        rt: number, rb: number, h: number, m: THREE_NS.Material,
        x: number, y: number, z: number, parent: THREE_NS.Object3D, s = 24,
      ) => {
        const o = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, s), m);
        o.position.set(x, y, z);
        o.castShadow = o.receiveShadow = true;
        parent.add(o);
        return o;
      };
      const flat = (
        w: number, d: number, m: THREE_NS.Material,
        x: number, z: number, parent: THREE_NS.Object3D, y = 0.012,
      ) => {
        const o = new THREE.Mesh(new THREE.PlaneGeometry(w, d), m);
        o.rotation.x = -Math.PI / 2;
        o.position.set(x, y, z);
        o.receiveShadow = true;
        parent.add(o);
        return o;
      };
      const tex = (w: number, h: number, fn: (c: CanvasRenderingContext2D, w: number, h: number) => void) => {
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        fn(c.getContext("2d")!, w, h);
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 4;
        return t;
      };

      /* ── the unit, stylised ───────────────────────────────── */
      const LOGO = tex(256, 128, (x, w, h) => {
        x.fillStyle = "#F7F7F9";
        x.fillRect(0, 0, w, h);
        x.fillStyle = "#141414";
        x.font = '800 66px "IBM Plex Sans", Arial, sans-serif';
        x.textAlign = "center";
        x.fillText("RAMS", 116, 82);
        x.fillStyle = "#FF6A00";
        x.fillRect(196, 24, 26, 8);
        x.fillRect(214, 24, 8, 26);
      });
      const makeUnit = () => {
        const g = new THREE.Group();
        const S = 2.6;
        const W = 0.066 * S;
        const H = 0.085 * S;
        const D = 0.048 * S;
        box(W, H, D, MT.ink, 0, 0, 0, g);
        box(W * 1.03, H * 1.03, 0.005 * S, MT.white, 0, 0, D / 2 + 0.0025 * S, g);
        const logo = new THREE.Mesh(
          new THREE.PlaneGeometry(W * 0.66, W * 0.33),
          new THREE.MeshStandardMaterial({ map: LOGO, roughness: 0.6 }),
        );
        logo.position.set(0, H * 0.17, D / 2 + 0.0052 * S + 0.0015);
        g.add(logo);
        const lens = cyl(0.012 * S, 0.013 * S, 0.016 * S, MT.ink, 0, -H * 0.25, D / 2 + 0.012 * S, g);
        lens.rotation.x = Math.PI / 2;
        const glass = new THREE.Mesh(
          new THREE.CircleGeometry(0.0078 * S, 28),
          new THREE.MeshStandardMaterial({ color: 0x0b1a3a, metalness: 0.9, roughness: 0.08 }),
        );
        glass.position.set(0, -H * 0.25, D / 2 + 0.0202 * S);
        g.add(glass);
        for (const s of [1, -1]) {
          box(W * 1.01, 0.004 * S, D * 1.01, MT.orange, 0, s * (H / 2 - 0.003 * S), 0, g);
        }
        g.userData.lens = V3(0, -H * 0.25, D / 2 + 0.022 * S);
        return g;
      };

      // Unit-length cone, apex at the origin, opening along +Z, so it can be
      // scaled by the mount→aim distance and simply pointed at the target.
      const CONE_HALF = THREE.MathUtils.degToRad(CONE_DEG);
      const coneGeo = new THREE.ConeGeometry(Math.tan(CONE_HALF), 1, 48, 1, true);
      coneGeo.translate(0, -0.5, 0);
      coneGeo.rotateX(-Math.PI / 2);

      const makePerson = ({ helmet = true } = {}) => {
        const g = new THREE.Group();
        const legs: THREE_NS.Group[] = [];
        const arms: THREE_NS.Group[] = [];
        for (const s of [-1, 1]) {
          const p = new THREE.Group();
          p.position.set(s * 0.09, 0.82, 0);
          g.add(p);
          box(0.11, 0.8, 0.13, MT.pants, 0, -0.4, 0, p);
          legs.push(p);
        }
        box(0.38, 0.56, 0.22, MT.vest, 0, 1.1, 0, g);
        for (const s of [-1, 1]) {
          const p = new THREE.Group();
          p.position.set(s * 0.245, 1.35, 0);
          g.add(p);
          box(0.09, 0.56, 0.1, MT.shirt, 0, -0.28, 0, p);
          arms.push(p);
        }
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 14), MT.skin);
        head.position.y = 1.52;
        head.castShadow = true;
        g.add(head);
        const cap = new THREE.Mesh(
          new THREE.SphereGeometry(helmet ? 0.128 : 0.113, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2),
          helmet ? MT.white : MT.hair,
        );
        cap.position.y = helmet ? 1.55 : 1.53;
        cap.castShadow = true;
        g.add(cap);
        g.userData = { legs, arms };
        return g;
      };

      /* ── scene factory ────────────────────────────────────── */
      const scenes: Record<string, SceneState> = {};
      const defineScene = (key: string, cfg: SceneCfg) => {
        const group = new THREE.Group();
        group.visible = false;
        scene.add(group);
        const s: SceneState = {
          key, group, cfg, alertK: 0, robT: 0,
          person: null as unknown as THREE_NS.Group,
          coneMat: null as unknown as THREE_NS.MeshBasicMaterial,
          ringMat: null as unknown as THREE_NS.MeshBasicMaterial,
          discMat: null as unknown as THREE_NS.MeshBasicMaterial,
          extra: {},
        };
        cfg.build(group, s);

        const aim = v(cfg.aim);
        const unit = makeUnit();
        unit.position.copy(v(cfg.mount));
        group.add(unit);
        unit.lookAt(aim);
        unit.updateMatrixWorld(true);
        const lensW = unit.localToWorld((unit.userData.lens as THREE_NS.Vector3).clone());

        s.coneMat = new THREE.MeshBasicMaterial({
          color: 0x00c8ff, transparent: true, opacity: 0.1,
          depthWrite: false, side: THREE.DoubleSide,
        });
        const cone = new THREE.Mesh(coneGeo, s.coneMat);
        cone.position.copy(lensW);
        cone.lookAt(aim);
        cone.scale.setScalar(lensW.distanceTo(aim));
        cone.renderOrder = 2;
        group.add(cone);

        s.ringMat = new THREE.MeshBasicMaterial({
          color: 0x00c8ff, transparent: true, opacity: 0.75, depthWrite: false,
        });
        const ring = new THREE.Mesh(new THREE.RingGeometry(cfg.ringR - 0.05, cfg.ringR, 72), s.ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(aim.x, 0.02, aim.z);
        ring.renderOrder = 3;
        group.add(ring);

        s.discMat = new THREE.MeshBasicMaterial({
          color: 0x00c8ff, transparent: true, opacity: 0.07, depthWrite: false,
        });
        const disc = new THREE.Mesh(new THREE.CircleGeometry(cfg.ringR, 72), s.discMat);
        disc.rotation.x = -Math.PI / 2;
        disc.position.set(aim.x, 0.018, aim.z);
        group.add(disc);

        s.person = makePerson({ helmet: cfg.helmet !== false });
        group.add(s.person);
        scenes[key] = s;
      };

      /* FORKLIFTS — unit on the overhead guard, a picker stepping out from the rack end */
      defineScene("mhe", {
        view: { pos: [7.4, 5.4, 5.6], tgt: [-0.3, 0.8, -1.7] },
        mount: [-0.42, 2.36, -0.36],
        aim: [0, 0, -3.3],
        ringR: 1.15,
        path: [[-2.3, 0, -3.3], [1.9, 0, -3.3]],
        period: 7.5,
        inZone: (p) => Math.hypot(p.x, p.z + 3.3) < 1.15,
        chipIdle: "PERSON 0.97",
        chipAlert: "PERSON · 1.9 m · SLOW",
        build(g, s) {
          box(1.1, 0.7, 1.9, MT.orange, 0, 0.58, 0.15, g);
          box(1.12, 0.62, 0.5, MT.ink, 0, 0.72, 1.12, g);
          box(0.5, 0.14, 0.5, MT.ink, 0, 1.0, 0.35, g);
          box(0.5, 0.5, 0.1, MT.ink, 0, 1.28, 0.62, g);
          for (const [x, z] of [[-0.56, -0.55], [0.56, -0.55], [-0.56, 0.85], [0.56, 0.85]]) {
            const w = cyl(0.3, 0.3, 0.22, MT.ink, x, 0.3, z, g);
            w.rotation.z = Math.PI / 2;
          }
          for (const x of [-0.36, 0.36]) box(0.08, 2.5, 0.1, MT.ink, x, 1.25, -0.86, g);
          box(0.82, 0.08, 0.1, MT.ink, 0, 2.46, -0.86, g);
          box(0.82, 0.36, 0.06, MT.ink, 0, 0.48, -0.94, g);
          for (const x of [-0.22, 0.22]) box(0.1, 0.05, 1.05, MT.clay2, x, 0.3, -1.48, g);
          for (const [x, z] of [[-0.5, -0.42], [0.5, -0.42], [-0.5, 0.86], [0.5, 0.86]]) {
            box(0.06, 1.28, 0.06, MT.ink, x, 1.58, z, g);
          }
          box(1.08, 0.06, 1.4, MT.ink, 0, 2.24, 0.22, g);
          const beaconMat = MT.orange.clone();
          beaconMat.emissive = new THREE.Color(0xff6a00);
          beaconMat.emissiveIntensity = 0;
          s.extra.beacon = cyl(0.07, 0.07, 0.1, beaconMat, 0.36, 2.33, 0.72, g, 16);

          // Racking kept low and set back: context for the aisle, never a wall
          // in front of the story.
          const rack = (x: number, z0: number, z1: number) => {
            const len = z1 - z0;
            const zc = (z0 + z1) / 2;
            for (let z = z0; z <= z1 + 0.01; z += 1.8) {
              for (const dx of [-0.45, 0.45]) box(0.06, 2.2, 0.06, MT.clay2, x + dx, 1.1, z, g);
            }
            for (const y of [0.2, 1.05, 1.9]) {
              for (const dx of [-0.45, 0.45]) box(0.05, 0.1, len, MT.orange, x + dx, y, zc, g);
            }
            for (let z = z0 + 0.9; z < z1; z += 1.8) {
              for (const y of [0.25, 1.1]) box(0.8, 0.55, 1.2, MT.clay, x, y + 0.28, z, g);
            }
          };
          rack(-3.2, -6.2, -1.6);
          rack(3.2, -6.2, -1.6);
          flat(0.08, 8, MT.yellow, -2.35, -2.6, g);
          flat(0.08, 8, MT.yellow, 2.35, -2.6, g);
        },
        update(s, dt, t) {
          const on = s.alertK > 0.5 && Math.sin(t * 14) > 0;
          s.extra.beacon.material.emissiveIntensity = on ? 2.2 : 0;
        },
      });

      /* ROBOTIC CELLS — unit on a fence post, a technician walking in through the gap */
      defineScene("cell", {
        view: { pos: [6.2, 5.2, 6.8], tgt: [0, 0.9, 0.2] },
        mount: [1.62, 2.22, 1.62],
        aim: [0, 0, 0.55],
        ringR: 1.3,
        path: [[0, 0, 3.6], [0, 0, 0.55]],
        period: 8,
        inZone: (p) => Math.abs(p.x) < 1.55 && p.z < 1.5,
        chipIdle: "PERSON 0.96",
        chipAlert: "PERSON IN CELL · STOP",
        build(g, s) {
          flat(3.2, 3.2, MT.clay2, 0, 0, g, 0.006);
          const posts: [number, number][] = [
            [-1.6, -1.6], [0, -1.6], [1.6, -1.6], [-1.6, 0], [1.6, 0],
            [-1.6, 1.6], [-0.5, 1.6], [0.5, 1.6], [1.6, 1.6],
          ];
          for (const [x, z] of posts) box(0.08, 2.1, 0.08, MT.yellow, x, 1.05, z, g);
          const panel = (x: number, z: number, len: number, alongX: boolean) =>
            box(alongX ? len : 0.02, 1.8, alongX ? 0.02 : len, MT.glass, x, 1.08, z, g);
          panel(-0.8, -1.6, 1.52, true); panel(0.8, -1.6, 1.52, true);
          panel(-1.6, -0.8, 1.52, false); panel(-1.6, 0.8, 1.52, false);
          panel(1.6, -0.8, 1.52, false); panel(1.6, 0.8, 1.52, false);
          panel(-1.05, 1.6, 1.02, true); panel(1.05, 1.6, 1.02, true);
          box(1.0, 0.55, 0.7, MT.clay, 0.75, 0.28, -0.6, g);

          const base = new THREE.Group();
          base.position.set(-0.35, 0, -0.55);
          g.add(base);
          cyl(0.32, 0.38, 0.3, MT.ink, 0, 0.15, 0, base);
          const j1 = new THREE.Group(); j1.position.y = 0.3; base.add(j1);
          cyl(0.24, 0.26, 0.32, MT.orange, 0, 0.16, 0, j1);
          const j2 = new THREE.Group(); j2.position.y = 0.36; j1.add(j2);
          box(0.18, 1.05, 0.2, MT.orange, 0, 0.52, 0, j2);
          const j3 = new THREE.Group(); j3.position.y = 1.04; j2.add(j3);
          box(0.15, 0.85, 0.16, MT.orange, 0, 0.42, 0, j3);
          box(0.12, 0.22, 0.12, MT.ink, 0, 0.95, 0, j3);
          s.extra.j = { j1, j2, j3 };
        },
        update(s, dt) {
          // The arm slows almost to a stop while someone is in the cell.
          s.robT += dt * (1 - 0.97 * s.alertK) * (reduceMotion ? 0 : 1);
          const t = s.robT;
          s.extra.j.j1.rotation.y = Math.sin(t * 0.7) * 1.1;
          s.extra.j.j2.rotation.x = -0.35 + Math.sin(t * 0.9) * 0.3;
          s.extra.j.j3.rotation.x = 1.25 + Math.sin(t * 0.75 + 1) * 0.35;
        },
      });

      /* DOORS & DOCKS — unit above the shutter, someone cutting across the doorway */
      defineScene("dock", {
        view: { pos: [5.4, 4.6, 9.4], tgt: [0, 2.0, -0.5] },
        mount: [0, 4.1, -1.22],
        aim: [0, 0, 0.45],
        ringR: 1.25,
        path: [[2.9, 0, 0.5], [-2.3, 0, 0.5]],
        period: 9,
        inZone: (p) => Math.abs(p.x) < 1.25,
        chipIdle: "PERSON 0.95",
        chipAlert: "PERSON · DOOR 3 · CROSSING",
        build(g) {
          const wz = -1.5;
          box(3.2, 4.6, 0.25, MT.clay, -2.7, 2.3, wz, g);
          box(3.2, 4.6, 0.25, MT.clay, 2.7, 2.3, wz, g);
          box(2.2, 1.3, 0.25, MT.clay, 0, 3.95, wz, g);
          box(2.1, 1.0, 0.1, MT.clay2, 0, 2.8, wz + 0.02, g);
          for (let i = 0; i < 5; i++) box(2.1, 0.02, 0.11, MT.clay, 0, 2.35 + i * 0.2, wz + 0.03, g);
          for (const x of [-1.12, 1.12]) box(0.1, 3.3, 0.3, MT.yellow, x, 1.65, wz + 0.02, g);
          box(2.0, 0.08, 1.0, MT.ink, 0, 0.04, wz + 0.55, g);
          box(2.4, 2.7, 4.2, MT.trailer, 0, 1.95, wz - 2.4, g);
          box(2.42, 0.2, 4.22, MT.ink, 0, 0.55, wz - 2.4, g);
          flat(1.1, 5, MT.green, 2.3, 1.2, g);
          flat(0.07, 5, MT.yellow, 1.72, 1.2, g);
          flat(0.07, 5, MT.yellow, -1.72, 1.2, g);
          box(1.0, 0.14, 1.0, MT.clay2, -2.7, 0.07, 0.9, g);
          box(0.92, 0.8, 0.92, MT.clay, -2.7, 0.54, 0.9, g);
        },
      });

      /* HAZARD ZONES — unit on a ceiling drop, a worker without a helmet at the press */
      defineScene("zone", {
        view: { pos: [-6.4, 5.6, 8.2], tgt: [0.2, 1.7, -0.3] },
        mount: [1.7, 3.62, 2.1],
        aim: [0, 0, 0.25],
        ringR: 1.35,
        path: [[2.9, 0, 2.3], [0.35, 0, 0.15]],
        period: 8.5,
        helmet: false,
        inZone: (p) => Math.abs(p.x) < 1.3 && p.z > -0.85 && p.z < 1.35,
        chipIdle: "PERSON · PPE CHECK",
        chipAlert: "NO HELMET · ZONE B",
        build(g, s) {
          const hatch = tex(512, 512, (x, w, h) => {
            x.fillStyle = "#2B2D31";
            x.fillRect(0, 0, w, h);
            x.save();
            x.translate(w / 2, h / 2);
            x.rotate(-Math.PI / 4);
            x.fillStyle = "#FFC107";
            for (let i = -w; i < w; i += 64) x.fillRect(i, -h, 32, h * 2);
            x.restore();
          });
          hatch.wrapS = hatch.wrapT = THREE.RepeatWrapping;
          hatch.repeat.set(2.6, 2.2);
          flat(
            2.6, 2.2,
            new THREE.MeshStandardMaterial({ map: hatch, roughness: 0.9, transparent: true, opacity: 0.9 }),
            0, 0.25, g, 0.008,
          );
          box(1.8, 1.0, 1.3, MT.ink, 0, 0.5, -1.5, g);
          for (const x of [-0.78, 0.78]) box(0.2, 2.3, 0.2, MT.clay2, x, 2.15, -1.5, g);
          box(1.95, 0.6, 1.45, MT.orange, 0, 3.3, -1.5, g);
          s.extra.ram = box(1.1, 0.34, 0.9, MT.clay2, 0, 2.3, -1.5, g);
          box(1.2, 0.12, 0.9, MT.clay, 0, 1.06, -1.5, g);
          box(6.5, 0.14, 0.14, MT.ink, 0, 4.25, 2.1, g);
          cyl(0.025, 0.025, 0.6, MT.ink, 1.7, 3.95, 2.1, g, 10);
          // A colleague at the bench, correctly kitted — the contrast is the point.
          box(1.4, 0.9, 0.7, MT.clay, -2.9, 0.45, 1.0, g);
          const mate = makePerson({ helmet: true });
          mate.position.set(-2.9, 0, 1.6);
          mate.rotation.y = Math.PI;
          g.add(mate);
        },
        update(s, dt) {
          s.robT += dt * (1 - s.alertK) * (reduceMotion ? 0 : 1);
          s.extra.ram.position.y = 2.1 + Math.abs(Math.sin(s.robT * 1.2)) * 0.45;
        },
      });

      /* ── camera + interaction ─────────────────────────────── */
      const Y = V3(0, 1, 0);
      const curPos = V3();
      const curTgt = V3();
      const want = V3();
      const rel = V3();
      const headV = V3();
      const ndc = V3();
      const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
      let activeKey = active;
      let time = 0;

      const onPtrMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const b = stage.getBoundingClientRect();
        ptr.tx = ((e.clientX - b.left) / b.width - 0.5) * 2;
        ptr.ty = ((e.clientY - b.top) / b.height - 0.5) * 2;
      };
      const onPtrLeave = () => {
        ptr.tx = ptr.ty = 0;
      };
      stage.addEventListener("pointermove", onPtrMove, { passive: true });
      stage.addEventListener("pointerleave", onPtrLeave, { passive: true });
      cleanups.push(() => {
        stage.removeEventListener("pointermove", onPtrMove);
        stage.removeEventListener("pointerleave", onPtrLeave);
      });

      // A narrow frame needs the camera further out or the scene crops.
      const aspectPush = () => {
        const a = cam.aspect;
        return a < 0.9 ? 1.32 : a < 1.3 ? 1.18 : 1;
      };
      const desired = (s: SceneState, extraAng: number, out: THREE_NS.Vector3) => {
        rel.subVectors(v(s.cfg.view.pos), v(s.cfg.view.tgt)).multiplyScalar(aspectPush());
        const ang = (reduceMotion ? 0 : Math.sin(time * 0.16) * 0.12) + ptr.x * 0.16 + extraAng;
        rel.applyAxisAngle(Y, ang);
        rel.y += ptr.y * -0.35;
        return out.copy(v(s.cfg.view.tgt)).add(rel);
      };
      const show = (key: string, instant: boolean) => {
        if (!scenes[key]) return;
        activeKey = key;
        for (const k in scenes) scenes[k].group.visible = k === key;
        const s = scenes[key];
        // A tab change starts the camera 0.38rad off and eases in, so the new
        // scene arrives with a small move rather than a hard cut.
        desired(s, instant ? 0 : 0.38, curPos);
        curTgt.copy(v(s.cfg.view.tgt));
      };
      show(activeKey, true);

      apiRef.current = {
        show: (key) => {
          if (reduceMotion) {
            show(key, true);
            return;
          }
          stage.classList.add("swap");
          window.setTimeout(() => {
            show(key, false);
            stage.classList.remove("swap");
          }, 200);
        },
      };

      /* ── per-frame ────────────────────────────────────────── */
      const frame = (dt: number) => {
        time += dt;
        ptr.x += (ptr.tx - ptr.x) * Math.min(1, dt * 3);
        ptr.y += (ptr.ty - ptr.y) * Math.min(1, dt * 3);
        const s = scenes[activeKey];
        if (!s) return;

        desired(s, 0, want);
        curPos.lerp(want, Math.min(1, dt * 2.2));
        curTgt.lerp(v(s.cfg.view.tgt), Math.min(1, dt * 2.2));
        cam.position.copy(curPos);
        cam.lookAt(curTgt);

        // The walker ping-pongs along the path on a cosine, which pauses
        // naturally at each end instead of snapping round.
        const a = v(s.cfg.path[0]);
        const b = v(s.cfg.path[1]);
        let u: number;
        let vel: number;
        if (reduceMotion) {
          u = 0.86;
          vel = 0;
        } else {
          const ph = (time * 2 * Math.PI) / s.cfg.period;
          u = 0.5 - 0.5 * Math.cos(ph);
          vel = Math.sin(ph);
        }
        const P = s.person;
        P.position.lerpVectors(a, b, u);
        if (Math.abs(vel) > 0.02) {
          P.rotation.y = Math.atan2(
            (b.x - a.x) * Math.sign(vel),
            (b.z - a.z) * Math.sign(vel),
          );
        }
        const swing = Math.sin(time * 7.5) * 0.55 * Math.min(1, Math.abs(vel) * 1.6);
        const ud = P.userData as { legs: THREE_NS.Group[]; arms: THREE_NS.Group[] };
        ud.legs[0].rotation.x = swing;
        ud.legs[1].rotation.x = -swing;
        ud.arms[0].rotation.x = -swing * 0.7;
        ud.arms[1].rotation.x = swing * 0.7;
        P.position.y = Math.abs(Math.sin(time * 7.5)) * 0.03 * Math.min(1, Math.abs(vel) * 1.6);

        const inside = s.cfg.inZone(P.position);
        s.alertK += ((inside ? 1 : 0) - s.alertK) * Math.min(1, dt * 6);
        const k = s.alertK;
        const col = new THREE.Color(0x00c8ff).lerp(new THREE.Color(0xff6c6c), k);
        s.coneMat.color.copy(col);
        s.coneMat.opacity = 0.1 + 0.1 * k;
        s.ringMat.color.copy(col);
        s.discMat.color.copy(col);
        s.discMat.opacity = 0.07 + 0.1 * k;
        s.cfg.update?.(s, dt, time);

        // The chip rides over the walker's head, in the stage's own pixels.
        headV.copy(P.position);
        headV.y = 2.0;
        ndc.copy(headV).project(cam);
        const w = stage.clientWidth;
        const h = stage.clientHeight;
        chip.style.transform = `translate(${((ndc.x * 0.5 + 0.5) * w).toFixed(1)}px,${((-ndc.y * 0.5 + 0.5) * h).toFixed(1)}px) translate(-50%,-100%)`;
        chip.style.opacity = ndc.z < 1 ? "1" : "0";
        const alert = k > 0.5;
        if (chip.classList.contains("alert") !== alert) chip.classList.toggle("alert", alert);
        const txt = alert ? s.cfg.chipAlert : s.cfg.chipIdle;
        if (chip.textContent !== txt) chip.textContent = txt;

        R.render(scene, cam);
      };

      const resize = () => {
        const w = stage.clientWidth;
        const h = stage.clientHeight;
        if (!w || !h) return;
        R.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
        R.setSize(w, h, false);
        cam.aspect = w / h;
        cam.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(stage);
      resize();
      cleanups.push(() => ro.disconnect());

      // Render only while on screen. The film above owns the same GPU.
      let running = false;
      let last = 0;
      const loop = (t: number) => {
        if (!running) {
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
        { rootMargin: "120px" },
      );
      io.observe(stage);
      cleanups.push(() => io.disconnect());

      cleanups.push(() => {
        running = false;
        scene.traverse((o) => {
          const m = o as THREE_NS.Mesh;
          if (!m.isMesh) return;
          m.geometry?.dispose();
          const mats = Array.isArray(m.material) ? m.material : [m.material];
          mats.forEach((x) => x?.dispose());
        });
        R.dispose();
      });
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      apiRef.current = null;
      cleanups.forEach((fn) => fn());
    };
    // Built once. Tab changes go through `apiRef`, below, so the four scenes
    // are never rebuilt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    apiRef.current?.show(active);
  }, [active]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="env-canvas"
        aria-label="3D view of the AI Camera mounted in the selected environment"
        role="img"
      />
      <div className="env-chip" ref={chipRef} aria-hidden />
    </>
  );
}
