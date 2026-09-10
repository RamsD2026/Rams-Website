/**
 * The compliance glossary, from `RAMS_Digital_Compliance_Glossary.html`.
 *
 * ── This is a reference, not a compliance determination ─────────────
 * The source says so in its own banner and this carries it through: the
 * warning sits above the first heading, every term states its own
 * applicability boundary in `scope`, and the FAQ opens on the question a
 * safety manager would actually ask — whether following the glossary makes a
 * warehouse compliant. It does not.
 *
 * That matters more here than on any other page on this site. A glossary of
 * safety terminology is read by somebody deciding whether a damaged upright
 * can stay in service, and every entry that could be mistaken for a rule
 * carries the sentence that says it is not one. Where the source hedges, so
 * does this; nothing was tightened into a claim it did not make.
 *
 * ── The twenty-eight terms are the source's, unedited ───────────────
 * Extracted from the document's own `terms` array rather than retyped, so no
 * definition drifted in transcription. Each keeps all five of its fields: the
 * definition, why it matters on site, how it is used, the applicability
 * boundary, and what RAMS does with it.
 *
 * ── The official links are real, and were checked ───────────────────
 * SEMA, FEM and the three OSHA regulations. Every URL was requested and
 * returned 200 before it was written down — a compliance reference pointing
 * at a dead regulation is worse than one with no links at all. OSHA refuses a
 * default user agent and answers a browser one; the pages are live.
 *
 * These are the only outbound links on this site to a body that writes rules,
 * so they open in a new tab and carry `rel="noreferrer"`.
 */

export type Source = "sema" | "fem" | "osha" | "general";

export type Term = {
  term: string;
  source: Source;
  definition: string;
  /** Why it matters on site. */
  why: string;
  /** How it is used operationally. */
  use: string;
  /** The applicability boundary — the sentence that keeps this a reference. */
  scope: string;
  /** What RAMS does with it. */
  rams: string;
  /** The official source, where the document names one. */
  url?: string;
};

/** The source labels, in the order the filter shows them. */
export const SOURCES: { id: Source; label: string; note: string }[] = [
  { id: "sema", label: "SEMA", note: "UK industry guidance" },
  { id: "fem", label: "FEM", note: "European technical guidance" },
  { id: "osha", label: "OSHA", note: "US federal regulation" },
  { id: "general", label: "General practice", note: "Industry terminology" },
];

/**
 * Twenty-eight terms, alphabetical as the source lists them.
 *
 * The counts under each source filter are derived from this array rather than
 * written beside it — the source's own header says "28 TERMS" in one place
 * and lists SEMA 10 / FEM 05 / OSHA 08 / General 05 in another, which sums to
 * 28 only if nobody edits the list afterwards.
 */
