"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 03 — What MEPS reads, and what it produces.
 *
 * Built the way `AimsFlow` is built on the Management Intelligence page, and
 * for the reason that version works: **one fixed canvas, everything placed on
 * it by coordinate.** Nothing here is laid out by flow. The canvas is
 * 1232 × 620 — the page measure — so the SVG viewBox is the canvas in CSS
 * pixels and every position is a number that can be checked against every
 * other number.
 *
 * Laying this out with flex columns and gaps is what put the rings on the
 * cards and the caption on the rings: a gap measures from an element's border
 * box, and a ring drawn `absolute` inside a disc reaches past that box, so the
 * gap was never measuring the thing that was colliding. On a canvas there is
 * no such gap to get wrong.
 *
 *   0 ──────── 370 ···· gutter ···· 573 ···· 690 ────────── 1232
 *   │ captures  │   card → stub → hub   │ core │   readout  │
 *
 * The gutter is 143px of deliberate empty space. Three rules hold the wiring
 * to it:
 *
 *   1. Every feed leaves its card horizontally, runs a 60px straight stub,
 *      then eases into its anchor horizontally. No feed curves freely at a
 *      target; both ends are tangent, so the four read as one system.
 *   2. The four anchors are spread around the core's left arc at 150°, 170°,
 *      190° and 210°, so the core is a hub rather than a place lines pile up.
 *   3. Every feed stops on the anchor ring at r=62 — outside the widest ring
 *      at r=60. A line never enters the core's rings, so the z-order never has
 *      to rescue the composition.
 *
 * Because card order top-to-bottom matches anchor order top-to-bottom and both
 * runs are monotone, the four feeds cannot cross. That is a property of the
 * numbers, not something to eyeball.
 *
 * Colour carries state and nothing else: feeds are a low-contrast grey, and
 * only the active one — the card the clock is on, or the card under the
 * cursor — goes orange and carries a pulse.
 *
 * The motion is AimsFlow's: every feed is one unbroken dashed run so a pulse
 * rides the line instead of interrupting it, and all the dash tracks move at
 * one speed. The core is an HTML element on top of the SVG, not a `<circle>`
 * inside it — the SVG is stretched, and a circle in a stretched SVG is an oval.
 *
 * The readout is one clock. `phase` walks 0→5: the first four steps each land
 * one capture row and light the card it came from, the last two hold the
 * finished readout, then `tab` advances. Which card is hot, how many rows are
 * in and which tab is open are all read off that one pair, so nothing can
 * drift out of step with anything else.
 *
 * Below lg the canvas is dropped and the same three pieces stack in flow —
 * there is no room for a 1232-wide diagram on a phone, and the feeds would be
 * pointing at things that are no longer beside each other.
 */

const HAIR = "#E8E8ED";
const CARD_SHADOW =
  "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)";
const ORANGE = "#FF6A00";

/* ── the canvas ───────────────────────────────────────── */
const W = 1232;
const H = 620;

/** Right edge of the captures, and the two verticals after the gutter. */
const CARD_R = 370;
const CORE_CX = 573;
const CORE_CY = 310;
const PANEL_L = 690;

const CARD_H = 144;
const CARD_GAP = 14;
/** Top and centre of card i — four of these fill the canvas exactly. */
const cardTop = (i: number) => i * (CARD_H + CARD_GAP);
const cardMid = (i: number) => cardTop(i) + CARD_H / 2;

/* The disc, and the box the rings actually occupy. Sizing anything off the
   disc is the mistake; the rings are what collides. Two rings, no more. */
const DISC = 84;
const RING_BOX = 120;
/** Where a feed stops: just outside the widest ring, never inside it. */
const ANCHOR_R = 62;

