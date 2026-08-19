"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const EASE = [0.22, 1, 0.36, 1] as const;

export function WexHero() {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(80% 100% at 50% 0%, #1D1D1F 0%, #0E0E0F 55%, #08080A 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[720px]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 20%, rgba(255,106,0,0.22), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
        }}
      />

      <div className="relative rams-container pt-40 sm:pt-48 lg:pt-56 pb-24 sm:pb-32 lg:pb-40">
        <div className="max-w-[1080px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
            <span className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-white/70">
              Warehouse Execution
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
            className="mt-8 text-[56px] sm:text-[84px] lg:text-[112px] font-bold leading-[0.98] tracking-[-0.045em]"
            style={{ letterSpacing: "-0.045em" }}
          >
            <span className="block text-white">Turn plans into</span>
            <span
              className="block"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.35) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              real-time execution.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[16px] text-white/60 leading-[1.55] max-w-[1120px] mx-auto"
          >
            RAMS connects tasks, MHEs, operators, pallets and warehouse zones into
            one execution layer — helping teams assign work faster, reduce
            unnecessary movement, manage exceptions and improve shift productivity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28, ease: EASE }}
            className="mt-8 flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap"
          >
            {[
              "Task orchestration",
              "Real-time assignment",
              "Execution intelligence",
            ].map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur text-[10.5px] font-mono font-semibold tracking-[0.22em] uppercase text-white/70"
              >
                <span
                  className="w-1 h-1 rounded-full bg-signal-orange"
                  aria-hidden
                />
                {label}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease: EASE }}
            className="mt-10 flex items-center justify-center gap-3 flex-wrap"
          >
            <Link
              href="/book-a-demo"
              className="inline-flex items-center gap-2 bg-white text-carbon text-[14px] font-semibold px-6 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-px hover:bg-white/90"
            >
              Optimise My Operations
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="#capabilities"
              className="inline-flex items-center gap-2 text-white text-[14px] font-semibold px-6 py-3.5 rounded-full border border-white/15 transition-all duration-200 hover:bg-white/[0.06]"
            >
              Explore Capabilities
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
          className="relative mt-20 sm:mt-24 mx-auto"
          style={{
            maxWidth: 1240,
            borderRadius: 28,
            border: "1px solid rgba(255,255,255,0.08)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
            padding: 14,
            boxShadow:
              "0 60px 140px -40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.02) inset, 0 20px 60px -20px rgba(255,106,0,0.15)",
          }}
        >
          <div
            className="relative rounded-[18px] overflow-hidden min-h-[640px] sm:min-h-0 sm:aspect-[16/10]"
            style={{
              background: "linear-gradient(180deg, #0A0F14 0%, #06090C 100%)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              borderRight: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <ExecutionBoardView />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Task queue data ─────────────────────────────────────── */

type Tone = "amber" | "blue" | "green" | "red";

const TONE_STYLES: Record<Tone, { bg: string; color: string }> = {
  amber: { bg: "rgba(255,176,32,0.13)", color: "#FFBE47" },
  blue: { bg: "rgba(70,167,255,0.13)", color: "#77BDFF" },
  green: { bg: "rgba(43,203,116,0.13)", color: "#54DE91" },
  red: { bg: "rgba(255,77,77,0.13)", color: "#FF7777" },
};

/* Each task carries the aisle route its MHE drives, in map coordinates */
const TASKS: {
  id: string;
  title: string;
  path: string;
  state: string;
  tone: Tone;
  mhe: string;
  operator: string;
  route: {
    d: string;
    x: number[];
    y: number[];
    times: number[];
    dx: number;
    dy: number;
  };
}[] = [
  {
    id: "ATOS-324",
    title: "Move PLT-2048",
    path: "A-03 → Dispatch Zone",
    state: "Priority",
    tone: "amber",
    mhe: "MHE-07",
    operator: "R. Kulkarni",
    route: {
      d: "M80,59 L169,59 L169,123 L244,123 L244,185",
      x: [80, 169, 169, 244, 244],
      y: [59, 59, 123, 123, 185],
      times: [0, 0.3, 0.55, 0.8, 1],
      dx: 10,
      dy: -38,
    },
  },
  {
    id: "ATOS-325",
    title: "Replenish B-12",
    path: "Reserve → Picking Face",
    state: "Queued",
    tone: "blue",
    mhe: "MHE-03",
    operator: "S. Deshmukh",
    route: {
      d: "M60,83 L169,83 L169,110 L240,110 L240,70",
      x: [60, 169, 169, 240, 240],
      y: [83, 83, 110, 110, 70],
      times: [0, 0.34, 0.5, 0.76, 1],
      dx: 10,
      dy: -38,
    },
  },
  {
    id: "ATOS-326",
    title: "Pick PLT-6110",
    path: "Rack C-08 → Staging",
    state: "Assigned",
    tone: "green",
    mhe: "MHE-11",
    operator: "A. Pawar",
    route: {
      d: "M70,167 L151,167 L151,123 L230,123 L230,161",
      x: [70, 151, 151, 230, 230],
      y: [167, 167, 123, 123, 161],
      times: [0, 0.3, 0.5, 0.8, 1],
      dx: 10,
      dy: -38,
    },
  },
  {
    id: "ATOS-327",
    title: "Exception Check",
    path: "Zone D · Location mismatch",
    state: "Action",
    tone: "red",
    mhe: "MHE-07",
    operator: "R. Kulkarni",
    route: {
      d: "M240,70 L240,123 L280,123 L280,208",
      x: [240, 240, 280, 280],
      y: [70, 123, 123, 208],
      times: [0, 0.36, 0.54, 1],
      dx: -88,
      dy: -38,
    },
  },
];

/* One task runs, completes, then the next picks up */
const RUN_MS = 4600;
const DONE_MS = 1200;

type RunPhase = "running" | "done";

function ExecutionBoardView() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [done, setDone] = useState<number[]>([]);
  const [phase, setPhase] = useState<RunPhase>("running");

  useEffect(() => {
    const toDone = setTimeout(() => setPhase("done"), RUN_MS);
    const toNext = setTimeout(() => {
      const next = (activeIdx + 1) % TASKS.length;
      setDone((d) => (next === 0 ? [] : [...d, activeIdx]));
      setActiveIdx(next);
      setPhase("running");
    }, RUN_MS + DONE_MS);

    return () => {
      clearTimeout(toDone);
      clearTimeout(toNext);
    };
  }, [activeIdx]);

  const KPIS = [
    { label: "On Plan", value: "86%", tone: "orange" as const },
    { label: "Completed", value: `${done.length}/4`, tone: "white" as const },
    { label: "Exceptions", value: "3", tone: "white" as const },
  ];

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex items-center justify-between gap-4 flex-wrap px-5 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6">
        <div className="min-w-0">
          <div className="text-[9px] sm:text-[10px] font-mono font-bold tracking-[0.22em] uppercase text-white/45">
            ATOS · Pune DC
          </div>
          <div className="mt-1.5 text-[15px] sm:text-[18px] font-semibold text-white tracking-[-0.01em] truncate">
            Shift A — execution live
          </div>
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

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap px-5 sm:px-8 pb-5 sm:pb-6">
        {KPIS.map((k) => (
          <span
            key={k.label}
            className="inline-flex items-baseline gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span className="text-[9px] font-mono font-bold tracking-[0.16em] uppercase text-white/45">
              {k.label}
            </span>
            <span
              className={`text-[13px] sm:text-[14px] font-bold tabular-nums tracking-[-0.01em] ${
                k.tone === "orange" ? "text-signal-orange" : "text-white"
              }`}
            >
              {k.value}
            </span>
          </span>
        ))}
      </div>

      <div className="relative flex-1 grid grid-cols-1 sm:grid-cols-[0.66fr_1.34fr] gap-4 sm:gap-5 mx-4 sm:mx-8 mb-6 sm:mb-8 min-h-0">
        <div
          className="relative rounded-xl overflow-hidden flex flex-col min-h-[280px] sm:min-h-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <TaskQueue activeIdx={activeIdx} done={done} phase={phase} />
        </div>

        <div
          className="relative rounded-xl overflow-hidden min-h-[280px] sm:min-h-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <ExecutionMap activeIdx={activeIdx} done={done} phase={phase} />
        </div>
      </div>
    </div>
  );
}

