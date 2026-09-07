"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TwinFacility } from "./TwinFacility";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 06 — Product experience.
 *
 * One switch, and the whole argument of the page. Left of it you have a
 * picture of the facility; right of it you have a view of the operation. The
 * geometry does not change — same shell, same 104 bays, same five docks — only
 * what is attached to it does.
 *
 * `TwinFacility` is rendered at two of its own layer steps: 0 is the bare
 * model, 4 brings tags, devices and live findings with it. Re-drawing the
 * building here would give two facilities that happen to look alike, so it
 * takes a `tone` instead and sits on the dark ground.
 *
 * Motion follows the solution-page heroes: `animateMotion` running equipment
 * along the plan's own routes, and pings scaling out from the sensing nodes —
 * the same idiom as `IrdsHero`'s pulsing markers, not a new one.
 *
 * The asset record shares the frame rather than sitting below it, and picking
 * an asset moves the crosshair on the drawing: the record and the plan are one
 * object seen two ways, so a selection in one has to show in the other.
 *
 * None of that exists on the static side. A model with no data attached has no
 * assets to pick and no record to read, so the right pane is empty and says so
 * — showing a populated record next to a bare model would give away the answer
 * the switch is meant to demonstrate.
 */

const LINE = "rgba(255,255,255,0.10)";

/* Row pitch for the scrolling record. Tied to the row height — if they drift
   apart the loop shows a seam. */
const ROW_H = 44;
const ROW_GAP = 6;
const ROW_PITCH = ROW_H + ROW_GAP;

/** The four assets the record picker offers, and where each one sits. */
const ASSETS = [
  {
    key: "mhe",
    label: "MHE 04",
    kicker: "Reach truck",
    at: [560, 206] as const,
    rows: [
      ["Location", "Aisle 07 · outbound"],
      ["Operator sessions", "1,284"],
      ["Impact history", "3 events"],
      ["Open actions", "1"],
      ["Inspection history", "12 records"],
      ["Maintenance", "Next in 40h"],
      ["Commissioned", "02 Jun 2023"],
    ],
  },
  {
    key: "rack",
    label: "Rack C07",
    kicker: "Selective pallet rack",
    at: [581, 195] as const,
    rows: [
      ["Location", "Aisle A3 · Bay C07"],
      ["Design load", "2,400 kg / level"],
      ["Severity", "Amber"],
      ["Open actions", "1"],
      ["Inspection history", "9 records"],
      ["Beam replaced", "02 Feb 2025"],
      ["Occupancy", "84%"],
    ],
  },
  {
    key: "dock",
    label: "Dock 3",
    kicker: "Inbound dock door",
    at: [40, 271] as const,
    rows: [
      ["Location", "West wall · D3"],
      ["Status", "Open"],
      ["Vehicle", "Trailer TR-1194"],
      ["Dwell", "34 min"],
      ["Pallets in", "18 of 26"],
      ["Clear height", "4.20 m"],
      ["Next slot", "10:15"],
    ],
  },
  {
    key: "sensor",
    label: "Impact sensor",
    kicker: "IMP-A3-07",
    at: [620, 148] as const,
    rows: [
      ["Location", "Aisle A3 · upright"],
      ["Last event", "09:42:07"],
      ["Peak force", "3.1 g"],
      ["Direction", "Front, aisle side"],
      ["Battery", "91%"],
      ["Events · 30 days", "3"],
      ["Firmware", "2.4.1"],
    ],
  },
];

const LEGEND: [string, string][] = [
  ["MHE movement", "#FF6A00"],
  ["Sensor events", "#54DE91"],
  ["Alerts", "#FF6C6C"],
  ["Asset status", "#6E8BEE"],
  ["Zones & tasks", "rgba(255,255,255,0.5)"],
];