/** One anchor per capture, spread around the core's left arc. */
const ANCHOR_DEG = [150, 170, 190, 210];
const anchor = (i: number): [number, number] => {
  const a = (ANCHOR_DEG[i] * Math.PI) / 180;
  return [
    +(CORE_CX + ANCHOR_R * Math.cos(a)).toFixed(1),
    +(CORE_CY - ANCHOR_R * Math.sin(a)).toFixed(1),
  ];
};

/** Where each stub ends and the eased run begins. */
const LANE_X = CARD_R + 60;

/** The four things read off the machine. */
const CAPTURES = [
  {
    q: "Where?",
    title: "Location",
    body: "LiDAR indoor position, route, distance, speed, zone and dwell — no GPS dependency.",
  },
  {
    q: "Who?",
    title: "Operator",
    body: "Session identity through the authentication method configured for the site.",
  },
  {
    q: "Load?",
    title: "Pallet detection",
    body: "Whether the machine is carrying material or travelling empty.",
  },
  {
    q: "When?",
    title: "Movement & time",
    body: "How far, how fast, and how long a machine spent working or waiting.",
  },
];

/**
 * One feed per capture: out of the card, along a straight stub, then a single
 * eased run into that card's anchor. Both control points sit on their own end's
 * horizontal, so the curve leaves and arrives flat and never overshoots.
 */
const FEEDS = CAPTURES.map((_, i) => {
  const y = cardMid(i);
  const [ax, ay] = anchor(i);
  const c2 = +(ax - 38).toFixed(1);
  return `M${CARD_R} ${y} H${LANE_X} C ${LANE_X + 38} ${y}, ${c2} ${ay}, ${ax} ${ay}`;
});

/** And the one run out, off the core's right arc into the readout. */
const OUT = `M${CORE_CX + ANCHOR_R} ${CORE_CY} H${PANEL_L}`;

/**
 * The three readouts. Each row is one capture resolved for that tab, in
 * CAPTURES order — the point of the animation is that the same four inputs
 * answer three different questions, so the order has to hold.
 *
 * Values are one machine's session, headed as such. They are a readout, not a
 * customer result, and nothing here is presented as a benchmark.
 */
const TABS = [
  {
    key: "productivity",
    label: "Productivity",
    body: "How much useful work the fleet creates — pallets moved, loaded travel, task and asset performance.",
    rows: [
      ["Zones served", "6 of 9"],
      ["Task sessions", "24"],
      ["Loaded travel", "61%"],
      ["Pallets moved", "42"],
    ],
  },
  {
    key: "efficiency",
    label: "Efficiency",
    body: "What that work consumes — time, distance, idle, congestion and fleet capacity.",
    rows: [
      ["Distance", "4.8 km"],
      ["Idle & waiting", "22 min"],
      ["Empty travel", "39%"],
      ["Congested runs", "3 aisles"],
    ],
  },
  {
    key: "safety",
    label: "Basic safety",
    body: "Which speed-related operating patterns deserve attention, by zone, machine and session.",
    rows: [
      ["Zone speed flags", "2"],
      ["Session", "OP-118"],
      ["Laden speed flags", "1"],
      ["Harsh events", "4"],
    ],
  },
];

/* Four steps to land the rows, two to hold the finished readout. */
const CYCLE = 6;
const STEP_MS = 900;

type Capture = (typeof CAPTURES)[number];

/* ── the pieces ───────────────────────────────────────── */

function CaptureCard({ c, on }: { c: Capture; on: boolean }) {
  return (
    <article
      className="h-full flex flex-col justify-center px-5 py-4 bg-white overflow-hidden"
      style={{
        borderRadius: 12,
        /* No shadow. These are where the feeds come from, not the section's
           cards — the readout is the only thing here that sits above the
           page. */
        border: `1px solid ${on ? "rgba(255,106,0,0.45)" : HAIR}`,
        transition: "border-color 0.4s ease",
      }}
    >
      <span className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-signal-orange">
        {c.q}
      </span>
      <h3 className="mt-1.5 text-[15px] sm:text-[16px] font-bold text-carbon leading-[1.25] tracking-[-0.02em]">
        {c.title}
      </h3>
      <p className="mt-1.5 text-[12.5px] text-graphite/60 leading-[1.5]">
        {c.body}
      </p>
    </article>
  );
}

