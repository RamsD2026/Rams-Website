"use client";

import { motion } from "framer-motion";
import {
  BAY,
  BAY_X,
  BAY_Y,
  DOCK,
  DOCKS,
  SHELL,
  ZONES,
} from "./twin-plan";

/**
 * The one facility, drawn once and added to.
 *
 * Every step of `TwinHow` renders this same component with a higher `step`.
 * Nothing is ever swapped out — each layer becomes visible on top of the ones
 * before it, which is the whole argument of the section: the digital facility
 * is built once and everything else attaches to it.
 *
 *   step 0  shell, zones, docks, racking      — drawn in
 *   step 1  + asset tag markers
 *   step 2  + a simulated rack move, measured
 *   step 3  + connected devices, data flowing to the platform
 *   step 4  + live findings on the floor
 *   step 5  + the recurring pattern the findings resolve to
 *
 * Drawn for a light ground — the section is white, the canvas is the same
 * #F3F3F5 the cards elsewhere on this page sit on.
 *
 * Coordinates are `twin-plan.ts`, the same building as the hero's 3D scene.
 * Nothing here is random, so the server and the client agree.
 */

const X0 = BAY_X[0];
const X1 = BAY_X[BAY_X.length - 1] + BAY.w;
const RUN_W = X1 - X0;

/* One geometry, two grounds. `TwinHow` puts it on a light card; `TwinExperience`
   puts it on a dark one, and re-drawing the building twice to get there would
   be two facilities that happen to look alike. */
type Tone = "light" | "dark";

const PALETTE = {
  light: {
    line: "rgba(8,8,10,0.30)",
    rack: "#3E63DD",
    dock: "rgba(8,8,10,0.22)",
    zone: "#0E0E0F",
    zoneOpacity: 0.04,
    tag: "#0E0E0F",
    tagOpacity: 0.45,
  },
  dark: {
    line: "rgba(255,255,255,0.24)",
    rack: "#6E8BEE",
    dock: "rgba(255,255,255,0.22)",
    zone: "#FFFFFF",
    zoneOpacity: 0.045,
    tag: "#FFFFFF",
    tagOpacity: 0.55,
  },
} as const;

/** The run the simulation moves, and how far. */
const SIM_RUN = 4;
const SIM_SHIFT = 26;

const TAGS: [number, number, string][] = [
  [581, 195, "RCK-B04"],
  [212, 300, "MHE-04"],
  [46, 271, "DOCK-03"],
  [300, 84, "IMP-A3"],
  [112, 283, "ZON-BAT"],
];

const DEVICES: [number, number][] = [
  [40, 130],
  [40, 400],
  [860, 160],
  [860, 372],
  [450, 40],
];

/**
 * Travel lanes for the equipment.
 *
 * Not `twin-plan`'s `ROUTES` — those trace the paths the plan draws, and two
 * of them run along a bay edge while the third crosses the row at y=384
 * outright, so a truck riding them sits on top of the racking.
 *
 * `BAY_Y` pairs into four double-sided runs — (92,116) (184,208) (276,300)
 * (368,392), each bay 22 deep — leaving clear aisles centred on 161, 253 and
 * 345. These lanes run down the middle of those, so nothing overlaps.
 */
const LANES: { d: string; label: string; dur: string }[] = [
  { d: "M96 161 L826 161", label: "MHE 04", dur: "17s" },
  { d: "M826 253 L96 253", label: "MHE 07", dur: "21s" },
  { d: "M96 345 L826 345", label: "MHE 02", dur: "19s" },
];

const FINDINGS: [number, number, string][] = [
  [620, 148, "#E5484D"],
  [340, 404, "#E5484D"],
  [420, 236, "#E08700"],
];

/** Where the recurring pattern lands. */
const INSIGHT = { x: X0, y: BAY_Y[2], w: RUN_W, h: BAY_Y[3] + BAY.h - BAY_Y[2] };

const EASE = [0.22, 1, 0.36, 1] as const;

/** A layer that fades in once its step is reached and never leaves. */
function Layer({
  on,
  delay = 0,
  children,
}: {
  on: boolean;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <motion.g
      initial={false}
      animate={{ opacity: on ? 1 : 0 }}
      transition={{ duration: 0.55, delay: on ? delay : 0, ease: EASE }}
      style={{ pointerEvents: "none" }}
    >
      {children}
    </motion.g>
  );
}

