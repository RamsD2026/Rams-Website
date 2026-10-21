"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, BrainCircuit, CircleCheckBig, Cpu, Ruler } from "lucide-react";
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
 *                     applies it" boxes: story + statement, and step tiles
 *   Vision   offWhite header, then a stepper: the stages on the left, the
 *                     stage's photograph on the right, advancing on its own
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

/* The five stages as a stepper with a picture: the list on the left with a
   progress rail, the stage's photograph on the right. It advances on its own
   every 4.5s, holds while the pointer is over it, and a click takes over for
   good. The photographs are the site's own:

     Manual       an operator driving a counterbalance truck
     Connected    the OmniBox joining cameras, trucks and a robot
     Intelligent  the AI Vision camera boxing people, pallets and trucks
     Assisted     a supervisor's task queue, guided routes and alerts
     Autonomous   the autonomous pallet robot, cropped from the MHE image */
const VISION_STAGES: {
  title: string;
  img: string;
  alt: string;
  /** object-position + zoom, to crop the robot out of a wider frame */
  pos?: string;
  zoom?: number;
}[] = [
  {
    title: "Manual",
    img: "/MHE.png",
    alt: "An operator in a high-visibility vest driving a loaded forklift down a warehouse aisle",
  },
  {
    title: "Connected",
    img: "/OmniBox.png",
    alt: "A RAMS OmniBox on a column, with glowing links to cameras, a forklift and a pallet robot across the warehouse",
  },
  {
    title: "Intelligent",
    img: "/AI Vision.png",
    alt: "A RAMS AI Vision camera on a column, drawing detection boxes around workers, pallets and a forklift",
  },
  {
    title: "Assisted",
    img: "/Card 4 — Warehouse Execution.png",
    alt: "A supervisor holding a tablet task queue while a forklift works inside a highlighted zone",
  },
  {
    title: "Autonomous",
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

  useEffect(() => {
    if (reduce || manual || hover) return;
    const t = setInterval(() => setActive((i) => (i + 1) % VISION_STAGES.length), VISION_MS);
    return () => clearInterval(t);
  }, [reduce, manual, hover]);

  const stage = VISION_STAGES[active];

  return (
    <Section surface="offWhite" id="vision">
      {/* SectionHeader's eyebrow, weights and colours, at a size that keeps
          the longer line on one row from lg. */}
      <div className="max-w-[1180px] mx-auto text-center mb-6 sm:mb-8">
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
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
          className="mt-6 mx-auto max-w-[880px] text-[14px] sm:text-[15px] leading-[1.55] text-graphite/65"
        >
          RAMS helps facilities augment existing assets with sensors, edge
          processors, AI and connected intelligence—improving Safety,
          Productivity, Efficiency and Visibility without requiring wholesale
          replacement.
        </motion.p>
      </div>

      {/* the stepper */}
      <motion.div
        {...reveal()}
        className="mt-14 sm:mt-16 max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* left — the stages and the paragraph that walks them */}
        <div
          className="lg:col-span-5 flex flex-col p-7 sm:p-9"
          style={{ borderRadius: 28, border: "1px solid #E8E8ED", background: "#FFFFFF" }}
        >
          <p className="text-[14px] sm:text-[15px] leading-[1.65] text-graphite/65">
            As operations mature, mixed fleets, machines, AGVs and robots can
            progress from manual to connected, assisted and, where technically
            suitable, autonomous operation. RAMS provides one OEM-agnostic
            operating platform while retaining the flexibility for manual
            control.
          </p>

          <ol className="mt-8 flex-1 flex flex-col justify-between" role="tablist" aria-label="Stages toward autonomous operations">
            {VISION_STAGES.map((s, i) => {
              const on = i === active;
              const done = i < active;
              const last = i === VISION_STAGES.length - 1;
              return (
                <li key={s.title} className={"relative " + (last ? "" : "pb-2")}>
                  {!last && (
                    <span
                      aria-hidden
                      className="absolute left-[19px] top-10 bottom-0 w-[2px] -translate-x-1/2 transition-colors duration-500"
                      style={{ background: done || on ? "rgba(255,106,0,0.45)" : "#E8E8ED" }}
                    />
                  )}
                  <button
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => {
                      setManual(true);
                      setActive(i);
                    }}
                    className={
                      "relative w-full flex items-center gap-4 rounded-xl px-0 py-2 text-left transition-colors duration-300 " +
                      (on ? "" : "hover:opacity-80")
                    }
                  >
                    <span
                      className={
                        "flex items-center justify-center w-10 h-10 rounded-full shrink-0 text-[12.5px] font-mono font-bold tabular-nums transition-colors duration-300 " +
                        (on
                          ? "bg-signal-orange text-white"
                          : done
                            ? "bg-[#FFF3E8] text-signal-orange"
                            : "bg-[#F2F2F4] text-graphite/45")
                      }
                    >
                      0{i + 1}
                    </span>
                    <span
                      className={
                        "text-[17px] sm:text-[19px] font-semibold tracking-[-0.02em] transition-colors duration-300 " +
                        (on ? "text-carbon" : "text-graphite/50")
                      }
                    >
                      {s.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {/* right — the stage's photograph */}
        <div
          className="lg:col-span-7 relative overflow-hidden min-h-[280px] sm:min-h-[380px] lg:min-h-0"
          style={{ borderRadius: 28, background: "#0E0E10" }}
        >
          <AnimatePresence mode="sync">
            <motion.div
              key={stage.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.6 }}
              className="absolute inset-0"
            >
              <Image
                src={stage.img}
                alt={stage.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 720px"
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
                "linear-gradient(to top, rgba(8,8,10,0.85) 0%, rgba(8,8,10,0.35) 35%, transparent 65%)",
            }}
          />

          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex items-end justify-between gap-4 text-white">
            <div>
              <span className="text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange tabular-nums">
                0{active + 1} / 0{VISION_STAGES.length}
              </span>
              <p className="mt-1.5 text-[24px] sm:text-[30px] font-bold tracking-[-0.03em] leading-none">
                {stage.title}
              </p>
            </div>
            {/* the time left on this stage, while it runs on its own */}
            {!manual && !reduce && (
              <span aria-hidden className="relative w-24 h-[3px] rounded-full bg-white/20 overflow-hidden shrink-0">
                <motion.span
                  key={active + (hover ? "-h" : "")}
                  className="absolute inset-y-0 left-0 bg-signal-orange"
                  initial={{ width: "0%" }}
                  animate={{ width: hover ? "0%" : "100%" }}
                  transition={{ duration: hover ? 0 : VISION_MS / 1000, ease: "linear" }}
                />
              </span>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div {...reveal()} className="mt-16 sm:mt-20 max-w-[760px] mx-auto text-center">
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
