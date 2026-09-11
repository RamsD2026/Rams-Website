"use client";

/**
 * The hero backdrop: a distribution centre from above, at estate scale.
 *
 * Built the way `TwinFacility` is built — one coordinate space, everything
 * placed by number, nothing generated at render time so the server and the
 * client agree on the first frame. The difference is scale and purpose: that
 * one is a single facility being explained; this is a building seen from far
 * enough away to be architecture rather than a diagram, which is what a
 * backdrop has to be.
 *
 * ── The plan ─────────────────────────────────────────────────────────
 * 1600 × 900, split by two main aisles — one vertical at x=800, one horizontal
 * at y=450, both 64 wide — into quadrants that are deliberately **not** the
 * same layout, because a real DC is not:
 *
 *   Q1 top-left      six horizontal double-runs, 30 bays each
 *   Q2 top-right     twelve vertical runs, narrow-aisle, 14 bays each
 *   Q3 bottom-left   four double-runs plus two small separate blocks
 *   Q4 bottom-right  six double-runs, long bays
 *
 * Every dimension comes from one set of constants — a 10px bar, a 4px pair
 * gap, a 28px aisle — so `RUN` is 24 and the pitch is 52 everywhere. Those are
 * half the first pass's, which is what doubles both the run count and the bay
 * count: 3 runs became 6, 7 vertical runs became 12, 15 bays became 30. The
 * building reads as a building rather than as a diagram of one.
 *
 * The arithmetic was checked before any of it was drawn: at this pitch six
 * runs fit above the main aisle at 418, seven fit below before the shell
 * bottom at 844, and thirteen vertical runs fit before the right wall at 1540.
 * Nothing overlaps because the numbers say so, not because it looks right.
 *
 * ── The lanes ────────────────────────────────────────────────────────
 * Every route runs down the centre of a real aisle — `RUN + AISLE/2`, so 14px
 * of clearance either side — or along a main aisle. A truck is therefore never
 * on top of racking, which is the mistake `TwinFacility`'s own comment records
 * having made with the plan's published routes.
 *
 * Ten units, ten durations chosen coprime-ish (23, 29, 19, 31, 25, 21, 27, 33,
 * 17, 35) so no two ever fall into step. `animateMotion` on a `<g>` moves the
 * marker and its chip together, so a label cannot drift off the truck it
 * belongs to.
 *
 * ── The readings ─────────────────────────────────────────────────────
 * Small chips that surface and go: an impact, a state of charge, a speed, a
 * red finding. Each fades in, holds, and fades out on its own cycle, so the
 * floor is always saying something somewhere without anything blinking. They
 * are what the platform would actually be reporting off this building, and
 * they sit on racking rather than in aisles so they never collide with a
 * truck.
 *
 * ── The tone ─────────────────────────────────────────────────────────
 * Everything is a low-alpha black on the page's own white, and it has come
 * down twice. Doubling the rack count doubled the ink, so the second pass took
 * racking 0.05 to 0.035, walls 0.10 to 0.07 and lanes 0.05 to 0.032; this one
 * takes every alpha in the file — fills, strokes, text, the truck markers and
 * the severity dots — to 85% of that, uniformly. Uniformly is the point: the
 * plan is a single object and scaling one layer alone would pull it apart.
 *
 * So racking now sits at 0.0298, walls at 0.0595, lanes at 0.0272. The only
 * colour is the trucks and the findings, both well under half strength.
 *
 * `xMidYMid slice` so it covers the hero at any ratio, and the whole thing is
 * masked from the centre outwards: strongest at the edges, gone behind the
 * heading.
 */

const W = 1600;
const H = 900;

const SHELL = { x: 60, y: 56, w: 1480, h: 788 };
const MAIN_X = 800;
const MAIN_Y = 450;
const MAIN_W = 64;

/* One set of dimensions for the whole estate — half the first pass's. */
const BAR = 10;
const PAIR = 4;
const AISLE = 28;
const RUN = BAR + PAIR + BAR; // 24
const PITCH = RUN + AISLE; // 52
/** Centre of the aisle after run `i` of a block starting at `start`. */
const lane = (start: number, i: number) => start + i * PITCH + RUN + AISLE / 2;

type Rect = { x: number; y: number; w: number; h: number };

/** A block of horizontal double-runs. */
function hBlock(
  x: number,
  wide: number,
  yStart: number,
  runs: number,
  bays: number,
): Rect[] {
  const gap = 4;
  const bw = (wide - gap * (bays - 1)) / bays;
  const out: Rect[] = [];
  for (let r = 0; r < runs; r++) {
    const top = yStart + r * PITCH;
    for (const y of [top, top + BAR + PAIR]) {
      for (let b = 0; b < bays; b++) {
        out.push({ x: x + b * (bw + gap), y, w: bw, h: BAR });
      }
    }
  }
  return out;
}

