"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { EASE, Section, SURFACE } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EMAIL, PHONE_1, tel } from "@/components/sections/contact/contact-data";
import { PRODUCT_MAP, STAGES, countOf, topicOf } from "./faq-data";

/**
 * The three sections after the library: the product map, the stages, and the
 * close.
 *
 * Split from `FaqCentre` because none of them reads the search or the topic
 * filter. That component is a client component holding two pieces of state
 * for four sections; these three are static, and keeping them out of it means
 * a keystroke in the hero search does not re-render eight product cards and a
 * four-stage diagram.
 */

const HAIR = "#E8E8ED";

/**
 * 05 — Which application to ask about.
 *
 * Each card jumps to its own topic filter rather than to a product page. A
 * reader on a help centre with the operational problem clear and the product
 * name unclear wants the answers, not the brochure — and the count on each
 * card says how many there are before they press.
 *
 * `topicOf` resolves the label from `faq-data`, so a card cannot name a topic
 * the library does not have.
 */
export function FaqProductMap() {
  return (
    <Section surface="offWhite" id="products">
      <SectionHeader
        eyebrow="Product question map"
        top="Which application"
        bottom="Should I ask about?"
        size="compact"
        width="wide"
        body="Use this when the operational problem is clear but the product name is not."
        className="!mb-10 sm:!mb-12"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PRODUCT_MAP.map((p, i) => {
          const t = topicOf(p.topic);
          return (
            <motion.a
              key={p.code}
              href="#answers"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.05, ease: EASE }}
              className="group flex flex-col h-full p-5 transition-all duration-300 hover:-translate-y-0.5"
              style={{
                borderRadius: 16,
                background: "#FFFFFF",
                boxShadow: `inset 0 0 0 1px ${HAIR}`,
              }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[13px] font-bold tracking-[-0.01em] text-signal-orange">
                  {p.code}
                </span>
                <span className="text-[9px] font-mono font-bold tracking-[0.16em] uppercase text-graphite/35">
                  {p.kind}
                </span>
              </div>

              <p className="mt-4 text-[15px] font-semibold tracking-[-0.02em] text-carbon leading-[1.3] transition-colors duration-300 group-hover:text-signal-orange">
                {p.title}
              </p>

              <p className="mt-2 text-[13px] leading-[1.6] text-graphite/55 flex-1">
                {p.body}
              </p>

              {t && (
                <span
                  className="mt-4 pt-3 text-[12px] font-semibold text-graphite/45 group-hover:text-signal-orange transition-colors"
                  style={{ borderTop: `1px solid ${HAIR}` }}
                >
                  {countOf(p.topic)} answers in {t.name}
                </span>
              )}
            </motion.a>
          );
        })}
      </div>
    </Section>
  );
}

/**
 * 06 — How an answer becomes a project.
 *
 * `CaseOutcomes`, `VideoNext`, `WebinarTracks` and the downloads governance
 * section are the reference: bare columns, a code, a heading, a line, no box.
 * Four of them, one per column at `lg`.
 */
export function FaqStages() {
  return (
    <Section surface="white" id="stages">
      <SectionHeader
        eyebrow="How answers become a project"
        top="From first question"
        bottom="To operating value."
        size="compact"
        width="wide"
        body="Every deployment begins with the physical operation and the decisions the customer needs to improve."
        className="!mb-10 sm:!mb-12"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
        {STAGES.map((s, i) => (
          <motion.div
            key={s.code}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: (i % 4) * 0.07, ease: EASE }}
            className="flex flex-col"
          >
            <span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
              {s.code}
            </span>

            <h3 className="mt-4 text-[19px] sm:text-[20px] font-semibold tracking-[-0.02em] text-carbon leading-[1.25]">
              {s.title}
            </h3>

            <p className="mt-2.5 text-[14px] leading-[1.65] text-graphite/60">
              {s.body}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/**
 * The close.
 *
 * The site's unified dark close. It asks for the operational problem rather
 * than offering a demo first, which is the source's own close and the right
 * one here: somebody at the bottom of fifty answers has the one question that
 * was not among them.
 */
export function FaqCTA() {
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
          Still have a question
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, ease: EASE }}
          className="mt-5 text-[32px] sm:text-[46px] lg:text-[58px] font-bold tracking-[-0.04em] leading-[1.06] mx-auto"
        >
          <span className="text-white">Bring us the</span>
          <br />
          <span className="text-white/45">
            operational <span className="text-signal-orange">problem</span>.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
          className="mt-7 text-[16px] sm:text-[18px] text-white/55 leading-[1.6] max-w-[880px] mx-auto"
        >
          Tell us the facility type, the number of sites, the assets involved,
          the current systems and the decision you want to improve. We will
          route it to the right specialist.
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
            Ask a product question
            <ArrowUpRight className="w-4 h-4" aria-hidden />
          </Link>
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex items-center gap-2 text-white text-[16px] font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:bg-white hover:text-carbon"
            style={{ boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.18)" }}
          >
            {EMAIL}
          </a>
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
