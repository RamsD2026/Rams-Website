/**
 * The nine industries, from `RAMS_Digital_Industries.html`.
 *
 * ── All nine on one page ────────────────────────────────────────────
 * The mega menu lists five of them as separate routes — `/industries/retail`,
 * `/industries/automotive` and so on — and none of those is built. This is
 * the one page the source itself is, and it carries every industry rather
 * than nine pages carrying one each.
 *
 * The `Explore …` link at the foot of each card in the source pointed at
 * those unbuilt routes. It is dropped rather than pointed somewhere else: a
 * card that already states the problem, the response and the stack has said
 * what it has to say, and a link to a 404 is worse than no link.
 *
 * ── The photographs are the home page's, and they are checked ────────
 * Most of the nine are the exact Unsplash photographs `IndustriesCarousel`
 * shows on the home page, matched by subject, so a reader who saw the
 * carousel meets the same picture here rather than a second set of the same
 * subjects. They are real photography; nothing here is generated.
 *
 * Three of them were not what their alt text claimed, and an Unsplash id is
 * not self-describing — you have to look. Pharmaceuticals was a beach resort
 * at sunset, Automotive was two people potting seedlings in a horticulture
 * lab, and the menu's Food & Beverage picture was a flat lay of pills on a
 * yellow ground. All three are replaced, in this file, in the carousel and in
 * `navigation-v2`, so one industry is one photograph everywhere it appears.
 *
 * Food & Beverage has no carousel card of its own — the carousel runs eight —
 * so it carries a photograph from the same library through the same helper. It
 * is a food distribution warehouse and not, as it was for a revision, an
 * ageing store racked with cheese: that one was real and it was food, but the
 * tagline beside it says cold chain and FIFO, and a cheese cellar does not
 * look like either.
 *
 * Whatever replaces one of these next: open it before you write the id down.
 * Reject anything with a legible brand mark or a recognisable face.
 *
 * ── The scope line is the source's, and it stays ────────────────────
 * "Examples show typical use cases. Final capabilities depend on the agreed
 * audit, hardware, integration and application scope."
 *
 * Every one of these cards describes what RAMS *can* do in a sector, which on
 * an industries page reads as what it *will* do for the reader's own site. So
 * the line sits above the grid rather than under it, and the copy keeps the
 * source's hedges — "supported", "approved", "typical" — rather than being
 * tightened into commitments the document did not make.
 */

export type Industry = {
  id: string;
  /** The two- or three-letter mark. */
  code: string;
  /** The source's own reference, e.g. WD-01. */
  ref: string;
  /** Filter group. Derived into `GROUPS`, never typed twice. */
  group: string;
  name: string;
  tagline: string;
  /** The warehouse problem: a heading and the detail under it. */
  problem: [string, string];
  /** The RAMS response, same shape. */
  response: [string, string];
  /** The typical stack — module names only, no claims. */
  stack: string[];
  /** The section's photograph. */
  img: string;
  alt: string;
};

/**
 * The home page's own image helper, spelled the same way.
 *
 * `IndustriesCarousel` builds its eight photographs from Unsplash ids at
 * w=1200. These sections use the same eight for the same eight industries, so
 * a reader who saw the carousel on the home page meets the same picture here
 * rather than a second, different-looking set of the same subjects.
 *
 * `images.unsplash.com` is already in `next.config.ts`'s `remotePatterns`,
 * which is what lets `next/image` optimise a remote host at all.
 */
const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const LOGISTICS = "Logistics";
const PRODUCTION = "Production";
const CONTROLLED = "Controlled & regulated";

