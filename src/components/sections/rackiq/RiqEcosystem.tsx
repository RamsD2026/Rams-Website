"use client";

import { motion } from "framer-motion";
import { Boxes, LifeBuoy, LineChart, ListChecks, Radar } from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "./rackiq-shared";

/**
 * Optional connections. IRDS starts on its own.
 *
 * Same card anatomy as InvWhy — orange icon tile, then the name, then the
 * body — at five across.
 *
 * "IRDS +" is the card's eyebrow rather than part of every title. Repeating it
 * inside five 16px headlines ate the width the product names needed, and left
 * "IRDS + MEPS / RTSS" wrapping across three lines in a 228px column.
 */

const LINKS = [
  {
    Icon: Boxes,
    name: "Digital Twin",
    body: "Core rack identity, location and historical context.",
  },
  {
    Icon: ListChecks,
    name: "ATOS",
    body: "Convert rack corrective requirements into structured operational tasks.",
  },
  {
    Icon: LineChart,
    name: "AIMS",
    body: "Management and multi-site intelligence.",
  },
  {
    Icon: LifeBuoy,
    name: "RAMS Care",
    body: "Support repair coordination, procurement and closure.",
  },
  {
    Icon: Radar,
    name: "MEPS / RTSS",
    body: "Where deployed, MHE movement and safety-event context for investigating recurring damage.",
  },
];

export function RiqEcosystem() {
  return (
    <Section surface="white" id="ecosystem">
      <style>{`
        @property --riqeco-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .riqeco-card { position: relative; isolation: isolate; }
        .riqeco-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--riqeco-shine-angle),
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
        .riqeco-card:hover::before {
          opacity: 1;
          animation: riqeco-shine 2.4s linear infinite;
        }
        @keyframes riqeco-shine {
          to { --riqeco-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .riqeco-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="RAMS ecosystem"
        top="Powerful independently."
        bottom="More intelligent when connected."
        body="IRDS can begin on its own. It connects with the wider platform when the operation is ready."
        size="compact"
        width="wide"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {LINKS.map((link, i) => (
          <motion.article
            key={link.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.07, ease: EASE }}
            className="riqeco-card group relative flex flex-col p-6 bg-white transition-all duration-300 hover:-translate-y-1"
            style={{
              minHeight: 280,
              borderRadius: 12,
              border: "1px solid #E8E8ED",
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
            }}
          >
            <div
              className="w-11 h-11 flex items-center justify-center mb-7"
              style={{
                borderRadius: 8,
                background: "rgba(255,106,0,0.08)",
                border: "1px solid rgba(255,106,0,0.18)",
              }}
            >
              <link.Icon
                className="w-[20px] h-[20px] text-signal-orange"
                strokeWidth={2}
              />
            </div>

            <p className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange">
              IRDS +
            </p>

            <h3 className="mt-2 text-[19px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
              {link.name}
            </h3>

            <p className="mt-4 text-[14px] text-graphite/65 leading-[1.65]">
              {link.body}
            </p>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
