/**
 * The content of /hardware/omnibox, carried across from the Omnibox showcase
 * build without rewriting.
 *
 * Its spec sets three content rules, and they are why the copy reads the way it
 * does. Keep them:
 *
 *   · **No figure appears that isn't in the sources.** Edge is a Raspberry Pi 5
 *     with two relay outputs and ~0.2s typical response; AI and Motion are an
 *     NVIDIA Jetson Orin Nano Super at 67 TOPS; Motion is 240 × 240 × 101 mm
 *     with 4 USB, a LiDAR port, 2 impact junctions and 9 powered outputs. Core
 *     has no spec sheet at all, so it is shown as a process. Unknowns are left
 *     out, never estimated.
 *   · **Plain words.** "Stops the robot", not "volt-free changeover contact".
 *     The audience is warehouse staff and managers, not controls engineers.
 *   · **Never a certified safety component**, and it never replaces guarding.
 *     The FAQ says so outright; that answer is load-bearing.
 */

export const IMG = {
  lineup: "/omnibox/omnibox-lineup.jpg",
  edge: "/omnibox/omnibox-edge.jpg",
  ai: "/omnibox/omnibox-ai.jpg",
  motion: "/omnibox/omnibox-motion.jpg",
  core: "/omnibox/omnibox-core.jpg",
  edgeHero: "/omnibox/omnibox-edge-hero.jpg",
  aiHero: "/omnibox/omnibox-ai-hero.jpg",
  motionHero: "/omnibox/omnibox-motion-hero.jpg",
  coreHero: "/omnibox/omnibox-core-hero.jpg",
  motionTruck: "/omnibox/omnibox-motion-truck.jpg",
  insideEdge: "/omnibox/inside-edge.jpg",
  insideAi: "/omnibox/inside-ai.jpg",
  insideMotion: "/omnibox/inside-motion.jpg",
  insideCore: "/omnibox/inside-core.jpg",
  whereForklift: "/omnibox/where-forklift.jpg",
  whereDock: "/omnibox/where-dock.jpg",
  whereCustom: "/omnibox/where-custom.jpg",
  interlock: "/omnibox/interlock.jpg",
  weld: "/omnibox/weld.jpg",
  ppe: "/omnibox/ppe.jpg",
  counting: "/omnibox/counting.jpg",
  tooling: "/omnibox/tooling.jpg",
} as const;

export type ModelKey = "edge" | "ai" | "motion" | "core";
export const ORDER: ModelKey[] = ["edge", "ai", "motion", "core"];

/* ── problem ─────────────────────────────────────────────────────── */

/** The six signals that converge into one decision in the fuse animation. */
export const SIGNALS: { label: string; src: string; x: number; y: number; r: number }[] = [
  { label: "Impact detected", src: "Impact sensor", x: 0.17, y: 0.2, r: -4 },
  { label: "Person nearby", src: "Camera", x: 0.8, y: 0.17, r: 3 },
  { label: "Forklift 14", src: "Fleet list", x: 0.14, y: 0.72, r: 3 },
  { label: "Zone B, Dock 3", src: "Site map", x: 0.47, y: 0.47, r: -2 },
  { label: "Badge 0412, Shift 2", src: "Access control", x: 0.83, y: 0.7, r: -3 },
  { label: "2 knocks this month", src: "History", x: 0.5, y: 0.88, r: 2 },
];

export const PROBLEMS: { n: string; h: string; p: string; fix: string }[] = [
  {
    n: "01",
    h: "Latency at the moment that matters",
    p: "When someone steps in front of a moving truck or into a robot cell, there’s no time to ask a server far away and wait for the answer.",
    fix: "Omnibox decides on the spot.",
  },
  {
    n: "02",
    h: "Signals without context",
    p: "An impact alert on its own is just a number. Knowing which truck, which zone, which driver and what happened before makes it something you can act on.",
    fix: "Every event arrives with the where, the who and the history.",
  },
  {
    n: "03",
    h: "Networks are not always dependable",
    p: "Wi-Fi drops at the far end of the aisle and out in the yard. Safety can’t drop with it.",
    fix: "Keeps deciding offline, and catches up when the network is back.",
  },
  {
    n: "04",
    h: "Different devices, separate systems",
    p: "Cameras, sensors, machines and trucks often come from different suppliers, each with its own screen and its own data.",
    fix: "One box connects them. One RAMS platform brings them together.",
  },
];

