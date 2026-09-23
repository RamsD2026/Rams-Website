/**
 * The homepage's copy, lifted from the supplied design
 * (`RAMS_Digital_Physical_Warehouse_Homepage-10.html`) rather than rewritten:
 * it is the approved wording, and the only things changed on the way in were
 * the icon paths, pulled out of the markup into `PILLARS`.
 *
 * The page renders from these lists, so a change of wording is a change here
 * and not a hunt through JSX. The previous build's `GAPS`, `SYSTEMS` and
 * `STARTS` went with the sections that read them.
 */

/* ── 02 the RAMS idea ───────────────────────────────────────────── */

export const UNIVERSE: { n: string; h: string; p: string }[] = [
  { n: "01", h: "Racks", p: "Integrity, condition, engineering assessment, corrective actions and history." },
  { n: "02", h: "MHEs", p: "Movement, utilisation, safety, positioning and connected machine intelligence." },
  { n: "03", h: "Pallets", p: "Pallet identity, location and movement—with inventory availability and flow in context." },
  { n: "04", h: "People", p: "Operational interaction, access, safety context and workflow participation." },
  { n: "05", h: "Infrastructure", p: "Floors, spatial conditions, facility context and physical environment." },
  { n: "06", h: "Robotics", p: "AGVs, AMRs and autonomous assets connected as the warehouse evolves." },
];

/* ── 03 what RAMS improves ──────────────────────────────────────── */

/** `d` is the icon's path data, drawn in a 24 × 24 box. */
export const PILLARS: { h: string; p: string; d: string[]; circle?: [number, number, number] }[] = [
  {
    h: "Safety",
    p: "Connect rack condition, operating behaviour, people, MHEs and environmental context so risk becomes part of daily operations.",
    d: ["M12 3 21 6v7c0 5-9 9-9 9s-9-4-9-9V6z", "m8 12 3 3 5-6"],
  },
  {
    h: "Productivity",
    p: "Understand movement, utilisation, tasks, interactions and workflow patterns across physical operations.",
    d: ["M4 21V13h4v8M10 21V8h4v13M16 21V3h4v18"],
  },
  {
    h: "Efficiency",
    p: "Use engineering and operational intelligence to improve asset use, maintenance, workflows, layout and decision-making.",
    d: ["M4 18a9 9 0 1 1 16 0M3 22h18M12 12l6-6"],
    circle: [12, 12, 2],
  },
  {
    h: "Visibility",
    p: "See what is physically happening inside the warehouse — not only what enterprise systems expect to be happening.",
    d: ["M2 12s4-8 10-8 10 8 10 8-4 8-10 8S2 12 2 12z"],
    circle: [12, 12, 3],
  },
];

/* ── 04 how RAMS works ──────────────────────────────────────────── */

export const MODEL_STEPS: { n: string; b: string; s: string }[] = [
  { n: "01", b: "Model", s: "Create the Digital Twin and spatial representation of the warehouse." },
  { n: "02", b: "Tag", s: "Give racks, MHEs, pallets, people and other physical assets a persistent identity." },
  { n: "03", b: "Connect", s: "Add inspections, sensors, vision, positioning, enterprise systems and operational data." },
  { n: "04", b: "Operate", s: "Use RAMS applications to manage safety, movement, tasks, asset condition and workflows." },
  { n: "05", b: "Learn", s: "Build a history of movement, condition, safety events and outcomes to uncover patterns." },
  { n: "06", b: "Evolve", s: "Use those insights to continuously improve safety, productivity, efficiency and execution." },
];

/* ── 05 the solution finder ─────────────────────────────────────────
   Three questions, and a suite map that lights up as they are answered. The
   rules are the design's own: the problem picks a base stack, and the signal
   and the outcome each add to it. */

export type FinderGroup = "problem" | "signal" | "outcome";
export type SuiteKey =
  | "digital-twin" | "ai-vision" | "omnibox" | "location" | "sensor-stack"
  | "irds" | "meps" | "rtss" | "imds" | "iros" | "atos" | "aims";