export const INDUSTRIES: Industry[] = [
  {
    id: "warehousing",
    code: "WD",
    ref: "WD-01",
    group: LOGISTICS,
    name: "Warehousing & Distribution",
    tagline: "Optimise throughput and accuracy.",
    problem: [
      "Congested travel and unreliable location accuracy",
      "MHE spends time searching, staging areas overflow and inventory records drift from physical reality — while rack damage is reported after the fact.",
    ],
    response: [
      "Create a live operational view of the facility",
      "Map racks, aisles and zones in the Digital Twin; track supported MHE and inventory movement; digitise rack inspections; and surface task, dwell and exception insights.",
    ],
    stack: ["Digital Twin", "IRDS", "MEPS", "IROS", "ATOS"],
    img: UNSPLASH("photo-1553413077-190dd305871c"),
    alt: "A distribution centre floor with loaded pallet racking and material handling equipment working the aisles.",
  },
  {
    id: "3pl",
    code: "3PL",
    ref: "3P-02",
    group: LOGISTICS,
    name: "Third-Party Logistics",
    tagline: "Multi-client warehouse management.",
    problem: [
      "Different client SLAs inside one shared operation",
      "Inventory, labour, MHE and locations are shared, making it difficult to isolate delays, utilisation, damage responsibility and service performance by client or zone.",
    ],
    response: [
      "Separate performance without fragmenting visibility",
      "Use client- and zone-aware Digital Twin views, task orchestration and inventory exceptions, then consolidate multi-site and cross-module indicators in AIMS.",
    ],
    stack: ["Digital Twin", "IROS", "MEPS", "ATOS", "AIMS"],
    img: UNSPLASH("photo-1600880292203-757bb62b4baf"),
    alt: "A large shared warehouse holding mixed pallet types across separate storage areas.",
  },
  {
    id: "ecommerce",
    code: "EC",
    ref: "EC-03",
    group: LOGISTICS,
    name: "E-commerce",
    tagline: "High-velocity order operations.",
    problem: [
      "Peak volume creates queues and unsafe shortcuts",
      "Order surges increase MHE–pedestrian interaction, replenishment pressure, missed picks and travel waste — exactly when supervisors have the least time to investigate.",
    ],
    response: [
      "See and orchestrate work at operational speed",
      "Monitor movement and safety signals, identify hot zones, expose idle or congested activity, and reprioritise supported tasks using live site context.",
    ],
    stack: ["MEPS", "RTSS", "IROS", "ATOS", "AI Vision"],
    img: UNSPLASH("photo-1601598851547-4302969d0614"),
    alt: "A fulfilment centre with shelving bays and order totes staged for picking.",
  },
  {
    id: "cold-storage",
    code: "CS",
    ref: "CS-04",
    group: CONTROLLED,
    name: "Cold Storage",
    tagline: "Temperature-controlled operations.",
    problem: [
      "Limited visibility in a costly, harsh environment",
      "Excess dwell, door-open time, battery degradation and hidden rack damage increase energy cost, product risk and maintenance difficulty in low-temperature areas.",
    ],
    response: [
      "Bring condition, movement and environment together",
      "Connect supported environmental and asset data to the Digital Twin, analyse dwell and MHE utilisation, and maintain location-specific rack inspection history.",
    ],
    stack: ["Digital Twin", "IRDS", "MEPS", "IMDS", "IoT"],
    img: UNSPLASH("photo-1587293852726-70cdb56c2866"),
    alt: "A temperature-controlled storage area with pallets under cold lighting.",
  },
  {
    id: "manufacturing",
    code: "MF",
    ref: "MF-05",
    group: PRODUCTION,
    name: "Manufacturing",
    tagline: "End-to-end production floor visibility.",
    problem: [
      "Material flow is disconnected from production reality",
      "Components wait between stores and line-side areas, MHE movement is reactive, and a delayed replenishment becomes visible only when production is affected.",
    ],
    response: [
      "Connect intralogistics to its physical context",
      "Model machines, stores, routes and line-side zones; integrate approved ERP, MES or WMS signals; and orchestrate material movement with spatial and task context.",
    ],
    stack: ["Digital Twin", "MEPS", "ATOS", "IROS", "AIMS"],
    img: UNSPLASH("photo-1581091226825-a6a2a5aee158"),
    alt: "A production facility floor with equipment and material staged beside the line.",
  },
  {
    id: "automotive",
    code: "AU",
    ref: "AU-06",
    group: PRODUCTION,
    name: "Automotive",
    tagline: "Parts tracking and JIT compliance.",
    problem: [
      "A missing part threatens a just-in-time sequence",
      "Stillages, components and MHE move through tight windows. A location error, battery issue or delayed task can disrupt line supply and cascade into downtime.",
    ],
    response: [
      "Make line-feeding exceptions visible early",
      "Connect supported part and asset location data, monitor MHE health and utilisation, and prioritise material tasks using zone, route and production context.",
    ],
    stack: ["IROS", "MEPS", "IMDS", "ATOS", "RTSS"],
    img: UNSPLASH("photo-1567789884554-0b844b597180"),
    alt: "An automotive facility with components and handling equipment in a marked working area.",
  },
  {
    id: "fmcg",
    code: "FG",
    ref: "FG-07",
    group: PRODUCTION,
    name: "FMCG",
    tagline: "High-volume fast-moving goods.",
    problem: [
      "Volume hides travel waste and rack exposure",
      "Fast rotation creates repeated impact zones, overloaded staging, empty travel and inventory exceptions that are individually small but operationally expensive at scale.",
    ],
    response: [
      "Find recurring patterns across flow and safety",
      "Analyse MHE routes and utilisation, map damage recurrence in IRDS, identify inventory dwell and bring cross-module trends into a management view.",
    ],
    stack: ["IRDS", "MEPS", "IROS", "RTSS", "AIMS"],
    img: UNSPLASH("photo-1586528116311-ad8dd3c8310d"),
    alt: "A high-volume distribution warehouse with densely stacked cartons on pallet racking.",
  },
  {
    id: "food-beverage",
    code: "F&B",
    ref: "FB-08",
    group: CONTROLLED,
    name: "Food & Beverage",
    tagline: "Cold chain and FIFO compliance.",
    problem: [
      "Product age, location and condition drift apart",
      "Pallets remain in staging, FIFO rules are bypassed and temperature-sensitive stock moves without a unified physical view of dwell, route and storage location.",
    ],
    response: [
      "Put movement and dwell into facility context",
      "Connect supported inventory, location and environmental data to identify exceptions, visualise FIFO-sensitive areas and trace the physical path behind an event.",
    ],
    stack: ["Digital Twin", "IROS", "ATOS", "IoT", "AIMS"],
    img: UNSPLASH("photo-1605371924599-2d0365da1ae0"),
    alt: "A food distribution warehouse: pallets of packed goods on the floor and along the racking, down a long aisle.",
  },
  {
    id: "pharmaceuticals",
    code: "PH",
    ref: "PH-09",
    group: CONTROLLED,
    name: "Pharmaceuticals",
    tagline: "Regulated storage and traceability.",
    problem: [
      "Evidence is scattered across systems and records",
      "Asset condition, storage location, environmental events and corrective actions may exist separately, slowing investigation and making traceability harder to demonstrate.",
    ],
    response: [
      "Create a persistent, contextual operating record",
      "Tag facility assets, retain inspection and lifecycle history, connect approved sensor and enterprise data, and provide role-based views for supported investigations.",
    ],
    stack: ["Digital Twin", "IRDS", "IROS", "IoT", "AIMS"],
    img: UNSPLASH("photo-1642055514517-7b52288890ec"),
    alt: "A pharmacy stockroom with medicine cartons ranked along steel shelving, floor to ceiling.",
  },
];

