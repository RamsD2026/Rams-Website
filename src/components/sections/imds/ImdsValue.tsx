"use client";

import { motion } from "framer-motion";
import {
  CircleDollarSign,
  ClipboardCheck,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Business value.
 *
 * The three outcomes in the site's card treatment — hairline, two-layer
 * shadow, lift and the conic orange shine on hover, namespaced to this
 * section.
 */

const LINE = "#E8E8ED";

const OUTCOMES: { n: string; t: string; body: string; Icon: LucideIcon }[] = [
  {
    n: "01",
    t: "Less unplanned downtime",
    body: "Catch the machine before it stops, rather than after. Indicative range: 30–50% reduction in unplanned downtime, based on the shift from calendar to usage-based maintenance.",
    Icon: TrendingDown,
  },
  {
    n: "02",
    t: "Verified pre-shift compliance",
    body: "From inconsistent to verified every shift, with a legally defensible record — based on a mandatory digital checklist with machine restriction.",
    Icon: ClipboardCheck,
  },
  {
    n: "03",
    t: "Cost per operating hour",
    body: "Parts, labour and repeat faults recorded against the machine, so replace-or-repair becomes an argument with evidence behind it.",
    Icon: CircleDollarSign,
  },
];

export function ImdsValue() {
  return (
    <Section surface="white" id="value" padding="tight">
      <style>{`
        @property --imdsval-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .imdsval-card { position: relative; isolation: isolate; }
        .imdsval-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--imdsval-shine-angle),
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
        .imdsval-card:hover::before {
          opacity: 1;
          animation: imdsval-shine 2.4s linear infinite;
        }
        @keyframes imdsval-shine {
          to { --imdsval-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .imdsval-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Business value"
        top="Reactive maintenance costs"
        bottom="Two to three times preventive."
        size="compact"
        width="wide"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-[1180px] mx-auto">
        {OUTCOMES.map((o, i) => (
          <motion.article
            key={o.n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: i * 0.08, ease: EASE }}
            className="imdsval-card group flex flex-col p-7 sm:p-8 bg-white transition-transform duration-300 hover:-translate-y-1"
            style={{
              minHeight: 268,
              borderRadius: 14,
              border: `1px solid ${LINE}`,
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <span className="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0 border transition-colors duration-300 bg-[rgba(255,106,0,0.07)] border-[rgba(255,106,0,0.18)] group-hover:bg-signal-orange group-hover:border-signal-orange">
                <o.Icon
                  className="w-[19px] h-[19px] text-signal-orange transition-colors duration-300 group-hover:text-white"
                  strokeWidth={1.8}
                  aria-hidden
                />
              </span>
              <span className="text-[11px] font-mono font-bold tracking-[0.16em] text-graphite/30 group-hover:text-signal-orange transition-colors duration-300">
                {o.n}
              </span>
            </div>

            <h3 className="mt-7 text-[20px] sm:text-[21px] font-bold text-carbon leading-[1.2] tracking-[-0.022em]">
              {o.t}
            </h3>
            <p className="mt-3.5 text-[14px] text-graphite/65 leading-[1.65]">
              {o.body}
            </p>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
