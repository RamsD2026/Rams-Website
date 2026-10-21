"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { EASE, SURFACE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * /company/about — current version (2026-10-21).
 *
 * The words are the owner's reference page ("About RAMS Digital —
 * Intelligence for the Physical World"), unchanged. The design is the
 * site's, not the reference's:
 *
 *   Hero     light   the company heroes' ground, pill, two-line 92px h1,
 *                    subline and rounded-lg buttons (Partners, Careers)
 *   Story    offWhite SectionHeader, then the story beside a stage timeline
 *   Vision   white    SectionHeader, then the stages as numbered circles
 *   Close    dark     the site's unified close (Partners, platform pages)
 *
 * The previous 14-section page is commit 3223e63; its components are still
 * in this folder.
 */

const reveal = (i = 0) => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.4 },
  transition: { duration: 0.65, delay: i * 0.08, ease: EASE },
});

/* ── hero ─────────────────────────────────────────────────────────── */

export function AboutV2Hero() {
  return (
    <section
      className="relative overflow-hidden"
      id="top"
      data-hero-tone="light"
      style={{
        background:
          "radial-gradient(80% 100% at 50% 0%, #FFFFFF 0%, #FBFBFC 55%, #F5F5F7 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[720px]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 20%, rgba(255,106,0,0.10), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(#F0F0F2 1px, transparent 1px)," +
            "linear-gradient(90deg, #F0F0F2 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
        }}
      />

      <div className="relative rams-container pt-36 sm:pt-44 lg:pt-52 pb-20 sm:pb-24 lg:pb-28">
        <div className="relative z-[1] max-w-[1180px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur"
            style={{ boxShadow: "inset 0 0 0 1px #E8E8ED" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
            <span className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-graphite/70">
              About RAMS Digital
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
            className="mt-7 sm:mt-8 text-[46px] sm:text-[72px] lg:text-[92px] font-bold leading-[1.04] tracking-[-0.045em] text-carbon"
          >
            <span className="block">We Build Intelligence</span>
            <span className="block">for the Physical World.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="mt-7 max-w-[880px] mx-auto text-[15px] sm:text-[16px] text-graphite/65 leading-[1.6]"
          >
            We connect physical facilities, assets and operations through
            Digital Twins, IoT, edge intelligence and AI—providing real-time
            visibility and a Physical Execution System that turns insights into
            measurable on-ground improvement.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.29, ease: EASE }}
            className="mt-7 flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-2 text-[15px] sm:text-[17px] font-bold tracking-[-0.01em]"
          >
            {/* The five verbs as a sequence: a small orange dot between each,
                and the last two — the action — in orange. */}
            {["Sense.", "Understand.", "Decide.", "Execute.", "Improve."].map((w, i) => (
              <span key={w} className="inline-flex items-center gap-x-3 sm:gap-x-4">
                {i > 0 && (
                  <span aria-hidden className="w-1 h-1 rounded-full bg-signal-orange/60" />
                )}
                <span className={i >= 3 ? "text-signal-orange" : "text-carbon"}>{w}</span>
              </span>
            ))}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.36, ease: EASE }}
            className="mt-9"
          >
            <p className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-graphite/45">
              Turn physical insight into action
            </p>
            <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
              <Link
                href="/company/contact"
                className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3 rounded-lg transition-colors duration-200 hover:bg-signal-orange-hover"
              >
                Request a Demo
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
              <Link
                href="/company/contact"
                className="inline-flex items-center gap-2 bg-white text-carbon text-[14px] font-semibold px-6 py-3 rounded-lg transition-colors duration-200 hover:bg-[#F5F5F7]"
                style={{ boxShadow: "inset 0 0 0 1px #E0E0E6" }}
              >
                Talk to Our Team
              </Link>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

/* ── our story / our vision ───────────────────────────────────────── */

/* The company sub-pages' hierarchy (Partners, Careers): after the light hero,
   light sections alternate offWhite → white, each opening on `SectionHeader`
   at `compact`, and the dark close ends the page. No two sections share a
   layout:

     Story   offWhite  header, then the story beside a vertical stage timeline
     Vision  white     header, then the five stages as numbered circles on a
                       track (the MHE "How it works" design)

   The reference's words are kept; how they are split across header, column
   and timeline is the site's. */

const STORY_STAGES = ["Engineering", "Technology", "Physical Intelligence", "Execution"];