function TaskQueue({
  activeIdx,
  done,
  phase,
}: {
  activeIdx: number;
  done: number[];
  phase: RunPhase;
}) {
  const active = TASKS[activeIdx];

  return (
    <>
      <div className="flex items-center justify-between px-4 sm:px-5 pt-4 pb-3 border-b border-white/[0.06]">
        <div className="text-[9px] font-mono font-bold tracking-[0.22em] uppercase text-white/45">
          Live Task Queue
        </div>
        <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-white/55">
          <span className="w-1.5 h-1.5 rounded-full bg-signal-orange animate-pulse" />
          Orchestrating
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-2 p-3 sm:p-3.5 min-h-0">
        {TASKS.map((t, i) => {
          const isDone = done.includes(i);
          const isActive = i === activeIdx;
          const isComplete = isActive && phase === "done";
          const tone = TONE_STYLES[t.tone];
          const greenTone = TONE_STYLES.green;

          const showDone = isDone || isComplete;
          const pill = showDone
            ? { label: "Done", ...greenTone }
            : isActive
              ? { label: "Running", bg: "rgba(255,106,0,0.14)", color: "#FF9B4D" }
              : { label: t.state, ...tone };

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 + i * 0.12, ease: EASE }}
              className="rounded-[10px] px-3 py-2.5 transition-colors duration-500"
              style={{
                background: isActive
                  ? "linear-gradient(180deg, rgba(255,106,0,0.10), rgba(255,106,0,0.03))"
                  : "rgba(255,255,255,0.02)",
                border: isActive
                  ? "1px solid rgba(255,106,0,0.42)"
                  : showDone
                    ? "1px solid rgba(43,203,116,0.22)"
                    : "1px solid rgba(255,255,255,0.07)",
                boxShadow: isActive
                  ? "0 0 24px -10px rgba(255,106,0,0.55)"
                  : undefined,
                opacity: isDone ? 0.55 : 1,
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 min-w-0">
                  {showDone && (
                    <span
                      className="flex items-center justify-center w-3.5 h-3.5 rounded-full text-[8px] font-bold shrink-0"
                      style={{ background: greenTone.bg, color: greenTone.color }}
                    >
                      ✓
                    </span>
                  )}
                  <span className="text-[11.5px] sm:text-[12.5px] font-semibold text-white truncate">
                    {t.title}
                  </span>
                </span>
                <span
                  className="text-[8.5px] font-mono font-bold tracking-[0.12em] uppercase px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: pill.bg, color: pill.color }}
                >
                  {pill.label}
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <span className="text-[10px] sm:text-[10.5px] text-white/50 truncate">
                  {t.path}
                </span>
                <span className="text-[9px] font-mono text-white/35 tabular-nums shrink-0">
                  {t.id}
                </span>
              </div>

              {isActive && (
                <div
                  className="mt-2 h-[3px] rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <motion.div
                    key={`bar-${activeIdx}-${phase}`}
                    className="h-full rounded-full"
                    initial={{ width: phase === "running" ? "0%" : "100%" }}
                    animate={{ width: "100%" }}
                    transition={{
                      duration: phase === "running" ? RUN_MS / 1000 : 0,
                      ease: "linear",
                    }}
                    style={{
                      background: phase === "done" ? "#2BCB74" : "#FF6A00",
                    }}
                  />
                </div>
              )}
            </motion.div>
          );
        })}

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5, ease: EASE }}
          className="mt-auto flex items-center gap-2 px-3 py-2 rounded-[10px] flex-wrap"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <span className="text-[8.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/40 shrink-0">
            Assigned
          </span>
          <span
            className="text-[8.5px] font-mono font-bold tracking-[0.12em] uppercase px-2 py-0.5 rounded-full"
            style={{
              background: TONE_STYLES.blue.bg,
              color: TONE_STYLES.blue.color,
            }}
          >
            {active.mhe}
          </span>
          <span className="text-[10px] text-white/50 truncate">
            Operator · {active.operator}
          </span>
        </motion.div>
      </div>
    </>
  );
}

