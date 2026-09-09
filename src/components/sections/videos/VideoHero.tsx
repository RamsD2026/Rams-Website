"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Boxes,
  Camera,
  Cpu,
  Layers,
  MonitorPlay,
  Radar,
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
 * The case-studies hero, value for value: the same `LightHeroGround`, the
 * same six floating tiles, the same pill → 96px two-line h1 → subline → two
 * buttons, and the same pt-40/52/60. Both are `/resources` pages and a reader
 * moving between them should not feel the site change underneath them.
 *
 * ── No panel — the strip instead ────────────────────────────────────
 * The hero opened on the IRDS capture in a framed `ProductVideo` for a
 * while. It was removed on request, and the clip moved to the head of the
 * library rather than off the page — it is the one recording of the actual
 * software, on the page whose subject is the software.
 *
 * The slot is the case hero's now, value for value: `ClientStrip` on
 * mt-24/28/32, the shared light marquee reading `HERO_CLIENTS` from
 * `src/data/clients.ts` — the same fourteen the About hero and the nine dark
 * platform heroes carry. A hero's last row says who else is already here, and
 * on a videos page that is a better close than a second player above a grid
 * of five.
 *
 * The padding is unchanged at pt-40/52/60 and pb-20/24/28 — the tile slots in
 * `LightHero` are fixed against exactly that top padding and a 96px two-line
 * heading, and moving either puts a tile on a word.
 *
 * `data-hero-tone="light"` is set, which the dark heroes do not need: without
 * it the navbar renders white-on-transparent at the top of the page and
 * disappears against this ground.
 */

/**
 * The six glyphs, in slot order — three down the left, then three down the
 * right. They are the six subjects the films cover: the product on screen,
 * the camera, the edge unit, the sensing, the twin, the stock it all sits on.
 *
 * The hues are `PartnersFlow`'s, and adjacent slots never share one. The
 * case-studies hero uses the same slots with its own six.
 */
const TILES: HeroTile[] = [
  { icon: MonitorPlay, tint: "#3E63DD" },
  { icon: Camera, tint: "#DB2777" },
  { icon: Cpu, tint: "#0891B2" },
  { icon: Radar, tint: "#6647F0" },
  { icon: Layers, tint: "#F76808" },
  { icon: Boxes, tint: "#CA8A04" },
];

export function VideoHero() {
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
              Videos
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
            className="mt-8 text-[46px] sm:text-[72px] lg:text-[96px] font-bold leading-[1.06] tracking-[-0.045em]"
          >
            <span className="block text-carbon">See the platform</span>
            <span className="block text-graphite/50">in motion.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[16px] text-graphite/65 leading-[1.6] max-w-[880px] mx-auto"
          >
            Platform walkthroughs, the hardware that reads the floor, and the
            digital twin behind it — short films, no sign-up.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease: EASE }}
            className="mt-10 flex items-center justify-center gap-3 flex-wrap"
          >
            <Link
              href="#library"
              className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-px hover:bg-signal-orange-hover"
            >
              Browse the library
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="/company/contact"
              className="inline-flex items-center gap-2 bg-white text-carbon text-[14px] font-semibold px-6 py-3.5 rounded-full transition-colors duration-200 hover:bg-[#F5F5F7]"
              style={{ boxShadow: "inset 0 0 0 1px #E0E0E6" }}
            >
              Book a live demo
            </Link>
          </motion.div>
        </div>

        {/* the client strip, in the slot the case hero puts it in */}
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
