"use client";

import { motion } from "framer-motion";
import {
  Building2,
  ClipboardCheck,
  HardHat,
  LineChart,
  Ruler,
} from "lucide-react";
import { Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, HAIR } from "./irdsx-shared";

/**
 * 15 — Who uses IRDS, and why RAMS.
 *
 * Two short sections in one file because they answer the same question from
 * two sides: who is in the room, and what they are actually buying.
 *
 * The roles are not personas. Each one is named by what it does to the record
 * — captures it, judges it, verifies it, fixes it, reads it — because a
 * platform is sold on who can act in it, not on who might like it.
 *
 * Hover is the shared signature, namespaced `irxrole`.
 */

const ROLES = [
  {
    icon: ClipboardCheck,
    k: "Inspection team",
    body: "Runs the cycle against the configured checklist and captures the evidence at the rack.",
  },
  {
    icon: Ruler,
    k: "Engineering",
    body: "Owns the method, the thresholds and the judgement the results are read against.",
  },
  {
    icon: HardHat,
    k: "Warehouse team",
    body: "Receives corrective work with a location, an owner and a due date attached.",
  },
  {
    icon: Building2,
    k: "Third-party inspector",
    body: "Records an independent audit in the same rack and component structure.",
  },
  {
    icon: LineChart,
    k: "Management",
    body: "Sees coverage, risk and closure across sites without waiting on a report.",
  },
];

const WHY: [string, string][] = [
  [
    "Structured",
    "Every finding resolves to a site, row, rack, bay, level and component — not to a photograph in a folder.",
  ],
  [
    "Traceable",
    "The result, the reading, the evidence and the person who recorded it stay attached to each other.",
  ],
  [
    "Connected",
    "Inspection, testing, issues, procurement and reporting are one record, not five exports.",
  ],
  [
    "Scalable",
    "The same model extends across rack types, inspectors, sites, customers and cycles.",
  ],
];

export function IrxRoles() {
  return (
    <>
      <Section surface="offWhite" id="roles">
        <style>{`
          @property --irxrole-shine-angle {
            syntax: '<angle>';
            initial-value: 0deg;
            inherits: false;
          }
          .irxrole-card { position: relative; isolation: isolate; }
          .irxrole-card::before {
            content: "";
            position: absolute;
            inset: -1px;
            border-radius: inherit;
            padding: 1px;
            background: conic-gradient(
              from var(--irxrole-shine-angle),
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
          .irxrole-card:hover::before {
            opacity: 1;
            animation: irxrole-shine 2.4s linear infinite;
          }
          @keyframes irxrole-shine {
            to { --irxrole-shine-angle: 360deg; }
          }
          @media (prefers-reduced-motion: reduce) {
            .irxrole-card:hover::before { animation: none; }
          }
        `}</style>

        <SectionHeader
          eyebrow="Who uses IRDS"
          top="Five roles,"
          bottom="One rack record."
          size="compact"
          width="wide"
          body="Each one acts on the same record from a different side — captures it, judges it, fixes it, verifies it or reads it."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {ROLES.map((r, i) => (
            <motion.article
              key={r.k}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: i * 0.07, ease: EASE }}
              className="irxrole-card group relative flex flex-col p-6 bg-white transition-transform duration-300 hover:-translate-y-1"
              style={{
                borderRadius: 12,
                border: `1px solid ${HAIR}`,
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="w-11 h-11 flex items-center justify-center mb-5"
                style={{
                  borderRadius: 8,
                  background: "rgba(255,106,0,0.08)",
                  border: "1px solid rgba(255,106,0,0.18)",
                }}
              >
                <r.icon
                  className="w-[20px] h-[20px] text-signal-orange"
                  strokeWidth={2}
                />
              </div>

              {/* Two lines reserved — "Third-party inspector" wraps. */}
              <h3 className="min-h-[2.4em] text-[16px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
                {r.k}
              </h3>
              <p className="mt-3 text-[13px] text-graphite/65 leading-[1.6]">
                {r.body}
              </p>
            </motion.article>
          ))}
        </div>
      </Section>

      <Section surface="white" id="why-rams">
        <SectionHeader
          eyebrow="Why RAMS"
          top="Built as an operating record,"
          bottom="Not as a checklist app."
          size="compact"
          width="wide"
        />

        <div className="max-w-[900px] mx-auto">
          {WHY.map(([k, v], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: EASE }}
              className="grid grid-cols-1 sm:grid-cols-[180px_minmax(0,1fr)] gap-2 sm:gap-8 py-7"
              style={{ borderTop: `1px solid ${HAIR}` }}
            >
              <h3 className="text-[19px] font-bold tracking-[-0.02em] text-carbon">
                {k}
              </h3>
              <p className="text-[14.5px] leading-[1.7] text-graphite/65">
                {v}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>
    </>
  );
}
