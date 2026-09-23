import type * as THREE_NS from "three";
import { createSstKit, type DevKey } from "../sst/sst-3d";

/**
 * The OmniBox 3D kit — materials, the four procedural boxes, and the
 * connections rig, shared by the hero film and the Inside viewer.
 *
 * ── Why this is a factory, not a module with imports ────────────────
 * `three` is loaded dynamically inside each component's effect, so it never
 * lands in the bundle for the other 40 routes. That means this file cannot
 * `import * as THREE` at the top; it takes the namespace as an argument and
 * returns everything built against it. Both renderers call it once.
 *
 * ── The boxes are stand-ins, and that is the design ─────────────────
 * The reference ships no GLBs — `models/` holds only a README. Each OmniBox is
 * built here out of boxes and cylinders, proportioned from the drawings where
 * they exist (Motion is 240 × 240 × 101 mm, and 1 unit = 100 mm) and from the
 * product photograph otherwise. Every part carries a plain-language label and
 * an explode offset, because the point of the viewer is to say *what is in
 * there*, not to be a CAD model.
 */

export type Part = {
  obj: THREE_NS.Group;
  offset: THREE_NS.Vector3;
  label: string;
  desc: string;
  base?: THREE_NS.Vector3;
};
export type BoxModel = { group: THREE_NS.Group; parts: Part[]; size: THREE_NS.Vector3 };
export type Holder = { key: string; g: THREE_NS.Group; model: BoxModel };

