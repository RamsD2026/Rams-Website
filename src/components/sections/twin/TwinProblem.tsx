"use client";

import { motion } from "framer-motion";
import { FileText, MapPin, TriangleAlert, Unplug } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 02 — Problem / current state.
 *
 * Centred `SectionHeader` over the site's **four-up** card, matched to
 * `WexWhy` value for value: `gap-5`, `p-7 sm:p-8`, 12px radius, #E8E8ED
 * hairline, the two-part shadow, a 48px tinted tile with `mb-6` holding a
 * 22px icon at stroke 2, a 20/21px bold title and a 14px body at 1.65.
 *
 * Note this is a different card from the three-up on `WexCapabilities`, which
 * runs a larger 20/22px semibold title and `p-8 sm:p-9`. Four across is
 * narrower, so the four-up variant steps the type and padding down. Copy from
 * a grid with the same column count — `RiqRoles`, `RtssOwners` and `InvWhy`
 * are the others.
 *
 * The hover is the shared signature: a 1px lift plus the conic orange shine,
 * with the custom property namespaced `twinprob` so it cannot collide with
 * another section on this page.
 *
 * The reference this was drawn from used big numerals and a coloured top rail
 * per card. Both are gone — the numerals because the cards are not a sequence,
 * and the rails because those four colours were decorative, which the brand
 * rules reserve orange and the RAG set against.
 */

const CARDS = [
  {
    icon: FileText,
    /* Broken by hand. The other three titles wrap to two lines on their own;
       this one fits on one, which left it sitting alone above a reserved
       empty line. `whitespace-pre-line` on the h3 honours the break. */
    title: "Reports lose\ncontext",
    body: "Information moves through a hierarchy and each handover removes location, evidence or operational detail.",
  },
  {
    icon: MapPin,
    title: "Site visibility requires travel",
    body: "Management must visit or depend on summaries to understand what is happening at a distant site.",
  },
  {
    icon: TriangleAlert,
    title: "Changes carry uncertainty",
    body: "Layouts and physical modifications are often reviewed without a persistent operational model.",
  },
  {
    icon: Unplug,
    title: "Systems remain isolated",
    body: "Assets, sensors, inspections, MHE, inventory and maintenance data lack a shared physical context.",
  },
];

export function TwinProblem() {
  return (
    <Section surface="white" id="problem">
      <style>{`
        @property --twinprob-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .twinprob-card { position: relative; isolation: isolate; }
        .twinprob-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--twinprob-shine-angle),
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
        .twinprob-card:hover::before {
          opacity: 1;
          animation: twinprob-shine 2.4s linear infinite;
        }
        @keyframes twinprob-shine {
          to { --twinprob-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .twinprob-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="The problem today"
        top="Your facility is real."
        bottom="Its information is scattered."
        size="compact"
        width="wide"
        body="Critical facility knowledge remains fragmented across drawings, spreadsheets, reports, presentations and isolated systems."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {CARDS.map((c, i) => (
          <motion.article
            key={c.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            className="twinprob-card group relative flex flex-col p-7 sm:p-8 bg-white transition-all duration-300 hover:-translate-y-1"
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
              <c.icon
                className="w-[22px] h-[22px] text-signal-orange"
                strokeWidth={2}
              />
            </div>

            {/* Two lines reserved. Four titles across, and three of them wrap
                to two lines — without this the bodies start at different
                heights and the row reads as ragged. */}
            <h3 className="min-h-[2.4em] whitespace-pre-line text-[20px] sm:text-[21px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
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
