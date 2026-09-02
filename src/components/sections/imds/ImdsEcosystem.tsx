"use client";

import { motion } from "framer-motion";
import {
  Forklift,
  ListChecks,
  Network,
  Recycle,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Connected RAMS ecosystem.
 *
 * The same five-across composition the other platform pages use. MEPS is
 * marked Required rather than optional, because every trigger on this page is
 * built on the usage data it produces.
 */

const LINE = "#E8E8ED";

const CONNECTIONS: {
  Icon: LucideIcon;
  plus: string;
  title: string;
  body: string;
}[] = [
  {
    Icon: Forklift,
    plus: "+ MEPS",
    title: "Required",
    body: "Operating hours, lift cycles and operator sessions — the usage every trigger is built on.",
  },
  {
    Icon: ShieldCheck,
    plus: "+ RTSS",
    title: "Impacts",
    body: "A recorded impact can open a machine inspection, not only a rack one.",
  },
  {
    Icon: Recycle,
    plus: "+ FMS",
    title: "Lifecycle",
    body: "Repair and cost history feeding condition-based replacement instead of age-based.",
  },
  {
    Icon: ListChecks,
    plus: "+ ATOS",
    title: "Execution",
    body: "Work orders and inspections issued and tracked as scheduled work.",
  },
  {
    Icon: Network,
    plus: "+ AIMS",
    title: "Network",
    body: "Maintenance cost and reliability compared across sites and fleets.",
  },
];

export function ImdsEcosystem() {
  return (
    <Section surface="offWhite" id="ecosystem" padding="tight">
      <style>{`
        @property --imdseco-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .imdseco-card { position: relative; isolation: isolate; }
        .imdseco-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--imdseco-shine-angle),
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
        .imdseco-card:hover::before {
          opacity: 1;
          animation: imdseco-shine 2.4s linear infinite;
        }
        @keyframes imdseco-shine {
          to { --imdseco-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .imdseco-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Connected RAMS ecosystem"
        top="IMDS runs on the usage data"
        bottom="MEPS already produces."
        body="IMDS requires MEPS — the triggers depend on real operating data. Everything else deepens it."
        size="compact"
        width="wide"
        bodyWidth="wide"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-[1180px] mx-auto">
        {CONNECTIONS.map((c, i) => (
          <motion.article
            key={c.plus}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
            className="imdseco-card flex flex-col p-6 bg-white transition-all duration-300 hover:-translate-y-1"
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
              <c.Icon
                className="w-[20px] h-[20px] text-signal-orange"
                strokeWidth={2}
                aria-hidden
              />
            </div>

            <p className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
              {c.plus}
            </p>
            <h3 className="mt-2 text-[19px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
              {c.title}
            </h3>
            <p className="mt-4 text-[14px] text-graphite/65 leading-[1.65]">
              {c.body}
            </p>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
