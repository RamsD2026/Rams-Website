"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SYSTEM_ITEMS = [
  "A task was created",
  "A pallet was assigned to a location",
  "Inventory was moved",
  "Maintenance was scheduled",
  "An MHE was available",
  "A transaction was completed",
];

const RAMS_CARDS = [
  {
    category: "Physical Execution",
    title: "Did the movement actually occur?",
    detail: "Whether the physical movement occurred as recorded in the system.",
    image: "/People.png",
  },
  {
    category: "Operator & Equipment",
    title: "Who performed it and with what?",
    detail: "Which operator and MHE executed the task — linked, timestamped, verified.",
    image: "/MHE.png",
  },
  {
    category: "Inventory Accuracy",
    title: "Did the pallet reach the right location?",
    detail: "Whether the pallet reached the correct bay or was misplaced against WMS records.",
    image: "/Pallets.png",
  },
  {
    category: "MHE Intelligence",
    title: "Did the MHE travel loaded or empty?",
    detail: "Actual travel behaviour — loaded vs empty runs tracked continuously.",
    image: "/MHE.png",
  },
  {
    category: "Safety",
    title: "Did an unsafe interaction occur?",
    detail: "Whether restricted zones were entered, near-misses occurred, or protocols were breached.",
    image: "/Racks.png",
  },
  {
    category: "Asset Health",
    title: "Did the asset condition change?",
    detail: "Whether equipment condition changed after use, impact, or an inspection event.",
    image: "/AI Vision.png",
  },
  {
    category: "Execution",
    title: "Was execution delayed?",
    detail: "Whether the task started and completed on time against the assigned schedule.",
    image: "/Analyze.png",
  },
  {
    category: "Task Completion",
    title: "Was the task completed correctly?",
    detail: "Physical confirmation that the task was executed as assigned — not just logged.",
    image: "/People.png",
  },
  {
    category: "Corrective Action",
    title: "Was corrective action closed?",
    detail: "Whether the follow-up action was physically completed and verified on the floor.",
    image: "/Racks.png",
  },
];

const CARD_W = 300;
const CARD_H = 420;

export function VisibilityGap() {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 640 : -640, behavior: "smooth" });
  }

  return (
    <section className="bg-white py-24">

      {/* ── Heading ── */}
      <div className="px-8 lg:px-16 mb-12 flex items-end justify-between gap-8">

        {/* Left — text */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-[#FF6A00] mb-5"
          >
            The Visibility Gap
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-[48px] md:text-[62px] font-bold text-[#0E0E0F] leading-[1.04] max-w-[680px]"
          >
            Your systems record.
            <br />
            <span className="text-[#FF6A00]">RAMS verifies.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-5 text-[15px] text-[#33363A]/50 leading-relaxed max-w-[500px]"
          >
            RAMS complements ERP, WMS and maintenance systems by creating intelligence
            around what physically happened inside the operation.
          </motion.p>
        </div>

        {/* Right — chevrons */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex items-center gap-2 shrink-0"
        >
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 flex items-center justify-center border border-[#E2E2E0] hover:border-[#FF6A00] hover:text-[#FF6A00] text-[#33363A]/50 transition-colors duration-200"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 flex items-center justify-center border border-[#E2E2E0] hover:border-[#FF6A00] hover:text-[#FF6A00] text-[#33363A]/50 transition-colors duration-200"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      {/* ── Labels row ── */}
      <div className="flex gap-3 pl-8 lg:pl-16 mb-3">
        <div className="shrink-0" style={{ width: CARD_W }}>
          <p className="text-[13px] font-bold tracking-[0.12em] uppercase text-[#33363A]/40">
            What existing systems record
          </p>
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-bold tracking-[0.12em] uppercase text-[#FF6A00]">
            RAMS helps determine
          </p>
        </div>
      </div>

      {/* ── Card row: first card fixed left + scrollable RAMS cards ── */}
      <div className="flex gap-3 pl-8 lg:pl-16">

        {/* ── First card — fixed, never scrolls ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="shrink-0 flex flex-col p-8 bg-[#FF6A00]/90 relative overflow-hidden"
          style={{ width: CARD_W, height: CARD_H }}
        >

          <div className="relative z-10 flex flex-col gap-3 flex-1">
            {SYSTEM_ITEMS.map((item, i) => (
              <div key={i} className="flex items-start gap-3 border-b border-white/20 pb-3 last:border-0">
                <span className="text-[10px] font-mono text-white/50 shrink-0 mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[13px] text-white/90 leading-snug font-medium">{item}</span>
              </div>
            ))}
          </div>
          <div className="relative z-10 pt-4">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">
              Logged. Not verified.
            </p>
          </div>
        </motion.div>

        {/* ── RAMS cards — scrollable ── */}
        <div className="flex flex-col flex-1 min-w-0">
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto overflow-y-hidden pr-8 lg:pr-16 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none" } as React.CSSProperties}
          >
          {RAMS_CARDS.map((card, i) => (
            <motion.div
              key={card.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="group relative shrink-0 overflow-hidden bg-[#0E0E0F]"
              style={{ width: CARD_W, height: CARD_H }}
            >
              {/* Background image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.image}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover opacity-30 transition-transform duration-700 ease-out scale-110 group-hover:scale-100"
              />
              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0F] via-[#0E0E0F]/55 to-[#0E0E0F]/10" />

              {/* Large number — absolute top-right */}
              <span className="absolute top-6 right-6 text-[64px] font-mono font-bold text-white/25 leading-none z-10 pointer-events-none">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col p-8">
                <p className="text-[9.5px] font-bold tracking-[0.22em] uppercase text-[#FF6A00]">
                  {card.category}
                </p>
                <div className="flex-1" />
                <div style={{ minHeight: "90px" }} className="flex flex-col justify-end mb-3">
                  <h3 className="text-[19px] font-bold text-white leading-[1.15]">
                    {card.title}
                  </h3>
                </div>
                <div style={{ minHeight: "52px" }}>
                  <p className="text-[12px] text-white/50 leading-relaxed">
                    {card.detail}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
          </div>
        </div>

      </div>

    </section>
  );
}
