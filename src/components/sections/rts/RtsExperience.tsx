"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TwinFacility } from "@/components/sections/twin/TwinFacility";
import {
  EASE,
  Section,
  frameStyle,
} from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 06 — Product experience.
 *
 * The section-six slot, on the same dark ground and with the same two-state
 * control as the other four platform pages — and **the layout does not change
 * between the states.** Same four figures, same five context rows, same four
 * priority events, same footer line. Only the values arrive.
 *
 * The switch is the source document's own "simulate proximity risk". Left of
 * it, MHE 04 is inside every limit: 5.2 km/h against a 6.0 limit, nearest
 * person 6.4m. Right of it, one thing has changed in the physical world and
 * the whole record re-reads — speed, separation, risk status, the event list
 * and the count of high-risk events.
 *
 * Nothing about the warehouse changed between the two sides. That is the
 * argument: the system did not learn about the risk later, from a form.
 *
 * Red, Amber and Green mean severity, which on a safety page is not optional.
 *
 * No `Math.random`. Both states are written down, so the server and the client
 * render the same first frame.
 *
 * Figures are one shift's readout, headed as such. Not a benchmark, and not a
 * customer result.
 */

const LINE = "rgba(255,255,255,0.10)";
const GREEN = "#54DE91";
const AMBER = "#E8A33D";
const RED = "#FF6C6C";

/* ── the two states ──────────────────────────────────────
   Same shape, same row count, same length. */

const STATS_OK: [string, string, string][] = [
  ["Events · 7 shifts", "46", "#FFFFFF"],
  ["High risk", "04", AMBER],
  ["Acknowledged", "93%", GREEN],
  ["Open actions", "05", "#FFFFFF"],
];

const STATS_RISK: [string, string, string][] = [
  ["Events · 7 shifts", "47", "#FFFFFF"],
  ["High risk", "05", RED],
  ["Acknowledged", "93%", GREEN],
  ["Open actions", "06", "#FFFFFF"],
];

const CONTEXT_OK: [string, string, string][] = [
  ["Operator", "OP-118 · authenticated", "#FFFFFF"],
  ["Current speed", "5.2 km/h", "#FFFFFF"],
  ["Zone limit", "6.0 km/h", "#FFFFFF"],
  ["Nearest person", "6.4 m", "#FFFFFF"],
  ["Risk status", "Within threshold", GREEN],
];

const CONTEXT_RISK: [string, string, string][] = [
  ["Operator", "OP-118 · authenticated", "#FFFFFF"],
  ["Current speed", "7.1 km/h", RED],
  ["Zone limit", "6.0 km/h", "#FFFFFF"],
  ["Nearest person", "1.8 m", RED],
  ["Risk status", "Critical proximity", RED],
];

type Ev = { k: string; where: string; tint: string };

const EVENTS_OK: Ev[] = [
  { k: "Rack impact", where: "Zone B4 · 14:02", tint: RED },
  { k: "Speed event", where: "Aisle 07 · 14:06", tint: AMBER },
  { k: "Proximity risk", where: "Crossing 02 · 13:41", tint: AMBER },
  { k: "Repeat location", where: "Dock 05 · 4 events", tint: AMBER },
];

const EVENTS_RISK: Ev[] = [
  { k: "Proximity risk", where: "Aisle 07 · now", tint: RED },
  { k: "Rack impact", where: "Zone B4 · 14:02", tint: RED },
  { k: "Speed event", where: "Aisle 07 · 14:06", tint: AMBER },
  { k: "Repeat location", where: "Dock 05 · 4 events", tint: AMBER },
];

const NOTE_OK =
  "Three repeated events are concentrated around the outbound turning zone during shift change.";
const NOTE_RISK =
  "Alert created · supervisor notified · event evidence preserved · follow-up action ready.";

