/* ============================================================================
   /hardware/inspection — every word on the page, in one React-free module.

   Ported from the Guided Inspection showcase build (`Guided Inspection Website/`:
   `index.html` + `site.css` + `inspect.css`, with its design notes under
   `docs/superpowers/specs/`). Same argument for collecting the copy here as
   `omni-data.ts` and `sst-data.ts`: the sections are long and animated, and the
   honesty rules below have to be auditable in one read.

   ── The honesty rules ───────────────────────────────────────────────
   **Both machines are concepts. Neither has run in a customer's building.** The
   reference's spec turns that into five rules the page never breaks, and nor
   does this port:

   1. **No measurement figures anywhere.** No range, no accuracy, no flight
      time, no slab depth. Each sheet ends with "Specification: not published —
      it's a concept, and we won't quote figures we haven't measured", and the
      spec table is headed "What we're building" rather than "Spec".
   2. **A stage badge on every product mention** — cards, sheets, compare
      table, chooser result, film tags — driven by `STAGE` below.
   3. **Standards are named once**, in one FAQ answer, and always as the
      customer's own obligation.
   4. **Radar is never credited with flatness, and the profiler is never
      credited with seeing under the slab.** They answer different questions and
      the copy keeps them apart everywhere, including in the 3D scan labels.
   5. **No scene photograph may show a drone or a robot**, so nothing implies
      the machines already exist.

   If one moves on, change its `stage` and `badge` in `STAGE` — the rails, the
   badges and the chooser all read from it, as they do in the reference.
   ========================================================================== */

export type MachineKey = "airscan" | "floorscan";
export const KEYS: MachineKey[] = ["airscan", "floorscan"];

/** Where each machine has got to. 0 Concept · 1 Prototype · 2 Pilot · 3 Available. */
export const STAGE: Record<MachineKey, { stage: 0 | 1 | 2 | 3; badge: string }> = {
  airscan: { stage: 2, badge: "Pilot" },
  floorscan: { stage: 2, badge: "Pilot" },
};

export const RAIL = ["Concept", "Prototype", "Pilot", "Available"];

/** The five images the reference ships. The seven `where-*` scene photographs
    were never generated, so those tiles render the reference's own
    missing-media treatment carrying the file name that belongs there — the same
    designed state `/hardware/ai-vision` uses. `IMG_WHERE` names them so whoever
    supplies the photography can see what is wanted. */
export const IMG = {
  lineup: "/inspection/gi-lineup.jpg",
  airscan: "/inspection/airscan.jpg",
  airscanHero: "/inspection/airscan-hero.jpg",
  floorscan: "/inspection/floorscan.jpg",
  floorscanHero: "/inspection/floorscan-hero.jpg",
} as const;

export const IMG_WHERE = {
  highbay: "inspection/where-highbay.jpg",
  automation: "inspection/where-automation.jpg",
  count: "inspection/where-count.jpg",
  install: "inspection/where-install.jpg",
  cold: "inspection/where-cold.jpg",
  tpl: "inspection/where-3pl.jpg",
  ageing: "inspection/where-ageing.jpg",
} as const;

export const INFO: Record<MachineKey, { name: string; tag: string }> = {
  airscan: { name: "AirScan", tag: "Drone rack scanning" },
  floorscan: { name: "FloorScan", tag: "Floor-level inspection" },
};

/* ── 02 the problem ──────────────────────────────────────────────── */

/** The six checks that fly in and dock into one marked-up plan. Each names the
    place the answer lives today — a clipboard, a handheld, an email, a PDF. */
export const SIGNALS: { label: string; src: string; x: number; y: number; r: number }[] = [
  { label: "Rack inspection", src: "Clipboard", x: 0.17, y: 0.2, r: -4 },
  { label: "Cycle count, aisle C", src: "Handheld", x: 0.8, y: 0.17, r: 3 },
  { label: "Bent upright reported", src: "Email", x: 0.14, y: 0.72, r: 3 },
  { label: "Stock doesn’t match", src: "WMS", x: 0.47, y: 0.47, r: -2 },
  { label: "Floor survey", src: "Contractor PDF", x: 0.83, y: 0.7, r: -3 },
  { label: "Crack by the dock", src: "Photo", x: 0.5, y: 0.88, r: 2 },
];

