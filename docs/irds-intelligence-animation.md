# IRDS Intelligence Animation — archived

The full-width live data-flow visualisation that sat inside the **What is IRDS**
section of `/platform/irds`. Removed from the page on 2026-08-30; the code is
kept here verbatim so it can be dropped back in unchanged.

- **Original path:** `src/components/sections/rackiq/RiqIntelligence.tsx`
- **Was rendered by:** `src/components/sections/rackiq/RiqWhatIs.tsx`
- **Depends on:** `framer-motion` (`motion`, `useReducedMotion`) only — no
  imports from `rackiq-shared`, no images, no external assets.
- **Designed against:** `#080B0D` (the dark section background `RiqWhatIs`
  carried at the time). On a light surface the teal strokes and the white/xx
  chip text will need re-toning.

## What it does

```
scattered inputs  →  one digital record  →  connected condition intelligence
```

Three chip marquees enter from the left, dissolve into three dashed feed lines,
a luminous **Rack Record** core sits at the centre, and a single output marquee
leaves to the right. Four static corner panels name the subsystems.

### Design decisions worth keeping

| Decision | Why |
|---|---|
| Chips are **marquee tracks**, not per-chip timers | Independent timers read as random motion and let fast chips catch slow ones. A duplicated flex track translated `-50% → 0` keeps gaps fixed and the loop seamless. |
| `dur` is proportional to **content width** | Equal durations only give equal *speed* if the tracks are the same width. Input rows are balanced to ~52 chars at `20s`; the output row is ~103 chars, so `40s`. |
| Dissolve is a **CSS mask on the layer**, not opacity keyframes on the chip | Positional, not timed — chips always fade at the same x, whatever their phase. |
| Feed lines are **one unbroken `<path>` each** | A chip occludes a few dashes as it passes and the run continues either side, instead of the line restarting per chip. |
| SVG uses `preserveAspectRatio="none"` | Curves flex with the viewport while the HTML core stays circular at any width. |
| Explicit z-stack | grid → `z-[1]` lines → `z-[2]` chips → `z-[3]` panels → `z-[4]` core & captions. |

### Gotchas hit while building it

- **`initial={false}` with a keyframe array parks on the LAST value.** An earlier
  version did this and every chip rendered at its end position — inside the
  transparent part of the mask, so nothing was visible. Always pass an explicit
  `initial`.
- `--font-mono` is dead in `globals.css` (see `docs/typography.md`), so the
  `font-mono` classes below currently inherit rather than resolve to Roboto Mono.

## Restoring it

1. Copy the source below back to `src/components/sections/rackiq/RiqIntelligence.tsx`.
2. In the host section, import and render it full-bleed (it breaks the
   `rams-container` deliberately):

```tsx
import { RiqIntelligence } from "./RiqIntelligence";

<div className="mt-12 sm:mt-16">
  <RiqIntelligence />
</div>
```

3. Give the section a dark background — it was `style={{ background: "#080B0D" }}`.

## Source — `RiqIntelligence.tsx`

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The IRDS intelligence system.
 *
 *   scattered inputs  →  one digital record  →  connected condition intelligence
 *
 * Left chips are the information as it exists before IRDS; they dissolve into
 * the feed lines at the core. Right chips are what comes back out, and only
 * become visible past the core — each group sits in its own masked layer, so
 * the dissolve is positional rather than timed and nothing appears to pass
 * straight through the centre.
 *
 * Lines live in one SVG stretched across the container (preserveAspectRatio
 * "none", so curves flex with the viewport); the core and panels are HTML on
 * top, so circles stay circular at any width.
 */

const ORANGE = "#FF6A00";
const TEAL = "#3FB3A6";
const RISK = "#C4564F";

const VB = { w: 1440, h: 620 };

