"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BoltIcon,
  CpuChipIcon,
  CubeIcon,
  EyeIcon,
  SignalIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/solid";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 08 — Integrations.
 *
 * Built to `AimsDirection` on the Management Intelligence page: four cards,
 * each carrying a 196px well with a live widget in it, then a title and body
 * underneath. The tokens below — `CARD`, `WELL`, `WidgetHead`, the 110ms tick
 * — are that component's, copied rather than re-derived so the two sections
 * read as one system. Only the subject differs.
 *
 * One interval drives all four widgets. Independent timers drift apart within
 * a minute and the row stops reading as one thing. Nothing is generated —
 * every series is a formula or a written-down array, so the server and the
 * client render the same first frame.
 *
 * The chain strip underneath is the whole point of the section: the twin sits
 * fourth, after the edge has already decided, which is why a response does not
 * wait on a round trip.
 */

const LINE = "#E8E8ED";
const ORANGE = "#FF6A00";
const GREEN = "#16A34A";
const BLUE = "#3E63DD";
const TICK_MS = 110;

/* No drop shadow. The hairline carries the edge on its own here — the section
   already stacks a card, a well and a widget head, and a shadow on the outer
   one made that read as three layers deep. */
const CARD: React.CSSProperties = {
  borderRadius: 12,
  border: `1px solid ${LINE}`,
  background: "#FFFFFF",
};

const WELL: React.CSSProperties = {
  borderRadius: 10,
  border: `1px solid ${LINE}`,
  background: "linear-gradient(180deg, #FAFAFB 0%, #FFFFFF 100%)",
};

function useTick() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((v) => v + 1), TICK_MS);
    return () => clearInterval(id);
  }, []);
  return t;
}

function WidgetHead({ label, note }: { label: string; note?: string }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2"
      style={{ borderBottom: `1px solid ${LINE}` }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: ORANGE }}
      />
      <span className="text-[8.5px] font-mono font-bold tracking-[0.16em] uppercase text-graphite/50 truncate">
        {label}
      </span>
      {note && (
        <span className="ml-auto text-[8.5px] font-mono text-graphite/35 shrink-0">
          {note}
        </span>
      )}
    </div>
  );
}

/** The pill list each card carries under its widget. */
function Chips({ items }: { items: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-1.5">
      {items.map((c) => (
        <span
          key={c}
          className="px-2.5 py-1 rounded-full text-[10.5px] text-graphite/60"
          style={{ background: "#FAFAFB", border: `1px solid ${LINE}` }}
        >
          {c}
        </span>
      ))}
    </div>
  );
}

/* ── 01 · business systems — records reconciling ─────────── */

/* Row pitch for the scroll. Tied to the row height, or the loop shows a seam. */
const ROW_H = 30;
const ROW_GAP = 6;
const ROW_PITCH = ROW_H + ROW_GAP;

const SYSTEMS: [string, string][] = [
  ["ERP", "812 assets"],
  ["WMS", "1,940 tasks"],
  ["MES", "126 orders"],
  ["CMMS", "78 work orders"],
  ["BMS", "34 zones"],
  ["Inspection", "9 cycles"],
  ["Finance", "412 records"],
  ["HR", "88 operators"],
];

