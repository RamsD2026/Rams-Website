"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  EASE,
  Section,
  frameStyle,
} from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 06 — Product experience.
 *
 * Same section, same control and same rule as `TwinExperience` and
 * `MepsExperience`: two states, and **the layout does not change between
 * them.** Every element that exists in live exists in static — the same rack
 * grid, the same finding card with the same five rows, the same four cycle
 * tiles, the same legend, the same footer line. Only their values arrive.
 *
 * That rule is the whole point of the section and it is easy to break. An
 * earlier version of this file swapped the right column for a centred "nothing
 * attached" panel when static, which changed the column's height, which moved
 * the frame, which made the switch feel like a page change rather than like
 * data landing on a model that was already there. Nothing here may resize on
 * the toggle: the row count is fixed, the tile count is fixed, and every value
 * has a dash to sit in until it has a number.
 *
 * Red, Amber and Green mean severity here, which is the brand rule: the RAG
 * set is reserved for risk state, and this is the risk state.
 *
 * Three things move, and each one is doing a job:
 *
 *   · Connecting colours the floor **row by row** — 25ms apart in floor
 *     order, a 0.8s sweep. A cycle arrives rack by rack; a floor that snaps to
 *     colour in one frame reads as a stylesheet change, not as data landing.
 *   · The three red racks carry a ping — a halo scaling out and fading, the
 *     marker idiom `IrdsHero` uses. Only red pulses. If amber pulsed too, the
 *     hierarchy the RAG scale exists to state would be gone.
 *   · The selection walks the flagged racks on its own, and each value fades
 *     in **in place** rather than the card being replaced. Clicking a rack
 *     jumps there and restarts the dwell; the walk is never switched off.
 *
 * No `Math.random`. The severity of all 32 racks is one written-down string,
 * so the server and the client colour the floor identically.
 *
 * Figures are one inspection cycle's readout, headed as such. They are not a
 * benchmark, and nothing here is a customer result.
 */

const LINE = "rgba(255,255,255,0.10)";
const RED = "#FF6C6C";
const AMBER = "#E8A33D";
const GREEN = "#54DE91";
const DASH = "—";

/* ── the floor ───────────────────────────────────────────
   Four rows of eight racks, lettered down the side and numbered across the
   top so it reads as a rack layout rather than a grid of chips. `RAG` is one
   character per rack, row-major — written down, not generated. */

const COLS = 8;
const ROWS = 4;
const ROW_LETTERS = ["A", "B", "C", "D"];

const RAG = "gggagggg" + "ggrggagg" + "gggrgagg" + "ragggagg";
const CLOSED = "ttfttttf" + "ftfttftt" + "tttfttft" + "ftttfttt";

const TINT: Record<string, string> = { r: RED, a: AMBER, g: GREEN };
const SEVERITY: Record<string, string> = { r: "Red", a: "Amber", g: "Green" };

/** The five rows the finding card always has, and what fills them. */
const ROW_KEYS = [
  "Component",
  "Finding",
  "Inspection",
  "Evidence",
  "Action",
] as const;

const RECORD: Record<string, string[]> = {
  r: [
    "Upright",
    "Impact deformation",
    "Today · 10:42",
    "3 photos + measure",
    "Replace + verify",
  ],
  a: [
    "Baseplate",
    "Anchor loosened",
    "Today · 11:05",
    "2 photos",
    "Re-anchor + verify",
  ],
  g: [
    "Beam pair",
    "Within tolerance",
    "Today · 09:20",
    "1 photo",
    "Monitor next cycle",
  ],
};

const RACKS = Array.from({ length: ROWS * COLS }, (_, i) => {
  const row = Math.floor(i / COLS);
  const col = i % COLS;
  return {
    i,
    row,
    col,
    id: `${ROW_LETTERS[row]}-${String(i + 1).padStart(2, "0")}`,
    bay: String(col + 1).padStart(2, "0"),
    rag: RAG[i],
    closed: CLOSED[i] === "t",
  };
});

