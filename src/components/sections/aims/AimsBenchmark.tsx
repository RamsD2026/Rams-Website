"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/**
 * Multi-site benchmarking.
 *
 * Built to the same pattern as the IRDS intelligence layer: radial ground,
 * centred header, and a device frame that bleeds off the bottom of the
 * section — KPIs across the top, the site ranking beneath.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const GREEN = "#54DE91";
const AMBER = "#F5B544";
const RED = "#FF6C6C";

const KPIS = [
  { label: "Connected sites", value: "24" },
  { label: "Median index", value: "86.4" },
  { label: "Leading site", value: "94.2" },
  { label: "Needs action", value: "3" },
];

const SITES: { rank: string; name: string; index: number; tone: string }[] = [
  { rank: "01", name: "Ahmedabad DC-04", index: 94.2, tone: GREEN },
  { rank: "02", name: "Bengaluru WH-02", index: 89.7, tone: GREEN },
  { rank: "03", name: "Chennai WH-01", index: 81.3, tone: AMBER },
  { rank: "04", name: "Pune DC-02", index: 68.9, tone: RED },
];

export function AimsBenchmark() {
  return (
    <section
      id="benchmarking"
      className="relative overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(80% 100% at 50% 100%, #1D1D1F 0%, #0E0E0F 60%, #08080A 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(to top, black 0%, black 70%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to top, black 0%, black 70%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 w-[720px] h-[720px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,106,0,0.18), transparent 70%)",
        }}
      />

      <div className="relative rams-container pt-20 sm:pt-28 lg:pt-32 pb-0">
        <div className="max-w-[1180px] mx-auto text-center mb-12 sm:mb-14">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange mb-5"
          >
            Multi-site benchmarking
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.85, ease: EASE }}
            className="text-[36px] sm:text-[54px] lg:text-[68px] font-bold leading-[1.05] tracking-[-0.04em]"
          >
            <span className="block text-white">
              Know where performance leads
            </span>
            <span
              className="block"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.35) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              and where intervention is overdue.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[15px] text-white/60 leading-[1.55] max-w-[880px] mx-auto"
          >
            Rank sites using a consistent intelligence index. Compare risk
            exposure, closure discipline, asset utilisation and recurring issues
            across the portfolio.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
            className="mt-8"
          >
            <Link
              href="/book-a-demo"
              className="inline-flex items-center gap-2 text-[14px] font-semibold text-signal-orange transition-transform duration-200 hover:translate-x-0.5"
            >
              See management analytics
              <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
            </Link>
          </motion.div>
        </div>

        {/* the frame is cut by the section edge — only the top of the
            product is meant to be here */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1, ease: EASE }}
          className="relative mx-auto max-h-[420px] sm:max-h-[460px] overflow-hidden"
          style={{
            maxWidth: 1240,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            borderLeft: "1px solid rgba(255,255,255,0.08)",
            borderRight: "1px solid rgba(255,255,255,0.08)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
            padding: "14px 14px 0",
            boxShadow:
              "0 -20px 80px -20px rgba(255,106,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="relative overflow-hidden"
            style={{
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              background: "linear-gradient(180deg, #0A0F14 0%, #06090C 100%)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              borderRight: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-center justify-between gap-4 flex-wrap p-6 sm:p-8 pb-4">
              <div>
                <div className="text-[10.5px] font-mono font-bold tracking-[0.22em] uppercase text-white/45 mb-1.5">
                  Portfolio performance
                </div>
                <h3 className="text-[20px] sm:text-[24px] font-bold text-white leading-[1.15] tracking-[-0.02em]">
                  Intelligence index by site
                </h3>
              </div>
              <span
                className="inline-flex items-center gap-1.5 text-[10.5px] font-mono font-bold tracking-[0.14em] px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(43,203,116,0.13)",
                  color: GREEN,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#2BCB74" }}
                />
                INDEX LIVE
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-6 sm:px-8">
              {KPIS.map((k, i) => (
                <motion.div
                  key={k.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                  className="p-4 rounded-xl"
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
                  }}
                >
                  <span className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-white/45">
                    {k.label}
                  </span>
                  <b className="block text-[24px] sm:text-[28px] font-bold text-white tabular-nums tracking-[-0.025em] mt-1.5">
                    {k.value}
                  </b>
                </motion.div>
              ))}
            </div>

            {/* the ranking, in the panel that runs off the bottom */}
            <div
              className="mt-5 mx-6 sm:mx-8 relative overflow-hidden"
              style={{
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                borderLeft: "1px solid rgba(255,255,255,0.06)",
                borderRight: "1px solid rgba(255,255,255,0.06)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.02), transparent)",
              }}
            >
              <div
                className="flex items-center justify-between gap-4 px-5 sm:px-6 py-3.5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-white/45">
                  Site performance
                </span>
                <span className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-white/45">
                  Index
                </span>
              </div>

              {SITES.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
                  className="grid grid-cols-[28px_1fr_auto] sm:grid-cols-[36px_1fr_1.2fr_auto] items-center gap-x-4 gap-y-2 px-5 sm:px-6 py-5"
                  style={{
                    borderBottom:
                      i === SITES.length - 1
                        ? "none"
                        : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span className="text-[10px] font-mono text-white/30">
                    {s.rank}
                  </span>

                  <span className="text-[13.5px] font-semibold text-white tracking-[-0.01em] truncate">
                    {s.name}
                  </span>

                  <span
                    className="relative col-span-3 sm:col-span-1 h-[3px] rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  >
                    <motion.span
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.index}%` }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{
                        duration: 1.2,
                        delay: 0.25 + i * 0.1,
                        ease: EASE,
                      }}
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ background: s.tone }}
                    />
                  </span>

                  <span
                    className="text-[15px] font-semibold tabular-nums text-right"
                    style={{ color: s.tone }}
                  >
                    {s.index.toFixed(1)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
