"use client";

import { motion } from "framer-motion";
import { Check, Forklift, Route, Users, Warehouse } from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * From pattern to optimisation.
 *
 * The document's four domains, as four cards. Each keeps its own subtitle and
 * its three items, ticked with the filled disc used on the Productivity
 * panels. Card treatment is the one in docs/section-header.md — 12px, #E8E8ED,
 * the two-layer shadow, the conic shine on hover, namespaced per section.
 */

const LINE = "#E8E8ED";

const DOMAINS = [
  {
    Icon: Forklift,
    title: "Fleet",
    sub: "Size, mix, distribution",
    items: [
      "Fleet size against actual work",
      "Machine type by zone",
      "Peak requirement",
    ],
  },
  {
    Icon: Users,
    title: "People",
    sub: "Allocation & pairing",
    items: [
      "Operator allocation",
      "Operator–MHE pairing",
      "Shift distribution",
    ],
  },
  {
    Icon: Route,
    title: "Flow",
    sub: "Routes & staging",
    items: ["Route improvement", "Staging positions", "Congestion relief"],
  },
  {
    Icon: Warehouse,
    title: "Built environment",
    sub: "Layout & zones",
    items: ["Material-flow paths", "Operating zone design", "Layout evidence"],
  },
];

export function MepsOptimisation() {
  return (
    <Section surface="white" id="optimisation">
      <style>{`
        @property --mepsopt-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .mepsopt-card { position: relative; isolation: isolate; }
        .mepsopt-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--mepsopt-shine-angle),
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
        .mepsopt-card:hover::before {
          opacity: 1;
          animation: mepsopt-shine 2.4s linear infinite;
        }
        @keyframes mepsopt-shine {
          to { --mepsopt-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mepsopt-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="From pattern to optimisation"
        top="Do not just track the fleet."
        bottom="Improve the operation behind it."
        body="What should we change? Movement history answers that in four places — the fleet, the people running it, the routes between them, and the building it all happens in."
        size="compact"
        width="wide"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DOMAINS.map((d, i) => (
          <motion.article
            key={d.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
            className="mepsopt-card flex flex-col p-6 sm:p-7 bg-white transition-all duration-300 hover:-translate-y-1"
            style={{
              minHeight: 320,
              borderRadius: 12,
              border: `1px solid ${LINE}`,
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
              <d.Icon
                className="w-[20px] h-[20px] text-signal-orange"
                strokeWidth={2}
              />
            </div>

            <h3 className="text-[21px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
              {d.title}
            </h3>
            <p className="mt-2 text-[13px] font-mono tracking-[0.02em] text-graphite/45">
              {d.sub}
            </p>

            <div
              className="mt-6 pt-6 flex flex-col gap-3.5"
              style={{ borderTop: `1px solid ${LINE}` }}
            >
              {d.items.map((it) => (
                <span key={it} className="flex items-start gap-2.5">
                  <span
                    aria-hidden
                    className="w-[18px] h-[18px] rounded-full bg-signal-orange flex items-center justify-center shrink-0 mt-px"
                  >
                    <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                  </span>
                  <span className="text-[14px] font-medium text-carbon leading-[1.4] tracking-[-0.01em]">
                    {it}
                  </span>
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
