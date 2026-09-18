/* ============================================================================
   /hardware/sensor-stack — every word on the page, in one React-free module.

   Ported from the Sensor Stack showcase build (`Sensor Stack Website/`:
   `index.html` + `site.css` + `sensors.css` + `models/rams-forklift-model.js`,
   with its design note under `docs/superpowers/specs/`). The reference kept its
   copy inline in the markup; it is collected here on the same argument as
   `omni-data.ts` and `loc-data.ts` — the sections are large and animated, and a
   900-line component with its own prose in it cannot be re-read.

   ── What may and may not be said here ───────────────────────────────
   The reference's spec is explicit, because most of this page was written from
   two supplied product manuals:

   · **Never on the page, and never in this file:** Wi-Fi network names,
     passwords, IP addresses, admin logins, or the partner's screenshots and
     branding from those manuals.
   · **No figures** for crash thresholds, speed values, battery readings or
     LiDAR range. The battery panel and the LiDAR read-outs use words, meters
     and gauges rather than numbers, deliberately — see `SstBattery.tsx`.
   · The electrical specs that *are* quoted (12–24 V DC supply, 30 A relay,
     12–80 V key-on sense, 12 V DC for the reverse alarm) come from those
     manuals and are the only hard numbers on the page besides the ±10 mm LiDAR
     sensor accuracy, which is the same figure `/hardware/rtls` quotes.

   ── The LiDAR framing ───────────────────────────────────────────────
   Crash, speed and location are three products in the nav but **one sensor** on
   the truck. The page says so everywhere: one LiDAR section answering three
   questions, a "Through LiDAR" line on each of the three cards, and one row per
   answer in the compare table. The rear-facing Reverse Sensor Alarm is a
   separate device and is kept separate — it is not one of the six.
   ========================================================================== */

/** Where the media lives. The three `/omnibox/` paths are the same files the
    Omnibox page already ships — byte-identical in the reference too — so they
    are referenced rather than copied a second time into `/sensor-stack/`. */
export const IMG = {
  truck: "/sensor-stack/stack-truck.jpg",
  access: "/sensor-stack/access.jpg",
  crash: "/sensor-stack/crash.jpg",
  speed: "/sensor-stack/speed.jpg",
  location: "/sensor-stack/location.jpg",
  pds: "/sensor-stack/pds.jpg",
  bms: "/sensor-stack/bms.jpg",
  lidar: "/sensor-stack/lidar.jpg",
  rsa: "/sensor-stack/rsa.jpg",
  whereForklift: "/omnibox/where-forklift.jpg",
  whereDock: "/omnibox/where-dock.jpg",
  motionTruck: "/omnibox/omnibox-motion-truck.jpg",
} as const;

/** The forklift the film and the LiDAR showcase both drive. */
export const FORK_GLB = "/sensor-stack/rams-forklift.glb";

/* ── 02 the problem ──────────────────────────────────────────────── */

/**
 * The six questions that fly in and dock into one truck record.
 *
 * `x`/`y` are fractions of the fuse frame and `r` a resting tilt, exactly as
 * the reference's `data-x`/`data-y`/`data-r`. Each one names the place the
 * answer comes from today — a key log, a walk-round, a radio — which is the
 * whole point of the animation: six places become one.
 */
export const SIGNALS: { label: string; src: string; x: number; y: number; r: number }[] = [
  { label: "Who started it?", src: "Key log", x: 0.17, y: 0.2, r: -4 },
  { label: "Rack upright bent", src: "Walk-round", x: 0.8, y: 0.17, r: 3 },
  { label: "Too fast by the dock", src: "Complaint", x: 0.14, y: 0.72, r: 3 },
  { label: "Where’s truck 07?", src: "Radio", x: 0.47, y: 0.47, r: -2 },
  { label: "Loaded or empty?", src: "Guesswork", x: 0.83, y: 0.7, r: -3 },
  { label: "Battery died mid-shift", src: "Workshop", x: 0.5, y: 0.88, r: 2 },
];

