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
            <span className="block text-white">Real-time inventory</span>
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
              across every location.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="mt-8 text-[17px] sm:text-[20px] text-white/60 leading-[1.55] max-w-[680px] mx-auto"
          >
            Reconcile physical reality with your WMS in real time. One live
            surface for AI vision, IoT and spatial data — with zero manual
            audits.
          </motion.p>

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
              Book a demo
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="#product"
              className="inline-flex items-center gap-2 text-white text-[14px] font-semibold px-6 py-3.5 rounded-full border border-white/15 transition-all duration-200 hover:bg-white/[0.06]"
            >
              See the product
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
            className="relative rounded-[18px] overflow-hidden"
            style={{
              aspectRatio: "16 / 9",
              background:
                "linear-gradient(180deg, #FAFAFA 0%, #F3F3F5 100%)",
            }}
          >
            <WarehouseTopView />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Top-view warehouse — animated pallets, MHE, live scans
   ───────────────────────────────────────────────────────────── */

type Pt = { x: number; y: number };

function MheAgent({
  color,
  path,
  duration,
  delay,
}: {
  color: string;
  path: Pt[];
  duration: number;
  delay: number;
}) {
  // build a closed loop by appending the reverse (return trip)
  const loop = [...path, ...path.slice(0, -1).reverse()];
  const xs = loop.map((p) => p.x);
  const ys = loop.map((p) => p.y);

  return (
    <g>
      <motion.circle
        r={11}
        fill={color}
        opacity={0.14}
        animate={{ cx: xs, cy: ys }}
        transition={{
          duration,
          delay,
          ease: "linear",
          repeat: Infinity,
        }}
      />
      <motion.g
        animate={{ x: xs, y: ys }}
        transition={{
          duration,
          delay,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <rect
          x={-7}
          y={-5}
          width={14}
          height={10}
          rx={2}
          fill={color}
          stroke="white"
          strokeWidth={1}
        />
        <rect
          x={-3}
          y={-1.5}
          width={4}
          height={3}
          rx={0.6}
          fill="white"
          opacity={0.85}
        />
      </motion.g>
    </g>
  );
}

function WarehouseTopView() {
  /* ── Layout math ────────────────────────────────────────────
     Left zone (bulk): 12 horizontal rack rows, each with 10 bays.
     Right zone (pick): 10 vertical rack columns, each with 8 bays.
     One cross-aisle separates the zones.
     ────────────────────────────────────────────────────────── */

  const H_ROWS = 12;
  const H_BAYS = 10;
  const H_ROW_H = 10;      // rack strip thickness
  const H_AISLE = 12;      // aisle between rack rows
  const H_STEP = H_ROW_H + H_AISLE;
  const H_X0 = 40;
  const H_X1 = 400;
  const H_Y0 = 40;

  const V_COLS = 10;
  const V_BAYS = 8;
  const V_COL_W = 10;
  const V_AISLE = 20;
  const V_STEP = V_COL_W + V_AISLE;
  const V_X0 = 430;
  const V_Y0 = 40;
  const V_Y1 = 320;

  // "Hot" (occupied) and "diff" bay coordinates for pop of colour
  const hotH = new Set([
    "1-2", "1-3", "1-4",
    "3-7", "3-8",
    "5-1", "5-2",
    "6-6",
    "8-4", "8-9",
    "10-2", "10-3",
    "11-7",
  ]);
  const diffH = new Set(["4-5"]);
  const hotV = new Set([
    "0-2", "0-3",
    "2-5",
    "3-1", "3-2",
    "5-4", "5-6",
    "7-3",
    "8-0", "8-1",
  ]);
  const diffV = new Set(["6-5"]);

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-4 px-6 sm:px-8 pt-6 sm:pt-7 pb-4">
        <div>
          <div className="text-[10px] font-mono font-bold tracking-[0.22em] uppercase text-graphite/45">
            Digital Twin
          </div>
          <div className="mt-0.5 text-[15px] sm:text-[17px] font-semibold text-carbon tracking-[-0.01em]">
            Sydney DC · Zone B — top view
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-[0.14em] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            LIVE
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-[0.14em] px-2.5 py-1 rounded-full bg-white text-carbon border border-black/[0.06]">
            4 MHE · 800 bays
          </span>
        </div>
      </div>

      {/* Floor plan */}
      <div className="relative flex-1 mx-4 sm:mx-6 mb-4 sm:mb-6 rounded-xl overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 800 380"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <defs>
            <linearGradient id="wh-floor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#F6F7F9" />
              <stop offset="1" stopColor="#EEF0F3" />
            </linearGradient>
            <linearGradient id="bay-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0E0E0F" stopOpacity="0.16" />
              <stop offset="1" stopColor="#0E0E0F" stopOpacity="0.06" />
            </linearGradient>
          </defs>

          {/* Floor */}
          <rect x="0" y="0" width="800" height="380" fill="url(#wh-floor)" />

          {/* faint background grid */}
          <g opacity="0.5">
            {Array.from({ length: 21 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={i * 40}
                y1={0}
                x2={i * 40}
                y2={380}
                stroke="#0E0E0F"
                strokeOpacity={0.03}
                strokeWidth={1}
              />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1={0}
                y1={i * 40}
                x2={800}
                y2={i * 40}
                stroke="#0E0E0F"
                strokeOpacity={0.03}
                strokeWidth={1}
              />
            ))}
          </g>

          {/* Zone labels */}
          <text
            x={H_X0}
            y={26}
            fontSize={8.5}
            fontFamily="ui-monospace, monospace"
            fontWeight="700"
            fill="#0E0E0F"
            opacity={0.5}
            letterSpacing="0.22em"
          >
            BULK · Zone B
          </text>
          <text
            x={V_X0}
            y={26}
            fontSize={8.5}
            fontFamily="ui-monospace, monospace"
            fontWeight="700"
            fill="#0E0E0F"
            opacity={0.5}
            letterSpacing="0.22em"
          >
            PICK · Zone C
          </text>

          {/* ── LEFT ZONE: 12 horizontal rack rows ─────────────── */}
          {Array.from({ length: H_ROWS }).map((_, r) => {
            const y = H_Y0 + r * H_STEP;
            const bayW = (H_X1 - H_X0) / H_BAYS;
            return (
              <g key={`hrow-${r}`}>
                {/* Rack strip made of bays */}
                {Array.from({ length: H_BAYS }).map((_, b) => {
                  const key = `${r}-${b}`;
                  const isDiff = diffH.has(key);
                  const isHot = hotH.has(key);
                  return (
                    <rect
                      key={`hbay-${key}`}
                      x={H_X0 + b * bayW + 0.6}
                      y={y}
                      width={bayW - 1.2}
                      height={H_ROW_H}
                      rx={1.5}
                      fill={
                        isDiff
                          ? "rgba(255,106,0,0.9)"
                          : isHot
                            ? "rgba(255,106,0,0.35)"
                            : "url(#bay-fill)"
                      }
                      stroke="rgba(0,0,0,0.05)"
                      strokeWidth={0.4}
                    />
                  );
                })}
                {/* dashed aisle line under this rack (skip last) */}
                {r < H_ROWS - 1 && (
                  <line
                    x1={H_X0 + 2}
                    y1={y + H_ROW_H + H_AISLE / 2}
                    x2={H_X1 - 2}
                    y2={y + H_ROW_H + H_AISLE / 2}
                    stroke="#0E0E0F"
                    strokeOpacity={0.06}
                    strokeWidth={0.75}
                    strokeDasharray="2 4"
                  />
                )}
              </g>
            );
          })}

          {/* ── RIGHT ZONE: 10 vertical rack columns ───────────── */}
          {Array.from({ length: V_COLS }).map((_, c) => {
            const x = V_X0 + c * V_STEP;
            const bayH = (V_Y1 - V_Y0) / V_BAYS;
            return (
              <g key={`vcol-${c}`}>
                {Array.from({ length: V_BAYS }).map((_, b) => {
                  const key = `${c}-${b}`;
                  const isDiff = diffV.has(key);
                  const isHot = hotV.has(key);
                  return (
                    <rect
                      key={`vbay-${key}`}
                      x={x}
                      y={V_Y0 + b * bayH + 0.6}
                      width={V_COL_W}
                      height={bayH - 1.2}
                      rx={1.5}
                      fill={
                        isDiff
                          ? "rgba(255,106,0,0.9)"
                          : isHot
                            ? "rgba(255,106,0,0.35)"
                            : "url(#bay-fill)"
                      }
                      stroke="rgba(0,0,0,0.05)"
                      strokeWidth={0.4}
                    />
                  );
                })}
                {/* dashed aisle line right of this column (skip last) */}
                {c < V_COLS - 1 && (
                  <line
                    x1={x + V_COL_W + V_AISLE / 2}
                    y1={V_Y0 + 2}
                    x2={x + V_COL_W + V_AISLE / 2}
                    y2={V_Y1 - 2}
                    stroke="#0E0E0F"
                    strokeOpacity={0.06}
                    strokeWidth={0.75}
                    strokeDasharray="2 4"
                  />
                )}
              </g>
            );
          })}

          {/* Cross-aisle divider */}
          <line
            x1={415}
            y1={40}
            x2={415}
            y2={320}
            stroke="#0E0E0F"
            strokeOpacity={0.08}
            strokeWidth={1}
          />

          {/* Bottom perimeter aisle line */}
          <line
            x1={30}
            y1={340}
            x2={770}
            y2={340}
            stroke="#0E0E0F"
            strokeOpacity={0.1}
            strokeWidth={1}
          />
          <text
            x={30}
            y={358}
            fontSize={8.5}
            fontFamily="ui-monospace, monospace"
            fontWeight="700"
            fill="#0E0E0F"
            opacity={0.45}
            letterSpacing="0.22em"
          >
            DOCK · IN
          </text>
          <text
            x={720}
            y={358}
            fontSize={8.5}
            fontFamily="ui-monospace, monospace"
            fontWeight="700"
            fill="#0E0E0F"
            opacity={0.45}
            letterSpacing="0.22em"
          >
            DOCK · OUT
          </text>

          {/* ── MHE — 4 forklifts moving through aisles ────────── */}
          {/* MHE-04: horizontal aisle 3 in bulk zone */}
          <MheAgent
            color="#FF6A00"
            path={[
              { x: H_X0 + 4, y: H_Y0 + 3 * H_STEP - H_AISLE / 2 },
              { x: H_X1 - 4, y: H_Y0 + 3 * H_STEP - H_AISLE / 2 },
            ]}
            duration={38}
            delay={0}
          />
          {/* MHE-11: horizontal aisle 7 in bulk zone */}
          <MheAgent
            color="#0E0E0F"
            path={[
              { x: H_X1 - 4, y: H_Y0 + 7 * H_STEP - H_AISLE / 2 },
              { x: H_X0 + 4, y: H_Y0 + 7 * H_STEP - H_AISLE / 2 },
            ]}
            duration={34}
            delay={3}
          />
          {/* MHE-07: down aisle A, across perimeter, up aisle B */}
          <MheAgent
            color="#FF6A00"
            path={[
              { x: V_X0 + 3 * V_STEP + V_COL_W + V_AISLE / 2, y: V_Y0 + 4 },
              { x: V_X0 + 3 * V_STEP + V_COL_W + V_AISLE / 2, y: 335 },
              { x: V_X0 + 6 * V_STEP + V_COL_W + V_AISLE / 2, y: 335 },
              { x: V_X0 + 6 * V_STEP + V_COL_W + V_AISLE / 2, y: V_Y0 + 4 },
            ]}
            duration={42}
            delay={2}
          />
          {/* MHE-13: cross-aisle then wraps */}
          <MheAgent
            color="#0E0E0F"
            path={[
              { x: 415, y: 50 },
              { x: 415, y: 315 },
            ]}
            duration={28}
            delay={5}
          />

          {/* Scan pulse over the bulk-zone diff bay */}
          <motion.circle
            cx={H_X0 + 5 * ((H_X1 - H_X0) / H_BAYS) + (H_X1 - H_X0) / H_BAYS / 2}
            cy={H_Y0 + 4 * H_STEP + H_ROW_H / 2}
            r={5}
            fill="rgba(255,106,0,0.6)"
            animate={{
              r: [5, 20, 5],
              opacity: [0.75, 0, 0.75],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />

          {/* Scan pulse over the pick-zone diff bay */}
          <motion.circle
            cx={V_X0 + 6 * V_STEP + V_COL_W / 2}
            cy={V_Y0 + 5 * ((V_Y1 - V_Y0) / V_BAYS) + ((V_Y1 - V_Y0) / V_BAYS) / 2}
            r={4}
            fill="rgba(255,106,0,0.6)"
            animate={{
              r: [4, 18, 4],
              opacity: [0.75, 0, 0.75],
            }}
            transition={{
              duration: 2.4,
              delay: 1.2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />

          {/* Camera scan cones from ceiling */}
          {[120, 300, 500, 680].map((cx, i) => (
            <g key={`cam-${cx}`}>
              <circle cx={cx} cy={10} r={2.5} fill="#0E0E0F" opacity={0.45} />
              <motion.path
                d={`M${cx} 10 L${cx - 34} 335 L${cx + 34} 335 Z`}
                fill="rgba(255,106,0,0.05)"
                stroke="rgba(255,106,0,0.22)"
                strokeWidth={0.5}
                animate={{ opacity: [0, 0.9, 0] }}
                transition={{
                  duration: 3,
                  delay: i * 0.75,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </g>
          ))}
        </svg>

        {/* Floating callout — anomaly */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6, ease: EASE }}
          className="absolute"
          style={{
            right: "6%",
            top: "34%",
            background: "white",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.08)",
            padding: "10px 12px",
            boxShadow: "0 12px 32px -8px rgba(0,0,0,0.14)",
            minWidth: 180,
          }}
        >
          <div className="text-[9.5px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
            Anomaly
          </div>
          <div className="mt-1 text-[12px] font-semibold text-carbon leading-tight">
            Bay C-05 · phantom stock
          </div>
          <div className="mt-0.5 text-[10.5px] text-graphite/60">
            Expected 48 · Counted 0
          </div>
        </motion.div>

        {/* Floating callout — MHE */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6, ease: EASE }}
          className="absolute"
          style={{
            left: "5%",
            bottom: "8%",
            background: "white",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.08)",
            padding: "10px 12px",
            boxShadow: "0 12px 32px -8px rgba(0,0,0,0.14)",
            minWidth: 170,
          }}
        >
          <div className="text-[9.5px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/55">
            MHE · 04
          </div>
          <div className="mt-1 text-[12px] font-semibold text-carbon leading-tight">
            Picking · Aisle A
          </div>
          <div className="mt-0.5 text-[10.5px] text-graphite/60">
            Route optimised · 6 stops
          </div>
        </motion.div>
      </div>
    </div>
  );
}
