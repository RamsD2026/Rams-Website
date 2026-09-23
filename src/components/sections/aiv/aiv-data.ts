import type { Hud } from "@/components/sections/hardware/hw-shared";

/**
 * The content of /hardware/ai-vision.
 *
 * Two sources feed this file. The page was first ported from the AI Camera
 * showcase build; its copy is now reconciled against
 * `RAMS_Digital_Hardware_Website_Rewritten_Copy.md` §2 (the hardware copy deck),
 * which is the newer and sign-off-ready source.
 *
 * ── The claims posture is deliberate ────────────────────────────────
 * The showcase build stated hard figures — 26 TOPS, < 0.5 s frame to alert,
 * 100% on-device. Those traced only to the showcase build and its own design
 * note; no engineering document in `docs/` carries them, and the copy deck
 * states no performance number anywhere. They have been replaced page-wide with
 * capability language: what the camera *does* rather than how fast it claims to
 * do it. Do not reintroduce a figure here without a spec document behind it.
 *
 * The same rule governs the safety language. The page never claims certified
 * safety-rated status and never says the camera replaces guarding, interlocks
 * or light curtains — it is an additional layer around controls that stay in
 * place. Where the camera drives a machine response, the copy says the
 * behaviour is defined and validated for the specific application. The
 * "indicative", "illustrative" and "to be confirmed" notes are load-bearing;
 * do not tighten them into cleaner marketing copy.
 *
 * `img: undefined` is not an oversight. Thirteen of the reference's fifteen
 * images were never generated, and its prompts for them are in that folder's
 * `docs/image-prompts.md`. A missing `img` renders as a labelled placeholder
 * carrying the file name that belongs there, which is what the reference itself
 * shows today. Dropping a file into `public/ai-vision/` and naming it here is
 * the whole of the change when the photography lands.
 */

export const IMG = {
  /** The product, three-quarter view on black. */
  product: "/ai-vision/product.png",
  /** The product, low angle. */
  productLow: "/ai-vision/product-low.png",
  /** A real robotic-cell frame. Its HUD is baked in, so it takes no overlay. */
  roboticCell: "/ai-vision/uc-robotic-cell.png",
  /** This site's own render: the camera on a rack upright, boxes over the aisle. */
  warehouse: "/AI Vision.png",
} as const;

/* ── hero ────────────────────────────────────────────────────────── */

/* ── environments ────────────────────────────────────────────────── */

export type EnvScene = {
  key: string;
  tab: string;
  title: string;
  body: string;
  link: string;
  uc: string;
  img?: string;
  imgAlt: string;
  label: string;
};

export const ENVS: EnvScene[] = [
  {
    key: "mhe",
    tab: "Forklifts",
    title: "On the overhead guard.",
    body: "Raked toward the floor, facing the direction of travel. It sees the person stepping out from behind the rack before the driver can.",
    link: "See the forklift use case",
    uc: "mhe",
    img: IMG.warehouse,
    imgAlt: "AI Camera on a rack upright, tracking operators and a forklift across a warehouse aisle",
    label: "media/ctx-mhe.jpg",
  },
  {
    key: "cell",
    tab: "Robotic cells",
    title: "On the cell fence.",
    body: "Looking down into the cell and across its doorway. When someone steps in, the robot is told — and the entry is logged.",
    link: "See the robotic cell use case",
    uc: "cell",
    img: IMG.roboticCell,
    imgAlt: "AI Camera view inside a robotic cell",
    label: "media/ctx-robotic-cell.jpg",
  },
  {
    key: "dock",
    tab: "Doors & docks",
    title: "Above the door.",
    body: "Watching the few metres where people, trucks and MHE all share the same gap — and which way each of them is going.",
    link: "See the doors & docks use case",
    uc: "dock",
    imgAlt: "AI Camera above a dock door",
    label: "media/ctx-dock.jpg",
  },
  {
    key: "zone",
    tab: "Hazard zones",
    title: "On a ceiling drop.",
    body: "Straight down over the press. A painted line becomes a rule: no one inside while it runs, and no one near it without a helmet.",
    link: "See the hazard zone use case",
    uc: "zone",
    imgAlt: "AI Camera on a ceiling pole above a hazard zone",
    label: "media/ctx-hazard.jpg",
  },
];

/* ── use cases ───────────────────────────────────────────────────── */

