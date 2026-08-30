"use client";

import { motion } from "framer-motion";
import { Hourglass, PackageX, Scale, TrafficCone } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Efficiency intelligence.
 *
 * Names the four ways an operation loses efficiency, and closes on what that
 * adds up to. The two screens that quantify the losses live in the section
 * below — MepsEfficiencyAnalytics.
 */

const HAIR = "rgba(255,255,255,0.10)";

const LOSSES = [
  {
    Icon: PackageX,
    ix: "Loss 01",
    title: "Empty travel",
    body: "Distance covered without moving material — returns, repositioning and approaches.",
  },
  {
    Icon: Hourglass,
    ix: "Loss 02",
    title: "Idle & waiting",
    body: "Time where the machine, the operator or the material is not progressing.",
  },
  {
    Icon: TrafficCone,
    ix: "Loss 03",
    title: "Congestion",
    body: "Movement constrained by the physical operation — aisles, intersections, dock faces.",
  },
  {
    Icon: Scale,
    ix: "Loss 04",
    title: "Fleet imbalance",
    body: "Some machines carrying a disproportionate share of the shift while others stand.",
  },
];

export function MepsEfficiency() {
  return (
    <Section surface="darkMid" id="efficiency">
      {/* Set locally rather than through <SectionHeader>. Line two is 44
          characters, which needs ~1376px at the compact 68px and so wraps to a
          third line inside the 1180px wide wrapper. Everything else — the
          eyebrow, the gradient second line, the subline, the motion — is the
          guideline's, at 56px. */}
      <div className="max-w-[1180px] mx-auto text-center mb-16 sm:mb-20">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange mb-5"
        >
          Efficiency intelligence
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, ease: EASE }}
          className="text-[30px] sm:text-[44px] lg:text-[56px] font-bold tracking-[-0.04em] leading-[1.08] text-white"
        >
          Productivity shows output.
          <br />
          <span
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.35) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Efficiency shows what it took to produce it.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
          className="mt-6 text-[14px] sm:text-[15px] leading-[1.55] max-w-[880px] mx-auto text-white/60"
        >
          Two shifts can move the same number of pallets. One does it with far
          less travel, fewer waits and a balanced fleet. Efficiency analytics is
          where that difference becomes visible.
        </motion.p>
      </div>

      {/* ── the four losses ─────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {LOSSES.map((l, i) => (
          <motion.article
            key={l.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: i * 0.07, ease: EASE }}
            className="flex flex-col px-6 py-7"
            style={{
              minHeight: 250,
              borderRadius: 12,
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${HAIR}`,
            }}
          >
            {/* bare icon, as on the dark IRDS lifecycle cards */}
            <l.Icon
              className="w-6 h-6 shrink-0 text-signal-orange mb-6"
              strokeWidth={1.5}
              aria-hidden
            />
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange">
              {l.ix}
            </span>
            <h3 className="mt-3 text-[19px] font-bold tracking-[-0.022em] text-white leading-[1.2]">
              {l.title}
            </h3>
            <p className="mt-3 text-[13.5px] text-white/50 leading-[1.6]">
              {l.body}
            </p>
          </motion.article>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-12 sm:mt-14 text-center font-rams-heading text-[22px] sm:text-[28px] lg:text-[32px] font-bold tracking-[-0.025em] leading-[1.2] text-white"
      >
        The operation may be working. MEPS shows where it is working{" "}
        <span className="text-signal-orange">too hard</span>.
      </motion.p>
    </Section>
  );
}
