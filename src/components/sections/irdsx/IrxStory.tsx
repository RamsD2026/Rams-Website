"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE } from "./irdsx-shared";

/**
 * 02 — One cycle, end to end.
 *
 * The storyline, told as a swimlane rather than a rail. Two tracks — the
 * console at the desk and the field app at the rack — and one line that drops
 * from one to the other and back. The handoffs are the story: the method is
 * defined and scheduled at a desk, the audit happens on the floor, and the
 * judgement, the proof and the comparison happen at a desk again.
 *
 * A single rail could not say that. Seven equal steps in a row imply seven
 * equal places, and the whole point of this product is that step three and
 * step four are somewhere else, on something else, held by someone else.
 *
 * One fixed canvas, everything placed by coordinate. Console lane at y 110,
 * field lane at y 250, beats at x 170 … 1100 at 155px pitch, and the lane
 * labels occupy x 20–140 with 30px of clearance to the first beat.
 */

const LINE = "rgba(255,255,255,0.10)";
const ORANGE = "#FF6A00";
const BLUE = "#5B8DEF";

const W = 1232;
const H = 360;
const CONSOLE_Y = 110;
const FIELD_Y = 250;
/* Beats start at 225, not 170: the lane labels occupy x 0–130 and a beat's
   text card is 150 wide, so at 170 the first card ran back to x 95 and sat
   under the label. At 225 it starts at 150, clearing it by 20px, and the
   last card still ends at 1212 inside the 1232 canvas. */
const X0 = 225;
const PITCH = 152;

type Beat = {
  n: string;
  k: string;
  line: string;
  lane: "console" | "field";
};

const BEATS: Beat[] = [
  {
    n: "01",
    k: "Define",
    line: "The method, as configuration",
    lane: "console",
  },
  {
    n: "02",
    k: "Schedule",
    line: "Cycle, scope and the team",
    lane: "console",
  },
  {
    n: "03",
    k: "Inspect",
    line: "Bay by bay, at the rack",
    lane: "field",
  },
  {
    n: "04",
    k: "Measure",
    line: "Structured test readings",
    lane: "field",
  },
  {
    n: "05",
    k: "Resolve",
    line: "Severity, owner, repair",
    lane: "console",
  },
  {
    n: "06",
    k: "Prove",
    line: "Evidence, then closure",
    lane: "console",
  },
  {
    n: "07",
    k: "Compare",
    line: "This cycle against the last",
    lane: "console",
  },
];

const x = (i: number) => X0 + i * PITCH;
const y = (b: Beat) => (b.lane === "console" ? CONSOLE_Y : FIELD_Y);

/**
 * The single run through all seven, dropping to the field lane for beats
 * three and four and climbing back for five. Written out rather than
 * generated so the curve shoulders can be tuned by eye.
 */
const PATH =
  `M${x(0)} ${CONSOLE_Y} H${x(1)} ` +
  `C ${x(1) + 76} ${CONSOLE_Y}, ${x(2) - 76} ${FIELD_Y}, ${x(2)} ${FIELD_Y} ` +
  `H${x(3)} ` +
  `C ${x(3) + 76} ${FIELD_Y}, ${x(4) - 76} ${CONSOLE_Y}, ${x(4)} ${CONSOLE_Y} ` +
  `H${x(6)}`;

function LaneLabel({
  label,
  sub,
  top,
  tint,
}: {
  label: string;
  sub: string;
  top: number;
  tint: string;
}) {
  return (
    <div
      className="absolute -translate-y-1/2 w-[130px]"
      style={{ left: 0, top }}
    >
      <p
        className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase"
        style={{ color: tint }}
      >
        {label}
      </p>
      <p className="mt-1.5 text-[11px] leading-[1.4] text-white/35">{sub}</p>
    </div>
  );
}

