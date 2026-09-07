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
 * Same skeleton as the Digital Twin, MEPS and IRDS heroes: centred pill
 * eyebrow, a two-line h1 at the page-hero scale from `docs/typography.md`
 * (56/84/112, leading 1.06, tracking -0.045em), centred subline, the
 * strapline, two CTAs, the product full width beneath, then the client strip.
 *
 * The product is **drawn**, not a placeholder and not borrowed. There is no
 * ATOS capture in /public and the only registered screens are IRDS's, so the
 * command centre is built: the four shift figures and the priority queue the
 * source document specifies, at the size the real capture will be. A grey
 * rectangle under a hero is a page with no product on it, and another
 * product's screenshot under it would be a lie told with a picture.
 *
 * The queue reorders itself on a loop, because a static plan is precisely the
 * thing this product exists to replace.
 */

const LINE = "rgba(255,255,255,0.10)";
const ORANGE = "#FF6A00";
const GREEN = "#54DE91";

const KPIS: [string, string, string?][] = [
  ["Open tasks", "128"],
  ["On-time plan", "91", "%"],
  ["Active resources", "34"],
  ["At-risk orders", "04", undefined],
];

/** The priority queue, in the order the source document sets it. */
const QUEUE: [string, string, string, string][] = [
  ["01", "Stage outbound · DO-4821", "Dock 06 · 22 pallets · Due 15:10", "Now"],
  ["02", "Unload inbound · IN-7138", "Dock 02 · 18 pallets · ETA 14:34", "+08m"],
  ["03", "Replenish pick face · RPL-092", "Aisle 14 · 12 moves · Due 15:30", "+21m"],
  ["04", "Putaway received stock · PA-410", "Inbound buffer · 16 pallets", "+34m"],
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
      {/* chrome */}
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
          Warehouse Execution Command Centre
        </span>
        <span className="hidden sm:block text-[10px] font-mono text-white/30">
          West DC · Shift A · 14:26
        </span>
        <span
          className="ml-auto px-2.5 py-1 rounded-full text-[9.5px] font-mono font-bold tracking-[0.12em] uppercase"
          style={{ background: "rgba(255,106,0,0.12)", color: "#FF9B4D" }}
        >
          Live plan
        </span>
      </div>

      {/* the shift, in four numbers */}
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
            <p
              className="mt-2 text-[26px] font-bold tabular-nums tracking-[-0.03em] leading-none"
              style={{ color: k === "At-risk orders" ? "#FF6C6C" : "#FFFFFF" }}
            >
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

      {/* the queue */}
      <div className="p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-3 mb-3">
          <span className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/35">
            Priority task queue
          </span>
          <span className="text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase text-white/25">
            Plan v18 · stable
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {QUEUE.map(([n, title, meta, when], i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + i * 0.12, ease: EASE }}
              className="flex items-center gap-3 px-3.5 py-3 rounded-[10px]"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${i === 0 ? "rgba(255,106,0,0.36)" : LINE}`,
              }}
            >
              <span
                className="text-[10px] font-mono font-bold tabular-nums shrink-0"
                style={{ color: i === 0 ? ORANGE : "rgba(255,255,255,0.28)" }}
              >
                {n}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[12.5px] font-semibold text-white truncate">
                  {title}
                </span>
                <span className="mt-0.5 block text-[10.5px] font-mono text-white/35 truncate">
                  {meta}
                </span>
              </span>
              <span
                className="shrink-0 px-2 py-1 rounded-full text-[9.5px] font-mono font-bold tracking-[0.1em] uppercase"
                style={{
                  background:
                    i === 0 ? "rgba(255,106,0,0.14)" : "rgba(255,255,255,0.05)",
                  color: i === 0 ? "#FF9B4D" : "rgba(255,255,255,0.4)",
                }}
              >
                {when}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AtsHero() {
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
              RAMS ATOS Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
            className="mt-8 sm:mt-10 text-[46px] sm:text-[72px] lg:text-[92px] font-bold leading-[1.04] tracking-[-0.045em]"
          >
            <span className="block text-white">Turn operational demand</span>
            <span className="block text-white">
              into <span className="text-signal-orange">coordinated action.</span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="mt-7 text-[15px] sm:text-[16px] text-white/60 leading-[1.6] max-w-[880px] mx-auto"
          >
            ATOS—Automated Task Orchestration System—converts orders,
            priorities, constraints and live operational events into executable
            warehouse tasks, resource assignments and continuously updated
            plans.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.29, ease: EASE }}
            className="mt-6 text-[15px] sm:text-[16px] font-bold tracking-[-0.01em] text-white"
          >
            Plan the Work. Coordinate the Resources. Adapt as Reality Changes.
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
              Explore ATOS
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
