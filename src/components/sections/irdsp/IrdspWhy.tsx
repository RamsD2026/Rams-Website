"use client";

import { motion } from "framer-motion";
import { EASE, ORANGE, ORANGE_SOFT, Section } from "./irdsp-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

const BEFORE = [
  "Spreadsheet",
  "Manual checklist",
  "Separate testing records",
  "Photos on a phone",
  "PDF report",
  "Manual analysis",
];

const AFTER = ["Rack", "Inspection", "Testing", "Issues", "Results", "Report"];

export function IrdspWhy() {
  return (
    <Section surface="white">
      <SectionHeader
        tone="light"
        eyebrow="Why IRDS"
        top="Inspection shouldn't live"
        bottom="in disconnected files."
        body="Every observation stays connected to the rack it came from, the test that measured it and the action that closed it."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-10 items-center max-w-[1120px] mx-auto">
        {/* before */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="p-7"
          style={{
            borderRadius: 18,
            background: "#F5F5F7",
            border: "1px solid #E8E8ED",
          }}
        >
          <div className="text-[9.5px] font-mono font-bold tracking-[0.2em] uppercase text-graphite/40 mb-5">
            Today
          </div>
          <div className="flex flex-col gap-2">
            {BEFORE.map((b) => (
              <div
                key={b}
                className="px-4 py-3 rounded-lg text-[13px] text-graphite/50"
                style={{
                  background: "#FFFFFF",
                  border: "1px dashed #D8D8DE",
                }}
              >
                {b}
              </div>
            ))}
          </div>
        </motion.div>

        {/* arrow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
          className="flex lg:flex-col items-center justify-center gap-3"
        >
          <span
            className="hidden lg:block w-px h-14"
            style={{ background: "linear-gradient(180deg, transparent, rgba(255,106,0,0.5))" }}
          />
          <span
            className="px-4 py-2 rounded-full text-[11px] font-mono font-bold tracking-[0.16em] uppercase shrink-0"
            style={{
              background: "rgba(255,106,0,0.12)",
              border: `1px solid ${ORANGE}55`,
              color: ORANGE_SOFT,
            }}
          >
            IRDS
          </span>
          <span
            className="hidden lg:block w-px h-14"
            style={{ background: "linear-gradient(180deg, rgba(255,106,0,0.5), transparent)" }}
          />
        </motion.div>

        {/* after */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="p-7"
          style={{
            borderRadius: 18,
            background: "rgba(255,106,0,0.045)",
            border: "1px solid rgba(255,106,0,0.22)",
          }}
        >
          <div
            className="text-[9.5px] font-mono font-bold tracking-[0.2em] uppercase mb-5"
            style={{ color: ORANGE_SOFT }}
          >
            With IRDS
          </div>
          <div className="flex flex-col gap-2">
            {AFTER.map((a, i) => (
              <div key={a} className="flex items-center gap-3">
                <span
                  className="flex-1 px-4 py-3 rounded-lg text-[13px] font-semibold text-carbon"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E8E8ED",
                  }}
                >
                  {a}
                </span>
                {i < AFTER.length - 1 && (
                  <span className="text-graphite/30 text-[11px] shrink-0">↓</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </Section>
  );
}
