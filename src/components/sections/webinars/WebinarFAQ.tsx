"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 05 — Before you join.
 *
 * `CaseFAQ`, `VideoFAQ` and `NewsFAQ` value for value: hairline rows on the
 * section ground rather than cards, question at card-title weight, answer at
 * body, and a toggle made of two spans forming a cross — the vertical one
 * scales to zero when the row opens, so plus becomes minus in one transform
 * rather than swapping an icon.
 *
 * ── The five questions are the source's ─────────────────────────────
 * Free to attend, who should come, whether a recording follows, whether a
 * site-specific question can be answered, and whether a private session is
 * possible. Nothing was added and nothing was softened.
 *
 * The fourth is the one worth keeping intact. It says yes and then draws the
 * line — general principles in a session, but a site-specific safety,
 * structural or compliance conclusion needs the inspection and the evidence.
 * That is a real technical boundary, and a webinar page that implied
 * otherwise would be offering engineering judgement over a video call.
 *
 * The first answer keeps its hedge too: "unless a session states otherwise".
 * Turning it into a flat "yes, free" would be this page making a commitment
 * about sessions nobody has scheduled yet.
 */

const FAQS: [string, string][] = [
  [
    "Are RAMS Digital webinars free?",
    "Unless a session states otherwise, the webinars listed on this page are free to attend. Registration may be required so the joining link and session updates can be shared.",
  ],
  [
    "Who should attend?",
    "EHS leaders, warehouse managers, maintenance teams, engineers, facility teams, consultants, logistics leaders — anyone responsible for racks, MHE or physical warehouse performance.",
  ],
  [
    "Will a recording be available after the live session?",
    "Where recording rights and the session format allow, the session is added to the on-demand library above. Registered participants are told when a recording is available.",
  ],
  [
    "Can I ask a site-specific question?",
    "Yes, subject to time and confidentiality. The speaker can explain general principles, but a site-specific safety, structural or compliance conclusion requires the appropriate inspection and evidence.",
  ],
  [
    "Can RAMS run a private session for our team?",
    "Yes. We can put together a focused session for a company, site or team on an agreed warehouse safety or operations topic — tell us the audience and the question.",
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

export function WebinarFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section surface="offWhite" id="faq">
      <SectionHeader
        eyebrow="Common questions"
        top="Before"
        bottom="You join."
        size="compact"
        width="wide"
        body="The sessions are built for professionals responsible for safe and efficient physical operations."
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
