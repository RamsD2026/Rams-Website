"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 04 — Case study FAQ.
 *
 * The site's FAQ, value for value: hairline rows on the section ground rather
 * than cards, question at card-title weight, answer at body, and a toggle
 * made of two spans forming a cross — the vertical one scales to zero when
 * the row opens, so plus becomes minus in one transform rather than swapping
 * an icon.
 *
 * White, not offWhite: the References section that used to sit between this
 * and section 03 is gone, and 03 is offWhite — the two would have met with
 * nothing between them.
 *
 * The eyebrow is the full form rather than the initialism, and the heading is
 * a phrase rather than two words: "Straight / Answers." at 36/54/68 set two
 * short words at hero scale, which reads as a slogan rather than as the label
 * for a list of answers. Every other FAQ on this site names who is asking or
 * what about.
 *
 * ── The first answer is the one that matters ────────────────────────
 * "Are these real deployments?" is the question six unnamed case studies
 * raise, and it is first and open by default for that reason. The answer says
 * yes and immediately says what is withheld and why — names, locations and
 * figures — rather than claiming more than the page can show. A case-studies
 * page that hedges on this one question has no case studies.
 *
 * ── The figures repeat the hero's ───────────────────────────────────
 * 200+ sites and eight investigations appear here and in the hero. They are
 * the same two claims from the same source document, and a reader who lands
 * on this section from a search result should not have to scroll up to find
 * them. If either number changes it changes in both places — there is no
 * shared constant for them, which is worth knowing before editing one.
 */

const FAQS: [string, string][] = [
  [
    "Are these real deployments?",
    "Yes. They are representative of real work across 200+ live sites. Specific client names, locations and figures are withheld here for confidentiality.",
  ],
  [
    "Can I see named references or full case studies?",
    "Yes — named references, site data and detailed write-ups are shared under NDA. Get in touch and tell us your sector and use case.",
  ],
  [
    "Do you investigate rack collapses?",
    "We do. We have carried out eight post-collapse forensic investigations, reconstructing failures and documenting root cause and corrective action.",
  ],
  [
    "What outcomes do you measure?",
    "Safety, compliance, continuity, cost avoidance, visibility and closure — the categories above. The metrics that matter to your site are agreed up front.",
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

export function CaseFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section surface="white" id="faq">
      <SectionHeader
        eyebrow="Frequently asked questions"
        top="Questions about"
        bottom="This work."
        size="compact"
        width="wide"
        className="!mb-10 sm:!mb-12"
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