export const PROBLEM_STATS: { v: string; unit: string; h: string; p: string }[] = [
  { v: "<0.5", unit: "s", h: "From noticing to acting", p: "Fast enough to matter when someone steps into the wrong place." },
  { v: "0", unit: "cloud", h: "Needed to decide", p: "It keeps working when the network doesn’t." },
  { v: "24", unit: "/7", h: "Every shift", p: "Including the ones nobody is supervising." },
];

/* ── the family ──────────────────────────────────────────────────── */

export type Model = {
  key: ModelKey;
  tag: string;
  name: string;
  short: string;
  lineTitle: string;
  line: string;
  bestFor: string;
  img: string;
  checks: string[];
  /** Sheet. */
  sheet: {
    hero: string;
    title: string;
    intro: string;
    outcomes: { t: string; s: string }[];
    connects?: string[];
    /** Used instead of `connects` where the model is about checks, not ports. */
    pills?: { heading: string; items: string[] };
    steps?: { b: string; s: string }[];
    ctx?: { img: string; alt: string; light?: boolean; title: string; body: string };
    specs?: [string, string][];
    ctaLine: string;
    mail: string;
  };
};

export const MODELS: Model[] = [
  {
    key: "edge",
    tag: "Edge · Raspberry Pi",
    name: "Omnibox Edge",
    short: "Edge",
    lineTitle: "Process AI cameras.",
    line: "Compact compute that sits beside your RAMS AI Cameras.",
    bestFor: "Safety with the RAMS AI Camera",
    img: IMG.edge,
    checks: [
      "Stops a robot or sounds an alarm in about a fifth of a second",
      "No internet needed — set up from a phone at the machine",
      "Remembers its settings and events through a power cut",
    ],
    sheet: {
      hero: IMG.edgeHero,
      title: "The brain beside your AI Cameras.",
      intro:
        "The RAMS AI Camera sees a person step into a robot cell. Omnibox Edge is what stops the robot — and writes down that it happened.",
      outcomes: [
        { t: "A robot that stops when someone steps in", s: "In about a fifth of a second, typically." },
        { t: "A record of every entry", s: "Kept on the box, even through a power cut, and ready to export." },
        { t: "No IT project", s: "No plant network or internet. Set up from a phone, right at the machine." },
      ],
      connects: [
        "RAMS AI Cameras",
        "The robot or machine’s stop circuit",
        "Alarms and beacons",
        "A phone or laptop, for setup",
      ],
      ctx: {
        img: IMG.interlock,
        alt: "A worker entering a marked zone in a robot cell",
        title: "Where it’s used",
        body: "Robotic cells, doorways, press lines and any zone where a camera should be able to stop something, not just record it. Each camera gets its own output, so a person at one station holds that station and nothing else.",
      },
      specs: [
        ["Brain", "Raspberry Pi 5"],
        ["AI", "Runs on the connected RAMS AI Cameras"],
        ["Outputs", "Two relay outputs, one per camera, kept separate"],
        ["Response", "About 0.2 s typical, 0.4 s at most"],
        ["Setup", "Over the box’s own Wi-Fi — no site network needed"],
        ["Power cut", "Settings and event record are kept"],
      ],
      ctaLine: "See what’s inside, or talk to us about your cell.",
      mail: "mailto:connect@rams.digital?subject=Omnibox%20Edge",
    },
  },
  {
    key: "ai",
    tag: "AI · 67 TOPS",
    name: "Omnibox AI",
    short: "AI",
    lineTitle: "Run custom models.",
    line: "Dedicated NVIDIA Jetson AI power for your own checks.",
    bestFor: "Inspection, counting and quality",
    img: IMG.ai,
    checks: [
      "Runs AI models trained for your line and your parts",
      "67 TOPS of AI power on board, from NVIDIA",
      "Acts on the result — stop, reject, alert, record",
    ],
    sheet: {
      hero: IMG.aiHero,
      title: "Your own AI, running on site.",
      intro:
        "Every line has checks that only it needs. Omnibox AI runs a model trained on your parts and your process — and does something with the answer.",
      outcomes: [
        { t: "Defects caught at the station", s: "Not at inspection, and not at the customer." },
        { t: "Counts you can trust", s: "Every part, every shift, without a clipboard." },
        { t: "One box, many checks", s: "Welds, clamps, parts and PPE, on the same hardware." },
      ],
      pills: {
        heading: "What it can check",
        items: [
          "Weld present",
          "Part count",
          "Right part, right way round",
          "Clamp closed",
          "Tool in place",
          "PPE worn",
          "Object left behind",
        ],
      },
      ctx: {
        img: IMG.weld,
        alt: "Four welds passed and one flagged as missing",
        title: "Trained for your line",
        body: "RAMS Digital trains and deploys the model with you, using images from your own station. When the check fails, Omnibox AI can stop the line, reject the part, light an alarm or simply record it.",
      },
      specs: [
        ["Brain", "NVIDIA Jetson Orin Nano Super"],
        ["AI power", "67 TOPS on board"],
        ["Models", "Custom, trained and deployed by RAMS Digital"],
        ["Actions", "Signals to machines, alarms and alerts"],
        ["Internet", "Not needed to run"],
      ],
      ctaLine: "Got a check you’d love to automate?",
      mail: "mailto:connect@rams.digital?subject=Omnibox%20AI",
    },
  },
  {
    key: "motion",
    tag: "Motion · RAMS 2.0",
    name: "Omnibox Motion",
    short: "Motion",
    lineTitle: "Connect the MHE.",
    line: "The complete intelligence box for a forklift.",
    bestFor: "Forklift fleets, with RAMS 2.0",
    img: IMG.motion,
    checks: [
      "Powers every camera and sensor on the truck",
      "Sees people, feels impacts, knows the load",
      "Built-in backup power and cooling",
    ],
    sheet: {
      hero: IMG.motionHero,
      title: "Everything a smart forklift needs, in one box.",
      intro:
        "RAMS 2.0 turns a forklift into a truck that sees people, feels impacts and knows its load. Omnibox Motion is the box at the centre of it all.",
      outcomes: [
        { t: "Drivers warned in time", s: "Cameras and LiDAR watch all around the truck." },
        { t: "Every impact and load on record", s: "Who, where, when — and how hard." },
        { t: "One box, not a tangle of kits", s: "Every sensor and display is powered and connected from one place." },
      ],
      connects: [
        "360° camera", "In-cab camera", "Four-camera display", "Fork camera display",
        "4D LiDAR (Unitree L2)", "Two impact sensors", "Speed sensor", "RFID reader",
        "Weight sensor", "Reverse assist", "Operator display", "Access controller",
        "Two spare ports",
      ],
      ctx: {
        img: IMG.motionTruck,
        alt: "Omnibox Motion fitted to a forklift",
        light: true,
        title: "Made for life on a truck",
        body: "Backup power and battery management keep it running through supply dips. Every circuit is fused. Two cooling fans keep it steady on hot, dusty floors, and a health light on the side shows at a glance that it’s working.",
      },
      specs: [
        ["Brain", "NVIDIA Jetson Orin Nano Super · 67 TOPS"],
        ["Size", "240 × 240 × 101 mm"],
        ["Connections", "4 USB · LiDAR network port · 2 impact sensor ports · 9 powered device ports"],
        ["Power", "Built-in battery management and UPS backup, fused circuits"],
        ["Cooling", "Two 70 mm fans"],
        ["Status", "Box health light"],
      ],
      ctaLine: "Tell us about your fleet.",
      mail: "mailto:connect@rams.digital?subject=Omnibox%20Motion%20%2F%20RAMS%202.0",
    },
  },
  {
    key: "core",
    tag: "Core · Custom",
    name: "Omnibox Core",
    short: "Core",
    lineTitle: "Engineer the use case.",
    line: "Purpose-built hardware for a job no standard box fits.",
    bestFor: "Jobs no standard box fits",
    img: IMG.core,
    checks: [
      "Designed around your process and your site",
      "We choose the brain, connections and power",
      "Built, tested and installed by RAMS Digital",
    ],
    sheet: {
      hero: IMG.coreHero,
      title: "Built around your problem.",
      intro:
        "When the job is unusual, the box should be too. Core is a custom Omnibox, designed, built and supported by the team behind the rest of the family.",
      outcomes: [
        { t: "Exactly what the job needs", s: "No paying for connections you’ll never use, no missing the one you need." },
        { t: "Tested before it arrives", s: "Proven on our bench before it reaches your floor." },
        { t: "Supported like the rest", s: "Same team, same software, same dashboard." },
      ],
      pills: {
        heading: "What we shape for you",
        items: [
          "The brain — Raspberry Pi or NVIDIA Jetson",
          "Cameras & sensors",
          "Outputs & alarms",
          "Power source",
          "Enclosure",
          "Mounting",
        ],
      },
      steps: [
        { b: "Tell us", s: "The job and what must happen." },
        { b: "We design", s: "Brain, connections, power, enclosure." },
        { b: "We build & test", s: "On our bench first." },
        { b: "We install", s: "With a clear handover." },
      ],
      ctaLine: "Describe the problem. We’ll sketch the box.",
      mail: "mailto:connect@rams.digital?subject=Omnibox%20Core%20project",
    },
  },
];

