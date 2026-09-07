"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Eye, Package, Zap } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 07 — Outcomes / business value.
 *
 * The site's four-up card, matched to `WexWhy` value for value: `gap-5`,
 * `p-7 sm:p-8`, 12px radius, #E8E8ED hairline, the two-part shadow, a 48px
 * tinted tile with `mb-6` holding a 22px icon at stroke 2, a 20/21px bold
 * title and a 14px body at 1.65. Same card as `TwinOutcomes`.
 *
 * The measure lines are the four measures the source document lists under
 * Proof — inspection coverage, risk distribution, closure performance and
 * recurrence. They belong here: an outcome without the thing that measures it
 * is an adjective, and a measure with no outcome attached is a chart. Merging
 * them means neither section has to carry half an argument.
 *
 * Deliberately no figures. What each outcome is measured by is stated; the
 * value is not, because RAMS does not publish numbers it has not measured on
 * a customer's own baseline.
 *
 * Hover is the shared signature, namespaced `rdsout`.
 */

const OUTCOMES = [
  {
    icon: Zap,
    k: "Faster risk response",
    body: "Prioritise high-risk findings with location, evidence and clear action context.",
    measure: "Risk distribution by location and component",
  },
  {
    icon: CheckCircle2,
    k: "Stronger closure",
    body: "Keep responsible teams, due dates, repair evidence and verification connected.",
    measure: "Action ageing, overdue work, verified completion",
  },
  {
    icon: Package,
    k: "Better procurement",
    body: "Translate identified issues into structured repair and replacement requirements.",
    measure: "Components required, cycle by cycle",
  },
  {
    icon: Eye,
    k: "Direct visibility",
    body: "See rack health across sites without depending only on reports and presentations.",
    measure: "Inspection coverage, planned against completed",
  },
];

export function RdsOutcomes() {
  return (
    <Section surface="white" id="outcomes">
      <style>{`
        @property --rdsout-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .rdsout-card { position: relative; isolation: isolate; }
        .rdsout-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--rdsout-shine-angle),
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
        .rdsout-card:hover::before {
          opacity: 1;
          animation: rdsout-shine 2.4s linear infinite;
        }
        @keyframes rdsout-shine {
          to { --rdsout-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rdsout-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Outcomes / Business value"
        top="Make rack safety visible,"
        bottom="Measurable and actionable."
        size="compact"
        width="wide"
        body="IRDS reduces the distance between identifying risk and proving that the right action was completed."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {OUTCOMES.map((o, i) => (
          <motion.article
            key={o.k}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            className="rdsout-card group relative flex flex-col p-7 sm:p-8 bg-white transition-all duration-300 hover:-translate-y-1"
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
              <o.icon
                className="w-[22px] h-[22px] text-signal-orange"
                strokeWidth={2}
              />
            </div>

            {/* Two lines reserved — three of the four titles wrap. */}
            <h3 className="min-h-[2.4em] text-[20px] sm:text-[21px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
              {o.k}
            </h3>

            <p className="mt-4 mb-7 text-[14px] text-graphite/65 leading-[1.65]">
              {o.body}
            </p>

            <span className="mt-auto flex items-start gap-2.5 text-[11px] font-mono leading-[1.5] text-graphite/45">
              <span
                aria-hidden
                className="mt-[6px] w-2.5 h-px shrink-0"
                style={{ background: "#FF6A00" }}
              />
              {o.measure}
            </span>
          </motion.article>
        ))}
      </div>

    </Section>
  );
}
