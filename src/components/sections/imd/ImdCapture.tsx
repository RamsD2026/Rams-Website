"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 03 — What IMDS is.
 *
 * Built the way `MepsCapture` is built, and for the same reason that version
 * works: **one fixed canvas, everything placed on it by coordinate.** Nothing
 * here is laid out by flow. The canvas is 1232 × 586 — the page measure — so
 * the SVG viewBox is the canvas in CSS pixels and every position is a number
 * that can be checked against every other number.
 *
 *   0 ──────── 360 ···· gutter ···· 545 ···· 712 ────────── 1232
 *   │ sources   │  card → stub → hub   │ core │   outputs   │
 *
 * Where MEPS reads four things and answers three questions in one tabbed
 * panel, IMDS reads four sources and produces three things — so the core is a
 * real hub here: four feeds in on the left arc, three out on the right. The
 * same three rules hold the wiring to the gutters:
 *
 *   1. Every feed leaves and arrives horizontally, with a straight stub at the
 *      card end and an eased run at the anchor end. Both ends are tangent, so
 *      the seven read as one system.
 *   2. The anchors are spread around the core's arcs — 150/170/190/210° in,
 *      30/0/-30° out — so the core is a hub rather than a place lines pile up.
 *   3. Every feed stops on the anchor ring at r=62, outside the widest ring at
 *      r=60. No line ever enters the core's rings, so z-order never has to
 *      rescue the composition.
 *
 * Card order top-to-bottom matches anchor order top-to-bottom on both sides
 * and every run is monotone, so no two feeds can cross. That is a property of
 * the numbers, not something to eyeball — the same arithmetic also confirms
 * the 124px and 105px gutters, that both Bézier control runs stay monotone in
 * x (16.3px and 17.3px of margin), and that the core's caption clears the
 * lowest feed by 38px.
 *
 * Colour carries state and nothing else: feeds are a low-contrast grey, and
 * only the active one — the card the clock is on, or the card under the
 * cursor — goes orange and carries a pulse.
 *
 * The clock walks 0→6 through one cycle: four steps light the sources in turn
 * as they feed the engine, three light the outputs it produces. The output
 * cards are always fully drawn — they are the section's conclusion, true at
 * every step — so only the highlight travels and no slot ever empties. The
 * skeleton is constant; nothing on this canvas changes height.
 *
 * The core is an HTML element on top of the SVG, not a `<circle>` inside it:
 * the SVG is stretched to the container, and a circle in a stretched SVG is
 * an oval.
 *
 * Below lg the canvas is dropped and the three pieces stack in flow — there is
 * no room for a 1232-wide diagram on a phone, and the feeds would be pointing
 * at things that are no longer beside each other.
 */

const HAIR = "#E8E8ED";
const CARD_SHADOW =
  "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)";
const ORANGE = "#FF6A00";

/* ── the canvas ───────────────────────────────────────── */
const W = 1232;
const H = 586;

/** Right edge of the sources, and the two verticals after each gutter. */
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
/** Three shorter cards, centred on the canvas against the four sources. */
const OUT_TOP = (H - (3 * OUT_H + 2 * OUT_GAP)) / 2;
const outTop = (i: number) => OUT_TOP + i * (OUT_H + OUT_GAP);
const outMid = (i: number) => outTop(i) + OUT_H / 2;

/* The disc, and the box the rings actually occupy. Sizing anything off the
   disc is the mistake; the rings are what collides. Two rings, no more. */
const DISC = 84;
const RING_BOX = 120;
/** Where a feed stops: just outside the widest ring, never inside it. */
const ANCHOR_R = 62;

const polar = (deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [
    +(CORE_CX + ANCHOR_R * Math.cos(a)).toFixed(1),
    +(CORE_CY - ANCHOR_R * Math.sin(a)).toFixed(1),
  ];
};

/** One anchor per source on the left arc, one per output on the right. */
const IN_ANCHOR = [150, 170, 190, 210].map(polar);
const OUT_ANCHOR = [30, 0, -30].map(polar);

