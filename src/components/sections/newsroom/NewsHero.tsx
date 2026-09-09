"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Camera,
  FileText,
  Globe,
  Megaphone,
  Newspaper,
} from "lucide-react";
import { EASE } from "@/components/sections/rackiq/rackiq-shared";
import { ClientStrip } from "@/components/sections/ClientStrip";
import {
  HeroTiles,
  LightHeroGround,
  type HeroTile,
} from "@/components/sections/LightHero";

/**
 * 01 — Hero.
 *
 * The case-studies and videos heroes, value for value: the same
 * `LightHeroGround`, the same six floating tiles, the same pill → 96px
 * two-line h1 → subline → two buttons → `ClientStrip` on mt-24/28/32, and the
 * same pt-40/52/60. Three `/resources`-and-`/company` index pages that a
 * reader moves between should not feel like three sites.
 *
 * The tile slots in `LightHero` are fixed against exactly that top padding
 * and a 96px two-line heading. Move either and a tile lands on a word.
 *
 * ── The copy is the source's ────────────────────────────────────────
 * The heading, the subline and both buttons come from
 * `RAMS_Digital_Newsroom.html`. The hero read differently while the feed was
 * empty — it offered the press kit and an address, because a hero promising
 * "the latest" above an empty grid would have been the page telling its first
 * lie in its largest type. Six real published articles arrived with the
 * source, so it can say what the source says.
 *
 * `data-hero-tone="light"` is set, which the dark heroes do not need: without
 * it the navbar renders white-on-transparent at the top of the page and
 * disappears against this ground.
 */

/**
 * The six glyphs, in slot order — three down the left, then three down the
 * right: the record, the announcement, the coverage, the picture, the
 * document, the company.
 *
 * The hues are `PartnersFlow`'s, and adjacent slots never share one. The
 * case-studies and videos heroes use the same slots with their own six.
 */
const TILES: HeroTile[] = [
  { icon: Newspaper, tint: "#3E63DD" },
  { icon: Megaphone, tint: "#F76808" },
  { icon: Globe, tint: "#0891B2" },
  { icon: Camera, tint: "#DB2777" },
  { icon: FileText, tint: "#6647F0" },
  { icon: Building2, tint: "#299764" },
];

export function NewsHero() {
  return (
    <section
      className="relative overflow-hidden"
      id="top"
      data-hero-tone="light"
      style={{ background: "#FFFFFF" }}
    >
      <LightHeroGround />

      <div className="relative rams-container pt-40 sm:pt-52 lg:pt-60 pb-20 sm:pb-24 lg:pb-28">
        <HeroTiles tiles={TILES} />

        <div className="max-w-[1080px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur"
            style={{ boxShadow: "inset 0 0 0 1px #E8E8ED" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
            <span className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-graphite/70">
              Newsroom
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
            className="mt-8 text-[46px] sm:text-[72px] lg:text-[96px] font-bold leading-[1.06] tracking-[-0.045em]"
          >
            <span className="block text-carbon">What&rsquo;s moving</span>
            <span className="block text-graphite/50">at RAMS.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[16px] text-graphite/65 leading-[1.6] max-w-[880px] mx-auto"
          >
            Company announcements, product developments, events and expert
            perspectives on making physical operations safer, more productive,
            efficient and visible.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease: EASE }}
            className="mt-10 flex items-center justify-center gap-3 flex-wrap"
          >
            <Link
              href="#feed"
              className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-px hover:bg-signal-orange-hover"
            >
              Read the latest
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="/company/contact"
              className="inline-flex items-center gap-2 bg-white text-carbon text-[14px] font-semibold px-6 py-3.5 rounded-full transition-colors duration-200 hover:bg-[#F5F5F7]"
              style={{ boxShadow: "inset 0 0 0 1px #E0E0E6" }}
            >
              Media enquiries
            </Link>
          </motion.div>
        </div>

        {/* the client strip, in the slot the case and videos heroes put it in */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
          className="relative mt-24 sm:mt-28 lg:mt-32"
        >
          <ClientStrip label="Trusted on the warehouse floor" />
        </motion.div>
      </div>
    </section>
  );
}
