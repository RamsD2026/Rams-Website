import type * as THREE_NS from "three";

/**
 * The Omnibox 3D kit — materials, the four procedural boxes, and the
 * connections rig, shared by the hero film and the Inside viewer.
 *
 * ── Why this is a factory, not a module with imports ────────────────
 * `three` is loaded dynamically inside each component's effect, so it never
 * lands in the bundle for the other 40 routes. That means this file cannot
 * `import * as THREE` at the top; it takes the namespace as an argument and
 * returns everything built against it. Both renderers call it once.
 *
 * ── The boxes are stand-ins, and that is the design ─────────────────
 * The reference ships no GLBs — `models/` holds only a README. Each Omnibox is
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
  const LOGO = tex(512, 200, (x, w, h) => {
    x.clearRect(0, 0, w, h);
    x.fillStyle = "#F5F5F7";
    x.font = '800 118px "IBM Plex Sans", Arial, sans-serif';
    x.textBaseline = "alphabetic";
    x.fillText("RAMS", 24, 132);
    x.fillStyle = "#FF6A00";
    x.fillRect(360, 40, 50, 15);
    x.fillRect(395, 40, 15, 50);
  });
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
    logo: new THREE.MeshBasicMaterial({ map: LOGO, transparent: true, depthWrite: false }),
    word: new THREE.MeshBasicMaterial({ map: WORD, transparent: true, depthWrite: false }),
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
        decal(M.logo, 0.5, 0.2, 0.42, 0.052, 0.34, o);
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
        decal(M.logo, 0.5, 0.2, 0.4, 0.062, 0.52, o);
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
        decal(M.logo, 0.6, 0.24, 0.75, 0.072, 0.85, o);
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
      const g = new THREE.Group(), parts: Part[] = [], W = 1.8, H = 0.9, D = 1.4;
      // Core has no spec sheet, so its "enclosure" is a wireframe: the shape is
      // the question, not the answer.
      part(g, parts, "Enclosure", "Sized and sealed for where it will live.", V3(0, 0, 0), (o) => {
        const shell = bx(W, H, D, M.glass, 0, H / 2, 0, o);
        shell.castShadow = false;
        const e = new THREE.LineSegments(
          new THREE.EdgesGeometry(new THREE.BoxGeometry(W, H, D)),
          new THREE.LineBasicMaterial({ color: 0xff6a00 }),
        );
        e.position.y = H / 2;
        o.add(e);
        bx(W, 0.04, D, M.shell, 0, 0.02, 0, o);
      });
      part(g, parts, "Brain of your choice", "Raspberry Pi or NVIDIA Jetson, matched to the job.", V3(-0.35, 1.1, 0), (o) => {
        o.position.set(-0.55, 0.04, 0);
        bx(0.5, 0.36, 0.5, M.shell, 0, 0.18, 0, o);
        bx(0.5, 0.03, 0.5, M.orange, 0, 0.375, 0, o);
      });
      part(g, parts, "The connections you need", "Cameras, sensors, outputs and displays.", V3(0, 1.5, 0), (o) => {
        o.position.set(0.05, 0.04, 0);
        bx(0.45, 0.36, 0.5, M.grey, 0, 0.18, 0, o);
        for (let i = 0; i < 3; i++) bx(0.08, 0.08, 0.02, M.metal, -0.13 + i * 0.13, 0.2, 0.26, o);
      });
      part(g, parts, "Power that fits", "Mains, panel, vehicle or battery.", V3(0.35, 1.1, 0), (o) => {
        o.position.set(0.58, 0.04, 0);
        bx(0.42, 0.36, 0.5, M.grey, 0, 0.18, 0, o);
        bx(0.42, 0.03, 0.5, M.yellow, 0, 0.375, 0, o);
      });
      return { group: g, parts, size: V3(W, H, D) };
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
    lidar(g) { cy(0.34, 0.3, MX.white, 0, 0.15, 0, g); cy(0.35, 0.05, M.shell, 0, 0.32, 0, g); dome(0.28, M.chip, 0, 0.34, 0, g); },
    cam360(g) { cy(0.3, 0.1, MX.white, 0, 0.05, 0, g); dome(0.22, M.chip, 0, 0.1, 0, g); },
    forkcam(g) { bx(0.34, 0.28, 0.3, M.shell, 0, 0.14, 0, g); cy(0.09, 0.08, M.chip, 0, 0.14, 0.18, g, "z"); cy(0.05, 0.02, M.grey, 0, 0.14, 0.225, g, "z"); },
    display(g) { cy(0.05, 0.3, M.grey, 0, 0.15, 0, g); bx(1.0, 0.62, 0.06, M.shell, 0, 0.62, 0, g); bx(0.92, 0.54, 0.01, MX.screen, 0, 0.62, 0.036, g); },
    access(g) { bx(0.42, 0.62, 0.1, M.shell, 0, 0.31, 0, g); bx(0.3, 0.3, 0.01, M.grey, 0, 0.4, 0.056, g); bx(0.12, 0.04, 0.01, MX.green, 0, 0.14, 0.056, g); },
    rfid(g) { bx(0.56, 0.56, 0.07, MX.white, 0, 0.28, 0, g); ringM(0.16, 0.018, M.grey, 0, 0.28, 0.04, g); },
    impact(g) { bx(0.42, 0.16, 0.42, M.yellow, 0, 0.08, 0, g); bx(0.24, 0.03, 0.24, M.shell, 0, 0.175, 0, g); },
    speed(g) { ringM(0.3, 0.08, M.chip, 0, 0.38, 0, g); cy(0.11, 0.1, M.grey, 0, 0.38, 0, g, "z"); cy(0.05, 0.35, M.metal, 0.5, 0.38, 0, g, "x"); },
    weight(g) { bx(0.95, 0.14, 0.26, M.alu, 0, 0.07, 0, g); cy(0.05, 0.15, M.chip, -0.3, 0.075, 0, g); cy(0.05, 0.15, M.chip, 0.3, 0.075, 0, g); },
    reverse(g) { bx(0.5, 0.32, 0.26, M.shell, 0, 0.16, 0, g); bx(0.34, 0.2, 0.01, M.grey, -0.04, 0.16, 0.135, g); cy(0.06, 0.04, MX.amber, 0.18, 0.16, 0.14, g, "z"); },
  };

  type Dir = "in" | "out" | "air";
  type Dev = { kind: string; label: string; desc: string; dir: Dir; a: number; y: number };

  /**
   * Only Edge and Motion ship with a fixed kit. AI and Core depend entirely on
   * the project, so they have no connections view — and the toggle hides.
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
    motion: {
      r: 4,
      devices: [
        { kind: "display", label: "Driver displays", desc: "Camera views and warnings in front of the driver.", dir: "out", a: 0, y: 0.9 },
        { kind: "forkcam", label: "Fork camera", desc: "A clear view of the forks and the load.", dir: "in", a: 36, y: 0.6 },
        { kind: "impact", label: "Impact sensors", desc: "Two of them. Feel every knock, and how hard.", dir: "in", a: 72, y: 0 },
        { kind: "speed", label: "Speed sensor", desc: "Knows how fast the truck is moving.", dir: "in", a: 108, y: 0.1 },
        { kind: "weight", label: "Weight sensor", desc: "Knows what’s on the forks.", dir: "in", a: 144, y: 0 },
        { kind: "lidar", label: "4D LiDAR", desc: "Unitree L2. Sees people and obstacles all around.", dir: "in", a: 180, y: 2.1 },
        { kind: "cam360", label: "360° cameras", desc: "A view all the way around the truck.", dir: "in", a: 216, y: 1.8 },
        { kind: "reverse", label: "Reverse assist", desc: "Helps the driver when backing up.", dir: "out", a: 252, y: 0.9 },
        { kind: "rfid", label: "RFID reader", desc: "Reads tags as the truck works.", dir: "in", a: 288, y: 0.5 },
        { kind: "access", label: "Access controller", desc: "Only authorised drivers can start the truck.", dir: "in", a: 324, y: 1.1 },
      ],
    },
  };

  const FLOW = { in: 0x0a84ff, out: 0xff6a00, air: 0x0a84ff };
  const PULSE_GEO = new THREE.SphereGeometry(0.05, 12, 8);
  const PULSE_MAT = {
    in: new THREE.MeshBasicMaterial({ color: FLOW.in }),
    out: new THREE.MeshBasicMaterial({ color: FLOW.out }),
    air: new THREE.MeshBasicMaterial({ color: FLOW.air }),
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
      DEVICE[d.kind](g);
      const a = (d.a || 0) * Math.PI / 180;
      const pos = V3(Math.sin(a) * spec.r, d.y, Math.cos(a) * spec.r);
      g.position.copy(pos);
      g.lookAt(0, pos.y, 0);
      g.rotateY(Math.PI); // face away from the box
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
      const pulses = [0, 1, 2].map(() => {
        const m = new THREE.Mesh(PULSE_GEO, PULSE_MAT[d.dir]);
        m.visible = false;
        group.add(m);
        return m;
      });
      devices.push({ obj: g, label: d.label, desc: d.desc, dir: d.dir });
      links.push({ obj, curve, count: count!, tube, dir: d.dir, pulses });
    }

    group.updateMatrixWorld(true);
    hb.setFromObject(group);
    const radius = Math.max(-hb.min.x, hb.max.x, -hb.min.z, hb.max.z);
    return { group, devices, links, radius, top: hb.max.y };
  };

  const ss = (t: number) => t * t * (3 - 2 * t);
  const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

  /** Devices scale in, cables draw along their curve, then pulses run the flow. */
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      l.pulses.forEach((p: any, j: number) => {
        p.visible = k > 0.98;
        if (!p.visible) return;
        const f = reduceMotion ? (j + 0.5) / 3 : (t * 0.4 + j / 3) % 1;
        p.position.copy(l.curve.getPointAt(l.dir === "out" ? f : 1 - f));
      });
    });
  };

  return { M, PROC, makeHolder, explode, setupRenderer, makeScene, CONN, buildConn, animateConn };
}
