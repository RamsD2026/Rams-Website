/**
 * The newsroom's stories, and what the announcement areas are.
 *
 * ── These are real, and they were checked ───────────────────────────
 * Six articles, from `RAMS_Digital_Newsroom.html`. The source says of its own
 * grid: "Every published story below links to an existing RAMS Digital
 * article." Every URL below was requested and returned 200 before it was
 * written down — a newsroom of dead links is worse than an empty one.
 *
 * The feed shipped empty before this, because there was no source and a dated
 * announcement is the one kind of content where an invented entry is a false
 * statement about what a company said and when. The source arrived; the
 * entries are its, not this file's.
 *
 * ── The host is `backend.rams.digital`, and that is worth knowing ───
 * That is the host the source document links, and the only one that serves
 * these slugs — `rams.digital` and `www.rams.digital` both 404 on all six.
 * It reads like a WordPress backend rather than the public front door, so if
 * the articles are ever fronted on the main domain these six `href`s change
 * and nothing else does.
 *
 * ── A story has topics, not a kind ──────────────────────────────────
 * `case-data` and `video-data` each give an item one `kind`, because a case
 * study is one kind of engagement and a film is one kind of film. The source
 * files these under `data-category="safety operations"` — two at once, five
 * of the six — so this is `topics: string[]` and the filter tests
 * `includes`. Squashing them to one would drop "Safe Load Capacity" out of
 * Operations, which is a tab hiding a story that belongs in it.
 *
 * `TOPICS` is still derived by walking the stories, so a new story with a new
 * topic gets a tab without anybody editing a second list.
 *
 * ── `cover` is two words, not a photograph ──────────────────────────
 * There is no image for any of these articles and there is no honest way to
 * make one — an invented photograph of a collapsed rack attached to a real
 * published piece is a fabricated illustration of a real event. The source
 * solves it the same way: a typographic cover, two words set large. So the
 * card's picture slot holds `cover` and the type sits under it exactly as it
 * does on the case-studies and videos cards.
 */

export type Story = {
  id: string;
  /** "Perspective", "Guide", "Briefing", "Analysis", "Explainer". */
  form: string;
  /** The label on the cover — the source's `cover-type`. */
  subject: string;
  /** Filter topics. A story is usually in more than one. */
  topics: string[];
  /** ISO `YYYY-MM-DD`. Sorted on; never a display string. */
  date: string;
  byline: string;
  title: string;
  body: string;
  /** Two words for the typographic cover. */
  cover: [string, string];
  href: string;
  /** Lowercase keywords the search box matches, from the source. */
  search: string;
};

