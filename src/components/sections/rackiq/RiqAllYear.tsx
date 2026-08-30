"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { BigLine, EASE, NoteLine, RAG, Section } from "./rackiq-shared";

/**
 * Safety all year — the workflow that keeps running between inspections.
 *
 * The pipeline and the day's attention list were two separate cards saying one
 * thing, so they are now one live panel: the stages across the top, what that
 * leaves on the floor underneath, and the claim boundary as its footer.
 *
 * The annual loop runs as a marquee rather than a row of words ending in a
 * full stop. The section's claim is that the cycle does not end, and a chain
 * that visibly has no last item makes that argument on its own.
 */

const LINE = "#E4E4E9";

const PIPELINE = [
  { k: "Open", n: 18, sub: "new findings", tone: "#6E6E73" },
  { k: "Assigned", n: 12, sub: "owner set", tone: "#2F6BFF" },
  { k: "In progress", n: 7, sub: "repair underway", tone: "#2F6BFF" },
  { k: "Awaiting verif.", n: 4, sub: "evidence review", tone: RAG.amber.app },
  { k: "Closed", n: 63, sub: "verified", tone: RAG.green.app },
];

const TODAY = [
  ["18", "Open Red findings"],
  ["12", "Amber actions due"],
  ["4", "Awaiting verification"],
  ["5", "Overdue actions"],
  ["3", "Recurring locations"],
  ["2", "Sites need attention"],
];

const LOOP = [
  "Inspect",
  "Classify",
  "Assign",
  "Correct",
  "Verify",
  "Track",
  "Learn",
  "Reinspect",
];

export function RiqAllYear() {
  const reduce = useReducedMotion();

  return (
    <Section surface="white" id="allyear">
      <SectionHeader
        eyebrow="Safety all year"
        top="The audit is periodic."
        bottom="The safety workflow is continuous."
        size="compact"
        width="wide"
      />

      {/* ── one live panel ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="overflow-hidden bg-white"
        style={{
          borderRadius: 16,
          border: `1px solid ${LINE}`,
          boxShadow:
            "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
        }}
      >
        {/* the stages */}
        <div className="px-5 py-7 sm:px-8 sm:py-8">
          <p className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-graphite/40 mb-6">
            Corrective action · WH-01
          </p>

          <div className="flex items-stretch gap-2 sm:gap-3 flex-wrap lg:flex-nowrap">
            {PIPELINE.map((p, i) => (
              <span
                key={p.k}
                className="flex items-center gap-2 sm:gap-3 flex-1 min-w-[140px]"
              >
                {i > 0 && (
                  <span
                    className="text-graphite/25 text-[15px] shrink-0"
                    aria-hidden
                  >
                    ›
                  </span>
                )}
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.4, delay: i * 0.07, ease: EASE }}
                  className="flex-1 flex flex-col px-4 py-4"
                  style={{
                    borderRadius: 12,
                    background: "#FAFAFB",
                    border: `1px solid ${LINE}`,
                    borderLeft: `2px solid ${p.tone}`,
                  }}
                >
                  <span className="text-[9.5px] font-mono font-bold tracking-[0.12em] uppercase text-graphite/45">
                    {p.k}
                  </span>
                  <span className="mt-2 font-rams-heading text-[28px] font-bold text-carbon tabular-nums leading-none tracking-[-0.02em]">
                    {p.n}
                  </span>
                  <span className="mt-1.5 text-[11px] text-graphite/50">
                    {p.sub}
                  </span>
                </motion.span>
              </span>
            ))}
          </div>
        </div>

        {/* what that leaves on the floor */}
        <div
          className="px-5 py-7 sm:px-8 sm:py-8"
          style={{ borderTop: `1px solid ${LINE}`, background: "#FAFAFB" }}
        >
          <p className="font-rams-heading text-[19px] sm:text-[20px] font-bold tracking-[-0.02em] text-carbon mb-5">
            What needs attention today
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {TODAY.map(([n, l], i) => (
              <motion.div
                key={l}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
                className="px-4 py-5 bg-white"
                style={{ borderRadius: 12, border: `1px solid ${LINE}` }}
              >
                <p className="font-rams-heading text-[30px] font-bold text-carbon tabular-nums leading-none tracking-[-0.03em]">
                  {n}
                </p>
                <p className="mt-2.5 text-[12px] text-graphite/55 leading-[1.4]">
                  {l}
                </p>
              </motion.div>
            ))}
          </div>

          {/* NoteLine ships a 64ch measure; this one runs as a single rule
              line under the metrics, so the measure is lifted here only. */}
          <NoteLine className="mt-6 !max-w-none">
            Current workflow and status information — not continuously sensed
            rack condition.
          </NoteLine>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="mt-14 sm:mt-16 text-center"
      >
        <BigLine center className="!max-w-none">
          A finding remains visible{" "}
          <span className="text-graphite/45">until it is properly closed.</span>
        </BigLine>
      </motion.div>

      {/* ── the loop that never reaches a last item ─────── */}
      <div className="relative mt-14 sm:mt-16 overflow-hidden">
        <style>{`
          @keyframes riq-loop {
            from { transform: translateX(-50%); }
            to   { transform: translateX(0); }
          }
          .riq-loop-track {
            display: flex;
            width: max-content;
            animation: riq-loop 34s linear infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .riq-loop-track { animation: none; }
          }
        `}</style>

        <div className={reduce ? "flex flex-wrap justify-center" : "riq-loop-track"}>
          {(reduce ? [0] : [0, 1]).map((copy) => (
            <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
              {LOOP.map((l) => (
                <span key={copy + l} className="flex items-center shrink-0">
                  <span className="font-rams-heading text-[17px] sm:text-[22px] font-bold tracking-[-0.02em] text-carbon whitespace-nowrap">
                    {l}
                  </span>
                  <span
                    className="text-signal-orange text-[15px] mx-4 sm:mx-6"
                    aria-hidden
                  >
                    →
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>

        {!reduce && (
          <>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28"
              style={{ background: "linear-gradient(to right, #FFFFFF, transparent)" }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28"
              style={{ background: "linear-gradient(to left, #FFFFFF, transparent)" }}
            />
          </>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-14 sm:mt-16 text-center"
      >
        <BigLine center className="!max-w-none">
          IRDS keeps rack safety active{" "}
          <span className="text-graphite/45">between inspection cycles.</span>
        </BigLine>
      </motion.div>
    </Section>
  );
}
