"use client";

import { motion } from "framer-motion";
import { DraftingCompass, Forklift, Hammer, Wrench } from "lucide-react";
import { ChapterHead, EASE, NoteLine, RAG, Section } from "./rackiq-shared";

/**
 * Lifecycle intelligence — where a finding belongs, and who that routes it to.
 *
 * Dark section, built on the card language the other dark sections on this
 * page use: rgba(255,255,255,0.03) fill, 0.10 hairline border.
 *
 * All four stages stay fully legible. An earlier pass dimmed the three
 * inactive ones to 35% white, which made three quarters of the section
 * unreadable to make one card stand out — the orange fill and border on
 * Operation already does that on its own.
 */

const STAGES = [
  {
    n: "01",
    Icon: DraftingCompass,
    k: "Design",
    d: "Engineering intent, capacity, configuration and technical requirements.",
  },
  {
    n: "02",
    Icon: Hammer,
    k: "Installation",
    d: "Erection, assembly, anchoring, geometry and plumbness.",
  },
  {
    n: "03",
    Icon: Forklift,
    k: "Operation",
    d: "Impact, loading, MHE interaction and operational damage.",
    hot: true,
  },
  {
    n: "04",
    Icon: Wrench,
    k: "Maintenance",
    d: "Repair, replacement, modification and unresolved corrective action.",
  },
];

const EXAMPLE = [
  { k: "Risk", v: "Red", rag: true },
  { k: "Lifecycle", v: "Operation" },
  { k: "Required action", v: "Replace" },
  { k: "Responsible function", v: "Maintenance / Operations" },
  { k: "Status", v: "Open" },
];

const HAIR = "rgba(255,255,255,0.10)";

export function RiqLifecycle() {
  return (
    <Section surface="darkMid" id="lifecycle">
      <ChapterHead
        center
        tone="dark"
        eyebrow="Lifecycle intelligence"
        top="A defect has a severity."
        bottom="It also has a lifecycle context."
        lede="Understand where the issue belongs before deciding who needs to act."
      />

      {/* ── the four stages ──────────────────────────────── */}
      <div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {STAGES.map((s, i) => (
          <motion.div
            key={s.k}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
            className="relative flex flex-col px-6 py-7 transition-colors duration-300"
            style={{
              borderRadius: 14,
              background: s.hot
                ? "linear-gradient(158deg, rgba(255,106,0,0.11) 0%, rgba(255,255,255,0.02) 62%)"
                : "rgba(255,255,255,0.03)",
              border: `1px solid ${s.hot ? "rgba(255,106,0,0.32)" : HAIR}`,
            }}
          >
            <span className="flex items-start justify-between gap-3">
              <s.Icon
                className="w-6 h-6 shrink-0"
                strokeWidth={1.5}
                style={{ color: s.hot ? "#FF6A00" : "rgba(255,255,255,0.55)" }}
                aria-hidden
              />
              <span
                className={
                  "text-[10px] font-mono font-bold tracking-[0.2em] tabular-nums " +
                  (s.hot ? "text-signal-orange" : "text-white/25")
                }
              >
                {s.n}
              </span>
            </span>

            <p className="mt-6 text-[19px] font-bold tracking-[-0.022em] text-white">
              {s.k}
            </p>

            <p className="mt-3 text-[13.5px] leading-[1.55] text-white/50">
              {s.d}
            </p>

            {s.hot && (
              <span
                className="mt-6 self-start inline-block px-2.5 py-1.5 rounded-full text-[10px] font-mono font-semibold tracking-[0.14em] uppercase text-signal-orange"
                style={{
                  background: "rgba(255,106,0,0.10)",
                  border: "1px solid rgba(255,106,0,0.28)",
                }}
              >
                This finding
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* ── the worked example, as one record ────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-3.5 overflow-hidden"
        style={{
          borderRadius: 14,
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${HAIR}`,
        }}
      >
        <div className="flex flex-wrap">
          {EXAMPLE.map((f, i) => (
            <div
              key={f.k}
              className="flex-1 min-w-[152px] px-6 py-6"
              style={{
                borderRight: i < EXAMPLE.length - 1 ? `1px solid ${HAIR}` : "none",
              }}
            >
              <p className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/35">
                {f.k}
              </p>
              <p className="mt-2.5 flex items-center gap-2 text-[15px] font-medium text-white">
                {f.rag && (
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: RAG.red.dark }}
                  />
                )}
                {f.v}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <NoteLine tone="dark" className="mt-8 !max-w-none text-center">
        IRDS structures operational responsibility from your configured
        workflow. It does not automatically determine contractual or legal
        liability.
      </NoteLine>
    </Section>
  );
}
