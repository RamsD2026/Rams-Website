"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const EASE = [0.22, 1, 0.36, 1] as const;

export function InvHero() {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(80% 100% at 50% 0%, #1D1D1F 0%, #0E0E0F 55%, #08080A 100%)",
      }}
    >
      {/* soft signal-orange glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[720px]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 20%, rgba(255,106,0,0.22), transparent 70%)",
        }}
      />
      {/* fine grid */}
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
              Inventory Intelligence
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
            className="mt-8 text-[56px] sm:text-[84px] lg:text-[112px] font-bold leading-[0.98] tracking-[-0.045em]"
            style={{ letterSpacing: "-0.045em" }}
          >
            <span className="block text-white">Know what you have.</span>
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
              Know where it is.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[16px] text-white/60 leading-[1.55] max-w-[880px] mx-auto"
          >
            RAMS turns inventory movement, location and reconciliation data
            into a connected intelligence layer — helping warehouse teams
            improve stock visibility, accuracy, aging control and inventory
            productivity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28, ease: EASE }}
            className="mt-8 flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap"
          >
            {[
              "Inventory visibility",
              "Reconciliation intelligence",
              "Exception-led control",
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
              Assess My Inventory
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 text-white text-[14px] font-semibold px-6 py-3.5 rounded-full border border-white/15 transition-all duration-200 hover:bg-white/[0.06]"
            >
              Explore Capabilities
            </Link>
          </motion.div>
        </div>

        {/* Floating product panel */}
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
              background:
                "linear-gradient(180deg, #0A0F14 0%, #06090C 100%)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              borderRight: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <InventoryTwinView />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Inventory Twin — visibility (rack grid) + reconciliation feed
   + exception-led control (highlighted anomalies)
   ───────────────────────────────────────────────────────────── */

const RECON_EVENTS = [
  { id: "P-102384", loc: "B-04-12", status: "match" },
  { id: "P-102385", loc: "B-04-13", status: "match" },
  { id: "P-102386", loc: "C-05-07", status: "exception", note: "phantom" },
  { id: "P-102387", loc: "B-05-01", status: "match" },
  { id: "P-102388", loc: "B-05-02", status: "match" },
  { id: "P-102389", loc: "C-07-03", status: "exception", note: "misplaced" },
  { id: "P-102390", loc: "B-06-08", status: "match" },
  { id: "P-102391", loc: "B-07-04", status: "match" },
] as const;

function InventoryTwinView() {
  const KPIS = [
    { label: "Accuracy", value: "98.2%", tone: "orange" as const },
    { label: "Exceptions", value: "12", tone: "white" as const },
    { label: "Aging", value: "7.4%", tone: "white" as const },
  ];

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Header bar — title + LIVE + inline KPI chips */}
      <div className="flex items-center justify-between gap-4 flex-wrap px-5 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6">
        <div className="min-w-0">
          <div className="text-[9px] sm:text-[10px] font-mono font-bold tracking-[0.22em] uppercase text-white/45">
            Inventory Twin · Sydney DC
          </div>
          <div className="mt-1.5 text-[15px] sm:text-[18px] font-semibold text-white tracking-[-0.01em] truncate">
            Zone B — reconciliation live
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

      {/* KPI chip row — compact inline */}
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

      {/* Main split — rack (visibility) + feed (reconciliation + exceptions) */}
      <div className="relative flex-1 grid grid-cols-1 sm:grid-cols-[1.55fr_1fr] gap-4 sm:gap-6 mx-4 sm:mx-8 mb-6 sm:mb-8 min-h-0">
        {/* LEFT: rack grid */}
        <div
          className="relative rounded-xl overflow-hidden min-h-[260px] sm:min-h-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <RackGrid />
        </div>

        {/* RIGHT: reconciliation feed */}
        <div
          className="relative rounded-xl overflow-hidden flex flex-col min-h-[200px] sm:min-h-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <ReconciliationFeed />
        </div>
      </div>
    </div>
  );
}

