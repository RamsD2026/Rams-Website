"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ─────────────────────────────────────────
   Section 8 from RAMS Homepage Specification
   "How RAMS Creates Clarity"
   Sense → Understand → Decide → Execute → Verify → Improve
───────────────────────────────────────── */

const STAGES = [
  {
    number: "01",
    verb: "Sense",
    description: "Capture physical events",
    items: [
      "Rack inspections",
      "AI Vision",
      "OmniBox Edge Processors",
      "RTLS",
      "RFID & Sensors",
      "System integrations",
    ],
  },
  {
    number: "02",
    verb: "Understand",
    description: "Create Digital Twin context",
    items: [
      "Sites & racks",
      "MHEs & pallets",
      "People & tasks",
      "Locations & events",
    ],
  },
  {
    number: "03",
    verb: "Decide",
    description: "Determine what should happen next",
    items: [
      "AI & analytics",
      "Operational rules",
      "Risk criteria",
      "Task priorities",
    ],
  },
  {
    number: "04",
    verb: "Execute",
    description: "ATOS coordinates every action",
    items: [
      "Tasks & operators",
      "MHEs & pallets",
      "Routes & locations",
      "Priorities & sequences",
    ],
  },
  {
    number: "05",
    verb: "Verify",
    description: "Confirm the physical outcome occurred",
    items: [
      "Correct pallet",
      "Correct location",
      "Correct operator",
      "Task completion",
    ],
  },
  {
    number: "06",
    verb: "Improve",
    description: "AIMS identifies what needs attention",
    items: [
      "Trends & risks",
      "Repeated failures",
      "Efficiency gaps",
      "Investment priorities",
    ],
  },
] as const;

export function OIJourney() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section
      ref={ref}
      className="bg-[#0E0E0F] py-28 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-8">

        {/* ── Header ── */}
        <div className="mb-20">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-3 text-[11px] font-bold tracking-[0.2em] uppercase text-[#FF6A00]"
          >
            <span className="w-5 h-[2px] rounded-full bg-[#FF6A00]" />
            How RAMS Creates Clarity
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[38px] md:text-[52px] font-bold text-white leading-[1.06] max-w-[700px]"
          >
            From movement to verified
            <br />
            <span className="text-[#FF6A00]">operational intelligence.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-[15px] text-white/40 leading-relaxed font-normal max-w-[480px]"
          >
            RAMS connects physical events to intelligent outcomes through a
            continuous six-stage operational cycle.
          </motion.p>
        </div>

        {/* ── Six-stage grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-white/8 rounded-2xl overflow-hidden border border-white/8">
          {STAGES.map((stage, i) => (
            <motion.div
              key={stage.verb}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.15 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="group relative bg-[#0E0E0F] hover:bg-[#161616] transition-colors duration-300 p-7 flex flex-col gap-6"
            >
              {/* Orange top accent on hover */}
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-[#FF6A00] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />

              {/* Number */}
              <span className="text-[11px] font-bold tracking-[0.15em] text-white/20 group-hover:text-[#FF6A00]/70 transition-colors duration-300">
                {stage.number}
              </span>

              {/* Verb */}
              <div>
                <h3 className="text-[22px] font-bold text-white leading-tight group-hover:text-[#FF6A00] transition-colors duration-300">
                  {stage.verb}
                </h3>
                <p className="mt-2 text-[12px] text-white/35 font-normal leading-snug">
                  {stage.description}
                </p>
              </div>

              {/* Items */}
              <ul className="flex flex-col gap-2 mt-auto">
                {stage.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[12.5px] text-white/45 font-normal leading-snug">
                    <span className="mt-[5px] w-1 h-1 rounded-full bg-[#FF6A00]/50 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* ── Closing line ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="mt-14 flex items-center justify-between gap-8"
        >
          <p className="text-[13px] text-white/25 font-normal max-w-[500px] leading-relaxed">
            RAMS does not stop at visibility. It converts operational intelligence
            into action and verifies the result — across every rack, MHE, pallet, and person.
          </p>
          <p className="text-[18px] font-bold text-white/15 whitespace-nowrap italic">
            This Is Clarity in Motion.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
