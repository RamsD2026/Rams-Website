"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 03 — What AIMS is.
 *
 * The `MepsCapture` / `ImdCapture` canvas: **one fixed canvas, everything
 * placed on it by coordinate.** Nothing here is laid out by flow. The canvas
 * is 1232 × 586 — the page measure — so the SVG viewBox is the canvas in CSS
 * pixels and every position is a number that can be checked against every
 * other number.
 *
 *   0 ──────── 360 ···· gutter ···· 545 ···· 712 ────────── 1232
 *   │ modules   │  card → stub → hub   │ core │   outputs   │
 *
 * On the other pages the four things on the left are sensors, systems or
 * signals. Here they are **the rest of the platform** — which is the whole
 * claim of this product, and the reason this section replaces the tile grid
 * every other page uses for its overview. AIMS is the only module whose
 * inputs are other modules, and a six-tile grid of nouns cannot say that. A
 * hub with four products feeding it can.
 *
 * The wiring rules are the ones the earlier canvases established:
 *
 *   1. Every feed leaves and arrives horizontally, with a straight stub at the
 *      card end and an eased run at the anchor end, so the seven read as one
 *      system.
 *   2. Anchors are spread around the core's arcs — 150/170/190/210° in,
 *      30/0/-30° out — so the core is a hub, not a place lines pile up.
 *   3. Every feed stops on the anchor ring at r=62, outside the widest ring at
 *      r=60. No line enters the core's rings, so z-order never has to rescue
 *      the composition.
 *
 * Card order matches anchor order top-to-bottom on both sides and every run is
 * monotone, so no two feeds can cross — a property of the numbers, not
 * something eyeballed. The same arithmetic gives the 124px and 105px gutters,
 * keeps both Bézier control runs monotone in x, and clears the core's caption
 * of the lowest feed by 38px.
 *
 * The clock walks 0→6: four steps light the modules in turn as they feed the
 * engine, three light what it produces. The output cards are always fully
 * drawn — they are the section's conclusion, true at every step — so only the
 * highlight travels and no slot ever empties.
 *
 * The core is an HTML element on top of the SVG, not a `<circle>` inside it:
 * the SVG is stretched to its container, and a circle in a stretched SVG is an
 * oval.
 */

const HAIR = "#E8E8ED";
const CARD_SHADOW =
  "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)";
const ORANGE = "#FF6A00";

/* ── the canvas ───────────────────────────────────────── */
const W = 1232;
const H = 586;

const CARD_R = 360;
const CORE_CX = 545;
const CORE_CY = 293;
const PANEL_L = 712;

const CARD_H = 136;
const CARD_GAP = 14;
/** Four of these fill the canvas exactly: 4 × 136 + 3 × 14 = 586. */
const cardTop = (i: number) => i * (CARD_H + CARD_GAP);
const cardMid = (i: number) => cardTop(i) + CARD_H / 2;

const OUT_H = 160;
const OUT_GAP = 22;
const OUT_TOP = (H - (3 * OUT_H + 2 * OUT_GAP)) / 2;
const outTop = (i: number) => OUT_TOP + i * (OUT_H + OUT_GAP);
const outMid = (i: number) => outTop(i) + OUT_H / 2;

const DISC = 84;
const RING_BOX = 120;
const ANCHOR_R = 62;

const polar = (deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [
    +(CORE_CX + ANCHOR_R * Math.cos(a)).toFixed(1),
    +(CORE_CY - ANCHOR_R * Math.sin(a)).toFixed(1),
  ];
};

const IN_ANCHOR = [150, 170, 190, 210].map(polar);
const OUT_ANCHOR = [30, 0, -30].map(polar);

const LANE_X = CARD_R + 55;
const LANE_R = PANEL_L - 48;

/** The platform beneath, in four groups. Every one of these is a RAMS product. */
const SOURCES = [
  {
    tag: "Safety",
    title: "RTSS",
    body: "Real-time safety events, near-misses and zone risk.",
  },
  {
    tag: "Racks",
    title: "IRDS",
    body: "Rack condition, open findings, closure and recurrence.",
  },
  {
    tag: "Fleet",
    title: "MEPS & IMDS",
    body: "Productivity, utilisation and machine health.",
  },
  {
    tag: "Flow",
    title: "ATOS & IROS",
    body: "Execution, SLA and inventory performance.",
  },
];