export function TwinExperience() {
  const [live, setLive] = useState(false);
  const [asset, setAsset] = useState(0);
  const a = ASSETS[asset];

  return (
    <Section surface="ink" id="experience">
      <SectionHeader
        eyebrow="Product experience"
        top="A picture of the facility"
        bottom="Becomes a view of the operation."
        tone="dark"
        size="long"
        width="wide"
        body="The geometry is identical on both sides of this switch. What changes is whether anything is attached to it."
      />

      {/* the switch */}
      <div className="flex justify-center mb-10">
        <div
          className="inline-flex p-1 rounded-full"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: `1px solid ${LINE}`,
          }}
        >
          {[
            ["Static model", false],
            ["Connect live data", true],
          ].map(([label, v]) => {
            const on = live === v;
            return (
              <button
                key={String(label)}
                type="button"
                onClick={() => setLive(v as boolean)}
                className={
                  "relative px-5 py-2.5 rounded-full text-[13px] font-semibold transition-colors duration-300 " +
                  (on ? "text-carbon" : "text-white/45 hover:text-white/75")
                }
              >
                {on && (
                  <motion.span
                    layoutId="twinexp-switch"
                    className="absolute inset-0 rounded-full bg-white"
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                )}
                <span className="relative">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* the model */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="overflow-hidden"
        style={{
          borderRadius: 20,
          background: "#0B0B0E",
          border: `1px solid ${LINE}`,
        }}
      >
        <div
          className="flex items-center gap-3 px-5 py-3.5 flex-wrap"
          style={{ borderBottom: `1px solid ${LINE}` }}
        >
          <span
            className="w-2 h-2 rounded-full shrink-0 transition-colors duration-500"
            style={{ background: live ? "#54DE91" : "rgba(255,255,255,0.22)" }}
          />
          <span className="text-[11.5px] font-semibold text-white/85">
            Warehouse 01
          </span>
          <span
            className="ml-auto text-[10px] font-mono font-semibold tracking-[0.14em] uppercase transition-colors duration-500"
            style={{
              color: live ? "#FF6A00" : "rgba(255,255,255,0.32)",
            }}
          >
            {live ? "Live · 6 feeds" : "Model only"}
          </span>
        </div>

        {/* Facility left, its record right, inside the same frame — they are
            one view of one object, so they share a screen and a divider
            rather than sitting in two blocks. */}
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.42fr)_minmax(0,1fr)]">
          {/* Aspect-locked, so the drawing sets the row height. */}
          <div className="p-4 sm:p-6 aspect-[900/520]">
            <TwinFacility
              step={live ? 4 : 0}
              tone="dark"
              routes={live}
              focus={live ? a.at : undefined}
            />
          </div>

          {/* Out of flow at xl. In flow its fourteen rows are ~700px of
              content, and a grid row is as tall as its tallest column — so the
              drawing would float in a frame sized by the list. */}
          <div
            className="relative min-h-[420px] xl:min-h-0 border-t xl:border-t-0 xl:border-l"
            style={{ borderColor: LINE }}
          >
            <div className="xl:absolute xl:inset-0 flex flex-col min-h-0 overflow-hidden">
            <AnimatePresence mode="wait">
              {live ? (
                <motion.div
                  key="attached"
                  className="flex flex-col flex-1 min-h-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  {/* the picker */}
                  <div className="flex flex-wrap gap-2 px-5 pt-5 shrink-0">
                    {ASSETS.map((x, n) => {
                      const on = n === asset;
                      return (
                        <button
                          key={x.key}
                          type="button"
                          onClick={() => setAsset(n)}
                          className={
                            "px-3 py-1.5 rounded-full text-[11px] font-mono font-semibold tracking-[0.1em] uppercase transition-colors duration-300 " +
                            (on
                              ? "text-white"
                              : "text-white/45 hover:text-white/75")
                          }
                          style={{
                            background: on
                              ? "rgba(255,106,0,0.16)"
                              : "rgba(255,255,255,0.04)",
                            border: `1px solid ${
                              on ? "rgba(255,106,0,0.4)" : LINE
                            }`,
                          }}
                        >
                          {x.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* the record */}
                  <div className="px-5 pt-5 pb-4 shrink-0">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={a.key}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.35, ease: EASE }}
                      >
                        <p className="text-[9.5px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange">
                          {a.kicker}
                        </p>
                        <p className="mt-2 text-[24px] font-bold tracking-[-0.03em] leading-none text-white">
                          {a.label}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* rows, moving upward */}
                  <div className="relative flex-1 min-h-[176px] overflow-hidden px-5 pb-5">
                    <motion.div
                      key={a.key}
                      className="flex flex-col"
                      initial={{ y: 0 }}
                      animate={{ y: [0, -(a.rows.length * ROW_PITCH)] }}
                      transition={{
                        duration: a.rows.length * 1.9,
                        ease: "linear",
                        repeat: Infinity,
                      }}
                    >
                      {[...a.rows, ...a.rows].map(([k, v], n) => (
                        <div
                          key={`${k}-${n}`}
                          className="flex items-center justify-between gap-4 shrink-0 rounded-[10px] px-3"
                          style={{
                            height: ROW_H,
                            marginBottom: ROW_GAP,
                            background: "rgba(255,255,255,0.035)",
                            border: `1px solid ${LINE}`,
                          }}
                        >
                          <span className="text-[11.5px] text-white/45 truncate">
                            {k}
                          </span>
                          <span className="text-[11.5px] font-semibold text-white tabular-nums shrink-0">
                            {v}
                          </span>
                        </div>
                      ))}
                    </motion.div>

                    <div
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-10 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to top, #0B0B0E, transparent)",
                      }}
                    />
                  </div>
                </motion.div>
              ) : (
                /* Static is the before state, so the pane holds nothing to
                   pick and nothing to read — only the sentence that says why
                   it is empty. */
                <motion.div
                  key="bare"
                  className="flex flex-col flex-1 min-h-0 items-center justify-center px-8 py-12 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  <span
                    aria-hidden
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ border: "1px dashed rgba(255,255,255,0.16)" }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "rgba(255,255,255,0.22)" }}
                    />
                  </span>
                  <p className="mt-5 text-[10px] font-mono font-semibold tracking-[0.2em] uppercase text-white/30">
                    Nothing attached
                  </p>
                  <p className="mt-3 max-w-[280px] text-[13px] leading-[1.7] text-white/35">
                    A drawing of the building, and nothing else. It knows where
                    things are. It does not know what they are, what they did,
                    or what is happening to them now.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>
        </div>

        <div
          className="flex items-center gap-x-6 gap-y-2 px-5 py-4 flex-wrap"
          style={{ borderTop: `1px solid ${LINE}` }}
        >
          {LEGEND.map(([label, tint]) => (
            <span key={label} className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full transition-opacity duration-500"
                style={{ background: tint, opacity: live ? 1 : 0.22 }}
              />
              <span
                className="text-[10px] font-mono font-semibold tracking-[0.14em] uppercase transition-colors duration-500"
                style={{
                  color: live
                    ? "rgba(255,255,255,0.55)"
                    : "rgba(255,255,255,0.2)",
                }}
              >
                {label}
              </span>
            </span>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}
