"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Boxes,
  CircleCheckBig,
  Cloud,
  Cpu,
  Radar,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Edge.
 *
 * The argument is about time, so the section spends its space on the path
 * rather than on cards: six nodes, and a signal that visibly runs the whole
 * way in about a second. The twin sits in the middle of that run, which is
 * the claim — context arrives fast enough to be part of the local decision,
 * not after it.
 */

const LINE = "#E8E8ED";

const FLOW: [string, LucideIcon][] = [
  ["Sensor", Radar],
  ["Edge processor", Cpu],
  ["Local decision", Zap],
  ["Twin context", Boxes],
  ["Cloud & history", Cloud],
  ["Operational action", CircleCheckBig],
];

/* The two closing paragraphs, tied to the half of the rail each one is about
   — so they read as annotations on the path rather than a block of prose
   underneath it. */
const NOTES: [string, string][] = [
  [
    "At the machine",
    "OmniBox and the machine interfaces are not sold as boxes on a forklift. They are the edge intelligence layer of the Physical Operating System — the point where sensing, local models and the twin's context meet closely enough to act in time.",
  ],
  [
    "Back in the twin",
    "Locally resolved events still return to the twin. The facility keeps the record even when the decision was made in milliseconds at the machine.",
  ],
];

const TICK_MS = 70;
/** Ticks per leg, then a rest before the signal runs again. */
const LEG = 7;
const REST = 10;

function Rail({ still }: { still: boolean }) {
  const [t, setT] = useState(0);

  useEffect(() => {
    if (still) return;
    const id = setInterval(() => setT((v) => v + 1), TICK_MS);
    return () => clearInterval(id);
  }, [still]);

  const span = LEG * (FLOW.length - 1) + REST;
  const phase = t % span;
  const leg = Math.floor(phase / LEG);
  const along = (phase % LEG) / (LEG - 1);

  return (
    <div className="flex items-start">
      {FLOW.map(([f, Icon], i) => {
        const end = i === FLOW.length - 1;
        const lit = still || i <= leg;
        return (
          <div key={f} className="flex-1 flex items-start">
            <div className="flex flex-col items-center gap-3 w-[86px] sm:w-[104px] shrink-0">
              <span
                className="relative flex items-center justify-center w-9 h-9 rounded-full shrink-0 transition-colors duration-300"
                style={{
                  background: lit
                    ? end
                      ? "#FF6A00"
                      : "rgba(255,106,0,0.08)"
                    : "#FFFFFF",
                  border: `1px solid ${lit ? (end ? "#FF6A00" : "rgba(255,106,0,0.28)") : "#E4E4E9"}`,
                }}
              >
                <Icon
                  className={
                    "w-[17px] h-[17px] transition-colors duration-300 " +
                    (lit
                      ? end
                        ? "text-white"
                        : "text-signal-orange"
                      : "text-graphite/35")
                  }
                  strokeWidth={1.9}
                  aria-hidden
                />
              </span>

              <span
                className={
                  "text-center text-[12px] sm:text-[12.5px] leading-[1.35] transition-colors duration-300 " +
                  (end
                    ? "font-semibold text-signal-orange"
                    : lit
                      ? "text-carbon"
                      : "text-graphite/45")
                }
              >
                {f}
              </span>
            </div>

            {!end && (
              <span
                className="relative flex-1 h-px mt-[18px] overflow-hidden"
                style={{ background: LINE }}
              >
                <span
                  className="absolute inset-y-0 left-0 bg-signal-orange"
                  style={{
                    width: still
                      ? "100%"
                      : i < leg
                        ? "100%"
                        : i === leg
                          ? `${(along * 100).toFixed(1)}%`
                          : "0%",
                    transition: "width 70ms linear",
                  }}
                />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function TwinEdge() {
  const still = useReducedMotion() ?? false;

  return (
    <Section surface="offWhite" id="edge">
      <SectionHeader
        eyebrow="Edge"
        top="Sense locally. Understand in context."
        bottom="Respond faster."
        body="Some decisions cannot wait for a round trip to a cloud application. Processing sits close to the physical event; the twin supplies the context that makes the local decision correct."
        size="long"
        width="wide"
        bodyWidth="wide"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="max-w-[1080px] mx-auto overflow-x-auto"
      >
        <div className="min-w-[640px]">
          <Rail still={still} />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 max-w-[1080px] mx-auto mt-10">
        {NOTES.map(([label, n], i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
            className="pt-5"
            style={{ borderTop: `1px solid ${LINE}` }}
          >
            <p className="text-[9.5px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/40">
              {label}
            </p>
            <p className="mt-3 text-[13.5px] leading-[1.6] text-graphite/55">
              {n}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
