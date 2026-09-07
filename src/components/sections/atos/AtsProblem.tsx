"use client";

import { motion } from "framer-motion";
import { EyeOff, Shuffle, TimerReset, Users } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 02 — Problem / current state.
 *
 * The site's **four-up** card, matched to `WexWhy` value for value: `gap-5`,
 * `p-7 sm:p-8`, 12px radius, #E8E8ED hairline, the two-part shadow, a 48px
 * tinted tile with `mb-6` holding a 22px icon at stroke 2, a 20/21px bold
 * title and a 14px body at 1.65. The same card section two carries on the
 * Digital Twin, MEPS and IRDS pages.
 *
 * The source numbered these 01–04. The numerals are gone, as they are on the
 * other three pages: four symptoms of one problem are not a sequence.
 *
 * Hover is the shared signature — a 1px lift plus the conic orange shine,
 * namespaced `atsprob`.
 */

const CARDS = [
  {
    icon: Shuffle,
    title: "Disconnected priorities",
    body: "Orders, urgent requests, discrepancy work and local instructions compete without one visible execution queue.",
  },
  {
    icon: Users,
    title: "Manual coordination",
    body: "Supervisors spend the shift finding people and equipment, reshuffling work and explaining the latest plan.",
  },
  {
    icon: TimerReset,
    title: "Plans age quickly",
    body: "A delayed truck, blocked aisle, absent operator or unavailable MHE can make the original sequence wrong.",
  },
  {
    icon: EyeOff,
    title: "Hidden execution loss",
    body: "Waiting, empty travel, queue time and missed dependencies are difficult to see in traditional reports.",
  },
];

export function AtsProblem() {
  return (
    <Section surface="white" id="problem">
      <style>{`
        @property --atsprob-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .atsprob-card { position: relative; isolation: isolate; }
        .atsprob-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--atsprob-shine-angle),
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
        .atsprob-card:hover::before {
          opacity: 1;
          animation: atsprob-shine 2.4s linear infinite;
        }
        @keyframes atsprob-shine {
          to { --atsprob-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .atsprob-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Problem / Current state"
        top="The plan is static."
        bottom="The operation is not."
        size="compact"
        width="wide"
        body="Demand changes by the minute, but execution is still often coordinated through calls, spreadsheets, whiteboards and supervisor memory."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {CARDS.map((c, i) => (
          <motion.article
            key={c.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            className="atsprob-card group relative flex flex-col p-7 sm:p-8 bg-white transition-all duration-300 hover:-translate-y-1"
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

            {/* Two lines reserved — three of the four titles wrap. */}
            <h3 className="min-h-[2.4em] text-[20px] sm:text-[21px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
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
