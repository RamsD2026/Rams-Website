"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "./rackiq-shared";

/** Technology shown through capability, not vocabulary. */

const TECH = [
  ["Tablet Application", "Structures inspection data at the physical asset."],
  ["Digital Twin", "Provides identity, location and historical context."],
  [
    "Engineering Rules",
    "Compares defined parameters against configured acceptance criteria.",
  ],
  [
    "Classification Logic",
    "Structures RAG, lifecycle, action and responsibility.",
  ],
  ["Historical Intelligence", "Preserves condition across inspection cycles."],
  ["Spatial Analytics", "Generates hotspot, contour and concentration views."],
  [
    "Workflow Engine",
    "Tracks responsibility, corrective action, verification and closure.",
  ],
  [
    "BoQ Intelligence",
    "Consolidates verified rack and component data into repair requirements.",
  ],
];

export function RiqTech() {
  return (
    <Section surface="darkMid" id="tech">
      <SectionHeader
        eyebrow="The technology"
        top="The technology behind"
        bottom="rack intelligence."
        body="The power is not in collecting more data. It is in structuring it."
        tone="dark"
        size="compact"
        width="wide"
      />

      {/* Every cell draws a right border, which leaves one running down the
          grid's outer edge. The wrapper clips a pixel off the right so the
          last column in each row loses it — at every breakpoint, without
          index maths that would break between 2-up and 4-up. */}
      <div
        className="overflow-hidden"
        style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 -mr-px">
          {TECH.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.06, ease: EASE }}
              className="px-6 py-8"
              style={{
                borderRight: "1px solid rgba(255,255,255,0.12)",
                borderBottom: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <p className="text-[10px] font-mono font-bold tabular-nums text-signal-orange mb-4">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-white">
                {t}
              </h3>
              <p className="mt-2.5 text-[13.5px] text-white/50 leading-[1.55]">
                {d}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
