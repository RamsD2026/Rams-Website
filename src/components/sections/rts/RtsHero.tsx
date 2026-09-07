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
 * Same skeleton as the Digital Twin, MEPS, IRDS and ATOS heroes: centred pill
 * eyebrow, a two-line h1 at the page-hero scale from `docs/typography.md`,
 * centred subline, the strapline, two CTAs, the product full width beneath,
 * then the client strip.
 *
 * The product is drawn, not placeholdered and not borrowed. There is no RTSS
 * capture in /public and the only registered screens are IRDS's, so the safety
 * command centre is built from the figures the source document specifies.
 *
 * The status card reads NORMAL OPERATION on purpose. A safety product whose
 * hero opens on a red alert is selling alarm; this one opens on a machine
 * inside its limits, with the numbers that prove it — which is the state the
 * system is in almost all of the time, and the state the rest of the page
 * departs from.
 */

const LINE = "rgba(255,255,255,0.10)";
const GREEN = "#54DE91";

const KPIS: [string, string, string?][] = [
  ["Active MHE", "34"],
  ["Events today", "12"],
  ["Open actions", "05"],
  ["Safe shift time", "96", "%"],
];

const CONTEXT: [string, string, boolean][] = [
  ["Operator", "OP-118 · authenticated", false],
  ["Current speed", "5.2 km/h", false],
  ["Zone limit", "6.0 km/h", false],
  ["Nearest person", "6.4 m", false],
  ["Risk status", "Within threshold", true],
];

function CommandCentre() {
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
          Live Safety Command Centre
        </span>
        <span className="hidden sm:block text-[10px] font-mono text-white/30">
          West DC · operational floor · 14:26
        </span>
        <span
          className="ml-auto px-2.5 py-1 rounded-full text-[9.5px] font-mono font-bold tracking-[0.12em] uppercase"
          style={{ background: "rgba(84,222,145,0.12)", color: GREEN }}
        >
          Monitoring
        </span>
      </div>

      <div className="flex flex-wrap" style={{ borderBottom: `1px solid ${LINE}` }}>
        {KPIS.map(([k, v, unit], i) => (
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
            <p className="mt-2 text-[26px] font-bold tabular-nums tracking-[-0.03em] leading-none text-white">
              {v}
              {unit && (
                <span className="text-[14px] font-semibold text-white/40 ml-0.5">
                  {unit}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* one machine, in context */}
      <div className="p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-3 mb-3">
          <span className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/35">
            Digital Twin · live safety context
          </span>
          <span className="text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase text-white/25">
            No active critical alert
          </span>
        </div>

        <div
          className="p-4 sm:p-5"
          style={{
            borderRadius: 12,
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${LINE}`,
          }}
        >
          <p
            className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase"
            style={{ color: GREEN }}
          >
            MHE 04 · normal operation
          </p>
          <p className="mt-2 text-[13px] text-white/50 leading-[1.6]">
            Moving toward outbound staging through Aisle 07.
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            {CONTEXT.map(([k, v, good], i) => (
              <motion.span
                key={k}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.09, ease: EASE }}
                className="flex items-center justify-between gap-4 py-2.5"
                style={{ borderBottom: `1px dashed ${LINE}` }}
              >
                <span className="text-[12px] text-white/45">{k}</span>
                <span
                  className="text-[12px] font-mono font-bold tabular-nums text-right"
                  style={{ color: good ? GREEN : "#FFFFFF" }}
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

export function RtsHero() {
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
              RAMS RTSS Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
            className="mt-8 sm:mt-10 text-[56px] sm:text-[84px] lg:text-[112px] font-bold leading-[1.04] tracking-[-0.045em]"
          >
            <span className="block text-white">See risk as it</span>
            <span className="block text-white">
              <span className="text-signal-orange">happens.</span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="mt-7 text-[15px] sm:text-[16px] text-white/60 leading-[1.6] max-w-[880px] mx-auto"
          >
            RTSS—Real-Time Safety System—connects MHE movement, impacts, driver
            behaviour, safety zones and live operational context so teams can
            detect risk, respond faster and prevent recurrence.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.29, ease: EASE }}
            className="mt-6 text-[15px] sm:text-[16px] font-bold tracking-[-0.01em] text-white"
          >
            Detect the Event. Understand the Context. Close the Safety Loop.
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
              Explore RTSS
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
          <CommandCentre />
        </motion.div>

        <RiqClients />
      </div>
    </section>
  );
}
