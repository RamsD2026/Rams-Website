"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, HAIR, SOFT } from "./irdsx-shared";

/**
 * 14 — The result.
 *
 * The payoff, and the question the whole page has been building to: after all
 * of that work, what do I actually know? So this section is not a claim about
 * IRDS — it is the rack-system summary the product produces at the end of a
 * cycle, laid out the way the product lays it out.
 *
 * The figures are one worked example of a cycle, headed as such. They are not
 * a customer result and not a benchmark; they are what the shape of the answer
 * looks like. Numbers on this page are illustrative for exactly the same
 * reason the visuals are grey plates: the real ones belong to a real site.
 */

const COUNTS: [string, string, string?][] = [
  ["Total elements", "1,248"],
  ["Inspected", "1,248"],
  ["Issues raised", "66"],
  ["Critical", "8", "crit"],
];

const TESTS: [string, number][] = [
  ["G1 · Plumbness", 96],
  ["G2 · Rack run straightness", 91],
  ["G3 · System lateral sway", 94],
  ["G4 · Floor flatness", 97],
];

export function IrxResult() {
  return (
    <Section surface="white" id="result">
      <SectionHeader
        eyebrow="The result"
        top="From thousands of records"
        bottom="To one clear position."
        size="compact"
        width="wide"
        body="At the end of a cycle the estate has a state, and every part of that state opens back to the element, the evidence and the test that produced it."
      />

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="max-w-[1000px] mx-auto overflow-hidden"
        style={{
          borderRadius: 16,
          background: "#FFFFFF",
          border: `1px solid #E4E4E9`,
          boxShadow:
            "0 40px 90px -40px rgba(14,14,15,0.20), 0 8px 24px -12px rgba(14,14,15,0.06)",
        }}
      >
        <div
          className="flex items-center gap-3 px-5 py-3.5 flex-wrap"
          style={{ borderBottom: `1px solid ${HAIR}`, background: SOFT }}
        >
          <span className="text-[14px] font-semibold text-carbon tracking-[-0.01em]">
            Rack system summary
          </span>
          <span
            className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold text-graphite/60"
            style={{ background: "#F1F1F4", border: `1px solid #E4E4E9` }}
          >
            Kolkata DC · cycle 04
          </span>
          <span
            className="ml-auto px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-[0.14em] uppercase"
            style={{ background: "rgba(224,135,0,0.12)", color: "#B36B00" }}
          >
            Attention required
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* what was covered */}
          <div className="p-6 sm:p-8 md:border-r" style={{ borderColor: HAIR }}>
            <p className="text-[9.5px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/40">
              Coverage
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {COUNTS.map(([k, v, kind], i) => (
                <motion.div
                  key={k}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.45, delay: i * 0.07, ease: EASE }}
                  className="px-3.5 py-3 rounded-[10px]"
                  style={{ background: SOFT, border: `1px solid ${HAIR}` }}
                >
                  <p className="text-[8.5px] font-mono font-bold tracking-[0.14em] uppercase text-graphite/40 truncate">
                    {k}
                  </p>
                  <p
                    className="mt-1.5 text-[24px] font-bold leading-none tabular-nums tracking-[-0.035em]"
                    style={{ color: kind === "crit" ? "#DC2626" : "#08080A" }}
                  >
                    {v}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* what was tested */}
          <div className="p-6 sm:p-8">
            <p className="text-[9.5px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/40">
              Testing · pass rate
            </p>

            <div className="mt-5 flex flex-col gap-3.5">
              {TESTS.map(([k, pct], i) => (
                <div key={k}>
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="text-[12px] text-graphite/65 truncate">
                      {k}
                    </span>
                    <span className="text-[12px] font-mono font-bold text-carbon tabular-nums shrink-0">
                      {pct}%
                    </span>
                  </span>
                  <span
                    className="mt-1.5 block h-1.5 rounded-full overflow-hidden"
                    style={{ background: "#F1F1F4" }}
                  >
                    <motion.span
                      className="block h-full rounded-full"
                      style={{ background: "#16A34A" }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{
                        duration: 0.8,
                        delay: i * 0.08,
                        ease: EASE,
                      }}
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="px-6 sm:px-8 py-4"
          style={{ borderTop: `1px solid ${HAIR}`, background: SOFT }}
        >
          <p className="text-[12.5px] leading-[1.6] text-graphite/55">
            Every figure here opens: result → affected rack → affected element →
            the photograph and the reading behind it.
          </p>
        </div>
      </motion.div>

      <p className="mt-8 text-center text-[11px] leading-[1.6] text-graphite/45 max-w-[720px] mx-auto">
        Figures illustrate the shape of a completed cycle. They are not a
        customer result and not a benchmark.
      </p>
    </Section>
  );
}
