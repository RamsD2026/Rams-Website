/* ============================================================================
   /hardware/rtls — every word and number on the page, in one React-free module.

   Ported from the Location Intelligence showcase build (`Location Intelligence/`:
   `index.html` + `loc.css` + `stack.js`, with its design note under
   `docs/superpowers/specs/2026-09-16-location-intelligence-design.md`). The
   reference kept its copy inline in the markup and its recommendation engine in
   `stack.js` as a `window.RAMS_STACK` global, shared with the Omnibox page. Both
   are collected here instead: a page whose entire argument is a set of numbers
   wants those numbers in one file, where the honesty constraint below can be
   audited in a single read rather than chased through nine sections.

   ── The honesty constraint ──────────────────────────────────────────
   Its spec is blunt about this and it drives the whole design: only **LiDAR**
   has been run in the field by RAMS, at ±10 mm sensor accuracy, on RAMS 2.0
   trucks. UWB, Bluetooth and Wi-Fi have not been deployed by us. So LiDAR alone
   carries "Running today"; the other three carry "Pilot first", their figures
   are labelled typical industry ranges rather than RAMS measurements, and the
   page sells a one-aisle pilot instead of a building-wide promise.

   **If a technology is later deployed for real, change its `live` and `badge`
   here and move its number from typical to measured.** That is the only edit it
   needs — the badge, the readout, the sandbox, the tech card and the quiz
   result all read this one object.

   ── The four technology colours ─────────────────────────────────────
   `colour` is the technology's identity on the plan: the fixed-kit squares, the
   accuracy circle and the legend dot. LiDAR's is bound to the brand
   `signal-orange`. The other three are the reference's own, kept because the
   brand set carries no second, third or fourth hue that separates four
   technologies at a glance — `hazard-yellow` is the closest spare and it would
   read as a risk state on a page about safety. Same call `hardware-base.css`
   makes for its heat-map ramp: bind what has an equivalent, keep what does not.
   ========================================================================== */

export type TechKey = "lidar" | "uwb" | "ble" | "wifi";

export type Tech = {
  name: string;
  sub: string;
  /** Accuracy in **metres**. The plan draws its circle from this, so the circle
      is the honest size it would be on a real floor — which is the whole point
      of the sandbox. The scale strip and the quiz both sort on it too. */
  acc: number;
  accTxt: string;
  accUnit: string;
  colour: string;
  badge: string;
  live: boolean;
  tags: string;
  infra: string;
  rate: string;
  forTxt: string;
  can: string;
  /** How many fixed units the plan draws around the floor. LiDAR needs none. */
  anchors: 0 | 2 | 3 | 6;
  /** How the fixed kit is drawn: a sweep from the truck itself (LiDAR), ranging
      lines to the truck (UWB), expanding rings (Bluetooth), soft blobs (Wi-Fi). */
  mode: "scan" | "range" | "rings" | "blob";
  infraName: string;
};