export function AboutV2Story() {
  return (
    <Section surface="offWhite" id="story">
      <SectionHeader
        eyebrow="Our Story"
        top="We started with"
        bottom="the built environment."
        size="compact"
        width="wide"
        body="RAMS grew from years of working closely with physical infrastructure—understanding structures, facilities, assets and how real environments behave over time."
        className="!mb-12 sm:!mb-14"
      />

      <div className="max-w-[1080px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] gap-10 lg:gap-16 items-center">
        <div>
          <motion.p {...reveal()} className="text-[16px] sm:text-[17px] leading-[1.7] text-graphite/70">
            That engineering foundation evolved into Digital Twins, software,
            IoT, edge intelligence and AI. Today, we build the connected
            intelligence and execution layer that helps physical operations
            become clearer, safer and continuously better.
          </motion.p>
          <motion.p
            {...reveal(1)}
            className="mt-8 pl-5 border-l-2 border-signal-orange text-[20px] sm:text-[24px] font-semibold tracking-[-0.02em] leading-[1.35] text-carbon"
          >
            We understood the physical world first. Then we started building
            intelligence around it.
          </motion.p>
        </div>

        {/* the stages, top to bottom */}
        <motion.ol
          {...reveal(2)}
          className="p-7 sm:p-8 rounded-2xl bg-white"
          style={{ boxShadow: "inset 0 0 0 1px #E8E8ED" }}
        >
          {STORY_STAGES.map((t, i) => {
            const last = i === STORY_STAGES.length - 1;
            return (
              <li key={t} className={"relative flex items-center gap-4 " + (last ? "" : "pb-7")}>
                {!last && (
                  <span
                    aria-hidden
                    className="absolute left-5 top-10 bottom-0 w-[2px] -translate-x-1/2 bg-signal-orange/25"
                  />
                )}
                <span
                  className={
                    "relative flex items-center justify-center w-10 h-10 rounded-full shrink-0 text-[13px] font-mono font-bold tabular-nums " +
                    (last ? "bg-signal-orange text-white" : "bg-[#FFF3E8] text-signal-orange")
                  }
                >
                  0{i + 1}
                </span>
                <span className="text-[17px] sm:text-[18px] font-semibold tracking-[-0.02em] text-carbon">
                  {t}
                </span>
              </li>
            );
          })}
        </motion.ol>
      </div>
    </Section>
  );
}

const VISION_STAGES = ["Manual", "Connected", "Intelligent", "Assisted", "Autonomous"];

export function AboutV2Vision() {
  return (
    <Section surface="white" id="vision">
      <SectionHeader
        eyebrow="Our Vision"
        top="Evolve existing warehouses and factories"
        bottom="toward autonomous operations."
        size="compact"
        width="wide"
        body="RAMS helps facilities augment existing assets with sensors, edge processors, AI and connected intelligence—improving Safety, Productivity, Efficiency and Visibility without requiring wholesale replacement."
        className="!mb-6 sm:!mb-8"
      />
      <motion.p
        {...reveal()}
        className="max-w-[880px] mx-auto text-center text-[14px] sm:text-[15px] leading-[1.55] text-graphite/65"
      >
        As operations mature, mixed fleets, machines, AGVs and robots can
        progress from manual to connected, assisted and, where technically
        suitable, autonomous operation. RAMS provides one OEM-agnostic operating
        platform while retaining the flexibility for manual control.
      </motion.p>

      <div className="relative mt-16 sm:mt-20 max-w-[1240px] mx-auto">
        <div
          aria-hidden
          className="hidden lg:block absolute left-0 right-0 top-[46px] h-px"
          style={{
            background:
              "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.08) 12%, rgba(0,0,0,0.08) 88%, transparent 100%)",
          }}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 sm:[&>*:last-child]:col-span-2 lg:[&>*:last-child]:col-span-1 gap-10 sm:gap-6">
          {VISION_STAGES.map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
              className="relative flex flex-col items-center text-center px-3"
            >
              <div className="relative mb-8">
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-full blur-2xl opacity-70"
                  style={{
                    background: "radial-gradient(closest-side, rgba(255,106,0,0.35), transparent 70%)",
                  }}
                />
                <div
                  className="relative w-[92px] h-[92px] rounded-full flex items-center justify-center font-mono font-bold text-[18px] tracking-[0.02em] bg-white"
                  style={{
                    border: "1px solid #EBEBEF",
                    color: "#0E0E0F",
                    boxShadow: "0 10px 30px -12px rgba(0,0,0,0.12), 0 2px 6px -1px rgba(0,0,0,0.04)",
                  }}
                >
                  <span
                    style={{
                      background: "linear-gradient(135deg, #FF6A00 0%, #FF8A3C 100%)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    0{i + 1}
                  </span>
                </div>
              </div>
              <h3 className="text-[22px] sm:text-[26px] font-bold text-carbon tracking-[-0.025em] leading-[1.15]">
                {t}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div {...reveal()} className="mt-20 sm:mt-24 max-w-[760px] mx-auto text-center">
        <p className="text-[20px] sm:text-[24px] font-semibold tracking-[-0.02em] leading-[1.35] text-carbon">
          Different OEMs. Different Machines. One Operating Platform.
        </p>
        <p className="mt-4 text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange">
          Augment. Automate. Evolve.
        </p>
      </motion.div>
    </Section>
  );
}

/* ── close ────────────────────────────────────────────────────────── */

export function AboutV2CTA() {
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
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, ease: EASE }}
          className="text-[32px] sm:text-[46px] lg:text-[58px] font-bold tracking-[-0.04em] leading-[1.06] mx-auto"
        >
          <span className="text-white">Bring intelligence and execution</span>
          <br />
          <span className="text-white/45">to your physical operation.</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="mt-10 flex items-center justify-center"
        >
          <Link
            href="/company/contact"
            className="inline-flex items-center gap-2 bg-signal-orange text-white text-[16px] font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:bg-signal-orange-hover hover:-translate-y-0.5"
          >
            Start a Conversation
            <ArrowUpRight className="w-4 h-4" aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
