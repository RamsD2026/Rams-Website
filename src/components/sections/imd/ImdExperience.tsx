"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
 * control as the other five platform pages — and **the layout does not change
 * between the states.** Same four figures, same trend, same six asset rows,
 * same four attention rows, same footer line. Only the values arrive.
 *
 * The switch runs the source document's own "simulate diagnostic fault". Left
 * of it MHE 04 is healthy at 87 with no open codes; right of it one battery
 * temperature has crossed its threshold, and the score, the fleet counts, the
 * trend's last point, the asset record and the attention list all re-read.
 *
 * The trend is two written-down series of twelve points, drawn as a single
 * `polyline` in a stretched viewBox. There is no marker dot on it, on purpose:
 * a `<circle>` in a non-uniformly scaled SVG comes out an oval, and this chart
 * does not need one to make its point.
 *
 * Green, amber and red mean asset condition here.
 *
 * Figures are one fleet's readout over 30 days, headed as such. Not a
 * benchmark, and not a customer result.
 */

const LINE = "rgba(255,255,255,0.10)";
const GREEN = "#54DE91";
const AMBER = "#E8A33D";
const RED = "#FF6C6C";

/* ── the two states ────────────────────────────────────── */

const STATS_OK: [string, string, string][] = [
  ["Availability", "94%", GREEN],
  ["Attention", "05", AMBER],
  ["Critical", "02", RED],
  ["Work orders", "09", "#FFFFFF"],
];

const STATS_FAULT: [string, string, string][] = [
  ["Availability", "94%", GREEN],
  ["Attention", "04", AMBER],
  ["Critical", "03", RED],
  ["Work orders", "10", "#FFFFFF"],
];

/** Fleet availability, twelve points across thirty days. */
const TREND_OK = [91, 93, 92, 94, 95, 94, 96, 95, 94, 95, 94, 94];
const TREND_FAULT = [91, 93, 92, 94, 95, 94, 96, 95, 94, 95, 93, 89];

const ASSET_OK: [string, string, string][] = [
  ["Battery SOC / SOH", "72% / 91%", "#FFFFFF"],
  ["Battery temperature", "38 °C", "#FFFFFF"],
  ["Operating hours", "4,812 h", "#FFFFFF"],
  ["Open fault codes", "00", GREEN],
  ["Next service", "42 operating h", "#FFFFFF"],
  ["Condition", "Healthy", GREEN],
];

const ASSET_FAULT: [string, string, string][] = [
  ["Battery SOC / SOH", "72% / 91%", "#FFFFFF"],
  ["Battery temperature", "48 °C", RED],
  ["Operating hours", "4,812 h", "#FFFFFF"],
  ["Open fault codes", "01 · DTC-B17", RED],
  ["Next service", "Brought forward", AMBER],
  ["Condition", "Critical", RED],
];

type Row = { k: string; who: string; tint: string };

const ATTENTION_OK: Row[] = [
  { k: "Battery temperature", who: "MHE 04", tint: AMBER },
  { k: "Hydraulic pressure", who: "MHE 12", tint: AMBER },
  { k: "Service overdue", who: "MHE 09", tint: AMBER },
  { k: "Repeat fault", who: "MHE 17", tint: RED },
];

const ATTENTION_FAULT: Row[] = [
  { k: "DTC-B17 · battery temp", who: "MHE 04", tint: RED },
  { k: "Repeat fault", who: "MHE 17", tint: RED },
  { k: "Hydraulic pressure", who: "MHE 12", tint: AMBER },
  { k: "Service overdue", who: "MHE 09", tint: AMBER },
];

const NOTE_OK =
  "Two high-hour MHEs account for 61% of hydraulic fault recurrence this month.";
const NOTE_FAULT =
  "Fault DTC-B17 · battery temperature rising · maintenance review created · MHE use restriction recommended.";

const AXIS = ["30 days", "20 days", "10 days", "Today"];

/* The chart box, in its own units. Stretched horizontally, so the trend is
   drawn with `vectorEffect` on the stroke and carries no circular marker. */
const CW = 300;
const CH = 96;

