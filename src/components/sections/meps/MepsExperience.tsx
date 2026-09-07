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
 * The Digital Twin's own section-six slot, on the same dark ground and to the
 * same shape as `TwinExperience`: one frame, the floor on the left, its record
 * on the right, divided by a hairline rather than sitting in two cards. They
 * are one view of one thing, so they share a screen.
 *
 * What is different is the control. TwinExperience toggles two states of the
 * same model; here there are three tabs, and they filter the floor rather than
 * rebuild it — Productivity dims everything that is not loaded travel,
 * Efficiency dims everything that is, and the fleet card underneath re-reads
 * the same shift against whichever question is open. The floor is the constant
 * and the question is what moves.
 *
 * The frame wears browser chrome, unlike the one in `MepsCapabilities`. That
 * is the right way round: there the screen was the subject and chrome would
 * have said "web page"; here the point *is* that this is an application you
 * open, so the chrome and the URL are doing work.
 *
 * The floor is drawn rather than borrowed. `preserveAspectRatio` is left at
 * its default so the scale stays uniform and a machine drawn as a square is a
 * square — the connector diagram in section three is the one place on this
 * page where a stretched viewBox is worth the trouble.
 *
 * No `Math.random` anywhere: lanes, ranges and durations are written down, so
 * the server and the client draw the same first frame.
 *
 * Figures are one shift's readout, headed as such. They are not a benchmark.
 */

const LINE = "rgba(255,255,255,0.10)";
const ORANGE = "#FF6A00";
const BLUE = "#5B8DEF";

/* ── the floor ───────────────────────────────────────────
   660 × 340. Racking sits in two banks with clear aisles between them, and
   the machines run those aisles — a machine crossing a rack row is the one
   mistake a warehouse reader will always catch. */

const VB = { w: 660, h: 340 };

/** Racking: two banks, four rows. */
const RACKS: [number, number, number][] = [
  // x, y, width — all 18 tall
  [40, 46, 138],
  [246, 46, 138],
  [40, 110, 138],
  [246, 110, 138],
  [40, 182, 138],
  [246, 182, 138],
  [40, 252, 138],
  [246, 252, 138],
];

/* Staging, above lane 0. It sat at y 42–120 first, which put it across the
   top aisle — the machines on that lane travel to x 610 and would have
   driven through it. It clears the lane's top edge by 4px now. */
const ZONE = { x: 452, y: 22, w: 116, h: 50 };

/** Clear aisle centres, between the rack rows. */
const LANES = [82, 152, 222, 292];

/* The label that travels with a machine. It trails — a machine heading right
   carries its chip on its left — so the chip is never the thing that runs off
   the edge of the floor. Widest travel is 596, and 596 + 56 = 652 < 660. */
const CHIP_W = 46;
const CHIP_H = 16;
const CHIP_GAP = 10;

type Machine = {
  id: string;
  op: string;
  loaded: boolean;
  lane: number;
  from: number;
  to: number;
  dur: number;
  rows: [string, string][];
};

const MACHINES: Machine[] = [
  {
    id: "MHE-04",
    op: "OP-118",
    loaded: true,
    lane: 0,
    from: 200,
    to: 600,
    dur: 13,
    rows: [
      ["Zone", "Aisle 05"],
      ["Speed", "6.2 km/h"],
      ["Load state", "Loaded"],
      ["Pallets this shift", "142"],
    ],
  },
  {
    id: "MHE-07",
    op: "OP-204",
    loaded: false,
    lane: 0,
    from: 596,
    to: 210,
    dur: 16,
    rows: [
      ["Zone", "Aisle 05"],
      ["Speed", "8.1 km/h"],
      ["Load state", "Empty"],
      ["Pallets this shift", "96"],
    ],
  },
  {
    id: "MHE-02",
    op: "OP-091",
    loaded: false,
    lane: 1,
    from: 196,
    to: 596,
    dur: 15,
    rows: [
      ["Zone", "Aisle 09"],
      ["Speed", "7.4 km/h"],
      ["Load state", "Empty"],
      ["Pallets this shift", "88"],
    ],
  },
  {
    id: "MHE-11",
    op: "OP-133",
    loaded: true,
    lane: 1,
    from: 592,
    to: 204,
    dur: 12,
    rows: [
      ["Zone", "Aisle 09"],
      ["Speed", "5.8 km/h"],
      ["Load state", "Loaded"],
      ["Pallets this shift", "131"],
    ],
  },
  {
    id: "MHE-09",
    op: "OP-176",
    loaded: true,
    lane: 2,
    from: 208,
    to: 592,
    dur: 17,
    rows: [
      ["Zone", "Aisle 12"],
      ["Speed", "6.9 km/h"],
      ["Load state", "Loaded"],
      ["Pallets this shift", "118"],
    ],
  },
  {
    id: "MHE-18",
    op: "OP-052",
    loaded: false,
    lane: 3,
    from: 590,
    to: 200,
    dur: 14,
    rows: [
      ["Zone", "Aisle 16"],
      ["Speed", "9.0 km/h"],
      ["Load state", "Empty"],
      ["Pallets this shift", "61"],
    ],
  },
];

