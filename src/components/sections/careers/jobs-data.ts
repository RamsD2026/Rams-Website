/**
 * The job openings on /company/careers.
 *
 * ── Only real, approved openings go in `JOBS` ───────────────────────
 * An opening on this page is something a candidate will plan around, so
 * only roles RAMS is hiring for belong here — one object per opening, in the
 * shape below. With `JOBS` empty the board says "No open roles right now".
 *
 * ── Until then, the board shows labelled samples ────────────────────
 * If `JOBS` is empty and `SAMPLE_JOBS` is not, the board shows the samples
 * on every build, including production, so the page can be
 * seen working. They are never presented as vacancies: every card and job
 * page carries a "Sample" tag, the board opens with a banner saying they are
 * example roles and not open vacancies, their apply action is "Join the
 * talent network" (a general application, not an application to the role),
 * and their job pages are noindex.
 *
 * The moment one real role is added to `JOBS`, the samples, the banner and
 * the talent-network substitution all disappear.
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
  /** One or two sentences: the hero line and the board card. */
  summary: string;
  /** Longer "About the role" paragraphs; falls back to `summary`. */
  about?: string[];
  /** Extra facts for the role summary card, e.g. stipend or duration. */
  details?: { label: string; value: string }[];
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
  /** Tools and platforms, drawn as chips. */
  tools?: string[];
  /** Further headed sections, each a list or a paragraph. */
  sections?: { title: string; items?: string[]; body?: string }[];
  /** Set by the sample list only. */
  sample?: boolean;
};

