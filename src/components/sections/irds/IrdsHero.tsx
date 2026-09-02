"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const EASE = [0.22, 1, 0.36, 1] as const;

export function IrdsHero() {
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
              Rack Safety Intelligence
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
            className="mt-8 text-[56px] sm:text-[84px] lg:text-[112px] font-bold leading-[1.06] tracking-[-0.045em]"
            style={{ letterSpacing: "-0.045em" }}
          >
            <span className="block text-white">Know the health</span>
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
              of every rack.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[16px] text-white/60 leading-[1.55] max-w-[1120px] mx-auto"
          >
            Move beyond periodic inspection. RAMS unifies expert rack
            inspection, digital twin intelligence, RAG risk classification and
            issue closure into one connected rack-safety system aligned to RACS
            and AS4084 standards.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28, ease: EASE }}
            className="mt-8 flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap"
          >
            {[
              "Digital rack identity",
              "Risk-led inspection",
              "Actionable intelligence",
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
              className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-px hover:bg-signal-orange-hover"
            >
              Book a Rack Safety Review
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
            className="relative rounded-[18px] overflow-hidden min-h-[600px] sm:min-h-0 sm:aspect-[16/10]"
            style={{
              background: "linear-gradient(180deg, #0A0F14 0%, #06090C 100%)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              borderRight: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <RackSafetyTwinView />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const FINDING_EVENTS = [
  { id: "F-40218", loc: "B-04 · U-B18", status: "critical", note: "beam lock" },
  { id: "F-40219", loc: "B-05 · U-B21", status: "warning", note: "upright" },
  { id: "F-40220", loc: "C-07 · B-C09", status: "ok" },
  { id: "F-40221", loc: "B-06 · U-B24", status: "warning", note: "deflection" },
  { id: "F-40222", loc: "C-08 · B-C12", status: "ok" },
  { id: "F-40223", loc: "D-02 · U-D04", status: "critical", note: "baseplate" },
  { id: "F-40224", loc: "B-07 · B-B31", status: "ok" },
  { id: "F-40225", loc: "C-09 · U-C17", status: "warning", note: "bracing" },
] as const;

function RackSafetyTwinView() {
  const KPIS = [
    { label: "Rack Health", value: "91%", tone: "orange" as const },
    { label: "Open Findings", value: "14", tone: "white" as const },
    { label: "Critical", value: "2", tone: "white" as const },
  ];

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex items-center justify-between gap-4 flex-wrap px-5 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6">
        <div className="min-w-0">
          <div className="text-[9px] sm:text-[10px] font-mono font-bold tracking-[0.22em] uppercase text-white/45">
            Rack Twin · Pune DC
          </div>
          <div className="mt-1.5 text-[15px] sm:text-[18px] font-semibold text-white tracking-[-0.01em] truncate">
            Aisle B — inspection live
          </div>
        </div>
        <span
          className="inline-flex items-center gap-1.5 text-[9.5px] font-mono font-bold tracking-[0.14em] px-2.5 py-1 rounded-full shrink-0"
          style={{
            background: "rgba(43,203,116,0.13)",
            color: "#54DE91",
          }}
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

      <div className="relative flex-1 grid grid-cols-1 sm:grid-cols-[1.55fr_1fr] gap-4 sm:gap-6 mx-4 sm:mx-8 mb-6 sm:mb-8 min-h-0">
        <div
          className="relative rounded-xl overflow-hidden min-h-[260px] sm:min-h-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <RackElevation />
        </div>

        <div
          className="relative rounded-xl overflow-hidden flex flex-col min-h-[200px] sm:min-h-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <FindingsFeed />
        </div>
      </div>
    </div>
  );
}

function RackElevation() {
  const VB_W = 400;
  const VB_H = 240;
  const PAD_X = 32;
  const PAD_TOP = 34;
  const FLOOR_Y = 210;

  const UPRIGHTS = 5;
  const LEVELS = 3;
  const PALLETS_PER_BAY = 2;

  const BAY_W = (VB_W - PAD_X * 2) / (UPRIGHTS - 1);
  const LEVEL_H = (FLOOR_Y - PAD_TOP) / LEVELS;

  // Pallet presence per bay/level/slot — 0 empty, 1 present (ambient neutral)
  const PALLETS: Record<string, 0 | 1> = {
    "0-0-0": 1,
    "0-0-1": 1,
    "0-1-0": 1,
    "0-1-1": 1,
    "0-2-0": 1,
    "0-2-1": 0,
    "1-0-0": 1,
    "1-0-1": 1,
    "1-1-0": 0,
    "1-1-1": 1,
    "1-2-0": 1,
    "1-2-1": 1,
    "2-0-0": 1,
    "2-0-1": 0,
    "2-1-0": 1,
    "2-1-1": 1,
    "2-2-0": 1,
    "2-2-1": 1,
    "3-0-0": 0,
    "3-0-1": 1,
    "3-1-0": 1,
    "3-1-1": 0,
    "3-2-0": 1,
    "3-2-1": 1,
  };

  // Upright condition: 0 ok, 2 amber, 3 red
  const UPRIGHT_STATE: (0 | 2 | 3)[] = [0, 3, 0, 2, 0];
  // Beam condition per level (bottom→top), per bay index
  const BEAM_STATE: Record<string, 0 | 2 | 3> = {
    "0-0": 0,
    "1-0": 0,
    "2-0": 0,
    "3-0": 0,
    "0-1": 0,
    "1-1": 0,
    "2-1": 0,
    "3-1": 0,
    "0-2": 0,
    "1-2": 0,
    "2-2": 3,
    "3-2": 0,
  };
  // Baseplate condition per upright
  const BASEPLATE_STATE: (0 | 2 | 3)[] = [0, 3, 0, 0, 2];

  // Critical damage focal point (bay 2, level 2 — beam lock failure)
  const excX = PAD_X + 2 * BAY_W + BAY_W * 0.5;
  const excY = FLOOR_Y - 2 * LEVEL_H;

  const damageColor = (s: 0 | 2 | 3) =>
    s === 3 ? "#FF4D4D" : s === 2 ? "#FFB020" : "rgba(255,255,255,0.32)";
  const damageGlow = (s: 0 | 2 | 3) =>
    s === 3
      ? "drop-shadow(0 0 4px rgba(255,77,77,0.65))"
      : s === 2
        ? "drop-shadow(0 0 4px rgba(255,176,32,0.55))"
        : undefined;

  return (
    <div className="absolute inset-0 flex flex-col p-3.5 sm:p-5">
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <div className="text-[8.5px] sm:text-[9px] font-mono font-bold tracking-[0.18em] sm:tracking-[0.22em] uppercase text-white/45">
          Rack Elevation · Aisle B-04
        </div>
        <div className="flex items-center gap-2 text-[8.5px] sm:text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-white/55">
          <span className="inline-flex items-center gap-1">
            <span
              className="w-1.5 h-1.5 rounded-sm"
              style={{ background: "#FF4D4D" }}
            />
            Red
          </span>
          <span className="inline-flex items-center gap-1">
            <span
              className="w-1.5 h-1.5 rounded-sm"
              style={{ background: "#FFB020" }}
            />
            Amber
          </span>
          <span className="inline-flex items-center gap-1">
            <span
              className="w-1.5 h-1.5 rounded-sm"
              style={{ background: "#2BCB74" }}
            />
            Green
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
          {/* Floor */}
          <line
            x1={PAD_X - 10}
            y1={FLOOR_Y + 4}
            x2={VB_W - PAD_X + 10}
            y2={FLOOR_Y + 4}
            stroke="rgba(255,255,255,0.22)"
            strokeWidth={0.75}
          />

          {/* Pallets — ambient neutral, drawn first so rack structure sits on top */}
          {Array.from({ length: UPRIGHTS - 1 }).map((_, bay) =>
            Array.from({ length: LEVELS }).map((_, level) => {
              const beamY = FLOOR_Y - level * LEVEL_H;
              const slotW = BAY_W / PALLETS_PER_BAY;
              return Array.from({ length: PALLETS_PER_BAY }).map((_, slot) => {
                const key = `${bay}-${level}-${slot}`;
                if (PALLETS[key] !== 1) return null;
                const cx = PAD_X + bay * BAY_W + slot * slotW + slotW / 2;
                const boxW = slotW * 0.62;
                const boxH = LEVEL_H * 0.46;
                const boxX = cx - boxW / 2;
                const boxY = beamY - boxH - 1.5;
                return (
                  <rect
                    key={key}
                    x={boxX}
                    y={boxY}
                    width={boxW}
                    height={boxH}
                    rx={1}
                    fill="rgba(255,255,255,0.055)"
                    stroke="rgba(255,255,255,0.10)"
                    strokeWidth={0.5}
                  />
                );
              });
            }),
          )}

          {/* Beams (bay segments, colored per condition) */}
          {Array.from({ length: LEVELS }).map((_, level) => {
            const y = FLOOR_Y - level * LEVEL_H;
            return Array.from({ length: UPRIGHTS - 1 }).map((_, bay) => {
              const x1 = PAD_X + bay * BAY_W;
              const x2 = PAD_X + (bay + 1) * BAY_W;
              const state = BEAM_STATE[`${bay}-${level}`] ?? 0;
              const stroke = damageColor(state);
              const w = state === 0 ? 0.85 : 1.6;
              return (
                <line
                  key={`beam-${bay}-${level}`}
                  x1={x1}
                  y1={y}
                  x2={x2}
                  y2={y}
                  stroke={stroke}
                  strokeWidth={w}
                  style={
                    damageGlow(state)
                      ? { filter: damageGlow(state) }
                      : undefined
                  }
                />
              );
            });
          })}

          {/* Uprights */}
          {Array.from({ length: UPRIGHTS }).map((_, u) => {
            const x = PAD_X + u * BAY_W;
            const state = UPRIGHT_STATE[u] ?? 0;
            const stroke = damageColor(state);
            const w = state === 0 ? 0.85 : 1.6;
            return (
              <line
                key={`upright-${u}`}
                x1={x}
                y1={PAD_TOP - 6}
                x2={x}
                y2={FLOOR_Y + 4}
                stroke={stroke}
                strokeWidth={w}
                style={
                  damageGlow(state) ? { filter: damageGlow(state) } : undefined
                }
              />
            );
          })}

          {/* Baseplates */}
          {Array.from({ length: UPRIGHTS }).map((_, u) => {
            const x = PAD_X + u * BAY_W;
            const state = BASEPLATE_STATE[u] ?? 0;
            const color =
              state === 0 ? "rgba(255,255,255,0.28)" : damageColor(state);
            return (
              <rect
                key={`base-${u}`}
                x={x - 5}
                y={FLOOR_Y + 1}
                width={10}
                height={3}
                rx={0.5}
                fill={color}
                style={
                  damageGlow(state) ? { filter: damageGlow(state) } : undefined
                }
              />
            );
          })}

          {/* Damage markers — small "X" style ticks on failed junctions */}
          {Object.entries(BEAM_STATE).map(([key, state]) => {
            if (state === 0) return null;
            const [bay, level] = key.split("-").map(Number);
            const cx = PAD_X + bay * BAY_W + BAY_W * 0.5;
            const cy = FLOOR_Y - level * LEVEL_H;
            const color = damageColor(state);
            return (
              <g key={`mark-${key}`}>
                <circle cx={cx} cy={cy} r={2.6} fill={color} />
                <circle
                  cx={cx}
                  cy={cy}
                  r={4.5}
                  fill="none"
                  stroke={color}
                  strokeOpacity={0.35}
                  strokeWidth={0.8}
                />
              </g>
            );
          })}

          {/* Focal pulse ring on the critical damage */}
          <motion.circle
            cx={excX}
            cy={excY}
            r={12}
            fill="none"
            stroke="rgba(255,77,77,0.75)"
            strokeWidth={1.5}
            animate={{ r: [10, 22, 10], opacity: [0.9, 0, 0.9] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          />

          {/* Inspection scan sweep */}
          <motion.rect
            aria-hidden
            y={PAD_TOP - 8}
            width={40}
            height={FLOOR_Y - PAD_TOP + 12}
            fill="url(#irds-scan-grad)"
            initial={{ x: -60 }}
            animate={{ x: VB_W + 20 }}
            transition={{
              duration: 4.5,
              ease: "linear",
              repeat: Infinity,
              repeatDelay: 0.6,
            }}
          />
          <defs>
            <linearGradient id="irds-scan-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="rgba(255,106,0,0)" />
              <stop offset="0.5" stopColor="rgba(255,106,0,0.28)" />
              <stop offset="1" stopColor="rgba(255,106,0,0)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5, ease: EASE }}
        className="mt-2 flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg flex-wrap"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,77,77,0.10), rgba(255,77,77,0.04))",
          border: "1px solid rgba(255,77,77,0.28)",
          boxShadow: "0 0 20px -8px rgba(255,77,77,0.35)",
        }}
      >
        <span
          className="inline-flex items-center gap-1.5 text-[8.5px] sm:text-[9px] font-mono font-bold tracking-[0.16em] sm:tracking-[0.18em] uppercase shrink-0"
          style={{ color: "#FF6C6C" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "#FF4D4D" }}
          />
          Critical
        </span>
        <span className="text-[10.5px] sm:text-[11px] font-semibold text-white leading-tight truncate min-w-0 flex-1">
          B-04 · U-B18 — beam lock failure
        </span>
        <span className="text-[9.5px] sm:text-[10px] font-mono text-white/55 tabular-nums shrink-0">
          RAG · Red · Action
        </span>
      </motion.div>
    </div>
  );
}

function FindingsFeed() {
  return (
    <>
      <div className="flex items-center justify-between px-4 sm:px-5 pt-4 pb-3 border-b border-white/[0.06]">
        <div className="text-[9px] font-mono font-bold tracking-[0.22em] uppercase text-white/45">
          Findings Feed
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
          animate={{ y: [0, -(FINDING_EVENTS.length * 42)] }}
          transition={{
            duration: FINDING_EVENTS.length * 1.8,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {[...FINDING_EVENTS, ...FINDING_EVENTS].map((ev, i) => {
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
            background:
              "linear-gradient(to top, rgba(10,15,20,1), transparent)",
          }}
        />
      </div>
    </>
  );
}
