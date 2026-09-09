"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 04 — Video FAQ.
 *
 * `CaseFAQ` value for value: hairline rows on the section ground rather than
 * cards, question at card-title weight, answer at body, and a toggle made of
 * two spans forming a cross — the vertical one scales to zero when the row
 * opens, so plus becomes minus in one transform rather than swapping an icon.
 *
 * ── The first answer is the one that matters ────────────────────────
 * "Is this real footage?" is the question a page of five polished clips
 * raises, and it is first and open by default for that reason. The answer
 * separates the two things on this page without being asked to: the IRDS
 * clips are screen recordings of the live product, and the hardware clips are
 * renders. Letting a visitor assume the OmniBox film is camera footage would
 * be the page's one available lie.
 *
 * White, not offWhite: 03 above is offWhite and the two would meet with
 * nothing between them.
 *
 * ── Nothing here is a figure ────────────────────────────────────────
 * `CaseFAQ` repeats two numbers from its hero and says so, because there is
 * no shared constant for them. This page has none to repeat, and none was
 * invented to fill the gap.
 */

const FAQS: [string, string][] = [
  [
    "Is this real product footage?",
    "The platform clips are screen recordings of the live IRDS product — real screens, real interactions. The hardware clips are product renders of the OmniBox, the AI Vision Camera and the AI Sensor rather than camera footage, so you are seeing the units as designed.",
  ],
  [
    "Why is no customer site in any of them?",
    "The same reason no case study names a client. Site walkthroughs, floor footage and anything recorded on a customer's premises are shared under NDA, not published here.",
  ],
  [
    "Can I get these films for an internal deck?",
    "Yes. Tell us which ones and what you need them for, and we will send the files across — no watermark, no sign-up.",
  ],
  [
    "Can we see the platform on our own data instead?",
    "That is the live demo. We walk the modules against a site like yours and answer questions as they come up, which a recording cannot do.",
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

export function VideoFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section surface="white" id="faq">
      <SectionHeader
        eyebrow="Frequently asked questions"
        top="Questions about"
        bottom="These films."
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
