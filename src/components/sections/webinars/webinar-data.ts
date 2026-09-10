import { EMAIL } from "@/components/sections/contact/contact-data";

/**
 * The webinar programme, from `RAMS_Digital_Webinars.html`.
 *
 * ── Nine sessions, and no file behind any of them ───────────────────
 * The source lists nine recordings with titles, topics and running times,
 * and every one of its play controls links nowhere — there is no `href` on a
 * single card in the document. So the recordings are real as *sessions* and
 * there is nothing to stream today.
 *
 * That leaves two honest options and one dishonest one. The dishonest one is
 * a "Watch recording" button that opens a player with no source in it.
 *
 * What this does instead is the source's own pattern: every action on that
 * page is a `mailto:` with a pre-filled subject — registration included — so
 * each card asks for the recording rather than pretending to play it. It
 * works today, it cannot mislead, and when the files exist, giving a session
 * a `watch` URL is one field and the card switches to a direct link on its
 * own. See `RecordCard`.
 *
 * ── The live session is dated, so it expires ────────────────────────
 * 17 September 2026 is the source's date and it is in the future today. It
 * will not be forever, and `UPCOMING.iso` is what `WebinarUpcoming` reads to
 * decide whether to say "upcoming" or fall back — a page still advertising a
 * live session six months after it ran is worse than one with no session on
 * it. Change the date and the time in one place here.
 *
 * ── The photographs ─────────────────────────────────────────────────
 * Generated for this page rather than taken from a stock library, and every
 * prompt asked for no text, no signage and no logos — so nothing in frame is
 * a mark that belongs to somebody, and nothing carries readable words that
 * would fight the title laid over it. One per session, and each is the
 * session's own subject rather than a warehouse that happens to be nearby.
 *
 * They are their own set, not the case studies'. Two `/resources` pages
 * showing the same six photographs would read as a stock folder rather than
 * as two pages.
 *
 * ── The speaker is a real person ────────────────────────────────────
 * Named in the source, so named here — with initials rather than a portrait.
 * No generated photograph goes next to a real person's name on this site.
 */

