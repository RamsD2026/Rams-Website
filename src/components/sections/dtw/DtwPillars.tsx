"use client";

import { motion } from "framer-motion";
import { EASE } from "./dtw-shared";

const PILLARS = [
  {
    title: "Spatial Model",
    body: "Zones, aisles, racks, bays and levels modelled as one hierarchy every system resolves against.",
    tags: ["HIERARCHICAL", "ADDRESSED", "SURVEYED"],
  },
  {
    title: "Live State",
    body: "Scans, sensors, inspections and task events land on the location they describe as they happen.",
    tags: ["STREAMING", "BOUND", "SUB-2s"],
  },
  {
    title: "Full History",
    body: "State is versioned rather than overwritten, so any location can be replayed at any past moment.",
    tags: ["VERSIONED", "REPLAYABLE", "AUDITED"],
  },
  {
    title: "Shared Layer",
    body: "Six RAMS systems and your WMS read the same model, so nothing keeps a private copy of the site.",
    tags: ["OPEN API", "WEBHOOKS", "ONE TRUTH"],
  },
];

export function DtwPillars() {
  return (
    <section
      className="relative text-white border-t border-white/[0.07]"
      style={{ background: "#08080A" }}
    >
      <div className="rams-container py-24 sm:py-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: "rgba(255,255,255,0.07)" }}>
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: EASE }}
              className="flex flex-col p-8 lg:p-9"
              style={{ background: "#08080A" }}
            >
              <h3 className="text-[20px] font-bold tracking-[-0.02em] leading-[1.25]">
                {p.title}
              </h3>
              <p className="mt-3.5 text-[13.5px] text-white/50 leading-[1.65]">
                {p.body}
              </p>
              <div className="mt-auto pt-8 flex flex-col gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[9.5px] font-mono font-bold tracking-[0.18em] text-white/30"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