export const PROBLEMS: { n: string; h: string; p: string; fix: string }[] = [
  {
    n: "01",
    h: "Anyone can drive it",
    p: "A key on a hook doesn’t know who’s trained. The truck starts for whoever turns it.",
    fix: "Card, PIN or fingerprint before it starts.",
  },
  {
    n: "02",
    h: "Damage is found days later",
    p: "A bent upright or a scraped door turns up on a walk-round, with no idea when, how or who.",
    fix: "Every impact logged the moment it happens.",
  },
  {
    n: "03",
    h: "Speed is a feeling",
    p: "“Too fast by the dock” is a complaint, not data — and one limit for the whole site fits nowhere.",
    fix: "Limits per zone, checked against where the truck is.",
  },
  {
    n: "04",
    h: "Trucks go missing",
    p: "Finding a truck, a load or a battery that’s about to fail still means walking the floor.",
    fix: "Live position, load state and battery health for every truck.",
  },
];

/* ── 03 the six sensors ──────────────────────────────────────────── */

export type SheetKey = "access" | "lidar" | "pds" | "bms";
export type DeviceKey = "access" | "lidar" | "pds" | "rsa" | "bms";
/** Which of the LiDAR showcase's three answers to open on. */
export type LidarMode = "position" | "speed" | "impact";

export type SensorCard = {
  key: string;
  img: string;
  alt: string;
  tag: string;
  name: string;
  /** The bold opening clause, then the rest of the line. */
  lead: [string, string];
  checks: string[];
  /** Present on the three the LiDAR answers — the "Through LiDAR" line. */
  via?: boolean;
  /** Which sheet "Learn more" opens. */
  sheet: SheetKey;
  /** The secondary action: jump to a section, or to a LiDAR mode. */
  go: { label: string; to: string } | { label: string; lidar: LidarMode };
};

export const SENSORS: SensorCard[] = [
  {
    key: "access",
    img: IMG.access,
    alt: "RAMS Access Control unit: blue faceplate with RFID reader, fingerprint sensor and keypad",
    tag: "MHE and area access",
    name: "Access Control",
    lead: ["Only the right people drive.", "RFID card, PIN or fingerprint before the truck will start."],
    checks: [
      "Card, 4-digit PIN or fingerprint",
      "Switches the truck’s key circuit",
      "Enrol, import and export operators",
    ],
    sheet: "access",
    go: { label: "Try it", to: "access" },
  },
  {
    key: "crash",
    img: IMG.crash,
    alt: "LiDAR view of a forklift clipping a rack upright, with the impact marked",
    tag: "Impact detection",
    name: "Crash Monitoring",
    lead: ["Every knock, on record.", "The moment it happens, with what was hit and where."],
    checks: [
      "Impact logged as it happens",
      "The place, from the LiDAR picture",
      "Tied to the operator who logged in",
    ],
    via: true,
    sheet: "lidar",
    go: { label: "Watch it", lidar: "impact" },
  },
  {
    key: "speed",
    img: IMG.speed,
    alt: "LiDAR view of a forklift entering a slow zone marked on the floor",
    tag: "Zone-based limits",
    name: "Speed Monitoring",
    lead: ["Slower where it matters.", "A limit for each zone — aisles, docks, walkways."],
    checks: [
      "Different limits for different zones",
      "Knows which zone the truck is in",
      "Every overspeed logged with the place",
    ],
    via: true,
    sheet: "lidar",
    go: { label: "Watch it", lidar: "speed" },
  },
  {
    key: "location",
    img: IMG.location,
    alt: "LiDAR view of a forklift with its position and trail marked on the floor",
    tag: "Real-time asset location",
    name: "Location Monitoring",
    lead: ["Every truck, on the map.", "Positioned live against your floor plan."],
    checks: [
      "Live position of every truck",
      "A trail of where it’s been",
      "Nothing to fit to walls or racking",
    ],
    via: true,
    sheet: "lidar",
    go: { label: "Watch it", lidar: "position" },
  },
  {
    key: "pds",
    img: IMG.pds,
    alt: "RAMS Pallet Detection Sensor: a black box with two sensing heads on top",
    tag: "Automated pallet sensing",
    name: "Pallet Detection",
    lead: ["Knows what’s on the forks.", "Two sensing heads tell a loaded lift from an empty one."],
    checks: [
      "Pallet on or off, every lift",
      "Picks and drops counted for you",
      "A small box on the carriage",
    ],
    sheet: "pds",
    go: { label: "See it work", to: "pallet" },
  },
  {
    key: "bms",
    img: IMG.bms,
    alt: "Battery management chip",
    tag: "Health and charge cycles",
    name: "Battery Management",
    lead: ["No battery surprises.", "Charge, health and cycles for every truck."],
    checks: ["Charge level through the shift", "Every charge cycle counted", "Health trend before it fails"],
    sheet: "bms",
    go: { label: "See it", to: "battery" },
  },
];

