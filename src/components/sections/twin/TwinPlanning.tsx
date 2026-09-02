"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Value before the first sensor.
 *
 * Six planning questions in a 3-up grid, each card running its own live
 * readout — checks resolving, figures counting, feeds scrolling — the way the
 * RTSS driving bento does. Not diagrams: instruments.
 *
 * One clock at 90ms drives every card, so the grid moves as one thing. Every
 * value is a formula, never Math.random, so the server and the client render
 * the same frame and a second viewing matches the first.
 */

const LINE = "#E8E8ED";
/** Inside the well, where the ground is already tinted. */
const WELL_LINE = "#E4E4E9";
const GREEN = "#16A34A";
const AMBER = "#D9A21B";

const TICK_MS = 90;
/** The band every widget sits in, so the nine cards line up. */
const BAND = 108;

function useTick(still: boolean) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (still) return;
    const id = setInterval(() => setT((v) => v + 1), TICK_MS);
    return () => clearInterval(id);
  }, [still]);
  return t;
}

/** Triangle wave in [0,1] — every loop returns to where it began. */
const wave = (t: number, period: number) => {
  const p = (t % period) / period;
  return p < 0.5 ? p * 2 : 2 - p * 2;
};
const ease = (v: number) => v * v * (3 - 2 * v);

const Row = ({
  k,
  children,
  top,
}: {
  k: string;
  children: React.ReactNode;
  top?: boolean;
}) => (
  <div
    className="flex items-center justify-between gap-3 py-2"
    style={{ borderTop: top ? `1px solid ${WELL_LINE}` : undefined }}
  >
    <span className="text-[10.5px] font-mono text-graphite/45 truncate">
      {k}
    </span>
    {children}
  </div>
);

/* ── the six instruments ─────────────────────────────────── */

/** Three constraints, resolving one after another. */
const CHECKS = ["Aisle width", "Door height", "Column offset"];

function FeasibilityCheck({ t }: { t: number }) {
  const p = wave(t, 96);
  const done = Math.floor(p * 4);
  return (
    <div style={{ height: BAND }} className="flex flex-col justify-center">
      {CHECKS.map((c, i) => {
        const ok = i < done;
        return (
          <Row key={c} k={c} top={i > 0}>
            <span
              className="text-[10px] font-mono font-bold tracking-[0.12em] uppercase tabular-nums transition-colors duration-300"
              style={{ color: ok ? GREEN : "rgba(56,56,62,0.3)" }}
            >
              {ok ? "Pass" : "Checking"}
            </span>
          </Row>
        );
      })}
      <div
        className="flex items-center justify-between gap-3 pt-2.5"
        style={{ borderTop: `1px solid ${WELL_LINE}` }}
      >
        <span className="text-[10px] font-mono font-bold tracking-[0.14em] uppercase text-graphite/40">
          Result
        </span>
        <span
          className="px-2 py-[3px] rounded-full text-[10px] font-mono font-bold tracking-[0.1em] uppercase transition-colors duration-300"
          style={{
            color: done >= 3 ? GREEN : AMBER,
            background:
              done >= 3 ? "rgba(22,163,74,0.10)" : "rgba(217,162,27,0.10)",
          }}
        >
          {done >= 3 ? "It fits" : "Pending"}
        </span>
      </div>
    </div>
  );
}

/** Two layouts, and the travel the change buys back. */
function LayoutDelta({ t }: { t: number }) {
  const p = ease(wave(t, 88));
  const now = [46, 62, 54, 70];
  const next = [30, 41, 36, 44];
  const travel = 1420 - Math.round(p * 380);
  return (
    <div style={{ height: BAND }} className="flex flex-col justify-center">
      <div className="flex items-end gap-[5px] h-[48px]">
        {now.map((n, i) => {
          const h = n + (next[i] - n) * p;
          return (
            <span key={i} className="flex-1 flex flex-col justify-end h-full">
              <span
                className="w-full rounded-t-[2px]"
                style={{
                  height: `${h.toFixed(1)}%`,
                  background: "rgba(8,8,10,0.12)",
                }}
              />
            </span>
          );
        })}
        {next.map((n, i) => (
          <span
            key={`n${i}`}
            className="flex-1 flex flex-col justify-end h-full"
          >
            <span
              className="w-full rounded-t-[2px] bg-signal-orange"
              style={{ height: `${(n * p).toFixed(1)}%`, opacity: 0.85 }}
            />
          </span>
        ))}
      </div>

      <div className="mt-4">
        <Row k="Travel per shift" top>
          <span className="text-[13px] font-mono font-semibold tabular-nums text-signal-orange">
            {travel} m
          </span>
        </Row>
      </div>
    </div>
  );
}

