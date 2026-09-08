"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Frame, Gauge, LineChart, Network, Tag, Workflow } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 06 — How RAMS works.
 *
 * Six steps on one track: an icon node, then the stage, the verb and the line
 * under it — every step showing its own copy, centred, all six at once. The
 * selected one is lit and the track advances on its own.
 *
 * ── Everything is on screen at once ─────────────────────────────────
 * The previous pass put one step's detail in a panel below the stepper, so
 * five of the six were hidden behind a click. A process the reader has to
 * operate to read is a worse process than one they can take in whole. The copy
 * is short enough — one line each, from the source — that all six fit in a
 * six-up without crowding, and the selection then does what a selection should
 * do: emphasise, rather than reveal.
 *
 * ── The autoplay ────────────────────────────────────────────────────
 * It advances every 3.6s and holds while the pointer is over the row, so
 * reading a step does not fight the clock. Clicking a node takes it and
 * restarts the dwell. `prefers-reduced-motion` stops it entirely and leaves
 * step one selected — nothing is hidden by that, since all six are readable
 * whatever is selected.
 *
 * ── The nodes ───────────────────────────────────────────────────────
 * An icon rather than a numeral, with the index kept in the stage label above
 * the verb so the order is still stated. Each icon reads its own step, and
 * none repeats one already on this page — `AboutWhy` holds History, Unlink,
 * Puzzle and Hourglass, and `AboutDifferent` holds Ruler, Anchor, Cable and
 * CircleCheckBig.
 *
 *   Frame      digitising is drawing the shell of the building
 *   Tag        an asset identity is literally a tag
 *   Network    integrating is joining sources
 *   Workflow   operating is running the work
 *   LineChart  learning is reading history
 *   Gauge      optimising is measuring the change
 *
 * ── The section is set tight ────────────────────────────────────────
 * `padding="tight"` rather than the default: this is the shortest section on
 * the page — one row of six columns — and at the default 176px top and bottom
 * it carried the same air as the sections holding eight cards, which left it
 * looking like an empty band between two full ones. Tight is 112px, and it is
 * an existing value on `Section` rather than a number invented here.
 *
 * ── Heights are pinned ──────────────────────────────────────────────
 * The stage row, the verb and the body all carry a `min-h`, because six
 * columns of unequal copy would otherwise sit their nodes at one height and
 * their text at six, and the row would shift as the selection moved.
 */

const STEPS: {
  n: string;
  stage: string;
  verb: string;
  body: string;
  icon: typeof Frame;
}[] = [
  {
    n: "01",
    stage: "Model",
    verb: "Digitise",
    body: "Create or reconstruct the facility and its physical structure.",
    icon: Frame,
  },
  {
    n: "02",
    stage: "Tag",
    verb: "Identify",
    body: "Give each physical asset a persistent digital identity.",
    icon: Tag,
  },
  {
    n: "03",
    stage: "Connect",
    verb: "Integrate",
    body: "Add supported sensors, machines and enterprise data.",
    icon: Network,
  },
  {
    n: "04",
    stage: "Operate",
    verb: "Apply",
    body: "Run RAMS or customer-specific workflows in context.",
    icon: Workflow,
  },
  {
    n: "05",
    stage: "Learn",
    verb: "Understand",
    body: "Use history and analytics to identify patterns.",
    icon: LineChart,
  },
  {
    n: "06",
    stage: "Improve",
    verb: "Optimise",
    body: "Turn insight into verified physical change.",
    icon: Gauge,
  },
];

/** First and last node centres with six equal columns: 1/12 and 11/12. */
const RAIL_INSET = "8.333%";
const DWELL_MS = 3600;

export function AboutHow() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [held, setHeld] = useState(false);
  const [nudge, setNudge] = useState(0);

  useEffect(() => {
    if (reduce || held) return;
    const id = setInterval(
      () => setI((n) => (n + 1) % STEPS.length),
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
        eyebrow="How RAMS works"
        top="From facility to"
        bottom="Continuous intelligence."
        size="compact"
        width="wide"
        body="Start with the physical environment and expand only where the operating value is clear."
      />

      <div
        className="overflow-x-auto"
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
      >
        <div className="relative min-w-[860px] lg:min-w-0 pt-1">
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
              transform: `scaleX(${i / (STEPS.length - 1)})`,
            }}
          />

          <div className="relative grid grid-cols-6 gap-x-4">
            {STEPS.map((s, n) => {
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

                  {/* Every height below is pinned — six columns of unequal
                      copy would otherwise shift the row as the selection
                      moved. */}
                  <span
                    className="mt-5 min-h-[14px] text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase tabular-nums transition-colors duration-300"
                    style={{ color: now ? "#FF6A00" : "rgba(20,22,26,0.35)" }}
                  >
                    {s.n} · {s.stage}
                  </span>

                  <span
                    className={
                      "mt-2.5 min-h-[1.2em] text-[15px] sm:text-[16px] font-semibold tracking-[-0.02em] leading-[1.2] transition-colors duration-300 " +
                      (now ? "text-carbon" : "text-graphite/55")
                    }
                  >
                    {s.verb}
                  </span>

                  <motion.span
                    className="mt-3 min-h-[4.5em] text-[12.5px] leading-[1.5] text-graphite/55"
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
