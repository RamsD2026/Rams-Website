"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { EASE } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import type { ServiceSection } from "./service-types";

/**
 * Three blocks the rack-inspection review asked for, kept out of
 * `ServiceShell` because each is a drawing rather than a list:
 *
 *   Flow       the inspection-to-certification workflow, with the two
 *              certification paths drawn as a branch
 *   RagMap     the rack area map, and the three priority rows under it
 *   Standards  the recognised rack-safety practices, as chips
 *
 * They are section kinds like any other, so a service opts in from data.
 */

const HAIR = "#E8E8ED";
const HAIR_DARK = "rgba(255,255,255,0.10)";

/* ── the workflow ─────────────────────────────────────────────────── */

/**
 * `PREPARE → INSPECT → CLASSIFY → ENGINEERING REVIEW → CONCLUDE`, then the
 * certification decision as two paths.
 *
 * The review's own point: inspection establishes the condition, the office
 * engineering review decides what the condition means, and verification
 * closes corrective work — so "verify" appears once, on completed repairs,
 * and never on the office review.
 *
 * Always the dark band, like the `process` block it replaces.
 */
export function Flow({
  block,
}: {
  block: Extract<ServiceSection, { kind: "flow" }>;
}) {
  return (
    <>
      <SectionHeader
        eyebrow={block.eyebrow}
        top={block.top}
        bottom={block.bottom}
        body={block.body}
        tone="dark"
        size="compact"
        width="wide"
        className="!mb-14 sm:!mb-16"
      />

      {/* phase one — one line, left to right */}
      <ol className="flex flex-wrap items-stretch justify-center gap-3 lg:gap-4">
        {block.chain.map((step, i) => (
          <motion.li
            key={step.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
            className="flex items-center gap-3 lg:gap-4"
          >
            <div
              className="flex flex-col w-[180px] sm:w-[196px] px-5 py-4"
              style={{
                borderRadius: 12,
                background: "rgba(255,255,255,0.04)",
                boxShadow: `inset 0 0 0 1px ${HAIR_DARK}`,
              }}
            >
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mt-2 text-[15px] font-bold tracking-[-0.015em] text-white leading-[1.25]">
                {step.title}
              </span>
              <span className="mt-1.5 text-[12.5px] leading-[1.55] text-white/50">
                {step.body}
              </span>
            </div>
            {i < block.chain.length - 1 && (
              <ArrowRight
                className="hidden lg:block w-4 h-4 text-white/25 shrink-0"
                aria-hidden
              />
            )}
          </motion.li>
        ))}
      </ol>

      {/* the decision */}
      <div className="mt-12 flex flex-col items-center">
        <span
          aria-hidden
          className="block w-px h-8"
          style={{ background: HAIR_DARK }}
        />
        <span
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-white/70"
          style={{
            borderRadius: 999,
            background: "rgba(255,255,255,0.05)",
            boxShadow: `inset 0 0 0 1px ${HAIR_DARK}`,
          }}
        >
          {block.decision}
        </span>
      </div>

      {/* the two paths */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-5">
        {block.paths.map((path, p) => {
          const good = path.tone === "green";
          const ink = good ? "#2E9E5B" : "#E0912F";
          return (
            <motion.div
              key={path.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: p * 0.1, ease: EASE }}
              className="flex flex-col p-7 sm:p-8"
              style={{
                borderRadius: 16,
                background: "rgba(255,255,255,0.03)",
                boxShadow: `inset 0 0 0 1px ${HAIR_DARK}`,
              }}
            >
              <span
                className="inline-flex self-start items-center gap-2 px-3 py-1.5 text-[10px] font-mono font-bold tracking-[0.18em] uppercase"
                style={{
                  borderRadius: 999,
                  color: ink,
                  background: `${ink}1F`,
                  boxShadow: `inset 0 0 0 1px ${ink}59`,
                }}
              >
                <span
                  aria-hidden
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: ink }}
                />
                {path.label}
              </span>

              <p className="mt-5 text-[17px] sm:text-[18px] font-bold tracking-[-0.02em] text-white leading-[1.3]">
                {path.lead}
              </p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {path.steps.map((s) => (
                  <li
                    key={s}
                    className="inline-flex items-center gap-2 px-3.5 py-2 text-[12.5px] font-semibold text-white/85"
                    style={{
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.05)",
                      boxShadow: `inset 0 0 0 1px ${HAIR_DARK}`,
                    }}
                  >
                    <Check
                      className="w-3.5 h-3.5 shrink-0"
                      style={{ color: ink }}
                      strokeWidth={2.6}
                      aria-hidden
                    />
                    {s}
                  </li>
                ))}
              </ul>

              <p className="mt-auto pt-6 text-[13px] leading-[1.65] text-white/50">
                {path.body}
              </p>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-12 text-center text-[15px] sm:text-[16px] font-semibold tracking-[-0.015em] text-white/80 max-w-[760px] mx-auto">
        {block.footline}
      </p>
    </>
  );
}

/* ── the area map ─────────────────────────────────────────────────── */

const RAG = {
  red: { ink: "#E5484D", label: "Red" },
  amber: { ink: "#E0912F", label: "Amber" },
  green: { ink: "#2E9E5B", label: "Green" },
} as const;

/**
 * Sixty bays, and the ones that are not green.
 *
 * Written down rather than generated: the server and the client render this
 * markup independently, so a random layout would differ between them and the
 * map would change on hydration.
 */
const MAP_COLS = 10;
const MAP_ROWS = 6;
const MAP_MARKS: Partial<Record<number, "amber" | "red">> = {
  17: "red",
  24: "amber",
  39: "amber",
  42: "red",
  55: "amber",
};

function AreaMap({ title }: { title: string }) {
  return (
    <div
      className="w-full overflow-hidden"
      style={{ borderRadius: 16, background: "#0D1117" }}
    >
      {/* chrome */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: `1px solid ${HAIR_DARK}` }}
      >
        <span className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-white/70">
          <span
            aria-hidden
            className="w-1.5 h-1.5 rounded-full bg-signal-orange"
          />
          {title}
        </span>
        <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-white/35">
          RAG view
        </span>
      </div>

      <div className="px-5 sm:px-7 py-7">
        <p className="text-[9.5px] font-mono font-bold tracking-[0.2em] uppercase text-white/35">
          Warehouse rack map
        </p>

        <div className="mt-5 overflow-x-auto no-scrollbar">
          <div
            className="grid gap-2.5 min-w-[560px]"
            style={{ gridTemplateColumns: `repeat(${MAP_COLS}, minmax(0,1fr))` }}
            aria-hidden
          >
            {Array.from({ length: MAP_COLS * MAP_ROWS }, (_, i) => {
              const tone: keyof typeof RAG = MAP_MARKS[i] ?? "green";
              const { ink } = RAG[tone];
              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min(0.5, (i % MAP_COLS) * 0.02),
                  }}
                  className="flex items-center justify-center h-9"
                  style={{
                    borderRadius: 7,
                    background: "rgba(255,255,255,0.035)",
                    boxShadow: `inset 0 0 0 1px ${
                      tone === "green" ? HAIR_DARK : `${ink}66`
                    }`,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: ink,
                      boxShadow: tone === "green" ? "none" : `0 0 8px ${ink}`,
                    }}
                  />
                </motion.span>
              );
            })}
          </div>
        </div>

        <div
          className="mt-7 pt-5 flex flex-wrap items-center gap-x-7 gap-y-2"
          style={{ borderTop: `1px solid ${HAIR_DARK}` }}
        >
          <span className="text-[9.5px] font-mono font-bold tracking-[0.2em] uppercase text-white/35">
            Area-wise inspection visibility
          </span>
          {(
            [
              ["green", "No priority finding"],
              ["amber", "Planned attention"],
              ["red", "Priority review"],
            ] as const
          ).map(([tone, label]) => (
            <span
              key={tone}
              className="inline-flex items-center gap-2 text-[11.5px] text-white/60"
            >
              <span
                aria-hidden
                className="w-2 h-2 rounded-full"
                style={{ background: RAG[tone].ink }}
              />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Risk classification: the map, then the three priority rows — red first,
 * because the row a safety manager is looking for is the one that stops
 * work, and a scale that opens on green reads as a list of good news.
 */
export function RagMap({
  block,
  dark,
}: {
  block: Extract<ServiceSection, { kind: "ragmap" }>;
  dark: boolean;
}) {
  return (
    <>
      <SectionHeader
        eyebrow={block.eyebrow}
        top={block.top}
        bottom={block.bottom}
        body={block.body}
        tone={dark ? "dark" : "light"}
        size="compact"
        width="wide"
        className="!mb-12 sm:!mb-14"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <AreaMap title={block.mapTitle} />
      </motion.div>

      <p
        className={
          "mt-10 text-[15px] sm:text-[16px] font-semibold tracking-[-0.015em] " +
          (dark ? "text-white/75" : "text-carbon")
        }
      >
        {block.rowsLead}
      </p>

      <ul className="mt-5 flex flex-col gap-3">
        {block.rows.map((r, i) => {
          const { ink, label } = RAG[r.tone];
          return (
            <motion.li
              key={r.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
              className={
                "flex flex-wrap items-center gap-x-4 gap-y-2 px-5 sm:px-6 py-4 " +
                (dark ? "" : "bg-white")
              }
              style={{
                borderRadius: 12,
                boxShadow: `inset 0 0 0 1px ${dark ? HAIR_DARK : HAIR}`,
                background: dark ? "rgba(255,255,255,0.03)" : undefined,
              }}
            >
              <span
                aria-hidden
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: ink }}
              />
              <span className="flex-1 min-w-[220px]">
                <span
                  className={
                    "block text-[15px] font-semibold tracking-[-0.01em] " +
                    (dark ? "text-white" : "text-carbon")
                  }
                >
                  {r.title}
                </span>
                <span
                  className={
                    "block mt-1 text-[13.5px] leading-[1.6] " +
                    (dark ? "text-white/55" : "text-graphite/65")
                  }
                >
                  {r.body}
                </span>
              </span>
              <span className="flex flex-col items-end shrink-0">
                <span
                  className="text-[13px] font-bold tracking-[-0.01em]"
                  style={{ color: ink }}
                >
                  {label}
                </span>
                <span
                  className={
                    "text-[11.5px] " + (dark ? "text-white/45" : "text-graphite/50")
                  }
                >
                  {r.action}
                </span>
              </span>
            </motion.li>
          );
        })}
      </ul>

      {block.closing && (
        <p
          className={
            "mt-8 text-[16px] sm:text-[17px] italic tracking-[-0.015em] " +
            (dark ? "text-white/70" : "text-graphite/70")
          }
        >
          {block.closing}
        </p>
      )}
    </>
  );
}

/* ── the standards ────────────────────────────────────────────────── */

/**
 * The recognised practices an inspection can be run against, as chips on the
 * dark card the review supplied. Which one applies is a function of the rack
 * system, the site requirement, the client standard and the jurisdiction —
 * so the card names them and claims nothing about accreditation.
 */
export function Standards({
  block,
}: {
  block: Extract<ServiceSection, { kind: "standards" }>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="px-7 sm:px-10 lg:px-12 py-10 sm:py-12"
      style={{ borderRadius: 20, background: "#08080A" }}
    >
      <p className="flex items-center gap-3 text-[10.5px] font-mono font-bold tracking-[0.22em] uppercase text-signal-orange">
        <span
          aria-hidden
          className="w-6 h-px"
          style={{ background: "#FF6A00" }}
        />
        {block.eyebrow}
      </p>

      <h2 className="mt-5 text-[28px] sm:text-[36px] lg:text-[42px] font-bold tracking-[-0.035em] text-white leading-[1.1] max-w-[860px]">
        {block.top}
        {block.bottom && (
          <>
            {" "}
            <span className="text-white/45">{block.bottom}</span>
          </>
        )}
      </h2>

      {block.body && (
        <p className="mt-5 text-[14px] sm:text-[15px] leading-[1.7] text-white/55 max-w-[780px]">
          {block.body}
        </p>
      )}

      <ul className="mt-8 flex flex-wrap gap-2.5">
        {block.items.map((s, i) => (
          <motion.li
            key={s}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, delay: Math.min(0.5, i * 0.05) }}
            className="px-4 py-2.5 text-[13px] font-semibold text-white/85"
            style={{
              borderRadius: 999,
              background: "rgba(255,255,255,0.04)",
              boxShadow: `inset 0 0 0 1px ${HAIR_DARK}`,
            }}
          >
            {s}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
