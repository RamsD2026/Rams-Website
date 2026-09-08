"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 10 — FAQ.
 *
 * `TwinFAQ` and `MepsFAQ`, value for value: hairline rows on the section
 * ground rather than cards, question at card-title weight, answer at body, and
 * a toggle made of two spans forming a cross — the vertical one scales to zero
 * when the row opens, so plus becomes minus in one transform.
 *
 * The fourth answer is a flat "No". On a rack-safety page that is the most
 * important sentence in the section: software manages the data and the
 * workflow, and certification stays with the competent person. Softening it
 * would be a liability, not a feature.
 */

const FAQS: [string, string][] = [
  [
    "Is IRDS an inspection service or software platform?",
    "IRDS is the digital rack diagnostic suite. It can support internal inspections, RAMS inspection services and approved external inspection records within one managed workflow.",
  ],
  [
    "What does Red–Amber–Green mean?",
    "RAG categories communicate inspection priority and required response under the configured methodology. The exact rules should be aligned to the agreed standard, site procedure and competent inspection scope.",
  ],
  [
    "Can IRDS generate procurement requirements?",
    "IRDS can structure repair and replacement needs and support OEM-specific Bills of Quantities where the required component and OEM information has been configured and validated.",
  ],
  [
    "Does IRDS automatically certify a rack as safe?",
    "No. The software manages data, evidence and workflow. Engineering judgement, inspection sign-off and certificates must follow the agreed scope and competent-person requirements.",
  ],
  [
    "Can we compare internal and external audits?",
    "Yes. When both audits use a mapped rack structure and comparable inspection method, IRDS can help review findings, discrepancies and closure status together.",
  ],
  [
    "Can IRDS manage multiple warehouses?",
    "Yes. The operating model can extend across facilities, inspection cycles, rack types and responsible teams, subject to the configured deployment.",
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

export function RdsFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section surface="white" id="faq">
      <SectionHeader
        eyebrow="FAQ"
        top="Questions rack safety"
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
