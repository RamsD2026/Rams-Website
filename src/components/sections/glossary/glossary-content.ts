/**
 * Everything on the compliance page that is not a glossary term.
 *
 * Same document, same care: every framework states what it *is* and where it
 * applies, every role states its own boundary, and the OSHA section says it
 * is a navigation point rather than a substitute for the rule. Those boundary
 * lines are the reason this page can exist at all, so none of them was
 * shortened to fit a card.
 */

export type NavGroup = { title: string; items: { id: string; label: string }[] };

/** The left rail, and the right rail's source. Flattened into `TOC` below. */
export const NAV: NavGroup[] = [
  {
    title: "Start here",
    items: [
      { id: "overview", label: "How to use this" },
      { id: "frameworks", label: "Framework map" },
    ],
  },
  {
    title: "Reference",
    items: [
      { id: "glossary", label: "Glossary" },
      { id: "inspection", label: "Inspection system" },
      { id: "osha", label: "OSHA quick reference" },
    ],
  },
  {
    title: "Applying it",
    items: [
      { id: "loop", label: "Guide to action" },
      { id: "roles", label: "Responsibilities" },
      { id: "bridge", label: "RAMS context" },
      { id: "principles", label: "Use responsibly" },
      { id: "faq", label: "FAQ" },
    ],
  },
];

export const TOC = NAV.flatMap((g) => g.items);

/* ── the three frameworks ─────────────────────────────────────────── */

export const FRAMEWORKS: {
  n: string;
  code: string;
  kind: string;
  name: string;
  body: string;
  facts: [string, string][];
  cta: string;
  url: string;
}[] = [
  {
    n: "01",
    code: "SEMA",
    kind: "UK industry guidance",
    name: "Storage Equipment Manufacturers' Association",
    body: "Industry guidance, training and inspection practices for storage equipment, including the PRRS and SARI pathways.",
    facts: [
      ["Region", "United Kingdom context"],
      ["Focus", "Racking, shelving, installation and inspection"],
      ["Use", "Good-practice reference; verify legal and contractual status"],
    ],
    cta: "Open official SEMA guidance",
    url: "https://sema.org.uk/storage-equipment-inspections/guide-to-pallet-racking-inspections/",
  },
  {
    n: "02",
    code: "FEM",
    kind: "European technical guidance",
    name: "European Materials Handling Federation",
    body: "Technical publications and industry guidance covering materials handling, industrial trucks, intralogistics, racking and shelving.",
    facts: [
      ["Region", "European industry context"],
      ["Focus", "Equipment design, interfaces and technical practice"],
      ["Use", "Identify the relevant publication; obtain the authoritative document"],
    ],
    cta: "Open official FEM catalogue",
    url: "https://fem-eur.com/technical-guidance/",
  },
  {
    n: "03",
    code: "OSHA",
    kind: "US federal regulation",
    name: "Occupational Safety and Health Administration",
    body: "Federal workplace safety requirements, including material storage and powered industrial truck provisions in 29 CFR Part 1910.",
    facts: [
      ["Region", "United States federal jurisdiction"],
      ["Focus", "Workplace safety duties and enforceable requirements"],
      ["Use", "Consult the exact regulatory text and current interpretations"],
    ],
    cta: "Open OSHA Subpart N",
    url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910SubpartN",
  },
];

/* ── the SEMA inspection system ───────────────────────────────────── */

export const LEVELS: { n: string; title: string; body: string; cadence: string }[] =
  [
    {
      n: "01",
      title: "Immediate reporting",
      body: "Damage and unsafe conditions are reported when observed.",
      cadence: "Continuous",
    },
    {
      n: "02",
      title: "Regular visual inspection",
      body: "A trained site person performs documented checks at intervals based on risk.",
      cadence: "Site-led",
    },
    {
      n: "03",
      title: "Expert inspection",
      body: "A technically competent inspector conducts a formal examination.",
      cadence: "Periodic",
    },
  ];

