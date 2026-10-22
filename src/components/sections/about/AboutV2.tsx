"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Bot, BrainCircuit, Cable, CircleCheckBig, Cpu, Hand, Handshake, Ruler } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { RiqClients } from "@/components/sections/rackiq/RiqClients";

/**
 * /company/about — current version (2026-10-21).
 *
 * The words are the owner's reference page ("About RAMS Digital —
 * Intelligence for the Physical World"), unchanged. The design is the
 * site's, not the reference's:
 *
 *   Hero     dark     the solution pages' hero ground and buttons
 *   Story    white    heading, statement and paragraph, then the four steps
 *                     as an expanding image strip with descriptions
 *   Vision   offWhite heading and introduction, the five stages on the
 *                     animated stepper with descriptions, the closing line
 *   Close    white    the careers talent-network card (dark), as a CTA
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

/* The solution pages' hero ground (MheHero, InvHero): the dark radial with
   the orange glow, white type, the dark pill and the rounded-full buttons —
   so About carries the same colours as the Solutions menu. */
export function AboutV2Hero() {
  return (
    <section
      className="relative overflow-hidden text-white"
      id="top"
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
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
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
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
            <span className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-white/70">
              About RAMS Digital
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
            className="mt-7 sm:mt-8 text-[42px] sm:text-[56px] md:text-[60px] lg:text-[80px] xl:text-[92px] font-bold leading-[1.04] tracking-[-0.045em] text-white"
          >
            {/* two lines, held from md */}
            <span className="block md:whitespace-nowrap">We Build Intelligence</span>
            <span className="block md:whitespace-nowrap text-white/45">for the Physical World.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="mt-7 max-w-[880px] mx-auto text-[15px] sm:text-[16px] text-white/60 leading-[1.6]"
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
            {["Sense.", "Understand.", "Decide.", "Execute.", "Improve."].map((w, i) => (
              <span key={w} className="inline-flex items-center gap-x-3 sm:gap-x-4">
                {i > 0 && <span aria-hidden className="w-1 h-1 rounded-full bg-signal-orange/70" />}
                <span className={i >= 3 ? "text-signal-orange" : "text-white"}>{w}</span>
              </span>
            ))}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.36, ease: EASE }}
            className="mt-9"
          >
            <p className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-white/40">
              Turn physical insight into action
            </p>
            <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
              <Link
                href="/company/contact"
                className="group inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-px hover:bg-signal-orange-hover"
              >
                Request a Demo
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
              <Link
                href="/company/contact"
                className="inline-flex items-center gap-2 text-white text-[14px] font-semibold px-6 py-3.5 rounded-full border border-white/15 bg-white/[0.04] transition-colors duration-200 hover:bg-white/[0.08]"
              >
                Talk to Our Team
              </Link>
            </div>
          </motion.div>
        </div>

        {/* the dark client strip, as on the solution heroes */}
        <RiqClients />
      </div>
    </section>
  );
}

/* ── our story / our vision ───────────────────────────────────────── */

/* The company sub-pages' hierarchy (Partners, Careers): after the light hero,
   light sections alternate offWhite → white, each opening on `SectionHeader`
   at `compact`, and the dark close ends the page. No two sections share a
   layout:

     Story   offWhite  header, then the story box beside a box of step tiles
     Vision  white     header, then the five stages as numbered circles on a
                       track (the MHE "How it works" design)

   The reference's words are kept; how they are split across header, column
   and timeline is the site's. */

/* The two sections share two parts, swapped between them at the owner's
   request: Our Story uses the expanding image strip, Our Vision the centred
   animated stepper. Every stage carries its name and a short description in
   both parts. */

type Stage = {
  title: string;
  /** a few lines under the stage's name */
  body: string;
  Icon: typeof Hand;
  img?: string;
  alt?: string;
  /** object-position + zoom, to crop a detail out of a wider frame */
  pos?: string;
  zoom?: number;
};

/** The stage heading used by both sections: eyebrow, two-line h2, then
    whatever introduction follows. */
function StageHeader({
  eyebrow,
  l1,
  l2,
  children,
}: {
  eyebrow: string;
  l1: string;
  l2: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="max-w-[1180px] mx-auto text-center mb-12 sm:mb-16">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange mb-5"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.85, ease: EASE }}
        className="text-[30px] sm:text-[36px] lg:text-[42px] xl:text-[50px] leading-[1.1] font-bold tracking-[-0.04em] text-carbon"
      >
        <span className="block lg:whitespace-nowrap">{l1}</span>
        <span className="block lg:whitespace-nowrap text-graphite/50">{l2}</span>
      </motion.h2>
      {children}
    </div>
  );
}

