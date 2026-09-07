"use client";

import { motion } from "framer-motion";
import { Clock4, MapPinOff, Siren, Split } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 02 — Problem / current state.
 *
 * The site's four-up card, matched to `WexWhy` value for value — the same one
 * section two carries on the Digital Twin, MEPS, IRDS and ATOS pages.
 *
 * The source numbered these 01–04. The numerals are gone, as on the other
 * four pages: four symptoms of one problem are not a sequence.
 *
 * Hover is the shared signature, namespaced `rtsprob`.
 */

const CARDS = [
  {
    icon: Clock4,
    title: "Delayed incident reporting",
    body: "Impacts and unsafe events may remain unknown until damage, downtime or a later inspection reveals them.",
  },
  {
    icon: MapPinOff,
    title: "Missing physical context",
    body: "A timestamp alone does not explain the MHE, operator, speed, aisle, nearby asset or operating zone.",
  },
  {
    icon: Siren,
    title: "Reactive safety action",
    body: "Teams respond to the visible incident while near misses and repeated patterns remain difficult to identify.",
  },
  {
    icon: Split,
    title: "Fragmented accountability",
    body: "Alerts, CCTV, inspection findings, maintenance work and corrective actions live in different places.",
  },
];

export function RtsProblem() {
  return (
    <Section surface="white" id="problem">
      <style>{`
        @property --rtsprob-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .rtsprob-card { position: relative; isolation: isolate; }
        .rtsprob-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--rtsprob-shine-angle),
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
        .rtsprob-card:hover::before {
          opacity: 1;
          animation: rtsprob-shine 2.4s linear infinite;
        }
        @keyframes rtsprob-shine {
          to { --rtsprob-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rtsprob-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Problem / Current state"
        top="Most safety systems explain"
        bottom="The event after it happened."
        size="compact"
        width="wide"
        body="Physical risks emerge in seconds, while conventional safety information moves through incident forms, calls, CCTV review and delayed reports."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {CARDS.map((c, i) => (
          <motion.article
            key={c.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            className="rtsprob-card group relative flex flex-col p-7 sm:p-8 bg-white transition-all duration-300 hover:-translate-y-1"
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

            {/* Two lines reserved — all four titles wrap. */}
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
