"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Section, EASE } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { SERVICES } from "./service-data";

/**
 * /services — the six, on one page.
 *
 * It exists because the mega menu, the footer and every service page's close
 * link at it. It is deliberately thin: a hero, one card per service and the
 * close. Everything a service has to say is on its own page, and repeating a
 * summary of it here would give a reader two versions to keep in agreement.
 *
 * The cards are derived from `SERVICES`, so a seventh service appears here
 * without a second edit.
 */

export function ServicesIndex() {
  return (
    <>
      <section
        className="relative overflow-hidden text-white"
        id="top"
        data-hero-tone="dark"
        style={{
          background:
            "radial-gradient(80% 100% at 50% 0%, #1D1D1F 0%, #0E0E0F 55%, #08080A 100%)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[720px]"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 20%, rgba(255,106,0,0.22), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
          }}
        />

        <div className="relative rams-container pt-40 sm:pt-48 lg:pt-56 pb-20 sm:pb-24 lg:pb-28">
          <div className="max-w-[1000px] mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
              <span className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-white/70">
                Services
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
              className="mt-8 text-[44px] sm:text-[68px] lg:text-[86px] font-bold leading-[1.06] tracking-[-0.045em]"
            >
              <span className="block text-white">Engineering-led work</span>
              <span
                className="block"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.35) 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                on the warehouse floor.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
              className="mt-6 text-[14px] sm:text-[16px] text-white/60 leading-[1.6] max-w-[820px] mx-auto"
            >
              Inspection, verification, audit, assessment and rollout. Each one
              is scoped for the site, delivered against agreed evidence, and
              issued as a record the operation can act on.
            </motion.p>
          </div>
        </div>
      </section>

      <Section surface="offWhite" id="services">
        <SectionHeader
          eyebrow="What we deliver"
          top="Six services,"
          bottom="One way of working."
          size="compact"
          width="wide"
          body="Every engagement states its scope, its evidence and its limitations before it states a conclusion."
          className="!mb-10 sm:!mb-12"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.06, ease: EASE }}
            >
              <Link
                href={`/services/${s.slug}`}
                className="group flex flex-col h-full p-7 rounded-2xl bg-white transition-all duration-300 hover:-translate-y-0.5 shadow-[inset_0_0_0_1px_#E8E8ED] hover:shadow-[inset_0_0_0_1px_#FFC79A,0_18px_40px_-24px_rgba(8,8,10,0.30)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange">
                    {s.code}
                  </span>
                  <ArrowUpRight
                    className="w-4 h-4 text-graphite/30 transition-all duration-300 group-hover:text-signal-orange group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </div>

                <p className="mt-5 text-[19px] font-bold tracking-[-0.025em] text-carbon leading-[1.25]">
                  {s.name}
                </p>

                <p className="mt-3 text-[13.5px] leading-[1.7] text-graphite/60">
                  {s.intro}
                </p>

                <div className="mt-6 pt-5 flex flex-wrap gap-1.5 border-t border-[#E8E8ED]">
                  {s.chips.map((c) => (
                    <span
                      key={c}
                      className="text-[10px] font-mono font-semibold tracking-[0.14em] uppercase text-graphite/50 px-2 py-1 rounded-full bg-[rgba(14,14,15,0.05)]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

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
              "radial-gradient(60% 60% at 50% 90%, rgba(255,106,0,0.18), transparent 70%)",
          }}
        />

        <div className="relative rams-container py-24 sm:py-32 lg:py-36 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="max-w-[900px] mx-auto text-[34px] sm:text-[52px] lg:text-[64px] font-bold leading-[1.06] tracking-[-0.04em]"
          >
            <span className="block text-white">Tell us the decision</span>
            <span
              className="block"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.35) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              you need to make.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[16px] text-white/60 leading-[1.6] max-w-[720px] mx-auto"
          >
            Share the site, the asset and the question. RAMS will define the
            scope, the evidence method and the output it can support.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
            className="mt-10 flex items-center justify-center"
          >
            <Link
              href="/company/contact"
              className="inline-flex items-center gap-2 bg-signal-orange text-white text-[15px] font-semibold px-7 py-4 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:bg-signal-orange-hover"
            >
              Talk to the team
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