/** Identify + See + Sense + Record → one box on the truck. */
export const FORMULA: { b: string; s: string }[] = [
  { b: "Identify", s: "Who’s at the controls." },
  { b: "See", s: "The space around the truck, in 3D." },
  { b: "Sense", s: "The load on the forks and the battery underneath." },
  { b: "Record", s: "Every event, with the place and the driver." },
];

/* ── 04 the LiDAR showcase ───────────────────────────────────────── */

/** The read-out copy for each of the three answers. */
export const LIDAR_COPY: Record<LidarMode, { k: string; h: string; p: string }> = {
  position: {
    k: "Location monitoring",
    h: "Every truck, on the map.",
    p: "The LiDAR matches what it sees to your floor plan, so each truck’s position is known live — with nothing fitted to the walls.",
  },
  speed: {
    k: "Speed monitoring",
    h: "A limit for every zone.",
    p: "Open aisles, walkways and the dock each get their own limit. The truck checks its speed against the zone it’s actually in.",
  },
  impact: {
    k: "Crash monitoring",
    h: "Every knock, on record.",
    p: "When the truck touches something, the impact is logged on the spot — with what it hit, where, and who was driving.",
  },
};

export const LIDAR_TABS: { mode: LidarMode; label: string }[] = [
  { mode: "position", label: "Location" },
  { mode: "speed", label: "Speed" },
  { mode: "impact", label: "Crash" },
];

export const LIDAR_FACTS: { b: string; s: string }[] = [
  {
    b: "±10 mm LiDAR accuracy",
    s: "The sensor accuracy behind the LiDAR positioning RAMS runs on its trucks today.",
  },
  { b: "Nothing on the walls", s: "No tags, anchors or reflectors. The truck sees the building itself." },
  {
    b: "One sensor, three jobs",
    s: "Position, speed and impact all come from the same picture of the space.",
  },
];

export const RSA_PILLS = ["12 V DC", "30 A relay", "Beacon and buzzer", "Set up from a phone"];

/* ── 05 access control ───────────────────────────────────────────── */

/** The demo's own PIN. Made up for the page — see `SstAccess.tsx`. */
export const DEMO_PIN = "2468";

export const ACCESS_STEPS: { b: string; s: string }[] = [
  { b: "Identify", s: "A card, a PIN or a finger." },
  { b: "Authenticate", s: "Checked against the enrolled operators." },
  { b: "Authorise", s: "Only a match closes the key circuit." },
];

/** Straight from the supplied manual; the only hard electricals on the page. */
export const ACCESS_SPECS: { b: string; s: string }[] = [
  { b: "3 ways in", s: "RFID card, 4-digit PIN or fingerprint" },
  { b: "12–24 V DC", s: "Supply, from the truck’s battery" },
  { b: "30 A relay", s: "Switches the truck’s key circuit" },
  { b: "12–80 V", s: "Key-on sense, so it knows the truck is on" },
];

/* ── 07 the hardware viewer ──────────────────────────────────────── */

