"use client";

import { motion } from "framer-motion";
import { Anchor, Cable, CircleCheckBig, Ruler } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 05 — What makes RAMS different.
 *
 * Centred `SectionHeader` at `compact`, then four columns ranged left: an
 * icon, a heading and a line.
 *
 * ── Why this is not the four-up card again ──────────────────────────
 * Section two already runs the site's boxed four-up, and this section has four
 * items too. Two identical card grids on one page reads as a template rather
 * than as two different arguments, so this one has no box, no shadow and no
 * rule: an icon, a heading and a line, ranged left on an open ground.
 *
 * ── The tints ───────────────────────────────────────────────────────
 * Four, from the palette `TwinOverview` sampled: red, orange, green, blue.
 * They carry no meaning and are not a severity scale — they exist to separate
 * four adjacent columns that have nothing else doing it for them. The tile is
 * the tint at 0x24 alpha with no border; on a dark ground a bordered tile reads as a
 * button, and these are not pressable.
 *
 * ── The icons ───────────────────────────────────────────────────────
 * Each reads its own heading, and none repeats one already used on this page —
 * `AboutWhy` holds History, Unlink, Puzzle and Hourglass, and an icon meaning
 * two things on one page is worse than no icon at all.
 *
 *   Ruler           physical-first is measurement before anything else
 *   Anchor          persistent context is the thing that stays put
 *   Cable           open connection is the literal join
 *   CircleCheckBig  action-oriented ends at verified closure
 */

const TRAITS: {
  icon: typeof Ruler;
  tint: string;
  title: string;
  body: string;
}[] = [
  {
    icon: Ruler,
    tint: "#E5484D",
    title: "Physical-first",
    body: "We begin with geometry, assets, constraints, condition and real operating behaviour.",
  },
  {
    icon: Anchor,
    tint: "#F76808",
    title: "Persistent context",
    body: "The Digital Twin remains useful after creation because asset history and operations continue to build around it.",
  },
  {
    icon: Cable,
    tint: "#299764",
    title: "Open connection",
    body: "RAMS can use supported RAMS hardware, compatible customer hardware and approved enterprise systems.",
  },
  {
    icon: CircleCheckBig,
    tint: "#3E63DD",
    title: "Action-oriented",
    body: "Information moves toward a responsible owner, verified closure and measurable learning.",
  },
];

export function AboutDifferent() {
  return (
    <Section surface="white" id="different">
      <SectionHeader
        eyebrow="What makes RAMS different"
        top="Engineering depth meets"
        bottom="Operational software."
        size="compact"
        width="wide"
        body="The platform is shaped by the realities of the site — not separated from them."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
        {TRAITS.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
            className="flex flex-col"
          >
            <span
              className="flex items-center justify-center w-11 h-11 shrink-0"
              style={{ borderRadius: 10, background: `${t.tint}16` }}
            >
              <t.icon
                className="w-[20px] h-[20px]"
                style={{ color: t.tint }}
                strokeWidth={2}
                aria-hidden
              />
            </span>

            <h3 className="mt-6 text-[20px] sm:text-[22px] font-semibold tracking-[-0.02em] text-carbon leading-[1.2]">
              {t.title}
            </h3>

            <p className="mt-3 text-[14.5px] leading-[1.6] text-graphite/60">
              {t.body}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
