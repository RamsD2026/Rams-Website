"use client";

import { motion } from "framer-motion";
import { Eye, Repeat2, UserCheck, Zap } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 07 — Outcomes / business value.
 *
 * The site's four-up card, matched to `WexWhy` value for value, the same one
 * `TwinOutcomes` and `RdsOutcomes` use.
 *
 * The measure lines are the four measures the source lists under Proof —
 * event response time, action closure, repeat events and risk exposure.
 * They belong here: an outcome without the thing that measures it is an
 * adjective, and a measure with no outcome attached is a chart. The same join
 * was made on the IRDS page.
 *
 * Deliberately no figures. What each outcome is measured by is stated; the
 * value is not, because RAMS does not publish numbers it has not measured on
 * a customer's own baseline — and this product's whole pitch is that the
 * baseline is the site's own. That matters twice over here: a published
 * safety improvement figure with no baseline behind it is the kind of claim
 * that gets read back to you in an incident review.
 *
 * Hover is the shared signature, namespaced `rtsout`.
 */

const OUTCOMES = [
  {
    icon: Zap,
    k: "Faster response",
    body: "Surface critical events with the location and operational context needed to act.",
    measure: "Detection to acknowledgement, and investigation start",
  },
  {
    icon: UserCheck,
    k: "Stronger accountability",
    body: "Connect operator sessions, acknowledgements, owners, evidence and action status.",
    measure: "Open, overdue, verified and recurring safety actions",
  },
  {
    icon: Repeat2,
    k: "Less repeat risk",
    body: "Identify recurring behaviours, hotspots and unresolved contributing conditions.",
    measure: "Recurrence by operator, MHE, location, zone and shift",
  },
  {
    icon: Eye,
    k: "Direct visibility",
    body: "See live safety status across sites without depending only on reports and presentations.",
    measure: "Event rate against movement, sessions or operating hours",
  },
];

export function RtsOutcomes() {
  return (
    <Section surface="white" id="outcomes">
      <style>{`
        @property --rtsout-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .rtsout-card { position: relative; isolation: isolate; }
        .rtsout-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--rtsout-shine-angle),
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
        .rtsout-card:hover::before {
          opacity: 1;
          animation: rtsout-shine 2.4s linear infinite;
        }
        @keyframes rtsout-shine {
          to { --rtsout-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rtsout-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Outcomes / Business value"
        top="Respond faster."
        bottom="Learn earlier. Prevent more."
        size="compact"
        width="wide"
        body="RTSS reduces the distance between the physical event, the responsible response and the preventive decision."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {OUTCOMES.map((o, i) => (
          <motion.article
            key={o.k}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            className="rtsout-card group relative flex flex-col p-7 sm:p-8 bg-white transition-all duration-300 hover:-translate-y-1"
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