export type UseCase = {
  key: string;
  label: string;
  /** Tile heading. */
  title: string;
  /** Tile sub-line. */
  teaser: string;
  /** Sheet heading — occasionally a longer form of the tile's. */
  sheetTitle: string;
  intro: string;
  tile: { img?: string; alt: string; label: string; hud?: Hud; nohud?: boolean };
  sheet: { img?: string; alt: string; label: string; hud?: Hud; nohud?: boolean };
  sees: string[];
  does: string[];
  outcomes: { t: string; s: string }[];
  ctx: {
    img?: string;
    alt: string;
    label: string;
    title: string;
    body: string;
    fitlist?: { b: string; s: string }[];
  };
  cta: { line: string; mail: string };
  /** Only the MHE sheet carries the blind-spot interactive. */
  blindSpot?: boolean;
};

export const USE_CASES: UseCase[] = [
  {
    key: "mhe",
    label: "Forklifts & MHE",
    title: "Sees what the driver can’t.",
    teaser: "Pedestrians behind the mast, past the load, over the shoulder.",
    sheetTitle: "Sees what the driver can’t.",
    intro:
      "A seated operator on a counterbalance truck loses roughly a third of the floor around them — behind the mast, past the load, over each shoulder. The camera doesn’t.",
    tile: {
      alt: "Camera view from a forklift: a worker stepping out from behind a rack",
      label: "media/uc-mhe.jpg",
      hud: {
        cam: "CAM_01 / MHE-03 FRONT",
        boxes: [[57, 28, 13, 44, "PERSON 0.97", "warn"]],
        zones: [["30,100 70,100 62,58 38,58", "warn"]],
      },
    },
    sheet: {
      alt: "Camera view from a forklift: a worker stepping out from behind a rack",
      label: "media/uc-mhe.jpg",
      hud: {
        cam: "CAM_01 / MHE-03 FRONT",
        boxes: [[57, 28, 13, 44, "PERSON 0.97 · 3.8 m", "warn"]],
        zones: [["30,100 70,100 62,58 38,58", "warn"]],
      },
    },
    sees: ["Pedestrians", "Other MHE", "Racks & obstacles", "PPE", "Operator state"],
    does: ["Slows the truck", "Stops the truck", "Alerts the driver", "Files the clip", "Logs the near-miss"],
    outcomes: [
      { t: "360° around the truck", s: "Up to seven units per truck: front, sides, rear, forks and operator." },
      { t: "Every near-miss, on record", s: "With a clip, the truck, the clearance and what the system did." },
      { t: "Installed in one shift", s: "Mechanical mount, power at the battery, OEM loom untouched." },
    ],
    ctx: {
      img: IMG.warehouse,
      alt: "AI Camera mounted above a warehouse aisle",
      label: "media/ctx-mhe.jpg",
      title: "If it runs on a battery, it takes the camera.",
      body: "Mounting is mechanical and power is taken at the battery, so make and model rarely matter. Mixed-brand fleets are the normal case.",
      fitlist: [
        { b: "Counterbalance", s: "1.5–5 t · guard pair" },
        { b: "Reach truck", s: "Mast-mounted pair" },
        { b: "VNA / turret", s: "Guard pair + rear" },
        { b: "Pallet truck", s: "Single forward unit" },
        { b: "Stacker", s: "Single forward unit" },
        { b: "Tow tractor", s: "Forward pair" },
      ],
    },
    cta: {
      line: "Send us your fleet list — we’ll confirm each truck.",
      mail: "mailto:connect@rams.digital?subject=AI%20Camera%20%E2%80%94%20forklifts",
    },
    blindSpot: true,
  },
  {
    key: "cell",
    label: "Robotic cells",
    title: "Knows the moment someone steps in.",
    teaser: "Person-in-cell detection, a stop signal and a logged entry.",
    sheetTitle: "Knows the moment someone steps in.",
    intro:
      "Cells get entered for good reasons — a jam, a quick fix, a changeover. Guarding keeps most of that safe. What nobody has is a record of who went in, when, and how often the procedure gets skipped.",
    tile: {
      img: IMG.roboticCell,
      alt: "Camera view inside a robotic cell: a worker walking in through the door",
      label: "media/uc-robotic-cell.jpg",
      nohud: true,
    },
    sheet: {
      img: IMG.roboticCell,
      alt: "Camera view inside a robotic cell: a worker walking in through the door",
      label: "media/uc-robotic-cell.jpg",
      nohud: true,
    },
    sees: ["Person at the door", "Person inside the cell", "Dwell time", "PPE", "Robot zone"],
    does: ["Stop or slow signal", "Door-side alarm", "Entry log with clip", "Supervisor notification"],
    outcomes: [
      { t: "Every entry, time-stamped", s: "Who crossed the line, for how long, with the clip attached." },
      { t: "A layer on top of guarding", s: "Fences, curtains and interlocks stay exactly as they are." },
      { t: "Patterns you can fix", s: "Which cell, which shift, which task keeps pulling people in." },
    ],
    ctx: {
      alt: "AI Camera mounted on a robot cell fence post",
      label: "media/ctx-robotic-cell.jpg",
      title: "One post. The whole cell.",
      body: "Mounted high on the fence, raked down, the unit covers the doorway and the floor inside it in one frame. Zones are drawn per cell at commissioning, so a welding cell and a palletiser each get their own rules.",
    },
    cta: {
      line: "Tell us about your cells — we’ll show you what it would catch.",
      mail: "mailto:connect@rams.digital?subject=AI%20Camera%20%E2%80%94%20robotic%20cells",
    },
  },
  {
    key: "dock",
    label: "Entry, exit & docks",
    title: "Every crossing, accounted for.",
    teaser: "People and vehicles, which way they went, and whether they should have.",
    sheetTitle: "Every crossing, accounted for.",
    intro:
      "Dock doors are where people, trucks and MHE share the same few metres — often at speed, often in poor light, and with nobody counting.",
    tile: {
      alt: "Camera view over a dock door: a forklift driving in and a worker crossing",
      label: "media/uc-entry-exit.jpg",
      hud: {
        cam: "CAM_03 / DOCK DOOR 3",
        boxes: [
          [38, 34, 22, 42, "MHE 0.99", ""],
          [70, 40, 9, 34, "PERSON 0.95", "warn"],
        ],
        zones: [["30,100 72,100 66,62 36,62", ""]],
      },
    },
    sheet: {
      alt: "Camera view over a dock door: a forklift driving in and a worker crossing",
      label: "media/uc-entry-exit.jpg",
      hud: {
        cam: "CAM_03 / DOCK DOOR 3",
        boxes: [
          [38, 34, 22, 42, "MHE 0.99 · INBOUND", ""],
          [70, 40, 9, 34, "PERSON 0.95", "warn"],
        ],
        zones: [["30,100 72,100 66,62 36,62", ""]],
      },
    },
    sees: ["People", "Forklifts & vehicles", "Direction of travel", "Walkway use", "Counts"],
    does: ["Crossing alert", "Unauthorised entry alert", "Walkway breach log", "Throughput by door"],
    outcomes: [
      { t: "Crossings made visible", s: "Where people and MHE actually meet at each door, not where the drawing says." },
      { t: "Counts by door and hour", s: "In, out and direction — useful well beyond safety." },
      { t: "Evidence for layout changes", s: "Move a walkway or a barrier on data, then measure the effect." },
    ],
    ctx: {
      alt: "AI Camera mounted above a dock door",
      label: "media/ctx-dock.jpg",
      title: "Above the door, looking in.",
      body: "A short wall bracket over the shutter gives the unit the doorway, the leveller and the first metres of floor. Bright daylight behind and dim warehouse in front is exactly what the HDR sensor is for.",
    },
    cta: {
      line: "Pick your busiest door — we’ll start there.",
      mail: "mailto:connect@rams.digital?subject=AI%20Camera%20%E2%80%94%20doors%20and%20docks",
    },
  },
  {
    key: "zone",
    label: "Hazard zones & PPE",
    title: "Helmet on. Vest on. Out of the zone.",
    teaser: "The rules on the wall, enforced on the floor — every shift.",
    sheetTitle: "Helmet on. Vest on. Out of the zone.",
    intro:
      "Exclusion zones and PPE rules only work when someone is watching. Supervisors can’t stand at every press, every line, every shift.",
    tile: {
      alt: "Camera view of a press line: a worker without a helmet inside a hatched zone",
      label: "media/uc-hazard-ppe.jpg",
      hud: {
        cam: "CAM_04 / PRESS LINE",
        boxes: [
          [46, 28, 12, 46, "NO HELMET 0.94", "alert"],
          [12, 30, 8, 30, "PPE OK", ""],
          [22, 32, 8, 28, "PPE OK", ""],
        ],
        zones: [["28,96 72,96 66,56 34,56", "alert"]],
      },
    },
    sheet: {
      alt: "Camera view of a press line: a worker without a helmet inside a hatched zone",
      label: "media/uc-hazard-ppe.jpg",
      hud: {
        cam: "CAM_04 / PRESS LINE",
        boxes: [
          [46, 28, 12, 46, "NO HELMET · IN ZONE", "alert"],
          [12, 30, 8, 30, "PPE OK", ""],
          [22, 32, 8, 28, "PPE OK", ""],
        ],
        zones: [["28,96 72,96 66,56 34,56", "alert"]],
      },
    },
    sees: ["Helmet", "Hi-vis vest", "Zone entry", "Dwell time", "People in zone"],
    does: ["Local alarm", "Stop signal", "Notification", "Compliance log"],
    outcomes: [
      { t: "Compliance measured", s: "PPE rates by line and shift, not assumed from a sign on the wall." },
      { t: "Breaches caught live", s: "The alarm sounds while the person is still in the zone, not in next week’s review." },
      { t: "Coaching, not blame", s: "Clips that show what happened, for the conversation that prevents the next one." },
    ],
    ctx: {
      alt: "AI Camera on a ceiling pole above a hazard zone",
      label: "media/ctx-hazard.jpg",
      title: "Straight down over the line.",
      body: "A ceiling drop puts the unit above the zone, so people never block each other and the painted boundary maps cleanly into the camera. One unit typically covers a press, a cell entrance or a loading bay.",
    },
    cta: {
      line: "Show us the zones that worry you most.",
      mail: "mailto:connect@rams.digital?subject=AI%20Camera%20%E2%80%94%20hazard%20zones%20and%20PPE",
    },
  },
];

