import type * as THREE_NS from "three";
import { FORK_GLB } from "./sst-data";

/* ============================================================================
   /hardware/sensor-stack — the 3D kit, shared by all three scenes.

   Ported from the reference's single `<script type="module">`. Three scenes are
   built from it and they have to agree, which is why it is one file:

   · the **hero film** mounts all five devices on the forklift at the points
     they really go, and plays the LiDAR chapter with the point cloud;
   · the **LiDAR showcase** drives the same forklift around the same point-cloud
     warehouse;
   · the **hardware viewer** shows the same five devices, alone, to be turned.

   The same `DEV.access()` is the unit on the truck's rider panel in the film and
   the unit you drag around in the viewer. If they were built twice they would
   drift, and the page's whole claim is that these are the parts you actually get.

   ── Shape of the port ───────────────────────────────────────────────
   `createSstKit(THREE, isMobile)` mirrors `createOmniKit` in `omni-3d.ts`: the
   reference's module-level consts become closures over an injected `THREE`, so
   three is imported dynamically inside an effect and never reaches the bundle of
   any other route. Everything inside is the reference's own geometry.

   ── What changed ────────────────────────────────────────────────────
   **The forklift loads as a file.** The reference shipped `Better_forklift.glb`
   as 3.2 MB of base64 inside a classic `<script>`, because it had to run from
   `file://` where `fetch()` of a local file and module scripts are both blocked.
   That constraint does not exist here, so the GLB is decoded to
   `public/sensor-stack/rams-forklift.glb` (2.32 MB) and loaded with GLTFLoader
   — same as `/hardware/ai-vision` does with its camera. It parses once and both
   scenes share the promise, so the second scene costs nothing.
   ========================================================================== */

/* ── the warehouse geometry, shared with the read-out ─────────────── */

/** Rack rows, either side of the two aisles at z = 0 and z = 4.5. */
export const RACK_ROWS = [-2.25, 2.25, 6.75];
/** Where the racking starts and ends along x, and the bay pitch. */
export const RACK_X: [number, number] = [-9, 7.2];
export const BAY = 2.7;

export type Part = { obj: THREE_NS.Object3D; label: string; desc: string };
export type Device = { group: THREE_NS.Group; parts: Part[]; size: THREE_NS.Vector3 };
export type DevKey = "access" | "lidar" | "pds" | "rsa" | "bms";
/** The five mount points, measured off the model's own named parts. */
export type Mounts = Record<DevKey, THREE_NS.Vector3> & { size: THREE_NS.Vector3 };

/* ── the forklift ─────────────────────────────────────────────────── */

let forkSrc: Promise<THREE_NS.Group> | null = null;

/**
 * The truck, parsed once for the whole page.
 *
 * Module-level rather than per-kit: the film and the LiDAR showcase each build
 * their own kit but must not each fetch 2.32 MB. The second caller gets the
 * settled promise and clones the scene.
 */
export function loadFork(): Promise<THREE_NS.Group> {
  if (forkSrc) return forkSrc;
  forkSrc = (async () => {
    const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
    return new Promise<THREE_NS.Group>((resolve, reject) => {
      new GLTFLoader().load(
        FORK_GLB,
        (gltf) => resolve(gltf.scene as unknown as THREE_NS.Group),
        undefined,
        (err) => reject(err),
      );
    });
  })();
  // A failed load must not be cached as a permanent rejection for a later scene.
  forkSrc.catch(() => {
    forkSrc = null;
  });
  return forkSrc;
}

