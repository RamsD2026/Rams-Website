"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Open by design.
 *
 * The heading offers three ways in and the closing line says they all arrive
 * at the same place, so the section draws exactly that: three sources, three
 * paths, one node. Nothing else — the argument is the shape.
 *
 * Signals run the paths in sequence and land on the twin, which is the only
 * thing on the diagram that is filled.
 */

const LINE = "#E8E8ED";

const SOURCES = ["Our sensors", "Your existing hardware", "Both together"];

/* The three paths, in the plan's own coordinate space. */
const W = 900;
const H = 240;
const Y = [46, 120, 194];
const PATHS = Y.map((y) => `M232 ${y} C330 ${y} 352 120 424 120`);

export function TwinSensors() {
  return (
    <Section surface="white" id="sensors" paddingTop="tight">
      <style>{`
        @keyframes twinsens-run { to { stroke-dashoffset: -28; } }
        .twinsens-run { animation: twinsens-run 1.4s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .twinsens-run { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Open by design"
        top="Use our sensors."
        bottom="Use yours. Or use both."
        body="A closed hardware stack is a short conversation with an operation that has already invested in cameras, PLCs and telemetry. The requirement is not that the sensor is ours. It is that the data lands in the same physical context."
        size="compact"
        width="wide"
        bodyWidth="wide"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="max-w-[1000px] mx-auto overflow-x-auto"
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full h-auto min-w-[620px]"
          role="img"
          aria-label="Three sources of data arriving in one physical context"
        >
          {/* the three ways in */}
          {SOURCES.map((s, i) => (
            <g key={s}>
              <rect
                x={8}
                y={Y[i] - 19}
                width={224}
                height={38}
                rx={19}
                fill="#FFFFFF"
                stroke={LINE}
              />
              <text
                x={120}
                y={Y[i] + 4.5}
                textAnchor="middle"
                fontSize={13}
                fill="#38383E"
                fillOpacity={0.75}
              >
                {s}
              </text>
            </g>
          ))}

          {/* and the paths they take */}
          {PATHS.map((d, i) => (
            <g key={d}>
              <path d={d} fill="none" stroke={LINE} strokeWidth={1.4} />
              <path
                d={d}
                fill="none"
                stroke="#FF6A00"
                strokeWidth={1.6}
                strokeDasharray="5 9"
                className="twinsens-run"
                style={{ animationDelay: `${i * 0.28}s` }}
              />
            </g>
          ))}

          {/* where all three land */}
          <circle cx={470} cy={120} r={46} fill="#FF6A00" fillOpacity={0.07} />
          <circle
            cx={470}
            cy={120}
            r={46}
            fill="none"
            stroke="#FF6A00"
            strokeOpacity={0.25}
          />
          <circle cx={470} cy={120} r={30} fill="#FF6A00" />
          <text
            x={470}
            y={124.5}
            textAnchor="middle"
            fontSize={10}
            fontFamily="ui-monospace, monospace"
            fontWeight={700}
            letterSpacing={1.4}
            fill="#FFFFFF"
          >
            TWIN
          </text>

          <path
            d="M516 120 L636 120"
            fill="none"
            stroke={LINE}
            strokeWidth={1.4}
          />
          <path
            d="M516 120 L636 120"
            fill="none"
            stroke="#FF6A00"
            strokeWidth={1.6}
            strokeDasharray="5 9"
            className="twinsens-run"
          />

          {/* the one thing that matters */}
          <rect x={640} y={98} width={252} height={44} rx={22} fill="#08080A" />
          <text
            x={766}
            y={125}
            textAnchor="middle"
            fontSize={13.5}
            fontWeight={600}
            fill="#FFFFFF"
          >
            Same physical context
          </text>
        </svg>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="max-w-[900px] mx-auto mt-14 sm:mt-16 text-center font-rams-heading text-[24px] sm:text-[32px] font-bold tracking-[-0.032em] leading-[1.22] text-carbon"
      >
        Bring the data into the{" "}
        <span className="text-signal-orange">same physical context</span>.
      </motion.p>
    </Section>
  );
}