/* ── see → understand → act ──────────────────────────────────────── */

/** The three frames of the camera view `AivHow` cross-fades between, in the
 *  order the scroll track reveals them. Cumulative: each one is a full frame,
 *  not a layer, so they stack rather than swap.
 *
 *  The HUD is burned into the images — boxes, labels, zone, event card — which
 *  is what makes the timestamps in them (16:02:48, :58, 16:03:10) part of the
 *  asset rather than something the page renders. Replacing a frame means
 *  matching the camera, the workers and the machine in the other two, or the
 *  cross-fade shows the difference. */
export const SUA_FRAMES = [
  "/ai-vision/how-it-works-1.webp",
  "/ai-vision/how-it-works-2.webp",
  "/ai-vision/how-it-works-3.webp",
] as const;

/** Three steps, and three is structural rather than editorial: `AivHow` pins a
 *  single camera view whose frames are keyed off `data-step` in CSS
 *  (`.sua-frame`) and whose scroll handler caps at 3. The copy deck §4 lists a
 *  fourth, "Learn" — that content is `AivSoftware`, which is the whole section
 *  about events becoming trends. Adding a fourth entry here renders a step that
 *  never activates; it needs a fourth frame and a new threshold in `AivHow`
 *  first. */
export const SUA_STEPS = [
  {
    n: "01 · See",
    h: "Detect and classify.",
    p: "People, PPE, vehicles, pallets and machines — picked out of every frame by the NPU inside the housing.",
  },
  {
    n: "02 · Understand",
    h: "Track, zone, predict.",
    p: "Where each thing is, where it is heading, and whether it is about to cross a line you drew.",
  },
  {
    n: "03 · Act",
    h: "Trigger, alert, log.",
    p: "A stop or slow signal, an alarm, a notification — and a clip of the moment, filed automatically, while the event is still happening.",
  },
];

