"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import {
  EVENT_COLOR,
  EVENT_LABEL,
  type EventType,
  TWIN_EVENTS,
  TWIN_H,
  TWIN_W,
  TwinEnv,
} from "@/components/sections/rtss/rtss-shared";

/**
 * History & recurring risk.
 *
 * The same Digital Twin read backwards, so the board shows accumulation
 * rather than a single event: the plan on the left with every recorded
 * hotspot blinking on it, the log climbing on the right, and the counts
 * drifting along the bottom.
 *
 * Every figure here is derived from the document's own mapped events — the
 * log rows and the chip counts are computed from TWIN_EVENTS, not written.
 */

const HAIR = "rgba(255,255,255,0.10)";

/* ── derived from the mapped events ──────────────────────── */

const SEVERITY: Record<string, string> = {
  high: "High",
  med: "Medium",
  low: "Low",
};

/** One log row per recorded event, newest-looking first. */
const LOG = [...TWIN_EVENTS].reverse();

/** Counts by class, then the zones that repeat — the recurrence itself. */
const CHIPS = (() => {
  const byType = new Map<EventType, number>();
  const byZone = new Map<string, number>();
  TWIN_EVENTS.forEach((e) => {
    byType.set(e.t, (byType.get(e.t) ?? 0) + 1);
    const zone = e.z.split(" · ")[0];
    byZone.set(zone, (byZone.get(zone) ?? 0) + 1);
  });

  const types = [...byType.entries()].map(([t, n]) => ({
    label: EVENT_LABEL[t],
    n,
    c: EVENT_COLOR[t],
  }));

  const zones = [...byZone.entries()]
    .filter(([, n]) => n > 1)
    .sort((a, b) => b[1] - a[1])
    .map(([z, n]) => ({ label: z, n, c: "" }));

  return [...types, ...zones];
})();

/* ── the responses ───────────────────────────────────────── */

const RESPONSES = [
  [
    "Skill training",
    "Behaviour coaching",
    "Rack protection",
    "Floor repair",
    "Traffic management",
  ],
  [
    "Layout change",
    "Speed-zone change",
    "Route change",
    "Staging change",
    "Or a combination of these",
  ],
];

/* ── the plan, with every hotspot on it ──────────────────── */

