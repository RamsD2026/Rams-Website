"use client";

import { motion } from "framer-motion";
import {
  Gauge,
  Package,
  Radar,
  ShieldAlert,
  Timer,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * What MEPS is.
 *
 * The source document's shape, in the IRDS system: the centred header, the
 * four signals MEPS reads, the funnel bar they feed, and the three outputs
 * that come out.
 *
 * Cards use the treatment in docs/section-header.md — 12px, #E8E8ED, the
 * two-layer shadow, the conic shine on hover, namespaced per section.
 */

const LINE = "#E8E8ED";

const SIGNALS = [
  {
    Icon: Radar,
    q: "Where?",
    title: "LiDAR",
    body: "Indoor location, route, distance, speed, zone and dwell — no GPS dependency.",
  },
  {
    Icon: UserCheck,
    q: "Who?",
    title: "Operator authentication",
    body: "Session identity through the method configured for the site.",
  },
  {
    Icon: Package,
    q: "Load?",
    title: "Pallet detection",
    body: "Whether the machine is carrying material or travelling empty.",
  },
  {
    Icon: Timer,
    q: "When?",
    title: "Movement & time",
    body: "How far, how fast, and how long the machine spent working or waiting.",
  },
];

const OUTPUTS = [
  {
    Icon: TrendingUp,
    ix: "Output 01",
    title: "Productivity",
    body: "How much useful work the fleet is creating — pallets moved, loaded travel, task and asset performance.",
  },
  {
    Icon: Gauge,
    ix: "Output 02",
    title: "Efficiency",
    body: "What that work consumes — time, distance, idle, congestion and fleet capacity.",
  },
  {
    Icon: ShieldAlert,
    ix: "Output 03",
    title: "Basic safety",
    body: "Which speed-related operating patterns deserve attention, by zone, machine and session.",
  },
];

function Arrow() {
  return (
    <span
      aria-hidden
      className="block text-center text-signal-orange text-[16px] leading-none py-3"
    >
      ↓
    </span>
  );
}

export function MepsWhatIs() {
  return (
    <Section surface="white" id="what">
      <style>{`
        @property --mepswhat-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .mepswhat-card { position: relative; isolation: isolate; }
        .mepswhat-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--mepswhat-shine-angle),
            transparent 0deg,
            transparent 300deg,
            rgba(255,106,0,0.9) 340deg,
            transparent 360deg
          );
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
                  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
          z-index: 1;
        }
        .mepswhat-card:hover::before {
          opacity: 1;
          animation: mepswhat-shine 2.4s linear infinite;
        }
        @keyframes mepswhat-shine {
          to { --mepswhat-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mepswhat-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="What MEPS is"
        top="Movement is data."
        bottom="Context turns it into intelligence."
        body="MEPS connects physical MHE movement with operator, load, time and warehouse-location context to understand how the moving operation is actually performing."
        size="compact"
        width="wide"
      />

      {/* ── what it reads ───────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SIGNALS.map((s, i) => (
          <motion.article
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
            className="mepswhat-card flex flex-col p-6 bg-white transition-all duration-300 hover:-translate-y-1"
            style={{
              minHeight: 250,
              borderRadius: 12,
              border: `1px solid ${LINE}`,
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
            }}
          >
            <div
              className="w-11 h-11 flex items-center justify-center mb-7"
              style={{
                borderRadius: 8,
                background: "rgba(255,106,0,0.08)",
                border: "1px solid rgba(255,106,0,0.18)",
              }}
            >
              <s.Icon
                className="w-[20px] h-[20px] text-signal-orange"
                strokeWidth={2}
              />
            </div>

            <p className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange">
              {s.q}
            </p>
            <h3 className="mt-2 text-[19px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
              {s.title}
            </h3>
            <p className="mt-4 text-[14px] text-graphite/65 leading-[1.65]">
              {s.body}
            </p>
          </motion.article>
        ))}
      </div>

      {/* ── what they feed ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.65, ease: EASE }}
        className="my-4"
      >
        <Arrow />
        <div
          className="relative overflow-hidden flex flex-col sm:flex-row items-center justify-center gap-x-5 gap-y-2 px-6 py-6 sm:px-8 bg-white"
          style={{
            borderRadius: 13,
            border: `1px solid ${LINE}`,
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
          }}
        >
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,106,0,0.5), transparent)",
            }}
          />
          <p className="text-[17px] sm:text-[21px] font-bold tracking-[-0.025em] text-carbon text-center">
            MEPS Performance Intelligence
          </p>
          <span
            aria-hidden
            className="hidden sm:block w-px h-4 shrink-0"
            style={{ background: LINE }}
          />
          <span className="text-[9.5px] font-mono font-semibold tracking-[0.16em] uppercase text-signal-orange">
            Digital Twin-led
          </span>
        </div>
        <Arrow />
      </motion.div>

      {/* ── what comes out ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {OUTPUTS.map((o, i) => (
          <motion.article
            key={o.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
            className="mepswhat-card flex flex-col p-6 sm:p-7 bg-white transition-all duration-300 hover:-translate-y-1"
            style={{
              minHeight: 250,
              borderRadius: 12,
              border: `1px solid ${LINE}`,
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
            }}
          >
            <div
              className="w-11 h-11 flex items-center justify-center mb-7"
              style={{
                borderRadius: 8,
                background: "rgba(255,106,0,0.08)",
                border: "1px solid rgba(255,106,0,0.18)",
              }}
            >
              <o.Icon
                className="w-[20px] h-[20px] text-signal-orange"
                strokeWidth={2}
              />
            </div>

            <p className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange">
              {o.ix}
            </p>
            <h3 className="mt-2 text-[21px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
              {o.title}
            </h3>
            <p className="mt-4 text-[14px] text-graphite/65 leading-[1.65]">
              {o.body}
            </p>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
