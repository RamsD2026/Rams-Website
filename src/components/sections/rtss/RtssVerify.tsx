"use client";

import { motion } from "framer-motion";
import { ArrowRight, TrendingDown } from "lucide-react";
import {
  ChapterHead,
  EASE,
  Section,
} from "@/components/sections/rackiq/rackiq-shared";

/**
 * Intervene. Measure again. Verify improvement.
 *
 * One widget rather than two tables. Two facing tables of the same four rows
 * make the reader do the arithmetic — and a number in a cell has no size, so
 * a drop from 31 to 11 looks exactly like a drop from 14 to 3.
 *
 * Here every indicator is one track: the muted bar is what it was, the green
 * bar is what it became, both scaled against the largest figure so the rows
 * are comparable to each other as well as to themselves. The gap between the
 * two bar ends is the improvement, at a glance.
 *
 * The document's caveat stays. These are specific figures showing a four- to
 * six-fold change, and the line saying they illustrate a method rather than a
 * promised result is what keeps them honest.
 */

const LINE = "#E8E8ED";
const GREEN = "#16A34A";

const INDICATORS: { k: string; before: number; after: number }[] = [
  { k: "Overspeed events", before: 14, after: 3 },
  { k: "Rapid acceleration", before: 22, after: 9 },
  { k: "Harsh deceleration", before: 18, after: 7 },
  { k: "High-jerk manoeuvres", before: 31, after: 11 },
];

/** Every bar is scaled against the largest reading, so rows compare. */
const MAX = Math.max(...INDICATORS.map((d) => d.before));

const CONTEXT = ["Operator 17", "Behaviour coaching", "30 days"];

function Row({ d, i }: { d: (typeof INDICATORS)[number]; i: number }) {
  const drop = Math.round((1 - d.after / d.before) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
      className="px-5 py-5 sm:px-7"
      style={{ borderTop: i > 0 ? `1px solid ${LINE}` : undefined }}
    >
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <span className="text-[13.5px] sm:text-[14px] font-medium text-carbon">
          {d.k}
        </span>

        <span className="flex items-baseline gap-2.5 shrink-0">
          <span className="text-[15px] font-semibold tabular-nums text-graphite/40">
            {d.before}
          </span>
          <ArrowRight
            className="w-3.5 h-3.5 text-graphite/30 self-center"
            strokeWidth={2}
            aria-hidden
          />
          <span
            className="text-[22px] font-bold tabular-nums leading-none"
            style={{ color: GREEN }}
          >
            {d.after}
          </span>
          <span
            className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full text-[10.5px] font-mono font-bold tabular-nums"
            style={{ background: "rgba(22,163,74,0.10)", color: GREEN }}
          >
            <TrendingDown className="w-3 h-3" strokeWidth={2.2} aria-hidden />
            {drop}%
          </span>
        </span>
      </div>

      {/* what it was, and what it became — same scale, same start */}
      <div className="mt-3.5 flex flex-col gap-1.5">
        <div
          className="relative h-1.5 rounded-full overflow-hidden"
          style={{ background: "#F1F1F4" }}
        >
          <motion.span
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: "#D3D3D9" }}
            initial={{ width: 0 }}
            whileInView={{ width: `${(d.before / MAX) * 100}%` }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: 0.15 + i * 0.08, ease: EASE }}
          />
        </div>
        <div
          className="relative h-1.5 rounded-full overflow-hidden"
          style={{ background: "#F1F1F4" }}
        >
          <motion.span
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: GREEN }}
            initial={{ width: 0 }}
            whileInView={{ width: `${(d.after / MAX) * 100}%` }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: 0.3 + i * 0.08, ease: EASE }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function RtssVerify() {
  return (
    <Section surface="white" id="verify" padding="tight">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.12fr] gap-10 lg:gap-14 items-center max-w-[1180px] mx-auto">
        <div>
          {/* ChapterHead is the site's left-aligned header — SectionHeader is
              centred by construction and cannot sit in a split. */}
          <ChapterHead
            eyebrow="Verification"
            top="Intervene. Measure again."
            bottom="Verify improvement."
          />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, delay: 0.15, ease: EASE }}
            className="mt-8 text-[12px] font-mono text-graphite/50 leading-[1.7] max-w-[46ch]"
          >
            Illustrative comparison. The method is the point — the same
            operator, the same indicators, the same measurement window either
            side of the intervention.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.75, ease: EASE }}
          className="overflow-hidden bg-white"
          style={{
            borderRadius: 16,
            border: `1px solid ${LINE}`,
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.02), 0 18px 44px -24px rgba(0,0,0,0.14)",
          }}
        >
          {/* what changed between the two readings */}
          <div
            className="flex items-center gap-2 flex-wrap px-5 py-4 sm:px-7"
            style={{ background: "#FAFAFB", borderBottom: `1px solid ${LINE}` }}
          >
            {CONTEXT.map((c, i) => (
              <span key={c} className="flex items-center gap-2">
                {i > 0 && (
                  <span aria-hidden className="text-graphite/25 text-[11px]">
                    ·
                  </span>
                )}
                <span
                  className={
                    "text-[11.5px] font-mono tracking-[0.04em] " +
                    (i === 1
                      ? "text-signal-orange font-semibold"
                      : "text-graphite/55")
                  }
                >
                  {c}
                </span>
              </span>
            ))}

            <span className="ml-auto flex items-center gap-3 shrink-0">
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-1.5 rounded-full"
                  style={{ background: "#D3D3D9" }}
                />
                <span className="text-[9.5px] font-mono tracking-[0.14em] uppercase text-graphite/40">
                  Before
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-1.5 rounded-full"
                  style={{ background: GREEN }}
                />
                <span className="text-[9.5px] font-mono tracking-[0.14em] uppercase text-graphite/40">
                  After
                </span>
              </span>
            </span>
          </div>

          {INDICATORS.map((d, i) => (
            <Row key={d.k} d={d} i={i} />
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