/* ── Execution map ───────────────────────────────────────── */

const VB_W = 340;
const VB_H = 244;

/* Warehouse floor plan — four zones separated by main aisles */
const ZONES = [
  { id: "A", label: "ZONE A · RESERVE", x: 8, y: 22, w: 148, h: 92 },
  { id: "B", label: "ZONE B · PICK FACE", x: 182, y: 22, w: 150, h: 92 },
  { id: "C", label: "ZONE C · BULK", x: 8, y: 132, w: 148, h: 96 },
  { id: "D", label: "ZONE D · DISPATCH", x: 182, y: 132, w: 150, h: 96 },
];

/* Rack runs seen from above — back-to-back pairs with aisles between them */
const RACK_RUNS: {
  x: number;
  y: number;
  len: number;
  cells: number;
  vertical?: boolean;
}[] = [
  /* Zone A — racks run horizontally */
  { x: 18, y: 42, len: 128, cells: 11 },
  { x: 18, y: 48.5, len: 128, cells: 11 },
  { x: 18, y: 66, len: 128, cells: 11 },
  { x: 18, y: 72.5, len: 128, cells: 11 },
  { x: 18, y: 90, len: 128, cells: 11 },
  { x: 18, y: 96.5, len: 128, cells: 11 },
  /* Zone C — deeper bulk storage, also horizontal */
  { x: 18, y: 150, len: 128, cells: 11 },
  { x: 18, y: 156.5, len: 128, cells: 11 },
  { x: 18, y: 174, len: 128, cells: 11 },
  { x: 18, y: 180.5, len: 128, cells: 11 },
  { x: 18, y: 198, len: 128, cells: 11 },
  { x: 18, y: 204.5, len: 128, cells: 11 },
  /* Zone B — pick face racks run vertically */
  { x: 196, y: 42, len: 64, cells: 6, vertical: true },
  { x: 202.5, y: 42, len: 64, cells: 6, vertical: true },
  { x: 222, y: 42, len: 64, cells: 6, vertical: true },
  { x: 228.5, y: 42, len: 64, cells: 6, vertical: true },
  { x: 248, y: 42, len: 64, cells: 6, vertical: true },
  { x: 254.5, y: 42, len: 64, cells: 6, vertical: true },
  { x: 274, y: 42, len: 64, cells: 6, vertical: true },
  { x: 280.5, y: 42, len: 64, cells: 6, vertical: true },
  { x: 300, y: 42, len: 64, cells: 6, vertical: true },
  { x: 306.5, y: 42, len: 64, cells: 6, vertical: true },
];