export const HW_TABS: {
  key: DeviceKey;
  tab: string;
  h: string;
  p: string;
  img: string;
  alt: string;
  /** The caption's link: a sheet, or the LiDAR showcase. */
  cta: { label: string; sheet: SheetKey } | { label: string; lidar: LidarMode };
}[] = [
  {
    key: "access",
    tab: "Access Control",
    h: "Access Control",
    p: "A sealed white enclosure with an RFID reader, a fingerprint sensor and a 12-key keypad on the face, a power switch on the side and two cable glands underneath.",
    img: IMG.access,
    alt: "Access Control unit",
    cta: { label: "Learn more about Access Control", sheet: "access" },
  },
  {
    key: "lidar",
    tab: "LiDAR",
    h: "LiDAR",
    p: "Mounted up high on the truck, it sees the space all around in 3D — the one picture behind crash, speed and location monitoring.",
    img: IMG.lidar,
    alt: "LiDAR",
    cta: { label: "Learn more about the LiDAR", sheet: "lidar" },
  },
  {
    key: "pds",
    tab: "Pallet sensor",
    h: "Pallet Detection Sensor",
    p: "A compact black housing for the fork carriage, with two sensing heads on top and a single locking power lead.",
    img: IMG.pds,
    alt: "Pallet Detection Sensor",
    cta: { label: "Learn more about Pallet Detection", sheet: "pds" },
  },
  {
    key: "rsa",
    tab: "Reverse alarm",
    h: "Reverse Sensor Alarm",
    p: "A LiDAR puck on a blue face, with Power, Sense and Trigger lights, wired to a beacon that sounds when something is too close behind.",
    img: IMG.rsa,
    alt: "Reverse Sensor Alarm",
    cta: { label: "See the LiDAR view", lidar: "impact" },
  },
  {
    key: "bms",
    tab: "Battery chip",
    h: "Battery management chip",
    p: "Sits with the truck’s battery and keeps track of its charge, its cycles and its health.",
    img: IMG.bms,
    alt: "Battery management chip",
    cta: { label: "Learn more about Battery Management", sheet: "bms" },
  },
];

/* ── 08 at a glance ──────────────────────────────────────────────── */

export const COMPARE_HEAD = ["The question", "Where it sits", "How it knows"];

export const COMPARE_ROWS: { h: string; cells: string[] }[] = [
  { h: "Access Control", cells: ["Is this person allowed to drive?", "By the driver", "RFID card, PIN keypad, fingerprint"] },
  { h: "Crash Monitoring", cells: ["What did it hit, and where?", "High on the truck", "LiDAR"] },
  { h: "Speed Monitoring", cells: ["Too fast for this zone?", "High on the truck", "LiDAR"] },
  { h: "Location Monitoring", cells: ["Where is every truck?", "High on the truck", "LiDAR"] },
  { h: "Pallet Detection", cells: ["Loaded or empty?", "On the fork carriage", "Two sensing heads"] },
  { h: "Battery Management", cells: ["Charge, health and cycles?", "At the battery", "Battery management chip"] },
  { h: "Reverse Sensor Alarm", cells: ["What’s behind while reversing?", "Back of the truck", "LiDAR, with beacon and buzzer"] },
];

/* ── 09 where it's used ──────────────────────────────────────────── */

export const WHERE: { img: string; alt: string; pills: string[]; h: string; p: string; wide?: boolean; full?: boolean }[] = [
  {
    img: IMG.whereForklift,
    alt: "Forklift in a warehouse aisle",
    pills: ["Access", "Crash", "Location", "Pallet"],
    h: "Warehouse fleets",
    p: "Every truck identified, located and accounted for, shift after shift.",
    wide: true,
  },
  {
    img: IMG.whereDock,
    alt: "Dock door with a forklift and a pedestrian walkway",
    pills: ["Speed", "Reverse alarm"],
    h: "Docks & walkways",
    p: "Slower where people cross, and eyes behind when reversing.",
  },
  {
    img: IMG.motionTruck,
    alt: "Omnibox Motion on a forklift, with sensor cables plugged in",
    pills: ["All six sensors", "Omnibox Motion"],
    h: "Wired into one box on the truck",
    p: "Know who had the truck, what happened while they had it, and whether its battery will last the next shift — all from one box.",
    full: true,
  },
];

