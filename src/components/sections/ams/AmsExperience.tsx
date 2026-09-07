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
 * control as the other six platform pages — and **the layout does not change
 * between the states.** Same four figures, same six-point trend, same four
 * priority rows, same six site rows, same footer line. Only the values arrive.
 *
 * The switch runs the source document's own "simulate a live site change".
 * Left of it the network is running at 86.4 with seventeen things worth a
 * decision; right of it one site's staging zone has changed, and the index,
 * the priority list, the site record and the closing line all re-read
 * together.
 *
 * That is the argument of the whole page in one control: a change at one site
 * is a change to the network number, and the number is a click from the thing
 * that caused it.
 *
 * The trend is two written-down six-point series drawn as a single `polyline`
 * in a stretched viewBox. There is no marker dot on it, on purpose: a
 * `<circle>` in a non-uniformly scaled SVG comes out an oval.
 *
 * Green, amber and red mean condition here.
 *
 * Figures are one network's readout over six months, headed as such. Not a
 * benchmark, and no site named is a customer.
 */

const LINE = "rgba(255,255,255,0.10)";
const GREEN = "#54DE91";
const AMBER = "#E8A33D";
const RED = "#FF6C6C";

/* ── the two states ────────────────────────────────────── */

const STATS_OK: [string, string, string][] = [
  ["Operations index", "86.4", GREEN],
  ["Connected sites", "24", "#FFFFFF"],
  ["Priority signals", "17", AMBER],
  ["Closure rate", "91%", "#FFFFFF"],
];

const STATS_CHANGE: [string, string, string][] = [
  ["Operations index", "85.1", AMBER],
  ["Connected sites", "24", "#FFFFFF"],
  ["Priority signals", "19", RED],
  ["Closure rate", "91%", "#FFFFFF"],
];

/** Enterprise intelligence index, six months. */
const TREND_OK = [83.9, 84.6, 85.2, 85.0, 86.1, 86.4];
const TREND_CHANGE = [83.9, 84.6, 85.2, 85.0, 86.1, 85.1];

const AXIS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];

type Row = { k: string; who: string; tint: string };

const PRIORITY_OK: Row[] = [
  { k: "Rack safety", who: "42 risks", tint: AMBER },
  { k: "MHE utilisation", who: "3 sites", tint: AMBER },
  { k: "Inventory dwell", who: "19 exceptions", tint: AMBER },
  { k: "Maintenance", who: "8 overdue", tint: AMBER },
];

const PRIORITY_CHANGE: Row[] = [
  { k: "Pune DC–02 · dispatch peak", who: "3 modules", tint: RED },
  { k: "Rack safety", who: "45 risks", tint: RED },
  { k: "MHE utilisation", who: "4 sites", tint: AMBER },
  { k: "Inventory dwell", who: "19 exceptions", tint: AMBER },
];

const SITE_OK: [string, string, string][] = [
  ["Operations index", "84.2", AMBER],
  ["Rack safety · IRDS", "03 critical", RED],
  ["MHE utilisation · MEPS", "78%", "#FFFFFF"],
  ["Inventory dwell · IROS", "12 exceptions", AMBER],
  ["Open maintenance · IMDS", "08", "#FFFFFF"],
  ["Execution SLA · ATOS", "92%", GREEN],
];

const SITE_CHANGE: [string, string, string][] = [
  ["Operations index", "79.6", RED],
  ["Rack safety · IRDS", "05 critical", RED],
  ["MHE utilisation · MEPS", "71%", AMBER],
  ["Inventory dwell · IROS", "17 exceptions", RED],
  ["Open maintenance · IMDS", "09", "#FFFFFF"],
  ["Execution SLA · ATOS", "86%", AMBER],
];

const NOTE_OK =
  "Repeated rack impacts correlate with MHE congestion during the 18:00 dispatch peak.";
const NOTE_CHANGE =
  "Outbound staging zone updated 2 minutes ago · safety, route and staging actions raised under one management case.";

/* The chart box, in its own units. Stretched horizontally, so the trend is
   drawn with `vectorEffect` on the stroke and carries no circular marker. */
const CW = 300;
const CH = 96;

