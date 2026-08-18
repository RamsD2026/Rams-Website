"use client";

import { motion } from "framer-motion";

const METRICS = [
  { value: "1", label: "Live location record across every site" },
  { value: "24/7", label: "Continuous AI-vision counting and reconciliation" },
  { value: "99%+", label: "Inventory accuracy sustained network-wide" },
  { value: "0", label: "Scheduled cycle counts required" },
  { value: "10+", label: "WMS and ERP systems supported out of the box" },
];

export function InvStatsBand() {
  return (
    <section
      className="border-t border-white/10"
      style={{ background: "#08080A" }}
      aria-label="RAMS Inventory Intelligence proof metrics"
    >
      <div className="rams-container">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 overflow-hidden">
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
              className="relative -mt-px -ml-px flex flex-col justify-center border-t border-l border-white/10 px-5 py-6 lg:px-8 min-h-[125px] lg:min-h-[140px]"
            >
              <div className="text-white text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-none tracking-tighter tabular-nums">
                {m.value}
              </div>
              <div className="mt-2.5 text-xs sm:text-[13px] font-medium text-white/55">
                {m.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