export const TECH: Record<TechKey, Tech> = {
  lidar: {
    name: "LiDAR",
    sub: "3D spatial mapping",
    acc: 0.01,
    accTxt: "±10",
    accUnit: "mm",
    colour: "#FF6A00",
    badge: "Running today",
    live: true,
    tags: "None — it sees the world itself",
    infra: "A sensor and an Omnibox on the moving asset",
    rate: "10–20 times a second",
    forTxt: "Shape of the space, obstacles, people as shapes",
    can: "Map the space in 3D and put a pallet exactly where it belongs.",
    anchors: 0,
    mode: "scan",
    infraName: "",
  },
  uwb: {
    name: "UWB",
    sub: "Ultra-wideband precision",
    acc: 0.2,
    accTxt: "10–30",
    accUnit: "cm",
    colour: "#0A84FF",
    badge: "Pilot first",
    live: false,
    tags: "One tag per asset or person",
    infra: "Anchors on the walls, powered and surveyed",
    rate: "10–100 times a second",
    forTxt: "Tight zones, fast movement, knowing which tag",
    can: "Fence a machine to 30 cm and know exactly who crossed.",
    anchors: 6,
    mode: "range",
    infraName: "Anchors",
  },
  ble: {
    name: "Bluetooth",
    sub: "Beacon tracking",
    acc: 3,
    accTxt: "1–5",
    accUnit: "m",
    colour: "#30D158",
    badge: "Pilot first",
    live: false,
    tags: "Cheap tags, years on a battery",
    infra: "Gateways every few aisles",
    rate: "About once a second",
    forTxt: "Thousands of assets, answered by area",
    can: "Find the trolley in the right aisle in seconds.",
    anchors: 3,
    mode: "rings",
    infraName: "Gateways",
  },
  wifi: {
    name: "Wi-Fi",
    sub: "Indoor positioning",
    acc: 10,
    accTxt: "5–15",
    accUnit: "m",
    colour: "#BF5AF2",
    badge: "Pilot first",
    live: false,
    tags: "Often none — phones and handhelds",
    infra: "The access points you already have",
    rate: "Every few seconds",
    forTxt: "Whole-site coverage, zone by zone",
    can: "Know which zone a device is in, across the whole site.",
    anchors: 2,
    mode: "blob",
    infraName: "Access points",
  },
};

/** Tab order, and the order the hero cycles through. */
export const ORDER: TechKey[] = ["lidar", "uwb", "ble", "wifi"];

/** What that accuracy actually buys you, in one line. The hero readout. */
export const BUYS: Record<TechKey, string> = {
  lidar: "Which millimetre on the floor",
  uwb: "Which slot on the rack",
  ble: "Which aisle it is in",
  wifi: "Which zone of the site",
};

/* ── the accuracy scale strip ─────────────────────────────────────── */

/** `left` is that accuracy's log position between 10 mm and 15 m — the same
    mapping `scaleMarkPct` runs for the live marker. Written out rather than
    computed so a label can be nudged without touching the maths. */
export const SCALE_TICKS = [
  { left: 0, b: "10 mm", s: "Which millimetre" },
  { left: 31.5, b: "10 cm", s: "Which slot" },
  { left: 63, b: "1 m", s: "Which rack" },
  { left: 78, b: "3 m", s: "Which aisle" },
  { left: 94.5, b: "10 m", s: "Which zone" },
];

const LOW = Math.log10(0.01);
const HIGH = Math.log10(15);

/** Where the marker sits on the strip, 0–100, log scale from 10 mm to 15 m. */
export function scaleMarkPct(acc: number) {
  const pos = (Math.log10(acc) - LOW) / (HIGH - LOW);
  return Math.max(0, Math.min(1, pos)) * 100;
}

/* ── the stack quiz ───────────────────────────────────────────────── */

export type Opt = { id: string; l: string; s: string };

export const QF: Opt[] = [
  { id: "forklift", l: "Forklifts and MHE", s: "Trucks, reach trucks, tuggers" },
  { id: "people", l: "People on foot", s: "Operators, visitors, contractors" },
  { id: "assets", l: "Trolleys, cages and tools", s: "The things that wander off" },
  { id: "stock", l: "Stock and pallets", s: "What is where, right now" },
  { id: "space", l: "The building itself", s: "A 3D map of racks and aisles" },
];
export const QP: Opt[] = [
  { id: "zone", l: "Which zone it is in", s: "About 10 m" },
  { id: "aisle", l: "Which aisle it is in", s: "About 3 m" },
  { id: "rack", l: "Which rack it is at", s: "About 1 m" },
  { id: "slot", l: "Which slot, or better", s: "30 cm or tighter" },
];
export const QA: Opt[] = [
  { id: "map", l: "Show it on a live map", s: "See it, search it, share it" },
  { id: "warn", l: "Warn someone in the moment", s: "A driver, a pedestrian, a supervisor" },
  { id: "stop", l: "Stop or slow a machine", s: "Act before something happens" },
  { id: "record", l: "Record it for the review", s: "Evidence, trends, dwell time" },
];

