"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SiteLog, SiteMap } from "./AimsSiteMap";

/**
 * Management Intelligence — hero.
 *
 * The solution-hero skeleton: dark ground with the glow and grid, pill
 * eyebrow, h1, lede, CTA pair, then the product full width beneath.
 *
 * The board is the control tower itself. The intelligence index climbs its
 * curve, the risk bars fill by domain and the site strip reports underneath —
 * all from one tick, so the server and the client draw the same frame.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const HAIR = "rgba(255,255,255,0.08)";
const GREEN = "#54DE91";
const RED = "#FF6C6C";

const TICKS = [
  "Live site visibility",
  "Cross-module insights",
  "Measurable closure",
];

const KPIS: [string, string, string, string][] = [
  ["Sites connected", "24", "3 this quarter", GREEN],
  ["Safety index", "86.4", "4.2%", GREEN],
  ["Open actions", "128", "17 critical", RED],
  ["Closure rate", "91%", "8.6%", GREEN],
];

/** Priority by domain, as the control tower ranks it. */
const RISK: [string, number][] = [
  ["Rack safety", 42],
  ["MHE", 31],
  ["Inventory", 19],
  ["People", 12],
];
const RISK_MAX = 42;

const TICK_MS = 90;

function useTick() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((v) => v + 1), TICK_MS);
    return () => clearInterval(id);
  }, []);
  return t;
}

/* ── the board ───────────────────────────────────────────── */

