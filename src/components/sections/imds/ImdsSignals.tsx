"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowsUpFromLine,
  BatteryCharging,
  Clock,
  ShieldAlert,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Five signals can raise a work order.
 *
 * The bento from the driving section: a widget band on top carrying the
 * reading itself, then the name and what it means underneath. Two cards wide,
 * then three — so the two signals with a hard numeric threshold get the room
 * to show it and the three qualitative ones stay compact.
 *
 * The caveat is the document's and stays: IMDS applies configured rules to
 * real usage, it does not predict component failure.
 */

const LINE = "#E8E8ED";

/* ── one clock, five live widgets ────────────────────────────
   Same approach as the driving bento: a single tick drives every card, so
   the five instruments advance together rather than each looping out of
   phase. Every series is deterministic — no randomness, nothing to
   mismatch on hydration.                                                */

const TICK_MS = 70;

function useTick(paused: boolean) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setT((v) => v + 1), TICK_MS);
    return () => clearInterval(id);
  }, [paused]);
  return t;
}

/* Fixed precision everywhere a number reaches the DOM. Node and the browser
   serialise the tail of a float differently, which React reports as a
   hydration mismatch it will not patch up. */
const fx = (n: number) => n.toFixed(3);

/** A wrapping window into a series, so the trace scrolls without end. */
const windowOf = <T,>(a: T[], start: number, len: number) =>
  Array.from({ length: len }, (_, i) => a[(start + i) % a.length]);

const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/* ── the series ──────────────────────────────────────────── */

/** Run-hours accumulating across shifts. */
const USAGE = Array.from({ length: 90 }, (_, i) =>
  Math.max(
    0.12,
    0.55 +
      0.32 * Math.sin(i / 7) +
      0.16 * Math.sin(i / 2.6) +
      0.1 * Math.sin(i / 17),
  ),
);

/** Every pick and place, at the height it happened. */
const LIFTS = Array.from({ length: 70 }, (_, i) => {
  const h =
    0.25 + 0.5 * Math.abs(Math.sin(i / 3.7)) + 0.3 * Math.abs(Math.sin(i / 11));
  return Math.min(1, h);
});

/** Mostly quiet, a warning that keeps coming back, then an escalation. */
const FAULTS = Array.from({ length: 48 }, (_, i) =>
  i % 11 === 0 ? 2 : i % 4 === 0 ? 1 : 0,
);

const WIDGET_H = 54;

/* ── the instruments ─────────────────────────────────────── */