export const MODEL_BY_KEY = Object.fromEntries(MODELS.map((m) => [m.key, m])) as Record<ModelKey, Model>;

/* ── the RAMS layer formula ──────────────────────────────────────── */

export const FORMULA: { b: string; s: string }[] = [
  { b: "Compute", s: "The brain, sized to the job — up to 67 TOPS." },
  { b: "Connectivity", s: "Cameras, LiDAR and sensors plug straight in." },
  { b: "Context", s: "Knows which machine, which zone, which shift." },
  { b: "Action", s: "Stops, warns or records, right there." },
];

/* ── inside viewer ───────────────────────────────────────────────── */

export const INSIDE_CAPS: Record<ModelKey, { h: string; inside: string; connect?: string; img: string }> = {
  edge: {
    h: "Omnibox Edge",
    inside: "A Raspberry Pi 5 brain and two outputs, in a box small enough to sit inside the cell.",
    connect:
      "Two RAMS AI Cameras in. Two outputs out — one stops the robot, one sounds the alarm. Set up from a phone.",
    img: IMG.insideEdge,
  },
  ai: {
    h: "Omnibox AI",
    inside: "An NVIDIA Jetson brain with 67 TOPS of AI power, cooled to keep up all shift.",
    img: IMG.insideAi,
  },
  motion: {
    h: "Omnibox Motion",
    inside: "The brain, the power for every sensor, backup power and cooling — for the whole truck.",
    connect:
      "LiDAR, cameras, impact, speed and weight sensors, access control and the driver’s displays — all into one box on the truck.",
    img: IMG.insideMotion,
  },
  core: {
    h: "Omnibox Core",
    inside: "Modules we pick for your job: the brain, the connections and the power.",
    img: IMG.insideCore,
  },
};

