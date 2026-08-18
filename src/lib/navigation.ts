export interface NavLink {
  label: string;
  href: string;
  description?: string;
  meta?: string;
}

export interface NavGroup {
  title?: string;
  links: NavLink[];
}

export interface FeaturedCard {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  stat?: { value: string; label: string };
}

export interface NavItemConfig {
  label: string;
  href: string;
  groups: NavGroup[];
  featured: FeaturedCard;
  layout?: "standard" | "hardware" | "industries" | "resources";
}

export const NAV_CONFIG: NavItemConfig[] = [
  {
    label: "Solutions",
    href: "/solutions",
    layout: "standard",
    groups: [
      {
        title: "By Business Challenge",
        links: [
          {
            label: "Rack Safety and Intelligence",
            href: "/solutions/rack-safety-intelligence",
            description: "Improve rack safety, compliance, and lifecycle management",
            meta: "Powered by IRDS",
          },
          {
            label: "MHE Safety and Productivity",
            href: "/solutions/mhe-intelligence",
            description: "Improve vehicle safety and operator productivity",
            meta: "Powered by MEPS + RTSS",
          },
          {
            label: "Inventory Intelligence",
            href: "/solutions/inventory-intelligence",
            description: "Real-time inventory visibility across every location",
          },
          {
            label: "Warehouse Execution",
            href: "/solutions/warehouse-execution",
            description: "Orchestrate warehouse operations with precision and speed",
            meta: "Powered by ATOS",
          },
          {
            label: "MHE Diagnostics and Maintenance",
            href: "/solutions/mhe-diagnostics",
            description: "Predictive maintenance before failures occur",
            meta: "Powered by IMDS",
          },
          {
            label: "Management Intelligence",
            href: "/solutions/management-intelligence",
            description: "Enterprise-wide dashboards and performance insight",
            meta: "Powered by AIMS",
          },
        ],
      },
    ],
    featured: {
      eyebrow: "Not sure where to begin?",
      title: "Find Your Starting Point",
      description:
        "Answer a few questions and we'll map the right solution to your warehouse operation.",
      cta: "Start Assessment",
      href: "/find-your-starting-point",
      stat: { value: "6", label: "Solution modules" },
    },
  },

  {
    label: "Platform",
    href: "/platform",
    layout: "standard",
    groups: [
      {
        links: [
          {
            label: "MEPS",
            href: "/platform/overview",
            description: "MHE Efficiency and Productivity System",
          },
          {
            label: "ATOS",
            href: "/platform/ai-operational-intelligence",
            description: "AI Task Orchestration System",
          },
          {
            label: "RTSS",
            href: "/platform/execution-engine",
            description: "Real-Time Safety System",
          },
          {
            label: "IMDS",
            href: "/platform/integrations",
            description: "Integrated MHE Diagnostic System — WMS, ERP, CCTV, RFID, MHE",
          },
          {
            label: "AIMS",
            href: "/platform/security",
            description: "AI Intelligence and Management System",
          },
          {
            label: "Digital Twin",
            href: "/platform/digital-twin",
            description: "Live warehouse replica updated in real time",
          },
        ],
      },
    ],
    featured: {
      eyebrow: "See it in action",
      title: "The RAMS Operating System",
      description:
        "One platform connecting hardware, AI, inspections, and execution across your entire warehouse estate.",
      cta: "Explore Platform",
      href: "/platform",
      stat: { value: "< 50ms", label: "Edge response time" },
    },
  },

  {
    label: "Hardware",
    href: "/hardware",
    layout: "hardware",
    groups: [
      {
        title: "AI Vision",
        links: [
          { label: "AI Vision Pro", href: "/hardware/ai-vision", description: "Wide-area coverage" },
          { label: "AI Vision Ultra", href: "/hardware/ai-vision", description: "High-fidelity perception" },
          { label: "AI Vision Max", href: "/hardware/ai-vision", description: "Critical-zone throughput" },
        ],
      },
      {
        title: "OmniBox",
        links: [
          { label: "OmniBox Edge", href: "/hardware/omnibox", description: "On-rack inference" },
          { label: "OmniBox AI", href: "/hardware/omnibox", description: "Neural compute" },
          { label: "OmniBox Motion", href: "/hardware/omnibox", description: "Kinematic sensing" },
          { label: "OmniBox Core", href: "/hardware/omnibox", description: "Central orchestration" },
        ],
      },
      {
        title: "Location Intelligence",
        links: [
          { label: "LiDAR", href: "/hardware/rtls", description: "3D spatial mapping" },
          { label: "Wifi", href: "/hardware/rtls", description: "Indoor positioning" },
          { label: "Bluetooth", href: "/hardware/rtls", description: "Beacon tracking" },
          { label: "UWB", href: "/hardware/rtls", description: "Ultra-wideband precision" },
        ],
      },
      {
        title: "Sensor Stack",
        links: [
          { label: "Access Control", href: "/hardware/sensor-stack", description: "MHE and area access" },
          { label: "Crash Monitoring", href: "/hardware/sensor-stack", description: "Impact detection" },
          { label: "Speed Monitoring", href: "/hardware/sensor-stack", description: "Zone-based limits" },
          { label: "Location Monitoring", href: "/hardware/sensor-stack", description: "Real-time asset location" },
          { label: "Pallet Detection", href: "/hardware/sensor-stack", description: "Automated pallet sensing" },
          { label: "Battery Management", href: "/hardware/sensor-stack", description: "Health and charge cycles" },
        ],
      },
      {
        title: "Guided Inspection",
        links: [
          { label: "AirScan", href: "#", description: "Drone rack scanning" },
          { label: "Floor Scan", href: "#", description: "Floor-level inspection" },
        ],
      },
    ],
    featured: {
      eyebrow: "One connected edge platform",
      title: "Hardware Ecosystem",
      description:
        "Every RAMS device — from edge compute to AI cameras to autonomous inspection — works as a unified system.",
      cta: "Explore Hardware",
      href: "/hardware",
      stat: { value: "12+", label: "Hardware products" },
    },
  },

  {
    label: "Services",
    href: "/services",
    layout: "standard",
    groups: [
      {
        title: "What We Deliver",
        links: [
          {
            label: "Rack Inspection Services",
            href: "/services/rack-inspection",
            description: "Certified rack safety assessments on-site or remote",
          },
          {
            label: "Structural Verification",
            href: "/services/structural-verification",
            description: "Load capacity analysis and compliance reporting",
          },
          {
            label: "Inventory Reconciliation and Audit",
            href: "/services/inventory-audit",
            description: "Full-warehouse inventory accuracy verification",
          },
          {
            label: "MHE Productivity Assessment",
            href: "/services/mhe-productivity-assessment",
            description: "Identify vehicle utilisation and efficiency gaps",
          },
          {
            label: "Safety and Operational Assessment",
            href: "/services/operational-assessment",
            description: "End-to-end warehouse operational review",
          },
          {
            label: "Deployment and Support",
            href: "/services/deployment-support",
            description: "Implementation, training, and managed support",
          },
        ],
      },
    ],
    featured: {
      eyebrow: "Need an inspection?",
      title: "Book an Inspection",
      description:
        "Request a certified rack inspection or MHE assessment — on-site or remote, with a 48-hour response.",
      cta: "Request Quote",
      href: "/services/request-quote",
      stat: { value: "48hr", label: "Response time" },
    },
  },

  {
    label: "Industries",
    href: "/industries",
    layout: "industries",
    groups: [
      {
        title: "Industries We Serve",
        links: [
          { label: "Warehousing and Distribution", href: "/industries/warehousing-distribution", description: "Optimise throughput and accuracy" },
          { label: "Third-Party Logistics (3PL)", href: "/industries/third-party-logistics", description: "Multi-client warehouse management" },
          { label: "E-commerce", href: "/industries/ecommerce-fulfilment", description: "High-velocity order operations" },
          { label: "Cold Storage", href: "/industries/cold-storage", description: "Temperature-controlled operations" },
          { label: "Manufacturing", href: "/industries/manufacturing", description: "End-to-end production floor visibility" },
          { label: "Automotive", href: "/industries/automotive", description: "Parts tracking and JIT compliance" },
          { label: "FMCG", href: "/industries/fmcg", description: "High-volume fast-moving goods" },
          { label: "Food and Beverage", href: "/industries/food-beverage", description: "Cold chain and FIFO compliance" },
          { label: "Pharmaceuticals", href: "/industries/pharmaceuticals", description: "Regulated storage and traceability" },
        ],
      },
    ],
    featured: {
      eyebrow: "Purpose-built for every sector",
      title: "Explore Industry Solutions",
      description:
        "See how RAMS adapts to the compliance, safety, and operational demands of your industry.",
      cta: "View Industries",
      href: "/industries",
      stat: { value: "9", label: "Industries served" },
    },
  },

  {
    label: "Resources",
    href: "/resources",
    layout: "resources",
    groups: [
      {
        title: "Learn",
        links: [
          { label: "Case Studies", href: "/resources/case-studies", description: "Real-world customer outcomes" },
          { label: "News Room", href: "/resources/insights", description: "Latest company news and announcements" },
          { label: "Videos", href: "/resources/videos", description: "Product demos and walkthroughs" },
          { label: "White Papers", href: "/resources/white-papers", description: "In-depth research and analysis" },
        ],
      },
      {
        title: "Reference",
        links: [
          { label: "Technical Notes", href: "/resources/technical-notes", description: "Integration and API documentation" },
          { label: "Downloads", href: "/resources/downloads", description: "Datasheets, brochures, and specs" },
          { label: "Glossary (Industry Compliance Guides)", href: "/resources/compliance-guides", description: "SEMA, FEM, OSHA reference guides" },
          { label: "Frequently Asked Questions (FAQs)", href: "/resources/faqs", description: "Answers to common questions" },
        ],
      },
    ],
    featured: {
      eyebrow: "Latest insight",
      title: "Warehouse AI Report 2026",
      description:
        "How AI is reshaping safety, productivity, and compliance in enterprise warehouses globally.",
      cta: "Read Report",
      href: "/resources/warehouse-ai-report-2026",
      stat: { value: "2026", label: "Annual report" },
    },
  },

  {
    label: "Company",
    href: "/company",
    layout: "standard",
    groups: [
      {
        title: "Who We Are",
        links: [
          { label: "About RAMS", href: "/company/about", description: "Our mission and story" },
          { label: "Leadership", href: "/company/leadership", description: "Meet the executive team" },
          { label: "Customers", href: "/company/customers", description: "Who trusts RAMS globally" },
          { label: "Certifications and Security", href: "/company/certifications", description: "Standards, accreditations, and security posture" },
          { label: "Partners", href: "/company/partners", description: "Technology and channel partners" },
          { label: "Careers", href: "/company/careers", description: "Join the RAMS team" },
          { label: "Contact Us", href: "/company/contact", description: "Get in touch with our team" },
        ],
      },
    ],
    featured: {
      eyebrow: "Our vision",
      title: "Why RAMS",
      description:
        "Operational intelligence should be reliable, deeply integrated, and built for the realities of enterprise warehousing.",
      cta: "About RAMS",
      href: "/company/about",
      stat: { value: "10+", label: "Years of innovation" },
    },
  },
];
