"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  AppleGlyph,
  AndroidGlyph,
  WindowsGlyph,
} from "./PlatformGlyphs";
import { EASE, SURFACE, ProductVideo } from "./irdsp-shared";
import { IrdspKeywords } from "./IrdspKeywords";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { PageHeader } from "@/components/sections/SectionHeader";

export function IrdspHero() {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{ background: SURFACE.darkTop }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[680px]"
        style={{
          background:
            "radial-gradient(58% 58% at 50% 0%, rgba(255,106,0,0.18), transparent 70%)",
        }}
      />
      <BackgroundBeams className="opacity-[0.55]" />

      <div className="relative rams-container pt-36 sm:pt-44 lg:pt-52 pb-20 sm:pb-24 lg:pb-28">
        <PageHeader
          eyebrow="IRDS Platform"
          top="The operating system"
          bottom="for rack inspection."
          body="Configure inspections. Run testing. Capture results. Manage issues. Build the evidence — in one connected system."
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.34, ease: EASE }}
            className="mt-10 flex items-center justify-center gap-3 flex-wrap"
          >
            <Link
              href="/book-a-demo"
              className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3 rounded-lg transition-colors duration-200 hover:bg-signal-orange-hover"
            >
              Book a Demo
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="#workflow"
              className="inline-flex items-center gap-2 text-white text-[14px] font-semibold px-6 py-3 rounded-lg border border-white/15 transition-colors duration-200 hover:bg-white/[0.06]"
            >
              Explore IRDS
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.44 }}
            className="mt-11 flex items-center justify-center gap-x-8 gap-y-4 flex-wrap"
          >
            {[
              { Icon: AppleGlyph, label: "iOS" },
              { Icon: AndroidGlyph, label: "Android" },
              { Icon: WindowsGlyph, label: "Windows" },
              { Icon: AppleGlyph, label: "Mac" },
            ].map(({ Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-2">
                <Icon className="w-[14px] h-[14px] shrink-0 text-white/35" />
                <span className="text-[11px] font-mono font-bold tracking-[0.18em] uppercase text-white/40">
                  {label}
                </span>
              </span>
            ))}
          </motion.div>
        </PageHeader>

        {/* The product, immediately */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: EASE }}
          className="relative mt-16 sm:mt-20 mx-auto max-w-[1180px]"
        >
          <ProductVideo
            src="/Product/irds/hero.mp4"
            poster="/Product/irds/dashboard.webp"
            path="rams.digital / rack / irds / dashboard"
          />
        </motion.div>
      </div>

      <IrdspKeywords />
    </section>
  );
}
