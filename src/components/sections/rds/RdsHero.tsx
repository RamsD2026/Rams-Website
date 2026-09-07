"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import {
  EASE,
  ProductFrame,
  SURFACE,
} from "@/components/sections/rackiq/rackiq-shared";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { RiqClients } from "@/components/sections/rackiq/RiqClients";

/**
 * 01 — Hero.
 *
 * Same skeleton as the Digital Twin and MEPS heroes: centred pill eyebrow, a
 * two-line h1 at the page-hero scale from `docs/typography.md` (56/84/112,
 * leading 1.06, tracking -0.045em), centred subline, the strapline, two CTAs,
 * and the product full width beneath, then the client strip.
 *
 * The product here is a **real capture**, not a placeholder. The MEPS hero
 * still plays `/Product/irds/hero.mp4`, which is Atlassian's Jira footage;
 * IRDS is the one platform on this site with genuine screens in `SHOTS`, so
 * this one shows the regional rack-safety dashboard through the shared
 * `ProductFrame` instead of borrowing a video.
 *
 * The reference's INSPECT → CLASSIFY → RECTIFY → VERIFY → LEARN chip chain is
 * not here. The same chain was built into the MEPS hero and taken out again —
 * the hero states the promise and the sections underneath carry the method.
 */

export function RdsHero() {
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
              RAMS IRDS Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
            className="mt-8 sm:mt-10 text-[56px] sm:text-[84px] lg:text-[112px] font-bold leading-[1.06] tracking-[-0.045em]"
          >
            <span className="block text-white">Know the health of</span>
            <span className="block text-white">
              Every <span className="text-signal-orange">rack.</span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="mt-6 text-[15px] sm:text-[16px] text-white/60 leading-[1.6] max-w-[880px] mx-auto"
          >
            IRDS—Integrated Rack Diagnostic Suite—digitises rack inspections,
            maps findings to exact components, prioritises risk and manages
            corrective action through verification.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.29, ease: EASE }}
            className="mt-6 text-[15px] sm:text-[16px] font-bold tracking-[-0.01em] text-white"
          >
            Inspect Precisely. Act Faster. Preserve the Rack’s History.
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
              Explore IRDS
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
          <ProductFrame
            shot="regionalDashboard"
            path="app.rams.digital/irds"
            priority
          />
        </motion.div>

        <RiqClients />
      </div>
    </section>
  );
}
