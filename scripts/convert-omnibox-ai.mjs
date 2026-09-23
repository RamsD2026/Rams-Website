// One-off: builds public/omnibox/omnibox-ai.glb from the supplied SolidWorks
// export (jetson_orinb_nano.gltf + data.bin). Its converter packages are not
// site dependencies, so install them without saving before running:
//
//   npm i --no-save @gltf-transform/core @gltf-transform/extensions draco3d meshoptimizer gl-matrix
//   node scripts/convert-omnibox-ai.mjs path/to/jetson_orinb_nano.gltf public/omnibox/omnibox-ai.glb
//
// Jetson Orin Nano enclosure (SolidWorks glTF, Draco) → omnibox-ai.glb in the
// shape omni-3d.ts expects: one top-level node per named part, geometry baked
// into model space, Y-up, centred, span 1, positions + indices only, decimated.
import { NodeIO, Document } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import draco3d from 'draco3d';
import { MeshoptSimplifier } from 'meshoptimizer';
import { mat4, vec3 } from 'gl-matrix';

await MeshoptSimplifier.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'draco3d.decoder': await draco3d.createDecoderModule() });
const src = await io.read(process.argv[2]);
const byName = (n) => src.getRoot().listNodes().find((x) => x.getName() === n);

const ts1 = byName('095-0180-000-TS1_ASM.stp-1');
const PARTS = [
  ['Enclosure', [byName('jetson_base-1')], 1.0],
  ['Lid', [byName('Top part-1')], 0.6],
  ['Cooling', [ts1], 0.35],
  ['Jetson Orin Nano', [byName('P3767_ASM.stp-1')], 0.35, [ts1]],
  ['Carrier board', [byName('600-13768-0000-A04_ASM.stp-1')], 0.12],
  ['NVMe SSD', [byName('NVME-M-2_ASM.stp-1')], 0.3],
  ['Wi-Fi', ['330-0266-000_M2_WIFI_MODULE_ASM.stp-1', 'P3526_WIFI_ANT_LEFT_ASM.stp-1', 'P3526_WIFI_ANT_MODULE_ASM.stp-1'].map(byName), 0.4],
  ['Fasteners', byName('P3766-P3768SKU4-P3767ENVELOPE.stp-1').listChildren().filter((c) => /^155-/.test(c.getName())), 0.4],
];

// Z-up → Y-up: (x, y, z) → (x, z, -y). The ports edge (file −Y) becomes +Z, the front.
const UP = mat4.fromValues(1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1);

const out = [];
for (const [name, nodes, ratio, exclude = []] of PARTS) {
  const P = [], I = [];
  const skip = new Set();
  for (const e of exclude) e.traverse((n) => skip.add(n));
  for (const top of nodes) top.traverse((n) => {
    if (skip.has(n)) return;
    const mesh = n.getMesh();
    if (!mesh) return;
    const M = mat4.multiply(mat4.create(), UP, n.getWorldMatrix());
    for (const prim of mesh.listPrimitives()) {
      if (prim.getMode() !== 4) continue;
      const pos = prim.getAttribute('POSITION');
      const base = P.length / 3, v = [0, 0, 0];
      for (let i = 0; i < pos.getCount(); i++) {
        pos.getElement(i, v);
        const w = vec3.transformMat4(vec3.create(), v, M);
        P.push(w[0], w[1], w[2]);
      }
      const idx = prim.getIndices();
      if (idx) for (let i = 0; i < idx.getCount(); i++) I.push(base + idx.getScalar(i));
      else for (let i = 0; i < pos.getCount(); i++) I.push(base + i);
    }
  });
  out.push({ name, P: new Float32Array(P), I: new Uint32Array(I), ratio });
}

// Centre and scale the whole assembly to a span of 1, like the Edge and Motion GLBs.
const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
for (const { P } of out) for (let i = 0; i < P.length; i += 3) for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], P[i + k]); mx[k] = Math.max(mx[k], P[i + k]); }
const c = mn.map((v, k) => (v + mx[k]) / 2), s = 1 / Math.max(...mx.map((v, k) => v - mn[k]));
for (const { P } of out) for (let i = 0; i < P.length; i += 3) for (let k = 0; k < 3; k++) P[i + k] = (P[i + k] - c[k]) * s;

const doc = new Document();
const buf = doc.createBuffer();
const scene = doc.createScene('OmniBox AI');
let total = 0, before = 0;
for (const part of out) {
  // Weld by quantised position so the simplifier sees connected surfaces.
  const map = new Map(), P2 = [], remap = new Uint32Array(part.P.length / 3);
  for (let i = 0; i < remap.length; i++) {
    const key = [0, 1, 2].map((k) => Math.round(part.P[i * 3 + k] * 2e5)).join(',');
    let j = map.get(key);
    if (j === undefined) { j = P2.length / 3; map.set(key, j); P2.push(part.P[i * 3], part.P[i * 3 + 1], part.P[i * 3 + 2]); }
    remap[i] = j;
  }
  let I = new Uint32Array(part.I.length);
  for (let i = 0; i < I.length; i++) I[i] = remap[part.I[i]];
  // Drop triangles the weld collapsed.
  const keep = [];
  for (let t = 0; t < I.length; t += 3) if (I[t] !== I[t + 1] && I[t + 1] !== I[t + 2] && I[t] !== I[t + 2]) keep.push(I[t], I[t + 1], I[t + 2]);
  I = new Uint32Array(keep);
  const P = new Float32Array(P2);
  before += I.length / 3;
  let target = Math.max(300, Math.floor((I.length / 3) * part.ratio)) * 3;
  let [S] = MeshoptSimplifier.simplify(I, P, 3, Math.min(target, I.length), 2e-3, []);
  if (S.length < 36) S = I;
  // Compact the vertex buffer to what the simplified index list uses.
  const used = new Map(), P3 = [], I3 = new Uint32Array(S.length);
  for (let i = 0; i < S.length; i++) {
    let j = used.get(S[i]);
    if (j === undefined) { j = P3.length / 3; used.set(S[i], j); P3.push(P[S[i] * 3], P[S[i] * 3 + 1], P[S[i] * 3 + 2]); }
    I3[i] = j;
  }
  total += I3.length / 3;
  console.log(part.name.padEnd(18), (I.length / 3).toString().padStart(7), '→', (I3.length / 3).toString().padStart(7));
  const posA = doc.createAccessor().setType('VEC3').setArray(new Float32Array(P3)).setBuffer(buf);
  const idxA = doc.createAccessor().setType('SCALAR').setArray(I3).setBuffer(buf);
  const mat = doc.createMaterial(part.name).setBaseColorFactor([0.01, 0.01, 0.012, 1]).setRoughnessFactor(0.55).setMetallicFactor(0);
  const prim = doc.createPrimitive().setAttribute('POSITION', posA).setIndices(idxA).setMaterial(mat);
  scene.addChild(doc.createNode(part.name).setMesh(doc.createMesh(part.name).addPrimitive(prim)));
}
console.log('total', before, '→', total);
await new NodeIO().write(process.argv[3], doc);
