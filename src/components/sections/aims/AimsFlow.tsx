"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * The AIMS intelligence layer.
 *
 *   module signals  →  one intelligence layer  →  management action
 *
 * Built on the pattern documented in docs/irds-intelligence-animation.md, and
 * the decisions there hold: chips are marquee tracks rather than per-chip
 * timers, `dur` is proportional to content width so every track moves at one
 * speed, the dissolve is a positional CSS mask on the layer, and each feed is
 * one unbroken path so a chip rides the line instead of interrupting it.
 */

const ORANGE = "#FF6A00";
const BLUE = "#3B82F6";
const RISK = "#C4564F";
const GREY = "#8A8F94";

const VB = { w: 1440, h: 620 };

/* ── corner panels ────────────────────────────────────── */
const PANELS = [
  {
    n: "01",
    k: "Rack safety",
    meta: "42 risks",
    items: ["Impacts", "Frame damage", "Inspections", "RAG status"],
    pin: "left-[4%] top-[3%]",
    dot: ORANGE,
  },
  {
    n: "03",
    k: "Inventory",
    meta: "19 exceptions",
    items: ["Location gaps", "Dwell", "Aging stock", "Capacity"],
    pin: "right-[4%] top-[3%]",
    dot: GREY,
  },
  {
    n: "02",
    k: "MHE",
    meta: "31 events",
    items: ["Routes", "Congestion", "Utilisation", "Sessions"],
    pin: "left-[4%] bottom-[3%]",
    dot: BLUE,
  },
  {
    n: "04",
    k: "People",
    meta: "12 alerts",
    items: ["Zones", "Proximity", "Sessions", "Verification"],
    pin: "right-[4%] bottom-[3%]",
    dot: RISK,
  },
];

/** Node dots at the cardinal points of the core. */
const NODES = [
  { x: 606, y: 310, r: 5 },
  { x: 834, y: 310, r: 5 },
  { x: 720, y: 216, r: 4.5 },
  { x: 720, y: 404, r: 4.5 },
];

/**
 * One arc per panel, in PANELS order.
 *
 * The long shallow sweep: out of the panel's inner corner, through a wide
 * bend, and into the core's side node level rather than head-on.
 */
const PANEL_LINKS = [
  "M332 152 C 452 176, 516 272, 604 306",
  "M1108 152 C 988 176, 924 272, 836 306",
  "M332 468 C 452 444, 516 348, 604 314",
  "M1108 468 C 988 444, 924 348, 836 314",
];

/**
 * The three signal streams. Each picks up at x 368 — past the point where the
 * chips have faded out on their mask — holds the lane level, then bends in to
 * the left node, the same point the two left panel arcs land on.
 */
const FEEDS = [
  "M368 248 H448 C 520 248, 562 278, 604 304",
  "M368 310 H606",
  "M368 372 H448 C 520 372, 562 342, 604 316",
];

type Chip = { t: string; tone: string };
type Strip = { lane: number; left: string; dur: number; items: Chip[] };

/* ── before AIMS · each module on its own terms ─────────
   Rows balanced to ~56 characters so one duration gives all three the same
   linear speed; offsets stagger the columns.                              */
const IN_ROWS: Strip[] = [
  {
    lane: 40,
    left: "-6%",
    dur: 20,
    items: [
      { t: "Rack impact · A04", tone: ORANGE },
      { t: "Frame deflection", tone: ORANGE },
      { t: "Photo evidence", tone: GREY },
      { t: "Inspection note", tone: GREY },
    ],
  },
  {
    lane: 50,
    left: "-19%",
    dur: 20,
    items: [
      { t: "MHE route event", tone: BLUE },
      { t: "Congestion 18:00", tone: BLUE },
      { t: "Idle time spike", tone: GREY },
      { t: "Operator session", tone: GREY },
    ],
  },
  {
    lane: 60,
    left: "-12%",
    dur: 20,
    items: [
      { t: "Dwell exception", tone: GREY },
      { t: "Zone B capacity", tone: GREY },
      { t: "Aging stock", tone: GREY },
      { t: "People alert", tone: RISK },
    ],
  },
];

/* ── after AIMS · one connected answer ──────────────────
   ~108 characters against the rows' ~56, so the duration is doubled to hold
   the same speed.                                                          */