export const QUESTIONS: { k: keyof Answers; q: string; opts: Opt[] }[] = [
  { k: "find", q: "What do you need to find?", opts: QF },
  { k: "prec", q: "How precisely do you need to know?", opts: QP },
  { k: "act", q: "What should happen when it knows?", opts: QA },
];

export type Answers = { find: string; prec: string; act: string };

type BoxKey = "motion" | "edge" | "core";
const BOXN: Record<BoxKey, string> = {
  motion: "Omnibox Motion",
  edge: "Omnibox Edge",
  core: "Omnibox Core",
};

/* Written out rather than lower-cased from the labels, which mangled "MHE". */
const FIND_P: Record<string, string> = {
  forklift: "your forklifts and MHE",
  people: "people on foot",
  assets: "trolleys, cages and tools",
  stock: "stock and pallets",
  space: "the building itself",
};
const PREC_P: Record<string, string> = {
  zone: "down to which zone they are in",
  aisle: "down to which aisle they are in",
  rack: "down to which rack they are at",
  slot: "down to which slot, or tighter",
};
const ACT_P: Record<string, string> = {
  map: "see it on a live map",
  warn: "warn someone in the moment",
  stop: "stop or slow a machine",
  record: "record it for the review",
};

const pick = (list: Opt[], id: string) => list.find((o) => o.id === id) ?? null;

export function valid(a: Partial<Answers> | null): a is Answers {
  return Boolean(a && pick(QF, a.find ?? "") && pick(QP, a.prec ?? "") && pick(QA, a.act ?? ""));
}

export type Stack = {
  tech: TechKey;
  T: Tech;
  box: BoxKey;
  boxName: string;
  need: string;
  note: string;
  kit: string[];
  title: string;
  acc: string;
  accNote: string;
  why: string;
};

/**
 * Three answers in, one stack out.
 *
 * The rule worth knowing: **the action sets a floor under the accuracy.** Ask
 * for a machine stop at zone level and you are moved up to about a metre, with
 * `note` saying so in plain words — a stop has to be aimed, and a warning that
 * only says "somewhere in this zone" gets ignored. Everything after that is a
 * lookup, deliberately: the reader can follow it, which is what makes the
 * recommendation worth trusting.
 */
