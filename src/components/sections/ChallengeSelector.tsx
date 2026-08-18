"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const CHALLENGES = [
  {
    id: "rack-safety",
    label: "Rack Safety & Compliance",
    cta: "Explore Rack Safety",
    headline: "Identify damage before incidents.",
    description:
      "Damaged racks, unknown structural condition, repeated MHE impacts, open corrective actions and poor inspection records — RAMS makes every compliance gap visible before it becomes a liability.",
    image: "/Card 1 %E2%80%94 Rack Safety and Compliance.png",
    problem:
      "Damaged or overloaded racking goes undetected until it's too late — putting people, inventory, and compliance at risk across every aisle.",
    solution:
      "RAMS AI Vision continuously monitors rack health, flags structural damage the moment it occurs, and triggers automated inspection workflows before incidents escalate.",
    modules: ["AI Vision", "Rack Certification", "Compliance Audit"],
    stat: { value: "87%", label: "reduction in rack-related incidents" },
    href: "/solutions/rack-safety",
  },
  {
    id: "mhe-tracking",
    label: "MHE Safety & Tracking",
    cta: "Track Your Fleet",
    headline: "See every risk in motion.",
    description:
      "Speed violations, near-misses and fleet utilisation tracked continuously across every shift — with automated alerts before incidents occur.",
    image: "/Card 2 %E2%80%94 MHE Safety and Productivity.png",
    problem:
      "Forklifts and MHEs operate without real-time oversight — leading to near-misses, rack strikes, and unplanned downtime that disrupts operations.",
    solution:
      "RAMS tracks every MHE movement, detects rack collisions in real time, and logs every incident for compliance reporting and maintenance workflows.",
    modules: ["AI Vision", "IoT Sensors", "Incident Tracking"],
    stat: { value: "3×", label: "faster incident response time" },
    href: "/solutions/mhe-intelligence",
  },
  {
    id: "mhe-health",
    label: "MHE Health & Maintenance",
    cta: "Explore Predictive Maintenance",
    headline: "Predict failure before it happens.",
    description:
      "Base maintenance decisions on actual equipment usage, condition and operational behaviour — not only on fixed calendar intervals.",
    image: "/Card 5 - MHE Health and Maintenance.png",
    problem:
      "Unexpected breakdowns, calendar-based schedules and limited usage data drive up costs — battery inefficiency and incomplete equipment history leave leaders guessing on every spend.",
    solution:
      "RAMS unifies usage telemetry, condition monitoring and operational behaviour into a predictive maintenance engine — replacing fixed schedules with data-driven decisions and a complete equipment history.",
    modules: ["MHE Diagnostics", "Predictive Analytics", "Battery Intelligence"],
    stat: { value: "40%", label: "reduction in unplanned maintenance costs" },
    href: "/solutions/mhe-health",
  },
  {
    id: "asset-management",
    label: "Inventory & Assets",
    cta: "Eliminate Blind Spots",
    headline: "Reconcile inventory without audits.",
    description:
      "Physical reality versus WMS records — reconciled in real time without manual audits, cycle counts, or costly guesswork.",
    image: "/Card 3 %E2%80%94 Inventory Mismatch and Lost Pallets.png",
    problem:
      "Assets disappear, misplace, or sit idle across shifts — creating blind spots that cost time and money without a clear trace of what happened.",
    solution:
      "RAMS Digital Twin tracks every asset in real time with spatial mapping and IoT sensors, giving your team instant visibility across the entire facility.",
    modules: ["Digital Twin", "IoT Sensors", "AIMS Dashboard"],
    stat: { value: "100%", label: "asset visibility across the facility" },
    href: "/solutions/inventory-intelligence",
  },
  {
    id: "warehouse-execution",
    label: "Warehouse Execution",
    cta: "Explore Warehouse Execution",
    headline: "Right task, right operator, right sequence.",
    description:
      "Assign the right task to the right operator and MHE, in the right sequence — and verify that the required physical action was completed correctly.",
    image: "/Card 4 - Warehouse Execution.png",
    problem:
      "Delayed tasks, poor sequencing and wrong MHE allocation stack up into long waiting times, delayed replenishment and missed near-expiry actions — with operations too dependent on individual operators.",
    solution:
      "RAMS orchestrates every task across operators and MHE in the correct sequence, then verifies the physical action was completed — closing the loop between plan and execution on the floor.",
    modules: ["Task Orchestration", "MHE Allocation", "Execution Verification"],
    stat: { value: "2×", label: "faster task completion across shifts" },
    href: "/solutions/warehouse-execution",
  },
  {
    id: "management-visibility",
    label: "Management Visibility",
    cta: "Explore AIMS",
    headline: "One view across every operation.",
    description:
      "Fragmented data, limited cross-site comparisons, unclear investment priorities and no closure visibility — AIMS gives leadership the single source of truth to make decisions with confidence.",
    image: "/6th - Management Visibility.png",
    problem:
      "Fragmented operational data across sites makes it impossible to compare performance, identify cost drivers, or track corrective actions to closure.",
    solution:
      "AIMS consolidates safety, productivity, inventory and equipment health into one enterprise dashboard — with cross-site analytics and closure tracking built in.",
    modules: ["AIMS Dashboard", "Cross-Site Analytics", "Custom Reporting"],
    stat: { value: "1", label: "platform for every operational insight" },
    href: "/solutions/aims",
  },
] as const;

