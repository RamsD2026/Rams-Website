"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const PROBLEMS = [
  {
    id: "rack-safety",
    title: "Rack Safety",
    tagline: "Identify damage before it disrupts",
    subline: "Compliance gaps, impact history and repair priorities — all in one view.",
    image: "/Card 1 \u2014 Rack Safety and Compliance.png",
    href: "/solutions/rack-safety",
    span: "col-span-2",
  },
  {
    id: "mhe-safety",
    title: "MHE Safety",
    tagline: "See every risk in motion",
    subline: "Speed violations, near-misses and fleet utilisation tracked continuously.",
    image: "/Card 2 \u2014 MHE Safety and Productivity.png",
    href: "/solutions/mhe-intelligence",
    span: "col-span-1",
  },
  {
    id: "inventory",
    title: "Inventory",
    tagline: "Reconcile what's lost or misplaced",
    subline: "Physical reality versus WMS records — resolved without manual audits.",
    image: "/Card 3 \u2014 Inventory Mismatch and Lost Pallets.png",
    href: "/solutions/inventory-intelligence",
    span: "col-span-1",
  },
  {
    id: "execution",
    title: "Execution",
    tagline: "Right task, right operator, verified",
    subline: "Task sequencing, MHE allocation and physical confirmation in one system.",
    image: "/Card 4 \u2014 Warehouse Execution.png",
    href: "/solutions/warehouse-execution",
    span: "col-span-1",
  },
  {
    id: "mhe-health",
    title: "MHE Health",
    tagline: "Usage-based, not calendar-based",
    subline: "Actual condition and behaviour determine when maintenance is needed.",
    image: "/th Card 5 \u2014 MHE Health and Maintenance.png",
    href: "/solutions/mhe-diagnostics",
    span: "col-span-1",
  },
  {
    id: "management",
    title: "Management Visibility",
    tagline: "One view across all operations",
    subline: "Safety, productivity, inventory and equipment health on a single screen.",
    image: "/6th - Management Visibility.png",
    href: "/solutions/aims",
    span: "col-span-2",
  },
] as const;

function ProblemCard({
  problem,
  rowHeight,
  delay,
}: {
  problem: (typeof PROBLEMS)[number];
  rowHeight: number;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-6% 0px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden ${problem.span}`}
      style={{ height: rowHeight }}
    >
      {/* Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={problem.image}
        alt={problem.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />

      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

      {/* Top-right arrow — visible on hover */}
      <Link
        href={problem.href}
        className="absolute top-5 right-5 w-9 h-9 rounded-full border border-white/40 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
        aria-label={`Explore ${problem.title}`}
      >
        <ArrowUpRight className="w-4 h-4" />
      </Link>

      {/* Default label — fades out on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-7 transition-opacity duration-250 group-hover:opacity-0">
        <h3 className="text-[21px] font-bold text-white leading-tight">
          {problem.title}
        </h3>
        <p className="mt-1.5 text-[12.5px] text-white/55 leading-snug">
          {problem.tagline}
        </p>
      </div>

      {/* Hover panel — slides up with side margin */}
      <div className="absolute bottom-0 left-4 right-4 bg-white p-7 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
        {/* Orange accent bar */}
        <div className="w-8 h-[3px] bg-[#FF6A00] mb-4" />

        <h3 className="text-[20px] font-bold text-[#0E0E0F] leading-tight">
          {problem.title}
        </h3>
        <p className="mt-2 text-[13px] font-semibold text-[#33363A]/70 leading-relaxed">
          {problem.tagline}
        </p>
        <p className="mt-1.5 text-[12.5px] text-[#33363A]/45 leading-relaxed">
          {problem.subline}
        </p>
        <Link
          href={problem.href}
          className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.16em] uppercase text-[#0E0E0F] hover:text-[#FF6A00] transition-colors duration-200 group/cta"
        >
          Explore
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
        </Link>
      </div>
    </motion.div>
  );
}

export function ProblemSelector() {
  const ROW_H = 480;

  return (
    <section className="bg-white pt-24 pb-0">
      <div className="w-full px-8">

        {/* ── Header ── */}
        <div className="mb-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-[#FF6A00] mb-4"
          >
            Solutions
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.65, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-[52px] md:text-[68px] font-bold text-[#0E0E0F] leading-[1.04] max-w-[820px]"
          >
            Every operational gap,
            <br />
            <span className="text-[#FF6A00]">made visible.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-5 text-[16px] text-[#33363A]/50 leading-relaxed max-w-[520px]"
          >
            RAMS addresses the six areas where warehouses lose control — safety, inventory, equipment, people, execution, and visibility.
          </motion.p>
        </div>

        {/* ── Bento grid ── */}
        {/* Row 1: [2col] [1col] [1col]  */}
        {/* Row 2: [1col] [1col] [2col]  */}
        <div className="grid grid-cols-4 gap-3">
          <ProblemCard problem={PROBLEMS[0]} rowHeight={ROW_H} delay={0.05} />
          <ProblemCard problem={PROBLEMS[1]} rowHeight={ROW_H} delay={0.10} />
          <ProblemCard problem={PROBLEMS[2]} rowHeight={ROW_H} delay={0.15} />

          <ProblemCard problem={PROBLEMS[3]} rowHeight={ROW_H} delay={0.20} />
          <ProblemCard problem={PROBLEMS[4]} rowHeight={ROW_H} delay={0.25} />
          <ProblemCard problem={PROBLEMS[5]} rowHeight={ROW_H} delay={0.30} />
        </div>

      </div>
    </section>
  );
}
