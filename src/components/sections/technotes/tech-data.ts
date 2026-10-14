/**
 * The technical notes, from `RAMS_Digital_Technical_Notes.html`.
 *
 * ── This page is not an API specification, and says so ──────────────
 * The source is unusually careful about this and every one of its warnings is
 * carried through: "Illustrative request pattern", "No live endpoint or
 * schema is implied", "Specification required", "Contract before code".
 *
 * That is not boilerplate. Route names, payload shapes and event types on a
 * documentation page are the one kind of content a developer will copy
 * straight into a client, and every one of these is a *pattern* rather than a
 * contract. So the banner sits at the top of the page rather than the bottom,
 * every code block carries an "illustrative" label, every event carries a
 * PATTERN chip, and the first FAQ answer is the question a developer would
 * actually ask.
 *
 * Nothing here was invented to fill a gap. Where the source says "confirm
 * during implementation", so does this.
 *
 * ── The identifiers are deliberately fake ───────────────────────────
 * `site_example`, `asset_example`, `evt_example`, `{{BASE_URL}}`,
 * `{{ACCESS_TOKEN}}`. The source uses placeholder tokens rather than
 * plausible-looking ids for the same reason, and a realistic-looking id in a
 * sample is how a placeholder ends up in production.
 */

export type NavGroup = { title: string; items: { id: string; label: string }[] };

/**
 * The left rail, and the right rail's source.
 *
 * `TOC` is derived by flattening this rather than typed twice — the sidebar
 * and the "On this page" list are the same set of sections in the same order,
 * and two hand-typed copies is how one of them ends up missing a heading.
 */
export const NAV: NavGroup[] = [
  {
    title: "Getting started",
    items: [
      { id: "overview", label: "Overview" },
      { id: "architecture", label: "Architecture" },
      { id: "quick-start", label: "Quick start" },
    ],
  },
  {
    title: "Platform",
    items: [
      { id: "platform-modules", label: "Platform modules" },
      { id: "edge-hardware", label: "Edge & hardware" },
      { id: "standards", label: "Standards & classification" },
    ],
  },
  {
    title: "Reference",
    items: [
      { id: "api-concepts", label: "API concepts" },
      { id: "data-model", label: "Data model" },
      { id: "events", label: "Events & webhooks" },
      { id: "module-data", label: "Module data" },
    ],
  },
  {
    title: "Operations",
    items: [
      { id: "security", label: "Security" },
      { id: "implementation", label: "Implementation" },
      { id: "support", label: "Support" },
      { id: "faq", label: "FAQ" },
    ],
  },
];

export const TOC = NAV.flatMap((g) => g.items);

/* ── 01 Overview ──────────────────────────────────────────────────── */

export const ENTRY: { n: string; title: string; body: string; to: string }[] = [
  {
    n: "01",
    title: "REST API patterns",
    body: "Resource-oriented access for sites, assets, locations, events, actions and selected application data.",
    to: "api-concepts",
  },
  {
    n: "02",
    title: "Events & webhooks",
    body: "Asynchronous flows for status changes, safety events, inspection actions and operational updates.",
    to: "events",
  },
  {
    n: "03",
    title: "Edge & IoT integration",
    body: "Supported sensors, customer devices, machine interfaces and edge processors into the Digital Twin context.",
    to: "architecture",
  },
  {
    n: "04",
    title: "Enterprise platforms",
    body: "Data exchange with WMS, ERP, MES, CMMS and other operational systems.",
    to: "module-data",
  },
  {
    n: "05",
    title: "Digital Twin resources",
    body: "Facilities, zones, locations, assets, relationships, lifecycle records and live operational state.",
    to: "data-model",
  },
  {
    n: "06",
    title: "Security & deployment",
    body: "Access, environments, data boundaries, audit requirements and operational ownership.",
    to: "security",
  },
];

/* ── 02 Architecture ──────────────────────────────────────────────── */

export const PRODUCERS: { title: string; body: string }[] = [
  { title: "Business systems", body: "ERP · WMS · MES · CMMS" },
  { title: "Physical systems", body: "Sensors · PLCs · Machines · Cameras" },
  { title: "Customer applications", body: "Portals · Workflows · Analytics" },
];