export function compute(a: Answers): Stack {
  const f = a.find;
  const prec = a.prec;
  const act = a.act;
  let need = prec;
  let note = "";

  if (act === "stop" && (prec === "zone" || prec === "aisle")) {
    need = "rack";
    note =
      "A stop has to be aimed, so we moved you up from " +
      (pick(QP, prec)?.l.toLowerCase() ?? prec) +
      " to about a metre.";
  } else if (act === "warn" && prec === "zone") {
    need =
      "aisle";
    note =
      "A warning that only says “somewhere in this zone” gets ignored, so we moved you up to aisle level.";
  }

  let tech: TechKey;
  if (f === "space") tech = "lidar";
  else if (need === "slot") tech = f === "forklift" ? "lidar" : "uwb";
  else if (need === "rack") tech = f === "forklift" || f === "people" ? "uwb" : "ble";
  else if (need === "aisle") tech = "ble";
  else tech = f === "assets" || f === "stock" ? "ble" : "wifi";
  /* A truck that has to warn or stop is the one job LiDAR already does today. */
  if (f === "forklift" && (act === "stop" || act === "warn") && need !== "zone") tech = "lidar";

  const box: BoxKey = f === "forklift" ? "motion" : f === "space" ? "core" : "edge";
  const T = TECH[tech];
  const thing =
    f === "forklift" ? "truck" : f === "people" ? "person" : f === "stock" ? "pallet" : "asset";

  const kit: string[] = [];
  if (tech === "lidar")
    kit.push(f === "space" ? "A LiDAR scanner and a survey rig" : "A 4D LiDAR on each " + thing);
  if (tech === "uwb") {
    kit.push("A UWB tag on each " + thing);
    kit.push("UWB anchors on the walls, surveyed for the area");
  }
  if (tech === "ble") {
    kit.push("A Bluetooth tag on each " + thing);
    kit.push("Gateways every few aisles");
  }
  if (tech === "wifi") kit.push("Your existing access points — usually no tags at all");
  kit.push(BOXN[box] + " on site, doing the working out");
  if (act === "stop") kit.push("Two outputs wired to the machine or the truck");
  if (act === "warn")
    kit.push(f === "forklift" ? "A display in the cab" : "A beacon or stack light where people are");
  kit.push("RAMS Digital Twin for the map, the history and the review");

  const because =
    tech === "lidar"
      ? "LiDAR sees the space itself, so nothing has to be tagged."
      : tech === "uwb"
        ? "UWB is the only one that holds centimetres while things are moving."
        : tech === "ble"
          ? "Bluetooth tags are cheap enough to put on everything, and an aisle is close enough for this job."
          : "Wi-Fi uses the network you already own, which is the cheapest way to cover a whole site.";

  return {
    tech,
    T,
    box,
    boxName: BOXN[box],
    need,
    note,
    kit,
    title: T.name + " + " + BOXN[box],
    acc: T.accTxt + " " + T.accUnit,
    accNote: T.live ? "sensor accuracy, measured" : "typical range, proved in a pilot",
    why:
      "You want to find " +
      FIND_P[f] +
      " " +
      PREC_P[need] +
      ", and then " +
      ACT_P[act] +
      ". " +
      because,
  };
}

/** The plain-text body of the "email me this" mail, written by the page. */
export function summary(a: Answers, s: Stack) {
  return (
    "Recommended stack: " +
    s.title +
    "\n\n" +
    "What we are finding: " +
    (pick(QF, a.find)?.l ?? "") +
    "\n" +
    "How precisely: " +
    (pick(QP, s.need)?.l ?? "") +
    " (" +
    s.acc +
    ")\n" +
    "What happens then: " +
    (pick(QA, a.act)?.l ?? "") +
    "\n\n" +
    "Kit:\n- " +
    s.kit.join("\n- ") +
    "\n\n" +
    (s.T.live
      ? "LiDAR runs at RAMS Digital today."
      : "Pilot first: RAMS prove the accuracy in one aisle before any rollout. The figure above is a typical industry range, not a measurement of your building.") +
    "\n\nBuilt on the RAMS Digital Location Intelligence page.\n"
  );
}

/**
 * Read three answers back out of a URL.
 *
 * Only the three ids ever travel; everything shown is recomputed from them, so
 * a hand-edited link cannot make the page say something it would not have said
 * itself. Read from `window.location.search` in an effect rather than through
 * `useSearchParams()`, which would opt this route out of the static prerender
 * every route on this site keeps.
 */
export function fromQuery(search: string): Answers | null {
  const q = new URLSearchParams(search);
  const a = { find: q.get("find") ?? "", prec: q.get("prec") ?? "", act: q.get("act") ?? "" };
  return valid(a) ? a : null;
}

/**
 * The same three ids, pointed at the Omnibox page and the recommended model.
 *
 * `/hardware/omnibox` opens a model sheet from `#omni-<key>` (see `OmniPage`),
 * so the hash is what does the work here; the query rides along for the day
 * that page shows the stack inside the box it recommends — the reference's
 * `.li-stack` block, which is not ported. See the head of `omnibox.css`.
 */
export function omniboxHref(a: Answers) {
  const q = new URLSearchParams({ find: a.find, prec: a.prec, act: a.act });
  return "/hardware/omnibox?" + q.toString() + "#omni-" + compute(a).box;
}

/* ── page copy ────────────────────────────────────────────────────── */

