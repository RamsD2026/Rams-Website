"use client";

import { motion } from "framer-motion";
import { Boxes, Gauge, HeartPulse, ShieldAlert } from "lucide-react";
import { Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * Connected intelligence.
 *
 * The four domains AIMS reads, in the solution-page card treatment — icon
 * tile, hairline, two-layer shadow and the conic orange shine on hover,
 * namespaced to this section. Each card closes on the number that domain
 * moves, ruled off from the copy above it.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const LINE = "#E8E8ED";

const DOMAINS = [
  {
    Icon: ShieldAlert,
    title: "Safety Intelligence",
    body: "See critical rack, MHE and people-safety risks by site, severity and business impact.",
    stat: "92% risk visibility",
  },
  {
    Icon: Gauge,
    title: "Productivity Intelligence",
    body: "Compare utilisation, idle time, movement efficiency and operational bottlenecks.",
    stat: "+14% utilisation",
  },
  {
    Icon: Boxes,
    title: "Inventory Intelligence",
    body: "Identify location gaps, dwell, aging stock and capacity constraints across the network.",
    stat: "97.8% accuracy",
  },
  {
    Icon: HeartPulse,
    title: "Asset Intelligence",
    body: "Track asset health, recurring failures, maintenance status and avoidable downtime.",
    stat: "-21% downtime",
  },
];

export function AimsConnected() {
  return (
    <Section surface="white" id="capabilities">
      <style>{`
        @property --aimsconn-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .aimsconn-card { position: relative; isolation: isolate; }
        .aimsconn-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--aimsconn-shine-angle),
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
        .aimsconn-card:hover::before {
          opacity: 1;
          animation: aimsconn-shine 2.4s linear infinite;
        }
        @keyframes aimsconn-shine {
          to { --aimsconn-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .aimsconn-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Connected intelligence"
        top="See the whole operation,"
        bottom="Without losing the detail."
        body="RAMS connects each operational signal to its location, asset, owner and history — so management can move from static reporting to informed intervention."
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
            className="aimsconn-card flex flex-col p-6 bg-white transition-all duration-300 hover:-translate-y-1"
            style={{
              minHeight: 270,
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
                aria-hidden
              />
            </div>

            <h3 className="text-[19px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
              {d.title}
            </h3>
            <p className="mt-4 text-[14px] text-graphite/65 leading-[1.65]">
              {d.body}
            </p>

            <span
              className="mt-auto pt-6 flex items-center gap-2 text-[11.5px] font-mono font-medium text-signal-orange"
              style={{ letterSpacing: "0.01em" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-signal-orange shrink-0" />
              {d.stat}
            </span>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