/* Zone D — staging lanes and dock doors instead of racking */
const STAGING_LANES = [152, 176, 200];
const DOCK_DOORS = [160, 184, 208];

const NODES = [
  { x: 80, y: 59, label: "A-03", anchor: "start" as const },
  { x: 240, y: 70, label: "B-12", anchor: "start" as const },
  { x: 70, y: 167, label: "C-08", anchor: "start" as const },
  { x: 244, y: 185, label: "D-01", anchor: "end" as const },
];

/* Small popover that rides along with the MHE, in map coordinates */
const CARD_W = 78;
const CARD_H = 30;

function TaskCard({
  task,
  status,
  tone,
}: {
  task: (typeof TASKS)[number];
  status: string;
  tone: Tone;
}) {
  const { dx, dy } = task.route;
  const accent = TONE_STYLES[tone];
  /* leader line meets the card on whichever side it sits */
  const leaderX = dx > 0 ? dx : dx + CARD_W;

  return (
    <g>
      <line
        x1={0}
        y1={0}
        x2={leaderX}
        y2={dy + CARD_H}
        stroke="rgba(255,255,255,0.28)"
        strokeWidth={0.5}
      />
      <rect
        x={dx}
        y={dy}
        width={CARD_W}
        height={CARD_H}
        rx={4}
        fill="#08131A"
        fillOpacity={0.97}
        stroke="rgba(255,255,255,0.18)"
        strokeWidth={0.5}
      />
      <text
        x={dx + 7}
        y={dy + 12}
        fill="#FFFFFF"
        fontSize={6.4}
        fontWeight={700}
      >
        {task.title}
      </text>
      <circle cx={dx + 9} cy={dy + 20.5} r={1.7} fill={accent.color} />
      <text
        x={dx + 14}
        y={dy + 22.6}
        fill="rgba(255,255,255,0.6)"
        fontSize={5.3}
        fontWeight={500}
      >
        {task.mhe} · {status}
      </text>
    </g>
  );
}

