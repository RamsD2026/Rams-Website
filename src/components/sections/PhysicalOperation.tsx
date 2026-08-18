"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CARDS = [
  {
    id: "racks",
    number: "01",
    title: "Racks",
    image: "/Racks.png",
    story: [
      "RAMS knows how every rack is configured and what load capacity it carries.",
      "It tracks structural condition over time, records every damage event, and holds a complete inspection history.",
      "Compliance status and repair actions are always current — so risk is visible before it becomes a problem.",
    ],
    cta: { label: "Explore Rack Intelligence", href: "/solutions/rack-intelligence" },
  },
  {
    id: "mhes",
    number: "02",
    title: "MHEs",
    image: "/MHE.png",
    story: [
      "RAMS follows every forklift and MHE across the facility — tracking location, movement, speed, and idle time in real time.",
      "Impact events are logged the moment they happen. Battery behaviour and equipment condition are monitored continuously.",
      "Maintenance needs are based on actual usage, not calendar schedules.",
    ],
    cta: { label: "Explore MHE Intelligence", href: "/solutions/mhe-intelligence" },
  },
  {
    id: "pallets",
    number: "03",
    title: "Pallets",
    image: "/Pallets.png",
    story: [
      "RAMS knows the identity and expected location of every pallet on the floor — and where it actually is.",
      "Every pickup, placement, and movement is tracked. Wrong-bay placements and WMS mismatches are caught automatically.",
      "Expiry priorities, FIFO and FEFO exceptions are surfaced without manual reconciliation.",
    ],
    cta: { label: "Explore Inventory Intelligence", href: "/solutions/inventory-intelligence" },
  },
  {
    id: "people",
    number: "04",
    title: "People",
    image: "/People.png",
    story: [
      "RAMS connects each operator to the equipment they use, the tasks they are assigned, and the actions they complete.",
      "Waiting time, productive time, safety interactions, and restricted-zone events are all recorded.",
      "This is not surveillance — it is the operational context needed to improve safety, accountability and execution.",
    ],
    cta: { label: "Explore Operational Intelligence", href: "/solutions/operational-intelligence" },
  },
] as const;

const GRID_TEMPLATES = [
  "5fr 2.33fr 2.33fr 2.33fr",
  "2.33fr 5fr 2.33fr 2.33fr",
  "2.33fr 2.33fr 5fr 2.33fr",
  "2.33fr 2.33fr 2.33fr 5fr",
];

