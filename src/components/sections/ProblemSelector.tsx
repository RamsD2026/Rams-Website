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
    image: "/Card 1 %E2%80%94 Rack Safety and Compliance.png",
    href: "/solutions/rack-safety",
    wide: true,
  },
  {
    id: "mhe-safety",
    title: "MHE Safety",
    tagline: "See every risk in motion",
    subline: "Speed violations, near-misses and fleet utilisation tracked continuously.",
    image: "/Card 2 %E2%80%94 MHE Safety and Productivity.png",
    href: "/solutions/mhe-intelligence",
    wide: false,
  },
  {
    id: "inventory",
    title: "Inventory",
    tagline: "Reconcile what's lost or misplaced",
    subline: "Physical reality versus WMS records — resolved without manual audits.",
    image: "/Card 3 %E2%80%94 Inventory Mismatch and Lost Pallets.png",
    href: "/solutions/inventory-intelligence",
    wide: false,
  },
  {
    id: "execution",
    title: "Execution",
    tagline: "Right task, right operator, verified",
    subline: "Task sequencing, MHE allocation and physical confirmation in one system.",
    image: "/Card 4 %E2%80%94 Warehouse Execution.png",
    href: "/solutions/warehouse-execution",
    wide: false,
  },
  {
    id: "mhe-health",
    title: "MHE Health",
    tagline: "Usage-based, not calendar-based",
    subline: "Actual condition and behaviour determine when maintenance is needed.",
    image: "/th Card 5 %E2%80%94 MHE Health and Maintenance.png",
    href: "/solutions/mhe-diagnostics",
    wide: false,
  },
  {
    id: "management",
    title: "Management Visibility",
    tagline: "One view across all operations",
    subline: "Safety, productivity, inventory and equipment health on a single screen.",
    image: "/6th - Management Visibility.png",
    href: "/solutions/aims",
    wide: true,
  },
] as const;

function ProblemCard({
  problem,
  delay,
}: {
  problem: (typeof PROBLEMS)[number];
  delay: number;
}) {
  const spanClass = problem.wide
    ? "col-span-1 sm:col-span-2 lg:col-span-2"
    : "col-span-1";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-6% 0px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden h-[240px] sm:h-[340px] lg:h-[480px] ${spanClass}`}
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

      {/* Cover baked-in numbers */}
      <div className="absolute top-0 left-0 right-0 h-2/5 bg-black" />

      {/* Top-right arrow — visible on hover */}
      <Link
        href={problem.href}
        className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 sm:w-9 sm:h-9 rounded-none border border-white/40 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
        aria-label={`Explore ${problem.title}`}
      >
        <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </Link>

      {/* Default label — fades out on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 transition-opacity duration-250 group-hover:opacity-0">
        <h3 className="text-[17px] sm:text-[20px] lg:text-[21px] font-bold text-white leading-tight">
          {problem.title}
        </h3>
        <p className="mt-1 sm:mt-1.5 text-[11.5px] sm:text-[12.5px] text-white/55 leading-snug">
          {problem.tagline}
        </p>
      </div>

      {/* Hover panel — slides up with side margin */}
      <div className="absolute bottom-0 left-3 right-3 sm:left-4 sm:right-4 bg-white p-5 sm:p-7 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
        {/* Orange accent bar */}
        <div className="w-8 h-[3px] bg-signal-orange mb-3 sm:mb-4" />

        <h3 className="text-[17px] sm:text-[20px] font-bold text-carbon leading-tight">
          {problem.title}
        </h3>
        <p className="mt-1.5 sm:mt-2 text-[12px] sm:text-[13px] font-semibold text-graphite/70 leading-relaxed">
          {problem.tagline}
        </p>
        <p className="mt-1 sm:mt-1.5 text-[11.5px] sm:text-[12.5px] text-graphite/45 leading-relaxed hidden sm:block">
          {problem.subline}
        </p>
        <Link
          href={problem.href}
          className="mt-4 sm:mt-5 inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.16em] uppercase text-carbon hover:text-signal-orange transition-colors duration-200 group/cta"
        >
          Explore
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
        </Link>
      </div>
    </motion.div>
  );
}

export function ProblemSelector() {
  return (
    <section className="bg-white pt-16 sm:pt-24 pb-0">

      {/* ── Header — contained to 1280px ── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-signal-orange mb-4"
          >
            Solutions
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.65, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-[34px] sm:text-[46px] md:text-[56px] lg:text-[68px] font-bold text-carbon leading-[1.04] max-w-[820px]"
          >
            Every operational gap,
            <br className="hidden sm:block" />
            {" "}<span className="text-signal-orange">made visible.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-4 sm:mt-5 text-[14px] sm:text-[16px] text-graphite/50 leading-relaxed max-w-[520px]"
          >
            RAMS addresses the six areas where warehouses lose control — safety, inventory, equipment, people, execution, and visibility.
          </motion.p>
        </div>
      </div>

      {/* ── Bento grid — inside 1280px container ── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <ProblemCard problem={PROBLEMS[0]} delay={0.05} />
          <ProblemCard problem={PROBLEMS[1]} delay={0.10} />
          <ProblemCard problem={PROBLEMS[2]} delay={0.15} />

          <ProblemCard problem={PROBLEMS[3]} delay={0.20} />
          <ProblemCard problem={PROBLEMS[4]} delay={0.25} />
          <ProblemCard problem={PROBLEMS[5]} delay={0.30} />
        </div>
      </div>

    </section>
  );
}