/* Rack elevation — uprights, beams and pallets (side view) */
function RackGrid() {
  // Elevation geometry (SVG viewBox 400 × 240)
  const VB_W = 400;
  const VB_H = 240;
  const PAD_X = 32;
  const PAD_TOP = 34;
  const FLOOR_Y = 210;

  const UPRIGHTS = 5;              // → 4 bays across (more air)
  const LEVELS = 3;                // ground + 2 upper beam levels
  const PALLETS_PER_BAY = 2;

  const BAY_W = (VB_W - PAD_X * 2) / (UPRIGHTS - 1);
  const LEVEL_H = (FLOOR_Y - PAD_TOP) / LEVELS;

  // pallet state per (bay, level, slot)  — 0=empty, 1=filled, 2=exception
  const STATE: Record<string, 0 | 1 | 2> = {
    "0-0-0": 1, "0-0-1": 1, "0-1-0": 1, "0-1-1": 0, "0-2-0": 1, "0-2-1": 0,
    "1-0-0": 1, "1-0-1": 2, "1-1-0": 0, "1-1-1": 1, "1-2-0": 1, "1-2-1": 1,
    "2-0-0": 1, "2-0-1": 0, "2-1-0": 1, "2-1-1": 1, "2-2-0": 0, "2-2-1": 1,
    "3-0-0": 0, "3-0-1": 1, "3-1-0": 1, "3-1-1": 0, "3-2-0": 1, "3-2-1": 1,
  };

  // exception coord (bay=1, level=0, slot=1) → screen pos for pulse & callout
  const excBay = 1, excLevel = 0, excSlot = 1;
  const excBayX = PAD_X + excBay * BAY_W;
  const excSlotW = BAY_W / PALLETS_PER_BAY;
  const excX = excBayX + excSlot * excSlotW + excSlotW / 2;
  const excY = FLOOR_Y - excLevel * LEVEL_H - LEVEL_H * 0.42;

  return (
    <div className="absolute inset-0 flex flex-col p-3.5 sm:p-5">
      {/* header */}
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <div className="text-[8.5px] sm:text-[9px] font-mono font-bold tracking-[0.18em] sm:tracking-[0.22em] uppercase text-white/45">
          Rack Visibility · Aisle B-04
        </div>
        <div className="flex items-center gap-2 text-[8.5px] sm:text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-white/55">
          <span className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-sm bg-signal-orange" />
            Exception
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-sm bg-white/40" />
            Pallet
          </span>
        </div>
      </div>

      {/* rack elevation SVG */}
      <div className="relative flex-1 min-h-0">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 w-full h-full"
          aria-hidden
        >

          {/* floor line */}
          <line
            x1={PAD_X - 6}
            y1={FLOOR_Y + 4}
            x2={VB_W - PAD_X + 6}
            y2={FLOOR_Y + 4}
            stroke="rgba(255,255,255,0.22)"
            strokeWidth={0.75}
          />

          {/* horizontal beams — thin smooth lines */}
          {Array.from({ length: LEVELS }).map((_, l) => {
            const y = FLOOR_Y - l * LEVEL_H;
            return (
              <line
                key={`beam-${l}`}
                x1={PAD_X - 3}
                y1={y}
                x2={VB_W - PAD_X + 3}
                y2={y}
                stroke="rgba(255,255,255,0.28)"
                strokeWidth={0.75}
              />
            );
          })}

          {/* vertical uprights — thin smooth lines */}
          {Array.from({ length: UPRIGHTS }).map((_, u) => {
            const x = PAD_X + u * BAY_W;
            return (
              <line
                key={`upright-${u}`}
                x1={x}
                y1={PAD_TOP - 6}
                x2={x}
                y2={FLOOR_Y + 4}
                stroke="rgba(255,255,255,0.28)"
                strokeWidth={0.75}
              />
            );
          })}

          {/* pallets sitting on beams — simple squares */}
          {Array.from({ length: UPRIGHTS - 1 }).map((_, bay) =>
            Array.from({ length: LEVELS }).map((_, level) => {
              const beamY = FLOOR_Y - level * LEVEL_H;
              const slotW = BAY_W / PALLETS_PER_BAY;
              return Array.from({ length: PALLETS_PER_BAY }).map((_, slot) => {
                const key = `${bay}-${level}-${slot}`;
                const state = STATE[key] ?? 0;
                if (state === 0) return null;
                const isExc = state === 2;
                const cx = PAD_X + bay * BAY_W + slot * slotW + slotW / 2;
                const boxW = slotW * 0.62;
                const boxH = LEVEL_H * 0.48;
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
                    fill={
                      isExc ? "rgba(255,106,0,0.95)" : "rgba(255,255,255,0.14)"
                    }
                    stroke={
                      isExc ? "rgba(255,106,0,1)" : "rgba(255,255,255,0.22)"
                    }
                    strokeWidth={0.6}
                    style={
                      isExc
                        ? {
                            filter:
                              "drop-shadow(0 0 6px rgba(255,106,0,0.6))",
                          }
                        : undefined
                    }
                  />
                );
              });
            }),
          )}

          {/* exception pulse ring */}
          <motion.circle
            cx={excX}
            cy={excY}
            r={12}
            fill="none"
            stroke="rgba(255,106,0,0.7)"
            strokeWidth={1.5}
            animate={{ r: [10, 22, 10], opacity: [0.9, 0, 0.9] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          />

          {/* animated scan sweep */}
          <motion.rect
            aria-hidden
            y={PAD_TOP - 8}
            width={40}
            height={FLOOR_Y - PAD_TOP + 12}
            fill="url(#scan-grad)"
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
            <linearGradient id="scan-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="rgba(255,106,0,0)" />
              <stop offset="0.5" stopColor="rgba(255,106,0,0.28)" />
              <stop offset="1" stopColor="rgba(255,106,0,0)" />
            </linearGradient>
          </defs>
        </svg>

      </div>

      {/* Exception footer bar — inline, no overlap */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5, ease: EASE }}
        className="mt-2 flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg flex-wrap"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,106,0,0.10), rgba(255,106,0,0.04))",
          border: "1px solid rgba(255,106,0,0.28)",
          boxShadow: "0 0 20px -8px rgba(255,106,0,0.35)",
        }}
      >
        <span className="inline-flex items-center gap-1.5 text-[8.5px] sm:text-[9px] font-mono font-bold tracking-[0.16em] sm:tracking-[0.18em] uppercase text-signal-orange shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-signal-orange animate-pulse" />
          Exception
        </span>
        <span className="text-[10.5px] sm:text-[11px] font-semibold text-white leading-tight truncate min-w-0 flex-1">
          B-04 · L1 · Slot 4 — phantom stock
        </span>
        <span className="text-[9.5px] sm:text-[10px] font-mono text-white/55 tabular-nums shrink-0">
          Exp 48 · Cnt 0
        </span>
      </motion.div>
    </div>
  );
}

