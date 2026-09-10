/**
 * IROS — RAMS Inventory Intelligence, from
 * `RAMS_Digital_Inventory_Intelligence_Platform.html`.
 *
 * Plain data, no React: the icons are named and the section components hold
 * the name → glyph table, the way `industry-data` does.
 *
 * ── The caveats are the content ────────────────────────────────────
 * This source is more careful than most, and for a reason: an inventory
 * platform that sits beside a WMS could easily be read as replacing it. The
 * hedges are carried word for word — "no automatic adjustment should be
 * assumed", "supported", "approved", "agreed during discovery" — and the
 * sharpest are exported as `NOTES` and set in mono caps where the source put
 * them.
 *
 * The system-of-record caveat that used to sit under the capabilities was
 * removed on request. The same ground is still held by the integrations note
 * and by the first FAQ answer, both of which say the platform complements the
 * existing system rather than replacing it — so do not add it back a third
 * time.
 *
 * ── One section is dropped ─────────────────────────────────────────
 * "The physical inventory layer around your WMS or ERP" is a side-by-side
 * diagram of a WMS record and a Digital Twin record disagreeing about a
 * location. Its two panels carry field values and no prose, so there was
 * nothing to convert without writing copy the document does not contain.
 *
 * There is no figure anywhere on this page that the source did not state.
 */

export type Item = {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  tags?: string[];
};

export type Step = { n: string; title: string; body: string };

/* ── hero ─────────────────────────────────────────────────────────── */

export const HERO = {
  eyebrow: "RAMS Inventory Intelligence",
  top: "Know what you have.",
  bottom: "Know where it is.",
  body: "Connect SKU, pallet, batch, quantity, movement and dwell to the exact physical warehouse location. Compare system records with operational reality, surface exceptions and act before a mismatch becomes a search, delay or write-off.",
  chips: ["Locate", "Compare", "Act"],
};

/** The band under the hero — the source's own four hero-panel lines. */
export const ASSURANCES: Item[] = [
  {
    title: "See inventory in place",
    body: "Exact warehouse, zone, rack, bay, level or floor area.",
  },
  {
    title: "Compare record with reality",
    body: "Surface quantity, identity, status and location gaps.",
  },
  {
    title: "Know what is standing still",
    body: "Dwell, slow-moving and non-moving stock by location.",
  },
  {
    title: "Turn exceptions into action",
    body: "Assigned investigation, correction and verification.",
  },
];

/* ── the caveats, verbatim ────────────────────────────────────────── */

export const NOTES = {
  abc: "ABC thresholds, cost fields, period and consumption-value formula are agreed with the customer. Financial classifications are not inferred from incomplete data.",
  integration:
    "The customer's authoritative system and adjustment process remain explicitly defined. Integration does not imply silent two-way writeback.",
};

/* ── the problem ──────────────────────────────────────────────────── */

export const PROBLEM: Item[] = [
  {
    icon: "MapPin",
    title: "Inventory exists — but not where the system says",
    body: "Teams search, recheck and create emergency movements before work can continue.",
  },
  {
    icon: "Route",
    title: "Movement history stops at the transaction",
    body: "The source, destination, vehicle, operator, route and dwell context remain fragmented.",
  },
  {
    icon: "Timer",
    title: "Slow-moving stock is visible only in reports",
    body: "Ageing is not connected to its physical location, capacity use or nearby demand.",
  },
  {
    icon: "Boxes",
    title: "Racked and floor stock live in different views",
    body: "Staging, quarantine, returns and floor-stack areas become operational blind zones.",
  },
  {
    icon: "PackageSearch",
    title: "Differences are adjusted without fixing the cause",
    body: "The same location, process or master-data problem returns after reconciliation.",
  },
];

/* ── capabilities ─────────────────────────────────────────────────── */

export const CAPABILITIES: Item[] = [
  {
    icon: "MapPin",
    title: "Location visibility",
    body: "View stock by site, zone, rack, bay, level, floor position, staging area or controlled location.",
  },
  {
    icon: "Boxes",
    title: "Pallet & stock mapping",
    body: "Connect supported pallet, SKU, batch, quantity, status and owner records to physical place.",
  },
  {
    icon: "Route",
    title: "Movement history",
    body: "Record source, destination, time, quantity and available MHE or operator context for supported moves.",
  },
  {
    icon: "Scale",
    title: "Reconciliation intelligence",
    body: "Compare approved system records with captured physical evidence and classify the difference.",
  },
  {
    icon: "Timer",
    title: "Ageing & dwell",
    body: "Group stock by configurable ageing thresholds and see where long-dwell inventory consumes capacity.",
  },
  {
    icon: "ShieldAlert",
    title: "Exception detection",
    body: "Surface wrong location, quantity variance, unidentified stock, duplicate identity and status conflicts.",
  },
  {
    icon: "LayoutGrid",
    title: "Space & capacity",
    body: "Compare occupied, available, blocked and unsuitable positions across rack and floor-storage zones.",
  },
  {
    icon: "ScanLine",
    title: "Flexible capture",
    body: "Use approved manual, barcode, QR, RFID, vision, drone, AGV or system-event methods where validated.",
  },
];