/** Usage accumulating, with the reading riding the curve. */
function UsageTrace({ t }: { t: number }) {
  const N = 46;
  const win = windowOf(USAGE, t, N);
  const w = 300;
  const pts = win
    .map(
      (v, i) =>
        `${fx((i / (N - 1)) * w)},${fx(WIDGET_H - 4 - v * (WIDGET_H - 12))}`,
    )
    .join(" ");
  const headY = Number(fx(WIDGET_H - 4 - win[N - 1] * (WIDGET_H - 12)));

  return (
    <svg
      viewBox={`0 0 ${w} ${WIDGET_H}`}
      className="block w-full"
      style={{ height: WIDGET_H }}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="imdssig-usage" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF6A00" stopOpacity={0.22} />
          <stop offset="100%" stopColor="#FF6A00" stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${WIDGET_H} ${pts} ${w},${WIDGET_H}`}
        fill="url(#imdssig-usage)"
      />
      <polyline
        points={pts}
        fill="none"
        stroke="#FF6A00"
        strokeWidth={1.6}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={w} cy={headY} r={2.6} fill="#FF6A00" />
    </svg>
  );
}

/** Each bar is one lift, at the height it happened. */
function LiftBars({ t }: { t: number }) {
  const N = 34;
  const win = windowOf(LIFTS, t, N);
  return (
    <span
      className="flex items-end justify-between gap-[3px]"
      style={{ height: WIDGET_H }}
      aria-hidden
    >
      {win.map((v, i) => (
        <span
          key={i}
          className="flex-1 rounded-full"
          style={{
            height: `${fx(6 + v * (WIDGET_H - 8))}px`,
            background: "#FF6A00",
            opacity: Number(fx(0.25 + v * 0.6)),
          }}
        />
      ))}
    </span>
  );
}

/** A recurring warning scrolling past, escalating where it repeats. */
function FaultStream({ t }: { t: number }) {
  const N = 26;
  const win = windowOf(FAULTS, t, N);
  return (
    <span
      className="flex items-center justify-between gap-[3px]"
      style={{ height: WIDGET_H }}
      aria-hidden
    >
      {win.map((v, i) => (
        <span
          key={i}
          className="flex-1 rounded-full"
          style={{
            height: v === 2 ? 30 : v === 1 ? 16 : 4,
            background: v === 2 ? "#FF6A00" : v === 1 ? "#D9A21B" : "#E4E4E9",
          }}
        />
      ))}
    </span>
  );
}

/** Charge and discharge, running continuously. */
function BatteryWave({ t }: { t: number }) {
  const N = 60;
  const w = 300;
  const pts = Array.from({ length: N }, (_, i) => {
    const x = (i / (N - 1)) * w;
    const v = Math.sin((i + t) / 4.4) * 0.6 + Math.sin((i + t) / 11) * 0.4;
    return `${fx(x)},${fx(WIDGET_H / 2 - v * (WIDGET_H / 2 - 6))}`;
  }).join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${WIDGET_H}`}
      className="block w-full"
      style={{ height: WIDGET_H }}
      preserveAspectRatio="none"
      aria-hidden
    >
      <line
        x1={0}
        y1={WIDGET_H / 2}
        x2={w}
        y2={WIDGET_H / 2}
        stroke="#E4E4E9"
        strokeDasharray="3 4"
        vectorEffect="non-scaling-stroke"
      />
      <polyline
        points={pts}
        fill="none"
        stroke="#FF6A00"
        strokeWidth={1.6}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Impacts arriving from RTSS, climbing. */
const IMPACTS = [
  ["MHE 04", "Aisle 07"],
  ["MHE 01", "Cross-aisle A"],
  ["MHE 09", "Dock approach"],
  ["MHE 07", "Aisle 03"],
];

function ImpactFeed({ still }: { still: boolean }) {
  return (
    <span
      className="relative block overflow-hidden"
      style={{
        height: WIDGET_H,
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, #000 22%, #000 78%, transparent 100%)",
        maskImage:
          "linear-gradient(to bottom, transparent 0%, #000 22%, #000 78%, transparent 100%)",
      }}
      aria-hidden
    >
      <span className={still ? "block" : "imdssig-feed"}>
        {(still ? [0] : [0, 1]).map((copy) => (
          <span key={copy} className="block">
            {IMPACTS.map((im) => (
              <span
                key={copy + im[0] + im[1]}
                className="flex items-center gap-2 h-[22px]"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: "#C6413A" }}
                />
                <span className="text-[10.5px] font-mono text-carbon">
                  {im[0]}
                </span>
                <span className="ml-auto text-[10px] font-mono text-graphite/40 truncate">
                  {im[1]}
                </span>
              </span>
            ))}
          </span>
        ))}
      </span>
    </span>
  );
}

type Signal = {
  Icon: LucideIcon;
  title: string;
  value: string;
  unit?: string;
  /** The live reading against the threshold above it. */
  now?: number;
  scale?: string;
  /** Which instrument this card runs. */
  live: "usage" | "lifts" | "faults" | "battery" | "impact";
  body: string;
  wide?: boolean;
};

const SIGNALS: Signal[] = [
  {
    Icon: Clock,
    title: "Operating hours",
    value: "250",
    unit: "h",
    live: "usage",
    now: 238,
    scale: "MHE 01 · run-hours",
    body: "Actual run-hours from MEPS, not the OEM hour meter and not the calendar.",
    wide: true,
  },
  {
    Icon: ArrowsUpFromLine,
    title: "Lift cycles & height",
    value: "10,000",
    live: "lifts",
    now: 8410,
    scale: "MHE 01 · lifts",
    body: "Every pick and place counted — and the height it happened at, because a lift to nine metres is not the same job as a lift to one.",
    wide: true,
  },
  {
    Icon: TriangleAlert,
    title: "Fault codes",
    value: "Pattern",
    live: "faults",
    body: "A recurring warning raises a work order before it becomes a critical fault.",
  },
  {
    Icon: BatteryCharging,
    title: "Battery",
    value: "Amps & volts",
    live: "battery",
    body: "Measured electrical behaviour — charge cycles, depth of discharge and abnormal patterns on electric fleets.",
  },
  {
    Icon: ShieldAlert,
    title: "Impact events",
    value: "From RTSS",
    live: "impact",
    body: "A recorded impact can open an inspection on the machine, not only on the rack.",
  },
];

