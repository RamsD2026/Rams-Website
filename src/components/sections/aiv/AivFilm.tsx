"use client";

import { useEffect, useRef, useState } from "react";
import type * as THREE_NS from "three";

/**
 * The film — the scroll-driven 3D product sequence that opens the page.
 *
 * A fixed full-viewport canvas renders the camera; a fixed type layer above it
 * cross-fades four chapters; a 520vh empty spacer is the scroll track that
 * drives both. When the track runs out, the document scrolls up over the film
 * and the fixed layers stand down.
 *
 *   p 0.000–0.143  HERO      the unit, still, type left
 *   p 0.143–0.416  DESIGN    orbit in, idle spin, the housing
 *   p 0.416–0.649  POWER+I/O yaw to the port face, three port callouts
 *   p 0.649–1.000  INSIDE    the housing explodes, seven part callouts
 *
 * Ported from the reference build's inline module. This is plain three.js in an
 * effect rather than react-three-fiber on purpose: the original is one
 * imperative timeline reading a single scroll scalar, and every literal in it —
 * easing windows, camera arcs, explode vectors, label fade ranges — was tuned
 * against that structure. Rebuilding it declaratively would have meant
 * re-deriving all of them, with drift as the likely result.
 *
 * ── Two deliberate changes from the reference ───────────────────────
 * 1. **The model loads as a file**, `public/ai-vision/rams-digital-camera.glb`,
 *    not as the 10MB base64 blob in `rams-camera-model.js`. That blob exists so
 *    the reference works when opened straight off disk, where `fetch()` of a
 *    local file is blocked. This is served over HTTP, so the constraint is
 *    gone and the page carries 7.7MB instead of 10MB of base64.
 * 2. **three is imported dynamically**, inside the effect, so neither three nor
 *    GLTFLoader lands in the bundle for any other route.
 *
 * If WebGL2 is missing, the GLB fails, or the load takes longer than 10s, the
 * film calls `onUnavailable()` and the page swaps in the static hero — the
 * reference's own designed fallback, not a degraded state.
 */

const EASE_ST = (t: number) => t * t * (3 - 2 * t);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Chapter boundaries in scroll progress. */
const PH = {
  hero: [0, 0.143],
  mach: [0.143, 0.416],
  ports: [0.416, 0.649],
  expl: [0.649, 1],
} as const;

/** Exploded-view callouts: which part group they hang off, and their offset.
 *  Name only — the spec detail belongs on the spec sheet, not floating over
 *  the model. */
const PART_LABELS = [
  { nm: "Optics", ref: "lens", off: [0.38, 0, 0], flip: false },
  { nm: "Sensor", ref: "sensor", off: [0.34, 0, 0], flip: false },
  { nm: "AI processor", ref: "pcb", off: [-0.5, 0.1, 0], flip: true },
  { nm: "Thermal core", ref: "cool", off: [-0.5, 0.25, 0], flip: true },
  { nm: "Faceplate", ref: "front", off: [0.55, 0.35, 0], flip: false },
  { nm: "Thermal pad", ref: "top", off: [-0.5, 0.15, 0], flip: true },
  { nm: "I/O board", ref: "io", off: [0.42, -0.1, 0], flip: false },
] as const;

/** Port callouts, anchored to bezels resolved out of the GLB. Named for what
 *  each one lets the site do, not for the connector part number. */
const PORT_LABELS = [
  { nm: "Set up on site", key: "usb", off: [0.24, 0, 0] },
  { nm: "Runs on truck or panel power", key: "xt", off: [0.24, 0, 0] },
  { nm: "Serviced in place", key: "svc", off: [0.24, 0, 0] },
] as const;

/** Explode vector per part group, plus any rotation it picks up on the way out. */
const PARTS: [string, [number, number, number], number?, number?][] = [
  ["shell", [0, 0, 0]],
  ["rear", [0, 0, -1.9]],
  ["front", [0, 0, 0.95]],
  ["lens", [0, 0, 1.55]],
  ["optic", [0, 0, 2.15]],
  ["top", [0, 0.62, 0]],
  ["bottom", [0, -0.62, 0]],
  ["sensor", [0, 0, 0.5]],
  ["pcb", [0, 0, -0.85], 0, 0.18],
  ["cool", [0, 0.3, -1.4], -0.12, 0],
  ["io", [1.45, 0, -0.35], 0, -0.22],
];

/** GLB group names that make up each part group. */
const PART_MAP: Record<string, string[]> = {
  shell: ["housing"],
  front: ["front_assembly", "bolts_front"],
  rear: ["rear_assembly"],
  lens: ["lens_module"],
  top: ["top_pad_assembly"],
  sensor: ["image_sensor_board"],
  pcb: ["main_logic_board"],
  cool: ["heat_spreader", "cooling_fan"],
  bottom: ["bottom_pad_assembly"],
  io: ["io_board"],
};