export const STORIES: Story[] = [
  {
    id: "safe-load-capacity",
    form: "Perspective",
    subject: "Rack safety",
    topics: ["Rack safety", "Operations"],
    date: "2026-07-24",
    byline: "RAMS Digital",
    title: "Safe Load Capacity: The Silent Killer in Poorly Managed Racks",
    body: "Why rack capacity depends on uprights, baseplates, bracing, pallet placement and the full system configuration — not the rating printed on one beam.",
    cover: ["SAFE", "LOAD"],
    href: "https://backend.rams.digital/safe-load-capacity-the-silent-killer-in-poorly-managed-racks/",
    search: "safe load capacity loading racks risk",
  },
  {
    id: "rack-inspections",
    form: "Guide",
    subject: "Inspection",
    topics: ["Rack safety", "Operations"],
    date: "2026-07-24",
    byline: "RAMS Digital",
    title: "What Every Warehouse Should Know About Rack Inspections",
    body: "A practical guide to inspection frequency, structural checks, action tracking and audit-ready records.",
    cover: ["INSPECT", "ACT"],
    href: "https://backend.rams.digital/what-every-warehouse-should-know-about-rack-inspections/",
    search: "warehouse rack inspections audit inspection safety",
  },
  {
    id: "en-15635",
    form: "Briefing",
    subject: "Standards",
    topics: ["Standards", "Rack safety"],
    date: "2026-07-24",
    byline: "RAMS Digital",
    title: "Understanding EN 15635: Simplified for India",
    body: "An overview of roles, inspection cycles, damage classification, documentation and responsible rack use.",
    cover: ["EN", "15635"],
    href: "https://backend.rams.digital/understanding-en-15635-the-global-benchmark-for-rack-safety-simplified-for-india/",
    search: "en 15635 standard rack safety india compliance",
  },
  {
    id: "collapses-not-random",
    form: "Analysis",
    subject: "Risk",
    topics: ["Rack safety", "Operations"],
    date: "2026-07-22",
    byline: "RAMS Digital",
    title: "Rack Collapses Are Not Random: Five Preventable Causes",
    body: "How impacts, loading, undocumented repairs and foundation conditions can combine into structural risk.",
    cover: ["FAILURE", "SIGNALS"],
    href: "https://backend.rams.digital/rack-collapses-are-not-random-5-preventable-causes-you-must-understand/",
    search: "rack collapse preventable causes forklift impact overload repair",
  },
  {
    id: "hidden-danger",
    form: "Perspective",
    subject: "Awareness",
    topics: ["Rack safety", "Operations"],
    date: "2026-07-22",
    byline: "RAMS Digital",
    title: "The Hidden Danger in Your Warehouse",
    body: "Why the structures carrying inventory deserve continuous attention as part of daily operational safety.",
    cover: ["HIDDEN", "RISK"],
    href: "https://backend.rams.digital/the-hidden-danger-in-your-warehouse-why-rack-safety-deserves-more-attention/",
    search: "hidden danger warehouse rack safety structural health",
  },
  {
    id: "grade-a-warehouse",
    form: "Explainer",
    subject: "Warehouse",
    topics: ["Operations"],
    date: "2024-09-20",
    byline: "Aditya Tubachi",
    title: "What Is a Grade A Warehouse?",
    body: "An introduction to the characteristics and market forces shaping demand for modern warehouse infrastructure.",
    cover: ["GRADE", "A"],
    href: "https://backend.rams.digital/what-is-grade-a-warehouse/",
    search: "grade a warehouse demand modern logistics infrastructure",
  },
];

/** Newest first. Sorted here so no component has to remember to. */
export const SORTED: Story[] = [...STORIES].sort((a, b) =>
  b.date.localeCompare(a.date),
);

/**
 * The tabs, walked out of the stories rather than typed beside them — the
 * same derivation `case-data` and `video-data` use, and the only way a filter
 * bar cannot end up hiding part of its own set.
 *
 * The source hard-codes four buttons against six articles. Deriving them
 * gives the same three plus "All stories", and adding a story on a new topic
 * lights its tab up on its own.
 */
export const TOPICS: string[] = SORTED.reduce<string[]>(
  (out, s) => [...out, ...s.topics.filter((t) => !out.includes(t))],
  [],
);

/**
 * The five announcement areas.
 *
 * The source is explicit about what these are, and it is the same position
 * this file took before the stories arrived: "Announcement areas are
 * intentionally structured without invented releases. Add only confirmed
 * information approved for publication."
 *
 * So this is the shape of the announcements section and not its contents.
 * They are categories with nothing filed under them yet, said plainly, rather
 * than five press releases nobody issued.
 */
export const AREAS: { code: string; title: string; body: string }[] = [
  {
    code: "Release",
    title: "Product & platform updates",
    body: "New capabilities, major releases and availability announcements.",
  },
  {
    code: "Company",
    title: "Customer & partner news",
    body: "Approved collaborations, integrations and ecosystem developments.",
  },
  {
    code: "Events",
    title: "Events & appearances",
    body: "Webinars, exhibitions, roundtables and speaking engagements.",
  },
  {
    code: "Insights",
    title: "Research & industry briefs",
    body: "Operational findings, safety perspectives and technical explainers.",
  },
  {
    code: "Corporate",
    title: "Corporate milestones",
    body: "Organisation, market, team and company progress.",
  },
];
