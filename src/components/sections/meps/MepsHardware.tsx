"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * What powers MEPS.
 *
 * The source document's own composition: two signals down the left, two down
 * the right, and the diagram between them — one MHE carrying four signals,
 * feeding MEPS, feeding five outputs.
 *
 * The diagram is the original's geometry (360×470), animated rather than
 * static: the four signal leads flow inward, the two connectors flow down,
 * and the five outputs light in sequence. All of it stops under
 * prefers-reduced-motion.
 */

const LINE = "#E8E8ED";

const OUTPUTS = [
  "LIVE COMMAND CENTRE",
  "PRODUCTIVITY",
  "EFFICIENCY",
  "BASIC SAFETY",
  "HISTORICAL & SPATIAL",
];

const LEFT = [
  {
    q: "Where?",
    title: "LiDAR",
    body: "Indoor location and movement context — through dust, low light and high racking, without GPS dependency.",
    tags: ["Location", "Route", "Distance", "Speed", "Zone", "Dwell"],
  },
  {
    q: "Load?",
    title: "Pallet Detection Sensor",
    body: "Fork-mounted load-state context — what separates travel that moves material from travel that does not.",
    tags: ["Loaded vs empty", "Idle with load", "Pallet cycles"],
  },
];

const RIGHT = [
  {
    q: "Who?",
    title: "Operator Authentication",
    body: "Session identity through the method configured for the site — biometric, driver-facing camera or another approved method.",
    tags: ["Attribution", "Session identity", "Operator–MHE pairing"],
  },
  {
    q: "Connect & process",
    title: "OmniBox Motion",
    body: "The moving-asset intelligence gateway. It connects the machine and its signals to RAMS, processes locally and keeps the data flowing.",
    tags: ["Sensor integration", "MHE identity", "Local processing", "Sync"],
  },
];

/** The four signal leads, in the original's geometry. */
const LEADS = [
  "M96 96 L60 96 L60 62",
  "M264 96 L300 96 L300 62",
  "M96 176 L60 176 L60 210",
  "M264 176 L300 176 L300 210",
];

