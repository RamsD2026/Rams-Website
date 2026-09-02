"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FleetMap } from "./DiaFleetMap";

/**
 * MHE Diagnostics & Maintenance — hero.
 *
 * Same skeleton as the other solution heroes: dark ground, the glow and grid,
 * centred pill eyebrow, h1, lede, chip row, CTA pair, then the product full
 * width beneath.
 *
 * The board is the fleet, not a screenshot of one: a health score that counts
 * up, machines whose condition bars fill, and one machine under inspection
 * whose readings arrive a line at a time. Every value is a formula, so the
 * server and the client render the same frame.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const HAIR = "rgba(255,255,255,0.08)";
const GREEN = "#54DE91";
const AMBER = "#FFBE47";
const RED = "#FF6C6C";
const BLUE = "#77BDFF";

const CHIPS = [
  "Equipment health visibility",
  "Maintenance intelligence",
  "Actionable fleet insights",
];

/* ── the machine that needs somebody today ───────────────── */

/** What the diagnostics know about it. */
const INSIGHT: [string, string, string][] = [
  ["Equipment status", "Attention", RED],
  ["Battery level", "32%", BLUE],
  ["Maintenance due", "24 hrs", AMBER],
  ["Open fault", "Hydraulic pressure", AMBER],
];

/** Where the same fault has appeared before, over the last eight weeks. */
const FAULTS = [0, 1, 0, 0, 1, 0, 1, 1];

const TICK_MS = 90;

function useTick(still: boolean) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (still) return;
    const id = setInterval(() => setT((v) => v + 1), TICK_MS);
    return () => clearInterval(id);
  }, [still]);
  return t;
}

/** How long the insight panel takes to fill before it runs again. */
const CYCLE = 64;

