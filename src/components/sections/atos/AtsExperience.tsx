"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  EASE,
  Section,
  frameStyle,
} from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 06 — Product experience.
 *
 * The section-six slot, on the same dark ground and with the same two-state
 * control as the Digital Twin, MEPS and IRDS: one frame, one switch, and
 * **the layout does not change between the two states.** Same four figures,
 * same four queue rows, same five resource lanes, same decision block. Only
 * the values arrive.
 *
 * What the switch does here is the product's actual argument. Left of it is
 * plan v18 — the sequence the shift started on. Right of it is the same shift
 * after one event: the inbound truck is 45 minutes late. Nothing about the
 * warehouse changed; the plan did, and the section shows exactly what moved
 * and why.
 *
 * That is why the two states are labelled by plan version rather than
 * "before / after". A replan that cannot be named and compared is not
 * traceable, and traceability is the control this product is sold on.
 *
 * No `Math.random`. Both plans are written down, so the server and the client
 * render the same first frame.
 *
 * Figures are one shift's readout, headed as such. Not a benchmark, and not a
 * customer result.
 */

const LINE = "rgba(255,255,255,0.10)";
const ORANGE = "#FF6A00";
const GREEN = "#54DE91";
const AMBER = "#E8A33D";
const RED = "#FF6C6C";

/* ── the two plans ───────────────────────────────────────
   Same shape, same length, same rows. Only the ordering, the timing and the
   reason change — which is the whole point of the switch. */

type Row = { id: string; task: string; meta: string; when: string; hot: boolean };

const V18: Row[] = [
  {
    id: "DO-4821",
    task: "Stage outbound",
    meta: "Dock 06 · 22 pallets · due 15:10",
    when: "Now",
    hot: true,
  },
  {
    id: "IN-7138",
    task: "Unload inbound",
    meta: "Dock 02 · 18 pallets · ETA 14:34",
    when: "+08m",
    hot: false,
  },
  {
    id: "RPL-092",
    task: "Replenish pick face",
    meta: "Aisle 14 · 12 moves · due 15:30",
    when: "+21m",
    hot: false,
  },
  {
    id: "PA-410",
    task: "Putaway received stock",
    meta: "Inbound buffer · 16 pallets",
    when: "+34m",
    hot: false,
  },
];

const V19: Row[] = [
  {
    id: "DO-4821",
    task: "Stage outbound",
    meta: "Dock 06 · 22 pallets · due 15:10",
    when: "Now",
    hot: true,
  },
  {
    id: "RPL-092",
    task: "Replenish pick face",
    meta: "Aisle 14 · advanced · due 15:30",
    when: "+06m",
    hot: true,
  },
  {
    id: "PA-410",
    task: "Putaway received stock",
    meta: "Inbound buffer · 16 pallets",
    when: "+19m",
    hot: false,
  },
  {
    id: "IN-7138",
    task: "Unload inbound",
    meta: "Dock 02 · ETA moved to 15:19",
    when: "+53m",
    hot: false,
  },
];

const STATS_V18: [string, string, string][] = [
  ["Planned", "186", "#FFFFFF"],
  ["Complete", "104", "#FFFFFF"],
  ["On time", "91%", GREEN],
  ["At risk", "04", RED],
];

const STATS_V19: [string, string, string][] = [
  ["Planned", "186", "#FFFFFF"],
  ["Complete", "104", "#FFFFFF"],
  ["On time", "94%", GREEN],
  ["At risk", "01", AMBER],
];

/** Five resource lanes across the shift window. */
const RESOURCES = ["MHE 04", "MHE 07", "Team B", "Dock 02", "Dock 06"];
const HOURS = ["14:00", "14:30", "15:00", "15:30", "16:00"];

/* Each lane's block, as [startPct, widthPct] in each plan. Written down so
   the two versions can be compared rather than generated. */
const LANES_V18: [number, number][] = [
  [10, 26],
  [4, 34],
  [40, 30],
  [34, 22],
  [0, 40],
];
const LANES_V19: [number, number][] = [
  [4, 32],
  [4, 34],
  [8, 26],
  [72, 22],
  [0, 40],
];

