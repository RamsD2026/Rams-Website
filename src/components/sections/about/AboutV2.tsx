"use client";

import { Fragment } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { EASE, SURFACE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * /company/about — current version (2026-10-21).
 *
 * Built from the owner's reference page ("About RAMS Digital — Intelligence
 * for the Physical World"): hero, Our Story, Our Vision, and a closing band.
 * Every word is the reference's; the layout is the site's own — its dark
 * hero ground, `Section` rhythm, eyebrow, type scale and pill buttons.
 *
 * The previous 14-section page is commit 3223e63; its components are still
 * in this folder.
 */

const reveal = (i = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, delay: i * 0.08, ease: EASE },
});

/** The site's eyebrow: a short orange rule and spaced capitals. */
function Eyebrow({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <p
      className={
        "flex items-center gap-3 text-[11px] font-semibold tracking-[0.22em] uppercase text-signal-orange " +
        (center ? "justify-center" : "")
      }
    >
      {!center && <span aria-hidden className="w-6 h-px bg-signal-orange" />}
      {children}
    </p>
  );
}

/** A row of stage pills joined by orange arrows. */
function Steps({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <ol className={"flex flex-wrap items-center gap-x-2.5 gap-y-3 " + (dark ? "justify-center" : "")}>
      {items.map((it, i) => (
        <Fragment key={it}>
          <li
            className={
              "px-4 py-2 rounded-full text-[12.5px] sm:text-[13px] font-semibold " +
              (dark ? "text-white" : "text-carbon bg-white")
            }
            style={{
              boxShadow: dark ? "inset 0 0 0 1px rgba(255,255,255,0.18)" : "inset 0 0 0 1px #E0E0E6",
              background: dark ? "rgba(255,255,255,0.04)" : undefined,
            }}
          >
            {it}
          </li>
          {i < items.length - 1 && (
            <li aria-hidden className="text-signal-orange">
              <ArrowRight className="w-4 h-4" />
            </li>
          )}
        </Fragment>
      ))}
    </ol>
  );
}

/* ── hero ─────────────────────────────────────────────────────────── */