function trendPath(series: number[]) {
  const lo = 85;
  const hi = 100;
  return series
    .map((v, i) => {
      const x = (i / (series.length - 1)) * CW;
      const y = CH - ((v - lo) / (hi - lo)) * CH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function ImdExperience() {
  const [fault, setFault] = useState(false);

  const stats = fault ? STATS_FAULT : STATS_OK;
  const asset = fault ? ASSET_FAULT : ASSET_OK;
  const attention = fault ? ATTENTION_FAULT : ATTENTION_OK;
  const points = trendPath(fault ? TREND_FAULT : TREND_OK);

  return (
    <Section surface="ink" id="experience">
      <SectionHeader
        eyebrow="Product experience"
        top="Move from fleet status"
        bottom="To asset diagnosis."
        tone="dark"
        size="compact"
        width="wide"
        body="Select any connected MHE to inspect health, current parameters, fault history, operating context and planned maintenance."
      />

      {/* the switch — one parameter crosses its threshold */}
      <div className="flex justify-center mb-4">
        <div
          className="inline-flex p-1 rounded-full"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: `1px solid ${LINE}`,
          }}
        >
          {[
            ["Fleet health", false],
            ["Simulate diagnostic fault", true],
          ].map(([label, v]) => {
            const on = fault === v;
            return (
              <button
                key={String(label)}
                type="button"
                onClick={() => setFault(v as boolean)}
                className={
                  "relative px-5 py-2.5 rounded-full text-[13px] font-semibold transition-colors duration-300 " +
                  (on ? "text-carbon" : "text-white/45 hover:text-white/75")
                }
              >
                {on && (
                  <motion.span
                    layoutId="imdexp-switch"
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
        See how IMDS connects the signal to the asset, operating context and
        maintenance history.
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
              app.rams.digital/imds
            </span>
          </div>

          <span className="ml-auto shrink-0 flex items-center gap-2">
            <span className="relative flex w-1.5 h-1.5">
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ background: fault ? RED : GREEN }}
                animate={{ scale: [1, 2.8], opacity: [0.6, 0] }}
                transition={{
                  duration: fault ? 1.1 : 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <span
                className="relative w-1.5 h-1.5 rounded-full"
                style={{ background: fault ? RED : GREEN }}
              />
            </span>
            <motion.span
              className="text-[10px] font-mono font-semibold tracking-[0.14em] uppercase"
              initial={false}
              animate={{ color: fault ? RED : GREEN }}
              transition={{ duration: 0.4 }}
            >
              {fault ? "Fault DTC-B17" : "Connected"}
            </motion.span>
          </span>
        </div>

        {/* the fleet, in four numbers */}
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

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          {/* ── the trend ─────────────────────────────── */}
          <div
            className="p-4 sm:p-6 xl:border-r"
            style={{ borderColor: LINE }}
          >
            <div className="flex items-baseline justify-between gap-3 mb-4">
              <span className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/35">
                Fleet health trend · last 30 days
              </span>
              <span className="text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase text-white/25">
                Live + history
              </span>
            </div>

            <div
              className="w-full overflow-hidden"
              style={{
                aspectRatio: "300 / 96",
                borderRadius: 10,
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${LINE}`,
              }}
            >
              <svg
                viewBox={`0 0 ${CW} ${CH}`}
                preserveAspectRatio="none"
                className="w-full h-full block"
                aria-hidden
              >
                {[0.25, 0.5, 0.75].map((f) => (
                  <line
                    key={f}
                    x1={0}
                    x2={CW}
                    y1={CH * f}
                    y2={CH * f}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}

                <motion.polyline
                  points={`0,${CH} ${points} ${CW},${CH}`}
                  fill={fault ? RED : GREEN}
                  fillOpacity={0.08}
                  stroke="none"
                  initial={false}
                  animate={{ opacity: 1 }}
                />
                <motion.polyline
                  points={points}
                  fill="none"
                  stroke={fault ? RED : GREEN}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  initial={false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
              </svg>
            </div>

            <div className="mt-2.5 flex justify-between">
              {AXIS.map((a) => (
                <span
                  key={a}
                  className="text-[9px] font-mono text-white/25 tabular-nums"
                >
                  {a}
                </span>
              ))}
            </div>

            {/* what needs looking at. Four rows either way. */}
            <p className="mt-6 text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/35">
              Priority attention
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {attention.map((r, i) => (
                <motion.span
                  key={`${fault ? "f" : "o"}-${r.k}`}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.06, ease: EASE }}
                  className="flex items-center gap-2.5 px-3 h-[40px] rounded-[10px]"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${i === 0 && fault ? `${RED}59` : LINE}`,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: r.tint }}
                  />
                  <span className="text-[12px] text-white/70 truncate">
                    {r.k}
                  </span>
                  <span className="ml-auto text-[10px] font-mono text-white/35 shrink-0">
                    {r.who}
                  </span>
                </motion.span>
              ))}
            </div>
          </div>

          {/* ── the asset ─────────────────────────────── */}
          <div
            className="p-4 sm:p-6 border-t xl:border-t-0"
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
              <div className="flex items-baseline justify-between gap-3">
                <motion.p
                  className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase"
                  initial={false}
                  animate={{ color: fault ? RED : GREEN }}
                  transition={{ duration: 0.4 }}
                >
                  MHE 04 · {fault ? "critical" : "healthy"}
                </motion.p>
                <p className="h-[24px] text-[22px] font-bold tabular-nums leading-[24px]">
                  <motion.span
                    key={fault ? "62" : "87"}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    style={{
                      color: fault ? RED : GREEN,
                      display: "inline-block",
                    }}
                  >
                    {fault ? 62 : 87}
                  </motion.span>
                </p>
              </div>

              {/* Six rows either way, each height-pinned. */}
              <div className="mt-3 flex flex-col">
                {asset.map(([k, v, tint], i) => (
                  <span
                    key={k}
                    className="flex items-center justify-between gap-4 h-[38px]"
                    style={{ borderBottom: `1px dashed ${LINE}` }}
                  >
                    <span className="text-[12.5px] text-white/50 truncate">
                      {k}
                    </span>
                    <motion.span
                      key={`${k}-${v}`}
                      className="text-[12.5px] font-mono font-bold tabular-nums text-right shrink-0"
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
          </div>
        </div>

        {/* one line, always here — only its reading changes */}
        <div className="px-5 py-4" style={{ borderTop: `1px solid ${LINE}` }}>
          <p className="text-[12.5px] leading-[1.6] min-h-[20px] text-white/45">
            <AnimatePresence mode="wait">
              <motion.span
                key={fault ? "fault" : "ok"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="block"
              >
                {fault ? NOTE_FAULT : NOTE_OK}
              </motion.span>
            </AnimatePresence>
          </p>
        </div>
      </motion.div>
    </Section>
  );
}