export const PROBLEMS = [
  {
    n: "01",
    h: "Satellites don’t come indoors",
    p: "Roofs, racking and reinforced concrete block the signal. The moment a truck drives in, it drops off the map.",
  },
  {
    n: "02",
    h: "Events without a place",
    p: "An impact, a near miss, a missing cage. Without a position, the report ends in a guess and nothing changes.",
  },
  {
    n: "03",
    h: "Hunting costs hours",
    p: "People walk the floor looking for trolleys, tools and pallets that were definitely here this morning.",
  },
];

/** The four long-form cards. `key` pulls the name, sub and badge from `TECH`,
    so a technology that goes live changes in one place, not five. */
export const TECH_CARDS: {
  key: TechKey;
  lead: string;
  facts: [string, string][];
  good: string[];
  cost: string[];
}[] = [
  {
    key: "lidar",
    lead: "A laser sensor builds a live 3D picture of the space around it — racks, walls, pallets and people — and works out where it is inside that picture.",
    facts: [
      ["Accuracy", "±10 mm"],
      ["Tags needed", "None"],
      ["Fixed kit", "None on the walls"],
      ["Updates", "10–20 per second"],
    ],
    good: [
      "Seeing the shape of the space, not just a dot on a map",
      "Spotting obstacles and people without anyone carrying a tag",
      "Working in the dark and through changing layouts",
    ],
    cost: [
      "A sensor and compute on every moving asset",
      "Dust, fog and empty featureless halls need care",
      "It sees a shape, not an identity — pair it with tags to know who",
    ],
  },
  {
    key: "uwb",
    lead: "Tags and wall-mounted anchors measure the time a radio pulse takes to travel between them, which gives a precise, fast position for anything carrying a tag.",
    facts: [
      ["Accuracy", "10–30 cm (typical)"],
      ["Tags needed", "One per asset or person"],
      ["Fixed kit", "Anchors, powered and surveyed"],
      ["Updates", "10–100 per second"],
    ],
    good: [
      "Tight zones around machines, to a few centimetres",
      "Knowing exactly which tag crossed the line",
      "Fast movement, where a slow fix would be useless",
    ],
    cost: [
      "Anchors on walls or ceilings, with power and network",
      "A survey, and a re-check when the layout changes",
      "The highest cost per square metre of the four",
    ],
  },
  {
    key: "ble",
    lead: "Small battery tags chirp every few seconds. Gateways around the building hear them and work out roughly where each tag is — cheap enough to put on everything.",
    facts: [
      ["Accuracy", "1–5 m (typical)"],
      ["Tags needed", "Yes, cheap ones"],
      ["Fixed kit", "Gateways every few aisles"],
      ["Updates", "About once a second"],
    ],
    good: [
      "Tracking thousands of trolleys, cages and tools at once",
      "Tags that last years on one battery",
      "Answering “which area is it in?” for very little money",
    ],
    cost: [
      "Accuracy in metres, not centimetres",
      "Signal bounces around steel racking",
      "Tags to fit, register and eventually replace",
    ],
  },
  {
    key: "wifi",
    lead: "Uses the access points you already own. Handhelds, tablets and phones are located from the strength of the signal they see — no new hardware on the asset.",
    facts: [
      ["Accuracy", "5–15 m (typical)"],
      ["Tags needed", "Often none"],
      ["Fixed kit", "Your existing access points"],
      ["Updates", "Every few seconds"],
    ],
    good: [
      "Covering a whole site with kit that is already installed",
      "Devices your team already carries",
      "Zone-level questions: which end of the building, which dock",
    ],
    cost: [
      "The roughest accuracy of the four",
      "A survey that has to be redone when racking moves",
      "It depends on a network that was built for data, not position",
    ],
  },
];

/** Six jobs, each tagged with the technologies that answer it. `live` marks the
    one we run today — the same badge language as everywhere else on the page. */
