"use client";

/**
 * The floor, from above.
 *
 * Drawn on the same anatomy as the plan views elsewhere on the site — paired
 * rack runs with an aisle between them, dock doors on the wall, structural
 * columns, named zones down one side and a pedestrian walkway — rather than a
 * few boxes. A warehouse the reader recognises is the point; a diagram of one
 * is not.
 *
 * The fleet runs the aisles, and the machine the board is flagging drives
 * itself out of its aisle and into the workshop while you watch. Every
 * position is a function of the tick, so the server and the client draw the
 * same frame and the loop returns to where it began.
 */

const W = 900;
const H = 620;

const INK = "#FFFFFF";
const GREEN = "#54DE91";
const AMBER = "#FFBE47";
const RED = "#FF6C6C";
const BLUE = "#77BDFF";

/* ── the building ────────────────────────────────────────── */

const SHELL = { x: 24, y: 24, w: 852, h: 572 };

/** Six aisles, each with a rack run either side of it. */
const RACK_Y = [56, 80, 144, 168, 232, 256, 320, 344, 408, 432, 496, 520];
const AISLE_Y = [112, 200, 288, 376, 464, 552];
/* Thirteen bays a row: the racking stops at 778 so the cross-aisle at 800
   is clear floor rather than something to drive through. */
const BAY_X = Array.from({ length: 13 }, (_, i) => 236 + i * 42);
const BAY = { w: 38, h: 22 };

const DOCKS = [56, 148, 240, 332, 424];
const COLUMNS = [232, 336, 440, 544, 648, 752, 856];

/** x, y, w, h, label, tone. */
const ZONES: [number, number, number, number, string, string][] = [
  [40, 48, 152, 128, "CHARGING", BLUE],
  [40, 188, 152, 152, "WORKSHOP", AMBER],
  [40, 352, 152, 128, "STAGING", INK],
  [40, 492, 152, 88, "PARTS", INK],
];

const WORKSHOP = ZONES[1];

type Path = [number, number][];

const ROUTES: { id: string; path: Path; speed: number; tone: string }[] = [
  {
    id: "FL-001",
    tone: GREEN,
    speed: 0.0038,
    path: [
      [214, 112],
      [800, 112],
      [800, 200],
      [214, 200],
    ],
  },
  {
    id: "FL-007",
    tone: GREEN,
    speed: 0.0029,
    path: [
      [800, 464],
      [214, 464],
      [214, 376],
      [800, 376],
    ],
  },
  {
    id: "FL-018",
    tone: AMBER,
    speed: 0.0022,
    path: [
      [214, 552],
      [800, 552],
      [800, 288],
      [214, 288],
    ],
  },
  {
    id: "FL-012",
    tone: GREEN,
    speed: 0.0034,
    path: [
      [800, 112],
      [800, 552],
      [214, 552],
      [214, 112],
    ],
  },
];

/** Out of the aisle, across the walkway, into the workshop. */
const TO_BAY: Path = [
  [500, 200],
  [214, 200],
  [214, 258],
  [116, 258],
];

/* ── geometry ────────────────────────────────────────────── */

/** A point some fraction of the way along a polyline. */
function along(path: Path, p: number): [number, number] {
  const segs = path.slice(1).map((pt, i) => {
    const a = path[i];
    return Math.hypot(pt[0] - a[0], pt[1] - a[1]);
  });
  const total = segs.reduce((a, b) => a + b, 0);
  let d = Math.min(1, Math.max(0, p)) * total;
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i] || i === segs.length - 1) {
      const f = segs[i] === 0 ? 0 : Math.min(1, d / segs[i]);
      const a = path[i];
      const b = path[i + 1];
      return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
    }
    d -= segs[i];
  }
  return path[path.length - 1];
}

const d2 = (n: number) => n.toFixed(1);

/** A machine, with its label riding above it. */
function Machine({
  x,
  y,
  id,
  tone,
  note,
}: {
  x: number;
  y: number;
  id: string;
  tone: string;
  note?: string;
}) {
  const text = note ? `${id} · ${note}` : id;
  const w = text.length * 5.2 + 22;
  return (
    <g transform={`translate(${d2(x)} ${d2(y)})`}>
      <rect
        x={-w / 2}
        y={-32}
        width={w}
        height={19}
        rx={9.5}
        fill="#0B0F13"
        stroke={tone}
        strokeOpacity={0.45}
      />
      <circle cx={-w / 2 + 10} cy={-22.5} r={2.4} fill={tone} />
      <text
        x={-w / 2 + 17}
        y={-19}
        fontSize={9}
        fontFamily="ui-monospace, monospace"
        fill="#FFFFFF"
        fillOpacity={0.8}
      >
        {text}
      </text>
      <line x1={0} y1={-13} x2={0} y2={-7} stroke={tone} strokeOpacity={0.5} />

      <circle r={10} fill={tone} fillOpacity={0.14} />
      <rect x={-5.5} y={-4.5} width={11} height={9} rx={2} fill={tone} />
    </g>
  );
}

