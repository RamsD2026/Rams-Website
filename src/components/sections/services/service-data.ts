import type { Service } from "./service-types";

/**
 * The six services, from their source documents.
 *
 *   RAMS_Digital_Rack_Inspection_Services.html
 *   RAMS_Digital_Structural_Verification.html
 *   RAMS_Digital_Inventory_Reconciliation_Audit.html
 *   RAMS_Digital_MHE_Productivity_Assessment.html
 *   RAMS_Digital_Safety_Operational_Assessment.html
 *   deployment-support.html
 *
 * ── The hedges are the content ─────────────────────────────────────
 * Every one of these documents is careful in the same way: scope is agreed per
 * site, tests are not automatically included, certification follows closure
 * rather than a walkthrough, and RAMS reports while the customer approves. The
 * copy here keeps those qualifications word for word — "applicable", "agreed",
 * "where included", "not automatically" — because on a services page they are
 * the difference between describing a service and promising an outcome.
 *
 * The uppercase caveats each source sets under a block are carried as `note`
 * and rendered in mono caps, exactly where the source put them.
 *
 * There is no figure on any of these pages that the source did not state, and
 * no named customer anywhere.
 */

/* ── 01 rack inspection ───────────────────────────────────────────── */

const RACK_INSPECTION: Service = {
  slug: "rack-inspection",
  code: "RI",
  name: "Rack Inspection Services",
  eyebrow: "Rack Inspection Services",
  h1: ["Know the health", "of every rack."],
  intro:
    "Engineering-led rack safety assessments delivered on-site or through a controlled remote-evidence workflow — combining EN 15635-aligned inspection, RAG classification, Digital Twin mapping, actionable reporting and closure support.",
  chips: ["On-site or remote", "EN 15635-aligned", "Evidence-led closure"],
  action: "Book a rack inspection",
  meta: "Engineering-led rack safety assessments, on-site or through a controlled remote-evidence workflow: EN 15635-aligned inspection, RAG classification, Digital Twin mapping and closure support.",
  assurances: [
    {
      title: "EN 15635-aligned methodology",
      body: "Structured checks and risk classification.",
    },
    {
      title: "Digital Twin + QR identity",
      body: "Every finding tied to its physical location.",
    },
    {
      title: "Damage report + BOQ",
      body: "Clear replacement and closure planning.",
    },
    {
      title: "Evidence-led verification",
      body: "Certification follows satisfactory closure.",
    },
  ],
  sections: [
    {
      kind: "problem",
      eyebrow: "The risk",
      top: "Small damage can carry",
      bottom: "System-level risk.",
      body: "Rack damage is often hidden by loaded pallets, normalised by daily operations or reduced to an unstructured photo. Without exact location, measurement and action ownership, the risk remains open.",
      items: [
        {
          title: "Damage is reported without measurement",
          icon: "Ruler",
          body: "A photo alone may not establish deformation, alignment or severity.",
        },
        {
          title: "Findings cannot be traced to the exact asset",
          icon: "MapPin",
          body: "Generic row names and spreadsheets make repair teams search again.",
        },
        {
          title: "Inspection ends when the report is issued",
          icon: "FileX2",
          body: "Actions remain open because there is no owner, evidence trail or verification step.",
        },
        {
          title: "Certification is treated as a paper exercise",
          icon: "Stamp",
          body: "A credible certificate depends on technical scope and closure of agreed safety-critical findings.",
        },
      ],
    },
    {
      kind: "modes",
      eyebrow: "Delivery routes",
      top: "On-site when physical verification matters.",
      bottom: "Remote when evidence can travel.",
      body: "RAMS selects the route around the rack condition, site risk, available documentation, evidence quality and required certification outcome.",
      note: "Remote assessment is suitable only where the agreed evidence can support the required decision. RAMS may require an on-site visit.",
      items: [
        {
          title: "Certified Rack Safety Assessment",
          icon: "ClipboardList",
          body: "A trained rack inspector attends the facility to map the installation, examine accessible elements, capture measurements and record evidence directly in the IRDS workflow.",
        },
        {
          title: "Remote Rack Safety Review",
          icon: "ScanLine",
          body: "The site team captures required photos, video, dimensions and documents against RAMS instructions. A competent reviewer evaluates the submitted evidence and identifies gaps or next actions.",
        },
      ],
    },
    {
      kind: "grid",
      eyebrow: "Inspection scope",
      top: "Every element. Every interface.",
      bottom: "Every location.",
      body: "The final checklist is confirmed for the rack type, layout, loading, access and service level.",
      items: [
        {
          title: "Uprights & frames",
          body: "Impact damage, dents, bends, twists, verticality, splice condition, corrosion and unsupported height.",
        },
        {
          title: "Beams & connectors",
          body: "Deflection, dislodgement, locking devices, connector damage, corrosion and load-level configuration.",
        },
        {
          title: "Bracing & ties",
          body: "Missing, bent or misaligned bracing; connection condition; row spacers and tie-beam arrangement.",
        },
        {
          title: "Baseplates & anchors",
          body: "Anchor presence, tightness, damaged floors, shims, grout, baseplate deformation and corrosion.",
        },
        {
          title: "Protection systems",
          body: "Upright protectors, end barriers, toe guards and their position, condition and attachment.",
        },
        {
          title: "Loading & unit loads",
          body: "Load notices, pallet placement, clearances, damaged pallets, overloading indicators and missing stoppers.",
        },
        {
          title: "Layout & interfaces",
          body: "Aisles, MHE interaction, expansion joints, pedestrian zones, obstructions and unsafe storage around racks.",
        },
        {
          title: "Documents & configuration",
          body: "Available drawings, OEM details, safe working loads, modification history and prior inspection records.",
        },
        {
          title: "Traceability & closure",
          body: "Photos, measurements, responsible owner, required action, replacement quantity and completion evidence.",
        },
      ],
    },
    {
      kind: "process",
      eyebrow: "How it works",
      top: "Inspection finds the risk.",
      bottom: "The workflow closes it.",
      body: "The audit is connected from first observation to final verified outcome.",
      steps: [
        {
          n: "01",
          title: "Inspection",
          body: "Map racks and capture technical evidence.",
        },
        { n: "02", title: "Severity", body: "Classify Green, Amber or Red." },
        {
          n: "03",
          title: "Digital map",
          body: "Pin each issue to its exact asset.",
        },
        {
          n: "04",
          title: "Damage BOQ",
          body: "Quantify required replacement items.",
        },
        {
          n: "05",
          title: "Rectification",
          body: "Assign, control and evidence actions.",
        },
        {
          n: "06",
          title: "Certification",
          body: "Verify closure before applicable issue.",
        },
      ],
    },
    {
      kind: "lens",
      eyebrow: "Risk classification",
      top: "See what can remain.",
      bottom: "Know what must change.",
      body: "Colour creates a common operational language; the technical finding and prescribed control determine the action.",
      items: [
        {
          tone: "green",
          title: "Serviceable within the assessed condition",
          body: "Record the observation, maintain normal controls and monitor the element during the next planned inspection cycle.",
          tags: ["Green", "Monitor"],
        },
        {
          tone: "amber",
          title: "Damage requires prompt action",
          body: "Control loading as instructed, plan replacement within the defined window and retain evidence of completion.",
          tags: ["Amber", "Plan replacement"],
        },
        {
          tone: "red",
          title: "Critical risk requires immediate control",
          body: "Unload and isolate the affected location, notify the responsible person and replace the damaged element before verified return to use.",
          tags: ["Red", "Isolate"],
        },
      ],
    },
    {
      kind: "deliverables",
      eyebrow: "Deliverables",
      top: "An actionable safety record —",
      bottom: "Not a photo dump.",
      body: "Deliverables are structured so safety, procurement, maintenance and leadership can act from the same evidence.",
      items: [
        {
          title: "Executive safety summary",
          body: "Condition profile, critical risks and priorities.",
        },
        {
          title: "Element-wise findings",
          body: "Observation, severity, evidence and action.",
        },
        {
          title: "Digital rack health map",
          body: "Issues placed at rack, bay and element level.",
        },
        {
          title: "Damage BOQ / BOM",
          body: "Replacement quantities for procurement planning.",
        },
        {
          title: "Measurement records",
          body: "Applicable alignment, deflection and test data.",
        },
        {
          title: "Corrective-action register",
          body: "Owner, status, evidence and target closure.",
        },
        {
          title: "QR-linked asset history",
          body: "Persistent inspection and lifecycle traceability.",
        },
        {
          title: "Verification record",
          body: "Evidence review or reinspection outcome.",
        },
      ],
      callout: {
        title: "Rack Stability / Safety Certification",
        body: "Certification is the result of an agreed technical assessment and satisfactory closure — not an automatic document issued after a walkthrough.",
      },
    },
    {
      kind: "grid",
      eyebrow: "Measurement and testing",
      top: "Measured where the decision",
      bottom: "Needs measurement.",
      body: "Applicable checks are selected for the rack type, available design information and inspection package.",
      note: "Tests are not automatically included in every package. The quotation and inspection plan define the sample, access, equipment, tolerances and reporting basis.",
      cols: 4,
      items: [
        {
          title: "Upright verticality",
          body: "Measured alignment against the applicable project and rack-system criteria.",
        },
        {
          title: "Beam deflection",
          body: "Evaluate loaded beam deflection and visible deformation at identified locations.",
        },
        {
          title: "Anchor-bolt torque",
          body: "Check selected anchor connections against the approved technical requirement.",
        },
        {
          title: "Ultrasonic thickness",
          body: "Measure remaining section thickness where corrosion or advanced scope requires it.",
        },
        {
          title: "Safe working load review",
          body: "Assess load information, configuration and available design documentation.",
        },
        {
          title: "Structural analysis",
          body: "Advanced engineering assessment where geometry, loads and information permit.",
        },
        {
          title: "Floor & base interface",
          body: "Review baseplate, anchor, shim, grout and floor condition at supported locations.",
        },
        {
          title: "Configuration verification",
          body: "Compare the installed arrangement with available drawings and approved changes.",
        },
      ],
    },
    {
      kind: "grid",
      eyebrow: "When to inspect",
      top: "Before uncertainty",
      bottom: "Becomes exposure.",
      cols: 4,
      items: [
        {
          title: "At the planned expert-inspection interval",
          body: "Build a documented annual or risk-based inspection programme.",
        },
        {
          title: "After an MHE impact",
          body: "Control the affected location and assess the load-bearing elements.",
        },
        {
          title: "After installation or modification",
          body: "Review the installed configuration before or after operational handover.",
        },
        {
          title: "Before reusing dismantled racks",
          body: "Assess condition, completeness and suitability before reinstallation.",
        },
        {
          title: "When SWL information is missing",
          body: "Define the engineering information needed to establish safe use.",
        },
        {
          title: "After fire, flood or seismic event",
          body: "Inspect affected structure, foundations and connections.",
        },
        {
          title: "Before certification renewal",
          body: "Allow time for findings, component procurement and verification.",
        },
        {
          title: "When damage keeps recurring",
          body: "Use Digital Twin history to identify high-risk zones and repeated causes.",
        },
      ],
    },
    {
      kind: "faq",
      eyebrow: "Questions",
      top: "What teams ask",
      bottom: "Before an inspection.",
      body: "Scope, evidence and certification are confirmed for each site. These answers explain the standard RAMS approach.",
      items: [
        {
          title:
            "Can a remote assessment replace every on-site rack inspection?",
          body: "No. Remote review can support screening, selected defect review and closure verification when evidence is sufficient. RAMS may require an on-site inspection where physical access, measurement, hidden condition, structural complexity or certification scope cannot be resolved remotely.",
        },
        {
          title:
            "Do we receive a stability certificate immediately after inspection?",
          body: "Not automatically. Certificate status depends on the agreed scope, available technical information, rack condition and completion of required safety-critical actions. Rectification evidence or reinspection may be required before issue.",
        },
        {
          title: "What happens when a Red finding is identified?",
          body: "The affected location should be unloaded and isolated as instructed, and the responsible site person should be notified immediately. RAMS recommends replacement of the damaged Red element, followed by evidence review or reinspection before the location returns to use.",
        },
        {
          title: "Can damaged rack members be repaired or welded on site?",
          body: "Do not assume an improvised repair or site welding is acceptable. Damaged Red and Amber elements are recommended for replacement. Any engineered strengthening must follow an approved design, manufacturer requirements and competent technical review.",
        },
        {
          title: "What should we prepare before the inspection?",
          body: "Provide available rack layouts, OEM drawings, load notices, modification history, earlier reports, rack and bay naming, site access requirements and responsible contacts. The rack faces should be visible and safe access arranged for the agreed inspection scope.",
        },
        {
          title: "Does RAMS help after the report is issued?",
          body: "Yes. The service can include damage BOQ support, action tracking, rectification supervision, photo-evidence review, reinspection and the applicable certification pathway. The exact post-inspection scope is defined commercially.",
        },
      ],
    },
  ],
  cta: {
    top: "Make rack safety visible,",
    bottom: "Measurable and actionable.",
    body: "Book an on-site inspection or discuss whether a remote evidence-led assessment is suitable for your facility.",
  },
};

