"use client";

/**
 * Shared geometry for the RTSS warehouse Digital Twin.
 *
 * The source document builds one twin and reuses it across the hero, the
 * impact-context section, active safety, history and action. The layout, the
 * routes and the mapped events below are that document's, unchanged — only
 * the palette is moved onto the site's tokens.
 *
 * Everything here is pure geometry plus the static environment layer. The
 * animated agents and any per-section sequence live with the section that
 * runs them.
 */

/* ── the floor ───────────────────────────────────────────── */

export const TWIN_W = 800;
export const TWIN_H = 440;

/** Rack block x-origins. Each block is BW wide and BH deep from BY. */
const BLOCKS = [160, 232, 304, 376, 448, 520];
const BW = 42;
const BY = 70;
const BH = 280;

const ZONES = [
  { n: "Inbound staging", x: 52, y: 40, w: 74, h: 360, f: "#171A20" },
  { n: "Outbound staging", x: 610, y: 40, w: 90, h: 190, f: "#171A20" },
  { n: "Charging", x: 610, y: 260, w: 90, h: 130, f: "#151A19" },
  { n: "Walkway", x: 715, y: 40, w: 67, h: 130, f: "#161A1C" },
];

const DOCK_DOORS = [110, 230, 320];

/* ── event colours ───────────────────────────────────────────
   Signal, not decoration: each colour is an event class, and the
   legend in the frame is the only place they are named. Impact and
   driving use the site's dark RAG tokens; reverse is signal-orange;
   vision keeps the source's slate-blue, which has no site token. */

export type EventType = "impact" | "driving" | "vision" | "reverse";

export const EVENT_COLOR: Record<EventType, string> = {
  impact: "#FF6C6C",
  driving: "#FFBE47",
  vision: "#8FB4C9",
  reverse: "#FF6A00",
};

export const EVENT_LABEL: Record<EventType, string> = {
  impact: "Impact",
  driving: "Driving",
  vision: "Vision",
  reverse: "Reverse",
};

/* ── mapped events ───────────────────────────────────────── */

export type TwinEvent = {
  x: number;
  y: number;
  t: EventType;
  s: "high" | "med" | "low";
  z: string;
};

export const TWIN_EVENTS: TwinEvent[] = [
  { x: 505, y: 150, t: "impact", s: "high", z: "Aisle 07 · rack area" },
  { x: 217, y: 200, t: "impact", s: "med", z: "Aisle 03" },
  { x: 596, y: 250, t: "impact", s: "med", z: "Expansion joint" },
  { x: 433, y: 330, t: "impact", s: "high", z: "Aisle 07 end" },
  { x: 300, y: 55, t: "driving", s: "med", z: "Cross-aisle A" },
  { x: 500, y: 55, t: "driving", s: "low", z: "Cross-aisle A" },
  { x: 145, y: 300, t: "driving", s: "med", z: "Dock approach" },
  { x: 361, y: 370, t: "driving", s: "low", z: "Cross-aisle B" },
  { x: 660, y: 120, t: "vision", s: "high", z: "Outbound face" },
  { x: 745, y: 110, t: "vision", s: "med", z: "Walkway" },
  { x: 120, y: 203, t: "vision", s: "med", z: "Column zone" },
  { x: 600, y: 340, t: "reverse", s: "med", z: "Charging approach" },
  { x: 289, y: 300, t: "reverse", s: "low", z: "Aisle 04" },
  { x: 520, y: 250, t: "reverse", s: "med", z: "Aisle 07" },
  { x: 376, y: 120, t: "impact", s: "low", z: "Aisle 06" },
  { x: 232, y: 330, t: "driving", s: "med", z: "Aisle 03 end" },
  { x: 660, y: 200, t: "vision", s: "low", z: "Outbound staging" },
  { x: 448, y: 200, t: "impact", s: "med", z: "Aisle 07 rack" },
];

/* ── routes ──────────────────────────────────────────────── */

export type Pt = [number, number];

