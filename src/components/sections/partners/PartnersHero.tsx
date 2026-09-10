"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { EASE } from "@/components/sections/rackiq/rackiq-shared";
import { PartnersFlow } from "./PartnersFlow";

/**
 * 01 — Hero.
 *
 * Light, and deliberately the About hero's ground rather than the platform
 * heroes' dark one: both pages live under `/company`, and a reader moving
 * between them should not cross a tone change. Same top-anchored radial
 * between white and the site's offWhite, same signal-orange glow at
 * `60% 60% at 50% 20%` over 720px at 0.10, same `data-hero-tone="light"` so
 * the navbar does not render white-on-transparent over it.
 *
 * ── The grid ───────────────────────────────────────────────────────
 * The platform heroes' 72px pitch and their top-anchored mask, carried over
 * to a light ground: `black 0%, black 55%, transparent 100%`, so it is
 * strongest behind the eyebrow and gone by the time the diagram starts.
 *
 * The lines are `#F0F0F2` at full alpha rather than black at low alpha, which
 * is the one thing that does not translate from the dark version. Matching
 * the alpha does not match the contrast: 0.03 white on #0E0E0F lifts 14 to
 * 21 and reads; 0.03 black on white drops 255 to 248 and does not. The value
 * has to be picked against the ground it sits on.
 *
 * The type is the site's hero scale unchanged: 46/72/92 at leading 1.04, a
 * 1180px copy measure and an 880px subline. The padding is not: this hero is
 * set at pt-28/32/36 rather than the About page's 36/44/48, and the gaps down
 * to the diagram are tightened with it, so the top of the flow is above the
 * fold on a laptop. A diagram nobody scrolls to is a diagram nobody sees.
 *
 * ── The flow ───────────────────────────────────────────────────────
 * The About hero closes on photography and a client strip. This one closes on
 * the diagram, because that is the argument: partner technology on the left,
 * one physical operating context in the middle, customer outcomes on the
 * right, and the wires drawn rather than described.
 *
 * It is `PartnersFlow`, and the two things in it worth knowing before editing
 * are documented there: the SVG and the HTML share one coordinate system
 * because the container is locked to the viewBox ratio, and the travelling
 * pulse is normalised with `pathLength="1"` so ten wires of ten different
 * lengths run at one speed.
 *
 *
 * ── The top padding clears the navbar ───────────────────────────────
 * pt-36/44/52 — 144, 176 and 208. The header is fixed at h-16 sm:h-20, so
 * that leaves 80 at the smallest and 128 at `lg`.
 *
 * It was pt-28/32/36, which left 64 under an 80px header at `lg`: the pill
 * arrived almost against the nav and the hero read as though it started above
 * the fold rather than below it.
 */

export function PartnersHero() {
  return (
    <section
      className="relative overflow-hidden"
      id="top"
      /* Tells the header not to go transparent over this section — the same
         opt-in the About hero uses. */
      data-hero-tone="light"
      style={{
        background:
          "radial-gradient(80% 100% at 50% 0%, #FFFFFF 0%, #FBFBFC 55%, #F5F5F7 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[720px]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 20%, rgba(255,106,0,0.10), transparent 70%)",
        }}
      />

      {/* the grid, anchored at the top and faded out through the lower
          third — the platform heroes' 72px pitch and mask, in light. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(#F0F0F2 1px, transparent 1px)," +
            "linear-gradient(90deg, #F0F0F2 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
        }}
      />

      <div className="relative rams-container pt-36 sm:pt-44 lg:pt-52 pb-16 sm:pb-20 lg:pb-24">
        <div className="relative z-[1] max-w-[1180px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur"
            style={{ boxShadow: "inset 0 0 0 1px #E8E8ED" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
            <span className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-graphite/70">
              RAMS Digital partner ecosystem
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
            className="mt-7 sm:mt-8 text-[46px] sm:text-[72px] lg:text-[92px] font-bold leading-[1.04] tracking-[-0.045em] text-carbon"
          >
            {/* Two lines, and they stay two — each is its own block so the
                break is explicit rather than left to the measure. */}
            <span className="block">Build the physical</span>
            <span className="block">intelligence ecosystem.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="mt-7 max-w-[880px] mx-auto text-[15px] sm:text-[16px] text-graphite/65 leading-[1.6]"
          >
            Combine your technology, market reach or operational expertise with
            RAMS Digital to deliver safer, more productive and more visible
            facilities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="mt-9 flex items-center justify-center gap-3 flex-wrap"
          >
            <Link
              href="#models"
              className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3 rounded-lg transition-colors duration-200 hover:bg-signal-orange-hover"
            >
              Explore partnership models
              <ArrowDown className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-carbon text-[14px] font-semibold px-6 py-3 rounded-lg transition-colors duration-200 hover:bg-[#F5F5F7]"
              style={{ boxShadow: "inset 0 0 0 1px #E0E0E6" }}
            >
              Apply to become a partner
            </Link>
          </motion.div>
        </div>

        {/* ── the flow ────────────────────────────────────
            What partners connect on the left, the physical context in the
            middle, what the customer gets on the right — with the wires
            drawn and a pulse running along each. Geometry, the shared
            coordinate system and the normalised pulse are in
            `PartnersFlow`. */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.45, ease: EASE }}
          className="relative z-[1] mt-8 sm:mt-10"
        >
          <PartnersFlow />
        </motion.div>

      </div>
    </section>
  );
}