/* ── 02 structural verification ───────────────────────────────────── */

const STRUCTURAL_VERIFICATION: Service = {
  slug: "structural-verification",
  code: "SV",
  name: "Structural Verification",
  eyebrow: "Structural Verification",
  h1: ["Know what the structure", "can safely carry."],
  intro:
    "Verify warehouse racks, mezzanines, platforms and structural assets through field evidence, load-path analysis, engineering checks and compliance reporting — before approving a load change, modification or continued use.",
  chips: ["Load-path analysis", "Field evidence", "Stated design basis"],
  action: "Discuss a verification",
  meta: "Verify warehouse racks, mezzanines, platforms and structural assets through field evidence, load-path analysis, engineering checks and compliance reporting before a load or configuration change.",
  assurances: [
    {
      title: "Actual geometry and condition",
      body: "Drawings checked against the structure.",
    },
    {
      title: "Real load cases and combinations",
      body: "Dead, imposed, dynamic and lateral actions.",
    },
    {
      title: "Capacity and utilisation",
      body: "Strength, stability and serviceability results.",
    },
    {
      title: "Compliance-ready reporting",
      body: "Assumptions, limitations and actions made clear.",
    },
  ],
  sections: [
    {
      kind: "problem",
      eyebrow: "The gap",
      top: "A drawing is not proof",
      bottom: "Of the installed structure.",
      body: "Warehouse structures change over time. Loads increase, configurations move, components are replaced, anchors loosen and undocumented modifications enter the system. Verification reconnects the engineering model with physical reality.",
      items: [
        {
          title: "Safe working load is unknown or unsupported",
          icon: "Gauge",
          body: "Load notices exist, but the calculation basis, configuration or original design information is unavailable.",
        },
        {
          title: "The installed structure differs from drawings",
          icon: "PencilRuler",
          body: "Bay spacing, levels, profiles, bracing, connections or supports have changed during operation.",
        },
        {
          title: "A load or use change is planned",
          icon: "TrendingUp",
          body: "Heavier pallets, new machines, additional platforms or altered flow can change member and foundation demand.",
        },
        {
          title: "Condition reduces confidence in capacity",
          icon: "ShieldAlert",
          body: "Corrosion, impact, deflection, settlement or connection damage may affect the assumed structural system.",
        },
        {
          title: "Compliance decisions lack an audit trail",
          icon: "FileSearch",
          body: "A pass/fail statement without evidence, inputs, governing checks and limitations is difficult to defend.",
        },
      ],
    },
    {
      kind: "grid",
      eyebrow: "What can be verified",
      top: "From storage systems",
      bottom: "To warehouse structures.",
      body: "The exact scope is selected around the asset, decision, available information and required level of confidence.",
      note: "Structural verification is asset- and purpose-specific. One report should not be extended to a different configuration, load or location without review.",
      items: [
        {
          title: "Pallet racking systems",
          body: "Uprights, beams, bracing, connections, anchors, baseplates, load levels and frame configuration.",
        },
        {
          title: "Mezzanines & platforms",
          body: "Primary and secondary framing, decking, columns, bracing, stairs, connections and supports.",
        },
        {
          title: "Steel warehouse structures",
          body: "Frames, columns, beams, trusses, canopies, access structures and selected secondary systems.",
        },
        {
          title: "Foundations & interfaces",
          body: "Base reactions, anchor layout, baseplates, pedestal or slab interface and available foundation data.",
        },
        {
          title: "Load or use changes",
          body: "Reconfigured racks, revised pallet loads, added equipment, altered levels or new operating actions.",
        },
        {
          title: "Existing structure assessment",
          body: "Condition-informed verification where age, damage, corrosion or missing documentation affects confidence.",
        },
      ],
    },
    {
      kind: "process",
      eyebrow: "How it works",
      top: "Evidence first. Analysis second.",
      bottom: "Decision last.",
      body: "The model is only as reliable as its geometry, material, boundary conditions, loads and condition assumptions.",
      steps: [
        {
          n: "01",
          title: "Define",
          body: "Asset, decision, loads and acceptance basis.",
        },
        {
          n: "02",
          title: "Survey",
          body: "Verify geometry, profiles, supports and condition.",
        },
        {
          n: "03",
          title: "Test",
          body: "Fill evidence gaps with agreed field or NDT checks.",
        },
        {
          n: "04",
          title: "Model",
          body: "Build structural system, actions and combinations.",
        },
        {
          n: "05",
          title: "Check",
          body: "Strength, stability, serviceability and connections.",
        },
        {
          n: "06",
          title: "Report",
          body: "State capacity, limitations and required actions.",
        },
      ],
    },
    {
      kind: "lens",
      eyebrow: "Governing checks",
      top: "Find the governing limit —",
      bottom: "Not only the biggest number.",
      body: "Verification reviews the complete structural response and identifies the member, connection, support or serviceability criterion controlling the allowable load.",
      items: [
        {
          title: "Member capacity",
          body: "Axial, bending, shear and interaction.",
          tags: ["Check"],
        },
        {
          title: "Stability",
          body: "Buckling, sway and global behaviour.",
          tags: ["Review"],
        },
        {
          title: "Serviceability",
          body: "Deflection, drift and vibration.",
          tags: ["Check"],
        },
        {
          title: "Connections",
          body: "Bolts, welds and proprietary connectors.",
          tags: ["Review"],
        },
        {
          title: "Base and foundation",
          body: "Anchors, baseplates and support reactions.",
          tags: ["Govern"],
        },
        {
          title: "Structural integrity",
          body: "Overall robustness and load transfer.",
          tags: ["Check"],
        },
      ],
    },
    {
      kind: "grid",
      eyebrow: "Load cases",
      top: "Model the actions the",
      bottom: "Structure actually experiences.",
      body: "Load definition is agreed with the customer and verified against available records, equipment data and operational use.",
      cols: 4,
      items: [
        {
          title: "Dead load",
          body: "Self-weight, decking, fixed services, permanent equipment and supported structural elements.",
        },
        {
          title: "Imposed / storage load",
          body: "Pallet, uniformly distributed, concentrated, personnel and operational storage actions.",
        },
        {
          title: "Dynamic & impact effects",
          body: "MHE interaction, moving equipment, machine effects and specified accidental actions where applicable.",
        },
        {
          title: "Wind & seismic actions",
          body: "Applicable lateral actions, directional response, stability effects and combinations.",
        },
        {
          title: "Thermal & imposed movement",
          body: "Temperature, restraint, settlement or movement effects where relevant to the structural system.",
        },
        {
          title: "Temporary & maintenance loads",
          body: "Installation, maintenance, access, lifting and other short-duration operational conditions.",
        },
        {
          title: "Load combinations",
          body: "Ultimate and serviceability combinations selected from the applicable design basis.",
        },
        {
          title: "Allowable operating envelope",
          body: "Capacity tied to the verified configuration, assumptions, limitations and required actions.",
        },
      ],
    },
    {
      kind: "grid",
      eyebrow: "Field evidence",
      top: "Close the gap between",
      bottom: "Assumed and known.",
      body: "Where records are incomplete, targeted measurement or testing can improve confidence. Methods are chosen only when relevant to the structural decision.",
      note: "Testing is not a substitute for design information in every case. RAMS records assumptions and identifies where opening-up, laboratory testing, OEM input or further investigation is required.",
      cols: 4,
      items: [
        {
          title: "Dimensional survey",
          body: "Member sizes, spans, heights, levels, plumbness, support positions and installed configuration.",
        },
        {
          title: "Ultrasonic thickness",
          body: "Remaining steel thickness where corrosion, profile uncertainty or condition assessment requires it.",
        },
        {
          title: "Bolt & anchor checks",
          body: "Presence, layout, accessible condition and agreed torque or connection verification.",
        },
        {
          title: "Material verification",
          body: "Available certificates, grade evidence, manufacturer information or agreed testing route.",
        },
        {
          title: "Deflection measurement",
          body: "Observed response under known loading, referenced to the applicable acceptance basis.",
        },
        {
          title: "Rebar / concrete investigation",
          body: "Rebar mapping, UPV, rebound, core or other agreed tests where RCC supports are in scope.",
        },
        {
          title: "Connection documentation",
          body: "Connector type, weld size, bolt grade, spacing and proprietary component identification.",
        },
        {
          title: "Condition mapping",
          body: "Damage, corrosion, deformation, missing elements and modifications placed in Digital Twin context.",
        },
      ],
    },
    {
      kind: "grid",
      eyebrow: "Design basis",
      top: "Standards applied to the",
      bottom: "Actual asset and decision.",
      body: "Verification can reference multiple design, application, tolerance and maintenance documents. The agreed design basis is stated in the report rather than implied by a generic compliance badge.",
      items: [
        {
          title: "Structural design principles for adjustable pallet racking",
          body: "Applied where relevant to rack load capacity and structural verification.",
        },
        {
          title: "Application and maintenance of steel static storage systems",
          body: "Condition, inspection management and operational controls.",
        },
        {
          title: "Tolerances, deformations and clearances",
          body: "Relevant dimensional and operational acceptance criteria.",
        },
        {
          title: "Specification of storage equipment",
          body: "Information interface between user and supplier.",
        },
        {
          title: "Applicable Indian structural and loading provisions",
          body: "Selected for the material, asset, location and verification scope.",
        },
        {
          title: "Manufacturer drawings, test data and load notices",
          body: "Proprietary component behaviour and approved configuration information.",
        },
      ],
    },
    {
      kind: "deliverables",
      eyebrow: "Deliverables",
      top: "A report that shows how",
      bottom: "The decision was reached.",
      body: "Engineering conclusions are linked to inputs, governing checks, physical condition and required actions.",
      items: [
        {
          title: "Asset and purpose",
          body: "What was verified and for which decision.",
        },
        {
          title: "Documents and survey",
          body: "Inputs, field evidence and configuration.",
        },
        {
          title: "Analysis basis",
          body: "Model, materials, restraints and assumptions.",
        },
        {
          title: "Loads and combinations",
          body: "Actions and governing design cases.",
        },
        {
          title: "Member utilisation",
          body: "Strength, stability and serviceability results.",
        },
        {
          title: "Connection and base checks",
          body: "Joint, anchor and support demand where included.",
        },
        {
          title: "Compliance matrix",
          body: "Criteria, status and supporting reference.",
        },
        {
          title: "Actions and restrictions",
          body: "Required work, load limits and verification route.",
        },
      ],
      callout: {
        title: "Clear operating decision",
        body: "The conclusion is expressed against the verified configuration and purpose, with conditions that operations can understand and control.",
      },
    },
    {
      kind: "grid",
      eyebrow: "When to verify",
      top: "Verify before",
      bottom: "The physical change.",
      items: [
        {
          title: "Increase pallet or bay load",
          body: "Check whether the existing members, connections and supports can carry a proposed higher load.",
        },
        {
          title: "Change rack configuration",
          body: "Assess revised beam levels, bay arrangement, bracing or frame height before implementation.",
        },
        {
          title: "Add a machine or platform",
          body: "Verify supporting structure and interfaces for new equipment, access or operational loads.",
        },
        {
          title: "Re-use or relocate a structure",
          body: "Review condition, completeness, geometry and load suitability for the new arrangement.",
        },
        {
          title: "Investigate deformation or distress",
          body: "Connect observed deflection, corrosion, cracking or movement to structural demand and capacity.",
        },
        {
          title: "Prepare for audit or certification",
          body: "Create a controlled engineering record of capacity, compliance status, limitations and actions.",
        },
      ],
    },
    {
      kind: "grid",
      eyebrow: "Afterwards",
      top: "The calculation should not",
      bottom: "Disappear into a PDF.",
      body: "RAMS can connect the verification result to the Digital Twin so the asset, approved configuration, load basis, documents, condition history and future changes remain in context.",
      cols: 4,
      items: [
        {
          title: "Persistent digital identity",
          body: "Exact rack, frame, platform or structural element.",
        },
        {
          title: "Approved load and configuration",
          body: "Decision linked to its geometry and assumptions.",
        },
        {
          title: "Inspection, change and verification record",
          body: "See what changed, when and why.",
        },
        {
          title: "Restrictions and closure evidence",
          body: "Keep pending work visible until validated.",
        },
      ],
    },
    {
      kind: "faq",
      eyebrow: "Questions",
      top: "What teams ask",
      bottom: "Before verification.",
      body: "Scope and confidence depend on the decision, the structure and the evidence available.",
      items: [
        {
          title: "Can RAMS verify load capacity without original drawings?",
          body: "Potentially, but missing information changes the investigation scope. A measured survey, profile identification, material evidence, connection data, field testing or conservative assumptions may be required. RAMS will identify what can be concluded and where further evidence is necessary.",
        },
        {
          title:
            "Does a structural analysis automatically result in certification?",
          body: "No. Certification depends on the agreed technical scope, adequacy of information, analysis result, physical condition and completion of required actions. The issue may be conditional, restricted or withheld until rectification and validation are complete.",
        },
        {
          title: "Can an existing rack carry a heavier pallet?",
          body: "Do not assume so. The revised load can affect beams, uprights, bracing, connectors, anchors, baseplates, foundations and overall stability. RAMS verifies the proposed load against the actual configuration and available component data before stating an allowable operating envelope.",
        },
        {
          title: "Is finite-element analysis always required?",
          body: "No. The analysis method should match the structural system, complexity, decision and available data. Some checks can be completed with established analytical methods; complex geometry, interaction or local behaviour may justify FEM or other advanced modelling.",
        },
        {
          title: "What information should the customer provide?",
          body: "Useful inputs include design and fabrication drawings, calculations, material certificates, equipment or pallet loads, load notices, modification history, inspection records, site photographs and the exact proposed change or decision. RAMS will issue a data requirement list for the assignment.",
        },
        {
          title: "Can the report support rectification or strengthening?",
          body: "Yes, where included. The report can identify the governing deficiency and define replacement, load restriction, further testing or engineered strengthening requirements. Site improvisation or welding should not proceed without an approved design and competent review.",
        },
      ],
    },
  ],
  cta: {
    top: "Verify the load before",
    bottom: "You trust the structure.",
    body: "Share the asset, drawings, current loading and proposed change. RAMS will define the evidence, analysis and compliance-reporting scope required for a defensible decision.",
  },
};

