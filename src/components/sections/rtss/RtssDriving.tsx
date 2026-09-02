"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Driving safety intelligence.
 *
 * Five bento cards, 2-up then 3-up. Each is a live widget cropped by the card
 * edge with the heading and one line of copy beneath it — the artefact carries
 * the card and the text only names it.
 *
 * All five read from one playhead sweeping a single driving session, which is
 * the argument made visible: the same instant produces a calm speed reading
 * and a violent jerk reading, so the cards disagree with each other in real
 * time and you can watch it happen.
 *
 * The series are the source document's, from the same expression, and the
 * playhead starts at the high-jerk moment — so the first paint is already the
 * case the page is making, and there is nothing random to mismatch on
 * hydration.
 *
 * TREATMENT: the standard card of docs/section-header.md — white, #E8E8ED
 * hairline, the two-layer shadow — with the hover border and shine. The lift
 * is left off: these tiles crop their widgets at the edge, and lifting a
 * cropped tile makes the crop read as a rendering fault.
 */

const HAIR = "#E8E8ED";

/* ── the palette ─────────────────────────────────────────────
   The source's own light-surface values. The dark-surface slate
   (#8FB4C9) is too pale to read on white, so acceleration takes the
   document's light slate instead.                                 */

const C_SPEED = "#FF6A00";
const C_ACCEL = "#6E7B8B";
const C_JERK = "#D9A21B";
const C_EVENT = "#C6413A";

/* ── the session ─────────────────────────────────────────── */

const N = 120;
/** The high-jerk moment — where the playhead starts and rest state sits. */
const HERO_FRAME = 74;

const EVENTS = [
  { i: 29, t: "Overspeed", z: "Cross-aisle A" },
  { i: 60, t: "Harsh deceleration", z: "Aisle 07 entry" },
  { i: 74, t: "High jerk", z: "Aisle 07" },
  { i: 89, t: "Rapid acceleration", z: "Cross-aisle B" },
];

/** Speed, then its first and second differences. Fully determined by the
    expression, so it is computed once here rather than per render. */
const SERIES = (() => {
  const sp: number[] = [];
  for (let i = 0; i < N; i++) {
    let base = 4.2 + 1.9 * Math.sin(i / 9) + 0.5 * Math.sin(i / 3.1);
    if (i > 26 && i < 34) base += 3.4;
    if (i > 57 && i < 63) base -= 2.6;
    if (i > 86 && i < 92) base += 2.2;
    sp.push(Math.max(0.4, base));
  }
  const ac = sp.map((v, i) => (v - sp[Math.max(0, i - 1)]) * 2.6);
  const jk = ac.map((v, i) => (v - ac[Math.max(0, i - 1)]) * 3.2);
  return { sp, ac, jk };
})();

/** One clock for every card, so the five readings are the same instant. */
function usePlayhead(paused: boolean) {
  const [i, setI] = useState(HERO_FRAME);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((p) => (p + 1) % N), 110);
    return () => clearInterval(id);
  }, [paused]);
  return i;
}

const signed = (v: number) => (v >= 0 ? `+${v.toFixed(1)}` : v.toFixed(1));

/* ── card shell ──────────────────────────────────────────────
   Widget above, then heading and subline pinned to the bottom.  */

/**
 * Widget band heights. These MUST be explicit: the band used to be `flex-1`
 * in an auto-height column, which resolves to the content's own height — so
 * the events ticker (two full copies of the list) set the row height and no
 * amount of shrinking the speed trace moved it. Fixed here, each row's height
 * is the sum below and nothing inside a widget can inflate it.
 */
const WIDGET_TOP = 218;
const WIDGET_BOTTOM = 152;

