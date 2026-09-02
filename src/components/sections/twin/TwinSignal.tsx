"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { TabBar } from "@/components/sections/imds/imds-shared";

/**
 * Why context changes IoT.
 *
 * The data on the left, what it turns into on the right. The left column is
 * the record — the reading as the device sent it, then the context the twin
 * resolves it against, arriving one line at a time. The right column is what
 * a supervisor actually reads: three small widgets, each one a fact the raw
 * number could not have told them.
 *
 * It runs itself when it scrolls into view, because the transformation is the
 * point and nobody should have to find a button to see it.
 */

const LINE = "#E8E8ED";
const AMBER = "#D9A21B";
const RED = "#C6413A";

const TABS = ["Impact event", "Position reading"];

type Widget =
  | {
      kind: "bars";
      label: string;
      value: string;
      foot: string;
      bars: number[];
      colour: string;
    }
  | {
      kind: "meter";
      label: string;
      value: string;
      foot: string;
      fill: number;
      colour: string;
    }
  | {
      kind: "chips";
      label: string;
      value: string;
      foot: string;
      chips: string[];
    };

type Signal = {
  /** The meaning, split across two heading lines. */
  head: string;
  sub: string;
  /** What the twin added, in the values it resolved. */
  points: string[];
  value: string;
  unit: string;
  time: string;
  device: string;
  rows: [string, string][];
  widgets: Widget[];
};

const SIGNALS: Signal[] = [
  {
    head: "One reading became a repair, a route review and a conversation with one operator.",
    sub: "Not a monthly incident count.",
    points: [
      "Where it happened, and to what",
      "Who was operating at the time",
      "What was standing beside it",
      "Whether it has happened here before",
    ],
    value: "3.2",
    unit: "g",
    time: "14:07:41",
    device: "Shock sensor · MHE 04",
    rows: [
      ["Equipment", "MHE 04 — reach truck"],
      ["Operator", "Authenticated session, shift B"],
      ["Location", "Aisle 07, bay 12, upright A"],
      ["Structure", "Expansion joint 1.2 m away"],
      ["Before", "Loaded travel, entering aisle"],
      ["After", "Reversed out, continued task"],
      ["At this point", "4th recorded impact in 90 days"],
    ],
    widgets: [
      {
        kind: "bars",
        label: "Recurrence at this location",
        value: "4 in 90 days",
        foot: "Same bay, same manoeuvre",
        bars: [1, 0, 1, 0, 0, 1, 0, 1],
        colour: RED,
      },
      {
        kind: "meter",
        label: "Nearest structure",
        value: "1.2 m",
        foot: "Expansion joint beside the upright",
        fill: 0.24,
        colour: AMBER,
      },
      {
        kind: "chips",
        label: "What it raises",
        value: "Three actions",
        foot: "Each one attached to the same event",
        chips: ["Rack inspection", "Route review", "Operator coaching"],
      },
    ],
  },
  {
    head: "A coordinate pair became a productivity question.",
    sub: "Why is this machine crossing the building empty, every shift?",
    points: [
      "Where the machine actually is",
      "What it was doing there",
      "What the route costs against the shortest one",
      "Whether the pattern repeats",
    ],
    value: "42.5 · 17.2",
    unit: "x · y",
    time: "09:22:08",
    device: "Location tag · MHE 04",
    rows: [
      ["Equipment", "MHE 04 — reach truck"],
      ["Resolved to", "Aisle 07, mid-run"],
      ["Load state", "Travelling empty"],
      ["Heading", "Outbound staging"],
      ["Route", "1.6× the shortest available path"],
      ["Zone", "Shared pedestrian crossing ahead"],
      ["Pattern", "Empty travel on this leg, most shifts"],
    ],
    widgets: [
      {
        kind: "meter",
        label: "Route against shortest path",
        value: "1.6×",
        foot: "Same detour, most shifts",
        fill: 0.62,
        colour: AMBER,
      },
      {
        kind: "bars",
        label: "Empty travel on this leg",
        value: "6 of 8 runs",
        foot: "Crossing the building with no load",
        bars: [1, 1, 0, 1, 1, 1, 0, 1],
        colour: AMBER,
      },
      {
        kind: "chips",
        label: "What it crosses",
        value: "One shared zone",
        foot: "Pedestrian crossing on the same leg",
        chips: ["Pedestrian crossing", "Outbound staging"],
      },
    ],
  },
];

