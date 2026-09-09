/**
 * The customer logos, one entry per file in `public/clients/`.
 *
 * The source is RAMS's own asset pack, checked into `public/logo/` as Figma
 * frames — a mark on a white card with a sector caption under some of them.
 * Each was cut to its own ink bounding box, the caption dropped, the white
 * ground knocked out with a border flood fill so interior whites survive
 * (JCB's letters, Fleetguard's block), and written out at 96 tall, three
 * times the 32px a marquee renders.
 *
 * ── Why a shared list ───────────────────────────────────────────────
 * Three strips read this: `RiqClients` on nine dark platform heroes,
 * `ClientStrip` under the About and case-study heroes, and `AboutCustomers`
 * in the section
 * those names are the subject of. They ran three hand-typed lists before this
 * and had already drifted apart. One list, one folder, and a name is added or
 * removed in one place.
 *
 * ── The claim ───────────────────────────────────────────────────────
 * These are the marks RAMS ships in its own asset pack, which is what makes
 * them shippable — a logo strip is the strongest claim a page makes about who
 * the customers are, and this site cut that list back once before for exactly
 * that reason (commit bb30413, "Drop unverified names from the client strip").
 * Nothing goes in `public/clients/` that did not come out of `public/logo/`.
 *
 * ── On dark ─────────────────────────────────────────────────────────
 * Every file is a transparent PNG carrying the mark's real colours, which is
 * right on a light ground and useless on a dark one, where Caterpillar's
 * black and Ferrero's brown disappear. The dark strip therefore renders them
 * as flat white silhouettes, `brightness(0) invert(1)` — a treatment rather
 * than a second set of files.
 */

export type Client = {
  /** The file, `/clients/<slug>.png`. */
  slug: string;
  /** For the alt text. */
  name: string;
  /** Intrinsic size. Required by next/image. */
  w: number;
  h: number;
};

