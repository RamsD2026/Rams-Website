"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BadgeCheck,
  GraduationCap,
  Rocket,
  ScanSearch,
  TrendingUp,
} from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 08 — How it works.
 *
 * Five stages on one track: an icon node, then the stage number, the verb and
 * the line under it — all five showing their own copy at once, centred. The
 * selected one is lit and the track advances on its own.
 *
 * This is `AboutHow`'s stepper with five nodes instead of six, so the rail
 * inset changes and nothing else does. With N equal columns the first and
 * last node centres sit at 1/(2N) and 1 - 1/(2N): six gives 8.333% and five
 * gives 10%. That is the only number in this file that is not shared with the
 * About page, and getting it wrong is why the rail used to overshoot the end
 * nodes.
 *
 * ── Everything is on screen at once ─────────────────────────────────
 * The copy is one line per stage, so all five fit in a five-up without
 * crowding, and the selection does what a selection should: emphasise rather
 * than reveal. A process the reader has to operate in order to read is a
 * worse process than one they can take in whole.
 *
 * ── The autoplay ────────────────────────────────────────────────────
 * It advances every 3.6s and holds while the pointer is over the row, so
 * reading a stage does not fight the clock. Clicking a node takes it and
 * restarts the dwell. `prefers-reduced-motion` stops it entirely and leaves
 * stage one selected — nothing is hidden by that, since all five are readable
 * whatever is selected.
 *
 * ── The icons ───────────────────────────────────────────────────────
 *   ScanSearch      align is looking for the fit
 *   BadgeCheck      validate is the check against a standard
 *   GraduationCap   enable is training
 *   Rocket          launch is the first run
 *   TrendingUp      scale is the curve after it
 *
 * None repeats one used elsewhere on this page — `PartnersWhy` holds PlugZap,
 * Target, Workflow and Handshake, and an icon meaning two things on one page
 * is worse than no icon at all.
 */

const STAGES: {
  n: string;
  verb: string;
  body: string;
  icon: typeof ScanSearch;
}[] = [
  {
    n: "01",
    verb: "Align",
    body: "Confirm customer segment, use cases, geography and partnership fit.",
    icon: ScanSearch,
  },
  {
    n: "02",
    verb: "Validate",
    body: "Review commercial, technical, delivery and governance capability.",
    icon: BadgeCheck,
  },
  {
    n: "03",
    verb: "Enable",
    body: "Complete product, workflow and role-specific training.",
    icon: GraduationCap,
  },
  {
    n: "04",
    verb: "Launch",
    body: "Run an agreed pilot, integration or joint customer opportunity.",
    icon: Rocket,
  },
  {
    n: "05",
    verb: "Scale",
    body: "Review outcomes, strengthen capability and expand responsibly.",
    icon: TrendingUp,
  },
];

/** First and last node centres with five equal columns: 1/10 and 9/10. */
const RAIL_INSET = "10%";
const DWELL_MS = 3600;

export function PartnersHow() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [held, setHeld] = useState(false);
  const [nudge, setNudge] = useState(0);

  useEffect(() => {
    if (reduce || held) return;
    const id = setInterval(
      () => setI((n) => (n + 1) % STAGES.length),
      DWELL_MS,
    );
    return () => clearInterval(id);
  }, [reduce, held, nudge]);

  const pick = (n: number) => {
    setI(n);
    setNudge((v) => v + 1);
  };

  return (
    <Section surface="offWhite" id="how" padding="tight">
      <SectionHeader
        eyebrow="How it works"
        top="A partnership built"
        bottom="Around capability."
        size="compact"
        width="wide"
        body="Every engagement begins by defining the market, responsibilities, technical scope and quality expectations."
      />

      <div
        className="overflow-x-auto"
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
      >
        <div className="relative min-w-[760px] lg:min-w-0 pt-1">
          {/* the track, behind the nodes */}
          <span
            aria-hidden
            className="absolute top-[19px] h-px"
            style={{ left: RAIL_INSET, right: RAIL_INSET, background: "#E0E0E6" }}
          />
          <span
            aria-hidden
            className="absolute top-[19px] h-px origin-left transition-transform duration-500"
            style={{
              left: RAIL_INSET,
              right: RAIL_INSET,
              background: "#FF6A00",
              transform: `scaleX(${i / (STAGES.length - 1)})`,
            }}
          />

          <div className="relative grid grid-cols-5 gap-x-4">
            {STAGES.map((s, n) => {
              const now = n === i;
              const done = n < i;
              return (
                <button
                  key={s.n}
                  type="button"
                  onClick={() => pick(n)}
                  aria-current={now ? "step" : undefined}
                  className="group flex flex-col items-center text-center"
                >
                  <span
                    className="flex items-center justify-center w-[38px] h-[38px] rounded-full shrink-0 transition-all duration-300"
                    style={{
                      background: now ? "#FF6A00" : "#FFFFFF",
                      border: `1.5px solid ${
                        now ? "#FF6A00" : done ? "#FFC59E" : "#E0E0E6"
                      }`,
                      boxShadow: now
                        ? "0 6px 18px -6px rgba(255,106,0,0.45)"
                        : "none",
                    }}
                  >
                    <s.icon
                      className="w-[17px] h-[17px] transition-colors duration-300"
                      style={{
                        color: now ? "#FFFFFF" : done ? "#D95A00" : "#B0B0B8",
                      }}
                      strokeWidth={2}
                      aria-hidden
                    />
                  </span>

                  {/* Every height below is pinned — five columns of unequal
                      copy would otherwise shift the row as the selection
                      moved. */}
                  <span
                    className="mt-5 min-h-[14px] text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase tabular-nums transition-colors duration-300"
                    style={{ color: now ? "#FF6A00" : "rgba(20,22,26,0.35)" }}
                  >
                    {s.n}
                  </span>

                  <span
                    className={
                      "mt-2.5 min-h-[1.2em] text-[16px] sm:text-[18px] font-semibold tracking-[-0.02em] leading-[1.2] transition-colors duration-300 " +
                      (now ? "text-carbon" : "text-graphite/55")
                    }
                  >
                    {s.verb}
                  </span>

                  <motion.span
                    className="mt-3 min-h-[4.5em] text-[13px] leading-[1.5] text-graphite/55 px-1"
                    initial={false}
                    animate={{ opacity: now ? 1 : 0.55 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    {s.body}
                  </motion.span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
