"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const RESULTS = [
  {
    value: "93%",
    label: "Fewer rack incidents",
    body: "Rack-related safety incidents dropped across the entire network within the first year of deployment.",
    company: "Kellanova",
  },
  {
    value: "$287K",
    label: "Saved in 90 days",
    body: "Damage-prevention alone paid for the entire rack-inspection and monitoring rollout within a quarter.",
    company: "Church & Dwight",
  },
  {
    value: "10×",
    label: "Faster audits",
    body: "Compliance audits that previously took three weeks are now completed in two days across all sites.",
    company: "Woolworths Group",
  },
  {
    value: "70%",
    label: "Fewer OS&D claims",
    body: "Structural damage claims dropped dramatically with continuous rack-health visibility on every aisle.",
    company: "GE Appliances",
  },
  {
    value: "0",
    label: "Critical failures",
    body: "Zero critical rack failures recorded in the 18 months following RAMS Rack Intelligence deployment.",
    company: "Toll Group",
  },
  {
    value: "100%",
    label: "Rack visibility",
    body: "Full digital twin coverage of every rack element gives leadership one source of truth across facilities.",
    company: "DHL Supply Chain",
  },
];

export function IrdsProofResults() {
  return (
    <section className="bg-white py-24 sm:py-28 lg:py-32">
      <style>{`
        @property --proof-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .proof-card { position: relative; isolation: isolate; }
        .proof-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--proof-shine-angle),
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
        .proof-card:hover::before {
          opacity: 1;
          animation: proof-shine 2.4s linear infinite;
        }
        @keyframes proof-shine {
          to { --proof-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .proof-card:hover::before { animation: none; }
        }
      `}</style>
      <div className="rams-container">
        {/* Header */}
        <div className="max-w-[820px] mx-auto text-center mb-14 sm:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45 }}
            className="text-[10.5px] font-mono font-bold tracking-[0.22em] uppercase text-signal-orange mb-4"
          >
            Proven Results
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-carbon leading-[1.04] tracking-[-0.03em]"
          >
            Real outcomes from real deployments.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-base sm:text-lg text-graphite/70 leading-[1.65] max-w-[560px] mx-auto"
          >
            Global operations teams trust RAMS Rack Intelligence to protect
            people, inventory and compliance across their networks.
          </motion.p>
        </div>

        {/* 3 × 2 stat grid */}
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
              className="proof-card relative flex flex-col p-7 sm:p-8 bg-white"
              style={{ borderRadius: 14, border: "1px solid #E8E8ED" }}
            >
              {/* Top orange bar */}
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