/** The aisle, measured against what drives down it. */
function ClearanceGauge({ t }: { t: number }) {
  const p = ease(wave(t, 76));
  const m = 2.4 + p * 1.6;
  const ok = m >= 3.2;
  return (
    <div style={{ height: BAND }} className="flex flex-col justify-center">
      <p className="flex items-baseline gap-2">
        <span
          className="font-rams-heading text-[30px] font-bold tabular-nums tracking-[-0.035em] leading-none transition-colors duration-300"
          style={{ color: ok ? GREEN : AMBER }}
        >
          {m.toFixed(2)}
        </span>
        <span className="text-[11px] font-mono text-graphite/45">m clear</span>
        <span
          className="ml-auto text-[10px] font-mono font-bold tracking-[0.12em] uppercase transition-colors duration-300"
          style={{ color: ok ? GREEN : AMBER }}
        >
          {ok ? "Sufficient" : "Below min"}
        </span>
      </p>

      <span
        className="relative block h-1.5 rounded-full mt-5 overflow-hidden"
        style={{ background: "#EBEBEF" }}
      >
        <span
          className="absolute inset-y-0 left-0 rounded-full transition-colors duration-300"
          style={{
            width: `${(((m - 2) / 2.4) * 100).toFixed(1)}%`,
            background: ok ? GREEN : AMBER,
          }}
        />
        {/* the minimum the equipment actually needs */}
        <span
          className="absolute inset-y-0 w-px bg-carbon/40"
          style={{ left: "50%" }}
        />
      </span>

      <Row k="Minimum for reach truck" top={false}>
        <span className="text-[11px] font-mono tabular-nums text-graphite/50">
          3.20 m
        </span>
      </Row>
    </div>
  );
}