export const TERMS: Term[] = [
  {
    term: "Aisle clearance",
    source: "osha",
    definition: "Space kept available for safe movement of people, equipment and materials.",
    why: "Obstruction and inadequate clearance can create collision, access and emergency-response risk.",
    use: "Define required clearances, inspect obstructions and record recurring hotspots.",
    scope: "OSHA 1910.176 addresses safe clearances and clear aisles; verify local requirements.",
    rams: "Map aisles and obstruction events to the Digital Twin.",
    url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.176",
  },
  {
    term: "Annual expert inspection",
    source: "sema",
    definition: "A formal racking inspection undertaken by a technically competent person at the interval described by the applicable UK guidance.",
    why: "It provides an independent, structured assessment beyond routine site checks.",
    use: "Plan scope, asset register, access, previous findings and closure evidence.",
    scope: "SEMA/HSE UK context; the exact frequency and competence requirement must be verified.",
    rams: "IRDS can retain the inspection, findings, actions and verification history.",
    url: "https://sema.org.uk/storage-equipment-inspections/guide-to-pallet-racking-inspections/",
  },
  {
    term: "Automated Guided Vehicle (AGV)",
    source: "fem",
    definition: "A driverless vehicle used to move materials through a controlled intralogistics environment.",
    why: "Routes, interfaces, stopping behaviour and interaction with people and storage equipment require coordinated design.",
    use: "Assess routes, clearances, traffic controls, charging and system interfaces.",
    scope: "FEM intralogistics context; use the relevant technical publication and equipment standard.",
    rams: "Map AGV routes, zones and supported events to the facility context.",
    url: "https://fem-eur.com/intralogistic-systems/",
  },
  {
    term: "Beam level",
    source: "general",
    definition: "The vertical storage position formed by a pair of rack beams within a bay.",
    why: "Each level has geometry, loading and component condition that can differ from the rest of the bay.",
    use: "Record findings against the exact rack, bay and level rather than the row alone.",
    scope: "General storage-equipment term; follow the rack design and load information.",
    rams: "Use level-level asset identity for inspection and corrective action.",
  },
  {
    term: "Cantilever racking",
    source: "fem",
    definition: "A storage structure using projecting arms, commonly for long or irregular loads.",
    why: "Its load path, stability and operating hazards differ from beam pallet racking.",
    use: "Confirm configuration, load data, arm condition, bracing, base and handling method.",
    scope: "FEM lists technical guidance for cantilever racking; obtain the authoritative publication.",
    rams: "Model columns, arms, bracing, loads and findings as linked assets.",
    url: "https://fem-eur.com/technical-guidance/",
  },
  {
    term: "Competent person",
    source: "general",
    definition: "A person whose knowledge, training, experience and authority are suitable for the specific task and rule being applied.",
    why: "Competence is task- and jurisdiction-specific; a job title alone is not proof.",
    use: "Define the decision, required qualification, independence and authority before appointment.",
    scope: "The precise definition varies by legal or technical context.",
    rams: "Record inspector identity, scope, credential evidence and approval role.",
  },
  {
    term: "Damage classification",
    source: "sema",
    definition: "A structured method for categorising rack damage and linking it to required action and timescale.",
    why: "Consistent classification helps prevent subjective or delayed response.",
    use: "Use measured evidence, applicable limits and trained judgment; preserve the basis of classification.",
    scope: "Use the complete current SEMA method or other contractually applicable method—not a colour alone.",
    rams: "IRDS can link severity, evidence, control, action owner and closure.",
    url: "https://sema.org.uk/storage-equipment-inspections/guide-to-pallet-racking-inspections/",
  },
  {
    term: "Design load",
    source: "general",
    definition: "The load basis used to design or verify a structure, component or system.",
    why: "Operational loading that differs from the approved design can invalidate assumptions and increase risk.",
    use: "Use current drawings, load notices, rack configuration and manufacturer information.",
    scope: "Engineering term; values and combinations depend on the applicable design basis.",
    rams: "Attach approved load data to the relevant rack configuration.",
  },
  {
    term: "Expert inspection",
    source: "sema",
    definition: "A formal inspection by a technically competent rack inspector, separate from routine visual checks.",
    why: "It can identify compatibility, configuration, damage and other issues needing formal action.",
    use: "Define scope, access, reporting method, asset identity and required follow-through.",
    scope: "SEMA/HSE UK context; use locally applicable inspection requirements elsewhere.",
    rams: "Create a digital inspection cycle with traceable findings and reinspection.",
    url: "https://sema.org.uk/storage-equipment-inspections/guide-to-pallet-racking-inspections/",
  },
  {
    term: "FEM Code",
    source: "fem",
    definition: "A technical publication issued through FEM product groups for defined materials-handling equipment topics.",
    why: "The document identifier, edition and scope determine whether it is relevant.",
    use: "Use the official catalogue, obtain the full publication and record the exact reference used.",
    scope: "Industry technical guidance; legal or contractual status depends on adoption and project context.",
    rams: "Store the applicable document reference against the project or asset.",
    url: "https://fem-eur.com/technical-guidance/",
  },
  {
    term: "General Duty Clause",
    source: "osha",
    definition: "Section 5(a)(1) of the U.S. Occupational Safety and Health Act, addressing recognised serious hazards where applicable.",
    why: "Not every hazard is covered only by a specific numbered standard.",
    use: "Seek U.S. legal and safety advice before relying on the clause for a compliance conclusion.",
    scope: "U.S. federal legal context; exact application is fact-specific.",
    rams: "Track recognised hazards, controls and closure evidence.",
    url: "https://www.osha.gov/laws-regs/oshact/section5-duties",
  },
  {
    term: "Immediate reporting",
    source: "sema",
    definition: "The prompt reporting of rack damage or unsafe conditions when observed during normal work.",
    why: "Waiting for a scheduled inspection can leave a hazardous condition in service.",
    use: "Give operators a clear reporting route, location convention and escalation rule.",
    scope: "Part of the layered SEMA inspection approach; align with site procedures.",
    rams: "Capture impact or observation events against the exact asset.",
    url: "https://sema.org.uk/storage-equipment-inspections/guide-to-pallet-racking-inspections/",
  },
  {
    term: "Intralogistics",
    source: "fem",
    definition: "The internal movement, storage and control of materials and information within a facility.",
    why: "Safety and performance depend on how equipment, people, software and space interact.",
    use: "Assess interfaces across vehicles, conveyors, storage, automation and process systems.",
    scope: "Broad industry term; specific obligations come from applicable equipment and workplace rules.",
    rams: "Use the Digital Twin as shared physical context for movement and events.",
    url: "https://fem-eur.com/intralogistic-systems/",
  },
  {
    term: "Load notice",
    source: "sema",
    definition: "A rack safety sign communicating the configuration and loading information needed for use as intended.",
    why: "Missing, incorrect or outdated information can lead to misuse or overloading.",
    use: "Verify that the notice matches the installed configuration and remains legible and current.",
    scope: "SEMA/UK guidance; signage duties and format depend on applicable requirements.",
    rams: "Link a digital copy and approved load data to each rack run.",
    url: "https://sema.org.uk/sema-support/sema-technical-support/technical-faq/",
  },
  {
    term: "Material storage",
    source: "osha",
    definition: "The placement and retention of materials in a manner that does not create a workplace hazard.",
    why: "Unstable tiers, excessive height or insecure stacking can expose people and assets.",
    use: "Check stacking, blocking, interlocking, height limits, access and housekeeping.",
    scope: "OSHA 1910.176 applies in U.S. general industry; verify the exact rule and jurisdiction.",
    rams: "Record storage exceptions, location and corrective action.",
    url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.176",
  },
  {
    term: "Modification",
    source: "general",
    definition: "A change to a rack, machine, layout or component from its approved condition or configuration.",
    why: "Changes can alter load paths, clearances, stability and safety assumptions.",
    use: "Do not implement without the required design, manufacturer or competent approval.",
    scope: "Approval requirements depend on the equipment, standard, contract and law.",
    rams: "Simulate proposed changes and preserve an approved change history.",
  },
  {
    term: "Operator evaluation",
    source: "osha",
    definition: "The workplace performance evaluation included within OSHA’s powered industrial truck training requirements.",
    why: "Knowledge alone does not establish that an operator can use the truck safely in the workplace.",
    use: "Use the exact 1910.178 training and evaluation provisions and retain required records.",
    scope: "U.S. OSHA requirement; consult the current standard for timing and triggers.",
    rams: "Where approved, link operator qualification context to MHE sessions.",
    url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.178",
  },
  {
    term: "Person Responsible for Racking Safety (PRRS)",
    source: "sema",
    definition: "The site role used in UK guidance to coordinate rack safety, regular visual inspection and related records.",
    why: "A named owner helps convert observed damage into timely controls and action.",
    use: "Define training, authority, coverage, records and escalation arrangements.",
    scope: "SEMA/HSG76 terminology in the UK context; equivalent roles may use different titles elsewhere.",
    rams: "Assign inspection cycles, findings and actions to a responsible site owner.",
    url: "https://sema.org.uk/sema-services/storage-equipment-guidance/",
  },
  {
    term: "Powered Industrial Truck (PIT)",
    source: "osha",
    definition: "The equipment category addressed by OSHA 29 CFR 1910.178, including various fork-truck types used for material handling.",
    why: "Truck design, maintenance, operation and operator training are addressed by a specific standard.",
    use: "Determine equipment classification, workplace conditions and applicable 1910.178 provisions.",
    scope: "U.S. OSHA definition and scope; check exclusions and exact regulatory wording.",
    rams: "Create a digital identity for each MHE and connect inspection, event and maintenance history.",
    url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.178",
  },
  {
    term: "Rack bay",
    source: "general",
    definition: "The storage space between adjacent upright frames, normally supporting one or more beam levels.",
    why: "Bay-level identification makes findings and load information actionable.",
    use: "Use stable row, bay and level naming across inspections, drawings and work orders.",
    scope: "General storage-equipment term; geometry varies by system.",
    rams: "Use the bay as a persistent Digital Twin asset.",
  },
  {
    term: "Regular visual inspection",
    source: "sema",
    definition: "A documented site inspection performed by a suitably trained person at intervals based on operating risk.",
    why: "It identifies visible damage, missing components, load-notice issues and misuse between expert inspections.",
    use: "Set interval by risk, use a consistent checklist and escalate findings immediately.",
    scope: "SEMA/UK guidance; do not assume one frequency fits every facility.",
    rams: "Schedule mobile inspections and retain time-stamped evidence.",
    url: "https://sema.org.uk/sema-support/sema-technical-support/technical-faq/",
  },
  {
    term: "SARI",
    source: "sema",
    definition: "SEMA Approved Racking Inspector—SEMA’s assessed qualification pathway for expert rack inspectors.",
    why: "It provides a recognised competence route within the SEMA inspection system.",
    use: "Verify current status, scope and suitability for the inspection being commissioned.",
    scope: "SEMA scheme; it does not automatically replace local legal, engineering or certification requirements.",
    rams: "Record inspector identity and credentials with the inspection cycle.",
    url: "https://sema.org.uk/storage-equipment-inspections/guide-to-pallet-racking-inspections/",
  },
  {
    term: "SEIRS",
    source: "sema",
    definition: "Storage Equipment Installers Registration Scheme, a SEMA programme for storage-equipment installation training and registration.",
    why: "Installation competence affects structural integrity, configuration and safe handover.",
    use: "Confirm installer competence, supervision, drawings and installation records.",
    scope: "SEMA scheme in the UK industry context.",
    rams: "Preserve installer, configuration and commissioning records for each asset.",
    url: "https://sema.org.uk/storage-equipment-installations/what-is-seirs/",
  },
  {
    term: "Stable stacking",
    source: "osha",
    definition: "The principle that stored materials in tiers must be arranged so they remain secure against sliding or collapse.",
    why: "Unstable storage can create struck-by and collapse hazards.",
    use: "Assess load shape, support, height, interlocking, blocking and handling method.",
    scope: "OSHA 1910.176(b) in U.S. general industry; read the full provision.",
    rams: "Record unstable-stack exceptions with location and evidence.",
    url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.176",
  },
  {
    term: "Storage and Retrieval Machine (SRM)",
    source: "fem",
    definition: "Rail-dependent equipment used to place and retrieve loads in automated storage systems.",
    why: "Equipment, rack, rail, floor and control interfaces must operate within compatible tolerances.",
    use: "Identify the relevant FEM/EN publication for the system and interface being designed or assessed.",
    scope: "FEM technical-guidance context; obtain the full applicable publication.",
    rams: "Model machine path, interfaces, zones and asset relationships.",
    url: "https://fem-eur.com/technical-guidance/",
  },
  {
    term: "Subpart N",
    source: "osha",
    definition: "The materials-handling and storage subpart within OSHA’s 29 CFR Part 1910 general-industry standards.",
    why: "It is a navigation point for several equipment and material-handling provisions.",
    use: "Start at the table of contents, then read the exact section and related interpretations.",
    scope: "U.S. federal general-industry context.",
    rams: "Reference the exact section used for an operational control.",
    url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910SubpartN",
  },
  {
    term: "Traffic-light classification",
    source: "sema",
    definition: "A visual risk-category approach used in SEMA rack inspection reporting to communicate action urgency.",
    why: "Colours aid communication, but the measurement criteria and required actions are the controlling information.",
    use: "Use the complete approved methodology; record condition, evidence, control and action—not colour alone.",
    scope: "SEMA method; other standards may use different definitions or thresholds.",
    rams: "Display severity while retaining the technical basis and action history.",
    url: "https://sema.org.uk/storage-equipment-inspections/",
  },
  {
    term: "Unsafe truck condition",
    source: "osha",
    definition: "A powered industrial truck condition that requires removal from service under the applicable OSHA provisions.",
    why: "Continued use can expose operators, pedestrians, loads and infrastructure.",
    use: "Inspect equipment, isolate unsafe trucks and follow authorised maintenance procedures.",
    scope: "U.S. OSHA 1910.178; consult the exact maintenance and operation clauses.",
    rams: "Connect defect, out-of-service state, work order and return-to-service evidence.",
    url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.178",
  },
];

/** How many terms each source carries. Counted, never typed. */
export const countOf = (id: Source) =>
  TERMS.filter((t) => t.source === id).length;

/** The letters that actually have a term behind them. */
export const LETTERS: string[] = Array.from(
  new Set(TERMS.map((t) => t.term[0].toUpperCase())),
).sort();
