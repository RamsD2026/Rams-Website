"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const RESULTS = [
  {
    value: "99.6%",
    label: "Inventory accuracy",
    body: "Continuous reconciliation lifted stock accuracy from 94% to 99.6% within the first six months of deployment.",
  },
  {
    value: "$1.4M",
    label: "Shrink prevented",
    body: "Drift and phantom-stock events surface immediately — recovering value that previously disappeared quietly.",
  },
  {
    value: "0",
    label: "Manual cycle counts",
    body: "Continuous AI-vision counting eliminated scheduled cycle counts across all reconciled zones.",
  },
  {
    value: "6×",
    label: "Faster stock queries",
    body: "Operators find any pallet, tote or bay in under two seconds — no walking, no radio, no spreadsheet.",
  },
  {
    value: "48h",
    label: "Time to first insight",
    body: "From install to first anomaly report — deployments go live in days, not quarters.",
  },
  {
    value: "100%",
    label: "Audit provenance",
    body: "Every count, movement and correction preserved with a full timeline for compliance and finance teams.",
  },
];

export function InvProofResults() {
  return (
    <section className="bg-white pt-28 sm:pt-36 lg:pt-44 pb-28 sm:pb-36 lg:pb-44">
      <style>{`
        @property --inv-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .inv-card { position: relative; isolation: isolate; }
        .inv-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--inv-shine-angle),
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
        .inv-card:hover::before {
          opacity: 1;
          animation: inv-shine 2.4s linear infinite;
        }
        @keyframes inv-shine {
          to { --inv-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .inv-card:hover::before { animation: none; }
        }
      `}</style>
      <div className="rams-container">
        <div className="max-w-[900px] mx-auto text-center mb-20 sm:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45 }}
            className="text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange mb-5"
          >
            Proven Results
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-[40px] sm:text-[60px] lg:text-[78px] font-bold text-carbon leading-[1.0] tracking-[-0.04em]"
          >
            Real outcomes. <br />
            <span className="text-graphite/50">Real deployments.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-8 text-[17px] sm:text-[19px] text-graphite/65 leading-[1.6] max-w-[620px] mx-auto"
          >
            Global operations teams trust RAMS Inventory Intelligence to
            protect margin, accuracy and audit posture across every location.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {RESULTS.map((r, i) => (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.55,
                delay: (i % 3) * 0.06,
                ease: EASE,
              }}
              className="inv-card relative flex flex-col p-7 sm:p-8 bg-white"
              style={{ borderRadius: 14, border: "1px solid #E8E8ED" }}
            >
              <span
                aria-hidden
                className="absolute top-0 left-6 right-6 h-[3px] bg-signal-orange"
                style={{ borderRadius: "0 0 3px 3px" }}
              />
              <div className="pt-2">
                <div className="text-[44px] sm:text-[52px] font-bold text-signal-orange leading-none tabular-nums tracking-[-0.03em]">
                  {r.value}
                </div>
                <div className="mt-3 text-[11px] font-mono font-bold tracking-[0.16em] uppercase text-carbon">
                  {r.label}
                </div>
                <p className="mt-4 text-[14.5px] text-graphite/75 leading-[1.6]">
                  {r.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