/* ── 03 inventory reconciliation and audit ────────────────────────── */

const INVENTORY_AUDIT: Service = {
  slug: "inventory-audit",
  code: "IA",
  name: "Inventory Reconciliation and Audit",
  eyebrow: "Inventory Reconciliation & Audit",
  h1: ["Know what you have.", "Know where it actually is."],
  intro:
    "Verify the complete warehouse physically, compare every supported SKU, pallet, batch, quantity and location against system records, investigate discrepancies and create an evidence-backed reconciliation file.",
  chips: ["Controlled cut-off", "Exception register", "Customer approval"],
  action: "Assess my inventory",
  meta: "Verify the warehouse physically, compare every supported SKU, pallet, batch, quantity and location against system records, and produce an evidence-backed reconciliation file.",
  assurances: [
    {
      title: "Physical stock verified",
      body: "Count, identity, batch and quantity.",
    },
    {
      title: "Every item checked in place",
      body: "Rack, floor, staging and controlled zones.",
    },
    {
      title: "Every exception traceable",
      body: "Time, location, operator and supporting proof.",
    },
    {
      title: "Adjustments remain governed",
      body: "Recount, review and customer approval.",
    },
  ],
  sections: [
    {
      kind: "problem",
      eyebrow: "The gap",
      top: "The system says it exists.",
      bottom: "The floor tells another story.",
      body: "Receipts, moves, picks, returns and adjustments happen continuously. One missed scan or temporary location can create a mismatch that compounds across downstream decisions.",
      items: [
        {
          title: "Stock is in the warehouse — but not where the system says",
          icon: "MapPin",
          body: "Teams lose time searching and may create duplicate replenishment or emergency movement.",
        },
        {
          title: "System quantity differs from the physical count",
          icon: "Scale",
          body: "Shortages and overages remain unexplained until picking, dispatch or financial closure.",
        },
        {
          title: "Batch, lot or status is recorded incorrectly",
          icon: "Tags",
          body: "Available, blocked, quarantine, returns and damaged stock can become mixed in reporting.",
        },
        {
          title: "Manual count evidence is hard to verify",
          icon: "ClipboardList",
          body: "Spreadsheets show the final number but often lose who counted, where, when and what was rechecked.",
        },
        {
          title: "The audit finds differences but not the cause",
          icon: "PackageSearch",
          body: "Without movement history and location context, the same variance returns after adjustment.",
        },
      ],
    },
    {
      kind: "grid",
      eyebrow: "Audit scope",
      top: "No blind zone.",
      bottom: "No assumed location.",
      body: "The audit boundary, cut-off and stock states are agreed before counting begins.",
      note: "The customer confirms the authoritative system extract, valuation basis, ownership rules and final stock-adjustment approval.",
      cols: 4,
      items: [
        {
          title: "Racked inventory",
          body: "Row, rack, bay and level verification for palletised or case stock.",
        },
        {
          title: "Floor-stack areas",
          body: "Defined floor locations, blocks, lanes and bulk-storage quantities.",
        },
        {
          title: "Inbound & receiving",
          body: "Received, pending inspection, unposted and in-process receipts at cut-off.",
        },
        {
          title: "Outbound & staging",
          body: "Picked, packed, staged, dispatched and system-posting status.",
        },
        {
          title: "Quality & quarantine",
          body: "Blocked, held, rejected or condition-controlled stock.",
        },
        {
          title: "Returns & damaged stock",
          body: "Customer returns, salvage, scrap and pending-disposition inventory.",
        },
        {
          title: "WIP & line-side stock",
          body: "Material between warehouse and production where included in scope.",
        },
        {
          title: "Unidentified inventory",
          body: "Physical stock without a valid label, record, owner or mapped location.",
        },
      ],
    },
    {
      kind: "process",
      eyebrow: "How it works",
      top: "Count once.",
      bottom: "Reconcile completely.",
      body: "The process protects cut-off integrity while creating evidence for every exception and approved closure.",
      steps: [
        {
          n: "01",
          title: "Plan & freeze",
          body: "Define scope, cut-off, movement rules and teams.",
        },
        {
          n: "02",
          title: "Extract & map",
          body: "Lock the system baseline and location master.",
        },
        {
          n: "03",
          title: "Count & capture",
          body: "Verify identity, quantity, batch, status and place.",
        },
        {
          n: "04",
          title: "Compare",
          body: "Match the physical count to WMS or ERP records.",
        },
        {
          n: "05",
          title: "Investigate",
          body: "Recount and trace unexplained differences.",
        },
        {
          n: "06",
          title: "Approve & close",
          body: "Issue reports and customer-controlled adjustment files.",
        },
      ],
    },
    {
      kind: "grid",
      eyebrow: "Count controls",
      top: "Protect the count from",
      bottom: "Operational noise.",
      body: "Inventory accuracy cannot be verified unless movements around the cut-off are controlled, recorded and reconciled.",
      items: [
        {
          title: "Time-stamped baseline",
          body: "Confirm the authoritative extract and transaction boundary.",
        },
        {
          title: "Freeze or controlled movement log",
          body: "Record all receipts, transfers, picks and dispatches during count.",
        },
        {
          title: "Quantity-hidden verification where agreed",
          body: "Reduce confirmation bias during physical counting.",
        },
        {
          title: "Independent second verification",
          body: "Recheck high-value, high-risk and discrepant records.",
        },
        {
          title: "Location-by-location completion",
          body: "Prevent omissions and duplicated coverage.",
        },
        {
          title: "Segregated adjustment authority",
          body: "RAMS reports; authorised customer roles approve system changes.",
        },
      ],
    },
    {
      kind: "lens",
      eyebrow: "Variance classes",
      top: "Know exactly",
      bottom: "What does not match.",
      body: "Every difference is classified so the right team can recount, investigate, correct or escalate it.",
      items: [
        {
          tone: "green",
          title: "Exact match",
          body: "Identity, quantity, status, batch and physical location agree with the baseline record.",
        },
        {
          tone: "red",
          title: "Quantity shortage",
          body: "Physical quantity is lower than the system quantity after controlled recount.",
        },
        {
          tone: "amber",
          title: "Quantity overage",
          body: "Physical quantity exceeds the system record and requires source investigation.",
        },
        {
          tone: "amber",
          title: "Location mismatch",
          body: "Correct stock is found in a different rack, floor zone or staging location.",
        },
        {
          tone: "red",
          title: "System-only inventory",
          body: "A record exists, but the corresponding physical stock cannot be verified.",
        },
        {
          tone: "amber",
          title: "Physical-only inventory",
          body: "Stock is present but lacks a valid system record or ownership reference.",
        },
        {
          tone: "amber",
          title: "Batch / lot mismatch",
          body: "Product matches, but batch, lot, expiry or inventory status differs.",
        },
        {
          tone: "red",
          title: "Duplicate or identity conflict",
          body: "The same identifier appears more than once or does not uniquely resolve.",
        },
      ],
    },
    {
      kind: "grid",
      eyebrow: "Capture methods",
      top: "Use the right evidence",
      bottom: "For the warehouse.",
      body: "RAMS can combine trained physical verification with supported identification and capture technology. The agreed method depends on labels, storage type, access and required confidence.",
      note: "Technology assists verification; it does not remove the need for cut-off governance, exception review, recount or customer approval.",
      items: [
        {
          title: "Verified physical count",
          body: "Location-by-location inspection, identity check, quantity capture and recount using controlled teams.",
        },
        {
          title: "Scan-based verification",
          body: "Match item, pallet, batch or location identifiers against the authorised baseline.",
        },
        {
          title: "Supported tag capture",
          body: "Use existing or agreed RFID infrastructure where tag identity and read behaviour are validated.",
        },
        {
          title: "Automated visual coverage",
          body: "Capture supported rack or floor locations using an approved flight or mobile scanning plan.",
        },
        {
          title: "Image-assisted recognition",
          body: "Use supported computer-vision workflows to assist location, label or presence verification.",
        },
        {
          title: "WMS / ERP comparison",
          body: "Connect through an approved interface or controlled file extract with defined field mapping.",
        },
      ],
    },
    {
      kind: "deliverables",
      eyebrow: "Deliverables",
      top: "An evidence-backed",
      bottom: "Reconciliation pack.",
      body: "Outputs are structured for warehouse operations, finance, inventory control, internal audit and management review.",
      items: [
        {
          title: "Audit scope & cut-off record",
          body: "Sites, zones, stock states and controls.",
        },
        {
          title: "Physical count register",
          body: "Verified identity, quantity and location.",
        },
        {
          title: "System comparison file",
          body: "Baseline and captured fields side by side.",
        },
        {
          title: "Variance classification",
          body: "Shortage, overage, location and identity issues.",
        },
        {
          title: "Recount & evidence trail",
          body: "Time, location, operator and supporting proof.",
        },
        {
          title: "Accuracy analysis",
          body: "Site, zone, class and stock-state views.",
        },
        {
          title: "Adjustment recommendation",
          body: "Controlled file for authorised customer review.",
        },
        {
          title: "Root-cause action register",
          body: "Process, data and location improvements.",
        },
      ],
      callout: {
        title: "From count difference to controlled action",
        body: "The final report distinguishes confirmed variance from unresolved evidence gaps and shows what can be closed, monitored or investigated further.",
      },
    },
    {
      kind: "grid",
      eyebrow: "Afterwards",
      top: "A point-in-time count",
      bottom: "Can become an operating system.",
      body: "The audit can stand alone. Where the customer wants ongoing visibility, RAMS Inventory Intelligence can connect the verified baseline to the Digital Twin, WMS data and supported movement sources.",
      cols: 4,
      items: [
        {
          title: "Map inventory to physical locations",
          body: "Rack, bay, level, floor zone and staging context.",
        },
        {
          title: "Monitor accuracy, ageing and exceptions",
          body: "Keep verified records visible after the audit.",
        },
        {
          title: "Orchestrate correction and cycle-count work",
          body: "Prioritise tasks using ABC class and exception risk.",
        },
        {
          title: "Compare sites and cross-module causes",
          body: "Connect inventory signals with MHE, tasks and facility context.",
        },
      ],
    },
    {
      kind: "faq",
      eyebrow: "Questions",
      top: "What teams ask",
      bottom: "Before the count.",
      body: "Every audit begins with a joint scope and cut-off plan so the result can be reconciled properly.",
      items: [
        {
          title: "Does the warehouse need to stop operating during the audit?",
          body: "A complete freeze provides the cleanest cut-off, but some facilities must continue operating. In that case, all movements within the audit window require a controlled log and reconciliation procedure. The agreed method depends on operational constraints and risk.",
        },
        {
          title: "Can RAMS audit both racked and floor inventory?",
          body: "Yes. The scope can include racks, floor stacks, inbound, outbound, quarantine, returns, damaged stock, work-in-progress and other defined storage states. Every area needs a clear location structure and ownership rule.",
        },
        {
          title: "Does RAMS update our WMS after reconciliation?",
          body: "RAMS provides the reconciled variance and adjustment recommendation. Final approval remains with authorised customer roles. System updates occur only where explicitly authorised, integrated and governed within the agreed scope.",
        },
        {
          title: "Can drone or AI scanning replace all physical counting?",
          body: "Not in every environment. Automated capture can improve coverage where labels and sightlines are suitable, but exceptions, low-confidence reads, mixed stock and quantity verification may require manual checks or recounts.",
        },
        {
          title: "What data should we provide before the audit?",
          body: "Provide the location master, item and pallet identifiers, quantity and unit of measure, batch or lot data, inventory status, valuation data if required, recent transaction history, system extracts, site layout and the authorised cut-off time.",
        },
        {
          title: "Can the service support future cycle counting?",
          body: "Yes. The audit can establish a verified baseline and identify high-risk locations, classes and causes. Optional ABC analysis can use configurable thresholds and annual consumption value to support a risk-based cycle-count plan.",
        },
      ],
    },
  ],
  cta: {
    top: "Every unexplained variance is",
    bottom: "A decision made on bad data.",
    body: "Share your warehouse size, stock profile, system landscape and required audit window. RAMS will define the count, control and reconciliation plan.",
  },
};