const OUT_ROW: Strip = {
  lane: 50,
  left: "58%",
  dur: 40,
  items: [
    { t: "Repeated rack impacts", tone: ORANGE },
    { t: "18:00 dispatch peak", tone: BLUE },
    { t: "Confidence 94%", tone: "#16A34A" },
    { t: "Revise MHE route", tone: ORANGE },
    { t: "Zone B staging", tone: ORANGE },
    { t: "Owner assigned", tone: GREY },
    { t: "Management view", tone: "#08080A" },
  ],
};

/* Measured from the centre, not in percentages.
   The chip layers run the full window width while the lines and the core are
   bound to the page container, so a percentage mask only lines up at one
   window width — at any other, chips survive past the point where the dashed
   feeds begin. Anchoring both masks to 50% keeps the dissolve at a fixed
   distance from the core whatever the viewport is doing. */
const MASK_IN =
  "linear-gradient(to right, #000 0px, #000 max(0px, calc(50% - 470px)), transparent max(60px, calc(50% - 320px)))";
const MASK_OUT =
  "linear-gradient(to right, transparent calc(50% + 130px), #000 calc(50% + 300px), #000 92%, transparent 100%)";

/**
 * One marquee row. The track holds the chips twice; translating it from
 * -50% to 0 lands exactly where it started, so the seam is invisible and the
 * spacing never drifts.
 */