function trendPath(series: number[]) {
  const lo = 80;
  const hi = 90;
  return series
    .map((v, i) => {
      const x = (i / (series.length - 1)) * CW;
      const y = CH - ((v - lo) / (hi - lo)) * CH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function AmsExperience() {
  const [changed, setChanged] = useState(false);

  const stats = changed ? STATS_CHANGE : STATS_OK;
  const priority = changed ? PRIORITY_CHANGE : PRIORITY_OK;
  const site = changed ? SITE_CHANGE : SITE_OK;
  const points = trendPath(changed ? TREND_CHANGE : TREND_OK);

  return (
    <Section surface="ink" id="experience">
      <SectionHeader
        eyebrow="Product experience"
        top="Start with the network"
        bottom="Drill down to the event."
        tone="dark"
        size="compact"
        width="wide"
        body="Move between enterprise performance, live sites, cross-module intelligence and action status without changing the source of truth."
      />

      {/* the switch — one site changes, and the network number moves with it */}
      <div className="flex justify-center mb-4">
        <div
          className="inline-flex p-1 rounded-full"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: `1px solid ${LINE}`,
          }}
        >
          {[
            ["Network view", false],
            ["Simulate a live site change", true],
          ].map(([label, v]) => {
            const on = changed === v;
            return (
              <button
                key={String(label)}
                type="button"
                onClick={() => setChanged(v as boolean)}
                className={
                  "relative px-5 py-2.5 rounded-full text-[13px] font-semibold transition-colors duration-300 " +
                  (on ? "text-carbon" : "text-white/45 hover:text-white/75")
                }
              >
                {on && (
                  <motion.span
                    layoutId="amsexp-switch"
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
        See how AIMS connects a change at one site to its modules, the network
        number and the action it raises.
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
              app.rams.digital/aims/network
            </span>
          </div>

          <span className="ml-auto shrink-0 flex items-center gap-2">
            <span className="relative flex w-1.5 h-1.5">
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ background: changed ? AMBER : GREEN }}
                animate={{ scale: [1, 2.8], opacity: [0.6, 0] }}
                transition={{
                  duration: changed ? 1.1 : 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <span
                className="relative w-1.5 h-1.5 rounded-full"
                style={{ background: changed ? AMBER : GREEN }}
              />
            </span>
            <motion.span
              className="text-[10px] font-mono font-semibold tracking-[0.14em] uppercase"
              initial={false}
              animate={{ color: changed ? AMBER : GREEN }}
              transition={{ duration: 0.4 }}
            >
              {changed ? "Site change · Pune" : "Live view"}
            </motion.span>
          </span>
        </div>

        {/* the network, in four numbers */}
        <div
          className="flex flex-wrap"
          style={{ borderBottom: `1px solid ${LINE}` }}
        >
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
          <div className="p-4 sm:p-6 xl:border-r" style={{ borderColor: LINE }}>
            <div className="flex items-baseline justify-between gap-3 mb-4">
              <span className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/35">
                Enterprise intelligence index · last 6 months
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
                  fill={changed ? AMBER : GREEN}
                  fillOpacity={0.08}
                  stroke="none"
                  initial={false}
                  animate={{ opacity: 1 }}
                />
                <motion.polyline
                  points={points}
                  fill="none"
                  stroke={changed ? AMBER : GREEN}
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

            {/* what management is being asked to decide. Four rows either way. */}
            <p className="mt-6 text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/35">
              Management priorities
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {priority.map((r, i) => (
                <motion.span
                  key={`${changed ? "c" : "o"}-${r.k}`}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.06, ease: EASE }}
                  className="flex items-center gap-2.5 px-3 h-[40px] rounded-[10px]"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${i === 0 && changed ? `${RED}59` : LINE}`,
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

          {/* ── the site ──────────────────────────────── */}
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
                  animate={{ color: changed ? RED : AMBER }}
                  transition={{ duration: 0.4 }}
                >
                  Pune DC–02 · {changed ? "intervene" : "watch"}
                </motion.p>
                <p className="h-[24px] text-[22px] font-bold tabular-nums leading-[24px]">
                  <motion.span
                    key={changed ? "79.6" : "84.2"}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    style={{
                      color: changed ? RED : AMBER,
                      display: "inline-block",
                    }}
                  >
                    {changed ? "79.6" : "84.2"}
                  </motion.span>
                </p>
              </div>

              {/* Six rows either way, each height-pinned. */}
              <div className="mt-3 flex flex-col">
                {site.map(([k, v, tint], i) => (
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
                key={changed ? "changed" : "ok"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="block"
              >
                {changed ? NOTE_CHANGE : NOTE_OK}
              </motion.span>
            </AnimatePresence>
          </p>
        </div>
      </motion.div>
    </Section>
  );
}