/* ── the workflow ─────────────────────────────────────────────────── */

export const WORKFLOW: Step[] = [
  {
    n: "01",
    title: "Connect",
    body: "Import approved product, batch, stock and location data.",
  },
  {
    n: "02",
    title: "Map",
    body: "Link each record to the Digital Twin location structure.",
  },
  {
    n: "03",
    title: "Capture",
    body: "Record supported movement, count and status events.",
  },
  {
    n: "04",
    title: "Compare",
    body: "Detect identity, quantity, location and ageing exceptions.",
  },
  {
    n: "05",
    title: "Act",
    body: "Assign investigation, count, move or data-correction tasks.",
  },
  {
    n: "06",
    title: "Learn",
    body: "Use history to improve storage, flow and control.",
  },
];

/* ── ABC ──────────────────────────────────────────────────────────── */

export const ABC: {
  letter: string;
  band: string;
  body: string;
  lens: string;
}[] = [
  {
    letter: "A",
    band: "High value / critical",
    body: "Tighter review frequency, faster exception escalation and higher evidence requirements.",
    lens: "Example lens: highest annual consumption value or business criticality.",
  },
  {
    letter: "B",
    band: "Moderate value",
    body: "Balanced control frequency based on movement, ageing and operational consequence.",
    lens: "Example lens: middle contribution band under approved thresholds.",
  },
  {
    letter: "C",
    band: "Lower value / high volume",
    body: "Efficient location and cycle-count strategies designed for scale and handling frequency.",
    lens: "Example lens: lower value contribution with potentially high physical volume.",
  },
];

/** The ATOS strip under the ABC cards, which is the source's own. */
export const ABC_ACTION = {
  eyebrow: "ATOS",
  title: "Turn priority into controlled execution",
  body: "Create cycle-count, relocate, investigate or verification tasks with ownership, route priority and closure evidence.",
};

/* ── use cases ────────────────────────────────────────────────────── */

export const USE_CASES: Item[] = [
  {
    title: "Find stock without searching",
    body: "Open the mapped location and available movement history before sending a team across the warehouse.",
  },
  {
    title: "Investigate location mismatch",
    body: "Compare system and physical place, then review the supporting move or capture event.",
  },
  {
    title: "Prioritise cycle counts",
    body: "Combine ABC class, exception history, ageing and location risk to focus limited counting capacity.",
  },
  {
    title: "Reduce unnecessary handling",
    body: "See how often a pallet moved, where it travelled and how long it stayed at each place.",
  },
  {
    title: "Control ageing stock",
    body: "Locate long-dwell inventory and connect it to status, capacity and required operational action.",
  },
  {
    title: "Compare sites and zones",
    body: "Review accuracy, exceptions, ageing and storage use through a consistent management view.",
  },
];

/* ── outcomes ─────────────────────────────────────────────────────── */

export const OUTCOMES: Item[] = [
  {
    title: "Faster location confidence",
    body: "See the last known physical context and exception state from one interface.",
  },
  {
    title: "Earlier discrepancy detection",
    body: "Identify mismatches before picking, dispatch, audit or financial closure.",
  },
  {
    title: "Less avoidable movement",
    body: "Use movement history to expose repeat handling, backtracking and storage friction.",
  },
  {
    title: "Clearer space use",
    body: "Understand what occupies valuable rack, floor, staging and controlled locations.",
  },
];

/* ── integrations ─────────────────────────────────────────────────── */

export const INTEGRATIONS: Item[] = [
  {
    tag: "WMS / ERP / SAP",
    title: "Master data, stock and transaction context",
    body: "API, event interface or controlled file exchange as supported.",
  },
  {
    tag: "Barcode / QR",
    title: "Identity and location capture",
    body: "Connect scan events to the approved item and location master.",
  },
  {
    tag: "RFID",
    title: "Supported tag-event capture",
    body: "Coverage, interference, duplicate-read and confidence controls validated.",
  },
  {
    tag: "Vision / scanners",
    title: "Image or mobile capture where appropriate",
    body: "Exceptions subject to confidence rules and human review.",
  },
  {
    tag: "MHE / IoT",
    title: "Movement and operating context",
    body: "Supported source, destination, asset, operator and time signals.",
  },
  {
    tag: "RAMS platform",
    title: "Digital Twin, ATOS and AIMS",
    body: "Physical context, task execution and multi-site management insight.",
  },
];

