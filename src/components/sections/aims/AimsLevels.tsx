"use client";

import { motion } from "framer-motion";
import { Building2, ChevronRight, Network, Warehouse } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * One system. Every level.
 *
 * The three audiences the same record serves, in the solution-page card
 * treatment — icon tile, hairline, two-layer shadow and the conic orange shine
 * on hover, namespaced to this section.
 */

const LINE = "#E8E8ED";

const LEVELS = [
  {
    ix: "01",
    Icon: Building2,
    title: "Corporate leadership",
    body: "A concise view of enterprise risk, operational performance and improvement progress.",
    sees: "Enterprise risk, index and closure trend",
  },
  {
    ix: "02",
    Icon: Network,
    title: "Regional operations",
    body: "Benchmark facilities, identify outliers and direct support where it will matter most.",
    sees: "Site comparison, outliers and support calls",
  },
  {
    ix: "03",
    Icon: Warehouse,
    title: "Site management",
    body: "Turn daily findings into clear priorities, owners, due dates and verified closure.",
    sees: "Today's priorities, owners and due dates",
  },
];

export function AimsLevels() {
  return (
    <Section surface="white" id="levels">
      <style>{`
        @property --aimslv-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .aimslv-card { position: relative; isolation: isolate; }
        .aimslv-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--aimslv-shine-angle),
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
        .aimslv-card:hover::before {
          opacity: 1;
          animation: aimslv-shine 2.4s linear infinite;
        }
        @keyframes aimslv-shine {
          to { --aimslv-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .aimslv-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="One system. Every level."
        top="The right intelligence"
        bottom="For every decision-maker."
        body="A common source of truth keeps leadership, regional teams and site managers aligned on priorities and progress."
        size="compact"
        width="wide"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[1180px] mx-auto">
        {LEVELS.map((l, i) => (
          <motion.article
            key={l.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
            className="aimslv-card group flex flex-col p-7 sm:p-8 pb-6 bg-white transition-all duration-300 hover:-translate-y-1"
            style={{
              minHeight: 320,
              borderRadius: 12,
              border: `1px solid ${LINE}`,
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <span
                className="w-11 h-11 flex items-center justify-center shrink-0"
                style={{
                  borderRadius: 8,
                  background: "rgba(255,106,0,0.08)",
                  border: "1px solid rgba(255,106,0,0.18)",
                }}
              >
                <l.Icon
                  className="w-[20px] h-[20px] text-signal-orange"
                  strokeWidth={2}
                  aria-hidden
                />
              </span>
              <span className="text-[10px] font-mono font-bold tracking-[0.18em] text-graphite/30">
                {l.ix}
              </span>
            </div>

            <h3 className="mt-7 text-[20px] font-bold text-carbon leading-[1.2] tracking-[-0.025em]">
              {l.title}
            </h3>
            <p className="mt-3 mb-9 text-[14px] text-graphite/65 leading-[1.65]">
              {l.body}
            </p>

            <div
              className="mt-auto pt-6"
              style={{ borderTop: `1px solid ${LINE}` }}
            >
              <span className="flex items-center gap-2">
                <span className="text-[12.5px] font-semibold text-carbon">
                  What they see
                </span>
                <ChevronRight
                  className="w-3.5 h-3.5 text-signal-orange transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={2.6}
                  aria-hidden
                />
              </span>
              <p className="mt-2 text-[11.5px] font-mono text-graphite/45 leading-[1.5]">
                {l.sees}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
