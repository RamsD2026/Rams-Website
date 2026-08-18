"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

const STATS = [
  { value: "< 50ms", label: "Edge response" },
  { value: "100%",   label: "Fleet visibility" },
  { value: "40%↓",   label: "Impact events" },
  { value: "24/7",   label: "Live telemetry" },
];

export function MepsHero() {
  return (
    <section
      className="relative overflow-hidden bg-carbon pt-[180px] sm:pt-[200px] lg:pt-[220px] pb-24 sm:pb-32 lg:pb-[140px]"
    >
      {/* Blueprint grid */}
      <div aria-hidden className="absolute inset-0 opacity-[0.05]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="meps-grid" width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M 56 0 L 0 0 0 56" fill="none" stroke="var(--color-signal-orange)" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#meps-grid)" />
        </svg>
      </div>

      {/* Orange radial accent */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: -280,
          right: -240,
          width: 720,
          height: 720,
          borderRadius: 9999,
          background: "radial-gradient(circle, rgba(255,106,0,0.18) 0%, rgba(255,106,0,0) 62%)",
        }}
      />

      {/* Cross-hair frame accents */}
      <div aria-hidden className="absolute left-6 lg:left-14 top-[128px] w-3 h-3 border-l border-t border-signal-orange/40" />
      <div aria-hidden className="absolute right-6 lg:right-14 top-[128px] w-3 h-3 border-r border-t border-signal-orange/40" />

      <div className="relative mx-auto max-w-[1280px] px-6 lg:px-14">
        {/* Breadcrumb + product tag */}
        <div className="flex items-center gap-4 flex-wrap mb-10">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-mono font-medium tracking-[0.22em] uppercase text-white/50"
          >
            <Link href="/platform" className="hover:text-signal-orange transition-colors">
              Platform
            </Link>
            <span className="mx-3 text-white/25">/</span>
            <span className="text-white">MEPS</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="inline-flex items-center gap-2.5 border border-signal-orange/40 bg-signal-orange/[0.08] px-3 py-1.5"
          >
            <span className="w-1.5 h-1.5 bg-signal-orange animate-pulse" />
            <span className="text-[10.5px] font-mono font-bold tracking-[0.22em] uppercase text-signal-orange">
              MHE Efficiency and Productivity System
            </span>
          </motion.div>
        </div>

        {/* Headline block — full width, center of composition */}
        <div className="max-w-[1020px]">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="text-[44px] sm:text-[64px] md:text-[80px] lg:text-[96px] text-white font-bold leading-[1.02] tracking-[-0.025em]"
          >
            Every forklift, tracked.
            <br />
            <span className="text-signal-orange">Every second, optimised.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.28 }}
            className="mt-8 text-[17px] sm:text-[19px] lg:text-[20px] text-white/60 leading-[1.6] max-w-[680px]"
          >
            MEPS turns your MHE fleet into a live, measurable, and controllable
            system — vehicle telemetry, operator behaviour, and utilisation
            intelligence unified at the edge.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.38 }}
            className="mt-10 flex flex-col sm:flex-row gap-3"
          >
            <Link
              href="/book-a-demo"
              className="group inline-flex items-center gap-2 bg-signal-orange hover:bg-signal-orange-hover px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-px"
            >
              Book a Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </Link>
            <Link
              href="/platform"
              className="inline-flex items-center gap-2 border border-white/20 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/40 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200"
            >
              <Play className="w-3.5 h-3.5" aria-hidden="true" />
              See the Platform
            </Link>
          </motion.div>
        </div>

        {/* Stats band — horizontal, full width */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 sm:mt-24 border-t border-white/10 pt-10"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`${
                  i > 0 ? "lg:border-l lg:border-white/10 lg:pl-8" : ""
                }`}
              >
                <div className="text-[36px] sm:text-[44px] lg:text-[52px] font-bold text-white leading-none tracking-[-0.02em] tabular-nums">
                  {s.value}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-signal-orange" />
                  <span className="text-[10.5px] font-mono font-bold tracking-[0.2em] uppercase text-white/55">
                    {s.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