/* ── the three questions ─────────────────────────────────
   Each one re-reads the same shift. `keep` is what stays lit on the floor:
   null keeps everything, true keeps loaded travel, false keeps empty. */

const TABS: {
  key: string;
  label: string;
  keep: boolean | null;
  head: string;
  bars: [string, number, string][];
}[] = [
  {
    key: "live",
    label: "Live floor",
    keep: null,
    head: "Fleet · loaded vs empty",
    bars: [
      ["Loaded travel", 61, ORANGE],
      ["Empty travel", 39, BLUE],
    ],
  },
  {
    key: "productivity",
    label: "Productivity",
    keep: true,
    head: "Fleet · where the shift goes",
    bars: [
      ["Active work", 38, "#54DE91"],
      ["Travel", 24, BLUE],
      ["Waiting & idle", 26, "#E8A33D"],
    ],
  },
  {
    key: "efficiency",
    label: "Efficiency",
    keep: false,
    head: "Fleet · what the work costs",
    bars: [
      ["Empty travel", 39, "#E8A33D"],
      ["Distance, 4.8 km", 61, BLUE],
      ["Congested runs", 18, "#FF6C6C"],
    ],
  },
];

const LEGEND: [string, string][] = [
  ["Loaded travel", ORANGE],
  ["Empty travel", BLUE],
  ["Racking", "rgba(255,255,255,0.22)"],
];

