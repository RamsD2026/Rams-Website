"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { EASE, SURFACE } from "./rackiq-shared";

/** The close. */

export function RiqCTA() {
  return (
    <section
      className="relative overflow-hidden text-white text-center"
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

      <div className="relative rams-container pt-32 sm:pt-40 lg:pt-44 pb-32 sm:pb-40 lg:pb-44">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-[12px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange"
        >
          Clarity in Motion
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, ease: EASE }}
          /* Split explicitly rather than left to an 18ch measure, which broke
             it wherever it landed. The second line is 38 characters, so the
             size steps down to keep it whole in the 1232px container. */
          className="mt-5 text-[32px] sm:text-[46px] lg:text-[60px] font-bold tracking-[-0.04em] leading-[1.06] mx-auto"
        >
          <span className="text-white">See what rack safety looks like</span>
          <br />
          <span className="text-white/45">
            when the intelligence never gets lost.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
          /* 46ch broke this 168-character sentence into four lines. 880px is
             the subline measure in docs/section-header.md and holds it in two. */
          className="mt-7 text-[16px] sm:text-[18px] text-white/55 leading-[1.6] max-w-[880px] mx-auto"
        >
          IRDS transforms inspection findings, engineering measurements,
          historical rack data and corrective actions into a structured,
          all-year rack integrity management system.
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
            Request an IRDS Demo
          </Link>
          <Link
            href="#report"
            className="inline-flex items-center gap-2 text-white text-[16px] font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:bg-white hover:text-carbon"
            style={{ boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.18)" }}
          >
            View Sample Report
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-9 flex items-center justify-center gap-x-3 gap-y-2.5 flex-wrap text-[14px]"
        >
          <Link
            href="/platform/digital-twin"
            className="text-white/55 hover:text-white transition-colors duration-200"
          >
            Explore Rack Digital Twin
          </Link>
          <span className="text-white/20" aria-hidden>
            ·
          </span>
          <Link
            href="/contact"
            className="text-white/55 hover:text-white transition-colors duration-200"
          >
            Discuss a Multi-Site Deployment
          </Link>
          <span className="text-white/20" aria-hidden>
            ·
          </span>
          <Link
            href="/solutions/rack-safety-intelligence"
            className="text-signal-orange hover:text-signal-orange-soft transition-colors duration-200"
          >
            Need a professional rack inspection? →
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