/**
 * The core.
 *
 * The wrapper is the **ring** box, not the disc box, so anything positioned
 * off it clears the widest thing this element draws. The caption hangs from
 * `top: 100%` of that box, which is why it cannot land on a ring.
 *
 * Two rings, and a glow soft enough to read as light rather than as a third
 * circle. Everything decorative here competes with four dashed feeds arriving
 * from the left, so the disc has to be the only solid object.
 */
function Core({ reduce }: { reduce: boolean | null }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: RING_BOX, height: RING_BOX }}
    >
      <span
        aria-hidden
        className="absolute rounded-full"
        style={{
          inset: "-18%",
          background:
            "radial-gradient(closest-side, rgba(255,106,0,0.10), transparent 72%)",
        }}
      />

      {[RING_BOX, 102].map((d, i) => (
        <motion.span
          key={d}
          aria-hidden
          className="absolute rounded-full"
          style={{
            width: d,
            height: d,
            border: "1px solid rgba(255,106,0,0.16)",
          }}
          initial={{ opacity: 0.8 }}
          animate={reduce ? { opacity: 0.8 } : { opacity: [0.8, 0.35, 0.8] }}
          transition={
            reduce
              ? undefined
              : {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 1.4,
                }
          }
        />
      ))}

      {/* The one solid object in the gutter. */}
      <div
        className="relative rounded-full flex flex-col items-center justify-center bg-white"
        style={{
          width: DISC,
          height: DISC,
          border: "1px solid rgba(255,106,0,0.30)",
          boxShadow:
            "0 10px 28px -14px rgba(0,0,0,0.25), 0 2px 6px -2px rgba(0,0,0,0.06)",
        }}
      >
        <motion.svg
          viewBox="0 0 24 22"
          className="w-[25px] h-auto"
          aria-hidden
          initial={{ opacity: 0.9 }}
          animate={reduce ? undefined : { opacity: [0.75, 1, 0.75] }}
          transition={
            reduce
              ? undefined
              : { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <path
            d="M3 1v20M12 1v20M21 1v20M3 8h18M3 15h18"
            stroke={ORANGE}
            strokeWidth="1.9"
            strokeLinecap="round"
          />
        </motion.svg>
        <span className="mt-1 text-[10.5px] font-bold tracking-[-0.01em] text-carbon">
          Twin
        </span>
      </div>

      {/* Hung off the ring box, so it clears the outer ring by the margin and
          not by whatever a flex gap happened to leave. */}
      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-3.5 text-[9px] font-mono font-bold tracking-[0.12em] uppercase text-graphite/40 whitespace-nowrap">
        Digital Twin-led
      </span>
    </div>
  );
}