/* ── build your own ──────────────────────────────────────────────── */

export const DETECTS = [
  "Person", "Helmet", "Hi-vis vest", "Forklift & MHE", "Vehicle", "Pallet",
  "Zone entry", "Direction of travel", "Count", "Dwell time", "Operator state",
];

export const TRIGGERS = [
  "Stop or slow", "Local alarm", "Beacon", "Notification", "Event clip", "Dashboard event",
];

export const IDEAS: { b: string; s: string; img?: string; alt: string; label: string }[] = [
  { b: "Conveyors", s: "Hands near a merge point.", alt: "Parcel conveyor line", label: "media/idea-conveyor.jpg" },
  { b: "Factory gates", s: "People in the vehicle lane.", alt: "Factory gate with a boom barrier", label: "media/idea-gate.jpg" },
  { b: "Overhead cranes", s: "Anyone under a suspended load.", alt: "Overhead crane lifting a steel coil", label: "media/idea-crane.jpg" },
  { b: "Cold storage", s: "Low light, fog, reach trucks.", alt: "Cold storage warehouse aisle", label: "media/idea-cold-storage.jpg" },
];


/* ── software ────────────────────────────────────────────────────── */

export const EVENTS: { id: string; time: string; type: string; source: string; action: string; stop?: boolean; detail: string }[] = [
  { id: "EV-2291", time: "09:41", type: "Near-miss", source: "MHE-03", action: "STOPPED", stop: true, detail: "Clearance 1.1 m" },
  { id: "EV-2292", time: "09:44", type: "PPE", source: "Press line · Zone B", action: "ALARM", detail: "No helmet" },
  { id: "EV-2293", time: "09:52", type: "Zone entry", source: "Robot cell 2", action: "STOP SIGNAL", stop: true, detail: "Dwell 3.2 s" },
  { id: "EV-2294", time: "10:03", type: "Crossing", source: "Dock door 3", action: "ALERTED", detail: "Outside walkway" },
];

