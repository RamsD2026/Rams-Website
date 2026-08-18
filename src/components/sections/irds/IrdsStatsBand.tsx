"use client";

import { motion } from "framer-motion";

const METRICS = [
  { value: "1", label: "Digital identity for every rack element" },
  { value: "360\u00b0", label: "Visibility from inspection to closure" },
  { value: "RAG", label: "Risk-based health classification" },
  { value: "24/7", label: "Management visibility across sites" },
  { value: "5+", label: "Global safety standards followed in RAMS" },
];

export function IrdsStatsBand() {
  return (
    <section
      className="border-t border-white/10"
      style={{ background: "#000E11" }}
      aria-label="RAMS proof metrics"
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
