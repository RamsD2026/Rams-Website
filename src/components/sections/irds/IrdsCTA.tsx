"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function IrdsCTA() {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(80% 100% at 50% 100%, #1D1D1F 0%, #0E0E0F 55%, #08080A 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[560px]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 100%, rgba(255,106,0,0.22), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(to top, black 0%, black 50%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to top, black 0%, black 50%, transparent 100%)",
        }}
      />

      <div className="relative rams-container pt-28 sm:pt-36 lg:pt-44 pb-28 sm:pb-36 lg:pb-44">
        <div className="max-w-[1180px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
            <span className="text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-white/70">
              Safer racks. Better decisions.
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, delay: 0.05, ease: EASE }}
            className="mt-8 text-[36px] sm:text-[58px] lg:text-[76px] font-bold leading-[1.02] tracking-[-0.04em]"
          >
            <span className="block whitespace-nowrap text-white">
              Make rack safety visible,
            </span>
            <span
              className="block whitespace-nowrap"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.35) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              measurable and actionable.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[15px] text-white/60 leading-[1.55] max-w-[880px] mx-auto"
          >
            Talk to RAMS Digital about rack inspection, digital rack mapping
            and ongoing rack-safety intelligence for your warehouse network.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
            className="mt-10 flex items-center justify-center gap-3 flex-wrap"
          >
            <Link
              href="/book-a-demo"
              className="inline-flex items-center gap-2 bg-white text-carbon text-[14px] font-semibold px-6 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-px hover:bg-white/90"
            >
              Book a Discussion
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-white text-[14px] font-semibold px-6 py-3.5 rounded-full border border-white/15 transition-all duration-200 hover:bg-white/[0.06]"
            >
              Talk to sales
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
