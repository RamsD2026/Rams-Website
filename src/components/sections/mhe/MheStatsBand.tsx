"use client";

import { motion } from "framer-motion";

/**
 * 02 — The proof band, in `IrdsStatsBand`'s shape: a figure, a heading and a
 * line, on the hero's own ink, with the cells ruled by a top and left border
 * pulled a pixel back over their neighbour.
 *
 * It carried the four words alone — Safety, Behaviour, Pallet, Fleet — at
 * 4xl with the whole sentence under them, which read as four column titles
 * rather than four claims.
 */
const METRICS: { value: string; unit?: string; heading: string; body: string }[] =
  [
    {
      value: "100",
      unit: "%",
      heading: "Fleet visibility",
      body: "Every MHE, trip and zone movement on one live operating view.",
    },
    {
      value: "1",
      heading: "Operator identity",
      body: "Every trip, session and safety event linked to the responsible person.",
    },
    {
      value: "24",
      unit: "/7",
      heading: "Safety monitoring",
      body: "Speed, impact and zone-rule events captured as they happen.",
    },
    {
      value: "360",
      unit: "°",
      heading: "Movement intelligence",
      body: "Utilisation, idle time and pallet flow turned into measurable insight.",
    },
  ];

export function MheStatsBand() {
  return (
    <section
      className="border-t border-white/10"
      style={{ background: "#08080A" }}
      aria-label="RAMS MHE Intelligence proof metrics"
    >
      <div className="rams-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 overflow-hidden">
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
