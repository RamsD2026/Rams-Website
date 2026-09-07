"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BAY,
  BAY_X,
  BAY_Y,
  COLUMNS,
  DOCK,
  DOCKS,
  EVENTS,
  PLAN,
  ROUTES,
  SENSORS,
  SHELL,
  WALKWAYS,
  ZONES,
} from "./twin-plan";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 05 — See it in action.
 *
 * One switch, and the whole argument of the page. Left of it you have a
 * picture of the facility; right of it you have a view of the operation. The
 * geometry does not change — the same 104 bays, the same five docks — only
 * what is attached to it does.
 *
 * There is no Digital Twin screen recording to put here, so this is the
 * product itself: the same `twin-plan.ts` coordinates as the hero and the
 * concept section, driven live. Fixed timings, no Math.random, so a second
 * viewing matches the first.
 */

const LINE = "rgba(255,255,255,0.10)";

const LEGEND = [
  ["MHE movement", "#FF6A00"],
  ["Sensor events", "#54DE91"],
  ["Alerts", "#FF6C6C"],
  ["Zones & tasks", "rgba(255,255,255,0.45)"],
  ["Walkways", "#54DE91"],
  ["Heatmap", "#FFBE47"],
] as const;

const RECORDS = [
  {
    key: "mhe",
    label: "MHE-04",
    kind: "Reach truck",
    at: [560, 206] as const,
    rows: [
      ["Operator", "Shift B · certified"],
      ["Zone", "Aisle A3"],
      ["Speed", "6.2 km/h"],
      ["Task", "Put-away · PAL-88213"],
      ["Last service", "18 Aug 2025"],
    ],
    state: ["Active", "#54DE91"] as const,
  },
  {
    key: "rack",
    label: "RCK-A3-C07",
    kind: "Selective pallet rack",
    at: [581, 184] as const,
    rows: [
      ["Severity", "Amber"],
      ["Open observation", "Upright dent · 8 mm"],
      ["Load now", "1,980 kg / level"],
      ["Occupancy", "84%"],
      ["Action due", "12 Sep 2025"],
    ],
    state: ["Action open", "#FFBE47"] as const,
  },
  {
    key: "dock",
    label: "DOCK-03",
    kind: "Inbound dock door",
    at: [40, 271] as const,
    rows: [
      ["Status", "Open"],
      ["Vehicle", "Trailer TR-1194"],
      ["Dwell", "34 min"],
      ["Pallets in", "18 of 26"],
      ["Next slot", "10:15"],
    ],
    state: ["Occupied", "#FF6A00"] as const,
  },
  {
    key: "sensor",
    label: "IMP-A3-07",
    kind: "Impact sensor",
    at: [620, 148] as const,
    rows: [
      ["Last event", "09:42:07"],
      ["Peak force", "3.1 g"],
      ["Direction", "Front, aisle side"],
      ["Battery", "91%"],
      ["Events · 30 days", "3"],
    ],
    state: ["Alert", "#FF6C6C"] as const,
  },
];