function Item({
  q,
  title,
  body,
  tags,
  align,
}: {
  q: string;
  title: string;
  body: string;
  tags: string[];
  align: "left" | "right";
}) {
  const right = align === "right";
  return (
    <div className={right ? "lg:text-right" : ""}>
      <p className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange">
        {q}
      </p>
      <h3 className="mt-2 text-[20px] sm:text-[22px] font-bold text-carbon leading-[1.2] tracking-[-0.022em]">
        {title}
      </h3>
      <p className="mt-3 text-[14px] text-graphite/65 leading-[1.65]">{body}</p>
      <div
        className={
          "mt-5 flex flex-wrap gap-2 " + (right ? "lg:justify-end" : "")
        }
      >
        {tags.map((t) => (
          <span
            key={t}
            className="px-2.5 py-1 text-[11px] font-medium text-graphite/70 whitespace-nowrap"
            style={{ borderRadius: 999, border: `1px solid ${LINE}` }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * One MHE · four signals → MEPS → five outputs.
 *
 * Flow is a marching dash on each lead; the outputs cycle a highlight so the
 * five read as things MEPS produces rather than a static list.
 */
function Diagram() {
  const reduce = useReducedMotion();
  const [lit, setLit] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setLit((v) => (v + 1) % OUTPUTS.length), 1100);
    return () => clearInterval(id);
  }, [reduce]);

  const flow = reduce
    ? {}
    : {
        animate: { strokeDashoffset: [0, -24] },
        transition: {
          duration: 1.1,
          repeat: Infinity,
          ease: "linear" as const,
        },
      };

  return (
    <div
      className="relative overflow-hidden p-5 sm:p-6"
      style={{
        borderRadius: 14,
        background:
          "radial-gradient(120% 140% at 50% 0%, #1D1D1F 0%, #0E0E0F 60%, #08080A 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 40px 90px -50px rgba(14,14,15,0.7)",
      }}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,106,0,0.45), transparent)",
        }}
      />

      <svg
        viewBox="0 0 360 470"
        role="img"
        aria-label="Four hardware signals feed MEPS, which produces five intelligence outputs"
        style={{ width: "100%", height: "auto" }}
      >
        {/* the four signal leads, flowing inward */}
        <g fill="none" stroke="rgba(255,106,0,0.45)" strokeWidth={1}>
          {LEADS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <g fill="none" stroke="#FF6A00" strokeWidth={1.4} strokeDasharray="3 9">
          {LEADS.map((d) => (
            <motion.path key={d} d={d} {...flow} />
          ))}
        </g>

        <g fill="rgba(255,106,0,0.9)">
          <circle cx={60} cy={60} r={3} />
          <circle cx={300} cy={60} r={3} />
          <circle cx={60} cy={212} r={3} />
          <circle cx={300} cy={212} r={3} />
        </g>

        <g
          className="font-mono"
          fontSize={8.5}
          fill="rgba(244,242,238,0.55)"
          letterSpacing="0.06em"
        >
          <text x={40} y={46} textAnchor="middle">
            LIDAR
          </text>
          <text x={300} y={46} textAnchor="middle">
            OPERATOR ID
          </text>
          <text x={48} y={232} textAnchor="middle">
            PALLET
          </text>
          <text x={300} y={232} textAnchor="middle">
            OMNIBOX
          </text>
        </g>

        {/* one MHE */}
        <g transform="translate(96,86)">
          <rect
            x={0}
            y={0}
            width={168}
            height={104}
            rx={4}
            fill="#15171C"
            stroke="rgba(244,242,238,0.16)"
          />
          <rect
            x={26}
            y={18}
            width={58}
            height={52}
            rx={3}
            fill="none"
            stroke="rgba(244,242,238,0.4)"
          />
          <path d="M26 18 L26 6 M84 18 L84 6" stroke="rgba(244,242,238,0.4)" />
          <rect
            x={88}
            y={10}
            width={6}
            height={66}
            fill="rgba(255,106,0,0.5)"
          />
          <path
            d="M94 70 L128 70 M94 60 L128 60"
            stroke="#FF6A00"
            strokeWidth={3}
          />
          <circle
            cx={42}
            cy={82}
            r={10}
            fill="none"
            stroke="rgba(244,242,238,0.4)"
            strokeWidth={2}
          />
          <circle
            cx={76}
            cy={82}
            r={7}
            fill="none"
            stroke="rgba(244,242,238,0.4)"
            strokeWidth={2}
          />
          <text
            x={84}
            y={-8}
            textAnchor="middle"
            className="font-mono"
            fontSize={8.5}
            letterSpacing="0.1em"
            fill="rgba(244,242,238,0.45)"
          >
            ONE MHE · FOUR SIGNALS
          </text>
        </g>

        {/* into MEPS */}
        <path
          d="M180 190 L180 232"
          stroke="rgba(255,106,0,0.6)"
          strokeWidth={1.4}
        />
        <motion.path
          d="M180 190 L180 232"
          stroke="#FF6A00"
          strokeWidth={1.4}
          strokeDasharray="3 9"
          {...flow}
        />
        <path d="M175 226 L180 236 L185 226 Z" fill="#FF6A00" />

        <rect
          x={96}
          y={240}
          width={168}
          height={46}
          rx={3}
          fill="rgba(255,106,0,0.12)"
          stroke="rgba(255,106,0,0.55)"
        />
        <text
          x={180}
          y={262}
          textAnchor="middle"
          className="font-rams-heading"
          fontSize={20}
          fontWeight={700}
          fill="#F4F2EE"
        >
          MEPS
        </text>
        <text
          x={180}
          y={277}
          textAnchor="middle"
          className="font-mono"
          fontSize={7.5}
          letterSpacing="0.08em"
          fill="rgba(244,242,238,0.6)"
        >
          MOBILE EQUIPMENT PERFORMANCE SUITE
        </text>

        {/* out to the five */}
        <path
          d="M180 286 L180 306"
          stroke="rgba(255,106,0,0.6)"
          strokeWidth={1.4}
        />
        <motion.path
          d="M180 286 L180 306"
          stroke="#FF6A00"
          strokeWidth={1.4}
          strokeDasharray="3 9"
          {...flow}
        />
        <path d="M175 300 L180 310 L185 300 Z" fill="#FF6A00" />

        {OUTPUTS.map((o, n) => {
          const y = 314 + n * 30;
          const on = !reduce && n === lit;
          return (
            <g key={o}>
              <motion.rect
                x={60}
                y={y}
                width={240}
                height={26}
                rx={2}
                fill="#15171C"
                animate={{
                  stroke: on ? "rgba(255,106,0,0.7)" : "rgba(244,242,238,0.14)",
                }}
                transition={{ duration: 0.35, ease: EASE }}
              />
              <motion.text
                x={180}
                y={y + 17}
                textAnchor="middle"
                className="font-mono"
                fontSize={9}
                letterSpacing="0.08em"
                animate={{ fill: on ? "#FF6A00" : "rgba(244,242,238,0.78)" }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                {o}
              </motion.text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function MepsHardware() {
  return (
    <Section surface="white" id="hardware">
      <SectionHeader
        eyebrow="What powers MEPS"
        top="Four physical signals."
        bottom="One operational picture."
        size="compact"
        width="wide"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px_1fr] gap-10 lg:gap-12 items-center">
        <div className="flex flex-col gap-10 lg:gap-14 order-2 lg:order-1">
          {LEFT.map((s) => (
            <Item key={s.title} {...s} align="right" />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="order-1 lg:order-2"
        >
          <Diagram />
        </motion.div>

        <div className="flex flex-col gap-10 lg:gap-14 order-3">
          {RIGHT.map((s) => (
            <Item key={s.title} {...s} align="left" />
          ))}
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-16 sm:mt-20 text-center font-rams-heading text-[22px] sm:text-[28px] lg:text-[32px] font-bold tracking-[-0.025em] leading-[1.2] text-carbon"
      >
        OmniBox Motion connects the physical MHE to its{" "}
        <span className="text-signal-orange">digital intelligence</span>.
      </motion.p>
    </Section>
  );
}