export const PROBLEMS: { v: string; b: string; s: string }[] = [
  { v: "rack", b: "Rack safety", s: "Damage, condition or compliance" },
  { v: "mhe", b: "MHE safety & productivity", s: "Movement, impacts or utilisation" },
  { v: "pallet", b: "Pallet & inventory flow", s: "Location, dwell or exceptions" },
  { v: "facility", b: "Facility-specific process", s: "Machines, utilities or custom operations" },
];

export const SIGNALS: { v: string; label: string }[] = [
  { v: "condition", label: "Condition or damage" },
  { v: "movement", label: "Movement and interaction" },
  { v: "location", label: "Location and dwell" },
  { v: "vision", label: "Critical-zone event" },
];

export const OUTCOMES: { v: string; label: string }[] = [
  { v: "action", label: "Create and close an action" },
  { v: "alert", label: "Alert the right team" },
  { v: "optimise", label: "Improve flow or use" },
  { v: "insight", label: "See patterns across sites" },
];

export const RECOMMENDATIONS: Record<string, { title: string; lead: string; suites: SuiteKey[] }> = {
  rack: {
    title: "Rack Safety & Lifecycle Intelligence",
    lead: "The highlighted stack brings rack events, condition and corrective actions into one physical lifecycle.",
    suites: ["digital-twin", "ai-vision", "omnibox", "sensor-stack", "irds", "rtss"],
  },
  mhe: {
    title: "Connected MHE Safety & Performance",
    lead: "The highlighted stack connects vehicle movement, utilisation, safety events and equipment health.",
    suites: ["digital-twin", "ai-vision", "omnibox", "location", "sensor-stack", "meps", "rtss", "imds"],
  },
  pallet: {
    title: "Pallet Flow & Inventory Intelligence",
    lead: "The highlighted stack connects pallet identity, live location, dwell and task flow.",
    suites: ["digital-twin", "omnibox", "location", "sensor-stack", "iros", "atos", "aims"],
  },
  facility: {
    title: "Custom Physical Operations Intelligence",
    lead: "The highlighted stack creates the operating context for your facility-specific process.",
    suites: ["digital-twin", "ai-vision", "omnibox", "location", "sensor-stack", "atos", "aims"],
  },
};

export const SIGNAL_SUITES: Record<string, SuiteKey[]> = {
  condition: ["sensor-stack"],
  movement: ["omnibox", "location", "meps"],
  location: ["location", "iros"],
  vision: ["ai-vision", "rtss"],
};

export const OUTCOME_SUITES: Record<string, SuiteKey[]> = {
  action: ["atos"],
  alert: ["rtss"],
  optimise: ["meps", "iros"],
  insight: ["aims"],
};

export const OUTCOME_TEXT: Record<string, string> = {
  action: "Detect the event, identify the affected asset, assign the action and retain the complete lifecycle history.",
  alert: "Capture the event in its physical context and route a real-time alert to the right team.",
  optimise: "Turn activity into movement, dwell and utilisation patterns that improve flow on the ground.",
  insight: "Bring site-level events and operational patterns into AIMS for clearer management intelligence.",
};

/** The suite map's rows. `layer` and `span` are set on the row that opens a
 *  group and carries the rowspan; the rows under it leave both out. */
export const SUITE_ROWS: { key: SuiteKey; layer?: string; span?: number; name: string; role: string }[] = [
  { key: "digital-twin", layer: "Foundation", span: 1, name: "Digital Twin", role: "Physical context" },
  { key: "ai-vision", layer: "Hardware", span: 4, name: "AI Vision", role: "Critical-zone perception" },
  { key: "omnibox", name: "OmniBox", role: "Edge processing & action" },
  { key: "location", name: "Location Intelligence", role: "LiDAR · RFID · UWB · BLE" },
  { key: "sensor-stack", name: "Sensor Stack", role: "Impact · motion · condition" },
  { key: "irds", layer: "Platform suites", span: 7, name: "IRDS", role: "Rack safety & lifecycle" },
  { key: "meps", name: "MEPS", role: "MHE efficiency & productivity" },
  { key: "rtss", name: "RTSS", role: "Real-time safety" },
  { key: "imds", name: "IMDS", role: "MHE diagnostics & maintenance" },
  { key: "iros", name: "IROS", role: "Pallet & inventory intelligence" },
  { key: "atos", name: "ATOS", role: "Task orchestration" },
  { key: "aims", name: "AIMS", role: "Management intelligence" },
];

