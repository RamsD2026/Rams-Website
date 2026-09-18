import type * as THREE_NS from "three";

/* ============================================================================
   /hardware/inspection — the 3D kit, shared by the film and the Inside viewer.

   Ported from the reference's single `<script type="module">`. Two scenes are
   built from it and they must agree: the hero film flies both machines past a
   ghost rack and a see-through slab, and the Inside viewer takes the same two
   apart and then sets them to work.

   ── These are stand-ins, and the page says so ───────────────────────
   Both machines are **concepts**. Nothing here is a drawing: the AirScan build
   is modelled from the concept photograph (a cinewhoop-style lattice frame,
   four ducted guards, orange three-blade props under the arms, an orange
   mounting plate, the brain and a long "RAMS" battery box stacked on top) and
   the FloorScan build from the same sketch idea — radar underneath, profiler at
   the front, LiDAR on top. They are drawn to read clearly at a glance, not to a
   tolerance. The viewer carries a "Concept model" chip saying exactly that.

   The reference supports dropping in `airscan.glb` / `floorscan.glb` to replace
   the stand-ins, with part names mapped to plain-language labels. That loader is
   **not ported**: no GLB is shipped, and porting it would mean two 404 probes on
   every page load for files that do not exist. When a real model arrives it goes
   in `public/inspection/`, and the `LABELS` table from the reference's
   `models/README.md` is the contract to rebuild against — the same position
   `/hardware/omnibox` is in with its procedural boxes.

   ── Units ───────────────────────────────────────────────────────────
   1 = 100 mm, throughout, including the rack and slab scenes. `createGiKit`
   mirrors `createOmniKit` and `createSstKit`: the reference's module-level
   consts become closures over an injected `THREE`, so three is imported
   dynamically inside an effect and reaches no other route's bundle.
   ========================================================================== */

export type MachineKey = "airscan" | "floorscan";

export type Part = {
  obj: THREE_NS.Group;
  offset: THREE_NS.Vector3;
  label: string;
  desc: string;
  base?: THREE_NS.Vector3;
};
export type Model = {
  group: THREE_NS.Group;
  parts: Part[];
  /** Rotors, spun only on the stand-in — a real model's parts are shown still. */
  spin: THREE_NS.Group[];
  size: THREE_NS.Vector3;
};
export type Holder = { key: MachineKey; g: THREE_NS.Group; model: Model };

/** One thing a machine reads (`in`, blue) or flags (`out`, orange). */
export type Find = { obj: THREE_NS.Object3D; label: string; desc: string; dir: "in" | "out" };
export type Scan = {
  group: THREE_NS.Group;
  finds: Find[];
  /** What the camera looks at, how far out it has to sit, and the top of the scene. */
  center: THREE_NS.Vector3;
  radius: number;
  top: number;
  /** Drive the machine through the scene. `sc` is how far the scan view has come in. */
  place: (h: Holder, t: number, sc: number) => void;
};