export function ImdsSignals() {
  const reduce = useReducedMotion();
  const still = !!reduce;
  const t = useTick(still);

  return (
    <Section surface="warm" id="signals">
      <style>{`
        @property --imdssig-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .imdssig-card { position: relative; isolation: isolate; }
        .imdssig-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--imdssig-shine-angle),
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
        .imdssig-card:hover::before {
          opacity: 1;
          animation: imdssig-shine 2.4s linear infinite;
        }
        @keyframes imdssig-shine {
          to { --imdssig-shine-angle: 360deg; }
        }
        @keyframes imdssig-feed-run {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
        .imdssig-feed { display: block; animation: imdssig-feed-run 7s linear infinite; }
        .imdssig-card:hover .imdssig-feed { animation-play-state: paused; }

        @media (prefers-reduced-motion: reduce) {
          .imdssig-card:hover::before { animation: none; }
          .imdssig-feed { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Work order triggers"
        top="Five signals can raise a work order."
        size="compact"
        width="wide"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 max-w-[1180px] mx-auto">
        {SIGNALS.map((s, i) => (
          <motion.article
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
            className={
              "imdssig-card flex flex-col p-6 sm:p-7 bg-white transition-transform duration-300 hover:-translate-y-1 " +
              (s.wide ? "sm:col-span-2 lg:col-span-3" : "lg:col-span-2")
            }
            style={{
              borderRadius: 16,
              border: `1px solid ${LINE}`,
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
            }}
          >
            {/* the reading */}
            <div className="flex items-center justify-between gap-3">
              <span
                className="w-10 h-10 rounded-[11px] flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(255,106,0,0.08)",
                  border: "1px solid rgba(255,106,0,0.2)",
                }}
              >
                <s.Icon
                  className="w-[18px] h-[18px] text-signal-orange"
                  strokeWidth={1.8}
                  aria-hidden
                />
              </span>

              <span className="flex items-baseline gap-1.5">
                <span className="font-rams-heading text-[28px] sm:text-[32px] font-bold tabular-nums tracking-[-0.035em] leading-none text-carbon">
                  {s.value}
                </span>
                {s.unit && (
                  <span className="text-[13px] font-mono text-graphite/45">
                    {s.unit}
                  </span>
                )}
              </span>
            </div>

            {/* the instrument */}
            <div className="mt-5">
              {s.live === "usage" && <UsageTrace t={t} />}
              {s.live === "lifts" && <LiftBars t={t} />}
              {s.live === "faults" && <FaultStream t={t} />}
              {s.live === "battery" && <BatteryWave t={t} />}
              {s.live === "impact" && <ImpactFeed still={still} />}

              {s.now !== undefined && (
                <p className="mt-3 flex items-center justify-between gap-3 text-[9.5px] font-mono tracking-[0.12em] uppercase text-graphite/35">
                  <span>{s.scale}</span>
                  <span className="tabular-nums text-signal-orange">
                    {fmt(s.now)}
                    {s.unit ? ` ${s.unit}` : ""}
                  </span>
                </p>
              )}
            </div>

            <h3 className="mt-6 text-[19px] sm:text-[20px] font-bold tracking-[-0.022em] leading-[1.2] text-carbon">
              {s.title}
            </h3>
            <p className="mt-2.5 text-[13.5px] text-graphite/60 leading-[1.6]">
              {s.body}
            </p>
          </motion.article>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.65, ease: EASE }}
        className="mt-12 sm:mt-14 text-center text-[12px] font-mono text-graphite/50 leading-[1.7] max-w-[92ch] mx-auto"
      >
        Thresholds are configured per machine type, per site and per OEM
        guidance. IMDS applies the rules you set against real usage — it does
        not predict component failure on its own.
      </motion.p>
    </Section>
  );
}
