/**
 * The help centre, from `RAMS_Digital_FAQs.html`.
 *
 * ── Fifty answers, extracted rather than retyped ────────────────────
 * Pulled from the document's own `faqs` array, so no answer drifted in
 * transcription. Nine topics, and the counts under each are derived from this
 * list rather than written beside it — the source's own header says "50
 * ANSWERS" in three places, which only stays true while nobody edits the
 * array.
 *
 * ── The capability caveat is the source's, and it stays ─────────────
 * "Capabilities may vary by agreed modules, hardware, integrations and
 * deployment scope." Several of these answers describe what the platform
 * *can* do, and on a help centre that reads as what it *will* do for the
 * reader's own site. The line sits above the topic grid rather than in a
 * footnote for that reason, and the answers keep the source's own hedges —
 * "supported", "where available", "confirm during implementation" — rather
 * than being tightened into promises the document did not make.
 *
 * ── Every answer has a stable id, and that is a feature ─────────────
 * The source lets a reader copy a direct link to one answer. The ids are
 * carried through unchanged so those links keep working, and `FaqList` opens
 * the row named in the URL's hash on arrival.
 */

export type Faq = {
  id: string;
  topic: string;
  question: string;
  answer: string;
};

export type Topic = {
  id: string;
  /** Two-letter mark on the topic card. */
  code: string;
  name: string;
  desc: string;
};

/** The nine topics, in the order the source lists them. */
export const TOPICS: Topic[] = [
  {
    id: "getting-started",
    code: "GS",
    name: "Getting started",
    desc: "Platform basics and product selection",
  },
  {
    id: "digital-twin",
    code: "DT",
    name: "Digital Twin",
    desc: "Facility models, assets and live context",
  },
  {
    id: "rack-safety",
    code: "IR",
    name: "IRDS & rack safety",
    desc: "Inspection, severity and closure",
  },
  { id: "mhe", code: "MH", name: "MHE systems", desc: "MEPS, RTSS and IMDS" },
  {
    id: "inventory-operations",
    code: "IO",
    name: "Inventory & operations",
    desc: "IROS, ATOS and AIMS",
  },
  {
    id: "integrations",
    code: "IN",
    name: "Integrations",
    desc: "WMS, ERP, devices and APIs",
  },
  {
    id: "implementation",
    code: "IM",
    name: "Implementation",
    desc: "Scoping, deployment and adoption",
  },
  {
    id: "security",
    code: "SD",
    name: "Security & data",
    desc: "Access, data and assurance",
  },
  {
    id: "support",
    code: "SP",
    name: "Account & support",
    desc: "Users, help and ongoing service",
  },
];

