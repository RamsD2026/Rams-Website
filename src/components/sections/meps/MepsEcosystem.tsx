"use client";

import { motion } from "framer-motion";
import { Boxes, ListChecks, Network, ShieldAlert, Wrench } from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * RAMS ecosystem.
 *
 * The same five-across composition RiqEcosystem uses: the product it connects
 * to as a mono eyebrow, what that connection gives you as the title.
 */

const LINE = "#E8E8ED";

const CONNECTIONS = [
  {
    Icon: ShieldAlert,
    plus: "MEPS + RTSS",
    title: "Deeper safety",
    body: "Connected safety inputs and event context on top of movement data.",
  },
  {
    Icon: Wrench,
    plus: "MEPS + IMDS",
    title: "Diagnostics",
    body: "Usage- and condition-informed maintenance from real operating history.",
  },
  {
    Icon: ListChecks,
    plus: "MEPS + ATOS",
    title: "Task orchestration",
    body: "Task allocation using live machine position, state and availability.",
  },
  {
    Icon: Boxes,
    plus: "MEPS + IROS",
    title: "Inventory context",
    body: "Inventory priorities connected to physical fleet movement.",
  },
  {
    Icon: Network,
    plus: "MEPS + AIMS",
    title: "Multi-site",
    body: "Enterprise and network-level intelligence across warehouses.",
  },
];

export function MepsEcosystem() {
  return (
    <Section surface="warm" id="ecosystem">
      <style>{`
        @property --mepseco-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .mepseco-card { position: relative; isolation: isolate; }
        .mepseco-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--mepseco-shine-angle),
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
        .mepseco-card:hover::before {
          opacity: 1;
          animation: mepseco-shine 2.4s linear infinite;
        }
        @keyframes mepseco-shine {
          to { --mepseco-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mepseco-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="RAMS ecosystem"
        top="Powerful independently."
        bottom="More intelligent when connected."
        size="compact"
        width="wide"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {CONNECTIONS.map((c, i) => (
          <motion.article
            key={c.plus}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
            className="mepseco-card flex flex-col p-6 bg-white transition-all duration-300 hover:-translate-y-1"
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

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-16 sm:mt-20 text-center font-rams-heading text-[22px] sm:text-[28px] lg:text-[32px] font-bold tracking-[-0.028em] leading-[1.22] text-carbon"
      >
        MEPS makes the MHE a connected{" "}
        <span className="text-signal-orange">operational asset</span>.
      </motion.p>
    </Section>
  );
}
