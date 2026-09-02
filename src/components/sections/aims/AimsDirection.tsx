"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * From data to direction.
 *
 * Four outcomes as a bento row, each carrying a live widget that performs the
 * outcome rather than illustrating it: four feeds resolving into one view, a
 * queue that re-ranks itself, an action closing through its states, and a
 * trend that keeps climbing.
 *
 * One tick drives all four, and every series is a formula — so the server and
 * the client draw the same frame.
 */

const LINE = "#E8E8ED";
const GREEN = "#16A34A";
const ORANGE = "#FF6A00";
const TICK_MS = 110;

const CARD: React.CSSProperties = {
  borderRadius: 12,
  border: `1px solid ${LINE}`,
  background: "#FFFFFF",
  boxShadow: "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
};

const WELL: React.CSSProperties = {
  borderRadius: 10,
  border: `1px solid ${LINE}`,
  background: "linear-gradient(180deg, #FAFAFB 0%, #FFFFFF 100%)",
};

function useTick() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((v) => v + 1), TICK_MS);
    return () => clearInterval(id);
  }, []);
  return t;
}

/** The little product chrome each widget carries. */
function WidgetHead({ label, note }: { label: string; note?: string }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2"
      style={{ borderBottom: `1px solid ${LINE}` }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: ORANGE }}
      />
      <span className="text-[8.5px] font-mono font-bold tracking-[0.16em] uppercase text-graphite/50 truncate">
        {label}
      </span>
      {note && (
        <span className="ml-auto text-[8.5px] font-mono text-graphite/35 shrink-0">
          {note}
        </span>
      )}
    </div>
  );
}

/* ── 01 · four feeds resolving into one view ─────────────── */

const TILES: [string, (t: number) => string][] = [
  ["Safety", (t) => (86.4 + 0.6 * Math.sin(t / 21)).toFixed(1)],
  ["Assets", (t) => `${(92 + 2 * Math.sin(t / 17 + 1)).toFixed(0)}%`],
  ["Stock", (t) => `${(97.8 + 0.4 * Math.sin(t / 23 + 2)).toFixed(1)}%`],
  ["Output", (t) => `+${(14 + 2 * Math.sin(t / 19 + 3)).toFixed(0)}%`],
];