export function FleetMap({ t }: { t: number }) {
  /* the flagged machine drives to the workshop, sits in it, and repeats */
  const bayP = Math.min(1, (t % 280) / 140);
  const [bx, by] = along(TO_BAY, bayP);
  const parked = bayP >= 1;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="block w-full h-full"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Plan view of the warehouse with the fleet moving through it"
    >
      <rect
        x={SHELL.x}
        y={SHELL.y}
        width={SHELL.w}
        height={SHELL.h}
        fill="none"
        stroke={INK}
        strokeOpacity={0.18}
        strokeWidth={1.4}
      />

      {COLUMNS.map((x) =>
        [SHELL.y - 3, SHELL.y + SHELL.h - 3].map((y) => (
          <rect
            key={`c-${x}-${y}`}
            x={x}
            y={y}
            width={6}
            height={6}
            fill={INK}
            fillOpacity={0.22}
          />
        )),
      )}

      {DOCKS.map((y) => (
        <rect
          key={`d-${y}`}
          x={18}
          y={y}
          width={9}
          height={38}
          fill={INK}
          fillOpacity={0.28}
        />
      ))}

      {ZONES.map(([x, y, w, h, label, tone]) => {
        const live = label === "WORKSHOP" && parked;
        return (
          <g key={label}>
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              fill={tone}
              fillOpacity={live ? 0.1 : 0.045}
              stroke={tone}
              strokeOpacity={live ? 0.6 : 0.28}
              strokeWidth={0.9}
              strokeDasharray="5 4"
            />
            <text
              x={x + 10}
              y={y + 16}
              fontSize={8.5}
              fontFamily="ui-monospace, monospace"
              letterSpacing={1.5}
              fill={tone}
              fillOpacity={0.75}
            >
              {label}
            </text>
          </g>
        );
      })}

      {RACK_Y.map((y) =>
        BAY_X.map((x) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width={BAY.w}
            height={BAY.h}
            fill={INK}
            fillOpacity={0.05}
            stroke={INK}
            strokeOpacity={0.13}
            strokeWidth={0.7}
          />
        )),
      )}

      {AISLE_Y.map((y, i) => (
        <text
          key={y}
          x={228}
          y={y + 3}
          textAnchor="end"
          fontSize={8}
          fontFamily="ui-monospace, monospace"
          letterSpacing={1.2}
          fill={INK}
          fillOpacity={0.3}
        >
          A{i + 1}
        </text>
      ))}

      {/* the two cross-aisles the routes turn in */}
      <rect
        x={794}
        y={SHELL.y + 8}
        width={12}
        height={SHELL.h - 16}
        fill={INK}
        fillOpacity={0.03}
      />

      {/* pedestrian walkway */}
      <rect
        x={206}
        y={SHELL.y + 8}
        width={5}
        height={SHELL.h - 16}
        fill={GREEN}
        fillOpacity={0.22}
      />

      {/* the route out of service */}
      <polyline
        points={TO_BAY.map(([x, y]) => `${x},${y}`).join(" ")}
        fill="none"
        stroke={RED}
        strokeOpacity={0.35}
        strokeWidth={1.4}
        strokeDasharray="5 6"
      />

      {ROUTES.map((r) => {
        const [x, y] = along(r.path, (t * r.speed) % 1);
        return <Machine key={r.id} x={x} y={y} id={r.id} tone={r.tone} />;
      })}

      <Machine
        x={bx}
        y={by}
        id="FL-004"
        tone={RED}
        note={parked ? "In service" : "To workshop"}
      />

      {!parked && (
        <text
          x={WORKSHOP[0] + WORKSHOP[2] / 2}
          y={WORKSHOP[1] + WORKSHOP[3] - 12}
          textAnchor="middle"
          fontSize={8.5}
          fontFamily="ui-monospace, monospace"
          letterSpacing={1.2}
          fill={AMBER}
          fillOpacity={0.45}
        >
          BAY READY
        </text>
      )}
    </svg>
  );
}