export function IrxStory() {
  return (
    <Section surface="ink" id="story">
      <SectionHeader
        eyebrow="The storyline"
        top="Two products,"
        bottom="One inspection cycle."
        tone="dark"
        size="compact"
        width="wide"
        body="A cycle starts and ends at a desk and happens on the floor. IRDS is the console that defines, judges and proves it, and the tablet app that captures it — both writing to the same record."
      />

      {/* ── the swimlane ───────────────────────────────── */}
      <div className="hidden lg:block relative w-full" style={{ height: H }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          aria-hidden
        >
          {/* the two lanes */}
          {[CONSOLE_Y, FIELD_Y].map((ly) => (
            <line
              key={ly}
              x1={150}
              x2={W - 20}
              y1={ly}
              y2={ly}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          ))}

          {/* the run */}
          <path
            d={PATH}
            fill="none"
            stroke="rgba(255,106,0,0.45)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <motion.path
            d={PATH}
            fill="none"
            stroke={ORANGE}
            strokeWidth="1.8"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.8, ease: EASE }}
          />

          {/* the cycle running */}
          <circle r="4" fill={ORANGE}>
            <animateMotion
              path={PATH}
              dur="9s"
              repeatCount="indefinite"
              calcMode="spline"
              keyPoints="0;1"
              keyTimes="0;1"
              keySplines="0.4 0 0.2 1"
            />
          </circle>
        </svg>

        <LaneLabel
          label="Console"
          sub="At the desk"
          top={CONSOLE_Y}
          tint={ORANGE}
        />
        <LaneLabel
          label="Field app"
          sub="At the rack"
          top={FIELD_Y}
          tint={BLUE}
        />

        {/* the beats */}
        {BEATS.map((b, i) => {
          const field = b.lane === "field";
          const tint = field ? BLUE : ORANGE;
          return (
            <motion.div
              key={b.n}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-[150px] text-center"
              style={{ left: `${((x(i) / W) * 100).toFixed(3)}%`, top: y(b) }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.25 + i * 0.11, ease: EASE }}
            >
              {/* Copy sits away from the other lane: console beats read
                  upward, field beats downward. */}
              <div
                className={
                  "absolute left-1/2 -translate-x-1/2 w-[150px] " +
                  (field ? "top-[26px]" : "bottom-[26px]")
                }
              >
                <p className="text-[13px] font-bold tracking-[-0.01em] text-white">
                  {b.k}
                </p>
                <p className="mt-1 text-[11px] leading-[1.45] text-white/40">
                  {b.line}
                </p>
              </div>

              <span
                className="inline-flex items-center justify-center w-[30px] h-[30px] rounded-full"
                style={{
                  background: "#0C0C0F",
                  border: `1.5px solid ${tint}`,
                  boxShadow: `0 0 22px -8px ${tint}`,
                }}
              >
                <span
                  className="text-[9.5px] font-mono font-bold tabular-nums"
                  style={{ color: tint }}
                >
                  {b.n}
                </span>
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Below lg the swimlane becomes a list — two lanes crossing at 155px
          pitch has nowhere to go on a phone. */}
      <div className="lg:hidden flex flex-col">
        {BEATS.map((b, i) => {
          const field = b.lane === "field";
          const tint = field ? BLUE : ORANGE;
          return (
            <div
              key={b.n}
              className="flex items-start gap-4 py-4"
              style={{ borderTop: i === 0 ? "none" : `1px solid ${LINE}` }}
            >
              <span
                className="mt-0.5 flex items-center justify-center w-[28px] h-[28px] rounded-full shrink-0"
                style={{ border: `1.5px solid ${tint}`, background: "#0C0C0F" }}
              >
                <span
                  className="text-[9.5px] font-mono font-bold tabular-nums"
                  style={{ color: tint }}
                >
                  {b.n}
                </span>
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] font-bold text-white">
                  {b.k}
                </span>
                <span className="mt-1 block text-[12.5px] text-white/40">
                  {b.line}
                </span>
                <span
                  className="mt-2 inline-block text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase"
                  style={{ color: tint }}
                >
                  {field ? "Field app" : "Console"}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
