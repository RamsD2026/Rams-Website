"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 10 — FAQ.
 *
 * The site's FAQ, value for value: hairline rows on the section ground rather
 * than cards, question at card-title weight, answer at body, and a toggle
 * made of two spans forming a cross — the vertical one scales to zero when
 * the row opens, so plus becomes minus in one transform rather than swapping
 * an icon.
 *
 * The heading follows the site's FAQ pattern — "Questions <who> / <who>
 * ask." — as the seven other FAQ sections do. It read "Before we / Build
 * together." before, which is a closing line rather than a label for a list
 * of answers.
 *
 * ── Three of the six answers say no, and they are the point ─────────
 * Certification is not automatic, warehouse experience is not always
 * required, and territories and margins are not fixed. A partner page that
 * answers all six with an unqualified yes is a page that will be quoted back
 * at the company later — and the source document's own closing line is that
 * this page promises no exclusivity, fixed margins or guaranteed
 * opportunities. That line is kept, under the answers, because it is what the
 * last answer depends on.
 */

const FAQS: [string, string][] = [
  [
    "What types of partnership does RAMS Digital support?",
    "Potential models include technology integration, channel and referral relationships, authorised field delivery, OEM collaboration and customer-specific solution development. The final structure depends on capability, geography, responsibilities and customer value.",
  ],
  [
    "Do partners need warehouse or rack experience?",
    "Not in every case. Technology partners may bring software, sensing, AI or automation capability. Delivery and inspection roles require relevant operational competence, training and quality controls.",
  ],
  [
    "Is partner certification automatic?",
    "No. Training, assessment and status should correspond to the work a partner is authorised to perform. Requirements may vary by role and programme.",
  ],
  [
    "Can we integrate our existing product with RAMS?",
    "Potentially. RAMS can assess the use case, interface, data, security requirements and joint customer value before agreeing a technical integration.",
  ],
  [
    "Can a partnership begin with one customer or pilot?",
    "Yes. A bounded pilot or qualified opportunity can validate the technical, delivery and commercial model before a broader rollout.",
  ],
  [
    "Are territories or margins fixed?",
    "Commercial terms, account ownership and any geographic rights should be agreed for the specific partnership model.",
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

export function PartnersFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section surface="offWhite" id="faq">
      <SectionHeader
        eyebrow="FAQ"
        top="Questions prospective"
        bottom="Partners ask."
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

      {/* The source document's own closing line, and what the last answer
          depends on. */}
      <p className="mt-10 text-center text-[11px] leading-[1.6] text-graphite/45 max-w-[860px] mx-auto">
        This page does not promise exclusivity, fixed margins or guaranteed
        opportunities. Partnership scope, status and commercial terms are
        subject to agreement.
      </p>
    </Section>
  );
}
