"use client";

import { useEffect, useState } from "react";
import {
  BAY,
  BAY_X,
  BAY_Y,
  COLUMNS,
  DOCK,
  DOCKS,
  PLAN,
  SHELL,
  WALKWAYS,
  ZONES,
} from "./twin-plan";

/**
 * The two ways in, drawn.
 *
 * `draw` builds the facility in the order a person would: shell, then
 * structure, then racking, then the zones that give it meaning. `scan`
 * arrives the other way round — a cloud of measured points that resolves into
 * the same geometry.
 *
 * Both run on one tick and both loop back to the start, so a second viewing
 * matches the first. The point cloud is generated from a fixed seed, never
 * from Math.random, so the server and the client draw the same dots.
 */

const TICK_MS = 60;
const STEPS = 100;
/** Frames held at the end before the loop restarts. */
const HOLD = 26;

/** The two grounds the plan is drawn on. */
const PALETTE = {
  light: {
    shell: "rgba(8,8,10,0.42)",
    rackStroke: "rgba(8,8,10,0.26)",
    rackFill: "#08080A",
    rackFillMax: 0.06,
    zone: "#08080A",
    zoneMax: 0.05,
    zoneStroke: "rgba(8,8,10,0.22)",
    restricted: "#C6413A",
    restrictedMax: 0.1,
    walkway: "#16A34A",
    column: "rgba(8,8,10,0.32)",
  },
  dark: {
    shell: "rgba(255,255,255,0.5)",
    rackStroke: "rgba(255,255,255,0.34)",
    rackFill: "#FFFFFF",
    rackFillMax: 0.07,
    zone: "#FFFFFF",
    zoneMax: 0.04,
    zoneStroke: "rgba(255,255,255,0.28)",
    restricted: "#FF6C6C",
    restrictedMax: 0.1,
    walkway: "#54DE91",
    column: "rgba(255,255,255,0.45)",
  },
} as const;

function useCycle(still: boolean) {
  const [t, setT] = useState(0);

  useEffect(() => {
    if (still) return;
    const id = setInterval(
      () => setT((v) => (v + 1) % (STEPS + HOLD)),
      TICK_MS,
    );
    return () => clearInterval(id);
  }, [still]);

  /* Held complete when motion is off, so the frame shows the finished model
     rather than an arbitrary point mid-build. */
  return still ? 1 : Math.min(1, t / STEPS);
}

/** 0 below `from`, 1 above `to`, eased between. */
const band = (p: number, from: number, to: number) => {
  const v = Math.min(1, Math.max(0, (p - from) / (to - from)));
  return v * v * (3 - 2 * v);
};

/* ── the measured points ─────────────────────────────────── */

