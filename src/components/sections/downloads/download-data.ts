import { EMAIL } from "@/components/sections/contact/contact-data";

/**
 * The resource library, from `RAMS_Digital_Downloads.html`.
 *
 * ── There are no PDFs, and the source says so twice ─────────────────
 * "This concept intentionally does not fabricate PDF downloads. Connect each
 * card to a current, approved file in the website CMS before publication; the
 * request workflow below is ready to use in the meantime." And in the FAQ:
 * "No. This page is the complete front-end experience, but the approved PDF
 * files and their CMS URLs must be supplied and connected before production
 * publication."
 *
 * So no card links to a file. Every action is "Add to pack", and the pack
 * becomes one pre-filled email — which is the source's own design, not a
 * fallback invented here. A download button pointing at a PDF that does not
 * exist is the one thing a downloads page must not do.
 *
 * A resource that gains a `file` URL flips to a real download and relabels
 * itself; `DownloadCard` already handles both. That is the only edit needed
 * when the files land.
 *
 * ── Thirteen, and every one of them is a real RAMS thing ────────────
 * Seven modules that have pages on this site, two hardware units that appear
 * in `TechnologySystems`, one integration guide matching the technical notes,
 * one service, and two company brochures. Nothing was added to round the
 * number up, and no page count, file size or version number is stated —
 * those belong to files that do not exist yet, and inventing "04 pages ·
 * 2.4 MB" is the same failure as inventing the file.
 */

export type Resource = {
  id: string;
  /** The mono line above the title — the source's own label. */
  kind: string;
  /** The owner line beside it. */
  owner: string;
  title: string;
  body: string;
  /** Filter group. Derived into `GROUPS`, never typed twice. */
  group: string;
  /** The two chips under the body. */
  tags: [string, string];
  /** A real approved file, when one exists. Until then the card asks. */
  file?: string;
  /** Keywords the search matches beyond the title and body. */
  search: string;
};

const BROCHURE = "Brochures";
const SOFTWARE = "Software";
const HARDWARE = "Hardware";
const TECHNICAL = "Technical";
const SERVICE = "Service";

export const RESOURCES: Resource[] = [
  {
    id: "digital-twin",
    kind: "Platform brochure",
    owner: "RAMS Digital",
    title: "Digital Twin Platform",
    body: "From a digital model to a living operational system — asset identity, lifecycle, simulation, live data and applications.",
    group: BROCHURE,
    tags: ["Platform", "Overview"],
    search: "digital twin platform model asset identity lifecycle simulation",
  },
  {
    id: "irds",
    kind: "Product sheet",
    owner: "RAMS IRDS",
    title: "IRDS · Rack Intelligence",
    body: "Rack inspection, digital asset records, finding classification, corrective actions and lifecycle visibility.",
    group: SOFTWARE,
    tags: ["Software", "Rack safety"],
    search: "irds rack inspection findings corrective action closure en 15635",
  },
  {
    id: "meps",
    kind: "Product sheet",
    owner: "RAMS MEPS",
    title: "MEPS · MHE Productivity",
    body: "Positioning, movement, utilisation and operational context for material handling equipment.",
    group: SOFTWARE,
    tags: ["Software", "Productivity"],
    search: "meps mhe forklift productivity utilisation movement positioning",
  },
  {
    id: "rtss",
    kind: "Product sheet",
    owner: "RAMS RTSS",
    title: "RTSS · Real-Time Safety",
    body: "Contextual safety monitoring for MHE movement, impacts, operating zones and supported safety events.",
    group: SOFTWARE,
    tags: ["Software", "Safety"],
    search: "rtss real time safety impact near miss pedestrian zone monitoring",
  },
  {
    id: "iros",
    kind: "Product sheet",
    owner: "RAMS IROS",
    title: "IROS · Inventory Intelligence",
    body: "Physical inventory visibility, movement context, dwell analysis, exceptions and storage intelligence.",
    group: SOFTWARE,
    tags: ["Software", "Inventory"],
    search: "iros inventory pallet dwell exception storage visibility",
  },
  {
    id: "imds",
    kind: "Product sheet",
    owner: "RAMS IMDS",
    title: "IMDS · MHE Diagnostics",
    body: "Fleet condition, faults, maintenance planning, service history and equipment lifecycle context.",
    group: SOFTWARE,
    tags: ["Software", "Maintenance"],
    search: "imds fleet condition fault maintenance service history diagnostics",
  },
  {
    id: "atos",
    kind: "Product sheet",
    owner: "RAMS ATOS",
    title: "ATOS · Task Orchestration",
    body: "Operational work assignment, prioritisation, status, escalation and closed-loop execution.",
    group: SOFTWARE,
    tags: ["Software", "Execution"],
    search: "atos task orchestration assignment escalation execution workflow",
  },
  {
    id: "aims",
    kind: "Product sheet",
    owner: "RAMS AIMS",
    title: "AIMS · Management Intelligence",
    body: "Cross-module and multi-site visibility that gives leaders direct access to operational context and trends.",
    group: SOFTWARE,
    tags: ["Software", "Management"],
    search: "aims management intelligence multi site trends dashboard leadership",
  },
  {
    id: "ai-vision-pro",
    kind: "Hardware datasheet",
    owner: "RAMS AI Vision Pro",
    title: "AI Vision Pro",
    body: "Hardware overview for supported wide-area visual intelligence and edge-connected operational events.",
    group: HARDWARE,
    tags: ["Hardware", "Vision"],
    search: "ai vision pro camera edge visual intelligence hardware datasheet",
  },
  {
    id: "omnibox",
    kind: "Hardware overview",
    owner: "RAMS OmniBox",
    title: "OmniBox Edge Family",
    body: "Edge processing options for connecting supported sensors and physical events to RAMS context.",
    group: HARDWARE,
    tags: ["Hardware", "Edge"],
    search: "omnibox edge gateway sensor processing hardware family",
  },
  {
    id: "integration-guide",
    kind: "Technical note",
    owner: "RAMS Integration",
    title: "Integration Readiness Guide",
    body: "Prepare system owners, identifiers, data contracts, update frequencies and security boundaries.",
    group: TECHNICAL,
    tags: ["Technical", "Integration"],
    search: "integration readiness api webhook identifiers data contract security",
  },
  {
    id: "rack-audit",
    kind: "Service brochure",
    owner: "RAMS Rack Audit",
    title: "Rack Audit & Inspection",
    body: "Service scope, inspection workflow, evidence, findings, actions and digital reporting deliverables.",
    group: SERVICE,
    tags: ["Service", "Inspection"],
    search: "rack audit inspection service scope evidence reporting deliverables",
  },
  {
    id: "company-overview",
    kind: "Corporate brochure",
    owner: "RAMS Digital",
    title: "RAMS Digital Overview",
    body: "A concise introduction to RAMS, the platform, product portfolio and engagement pathways.",
    group: BROCHURE,
    tags: ["Company", "Overview"],
    search: "company overview corporate brochure portfolio engagement introduction",
  },
];