/* ── governance ───────────────────────────────────────────────────── */

export const GOVERNANCE: Item[] = [
  {
    icon: "KeyRound",
    title: "Role-based access",
    body: "Limit site, function, action and management views according to authorised responsibilities.",
  },
  {
    icon: "History",
    title: "Traceable activity",
    body: "Time-stamp supported data imports, location updates, exception actions and closure events.",
  },
  {
    icon: "FileLock2",
    title: "Customer data ownership",
    body: "Define authoritative fields, retention, export, access and permitted processing during discovery.",
  },
  {
    icon: "Cable",
    title: "Controlled integrations",
    body: "Confirm credentials, schemas, validation, frequency and failure handling for every interface.",
  },
  {
    icon: "Server",
    title: "Environment boundaries",
    body: "Agree tenant, site, user and data-separation requirements before production rollout.",
  },
];

/* ── rollout ──────────────────────────────────────────────────────── */

export const ROLLOUT: Step[] = [
  {
    n: "01",
    title: "Define value and authority",
    body: "Sites, users, stock classes, source systems, KPIs and system-of-record rules.",
  },
  {
    n: "02",
    title: "Map data and identifiers",
    body: "Products, pallets, batches, locations, events and approved integration method.",
  },
  {
    n: "03",
    title: "Build location context",
    body: "Facility, zones, racks, bays, levels, floor areas and operational boundaries.",
  },
  {
    n: "04",
    title: "Validate one workflow",
    body: "Capture, compare, investigate, act and verify with agreed users and scope.",
  },
  {
    n: "05",
    title: "Expand by value",
    body: "Add inventory classes, capture points, sites, applications and management views.",
  },
];

/* ── who uses it ──────────────────────────────────────────────────── */

export const ROLES: Item[] = [
  {
    icon: "Search",
    title: "Investigate exceptions",
    body: "Compare records, organise counts and trace recurring discrepancies.",
    tags: ["Accuracy and variance", "ABC and count priority", "Adjustment evidence"],
  },
  {
    icon: "Forklift",
    title: "Keep stock moving",
    body: "Find inventory, reduce repeat handling and improve location discipline.",
    tags: ["Movement and dwell", "Staging visibility", "Task execution"],
  },
  {
    icon: "History",
    title: "See the evidence trail",
    body: "Review source, location, count, action and authorised closure.",
    tags: ["Traceable history", "Role and timestamp", "Controlled exceptions"],
  },
  {
    icon: "LineChart",
    title: "Compare across sites",
    body: "See ageing, accuracy, capacity and action trends without layered reporting.",
    tags: ["AIMS dashboards", "Site comparison", "Priority visibility"],
  },
];

/* ── questions ────────────────────────────────────────────────────── */

export const FAQS: [string, string][] = [
  [
    "Does Inventory Intelligence replace our WMS or ERP?",
    "Not necessarily. RAMS is designed to complement the existing system of record by adding physical location, movement, ageing and exception context. Authoritative data and permitted writeback are agreed field by field.",
  ],
  [
    "How is inventory data added?",
    "Supported routes can include APIs, event interfaces, structured file exchange, barcode or QR scans, RFID, manual workflows and validated mobile or automated capture. The implementation uses only the methods approved for the scope.",
  ],
  [
    "Can the platform track floor stock as well as racks?",
    "Yes. The location model can include racks, bays and levels as well as floor-stack blocks, staging, quarantine, returns, production interfaces and other defined zones.",
  ],
  [
    "Does the platform automatically adjust stock?",
    "No automatic adjustment should be assumed. RAMS can identify and route an exception, but recount, investigation, approval and system adjustment remain controlled by the agreed customer process and user permissions.",
  ],
  [
    "How is inventory ageing calculated?",
    "The date basis, event logic, stock status, exclusions and ageing buckets are configured from approved business rules and available history. The platform should not infer an age from incomplete events without making that limitation visible.",
  ],
  [
    "Can we begin with one site?",
    "Yes. A pilot can focus on one facility, zone, stock class or operational question. Once identifiers, capture and exception handling are validated, the same model can expand across additional locations.",
  ],
  [
    "Is this the same as the Inventory Reconciliation and Audit service?",
    "No. The audit service is a bounded physical verification and reconciliation assignment. Inventory Intelligence is the continuous platform layer for location visibility, movement history, ageing, exceptions and ongoing decision support. They can be used independently or together.",
  ],
];

/* ── the close ────────────────────────────────────────────────────── */

export const CLOSE = {
  eyebrow: "Physical truth, not a second ledger",
  top: "Connect the inventory record",
  bottom: "to the physical truth.",
  body: "Map locations. Track supported movement. Find ageing and exceptions. Give operations and management one persistent view of what is actually happening in the warehouse.",
};
