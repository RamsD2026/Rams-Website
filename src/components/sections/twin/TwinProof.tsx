"use client";

import { motion } from "framer-motion";
import { Boxes, Forklift, Package, Users, type LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Proof.
 *
 * Four physical elements on the shared foundation, in the site's card
 * treatment — icon tile that fills on hover, and the conic orange shine
 * running the border, namespaced to this section so it cannot collide with
 * the other shines on the site.
 *
 * The four outcomes close it as chips, because that is what they are: the
 * things a plant head reports on, not another four cards.
 */

const LINE = "#E8E8ED";

const ELEMENTS: { Icon: LucideIcon; code: string; t: string; body: string }[] =
  [
    {
      Icon: Boxes,
      code: "Racks",
      t: "Condition & safety",
      body: "Structured digital inspection, classification and repair closure — anchored to the bay, not to a PDF.",
    },
    {
      Icon: Forklift,
      code: "MHEs",
      t: "Movement, productivity, safety",
      body: "Utilisation, routes, operator accountability, impacts and interventions.",
    },
    {
      Icon: Package,
      code: "Pallets",
      t: "Movement & inventory context",
      body: "Where stock physically is, against where the system believes it is.",
    },
    {
      Icon: Users,
      code: "People",
      t: "Safety & interaction",
      body: "Zones, proximity, authenticated operation, and the interactions between people and machines.",
    },
  ];

const OUTCOMES = ["Safety", "Productivity", "Efficiency", "Visibility"];

export function TwinProof() {
  return (
    <Section surface="offWhite" id="rams">
      <style>{`
        @property --twinproof-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .twinproof-card { position: relative; isolation: isolate; }
        .twinproof-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--twinproof-shine-angle),
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
        .twinproof-card:hover::before {
          opacity: 1;
          animation: twinproof-shine 2.4s linear infinite;
        }
        @keyframes twinproof-shine {
          to { --twinproof-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .twinproof-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Proof"
        top="RAMS 2.0 is one"
        bottom="Implementation of this."
        body="The architecture is not theoretical. We already run it. In RAMS 2.0 the Digital Twin is the shared physical foundation underneath four physical elements — and the outputs converge on four things a plant head actually reports on."
        size="compact"
        width="wide"
        bodyWidth="wide"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1180px] mx-auto">
        {ELEMENTS.map((e, i) => (
          <motion.article
            key={e.code}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
            className="twinproof-card group overflow-hidden flex flex-col p-6 bg-white transition-transform duration-300 hover:-translate-y-1"
            style={{
              minHeight: 254,
              borderRadius: 14,
              border: `1px solid ${LINE}`,
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <span className="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0 border transition-colors duration-300 bg-[rgba(255,106,0,0.07)] border-[rgba(255,106,0,0.18)] group-hover:bg-signal-orange group-hover:border-signal-orange">
                <e.Icon
                  className="w-[19px] h-[19px] text-signal-orange transition-colors duration-300 group-hover:text-white"
                  strokeWidth={1.8}
                  aria-hidden
                />
              </span>
              <span className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-graphite/30 group-hover:text-signal-orange transition-colors duration-300">
                {e.code}
              </span>
            </div>

            <h3 className="mt-7 font-rams-heading text-[18px] font-bold tracking-[-0.02em] leading-[1.22] text-carbon">
              {e.t}
            </h3>
            <p className="mt-3 text-[13px] leading-[1.6] text-graphite/60">
              {e.body}
            </p>
          </motion.article>
        ))}
      </div>

      {/* what all four converge on */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="flex flex-wrap justify-center gap-2.5 max-w-[1180px] mx-auto mt-12 sm:mt-14"
      >
        {OUTCOMES.map((o) => (
          <span
            key={o}
            className="px-4 py-2 rounded-full text-[13px] font-semibold text-white bg-carbon"
          >
            {o}
          </span>
        ))}
      </motion.div>
    </Section>
  );
}
