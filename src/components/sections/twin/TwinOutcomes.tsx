"use client";

import { motion } from "framer-motion";
import { Eye, Gauge, ShieldCheck, TrendingUp } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 07 — Outcomes / business value.
 *
 * The site's four-up card, matched to `WexWhy` value for value: `gap-5`,
 * `p-7 sm:p-8`, 12px radius, #E8E8ED hairline, the two-part shadow, a 48px
 * tinted tile with `mb-6` holding a 22px icon at stroke 2, a 20/21px bold
 * title and a 14px body at 1.65. `RiqRoles`, `RtssOwners` and `InvWhy` are the
 * other grids with this column count — copy from one of those, not from the
 * three-up on `WexCapabilities`, which runs larger type and more padding.
 *
 * Hover is the shared signature: a 1px lift plus the conic orange shine, the
 * custom property namespaced `twinout` so it cannot collide with the problem
 * grid earlier on this page.
 *
 * An earlier version gave each column its own coloured rule. It is gone: the
 * brand rules keep orange as the only accent and reserve the RAG set for risk
 * state, and four decorative colours here would read as four severities.
 *
 * Deliberately no figures. What each outcome is measured by is stated; the
 * value is not, because RAMS does not publish numbers it has not measured on
 * a customer's own baseline.
 */

const OUTCOMES = [
  {
    icon: ShieldCheck,
    k: "Safety",
    body: "Understand and reduce physical operational risk, with every event resolved to the place it happened.",
    measure: "Impacts per 1,000 MHE hours",
  },
  {
    icon: TrendingUp,
    k: "Productivity",
    body: "Understand how people and assets produce work, and where the shift is actually being spent.",
    measure: "Travel distance per pick",
  },
  {
    icon: Gauge,
    k: "Efficiency",
    body: "Identify wasted time, movement, capacity and resources against the real building.",
    measure: "Storage and fleet utilisation",
  },
  {
    icon: Eye,
    k: "Visibility",
    body: "See what is actually happening across connected facilities, without waiting on a report.",
    measure: "Systems reconciled to the twin",
  },
];

export function TwinOutcomes() {
  return (
    <Section surface="white" id="outcomes">
      <style>{`
        @property --twinout-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .twinout-card { position: relative; isolation: isolate; }
        .twinout-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--twinout-shine-angle),
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
        .twinout-card:hover::before {
          opacity: 1;
          animation: twinout-shine 2.4s linear infinite;
        }
        @keyframes twinout-shine {
          to { --twinout-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .twinout-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Outcomes / Business value"
        top="Save time, money and effort"
        bottom="Without losing insight."
        size="compact"
        width="wide"
        body="Direct visibility reduces dependence on layered reporting and keeps decisions connected to the operational truth."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {OUTCOMES.map((o, i) => (
          <motion.article
            key={o.k}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            className="twinout-card group relative flex flex-col p-7 sm:p-8 bg-white transition-all duration-300 hover:-translate-y-1"
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

            <h3 className="text-[20px] sm:text-[21px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
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