/* ── 11 FAQ ──────────────────────────────────────────────────────── */

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Can we fit this to the trucks we already have?",
    a: "Usually, yes. Access Control wires into the truck’s key circuit and senses key-on anywhere from 12 to 80 V, so it suits a wide range of electric and engine trucks. The other sensors mount on the truck itself. We survey your fleet before anything is ordered.",
  },
  {
    q: "Do we have to fit all six?",
    a: "No. Start with the question that matters most — usually who’s driving, or what’s being hit — and add the rest later. The LiDAR brings crash, speed and location monitoring together.",
  },
  {
    q: "What happens if someone isn’t enrolled?",
    a: "The key circuit stays open and the truck won’t start. Operators can be added, removed, imported and exported at any time from the unit’s setup page.",
  },
  {
    q: "Does any of it need the internet?",
    a: "No. Access Control and the Reverse Sensor Alarm are set up over their own Wi-Fi from a phone or laptop, and the sensors connected to Omnibox Motion are decided on the truck. A network is only used to send events on to the dashboard.",
  },
  {
    q: "Does the LiDAR need anything fitted in the building?",
    a: "No tags, anchors or reflectors. The LiDAR sees the building itself and matches it to your floor plan.",
  },
  {
    q: "How are speed limits set?",
    a: "Per zone. You decide where the aisles, docks and walkways are and what each one allows; the truck checks its speed against the zone it’s actually in.",
  },
  {
    q: "Is this a certified safety system?",
    a: "No. It’s a layer that identifies, warns and records. It doesn’t replace operator training, your site rules, or your truck’s own safety equipment.",
  },
];

/* ── the sheets ──────────────────────────────────────────────────── */

export type Sheet = {
  key: SheetKey;
  label: string;
  title: string;
  intro: string;
  hero: string;
  heroAlt: string;
  outcomes: { t: string; s: string }[];
  /** The heading over the short pill list, and the list. */
  does: { heading: string; items: string[] };
  /** The in-sheet link: to a section, or to a LiDAR mode. */
  jump?: { label: string; to: string } | { label: string; lidar: LidarMode };
  ctx?: { img: string; alt: string; title: string; body: string };
  specs?: [string, string][];
  ctaLine: string;
  mail: string;
};

