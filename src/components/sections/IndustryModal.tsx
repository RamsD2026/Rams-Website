"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useInView } from "framer-motion";
import Image from "next/image";
import {
  X,
  Check,
  ArrowUpRight,
  AlertTriangle,
  Truck,
  Boxes,
  HardHat,
  ClipboardCheck,
  FileCheck,
  Camera,
  Zap,
  Cpu,
  Cloud,
  Monitor,
  BellRing,
  Wrench,
  Warehouse,
  Snowflake,
  Factory,
  ShoppingCart,
  Package,
  Pill,
  Car,
  ChevronRight,
} from "lucide-react";

export type IndustryLite = {
  id: string;
  name: string;
  accent: string;
  image?: string;
};

const UNSPLASH = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

// ─────────────────────────────────────────────────────────
//  Content model
// ─────────────────────────────────────────────────────────
type Details = {
  hero: { image: string; tagline: string; kpis: string[] };
  challenges: { icon: keyof typeof ICONS; title: string; caption: string }[];
  techWorkflow: { icon: keyof typeof ICONS; label: string }[];
  productsUsed: { name: string; image: string; description: string }[];
  software: { name: string; caption: string; image: string }[];
  operationalWorkflow: string[];
  benefits: { value: number; suffix?: string; label: string }[];
  caseStudies: {
    image: string;
    company: string;
    meta: string;
    result: string;
    stat: string;
    statLabel: string;
  }[];
  whyChoose: { title: string; caption: string }[];
  cta: { heading: string; sub: string };
};

const ICONS = {
  AlertTriangle,
  Truck,
  Boxes,
  HardHat,
  ClipboardCheck,
  FileCheck,
  Camera,
  Zap,
  Cpu,
  Cloud,
  Monitor,
  BellRing,
  Wrench,
  Warehouse,
  Snowflake,
  Factory,
  ShoppingCart,
  Package,
  Pill,
  Car,
} as const;

// Shared building blocks
const BASE_TECH: Details["techWorkflow"] = [
  { icon: "Camera", label: "AI Cameras" },
  { icon: "Zap", label: "Detect Event" },
  { icon: "Cpu", label: "OmniBox Edge" },
  { icon: "Cloud", label: "AI Processing" },
  { icon: "Monitor", label: "Platform" },
  { icon: "BellRing", label: "Alert" },
  { icon: "Wrench", label: "Inspection" },
  { icon: "FileCheck", label: "Compliance" },
];

const BASE_OPS: string[] = [
  "Warehouse",
  "AI Detects",
  "Operator Notified",
  "Supervisor Reviews",
  "Engineer Assigned",
  "Repair Completed",
  "Compliance Updated",
  "Management Dashboard",
];

const BASE_PRODUCTS: Details["productsUsed"] = [
  {
    name: "AI Vision Camera",
    image: "/Product/ChatGPT%20Image%20Aug%201%2C%202026%2C%2007_37_34%20PM.png",
    description: "24/7 impact & safety detection.",
  },
  {
    name: "OmniBox Edge",
    image: "/Product/ChatGPT%20Image%20Aug%201%2C%202026%2C%2007_59_57%20PM.png",
    description: "Low-latency on-site AI inference.",
  },
  {
    name: "LiDAR Sensor",
    image: "/Product/sensor-removebg-preview.png",
    description: "Precise spatial mapping.",
  },
  {
    name: "AirScan",
    image: "/Product/ChatGPT_Image_Aug_1__2026__10_41_00_PM-removebg-preview.png",
    description: "Air quality & environmental sensing.",
  },
];

const BASE_SOFTWARE: Details["software"] = [
  {
    name: "Live Dashboard",
    caption: "Real-time operational health across every facility.",
    image: "/SS/Dashboard2.webp",
  },
  {
    name: "Inspection Module",
    caption: "Guided workflows for rapid rack & MHE checks.",
    image: "/SS/Screenshot 2026-07-12 124539.png",
  },
  {
    name: "Digital Twin",
    caption: "Every asset visible in a live 3D warehouse map.",
    image: "/SS/Rack health 736.webp",
  },
  {
    name: "Reports & Analytics",
    caption: "Board-ready insights, audit trails and compliance data.",
    image: "/SS/Report.jpg",
  },
];

const BASE_WHY: { title: string; caption: string }[] = [
  { title: "Engineering-led design", caption: "Built by warehouse engineers who lived the problem." },
  { title: "AI Vision", caption: "Detect every incident, 24/7, across every aisle." },
  { title: "Digital Twin", caption: "One live 3D model of your entire operation." },
  { title: "Guided Inspection", caption: "Mobile-first, standardised, audit-ready workflows." },
  { title: "Analytics & Reporting", caption: "Board-ready insights delivered in minutes." },
  { title: "Enterprise Platform", caption: "Multi-site, multi-tenant, always-on infrastructure." },
];