const INTRO = "mx-auto max-w-[880px] text-[14px] sm:text-[15px] leading-[1.55] text-graphite/65";

/* ── the image strip ── */

/** The stages as one expanding strip: on lg the stage under the pointer (or
    focused) opens wide with its name and description, the rest narrow to
    slivers showing their number. Below lg, a plain grid of cards. */
function ImageStrip({ stages }: { stages: Stage[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const odd = stages.length % 2 === 1;
  return (
    <ol
      className={
        "max-w-[1240px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 lg:flex lg:gap-3 lg:h-[460px] " +
        (odd ? "sm:[&>*:last-child]:col-span-2" : "")
      }
      onMouseLeave={() => setOpen(null)}
    >
      {stages.map((st, i) => {
        const isOpen = (open ?? 0) === i;
        return (
          <motion.li
            key={st.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            onMouseEnter={() => setOpen(i)}
            onFocus={() => setOpen(i)}
            tabIndex={0}
            className={
              "group relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-full outline-none focus-visible:ring-2 focus-visible:ring-signal-orange transition-[flex-grow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] " +
              (isOpen ? "lg:flex-[4]" : "lg:flex-[1]")
            }
            style={{ borderRadius: 20, background: "#0E0E10" }}
          >
            {st.img && (
              <Image
                src={st.img}
                alt={st.alt ?? ""}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 640px"
                className="object-cover"
                style={{
                  objectPosition: st.pos ?? "50% 50%",
                  transform: st.zoom ? `scale(${st.zoom})` : undefined,
                  transformOrigin: st.pos ?? "50% 50%",
                }}
              />
            )}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background: isOpen
                  ? "linear-gradient(to top, rgba(8,8,10,0.88) 0%, rgba(8,8,10,0.35) 40%, transparent 65%)"
                  : "linear-gradient(to top, rgba(8,8,10,0.9) 0%, rgba(8,8,10,0.55) 50%, rgba(8,8,10,0.35) 100%)",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6 text-white">
              <span
                className="flex items-center justify-center w-9 h-9 rounded-full text-white mb-3"
                style={{
                  background: i === stages.length - 1 ? "#FF6A00" : "rgba(255,255,255,0.14)",
                  backdropFilter: "blur(6px)",
                }}
              >
                <st.Icon className="w-4 h-4" strokeWidth={2} aria-hidden />
              </span>
              <span className="block text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange tabular-nums">
                0{i + 1}
              </span>
              <span
                className={
                  "block mt-1 text-[18px] sm:text-[20px] lg:text-[28px] font-bold tracking-[-0.02em] leading-[1.15] whitespace-nowrap transition-opacity duration-300 " +
                  (isOpen ? "lg:opacity-100 lg:delay-200" : "lg:opacity-0")
                }
              >
                {st.title}
              </span>
              <span
                className={
                  "block mt-2 max-w-[380px] text-[13px] sm:text-[13.5px] leading-[1.5] text-white/70 transition-opacity duration-300 " +
                  (isOpen ? "lg:opacity-100 lg:delay-200" : "lg:opacity-0 lg:hidden")
                }
              >
                {st.body}
              </span>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}

/* ── the stepper ── */

const STEP_MS = 3000;

/** The stages centred on MheWorkflow's circles, each with its description
    under its name. They light in turn — the current circle fills orange and
    the track to the next fills while it waits — and loop, holding on hover
    and stopping on a click. */
function StepTrack({ stages, label }: { stages: Stage[]; label: string }) {
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState(false);
  const [hover, setHover] = useState(false);
  const reduce = useReducedMotion();
  const running = !reduce && !manual && !hover;

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % stages.length), STEP_MS);
    return () => clearTimeout(t);
  }, [running, active, stages.length]);

  const odd = stages.length % 2 === 1;
  const lgCols = stages.length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4";

  return (
    <div
      className="relative max-w-[1240px] mx-auto"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <ol
        aria-label={label}
        className={
          `grid grid-cols-1 sm:grid-cols-2 ${lgCols} gap-y-12 gap-x-6 ` +
          (odd ? "sm:[&>*:last-child]:col-span-2 lg:[&>*:last-child]:col-span-1" : "")
        }
      >
        {stages.map((s, i) => {
          const on = i === active;
          const done = i < active;
          const last = i === stages.length - 1;
          return (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
              className="relative flex flex-col items-center text-center px-2"
            >
              {!last && (
                <span
                  aria-hidden
                  className="hidden lg:block absolute top-[46px] left-[calc(50%+54px)] right-[calc(-50%+54px)] h-[2px] -translate-y-1/2 bg-[#E4E4E9] overflow-hidden rounded-full"
                >
                  <motion.span
                    key={`${i}-${active}-${running}`}
                    className="absolute inset-y-0 left-0 bg-signal-orange"
                    initial={{ width: done ? "100%" : "0%" }}
                    animate={{ width: done ? "100%" : on && running ? "100%" : "0%" }}
                    transition={{ duration: on && running ? STEP_MS / 1000 : 0, ease: "linear" }}
                  />
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  setManual(true);
                  setActive(i);
                }}
                aria-current={on ? "step" : undefined}
                className="group flex flex-col items-center"
              >
                <span className="relative mb-6">
                  <span
                    aria-hidden
                    className={
                      "absolute inset-0 rounded-full blur-2xl transition-opacity duration-500 " +
                      (on ? "opacity-90" : "opacity-40")
                    }
                    style={{ background: "radial-gradient(closest-side, rgba(255,106,0,0.35), transparent 70%)" }}
                  />
                  <span
                    className={
                      "relative w-[92px] h-[92px] rounded-full flex flex-col items-center justify-center gap-1 transition-colors duration-500 " +
                      (on ? "bg-signal-orange text-white" : "bg-white text-signal-orange")
                    }
                    style={{
                      border: on ? "1px solid #FF6A00" : "1px solid #EBEBEF",
                      boxShadow: "0 10px 30px -12px rgba(0,0,0,0.12), 0 2px 6px -1px rgba(0,0,0,0.04)",
                    }}
                  >
                    <s.Icon className="w-6 h-6" strokeWidth={1.75} aria-hidden />
                    <span className={"text-[11px] font-mono font-bold tabular-nums " + (on ? "text-white/80" : "text-graphite/45")}>
                      0{i + 1}
                    </span>
                  </span>
                </span>
                <span
                  className={
                    "text-[19px] sm:text-[21px] font-bold tracking-[-0.025em] leading-[1.15] transition-colors duration-300 " +
                    (on ? "text-carbon" : "text-graphite/55 group-hover:text-carbon")
                  }
                >
                  {s.title}
                </span>
              </button>
              <p className="mt-3 max-w-[260px] text-[13.5px] leading-[1.55] text-graphite/60">{s.body}</p>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

/* ── our story ── */

/* The four steps, with the old About story's photographs: an engineer at a
   rack frame, an asset being scanned, a sensor over an aisle, the floor
   control desk. The descriptions are drawn from the story's own words. */
const STORY_STAGES: Stage[] = [
  {
    title: "Engineering",
    body: "Years of working closely with physical infrastructure, understanding structures, facilities, assets and how real environments behave over time.",
    Icon: Ruler,
    img: "/about/story/field.webp",
    alt: "An engineer in a high-visibility vest crouched at the base of a warehouse racking frame, examining a bent steel upright",
  },
  {
    title: "Technology",
    body: "That engineering foundation evolved into Digital Twins, software, IoT, edge intelligence and AI.",
    Icon: Cpu,
    img: "/about/story/identity.webp",
    alt: "A gloved hand holding a rugged scanner up to an asset label fixed to a racking upright",
  },
  {
    title: "Physical Intelligence",
    body: "Assets, places and live operating data connected into one intelligence layer for the physical operation.",
    Icon: BrainCircuit,
    img: "/about/story/live.webp",
    alt: "A sensor unit and camera mounted high on a warehouse column, with a forklift crossing an aisle below",
  },
  {
    title: "Execution",
    body: "An execution layer that helps physical operations become clearer, safer and continuously better.",
    Icon: CircleCheckBig,
    img: "/about/story/platform.webp",
    alt: "Two operations staff at a warehouse-floor control desk, the racking visible through the glass behind them",
  },
];

export function AboutV2Story() {
  return (
    <Section surface="white" id="story">
      <StageHeader eyebrow="Our Story" l1="We started with" l2="the built environment.">
        <motion.h3
          {...reveal()}
          className="mt-6 mx-auto max-w-[880px] text-[16px] sm:text-[19px] font-medium text-graphite/60 leading-[1.5] tracking-[-0.01em]"
        >
          We understood the physical world first. Then we started building
          intelligence around it.
        </motion.h3>
        <motion.p {...reveal(1)} className={"mt-5 " + INTRO}>
          RAMS grew from years of working closely with physical infrastructure,
          understanding structures, facilities, assets and how real environments
          behave over time. That engineering foundation evolved into Digital
          Twins, software, IoT, edge intelligence and AI. Today, we build the
          connected intelligence and execution layer that helps physical
          operations become clearer, safer and continuously better.
        </motion.p>
      </StageHeader>

      <ImageStrip stages={STORY_STAGES} />
    </Section>
  );
}

/* ── our vision ── */

/* The five stages toward autonomy; the descriptions are drawn from the
   vision's own paragraphs. */
const VISION_STAGES: Stage[] = [
  {
    title: "Manual",
    body: "Machines run by hand, unmonitored.",
    Icon: Hand,
  },
  {
    title: "Connected",
    body: "Sensors added to existing assets.",
    Icon: Cable,
  },
  {
    title: "Intelligent",
    body: "AI turns data into context.",
    Icon: Cpu,
  },
  {
    title: "Assisted",
    body: "Operators guided by real-time alerts.",
    Icon: Handshake,
  },
  {
    title: "Autonomous",
    body: "Machines run on their own.",
    Icon: Bot,
  },
];

export function AboutV2Vision() {
  return (
    <Section surface="offWhite" id="vision">
      <StageHeader eyebrow="Our Vision" l1="Evolve existing warehouses and factories" l2="toward autonomous operations.">
        <motion.p {...reveal()} className={"mt-6 " + INTRO}>
          RAMS helps facilities augment existing assets with sensors, edge
          processors, AI and connected intelligence—improving Safety,
          Productivity, Efficiency and Visibility without requiring wholesale
          replacement.
        </motion.p>
        <motion.p {...reveal(1)} className={"mt-4 " + INTRO}>
          As operations mature, mixed fleets, machines, AGVs and robots can
          progress from manual to connected, assisted and, where technically
          suitable, autonomous operation. RAMS provides one OEM-agnostic
          operating platform while retaining the flexibility for manual
          control.
        </motion.p>
      </StageHeader>

      <StepTrack stages={VISION_STAGES} label="Stages toward autonomous operations" />

      {/* the conclusion, as the site's closing line */}
      <motion.div {...reveal(1)} className="mt-16 sm:mt-20 text-center">
        <p className="mx-auto max-w-[24ch] sm:max-w-none font-rams-heading text-[22px] sm:text-[28px] lg:text-[32px] font-bold tracking-[-0.025em] leading-[1.2] text-carbon">
          Different OEMs. Different Machines.{" "}
          <span className="text-signal-orange">One Operating Platform.</span>
        </p>
        <p className="mt-4 text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-graphite/45">
          Augment. Automate. Evolve.
        </p>
      </motion.div>
    </Section>
  );
}

/* ── close ────────────────────────────────────────────────────────── */

/* The close as the careers page's talent-network card (`CareersTalent`): on
   a white section, so it stands apart from the dark footer, one dark card with the orange corner glow, the claim and
   a line on the left, the actions on the right. */
export function AboutV2CTA() {
  return (
    <Section surface="white" padding="tight" id="start">
      <motion.div
        {...reveal()}
        className="relative overflow-hidden rounded-3xl p-8 sm:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-8 items-center"
        style={{
          background:
            "radial-gradient(70% 120% at 0% 0%, rgba(255,106,0,0.22) 0%, transparent 60%), linear-gradient(135deg, #17171B 0%, #0C0C0F 100%)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.09)",
        }}
      >
        <div>
          <p className="text-[11px] font-mono font-semibold tracking-[0.2em] uppercase text-signal-orange">
            Work with RAMS
          </p>
          <h2 className="mt-4 text-[30px] sm:text-[42px] font-bold tracking-[-0.035em] leading-[1.08] text-white">
            Bring intelligence and execution
            <br className="hidden sm:block" /> to your physical operation.
          </h2>
          <p className="mt-4 max-w-[600px] text-[15px] leading-[1.65] text-white/55">
            Tell us about your sites, assets and fleets. We&rsquo;ll show you
            where RAMS fits, from connecting the equipment you already run to
            one operating platform.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 lg:flex-col lg:items-stretch">
          <Link
            href="/company/contact"
            className="inline-flex items-center justify-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3 rounded-full transition-colors hover:bg-signal-orange-hover"
          >
            Start a Conversation
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
          <Link
            href="/platform/overview"
            className="inline-flex items-center justify-center gap-2 text-white text-[14px] font-semibold px-6 py-3 rounded-full border border-white/15 transition-colors hover:bg-white/[0.06]"
          >
            Explore the platform
            <ArrowUpRight className="w-4 h-4" aria-hidden />
          </Link>
        </div>
      </motion.div>
    </Section>
  );
}
