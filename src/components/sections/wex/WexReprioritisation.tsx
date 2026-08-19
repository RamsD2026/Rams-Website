"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const STEPS = [
  {
    n: "01",
    title: "Original plan created",
    body: "The shift starts with planned unloading, staging, replenishment and dispatch activities already sequenced for the expected truck arrival.",
    label: "Planned execution",
  },
  {
    n: "02",
    title: "Truck delay occurs",
    body: "The inbound truck is delayed due to traffic, which means the original unloading and follow-on tasks can no longer happen as planned.",
    label: "Delay detected",
  },
  {
    n: "03",
    title: "Delay update flows into ATOS",
    body: "The revised ETA can come through an integrated GPS tracker or a manual update by the warehouse manager.",
    label: "ETA updated",
  },
  {
    n: "04",
    title: "ATOS reprioritises tasks",
    body: "ATOS reorders pending work, shifts task priority and reallocates MHE and operator attention during the delay window.",
    label: "Plan re-sequenced",
  },
  {
    n: "05",
    title: "Updated execution goes live",
    body: "Supervisors and operators work from a revised plan that reduces idle time and protects throughput.",
    label: "Execution updated",
  },
];

export function WexReprioritisation() {
  return (
    <section
      id="reprioritisation"
      className="bg-[#F5F5F7] pt-28 sm:pt-36 lg:pt-44 pb-28 sm:pb-36 lg:pb-44"
    >
      <style>{`
        @property --wexrep-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .wexrep-card { position: relative; isolation: isolate; }
        .wexrep-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--wexrep-shine-angle),
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
        .wexrep-card:hover::before {
          opacity: 1;
          animation: wexrep-shine 2.4s linear infinite;
        }
        @keyframes wexrep-shine {
          to { --wexrep-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .wexrep-card:hover::before { animation: none; }
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
            Dynamic Reprioritisation
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.85, ease: EASE }}
            className="text-[40px] sm:text-[60px] lg:text-[78px] font-bold text-carbon leading-[1.0] tracking-[-0.04em]"
          >
            When a truck is delayed, <br />
            <span className="text-graphite/50">the plan rearranges.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[15px] text-graphite/65 leading-[1.55] max-w-[880px] mx-auto"
          >
            If an incoming truck is stuck in traffic, the warehouse manager can
            update the delay in the system. ATOS then uses that input to
            re-sequence tasks, shift priorities and align MHE and operator
            effort with the revised arrival time.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-[1240px] mx-auto">
          {STEPS.map((s, i) => (
            <motion.article
              key={s.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: EASE }}
              className="wexrep-card flex flex-col p-8 bg-white transition-all duration-300 hover:-translate-y-1"
              style={{ borderRadius: 16, border: "1px solid #E8E8ED" }}
            >
              <span className="text-[11px] font-mono font-semibold tracking-[0.18em] text-signal-orange">
                {s.n}
              </span>

              <h3 className="mt-6 text-[17px] font-semibold text-carbon leading-[1.3] tracking-[-0.01em]">
                {s.title}
              </h3>

              <p className="mt-3 text-[13.5px] text-graphite/60 leading-[1.65]">
                {s.body}
              </p>

              <div className="mt-auto pt-8">
                <span
                  className="inline-flex items-center px-2.5 py-1.5 rounded-full text-[10px] font-mono font-semibold tracking-[0.14em] uppercase text-graphite/55"
                  style={{ background: "#F5F5F7", border: "1px solid #EAEAEE" }}
                >
                  {s.label}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