export const FAQS: Faq[] = [
  {
    id: "what-is-rams",
    topic: "getting-started",
    question: "What is RAMS Digital?",
    answer: "RAMS Digital is a platform for organising and improving physical operations. It combines a Digital Twin with modular applications, connected data, supported sensors and operational workflows for areas such as rack safety, MHE productivity, safety, inventory, maintenance, task execution and management visibility.",
  },
  {
    id: "who-is-rams-for",
    topic: "getting-started",
    question: "Who is RAMS designed for?",
    answer: "RAMS is designed for organisations operating warehouses, factories, distribution centres, logistics facilities and other asset-intensive built environments. Typical users include operations, EHS, engineering, maintenance, warehouse management and leadership teams.",
  },
  {
    id: "start-with-one-module",
    topic: "getting-started",
    question: "Do we need to implement every RAMS module?",
    answer: "No. A customer can begin with the Digital Twin, a specific application or a defined service scope, then add modules and integrations as value is proven. The recommended starting point depends on the operational problem, available data and desired outcome.",
  },
  {
    id: "choose-product",
    topic: "getting-started",
    question: "How do I know which RAMS product we need?",
    answer: "Start with the decision you want to improve. Choose IRDS for rack safety, MEPS for MHE productivity, RTSS for MHE safety, IROS for inventory intelligence, IMDS for MHE diagnostics, ATOS for task orchestration and AIMS for management visibility. The Digital Twin can provide the common physical context underneath them.",
  },
  {
    id: "software-hardware-services",
    topic: "getting-started",
    question: "Does RAMS provide software, hardware and services?",
    answer: "RAMS can combine software applications, supported hardware and professional services. The exact mix is selected for the use case—for example, a rack-inspection programme may use IRDS and inspection services, while live operational visibility may also require sensors, edge devices or system integrations.",
  },
  {
    id: "what-is-digital-twin",
    topic: "digital-twin",
    question: "What is the RAMS Digital Twin?",
    answer: "The RAMS Digital Twin is a persistent digital representation of a physical facility and its assets. It can organise geometry, locations, asset identity, relationships, condition, history, movement, events and connected operational data in a shared spatial context.",
  },
  {
    id: "more-than-3d",
    topic: "digital-twin",
    question: "Is the Digital Twin only a 3D model?",
    answer: "No. The model is the starting point. The operational value comes from tagging assets, retaining lifecycle history, simulating proposed changes, connecting supported live data and running applications against the same physical context.",
  },
  {
    id: "create-digital-twin",
    topic: "digital-twin",
    question: "How is a facility Digital Twin created?",
    answer: "A facility can be drawn directly in the platform or reconstructed from captured physical information such as a LiDAR scan. The practical method depends on the facility, accuracy required, source material and intended use. It is not limited to uploading a CAD drawing.",
  },
  {
    id: "assets-tagged",
    topic: "digital-twin",
    question: "What can be tagged inside the Digital Twin?",
    answer: "Assets can include racks, bays, uprights, beams, MHE, machines, conveyors, pallets, docks, safety equipment, utilities, barriers, sensors and structural elements. The available hierarchy and attributes are configured for the agreed use case.",
  },
  {
    id: "live-site-changes",
    topic: "digital-twin",
    question: "Can managers see live changes made at a site?",
    answer: "Where the relevant data source is connected, the Digital Twin can show updated asset state, movement, sensor events, tasks and other supported operational changes in physical context. A manager can access the site remotely without relying only on a report or presentation.",
  },
  {
    id: "simulate-changes",
    topic: "digital-twin",
    question: "Can we test a proposed change before implementing it?",
    answer: "The Digital Twin can support defined feasibility and conflict checks such as physical fit, clearances, routes, safety zones and spatial conflicts. A simulation supports decision-making, but it does not replace engineering approval unless the specific validated check is intended for that purpose.",
  },
  {
    id: "what-is-irds",
    topic: "rack-safety",
    question: "What is IRDS?",
    answer: "IRDS is the Integrated Rack Diagnostic Suite. It supports the digital rack asset registry, inspections, findings, risk classification, corrective actions, verification and lifecycle history in one connected workflow.",
  },
  {
    id: "rack-inspection-scope",
    topic: "rack-safety",
    question: "What does a rack inspection typically cover?",
    answer: "The scope can include configuration, uprights, beams, bracing, baseplates, anchors, safety locking devices, protectors, load information, alignment, visible damage, corrosion, clearances and operational observations. The final checklist must match the agreed standard, rack type, drawings and service scope.",
  },
  {
    id: "severity-colours",
    topic: "rack-safety",
    question: "What do green, amber and red findings mean?",
    answer: "They communicate different levels of attention and response under the adopted inspection methodology. For RAMS reporting, damaged elements classified red or amber are recommended for replacement, while green findings remain under observation. The complete technical criteria and required controls—not colour alone—govern the decision.",
  },
  {
    id: "rack-repair",
    topic: "rack-safety",
    question: "Can a damaged rack component be repaired?",
    answer: "Do not assume an improvised repair or site welding is acceptable. The affected location should be controlled, and the action should follow the applicable standard, manufacturer requirements and competent engineering decision. RAMS normally recommends replacement for damaged red and amber rack elements.",
  },
  {
    id: "inspection-frequency",
    topic: "rack-safety",
    question: "How often should racks be inspected?",
    answer: "The frequency depends on the applicable standard, site risk, MHE activity, damage history and contractual requirements. A robust programme normally combines immediate reporting, regular site checks and periodic expert inspection. RAMS can help define and digitise the appropriate cycle.",
  },
  {
    id: "stability-certificate",
    topic: "rack-safety",
    question: "Does an inspection automatically result in a rack stability certificate?",
    answer: "No. Certificate status depends on the agreed assessment scope, available technical information, rack condition and completion of required actions. Where critical issues remain, use may need to be restricted until rectification and verification are completed.",
  },
  {
    id: "rectification-closure",
    topic: "rack-safety",
    question: "How are rack findings closed?",
    answer: "Each finding should identify the exact location, damaged element, required action, responsible owner and evidence. After authorised rectification, completion evidence is reviewed and reinspection or verification is performed where required before closure.",
  },
  {
    id: "block-affected-location",
    topic: "rack-safety",
    question: "Should an affected rack location be blocked?",
    answer: "Where a finding requires unloading, isolation or restricted use, the affected storage position should remain controlled until the required action and verification are complete. The exact extent of blocking depends on the element, location and competent assessment.",
  },
  {
    id: "what-is-meps",
    topic: "mhe",
    question: "What is MEPS?",
    answer: "MEPS is the MHE Efficiency and Productivity System. It is designed to provide context around MHE movement, utilisation, idle time, routes, zones and productivity so operations teams can understand how equipment produces work.",
  },
  {
    id: "what-is-rtss",
    topic: "mhe",
    question: "What is RTSS?",
    answer: "RTSS is the Real Time Safety System. It supports visibility into MHE-related safety events, impacts, operating zones and other supported risk signals, with the physical context needed for response and analysis.",
  },
  {
    id: "what-is-imds",
    topic: "mhe",
    question: "What is IMDS?",
    answer: "IMDS is the Integrated MHE Diagnostic System. It connects equipment condition, faults, inspections, maintenance, service history and operational context to support fleet health and lifecycle decisions.",
  },
  {
    id: "live-mhe-view",
    topic: "mhe",
    question: "Can we see a moving forklift inside the Digital Twin?",
    answer: "Yes, when the required positioning and data sources are part of the deployment. A user can select the MHE to view supported fields such as location, status, route, operator context, task, speed or event history, depending on the configured system.",
  },
  {
    id: "measure-mhe-productivity",
    topic: "mhe",
    question: "How does RAMS measure MHE productivity?",
    answer: "MEPS can combine movement and activity states to analyse working time, idle time, utilisation, travel patterns, zone activity and task context. Metrics must be defined with the customer so they reflect the actual process rather than a generic productivity score.",
  },
  {
    id: "mhe-safety-detection",
    topic: "mhe",
    question: "Does RTSS prevent every MHE incident?",
    answer: "No safety system should be presented as eliminating all incidents. RTSS can improve visibility, detection and response for supported events, but safe operations still depend on equipment condition, traffic design, operator competence, procedures, supervision and site controls.",
  },
  {
    id: "what-is-iros",
    topic: "inventory-operations",
    question: "What is IROS or Inventory Intelligence?",
    answer: "IROS is the RAMS application for physical inventory visibility and optimisation. It can connect inventory identity with location, movement, dwell, exceptions and storage context to complement the records held in enterprise systems.",
  },
  {
    id: "inventory-vs-wms",
    topic: "inventory-operations",
    question: "Does Inventory Intelligence replace the WMS?",
    answer: "Not necessarily. A WMS typically manages inventory and process transactions, while RAMS can add physical context and supported movement or exception visibility. The platforms can be integrated so each remains authoritative for the agreed data.",
  },
  {
    id: "what-is-atos",
    topic: "inventory-operations",
    question: "What is ATOS?",
    answer: "ATOS is the Automated Task Orchestration System. It supports assignment, priority, status, routing decisions and closed-loop execution of operational work using the information available from connected systems and the physical context.",
  },
  {
    id: "atos-delay-reprioritisation",
    topic: "inventory-operations",
    question: "Can ATOS reprioritise work when a truck is delayed?",
    answer: "Yes, this can be configured as a workflow. Delay information may come from an approved GPS integration or be entered by the warehouse manager. ATOS can then recalculate priorities and route work based on the defined operational rules.",
  },
  {
    id: "what-is-aims",
    topic: "inventory-operations",
    question: "What is AIMS?",
    answer: "AIMS is the AI Intelligence and Management System. It connects data across RAMS modules to support cross-module insight, management dashboards and direct multi-site visibility into sites, assets and operational parameters.",
  },
  {
    id: "existing-systems",
    topic: "integrations",
    question: "Can RAMS integrate with our existing systems?",
    answer: "RAMS is designed to integrate with systems such as WMS, ERP and other approved third-party platforms. The exact method, data direction, frequency, identifiers and supported fields are confirmed during integration discovery.",
  },
  {
    id: "customer-hardware",
    topic: "integrations",
    question: "Can we use our own sensors, cameras or IoT devices?",
    answer: "Potentially. Customer-owned sensors, cameras, PLCs, machines, location systems and other IoT sources can be evaluated for integration. Compatibility, data access, security, timing and operational reliability must be validated for the specific device and use case.",
  },
  {
    id: "apis-webhooks",
    topic: "integrations",
    question: "Does RAMS provide APIs or webhooks?",
    answer: "Integration options can include APIs, event interfaces, file exchange or other agreed methods. Exact endpoints, authentication, schemas, event types, limits and availability must be confirmed for the contracted module and environment.",
  },
  {
    id: "source-of-truth",
    topic: "integrations",
    question: "Which system remains the source of truth?",
    answer: "That decision is made field by field during solution design. For example, an ERP or WMS may remain authoritative for master or transaction data while RAMS owns Digital Twin identity, physical context, inspection findings or sensor-derived events. Reconciliation rules should be documented.",
  },
  {
    id: "real-time-definition",
    topic: "integrations",
    question: "What does “real time” mean in a RAMS deployment?",
    answer: "Update latency depends on the source system, sensor, network, edge processing, interface and workflow. The project should define the required event frequency and acceptable latency rather than assuming every data source updates continuously.",
  },
  {
    id: "implementation-start",
    topic: "implementation",
    question: "How does a RAMS implementation begin?",
    answer: "Implementation starts with discovery: the facility, assets, operational problem, users, decisions, existing systems and desired outcomes are defined. RAMS then agrees the Digital Twin, applications, hardware, integrations, data and adoption scope.",
  },
  {
    id: "implementation-time",
    topic: "implementation",
    question: "How long does implementation take?",
    answer: "Timing depends on site size, number of assets, required accuracy, modules, hardware installation, data readiness, integrations, access and customer approvals. A phased implementation plan should be issued after discovery rather than using one duration for every project.",
  },
  {
    id: "site-preparation",
    topic: "implementation",
    question: "What information should a customer prepare?",
    answer: "Useful inputs include layouts or drawings, asset lists, rack and MHE details, site contacts, safety rules, operating schedules, inspection history, integration architecture, device information and the business decisions the project must support.",
  },
  {
    id: "training",
    topic: "implementation",
    question: "Is user training included?",
    answer: "Training and handover should be defined in the commercial and implementation scope. Role-based sessions may cover administration, inspections, dashboards, workflows, actions, reporting and support processes.",
  },
  {
    id: "multi-site-rollout",
    topic: "implementation",
    question: "Can we begin with one site and expand later?",
    answer: "Yes. A pilot can validate asset structure, workflows, data, adoption and expected outcomes before a broader rollout. Naming conventions, governance and integration design should still be created with future sites in mind.",
  },
  {
    id: "data-ownership",
    topic: "security",
    question: "Who owns the customer data in RAMS?",
    answer: "Data ownership, permitted use, retention and exit arrangements should be defined in the applicable agreement and data documentation. Customers should review those terms for their deployment rather than rely on a general website statement.",
  },
  {
    id: "user-access",
    topic: "security",
    question: "Can access be restricted by role or site?",
    answer: "Role and site-based access can be configured where supported by the deployment. The required roles, permissions, approval flows and segregation should be agreed during implementation and tested before production use.",
  },
  {
    id: "security-documents",
    topic: "security",
    question: "Where can we obtain RAMS security and compliance information?",
    answer: "Request the current security pack from RAMS Digital. Available material should be matched to the proposed architecture and may include applicable controls, hosting details, access model, data flows and supporting documentation.",
  },
  {
    id: "data-protection",
    topic: "security",
    question: "How is data protected?",
    answer: "Security is designed through the complete deployment: identity, access, transport, storage, tenant boundaries, logging, network design, backups, monitoring and change control. The exact controls and responsibilities must be confirmed for the selected environment and integrations.",
  },
  {
    id: "ai-data-use",
    topic: "security",
    question: "Does RAMS use customer data to train AI models?",
    answer: "The answer can depend on the specific AI service, model and agreement. Customers should obtain written confirmation covering data flow, processing purpose, retention, model use and third-party processors for every AI-enabled deployment.",
  },
  {
    id: "add-users",
    topic: "support",
    question: "How are users added or removed?",
    answer: "Authorised administrators or the agreed support process manage user access. Joiner, mover and leaver responsibilities, approval and review frequency should be documented for the deployment.",
  },
  {
    id: "technical-support",
    topic: "support",
    question: "How do we contact RAMS support?",
    answer: "Contact connect@rams.digital or use the support process defined during implementation. Include the site, module, affected user or asset, time, screenshots or evidence, operational impact and urgency.",
  },
  {
    id: "feature-request",
    topic: "support",
    question: "Can we request a customer-specific application or feature?",
    answer: "Yes. The Digital Twin can support customer-specific applications for physical operational processes beyond the standard RAMS modules. RAMS will assess the workflow, users, data, integration, security and expected value before defining scope.",
  },
  {
    id: "reports-export",
    topic: "support",
    question: "Can reports or data be exported?",
    answer: "Available reports and export formats depend on the module, user permissions and agreed implementation. Confirm the required fields, format, frequency, recipients and data-governance rules during scoping.",
  },
  {
    id: "service-review",
    topic: "support",
    question: "What happens after go-live?",
    answer: "Ongoing service can include user support, issue management, configuration, data-quality checks, integration monitoring, adoption review and expansion planning. The exact service levels, owners and review cadence should be documented in the support arrangement.",
  },
];

