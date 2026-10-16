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

/**
 * One opening. Only `id`, `title`, `summary`, `responsibilities` and
 * `requirements` are required — every other field is shown only when the
 * job description states it, so nothing on a role page is invented.
 */
export type Job = {
  /** Stable id, used in the save list, the URL and the application email. */
  id: string;
  title: string;
  /** Career family, for the board's team tabs. Leave out unless decided. */
  family?: FamilyCode;
  /** The department as the job description names it. */
  department?: string;
  location?: string;
  /** e.g. "Full-time", "Internship". */
  type?: string;
  /** e.g. "On-site", "Hybrid". */
  mode?: string;
  experience?: string;
  /** ISO date the role was posted, e.g. "2026-10-14". */
  posted?: string;
  /** The hero line and the board card. */
  summary: string;
  /** The overview paragraphs; falls back to `summary`. */
  about?: string[];
  /** Further facts for the role summary card, labelled as the document labels them. */
  details?: { label: string; value: string }[];
  /** Section headings as the document words them; the defaults are generic. */
  headings?: {
    about?: string;
    responsibilities?: string;
    requirements?: string;
    niceToHave?: string;
    tools?: string;
  };
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
  /** Tools and platforms, drawn as chips. */
  tools?: string[];
  /** Further headed sections, each a list or paragraphs. */
  sections?: { title: string; items?: string[]; body?: string[] }[];
  /** Set by the sample list only. */
  sample?: boolean;
};