/** And what the engine makes of them. */
const OUTPUTS = [
  {
    title: "Comparable metrics",
    body: "Every site measured the same way, so numbers actually mean the same thing.",
  },
  {
    title: "Network intelligence",
    body: "Benchmarks, exceptions and trends across the whole estate, current not monthly.",
  },
  {
    title: "Decisions & drill-down",
    body: "From the board number down to the finding, machine or event behind it.",
  },
];

const IN_FEEDS = SOURCES.map((_, i) => {
  const y = cardMid(i);
  const [ax, ay] = IN_ANCHOR[i];
  return `M${CARD_R} ${y} H${LANE_X} C ${LANE_X + 30} ${y}, ${(ax - 30).toFixed(1)} ${ay}, ${ax} ${ay}`;
});

const OUT_FEEDS = OUTPUTS.map((_, i) => {
  const y = outMid(i);
  const [ax, ay] = OUT_ANCHOR[i];
  return `M${ax} ${ay} C ${(ax + 24).toFixed(1)} ${ay}, ${LANE_R - 24} ${y}, ${LANE_R} ${y} H${PANEL_L}`;
});

const CYCLE = SOURCES.length + OUTPUTS.length;
const STEP_MS = 900;

type Live = { side: "in" | "out"; i: number } | null;
const same = (a: Live, side: "in" | "out", i: number) =>
  a !== null && a.side === side && a.i === i;

/* ── the pieces ───────────────────────────────────────── */

function SourceCard({ s, on }: { s: (typeof SOURCES)[number]; on: boolean }) {
  return (
    <article
      className="h-full flex flex-col justify-center px-5 py-4 bg-white overflow-hidden"
      style={{
        borderRadius: 12,
        /* No shadow. These are where the feeds come from, not the section's
           cards — the outputs are the only things here that sit above the
           page. */
        border: `1px solid ${on ? "rgba(255,106,0,0.45)" : HAIR}`,
        transition: "border-color 0.4s ease",
      }}
    >
      <span className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-signal-orange">
        {s.tag}
      </span>
      <h3 className="mt-1.5 text-[15px] sm:text-[16px] font-bold text-carbon leading-[1.25] tracking-[-0.02em]">
        {s.title}
      </h3>
      <p className="mt-1.5 text-[12.5px] text-graphite/60 leading-[1.5]">
        {s.body}
      </p>
    </article>
  );
}

function OutputCard({ o, on }: { o: (typeof OUTPUTS)[number]; on: boolean }) {
  return (
    <article
      className="h-full flex flex-col justify-center px-6 py-5 bg-white overflow-hidden"
      style={{
        borderRadius: 14,
        border: `1px solid ${on ? "rgba(255,106,0,0.45)" : HAIR}`,
        boxShadow: CARD_SHADOW,
        transition: "border-color 0.4s ease",
      }}
    >
      <span className="flex items-center gap-2">
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: ORANGE }}
        />
        <span className="text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase text-graphite/35">
          Output
        </span>
      </span>
      <h3 className="mt-3 text-[18px] sm:text-[19px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
        {o.title}
      </h3>
      <p className="mt-2.5 text-[13.5px] text-graphite/65 leading-[1.6]">
        {o.body}
      </p>
    </article>
  );
}

