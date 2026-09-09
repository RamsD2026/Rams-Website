"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EMAIL } from "@/components/sections/contact/contact-data";

/**
 * 04 — Media FAQ.
 *
 * `CaseFAQ` and `VideoFAQ` value for value: hairline rows on the section
 * ground rather than cards, question at card-title weight, answer at body,
 * and a toggle made of two spans forming a cross — the vertical one scales to
 * zero when the row opens, so plus becomes minus in one transform rather than
 * swapping an icon.
 *
 * ── The first answer is the one the page raises ─────────────────────
 * A page headed "Newsroom" carrying six articles invites a reader to take
 * them for company announcements. They are not — they are published RAMS
 * Digital writing — and the distinction is the first question for that
 * reason, open by default. It is the only place on the page that draws the
 * line now that the announcement-areas section has been removed, which is
 * worth knowing before shortening it.
 *
 * ── Nothing here invents a policy ───────────────────────────────────
 * No embargo terms, no approval turnaround, no exclusivity. Those are things
 * a company decides and writes down, and a website that answers them on the
 * company's behalf has made commitments nobody agreed to. Every answer here
 * either states a fact the site already carries or points at the team.
 *
 * The second answer names the address and the form, and does *not* tell a
 * journalist to pick a "Media & press" enquiry type — `ENQUIRIES` has six
 * and none of them is that. Sending somebody to a control that is not there
 * is the small version of the same failure as an invented press release.
 *
 * `EMAIL` comes from `contact-data` rather than being typed again — the
 * address appears in the footer, the contact page and here, and one of those
 * three drifting is how a newsroom ends up publishing a dead mailbox.
 */

const FAQS: [string, string][] = [
  [
    "Are these company announcements?",
    "No — the stories above are published RAMS Digital writing: perspectives, guides, briefings and analysis on rack safety, standards and warehouse operations. Company announcements are a separate thing, and none has been made yet. When one is, it will be published here.",
  ],
  [
    "How do I reach someone for a story?",
    `Email ${EMAIL}, or use the contact form. Tell us your outlet, your deadline and what you are working on, and we will get you to the right person rather than to a mailbox.`,
  ],
  [
    "Can I use the RAMS logo in an article?",
    "Yes. Ask us for the vector files and we will send them. Use them as supplied — anything else, including recolouring or locking them up with another mark, ask first.",
  ],
  [
    "Can you put me in touch with a customer?",
    "Sometimes, and never unilaterally. Named references are shared under NDA and only with that customer's agreement — the same position the case studies take. Ask, and we will find out.",
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

export function NewsFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section surface="offWhite" id="faq">
      <SectionHeader
        eyebrow="Frequently asked questions"
        top="Questions from"
        bottom="The press."
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
