"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 09 — FAQ.
 *
 * `TwinFAQ`, value for value: hairline rows on the section ground rather than
 * cards, question at card-title weight, answer at body, and a toggle made of
 * two spans forming a cross — the vertical one scales to zero when the row
 * opens, so plus becomes minus in one transform rather than swapping an icon.
 *
 * Four of the six answers begin by saying what MEPS is *not*, which is the
 * point of an enterprise FAQ: the tracking question, the task question, the
 * safety question and the fleet question all draw a boundary rather than
 * claiming the ground next to it.
 */

const FAQS: [string, string][] = [
  [
    "Is MEPS only a live tracking system?",
    "No. Position is the starting point. MEPS is designed to analyse utilisation, activity, travel, dwell, queues, shifts and fleet patterns in physical context.",
  ],
  [
    "Does MEPS assign warehouse tasks?",
    "MEPS focuses on MHE efficiency and productivity. Task assignment or execution can be connected through ATOS, WMS or another approved task system.",
  ],
  [
    "Can MEPS work with our existing MHE fleet?",
    "The software can support mixed fleets. The available data depends on the validated positioning, telemetry, edge and integration options selected for each equipment type.",
  ],
  [
    "How is productive time defined?",
    "Productive, travel, waiting, idle, charging and unavailable rules are configured around the customer’s operation and available task or movement data.",
  ],
  [
    "Does MEPS monitor operator safety?",
    "MEPS provides productivity context. Safety use cases are handled through RTSS and related sensors or AI, while diagnostics and maintenance belong in IMDS.",
  ],
  [
    "Can we start with a pilot?",
    "Yes. A pilot can focus on a selected facility, shift, zone or MHE group to establish a baseline and validate the improvement model before wider deployment.",
  ],
];

const HAIR = "#E0E0E6";

function Toggle({ open }: { open: boolean }) {
  return (
    <span aria-hidden className="relative w-3.5 h-3.5 shrink-0 mt-1">
      <span
        className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full"
        style={{ background: "#FF6A00" }}
      />
      <motion.span
        className="absolute top-0 bottom-0 left-1/2 w-[2px] -translate-x-1/2 rounded-full origin-center"
        style={{ background: "#FF6A00" }}
        initial={false}
        animate={{ scaleY: open ? 0 : 1 }}
        transition={{ duration: 0.3, ease: EASE }}
      />
    </span>
  );
}

export function MepsFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section surface="offWhite" id="faq">
      <SectionHeader
        eyebrow="FAQ"
        top="Questions operations"
        bottom="Teams ask."
        size="compact"
        width="wide"
      />

      <div
        className="max-w-[900px] mx-auto"
        style={{ borderTop: `1px solid ${HAIR}` }}
      >
        {FAQS.map(([q, a], i) => {
          const on = open === i;
          return (
            <div key={q} style={{ borderBottom: `1px solid ${HAIR}` }}>
              <button
                type="button"
                onClick={() => setOpen(on ? null : i)}
                aria-expanded={on}
                className="w-full flex items-start justify-between gap-6 text-left py-6 group"
              >
                <span
                  className={
                    "text-[16px] sm:text-[17px] font-bold tracking-[-0.015em] leading-[1.4] transition-colors duration-300 " +
                    (on ? "text-carbon" : "text-carbon/85 group-hover:text-carbon")
                  }
                >
                  {q}
                </span>
                <Toggle open={on} />
              </button>

              <AnimatePresence initial={false}>
                {on && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <p className="pb-7 pr-10 text-[14.5px] leading-[1.7] text-graphite/65">
                      {a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