/** Everything that is not green, in floor order — what the walk visits. */
const FLAGGED = RACKS.filter((x) => x.rag !== "g").map((x) => x.i);

/* 32 racks at 25ms apart is a 0.8s sweep — long enough to read as arrival,
   short enough that nobody waits for it. */
const REVEAL_STEP = 0.025;
const DWELL_MS = 3600;

/** The four cycle tiles. Always four; the values are what arrive. */
const STATS: [string, string, string][] = [
  ["Green", "200", GREEN],
  ["Amber", "42", AMBER],
  ["Red", "03", RED],
  ["Closed", "74%", "#FFFFFF"],
];

const LEGEND: [string, string][] = [
  ["Red · immediate action", RED],
  ["Amber · action required", AMBER],
  ["Green · monitor", GREEN],
];

/* Drawing geometry. A rack is a block and the aisles are the gaps, so nothing
   is ever drawn on top of anything else. The gutters hold the row letters and
   bay numbers. */
const VB = { w: 660, h: 340 };
const PAD_X = 46;
const PAD_Y = 44;
const CELL_W = (VB.w - PAD_X * 2) / COLS;
const CELL_H = (VB.h - PAD_Y * 2) / ROWS;
const BLOCK_W = CELL_W - 10;
const BLOCK_H = 26;
const cx = (col: number) => PAD_X + col * CELL_W + CELL_W / 2;
const cy = (row: number) => PAD_Y + row * CELL_H + CELL_H / 2;