/** Real, approved openings. Add roles here. */
export const JOBS: Job[] = [
  /* Every value below is taken word for word from RAMS's job description
     documents. Fields a document does not state are left out, and the page
     hides them — do not fill them in. */
  {
    id: "business-development-executive",
    title: "Business Development Executive",
    experience: "2 - 4 years",
    summary:
      "We are looking for an experienced and result-oriented Business Development Executive to drive end to end B2B business development across India.",
    about: [
      "We are looking for an experienced and result-oriented Business Development Executive to drive end to end B2B business development across India. The role will focus on identifying prospective customers, generating qualified leads, conducting product demonstrations, and scheduling meetings for the Sales team. The candidate will primarily work from the Pune office but will be required to travel across India for client meetings, industry events and exhibitions.",
    ],
    headings: {
      about: "Role Summary",
      responsibilities: "Key Responsibilities",
      requirements: "Required Qualifications & Experience",
    },
    responsibilities: [
      "Identify and generate qualified B2B leads across India through cold calling, market research, networking, events and exhibitions.",
      "Understand prospect requirements and effectively communicate the value proposition of RAMS solutions.",
      "Conduct product presentations and demonstrations for prospective clients.",
      "Schedule qualified meetings and appointments for the Sales Manager.",
      "Maintain consistent follow-ups with prospects and ensure effective lead nurturing.",
      "Work closely with the Sales Manager to ensure smooth handover and progression of qualified opportunities.",
      "Achieve assigned lead generation, appointment and revenue targets.",
      "Maintain accurate records of prospects, opportunities, activities and outcomes.",
      "Conduct market research to identify new industries, accounts and business opportunities.",
    ],
    requirements: [
      "2 - 4 years of relevant experience in Business Development / Industrial Sales (B2B preferred).",
      "Experience in warehouse/logistics, manufacturing or related sectors will be preferred.",
      "B.Tech/B.E. in Civil/ Mechanical Engineering preferred.",
      "MBA in Sales/Marketing preferred.",
    ],
    sections: [
      {
        title: "Key Performance Indicators",
        items: [
          "Qualified leads generated.",
          "Meetings/appointments scheduled.",
          "Revenue generated from assigned opportunities.",
          "Achievement of monthly/quarterly business development targets.",
        ],
      },
    ],
  },
  {
    id: "digital-marketing-executive",
    title: "Digital Marketing Executive",
    department: "Marketing & Growth",
    type: "Full-time",
    experience: "1 – 3 Years",
    summary:
      "We are seeking a results-driven Digital Marketing Executive to develop, execute, and optimize multi-channel performance and brand growth initiatives.",
    about: [
      "We are seeking a results-driven Digital Marketing Executive to develop, execute, and optimize multi-channel performance and brand growth initiatives. In this role, you will take ownership of cross-channel acquisition funnels spanning search, social media, email lifecycle marketing, and content strategy to drive brand awareness, qualified lead generation, and customer engagement.",
    ],
    details: [
      { label: "Role Type", value: "Individual Contributor" },
      { label: "Focus Channels", value: "Paid, Organic, Social & CRM" },
    ],
    headings: {
      about: "Role Overview",
      responsibilities: "Key Responsibilities",
      requirements: "Requirements & Qualifications",
      niceToHave: "Preferred Qualifications",
      tools: "Key Tools & Platform Proficiency",
    },
    responsibilities: [
      "Campaign Execution & Paid Media: Plan, launch, monitor, and optimize performance marketing campaigns across Google Ads, Meta Ads Manager, and LinkedIn Campaign Manager to achieve cost-efficient conversions.",
      "SEO & Content Strategy: Conduct keyword research, optimize web content for search visibility (on-page and technical SEO), and oversee content creation for company blogs and organic distribution channels.",
      "Social Media Management: Create, schedule, publish, and evaluate engagement-focused content across primary social platforms to strengthen brand equity and foster active community interaction.",
      "Email Marketing & Automation: Design, segment, and deploy targeted email drip campaigns, recurring newsletters, and automated lead-nurturing workflows to advance prospects through the sales funnel.",
      "Analytics & Performance Reporting: Track and evaluate core KPIs (CAC, ROAS, CTR, CPA, conversion rates) using Google Analytics 4 (GA4) and Looker Studio to deliver actionable weekly and monthly performance insights.",
      "Conversion Rate Optimization (CRO): Design and run continuous A/B tests on landing pages, calls-to-action (CTAs), creative assets, and ad copy to identify lift opportunities and maximize full-funnel efficiency.",
    ],
    requirements: [
      "Experience: 1–3 years of hands-on digital marketing experience (agency or in-house).",
      "Technical Stack: Proficiency with Google Analytics 4 (GA4), Google Ads, Meta Ads Manager, SEO suites (Semrush/Ahrefs), and CMS platforms (WordPress/HubSpot).",
      "Analytical Mindset: Demonstrated capability to interpret raw campaign data and translate it into practical optimization steps.",
      "Copywriting & Messaging: Excellent written communication skills tailored for persuasive ad copy, email subject lines, and engaging social content.",
    ],
    niceToHave: [
      "Certifications: Google Ads / Google Analytics certification or Meta Certified Digital Marketing Associate / Blueprint.",
      "Creative Tools: Working knowledge of design and visual editing tools (Canva, Adobe Photoshop) or video editing suites.",
      "CRM Experience: Hands-on experience with customer relationship management platforms, with proficiency in Zoho CRM highly preferred.",
      "Growth Orientation: Keen interest in emerging digital marketing trends, tracking automation, and algorithm shifts.",
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
      "Email Drip Workflows",
      "A/B Testing & CRO",
    ],
  },
  {
    id: "sales-intern-business-development",
    title: "Sales Intern – Business Development",
    location: "Pune",
    summary:
      "We are looking for enthusiastic and confident MBA students specializing in Sales/Marketing who are interested in gaining practical experience in B2B sales and business development.",
    about: [
      "We are looking for enthusiastic and confident MBA students specializing in Sales/Marketing who are interested in gaining practical experience in B2B sales and business development.",
      "The intern will be assigned specific areas across Pune & Bhiwandi - logistic parks, and will be responsible for identifying potential customers, conducting field visits, understanding business requirements and generating qualified leads and appointments for the sales team.",
    ],
    details: [
      { label: "Internship Duration", value: "3 Months" },
      { label: "Stipend", value: "₹10,000 per month" },
      { label: "Working Days", value: "Monday – Friday" },
      { label: "Working Hours", value: "9:00 AM – 6:00 PM" },
    ],
    headings: {
      about: "Role Overview",
      responsibilities: "Key Responsibilities",
      requirements: "Eligibility",
    },
    responsibilities: [
      "Conduct field visits to manufacturing units, warehouses and other relevant business locations within the assigned area.",
      "Connect with key decision-makers such as Inventory Managers, Store Managers, Warehouse Managers and Safety Managers.",
      "Introduce RAMS Digital and understand the prospect's basic requirements.",
      "Generate qualified leads through field visits and prospecting.",
      "Schedule meetings/appointments between qualified prospects and the Business Development/Sales team.",
    ],
    requirements: [
      "MBA students specializing in Sales or Marketing.",
      "Strong verbal communication and interpersonal skills.",
      "Confident and comfortable interacting with business professionals.",
      "Willingness to travel within and around Pune/ Bhiwandi for field visits.",
    ],
    sections: [
      {
        title: "What You Will Gain",
        items: [
          "Hands-on experience in B2B sales and business development.",
          "Exposure to manufacturing and warehouse operations (E commerce giants, FMCG, Automobiles and Pharma)",
          "Experience in field prospecting and lead generation.",
          "Potential Pre-Placement Offer (PPO) based on performance.",
        ],
      },
      {
        title: "Who Should Apply?",
        body: [
          "This internship is ideal for MBA students who want to move beyond classroom learning and gain practical exposure to B2B sales, field business development and customer acquisition.",
          "If you are confident, proactive, comfortable with field visits and enjoy interacting with people, we would love to hear from you.",
        ],
      },
    ],
  },
  {
    id: "iot-installation-technician",
    title: "IoT Installation Technician",
    experience: "1–3 years",
    summary:
      "We are looking for an IoT Installation Technician to join our IoT Implementation team.",
    about: [
      "We are looking for an IoT Installation Technician to join our IoT Implementation team. The role involves hands-on installation, mounting, wiring and basic testing of IoT hardware on Material Handling Equipment (MHE) such as forklifts, reach trucks and stackers, as well as at industrial sites. The technician will work closely with the IoT Coordinator and Commissioning Engineer to ensure installations are safe, secure, accurate and ready for commissioning",
    ],
    headings: {
      about: "Role Overview",
      responsibilities: "Key Responsibilities",
      requirements: "Eligibility",
    },
    responsibilities: [
      "Install and physically mount IoT devices on forklifts, reach trucks, stackers and other Material Handling Equipment.",
      "Carry out fitment of IoT control boxes/OmniBox, sensors, cameras, LiDAR and other associated hardware.",
      "Perform low-voltage electrical wiring, cable routing, termination, crimping and device connections.",
      "Identify suitable mounting and cable-routing locations in coordination with the IoT Coordinator/Commissioning Engineer.",
      "Ensure all devices are securely mounted and wiring is properly routed, protected, labelled and finished.",
      "Support the Commissioning Engineer during device configuration, testing, calibration and commissioning.",
      "Perform basic troubleshooting of power supply, loose connections, wiring faults and installation-related hardware issues.",
      "Follow installation drawings, wiring diagrams, checklists, SOPs and client-site safety procedures.",
      "Capture installation photographs and complete installation checklists for each asset/MHE.",
      "Accurately record device serial numbers, asset IDs, MHE identification and other required installation details.",
      "Maintain proper accountability of tools, devices, cables, consumables and installation materials.",
      "Report site constraints, MHE conditions, safety concerns and installation deviations to the IoT Coordinator.",
      "Support replacement, reinstallation, maintenance and field-support activities whenever required.",
    ],
    requirements: [
      "ITI qualification in Electronics Mechanic, Electrician, Electrical/Electronics or a related trade.",
      "1–3 years of hands-on experience in IoT installation, automotive electrical work, GPS/telematics, CCTV/camera installation, industrial sensors, machine wiring, forklift/MHE electrical systems or similar field roles.",
      "Strong fresh ITI candidates with good practical aptitude may also be considered for a Trainee/Apprentice IoT Technician position.",
      "Basic knowledge of DC electrical and low-voltage systems.",
      "Hands-on experience with electrical/electronic wiring, termination and crimping.",
      "Ability to use a multimeter and basic electrical testing tools.",
      "Knowledge of cable routing, connectors, terminals, relays and fuses.",
      "Comfortable using drilling machines, hand tools and power tools.",
      "Ability to read basic wiring diagrams and follow installation instructions.",
      "Basic troubleshooting skills for power, wiring and connectivity issues.",
      "Strong understanding of safe electrical isolation and site-working practices.",
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
