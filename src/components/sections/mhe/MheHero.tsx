"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MheFleetAssessmentModal } from "./MheFleetAssessmentModal";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * 01 — Hero.
 *
 * The solution pages' own hero, value for value with `IrdsHero` and
 * `WexHero`: the #1D1D1F → #08080A radial, the orange glow at
 * `60% 60% at 50% 20%` over 720px, the 72px grid masked out through the
 * lower third, a pill eyebrow, the centred 56/84/112 headline, and the
 * product visual under the copy rather than beside it.
 *
 * It was a teal split hero — `#001216`, a two-column grid, a 12px bold
 * uppercase eyebrow in #ffb27c and its own background CSS — which is the one
 * solution page that did not look like the others.
 *
 * The fleet-assessment modal is kept — it is the page's primary action. The
 * visual under the copy is the fleet twin below, built on the rack twin in
 * IrdsHero.
 */
export function MheHero() {
  const [assessOpen, setAssessOpen] = useState(false);

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
              MHE Safety &amp; Productivity
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
            className="mt-8 text-[46px] sm:text-[72px] lg:text-[96px] font-bold leading-[1.06] tracking-[-0.045em]"
          >
            Make every movement
            <br />
            <span
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.35) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              safer and more productive.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="mt-7 text-[14px] sm:text-[16px] text-white/60 leading-[1.6] max-w-[880px] mx-auto"
          >
            RAMS helps you monitor MHE activity, improve utilisation, reduce
            unsafe behaviour, track operator performance and turn movement data
            into actionable warehouse intelligence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease: EASE }}
            className="mt-10 flex items-center justify-center gap-3 flex-wrap"
          >
            <button
              type="button"
              onClick={() => setAssessOpen(true)}
              className="group inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-px hover:bg-signal-orange-hover"
            >
              Assess my fleet
              <ArrowRight
                className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </button>
            <Link
              href="#capabilities"
              className="inline-flex items-center gap-2 text-white text-[14px] font-semibold px-6 py-3.5 rounded-full border border-white/15 bg-white/[0.04] transition-colors duration-200 hover:bg-white/[0.08]"
            >
              Explore capabilities
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42, ease: EASE }}
            className="mt-9 flex flex-wrap items-center justify-center gap-2"
          >
            {[
              "Fleet visibility",
              "Operator-linked safety",
              "Movement intelligence",
            ].map((label) => (
              <span
                key={label}
                className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] font-medium text-white/65"
              >
                {label}
              </span>
            ))}
          </motion.div>
        </div>

        {/* the fleet twin, in the device frame the solution heroes use */}
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
            className="relative rounded-[18px] overflow-hidden min-h-[600px] sm:min-h-0 sm:aspect-[16/10]"
            style={{
              background: "linear-gradient(180deg, #0A0F14 0%, #06090C 100%)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              borderRight: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <FleetTwinView />
          </div>
        </motion.div>
      </div>

      <MheFleetAssessmentModal
        open={assessOpen}
        onClose={() => setAssessOpen(false)}
      />
    </section>
  );
}

/* ── the product visual ───────────────────────────────────────────── */

/**
 * The fleet twin, built on `IrdsHero`'s visual, value for value: the 28px
 * device frame with its 14px inner padding and deep shadow, the 18px screen
 * at 16/10, a header row with a LIVE pill, KPI pills under it, and a
 * two-column body — the live plan on the left, the streaming feed on the
 * right.
 *
 * It was a CSS floor with absolutely positioned zones, five drifting
 * `<div>` trucks and two HUD cards, all at hard pixel offsets: it did not
 * scale with the frame, and it was the one solution hero whose visual was
 * not a product view.
 *
 * ── The motion ──────────────────────────────────────────────────────
 * Everything animates inside one 400 × 240 viewBox, so it stays registered
 * at every width. Four MHEs run their own aisle on a keyframed `x`, the
 * impact marker pulses, and an orange sweep crosses the plan the way the
 * rack elevation's inspection scan does. All of it is in the SVG rather
 * than in a `<style>` block of pixel keyframes, and none of it is random —
 * the server and the client render the same frame.
 */

const FLEET_EVENTS = [
  { id: "MHE-07", loc: "Dispatch · Z-04", status: "warning", note: "speed" },
  { id: "MHE-02", loc: "Aisle B · Z-02", status: "ok" },
  { id: "MHE-11", loc: "Inbound · Z-01", status: "critical", note: "impact" },
  { id: "MHE-04", loc: "Aisle C · Z-03", status: "ok" },
  { id: "MHE-09", loc: "Staging · Z-05", status: "warning", note: "idle 12m" },
  { id: "MHE-03", loc: "Aisle A · Z-02", status: "ok" },
  { id: "MHE-15", loc: "Dock 3 · Z-06", status: "ok" },
  { id: "MHE-06", loc: "Aisle D · Z-04", status: "warning", note: "operator" },
] as const;

