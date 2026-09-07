"use client";

import { motion } from "framer-motion";
import { Bandage, BarChart3, FileStack, Unplug } from "lucide-react";
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
 * Hover is the shared signature, namespaced `imdprob`.
 */

const CARDS = [
  {
    icon: Unplug,
    title: "Faults without context",
    body: "A warning code may be visible on the vehicle but disconnected from its usage, operator session, location and recent events.",
  },
  {
    icon: Bandage,
    title: "Reactive maintenance",
    body: "Intervention begins after a breakdown, missed task or safety concern has already disrupted the operation.",
  },
  {
    icon: FileStack,
    title: "Fragmented service history",
    body: "Inspections, repair invoices, parts, downtime and technician notes sit across paper, spreadsheets and vendor systems.",
  },
  {
    icon: BarChart3,
    title: "No fleet-level insight",
    body: "Managers cannot easily compare health, reliability, cost and recurring faults across equipment or sites.",
  },
];

export function ImdProblem() {
  return (
    <Section surface="white" id="problem">
      <style>{`
        @property --imdprob-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .imdprob-card { position: relative; isolation: isolate; }
        .imdprob-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--imdprob-shine-angle),
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
        .imdprob-card:hover::before {
          opacity: 1;
          animation: imdprob-shine 2.4s linear infinite;
        }
        @keyframes imdprob-shine {
          to { --imdprob-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .imdprob-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Problem / Current state"
        top="Maintenance often starts after"
        bottom="Performance has been lost."
        size="compact"
        width="wide"
        body="MHE condition data, operator complaints, service sheets, fault codes and usage records rarely create one reliable fleet-health picture."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {CARDS.map((c, i) => (
          <motion.article
            key={c.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            className="imdprob-card group relative flex flex-col p-7 sm:p-8 bg-white transition-all duration-300 hover:-translate-y-1"
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
