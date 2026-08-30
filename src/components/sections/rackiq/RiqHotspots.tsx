"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, RAG, type Rag } from "./rackiq-shared";

/**
 * Hotspots & pattern intelligence.
 *
 * Built on the InvAnalytics composition: dark radial section, fine grid at 5%,
 * a corner glow, a centred header and a framed dashboard panel beneath it.
 *
 * The content is unchanged from the light version — same heading, same toggle
 * labels, same map, same pattern chain, same claim boundary. Only the surface
 * and the palette moved, so the map's plan furniture is redrawn in white
 * alphas instead of the warm greys it used on paper.
 */

type Pt = { x: number; y: number; rag: Rag };

const AISLES = 7;
const A_Y0 = 74;
const A_GAP = 42;
const A_X0 = 92;
const A_W = 720;

/** Deterministic scatter — a small LCG so the map never reshuffles. */
function makePoints(): Pt[] {
  let seed = 20260827;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const pts: Pt[] = [];
  const clusters: [number, number, number, number, number][] = [
    [A_X0 + 26, A_Y0 + A_GAP * 0.6, 13, 46, 0.62],
    [A_X0 + A_W - 34, A_Y0 + A_GAP * 3.4, 11, 42, 0.55],
    [A_X0 + A_W * 0.5, A_Y0 + A_GAP * 1.2, 7, 54, 0.2],
    [A_X0 + A_W * 0.28, A_Y0 + A_GAP * 5.2, 5, 60, 0.15],
    [A_X0 + A_W * 0.72, A_Y0 + A_GAP * 5.6, 4, 58, 0.1],
  ];
  clusters.forEach(([cx, cy, n, spread, redBias]) => {
    for (let i = 0; i < n; i++) {
      const a = rnd() * Math.PI * 2;
      const r = Math.sqrt(rnd()) * spread;
      const rr = rnd();
      pts.push({
        x: cx + Math.cos(a) * r,
        y: cy + Math.sin(a) * r * 0.7,
        rag: rr < redBias ? "red" : rr < redBias + 0.32 ? "amber" : "green",
      });
    }
  });
  for (let i = 0; i < 14; i++) {
    pts.push({
      x: A_X0 + 30 + rnd() * (A_W - 60),
      y: A_Y0 + rnd() * (A_GAP * AISLES - 20),
      rag: rnd() < 0.14 ? "red" : rnd() < 0.4 ? "amber" : "green",
    });
  }
  return pts;
}

const PATTERN = [
  "Aisle 07",
  "Repeated upright damage",
  "High Red / Amber concentration",
  "Mostly at aisle end · Operation",
  "Repeated across inspection cycles",
];

const MODES = [
  { k: "findings", l: "Individual findings" },
  { k: "hotspot", l: "Hotspot concentration" },
] as const;

/**
 * The pattern the map adds up to, built in the language the solution-page
 * heroes use for their live panels: a mono header with a pulsing status pill,
 * rows that arrive in sequence on a loop, a spine connecting them, and an
 * alert strip at the foot carrying the conclusion.
 *
 * The analysis replays rather than sitting finished, because the argument is
 * that a pattern is derived — each line only follows from the one above it.
 */