/** How many answers a topic carries. Counted, never typed. */
export const countOf = (id: string) => FAQS.filter((f) => f.topic === id).length;

/** The topic a question belongs to, for the chip on each row. */
export const topicOf = (id: string) => TOPICS.find((t) => t.id === id);

/**
 * The six the "Most asked" section leads with — the source's own set.
 *
 * They are ids rather than copies, so an answer edited in `FAQS` is edited
 * here too. `FaqPopular` throws if one goes missing rather than rendering a
 * gap, which is what a silent `filter(Boolean)` would do.
 */
export const POPULAR_IDS = [
  "what-is-rams",
  "what-is-digital-twin",
  "what-is-irds",
  "severity-colours",
  "existing-systems",
  "implementation-start",
];

export const popular = (): Faq[] =>
  POPULAR_IDS.map((id) => {
    const f = FAQS.find((x) => x.id === id);
    if (!f) throw new Error(`POPULAR_IDS names a missing answer: ${id}`);
    return f;
  });

/* ── the product map ──────────────────────────────────────────────── */

/**
 * Which application to ask about, when the problem is clear and the product
 * name is not.
 *
 * Each one points at its own topic filter rather than at a product page: a
 * reader on this page wants the answer, not the brochure. `topic` must name a
 * real entry in `TOPICS`.
 */
