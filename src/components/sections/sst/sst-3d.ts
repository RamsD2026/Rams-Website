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

const glbSrc = new Map<string, Promise<THREE_NS.Group>>();

/** A device GLB, parsed once for the whole page — the viewer, the lineup and the truck share it. */
function loadGlb(url: string): Promise<THREE_NS.Group> {
  let p = glbSrc.get(url);
  if (!p) {
    p = import("three/examples/jsm/loaders/GLTFLoader.js").then(
      ({ GLTFLoader }) => new GLTFLoader().loadAsync(url).then((g) => g.scene as unknown as THREE_NS.Group),
    );
    glbSrc.set(url, p);
    // As with the truck: a failed load must not stay cached.
    p.catch(() => glbSrc.delete(url));
  }
  return p;
}

export function createSstKit(THREE: typeof THREE_NS, isMobile: boolean) {
  const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
  /** The Pallet Detection Sensor's real size, off the supplied CAD (millimetres in the 3MF). */
  const PDS_SIZE = V3(0.1048, 0.08, 0.035);
  /** The LiDAR's, off its STEP: 74.9 × 63.6 × 75 mm. */
  const LIDAR_SIZE = V3(0.0749, 0.0636, 0.075);
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

  /* ── the brand mark ─────────────────────────────────────── */
  //
  // Drawn from the site's own `RAMS_Logo_White.svg` — white wordmark, #FF6A00
  // corner tick — rather than re-lettered in canvas, so every unit carries the
  // real logo in the real colours. The SVG decodes asynchronously, so a texture
  // that uses it is drawn once now and again the moment the image is ready.

  const LOGO_AR = 626.25 / 247.58;
  const logoImg = new Image();
  const logoReady: (() => void)[] = [];
  logoImg.onload = () => logoReady.splice(0).forEach((f) => f());
  logoImg.src = "/RAMS_Logo_White.svg";

  /** The logo at `w` px wide; `mono` recolours the whole mark (silkscreen, laser etch). */
  const drawLogo = (x: CanvasRenderingContext2D, px: number, py: number, w: number, mono?: string) => {
    if (!logoImg.complete || !logoImg.naturalWidth) return;
    const h = w / LOGO_AR;
    if (!mono) {
      x.drawImage(logoImg, px, py, w, h);
      return;
    }
    const c = document.createElement("canvas");
    c.width = Math.ceil(w);
    c.height = Math.ceil(h);
    const y = c.getContext("2d")!;
    y.drawImage(logoImg, 0, 0, w, h);
    y.globalCompositeOperation = "source-in";
    y.fillStyle = mono;
    y.fillRect(0, 0, c.width, c.height);
    x.drawImage(c, px, py);
  };

  /** `tex`, redrawn once the logo has decoded. */
  const brandTex = (w: number, h: number, fn: (c: CanvasRenderingContext2D, w: number, h: number) => void) => {
    const t = tex(w, h, fn);
    if (!logoImg.complete) {
      logoReady.push(() => {
        const c = t.image as HTMLCanvasElement;
        const x = c.getContext("2d")!;
        x.clearRect(0, 0, w, h);
        fn(x, w, h);
        t.needsUpdate = true;
      });
    }
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
    lidar: std(0xe9eaec, { roughness: 0.35, metalness: 0.1 }),
    /* The branded units: a matte black shell, gunmetal hardware, brand orange. */
    shell: std(0x131416, { roughness: 0.58, envMapIntensity: 0.55 }),
    gunmetal: std(0x3b3d42, { roughness: 0.32, metalness: 0.85 }),
    orange: new THREE.MeshStandardMaterial({ color: 0xff6a00, emissive: 0xff6a00, emissiveIntensity: 0.9 }),
    /* The BMS board: none of it glows — real copper sits under solder mask. */
    fr4: std(0xb3ad8a, { roughness: 0.8 }),
    mask: std(0x0e4a2c, { roughness: 0.45 }),
    epoxy: std(0x17181a, { roughness: 0.6 }),
    tin: std(0xd3d6da, { roughness: 0.28, metalness: 0.9 }),
    ceramic: std(0xa88a62, { roughness: 0.65 }),
    header: std(0xefe7d2, { roughness: 0.55 }),
    alu: std(0xc7cacf, { roughness: 0.3, metalness: 0.85 }),
    ledOn: new THREE.MeshStandardMaterial({ color: 0x7dffb0, emissive: 0x30d158, emissiveIntensity: 1.4 }),
    ledR: new THREE.MeshStandardMaterial({ color: 0xff3b30, emissive: 0xff3b30, emissiveIntensity: 1.1 }),
    ledG: new THREE.MeshStandardMaterial({ color: 0x30d158, emissive: 0x30d158, emissiveIntensity: 1.1 }),
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

  const blueFace = (extra: (x: CanvasRenderingContext2D, w: number, h: number) => void) =>
    brandTex(1024, 640, (x, w, h) => {
      const g = x.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#2160d6");
      g.addColorStop(1, "#123c99");
      x.fillStyle = g;
      x.beginPath();
      x.roundRect(0, 0, w, h, 48);
      x.fill();
      extra(x, w, h);
    });

  /* The Access Control face. A black glass panel, laid out to the hardware
     mounted on it: every position below is the matching part's position in
     `DEV.access()` mapped into this 1024 × 598 canvas — the RFID zone at
     x −0.3W, the fingerprint ring at −0.035W, the keypad block on the right —
     so the print and the parts line up at any angle. */
  const ACCESS_FACE = brandTex(1024, 598, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#1a1b1f");
    g.addColorStop(1, "#0b0c0e");
    x.fillStyle = g;
    x.beginPath();
    x.roundRect(0, 0, w, h, 40);
    x.fill();
    x.strokeStyle = "rgba(255,255,255,.07)";
    x.lineWidth = 3;
    x.beginPath();
    x.roundRect(6, 6, w - 12, h - 12, 36);
    x.stroke();

    drawLogo(x, 66, 52, 236);

    x.fillStyle = "#f3f1ec";
    x.textAlign = "right";
    x.textBaseline = "alphabetic";
    x.font = "500 34px Roboto, Arial, sans-serif";
    x.letterSpacing = "7px";
    x.fillText("ACCESS CONTROL", w - 64, 88);
    x.fillStyle = "#ff6a00";
    x.fillRect(w - 64 - 56, 104, 56, 4);

    // The RFID zone: a hairline field with the contactless mark in it.
    const rx = 171, ry = 406;
    x.strokeStyle = "rgba(243,241,236,.28)";
    x.lineWidth = 3;
    x.beginPath();
    x.roundRect(rx - 92, ry - 92, 184, 184, 26);
    x.stroke();
    x.strokeStyle = "#f3f1ec";
    x.lineCap = "round";
    x.lineWidth = 9;
    for (let i = 0; i < 3; i++) {
      x.beginPath();
      x.arc(rx - 30, ry, 22 + i * 20, -Math.PI * 0.3, Math.PI * 0.3);
      x.stroke();
    }
    x.fillStyle = "#f3f1ec";
    x.beginPath();
    x.arc(rx - 30, ry, 8, 0, TAU);
    x.fill();

    x.textAlign = "center";
    x.font = "500 22px Roboto, Arial, sans-serif";
    x.letterSpacing = "5px";
    x.fillStyle = "rgba(243,241,236,.62)";
    x.fillText("TAP CARD", rx, ry + 136);
    x.fillText("FINGER", 472, ry + 136);
    x.letterSpacing = "0px";
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
    drawLogo(x, w * 0.68, h * 0.56, 190);
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

  /** The PDS front logo on its own, for the fallback build's engraved panel. */
  const PDS_LOGO = brandTex(512, 203, (x, w) => drawLogo(x, 0, 0, w));

  /** The MCU's top: laser-etched, so low-contrast grey on black, never white. */
  const CHIPTOP = brandTex(512, 512, (x, w, h) => {
    x.fillStyle = "#18191b";
    x.fillRect(0, 0, w, h);
    x.fillStyle = "#0d0e0f";
    x.beginPath();
    x.arc(70, 70, 26, 0, TAU);
    x.fill();
    drawLogo(x, w / 2 - 150, 120, 300, "#8b8e93");
    x.fillStyle = "#8b8e93";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.font = "500 58px Roboto Mono, monospace";
    x.fillText("RD-BMS", w / 2, h * 0.62);
    x.font = "500 42px Roboto Mono, monospace";
    x.fillText("2631  A7Q", w / 2, h * 0.76);
  });

  /** The AFE's top, the same etch at TSSOP proportions. */
  const AFETOP = tex(512, 232, (x, w, h) => {
    x.fillStyle = "#18191b";
    x.fillRect(0, 0, w, h);
    x.fillStyle = "#0d0e0f";
    x.beginPath();
    x.arc(34, h - 34, 14, 0, TAU);
    x.fill();
    x.fillStyle = "#8b8e93";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.font = "500 50px Roboto Mono, monospace";
    x.fillText("RD-AFE", w / 2, h * 0.38);
    x.font = "500 34px Roboto Mono, monospace";
    x.fillText("2629 K1", w / 2, h * 0.7);
  });

  const matOf = (t: THREE_NS.Texture) => new THREE.MeshStandardMaterial({ map: t, roughness: 0.45 });

  /* ── the devices ────────────────────────────────────────── */
  //
  // Metres, front facing +z, sitting on y = 0 — so a device can be dropped on
  // the truck at a mount point and it faces the right way with one rotation.
  // Every dimension is off the product photos in `public/sensor-stack/`.

  /** The sealed enclosure Access Control and the Reverse Sensor Alarm share. */
  const enclosure = (
    g: THREE_NS.Group, w: number, h: number, d: number,
    shell: THREE_NS.Material = M.abs, screw: THREE_NS.Material | null = M.steel, ears = true,
  ) => {
    const body = roundBox(w, h, d, 0.018, shell);
    body.position.set(0, h / 2, 0);
    g.add(body);
    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        if (ears) {
          const ear = roundBox(0.03, 0.03, 0.008, 0.006, shell);
          ear.position.set(sx * (w / 2 + 0.008), h / 2 + sy * (h / 2 - 0.012), -d / 2 + 0.006);
          g.add(ear);
        }
        if (screw) cy(0.006, 0.01, screw, sx * (w / 2 - 0.012), h / 2 + sy * (h / 2 - 0.012), d / 2 + 0.004, g, "z", 16);
      }
    }
  };

  const DEV: Record<DevKey, () => Device> = {
    /* Matte black shell, black glass face, gunmetal hardware, brand orange for
       the one thing that is alive — the fingerprint ring. No cable glands in
       view: the supply, key circuit and relay leave through the back. */
    access() {
      const g = new THREE.Group(), parts: Part[] = [], W = 0.24, H = 0.15, D = 0.07;
      // No face screws and no corner mounting ears: a clean black block.
      enclosure(g, W, H, D, M.shell, null, false);
      const face = new THREE.MeshStandardMaterial({
        map: ACCESS_FACE, roughness: 0.16, metalness: 0.1, transparent: true, alphaTest: 0.5,
      });
      plane(W * 0.9, H * 0.84, face, 0, H / 2, D / 2 + 0.0085, g);

      const kp = new THREE.Group();
      kp.position.set(W * 0.235, H * 0.43, D / 2 + 0.0105);
      g.add(kp);
      bx(0.074, 0.094, 0.006, M.gunmetal, 0, 0, 0, kp);
      plane(0.066, 0.086, matOf(KEYPAD), 0, 0, 0.0032, kp);

      const fp = new THREE.Group();
      fp.position.set(-W * 0.035, H * 0.35, D / 2 + 0.0105);
      g.add(fp);
      fp.add(new THREE.Mesh(new THREE.TorusGeometry(0.016, 0.0045, 14, 40), M.gunmetal));
      const glow = new THREE.Mesh(new THREE.TorusGeometry(0.0112, 0.0012, 10, 40), M.orange);
      glow.position.z = 0.002;
      fp.add(glow);
      cy(0.0108, 0.004, M.gloss, 0, 0, 0.001, fp, "z");

      bx(0.006, 0.022, 0.03, M.shell, -W / 2 - 0.004, H * 0.55, 0, g);
      bx(0.004, 0.012, 0.012, M.gunmetal, -W / 2 - 0.008, H * 0.58, 0, g);

      parts.push({ obj: mark(-W * 0.3, H * 0.35, D / 2, g), label: "RFID reader", desc: "" });
      parts.push({ obj: fp, label: "Fingerprint reader", desc: "" });
      parts.push({ obj: kp, label: "PIN keypad", desc: "" });
      parts.push({ obj: mark(-W / 2 - 0.006, H * 0.56, 0, g), label: "Power switch", desc: "" });
      return { group: g, parts, size: V3(W, H, D) };
    },

    /* The fallback for the real CAD model (`REAL.lidar`), at its 74.9 × 63.6 ×
       75 mm: a round black base and the twin-lobed scanning head on top. */
    lidar() {
      const g = new THREE.Group(), parts: Part[] = [];
      const W = LIDAR_SIZE.x, H = LIDAR_SIZE.y;
      cy(W / 2, H * 0.38, M.shell, 0, H * 0.19, 0, g, "y", 48);
      bx(W * 0.94, 0.003, W * 0.94, M.gunmetal, 0, H * 0.39, 0, g);
      const head = new THREE.Group();
      g.add(head);
      for (const sx of [-1, 1]) {
        cy(W * 0.2, W * 0.9, M.shell, sx * W * 0.24, H * 0.72, 0, head, "z", 32);
        bx(W * 0.4, H * 0.3, W * 0.9, M.shell, sx * W * 0.24, H * 0.55, 0, head);
      }
      parts.push({ obj: head, label: "Scanning head", desc: "" });
      parts.push({ obj: mark(0, H * 0.2, W / 2, g), label: "Base", desc: "" });
      return { group: g, parts, size: V3(W, H, LIDAR_SIZE.z) };
    },

    /* The fallback for the real CAD model (`REAL.pds`), built to the same
       104.8 x 80 x 35 mm — measured off the GLB itself, not estimated — and
       the same layout: two sensor windows across the
       top of the front, the engraved logo below them, the XT30 on the side.
       It only shows if the GLB fails to load. */
    pds() {
      const g = new THREE.Group(), parts: Part[] = [], W = PDS_SIZE.x, H = PDS_SIZE.y, D = PDS_SIZE.z;
      const body = roundBox(W, H, D, 0.004, M.shell);
      body.position.set(0, H / 2, 0);
      g.add(body);

      const heads: THREE_NS.Group[] = [];
      for (const sx of [-W * 0.235, W * 0.235]) {
        const hd = new THREE.Group();
        hd.position.set(sx, H * 0.76, D / 2 + 0.0014);
        g.add(hd);
        bx(W * 0.29, H * 0.33, 0.001, M.gloss, 0, 0, 0, hd);
        for (const lx of [-0.0065, 0.0065]) cy(0.0048, 0.0016, M.key, lx, 0, 0.0004, hd, "z", 28);
        heads.push(hd);
      }
      const logo = new THREE.MeshBasicMaterial({ map: PDS_LOGO, transparent: true, depthWrite: false });
      plane(W * 0.48, (W * 0.48) / LOGO_AR, logo, W * 0.03, H * 0.34, D / 2 + 0.0016, g);
      const xt = bx(0.006, 0.008, 0.016, M.yellow, W / 2 + 0.003, H * 0.2, 0, g);

      parts.push({ obj: heads[0], label: "TF-Luna LiDAR", desc: "" });
      parts.push({ obj: xt, label: "XT30 power in", desc: "" });
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

    /* A real board, at real scale: 100 × 64 mm, 1.6 mm FR4, matte green mask
       with the copper visible through it, tinned pads, white silkscreen. On it,
       the parts a battery-management board actually carries — a cell-
       balance header, an RC filter per cell, the analogue front end, the MCU
       and its crystal, four protection MOSFETs, a pair of current-sense
       shunts, the pack terminals and a status connector. Everything is placed
       from one table (`at`, below) that both the 3D parts and the printed
       board read, so pads, outlines and parts cannot drift apart. */
    bms() {
      const g = new THREE.Group(), parts: Part[] = [];
      const L = 0.1, WD = 0.064, T = 0.0016, Y = T;
      const CW = 2048, CH = Math.round((CW * WD) / L);
      const X = (x: number) => (x / L + 0.5) * CW, Z = (z: number) => (z / WD + 0.5) * CH, S = (m: number) => (m / L) * CW;

      /* ── placement ── */
      const at = {
        j1: V3(-0.0425, 0, 0), u1: V3(-0.002, 0, 0.013), u2: V3(-0.018, 0, -0.004),
        y1: V3(-0.0115, 0, 0.0215), d1: V3(-0.004, 0, 0.027), j2: V3(0.006, 0, 0.0275),
        can: V3(0.005, 0, -0.02), qz: [-0.021, -0.007, 0.007, 0.021], qx: 0.018,
        rs: [V3(0.029, 0, -0.006), V3(0.029, 0, 0.006)], bneg: V3(0.043, 0, -0.016), pneg: V3(0.043, 0, 0.016),
      };
      /** 0603 passives: [x, z, along-x?, resistor?] */
      const pass: [number, number, boolean, boolean][] = [];
      for (let i = 0; i < 9; i++) pass.push([-0.0335, -0.0104 + i * 0.0026, true, true]);
      for (let i = 0; i < 8; i++) pass.push([-0.0298, -0.0091 + i * 0.0026, true, false]);
      for (let i = 0; i < 5; i++) pass.push([-0.022 + i * 0.002, -0.0098, false, false]);
      for (let i = 0; i < 5; i++) pass.push([-0.022 + i * 0.002, 0.0017, false, true]);
      for (let i = 0; i < 4; i++) pass.push([-0.0085, 0.0102 + i * 0.002, true, false]);
      for (let i = 0; i < 4; i++) pass.push([0.0045, 0.0102 + i * 0.002, true, true]);
      for (const z of at.qz) pass.push([0.0105, z, true, true]);
      for (let i = 0; i < 6; i++) pass.push([-0.004 + i * 0.0022, -0.0125, false, i % 2 === 0]);
      pass.push([0.0005, 0.0222, true, false], [0.0005, 0.0245, true, false]);

      /* ── the printed board ── */
      const BOARD = brandTex(CW, CH, (x) => {
        x.fillStyle = "#0a3a22";
        x.fillRect(0, 0, CW, CH);
        for (let i = 0; i < 900; i++) {
          x.fillStyle = `rgba(255,255,255,${(Math.random() * 0.025).toFixed(3)})`;
          x.fillRect(Math.random() * CW, Math.random() * CH, 1 + Math.random() * 3, 1 + Math.random() * 3);
        }
        const copper = "#114f2e";
        // The power pour: MOSFETs, shunts and terminals sit on solid copper.
        x.fillStyle = copper;
        x.beginPath();
        x.roundRect(X(0.0125), Z(-0.0295), X(0.049) - X(0.0125), Z(0.0295) - Z(-0.0295), S(0.002));
        x.fill();
        x.fillStyle = "#0a3a22";
        x.fillRect(X(0.0125), Z(-0.0003), X(0.049) - X(0.0125), S(0.0006));
        // Tented vias through the pour, stitching it to the back layer.
        for (let vx = 0.014; vx < 0.049; vx += 0.0032) {
          for (let vz = -0.028; vz < 0.029; vz += 0.0032) {
            if (Math.abs(vz) < 0.001) continue;
            x.fillStyle = "#082e1b";
            x.beginPath();
            x.arc(X(vx), Z(vz), S(0.00042), 0, TAU);
            x.fill();
          }
        }
        const line = (pts: [number, number][], w: number) => {
          x.strokeStyle = copper;
          x.lineWidth = S(w);
          x.lineCap = "round";
          x.lineJoin = "round";
          x.beginPath();
          pts.forEach(([px, pz], i) => (i ? x.lineTo(X(px), Z(pz)) : x.moveTo(X(px), Z(pz))));
          x.stroke();
        };
        // Balance header → one RC filter per cell → the AFE's cell inputs.
        for (let i = 0; i < 9; i++) {
          const z = -0.0104 + i * 0.0026;
          line([[-0.0395, z], [-0.0335, z]], 0.0005);
          if (i < 8) {
            const zc = -0.0091 + i * 0.0026;
            const ex = -0.0228 + Math.min(i, 6) * 0.00065 * 2;
            line([[-0.0298, zc], [-0.0265, zc], [-0.0255 + i * 0.0003, -0.0082], [ex, -0.0082]], 0.00028);
          }
        }
        // AFE ↔ MCU bus, and the MCU out to the status connector and LED.
        for (let i = 0; i < 5; i++) {
          const xs = -0.0165 + i * 0.00065 * 2;
          line([[xs, -0.0005], [xs, 0.004 + i * 0.0006], [-0.0062, 0.0085 + i * 0.0009 - 0.0009], [-0.0055, 0.0105 + i * 0.0006]], 0.00022);
        }
        for (let i = 0; i < 4; i++) line([[0.0015, 0.0115 + i * 0.001], [0.0035 + i * 0.0012, 0.0165 + i * 0.0004], [0.0035 + i * 0.0012, 0.0255]], 0.00022);
        line([[-0.0045, 0.0165], [-0.004, 0.0262]], 0.00022);
        line([[-0.0065, 0.0215], [-0.0098, 0.0215]], 0.00022);
        // Gate drive: MCU/AFE → gate resistors → MOSFET gates.
        for (const z of at.qz) line([[-0.0131, -0.0032], [0.0065, z * 0.4], [0.0092, z], [0.0118, z], [0.0142, z - 0.0023]], 0.00025);

        const tin = "#cfd3d7";
        const pad = (px: number, pz: number, w: number, d: number, r = 0.0001) => {
          x.fillStyle = tin;
          x.beginPath();
          x.roundRect(X(px - w / 2), Z(pz - d / 2), S(w), (d / WD) * CH, S(r));
          x.fill();
        };
        for (const [px, pz, ax] of pass) {
          for (const s of [-1, 1]) {
            if (ax) pad(px + s * 0.00075, pz, 0.0007, 0.00095);
            else pad(px, pz + s * 0.00075, 0.00095, 0.0007);
          }
        }
        for (let i = 0; i < 12; i++) {
          const o = -0.00275 + i * 0.0005;
          pad(at.u1.x + o, at.u1.z - 0.0043, 0.00028, 0.0013);
          pad(at.u1.x + o, at.u1.z + 0.0043, 0.00028, 0.0013);
          pad(at.u1.x - 0.0043, at.u1.z + o, 0.0013, 0.00028);
          pad(at.u1.x + 0.0043, at.u1.z + o, 0.0013, 0.00028);
        }
        for (let i = 0; i < 14; i++) {
          const o = -0.004225 + i * 0.00065;
          pad(at.u2.x + o, at.u2.z - 0.0029, 0.00038, 0.0013);
          pad(at.u2.x + o, at.u2.z + 0.0029, 0.00038, 0.0013);
        }
        for (const z of at.qz) {
          pad(at.qx + 0.0022, z, 0.0068, 0.0064, 0.0003);
          pad(at.qx - 0.0048, z - 0.00229, 0.0018, 0.0011);
          pad(at.qx - 0.0048, z + 0.00229, 0.0018, 0.0011);
        }
        for (const r of at.rs) for (const s of [-1, 1]) pad(r.x, r.z + s * 0.0029, 0.0036, 0.0014);
        for (const p of [at.bneg, at.pneg]) pad(p.x, p.z, 0.0095, 0.0125, 0.0008);
        pad(at.can.x, at.can.z - 0.0026, 0.0016, 0.0022);
        pad(at.can.x, at.can.z + 0.0026, 0.0016, 0.0022);
        pad(at.y1.x - 0.0011, at.y1.z, 0.0012, 0.0021);
        pad(at.y1.x + 0.0011, at.y1.z, 0.0012, 0.0021);
        pad(at.j2.x - 0.0048, at.j2.z + 0.0005, 0.0012, 0.0026);
        pad(at.j2.x + 0.0048, at.j2.z + 0.0005, 0.0012, 0.0026);
        // Mounting holes: a tinned ring and the hole through the board.
        for (const sx of [-1, 1]) {
          for (const sz of [-1, 1]) {
            const hx = sx * (L / 2 - 0.0035), hz = sz * (WD / 2 - 0.0035);
            x.fillStyle = tin;
            x.beginPath();
            x.arc(X(hx), Z(hz), S(0.0029), 0, TAU);
            x.fill();
            x.fillStyle = "#0b0c0d";
            x.beginPath();
            x.arc(X(hx), Z(hz), S(0.0016), 0, TAU);
            x.fill();
          }
        }
        // Test points.
        for (const [tx, tz] of [[-0.012, -0.0265], [-0.006, -0.0265], [0.035, -0.0265], [0.035, 0.0265]]) {
          x.fillStyle = tin;
          x.beginPath();
          x.arc(X(tx), Z(tz), S(0.0007), 0, TAU);
          x.fill();
        }

        /* silkscreen */
        const silk = "#eeeee8";
        x.strokeStyle = silk;
        x.fillStyle = silk;
        x.lineWidth = S(0.00016);
        const box = (cx: number, cz: number, w: number, d: number) =>
          x.strokeRect(X(cx - w / 2), Z(cz - d / 2), S(w), (d / WD) * CH);
        const text = (t: string, tx: number, tz: number, size: number, align: CanvasTextAlign = "center") => {
          x.font = `600 ${S(size)}px Roboto, Arial, sans-serif`;
          x.textAlign = align;
          x.textBaseline = "middle";
          x.fillText(t, X(tx), Z(tz));
        };
        box(at.u1.x, at.u1.z, 0.0079, 0.0079);
        box(at.u2.x, at.u2.z, 0.0105, 0.0046);
        box(at.j1.x, at.j1.z, 0.0068, 0.0262);
        box(at.j2.x, at.j2.z, 0.0118, 0.0056);
        for (const z of at.qz) box(at.qx, z, 0.0122, 0.0072);
        x.beginPath();
        x.arc(X(at.u1.x - 0.0048), Z(at.u1.z - 0.0048), S(0.00035), 0, TAU);
        x.fill();
        x.beginPath();
        x.arc(X(at.u2.x - 0.0056), Z(at.u2.z + 0.0031), S(0.00035), 0, TAU);
        x.fill();
        text("U1", at.u1.x + 0.0058, at.u1.z - 0.0048, 0.0011, "left");
        text("U2", at.u2.x - 0.0062, at.u2.z - 0.0012, 0.0011, "right");
        text("J1", at.j1.x, at.j1.z - 0.0148, 0.0012);
        text("BAL", at.j1.x + 0.0052, at.j1.z + 0.0148, 0.001);
        for (let i = 0; i < 9; i++) text("B" + i, -0.0368, -0.0104 + i * 0.0026, 0.00072, "left");
        text("J2", at.j2.x, at.j2.z - 0.0038, 0.001);
        text("STATUS", at.j2.x + 0.0072, at.j2.z + 0.0004, 0.00085, "left");
        at.qz.forEach((z, i) => text("Q" + (i + 1), at.qx - 0.0078, z, 0.001, "right"));
        text("RS1", at.rs[0].x + 0.0031, at.rs[0].z, 0.00085, "left");
        text("RS2", at.rs[1].x + 0.0031, at.rs[1].z, 0.00085, "left");
        text("R001", at.rs[0].x + 0.0031, 0, 0.00075, "left");
        text("Y1", at.y1.x, at.y1.z + 0.0024, 0.0009);
        text("D1", at.d1.x, at.d1.z + 0.0017, 0.0009);
        text("RUN", at.d1.x - 0.0014, at.d1.z, 0.0008, "right");
        text("C1", at.can.x + 0.0046, at.can.z, 0.001, "left");
        text("+", at.can.x - 0.0042, at.can.z - 0.0026, 0.0014);
        text("B−", at.bneg.x, at.bneg.z - 0.0086, 0.0024);
        text("P−", at.pneg.x, at.pneg.z + 0.0086, 0.0024);
        drawLogo(x, X(-0.0375), Z(0.0172), S(0.0165), silk);
        text("BATTERY MANAGEMENT  REV A", -0.0375, 0.0262, 0.00105, "left");
        text("LOT 2631", -0.0375, 0.0288, 0.00085, "left");
        // A datamatrix-style serial code.
        for (let i = 0; i < 12; i++) {
          for (let k = 0; k < 12; k++) {
            if (i === 0 || k === 11 || (i === 11 && k % 2 === 0) || (k === 0 && i % 2 === 1) || Math.random() < 0.45)
              x.fillRect(X(0.0265 + i * 0.00036), Z(0.0262 + k * 0.00036), S(0.00036) + 0.5, S(0.00036) + 0.5);
          }
        }
      });

      /* ── the board itself ── */
      const top = new THREE.MeshStandardMaterial({ map: BOARD, roughness: 0.5, envMapIntensity: 0.6 });
      bx(L, T, WD, [M.fr4, M.fr4, top, M.mask, M.fr4, M.fr4], 0, T / 2, 0, g);

      /* ── passives, instanced: one draw call per material, not 120 meshes ── */
      const dummy = new THREE.Object3D();
      const inst = (geo: THREE_NS.BufferGeometry, m: THREE_NS.Material, place: (i: number) => boolean, n: number) => {
        const im = new THREE.InstancedMesh(geo, m, n);
        let c = 0;
        for (let i = 0; i < n; i++) {
          if (!place(i)) continue;
          dummy.updateMatrix();
          im.setMatrixAt(c++, dummy.matrix);
        }
        im.count = c;
        g.add(im);
        return im;
      };
      const body0603 = new THREE.BoxGeometry(0.001, 0.00045, 0.00078);
      const end0603 = new THREE.BoxGeometry(0.0003, 0.00047, 0.0008);
      const placeBody = (res: boolean) => (i: number) => {
        const [px, pz, ax, r] = pass[i];
        if (r !== res) return false;
        dummy.position.set(px, Y + 0.000225, pz);
        dummy.rotation.set(0, ax ? 0 : Math.PI / 2, 0);
        return true;
      };
      inst(body0603, M.epoxy, placeBody(true), pass.length);
      inst(body0603, M.ceramic, placeBody(false), pass.length);
      inst(end0603, M.tin, (i) => {
        const [px, pz, ax] = pass[i >> 1];
        const s = i & 1 ? 1 : -1;
        dummy.position.set(px + (ax ? s * 0.00065 : 0), Y + 0.000235, pz + (ax ? 0 : s * 0.00065));
        dummy.rotation.set(0, ax ? 0 : Math.PI / 2, 0);
        return true;
      }, pass.length * 2);

      /* ── ICs: moulded bodies, etched tops, gull-wing leads ── */
      const leads = (grp: THREE_NS.Group, bodyX: number, bodyZ: number, n: number, pitch: number, w: number, reach: number, sides: ("x" | "z")[]) => {
        const foot = new THREE.BoxGeometry(w, 0.00012, reach);
        const count = n * sides.length * 2;
        const im = new THREE.InstancedMesh(foot, M.tin, count);
        let c = 0;
        for (const side of sides) {
          for (const s of [-1, 1]) {
            for (let i = 0; i < n; i++) {
              const o = (i - (n - 1) / 2) * pitch;
              if (side === "z") {
                dummy.position.set(o, 0.00006, s * (bodyZ / 2 + reach / 2 - 0.0002));
                dummy.rotation.set(0, 0, 0);
              } else {
                dummy.position.set(s * (bodyX / 2 + reach / 2 - 0.0002), 0.00006, o);
                dummy.rotation.set(0, Math.PI / 2, 0);
              }
              dummy.updateMatrix();
              im.setMatrixAt(c++, dummy.matrix);
            }
          }
        }
        grp.add(im);
      };
      const ic = (pos: THREE_NS.Vector3, bw: number, bd: number, bh: number, topTex: THREE_NS.Texture) => {
        const grp = new THREE.Group();
        grp.position.set(pos.x, Y, pos.z);
        g.add(grp);
        const b = bx(bw, bh, bd, M.epoxy, 0, bh / 2 + 0.0001, 0, grp);
        b.material = [M.epoxy, M.epoxy, new THREE.MeshStandardMaterial({ map: topTex, roughness: 0.62 }), M.epoxy, M.epoxy, M.epoxy];
        return grp;
      };
      const u1 = ic(at.u1, 0.007, 0.007, 0.0014, CHIPTOP);
      leads(u1, 0.007, 0.007, 12, 0.0005, 0.00022, 0.0011, ["x", "z"]);
      const u2 = ic(at.u2, 0.0097, 0.0044, 0.0011, AFETOP);
      leads(u2, 0.0097, 0.0044, 14, 0.00065, 0.0003, 0.0011, ["z"]);

      /* crystal and status LED */
      bx(0.0032, 0.0008, 0.0025, M.alu, at.y1.x, Y + 0.0004, at.y1.z, g);
      bx(0.0016, 0.00055, 0.0008, M.ledOn, at.d1.x, Y + 0.000275, at.d1.z, g);

      /* electrolytic: black base, aluminium can, the dark polarity band */
      bx(0.0066, 0.0007, 0.0066, M.epoxy, at.can.x, Y + 0.00035, at.can.z, g);
      cy(0.00315, 0.0054, M.alu, at.can.x, Y + 0.0007 + 0.0027, at.can.z, g, "y", 40);
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.00316, 0.00316, 0.0054, 40, 1, true, -0.5, 1.0), M.epoxy);
      band.position.set(at.can.x, Y + 0.0007 + 0.0027, at.can.z);
      band.rotation.y = Math.PI;
      g.add(band);
      for (let i = 0; i < 3; i++) {
        const v = bx(0.0045, 0.00005, 0.00022, M.epoxy, at.can.x, Y + 0.0061 + 0.00003, at.can.z, g);
        v.rotation.y = (i * Math.PI) / 3;
      }

      /* protection MOSFETs, DPAK: body, the tab soldered down behind, two legs */
      const qs = new THREE.Group();
      g.add(qs);
      for (const z of at.qz) {
        bx(0.0065, 0.0023, 0.0061, M.epoxy, at.qx, Y + 0.00115, z, qs);
        bx(0.0016, 0.0005, 0.0054, M.tin, at.qx + 0.0036, Y + 0.00025, z, qs);
        for (const s of [-1, 1]) {
          bx(0.0018, 0.0003, 0.00075, M.tin, at.qx - 0.0045, Y + 0.00015, z + s * 0.00229, qs);
          bx(0.0006, 0.0009, 0.00075, M.tin, at.qx - 0.0035, Y + 0.00045, z + s * 0.00229, qs);
        }
      }

      /* current-sense shunts, 2512 */
      const rs = new THREE.Group();
      g.add(rs);
      for (const r of at.rs) {
        bx(0.0032, 0.0008, 0.0052, M.epoxy, r.x, Y + 0.0004, r.z, rs);
        for (const s of [-1, 1]) bx(0.0032, 0.00082, 0.0007, M.tin, r.x, Y + 0.00041, r.z + s * 0.0029, rs);
      }

      /* pack terminals: tinned pads with a solder dome where the cable lands */
      for (const p of [at.bneg, at.pneg]) {
        const dome = new THREE.Mesh(new THREE.SphereGeometry(0.004, 28, 14, 0, TAU, 0, Math.PI / 2), M.tin);
        dome.scale.set(1, 0.28, 1.25);
        dome.position.set(p.x, Y, p.z);
        g.add(dome);
      }

      /* cell-balance header, JST-XH 9-way: housing, open cavity, pins */
      const j1 = new THREE.Group();
      j1.position.set(at.j1.x, Y, at.j1.z);
      g.add(j1);
      bx(0.0058, 0.007, 0.0248, M.header, 0, 0.0035, 0, j1);
      bx(0.0036, 0.0002, 0.0228, M.key, 0.0004, 0.0070, 0, j1);
      bx(0.0012, 0.0016, 0.0248, M.header, -0.0023, 0.0078, 0, j1);
      for (let i = 0; i < 9; i++) bx(0.00064, 0.0056, 0.00064, M.tin, 0.0004, 0.0042, -0.01 + i * 0.0025, j1);

      /* status connector, JST-GH 4-way */
      const j2 = new THREE.Group();
      j2.position.set(at.j2.x, Y, at.j2.z);
      g.add(j2);
      bx(0.0078, 0.0042, 0.0045, M.header, 0, 0.0021, 0, j2);
      bx(0.0062, 0.0002, 0.0026, M.key, 0, 0.0042, 0.0004, j2);
      for (const s of [-1, 1]) bx(0.001, 0.0022, 0.0022, M.tin, s * 0.0048, 0.0011, 0.0005, j2);

      parts.push({ obj: u1, label: "Battery management chip", desc: "" });
      parts.push({ obj: j1, label: "Cell connections", desc: "" });
      parts.push({ obj: qs, label: "Protection MOSFETs", desc: "" });
      parts.push({ obj: rs, label: "Current sense", desc: "" });
      parts.push({ obj: j2, label: "Status out", desc: "" });
      return { group: g, parts, size: V3(L, T + 0.0086, WD) };
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

  /* ── the real Pallet Detection Sensor ─────────────────────────────
     Converted from the supplied 3MF: its CAD sub-assemblies became glTF nodes,
     so the viewer's callout chips hang off real parts — the Pico, the TF-Luna,
     the lid, the magnet — instead of shapes named by hand.

     It is the PDS everywhere on the page: the viewer, the film's lineup and
     the unit on the truck's carriage all load it (one fetch, shared — see
     `loadGlb`). `DEV.pds()` is built to the same size and only shows if the
     file fails. */
  /* The CAD ships without normals, so GLTFLoader would flat-shade it; the
     replacements keep that. Black housing, dark metal hardware, the XT30 in
     its real yellow, and the engraved logo in the brand's white and orange. */
  const flat = (color: number, o: THREE_NS.MeshStandardMaterialParameters = {}) =>
    std(color, Object.assign({ flatShading: true }, o));
  const PDS_MAT = {
    shell: flat(0x111214, { roughness: 0.55, envMapIntensity: 0.5 }),
    metal: flat(0x44474d, { roughness: 0.35, metalness: 0.8 }),
    steel: flat(0x9a9ea6, { roughness: 0.3, metalness: 0.9 }),
    pcb: flat(0x145a33, { roughness: 0.6 }),
    xt30: flat(0xf2b200, { roughness: 0.45 }),
    logo: flat(0xf3f1ec, { roughness: 0.5 }),
    // Unlit and outside tone mapping: lit, the key light washed #FF6A00 out to
    // a pale apricot. The tick is the brand colour, exactly, from every angle.
    tick: new THREE.MeshBasicMaterial({ color: 0xff6a00, toneMapped: false }),
  };
  const pdsMatFor = (name: string): THREE_NS.Material | THREE_NS.Material[] =>
    name === "Enclosure" ? [PDS_MAT.shell, PDS_MAT.logo, PDS_MAT.tick]
    : name === "Lock" || name === "Magnet" ? PDS_MAT.metal
    : name === "Fasteners" ? PDS_MAT.steel
    : name === "Raspberry_Pi_Pico_W" ? PDS_MAT.pcb
    : name === "XT30_power_in" ? PDS_MAT.xt30
    : PDS_MAT.shell;

  /**
   * The logo is geometry, not print: "RAMS DIGITAL" and the corner tick are
   * engraved 0.005 units into the front face (z 0.158 → 0.153, file units).
   * This sorts the enclosure's triangles into three index ranges — housing,
   * wordmark, tick — so each can take its own material. A triangle is logo if
   * it lies in the engraving's depth band inside the logo's box on the face;
   * the tick is the part of that right of the S. Runs once per geometry.
   */
  const splitLogo = (geo: THREE_NS.BufferGeometry) => {
    if (geo.userData.logoSplit || !geo.index) return;
    const pos = geo.attributes.position, idx = geo.index;
    const body: number[] = [], word: number[] = [], tick: number[] = [];
    for (let t = 0; t < idx.count; t += 3) {
      const v = [idx.getX(t), idx.getX(t + 1), idx.getX(t + 2)];
      let zMin = 9, zMax = -9, xMin = 9, xMax = -9, yMin = 9, yMax = -9;
      for (const i of v) {
        const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
        zMin = Math.min(zMin, z); zMax = Math.max(zMax, z);
        xMin = Math.min(xMin, x); xMax = Math.max(xMax, x);
        yMin = Math.min(yMin, y); yMax = Math.max(yMax, y);
      }
      const inLogo = zMin > 0.15 && zMin < 0.157 && zMax < 0.1585 && xMin > -0.22 && xMax < 0.28 && yMin > -0.24 && yMax < 0;
      (inLogo ? (xMin > 0.216 ? tick : word) : body).push(...v);
    }
    geo.setIndex([...body, ...word, ...tick]);
    geo.clearGroups();
    geo.addGroup(0, body.length, 0);
    geo.addGroup(body.length, word.length, 1);
    geo.addGroup(body.length + word.length, tick.length, 2);
    geo.userData.logoSplit = true;
  };

  /* ── the real LiDAR ─────────────────────────────────────────────────
     Converted from the supplied STEP (`L2 3D Model - no text.STEP`, 74.9 ×
     63.6 × 75 mm) with OpenCascade: one glTF node per part group, with real
     normals, so it shades smooth where the PDS — which came without them —
     stays faceted. */
  const LIDAR_MAT = {
    head: std(0x121315, { roughness: 0.42, envMapIntensity: 0.7 }),
    flange: std(0x3b3d42, { roughness: 0.35, metalness: 0.8 }),
    base: std(0x18191c, { roughness: 0.6, envMapIntensity: 0.5 }),
    plate: std(0x0e0f11, { roughness: 0.7 }),
    steel: std(0x9a9ea6, { roughness: 0.3, metalness: 0.9 }),
    led: new THREE.MeshBasicMaterial({ color: 0x30d158, toneMapped: false }),
  };
  const lidarMatFor = (name: string): THREE_NS.Material =>
    name === "LiDAR_head" ? LIDAR_MAT.head
    : name === "Flange" ? LIDAR_MAT.flange
    : name === "Base_housing" ? LIDAR_MAT.base
    : name === "Base_plate" ? LIDAR_MAT.plate
    : name === "Status_LED" ? LIDAR_MAT.led
    : LIDAR_MAT.steel;

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  type Anchor = [label: string, node: string, pick: (b: THREE_NS.Box3) => THREE_NS.Vector3];
  /**
   * Every device that has a real CAD file: where it is, the real-world size it
   * is scaled to (the files' own units are arbitrary), how its parts are
   * dressed, and where its labels go.
   *
   * Labels go on what you can see from outside. Pinning one to each CAD node
   * put the PDS's Pico, magnet and fasteners — all inside the box — on its
   * centre, and stacked every chip across the logo. So each label names a
   * node and picks a point on the face of it that shows.
   */
  const REAL: Partial<Record<DevKey, {
    url: string; size: THREE_NS.Vector3;
    dress: (m: THREE_NS.Mesh) => void; labels: Anchor[];
  }>> = {
    pds: {
      url: "/sensor-stack/pallet-detection.glb",
      size: PDS_SIZE,
      dress: (m) => {
        if (m.name === "Enclosure") splitLogo(m.geometry);
        m.material = pdsMatFor(m.name);
      },
      labels: [
        ["TF-Luna LiDAR", "TF-Luna_LiDAR", (b) => V3(lerp(b.min.x, b.max.x, 0.2), lerp(b.min.y, b.max.y, 0.7), b.max.z)],
        ["RAMS Digital housing", "Enclosure", (b) => V3(lerp(b.min.x, b.max.x, 0.52), lerp(b.min.y, b.max.y, 0.3), b.max.z)],
        ["Service lid", "Lid", (b) => V3(lerp(b.min.x, b.max.x, 0.75), lerp(b.min.y, b.max.y, 0.6), b.min.z)],
        ["XT30 power in", "XT30_power_in", (b) => b.getCenter(V3())],
      ],
    },
    lidar: {
      url: "/sensor-stack/lidar-l2.glb",
      size: LIDAR_SIZE,
      dress: (m) => {
        m.material = lidarMatFor(m.name);
      },
      labels: [
        ["Scanning head", "LiDAR_head", (b) => V3(b.max.x, lerp(b.min.y, b.max.y, 0.6), lerp(b.min.z, b.max.z, 0.5))],
        ["Base", "Base_housing", (b) => V3(lerp(b.min.x, b.max.x, 0.5), lerp(b.min.y, b.max.y, 0.4), b.max.z)],
        ["Status LED", "Status_LED", (b) => b.getCenter(V3())],
      ],
    },
  };

  /** The real device, scaled to its real size and standing on y = 0 like every `DEV` build — or null. */
  const loadReal = async (key: DevKey): Promise<Device | null> => {
    const cfg = REAL[key];
    if (!cfg) return null;
    const real = cfg.size;
    try {
      const src = (await loadGlb(cfg.url)).clone(true);
      src.traverse((o) => {
        const mesh = o as THREE_NS.Mesh;
        if (mesh.isMesh) cfg.dress(mesh);
      });
      const sz = new THREE.Box3().setFromObject(src).getSize(V3());
      src.scale.setScalar(real.x / Math.max(sz.x, 1e-6));
      src.updateMatrixWorld(true);
      const bb = new THREE.Box3().setFromObject(src);
      const c = bb.getCenter(V3());
      src.position.set(-c.x, -bb.min.y, -c.z);

      const group = new THREE.Group();
      group.add(src);
      group.updateMatrixWorld(true);

      const parts: Part[] = [];
      for (const [label, n, pick] of cfg.labels) {
        const o = src.getObjectByName(n);
        if (!o) continue;
        const p = pick(new THREE.Box3().setFromObject(o));
        parts.push({ obj: mark(p.x, p.y, p.z, group, 0.002), label, desc: "" });
      }
      return { group, parts, size: bb.getSize(V3()) };
    } catch (err) {
      console.warn("Sensor Stack: falling back to the procedural " + key + " —", err);
      return null;
    }
  };

  /** The real device where one exists, else the procedural build. */
  const loadDevice = async (key: DevKey): Promise<Device> => (await loadReal(key)) ?? DEV[key]();

  /**
   * Swaps a procedural build already in a scene for the real one, in place:
   * same group, so its position, rotation and scale on the truck or in the
   * lineup are kept. `each` sees every new mesh (the film clones materials so
   * its fades don't leak). Resolves false if there is no real model.
   */
  const upgradeInPlace = async (d: Device, key: DevKey, each?: (m: THREE_NS.Mesh) => void) => {
    const real = await loadReal(key);
    if (!real) return false;
    d.group.clear();
    for (const c of [...real.group.children]) d.group.add(c);
    d.parts = real.parts;
    d.size.copy(real.size);
    if (each) {
      d.group.traverse((o) => {
        if ((o as THREE_NS.Mesh).isMesh) each(o as THREE_NS.Mesh);
      });
    }
    return true;
  };

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
      // On the carriage face, looking forward down the forks.
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

  return { M, DEV, loadDevice, upgradeInPlace, hasDevGlb: (k: DevKey) => !!REAL[k], setupRenderer, makeScene, fitFork, mountsOf, buildCloud, cloudMaterial };
}

export type SstKit = ReturnType<typeof createSstKit>;