/** Real, approved openings. Add roles here. */
export const JOBS: Job[] = [
  {
    id: "business-development-executive",
    title: "Business Development Executive",
    family: "GP",
    location: "Pune, India",
    type: "Full-time",
    mode: "On-site + travel across India",
    experience: "2–4 years",
    posted: "2026-10-16",
    summary:
      "Drive end-to-end B2B business development across India — find prospective customers, generate qualified leads, run product demonstrations and set up meetings for the Sales team.",
    about: [
      "We are looking for an experienced, result-oriented Business Development Executive to drive end-to-end B2B business development across India. The role focuses on identifying prospective customers, generating qualified leads, conducting product demonstrations and scheduling meetings for the Sales team.",
      "You will work primarily from the Pune office, with travel across India for client meetings, industry events and exhibitions.",
    ],
    responsibilities: [
      "Identify and generate qualified B2B leads across India through cold calling, market research, networking, events and exhibitions",
      "Understand prospect requirements and communicate the value proposition of RAMS solutions effectively",
      "Conduct product presentations and demonstrations for prospective clients",
      "Schedule qualified meetings and appointments for the Sales Manager",
      "Maintain consistent follow-ups with prospects and ensure effective lead nurturing",
      "Work closely with the Sales Manager to ensure smooth handover and progression of qualified opportunities",
      "Achieve assigned lead generation, appointment and revenue targets",
      "Maintain accurate records of prospects, opportunities, activities and outcomes",
      "Conduct market research to identify new industries, accounts and business opportunities",
    ],
    requirements: [
      "2–4 years of relevant experience in business development or industrial sales (B2B preferred)",
      "Experience in warehousing/logistics, manufacturing or related sectors preferred",
      "B.Tech/B.E. in Civil or Mechanical Engineering preferred",
      "MBA in Sales/Marketing preferred",
    ],
    sections: [
      {
        title: "How success is measured",
        items: [
          "Qualified leads generated",
          "Meetings and appointments scheduled",
          "Revenue generated from assigned opportunities",
          "Achievement of monthly and quarterly business development targets",
        ],
      },
    ],
  },
  {
    id: "digital-marketing-executive",
    title: "Digital Marketing Executive",
    family: "MB",
    location: "Pune, India",
    type: "Full-time",
    mode: "On-site",
    experience: "1–3 years",
    posted: "2026-10-16",
    summary:
      "Own cross-channel acquisition across search, social, email and content — driving brand awareness, qualified leads and customer engagement.",
    about: [
      "We are seeking a results-driven Digital Marketing Executive to develop, execute and optimise multi-channel performance and brand growth initiatives.",
      "You will take ownership of cross-channel acquisition funnels spanning search, social media, email lifecycle marketing and content strategy to drive brand awareness, qualified lead generation and customer engagement.",
    ],
    details: [
      { label: "Department", value: "Marketing & Growth" },
      { label: "Role type", value: "Individual contributor" },
      { label: "Focus channels", value: "Paid, organic, social & CRM" },
    ],
    responsibilities: [
      "Campaign execution & paid media — plan, launch, monitor and optimise performance campaigns across Google Ads, Meta Ads Manager and LinkedIn Campaign Manager for cost-efficient conversions",
      "SEO & content strategy — run keyword research, optimise web content for search visibility (on-page and technical SEO) and oversee content for the blog and organic channels",
      "Social media management — create, schedule, publish and evaluate engagement-focused content across the primary social platforms to build the brand and its community",
      "Email marketing & automation — design, segment and deploy drip campaigns, recurring newsletters and automated lead-nurturing workflows that move prospects through the funnel",
      "Analytics & performance reporting — track CAC, ROAS, CTR, CPA and conversion rates in Google Analytics 4 and Looker Studio, and deliver actionable weekly and monthly insights",
      "Conversion rate optimisation — run continuous A/B tests on landing pages, calls to action, creative and ad copy to find lift and maximise full-funnel efficiency",
    ],
    requirements: [
      "1–3 years of hands-on digital marketing experience (agency or in-house)",
      "Proficiency with Google Analytics 4, Google Ads, Meta Ads Manager, SEO suites (Semrush/Ahrefs) and CMS platforms (WordPress/HubSpot)",
      "An analytical mindset — able to interpret raw campaign data and turn it into practical optimisation steps",
      "Excellent written communication for persuasive ad copy, email subject lines and engaging social content",
    ],
    niceToHave: [
      "Google Ads / Google Analytics certification, or Meta Certified Digital Marketing Associate / Blueprint",
      "Working knowledge of design and editing tools (Canva, Adobe Photoshop) or video editing suites",
      "Hands-on CRM experience — Zoho CRM highly preferred",
      "A keen interest in emerging digital marketing trends, tracking automation and algorithm shifts",
    ],
    tools: [
      "Google Ads",
      "Meta Ads Manager",
      "LinkedIn Campaign Manager",
      "Google Analytics 4 (GA4)",
      "Looker Studio",
      "Semrush / Ahrefs",
      "WordPress / HubSpot",
      "Zoho CRM",
      "Email drip workflows",
      "A/B testing & CRO",
    ],
  },
  {
    id: "sales-intern-business-development",
    title: "Sales Intern — Business Development",
    family: "GP",
    location: "Pune & Bhiwandi, India",
    type: "Internship",
    mode: "Field-based",
    posted: "2026-10-16",
    summary:
      "A three-month B2B sales internship for MBA students — field visits across Pune and Bhiwandi logistics parks, meeting decision-makers and generating qualified leads for the sales team.",
    about: [
      "We are looking for enthusiastic, confident MBA students specialising in Sales/Marketing who want practical experience in B2B sales and business development.",
      "You will be assigned specific areas across the Pune and Bhiwandi logistics parks, and will be responsible for identifying potential customers, conducting field visits, understanding business requirements and generating qualified leads and appointments for the sales team.",
    ],
    details: [
      { label: "Duration", value: "3 months" },
      { label: "Stipend", value: "₹10,000 per month" },
      { label: "Working days", value: "Monday – Friday" },
      { label: "Working hours", value: "9:00 AM – 6:00 PM" },
    ],
    responsibilities: [
      "Conduct field visits to manufacturing units, warehouses and other relevant business locations within the assigned area",
      "Connect with key decision-makers such as Inventory, Store, Warehouse and Safety Managers",
      "Introduce RAMS Digital and understand the prospect’s basic requirements",
      "Generate qualified leads through field visits and prospecting",
      "Schedule meetings and appointments between qualified prospects and the Business Development/Sales team",
    ],
    requirements: [
      "MBA student specialising in Sales or Marketing",
      "Strong verbal communication and interpersonal skills",
      "Confident and comfortable interacting with business professionals",
      "Willing to travel within and around Pune and Bhiwandi for field visits",
    ],
    sections: [
      {
        title: "What you will gain",
        items: [
          "Hands-on experience in B2B sales and business development",
          "Exposure to manufacturing and warehouse operations — e-commerce giants, FMCG, automobiles and pharma",
          "Experience in field prospecting and lead generation",
          "A potential Pre-Placement Offer (PPO) based on performance",
        ],
      },
      {
        title: "Who should apply",
        body: "This internship is ideal for MBA students who want to move beyond classroom learning and gain practical exposure to B2B sales, field business development and customer acquisition. If you are confident, proactive, comfortable with field visits and enjoy interacting with people, we would love to hear from you.",
      },
    ],
  },
  {
    id: "iot-installation-technician",
    title: "IoT Installation Technician",
    family: "FE",
    location: "Pune, India",
    type: "Full-time",
    mode: "Field-based",
    experience: "1–3 years",
    posted: "2026-10-16",
    summary:
      "Install, mount, wire and test IoT hardware on forklifts, reach trucks, stackers and at industrial sites — so every installation is safe, secure and ready for commissioning.",
    about: [
      "We are looking for an IoT Installation Technician to join our IoT Implementation team. The role involves hands-on installation, mounting, wiring and basic testing of IoT hardware on Material Handling Equipment (MHE) such as forklifts, reach trucks and stackers, as well as at industrial sites.",
      "You will work closely with the IoT Coordinator and Commissioning Engineer to make sure installations are safe, secure, accurate and ready for commissioning.",
    ],
    details: [{ label: "Department", value: "IoT Implementation" }],
    responsibilities: [
      "Install and physically mount IoT devices on forklifts, reach trucks, stackers and other Material Handling Equipment",
      "Fit IoT control boxes/OmniBox, sensors, cameras, LiDAR and other associated hardware",
      "Perform low-voltage electrical wiring, cable routing, termination, crimping and device connections",
      "Identify suitable mounting and cable-routing locations with the IoT Coordinator/Commissioning Engineer",
      "Make sure every device is securely mounted and wiring is properly routed, protected, labelled and finished",
      "Support the Commissioning Engineer during device configuration, testing, calibration and commissioning",
      "Troubleshoot power supply, loose connections, wiring faults and installation-related hardware issues",
      "Follow installation drawings, wiring diagrams, checklists, SOPs and client-site safety procedures",
      "Capture installation photographs and complete the installation checklist for each asset/MHE",
      "Accurately record device serial numbers, asset IDs, MHE identification and other installation details",
      "Maintain accountability for tools, devices, cables, consumables and installation materials",
      "Report site constraints, MHE conditions, safety concerns and installation deviations to the IoT Coordinator",
      "Support replacement, reinstallation, maintenance and field-support activities when required",
    ],
    requirements: [
      "ITI qualification in Electronics Mechanic, Electrician, Electrical/Electronics or a related trade",
      "1–3 years of hands-on experience in IoT installation, automotive electrical work, GPS/telematics, CCTV/camera installation, industrial sensors, machine wiring, forklift/MHE electrical systems or similar field roles",
      "Basic knowledge of DC electrical and low-voltage systems",
      "Hands-on experience with electrical/electronic wiring, termination and crimping",
      "Able to use a multimeter and basic electrical testing tools",
      "Knowledge of cable routing, connectors, terminals, relays and fuses",
      "Comfortable using drilling machines, hand tools and power tools",
      "Able to read basic wiring diagrams and follow installation instructions",
      "Basic troubleshooting skills for power, wiring and connectivity issues",
      "A strong understanding of safe electrical isolation and site-working practices",
    ],
    sections: [
      {
        title: "Freshers welcome",
        body: "Strong fresh ITI candidates with good practical aptitude may also be considered for a Trainee/Apprentice IoT Technician position.",
      },
    ],
  },
];

/** Example roles, shown labelled only while JOBS is empty. */
const SAMPLE_JOBS: Job[] = [];

/** The roles the board shows: real ones, or the labelled samples while there are none. */
export function listedJobs(): Job[] {
  return JOBS.length > 0 ? JOBS : SAMPLE_JOBS;
}

/** One listed role by id, or undefined. */
export function getJob(id: string): Job | undefined {
  return listedJobs().find((j) => j.id === id);
}