export const CONTEXT: { title: string; body: string }[] = [
  { title: "Digital Twin", body: "Facility · Location · Asset · History" },
  {
    title: "Applications",
    body: "Safety · Productivity · Inventory · Maintenance",
  },
  { title: "AIMS", body: "Cross-module and multi-site intelligence" },
];

/* ── 03 Quick start ───────────────────────────────────────────────── */

export const STEPS: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Define the outcome",
    body: "Identify the workflow, users, decision and expected operational response.",
  },
  {
    n: "02",
    title: "Map systems & owners",
    body: "List source systems, data stewards, network boundaries and support teams.",
  },
  {
    n: "03",
    title: "Agree the contract",
    body: "Confirm identifiers, schemas, frequency, validation, error handling and security.",
  },
  {
    n: "04",
    title: "Test safely",
    body: "Use non-production credentials and representative data to validate the flow.",
  },
  {
    n: "05",
    title: "Operate & monitor",
    body: "Track delivery, failures, retries, ownership and controlled change.",
  },
];

/* ── 04 API concepts ──────────────────────────────────────────────── */

export const CONCEPTS: { title: string; body: string }[] = [
  {
    title: "Authentication",
    body: "Use only the credential mechanism issued for the agreed environment and scope.",
  },
  {
    title: "Identifiers",
    body: "Preserve stable site, location, asset and event identifiers across systems.",
  },
  {
    title: "Pagination",
    body: "Plan for bounded result sets, deterministic ordering and continuation tokens.",
  },
  {
    title: "Timestamps",
    body: "Exchange machine-readable timestamps with an agreed timezone policy.",
  },
  {
    title: "Errors",
    body: "Return actionable status, a machine-readable code and a correlation identifier.",
  },
  {
    title: "Versioning",
    body: "Control breaking changes through explicit API and schema version practices.",
  },
];

/**
 * The request sample, in three languages.
 *
 * Placeholders throughout — `{{BASE_URL}}`, `{{ACCESS_TOKEN}}` — and
 * `site_example` rather than anything that looks like a real identifier. The
 * block's own header says ILLUSTRATIVE and the caption under it says the
 * specification governs.
 */
export const SAMPLES: { lang: string; code: string }[] = [
  {
    lang: "cURL",
    code: `curl -X GET "{{BASE_URL}}/sites/{{site_id}}/assets" \\
  -H "Authorization: Bearer {{ACCESS_TOKEN}}" \\
  -H "Accept: application/json"`,
  },
  {
    lang: "JavaScript",
    code: `const res = await fetch(
  \`\${BASE_URL}/sites/\${siteId}/assets\`,
  {
    headers: {
      Authorization: \`Bearer \${accessToken}\`,
      Accept: "application/json",
    },
  },
);

const { data } = await res.json();`,
  },
  {
    lang: "Python",
    code: `import requests

res = requests.get(
    f"{BASE_URL}/sites/{site_id}/assets",
    headers={
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json",
    },
    timeout=30,
)

data = res.json()["data"]`,
  },
];

export const RESPONSE = `{
  "data": [
    {
      "asset_id": "asset_example",
      "asset_type": "mhe",
      "site_id": "site_example",
      "status": "active"
    }
  ]
}`;

/* ── 05 Data model ────────────────────────────────────────────────── */

export const RESOURCES: { name: string; body: string }[] = [
  { name: "site", body: "facility identity" },
  { name: "zone", body: "operating area" },
  { name: "location", body: "spatial position" },
  { name: "asset", body: "physical identity" },
  { name: "event", body: "what happened" },
  { name: "condition", body: "asset state" },
  { name: "action", body: "required response" },
  { name: "task", body: "operational work" },
  { name: "document", body: "supporting record" },
];

export const MODEL_RULES: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Stable identity",
    body: "Avoid using display labels as the only integration key.",
  },
  {
    n: "02",
    title: "Spatial relationship",
    body: "Connect each record to the appropriate facility, zone or physical location.",
  },
  {
    n: "03",
    title: "Lifecycle history",
    body: "Preserve changes and events rather than overwriting the operational past.",
  },
  {
    n: "04",
    title: "Source ownership",
    body: "Define which platform is authoritative for each field and state transition.",
  },
];

/* ── 06 Events ────────────────────────────────────────────────────── */

export const EVENTS: { name: string; body: string }[] = [
  { name: "asset.status.changed", body: "Asset operational state updated" },
  { name: "safety.event.created", body: "New supported safety event recorded" },
  {
    name: "inspection.action.updated",
    body: "Corrective action status changed",
  },
  {
    name: "inventory.movement.recorded",
    body: "Inventory location transition captured",
  },
];