export function createGiKit(THREE: typeof THREE_NS, isMobile: boolean, reduceMotion: boolean) {
  const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
  const ss = (t: number) => t * t * (3 - 2 * t);

  /* ── textures ───────────────────────────────────────────── */

  const tex = (w: number, h: number, fn: (c: CanvasRenderingContext2D, w: number, h: number) => void) => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    fn(c.getContext("2d")!, w, h);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  };

  /** The diagonal rib pattern on FloorScan's lid — the Omnibox lid texture. */
  const RIB = tex(512, 512, (x, w, h) => {
    x.fillStyle = "#232428";
    x.fillRect(0, 0, w, h);
    x.save();
    x.translate(w / 2, h / 2);
    x.rotate(-Math.PI / 4);
    for (let i = -w * 1.5; i < w * 1.5; i += 30) {
      x.fillStyle = "#141518";
      x.fillRect(i, -h, 13, h * 2);
      x.fillStyle = "#34363b";
      x.fillRect(i + 13, -h, 2, h * 2);
    }
    x.restore();
  });
  const ribMat = (rx: number, ry: number) => {
    const t = RIB.clone();
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(rx, ry);
    t.needsUpdate = true;
    return new THREE.MeshStandardMaterial({ map: t, roughness: 0.62, metalness: 0.3 });
  };

  // Named directly: a canvas font string cannot take a CSS variable, and this
  // site's body family is Roboto (`docs/typography.md`).
  const FONT = "Roboto, Arial, sans-serif";

  const LOGO = tex(512, 200, (x, w, h) => {
    x.clearRect(0, 0, w, h);
    x.fillStyle = "#F5F5F7";
    x.font = `800 118px ${FONT}`;
    x.textBaseline = "alphabetic";
    x.fillText("RAMS", 24, 132);
    x.fillStyle = "#FF6A00";
    x.fillRect(360, 40, 50, 15);
    x.fillRect(395, 40, 15, 50);
  });
  const LATTICE = tex(256, 256, (x, w, h) => {
    x.fillStyle = "#121214";
    x.fillRect(0, 0, w, h);
    x.strokeStyle = "#26272c";
    x.lineWidth = 6;
    for (let i = -h; i < w + h; i += 52) {
      x.beginPath();
      x.moveTo(i, 0);
      x.lineTo(i + h, h);
      x.stroke();
      x.beginPath();
      x.moveTo(i, h);
      x.lineTo(i + h, 0);
      x.stroke();
    }
  });
  const latMat = (rx: number, ry: number) => {
    const t = LATTICE.clone();
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(rx, ry);
    t.needsUpdate = true;
    return new THREE.MeshStandardMaterial({ map: t, roughness: 0.72, metalness: 0.05 });
  };
  const RAMSMARK = tex(512, 220, (x, w, h) => {
    x.fillStyle = "#141416";
    x.fillRect(0, 0, w, h);
    x.fillStyle = "#2b2c31";
    x.font = `800 150px ${FONT}`;
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText("RAMS", w / 2, h / 2 + 8);
  });

  const std = (color: number, o: THREE_NS.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.5 }, o));
  const glow = (color: number, op: number, o: THREE_NS.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial(
      Object.assign({ color, roughness: 0.4, emissive: color, emissiveIntensity: 0.45, transparent: op < 1, opacity: op, depthWrite: op >= 1 }, o),
    );

  /* Blue is what a machine reads, orange is what it flags. That pairing runs
     through every scan material below and is stated in the viewer's key. */
  const M = {
    nylon: new THREE.MeshStandardMaterial({ color: 0x141416, roughness: 0.7, metalness: 0.05 }),
    plastic: new THREE.MeshStandardMaterial({ color: 0xff6a13, roughness: 0.5 }),
    prop: new THREE.MeshStandardMaterial({ color: 0xf2600f, roughness: 0.35, transparent: true, opacity: 0.93, side: THREE.DoubleSide }),
    tie: new THREE.MeshStandardMaterial({ color: 0xf2f2ee, roughness: 0.6 }),
    rams: new THREE.MeshStandardMaterial({ map: RAMSMARK, roughness: 0.75 }),
    shell: std(0x1d1e22, { metalness: 0.35 }),
    white: std(0xf0f0f2, { roughness: 0.42, metalness: 0.05 }),
    pcb: std(0x125238, { roughness: 0.7 }),
    chip: std(0x101114, { roughness: 0.4, metalness: 0.4 }),
    metal: std(0xbfc2c8, { roughness: 0.3, metalness: 0.9 }),
    alu: std(0x9ea2a9, { roughness: 0.35, metalness: 0.8 }),
    grey: std(0x6e7178, { metalness: 0.3 }),
    batt: std(0x2c3e66, { roughness: 0.55 }),
    tyre: std(0x18181b, { roughness: 0.9 }),
    lens: std(0x07080a, { roughness: 0.08, metalness: 0.6 }),
    orange: std(0xff6a00, { emissive: 0xff6a00, emissiveIntensity: 0.25 }),
    laser: new THREE.MeshStandardMaterial({ color: 0xff3b30, emissive: 0xff3b30, emissiveIntensity: 0.9 }),
    logo: new THREE.MeshBasicMaterial({ map: LOGO, transparent: true, depthWrite: false }),
    /* scenes */
    upright: std(0x34507a, { roughness: 0.5, metalness: 0.35 }),
    beam: std(0xe2601a, { roughness: 0.55, metalness: 0.25 }),
    pallet: std(0xb8895a, { roughness: 0.9 }),
    carton: std(0xcdb088, { roughness: 0.95 }),
    cartonOdd: std(0xf4f5f7, { roughness: 0.35, metalness: 0.05 }),
    sign: std(0xf2b200, { roughness: 0.6 }),
    label: std(0xffffff, { roughness: 0.6 }),
    concrete: new THREE.MeshStandardMaterial({ color: 0xb9bcc4, roughness: 0.9, transparent: true, opacity: 0.34, depthWrite: false }),
    subbase: new THREE.MeshStandardMaterial({ color: 0x8a7862, roughness: 1, transparent: true, opacity: 0.26, depthWrite: false }),
    rebar: std(0x7d8088, { roughness: 0.5, metalness: 0.5 }),
    cable: glow(0xf2b200, 1),
    conduit: glow(0x0a84ff, 1, { emissiveIntensity: 0.3 }),
    voidM: glow(0xff6a00, 0.55),
    free: glow(0x0a84ff, 0.22, { emissiveIntensity: 0.3 }),
    beamRay: new THREE.MeshBasicMaterial({ color: 0xff6a00, transparent: true, opacity: 0.14, depthWrite: false, side: THREE.DoubleSide }),
    crack: new THREE.MeshBasicMaterial({ color: 0xff6a00 }),
    profile: new THREE.LineBasicMaterial({ color: 0x0a84ff }),
    flag: new THREE.LineBasicMaterial({ color: 0xff6a00 }),
    edge: new THREE.LineBasicMaterial({ color: 0x9a9ca3 }),
  };

  /* ── primitives ─────────────────────────────────────────── */

  const bx = (w: number, h: number, d: number, m: THREE_NS.Material, x: number, y: number, z: number, p: THREE_NS.Object3D) => {
    const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    o.position.set(x, y, z);
    p.add(o);
    return o;
  };
  const cy = (
    r: number, h: number, m: THREE_NS.Material, x: number, y: number, z: number,
    p: THREE_NS.Object3D, axis: "x" | "y" | "z" = "y", s = 28,
  ) => {
    const o = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, s), m);
    o.position.set(x, y, z);
    if (axis === "x") o.rotation.z = Math.PI / 2;
    if (axis === "z") o.rotation.x = Math.PI / 2;
    p.add(o);
    return o;
  };
  const decal = (mat: THREE_NS.Material, w: number, h: number, x: number, y: number, z: number, p: THREE_NS.Object3D) => {
    const o = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    o.position.set(x, y, z);
    o.rotation.x = -Math.PI / 2;
    p.add(o);
    o.renderOrder = 2;
    return o;
  };
  /** A bar between two points — used for the frame arms and the guard spokes. */
  const plank = (a: THREE_NS.Vector3, b: THREE_NS.Vector3, w: number, th: number, m: THREE_NS.Material, p: THREE_NS.Object3D) => {
    const L = Math.max(0.001, a.distanceTo(b));
    const o = new THREE.Mesh(new THREE.BoxGeometry(w, th, L), m);
    o.position.copy(a).add(b).multiplyScalar(0.5);
    p.add(o);
    o.lookAt(p.localToWorld(b.clone()));
    return o;
  };
  /** A hollow ring, lathed — one prop guard. */
  const band = (r: number, t: number, h: number, m: THREE_NS.Material, x: number, y: number, z: number, p: THREE_NS.Object3D) => {
    const V2 = (a: number, b: number) => new THREE.Vector2(a, b);
    const o = new THREE.Mesh(
      new THREE.LatheGeometry([V2(r - t, 0), V2(r, 0), V2(r, h), V2(r - t, h), V2(r - t, 0)], 72),
      m,
    );
    o.position.set(x, y, z);
    p.add(o);
    return o;
  };
  /** An open-topped box — FloorScan's chassis. */
  const tray = (W: number, H: number, D: number, t: number, m: THREE_NS.Material, p: THREE_NS.Object3D) => {
    const g = new THREE.Group();
    p.add(g);
    bx(W, t, D, m, 0, t / 2, 0, g);
    bx(W, H, t, m, 0, H / 2, D / 2 - t / 2, g);
    bx(W, H, t, m, 0, H / 2, -D / 2 + t / 2, g);
    bx(t, H, D - 2 * t, m, W / 2 - t / 2, H / 2, 0, g);
    bx(t, H, D - 2 * t, m, -W / 2 + t / 2, H / 2, 0, g);
    return g;
  };
  const outline = (w: number, h: number, d: number, m: THREE_NS.Material, x: number, y: number, z: number, p: THREE_NS.Object3D) => {
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), m);
    e.position.set(x, y, z);
    p.add(e);
    return e;
  };
  /** One labelled, explodable part. `offset` is where it flies to. */
  const part = (
    g: THREE_NS.Group, parts: Part[], label: string, desc: string,
    offset: THREE_NS.Vector3, build: (o: THREE_NS.Group) => void,
  ) => {
    const o = new THREE.Group();
    g.add(o);
    build(o);
    parts.push({ obj: o, offset, label, desc });
    return o;
  };

  /* ── the concept stand-ins ──────────────────────────────── */
  // Front faces +z. Each part is its own group with an explode offset.

  const PROC: Record<MachineKey, () => Model> = {
    airscan() {
      const g = new THREE.Group(), parts: Part[] = [], spin: THREE_NS.Group[] = [];
      const MX = 1.28, R = 1.06, MZ = R - 0.01, GH = 0.24, FY = 0.3;
      const C: [number, number][] = [[MX, MZ], [-MX, MZ], [MX, -MZ], [-MX, -MZ]];

      part(g, parts, "Prop guards", "A full guard round every prop, for flying close to racking.", V3(0, 0, 0), (o) => {
        for (const [x, z] of C) {
          band(R, 0.06, GH, M.nylon, x, 0, z, o);
          // Spokes radiate from wherever the guard meets its neighbour.
          const toC = Math.atan2(-z, -x);
          for (let i = 1; i < 6; i++) {
            const an = toC + (i * Math.PI * 2) / 6;
            plank(
              V3(x + Math.cos(an) * 0.2, 0.05, z + Math.sin(an) * 0.2),
              V3(x + Math.cos(an) * (R - 0.04), 0.05, z + Math.sin(an) * (R - 0.04)),
              0.07, 0.06, M.nylon, o,
            );
          }
          const out = Math.sign(x);
          bx(0.14, 0.16, 0.16, M.plastic, x + out * (R + 0.02), 0.08, z + Math.sign(z) * 0.55, o);
          cy(0.035, 0.02, M.metal, x + out * (R + 0.1), 0.12, z + Math.sign(z) * 0.55, o, "x", 12);
        }
      });

      part(g, parts, "Motors & props", "Props tucked inside the guards.", V3(0, 0.3, 0), (o) => {
        for (const [x, z] of C) {
          cy(0.17, 0.14, M.chip, x, FY - 0.14, z, o);
          const rot = new THREE.Group();
          rot.position.set(x, FY - 0.2, z);
          o.add(rot);
          for (let k = 0; k < 3; k++) {
            const bl = new THREE.Group();
            bl.rotation.y = (k * Math.PI * 2) / 3;
            rot.add(bl);
            const blade = new THREE.Shape();
            blade.moveTo(0.06, -0.07);
            blade.quadraticCurveTo(0.5, -0.24, 0.9, -0.08);
            blade.quadraticCurveTo(0.98, 0, 0.9, 0.08);
            blade.quadraticCurveTo(0.5, 0.16, 0.06, 0.07);
            const bm = new THREE.Mesh(new THREE.ShapeGeometry(blade, 12), M.prop);
            bm.rotation.x = -Math.PI / 2;
            const tilt = new THREE.Group();
            tilt.rotation.x = 0.2;
            tilt.add(bm);
            bl.add(tilt);
          }
          cy(0.06, 0.05, M.chip, 0, 0, 0, rot);
          spin.push(rot);
          cy(0.2, 0.07, M.nylon, x, FY + 0.035, z, o);
          for (let k = 0; k < 4; k++) {
            const an = (k * Math.PI) / 2 + Math.PI / 4;
            cy(0.035, 0.05, M.chip, x + Math.cos(an) * 0.1, FY + 0.09, z + Math.sin(an) * 0.1, o, "y", 10);
          }
          cy(0.045, 0.05, M.chip, x, FY + 0.09, z, o, "y", 10);
        }
      });

      part(g, parts, "Frame", "Stiff and light, carrying everything above the props.", V3(0, 1.0, 0), (o) => {
        const LM = latMat(1.4, 3);
        bx(0.95, 0.07, 2.3, LM, 0, FY - 0.035, 0, o);
        for (const [x, z] of C) {
          plank(V3(Math.sign(x) * 0.35, FY - 0.035, Math.sign(z) * 0.55), V3(x, FY - 0.035, z), 0.36, 0.07, LM, o);
          // A white zip tie at each arm, as in the concept photo.
          const mid = V3(Math.sign(x) * 0.72, FY - 0.035, Math.sign(z) * 0.82);
          plank(mid, mid.clone().add(V3(Math.sign(x) * 0.03, 0, Math.sign(z) * 0.03)), 0.44, 0.12, M.tie, o);
        }
      });

      part(g, parts, "Mounting plate", "Everything above bolts to one plate.", V3(0, 1.5, 0), (o) => {
        bx(1.05, 0.05, 1.6, M.plastic, 0, FY + 0.025, 0.12, o);
        bx(0.3, 0.012, 0.05, M.chip, 0.1, FY + 0.056, 0.72, o);
      });

      part(g, parts, "The brain", "On-board computer. Decides where to fly and what’s worth flagging.", V3(0, 2.05, 0), (o) => {
        bx(0.96, 0.3, 1.08, M.nylon, 0, FY + 0.05 + 0.15, -0.06, o);
        bx(0.86, 0.1, 0.98, M.nylon, 0, FY + 0.35 + 0.05, -0.06, o);
        bx(0.07, 0.06, 0.05, M.tie, -0.25, FY + 0.12, 0.49, o);
      });

      /* Not in the concept photo — added because the scan view has to show the
         drone reading the rack face, and it must be reading it with something. */
      part(g, parts, "Inspection camera", "Reads labels and spots damage on the rack face.", V3(0, 1.7, 1.2), (o) => {
        cy(0.1, 0.05, M.nylon, 0, FY + 0.2, 0.51, o, "z");
        cy(0.065, 0.04, M.lens, 0, FY + 0.2, 0.545, o, "z");
      });

      part(g, parts, "Battery", "Charges at its dock between runs.", V3(0, 3.0, 0), (o) => {
        const y0 = FY + 0.45;
        bx(0.66, 0.58, 1.14, M.nylon, 0, y0 + 0.29, -0.02, o);
        bx(0.56, 0.06, 1.04, M.nylon, 0, y0 + 0.61, -0.02, o);
        const d = new THREE.Mesh(new THREE.PlaneGeometry(0.84, 0.3), M.rams);
        d.position.set(0.331, y0 + 0.3, -0.02);
        d.rotation.y = Math.PI / 2;
        o.add(d);
      });

      return { group: g, parts, spin, size: V3(2 * (MX + R + 0.12), FY + 1.15, 2 * (MZ + R)) };
    },

    floorscan() {
      const g = new THREE.Group(), parts: Part[] = [], spin: THREE_NS.Group[] = [];
      const L = 3.4, W = 2.2, cl = 0.3, H = 0.58;

      part(g, parts, "Chassis", "Low and stable, with a soft bumper all the way round.", V3(0, 0, 0), (o) => {
        const b = new THREE.Group();
        b.position.y = cl;
        o.add(b);
        tray(L, H, W, 0.05, M.shell, b);
        bx(0.09, 0.16, W + 0.04, M.orange, L / 2 + 0.045, cl + 0.24, 0, o);
        bx(0.09, 0.16, W + 0.04, M.orange, -L / 2 - 0.045, cl + 0.24, 0, o);
        bx(L * 0.5, 0.05, 0.012, M.orange, 0.2, cl + H * 0.62, W / 2 + 0.007, o);
        bx(L * 0.5, 0.05, 0.012, M.orange, 0.2, cl + H * 0.62, -W / 2 - 0.007, o);
      });

      part(g, parts, "Top cover", "Sealed against dust and the odd spill.", V3(0, 1.75, 0), (o) => {
        o.position.y = cl + H;
        bx(L, 0.07, W, ribMat(4, 2.6), 0, 0.035, 0, o);
        decal(M.logo, 0.6, 0.24, -0.95, 0.072, 0.55, o);
      });

      const wheel = (o: THREE_NS.Group, x: number, z: number) => {
        cy(0.26, 0.2, M.tyre, x, 0.26, z, o, "z");
        cy(0.12, 0.21, M.alu, x, 0.26, z, o, "z");
      };
      part(g, parts, "Drive wheels", "Steady, straight passes down the aisle.", V3(0, 0, 1.2), (o) => {
        wheel(o, 1.05, W / 2 + 0.03);
        wheel(o, -1.05, W / 2 + 0.03);
      });
      // The far pair explodes the other way and takes no label of its own.
      part(g, parts, "", "", V3(0, 0, -1.2), (o) => {
        wheel(o, 1.05, -W / 2 - 0.03);
        wheel(o, -1.05, -W / 2 - 0.03);
      });

      part(g, parts, "Ground-penetrating radar", "Looks down through the slab as it drives.", V3(-2.9, 0.1, 0), (o) => {
        o.position.set(-0.25, 0.05, 0);
        bx(1.3, 0.14, 1.5, M.white, 0, 0.07, 0, o);
        bx(1.3, 0.025, 1.5, M.orange, 0, 0.15, 0, o);
      });
      part(g, parts, "Surface profiler", "Reads flatness and levelness along the aisle.", V3(1.3, 0.1, 0), (o) => {
        o.position.set(L / 2 + 0.24, 0.1, 0);
        bx(0.2, 0.16, 1.9, M.metal, 0, 0.08, 0, o);
        bx(0.02, 0.04, 1.7, M.laser, 0.11, 0.06, 0, o);
      });
      part(g, parts, "The brain", "Turns radar and surface readings into a floor plan.", V3(0.5, 1.05, 0), (o) => {
        o.position.set(0.6, cl + 0.07, 0);
        bx(0.9, 0.03, 0.8, M.pcb, 0, 0, 0, o);
        bx(0.56, 0.03, 0.42, M.chip, 0, 0.03, 0, o);
        for (let i = 0; i < 8; i++) bx(0.012, 0.12, 0.36, M.alu, -0.22 + i * 0.063, 0.1, 0, o);
      });
      part(g, parts, "Battery", "Charges at its dock between runs.", V3(-0.6, 0.65, 0), (o) => {
        o.position.set(-0.8, cl + 0.05, 0);
        bx(1.1, 0.3, 1.3, M.batt, 0, 0.15, 0, o);
        bx(0.25, 0.06, 0.1, M.orange, 0, 0.33, 0.5, o);
      });
      part(g, parts, "Navigation LiDAR", "Knows where it is on your floor plan.", V3(0.2, 2.7, 0), (o) => {
        o.position.set(1.05, cl + H + 0.07, 0);
        cy(0.04, 0.3, M.grey, 0, 0.15, 0, o);
        cy(0.2, 0.16, M.white, 0, 0.38, 0, o);
        cy(0.21, 0.03, M.chip, 0, 0.47, 0, o);
        cy(0.13, 0.05, M.lens, 0, 0.5, 0, o);
      });

      return { group: g, parts, spin, size: V3(L + 0.7, cl + H + 0.6, W + 0.5) };
    },
  };

  /* ── holders, explode, rotors ───────────────────────────── */

  const makeHolder = (key: MachineKey): Holder => {
    const model = PROC[key]();
    const g = new THREE.Group();
    model.group.traverse((o) => {
      const mesh = o as THREE_NS.Mesh;
      if (mesh.isMesh && mesh.material !== M.logo) {
        mesh.castShadow = !isMobile;
        mesh.receiveShadow = !isMobile;
      }
    });
    model.parts.forEach((p) => {
      p.base = p.obj.position.clone();
    });
    g.add(model.group);
    return { key, g, model };
  };

  /** `side` scales the sideways component, so parts do not fly into a neighbour
      when two machines explode next to each other in the film. */
  const explode = (h: Holder, e: number, side = 1) => {
    for (const p of h.model.parts) {
      const o = p.offset, b = p.base!;
      p.obj.position.set(b.x + o.x * e * side, b.y + o.y * e, b.z + o.z * e * side);
    }
  };
  const spinRotors = (h: Holder, dt: number) => {
    if (reduceMotion) return;
    for (const r of h.model.spin) r.rotation.y += dt * 22;
  };
  const maxLift = (m: Model) => m.parts.reduce((n, p) => Math.max(n, p.offset.y), 0);

  /* ── stage setup ────────────────────────────────────────── */

  const setupRenderer = (R: THREE_NS.WebGLRenderer) => {
    R.setClearColor(0x000000, 0);
    R.toneMapping = THREE.ACESFilmicToneMapping;
    R.toneMappingExposure = 1.0;
    R.shadowMap.enabled = !isMobile;
    R.shadowMap.type = THREE.PCFSoftShadowMap;
  };

  const makeScene = async (R: THREE_NS.WebGLRenderer, span: number) => {
    const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
    const scene = new THREE.Scene();
    const pm = new THREE.PMREMGenerator(R);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    pm.dispose();
    scene.add(new THREE.HemisphereLight(0xffffff, 0xdcdce2, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.8);
    key.position.set(span * 0.5, span * 1.4, span);
    key.castShadow = !isMobile;
    if (!isMobile) {
      key.shadow.mapSize.set(2048, 2048);
      Object.assign(key.shadow.camera, { left: -span, right: span, top: span, bottom: -span, near: 0.5, far: span * 5 });
      key.shadow.bias = -0.0004;
      key.shadow.normalBias = 0.02;
    }
    scene.add(key);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(span * 8, span * 8), new THREE.ShadowMaterial({ opacity: 0.18 }));
    ground.material.depthWrite = false;
    ground.renderOrder = -1;
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    return scene;
  };

  /* ── scene pieces: racking and a slab ───────────────────── */

  type RackMats = { upright: THREE_NS.Material; beam: THREE_NS.Material; pallet: THREE_NS.Material; carton: THREE_NS.Material; cartonOdd: THREE_NS.Material };

  const buildRack = ({ bays = 2, levels = 4, bayW = 12, levelH = 7, depth = 5, mats = M as unknown as RackMats, t = 1 } = {}) => {
    const g = new THREE.Group();
    const W = bays * bayW, H = levels * levelH + t;
    const slots: { l: number; b: number; s: number; x: number; y: number }[] = [];
    for (let i = 0; i <= bays; i++) for (const z of [depth / 2, -depth / 2]) bx(0.7 * t, H, 0.7 * t, mats.upright, -W / 2 + i * bayW, H / 2, z, g);
    for (let l = 1; l <= levels; l++)
      for (let b = 0; b < bays; b++)
        for (const z of [depth / 2, -depth / 2]) bx(bayW - 0.7 * t, 0.6 * t, 0.35 * t, mats.beam, -W / 2 + bayW * (b + 0.5), l * levelH, z, g);
    for (let l = 0; l < levels; l++)
      for (let b = 0; b < bays; b++)
        for (let s = 0; s < 2; s++) slots.push({ l, b, s, x: -W / 2 + bayW * (b + 0.25 + s * 0.5), y: l === 0 ? 0 : l * levelH + 0.3 });
    return { g, W, H, depth, slots };
  };

  const load = (
    p: THREE_NS.Object3D, x: number, y: number, z: number,
    mats: RackMats = M as unknown as RackMats, { h = 4.2, odd = false } = {},
  ) => {
    const o = new THREE.Group();
    o.position.set(x, y, z);
    p.add(o);
    bx(5, 0.6, 4.2, mats.pallet, 0, 0.3, 0, o);
    bx(4.7, h, 4, odd ? mats.cartonOdd : mats.carton, 0, 0.6 + h / 2, 0, o);
    return o;
  };

  /* ── what each machine scans ────────────────────────────── */
  //
  // Illustrations of the idea, not measured results. `dir` decides the colour
  // and the chip: "in" is something read, "out" is something flagged.

  const scanAirScan = (): Scan => {
    const group = new THREE.Group(), finds: Find[] = [];
    const rack = buildRack();
    rack.g.position.z = -4.6;
    group.add(rack.g);
    const at = (l: number, b: number, s: number) => rack.slots.find((q) => q.l === l && q.b === b && q.s === s)!;
    const fz = rack.depth / 2;

    rack.slots.forEach((q) => {
      if (q.l === 2 && q.b === 1 && q.s === 0) return; // the free position
      const over = q.l === 3 && q.b === 0 && q.s === 1;
      const odd = q.l === 1 && q.b === 1 && q.s === 1;
      const o = load(rack.g, q.x, q.y, over ? 1.2 : 0, M as unknown as RackMats, { h: q.l === 0 ? 4.8 : 4.2, odd });
      if (over) finds.push({ obj: o, label: "Overhanging load", desc: "Sticking out into the aisle.", dir: "out" });
      if (odd) finds.push({ obj: o, label: "Wrong item", desc: "Not what the system says is here.", dir: "out" });
    });

    const s1 = at(1, 0, 0);
    finds.push({
      obj: bx(1.6, 0.5, 0.06, M.label, s1.x, s1.y - 0.9, fz + 0.25, rack.g),
      label: "Location label read", desc: "Every position, at every level.", dir: "in",
    });
    const s2 = at(2, 1, 0);
    finds.push({
      obj: bx(4.7, 4.2, 4, M.free, s2.x, s2.y + 2.7, 0, rack.g),
      label: "Free position", desc: "Missing from the system. Back in the plan.", dir: "in",
    });
    finds.push({
      obj: outline(1.6, 5, 1.6, M.flag, 0, 17.5, fz, rack.g),
      label: "Bent upright", desc: "Pinned to the bay, with a picture.", dir: "out",
    });
    finds.push({
      obj: bx(1.6, 2, 0.08, M.sign, -rack.W / 2, 3.2, fz + 0.45, rack.g),
      label: "Load notice checked", desc: "Present and readable.", dir: "in",
    });

    const ray = new THREE.Mesh(new THREE.ConeGeometry(3.4, 1, 4, 1, true), M.beamRay);
    group.add(ray);
    const faceZ = rack.g.position.z + fz;

    return {
      group, finds, center: V3(0, 13, -3), radius: 21, top: 29,
      place(h, t, sc) {
        /* Up the face, bay by bay, reversing direction each level — the way a
           drone would actually cover a rack rather than a lawnmower path. */
        const u = reduceMotion ? 0.36 : (t * 0.05) % 1;
        const lv = Math.min(3, Math.floor(u * 4));
        const k = u * 4 - lv;
        const dirn = lv % 2 ? -1 : 1;
        const x = dirn * lerp(-6, 6, ss(clamp(k * 1.25, 0, 1)));
        const y = lv * 7 + 2.3;
        /* Drawn larger than life here, or it disappears against a full rack. */
        const k2 = lerp(1, 1.9, sc);
        h.g.scale.setScalar(k2);
        h.g.position.set(x * sc, y * sc, 4.4 * sc);
        h.g.rotation.y = lerp(h.g.rotation.y, Math.PI * sc, 0.2);
        const podZ = h.g.position.z - 0.55 * k2;
        const len = Math.max(0.5, podZ - faceZ);
        ray.scale.set(1, len, 1);
        ray.position.set(h.g.position.x, h.g.position.y + 0.5 * k2, podZ - len / 2);
        ray.rotation.set(Math.PI / 2, Math.PI / 4, 0, "XYZ");
        ray.visible = sc > 0.95;
      },
    };
  };

  const scanFloorScan = (): Scan => {
    const group = new THREE.Group(), finds: Find[] = [];
    const slabT = 2.2, subT = 4;
    bx(26, slabT, 14, M.concrete, 0, -slabT / 2 - 0.02, 0, group);
    bx(26, subT, 14, M.subbase, 0, -slabT - subT / 2 - 0.02, 0, group);

    const mesh = new THREE.Group();
    group.add(mesh);
    for (let x = -12; x <= 12; x += 1.6) cy(0.04, 13.4, M.rebar, x, -0.75, 0, mesh, "z", 8);
    for (let z = -6.4; z <= 6.4; z += 1.6) cy(0.04, 25.4, M.rebar, 0, -0.66, z, mesh, "x", 8);
    outline(26, slabT, 14, M.edge, 0, -slabT / 2 - 0.02, 0, group);
    outline(26, subT, 14, M.edge, 0, -slabT - subT / 2 - 0.02, 0, group);
    finds.push({ obj: mesh, label: "Reinforcement", desc: "Where it is, and how deep it sits.", dir: "in" });

    const pt = new THREE.CatmullRomCurve3([V3(-13, -1.5, -3.2), V3(-4, -1.0, -3.8), V3(4, -1.6, -2.6), V3(13, -1.1, -3.4)]);
    const cableM = new THREE.Mesh(new THREE.TubeGeometry(pt, 64, 0.18, 10), M.cable);
    group.add(cableM);
    finds.push({ obj: cableM, label: "Post-tension cable", desc: "Found before anyone drills.", dir: "out" });

    const cd = new THREE.CatmullRomCurve3([V3(-7, -1.8, 7), V3(-7, -1.8, 1), V3(-2, -1.8, -1), V3(3, -1.8, -1)]);
    const conduitM = new THREE.Mesh(new THREE.TubeGeometry(cd, 48, 0.22, 10), M.conduit);
    group.add(conduitM);
    finds.push({ obj: conduitM, label: "Buried conduit", desc: "Mapped, so repairs miss it.", dir: "in" });

    const leg = new THREE.Group();
    leg.position.set(8, 0, -4.2);
    group.add(leg);
    bx(0.9, 6, 0.9, M.upright, 0, 3, 0, leg);
    bx(2, 0.2, 2, M.metal, 0, 0.1, 0, leg);
    const v = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 20), M.voidM);
    v.scale.set(2.2, 0.9, 1.8);
    v.position.set(8, -slabT - 0.9, -4.2);
    group.add(v);
    finds.push({ obj: v, label: "Void under a rack leg", desc: "Settlement found while it’s still cheap.", dir: "out" });

    const crack = new THREE.Group();
    crack.position.set(-6, 0.02, 4.6);
    group.add(crack);
    ([[0, 0, 1.4, 0.3], [1.3, 0.4, 1.1, -0.5], [2.3, -0.1, 1.2, 0.4]] as const).forEach(([x, z, l, r]) => {
      const o = bx(l, 0.03, 0.09, M.crack, x, 0, z, crack);
      o.rotation.y = r;
    });
    finds.push({ obj: crack, label: "Surface crack", desc: "Mapped and followed, not just noted.", dir: "out" });

    /* The profile line is the profiler's, and is labelled as such — the radar is
       never credited with flatness anywhere on this page. */
    const pts: THREE_NS.Vector3[] = [];
    for (let i = 0; i <= 80; i++) {
      const x = -12 + i * 0.3;
      pts.push(V3(x, 0.06 + Math.abs(Math.sin(x * 0.55) * 0.12 + Math.sin(x * 1.7) * 0.05), 6.2));
    }
    const prof = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), M.profile);
    group.add(prof);
    finds.push({ obj: prof, label: "Flatness along the aisle", desc: "Read by the profiler, not the radar.", dir: "in" });

    const ray = new THREE.Mesh(new THREE.ConeGeometry(2.2, slabT + subT, 32, 1, true), M.beamRay);
    group.add(ray);

    return {
      group, finds, center: V3(1, -1.6, -1), radius: 12.5, top: 6,
      place(h, t, sc) {
        const u = reduceMotion ? 0.72 : (t * 0.045) % 1;
        const x = lerp(-9, 9, u < 0.5 ? ss(u * 2) : ss(2 - u * 2));
        h.g.position.set(x * sc, 0, -2.2 * sc);
        h.g.rotation.y = lerp(h.g.rotation.y, 0, 0.2 * sc);
        ray.position.set(h.g.position.x, -(slabT + subT) / 2, -2.2);
        ray.visible = sc > 0.95;
        // The void brightens as the radar passes over it.
        M.voidM.emissiveIntensity =
          0.35 + 0.5 * clamp(1 - Math.abs(h.g.position.x - 8) / 3, 0, 1) + (reduceMotion ? 0 : Math.sin(t * 2.4) * 0.08);
      },
    };
  };

  const SCANS: Record<MachineKey, () => Scan> = { airscan: scanAirScan, floorscan: scanFloorScan };

  return { M, PROC, SCANS, makeHolder, explode, spinRotors, maxLift, setupRenderer, makeScene, buildRack, load };
}

export type GiKit = ReturnType<typeof createGiKit>;