function PatternPanel() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(reduce ? PATTERN.length + 1 : 0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(
      () => setStep((v) => (v + 1) % (PATTERN.length + 3)),
      900,
    );
    return () => clearInterval(id);
  }, [reduce]);

  const settled = step >= PATTERN.length;

  return (
    <div
      className="flex flex-col overflow-hidden h-full"
      style={{
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        borderLeft: "1px solid rgba(255,255,255,0.08)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center justify-between px-4 sm:px-5 pt-4 pb-3 border-b border-white/[0.06]">
        <span className="text-[9px] font-mono font-bold tracking-[0.22em] uppercase text-white/45">
          Pattern Analysis
        </span>
        <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-white/55">
          <span
            className={
              "w-1.5 h-1.5 rounded-full bg-signal-orange " +
              (reduce ? "" : "animate-pulse")
            }
          />
          {settled ? "Resolved" : "Analysing"}
        </span>
      </div>

      <div className="relative flex-1 flex flex-col justify-center px-4 sm:px-5 py-5">
        {/* the spine the rows hang from */}
        <span
          aria-hidden
          className="absolute left-[25px] sm:left-[29px] top-7 bottom-7 w-px"
          style={{ background: "rgba(255,255,255,0.09)" }}
        />

        {PATTERN.map((p, i) => {
          const shown = i <= step;
          const live = i === step;
          return (
            <motion.div
              key={p}
              animate={{ opacity: shown ? 1 : 0.22 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="relative flex items-start gap-3 py-2.5"
            >
              <span
                className="relative z-10 flex items-center justify-center w-[18px] h-[18px] rounded-full shrink-0 mt-[1px] text-[9px] font-mono font-bold transition-colors duration-300"
                style={{
                  background: live
                    ? "#FF6A00"
                    : shown
                      ? "rgba(255,106,0,0.16)"
                      : "rgba(255,255,255,0.06)",
                  color: live
                    ? "#FFFFFF"
                    : shown
                      ? "#FF9B4D"
                      : "rgba(255,255,255,0.4)",
                  boxShadow: live ? "0 0 0 4px rgba(255,106,0,0.14)" : "none",
                }}
              >
                {i + 1}
              </span>
              <span
                className="text-[12.5px] leading-[1.4] transition-colors duration-300"
                style={{
                  color: shown
                    ? "rgba(255,255,255,0.88)"
                    : "rgba(255,255,255,0.45)",
                }}
              >
                {p}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* the conclusion, in the heroes' alert-strip treatment */}
      <div className="px-4 sm:px-5 pb-4">
        <motion.div
          animate={{ opacity: settled ? 1 : 0.35, y: settled ? 0 : 4 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,106,0,0.12), rgba(255,106,0,0.04))",
            border: "1px solid rgba(255,106,0,0.28)",
            boxShadow: "0 0 20px -8px rgba(255,106,0,0.35)",
          }}
        >
          <span
            className={
              "w-1.5 h-1.5 rounded-full shrink-0 bg-signal-orange " +
              (settled && !reduce ? "animate-pulse" : "")
            }
          />
          <span className="text-[10px] font-mono font-bold tracking-[0.14em] uppercase text-signal-orange leading-tight">
            Aisle 07 end — west zone
          </span>
        </motion.div>

        <p className="mt-3.5 text-[10px] font-mono leading-[1.6] text-white/35">
          Patterns are presented as information that supports investigation —
          IRDS does not automatically attribute the cause.
        </p>
      </div>
    </div>
  );
}

/* plan furniture, redrawn for a dark ground */
const PLAN_LINE = "rgba(255,255,255,0.16)";
const PLAN_FILL = "rgba(255,255,255,0.09)";
const PLAN_TEXT = "rgba(255,255,255,0.38)";

export function RiqHotspots() {
  const [mode, setMode] = useState<"findings" | "hotspot">("findings");
  const points = useMemo(() => makePoints(), []);

  return (
    <section
      id="hotspots"
      className="relative overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(80% 100% at 50% 100%, #1D1D1F 0%, #0E0E0F 60%, #08080A 100%)",
      }}
    >
      {/* fine grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(to top, black 0%, black 70%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to top, black 0%, black 70%, transparent 100%)",
        }}
      />
      {/* corner glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 w-[720px] h-[720px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,106,0,0.18), transparent 70%)",
        }}
      />

      <div className="relative rams-container pt-28 sm:pt-36 lg:pt-44 pb-0">
        <SectionHeader
          eyebrow="Hotspots & pattern intelligence"
          top="See the finding."
          bottom="Then see the pattern behind the finding."
          tone="dark"
          size="compact"
          width="wide"
        />

        {/* ── the panel ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1, ease: EASE }}
          className="relative mx-auto"
          style={{
            maxWidth: 1240,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            borderLeft: "1px solid rgba(255,255,255,0.08)",
            borderRight: "1px solid rgba(255,255,255,0.08)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
            padding: "14px 14px 0",
            boxShadow:
              "0 -20px 80px -20px rgba(255,106,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="relative overflow-hidden"
            style={{
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              background: "linear-gradient(180deg, #0A0F14 0%, #06090C 100%)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              borderRight: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* top bar */}
            <div className="flex items-center justify-between gap-4 flex-wrap p-6 sm:p-8 pb-5">
              <div>
                <div className="text-[10.5px] font-mono font-bold tracking-[0.22em] uppercase text-white/45 mb-1.5">
                  Warehouse WH-01 · all history
                </div>
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={mode}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="text-[20px] sm:text-[24px] font-bold text-white leading-[1.15] tracking-[-0.02em]"
                  >
                    {MODES.find((m) => m.k === mode)!.l}
                  </motion.h3>
                </AnimatePresence>
              </div>

              <div
                className="inline-flex gap-1.5 p-1.5"
                style={{
                  borderRadius: 100,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {MODES.map((m) => {
                  const on = mode === m.k;
                  return (
                    <button
                      key={m.k}
                      type="button"
                      onClick={() => setMode(m.k)}
                      aria-pressed={on}
                      className={
                        "px-4 py-2 rounded-full text-[12.5px] font-medium transition-all duration-200 " +
                        (on
                          ? "text-carbon"
                          : "text-white/55 hover:text-white/85")
                      }
                      style={{ background: on ? "#FFFFFF" : "transparent" }}
                    >
                      {m.l}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* body — the plan, and the pattern it adds up to */}
            <div className="mx-6 sm:mx-8 grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4 items-stretch">
              <div
                className="relative overflow-hidden flex flex-col justify-center"
                style={{
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  borderLeft: "1px solid rgba(255,255,255,0.06)",
                  borderRight: "1px solid rgba(255,255,255,0.06)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.02), transparent)",
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                  backgroundSize: "100% 48px, 72px 100%",
                }}
              >
                <div className="px-4 pt-4 pb-1">
                  <span
                    className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-[0.16em] uppercase px-3 py-1.5 rounded-full"
                    style={{
                      background: "rgba(255,106,0,0.12)",
                      color: "#FF9B4D",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
                    {mode === "findings"
                      ? "48 findings plotted"
                      : "Aisle-end concentration"}
                  </span>
                </div>

                <svg
                  viewBox="0 0 900 400"
                  className="w-full h-auto block"
                  role="img"
                  aria-label={
                    mode === "findings"
                      ? "Warehouse plan with individual findings plotted"
                      : "Warehouse plan showing damage concentration, heaviest at the aisle ends"
                  }
                >
                  <defs>
                    <radialGradient id="riq-hs-hot">
                      <stop offset="0%" stopColor="#DC2626" stopOpacity="0.6" />
                      <stop
                        offset="45%"
                        stopColor="#F59E0B"
                        stopOpacity="0.32"
                      />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="riq-hs-warm">
                      <stop
                        offset="0%"
                        stopColor="#F59E0B"
                        stopOpacity="0.38"
                      />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  <rect
                    x={40}
                    y={38}
                    width={824}
                    height={330}
                    rx={8}
                    fill="none"
                    stroke={PLAN_LINE}
                    strokeWidth="1.5"
                  />

                  {[0, 1, 2, 3, 4].map((i) => (
                    <rect
                      key={`d-${i}`}
                      x={120 + i * 150}
                      y={362}
                      width={54}
                      height={7}
                      rx={2}
                      fill={PLAN_FILL}
                    />
                  ))}
                  <text
                    x={52}
                    y={385}
                    fontSize="9"
                    fontWeight="700"
                    fill={PLAN_TEXT}
                  >
                    DOCK
                  </text>

                  {Array.from({ length: AISLES }).map((_, r) => (
                    <g key={`a-${r}`}>
                      <rect
                        x={A_X0}
                        y={A_Y0 + r * A_GAP - 9}
                        width={A_W}
                        height={11}
                        rx={2}
                        fill={PLAN_FILL}
                      />
                      <text
                        x={A_X0 - 12}
                        y={A_Y0 + r * A_GAP}
                        fontSize="9"
                        fontWeight="700"
                        fill={PLAN_TEXT}
                        textAnchor="end"
                      >
                        A{String(r + 1).padStart(2, "0")}
                      </text>
                    </g>
                  ))}

                  <AnimatePresence mode="wait">
                    {mode === "findings" ? (
                      <motion.g
                        key="findings"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                      >
                        {points.map((p, i) => (
                          <circle
                            key={i}
                            cx={p.x}
                            cy={p.y}
                            r={3.4}
                            fill={RAG[p.rag].dark}
                            opacity={0.95}
                          />
                        ))}
                      </motion.g>
                    ) : (
                      <motion.g
                        key="hotspot"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                      >
                        <ellipse
                          cx={A_X0 + 30}
                          cy={A_Y0 + A_GAP * 0.6}
                          rx={118}
                          ry={86}
                          fill="url(#riq-hs-hot)"
                        />
                        <ellipse
                          cx={A_X0 + A_W - 34}
                          cy={A_Y0 + A_GAP * 3.4}
                          rx={104}
                          ry={78}
                          fill="url(#riq-hs-hot)"
                        />
                        <ellipse
                          cx={A_X0 + A_W * 0.5}
                          cy={A_Y0 + A_GAP * 1.2}
                          rx={96}
                          ry={62}
                          fill="url(#riq-hs-warm)"
                        />
                        <ellipse
                          cx={A_X0 + A_W * 0.28}
                          cy={A_Y0 + A_GAP * 5.2}
                          rx={86}
                          ry={56}
                          fill="url(#riq-hs-warm)"
                        />
                        <ellipse
                          cx={A_X0 + A_W * 0.72}
                          cy={A_Y0 + A_GAP * 5.6}
                          rx={78}
                          ry={50}
                          fill="url(#riq-hs-warm)"
                        />
                        {[
                          [A_X0 + 30, A_Y0 + A_GAP * 0.6, "1"],
                          [A_X0 + A_W - 34, A_Y0 + A_GAP * 3.4, "2"],
                          [A_X0 + A_W * 0.5, A_Y0 + A_GAP * 1.2, "3"],
                        ].map(([cx, cy, n]) => (
                          <g key={n as string}>
                            <circle
                              cx={cx as number}
                              cy={cy as number}
                              r={11}
                              fill="#FFFFFF"
                            />
                            <text
                              x={cx as number}
                              y={(cy as number) + 3.5}
                              fontSize="10"
                              fontWeight="700"
                              fill="#0E0E0F"
                              textAnchor="middle"
                            >
                              {n}
                            </text>
                          </g>
                        ))}
                      </motion.g>
                    )}
                  </AnimatePresence>
                </svg>
              </div>

              <PatternPanel />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
