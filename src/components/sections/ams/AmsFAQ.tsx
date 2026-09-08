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
 * Two of the six answers carry a flat no, and on this product both are
 * load-bearing. AIMS is not a reporting dashboard, and it does not decide.
 * A management product that implies the second invites a board to treat a
 * ranked list as an instruction — so the answer names the permissions and the
 * authorised human approval that high-impact decisions stay behind.
 */

const FAQS: [string, string][] = [
  [
    "Is AIMS only a reporting dashboard?",
    "No. AIMS connects live and historical information to physical context, cross-module analysis, management priorities and accountable action. Reporting is one output of the wider intelligence workflow.",
  ],
  [
    "Can leadership see live changes at a remote site?",
    "Yes, where the Digital Twin and connected sources are configured to update them. Authorised users can open the site, review current changes and drill into available asset or field parameters without travelling.",
  ],
  [
    "What does cross-module intelligence mean?",
    "It means evaluating relationships between modules — for example, whether rack impacts coincide with MHE congestion, inventory staging and dispatch peaks — while preserving each source record.",
  ],
  [
    "Does AIMS make decisions automatically?",
    "No. AIMS supports analysis, prioritisation and configured workflows. High-impact decisions remain subject to customer permissions and authorised human approval; selected low-risk actions may be automated only when explicitly validated.",
  ],
  [
    "Can managers override an insight or priority?",
    "Yes, according to configured permissions. Overrides can retain the responsible user, reason, evidence and resulting action history.",
  ],
  [
    "Can we start with only two or three RAMS modules?",
    "Yes. AIMS can begin with the modules and management questions that provide the clearest value, then expand as more Digital Twin, sensor and enterprise-system data becomes available.",
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

export function AmsFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section surface="white" id="faq">
      <SectionHeader
        eyebrow="FAQ"
        top="Questions management"
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

      {/* The source document carries this line at the foot of its security
          section. It belongs under the answers that say AIMS does not decide. */}
      <p className="mt-10 text-center text-[11px] leading-[1.6] text-graphite/45 max-w-[860px] mx-auto">
        AIMS provides management decision support. Final operational, safety,
        maintenance and business decisions remain subject to authorised human
        judgement and applicable procedures.
      </p>
    </Section>
  );
}
