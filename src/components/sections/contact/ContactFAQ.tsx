"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 03 — Contact FAQ.
 *
 * The site's FAQ, value for value: hairline rows on the section ground rather
 * than boxed cards, question at card-title weight, answer at body, and a
 * toggle made of two spans forming a cross — the vertical one scales to zero
 * when the row opens, so plus becomes minus in one transform rather than
 * swapping an icon.
 *
 * offWhite: the address block moved up into the hero, so section 02 above
 * this one is white and two white bands would meet with nothing between them.
 *
 * ── Rows, not cards ─────────────────────────────────────────────────
 * The reference draws each question in its own bordered box. Eight other FAQ
 * sections on this site are hairline rows, and a ninth in a different shape
 * would read as a different site. The rows also stack tighter, which matters
 * on a page whose job is the form above them.
 *
 * ── The answers name the form's own options ─────────────────────────
 * "Platform demo" and "Customer support" are the labels in `ENQUIRIES`, not
 * paraphrases of them. An answer that tells a reader to choose "Book a demo"
 * when the select says "Platform demo" sends them looking for something that
 * is not there.
 *
 * ── One answer makes a commitment ───────────────────────────────────
 * "Within one business day" is a response-time promise, and it is the only
 * number on this page. It came from the brief rather than from anything
 * written down in this repository, so it is worth knowing that it is a
 * commitment the company has to keep rather than an observation about how
 * things usually go.
 *
 * ── Answers carry markup ────────────────────────────────────────────
 * The careers answer links to `/company/careers`, so the answer type is a
 * `ReactNode` rather than a string. Every other FAQ on this site is
 * `[string, string][]` because none of them needed a link; this one does, and
 * a link written as raw HTML in a string would be the wrong way to get it.
 */

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "How quickly will I hear back?",
    a: "We aim to reply to enquiries within one business day. Demonstration and audit requests are routed straight to the relevant team.",
  },
  {
    q: "Can I book a demonstration directly?",
    a: "Yes — choose “Platform demo” in the form and tell us about your site, assets and the problem you want to see addressed. We will set up a walkthrough of the Digital Twin around it.",
  },
  {
    q: "I am an existing customer needing support.",
    a: "Choose “Customer support” in the form and include the site, the affected module, roughly when it started and the operational impact. It is triaged by the team that owns that module.",
  },
  {
    q: "Where are you based?",
    a: "The office is in Baner, Pune, and we work with sites across the country. Published partner contacts cover the United States, Australia and Ireland.",
  },
  {
    q: "Are you hiring?",
    a: (
      <>
        Roles are being written as the work defines them — see the{" "}
        <Link
          href="/company/careers"
          className="font-semibold text-signal-orange hover:text-signal-orange-hover transition-colors duration-200"
        >
          Careers
        </Link>{" "}
        page, or send an open application through the form.
      </>
    ),
  },
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

export function ContactFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section surface="offWhite" id="faq">
      <SectionHeader
        eyebrow="Contact FAQ"
        top="Quick answers"
        bottom="Before you write."
        size="compact"
        width="wide"
        className="!mb-10 sm:!mb-12"
      />

      <div
        className="max-w-[900px] mx-auto"
        style={{ borderTop: `1px solid ${HAIR}` }}
      >
        {FAQS.map((item, i) => {
          const on = open === i;
          return (
            <div key={item.q} style={{ borderBottom: `1px solid ${HAIR}` }}>
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
                  {item.q}
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
                      {item.a}
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