export const EVENT_SAMPLE = `{
  "event_id": "evt_example",
  "event_type": "asset.status.changed",
  "occurred_at": "{{ISO_8601_TIMESTAMP}}",
  "site_id": "site_example",
  "asset": {
    "asset_id": "asset_example",
    "asset_type": "mhe"
  },
  "change": {
    "from": "idle",
    "to": "active"
  },
  "correlation_id": "corr_example"
}`;

/* ── 07 Module data ───────────────────────────────────────────────── */

export const MODULES: {
  name: string;
  inbound: string[];
  outbound: string[];
  systems: string;
}[] = [
  {
    name: "Digital Twin",
    inbound: ["Facility", "Asset master", "Layout reference"],
    outbound: ["Context IDs", "Asset state"],
    systems: "ERP · WMS · CMMS · BIM/CAD workflows",
  },
  {
    name: "IRDS",
    inbound: ["Rack registry", "Inspection scope"],
    outbound: ["Findings", "Actions", "Closure"],
    systems: "CMMS · EHS · Document systems",
  },
  {
    name: "MEPS / RTSS",
    inbound: ["MHE master", "Operator", "Task context"],
    outbound: ["Movement", "Utilisation", "Safety event"],
    systems: "WMS · TMS · EHS · Identity systems",
  },
  {
    name: "IBIS",
    inbound: ["Item", "Pallet", "Expected location"],
    outbound: ["Movement", "Dwell", "Exception"],
    systems: "WMS · ERP · RFID systems",
  },
  {
    name: "IMDS",
    inbound: ["Equipment master", "Service plan"],
    outbound: ["Condition", "Fault", "Maintenance action"],
    systems: "CMMS · Fleet systems · OEM data",
  },
  {
    name: "ATOS / AIMS",
    inbound: ["Priority", "Schedule", "Management context"],
    outbound: ["Task status", "Cross-module insight"],
    systems: "ERP · WMS · BI · Workflow platforms",
  },
];

/* ── Platform: modules, hardware, standards ───────────────────────────
 *
 * Added after the source document, and written only from what the rest of
 * this site already states on its rendered pages — the platform pages
 * (`twin/`, `rds/`, `irdsx/`, `meps/`, `rts/`, `imd/`, `ibis/`, `atos/`,
 * `ams/`), the services data, the certifications register and the nav.
 *
 * Deliberately left out, because the site does not support them: the
 * homepage camera spec sheet (`TechnologySystems` `defaultSpecs` is a
 * placeholder template applied to every card), latency figures such as
 * "< 50 ms" (marketing and illustration only), named vendor connectors
 * beyond SAP, numeric RAG thresholds and a fixed inspection interval —
 * the site states none of those, so neither does this.
 */

export const TWIN_LAYERS: { n: string; name: string; q: string }[] = [
  { n: "01", name: "Spatial", q: "Where is it?" },
  { n: "02", name: "Asset", q: "What is it?" },
  { n: "03", name: "Time", q: "How has it changed?" },
  { n: "04", name: "Condition", q: "What condition is it in?" },
  { n: "05", name: "Operation", q: "How is it being used?" },
  { n: "06", name: "Simulation", q: "What if we change it?" },
  { n: "07", name: "Live", q: "What is happening now?" },
  { n: "08", name: "Intelligence", q: "What does it mean next?" },
];

