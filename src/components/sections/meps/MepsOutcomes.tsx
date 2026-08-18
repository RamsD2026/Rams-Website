"use client";

import { motion } from "framer-motion";

const METRICS = [
  {
    value: "40%",
    direction: "↓",
    label: "Impact Events",
    body: "Fewer rack, product, and pedestrian impacts within 90 days of deployment.",
  },
  {
    value: "27%",
    direction: "↑",
    label: "MHE Utilisation",
    body: "Higher productive minutes per shift by eliminating idle time and mis-tasking.",
  },
  {
    value: "3.2x",
    direction: "→",
    label: "Faster Investigations",
    body: "Impact-to-root-cause time drops from hours to minutes with automated capture.",
  },
  {
    value: "100%",
    direction: "→",
    label: "Fleet Visibility",
    body: "Every MHE, every shift, every operator — instrumented from day one.",
  },
];

export function MepsOutcomes() {
  return (
    <section className="bg-off-white-cool py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-14">
        <div className="mb-14 sm:mb-20 max-w-[720px]">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45 }}
            className="text-[10.5px] font-mono font-bold tracking-[0.22em] uppercase text-signal-orange mb-4"
          >
            Measurable Outcomes
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-[34px] sm:text-[46px] lg:text-[56px] font-bold text-carbon leading-[1.06] tracking-[-0.02em]"
          >
            Signals become
            <br />
            <span className="text-signal-orange">operational lift.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-steel-soft border border-steel-soft">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="bg-white p-8 lg:p-10 flex flex-col justify-between min-h-[280px]"
            >
              <div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-[56px] sm:text-[68px] font-bold text-carbon leading-none tracking-[-0.02em] tabular-nums">
                    {m.value}
                  </span>
                  <span className="text-[24px] font-bold text-signal-orange leading-none">
                    {m.direction}
                  </span>
                </div>
                <p className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-graphite/60 mt-4">
                  {m.label}
                </p>
              </div>

              <p className="text-[13px] text-graphite/60 leading-[1.6] mt-8 pt-6 border-t border-off-white-warm">
                {m.body}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 text-[12px] font-mono tracking-[0.14em] uppercase text-graphite/45 text-center"
        >
          Blended averages across RAMS enterprise deployments — 90-day post-go-live window.
        </motion.p>
      </div>
    </section>
  );
}