export const PROBLEMS: { n: string; h: string; p: string; fix: string }[] = [
  {
    n: "01",
    h: "Inspection is a sample",
    p: "Racking gets walked an aisle at a time, from the ground. Floors get cored in a few places and guessed at in between.",
    fix: "Every bay and every stretch of floor, not a sample.",
  },
  {
    n: "02",
    h: "The top levels go unseen",
    p: "Above head height, labels can’t be read and damage can’t be seen. Checking means a man-up truck, an operator and a closed aisle.",
    fix: "Read from the air, with nobody working at height.",
  },
  {
    n: "03",
    h: "Nobody has seen the slab",
    p: "Reinforcement, cables and voids sit under the surface. The first sign is usually a crack — or a drill hitting something it shouldn’t.",
    fix: "Radar looks underneath before it becomes a repair.",
  },
  {
    n: "04",
    h: "Findings without a place",
    p: "“Damage somewhere in aisle C” starts a search, not a fix. And a report nobody can find the bay for doesn’t get acted on.",
    fix: "Every finding lands on your plan, with a picture.",
  },
];

/* ── 03 the machines ─────────────────────────────────────────────── */

export type MachineCard = {
  key: MachineKey;
  img: string;
  alt: string;
  tag: string;
  lead: [string, string];
  bestFor: string;
  checks: string[];
};

export const MACHINES: MachineCard[] = [
  {
    key: "airscan",
    img: IMG.airscan,
    alt: "AirScan concept model: an inspection drone with four ducted prop guards and its battery stacked on top",
    tag: "↑ Drone rack scanning",
    lead: ["Up the rack face.", "A drone that flies the aisles out of hours and reads every bay, at every level — no reach truck, no cage, nobody at height."],
    bestFor: "Rack audits, stock counts and high-bay racking",
    checks: [
      "Reads location and pallet labels at every level",
      "Checks uprights for plumb, and grades a dent by severity",
      "Finds free space, and bays that don’t match the system",
    ],
  },
  {
    key: "floorscan",
    img: IMG.floorscan,
    alt: "FloorScan concept model: a low floor robot with a radar unit underneath and a LiDAR on top",
    tag: "↓ Floor-level inspection",
    lead: ["Down into the slab.", "A floor robot with ground-penetrating radar that finds the voids and soft ground under your slab, before they become settlement."],
    bestFor: "Voids and settlement, ageing floors and automation readiness",
    checks: [
      "Finds voids and washouts under the slab, ranked worst first",
      "Maps reinforcement, post-tension cables, conduit and drains",
      "Reads flatness, cracks and joint damage along every aisle",
    ],
  },
];

export const FORMULA: { b: string; s: string }[] = [
  { b: "Move", s: "Flies the aisle or drives the floor, on its own." },
  { b: "Sense", s: "Cameras, LiDAR and radar, pointed at what matters." },
  { b: "Locate", s: "Every finding pinned to a bay or a spot on the floor." },
  { b: "Act", s: "A ranked list of what to fix, routed into the workflow that fixes it." },
];

/* ── 04 inside ───────────────────────────────────────────────────── */

/** `ci` is the caption for the taken-apart view, `cc` for the scan view. */
export const INSIDE_CAPS: Record<MachineKey, { h: string; ci: string; cc: string }> = {
  airscan: {
    h: "AirScan",
    ci: "A guard round every prop, a camera on the nose that looks at the rack face, and the brain and battery stacked on one plate.",
    cc: "It climbs the rack face bay by bay. Blue is what it reads — labels, notices, free positions. Orange is what it flags — damage, unsafe loads and stock in the wrong place.",
  },
  floorscan: {
    h: "FloorScan",
    ci: "Ground-penetrating radar underneath, a surface profiler at the front, LiDAR on top to know where it is, and a brain that turns it all into a floor plan.",
    cc: "It drives the aisle while the radar looks down through the slab. Blue is what it reads — reinforcement, conduit, the shape of the floor. Orange is what it flags — cables in the way, cracks, and a void under a rack leg.",
  },
};

