import { EMAIL } from "@/components/sections/contact/contact-data";

/**
 * Certifications and security, from
 * `RAMS_Digital_Certifications_and_Security.html`.
 *
 * ── The source's own rule is "no badge inflation" ───────────────────
 * It is the most careful document in this set and every hedge in it is
 * carried through unchanged. RAMS Digital publicly states **SOC 2 Type I**.
 * The source then says, in its own words, what that is not:
 *
 *   "Alignment is not accreditation."
 *   "No platform guarantees compliance on its own."
 *
 * A third line — "This page does not imply SOC 2 Type II, ISO 27001
 * certification or automatic regulatory compliance" — sat framed under the
 * SOC 2 statement and was removed on request.
 *
 * A security page is where an overstated claim does the most damage: it is
 * read by a procurement team deciding whether to skip a diligence step. So
 * the non-claim sits directly under the certification statement rather than
 * in a footnote, every register row states what kind of thing it is —
 * published, configurable or contractual — and no row says "certified" that
 * the source did not.
 *
 * Nothing here was upgraded. Where the source says "publicly stated", so does
 * this; where it says "confirm during diligence", so does this.
 *
 * ── The trust pack is a request, not a download ─────────────────────
 * Its own note: "The exact materials available may depend on
 * confidentiality, deployment scope and approval." So the pack works the way
 * the downloads library does — select the evidence, and one pre-filled email
 * carries the list. Nothing on this page links to a file, because a security
 * questionnaire response is not a public asset.
 */