/* ── setup builder ───────────────────────────────────────────────── */

/**
 * The chooser's three questions and the rules behind the recommendation.
 *
 * Questions 2 and 3 only offer what makes sense for the places already picked,
 * and anything that stops applying is dropped from the answer rather than left
 * dangling — see `renderLists` in the reference.
 */
export type Opt = { id: string; label: string; hint?: string; short?: string; places?: string[]; icon: string };

const FIXED = ["cell", "zone", "line"];
const ALL = ["cell", "zone", "line", "forklift", "other"];

export const PLACES: Opt[] = [
  { id: "cell", label: "Robot cell", hint: "Welding, handling, press lines", icon: "robot" },
  { id: "zone", label: "Doorway or hazard zone", hint: "Entries, walkways, restricted areas", icon: "door" },
  { id: "line", label: "Production line", hint: "Stations, checks, packing", icon: "line" },
  { id: "forklift", label: "Forklifts", hint: "Counterbalance, reach trucks, tuggers", icon: "forklift" },
  { id: "other", label: "Something else", hint: "A yard, outdoors or a special machine", icon: "spark" },
];

export const NOTICE: Opt[] = [
  { id: "person", label: "A person where they shouldn’t be", short: "people in the zone", places: ["cell", "zone", "line", "other"], icon: "person" },
  { id: "ppe", label: "Missing helmet or vest", short: "missing PPE", places: FIXED, icon: "helmet" },
  { id: "defect", label: "A defect or missing part", short: "defects and missing parts", places: ["cell", "line", "other"], icon: "search" },
  { id: "count", label: "Parts to count", short: "part counts", places: ["line"], icon: "count" },
  { id: "tool", label: "Wrong tool or clamp left open", short: "tools and clamps", places: ["cell", "line"], icon: "tool" },
  { id: "near", label: "People close to the truck", short: "people close to the truck", places: ["forklift"], icon: "person" },
  { id: "blind", label: "Blind spots around the truck", short: "blind spots", places: ["forklift"], icon: "eye" },
  { id: "impact", label: "Knocks and impacts", short: "impacts", places: ["forklift"], icon: "zap" },
  { id: "load", label: "What’s on the forks", short: "the load", places: ["forklift"], icon: "box" },
  { id: "speed", label: "How fast it’s going", short: "speed", places: ["forklift"], icon: "gauge" },
  { id: "driver", label: "Who is driving", short: "who’s driving", places: ["forklift"], icon: "badge" },
  { id: "custom", label: "Something unusual", short: "something unusual", places: ALL, icon: "spark" },
];