/**
 * The tabs, walked out of the library rather than typed beside it — the same
 * derivation `case-data`, `video-data`, `news-data` and `webinar-data` use,
 * and the only way a filter bar cannot end up hiding part of its own set.
 */
export const GROUPS: string[] = RESOURCES.reduce<string[]>(
  (out, r) => (out.includes(r.group) ? out : [...out, r.group]),
  [],
);

/* ── the pack builder ─────────────────────────────────────────────── */

/**
 * The request, as a `mailto:` with the selection listed in the body.
 *
 * The site has no form backend — the contact form hands off to `mailto:` too
 * — so this is the mechanism rather than a stand-in for one, and it is the
 * source's own: "the request workflow below is ready to use in the meantime".
 *
 * The body is built from the titles rather than the ids: the person reading
 * the email is on the RAMS side and needs the document names, not slugs.
 */
export const packHref = (titles: string[]) => {
  const list = titles.map((t) => `- ${t}`).join("\n");
  const body = `Hello RAMS Digital,\n\nPlease send the current approved versions of the following:\n\n${list}\n\nName:\nCompany:\nRole:\nSite or project:\nWhat we are evaluating:\n\nThank you.`;
  return (
    `mailto:${EMAIL}` +
    `?subject=${encodeURIComponent(`RAMS Digital resource pack — ${titles.length} document${titles.length === 1 ? "" : "s"}`)}` +
    `&body=${encodeURIComponent(body)}`
  );
};

/* ── document governance ──────────────────────────────────────────── */

export const GOVERNANCE: { title: string; body: string }[] = [
  {
    title: "Document owner",
    body: "Name the RAMS product, engineering or commercial team responsible for accuracy.",
  },
  {
    title: "Version & date",
    body: "Show a clear revision number and approval date on the detail view and the file itself.",
  },
  {
    title: "Product scope",
    body: "State the applicable module, hardware variant, geography and deployment context.",
  },
  {
    title: "Access level",
    body: "Distinguish public literature from controlled technical or project documentation.",
  },
  {
    title: "Change history",
    body: "Retire superseded files and keep the website linked to the current approved version.",
  },
];

/* ── FAQ ──────────────────────────────────────────────────────────── */

export const FAQS: [string, string][] = [
  [
    "Are the files available to download directly?",
    "Not yet. Every card here requests the document rather than serving it, because the approved files and their versions are issued by the RAMS team. Add what you need to a pack and the request arrives with the list already in it.",
  ],
  [
    "Can some documents require approval?",
    "Yes. Public brochures can become direct downloads, while controlled specifications, integration documents and project material can stay request-only. Each card carries its own access level.",
  ],
  [
    "Can I request several documents together?",
    "That is what the pack is for. Add resources, review the selection, and one pre-filled email goes to the team with every title listed.",
  ],
  [
    "How do I know a specification is current?",
    "Ask. Versions are issued per project and per deployment, and the material the team sends back is the approved current release rather than whatever a website last cached.",
  ],
];
