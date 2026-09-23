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

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/**
 * One extra camera on the same subject. `yaw` is its heading in the scene's
 * own XZ plane (0 = -Z, the way the truck faces), `fov` the horizontal spread
 * it covers on the floor, and `range` how far out that coverage reaches.
 *
 * The footprint is drawn as a sector rather than a circle because that is what
 * a camera actually sees: a wedge opening along its heading. Four wedges that
 * meet edge to edge are the argument the forklift scene is making — no blind
 * spot round the truck — and four overlapping circles could not make it.
 */
type ExtraCam = {
  mount: [number, number, number];
  yaw: number;
  fov: number;
  range: number;
  pitch?: number;
  /** Draw this one's cone too. Off by default — four rays on one truck is
   *  haze, but the front pair together is the pair that matters. */
  ray?: boolean;
  /** Horizontal half-angle in radians. Defaults to CONE_DEG. */
  half?: number;
};

type SceneCfg = {
  view: { pos: [number, number, number]; tgt: [number, number, number] };
  mount: [number, number, number];
  aim: [number, number, number];
  ringR: number;
  path: [[number, number, number], [number, number, number]];
  period: number;
  helmet?: boolean;
  inZone: (p: THREE_NS.Vector3) => boolean;
  /** Extra units beyond the primary one. Hardware only — no floor shape. */
  cams?: ExtraCam[];
  /** Swings the primary footprint off its aim heading, in radians. */
  frontYaw?: number;
  /** Horizontal half-angle of the primary cone, in radians. */
  half?: number;
  /** Where the scene's own cameras are, for the coverage test. */
  watch?: { at: [number, number, number]; yaw: number; half: number; range: number }[];
  chipIdle: string;
  /** Shown when no camera on this scene covers the walker. */
  chipUnseen?: string;
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
  /** Which way along `path` the walker is facing; held through the pauses. */
  faceDir: number;
  coneMat: THREE_NS.MeshBasicMaterial;
  /** Cone, sector and edge materials for the extra units, tinted with the alert. */
  extraMats: THREE_NS.MeshBasicMaterial[];
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
        /* Cartons are board, not plastic. White boxes read as blocks of
           nothing; kraft gives the racking something warm to sit against and
           tells you at a glance what is stored. Two tones, so a stack is not
           one flat colour. */
        card: mat(0xd8b981, { roughness: 0.93 }),
        card2: mat(0xc9a86c, { roughness: 0.93 }),
        ink: mat(0x2b2d31, { roughness: 0.55, metalness: 0.25 }),
        orange: mat(0xff6a00, { roughness: 0.5 }),
        yellow: mat(0xffc107, { roughness: 0.6 }),
        white: mat(0xf7f7f9, { roughness: 0.5 }),
        vest: mat(0xd7e021, { roughness: 0.7 }),
        skin: mat(0xc99b76),
        pants: mat(0x4a5568, { roughness: 0.9 }),
        shirt: mat(0x5b6b7f),
        hair: mat(0x2a2420),
        boot: mat(0x33302e, { roughness: 0.85 }),
        glove: mat(0x2f3540, { roughness: 0.9 }),
        /* Retroreflective banding, so the vest reads as workwear rather
           than as a yellow shirt. Low roughness is the whole trick. */
        tape: mat(0xeef3f7, { roughness: 0.22, metalness: 0.15 }),
        green: mat(0x4caf7a),
        red: mat(0xe0483a, { roughness: 0.5 }),
        steel: mat(0x9ba1a9, { roughness: 0.42, metalness: 0.45 }),
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

      /* ── the figure ───────────────────────────────────────
         Five of these stand on this page: one walker per scene, plus the
         bench hand in Zone B. Geometry is built once and shared, because
         the four scene groups all stay resident and only toggle `visible`
         — five figures' worth of unshared limbs would be paid for on every
         tab, not just the open one.

         Proportions are a 1.75 m adult. The number is load-bearing rather
         than cosmetic: the HUD chip is pinned at y = 2.0 and the cameras
         are aimed at real mount heights taken from the mount plate, so a
         figure built to no particular scale would quietly make both of
         those lie about the same floor.

         The rig is five joints deep — hip, knee, ankle, shoulder, elbow —
         over a pelvis and a spine that can turn against each other. That
         is the least that lets a walk read as walking rather than as two
         boxes scissoring, which is what was here before. */
      /* Pelvis height off the floor. Named because two places need it: the
         build, and the walk's up-and-down bob, which moves the pelvis
         relative to it. */
      const HIP_Y = 0.92;
      const capsule = (r: number, len: number) => new THREE.CapsuleGeometry(r, len, 5, 12);
      const GEO = {
        leg: capsule(0.079, 0.64),
        arm: capsule(0.056, 0.44),
        shoe: new THREE.BoxGeometry(0.11, 0.075, 0.23),
        torso: new THREE.CylinderGeometry(0.168, 0.142, 0.54, 16),
        band: new THREE.CylinderGeometry(0.172, 0.163, 0.038, 16, 1, true),
        /* A little larger than a 1.75 m adult's head really is. Drawn to
           life it disappeared under the helmet on a body this plain; the
           figure read as headless at a glance. */
        head: new THREE.SphereGeometry(0.126, 18, 14),
        helmet: new THREE.SphereGeometry(0.152, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
        brim: new THREE.CylinderGeometry(0.174, 0.158, 0.02, 18),
        hair: new THREE.SphereGeometry(0.134, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.56),
      };

      type Rig = {
        legs: THREE_NS.Group[]; shins: THREE_NS.Group[]; feet: THREE_NS.Group[];
        arms: THREE_NS.Group[]; fores: THREE_NS.Group[];
        hips: THREE_NS.Group; spine: THREE_NS.Group; head: THREE_NS.Group;
      };

      const makePerson = ({ helmet = true } = {}) => {
        const g = new THREE.Group();
        /* Deliberately plain: a hi-vis jacket over torso and arms, trousers,
           shoes, head, helmet. Nothing else.

           The figure this replaces had the parts a real body has — ball
           shoulders, separate hands, a neck, a vest shell over a shirt, boots
           with toe caps — and at the size it is actually seen (a 1.75 m
           person in a wide shot of a whole aisle) none of them read as what
           they are. They read as lumps: shoulders that look detached, hands
           that float, feet too big for the legs. So this is one tapered body
           with two reflective bands, limbs of a single width each, and flat
           shoes — the toy-scale language the forklift and the racking around
           it are already drawn in, and a clean silhouette at any distance.

           The limbs are one piece each and swing from the hip and the
           shoulder only. A knee and an elbow were tried, and on a figure this
           size and this plain they drew the eye to the fold rather than to
           the walk. The pelvis and spine still turn against each other, which
           is what carries the gait now.

           Shadows are the real budget here, not triangles: every casting mesh
           is a second pass through the shadow camera, and five figures stand
           on this page. Only the silhouette casts — limbs, body, head. */
        const part = (
          geo: THREE_NS.BufferGeometry, m: THREE_NS.Material, parent: THREE_NS.Object3D,
          y = 0, z = 0, shadow = false,
        ) => {
          const o = new THREE.Mesh(geo, m);
          o.position.set(0, y, z);
          o.castShadow = shadow;
          parent.add(o);
          return o;
        };
        const joint = (parent: THREE_NS.Object3D, x: number, y: number) => {
          const j = new THREE.Group();
          j.position.set(x, y, 0);
          parent.add(j);
          return j;
        };

        const hips = joint(g, 0, HIP_Y);
        const legs: THREE_NS.Group[] = [];
        const shins: THREE_NS.Group[] = [];
        const feet: THREE_NS.Group[] = [];
        for (const sd of [-1, 1]) {
          const hip = joint(hips, sd * 0.097, 0);
          part(GEO.leg, MT.pants, hip, -0.41, 0, true);
          /* The knee and ankle groups stay, empty, so the rig keeps its shape
             for anything that reads it — but nothing hangs off the knee, so
             nothing bends there. */
          const knee = joint(hip, 0, -0.82);
          const ankle = joint(knee, 0, 0);
          part(GEO.shoe, MT.boot, ankle, -0.038, 0.03);
          legs.push(hip); shins.push(knee); feet.push(ankle);
        }

        const spine = joint(hips, 0, 0);
        const body = part(GEO.torso, MT.vest, spine, 0.27, 0, true);
        body.scale.set(1.28, 1, 0.82);
        for (const y of [0.17, 0.37]) {
          const b = part(GEO.band, MT.tape, spine, y);
          b.scale.set(1.28, 1, 0.82);
        }

        const arms: THREE_NS.Group[] = [];
        const fores: THREE_NS.Group[] = [];
        for (const sd of [-1, 1]) {
          const sh = joint(spine, sd * 0.2, 0.45);
          // Splay, or the forearm swings across the belly on every stride —
          // the one pose that still read as wrong once the shapes were simple.
          sh.rotation.z = -sd * 0.17;
          part(GEO.arm, MT.vest, sh, -0.28, 0, true);
          const el = joint(sh, 0, -0.56);
          arms.push(sh); fores.push(el);
        }

        const head = joint(spine, 0, 0.68);
        part(GEO.head, MT.skin, head, 0, 0, true);
        if (helmet) {
          part(GEO.helmet, MT.white, head, 0.004, 0, true);
          part(GEO.brim, MT.white, head, 0.002, 0.03);
        } else {
          part(GEO.hair, MT.hair, head, 0.004, 0, true);
        }

        g.userData = { legs, shins, feet, arms, fores, hips, spine, head } satisfies Rig;
        return g;
      };

      /* One gait, driven by distance rather than by the clock.
         The old walk ran `sin(time * 7.5)` for the legs while the position
         came from the path fraction, so the two were unrelated and the feet
         slid along the floor — the single thing that most reads as fake in
         a walking figure. Phase is now metres travelled over stride length,
         which makes a step a fixed distance whatever the loop is doing.

         `amt` is how much of the walk to apply, so a standing figure relaxes
         into the same rig rather than snapping to a T-pose. That matters:
         under `prefers-reduced-motion` the scene parks with the walker
         stationary, and the parked frame is the whole of what those readers
         ever see. */
      const STRIDE = 1.42;
      const poseWalk = (P: THREE_NS.Group, dist: number, amt: number) => {
        const r = P.userData as Rig;
        const ph = (dist / STRIDE) * Math.PI * 2;
        const sn = Math.sin(ph);
        for (let i = 0; i < 2; i++) {
          const d = i === 0 ? 1 : -1;
          const hip = sn * d;
          r.legs[i].rotation.x = hip * 0.6 * amt;
          /* Straight leg: the ankle only keeps the shoe level as the leg
             swings, so the foot does not point at the floor mid-stride. */
          r.feet[i].rotation.x = -hip * 0.6 * amt;
          // Arms run against the legs, swinging from the shoulder alone.
          r.arms[i].rotation.x = -hip * 0.5 * amt;
        }
        /* Twice a cycle, because the body rises over each planted leg. Note
           the `HIP_Y +`: this used to assign the bob straight to the pelvis,
           which threw away the pelvis's own height and dropped every walking
           figure 0.92 m into the floor. It only showed where something opaque
           was lying on the floor to cut them off at the waist — the hatched
           mat in Zone B — so the same bug looked like three different ones. */
        r.hips.position.y = HIP_Y - Math.cos(ph * 2) * 0.016 * amt;
        r.hips.rotation.z = sn * 0.05 * amt;
        /* Pelvis and shoulders turn against each other — the pelvis leads
           the stride, the spine gives most of it back, and the head holds
           its own line. Without this the upper body rides along as one
           rigid block, which is the other half of why the old figure read
           as a mannequin being slid across the floor. */
        r.hips.rotation.y = sn * 0.1 * amt;
        r.spine.rotation.y = -sn * 0.17 * amt;
        r.spine.rotation.x = 0.05 + Math.abs(sn) * 0.025 * amt;
        r.head.rotation.y = sn * 0.07 * amt;
      };

      /* ── scene factory ────────────────────────────────────── */
      const scenes: Record<string, SceneState> = {};
      const defineScene = (key: string, cfg: SceneCfg) => {
        const group = new THREE.Group();
        group.visible = false;
        scene.add(group);
        const s: SceneState = {
          key, group, cfg, alertK: 0, robT: 0, faceDir: 1,
          person: null as unknown as THREE_NS.Group,
          coneMat: null as unknown as THREE_NS.MeshBasicMaterial,
          extraMats: [],
          extra: {},
        };
        cfg.build(group, s);

        /* Trim the shadow pass.
           `box()` and `cyl()` cast by default, which is right for structure
           and wrong for the detail that now sits inside it — a 30 mm bolt
           head, a stack-light lens, a rack of spanners on a board. Each one
           is a full extra pass through the shadow camera and moves no pixel,
           because it is enclosed by something already casting.

           So: anything whose longest side is under 150 mm stops casting. It
           still receives, so nothing goes flat. That is about one in eight of
           the literal call sites and rather more than that in meshes, because
           the ones it catches — cabinet louvres, door slats, flywheel spokes,
           stack-light lenses, the spanners on the tool board — are mostly the
           ones written inside loops. It is a trim, not a transformation.

           Run here rather than at each call site because it is one rule, and a
           rule stated once cannot drift from the forty places that would
           otherwise have to repeat it.
           It only ever turns casting off, so the figure's own flags — set
           deliberately in `makePerson` — survive it untouched. */
        const sz = new THREE.Vector3();
        group.traverse((o) => {
          const m = o as THREE_NS.Mesh;
          if (!m.isMesh || !m.castShadow) return;
          m.geometry.computeBoundingBox();
          m.geometry.boundingBox!.getSize(sz);
          if (Math.max(sz.x * m.scale.x, sz.y * m.scale.y, sz.z * m.scale.z) < 0.15) {
            m.castShadow = false;
          }
        });

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
        /* `coneGeo` is built at CONE_DEG. Scaling its cross-section widens the
           spread without a second geometry: length along Z, spread across X/Y. */
        {
          const d = lensW.distanceTo(aim);
          const wide = Math.tan(cfg.half ?? THREE.MathUtils.degToRad(CONE_DEG))
            / Math.tan(THREE.MathUtils.degToRad(CONE_DEG));
          cone.scale.set(d * wide, d * wide, d);
        }
        cone.renderOrder = 2;
        group.add(cone);

        /* No floor shape. The cone from the lens already says where the
           camera is looking, and the trapezium under it was a second drawing
           of the same fact — one that also flattened the moment the walker was
           standing on it. What is left is the ray and the truck. */

        /* ── the other units ─────────────────────────────────
           Each gets a real camera body, a cone from its lens, and a floor
           sector along its heading. Their materials go into `s.extraMats` so
           the alert tint reaches them too — a blind-spot claim that only
           lights up at the front would be arguing against itself. */
        s.extraMats = [];
        for (const c of cfg.cams ?? []) {
          const m = v(c.mount);
          const pitch = c.pitch ?? 0.34;

          /* The unit itself, aimed where its footprint lands. No cone: four
             translucent cones radiating off one truck turned the scene into a
             haze and buried the thing they were meant to frame. The floor
             shape carries the coverage on its own, which is also how a fitter
             would describe it — where it reaches on the ground. */
          const look = m.clone().add(new THREE.Vector3(
            Math.sin(c.yaw) * c.range,
            -Math.sin(pitch) * c.range,
            -Math.cos(c.yaw) * c.range,
          ));
          const u = makeUnit();
          u.position.copy(m);
          group.add(u);
          u.lookAt(look);

          if (c.ray) {
            u.updateMatrixWorld(true);
            const lw = u.localToWorld((u.userData.lens as THREE_NS.Vector3).clone());
            const cm = new THREE.MeshBasicMaterial({
              color: 0x00c8ff, transparent: true, opacity: 0.1,
              depthWrite: false, side: THREE.DoubleSide,
            });
            const cn = new THREE.Mesh(coneGeo, cm);
            cn.position.copy(lw);
            cn.lookAt(look);
            {
              const d = lw.distanceTo(look);
              const wide = Math.tan(c.half ?? THREE.MathUtils.degToRad(CONE_DEG))
                / Math.tan(THREE.MathUtils.degToRad(CONE_DEG));
              cn.scale.set(d * wide, d * wide, d);
            }
            cn.renderOrder = 2;
            group.add(cn);
            cm.userData = { base: 0.1, lift: 0.1 };
            s.extraMats.push(cm);
          }

          /* No floor shape on these. Four coverage areas on one truck was a
             lot of geometry saying one thing, and the front unit's is the one
             that matters — it is the direction of travel, and the direction
             the walker steps into. The other three stay visible as hardware,
             which is what actually proves the fit.

             `extraMats` is left empty rather than removed: `defineScene` and
             the alert tint both still read it, and a scene may want its own
             coverage back later. */
        }

        s.person = makePerson({ helmet: cfg.helmet !== false });
        group.add(s.person);
        scenes[key] = s;
      };

      /* FORKLIFTS — unit on the overhead guard, a picker stepping out from the rack end */
      defineScene("mhe", {
        view: { pos: [7.4, 5.4, 5.6], tgt: [-0.3, 0.8, -1.7] },
        /* Mount points are the product's own, lifted from
           `AI Camera Webpage/rams-mount-config.js` — the coordinates its mount
           editor writes, in the truck's own space, at the documented 25-degree
           pitch. Five units: a front pair toed outward, a pair on the flanks,
           one astern.

           Its yaw convention is 180 = forward, 0 = astern, ±90 = the flanks;
           this scene's is 0 = forward with +yaw toward +X. The conversion is
           `sceneYaw = 180 - refYaw`, which is why the numbers below look
           unlike the file they came from.

           The primary — the one that draws its coverage — is FRONT RIGHT. It
           is toed 17 degrees off centre by the real mount, which is where the
           rightward swing now comes from: a fitted position rather than a
           nudge applied afterwards. */
        /* All five sit 180 mm further back than the mount file's own numbers.
           The aim moves with them: leave it where it was and the shift becomes
           a change of heading rather than a change of position, which would
           quietly undo the 17-degree toe-out the mount is there to provide. */
        mount: [0.6, 2.155, 0.38],
        /* Toed 2.3 degrees out, not 17. The mount plate's own toe-out threw
           each front cone so far off centre that the pair, wide enough to
           meet in the middle, covered the whole crossing — the walker was
           inside the fan from the moment he left one rack run until he
           reached the other, so the tab never showed him being picked up.
           Brought nearly straight ahead, the two cones still overlap on the
           centreline but stop short of the rack faces. */
        aim: [0.78, 0, -4.04],
        ringR: 1.15,
        /* 15 degrees each side, and the number is solved, not chosen. The
           walker crosses at z -2.55, which is 2.93 m ahead of the front
           lenses at z 0.38. At that depth each cone reaches 2.93 x tan(half)
           either side of its own axis, so the pair covers |x| < 1.50 — and
           the walk runs to |x| 2.40. That is the whole point of this tab: he
           leaves cover outside the fan and is not seen, is picked up 0.9 m
           into the crossing, and drops out again 0.9 m before he reaches the
           far rack. Widen this and he is detected the whole way across;
           narrow it much further and the two cones stop overlapping on the
           centreline, which opens a blind notch exactly where he passes the
           forks. */
        half: 0.26,
        /* The same two cameras, as plain numbers the detection test can read.
           Kept beside the mounts deliberately: if one moves and this does not,
           the scene starts claiming to see something it cannot. */
        watch: [
          { at: [0.6, 2.155, 0.38], yaw: 0.04, half: 0.26, range: 4.2 },
          { at: [-0.6, 2.155, 0.38], yaw: -0.04, half: 0.26, range: 4.2 },
        ],
        /* Three more units, so the four between them leave nothing uncovered.
           Headings are in radians clockwise from the truck's own forward (-Z):
           right flank, left flank, and one facing back over the counterweight.

           The numbers are derived, not chosen. The front unit only spreads
           2 x CONE_DEG = 42 degrees, so sides squared off at 90 degrees left
           a 14-degree wedge of floor uncovered on each shoulder — precisely
           the blind spot the scene exists to deny. Toeing the sides forward to
           1.30 rad and widening them to 2.10 closes every seam with 7-9
           degrees of overlap. If CONE_DEG changes, re-derive these. */
        cams: [
          /* The other half of the front pair, and the only other unit that
             draws its ray: two cones crossing ahead of the truck is what
             actually shows the forward cover, where one alone reads as a
             torch. Both are outboard of the side units so they sit on the
             corners of the guard rather than inside its span. */
          { mount: [-0.6, 2.155, 0.38], yaw: -0.04, fov: 2.1, range: 4.6, pitch: 0.436, ray: true, half: 0.26 },
          { mount: [-0.555, 2.225, 0.83], yaw: -1.571, fov: 2.1, range: 3.5, pitch: 0.436 },
          { mount: [0.555, 2.225, 0.835], yaw: 1.571, fov: 2.1, range: 3.5, pitch: 0.436 },
          { mount: [0, 2.235, 1.265], yaw: Math.PI, fov: 1.9, range: 3.2, pitch: 0.436 },
        ],
        /* Across the aisle mouth, not along it: out from between one rack run
           and in behind the other, straight across the truck's path — which
           is the crossing this tab is about, and the one a driver cannot see
           coming.

           The racking now ends at z -2.00 (it ran to -1.60), which opens the
           cross aisle he walks in. z -2.55 keeps him clear of both the rack
           ends and the fork tips at z -1.48, and puts him 2.9 m from the lens
           — inside the 4.2 m reach, so he is picked up part-way across rather
           than the moment he appears. x ±2.40 holds both ends on clear floor:
           the rack uprights stand at |x| 2.75 to 3.65, and from this camera
           angle a walker any wider than 2.40 stands among them and reads as
           shelved rather than as crossing. */
        path: [[-2.4, 0, -2.55], [2.4, 0, -2.55]],
        period: 9.5,
        /* Ahead of the forks, on the crossing line, so the states read in the
           order they happen: out of cover behind the racking, tracked as he
           comes across, then too close. Centred under the front-right camera
           at (0.6, 0.38): the walker's line at z -2.55 is 2.93 m from that
           lens, which is the 3.0 m the chip prints. */
        inZone: (p) => Math.hypot(p.x - 0.6, p.z + 2.55) < 0.8,
        chipIdle: "PERSON 0.97",
        chipUnseen: "NO COVER · BLIND",
        chipAlert: "PERSON · 3.0 m · SLOW",
        build(g, s) {
          /* The stand-in truck lives in a group of its own: the real CAD
             forklift loads asynchronously and hides this wholesale when it
             arrives. Everything else in the scene — racking, floor stock,
             lines — stays either way. */
          const truck = new THREE.Group();
          g.add(truck);
          s.extra.truck = truck;
          const g0 = truck;
          box(1.1, 0.7, 1.9, MT.orange, 0, 0.58, 0.15, g0);
          box(1.12, 0.62, 0.5, MT.ink, 0, 0.72, 1.12, g0);
          box(0.5, 0.14, 0.5, MT.ink, 0, 1.0, 0.35, g0);
          box(0.5, 0.5, 0.1, MT.ink, 0, 1.28, 0.62, g0);
          for (const [x, z] of [[-0.56, -0.55], [0.56, -0.55], [-0.56, 0.85], [0.56, 0.85]]) {
            const w = cyl(0.3, 0.3, 0.22, MT.ink, x, 0.3, z, g0);
            w.rotation.z = Math.PI / 2;
          }
          for (const x of [-0.36, 0.36]) box(0.08, 2.5, 0.1, MT.ink, x, 1.25, -0.86, g0);
          box(0.82, 0.08, 0.1, MT.ink, 0, 2.46, -0.86, g0);
          box(0.82, 0.36, 0.06, MT.ink, 0, 0.48, -0.94, g0);
          for (const x of [-0.22, 0.22]) box(0.1, 0.05, 1.05, MT.clay2, x, 0.3, -1.48, g0);
          for (const [x, z] of [[-0.5, -0.42], [0.5, -0.42], [-0.5, 0.86], [0.5, 0.86]]) {
            box(0.06, 1.28, 0.06, MT.ink, x, 1.58, z, g0);
          }
          box(1.08, 0.06, 1.4, MT.ink, 0, 2.24, 0.22, g0);
          const beaconMat = MT.orange.clone();
          beaconMat.emissive = new THREE.Color(0xff6a00);
          beaconMat.emissiveIntensity = 0;
          s.extra.beacon = cyl(0.07, 0.07, 0.1, beaconMat, 0.36, 2.33, 0.72, g0, 16);

          // Racking kept low and set back: context for the aisle, never a wall
          // in front of the story.
          const rack = (x: number, z0: number, z1: number) => {
            /* The bay pitch is DERIVED from the run, not assumed.
               It used to step a fixed 1.8 m along a 4.6 m run, which leaves a
               1.0 m remainder with no closing upright — and the load placed in
               that remainder hung off the end of the racking with nothing
               under it. Dividing the run into a whole number of bays means
               every load sits between two frames, which is the only
               arrangement that is actually buildable. */
            const len = z1 - z0;
            const bays = Math.max(1, Math.round(len / 1.8));
            const pitch = len / bays;
            const zc = (z0 + z1) / 2;

            // Upright frames, one at every bay boundary including both ends.
            for (let i = 0; i <= bays; i++) {
              const z = z0 + i * pitch;
              for (const dx of [-0.45, 0.45]) {
                box(0.07, 2.4, 0.07, MT.clay2, x + dx, 1.2, z, g);
                box(0.16, 0.04, 0.16, MT.ink, x + dx, 0.02, z, g);
              }
              for (let b = 0; b < 4; b++) {
                const br = box(0.9, 0.035, 0.035, MT.clay2, x, 0.45 + b * 0.6, z, g);
                br.rotation.z = b % 2 ? 0.62 : -0.62;
              }
              box(0.9, 0.035, 0.035, MT.clay2, x, 2.34, z, g);
            }

            // Beams run the full length between the end frames.
            for (const y of [0.55, 1.35, 2.15]) {
              for (const dx of [-0.45, 0.45]) box(0.06, 0.12, len, MT.orange, x + dx, y, zc, g);
            }

            /* One load per bay centre — so it is always carried by the frames
               either side of it — with some positions left empty. */
            let n = 0;
            for (let i = 0; i < bays; i++) {
              const z = z0 + (i + 0.5) * pitch;
              for (const y of [0.55, 1.35, 2.15]) {
                if (++n % 4 === 0) continue;
                const deckY = y + 0.06;
                for (const dz of [-0.36, 0, 0.36]) {
                  box(0.92, 0.045, 0.14, MT.clay2, x, deckY, z + dz, g);
                }
                box(0.86, 0.05, 1.0, MT.clay2, x, deckY + 0.05, z, g);

                const rows = n % 3 === 0 ? 2 : 1;
                const cw = 0.38, cd = 0.44, ch = 0.3;
                for (let r = 0; r < rows; r++) {
                  for (const dx of [-0.21, 0.21]) {
                    for (const dz of [-0.24, 0.24]) {
                      box(cw, ch, cd, (n + r) % 2 ? MT.card : MT.card2,
                        x + dx, deckY + 0.08 + ch / 2 + r * ch, z + dz, g);
                    }
                  }
                }
              }
            }
          };
          // Ends at -2.00, leaving the cross aisle the walker uses.
          rack(-3.2, -6.2, -2.0);
          rack(3.2, -6.2, -2.0);
          // Aisle edge lines.
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
        // On the far right post, diagonally opposite the stack light.
        mount: [1.62, 2.22, -1.62],
        aim: [0, 0, 0.55],
        ringR: 1.3,
        /* He stops at z 0.85, not 0.55. The arm's carry pose puts the tool
           at (-0.28, 1.20, 0.26) and the forearm runs back from there at
           x -0.29; a figure halted at 0.55 came within 70 mm of it, which at
           this scale is a clip waiting to happen. 0.85 is still three
           quarters of a metre inside the gate, so it still reads as in. */
        path: [[0, 0, 3.6], [0, 0, 0.85]],
        period: 8,
        inZone: (p) => Math.abs(p.x) < 1.55 && p.z < 1.5,
        chipIdle: "PERSON 0.96",
        chipAlert: "PERSON IN CELL · STOP",
        build(g, s) {
          flat(3.2, 3.2, MT.clay2, 0, 0, g, 0.006);
          /* Walkway hatching across the opening. A guarded cell reads as
             guarded because of what is painted on the floor as much as what
             is bolted to it. */
          flat(1.1, 0.5, MT.yellow, 0, 1.08, g, 0.008);

          const posts: [number, number][] = [
            [-1.6, -1.6], [0, -1.6], [1.6, -1.6], [-1.6, 0], [1.6, 0],
            [-1.6, 1.6], [-0.5, 1.6], [0.5, 1.6], [1.6, 1.6],
          ];
          for (const [x, z] of posts) {
            box(0.08, 2.1, 0.08, MT.yellow, x, 1.05, z, g);
            box(0.16, 0.03, 0.16, MT.ink, x, 0.015, z, g);
          }
          const panel = (x: number, z: number, len: number, alongX: boolean) => {
            box(alongX ? len : 0.02, 1.8, alongX ? 0.02 : len, MT.glass, x, 1.08, z, g);
            // Mesh guarding is a frame, not a sheet of glass. The rails are
            // what stop the panels reading as shop-window display cases.
            for (const y of [0.2, 1.96]) {
              box(alongX ? len : 0.04, 0.045, alongX ? 0.04 : len, MT.yellow, x, y, z, g);
            }
          };
          panel(-0.8, -1.6, 1.52, true); panel(0.8, -1.6, 1.52, true);
          panel(-1.6, -0.8, 1.52, false); panel(-1.6, 0.8, 1.52, false);
          panel(1.6, -0.8, 1.52, false); panel(1.6, 0.8, 1.52, false);
          panel(-1.05, 1.6, 1.02, true); panel(1.05, 1.6, 1.02, true);

          /* Light curtain across the doorway. The camera does not replace
             this — the copy on this page is careful that it is a layer over
             controls that stay in place — so the guarding has to be visible
             for the claim to hold. */
          // Just inside the doorway, not on the gate posts at z 1.6 — the two
          // would occupy the same 80 mm of floor and z-fight.
          for (const x of [-0.46, 0.46]) {
            box(0.07, 1.7, 0.07, MT.orange, x, 0.85, 1.44, g);
            box(0.03, 1.5, 0.02, MT.ink, x + (x < 0 ? 0.04 : -0.04), 0.85, 1.44, g);
          }

          /* Stack light on the left-hand gate post — the cell's own state.
             It sits diagonally across the cell from the camera, so the two
             never crowd the same corner of the picture. */
          cyl(0.035, 0.035, 0.12, MT.ink, -1.6, 2.2, 1.6, g, 12);
          for (const [k, m] of [[0, MT.green], [1, MT.yellow], [2, MT.red]] as const) {
            cyl(0.055, 0.055, 0.075, m, -1.6, 2.32 + k * 0.08, 1.6, g, 14);
          }
          cyl(0.058, 0.04, 0.05, MT.ink, -1.6, 2.58, 1.6, g, 14);

          /* Infeed conveyor down the left of the cell: side rails, a run of
             rollers and a short queue of parts waiting to be picked. */
          const CZ0 = -1.45, CZ1 = 0.95;
          for (const x of [-1.42, -0.98]) box(0.045, 0.16, CZ1 - CZ0, MT.steel, x, 0.6, (CZ0 + CZ1) / 2, g);
          for (const z of [CZ0 + 0.15, CZ1 - 0.15]) {
            for (const x of [-1.38, -1.02]) box(0.05, 0.52, 0.05, MT.ink, x, 0.26, z, g);
          }
          const roller = new THREE.CylinderGeometry(0.036, 0.036, 0.4, 10);
          for (let i = 0; CZ0 + 0.1 + i * 0.13 < CZ1 - 0.05; i++) {
            const r = new THREE.Mesh(roller, MT.steel);
            r.position.set(-1.2, 0.585, CZ0 + 0.1 + i * 0.13);
            r.rotation.z = Math.PI / 2;
            g.add(r);
          }
          for (let i = 0; i < 4; i++) {
            box(0.26, 0.1, 0.26, i % 2 ? MT.card : MT.card2, -1.2, 0.665, 0.85 - i * 0.3, g);
          }

          /* Fixture nest on the right — where the robot is putting them. */
          box(0.6, 0.62, 0.6, MT.clay, 0.7, 0.31, -0.1, g);
          box(0.68, 0.045, 0.68, MT.ink, 0.7, 0.64, -0.1, g);
          for (const [dx, dz] of [[-0.19, -0.19], [0.19, -0.19], [-0.19, 0.19], [0.19, 0.19]] as const) {
            cyl(0.022, 0.022, 0.09, MT.orange, 0.7 + dx, 0.705, -0.1 + dz, g, 8);
          }
          // Two already placed, so the nest is a destination and not a prop.
          box(0.26, 0.1, 0.26, MT.card, 0.7, 0.715, -0.1, g);
          box(0.26, 0.1, 0.26, MT.card2, 0.7, 0.815, -0.1, g);

          /* Finished tote by the door. */
          box(0.5, 0.36, 0.5, MT.steel, 0.95, 0.18, 1.0, g);
          box(0.44, 0.04, 0.44, MT.ink, 0.95, 0.37, 1.0, g);

          /* ── the robot ──────────────────────────────────────
             Six axes, in the proportions of a medium articulated arm: a
             0.72 m upper arm, a 0.62 m forearm and a 0.22 m tool, so it
             reaches 1.56 m and clears nothing it should not. Those three
             numbers are not decoration — the cycle below is solved against
             them, so changing a link length without re-solving would leave
             the gripper closing on air beside the conveyor. */
          const base = new THREE.Group();
          base.position.set(-0.3, 0, -0.45);
          g.add(base);
          box(0.72, 0.12, 0.72, MT.ink, 0, 0.06, 0, base);
          for (const [dx, dz] of [[-0.29, -0.29], [0.29, -0.29], [-0.29, 0.29], [0.29, 0.29]] as const) {
            cyl(0.03, 0.03, 0.05, MT.steel, dx, 0.14, dz, base, 8);
          }

          const j1 = new THREE.Group(); j1.position.y = 0.12; base.add(j1);
          cyl(0.24, 0.3, 0.3, MT.orange, 0, 0.15, 0, j1);
          cyl(0.255, 0.255, 0.04, MT.ink, 0, 0.3, 0, j1);
          for (const sd of [-1, 1]) {
            const boss = cyl(0.135, 0.135, 0.1, MT.orange, sd * 0.15, 0.46, 0, j1, 18);
            boss.rotation.z = Math.PI / 2;
          }

          const j2 = new THREE.Group(); j2.position.y = 0.46; j1.add(j2);
          box(0.2, 0.72, 0.22, MT.orange, 0, 0.36, 0, j2);
          box(0.24, 0.5, 0.05, MT.orange, 0, 0.3, -0.13, j2);
          // Counterweight behind the shoulder, and the cable carrier up the back.
          box(0.28, 0.22, 0.24, MT.ink, 0, -0.04, -0.2, j2);
          for (let i = 0; i < 7; i++) box(0.07, 0.06, 0.045, MT.ink, 0, 0.08 + i * 0.085, -0.16, j2);

          const j3 = new THREE.Group(); j3.position.y = 0.72; j2.add(j3);
          for (const sd of [-1, 1]) {
            const e = cyl(0.13, 0.13, 0.09, MT.orange, sd * 0.11, 0, 0, j3, 18);
            e.rotation.z = Math.PI / 2;
          }
          box(0.17, 0.62, 0.19, MT.orange, 0, 0.31, 0, j3);
          box(0.1, 0.18, 0.1, MT.ink, 0, 0.12, -0.14, j3);

          const j4 = new THREE.Group(); j4.position.y = 0.62; j3.add(j4);
          cyl(0.085, 0.095, 0.16, MT.orange, 0, 0.08, 0, j4);
          const j5 = new THREE.Group(); j5.position.y = 0.16; j4.add(j5);
          cyl(0.072, 0.072, 0.05, MT.ink, 0, 0.025, 0, j5);
          box(0.34, 0.085, 0.14, MT.ink, 0, 0.1, 0, j5);
          // A two-finger gripper, open at the tip — the part sits between them.
          const fingers: THREE_NS.Mesh[] = [];
          for (const sd of [-1, 1]) {
            fingers.push(box(0.03, 0.16, 0.11, MT.steel, sd * 0.15, 0.22, 0, j5));
          }
          const tip = new THREE.Object3D(); tip.position.y = 0.22; j5.add(tip);

          /* The part in flight. It is parented to the scene rather than to
             the gripper so that releasing it is simply a matter of no longer
             writing its position — it stays exactly where it was let go. */
          const part = box(0.26, 0.1, 0.26, MT.card, -1.2, 0.665, -0.25, g);

          s.extra.rob = { j1, j2, j3, j5, tip, fingers, part };
        },
        update(s, dt) {
          /* A taught cycle, not three sinusoids. What was here before ran
             each joint on its own frequency — 0.7, 0.9 and 0.75 — so the arm
             never repeated a path and never arrived anywhere. Every pose
             below was solved by inverse kinematics against the link lengths
             above and lands the gripper on the conveyor and on the nest to
             the millimetre.

             Index 0 is deliberately mid-cycle, carrying a part. Under
             `prefers-reduced-motion` the clock never advances, so index 0 is
             the entire scene for those readers: it has to be a composed
             frame rather than whatever a zero pose happens to give. */
          const K: [number, number, number, number, number, number][] = [
            //  t     j1      j2      j3      j5    grip
            [0.00, 0.028, 0.144, 1.219, 1.778, 1],
            [0.12, 1.234, 0.677, 0.701, 1.763, 1],
            [0.22, 1.234, 0.691, 1.132, 1.319, 1],
            [0.30, 1.234, 0.691, 1.132, 1.319, 0],
            [0.40, 1.234, 0.677, 0.701, 1.763, 0],
            [0.56, -1.352, 0.434, 1.094, 1.614, 0],
            [0.66, -1.352, 0.513, 1.468, 1.161, 0],
            [0.74, -1.352, 0.513, 1.468, 1.161, 1],
            [0.84, -1.352, 0.434, 1.094, 1.614, 1],
            [1.00, 0.028, 0.144, 1.219, 1.778, 1],
          ];
          s.robT += dt * (1 - 0.97 * s.alertK) * (reduceMotion ? 0 : 1);
          const u = (s.robT / 9) % 1;
          let i = 0;
          while (i < K.length - 2 && K[i + 1][0] <= u) i++;
          const A = K[i], B = K[i + 1];
          const w = Math.min(1, Math.max(0, (u - A[0]) / Math.max(1e-6, B[0] - A[0])));
          // Eased, so each move leaves and arrives at rest rather than
          // stepping between poses at a constant rate.
          const e = w * w * (3 - 2 * w);
          const L = (a: number, b: number) => a + (b - a) * e;
          const r = s.extra.rob;
          r.j1.rotation.y = L(A[1], B[1]);
          r.j2.rotation.x = L(A[2], B[2]);
          r.j3.rotation.x = L(A[3], B[3]);
          r.j5.rotation.x = L(A[4], B[4]);
          const grip = L(A[5], B[5]);
          // Closed, the jaws sit on the faces of a 0.26 m part; open, they
          // stand clear of it. Both numbers come from the part, not from taste.
          r.fingers[0].position.x = -0.15 + grip * 0.02;
          r.fingers[1].position.x = 0.15 - grip * 0.02;
          // While it is gripped the part rides the tool; the moment it is
          // let go it simply stops being written to, and stays on the nest.
          if (grip > 0.5) {
            /* The renderer skips invisible subtrees, so while this tab is
               closed the tool's `matrixWorld` is never refreshed — on the
               first frame after switching to it, reading the matrix straight
               off would place the part wherever the arm last was, and it
               would visibly snap. Recompute the one chain we need. */
            r.tip.updateWorldMatrix(true, false);
            r.tip.getWorldPosition(r.part.position);
            r.part.position.y -= 0.05;
            r.part.rotation.y = r.j1.rotation.y;
          }
        },
      });

      /* DOORS & DOCKS — unit above the shutter, someone cutting across the doorway */
      defineScene("dock", {
        view: { pos: [5.4, 4.6, 9.4], tgt: [0, 2.0, -0.5] },
        mount: [0, 4.1, -1.22],
        /* Aimed at the walking lane, not at the threshold. The cone is drawn
           from the lens to this point, so an aim at z 0.45 stopped it inside
           the doorway — the fan appeared to cut through the shutter and ended
           short of the crossing it is watching. The walk is at z 1.25.

           `half` follows from that: the opening is 2.3 m wide and the lane is
           ~3.0 m of slant range from the lens, so 0.44 rad (25 degrees) puts
           the doorway's full width inside the cone with nothing to spare. */
        aim: [0, 0, 1.25],
        half: 0.44,
        ringR: 1.25,
        /* The walk crosses the doorway in front of the leveller rather than
           on it. The ramp runs z +0.55 back to -1.90 across the full door
           width, so a path at z 0.5 — where this used to be — put the figure
           shin-deep in it. */
        path: [[2.9, 0, 1.25], [-2.3, 0, 1.25]],
        period: 9,
        inZone: (p) => Math.abs(p.x) < 1.25,
        chipIdle: "PERSON 0.95",
        chipAlert: "PERSON · DOOR 3 · CROSSING",
        build(g, s) {
          const wz = -1.5;
          /* ── the building face ── */
          box(3.2, 4.6, 0.25, MT.clay, -2.7, 2.3, wz, g);
          box(3.2, 4.6, 0.25, MT.clay, 2.7, 2.3, wz, g);
          box(2.4, 1.3, 0.25, MT.clay, 0, 3.95, wz, g);
          // Reveal around the opening, so the wall has a thickness.
          for (const x of [-1.2, 1.2]) box(0.06, 3.3, 0.26, MT.clay2, x, 1.65, wz, g);

          /* Sectional door, run up. The panels stack under the header and
             the tracks carry on inside — a door that is open has to have
             gone somewhere, and a single flat rectangle floating in the
             opening was the previous version's weakest object. */
          for (let i = 0; i < 4; i++) {
            box(2.16, 0.36, 0.09, MT.clay2, 0, 3.12 - i * 0.38, wz + 0.16 + i * 0.015, g);
            box(2.16, 0.05, 0.12, MT.clay, 0, 3.12 - i * 0.38, wz + 0.17 + i * 0.015, g);
          }
          /* Vertical tracks only. The barrel shaft, its motor and the
             horizontal track arms used to run out over the opening, and from
             the one angle this tab is ever seen from they crossed the doorway
             as a black bar with an arm through it — reading as a barrier in
             the shot rather than as door gear behind the header. */
          for (const x of [-1.14, 1.14]) box(0.07, 3.3, 0.16, MT.steel, x, 1.65, wz + 0.16, g);

          /* Bumpers and a dock seal — the two things every loading door has
             and no render ever includes. */
          for (const x of [-1.34, 1.34]) box(0.3, 0.5, 0.26, MT.ink, x, 0.6, wz - 0.18, g);
          for (const x of [-1.42, 1.42]) box(0.26, 3.4, 0.3, MT.ink, x, 1.75, wz - 0.2, g);
          box(3.1, 0.3, 0.3, MT.ink, 0, 3.45, wz - 0.2, g);

          /* The semaphore, which is what the camera drives. (A dock light on
             a gooseneck used to hang beside it; over the open shutter it read
             as a stray arm across the doorway rather than as a lamp.) */
          const sema = box(0.2, 0.5, 0.16, MT.ink, 1.62, 2.0, wz + 0.2, g);
          const lens = (y: number, c: number) => {
            const m = new THREE.MeshStandardMaterial({ color: c, roughness: 0.4 });
            const o = cyl(0.058, 0.058, 0.04, m, 0, y, 0.1, sema, 14);
            o.rotation.x = Math.PI / 2;
            o.castShadow = false;
            return m;
          };
          s.extra.sema = { red: lens(0.12, 0xe0483a), green: lens(-0.12, 0x4caf7a) };

          /* The trailer deck height. The leveller ramp that used to bridge it
             filled the doorway with a grey wedge and put a shadow across the
             one thing this tab is about — someone walking the crossing — so
             the floor now runs flat to the threshold. */
          const DECK = 0.62;

          /* ── the trailer ── */
          const tr = new THREE.Group();
          tr.position.set(0, 0, wz - 0.35);
          g.add(tr);
          box(2.5, 2.55, 6.0, MT.trailer, 0, DECK + 1.28, -3.0, tr);
          box(2.54, 0.14, 6.0, MT.ink, 0, DECK - 0.06, -3.0, tr);
          // Rear frame and the doors swung back against the sides.
          for (const x of [-1.25, 1.25]) box(0.1, 2.55, 0.12, MT.clay2, x, DECK + 1.28, -0.02, tr);
          box(2.5, 0.12, 0.12, MT.clay2, 0, DECK + 2.5, -0.02, tr);
          for (const sd of [-1, 1]) {
            const d = box(0.09, 2.45, 1.2, MT.trailer, sd * 1.32, DECK + 1.28, -0.65, tr);
            d.rotation.y = -sd * 0.18;
            for (let k = 0; k < 3; k++) {
              cyl(0.022, 0.022, 2.3, MT.ink, sd * 1.38, DECK + 1.28, -0.35 - k * 0.38, tr, 8);
            }
          }
          // Bogie, mudflaps, landing gear, ICC bar.
          const tyre = new THREE.CylinderGeometry(0.26, 0.26, 0.2, 16);
          for (const z of [-2.1, -2.8]) {
            for (const x of [-1.05, 1.05]) {
              const w = new THREE.Mesh(tyre, MT.ink);
              w.position.set(x, 0.26, z);
              w.rotation.z = Math.PI / 2;
              w.castShadow = true;
              tr.add(w);
            }
          }
          box(2.0, 0.16, 1.4, MT.ink, 0, 0.36, -2.45, tr);
          for (const z of [-1.75, -3.15]) box(2.2, 0.36, 0.04, MT.ink, 0, 0.2, z, tr);
          for (const x of [-0.85, 0.85]) box(0.16, 0.5, 0.16, MT.steel, x, 0.25, -5.1, tr);
          box(2.1, 0.1, 0.12, MT.steel, 0, 0.32, -0.1, tr);
          for (const x of [-1.15, 1.15]) box(0.1, 0.07, 0.05, MT.orange, x, DECK + 2.42, 0.03, tr);

          /* ── the floor ── */
          flat(1.1, 5, MT.green, 2.35, 1.6, g);
          for (const x of [1.78, 2.92]) flat(0.07, 5, MT.yellow, x, 1.6, g);
          for (const x of [-1.15, 1.15]) flat(0.08, 2.6, MT.yellow, x, 0.9, g);
          flat(2.3, 0.09, MT.yellow, 0, 0.62, g);

        },
        update(s) {
          /* The doorway light is the camera's own output. Green while the
             crossing is clear, red the moment it is not — the same k that
             reddens the cone, so the two can never disagree. */
          const k = s.alertK;
          s.extra.sema.red.emissive.setRGB(k * 0.75, k * 0.09, k * 0.06);
          s.extra.sema.green.emissive.setRGB(0, (1 - k) * 0.5, (1 - k) * 0.26);
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
            new THREE.MeshStandardMaterial({ map: hatch, roughness: 0.9 }),
            0, 0.25, g, 0.008,
          );

          /* ── the press ──
             A C-frame mechanical press, built as one: bed, bolster, two
             uprights carrying tie rods, a crown with the flywheel and drive,
             and a slide running between the uprights on gibs. The die is
             split across the bolster and the slide, so the thing the guard
             is guarding is visible — which is the entire argument this tab
             is making. */
          const PZ = -1.5;
          box(2.0, 0.9, 1.5, MT.ink, 0, 0.45, PZ, g);
          box(2.2, 0.12, 1.65, MT.clay2, 0, 0.96, PZ, g);
          box(1.3, 0.22, 1.0, MT.steel, 0, 1.13, PZ, g);
          for (const x of [-0.85, 0.85]) {
            box(0.3, 2.1, 0.5, MT.clay2, x, 2.07, PZ, g);
            cyl(0.045, 0.045, 2.2, MT.steel, x, 2.07, PZ + 0.3, g, 10);
          }
          box(2.24, 0.75, 1.55, MT.orange, 0, 3.4, PZ, g);
          box(2.3, 0.1, 1.62, MT.ink, 0, 3.0, PZ, g);
          // Flywheel and motor on the crown's flank — the press's own clock.
          const fly = cyl(0.42, 0.42, 0.16, MT.ink, 1.3, 3.4, PZ + 0.6, g, 22);
          fly.rotation.x = Math.PI / 2;
          for (const k of [0, 1, 2]) {
            const sp = box(0.72, 0.05, 0.1, MT.steel, 1.3, 3.4, PZ + 0.69, g);
            sp.rotation.z = (k * Math.PI) / 3;
            sp.castShadow = false;
          }
          box(0.42, 0.34, 0.5, MT.ink, 1.3, 4.0, PZ + 0.2, g);

          const slide = new THREE.Group();
          slide.position.set(0, 2.25, PZ);
          g.add(slide);
          box(1.5, 0.3, 1.1, MT.clay2, 0, 0, 0, slide);
          box(1.1, 0.22, 0.85, MT.steel, 0, -0.26, 0, slide);
          for (const x of [-0.78, 0.78]) box(0.12, 0.5, 0.36, MT.ink, x, 0.05, 0, slide);
          s.extra.ram = slide;

          /* Light curtain across the press opening, and the two-hand control
             the operator is meant to be standing at. The camera is an extra
             layer over both — the page says so, so the scene has to show
             both still there. */
          for (const x of [-1.2, 1.2]) {
            box(0.09, 1.9, 0.09, MT.orange, x, 0.95, PZ + 0.95, g);
            box(0.03, 1.7, 0.04, MT.ink, x + (x < 0 ? 0.05 : -0.05), 0.95, PZ + 0.95, g);
          }
          const ped = new THREE.Group();
          ped.position.set(-0.95, 0, PZ + 1.15);
          g.add(ped);
          cyl(0.09, 0.12, 0.95, MT.ink, 0, 0.48, 0, ped, 12);
          const top = box(0.5, 0.08, 0.32, MT.clay2, 0, 1.0, 0, ped);
          top.rotation.x = -0.25;
          for (const x of [-0.14, 0.14]) cyl(0.045, 0.045, 0.05, MT.green, x, 1.06, 0.02, ped, 12);
          cyl(0.055, 0.055, 0.05, MT.red, 0, 1.06, -0.13, ped, 12);

          // Stack light.
          cyl(0.03, 0.03, 0.14, MT.ink, -0.85, 3.22, PZ - 0.28, g, 10);
          for (const [k, m] of [[0, MT.green], [1, MT.yellow], [2, MT.red]] as const) {
            cyl(0.05, 0.05, 0.07, m, -0.85, 3.36 + k * 0.075, PZ - 0.28, g, 12);
          }

          /* Roof steel and the drop the camera hangs from, plus a second bay
             so the ceiling reads as a building rather than as one floating
             length of box section. */
          for (const z of [2.1, -0.4]) box(6.5, 0.14, 0.14, MT.ink, 0, 4.25, z, g);
          box(0.12, 0.12, 2.6, MT.ink, -2.4, 4.25, 0.85, g);
          box(0.12, 0.12, 2.6, MT.ink, 2.4, 4.25, 0.85, g);
          for (const x of [-1.6, 1.6]) {
            box(0.5, 0.09, 0.12, MT.white, x, 4.12, -0.4, g);
          }
          cyl(0.025, 0.025, 0.6, MT.ink, 1.7, 3.95, 2.1, g, 10);

        },
        update(s, dt) {
          s.robT += dt * (1 - s.alertK) * (reduceMotion ? 0 : 1);
          /* A press stroke is not a sine wave. It comes down under the crank,
             dwells closed while the die does its work, lifts, and then waits
             at the top for the operator — which is the only part of the cycle
             anyone is ever standing in front of, and so the only part worth
             getting right. Phase 0 parks it at the top of the stroke, open,
             which is what `prefers-reduced-motion` readers are shown. */
          const u = (s.robT / 3.4) % 1;
          /* Closed is where the dies meet, not a round number: the lower
             die's face is at 1.24 and the upper die hangs 0.37 below the
             slide's origin, so 1.61 is contact. 1.62 leaves the 10 mm that
             keeps them from interpenetrating at bottom dead centre. */
          const OPEN = 2.25, SHUT = 1.62;
          let k: number;
          if (u < 0.1) k = 0;                                   // dwell, open
          else if (u < 0.38) k = (u - 0.1) / 0.28;              // closing
          else if (u < 0.52) k = 1;                             // dwell, closed
          else if (u < 0.78) k = 1 - (u - 0.52) / 0.26;         // lifting
          else k = 0;                                           // dwell, open
          const e = k * k * (3 - 2 * k);
          s.extra.ram.position.y = OPEN + (SHUT - OPEN) * e;
        },
      });

      /* ── camera + interaction ─────────────────────────────── */
      const curPos = V3();
      const curTgt = V3();
      const want = V3();
      const rel = V3();
      const headV = V3();
      const ndc = V3();
      const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
      /* Orbit. `az`/`el` are the eased values the camera uses, `azT`/`elT`
         where the pointer has put them. `touched` latches on the first drag
         and never clears: once someone has taken hold of the scene, the idle
         sway and the hover parallax stop fighting them for control of it. */
      const orb = { az: 0, el: 0, azT: 0, elT: 0, on: false, px: 0, py: 0, touched: false };
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
      const onDown = (e: PointerEvent) => {
        orb.on = true;
        orb.touched = true;
        orb.px = e.clientX;
        orb.py = e.clientY;
        stage.setPointerCapture(e.pointerId);
        stage.style.cursor = "grabbing";
      };
      const onDrag = (e: PointerEvent) => {
        if (!orb.on) return;
        orb.azT -= (e.clientX - orb.px) * 0.008;
        /* Elevation is clamped well clear of both poles: underneath the floor
           there is nothing to see, and straight overhead the scene collapses
           into a plan with no depth in it. */
        orb.elT = clamp(orb.elT + (e.clientY - orb.py) * 0.005, -0.55, 0.62);
        orb.px = e.clientX;
        orb.py = e.clientY;
      };
      const onUp = (e: PointerEvent) => {
        orb.on = false;
        try { stage.releasePointerCapture(e.pointerId); } catch { /* already gone */ }
        stage.style.cursor = "grab";
      };
      stage.style.cursor = "grab";
      stage.style.touchAction = "pan-y";
      stage.addEventListener("pointerdown", onDown);
      stage.addEventListener("pointermove", onDrag);
      stage.addEventListener("pointerup", onUp);
      stage.addEventListener("pointercancel", onUp);
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
      const sph = new THREE.Spherical();
      const desired = (s: SceneState, extraAng: number, out: THREE_NS.Vector3) => {
        rel.subVectors(v(s.cfg.view.pos), v(s.cfg.view.tgt)).multiplyScalar(aspectPush());
        /* Once dragged, the scene belongs to the reader: the idle sway and the
           hover parallax both stand down rather than drifting the view out
           from under whatever angle they chose. */
        const idle = orb.touched || reduceMotion ? 0 : Math.sin(time * 0.16) * 0.12;
        const hover = orb.touched ? 0 : ptr.x * 0.16;
        sph.setFromVector3(rel);
        sph.theta += idle + hover + extraAng + orb.az;
        sph.phi = clamp(sph.phi - orb.el, 0.22, 1.46);
        rel.setFromSpherical(sph);
        if (!orb.touched) rel.y += ptr.y * -0.35;
        return out.copy(v(s.cfg.view.tgt)).add(rel);
      };
      /* ── the real forklift ───────────────────────────────
         The stand-in truck is boxes; this is the CAD model the Sensor Stack
         page already ships, so the two pages show the same machine.

         It is fitted by its ROOF, not by its overall height. The camera mounts
         above are derived from the stand-in's overhead guard at y 2.27, and a
         forklift's tallest part is its mast, not its guard — scaling to
         overall height would have left the cameras floating over a guard that
         had moved. Matching roof tops keeps every mount valid for both, which
         also means the fallback still looks right if this never arrives.

         Loaded after the scene is up and running, so nothing waits on 2.3 MB. */
      void (async () => {
        try {
          const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
          const gltf = await new GLTFLoader().loadAsync("/sensor-stack/rams-forklift.glb");
          if (disposed) return;
          const mhe = scenes["mhe"];
          if (!mhe) return;

          const m = gltf.scene;
          m.rotation.y = -Math.PI / 2;            // drive direction onto -Z
          m.updateMatrixWorld(true);

          const roofNode = m.getObjectByName("roof");
          const whole = new THREE.Box3().setFromObject(m);
          const roofBox = roofNode ? new THREE.Box3().setFromObject(roofNode) : whole;

          const GUARD_TOP = 2.27;
          const k = GUARD_TOP / Math.max(roofBox.max.y - whole.min.y, 1e-6);
          m.scale.setScalar(k);
          m.updateMatrixWorld(true);

          const fitted = new THREE.Box3().setFromObject(m);
          const c = fitted.getCenter(new THREE.Vector3());
          m.position.set(-c.x, -fitted.min.y, -c.z + 0.15);

          m.traverse((n) => {
            const mesh = n as THREE_NS.Mesh;
            if (mesh.isMesh) {
              mesh.castShadow = !isMobile;
              mesh.receiveShadow = !isMobile;
            }
          });

          (mhe.extra.truck as THREE_NS.Group).visible = false;
          mhe.group.add(m);
        } catch (err) {
          // The boxes stay. Nothing else in the scene depends on this.
          console.warn("AI Camera: the CAD forklift did not load —", err);
        }
      })();

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
        const grab = Math.min(1, dt * (orb.on ? 14 : 5));
        orb.az += (orb.azT - orb.az) * grab;
        orb.el += (orb.elT - orb.el) * grab;
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
        /* Heading is held rather than recomputed, so the figure keeps facing
           the way it was going through the pause at each end of the path
           instead of snapping round while standing still.

           It starts at +1 — a→b — which matters more than it looks: under
           `prefers-reduced-motion` `vel` is pinned at 0, so this never
           updates, and an initial 0 left the figure facing down −z whatever
           its path did. Three of the four scenes do not walk along −z, so
           three of them parked a fully rigged figure facing sideways. */
        if (Math.abs(vel) > 0.02) s.faceDir = Math.sign(vel);
        P.rotation.y = Math.atan2(
          (b.x - a.x) * s.faceDir,
          (b.z - a.z) * s.faceDir,
        );
        /* Stride phase is metres walked, not seconds elapsed, so the feet
           stay with the floor. `u` is the fraction of the path and `a→b` its
           length, which makes the distance exact rather than inferred.

           Pose only: nothing here feeds back into `u` or `period`. The
           forklift scene's timing — blind, tracked, then alerting — is set
           by the path and the cameras' reach, and a gait that could nudge it
           would quietly move a coverage claim. */
        poseWalk(P, a.distanceTo(b) * u, Math.min(1, Math.abs(vel) * 1.7));

        /* Is the walker actually inside a camera's cover?
           This used to be a hand-placed circle, which meant the scene could
           announce a detection while the person stood somewhere no lens
           reached — the one claim this section cannot afford to fake. The test
           is now the cameras' own geometry: bearing within half-angle, and
           inside range. */
        let seen = false;
        const watch = s.cfg.watch;
        if (watch) {
          for (const c of watch) {
            const dx = P.position.x - c.at[0];
            const dz = P.position.z - c.at[2];
            const dist = Math.hypot(dx, dz);
            if (dist > c.range) continue;
            // Bearing of the walker relative to this camera's heading.
            let rel = Math.atan2(dx, -dz) - c.yaw;
            rel = Math.atan2(Math.sin(rel), Math.cos(rel));
            if (Math.abs(rel) <= c.half) { seen = true; break; }
          }
        } else {
          seen = true;
        }
        const inside = seen && s.cfg.inZone(P.position);
        s.alertK += ((inside ? 1 : 0) - s.alertK) * Math.min(1, dt * 6);
        const k = s.alertK;
        const col = new THREE.Color(0x00c8ff).lerp(new THREE.Color(0xff6c6c), k);
        s.coneMat.color.copy(col);
        s.coneMat.opacity = 0.1 + 0.1 * k;

        /* The other units tint with the primary one. Their base opacities
           differ, so each keeps its own and is only lifted by the alert —
           flattening them all to one value would lose the distinction between
           a cone, its floor wedge and that wedge's edge. */
        for (let i = 0; i < s.extraMats.length; i++) {
          const m = s.extraMats[i];
          m.color.copy(col);
          m.opacity = m.userData.base + m.userData.lift * k;
        }
        s.cfg.update?.(s, dt, time);

        // The chip rides over the walker's head, in the stage's own pixels.
        headV.copy(P.position);
        headV.y = 2.0;
        ndc.copy(headV).project(cam);
        const w = stage.clientWidth;
        const h = stage.clientHeight;
        chip.style.transform = `translate(${((ndc.x * 0.5 + 0.5) * w).toFixed(1)}px,${((-ndc.y * 0.5 + 0.5) * h).toFixed(1)}px) translate(-50%,-100%)`;
        chip.style.opacity = ndc.z < 1 ? "1" : "0";
        /* Three states, not two. Out of cover the chip says so rather than
           quietly reading as a detection — a camera that cannot see someone
           should be visibly not seeing them, which is the whole argument for
           fitting more than one. */
        const alert = k > 0.5;
        if (chip.classList.contains("alert") !== alert) chip.classList.toggle("alert", alert);
        if (chip.classList.contains("unseen") !== !seen) chip.classList.toggle("unseen", !seen);
        const txt = !seen ? (s.cfg.chipUnseen ?? "NOT IN VIEW") : alert ? s.cfg.chipAlert : s.cfg.chipIdle;
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