export type Route = {
  id: string;
  op: string;
  /** Loaded leg — drawn solid orange. */
  out: Pt[];
  /** Return leg — drawn dashed slate, i.e. travelling empty. */
  back: Pt[];
};

export const ROUTES: Route[] = [
  {
    id: "MHE 01",
    op: "Operator 04",
    out: [
      [44, 110],
      [145, 110],
      [145, 55],
      [217, 55],
      [217, 240],
    ],
    back: [
      [217, 240],
      [217, 370],
      [145, 370],
      [145, 110],
      [44, 110],
    ],
  },
  {
    id: "MHE 02",
    op: "Operator 11",
    out: [
      [289, 200],
      [289, 55],
      [600, 55],
      [600, 120],
      [660, 120],
    ],
    back: [
      [660, 120],
      [600, 120],
      [600, 370],
      [289, 370],
      [289, 200],
    ],
  },
  {
    id: "MHE 03",
    op: "Operator 22",
    out: [
      [44, 230],
      [145, 230],
      [145, 370],
      [433, 370],
      [433, 200],
    ],
    back: [
      [433, 200],
      [433, 55],
      [145, 55],
      [145, 230],
      [44, 230],
    ],
  },
  {
    id: "MHE 04",
    op: "Operator 17",
    out: [
      [505, 60],
      [505, 330],
      [560, 370],
      [600, 370],
      [600, 200],
      [660, 200],
    ],
    back: [
      [660, 200],
      [600, 200],
      [600, 55],
      [505, 55],
      [505, 60],
    ],
  },
  {
    id: "MHE 05",
    op: "Operator 09",
    out: [
      [361, 150],
      [361, 55],
      [748, 55],
      [748, 90],
    ],
    back: [
      [748, 90],
      [748, 55],
      [600, 55],
      [600, 370],
      [361, 370],
      [361, 150],
    ],
  },
  {
    id: "MHE 07",
    op: "Operator 31",
    out: [
      [44, 320],
      [145, 320],
      [145, 370],
      [289, 370],
      [289, 300],
    ],
    back: [
      [289, 300],
      [289, 55],
      [145, 55],
      [145, 320],
      [44, 320],
    ],
  },
];

/* ── polyline maths ──────────────────────────────────────── */

export const ptsOf = (a: Pt[]) => a.map((p) => `${p[0]},${p[1]}`).join(" ");

export function pathLen(a: Pt[]) {
  let L = 0;
  for (let i = 1; i < a.length; i++) {
    L += Math.hypot(a[i][0] - a[i - 1][0], a[i][1] - a[i - 1][1]);
  }
  return L;
}

/** Position and heading `d` units along the polyline. */
export function pointAt(a: Pt[], d: number) {
  let acc = 0;
  for (let i = 1; i < a.length; i++) {
    const [sx, sy] = a[i - 1];
    const [ex, ey] = a[i];
    const seg = Math.hypot(ex - sx, ey - sy);
    if (acc + seg >= d) {
      const t = (d - acc) / seg;
      return {
        x: sx + (ex - sx) * t,
        y: sy + (ey - sy) * t,
        a: (Math.atan2(ey - sy, ex - sx) * 180) / Math.PI,
      };
    }
    acc += seg;
  }
  const l = a[a.length - 1];
  return { x: l[0], y: l[1], a: 0 };
}

/* ── the static environment ──────────────────────────────── */

const TXT = "rgba(255,255,255,0.34)";

/**
 * Racks, zones, dock doors and the labelled features. Never animates.
 *
 * Drawn as six rack bars with faint bay ticks rather than sixty individually
 * stroked rectangles. The old version put a 1px border on every bay, which at
 * this scale is 60 hard edges competing with whatever is plotted on top —
 * hotspots, markers, routes. One soft bar per block reads as a rack row and
 * leaves the plot layer the only thing with contrast.
 *
 * Geometry is unchanged: block origins, zone boxes and feature positions are
 * the source document's, so anything positioned against them still lands.
 *
 * `labels` is opt-out because the two uses want different things: the impact
 * panel classifies against named features, so it needs them; a plan carrying
 * eighteen hotspots does not, and at that density the zone names collide with
 * the rack numbers.
 */
