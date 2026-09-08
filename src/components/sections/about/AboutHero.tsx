"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { EASE } from "@/components/sections/rackiq/rackiq-shared";
import { AboutClients } from "./AboutClients";
import { AboutFacility } from "./AboutFacility";

/**
 * 01 — Hero.
 *
 * Light. The ground is white and the type is carbon, so this hero no longer
 * follows the dark platform heroes — it follows the reference: a white page
 * with a moving gradient behind the copy.
 *
 * Everything the type system asks for is unchanged from the dark version: the
 * 46/72/92 h1 at leading 1.04, the 1180px copy measure, the 880px subline
 * measure, the 11px/0.22em eyebrow. Only the colours moved.
 *
 * The background is the solutions heroes' stack, inverted for a light ground:
 * a top-anchored radial for the section, the signal-orange glow at
 * `60% 60% at 50% 20%` over 720px, and the fine 72px grid masked to fade out
 * through the lower third. Same geometry, same pitch, same mask — only the
 * colours are flipped, and the two alphas are retuned because a wash and a
 * hairline both read differently on white than on near-black.
 *
 * The orb, a mesh gradient and SoftAurora all went through this slot before
 * it; `src/components/ui/SoftAurora.tsx` and `Orb.tsx` are still on disk and
 * now unimported.
 */

/** The three hero tiles. Generated, licence-clean, exported at 2× of 380px. */
const TEAM = [
  {
    src: "/about/team-1.webp",
    alt: "Three colleagues around a desk in a bright office, one standing and pointing at a tablet the other two are looking at",
  },
  {
    src: "/about/team-2.webp",
    alt: "Two colleagues in an office raising their hands to meet in a high five, one seated at a laptop and laughing",
  },
  {
    src: "/about/team-3.webp",
    alt: "Two colleagues at a meeting table beside a window, talking over printed documents",
  },
];

export function AboutHero() {
  return (
    <section
      className="relative overflow-hidden"
      id="top"
      /* Tells the header not to go transparent over this section. Every other
         hero on the site is dark, so the navbar renders white-on-transparent
         while the page is at the top; over this one it would vanish. */
      data-hero-tone="light"
      style={{
        /* The solutions heroes' ground, inverted. Theirs runs
           `radial-gradient(80% 100% at 50% 0%, #1D1D1F, #0E0E0F 55%, #08080A)`
           — lightest at the top, falling away down the section. Same geometry
           here, between white and the site's own `offWhite`, so the section
           has the same vertical falloff without going dark. */
        background:
          "radial-gradient(80% 100% at 50% 0%, #FFFFFF 0%, #FBFBFC 55%, #F5F5F7 100%)",
      }}
    >
      {/* soft signal-orange glow — top, at the solutions heroes' geometry:
          60% 60% at 50% 20% over 720px. They run it at 0.22 over near-black;
          on white the same wash reads far stronger, so it is 0.10 here. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[720px]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 20%, rgba(255,106,0,0.10), transparent 70%)",
        }}
      />

      {/* ── the building ────────────────────────────────
          A distribution centre from above, full bleed, at estate scale — the
          racking, the aisles, the dock doors and six trucks running real
          lanes. It replaces the flat 72px grid: a grid is a texture that says
          nothing, and this says what the company is for.

          Geometry, tone and the lane clearances are in `AboutFacility`. */}
      <AboutFacility />

      <div className="relative rams-container pt-36 sm:pt-44 lg:pt-48 pb-20 sm:pb-24 lg:pb-28">
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
              About RAMS Digital
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
            className="mt-8 sm:mt-10 text-[46px] sm:text-[72px] lg:text-[92px] font-bold leading-[1.04] tracking-[-0.045em] text-carbon"
          >
            {/* Two lines, and they stay two. Each is its own block so the
                break is explicit rather than left to the measure. */}
            <span className="block">We make the warehouse</span>
            <span className="block">see itself.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="mt-7 max-w-[880px] mx-auto text-[15px] sm:text-[16px] text-graphite/65 leading-[1.6]"
          >
            Engineering, field reality and live data, brought into one operating
            system — so the condition of a rack, the movement of a machine and
            the risk in an aisle are current, comparable and acted on.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.29, ease: EASE }}
            className="mt-6 text-[15px] sm:text-[16px] font-bold tracking-[-0.01em] text-carbon"
          >
            From physical assets to a living operational system.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.36, ease: EASE }}
            className="mt-9 flex items-center justify-center gap-3 flex-wrap"
          >
            <Link
              href="#story"
              className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3 rounded-lg transition-colors duration-200 hover:bg-signal-orange-hover"
            >
              Our story
              <ArrowDown className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="/platform/overview"
              className="inline-flex items-center gap-2 bg-white text-carbon text-[14px] font-semibold px-6 py-3 rounded-lg transition-colors duration-200 hover:bg-[#F5F5F7]"
              style={{ boxShadow: "inset 0 0 0 1px #E0E0E6" }}
            >
              Explore the platform
            </Link>
          </motion.div>
        </div>

        {/* ── the team ─────────────────────────────────────
            Three tiles, as in the reference: candid corporate photography of
            people working together, equal 5:4 crops on a 20px gutter.

            1180px row, two 20px gutters, so each tile is 380px and each file
            is exported at 760 — twice that and no more. On the light ground
            they take the site's card hairline and shadow rather than the dark
            sections' white border. */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: EASE }}
          className="relative z-[1] mt-12 sm:mt-14 max-w-[1180px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5"
        >
          {TEAM.map((t, i) => (
            <motion.div
              key={t.src}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 + i * 0.1, ease: EASE }}
              className="relative overflow-hidden bg-white"
              style={{
                aspectRatio: "5 / 4",
                borderRadius: 16,
                border: "1px solid #E8E8ED",
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
              }}
            >
              <Image
                src={t.src}
                alt={t.alt}
                fill
                priority={i === 0}
                sizes="(max-width: 640px) 100vw, 380px"
                className="object-cover"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* the client strip, under the photography */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: EASE }}
          className="relative z-[1]"
        >
          <AboutClients />
        </motion.div>
      </div>
    </section>
  );
}
