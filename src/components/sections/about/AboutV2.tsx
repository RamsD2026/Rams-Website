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
 *   Story    white    SectionHeader's look; the steps as a timeline left,
 *                     the statement and paragraphs open right
 *   Vision   offWhite heading + introduction, the five stages as an
 *                     expanding image strip, then the closing line
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

/* Our Story, as Our Vision's sibling: no boxes. On the left the four steps
   as a vertical timeline — numbered dots on one line, read top to bottom —
   and on the right the statement as the lead with the two paragraphs open
   beneath it. The timeline lights its steps in turn, every 3s. */
const STORY_STAGES = [
  { title: "Engineering", Icon: Ruler },
  { title: "Technology", Icon: Cpu },
  { title: "Physical Intelligence", Icon: BrainCircuit },
  { title: "Execution", Icon: CircleCheckBig },
];

const STORY_MS = 3000;

export function AboutV2Story() {
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState(false);
  const [hover, setHover] = useState(false);
  const reduce = useReducedMotion();
  const running = !reduce && !manual && !hover;

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % STORY_STAGES.length), STORY_MS);
    return () => clearTimeout(t);
  }, [running, active]);

  return (
    <Section surface="white" id="story">
      {/* SectionHeader's eyebrow, weights and colours, at a size where each
          line of the heading holds one row from lg */}
      <div className="max-w-[1180px] mx-auto text-center mb-12 sm:mb-16">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange mb-5"
        >
          Our Story
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, ease: EASE }}
          className="text-[30px] sm:text-[36px] lg:text-[42px] xl:text-[50px] leading-[1.1] font-bold tracking-[-0.04em] text-carbon"
        >
          <span className="block lg:whitespace-nowrap">We started with</span>
          <span className="block lg:whitespace-nowrap text-graphite/50">the built environment.</span>
        </motion.h2>
      </div>

      <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* the words (right on lg) */}
        <motion.div {...reveal()} className="lg:col-span-7 lg:order-2">
          <h3 className="text-[22px] sm:text-[28px] font-bold text-carbon leading-[1.25] tracking-[-0.025em]">
            We understood the physical world first.{" "}
            <span className="text-signal-orange">Then we started building intelligence around it.</span>
          </h3>
          <p className="mt-8 text-[15px] sm:text-[16px] text-graphite/70 leading-[1.7]">
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
        </motion.div>

        {/* the timeline (left on lg): it lights the steps in turn — the rail
            to the next fills while the current step waits — and loops. */}
        <ol
          className="lg:col-span-5 lg:order-1"
          aria-label="From engineering to execution"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {STORY_STAGES.map((s, i) => {
            const last = i === STORY_STAGES.length - 1;
            const on = i === active;
            const done = i < active;
            return (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.12, ease: EASE }}
                className={"relative " + (last ? "" : "pb-9")}
              >
                {!last && (
                  <span aria-hidden className="absolute left-6 top-12 bottom-0 w-[2px] -translate-x-1/2 bg-[#EDEDF0] overflow-hidden rounded-full">
                    <motion.span
                      key={`${i}-${active}-${running}`}
                      className="absolute inset-x-0 top-0 bg-signal-orange"
                      initial={{ height: done ? "100%" : "0%" }}
                      animate={{ height: done ? "100%" : on && running ? "100%" : "0%" }}
                      transition={{ duration: on && running ? STORY_MS / 1000 : 0, ease: "linear" }}
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
                  className="group relative w-full flex items-center gap-5 text-left"
                >
                  <span className="relative flex items-center justify-center w-12 h-12 shrink-0">
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
                        "relative flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-300 " +
                        (on
                          ? "bg-signal-orange text-white"
                          : done
                            ? "bg-[#FFF3E8] text-signal-orange"
                            : "bg-white text-graphite/40 group-hover:text-signal-orange")
                      }
                      style={on || done ? undefined : { boxShadow: "inset 0 0 0 1.5px #E0E0E6" }}
                    >
                      <s.Icon className="w-5 h-5" strokeWidth={2} aria-hidden />
                    </span>
                  </span>
                  <span>
                    <span className="block text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/45 tabular-nums">
                      0{i + 1}
                    </span>
                    <span
                      className={
                        "block mt-0.5 text-[19px] sm:text-[22px] font-semibold tracking-[-0.02em] transition-colors duration-300 " +
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
      </div>
    </Section>
  );
}

/* Our Vision, in the site's section order: the heading with its
   introduction (SectionHeader's look), the five stages as picture cards,
   then the closing line.

   The photographs are the site's own:
     Manual       an operator driving a counterbalance truck
     Connected    the OmniBox joining cameras, trucks and a robot
     Intelligent  the AI Vision camera boxing people, pallets and trucks
     Assisted     a supervisor's task queue, guided routes and alerts
     Autonomous   the autonomous pallet robot, cropped from the MHE image */
const VISION_STAGES: {
  title: string;
  /** three lines under the stage's name */
  body: string;
  Icon: typeof Hand;
  img: string;
  alt: string;
  pos?: string;
  zoom?: number;
}[] = [
  {
    title: "Manual",
    body: "Operators run the machines by hand. Activity, safety and usage are known only through supervision and paper records.",
    Icon: Hand,
    img: "/MHE.png",
    alt: "An operator in a high-visibility vest driving a loaded forklift down a warehouse aisle",
  },
  {
    title: "Connected",
    body: "Sensors and edge processors are added to the assets already on site, so every machine reports where it is and what it does.",
    Icon: Cable,
    img: "/OmniBox.png",
    alt: "A RAMS OmniBox on a column, with glowing links to cameras, a forklift and a pallet robot across the warehouse",
  },
  {
    title: "Intelligent",
    body: "AI turns that live data into context, recognising people, pallets and machines and flagging the risks that need attention.",
    Icon: Cpu,
    img: "/AI Vision.png",
    alt: "A RAMS AI Vision camera on a column, drawing detection boxes around workers, pallets and a forklift",
  },
  {
    title: "Assisted",
    body: "Operators and supervisors are guided in the moment by alerts and prompts, while manual control stays in their hands.",
    Icon: Handshake,
    img: "/Card 4 — Warehouse Execution.png",
    alt: "A supervisor holding a tablet task queue while a forklift works inside a highlighted zone",
  },
  {
    title: "Autonomous",
    body: "Where technically suitable, machines, AGVs and robots run on their own, on one OEM-agnostic operating platform.",
    Icon: Bot,
    img: "/Card 2 — MHE Safety and Productivity.png",
    alt: "An autonomous pallet robot carrying a load along a marked path in a warehouse aisle",
    pos: "88% 86%",
    zoom: 2.1,
  },
];

export function AboutV2Vision() {
  const [open, setOpen] = useState<number | null>(null);

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
          className="text-[30px] sm:text-[36px] lg:text-[42px] xl:text-[50px] leading-[1.1] font-bold tracking-[-0.04em] text-carbon"
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
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, delay: 0.16, ease: EASE }}
          className="mt-4 mx-auto max-w-[880px] text-[14px] sm:text-[15px] leading-[1.55] text-graphite/65"
        >
          As operations mature, mixed fleets, machines, AGVs and robots can
          progress from manual to connected, assisted and, where technically
          suitable, autonomous operation. RAMS provides one OEM-agnostic
          operating platform while retaining the flexibility for manual
          control.
        </motion.p>
      </div>

      {/* The five stages as one expanding strip: on lg the stage under the
          pointer (or tapped) opens wide with its name, the rest narrow to
          slivers showing their number. Below lg, a plain two-column grid. */}
      <div className="max-w-[1240px] mx-auto">
        <ol
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:[&>*:last-child]:col-span-2 lg:flex lg:gap-3 lg:h-[460px]"
          onMouseLeave={() => setOpen(null)}
        >
          {VISION_STAGES.map((st, i) => {
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
                <Image
                  src={st.img}
                  alt={st.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 640px"
                  className="object-cover"
                  style={{
                    objectPosition: st.pos ?? "50% 50%",
                    transform: st.zoom ? `scale(${st.zoom})` : undefined,
                    transformOrigin: st.pos ?? "50% 50%",
                  }}
                />
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
                      background: i === VISION_STAGES.length - 1 ? "#FF6A00" : "rgba(255,255,255,0.14)",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    <st.Icon className="w-4 h-4" strokeWidth={2} aria-hidden />
                  </span>
                  <span className="block text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange tabular-nums">
                    0{i + 1}
                  </span>
                  {/* the name: always below lg; on lg only on the open stage */}
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
                      "block mt-2 max-w-[360px] text-[13px] sm:text-[13.5px] leading-[1.5] text-white/70 transition-opacity duration-300 " +
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
      </div>
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
