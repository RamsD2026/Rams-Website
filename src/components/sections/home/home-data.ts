/**
 * The content of the rebuilt top half of the homepage.
 *
 * The argument is the existing page's — it was already right. What changed is
 * how much code is needed to make it: `TechnologySystems.tsx` spent 1,961 lines
 * saying what `SYSTEMS` below says in forty, because it hard-coded every card
 * instead of rendering a list.
 *
 * Copy sources are named per block so the old sections can be checked against
 * these before anyone deletes them.
 */

/** From `ChallengeSelector` — "What operational challenge are you solving today?" */
export const GAPS: { b: string; s: string }[] = [
  {
    b: "Damage nobody logged",
    s: "A rack gets hit on a Tuesday and the report arrives, if it arrives, at the next inspection.",
  },
  {
    b: "Stock the system cannot find",
    s: "The count says it is here. The aisle says otherwise. Somebody walks the building to settle it.",
  },
  {
    b: "Trucks with no memory",
    s: "Who drove it, how fast, what it hit, whether it was loaded — none of it survives the shift.",
  },
  {
    b: "Events without a place",
    s: "A near-miss you cannot locate is a story. One you can locate is something you can fix.",
  },
];

/**
 * From `TechnologySystems` — "One platform. Five intelligent systems."
 *
 * `href` points at what exists today. The five hardware routes are all live;
 * the twin is a platform route.
 */
export const SYSTEM_CARDS: {
  id: string;
  name: string;
  line: string;
  body: string;
  href: string;
}[] = [
  {
    id: "vision",
    name: "AI Vision",
    line: "Sees what is happening, while it happens",
    body: "Cameras that understand people, vehicles and zones at the edge, and act inside the moment rather than after a review.",
    href: "/hardware/ai-vision",
  },
  {
    id: "rack",
    name: "Rack Intelligence",
    line: "Every rack with an identity and a history",
    body: "Condition, damage and certification held against the bay it belongs to, not a PDF in somebody's inbox.",
    href: "/solutions/rack-safety-intelligence",
  },
  {
    id: "mhe",
    name: "MHE Intelligence",
    line: "Trucks that remember their shift",
    body: "Operator, speed, impacts, load and battery, taken from the vehicle and tied to where it was at the time.",
    href: "/hardware/sensor-stack",
  },
  {
    id: "location",
    name: "Location Intelligence",
    line: "The where, indoors, where GPS stops",
    body: "LiDAR, UWB, Bluetooth and Wi-Fi, chosen around the decision you need to make rather than sold as one answer.",
    href: "/hardware/rtls",
  },
  {
    id: "twin",
    name: "Digital Twin",
    line: "One live picture of the building",
    body: "Every event, asset and finding placed in the same spatial record, so the floor stops being anecdote.",
    href: "/platform/digital-twin",
  },
];

/** From `ThreeWaysToStart` — "Start with a service, a device or the platform." */
export const STARTS: {
  n: string;
  b: string;
  s: string;
  cta: string;
  href: string;
}[] = [
  {
    n: "01",
    b: "Start with a service",
    s: "An inspection, an audit or an assessment. You get a finding and a measured picture of where you stand, and nothing has to be installed.",
    cta: "See the services",
    href: "/services",
  },
  {
    n: "02",
    b: "Start with a device",
    s: "One camera on one robot cell, or one truck fitted with the stack. Small enough to prove on a single aisle before it goes anywhere else.",
    cta: "See the hardware",
    href: "/hardware/ai-vision",
  },
  {
    n: "03",
    b: "Start with the platform",
    s: "Bring what you already record into one spatial picture, and add the sensing that fills the gaps it exposes.",
    cta: "See the platform",
    href: "/platform/overview",
  },
];
