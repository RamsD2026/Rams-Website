"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Ruler,
  Scale,
  SlidersHorizontal,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import {
  DARK_LINE,
  Points,
  TabBar,
  type Point,
} from "@/components/sections/imds/imds-shared";

/**
 * Beyond the hour meter — the two sensors, as tabs.
 *
 * No controls inside a panel. A machine switcher and a read-by toggle made the
 * reader click through the comparison one item at a time, when the comparison
 * is the argument: all three machines are shown together so MHE 01 doing the
 * most lifts and the least work is visible without touching anything, and the
 * whole fleet's battery health is one list.
 *
 * Every derived figure is computed from the document's own numbers, so nothing
 * can drift from the chart it sits under.
 */

const HAIR = DARK_LINE;
const GREEN = "#54DE91";
const AMBER = "#FFBE47";
const RED = "#FF6C6C";

/* Grouped by hand rather than through toLocaleString: Node and the browser
   can ship different ICU data, which hydrates as a mismatch. */
const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const TABS = [
  "Pallet Detection — lift work",
  "Battery Management System — health",
];

/** The panel each sensor is drawn in. */
function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="overflow-hidden max-w-[1080px] mx-auto"
      style={{
        borderRadius: 16,
        background: "#0E0E11",
        border: `1px solid ${HAIR}`,
        boxShadow: "0 40px 90px -50px rgba(0,0,0,0.8)",
      }}
    >
      {children}
    </div>
  );
}

/* ── lift work ───────────────────────────────────────────── */

const BANDS = ["0–2", "2–4", "4–6", "6–8", "8–10"];
/** Mid-point of each band, for weighting the work figure. */
const MID = [1, 3, 5, 7, 9];

const MACHINES = [
  {
    id: "MHE 01",
    type: "Counterbalance",
    d: [6200, 1600, 500, 90, 20],
    peak: "8.4 m",
  },
  {
    id: "MHE 04",
    type: "Reach truck",
    d: [2100, 2600, 2400, 1900, 740],
    peak: "9.6 m",
  },
  { id: "MHE 09", type: "VNA", d: [180, 420, 980, 2100, 3900], peak: "11.2 m" },
].map((m) => {
  const total = m.d.reduce((a, b) => a + b, 0);
  const work = m.d.reduce((a, b, i) => a + b * MID[i], 0);
  return { ...m, total, work, avg: work / total };
});

const MAX = Math.max(...MACHINES.flatMap((m) => m.d));
const MAX_WORK = Math.max(...MACHINES.map((m) => m.work));

/** Higher bands are the work that matters, so they carry the accent. */
const bandColour = (i: number) =>
  i >= 3 ? "#FF6A00" : i === 2 ? "#E08A3C" : "#6E7B8B";

/** What the height reading changes about servicing the machine. */
const LIFT_POINTS: Point[] = [
  {
    Icon: Ruler,
    ix: "Measured",
    title: "Height, not just a count",
    body: "Every pick and place is recorded with the height it happened at, which turns a raw cycle count into a duty profile for the hydraulics.",
  },
  {
    Icon: Wrench,
    ix: "Fairer",
    title: "The right machine gets the attention",
    body: "Serviced on cycle count alone, the busiest truck is inspected first — even when another one is doing several times the hydraulic work.",
  },
  {
    Icon: SlidersHorizontal,
    ix: "Connected",
    title: "Weights the service interval",
    body: "Lift work feeds the same triggers as hours, cycles and faults, so intervals follow duty rather than the calendar.",
  },
];