function ExecutionMap({
  activeIdx,
  done,
  phase,
}: {
  activeIdx: number;
  done: number[];
  phase: RunPhase;
}) {
  const active = TASKS[activeIdx];
  const route = active.route;
  const endX = route.x[route.x.length - 1];
  const endY = route.y[route.y.length - 1];

  return (
    <div className="absolute inset-0 flex flex-col p-3.5 sm:p-5">
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <div className="text-[8.5px] sm:text-[9px] font-mono font-bold tracking-[0.18em] sm:tracking-[0.22em] uppercase text-white/45">
          Execution Map · Floor Layout
        </div>
        <div className="flex items-center gap-2.5 text-[8.5px] sm:text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-white/55">
          <span className="inline-flex items-center gap-1">
            <span
              className="w-2 h-1.5 rounded-[1px]"
              style={{
                background: "rgba(255,255,255,0.10)",
                border: "0.5px solid rgba(255,255,255,0.22)",
              }}
            />
            Rack
          </span>
          <span className="inline-flex items-center gap-1">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#FF6A00" }}
            />
            Task
          </span>
          <span className="inline-flex items-center gap-1">
            <span
              className="w-1.5 h-1.5 rounded-sm"
              style={{ background: "#46A7FF" }}
            />
            Route
          </span>
        </div>
      </div>

      <div className="relative flex-1 min-h-0">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 w-full h-full"
          aria-hidden
        >
          {/* Main aisles — the clear lanes between zones */}
          <rect
            x={160}
            y={18}
            width={18}
            height={214}
            fill="rgba(70,167,255,0.030)"
          />
          <rect
            x={8}
            y={116}
            width={324}
            height={14}
            fill="rgba(70,167,255,0.030)"
          />

          {/* Zones */}
          {ZONES.map((z) => (
            <g key={z.id}>
              <rect
                x={z.x}
                y={z.y}
                width={z.w}
                height={z.h}
                rx={6}
                fill="rgba(255,255,255,0.016)"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth={0.7}
                strokeDasharray="3 3"
              />
              <text
                x={z.x + 7}
                y={z.y + 12}
                fill="rgba(255,255,255,0.34)"
                fontSize={6.2}
                fontWeight={700}
                letterSpacing={0.9}
              >
                {z.label}
              </text>
            </g>
          ))}

          {/* Racking, drawn from above as pallet positions */}
          {RACK_RUNS.map((run, ri) => {
            const gap = 1.6;
            const cell = (run.len - gap * (run.cells - 1)) / run.cells;
            return (
              <g key={`run-${ri}`}>
                {Array.from({ length: run.cells }).map((_, ci) => (
                  <rect
                    key={ci}
                    x={run.vertical ? run.x : run.x + ci * (cell + gap)}
                    y={run.vertical ? run.y + ci * (cell + gap) : run.y}
                    width={run.vertical ? 4.5 : cell}
                    height={run.vertical ? cell : 4.5}
                    rx={0.6}
                    fill="rgba(255,255,255,0.07)"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth={0.35}
                  />
                ))}
              </g>
            );
          })}

          {/* Zone D — staging lanes */}
          {STAGING_LANES.map((y) => (
            <rect
              key={`lane-${y}`}
              x={192}
              y={y}
              width={104}
              height={18}
              rx={2}
              fill="rgba(255,255,255,0.022)"
              stroke="rgba(255,255,255,0.13)"
              strokeWidth={0.45}
              strokeDasharray="2.5 2.5"
            />
          ))}

          {/* Zone D — dock doors on the outer wall */}
          <line
            x1={306}
            y1={144}
            x2={306}
            y2={222}
            stroke="rgba(255,255,255,0.14)"
            strokeWidth={0.6}
          />
          {DOCK_DOORS.map((y) => (
            <rect
              key={`dock-${y}`}
              x={308}
              y={y}
              width={16}
              height={5}
              rx={1}
              fill="rgba(255,106,0,0.28)"
              stroke="rgba(255,106,0,0.5)"
              strokeWidth={0.4}
            />
          ))}

          {/* Routes already completed this cycle stay on the map in green */}
          {done.map((di) => (
            <path
              key={`done-route-${di}`}
              d={TASKS[di].route.d}
              fill="none"
              stroke="rgba(43,203,116,0.30)"
              strokeWidth={1.1}
              strokeDasharray="3 3"
              strokeLinecap="round"
            />
          ))}

          {/* Active route */}
          <motion.path
            key={`route-${activeIdx}`}
            d={route.d}
            fill="none"
            stroke="rgba(70,167,255,0.6)"
            strokeWidth={1.4}
            strokeDasharray="4 4"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: EASE }}
          />

          {/* Task nodes */}
          {NODES.map((n, i) => (
            <g key={n.label}>
              <motion.circle
                cx={n.x}
                cy={n.y}
                r={3.8}
                fill="#FF6A00"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 1.1 + i * 0.12,
                  ease: EASE,
                }}
                style={{
                  transformOrigin: `${n.x}px ${n.y}px`,
                  filter: "drop-shadow(0 0 5px rgba(255,106,0,0.65))",
                }}
              />
              <text
                x={n.anchor === "end" ? n.x - 7 : n.x + 7}
                y={n.y + 2.6}
                textAnchor={n.anchor === "end" ? "end" : "start"}
                fill="rgba(255,255,255,0.55)"
                fontSize={6.2}
                fontWeight={600}
              >
                {n.label}
              </text>
            </g>
          ))}

          {/* Travelling MHE — carries the live task card with it */}
          {phase === "running" ? (
            <motion.g
              key={`mhe-${activeIdx}`}
              initial={{ x: route.x[0], y: route.y[0], opacity: 0 }}
              animate={{ x: route.x, y: route.y, opacity: 1 }}
              transition={{
                x: { duration: RUN_MS / 1000, ease: "linear", times: route.times },
                y: { duration: RUN_MS / 1000, ease: "linear", times: route.times },
                opacity: { duration: 0.35, ease: EASE },
              }}
            >
              <circle
                r={7}
                fill="rgba(255,255,255,0.10)"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth={0.6}
              />
              <circle
                r={3.2}
                fill="#FFFFFF"
                style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.85))" }}
              />
              <TaskCard task={active} status="In progress" tone="amber" />
            </motion.g>
          ) : (
            <motion.g
              key={`mhe-done-${activeIdx}`}
              initial={{ x: endX, y: endY, opacity: 0, scale: 0.9 }}
              animate={{ x: endX, y: endY, opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: EASE }}
              style={{ transformOrigin: "0px 0px" }}
            >
              <motion.circle
                r={7}
                fill="rgba(43,203,116,0.16)"
                stroke="rgba(43,203,116,0.6)"
                strokeWidth={0.8}
                animate={{ r: [7, 13, 7], opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
              />
              <circle
                r={3.2}
                fill="#2BCB74"
                style={{ filter: "drop-shadow(0 0 6px rgba(43,203,116,0.9))" }}
              />
              <TaskCard task={active} status="Completed" tone="green" />
            </motion.g>
          )}

          {/* Standing exception in Zone D */}
          <motion.circle
            cx={280}
            cy={208}
            r={9}
            fill="none"
            stroke="rgba(255,77,77,0.7)"
            strokeWidth={1.2}
            animate={{ r: [7, 15, 7], opacity: [0.85, 0, 0.85] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          />
        </svg>
      </div>
    </div>
  );
}