export const PRODUCT_MAP: {
  code: string;
  kind: string;
  title: string;
  body: string;
  topic: string;
}[] = [
  {
    code: "Digital Twin",
    kind: "Context",
    title: "Digitise the facility",
    body: "Geometry, tagged assets, lifecycle history, simulation and connected operational data.",
    topic: "digital-twin",
  },
  {
    code: "IRDS",
    kind: "Safety",
    title: "Manage rack safety",
    body: "Inspections, risk classification, corrective actions, verification and rack history.",
    topic: "rack-safety",
  },
  {
    code: "MEPS",
    kind: "Productivity",
    title: "Understand MHE work",
    body: "Movement, utilisation, idle time and productivity in physical context.",
    topic: "mhe",
  },
  {
    code: "RTSS",
    kind: "Safety",
    title: "See safety events",
    body: "MHE safety events, impacts, operating zones and contextual response.",
    topic: "mhe",
  },
  {
    code: "IROS",
    kind: "Inventory",
    title: "Improve inventory visibility",
    body: "Location, movement, dwell, exceptions and storage intelligence.",
    topic: "inventory-operations",
  },
  {
    code: "IMDS",
    kind: "Maintenance",
    title: "Understand MHE health",
    body: "Diagnostics, equipment condition, faults, maintenance and lifecycle.",
    topic: "mhe",
  },
  {
    code: "ATOS",
    kind: "Execution",
    title: "Orchestrate work",
    body: "Task assignment, priority, route decisions, status and execution workflows.",
    topic: "inventory-operations",
  },
  {
    code: "AIMS",
    kind: "Management",
    title: "Connect management insight",
    body: "Cross-module analytics and direct multi-site operational visibility.",
    topic: "inventory-operations",
  },
];

/* ── how an answer becomes a project ──────────────────────────────── */

export const STAGES: { code: string; title: string; body: string }[] = [
  {
    code: "01 · Discover",
    title: "Define the problem",
    body: "Facility, assets, users, workflow, risk and intended outcome.",
  },
  {
    code: "02 · Scope",
    title: "Choose the modules",
    body: "Select the Digital Twin, applications, hardware and services required.",
  },
  {
    code: "03 · Connect",
    title: "Prepare the environment",
    body: "Map sites, data, devices, systems, access and responsibilities.",
  },
  {
    code: "04 · Operate",
    title: "Adopt and improve",
    body: "Train users, run workflows, review outcomes and expand over time.",
  },
];
