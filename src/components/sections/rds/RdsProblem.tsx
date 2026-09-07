"use client";

import { motion } from "framer-motion";
import { History, MapPin, TriangleAlert, Wrench } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 02 — Problem / current state.
 *
 * The site's **four-up** card, matched to `WexWhy` value for value: `gap-5`,
 * `p-7 sm:p-8`, 12px radius, #E8E8ED hairline, the two-part shadow, a 48px
 * tinted tile with `mb-6` holding a 22px icon at stroke 2, a 20/21px bold
 * title and a 14px body at 1.65. Same card as section two on the Digital Twin
 * and MEPS pages.
 *
 * The source numbered these 01–04. The numerals are gone, as they are on the
 * other two pages: four failures of the same process are not a sequence, and
 * a numeral would imply one happens before the next.
 *
 * Hover is the shared signature — a 1px lift plus the conic orange shine,
 * namespaced `rdsprob`.
 */

const CARDS = [
  {
    icon: MapPin,
    /* Broken by hand so all four titles occupy two lines and the bodies
       start level. */
    title: "Findings lose\ntheir location",
    body: "Photos and spreadsheets make it difficult to trace an issue to the exact row, rack, bay, level and component.",
  },
  {
    icon: TriangleAlert,
    title: "Risk is inconsistently prioritised",
    body: "Different teams may interpret findings differently, delaying the right operational response.",
  },
  {
    icon: Wrench,
    title: "Rectification\nstays open",
    body: "Reports list defects but rarely provide a closed loop from action assignment to repair evidence and verification.",
  },
  {
    icon: History,
    title: "History disappears between audits",
    body: "Recurring damage, replaced components and overdue actions become difficult to compare across inspection cycles.",
  },
];

export function RdsProblem() {
  return (
    <Section surface="white" id="problem">
      <style>{`
        @property --rdsprob-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .rdsprob-card { position: relative; isolation: isolate; }
        .rdsprob-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--rdsprob-shine-angle),
            transparent 0deg,
            transparent 300deg,
            rgba(255,106,0,0.9) 340deg,
            transparent 360deg
          );
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
                  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
          z-index: 1;
        }
        .rdsprob-card:hover::before {
          opacity: 1;
          animation: rdsprob-shine 2.4s linear infinite;
        }
        @keyframes rdsprob-shine {
          to { --rdsprob-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rdsprob-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Problem / Current state"
        top="Rack inspection often"
        bottom="Ends as a report."
        size="compact"
        width="wide"
        body="The real operational risk begins when findings must be located, prioritised, procured, rectified and verified."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {CARDS.map((c, i) => (
          <motion.article
            key={c.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            className="rdsprob-card group relative flex flex-col p-7 sm:p-8 bg-white transition-all duration-300 hover:-translate-y-1"
            style={{
              borderRadius: 12,
              border: "1px solid #E8E8ED",
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
            }}
          >
            <div
              className="w-12 h-12 flex items-center justify-center mb-6"
              style={{
                borderRadius: 8,
                background: "rgba(255,106,0,0.08)",
                border: "1px solid rgba(255,106,0,0.18)",
              }}
            >
              <c.icon
                className="w-[22px] h-[22px] text-signal-orange"
                strokeWidth={2}
              />
            </div>

            <h3 className="min-h-[2.4em] whitespace-pre-line text-[20px] sm:text-[21px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
              {c.title}
            </h3>

            <p className="mt-4 text-[14px] text-graphite/65 leading-[1.65]">
              {c.body}
            </p>
          </motion.article>
        ))}
      </div>

    </Section>
  );
}