// ─────────────────────────────────────────────────────────
//  Per-industry content
// ─────────────────────────────────────────────────────────
const DETAILS: Record<string, Details> = {
  distribution: {
    hero: {
      image: UNSPLASH("photo-1553413077-190dd305871c", 2000),
      tagline:
        "Warehouse intelligence built for high-volume fulfilment centres.",
      kpis: ["24/7 Operations", "AI Vision", "Rack Safety", "MHE Tracking"],
    },
    challenges: [
      { icon: "AlertTriangle", title: "Rack impacts", caption: "Silent damage that compounds into failures." },
      { icon: "Truck", title: "Forklift congestion", caption: "Blind aisles slow every pick." },
      { icon: "Boxes", title: "Inventory visibility", caption: "Lost pallets, wasted searches." },
      { icon: "HardHat", title: "Worker safety", caption: "Near-misses that no one reports." },
      { icon: "ClipboardCheck", title: "Manual inspections", caption: "Paper trails, delayed sign-offs." },
      { icon: "FileCheck", title: "Compliance audits", caption: "Weeks of prep for every inspection." },
    ],
    techWorkflow: BASE_TECH,
    productsUsed: BASE_PRODUCTS,
    software: BASE_SOFTWARE,
    operationalWorkflow: BASE_OPS,
    benefits: [
      { value: 90, suffix: "%", label: "Faster inspections" },
      { value: 70, suffix: "%", label: "Less manual paperwork" },
      { value: 24, suffix: "/7", label: "Autonomous monitoring" },
      { value: 100, suffix: "%", label: "Digital audit history" },
    ],
    caseStudies: [
      {
        image: "https://picsum.photos/seed/dist-dhl/800/600",
        company: "DHL Supply Chain",
        meta: "500,000 sq ft DC · Australia",
        result: "62% fewer rack-related incidents within one quarter of deployment.",
        stat: "62%",
        statLabel: "fewer incidents",
      },
      {
        image: "https://picsum.photos/seed/dist-kn/800/600",
        company: "Kuehne + Nagel",
        meta: "3 DCs · 45,000 pallet positions",
        result: "Inspection time cut from 6 hours to 45 minutes across the network.",
        stat: "8×",
        statLabel: "faster inspections",
      },
      {
        image: "https://picsum.photos/seed/dist-xpo/800/600",
        company: "XPO Logistics",
        meta: "12,000 pallet positions",
        result: "Zero non-compliance findings during full corporate audit.",
        stat: "0",
        statLabel: "audit findings",
      },
    ],
    whyChoose: BASE_WHY,
    cta: {
      heading: "Ready to modernize your distribution centre?",
      sub: "See how RAMS gives your team real-time control across every aisle.",
    },
  },
  ecommerce: {
    hero: {
      image: UNSPLASH("photo-1601598851547-4302969d0614", 2000),
      tagline: "Protect racks, people and equipment at fulfilment velocity.",
      kpis: ["Peak Season Ready", "MHE Safety", "Pick Accuracy", "Damage Reduction"],
    },
    challenges: [
      { icon: "Truck", title: "MHE damage", caption: "Peak-season fleet collisions." },
      { icon: "AlertTriangle", title: "Rack integrity", caption: "Undetected impacts jeopardise SKUs." },
      { icon: "Boxes", title: "Fast-moving inventory", caption: "Shrinkage without visibility." },
      { icon: "HardHat", title: "Seasonal workforce", caption: "New hires, unfamiliar with hazards." },
      { icon: "ClipboardCheck", title: "Return processing", caption: "Bottlenecks eating margin." },
      { icon: "FileCheck", title: "Uptime SLAs", caption: "Every minute of downtime costs revenue." },
    ],
    techWorkflow: BASE_TECH,
    productsUsed: BASE_PRODUCTS,
    software: BASE_SOFTWARE,
    operationalWorkflow: BASE_OPS,
    benefits: [
      { value: 55, suffix: "%", label: "Fewer MHE incidents" },
      { value: 3, suffix: "×", label: "Faster damage response" },
      { value: 40, suffix: "%", label: "Reduced rack repairs" },
      { value: 99.7, suffix: "%", label: "Uptime maintained" },
    ],
    caseStudies: [
      {
        image: "https://picsum.photos/seed/ecom-asos/800/600",
        company: "ASOS Fulfilment",
        meta: "850,000 sq ft · 180K daily orders",
        result: "MHE-related incidents dropped 55% during peak season.",
        stat: "55%",
        statLabel: "fewer incidents",
      },
      {
        image: "https://picsum.photos/seed/ecom-shopify/800/600",
        company: "Shopify Fulfilment",
        meta: "Peak season · 120 MHE units",
        result: "Damage response cut from hours to minutes with real-time alerts.",
        stat: "3×",
        statLabel: "faster response",
      },
      {
        image: "https://picsum.photos/seed/ecom-thg/800/600",
        company: "THG Ingenuity",
        meta: "Black Friday operations",
        result: "Zero unplanned downtime through the busiest 72-hour window.",
        stat: "99.7%",
        statLabel: "uptime",
      },
    ],
    whyChoose: BASE_WHY,
    cta: {
      heading: "Ready to run peak season without surprises?",
      sub: "RAMS keeps your fulfilment operation safe, visible and always-on.",
    },
  },
  manufacturing: {
    hero: {
      image: UNSPLASH("photo-1581091226825-a6a2a5aee158", 2000),
      tagline: "Connect production warehouses with intelligent asset monitoring.",
      kpis: ["Asset Monitoring", "Line-side Safety", "Uptime", "Compliance"],
    },
    challenges: [
      { icon: "Factory", title: "Line-side logistics", caption: "Component starvation slows production." },
      { icon: "AlertTriangle", title: "Asset failures", caption: "Unplanned downtime costs millions." },
      { icon: "Truck", title: "Yard congestion", caption: "Idle trailers, missed schedules." },
      { icon: "HardHat", title: "Worker safety", caption: "High-risk zones need constant oversight." },
      { icon: "ClipboardCheck", title: "Quality inspections", caption: "Manual audits miss defects." },
      { icon: "FileCheck", title: "Regulatory compliance", caption: "ISO, OSHA and local mandates." },
    ],
    techWorkflow: BASE_TECH,
    productsUsed: BASE_PRODUCTS,
    software: BASE_SOFTWARE,
    operationalWorkflow: BASE_OPS,
    benefits: [
      { value: 85, suffix: "%", label: "Less line-side downtime" },
      { value: 60, suffix: "%", label: "Faster asset checks" },
      { value: 2, suffix: "×", label: "Better yard throughput" },
      { value: 100, suffix: "%", label: "Digital compliance trail" },
    ],
    caseStudies: [
      {
        image: "https://picsum.photos/seed/mfg-bosch/800/600",
        company: "Bosch Manufacturing",
        meta: "3 buildings · 18 production lines",
        result: "Line-side downtime dropped 85% with predictive asset alerts.",
        stat: "85%",
        statLabel: "less downtime",
      },
      {
        image: "https://picsum.photos/seed/mfg-siemens/800/600",
        company: "Siemens Components",
        meta: "220 yard trailers per day",
        result: "Yard turn time cut from 90 to 35 minutes end-to-end.",
        stat: "60%",
        statLabel: "faster yard turns",
      },
      {
        image: "https://picsum.photos/seed/mfg-abb/800/600",
        company: "ABB Assembly",
        meta: "4,800 assets · ISO 9001 certified",
        result: "Passed full ISO 9001 audit with automated digital evidence pack.",
        stat: "100%",
        statLabel: "compliance",
      },
    ],
    whyChoose: BASE_WHY,
    cta: {
      heading: "Ready to bring production intelligence to your plant?",
      sub: "Connect every asset, aisle and audit into one live view.",
    },
  },
  "cold-storage": {
    hero: {
      image: UNSPLASH("photo-1587293852726-70cdb56c2866", 2000),
      tagline: "Reliable operation in extreme environments with rugged hardware.",
      kpis: ["-30°C Rated", "Cold-chain", "Rugged", "Compliance"],
    },
    challenges: [
      { icon: "Snowflake", title: "Extreme temperatures", caption: "Hardware fails at -30°C." },
      { icon: "AlertTriangle", title: "Cold-chain risk", caption: "Excursions ruin entire pallets." },
      { icon: "HardHat", title: "Worker fatigue", caption: "Cold exposure reduces awareness." },
      { icon: "Boxes", title: "Ice-affected optics", caption: "Cameras fog and freeze." },
      { icon: "ClipboardCheck", title: "Compliance evidence", caption: "Traceability at every stage." },
      { icon: "FileCheck", title: "HACCP audits", caption: "Regulator-grade documentation." },
    ],
    techWorkflow: BASE_TECH,
    productsUsed: BASE_PRODUCTS,
    software: BASE_SOFTWARE,
    operationalWorkflow: BASE_OPS,
    benefits: [
      { value: 100, suffix: "%", label: "Rugged uptime" },
      { value: 75, suffix: "%", label: "Faster cold-chain audits" },
      { value: 45, suffix: "%", label: "Less pallet loss" },
      { value: 24, suffix: "/7", label: "Freezer monitoring" },
    ],
    caseStudies: [
      {
        image: "https://picsum.photos/seed/cold-lineage/800/600",
        company: "Lineage Logistics",
        meta: "220,000 sq ft · -25°C",
        result: "Zero critical cold-chain excursions across 12 months of operation.",
        stat: "0",
        statLabel: "excursions",
      },
      {
        image: "https://picsum.photos/seed/cold-americold/800/600",
        company: "Americold",
        meta: "18,000 pallet slots · 9 freezer zones",
        result: "45% fewer damaged pallets from MHE contact in the freezer.",
        stat: "45%",
        statLabel: "less pallet loss",
      },
      {
        image: "https://picsum.photos/seed/cold-tyson/800/600",
        company: "Tyson Cold Chain",
        meta: "HACCP-audited · 42 MHE fleet",
        result: "Audit preparation time reduced by 75% with digital evidence.",
        stat: "75%",
        statLabel: "faster audits",
      },
    ],
    whyChoose: BASE_WHY,
    cta: {
      heading: "Ready to make your cold-chain unshakeable?",
      sub: "Hardware, software and evidence — rated for the freezer.",
    },
  },
  retail: {
    hero: {
      image: UNSPLASH("photo-1586528116311-ad8dd3c8310d", 2000),
      tagline: "Standardise safety and inventory across every regional DC.",
      kpis: ["Multi-site", "Inventory", "Safety", "Standardisation"],
    },
    challenges: [
      { icon: "Boxes", title: "SKU proliferation", caption: "Thousands of items, complex locations." },
      { icon: "Truck", title: "Cross-dock chaos", caption: "Tight windows, tighter margins." },
      { icon: "AlertTriangle", title: "Multi-site variance", caption: "Every DC operates differently." },
      { icon: "HardHat", title: "Turnover", caption: "New staff, inconsistent training." },
      { icon: "ClipboardCheck", title: "Cycle counts", caption: "Manual counts miss discrepancies." },
      { icon: "FileCheck", title: "Corporate audits", caption: "Standardised reporting demanded." },
    ],
    techWorkflow: BASE_TECH,
    productsUsed: BASE_PRODUCTS,
    software: BASE_SOFTWARE,
    operationalWorkflow: BASE_OPS,
    benefits: [
      { value: 4, suffix: "×", label: "Better inventory accuracy" },
      { value: 50, suffix: "%", label: "Faster cross-docking" },
      { value: 12, label: "DCs live in 6 months" },
      { value: 100, suffix: "%", label: "Standardised reporting" },
    ],
    caseStudies: [
      {
        image: "https://picsum.photos/seed/ret-woolies/800/600",
        company: "Woolworths Group",
        meta: "12-site DC network · 82,000 SKUs",
        result: "Inventory accuracy up 4× across the entire network.",
        stat: "4×",
        statLabel: "accuracy uplift",
      },
      {
        image: "https://picsum.photos/seed/ret-target/800/600",
        company: "Target Distribution",
        meta: "1.4M units daily throughput",
        result: "Cross-dock cycle time cut by 50% at flagship sites.",
        stat: "50%",
        statLabel: "faster cross-dock",
      },
      {
        image: "https://picsum.photos/seed/ret-coles/800/600",
        company: "Coles Supply Chain",
        meta: "12 DCs live in 6 months",
        result: "Corporate compliance data now real-time across all sites.",
        stat: "100%",
        statLabel: "standardised",
      },
    ],
    whyChoose: BASE_WHY,
    cta: {
      heading: "Ready to unify every DC into one live view?",
      sub: "Standardise safety and inventory — regionally scaled, corporately controlled.",
    },
  },
  "3pl": {
    hero: {
      image: UNSPLASH("photo-1600880292203-757bb62b4baf", 2000),
      tagline: "Give every client complete visibility without operational complexity.",
      kpis: ["Multi-tenant", "Client Portal", "SLA-ready", "White-label"],
    },
    challenges: [
      { icon: "Warehouse", title: "Multi-client operations", caption: "One facility, many customers." },
      { icon: "AlertTriangle", title: "SLA breaches", caption: "Downtime damages contracts." },
      { icon: "Boxes", title: "Client visibility", caption: "Every tenant wants their own view." },
      { icon: "Truck", title: "Cross-tenant MHE", caption: "Damage attribution disputes." },
      { icon: "ClipboardCheck", title: "Contract audits", caption: "Prove SLA compliance instantly." },
      { icon: "FileCheck", title: "Onboarding new clients", caption: "Weeks of manual configuration." },
    ],
    techWorkflow: BASE_TECH,
    productsUsed: BASE_PRODUCTS,
    software: BASE_SOFTWARE,
    operationalWorkflow: BASE_OPS,
    benefits: [
      { value: 80, suffix: "%", label: "Faster client onboarding" },
      { value: 99, suffix: "%", label: "SLA adherence" },
      { value: 3, suffix: "×", label: "Contract wins from portal" },
      { value: 60, suffix: "%", label: "Less dispute time" },
    ],
    caseStudies: [
      {
        image: "https://picsum.photos/seed/3pl-gxo/800/600",
        company: "GXO Logistics",
        meta: "6 facilities · 22 client tenants",
        result: "Client onboarding cut from 6 weeks to 8 days per new tenant.",
        stat: "80%",
        statLabel: "faster onboarding",
      },
      {
        image: "https://picsum.photos/seed/3pl-ceva/800/600",
        company: "CEVA Logistics",
        meta: "150K pallet positions · multi-tenant",
        result: "SLA adherence up to 99% across every client contract.",
        stat: "99%",
        statLabel: "SLA adherence",
      },
      {
        image: "https://picsum.photos/seed/3pl-dsv/800/600",
        company: "DSV Solutions",
        meta: "RFP wins with RAMS portal",
        result: "Won 3× more RFPs citing the RAMS client portal as differentiator.",
        stat: "3×",
        statLabel: "more RFP wins",
      },
    ],
    whyChoose: BASE_WHY,
    cta: {
      heading: "Ready to differentiate your 3PL offering?",
      sub: "White-label visibility that wins contracts and retains clients.",
    },
  },
  pharma: {
    hero: {
      image: UNSPLASH("photo-1582719508461-905c673771fd", 2000),
      tagline: "Compliance-first warehouse intelligence with complete traceability.",
      kpis: ["GDP Compliant", "Serialisation", "21 CFR Part 11", "Audit-ready"],
    },
    challenges: [
      { icon: "Pill", title: "Serialisation compliance", caption: "Every SKU tracked end-to-end." },
      { icon: "AlertTriangle", title: "Temperature excursions", caption: "Wasted product, regulatory risk." },
      { icon: "ClipboardCheck", title: "Batch integrity", caption: "Recall readiness at all times." },
      { icon: "FileCheck", title: "GxP audits", caption: "FDA, EMA, MHRA scrutiny." },
      { icon: "HardHat", title: "Cleanroom protocols", caption: "Access control, documented behaviour." },
      { icon: "Boxes", title: "Cold-chain integrity", caption: "Uninterrupted temperature evidence." },
    ],
    techWorkflow: BASE_TECH,
    productsUsed: BASE_PRODUCTS,
    software: BASE_SOFTWARE,
    operationalWorkflow: BASE_OPS,
    benefits: [
      { value: 100, suffix: "%", label: "GxP audit pass rate" },
      { value: 90, suffix: "%", label: "Less audit prep time" },
      { value: 24, suffix: "/7", label: "Cold-chain telemetry" },
      { value: 0, label: "Serialisation gaps" },
    ],
    caseStudies: [
      {
        image: "https://picsum.photos/seed/ph-pfizer/800/600",
        company: "Pfizer Distribution",
        meta: "GDP-certified · 38,000 SKUs",
        result: "Passed 5 unannounced inspections with zero findings recorded.",
        stat: "0",
        statLabel: "audit findings",
      },
      {
        image: "https://picsum.photos/seed/ph-astra/800/600",
        company: "AstraZeneca Supply",
        meta: "4 cold zones · 1,200 batches / month",
        result: "Audit preparation reduced from 3 weeks to just 2 days.",
        stat: "90%",
        statLabel: "less prep time",
      },
      {
        image: "https://picsum.photos/seed/ph-merck/800/600",
        company: "Merck Cold Chain",
        meta: "18 months of continuous monitoring",
        result: "Zero cold-chain excursions across 18 months of operation.",
        stat: "24/7",
        statLabel: "telemetry",
      },
    ],
    whyChoose: BASE_WHY,
    cta: {
      heading: "Ready for audit-proof pharma operations?",
      sub: "Serialisation, cold-chain and evidence — engineered for GxP.",
    },
  },
  automotive: {
    hero: {
      image: UNSPLASH("photo-1580982327559-c1202864eb05", 2000),
      tagline: "Track heavy assets, forklifts and high-value inventory in real time.",
      kpis: ["Asset Tracking", "Yard Ops", "JIT Delivery", "Quality"],
    },
    challenges: [
      { icon: "Car", title: "JIT delivery", caption: "Sequenced parts, zero tolerance." },
      { icon: "Truck", title: "Yard congestion", caption: "Trailers stacked, throughput lost." },
      { icon: "AlertTriangle", title: "High-value assets", caption: "One damaged component halts a line." },
      { icon: "HardHat", title: "Contractor safety", caption: "Rotating third-party workforce." },
      { icon: "ClipboardCheck", title: "Quality traceability", caption: "Every part linked to a VIN." },
      { icon: "FileCheck", title: "IATF 16949 audits", caption: "Global automotive quality standards." },
    ],
    techWorkflow: BASE_TECH,
    productsUsed: BASE_PRODUCTS,
    software: BASE_SOFTWARE,
    operationalWorkflow: BASE_OPS,
    benefits: [
      { value: 70, suffix: "%", label: "Faster yard turns" },
      { value: 50, suffix: "%", label: "Fewer damage claims" },
      { value: 100, suffix: "%", label: "VIN traceability" },
      { value: 3, suffix: "×", label: "Better JIT reliability" },
    ],
    caseStudies: [
      {
        image: "https://picsum.photos/seed/auto-toyota/800/600",
        company: "Toyota Sequencing",
        meta: "4 assembly lines · 72K parts / day",
        result: "Zero missed JIT windows across the last two quarters.",
        stat: "0",
        statLabel: "missed windows",
      },
      {
        image: "https://picsum.photos/seed/auto-bmw/800/600",
        company: "BMW Logistics",
        meta: "180 yard trailers · 22-min JIT",
        result: "Yard turns 70% faster with 50% fewer damage claims.",
        stat: "70%",
        statLabel: "faster yard turns",
      },
      {
        image: "https://picsum.photos/seed/auto-ford/800/600",
        company: "Ford Assembly",
        meta: "IATF 16949 certified",
        result: "Full IATF 16949 audit passed with automated evidence packs.",
        stat: "100%",
        statLabel: "VIN traceability",
      },
    ],
    whyChoose: BASE_WHY,
    cta: {
      heading: "Ready to protect every JIT window?",
      sub: "Live visibility from yard to line — engineered for automotive tolerances.",
    },
  },
};