/* ── 04 MHE productivity assessment ───────────────────────────────── */

const MHE_PRODUCTIVITY: Service = {
  slug: "mhe-productivity-assessment",
  code: "MP",
  name: "MHE Productivity Assessment",
  eyebrow: "MHE Productivity Assessment",
  h1: ["See where every", "vehicle hour actually goes."],
  intro:
    "Measure how forklifts and other material handling equipment move, wait and perform across the real operation. Identify utilisation gaps, empty travel, congestion, task delay and fleet imbalance — then turn the evidence into a prioritised improvement plan.",
  chips: ["Defined measures", "Observed baseline", "Validated change"],
  action: "Scope an assessment",
  meta: "Measure how forklifts and other MHE move, wait and perform across the real operation — utilisation gaps, empty travel, congestion, task delay and fleet imbalance, turned into a prioritised plan.",
  assurances: [
    {
      title: "Separate activity from availability",
      body: "Know which assets work, wait or remain unused.",
    },
    {
      title: "Expose lost movement",
      body: "Empty travel, queues, backtracking and congestion.",
    },
    {
      title: "Test fleet need with evidence",
      body: "Understand peak demand before adding or removing MHE.",
    },
    {
      title: "Prioritise practical changes",
      body: "Process, route, task, charging and allocation improvements.",
    },
  ],
  sections: [
    {
      kind: "problem",
      eyebrow: "The gap",
      top: "A busy fleet is not",
      bottom: "Always a productive fleet.",
      body: "WMS and ERP records show transactions. Rental schedules show fleet cost. Neither automatically explains how vehicle time is consumed on the floor.",
      items: [
        {
          title: "Utilisation is estimated from shifts or engine hours",
          icon: "Gauge",
          body: "Being switched on does not mean the vehicle is moving useful work.",
        },
        {
          title: "Idle time has no operational explanation",
          icon: "Timer",
          body: "Waiting may come from tasks, paperwork, charging, dock queues, blocked aisles or missing inventory.",
        },
        {
          title: "Fleet decisions rely on averages",
          icon: "BarChart3",
          body: "Site-level totals hide vehicle imbalance, shift peaks and equipment-type constraints.",
        },
        {
          title: "Routes evolved without measurement",
          icon: "Route",
          body: "Repeated backtracking and empty travel add time without adding throughput.",
        },
        {
          title: "Productivity is discussed without physical context",
          icon: "MapPin",
          body: "Reports show output, but not the zone, route, queue or interaction that shaped it.",
        },
      ],
    },
    {
      kind: "grid",
      eyebrow: "Assessment scope",
      top: "Measure the operation",
      bottom: "Around the vehicle.",
      body: "The scope is agreed around site layout, shifts, MHE classes, operating rules and the decisions the customer needs to make.",
      note: "Measures are defined before capture. Results apply to the agreed observation window, equipment and operating conditions.",
      cols: 4,
      items: [
        {
          title: "Fleet utilisation",
          body: "Active, available, idle, charging, under maintenance and not-in-use time by asset and class.",
        },
        {
          title: "Movement & travel",
          body: "Loaded and empty travel, distance, route repetition, backtracking and unnecessary movement.",
        },
        {
          title: "Task performance",
          body: "Task receipt, response, travel, pickup, drop, completion and inter-task delay where data allows.",
        },
        {
          title: "Waiting & queues",
          body: "Delay at docks, staging, aisles, production interfaces, charging points and approval steps.",
        },
        {
          title: "Fleet balance",
          body: "High-use, low-use and unused vehicles; class fit; peak concurrency and spare strategy.",
        },
        {
          title: "Layout interaction",
          body: "Congestion, restricted turns, crossing points, route conflicts and difficult operating zones.",
        },
        {
          title: "Shift & operator context",
          body: "Pattern comparison by shift, role, equipment type and authorised operator session where included.",
        },
        {
          title: "Improvement potential",
          body: "Ranked operational changes, measurement basis, dependencies, owner and validation method.",
        },
      ],
    },
    {
      kind: "process",
      eyebrow: "How it works",
      top: "Baseline the work. Explain the loss.",
      bottom: "Validate the change.",
      body: "A defined sequence prevents one unusual shift — or one attractive dashboard — from becoming the whole conclusion.",
      steps: [
        {
          n: "01",
          title: "Define",
          body: "Agree questions, assets, shifts, KPIs and observation window.",
        },
        {
          n: "02",
          title: "Map",
          body: "Record routes, zones, tasks, interfaces and constraints.",
        },
        {
          n: "03",
          title: "Capture",
          body: "Observe and collect vehicle, task and operational evidence.",
        },
        {
          n: "04",
          title: "Analyse",
          body: "Separate productive time, travel, waiting and availability.",
        },
        {
          n: "05",
          title: "Diagnose",
          body: "Connect patterns to process, layout, fleet and shift causes.",
        },
        {
          n: "06",
          title: "Improve",
          body: "Prioritise actions and define how results will be verified.",
        },
      ],
    },
    {
      kind: "lens",
      eyebrow: "Time categories",
      top: "One percentage is",
      bottom: "Never the whole story.",
      body: "RAMS separates time categories and operating context so teams can understand what is productive, what is necessary and what may be removable.",
      items: [
        {
          tone: "green",
          title: "Productive handling",
          body: "Time directly associated with defined load movement or completed operational work.",
          tags: ["Loaded movement", "Pickup and drop", "Task-linked handling"],
        },
        {
          tone: "neutral",
          title: "Supporting travel",
          body: "Movement needed to position the MHE, including empty travel and return paths.",
          tags: ["Empty travel", "Repositioning", "Route to next task"],
        },
        {
          tone: "amber",
          title: "Operational waiting",
          body: "Vehicle ready or active but held by a queue, process, interface or unavailable work.",
          tags: ["Dock and staging queue", "Paperwork", "Blocked access"],
        },
        {
          tone: "neutral",
          title: "Planned support",
          body: "Necessary non-productive time required to keep the fleet safe and available.",
          tags: [
            "Charging or fuelling",
            "Pre-use checks",
            "Planned maintenance",
          ],
        },
        {
          tone: "red",
          title: "Unplanned loss",
          body: "Time removed from expected operation by breakdown, search, missing work or avoidable delay.",
          tags: ["Unplanned downtime", "Task gap", "Asset or load search"],
        },
        {
          tone: "amber",
          title: "Not scheduled / not used",
          body: "Available fleet capacity outside actual need for the observed period.",
          tags: ["Unused vehicles", "Excess overlap", "Class mismatch"],
        },
      ],
    },
    {
      kind: "modes",
      eyebrow: "Evidence method",
      top: "Start with the floor. Add technology",
      bottom: "Where it improves confidence.",
      body: "The assessment can be completed as a bounded study or strengthened with supported connected data. The chosen method depends on the question, existing systems and required level of detail.",
      items: [
        {
          title: "Observed operational baseline",
          icon: "Footprints",
          body: "RAMS maps the physical operation, samples representative shifts, reviews task and fleet records, and verifies patterns with site teams.",
          tags: [
            "Site walk and process mapping",
            "WMS / ERP / fleet records",
            "Verification with site teams",
          ],
        },
        {
          title: "Sensor-supported measurement",
          icon: "Radio",
          body: "Where included, non-invasive supported devices and existing systems can extend the observation window and improve vehicle-level detail.",
          tags: [
            "Movement and location",
            "Equipment status signals",
            "Extended observation window",
          ],
        },
      ],
    },
    {
      kind: "grid",
      eyebrow: "Decisions it supports",
      top: "Answer the fleet questions",
      bottom: "That change decisions.",
      items: [
        {
          title: "Right-size the fleet",
          body: "Understand peak simultaneous demand, underused assets and required resilience before lease, purchase or transfer decisions.",
        },
        {
          title: "Reduce empty travel",
          body: "Identify repeated unloaded routes, backtracking and poor equipment placement that consume vehicle time.",
        },
        {
          title: "Remove queue delay",
          body: "Find waiting at docks, staging and process interfaces, then test a clearer release or sequencing rule.",
        },
        {
          title: "Balance assets across shifts",
          body: "Compare demand and equipment mix by shift, area and class instead of using a site-wide average.",
        },
        {
          title: "Improve task allocation",
          body: "Connect task gaps and response patterns to dispatch logic, availability and zone ownership.",
        },
        {
          title: "Validate a proposed change",
          body: "Define a before-and-after measurement for revised routes, charging, staging, slotting or work rules.",
        },
      ],
    },
    {
      kind: "deliverables",
      eyebrow: "Deliverables",
      top: "A decision pack —",
      bottom: "Not raw tracking data.",
      body: "Outputs make the measurement basis visible and connect each priority to evidence, operational cause and a practical validation method.",
      items: [
        {
          title: "Scope & KPI definitions",
          body: "Assets, shifts, window, formulas and exclusions.",
        },
        {
          title: "Fleet utilisation baseline",
          body: "Site, class, shift and asset-level views.",
        },
        {
          title: "Time-category analysis",
          body: "Productive, travel, waiting and support time.",
        },
        {
          title: "Movement analysis",
          body: "Distance, empty travel and repeated patterns.",
        },
        {
          title: "Congestion & delay map",
          body: "Zones, times, queues and operational context.",
        },
        {
          title: "Fleet balance review",
          body: "Peak need, underuse and class suitability.",
        },
        {
          title: "Prioritised opportunity register",
          body: "Impact, confidence, dependency and owner.",
        },
        {
          title: "Validation plan",
          body: "Before-and-after measures for agreed actions.",
        },
      ],
      callout: {
        title: "Spend, time and effort directed by evidence",
        body: "The assessment helps leaders distinguish additional capacity needs from process, layout, task or fleet-allocation problems.",
      },
    },
    {
      kind: "grid",
      eyebrow: "Afterwards",
      top: "Use the baseline once —",
      bottom: "Or keep the operation measurable.",
      body: "The assessment can stand alone. Where continuous visibility is required, RAMS can carry the agreed measurement model into MEPS, the MHE Efficiency and Productivity System.",
      note: "MEPS is an optional platform continuation, not a mandatory part of the assessment.",
      cols: 2,
      items: [
        {
          title: "Establish the verified baseline",
          body: "The assessment window, KPI rules and time categories become the reference the operation is measured against.",
        },
        {
          title: "Monitor agreed productivity measures",
          body: "Where the continuation is included, the same measures run on in MEPS rather than being redefined.",
        },
      ],
    },
    {
      kind: "faq",
      eyebrow: "Questions",
      top: "What teams ask",
      bottom: "Before the assessment.",
      body: "The right approach depends on the fleet decision, current systems, operating variability and required confidence.",
      items: [
        {
          title: "Do we need sensors installed before the assessment?",
          body: "No. RAMS can begin with a defined operational study using site observation, process mapping and available WMS, ERP, fleet or maintenance records. Sensors may be recommended where a longer window or higher vehicle-level detail is needed.",
        },
        {
          title: "What types of MHE can be assessed?",
          body: "The scope can include forklifts, reach trucks, pallet trucks, tow tractors, stackers and other material handling assets where their work, movement and availability can be defined. Equipment classes are analysed separately when their roles differ.",
        },
        {
          title: "Does high engine-on time mean high productivity?",
          body: "Not necessarily. Engine-on time may include productive handling, travel, waiting and idling. The assessment states the agreed time categories and avoids treating availability or ignition status as output by default.",
        },
        {
          title: "Can the assessment tell us how many vehicles we need?",
          body: "It can provide evidence for fleet-sizing decisions by showing peak simultaneous use, equipment-class demand, observed variation, downtime assumptions and resilience needs. The recommendation remains tied to the assessment window and agreed operating scenarios.",
        },
        {
          title: "How are operators handled fairly?",
          body: "The primary purpose is to improve the operating system around the work. Any operator-linked analysis should have a defined purpose, authorised access, appropriate notice, comparable work context and review of process constraints before individual conclusions are made.",
        },
        {
          title: "Can RAMS measure improvement after changes?",
          body: "Yes. RAMS can define a before-and-after validation using the same KPI rules and comparable operating conditions. Continuous monitoring can also be supported through MEPS where required.",
        },
      ],
    },
  ],
  cta: {
    top: "Know whether the gap is",
    bottom: "Fleet, flow, task — or time.",
    body: "Share your site, MHE fleet, shifts and the decision you need to make. RAMS will define a practical assessment scope, evidence method and decision-ready output.",
  },
};

