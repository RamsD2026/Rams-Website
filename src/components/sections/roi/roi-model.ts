/* ============================================================================
   /roi-calculator — the model.

   React-free on purpose, for the same reason `aiv-data.ts` and `gi-data.ts`
   are: the arithmetic and the claims posture below have to be auditable in one
   read, without a component around them.

   ── Whose numbers these are ─────────────────────────────────────────
   **Every figure on this page belongs to the reader.** RAMS supplies the
   measurement; it does not supply the improvement. The page said that when it
   modelled one lever and it says it louder now that it models seven, because
   seven levers multiplied together can produce a very large number very
   quickly, and a large number nobody can source is worth less than no number.

   So three rules the page never breaks:

   1. **No default is a RAMS figure.** Each one is either a public industry
      reference, cited in `SOURCES` and shown on the page, or a plainly marked
      neutral starting point. If it has a number, it says where the number came
      from.
   2. **Every default is editable, and the result restates what was entered.**
      The assumptions line under the total is the reader's own inputs read
      back, so nothing can be screenshotted as a RAMS promise.
   3. **No currency conversion.** The reader types their own money in their own
      currency and the symbol is cosmetic. A model that silently converted
      would be asserting an FX rate nobody asked it for.

   ── On the MHE module ───────────────────────────────────────────────
   `MODULES.mhe` is the arithmetic of `meps/MepsCalculator.tsx`, unchanged:

       hours    = fleet × shifts × days × (minutes ÷ 60)
       machines = hours ÷ (shifts × days × productive hours)
       value    = machines × cost per month × 12

   That component still exists and still owns the MEPS page's version. If one
   of the two changes, change both — they are the same claim about the same
   thing, and the site cannot have them disagreeing.
   ========================================================================== */

export type CurrencyKey = "INR" | "USD" | "GBP" | "EUR" | "AED";

/** Symbol and digit grouping only. Deliberately no exchange rates — see rule 3. */
export const CURRENCIES: Record<CurrencyKey, { sym: string; label: string; lakh: boolean }> = {
  INR: { sym: "₹", label: "Indian rupee", lakh: true },
  USD: { sym: "$", label: "US dollar", lakh: false },
  GBP: { sym: "£", label: "Pound sterling", lakh: false },
  EUR: { sym: "€", label: "Euro", lakh: false },
  AED: { sym: "AED ", label: "UAE dirham", lakh: false },
};

/* ── the operation ───────────────────────────────────────────────── */

export type Ops = {
  positions: number;
  fleet: number;
  shifts: number;
  days: number;
  labour: number;
};

/** A mid-size single-site distribution operation. Neutral, not a RAMS customer. */
export const OPS_DEFAULT: Ops = {
  positions: 10000,
  fleet: 12,
  shifts: 2,
  days: 300,
  labour: 450,
};

export const OPS_FIELDS: {
  key: keyof Ops;
  label: string;
  hint: string;
  min: number;
  max: number;
  step: number;
  money?: boolean;
}[] = [
  { key: "positions", label: "Pallet positions", hint: "Racked locations across the site", min: 500, max: 120000, step: 500 },
  { key: "fleet", label: "MHE fleet", hint: "Trucks running on a normal day", min: 1, max: 200, step: 1 },
  { key: "shifts", label: "Shifts per day", hint: "", min: 1, max: 3, step: 1 },
  { key: "days", label: "Operating days a year", hint: "", min: 200, max: 365, step: 5 },
  { key: "labour", label: "Loaded labour cost", hint: "Per hour, including on-costs", min: 50, max: 20000, step: 25, money: true },
];

/* ── the levers ──────────────────────────────────────────────────── */

export type ModuleKey = "rack" | "inspect" | "count" | "search" | "mhe" | "safety" | "floor";

export type Field = {
  key: string;
  label: string;
  hint?: string;
  min: number;
  max: number;
  step: number;
  /** Renders with the currency symbol. */
  money?: boolean;
  /** Renders as a percentage and divides by 100 before the arithmetic. */
  pct?: boolean;
};

