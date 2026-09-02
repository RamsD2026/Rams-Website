"use client";

import { motion } from "framer-motion";

/**
 * The operating model, in four words.
 *
 * Same band the other solution pages carry directly under the hero: four
 * cells on the ink ground, ruled rather than carded, so it reads as one
 * statement rather than four claims.
 */

const METRICS: { value: string; heading: string; body: string }[] = [
  {
    value: "Visible",
    heading: "Live equipment state",
    body: "Know the live health state of every connected MHE.",
  },
  {
    value: "Preventive",
    heading: "Before it stops",
    body: "Plan maintenance before failure becomes downtime.",
  },
  {
    value: "Traceable",
    heading: "A record that holds",
    body: "Track service status, alerts and equipment history.",
  },
  {
    value: "Actionable",
    heading: "Data that decides",
    body: "Turn machine data into operational decisions.",
  },
];

export function DiaStatsBand() {
  return (
    <section
      className="border-t border-white/10"
      style={{ background: "#08080A" }}
      aria-label="RAMS MHE Diagnostics operating model"
    >
      <div className="rams-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 overflow-hidden">
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
              className="relative -mt-px -ml-px flex flex-col border-t border-l border-white/10 px-6 sm:px-8 py-8 lg:py-10"
            >
              <h3 className="text-white font-bold leading-[0.95] tracking-[-0.035em] text-[30px] sm:text-[34px] lg:text-[38px]">
                {m.value}
              </h3>

              <div className="mt-4 text-[14px] sm:text-[15px] font-semibold text-white tracking-[-0.01em]">
                {m.heading}
              </div>

              <p className="mt-1.5 text-[13px] sm:text-[13.5px] font-medium text-white/55 leading-[1.55] max-w-[260px]">
                {m.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