function WSystems() {
  return (
    <div className="h-full flex flex-col">
      <WidgetHead label="Reconciling" note="live" />
      {/* The list is rendered twice and translated one list's worth, so the
         loop closes without a join. */}
      <div className="relative flex-1 min-h-0 overflow-hidden px-3 py-2">
        <motion.div
          className="flex flex-col"
          initial={{ y: 0 }}
          animate={{ y: [0, -(SYSTEMS.length * ROW_PITCH)] }}
          transition={{
            duration: SYSTEMS.length * 1.6,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {[...SYSTEMS, ...SYSTEMS].map(([k, v], i) => (
            <div
              key={`${k}-${i}`}
              className="flex items-center gap-2 px-2.5 rounded-md shrink-0"
              style={{
                height: ROW_H,
                marginBottom: ROW_GAP,
                background: "#FAFAFB",
                border: `1px solid ${LINE}`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: GREEN }}
              />
              <span className="text-[9.5px] font-mono font-bold text-carbon truncate">
                {k}
              </span>
              <span className="ml-auto text-[9px] font-mono text-graphite/45 tabular-nums shrink-0">
                {v}
              </span>
            </div>
          ))}
        </motion.div>

        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-6 pointer-events-none"
          style={{
            background: "linear-gradient(to top, #FFFFFF, transparent)",
          }}
        />
      </div>
    </div>
  );
}

/* ── 02 · RAMS hardware — the trace ──────────────────────── */

/* Twenty readings, written down. A line needs a series with shape; random
   noise reads as static and would differ between server and client. */
const TRACE = [
  22, 26, 21, 30, 27, 34, 29, 41, 36, 52, 44, 38, 31, 46, 39, 33, 28, 35, 30,
  25,
];

function WSensing({ t }: { t: number }) {
  const max = Math.max(...TRACE);
  const at = Math.floor(t / 7) % TRACE.length;

  const pt = (v: number, i: number): [number, number] => [
    (i / (TRACE.length - 1)) * 100,
    30 - (v / max) * 26,
  ];
  const line = TRACE.map((v, i) =>
    pt(v, i)
      .map((n) => n.toFixed(2))
      .join(","),
  ).join(" ");
  const [cx, cy] = pt(TRACE[at], at);

  return (
    <div className="h-full flex flex-col">
      <WidgetHead label="Impact trace" note="live" />
      {/* The marker is an HTML dot, not an SVG circle. The chart is stretched
         with `preserveAspectRatio="none"` so the line fills the well, and a
         circle inside a non-uniformly scaled viewBox comes out an oval. */}
      <div className="flex-1 px-3 py-3">
        <div className="relative w-full h-full">
          <svg
            viewBox="0 0 100 32"
            preserveAspectRatio="none"
            className="w-full h-full block"
            aria-hidden
          >
            <polyline
              points={line}
              fill="none"
              stroke={ORANGE}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <motion.span
            aria-hidden
            className="absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{ background: ORANGE }}
            initial={false}
            animate={{
              left: `${cx.toFixed(2)}%`,
              top: `${((cy / 32) * 100).toFixed(2)}%`,
            }}
            transition={{ duration: 0.25, ease: "linear" }}
          />
        </div>
      </div>
      <div className="px-3 pb-3 flex items-center justify-between">
        <span className="text-[8px] font-mono uppercase tracking-[0.12em] text-graphite/40">
          Peak force
        </span>
        <span className="text-[13px] font-bold tabular-nums leading-none text-carbon">
          {(1.4 + (TRACE[at] / max) * 2.1).toFixed(1)} g
        </span>
      </div>
    </div>
  );
}

/* ── 03 · client hardware — protocols handshaking ────────── */

const PROTOCOLS: [string, string][] = [
  ["MQTT", "Sensors"],
  ["OPC-UA", "Machines"],
  ["Modbus", "PLCs"],
  ["BACnet", "Building"],
];

function WProtocols({ t }: { t: number }) {
  const at = Math.floor(t / 14) % PROTOCOLS.length;
  return (
    <div className="h-full flex flex-col">
      <WidgetHead label="Handshake" note="open" />
      <div className="grid grid-cols-2 gap-1.5 p-3 flex-1">
        {PROTOCOLS.map(([k, v], i) => {
          const on = i === at;
          return (
            <div
              key={k}
              className="flex flex-col justify-center px-2.5 py-2 rounded-md transition-all duration-400"
              style={{
                background: on ? "rgba(62,99,221,0.07)" : "#FAFAFB",
                border: `1px solid ${on ? "rgba(62,99,221,0.34)" : LINE}`,
              }}
            >
              <span className="text-[8px] font-mono uppercase tracking-[0.12em] text-graphite/40">
                {v}
              </span>
              <span
                className="mt-1 text-[12px] font-bold leading-none"
                style={{ color: on ? BLUE : "#0E0E0F" }}
              >
                {k}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── 04 · AI & edge — signals crossing the edge ──────────── */

/**
 * Three lanes, alternating direction, carrying icon chips from the same
 * sixteen-colour palette and the same solid icon set as the overview grid.
 *
 * The travelling element is a full-width wrapper with the chip pinned to one
 * edge. `translateX` on a percentage is relative to the element's own width —
 * animating the chip itself would move it by a fraction of the chip, not of
 * the lane.
 */
const EDGE_LANES = [
  {
    dir: "r" as const,
    chips: [
      { icon: SignalIcon, label: "Sensor", tint: "#299764", delay: 0 },
      { icon: CubeIcon, label: "Twin", tint: "#3E63DD", delay: 3.1 },
    ],
  },
  {
    dir: "l" as const,
    chips: [
      { icon: VideoCameraIcon, label: "Vision", tint: "#6647F0", delay: 1.3 },
      { icon: EyeIcon, label: "Detect", tint: "#E5484D", delay: 4.4 },
    ],
  },
  {
    dir: "r" as const,
    chips: [
      { icon: CpuChipIcon, label: "Edge", tint: "#F76808", delay: 2.4 },
      { icon: BoltIcon, label: "Act", tint: "#E93D82", delay: 5.5 },
    ],
  },
];

const EDGE_FLOW = 6.2;

function WEdge() {
  return (
    <div className="h-full flex flex-col">
      <style>{`
        @keyframes twinint-r {
          0%   { transform: translateX(-16%); opacity: 0; }
          16%  { opacity: 1; }
          70%  { opacity: 1; }
          88%, 100% { transform: translateX(58%); opacity: 0; }
        }
        @keyframes twinint-l {
          0%   { transform: translateX(16%); opacity: 0; }
          16%  { opacity: 1; }
          70%  { opacity: 1; }
          88%, 100% { transform: translateX(-58%); opacity: 0; }
        }
        .twinint-r { animation: twinint-r ${EDGE_FLOW}s cubic-bezier(0.4,0,0.5,1) infinite both; }
        .twinint-l { animation: twinint-l ${EDGE_FLOW}s cubic-bezier(0.4,0,0.5,1) infinite both; }
        @media (prefers-reduced-motion: reduce) {
          .twinint-r, .twinint-l { animation: none; opacity: 1; }
        }
      `}</style>

      <WidgetHead label="Edge inference" note="42 ms" />

      <div className="flex-1 flex flex-col justify-center gap-3.5 px-3 py-3">
        {EDGE_LANES.map((lane, li) => (
          <div key={li} className="relative h-6">
            <span
              aria-hidden
              className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
              style={{ background: LINE }}
            />
            {lane.chips.map((c) => (
              <div
                key={c.label}
                className={
                  "absolute inset-0 " +
                  (lane.dir === "r" ? "twinint-r" : "twinint-l")
                }
                style={{ animationDelay: `${c.delay}s` }}
              >
                <span
                  className={
                    "absolute top-1 inline-flex items-center gap-1.5 rounded-full pl-[3px] pr-2 py-[3px] " +
                    (lane.dir === "r" ? "left-0" : "right-0")
                  }
                  style={{
                    background: "#FFFFFF",
                    border: `1px solid ${c.tint}3D`,
                  }}
                >
                  <span
                    className="w-[15px] h-[15px] rounded-full flex items-center justify-center shrink-0"
                    style={{ background: c.tint }}
                  >
                    <c.icon className="w-[9px] h-[9px] text-white" />
                  </span>
                  <span
                    className="text-[8px] font-mono font-bold uppercase tracking-[0.08em] whitespace-nowrap"
                    style={{ color: c.tint }}
                  >
                    {c.label}
                  </span>
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── the four ────────────────────────────────────────────── */

const CARDS = [
  {
    kicker: "Business systems",
    title: "Connect enterprise workflows",
    body: "The twin gives records from the systems you already run a location, without replacing any of them.",
    chips: ["ERP", "WMS", "MES", "CMMS", "Other platforms"],
    Widget: () => <WSystems />,
  },
  {
    kicker: "RAMS hardware",
    title: "Add supported sensing",
    body: "Our own impact, tilt, load and vision hardware, commissioned against the model rather than a spreadsheet.",
    chips: ["LiDAR", "AI vision", "Impact sensors", "Pallet detection"],
    Widget: WSensing,
  },
  {
    kicker: "Client hardware",
    title: "Bring the installed estate",
    body: "Sensors and controllers you already own keep their job and attach to an asset in the twin.",
    chips: ["Sensors", "Cameras", "PLCs", "Machines", "Automation"],
    Widget: WProtocols,
  },
  {
    kicker: "AI & edge",
    title: "Decide where the event happens",
    body: "Vision and analytics at the edge and in the cloud — open at the sensor layer, intelligent at the edge.",
    chips: [
      "On-site inference",
      "OmniBox",
      "Offline-tolerant",
      "Cloud history",
    ],
    Widget: () => <WEdge />,
  },
];

const CHAIN: [string, string][] = [
  ["Sensor", "Physical signal"],
  ["Edge processor", "OmniBox or customer edge"],
  ["Local intelligence", "Process near the event"],
  ["Twin context", "Asset + place + time"],
  ["Cloud / history", "Persistent record"],
  ["Action", "Operational response"],
];

export function TwinIntegrations() {
  const t = useTick();

  return (
    <Section surface="offWhite" id="integrations">
      <SectionHeader
        eyebrow="Integrations"
        top="Use our sensors."
        bottom="Use yours. Or use both."
        size="compact"
        width="wide"
        body="Bring enterprise systems, operational technology, edge intelligence and physical sensing into the same context."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1240px] mx-auto">
        {CARDS.map((c, i) => (
          <motion.div
            key={c.kicker}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
            className="flex flex-col p-5 sm:p-6"
            style={CARD}
          >
            <div
              className="shrink-0 overflow-hidden"
              style={{ ...WELL, height: 196 }}
            >
              <c.Widget t={t} />
            </div>

            <p className="mt-6 text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange">
              {c.kicker}
            </p>
            <h3 className="mt-3 text-[18px] font-bold text-carbon leading-[1.2] tracking-[-0.025em]">
              {c.title}
            </h3>
            <p className="mt-2.5 text-[13.5px] text-graphite/65 leading-[1.6]">
              {c.body}
            </p>
            <Chips items={c.chips} />
          </motion.div>
        ))}
      </div>

      {/* ── the signal path ──────────────────────────────
          One rail, not six cards. These six are a sequence — a signal moves
          through them in order — and six equal tiles state that order
          nowhere; you have to read it back out of the labels. The track says
          it in the shape.

          Stage four is the one marked: the twin sits after the edge has
          already decided, which is why a response does not wait on a round
          trip to the cloud. The rail carries that on its own — it had a mono
          caption spelling it out, which was saying twice what the highlight
          already says once. */}
      <div className="mt-14 sm:mt-16 max-w-[1240px] mx-auto">
        <div className="overflow-x-auto">
          <div className="relative min-w-[720px] lg:min-w-0">
            <span
              aria-hidden
              className="absolute top-[13px] h-px"
              style={{ left: "8.333%", right: "8.333%", background: LINE }}
            />

            <div className="relative grid grid-cols-6 gap-x-3">
              {CHAIN.map(([k, v], i) => {
                const hub = i === 3;
                return (
                  <motion.div
                    key={k}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
                    className="flex flex-col items-center text-center"
                  >
                    <span
                      className="flex items-center justify-center w-[27px] h-[27px] rounded-full shrink-0"
                      style={{
                        background: hub ? ORANGE : "#FFFFFF",
                        border: `1.5px solid ${hub ? ORANGE : "#DCDCE2"}`,
                      }}
                    >
                      <span
                        className="text-[9.5px] font-mono font-bold tabular-nums"
                        style={{ color: hub ? "#FFFFFF" : "#A8A8B0" }}
                      >
                        {i + 1}
                      </span>
                    </span>

                    <span
                      className={
                        "mt-4 text-[10px] font-mono font-bold tracking-[0.16em] uppercase " +
                        (hub ? "text-signal-orange" : "text-carbon")
                      }
                    >
                      {k}
                    </span>
                    <span className="mt-2 text-[11.5px] leading-[1.5] text-graphite/55 max-w-[15ch]">
                      {v}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