/* ── 05 the chooser ──────────────────────────────────────────────── */

export type PlaceId = "racking" | "floor" | "auto" | "slab";

export const PLACES: { id: PlaceId; label: string; sub: string }[] = [
  {
    id: "racking",
    label: "We can't see the top levels",
    sub: "High-bay racking — inspection means a MEWP, an aisle closure and working at height",
  },
  {
    id: "floor",
    label: "Our stock never matches the system",
    sub: "Floor storage and block stacking — counts go stale as soon as they are done",
  },
  {
    id: "auto",
    label: "We're putting automation on a floor we don't know",
    sub: "Robots, AGVs or VNA trucks arriving onto a slab nobody has measured",
  },
  {
    id: "slab",
    label: "The slab is cracking and we don't know why",
    sub: "Repairs, heavy traffic and damage that keeps coming back in the same places",
  },
];

/**
 * What you might want to know, and which machine answers it.
 *
 * `at` is the list of floors the question is *worth asking about*: pick "high-bay
 * racking" and you are not asked whether the floor is flat enough for robots.
 * That filtering is the whole trick — it keeps the second question to four or
 * five relevant options instead of eight, without hiding anything that matters.
 */
export const KNOW: { id: string; m: MachineKey; label: string; get: string; at: PlaceId[] }[] = [
  { id: "count", m: "airscan", label: "A count I can trust", get: "Every bay counted", at: ["racking"] },
  { id: "space", m: "airscan", label: "Where the free space is", get: "Free positions found", at: ["racking"] },
  { id: "damage", m: "airscan", label: "Rack damage", get: "Damage pinned to the bay", at: ["racking"] },
  { id: "evidence", m: "airscan", label: "Evidence for the insurer", get: "Evidence, bay by bay", at: ["racking"] },
  { id: "flat", m: "floorscan", label: "Is the floor flat enough?", get: "Aisles checked for flatness", at: ["auto", "floor"] },
  { id: "drill", m: "floorscan", label: "Where it’s safe to drill", get: "Cables and rebar mapped", at: ["racking", "auto", "slab"] },
  { id: "voids", m: "floorscan", label: "Voids and settlement", get: "Voids under the slab", at: ["slab", "floor", "racking"] },
  { id: "cracks", m: "floorscan", label: "Cracks and joints", get: "Cracks and joints mapped", at: ["slab", "floor", "auto"] },
];

export const WHY: Record<MachineKey, string> = {
  airscan: "AirScan flies the rack face and reads every bay, at every level.",
  floorscan: "FloorScan drives the floor and looks down through the slab for voids and settlement.",
};

/* ── 06 compare ──────────────────────────────────────────────────── */

export const COMPARE_ROWS: { h: string; air: string | true; floor: string | true }[] = [
  { h: "Best for", air: "Rack audits, stock counts and high-bay racking", floor: "Voids and settlement, ageing floors and automation readiness" },
  { h: "Where it looks", air: "Up and down the rack face, at every level", floor: "Along the floor, and down into the slab beneath it" },
  { h: "How it gets there", air: "Flies the aisle", floor: "Drives the floor" },
  {
    h: "What it reads",
    air: "Location and pallet labels, load notices, what’s in each bay",
    floor: "What’s under the slab first, then reinforcement and services, then the surface",
  },
  {
    h: "What it flags",
    air: "Uprights out of plumb, dents graded by severity, stock in the wrong place, free space",
    floor: "Voids and soft ground, settlement, cables in the way, cracks and joints",
  },
  { h: "When it runs", air: "Out of hours, in a quiet building", floor: "Out of hours, in a quiet building" },
  { h: "What you get back", air: "Your rack plan, marked up and ranked", floor: "Your floor plan, marked up and ranked" },
  { h: "Nobody at height", air: true, floor: "—" },
];

/* ── 07 where it's used ──────────────────────────────────────────── */

