"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Bot, BrainCircuit, Cable, CircleCheckBig, Cpu, Hand, Handshake, Ruler } from "lucide-react";
import { EASE, SURFACE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { RiqClients } from "@/components/sections/rackiq/RiqClients";

/**
 * /company/about — current version (2026-10-21).
 *
 * The words are the owner's reference page ("About RAMS Digital —
 * Intelligence for the Physical World"), unchanged. The design is the
 * site's, not the reference's:
 *
 *   Hero     dark     the solution pages' hero ground and buttons
 *   Story    white    SectionHeader, then the Inventory page's "How RAMS
 *                     applies it" boxes: step tiles, and story + statement
 *   Vision   offWhite header, an animated stepper across, the stage's
 *                     photograph under it and the two paragraphs beneath
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

/* Our Story in the layout of the Inventory Intelligence page's "How RAMS
   applies it" block (`InvABC`), on this section's own light ground: a wide
   box with the story and an orange-tinted statement box, and beside it a
   box of four step tiles. */
const STORY_STAGES = [
  { title: "Engineering", Icon: Ruler },
  { title: "Technology", Icon: Cpu },
  { title: "Physical Intelligence", Icon: BrainCircuit },
  { title: "Execution", Icon: CircleCheckBig },
];

const BOX: React.CSSProperties = {
  borderRadius: 28,
  border: "1px solid #E8E8ED",
  background: "transparent",
  boxShadow: "0 1px 2px rgba(0,0,0,0.02), 0 24px 60px -36px rgba(0,0,0,0.12)",
};

export function AboutV2Story() {
  return (
    <Section surface="white" id="story">
      <SectionHeader
        eyebrow="Our Story"
        top="We started with"
        bottom="the built environment."
        size="compact"
        width="wide"
        className="!mb-12 sm:!mb-14"
      />

      <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* the story and the statement (7 cols, right on lg) */}
        <motion.div {...reveal()} className="lg:col-span-7 lg:order-2 p-8 sm:p-10 lg:p-12" style={BOX}>
          <p className="text-[15px] sm:text-[16px] text-graphite/70 leading-[1.7]">
            RAMS grew from years of working closely with physical
            infrastructure, understanding structures, facilities, assets and how
            real environments behave over time.
          </p>
          <p className="mt-5 text-[15px] sm:text-[16px] text-graphite/70 leading-[1.7]">
            That engineering foundation evolved into Digital Twins, software,
            IoT, edge intelligence and AI. Today, we build the connected
            intelligence and execution layer that helps physical operations
            become clearer, safer and continuously better.
          </p>

          <div
            className="mt-8 p-6 sm:p-7"
            style={{
              borderRadius: 18,
              border: "1px solid rgba(255,106,0,0.22)",
              background: "linear-gradient(180deg, rgba(255,106,0,0.08) 0%, rgba(255,106,0,0.02) 100%)",
            }}
          >
            <p className="text-[18px] sm:text-[21px] font-semibold text-carbon leading-[1.4] tracking-[-0.01em]">
              We understood the physical world first.{" "}
              <span className="text-signal-orange">Then we started building intelligence around it.</span>
            </p>
          </div>
        </motion.div>

        {/* the four steps (5 cols, left on lg) */}
        <motion.div {...reveal(1)} className="lg:col-span-5 lg:order-1 p-8 sm:p-10" style={BOX}>
          <ol className="grid grid-cols-2 auto-rows-fr gap-3 sm:gap-4 h-full">
            {STORY_STAGES.map((s, i) => (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.06, ease: EASE }}
                className="flex flex-col justify-between gap-6 p-5 sm:p-6 min-h-[150px]"
                style={{ borderRadius: 16, border: "1px solid #EDEDF0", background: "#FAFAFB" }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(255,106,0,0.10)", border: "1px solid rgba(255,106,0,0.20)" }}
                >
                  <s.Icon className="w-[18px] h-[18px] text-signal-orange" strokeWidth={2} aria-hidden />
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/45 tabular-nums">
                    0{i + 1}
                  </div>
                  <div className="mt-1.5 text-[15px] sm:text-[16px] font-semibold text-carbon leading-[1.25] tracking-[-0.01em]">
                    {s.title}
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </div>
    </Section>
  );
}

/* Our Vision: an animated stepper across the top, the stage's photograph
   under it, and the two paragraphs beneath.

   The stepper advances on its own after a 4.5s dwell. While it waits, the
   rail from the current stage to the next fills orange, so the delay is
   visible rather than a sudden jump; the current node pulses. It holds while
   the pointer is over the section, a click takes over for good, and
   `prefers-reduced-motion` turns the timer off.

   The photographs are the site's own:
     Manual       an operator driving a counterbalance truck
     Connected    the OmniBox joining cameras, trucks and a robot
     Intelligent  the AI Vision camera boxing people, pallets and trucks
     Assisted     a supervisor's task queue, guided routes and alerts
     Autonomous   the autonomous pallet robot, cropped from the MHE image */
const VISION_STAGES: {
  title: string;
  Icon: typeof Hand;
  img: string;
  alt: string;
  pos?: string;
  zoom?: number;
}[] = [
  {
    title: "Manual",
    Icon: Hand,
    img: "/MHE.png",
    alt: "An operator in a high-visibility vest driving a loaded forklift down a warehouse aisle",
  },
  {
    title: "Connected",
    Icon: Cable,
    img: "/OmniBox.png",
    alt: "A RAMS OmniBox on a column, with glowing links to cameras, a forklift and a pallet robot across the warehouse",
  },
  {
    title: "Intelligent",
    Icon: Cpu,
    img: "/AI Vision.png",
    alt: "A RAMS AI Vision camera on a column, drawing detection boxes around workers, pallets and a forklift",
  },
  {
    title: "Assisted",
    Icon: Handshake,
    img: "/Card 4 — Warehouse Execution.png",
    alt: "A supervisor holding a tablet task queue while a forklift works inside a highlighted zone",
  },
  {
    title: "Autonomous",
    Icon: Bot,
    img: "/Card 2 — MHE Safety and Productivity.png",
    alt: "An autonomous pallet robot carrying a load along a marked path in a warehouse aisle",
    pos: "88% 86%",
    zoom: 2.1,
  },
];

const VISION_MS = 4500;

export function AboutV2Vision() {
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState(false);
  const [hover, setHover] = useState(false);
  const reduce = useReducedMotion();
  const running = !reduce && !manual && !hover;

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % VISION_STAGES.length), VISION_MS);
    return () => clearTimeout(t);
  }, [running, active]);

  const stage = VISION_STAGES[active];

  return (
    <Section surface="offWhite" id="vision">
      <div className="max-w-[1180px] mx-auto text-center mb-12 sm:mb-16">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange mb-5"
        >
          Our Vision
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, ease: EASE }}
          className="text-[32px] sm:text-[40px] lg:text-[48px] xl:text-[58px] leading-[1.08] font-bold tracking-[-0.04em] text-carbon"
        >
          <span className="block lg:whitespace-nowrap">Evolve existing warehouses and factories</span>
          <span className="block lg:whitespace-nowrap text-graphite/50">toward autonomous operations.</span>
        </motion.h2>
      </div>

      <div
        className="max-w-[1080px] mx-auto"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* the stepper, across: each node's rail to the next fills orange
            while it waits, full once passed. Five fit a phone's width. */}
        <ol role="tablist" aria-label="Stages toward autonomous operations" className="grid grid-cols-5">
          {VISION_STAGES.map((s, i) => {
            const on = i === active;
            const done = i < active;
            const last = i === VISION_STAGES.length - 1;
            return (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.12, ease: EASE }}
                className="relative flex justify-center"
              >
                {!last && (
                  <span
                    aria-hidden
                    className="absolute top-5 sm:top-6 left-[calc(50%+26px)] right-[calc(-50%+26px)] sm:left-[calc(50%+32px)] sm:right-[calc(-50%+32px)] h-[2px] -translate-y-1/2 bg-[#E4E4E9] overflow-hidden rounded-full"
                  >
                    <motion.span
                      key={`${i}-${active}-${running}`}
                      className="absolute inset-y-0 left-0 bg-signal-orange"
                      initial={{ width: done ? "100%" : "0%" }}
                      animate={{ width: done ? "100%" : on && running ? "100%" : "0%" }}
                      transition={{ duration: on && running ? VISION_MS / 1000 : 0, ease: "linear" }}
                    />
                  </span>
                )}
                <button
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => {
                    setManual(true);
                    setActive(i);
                  }}
                  className="group relative flex flex-col items-center gap-2.5 sm:gap-3 text-center"
                >
                  <span className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12">
                    {on && !reduce && (
                      <motion.span
                        aria-hidden
                        className="absolute inset-0 rounded-full bg-signal-orange"
                        initial={{ opacity: 0.45, scale: 1 }}
                        animate={{ opacity: 0, scale: 1.7 }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                      />
                    )}
                    <span
                      className={
                        "relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-colors duration-300 " +
                        (on
                          ? "bg-signal-orange text-white"
                          : done
                            ? "bg-[#FFE7D3] text-signal-orange"
                            : "bg-white text-graphite/40 group-hover:text-signal-orange")
                      }
                      style={on || done ? undefined : { boxShadow: "inset 0 0 0 1.5px #E0E0E6" }}
                    >
                      <s.Icon className="w-[18px] h-[18px] sm:w-5 sm:h-5" strokeWidth={2} aria-hidden />
                    </span>
                  </span>
                  <span>
                    <span className="hidden sm:block text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/45 tabular-nums">
                      0{i + 1}
                    </span>
                    <span
                      className={
                        "block sm:mt-0.5 text-[11px] sm:text-[16px] font-semibold tracking-[-0.01em] transition-colors duration-300 " +
                        (on ? "text-carbon" : "text-graphite/50 group-hover:text-carbon")
                      }
                    >
                      {s.title}
                    </span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ol>

        {/* the stage's photograph, then the two paragraphs */}
        <motion.div {...reveal(1)} className="mt-8 sm:mt-10">
          <div
            className="relative overflow-hidden aspect-[4/3] sm:aspect-[16/9]"
            style={{ borderRadius: 28, background: "#0E0E10" }}
          >
            <AnimatePresence mode="sync">
              <motion.div
                key={stage.title}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.8, ease: EASE }}
                className="absolute inset-0"
              >
                <Image
                  src={stage.img}
                  alt={stage.alt}
                  fill
                  sizes="(max-width: 1080px) 100vw, 1080px"
                  className="object-cover"
                  style={{
                    objectPosition: stage.pos ?? "50% 50%",
                    transform: stage.zoom ? `scale(${stage.zoom})` : undefined,
                    transformOrigin: stage.pos ?? "50% 50%",
                  }}
                />
              </motion.div>
            </AnimatePresence>
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(8,8,10,0.8) 0%, rgba(8,8,10,0.3) 35%, transparent 60%)",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white">
              <AnimatePresence mode="wait">
                <motion.div
                  key={stage.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 0.2, ease: EASE }}
                >
                  <span className="text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange tabular-nums">
                    0{active + 1} / 0{VISION_STAGES.length}
                  </span>
                  <p className="mt-1.5 text-[26px] sm:text-[34px] font-bold tracking-[-0.03em] leading-none">
                    {stage.title}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
            <p className="text-[15px] sm:text-[16px] text-graphite/70 leading-[1.7]">
              RAMS helps facilities augment existing assets with sensors, edge
              processors, AI and connected intelligence—improving Safety,
              Productivity, Efficiency and Visibility without requiring
              wholesale replacement.
            </p>
            <p className="text-[15px] sm:text-[16px] text-graphite/70 leading-[1.7]">
              As operations mature, mixed fleets, machines, AGVs and robots can
              progress from manual to connected, assisted and, where
              technically suitable, autonomous operation. RAMS provides one
              OEM-agnostic operating platform while retaining the flexibility
              for manual control.
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div
        {...reveal()}
        className="mt-14 sm:mt-16 max-w-[1240px] mx-auto px-6 sm:px-9 py-6 sm:py-7 text-center"
        style={{
          borderRadius: 20,
          border: "1px solid rgba(255,106,0,0.22)",
          background: "linear-gradient(180deg, rgba(255,106,0,0.08) 0%, rgba(255,106,0,0.02) 100%)",
        }}
      >
        <p className="text-[18px] sm:text-[21px] font-semibold text-carbon leading-[1.4] tracking-[-0.01em]">
          Different OEMs. Different Machines.{" "}
          <span className="text-signal-orange">One Operating Platform.</span>
        </p>
        <p className="mt-3 text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange">
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