export type ModuleDef = {
  key: ModuleKey;
  name: string;
  /** What RAMS actually puts on the floor to move this number. */
  product: string;
  href: string;
  /** One line on what the lever is. */
  blurb: string;
  fields: Field[];
  defaults: Record<string, number>;
  /** Annual value, in the reader's own currency. */
  value: (v: Record<string, number>, ops: Ops) => number;
  /** Read the inputs back, so the result is never mistaken for a RAMS claim. */
  restate: (v: Record<string, number>, ops: Ops, money: (n: number) => string) => string;
  /** Which `SOURCES` entries back this module's defaults. */
  sources: string[];
};

export const MODULES: ModuleDef[] = [
  {
    key: "rack",
    name: "Rack damage caught early",
    product: "Sensor Stack · AI Camera",
    href: "/hardware/sensor-stack",
    blurb:
      "Impacts get logged when they happen, with the truck, the operator and the bay — instead of surfacing at the next inspection, or as a collapse.",
    fields: [
      { key: "impacts", label: "Rack impacts a year", hint: "Reported and unreported", min: 0, max: 500, step: 1 },
      { key: "repair", label: "Average repair cost", min: 0, max: 500000, step: 1000, money: true },
      { key: "caught", label: "Share you'd catch earlier", min: 0, max: 100, step: 5, pct: true },
    ],
    defaults: { impacts: 40, repair: 25000, caught: 40 },
    value: (v) => v.impacts * v.repair * (v.caught / 100),
    restate: (v, _o, m) =>
      `${v.impacts} impacts a year at ${m(v.repair)} each, ${v.caught}% caught earlier`,
    sources: ["steelking", "damotech"],
  },
  {
    key: "inspect",
    name: "Rack inspection without the man-up",
    product: "AirScan",
    href: "/hardware/inspection",
    blurb:
      "The racking inspection duty stays yours. What changes is that the evidence is gathered from the air, out of hours, across every bay rather than a sample.",
    fields: [
      { key: "runs", label: "Full inspections a year", min: 1, max: 12, step: 1 },
      { key: "mins", label: "Minutes per position, by hand", min: 0.1, max: 5, step: 0.1 },
      { key: "mewpDays", label: "MEWP days per inspection", hint: "Hire, plus the aisle it closes", min: 0, max: 60, step: 1 },
      { key: "mewpRate", label: "MEWP day rate", min: 0, max: 100000, step: 500, money: true },
    ],
    defaults: { runs: 2, mins: 0.5, mewpDays: 4, mewpRate: 6000 },
    value: (v, o) =>
      v.runs * ((o.positions * v.mins) / 60) * o.labour + v.runs * v.mewpDays * v.mewpRate,
    restate: (v, o, m) =>
      `${v.runs} inspections a year across ${fmtPlain(o.positions)} positions at ${v.mins} min each, plus ${v.mewpDays} MEWP days at ${m(v.mewpRate)}`,
    sources: [],
  },
  {
    key: "count",
    name: "Stock counting labour",
    product: "AirScan",
    href: "/hardware/inspection",
    blurb: "Counting the building from the air, out of hours, instead of walking and lifting to it.",
    fields: [
      { key: "counts", label: "Full counts a year", hint: "Or the cycle-count equivalent", min: 1, max: 52, step: 1 },
      { key: "mins", label: "Minutes per position", min: 0.1, max: 5, step: 0.1 },
      { key: "cut", label: "Share of that labour released", min: 0, max: 100, step: 5, pct: true },
    ],
    defaults: { counts: 12, mins: 0.4, cut: 70 },
    value: (v, o) => v.counts * ((o.positions * v.mins) / 60) * o.labour * (v.cut / 100),
    restate: (v, o, m) =>
      `${v.counts} counts a year over ${fmtPlain(o.positions)} positions at ${v.mins} min each, ${v.cut}% released — ${m(o.labour)} an hour`,
    sources: ["netsuite"],
  },
  {
    key: "search",
    name: "Time spent looking for stock",
    product: "Location Intelligence · AirScan",
    href: "/hardware/rtls",
    blurb:
      "Hours that go on finding a pallet the system has in the wrong place. The fix is knowing where it is, not counting again.",
    fields: [
      { key: "hours", label: "Hours a week, across the site", hint: "Everyone, not one person", min: 0, max: 400, step: 5 },
      { key: "cut", label: "Share you'd remove", min: 0, max: 100, step: 5, pct: true },
    ],
    defaults: { hours: 30, cut: 50 },
    value: (v, o) => v.hours * 52 * o.labour * (v.cut / 100),
    restate: (v, o, m) =>
      `${v.hours} hours a week at ${m(o.labour)} an hour, ${v.cut}% removed`,
    sources: ["unex"],
  },
  {
    key: "mhe",
    name: "MHE productivity",
    product: "Sensor Stack",
    href: "/hardware/sensor-stack",
    blurb:
      "Minutes per shift returned to each truck — from access, from not hunting for a charged machine, from not repeating a job. Enough of them add up to a truck you did not have to hire.",
    fields: [
      { key: "mins", label: "Minutes per shift, per truck", min: 0, max: 120, step: 1 },
      { key: "productive", label: "Productive hours per shift", hint: "The hours a truck actually works", min: 1, max: 12, step: 0.5 },
      { key: "cost", label: "Cost per truck per month", hint: "Lease or equivalent", min: 0, max: 1000000, step: 1000, money: true },
    ],
    defaults: { mins: 12, productive: 6.5, cost: 65000 },
    value: (v, o) => {
      const hours = o.fleet * o.shifts * o.days * (v.mins / 60);
      const machines = hours / Math.max(1e-6, o.shifts * o.days * v.productive);
      return machines * v.cost * 12;
    },
    restate: (v, o, m) =>
      `${o.fleet} trucks × ${o.shifts} shifts × ${o.days} days × ${v.mins} min, against ${v.productive} productive hours and ${m(v.cost)} a month`,
    sources: [],
  },
  {
    key: "safety",
    name: "Safety incidents avoided",
    product: "AI Camera",
    href: "/hardware/ai-vision",
    blurb:
      "People and vehicles in the same space, watched in the moment rather than reviewed afterwards. The camera is a layer over your guarding, not a replacement for it.",
    fields: [
      { key: "incidents", label: "Recordable incidents a year", min: 0, max: 100, step: 1 },
      { key: "cost", label: "Cost per incident", hint: "Claim, cover, downtime, investigation", min: 0, max: 20000000, step: 10000, money: true },
      { key: "cut", label: "Share you'd avoid", min: 0, max: 100, step: 5, pct: true },
    ],
    defaults: { incidents: 3, cost: 350000, cut: 30 },
    value: (v) => v.incidents * v.cost * (v.cut / 100),
    restate: (v, _o, m) =>
      `${v.incidents} incidents a year at ${m(v.cost)}, ${v.cut}% avoided`,
    sources: ["osha", "voxel"],
  },
  {
    key: "floor",
    name: "Slab problems found while they're small",
    product: "FloorScan",
    href: "/hardware/inspection",
    blurb:
      "A void under a rack leg is cheap while it is still a void. The expensive version is the one that announces itself through the surface.",
    fields: [
      { key: "cost", label: "Cost of a reactive slab repair", hint: "Works, plus the aisle it takes out", min: 0, max: 50000000, step: 50000, money: true },
      { key: "odds", label: "Chance of one in a year", min: 0, max: 100, step: 5, pct: true },
      { key: "saved", label: "Share saved by finding it early", min: 0, max: 100, step: 5, pct: true },
    ],
    defaults: { cost: 900000, odds: 25, saved: 60 },
    value: (v) => v.cost * (v.odds / 100) * (v.saved / 100),
    restate: (v, _o, m) =>
      `a ${m(v.cost)} repair, ${v.odds}% likely in a year, ${v.saved}% cheaper caught early`,
    sources: [],
  },
];