/* ── corner panels ────────────────────────────────────── */
const PANELS = [
  {
    n: "01",
    k: "Inspection data",
    items: ["Inspection", "Defects", "Measurements", "Photographs"],
    pin: "left-[6%] top-[4%]",
    dot: ORANGE,
  },
  {
    n: "04",
    k: "Digital history",
    items: ["Inspection history", "Changes", "Repairs", "Compliance"],
    pin: "right-[6%] top-[4%]",
    dot: TEAL,
  },
  {
    n: "02",
    k: "Identity engine",
    items: ["Rack location", "Bay", "Level", "Component"],
    pin: "left-[6%] bottom-[4%]",
    dot: TEAL,
  },
  {
    n: "03",
    k: "Risk & action",
    items: ["RAG classification", "Corrective action", "Repair", "Verification"],
    pin: "right-[6%] bottom-[4%]",
    dot: RISK,
  },
];

/** small glowing beads sitting on the horizontal axis */
const BEADS = [
  { x: 850, r: 2.6 },
  { x: 882, r: 2 },
  { x: 910, r: 1.6 },
  { x: 962, r: 2.4 },
  { x: 1024, r: 1.8 },
];

/** node dots at the cardinal points of the core */
const NODES = [
  { x: 606, y: 310, r: 5 },
  { x: 834, y: 310, r: 5 },
  { x: 720, y: 216, r: 4.5 },
  { x: 720, y: 404, r: 4.5 },
];

/**
 * The three data streams — the only incoming lines in the composition.
 *
 * Each starts at the far left edge and holds its chip lane dead level (y 248 /
 * 310 / 372 = the 40% / 50% / 60% rows) until x 440, which is past the point
 * where chips have faded. Only then does it bend in to meet the left node at
 * (606,310). Keeping the run straight under the chips is what makes a chip
 * look like it is riding the line rather than dragging it along.
 */
const FEEDS = [
  "M-20 248 H440 C 520 248, 562 278, 604 304",
  "M-20 310 H604",
  "M-20 372 H440 C 520 372, 562 342, 604 316",
];

type Chip = { t: string; tone: string };
type Strip = {
  lane: number;
  /** where the strip sits before it starts translating */
  left: string;
  /** seconds for one loop — set proportional to content width so every
   *  strip moves at the same linear speed, like a logo marquee */
  dur: number;
  items: Chip[];
};

/* ── before IRDS · scattered information ────────────────
   Three rigid strips, each a marquee: the chips inside a row hold a fixed
   gap and translate together, so nothing drifts or bunches. Row content is
   balanced to ~52 characters so one duration gives all three the same
   linear speed. Rows start at different offsets so the columns stagger.  */
const IN_ROWS: Strip[] = [
  {
    lane: 40,
    left: "-6%",
    dur: 20,
    items: [
      { t: "Inspection report", tone: "#FFFFFF" },
      { t: "Photo evidence", tone: "#FFFFFF" },
      { t: "Spreadsheet", tone: "#8A8F94" },
      { t: "Quotation", tone: "#8A8F94" },
    ],
  },
  {
    lane: 50,
    left: "-19%",
    dur: 20,
    items: [
      { t: "Defect found", tone: ORANGE },
      { t: "Measurement data", tone: ORANGE },
      { t: "Integrity test", tone: TEAL },
      { t: "Email thread", tone: "#8A8F94" },
    ],
  },
  {
    lane: 60,
    left: "-12%",
    dur: 20,
    items: [
      { t: "Corrective action", tone: RISK },
      { t: "Repair completed", tone: TEAL },
      { t: "Verification", tone: TEAL },
      { t: "RAG status", tone: "#FFBE47" },
    ],
  },
];

/* ── after IRDS · one connected record ──────────────────
   A single strip on the axis. ~103 characters against the rows' ~52, so
   the duration is doubled to hold the same speed.                        */
const OUT_ROW: Strip = {
  lane: 50,
  left: "58%",
  dur: 40,
  items: [
    { t: "Rack identity", tone: ORANGE },
    { t: "Complete history", tone: TEAL },
    { t: "Current condition", tone: TEAL },
    { t: "RAG risk status", tone: "#FFBE47" },
    { t: "Open actions", tone: RISK },
    { t: "Repair verified", tone: TEAL },
    { t: "Management view", tone: "#FFFFFF" },
  ],
};

