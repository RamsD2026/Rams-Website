/**
 * The careers page copy, from RAMS's own `RAMS_Digital_Careers.html`.
 *
 * ── It lists career areas, not vacancies ────────────────────────────
 * The source is explicit and every page that reads this keeps it so: "These
 * are career areas, not a guarantee that every role is currently open."
 * There are no job listings here and none should be invented. Applying is a
 * profile sent to hr@rams.digital, with the two subjects the source uses.
 *
 * The layout borrows its order from DXC's careers page — a hero with a
 * search, categories to explore, a talent-network band, an "about us" row —
 * but DXC's job search becomes a search over these career areas, and its
 * employee stories are not imitated: nobody here is quoted.
 *
 * One change from the source: its module list says IROS, the inventory
 * module's earlier name. The site calls it IBIS, so this does too.
 */

export const CAREERS_EMAIL = "hr@rams.digital";

/** Window event the page's bands fire to open a general application. */
export const APPLY_EVENT = "rams:careers-apply";
export const PROFILE_MAILTO = `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent("Career Opportunity at RAMS Digital")}`;
export const OPENINGS_MAILTO = `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent("Current Openings at RAMS Digital")}`;

export const HERO_CHIPS = [
  "Physical-world impact",
  "Cross-disciplinary teams",
  "Field-to-product learning",
];

/* ── career areas ─────────────────────────────────────────────────── */

export type GroupId = "build" | "product" | "field" | "customer";

/** The four photo tiles. Each filters the families below to its own set. */
export const GROUPS: {
  id: GroupId;
  title: string;
  body: string;
  img: string;
  alt: string;
}[] = [
  {
    id: "build",
    title: "Technology",
    body: "Software, data, AI, hardware and edge.",
    img: "/about/team/technologists.webp",
    alt: "Over-the-shoulder view of a software engineer at a two-monitor workstation",
  },
  {
    id: "product",
    title: "Product & Design",
    body: "Workflows from the warehouse floor to management review.",
    img: "/about/team/engineers.webp",
    alt: "Two people at a site table studying a large printed drawing of steel racking",
  },
  {
    id: "field",
    title: "Field & Safety",
    body: "Structures, inspection and operational reality.",
    img: "/about/team/field.webp",
    alt: "A specialist in a high-visibility vest on a scissor lift inspecting racking at height",
  },
  {
    id: "customer",
    title: "Customer & Company",
    body: "Delivery, growth, brand, operations and people.",
    img: "/about/team/operations.webp",
    alt: "Three people at a mezzanine railing looking out over a working warehouse floor",
  },
];

export const FAMILIES: {
  code: string;
  title: string;
  body: string;
  tags: string[];
  group: GroupId;
}[] = [
  {
    code: "PD",
    title: "Product & Design",
    body: "Shape workflows across Digital Twin, mobile field tools and management intelligence.",
    tags: ["Product", "UX/UI", "Research"],
    group: "product",
  },
  {
    code: "SE",
    title: "Software Engineering",
    body: "Build secure, scalable applications, services and integrations for physical operations.",
    tags: ["Frontend", "Backend", "Platform"],
    group: "build",
  },
  {
    code: "DA",
    title: "Data, AI & Analytics",
    body: "Turn events, movement, history and physical context into useful decisions.",
    tags: ["Data", "ML", "Analytics"],
    group: "build",
  },
  {
    code: "HE",
    title: "Hardware & Edge",
    body: "Connect sensing, vision and machine data to live operational context.",
    tags: ["IoT", "Embedded", "Vision"],
    group: "build",
  },
  {
    code: "FE",
    title: "Field Engineering & Safety",
    body: "Bring domain competence, structured inspection and site reality into the platform.",
    tags: ["Structures", "Inspection", "Safety"],
    group: "field",
  },
  {
    code: "CS",
    title: "Customer Success & Delivery",
    body: "Guide implementation, adoption and measurable operational outcomes.",
    tags: ["Delivery", "Training", "Success"],
    group: "customer",
  },
  {
    code: "GP",
    title: "Growth & Partnerships",
    body: "Develop markets and partnerships through credible, problem-led conversations.",
    tags: ["Sales", "BD", "Partners"],
    group: "customer",
  },
  {
    code: "MB",
    title: "Marketing & Brand",
    body: "Make complex physical-technology stories understandable and commercially relevant.",
    tags: ["Content", "Design", "Growth"],
    group: "customer",
  },
  {
    code: "OP",
    title: "Operations & People",
    body: "Build the systems that help a multidisciplinary company execute consistently.",
    tags: ["Operations", "People", "Finance"],
    group: "customer",
  },
];

/* ── why RAMS ─────────────────────────────────────────────────────── */

export const MISSION: { n: string; verb: string; title: string; body: string }[] = [
  { n: "01", verb: "See", title: "Make the operation visible.", body: "Connect assets, places, movement and events in their physical context." },
  { n: "02", verb: "Understand", title: "Turn records into intelligence.", body: "Combine history, live data and domain knowledge to explain what matters." },
  { n: "03", verb: "Act", title: "Close the loop.", body: "Move from alerts and observations to owners, actions and verification." },
  { n: "04", verb: "Improve", title: "Learn across sites.", body: "Help organisations improve safety, productivity, efficiency and visibility." },
];

export const TODAY = [
  "Site conditions explained through static reports",
  "Asset histories separated across tools and teams",
  "Safety, productivity and maintenance viewed in isolation",
  "Decisions made without a live view of the site",
];

