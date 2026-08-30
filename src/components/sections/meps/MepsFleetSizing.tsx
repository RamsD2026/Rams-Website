"use client";

import { motion } from "framer-motion";
import {
  Ban,
  Clock,
  Shuffle,
  TrendingDown,
  TrendingUp,
  Waypoints,
} from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Fleet optimisation.
 *
 * Six findings, and the point of the section is that they disagree: the
 * document says the evidence points in different directions at different
 * sites. Each card carries the glyph for the direction its own evidence
 * points, so the set reads as six possible answers rather than a checklist.
 *
 * On the warm surface, so cards take the white treatment the IRDS History
 * section uses on the same ground: 12px, #E8E8ED, the two-layer shadow.
 */

const LINE = "#E8E8ED";

const FINDINGS = [
  {
    Icon: TrendingDown,
    text: "There are more machines than the work requires",
  },
  { Icon: TrendingUp, text: "There are too few during peak demand" },
  { Icon: Shuffle, text: "Fleet size is right but poorly distributed" },
  { Icon: Ban, text: "An equipment type is unsuited to its zone" },
  { Icon: Waypoints, text: "Congestion, not fleet count, is capping output" },
  { Icon: Clock, text: "Certain shifts are poorly balanced" },
];

export function MepsFleetSizing() {
  return (
    <Section surface="warm" id="fleet-optimisation">
      <SectionHeader
        eyebrow="Fleet optimisation"
        top="How many MHEs does"
        bottom="the operation actually need?"
        body="MEPS does not promise a smaller fleet. It gives the fleet decision an evidence base — and at different sites the evidence points in different directions."
        size="compact"
        width="wide"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FINDINGS.map((f, i) => (
          <motion.article
            key={f.text}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: i * 0.06, ease: EASE }}
            className="flex flex-col px-6 py-7 bg-white"
            style={{
              minHeight: 180,
              borderRadius: 12,
              border: `1px solid ${LINE}`,
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
            }}
          >
            <f.Icon
              className="w-6 h-6 shrink-0 text-signal-orange mb-7"
              strokeWidth={1.5}
              aria-hidden
            />
            <p className="text-[16px] sm:text-[17px] font-semibold tracking-[-0.018em] text-carbon leading-[1.35]">
              {f.text}
            </p>
          </motion.article>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-16 sm:mt-20 text-center"
      >
        <p className="font-rams-heading text-[22px] sm:text-[28px] lg:text-[32px] font-bold tracking-[-0.025em] leading-[1.2] text-carbon">
          Right-size the fleet from{" "}
          <span className="text-signal-orange">actual work</span> — not
          assumptions.
        </p>
        <p className="mt-5 text-[14px] sm:text-[15px] text-graphite/60 leading-[1.6]">
          Optimise before you add, or remove, equipment.
        </p>
      </motion.div>
    </Section>
  );
}
