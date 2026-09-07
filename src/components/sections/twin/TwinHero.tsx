"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE, SURFACE } from "@/components/sections/rackiq/rackiq-shared";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { RiqClients } from "@/components/sections/rackiq/RiqClients";

/**
 * 01 — Hero.
 *
 * The site-wide hero skeleton: pill eyebrow, the "Powered by X —" line, the h1
 * at page-hero scale, centred subline, two CTAs, the product full width
 * beneath, then the client strip.
 *
 * The one departure is what sits in the product frame. Every other platform
 * page puts a recording there; this page claims a structured model of the
 * facility exists, so the frame holds the model itself, built from the plan's
 * own coordinates in `twin-plan.ts`. It is the product screen, not an
 * illustration of one — and there is no Digital Twin recording to put in its
 * place.
 */

const LINE = "rgba(255,255,255,0.10)";

const TwinScene = dynamic(() => import("./TwinScene"), {
  ssr: false,
  loading: () => <div className="w-full h-full" aria-hidden />,
});


export function TwinHero() {
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
          {/* the chip eyebrow every solution and platform hero opens with */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
            <span className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-white/70">
              RAMS Digital Twin Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.14, ease: EASE }}
            className="mt-8 sm:mt-10 text-center text-[44px] sm:text-[76px] lg:text-[108px] font-bold leading-[0.95] tracking-[-0.045em] text-white"
          >
            <span className="block">Turn Your Facility Into</span>
            <span className="block">
              A Living Digital{" "}
              <span className="text-signal-orange">System.</span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="mt-7 text-[14px] sm:text-[16px] text-white/60 leading-[1.55] max-w-[1000px] mx-auto"
          >
            A 3D model shows you the building. A Digital Twin shows you the
            operation — every asset in its place, every event in context, every
            change kept as history you can go back to.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[16px] font-bold text-white leading-[1.5] tracking-[-0.01em]"
          >
            Model Anything. Connect Everything. Operate In Context.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.36, ease: EASE }}
            className="mt-9 flex items-center justify-center gap-3 flex-wrap"
          >
            <Link
              href="/book-a-demo"
              className="inline-flex items-center gap-2 bg-signal-orange text-white text-[15px] font-semibold px-7 py-3.5 rounded-full transition-colors duration-200 hover:bg-signal-orange-hover"
            >
              Request a demo
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="#top"
              className="inline-flex items-center gap-2 text-white text-[15px] font-semibold px-7 py-3.5 rounded-full border border-white/20 transition-colors duration-200 hover:bg-white/[0.06]"
            >
              Explore the Twin
            </Link>
          </motion.div>
        </div>

        {/* ── the product ───────────────────────────────────
            The bezel is the solution-page treatment (WexHero): a 28px outer
            shell with 14px of padding and an orange-tinted bloom, holding an
            18px inner surface. Same values, so the platform and solution
            heroes frame their visual identically. */}
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
              background: "linear-gradient(180deg, #0A0F14 0%, #06090C 100%)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              borderRight: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="flex items-center gap-2.5 px-4 h-11 flex-wrap"
              style={{ borderBottom: `1px solid ${LINE}` }}
            >
              <span className="relative flex w-2 h-2 shrink-0">
                <motion.span
                  className="absolute inset-0 rounded-full"
                  style={{ background: "#54DE91" }}
                  animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
                <span
                  className="relative w-2 h-2 rounded-full"
                  style={{ background: "#54DE91" }}
                />
              </span>
              <span className="text-[11.5px] font-semibold text-white/85">
                Digital Twin — Warehouse 01
              </span>
              <span className="ml-auto text-[10px] font-mono font-semibold tracking-[0.12em] uppercase text-signal-orange">
                Live model
              </span>
            </div>

            <div className="h-[320px] sm:h-[440px] lg:h-[540px]">
              <TwinScene />
            </div>
          </div>
        </motion.div>

        <RiqClients label={null} />
      </div>
    </section>
  );
}