function OnePicture({ t }: { t: number }) {
  const on = Math.floor(t / 14) % TILES.length;
  return (
    <div className="h-full flex flex-col">
      <WidgetHead label="Management view" note="live" />

      <div className="grid grid-cols-2 gap-1.5 p-3 flex-1">
        {TILES.map(([k, fn], i) => {
          const lit = i === on;
          return (
            <div
              key={k}
              className="flex flex-col justify-center px-2.5 py-2"
              style={{
                borderRadius: 8,
                background: "#FFFFFF",
                border: `1px solid ${lit ? "rgba(255,106,0,0.35)" : LINE}`,
                boxShadow: lit
                  ? "0 6px 18px -10px rgba(255,106,0,0.55)"
                  : "none",
                transition: "border-color 0.4s ease, box-shadow 0.4s ease",
              }}
            >
              <span className="text-[8px] font-mono uppercase tracking-[0.12em] text-graphite/40">
                {k}
              </span>
              <span className="mt-1 text-[15px] font-bold tabular-nums leading-none text-carbon">
                {fn(t)}
              </span>
            </div>
          );
        })}
      </div>

      {/* the four modules feeding it */}
      <div className="flex items-center gap-1 px-3 pb-3">
        {TILES.map(([k], i) => (
          <span
            key={k}
            className="flex-1 h-[3px] rounded-full"
            style={{
              background: i === on ? ORANGE : "rgba(8,8,10,0.09)",
              transition: "background 0.4s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── 02 · a queue that re-ranks itself ───────────────────── */

const ISSUES = [
  { id: "pune", label: "Rack risk · Pune", base: 86, amp: 9, ph: 0 },
  { id: "chennai", label: "MHE · Chennai", base: 74, amp: 13, ph: 1.7 },
  { id: "kolkata", label: "Dwell · Kolkata", base: 62, amp: 15, ph: 3.4 },
  { id: "delhi", label: "Closure · Delhi", base: 52, amp: 12, ph: 5.1 },
];

function Prioritised({ t }: { t: number }) {
  const scored = ISSUES.map((it) => ({
    ...it,
    score: Math.round(it.base + it.amp * Math.sin(t / 34 + it.ph)),
  })).sort((a, b) => b.score - a.score);

  return (
    <div className="h-full flex flex-col">
      <WidgetHead label="Action queue" note="by impact" />

      <div className="flex-1 flex flex-col justify-center gap-1.5 px-3 py-2">
        {scored.map((it, rank) => {
          const lead = rank === 0;
          return (
            <motion.div
              key={it.id}
              layout
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="flex items-center gap-2 px-2.5 py-[7px]"
              style={{
                borderRadius: 7,
                background: lead ? "rgba(255,106,0,0.06)" : "#FFFFFF",
                border: `1px solid ${lead ? "rgba(255,106,0,0.30)" : LINE}`,
              }}
            >
              <span
                className="text-[8.5px] font-mono font-bold tabular-nums shrink-0"
                style={{ color: lead ? ORANGE : "rgba(90,90,96,0.45)" }}
              >
                {rank + 1}
              </span>
              <span
                className="text-[9px] font-mono truncate flex-1 min-w-0"
                style={{ color: lead ? "#08080A" : "rgba(90,90,96,0.75)" }}
              >
                {it.label}
              </span>
              <span
                className="relative w-[30px] h-[4px] rounded-full overflow-hidden shrink-0"
                style={{ background: "rgba(8,8,10,0.08)" }}
              >
                <span
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${it.score}%`,
                    background: lead ? ORANGE : "rgba(90,90,96,0.35)",
                    transition: "width 0.4s ease",
                  }}
                />
              </span>
              <span
                className="text-[9px] font-mono tabular-nums w-[16px] text-right shrink-0"
                style={{ color: lead ? ORANGE : "rgba(90,90,96,0.5)" }}
              >
                {it.score}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ── 03 · one action, closing through its states ─────────── */

const STATES: [string, string][] = [
  ["Open", "rgba(90,90,96,0.55)"],
  ["Assigned", "#3B82F6"],
  ["In progress", ORANGE],
  ["Verified", GREEN],
];
const TRAIL = ["Owner · R. Mehta", "Due · 12 Sep", "Evidence · 4 photos"];

function Accountable({ t }: { t: number }) {
  const step = Math.floor(t / 18) % STATES.length;
  const [label, tone] = STATES[step];
  const pct = Math.round(((step + 1) / STATES.length) * 100);

  return (
    <div className="h-full flex flex-col">
      <WidgetHead label="WO-4471" note="rack repair" />

      <div className="flex-1 flex flex-col justify-center gap-3 px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <motion.span
            key={label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="px-2 py-1 rounded-full text-[9px] font-mono font-bold"
            style={{ background: `${tone}1A`, color: tone }}
          >
            {label}
          </motion.span>
          <span
            className="text-[9px] font-mono tabular-nums"
            style={{ color: tone }}
          >
            {pct}%
          </span>
        </div>

        <span
          className="relative h-[4px] rounded-full overflow-hidden"
          style={{ background: "rgba(8,8,10,0.08)" }}
        >
          <span
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${pct}%`,
              background: tone,
              transition: "width 0.5s ease, background 0.5s ease",
            }}
          />
        </span>

        <div className="flex flex-col gap-1.5">
          {TRAIL.map((row, i) => {
            const on = i <= step - 1;
            return (
              <span
                key={row}
                className="flex items-center gap-2 text-[9px] font-mono transition-colors duration-500"
                style={{ color: on ? "#08080A" : "rgba(90,90,96,0.35)" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-500"
                  style={{ background: on ? GREEN : "rgba(8,8,10,0.12)" }}
                />
                {row}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── 04 · the trend, over the quarter ────────────────────── */

const N = 18;
const W = 220;
const H = 62;
const series = Array.from(
  { length: N },
  (_, i) => 16 + i * 2.2 + 4 * Math.sin(i / 1.6),
);
const MAXV = 62;
const sx = (i: number) => (i / (N - 1)) * W;
const sy = (v: number) => H - (v / MAXV) * H;
const PTS = series.map((v, i) => `${sx(i).toFixed(2)},${sy(v).toFixed(2)}`);
const AREA = `M0,${H} L${PTS.join(" L")} L${W},${H} Z`;

function Improvement({ t }: { t: number }) {
  const head = Math.floor(t / 5) % N;
  return (
    <div className="h-full flex flex-col">
      <WidgetHead label="Intelligence index" note="90 days" />

      <div className="flex-1 flex flex-col justify-center gap-2 px-3 py-2">
        <div className="flex items-baseline gap-2">
          <span className="text-[20px] font-bold tabular-nums leading-none text-carbon">
            {(70 + series[head] / 4).toFixed(1)}
          </span>
          <span
            className="px-1.5 py-[3px] rounded-full text-[8.5px] font-mono font-bold"
            style={{ background: "rgba(22,163,74,0.10)", color: GREEN }}
          >
            ↑ {(series[head] / 10).toFixed(1)}
          </span>
        </div>

        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-[62px] block"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="aimsdir-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ORANGE} stopOpacity="0.22" />
              <stop offset="100%" stopColor={ORANGE} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={AREA} fill="url(#aimsdir-fill)" />
          <polyline
            points={PTS.join(" ")}
            fill="none"
            stroke={ORANGE}
            strokeWidth={1.6}
            strokeLinecap="round"
          />
          <line
            x1={sx(head).toFixed(2)}
            x2={sx(head).toFixed(2)}
            y1={0}
            y2={H}
            stroke="rgba(255,106,0,0.28)"
            strokeWidth={1}
            strokeDasharray="2 3"
          />
          <circle
            cx={sx(head).toFixed(2)}
            cy={sy(series[head]).toFixed(2)}
            r={3.2}
            fill={ORANGE}
            stroke="#FFFFFF"
            strokeWidth={1.6}
          />
        </svg>
      </div>
    </div>
  );
}

/* ── the row ─────────────────────────────────────────────── */

const ROWS: {
  title: string;
  body: string;
  Widget: (props: { t: number }) => React.ReactElement;
}[] = [
  {
    title: "One operating picture",
    body: "Bring safety, assets, inventory and productivity into one management view.",
    Widget: OnePicture,
  },
  {
    title: "Prioritised decisions",
    body: "Focus teams on the issues with the greatest risk, cost or operational impact.",
    Widget: Prioritised,
  },
  {
    title: "Accountable action",
    body: "Assign owners, monitor closure and maintain a complete evidence trail.",
    Widget: Accountable,
  },
  {
    title: "Continuous improvement",
    body: "Compare sites, detect recurrence and replicate the practices that perform.",
    Widget: Improvement,
  },
];

export function AimsDirection() {
  const t = useTick();

  return (
    <Section surface="offWhite" id="business-value">
      <SectionHeader
        eyebrow="From data to direction"
        top="Intelligence built for"
        bottom="Management outcomes."
        body="Not another dashboard to watch. A shared system for deciding, acting and improving."
        size="compact"
        width="wide"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1240px] mx-auto">
        {ROWS.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
            className="flex flex-col p-5 sm:p-6"
            style={CARD}
          >
            <div
              className="shrink-0 overflow-hidden"
              style={{ ...WELL, height: 196 }}
            >
              <r.Widget t={t} />
            </div>

            <h3 className="mt-6 text-[18px] font-bold text-carbon leading-[1.2] tracking-[-0.025em]">
              {r.title}
            </h3>
            <p className="mt-2.5 text-[13.5px] text-graphite/65 leading-[1.6]">
              {r.body}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
