import type * as THREE_NS from "three";

/* ============================================================================
   /homepage — the warehouse the film is set in.

   One building, 70 × 50 m, drawn dark so the data drawn over it can glow:

     · rack pairs back to back, running east–west, broken by a cross-aisle;
     · a main traffic lane in front of them, a staging area, and a dock of
       seven doors with trailers backed on;
     · MHEs on their own routes — forklifts, a reach truck, a pallet truck —
       and people on foot;
     · one floor overlay that carries the trails the trucks leave and the
       heatmaps built from them.

   All procedural. The forklifts here are stand-ins: `HomeFilm` swaps them for
   the CAD truck the hardware pages use once it has loaded. Racking and pallets are `InstancedMesh` because density is the
   effect — a sparse shed looks nothing like a warehouse.

   World units are metres; y is up; the dock is the south wall (+z).
   ========================================================================== */

/* ── layout ──────────────────────────────────────────────────────────── */

export const HALL = { x0: -35, x1: 35, z0: -25, z1: 25 };
/** Rack pairs (back to back), by centre z. Each is two 1.1 m rows and a flue. */
export const PAIRS = [-17, -11, -5, 1];
/** The two blocks each pair is split into, either side of the cross-aisle: [start x, bays]. */
export const BLOCKS: [number, number][] = [
  [-27.3, 9],
  [2.4, 9],
];
export const BAY = 2.7;
export const LEVELS = [0.12, 1.62, 3.12, 4.62];
export const RACK_H = 6;
/** Lane and aisle centrelines. */
export const LANE = { main: 5.5, back: -21, cross: -0.3, eastEnd: 29.5, westEnd: -30.8 };
export const DOORS = [-24, -16, -8, 0, 8, 16, 24];

export type MheKind = "forklift" | "reach" | "pallet";
export type Route = { kind: MheKind; pts: [number, number][]; speed: number; phase: number; name: string };

/**
 * Where every truck drives: rounded rectangles on the lanes and aisles, so no
 * route passes through racking. The first is the one the safety chapter
 * follows — it runs the main lane eastbound, past the walkway crossing.
 */
export const ROUTES: Route[] = [
  { name: "FLT 03", kind: "forklift", pts: [[LANE.westEnd, LANE.main], [LANE.eastEnd, LANE.main], [LANE.eastEnd, -8], [LANE.westEnd, -8]], speed: 2.8, phase: 0.05 },
  { name: "FLT 07", kind: "forklift", pts: [[LANE.eastEnd, -14], [LANE.westEnd, -14], [LANE.westEnd, LANE.back], [LANE.eastEnd, LANE.back]], speed: 2.5, phase: 0.4 },
  { name: "FLT 11", kind: "forklift", pts: [[-24, 18.5], [24, 18.5], [24, 11], [-24, 11]], speed: 2.6, phase: 0.2 },
  { name: "RT 02", kind: "reach", pts: [[LANE.cross - 0.6, -2], [LANE.westEnd, -2], [LANE.westEnd, 8.4], [LANE.cross - 0.6, 8.4]], speed: 2.1, phase: 0.6 },
  { name: "FLT 14", kind: "forklift", pts: [[LANE.cross + 0.6, -2], [LANE.eastEnd, -2], [LANE.eastEnd, 8.8], [LANE.cross + 0.6, 8.8]], speed: 2.4, phase: 0.75 },
  { name: "PT 05", kind: "pallet", pts: [[-12, 21.8], [12, 21.8], [12, 13.2], [-12, 13.2]], speed: 1.5, phase: 0.1 },
];

/** The chapter-3 walkway, over the main lane at the cross-aisle. */
export const CROSSING = { x: LANE.cross, z0: 2.6, z1: 9.4 };
/** The charging bay, west of the staging area. */
export const CHARGE = { x: -32.4, z0: 11, z1: 19 };

