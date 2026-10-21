"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Bot, Cable, Cpu, Hand, Handshake } from "lucide-react";
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
 *   Story    white    heading left / story right, the four stages on a quiet
 *                     hairline track, and the closing line as a quote
 *   Vision   offWhite SectionHeader, the two paragraphs side by side, the five
 *                     stages as an icon track, the closing lines in a dark panel
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
            className="mt-6 text-[15px] sm:text-[16px] font-bold tracking-[-0.01em] text-carbon"
          >
            Sense. Understand. Decide. Execute. Improve.
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

/* ── our story ────────────────────────────────────────────────────── */

/* The four stages, set quietly: a hairline track with a dot at each stage,
   the number and the name under it — no boxes, no pictures. */
const STORY_STAGES = ["Engineering", "Technology", "Physical Intelligence", "Execution"];

export function AboutV2Story() {
  return (
    <Section surface="white" id="story">
      {/* heading left, the story right */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-8 lg:gap-20 items-end">
        <motion.div {...reveal()}>
          <p className="text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange">
            Our Story
          </p>
          <h2 className="mt-5 text-[36px] sm:text-[54px] lg:text-[60px] font-bold tracking-[-0.04em] leading-[1.05] text-carbon">
            We started with
            <br />
            <span className="text-graphite/50">the built environment.</span>
          </h2>
        </motion.div>
        <div>
          <motion.p {...reveal(1)} className="text-[15px] sm:text-[16px] leading-[1.7] text-graphite/65">
            RAMS grew from years of working closely with physical
            infrastructure—understanding structures, facilities, assets and how
            real environments behave over time.
          </motion.p>
          <motion.p {...reveal(2)} className="mt-4 text-[15px] sm:text-[16px] leading-[1.7] text-graphite/65">
            That engineering foundation evolved into Digital Twins, software,
            IoT, edge intelligence and AI. Today, we build the connected
            intelligence and execution layer that helps physical operations
            become clearer, safer and continuously better.
          </motion.p>
        </div>
      </div>

      {/* the four stages */}
      <ol className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-4">
        {STORY_STAGES.map((t, i) => (
          <motion.li
            key={t}
            {...reveal(i)}
            className="relative pl-7 pb-8 sm:pl-0 sm:pb-0 sm:pt-8 sm:pr-6 border-l sm:border-l-0 sm:border-t border-[#E4E4E9] last:pb-0"
          >
            <span
              aria-hidden
              className={
                "absolute -left-[5px] top-0 sm:left-0 sm:-top-[5px] w-[9px] h-[9px] rounded-full " +
                (i === STORY_STAGES.length - 1 ? "bg-signal-orange" : "bg-white")
              }
              style={
                i === STORY_STAGES.length - 1
                  ? undefined
                  : { boxShadow: "inset 0 0 0 1.5px #FF6A00" }
              }
            />
            <span className="block -mt-1 sm:mt-0 text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/45 tabular-nums">
              0{i + 1}
            </span>
            <span className="mt-2 block text-[18px] sm:text-[20px] font-semibold tracking-[-0.02em] text-carbon leading-[1.25]">
              {t}
            </span>
          </motion.li>
        ))}
      </ol>

      {/* the line the section ends on */}
      <motion.blockquote
        {...reveal()}
        className="mt-16 sm:mt-20 max-w-[920px] pl-6 sm:pl-8 border-l-2 border-signal-orange"
      >
        <p className="font-rams-heading text-[24px] sm:text-[32px] lg:text-[38px] font-bold tracking-[-0.03em] leading-[1.2] text-carbon">
          We understood the physical world first.{" "}
          <span className="text-graphite/45">Then we started building intelligence around it.</span>
        </p>
      </motion.blockquote>
    </Section>
  );
}

/* ── our vision ───────────────────────────────────────────────────── */

/* Five stages of autonomy, each read by its icon: a hand, the join, the
   processor, a hand-off with assistance, and the machine on its own. */
const AUTONOMY = [
  { title: "Manual", icon: Hand },
  { title: "Connected", icon: Cable },
  { title: "Intelligent", icon: Cpu },
  { title: "Assisted", icon: Handshake },
  { title: "Autonomous", icon: Bot },
];

export function AboutV2Vision() {
  return (
    <Section surface="offWhite" id="vision">
      <SectionHeader
        eyebrow="Our Vision"
        top="Evolve existing warehouses and factories"
        bottom="toward autonomous operations."
        size="long"
        width="wide"
        className="!mb-10 sm:!mb-12"
      />

      <div className="max-w-[1040px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        <motion.p {...reveal()} className="text-[15px] sm:text-[16px] leading-[1.7] text-graphite/65">
          RAMS helps facilities augment existing assets with sensors, edge
          processors, AI and connected intelligence—improving Safety,
          Productivity, Efficiency and Visibility without requiring wholesale
          replacement.
        </motion.p>
        <motion.p {...reveal(1)} className="text-[15px] sm:text-[16px] leading-[1.7] text-graphite/65">
          As operations mature, mixed fleets, machines, AGVs and robots can
          progress from manual to connected, assisted and, where technically
          suitable, autonomous operation. RAMS provides one OEM-agnostic
          operating platform while retaining the flexibility for manual
          control.
        </motion.p>
      </div>

      {/* the progression: one track, grey to orange */}
      <div className="relative mt-16 sm:mt-20">
        <div
          aria-hidden
          className="hidden lg:block absolute top-7 left-[10%] right-[10%] h-[2px]"
          style={{ background: "linear-gradient(90deg, #D9D9DE 0%, #FF6A00 100%)" }}
        />
        <ol className="relative grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-4">
          {AUTONOMY.map((a, i) => {
            const last = i === AUTONOMY.length - 1;
            return (
              <motion.li
                key={a.title}
                {...reveal(i)}
                className="flex sm:flex-col items-center gap-4 sm:gap-0 sm:text-center"
              >
                <span
                  className={
                    "relative z-[1] flex items-center justify-center w-14 h-14 rounded-full shrink-0 " +
                    (last ? "bg-signal-orange text-white" : "bg-white text-carbon")
                  }
                  style={last ? undefined : { boxShadow: "inset 0 0 0 1px #E0E0E6" }}
                >
                  <a.icon className="w-6 h-6" strokeWidth={1.75} aria-hidden />
                </span>
                <span className="sm:mt-4">
                  <span className="block text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/45 tabular-nums">
                    0{i + 1}
                  </span>
                  <span className={"mt-1 block text-[17px] font-semibold tracking-[-0.02em] " + (last ? "text-signal-orange" : "text-carbon")}>
                    {a.title}
                  </span>
                </span>
              </motion.li>
            );
          })}
        </ol>
      </div>

      {/* the closing lines, set apart */}
      <motion.div
        {...reveal()}
        className="mt-16 sm:mt-20 rounded-3xl px-7 sm:px-12 py-12 sm:py-14 text-center text-white"
        style={{ background: SURFACE.darkTop }}
      >
        <p className="font-rams-heading text-[24px] sm:text-[32px] lg:text-[38px] font-bold tracking-[-0.03em] leading-[1.2]">
          Different OEMs. Different Machines.
          <br className="hidden sm:block" />{" "}
          <span className="text-white/50">One Operating Platform.</span>
        </p>
        <p className="mt-6 text-[12px] font-mono font-semibold tracking-[0.24em] uppercase text-signal-orange">
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