export function createSstKit(THREE: typeof THREE_NS, isMobile: boolean) {
  const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
  const TAU = Math.PI * 2;

  /* ── shared bits ────────────────────────────────────────── */

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

  const bx = (
    w: number, h: number, d: number, m: THREE_NS.Material | THREE_NS.Material[],
    x: number, y: number, z: number, p: THREE_NS.Object3D,
  ) => {
    const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    o.position.set(x, y, z);
    p.add(o);
    return o;
  };

  const cy = (
    r: number, h: number, m: THREE_NS.Material,
    x: number, y: number, z: number, p: THREE_NS.Object3D,
    axis: "x" | "y" | "z" = "y", s = 32,
  ) => {
    const o = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, s), m);
    o.position.set(x, y, z);
    if (axis === "x") o.rotation.z = Math.PI / 2;
    if (axis === "z") o.rotation.x = Math.PI / 2;
    p.add(o);
    return o;
  };

  const plane = (w: number, h: number, m: THREE_NS.Material, x: number, y: number, z: number, p: THREE_NS.Object3D) => {
    const o = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m);
    o.position.set(x, y, z);
    p.add(o);
    return o;
  };

  /** An invisible marker a label can point at, where there is no mesh to use. */
  const MARK = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
  const mark = (x: number, y: number, z: number, p: THREE_NS.Object3D, s = 0.01) => bx(s, s, s, MARK, x, y, z, p);

  /** A rounded, bevelled box — the shape every sealed enclosure here is. */
  const roundBox = (w: number, h: number, d: number, r: number, m: THREE_NS.Material) => {
    const s = new THREE.Shape();
    const x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h);
    s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r);
    s.quadraticCurveTo(x, y, x + r, y);
    const g = new THREE.ExtrudeGeometry(s, {
      depth: d, bevelEnabled: true, bevelThickness: r * 0.35, bevelSize: r * 0.35, bevelSegments: 3, curveSegments: 8,
    });
    g.translate(0, 0, -d / 2);
    return new THREE.Mesh(g, m);
  };

  const std = (color: number, o: THREE_NS.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.5 }, o));

  const M = {
    abs: std(0xf1f1ee, { roughness: 0.55 }),
    black: std(0x141416, { roughness: 0.62 }),
    gloss: std(0x07080a, { roughness: 0.12, metalness: 0.5 }),
    steel: std(0xc9ccd2, { roughness: 0.22, metalness: 0.95 }),
    key: std(0x1b1c20, { roughness: 0.5 }),
    cable: std(0x121214, { roughness: 0.7 }),
    yellow: std(0xf2b200, { roughness: 0.45 }),
    red: std(0xc62828, { roughness: 0.5 }),
    pcb: std(0x0f3d27, { roughness: 0.6 }),
    gold: std(0xc8a65a, { roughness: 0.3, metalness: 0.9 }),
    smd: std(0x3a3b40, { roughness: 0.5 }),
    lidar: std(0xe9eaec, { roughness: 0.35, metalness: 0.1 }),
    cyan: new THREE.MeshStandardMaterial({ color: 0x28d9ff, emissive: 0x28d9ff, emissiveIntensity: 1.2 }),
    ledR: new THREE.MeshStandardMaterial({ color: 0xff3b30, emissive: 0xff3b30, emissiveIntensity: 1.1 }),
    ledG: new THREE.MeshStandardMaterial({ color: 0x30d158, emissive: 0x30d158, emissiveIntensity: 1.1 }),
    trace: new THREE.MeshStandardMaterial({ color: 0x2eff9a, emissive: 0x2eff9a, emissiveIntensity: 0.7 }),
    beacon: new THREE.MeshStandardMaterial({
      color: 0xff2d20, emissive: 0xff2d20, emissiveIntensity: 0.35, transparent: true, opacity: 0.9, roughness: 0.2,
    }),
  };

  /* ── the printed faces ──────────────────────────────────── */
  //
  // Drawn to canvas rather than shipped as images: the units are photographed
  // from the front in `media/`, and a texture that has to read at 40px on a
  // truck in the film and at 600px in the viewer is cleaner drawn than scaled.
  // Nothing from the supplied manuals' screenshots is reproduced here — see the
  // head of `sst-data.ts`.

  const RAMSLOGO = (x: CanvasRenderingContext2D, px: number, py: number, s: number, col = "#fff", bg = "#1f55c9") => {
    x.fillStyle = col;
    x.fillRect(px, py, s, s);
    x.fillStyle = bg;
    x.fillRect(px + s * 0.18, py + s * 0.28, s * 0.64, s * 0.1);
    x.fillRect(px + s * 0.18, py + s * 0.62, s * 0.64, s * 0.1);
    x.fillRect(px + s * 0.3, py + s * 0.28, s * 0.08, s * 0.44);
    x.fillRect(px + s * 0.62, py + s * 0.28, s * 0.08, s * 0.44);
    x.fillStyle = col;
    // Named directly: a canvas font string cannot take a CSS variable, and this
    // site's body family is Roboto (`docs/typography.md`).
    x.font = `500 ${s * 0.95}px Roboto, Arial, sans-serif`;
    x.textBaseline = "middle";
    x.fillText("RAMS", px + s * 1.25, py + s * 0.55);
  };

  const blueFace = (extra: (x: CanvasRenderingContext2D, w: number, h: number) => void) =>
    tex(1024, 640, (x, w, h) => {
      const g = x.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#2160d6");
      g.addColorStop(1, "#123c99");
      x.fillStyle = g;
      x.beginPath();
      x.roundRect(0, 0, w, h, 48);
      x.fill();
      extra(x, w, h);
    });

  const ACCESS_FACE = blueFace((x, w, h) => {
    x.fillStyle = "#fff";
    x.font = "800 70px Roboto, Arial, sans-serif";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText("ACCESS CONTROL", w * 0.56, h * 0.13);
    x.textAlign = "left";
    RAMSLOGO(x, 120, 200, 58);
    x.strokeStyle = "#fff";
    x.lineWidth = 9;
    x.beginPath();
    x.roundRect(120, 330, 190, 190, 22);
    x.stroke();
    x.lineWidth = 8;
    for (let i = 0; i < 3; i++) {
      x.beginPath();
      x.arc(212, 420, 28 + i * 24, -Math.PI * 0.95, -Math.PI * 0.05);
      x.stroke();
    }
    x.fillStyle = "#fff";
    x.beginPath();
    x.arc(212, 420, 11, 0, TAU);
    x.fill();
    x.font = "800 58px Roboto, Arial, sans-serif";
    x.textAlign = "center";
    x.fillText("RFID", 215, 488);
  });

  const RSA_FACE = blueFace((x, w, h) => {
    x.fillStyle = "#fff";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.font = "600 22px Roboto, Arial, sans-serif";
    ["Power", "Sense", "Trigger"].forEach((t, i) => x.fillText(t, w * (0.38 + i * 0.12), h * 0.1));
    x.font = "600 50px Roboto, Arial, sans-serif";
    x.fillText("Reverse Sensor Alarm", w * 0.5, h * 0.88);
    x.textAlign = "left";
    RAMSLOGO(x, w * 0.7, h * 0.58, 52);
    x.fillStyle = "#f2b200";
    x.fillRect(90, 170, 120, 70);
    x.fillStyle = "#fff";
    x.fillRect(110, 150, 24, 40);
  });

  const KEYPAD = tex(360, 480, (x, w, h) => {
    x.fillStyle = "#0e0f11";
    x.fillRect(0, 0, w, h);
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].forEach((k, i) => {
      const cx = 30 + (i % 3) * 110, cy2 = 24 + Math.floor(i / 3) * 114;
      const g = x.createLinearGradient(0, cy2, 0, cy2 + 90);
      g.addColorStop(0, "#2a2b30");
      g.addColorStop(1, "#141518");
      x.fillStyle = g;
      x.beginPath();
      x.roundRect(cx, cy2, 90, 90, 10);
      x.fill();
      x.fillStyle = "#f2f2f2";
      x.font = "600 50px Roboto, Arial, sans-serif";
      x.textAlign = "center";
      x.textBaseline = "middle";
      x.fillText(k, cx + 45, cy2 + 48);
    });
  });

  const EMBOSS = tex(1024, 300, (x, w, h) => {
    x.fillStyle = "#141416";
    x.fillRect(0, 0, w, h);
    x.font = "italic 700 150px Roboto, Arial, sans-serif";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillStyle = "#0a0a0b";
    x.fillText("RAMS Digital", w / 2 + 4, h / 2 + 4);
    x.fillStyle = "#2a2b30";
    x.fillText("RAMS Digital", w / 2, h / 2);
  });

  const CHIPTOP = tex(512, 512, (x, w, h) => {
    x.fillStyle = "#111312";
    x.fillRect(0, 0, w, h);
    x.fillStyle = "#2a2d2b";
    x.beginPath();
    x.arc(60, 60, 22, 0, TAU);
    x.fill();
    x.fillStyle = "#e8e8e8";
    x.font = "800 130px Roboto, Arial, sans-serif";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText("BMS", w / 2, h * 0.46);
    x.fillStyle = "#7a7d7b";
    x.font = "600 44px Roboto, Arial, sans-serif";
    x.fillText("RAMS DIGITAL", w / 2, h * 0.7);
  });

  const matOf = (t: THREE_NS.Texture) => new THREE.MeshStandardMaterial({ map: t, roughness: 0.45 });

  /* ── the devices ────────────────────────────────────────── */
  //
  // Metres, front facing +z, sitting on y = 0 — so a device can be dropped on
  // the truck at a mount point and it faces the right way with one rotation.
  // Every dimension is off the product photos in `public/sensor-stack/`.

  /** The sealed enclosure Access Control and the Reverse Sensor Alarm share. */
  const enclosure = (g: THREE_NS.Group, w: number, h: number, d: number) => {
    const body = roundBox(w, h, d, 0.018, M.abs);
    body.position.set(0, h / 2, 0);
    g.add(body);
    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        const ear = roundBox(0.03, 0.03, 0.008, 0.006, M.abs);
        ear.position.set(sx * (w / 2 + 0.008), h / 2 + sy * (h / 2 - 0.012), -d / 2 + 0.006);
        g.add(ear);
        cy(0.006, 0.01, M.steel, sx * (w / 2 - 0.012), h / 2 + sy * (h / 2 - 0.012), d / 2 + 0.004, g, "z", 16);
      }
    }
  };

  const DEV: Record<DevKey, () => Device> = {
    access() {
      const g = new THREE.Group(), parts: Part[] = [], W = 0.24, H = 0.15, D = 0.085;
      enclosure(g, W, H, D);
      plane(W * 0.9, H * 0.84, matOf(ACCESS_FACE), 0, H / 2, D / 2 + 0.0085, g);

      const kp = new THREE.Group();
      kp.position.set(W * 0.235, H * 0.43, D / 2 + 0.0105);
      g.add(kp);
      bx(0.074, 0.094, 0.006, M.steel, 0, 0, 0, kp);
      plane(0.066, 0.086, matOf(KEYPAD), 0, 0, 0.0032, kp);

      const fp = new THREE.Group();
      fp.position.set(-W * 0.035, H * 0.3, D / 2 + 0.0105);
      g.add(fp);
      fp.add(new THREE.Mesh(new THREE.TorusGeometry(0.016, 0.0045, 14, 40), M.steel));
      const glow = new THREE.Mesh(new THREE.TorusGeometry(0.0112, 0.0012, 10, 40), M.cyan);
      glow.position.z = 0.002;
      fp.add(glow);
      cy(0.0108, 0.004, M.gloss, 0, 0, 0.001, fp, "z");

      for (const sx of [-0.055, 0.035]) {
        cy(0.011, 0.02, M.abs, sx, -0.008, 0, g);
        cy(0.005, 0.05, M.cable, sx, -0.035, 0, g);
      }
      bx(0.006, 0.022, 0.03, M.black, -W / 2 - 0.004, H * 0.55, 0, g);
      bx(0.004, 0.012, 0.012, M.key, -W / 2 - 0.008, H * 0.58, 0, g);

      parts.push({ obj: mark(-W * 0.3, H * 0.35, D / 2, g), label: "RFID reader", desc: "Tap an enrolled card." });
      parts.push({ obj: fp, label: "Fingerprint reader", desc: "Lights up when it reads." });
      parts.push({ obj: kp, label: "PIN keypad", desc: "A 4-digit code per operator." });
      parts.push({ obj: mark(-W / 2 - 0.006, H * 0.56, 0, g), label: "Power switch", desc: "On the side, no unplugging." });
      parts.push({ obj: mark(-0.01, -0.005, 0, g), label: "Cable glands", desc: "Supply, key circuit, relay." });
      return { group: g, parts, size: V3(W, H, D) };
    },

    lidar() {
      const g = new THREE.Group(), parts: Part[] = [];
      bx(0.12, 0.006, 0.12, M.black, 0, 0.003, 0, g);
      cy(0.055, 0.03, M.lidar, 0, 0.021, 0, g, "y", 48);
      const win = cy(0.052, 0.038, M.gloss, 0, 0.055, 0, g, "y", 48);
      cy(0.055, 0.018, M.lidar, 0, 0.083, 0, g, "y", 48);
      cy(0.045, 0.004, M.black, 0, 0.093, 0, g, "y", 48);
      cy(0.004, 0.06, M.cable, 0.07, 0.01, 0, g, "x", 12);
      parts.push({ obj: win, label: "Scanning window", desc: "Sees all around the truck, in 3D." });
      parts.push({ obj: mark(0, 0.003, 0.06, g), label: "Mounting plate", desc: "Fixed up high on the truck." });
      return { group: g, parts, size: V3(0.12, 0.095, 0.12) };
    },

    pds() {
      const g = new THREE.Group(), parts: Part[] = [], W = 0.17, H = 0.07, D = 0.135;
      const body = roundBox(W, H, D, 0.008, M.black);
      body.position.set(0, H / 2, 0);
      g.add(body);

      const heads: THREE_NS.Group[] = [];
      for (const sx of [-W * 0.25, W * 0.25]) {
        const hd = new THREE.Group();
        hd.position.set(sx, H + 0.001, -D * 0.18);
        g.add(hd);
        bx(0.062, 0.004, 0.038, M.gloss, 0, -0.001, 0, hd);
        bx(0.056, 0.006, 0.03, M.key, 0, 0.002, 0, hd);
        for (const lx of [-0.013, 0.013]) {
          cy(0.0105, 0.006, M.gloss, lx, 0.005, 0, hd, "y", 28);
          cy(0.006, 0.007, M.steel, lx, 0.005, 0, hd, "y", 20);
        }
        heads.push(hd);
      }
      plane(W * 0.8, H * 0.34, matOf(EMBOSS), 0, H * 0.58, D / 2 + 0.0045, g);
      bx(W * 0.36, H * 0.22, 0.004, M.gloss, 0, H * 0.18, D / 2 + 0.002, g);
      bx(0.012, 0.012, 0.02, M.yellow, W / 2 + 0.006, H * 0.4, D * 0.3, g);
      cy(0.0022, 0.04, M.red, W / 2 + 0.03, H * 0.42, D * 0.3, g, "x", 10);
      cy(0.0022, 0.04, M.cable, W / 2 + 0.03, H * 0.36, D * 0.3, g, "x", 10);

      parts.push({ obj: heads[0], label: "Sensing heads", desc: "Two, looking along the forks." });
      parts.push({ obj: mark(0, H * 0.58, D / 2, g), label: "RAMS Digital housing", desc: "Compact, for the fork carriage." });
      parts.push({ obj: mark(W / 2 + 0.01, H * 0.4, D * 0.3, g), label: "Power lead", desc: "One locking connector." });
      return { group: g, parts, size: V3(W, H, D) };
    },

    rsa() {
      const g = new THREE.Group(), parts: Part[] = [], W = 0.22, H = 0.15, D = 0.085;
      enclosure(g, W, H, D);
      plane(W * 0.9, H * 0.84, matOf(RSA_FACE), 0, H / 2, D / 2 + 0.0085, g);
      const puck = cy(0.034, 0.02, M.black, W * 0.02, H * 0.5, D / 2 + 0.018, g, "z", 48);
      cy(0.028, 0.022, M.key, W * 0.02, H * 0.5, D / 2 + 0.019, g, "z", 48);

      const leds = new THREE.Group();
      g.add(leds);
      [M.ledR, M.ledG, M.ledR].forEach((m, i) => {
        const s = new THREE.Mesh(new THREE.SphereGeometry(0.0045, 16, 12), m);
        s.position.set(W * (-0.12 + i * 0.12), H * 0.8, D / 2 + 0.011);
        leds.add(s);
      });
      for (const sx of [-0.03, 0.03]) {
        cy(0.011, 0.02, M.abs, sx, H + 0.008, -0.005, g);
        cy(0.005, 0.05, M.cable, sx, H + 0.04, -0.005, g);
      }

      const b = new THREE.Group();
      b.position.set(W / 2 + 0.08, 0, 0);
      g.add(b);
      cy(0.035, 0.05, M.abs, 0, 0.025, 0, b, "y", 40);
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.033, 32, 20, 0, TAU, 0, Math.PI / 2), M.beacon);
      dome.scale.y = 1.5;
      dome.position.y = 0.05;
      b.add(dome);
      cy(0.033, 0.03, M.beacon, 0, 0.062, 0, b, "y", 40);

      parts.push({ obj: puck, label: "LiDAR puck", desc: "Measures what’s behind." });
      parts.push({ obj: leds, label: "Power · Sense · Trigger", desc: "Status at a glance." });
      parts.push({ obj: b, label: "Beacon", desc: "Sounds and flashes when too close." });
      return { group: g, parts, size: V3(W + 0.16, H, D) };
    },

    bms() {
      const g = new THREE.Group(), parts: Part[] = [], S = 0.12;
      bx(S, 0.004, S, M.pcb, 0, 0.002, 0, g);
      const ic = bx(0.05, 0.008, 0.05, M.black, 0, 0.008, 0, g);
      // Only the top face carries the printed chip; the sides stay moulded black.
      ic.material = [M.black, M.black, matOf(CHIPTOP), M.black, M.black, M.black];
      for (let i = 0; i < 8; i++) {
        for (const s of [-1, 1]) {
          bx(0.003, 0.002, 0.006, M.gold, -0.021 + i * 0.006, 0.0045, s * 0.028, g);
          bx(0.006, 0.002, 0.003, M.gold, s * 0.028, 0.0045, -0.021 + i * 0.006, g);
        }
      }
      const traces = new THREE.Group();
      g.add(traces);
      ([[0, 0.036, 0.004, 0.036], [0.036, 0, 0.036, 0.004], [0, -0.036, 0.004, 0.036],
        [-0.036, 0, 0.036, 0.004], [0.03, 0.03, 0.04, 0.003], [-0.03, -0.03, 0.04, 0.003]] as const)
        .forEach(([x, z, w, d]) => bx(w, 0.0012, d, M.trace, x, 0.0046, z, traces));
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * TAU;
        bx(0.006, 0.003, 0.004, M.smd, Math.cos(a) * 0.048, 0.0055, Math.sin(a) * 0.048, g);
      }
      for (let i = 0; i < 5; i++) bx(0.008, 0.003, 0.005, M.gold, -S / 2 + 0.006, 0.004, -0.03 + i * 0.015, g);

      parts.push({ obj: ic, label: "Battery management chip", desc: "Charge, cycles and health." });
      parts.push({ obj: mark(-S / 2 + 0.006, 0.004, 0, g), label: "Cell connections", desc: "Reads the battery directly." });
      parts.push({ obj: traces, label: "Status out", desc: "Into the truck’s record." });
      return { group: g, parts, size: V3(S, 0.02, S) };
    },
  };

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
      Object.assign(key.shadow.camera, {
        left: -span, right: span, top: span, bottom: -span, near: span * 0.05, far: span * 5,
      });
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

  /* ── fitting the truck ──────────────────────────────────── */

  /**
   * The GLB is authored −X forward and at an arbitrary scale. This turns it to
   * −Z forward, fits it to a 2.3 m truck and drops its wheels onto y = 0, so the
   * mount points below and the warehouse cloud are all in the same metres.
   */
  const fitFork = (src: THREE_NS.Group) => {
    const m = src.clone(true);
    m.rotation.y = -Math.PI / 2;
    m.updateMatrixWorld(true);
    let bb = new THREE.Box3().setFromObject(m);
    const sz = bb.getSize(V3());
    m.scale.setScalar(2.3 / Math.max(sz.y, 1e-6));
    m.updateMatrixWorld(true);
    bb = new THREE.Box3().setFromObject(m);
    const c = bb.getCenter(V3());
    m.position.set(-c.x, -bb.min.y, -c.z);
    const g = new THREE.Group();
    g.add(m);
    g.updateMatrixWorld(true);
    m.traverse((o) => {
      const mesh = o as THREE_NS.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = !isMobile;
      mesh.receiveShadow = !isMobile;
      const ms = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      ms.forEach((x) => {
        if (x && "envMapIntensity" in x) (x as THREE_NS.MeshStandardMaterial).envMapIntensity = 0.35;
      });
    });
    return g;
  };

  /**
   * Where each sensor sits, measured off the model's **own named parts** rather
   * than typed in as coordinates: `roof`, `rider_panel`, `lift_attatch`, `seat`,
   * `backside_withengine`. (The misspelling is the model's, not ours.) If the
   * GLB is ever replaced with a different truck the sensors follow it, and the
   * fallbacks behind each `||` keep the film standing if a part is renamed.
   */
  const mountsOf = (g: THREE_NS.Group): Mounts => {
    g.updateMatrixWorld(true);
    const box = (n: string) => {
      const o = g.getObjectByName(n);
      return o ? new THREE.Box3().setFromObject(o) : null;
    };
    const all = new THREE.Box3().setFromObject(g);
    const roof = box("roof") || all;
    const panel = box("rider_panel");
    const carriage = box("lift_attatch") || box("lift_system");
    const seat = box("seat");
    const back = box("backside_withengine");
    const mid = (b: THREE_NS.Box3) => b.getCenter(V3());
    return {
      lidar: V3(mid(roof).x, roof.max.y + 0.01, mid(roof).z),
      access: panel ? V3(mid(panel).x + 0.28, panel.max.y + 0.02, mid(panel).z) : V3(0.3, 1.4, -0.2),
      pds: carriage
        ? V3(mid(carriage).x, carriage.min.y + (carriage.max.y - carriage.min.y) * 0.62, carriage.min.z - 0.02)
        : V3(0, 1, -1.4),
      bms: seat ? V3(mid(seat).x, seat.min.y - 0.12, seat.max.z + 0.05) : V3(0, 0.9, 0.4),
      rsa: back ? V3(mid(back).x, back.min.y + (back.max.y - back.min.y) * 0.75, back.max.z + 0.03) : V3(0, 1.1, 1.2),
      size: all.getSize(V3()),
    };
  };

  /* ── the LiDAR point cloud ──────────────────────────────── */

  /**
   * A warehouse drawn as LiDAR returns: floor, three rack rows with pallets on
   * them, walls, a person, and a parked truck. Aisles run along x at z = 0 and
   * z = 4.5.
   *
   * `aKind` rides along per point — 0 floor, 1 structure, 2 a thing that moves
   * (the person, the parked truck) — and the shader colours by it, so the two
   * returns that matter read differently from the building without a second
   * draw call. `density` is dropped to 0.55 in the film, where the cloud is a
   * chapter rather than the subject.
   */
  const buildCloud = (density = 1) => {
    const P: number[] = [], K: number[] = [];
    const push = (x: number, y: number, z: number, k: number) => {
      P.push(x, y, z);
      K.push(k);
    };
    const j = () => (Math.random() - 0.5) * 0.03;
    const st = (v: number) => v / Math.sqrt(density);

    for (let x = -14; x <= 14; x += st(0.34)) for (let z = -9; z <= 10; z += st(0.34)) push(x + j() * 4, 0, z + j() * 4, 0);

    for (const zc of RACK_ROWS) {
      for (const fz of [zc - 0.6, zc + 0.6]) {
        for (let x = RACK_X[0]; x <= RACK_X[1] + 0.01; x += BAY) for (let y = 0; y <= 5; y += st(0.07)) push(x + j(), y, fz + j(), 1);
        for (const by of [1.5, 3, 4.5]) for (let x = RACK_X[0]; x <= RACK_X[1]; x += st(0.09)) push(x, by + j(), fz + j(), 1);
        for (let b = 0; b < Math.round((RACK_X[1] - RACK_X[0]) / BAY); b++) {
          for (let lv = 0; lv < 4; lv++) {
            for (let s = 0; s < 2; s++) {
              // A fifth of the bays are left empty, or the racking reads as a wall.
              if (Math.random() < 0.22) continue;
              const x0 = RACK_X[0] + b * BAY + 0.2 + s * 1.25, y0 = lv * 1.5 + 0.12;
              for (let px = 0; px <= 1.1; px += st(0.15)) {
                for (let py = 0; py <= 1.15; py += st(0.15)) push(x0 + px + j(), y0 + py + j(), fz + (fz < zc ? -0.02 : 0.02) + j(), 1);
              }
            }
          }
        }
      }
    }

    for (const wx of [-14, 14]) for (let z = -9; z <= 10; z += st(0.4)) for (let y = 0; y <= 6; y += st(0.4)) push(wx, y + j(), z + j(), 1);
    for (let x = -14; x <= 14; x += st(0.4)) for (let y = 0; y <= 6; y += st(0.4)) push(x + j(), y, -9, 1);

    /* a person, standing by the dock */
    for (let i = 0; i < 260; i++) {
      const a = Math.random() * TAU, y = Math.random() * 1.75, r = y > 1.45 ? 0.12 : 0.2;
      push(10.4 + Math.cos(a) * r, y, 2 + Math.sin(a) * r, 2);
    }
    /* a parked truck, as three faces of returns */
    for (let i = 0; i < 700; i++) {
      const u = Math.random(), v = Math.random(), f = Math.floor(Math.random() * 3);
      const x = -12.6 + (f === 0 ? u * 1.2 : Math.random() < 0.5 ? 0 : 1.2);
      const y = f === 1 ? 2.2 : v * 2.2;
      const z = -4.2 + (f === 2 ? u * 2.6 : Math.random() < 0.5 ? 0 : 2.6);
      push(x, y, z, 2);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(P, 3));
    geo.setAttribute("aKind", new THREE.Float32BufferAttribute(K, 1));
    return geo;
  };

  /**
   * The sweep.
   *
   * Each point works out its own angle from the sensor and how far behind the
   * beam it is (`lag`), and fades on that — so the cloud is brightest where the
   * scanner just passed and dims round the circle, which is what a rotating
   * LiDAR actually looks like. `uHit`/`uHitT` fire a red shockwave out from an
   * impact point, expanding at 3.5 m/s and decaying in about a second, so the
   * crash view has a cause you can see rather than a label that appears.
   *
   * Additive blending and no depth write: returns should build up where they
   * overlap, as they do on a real scan.
   */
  const cloudMaterial = () =>
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uO: { value: V3() },
        uAng: { value: 0 },
        uTime: { value: 0 },
        uRange: { value: 16 },
        uOp: { value: 1 },
        uHit: { value: V3(0, -99, 0) },
        uHitT: { value: -99 },
        uScale: { value: 500 },
        uSize: { value: 0.07 },
      },
      vertexShader: `attribute float aKind;uniform vec3 uO,uHit;uniform float uAng,uTime,uRange,uOp,uHitT,uScale,uSize;varying vec3 vC;varying float vA;
      void main(){vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;
        vec3 wp=(modelMatrix*vec4(position,1.)).xyz;vec2 d=wp.xz-uO.xz;float r=length(d);
        float a=atan(d.y,d.x);float lag=mod(uAng-a+62.8318,6.28318)/6.28318;
        float sweep=exp(-lag*3.2);float inR=1.-smoothstep(uRange*.7,uRange,r);
        float b=(.22+.78*sweep)*inR+.05;
        vec3 base=aKind<.5?vec3(.07,.26,.30):mix(vec3(.04,.62,.70),vec3(.80,1.,.96),clamp(wp.y/5.,0.,1.));
        if(aKind>1.5)base=vec3(1.,.72,.25);
        float hd=length(wp-uHit),age=uTime-uHitT;float on=step(0.,age)*exp(-age*.9);
        float ring=exp(-pow((hd-age*3.5)*2.4,2.))*on;float near=exp(-hd*1.4)*on;
        vC=mix(base*b,vec3(1.,.22,.16)*1.3,clamp(ring*1.3+near,0.,1.));
        vA=uOp*clamp(b+ring+near,0.,1.);
        gl_PointSize=max(1.,uSize*uScale*(1.+ring*1.4)/-mv.z);}`,
      fragmentShader: `varying vec3 vC;varying float vA;void main(){vec2 c=gl_PointCoord-.5;float d=dot(c,c);if(d>.25)discard;gl_FragColor=vec4(vC,vA*(1.-d*2.2));}`,
    });

  return { M, DEV, setupRenderer, makeScene, fitFork, mountsOf, buildCloud, cloudMaterial };
}

export type SstKit = ReturnType<typeof createSstKit>;
