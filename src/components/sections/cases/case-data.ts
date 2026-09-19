/**
 * The case studies, and the categories derived from them.
 *
 * ── The filters are the offerings (see CATEGORIES) ──────────────────
 * They were derived from the cards, in the source document's engagement
 * kinds — Investigation, Operations, Compliance. The note below is the
 * reasoning for that earlier version.
 *
 * The source document lists five filter chips — All, Investigations, Rack
 * safety, Digital Twin, MHE safety — and then six cards, two of which
 * (Operations, Compliance) belong to no chip. Under that list those two are
 * reachable only through "All", which is a filter bar that hides part of its
 * own set.
 *
 * So the chips are built from the cards instead: `CATEGORIES` walks `CASES`
 * and takes each `kind` in the order it first appears. Add a case with a new
 * kind and its chip appears; remove the last case of a kind and the chip
 * goes. The two cannot fall out of step because there is only one list.
 *
 * ── The bullets are outcomes, not claims about a customer ───────────
 * Each card says what the engagement produced — a reconstruction, a grading,
 * a certificate — and none of them names a client, a site or a figure. That
 * is the source document's own position and the note under the grid says so:
 * these are representative of real work, with details withheld.
 */

export type CaseStudy = {
  id: string;
  /** The chip on the card, and the filter it belongs to. */
  kind: string;
  /** Sector and shape of the engagement, never the customer. */
  sector: string;
  title: string;
  /** The situation the operator was in. */
  problem: string;
  /** What the engagement produced. Shown in the panel, not on the card. */
  outcomes: [string, string, string];
  /** `/cases/<id>.webp`, 800x564 — 2x the 397x280 card image. */
  img: string;
  alt: string;
};

export const CASES: CaseStudy[] = [
  {
    id: "collapse",
    kind: "Rack Safety",
    sector: "FMCG · distribution",
    title: "Reconstructing a rack collapse",
    problem:
      "After a structural failure, the operator needed to understand what happened — and stop it recurring.",
    outcomes: [
      "Failure reconstructed from site evidence",
      "Root cause documented",
      "Corrective actions set to EN 15635",
    ],
    img: "/cases/collapse.webp",
    alt: "Two engineers in high-visibility vests examining a deformed steel racking upright inside a cordoned warehouse bay, one photographing it with a rugged tablet",
  },
  {
    id: "estate",
    kind: "Rack Safety",
    sector: "3PL · multi-site",
    title: "Estate-wide racking, twinned and graded",
    problem:
      "Thousands of bays across sites, with no single view of condition or risk.",
    outcomes: [
      "Every asset QR-tagged in a digital twin",
      "RAG-graded against EN 15635",
      "Findings tracked to closure",
    ],
    img: "/cases/estate.webp",
    alt: "A warehouse inspector holding a rugged scanner up to a blank label on a racking upright, a long aisle of identical bays behind",
  },
  {
    id: "twin",
    kind: "Digital Twin",
    sector: "Retail · DC",
    title: "A living model of the facility",
    problem:
      "Layout changes and expansion planned blind, working from stale drawings.",
    outcomes: [
      "Facility modelled and asset-tagged",
      "Changes simulated before building",
      "One live operational view",
    ],
    img: "/cases/twin.webp",
    alt: "A warehouse seen from a high mezzanine, racking rows running away in strict parallel with the aisles clear",
  },
  {
    id: "impacts",
    kind: "MHE Safety",
    sector: "Manufacturing",
    title: "Impact events, in context",
    problem: "Forklift impacts logged as numbers nobody could act on.",
    outcomes: [
      "Impacts placed on the twin",
      "Location, operator and history captured",
      "Faster, fairer investigation",
    ],
    img: "/cases/impacts.webp",
    alt: "A counterbalance forklift turning at the end of a warehouse aisle, seen from floor level with racking rising on both sides",
  },
  {
    id: "operations",
    kind: "Inventory",
    sector: "Logistics",
    title: "Inventory and movement, made visible",
    problem: "Stock and equipment movement invisible between systems.",
    outcomes: [
      "Inventory mapped to structure",
      "MHE utilisation surfaced",
      "Bottlenecks identified",
    ],
    img: "/cases/operations.webp",
    alt: "A worker in a high-visibility vest drawing a pallet truck across a marked staging area, wrapped pallets and racking behind",
  },
  {
    id: "compliance",
    kind: "Rack Safety",
    sector: "Cold chain",
    title: "From audit to Stability Certificate",
    problem: "Racking safety hard to evidence for audits and insurers.",
    outcomes: [
      "Instrumented inspection and grading",
      "Critical findings closed",
      "Stability Certificate issued",
    ],
    img: "/cases/compliance.webp",
    alt: "An inspector in an insulated jacket checking a frosted rack upright in a cold-storage aisle with a rugged tablet",
  },
];

/**
 * The filter chips are RAMS's offerings — the six solutions in the menu's
 * order, then the Digital Twin — not kinds of engagement. They are listed
 * rather than derived, so an offering with no published case yet still has
 * its chip; choosing it says a case is coming rather than showing nothing.
 *
 * Every case's `kind` must be one of these. The check below fails the
 * build if one is not, which is what derivation used to guarantee.
 */
export const CATEGORIES: string[] = [
  "Rack Safety",
  "MHE Safety",
  "Inventory",
  "Warehouse Execution",
  "MHE Diagnostics",
  "Management",
  "Digital Twin",
];

for (const c of CASES) {
  if (!CATEGORIES.includes(c.kind)) {
    throw new Error(`case "${c.id}" has kind "${c.kind}", which is not an offering`);
  }
}