/** Where each stub ends and the eased run begins, on either side. */
const LANE_X = CARD_R + 55;
const LANE_R = PANEL_L - 48;

/** The five signals IMDS already has around the fleet, in four places. */
const SOURCES = [
  {
    tag: "MHE",
    title: "Machine telematics",
    body: "Hours, fault codes, load cycles, duty and usage from the equipment itself.",
  },
  {
    tag: "RFID",
    title: "Identity & location",
    body: "Which machine, which attachment, where it operates and how often.",
  },
  {
    tag: "CCTV",
    title: "Visual & impact",
    body: "Impact and handling context that telematics alone can't see.",
  },
  {
    tag: "WMS · ERP",
    title: "Maintenance & work history",
    body: "Service records, parts, costs and work orders from your systems.",
  },
];

/** And what the engine makes of them. */
const OUTPUTS = [
  {
    title: "Machine health score",
    body: "One comparable measure of condition, per machine and across the fleet.",
  },
  {
    title: "Predicted needs",
    body: "What's wearing, what's due and what's likely to fail — before it does.",
  },
  {
    title: "Condition-based plan",
    body: "Maintenance timed to real duty, not a fixed interval.",
  },
];

/**
 * The seven feeds. Both control points sit on their own end's horizontal, so
 * every curve leaves and arrives flat and never overshoots.
 */
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

/* Four steps to draw the sources in, three to produce the outputs. */
const CYCLE = SOURCES.length + OUTPUTS.length;
const STEP_MS = 900;

/** What the clock, or the cursor, is pointing at. */
type Live = { side: "in" | "out"; i: number } | null;
const same = (a: Live, side: "in" | "out", i: number) =>
  a !== null && a.side === side && a.i === i;

/* ── the pieces ───────────────────────────────────────── */

function SourceCard({
  s,
  on,
}: {
  s: (typeof SOURCES)[number];
  on: boolean;
}) {
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

function OutputCard({
  o,
  on,
}: {
  o: (typeof OUTPUTS)[number];
  on: boolean;
}) {
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
 * Two rings, and a glow soft enough to read as light rather than as a third
 * circle. Everything decorative here competes with seven dashed feeds, so the
 * disc has to be the only solid object.
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
          viewBox="0 0 28 20"
          className="w-[28px] h-auto"
          aria-hidden
          initial={{ opacity: 0.9 }}
          animate={reduce ? undefined : { opacity: [0.75, 1, 0.75] }}
          transition={
            reduce
              ? undefined
              : { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }
        >
          {/* A condition trace: the one reading this whole section produces. */}
          <path
            d="M1 12h5l3-8 4 15 3-9 2 4h6"
            fill="none"
            stroke={ORANGE}
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
        <span className="mt-1 text-[10.5px] font-bold tracking-[-0.01em] text-carbon">
          IMDS
        </span>
      </div>

      {/* Hung off the ring box, so it clears the outer ring by the margin and
          not by whatever a flex gap happened to leave. */}
      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-3.5 text-[9px] font-mono font-bold tracking-[0.12em] uppercase text-graphite/40 whitespace-nowrap">
        Diagnostic engine
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

      {/* the anchor it terminates on */}
      <circle
        cx={ax}
        cy={ay}
        r={on ? 3.4 : 2.4}
        fill={on ? ORANGE : "rgba(20,22,26,0.22)"}
        style={{ transition: "fill 0.45s ease, r 0.45s ease" }}
      />

      {/* One pulse, on the live feed only. Keyed by the path so it restarts
          from the source each time that feed becomes live. */}
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

export function ImdCapture() {
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

  /* The cursor outranks the clock. Hovering a card is a question about that
     card, so its feed and anchor answer it whatever the cycle is doing. */
  const live = hover ?? clock;

  return (
    <Section surface="offWhite" id="overview">
      <SectionHeader
        eyebrow="What IMDS is"
        top="Five data sources"
        bottom="One health record per machine."
        size="compact"
        width="wide"
        body="IMDS integrates the signals that already exist around your fleet — but never sit in one place — into a single diagnostic record for each machine, and turns that record into condition-based maintenance intelligence."
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
