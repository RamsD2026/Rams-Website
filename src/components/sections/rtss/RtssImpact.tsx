"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ChevronRight,
  CircleCheck,
  ClipboardList,
  MapPin,
  Radar,
  ShieldCheck,
  Wrench,
  Zap,
} from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import {
  TWIN_H,
  TWIN_W,
  TwinEnv,
} from "@/components/sections/rtss/rtss-shared";

/**
 * Impact intelligence.
 *
 * Four blocks, as the source document has them: what a sensor cannot know on
 * its own, where the impact happened, the seconds either side of it, and the
 * route from impact to verified closure.
 *
 * The twin here is the environment only — no agents, no trails, exactly as the
 * document configures it. It is a floor plan with a marker on it, not an
 * animation: the marker moves when you pick a different surrounding.
 *
 * Every caveat in this section is the document's own and stays put. The
 * categories are candidates for review, and the page has to keep saying so.
 */

const HAIR = "rgba(255,255,255,0.10)";
const RED = "#FF6C6C";

/* ── where it happened ───────────────────────────────────── */

type CtxKey = "rack" | "floor" | "infra" | "open";

/** The mapped feature the classification is actually based on. `null` is the
    open-travel case: the search runs and finds nothing within range, which is
    itself the finding. */
type Hi =
  | { kind: "rects"; rects: [number, number, number, number][] }
  | { kind: "line"; x: number; y1: number; y2: number }
  | null;

const CONTEXTS: {
  k: CtxKey;
  near: string;
  what: string;
  p: [number, number];
  label: string;
  hi: Hi;
  pre: string;
  em: string;
  br: boolean;
  body: string;
}[] = [
  {
    k: "rack",
    near: "Near",
    what: "Rack area",
    p: [505, 150],
    label: "IMPACT · RACK UPRIGHT",
    /* the two rack rows either side of the aisle it happened in */
    hi: {
      kind: "rects",
      rects: [
        [448, 70, 42, 280],
        [520, 70, 42, 280],
      ],
    },
    pre: "Rack-area impact —",
    em: "inspection recommended",
    br: true,
    body: "Detected close to a mapped rack row, upright or aisle end. RTSS does not confirm damage — it flags a rack-area event where a structured inspection is the appropriate next step.",
  },
  {
    k: "floor",
    near: "Near",
    what: "Expansion joint",
    p: [596, 250],
    label: "IMPACT · EXPANSION JOINT",
    hi: { kind: "line", x: 596, y1: 70, y2: 350 },
    pre: "Floor-related shock",
    em: "candidate",
    br: false,
    body: "The shock coincides with a mapped expansion joint or floor transition. Repeated shocks at the same joint point toward floor maintenance rather than driving behaviour — but the pattern, not the single event, is what makes that case.",
  },
  {
    k: "infra",
    near: "Near",
    what: "Wall / column",
    p: [127, 203],
    label: "IMPACT · COLUMN",
    hi: { kind: "rects", rects: [[120, 196, 14, 14]] },
    pre: "Infrastructure-proximity",
    em: "impact",
    br: false,
    body: "Detected near a mapped wall, column, barrier or item of fixed equipment. Worth reviewing alongside protection, clearance and traffic management in that zone.",
  },
  {
    k: "open",
    near: "Away from",
    what: "Fixed infrastructure",
    p: [300, 200],
    label: "IMPACT · OPEN TRAVEL",
    hi: null,
    pre: "Vehicle / load / operating event —",
    em: "review required",
    br: true,
    body: "Away from mapped fixed infrastructure. The cause more likely sits with the load, the machine or the manoeuvre — which is when the movement before and after the event, and the footage, matter most.",
  },
];

/* ── the seconds around it ───────────────────────────────── */