/* Reconciliation feed — pallets streaming with match/exception rows */
function ReconciliationFeed() {
  return (
    <>
      <div className="flex items-center justify-between px-4 sm:px-5 pt-4 pb-3 border-b border-white/[0.06]">
        <div className="text-[9px] font-mono font-bold tracking-[0.22em] uppercase text-white/45">
          Reconciliation Feed
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
          animate={{ y: [0, -(RECON_EVENTS.length * 42)] }}
          transition={{
            duration: RECON_EVENTS.length * 1.8,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {[...RECON_EVENTS, ...RECON_EVENTS].map((ev, i) => {
            const isEx = ev.status === "exception";
            return (
              <div
                key={`${ev.id}-${i}`}
                className="flex items-center gap-2.5 px-4 sm:px-5 py-2.5 border-b border-white/[0.04]"
                style={{ height: 42 }}
              >
                <span
                  className="flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold"
                  style={{
                    background: isEx
                      ? "rgba(255,106,0,0.18)"
                      : "rgba(43,203,116,0.16)",
                    color: isEx ? "#FF8A3C" : "#54DE91",
                  }}
                >
                  {isEx ? "!" : "✓"}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[10.5px] font-mono font-semibold text-white tabular-nums truncate">
                    {ev.id}
                  </div>
                </div>
                <div className="text-[9.5px] font-mono text-white/50 tabular-nums">
                  {ev.loc}
                </div>
                {isEx && "note" in ev && ev.note && (
                  <span className="text-[8.5px] font-mono font-bold tracking-[0.14em] uppercase text-signal-orange">
                    {ev.note}
                  </span>
                )}
              </div>
            );
          })}
        </motion.div>

        {/* top/bottom fade */}
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