/* ── deploy ──────────────────────────────────────────────────────── */

export const DEPLOY = [
  { b: "Survey", s: "We walk the site and find where people and machines actually meet." },
  { b: "Mount", s: "A bracket on a guard, a post, a door frame or a ceiling drop." },
  { b: "Power", s: "12–80 V DC through a locking XT30. A few watts." },
  { b: "Commission", s: "USB-C on site: draw the zones, set the rules and thresholds." },
  { b: "Live", s: "Events start landing. We tune from them in the first weeks." },
];

/* ── specs ───────────────────────────────────────────────────────── */

export const SPECS: { h: string; rows: [string, string][] }[] = [
  {
    h: "Vision",
    rows: [
      ["Optics", "F/1.6 · low-light · anti-glare"],
      ["Sensor", "Global shutter · HDR"],
      ["Detection", "On-device, at the edge — no cloud in the decision path"],
      ["Classes", "Person · PPE · MHE & vehicles · pallet · zone events · operator state"],
    ],
  },
  {
    h: "Compute",
    rows: [
      ["Processor", "Edge NPU — sized for every class, every frame"],
      ["Inference", "On-device · no platform dependency to detect"],
      ["Standalone", "Full detection and response without a network"],
      ["Storage", "Rolling event buffer with video evidence"],
    ],
  },
  {
    h: "Power & I/O",
    rows: [
      ["Input", "12–80 V DC · locking XT30"],
      ["Service", "USB-C commissioning and diagnostics"],
      ["Expansion", "Sealed, field-serviceable bay"],
      ["Connectivity", "Wi-Fi to RAMS Digital when in range"],
    ],
  },
  {
    h: "Physical",
    rows: [
      ["Housing", "Machined aluminium · integrated fin stack"],
      ["Ingress", "IP-rated for wash-down and dust"],
      ["Operating temperature", "−20 °C to 50 °C"],
      ["Status", "Single status light · fault reporting to dashboard"],
    ],
  },
];