export function createHomeKit(THREE: typeof THREE_NS, isMobile: boolean) {
  const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
  const std = (color: number, o: THREE_NS.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.7 }, o));

  const M = {
    wall: std(0x1c1f25, { roughness: 0.9 }),
    column: std(0x262a31),
    upright: std(0x39404c, { roughness: 0.55, metalness: 0.3 }),
    beam: std(0x4c5361, { roughness: 0.5, metalness: 0.3 }),
    pallet: std(0x6d5537),
    carton: std(0x7a6548),
    trailer: std(0x2a2e35),
    yellow: std(0xe0a800, { roughness: 0.55 }),
    yellowDark: std(0x9c7600, { roughness: 0.6 }),
    dark: std(0x1a1b1f, { roughness: 0.6 }),
    steel: std(0x80858e, { roughness: 0.35, metalness: 0.8 }),
    tyre: std(0x0d0e10, { roughness: 0.9 }),
    person: std(0xc9ccd2),
    vest: std(0xff6a00, { roughness: 0.6 }),
  };

  /* ── the floor's painted markings ── */
  const floorTex = (() => {
    const W = isMobile ? 1024 : 2048, H = Math.round((W * 50) / 70);
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const x = c.getContext("2d")!;
    const X = (m: number) => ((m - HALL.x0) / 70) * W, Z = (m: number) => ((m - HALL.z0) / 50) * H, S = (m: number) => (m / 70) * W;
    x.fillStyle = "#15171b";
    x.fillRect(0, 0, W, H);
    // A faint slab grid.
    x.strokeStyle = "rgba(255,255,255,.035)";
    x.lineWidth = 1;
    for (let m = HALL.x0; m <= HALL.x1; m += 5) {
      x.beginPath();
      x.moveTo(X(m), 0);
      x.lineTo(X(m), H);
      x.stroke();
    }
    for (let m = HALL.z0; m <= HALL.z1; m += 5) {
      x.beginPath();
      x.moveTo(0, Z(m));
      x.lineTo(W, Z(m));
      x.stroke();
    }
    // Lane edge lines along the main lane and the staging area.
    x.strokeStyle = "rgba(242,178,0,.28)";
    x.lineWidth = S(0.1);
    x.setLineDash([S(1.2), S(0.8)]);
    for (const z of [2.6, 9.6, 10.2, 20.4]) {
      x.beginPath();
      x.moveTo(X(HALL.x0 + 2), Z(z));
      x.lineTo(X(HALL.x1 - 2), Z(z));
      x.stroke();
    }
    x.setLineDash([]);
    // The walkway at the crossing: zebra hatching.
    x.fillStyle = "rgba(255,255,255,.1)";
    for (let z = CROSSING.z0; z < CROSSING.z1; z += 0.9) x.fillRect(X(CROSSING.x - 1.4), Z(z), S(2.8), S(0.45));
    // Staging boxes in front of each dock door.
    x.strokeStyle = "rgba(255,255,255,.12)";
    x.lineWidth = S(0.08);
    for (const d of DOORS) x.strokeRect(X(d - 2.2), Z(21.4), S(4.4), S(3.2));
    // The charging bay.
    x.strokeStyle = "rgba(48,209,88,.35)";
    x.strokeRect(X(CHARGE.x - 2), Z(CHARGE.z0), S(4), S(CHARGE.z1 - CHARGE.z0));
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  })();

  /* ── the building ── */
  const buildHall = (scene: THREE_NS.Scene) => {
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(70, 50), new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.92 }));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = !isMobile;
    scene.add(floor);
    // Low walls on every side, a gap per dock door, and columns.
    const wallH = 1.4;
    const wall = (w: number, d: number, x: number, z: number) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, wallH, d), M.wall);
      m.position.set(x, wallH / 2, z);
      scene.add(m);
    };
    wall(70, 0.3, 0, HALL.z0);
    wall(0.3, 50, HALL.x0, 0);
    wall(0.3, 50, HALL.x1, 0);
    for (let i = 0; i <= DOORS.length; i++) {
      const a = i === 0 ? HALL.x0 : DOORS[i - 1] + 1.9, b = i === DOORS.length ? HALL.x1 : DOORS[i] - 1.9;
      if (b > a) wall(b - a, 0.3, (a + b) / 2, HALL.z1);
    }
    const cols = new THREE.InstancedMesh(new THREE.BoxGeometry(0.45, 7.5, 0.45), M.column, 32);
    const d = new THREE.Object3D();
    let n = 0;
    for (let x = HALL.x0; x <= HALL.x1 + 0.1; x += 10) {
      for (const z of [HALL.z0, HALL.z1]) {
        d.position.set(x, 3.75, z);
        d.updateMatrix();
        cols.setMatrixAt(n++, d.matrix);
      }
    }
    cols.count = n;
    scene.add(cols);
    // Trailers backed on to four of the doors.
    for (const dx of [-24, -8, 8, 24]) {
      const tr = new THREE.Mesh(new THREE.BoxGeometry(2.6, 3.9, 13), M.trailer);
      tr.position.set(dx, 2.35, HALL.z1 + 7);
      tr.castShadow = !isMobile;
      scene.add(tr);
    }
  };

  /* ── the racking: uprights, beams and pallets, all instanced ── */
  type Slot = { x: number; y: number; z: number; row: number; bay: number; level: number; filled: boolean };
  const slots: Slot[] = [];
  /** Bays of the row nearest the main lane — the face the drone inspects. */
  const inspectBays: { x0: number; x1: number }[] = [];
  /** That row's z, and the z of its front face. */
  const FRONT_ROW_Z = PAIRS[PAIRS.length - 1] + 0.6;

  const buildRacks = (scene: THREE_NS.Scene) => {
    const rows: number[] = [];
    for (const zc of PAIRS) rows.push(zc - 0.6, zc + 0.6);
    const d = new THREE.Object3D();
    const ups = new THREE.InstancedMesh(new THREE.BoxGeometry(0.1, RACK_H, 0.1), M.upright, rows.length * BLOCKS.length * 10 * 2);
    const beams = new THREE.InstancedMesh(new THREE.BoxGeometry(BAY, 0.12, 0.08), M.beam, rows.length * BLOCKS.length * 9 * LEVELS.length * 2);
    let u = 0, b = 0;
    rows.forEach((rz, ri) => {
      for (const [x0, bays] of BLOCKS) {
        for (let i = 0; i <= bays; i++) {
          for (const dz of [-0.5, 0.5]) {
            d.position.set(x0 + i * BAY, RACK_H / 2, rz + dz);
            d.updateMatrix();
            ups.setMatrixAt(u++, d.matrix);
          }
        }
        for (let i = 0; i < bays; i++) {
          for (let l = 0; l < LEVELS.length; l++) {
            if (l > 0) {
              for (const dz of [-0.5, 0.5]) {
                d.position.set(x0 + (i + 0.5) * BAY, LEVELS[l] - 0.06, rz + dz);
                d.updateMatrix();
                beams.setMatrixAt(b++, d.matrix);
              }
            }
            for (let s = 0; s < 2; s++) {
              slots.push({
                x: x0 + i * BAY + 0.72 + s * 1.26,
                y: LEVELS[l],
                z: rz,
                row: ri,
                bay: i,
                level: l,
                // Deterministic, so the inventory chapter shows the same floor on every load.
                filled: (ri * 131 + i * 17 + l * 7 + s * 3 + (x0 > 0 ? 5 : 0)) % 10 > 1,
              });
            }
          }
          if (ri === rows.length - 1) inspectBays.push({ x0: x0 + i * BAY, x1: x0 + (i + 1) * BAY });
        }
      }
    });
    ups.count = u;
    beams.count = b;
    ups.castShadow = beams.castShadow = !isMobile;
    scene.add(ups, beams);

    // Pallets and their loads. The load's instance colour carries the inventory states.
    const filled = slots.filter((s) => s.filled);
    const pal = new THREE.InstancedMesh(new THREE.BoxGeometry(1.1, 0.14, 1.0), M.pallet, filled.length);
    const load = new THREE.InstancedMesh(new THREE.BoxGeometry(1.0, 1.0, 0.92), new THREE.MeshStandardMaterial({ roughness: 0.8 }), filled.length);
    // Muted, so the racking reads as the building and the data drawn over it glows.
    const base = new THREE.Color(0x6f5b40), alt = new THREE.Color(0x857054);
    filled.forEach((s, i) => {
      d.scale.set(1, 1, 1);
      d.position.set(s.x, s.y + 0.07, s.z);
      d.updateMatrix();
      pal.setMatrixAt(i, d.matrix);
      const h = 0.75 + (((i * 37) % 10) / 10) * 0.35;
      d.position.set(s.x, s.y + 0.14 + h / 2, s.z);
      d.scale.set(1, h, 1);
      d.updateMatrix();
      load.setMatrixAt(i, d.matrix);
      load.setColorAt(i, i % 3 ? base : alt);
    });
    pal.castShadow = load.castShadow = !isMobile;
    scene.add(pal, load);
    return { load, filled, base, alt };
  };

  /* ── MHEs, built from boxes: they are a few dozen pixels tall from here ── */
  const box = (w: number, h: number, dd: number, m: THREE_NS.Material, x: number, y: number, z: number, p: THREE_NS.Object3D) => {
    const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, dd), m);
    o.position.set(x, y, z);
    o.castShadow = !isMobile;
    p.add(o);
    return o;
  };
  const wheel = (x: number, z: number, r: number, p: THREE_NS.Object3D) => {
    const o = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.22, 16), M.tyre);
    o.rotation.z = Math.PI / 2;
    o.position.set(x, r, z);
    p.add(o);
  };
  /** Forward is −z. Returns the truck, and its load to show or hide. */
  const makeMhe = (kind: MheKind) => {
    const g = new THREE.Group();
    const loadG = new THREE.Group();
    g.add(loadG);
    if (kind === "pallet") {
      box(0.7, 0.9, 0.6, M.yellow, 0, 0.55, 0.55, g);
      box(0.06, 1.1, 0.06, M.dark, 0, 1.1, 0.95, g);
      for (const x of [-0.2, 0.2]) box(0.16, 0.08, 1.2, M.steel, x, 0.1, -0.35, g);
      wheel(0, 0.6, 0.14, g);
      box(1.1, 0.14, 1.0, M.pallet, 0, 0.2, -0.35, loadG);
      box(1.0, 0.9, 0.92, M.carton, 0, 0.72, -0.35, loadG);
      return { g, loadG, h: 1.8 };
    }
    const reach = kind === "reach";
    const w = reach ? 1.0 : 1.15;
    box(w, 0.9, 1.5, M.yellow, 0, 0.75, 0.35, g); // body
    box(w, 0.8, 0.45, M.yellowDark, 0, 0.7, 1.15, g); // counterweight
    box(0.5, 0.35, 0.45, M.dark, 0, 1.35, 0.55, g); // seat
    for (const [x, z] of [[-w / 2 + 0.06, -0.25], [w / 2 - 0.06, -0.25], [-w / 2 + 0.06, 1.05], [w / 2 - 0.06, 1.05]]) box(0.06, 1.3, 0.06, M.dark, x, 1.85, z, g);
    box(w, 0.06, 1.4, M.dark, 0, 2.5, 0.4, g); // overhead guard
    const mastH = reach ? 3.6 : 2.7;
    for (const x of [-0.32, 0.32]) box(0.1, mastH, 0.12, M.dark, x, mastH / 2, -0.5, g);
    for (const x of [-0.22, 0.22]) box(0.12, 0.06, 1.1, M.steel, x, 0.2, -1.1, g); // forks
    for (const [x, z, r] of [[-w / 2, -0.2, 0.3], [w / 2, -0.2, 0.3], [-w / 2, 1.0, 0.24], [w / 2, 1.0, 0.24]] as const) wheel(x, z, r, g);
    box(1.1, 0.14, 1.0, M.pallet, 0, 0.3, -1.15, loadG);
    box(1.0, 0.9, 0.92, M.carton, 0, 0.82, -1.15, loadG);
    return { g, loadG, h: 2.6 };
  };

  /** A person on foot: grey, with an orange hi-vis vest. */
  const makePerson = () => {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 1.0, 4, 10), M.person);
    body.position.y = 0.9;
    const vest = new THREE.Mesh(new THREE.CylinderGeometry(0.235, 0.235, 0.45, 12), M.vest);
    vest.position.y = 1.15;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10), M.person);
    head.position.y = 1.65;
    g.add(body, vest, head);
    g.traverse((o) => ((o as THREE_NS.Mesh).castShadow = !isMobile));
    return g;
  };

  /**
   * A closed route with rounded corners: for each corner, a quarter-turn from
   * `r` before it to `r` after it, and a straight to the next corner. Arc
   * length parameterised, so `getPointAt(u)` moves at an even speed.
   */
  const routePath = (pts: [number, number][], r = 2) => {
    const P = pts.map(([x, z]) => V3(x, 0, z));
    const n = P.length;
    const into = (i: number) => P[i].clone().add(P[(i - 1 + n) % n].clone().sub(P[i]).setLength(r));
    const out = (i: number) => P[i].clone().add(P[(i + 1) % n].clone().sub(P[i]).setLength(r));
    const cp = new THREE.CurvePath<THREE_NS.Vector3>();
    for (let i = 0; i < n; i++) {
      cp.add(new THREE.QuadraticBezierCurve3(into(i), P[i], out(i)));
      cp.add(new THREE.LineCurve3(out(i), into((i + 1) % n)));
    }
    return cp;
  };

  /* ── the floor overlay: trails, and the heatmaps built from them ── */
  const makeOverlay = (scene: THREE_NS.Scene) => {
    const TW = isMobile ? 700 : 1400, TH = Math.round((TW * 50) / 70);
    const tc = document.createElement("canvas");
    tc.width = TW;
    tc.height = TH;
    const tx = tc.getContext("2d")!;
    const trailTex = new THREE.CanvasTexture(tc);
    trailTex.colorSpace = THREE.SRGBColorSpace;

    // Heat: a coarse grid, 0.5 m cells on desktop, accumulated from truck positions.
    const GW = isMobile ? 70 : 140, GH = Math.round((GW * 50) / 70);
    const heat = new Float32Array(GW * GH), near = new Float32Array(GW * GH);
    const heatData = new Uint8Array(GW * GH * 4);
    const heatTex = new THREE.DataTexture(heatData, GW, GH, THREE.RGBAFormat);
    heatTex.magFilter = heatTex.minFilter = THREE.LinearFilter;
    heatTex.needsUpdate = true;

    const toTX = (x: number) => ((x - HALL.x0) / 70) * TW, toTZ = (z: number) => ((z - HALL.z0) / 50) * TH;
    const stamp = (grid: Float32Array, x: number, z: number, r: number, amt: number) => {
      const cx = ((x - HALL.x0) / 70) * GW, cz = ((z - HALL.z0) / 50) * GH, rc = (r / 70) * GW;
      for (let j = Math.floor(cz - rc); j <= Math.ceil(cz + rc); j++) {
        for (let i = Math.floor(cx - rc); i <= Math.ceil(cx + rc); i++) {
          if (i < 0 || j < 0 || i >= GW || j >= GH) continue;
          const d2 = ((i - cx) ** 2 + (j - cz) ** 2) / (rc * rc);
          if (d2 < 1) grid[j * GW + i] += amt * Math.exp(-d2 * 3);
        }
      }
    };
    let which: "heat" | "near" = "heat";
    const upload = () => {
      const g = which === "heat" ? heat : near;
      let max = 1e-6;
      for (let i = 0; i < g.length; i++) if (g[i] > max) max = g[i];
      for (let i = 0; i < g.length; i++) {
        const v = Math.min(1, g[i] / max);
        heatData[i * 4] = heatData[i * 4 + 1] = heatData[i * 4 + 2] = 255;
        heatData[i * 4 + 3] = Math.round(Math.pow(v, 0.55) * 255);
      }
      heatTex.needsUpdate = true;
    };

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      uniforms: {
        uTrail: { value: trailTex },
        uHeat: { value: heatTex },
        uTrailOp: { value: 0 },
        uHeatOp: { value: 0 },
      },
      vertexShader: "varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
      // The heat ramp is the site's orange, deep to bright — its one accent, as
      // `AGENTS.md` asks — rather than a rainbow.
      fragmentShader: `uniform sampler2D uTrail,uHeat;uniform float uTrailOp,uHeatOp;varying vec2 vUv;
        vec3 ramp(float t){vec3 a=vec3(.35,.07,0.),b=vec3(1.,.42,0.),c=vec3(1.,.75,.45),d=vec3(1.,.96,.88);
          return t<.4?mix(a,b,t/.4):t<.75?mix(b,c,(t-.4)/.35):mix(c,d,(t-.75)/.25);}
        void main(){vec2 uv=vec2(vUv.x,1.-vUv.y);
          vec4 tr=texture2D(uTrail,uv);float h=texture2D(uHeat,uv).a;
          vec3 col=tr.rgb*uTrailOp;float a=tr.a*uTrailOp;
          vec3 hc=ramp(h);float ha=smoothstep(.02,.4,h)*.95*uHeatOp;
          col=mix(col,hc,ha);a=max(a,ha);
          gl_FragColor=vec4(col,a);}`,
    });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(70, 50), mat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0.03;
    plane.renderOrder = 2;
    scene.add(plane);

    return {
      mat,
      /** Paint one truck's move into the trails, and add it to the traffic heat. */
      paint(ax: number, az: number, bx: number, bz: number) {
        tx.strokeStyle = "rgba(255,122,26,0.9)";
        tx.lineWidth = isMobile ? 1.4 : 2.4;
        tx.lineCap = "round";
        tx.beginPath();
        tx.moveTo(toTX(ax), toTZ(az));
        tx.lineTo(toTX(bx), toTZ(bz));
        tx.stroke();
        stamp(heat, bx, bz, 2.2, 0.02);
      },
      /** Trails fade slowly, so the floor shows the last minute or so of work. */
      fade(amt: number) {
        tx.globalCompositeOperation = "destination-out";
        tx.fillStyle = `rgba(0,0,0,${amt})`;
        tx.fillRect(0, 0, TW, TH);
        tx.globalCompositeOperation = "source-over";
        trailTex.needsUpdate = true;
      },
      flush() {
        trailTex.needsUpdate = true;
      },
      nearMiss(x: number, z: number, amt = 1) {
        stamp(near, x, z, 3.2, amt);
      },
      show(w: "heat" | "near") {
        if (w === which) return;
        which = w;
        upload();
      },
      upload,
    };
  };

  return { M, V3, buildHall, buildRacks, makeMhe, makePerson, routePath, makeOverlay, slots, inspectBays, FRONT_ROW_Z };
}

export type HomeKit = ReturnType<typeof createHomeKit>;
