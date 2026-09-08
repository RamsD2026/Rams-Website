"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 10 — FAQ.
 *
 * `TwinFAQ`, value for value: hairline rows on the section ground rather than
 * cards, question at card-title weight, answer at body, and a toggle made of
 * two spans forming a cross — the vertical one scales to zero when the row
 * opens, so plus becomes minus in one transform rather than swapping an icon.
 *
 * The third answer is the most important sentence on this page: no
 * technology can guarantee that no accident happens. A safety product
 * that implies otherwise invites a site to lean on it instead of on risk
 * assessment, engineered controls, training and supervision — so the
 * answer names all four rather than softening the no.
 */

const FAQS: [string, string][] = [
  [
    "What can RTSS monitor?",
    "Depending on the configured hardware and integrations, RTSS can support impact, speed, zone, proximity, operator-session, movement and equipment-status events. The exact use cases are validated during deployment.",
  ],
  [
    "Does RTSS work only with RAMS hardware?",
    "No. RTSS can use RAMS hardware, compatible customer hardware or both, subject to interface validation, signal quality, event definitions and the agreed scope.",
  ],
  [
    "Can RTSS prevent every accident?",
    "No technology can guarantee that. RTSS improves visibility, response and learning around configured risks, but it must operate alongside risk assessment, engineered controls, training, supervision and safe operating procedures.",
  ],
  [
    "How are operators identified?",
    "Supported operator-authentication or access systems can associate an authorised identity with an MHE session. The selected method and personal-data controls are defined during implementation.",
  ],
  [
    "Can an impact create an inspection or maintenance action?",
    "Yes, where configured. An impact can notify authorised teams and initiate a defined inspection, isolation, maintenance or investigation workflow through RTSS and connected RAMS modules or enterprise systems.",
  ],
  [
    "Can we start with one risk zone?",
    "Yes. A focused deployment around a crossing, dock, rack-impact hotspot or specific MHE group is often the clearest way to validate detection, workflow and measurable value before scaling.",
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

export function RtsFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section surface="white" id="faq">
      <SectionHeader
        eyebrow="FAQ"
        top="Questions safety"
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
                    (on
                      ? "text-carbon"
                      : "text-carbon/85 group-hover:text-carbon")
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