const MASK_IN = "linear-gradient(to right, #000 0%, #000 16%, transparent 34%)";
const MASK_OUT =
  "linear-gradient(to right, transparent 60%, #000 74%, #000 93%, transparent 100%)";

/**
 * One marquee row. The track holds the chips twice; translating it from
 * -50% to 0 moves it rightward and lands exactly where it started, so the
 * seam is invisible and the spacing never drifts.
 */
function Track({ row, variant }: { row: Strip; variant: "in" | "out" }) {
  const isIn = variant === "in";
  return (
    <div
      className="absolute -translate-y-1/2"
      style={{ top: `${row.lane}%`, left: row.left }}
    >
      <div className="riq-track" style={{ animationDuration: `${row.dur}s` }}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {row.items.map((c) => (
              <span
                key={copy + c.t}
                className={
                  "inline-flex items-center gap-2 px-3 py-1.5 mr-4 whitespace-nowrap shrink-0 " +
                  // loose input reads as a document: squared, dashed, muted.
                  // resolved output reads as a record: pill, solid, teal.
                  (isIn ? "rounded-md" : "rounded-full")
                }
                style={{
                  background: isIn
                    ? "rgba(14,17,19,0.9)"
                    : "rgba(12,26,26,0.96)",
                  border: isIn
                    ? "1px dashed rgba(255,255,255,0.18)"
                    : `1px solid ${TEAL}55`,
                  boxShadow: isIn
                    ? "none"
                    : `0 0 22px -10px ${TEAL}, 0 8px 24px -16px rgba(0,0,0,0.9)`,
                }}
              >
                {isIn ? (
                  <span
                    className="w-[5px] h-[5px] shrink-0"
                    style={{ background: c.tone, opacity: 0.8 }}
                  />
                ) : (
                  <span
                    className="text-[10px] sm:text-[11px] leading-none shrink-0"
                    style={{ color: TEAL }}
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

export function RiqIntelligence() {
  const reduce = useReducedMotion();

  return (
    <div className="relative w-full h-[560px] sm:h-[600px] lg:h-[620px] overflow-hidden">
      <style>{`
        @keyframes riq-track {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .riq-track {
          display: flex;
          width: max-content;
          animation-name: riq-track;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .riq-track { animation: none; }
        }
      `}</style>
      {/* ── grid ─────────────────────────────────────── */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(58% 66% at 50% 50%, #000 10%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(58% 66% at 50% 50%, #000 10%, transparent 78%)",
        }}
      />

      {/* ── lines ────────────────────────────────────── */}
      <svg
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full z-[1]"
        aria-hidden
      >
        <defs>
          <linearGradient id="riq-ax-l" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={TEAL} stopOpacity="0" />
            <stop offset="100%" stopColor={TEAL} stopOpacity="0.42" />
          </linearGradient>
          <linearGradient id="riq-ax-r" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={TEAL} stopOpacity="0.42" />
            <stop offset="100%" stopColor={TEAL} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* the axis, right of the core only — the output run */}
        <path d="M606 310 H834" stroke="rgba(63,179,166,0.16)" strokeWidth="1" fill="none" />
        <path d="M834 310 H1440" stroke="url(#riq-ax-r)" strokeWidth="1" fill="none" />

        {/* vertical stubs, dashed, meeting the top and bottom nodes */}
        <path
          d="M720 120 V210"
          stroke="rgba(63,179,166,0.34)"
          strokeWidth="1"
          strokeDasharray="3 5"
        />
        {[664, 720, 776].map((x) => (
          <path
            key={x}
            d={`M720 410 L${x} 498`}
            stroke="rgba(63,179,166,0.26)"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
        ))}

        {/* beads on the axis */}
        {BEADS.map((b) => (
          <circle
            key={b.x}
            cx={b.x}
            cy={310}
            r={b.r}
            fill={TEAL}
            opacity={0.75}
          />
        ))}

        {/* cardinal nodes on the core */}
        {NODES.map((n, i) => (
          <g key={`${n.x}-${n.y}`}>
            <circle cx={n.x} cy={n.y} r={n.r * 2.4} fill={TEAL} opacity="0.12" />
            <motion.circle
              cx={n.x}
              cy={n.y}
              r={n.r}
              fill={TEAL}
              animate={reduce ? { opacity: 0.95 } : { opacity: [0.95, 0.5, 0.95] }}
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

        {/* the three streams — one unbroken dashed run each, drawn under
            the chips so a chip rides the line rather than interrupting it */}
        {FEEDS.map((d, i) => (
          <path
            key={`f-${i}`}
            d={d}
            fill="none"
            stroke="rgba(63,179,166,0.62)"
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
                fill={i === 1 ? ORANGE : TEAL}
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
            ))
          )}

        {/* particles — intelligence out */}
        {!reduce &&
          [0, 1, 2].map((i) => (
            <circle key={`po-${i}`} r="3" fill={TEAL} opacity="0.85">
              <animateMotion
                path="M874 310 H1360"
                dur="3.4s"
                begin={`${i * 1.15}s`}
                repeatCount="indefinite"
                calcMode="spline"
                keyPoints="0;1"
                keyTimes="0;1"
                keySplines="0.2 0 0.3 1"
              />
            </circle>
          ))}
      </svg>

      {/* ── corner panels ────────────────────────────── */}
      {PANELS.map((p, i) => (
        <motion.div
          key={p.n}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, delay: 0.15 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
          className={"absolute z-[3] w-[23%] sm:w-[19%] " + p.pin}
          style={{
            borderRadius: 12,
            background:
              "linear-gradient(160deg, rgba(23,32,33,0.92) 0%, rgba(11,15,16,0.92) 100%)",
            border: "1px solid rgba(63,179,166,0.18)",
          }}
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, i % 2 ? 3 : -3, 0] }}
            transition={
              reduce ? undefined : { duration: 8 + i, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <div
              className="flex items-center gap-2 px-3 py-2.5 sm:px-3.5 sm:py-3"
              style={{ borderBottom: "1px solid rgba(63,179,166,0.14)" }}
            >
              <span
                className="px-1.5 py-[2px] rounded-[4px] text-[8px] sm:text-[9px] font-mono font-bold text-white/45 shrink-0"
                style={{ border: "1px solid rgba(255,255,255,0.14)" }}
              >
                {p.n}
              </span>
              <span className="text-[8.5px] sm:text-[10px] font-mono font-bold tracking-[0.14em] uppercase text-white/75 truncate">
                {p.k}
              </span>
            </div>
            <div className="flex flex-col gap-[7px] px-3 py-3 sm:px-3.5 sm:py-3.5">
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

      {/* ── travelling chips ─────────────────────────────
         Marquee strips rather than independently-timed elements: each row
         is a flex track, duplicated once and translated from -50% to 0, so
         gaps inside a row are fixed and the loop is seamless. Duration is
         set against content width, which holds every strip at the same
         linear speed. */}
      <div
        aria-hidden
        className="absolute inset-0 z-[2] pointer-events-none overflow-hidden"
        style={{ maskImage: MASK_IN, WebkitMaskImage: MASK_IN }}
      >
        {IN_ROWS.map((row) => (
          <Track key={row.lane} row={row} variant="in" />
        ))}
      </div>

      <div
        aria-hidden
        className="absolute inset-0 z-[2] pointer-events-none overflow-hidden"
        style={{ maskImage: MASK_OUT, WebkitMaskImage: MASK_OUT }}
      >
        <Track row={OUT_ROW} variant="out" />
      </div>

      {/* ── the core ─────────────────────────────────────
         One disc, two labels, nothing else. Everything that used to sit
         underneath it — the promise line, the status line, the zone
         captions — has been removed; the section heading above already
         makes that argument, and the chips carry the rest. */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[4]">
        <div className="relative w-[168px] h-[168px] sm:w-[190px] sm:h-[190px] flex items-center justify-center">
          {/* ambient glow */}
          <span
            aria-hidden
            className="absolute rounded-full"
            style={{
              inset: "-64%",
              background:
                "radial-gradient(closest-side, rgba(63,179,166,0.13), rgba(255,106,0,0.045) 54%, transparent 74%)",
            }}
          />

          {/* outer rings */}
          {[1.58, 1.28].map((s, i) => (
            <motion.span
              key={s}
              aria-hidden
              className="absolute rounded-full"
              style={{
                width: `${s * 100}%`,
                height: `${s * 100}%`,
                border: "1px solid rgba(63,179,166,0.16)",
              }}
              animate={reduce ? { opacity: 0.6 } : { opacity: [0.6, 0.24, 0.6] }}
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

          {/* radar sweep */}
          {!reduce && (
            <motion.span
              aria-hidden
              className="absolute rounded-full"
              style={{
                width: "158%",
                height: "158%",
                background:
                  "conic-gradient(from 0deg, rgba(63,179,166,0.18), transparent 24%, transparent 100%)",
                maskImage: "radial-gradient(closest-side, transparent 62%, #000 64%)",
                WebkitMaskImage:
                  "radial-gradient(closest-side, transparent 62%, #000 64%)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            />
          )}

          {/* the record disc — lit from the centre out */}
          <div
            className="relative w-full h-full rounded-full flex flex-col items-center justify-center overflow-hidden"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(63,179,166,0.24) 0%, rgba(30,66,64,0.30) 30%, rgba(14,28,29,0.62) 58%, rgba(9,14,16,0.86) 82%, rgba(8,11,13,0.92) 100%)",
              border: "1px solid rgba(63,179,166,0.34)",
              boxShadow:
                "inset 0 0 44px -14px rgba(63,179,166,0.85), 0 0 44px -18px rgba(63,179,166,0.7)",
            }}
          >
            {/* inner hairline, as the reference has */}
            <span
              aria-hidden
              className="absolute rounded-full"
              style={{
                inset: "13%",
                border: "1px solid rgba(63,179,166,0.14)",
              }}
            />

            <span className="relative text-[8.5px] sm:text-[9.5px] font-mono font-bold tracking-[0.26em] uppercase text-white/55">
              IRDS
            </span>

            <motion.div
              className="relative my-2.5 flex items-center justify-center"
              animate={reduce ? undefined : { opacity: [0.8, 1, 0.8] }}
              transition={
                reduce
                  ? undefined
                  : { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }
            >
              {/* the mark sits in its own bloom */}
              <span
                aria-hidden
                className="absolute rounded-full"
                style={{
                  width: 62,
                  height: 62,
                  background:
                    "radial-gradient(closest-side, rgba(255,106,0,0.35), transparent 72%)",
                }}
              />
              <svg viewBox="0 0 24 22" className="relative w-[46px] h-auto" aria-hidden>
                <path
                  d="M3 1v20M12 1v20M21 1v20M3 8h18M3 15h18"
                  stroke={ORANGE}
                  strokeWidth="1.9"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>

            <span className="relative text-[12px] sm:text-[13.5px] font-bold tracking-[-0.01em] text-white">
              Rack Record
            </span>
          </div>
        </div>
      </div>

      {/* ── axis captions ────────────────────────────── */}
      <span className="absolute z-[4] left-1/2 -translate-x-1/2 top-[13%] text-[8.5px] sm:text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-white/45 whitespace-nowrap">
        Continuous inspection
      </span>
      <span className="absolute z-[4] left-1/2 -translate-x-1/2 bottom-[9%] text-[8.5px] sm:text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-white/45 whitespace-nowrap">
        Corrective action
      </span>
    </div>
  );
}
```