export function TwinEnv({ labels = true }: { labels?: boolean } = {}) {
  return (
    <g>
      <rect x={0} y={0} width={TWIN_W} height={TWIN_H} fill="#0A0C0E" />

      {/* zones — soft fills, no hard edge */}
      {ZONES.map((z) => (
        <g key={z.n}>
          <rect
            x={z.x}
            y={z.y}
            width={z.w}
            height={z.h}
            rx={5}
            fill="rgba(255,255,255,0.028)"
            stroke="rgba(255,255,255,0.06)"
          />
          {labels && (
            <text
              x={z.x + 8}
              y={z.y + 17}
              fill="rgba(255,255,255,0.38)"
              className="font-mono"
              fontSize={8}
            >
              {z.n.toUpperCase()}
            </text>
          )}
        </g>
      ))}

      {/* dock doors */}
      {DOCK_DOORS.map((y) => (
        <rect
          key={y}
          x={12}
          y={y - 20}
          width={26}
          height={40}
          rx={3}
          fill="rgba(255,106,0,0.16)"
        />
      ))}
      {labels && (
        <text x={12} y={404} fill={TXT} className="font-mono" fontSize={8.5}>
          DOCK
        </text>
      )}

      {/* rack rows — one bar each, bays as faint ticks inside it */}
      {BLOCKS.map((x, i) => (
        <g key={x}>
          <rect
            x={x}
            y={BY}
            width={BW}
            height={BH}
            rx={3}
            fill="rgba(255,255,255,0.055)"
            stroke="rgba(255,255,255,0.08)"
          />
          {Array.from({ length: Math.floor(BH / 28) - 1 }).map((_, k) => (
            <line
              key={k}
              x1={x + 5}
              y1={BY + (k + 1) * 28}
              x2={x + BW - 5}
              y2={BY + (k + 1) * 28}
              stroke="rgba(255,255,255,0.05)"
            />
          ))}
          {labels && (
            <text
              x={x + 2}
              y={BY - 9}
              fill={TXT}
              className="font-mono"
              fontSize={8}
            >
              R0{i + 1}
            </text>
          )}
        </g>
      ))}

      {/* expansion joint */}
      <line
        x1={596}
        y1={70}
        x2={596}
        y2={350}
        stroke="rgba(143,180,201,0.35)"
        strokeWidth={1.2}
        strokeDasharray="6 7"
      />
      {labels && (
        <text
          x={560}
          y={62}
          fill="rgba(143,180,201,0.5)"
          className="font-mono"
          fontSize={7.5}
        >
          EXPANSION JOINT
        </text>
      )}

      {/* column */}
      <rect
        x={120}
        y={196}
        width={14}
        height={14}
        rx={2}
        fill="rgba(255,255,255,0.14)"
      />
      {labels && (
        <text x={98} y={228} fill={TXT} className="font-mono" fontSize={7.5}>
          COLUMN
        </text>
      )}

      {labels && (
        <text x={484} y={366} fill={TXT} className="font-mono" fontSize={8}>
          AISLE 07
        </text>
      )}
      {labels && (
        <text x={236} y={52} fill={TXT} className="font-mono" fontSize={8}>
          CROSS-AISLE A
        </text>
      )}
    </g>
  );
}

/** Loaded routes solid, empty return legs dashed. */
export function TwinTrails() {
  return (
    <g>
      {ROUTES.map((r) => (
        <g key={r.id}>
          <polyline
            points={ptsOf(r.out)}
            fill="none"
            stroke="#FF6A00"
            strokeOpacity={0.28}
            strokeWidth={1.3}
            strokeLinejoin="round"
          />
          <polyline
            points={ptsOf(r.back)}
            fill="none"
            stroke="#6E7B8B"
            strokeOpacity={0.22}
            strokeWidth={1.1}
            strokeDasharray="5 5"
            strokeLinejoin="round"
          />
        </g>
      ))}
    </g>
  );
}