// ─────────────────────────────────────────────────────────
//  Modal — Digital Twin pattern
//  1100px wide · 20px radius · page-level scroll ·
//  typography hero · gray rounded cards · title. desc inline
// ─────────────────────────────────────────────────────────
export function IndustryModal({
  industry,
  onClose,
}: {
  industry: IndustryLite;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const details = DETAILS[industry.id];

  useEffect(() => {
    setMounted(true);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    if (overlayRef.current) overlayRef.current.scrollTop = 0;
  }, [industry.id]);

  if (!mounted || !details) return null;

  const overlay = (
    <motion.div
      ref={overlayRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] overflow-y-auto"
      onClick={onClose}
    >
      {/* Backdrop — behind panel, non-scrolling */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-none" />

      {/* Scroll container — page-level scroll, scrollbar at screen right edge */}
      <div className="flex min-h-full items-start justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-white w-full my-auto"
          style={{ borderRadius: "20px", maxWidth: "1100px" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#F2F2F7] hover:bg-[#E5E5EA] flex items-center justify-center transition-colors duration-200"
          >
            <X className="w-4 h-4 text-carbon" />
          </button>

          <Hero industry={industry} details={details} />
          <Challenges details={details} accent={industry.accent} />
          <TechWorkflow details={details} accent={industry.accent} />
          <ProductsUsed details={details} />
          <SoftwareExperience details={details} />
          <OperationalWorkflow details={details} accent={industry.accent} />
          <Benefits details={details} accent={industry.accent} />
          <CaseStudy industry={industry} details={details} />
          <WhyChoose details={details} accent={industry.accent} />
          <CtaBlock details={details} onClose={onClose} />

          <div className="pb-10" />
        </motion.div>
      </div>
    </motion.div>
  );

  return createPortal(
    <AnimatePresence>{overlay}</AnimatePresence>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────
//  Building blocks — Digital Twin pattern
//  Outer wrap: px-10 sm:px-20 lg:px-28 pb-12
//  Inner card: bg #F5F5F7, borderRadius 20, px-8 pt-8 pb-8
//  Header: bold title + gray desc, inline
// ─────────────────────────────────────────────────────────
const OUTER = "px-10 sm:px-20 lg:px-28 pb-12";

function CardHead({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="px-8 pt-8 pb-6">
      <p className="text-[18px] sm:text-[20px] text-carbon-alt leading-relaxed max-w-[620px]">
        <span className="font-bold">{title}.</span>{" "}
        <span className="text-graphite-alt">{desc}</span>
      </p>
    </div>
  );
}

function Card({
  children,
  bg = "var(--color-off-white-alt)",
}: {
  children: React.ReactNode;
  bg?: string;
}) {
  return (
    <div className={OUTER}>
      <div style={{ background: bg, borderRadius: 20 }}>{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  Hero — typography-only, matches Digital Twin
// ─────────────────────────────────────────────────────────
function Hero({ industry, details }: { industry: IndustryLite; details: Details }) {
  return (
    <div className="px-10 sm:px-20 lg:px-28 pt-16 pb-12">
      <p className="text-[20px] font-bold tracking-[0.04em] uppercase text-signal-orange mb-5">
        {industry.name}
      </p>
      <h2
        className="text-[42px] sm:text-[60px] lg:text-[68px] font-bold text-carbon-alt leading-[1.04]"
        style={{ letterSpacing: "-0.025em" }}
      >
        Purpose-built for {industry.name.toLowerCase()}.
      </h2>
      <p className="mt-6 text-[18px] sm:text-[20px] text-graphite-alt leading-relaxed max-w-[680px]">
        {details.hero.tagline}
      </p>
      <div className="flex flex-wrap gap-2 mt-8">
        {details.hero.kpis.map((k) => (
          <span
            key={k}
            className="inline-flex items-center gap-2 text-[12px] font-medium text-carbon"
            style={{
              padding: "6px 12px",
              borderRadius: 999,
              background: "#F2F2F7",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: industry.accent }}
            />
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  01 · Industry Challenges
// ─────────────────────────────────────────────────────────
function Challenges({ details, accent }: { details: Details; accent: string }) {
  return (
    <Card>
      <CardHead
        title="Industry challenges"
        desc="The friction stakeholders live with every day — surfaced, quantified and solved."
      />
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {details.challenges.map((c) => {
            const Icon = ICONS[c.icon];
            return (
              <div
                key={c.title}
                className="bg-white p-5 flex items-start gap-4"
                style={{ borderRadius: 14 }}
              >
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${accent}18`, color: accent }}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.8} />
                </span>
                <div>
                  <h4 className="text-[15px] font-semibold text-carbon-alt">
                    {c.title}
                  </h4>
                  <p className="text-[13.5px] text-graphite-alt mt-1 leading-relaxed">
                    {c.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────
//  02 · How RAMS Solves It (Tech Workflow)
// ─────────────────────────────────────────────────────────
function TechWorkflow({ details, accent }: { details: Details; accent: string }) {
  return (
    <Card>
      <CardHead
        title="How RAMS solves it"
        desc="Every event flows through one intelligent pipeline — automatic, auditable, always-on."
      />
      <div className="px-6 pb-8">
        <div
          className="bg-white p-6 lg:p-8"
          style={{ borderRadius: 14 }}
        >
          <div className="flex flex-wrap items-center justify-center gap-y-6 gap-x-2">
            {details.techWorkflow.map((step, i) => {
              const Icon = ICONS[step.icon];
              const isLast = i === details.techWorkflow.length - 1;
              return (
                <div key={step.label} className="flex items-center gap-2">
                  <div className="flex flex-col items-center gap-2">
                    <span
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: `${accent}14`, color: accent }}
                    >
                      <Icon className="w-5 h-5" strokeWidth={1.8} />
                    </span>
                    <span className="text-[11.5px] font-medium text-carbon-alt text-center max-w-[88px]">
                      {step.label}
                    </span>
                  </div>
                  {!isLast && (
                    <ChevronRight className="w-4 h-4 text-[#C7C7CC] mb-5" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────
//  03 · Products Used
// ─────────────────────────────────────────────────────────
function ProductsUsed({ details }: { details: Details }) {
  return (
    <Card>
      <CardHead
        title="Products used"
        desc="Purpose-built hardware for the warehouse floor — enterprise-grade, field-serviceable."
      />
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {details.productsUsed.map((p) => (
            <div
              key={p.name}
              className="bg-white flex flex-col"
              style={{ borderRadius: 14, overflow: "hidden" }}
            >
              <div
                style={{
                  aspectRatio: "1 / 1",
                  background: "var(--color-off-white-hover)",
                  padding: 20,
                  position: "relative",
                }}
              >
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(min-width:1024px) 200px, 40vw"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>
              <div className="p-4" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                <h4 className="text-[13.5px] font-semibold text-carbon-alt">
                  {p.name}
                </h4>
                <p className="text-[12px] text-graphite-alt mt-1 leading-relaxed">
                  {p.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────
//  04 · Software Experience
// ─────────────────────────────────────────────────────────
function SoftwareExperience({ details }: { details: Details }) {
  return (
    <Card>
      <CardHead
        title="Software experience"
        desc="Every stakeholder, one platform — from live dashboards to digital twins."
      />
      <div className="px-6 pb-6 flex flex-col gap-3">
        {details.software.map((s, i) => (
          <div
            key={s.name}
            className="grid sm:grid-cols-[1fr_1.3fr] bg-carbon overflow-hidden"
            style={{ borderRadius: 14 }}
          >
            <div className="p-6 lg:p-8 flex flex-col justify-center">
              <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-white/50">
                Module 0{i + 1}
              </p>
              <h4 className="text-white text-[20px] lg:text-[24px] font-semibold mt-2 leading-[1.15]">
                {s.name}
              </h4>
              <p className="text-white/70 text-[13.5px] mt-3 leading-relaxed max-w-[360px]">
                {s.caption}
              </p>
            </div>
            <div className="p-5 sm:p-6 flex items-center">
              <div
                className="w-full"
                style={{
                  padding: 8,
                  background:
                    "linear-gradient(155deg, #38383A 0%, #222224 45%, #141416 100%)",
                  borderRadius: 14,
                  boxShadow:
                    "0 20px 40px -20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <div
                  className="relative"
                  style={{
                    aspectRatio: "16 / 10",
                    borderRadius: 8,
                    overflow: "hidden",
                    background: "#111",
                  }}
                >
                  <Image
                    src={s.image}
                    alt={s.name}
                    fill
                    sizes="(min-width:1024px) 520px, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────
//  05 · Operational Workflow
// ─────────────────────────────────────────────────────────
function OperationalWorkflow({
  details,
  accent,
}: {
  details: Details;
  accent: string;
}) {
  return (
    <Card>
      <CardHead
        title="Operational workflow"
        desc="Every event moves through your team in one clear, accountable chain."
      />
      <div className="px-6 pb-8">
        <div
          className="bg-white p-6 lg:p-8"
          style={{ borderRadius: 14 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {details.operationalWorkflow.map((step, i) => (
              <div
                key={step}
                className="flex items-center gap-4"
                style={{ padding: "10px 4px" }}
              >
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[11.5px] font-semibold shrink-0"
                  style={{ background: `${accent}18`, color: accent }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[14px] font-medium text-carbon-alt">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────
//  Count-up helper
// ─────────────────────────────────────────────────────────
function CountUp({ value, suffix }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(eased * value);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  const rounded = Number.isInteger(value) ? Math.round(display) : display.toFixed(1);
  return (
    <span ref={ref}>
      {rounded}
      {suffix ?? ""}
    </span>
  );
}

// ─────────────────────────────────────────────────────────
//  06 · Business Benefits
// ─────────────────────────────────────────────────────────
function Benefits({ details, accent }: { details: Details; accent: string }) {
  return (
    <Card>
      <CardHead
        title="Business benefits"
        desc="Real outcomes from real deployments — measured across every rollout."
      />
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {details.benefits.map((b) => (
            <div
              key={b.label}
              className="bg-white p-6 flex flex-col justify-between"
              style={{ borderRadius: 14, minHeight: 160 }}
            >
              <span
                className="text-[40px] lg:text-[52px] font-bold leading-[1] tracking-tight"
                style={{ color: accent }}
              >
                <CountUp value={b.value} suffix={b.suffix} />
              </span>
              <p className="text-[13px] font-medium text-graphite-alt mt-3 leading-snug">
                {b.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────
//  07 · Case Studies — 3-card grid, full-bleed image,
//  gradient overlay, orange stat pill, hover reveal
// ─────────────────────────────────────────────────────────
function CaseStudy({
  industry,
  details,
}: {
  industry: IndustryLite;
  details: Details;
}) {
  return (
    <Card>
      <CardHead
        title="Case studies"
        desc="Real operators. Real facilities. Measured outcomes across every deployment."
      />
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {details.caseStudies.map((cs) => (
            <div
              key={cs.company}
              className="group relative overflow-hidden cursor-pointer"
              style={{ borderRadius: 14, aspectRatio: "3 / 4" }}
            >
              {/* Full-bleed image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cs.image}
                alt={cs.company}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />

              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 50%, transparent 100%)",
                }}
              />

              {/* Stat pill — top right */}
              <div className="absolute top-4 right-4">
                <div
                  className="px-3 py-1.5 rounded-full"
                  style={{
                    background: `${industry.accent}E6`,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <span className="text-[13px] font-bold text-white">
                    {cs.stat}
                  </span>
                </div>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="transition-all duration-400 group-hover:opacity-0 group-hover:translate-y-2">
                  <p className="text-[10px] font-semibold text-white/60 uppercase tracking-widest mb-1">
                    {cs.meta}
                  </p>
                  <p className="text-[16px] font-bold text-white leading-tight">
                    {cs.company}
                  </p>
                </div>

                <div className="absolute bottom-5 left-5 right-5 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                  <p className="text-[11px] font-semibold text-white/60 uppercase tracking-widest mb-2">
                    {cs.company}
                  </p>
                  <p className="text-[13px] text-white leading-relaxed mb-3">
                    {cs.result}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-[11px] font-bold uppercase tracking-wider"
                      style={{ color: industry.accent }}
                    >
                      {cs.statLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────
//  08 · Why RAMS — clean editorial 3-column grid
// ─────────────────────────────────────────────────────────
function WhyChoose({ details, accent }: { details: Details; accent: string }) {
  return (
    <Card>
      <CardHead
        title="Why RAMS"
        desc="The capabilities that decide contracts — end-to-end, in one platform."
      />
      <div className="px-6 pb-6">
        <div
          className="bg-white p-6 lg:p-10"
          style={{ borderRadius: 14 }}
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
            {details.whyChoose.map((w, i) => (
              <div key={w.title} className="flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="text-[11px] font-bold tracking-[0.2em]"
                    style={{ color: accent }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div
                    className="h-px flex-1"
                    style={{ background: "#E5E5EA" }}
                  />
                </div>
                <h4
                  className="text-[15px] font-semibold text-carbon-alt leading-[1.25]"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {w.title}
                </h4>
                <p className="text-[12.5px] text-graphite-alt mt-1.5 leading-relaxed">
                  {w.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────
//  09 · CTA — final block
// ─────────────────────────────────────────────────────────
function CtaBlock({
  details,
  onClose,
}: {
  details: Details;
  onClose: () => void;
}) {
  return (
    <div className="px-10 sm:px-20 lg:px-28 pt-4 pb-4 text-center">
      <h3
        className="text-[28px] sm:text-[36px] lg:text-[44px] font-bold text-carbon-alt leading-[1.08]"
        style={{ letterSpacing: "-0.02em" }}
      >
        {details.cta.heading}
      </h3>
      <p className="mt-4 text-[15px] lg:text-[17px] text-graphite-alt max-w-[520px] mx-auto leading-relaxed">
        {details.cta.sub}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
        <button
          type="button"
          className="rounded-full text-white text-[13.5px] font-medium px-6 py-3 transition-transform hover:scale-[1.03]"
          style={{ background: "var(--color-carbon)" }}
        >
          Book a demo
        </button>
        <button
          type="button"
          className="rounded-full text-carbon text-[13.5px] font-medium px-6 py-3 transition-colors hover:bg-black/5"
          style={{ border: "1px solid rgba(0,0,0,0.15)" }}
        >
          Talk to an engineer
        </button>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="mt-8 inline-flex items-center gap-1.5 text-graphite-alt hover:text-carbon text-[12.5px] font-medium transition-colors"
      >
        Back to industries <ArrowUpRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
