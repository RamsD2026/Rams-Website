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
      "Build the applications and services that read from and write to the RAMS Digital Twin.",
    responsibilities: [
      "Build user-facing workflows for facility, asset and event data",
      "Design services and integrations that keep the twin consistent",
      "Work with field and product teams on real site workflows",
    ],
    requirements: [
      "Experience with a modern frontend framework and a typed backend",
      "Comfort designing data models and APIs",
      "Interest in physical operations",
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
      "Carry out structured rack inspections and bring site reality into the platform.",
    responsibilities: [
      "Inspect racking against the configured checklist and standard",
      "Capture measurements and photo evidence in the field app",
      "Classify findings and support rectification and verification",
    ],
    requirements: [
      "Background in structural, mechanical or civil engineering",
      "Comfort working at height and on live sites",
      "Willingness to travel to customer sites",
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
    posted: "2026-09-18",
    summary:
      "Turn camera and sensor data into reliable events on the warehouse floor.",
    responsibilities: [
      "Develop and evaluate detection models for people, pallets and MHE",
      "Optimise models for edge hardware",
      "Validate behaviour in live operating environments",
    ],
    requirements: [
      "Experience training and deploying vision models",
      "Python and at least one deep-learning framework",
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
    posted: "2026-09-10",
    summary:
      "Design interfaces that work from the warehouse floor to management review.",
    responsibilities: [
      "Design workflows for mobile field tools and web consoles",
      "Run research with inspectors, supervisors and managers",
    ],
    requirements: [
      "A portfolio of shipped product work",
      "Experience designing for complex, data-rich tools",
    ],
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