/** A mailto with a pre-filled subject, the way the source does every action. */
export const ask = (subject: string, body?: string) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}` +
  (body ? `&body=${encodeURIComponent(body)}` : "");

/* ── the certification claim, and what it is not ──────────────────── */

export const SOC2 = {
  badge: "SOC 2",
  kind: "Type I · Publicly stated",
  title: "A control claim buyers can examine.",
  body: "RAMS Digital publicly states SOC 2 Type I certification. Type I evaluates whether relevant controls are suitably designed at a specific point in time; it is different from a Type II report, which examines operating effectiveness over a period.",
  checks: [
    [
      "Ask for the current report period",
      "Assurance is time-bound and should be reviewed for recency.",
    ],
    [
      "Confirm the system boundary",
      "Identify the products, infrastructure and processes included.",
    ],
    [
      "Review exceptions and complementary controls",
      "Understand what RAMS controls and what remains with the customer.",
    ],
  ] as [string, string][],
};

/* ── four questions trust actually turns on ───────────────────────── */

export const QUESTIONS: {
  code: string;
  question: string;
  body: string;
  tag: string;
}[] = [
  {
    code: "01 · Assurance",
    question: "What has been independently examined?",
    body: "SOC 2 Type I provides an external view of control design at a defined point in time.",
    tag: "Independent evidence",
  },
  {
    code: "02 · Operations",
    question: "Which standards shape the work?",
    body: "Standards such as EN 15635 inform rack inspection, classification, rectification and verification workflows.",
    tag: "Standards alignment",
  },
  {
    code: "03 · Platform",
    question: "How is access and data governed?",
    body: "Identity, permissions, integrations, auditability and data handling are reviewed against the intended deployment.",
    tag: "Security posture",
  },
  {
    code: "04 · Contract",
    question: "What is committed for your service?",
    body: "Availability, support, hosting, residency, retention and recovery targets must be confirmed for the agreed scope.",
    tag: "Customer-specific",
  },
];

/* ── the security architecture ────────────────────────────────────── */

export const DOMAINS: {
  code: string;
  title: string;
  body: string;
  points: string[];
}[] = [
  {
    code: "ID",
    title: "Identity & access",
    body: "Govern who can access each organisation, site, module and function.",
    points: [
      "Role and site-level access",
      "Privileged-action governance",
      "User lifecycle and periodic review",
    ],
  },
  {
    code: "APP",
    title: "Application security",
    body: "Define secure configuration, change control and vulnerability handling.",
    points: [
      "Release and change governance",
      "Security testing evidence on request",
      "Controlled administrative functions",
    ],
  },
  {
    code: "DATA",
    title: "Data protection",
    body: "Map operational and personal data before agreeing controls.",
    points: [
      "Data flows and ownership",
      "Retention, export and deletion",
      "Encryption requirements verification",
    ],
  },
  {
    code: "API",
    title: "Integrations",
    body: "Limit machine-to-machine access to what each workflow needs.",
    points: [
      "Interface and credential inventory",
      "Least-privilege access",
      "Error, event and change monitoring",
    ],
  },
  {
    code: "LOG",
    title: "Monitoring & response",
    body: "Connect suspicious activity to a defined triage and escalation process.",
    points: [
      "Event visibility",
      "Incident ownership and escalation",
      "Customer notification terms",
    ],
  },
  {
    code: "BC",
    title: "Continuity",
    body: "Agree service resilience targets appropriate to the deployment.",
    points: [
      "Back-up and recovery scope",
      "RTO/RPO confirmation",
      "Availability and support terms",
    ],
  },
];

/* ── the control register ─────────────────────────────────────────── */

/**
 * What kind of thing each row is.
 *
 * The distinction is the source's and it is the reason the register exists:
 * "Separate what is published, configurable and contractual. That distinction
 * keeps security statements accurate."
 *
 * Only `stated` is a claim RAMS has made publicly. Everything else is
 * something a customer configures or agrees — so the register never lets a
 * configurable control read as a certification.
 */
export type Status =
  "stated" | "configurable" | "workflow" | "scope" | "contract" | "verify";

export const STATUS_LABEL: Record<Status, string> = {
  stated: "Publicly stated",
  configurable: "Configurable",
  workflow: "Workflow-based",
  scope: "Scope-specific",
  contract: "Contract-specific",
  verify: "Verify design",
};

export const REGISTER: { area: string; status: Status; evaluate: string }[] = [
  {
    area: "SOC 2 Type I",
    status: "stated",
    evaluate: "Request current report details, scope and exceptions.",
  },
  {
    area: "Roles, sites & modules",
    status: "configurable",
    evaluate: "Validate the permission matrix during implementation.",
  },
  {
    area: "Operational audit history",
    status: "workflow",
    evaluate:
      "Confirm which user, asset, event and change histories are retained.",
  },
  {
    area: "Hosting & data residency",
    status: "scope",
    evaluate:
      "Agree regions, subprocessors and international transfer requirements.",
  },
  {
    area: "Availability, support & recovery",
    status: "contract",
    evaluate: "Confirm SLA, support hours, back-up policy, RTO and RPO.",
  },
  {
    area: "Authentication controls",
    status: "verify",
    evaluate:
      "Confirm MFA, federation, session and password requirements for your environment.",
  },
];

/* ── the assurance pack ───────────────────────────────────────────── */

export type Evidence = {
  id: string;
  title: string;
  body: string;
  /** When it is released — the source's own gate on each item. */
  gate: string;
};

export const EVIDENCE: Evidence[] = [
  {
    id: "soc2",
    title: "SOC 2 Type I evidence and scope",
    body: "The report details, period, system boundary, exceptions and complementary customer controls.",
    gate: "On request",
  },
  {
    id: "questionnaire",
    title: "Security questionnaire response",
    body: "Answers to your own diligence questionnaire, against the deployment being proposed.",
    gate: "Diligence",
  },
  {
    id: "architecture",
    title: "Architecture and data-flow overview",
    body: "What the platform receives, why, where it moves and who can reach it.",
    gate: "Scope-based",
  },
  {
    id: "dpa",
    title: "Data processing and subprocessor details",
    body: "Processing terms, subprocessors, residency and international transfer requirements.",
    gate: "Contract",
  },
  {
    id: "permissions",
    title: "Roles and permission matrix",
    body: "The organisation, site, module and function-level access model as configured for you.",
    gate: "Implementation",
  },
  {
    id: "incident",
    title: "Incident and escalation process",
    body: "Triage, severity, ownership, notification terms, investigation and post-incident review.",
    gate: "Service terms",
  },
];

/**
 * The request, as a `mailto:` with the selection listed in the body.
 *
 * The site has no form backend, and a security questionnaire response is not
 * a public asset anyway — the source is explicit that availability "may
 * depend on confidentiality, deployment scope and approval". So the pack asks
 * rather than serves, exactly as the downloads library does.
 */
export const packHref = (titles: string[]) => {
  const list = titles.map((t) => `- ${t}`).join("\n");
  const body = `Hello RAMS Digital,\n\nWe are carrying out a security review and would like the following:\n\n${list}\n\nOrganisation:\nName and role:\nDeployment being assessed:\nSites and regions:\nTarget dates:\n\nThank you.`;
  return (
    `mailto:${EMAIL}` +
    `?subject=${encodeURIComponent(`RAMS Digital trust pack — ${titles.length} item${titles.length === 1 ? "" : "s"}`)}` +
    `&body=${encodeURIComponent(body)}`
  );
};

/* ── FAQ ──────────────────────────────────────────────────────────── */

export const FAQS: [string, string][] = [
  [
    "Is RAMS Digital SOC 2 certified?",
    "RAMS Digital publicly states SOC 2 Type I certification. Buyers should request the current report details and confirm its period, scope, exceptions and complementary customer controls.",
  ],
  [
    "Is SOC 2 Type I the same as Type II?",
    "No. Type I addresses the design of controls at a point in time. Type II evaluates whether controls operated effectively over a specified period.",
  ],
  [
    "Is RAMS Digital ISO 27001 certified?",
    "This page does not make that claim. Ask RAMS directly for the current certification register and scope before relying on any certification in procurement or compliance decisions.",
  ],
  [
    "What does EN 15635 mean on this page?",
    "It refers to rack-use and maintenance practices that can shape inspection and corrective-action workflows. It is not a cyber-security certification and does not automatically certify a customer site.",
  ],
  [
    "Where is customer data hosted?",
    "Hosting region, residency, subprocessors and transfer requirements should be confirmed for the proposed deployment and documented in the applicable agreement.",
  ],
  [
    "Can RAMS integrate with existing enterprise systems securely?",
    "RAMS describes integration with WMS, ERP and other systems. Security depends on the specific interface, authentication, permission scope, data exchanged and monitoring agreed for that connection.",
  ],
  [
    "Does using RAMS make our operation compliant?",
    "No platform guarantees compliance on its own. RAMS can structure processes and evidence, while the customer remains responsible for applicable laws, competent people, operating controls and site-specific obligations.",
  ],
];

/* ── the sections the page did not carry, from the source ────────── */

/** EN 15635 as a workflow: step and what it does. */
export const WORKFLOW: [string, string][] = [
  ["Inspect", "Capture evidence"],
  ["Classify", "Apply risk logic"],
  ["Assign", "Create action"],
  ["Rectify", "Record repair"],
  ["Verify", "Close with evidence"],
];

/** Who carries what — the source's "alignment is not accreditation". */
export const ROLES: [string, string][] = [
  ["Standard", "Defines recognised practice"],
  ["Competence", "Applies to people and roles"],
  ["Platform", "Structures records and workflow"],
  ["Customer", "Owns site compliance duties"],
];

export const DATAFLOW: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Discover",
    body: "Inventory operational, device, user and personal data.",
  },
  {
    n: "02",
    title: "Classify",
    body: "Separate sensitive and business-critical information.",
  },
  {
    n: "03",
    title: "Control",
    body: "Set access, retention, sharing and export rules.",
  },
  {
    n: "04",
    title: "Verify",
    body: "Review the implemented configuration and evidence.",
  },
];

/**
 * The source's own example feed. It is illustrative — the section says
 * so on the page — and is not a record of any customer's activity.
 */
export const FEED: {
  code: string;
  title: string;
  meta: string;
  when: string;
}[] = [
  {
    code: "AS",
    title: "Access scope updated",
    meta: "Regional safety lead · Sites 03–05",
    when: "09:42",
  },
  {
    code: "IR",
    title: "Inspection evidence verified",
    meta: "Rack B-14 · Action AC-2208",
    when: "08:17",
  },
  {
    code: "API",
    title: "Integration credential rotated",
    meta: "WMS production connector",
    when: "Yesterday",
  },
  {
    code: "GV",
    title: "Quarterly permission review closed",
    meta: "2 access changes approved",
    when: "04 Sep",
  },
];

export const INTERFACE_SOURCES = [
  "WMS / ERP / MES",
  "CMMS / TMS / HRMS",
  "Sensors / cameras / edge",
  "Customer APIs",
];

export const INTERFACE_PRINCIPLES: [string, string][] = [
  ["Purpose-bound access", "Only the data required for the use case"],
  ["Credential control", "Issue, store, rotate and revoke"],
  ["Change visibility", "Know when an interface changes"],
  ["Failure handling", "Detect, retry, alert and investigate"],
];

export const SHARED: [string, string][] = [
  [
    "Customer decisions",
    "Purpose, lawful basis, workforce notices, internal access and acceptable use.",
  ],
  [
    "Platform commitments",
    "Agreed processing, security measures, subprocessors and support for data requests.",
  ],
  [
    "Joint verification",
    "Data-flow review, contractual roles, retention schedule and go-live approval.",
  ],
];

export const RECOVERY: [string, string][] = [
  [
    "Availability",
    "Agree service hours, exclusions, dependencies and measurement method in the applicable service terms.",
  ],
  [
    "Recovery",
    "Confirm back-up coverage, recovery point and recovery time objectives for the chosen scope.",
  ],
  [
    "Incident response",
    "Document triage, severity, escalation, notification, investigation and post-incident review.",
  ],
];

export const PATH: [string, string][] = [
  ["Discover", "Define use case, data, users and risk."],
  ["Map", "Document systems, flows and responsibilities."],
  ["Configure", "Set roles, sites, workflows and retention."],
  ["Validate", "Test controls, integration and recovery expectations."],
  ["Review", "Approve go-live and schedule assurance reviews."],
];