/* ── Desktop scroll-scrub section ── */
function DesktopScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActiveIndex(Math.min(3, Math.floor(v * 4)));
  });

  return (
    <div ref={containerRef} style={{ height: "400vh" }} className="bg-white">
      <div className="sticky top-0 h-screen relative flex flex-col justify-center py-6 lg:py-8 gap-5">

        {/* ── Heading — 1280px container ── */}
        <motion.div
          className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-5% 0px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-[28px] md:text-[40px] lg:text-[48px] font-bold text-carbon leading-[1.04]">
            Racks
            <span className="mx-3 lg:mx-6 text-signal-orange font-light">|</span>
            MHEs
            <span className="mx-3 lg:mx-6 text-signal-orange font-light">|</span>
            Pallets
            <span className="mx-3 lg:mx-6 text-signal-orange font-light">|</span>
            People
          </h2>
          <p className="mt-2 lg:mt-3 text-[14px] lg:text-[15px] text-graphite/55 leading-relaxed max-w-[480px]">
            RAMS creates clarity around each operational element — and around the interactions between them.
          </p>
        </motion.div>

        {/* ── Animated grid — inside 1280px container ── */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          className="w-full border border-steel-soft overflow-hidden"
          style={{
            display: "grid",
            gridTemplateColumns: GRID_TEMPLATES[0],
            height: "460px",
          }}
          animate={{ gridTemplateColumns: GRID_TEMPLATES[activeIndex] }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          {CARDS.map((card, i) => {
            const isActive = i === activeIndex;
            return (
              <div
                key={card.id}
                className="relative overflow-hidden border-r border-steel-soft last:border-r-0"
              >
                {/* ── Active: full image + layered text ── */}
                <motion.div
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                  aria-hidden={!isActive}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                  <div className="absolute bottom-0 left-0 right-0 h-[65%] backdrop-blur-[2px]" />

                  <div className="absolute inset-0 flex flex-col p-8">
                    <span className="text-[10px] font-bold tracking-[0.22em] font-mono text-signal-orange">
                      {card.number}
                    </span>
                    <div className="flex-1" />
                    <motion.h3
                      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 8 }}
                      transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                      className="text-[26px] font-bold text-white leading-tight mb-3"
                    >
                      {card.title}
                    </motion.h3>
                    <motion.div
                      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 6 }}
                      transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className="flex flex-col gap-2 mb-5"
                    >
                      {card.story.map((para, j) => (
                        <p
                          key={j}
                          className={`leading-relaxed ${
                            j === 0
                              ? "text-[13px] font-semibold text-white/90"
                              : "text-[12px] text-white/55"
                          }`}
                        >
                          {para}
                        </p>
                      ))}
                    </motion.div>
                    <motion.div
                      animate={{ opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      className="pt-4 border-t border-white/15"
                    >
                      <Link
                        href={card.cta.href}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.15em] uppercase text-white hover:text-signal-orange transition-colors duration-200 group"
                      >
                        {card.cta.label}
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>

                {/* ── Collapsed ── */}
                <motion.div
                  animate={{ opacity: isActive ? 0 : 1 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex flex-col items-start p-6 bg-white"
                  aria-hidden={isActive}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover opacity-[0.1]"
                  />
                  <p className="text-[10px] font-bold tracking-[0.22em] font-mono text-signal-orange mb-6 relative z-10">
                    {card.number}
                  </p>
                  <p
                    className="text-[13px] font-bold text-signal-orange whitespace-nowrap relative z-10"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    {card.title}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
        </div>

        {/* ── Progress bar ── */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center gap-4">
          <div className="flex gap-3 sm:gap-6 shrink-0">
            {CARDS.map((card, i) => (
              <motion.span
                key={card.id}
                animate={{
                  color: i === activeIndex ? "#0E0E0F" : i < activeIndex ? "#FF6A00" : "#D9DBDD",
                  opacity: i === activeIndex ? 1 : 0.7,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-[10.5px] font-bold tracking-[0.18em] font-mono uppercase"
              >
                {i < activeIndex ? (
                  <span className="inline-flex items-center gap-1.5">
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 3.5L3.2 5.5L8 1" stroke="#FF6A00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {card.title}
                  </span>
                ) : (
                  <span>{card.number} {card.title}</span>
                )}
              </motion.span>
            ))}
          </div>
          <div className="flex-1 h-[2px] bg-steel-soft rounded-none overflow-hidden">
            <motion.div
              className="h-full bg-signal-orange rounded-none"
              animate={{ width: `${((activeIndex + 1) / 4) * 100}%` }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <motion.span
            key={activeIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-[10.5px] font-bold font-mono text-signal-orange shrink-0 tracking-widest"
          >
            0{activeIndex + 1} / 04
          </motion.span>
        </div>

      </div>
    </div>
  );
}

/* ── Mobile stacked cards ── */
function MobileSection() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        <h2 className="text-[28px] sm:text-[36px] font-bold text-carbon leading-tight">
          Racks · MHEs · Pallets · People
        </h2>
        <p className="mt-3 text-[14px] sm:text-[15px] text-graphite/55 leading-relaxed max-w-[480px]">
          RAMS creates clarity around each operational element — and around the interactions between them.
        </p>
      </motion.div>

      <div className="flex flex-col gap-4">
        {CARDS.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden"
            style={{ height: "320px" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={card.image}
              alt={card.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />

            <div className="absolute inset-0 flex flex-col p-6">
              <span className="text-[10px] font-bold tracking-[0.22em] font-mono text-signal-orange">
                {card.number}
              </span>
              <div className="flex-1" />
              <h3 className="text-[22px] font-bold text-white leading-tight mb-3">
                {card.title}
              </h3>
              <div className="flex flex-col gap-1.5 mb-4">
                {card.story.map((para, j) => (
                  <p
                    key={j}
                    className={`leading-relaxed ${
                      j === 0
                        ? "text-[13px] font-semibold text-white/90"
                        : "text-[12px] text-white/50"
                    }`}
                  >
                    {para}
                  </p>
                ))}
              </div>
              <div className="pt-3 border-t border-white/15">
                <Link
                  href={card.cta.href}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.15em] uppercase text-white hover:text-signal-orange transition-colors duration-200 group"
                >
                  {card.cta.label}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </div>
  );
}

export function PhysicalOperation() {
  return (
    <>
      {/* Mobile — stacked cards (hidden on md+) */}
      <div className="md:hidden">
        <MobileSection />
      </div>

      {/* Desktop — scroll-scrub (hidden below md) */}
      <div className="hidden md:block">
        <DesktopScrollSection />
      </div>
    </>
  );
}