function FleetTwinView() {
  const KPIS = [
    { label: "Utilisation", value: "76%", tone: "orange" as const },
    { label: "Active MHEs", value: "18", tone: "white" as const },
    { label: "Safety alerts", value: "3", tone: "white" as const },
  ];

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex items-center justify-between gap-4 flex-wrap px-5 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6">
        <div className="min-w-0">
          <div className="text-[9px] sm:text-[10px] font-mono font-bold tracking-[0.22em] uppercase text-white/45">
            Fleet Twin · Pune DC
          </div>
          <div className="mt-1.5 text-[15px] sm:text-[18px] font-semibold text-white tracking-[-0.01em] truncate">
            Shift B — 18 MHEs running
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
              className={
                "text-[13px] sm:text-[14px] font-bold tabular-nums tracking-[-0.01em] " +
                (k.tone === "orange" ? "text-signal-orange" : "text-white")
              }
            >
              {k.value}
            </span>
          </span>
        ))}
      </div>

      <div className="relative flex-1 grid grid-cols-1 sm:grid-cols-[1.55fr_1fr] gap-4 sm:gap-6 mx-4 sm:mx-8 mb-6 sm:mb-8 min-h-0">
        <div
          className="relative rounded-xl overflow-hidden min-h-[260px] sm:min-h-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <FloorPlan />
        </div>

        <div
          className="relative rounded-xl overflow-hidden flex flex-col min-h-[200px] sm:min-h-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <FleetFeed />
        </div>
      </div>
    </div>
  );
}

