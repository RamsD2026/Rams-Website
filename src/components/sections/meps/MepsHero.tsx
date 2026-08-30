"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE, SURFACE } from "@/components/sections/rackiq/rackiq-shared";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { RiqClients } from "@/components/sections/rackiq/RiqClients";

/**
 * MEPS hero.
 *
 * Same skeleton as RiqHero: centred pill eyebrow, the "Powered by X —" line, a
 * two-line h1 at the page-hero scale, centred subline, two CTAs, the mono
 * strapline, and then the product full width beneath.
 *
 * The product here is the Live Command Centre, playing a recording inside the
 * frame with the selected asset card over it, then the client strip — the same
 * <RiqClients> marquee the IRDS hero closes on.
 */

const LINE = "rgba(255,255,255,0.10)";

const ASSET = [
  ["Operator", "OP-118"],
  ["Zone", "Aisle 05"],
  ["Speed", "6.2 km/h"],
];

const KPIS: [string, string, string?][] = [
  ["Moving now", "7", "/9"],
  ["Loaded travel", "61", "%"],
  ["Pallets / hour", "18.4"],
];

/**
 * The twin stage.
 *
 * ── MEDIA ────────────────────────────────────────────────────────────
 * TWIN_SRC is a placeholder. There is no MHE or MEPS footage in /public —
 * this is the same clip the IRDS hero uses, which is Atlassian's
 * "CSD-24696 Agents In Jira". Drop a real Live Command Centre recording in
 * and change this one constant; nothing else here moves.
 *
 * Capture 16:9 with no browser chrome — the frame supplies its own.
 * ─────────────────────────────────────────────────────────────────────
 */
const TWIN_SRC = "/Product/irds/hero.mp4";

function Twin() {
  const videoRef = useRef<HTMLVideoElement>(null);

  /* React sets `muted` as a property rather than a reliable attribute, so a
     browser can decide the element is unmuted and refuse to autoplay it. */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const start = () => v.play().catch(() => {});
    start();
    v.addEventListener("loadeddata", start);
    return () => v.removeEventListener("loadeddata", start);
  }, []);

  return (
    <div className="relative overflow-hidden" style={{ borderRadius: 10 }}>
      <video
        ref={videoRef}
        src={TWIN_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="block w-full h-auto"
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9, ease: EASE }}
        className="absolute right-4 bottom-4 w-[186px] hidden sm:block text-left"
        style={{
          borderRadius: 10,
          background: "rgba(10,12,14,0.92)",
          border: `1px solid ${LINE}`,
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          className="flex items-center justify-between gap-2 px-3 py-2.5"
          style={{ borderBottom: `1px solid ${LINE}` }}
        >
          <span className="text-[11.5px] font-mono font-bold text-white">
            MHE-04
          </span>
          <span
            className="px-2 py-[2px] rounded-full text-[9px] font-mono font-bold tracking-[0.1em] uppercase"
            style={{ background: "rgba(255,106,0,0.14)", color: "#FF9B4D" }}
          >
            Loaded
          </span>
        </div>
        <div className="px-3 py-2.5 flex flex-col gap-1.5">
          {ASSET.map(([k, v]) => (
            <span key={k} className="flex items-center justify-between gap-3">
              <span className="text-[10.5px] text-white/40">{k}</span>
              <span className="text-[11px] font-mono font-semibold text-white">
                {v}
              </span>
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export function MepsHero() {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{ background: SURFACE.darkTop }}
      id="top"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[680px]"
        style={{
          background:
            "radial-gradient(58% 58% at 50% 0%, rgba(255,106,0,0.18), transparent 70%)",
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
              RAMS MHE Intelligence
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06, ease: EASE }}
            className="mt-6 text-[12.5px] sm:text-[14px] text-white/50"
          >
            Powered by <span className="font-semibold text-white/80">MEPS</span>
            <span className="mx-2 text-white/25">—</span>
            Mobile Equipment Performance Suite
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="mt-6 text-[12.5px] font-mono text-white/35 leading-[1.6]"
          >
            A forklift can run a full shift, cover kilometres, and move very
            little.
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.14, ease: EASE }}
            className="mt-6 text-[56px] sm:text-[84px] lg:text-[112px] font-bold leading-[0.98] tracking-[-0.045em]"
          >
            <span className="block lg:whitespace-nowrap text-white">
              See how your MHE fleet
            </span>
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
              really works.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[16px] text-white/60 leading-[1.55] max-w-[1120px] mx-auto"
          >
            MEPS connects live MHE movement with the warehouse Digital Twin and
            turns it into productivity, efficiency and operational intelligence
            — where equipment is, what work it is doing, where performance is
            being lost and what can be improved.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.36, ease: EASE }}
            className="mt-9 flex items-center justify-center gap-3 flex-wrap"
          >
            <Link
              href="/book-a-demo"
              className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3 rounded-lg transition-colors duration-200 hover:bg-signal-orange-hover"
            >
              Request a MEPS demo
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="#command-centre"
              className="inline-flex items-center gap-2 text-white text-[14px] font-semibold px-6 py-3 rounded-lg border border-white/15 transition-colors duration-200 hover:bg-white/[0.06]"
            >
              Explore the Live Command Centre
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.44 }}
            className="mt-7 text-[11px] font-mono font-semibold tracking-[0.16em] uppercase text-white/35"
          >
            See the movement. Understand the work. Improve the operation.
          </motion.p>
        </div>

        {/* ── the product ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: EASE }}
          className="mt-16 sm:mt-20 max-w-[1180px] mx-auto overflow-hidden"
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
                style={{ background: "#54DE91" }}
                animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
              <span
                className="relative w-2 h-2 rounded-full"
                style={{ background: "#54DE91" }}
              />
            </span>
            <span className="text-[11.5px] font-semibold text-white/85">
              MEPS Live Command Centre
            </span>
            <span
              className="ml-auto px-2.5 py-1 rounded-full text-[9.5px] font-mono font-bold tracking-[0.12em] uppercase text-white/55"
              style={{ border: `1px solid ${LINE}` }}
            >
              Live Digital Twin
            </span>
          </div>

          <div className="p-3 sm:p-5" style={{ background: "#0A0C0E" }}>
            <Twin />
          </div>

          <div
            className="flex flex-wrap"
            style={{ borderTop: `1px solid ${LINE}` }}
          >
            {KPIS.map(([k, v, unit], i) => (
              <div
                key={k}
                className="flex-1 min-w-[140px] px-5 py-4 text-left"
                style={{
                  borderRight:
                    i < KPIS.length - 1 ? `1px solid ${LINE}` : "none",
                }}
              >
                <p className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/35">
                  {k}
                </p>
                <p className="mt-2 text-[24px] font-bold tabular-nums tracking-[-0.03em] text-white leading-none">
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
        </motion.div>

        <RiqClients />
      </div>
    </section>
  );
}