/**
 * The tabs, walked out of the list rather than typed beside it — the same
 * derivation every other filtered page on this site uses, and the only way a
 * filter bar cannot end up hiding part of its own set.
 *
 * The source splits its nine across four labels but shows three chips,
 * folding "regulated" into "controlled". Derived, that fold happens in the
 * data instead of in the control.
 */
export const GROUPS: string[] = INDUSTRIES.reduce<string[]>(
  (out, i) => (out.includes(i.group) ? out : [...out, i.group]),
  [],
);

/* ── the four lenses ──────────────────────────────────────────────── */

export const LENSES: { n: string; name: string; title: string; body: string }[] =
  [
    {
      n: "01",
      name: "Safety",
      title: "Find physical risk earlier.",
      body: "Audits, condition history and live events.",
    },
    {
      n: "02",
      name: "Productivity",
      title: "See how work is produced.",
      body: "Movement, tasks, utilisation and flow.",
    },
    {
      n: "03",
      name: "Efficiency",
      title: "Expose hidden operational waste.",
      body: "Idle time, dwell, exceptions and capacity.",
    },
    {
      n: "04",
      name: "Visibility",
      title: "Operate without information loss.",
      body: "Direct, contextual views across sites.",
    },
  ];

/* ── the gap ──────────────────────────────────────────────────────── */