export const PLATFORM_MODULES: {
  code: string;
  name: string;
  href: string;
  body: string;
  captures: string;
  produces: string;
}[] = [
  {
    code: "Twin",
    name: "Digital Twin",
    href: "/platform/digital-twin",
    body: "A persistent digital representation of the facility and everything operating inside it. Every RAMS application reads from the twin and writes back to it.",
    captures: "Survey, DWG or point cloud · assets, locations, zones and relationships",
    produces: "Stable identity and context for every asset, event and record",
  },
  {
    code: "IRDS",
    name: "Integrated Rack Diagnostic Suite",
    href: "/platform/irds",
    body: "A persistent rack safety layer on the Digital Twin — connecting assets, inspections, risk, evidence, maintenance, procurement and verification.",
    captures: "Rack registry · configured checklists · measurements · photo evidence",
    produces: "RAG-classified findings · corrective actions · verified closure · trends",
  },
  {
    code: "MEPS",
    name: "MHE Efficiency and Productivity System",
    href: "/platform/meps",
    body: "Measures how the MHE fleet works, mapped into the twin's zones and classified into productive, travel, waiting, idle, charging and offline activity.",
    captures: "LiDAR indoor position · operator session · pallet detection · movement and time",
    produces: "Productivity · efficiency · basic safety (speed flags)",
  },
  {
    code: "RTSS",
    name: "Real-Time Safety System",
    href: "/platform/rtss",
    body: "Receives supported sensor, vehicle, vision and system events, places them in operational context, alerts the right people and carries each significant event through review, action and learning.",
    captures: "Impact · driver behaviour · proximity · zone and speed · operator authentication",
    produces: "Contextual alerts · actions through to closure",
  },
  {
    code: "IMDS",
    name: "Integrated MHE Diagnostic System",
    href: "/platform/imds",
    body: "Decision support for MHE condition and maintenance — validated asset by asset, recommend first and automate later.",
    captures: "MHE telematics · fault codes · battery state · RFID · CCTV · maintenance history",
    produces: "Machine health score · predicted needs · condition-based plan",
  },
  {
    code: "IBIS",
    name: "Inventory Behaviour Intelligence Suite",
    href: "/platform/ibis",
    body: "Links SKU, pallet, batch, quantity, movement and dwell to an exact location, compares the record with reality and turns exceptions into action. Neither source is silently overwritten.",
    captures: "Master, stock and transaction data · barcode, QR, RFID, vision or drone capture where validated",
    produces: "Location-linked exceptions · tasks · ABC and ageing insight",
  },
  {
    code: "ATOS",
    name: "Automated Task Orchestration System",
    href: "/platform/ai-operational-intelligence",
    body: "Takes demand from business systems and teams, converts it into structured tasks, applies priorities and dependencies, matches resources and updates the plan when conditions change.",
    captures: "WMS, ERP, TMS, sensor and manual demand",
    produces: "Structured, prioritised tasks · a new plan version when conditions change",
  },
  {
    code: "AIMS",
    name: "AI Intelligence and Management System",
    href: "/platform/security",
    body: "Sits at the top of the platform and aggregates every deployed product across sites into normalised, comparable metrics. High-impact decisions stay human.",
    captures: "RTSS · IRDS · MEPS and IMDS · ATOS and IBIS",
    produces: "Cross-module, multi-site priorities and management decisions",
  },
];

export const EDGE_CHAIN: { step: string; body: string }[] = [
  { step: "Sensor", body: "Physical signal" },
  { step: "Edge processor", body: "OmniBox or customer edge — process near the event" },
  { step: "Twin context", body: "Asset + place + time" },
  { step: "Cloud / history", body: "Persistent record" },
  { step: "Action", body: "Operational response" },
];

export const HARDWARE: { family: string; items: string[]; role: string }[] = [
  {
    family: "AI Vision",
    items: ["Pro — wide-area", "Ultra — high-fidelity", "Max — critical-zone"],
    role: "Tracks people, pallets and MHE as objects; feeds safety events to RTSS and evidence to IRDS.",
  },
  {
    family: "OmniBox",
    items: ["Edge — on-rack inference", "AI — neural compute", "Motion — kinematic sensing", "Core — central orchestration"],
    role: "Edge processing on site: mounted on a rack upright, runs the models locally and stays offline-tolerant, so the floor keeps working when the link does not.",
  },
  {
    family: "Location",
    items: ["LiDAR", "Wi-Fi", "Bluetooth", "UWB"],
    role: "Indoor position, route, speed, zone and dwell for MEPS — no GPS dependency.",
  },
  {
    family: "Sensor stack",
    items: ["Access control", "Crash / impact", "Speed", "Location", "Pallet detection", "Battery management"],
    role: "Impact, tilt, load and vehicle signals for RTSS, MEPS and IMDS.",
  },
  {
    family: "Guided inspection",
    items: ["AirScan — drone rack scanning", "Floor Scan"],
    role: "Automated capture for rack and floor checks.",
  },
];

export const PROTOCOLS: { name: string; body: string }[] = [
  { name: "MQTT", body: "Sensors" },
  { name: "OPC-UA", body: "Machines" },
  { name: "Modbus", body: "PLCs" },
  { name: "BACnet", body: "Building" },
];

