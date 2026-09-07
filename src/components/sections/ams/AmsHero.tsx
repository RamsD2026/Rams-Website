"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { EASE, SURFACE } from "@/components/sections/rackiq/rackiq-shared";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { RiqClients } from "@/components/sections/rackiq/RiqClients";

/**
 * 01 — Hero.
 *
 * Same skeleton as the Digital Twin, MEPS, IRDS, ATOS, RTSS and IMDS heroes:
 * centred pill eyebrow, a two-line h1 at the page-hero scale, centred subline,
 * the strapline, two CTAs, the product full width beneath, then the client
 * strip.
 *
 * The product is drawn. There is no AIMS capture in /public and the only
 * registered screens in `SHOTS` are IRDS's.
 *
 * Every other platform hero opens on one thing — a machine, a rack, a run.
 * This one opens on twenty-four, because that is the whole argument: AIMS is
 * the only module whose subject is the network rather than the site. The
 * selected site is there to show the drill-down exists, not because a single
 * site is the point.
 *
 * The index reads 86.4 and the network is not in trouble. A management product
 * whose hero opens on a burning estate is selling alarm; this one opens on a
 * network that is running, with seventeen things worth a decision.
 */

const LINE = "rgba(255,255,255,0.10)";
const GREEN = "#54DE91";
const AMBER = "#E8A33D";
const RED = "#FF6C6C";

const KPIS: [string, string, string][] = [
  ["Connected sites", "24", "#FFFFFF"],
  ["Operations index", "86.4", GREEN],
  ["Priority signals", "17", AMBER],
  ["Closure rate", "91%", "#FFFFFF"],
];

/** One site's modules, each reading from the product that owns it. */
const SITE: [string, string, string][] = [
  ["Rack safety · IRDS", "03 critical", RED],
  ["MHE utilisation · MEPS", "78%", "#FFFFFF"],
  ["Safety events · RTSS", "02 today", AMBER],
  ["Open maintenance · IMDS", "08", "#FFFFFF"],
  ["Execution SLA · ATOS", "92%", "#FFFFFF"],
  ["Actions open / overdue", "14 / 02", AMBER],
];

/** The operations index, as a ring. Drawn once on entry. */
function Index({ value }: { value: number }) {
  const R = 34;
  const C = 2 * Math.PI * R;
  return (
    <div className="relative w-[92px] h-[92px] shrink-0">
      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={R}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="6"
        />
        <motion.circle
          cx="40"
          cy="40"
          r={R}
          fill="none"
          stroke={GREEN}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C * (1 - value / 100) }}
          transition={{ duration: 1.1, delay: 0.8, ease: EASE }}
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[22px] font-bold tabular-nums leading-none text-white">
          {value}
        </span>
        <span className="mt-1 text-[7.5px] font-mono font-bold tracking-[0.14em] uppercase text-white/35">
          Index
        </span>
      </span>
    </div>
  );
}