/** A block of vertical runs — the other half of the building. */
function vBlock(
  xStart: number,
  runs: number,
  y: number,
  tall: number,
  bays: number,
): Rect[] {
  const gap = 4;
  const bh = (tall - gap * (bays - 1)) / bays;
  const out: Rect[] = [];
  for (let r = 0; r < runs; r++) {
    const left = xStart + r * PITCH;
    for (const x of [left, left + BAR + PAIR]) {
      for (let b = 0; b < bays; b++) {
        out.push({ x, y: y + b * (bh + gap), w: BAR, h: bh });
      }
    }
  }
  return out;
}

const RACKS: Rect[] = [
  ...hBlock(130, 610, 120, 6, 30), // Q1
  ...vBlock(880, 12, 118, 264, 14), // Q2
  ...hBlock(130, 380, 500, 6, 19), // Q3 main
  ...hBlock(540, 190, 500, 4, 9), // Q3 small
  ...hBlock(880, 600, 500, 6, 28), // Q4
];

/** Docks on the left wall, and one bank on the right. */
const DOCKS_L = [140, 224, 308, 560, 644, 728];
const DOCKS_R = [180, 264, 600, 684];

type Lane = { d: string; label: string; dur: number };

/* Every path below rides `lane(...)`, so each one is the centre of an aisle
   the blocks above actually leave. */
const LANES: Lane[] = [
  {
    d: `M140 ${lane(120, 0)} H744 V${MAIN_Y} H${W - 150}`,
    label: "MHE 04",
    dur: 23,
  },
  {
    d: `M${W - 150} ${lane(120, 1)} H840 V${MAIN_Y} H140`,
    label: "MHE 07",
    dur: 29,
  },
  { d: `M140 ${lane(120, 3)} H744`, label: "MHE 12", dur: 27 },
  { d: `M744 ${lane(120, 4)} H140`, label: "MHE 15", dur: 33 },
  {
    d: `M${lane(880, 0)} 110 V400 H${lane(880, 4)} V110`,
    label: "MHE 11",
    dur: 19,
  },
  {
    d: `M${lane(880, 7)} 110 V400 H${lane(880, 10)} V110`,
    label: "MHE 18",
    dur: 17,
  },
  {
    d: `M140 ${lane(500, 0)} H720 V${MAIN_Y} H${MAIN_X}`,
    label: "MHE 02",
    dur: 31,
  },
  { d: `M140 ${lane(500, 3)} H500`, label: "MHE 06", dur: 35 },
  {
    d: `M${W - 150} ${lane(500, 2)} H880 V${lane(500, 0)} H${W - 150}`,
    label: "MHE 09",
    dur: 25,
  },
  { d: `M${MAIN_X} 110 V${H - 110}`, label: "MHE 05", dur: 21 },
];

/** Readings, on racking rather than in aisles so they never meet a truck. */
const READINGS: {
  x: number;
  y: number;
  text: string;
  tone: "note" | "warn" | "crit";
  dur: number;
  begin: number;
}[] = [
  { x: 300, y: 168, text: "2.1 g impact", tone: "crit", dur: 11, begin: 0 },
  { x: 610, y: 272, text: "SOC 72%", tone: "note", dur: 13, begin: 2.5 },
  { x: 1020, y: 196, text: "6.4 km/h", tone: "note", dur: 9, begin: 5 },
  { x: 1290, y: 320, text: "Aisle 07", tone: "note", dur: 15, begin: 1.2 },
  { x: 250, y: 616, text: "B-14 red", tone: "crit", dur: 12, begin: 6.4 },
  { x: 980, y: 664, text: "38 °C", tone: "warn", dur: 10, begin: 3.8 },
  { x: 1330, y: 560, text: "SLA 92%", tone: "note", dur: 14, begin: 8.1 },
  { x: 600, y: 380, text: "12 dwell", tone: "warn", dur: 16, begin: 4.6 },
];

const TONE = {
  note: "rgba(20,22,26,0.289)",
  warn: "#D9822B",
  crit: "#C6413A",
} as const;

const LINE = "rgba(20,22,26,0.0595)";
const RACK_F = "rgba(20,22,26,0.0298)";
const RACK_S = "rgba(20,22,26,0.0425)";
const LANE_S = "rgba(20,22,26,0.0272)";
const ORANGE = "#FF6A00";

/** Strongest at the edges, gone behind the heading. */
const FADE =
  "radial-gradient(58% 52% at 50% 34%, transparent 0%, rgba(0,0,0,0.55) 44%, #000 74%)";

