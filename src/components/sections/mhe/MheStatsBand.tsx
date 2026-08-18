"use client";

import { motion } from "framer-motion";

const METRICS = [
  {
    value: "Safety",
    label:
      "Improve MHE safety with visibility into unsafe events, speed violations and risk-prone operating zones.",
  },
  {
    value: "Behaviour",
    label:
      "Monitor operator behaviour, movement patterns and equipment handling practices across daily operations.",
  },
  {
    value: "Pallet",
    label:
      "Understand how MHE movement impacts pallet handling flow, turnaround time and warehouse task execution.",
  },
  {
    value: "Fleet",
    label:
      "Turn fleet data into measurable utilisation, availability and productivity intelligence.",
  },
];

export function MheStatsBand() {
  return (
    <section
      className="border-t border-white/10"
      style={{ background: "#000E11" }}
      aria-label="RAMS MHE proof metrics"
    >
      <div className="rams-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 overflow-hidden">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.value}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.55,
                delay: i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative -mt-px -ml-px flex flex-col justify-center border-t border-l border-white/10 px-5 py-6 lg:px-8 min-h-[145px] lg:min-h-[160px]"
            >
              <div className="text-white text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-none tracking-tight">
                {m.value}
              </div>
              <div className="mt-3 text-xs sm:text-[13px] font-medium text-white/55 leading-[1.55]">
                {m.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