function Readout({
  tab,
  landed,
  onPick,
}: {
  tab: number;
  landed: number;
  onPick: (n: number) => void;
}) {
  const t = TABS[tab];
  return (
    <div
      className="h-full flex flex-col bg-white overflow-hidden"
      style={{
        borderRadius: 14,
        border: `1px solid ${HAIR}`,
        boxShadow: CARD_SHADOW,
      }}
    >
      {/* the three tabs */}
      <div
        className="flex items-center gap-1 p-1.5 m-4 mb-0 rounded-full shrink-0"
        style={{ background: "#F0F0F2" }}
      >
        {TABS.map((x, n) => {
          const on = n === tab;
          return (
            <button
              key={x.key}
              type="button"
              onClick={() => onPick(n)}
              aria-current={on ? "true" : undefined}
              className={
                "relative flex-1 px-3 py-2 rounded-full text-[12px] sm:text-[12.5px] font-semibold transition-colors duration-300 " +
                (on ? "text-carbon" : "text-graphite/55 hover:text-carbon")
              }
            >
              {on && (
                <motion.span
                  layoutId="mepscap-tab"
                  className="absolute inset-0 rounded-full bg-white"
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.10)" }}
                  transition={{ duration: 0.4, ease: EASE }}
                />
              )}
              <span className="relative">{x.label}</span>
            </button>
          );
        })}
      </div>

      {/* what the open tab answers */}
      <div className="px-5 sm:px-6 pt-5 shrink-0">
        <motion.p
          key={t.key}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="min-h-[3.2em] text-[13.5px] text-graphite/65 leading-[1.6]"
        >
          {t.body}
        </motion.p>
      </div>

      {/* the rows, landing one at a time */}
      <div className="flex flex-col flex-1 min-h-0 px-5 sm:px-6 pb-5 pt-4">
        <div
          className="flex items-center justify-between mb-3 shrink-0"
          style={{ borderBottom: `1px solid ${HAIR}`, paddingBottom: 10 }}
        >
          <span className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-graphite/40">
            MHE-04 · shift 2
          </span>
          <span className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-signal-orange tabular-nums">
            {landed}/4 in
          </span>
        </div>

        {/* Four slots that grow to fill whatever height the canvas gives the
            panel, so the readout never leaves a hole under itself. */}
        <div className="flex flex-col flex-1 min-h-0 gap-2">
          {t.rows.map(([k, v], i) => {
            const shown = i < landed;
            return (
              <motion.div
                key={`${t.key}-${k}`}
                className="flex-1 flex flex-col justify-center gap-1.5 px-4 rounded-[10px]"
                style={{
                  minHeight: 56,
                  background: "#FAFAFB",
                  border: `1px solid ${HAIR}`,
                }}
                initial={false}
                animate={{ opacity: shown ? 1 : 0, x: shown ? 0 : -18 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: ORANGE }}
                  />
                  <span className="text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase text-graphite/35 truncate">
                    {CAPTURES[i].title}
                  </span>
                </span>
                <span className="flex items-baseline justify-between gap-3">
                  <span className="text-[13.5px] text-graphite/65 truncate">
                    {k}
                  </span>
                  <span className="text-[17px] font-bold text-carbon tabular-nums shrink-0 leading-none">
                    {v}
                  </span>
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── the section ──────────────────────────────────────── */

export function MepsCapture() {
  const reduce = useReducedMotion();
  /* One state, one updater. Deriving `tab` and `phase` from a single object
     keeps the interval callback pure — no setState nested inside another
     updater, which React would run twice in development. */
  const [clock, setClock] = useState({ tab: 0, phase: 0 });
  const [nudge, setNudge] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setClock(({ tab, phase }) =>
        phase < CYCLE - 1
          ? { tab, phase: phase + 1 }
          : { tab: (tab + 1) % TABS.length, phase: 0 },
      );
    }, STEP_MS);
    return () => clearInterval(id);
  }, [reduce, nudge]);

  const landed = reduce ? CAPTURES.length : Math.min(clock.phase + 1, 4);
  const hot = reduce ? null : clock.phase < 4 ? clock.phase : null;
  /* The cursor outranks the clock. Hovering a card is a question about that
     card, so its feed and anchor answer it whatever the cycle is doing. */
  const active = hover ?? hot;

  const pick = (n: number) => {
    setClock({ tab: n, phase: 0 });
    setNudge((v) => v + 1);
  };

  return (
    <Section surface="offWhite" id="capture">
      <SectionHeader
        eyebrow="What MEPS reads"
        top="Four things captured"
        bottom="Three things understood."
        size="compact"
        width="wide"
        body="Position, identity, load and time come off the machine. The Digital Twin gives them a place in the building — and the same four inputs answer three different questions."
      />

      {/* ── the canvas ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative hidden lg:block w-full"
        style={{ height: H }}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full z-[1]"
          aria-hidden
        >
          {FEEDS.map((d, i) => {
            const on = active === i;
            const [ax, ay] = anchor(i);
            return (
              <g key={d}>
                <path
                  d={d}
                  fill="none"
                  stroke={on ? "rgba(255,106,0,0.85)" : "rgba(20,22,26,0.16)"}
                  strokeWidth={on ? 1.4 : 1}
                  strokeDasharray="4 7"
                  strokeLinecap="round"
                  style={{
                    transition: "stroke 0.45s ease, stroke-width 0.45s ease",
                  }}
                >
                  {!reduce && (
                    <animate
                      attributeName="stroke-dashoffset"
                      from="44"
                      to="0"
                      dur={`${3 + i * 0.3}s`}
                      repeatCount="indefinite"
                    />
                  )}
                </path>

                {/* the anchor it terminates on */}
                <circle
                  cx={ax}
                  cy={ay}
                  r={on ? 3.4 : 2.4}
                  fill={on ? ORANGE : "rgba(20,22,26,0.22)"}
                  style={{ transition: "fill 0.45s ease, r 0.45s ease" }}
                />

                {/* One pulse, on the live feed only. Keyed by the feed so it
                    restarts from the card each time that card becomes live. */}
                {!reduce && on && (
                  <circle key={`p-${i}`} r="3" fill={ORANGE}>
                    <animateMotion
                      path={d}
                      dur="1.6s"
                      repeatCount="indefinite"
                      calcMode="spline"
                      keyPoints="0;1"
                      keyTimes="0;1"
                      keySplines="0.3 0 0.2 1"
                    />
                  </circle>
                )}
              </g>
            );
          })}

          {/* the run out — always live, it is the section's conclusion */}
          <path
            d={OUT}
            fill="none"
            stroke="rgba(255,106,0,0.55)"
            strokeWidth="1.2"
            strokeDasharray="4 7"
            strokeLinecap="round"
          >
            {!reduce && (
              <animate
                attributeName="stroke-dashoffset"
                from="44"
                to="0"
                dur="2.2s"
                repeatCount="indefinite"
              />
            )}
          </path>
          {!reduce && (
            <circle r="3" fill={ORANGE}>
              <animateMotion path={OUT} dur="2.2s" repeatCount="indefinite" />
            </circle>
          )}
        </svg>

        {CAPTURES.map((c, i) => (
          <div
            key={c.title}
            className="absolute z-[2]"
            style={{
              left: 0,
              width: `${(CARD_R / W) * 100}%`,
              top: cardTop(i),
              height: CARD_H,
            }}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <CaptureCard c={c} on={active === i} />
          </div>
        ))}

        {/* z-3: above the wiring, which is why no feed can be seen crossing
            the disc even though every one of them stops short of it anyway. */}
        <div
          className="absolute z-[3]"
          style={{
            left: `${(CORE_CX / W) * 100}%`,
            top: CORE_CY,
            transform: "translate(-50%, -50%)",
          }}
        >
          <Core reduce={reduce} />
        </div>

        <div
          className="absolute z-[2] top-0 bottom-0"
          style={{ left: `${(PANEL_L / W) * 100}%`, right: 0 }}
        >
          <Readout tab={clock.tab} landed={landed} onPick={pick} />
        </div>
      </motion.div>

      {/* ── stacked, below lg ──────────────────────────── */}
      <div className="lg:hidden flex flex-col gap-4">
        {CAPTURES.map((c, i) => (
          <div key={c.title} style={{ minHeight: CARD_H }}>
            <CaptureCard c={c} on={active === i} />
          </div>
        ))}
        <div className="flex justify-center pt-8 pb-12">
          <Core reduce={reduce} />
        </div>
        <div style={{ height: 560 }}>
          <Readout tab={clock.tab} landed={landed} onPick={pick} />
        </div>
      </div>
    </Section>
  );
}
