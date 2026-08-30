"use client";

import { motion } from "framer-motion";
import {
  Activity,
  DraftingCompass,
  Forklift,
  LineChart,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Who uses it.
 *
 * Built on RiqRoles: centred header, one card per team, the role as an orange
 * tagline under the title. Card treatment is the one in
 * docs/section-header.md, with the shine namespaced to this section.
 */

const LINE = "#E8E8ED";

const ROLES = [
  {
    Icon: Activity,
    role: "Operations",
    title: "Throughput and flow",
    body: "Productivity, congestion, shift performance and where output is being lost.",
  },
  {
    Icon: Forklift,
    role: "Fleet",
    title: "Utilisation and balance",
    body: "Machine utilisation, fleet balance and equipment allocation across zones.",
  },
  {
    Icon: DraftingCompass,
    role: "Industrial engineering",
    title: "Routes and layout",
    body: "Flow, routes, staging and layout performance read against the Digital Twin.",
  },
  {
    Icon: ShieldCheck,
    role: "EHS",
    title: "Speed patterns",
    body: "Speed-related operating patterns by zone, machine, operator and session.",
  },
  {
    Icon: Wallet,
    role: "Procurement & finance",
    title: "Investment evidence",
    body: "Utilisation and fleet balance evidence before the next purchase or rental renewal.",
  },
  {
    Icon: LineChart,
    role: "Management",
    title: "Trends over time",
    body: "Performance and improvement trends across shifts, fleets and sites.",
  },
];

export function MepsWho() {
  return (
    <Section surface="white" id="users">
      <style>{`
        @property --mepswho-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .mepswho-card { position: relative; isolation: isolate; }
        .mepswho-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--mepswho-shine-angle),
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
        .mepswho-card:hover::before {
          opacity: 1;
          animation: mepswho-shine 2.4s linear infinite;
        }
        @keyframes mepswho-shine {
          to { --mepswho-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mepswho-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Who uses it"
        top="Different teams."
        bottom="One operational dataset."
        body="The same movement record answers a different question for each team — and none of them has to wait for another to produce it."
        size="compact"
        width="wide"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ROLES.map((r, i) => (
          <motion.article
            key={r.role}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
            className="mepswho-card flex flex-col p-7 sm:p-8 bg-white transition-all duration-300 hover:-translate-y-1"
            style={{
              minHeight: 280,
              borderRadius: 12,
              border: `1px solid ${LINE}`,
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
            }}
          >
            <div
              className="w-12 h-12 flex items-center justify-center mb-7"
              style={{
                borderRadius: 9,
                background: "rgba(255,106,0,0.08)",
                border: "1px solid rgba(255,106,0,0.18)",
              }}
            >
              <r.Icon
                className="w-[21px] h-[21px] text-signal-orange"
                strokeWidth={2}
              />
            </div>

            <h3 className="text-[21px] sm:text-[22px] font-bold text-carbon leading-[1.2] tracking-[-0.022em]">
              {r.title}
            </h3>
            <p className="mt-2 text-[14px] font-medium text-signal-orange">
              {r.role}
            </p>
            <p className="mt-4 text-[14px] text-graphite/65 leading-[1.65]">
              {r.body}
            </p>
          </motion.article>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-16 sm:mt-20 text-center font-rams-heading text-[22px] sm:text-[28px] lg:text-[32px] font-bold tracking-[-0.028em] leading-[1.22] text-carbon max-w-[30ch] mx-auto"
      >
        Operations see movement. Management sees performance. MEPS connects{" "}
        <span className="text-signal-orange">both</span>.
      </motion.p>
    </Section>
  );
}
