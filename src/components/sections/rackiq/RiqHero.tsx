"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE, ProductVideo, SURFACE } from "./rackiq-shared";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { RiqClients } from "./RiqClients";

/**
 * Hero — centred, with the product composite full width beneath.
 *
 * The h1 runs to three lines rather than the usual two, so it steps one size
 * down from the standard page heading in docs/typography.md. Everything else —
 * the pill eyebrow, the motion timings, the gradient on the closing line —
 * matches PageHeader exactly.
 */

export function RiqHero() {
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
        <div className="max-w-[1080px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
            <span className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-white/70">
              RAMS Rack Intelligence
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06, ease: EASE }}
            className="mt-6 text-[12.5px] sm:text-[14px] text-white/50"
          >
            Powered by <span className="font-semibold text-white/80">IRDS</span>
            <span className="mx-2 text-white/25">—</span>
            Integrated Rack Diagnostic Suite
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.14, ease: EASE }}
            className="mt-7 text-[56px] sm:text-[84px] lg:text-[112px] font-bold leading-[0.98] tracking-[-0.045em]"
          >
            <span className="block text-white">The operating system</span>
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
              for rack inspection.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[16px] text-white/60 leading-[1.55] max-w-[1120px] mx-auto"
          >
            Configure inspections. Run testing. Capture results. Manage issues.
            Build the evidence — in one connected system.
          </motion.p>

          {/* CTAs */}
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
              Request an IRDS Demo
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="#report"
              className="inline-flex items-center gap-2 text-white text-[14px] font-semibold px-6 py-3 rounded-lg border border-white/15 transition-colors duration-200 hover:bg-white/[0.06]"
            >
              View Sample Report
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
          <ProductVideo
            src="/Product/irds/hero.mp4"
            path="app.rams.digital/rack/irds"
            tone="dark"
          />

          <RiqClients />
        </motion.div>
      </div>
    </section>
  );
}