export const SEMA_ROLES: { code: string; title: string; body: string }[] = [
  {
    code: "PR",
    title: "Person Responsible for Racking Safety",
    body: "The PRRS coordinates regular checks, records and site response in the SEMA/HSG76 context.",
  },
  {
    code: "SI",
    title: "SEMA Approved Racking Inspector",
    body: "SARI is SEMA's assessed inspector pathway for expert racking inspections.",
  },
  {
    code: "EV",
    title: "Evidence and closure",
    body: "Findings should retain location, asset, severity, action, owner and verification evidence.",
  },
];

/* ── guide to action ──────────────────────────────────────────────── */

export const LOOP: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Identify",
    body: "Confirm facility, rack, bay, level, MHE, zone or other asset.",
  },
  {
    n: "02",
    title: "Observe",
    body: "Capture the condition, event or deviation with time and evidence.",
  },
  {
    n: "03",
    title: "Assess",
    body: "Use the applicable rule, code, OEM limit and competent judgment.",
  },
  {
    n: "04",
    title: "Control",
    body: "Restrict use, isolate risk or apply another defined interim control.",
  },
  {
    n: "05",
    title: "Assign",
    body: "Name the action, responsible owner and required timescale.",
  },
  {
    n: "06",
    title: "Rectify",
    body: "Complete approved replacement, repair or operational correction.",
  },
  {
    n: "07",
    title: "Verify",
    body: "Check the completed work and retain objective evidence.",
  },
  {
    n: "08",
    title: "Learn",
    body: "Analyse recurrence, hotspots, causal patterns and control effectiveness.",
  },
];

/* ── responsibilities ─────────────────────────────────────────────── */

export const ROLES: {
  role: string;
  duty: string;
  evidence: string[];
  boundary: string;
}[] = [
  {
    role: "Operator / employee",
    duty: "Report damage, impact, unsafe storage or abnormal conditions promptly.",
    evidence: ["Event report", "Photo", "Location"],
    boundary:
      "Does not independently approve continued use where competent assessment is required.",
  },
  {
    role: "PRRS / site safety owner",
    duty: "Coordinate regular visual checks, records, escalation and local controls.",
    evidence: ["Inspection log", "Action register"],
    boundary:
      "Training and authority must match the role; SEMA terminology is UK-context specific.",
  },
  {
    role: "Expert rack inspector",
    duty: "Conduct the formal inspection and classify findings using the relevant method.",
    evidence: ["Inspection report", "Asset findings"],
    boundary:
      "Competence, independence and scope must be appropriate to the facility and reference used.",
  },
  {
    role: "Engineer / OEM",
    duty: "Provide design, load, modification, repair or replacement decisions where required.",
    evidence: ["Drawing", "Calculation", "Approval"],
    boundary:
      "Inspection observations do not replace engineering verification or manufacturer requirements.",
  },
  {
    role: "Management",
    duty: "Provide resources, enforce controls, review trends and verify closure governance.",
    evidence: ["KPI review", "Closure evidence"],
    boundary:
      "Delegation does not remove the organisation's applicable safety duties.",
  },
  {
    role: "Maintenance / contractor",
    duty: "Execute only authorised work using compatible parts and approved methods.",
    evidence: ["Work order", "Part record", "Completion photo"],
    boundary:
      "Unapproved alteration or improvised repair can change structural behaviour.",
  },
];

/* ── OSHA quick reference ─────────────────────────────────────────── */

