"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { EASE, RAG, AppSelect, AppShell } from "./rackiq-shared";

/**
 * The hero composite — driven by the product-line tabs above it.
 *
 * One view per word: Inspect, Measure, Classify, Understand, Act, Verify.
 * `Understand` swaps the rack elevation for the warehouse plan, because that
 * is the point where a single finding becomes a pattern.
 */

export const HERO_STAGES = [
  "Inspect",
  "Measure",
  "Classify",
  "Understand",
  "Resolve",
] as const;

export type HeroStage = number;

/* rack elevation geometry */
const BAYS = 8;
const BAY_W = 62;
const X0 = 46;
const Y_TOP = 92;
const Y_BASE = 288;
const LEVELS = [136, 178, 220, 262];
const HIT_UPRIGHT = 6;

const CAPTION = [
  "Guided element capture on the rack",
  "Measurement against the configured limit",
  "Risk, lifecycle and responsibility",
  "The same defect, warehouse-wide",
  "Corrected, verified, closed — and kept on record",
];

export function RiqHeroVisual({ stage }: { stage: HeroStage }) {
  const reduce = useReducedMotion();

  const isPlan = stage === 3;
  const isVerified = stage === 4;
  const hitX = X0 + HIT_UPRIGHT * BAY_W;
  const hitColour = isVerified ? RAG.green.app : RAG.red.app;

  return (
    <AppShell
      module={isPlan ? "Inspection Cycle Insights" : "Rack Health Analytics"}
      title={isPlan ? "Spatial analysis · WH-01" : "Rack Health Analytics"}
      toolbar={
        <div className="flex items-center gap-2 flex-wrap">
          <AppSelect>Warehouse</AppSelect>
          <AppSelect>Aisle 07</AppSelect>
          <span
            className="inline-flex items-center h-8 rounded-lg overflow-hidden text-[11px] font-semibold"
            style={{ border: "1px solid #E4E6EC" }}
          >
            <span
              className="px-2.5 py-1.5"
              style={{
                background: isPlan ? "#2F6BFF" : "transparent",
                color: isPlan ? "#FFFFFF" : "#6E6E73",
              }}
            >
              2D
            </span>
            <span
              className="px-2.5 py-1.5"
              style={{
                background: isPlan ? "transparent" : "#2F6BFF",
                color: isPlan ? "#6E6E73" : "#FFFFFF",
              }}
            >
              3D
            </span>
          </span>
        </div>
      }
    >
      <div className="relative">
        {/* ── viewport ────────────────────────────────────── */}
        <div
          className="relative w-full overflow-hidden"
          style={{
            borderRadius: 12,
            background: "linear-gradient(180deg, #F7F9FC 0%, #EDF1F7 100%)",
            border: "1px solid #E7EAF0",
          }}
        >
          <svg
            viewBox="0 0 620 340"
            className="w-full h-auto block"
            role="img"
            aria-label={CAPTION[stage]}
          >
            <defs>
              <linearGradient id="riq-upright" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B5BA9" />
                <stop offset="100%" stopColor="#2A4278" />
              </linearGradient>
              <radialGradient id="riq-hot">
                <stop offset="0%" stopColor="#DC2626" stopOpacity="0.55" />
                <stop offset="55%" stopColor="#F59E0B" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="riq-warm">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.34" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
              </radialGradient>
            </defs>

            <path
              d="M0 288 H620"
              stroke="#CFD6E2"
              strokeWidth="1"
              strokeDasharray="3 4"
            />

            <AnimatePresence mode="wait">
              {!isPlan ? (
                /* ── elevation: one rack run ──────────────── */
                <motion.g
                  key="elevation"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  {LEVELS.map((y, li) =>
                    Array.from({ length: BAYS }).map((_, b) => (
                      <rect
                        key={`beam-${li}-${b}`}
                        x={X0 + b * BAY_W + 4}
                        y={y}
                        width={BAY_W - 8}
                        height={5}
                        rx={1.5}
                        fill="#D2691E"
                      />
                    ))
                  )}

                  {Array.from({ length: BAYS + 1 }).map((_, i) => {
                    const x = X0 + i * BAY_W;
                    const hit = i === HIT_UPRIGHT;
                    return (
                      <motion.rect
                        key={`up-${i}`}
                        x={x - 3.5}
                        y={Y_TOP}
                        width={7}
                        height={Y_BASE - Y_TOP}
                        rx={2}
                        animate={{
                          fill: hit ? hitColour : "#2F4A85",
                        }}
                        transition={{ duration: 0.45, ease: EASE }}
                        fill={hit ? hitColour : "url(#riq-upright)"}
                      />
                    );
                  })}

                  {Array.from({ length: BAYS + 1 }).map((_, i) => (
                    <rect
                      key={`bp-${i}`}
                      x={X0 + i * BAY_W - 7}
                      y={Y_BASE}
                      width={14}
                      height={4}
                      rx={1}
                      fill="#98A2B3"
                    />
                  ))}

                  {/* the finding */}
                  <motion.g
                    initial={false}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.35 }}
                  >
                    {!isVerified && (
                      <motion.circle
                        cx={hitX}
                        cy={232}
                        r={20}
                        fill="none"
                        stroke={RAG.red.app}
                        strokeWidth="1.5"
                        initial={{ scale: 0.4, opacity: 0.9 }}
                        animate={
                          reduce
                            ? { scale: 1, opacity: 0.5 }
                            : { scale: [0.5, 1.25], opacity: [0.9, 0] }
                        }
                        style={{ transformOrigin: `${hitX}px 232px` }}
                        transition={
                          reduce
                            ? { duration: 0.3 }
                            : { duration: 1.6, repeat: Infinity, ease: "easeOut" }
                        }
                      />
                    )}
                    <circle cx={hitX} cy={232} r={5.5} fill={hitColour} />
                    {isVerified ? (
                      <path
                        d={`M${hitX - 2.6} 232 l1.9 2 l3.4 -3.8`}
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ) : (
                      <circle cx={hitX} cy={232} r={2} fill="#FFFFFF" />
                    )}
                  </motion.g>

                  {/* already-known findings on the run */}
                  {[
                    { i: 2, y: 190, rag: "amber" as const },
                    { i: 4, y: 268, rag: "green" as const },
                  ].map((m) => (
                    <circle
                      key={`m-${m.i}`}
                      cx={X0 + m.i * BAY_W}
                      cy={m.y}
                      r={4}
                      fill={RAG[m.rag].app}
                    />
                  ))}

                  {/* capture sweep, only while inspecting */}
                  {stage === 0 && !reduce && (
                    <motion.rect
                      x={X0 - 10}
                      y={Y_TOP - 6}
                      width={44}
                      height={Y_BASE - Y_TOP + 12}
                      rx={6}
                      fill="rgba(255,106,0,0.10)"
                      stroke="rgba(255,106,0,0.55)"
                      strokeWidth="1.2"
                      initial={{ x: 0 }}
                      animate={{ x: [0, BAYS * BAY_W - 24, 0] }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </motion.g>
              ) : (
                /* ── plan: the same defect, warehouse-wide ── */
                <motion.g
                  key="plan"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  {Array.from({ length: 7 }).map((_, r) => (
                    <g key={`aisle-${r}`}>
                      <rect
                        x={60}
                        y={62 + r * 32}
                        width={500}
                        height={12}
                        rx={2}
                        fill="#C9D2E2"
                      />
                      <text
                        x={44}
                        y={72 + r * 32}
                        fontSize="8"
                        fontWeight="700"
                        fill="#8A93A5"
                        textAnchor="end"
                      >
                        A{String(r + 1).padStart(2, "0")}
                      </text>
                    </g>
                  ))}

                  <ellipse cx={95} cy={168} rx={78} ry={62} fill="url(#riq-hot)" />
                  <ellipse cx={528} cy={200} rx={70} ry={56} fill="url(#riq-hot)" />
                  <ellipse cx={300} cy={110} rx={62} ry={44} fill="url(#riq-warm)" />

                  {[
                    [92, 160], [104, 176], [86, 190], [112, 148], [98, 204],
                    [520, 196], [536, 210], [512, 182], [544, 190],
                    [292, 108], [308, 118], [284, 122],
                    [200, 236], [412, 76],
                  ].map(([cx, cy], i) => (
                    <motion.circle
                      key={`p-${i}`}
                      cx={cx}
                      cy={cy}
                      r={3}
                      fill={i < 9 ? RAG.red.app : RAG.amber.app}
                      initial={reduce ? false : { opacity: 0, scale: 0 }}
                      animate={{ opacity: 0.95, scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: reduce ? 0 : 0.08 + i * 0.03,
                      }}
                    />
                  ))}
                </motion.g>
              )}
            </AnimatePresence>
          </svg>

          {/* ── per-stage overlay ────────────────────────── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.32, ease: EASE }}
              className={
                stage === 0 || stage === 3 || stage === 4
                  ? "absolute bottom-[6%] left-[4%] right-[4%] sm:right-auto"
                  : "absolute top-[9%] right-[4%] w-[210px] sm:w-[240px]"
              }
            >
              {stage === 0 && <InspectCard />}
              {stage === 1 && <MeasureCard />}
              {stage === 2 && <ClassifyCard />}
              {stage === 3 && <UnderstandCard />}
              {stage === 4 && <ResolveCard />}
            </motion.div>
          </AnimatePresence>

          {/* legend */}
          <div
            className="absolute top-3 left-3 flex items-center gap-3 px-2.5 py-1.5 rounded-lg"
            style={{
              background: "rgba(255,255,255,0.92)",
              border: "1px solid #E7EAF0",
            }}
          >
            {(["green", "amber", "red"] as const).map((r) => (
              <span key={r} className="flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: RAG[r].app }}
                />
                <span className="text-[9.5px] font-mono font-semibold text-graphite/55 tabular-nums">
                  {r === "green" ? "131" : r === "amber" ? "41" : "20"}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* caption */}
        <div className="mt-3.5 flex items-center justify-between gap-4 flex-wrap">
          <span className="text-[10.5px] font-mono tracking-[0.1em] uppercase text-graphite/50">
            {CAPTION[stage]}
          </span>
          <span className="text-[9.5px] font-mono tracking-[0.12em] uppercase text-graphite/30">
            Illustrative UI
          </span>
        </div>
      </div>
    </AppShell>
  );
}

/* ── overlay cards ─────────────────────────────────────── */

const CARD: React.CSSProperties = {
  borderRadius: 12,
  background: "rgba(255,255,255,0.97)",
  border: "1px solid #E4E6EC",
  boxShadow: "0 18px 44px -18px rgba(14,14,15,0.28)",
  backdropFilter: "blur(6px)",
};

function CardHead({ k, pill, tone }: { k: string; pill?: string; tone?: string }) {
  return (
    <div className="flex items-center justify-between gap-2 mb-2.5">
      <span className="text-[10px] font-mono font-bold tracking-[0.14em] uppercase text-graphite/45">
        {k}
      </span>
      {pill && (
        <span
          className="inline-flex items-center px-1.5 py-[2px] rounded-full text-[9px] font-mono font-bold tracking-[0.1em] uppercase"
          style={{
            background: tone === "green" ? RAG.green.appBg : RAG.red.appBg,
            color: tone === "green" ? RAG.green.app : RAG.red.app,
          }}
        >
          {pill}
        </span>
      )}
    </div>
  );
}

function Row({ k, v, hot }: { k: string; v: string; hot?: boolean }) {
  return (
    <div
      className="flex items-baseline justify-between gap-3 py-[5px]"
      style={{ borderTop: "1px solid #F0F1F5" }}
    >
      <span className="text-[10.5px] text-graphite/50">{k}</span>
      <span
        className="text-[11.5px] font-semibold tabular-nums"
        style={{ color: hot ? RAG.red.app : "#0E0E0F" }}
      >
        {v}
      </span>
    </div>
  );
}

function InspectCard() {
  return (
    <div className="px-3.5 py-3 sm:w-[400px]" style={CARD}>
      <div className="flex items-center gap-2 mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
        <span className="text-[10px] font-mono font-bold tracking-[0.14em] uppercase text-graphite/45">
          Capturing · R07 · B14 · L3
        </span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {["Uprights", "Bracing", "Beams", "Safety locks", "Plumbness"].map(
          (e, i) => (
            <span
              key={e}
              className="px-2 py-1 rounded-md text-[10.5px] font-medium"
              style={{
                background: i === 0 ? RAG.red.appBg : "#F1F2F5",
                color: i === 0 ? RAG.red.app : "#6E6E73",
              }}
            >
              {e}
            </span>
          )
        )}
      </div>
    </div>
  );
}

function MeasureCard() {
  return (
    <div className="p-3.5" style={CARD}>
      <CardHead k="Integrity test" pill="Outside limit" />
      <div className="flex items-end gap-5 py-1">
        <span className="flex flex-col">
          <span className="text-[9px] font-mono tracking-[0.1em] uppercase text-graphite/40">
            Measured
          </span>
          <span
            className="text-[26px] font-bold tabular-nums leading-none mt-1"
            style={{ color: RAG.red.app }}
          >
            14.2
            <span className="text-[11px] font-semibold ml-0.5">mm</span>
          </span>
        </span>
        <span className="flex flex-col">
          <span className="text-[9px] font-mono tracking-[0.1em] uppercase text-graphite/40">
            Limit
          </span>
          <span className="text-[26px] font-bold tabular-nums leading-none mt-1 text-carbon">
            10.0
            <span className="text-[11px] font-semibold ml-0.5">mm</span>
          </span>
        </span>
      </div>
      <div className="mt-3 relative h-1.5 rounded-full" style={{ background: "#EDEEF2" }}>
        <span
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ width: "58%", background: RAG.green.app, opacity: 0.4 }}
        />
        <span
          className="absolute top-1/2 -translate-y-1/2 w-px h-3"
          style={{ left: "58%", background: "#0E0E0F" }}
        />
        <motion.span
          className="absolute top-1/2 w-3 h-3 rounded-full border-2 border-white"
          style={{ background: RAG.red.app, marginTop: -6 }}
          initial={{ left: "0%" }}
          animate={{ left: "calc(82% - 6px)" }}
          transition={{ duration: 0.7, ease: EASE }}
        />
      </div>
    </div>
  );
}

function ClassifyCard() {
  return (
    <div className="p-3.5" style={CARD}>
      <CardHead k="R07 · B14 · L3 · Upright" pill="Red" />
      <Row k="Finding" v="Upright bent — impact" />
      <Row k="Lifecycle" v="Operation" />
      <Row k="Action" v="Replace" />
      <Row k="Owner" v="Maintenance" />
      <Row k="Due" v="19 Aug" />
    </div>
  );
}

function UnderstandCard() {
  return (
    <div className="px-3.5 py-3 sm:w-[360px]" style={CARD}>
      <p className="text-[10px] font-mono font-bold tracking-[0.14em] uppercase text-graphite/45 mb-1.5">
        Aisle 01 · aisle-end uprights
      </p>
      <p className="text-[12.5px] font-semibold text-carbon">
        Repeat impact damage across 4 inspection cycles
      </p>
    </div>
  );
}

/** The whole close-out in one strip: assigned → repaired → verified → closed. */
function ResolveCard() {
  const TRAIL = [
    ["Assigned", "Maintenance · 02 Jul"],
    ["Repaired", "Upright replaced · 12 Jul"],
    ["Verified", "Re-test 3.1 mm · 15 Jul"],
    ["Closed", "Kept on the rack record"],
  ];
  return (
    <div className="px-4 py-3.5 sm:w-[440px]" style={CARD}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-[10px] font-mono font-bold tracking-[0.14em] uppercase text-graphite/45">
          Finding F-2231
        </span>
        <span
          className="inline-flex items-center gap-1.5 px-2 py-[2px] rounded-full text-[9px] font-mono font-bold tracking-[0.1em] uppercase"
          style={{ background: RAG.green.appBg, color: RAG.green.app }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: RAG.green.app }}
          />
          Closed
        </span>
      </div>

      <div className="flex items-start gap-1.5">
        {TRAIL.map(([k, v], i) => (
          <span key={k} className="flex-1 min-w-0">
            <span className="flex items-center gap-1.5 mb-1.5">
              <span
                className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0"
                style={{ background: RAG.green.app }}
              >
                <svg viewBox="0 0 16 16" className="w-2.5 h-2.5" aria-hidden>
                  <path
                    d="M3.5 8.5 6.5 11.5 12.5 5"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {i < TRAIL.length - 1 && (
                <span
                  className="flex-1 h-px"
                  style={{ background: RAG.green.app, opacity: 0.35 }}
                />
              )}
            </span>
            <span className="block text-[10px] font-semibold text-carbon truncate">
              {k}
            </span>
            <span className="block text-[9.5px] text-graphite/45 leading-[1.35]">
              {v}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