export function RdsExperience() {
  const reduce = useReducedMotion();
  const [live, setLive] = useState(false);
  /* Index 10 is a red rack in row B — checked against RAG, not guessed. */
  const [sel, setSel] = useState(10);
  const [nudge, setNudge] = useState(0);
  const r = RACKS[sel];

  /* The walk. Pure updater — no setState nested inside another, which React
     would run twice in development. If the viewer has clicked a green rack it
     is not in `FLAGGED`, so `indexOf` returns -1 and the walk resumes at the
     first flagged rack rather than stalling. */
  useEffect(() => {
    if (!live || reduce) return;
    const id = setInterval(() => {
      setSel((prev) => {
        const k = FLAGGED.indexOf(prev);
        return FLAGGED[(k + 1) % FLAGGED.length];
      });
    }, DWELL_MS);
    return () => clearInterval(id);
  }, [live, reduce, nudge]);

  /* Clicking jumps there and restarts the dwell. It does not stop the walk. */
  const pick = (i: number) => {
    setSel(i);
    setNudge((v) => v + 1);
  };

  const values = RECORD[r.rag];

  return (
    <Section surface="ink" id="experience">
      <SectionHeader
        eyebrow="Product experience"
        top="Start with rack health."
        bottom="Drill into the evidence."
        tone="dark"
        size="compact"
        width="wide"
        body="Move from the site-level picture to one rack, bay, component, photograph, corrective action or inspection cycle."
      />

      {/* the switch — the same two-state control the Digital Twin and MEPS
          product sections open on */}
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
                    layoutId="rdsexp-switch"
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
            className="ml-3 flex-1 min-w-[180px] max-w-[340px] h-6 rounded-md flex items-center px-3"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <span className="text-[10.5px] font-mono text-white/35 truncate">
              app.rams.digital/irds
            </span>
          </div>

          <span className="ml-auto shrink-0 flex items-center gap-2">
            {/* The dot is always here; only its colour and its ping change. */}
            <span className="relative flex w-1.5 h-1.5">
              {live && !reduce && (
                <motion.span
                  className="absolute inset-0 rounded-full"
                  style={{ background: GREEN }}
                  animate={{ scale: [1, 2.8], opacity: [0.6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
              )}
              <motion.span
                className="relative w-1.5 h-1.5 rounded-full"
                initial={false}
                animate={{ backgroundColor: live ? GREEN : "rgba(255,255,255,0.22)" }}
                transition={{ duration: 0.5 }}
              />
            </span>
            <motion.span
              className="text-[10px] font-mono font-semibold tracking-[0.14em] uppercase"
              initial={false}
              animate={{ color: live ? "#FF6A00" : "rgba(255,255,255,0.30)" }}
              transition={{ duration: 0.5 }}
            >
              {live ? "Live · inspection cycle 04" : "Model only"}
            </motion.span>
          </span>
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
                aria-label={
                  live
                    ? "Rack layout coloured by inspection severity"
                    : "Rack layout with no inspection data attached"
                }
              >
                {/* aisles, between the rows */}
                {[1, 2, 3].map((n) => (
                  <line
                    key={n}
                    x1={PAD_X - 12}
                    x2={VB.w - PAD_X + 12}
                    y1={PAD_Y + n * CELL_H}
                    y2={PAD_Y + n * CELL_H}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1"
                  />
                ))}

                {/* bay numbers across the top */}
                {Array.from({ length: COLS }, (_, c) => (
                  <text
                    key={`bay-${c}`}
                    x={cx(c)}
                    y={26}
                    textAnchor="middle"
                    className="font-mono"
                    fontSize={9}
                    fill="rgba(255,255,255,0.22)"
                  >
                    {String(c + 1).padStart(2, "0")}
                  </text>
                ))}

                {/* row letters down the side */}
                {ROW_LETTERS.map((l, row) => (
                  <text
                    key={l}
                    x={22}
                    y={cy(row) + 3.5}
                    textAnchor="middle"
                    className="font-mono font-bold"
                    fontSize={10}
                    fill="rgba(255,255,255,0.28)"
                  >
                    {l}
                  </text>
                ))}

                {RACKS.map((x) => {
                  const tint = TINT[x.rag];
                  const chosen = live && x.i === sel;
                  const bx = cx(x.col) - BLOCK_W / 2;
                  const by = cy(x.row) - BLOCK_H / 2;
                  const delay = live && !reduce ? x.i * REVEAL_STEP : 0;
                  return (
                    <g
                      key={x.id}
                      style={{ cursor: live ? "pointer" : "default" }}
                      onClick={live ? () => pick(x.i) : undefined}
                    >
                      {/* the selection halo */}
                      {chosen && (
                        <motion.rect
                          x={bx - 5}
                          y={by - 5}
                          width={BLOCK_W + 10}
                          height={BLOCK_H + 10}
                          rx={7}
                          fill={tint}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.16 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}

                      {/* the ping. Red only — if amber pulsed as well the
                          hierarchy the RAG scale exists to state would go. */}
                      {live && !reduce && x.rag === "r" && (
                        <motion.rect
                          x={bx}
                          y={by}
                          width={BLOCK_W}
                          height={BLOCK_H}
                          rx={4}
                          fill="none"
                          stroke={RED}
                          strokeWidth={1}
                          style={{
                            transformBox: "fill-box",
                            transformOrigin: "center",
                          }}
                          animate={{ scale: [1, 1.35], opacity: [0.7, 0] }}
                          transition={{
                            duration: 2.2,
                            repeat: Infinity,
                            ease: "easeOut",
                            delay: (x.i % 3) * 0.5,
                          }}
                        />
                      )}

                      {/* The block is the model — it is there either way. Its
                          colour is the data, so in static it has none. */}
                      <motion.rect
                        x={bx}
                        y={by}
                        width={BLOCK_W}
                        height={BLOCK_H}
                        rx={4}
                        initial={false}
                        animate={{
                          fill: live ? `${tint}2E` : "rgba(255,255,255,0.03)",
                          stroke: chosen
                            ? "#FFFFFF"
                            : live
                              ? tint
                              : "rgba(255,255,255,0.14)",
                        }}
                        transition={{ duration: 0.45, ease: EASE, delay }}
                        strokeWidth={chosen ? 1.6 : 1}
                      />

                      {/* the severity pip — no severity, no pip */}
                      <motion.rect
                        x={bx + 4}
                        y={cy(x.row) - 3}
                        width={6}
                        height={6}
                        rx={1.5}
                        fill={tint}
                        initial={false}
                        animate={{ opacity: live ? 1 : 0 }}
                        transition={{ duration: 0.4, ease: EASE, delay }}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
              {LEGEND.map(([label, tint]) => (
                <span key={label} className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-[3px] transition-opacity duration-500"
                    style={{ background: tint, opacity: live ? 1 : 0.2 }}
                  />
                  <span
                    className="text-[10.5px] transition-colors duration-500"
                    style={{
                      color: live
                        ? "rgba(255,255,255,0.45)"
                        : "rgba(255,255,255,0.18)",
                    }}
                  >
                    {label}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* ── the record ────────────────────────────────
              Both cards exist in both states. Five rows and four tiles,
              always — the values are the only thing that arrives, so the
              column cannot change height on the toggle. */}
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
                animate={{
                  color: live ? TINT[r.rag] : "rgba(255,255,255,0.28)",
                }}
                transition={{ duration: 0.4 }}
              >
                Selected finding · {live ? SEVERITY[r.rag] : DASH}
              </motion.p>

              {/* The heading holds its line whether or not there is a rack in
                  it, so the five rows below never move. */}
              <p className="mt-2 h-[20px] text-[18px] font-bold tracking-[-0.02em] leading-none">
                {live ? (
                  <motion.span
                    key={r.id}
                    className="text-white"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    Rack {r.id} · Bay {r.bay}
                  </motion.span>
                ) : (
                  <span className="text-white/25">No rack selected</span>
                )}
              </p>

              <div className="mt-3 flex flex-col">
                {ROW_KEYS.map((k, n) => (
                  <span
                    key={k}
                    className="flex items-center justify-between gap-4 h-[38px]"
                    style={{ borderBottom: `1px dashed ${LINE}` }}
                  >
                    <span className="text-[12.5px] text-white/50">{k}</span>
                    {live ? (
                      <motion.span
                        key={`${r.id}-${k}`}
                        className="text-[12.5px] font-mono font-bold text-white tabular-nums text-right"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: n * 0.05,
                          ease: EASE,
                        }}
                      >
                        {values[n]}
                      </motion.span>
                    ) : (
                      <span className="text-[12.5px] font-mono font-bold text-white/20">
                        {DASH}
                      </span>
                    )}
                  </span>
                ))}
              </div>

              <p className="mt-3 h-[16px] text-[11px] leading-[16px]">
                <motion.span
                  initial={false}
                  animate={{ opacity: live ? 1 : 0.35 }}
                  transition={{ duration: 0.4 }}
                  className="text-white/35"
                >
                  {live
                    ? r.closed
                      ? "Closed · verification evidence on file"
                      : "Assigned to site team · verification pending"
                    : "No inspection attached to this model yet"}
                </motion.span>
              </p>
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
                Rack health · current cycle
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {STATS.map(([k, v, tint], n) => (
                  <div
                    key={k}
                    className="px-3 py-2.5 rounded-[10px]"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${LINE}`,
                    }}
                  >
                    <p className="text-[8.5px] font-mono font-bold tracking-[0.14em] uppercase text-white/35 truncate">
                      {k}
                    </p>
                    <p className="mt-1.5 h-[20px] text-[20px] font-bold leading-[20px] tabular-nums tracking-[-0.03em]">
                      {live ? (
                        <motion.span
                          key={`stat-${k}`}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: 0.8 + n * 0.08,
                            ease: EASE,
                          }}
                          style={{ color: tint, display: "inline-block" }}
                        >
                          {v}
                        </motion.span>
                      ) : (
                        <span className="text-white/20">{DASH}</span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* one line, always here — only its reading changes */}
        <div className="px-5 py-4" style={{ borderTop: `1px solid ${LINE}` }}>
          <motion.p
            className="text-[12.5px] leading-[1.6] min-h-[20px]"
            initial={false}
            animate={{
              opacity: live ? 1 : 0.4,
              color: live ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.25)",
            }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {live
              ? "Repeated upright impacts are concentrated near the outbound turning zone."
              : "Patterns appear once inspection cycles are attached."}
          </motion.p>
        </div>
      </motion.div>
    </Section>
  );
}