/**
 * The plan also dissolves toward the hero’s foot.
 *
 * `xMidYMid slice` scales the plan to cover the hero, and at most widths that
 * puts the shell’s bottom wall almost exactly on the hero’s bottom edge —
 * where `FADE` is at full strength — so it drew a grey hairline across the
 * page right where the next section begins. Intersecting a bottom fade with
 * `FADE` takes the whole plan out before that edge rather than deleting the
 * wall, which would leave the side walls stopping in mid-air. The logo strip
 * sits on clean ground as a result, the way the resources heroes dissolve
 * their tiles above theirs.
 */
const FOOT = "linear-gradient(to bottom, #000 0%, #000 74%, transparent 92%)";

export function AboutFacility() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        WebkitMaskImage: `${FADE}, ${FOOT}`,
        maskImage: `${FADE}, ${FOOT}`,
        WebkitMaskComposite: "source-in",
        maskComposite: "intersect",
      }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
      >
        {/* shell */}
        <rect
          x={SHELL.x}
          y={SHELL.y}
          width={SHELL.w}
          height={SHELL.h}
          fill="none"
          stroke={LINE}
          strokeWidth="2"
          rx="4"
        />

        {/* main aisles, as the floor markings a DC actually paints */}
        <rect
          x={MAIN_X - MAIN_W / 2}
          y={SHELL.y}
          width={MAIN_W}
          height={SHELL.h}
          fill="rgba(20,22,26,0.011)"
        />
        <rect
          x={SHELL.x}
          y={MAIN_Y - MAIN_W / 2}
          width={SHELL.w}
          height={MAIN_W}
          fill="rgba(20,22,26,0.011)"
        />

        {/* dock doors */}
        {DOCKS_L.map((y) => (
          <rect
            key={`dl${y}`}
            x={SHELL.x - 5}
            y={y}
            width={10}
            height={46}
            fill="rgba(20,22,26,0.0467)"
            rx="2"
          />
        ))}
        {DOCKS_R.map((y) => (
          <rect
            key={`dr${y}`}
            x={SHELL.x + SHELL.w - 5}
            y={y}
            width={10}
            height={46}
            fill="rgba(20,22,26,0.0467)"
            rx="2"
          />
        ))}

        {/* racking */}
        {RACKS.map((r, i) => (
          <rect
            key={i}
            x={r.x}
            y={r.y}
            width={r.w}
            height={r.h}
            fill={RACK_F}
            stroke={RACK_S}
            strokeWidth="0.5"
            rx="1"
          />
        ))}

        {/* the lanes, then the equipment running them */}
        {LANES.map((l) => (
          <g key={l.label}>
            <path
              d={l.d}
              fill="none"
              stroke={LANE_S}
              strokeWidth="1"
              strokeDasharray="7 9"
            />
            {/* The chip travels with the truck: `animateMotion` on the group
                moves every child, so the label cannot drift off it. */}
            <g>
              <animateMotion
                dur={`${l.dur}s`}
                repeatCount="indefinite"
                path={l.d}
                rotate="0"
              />
              <circle r="12" fill={ORANGE} fillOpacity="0.0467" />
              <circle r="3.4" fill={ORANGE} fillOpacity="0.357" />
              <g transform="translate(8,-17)">
                <rect
                  width="58"
                  height="17"
                  rx="8.5"
                  fill="#FFFFFF"
                  fillOpacity="0.51"
                  stroke="rgba(20,22,26,0.051)"
                />
                <text
                  x="29"
                  y="11.8"
                  textAnchor="middle"
                  fontSize="8.5"
                  fontWeight="600"
                  fill="rgba(20,22,26,0.289)"
                >
                  {l.label}
                </text>
              </g>
            </g>
          </g>
        ))}

        {/* readings, surfacing and going */}
        {READINGS.map((r) => (
          <g key={r.text} transform={`translate(${r.x},${r.y})`}>
            <animate
              attributeName="opacity"
              values="0;0;1;1;0"
              keyTimes="0;0.06;0.18;0.72;1"
              dur={`${r.dur}s`}
              begin={`${r.begin}s`}
              repeatCount="indefinite"
            />
            <rect
              width="62"
              height="17"
              rx="8.5"
              fill="#FFFFFF"
              fillOpacity="0.561"
              stroke="rgba(20,22,26,0.0595)"
            />
            <circle
              cx="9"
              cy="8.5"
              r="2.4"
              fill={TONE[r.tone]}
              fillOpacity="0.85"
            />
            <text
              x="17"
              y="11.8"
              fontSize="8.5"
              fontWeight="600"
              fill="rgba(20,22,26,0.306)"
            >
              {r.text}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
