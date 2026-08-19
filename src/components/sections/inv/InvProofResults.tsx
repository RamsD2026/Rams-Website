"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const RESULTS = [
  {
    n: "01",
    label: "Visibility",
    body: "Know where inventory is stored across racks, bays and zones.",
  },
  {
    n: "02",
    label: "Accuracy",
    body: "Compare physical inventory with expected system records.",
  },
  {
    n: "03",
    label: "Aging",
    body: "Identify slow-moving and aging inventory before it becomes a problem.",
  },
  {
    n: "04",
    label: "Control",
    body: "Prioritise discrepancies, exceptions and reconciliation actions.",
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
            The Framework
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-[40px] sm:text-[60px] lg:text-[78px] font-bold text-carbon leading-[1.0] tracking-[-0.04em]"
          >
            Four pillars of <br />
            <span className="text-graphite/50">inventory intelligence.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-8 text-[17px] sm:text-[19px] text-graphite/65 leading-[1.6] max-w-[640px] mx-auto"
          >
            Every module in RAMS Inventory Intelligence maps back to one of
            four operating pillars — the framework warehouse teams use to
            elevate stock control.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {RESULTS.map((r, i) => (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.55,
                delay: i * 0.06,
                ease: EASE,
              }}
              className="inv-card relative flex flex-col p-8 sm:p-10 bg-white"
              style={{ borderRadius: 18, border: "1px solid #E8E8ED" }}
            >
              <span
                aria-hidden
                className="absolute top-0 left-8 right-8 h-[3px] bg-signal-orange"
                style={{ borderRadius: "0 0 3px 3px" }}
              />
              <div className="pt-3">
                <div className="text-[11px] font-mono font-bold tracking-[0.22em] uppercase text-signal-orange">
                  {r.n} · Pillar
                </div>
                <div className="mt-4 text-[36px] sm:text-[42px] font-bold text-carbon leading-[1.05] tracking-[-0.03em]">
                  {r.label}
                </div>
                <p className="mt-5 text-[15px] text-graphite/70 leading-[1.6]">
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