export function RtsExperience() {
  const [risk, setRisk] = useState(false);

  const stats = risk ? STATS_RISK : STATS_OK;
  const context = risk ? CONTEXT_RISK : CONTEXT_OK;
  const events = risk ? EVENTS_RISK : EVENTS_OK;

  return (
    <Section surface="ink" id="experience">
      <SectionHeader
        eyebrow="Product experience"
        top="See the event."
        bottom="Then see the pattern."
        tone="dark"
        size="compact"
        width="wide"
        body="Move from a live facility view to impacts, behaviour, hotspots and action status without losing the underlying physical context."
      />

      {/* the switch — one thing changes in the physical world */}
      <div className="flex justify-center mb-4">
        <div
          className="inline-flex p-1 rounded-full"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: `1px solid ${LINE}`,
          }}
        >
          {[
            ["Monitoring", false],
            ["Simulate proximity risk", true],
          ].map(([label, v]) => {
            const on = risk === v;
            return (
              <button
                key={String(label)}
                type="button"
                onClick={() => setRisk(v as boolean)}
                className={
                  "relative px-5 py-2.5 rounded-full text-[13px] font-semibold transition-colors duration-300 " +
                  (on ? "text-carbon" : "text-white/45 hover:text-white/75")
                }
              >
                {on && (
                  <motion.span
                    layoutId="rtsexp-switch"
                    className="absolute inset-0 rounded-full bg-white"
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                )}
                <span className="relative">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-center text-[12px] text-white/35 mb-10">
        See how RTSS combines detection with MHE, operator, zone, speed and
        location context.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="overflow-hidden"
        style={frameStyle("dark")}
      >
        {/* chrome */}
        <div
          className="flex items-center gap-2 px-4 py-3 flex-wrap"
          style={{ borderBottom: `1px solid ${LINE}`, background: "#111114" }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: "rgba(255,255,255,0.14)" }}
            />
          ))}
          <div
            className="ml-3 flex-1 min-w-[180px] max-w-[320px] h-6 rounded-md flex items-center px-3"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <span className="text-[10.5px] font-mono text-white/35 truncate">
              app.rams.digital/rtss
            </span>
          </div>

          <span className="ml-auto shrink-0 flex items-center gap-2">
            <span className="relative flex w-1.5 h-1.5">
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ background: risk ? RED : GREEN }}
                animate={{ scale: [1, 2.8], opacity: [0.6, 0] }}
                transition={{
                  duration: risk ? 1.1 : 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <span
                className="relative w-1.5 h-1.5 rounded-full"
                style={{ background: risk ? RED : GREEN }}
              />
            </span>
            <motion.span
              className="text-[10px] font-mono font-semibold tracking-[0.14em] uppercase"
              initial={false}
              animate={{ color: risk ? RED : GREEN }}
              transition={{ duration: 0.4 }}
            >
              {risk ? "Critical alert" : "Monitoring"}
            </motion.span>
          </span>
        </div>

        {/* the shift, in four numbers. Four tiles either way. */}
        <div className="flex flex-wrap" style={{ borderBottom: `1px solid ${LINE}` }}>
          {stats.map(([k, v, tint], i) => (
            <div
              key={k}
              className="flex-1 min-w-[150px] px-5 py-4"
              style={{
                borderRight: i < stats.length - 1 ? `1px solid ${LINE}` : "none",
              }}
            >
              <p className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/35">
                {k}
              </p>
              <p className="mt-2 h-[26px] text-[24px] font-bold tabular-nums tracking-[-0.03em] leading-[26px]">
                <motion.span
                  key={`${k}-${v}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05, ease: EASE }}
                  style={{ color: tint, display: "inline-block" }}
                >
                  {v}
                </motion.span>
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
          {/* ── the floor ─────────────────────────────── */}
          <div
            className="p-4 sm:p-6 xl:border-r"
            style={{ borderColor: LINE }}
          >
            <div
              className="relative overflow-hidden"
              style={{
                borderRadius: 12,
                border: `1px solid ${LINE}`,
                background: "#0A0A0D",
              }}
            >
              <div className="p-3 sm:p-4 aspect-[884/504]">
                <TwinFacility step={risk ? 4 : 3} tone="dark" routes />
              </div>

              {/* the alert, over the floor. Absolute, so its arrival cannot
                  change the height of anything. */}
              <AnimatePresence>
                {risk && (
                  <motion.div
                    className="absolute left-4 top-4 right-4 sm:left-6 sm:top-6 sm:right-6 px-4 py-3 rounded-[10px]"
                    style={{
                      background: "rgba(24,10,10,0.92)",
                      border: `1px solid ${RED}66`,
                      backdropFilter: "blur(8px)",
                    }}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    <p
                      className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase"
                      style={{ color: RED }}
                    >
                      Proximity alert · Aisle 07
                    </p>
                    <p className="mt-1.5 text-[12px] text-white/60 leading-[1.5]">
                      MHE 04 within 1.8 m of a person, above the 6.0 km/h zone
                      limit.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className="mt-4 text-[11px] font-mono font-bold tracking-[0.14em] uppercase text-white/25">
              Digital Twin · live safety context
            </p>
          </div>

          {/* ── the record ────────────────────────────── */}
          <div
            className="p-4 sm:p-6 flex flex-col gap-4 border-t xl:border-t-0"
            style={{ borderColor: LINE }}
          >
            <div
              className="p-4 sm:p-5"
              style={{
                borderRadius: 12,
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${LINE}`,
              }}
            >
              <motion.p
                className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase"
                initial={false}
                animate={{ color: risk ? RED : GREEN }}
                transition={{ duration: 0.4 }}
              >
                MHE 04 · {risk ? "critical proximity" : "normal operation"}
              </motion.p>

              {/* Five rows either way, each height-pinned. */}
              <div className="mt-3 flex flex-col">
                {context.map(([k, v, tint], i) => (
                  <span
                    key={k}
                    className="flex items-center justify-between gap-4 h-[38px]"
                    style={{ borderBottom: `1px dashed ${LINE}` }}
                  >
                    <span className="text-[12.5px] text-white/50">{k}</span>
                    <motion.span
                      key={`${k}-${v}`}
                      className="text-[12.5px] font-mono font-bold tabular-nums text-right"
                      style={{ color: tint }}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: i * 0.05,
                        ease: EASE,
                      }}
                    >
                      {v}
                    </motion.span>
                  </span>
                ))}
              </div>
            </div>

            <div
              className="p-4 sm:p-5 flex-1"
              style={{
                borderRadius: 12,
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${LINE}`,
              }}
            >
              <p className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/35">
                Priority events
              </p>

              {/* Four rows either way. */}
              <div className="mt-3.5 flex flex-col gap-2">
                {events.map((e, i) => (
                  <motion.span
                    key={`${risk ? "r" : "o"}-${e.k}`}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.06, ease: EASE }}
                    className="flex items-center gap-2.5 px-3 h-[40px] rounded-[10px]"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${i === 0 && risk ? `${RED}59` : LINE}`,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: e.tint }}
                    />
                    <span className="text-[12px] text-white/70 truncate">
                      {e.k}
                    </span>
                    <span className="ml-auto text-[10px] font-mono text-white/35 shrink-0">
                      {e.where}
                    </span>
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* one line, always here — only its reading changes */}
        <div className="px-5 py-4" style={{ borderTop: `1px solid ${LINE}` }}>
          <p className="text-[12.5px] leading-[1.6] min-h-[20px] text-white/45">
            <AnimatePresence mode="wait">
              <motion.span
                key={risk ? "risk" : "ok"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="block"
              >
                {risk ? NOTE_RISK : NOTE_OK}
              </motion.span>
            </AnimatePresence>
          </p>
        </div>
      </motion.div>
    </Section>
  );
}
