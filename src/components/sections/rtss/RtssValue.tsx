"use client";

import { motion } from "framer-motion";
import { FileSearch, ShieldCheck, Zap, type LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Business value.
 *
 * Three outcomes, in the card treatment of docs/section-header.md — the
 * hairline, the two-layer shadow, the lift and the conic orange shine on
 * hover, namespaced to this section so it cannot collide with the other
 * shines on the site.
 */

const LINE = "#E8E8ED";

const OUTCOMES: { n: string; t: string; body: string; Icon: LucideIcon }[] = [
  {
    n: "01",
    t: "Prevent repeat risk",
    body: "Understand which locations, behaviours and event types keep recurring — and design them out instead of re-reporting them.",
    Icon: ShieldCheck,
  },
  {
    n: "02",
    t: "Reduce investigation effort",
    body: "The event, the movement context and the evidence stay together, so an investigation starts from a record rather than a recollection.",
    Icon: FileSearch,
  },
  {
    n: "03",
    t: "Act earlier",
    body: "Trigger the appropriate response — train, coach, inspect, repair, or review the environment — before the pattern repeats again.",
    Icon: Zap,
  },
];

export function RtssValue() {
  return (
    <Section surface="warm" id="value" padding="tight">
      <style>{`
        @property --rtssval-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .rtssval-card { position: relative; isolation: isolate; }
        .rtssval-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--rtssval-shine-angle),
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
        .rtssval-card:hover::before {
          opacity: 1;
          animation: rtssval-shine 2.4s linear infinite;
        }
        @keyframes rtssval-shine {
          to { --rtssval-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rtssval-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Business value"
        top="Turn safety events"
        bottom="Into preventive intelligence."
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
            className="rtssval-card group flex flex-col p-7 sm:p-8 bg-white transition-transform duration-300 hover:-translate-y-1"
            style={{
              minHeight: 268,
              borderRadius: 14,
              border: `1px solid ${LINE}`,
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
            }}
          >
            <div className="flex items-center justify-between gap-4">
              {/* the tile fills in on hover, so the whole card reacts */}
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

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-16 sm:mt-20 text-center font-rams-heading text-[22px] sm:text-[28px] lg:text-[32px] font-bold tracking-[-0.028em] leading-[1.2] text-carbon max-w-[54ch] mx-auto"
      >
        {/* The break is forced at the sentence boundary — left to the measure
            it fell after "preventing the", stranding a stub line. */}
        The value is not only in detecting the event.
        <br />
        It is in preventing the{" "}
        <span className="text-signal-orange">pattern</span> from continuing.
      </motion.p>
    </Section>
  );
}
