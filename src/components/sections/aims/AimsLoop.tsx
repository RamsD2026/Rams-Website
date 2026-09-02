"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  FileCheck2,
  LineChart,
  ListChecks,
  ScanLine,
  Send,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * The management decision loop.
 *
 * Five stages on a ring around the intelligence core, lighting one at a time
 * so the cycle reads as running rather than drawn. The three cards on the left
 * are what the loop gives management once it does.
 */

const LINE = "#E8E8ED";

/** The cycle, clockwise from the top. */
const STAGES: { k: string; sub: string; Icon: LucideIcon }[] = [
  { k: "Capture", sub: "Connected field data", Icon: ScanLine },
  { k: "Analyse", sub: "Risk & performance", Icon: LineChart },
  { k: "Prioritise", sub: "Business impact", Icon: ListChecks },
  { k: "Act", sub: "Owner & due date", Icon: Send },
  { k: "Verify", sub: "Evidence & learning", Icon: ShieldCheck },
];

/* Polar placement: five stages evenly spaced from the top of a ring inset
   far enough that a node card never overlaps the core. */
const R = 38;
const polar = (turn: number, r: number) => {
  const a = turn * 2 * Math.PI - Math.PI / 2;
  return {
    left: `${(50 + r * Math.cos(a)).toFixed(2)}%`,
    top: `${(50 + r * Math.sin(a)).toFixed(2)}%`,
  };
};

const POS = STAGES.map((_, i) => polar(i / STAGES.length, R));

/**
 * Arrows between the stages. Each sits at the midpoint of its arc and is
 * rotated to the tangent there, so the ring reads as a direction rather than
 * a set of five boxes on a circle.
 */
const ARROWS = STAGES.map((_, i) => {
  const turn = (i + 0.5) / STAGES.length;
  return { ...polar(turn, R), rot: turn * 360 };
});

/**
 * What runs the ring: three of the stage icons, evenly spaced, one lap every
 * 16 seconds. The chip counter-rotates against its carrier so the icon stays
 * upright all the way round.
 */
const LAP = 16;
const RUNNERS = [
  { start: 0, Icon: ScanLine },
  { start: 120, Icon: ListChecks },
  { start: 240, Icon: ShieldCheck },
];

const OUTCOMES = [
  {
    Icon: Target,
    title: "Prioritise by impact",
    body: "Rank what to act on by risk, cost, productivity and urgency — not by whoever escalated loudest.",
  },
  {
    Icon: Users,
    title: "Coordinate across teams",
    body: "Central, regional and site ownership on the same issue, so nothing sits between two teams.",
  },
  {
    Icon: FileCheck2,
    title: "Maintain evidence",
    body: "Photos, timestamps and closure history stay attached, so a closed action can be shown as closed.",
  },
];

const STEP_MS = 1800;