export function MepsExperience() {
  const [live, setLive] = useState(false);
  const [tab, setTab] = useState(0);
  const [sel, setSel] = useState(0);
  const t = TABS[tab];
  const m = MACHINES[sel];

  /** Lit unless the open question is about the other kind of travel. */
  const lit = (x: Machine) => t.keep === null || x.loaded === t.keep;

  return (
    <Section surface="ink" id="experience">
      <SectionHeader
        eyebrow="Product experience"
        top="See the moving"
        bottom="Warehouse live."
        tone="dark"
        size="compact"
        width="wide"
        body="Connected machines are positioned inside the warehouse Digital Twin — select any machine to open its live session, or filter the floor by loaded and empty travel and watch the picture change completely."
      />

      {/* the switch — the same two-state control the Digital Twin's product
          section opens on, and the same argument: the floor does not change,
          only whether anything is attached to it */}
      <div className="flex justify-center mb-10">
        <div
          className="inline-flex p-1 rounded-full"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: `1px solid ${LINE}`,
          }}
        >
          {[
            ["Static model", false],
            ["Connect live data", true],
          ].map(([label, v]) => {
            const on = live === v;
            return (
              <button
                key={String(label)}
                type="button"
                onClick={() => setLive(v as boolean)}
                className={
                  "relative px-5 py-2.5 rounded-full text-[13px] font-semibold transition-colors duration-300 " +
                  (on ? "text-carbon" : "text-white/45 hover:text-white/75")
                }
              >
                {on && (
                  <motion.span
                    layoutId="mepsexp-switch"
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

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="overflow-hidden"
        style={frameStyle("dark")}
      >
        {/* chrome — this one is an application you open, so it wears a URL */}
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
            className="ml-3 flex-1 min-w-[180px] max-w-[340px] h-6 rounded-md flex items-center px-3"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <span className="text-[10.5px] font-mono text-white/35 truncate">
              app.rams.digital/meps/command-centre
            </span>
          </div>

          <span
            className="ml-3 shrink-0 text-[10px] font-mono font-semibold tracking-[0.14em] uppercase transition-colors duration-500"
            style={{ color: live ? "#FF6A00" : "rgba(255,255,255,0.30)" }}
          >
            {live ? `Live · ${MACHINES.length} machines` : "Model only"}
          </span>

          {/* Nothing to filter on a model with no data in it, so the three
              questions are inert until the feed is connected. */}
          <div
            className="ml-auto flex items-center gap-2 shrink-0 transition-opacity duration-500"
            style={{ opacity: live ? 1 : 0.3 }}
          >
            {TABS.map((x, n) => {
              const on = live && n === tab;
              return (
                <button
                  key={x.key}
                  type="button"
                  onClick={() => setTab(n)}
                  disabled={!live}
                  aria-current={on ? "true" : undefined}
                  className={
                    "px-3 py-1.5 rounded-md text-[11.5px] font-semibold transition-colors duration-300 " +
                    (on
                      ? "text-signal-orange"
                      : "text-white/45 " + (live ? "hover:text-white/75" : "cursor-default"))
                  }
                  style={{
                    background: on ? "rgba(255,106,0,0.12)" : "transparent",
                    border: `1px solid ${on ? "rgba(255,106,0,0.42)" : LINE}`,
                  }}
                >
                  {x.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          {/* ── the floor ─────────────────────────────── */}
          <div
            className="p-4 sm:p-6 flex flex-col gap-4 xl:border-r"
            style={{ borderColor: LINE }}
          >
            <div
              className="w-full overflow-hidden"
              style={{
                aspectRatio: `${VB.w} / ${VB.h}`,
                borderRadius: 12,
                background: "#0A0A0D",
                border: `1px solid ${LINE}`,
              }}
            >
              <svg
                viewBox={`0 0 ${VB.w} ${VB.h}`}
                className="w-full h-full block"
                role="img"
                aria-label="Warehouse floor with connected machines, coloured by loaded or empty travel"
              >
                {/* the survey grid */}
                <g stroke="rgba(255,255,255,0.045)" strokeWidth="1">
                  {Array.from({ length: 9 }, (_, i) => (
                    <line
                      key={`v${i}`}
                      x1={40 + i * 72}
                      y1={20}
                      x2={40 + i * 72}
                      y2={320}
                    />
                  ))}
                  {Array.from({ length: 5 }, (_, i) => (
                    <line
                      key={`h${i}`}
                      x1={20}
                      y1={40 + i * 70}
                      x2={640}
                      y2={40 + i * 70}
                    />
                  ))}
                </g>

                {/* racking */}
                {RACKS.map(([x, y, w]) => (
                  <rect
                    key={`${x}-${y}`}
                    x={x}
                    y={y}
                    width={w}
                    height={18}
                    rx={3}
                    fill="rgba(255,255,255,0.055)"
                    stroke="rgba(255,255,255,0.10)"
                    strokeWidth="1"
                  />
                ))}

                {/* the staging block */}
                <rect
                  x={ZONE.x}
                  y={ZONE.y}
                  width={ZONE.w}
                  height={ZONE.h}
                  rx={4}
                  fill="rgba(255,255,255,0.04)"
                  stroke="rgba(255,255,255,0.09)"
                  strokeWidth="1"
                />

                {/* Machines, and only when connected. A static model has no
                    machines in it — drawing them greyed out would still be
                    drawing data onto a model that has none. */}
                {live &&
                  MACHINES.map((x, n) => {
                  const on = lit(x);
                  const tint = x.loaded ? ORANGE : BLUE;
                  const chosen = n === sel;
                  /* Trailing side: right-bound machines carry the chip behind
                     them on the left, left-bound ones on the right. */
                  const chipX =
                    x.to > x.from
                      ? -(CHIP_GAP + CHIP_W)
                      : CHIP_GAP;
                  return (
                    <motion.g
                      key={x.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => setSel(n)}
                      animate={{ opacity: on ? 1 : 0.14 }}
                      transition={{ duration: 0.5, ease: EASE }}
                    >
                      <motion.g
                        initial={{ x: x.from }}
                        animate={{ x: [x.from, x.to] }}
                        transition={{
                          duration: x.dur,
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut",
                        }}
                      >
                        {chosen && (
                          <circle
                            cx={0}
                            cy={LANES[x.lane]}
                            r={13}
                            fill={tint}
                            opacity={0.18}
                          />
                        )}
                        <rect
                          x={-5.5}
                          y={LANES[x.lane] - 5.5}
                          width={11}
                          height={11}
                          rx={2.5}
                          fill={tint}
                          stroke={chosen ? "#FFFFFF" : "transparent"}
                          strokeWidth={chosen ? 1.5 : 0}
                        />

                        {/* the travelling label */}
                        <rect
                          x={chipX}
                          y={LANES[x.lane] - CHIP_H / 2}
                          width={CHIP_W}
                          height={CHIP_H}
                          rx={CHIP_H / 2}
                          fill="rgba(8,8,10,0.92)"
                          stroke={tint}
                          strokeOpacity={chosen ? 0.9 : 0.42}
                          strokeWidth={1}
                        />
                        <text
                          x={chipX + CHIP_W / 2}
                          y={LANES[x.lane] + 3}
                          textAnchor="middle"
                          className="font-mono font-bold"
                          fontSize={8}
                          letterSpacing={0.4}
                          fill={tint}
                        >
                          {x.id}
                        </text>
                        {/* a hit target larger than the dot */}
                        <rect
                          x={-13}
                          y={LANES[x.lane] - 13}
                          width={26}
                          height={26}
                          fill="transparent"
                        />
                      </motion.g>
                      </motion.g>
                    );
                  })}
              </svg>
            </div>

            <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
              {LEGEND.map(([label, tint], n) => {
                /* Racking is the one thing the static model does have, so it
                   is the one legend entry that stays lit. */
                const shown = live || n === LEGEND.length - 1;
                return (
                  <span key={label} className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-[3px] transition-opacity duration-500"
                      style={{ background: tint, opacity: shown ? 1 : 0.2 }}
                    />
                    <span
                      className="text-[10.5px] transition-colors duration-500"
                      style={{
                        color: shown
                          ? "rgba(255,255,255,0.45)"
                          : "rgba(255,255,255,0.18)",
                      }}
                    >
                      {label}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* ── the record ────────────────────────────── */}
          <div
            className="p-4 sm:p-6 flex flex-col gap-4 border-t xl:border-t-0"
            style={{ borderColor: LINE }}
          >
            <AnimatePresence mode="wait">
              {live ? (
                <motion.div
                  key="attached"
                  className="flex flex-col flex-1 min-h-0 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  {/* the selected session */}
                  <div
                    className="p-4 sm:p-5"
                    style={{
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${LINE}`,
                    }}
                  >
                    <p className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/35">
                      Selected session · {m.op}
                    </p>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="mt-3 flex flex-col"
                      >
                        {m.rows.map(([k, v]) => (
                          <span
                            key={k}
                            className="flex items-center justify-between gap-4 py-2.5"
                            style={{ borderBottom: `1px dashed ${LINE}` }}
                          >
                            <span className="text-[12.5px] text-white/50">
                              {k}
                            </span>
                            <span className="text-[12.5px] font-mono font-bold text-white tabular-nums">
                              {v}
                            </span>
                          </span>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* the fleet, read against whichever question is open */}
                  <div
                    className="p-4 sm:p-5 flex-1"
                    style={{
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${LINE}`,
                    }}
                  >
                    <p className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/35">
                      {t.head}
                    </p>

                    <div className="mt-4 flex flex-col gap-4">
                      {t.bars.map(([label, pct, tint]) => (
                        <div key={label}>
                          <span className="flex items-baseline justify-between gap-3">
                            <span className="text-[12.5px] text-white/60 truncate">
                              {label}
                            </span>
                            <span className="text-[12.5px] font-mono font-bold text-white tabular-nums shrink-0">
                              {pct}%
                            </span>
                          </span>
                          <span
                            className="mt-2 block h-1.5 rounded-full overflow-hidden"
                            style={{ background: "rgba(255,255,255,0.07)" }}
                          >
                            <motion.span
                              className="block h-full rounded-full"
                              style={{ background: tint }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.7, ease: EASE }}
                            />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Static is the before state, so there is nothing to select
                   and nothing to read. Showing a populated session next to an
                   empty floor would give away the answer the switch exists to
                   demonstrate. */
                <motion.div
                  key="bare"
                  className="flex flex-col flex-1 min-h-[260px] items-center justify-center px-8 py-12 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  <span
                    aria-hidden
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ border: "1px dashed rgba(255,255,255,0.16)" }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "rgba(255,255,255,0.22)" }}
                    />
                  </span>
                  <p className="mt-5 text-[10px] font-mono font-semibold tracking-[0.2em] uppercase text-white/30">
                    No machines connected
                  </p>
                  <p className="mt-3 max-w-[280px] text-[13px] leading-[1.7] text-white/35">
                    The floor is drawn and the racking is placed. Nothing on it
                    is moving, because nothing on it is reporting yet.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
