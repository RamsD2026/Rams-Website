"use client";

import { motion } from "framer-motion";
import { Merge, Route, Scale, Timer } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 02 — Problem / current state.
 *
 * Built on the structure already settled for section two on the Digital Twin
 * page (`TwinProblem`), value for value: centred `SectionHeader` at `compact`
 * over the site's **four-up** card — `gap-5`, `p-7 sm:p-8`, 12px radius,
 * #E8E8ED hairline, the two-part shadow, a 48px tinted tile with `mb-6`
 * holding a 22px icon at stroke 2, a 20/21px bold title and a 14px body at
 * 1.65 — plus the shared 1px lift and conic orange shine on hover, namespaced
 * `mepsprob`.
 *
 * The reference numbered the cards Loss 01–04 and ran them on a dark ground.
 * Both are gone for the same reasons they went on the Digital Twin: the four
 * losses are not a sequence, so numerals imply an order that does not exist,
 * and section two sits on white because section one is the dark hero.
 */

const CARDS = [
  {
    icon: Route,
    title: "Empty travel",
    body: "Distance covered without moving material — returns, repositioning and approaches that never touch a pallet.",
  },
  {
    icon: Timer,
    title: "Idle & waiting",
    body: "Time where the machine, the operator or the material simply isn't progressing.",
  },
  {
    icon: Merge,
    title: "Congestion",
    body: "Movement constrained by the building itself — aisles, intersections and dock faces.",
  },
  {
    icon: Scale,
    title: "Fleet imbalance",
    body: "Some machines carry a disproportionate share of the shift while others stand still.",
  },
];

export function MepsProblem() {
  return (
    <Section surface="white" id="problem">
      <style>{`
        @property --mepsprob-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .mepsprob-card { position: relative; isolation: isolate; }
        .mepsprob-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--mepsprob-shine-angle),
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
        .mepsprob-card:hover::before {
          opacity: 1;
          animation: mepsprob-shine 2.4s linear infinite;
        }
        @keyframes mepsprob-shine {
          to { --mepsprob-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mepsprob-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="The current state"
        top="A moving MHE is not"
        bottom="Always a productive MHE."
        size="compact"
        width="wide"
        body="Most operations can see that a forklift is busy. Very few can see whether that movement actually moved material. So fleets get bigger, shifts run longer, and the real losses stay invisible — hidden inside travel that looks like work."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {CARDS.map((c, i) => (
          <motion.article
            key={c.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            className="mepsprob-card group relative flex flex-col p-7 sm:p-8 bg-white transition-all duration-300 hover:-translate-y-1"
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

            {/* No reserved second line here. All four titles are short enough
                to sit on one, so the bodies already start level — the Digital
                Twin needed `min-h` only because three of its four wrapped. */}
            <h3 className="text-[20px] sm:text-[21px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
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