/** A small deterministic generator, so the cloud is the same everywhere. */
function seeded(n: number) {
  let s = n;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const CLOUD = (() => {
  const r = seeded(20260901);
  const pts: [number, number][] = [];
  /* points along the racking, where a scanner sees the most */
  BAY_Y.forEach((y) =>
    BAY_X.forEach((x) => {
      for (let i = 0; i < 3; i++) {
        pts.push([x + r() * BAY.w, y + r() * BAY.h]);
      }
    }),
  );
  /* and along the shell */
  for (let i = 0; i < 150; i++) {
    const along = r();
    const side = Math.floor(r() * 4);
    const x =
      side === 0 || side === 2
        ? SHELL.x + along * SHELL.w
        : side === 1
          ? SHELL.x + SHELL.w
          : SHELL.x;
    const y =
      side === 1 || side === 3
        ? SHELL.y + along * SHELL.h
        : side === 0
          ? SHELL.y
          : SHELL.y + SHELL.h;
    pts.push([x + (r() - 0.5) * 6, y + (r() - 0.5) * 6]);
  }
  return pts;
})();

/* ── the drawing ─────────────────────────────────────────── */

export function TwinPlanSvg({
  mode,
  tone = "dark",
  still = false,
}: {
  mode: "draw" | "scan";
  tone?: "light" | "dark";
  still?: boolean;
}) {
  const p = useCycle(still);
  const c = PALETTE[tone];

  const drawing = mode === "draw";
  /* draw: shell → structure → racking → zones.
     scan: the cloud first, then the same geometry resolving out of it. */
  const shell = drawing ? band(p, 0, 0.18) : band(p, 0.34, 0.52);
  const structure = drawing ? band(p, 0.18, 0.38) : band(p, 0.44, 0.62);
  const racking = drawing ? band(p, 0.38, 0.74) : band(p, 0.52, 0.78);
  const zones = drawing ? band(p, 0.74, 1) : band(p, 0.7, 0.92);
  const cloud = drawing ? 0 : 1 - band(p, 0.5, 0.86);
  /* the sweep that is doing the measuring */
  const sweep = SHELL.y + (drawing ? -100 : ((p * 1.35) % 1) * (SHELL.h + 40));

  return (
    <svg
      viewBox={`0 0 ${PLAN.w} ${PLAN.h}`}
      className="block w-full h-auto"
      role="img"
      aria-label={
        drawing
          ? "The facility being drawn in the platform"
          : "A point cloud resolving into a structured model"
      }
    >
      {/* measured points */}
      {!drawing &&
        cloud > 0.01 &&
        CLOUD.map(([x, y], i) => (
          <circle
            key={i}
            cx={x.toFixed(2)}
            cy={y.toFixed(2)}
            r={1.1}
            fill="#FF6A00"
            opacity={(cloud * 0.5).toFixed(3)}
          />
        ))}

      {!drawing && cloud > 0.01 && (
        <rect
          x={SHELL.x}
          y={Math.max(SHELL.y, sweep - 3)}
          width={SHELL.w}
          height={3}
          fill="#FF6A00"
          opacity={(cloud * 0.7).toFixed(3)}
        />
      )}

      {/* shell */}
      <rect
        x={SHELL.x}
        y={SHELL.y}
        width={SHELL.w}
        height={SHELL.h}
        fill="none"
        stroke={c.shell}
        strokeWidth={1.6}
        opacity={shell.toFixed(3)}
      />

      {/* zones */}
      {ZONES.map(([x, y, w, h, label, restricted]) => (
        <rect
          key={label}
          x={x}
          y={y}
          width={w}
          height={h}
          fill={restricted ? c.restricted : c.zone}
          fillOpacity={(
            zones * (restricted ? c.restrictedMax : c.zoneMax)
          ).toFixed(3)}
          stroke={restricted ? c.restricted : c.zoneStroke}
          strokeWidth={0.9}
          strokeDasharray="4 3"
          opacity={zones.toFixed(3)}
        />
      ))}

      {/* walkway */}
      {WALKWAYS.map(([x, y, w, h]) => (
        <rect
          key={`w-${x}-${y}`}
          x={x}
          y={y}
          width={w}
          height={h}
          fill={c.walkway}
          opacity={(zones * 0.35).toFixed(3)}
        />
      ))}

      {/* racking */}
      {BAY_Y.map((y, row) =>
        BAY_X.map((x, col) => {
          /* the rows fill left to right, one after another */
          const at = (row * BAY_X.length + col) / (BAY_Y.length * BAY_X.length);
          const o = Math.min(1, Math.max(0, (racking - at * 0.85) * 6));
          return (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={BAY.w}
              height={BAY.h}
              fill={c.rackFill}
              fillOpacity={(o * c.rackFillMax).toFixed(3)}
              stroke={c.rackStroke}
              strokeWidth={0.8}
              opacity={o.toFixed(3)}
            />
          );
        }),
      )}

      {/* docks and columns */}
      <g opacity={structure.toFixed(3)}>
        {DOCKS.map((y) => (
          <rect
            key={`d-${y}`}
            x={DOCK.x}
            y={y}
            width={DOCK.w}
            height={DOCK.h}
            fill="#FF6A00"
            opacity={0.75}
          />
        ))}
        {COLUMNS.map((x) =>
          [SHELL.y - 4, SHELL.y + SHELL.h - 4].map((y) => (
            <rect
              key={`c-${x}-${y}`}
              x={x}
              y={y}
              width={8}
              height={8}
              fill={c.column}
            />
          )),
        )}
      </g>
    </svg>
  );
}
