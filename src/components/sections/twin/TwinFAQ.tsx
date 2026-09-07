"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 10 — FAQ.
 *
 * The first accordion on this site, so it is built to the system rather than
 * copied: hairline rows on the section ground, no cards, question at card-title
 * weight, answer at body. The toggle is two spans forming a cross — the
 * vertical one scales to zero when the row opens, so plus becomes minus in one
 * transform rather than swapping an icon.
 *
 * Answers are written to be checkable. Three of the eight say "no" or "not by
 * default", which is the point of an enterprise FAQ — the simulation answer in
 * particular refuses to claim engineering approval, because claiming it would
 * be a liability, not a feature.
 */

const FAQS: [string, string][] = [
  [
    "Is this only a 3D or BIM visualisation tool?",
    "No. The model is the starting point. RAMS Digital Twin adds asset identity, lifecycle history, simulation, live data, operational context, AI and applications on top of it.",
  ],
  [
    "Do we need CAD drawings to begin?",
    "Not necessarily. A facility can be created directly inside the platform or reconstructed from suitable scan information, depending on the project.",
  ],
  [
    "Must we use RAMS hardware?",
    "No. The platform is intended to support RAMS devices, compatible customer hardware or a combination of both, subject to integration review.",
  ],
  [
    "Does it replace our WMS or ERP?",
    "No. Those systems keep their job. The twin gives their records a location, so a transaction can be read against the place and the asset it belongs to.",
  ],
  [
    "Can it work beyond warehouses?",
    "Yes. The platform concept applies to factories, distribution centres, industrial plants, utilities, infrastructure and other large built environments.",
  ],
  [
    "Does simulation provide engineering approval?",
    "Not by default. Simulation supports planning and feasibility. Engineering approval should only be claimed for a specific validated check with professional review.",
  ],
  [
    "Can we build a custom application on it?",
    "Yes. Every RAMS module reads the twin through the same interfaces yours would, so anything we do not ship can be built on the same foundation.",
  ],
  [
    "Can we start with one use case?",
    "Yes. Customers can begin with digitisation, asset tagging, simulation or a priority application, then connect more sites, systems and workflows over time.",
  ],
];

const HAIR = "#E0E0E6";

function Toggle({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className="relative w-3.5 h-3.5 shrink-0 mt-1"
    >
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

export function TwinFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section surface="offWhite" id="faq">
      <SectionHeader
        eyebrow="FAQ"
        top="Questions enterprise"
        bottom="Teams ask."
        size="compact"
        width="wide"
      />

      <div className="max-w-[900px] mx-auto" style={{ borderTop: `1px solid ${HAIR}` }}>
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