export const WHERE: { img: string; alt: string; pills: string[]; h: string; p: string; wide?: boolean }[] = [
  {
    img: IMG_WHERE.highbay,
    alt: "Tall pallet racking in a high-bay warehouse aisle",
    pills: ["AirScan"],
    h: "High-bay racking",
    p: "Every level read, without a man-up truck or anyone working at height.",
    wide: true,
  },
  {
    img: IMG_WHERE.automation,
    alt: "Autonomous mobile robots on a warehouse floor",
    pills: ["FloorScan"],
    h: "Before automation arrives",
    p: "Know the floor is ready before the robots are.",
  },
  {
    img: IMG_WHERE.count,
    alt: "Pallet labels on racking at height",
    pills: ["AirScan"],
    h: "Stock counts & audits",
    p: "A count of what’s actually there, not what the system believes.",
  },
  {
    img: IMG_WHERE.install,
    alt: "New racking being anchored to a concrete floor",
    pills: ["FloorScan"],
    h: "New racking & installs",
    p: "Find the cables before the anchors go in.",
  },
  {
    img: IMG_WHERE.cold,
    alt: "A cold store with frosted racking",
    pills: ["AirScan", "FloorScan"],
    h: "Cold stores",
    p: "Fewer hours for people in the cold, and a floor that’s watched.",
  },
  {
    img: IMG_WHERE.tpl,
    alt: "A large third-party logistics warehouse",
    pills: ["AirScan"],
    h: "3PL & shared sites",
    p: "Evidence of what was in every bay, for every client.",
  },
  {
    img: IMG_WHERE.ageing,
    alt: "An older warehouse floor with repaired joints",
    pills: ["FloorScan"],
    h: "Older, busier buildings",
    p: "Settlement and voids found while they’re still cheap to fix.",
    wide: true,
  },
];

/* ── 10 FAQ ──────────────────────────────────────────────────────── */

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Can I buy either of these today?",
    a: "Not yet. Neither has run in a customer’s building. What you can do today is tell us which building and which problem — the racking you can’t see the top of, or the slab you suspect is moving — and we’ll tell you honestly where we are with it. If you need an inspection done this quarter, we’ll say so and point you to a conventional survey.",
  },
  {
    q: "Does AirScan replace our racking inspection?",
    a: "No. Racking inspection regimes — EN 15635 and the SEMA scheme in the UK and Europe, ANSI MH16.1 in the US, and insurer-driven or EN-based requirements across India and the Middle East — put duties on you, including an inspection by a competent person. AirScan is meant to give that person far better evidence, far more often, across the whole building instead of a sample. The obligation stays yours.",
  },
  {
    q: "What does FloorScan’s radar actually see?",
    a: "Ground-penetrating radar picks up changes in material below the surface: reinforcement and how deep it sits, post-tension cables, slab thickness, buried conduit and drains, and voids in the ground underneath. It doesn’t measure flatness — that’s done by the surface profiler at the front. We keep the two apart because they answer different questions.",
  },
  {
    q: "Does the building have to be empty?",
    a: "The plan is to run out of hours, when the building is quiet — it’s simpler, safer and costs you no throughput. Whether a shared-space version makes sense is exactly the kind of thing we’d rather learn from real sites than assume.",
  },
  {
    q: "Will it connect to our WMS?",
    a: "That’s the aim — a count is only useful next to what the system believed. We want findings to land against your own location codes rather than in a separate portal, but nothing is built yet, so treat that as the goal, not a promise.",
  },
  {
    q: "Is this a safety system?",
    a: "No. Neither machine is a certified safety component, and neither replaces your guarding, your racking inspection regime or your structural engineer. They’re there to find things earlier and record them properly, so the people responsible can act sooner.",
  },
  {
    q: "Why show something that isn’t finished?",
    a: "Because we’d rather build these with a few sites than for them. Showing it early is how we find out which findings matter most to you — and if a problem turns out not to be as painful as we think, that’s a useful answer too.",
  },
];

/* ── the sheets ──────────────────────────────────────────────────── */

export type Sheet = {
  key: MachineKey;
  title: string;
  intro: string;
  hero: string;
  heroAlt: string;
  outcomes: { t: string; s: string }[];
  looks: string[];
  ctx: { img: string; alt: string; title: string; body: string };
  /** Headed "What we're building", never "Spec" — and it always ends by saying
      the specification is not published. */
  building: [string, string][];
  ctaLine: string;
  mail: string;
};