export const GAP: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Physical risk is discovered too late",
    body: "Damage, unsafe interaction and deteriorating asset condition remain inside manual inspection cycles.",
  },
  {
    n: "02",
    title: "Operational data lacks physical context",
    body: "ERP and WMS records say what was transacted, but not always what is happening on the floor.",
  },
  {
    n: "03",
    title: "Decisions travel through layers of reporting",
    body: "Site reality is compressed into calls, spreadsheets and presentations before it reaches management.",
  },
  {
    n: "04",
    title: "Each system sees only one part",
    body: "Safety, MHE, inventory, maintenance and tasks are analysed separately, hiding cross-module patterns.",
  },
];

/* ── the operating layer ──────────────────────────────────────────── */

/**
 * Five tiers, ground upward.
 *
 * The source draws them top-down from AIMS to the floor. They are reversed
 * here so the stack is read the way it is built — the physical operation at
 * the bottom, management intelligence at the top — which is also the order
 * the engagement steps below follow.
 */
export const LAYERS: { tier: string; title: string; body: string }[] = [
  {
    tier: "Manage",
    title: "AIMS",
    body: "Cross-module and multi-site management intelligence.",
  },
  {
    tier: "Operate",
    title: "IRDS · MEPS · RTSS · IROS · IMDS · ATOS",
    body: "Safety, productivity, inventory, diagnostics and execution applications.",
  },
  {
    tier: "Context",
    title: "RAMS Digital Twin",
    body: "Facility geometry, tagged assets, lifecycle and spatial relationships.",
  },
  {
    tier: "Connect",
    title: "RAMS hardware · Client systems · Supported IoT",
    body: "Operational signals connected through approved interfaces.",
  },
  {
    tier: "Ground",
    title: "People · Racks · MHE · Inventory · Machines",
    body: "The physical operation as it is actually working.",
  },
];

/* ── how we engage ────────────────────────────────────────────────── */

export const STEPS: { n: string; name: string; title: string; body: string }[] =
  [
    {
      n: "01",
      name: "Discover",
      title: "Understand the operation",
      body: "Define the facility, risks, processes, systems, users and decisions that need better evidence.",
    },
    {
      n: "02",
      name: "Audit",
      title: "Establish the physical baseline",
      body: "Assess racks, assets, layouts or workflows within the agreed technical and operational scope.",
    },
    {
      n: "03",
      name: "Connect",
      title: "Digitise what matters",
      body: "Create the Digital Twin, tag assets and integrate supported hardware and enterprise data.",
    },
    {
      n: "04",
      name: "Improve",
      title: "Turn insight into action",
      body: "Deploy applications, close actions, measure outcomes and expand across sites over time.",
    },
  ];

/* ── built for operational reality ────────────────────────────────── */

export const REALITY: [string, string][] = [
  [
    "Asset-level traceability",
    "Exact rack, bay, upright, MHE, machine, zone or supported inventory context.",
  ],
  [
    "Closed-loop corrective action",
    "Findings move from identification to ownership, rectification, evidence and verification.",
  ],
  [
    "Live plus historical context",
    "Current signals sit beside lifecycle, event, inspection and maintenance history.",
  ],
  [
    "Modular adoption",
    "Begin with the highest-value facility, workflow or risk and scale deliberately.",
  ],
];