function FleetBoard() {
  const t = useTick(false);

  /* The score settles once — it is a reading, not a loop. What keeps the
     board alive is the diagnostic itself: a machine under inspection moving
     down the fleet, and the insight panel filling and refilling. */
  const fill = Math.min(1, t / 22);
  const score = Math.round(87 * fill);
  const phase = t < 26 ? 0 : (t - 26) % CYCLE;
  const lines = Math.min(INSIGHT.length, Math.floor(phase / 6));

  return (
    <div className="h-full flex flex-col">
      {/* chrome */}
      <div
        className="flex items-center gap-3 px-5 py-3.5 flex-wrap"
        style={{ borderBottom: `1px solid ${HAIR}`, background: "#0B0F13" }}
      >
        <span className="relative flex w-2 h-2 shrink-0">
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ background: GREEN }}
            animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
          <span
            className="relative w-2 h-2 rounded-full"
            style={{ background: GREEN }}
          />
        </span>
        <span className="text-[11.5px] font-semibold text-white/85">
          MHE Health &amp; Maintenance Dashboard
        </span>
        <span className="ml-auto text-[10px] font-mono font-semibold tracking-[0.12em] uppercase text-signal-orange">
          System active
        </span>
      </div>

      {/* the four figures a plant head reads first */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-px"
        style={{ background: HAIR, borderBottom: `1px solid ${HAIR}` }}
      >
        {[
          ["Fleet health", `${score}%`, true],
          ["Connected assets", "142", false],
          ["Open alerts", "12", false],
          ["Maintenance due", "28", false],
        ].map(([k, v, accent]) => (
          <div
            key={k as string}
            className="px-5 py-4"
            style={{ background: "#080B0E" }}
          >
            <p className="text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase text-white/35">
              {k as string}
            </p>
            <p
              className={
                "mt-1.5 font-rams-heading text-[26px] font-bold tabular-nums tracking-[-0.035em] leading-none " +
                (accent ? "text-signal-orange" : "text-white")
              }
            >
              {v as string}
            </p>
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr]">
        {/* the floor, with the fleet moving through it */}
        <div className="relative px-4 py-4 sm:px-5 sm:py-5 min-h-[280px]">
          <div className="flex items-baseline justify-between gap-3 mb-3">
            <p className="text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase text-white/35">
              Warehouse 01 · live floor
            </p>
            <p className="text-[9.5px] font-mono tracking-[0.1em] uppercase text-signal-orange">
              5 machines tracked
            </p>
          </div>

          <div className="h-[calc(100%-30px)] min-h-[300px]">
            <FleetMap t={t} />
          </div>
        </div>

        {/* and the one that needs somebody today */}
        <div
          className="flex flex-col px-5 py-5 sm:px-6"
          style={{ background: "#0B0F13", borderLeft: `1px solid ${HAIR}` }}
        >
          {/* which machine */}
          <div className="flex items-start justify-between gap-3">
            <span>
              <span className="block font-rams-heading text-[20px] font-bold tracking-[-0.03em] text-white">
                FL-004
              </span>
              <span className="block mt-1 text-[10px] font-mono tracking-[0.1em] uppercase text-white/35">
                Reach truck · Aisle A2
              </span>
            </span>
            <span
              className="shrink-0 px-2.5 py-1 rounded-full text-[9.5px] font-mono font-bold tracking-[0.12em] uppercase"
              style={{ color: RED, background: `${RED}1A` }}
            >
              Attention
            </span>
          </div>

          {/* the two readings that put it there */}
          <div
            className="grid grid-cols-2 gap-4 mt-6 pt-5"
            style={{ borderTop: `1px solid ${HAIR}` }}
          >
            {[
              ["Condition", 46, RED],
              ["Battery", 32, BLUE],
            ].map(([label, value, tone]) => (
              <span key={label as string}>
                <span className="block text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase text-white/35">
                  {label as string}
                </span>
                <span
                  className="block mt-1.5 font-rams-heading text-[26px] font-bold tabular-nums tracking-[-0.035em] leading-none"
                  style={{ color: tone as string }}
                >
                  {Math.round((value as number) * fill)}%
                </span>
                <span
                  className="relative block h-1 rounded-full mt-3 overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <span
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      background: tone as string,
                      width: `${((value as number) * fill).toFixed(1)}%`,
                      transition: "width 120ms linear",
                    }}
                  />
                </span>
              </span>
            ))}
          </div>

          {/* what the diagnostics say about it */}
          <div className="mt-6 pt-5" style={{ borderTop: `1px solid ${HAIR}` }}>
            <p className="text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase text-signal-orange">
              Diagnostics
            </p>

            <div className="mt-3">
              {INSIGHT.map(([k, v, tone], i) => (
                <motion.div
                  key={k}
                  animate={{ opacity: i < lines ? 1 : 0.18 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="flex items-center justify-between gap-3 py-2"
                  style={{ borderTop: i ? `1px solid ${HAIR}` : undefined }}
                >
                  <span className="text-[11px] font-mono text-white/40">
                    {k}
                  </span>
                  <span
                    className="text-[11px] font-mono font-semibold"
                    style={{ color: tone }}
                  >
                    {v}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* how often this has happened here before */}
          <div className="mt-6 pt-5" style={{ borderTop: `1px solid ${HAIR}` }}>
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase text-white/35">
                Fault recurrence
              </p>
              <p className="text-[11px] font-mono font-semibold text-white">
                4 in 90 days
              </p>
            </div>

            <div className="flex items-end gap-1.5 h-[26px] mt-3">
              {FAULTS.map((f, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-[2px]"
                  style={{
                    background: f ? RED : "rgba(255,255,255,0.10)",
                    height: `${f ? 100 : 32}%`,
                    opacity: i / FAULTS.length <= fill ? 1 : 0.25,
                    transition: "opacity 200ms linear",
                  }}
                />
              ))}
            </div>
          </div>

          {/* and what has been raised because of it */}
          <div
            className="mt-auto pt-5"
            style={{ borderTop: `1px solid ${HAIR}` }}
          >
            <span
              className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-[10px] font-mono font-bold tracking-[0.1em] uppercase"
              style={{ color: AMBER, background: `${AMBER}14` }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: AMBER }}
              />
              Work order WO-2231 raised
            </span>
            <p className="mt-3 text-[11px] leading-[1.6] text-white/35">
              Flagged before the shift, not after the breakdown.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DiaHero() {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(80% 100% at 50% 0%, #1D1D1F 0%, #0E0E0F 55%, #08080A 100%)",
      }}
      id="top"
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
              MHE Diagnostics &amp; Maintenance
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
            className="mt-8 text-[42px] sm:text-[68px] lg:text-[92px] font-bold leading-[1.06] tracking-[-0.045em]"
          >
            <span className="block text-white">Know machine health,</span>
            <span className="block text-white">prevent downtime,</span>
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
              And keep fleets ready.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[16px] text-white/60 leading-[1.55] max-w-[1120px] mx-auto"
          >
            RAMS brings machine diagnostics, battery intelligence, maintenance
            planning and service visibility into one connected layer so
            warehouse teams can improve equipment uptime, reduce breakdown risk
            and make better maintenance decisions across MHE operations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28, ease: EASE }}
            className="mt-8 flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap"
          >
            {CHIPS.map((label) => (
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
              className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-px hover:bg-signal-orange-hover"
            >
              Assess My Fleet
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

        {/* ── the product ───────────────────────────────── */}
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
            className="relative rounded-[18px] overflow-hidden min-h-[560px] sm:min-h-0 sm:aspect-[16/9]"
            style={{
              background: "linear-gradient(180deg, #0A0F14 0%, #06090C 100%)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <FleetBoard />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