/* ── faq ─────────────────────────────────────────────────────────── */

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Are you recording my people?",
    a: "The camera watches the floor, not the person. Continuous footage is never uploaded — it runs a rolling buffer on the device and only keeps the seconds around an actual event. Detection is anonymous: it classifies “person”, it does not identify who. Retention, who can open a clip, and what supervisors see are all set by you at commissioning, and we put that in writing before install.",
  },
  {
    q: "Does it need a network to work?",
    a: "No. Every camera detects, decides and responds on its own hardware. The network is only for reporting — heat maps, trends and clips sync when a connection is available. A dead network costs you the analytics, never the safety function.",
  },
  {
    q: "How many false alarms should we expect?",
    a: "False positives are why most systems get switched off, so zones and thresholds are tuned per site during commissioning — every floor, cell and doorway is different. Expect a tuning period in the first weeks, with the event log used to adjust rather than guesswork.",
  },
  {
    q: "Does it replace our guarding or CCTV?",
    a: "No — it adds a layer on top. Fences, light curtains and interlocks stay exactly as they are, and existing CCTV keeps recording. The AI Camera is the part that understands what it sees and responds while the event is still happening, with a record of every one.",
  },
  {
    q: "What happens if a unit fails?",
    a: "The camera is an additional layer, so a fault returns the equipment around it to how it behaved before install — it does not remove a control that was already there. The status light and the dashboard both flag the fault, so it never sits unnoticed. Where a unit is wired to a machine response, that integration and its failure behaviour are defined and validated for the specific application before it goes live.",
  },
  {
    q: "Which environments does it suit?",
    a: "Anywhere people and machines share space and you can draw a line: trucks, robot cells, doors and docks, press lines, loading bays, gates. It runs from −20 °C to 50 °C and is IP-rated for dust and wash-down. If your use case is not on this page, tell us — most of them are a zone and a rule.",
  },
  {
    q: "Does it identify individual people?",
    a: "No. The standard safety use case is object and event detection, not facial identification — it classifies “person”, it does not work out who. Privacy, clip retention and who can open an event are agreed as part of the deployment, and we put that in writing before install.",
  },
  {
    q: "Where does our data live?",
    a: "Event data and clips sync to your RAMS Digital tenancy. Region, retention window and export are configurable, and raw video never leaves the device unless an event triggers. If your policy requires fully on-premise, tell us at survey and we will scope it.",
  },
];

/* ── the gap ─────────────────────────────────────────────────────── */

/** Copy deck §2 — "CCTV records what happened. Operations need to know while
 *  it is happening." Four situations, each paired with what the camera does
 *  about it. `r` is the response and is always the second half of the pair;
 *  the section renders them as a problem/answer couplet, never apart. */
export const GAPS: { b: string; s: string; r: string }[] = [
  {
    b: "Risk appears in a blind spot",
    s: "A pedestrian can step into the path of a truck before the operator has any clear line of sight.",
    r: "Detect the person, read the zone that was drawn there, and trigger the configured warning or action.",
  },
  {
    b: "Someone enters a controlled area",
    s: "A robot cell, press area or restricted zone gets entered for maintenance, clearing or a changeover.",
    r: "Detect the entry, time-stamp it, and pass the event to the local response and the record.",
  },
  {
    b: "A rule exists only on a signboard",
    s: "PPE and walkway rules are hard to hold to consistently across every shift, on every aisle.",
    r: "Monitor the rule continuously and create evidence the moment an exception occurs.",
  },
  {
    b: "The footage has the answer — afterwards",
    s: "Hours of recording are rarely much use for the improvement you needed to make on the day.",
    r: "Keep the event that matters, with its time, its zone and its operational context.",
  },
];

/* ── the edge ────────────────────────────────────────────────────── */

/** Copy deck §5 — "Intelligence at the edge." The film carries this as a
 *  chapter, but the film is a fixed layer that stands down on the static
 *  fallback, so the argument needs a home in `.aiv-doc` as well. */
export const EDGE: { b: string; s: string }[] = [
  {
    b: "Local inference",
    s: "The image is interpreted on the device, instead of every frame being sent somewhere else for a decision to come back.",
  },
  {
    b: "Event-based evidence",
    s: "The useful output is the operational event and the context around it — not an endless stream of footage nobody will watch.",
  },
  {
    b: "Site-specific rules",
    s: "Zones and thresholds are commissioned around your actual floor, because a dock, a robot cell and a forklift aisle do not behave the same way.",
  },
  {
    b: "Connected when available",
    s: "Events synchronise to RAMS Digital for reporting, trends and cross-system intelligence — when there is a network, and not before.",
  },
];

/* ── where it stops ──────────────────────────────────────────────── */

/** The controls that are already on the floor and stay exactly as they are.
 *  Copy deck §9 names them in a sentence; the section renders them as one
 *  unbroken slab, because six separate cards would say "six things" where the
 *  point is "one system, untouched". */
export const STAYS: { b: string; s: string }[] = [
  { b: "Guarding", s: "Fences, cages and fixed barriers" },
  { b: "Interlocks", s: "Gates and doors that stop the machine" },
  { b: "Safety scanners", s: "Light curtains and laser scanners" },
  { b: "Procedures", s: "Permits, isolation and safe systems of work" },
  { b: "Operator training", s: "Licences, refreshers and supervision" },
  { b: "CCTV", s: "Whatever is recording today, still recording" },
];
