"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  BadgeCheck,
  GraduationCap,
  Megaphone,
} from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Operator intelligence — skill vs behaviour.
 *
 * The second block of the source document's #driving section, given its own
 * surface because it has its own anchor, header and closing statement.
 *
 * The quadrant is the argument: the same event count means a different
 * response depending on which axis it sits on. It is a real control — pick a
 * quadrant and the panel answers. The caveat under the panel is the document's
 * and stays put; this is decision support, not a scoring system.
 */

const LINE = "#E8E8ED";

type Key = "train" | "reinforce" | "priority" | "coach";

const QUADRANTS: Record<
  Key,
  { kind: string; title: string; body: string; rx: string }
> = {
  reinforce: {
    kind: "Higher skill + good behaviour",
    title: "Reinforce",
    body: "Control of the machine and the operating pattern are both where you want them. Continue monitoring and recognise the practice.",
    rx: "Continue monitoring",
  },
  train: {
    kind: "Developing skill + good behaviour",
    title: "Train",
    body: "The operator follows expected operating practice but may need better physical control of the machine. Coaching an attitude will not close a handling gap.",
    rx: "Practical skill training",
  },
  coach: {
    kind: "Higher skill + risky behaviour",
    title: "Coach",
    body: "Machine control looks adequate, but the operating pattern is repeatedly higher-risk. More training is unlikely to change a choice.",
    rx: "Behaviour coaching",
  },
  priority: {
    kind: "Developing skill + risky behaviour",
    title: "Priority intervention",
    body: "Both the physical control of the machine and the operating pattern need attention. Treating either one alone is unlikely to change the outcome.",
    rx: "Training + behaviour coaching + follow-up review",
  },
};

/** Reading order matches the plot: top row good behaviour, bottom row risky. */
const CELLS: { k: Key; label: string[] }[] = [
  { k: "train", label: ["Developing skill", "Good behaviour"] },
  { k: "reinforce", label: ["Higher skill", "Good behaviour"] },
  { k: "priority", label: ["Developing skill", "Risky behaviour"] },
  { k: "coach", label: ["Higher skill", "Risky behaviour"] },
];

const ICONS = {
  train: GraduationCap,
  reinforce: BadgeCheck,
  priority: AlertTriangle,
  coach: Megaphone,
} as const;

/**
 * One quadrant, as a card: icon at the top, the response and the pairing that
 * produces it at the bottom.
 *
 * Only the selected card is filled and bordered — the other three sit flat on
 * the surface with a muted icon. The axes are gone with this layout: each card
 * states its own pairing ("Developing skill + risky behaviour"), so edge
 * labels would be saying it a second time.
 */
function QuadCell({
  k,
  on,
  pick,
}: {
  k: Key;
  on: boolean;
  pick: (k: Key) => void;
}) {
  const q = QUADRANTS[k];
  const Icon = ICONS[k];

  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => pick(k)}
      className="group relative flex flex-col overflow-hidden text-left p-6 transition-all duration-300"
      style={{
        minHeight: 204,
        borderRadius: 16,
        background: "transparent",
        border: `1px solid ${on ? LINE : "transparent"}`,
        boxShadow: "none",
      }}
    >
      {/* the selected card catches a little light in the corner */}
      <span
        aria-hidden
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full transition-opacity duration-500"
        style={{
          opacity: on ? 1 : 0,
          background:
            "radial-gradient(circle, rgba(255,106,0,0.5) 0%, rgba(255,106,0,0) 70%)",
          filter: "blur(16px)",
        }}
      />

      {/* Colours are classes rather than inline styles here: hover has to
          reach the tile and the glyph, and an inline style would win over
          group-hover. */}
      <span
        className={
          "relative w-10 h-10 rounded-[11px] flex items-center justify-center shrink-0 border transition-colors duration-300 " +
          (on
            ? "bg-[rgba(255,106,0,0.10)] border-[rgba(255,106,0,0.22)]"
            : "bg-[rgba(8,8,10,0.04)] border-transparent group-hover:bg-[rgba(255,106,0,0.10)] group-hover:border-[rgba(255,106,0,0.22)]")
        }
      >
        <Icon
          className={
            "w-[18px] h-[18px] transition-colors duration-300 " +
            (on
              ? "text-signal-orange"
              : "text-[#B9BAC1] group-hover:text-signal-orange")
          }
          strokeWidth={1.9}
          aria-hidden
        />
      </span>

      <span className="relative mt-auto pt-8 block">
        <span
          className={
            "block text-[17px] sm:text-[18px] font-semibold tracking-[-0.02em] leading-[1.25] transition-colors duration-300 " +
            (on ? "text-carbon" : "text-graphite/50 group-hover:text-carbon")
          }
        >
          {q.title}
        </span>
        <span className="mt-2 block text-[13.5px] text-graphite/55 leading-[1.6]">
          {q.kind}
        </span>
      </span>
    </button>
  );
}

export function RtssOperator() {
  const [active, setActive] = useState<Key>("priority");
  const q = QUADRANTS[active];

  return (
    <Section surface="warm" id="operator">
      <SectionHeader
        eyebrow="Operator intelligence"
        top="Is it a skill problem —"
        bottom="Or a behaviour problem?"
        body="Most systems report that an operator had a number of events. The useful question is which response would actually change it. Select a quadrant."
        size="compact"
        width="wide"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center max-w-[1040px] mx-auto">
        {/* the plot — right on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, ease: EASE }}
          className="lg:order-2"
        >
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            role="group"
            aria-label="Skill and behaviour quadrant"
          >
            {CELLS.map((c) => (
              <QuadCell
                key={c.k}
                k={c.k}
                on={active === c.k}
                pick={setActive}
              />
            ))}
          </div>
        </motion.div>

        {/* the response — left on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
          className="lg:order-1 flex flex-col"
        >
          <p className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
            {q.kind}
          </p>
          <h3 className="mt-4 text-[24px] sm:text-[28px] font-bold text-carbon leading-[1.15] tracking-[-0.025em]">
            {q.title}
          </h3>
          <p className="mt-5 text-[15px] sm:text-[16px] text-graphite/65 leading-[1.7]">
            {q.body}
          </p>

          <span
            className="mt-8 inline-flex self-start px-3.5 py-2 rounded-full text-[11.5px] font-mono font-semibold tracking-[0.06em] text-signal-orange"
            style={{
              background: "rgba(255,106,0,0.08)",
              border: "1px solid rgba(255,106,0,0.24)",
            }}
          >
            {q.rx}
          </span>

          <p
            className="mt-10 pt-7 text-[12px] font-mono text-graphite/45 leading-[1.7]"
            style={{ borderTop: `1px solid ${LINE}` }}
          >
            Skill and behaviour classification is decision support for training,
            coaching and review — not a disciplinary scoring system. Human
            review and site policy remain essential.
          </p>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-16 sm:mt-20 text-center font-rams-heading text-[22px] sm:text-[28px] lg:text-[32px] font-bold tracking-[-0.028em] leading-[1.2] text-carbon max-w-[30ch] mx-auto"
      >
        Do not just identify unsafe driving. Identify the right{" "}
        <span className="text-signal-orange">intervention</span>.
      </motion.p>
    </Section>
  );
}