export const CLIENTS: Client[] = [
  { slug: "flipkart", name: "Flipkart", w: 356, h: 96 },
  { slug: "lm-wind-power", name: "LM Wind Power", w: 299, h: 96 },
  { slug: "ingram-micro", name: "Ingram Micro", w: 360, h: 62 },
  { slug: "gmr", name: "GMR", w: 256, h: 96 },
  { slug: "renewsys", name: "RenewSys", w: 223, h: 96 },
  { slug: "kintetsu-world-express", name: "Kintetsu World Express", w: 360, h: 43 },
  { slug: "asian-paints", name: "Asian Paints", w: 360, h: 69 },
  { slug: "reckitt", name: "Reckitt", w: 185, h: 96 },
  { slug: "mahindra-logistics", name: "Mahindra Logistics", w: 360, h: 76 },
  { slug: "volvo", name: "Volvo", w: 103, h: 96 },
  { slug: "rsa-global", name: "RSA Global", w: 360, h: 46 },
  { slug: "rhenus-logistics", name: "Rhenus Logistics", w: 360, h: 70 },
  { slug: "mazak", name: "Mazak", w: 344, h: 96 },
  { slug: "flyjac", name: "Flyjac", w: 327, h: 96 },
  { slug: "v-trans", name: "V-Trans", w: 337, h: 96 },
  { slug: "jm-baxi", name: "J M Baxi", w: 184, h: 96 },
  { slug: "liladhar-pasoo", name: "Liladhar Pasoo", w: 317, h: 96 },
  { slug: "forbes-marshall", name: "Forbes Marshall", w: 360, h: 96 },
  { slug: "itc", name: "ITC", w: 92, h: 96 },
  { slug: "jcb", name: "JCB", w: 244, h: 96 },
  { slug: "walmart-india", name: "Walmart India", w: 272, h: 96 },
  { slug: "domo", name: "DOMO", w: 294, h: 96 },
  { slug: "caterpillar", name: "Caterpillar", w: 360, h: 62 },
  { slug: "vishay", name: "Vishay", w: 113, h: 96 },
  { slug: "saint-gobain", name: "Saint-Gobain", w: 227, h: 96 },
  { slug: "emirates-logistics", name: "Emirates Logistics", w: 360, h: 57 },
  { slug: "ferrero", name: "Ferrero", w: 360, h: 49 },
  { slug: "rubicon-research", name: "Rubicon Research", w: 192, h: 96 },
  { slug: "loreal", name: "L'Oreal", w: 360, h: 68 },
  { slug: "garrett", name: "Garrett", w: 281, h: 96 },
  { slug: "gkn", name: "GKN", w: 311, h: 96 },
  { slug: "cipla", name: "Cipla", w: 283, h: 96 },
  { slug: "elringklinger", name: "ElringKlinger", w: 262, h: 96 },
  { slug: "siemens", name: "Siemens", w: 360, h: 62 },
  { slug: "southco", name: "Southco", w: 360, h: 85 },
  { slug: "armacell", name: "Armacell", w: 360, h: 61 },
  { slug: "rossari", name: "Rossari", w: 167, h: 96 },
  { slug: "wipro-pari", name: "Wipro PARI", w: 270, h: 96 },
  { slug: "fleetguard", name: "Fleetguard", w: 181, h: 96 },
  { slug: "unitop", name: "Unitop Group", w: 114, h: 96 },
  { slug: "forvia", name: "Forvia", w: 322, h: 96 },
  { slug: "nestle", name: "Nestle", w: 330, h: 96 },
  { slug: "rentomojo", name: "Rentomojo", w: 138, h: 96 },
  { slug: "ipca", name: "IPCA", w: 266, h: 96 },
  { slug: "copeland", name: "Copeland", w: 360, h: 36 },
  { slug: "coca-cola", name: "Coca-Cola", w: 285, h: 96 },
  { slug: "aditya-birla", name: "Aditya Birla", w: 100, h: 96 },
  { slug: "cummins", name: "Cummins", w: 109, h: 96 },
  { slug: "valeo", name: "Valeo", w: 219, h: 96 },
  { slug: "continental", name: "Continental", w: 360, h: 69 },
  { slug: "heubach", name: "Heubach", w: 360, h: 90 },
  { slug: "coromandel", name: "Coromandel", w: 360, h: 95 },
  { slug: "grundfos", name: "Grundfos", w: 360, h: 49 },
  { slug: "supreme-petrochem", name: "Supreme Petrochem", w: 360, h: 84 },
  { slug: "ge-vernova", name: "GE Vernova", w: 360, h: 84 },
  { slug: "exide", name: "Exide", w: 295, h: 96 },
  { slug: "zippee", name: "Zippee", w: 360, h: 86 },
  { slug: "ashok-leyland", name: "Ashok Leyland", w: 251, h: 96 },
  { slug: "abb", name: "ABB", w: 242, h: 96 },
];

/**
 * The subset the hero strips carry. A hero strip is a glance, not an index:
 * fifty-nine marks passing at speed is a wall, and the loop takes so long
 * that the reader never sees the same one twice. Fourteen is about two loops
 * of a 1232 measure, and they are chosen to be recognisable at 26px and to
 * spread across the sectors the pack covers — logistics, FMCG, industrial,
 * pharma, automotive, retail.
 *
 * The full list runs where it is the subject: `AboutCustomers`.
 */
export const HERO_CLIENTS: Client[] = [
  "flipkart",
  "nestle",
  "siemens",
  "coca-cola",
  "volvo",
  "jcb",
  "caterpillar",
  "abb",
  "saint-gobain",
  "mahindra-logistics",
  "asian-paints",
  "cipla",
  "ge-vernova",
  "rhenus-logistics",
].map((s) => {
  const c = CLIENTS.find((x) => x.slug === s);
  if (!c) throw new Error(`Unknown client slug: ${s}`);
  return c;
});
