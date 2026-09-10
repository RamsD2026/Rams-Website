"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { EASE, SURFACE } from "@/components/sections/rackiq/rackiq-shared";
import { PHONE_1, tel } from "@/components/sections/contact/contact-data";
import { ask } from "./webinar-data";

/**
 * The close.
 *
 * The site's unified dark close: the same `darkBottom` ground, bottom glow,
 * eyebrow, two-line heading with the second line held back and one word in
 * orange, and the same button shapes as the platform closes and the About,
 * Partners, Contact, Case Studies, Videos and Newsroom pages'.
 *
 * ── It asks for a topic, which is the source's own close ────────────
 * "Suggest a webinar topic, ask a technical question or discuss a private
 * learning session." That is a better close for this page than a demo
 * request: somebody at the bottom of a webinar page has just read nine
 * session titles and either found their question or did not.
 *
 * The source offers WhatsApp as a third route. It is dropped: the number
 * behind it is the second of the two the footer carries, and a WhatsApp deep
 * link is the only channel on this site that leaves for an app rather than a
 * page or a mail client. The phone number is offered instead — same
 * immediacy, and it is `PHONE_1` from `contact-data` rather than a fourth
 * hand-typed copy of it.
 */

export function WebinarCTA() {
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
          Talk to an expert
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, ease: EASE }}
          className="mt-5 text-[32px] sm:text-[46px] lg:text-[58px] font-bold tracking-[-0.04em] leading-[1.06] mx-auto"
        >
          <span className="text-white">Have a warehouse question</span>
          <br />
          <span className="text-white/45">
            worth <span className="text-signal-orange">unpacking</span>?
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
          className="mt-7 text-[16px] sm:text-[18px] text-white/55 leading-[1.6] max-w-[880px] mx-auto"
        >
          Suggest a topic for a future session, ask a technical question, or
          talk to us about a private session for your team.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="mt-10 flex items-center justify-center gap-3.5 flex-wrap"
        >
          <a
            href={ask(
              "RAMS Digital Webinar Enquiry",
              "Hello RAMS Digital,\n\nI would like to discuss:\n\nWebinar topic or question:\nCompany:\nTeam or audience:\n\nThank you.",
            )}
            className="inline-flex items-center gap-2 bg-signal-orange text-white text-[16px] font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:bg-signal-orange-hover hover:-translate-y-0.5"
          >
            Suggest a topic
            <ArrowUpRight className="w-4 h-4" aria-hidden />
          </a>
          <Link
            href="/company/contact"
            className="inline-flex items-center gap-2 text-white text-[16px] font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:bg-white hover:text-carbon"
            style={{ boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.18)" }}
          >
            Talk to us
          </Link>
          <a
            href={tel(PHONE_1)}
            className="inline-flex items-center gap-2 text-white/70 text-[16px] font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:text-white hover:bg-white/[0.06]"
            style={{ boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.12)" }}
          >
            {PHONE_1}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