function Plan({ live, focus }: { live: boolean; focus: readonly [number, number] }) {
  return (
    <svg
      viewBox={`0 0 ${PLAN.w} ${PLAN.h}`}
      className="w-full h-auto block"
      role="img"
      aria-label={
        live
          ? "Warehouse 01 with live data connected — moving equipment, sensor events and open alerts"
          : "Warehouse 01 as a static model — shell, racking and zones only"
      }
    >
      <defs>
        <radialGradient id="twinact-heat" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFBE47" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FFBE47" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* heat — live only */}
      <g
        style={{
          opacity: live ? 1 : 0,
          transition: "opacity .7s ease",
        }}
      >
        <ellipse cx="470" cy="212" rx="180" ry="96" fill="url(#twinact-heat)" />
        <ellipse cx="700" cy="320" rx="130" ry="76" fill="url(#twinact-heat)" />
      </g>

      {/* shell */}
      <rect
        x={SHELL.x}
        y={SHELL.y}
        width={SHELL.w}
        height={SHELL.h}
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.4"
      />
      {COLUMNS.map((x) => (
        <g key={`c-${x}`}>
          <rect
            x={x - 3}
            y={SHELL.y - 3}
            width="6"
            height="6"
            fill="rgba(255,255,255,0.45)"
          />
          <rect
            x={x - 3}
            y={SHELL.y + SHELL.h - 3}
            width="6"
            height="6"
            fill="rgba(255,255,255,0.45)"
          />
        </g>
      ))}
      {DOCKS.map((y, i) => (
        <rect
          key={`d-${y}`}
          x={DOCK.x}
          y={y}
          width={DOCK.w}
          height={DOCK.h}
          fill={live && i === 2 ? "#FF6A00" : "rgba(255,255,255,0.12)"}
          fillOpacity={live && i === 2 ? 0.7 : 1}
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1"
          style={{ transition: "fill .5s ease" }}
        />
      ))}

      {/* zones */}
      {ZONES.map(([x, y, w, h, label, restricted]) => (
        <g key={label}>
          <rect
            x={x}
            y={y}
            width={w}
            height={h}
            fill={restricted ? "#FF6C6C" : "#FFFFFF"}
            opacity={restricted ? 0.1 : 0.04}
            stroke={
              restricted ? "rgba(255,108,108,0.4)" : "rgba(255,255,255,0.28)"
            }
            strokeWidth="1"
            strokeDasharray="4 3"
          />
          <text
            x={x + 7}
            y={y + 15}
            fontSize="9"
            fontFamily="var(--font-mono), monospace"
            fill="rgba(255,255,255,0.45)"
          >
            {label.toUpperCase()}
          </text>
        </g>
      ))}

      {/* walkways */}
      {WALKWAYS.map(([x, y, w, h]) => (
        <rect
          key={`w-${x}-${y}`}
          x={x}
          y={y}
          width={w}
          height={h}
          fill="#54DE91"
          opacity={live ? 0.75 : 0.35}
          style={{ transition: "opacity .6s ease" }}
        />
      ))}

      {/* racking */}
      {BAY_Y.map((y, r) =>
        BAY_X.map((x, c) => (
          <rect
            key={`b-${r}-${c}`}
            x={x}
            y={y}
            width={BAY.w}
            height={BAY.h}
            fill="#FFFFFF"
            fillOpacity={live && (r * 13 + c) % 7 === 3 ? 0.22 : 0.07}
            stroke="rgba(255,255,255,0.34)"
            strokeWidth="0.8"
            style={{ transition: "fill-opacity .6s ease" }}
          />
        )),
      )}

      {/* ── live layer ────────────────────────────────── */}
      <g
        style={{
          opacity: live ? 1 : 0,
          transition: "opacity .6s ease",
          pointerEvents: "none",
        }}
      >
        {ROUTES.map((d, i) => (
          <g key={`r-${i}`}>
            <path
              d={d}
              fill="none"
              stroke="#FF6A00"
              strokeWidth="1.2"
              strokeOpacity="0.35"
              strokeDasharray="5 4"
            />
            {live && (
              <g>
                <circle r="5" fill="#FF6A00">
                  <animateMotion
                    dur={`${7 + i * 1.6}s`}
                    repeatCount="indefinite"
                    path={d}
                  />
                </circle>
                <circle r="11" fill="#FF6A00" fillOpacity="0.18">
                  <animateMotion
                    dur={`${7 + i * 1.6}s`}
                    repeatCount="indefinite"
                    path={d}
                  />
                </circle>
              </g>
            )}
          </g>
        ))}

        {SENSORS.map(([x, y], i) => (
          <g key={`s-${x}-${y}`}>
            <circle cx={x} cy={y} r="9" fill="none" stroke="#54DE91">
              {live && (
                <>
                  <animate
                    attributeName="r"
                    values="5;14"
                    dur="2.6s"
                    begin={`${(i % 4) * 0.55}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stroke-opacity"
                    values="0.55;0"
                    dur="2.6s"
                    begin={`${(i % 4) * 0.55}s`}
                    repeatCount="indefinite"
                  />
                </>
              )}
            </circle>
            <circle cx={x} cy={y} r="3" fill="#54DE91" />
          </g>
        ))}

        {EVENTS.map(([x, y, c], i) => {
          const colour = c === "#C6413A" ? "#FF6C6C" : "#FFBE47";
          return (
            <g key={`e-${x}-${y}`}>
              <circle cx={x} cy={y} r="16" fill={colour} opacity="0.12" />
              <circle
                cx={x}
                cy={y}
                r="7"
                fill="none"
                stroke={colour}
                strokeWidth="1.4"
              >
                {live && (
                  <animate
                    attributeName="stroke-opacity"
                    values="1;0.25;1"
                    dur="1.9s"
                    begin={`${i * 0.4}s`}
                    repeatCount="indefinite"
                  />
                )}
              </circle>
              <circle cx={x} cy={y} r="2.6" fill={colour} />
            </g>
          );
        })}
      </g>

      {/* the selected asset */}
      <g
        style={{
          transform: `translate(${focus[0]}px, ${focus[1]}px)`,
          transition: "transform .7s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <circle r="22" fill="none" stroke="#FFFFFF" strokeOpacity="0.28" />
        <circle r="4" fill="#FFFFFF" />
        <path
          d="M-30 -30 L-30 -20 M-30 -30 L-20 -30 M30 -30 L30 -20 M30 -30 L20 -30 M-30 30 L-30 20 M-30 30 L-20 30 M30 30 L30 20 M30 30 L20 30"
          stroke="#FF6A00"
          strokeWidth="1.6"
          fill="none"
        />
      </g>
    </svg>
  );
}

export function TwinAction() {
  const [live, setLive] = useState(true);
  const [r, setR] = useState(1);
  const rec = RECORDS[r];

  return (
    <Section surface="darkMid" id="action">
      <SectionHeader
        eyebrow="See it in action"
        top="A picture of the facility"
        bottom="Becomes a view of the operation."
        tone="dark"
        size="long"
        width="wide"
        body="The geometry is the same on both sides of this switch. What changes is whether anything is attached to it."
      />

      {/* the switch */}
      <div className="flex justify-center mb-10">
        <div
          className="inline-flex p-1 rounded-full"
          style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${LINE}` }}
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
                  "relative px-5 py-2.5 rounded-full text-[12px] font-semibold transition-colors duration-300 " +
                  (on ? "text-white" : "text-white/45 hover:text-white/70")
                }
              >
                {on && (
                  <motion.span
                    layoutId="twinact-switch"
                    className="absolute inset-0 rounded-full"
                    style={{ background: v ? "#FF6A00" : "rgba(255,255,255,0.12)" }}
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                )}
                <span className="relative">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 lg:gap-8 items-start">
        {/* the model */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="overflow-hidden"
          style={{
            borderRadius: 16,
            background: "#0E0E11",
            border: `1px solid ${LINE}`,
            boxShadow: "0 60px 120px -50px rgba(0,0,0,0.9)",
          }}
        >
          <div
            className="flex items-center gap-2.5 px-4 h-11 flex-wrap"
            style={{ borderBottom: `1px solid ${LINE}`, background: "#111114" }}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0 transition-colors duration-300"
              style={{ background: live ? "#54DE91" : "rgba(255,255,255,0.25)" }}
            />
            <span className="text-[11.5px] font-semibold text-white/85">
              Warehouse 01
            </span>
            <span className="ml-auto text-[10px] font-mono font-semibold tracking-[0.12em] uppercase transition-colors duration-300"
              style={{ color: live ? "#FF6A00" : "rgba(255,255,255,0.35)" }}
            >
              {live ? "Live · 6 feeds" : "Model only"}
            </span>
          </div>

          <div className="p-4 sm:p-5" style={{ background: "#0A0C0E" }}>
            <Plan live={live} focus={rec.at} />
          </div>

          <div
            className="flex items-center gap-x-5 gap-y-2 px-4 py-3 flex-wrap"
            style={{ borderTop: `1px solid ${LINE}` }}
          >
            {LEGEND.map(([label, colour]) => (
              <span key={label} className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full transition-opacity duration-300"
                  style={{ background: colour, opacity: live ? 1 : 0.25 }}
                />
                <span
                  className="text-[10px] font-mono font-semibold tracking-[0.12em] uppercase transition-colors duration-300"
                  style={{
                    color: live
                      ? "rgba(255,255,255,0.5)"
                      : "rgba(255,255,255,0.2)",
                  }}
                >
                  {label}
                </span>
              </span>
            ))}
          </div>
        </motion.div>

        {/* the record */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
        >
          <p className="text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase text-white/40 mb-4">
            Select any asset. Open its digital record.
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            {RECORDS.map((x, n) => {
              const on = n === r;
              return (
                <button
                  key={x.key}
                  type="button"
                  onClick={() => setR(n)}
                  className={
                    "px-3.5 py-2 rounded-full text-[11px] font-mono font-semibold tracking-[0.1em] uppercase transition-colors duration-250 " +
                    (on ? "text-white" : "text-white/45 hover:text-white/70")
                  }
                  style={{
                    background: on ? "rgba(255,106,0,0.14)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${on ? "rgba(255,106,0,0.34)" : LINE}`,
                  }}
                >
                  {x.label}
                </button>
              );
            })}
          </div>

          <div
            className="overflow-hidden"
            style={{
              borderRadius: 14,
              background: "rgba(255,255,255,0.025)",
              border: `1px solid ${LINE}`,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={rec.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="px-5 py-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <span>
                    <span className="block text-[17px] font-bold tracking-[-0.02em] text-white">
                      {rec.label}
                    </span>
                    <span className="block mt-1 text-[12px] text-white/45">
                      {rec.kind}
                    </span>
                  </span>
                  <span
                    className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-[0.1em] uppercase"
                    style={{
                      color: rec.state[1],
                      background: `${rec.state[1]}1F`,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: rec.state[1] }}
                    />
                    {rec.state[0]}
                  </span>
                </div>

                <div className="mt-5">
                  {rec.rows.map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-center justify-between gap-4 py-2.5"
                      style={{ borderBottom: `1px solid ${LINE}` }}
                    >
                      <span className="text-[11.5px] text-white/45">{k}</span>
                      <span className="text-[11.5px] font-semibold text-white/85 text-right tabular-nums">
                        {v}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-5 text-[11.5px] leading-[1.6] text-white/35">
                  {live
                    ? "Live. Values update as the floor does."
                    : "Static. The record exists; nothing is feeding it."}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