/** What new infrastructure costs the floor it lands on. */
function ExpansionCount({ t }: { t: number }) {
  const p = wave(t, 96);
  const added = Math.round(p * 5);
  const displaced = Math.round(p * 2);
  return (
    <div style={{ height: BAND }} className="flex flex-col justify-center">
      <div className="flex items-end gap-5">
        <span>
          <span className="block text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase text-graphite/40">
            Bays added
          </span>
          <span className="block mt-1.5 font-rams-heading text-[28px] font-bold tabular-nums tracking-[-0.035em] leading-none text-signal-orange">
            +{added}
          </span>
        </span>
        <span>
          <span className="block text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase text-graphite/40">
            Displaced
          </span>
          <span className="block mt-1.5 font-rams-heading text-[28px] font-bold tabular-nums tracking-[-0.035em] leading-none text-carbon">
            {displaced}
          </span>
        </span>
      </div>

      <div className="flex items-end gap-1.5 h-[34px] mt-5">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="flex-1 rounded-[2px] transition-opacity duration-300"
            style={{
              height: `${44 + i * 12}%`,
              background: "#FF6A00",
              opacity: i < added ? 0.85 : 0.12,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/** The route, arriving one leg at a time. */
const LEGS = [
  ["Dock 2 → Aisle 3", "4.2 km/h"],
  ["Aisle 3 → Cross-aisle", "3.6 km/h"],
  ["Cross-aisle → Aisle 7", "4.8 km/h"],
  ["Aisle 7 → Staging", "3.1 km/h"],
];

function MovementFeed({ still }: { still: boolean }) {
  return (
    <div
      style={{
        height: BAND,
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, #000 20%, #000 80%, transparent 100%)",
        maskImage:
          "linear-gradient(to bottom, transparent 0%, #000 20%, #000 80%, transparent 100%)",
      }}
      className="relative overflow-hidden"
    >
      <div className={still ? "block" : "twinplan-feed"}>
        {(still ? [0] : [0, 1]).map((copy) => (
          <div key={copy}>
            {LEGS.map(([leg, speed]) => (
              <div
                key={copy + leg}
                className="flex items-center justify-between gap-3 h-[27px]"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-signal-orange shrink-0" />
                  <span className="text-[11px] font-mono text-carbon truncate">
                    {leg}
                  </span>
                </span>
                <span className="text-[11px] font-mono tabular-nums text-graphite/45 shrink-0">
                  {speed}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Zones, designed rather than improvised. */
const ZONE_CHIPS: [string, string][] = [
  ["Pedestrian", GREEN],
  ["Restricted", "#C6413A"],
  ["Operational", "#FF6A00"],
  ["Charging", AMBER],
  ["Staging", "#6E7B8B"],
];

function ZoneStrip({ still }: { still: boolean }) {
  /* Two rows travelling opposite ways, so the strip reads as a floor being
     laid out rather than a list being ticked off. */
  const rows = [ZONE_CHIPS, [...ZONE_CHIPS].reverse()];

  return (
    <div
      style={{
        height: BAND,
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%)",
        maskImage:
          "linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%)",
      }}
      className="flex flex-col justify-center gap-3 overflow-hidden"
    >
      {rows.map((row, r) => (
        <div key={r} className="relative overflow-hidden">
          <div
            className={
              "flex w-max gap-1.5 " +
              (still ? "" : r === 0 ? "twinplan-marq-l" : "twinplan-marq-r")
            }
          >
            {(still ? [0] : [0, 1]).map((copy) =>
              row.map(([z, c]) => (
                <span
                  key={`${copy}-${z}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full text-[10.5px] whitespace-nowrap"
                  style={{
                    border: `1px solid ${c}44`,
                    background: `${c}12`,
                    color: c,
                  }}
                >
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{ background: c }}
                  />
                  {z}
                </span>
              )),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── the grid ────────────────────────────────────────────── */

const CARDS = [
  {
    title: "Feasibility checks",
    body: "Can it physically fit? Answered against the building as it actually is, not as it was drawn.",
  },
  {
    title: "Layout changes",
    body: "What happens if racks, machines, staging or work areas move — before the crew arrives.",
  },
  {
    title: "Clearance checks",
    body: "Are working and movement clearances sufficient for the equipment that actually operates there.",
  },
  {
    title: "Expansion planning",
    body: "Whether new infrastructure can be accommodated, and what it displaces if it is.",
  },
  {
    title: "MHE movement checks",
    body: "Whether equipment can safely and practically operate in the proposed geometry.",
  },
  {
    title: "Safety zone planning",
    body: "Where pedestrian, restricted and operational zones should sit — designed, not improvised.",
  },
];

export function TwinPlanning() {
  const still = useReducedMotion() ?? false;
  const t = useTick(still);

  const widgets = [
    <FeasibilityCheck key="a" t={t} />,
    <LayoutDelta key="b" t={t} />,
    <ClearanceGauge key="c" t={t} />,
    <ExpansionCount key="d" t={t} />,
    <MovementFeed key="e" still={still} />,
    <ZoneStrip key="f" still={still} />,
  ];

  return (
    <Section surface="white" id="plan">
      <style>{`
        @property --twinplan-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .twinplan-card { position: relative; isolation: isolate; }
        .twinplan-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--twinplan-shine-angle),
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
        .twinplan-card:hover::before {
          opacity: 1;
          animation: twinplan-shine 2.4s linear infinite;
        }
        @keyframes twinplan-shine {
          to { --twinplan-shine-angle: 360deg; }
        }
        @keyframes twinplan-feed-run {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
        .twinplan-feed { display: block; animation: twinplan-feed-run 8s linear infinite; }

        @keyframes twinplan-marq-l {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes twinplan-marq-r {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .twinplan-marq-l { animation: twinplan-marq-l 16s linear infinite; }
        .twinplan-marq-r { animation: twinplan-marq-r 16s linear infinite; }
        .twinplan-card:hover .twinplan-marq-l,
        .twinplan-card:hover .twinplan-marq-r { animation-play-state: paused; }
        .twinplan-card:hover .twinplan-feed { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .twinplan-card:hover::before { animation: none; }
          .twinplan-feed,
          .twinplan-marq-l,
          .twinplan-marq-r { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Value before the first sensor"
        top="Test the change digitally"
        bottom="Before you make it physically."
        body="Before a single device is connected, the Digital Twin is already a working engineering and planning environment. Most facilities change their layout every year and commit to it on a drawing and a conversation."
        size="compact"
        width="wide"
        bodyWidth="wide"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[1180px] mx-auto">
        {CARDS.map((c, i) => (
          <motion.article
            key={c.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.07, ease: EASE }}
            className="twinplan-card overflow-hidden flex flex-col p-6 bg-white"
            style={{ borderRadius: 14, border: `1px solid ${LINE}` }}
          >
            {/* the instrument first, in its own well so it does not
                dissolve into the card */}
            <div
              className="px-4 py-3"
              style={{ borderRadius: 10, background: "#FAFAFB" }}
            >
              {widgets[i]}
            </div>

            <h3 className="mt-6 font-rams-heading text-[18px] font-bold tracking-[-0.02em] leading-[1.2] text-carbon">
              {c.title}
            </h3>

            <p className="mt-2.5 text-[13px] leading-[1.6] text-graphite/60">
              {c.body}
            </p>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