function Card({
  title,
  body,
  widget,
  children,
  className,
  onEnter,
  onLeave,
}: {
  title: string;
  body: string;
  /** Height of the widget band, in px. */
  widget: number;
  children: React.ReactNode;
  className?: string;
  onEnter?: () => void;
  onLeave?: () => void;
}) {
  return (
    <div
      className={
        "rtssdrv-card relative flex flex-col overflow-hidden p-6 sm:p-7 " +
        (className ?? "")
      }
      style={{ borderRadius: 20 }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="relative shrink-0" style={{ height: widget }}>
        {children}
      </div>
      <div className="mt-6">
        <h3 className="font-rams-heading text-[21px] sm:text-[23px] font-bold tracking-[-0.03em] leading-[1.18] text-carbon">
          {title}
        </h3>
        <p className="mt-2 text-[13.5px] text-graphite/60 leading-[1.55]">
          {body}
        </p>
      </div>
    </div>
  );
}

/** The white UI surfaces that sit on the tile. */
const panel: React.CSSProperties = {
  background: "#FFFFFF",
  borderRadius: 12,
  border: `1px solid ${HAIR}`,
};

/* ── card 1 · speed ──────────────────────────────────────── */

const SPARK_W = 320;
const SPARK_H = 62;
const CAP = 9;

const sparkPoints = SERIES.sp
  .map((v, i) => {
    const x = (i / (N - 1)) * SPARK_W;
    const y = SPARK_H - 3 - (Math.min(v, CAP) / CAP) * (SPARK_H - 12);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  })
  .join(" ");

function SpeedWidget({ i, active }: { i: number; active: boolean }) {
  const x = (i / (N - 1)) * SPARK_W;
  const y = SPARK_H - 3 - (Math.min(SERIES.sp[i], CAP) / CAP) * (SPARK_H - 12);

  return (
    <div className="flex flex-col h-full justify-end">
      {/* the readout, as an instrument */}
      <div
        className="inline-flex items-center gap-3 self-start px-4 py-2.5"
        style={panel}
      >
        <span className="relative flex w-2 h-2 shrink-0">
          {active && (
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ background: C_SPEED }}
              animate={{ scale: [1, 2.6], opacity: [0.55, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <span
            className="relative w-2 h-2 rounded-full"
            style={{ background: C_SPEED }}
          />
        </span>
        <span className="font-rams-heading text-[27px] font-bold tabular-nums tracking-[-0.04em] leading-none text-carbon">
          {SERIES.sp[i].toFixed(1)}
        </span>
        <span className="text-[12px] font-mono text-graphite/45">km/h</span>
        <span
          aria-hidden
          className="w-px h-4 mx-1"
          style={{ background: HAIR }}
        />
        <span className="text-[10px] font-mono font-semibold tracking-[0.14em] uppercase text-graphite/40 whitespace-nowrap">
          SR-2214
        </span>
      </div>

      {/* The trace, cropped by the card. Height is fixed rather than h-auto:
          the block bleeds to ~608px, so an auto height would scale the 62-unit
          viewBox to ~118px and push this row taller than the row below it. */}
      <div className="-mx-6 sm:-mx-7 mt-3 relative">
        <svg
          viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}
          className="block w-full h-[150px]"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="rtssdrv-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C_SPEED} stopOpacity={0.2} />
              <stop offset="100%" stopColor={C_SPEED} stopOpacity={0} />
            </linearGradient>
          </defs>
          <polygon
            points={`0,${SPARK_H} ${sparkPoints} ${SPARK_W},${SPARK_H}`}
            fill="url(#rtssdrv-fill)"
          />
          <polyline
            points={sparkPoints}
            fill="none"
            stroke={C_SPEED}
            strokeWidth={1.6}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1={x}
            y1={0}
            x2={x}
            y2={SPARK_H}
            stroke={C_SPEED}
            strokeOpacity={0.3}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* The playhead dot sits outside the SVG — the trace is stretched
            non-uniformly now, which would turn a <circle> into an ellipse. */}
        <span
          aria-hidden
          className="absolute w-[7px] h-[7px] rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{
            background: C_SPEED,
            left: `${(x / SPARK_W) * 100}%`,
            top: `${(y / SPARK_H) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}

/* ── card 2 · flagged events ─────────────────────────────── */

function EventWidget({ paused, i }: { paused: boolean; i: number }) {
  /** The row the playhead has most recently passed. */
  const current = EVENTS.reduce(
    (acc, e, k) => (i >= e.i ? k : acc),
    EVENTS.length - 1,
  );

  return (
    <div
      className="relative h-full overflow-hidden"
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, #000 74%, transparent 100%)",
        maskImage: "linear-gradient(to bottom, #000 74%, transparent 100%)",
      }}
    >
      <div className={paused ? "flex flex-col gap-2.5" : "rtssdrv-ticker"}>
        {(paused ? [0] : [0, 1]).map((copy) => (
          <div
            key={copy}
            className="flex flex-col gap-2.5 shrink-0 pb-2.5"
            aria-hidden={copy === 1}
          >
            {EVENTS.map((e, k) => {
              const on = k === current;
              return (
                <span
                  key={e.t}
                  className="flex items-center gap-3 px-4 py-3 shrink-0"
                  style={{
                    ...panel,
                    borderColor: on ? "rgba(198,65,58,0.35)" : HAIR,
                  }}
                >
                  <span
                    className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center"
                    style={{
                      background: on ? C_EVENT : "transparent",
                      border: on ? "none" : `1.5px solid ${HAIR}`,
                    }}
                  >
                    {on && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  <span
                    className={
                      "text-[13.5px] tracking-[-0.01em] whitespace-nowrap " +
                      (on
                        ? "font-semibold text-carbon"
                        : "font-medium text-graphite/55")
                    }
                  >
                    {e.t}
                  </span>
                  <span className="ml-auto pl-6 text-[10.5px] font-mono text-graphite/40 whitespace-nowrap">
                    {e.z}
                  </span>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── card 3 · acceleration ───────────────────────────────── */

/* The panel fills the widget band rather than sitting at the bottom of it —
   readout pinned top, instrument pinned bottom, the padding doing the
   spacing. Left to hug its content it floats with dead space above. */

function AccelWidget({ v }: { v: number }) {
  const pct = Math.max(-1, Math.min(1, v / 3.4)) * 50;
  return (
    <div
      className="flex flex-col justify-between h-full px-5 py-5"
      style={panel}
    >
      <p className="flex items-baseline gap-1.5">
        <span
          className="font-rams-heading text-[28px] font-bold tabular-nums tracking-[-0.04em] leading-none"
          style={{ color: C_ACCEL }}
        >
          {signed(v)}
        </span>
        <span className="text-[11px] font-mono text-graphite/40">m/s²</span>
      </p>

      <div>
        <div
          className="relative h-2 rounded-full"
          style={{ background: "#F1F1F4" }}
        >
          <span
            aria-hidden
            className="absolute inset-y-[-5px] left-1/2 w-px"
            style={{ background: HAIR }}
          />
          <motion.span
            className="absolute top-0 bottom-0 rounded-full"
            style={{ background: C_ACCEL }}
            animate={{
              left: `${pct >= 0 ? 50 : 50 + pct}%`,
              width: `${Math.abs(pct)}%`,
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-[9px] font-mono tracking-[0.12em] uppercase text-graphite/35">
            Braking
          </span>
          <span className="text-[9px] font-mono tracking-[0.12em] uppercase text-graphite/35">
            Pulling away
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── card 4 · jerk ───────────────────────────────────────── */

const BARS = 18;

function JerkWidget({ i, v }: { i: number; v: number }) {
  return (
    <div
      className="flex flex-col justify-between h-full px-5 py-5"
      style={panel}
    >
      <p className="flex items-baseline gap-1.5">
        <span
          className="font-rams-heading text-[28px] font-bold tabular-nums tracking-[-0.04em] leading-none"
          style={{ color: C_JERK }}
        >
          {signed(v)}
        </span>
        <span className="text-[11px] font-mono text-graphite/40">m/s³</span>
      </p>

      {/* Bottom-aligned: the bars are magnitudes, so they read as growing
          off the floor of the panel rather than floating in it. */}
      <div className="flex items-end justify-between gap-[3px] h-[54px]">
        {Array.from({ length: BARS }).map((_, b) => {
          const idx = (i - (BARS - 1 - b) + N) % N;
          const mag = Math.min(Math.abs(SERIES.jk[idx]) / 8.5, 1);
          const live = b === BARS - 1;
          return (
            <motion.span
              key={b}
              className="flex-1 rounded-full"
              style={{ background: C_JERK }}
              animate={{
                height: `${6 + mag * 48}px`,
                opacity: live ? 1 : 0.18 + mag * 0.5,
              }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ── card 5 · session context, orbiting ──────────────────── */

const ORBIT = ["MHE 04", "Operator 17", "Aisle 07"];
const R = 66;

function ContextWidget({ paused }: { paused: boolean }) {
  return (
    <div className="relative h-full">
      {[104, 168].map((d) => (
        <span
          key={d}
          aria-hidden
          className="absolute left-1/2 top-1/2 rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{ width: d, height: d, border: `1px solid ${HAIR}` }}
        />
      ))}

      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 w-9 h-9 rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        style={{ background: C_SPEED }}
      >
        <span className="w-2 h-2 rounded-full bg-white" />
      </span>

      <div
        className={
          "absolute left-1/2 top-1/2 w-0 h-0 " + (paused ? "" : "rtssdrv-orbit")
        }
      >
        {ORBIT.map((b, k) => {
          const a = k * 120;
          return (
            <div
              key={b}
              className="absolute"
              style={{ transform: `rotate(${a}deg) translateX(${R}px)` }}
            >
              <div className={paused ? "" : "rtssdrv-orbit-rev"}>
                <div style={{ transform: `rotate(${-a}deg)` }}>
                  <span
                    className="block -translate-x-1/2 -translate-y-1/2 px-3 py-2 text-[11.5px] font-mono text-graphite/70 whitespace-nowrap"
                    style={panel}
                  >
                    {b}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── the section ─────────────────────────────────────────── */

export function RtssDriving() {
  const reduce = useReducedMotion();
  const still = !!reduce;

  /* Nothing moves until the pointer is on a card. The playhead is shared, so
     hovering any card advances it and the five readings stay the same
     instant — only the hovered card's own loop runs. */
  const [hot, setHot] = useState<string | null>(null);
  const i = usePlayhead(still || hot === null);

  const on = (k: string) => ({
    onEnter: () => setHot(k),
    onLeave: () => setHot((p) => (p === k ? null : p)),
  });

  return (
    <Section surface="white" id="driving">
      <style>{`
        /* The card of docs/section-header.md. The border is present at rest so
           the tile reads against the white section and nothing shifts on hover;
           hover just re-tints it and runs the shine. Angle is namespaced. */
        @property --rtssdrv-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .rtssdrv-card {
          isolation: isolate;
          background: #FFFFFF;
          border: 1px solid #E8E8ED;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .rtssdrv-card:hover {
          border-color: rgba(255,106,0,0.45);
        }
        .rtssdrv-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--rtssdrv-shine-angle),
            transparent 0deg,
            transparent 300deg,
            rgba(255,106,0,0.9) 340deg,
            transparent 360deg
          );
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
                  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
          z-index: 1;
        }
        .rtssdrv-card:hover::before {
          opacity: 1;
          animation: rtssdrv-shine 2.4s linear infinite;
        }
        @keyframes rtssdrv-shine {
          to { --rtssdrv-shine-angle: 360deg; }
        }

        @keyframes rtssdrv-ticker-run {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
        .rtssdrv-ticker {
          display: flex;
          flex-direction: column;
          animation: rtssdrv-ticker-run 11s linear infinite;
        }

        @keyframes rtssdrv-spin { to { transform: rotate(360deg); } }
        @keyframes rtssdrv-spin-rev { to { transform: rotate(-360deg); } }
        .rtssdrv-orbit { animation: rtssdrv-spin 30s linear infinite; }
        .rtssdrv-orbit-rev { animation: rtssdrv-spin-rev 30s linear infinite; }

        /* Frozen until the pointer is on the card. The animations are still
           declared so they resume mid-cycle rather than restarting. */
        .rtssdrv-ticker,
        .rtssdrv-orbit,
        .rtssdrv-orbit-rev { animation-play-state: paused; }

        .rtssdrv-card:hover .rtssdrv-ticker,
        .rtssdrv-card:hover .rtssdrv-orbit,
        .rtssdrv-card:hover .rtssdrv-orbit-rev { animation-play-state: running; }

        @media (prefers-reduced-motion: reduce) {
          .rtssdrv-card:hover::before { animation: none; }
          .rtssdrv-ticker,
          .rtssdrv-orbit,
          .rtssdrv-orbit-rev { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Driving safety intelligence"
        top="Speed tells only"
        bottom="Part of the story."
        body="An operator can stay within the speed limit all shift and still handle the machine abruptly. RTSS reads motion in three layers, because each one exposes what the previous one hides."
        size="compact"
        width="wide"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 max-w-[1180px] mx-auto"
      >
        <Card
          className="sm:col-span-2 lg:col-span-3"
          widget={WIDGET_TOP}
          title="Speed"
          body="How fast the machine is moving."
          {...on("speed")}
        >
          <SpeedWidget i={i} active={hot === "speed" && !still} />
        </Card>

        <Card
          className="sm:col-span-2 lg:col-span-3"
          widget={WIDGET_TOP}
          title="Flagged this session"
          body="Four events on one session, each with the zone it happened in."
          {...on("events")}
        >
          <EventWidget i={i} paused={still} />
        </Card>

        <Card
          className="lg:col-span-2"
          widget={WIDGET_BOTTOM}
          title="Acceleration"
          body="How quickly that speed is changing — rapid acceleration, hard deceleration, harsh braking."
          {...on("accel")}
        >
          <AccelWidget v={SERIES.ac[i]} />
        </Card>

        <Card
          className="lg:col-span-2"
          widget={WIDGET_BOTTOM}
          title="Jerk"
          body="How abruptly acceleration itself changes. Abrupt manoeuvring that speed alone cannot show."
          {...on("jerk")}
        >
          <JerkWidget i={i} v={SERIES.jk[i]} />
        </Card>

        <Card
          className="sm:col-span-2 lg:col-span-2"
          widget={WIDGET_BOTTOM}
          title="Session context"
          body="Every reading carries the machine, the operator and the zone."
          {...on("context")}
        >
          <ContextWidget paused={still} />
        </Card>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-16 sm:mt-20 text-center font-rams-heading text-[22px] sm:text-[28px] lg:text-[34px] font-bold tracking-[-0.028em] leading-[1.2] text-carbon max-w-[46ch] mx-auto"
      >
        Speed shows how fast. Acceleration shows how quickly it changes. Jerk
        shows how <span className="text-signal-orange">abruptly</span>.
      </motion.p>
    </Section>
  );
}