export function AboutV2Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden text-white"
      style={{ background: SURFACE.darkTop }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] w-[900px] h-[700px]"
        style={{
          background: "radial-gradient(50% 50% at 50% 50%, rgba(255,106,0,0.16), transparent 70%)",
        }}
      />

      <div className="relative rams-container pt-36 sm:pt-44 lg:pt-48 pb-20 sm:pb-24 lg:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <Eyebrow>About RAMS Digital</Eyebrow>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
          className="mt-7 max-w-[1100px] text-[44px] sm:text-[60px] lg:text-[88px] font-bold leading-[1.02] tracking-[-0.045em]"
        >
          We Build Intelligence for the{" "}
          <span className="text-signal-orange">Physical World.</span>
        </motion.h1>

        <div className="mt-10 sm:mt-12 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-10 lg:gap-16 items-end">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="max-w-[640px]"
          >
            <p className="text-[16px] sm:text-[18px] leading-[1.65] text-white/70">
              We connect physical facilities, assets and operations through
              Digital Twins, IoT, edge intelligence and AI—providing real-time
              visibility and a Physical Execution System that turns insights
              into measurable on-ground improvement.
            </p>
            <p className="mt-6 text-[14px] sm:text-[15px] font-bold tracking-[-0.01em] text-white">
              Sense. Understand. Decide.{" "}
              <span className="text-signal-orange">Execute. Improve.</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease: EASE }}
            className="lg:pl-10 lg:border-l lg:border-white/10"
          >
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/45">
              Turn physical insight into action
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/company/contact"
                className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-px hover:bg-signal-orange-hover"
              >
                Request a Demo
                <ArrowUpRight className="w-4 h-4" aria-hidden />
              </Link>
              <Link
                href="/company/contact"
                className="inline-flex items-center gap-2 text-white text-[14px] font-semibold px-6 py-3.5 rounded-full transition-colors duration-200 hover:bg-white hover:text-carbon"
                style={{ boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.22)" }}
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

export function AboutV2Story() {
  return (
    <Section surface="white" id="story">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 lg:gap-20">
        <motion.div {...reveal()}>
          <Eyebrow>Our Story</Eyebrow>
          <h2 className="mt-6 text-[38px] sm:text-[52px] lg:text-[60px] font-bold tracking-[-0.04em] leading-[1.04] text-carbon">
            We started with the built environment.
          </h2>
        </motion.div>

        <div className="lg:pt-10">
          <motion.p {...reveal(1)} className="text-[16px] sm:text-[17px] leading-[1.7] text-graphite/70">
            RAMS grew from years of working closely with physical
            infrastructure—understanding structures, facilities, assets and how
            real environments behave over time.
          </motion.p>
          <motion.p {...reveal(2)} className="mt-5 text-[16px] sm:text-[17px] leading-[1.7] text-graphite/70">
            That engineering foundation evolved into Digital Twins, software,
            IoT, edge intelligence and AI. Today, we build the connected
            intelligence and execution layer that helps physical operations
            become clearer, safer and continuously better.
          </motion.p>

          <motion.div {...reveal(3)} className="mt-9">
            <Steps items={["Engineering", "Technology", "Physical Intelligence", "Execution"]} />
          </motion.div>

          <motion.p
            {...reveal(4)}
            className="mt-10 text-[24px] sm:text-[30px] font-bold tracking-[-0.03em] leading-[1.25] text-graphite/60"
          >
            We understood the physical world first. Then we started building
            intelligence around it.
          </motion.p>
        </div>
      </div>
    </Section>
  );
}

/* ── our vision ───────────────────────────────────────────────────── */

export function AboutV2Vision() {
  return (
    <Section surface="inkTeal" id="vision">
      <div className="max-w-[960px] mx-auto text-center">
        <motion.div {...reveal()}>
          <Eyebrow center>Our Vision</Eyebrow>
          <h2 className="mt-6 text-[38px] sm:text-[54px] lg:text-[68px] font-bold tracking-[-0.04em] leading-[1.04] text-white">
            Evolve existing warehouses and factories toward autonomous
            operations.
          </h2>
        </motion.div>

        <motion.p {...reveal(1)} className="mt-8 max-w-[780px] mx-auto text-[16px] sm:text-[17px] leading-[1.7] text-white/65">
          RAMS helps facilities augment existing assets with sensors, edge
          processors, AI and connected intelligence—improving Safety,
          Productivity, Efficiency and Visibility without requiring wholesale
          replacement.
        </motion.p>
        <motion.p {...reveal(2)} className="mt-5 max-w-[780px] mx-auto text-[16px] sm:text-[17px] leading-[1.7] text-white/65">
          As operations mature, mixed fleets, machines, AGVs and robots can
          progress from manual to connected, assisted and, where technically
          suitable, autonomous operation. RAMS provides one OEM-agnostic
          operating platform while retaining the flexibility for manual
          control.
        </motion.p>

        <motion.div {...reveal(3)} className="mt-10">
          <Steps dark items={["Manual", "Connected", "Intelligent", "Assisted", "Autonomous"]} />
        </motion.div>

        <motion.p {...reveal(4)} className="mt-12 text-[20px] sm:text-[26px] font-bold tracking-[-0.025em] text-white">
          Different OEMs. Different Machines. One Operating Platform.
        </motion.p>
        <motion.p {...reveal(5)} className="mt-4 text-[13px] sm:text-[14px] font-bold tracking-[0.12em] uppercase text-signal-orange">
          Augment. Automate. Evolve.
        </motion.p>
      </div>
    </Section>
  );
}

/* ── close ────────────────────────────────────────────────────────── */

export function AboutV2CTA() {
  return (
    <section id="start" className="relative overflow-hidden bg-signal-orange">
      <div className="relative rams-container py-20 sm:py-24 lg:py-28 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-8 lg:gap-16 items-center">
        <motion.h2
          {...reveal()}
          className="max-w-[760px] text-[34px] sm:text-[46px] lg:text-[54px] font-bold tracking-[-0.04em] leading-[1.06] text-carbon"
        >
          Bring intelligence and execution to your physical operation.
        </motion.h2>
        <motion.div {...reveal(1)}>
          <Link
            href="/company/contact"
            className="inline-flex items-center gap-2 bg-carbon text-white text-[15px] font-semibold px-7 py-4 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:bg-black"
          >
            Start a Conversation
            <ArrowUpRight className="w-4 h-4" aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