export const TOWARD = [
  "A living Digital Twin of the physical environment",
  "Tagged assets with lifecycle history",
  "Connected modules, sensors and business systems",
  "Management visibility without losing field detail",
];

/* ── how teams work ───────────────────────────────────────────────── */

export const DISCIPLINES: { title: string; body: string }[] = [
  { title: "Product & Design", body: "Workflow, usability and product direction" },
  { title: "Software & Data", body: "Platforms, integrations, analytics and AI" },
  { title: "Hardware & Edge", body: "Sensing, vision, telemetry and devices" },
  { title: "Field Engineering", body: "Inspection, structures and operational reality" },
];

export const OUTCOMES: { title: string; body: string }[] = [
  { title: "Safety", body: "Reduce physical operational risk." },
  { title: "Productivity", body: "Understand how work is produced." },
  { title: "Efficiency", body: "Find wasted time and resources." },
  { title: "Visibility", body: "See the operation directly." },
];

/** Top of the stack first, as the source draws it. */
export const STACK: { n: string; title: string; body: string }[] = [
  { n: "05", title: "Management intelligence", body: "Cross-module, multi-site decisions" },
  { n: "04", title: "Operational applications", body: "Safety, productivity, inventory and maintenance" },
  { n: "03", title: "AI & analytics", body: "Patterns, spatial context and decision support" },
  { n: "02", title: "Edge & IoT", body: "Sensors, vision, machines and live events" },
  { n: "01", title: "Digital Twin", body: "Geometry, assets, lifecycle and history" },
];

export const MODULE_CHIPS = ["Digital Twin", "IRDS", "MEPS", "RTSS", "IBIS", "IMDS", "ATOS", "AIMS"];

/* ── how we work ──────────────────────────────────────────────────── */

export const LOOP: { title: string; body: string }[] = [
  { title: "Observe", body: "Understand the actual site, task and constraint." },
  { title: "Frame", body: "Define the problem and a measurable outcome." },
  { title: "Build", body: "Create the workflow, model, hardware or integration." },
  { title: "Deploy", body: "Introduce it within a live operating environment." },
  { title: "Learn", body: "Compare expected behaviour with real use." },
  { title: "Improve", body: "Strengthen the product and repeat the cycle." },
];

export const PRINCIPLES: { n: string; title: string; body: string }[] = [
  { n: "01", title: "Go to the source", body: "Understand the real workflow before simplifying it into a feature or report." },
  { n: "02", title: "Respect physical risk", body: "Treat safety and engineering claims with the precision they deserve." },
  { n: "03", title: "Make evidence visible", body: "Connect decisions to data, context, owners and verifiable actions." },
  { n: "04", title: "Own the complete loop", body: "Success is not an alert; it is a problem understood and responsibly closed." },
  { n: "05", title: "Design for the field", body: "Build for time pressure, noisy environments and different levels of technical confidence." },
  { n: "06", title: "Learn across disciplines", body: "Invite engineering, product, field and customer perspectives into the solution." },
];

export const GROWTH: { title: string; body: string }[] = [
  { title: "Learn the domain", body: "Understand the assets, standards and workflows behind the product." },
  { title: "Deepen your craft", body: "Apply your discipline to a technically and operationally demanding problem." },
  { title: "Build customer judgment", body: "See how adoption, constraints and business value shape good solutions." },
  { title: "Expand ownership", body: "Take responsibility for larger outcomes as capability and trust grow." },
];

/* ── hiring ───────────────────────────────────────────────────────── */

export const JOURNEY: { title: string; body: string }[] = [
  { title: "Share", body: "Send your profile, work samples and the area where you can contribute." },
  { title: "Connect", body: "Discuss your interests, experience and the available opportunity." },
  { title: "Explore", body: "Meet relevant team members and understand the real problem space." },
  { title: "Demonstrate", body: "Complete a role-relevant discussion or practical assessment where needed." },
  { title: "Align", body: "Confirm role scope, location, expectations and terms before joining." },
];

export const TRANSPARENCY: { title: string; body: string }[] = [
  { title: "Role scope", body: "Responsibilities, ownership and expected outcomes." },
  { title: "Work pattern", body: "Office, hybrid, customer-site and travel expectations." },
  { title: "Selection process", body: "Interview stages and any role-relevant assessment." },
  { title: "Employment terms", body: "Location, reporting, joining expectations and applicable benefits." },
];

export const FAQS: { q: string; a: string }[] = [
  {
    q: "Are all career areas shown currently hiring?",
    a: "No. They show the kinds of capabilities RAMS Digital may recruit as the company grows. Contact the team to confirm current vacancies and role details.",
  },
  {
    q: "Can I share my profile if there is no exact vacancy?",
    a: "Yes. Send your profile, portfolio or relevant work samples along with a short note explaining the problems you are interested in solving.",
  },
  {
    q: "Are roles remote, hybrid or office-based?",
    a: "Working arrangements depend on the role. Field, customer and hardware positions may require site work or travel, while other roles may follow different arrangements. Confirm the exact expectation during the role discussion.",
  },
  {
    q: "Do I need warehouse-industry experience?",
    a: "Not for every role. Domain experience is valuable for some field and safety positions, while technology, design, data and growth candidates may bring transferable expertise and learn the operating context.",
  },
  {
    q: "Will there be a practical assessment?",
    a: "Some roles may include a practical, portfolio or case discussion relevant to the actual work. The expected process should be explained before the assessment.",
  },
  {
    q: "Where is RAMS Digital based?",
    a: "RAMS Digital publishes its office address in Baner, Pune. Specific role locations and travel requirements should be confirmed for each opportunity.",
  },
];