export const MODULE_BY_KEY: Record<ModuleKey, ModuleDef> = Object.fromEntries(
  MODULES.map((m) => [m.key, m]),
) as Record<ModuleKey, ModuleDef>;

/* ── where the starting figures come from ────────────────────────── */

/** Shown on the page. A default with no source is marked as a neutral start,
    never dressed up as research. */
export const SOURCES: { id: string; what: string; says: string; who: string; href: string }[] = [
  {
    id: "steelking",
    what: "Rack repair cost",
    says: "Puts average direct repair at about $750 an incident, and models roughly ten incidents a year.",
    who: "Steel King — The Hidden Cost of Pallet Rack Damage",
    href: "https://www.steelking.com/2026/09/02/blog-hidden-cost-of-rack-damage-part-1/",
  },
  {
    id: "damotech",
    what: "Impact frequency",
    says: "Reports that most impacts are never formally logged, and that large operations can see fifty a day.",
    who: "Damotech — Top 5 Ways Forklifts Damage Racks",
    href: "https://www.damotech.com/blog/five-frequent-ways-forklifts-damage-racks",
  },
  {
    id: "osha",
    what: "Incident cost",
    says: "Indirect costs of a workplace injury commonly run several times the direct claim.",
    who: "OSHA — Business Case for Safety and Health",
    href: "https://www.osha.gov/businesscase/costs",
  },
  {
    id: "voxel",
    what: "Forklift claims",
    says: "Puts a single forklift injury claim at roughly $38,000–$41,000 in direct cost.",
    who: "Voxel — Forklift Accident Statistics",
    href: "https://www.voxelai.com/industry-insights/forklift-accident-statistics",
  },
  {
    id: "netsuite",
    what: "Counting effort",
    says: "Describes cycle counting as continuous and labour-intensive, with 95–99% accuracy the working benchmark.",
    who: "NetSuite — Inventory Cycle Counting",
    href: "https://www.netsuite.com/portal/resource/articles/inventory-management/using-inventory-control-software-for-cycle-counting.shtml",
  },
  {
    id: "unex",
    what: "Non-productive time",
    says: "Estimates 30–40% of labour hours go on travel, waiting and searching rather than on the work itself.",
    who: "UNEX — Maximizing Labor Efficiency",
    href: "https://blog.unex.com/maximizing-labor-efficiency-a-smarter-approach-to-warehouse-productivity",
  },
];