const DECISION_V18 =
  "Outbound staging is on the critical path. Replenishment sits behind the inbound unload, which is holding Team B at Dock 02.";
const DECISION_V19 =
  "Inbound is 45 minutes late. Replenishment advances, Team B is released from Dock 02, and four dependent tasks move with it. Outbound SLA is protected.";

export function AtsExperience() {
  const [v19, setV19] = useState(false);

  const rows = v19 ? V19 : V18;
  const stats = v19 ? STATS_V19 : STATS_V18;
  const lanes = v19 ? LANES_V19 : LANES_V18;

  return (
    <Section surface="ink" id="experience">
      <SectionHeader
        eyebrow="Product experience"
        top="One live view of plan,"
        bottom="Work and change."
        tone="dark"
        size="compact"
        width="wide"
        body="Supervisors see what needs to happen, why it is prioritised, who or what can execute it, and what changed since the last plan."
      />

      {/* the switch — the same two-state control the other platform pages
          open on, and here it is the argument itself: one event, one replan */}
      <div className="flex justify-center mb-4">
        <div
          className="inline-flex p-1 rounded-full"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: `1px solid ${LINE}`,
          }}
        >
          {[
            ["Plan v18", false],
            ["Truck delayed 45 min", true],
          ].map(([label, v]) => {
            const on = v19 === v;
            return (
              <button
                key={String(label)}
                type="button"
                onClick={() => setV19(v as boolean)}
                className={
                  "relative px-5 py-2.5 rounded-full text-[13px] font-semibold transition-colors duration-300 " +
                  (on ? "text-carbon" : "text-white/45 hover:text-white/75")
                }
              >
                {on && (
                  <motion.span
                    layoutId="atsexp-switch"
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

      <p className="text-center text-[12px] text-white/35 mb-10">
        A validated GPS, TMS or telematics update — or an authorised supervisor
        entry — changes operational reality.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="overflow-hidden"
        style={frameStyle("dark")}
      >
        {/* chrome */}
        <div
          className="flex items-center gap-2 px-4 py-3 flex-wrap"
          style={{ borderBottom: `1px solid ${LINE}`, background: "#111114" }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: "rgba(255,255,255,0.14)" }}
            />
          ))}
          <div
            className="ml-3 flex-1 min-w-[180px] max-w-[320px] h-6 rounded-md flex items-center px-3"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <span className="text-[10.5px] font-mono text-white/35 truncate">
              app.rams.digital/atos
            </span>
          </div>

          <span className="ml-auto shrink-0 flex items-center gap-2">
            <span className="relative flex w-1.5 h-1.5">
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ background: v19 ? ORANGE : GREEN }}
                animate={{ scale: [1, 2.8], opacity: [0.6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
              <span
                className="relative w-1.5 h-1.5 rounded-full"
                style={{ background: v19 ? ORANGE : GREEN }}
              />
            </span>
            <motion.span
              className="text-[10px] font-mono font-semibold tracking-[0.14em] uppercase"
              initial={false}
              animate={{ color: v19 ? ORANGE : "rgba(255,255,255,0.4)" }}
              transition={{ duration: 0.4 }}
            >
              {v19 ? "Plan v19 · replanned" : "Plan v18 · stable"}
            </motion.span>
          </span>
        </div>

        {/* the shift, in four numbers. Four tiles either way. */}
        <div className="flex flex-wrap" style={{ borderBottom: `1px solid ${LINE}` }}>
          {stats.map(([k, v, tint], i) => (
            <div
              key={k}
              className="flex-1 min-w-[140px] px-5 py-4"
              style={{
                borderRight: i < stats.length - 1 ? `1px solid ${LINE}` : "none",
              }}
            >
              <p className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/35">
                {k}
              </p>
              <p className="mt-2 h-[26px] text-[24px] font-bold tabular-nums tracking-[-0.03em] leading-[26px]">
                <motion.span
                  key={`${k}-${v}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05, ease: EASE }}
                  style={{ color: tint, display: "inline-block" }}
                >
                  {v}
                </motion.span>
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          {/* ── the queue ─────────────────────────────── */}
          <div
            className="p-4 sm:p-6 xl:border-r"
            style={{ borderColor: LINE }}
          >
            <div className="flex items-baseline justify-between gap-3 mb-3">
              <span className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/35">
                Priority task queue
              </span>
              <span className="text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase text-signal-orange">
                {v19 ? "6 changes" : "No changes"}
              </span>
            </div>

            {/* Four rows either way, so the column cannot change height. */}
            <div className="flex flex-col gap-2">
              {rows.map((r, i) => (
                <motion.div
                  key={`${v19 ? "v19" : "v18"}-${r.id}`}
                  layout
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07, ease: EASE }}
                  className="flex items-center gap-3 px-3.5 h-[58px] rounded-[10px]"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${r.hot ? "rgba(255,106,0,0.36)" : LINE}`,
                  }}
                >
                  <span
                    className="text-[10px] font-mono font-bold tabular-nums shrink-0"
                    style={{
                      color: r.hot ? ORANGE : "rgba(255,255,255,0.28)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12.5px] font-semibold text-white truncate">
                      {r.task} · {r.id}
                    </span>
                    <span className="mt-0.5 block text-[10.5px] font-mono text-white/35 truncate">
                      {r.meta}
                    </span>
                  </span>
                  <span
                    className="shrink-0 px-2 py-1 rounded-full text-[9.5px] font-mono font-bold tracking-[0.1em] uppercase"
                    style={{
                      background: r.hot
                        ? "rgba(255,106,0,0.14)"
                        : "rgba(255,255,255,0.05)",
                      color: r.hot ? "#FF9B4D" : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {r.when}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── the resources, across the shift ───────── */}
          <div className="p-4 sm:p-6 border-t xl:border-t-0" style={{ borderColor: LINE }}>
            <span className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/35">
              Resources · shift window
            </span>

            <div className="mt-4 flex flex-col gap-2.5">
              {RESOURCES.map((r, i) => {
                const [start, width] = lanes[i];
                return (
                  <div key={r} className="flex items-center gap-3">
                    <span className="w-[58px] shrink-0 text-[10px] font-mono text-white/45 truncate">
                      {r}
                    </span>
                    <span
                      className="relative flex-1 h-5 rounded-[5px] overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      <motion.span
                        className="absolute top-0 bottom-0 rounded-[5px]"
                        style={{
                          background:
                            i === 3 && v19
                              ? "rgba(232,163,61,0.55)"
                              : "rgba(255,106,0,0.45)",
                        }}
                        initial={false}
                        animate={{ left: `${start}%`, width: `${width}%` }}
                        transition={{ duration: 0.6, ease: EASE }}
                      />
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-2.5 flex items-center gap-3">
              <span className="w-[58px] shrink-0" />
              <span className="flex-1 flex justify-between">
                {HOURS.map((h) => (
                  <span
                    key={h}
                    className="text-[8.5px] font-mono text-white/25 tabular-nums"
                  >
                    {h}
                  </span>
                ))}
              </span>
            </div>

            {/* why the plan is what it is */}
            <div
              className="mt-5 p-4 rounded-[10px]"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${LINE}`,
              }}
            >
              <p className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-signal-orange">
                ATOS decision context
              </p>
              <p className="mt-2.5 min-h-[4.8em] text-[12.5px] leading-[1.6] text-white/50">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={v19 ? "v19" : "v18"}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="block"
                  >
                    {v19 ? DECISION_V19 : DECISION_V18}
                  </motion.span>
                </AnimatePresence>
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 py-4" style={{ borderTop: `1px solid ${LINE}` }}>
          <p className="text-[12px] leading-[1.6] text-white/35">
            Recommendations and dispatch follow configured rules, permissions
            and approvals.
          </p>
        </div>
      </motion.div>
    </Section>
  );
}
