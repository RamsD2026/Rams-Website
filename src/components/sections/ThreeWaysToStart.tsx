"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import Image from "next/image";

type CaseStudy = {
  image: string;
  company: string;
  industry: string;
  result: string;
  stat: string;
  statLabel: string;
};

type Way = {
  id: string;
  image: string;
  title: string;
  shortDescription: string;
  problem: string;
  solution: string;
  modules: string[];
  stat: { value: string; label: string };
  caseStudies: CaseStudy[];
  cta: string;
};

const WAYS: Way[] = [
  {
    id: "services",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80",
    title: "Services",
    shortDescription:
      "On-site engineering — rack inspection, structural verification, inventory reconciliation. No hardware install, no software rollout.",
    problem:
      "Sites operate on estimates rather than verified engineering data — rack condition, structural fatigue and inventory position remain unproven until an incident, an audit or a stock loss forces the question.",
    solution:
      "RAMS engineers deliver a focused on-site intervention that produces a verifiable picture of your current operation — a compliance-ready baseline you can act on immediately, with no hardware install and no software rollout required.",
    modules: ["Rack Inspection", "Structural Verification", "Inventory Reconciliation"],
    stat: { value: "48h", label: "typical turnaround for a full site engineering baseline" },
    caseStudies: [
      {
        image: "https://picsum.photos/seed/services-dhl/800/600",
        company: "DHL Supply Chain",
        industry: "3PL · 280,000 sq ft",
        result: "Full rack certification baseline delivered across 12 aisles in 2 days.",
        stat: "2d",
        statLabel: "site baseline",
      },
      {
        image: "https://picsum.photos/seed/services-wool/800/600",
        company: "Woolworths Group",
        industry: "Retail Distribution",
        result: "Inventory reconciliation surfaced £1.2m of misplaced stock in one audit.",
        stat: "£1.2m",
        statLabel: "stock recovered",
      },
      {
        image: "https://picsum.photos/seed/services-toll/800/600",
        company: "Toll Group",
        industry: "Freight & Logistics",
        result: "Structural fatigue report unlocked insurance renewal without capex delay.",
        stat: "100%",
        statLabel: "audit pass",
      },
    ],
    cta: "Learn more",
  },
  {
    id: "hardware",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
    title: "Hardware",
    shortDescription:
      "Standalone RAMS devices — AI Vision, OmniBox edge, RTLS, sensors. Works alone, connects to the platform when you're ready.",
    problem:
      "Blind spots on the floor turn into repeated damage, missed movements and reactive maintenance — with no captured evidence to close the incident or drive the next decision.",
    solution:
      "Deploy a RAMS device where you need eyes on the floor and start capturing verified ground-truth immediately. Each unit runs its own edge inference, stores locally and reports on its own dashboard — and connects natively to the wider platform when you're ready to scale.",
    modules: ["AI Vision", "OmniBox Edge", "RTLS & Sensors"],
    stat: { value: "24h", label: "from install to first verified event on the floor" },
    caseStudies: [
      {
        image: "https://picsum.photos/seed/hardware-coles/800/600",
        company: "Coles Group",
        industry: "Retail DC · VIC",
        result: "AI Vision device flagged 4 previously undetected rack strikes per week.",
        stat: "4×",
        statLabel: "strikes caught",
      },
      {
        image: "https://picsum.photos/seed/hardware-auspost/800/600",
        company: "Australia Post",
        industry: "Parcel Logistics",
        result: "OmniBox edge deployed at loading dock cut misloads by 62%.",
        stat: "62%",
        statLabel: "fewer misloads",
      },
      {
        image: "https://picsum.photos/seed/hardware-kmart/800/600",
        company: "Kmart Distribution",
        industry: "Retail · National",
        result: "RTLS-tracked fleet reduced MHE idle time by 38% across two shifts.",
        stat: "38%",
        statLabel: "less idle time",
      },
    ],
    cta: "Learn more",
  },
  {
    id: "software",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
    title: "Software",
    shortDescription:
      "Deploy the RAMS platform — Digital Twin, ATOS execution, AIMS intelligence. With or without RAMS hardware.",
    problem:
      "Task plans, execution and site performance live in separate systems — leadership sees a lagging report, not the live state of what is happening on the floor right now.",
    solution:
      "Roll out the RAMS platform to orchestrate tasks, verify physical execution and give management one operating view across every site — deployable on top of your existing hardware, or paired with RAMS devices for full ground-truth verification.",
    modules: ["Digital Twin", "ATOS", "AIMS"],
    stat: { value: "1", label: "operating view across every site and every shift" },
    caseStudies: [
      {
        image: "https://picsum.photos/seed/software-wool/800/600",
        company: "Woolworths Group",
        industry: "Retail Distribution · 5 sites",
        result: "Digital Twin rolled out across 5 sites in 90 days with zero downtime.",
        stat: "90d",
        statLabel: "multi-site rollout",
      },
      {
        image: "https://picsum.photos/seed/software-bluescope/800/600",
        company: "BlueScope Steel",
        industry: "Heavy Industry",
        result: "ATOS orchestration cut average task wait time by 45% across shifts.",
        stat: "45%",
        statLabel: "less wait time",
      },
      {
        image: "https://picsum.photos/seed/software-toll/800/600",
        company: "Toll Group",
        industry: "Freight & Logistics",
        result: "AIMS gave executive team one operational view across the entire network.",
        stat: "1",
        statLabel: "operational view",
      },
    ],
    cta: "Learn more",
  },
];