export function createOmniKit(THREE: typeof THREE_NS, isMobile: boolean) {
  const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);

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

  /* The diagonal rib pattern on every lid — one texture, repeated per box. */
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
  /* The lid logo is the real brand mark — `public/RAMS_Logo_White.svg`, white
     RAMS and DIGITAL with the orange tick — not a typed approximation of it.
     The first version set "RAMS" in Plex Sans and drew a tick from two
     rectangles, which neither matched the letterforms in the header nor
     carried DIGITAL. The SVG draws into the canvas when it loads; until then
     the decal is simply transparent. Every lid places it with `topLogo`. */
  const LOGO_ASPECT = 626.25 / 247.58;
  const LOGO = tex(1024, Math.round(1024 / LOGO_ASPECT), (x, w, h) => x.clearRect(0, 0, w, h));
  /* The file has a viewBox but no width/height, and a sizeless SVG rasterises
     at the 300 × 150 default — blurry and letterboxed. So it is fetched and
     given the canvas's own size before it is drawn. */
  void (async () => {
    try {
      const c = LOGO.image as HTMLCanvasElement;
      const svg = (await (await fetch("/RAMS_Logo_White.svg")).text())
        .replace("<svg ", `<svg width="${c.width}" height="${c.height}" `);
      const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
      const img = new Image();
      img.src = url;
      await img.decode();
      const x = c.getContext("2d")!;
      x.clearRect(0, 0, c.width, c.height);
      x.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      LOGO.needsUpdate = true;
    } catch {
      /* A missing logo leaves a clean lid, never a broken one. */
    }
  })();
  const WORD = tex(512, 96, (x, w, h) => {
    x.clearRect(0, 0, w, h);
    x.fillStyle = "#9A9CA3";
    x.font = '700 64px "IBM Plex Sans", Arial, sans-serif';
    x.fillText("OMNIBOX", 16, 70);
  });

  const M = {
    shell: new THREE.MeshStandardMaterial({ color: 0x1d1e22, roughness: 0.5, metalness: 0.35 }),
    inner: new THREE.MeshStandardMaterial({ color: 0x2a2c31, roughness: 0.8, metalness: 0.1 }),
    pcb: new THREE.MeshStandardMaterial({ color: 0x125238, roughness: 0.7 }),
    pcbBlue: new THREE.MeshStandardMaterial({ color: 0x1f4f8f, roughness: 0.7 }),
    chip: new THREE.MeshStandardMaterial({ color: 0x101114, roughness: 0.4, metalness: 0.4 }),
    metal: new THREE.MeshStandardMaterial({ color: 0xbfc2c8, roughness: 0.3, metalness: 0.9 }),
    alu: new THREE.MeshStandardMaterial({ color: 0x9ea2a9, roughness: 0.35, metalness: 0.8 }),
    orange: new THREE.MeshStandardMaterial({ color: 0xff6a00, roughness: 0.5, emissive: 0xff6a00, emissiveIntensity: 0.25 }),
    relay: new THREE.MeshStandardMaterial({ color: 0x2d6cc0, roughness: 0.45 }),
    term: new THREE.MeshStandardMaterial({ color: 0xe2e2e6, roughness: 0.6 }),
    termG: new THREE.MeshStandardMaterial({ color: 0x3a8f5c, roughness: 0.6 }),
    grey: new THREE.MeshStandardMaterial({ color: 0x6e7178, roughness: 0.5, metalness: 0.3 }),
    batt: new THREE.MeshStandardMaterial({ color: 0x2c3e66, roughness: 0.55 }),
    yellow: new THREE.MeshStandardMaterial({ color: 0xffc107, roughness: 0.55 }),
    glass: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15, metalness: 0, transparent: true, opacity: 0.16, depthWrite: false }),
    // Outside tone mapping, so the white and #FF6A00 land exactly as the SVG has them.
    logo: new THREE.MeshBasicMaterial({ map: LOGO, transparent: true, depthWrite: false, toneMapped: false }),
    word: new THREE.MeshBasicMaterial({ map: WORD, transparent: true, depthWrite: false }),
  };

  /* Core is procedural, so it does not inherit the palette the CAD models are
     given — this is that palette, by hand: the same dielectric matte black as
     `GLB_MAT.shell` (#111214, reflections halved), gunmetal for fasteners and
     connector bodies, a near-black for recesses so a pocket reads as depth
     rather than as a flat patch, and rubber for the seal. Tonal rather than one
     flat black, because a single value renders as a silhouette with no form. */
  const CORE = {
    shell: new THREE.MeshStandardMaterial({ color: 0x111214, roughness: 0.55, metalness: 0, envMapIntensity: 0.5 }),
    rib: new THREE.MeshStandardMaterial({ color: 0x131416, roughness: 0.48, metalness: 0, envMapIntensity: 0.55 }),
    recess: new THREE.MeshStandardMaterial({ color: 0x08090a, roughness: 0.75, metalness: 0, envMapIntensity: 0.35 }),
    panel: new THREE.MeshStandardMaterial({ color: 0x16171a, roughness: 0.62, metalness: 0.05, envMapIntensity: 0.5 }),
    plate: new THREE.MeshStandardMaterial({ color: 0x1c1d20, roughness: 0.38, metalness: 0.35, envMapIntensity: 0.6 }),
    board: new THREE.MeshStandardMaterial({ color: 0x1b1c1f, roughness: 0.65, metalness: 0.1 }),
    metal: new THREE.MeshStandardMaterial({ color: 0x2e3034, roughness: 0.4, metalness: 0.62 }),
    hardware: new THREE.MeshStandardMaterial({ color: 0x3b3d42, roughness: 0.32, metalness: 0.85 }),
    rubber: new THREE.MeshStandardMaterial({ color: 0x0a0a0b, roughness: 0.9, metalness: 0, envMapIntensity: 0.3 }),
    mark: new THREE.MeshStandardMaterial({ color: 0x4a4d52, roughness: 0.6, metalness: 0.2 }),
    led: new THREE.MeshBasicMaterial({ color: 0xff6a00, toneMapped: false }),
    ledG: new THREE.MeshBasicMaterial({ color: 0x30d158, toneMapped: false }),
  };

  const MX = {
    white: new THREE.MeshStandardMaterial({ color: 0xf0f0f2, roughness: 0.45, metalness: 0.05 }),
    screen: new THREE.MeshStandardMaterial({ color: 0x0b1320, roughness: 0.25, emissive: 0x1b3a5c, emissiveIntensity: 0.55 }),
    red: new THREE.MeshStandardMaterial({ color: 0xff3b30, roughness: 0.4, emissive: 0xff3b30, emissiveIntensity: 0.5 }),
    amber: new THREE.MeshStandardMaterial({ color: 0xffb000, roughness: 0.4, emissive: 0xffb000, emissiveIntensity: 0.35 }),
    green: new THREE.MeshStandardMaterial({ color: 0x34c759, roughness: 0.4, emissive: 0x34c759, emissiveIntensity: 0.35 }),
    cable: new THREE.MeshStandardMaterial({ color: 0x3a3c42, roughness: 0.55, metalness: 0.2 }),
  };

  /* ── primitives ───────────────────────────────────────── */
  const bx = (w: number, h: number, d: number, m: THREE_NS.Material, x: number, y: number, z: number, p: THREE_NS.Object3D) => {
    const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    o.position.set(x, y, z);
    p.add(o);
    return o;
  };
  const cy = (r: number, h: number, m: THREE_NS.Material, x: number, y: number, z: number, p: THREE_NS.Object3D, axis: "x" | "y" | "z" = "y", s = 28) => {
    const o = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, s), m);
    o.position.set(x, y, z);
    if (axis === "x") o.rotation.z = Math.PI / 2;
    if (axis === "z") o.rotation.x = Math.PI / 2;
    p.add(o);
    return o;
  };
  const decal = (mat: THREE_NS.Material, w: number, h: number, x: number, y: number, z: number, p: THREE_NS.Object3D, face: "top" | "front" = "top") => {
    const o = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    o.position.set(x, y, z);
    if (face === "top") o.rotation.x = -Math.PI / 2;
    p.add(o);
    return o;
  };
  /** The brand mark on a lid's top face, in its front-right corner. One rule
   *  for every box — same margin in from both edges, the mark's own aspect —
   *  so the four read as one family in the lineup instead of each carrying its
   *  logo somewhere different (Core's used to sit front-left). `W` and `D` are
   *  the surface it sits on, `y` just above it. */
  const topLogo = (W: number, D: number, y: number, p: THREE_NS.Object3D, w = 0.5, margin = 0.12) =>
    decal(M.logo, w, w / LOGO_ASPECT, W / 2 - margin - w / 2, y, D / 2 - margin - w / LOGO_ASPECT / 2, p);
  /** An open-topped box: floor plus four walls, so the insides are visible. */
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
  const part = (g: THREE_NS.Group, parts: Part[], label: string, desc: string, offset: THREE_NS.Vector3, build: (o: THREE_NS.Group) => void) => {
    const o = new THREE.Group();
    g.add(o);
    build(o);
    parts.push({ obj: o, offset, label, desc });
    return o;
  };

  /* ── the four boxes ───────────────────────────────────── */
  const PROC: Record<string, () => BoxModel> = {
    edge() {
      const g = new THREE.Group(), parts: Part[] = [], W = 1.6, H = 0.42, D = 1.2;
      part(g, parts, "Housing", "Compact enough to sit inside the cell.", V3(0, 0, 0), (o) => {
        tray(W, H - 0.05, D, 0.04, M.shell, o);
        bx(0.16, 0.05, 0.012, M.chip, -0.25, 0.2, D / 2 + 0.006, o);
        bx(0.03, 0.12, 0.012, M.orange, 0.62, 0.17, D / 2 + 0.006, o);
        cy(0.075, 0.12, M.metal, W / 2 + 0.06, 0.2, 0.32, o, "x");
        cy(0.055, 0.13, M.chip, W / 2 + 0.07, 0.2, 0.32, o, "x");
      });
      part(g, parts, "Ribbed lid", "Shaped to carry heat away from the electronics.", V3(0, 1.25, 0), (o) => {
        o.position.y = H - 0.05;
        bx(W, 0.05, D, ribMat(3, 2.3), 0, 0.025, 0, o);
        topLogo(W, D, 0.052, o);
      });
      part(g, parts, "The brain", "Raspberry Pi 5. Checks every detection against your zones.", V3(-0.1, 0.72, 0), (o) => {
        o.position.set(-0.28, 0.07, 0);
        bx(0.85, 0.03, 0.56, M.pcb, 0, 0, 0, o);
        bx(0.2, 0.035, 0.2, M.metal, -0.08, 0.035, 0.02, o);
        bx(0.48, 0.05, 0.06, M.chip, -0.05, 0.04, -0.22, o);
        bx(0.16, 0.11, 0.13, M.metal, 0.33, 0.07, 0.16, o);
        bx(0.16, 0.11, 0.13, M.metal, 0.33, 0.07, -0.02, o);
      });
      part(g, parts, "Two outputs", "Stop a robot, hold a door, sound an alarm.", V3(0.25, 0.98, 0), (o) => {
        o.position.set(0.47, 0.07, -0.02);
        bx(0.42, 0.03, 0.5, M.pcbBlue, 0, 0, 0, o);
        bx(0.14, 0.12, 0.18, M.relay, -0.1, 0.075, -0.05, o);
        bx(0.14, 0.12, 0.18, M.relay, 0.1, 0.075, -0.05, o);
        bx(0.38, 0.08, 0.08, M.termG, 0, 0.055, 0.19, o);
      });
      return { group: g, parts, size: V3(W, H, D) };
    },
    ai() {
      const g = new THREE.Group(), parts: Part[] = [], W = 1.5, H = 0.75, D = 1.5;
      part(g, parts, "Housing", "Vented sides, all connections on the outside.", V3(0, 0, 0), (o) => {
        tray(W, H - 0.06, D, 0.045, M.shell, o);
        for (let i = 0; i < 6; i++) bx(0.012, 0.28, 0.06, M.chip, W / 2 + 0.004, 0.34, -0.4 + i * 0.16, o);
        bx(0.16, 0.05, 0.012, M.chip, -0.35, 0.3, D / 2 + 0.006, o);
        bx(0.16, 0.05, 0.012, M.chip, -0.1, 0.3, D / 2 + 0.006, o);
        bx(0.03, 0.12, 0.012, M.orange, 0.55, 0.3, D / 2 + 0.006, o);
      });
      part(g, parts, "Ribbed lid", "Bolted down, shaped to shed heat.", V3(0, 1.75, 0), (o) => {
        o.position.y = H - 0.06;
        bx(W, 0.06, D, ribMat(3, 3), 0, 0.03, 0, o);
        topLogo(W, D, 0.062, o);
      });
      part(g, parts, "The AI brain", "NVIDIA Jetson Orin Nano Super. 67 TOPS for your own models.", V3(0, 0.95, -0.05), (o) => {
        o.position.set(0, 0.08, -0.12);
        bx(1.0, 0.04, 0.8, M.pcb, 0, 0, 0, o);
        bx(0.7, 0.03, 0.46, M.chip, 0, 0.035, -0.05, o);
        for (let i = 0; i < 9; i++) bx(0.012, 0.14, 0.4, M.alu, -0.26 + i * 0.065, 0.12, -0.05, o);
      });
      part(g, parts, "Active cooling", "A fan that keeps it fast through a full shift.", V3(0, 1.4, -0.05), (o) => {
        o.position.set(0, 0.3, -0.17);
        cy(0.17, 0.05, M.chip, 0, 0, 0, o);
        cy(0.06, 0.055, M.grey, 0, 0, 0, o);
      });
      part(g, parts, "Storage", "Holds your custom AI models.", V3(-0.25, 0.55, 0.35), (o) => {
        o.position.set(-0.35, 0.08, 0.5);
        bx(0.42, 0.03, 0.18, M.chip, 0, 0, 0, o);
        bx(0.36, 0.012, 0.12, M.alu, 0, 0.02, 0, o);
      });
      part(g, parts, "Connections", "Cameras in. Signals out to machines and alarms.", V3(0.3, 0.55, 0.35), (o) => {
        o.position.set(0.3, 0.08, 0.52);
        bx(0.55, 0.03, 0.24, M.pcb, 0, 0, 0, o);
        for (let i = 0; i < 3; i++) bx(0.12, 0.1, 0.12, M.metal, -0.18 + i * 0.18, 0.065, 0.04, o);
      });
      return { group: g, parts, size: V3(W, H, D) };
    },
    motion() {
      const g = new THREE.Group(), parts: Part[] = [], W = 2.4, H = 1.01, D = 2.4;
      part(g, parts, "Housing", "Sized for a forklift, with every port on the outside.", V3(0, 0, 0), (o) => {
        tray(W, H - 0.07, D, 0.06, M.shell, o);
        decal(M.word, 1.0, 0.19, 0.2, 0.45, D / 2 + 0.001, o, "front");
      });
      part(g, parts, "Ribbed lid", "Bolted down against vibration.", V3(0, 2.3, 0), (o) => {
        o.position.y = H - 0.07;
        bx(W, 0.07, D, ribMat(4.5, 4.5), 0, 0.035, 0, o);
        topLogo(W, D, 0.072, o, 0.6);
      });
      part(g, parts, "Power for every device", "Feeds cameras, LiDAR, displays, RFID and sensors from one place.", V3(0, 1.55, -0.15), (o) => {
        o.position.set(0.3, 0.07, -0.55);
        bx(1.5, 0.03, 1.05, M.inner, 0, 0, 0, o);
        for (let r = 0; r < 4; r++) for (let i = 0; i < 8; i++) bx(0.1, 0.12, 0.18, M.term, -0.56 + i * 0.16, 0.075, -0.36 + r * 0.24, o);
      });
      part(g, parts, "The brain", "NVIDIA Jetson Orin Nano Super, running the whole RAMS 2.0 kit.", V3(0, 1.05, 0.2), (o) => {
        o.position.set(0.25, 0.07, 0.55);
        bx(0.95, 0.04, 0.8, M.pcb, 0, 0, 0, o);
        bx(0.62, 0.03, 0.44, M.chip, -0.05, 0.035, -0.05, o);
        for (let i = 0; i < 8; i++) bx(0.012, 0.13, 0.38, M.alu, -0.28 + i * 0.065, 0.11, -0.05, o);
        cy(0.15, 0.05, M.chip, -0.05, 0.2, -0.05, o);
      });
      part(g, parts, "Power conversion", "Steps the truck’s supply down for the electronics.", V3(-0.35, 0.9, -0.2), (o) => {
        o.position.set(-0.8, 0.07, -0.4);
        bx(0.5, 0.36, 0.65, M.grey, 0, 0.18, -0.05, o);
        bx(0.5, 0.36, 0.55, M.grey, 0, 0.18, 0.6, o);
      });
      part(g, parts, "Backup power", "Battery management and a UPS keep the brain on through supply dips.", V3(-0.55, 0.55, 0.35), (o) => {
        o.position.set(-0.8, 0.07, 0.85);
        bx(0.5, 0.3, 0.45, M.batt, 0, 0.15, 0, o);
        bx(0.2, 0.06, 0.1, M.orange, 0, 0.33, 0, o);
      });
      part(g, parts, "Twin cooling fans", "Two 70 mm fans for hot, dusty floors.", V3(-1.1, 0, 0), (o) => {
        o.position.set(-W / 2 - 0.03, 0.48, 0);
        for (const z of [-0.45, 0.45]) {
          cy(0.3, 0.06, M.chip, 0, 0, z, o, "x");
          cy(0.1, 0.07, M.grey, 0, 0, z, o, "x");
        }
      });
      part(g, parts, "Every sensor plugs in", "USB, LiDAR, impact sensors and nine powered ports.", V3(1.1, 0, 0), (o) => {
        o.position.set(W / 2 + 0.02, 0, 0);
        bx(0.03, 0.3, 0.9, M.inner, 0, 0.3, -0.4, o);
        for (let i = 0; i < 4; i++) bx(0.04, 0.07, 0.13, M.metal, 0.01, 0.3, -0.73 + i * 0.22, o);
        bx(0.03, 0.3, 0.5, M.inner, 0, 0.72, -0.55, o);
        bx(0.04, 0.14, 0.16, M.metal, 0.01, 0.72, -0.55, o);
        bx(0.03, 0.3, 0.8, M.inner, 0, 0.72, 0.25, o);
        cy(0.08, 0.05, M.metal, 0.02, 0.72, 0.05, o, "x");
        cy(0.08, 0.05, M.metal, 0.02, 0.72, 0.3, o, "x");
        bx(0.03, 0.5, 0.6, M.inner, 0, 0.3, 0.6, o);
        for (let r = 0; r < 3; r++) for (let i = 0; i < 3; i++) bx(0.04, 0.07, 0.1, M.chip, 0.01, 0.16 + r * 0.14, 0.43 + i * 0.17, o);
      });
      return { group: g, parts, size: V3(W, H, D) };
    },
    core() {
      /* Every offset here is zero, so Core does not come apart. It is the one
         box in the family with no fixed internals — what goes in it is decided
         per job — so an exploded view of it would be showing a specific
         arrangement as if it were the product. The parts keep their labels;
         they simply do not separate. `OmniInside` also hides the take-apart
         control while Core is selected.

         ── Why it is built like this ──────────────────────────────────
         Edge, AI and Motion are CAD, and next to them the first procedural
         Core — square boxes, slab fins, floating ears — read as a sketch. So it
         now speaks their language, detail for detail: a rounded, bevelled
         housing; a lid under diagonal ribs, over a rubber seal; a bezelled I/O panel. And it says *custom* in the way a
         real configurable enclosure does — some connectors fitted, the rest of
         the panel as blank module plates screwed in place, waiting to be cut
         for the job — rather than by looking unfinished.

         All of it is extrusions of rounded outlines, so every edge catches the
         environment light: that highlight is most of what separates a machined
         part from a box primitive. 1 unit = 100 mm, like the others. */
      const g = new THREE.Group(), parts: Part[] = [], W = 1.8, H = 0.9, D = 1.4;
      const t = 0.055, lidT = 0.07, Hb = H - lidT, R = 0.085;

      /* ── helpers: rounded outlines and their extrusions ── */
      const rr = (sh: THREE_NS.Shape | THREE_NS.Path, w: number, d: number, r: number, cx = 0, cy0 = 0) => {
        const x = cx - w / 2, y = cy0 - d / 2;
        r = Math.min(r, w / 2, d / 2);
        sh.moveTo(x + r, y);
        sh.lineTo(x + w - r, y);
        sh.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
        sh.lineTo(x + w, y + d - r);
        sh.absarc(x + w - r, y + d - r, r, 0, Math.PI / 2, false);
        sh.lineTo(x + r, y + d);
        sh.absarc(x + r, y + d - r, r, Math.PI / 2, Math.PI, false);
        sh.lineTo(x, y + r);
        sh.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
        return sh;
      };
      const rrShape = (w: number, d: number, r: number) => rr(new THREE.Shape(), w, d, r) as THREE_NS.Shape;
      /** Extrude a shape `h` tall, lying flat: shape x → x, shape y → −z,
       *  bottom at `y`. The bevel eats into the outline, so it is inset first
       *  by the caller passing the finished size. */
      const upGeo = (shape: THREE_NS.Shape, h: number, bevel: number) => {
        const geo = new THREE.ExtrudeGeometry(shape, {
          depth: Math.max(1e-4, h - 2 * bevel), bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel,
          bevelSegments: 3, curveSegments: 12,
        });
        geo.rotateX(-Math.PI / 2);
        geo.translate(0, bevel, 0);
        return geo;
      };
      const up = (shape: THREE_NS.Shape, h: number, bevel: number, m: THREE_NS.Material, x: number, y: number, z: number, p: THREE_NS.Object3D) => {
        const o = new THREE.Mesh(upGeo(shape, h, bevel), m);
        o.position.set(x, y, z);
        p.add(o);
        return o;
      };
      /** The same, standing up and facing +z (a front-face feature). */
      const out = (shape: THREE_NS.Shape, dz: number, bevel: number, m: THREE_NS.Material, x: number, y: number, z: number, p: THREE_NS.Object3D, face = 1) => {
        const geo = new THREE.ExtrudeGeometry(shape, {
          depth: Math.max(1e-4, dz - 2 * bevel), bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel,
          bevelSegments: 2, curveSegments: 10,
        });
        geo.translate(0, 0, bevel);
        const o = new THREE.Mesh(geo, m);
        o.position.set(x, y, z);
        if (face < 0) o.rotation.y = Math.PI;
        p.add(o);
        return o;
      };
      const inset = (w: number, b: number) => w - 2 * b;

      /* An M12 industrial connector on the front face: hex nut, body, the
         coding face with its pins in a dark insert, and a knurled coupling. */
      const m12 = (x: number, y: number, z: number, p: THREE_NS.Object3D) => {
        cy(0.05, 0.02, CORE.hardware, x, y, z + 0.01, p, "z", 6);
        cy(0.038, 0.05, CORE.hardware, x, y, z + 0.045, p, "z", 28);
        for (let i = 0; i < 16; i++) {
          const a = (i / 16) * Math.PI * 2;
          bx(0.006, 0.006, 0.036, CORE.metal, x + Math.cos(a) * 0.039, y + Math.sin(a) * 0.039, z + 0.05, p);
        }
        cy(0.025, 0.004, CORE.recess, x, y, z + 0.071, p, "z", 24);
        for (let i = 0; i < 4; i++) {
          const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
          cy(0.0035, 0.006, CORE.hardware, x + Math.cos(a) * 0.012, y + Math.sin(a) * 0.012, z + 0.073, p, "z", 8);
        }
      };
      /* An industrial RJ45: a metal-shelled jack with a dark mouth and its two
         status LEDs. */
      const rj45 = (x: number, y: number, z: number, p: THREE_NS.Object3D) => {
        out(rrShape(0.12, 0.1, 0.012), 0.024, 0.004, CORE.hardware, x, y, z, p);
        bx(0.078, 0.056, 0.004, CORE.recess, x, y - 0.006, z + 0.0245, p);
        bx(0.03, 0.012, 0.004, CORE.recess, x, y + 0.025, z + 0.0245, p);
        bx(0.014, 0.008, 0.003, CORE.ledG, x - 0.043, y + 0.038, z + 0.025, p);
        bx(0.014, 0.008, 0.003, CORE.led, x + 0.043, y + 0.038, z + 0.025, p);
      };
      /* A blank module plate: the unfitted slot, closed by four screws until it
         is cut for the connector this job needs. */
      const blank = (x: number, y: number, z: number, w: number, h: number, p: THREE_NS.Object3D) => {
        out(rrShape(w, h, 0.018), 0.012, 0.003, CORE.plate, x, y, z, p);
        for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
          cy(0.011, 0.006, CORE.hardware, x + sx * (w / 2 - 0.025), y + sy * (h / 2 - 0.025), z + 0.014, p, "z", 16);
        }
        bx(w * 0.42, 0.003, 0.002, CORE.mark, x, y, z + 0.0125, p);
      };

      /* Diagonal ribs, as geometry, clipped to a rectangle — the lid pattern
         all three CAD boxes carry. Each rib is a 45° band intersected with the
         field (Sutherland–Hodgman against four edges and the band's two). */
      const ribs = (x0: number, x1: number, z0: number, z1: number, pitch: number, w: number, h: number, y: number, p: THREE_NS.Object3D) => {
        const clip = (poly: number[][], nx: number, nz: number, c: number) => {
          const res: number[][] = [];
          for (let i = 0; i < poly.length; i++) {
            const a = poly[i], b = poly[(i + 1) % poly.length];
            const da = nx * a[0] + nz * a[1] - c, db = nx * b[0] + nz * b[1] - c;
            if (da <= 0) res.push(a);
            if ((da < 0) !== (db < 0) && da !== db) {
              const k = da / (da - db);
              res.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]);
            }
          }
          return res;
        };
        // Measured off the Motion CAD from directly above: bands along
        // x + z = const, wide flat ridges parted by narrow grooves — about
        // 7 mm pitch with 1.3 mm grooves — not thin ribs on a flat lid.
        const rect = [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];
        const k0 = x0 + z0, k1 = x1 + z1, s2 = Math.SQRT2;
        for (let k = Math.floor(k0 / pitch) * pitch; k < k1; k += pitch) {
          let poly = clip(rect, 1, 1, k + w * s2);
          poly = clip(poly, -1, -1, -k);
          if (poly.length < 3) continue;
          const sh = new THREE.Shape();
          poly.forEach(([px, pz], i) => (i ? sh.lineTo(px, -pz) : sh.moveTo(px, -pz)));
          const o = new THREE.Mesh(upGeo(sh, h, 0), CORE.rib);
          o.position.y = y;
          p.add(o);
        }
      };

      /* ── the enclosure ── */
      part(g, parts, "Enclosure", "Machined to size, sealed for where it has to live.", V3(0, 0, 0), (o) => {
        // Walls: one rounded ring, bevelled so the corners and top edge read.
        // Outline inset by the bevel, so the finished face lands exactly on
        // W/2 and D/2 — the decal and the bezel are placed against it.
        const ring = rrShape(W - 0.024, D - 0.024, R - 0.012);
        ring.holes.push(rr(new THREE.Path(), inset(W, t), inset(D, t), R - t * 0.6) as THREE_NS.Path);
        up(ring, Hb, 0.012, CORE.shell, 0, 0, 0, o);
        up(rrShape(inset(W, t), inset(D, t), R - t * 0.6), t, 0, CORE.shell, 0, 0, 0, o);

        // A plinth step at the foot, so the box sits on something rather than
        // simply stopping at the ground.
        up(rrShape(W + 0.03, D + 0.03, R + 0.015), 0.045, 0.01, CORE.shell, 0, 0, 0, o);

        // No mounting tabs: they read as ears bolted onto a clean block. The
        // box stands on its plinth like the other three; how it is fixed on
        // site is left to the install.

        decal(M.word, 0.46, 0.082, -W / 2 + 0.12 + 0.23, 0.11, D / 2 + 0.001, o, "front");
      });

      /* ── I/O: a bezelled panel on the front face ── */
      part(g, parts, "I/O panel", "Fitted with what this job needs; the blank plates are cut to order.", V3(0, 0, 0), (o) => {
        const pw = W * 0.84, ph = Hb * 0.56, py = Hb * 0.52, z = D / 2;
        const bez = rrShape(pw + 0.06, ph + 0.06, 0.05);
        bez.holes.push(rr(new THREE.Path(), pw, ph, 0.03) as THREE_NS.Path);
        out(bez, 0.024, 0.006, CORE.shell, 0, py, z, o);
        out(rrShape(pw, ph, 0.03), 0.008, 0, CORE.recess, 0, py, z, o);

        const zf = z + 0.008;
        // Three M12s for sensors and I/O, two RJ45s for the network.
        for (let i = 0; i < 3; i++) m12(-pw / 2 + 0.12 + i * 0.15, py - 0.02, zf, o);
        rj45(-pw / 2 + 0.6, py + 0.045, zf, o);
        rj45(-pw / 2 + 0.6, py - 0.075, zf, o);
        // The configurable half: blank plates waiting for their cut-outs.
        blank(pw / 2 - 0.4, py - 0.015, zf, 0.2, 0.2, o);
        blank(pw / 2 - 0.16, py - 0.015, zf, 0.2, 0.2, o);

        // Status: a light pipe in brand orange and a recessed power button.
        cy(0.012, 0.012, CORE.led, -pw / 2 + 0.07, py + ph / 2 - 0.05, zf + 0.006, o, "z", 16);
        cy(0.026, 0.01, CORE.recess, -pw / 2 + 0.13, py + ph / 2 - 0.05, zf + 0.005, o, "z", 24);
        cy(0.019, 0.016, CORE.hardware, -pw / 2 + 0.13, py + ph / 2 - 0.05, zf + 0.008, o, "z", 24);
      });

      /* ── cooling: finned heat sinks down both flanks ── */
      part(g, parts, "Heat sink", "Passive fins on both sides. No fan to fail, nothing to clog.", V3(0, 0, 0), (o) => {
        const n = 13, span = D * 0.62, fh = Hb * 0.62, fy = Hb * 0.5;
        for (const sx of [-1, 1]) {
          const xw = sx * W / 2;
          // Base plate the fins stand on, then the fins, then the rails that
          // tie their ends — three parts, the way an extrusion is machined.
          up(rrShape(0.02, span + 0.08, 0.008), fh + 0.06, 0.004, CORE.shell, xw + sx * 0.008, fy - (fh + 0.06) / 2, 0, o);
          for (let i = 0; i < n; i++) {
            const z = -span / 2 + (i / (n - 1)) * span;
            up(rrShape(0.05, 0.016, 0.006), fh, 0.004, CORE.rib, xw + sx * 0.038, fy - fh / 2, z, o);
          }
          for (const ry of [-1, 1]) bx(0.05, 0.014, span + 0.03, CORE.shell, xw + sx * 0.038, fy + ry * (fh / 2 + 0.007), 0, o);
        }
      });

      /* ── the lid ── */
      part(g, parts, "Lid", "Sealed over a rubber gasket. Comes off on site, box still mounted.", V3(0, 0, 0), (o) => {
        o.position.y = Hb;
        // The seal shows as a thin dark line between lid and walls.
        const seal = rrShape(W - 0.012, D - 0.012, R - 0.006);
        seal.holes.push(rr(new THREE.Path(), inset(W, t), inset(D, t), R - t * 0.6) as THREE_NS.Path);
        up(seal, 0.008, 0, CORE.rubber, 0, -0.002, 0, o);
        up(rrShape(W, D, R), lidT, 0.018, CORE.shell, 0, 0.006, 0, o);

        const top = lidT + 0.006, m = 0.1;
        const a = W / 2 - m, b = D / 2 - m;
        // A nameplate in the front-right corner, where every box carries its
        // mark; the ribs stop short of it.
        const npW = 0.56, npD = 0.25, gap = 0.035;
        const nx = a - npW / 2, nz = b - npD / 2;
        ribs(-a, a, -b, b - npD - gap, 0.1, 0.058, 0.012, top, o);
        ribs(-a, a - npW - gap, b - npD - gap, b, 0.1, 0.058, 0.012, top, o);
        up(rrShape(npW, npD, 0.03), 0.012, 0.003, CORE.plate, nx, top, nz, o);
        for (const sx of [-1, 1]) cy(0.012, 0.006, CORE.hardware, nx + sx * (npW / 2 - 0.035), top + 0.014, nz, o, "y", 16);
        decal(M.logo, 0.4, 0.4 / LOGO_ASPECT, nx, top + 0.0125, nz, o);

        // No screw heads on the lid face: it is a clean ribbed top like the
        // other three, and the fixings are taken as hidden under it.
      });

      /* ── the back: cable glands and a breather ── */
      part(g, parts, "Cable glands", "IP-rated entries for power and field wiring.", V3(0, 0, 0), (o) => {
        const z = -D / 2;
        for (let i = 0; i < 3; i++) {
          const x = -0.45 + i * 0.3, y = Hb * 0.42;
          cy(0.06, 0.028, CORE.hardware, x, y, z - 0.014, o, "z", 6);
          cy(0.048, 0.04, CORE.rubber, x, y, z - 0.048, o, "z", 28);
          const dome = new THREE.Mesh(new THREE.SphereGeometry(0.048, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), CORE.rubber);
          dome.rotation.x = -Math.PI / 2;
          dome.position.set(x, y, z - 0.068);
          o.add(dome);
        }
        cy(0.04, 0.03, CORE.hardware, 0.65, Hb * 0.42, z - 0.015, o, "z", 6);
        cy(0.03, 0.02, CORE.plate, 0.65, Hb * 0.42, z - 0.035, o, "z", 24);
      });

      /* ── what sits inside (seen through the model's labels, not apart) ── */
      part(g, parts, "Compute plate", "Raspberry Pi or NVIDIA Jetson — whichever the job needs.", V3(0, 0, 0), (o) => {
        o.position.set(-0.42, t + 0.02, 0);
        bx(0.66, 0.018, 0.6, CORE.hardware, 0, 0, 0, o);
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) cy(0.022, 0.11, CORE.metal, sx * 0.26, 0.055, sz * 0.23, o, "y", 12);
        bx(0.5, 0.016, 0.44, CORE.board, 0, 0.12, 0, o);
        bx(0.2, 0.05, 0.2, CORE.metal, 0, 0.15, 0, o);
      });

      part(g, parts, "DIN rail", "Empty bay. Whatever the process needs, mounted here.", V3(0, 0, 0), (o) => {
        o.position.set(0.45, t + 0.02, 0);
        bx(0.62, 0.05, 0.075, CORE.metal, 0, 0.025, -0.16, o);
        bx(0.62, 0.05, 0.075, CORE.metal, 0, 0.025, 0.16, o);
        for (let i = 0; i < 2; i++) {
          bx(0.13, 0.3, 0.42, CORE.panel, -0.2 + i * 0.15, 0.17, 0, o);
          bx(0.13, 0.03, 0.42, CORE.mark, -0.2 + i * 0.15, 0.325, 0, o);
        }
      });

      part(g, parts, "Power in", "Mains, panel, vehicle or battery — specified per install.", V3(0, 0, 0), (o) => {
        o.position.set(0, t + 0.02, -D / 2 + 0.16);
        bx(0.5, 0.26, 0.2, CORE.panel, 0, 0.13, 0, o);
        for (let i = 0; i < 4; i++) bx(0.055, 0.075, 0.03, CORE.mark, -0.15 + i * 0.1, 0.19, 0.115, o);
      });

      return { group: g, parts, size: V3(W + 0.03, H, D + 0.12) };
    },
  };

  const makeHolder = (key: string): Holder => {
    const g = new THREE.Group();
    const model = PROC[key]();
    model.group.traverse((o) => {
      const m = o as THREE_NS.Mesh;
      if (m.isMesh && m.material !== M.glass && m.material !== M.logo && m.material !== M.word) {
        m.castShadow = !isMobile;
        m.receiveShadow = !isMobile;
      }
    });
    model.parts.forEach((p) => {
      p.base = p.obj.position.clone();
    });
    g.add(model.group);
    return { key, g, model };
  };


  /* ── real models ───────────────────────────────────────────
     Edge, AI and Motion exist as CAD, converted to GLB offline: the 3MF assemblies
     were regrouped into their own named sub-assemblies, decimated from CAD
     tessellation down to display density, and coloured per assembly. One glTF
     node per part, which is what makes the exploded view work on a loaded model
     exactly as it does on a procedural one.

     The procedural builders stay. They are what the hero film uses — four boxes
     at thumbnail size, needed on first paint — and they are the fallback if a
     GLB fails. Only the Inside viewer, where a reader is looking at one box
     closely and taking it apart, pays for the real geometry. */
  const GLB: Record<string, string> = {
    edge: "/omnibox/omnibox-edge.glb",
    /* AI is the Jetson Orin Nano enclosure, supplied as a SolidWorks glTF
       (Draco-compressed, Z-up, 738k triangles, 800 nodes named by part
       number). It was converted offline into the same shape as the other
       two: eight named parts, baked to model space, turned Y-up with the
       ports edge to the front (+Z), centred at span 1, Draco removed — no
       decoder ships with this site — and decimated to 177k triangles. */
    ai: "/omnibox/omnibox-ai.glb",
    motion: "/omnibox/omnibox-motion.glb",
  };

  /** Plain-language notes for the parts the CAD names do not explain. */
  const PART_DESC: Record<string, string> = {
    "Enclosure": "Sealed housing, DIN-rail or panel mounted.",
    "Raspberry Pi 5": "The compute. Runs the local decision logic.",
    "Cooling": "Heatsink and fan, sized to run all shift.",
    "Relay board": "Dry contacts out to the machine, alarm or beacon.",
    "Power": "12\u201380 V in, regulated for every board in the box.",
    "Audio amp": "Drives a sounder where a beep is the response.",
    "Status LED": "One light: powered, working, faulted.",
    "Ports": "Service and display, reachable without opening it.",
    "UPS battery": "Rides out the gap when the truck cuts power.",
    "Router": "Carries events back when the site has a network.",
    "USB ports": "Cameras and sensors, connected on the truck.",
    "TF-Luna LiDAR": "Measures the distance to the load on the forks.",
    "Raspberry Pi Pico W": "Reads the sensor and decides, on the fork carriage.",
    "XT30 power in": "Locking connector, taken from truck power.",
    "Lid": "Comes off for service without unmounting the box.",
    "Lock": "Quarter-turn catch, no tools.",
    "Magnet": "Holds the lid closed against vibration.",
    "Fasteners": "Standard hardware throughout \u2014 nothing bespoke to source.",
    "Jetson Orin Nano": "The brain. NVIDIA Jetson Orin Nano Super, running the whole RAMS 2.0 kit.",
    "Carrier board": "Every port the brain needs \u2014 USB, Ethernet, cameras and a display.",
    "NVMe SSD": "Local storage, so footage and events stay on site.",
    "Wi-Fi": "Wireless module and antennas, for where no cable can run.",
  };

  /* The converter's palette read grey, not black. Its enclosure is 0.043 in
     glTF's *linear* space — about #3a3b3e on screen — and at metalness 0.22 it
     mirrored the whole RoomEnvironment on top of that. So the CAD colours are
     replaced by part name, the way /hardware/sensor-stack does it for the PDS
     (`PDS_MAT` in `sst-3d.ts`), and in the same values: a dielectric matte
     black shell at #111214 with the reflections halved, dark boards, gunmetal
     for the metal. Flat-shaded because the CAD ships without normals, which is
     what GLTFLoader would have given the originals. */
  const flat = (color: number, o: THREE_NS.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.55, flatShading: true }, o));
  const GLB_MAT = {
    shell: flat(0x111214, { roughness: 0.55, envMapIntensity: 0.5 }),
    rubber: flat(0x0c0c0e, { roughness: 0.8, envMapIntensity: 0.3 }),
    board: flat(0x1b1c1f, { roughness: 0.65, envMapIntensity: 0.5 }),
    gunmetal: flat(0x3b3d42, { roughness: 0.32, metalness: 0.85 }),
    led: flat(0xff6a00, { emissive: 0xff6a00, emissiveIntensity: 0.9 }),
    /* The engraved logo on Edge's lid, in the brand's white and orange. The
       tick is unlit and outside tone mapping for the reason the PDS gives: lit,
       the key light washes #FF6A00 out to apricot. */
    logo: flat(0xf3f1ec, { roughness: 0.5 }),
    tick: new THREE.MeshBasicMaterial({ color: 0xff6a00, toneMapped: false }),
  };

  const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

  /** Moves every triangle lying wholly above `y` out of `mesh` into a new mesh
   *  of its own, in the same (file) space. Null if there is nothing above. */
  const splitAbove = (mesh: THREE_NS.Mesh, y: number): THREE_NS.Mesh | null => {
    const geo = mesh.geometry, idx = geo.index, pos = geo.attributes.position;
    if (!idx) return null;
    const below: number[] = [], above: number[] = [];
    for (let t = 0; t < idx.count; t += 3) {
      const a = idx.getX(t), b = idx.getX(t + 1), c = idx.getX(t + 2);
      (Math.min(pos.getY(a), pos.getY(b), pos.getY(c)) > y ? above : below).push(a, b, c);
    }
    if (!above.length || !below.length) return null;
    const top = geo.clone();
    top.setIndex(above);
    geo.setIndex(below);
    const m = new THREE.Mesh(top, mesh.material);
    m.position.copy(mesh.position);
    m.quaternion.copy(mesh.quaternion);
    m.scale.copy(mesh.scale);
    return m;
  };

  /**
   * Edge's "RAMS DIGITAL" is geometry, not print: the letters are the floor of
   * a 0.0033-unit engraving (y 0.1317 against the lid top at 0.135, in file
   * units) in the lid's front-right corner. This sorts the lid's triangles into
   * housing / wordmark / tick index ranges so each takes its own material —
   * the same approach as `splitLogo` on the sensor-stack PDS. The tick is the
   * L above and right of the S; the box bounds keep out the round vent and the
   * label outline that share the engraving depth.
   */
  const colourEdgeLogo = (geo: THREE_NS.BufferGeometry) => {
    const idx = geo.index, pos = geo.attributes.position;
    if (!idx) return;
    const body: number[] = [], word: number[] = [], tick: number[] = [];
    for (let t = 0; t < idx.count; t += 3) {
      const v = [idx.getX(t), idx.getX(t + 1), idx.getX(t + 2)];
      let yMin = 9, yMax = -9, cx = 0, cz = 0;
      for (const i of v) {
        const yy = pos.getY(i);
        yMin = Math.min(yMin, yy);
        yMax = Math.max(yMax, yy);
        cx += pos.getX(i) / 3;
        cz += pos.getZ(i) / 3;
      }
      const inLogo = yMin > 0.131 && yMax < 0.1322 && cx > 0.115 && cz > 0.135;
      const isTick = cx > 0.452 || (cz < 0.158 && cx > 0.43);
      (inLogo ? (isTick ? tick : word) : body).push(...v);
    }
    geo.setIndex([...body, ...word, ...tick]);
    geo.clearGroups();
    geo.addGroup(0, body.length, 0);
    geo.addGroup(body.length, word.length, 1);
    geo.addGroup(body.length + word.length, tick.length, 2);
  };
  const glbMatFor = (name: string): THREE_NS.Material =>
    /enclos|lid|vent/i.test(name) ? GLB_MAT.shell
    : /gasket/i.test(name) ? GLB_MAT.rubber
    : /status led/i.test(name) ? GLB_MAT.led
    : /cool|terminal|connector|\bport|jack|fuse|switch|c14|mr30|fasten/i.test(name) ? GLB_MAT.gunmetal
    : GLB_MAT.board;

  const loadModel = async (url: string, target: number): Promise<BoxModel> => {
    const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
    const gltf = await new GLTFLoader().loadAsync(url);
    const root = gltf.scene;

    /* The loaded scene stays the container. The first version of this built a
       fresh group and reparented every node into it — which silently threw away
       the scale, because the scale was on the scene being discarded. The model
       then rendered at its exported one-unit size inside a viewer framed for a
       box three times that, and the explode offsets were computed in the wrong
       space on top of it. Keep the scene, wrap parts *inside* it. */
    const bb = new THREE.Box3().setFromObject(root);
    const span = Math.max(...bb.getSize(V3()).toArray(), 1e-6);
    root.scale.setScalar(target / span);

    /* Edge's converter fused the lid into the "Power" node — one mesh from the
       floor to the top of the lid. Its centre then sat on the model's centre,
       so it was held still as if it were the body, and the rest of the parts
       exploded *inside* a lid that never lifted: from outside, nothing moved.
       The lid is cut back out here and given its logo colours. */
    const power = root.getObjectByName("Power") as THREE_NS.Mesh | undefined;
    if (power?.isMesh && /edge/.test(url)) {
      const lid = splitAbove(power, 0.045);
      if (lid) {
        lid.name = "Lid";
        colourEdgeLogo(lid.geometry);
        lid.material = [GLB_MAT.shell, GLB_MAT.logo, GLB_MAT.tick];
        lid.userData.keepMat = true;
        root.add(lid);
      }
    }
    /* Motion and AI have no engraving, so they take the same logo decal as
       the procedural boxes, on the same front-right corner of the lid. Values
       are in file units: the lid's half-extents in x and z, its top face, and
       the mark's width. */
    const lidLogo: Record<string, [number, number, number, number]> = {
      motion: [0.471, 0.466, 0.1977, 0.25],
      ai: [0.5, 0.39, 0.1745, 0.3],
    };
    const lidMesh = root.getObjectByName("Lid") as THREE_NS.Mesh | undefined;
    const ll = Object.entries(lidLogo).find(([k]) => url.includes(`omnibox-${k}.glb`))?.[1];
    if (lidMesh?.isMesh && ll) {
      const [hx, hz, y, w] = ll, hgt = w / LOGO_ASPECT;
      decal(M.logo, w, hgt, hx - 0.05 - w / 2, y, hz - 0.05 - hgt / 2, lidMesh).userData.keepMat = true;
    }

    const bbC = bb.getCenter(V3()), ext = bb.getSize(V3()).multiplyScalar(0.5);
    /* Per-model scale on how high the explode lifts, tuned by eye. Both boxes
       climbed out of proportion to themselves: Motion because it is the
       tallest, Edge because it is the flattest — a lid rising 1.4 units off a
       box 0.43 tall reads as flying away rather than lifting off. Only the
       vertical is scaled, so parts pushed out through a wall stay where they
       are. Applied to the lid too, so it still clears everything below it. */
    const LIFT: Record<string, number> = { edge: 0.85, motion: 0.8 };
    /* Which parts get a label, and what it says. The CAD names every part it
       has — Motion alone has 25, down to each barrier terminal, the RJ45 jack,
       the rocker switch and a "Support h" — which is a drawing's parts list,
       not a website's. Where a model is listed here, only these are labelled,
       in plain words; the rest still come apart, just unnamed. Edge and AI are
       short enough to keep every name. */
    const SHOW: Record<string, Record<string, string>> = {
      motion: {
        "Lid": "Lid",
        "Cooling": "Cooling fans",
        "Router": "Router",
        "UPS battery": "UPS battery",
        "Relay board": "Relay board",
        "5V buck converter": "Power conversion",
        "USB ports": "USB ports",
      },
    };
    const show = Object.entries(SHOW).find(([k]) => url.includes(`omnibox-${k}.glb`))?.[1];
    const lift = Object.entries(LIFT).find(([k]) => url.includes(`omnibox-${k}.glb`))?.[1] ?? 1;
    const parts: Part[] = [];
    /* Each node is wrapped in a group of its own so `explode` has something to
       move that is not the node's own baked transform. The wrapper takes the
       node's position and the node sits at its wrapper's origin. */
    for (const child of [...root.children]) {
      const holder = new THREE.Group();
      holder.position.copy(child.position);
      child.position.set(0, 0, 0);
      root.remove(child);
      holder.add(child);
      root.add(holder);

      holder.updateMatrixWorld(true);
      /* Offsets are in the scene's own local space — the space `explode` moves
         parts in — so they scale with the model rather than being quoted in
         world units the model may not be drawn at. */
      const c = new THREE.Box3().setFromObject(holder).getCenter(V3());
      root.worldToLocal(c);
      const rel = c.sub(bbC);

      /* The explode is shaped like the procedural one, because that is the one
         that reads: the enclosure stays put as the frame, the lid lifts clear
         above everything, parts on a wall push straight out through it, and
         the internals rise in layers — higher parts higher — with a little
         spread so they do not stack on one another.

         The first version flew every part along the line from the centre to
         it. That is mostly sideways on a flat box, and the film scales the
         sideways part down to 0.3 so neighbours do not collide — which left
         Edge all but still. Lifting is what survives that scaling. It also
         keeps the Inside viewer's framing honest: it frames from `maxLift`. */
      /* GLTFLoader sanitises node names for animation binding — spaces become
         underscores — so "UPS battery" arrives as `UPS_battery`. Every lookup
         below (labels, descriptions, materials) is keyed by the CAD's own
         spelling, so put the spaces back first. */
      const name = child.name.replace(/_/g, " ");
      const isBody = /enclos|chassis|housing|shell|case/i.test(name);
      const fx = Math.abs(rel.x) / ext.x, fz = Math.abs(rel.z) / ext.z;
      const hN = clamp01((rel.y + ext.y) / (2 * ext.y));
      const offset = isBody ? V3()
        : /\blid\b|cover/i.test(name) ? V3(0, span * 0.85, 0)
        : /gasket/i.test(name) ? V3(0, span * 0.72, 0)
        : Math.max(fx, fz) > 0.82
          ? (fx > fz ? V3(Math.sign(rel.x), 0, 0) : V3(0, 0, Math.sign(rel.z))).multiplyScalar(span * 0.26).add(V3(0, span * 0.05, 0))
          : V3((rel.x / ext.x) * span * 0.12, span * (0.28 + 0.3 * hN), (rel.z / ext.z) * span * 0.12);
      offset.y *= lift;
      const label = show ? show[name] ?? "" : name || "Part";
      parts.push({ obj: holder, offset, label, desc: PART_DESC[name] ?? "" });

      const mat = glbMatFor(name);
      holder.traverse((n) => {
        const m = n as THREE_NS.Mesh;
        if (!m.isMesh) return;
        if (!m.userData.keepMat) m.material = mat;
        const isDecal = m.material === M.logo;
        m.castShadow = !isMobile && !isDecal;
        m.receiveShadow = !isMobile && !isDecal;
      });
    }

    /* Centred in plan and standing on the floor, the way the procedural builds
       sit. This used to centre it in height too, which put half of each CAD
       box below the ground plane: in the film's lineup Edge and Motion sat
       lower than AI and Core, which from a raised camera reads as standing in
       front of them. The Inside viewer frames from y = 0 up as well. */
    const group = new THREE.Group();
    group.add(root);
    group.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(group);
    const mid = box.getCenter(V3());
    root.position.x -= mid.x;
    root.position.z -= mid.z;
    root.position.y -= box.min.y;
    group.updateMatrixWorld(true);
    return { group, parts, size: new THREE.Box3().setFromObject(group).getSize(V3()) };
  };

  /** The Inside viewer's loader: the real model where one exists, else the
   *  procedural build. Never throws — a failed GLB just falls back. */
  const loadHolder = async (key: string): Promise<Holder> => {
    const url = GLB[key];
    if (url) {
      try {
        const proc = PROC[key]();
        const target = Math.max(proc.size.x, proc.size.y, proc.size.z);
        const model = await loadModel(url, target);
        model.parts.forEach((p) => {
          p.base = p.obj.position.clone();
        });
        const g = new THREE.Group();
        g.add(model.group);
        return { key, g, model };
      } catch (err) {
        console.warn("OmniBox: falling back to the procedural " + key + " \u2014", err);
      }
    }
    return makeHolder(key);
  };

  /**
   * `side` scales the sideways component of each offset. The film shows four
   * boxes shoulder to shoulder, so parts that fly out sideways there would land
   * in the neighbour — it passes 0.3.
   */
  const explode = (h: Holder, e: number, side = 1) => {
    for (const p of h.model.parts) {
      const o = p.offset, b = p.base!;
      p.obj.position.set(b.x + o.x * e * side, b.y + o.y * e, b.z + o.z * e * side);
    }
  };

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
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    return scene;
  };

  /* ── connections view ─────────────────────────────────── */
  const dome = (r: number, m: THREE_NS.Material, x: number, y: number, z: number, p: THREE_NS.Object3D) => {
    const o = new THREE.Mesh(new THREE.SphereGeometry(r, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), m);
    o.position.set(x, y, z);
    p.add(o);
    return o;
  };
  const ringM = (r: number, t: number, m: THREE_NS.Material, x: number, y: number, z: number, p: THREE_NS.Object3D) => {
    const o = new THREE.Mesh(new THREE.TorusGeometry(r, t, 10, 36), m);
    o.position.set(x, y, z);
    p.add(o);
    return o;
  };

  /** Device stand-ins: origin at the base, front along +z. */
  const DEVICE: Record<string, (g: THREE_NS.Group) => void> = {
    aicam(g) { bx(0.6, 0.8, 0.46, M.shell, 0, 0.4, -0.02, g); bx(0.62, 0.82, 0.03, MX.white, 0, 0.4, 0.23, g); bx(0.5, 0.012, 0.36, M.orange, 0, 0.806, -0.02, g); bx(0.42, 0.014, 0.28, M.chip, 0, 0.81, -0.02, g); cy(0.12, 0.1, M.chip, 0, 0.22, 0.28, g, "z"); cy(0.06, 0.02, M.grey, 0, 0.22, 0.335, g, "z"); },
    robot(g) { cy(0.32, 0.14, M.grey, 0, 0.07, 0, g); cy(0.13, 0.62, M.orange, 0, 0.45, 0, g); bx(0.22, 0.22, 0.22, M.shell, 0, 0.82, 0, g); bx(0.95, 0.14, 0.16, M.orange, 0.42, 0.88, 0, g); bx(0.14, 0.56, 0.14, M.orange, 0.86, 0.63, 0, g); bx(0.24, 0.08, 0.22, M.shell, 0.86, 0.32, 0, g); },
    beacon(g) { cy(0.11, 0.08, M.shell, 0, 0.04, 0, g); cy(0.028, 0.42, M.metal, 0, 0.29, 0, g); cy(0.1, 0.15, MX.green, 0, 0.58, 0, g); cy(0.1, 0.15, MX.amber, 0, 0.735, 0, g); cy(0.1, 0.15, MX.red, 0, 0.89, 0, g); cy(0.1, 0.03, M.shell, 0, 0.98, 0, g); },
    phone(g) { const p = new THREE.Group(); g.add(p); bx(0.38, 0.76, 0.045, M.chip, 0, 0.38, 0, p); bx(0.33, 0.66, 0.01, MX.screen, 0, 0.38, 0.026, p); p.rotation.x = -0.22; },
    cam360(g) { cy(0.3, 0.1, MX.white, 0, 0.05, 0, g); dome(0.22, M.chip, 0, 0.1, 0, g); },
    forkcam(g) { bx(0.34, 0.28, 0.3, M.shell, 0, 0.14, 0, g); cy(0.09, 0.08, M.chip, 0, 0.14, 0.18, g, "z"); cy(0.05, 0.02, M.grey, 0, 0.14, 0.225, g, "z"); },
    display(g) { cy(0.05, 0.3, M.grey, 0, 0.15, 0, g); bx(1.0, 0.62, 0.06, M.shell, 0, 0.62, 0, g); bx(0.92, 0.54, 0.01, MX.screen, 0, 0.62, 0.036, g); },
    /* A wall speaker for spoken warnings: black cabinet on a wall bracket,
       a dark grille with the woofer's surround and dust cap showing through,
       and a tweeter above. Mounted at head height, as it would be on site. */
    speaker(g) {
      bx(0.06, 0.5, 0.05, M.metal, 0, 0.25, -0.2, g);
      bx(0.14, 0.05, 0.22, M.metal, 0, 0.5, -0.12, g);
      const cab = new THREE.Group();
      cab.position.y = 0.52;
      g.add(cab);
      bx(0.46, 0.64, 0.3, M.shell, 0, 0.32, 0, cab);
      bx(0.4, 0.58, 0.012, M.chip, 0, 0.32, 0.156, cab);
      cy(0.15, 0.02, M.grey, 0, 0.25, 0.165, cab, "z", 40);
      cy(0.125, 0.024, M.chip, 0, 0.25, 0.168, cab, "z", 40);
      cy(0.05, 0.03, M.grey, 0, 0.25, 0.174, cab, "z", 28);
      cy(0.05, 0.02, M.grey, 0, 0.5, 0.165, cab, "z", 28);
      cy(0.03, 0.026, M.chip, 0, 0.5, 0.17, cab, "z", 24);
      bx(0.06, 0.012, 0.004, M.orange, 0.15, 0.06, 0.162, cab);
    },
    rfid(g) { bx(0.56, 0.56, 0.07, MX.white, 0, 0.28, 0, g); ringM(0.16, 0.018, M.grey, 0, 0.28, 0.04, g); },
    impact(g) { bx(0.42, 0.16, 0.42, M.yellow, 0, 0.08, 0, g); bx(0.24, 0.03, 0.24, M.shell, 0, 0.175, 0, g); },
    speed(g) { ringM(0.3, 0.08, M.chip, 0, 0.38, 0, g); cy(0.11, 0.1, M.grey, 0, 0.38, 0, g, "z"); cy(0.05, 0.35, M.metal, 0.5, 0.38, 0, g, "x"); },
  };

  /* The sensors Motion wires to are the Sensor Stack's own devices, built by
     that page's kit — the same models, materials and (for the LiDAR and the
     pallet sensor) the same CAD files — so the two pages can never show two
     different LiDARs. A kind of `sst:<key>` means "that device". The kit is
     made on first use: Edge's rig needs none of it.

     Sensor Stack builds at real size in metres. Next to this rig's stand-ins,
     which are drawn to read at a glance rather than to scale, a 75 mm LiDAR
     would be a speck and a 240 mm keypad a wall — so each is scaled to a set
     display size instead. */
  let sstKit: ReturnType<typeof createSstKit> | null = null;
  const SST_SIZE: Record<DevKey, number> = { access: 0.62, lidar: 0.72, pds: 0.62, rsa: 0.58, bms: 0.72 };
  const sstDevice = (key: DevKey, g: THREE_NS.Group) => {
    sstKit ??= createSstKit(THREE, isMobile);
    const dev = sstKit.DEV[key]();
    const wrap = new THREE.Group();
    wrap.add(dev.group);
    wrap.scale.setScalar(SST_SIZE[key] / Math.max(dev.size.x, dev.size.y, dev.size.z, 1e-6));
    g.add(wrap);
    // The CAD model replaces the build in place when it lands; same group, so
    // the placement and the scale above carry over.
    if (sstKit.hasDevGlb(key)) {
      void sstKit.upgradeInPlace(dev, key, (m) => { m.castShadow = !isMobile; });
    }
  };

  /* The AI Camera is the real one: the CAD model `/hardware/ai-vision` films,
     loaded once and cloned for every camera in every rig. It arrives with its
     own materials; like that page, the powder-coated shell's tight specular
     lobe is broadened so it reads as coating, not gloss, while glass and
     coated optics keep their highlight. The procedural stand-in shows until
     it lands, and stays if it fails. Upright, lens along +z — the rig's own
     convention — so it drops in with no turn. 65 × 86 × 47 mm; shown at a
     display height rather than to scale, like the Sensor Stack devices. */
  const CAM_GLB = "/ai-vision/rams-digital-camera.glb";
  const CAM_HEIGHT = 0.85;
  const OPTIC = /optical_glass|coated_element|lens_inner|status_led/;
  let camSrc: Promise<THREE_NS.Group> | null = null;
  const loadCam = () => {
    camSrc ??= import("three/examples/jsm/loaders/GLTFLoader.js")
      .then(({ GLTFLoader }) => new GLTFLoader().loadAsync(CAM_GLB))
      .then((gltf) => {
        const root = gltf.scene as unknown as THREE_NS.Group;
        root.traverse((o) => {
          const mesh = o as THREE_NS.Mesh;
          if (!mesh.isMesh) return;
          mesh.castShadow = !isMobile;
          (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach((m) => {
            const mm = m as THREE_NS.MeshStandardMaterial;
            if (!mm || OPTIC.test(mm.name || "")) return;
            if (typeof mm.roughness === "number") mm.roughness = Math.max(mm.roughness, 0.4);
            if (mm.name === "anodized_white") {
              mm.roughness = Math.max(mm.roughness, 0.5);
              mm.metalness = Math.min(mm.metalness, 0.12);
            }
          });
        });
        return root;
      });
    // A failed load must not stay cached as a permanent rejection.
    camSrc.catch(() => { camSrc = null; });
    return camSrc;
  };
  const aiCamera = (g: THREE_NS.Group) => {
    const inner = new THREE.Group();
    g.add(inner);
    DEVICE.aicam(inner);
    loadCam().then((src) => {
      const cam = src.clone(true);
      const bb = new THREE.Box3().setFromObject(cam);
      const sz = bb.getSize(V3());
      cam.scale.setScalar(CAM_HEIGHT / Math.max(sz.y, 1e-6));
      cam.updateMatrixWorld(true);
      bb.setFromObject(cam);
      const c = bb.getCenter(V3());
      cam.position.set(-c.x, -bb.min.y, -c.z);
      inner.clear();
      inner.add(cam);
    }).catch(() => { /* the stand-in stays */ });
  };

  type Dir = "in" | "out" | "air";
  type Dev = { kind: string; label: string; desc: string; dir: Dir; a: number; y: number };

  /**
   * Edge, AI and Motion ship with a fixed kit. Core depends entirely on the
   * project, so it has no connections view — and the toggle hides.
   */
  const CONN: Record<string, { r: number; devices: Dev[] }> = {
    edge: {
      r: 2.8,
      devices: [
        { kind: "aicam", label: "AI Camera 1", desc: "Spots a person stepping into its zone.", dir: "in", a: 220, y: 0.95 },
        { kind: "aicam", label: "AI Camera 2", desc: "Watches a second zone, with its own output.", dir: "in", a: 140, y: 0.95 },
        { kind: "robot", label: "Robot or machine", desc: "Output 1 stops it when someone steps in.", dir: "out", a: 285, y: 0 },
        { kind: "beacon", label: "Alarm or door", desc: "Output 2 sounds the alarm or holds the door.", dir: "out", a: 70, y: 0 },
        { kind: "phone", label: "Phone setup", desc: "Over the box’s own Wi-Fi. No site network needed.", dir: "air", a: 0, y: 0.6 },
      ],
    },
    /* AI's kit: two RAMS AI Cameras watching the line or the station, their
       video processed on the box, and a speaker it answers through. Behind it on either side,
       where Edge puts its pair, so neither stands between the viewer and the
       box. */
    ai: {
      r: 2.9,
      devices: [
        { kind: "aicam", label: "AI Camera 1", desc: "Watches the station and streams to the box.", dir: "in", a: 215, y: 0.95 },
        { kind: "aicam", label: "AI Camera 2", desc: "A second angle on the same job, checked on the box.", dir: "in", a: 145, y: 0.95 },
        // The box's own voice: an alert or a spoken warning, on the spot.
        { kind: "speaker", label: "Speaker", desc: "Plays an alert or a spoken warning the moment a camera sees a problem.", dir: "out", a: 95, y: 0 },
      ],
    },
    motion: {
      r: 4,
      /* Eleven, evenly round. The five from the Sensor Stack page — LiDAR,
         Access Control, the pallet sensor, the reverse alarm and the battery
         chip — are its real devices; the rest are this rig's stand-ins. */
      devices: ([
        { kind: "display", label: "Driver displays", desc: "Camera views and warnings in front of the driver.", dir: "out", y: 0.9 },
        { kind: "forkcam", label: "Fork camera", desc: "A clear view of the forks and the load.", dir: "in", y: 0.6 },
        { kind: "impact", label: "Impact sensors", desc: "Two of them. Feel every knock, and how hard.", dir: "in", y: 0 },
        { kind: "sst:bms", label: "Battery chip", desc: "Charge, health and cycles for the truck’s battery.", dir: "in", y: 0.25 },
        { kind: "speed", label: "Speed sensor", desc: "Knows how fast the truck is moving.", dir: "in", y: 0.1 },
        { kind: "sst:pds", label: "Pallet sensor", desc: "Two sensing heads tell a loaded lift from an empty one.", dir: "in", y: 0.4 },
        { kind: "sst:lidar", label: "4D LiDAR", desc: "Sees the space all around in 3D — crashes, speed zones and location.", dir: "in", y: 2.1 },
        { kind: "cam360", label: "360° cameras", desc: "A view all the way around the truck.", dir: "in", y: 1.8 },
        { kind: "sst:rsa", label: "Reverse alarm", desc: "Warns anyone behind the truck as it backs up.", dir: "out", y: 0.9 },
        { kind: "rfid", label: "RFID reader", desc: "Reads tags as the truck works.", dir: "in", y: 0.5 },
        { kind: "sst:access", label: "Access Control", desc: "Card, PIN or fingerprint before the truck will start.", dir: "in", y: 1.1 },
      ] as Omit<Dev, "a">[]).map((d, i, all) => ({ ...d, a: (i * 360) / all.length })),
    },
  };

  const FLOW = { in: 0x0a84ff, out: 0xff6a00, air: 0x0a84ff };
  /* The flow along a cable is a streak of light, not beads. The first version
     ran three coloured spheres down every cable; at this scale they read as
     dots stuck to the wire rather than as a signal moving through it. Each
     cable now carries a sleeve on the same curve — the cable's own width
     (a hair over, only so it wins the depth test; a visibly fatter sleeve
     read as a blue tube laid over the wire), unlit and outside tone mapping
     so the colour stays true — drawn only over a short window that slides
     along it, so it reads as the cable itself lighting up. The sleeve's index buffer runs
     segment by segment, so a window of segments is one `setDrawRange`. */
  const STREAK_SEGS = 96, STREAK_RADIAL = 10, STREAK_LEN = 0.2;
  const STREAK_MAT = {
    in: new THREE.MeshBasicMaterial({ color: FLOW.in, transparent: true, opacity: 0.95, toneMapped: false, depthWrite: false }),
    out: new THREE.MeshBasicMaterial({ color: FLOW.out, transparent: true, opacity: 0.95, toneMapped: false, depthWrite: false }),
    air: new THREE.MeshBasicMaterial({ color: FLOW.air, transparent: true, opacity: 0.9, toneMapped: false, depthWrite: false }),
  };

  const buildConn = (key: string, model: BoxModel) => {
    const spec = CONN[key];
    if (!spec) return null;
    const group = new THREE.Group();
    const devices: { obj: THREE_NS.Group; label: string; desc: string; dir: Dir }[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const links: any[] = [];
    const size = model.size;
    const hb = new THREE.Box3();
    group.visible = false;

    for (const d of spec.devices) {
      const g = new THREE.Group();
      if (d.kind.startsWith("sst:")) sstDevice(d.kind.slice(4) as DevKey, g);
      else if (d.kind === "aicam") aiCamera(g);
      else DEVICE[d.kind](g);
      const a = (d.a || 0) * Math.PI / 180;
      const pos = V3(Math.sin(a) * spec.r, d.y, Math.cos(a) * spec.r);
      g.position.copy(pos);
      g.lookAt(0, pos.y, 0);
      /* Every device faces away from the box, cameras included: a camera
         looks out at the scene, and its cable goes into its back. (For a while
         the cameras were turned in so the faceplate faced the viewer — which
         ran the cable straight into the lens.) */
      g.rotateY(Math.PI);
      g.traverse((o) => {
        const m = o as THREE_NS.Mesh;
        if (m.isMesh) m.castShadow = !isMobile;
      });
      group.add(g);
      g.updateMatrixWorld(true);
      hb.setFromObject(g);

      // The cable leaves the wall that faces the device, drops toward the
      // floor, and rises into it.
      const out = V3(pos.x, 0, pos.z).normalize();
      const reach = Math.min(size.x / 2 / Math.max(Math.abs(out.x), 1e-3), size.z / 2 / Math.max(Math.abs(out.z), 1e-3));
      const p0 = V3(out.x * reach, Math.min(size.y * 0.45, 0.4), out.z * reach);
      const devR = Math.max(hb.max.x - hb.min.x, hb.max.z - hb.min.z) * 0.5;
      const p3 = V3(pos.x, (hb.min.y + hb.max.y) / 2, pos.z).addScaledVector(out, -devR);
      const p1 = p0.clone().addScaledVector(out, 0.8);
      const p2 = p3.clone().addScaledVector(out, -0.7);
      const tube = d.dir !== "air";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let obj: any, count: number;
      if (tube) {
        p1.y = 0.06;
        obj = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CubicBezierCurve3(p0, p1, p2, p3), 48, 0.022, 6, false), MX.cable);
        obj.castShadow = !isMobile;
        count = obj.geometry.index.count;
      } else {
        p1.y = p0.y + 1;
        p2.y = p3.y + 0.5;
      }
      const curve = new THREE.CubicBezierCurve3(p0, p1, p2, p3);
      if (!tube) {
        obj = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(curve.getPoints(60)),
          new THREE.LineDashedMaterial({ color: FLOW.air, dashSize: 0.09, gapSize: 0.07 }),
        );
        obj.computeLineDistances();
        count = 61;
      }
      group.add(obj);
      const streak = new THREE.Mesh(
        new THREE.TubeGeometry(curve, STREAK_SEGS, tube ? 0.0232 : 0.008, STREAK_RADIAL, false),
        STREAK_MAT[d.dir],
      );
      streak.geometry.setDrawRange(0, 0);
      streak.renderOrder = 2;
      group.add(streak);
      devices.push({ obj: g, label: d.label, desc: d.desc, dir: d.dir });
      links.push({ obj, curve, count: count!, tube, dir: d.dir, streak });
    }

    group.updateMatrixWorld(true);
    hb.setFromObject(group);
    const radius = Math.max(-hb.min.x, hb.max.x, -hb.min.z, hb.max.z);
    return { group, devices, links, radius, top: hb.max.y };
  };

  const ss = (t: number) => t * t * (3 - 2 * t);
  const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

  /** Devices scale in, cables draw along their curve, then a streak runs the flow. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const animateConn = (c: any, cp: number, t: number, reduceMotion: boolean) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    c.devices.forEach((d: any, i: number) => {
      d.obj.scale.setScalar(Math.max(0.001, ss(clamp(cp * 1.5 - i * 0.05, 0, 1))));
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    c.links.forEach((l: any, i: number) => {
      const k = ss(clamp(cp * 1.5 - 0.25 - i * 0.05, 0, 1));
      l.obj.geometry.setDrawRange(0, l.tube ? Math.floor((l.count * k) / 6) * 6 : Math.floor(l.count * k));
      // Once the cable has drawn, the streak slides the way the signal goes:
      // into the box for a sensor, out of it for something it drives. Each
      // cable is offset so they do not all pulse in step.
      const seg = STREAK_RADIAL * 6, len = Math.round(STREAK_SEGS * STREAK_LEN);
      if (k < 0.98) { l.streak.geometry.setDrawRange(0, 0); return; }
      const f = reduceMotion ? 0.5 : (t * 0.32 + i * 0.137) % 1;
      let head = Math.round(f * (STREAK_SEGS + len)) - len; // enters and leaves off the ends
      if (l.dir !== "out") head = STREAK_SEGS - len - head;  // box end is the curve's start
      const a = clamp(head, 0, STREAK_SEGS), b = clamp(head + len, 0, STREAK_SEGS);
      l.streak.geometry.setDrawRange(a * seg, Math.max(0, b - a) * seg);
    });
  };

  return { M, PROC, makeHolder, loadHolder, hasGlb: (k: string) => !!GLB[k], explode, setupRenderer, makeScene, CONN, buildConn, animateConn };
}
