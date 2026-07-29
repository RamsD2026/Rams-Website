export interface NavLink {
  label: string;
  href: string;
  description?: string;
  meta?: string;
}

export interface NavGroup {
  title: string;
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
            label: "Rack Intelligence",
            href: "/solutions/rack-intelligence",
            description: "Improve rack safety, compliance, and lifecycle management",
            meta: "Powered by IRDS",
          },
          {
            label: "MHE Intelligence",
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
            label: "MHE Diagnostics",
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
      href: "/get-started",
      stat: { value: "6", label: "Solution modules" },
    },
  },

  {
    label: "Platform",
    href: "/platform",
    layout: "standard",
    groups: [
      {
        title: "How RAMS Works",
        links: [
          {
            label: "Digital Twin",
            href: "/platform/digital-twin",
            description: "Live warehouse replica updated in real time",
          },
          {
            label: "AI Operational Intelligence",
            href: "/platform/ai-intelligence",
            description: "Machine learning models trained on warehouse data",
          },
          {
            label: "Execution Engine",
            href: "/platform/execution-engine",
            description: "Decision-to-action in milliseconds, at scale",
          },
          {
            label: "Integrations",
            href: "/platform/integrations",
            description: "Connect WMS, ERP, MHE, and IoT systems seamlessly",
          },
          {
            label: "Security",
            href: "/platform/security",
            description: "Enterprise-grade data security and compliance",
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
        title: "AI Vision System",
        links: [
          { label: "AI Cameras", href: "/hardware/ai-cameras", description: "360° warehouse perception" },
          { label: "Driver Monitoring", href: "/hardware/driver-monitoring", description: "In-cab operator safety" },
          { label: "PPE Detection", href: "/hardware/ppe-detection", description: "Automated compliance checks" },
        ],
      },
      {
        title: "OmniBox",
        links: [
          { label: "OmniBox Edge", href: "/hardware/omnibox-edge", description: "Local AI inference at the rack" },
          { label: "OmniBox AI", href: "/hardware/omnibox-ai", description: "High-performance neural compute" },
          { label: "OmniBox Motion", href: "/hardware/omnibox-motion", description: "Kinematic sensing and IMU" },
          { label: "OmniBox Core", href: "/hardware/omnibox-core", description: "Central orchestration unit" },
        ],
      },
      {
        title: "Location Intelligence",
        links: [
          { label: "LiDAR", href: "/hardware/lidar", description: "3D spatial mapping at scale" },
          { label: "RTLS", href: "/hardware/rtls", description: "Real-time location for every asset" },
          { label: "Indoor Positioning", href: "/hardware/indoor-positioning", description: "Sub-meter accuracy indoors" },
        ],
      },
      {
        title: "Guided Inspection",
        links: [
          { label: "AirScan", href: "/hardware/airscan", description: "Drone-based autonomous rack scanning" },
          { label: "FloorScan", href: "/hardware/floorscan", description: "Autonomous floor-level inspection" },
          { label: "Sensor Stack", href: "/hardware/sensor-stack", description: "Unified integrated sensor architecture" },
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
            label: "Rack Inspection",
            href: "/services/rack-inspection",
            description: "Certified rack safety assessments on-site or remote",
          },
          {
            label: "Structural Verification",
            href: "/services/structural-verification",
            description: "Load capacity analysis and compliance reporting",
          },
          {
            label: "Inventory Audit",
            href: "/services/inventory-audit",
            description: "Full-warehouse inventory accuracy verification",
          },
          {
            label: "MHE Productivity Assessment",
            href: "/services/mhe-productivity",
            description: "Identify vehicle utilisation and efficiency gaps",
          },
          {
            label: "Operational Assessment",
            href: "/services/operational-assessment",
            description: "End-to-end warehouse operational review",
          },
          {
            label: "Deployment & Support",
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
          { label: "Manufacturing", href: "/industries/manufacturing", description: "End-to-end production floor visibility" },
          { label: "Warehousing & Distribution", href: "/industries/warehousing", description: "Optimise throughput and accuracy" },
          { label: "Retail", href: "/industries/retail", description: "Omnichannel fulfilment intelligence" },
          { label: "E-Commerce", href: "/industries/ecommerce", description: "High-velocity order operations" },
          { label: "Automotive", href: "/industries/automotive", description: "Parts tracking and JIT compliance" },
          { label: "Food & Beverage", href: "/industries/food-beverage", description: "Cold chain and FIFO compliance" },
          { label: "Pharmaceutical", href: "/industries/pharmaceutical", description: "Regulated storage and traceability" },
          { label: "Logistics & 3PL", href: "/industries/logistics-3pl", description: "Multi-client warehouse management" },
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
      stat: { value: "8", label: "Industries served" },
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
          { label: "Insights", href: "/resources/insights", description: "Expert warehouse intelligence articles" },
          { label: "Videos", href: "/resources/videos", description: "Product demos and walkthroughs" },
          { label: "White Papers", href: "/resources/white-papers", description: "In-depth research and analysis" },
        ],
      },
      {
        title: "Reference",
        links: [
          { label: "Technical Notes", href: "/resources/technical-notes", description: "Integration and API documentation" },
          { label: "Downloads", href: "/resources/downloads", description: "Datasheets, brochures, and specs" },
          { label: "Compliance Guides", href: "/resources/compliance", description: "SEMA, FEM, OSHA reference guides" },
          { label: "FAQ", href: "/resources/faq", description: "Answers to common questions" },
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
          { label: "Partners", href: "/company/partners", description: "Technology and channel partners" },
          { label: "Careers", href: "/company/careers", description: "Join the RAMS team" },
          { label: "Certifications", href: "/company/certifications", description: "Standards and accreditations" },
          { label: "Security", href: "/company/security", description: "Our security posture and policies" },
          { label: "Contact", href: "/contact", description: "Get in touch with our team" },
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