/* ── formatting ──────────────────────────────────────────────────── */

/** Indian grouping by hand rather than `toLocaleString("en-IN")`: Node and the
    browser can disagree on ICU data, and that hydrates as a mismatch. Same
    reason `MepsCalculator` does it this way. */
export function fmtPlain(n: number, lakh = false): string {
  const v = Math.round(n);
  const s = String(Math.abs(v));
  if (!lakh || s.length <= 3) return (v < 0 ? "-" : "") + s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const head = s.slice(0, -3);
  const tail = s.slice(-3);
  return (v < 0 ? "-" : "") + head.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + tail;
}

/** Big money, shortened — Cr/Lakh on the Indian scale, M/k elsewhere. */
export function fmtShort(n: number, cur: CurrencyKey): { v: string; unit: string } {
  const { sym, lakh } = CURRENCIES[cur];
  if (lakh) {
    if (n >= 1e7) return { v: `${sym}${(n / 1e7).toFixed(2)}`, unit: "Cr" };
    if (n >= 1e5) return { v: `${sym}${(n / 1e5).toFixed(1)}`, unit: "Lakh" };
    return { v: `${sym}${fmtPlain(n, true)}`, unit: "" };
  }
  if (n >= 1e6) return { v: `${sym}${(n / 1e6).toFixed(2)}`, unit: "M" };
  if (n >= 1e3) return { v: `${sym}${(n / 1e3).toFixed(0)}`, unit: "k" };
  return { v: `${sym}${fmtPlain(n)}`, unit: "" };
}