/* ── 06 a different path ────────────────────────────────────────── */

export const COMPARE: { badge: string; h: string; sub: string; check: string; items: string[]; highlight?: boolean }[] = [
  {
    badge: "Automation-Led Transformation",
    h: "Build a highly robotic warehouse.",
    sub: "Purpose-built automation, dedicated equipment and redesigned workflows.",
    check: "•",
    items: [
      "High levels of machine-led execution.",
      "Often involves major process and infrastructure transformation.",
      "Best where throughput and automation economics support the investment.",
      "Operational intelligence is typically native to the automation ecosystem.",
    ],
  },
  {
    badge: "RAMS Augmentation Path",
    h: "Make the existing warehouse intelligent.",
    sub: "Start with today's assets. Add intelligence now. Automate progressively.",
    check: "✓",
    highlight: true,
    items: [
      "Start with the Digital Twin and IRDS to connect existing racks, MHEs, pallets, people and infrastructure.",
      "Add the platforms that solve the next problem: MEPS, IMDS, RTSS, ATOS, IROS and AIMS.",
      "Layer in AI Vision, OmniBox edge processors, LiDAR, RFID, Wi-Fi, Bluetooth, UWB and condition sensing where needed.",
      "Connect WMS, ERP, CMMS, PLCs and OEM equipment—then bring AGVs, AMRs and robots into the same operating context.",
    ],
  },
];

/* ── 07 any moving asset ────────────────────────────────────────── */

export const ASSET_PILLS = [
  "Manual Forklift", "Reach Truck", "Tow Tractor", "AGV", "AMR", "Autonomous MHE",
];

/* ── 08 progressive transformation ──────────────────────────────── */

export const EVOLUTION: { n: string; h: string; p: string; active?: boolean }[] = [
  { n: "01", h: "Physical", p: "Racks, forklifts, pallets, people and infrastructure operating with fragmented information." },
  { n: "02", h: "Connected", p: "Assets gain identity, sensing, spatial context and a common Digital Twin." },
  { n: "03", h: "Intelligent", p: "Safety, engineering, utilisation, diagnostics and operational context are brought together.", active: true },
  { n: "04", h: "Autonomous", p: "People, manual MHEs, AGVs, AMRs and automation increasingly coordinate within one environment." },
];

/* ── 09 today and tomorrow ──────────────────────────────────────── */

export const NOW_NEXT: { h: string; sub: string; items: string[]; future?: boolean }[] = [
  {
    h: "Make the Warehouse Visible Today",
    sub: "Start with the operational area that needs attention, then bring every physical element into the same living context.",
    items: [
      "Racks — Digital Twin + IRDS for asset identity, inspection, rectification and lifecycle history",
      "MHEs — MEPS, IMDS and RTSS for movement, utilisation, impacts, diagnostics and maintenance",
      "Pallets — IROS + Location Intelligence for inventory location, movement, dwell and exception visibility",
      "People — AI Vision, RTSS and ATOS for safer zones, event detection and operational task execution",
    ],
  },
  {
    h: "Connect the Whole Flow",
    sub: "When racks, MHEs, pallets and people are connected, RAMS turns isolated signals into a shared view of how the warehouse is operating.",
    future: true,
    items: [
      "Digital Twin — gives every event its exact physical location, asset, relationship and history",
      "AIMS — connects every RAMS platform and site into one management intelligence layer",
      "AI Vision Pro, Ultra and Max + OmniBox Edge, AI, Motion and Core — see, process and act at the edge",
      "LiDAR, RFID, Wi-Fi, Bluetooth, UWB and condition sensors — add the right level of spatial and event awareness",
      "Open integration + Physical Execution — connect WMS, ERP, CMMS, PLCs and OEM equipment; progressively coordinate people, MHEs, AGVs, AMRs and robots",
    ],
  },
];