/** One context line at a time, once the reading is resolved. */
const STEP_MS = 240;

/* ── the widgets ─────────────────────────────────────────── */

function WidgetCard({ w, lit, i }: { w: Widget; lit: boolean; i: number }) {
  return (
    <motion.div
      animate={{ opacity: lit ? 1 : 0.3, y: lit ? 0 : 6 }}
      transition={{ duration: 0.45, delay: lit ? i * 0.1 : 0, ease: EASE }}
      className="bg-white p-4.5 flex flex-col justify-between gap-4"
      style={{ borderRadius: 14, border: `1px solid ${LINE}`, minHeight: 156 }}
    >
      <p className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-graphite/40">
        {w.label}
      </p>

      <div>
        <p className="font-rams-heading text-[20px] font-bold tracking-[-0.03em] leading-none text-carbon">
          {w.value}
        </p>

        {w.kind === "bars" && (
          <div className="flex items-end gap-1.5 h-[20px] mt-3">
            {w.bars.map((b, k) => (
              <motion.span
                key={k}
                className="flex-1 rounded-[2px]"
                style={{ background: b ? w.colour : "#E4E4E9" }}
                animate={{ height: lit ? (b ? "100%" : "34%") : "34%" }}
                transition={{
                  duration: 0.4,
                  delay: lit ? 0.2 + k * 0.05 : 0,
                  ease: EASE,
                }}
              />
            ))}
          </div>
        )}

        {w.kind === "meter" && (
          <span
            className="relative block h-1.5 rounded-full mt-3.5 overflow-hidden"
            style={{ background: "#EDEDF1" }}
          >
            <motion.span
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ background: w.colour }}
              animate={{ width: lit ? `${w.fill * 100}%` : "0%" }}
              transition={{ duration: 0.7, delay: lit ? 0.2 : 0, ease: EASE }}
            />
          </span>
        )}

        {w.kind === "chips" && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {w.chips.map((c, k) => (
              <motion.span
                key={c}
                animate={{ opacity: lit ? 1 : 0.4 }}
                transition={{ duration: 0.35, delay: lit ? 0.2 + k * 0.08 : 0 }}
                className="px-2.5 py-1 rounded-full text-[11px] text-graphite/65"
                style={{ border: `1px solid ${LINE}` }}
              >
                {c}
              </motion.span>
            ))}
          </div>
        )}
      </div>

      <p className="text-[11.5px] leading-[1.5] text-graphite/45">{w.foot}</p>
    </motion.div>
  );
}

/* ── the section ─────────────────────────────────────────── */

