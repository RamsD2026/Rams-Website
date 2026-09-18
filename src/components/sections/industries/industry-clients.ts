import { CLIENTS, type Client } from "@/data/clients";

/**
 * The client logos shown under each industry on /industries, keyed by the
 * industry ids in `industry-data`.
 *
 * Every one of these is an IRDS client — the page says so above the nine
 * sections — and RAMS 2.0 has only recently launched.
 *
 * ── Where the placements come from ──────────────────────────────────
 * Seven marks in RAMS's asset pack (`public/logo/`) carry their sector in the
 * artwork: Flipkart and Walmart India (E-commerce), ITC (FMCG), Volvo, JCB
 * and Caterpillar (Heavy Equipment), Siemens (Industrial Tech). The pack's
 * other sector captions were exported as empty 1×1 files, detached from the
 * marks, so the rest are placed by each company's publicly known industry.
 * Confirm with RAMS before treating a placement as their record.
 *
 * An industry with no entry — cold storage, today — shows no logo row.
 * Every slug must exist in `CLIENTS`; the check below fails the build if not.
 */
export const INDUSTRY_CLIENTS: Record<string, string[]> = {
  warehousing: ["ingram-micro"],
  "3pl": [
    "kintetsu-world-express",
    "mahindra-logistics",
    "rhenus-logistics",
    "rsa-global",
    "emirates-logistics",
    "v-trans",
    "flyjac",
    "jm-baxi",
    "liladhar-pasoo",
    "gmr",
    "zippee",
  ],
  ecommerce: ["flipkart", "walmart-india", "aditya-birla", "rentomojo"],
  manufacturing: [
    "siemens",
    "abb",
    "caterpillar",
    "jcb",
    "volvo",
    "saint-gobain",
    "asian-paints",
    "grundfos",
    "copeland",
    "vishay",
    "southco",
    "mazak",
    "forbes-marshall",
    "wipro-pari",
    "ge-vernova",
    "lm-wind-power",
    "renewsys",
    "coromandel",
    "heubach",
    "rossari",
    "supreme-petrochem",
    "domo",
    "unitop",
    "armacell",
  ],
  automotive: [
    "ashok-leyland",
    "cummins",
    "continental",
    "valeo",
    "forvia",
    "garrett",
    "gkn",
    "elringklinger",
    "fleetguard",
    "exide",
  ],
  fmcg: ["itc", "reckitt", "loreal"],
  "food-beverage": ["nestle", "coca-cola", "ferrero"],
  pharmaceuticals: ["cipla", "ipca", "rubicon-research"],
};

const BY_SLUG = new Map(CLIENTS.map((c) => [c.slug, c]));

export function clientsFor(industryId: string): Client[] {
  return (INDUSTRY_CLIENTS[industryId] ?? []).map((s) => BY_SLUG.get(s)!);
}

for (const [id, slugs] of Object.entries(INDUSTRY_CLIENTS)) {
  for (const s of slugs) {
    if (!BY_SLUG.has(s)) throw new Error(`industry-clients: "${s}" under ${id} is not in CLIENTS`);
  }
}