/** A mailto with a pre-filled subject, the way the source does every action. */
export const ask = (subject: string, body?: string) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}` +
  (body ? `&body=${encodeURIComponent(body)}` : "");

/* ── the live session ─────────────────────────────────────────────── */

export const UPCOMING = {
  /** ISO date, for the comparison in `WebinarUpcoming`. Never a display string. */
  iso: "2026-09-17",
  day: "17",
  month: "Sep 2026",
  time: "11:00 AM IST",
  kicker: "Live online session · Free registration",
  title: "Rack Safety Matters",
  subtitle: "Protecting People, Inventory & Warehouse Operations",
  body: "A practical leadership session on why rack safety is more than an annual inspection. How damage develops, what effective risk classification looks like, how corrective actions should be closed, and why traceable visibility matters across the warehouse.",
  facts: [
    ["Format", "Expert presentation + Q&A"],
    ["Duration", "60 minutes"],
    ["Who should join", "EHS, Operations & Maintenance"],
  ] as [string, string][],
  speaker: { name: "Greeba Rampaul-Essue", initials: "GR" },
  img: "/webinars/upcoming.webp",
  alt: "A safety manager with a tablet standing at the end of a tall pallet racking aisle, looking up at the uprights.",
  note: "Registration opens an email request so the RAMS team can confirm attendance and share the joining link.",
  href: ask(
    "Webinar Registration - Rack Safety Matters",
    "Hello RAMS Digital,\n\nI would like to register for Rack Safety Matters on 17 September 2026 at 11:00 AM IST.\n\nName:\nCompany:\nDesignation:\nEmail:\nPhone:\n\nThank you.",
  ),
};

/* ── the recordings ───────────────────────────────────────────────── */

export type Recording = {
  id: string;
  /** Filter topics. Several sessions sit under two. */
  topics: string[];
  /** The mono line over the title — the source's own kicker. */
  kicker: string;
  /** The coloured lead-in. */
  label: string;
  title: string;
  body: string;
  /** Running time in whole minutes. */
  minutes: number;
  /** Lowercase keywords the search matches, from the source's `data-search`. */
  search: string;
  /** A real recording URL, when one exists. Until then the card asks. */
  watch?: string;
  /** The card's background photograph. */
  img: string;
  alt: string;
};

const RACK = "Rack safety";
const MHE = "MHE";
const TWIN = "Digital twin";
const OPS = "Operations";

export const RECORDINGS: Recording[] = [
  {
    id: "rack-programme",
    topics: [RACK],
    kicker: "Rack safety · Practical guide",
    label: "Rack safety",
    title: "Rack Safety Program: A Step-by-Step Guide",
    body: "Build a repeatable programme from asset register and inspection frequency to damage classification, action ownership and verified closure.",
    minutes: 48,
    search: "rack safety program step by step inspection risk classification closure",
    img: "/webinars/rack-programme.webp",
    alt: "A clean, undamaged blue steel rack upright bolted to a warehouse floor, tall racking receding into a dark aisle.",
  },
  {
    id: "identify-damage",
    topics: [RACK],
    kicker: "Inspection · Field awareness",
    label: "Rack inspection",
    title: "How to Identify and Prioritise Rack Damage",
    body: "Recognise common upright, beam, bracing and baseplate issues — and understand what must be isolated, replaced or observed.",
    minutes: 42,
    search: "identify rack damage upright beam bracing baseplate red amber green",
    img: "/webinars/identify-damage.webp",
    alt: "Gloved hands examining a bent steel rack upright under a torch beam in a dark warehouse aisle.",
  },
  {
    id: "load-capacity",
    topics: [RACK],
    kicker: "Structural · Load capacity",
    label: "Structural safety",
    title: "Rack Load Capacity: What Changes the Answer?",
    body: "How pallet weight, beam levels, frame configuration, connections and physical condition affect the safe operating decision.",
    minutes: 51,
    search:
      "rack load capacity configuration beam level pallet weight structural verification",
    img: "/webinars/load-capacity.webp",
    alt: "Looking up a very tall loaded pallet racking bay, wrapped pallets on several beam levels.",
  },
  {
    id: "people-forklifts",
    topics: [MHE],
    kicker: "MHE safety · People interface",
    label: "MHE safety",
    title: "People, Forklifts and the Space Between Them",
    body: "Routes, blind spots, crossings, impact-prone zones and the operating controls that reduce people–vehicle exposure.",
    minutes: 45,
    search: "forklift pedestrian safety routes blind spots speed impact near miss",
    img: "/webinars/people-forklifts.webp",
    alt: "A worker in a hi-vis vest crossing a warehouse traffic aisle as a forklift approaches in the blurred background.",
  },
  {
    id: "vehicle-hours",
    topics: [MHE, OPS],
    kicker: "Productivity · Fleet evidence",
    label: "MHE productivity",
    title: "Where Does Every Vehicle Hour Go?",
    body: "Separate productive handling, empty travel, waiting, charging and unused capacity before making fleet or process decisions.",
    minutes: 39,
    search: "mhe utilisation productivity idle travel congestion fleet assessment",
    img: "/webinars/vehicle-hours.webp",
    alt: "A row of electric forklifts parked and charging in a dim warehouse charging bay at night.",
  },
  {
    id: "living-model",
    topics: [TWIN, OPS],
    kicker: "Digital twin · Physical context",
    label: "Digital twin",
    title: "From a Warehouse Model to a Living Operational System",
    body: "How geometry, tagged assets, lifecycle history and live operational data create persistent physical context.",
    minutes: 54,
    search: "digital twin warehouse physical asset live visibility remote management",
    img: "/webinars/living-model.webp",
    alt: "A vast dark warehouse interior seen from a high mezzanine, long rows of racking receding into light beams.",
  },
  {
    id: "irds-walkthrough",
    topics: [RACK, TWIN],
    kicker: "IRDS · Inspection to closure",
    label: "Platform walkthrough",
    title: "Digital Rack Management: Inspection to Verified Closure",
    body: "Follow a finding from the exact rack location through evidence, classification, action, rectification and verification.",
    minutes: 32,
    search: "digital rack inspection manual report closure twin irds visibility",
    img: "/webinars/irds-walkthrough.webp",
    alt: "A warehouse operative holding a rugged handheld scanner beside a racking bay, the screen lighting their hands.",
  },
  {
    id: "between-departments",
    topics: [OPS],
    kicker: "Operations · Whole-warehouse view",
    label: "Warehouse operations",
    title: "Why Risk Lives Between Departments",
    body: "Connect safety, flow, maintenance, storage and governance findings into one prioritised operational roadmap.",
    minutes: 46,
    search: "warehouse operational assessment safety flow management visibility actions",
    img: "/webinars/between-departments.webp",
    alt: "A warehouse goods-in staging area at night, empty marked floor bays and stacked pallets under long shadows.",
  },
  {
    id: "beyond-reports",
    topics: [OPS, TWIN],
    kicker: "Management · Multi-site visibility",
    label: "Management visibility",
    title: "Beyond Reports: Seeing the Physical Operation Directly",
    body: "How leaders can open a site, inspect a location or asset, and review evidence and history without relying on layered summaries.",
    minutes: 41,
    search:
      "multi site management visibility aims dashboard direct evidence trends actions",
    img: "/webinars/beyond-reports.webp",
    alt: "An operations manager silhouetted in a dark control room in front of glowing wall-mounted screens.",
  },
];

/**
 * The tabs, walked out of the sessions rather than typed beside them — the
 * same derivation `case-data`, `video-data` and `news-data` use, and the only
 * way a filter bar cannot end up hiding part of its own set.
 *
 * The source hard-codes four buttons against nine sessions. Derived, they
 * come out the same four today and stay correct tomorrow.
 */
export const TOPICS: string[] = RECORDINGS.reduce<string[]>(
  (out, r) => [...out, ...r.topics.filter((t) => !out.includes(t))],
  [],
);

/* ── the learning tracks ──────────────────────────────────────────── */

export const TRACKS: { title: string; body: string; href: string }[] = [
  {
    title: "Rack safety & lifecycle",
    body: "Inspection programmes, damage, load capacity, rectification and verified closure.",
    href: "/platform/irds",
  },
  {
    title: "MHE safety & productivity",
    body: "People–vehicle interaction, routes, impacts, utilisation, waiting and fleet decisions.",
    href: "/platform/rtss",
  },
  {
    title: "Digital twin & visibility",
    body: "Tagged assets, physical context, history, live change and remote operational access.",
    href: "/platform/digital-twin",
  },
  {
    title: "Warehouse operations",
    body: "Flow, staging, inventory interfaces, governance and end-to-end assessment.",
    href: "/solutions/warehouse-execution",
  },
  {
    title: "Fleet health & maintenance",
    body: "Hours, cycles, faults and impacts read off the machine rather than logged by hand.",
    href: "/platform/imds",
  },
  {
    title: "Management intelligence",
    body: "Multi-site comparison, trends, action ageing and direct access to source evidence.",
    href: "/platform/ai-operational-intelligence",
  },
];

/* ── the three on the shelf under the hero ────────────────────────── */

/**
 * What the featured carousel shows.
 *
 * There is one dated live session in the source and there is no second one.
 * Two more invented dates would be the worst kind of placeholder — a webinar
 * page advertising sessions nobody has scheduled — so the other two cards are
 * recordings, and each card says which it is: a LIVE pill with the date, or a
 * RECORDING pill with the running time.
 *
 * Give this a second and third live session and they take the second and
 * third slots; the type already handles both.
 */
export type Featured = {
  id: string;
  /** "live" carries a date and registers; "recording" carries a length. */
  kind: "live" | "recording";
  pill: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  img: string;
  alt: string;
};

const REC = (id: string, cta: string): Featured => {
  const r = RECORDINGS.find((x) => x.id === id);
  if (!r) throw new Error("no recording: " + id);
  return {
    id: r.id,
    kind: "recording",
    pill: `Recording · ${r.minutes} min`,
    title: r.title,
    body: r.body,
    cta,
    href: ask(
      `Webinar recording - ${r.title}`,
      `Hello RAMS Digital,

Please send me the recording of "${r.title}".

Name:
Company:
Email:

Thank you.`,
    ),
    img: r.img,
    alt: r.alt,
  };
};

export const FEATURED: Featured[] = [
  {
    id: "live",
    kind: "live",
    pill: `Live · ${UPCOMING.day} ${UPCOMING.month} · ${UPCOMING.time}`,
    title: UPCOMING.title,
    body: UPCOMING.subtitle,
    cta: "Register for the webinar",
    href: UPCOMING.href,
    img: UPCOMING.img,
    alt: UPCOMING.alt,
  },
  REC("rack-programme", "Request the recording"),
  REC("people-forklifts", "Request the recording"),
];