function Track({ row, variant }: { row: Strip; variant: "in" | "out" }) {
  const isIn = variant === "in";
  return (
    <div
      className="absolute -translate-y-1/2"
      style={{ top: `${row.lane}%`, left: row.left }}
    >
      <div className="aimsf-track" style={{ animationDuration: `${row.dur}s` }}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {row.items.map((c) => (
              <span
                key={copy + c.t}
                className={
                  "inline-flex items-center gap-2 px-3 py-1.5 mr-4 whitespace-nowrap shrink-0 " +
                  // loose input reads as a document: squared, dashed, muted.
                  // resolved output reads as a decision: pill, solid, orange.
                  (isIn ? "rounded-md" : "rounded-full")
                }
                style={{
                  background: isIn
                    ? "rgba(14,17,19,0.9)"
                    : "rgba(255,106,0,0.10)",
                  border: isIn
                    ? "1px dashed rgba(255,255,255,0.18)"
                    : "1px solid rgba(255,106,0,0.45)",
                  boxShadow: isIn
                    ? "none"
                    : "0 0 22px -10px rgba(255,106,0,0.9), 0 8px 24px -16px rgba(0,0,0,0.9)",
                }}
              >
                {isIn ? (
                  <span
                    className="w-[5px] h-[5px] shrink-0"
                    style={{ background: c.tone, opacity: 0.85 }}
                  />
                ) : (
                  <span
                    className="text-[10px] sm:text-[11px] leading-none shrink-0"
                    style={{ color: ORANGE }}
                  >
                    ›
                  </span>
                )}
                <span
                  className={
                    "text-[9px] sm:text-[10.5px] font-mono " +
                    (isIn ? "text-white/55" : "font-bold text-white/95")
                  }
                >
                  {c.t}
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AimsFlow() {
  const reduce = useReducedMotion();
  /* Which panel is under the cursor. Everything else steps back while one is,
     so the panel being read is the only thing at full strength. */
  const [hot, setHot] = useState<number | null>(null);

  return (
    <div className="relative w-full h-[560px] sm:h-[600px] lg:h-[620px]">
      <style>{`
        @keyframes aimsf-track {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .aimsf-track {
          display: flex;
          width: max-content;
          animation-name: aimsf-track;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .aimsf-track { animation: none; }
        }
      `}</style>

      {/* ── lines ────────────────────────────────────── */}
      <svg
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full z-[1]"
        aria-hidden
      >
        <defs>
          <linearGradient id="aimsf-ax-r" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={ORANGE} stopOpacity="0.45" />
            <stop offset="100%" stopColor={ORANGE} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* the axis, right of the core only — the output run */}
        <path
          d="M606 310 H834"
          stroke="rgba(255,106,0,0.18)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M834 310 H1440"
          stroke="url(#aimsf-ax-r)"
          strokeWidth="1"
          fill="none"
        />

        {NODES.map((n, i) => (
          <g key={`${n.x}-${n.y}`}>
            <circle
              cx={n.x}
              cy={n.y}
              r={n.r * 2.4}
              fill={ORANGE}
              opacity="0.12"
            />
            <motion.circle
              cx={n.x}
              cy={n.y}
              r={n.r}
              fill={ORANGE}
              initial={{ opacity: 0.95 }}
              animate={
                reduce ? { opacity: 0.95 } : { opacity: [0.95, 0.5, 0.95] }
              }
              transition={
                reduce
                  ? undefined
                  : {
                      duration: 3.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.5,
                    }
              }
            />
          </g>
        ))}

        {/* the corner panels, connected in */}
        {PANEL_LINKS.map((d, i) => (
          <g
            key={`pl-${i}`}
            style={{
              opacity: hot === null ? 0.16 : hot === i ? 1 : 0.08,
              transition: "opacity 0.35s ease",
            }}
          >
            {/* the glow the line sits in */}
            <path
              d={d}
              fill="none"
              stroke="rgba(255,106,0,0.10)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d={d}
              fill="none"
              stroke="rgba(255,106,0,0.45)"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          </g>
        ))}

        <g
          style={{
            opacity: hot === null ? 0.28 : 0.1,
            transition: "opacity 0.35s ease",
          }}
        >
          {/* the three streams — one unbroken dashed run each */}
          {FEEDS.map((d, i) => (
            <path
              key={`f-${i}`}
              d={d}
              fill="none"
              stroke="rgba(255,106,0,0.55)"
              strokeWidth="1.3"
              strokeDasharray="6 8"
              strokeLinecap="round"
            >
              {!reduce && (
                <animate
                  attributeName="stroke-dashoffset"
                  from="56"
                  to="0"
                  dur={`${2.6 + i * 0.5}s`}
                  repeatCount="indefinite"
                />
              )}
            </path>
          ))}

          {/* pulses — pick up where the chips fade and carry on into the core */}
          {!reduce &&
            FEEDS.map((d, i) =>
              [0, 1].map((p) => (
                <circle
                  key={`pi-${i}-${p}`}
                  r={p === 0 ? 3 : 2}
                  fill={i === 1 ? BLUE : ORANGE}
                  opacity={p === 0 ? 0.95 : 0.5}
                >
                  <animateMotion
                    path={d}
                    dur={`${5 + i * 0.6}s`}
                    begin={`${i * 1.1 + p * 2.5}s`}
                    repeatCount="indefinite"
                    calcMode="spline"
                    keyPoints="0;1"
                    keyTimes="0;1"
                    keySplines="0.3 0 0.2 1"
                  />
                </circle>
              )),
            )}
        </g>
      </svg>

      {/* ── corner panels ────────────────────────────── */}
      {PANELS.map((p, i) => (
        <motion.div
          key={p.n}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -6 }}
          onHoverStart={() => setHot(i)}
          onHoverEnd={() => setHot(null)}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.55,
            delay: 0.15 + i * 0.09,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={"absolute z-[3] w-[30%] sm:w-[22%] lg:w-[19%] " + p.pin}
          style={{
            borderRadius: 12,
            /* the one under the cursor goes darker and firmer, not lighter */
            background:
              hot === i ? "rgba(6,8,10,0.96)" : "rgba(255,255,255,0.02)",
            border:
              hot === i
                ? "1px solid rgba(255,106,0,0.35)"
                : "1px solid rgba(255,255,255,0.08)",
            boxShadow:
              hot === i
                ? "0 24px 60px -28px rgba(0,0,0,0.9), 0 0 46px -18px rgba(255,106,0,0.65)"
                : "none",
            transition:
              "background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease",
          }}
        >
          <motion.div
            style={{
              opacity: hot === i ? 1 : hot === null ? 0.55 : 0.25,
              transition: "opacity 0.35s ease",
            }}
            initial={{ y: 0 }}
            animate={reduce ? undefined : { y: [0, i % 2 ? 3 : -3, 0] }}
            transition={
              reduce
                ? undefined
                : { duration: 8 + i, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <div className="flex items-baseline gap-2 px-3.5 pt-3.5 sm:px-4 sm:pt-4">
              <span className="text-[8.5px] sm:text-[10px] font-mono font-bold tracking-[0.14em] uppercase text-white/75 truncate">
                {p.k}
              </span>
              <span className="ml-auto text-[8px] sm:text-[9px] font-mono text-white/30 shrink-0 hidden sm:block">
                {p.meta}
              </span>
            </div>
            <div className="flex flex-col gap-[7px] px-3.5 py-3.5 sm:px-4 sm:py-4">
              {p.items.map((it) => (
                <span key={it} className="flex items-center gap-2">
                  <span
                    className="w-[5px] h-[5px] rounded-full shrink-0"
                    style={{ background: p.dot, opacity: 0.85 }}
                  />
                  <span className="text-[8.5px] sm:text-[10.5px] font-mono text-white/50 leading-[1.3] truncate">
                    {it}
                  </span>
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ))}

      {/* ── travelling chips ─────────────────────────── */}
      {/* the lanes run to the window edge, not the container's — the chips
          have to arrive from outside the page measure, not appear at it */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-screen z-[2] pointer-events-none overflow-hidden"
        style={{ maskImage: MASK_IN, WebkitMaskImage: MASK_IN }}
      >
        {IN_ROWS.map((row) => (
          <Track key={row.lane} row={row} variant="in" />
        ))}
      </div>

      <div
        aria-hidden
        className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-screen z-[2] pointer-events-none overflow-hidden"
        style={{ maskImage: MASK_OUT, WebkitMaskImage: MASK_OUT }}
      >
        <Track row={OUT_ROW} variant="out" />
      </div>

      {/* ── the core ─────────────────────────────────── */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[4]">
        <div className="relative w-[168px] h-[168px] sm:w-[190px] sm:h-[190px] flex items-center justify-center">
          <span
            aria-hidden
            className="absolute rounded-full"
            style={{
              inset: "-64%",
              background:
                "radial-gradient(closest-side, rgba(255,106,0,0.13), rgba(255,106,0,0.04) 54%, transparent 74%)",
            }}
          />

          {[1.58, 1.28].map((s, i) => (
            <motion.span
              key={s}
              aria-hidden
              className="absolute rounded-full"
              style={{
                width: `${s * 100}%`,
                height: `${s * 100}%`,
                border: "1px solid rgba(255,106,0,0.12)",
              }}
              initial={{ opacity: 0.6 }}
              animate={
                reduce ? { opacity: 0.6 } : { opacity: [0.6, 0.24, 0.6] }
              }
              transition={
                reduce
                  ? undefined
                  : {
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 1.2,
                    }
              }
            />
          ))}

          {/* the intelligence layer — a disc lit from the centre out */}
          <div
            className="relative w-full h-full rounded-full flex flex-col items-center justify-center overflow-hidden"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,106,0,0.20) 0%, rgba(60,32,12,0.30) 32%, rgba(18,16,15,0.72) 62%, rgba(8,11,13,0.94) 100%)",
              border: "1px solid rgba(255,106,0,0.34)",
              boxShadow:
                "inset 0 0 44px -16px rgba(255,106,0,0.7), 0 0 44px -18px rgba(255,106,0,0.55)",
            }}
          >
            <span
              aria-hidden
              className="absolute rounded-full"
              style={{ inset: "13%", border: "1px solid rgba(255,106,0,0.14)" }}
            />

            <span className="relative text-[8.5px] sm:text-[9.5px] font-mono font-bold tracking-[0.26em] uppercase text-white/55">
              RAMS
            </span>

            <motion.div
              className="relative my-2.5 flex items-center justify-center"
              initial={{ opacity: 0.9 }}
              animate={reduce ? undefined : { opacity: [0.8, 1, 0.8] }}
              transition={
                reduce
                  ? undefined
                  : { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }
            >
              <span
                aria-hidden
                className="absolute rounded-full"
                style={{
                  width: 62,
                  height: 62,
                  background:
                    "radial-gradient(closest-side, rgba(255,106,0,0.12), transparent 72%)",
                }}
              />
              <svg
                viewBox="0 0 24 22"
                className="relative w-[46px] h-auto"
                aria-hidden
              >
                <path
                  d="M3 1v20M12 1v20M21 1v20M3 8h18M3 15h18"
                  stroke={ORANGE}
                  strokeWidth="1.9"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>

            <span className="relative text-[12px] sm:text-[13.5px] font-bold tracking-[-0.01em] text-white">
              AIMS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
