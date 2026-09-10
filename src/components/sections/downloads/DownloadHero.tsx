"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Boxes,
  Camera,
  ClipboardCheck,
  Cpu,
  FileText,
  Forklift,
  Layers,
  LineChart,
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
import { RESOURCES } from "./download-data";

/**
 * 01 — Hero.
 *
 * The case-studies, videos, newsroom and webinars heroes, value for value:
 * the same `LightHeroGround`, the same six floating tiles, the same pill →
 * 96px two-line h1 → subline → two buttons → `ClientStrip` on mt-24/28/32,
 * and the same pt-40/52/60. Five index pages a reader moves between should
 * not feel like five sites.
 *
 * `HeroTiles` is the orbit: two concentric rings cut off by the top of the
 * section, ten tiles riding them anticlockwise at three sizes. It measures
 * nothing against the words — the radii clear the widest thing in the middle
 * column and the layer fades out above the client strip.
 *
 * ── The count is counted ────────────────────────────────────────────
 * `RESOURCES.length`, not a typed number. The source's own header says "13
 * FILES" in one place and "12 RESOURCES" in another, which is what happens
 * when a count is written down beside the thing it counts.
 *
 * `data-hero-tone="light"` is set, which the dark heroes do not need: without
 * it the navbar renders white-on-transparent at the top of the page and
 * disappears against this ground.
 */

/**
 * The ten glyphs the orbit carries — the ten kinds of thing in the library.
 *
 * One hue each from `PartnersFlow`'s ten, so no two tiles on the ring share a
 * colour. `HeroTiles` decides which ring each lands on and how big it is; the
 * order here is the order it fills its slots, which alternates between the
 * inner and outer paths.
 */
const TILES: HeroTile[] = [
  { icon: FileText, tint: "#3E63DD" },
  { icon: Layers, tint: "#F76808" },
  { icon: ShieldCheck, tint: "#0891B2" },
  { icon: Wrench, tint: "#DB2777" },
  { icon: Cpu, tint: "#6647F0" },
  { icon: Boxes, tint: "#299764" },
  { icon: Forklift, tint: "#CA8A04" },
  { icon: Camera, tint: "#E5484D" },
  { icon: LineChart, tint: "#65A30D" },
  { icon: ClipboardCheck, tint: "#0F766E" },
];

export function DownloadHero() {
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
              Downloads
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
            className="mt-8 text-[46px] sm:text-[72px] lg:text-[96px] font-bold leading-[1.06] tracking-[-0.045em]"
          >
            <span className="block text-carbon">Put the right detail</span>
            <span className="block text-graphite/50">in the right hands.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[16px] text-graphite/65 leading-[1.6] max-w-[880px] mx-auto"
          >
            Product brochures, solution briefs, datasheets and technical
            specifications for RAMS Digital software, hardware and services.
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
              Browse {RESOURCES.length} resources
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="/company/contact"
              className="inline-flex items-center gap-2 bg-white text-carbon text-[14px] font-semibold px-6 py-3.5 rounded-full transition-colors duration-200 hover:bg-[#F5F5F7]"
              style={{ boxShadow: "inset 0 0 0 1px #E0E0E6" }}
            >
              Ask a specialist
            </Link>
          </motion.div>
        </div>

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