/* ── 05 safety and operational assessment ─────────────────────────── */

const OPERATIONAL_ASSESSMENT: Service = {
  slug: "operational-assessment",
  code: "OA",
  name: "Safety and Operational Assessment",
  eyebrow: "Safety & Operational Assessment",
  h1: ["See the whole warehouse.", "Fix what matters first."],
  intro:
    "An end-to-end review of how people, MHE, racks, inventory and processes interact across the physical operation. Identify safety exposure, operational friction and control gaps — then convert them into one evidence-backed action roadmap.",
  chips: ["One assessment", "Field evidence", "Verified closure"],
  action: "Scope an assessment",
  meta: "An end-to-end review of how people, MHE, racks, inventory and processes interact across the physical operation, converted into one evidence-backed action roadmap.",
  assurances: [
    {
      title: "Find exposure in context",
      body: "People, vehicles, storage and infrastructure.",
    },
    {
      title: "See where flow breaks down",
      body: "Queues, handoffs, movement and rework.",
    },
    {
      title: "Test what works in practice",
      body: "Procedures, ownership, evidence and closure.",
    },
    {
      title: "One view of the physical operation",
      body: "From site condition to management action.",
    },
  ],
  sections: [
    {
      kind: "problem",
      eyebrow: "The gap",
      top: "Each team sees a part.",
      bottom: "Risk lives between the parts.",
      body: "Safety audits, productivity reports, maintenance logs and warehouse reviews often sit in separate files. The interaction between them remains invisible.",
      items: [
        {
          title: "Inspections are completed in isolation",
          icon: "Boxes",
          body: "A rack, vehicle or process can pass its own check while the way they interact still creates exposure.",
        },
        {
          title: "Procedures differ from the work actually performed",
          icon: "ClipboardList",
          body: "Documents describe the intended process; field observation reveals shortcuts, constraints and informal workarounds.",
        },
        {
          title: "Management receives summaries instead of source evidence",
          icon: "FileText",
          body: "Findings pass through reports and presentations, losing location, condition and operational context.",
        },
        {
          title: "Actions are assigned but closure is not verified",
          icon: "CircleCheck",
          body: "A completed status is not the same as the risk being physically removed or the process working better.",
        },
        {
          title: "Safety and productivity are treated as competing goals",
          icon: "Scale",
          body: "Uncontrolled speed, congestion and poor sequencing can increase both exposure and operational loss.",
        },
      ],
    },
    {
      kind: "grid",
      eyebrow: "Assessment scope",
      top: "One assessment across",
      bottom: "The operating system.",
      body: "RAMS defines the review boundary around the facility, shifts, processes, equipment, people interfaces and decisions the customer needs to make.",
      note: "The final scope, legal basis, standards and sampling window are agreed for the site, jurisdiction and operation.",
      cols: 4,
      items: [
        {
          title: "Governance & ownership",
          body: "Roles, inspection programmes, permits, escalation, training, records and corrective-action control.",
        },
        {
          title: "People & MHE interface",
          body: "Segregation, crossings, visibility, reversing, speed control, blind spots and behavioural conditions.",
        },
        {
          title: "Traffic & material flow",
          body: "Routes, turns, queues, staging, loading, unloading, congestion and conflicting movements.",
        },
        {
          title: "Racks & storage",
          body: "Damage, configuration, loading, clearances, protection, housekeeping and inspection management.",
        },
        {
          title: "Docks & yards",
          body: "Vehicle interface, edge protection, restraint, reversing, pedestrian control and communication.",
        },
        {
          title: "MHE condition & use",
          body: "Pre-use checks, access control, defects, maintenance, charging, parking and task suitability.",
        },
        {
          title: "Manual tasks & access",
          body: "Manual handling, work at height, ladders, platforms, reach, lifting aids and task ergonomics.",
        },
        {
          title: "Fire & emergency readiness",
          body: "Access, exits, equipment visibility, emergency routes, isolation and response arrangements.",
        },
        {
          title: "Inventory & location control",
          body: "Identification, quarantine, staging, obstruction, mislocation and process exceptions affecting flow.",
        },
        {
          title: "Housekeeping & condition",
          body: "Spillage, floor condition, obstructions, waste, lighting, signage and environmental constraints.",
        },
        {
          title: "Process performance",
          body: "Handoffs, task delay, rework, searching, duplicated movement and avoidable operational variation.",
        },
        {
          title: "Management visibility",
          body: "KPIs, evidence quality, site comparison, action ageing, escalation and access to physical context.",
        },
      ],
    },
    {
      kind: "process",
      eyebrow: "How it works",
      top: "From site reality",
      bottom: "To verified improvement.",
      body: "The process protects evidence, separates observation from conclusion and keeps every action connected to a real place, owner and closure test.",
      steps: [
        {
          n: "01",
          title: "Define",
          body: "Agree scope, shifts, standards, decisions and evidence needs.",
        },
        {
          n: "02",
          title: "Observe",
          body: "Walk the flow and see tasks under actual conditions.",
        },
        {
          n: "03",
          title: "Verify",
          body: "Check assets, controls, records and operational statements.",
        },
        {
          n: "04",
          title: "Map",
          body: "Place risk, loss and context against the physical facility.",
        },
        {
          n: "05",
          title: "Prioritise",
          body: "Rank actions by exposure, impact, confidence and dependency.",
        },
        {
          n: "06",
          title: "Validate",
          body: "Confirm physical closure and measure the changed condition.",
        },
      ],
    },
    {
      kind: "lens",
      eyebrow: "Finding status",
      top: "Separate urgency",
      bottom: "From importance.",
      body: "A finding may require immediate isolation, planned correction, monitoring or confirmation through further evidence. RAMS records both the safety status and the operational consequence.",
      note: "Illustrative only. Classification criteria, response times and acceptance basis are defined for the agreed assessment.",
      items: [
        {
          tone: "red",
          title: "Immediate exposure",
          body: "Isolate, stop, restrict or introduce an interim control according to the competent site authority.",
        },
        {
          tone: "amber",
          title: "Planned action",
          body: "Assign owner, required measure, evidence and due date.",
        },
        {
          tone: "green",
          title: "Verified control",
          body: "Preserve the effective condition and defined inspection frequency.",
        },
        {
          tone: "neutral",
          title: "Evidence gap",
          body: "Gather records, measurement, testing or operational observation before conclusion.",
        },
      ],
    },
    {
      kind: "grid",
      eyebrow: "Evidence method",
      top: "Do not audit",
      bottom: "The paperwork alone.",
      body: "RAMS combines field reality, controlled records and operational behaviour so recommendations respond to why a condition exists — not only what was seen.",
      items: [
        {
          title: "Physical observation",
          body: "Zone-by-zone inspection and process walk under representative operating conditions.",
          tags: ["Photographs", "Measurements", "Shift and task context"],
        },
        {
          title: "People and process review",
          body: "Structured discussion with operators, supervisors, EHS, maintenance and warehouse leadership.",
          tags: ["Expected vs actual", "Workarounds", "Ownership"],
        },
        {
          title: "Document verification",
          body: "Check whether procedures, inspection records, training, maintenance and actions match site reality.",
          tags: ["Controlled documents", "Evidence completeness", "Closure"],
        },
        {
          title: "Operational data",
          body: "Use approved WMS, ERP, MHE, maintenance or safety data where it strengthens the assessment.",
          tags: ["Tasks", "Downtime and events", "Shift comparison"],
        },
        {
          title: "Spatial mapping",
          body: "Connect findings to aisles, racks, docks, routes, machines and operating zones.",
          tags: [
            "Risk concentration",
            "Movement conflict",
            "Recurring locations",
          ],
        },
        {
          title: "Supported sensing",
          body: "Where included, use agreed movement, impact, location or vision inputs to extend observation.",
          tags: ["Defined period", "Stated confidence", "Human review"],
        },
      ],
    },
    {
      kind: "grid",
      eyebrow: "When to assess",
      top: "Use the assessment when the",
      bottom: "Warehouse needs one truth.",
      items: [
        {
          title: "New-site readiness",
          body: "Review operating routes, storage, docks, equipment and controls before or during ramp-up.",
        },
        {
          title: "Existing-site improvement",
          body: "Identify recurring exposure, congestion, task loss and control gaps in a live operation.",
        },
        {
          title: "Multi-site standardisation",
          body: "Apply one assessment structure across locations while recording site-specific context.",
        },
        {
          title: "Customer or leadership review",
          body: "Provide direct evidence of condition, ownership, action and verified closure.",
        },
        {
          title: "Post-incident learning",
          body: "Review the operating system around an event without replacing a formal incident investigation.",
        },
        {
          title: "Change validation",
          body: "Assess the effect of revised layout, routes, staging, equipment or work rules after implementation.",
        },
      ],
    },
    {
      kind: "deliverables",
      eyebrow: "Deliverables",
      top: "A prioritised warehouse",
      bottom: "Improvement package.",
      body: "The output is structured for EHS, warehouse operations, maintenance, engineering and management — not only for the audit file.",
      items: [
        {
          title: "Scope & assessment basis",
          body: "Sites, shifts, domains, standards and exclusions.",
        },
        {
          title: "Warehouse condition map",
          body: "Findings linked to location and physical context.",
        },
        {
          title: "Risk & control register",
          body: "Status, exposure, interim controls and evidence.",
        },
        {
          title: "Operational loss map",
          body: "Queues, conflict, rework, delay and movement gaps.",
        },
        {
          title: "Root-cause analysis",
          body: "Asset, process, layout, people and governance causes.",
        },
        {
          title: "Prioritised action plan",
          body: "Owner, due date, dependency and required measure.",
        },
        {
          title: "Management dashboard",
          body: "Domain, site, severity, ageing and closure views.",
        },
        {
          title: "Closure & validation plan",
          body: "Evidence and field checks required to confirm change.",
        },
      ],
      callout: {
        title: "One roadmap across safety and operations",
        body: "Leaders can see which problems need immediate control, which need engineering or process action, and which require more evidence.",
      },
    },
    {
      kind: "grid",
      eyebrow: "Standards",
      top: "Relevant standards. Stated scope.",
      bottom: "No generic compliance badge.",
      body: "RAMS confirms the applicable legal, client and technical basis for each assignment and records where specialist review is required.",
      note: "References do not imply universal certification. The assessment report states the exact documents, editions, assumptions, limitations and responsible parties used for the assignment.",
      items: [
        {
          title: "Applicable local statutory and EHS requirements",
          body: "Selected for the jurisdiction, facility, activity and customer obligations.",
        },
        {
          title: "Corporate standards and operating procedures",
          body: "Reviewed against implementation and physical evidence on site.",
        },
        {
          title: "Storage equipment application and maintenance",
          body: "Used where relevant to rack inspection management and condition control.",
        },
        {
          title: "Warehousing and storage safety guidance",
          body: "A reference covering common warehouse risks and management practice.",
        },
        {
          title: "Comparative international references",
          body: "Applied only where relevant to the agreed jurisdiction or comparative review.",
        },
        {
          title: "Manufacturer limits and approved operating methods",
          body: "Equipment, loading, inspection, maintenance and use requirements.",
        },
      ],
    },
    {
      kind: "faq",
      eyebrow: "Questions",
      top: "What teams ask",
      bottom: "Before the review.",
      body: "Scope and duration depend on site size, shifts, operating variability, available evidence and the decisions required.",
      items: [
        {
          title: "Is this only a safety audit?",
          body: "No. The assessment reviews safety and operational performance together. It examines asset condition, people–vehicle interaction, material flow, tasks, maintenance, governance, evidence and closure so teams can see where safety exposure and operating loss share the same cause.",
        },
        {
          title: "Can the warehouse remain operational during the assessment?",
          body: "Usually, yes. Observing representative work is important. RAMS agrees access, PPE, escorts, exclusion zones and non-disruptive methods with the site. Any unsafe condition requiring immediate control is escalated through the authorised site process.",
        },
        {
          title: "Does the assessment certify the whole warehouse?",
          body: "No. It provides a scoped assessment and action plan. Asset-specific, fire, statutory, electrical, structural or equipment certification requires the applicable competent discipline and evidence. Where separate RAMS verification services are included, their scope and conclusion are stated independently.",
        },
        {
          title: "How are urgent findings handled?",
          body: "Immediate-risk observations are communicated promptly to the authorised site representative. RAMS records the location, evidence and recommended control, while the customer retains operational authority for isolation, work stoppage and site response.",
        },
        {
          title: "Can RAMS review more than one site?",
          body: "Yes. A common assessment structure can be applied across sites, with local context, scope and evidence preserved. AIMS can support management comparison of risk, action ageing, closure and recurring patterns where the platform continuation is included.",
        },
        {
          title: "What happens after the report?",
          body: "The action register identifies priorities, owners, dependencies, target dates and closure evidence. RAMS can support specialist inspection, engineering, training, rectification planning, reinspection and validation where separately agreed.",
        },
      ],
    },
  ],
  cta: {
    top: "See the operation as it is.",
    bottom: "Improve it as one system.",
    body: "Share your site, warehouse type, shifts and primary concerns. RAMS will define the assessment boundary, evidence method and decision-ready output.",
  },
};