function WayModal({ way, onClose }: { way: Way; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] overflow-y-auto"
      onClick={onClose}
    >
      {/* Backdrop — non-scrolling */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-none" />

      {/* Scroll container — page-level scroll */}
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

          {/* ── Section 1 — Heading ── */}
          <div className="px-10 sm:px-20 lg:px-28 pt-16 pb-6">
            <p className="text-[20px] font-bold tracking-[0.04em] uppercase text-signal-orange mb-5">
              {way.title}
            </p>
            <h2
              className="text-[42px] sm:text-[60px] lg:text-[68px] font-bold text-carbon-alt leading-[1.04]"
              style={{ letterSpacing: "-0.025em" }}
            >
              What&apos;s inside {way.title}.
            </h2>
          </div>

          {/* ── Section 2 — The Problem ── */}
          <div className="px-10 sm:px-20 lg:px-28 pb-10">
            <div className="bg-off-white-alt" style={{ borderRadius: "20px" }}>
              <div className="px-8 pt-8 pb-6">
                <p className="text-[18px] sm:text-[20px] text-carbon-alt leading-relaxed">
                  <span className="font-bold">The Problem.</span>{" "}
                  <span className="text-graphite-alt">{way.problem}</span>
                </p>
              </div>
              <div className="px-8 pb-8 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={way.image}
                  alt={way.title}
                  className="w-full object-cover object-center"
                  style={{ borderRadius: "14px", aspectRatio: "16 / 7" }}
                />
              </div>
            </div>
          </div>

          {/* ── Section 3 — How RAMS Solves It ── */}
          <div className="px-10 sm:px-20 lg:px-28 pb-10">
            <div className="bg-off-white-alt" style={{ borderRadius: "20px" }}>
              <div className="px-8 pt-8 pb-8">
                <p className="text-[18px] sm:text-[20px] text-carbon-alt leading-relaxed">
                  <span className="font-bold text-signal-orange">How RAMS solves it.</span>{" "}
                  <span className="text-graphite-alt">{way.solution}</span>
                </p>

                {/* Stat + modules inline */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mt-8 pt-8 border-t border-[#E5E5EA]">
                  <div className="shrink-0">
                    <span className="block text-[40px] font-bold text-signal-orange leading-none">
                      {way.stat.value}
                    </span>
                    <span className="block text-[12px] text-graphite-alt mt-1 max-w-[180px] leading-snug">
                      {way.stat.label}
                    </span>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-[#E5E5EA]" />
                  <div className="flex flex-wrap gap-2">
                    {way.modules.map((mod) => (
                      <span
                        key={mod}
                        className="inline-flex items-center px-3 py-1.5 rounded-full bg-white text-[12px] font-medium text-carbon"
                      >
                        {mod}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 4 — Case Studies ── */}
          <div className="px-10 sm:px-20 lg:px-28 pb-10">
            <h3
              className="text-[36px] sm:text-[48px] font-bold text-carbon-alt leading-[1.04] mb-8"
              style={{ letterSpacing: "-0.02em" }}
            >
              Explore case studies.
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {way.caseStudies.map((cs) => (
                <div
                  key={cs.company}
                  className="group relative overflow-hidden cursor-pointer"
                  style={{ borderRadius: "14px", aspectRatio: "3/4" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cs.image}
                    alt={cs.company}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />

                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)" }}
                  />

                  {/* Stat — top right */}
                  <div className="absolute top-4 right-4">
                    <div
                      className="px-3 py-1.5 rounded-full"
                      style={{ background: "rgba(255,106,0,0.9)", backdropFilter: "blur(8px)" }}
                    >
                      <span className="text-[13px] font-bold text-white">{cs.stat}</span>
                    </div>
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="transition-all duration-400 group-hover:opacity-0 group-hover:translate-y-2">
                      <p className="text-[10px] font-semibold text-white/50 uppercase tracking-widest mb-1">{cs.industry}</p>
                      <p className="text-[16px] font-bold text-white">{cs.company}</p>
                    </div>

                    <div className="absolute bottom-5 left-5 right-5 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                      <p className="text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-2">{cs.company}</p>
                      <p className="text-[13px] text-white leading-relaxed mb-3">{cs.result}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-signal-orange uppercase tracking-wider">{cs.statLabel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pb-10" />
        </motion.div>
      </div>
    </motion.div>
  );
}

export function ThreeWaysToStart() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = WAYS.find((w) => w.id === activeId) ?? null;

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8">

        {/* ── Header (centered · matches site heading system) ── */}
        <div className="text-center max-w-[1000px] mx-auto mb-14 sm:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[16px] font-bold tracking-[0.22em] uppercase text-signal-orange mb-3"
          >
            One Ecosystem · Three Ways to Start
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-[30px] sm:text-[42px] md:text-[50px] lg:text-[56px] font-bold text-carbon leading-[1.04]"
            style={{ letterSpacing: "-0.025em" }}
          >
            <span className="block sm:whitespace-nowrap">Start with a service, a device</span>
            <span className="block sm:whitespace-nowrap">or the <span className="text-signal-orange">platform.</span></span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-4 sm:mt-5 text-[14px] sm:text-[16px] text-graphite/50 leading-relaxed max-w-[560px] mx-auto"
          >
            RAMS is not one product to adopt on day one. Choose your entry point,
            prove the value, then connect the wider ecosystem when you&apos;re ready.
          </motion.p>
        </div>

        {/* ── 3-column grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {WAYS.map((way, i) => (
            <motion.div
              key={way.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group flex flex-col"
            >
              {/* Image */}
              <div className="relative w-full overflow-hidden bg-off-white-alt" style={{ aspectRatio: "4/3" }}>
                <Image
                  src={way.image}
                  alt={way.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Title */}
              <h3
                className="text-[24px] sm:text-[26px] font-semibold text-carbon leading-[1.15]"
                style={{ letterSpacing: "-0.015em", marginTop: 32 }}
              >
                {way.title}
              </h3>

              {/* Description */}
              <p
                className="text-[14.5px] text-graphite/70 leading-[1.65]"
                style={{ marginTop: 16 }}
              >
                {way.shortDescription}
              </p>

              {/* Learn more button (opens modal) */}
              <button
                type="button"
                onClick={() => setActiveId(way.id)}
                className="inline-flex items-center gap-1.5 self-start text-[13.5px] font-semibold text-carbon hover:text-signal-orange transition-colors duration-200 cursor-pointer"
                style={{ marginTop: 24 }}
              >
                {way.cta}
                <ArrowRight
                  className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <WayModal
            way={active}
            onClose={() => setActiveId(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