function LiftPanel() {
  return (
    <Frame>
      <div
        className="flex items-center justify-between gap-4 px-6 py-4 sm:px-8 flex-wrap"
        style={{ background: "#111114", borderBottom: `1px solid ${HAIR}` }}
      >
        <p className="font-rams-heading text-[17px] sm:text-[19px] font-bold tracking-[-0.025em] text-white">
          A lift to one metre and a lift to nine are not the same{" "}
          <span className="text-signal-orange">job</span>.
        </p>
        <p className="text-[10px] font-mono tracking-[0.14em] uppercase text-white/35">
          Lift cycles by height
        </p>
      </div>

      {/* all three machines, so the comparison needs no clicking */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-px"
        style={{ background: HAIR }}
      >
        {MACHINES.map((m, mi) => (
          <div
            key={m.id}
            className="px-5 py-6 sm:px-6"
            style={{ background: "#0E0E11" }}
          >
            <p className="text-[13px] font-semibold text-white">{m.id}</p>
            <p className="text-[9.5px] font-mono tracking-[0.1em] uppercase text-white/35">
              {m.type}
            </p>

            <div
              className="flex items-end gap-1.5 mt-6"
              style={{ height: 128 }}
            >
              {m.d.map((v, i) => (
                <div
                  key={BANDS[i]}
                  className="flex-1 flex flex-col justify-end h-full"
                >
                  <motion.span
                    className="w-full rounded-t-[2px]"
                    style={{ background: bandColour(i) }}
                    initial={{ height: 0 }}
                    whileInView={{
                      height: `${Math.max(1, (v / MAX) * 100)}%`,
                    }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.1 + mi * 0.12 + i * 0.05,
                      ease: EASE,
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-1.5 mt-2">
              {BANDS.map((b) => (
                <span
                  key={b}
                  className="flex-1 text-center text-[8.5px] font-mono text-white/30"
                >
                  {b}
                </span>
              ))}
            </div>

            <div
              className="mt-5 pt-4"
              style={{ borderTop: `1px solid ${HAIR}` }}
            >
              <p className="text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-white/35">
                Lift work
              </p>
              <p className="mt-1.5 flex items-baseline gap-1.5">
                <span className="font-rams-heading text-[24px] font-bold tabular-nums tracking-[-0.035em] leading-none text-signal-orange">
                  {fmt(m.work)}
                </span>
                <span className="text-[10.5px] font-mono text-white/40">
                  m·cycles
                </span>
              </p>

              {/* the same figure as a share of the hardest-working machine */}
              <span
                className="block relative h-1 rounded-full mt-3 overflow-hidden"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <motion.span
                  className="absolute inset-y-0 left-0 rounded-full bg-signal-orange"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(m.work / MAX_WORK) * 100}%` }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.5 + mi * 0.12,
                    ease: EASE,
                  }}
                />
              </span>

              <p className="mt-3 text-[10.5px] font-mono text-white/40 tabular-nums">
                {fmt(m.total)} cycles · avg {m.avg.toFixed(1)} m
              </p>
            </div>
          </div>
        ))}
      </div>

      <p
        className="px-6 py-4 sm:px-8 text-[11.5px] text-white/40 leading-[1.6]"
        style={{ borderTop: `1px solid ${HAIR}`, background: "#111114" }}
      >
        More cycles does not mean more wear — MHE 01 lifts most often and does
        the least hydraulic work, because almost all of them are dock-height.
      </p>
    </Frame>
  );
}

/* ── battery ─────────────────────────────────────────────── */

const BATTERIES = [
  {
    id: "MHE 01",
    chem: "OEM A · Lead-acid",
    h: 78,
    cyc: 412,
    dod: 71,
    deep: 14,
  },
  {
    id: "MHE 02",
    chem: "OEM B · Lithium-ion",
    h: 94,
    cyc: 388,
    dod: 44,
    deep: 1,
  },
  {
    id: "MHE 04",
    chem: "OEM A · Lead-acid",
    h: 61,
    cyc: 486,
    dod: 82,
    deep: 31,
  },
  {
    id: "MHE 07",
    chem: "OEM C · Lead-acid",
    h: 84,
    cyc: 305,
    dod: 58,
    deep: 6,
  },
  {
    id: "MHE 09",
    chem: "OEM B · Lithium-ion",
    h: 90,
    cyc: 210,
    dod: 47,
    deep: 2,
  },
];

const health = (h: number) => (h >= 85 ? GREEN : h >= 70 ? AMBER : RED);

const COLS = "1.4fr 1.8fr 0.7fr 0.7fr 0.8fr";

/** What one measured scale is actually worth, once the board is read. */
const BATTERY_POINTS: Point[] = [
  {
    Icon: Scale,
    ix: "Comparable",
    title: "Across a mixed fleet",
    body: "Machines from different manufacturers finally sit on one scale, because the measurement is electrical rather than reported.",
  },
  {
    Icon: Zap,
    ix: "Actionable",
    title: "Charging practice, not just batteries",
    body: "Deep-discharge counts and charge patterns often say more about how a shift runs than about the cell itself.",
  },
  {
    Icon: Workflow,
    ix: "Connected",
    title: "Feeds the same triggers",
    body: "Battery condition raises work orders through the same route as hours, cycles and faults — and feeds replacement decisions in FMS.",
  },
];

function BatteryPanel() {
  return (
    <Frame>
      <div
        className="flex items-center justify-between gap-4 px-6 py-4 sm:px-8 flex-wrap"
        style={{ background: "#111114", borderBottom: `1px solid ${HAIR}` }}
      >
        <p className="font-rams-heading text-[17px] sm:text-[19px] font-bold tracking-[-0.025em] text-white">
          Every OEM reports battery health differently.{" "}
          <span className="text-signal-orange">Amps and volts</span> do not.
        </p>
        <p className="text-[10px] font-mono tracking-[0.14em] uppercase text-white/35">
          Measured, not reported
        </p>
      </div>

      <div
        className="hidden sm:grid gap-x-4 px-6 py-3 sm:px-8"
        style={{ gridTemplateColumns: COLS, background: "#0A0C0E" }}
      >
        {[
          "Machine",
          "Battery health",
          "Charge cycles",
          "Avg DoD",
          "Deep discharges",
        ].map((h) => (
          <span
            key={h}
            className="text-[9px] font-mono font-bold tracking-[0.12em] uppercase text-white/40 leading-[1.3]"
          >
            {h}
          </span>
        ))}
      </div>

      {BATTERIES.map((b, i) => (
        <div
          key={b.id}
          className="grid gap-x-4 gap-y-2 items-center px-6 py-4 sm:px-8"
          style={{
            gridTemplateColumns: COLS,
            borderTop: `1px solid ${HAIR}`,
          }}
        >
          <span className="min-w-0">
            <span className="block text-[13.5px] font-semibold text-white truncate">
              {b.id}
            </span>
            <span className="block text-[9.5px] font-mono text-white/35 truncate">
              {b.chem}
            </span>
          </span>

          <span className="flex items-center gap-3">
            <span
              className="text-[12.5px] font-mono font-semibold tabular-nums shrink-0"
              style={{ color: health(b.h) }}
            >
              {b.h}%
            </span>
            <span
              className="relative flex-1 h-1.5 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <motion.span
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: health(b.h) }}
                initial={{ width: 0 }}
                whileInView={{ width: `${b.h}%` }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.7,
                  delay: 0.1 + i * 0.08,
                  ease: EASE,
                }}
              />
            </span>
          </span>

          <span className="text-[13px] font-semibold tabular-nums text-white">
            {b.cyc}
          </span>
          <span className="text-[13px] tabular-nums text-white/55">
            {b.dod}%
          </span>
          <span className="text-[13px] font-semibold tabular-nums text-white">
            {b.deep}
          </span>
        </div>
      ))}

      <p
        className="px-6 py-4 sm:px-8 text-[11.5px] text-white/40 leading-[1.6]"
        style={{ borderTop: `1px solid ${HAIR}`, background: "#111114" }}
      >
        One health measure across a mixed fleet, derived from measured
        electrical behaviour.
      </p>
    </Frame>
  );
}

export function ImdsSensors() {
  const [tab, setTab] = useState(0);

  return (
    <Section surface="darkMid" id="sensors">
      <SectionHeader
        eyebrow="Beyond the hour meter"
        top="Two things a service"
        bottom="Schedule never knew."
        body="Operating hours tell you the machine was on. Two sensors already fitted for MEPS tell you what it was actually doing — how hard the hydraulics worked, and how the battery is really holding up."
        tone="dark"
        size="compact"
        width="wide"
        bodyWidth="wide"
      />

      <TabBar
        tabs={TABS}
        active={tab}
        onChange={setTab}
        label="Sensors"
        tone="dark"
      />

      <div className="mt-12 sm:mt-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {tab === 0 ? <LiftPanel /> : <BatteryPanel />}
          </motion.div>
        </AnimatePresence>
      </div>

      <Points items={tab === 0 ? LIFT_POINTS : BATTERY_POINTS} />
    </Section>
  );
}