/* ── 06 deployment and support ────────────────────────────────────── */

const DEPLOYMENT_SUPPORT: Service = {
  slug: "deployment-support",
  code: "DS",
  name: "Deployment and Support",
  eyebrow: "Deployment & Support",
  h1: ["Implementation, training", "and managed support."],
  intro:
    "The platform is only as good as the rollout behind it. We stand up your digital twin, train your people, and keep it running long after go-live.",
  chips: ["Weeks to go live", "Trained teams", "Support after launch"],
  action: "Talk to the team",
  meta: "Implementation, training and managed support for the RAMS platform: we stand up your digital twin, train your people, and keep it running long after go-live.",
  assurances: [
    {
      title: "Implementation",
      body: "We stand the platform up on your site and hand over a working digital twin.",
    },
    {
      title: "Training",
      body: "Your team leaves able to run it — not dependent on us.",
    },
    {
      title: "Managed support",
      body: "Help when you need it, and eyes on the twin when you don't.",
    },
    {
      title: "Handover",
      body: "A working digital twin, handed over — not a login and good luck.",
    },
  ],
  sections: [
    {
      kind: "modes",
      eyebrow: "What's included",
      top: "Three things that",
      bottom: "Make a rollout land.",
      items: [
        {
          title: "Implementation",
          icon: "Wrench",
          body: "We stand the platform up on your site and hand over a working digital twin.",
          tags: [
            "Scan or model the facility",
            "Tag assets & build the registry",
            "Connect sensors & systems",
            "Configure dashboards & apps",
          ],
        },
        {
          title: "Training",
          icon: "GraduationCap",
          body: "Your team leaves able to run it — not dependent on us.",
          tags: [
            "Admins, safety leads & floor teams",
            "On-site & remote sessions",
            "Inspector enablement",
            "Certification & refreshers",
          ],
        },
        {
          title: "Managed support",
          icon: "LifeBuoy",
          body: "Help when you need it, and eyes on the twin when you don't.",
          tags: [
            "Helpdesk & priority response",
            "Proactive monitoring",
            "Health checks & updates",
            "Re-inspection scheduling",
          ],
        },
      ],
    },
    {
      kind: "process",
      eyebrow: "Implementation",
      top: "From kickoff",
      bottom: "To go-live.",
      body: "A working digital twin, handed over — not a login and good luck.",
      steps: [
        {
          n: "01",
          title: "Scope",
          body: "Agree sites, systems and success criteria.",
        },
        {
          n: "02",
          title: "Scan & model",
          body: "Capture the facility and stand up the base twin.",
        },
        {
          n: "03",
          title: "Tag & connect",
          body: "Build the asset registry; wire in sensors and systems.",
        },
        {
          n: "04",
          title: "Go live",
          body: "Switch on dashboards, applications and alerts.",
        },
        {
          n: "05",
          title: "Hand over",
          body: "Train the team and move into managed support.",
        },
      ],
    },
    {
      kind: "grid",
      eyebrow: "Training",
      top: "Your team,",
      bottom: "Ready to run it.",
      body: "We train every role that touches the platform, and certify them.",
      cols: 3,
      items: [
        {
          title: "Administrators",
          body: "Configuration, users, permissions and the day-to-day running of the platform.",
        },
        {
          title: "Safety leads",
          body: "Inspection programmes, findings, corrective actions and closure evidence.",
        },
        {
          title: "Floor teams",
          body: "The applications and devices used at the rack, dock and vehicle.",
        },
        {
          title: "Inspectors",
          body: "Enablement for the people carrying out and recording inspections.",
        },
        {
          title: "Certification",
          body: "Sessions conclude with certification, and refreshers are available afterwards.",
        },
        {
          title: "Materials & docs",
          body: "Documentation and self-serve material your team keeps after handover.",
        },
      ],
    },
    {
      kind: "grid",
      eyebrow: "Managed support",
      top: "Looked after,",
      bottom: "Long after launch.",
      body: "Help when you need it, and monitoring when you don't.",
      items: [
        {
          title: "Helpdesk",
          body: "A route to the team when something needs answering or fixing.",
        },
        {
          title: "Proactive monitoring",
          body: "Eyes on the twin between the moments you are looking at it.",
        },
        {
          title: "Updates",
          body: "Product updates applied as they are released.",
        },
        {
          title: "Health checks",
          body: "Scheduled reviews of the deployment, data and configuration.",
        },
        {
          title: "Re-inspection scheduling",
          body: "Keep the inspection programme running to its intervals.",
        },
        {
          title: "Account manager",
          body: "A named contact who knows your sites and your rollout.",
        },
      ],
    },
    {
      kind: "modes",
      eyebrow: "Support plans",
      top: "Pick the level",
      bottom: "Of cover.",
      note: "Plan names and inclusions are indicative; support levels and SLAs are agreed per engagement.",
      items: [
        {
          title: "Essential",
          icon: "Layers",
          body: "For teams running RAMS themselves.",
          tags: [
            "Portal & documentation",
            "Product updates",
            "Email support",
            "Self-serve training",
          ],
        },
        {
          title: "Priority",
          icon: "ShieldAlert",
          body: "For sites that want a safety net.",
          tags: [
            "Everything in Essential, plus",
            "Priority response",
            "Named contact",
            "Scheduled health checks",
            "Re-inspection reminders",
          ],
        },
        {
          title: "Fully managed",
          icon: "LifeBuoy",
          body: "For estates that want it run for them.",
          tags: [
            "Everything in Priority, plus",
            "Proactive twin monitoring",
            "Managed re-inspections",
            "On-site support days",
            "Quarterly reviews",
          ],
        },
      ],
    },
    {
      kind: "faq",
      eyebrow: "Questions",
      top: "Common questions",
      bottom: "About the rollout.",
      items: [
        {
          title: "How long does implementation take?",
          body: "Typically a few weeks from kickoff to go-live, scaling with site size and scope. We scan or model the facility, tag assets, connect systems and configure the platform before handing over.",
        },
        {
          title: "Do you train our team?",
          body: "Yes — administrators, safety leads, floor teams and inspectors, on-site and remotely, with certification and refreshers. The goal is for you to run it confidently, not depend on us.",
        },
        {
          title: "What does managed support include?",
          body: "A helpdesk with priority response, proactive monitoring of the twin, product updates, regular health checks, re-inspection scheduling and a named account manager — scaled to your plan.",
        },
        {
          title: "Do you offer SLAs?",
          body: "Yes. Response commitments depend on the plan — Priority and Fully-managed carry faster response and proactive monitoring. We agree the specifics with you up front.",
        },
        {
          title: "Can you support multiple sites?",
          body: "Yes. We roll out with a repeatable playbook and, with AIMS, manage condition and support across every site from one place.",
        },
      ],
    },
  ],
  cta: {
    top: "Deployed properly.",
    bottom: "Supported for good.",
    body: "Tell us about your sites and team, and we'll shape a rollout and support plan that fits.",
  },
};

/* ── the six, and the lookup ──────────────────────────────────────── */

export const SERVICES: Service[] = [
  RACK_INSPECTION,
  STRUCTURAL_VERIFICATION,
  INVENTORY_AUDIT,
  MHE_PRODUCTIVITY,
  OPERATIONAL_ASSESSMENT,
  DEPLOYMENT_SUPPORT,
];

/** Slug → service. Derived, so a seventh service needs no second edit. */
export const SERVICE_BY_SLUG: Record<string, Service> = Object.fromEntries(
  SERVICES.map((s) => [s.slug, s]),
);