function Ring() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((v) => v + 1), STEP_MS);
    return () => clearInterval(id);
  }, []);
  const active = step % STAGES.length;

  return (
    <div className="relative w-full max-w-[520px] mx-auto aspect-square">
      {/* the cycle itself — the stages sit on the outer ring */}
      <span
        aria-hidden
        className="absolute rounded-full"
        style={{
          inset: "12%",
          border: `1px dashed ${LINE}`,
        }}
      />

      {/* and the signals run the inner one */}
      <span
        aria-hidden
        className="absolute rounded-full"
        style={{
          inset: "28%",
          border: "1px solid rgba(255,106,0,0.16)",
        }}
      />

      {/* which way the loop runs */}
      {ARROWS.map((a, i) => (
        <motion.span
          key={`arrow-${i}`}
          aria-hidden
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full"
          style={{
            left: a.left,
            top: a.top,
            background: "#FFFFFF",
            border: `1px solid ${LINE}`,
          }}
          initial={{ opacity: 0.45, rotate: a.rot }}
          animate={{ opacity: [0.45, 1, 0.45], rotate: a.rot }}
          transition={{
            duration: STAGES.length * 0.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.6,
          }}
        >
          <ChevronRight
            className="w-3.5 h-3.5 text-signal-orange"
            strokeWidth={2.6}
          />
        </motion.span>
      ))}

      {/* dots running the ring */}
      {RUNNERS.map((r) => (
        <motion.span
          key={`run-${r.start}`}
          aria-hidden
          className="absolute rounded-full pointer-events-none"
          style={{ inset: "28%" }}
          initial={{ rotate: r.start }}
          animate={{ rotate: r.start + 360 }}
          transition={{ duration: LAP, repeat: Infinity, ease: "linear" }}
        >
          <motion.span
            className="absolute left-1/2 -translate-x-1/2 -top-[14px] flex items-center justify-center w-7 h-7 rounded-full"
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(255,106,0,0.35)",
              boxShadow: "0 6px 18px -8px rgba(255,106,0,0.6)",
            }}
            initial={{ rotate: -r.start }}
            animate={{ rotate: -r.start - 360 }}
            transition={{ duration: LAP, repeat: Infinity, ease: "linear" }}
          >
            <r.Icon
              className="w-[14px] h-[14px] text-signal-orange"
              strokeWidth={2.2}
            />
          </motion.span>
        </motion.span>
      ))}

      {/* the core */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="flex flex-col items-center justify-center w-[124px] h-[124px] rounded-full"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(255,106,0,0.30)",
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.02), 0 18px 44px -24px rgba(0,0,0,0.18)",
          }}
        >
          <span className="text-signal-orange text-[13px] leading-none">✦</span>
          <span className="mt-2 text-[15px] font-bold text-carbon tracking-[-0.02em]">
            RAMS
          </span>
          <span className="mt-1 text-[8px] font-mono font-bold tracking-[0.22em] uppercase text-graphite/40">
            Intelligence
          </span>
        </div>
      </div>

      {/* the five stages */}
      {STAGES.map((s, i) => {
        const on = i === active;
        return (
          <div
            key={s.k}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-[132px] px-3.5 py-3"
            style={{
              ...POS[i],
              borderRadius: 10,
              background: "#FFFFFF",
              border: `1px solid ${on ? "rgba(255,106,0,0.45)" : LINE}`,
              boxShadow: on
                ? "0 1px 2px rgba(0,0,0,0.02), 0 14px 34px -18px rgba(255,106,0,0.45)"
                : "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -14px rgba(0,0,0,0.10)",
              transition: "border-color 0.4s ease, box-shadow 0.4s ease",
            }}
          >
            <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-carbon">
              {s.k}
            </p>
            <p className="mt-1 text-[9.5px] font-mono text-graphite/45 leading-[1.4]">
              {s.sub}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function AimsLoop() {
  return (
    <Section surface="white" id="decision-loop">
      <SectionHeader
        eyebrow="Management decision loop"
        top="Turn every signal"
        bottom="Into a closed-loop action."
        body="Management Intelligence connects field evidence to a repeatable decision cycle. Every issue stays visible until the right action is taken, closed and verified — not merely reported."
        size="compact"
        width="wide"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-center max-w-[1240px] mx-auto">
        {/* what the loop gives management */}
        <div className="flex flex-col">
          {OUTCOMES.map((o, i) => (
            <motion.div
              key={o.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              className="flex gap-4 py-7 first:pt-0 last:pb-0"
              style={{ borderTop: i === 0 ? "none" : `1px solid ${LINE}` }}
            >
              <o.Icon
                className="w-[18px] h-[18px] text-signal-orange shrink-0 mt-[3px]"
                strokeWidth={2}
                aria-hidden
              />
              <div className="min-w-0">
                <h3 className="text-[18px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
                  {o.title}
                </h3>
                <p className="mt-2.5 text-[14px] text-graphite/65 leading-[1.6]">
                  {o.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* the cycle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <Ring />
        </motion.div>
      </div>
    </Section>
  );
}