const OPTIC_NODES = ["lens_cover_glass", "lens_element", "lens_front_face", "lens_front_rim"];
const ANCHOR_NODES: Record<string, string> = {
  usb: "usbc_bezel",
  xt: "power_bezel",
  svc: "socket_bezel",
};
const OPTIC_MATS = /optical_glass|coated_element|lens_inner|status_led/;

const DW = 1.0;
const DH = 1.34;
const MODEL_SCALE = 15.5;

export function AivFilm({ onUnavailable }: { onUnavailable: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const spaceRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (failed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let raf = 0;
    const cleanups: (() => void)[] = [];

    const giveUp = () => {
      if (disposed) return;
      setFailed(true);
      onUnavailable();
    };

    // If nothing has rendered after 10s — a slow link, a blocked asset — stop
    // waiting and show the static hero rather than holding the reader behind a
    // loading screen indefinitely. The reference has the same guard.
    const bail = window.setTimeout(giveUp, 10000);
    cleanups.push(() => clearTimeout(bail));

    (async () => {
      const THREE = (await import("three")) as typeof THREE_NS;
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      if (disposed) return;

      const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile =
        matchMedia("(max-width:760px)").matches || /Mobi|Android/i.test(navigator.userAgent);
      const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);

      /* ── renderer ─────────────────────────────────────────── */
      let renderer: THREE_NS.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: false,
          powerPreference: "high-performance",
        });
        if (!renderer.capabilities.isWebGL2) throw new Error("webgl2");
      } catch {
        giveUp();
        return;
      }
      renderer.toneMapping = THREE.NoToneMapping;
      renderer.shadowMap.enabled = !isMobile;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      const DPR = () => Math.min(devicePixelRatio || 1, isMobile ? 1.5 : 1.75);

      const scene = new THREE.Scene();
      // Set in LINEAR HDR, not as a hex: after ACES + gamma an sRGB-clamped
      // colour can never get brighter than ~#E4E4E6, which reads as a grey box
      // against the page. Linear 2.0 lands on the page's #F5F5F7, so film and
      // document meet without a seam.
      scene.background = new THREE.Color().setRGB(2.0, 2.0, 2.06, THREE.LinearSRGBColorSpace);
      const cam = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
      cam.position.set(0, 0.35, 4.6);

      /* ── studio environment ───────────────────────────────── */
      {
        const es = new THREE.Scene();
        const put = (w: number, h: number, c: number, i: number, p: THREE_NS.Vector3) => {
          const m = new THREE.Mesh(
            new THREE.PlaneGeometry(w, h),
            new THREE.MeshBasicMaterial({
              color: new THREE.Color(c).multiplyScalar(i),
              side: THREE.DoubleSide,
            }),
          );
          m.position.copy(p);
          m.lookAt(0, 0, 0);
          es.add(m);
        };
        put(9, 6, 0xffffff, 3.0, V3(1.5, 7, 5)); // key softbox
        put(12, 2.2, 0xff6a00, 0.9, V3(7, 1.6, -5)); // orange rim strip
        put(10, 6, 0xffffff, 1.8, V3(-4, 3, -6)); // neutral rear key
        put(8, 4, 0x2b57ff, 0.45, V3(-8, 2, 1)); // cool fill
        put(6, 2, 0x00ffd1, 0.12, V3(-3, -1, 7)); // hud kiss, faint or the faceplate turns mint
        put(24, 24, 0xdedee2, 1, V3(0, -6, 0)); // floor bounce
        put(30, 30, 0xf2f2f4, 0.75, V3(0, 0, -14)); // back fill
        const pm = new THREE.PMREMGenerator(renderer);
        scene.environment = pm.fromScene(es).texture;
        pm.dispose();
      }
      {
        const key = new THREE.DirectionalLight(0xfff6ec, 1.75);
        key.position.set(3.4, 5.2, 4.8);
        key.castShadow = !isMobile;
        if (!isMobile) {
          key.shadow.mapSize.set(1024, 1024);
          key.shadow.camera.near = 0.5;
          key.shadow.camera.far = 22;
          key.shadow.camera.left = -3;
          key.shadow.camera.right = 3;
          key.shadow.camera.top = 3;
          key.shadow.camera.bottom = -3;
          key.shadow.bias = -0.0015;
          key.shadow.normalBias = 0.02;
        }
        scene.add(key);
        const rim = new THREE.DirectionalLight(0xffe0c2, 1.3);
        rim.position.set(-4.8, 2.2, -5.2);
        scene.add(rim);
        const fill = new THREE.DirectionalLight(0xe4edff, 0.55);
        fill.position.set(-3.6, -0.8, 3.4);
        scene.add(fill);
      }

      /* ── the device ───────────────────────────────────────── */
      const device = new THREE.Group();
      const parts: Record<
        string,
        { g: THREE_NS.Group; base: THREE_NS.Vector3; expl: THREE_NS.Vector3; rx: number; ry: number }
      > = {};
      for (const [name, expl, rx = 0, ry = 0] of PARTS) {
        const g = new THREE.Group();
        device.add(g);
        parts[name] = { g, base: V3(), expl: V3(...expl), rx, ry };
      }

      // Anchors exist from the start at fallback positions, so a port callout
      // never dereferences undefined while the model is still loading.
      const anchors: Record<string, THREE_NS.Object3D> = {};
      for (const [key, y] of [
        ["usb", 0.22],
        ["xt", 0],
        ["svc", -0.22],
      ] as const) {
        const o = new THREE.Object3D();
        o.position.set(DW * 0.5, y, 0.06);
        parts.shell.g.add(o);
        anchors[key] = o;
      }
      let statusLed: THREE_NS.Mesh | null = null;

      const tmpW = V3();
      const buildDevice = (gltf: { scene: THREE_NS.Group }) => {
        const root = gltf.scene;
        root.scale.setScalar(MODEL_SCALE);
        root.updateMatrixWorld(true);

        // Resolve every node BEFORE re-homing: once `housing` moves into the
        // shell group, its subtree (ports, status LED) is unreachable from root.
        const opticNodes = OPTIC_NODES.map((n) => root.getObjectByName(n)).filter(
          Boolean,
        ) as THREE_NS.Object3D[];
        const anchorSrc: Record<string, THREE_NS.Object3D> = {};
        for (const [key, nodeName] of Object.entries(ANCHOR_NODES)) {
          const o = root.getObjectByName(nodeName);
          if (o) anchorSrc[key] = o;
        }
        statusLed = (root.getObjectByName("status_led") as THREE_NS.Mesh) ?? null;

        for (const [name, groups] of Object.entries(PART_MAP)) {
          for (const gname of groups) {
            const o = root.getObjectByName(gname);
            if (o) parts[name].g.attach(o);
          }
        }
        for (const o of opticNodes) parts.optic.g.attach(o);

        const shellG = parts.shell.g;
        shellG.updateMatrixWorld(true);
        for (const [key, src] of Object.entries(anchorSrc)) {
          src.getWorldPosition(tmpW);
          anchors[key].position.copy(shellG.worldToLocal(tmpW));
        }

        // Re-centre each part group on the geometry it owns, so the explode and
        // its label fan out from the part rather than from the model origin.
        const bx = new THREE.Box3();
        const ctr = V3();
        for (const name in parts) {
          const g = parts[name].g;
          if (!g.children.length) continue;
          g.updateMatrixWorld(true);
          bx.setFromObject(g);
          if (!isFinite(bx.min.x)) continue;
          bx.getCenter(ctr);
          g.children.forEach((ch) => ch.position.sub(ctr));
          g.position.copy(ctr);
          parts[name].base.copy(ctr);
        }

        device.traverse((o) => {
          const mesh = o as THREE_NS.Mesh;
          if (!mesh.isMesh) return;
          mesh.castShadow = !isMobile;
          mesh.receiveShadow = !isMobile;
          mesh.frustumCulled = false; // parts fly far outside the model's bounds
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => {
            const mm = m as THREE_NS.MeshStandardMaterial;
            if (!mm) return;
            if ("envMapIntensity" in mm) mm.envMapIntensity = 1.0;
            // Broaden the faceplate's tight specular lobe — it is powder coat,
            // not gloss. Glass and coated optics keep their hotspot.
            if (OPTIC_MATS.test(mm.name || "")) return;
            if (typeof mm.roughness === "number") mm.roughness = Math.max(mm.roughness, 0.4);
            if (mm.name === "anodized_white") {
              if (typeof mm.roughness === "number") mm.roughness = Math.max(mm.roughness, 0.5);
              if (typeof mm.metalness === "number") mm.metalness = Math.min(mm.metalness, 0.12);
            }
            if (mm.name === "stainless_steel" && typeof mm.roughness === "number") {
              mm.roughness = Math.max(mm.roughness, 0.42);
            }
          });
        });
      };

      /* ── contact shadow ───────────────────────────────────── */
      const cvs = (w: number, h: number, fn: (c: CanvasRenderingContext2D, w: number, h: number) => void) => {
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        fn(c.getContext("2d")!, w, h);
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
      };
      const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(3.4, 3.4),
        new THREE.MeshBasicMaterial({
          map: cvs(256, 256, (x, w, h) => {
            const g = x.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2);
            g.addColorStop(0, "rgba(0,0,0,.85)");
            g.addColorStop(1, "rgba(0,0,0,0)");
            x.fillStyle = g;
            x.fillRect(0, 0, w, h);
          }),
          transparent: true,
          depthWrite: false,
        }),
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = -DH / 2 - 0.32;
      shadow.renderOrder = 1;
      (shadow.material as THREE_NS.MeshBasicMaterial).opacity = 0.75;
      device.add(shadow);
      scene.add(device);

      /* ── post: bloom + ACES + a touch of CA, then a wash ──── */
      const vsh = `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`;
      const rtScene = new THREE.WebGLRenderTarget(1, 1, {
        type: THREE.HalfFloatType,
        samples: isMobile ? 0 : 4,
      });
      const rtA = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType });
      const rtB = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType });
      const fsScene = new THREE.Scene();
      const fsCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const fsMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
      fsMesh.frustumCulled = false;
      fsScene.add(fsMesh);

      const bright = new THREE.ShaderMaterial({
        uniforms: { t: { value: null }, uTh: { value: 2.6 } },
        vertexShader: vsh,
        fragmentShader: `uniform sampler2D t;uniform float uTh;varying vec2 vUv;
          void main(){vec3 c=clamp(texture2D(t,vUv).rgb,0.0,16.0);float l=dot(c,vec3(.299,.587,.114));
          float k=smoothstep(uTh,uTh+.5,l);gl_FragColor=vec4(c*k,1.);}`,
      });
      const blur = new THREE.ShaderMaterial({
        uniforms: { t: { value: null }, uDir: { value: new THREE.Vector2() } },
        vertexShader: vsh,
        fragmentShader: `uniform sampler2D t;uniform vec2 uDir;varying vec2 vUv;
          void main(){vec3 s=texture2D(t,vUv).rgb*.227;
          s+=texture2D(t,vUv+uDir*1.384).rgb*.316;s+=texture2D(t,vUv-uDir*1.384).rgb*.316;
          s+=texture2D(t,vUv+uDir*3.230).rgb*.070;s+=texture2D(t,vUv-uDir*3.230).rgb*.070;
          gl_FragColor=vec4(s,1.);}`,
      });
      const finalMat = new THREE.ShaderMaterial({
        uniforms: {
          tS: { value: null },
          tB: { value: null },
          uBloom: { value: 1.0 },
          uExp: { value: 0 },
          uWash: { value: 1 },
        },
        vertexShader: vsh,
        fragmentShader: `uniform sampler2D tS,tB;uniform float uBloom,uExp,uWash;varying vec2 vUv;
          vec3 aces(vec3 x){return clamp(x*(2.51*x+.03)/(x*(2.43*x+.59)+.14),0.,1.);}
          void main(){
            vec2 cc=vUv-.5;float ca=.0011;vec3 c;
            c.r=texture2D(tS,vUv+cc*ca).r;c.g=texture2D(tS,vUv).g;c.b=texture2D(tS,vUv-cc*ca).b;
            c+=texture2D(tB,vUv).rgb*uBloom;
            c*=uExp;
            c=clamp(c,0.0,16.0);   /* a bad MSAA resolve can carry Inf, and aces(Inf) is NaN -> black */
            c=aces(c);
            float vig=smoothstep(.98,.30,length(cc)*1.16);
            c*=mix(.985,1.,vig);
            c=pow(max(c,0.),vec3(1./2.2));
            c=mix(c,vec3(.9608,.9608,.9686),uWash);  /* fade-up washes from the page ground, not black */
            gl_FragColor=vec4(c,1.);
          }`,
      });
      const pass = (mat: THREE_NS.ShaderMaterial, target: THREE_NS.WebGLRenderTarget | null) => {
        fsMesh.material = mat;
        renderer.setRenderTarget(target);
        renderer.render(fsScene, fsCam);
      };

      /* ── state ────────────────────────────────────────────── */
      const state = {
        p: 0,
        pT: 0,
        time: 0,
        idleAng: 0,
        camDrift: 0,
        exp: 0,
        drag: { x: 0, y: 0, tx: 0, ty: 0, on: false, px: 0, py: 0 },
      };
      const exposure = { value: 0 };
      const camPos = V3(0, 0.35, 4.6);
      const camTgt = V3();
      const tmp = V3();
      const aimV = V3();
      const ndc = V3();

      const camRight = (a: number) => aimV.set(Math.cos(a), 0, -Math.sin(a));
      // Push the subject sideways in SCREEN space, so the composition holds at
      // any orbit angle and any aspect ratio.
      const aimShift = (a: number, n: number, r: number) =>
        camRight(a).multiplyScalar((n * r * Math.tan((cam.fov * Math.PI) / 360) * cam.aspect));
      const explPose = (t: number, outPos: THREE_NS.Vector3, outTgt: THREE_NS.Vector3) => {
        const a = lerp(1.22, 0.2, EASE_ST(seg(t, 0, 0.35))) - EASE_ST(seg(t, 0.35, 1)) * 0.6;
        const r = lerp(2.62, 4.5, EASE_ST(seg(t, 0, 0.4)));
        outPos.set(Math.sin(a) * r, lerp(0.02, 0.28, EASE_ST(seg(t, 0, 0.4))), Math.cos(a) * r);
        outTgt.set(0, 0, 0).add(aimShift(a, lerp(-0.3, 0, EASE_ST(seg(t, 0, 0.3))), r));
        outTgt.y += lerp(0, 0.42, EASE_ST(seg(t, 0, 0.3))); // sit low, clear of the INSIDE title
      };

      const secs = Array.from(filmRef.current?.querySelectorAll<HTMLElement>(".sec") ?? []).map(
        (el) => ({ el, a: +(el.dataset.a ?? 0), b: +(el.dataset.b ?? 1) }),
      );

      const maxScroll = () =>
        Math.max(1, (spaceRef.current?.offsetHeight ?? 1) - window.innerHeight);
      const onScroll = () => {
        state.pT = clamp(window.scrollY / maxScroll(), 0, 1);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      cleanups.push(() => window.removeEventListener("scroll", onScroll));

      /* Free orbit by drag, anywhere on the canvas.

         Where the drag goes when you let go depends on the chapter. Through
         HERO, DESIGN and POWER the camera moves are tuned against a known
         device pose, so the offset springs back to zero and the next chapter
         starts from the pose it expects. In INSIDE the pose is the point —
         turning the exploded unit to see a part is the interaction — so it
         stays where you leave it, and only resets if you scroll back up out
         of the chapter. `update()` owns that rule; see the drag block there. */
      const onDown = (e: PointerEvent) => {
        state.drag.on = true;
        state.drag.px = e.clientX;
        state.drag.py = e.clientY;
        canvas.setPointerCapture(e.pointerId);
        canvas.classList.add("grabbing");
      };
      const onMove = (e: PointerEvent) => {
        if (!state.drag.on) return;
        state.drag.tx += (e.clientX - state.drag.px) * 0.007;
        state.drag.ty = clamp(state.drag.ty + (e.clientY - state.drag.py) * 0.005, -1.45, 1.45);
        state.drag.px = e.clientX;
        state.drag.py = e.clientY;
      };
      const endDrag = () => {
        if (!state.drag.on) return;
        state.drag.on = false;
        canvas.classList.remove("grabbing");
      };
      canvas.addEventListener("pointerdown", onDown);
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerup", endDrag);
      canvas.addEventListener("pointercancel", endDrag);
      cleanups.push(() => {
        canvas.removeEventListener("pointerdown", onDown);
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerup", endDrag);
        canvas.removeEventListener("pointercancel", endDrag);
      });

      /* ── load ─────────────────────────────────────────────── */
      //
      // There is no loading gate. The reference held the whole page behind a
      // full-screen logo-and-progress-bar overlay with `body` scroll locked
      // until the 7.7MB GLB had parsed, which is a long blank wait on a
      // marketing page and blocks reading copy that is already there.
      //
      // Nothing is needed in its place. The hero type is ordinary DOM and
      // paints immediately, and the film's final pass washes to the page ground
      // (#F5F5F7) while `uExp` is 0 — so the canvas starts as a flat panel the
      // same colour as the page, indistinguishable from it, and the camera
      // simply fades up over 1.5s once the model is ready.
      await new Promise<void>((resolve) => {
        new GLTFLoader().load(
          "/ai-vision/rams-digital-camera.glb",
          (gltf) => {
            try {
              buildDevice(gltf as unknown as { scene: THREE_NS.Group });
            } catch (e) {
              console.error("RAMS: buildDevice failed —", e);
            }
            resolve();
          },
          undefined,
          (err) => {
            console.error("RAMS: camera model failed to load —", err);
            resolve();
          },
        );
      });
      if (disposed) return;

      clearTimeout(bail);
      if (reduceMotion) {
        exposure.value = 1;
      } else {
        const t0 = performance.now();
        const ramp = () => {
          const k = clamp((performance.now() - t0) / 1500, 0, 1);
          exposure.value = EASE_ST(k);
          if (k < 1 && !disposed) requestAnimationFrame(ramp);
        };
        ramp();
      }

      /* ── per-frame ────────────────────────────────────────── */
      const place = (el: HTMLElement | null, world: THREE_NS.Vector3, extraOp = 1) => {
        if (!el) return;
        ndc.copy(world).project(cam);
        const off = ndc.z > 1 ? 0 : 1;
        const x = (ndc.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-ndc.y * 0.5 + 0.5) * window.innerHeight;
        el.style.transform = el.classList.contains("flip")
          ? `translate(${(x - 14).toFixed(1)}px,${y.toFixed(1)}px) translate(-100%,-50%)`
          : `translate(${(x + 14).toFixed(1)}px,${y.toFixed(1)}px) translate(0,-50%)`;
        el.style.opacity = (off * extraOp).toFixed(3);
      };

      let lastFilmOp = -1;
      let filmVisible = true;

      const update = (dt: number) => {
        state.p += (state.pT - state.p) * Math.min(1, dt * (reduceMotion ? 20 : 4.2));
        const p = state.p;
        state.time += dt;
        const tPor = seg(p, PH.ports[0], PH.ports[1]);
        const tExp = seg(p, PH.expl[0], PH.expl[1]);

        /* camera path */
        if (p < PH.mach[1]) {
          // The move completes early in DESIGN and then holds, so the type
          // never lands on the unit.
          const t = EASE_ST(seg(p, 0.039, 0.27));
          state.camDrift +=
            dt * 0.012 * (1 - t * 0.5) * EASE_ST(seg(p, PH.hero[1], PH.hero[1] + 0.065));
          const a = -0.28 + t * 0.83 + state.camDrift;
          // Wide: type left, unit right. Narrow: the unit pulls back and rides
          // high above the type.
          const narrow = window.innerWidth < 900;
          const r = lerp(narrow ? 7.4 : 4.5, 3.15, t);
          const y = lerp(0.42, 0.14, t);
          camPos.set(Math.sin(a) * r, y, Math.cos(a) * r);
          camTgt
            .set(0, lerp(narrow ? -1.15 : 0.03, -0.03, t), 0)
            .add(aimShift(a, lerp(narrow ? 0 : -0.32, narrow ? 0 : 0.3, t), r));
        } else if (p < PH.ports[1]) {
          const t = EASE_ST(seg(tPor, 0, 0.45));
          const a = lerp(0.55, 1.22, t);
          const r = lerp(3.15, 2.62, t);
          camPos.set(Math.sin(a) * r, lerp(0.14, 0.04, t), Math.cos(a) * r);
          camTgt.set(0, 0, 0).add(aimShift(a, lerp(0.3, -0.3, t), r));
        } else {
          explPose(tExp, camPos, camTgt);
        }
        cam.position.lerp(camPos, Math.min(1, dt * 5));
        cam.lookAt(camTgt);

        /* device */
        // Outside the exploded chapter a released drag returns to zero; inside
        // it, the pose you left is kept.
        if (!state.drag.on && p < PH.expl[0]) {
          state.drag.tx = 0;
          state.drag.ty = 0;
        }
        // Following the pointer is quick; the spring home is slower, so the
        // return reads as the model settling rather than snapping.
        const follow = Math.min(1, dt * (state.drag.on ? 7 : 3.2));
        state.drag.x += (state.drag.tx - state.drag.x) * follow;
        state.drag.y += (state.drag.ty - state.drag.y) * follow;
        const selfMove = EASE_ST(seg(p, PH.hero[1], PH.hero[1] + 0.065));
        if (selfMove < 0.001) {
          /* Back in the hero chapter, so unwind the idle spin.
             `idleAng` only ever accumulated, which meant scrolling up to the
             top showed the camera at whatever yaw it had drifted to rather
             than the angle the page opens on — the hero is a composed shot and
             it has to be the same shot every time you return to it.

             Wrapped into (-pi, pi] before easing, or a long spin would unwind
             through several visible turns on the way back to zero. */
          const TAU = Math.PI * 2;
          state.idleAng = ((state.idleAng + Math.PI) % TAU + TAU) % TAU - Math.PI;
          state.idleAng += (0 - state.idleAng) * Math.min(1, dt * 2.4);
        } else {
          state.idleAng += dt * 0.1 * selfMove;
        }
        // The idle spin eases out approaching POWER rather than snapping to
        // zero on the boundary.
        const idleK = 1 - EASE_ST(seg(p, PH.mach[1] - 0.06, PH.mach[1]));
        const portYaw =
          -0.35 * EASE_ST(tPor) * (1 - EASE_ST(seg(p, PH.expl[0], PH.expl[0] + 0.104)));
        /* The pose the page opens on. Square-on, the unit reads as a white
           rectangle with a lens in it — the side that says what it *is* (the
           fin stack, the ports, the status light) is hidden. Turning it far
           enough to show that flank costs nothing and makes the silhouette
           legible immediately.

           Negative, for the same reason `portYaw` is: it brings the port face
           toward the viewer. It eases out as `selfMove` ramps up, handing the
           model to the DESIGN chapter's own orbit rather than fighting it. */
        const heroYaw = -0.46 * (1 - selfMove);
        const bob = p < PH.mach[1] ? 1 : 0;
        device.rotation.y =
          state.idleAng * idleK + state.drag.x + portYaw + heroYaw +
          Math.sin(state.time * 0.5) * 0.03 * selfMove * bob;
        device.rotation.x = state.drag.y + Math.sin(state.time * 0.33) * 0.02 * selfMove * bob;
        device.position.y = Math.sin(state.time * 0.8) * 0.035 * selfMove * bob;

        /* exploded view — staged out, then back together at the very end */
        const e = EASE_ST(seg(p, 0.696, 0.844)) * (1 - EASE_ST(seg(p, 0.914, 0.977)));
        state.exp = e;
        for (const k in parts) {
          const pt = parts[k];
          pt.g.position.copy(pt.base).addScaledVector(pt.expl, e);
          if (pt.rx) pt.g.rotation.x = pt.rx * e;
          if (pt.ry) pt.g.rotation.y = pt.ry * e;
        }
        if (statusLed) {
          const m = statusLed.material as THREE_NS.MeshStandardMaterial;
          if (m && m.emissive) {
            m.emissive.setHex(0xff6a00);
            m.emissiveIntensity =
              (p < PH.hero[1] ? 0.85 : 0.45) * (1.2 + 1.6 * Math.abs(Math.sin(state.time * 2.2)));
          }
        }

        /* callouts */
        const plOp = EASE_ST(seg(p, 0.748, 0.805)) * (1 - EASE_ST(seg(p, 0.904, 0.956)));
        PART_LABELS.forEach((pl, i) => {
          const el = labelRefs.current[i];
          if (plOp <= 0.01) {
            if (el) el.style.opacity = "0";
            return;
          }
          parts[pl.ref].g.getWorldPosition(tmp);
          tmp.add(V3(...pl.off));
          place(el, tmp, plOp * EASE_ST(seg(state.exp, 0.45 + i * 0.08, 0.72 + i * 0.08)));
        });
        const ioOp =
          EASE_ST(seg(tPor, 0.28, 0.45)) * (1 - EASE_ST(seg(p, PH.ports[1] - 0.031, PH.ports[1])));
        PORT_LABELS.forEach((pl, i) => {
          const el = labelRefs.current[PART_LABELS.length + i];
          if (ioOp <= 0.01) {
            if (el) el.style.opacity = "0";
            return;
          }
          anchors[pl.key].getWorldPosition(tmp);
          tmp.add(V3(...pl.off));
          place(el, tmp, ioOp * EASE_ST(seg(tPor, 0.3 + i * 0.07, 0.48 + i * 0.07)));
        });


        finalMat.uniforms.uExp.value = exposure.value;
        finalMat.uniforms.uWash.value = clamp(1 - exposure.value, 0, 1);

        /* chapter type */
        for (const s of secs) {
          const f = 0.05;
          const o =
            (s.a === 0 ? 1 : EASE_ST(seg(p, s.a, s.a + f))) * (1 - EASE_ST(seg(p, s.b - f, s.b)));
          s.el.style.opacity = o.toFixed(3);
          s.el.style.transform = `translateY(${((1 - o) * 14).toFixed(1)}px)`;
          s.el.style.visibility = o < 0.005 ? "hidden" : "visible";
        }

        // The film hands off to the document: once the page covers it, stand
        // the fixed layers down so they cost nothing.
        const past = Math.max(0, (window.scrollY - maxScroll()) / Math.max(1, window.innerHeight * 0.6));
        const filmOp = 1 - Math.min(1, past);
        if (Math.abs(filmOp - lastFilmOp) > 0.004) {
          lastFilmOp = filmOp;
          const hide = filmOp < 0.01 ? "hidden" : "visible";
          for (const el of [filmRef.current, tagsRef.current, canvas]) {
            if (!el) continue;
            el.style.opacity = filmOp.toFixed(3);
            el.style.visibility = hide;
          }
        }
        filmVisible = filmOp >= 0.01;
      };

      const renderFrame = () => {
        renderer.setRenderTarget(rtScene);
        renderer.render(scene, cam);
        bright.uniforms.t.value = rtScene.texture;
        pass(bright, rtA);
        const tx = 1 / rtA.width;
        const ty = 1 / rtA.height;
        for (let i = 0; i < 2; i++) {
          blur.uniforms.t.value = rtA.texture;
          blur.uniforms.uDir.value.set(tx * (1 + i), 0);
          pass(blur, rtB);
          blur.uniforms.t.value = rtB.texture;
          blur.uniforms.uDir.value.set(0, ty * (1 + i));
          pass(blur, rtA);
        }
        finalMat.uniforms.tS.value = rtScene.texture;
        finalMat.uniforms.tB.value = rtA.texture;
        pass(finalMat, null);
      };

      const resize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight, false);
        renderer.setPixelRatio(DPR());
        cam.aspect = window.innerWidth / window.innerHeight;
        cam.updateProjectionMatrix();
        const w = (window.innerWidth * DPR()) | 0;
        const h = (window.innerHeight * DPR()) | 0;
        rtScene.setSize(w, h);
        rtA.setSize(w >> 1, h >> 1);
        rtB.setSize(w >> 1, h >> 1);
      };
      window.addEventListener("resize", resize);
      cleanups.push(() => window.removeEventListener("resize", resize));
      resize();

      let last = performance.now();
      const tick = (t: number) => {
        raf = requestAnimationFrame(tick);
        const dt = Math.min(0.05, (t - last) / 1000);
        last = t;
        update(dt);
        // Nothing to draw under an opaque page — leave the GPU alone.
        if (filmVisible) renderFrame();
      };
      raf = requestAnimationFrame(tick);

      cleanups.push(() => {
        rtScene.dispose();
        rtA.dispose();
        rtB.dispose();
        scene.traverse((o) => {
          const m = o as THREE_NS.Mesh;
          if (!m.isMesh) return;
          m.geometry?.dispose();
          const mats = Array.isArray(m.material) ? m.material : [m.material];
          mats.forEach((x) => x?.dispose());
        });
        renderer.dispose();
      });
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
    };
  }, [failed, onUnavailable]);

  if (failed) return null;

  return (
    <>
      <canvas ref={canvasRef} className="hw-gl" aria-hidden />

      <div className="film" ref={filmRef}>
        <section className="sec hero" data-a="0" data-b="0.143">
          <div className="heroblock">
            <p className="kicker">RAMS Digital</p>
            <h1>AI Camera</h1>
            <p className="tag">
              Industrial vision. <b>Human intelligence.</b>
            </p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#contact">
                Book an assessment
              </a>
              <a className="btn btn-secondary" href="#use-cases">
                Explore use cases
              </a>
            </div>
            <p className="hero-support">
              On-device AI <span aria-hidden>·</span> Event-based evidence{" "}
              <span aria-hidden>·</span> Works with what you already run
            </p>
          </div>
          <div className="scrollcue" aria-hidden>
            Scroll<i />
          </div>
        </section>

        <section className="sec right" data-a="0.215" data-b="0.40">
          <span className="label">Where it goes</span>
          <h2>
            Mounted at the
            <br />
            point of risk.
          </h2>
          <p className="lead">
            On the truck, on the cell, above the doorway or over a hazard zone. The mounting
            position, the field of view and the rules are agreed during the site survey, so the
            camera watches the place where something actually goes wrong.
          </p>
          <div className="chips">
            <span>On the truck</span>
            <span>On the cell</span>
            <span>Above the doorway</span>
            <span>Over the hazard zone</span>
          </div>
        </section>

        <section className="sec left" data-a="0.48" data-b="0.64">
          <span className="label">What it decides</span>
          <h2>
            Intelligence
            <br />
            at the edge.
          </h2>
          <p className="lead">
            The picture is read on the device, so detection keeps working when the network
            doesn&rsquo;t. What you get back is the event that matters, with its time and zone, not
            hours of footage to review. It runs off the truck battery or a panel supply, and is set
            up on site.
          </p>
          <div className="chips">
            <span>Decides on the device</span>
            <span>Keeps working offline</span>
            <span>Events, not footage</span>
            <span>Rules set for your site</span>
          </div>
        </section>

        <section className="sec top" data-a="0.665" data-b="1.08">
          <span className="label">Inside</span>
          <h2>
            Everything it needs.
            <br />
            Nothing it doesn’t.
          </h2>
        </section>
      </div>

      <div className="hw-tags" ref={tagsRef} aria-hidden>
        {[...PART_LABELS, ...PORT_LABELS].map((l, i) => (
          <div
            key={l.nm}
            ref={(el) => {
              labelRefs.current[i] = el;
            }}
            className={"plabel" + ("flip" in l && l.flip ? " flip" : "")}
          >
            <div className="in">
              <div className="nm">{l.nm}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="hw-scrollspace" ref={spaceRef} aria-hidden />
    </>
  );
}