function Hotspots() {
  return (
    <svg
      viewBox={`0 0 ${TWIN_W} ${TWIN_H}`}
      className="block w-full h-auto"
      role="img"
      aria-label="Digital Twin with every recorded safety event of the period mapped onto the building"
    >
      <TwinEnv labels={false} />
      {TWIN_EVENTS.map((e, i) => {
        const r = e.s === "high" ? 7 : e.s === "med" ? 5.5 : 4.5;
        return (
          <g key={`${e.x}-${e.y}-${i}`}>
            {/* the blink is staggered, so the map reads as accumulated
                history rather than one synchronised pulse */}
            <motion.circle
              cx={e.x}
              cy={e.y}
              r={r}
              fill={EVENT_COLOR[e.t]}
              animate={{ opacity: [0.35, 0.95, 0.35] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: (i % 9) * 0.28,
              }}
            />
            {e.s === "high" && (
              <motion.circle
                cx={e.x}
                cy={e.y}
                r={r}
                fill="none"
                stroke={EVENT_COLOR[e.t]}
                strokeWidth={1}
                animate={{ r: [r, r + 12], opacity: [0.5, 0] }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: (i % 9) * 0.28,
                }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function RtssHistory() {
  return (
    <Section surface="darkMid" id="history">
      <style>{`
        @keyframes rtsshist-up {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
        .rtsshist-log { display: flex; flex-direction: column; animation: rtsshist-up 26s linear infinite; }

        @keyframes rtsshist-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .rtsshist-chips { display: flex; width: max-content; animation: rtsshist-left 34s linear infinite; }

        .rtsshist-board:hover .rtsshist-log,
        .rtsshist-board:hover .rtsshist-chips { animation-play-state: paused; }

        @media (prefers-reduced-motion: reduce) {
          .rtsshist-log, .rtsshist-chips { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="History & recurring risk"
        top="One event shows what happened."
        bottom="History shows what keeps happening."
        body="The same Digital Twin, read backwards. A single impact is an incident; the fourth at the same aisle end, on the same shift, is a condition."
        tone="dark"
        size="compact"
        width="wide"
        bodyWidth="wide"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.85, ease: EASE }}
        className="rtsshist-board overflow-hidden max-w-[1180px] mx-auto"
        style={{
          borderRadius: 16,
          background: "#0E0E11",
          border: `1px solid ${HAIR}`,
          boxShadow: "0 60px 120px -50px rgba(0,0,0,0.9)",
        }}
      >
        <div
          className="flex items-center gap-2.5 px-4 h-11 flex-wrap"
          style={{ borderBottom: `1px solid ${HAIR}`, background: "#111114" }}
        >
          <span className="relative flex w-2 h-2 shrink-0">
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ background: "#54DE91" }}
              animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            <span
              className="relative w-2 h-2 rounded-full"
              style={{ background: "#54DE91" }}
            />
          </span>
          <span className="text-[11.5px] font-semibold text-white/85">
            Safety hotspots — historical intelligence
          </span>
          <span
            className="ml-auto px-2.5 py-1 rounded-full text-[9.5px] font-mono font-bold tracking-[0.12em] uppercase text-white/55"
            style={{ border: `1px solid ${HAIR}` }}
          >
            Live Digital Twin
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.62fr_1fr] items-stretch">
          {/* the plan */}
          <div className="p-3 sm:p-4" style={{ background: "#0A0C0E" }}>
            <div className="overflow-hidden" style={{ borderRadius: 10 }}>
              <Hotspots />
            </div>
          </div>

          {/* the log, climbing */}
          <div
            className="relative min-h-[280px]"
            style={{ borderLeft: `1px solid ${HAIR}` }}
          >
            <div
              className="flex items-center justify-between gap-3 px-4 h-10"
              style={{ borderBottom: `1px solid ${HAIR}` }}
            >
              <span className="text-[9px] font-mono font-bold tracking-[0.2em] uppercase text-white/40">
                Event history
              </span>
              <span className="text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-white/30 tabular-nums">
                {TWIN_EVENTS.length} recorded
              </span>
            </div>

            <div
              className="absolute inset-x-0 bottom-0 top-10 overflow-hidden"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
              }}
            >
              <div className="rtsshist-log">
                {[0, 1].map((copy) => (
                  <div key={copy} aria-hidden={copy === 1}>
                    {LOG.map((e, i) => (
                      <div
                        key={`${copy}-${e.x}-${e.y}-${i}`}
                        className="flex items-start gap-2.5 px-4 py-3"
                        style={{ borderBottom: `1px solid ${HAIR}` }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                          style={{ background: EVENT_COLOR[e.t] }}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[12px] font-semibold text-white/85">
                            {EVENT_LABEL[e.t]}
                          </span>
                          <span className="block mt-0.5 text-[10.5px] font-mono text-white/40 truncate">
                            {e.z}
                          </span>
                        </span>
                        <span className="text-[9px] font-mono font-bold tracking-[0.1em] uppercase text-white/30 shrink-0 mt-0.5">
                          {SEVERITY[e.s]}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* the counts, drifting */}
        <div
          className="relative overflow-hidden py-3"
          style={{
            borderTop: `1px solid ${HAIR}`,
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, #000 5%, #000 95%, transparent 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0%, #000 5%, #000 95%, transparent 100%)",
          }}
        >
          <div className="rtsshist-chips">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex gap-2 shrink-0 pr-2 pl-2">
                {CHIPS.map((c) => (
                  <span
                    key={`${copy}-${c.label}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full whitespace-nowrap shrink-0"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${HAIR}`,
                    }}
                  >
                    {c.c && (
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: c.c }}
                      />
                    )}
                    <span className="text-[10.5px] font-mono text-white/55">
                      {c.label}
                    </span>
                    <span className="text-[11px] font-mono font-bold tabular-nums text-white">
                      {c.n}
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── the environment matters too ─────────────────── */}
      <div className="mt-16 sm:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 max-w-[1180px] mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="font-rams-heading text-[24px] sm:text-[30px] lg:text-[34px] font-bold tracking-[-0.03em] leading-[1.18] text-white max-w-[22ch]"
        >
          Sometimes the driver is not the only variable. The{" "}
          <span className="text-signal-orange">environment</span> matters too.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >
          <p className="text-[15px] sm:text-[16px] text-white/55 leading-[1.65]">
            Read recurring events against aisle ends, cross aisles, docks,
            staging, pedestrian zones, columns, floor transitions, expansion
            joints and congested intersections — and the right response often
            turns out not to be a training record.
          </p>

          <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
            {RESPONSES.flat().map((r) => (
              <span key={r} className="flex items-start gap-2.5">
                <span
                  aria-hidden
                  className="w-[18px] h-[18px] rounded-full bg-signal-orange flex items-center justify-center shrink-0 mt-px"
                >
                  <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                </span>
                <span className="text-[13.5px] text-white/70 leading-[1.55]">
                  {r}
                </span>
              </span>
            ))}
          </div>

          <p className="mt-7 text-[12px] font-mono text-white/35 leading-[1.7]">
            RTSS surfaces where risk repeats. It does not automatically assign
            the cause.
          </p>
        </motion.div>
      </div>
    </Section>
  );
}
