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
    name: "IROS",
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