export const SHEETS: Sheet[] = [
  {
    key: "access",
    label: "Access Control",
    title: "Only trained, authorised people drive.",
    intro:
      "An RFID reader, a fingerprint sensor and a keypad in one sealed unit, wired into the truck’s key circuit. No match, no start.",
    hero: IMG.access,
    heroAlt: "Access Control unit",
    outcomes: [
      { t: "The right person at the controls", s: "Only enrolled operators can start the truck." },
      { t: "No shared keys", s: "Card, PIN or fingerprint — whichever suits the site." },
      { t: "No IT project", s: "Set up from a phone over the unit’s own Wi-Fi. No site network needed." },
    ],
    does: {
      heading: "What it does",
      items: [
        "Reads RFID cards",
        "Takes a 4-digit PIN",
        "Reads fingerprints",
        "Enrols operators",
        "Imports & exports lists",
        "Switches the key circuit",
      ],
    },
    jump: { label: "Try the demo", to: "access" },
    ctx: {
      img: IMG.whereForklift,
      alt: "Forklift in a warehouse aisle",
      title: "Where it’s used",
      body: "Forklifts and other MHE shared across shifts, and areas where only certain people should operate equipment. It mounts on pre-drilled holes near the driver and has its own power switch.",
    },
    specs: [
      ["Ways in", "RFID card, 4-digit PIN, fingerprint"],
      ["Supply", "12–24 V DC"],
      ["Relay", "30 A, in the truck’s key circuit"],
      ["Key-on sense", "12–80 V"],
      ["Setup", "Phone or laptop, over the unit’s own Wi-Fi"],
      ["Mounting", "Pre-drilled holes, power switch on the side"],
    ],
    ctaLine: "Want only trained drivers on your trucks?",
    mail: "mailto:connect@rams.digital?subject=Access%20Control",
  },
  {
    key: "lidar",
    label: "Crash · Speed · Location",
    title: "One picture. Three answers.",
    intro:
      "A LiDAR on the truck sees the space around it in 3D. The same picture tells the truck where it is, how fast it’s going against the zone it’s in, and the moment it hits something.",
    hero: IMG.location,
    heroAlt: "LiDAR view of a forklift in a warehouse",
    outcomes: [
      { t: "Crash monitoring", s: "Every impact recorded as it happens, with the place and the operator." },
      { t: "Speed monitoring", s: "A limit for each zone, checked against where the truck actually is." },
      { t: "Location monitoring", s: "Every truck’s live position and trail, on your floor plan." },
    ],
    does: {
      heading: "What it records",
      items: [
        "Impacts, with place",
        "Overspeeds, with zone",
        "Live position",
        "Where it’s been",
        "Who was driving",
        "Nothing on the walls",
      ],
    },
    jump: { label: "Watch the live view", lidar: "position" },
    ctx: {
      img: IMG.whereDock,
      alt: "Dock door with a forklift and a pedestrian walkway",
      title: "Behind the truck, too",
      body: "The Reverse Sensor Alarm puts a LiDAR on the back of the truck. It measures what’s behind while reversing and sounds the beacon — 12 V DC, a 30 A relay, and Power, Sense and Trigger lights on the face.",
    },
    specs: [
      ["Senses", "The space around the truck, in 3D"],
      ["Accuracy", "±10 mm LiDAR sensor accuracy"],
      ["In the building", "Nothing — no tags, anchors or reflectors"],
      ["Answers", "Position, speed against zone limits, impacts"],
    ],
    ctaLine: "Want to know what your trucks are hitting?",
    mail: "mailto:connect@rams.digital?subject=LiDAR%20crash%2C%20speed%20and%20location",
  },
  {
    key: "pds",
    label: "Pallet Detection",
    title: "Loaded or empty, every lift.",
    intro:
      "A compact sensor on the fork carriage with two sensing heads. It knows the moment a pallet is on the forks and the moment it comes off.",
    hero: IMG.pds,
    heroAlt: "Pallet Detection Sensor",
    outcomes: [
      { t: "Moves counted for you", s: "Picks and drops, per truck and per operator." },
      { t: "Empty travel you can see", s: "Loaded and empty driving told apart." },
      { t: "Events with context", s: "Every impact and overspeed knows whether a load was on." },
    ],
    does: { heading: "What it is", items: ["Two sensing heads", "Fits the fork carriage", "One locking power lead"] },
    ctx: {
      img: IMG.whereForklift,
      alt: "Forklift in a warehouse aisle",
      title: "Where it’s used",
      body: "Any truck that picks and drops pallets — counterbalance, reach and pallet trucks — where knowing the load turns a trip log into a record of real work.",
    },
    ctaLine: "Want every move counted?",
    mail: "mailto:connect@rams.digital?subject=Pallet%20Detection",
  },
  {
    key: "bms",
    label: "Battery Management",
    title: "No battery surprises.",
    intro:
      "A battery management chip at the truck’s battery follows its charge, counts its cycles and tracks its health — for every truck in the fleet.",
    hero: IMG.bms,
    heroAlt: "Battery management chip",
    outcomes: [
      { t: "Trucks that last the shift", s: "Charge level followed through the day." },
      { t: "Batteries you can plan for", s: "Every charge cycle counted, truck by truck." },
      { t: "Failures seen early", s: "A health trend, before it becomes a breakdown." },
    ],
    does: { heading: "What it tracks", items: ["Charge level", "Charge cycles", "Battery health"] },
    ctaLine: "Tired of batteries dying mid-shift?",
    mail: "mailto:connect@rams.digital?subject=Battery%20Management",
  },
];

export const SHEET_BY_KEY: Record<SheetKey, Sheet> = Object.fromEntries(
  SHEETS.map((s) => [s.key, s]),
) as Record<SheetKey, Sheet>;

/** Which device the 3D viewer shows for a given sheet's "See it in 3D". */
export const SHEET_DEVICE: Record<SheetKey, DeviceKey> = {
  access: "access",
  lidar: "lidar",
  pds: "pds",
  bms: "bms",
};