export const ACT: Opt[] = [
  { id: "stop", label: "Stop the robot or machine", short: "stop the machine", places: ["cell", "line", "other"], icon: "stop" },
  { id: "door", label: "Hold a door or gate", short: "hold the door", places: ["zone"], icon: "door" },
  { id: "alarm", label: "Sound an alarm or light", short: "sound the alarm", places: ["cell", "zone", "line", "other"], icon: "bell" },
  { id: "reject", label: "Reject the part", short: "reject the part", places: ["line"], icon: "reject" },
  { id: "warn", label: "Warn the driver on screen", short: "warn the driver", places: ["forklift"], icon: "screen" },
  { id: "record", label: "Record it for review", short: "record it", places: ALL, icon: "file" },
  { id: "alert", label: "Alert a supervisor", short: "alert a supervisor", places: ALL, icon: "alert" },
];

export const BOX_META: Record<ModelKey, { name: string; short: string; img: string; unit: string; units: string }> = {
  edge: { name: "Omnibox Edge", short: "Edge", img: IMG.edge, unit: "cell or zone", units: "cells or zones" },
  ai: { name: "Omnibox AI", short: "AI", img: IMG.ai, unit: "line or station", units: "lines or stations" },
  motion: { name: "Omnibox Motion", short: "Motion", img: IMG.motion, unit: "forklift", units: "forklifts" },
  core: { name: "Omnibox Core", short: "Core", img: IMG.core, unit: "build", units: "builds" },
};

/** Line-art icons for the builder options, drawn in a 24×24 box. */
export const ICON: Record<string, string> = {
  robot: 'M5 21h9M9 21v-5l4-6 5 2 M13 10l-3-4-3 2',
  door: 'M6 21V4a1 1 0 0 1 1-1h8l3 2v16M3 21h18M12 12h.01',
  line: 'M3 16h18M5 16v4M19 16v4M7 9h2v4H7zM15 9h2v4h-2z',
  forklift: 'M3 17V9h7l3 4v4M13 13h3V5M16 17h5M16 5v12',
  spark: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z',
  person: 'M12 8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM7 21v-6a5 5 0 0 1 10 0v6',
  helmet: 'M4 16a8 8 0 0 1 16 0M2 16h20v2H2zM12 8V5',
  search: 'M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm9 3l-4.5-4.5',
  count: 'M4 9h16M4 15h16M10 3L8 21M16 3l-2 18',
  tool: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  zap: 'M13 2L4 14h7l-1 8 9-12h-7z',
  box: 'M3 7l9-4 9 4-9 4zM3 7v10l9 4 9-4V7M12 11v10',
  gauge: 'M4 18a8 8 0 1 1 16 0M12 18l4-6',
  badge: 'M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM9 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM6 16c.8-1.5 1.8-2 3-2s2.2.5 3 2M14 10h4M14 14h3',
  stop: 'M8 3h8l5 5v8l-5 5H8l-5-5V8zM9 12h6',
  bell: 'M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 21h4',
  reject: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9 9l6 6M15 9l-6 6',
  screen: 'M5 4h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM8 20h8M12 16v4',
  file: 'M6 3h8l4 4v14H6zM14 3v4h4M9 13h6M9 17h6',
  alert: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20a6 6 0 0 1 12 0M18 8v5M18 16h.01',
};

/* ── compare ─────────────────────────────────────────────────────── */

export const COMPARE_HEAD: { key: ModelKey; b: string; s: string }[] = [
  { key: "edge", b: "Edge", s: "Acts on what cameras see" },
  { key: "ai", b: "AI", s: "Your own AI models" },
  { key: "motion", b: "Motion", s: "The RAMS 2.0 forklift box" },
  { key: "core", b: "Core", s: "Built to order" },
];

/** `true` renders the orange tick; a string renders as text. */
export const COMPARE_ROWS: { h: string; cells: (string | true)[] }[] = [
  { h: "Best for", cells: ["Safety on robot cells, doors and zones", "Inspection, counting and quality", "Forklift fleets", "Anything else"] },
  { h: "Where it goes", cells: ["In the cell, near the cameras", "Beside the line or station", "On the forklift", "Wherever the job is"] },
  { h: "The brain", cells: ["Raspberry Pi 5", "NVIDIA Jetson Orin Nano Super", "NVIDIA Jetson Orin Nano Super", "Chosen for the job"] },
  { h: "AI power", cells: ["AI runs on the RAMS AI Cameras", "67 TOPS on board", "67 TOPS on board", "As much as needed"] },
  { h: "Works with", cells: ["RAMS AI Cameras", "Cameras on your line", "Cameras, LiDAR, impact, RFID and weight sensors, displays", "What your job needs"] },
  { h: "How it acts", cells: ["Stops or holds a machine, sounds an alarm", "Signals machines, alarms and people", "Warns the driver, feeds the displays, records events", "Designed with you"] },
  { h: "Works without internet", cells: [true, true, true, true] },
  { h: "Built-in backup power", cells: ["—", "—", true, "If needed"] },
];

