"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { BigLine, EASE, RAG, type Rag, Section } from "./rackiq-shared";

/** History — the same bay across four cycles, one card each. */

const LINE = "#E8E8ED";

const CYCLES: { n: string; label: string; status: string; rag: Rag }[] = [
  { n: "Insp. 01", label: "Baseline", status: "No findings", rag: "green" },
  { n: "Insp. 02", label: "Impact", status: "Amber · monitored", rag: "amber" },
  { n: "Insp. 03", label: "Upright bent", status: "Red · repaired", rag: "red" },
  { n: "Insp. 04", label: "Repeat impact", status: "Red · recurring", rag: "red" },
];

export function RiqHistory() {
  return (
    <Section surface="warm" id="history">
      <SectionHeader
        eyebrow="History"
        top="One inspection shows the condition."
        bottom="History reveals the pattern."
        size="compact"
        width="wide"
      />

      <p className="text-[10.5px] font-mono font-bold tracking-[0.16em] uppercase text-graphite/45 mb-6">
        Rack R07 / Bay 14 · condition across inspection cycles
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {CYCLES.map((c, i) => {
          const col = RAG[c.rag];
          return (
            <motion.div
              key={c.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
              className="flex flex-col px-6 py-7 bg-white"
              style={{
                borderRadius: 12,
                border: `1px solid ${LINE}`,
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
              }}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-graphite/35">
                  {c.n}
                </span>
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: col.app }}
                />
              </span>

              <p className="mt-5 font-rams-heading text-[19px] font-bold tracking-[-0.022em] text-carbon leading-[1.2]">
                {c.label}
              </p>

              <p
                className="mt-2.5 text-[13px] font-medium"
                style={{ color: col.app }}
              >
                {c.status}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* ── what that changes ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-16 sm:mt-20 text-center"
      >
        {/* BigLine ships a 24ch measure; both lines here are meant to run
            unbroken, so the measure is lifted on this instance only. */}
        <BigLine center className="!max-w-none">
          The next inspection starts with knowledge{" "}
          <span className="text-graphite/45">— not a blank sheet.</span>
        </BigLine>
        <p className="mt-4 text-[15px] sm:text-[16px] text-graphite/60 leading-[1.6]">
          Every inspection updates the intelligence. It does not restart it.
        </p>
      </motion.div>
    </Section>
  );
}