/**
 * The engine.
 *
 * The wrapper is the **ring** box, not the disc box, so anything positioned
 * off it clears the widest thing this element draws. The caption hangs from
 * `top: 100%` of that box, which is why it cannot land on a ring.
 *
 * The glyph is three stacked layers with the top one lit, because that is
 * where AIMS sits — on top of the platform, reading it. A chart would have
 * been the obvious choice and the wrong one: this page's own FAQ opens by
 * saying AIMS is not a reporting dashboard.
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
        <svg viewBox="0 0 26 22" className="w-[26px] h-auto" aria-hidden>
          <path
            d="M2 15.5 L13 20.5 L24 15.5"
            fill="none"
            stroke="rgba(20,22,26,0.22)"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 10.5 L13 15.5 L24 10.5"
            fill="none"
            stroke="rgba(20,22,26,0.22)"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <motion.path
            d="M2 5.5 L13 10.5 L24 5.5"
            fill="none"
            stroke={ORANGE}
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ opacity: 0.9 }}
            animate={reduce ? undefined : { opacity: [0.75, 1, 0.75] }}
            transition={
              reduce
                ? undefined
                : { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }
          />
        </svg>
        <span className="mt-1 text-[10.5px] font-bold tracking-[-0.01em] text-carbon">
          AIMS
        </span>
      </div>

      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-3.5 text-[9px] font-mono font-bold tracking-[0.12em] uppercase text-graphite/40 whitespace-nowrap">
        AIMS engine
      </span>
    </div>
  );
}

/** One feed, drawn the same way whichever direction it runs. */
function Feed({
  d,
  ax,
  ay,
  on,
  reduce,
  seed,
}: {
  d: string;
  ax: number;
  ay: number;
  on: boolean;
  reduce: boolean | null;
  seed: number;
}) {
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={on ? "rgba(255,106,0,0.85)" : "rgba(20,22,26,0.16)"}
        strokeWidth={on ? 1.4 : 1}
        strokeDasharray="4 7"
        strokeLinecap="round"
        style={{ transition: "stroke 0.45s ease, stroke-width 0.45s ease" }}
      >
        {!reduce && (
          <animate
            attributeName="stroke-dashoffset"
            from="44"
            to="0"
            dur={`${3 + seed * 0.3}s`}
            repeatCount="indefinite"
          />
        )}
      </path>

      <circle
        cx={ax}
        cy={ay}
        r={on ? 3.4 : 2.4}
        fill={on ? ORANGE : "rgba(20,22,26,0.22)"}
        style={{ transition: "fill 0.45s ease, r 0.45s ease" }}
      />

      {!reduce && on && (
        <circle key={d} r="3" fill={ORANGE}>
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
}

/* ── the section ──────────────────────────────────────── */

export function AmsCapture() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const [hover, setHover] = useState<Live>(null);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setPhase((p) => (p + 1) % CYCLE), STEP_MS);
    return () => clearInterval(id);
  }, [reduce]);

  const clock: Live = reduce
    ? null
    : phase < SOURCES.length
      ? { side: "in", i: phase }
      : { side: "out", i: phase - SOURCES.length };

  const live = hover ?? clock;

  return (
    <Section surface="offWhite" id="overview">
      <SectionHeader
        eyebrow="What AIMS is"
        top="The layer that turns"
        bottom="Many sites into one operation."
        size="compact"
        width="wide"
        body="AIMS sits at the top of the RAMS platform. It aggregates every product deployed across your sites into normalised, comparable metrics — one language for safety, integrity, productivity, fleet and flow — and turns them into intelligence a leadership team can act on."
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
          {IN_FEEDS.map((d, i) => (
            <Feed
              key={d}
              d={d}
              ax={IN_ANCHOR[i][0]}
              ay={IN_ANCHOR[i][1]}
              on={same(live, "in", i)}
              reduce={reduce}
              seed={i}
            />
          ))}

          {OUT_FEEDS.map((d, i) => (
            <Feed
              key={d}
              d={d}
              ax={OUT_ANCHOR[i][0]}
              ay={OUT_ANCHOR[i][1]}
              on={same(live, "out", i)}
              reduce={reduce}
              seed={i + SOURCES.length}
            />
          ))}
        </svg>

        {SOURCES.map((s, i) => (
          <div
            key={s.title}
            className="absolute z-[2]"
            style={{
              left: 0,
              width: `${(CARD_R / W) * 100}%`,
              top: cardTop(i),
              height: CARD_H,
            }}
            onMouseEnter={() => setHover({ side: "in", i })}
            onMouseLeave={() => setHover(null)}
          >
            <SourceCard s={s} on={same(live, "in", i)} />
          </div>
        ))}

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

        {OUTPUTS.map((o, i) => (
          <div
            key={o.title}
            className="absolute z-[2]"
            style={{
              left: `${(PANEL_L / W) * 100}%`,
              right: 0,
              top: outTop(i),
              height: OUT_H,
            }}
            onMouseEnter={() => setHover({ side: "out", i })}
            onMouseLeave={() => setHover(null)}
          >
            <OutputCard o={o} on={same(live, "out", i)} />
          </div>
        ))}
      </motion.div>

      {/* ── stacked, below lg ──────────────────────────── */}
      <div className="lg:hidden flex flex-col gap-4">
        {SOURCES.map((s, i) => (
          <div key={s.title} style={{ minHeight: CARD_H }}>
            <SourceCard s={s} on={same(live, "in", i)} />
          </div>
        ))}
        <div className="flex justify-center pt-8 pb-12">
          <Core reduce={reduce} />
        </div>
        {OUTPUTS.map((o, i) => (
          <div key={o.title} style={{ minHeight: OUT_H }}>
            <OutputCard o={o} on={same(live, "out", i)} />
          </div>
        ))}
      </div>
    </Section>
  );
}
