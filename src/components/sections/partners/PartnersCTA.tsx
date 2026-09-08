"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { EASE, SURFACE } from "@/components/sections/rackiq/rackiq-shared";

/**
 * The close.
 *
 * The site's unified dark close, value for value: the same `darkBottom`
 * ground, the same bottom glow, the same eyebrow, the same two-line heading
 * with the second line held back and one word in orange, and the same button
 * shapes as the platform closes and the About page's.
 *
 * ── Two buttons, not three ──────────────────────────────────────────
 * The source offers "Apply to become a partner", "Discuss a technology
 * integration" and "Talk to the partnerships team". All three are the same
 * conversation with a different opening line, and three buttons in a row is a
 * menu rather than a call to action. The technology-integration route is
 * already section 03's technology profile and section 04's bridge; what is
 * left is apply, or talk.
 *
 * Both go to `/contact`, which is the route the other closes on this site
 * already use. There is no partner application form under `src/app`, and a
 * link to a 404 is worse than a link to the right form.
 */

export function PartnersCTA() {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{ background: SURFACE.darkBottom }}
      id="apply"
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
          Build with RAMS Digital
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, ease: EASE }}
          className="mt-5 text-[32px] sm:text-[46px] lg:text-[58px] font-bold tracking-[-0.04em] leading-[1.06] mx-auto"
        >
          <span className="text-white">Bring your capability.</span>
          <br />
          <span className="text-white/45">
            Build a stronger{" "}
            <span className="text-signal-orange">operating</span> solution.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
          className="mt-7 text-[16px] sm:text-[18px] text-white/55 leading-[1.6] max-w-[880px] mx-auto"
        >
          Tell us what you offer, who you serve and where you see the joint
          opportunity. We&rsquo;ll explore the right technical, channel or
          delivery model together.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="mt-10 flex items-center justify-center gap-3.5 flex-wrap"
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-signal-orange text-white text-[16px] font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:bg-signal-orange-hover hover:-translate-y-0.5"
          >
            Apply to become a partner
            <ArrowUpRight className="w-4 h-4" aria-hidden />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-white text-[16px] font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:bg-white hover:text-carbon"
            style={{ boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.18)" }}
          >
            Talk to the partnerships team
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