/* ── where it's used ─────────────────────────────────────────────── */

export const WHERE: { img: string; alt: string; models: string[]; h: string; p: string; wide?: boolean }[] = [
  { img: IMG.whereForklift, alt: "Forklift in a warehouse aisle", models: ["Motion"], h: "Forklifts & warehouse aisles", p: "Trucks that see people, feel impacts and know what they’re carrying.", wide: true },
  { img: IMG.interlock, alt: "A worker walking into a marked zone in a robot cell", models: ["Edge"], h: "Robotic cells", p: "Someone steps into the zone, the robot is told." },
  { img: IMG.weld, alt: "Welds checked on a part, one flagged as missing", models: ["AI"], h: "Quality & inspection", p: "A missing weld caught at the station, not at the customer." },
  { img: IMG.ppe, alt: "Two workers in a walkway, one flagged without a helmet", models: ["Edge", "AI"], h: "PPE & safe walkways", p: "Helmets, vests and walkways, checked every shift." },
  { img: IMG.counting, alt: "Parts counted on a conveyor", models: ["AI"], h: "Counting on the line", p: "Every part counted and checked as it passes." },
  { img: IMG.tooling, alt: "Clamps and tooling checked on a fixture", models: ["AI"], h: "Tooling & fixtures", p: "An open clamp flagged before the cycle starts." },
  { img: IMG.whereDock, alt: "Dock door with a forklift and a pedestrian walkway", models: ["Edge"], h: "Doors, docks & gates", p: "Every crossing seen, counted and on record." },
  { img: IMG.whereCustom, alt: "An unusual industrial process", models: ["Core"], h: "Something only your site has", p: "Tell us about it. We’ll build the box around it." },
];

/* ── core process ────────────────────────────────────────────────── */

export const CORE_STEPS: { b: string; s: string }[] = [
  { b: "Tell us", s: "The job, the site, and what has to happen when something goes wrong." },
  { b: "We design", s: "The right brain, connections, power and enclosure for it." },
  { b: "We build & test", s: "On our bench first, so it works before it reaches your floor." },
  { b: "We install", s: "On site, with a handover your team understands." },
];

export const CORE_SHAPE = [
  "The brain", "Cameras & sensors", "Outputs & alarms", "Power source", "Enclosure", "Mounting",
];

/* ── faq ─────────────────────────────────────────────────────────── */

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Which Omnibox do I need?",
    a: "If you’re using RAMS AI Cameras to keep a cell, door or zone safe, it’s Edge. If you want AI trained on your own parts or process, it’s AI. For forklifts, it’s Motion. If none of those fit, it’s Core. The chooser above walks you through it, or just ask us.",
  },
  {
    q: "Does it need the internet or the cloud?",
    a: "No. Every Omnibox makes its decisions on site. A network connection is only used to send events to your dashboard, and if it drops, the box carries on doing its job.",
  },
  {
    q: "Will it work with the equipment we already have?",
    a: "Usually, yes. Omnibox is built to sit beside existing machines and signal them the way a safety device or an operator would. We check your setup during a site visit before anything is ordered.",
  },
  {
    q: "What happens if the power drops?",
    a: "Omnibox Motion has built-in battery management and backup power. Omnibox Edge keeps its settings and event record through a power cut, and can be wired so that a failure stops the machine rather than letting it run.",
  },
  {
    q: "Is our video kept private?",
    a: "Detection happens on site. Omnibox Edge, for example, sends no video off the machine and is set up over its own Wi-Fi, right at the machine. What gets recorded, and who can see it, is agreed with you.",
  },
  {
    q: "Does it replace our existing safety guarding?",
    a: "No. Fences, light curtains and interlocks stay as they are. Omnibox adds a layer on top — one that notices, acts and keeps a record.",
  },
  {
    q: "Can we start small?",
    a: "Yes, and we recommend it. Most sites start with one cell, one door or one truck, see the results, then roll out.",
  },
];
