"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { ProductFrame, SURFACE } from "@/components/sections/rackiq/rackiq-shared";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { EASE } from "./irdsx-shared";

/**
 * 01 — Hero.
 *
 * The product is the hero. Not an illustration, not a diagram of the product —
 * the screen itself, full width, directly under the promise. That is the one
 * thing every platform page worth copying has in common, and it is what the
 * existing IRDS page does not do.
 *
 * The screen under the headline is a real capture — the regional rack-safety
 * dashboard out of `SHOTS`. IRDS is the one product on this site with genuine
 * screens registered, and an earlier version of this page put a grey
 * placeholder in front of one of them, which is how a platform page ends up
 * with no platform on it.
 *
 * Type is the site's page-hero scale from `docs/typography.md` — 56/84/112,
 * leading 1.06, tracking -0.045em — and the eyebrow, buttons and dark ground
 * are the ones every other platform hero on this site uses. What is different
 * is what sits beneath: a product, at full width, on the first screen.
 */

export function IrxHero() {
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

      <div className="relative rams-container pt-36 sm:pt-44 lg:pt-48 pb-16 sm:pb-20">
        <div className="max-w-[1080px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
            <span className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-white/70">
              IRDS Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
            className="mt-8 text-[52px] sm:text-[78px] lg:text-[100px] font-bold leading-[1.02] tracking-[-0.045em]"
          >
            <span className="block text-white">The rack</span>
            <span className="block text-white">
              inspection <span className="text-signal-orange">platform.</span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="mt-7 text-[16px] sm:text-[18px] text-white/60 leading-[1.6] max-w-[720px] mx-auto"
          >
            Configure the inspection. Run the testing. Capture the results.
            Manage the issues. Build the evidence — in one connected system,
            on the desk and on the floor.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.34, ease: EASE }}
            className="mt-9 flex items-center justify-center gap-3 flex-wrap"
          >
            <Link
              href="#workflow"
              className="inline-flex items-center gap-2 bg-signal-orange text-white text-[15px] font-semibold px-7 py-3.5 rounded-lg transition-colors duration-200 hover:bg-signal-orange-hover"
            >
              Explore IRDS
              <ArrowDown className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="/book-a-demo"
              className="inline-flex items-center gap-2 text-white text-[15px] font-semibold px-7 py-3.5 rounded-lg border border-white/15 transition-colors duration-200 hover:bg-white/[0.06]"
            >
              Book a demo
            </Link>
          </motion.div>
        </div>

        {/* ── the product, on the first screen ──────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.45, ease: EASE }}
          className="mt-14 sm:mt-16 max-w-[1120px] mx-auto"
        >
          <ProductFrame
            shot="regionalDashboard"
            path="app.rams.digital/irds"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