export function TwinSignal() {
  const [tab, setTab] = useState(0);
  const [shown, setShown] = useState(0);
  const [run, setRun] = useState(0);
  const s = SIGNALS[tab];

  const frame = useRef<HTMLDivElement>(null);
  const seen = useInView(frame, { once: true, amount: 0.3 });

  const pick = (i: number) => {
    setTab(i);
    setShown(0);
    setRun((v) => v + 1);
  };

  /* resolves itself the first time it is looked at, and on every replay */
  useEffect(() => {
    if (!seen) return;
    const id = setTimeout(() => setShown(1), 450);
    return () => clearTimeout(id);
  }, [seen, run]);

  useEffect(() => {
    if (shown === 0 || shown >= s.rows.length) return;
    const id = setTimeout(() => setShown((v) => v + 1), STEP_MS);
    return () => clearTimeout(id);
  }, [shown, s.rows.length]);

  const done = shown >= s.rows.length;

  return (
    <Section surface="offWhite" id="signal">
      <SectionHeader
        eyebrow="Why context changes IoT"
        top="Data tells you what happened."
        bottom="Physical context explains what it means."
        body="A sensor reading on its own is a number. The same reading, resolved into the Digital Twin, becomes something a supervisor can act on before the end of the shift."
        size="long"
        width="wide"
        bodyWidth="wide"
      />

      <TabBar
        tabs={TABS}
        active={tab}
        onChange={pick}
        label="Signal"
        tone="light"
      />

      <div
        ref={frame}
        className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start max-w-[1180px] mx-auto mt-12 sm:mt-14"
      >
        {/* what this signal is, in words */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <p className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
                {TABS[tab]}
              </p>

              <h3 className="mt-4 font-rams-heading text-[24px] sm:text-[30px] font-bold tracking-[-0.032em] leading-[1.2] text-carbon max-w-[20ch]">
                {s.head}
              </h3>

              <p className="mt-5 text-[15px] leading-[1.6] text-graphite/55 max-w-[40ch]">
                {s.sub}
              </p>

              {/* what the twin put around the number */}
              <div
                className="mt-7 pt-7"
                style={{ borderTop: `1px solid ${LINE}` }}
              >
                <p className="text-[9.5px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/40">
                  What the twin added
                </p>

                <div className="mt-4">
                  {s.points.map((pt, i) => (
                    <motion.p
                      key={pt}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.1 + i * 0.07,
                        ease: EASE,
                      }}
                      className="flex items-start gap-3 py-2 text-[13.5px] leading-[1.55] text-graphite/70"
                    >
                      <span className="flex items-center justify-center w-[18px] h-[18px] rounded-full bg-signal-orange shrink-0 mt-[1px]">
                        <Check
                          className="w-2.5 h-2.5 text-white"
                          strokeWidth={3.2}
                          aria-hidden
                        />
                      </span>
                      {pt}
                    </motion.p>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* and what it looks like once the twin has it */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* the reading, as sent */}
          <motion.div
            animate={{ opacity: 1 }}
            className="sm:col-span-1 p-4.5 flex flex-col justify-between gap-4"
            style={{
              borderRadius: 14,
              background: "#FFFFFF",
              border: `1px solid ${LINE}`,
              minHeight: 156,
            }}
          >
            <div className="flex items-center gap-2.5">
              <span className="relative flex w-1.5 h-1.5">
                <motion.span
                  className="absolute inset-0 rounded-full bg-signal-orange"
                  animate={{ scale: [1, 2.6], opacity: [0.6, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
                <span className="relative w-1.5 h-1.5 rounded-full bg-signal-orange" />
              </span>
              <span className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-graphite/45">
                Raw signal
              </span>
            </div>

            <p className="flex items-baseline gap-2">
              <span className="font-mono text-[28px] font-bold tracking-[-0.03em] leading-none text-carbon">
                {s.value}
              </span>
              <span className="text-[12px] font-mono text-graphite/45">
                {s.unit}
              </span>
            </p>

            <p className="text-[11px] font-mono tabular-nums text-graphite/40">
              {s.device} · {s.time}
            </p>
          </motion.div>

          {/* the one number the twin adds */}
          <WidgetCard w={s.widgets[0]} lit={done} i={0} />

          {/* everything it resolved against */}
          <div
            className="sm:col-span-2 bg-white overflow-hidden"
            style={{ borderRadius: 14, border: `1px solid ${LINE}` }}
          >
            <div
              className="flex items-baseline justify-between gap-3 px-5 py-3"
              style={{
                borderBottom: `1px solid ${LINE}`,
                background: "#FAFAFB",
              }}
            >
              <span className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-graphite/45">
                Resolved into the twin
              </span>
              {done && (
                <button
                  type="button"
                  onClick={() => {
                    setShown(0);
                    setRun((v) => v + 1);
                  }}
                  className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.1em] uppercase text-graphite/35 hover:text-carbon transition-colors duration-200"
                >
                  <RotateCcw className="w-3 h-3" aria-hidden />
                  Replay
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 px-5 py-1.5">
              {s.rows.map(([k, v], i) => (
                <motion.div
                  key={k}
                  animate={{ opacity: i < shown ? 1 : 0.22 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="flex items-baseline justify-between gap-3 py-1.5"
                  style={{ borderTop: i > 1 ? `1px solid ${LINE}` : undefined }}
                >
                  <span className="text-[10.5px] font-mono text-graphite/45 shrink-0">
                    {k}
                  </span>
                  <span className="text-[12.5px] text-carbon text-right">
                    {v}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <WidgetCard w={s.widgets[1]} lit={done} i={1} />
          <WidgetCard w={s.widgets[2]} lit={done} i={2} />
        </div>
      </div>
    </Section>
  );
}