export const RACK_STANDARDS = [
  "EN 15635",
  "EN 15512",
  "EN 15620",
  "EN 15629",
  "AS 4084.1 / 4084.2",
  "RMI / ANSI MH16.1",
  "SEMA practices",
  "Local requirements",
];

export const RAG: { tone: "red" | "amber" | "green"; label: string; body: string }[] = [
  {
    tone: "red",
    label: "Red",
    body: "Priority finding requiring immediate review and action. Unload and isolate, and replace the damaged element before a verified return to use.",
  },
  {
    tone: "amber",
    label: "Amber",
    body: "Planned attention. Plan repair or replacement within the defined window.",
  },
  {
    tone: "green",
    label: "Green",
    body: "No identified priority condition. Monitor, and review at the next planned inspection cycle.",
  },
];

export const STRUCTURAL_TESTS: { code: string; name: string }[] = [
  { code: "G1", name: "Plumbness" },
  { code: "G2", name: "Rack run straightness" },
  { code: "G3", name: "System lateral sway" },
  { code: "G4", name: "Floor flatness" },
];

/* ── 08 Security ──────────────────────────────────────────────────── */

export const SAFEGUARDS: {
  code: string;
  title: string;
  body: string;
}[] = [
  {
    code: "01 · Access",
    title: "Least-privilege permissions",
    body: "Scope credentials to the required environment, resources, actions and operational purpose.",
  },
  {
    code: "02 · Transport",
    title: "Protected data exchange",
    body: "Use approved transport security, endpoint validation and network controls for the agreed topology.",
  },
  {
    code: "03 · Tenancy",
    title: "Defined data boundaries",
    body: "Document tenant, site, user and customer boundaries before any production data exchange.",
  },
  {
    code: "04 · Audit",
    title: "Traceable access and change",
    body: "Retain the records needed to investigate requests, errors, configuration changes and actions.",
  },
  {
    code: "05 · Resilience",
    title: "Failures handled deliberately",
    body: "Agree timeouts, retries, idempotency, dead-letter handling, replay and incident ownership.",
  },
  {
    code: "06 · Change",
    title: "Controlled evolution",
    body: "Use versioning, non-production validation, release notes and rollback planning for interface changes.",
  },
];

/* ── 09 Implementation ────────────────────────────────────────────── */

export const PHASES: {
  n: string;
  title: string;
  body: string;
  points: string[];
}[] = [
  {
    n: "Phase 01",
    title: "Discover",
    body: "Clarify the use case and operating decision.",
    points: ["System inventory", "Data ownership", "Network constraints"],
  },
  {
    n: "Phase 02",
    title: "Design",
    body: "Define the complete interface contract.",
    points: ["Schema mapping", "Security review", "Error behaviour"],
  },
  {
    n: "Phase 03",
    title: "Validate",
    body: "Test safely with representative scenarios.",
    points: ["Non-production flow", "Negative cases", "Acceptance evidence"],
  },
  {
    n: "Phase 04",
    title: "Operate",
    body: "Release with monitoring and support.",
    points: ["Production readiness", "Runbook and owners", "Change control"],
  },
];

/* ── 10 FAQ ───────────────────────────────────────────────────────── */

export const FAQS: [string, string][] = [
  [
    "Does this page contain the live RAMS API specification?",
    "No. The routes, resource names and payloads shown are illustrative integration patterns. Use only the specification, environment details and credentials issued for your approved implementation.",
  ],
  [
    "Which enterprise systems can connect to RAMS?",
    "RAMS is positioned for integration with systems such as WMS, ERP and other third-party platforms. The exact connector, method, direction and supported fields must be confirmed for the customer environment.",
  ],
  [
    "Can customer-owned sensors and devices be integrated?",
    "Potential integrations can include customer sensors, cameras, machines, PLCs, location systems and other IoT sources, subject to interface compatibility, security review and validation.",
  ],
  [
    "How should testing be organised?",
    "Use a controlled non-production environment, representative test data, positive and negative scenarios, agreed acceptance criteria and a documented production-readiness review.",
  ],
  [
    "Who owns source-of-truth decisions?",
    "The integration design should name the authoritative platform and business owner for each record, field and state transition. Conflicts and reconciliation rules should be agreed before go-live.",
  ],
];
