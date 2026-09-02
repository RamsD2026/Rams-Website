"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE, SURFACE } from "@/components/sections/rackiq/rackiq-shared";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { RiqClients } from "@/components/sections/rackiq/RiqClients";

/**
 * RTSS hero.
 *
 * Same skeleton as the MEPS hero: centred pill eyebrow, the "Powered by X —"
 * line, a two-line h1 at the page-hero scale, centred subline, two CTAs, the
 * story chain, then the product full width beneath and the client strip.
 *
 * The product here is the Safety Command Centre — the recording in the frame,
 * with the event record the source document assembles underneath it.
 */

const LINE = "rgba(255,255,255,0.10)";

/**
 * The Command Centre stage.
 *
 * ── MEDIA ────────────────────────────────────────────────────────────
 * TWIN_SRC is a placeholder. There is no RTSS or safety footage in
 * /public — this is the same clip the IRDS and MEPS heroes use, which is
 * Atlassian's "CSD-24696 Agents In Jira". Drop a real Safety Command
 * Centre recording in and change this one constant; nothing else moves.
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
    </div>
  );
}

export function RtssHero() {
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
              RAMS MHE Safety Intelligence
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06, ease: EASE }}
            className="mt-6 text-[12.5px] sm:text-[14px] text-white/50"
          >
            Powered by <span className="font-semibold text-white/80">RTSS</span>
            <span className="mx-2 text-white/25">—</span>
            Real-Time Safety Suite
          </motion.p>

          {/* Shorter lines buy back the type size: at 26 and 29 characters
              both hold one line at 80px inside the 1180px measure, where the
              longer wording capped it at 72px. "Safety" comes out of the first
              line because the eyebrow above already says it. */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.14, ease: EASE }}
            className="mt-8 sm:mt-10 text-[40px] sm:text-[60px] lg:text-[80px] font-bold leading-[1.05] tracking-[-0.044em]"
          >
            <span className="block text-white">Every event has a context.</span>
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
              RTSS helps you understand it.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="mt-7 text-[14px] sm:text-[16px] text-white/60 leading-[1.55] max-w-[1120px] mx-auto"
          >
            RTSS combines MHE driving behaviour, Digital Twin context and
            optional impact, AI Vision and precision sensing to turn safety
            signals into evidence, recurring-risk patterns and appropriate
            action.
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
              Request an RTSS demo
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="#driving"
              className="inline-flex items-center gap-2 text-white text-[14px] font-semibold px-6 py-3 rounded-lg border border-white/15 transition-colors duration-200 hover:bg-white/[0.06]"
            >
              Explore safety intelligence
            </Link>
          </motion.div>
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
              RTSS — Safety Command Centre
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
        </motion.div>

        <RiqClients />
      </div>
    </section>
  );
}