const AROUND: {
  when: string;
  at: string;
  mid?: boolean;
  facts: [string, string][];
}[] = [
  {
    when: "Before",
    at: "−8s",
    facts: [
      ["Route", "Aisle 07, inbound"],
      ["Speed", "5.8 km/h"],
      ["Acceleration", "Decelerating"],
      ["Turning", "Entering turn"],
      ["Load state", "Loaded"],
    ],
  },
  {
    when: "Event",
    at: "00:00",
    mid: true,
    facts: [
      ["Detected", "Impact"],
      ["Severity", "High"],
      ["Jerk", "High"],
      ["Location", "Aisle 07"],
      ["Environment", "Rack area"],
    ],
  },
  {
    when: "After",
    at: "+8s",
    facts: [
      ["Movement", "Sudden stop"],
      ["Then", "Reverse, 2.1 m"],
      ["Direction", "Changed"],
      ["Speed", "Resumed 3.2 km/h"],
      ["Evidence", "Attached"],
    ],
  },
];

/* ── impact to closure ───────────────────────────────────── */

/**
 * The chain, drawn as a flow.
 *
 * The source sets this as a ruled strip (`.pipe`), but a boxed row of cells
 * says "seven things" where the content says "seven steps in order". Nodes
 * joined by arrows carry the direction the strip never did, and dropping the
 * container takes the corner radius question with it.
 *
 * `.ps.done b` is kept exactly: the only thing marking RTSS's first three
 * steps is that they are orange. The connector into each step inherits that,
 * so the orange run stops at the handover to IRDS.
 *
 * It scrolls rather than wraps — a sequence broken across two rows reads as
 * two sequences.
 */
const PIPE = [
  { n: "01", t: "MHE impact", done: true, Icon: Zap },
  { n: "02", t: "RTSS identifies rack-area event", done: true, Icon: Radar },
  { n: "03", t: "Exact location in the twin", done: true, Icon: MapPin },
  { n: "04", t: "IRDS inspection", done: false, Icon: ClipboardList },
  { n: "05", t: "Rack condition verified", done: false, Icon: ShieldCheck },
  { n: "06", t: "Corrective action", done: false, Icon: Wrench },
  { n: "07", t: "Verified closure", done: false, Icon: CircleCheck },
];