/** The plan: four rack rows, the aisles between them, a dock, and the fleet. */
function FloorPlan() {
  const VB_W = 400;
  const VB_H = 240;

  /* four rack rows; the aisle each MHE runs is the gap under its row */
  const ROWS = [44, 92, 140, 188];
  const RACK_X = 26;
  const RACK_W = 232;
  const BAYS = 8;
  const BAY_W = RACK_W / BAYS;

  /* one MHE per aisle: the lane it runs, where it starts and how long a
     round trip takes. Written down, not generated — see the note above. */
  const FLEET = [
    { y: 68, from: 34, to: 236, dur: 9, delay: 0, tone: "ok" as const },
    { y: 116, from: 226, to: 44, dur: 11, delay: 0.8, tone: "warn" as const },
    { y: 164, from: 40, to: 210, dur: 8, delay: 0.4, tone: "ok" as const },
    { y: 212, from: 230, to: 60, dur: 12, delay: 1.2, tone: "ok" as const },
  ];

  /* the impact, on row 2 bay 5 — the red dot the feed also carries */
  const impactX = RACK_X + 4.5 * BAY_W;
  const impactY = 92;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <linearGradient id="mhe-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(255,106,0,0)" />
          <stop offset="0.5" stopColor="rgba(255,106,0,0.22)" />
          <stop offset="1" stopColor="rgba(255,106,0,0)" />
        </linearGradient>
      </defs>

      {/* the racking */}
      {ROWS.map((y, r) => (
        <g key={y}>
          {Array.from({ length: BAYS }, (_, b) => (
            <rect
              key={b}
              x={RACK_X + b * BAY_W + 1}
              y={y - 11}
              width={BAY_W - 2}
              height={22}
              rx={2}
              fill="rgba(255,255,255,0.05)"
              stroke="rgba(255,255,255,0.10)"
              strokeWidth={0.7}
            />
          ))}
          <text
            x={RACK_X - 8}
            y={y + 3.5}
            textAnchor="end"
            fill="rgba(255,255,255,0.35)"
            style={{ font: "600 7px ui-monospace, monospace" }}
          >
            {String.fromCharCode(65 + r)}
          </text>
        </g>
      ))}

      {/* the dock, right */}
      <rect
        x={292}
        y={44}
        width={82}
        height={168}
        rx={6}
        fill="rgba(255,255,255,0.02)"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth={0.7}
        strokeDasharray="4 4"
      />
      <text
        x={333}
        y={38}
        textAnchor="middle"
        fill="rgba(255,255,255,0.35)"
        style={{ font: "700 7px ui-monospace, monospace", letterSpacing: 1.4 }}
      >
        DOCK
      </text>
      {[62, 100, 138, 176].map((y) => (
        <rect
          key={y}
          x={302}
          y={y}
          width={62}
          height={22}
          rx={3}
          fill="rgba(255,255,255,0.03)"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={0.7}
        />
      ))}

      {/* the aisles the fleet runs */}
      {FLEET.map((f) => (
        <line
          key={`lane-${f.y}`}
          x1={26}
          y1={f.y}
          x2={266}
          y2={f.y}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={1}
          strokeDasharray="3 5"
        />
      ))}

      {/* the fleet */}
      {FLEET.map((f, i) => {
        const ink = f.tone === "warn" ? "#FFB020" : "#FF6A00";
        return (
          <motion.g
            key={`mhe-${i}`}
            initial={{ x: f.from }}
            animate={{ x: [f.from, f.to, f.from] }}
            transition={{
              duration: f.dur,
              delay: f.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <rect
              x={-9}
              y={f.y - 5}
              width={18}
              height={10}
              rx={2.5}
              fill={ink}
              opacity={0.95}
            />
            <rect
              x={-5}
              y={f.y - 3}
              width={7}
              height={4}
              rx={1}
              fill="rgba(0,0,0,0.35)"
            />
            <circle cx={9} cy={f.y + 6} r={1.6} fill="rgba(255,255,255,0.45)" />
            <circle cx={-6} cy={f.y + 6} r={1.6} fill="rgba(255,255,255,0.45)" />
            <motion.circle
              cx={0}
              cy={f.y}
              r={12}
              fill="none"
              stroke={ink}
              strokeWidth={0.8}
              animate={{ r: [8, 16, 8], opacity: [0.5, 0, 0.5] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: "easeOut",
                delay: i * 0.5,
              }}
            />
          </motion.g>
        );
      })}

      {/* the impact */}
      <circle cx={impactX} cy={impactY} r={3} fill="#FF4D4D" />
      <motion.circle
        cx={impactX}
        cy={impactY}
        r={10}
        fill="none"
        stroke="rgba(255,77,77,0.75)"
        strokeWidth={1.4}
        animate={{ r: [8, 20, 8], opacity: [0.9, 0, 0.9] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
      />

      {/* the sweep */}
      <motion.rect
        y={24}
        width={40}
        height={VB_H - 40}
        fill="url(#mhe-sweep)"
        initial={{ x: -60 }}
        animate={{ x: VB_W + 20 }}
        transition={{
          duration: 5,
          ease: "linear",
          repeat: Infinity,
          repeatDelay: 0.8,
        }}
      />
    </svg>
  );
}

/** The live event feed, on the findings feed's own rail. */
function FleetFeed() {
  return (
    <>
      <div className="flex items-center justify-between px-4 sm:px-5 pt-4 pb-3 border-b border-white/[0.06]">
        <div className="text-[9px] font-mono font-bold tracking-[0.22em] uppercase text-white/45">
          Live events
        </div>
        <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-white/55">
          <span className="w-1.5 h-1.5 rounded-full bg-signal-orange animate-pulse" />
          Streaming
        </span>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <motion.div
          className="flex flex-col"
          initial={{ y: 0 }}
          animate={{ y: [0, -(FLEET_EVENTS.length * 42)] }}
          transition={{
            duration: FLEET_EVENTS.length * 1.8,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {[...FLEET_EVENTS, ...FLEET_EVENTS].map((ev, i) => {
            const isCritical = ev.status === "critical";
            const isWarning = ev.status === "warning";
            const bg = isCritical
              ? "rgba(255,77,77,0.18)"
              : isWarning
                ? "rgba(255,176,32,0.16)"
                : "rgba(43,203,116,0.16)";
            const color = isCritical
              ? "#FF6C6C"
              : isWarning
                ? "#FFBE47"
                : "#54DE91";
            const glyph = isCritical ? "!" : isWarning ? "•" : "✓";
            return (
              <div
                key={`${ev.id}-${i}`}
                className="flex items-center gap-2.5 px-4 sm:px-5 py-2.5 border-b border-white/[0.04]"
                style={{ height: 42 }}
              >
                <span
                  className="flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold"
                  style={{ background: bg, color }}
                >
                  {glyph}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[10.5px] font-mono font-semibold text-white tabular-nums truncate">
                    {ev.id}
                  </div>
                </div>
                <div className="text-[9.5px] font-mono text-white/50 tabular-nums">
                  {ev.loc}
                </div>
                {(isCritical || isWarning) && "note" in ev && ev.note && (
                  <span
                    className="text-[8.5px] font-mono font-bold tracking-[0.14em] uppercase"
                    style={{ color: isCritical ? "#FF6C6C" : "#FFBE47" }}
                  >
                    {ev.note}
                  </span>
                )}
              </div>
            );
          })}
        </motion.div>

        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-4 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,15,20,1), transparent)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-6 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(10,15,20,1), transparent)",
          }}
        />
      </div>
    </>
  );
}