export const OSHA_REFS: {
  code: string;
  title: string;
  body: string;
  points: string[];
  cta: string;
  url: string;
}[] = [
  {
    code: "29 CFR 1910 · Subpart N",
    title: "Materials Handling and Storage",
    body: "The regulatory grouping that includes general material-handling provisions and powered industrial trucks.",
    points: [
      "Use it to navigate related sections",
      "Check scope and current amendments",
      "Review related interpretations where needed",
    ],
    cta: "Open official OSHA page",
    url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910SubpartN",
  },
  {
    code: "29 CFR 1910.176",
    title: "Handling Materials — General",
    body: "Covers general requirements including safe clearances, secure storage and keeping aisles and passageways clear.",
    points: [
      "Material storage must not create a hazard",
      "Tiered materials must be stable and secure",
      "Permanent aisles and passageways are addressed",
    ],
    cta: "Read 1910.176",
    url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.176",
  },
  {
    code: "29 CFR 1910.178",
    title: "Powered Industrial Trucks",
    body: "Addresses fire protection, design, maintenance and use of powered industrial trucks, including operator training requirements.",
    points: [
      "Equipment and operating provisions",
      "Training and evaluation requirements",
      "Maintenance and truck condition",
    ],
    cta: "Read 1910.178",
    url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.178",
  },
];

/* ── the RAMS bridge ──────────────────────────────────────────────── */

export const BRIDGE: { title: string; body: string }[] = [
  {
    title: "Model",
    body: "Facility, rack, row, bay, level and operating zone.",
  },
  {
    title: "Record",
    body: "Condition, event, image, measurement and inspection date.",
  },
  {
    title: "Act",
    body: "Risk control, replacement, responsibility and due date.",
  },
  {
    title: "Verify",
    body: "Closure evidence, reinspection and preserved lifecycle history.",
  },
];

export const CONTEXT: [string, string][] = [
  ["Framework", "Which source and edition applies?"],
  ["Jurisdiction", "Which law or adopted standard controls?"],
  ["Asset", "What equipment, configuration and load information applies?"],
  ["Decision", "Who is authorised and competent to approve the action?"],
];

/* ── use responsibly ──────────────────────────────────────────────── */

export const PRINCIPLES: { code: string; title: string; body: string }[] = [
  {
    code: "01 · Scope",
    title: "Confirm applicability",
    body: "Check country, sector, equipment type, facility condition and contractual requirements.",
  },
  {
    code: "02 · Version",
    title: "Use the current source",
    body: "Verify the edition, amendment status and whether an official document must be purchased.",
  },
  {
    code: "03 · Authority",
    title: "Separate guide from law",
    body: "An industry guide may support good practice but is not automatically an enforceable legal requirement everywhere.",
  },
  {
    code: "04 · Competence",
    title: "Escalate the decision",
    body: "Use qualified inspection, engineering, legal or safety advice where the decision exceeds site authority.",
  },
];

/* ── FAQ ──────────────────────────────────────────────────────────── */

export const FAQS: [string, string][] = [
  [
    "Are SEMA, FEM and OSHA interchangeable?",
    "No. SEMA is a UK storage-equipment industry association, FEM is a European industry federation publishing technical guidance, and OSHA is a U.S. federal workplace safety regulator. The applicable law, standard, contract and equipment requirements must be established for each site.",
  ],
  [
    "Does following this glossary certify a warehouse as compliant?",
    "No. The glossary is educational. Compliance and certification require assessment against the complete applicable requirements, competent inspection or engineering where needed, and objective evidence from the actual facility.",
  ],
  [
    "How often should rack inspections be carried out?",
    "Frequency depends on the applicable framework and site risk. SEMA guidance describes continuous reporting, regular visual inspection and periodic expert inspection, with intervals informed by risk. Confirm the required frequency for the jurisdiction, operation and contractual standard.",
  ],
  [
    "Can damaged rack components be repaired?",
    "Do not assume an improvised repair is acceptable. Isolate or control the risk, obtain the equipment and damage details, and follow the applicable standard, manufacturer instructions and competent engineering decision. Use compatible replacement parts and approved methods.",
  ],
  [
    "Does OSHA apply to facilities outside the United States?",
    "OSHA's federal standards apply within their legal jurisdiction. Organisations elsewhere may use OSHA material as a reference, but it does not replace the local law and adopted standards that govern the facility.",
  ],
];
