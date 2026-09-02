"use client";

import { motion } from "framer-motion";
import { Crosshair, Repeat, Target } from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { DARK_LINE as HAIR, Points, type Point } from "./imds-shared";

/**
 * Damage reporting.
 *
 * Deliberately thin. The section only has to land one turn: today's version
 * of the story is a sentence nobody can act on, and the record replaces it
 * with three things you can. So the old story is one quiet line, the three
 * outcomes are three plain columns, and everything the report carries sits on
 * a single mono line rather than in a list of its own.
 */

const OUTCOMES: Point[] = [
  {
    Icon: Crosshair,
    ix: "Session",
    title: "The session is identified",
    body: "Machine, operator, time window and location narrowed from the operational record.",
  },
  {
    Icon: Repeat,
    ix: "Pattern",
    title: "The pattern is visible",
    body: "Whether this damage type keeps appearing on one machine, one zone or one manoeuvre.",
  },
  {
    Icon: Target,
    ix: "Response",
    title: "The response fits",
    body: "Training, a route change, a protection fix — chosen because the record supports it.",
  },
];

/** Everything the report carries, on one line rather than in a list. */
const CARRIES = [
  "Standardised taxonomy",
  "Severity classification",
  "Photo evidence",
  "Session and operator cross-reference",
  "Repeat types surfaced",
  "Work order raised",
];

export function ImdsDamage() {
  return (
    <Section surface="darkMid" id="damage">
      <SectionHeader
        eyebrow="Damage reporting"
        top="A bent fork at shift end,"
        bottom="And nobody knows when."
        body="Damage is found, logged loosely, repaired, and repeats — because the moment it happened was never established. IMDS records damage against a standard taxonomy and cross-references the operational log to identify which authenticated operator was on the machine at the time it most likely occurred."
        tone="dark"
        size="compact"
        width="wide"
        bodyWidth="wide"
      />

      {/* the story the record replaces */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="max-w-[560px] mx-auto text-center"
      >
        <p className="text-[9.5px] font-mono font-bold tracking-[0.18em] uppercase text-white/25">
          Without IMDS
        </p>
        <p className="mt-4 font-rams-heading text-[24px] sm:text-[28px] font-bold tracking-[-0.03em] leading-[1.25] text-white/45">
          “Someone bent a fork.”
        </p>
        <p className="mt-3 text-[13px] leading-[1.6] text-white/30">
          Repaired, absorbed into the maintenance budget, and repeated next
          quarter.
        </p>
      </motion.div>

      <div className="max-w-[1080px] mx-auto mt-14">
        <Points items={OUTCOMES} />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="max-w-[1080px] mx-auto mt-16 pt-7 flex flex-wrap justify-center gap-x-3 gap-y-2 text-[10.5px] font-mono tracking-[0.06em] text-white/35"
        style={{ borderTop: `1px solid ${HAIR}` }}
      >
        {CARRIES.map((c, i) => (
          <span key={c}>
            {i > 0 && <span className="mr-3 text-white/15">·</span>}
            {c}
          </span>
        ))}
      </motion.p>
    </Section>
  );
}
