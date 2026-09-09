"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { EASE, SURFACE } from "@/components/sections/rackiq/rackiq-shared";
import { EMAIL } from "@/components/sections/contact/contact-data";

/**
 * The close.
 *
 * The site's unified dark close: the same `darkBottom` ground, bottom glow,
 * eyebrow, two-line heading with the second line held back and one word in
 * orange, and the same button shapes as the platform closes and the About,
 * Partners, Contact, Case Studies and Videos pages'.
 *
 * ── It closes on a person, not a signup ─────────────────────────────
 * The obvious close for a newsroom is "subscribe for updates". There is no
 * list to subscribe to and no backend on this site to hold one — the contact
 * form itself hands off to a `mailto:` — so a field here would collect
 * addresses into nothing. The address is offered instead, and it is the same
 * `EMAIL` the footer, the contact page and the FAQ carry.
 */

export function NewsCTA() {
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
          Working on something
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, ease: EASE }}
          className="mt-5 text-[32px] sm:text-[46px] lg:text-[58px] font-bold tracking-[-0.04em] leading-[1.06] mx-auto"
        >
          <span className="text-white">Ask us before</span>
          <br />
          <span className="text-white/45">
            you <span className="text-signal-orange">file</span>.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
          className="mt-7 text-[16px] sm:text-[18px] text-white/55 leading-[1.6] max-w-[880px] mx-auto"
        >
          Interviews, technical detail, a figure you want checked, or a
          walkthrough of the platform for a piece you are writing — say what
          you need and your deadline.
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
            Media enquiries
            <ArrowUpRight className="w-4 h-4" aria-hidden />
          </Link>
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex items-center gap-2 text-white text-[16px] font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:bg-white hover:text-carbon"
            style={{ boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.18)" }}
          >
            {EMAIL}
          </a>
          <Link
            href="/company/about"
            className="inline-flex items-center gap-2 text-white/70 text-[16px] font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:text-white hover:bg-white/[0.06]"
            style={{ boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.12)" }}
          >
            About RAMS
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