export const SHEETS: Sheet[] = [
  {
    key: "airscan",
    title: "Every bay. Every level. Nobody at height.",
    intro:
      "A drone that flies the aisles when the building is quiet, reads the rack face bay by bay, and hands back your rack plan with every problem pinned to it.",
    hero: IMG.airscanHero,
    heroAlt: "AirScan concept model",
    outcomes: [
      { t: "Damage found and graded", s: "Uprights checked for plumb, dents rated by severity, so the worst bay is the first one you fix." },
      { t: "A count you can trust", s: "What’s actually in each location, at every level, next to what the system believes." },
      { t: "An audit that isn’t a day’s work", s: "No reach truck, no cage, no closed aisle, no one working at height — and every bay, not the ones you had time for." },
    ],
    looks: [
      "Uprights out of plumb",
      "Dent severity, graded",
      "Beams, pins & connectors",
      "Location & pallet labels",
      "What’s in each bay",
      "Free positions",
    ],
    ctx: {
      img: IMG_WHERE.highbay,
      alt: "Tall pallet racking in a high-bay aisle",
      title: "Where it’s used",
      body: "High-bay racking, fast-moving distribution centres, cold stores and shared 3PL sites — anywhere the top levels are hard to see and a wrong count is expensive. It runs out of hours, so no aisle has to close and nobody has to go up.",
    },
    building: [
      ["How it moves", "Flies the aisle, with a full guard round every prop for work between racks"],
      ["How it sees", "A camera on the nose, aimed at the rack face"],
      ["How it finds its way", "LiDAR, so it doesn’t depend on GPS indoors"],
      ["When it runs", "Out of hours, in a quiet building"],
      ["What you get", "Your rack plan, marked up and ranked by what to fix first"],
      ["Specification", "Not published — it’s a concept, and we won’t quote figures we haven’t measured"],
    ],
    ctaLine: "Racking you’d like read properly?",
    mail: "mailto:connect@rams.digital?subject=AirScan%20enquiry",
  },
  {
    key: "floorscan",
    title: "The voids under your slab, before they show.",
    intro:
      "A floor robot that drives your aisles with ground-penetrating radar looking down through the slab. It is there first for what is washing out underneath — and it maps the services and the surface on the same pass.",
    hero: IMG.floorscanHero,
    heroAlt: "FloorScan concept model",
    outcomes: [
      { t: "Voids before they’re settlement", s: "Washouts and soft ground under the slab, found and ranked while a repair is still small." },
      { t: "Drill without guessing", s: "Reinforcement, post-tension cables, conduit and drains mapped before anchors go in." },
      { t: "Ready for automation", s: "Which aisles are in tolerance, before the robots or VNA trucks arrive." },
    ],
    looks: [
      "Voids & washouts",
      "Settlement & soft ground",
      "Reinforcement",
      "Post-tension cables",
      "Buried conduit & drains",
      "Flatness, cracks & joints",
    ],
    ctx: {
      img: IMG_WHERE.automation,
      alt: "Autonomous mobile robots on a warehouse floor",
      title: "Where it’s used",
      body: "Before an automation project, before new racking goes in, and in older or busier buildings where the floor has carried more than anyone planned for. The surface and what’s underneath are read separately — radar doesn’t measure flatness, and a profiler can’t see under the slab.",
    },
    building: [
      ["How it moves", "Drives the floor, aisle by aisle"],
      ["Under the surface", "Ground-penetrating radar, looking down through the slab"],
      ["On the surface", "A profiler for flatness, plus cameras for cracks and joints"],
      ["How it finds its way", "LiDAR, so every reading lands on your floor plan"],
      ["What you get", "Your floor plan, marked up and ranked by what to fix first"],
      ["Specification", "Not published — it’s a concept, and we won’t quote figures we haven’t measured"],
    ],
    ctaLine: "A floor you’d like to see underneath?",
    mail: "mailto:connect@rams.digital?subject=FloorScan%20enquiry",
  },
];

export const SHEET_BY_KEY: Record<MachineKey, Sheet> = Object.fromEntries(
  SHEETS.map((s) => [s.key, s]),
) as Record<MachineKey, Sheet>;
