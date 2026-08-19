"use client";

import { motion } from "framer-motion";

const METRICS: {
  value: string;
  unit?: string;
  heading: string;
  body: string;
}[] = [
  {
    value: "1",
    heading: "Rack Identity",
    body: "Digital identity for every rack, bay and upright element.",
  },
  {
    value: "360",
    unit: "\u00b0",
    heading: "Full Visibility",
    body: "One line of sight from inspection to corrective closure.",
  },
  {
    value: "RAG",
    heading: "Risk Classification",
    body: "Red · Amber · Green risk on every finding, every site.",
  },
  {
    value: "24",
    unit: "/7",
    heading: "Always-on",
    body: "Continuous management visibility across every warehouse.",
  },
  {
    value: "5",
    unit: "+",
    heading: "Global Standards",
    body: "RACS · AS4084 · EN15635 · ANSI MH16.1 · SEMA.",
  },
];

export function IrdsStatsBand() {
  return (
    <section
      className="border-t border-white/10"
      style={{ background: "#08080A" }}
      aria-label="RAMS Rack Safety Intelligence proof metrics"
    >
      <div className="rams-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 overflow-hidden">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.heading}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.55,
                delay: i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative -mt-px -ml-px flex flex-col border-t border-l border-white/10 px-6 sm:px-8 py-8 lg:py-10"
            >
              <h3 className="flex items-baseline gap-1 text-white font-bold leading-[0.95] tracking-[-0.035em] tabular-nums">
                <span className="text-[40px] sm:text-[44px] lg:text-[50px]">
                  {m.value}
                </span>
                {m.unit && (
                  <span className="text-[18px] sm:text-[20px] lg:text-[22px] font-bold text-white/85 tracking-[-0.02em]">
                    {m.unit}
                  </span>
                )}
              </h3>

              <div className="mt-4 text-[14px] sm:text-[15px] font-semibold text-white tracking-[-0.01em]">
                {m.heading}
              </div>

              <p className="mt-1.5 text-[13px] sm:text-[13.5px] font-medium text-white/55 leading-[1.55] max-w-[220px]">
                {m.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
