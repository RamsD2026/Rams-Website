"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SURFACE } from "@/components/sections/rackiq/rackiq-shared";
import { EASE } from "./irdsx-shared";

/**
 * 17 — The close.
 *
 * The site's unified dark close, unchanged: same ground, bottom glow and
 * button shapes as the Digital Twin, MEPS and IRDS closes. A product tour ends
 * on the same door as everything else on this site.
 */

export function IrxCTA() {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{ background: SURFACE.darkBottom }}
      id="demo"
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
          See it running
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, ease: EASE }}
          className="mt-5 text-[32px] sm:text-[46px] lg:text-[60px] font-bold tracking-[-0.04em] leading-[1.06] mx-auto"
        >
          <span className="text-white">See IRDS run one cycle</span>
          <br />
          <span className="text-white/45">
            On <span className="text-signal-orange">your rack estate</span>.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
          className="mt-7 text-[16px] sm:text-[18px] text-white/55 leading-[1.6] max-w-[880px] mx-auto"
        >
          A working session on your own rack systems, inspection method and
          thresholds — set up, configured, inspected, tested, reviewed and
          reported, end to end.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="mt-10 flex items-center justify-center gap-3.5 flex-wrap"
        >
          <Link
            href="/book-a-demo"
            className="inline-flex items-center gap-2 bg-signal-orange text-white text-[16px] font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:bg-signal-orange-hover hover:-translate-y-0.5"
          >
            Book a demo
            <ArrowUpRight className="w-4 h-4" aria-hidden />
          </Link>
          <Link
            href="#workflow"
            className="inline-flex items-center gap-2 text-white text-[16px] font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:bg-white hover:text-carbon"
            style={{ boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.18)" }}
          >
            Walk the workflow again
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-white/70 text-[16px] font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:text-white hover:bg-white/[0.06]"
            style={{ boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.12)" }}
          >
            Talk to a rack safety expert
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
