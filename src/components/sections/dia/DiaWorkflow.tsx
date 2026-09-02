"use client";

import { motion } from "framer-motion";

/**
 * Workflow.
 *
 * The five-step run the other solution pages use — numbered nodes on one
 * rule, so the steps read as a sequence rather than five cards.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const STEPS = [
  {
    n: "01",
    title: "Connect",
    body: "Connect MHE assets, machine signals and monitoring inputs into one digital structure.",
  },
  {
    n: "02",
    title: "Capture",
    body: "Collect live diagnostics, battery, condition and equipment activity data from the fleet.",
  },
  {
    n: "03",
    title: "Validate",
    body: "Review faults, alerts and service due conditions to identify machines needing action.",
  },
  {
    n: "04",
    title: "Analyse",
    body: "Assess health, readiness, downtime risk and maintenance load across equipment and sites.",
  },
  {
    n: "05",
    title: "Improve",
    body: "Use the insights to drive preventive action, service planning and stronger fleet reliability.",
  },
];

export function DiaWorkflow() {
  return (
    <section
      id="workflow"
      className="bg-white pt-28 sm:pt-36 lg:pt-44 pb-28 sm:pb-36 lg:pb-44"
    >
      <div className="rams-container">
        <div className="max-w-[900px] mx-auto text-center mb-20 sm:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange mb-5"
          >
            How it works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.85, ease: EASE }}
            className="text-[40px] sm:text-[60px] lg:text-[74px] font-bold text-carbon leading-[1.04] tracking-[-0.04em]"
          >
            A connected diagnostics <br />
            <span className="text-graphite/50">and maintenance workflow.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[15px] text-graphite/65 leading-[1.55] max-w-[880px] mx-auto"
          >
            RAMS helps warehouse teams move from isolated equipment issues to a
            more structured process for monitoring, detecting, planning and
            improving MHE maintenance control.
          </motion.p>
        </div>

        <div className="relative max-w-[1240px] mx-auto">
          <div
            aria-hidden
            className="hidden md:block absolute left-0 right-0 top-[46px] h-px"
            style={{
              background:
                "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.08) 12%, rgba(0,0,0,0.08) 88%, transparent 100%)",
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-6">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                className="relative flex flex-col items-center text-center px-3"
              >
                <div className="relative mb-8">
                  <div
                    aria-hidden
                    className="absolute inset-0 rounded-full blur-2xl opacity-70"
                    style={{
                      background:
                        "radial-gradient(closest-side, rgba(255,106,0,0.35), transparent 70%)",
                    }}
                  />
                  <div
                    className="relative w-[92px] h-[92px] rounded-full flex items-center justify-center font-mono font-bold text-[18px] tracking-[0.02em] bg-white"
                    style={{
                      border: "1px solid #EBEBEF",
                      color: "#0E0E0F",
                      boxShadow:
                        "0 10px 30px -12px rgba(0,0,0,0.12), 0 2px 6px -1px rgba(0,0,0,0.04)",
                    }}
                  >
                    <span
                      style={{
                        background:
                          "linear-gradient(135deg, #FF6A00 0%, #FF8A3C 100%)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      {s.n}
                    </span>
                  </div>
                </div>
                <h3 className="text-[22px] sm:text-[26px] font-bold text-carbon tracking-[-0.025em] leading-[1.15]">
                  {s.title}
                </h3>
                <p className="mt-4 text-[14.5px] text-graphite/65 leading-[1.65] max-w-[240px]">
                  {s.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
