"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/* PLACEHOLDER FIGURES — replace values, bodies and companies with verified
   customer outcomes before this page is treated as final marketing copy. */
const RESULTS = [
  {
    value: "32%",
    label: "More tasks per shift",
    body: "Dynamic assignment and sequencing lifted completed task volume without adding headcount or equipment.",
    company: "Company name",
  },
  {
    value: "41%",
    label: "Less travel distance",
    body: "Route optimisation across zones cut empty and repeated MHE movement between task locations.",
    company: "Company name",
  },
  {
    value: "91%",
    label: "On-time execution",
    body: "Tasks closed within their planned window, measured across shifts, zones, operators and MHEs.",
    company: "Company name",
  },
  {
    value: "6.8",
    label: "Minute average task",
    body: "Average task cycle time from assignment to completion, tracked continuously across the floor.",
    company: "Company name",
  },
  {
    value: "58%",
    label: "Faster exception response",
    body: "Blocked tasks, mismatches and priority escalations reached the right operator sooner.",
    company: "Company name",
  },
  {
    value: "0",
    label: "Manual dispatch lists",
    body: "Paper run-sheets and radio dispatching replaced by one live, shared execution queue.",
    company: "Company name",
  },
];

export function WexProofResults() {
  return (
    <section
      className="pt-28 sm:pt-36 lg:pt-44 pb-28 sm:pb-36 lg:pb-44"
      style={{ background: "rgba(247, 242, 232, 0.3)" }}
    >
      <style>{`
        @property --wexproof-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .wexproof-card { position: relative; isolation: isolate; }
        .wexproof-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--wexproof-shine-angle),
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
        .wexproof-card:hover::before {
          opacity: 1;
          animation: wexproof-shine 2.4s linear infinite;
        }
        @keyframes wexproof-shine {
          to { --wexproof-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .wexproof-card:hover::before { animation: none; }
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
            Global operations teams trust RAMS Warehouse Execution to
            orchestrate tasks, coordinate resources and protect shift
            productivity across their networks.
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
              className="wexproof-card group relative flex flex-col p-8 sm:p-9 bg-white transition-all duration-300 hover:-translate-y-1"
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
                  background: "linear-gradient(135deg, #FF6A00 0%, #FF8A3C 100%)",
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
              <div className="mt-6 pt-5 border-t border-[#E8E8ED]">
                <span className="text-[11px] font-mono font-semibold tracking-[0.14em] uppercase text-graphite/50">
                  {r.company}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
