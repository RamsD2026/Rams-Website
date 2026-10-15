/**
 * The job openings on /company/careers.
 *
 * ── Only real, approved openings go in `JOBS` ───────────────────────
 * RAMS's careers document lists career areas, not vacancies, and an opening
 * on this page is something a candidate will plan around. So `JOBS` starts
 * empty and the board says "No open roles right now" until a role is added
 * here — one object per opening, in the shape below.
 *
 * `SAMPLE_JOBS` exist only so the board, filters, save and apply flow can be
 * tried before real roles exist. They are labelled "Sample" in the UI and are
 * shown ONLY on a Vercel *preview* build (`NEXT_PUBLIC_VERCEL_ENV` is
 * "preview" — every push to `main` gets one) or when the build sets
 * `NEXT_PUBLIC_SHOW_SAMPLE_JOBS=true`. Production (`master`) never shows them.
 * With real roles in `JOBS`, samples are ignored entirely.
 */

/** A career-family code from `careers-data` (`FAMILIES`). */
export type FamilyCode = "PD" | "SE" | "DA" | "HE" | "FE" | "CS" | "GP" | "MB" | "OP";

export type Job = {
  /** Stable id, used in the save list and the application email. */
  id: string;
  title: string;
  family: FamilyCode;
  /** e.g. "Pune, India". */
  location: string;
  /** e.g. "Full-time", "Contract", "Internship". */
  type: string;
  /** e.g. "On-site", "Hybrid", "Field-based". */
  mode: string;
  /** e.g. "3–5 years". Optional. */
  experience?: string;
  /** ISO date the role was posted, e.g. "2026-10-14". */
  posted: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
  /** Set by the sample list only. */
  sample?: boolean;
};

/** Real, approved openings. Add roles here. */
export const JOBS: Job[] = [];