export function TwinFacility({
  step,
  tone = "light",
  routes,
  focus,
}: {
  step: number;
  tone?: Tone;
  /** Equipment running the plan's own routes. Live view only. */
  routes?: boolean;
  /** Plan coordinates of the asset currently selected, if any. */
  focus?: readonly [number, number];
}) {
  const C = PALETTE[tone];
  return (
    <>
      <style>{`
        @keyframes twinfac-reveal {
          0%        { transform: scaleY(0); }
          100%      { transform: scaleY(1); }
        }
        @keyframes twinfac-sweep {
          0%        { transform: translateY(0);            opacity: 0; }
          10%       {                                       opacity: 1; }
          88%       { transform: translateY(${SHELL.h}px); opacity: 1; }
          100%      { transform: translateY(${SHELL.h}px); opacity: 0; }
        }
        @keyframes twinfac-ping {
          0%   { transform: scale(0.6); opacity: 0.55; }
          70%  { transform: scale(2.4); opacity: 0; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        .twinfac-reveal {
          transform-box: fill-box;
          transform-origin: top;
          animation: twinfac-reveal 2.2s cubic-bezier(0.37,0,0.24,1) both;
        }
        .twinfac-sweep {
          animation: twinfac-sweep 2.2s cubic-bezier(0.37,0,0.24,1) both;
        }
        .twinfac-ping {
          transform-box: fill-box;
          transform-origin: center;
          animation: twinfac-ping 2.4s ease-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .twinfac-reveal { animation: none; transform: scaleY(1); }
          .twinfac-sweep  { display: none; }
          .twinfac-ping   { animation: none; opacity: 0; }
        }
      `}</style>

      <svg
        viewBox="26 26 848 468"
        className="w-full h-full block"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="The facility model, with tagging, simulation, connected data, live findings and learning layered onto it"
      >
        <defs>
          <mask id="twinfac-mask">
            <rect
              key={step === 0 ? "draw" : "held"}
              className={step === 0 ? "twinfac-reveal" : undefined}
              x={SHELL.x - 10}
              y={SHELL.y - 10}
              width={SHELL.w + 20}
              height={SHELL.h + 20}
              fill="#fff"
            />
          </mask>
          <linearGradient id="twinfac-trail" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6A00" stopOpacity="0" />
            <stop offset="100%" stopColor="#FF6A00" stopOpacity="0.14" />
          </linearGradient>
        </defs>

        {/* ── the facility ─────────────────────────────── */}
        <g mask="url(#twinfac-mask)">
          {ZONES.map(([x, y, w, h, label, restricted]) => (
            <rect
              key={label}
              x={x}
              y={y}
              width={w}
              height={h}
              rx="6"
              fill={restricted ? "#E5484D" : C.zone}
              fillOpacity={restricted ? 0.09 : C.zoneOpacity}
            />
          ))}

          {DOCKS.map((y) => (
            <rect
              key={`d-${y}`}
              x={DOCK.x}
              y={y}
              width={DOCK.w}
              height={DOCK.h}
              rx="3"
              fill={C.dock}
            />
          ))}

          {BAY_Y.map((y, i) => (
            <motion.rect
              key={`r-${y}`}
              x={X0}
              width={RUN_W}
              height={BAY.h}
              rx="5"
              fill={C.rack}
              fillOpacity="0.16"
              stroke={C.rack}
              strokeOpacity="0.42"
              strokeWidth="1.5"
              initial={false}
              animate={{ y: step >= 2 && i === SIM_RUN ? y + SIM_SHIFT : y }}
              transition={{ duration: 0.9, ease: EASE }}
            />
          ))}

          <rect
            x={SHELL.x}
            y={SHELL.y}
            width={SHELL.w}
            height={SHELL.h}
            rx="6"
            fill="none"
            stroke={C.line}
            strokeWidth="2"
          />
        </g>

        {/* the sweep, step 01 only */}
        {step === 0 && (
          <g className="twinfac-sweep" key="sweep">
            <rect
              x={SHELL.x}
              y={SHELL.y - 96}
              width={SHELL.w}
              height="96"
              fill="url(#twinfac-trail)"
            />
            <rect
              x={SHELL.x}
              y={SHELL.y - 1}
              width={SHELL.w}
              height="2"
              rx="1"
              fill="#FF6A00"
            />
          </g>
        )}

        {/* ── 02 · tags ────────────────────────────────── */}
        <Layer on={step >= 1}>
          {TAGS.map(([x, y], i) => (
            <g key={`t-${x}-${y}`}>
              <circle
                cx={x}
                cy={y}
                r="7"
                fill="none"
                stroke={C.tag}
                strokeOpacity={C.tagOpacity}
                strokeWidth="1.2"
              />
              <circle cx={x} cy={y} r="3" fill={C.tag} />
              {i === 0 && step === 1 && (
                <circle
                  className="twinfac-ping"
                  cx={x}
                  cy={y}
                  r="9"
                  fill="none"
                  stroke={C.tag}
                  strokeWidth="1.5"
                />
              )}
            </g>
          ))}
        </Layer>

        {/* ── 03 · simulation ──────────────────────────── */}
        <Layer on={step >= 2} delay={0.25}>
          <rect
            x={X0 - 10}
            y={BAY_Y[SIM_RUN] - 12}
            width={RUN_W + 20}
            height={BAY.h + SIM_SHIFT + 24}
            rx="8"
            fill="rgba(255,106,0,0.07)"
            stroke="rgba(255,106,0,0.42)"
            strokeWidth="1.2"
            strokeDasharray="6 5"
          />
          <line
            x1={X0 - 22}
            x2={X0 - 22}
            y1={BAY_Y[SIM_RUN] + BAY.h}
            y2={BAY_Y[SIM_RUN] + BAY.h + SIM_SHIFT}
            stroke="#FF6A00"
            strokeWidth="1.4"
          />
          <text
            x={X0 - 30}
            y={BAY_Y[SIM_RUN] + BAY.h + SIM_SHIFT / 2 + 4}
            textAnchor="end"
            fontSize="13"
            fontWeight="600"
            fill="#D95A00"
          >
            +0.40 m
          </text>
        </Layer>

        {/* ── 04 · connected devices ───────────────────
            No wires. Curves from five perimeter points to a hub crossed the
            racking, the zones and each other, and were the busiest thing in
            the drawing while saying the least. The devices simply come alive
            in place. */}
        <Layer on={step >= 3} delay={0.3}>
          {DEVICES.map(([x, y], i) => (
            <g key={`dev-${x}-${y}`}>
              <circle
                className="twinfac-ping"
                cx={x}
                cy={y}
                r="9"
                fill="none"
                stroke="#299764"
                strokeWidth="1.4"
                style={{ animationDelay: `${i * 0.45}s` }}
              />
              <rect
                x={x - 5}
                y={y - 5}
                width="10"
                height="10"
                rx="2.5"
                fill="#299764"
              />
            </g>
          ))}
        </Layer>

        {/* equipment, in the aisles, each carrying its own tag */}
        {routes &&
          LANES.map((lane) => (
            <g key={lane.label}>
              <path
                d={lane.d}
                fill="none"
                stroke="#FF6A00"
                strokeOpacity="0.22"
                strokeWidth="1.4"
                strokeDasharray="7 6"
              />
              {/* The chip travels with the truck: `animateMotion` on the group
                  moves every child, so the label cannot drift off it. */}
              <g>
                <animateMotion
                  dur={lane.dur}
                  repeatCount="indefinite"
                  path={lane.d}
                  rotate="0"
                />
                <circle r="13" fill="#FF6A00" fillOpacity="0.16" />
                <circle r="5.5" fill="#FF6A00" />
                <g transform="translate(12,-27)">
                  <rect
                    width="78"
                    height="24"
                    rx="12"
                    fill="#0E0E11"
                    stroke="#FF6A00"
                    strokeOpacity="0.5"
                  />
                  <text
                    x="39"
                    y="16"
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="600"
                    fill="#FFFFFF"
                  >
                    {lane.label}
                  </text>
                </g>
              </g>
            </g>
          ))}

        {/* ── 05 · live findings ───────────────────────── */}
        <Layer on={step >= 4} delay={0.3}>
          {FINDINGS.map(([x, y, tint], i) => (
            <g key={`f-${x}-${y}`}>
              <circle
                className="twinfac-ping"
                cx={x}
                cy={y}
                r="10"
                fill="none"
                stroke={tint}
                strokeWidth="1.6"
                style={{ animationDelay: `${i * 0.6}s` }}
              />
              <circle cx={x} cy={y} r="9" fill={tint} fillOpacity="0.16" />
              <circle cx={x} cy={y} r="4" fill={tint} />
            </g>
          ))}
        </Layer>

        {/* the selected asset — moves to it rather than cutting */}
        {focus && (
          <motion.g
            initial={false}
            animate={{ x: focus[0], y: focus[1] }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <circle
              r="26"
              fill="none"
              stroke={C.tag}
              strokeOpacity="0.28"
              strokeWidth="1.2"
            />
            <circle r="4.5" fill="#FF6A00" />
            <path
              d="M-34 -34 L-34 -23 M-34 -34 L-23 -34 M34 -34 L34 -23 M34 -34 L23 -34 M-34 34 L-34 23 M-34 34 L-23 34 M34 34 L34 23 M34 34 L23 34"
              stroke="#FF6A00"
              strokeWidth="1.8"
              fill="none"
            />
          </motion.g>
        )}

        {/* ── 06 · the pattern ─────────────────────────── */}
        <Layer on={step >= 5} delay={0.3}>
          <rect
            x={INSIGHT.x - 12}
            y={INSIGHT.y - 12}
            width={INSIGHT.w + 24}
            height={INSIGHT.h + 24}
            rx="10"
            fill="rgba(255,106,0,0.09)"
            stroke="#FF6A00"
            strokeWidth="1.6"
          />
          <text
            x={INSIGHT.x - 16}
            y={INSIGHT.y - 20}
            fontSize="13"
            fontWeight="700"
            letterSpacing="1.6"
            fill="#D95A00"
          >
            AISLE B — RECURRING
          </text>
        </Layer>
      </svg>
    </>
  );
}
