"use client";

import { motion } from "framer-motion";

const METRICS = [
  {
    value: "Visibility",
    label: "Know where inventory is stored across racks, bays and zones.",
  },
  {
    value: "Accuracy",
    label: "Compare physical inventory with expected system records.",
  },
  {
    value: "Aging",
    label: "Identify slow-moving and aging inventory before it becomes a problem.",
  },
  {
    value: "Control",
    label: "Prioritise discrepancies, exceptions and reconciliation actions.",
  },
];

export function InvStatsBand() {
  return (
    <section
      className="border-t border-white/10"
      style={{ background: "#08080A" }}
      aria-label="RAMS Inventory Intelligence proof metrics"
    >
      <div className="rams-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 overflow-hidden">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.55,
                delay: i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative -mt-px -ml-px flex flex-col justify-center border-t border-l border-white/10 px-6 sm:px-8 py-6 lg:py-7 min-h-[125px] lg:min-h-[140px]"
            >
              <h3 className="text-white text-[30px] sm:text-[32px] lg:text-[36px] font-semibold leading-[1.15] tracking-[-0.02em]">
                {m.value}
              </h3>
              <p className="mt-3.5 text-[14px] sm:text-[15px] font-medium text-white/55 leading-[1.55] max-w-[240px]">
                {m.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
