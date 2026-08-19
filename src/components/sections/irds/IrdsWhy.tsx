"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Warehouse, LineChart } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const AUDIENCES = [
  {
    Icon: ShieldAlert,
    title: "For safety teams",
    tagline: "Prioritise risk. Close the loop.",
    body: "Prioritise risk and maintain visibility on open corrective actions across every aisle, upright and rack element.",
  },
  {
    Icon: Warehouse,
    title: "For warehouse teams",
    tagline: "Know exactly where the issue lives.",
    body: "Know exactly where each issue exists without searching through long reports, spreadsheets or historic photographs.",
  },
  {
    Icon: LineChart,
    title: "For leadership",
    tagline: "One framework, every site.",
    body: "Compare rack health and closure performance across sites with a common framework, cadence and evidence trail.",
  },
];

export function IrdsWhy() {
  return (
    <section className="bg-white pt-28 sm:pt-36 lg:pt-44 pb-28 sm:pb-36 lg:pb-44 overflow-hidden">
      <style>{`
        @property --irdswhy-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .irdswhy-card { position: relative; isolation: isolate; }
        .irdswhy-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--irdswhy-shine-angle),
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
        .irdswhy-card:hover::before {
          opacity: 1;
          animation: irdswhy-shine 2.4s linear infinite;
        }
        @keyframes irdswhy-shine {
          to { --irdswhy-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .irdswhy-card:hover::before { animation: none; }
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
            Why RAMS
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.85, ease: EASE }}
            className="text-[40px] sm:text-[60px] lg:text-[78px] font-bold text-carbon leading-[1.0] tracking-[-0.04em]"
          >
            Built for the full <br />
            <span className="text-graphite/50">rack-safety lifecycle.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[15px] text-graphite/65 leading-[1.55] max-w-[880px] mx-auto"
          >
            RAMS is not an inspection vendor — it is the intelligence layer
            that connects inspection, engineering evidence, action tracking
            and ongoing rack safety across every warehouse.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {AUDIENCES.map((aud, i) => (
            <motion.article
              key={aud.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
              className="irdswhy-card group relative flex flex-col p-7 sm:p-8 bg-white transition-all duration-300 hover:-translate-y-1"
              style={{
                minHeight: 360,
                borderRadius: 12,
                border: "1px solid #E8E8ED",
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="w-12 h-12 flex items-center justify-center mb-8"
                style={{
                  borderRadius: 8,
                  background: "rgba(255,106,0,0.08)",
                  border: "1px solid rgba(255,106,0,0.18)",
                }}
              >
                <aud.Icon
                  className="w-[22px] h-[22px] text-signal-orange"
                  strokeWidth={2}
                />
              </div>

              <h3 className="text-[22px] sm:text-[24px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
                {aud.title}
              </h3>

              <div className="mt-2 text-[14px] font-semibold text-signal-orange leading-[1.4]">
                {aud.tagline}
              </div>

              <p className="mt-4 text-[14px] text-graphite/65 leading-[1.65]">
                {aud.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