export const JOBS: { h: string; p: string; tags: { t: string; live?: boolean }[] }[] = [
  {
    h: "Keep people away from moving trucks",
    p: "The truck sees people as shapes and slows, warns or stops — no one has to carry anything.",
    tags: [{ t: "LiDAR", live: true }, { t: "UWB" }],
  },
  {
    h: "Find trolleys, cages and tools",
    p: "Every asset carries a cheap tag, so the search starts with an aisle instead of a walk around the building.",
    tags: [{ t: "Bluetooth" }],
  },
  {
    h: "Prove where an impact happened",
    p: "Every knock lands on the map with the truck, the zone, the shift and the time — ready for the safety review.",
    tags: [{ t: "LiDAR", live: true }, { t: "UWB" }],
  },
  {
    h: "Fence a machine or a hazard zone",
    p: "Draw a boundary to the centimetre and act the moment a tag or a person crosses it.",
    tags: [{ t: "UWB" }, { t: "LiDAR", live: true }],
  },
  {
    h: "See congestion and dwell time",
    p: "Where does the work queue up, which aisle is always blocked, where do trucks wait? Heat maps from data you already generate.",
    tags: [{ t: "Wi-Fi" }, { t: "Bluetooth" }],
  },
  {
    h: "Map the building in 3D",
    p: "A scan of racking, aisles and clearances — for layout changes, automation studies or a digital twin of the floor.",
    tags: [{ t: "LiDAR", live: true }],
  },
];

export const PILOT_GIVES = [
  "A measured accuracy report for your building, not a datasheet figure",
  "A live map of the pilot area, running on site",
  "The real cost of covering the rest of the floor",
  "A clear go or no-go, with the data behind it",
];

export const PILOT_STEPS = [
  {
    b: "Survey",
    s: "We walk the area, measure the racking and the traffic, and agree what “accurate enough” means for your job.",
  },
  {
    b: "Pilot",
    s: "We install the smallest honest setup — one aisle, one cell or one dock — and run it on real shifts.",
  },
  {
    b: "Measure",
    s: "We compare what the system reported against known positions, and write the accuracy down.",
  },
  {
    b: "Roll out",
    s: "If the number holds, we scale to the rest of the floor with costs you have already seen proved.",
  },
];

export const FAQ = [
  {
    q: "Which technology do we need?",
    a: "Start from the job. If you need to know which aisle something is in, Bluetooth or Wi-Fi is enough and much cheaper. If you need to stop a machine when someone crosses a line, you need LiDAR or UWB. Most sites end up with a mix, which is fine — they all land in the same picture.",
  },
  {
    q: "Have you done all four before?",
    a: "LiDAR, yes — it runs on our RAMS 2.0 trucks today and we have mapped real floors with it. UWB, Bluetooth and Wi-Fi we design and install as pilot-first projects: proven parts, proven engineering, but measured in your building before anyone promises a number.",
  },
  {
    q: "Does it need the internet?",
    a: "No. Positions are worked out on site by an Omnibox, and the rules that act on them run there too. The network is only for sending events on to the dashboard, and the box keeps its record when the network drops.",
  },
  {
    q: "Do we have to tag everything?",
    a: "Only for the technologies that work by tags. LiDAR needs none — it sees shapes. Bluetooth and UWB need a tag on each thing you want to follow. Wi-Fi often needs nothing at all if you are following devices your team already carries.",
  },
  {
    q: "Will steel racking break it?",
    a: "It affects every radio technology, which is exactly why we survey and pilot before quoting accuracy. LiDAR is not affected by metal in the same way, though it does need enough features in the space to map against.",
  },
  {
    q: "How long does a pilot take?",
    a: "Usually a few weeks from survey to measured result, depending on how quickly we can get access to the area and how many shifts we need to watch.",
  },
  {
    q: "Is this a safety system?",
    a: "It improves safety, but it is not a certified safety component and does not replace your guarding, interlocks or safety scanners. Treat it as a layer that warns, records and gives you the evidence to act.",
  },
];