function ControlTower() {
  const t = useTick();
  return (
    <div className="h-full flex flex-col">
      <div
        className="flex items-center gap-3 px-5 py-3.5 flex-wrap"
        style={{ borderBottom: `1px solid ${HAIR}`, background: "#0B0F13" }}
      >
        <span className="flex items-center justify-center w-5 h-5 rounded-[6px] bg-signal-orange text-[10px] font-bold text-white">
          R
        </span>
        <span className="text-[11.5px] font-semibold text-white/85">
          Management Control Tower
        </span>
        <span className="ml-auto flex items-center gap-2">
          <span className="text-[11px] font-mono text-white/35">
            India Network
          </span>
          <span
            className="flex items-center gap-1.5 text-[10px] font-mono font-semibold tracking-[0.1em] uppercase"
            style={{ color: GREEN }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: GREEN }}
            />
            Live
          </span>
        </span>
      </div>

      <div className="px-5 py-5 sm:px-6 flex-1 flex flex-col">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/35">
              Enterprise overview
            </p>
            <h4 className="mt-1.5 text-[17px] font-semibold text-white tracking-[-0.02em]">
              Network performance
            </h4>
          </div>
          <span
            className="text-[10.5px] font-mono text-white/40 px-3 py-1.5 rounded-md"
            style={{ border: `1px solid ${HAIR}` }}
          >
            Last 30 days
          </span>
        </div>

        {/* what the network looks like right now */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
          {KPIS.map(([label, value, note, tone]) => (
            <div
              key={label}
              className="px-4 py-3.5"
              style={{
                background: "#0B0F13",
                borderRadius: 10,
                border: `1px solid ${HAIR}`,
              }}
            >
              <p className="text-[10px] font-mono text-white/35">{label}</p>
              <p className="mt-1 font-rams-heading text-[24px] font-bold tabular-nums tracking-[-0.035em] leading-none text-white">
                {value}
              </p>
              <p
                className="mt-1.5 text-[9.5px] font-mono"
                style={{ color: tone }}
              >
                {note}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4 mt-4 items-start">
          {/* where the network is */}
          <div className="flex flex-col gap-4">
            <div
              className="relative flex flex-col overflow-hidden"
              style={{ borderRadius: 10, border: `1px solid ${HAIR}` }}
            >
              <div
                className="flex items-center justify-between gap-3 px-4 py-3"
                style={{ borderBottom: `1px solid ${HAIR}` }}
              >
                <div>
                  <p className="text-[12.5px] font-semibold text-white">
                    Warehouse locations
                  </p>
                  <p className="mt-0.5 text-[9.5px] font-mono text-white/35">
                    24 sites · intelligence index on map
                  </p>
                </div>
                <span
                  className="text-[10px] font-mono text-white/40 px-2.5 py-1.5 rounded-md shrink-0"
                  style={{ border: `1px solid ${HAIR}` }}
                >
                  All sites
                </span>
              </div>

              <div className="p-3">
                <SiteMap t={t} />
              </div>
            </div>

            {/* and what is driving the number */}
            <div
              className="px-4 py-4"
              style={{ borderRadius: 10, border: `1px solid ${HAIR}` }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[12.5px] font-semibold text-white">
                  Risk distribution
                </p>
                <p className="text-[9.5px] font-mono text-white/35">
                  Priority by domain
                </p>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-4">
                {RISK.map(([label, v], i) => (
                  <span key={label}>
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="text-[11px] text-white/55">{label}</span>
                      <span className="text-[11.5px] font-mono font-semibold tabular-nums text-white">
                        {v}
                      </span>
                    </span>
                    <span
                      className="relative block h-1 rounded-full mt-1.5 overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.07)" }}
                    >
                      <span
                        className="absolute inset-y-0 left-0 rounded-full bg-signal-orange"
                        style={{
                          width: `${((v / RISK_MAX) * 100 * Math.min(1, Math.max(0, (t - i * 3) / 22))).toFixed(1)}%`,
                          transition: "width 120ms linear",
                        }}
                      />
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* and what it is reporting */}
          <div
            className="flex flex-col overflow-hidden"
            style={{ borderRadius: 10, border: `1px solid ${HAIR}` }}
          >
            <div
              className="px-4 py-3"
              style={{ borderBottom: `1px solid ${HAIR}` }}
            >
              <p className="text-[12.5px] font-semibold text-white">
                Site performance log
              </p>
              <p className="mt-0.5 text-[9.5px] font-mono text-white/35">
                Intelligence index per site
              </p>
            </div>

            <div className="p-2.5">
              <SiteLog t={t} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AimsHero() {
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

      <style>{`
        @keyframes aims-ping {
          0%   { transform: scale(0.6); opacity: 0.8; }
          70%  { transform: scale(1.9); opacity: 0; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        .aims-ping {
          transform-box: fill-box;
          transform-origin: center;
          animation: aims-ping 2.2s cubic-bezier(0.22,1,0.36,1) infinite;
        }
        @media (prefers-reduced-motion: reduce) { .aims-ping { animation: none; } }
      `}</style>

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
              Management Intelligence
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
            className="mt-8 text-[46px] sm:text-[72px] lg:text-[96px] font-bold leading-[1.06] tracking-[-0.045em]"
          >
            <span className="block text-white">One warehouse network.</span>
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
              One decision layer.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[16px] text-white/60 leading-[1.55] max-w-[900px] mx-auto"
          >
            Unify safety, asset, inventory and productivity data into a live
            management view that reveals what is changing on site, why it
            matters and who must act.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="mt-10 flex items-center justify-center gap-3 flex-wrap"
          >
            <Link
              href="/book-a-demo"
              className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-px hover:bg-signal-orange-hover"
            >
              Explore the platform
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="#intelligence"
              className="inline-flex items-center gap-2 text-white text-[14px] font-semibold px-6 py-3.5 rounded-full border border-white/15 transition-all duration-200 hover:bg-white/[0.06]"
            >
              See the intelligence layer
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap"
          >
            {TICKS.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur text-[10.5px] font-mono font-semibold tracking-[0.22em] uppercase text-white/70"
              >
                <span
                  className="w-1 h-1 rounded-full bg-signal-orange"
                  aria-hidden
                />
                {t}
              </span>
            ))}
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
            className="relative rounded-[18px] overflow-hidden min-h-[620px] sm:min-h-0 sm:aspect-[16/10]"
            style={{
              background: "linear-gradient(180deg, #0A0F14 0%, #06090C 100%)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <ControlTower />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
