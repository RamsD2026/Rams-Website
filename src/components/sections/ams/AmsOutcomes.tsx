"use client";

import { motion } from "framer-motion";
import { Eye, Users, Wallet, Zap } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 07 — Outcomes / business value.
 *
 * The site's four-up card, matched to `WexWhy` value for value, the same one
 * the other platform pages use in this slot.
 *
 * The measure lines are the four the source lists under Proof — decision lead
 * time, action closure, travel and reporting effort, recurrence and outcome.
 * They belong here: an outcome without the thing that measures it is an
 * adjective, and a measure with no outcome attached is a chart. Decision lead
 * time is split across the first two cards because the source itself splits
 * it — signal-to-review and review-to-action are different problems, and this
 * product claims both.
 *
 * Deliberately no figures. What each outcome is measured by is stated; the
 * value is not, because RAMS does not publish numbers it has not measured on
 * a customer's own baseline — and on this product more than any other the
 * baseline is the point. "Faster decisions" means nothing without the time
 * the reporting chain was already taking.
 *
 * Hover is the shared signature, namespaced `amsout`.
 */

const OUTCOMES = [
  {
    icon: Eye,
    k: "Direct visibility",
    body: "See live authorised site and asset conditions without depending on a reporting hierarchy.",
    measure: "Signal to management review, across sites",
  },
  {
    icon: Zap,
    k: "Faster decisions",
    body: "Connect the signal, context, impact and responsible action in one place.",
    measure: "Review to approved, owned action",
  },
  {
    icon: Wallet,
    k: "Lower oversight cost",
    body: "Reduce routine travel and manual report consolidation across the site network.",
    measure: "Site visits and manual consolidation, before and after",
  },
  {
    icon: Users,
    k: "Better alignment",
    body: "Give leadership, regional and site teams the same evidence and the same priorities.",
    measure: "Ownership, overdue work and verified completion",
  },
];

export function AmsOutcomes() {
  return (
    <Section surface="white" id="outcomes">
      <style>{`
        @property --amsout-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .amsout-card { position: relative; isolation: isolate; }
        .amsout-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--amsout-shine-angle),
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
        .amsout-card:hover::before {
          opacity: 1;
          animation: amsout-shine 2.4s linear infinite;
        }
        @keyframes amsout-shine {
          to { --amsout-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .amsout-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Outcomes / Business value"
        top="Save time, travel and effort"
        bottom="Without losing insight."
        size="compact"
        width="wide"
        body="AIMS shortens the distance between physical reality, management understanding and coordinated action."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {OUTCOMES.map((o, i) => (
          <motion.article
            key={o.k}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            className="amsout-card group relative flex flex-col p-7 sm:p-8 bg-white transition-all duration-300 hover:-translate-y-1"
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

            {/* Two lines reserved — two of the four titles wrap. */}
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
