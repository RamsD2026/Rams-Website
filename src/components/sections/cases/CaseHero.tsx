"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Boxes,
  ClipboardCheck,
  FileCheck2,
  Forklift,
  Gauge,
  LineChart,
  PackageSearch,
  Radar,
  ShieldCheck,
  Wrench,
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
 * The solution pages' hero, in light: pill eyebrow, a very large two-line h1,
 * a subline, three mono chips, two buttons, and a framed panel under all of
 * it. `IrdsHero` is the reference and the structure is value for value.
 *
 * ── What changed, and why it is not a translation ───────────────────
 * The solution heroes are dark and the panel holds a live product view. This
 * one is light and the panel holds a photograph, and neither substitution is
 * a swap of values:
 *
 *   ground    flat white, with four washes bleeding in from the corners and
 *             concentric hairlines radiating out of the bottom two. The
 *             solution heroes anchor one radial at the top and lay a 72px
 *             grid over it; that reads as a panel behind the type, and this
 *             reads as light entering the frame. The middle is left clean
 *             white either way, which is what the type sits on
 *   second    `text-graphite/50` in place of the white-to-transparent
 *   h1 line   gradient the dark heroes clip to their text
 *   panel     there is none. The solution heroes close on a framed product
 *             view; this closes on the client strip, which is the same job a
 *             hero's last row usually does on this site — say who else is
 *             already here
 *   height    the framed photograph was 758px of image at the 1240 cap, and
 *             the strip that replaced it is about 80. So the padding is set
 *             at pt-40/52/60 against the solution heroes' pt-40/48/56, and
 *             the strip sits on mt-24/28/32 rather than mt-16/20 — the air
 *             the picture used to occupy has to come from somewhere or the
 *             hero reads as a band rather than as a page opening
 *
 * `data-hero-tone="light"` is set, which the dark heroes do not need: without
 * it the navbar renders white-on-transparent while the page is at the top and
 * disappears against this ground.
 *
 * ── No chip row ─────────────────────────────────────────────────────
 * The solution heroes put three capability phrases between the subline and
 * the buttons. This carried the three figures there — 200+ sites, eight
 * investigations, EN 15635 — until they were removed on request.
 *
 * All three still appear on the page: the first and third in the subline
 * directly above, and the first and second in the FAQ. None of them is
 * measured here; they are the source document's, and there is no shared
 * constant, so a change has to be made in each place it appears.
 *
 * ── The strip, not a picture ────────────────────────────────────────
 * The hero held a framed photograph of an aisle. It is gone: on a page whose
 * next section is six photographs, a seventh above them is the same argument
 * made twice, and the marks say something the photograph cannot — that this
 * is who the work was done for.
 *
 * `ClientStrip` is the shared light marquee, reading `HERO_CLIENTS` from
 * `src/data/clients.ts` — the same fourteen the About hero and the nine dark
 * platform heroes carry. `public/cases/hero.webp` is now unused and can be
 * deleted whenever the picture is definitely not coming back.
 *
 * ── The ground and the tiles are shared ────────────────────────────
 * `LightHeroGround` and `HeroTiles` live in `src/components/sections/
 * LightHero.tsx`. They were written here and `/resources/videos` wanted
 * them unchanged, so they moved out rather than being copied — the same
 * reason `ClientStrip` left the About page.
 *
 * The tile geometry is fixed against *this* layout: `pt-60` and a 96px
 * two-line heading. Both files say so; changing either here without moving
 * the slots there puts a tile on the word "floor".
 */

/**
 * The ten glyphs the orbit carries — the ten things a case study on this page is about.
 *
 * One hue each from `PartnersFlow`'s ten, so no two tiles on the ring share a
 * colour. `HeroTiles` decides which ring each lands on and how big it is; the
 * order here is the order it fills its slots, which alternates between the
 * inner and outer paths.
 */
const TILES: HeroTile[] = [
  { icon: ShieldCheck, tint: "#3E63DD" },
  { icon: PackageSearch, tint: "#F76808" },
  { icon: ClipboardCheck, tint: "#0891B2" },
  { icon: Radar, tint: "#DB2777" },
  { icon: Forklift, tint: "#6647F0" },
  { icon: LineChart, tint: "#299764" },
  { icon: Boxes, tint: "#CA8A04" },
  { icon: Wrench, tint: "#E5484D" },
  { icon: Gauge, tint: "#65A30D" },
  { icon: FileCheck2, tint: "#0F766E" },
];

export function CaseHero() {
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
              Case studies
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
            className="mt-8 text-[46px] sm:text-[72px] lg:text-[96px] font-bold leading-[1.06] tracking-[-0.045em]"
          >
            <span className="block text-carbon">Proof from the</span>
            <span className="block text-graphite/50">warehouse floor.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[16px] text-graphite/65 leading-[1.6] max-w-[880px] mx-auto"
          >
            Rack safety, digital-twin rollouts, MHE safety and forensic
            investigations — the work behind 200+ live sites, built to
            EN 15635.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease: EASE }}
            className="mt-10 flex items-center justify-center gap-3 flex-wrap"
          >
            <Link
              href="#work"
              className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-px hover:bg-signal-orange-hover"
            >
              Explore the work
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="/company/contact"
              className="inline-flex items-center gap-2 bg-white text-carbon text-[14px] font-semibold px-6 py-3.5 rounded-full transition-colors duration-200 hover:bg-[#F5F5F7]"
              style={{ boxShadow: "inset 0 0 0 1px #E0E0E6" }}
            >
              Book a rack audit
            </Link>
          </motion.div>
        </div>

        {/* the client strip, in place of the framed panel */}
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