const SAMPLE_JOBS: Job[] = [
  {
    id: "sample-fullstack-twin",
    title: "Full-stack Engineer — Digital Twin",
    family: "SE",
    location: "Pune, India",
    type: "Full-time",
    mode: "Hybrid",
    experience: "3–5 years",
    posted: "2026-10-01",
    summary:
      "Build the applications and services that read from and write to the RAMS Digital Twin — the persistent model of a facility that every module works on.",
    responsibilities: [
      "Build user-facing workflows for facility, asset, inspection and event data",
      "Design services and integrations that keep the twin consistent across modules",
      "Turn field feedback from inspectors and supervisors into product improvements",
      "Write well-tested, observable code and take part in code review",
      "Work with product, design and field teams on real site workflows",
    ],
    requirements: [
      "Experience with a modern frontend framework and a typed backend language",
      "Comfort designing data models, APIs and database schemas",
      "A habit of shipping small, testable increments",
      "Clear written communication",
    ],
    niceToHave: [
      "Experience with spatial, IoT or time-series data",
      "Interest in warehouses, manufacturing or other physical operations",
    ],
    sample: true,
  },
  {
    id: "sample-rack-inspector",
    title: "Rack Inspection Engineer",
    family: "FE",
    location: "Pune, India",
    type: "Full-time",
    mode: "Field-based",
    experience: "2+ years",
    posted: "2026-09-26",
    summary:
      "Carry out structured rack inspections on customer sites and bring site reality into the platform, so findings become owned, verified actions.",
    responsibilities: [
      "Inspect storage racking against the configured checklist and applicable standard",
      "Capture measurements and photo evidence in the RAMS field app",
      "Classify findings and support rectification and verification with customers",
      "Feed field observations back to the product and engineering teams",
      "Help train customer teams on day-to-day rack safety checks",
    ],
    requirements: [
      "A background in structural, mechanical or civil engineering",
      "Comfort working at height and on live warehouse sites",
      "Willingness to travel to customer sites",
      "Attention to detail and clear reporting",
    ],
    niceToHave: [
      "Familiarity with EN 15635 or similar racking standards",
      "Experience with inspection or maintenance software",
    ],
    sample: true,
  },
  {
    id: "sample-cv-engineer",
    title: "Computer Vision Engineer",
    family: "HE",
    location: "Pune, India",
    type: "Full-time",
    mode: "On-site",
    experience: "2–4 years",
    posted: "2026-09-18",
    summary:
      "Turn camera and sensor data into reliable events on the warehouse floor — people, pallets and MHE, detected and placed in context.",
    responsibilities: [
      "Develop and evaluate detection models for people, pallets and material handling equipment",
      "Optimise models to run on edge hardware close to the event",
      "Validate behaviour in live operating environments and tune for real conditions",
      "Work with platform engineers to turn detections into contextual events",
    ],
    requirements: [
      "Experience training and deploying vision models",
      "Python and at least one deep-learning framework",
      "Understanding of evaluation metrics and dataset quality",
    ],
    niceToHave: [
      "Experience with edge deployment (quantisation, accelerators)",
      "Experience with multi-camera or tracking problems",
    ],
    sample: true,
  },
  {
    id: "sample-product-designer",
    title: "Product Designer",
    family: "PD",
    location: "Pune, India",
    type: "Full-time",
    mode: "Hybrid",
    experience: "3+ years",
    posted: "2026-09-10",
    summary:
      "Design interfaces that work from the warehouse floor to management review — mobile field tools, web consoles and the Digital Twin.",
    responsibilities: [
      "Design end-to-end workflows for mobile field tools and web consoles",
      "Run research with inspectors, supervisors and managers on real sites",
      "Prototype, test and iterate with engineering",
      "Contribute to and maintain the product's design system",
    ],
    requirements: [
      "A portfolio of shipped product work",
      "Experience designing complex, data-rich tools",
      "Comfort presenting and defending design decisions",
    ],
    niceToHave: [
      "Experience designing for tablets or noisy, time-pressured environments",
    ],
    sample: true,
  },
  {
    id: "sample-data-analyst",
    title: "Data Analyst — Operational Intelligence",
    family: "DA",
    location: "Pune, India",
    type: "Full-time",
    mode: "Hybrid",
    experience: "1–3 years",
    posted: "2026-09-05",
    summary:
      "Turn events, movement and inspection history into insight that helps customers improve safety, productivity and visibility across sites.",
    responsibilities: [
      "Analyse operational data across modules and sites",
      "Build and maintain dashboards and recurring reports",
      "Work with customer success to turn findings into recommended actions",
      "Help define the metrics that management intelligence reports on",
    ],
    requirements: [
      "Strong SQL and experience with a BI or notebook tool",
      "Ability to explain findings clearly to non-technical audiences",
      "Care for data quality and definitions",
    ],
    niceToHave: ["Python for analysis", "Experience with operations or logistics data"],
    sample: true,
  },
  {
    id: "sample-customer-success",
    title: "Customer Success Manager",
    family: "CS",
    location: "Pune, India",
    type: "Full-time",
    mode: "Hybrid",
    experience: "3+ years",
    posted: "2026-08-28",
    summary:
      "Guide customers from implementation to measurable operational outcomes, and bring what you learn on site back into the product.",
    responsibilities: [
      "Lead onboarding and adoption for new customer sites",
      "Run regular reviews of outcomes with customer stakeholders",
      "Coordinate training, support and field teams",
      "Capture customer needs and feed them to product",
    ],
    requirements: [
      "Experience in customer success, account management or implementation for B2B software",
      "Comfort with operational and technical conversations",
      "Willingness to visit customer sites",
    ],
    niceToHave: ["Background in warehousing, logistics or manufacturing"],
    sample: true,
  },
];

/** The roles the board shows: real ones, or samples only where enabled. */
export function listedJobs(): Job[] {
  if (JOBS.length > 0) return JOBS;
  const samples =
    process.env.NEXT_PUBLIC_SHOW_SAMPLE_JOBS === "true" ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";
  return samples ? SAMPLE_JOBS : [];
}

/** One listed role by id, or undefined. */
export function getJob(id: string): Job | undefined {
  return listedJobs().find((j) => j.id === id);
}
