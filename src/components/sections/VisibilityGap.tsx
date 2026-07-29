"use client";

import { motion } from "framer-motion";

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
    title: "Movement verified.",
    detail: "Whether the physical movement occurred and which operator and MHE performed it.",
    image: "/People.png",
  },
  {
    category: "Inventory Accuracy",
    title: "Location confirmed.",
    detail: "Whether the pallet reached the correct bay — or was misplaced against WMS records.",
    image: "/Pallets.png",
  },
  {
    category: "MHE Intelligence",
    title: "Fleet behaviour.",
    detail: "Whether the MHE travelled loaded or empty, and whether speed limits were respected.",
    image: "/MHE.png",
  },
  {
    category: "Safety",
    title: "Unsafe interactions.",
    detail: "Whether restricted zones were entered, near-misses occurred, or safety protocols breached.",
    image: "/Racks.png",
  },
  {
    category: "Asset Health",
    title: "Condition changes.",
    detail: "Whether equipment condition changed after use, impact, or an inspection event.",
    image: "/AI Vision.png",
  },
  {
    category: "Execution",
    title: "Task closed.",
    detail: "Whether execution was delayed, the task completed correctly, and corrective action resolved.",
    image: "/Analyze.png",
  },
];

const CARD_W = 300;
const CARD_H = 520;

export function VisibilityGap() {
  return (
    <section className="bg-white py-24">

      {/* ── Heading ── */}
      <div className="px-8 lg:px-16 mb-12">
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

      {/* ── Horizontal scroll track ── */}
      <div
        className="overflow-x-auto"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
      >
        <div
          className="flex gap-3"
          style={{ width: "max-content", paddingLeft: "inherit" }}
        >
          {/* Invisible spacer so sticky card starts at section padding */}
          <div className="shrink-0 w-8 lg:w-16 h-1" aria-hidden="true" />

          {/* ── First card — sticky ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="sticky left-8 lg:left-16 z-10 shrink-0 bg-[#0E0E0F] flex flex-col p-8"
            style={{ width: CARD_W, height: CARD_H }}
          >
            <p className="text-[9.5px] font-bold tracking-[0.22em] uppercase text-[#33363A]/50 mb-8">
              What systems record
            </p>
            <div className="flex flex-col gap-4 flex-1">
              {SYSTEM_ITEMS.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-[5px] w-1.5 h-1.5 rounded-full bg-white/15 shrink-0" />
                  <span className="text-[13px] text-white/30 leading-snug line-through decoration-white/10">
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/8 pt-5">
              <p className="text-[11px] text-white/20 leading-relaxed tracking-wide uppercase font-bold">
                Logged. Not verified.
              </p>
            </div>
          </motion.div>

          {/* ── RAMS cards ── */}
          {RAMS_CARDS.map((card, i) => (
            <motion.div
              key={card.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="relative shrink-0 overflow-hidden bg-[#0E0E0F]"
              style={{ width: CARD_W, height: CARD_H }}
            >
              {/* Background image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.image}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0F] via-[#0E0E0F]/55 to-[#0E0E0F]/10" />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col p-8">
                <p className="text-[9.5px] font-bold tracking-[0.22em] uppercase text-[#FF6A00]">
                  {card.category}
                </p>
                <div className="flex-1" />
                <h3 className="text-[24px] font-bold text-white leading-[1.1] mb-3">
                  {card.title}
                </h3>
                <p className="text-[12.5px] text-white/50 leading-relaxed">
                  {card.detail}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Right spacer */}
          <div className="shrink-0 w-8 lg:w-16 h-1" aria-hidden="true" />
        </div>
      </div>

    </section>
  );
}