function ControlTower() {
  return (
    <div
      className="overflow-hidden"
      style={{
        borderRadius: 16,
        background: "#0E0E11",
        border: `1px solid ${LINE}`,
        boxShadow: "0 60px 120px -50px rgba(0,0,0,0.9)",
      }}
    >
      <div
        className="flex items-center gap-2.5 px-4 h-11 flex-wrap"
        style={{ borderBottom: `1px solid ${LINE}`, background: "#111114" }}
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
          Enterprise Operations Control Tower
        </span>
        <span className="hidden sm:block text-[10px] font-mono text-white/30">
          India network · 24 connected sites · 14:26
        </span>
        <span
          className="ml-auto px-2.5 py-1 rounded-full text-[9.5px] font-mono font-bold tracking-[0.12em] uppercase"
          style={{ background: "rgba(84,222,145,0.12)", color: GREEN }}
        >
          Live view
        </span>
      </div>

      <div
        className="flex flex-wrap"
        style={{ borderBottom: `1px solid ${LINE}` }}
      >
        {KPIS.map(([k, v, tint], i) => (
          <div
            key={k}
            className="flex-1 min-w-[150px] px-5 py-4 text-left"
            style={{
              borderRight: i < KPIS.length - 1 ? `1px solid ${LINE}` : "none",
            }}
          >
            <p className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/35">
              {k}
            </p>
            <p
              className="mt-2 text-[26px] font-bold tabular-nums tracking-[-0.03em] leading-none"
              style={{ color: tint }}
            >
              {v}
            </p>
          </div>
        ))}
      </div>

      {/* one site, opened out of the twenty-four */}
      <div className="p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-3 mb-3">
          <span className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/35">
            Selected site · Pune DC–02
          </span>
          <span className="text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase text-white/25">
            Every figure drills to its source record
          </span>
        </div>

        <div
          className="p-4 sm:p-5 flex flex-col sm:flex-row gap-5 sm:gap-7"
          style={{
            borderRadius: 12,
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${LINE}`,
          }}
        >
          <div className="flex sm:flex-col items-center sm:items-start gap-4 shrink-0">
            <Index value={84} />
            <span>
              <p
                className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase"
                style={{ color: AMBER }}
              >
                Pune DC–02 · watch
              </p>
              <p className="mt-1.5 text-[11.5px] text-white/40 leading-[1.5] max-w-[170px]">
                West region · 6 modules live
              </p>
            </span>
          </div>

          <div className="min-w-0 flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            {SITE.map(([k, v, tint], i) => (
              <motion.span
                key={k}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.08, ease: EASE }}
                className="flex items-center justify-between gap-4 py-2.5"
                style={{ borderBottom: `1px dashed ${LINE}` }}
              >
                <span className="text-[12px] text-white/45 truncate">{k}</span>
                <span
                  className="text-[12px] font-mono font-bold tabular-nums text-right shrink-0"
                  style={{ color: tint }}
                >
                  {v}
                </span>
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AmsHero() {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{ background: SURFACE.darkTop }}
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
      <BackgroundBeams className="opacity-[0.5]" />

      <div className="relative rams-container pt-36 sm:pt-44 lg:pt-48 pb-20 sm:pb-24 lg:pb-28">
        <div className="max-w-[1180px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
            <span className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-white/70">
              RAMS AIMS Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
            className="mt-8 sm:mt-10 text-[46px] sm:text-[72px] lg:text-[92px] font-bold leading-[1.04] tracking-[-0.045em]"
          >
            <span className="block text-white">See the whole operation</span>
            <span className="block text-white">
              and <span className="text-signal-orange">decide from reality.</span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="mt-7 text-[15px] sm:text-[16px] text-white/60 leading-[1.6] max-w-[880px] mx-auto"
          >
            AIMS—AI Intelligence and Management System—connects live Digital
            Twin visibility with safety, productivity, inventory, maintenance
            and execution data to give management one direct view of what is
            happening and what needs attention.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.29, ease: EASE }}
            className="mt-6 text-[15px] sm:text-[16px] font-bold tracking-[-0.01em] text-white"
          >
            One Operating Picture. Every Site. Every Module. Every Priority.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.36, ease: EASE }}
            className="mt-9 flex items-center justify-center gap-3 flex-wrap"
          >
            <Link
              href="#problem"
              className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3 rounded-lg transition-colors duration-200 hover:bg-signal-orange-hover"
            >
              Explore AIMS
              <ArrowDown className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="/book-a-demo"
              className="inline-flex items-center gap-2 text-white text-[14px] font-semibold px-6 py-3 rounded-lg border border-white/15 transition-colors duration-200 hover:bg-white/[0.06]"
            >
              Request a Demo
            </Link>
          </motion.div>
        </div>

        {/* ── the product ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: EASE }}
          className="mt-16 sm:mt-20 max-w-[1180px] mx-auto"
        >
          <ControlTower />
        </motion.div>

        <RiqClients />
      </div>
    </section>
  );
}
