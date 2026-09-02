"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  Activity,
  ClipboardCheck,
  HardHat,
  PenLine,
  Shuffle,
  TrendingUp,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Lifecycle.
 *
 * Seven stages on one track, because the claim is that the twin survives all
 * of them. The track walks itself once it is on screen — a lifecycle should
 * be seen going round, not waited on — and everything behind the current
 * stage stays lit, so it reads as a life the facility has already had.
 *
 * Touching a stage stops the walk. Once the reader is steering, the section
 * should not keep moving under them.
 */

const HAIR = "rgba(255,255,255,0.10)";

const STAGES: { t: string; p: string; Icon: LucideIcon }[] = [
  {
    t: "Plan",
    Icon: PenLine,
    p: "Layout options, clearances, feasibility and safety zoning tested in the model before anything is committed physically. The twin exists before the change does.",
  },
  {
    t: "Build",
    Icon: HardHat,
    p: "What was actually installed, captured against what was designed. The as-built model becomes the reference the operation runs on — not a drawing set that stopped being true on day one.",
  },
  {
    t: "Operate",
    Icon: Activity,
    p: "Movement, tasks, utilisation, events and interactions accumulate against real locations and real assets, shift after shift.",
  },
  {
    t: "Inspect",
    Icon: ClipboardCheck,
    p: "Structured inspection findings recorded against the specific bay, upright or machine — with condition classification and a history, rather than a report filed once a year.",
  },
  {
    t: "Maintain",
    Icon: Wrench,
    p: "Triggers raised from usage and condition, work orders issued against the asset, and closure verified back into the same record.",
  },
  {
    t: "Optimise",
    Icon: TrendingUp,
    p: "Congestion, empty travel, repeat impact locations and layout constraints become visible as patterns in a place — which is what makes them fixable.",
  },
  {
    t: "Change",
    Icon: Shuffle,
    p: "The next layout change starts from the facility as it is today, with everything it has learned since the last one, instead of from a blank drawing.",
  },
];

/** Long enough to read the stage before it moves on. */
const DWELL_MS = 3600;

export function TwinLifecycle() {
  const [at, setAt] = useState(2);
  const [held, setHeld] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const seen = useInView(track, { amount: 0.3 });
  const still = useReducedMotion() ?? false;

  /* walks itself while it is on screen, until the reader takes over */
  useEffect(() => {
    if (!seen || held || still) return;
    const id = setInterval(
      () => setAt((v) => (v + 1) % STAGES.length),
      DWELL_MS,
    );
    return () => clearInterval(id);
  }, [seen, held, still]);

  const pick = (i: number) => {
    setAt(i);
    setHeld(true);
  };

  return (
    <Section surface="darkMid" id="lifecycle">
      <SectionHeader
        eyebrow="Lifecycle"
        top="The facility develops"
        bottom="A digital memory."
        body="Most digital twins are commissioned for a design decision and abandoned once the build is signed off. The value is in what comes after — because that is where the facility spends the next twenty years."
        tone="dark"
        size="compact"
        width="wide"
        bodyWidth="wide"
      />

      {/* the track */}
      <div ref={track} className="max-w-[1080px] mx-auto overflow-x-auto">
        <div className="min-w-[640px] flex">
          {STAGES.map((s, i) => {
            const on = i === at;
            const past = i < at;
            return (
              <button
                key={s.t}
                type="button"
                aria-pressed={on}
                onClick={() => pick(i)}
                className="group flex-1 text-left pb-5"
              >
                <span className="flex items-center gap-2.5 pr-3">
                  <span
                    className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 transition-colors duration-300"
                    style={{
                      background: on ? "#FF6A00" : "transparent",
                      border: `1px solid ${
                        on
                          ? "#FF6A00"
                          : past
                            ? "rgba(255,106,0,0.4)"
                            : "rgba(255,255,255,0.16)"
                      }`,
                    }}
                  >
                    <s.Icon
                      className="w-[15px] h-[15px] transition-colors duration-300"
                      style={{
                        color: on
                          ? "#FFFFFF"
                          : past
                            ? "rgba(255,106,0,0.7)"
                            : "rgba(255,255,255,0.3)",
                      }}
                      strokeWidth={1.9}
                      aria-hidden
                    />
                  </span>
                  <span
                    className="h-px flex-1 transition-colors duration-300"
                    style={{
                      background: past || on ? "rgba(255,106,0,0.4)" : HAIR,
                    }}
                  />
                </span>

                <span
                  className="block mt-4 text-[9.5px] font-mono font-bold tracking-[0.16em] tabular-nums transition-colors duration-300"
                  style={{
                    color: on
                      ? "#FF6A00"
                      : past
                        ? "rgba(255,255,255,0.4)"
                        : "rgba(255,255,255,0.25)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="block mt-1.5 font-rams-heading text-[15px] font-bold tracking-[-0.02em] transition-colors duration-300"
                  style={{
                    color: on
                      ? "#FFFFFF"
                      : past
                        ? "rgba(255,255,255,0.6)"
                        : "rgba(255,255,255,0.35)",
                  }}
                >
                  {s.t}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* the stage you are standing in */}
      <div
        className="max-w-[1080px] mx-auto mt-10 pt-10 min-h-[132px]"
        style={{ borderTop: `1px solid ${HAIR}` }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={STAGES[at].t}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="grid grid-cols-1 lg:grid-cols-[0.4fr_1fr] gap-6 lg:gap-14"
          >
            <h3 className="font-rams-heading text-[24px] sm:text-[30px] font-bold tracking-[-0.032em] leading-[1.15] text-white">
              {STAGES[at].t}
            </h3>
            <p className="text-[14.5px] sm:text-[15.5px] leading-[1.65] text-white/55 max-w-[62ch]">
              {STAGES[at].p}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
}
