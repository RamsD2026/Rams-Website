"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const RESULTS = [
  {
    value: "3×",
    label: "Faster incident response",
    body: "Every MHE movement is tracked in real time, cutting the time between incident and intervention.",
  },
  {
    value: "87%",
    label: "Fewer near-misses",
    body: "Continuous behaviour monitoring and coaching reduced near-misses across shifts within the first quarter.",
  },
  {
    value: "76%",
    label: "Avg fleet utilisation",
    body: "Zone and shift analytics lifted average MHE utilisation from 58% to 76% without adding equipment.",
  },
  {
    value: "40%",
    label: "Lower maintenance cost",
    body: "Predictive maintenance replaced fixed intervals, cutting unplanned downtime and reactive repair spend.",
  },
  {
    value: "2×",
    label: "Faster task completion",
    body: "Task orchestration and MHE allocation nearly doubled task throughput across shifts and operators.",
  },
  {
    value: "11%",
    label: "UPH increase",
    body: "Productivity gains through visibility, coaching and better MHE allocation across sites.",
  },
];

/**
 * 08 — Proven results, in `IrdsProofResults`' card: the gradient figure, the
 * mono label and the line, on the site's warm off-white.
 *
 * The figures are the page's own and unchanged. The customer names the data
 * carried are not rendered: they were never shown, and attaching these
 * figures to named companies is a claim this page cannot evidence.
 */
export function MheProofResults() {
  return (
    <section
      className="pt-28 sm:pt-36 lg:pt-44 pb-28 sm:pb-36 lg:pb-44"
      style={{ background: "rgba(247, 242, 232, 0.3)" }}
    >
      <style>{`
        @property --mheproof-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .mheproof-card { position: relative; isolation: isolate; }
        .mheproof-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--mheproof-shine-angle),
            transparent 0deg,
            transparent 300deg,
            rgba(255,106,0,0.9) 340deg,
            transparent 360deg
          );
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
                  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
          z-index: 1;
        }
        .mheproof-card:hover::before {
          opacity: 1;
          animation: mheproof-shine 2.4s linear infinite;
        }
        @keyframes mheproof-shine {
          to { --mheproof-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mheproof-card:hover::before { animation: none; }
        }
      `}</style>

      <div className="rams-container">
        <div className="max-w-[900px] mx-auto text-center mb-20 sm:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange mb-5"
          >
            Proven Results
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.85, ease: EASE }}
            className="text-[40px] sm:text-[60px] lg:text-[78px] font-bold text-carbon leading-[1.0] tracking-[-0.04em]"
          >
            Real outcomes from <br />
            <span className="text-graphite/50">real deployments.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[15px] text-graphite/65 leading-[1.55] max-w-[880px] mx-auto"
          >
            Global operations teams trust RAMS MHE Intelligence to keep fleets
            safe, productive and predictable across every shift.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RESULTS.map((r, i) => (
            <motion.article
              key={r.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: EASE }}
              className="mheproof-card group relative flex flex-col p-8 sm:p-9 bg-white transition-all duration-300 hover:-translate-y-1"
              style={{
                borderRadius: 12,
                border: "1px solid #E8E8ED",
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="text-[44px] sm:text-[52px] font-bold leading-[0.95] tabular-nums tracking-[-0.035em]"
                style={{
                  background:
                    "linear-gradient(135deg, #FF6A00 0%, #FF8A3C 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {r.value}
              </div>
              <div className="mt-4 text-[11px] font-mono font-bold tracking-[0.18em] uppercase text-carbon">
                {r.label}
              </div>
              <p className="mt-3 text-[14.5px] text-graphite/65 leading-[1.6]">
                {r.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
