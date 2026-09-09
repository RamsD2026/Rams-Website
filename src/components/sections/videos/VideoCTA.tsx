"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { EASE, SURFACE } from "@/components/sections/rackiq/rackiq-shared";

/**
 * The close.
 *
 * The site's unified dark close: the same `darkBottom` ground, bottom glow,
 * eyebrow, two-line heading with the second line held back and one word in
 * orange, and the same button shapes as the platform closes and the About,
 * Partners, Contact and Case Studies pages'.
 *
 * ── Three buttons, and the middle one is the argument ───────────────
 * A recording answers the questions somebody thought to answer. The live
 * walkthrough is the one that answers yours, and the heading says so rather
 * than thanking the reader for watching. The third goes to the case studies,
 * which is the other half of a resources visit — what the product does, and
 * what it did.
 */

export function VideoCTA() {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{ background: SURFACE.darkBottom }}
      id="start"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[520px]"
        style={{
          background:
            "radial-gradient(58% 60% at 50% 100%, rgba(255,106,0,0.16), transparent 70%)",
        }}
      />

      <div className="relative rams-container text-center pt-32 sm:pt-40 lg:pt-44 pb-32 sm:pb-40 lg:pb-44">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-[12px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange"
        >
          Your floor next
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, ease: EASE }}
          className="mt-5 text-[32px] sm:text-[46px] lg:text-[58px] font-bold tracking-[-0.04em] leading-[1.06] mx-auto"
        >
          <span className="text-white">A recording answers</span>
          <br />
          <span className="text-white/45">
            our questions. Ask{" "}
            <span className="text-signal-orange">yours</span>.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
          className="mt-7 text-[16px] sm:text-[18px] text-white/55 leading-[1.6] max-w-[880px] mx-auto"
        >
          Book a walkthrough and we will run the same modules against a site
          like yours — the racking, the fleet and the aisles you actually have.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="mt-10 flex items-center justify-center gap-3.5 flex-wrap"
        >
          <Link
            href="/company/contact"
            className="inline-flex items-center gap-2 bg-signal-orange text-white text-[16px] font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:bg-signal-orange-hover hover:-translate-y-0.5"
          >
            Book a live demo
            <ArrowUpRight className="w-4 h-4" aria-hidden />
          </Link>
          <Link
            href="/platform/overview"
            className="inline-flex items-center gap-2 text-white text-[16px] font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:bg-white hover:text-carbon"
            style={{ boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.18)" }}
          >
            See the platform
          </Link>
          <Link
            href="/resources/case-studies"
            className="inline-flex items-center gap-2 text-white/70 text-[16px] font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:text-white hover:bg-white/[0.06]"
            style={{ boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.12)" }}
          >
            Read the case studies
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