type Challenge = (typeof CHALLENGES)[number];

function ChallengeModal({ challenge, onClose }: { challenge: Challenge; onClose: () => void }) {
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
              {challenge.label}
            </p>
            <h2
              className="text-[42px] sm:text-[60px] lg:text-[68px] font-bold text-carbon-alt leading-[1.04]"
              style={{ letterSpacing: "-0.025em" }}
            >
              What&apos;s inside {challenge.label}.
            </h2>
          </div>

          {/* ── Section 2 — The Problem ── */}
          <div className="px-10 sm:px-20 lg:px-28 pb-10">
            <div className="bg-off-white-alt" style={{ borderRadius: "20px" }}>
              <div className="px-8 pt-8 pb-6">
                <p className="text-[18px] sm:text-[20px] text-carbon-alt leading-relaxed">
                  <span className="font-bold">The Problem.</span>{" "}
                  <span className="text-graphite-alt">{challenge.problem}</span>
                </p>
              </div>
              <div className="px-6 pb-6 overflow-hidden" style={{ borderRadius: "0 0 20px 20px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={challenge.image}
                  alt={challenge.label}
                  className="w-full object-cover object-top"
                  style={{ borderRadius: "14px" }}
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
                  <span className="text-graphite-alt">{challenge.solution}</span>
                </p>

                {/* Stat + modules inline */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mt-8 pt-8" style={{ borderTop: "1px solid #E5E5EA" }}>
                  <div className="shrink-0">
                    <span className="block text-[40px] font-bold text-signal-orange leading-none">
                      {challenge.stat.value}
                    </span>
                    <span className="block text-[12px] text-graphite-alt mt-1 max-w-[180px] leading-snug">
                      {challenge.stat.label}
                    </span>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-[#E5E5EA]" />
                  <div className="flex flex-wrap gap-2">
                    {challenge.modules.map((mod) => (
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
              {[
                {
                  image: "https://picsum.photos/seed/warehouse-rack/800/600",
                  company: "DHL Supply Chain",
                  industry: "3PL · 280,000 sq ft",
                  result: "87% reduction in rack-related incidents within 90 days of deployment.",
                  stat: "87%", statLabel: "fewer incidents",
                },
                {
                  image: "https://picsum.photos/seed/logistics-corp/800/600",
                  company: "Woolworths Group",
                  industry: "Retail Distribution · 5 sites",
                  result: "Full compliance audit completed in 2 days — previously took 3 weeks manually.",
                  stat: "10×", statLabel: "faster audits",
                },
                {
                  image: "https://picsum.photos/seed/freight-ops/800/600",
                  company: "Toll Group",
                  industry: "Freight & Logistics · AU",
                  result: "Zero critical rack failures recorded in 18 months following RAMS deployment.",
                  stat: "0", statLabel: "critical failures",
                },
              ].map((cs) => (
                <div
                  key={cs.company}
                  className="group relative overflow-hidden cursor-pointer"
                  style={{ borderRadius: "14px", aspectRatio: "3/4" }}
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
                    {/* Default: company + industry */}
                    <div className="transition-all duration-400 group-hover:opacity-0 group-hover:translate-y-2">
                      <p className="text-[10px] font-semibold text-white/50 uppercase tracking-widest mb-1">{cs.industry}</p>
                      <p className="text-[16px] font-bold text-white">{cs.company}</p>
                    </div>

                    {/* Hover: result + company */}
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

function ChallengeCard({
  challenge,
  delay,
  index,
  onOpen,
}: {
  challenge: Challenge;
  delay: number;
  index: number;
  onOpen: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col overflow-hidden cursor-pointer"
      style={{ borderRadius: "12px", border: "1px solid #E8E8ED", background: "var(--color-off-white-hover)" }}
      onClick={onOpen}
    >
      {/* ── Top: text ── */}
      <div className="relative px-6 pt-8 pb-7 overflow-hidden">
        <h3
          className="relative text-[22px] font-bold text-carbon leading-[1.2] mb-4 truncate"
          style={{ letterSpacing: "-0.015em" }}
        >
          {challenge.label}
        </h3>
        <p className="text-[13px] text-graphite-alt leading-relaxed line-clamp-3">
          {challenge.description}
        </p>
      </div>

      {/* ── Middle: image with margin ── */}
      <div className="px-4 pb-1">
      <div className="relative overflow-hidden" style={{ height: "260px", borderRadius: "8px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={challenge.image}
          alt={challenge.label}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />

      </div>
      </div>

      {/* ── Bottom: CTA pill ── */}
      <div className="px-6 py-5">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onOpen(); }}
          className="group/cta relative w-full flex items-center justify-center px-4 py-2.5 text-[10px] font-bold tracking-[0.16em] uppercase overflow-hidden transition-colors duration-300"
          style={{ border: "1px solid #D1D1D6" }}
        >
          <span className="absolute inset-0 bg-signal-orange origin-bottom scale-y-0 group-hover/cta:scale-y-100 transition-transform duration-300 ease-out" />
          <span className="relative z-10 text-carbon group-hover/cta:text-white transition-colors duration-300">{challenge.cta}</span>
        </button>
      </div>
    </motion.div>
  );
}

export function ChallengeSelector() {
  const [modalChallenge, setModalChallenge] = useState<Challenge | null>(null);

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center max-w-[1200px] mx-auto mb-14 sm:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[16px] font-bold tracking-[0.22em] uppercase text-signal-orange mb-3"
          >
            Solutions
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-[34px] sm:text-[46px] md:text-[56px] lg:text-[68px] font-bold text-carbon leading-[1.04]"
            style={{ letterSpacing: "-0.025em" }}
          >
            <span className="block sm:whitespace-nowrap">What operational challenge</span>
            <span className="block sm:whitespace-nowrap">are you <span className="text-signal-orange">solving today?</span></span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-4 sm:mt-5 text-[14px] sm:text-[16px] text-graphite/50 leading-relaxed max-w-[520px] mx-auto"
          >
            Choose your operational priority and discover how RAMS delivers the right combination of engineering, AI, hardware and software to solve it.
          </motion.p>
        </div>

        {/* ── 3 × 2 Card grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHALLENGES.map((challenge, i) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              delay={0.04 * i}
              index={i}
              onOpen={() => setModalChallenge(challenge)}
            />
          ))}
        </div>

      </div>

      <AnimatePresence>
        {modalChallenge && (
          <ChallengeModal
            challenge={modalChallenge}
            onClose={() => setModalChallenge(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