function Pipe() {
  return (
    <div className="max-w-[1080px] mx-auto overflow-x-auto">
      <ol className="flex flex-nowrap items-start min-w-[900px]">
        {PIPE.map((st, i) => (
          <li key={st.n} className="contents">
            {i > 0 && (
              <span
                aria-hidden
                className="flex items-center shrink-0 pt-[19px] px-1"
              >
                <span
                  className="h-px w-5"
                  style={{
                    background: st.done ? "rgba(255,106,0,0.45)" : HAIR,
                  }}
                />
                <ChevronRight
                  className="w-3 h-3 -ml-[3px]"
                  strokeWidth={2}
                  style={{
                    color: st.done
                      ? "rgba(255,106,0,0.75)"
                      : "rgba(255,255,255,0.22)",
                  }}
                />
              </span>
            )}

            <span
              className="flex flex-col items-center text-center px-2"
              style={{ flex: "1 1 120px", minWidth: 0 }}
            >
              <span
                className="flex items-center justify-center w-10 h-10 rounded-full shrink-0"
                style={{
                  background: st.done
                    ? "rgba(255,106,0,0.10)"
                    : "rgba(255,255,255,0.035)",
                  border: `1px solid ${
                    st.done ? "rgba(255,106,0,0.28)" : HAIR
                  }`,
                }}
              >
                <st.Icon
                  className={
                    "w-[17px] h-[17px] " +
                    (st.done ? "text-signal-orange" : "text-white/35")
                  }
                  strokeWidth={1.7}
                  aria-hidden
                />
              </span>

              <span className="mt-3 text-[9.5px] font-mono tracking-[0.11em] uppercase text-white/35">
                {st.n}
              </span>
              <span
                className={
                  "mt-1.5 text-[13px] leading-[1.35] tracking-[-0.01em] " +
                  (st.done ? "text-signal-orange" : "text-white/80")
                }
              >
                {st.t}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ── pieces ──────────────────────────────────────────────── */

/**
 * The three parts of this section, as tabs.
 *
 * Stacked, each part opened with its own heading and read as a section in its
 * own right, competing with the one above it. As tabs they are visibly three
 * views of one subject: one heading level, one rhythm, one frame.
 *
 * Each panel keeps its own state, so switching away and back resets the panel
 * to its opening view rather than leaving it mid-interaction.
 */

/* The page's own vocabulary rather than words invented here. "Environment" is
   the document's field name for what surrounded a shock — it is the label on
   the event record in the next panel — and it is precise where "Context" was
   not: the whole section is about context, so it could not name one third of
   it. Evidence and Action come straight off the chain the hero states. */
const TABS = [
  { n: "01", label: "Environment" },
  { n: "02", label: "Evidence" },
  { n: "03", label: "Action" },
];

/**
 * The line that opens a panel.
 *
 * Set as copy, not as a heading: the section already has one, and a 34px
 * display line inside a tab panel competed with it. It stays an <h3> so the
 * document outline is intact, but it reads at body weight.
 */
function PanelHead({ title, lede }: { title: React.ReactNode; lede?: string }) {
  return (
    <div className="text-center max-w-[980px] mx-auto mb-10 sm:mb-12">
      <h3 className="text-[17px] sm:text-[19px] font-medium text-white/85 leading-[1.55] tracking-[-0.01em]">
        {title}
      </h3>
      {lede && (
        <p className="mt-3 text-[14.5px] sm:text-[15px] text-white/50 leading-[1.65]">
          {lede}
        </p>
      )}
    </div>
  );
}

/**
 * An evidence clip.
 *
 * ── MEDIA ────────────────────────────────────────────────────────────
 * CLIP_SRC is a placeholder. There is no camera footage in /public — this
 * is the same recording the heroes use, which is Atlassian's "CSD-24696
 * Agents In Jira". Drop three real clips in and give each card its own
 * src; nothing else here changes.
 *
 * The three cards share one file and start it at different offsets, so
 * Before, Event and After read as three moments rather than one image
 * repeated. Real footage makes `at` per-clip and the offset redundant.
 * ─────────────────────────────────────────────────────────────────────
 */
/** Seconds into the placeholder each card starts at. */
const CLIP_AT = [0, 4, 8];

const CLIP_SRC = "/Product/irds/hero.mp4";

function Clip({ at }: { at: number }) {
  const ref = useRef<HTMLVideoElement>(null);

  /* React sets `muted` as a property rather than a reliable attribute, so a
     browser can decide the element is unmuted and refuse to autoplay it. */
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const start = () => {
      try {
        if (Number.isFinite(v.duration) && v.duration > at) v.currentTime = at;
      } catch {
        /* seeking before metadata is ready — the loop will land it anyway */
      }
      v.play().catch(() => {});
    };
    start();
    v.addEventListener("loadeddata", start);
    return () => v.removeEventListener("loadeddata", start);
  }, [at]);

  return (
    <div
      className="relative overflow-hidden"
      style={{ height: 226, background: "#0A0C0E" }}
    >
      <video
        ref={ref}
        src={CLIP_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}

const AMBER = "#FFBE47";
const SLATE = "#8FB4C9";

/** The mapped feature the classification rests on, lit up. */
function Highlight({ hi }: { hi: Hi }) {
  if (!hi) return null;

  if (hi.kind === "line") {
    return (
      <motion.line
        key="joint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.25 }}
        x1={hi.x}
        y1={hi.y1}
        x2={hi.x}
        y2={hi.y2}
        stroke={AMBER}
        strokeWidth={3}
        strokeLinecap="round"
      />
    );
  }

  return (
    <g>
      {hi.rects.map(([x, y, w, h], i) => (
        <motion.rect
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.25 + i * 0.08 }}
          x={x}
          y={y}
          width={w}
          height={h}
          rx={2}
          fill="rgba(255,190,71,0.12)"
          stroke={AMBER}
          strokeWidth={1.5}
        />
      ))}
    </g>
  );
}

/**
 * The floor plan, showing the reasoning rather than just the coordinate.
 *
 * The old version dropped a red dot on an evenly-drawn plan, so nothing said
 * why a shock beside a rack is classified differently from one over a joint.
 * Now the point is searched: a ring sweeps out from the impact, and whatever
 * mapped feature it reaches lights up — the rack rows either side of the
 * aisle, the expansion joint, the column. Open travel is the case where the
 * sweep finds nothing, and that absence is the finding, so the ring goes
 * slate and stays empty.
 *
 * The marker springs between positions rather than cutting, so switching
 * surroundings reads as one impact being re-examined, not four separate ones.
 */
function ContextTwin({
  ctx,
  still,
}: {
  ctx: (typeof CONTEXTS)[number];
  still: boolean;
}) {
  const [px, py] = ctx.p;
  const found = ctx.hi !== null;
  const ring = found ? AMBER : SLATE;

  const spring = { type: "spring" as const, stiffness: 170, damping: 22 };

  return (
    <svg
      viewBox={`0 0 ${TWIN_W} ${TWIN_H}`}
      className="block w-full h-auto"
      role="img"
      aria-label={`Digital Twin showing where an impact occurred and what surrounded it: ${ctx.near.toLowerCase()} ${ctx.what.toLowerCase()}`}
    >
      <TwinEnv />

      <AnimatePresence mode="wait">
        <g key={ctx.k}>
          <Highlight hi={ctx.hi} />
        </g>
      </AnimatePresence>

      {/* the search radius, sweeping */}
      <g
        className={still ? undefined : "rtssimp-scan"}
        style={{ transformOrigin: `${px}px ${py}px` }}
      >
        <circle
          cx={px}
          cy={py}
          r={54}
          fill="none"
          stroke={ring}
          strokeOpacity={0.55}
          strokeWidth={1.2}
          strokeDasharray="7 9"
        />
      </g>
      <circle
        cx={px}
        cy={py}
        r={54}
        fill={found ? "rgba(255,190,71,0.05)" : "rgba(143,180,201,0.04)"}
      />

      {/* the impact itself */}
      {!still && (
        <motion.circle
          cx={px}
          cy={py}
          fill="none"
          stroke={RED}
          strokeWidth={1.5}
          animate={{ r: [11, 40], opacity: [0.7, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <motion.circle
        animate={{ cx: px, cy: py }}
        transition={spring}
        r={26}
        fill="rgba(255,108,108,0.13)"
      />
      <motion.circle
        animate={{ cx: px, cy: py }}
        transition={spring}
        r={11}
        fill="none"
        stroke={RED}
        strokeWidth={2}
      />
      <motion.circle
        animate={{ cx: px, cy: py }}
        transition={spring}
        r={3.5}
        fill={RED}
      />
    </svg>
  );
}

/* One surrounding is tested, resolves, then the next picks up — the cadence
   WexHero uses for its task queue. */
const RUN_MS = 3800;
const DONE_MS = 900;

type RunPhase = "running" | "done";

/**
 * One shock, tested against four surroundings.
 *
 * Built on the solution-hero pattern (see WexHero): a product board with a
 * live queue on the left and the map responding on the right. The queue is
 * what makes the point — the same impact runs through each surrounding in
 * turn and resolves to a different classification each time, which a static
 * plan with a dot on it could never show.
 */
function ContextStage({ still }: { still: boolean }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [done, setDone] = useState<number[]>([]);
  const [phase, setPhase] = useState<RunPhase>("running");

  useEffect(() => {
    if (still) return;
    const toDone = setTimeout(() => setPhase("done"), RUN_MS);
    const toNext = setTimeout(() => {
      const next = (activeIdx + 1) % CONTEXTS.length;
      setDone((d) => (next === 0 ? [] : [...d, activeIdx]));
      setActiveIdx(next);
      setPhase("running");
    }, RUN_MS + DONE_MS);
    return () => {
      clearTimeout(toDone);
      clearTimeout(toNext);
    };
  }, [activeIdx, still]);

  const ctx = CONTEXTS[activeIdx];

  return (
    <div className="flex flex-col">
      {/* board header */}
      <div className="flex items-center justify-between gap-4 flex-wrap px-5 sm:px-7 pt-6 pb-4">
        <div className="min-w-0">
          <p className="text-[9px] sm:text-[10px] font-mono font-bold tracking-[0.22em] uppercase text-white/45">
            RTSS · Impact classification
          </p>
          <p className="mt-1.5 text-[15px] sm:text-[18px] font-semibold text-white tracking-[-0.01em]">
            One shock, four surroundings
          </p>
        </div>
        <span
          className="inline-flex items-center gap-1.5 text-[9.5px] font-mono font-bold tracking-[0.14em] px-2.5 py-1 rounded-full shrink-0"
          style={{ background: "rgba(43,203,116,0.13)", color: "#54DE91" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#2BCB74" }}
          />
          LIVE
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap px-5 sm:px-7 pb-5">
        <span
          className="inline-flex items-baseline gap-2 px-3 py-1.5 rounded-full"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${HAIR}`,
          }}
        >
          <span className="text-[9px] font-mono font-bold tracking-[0.16em] uppercase text-white/45">
            Surroundings
          </span>
          <span className="text-[13px] sm:text-[14px] font-bold tabular-nums text-white">
            4
          </span>
        </span>
        <span
          className="inline-flex items-baseline gap-2 px-3 py-1.5 rounded-full"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${HAIR}`,
          }}
        >
          <span className="text-[9px] font-mono font-bold tracking-[0.16em] uppercase text-white/45">
            Tested
          </span>
          <span className="text-[13px] sm:text-[14px] font-bold tabular-nums text-signal-orange">
            {done.length}/4
          </span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[0.72fr_1.28fr] gap-4 sm:gap-5 mx-4 sm:mx-7 mb-6 sm:mb-7">
        {/* the queue */}
        <div
          className="relative rounded-xl overflow-hidden flex flex-col"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
            border: `1px solid ${HAIR}`,
          }}
        >
          <div
            className="flex items-center justify-between px-4 pt-4 pb-3"
            style={{ borderBottom: `1px solid ${HAIR}` }}
          >
            <span className="text-[9px] font-mono font-bold tracking-[0.22em] uppercase text-white/45">
              What surrounded it
            </span>
            <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-white/55">
              <span className="w-1.5 h-1.5 rounded-full bg-signal-orange animate-pulse" />
              Testing
            </span>
          </div>

          <div className="flex-1 flex flex-col gap-2 p-3">
            {CONTEXTS.map((c, i) => {
              const isDone = done.includes(i);
              const isActive = i === activeIdx;
              const isComplete = isActive && phase === "done";
              const showDone = isDone || isComplete;

              return (
                <div
                  key={c.k}
                  className="rounded-[10px] px-3 py-2.5 transition-colors duration-500"
                  style={{
                    background: isActive
                      ? "linear-gradient(180deg, rgba(255,106,0,0.10), rgba(255,106,0,0.03))"
                      : "rgba(255,255,255,0.02)",
                    border: isActive
                      ? "1px solid rgba(255,106,0,0.42)"
                      : showDone
                        ? "1px solid rgba(43,203,116,0.22)"
                        : `1px solid ${HAIR}`,
                    boxShadow: isActive
                      ? "0 0 24px -10px rgba(255,106,0,0.55)"
                      : undefined,
                    opacity: isDone ? 0.55 : 1,
                  }}
                >
                  <span className="flex items-center gap-1.5 min-w-0">
                    {showDone && (
                      <span
                        className="flex items-center justify-center w-3.5 h-3.5 rounded-full text-[8px] font-bold shrink-0"
                        style={{
                          background: "rgba(43,203,116,0.13)",
                          color: "#54DE91",
                        }}
                      >
                        ✓
                      </span>
                    )}
                    <span className="text-[11.5px] sm:text-[12.5px] font-semibold text-white truncate">
                      {c.near} {c.what}
                    </span>
                  </span>

                  <p className="mt-1.5 text-[10.5px] leading-[1.5] text-white/50">
                    {c.pre}{" "}
                    <span className={isActive ? "text-signal-orange" : ""}>
                      {c.em}
                    </span>
                  </p>

                  {isActive && !still && (
                    <div
                      className="mt-2 h-[3px] rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.08)" }}
                    >
                      <motion.div
                        key={`bar-${activeIdx}-${phase}`}
                        className="h-full rounded-full bg-signal-orange"
                        initial={{ width: phase === "running" ? "0%" : "100%" }}
                        animate={{ width: "100%" }}
                        transition={{
                          duration: phase === "running" ? RUN_MS / 1000 : 0,
                          ease: "linear",
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* the map */}
        <div
          className="relative rounded-xl overflow-hidden"
          style={{ background: "#0A0C0E", border: `1px solid ${HAIR}` }}
        >
          <ContextTwin ctx={ctx} still={still} />
        </div>
      </div>
    </div>
  );
}

export function RtssImpact() {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState(0);

  return (
    <Section surface="darkMid" id="impact">
      <style>{`
        @keyframes rtssimp-sweep { to { transform: rotate(360deg); } }
        .rtssimp-scan { animation: rtssimp-sweep 9s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .rtssimp-scan { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Impact intelligence"
        top="Not every shock"
        bottom="Means the same thing."
        body="An impact sensor detects a physical shock. RTSS adds everything the sensor cannot know on its own."
        tone="dark"
        size="compact"
        width="wide"
      />

      {/* ── the three parts, as tabs ───────────────────── */}
      <div>
        <div className="flex justify-center">
          <div
            className="inline-flex flex-wrap justify-center gap-1 p-1"
            style={{
              borderRadius: 999,
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${HAIR}`,
            }}
            role="tablist"
            aria-label="Impact intelligence"
          >
            {TABS.map((t, i) => {
              const on = i === tab;
              return (
                <button
                  key={t.n}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setTab(i)}
                  className={
                    "inline-flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-full transition-colors duration-200 " +
                    (on ? "text-white" : "text-white/50 hover:text-white/80")
                  }
                  style={{ background: on ? "#FF6A00" : "transparent" }}
                >
                  <span
                    className={
                      "text-[10px] font-mono font-bold tracking-[0.14em] " +
                      (on ? "text-white/70" : "text-white/30")
                    }
                  >
                    {t.n}
                  </span>
                  <span className="text-[13px] sm:text-[13.5px] font-semibold tracking-[-0.01em] whitespace-nowrap">
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-12 sm:mt-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {tab === 0 && (
                <>
                  <PanelHead
                    title="Know where the impact happened before deciding what it means."
                    lede="The same shock means different things beside a rack, over an expansion joint, or in open travel."
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.12 }}
                    transition={{ duration: 0.85, ease: EASE }}
                    className="overflow-hidden"
                    style={{
                      borderRadius: 16,
                      background: "#0E0E11",
                      border: `1px solid ${HAIR}`,
                      boxShadow: "0 60px 120px -50px rgba(0,0,0,0.9)",
                    }}
                  >
                    <ContextStage still={!!reduce} />
                  </motion.div>
                </>
              )}

              {tab === 1 && (
                <>
                  <PanelHead
                    title="The seconds around the event matter."
                    lede="Where cameras are deployed, footage stays attached to the movement record — not every event has it."
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {AROUND.map((b, i) => (
                      <motion.div
                        key={b.when}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{
                          duration: 0.65,
                          delay: i * 0.08,
                          ease: EASE,
                        }}
                        className="overflow-hidden"
                        style={{
                          borderRadius: 14,
                          background: "#0E0E11",
                          border: `1px solid ${b.mid ? "rgba(255,108,108,0.28)" : HAIR}`,
                        }}
                      >
                        <div
                          className="flex items-center justify-between gap-3 px-4 py-3"
                          style={{ borderBottom: `1px solid ${HAIR}` }}
                        >
                          <span
                            className={
                              "text-[10px] font-mono font-bold tracking-[0.16em] uppercase " +
                              (b.mid ? "text-signal-orange" : "text-white/45")
                            }
                          >
                            {b.when}
                          </span>
                          <span className="text-[10px] font-mono tabular-nums text-white/35">
                            {b.at}
                          </span>
                        </div>

                        <Clip at={CLIP_AT[i]} />

                        <ul
                          className="flex flex-col"
                          style={{ borderTop: `1px solid ${HAIR}` }}
                        >
                          {b.facts.map(([k, v], fi) => (
                            <li
                              key={k}
                              className="flex items-baseline justify-between gap-4 px-4 py-2.5"
                              style={{
                                borderTop:
                                  fi > 0 ? `1px solid ${HAIR}` : undefined,
                              }}
                            >
                              <span className="text-[11px] text-white/40 shrink-0">
                                {k}
                              </span>
                              <span className="text-[11.5px] font-mono text-white text-right">
                                {v}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {tab === 2 && (
                <>
                  <PanelHead
                    title="From impact to inspection, and from inspection to verified closure."
                    lede="RTSS helps identify rack-area events that require inspection. The structured IRDS inspection is what confirms rack condition."
                  />
                  <Pipe />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
