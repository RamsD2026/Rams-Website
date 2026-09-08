"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Cctv,
  Cog,
  Database,
  Gauge,
  LineChart,
  Nfc,
  PackageSearch,
  Radar,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { RAMSLogo } from "@/components/ui/RAMSLogo";

/**
 * The hero flow: what partners connect on the left, the mark in the middle,
 * what the customer gets on the right.
 *
 * ── One coordinate system for the wires and everything on them ──────
 * The wires are one SVG on a 1080 × 400 viewBox and the chips, the nodes and
 * the hub are HTML positioned in percentages of that same box. They line up
 * because the container is locked to `aspect-ratio: 1080 / 400` and the SVG
 * uses the default `xMidYMid meet` — with the box and the viewBox at the same
 * ratio, `meet` scales uniformly with no letterboxing, so 330/1080 in the SVG
 * and `left: 30.56%` in HTML land on the same pixel at every width.
 *
 * Get that ratio wrong and the two drift apart as the page resizes, which is
 * the failure mode this arrangement is easy to fall into.
 *
 * ── The pulse is normalised, not measured ───────────────────────────
 * Each wire carries a second path over the hairline with a short dash running
 * along it. The twelve wires are all different lengths, so a dash array in
 * user units would travel at twelve different speeds and reach the node at
 * twelve different times. `pathLength="1"` redefines every path as one unit
 * long, so `strokeDasharray="0.055 1"` is 5.5% of *that* wire whatever its
 * real length, and one duration covers all of them.
 *
 * The delays are staggered per wire so the pulses do not arrive together.
 *
 * ── The chips sit on an arc, and that is what stops the crossings ──
 * They used to sit in two vertical columns, which put the inner chips
 * directly on the path of the outer chips' wires: a line would vanish under a
 * chip it had nothing to do with and reappear the other side, which reads as
 * a collision rather than as depth. Z-order cannot fix that — the wire is
 * behind the chip either way; the routing has to.
 *
 * So all five sit on one ellipse centred on their node, rx 280 by ry 164,
 * sampled at 75, 37.5, 0, -37.5 and -75 degrees. Every wire is then a spoke
 * from a point on that ellipse to its centre, and a spoke cannot pass through
 * another point on the same ellipse. The right-hand five are the same five
 * mirrored about x = 540, so the two fans are identical.
 *
 * The ellipse is wide rather than circular on purpose: a circle of the same
 * height would pull every chip in to x ≥ 130 and leave the outer third of the
 * canvas empty, which is the spacing problem this diagram already had once.
 *
 * ── Lines end under the things they join ────────────────────────────
 * Every wire is drawn centre-to-centre rather than edge-to-edge, and the
 * chips, the nodes and the hub are opaque and painted above the SVG. Ending a
 * line at a computed edge means recomputing it whenever a radius changes;
 * ending it underneath means never getting a gap.
 *
 * ── The middle is the mark, and nothing else ────────────────────────
 * It carried a card of rows before this — a bar, four signals and where each
 * one landed. It said the same thing the wires already say, in more ink, and
 * a card of invented rows in the middle of a hero reads as a product
 * screenshot that does not exist. One circle: everything converges on it and
 * everything leaves from it, which is the whole diagram.
 *
 * ── Below `lg` ──────────────────────────────────────────────────────
 * The canvas is 2.7:1, which on a phone is a 135px-tall strip. So the wings
 * are dropped there and the same three groups stack: the sources as a row of
 * chips, the hub, then the outcomes. Nothing is only available to a wide
 * viewport.
 */

const W = 1080;
const H = 400;

/**
 * Node centres, and the hub between them.
 *
 * These were spread across a 1180-wide box with the nodes at 250 and 930,
 * which left 226 units of bare wire between the hub and each node — more
 * empty line than diagram. The box is now 1080 and the nodes are at 330 and
 * 750, which puts 89 units between each node and the hub edge and 92 between
 * each node and the chips beside it. The three groups read as one object at
 * those numbers rather than three things sitting apart.
 *
 * The hub grew with the change: at 136 in the wider box it was small against
 * its own wires, and 150 in the narrower one is the same figure relative to
 * what surrounds it.
 */
const CONNECT: [number, number] = [330, 200];
const DELIVER: [number, number] = [750, 200];
const HUB: [number, number] = [540, 200];

/** Hub diameter, in viewBox units. */
const HUB_D = 150;

type Chip = {
  icon: typeof Radar;
  label: string;
  x: number;
  y: number;
  /** The icon's own colour — see the note under the arrays. */
  tint: string;
};

/** What a partner brings in. */
const SOURCES: Chip[] = [
  { icon: Radar, label: "IoT & sensing", x: 258, y: 42, tint: "#3E63DD" },
  { icon: Nfc, label: "RFID & location", x: 108, y: 100, tint: "#6647F0" },
  { icon: Cctv, label: "Cameras & LiDAR", x: 50, y: 200, tint: "#DB2777" },
  { icon: Cog, label: "Machines & telemetry", x: 108, y: 300, tint: "#0891B2" },
  { icon: Database, label: "WMS · ERP · CMMS", x: 258, y: 358, tint: "#0F766E" },
];

/** What the customer gets out. */
const OUTCOMES: Chip[] = [
  { icon: ShieldCheck, label: "Safety", x: 822, y: 42, tint: "#299764" },
  { icon: Gauge, label: "Productivity", x: 972, y: 100, tint: "#F76808" },
  { icon: PackageSearch, label: "Inventory", x: 1030, y: 200, tint: "#CA8A04" },
  { icon: Wrench, label: "Maintenance", x: 972, y: 300, tint: "#E5484D" },
  { icon: LineChart, label: "Management", x: 822, y: 358, tint: "#65A30D" },
];

/**
 * ── The tints ───────────────────────────────────────────────────────
 * Ten hues, one per chip, and each one written down rather than picked at
 * random: the server and the client render this markup independently, so a
 * `Math.random` here would hand them different palettes and the page would
 * flicker on hydration. That has caught this site before.
 *
 * They carry no meaning and are not a scale — they exist to make ten small
 * glyphs read as ten different things at a glance, which is what the
 * reference does with real product marks. Adjacent chips are never adjacent
 * hues, so no two neighbours blur together.
 *
 * The chip itself stays white on a hairline. Colouring the tile as well would
 * put ten filled circles on a page whose palette allows orange at 5%.
 */

const HAIR = "#E0E0E6";

/** A horizontal-eased cubic between two points. */
function wire([x1, y1]: [number, number], [x2, y2]: [number, number]) {
  const dx = (x2 - x1) * 0.5;
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

const pc = (v: number, total: number) => `${(v / total) * 100}%`;

function IconChip({
  chip,
  i,
  reduce,
}: {
  chip: Chip;
  i: number;
  reduce: boolean;
}) {
  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: pc(chip.x, W), top: pc(chip.y, H) }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={
        reduce
          ? { opacity: 1, scale: 1 }
          : { opacity: 1, scale: 1, y: [0, -5, 0] }
      }
      transition={{
        opacity: { duration: 0.5, delay: 0.6 + i * 0.09 },
        scale: { duration: 0.5, delay: 0.6 + i * 0.09 },
        y: {
          duration: 4.5 + (i % 3) * 0.7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.35,
        },
      }}
    >
      <span
        title={chip.label}
        className="flex items-center justify-center bg-white"
        style={{
          width: 44,
          height: 44,
          borderRadius: 999,
          border: `1px solid ${HAIR}`,
          boxShadow: "0 6px 18px -8px rgba(0,0,0,0.18)",
        }}
      >
        <chip.icon
          className="w-[19px] h-[19px]"
          style={{ color: chip.tint }}
          strokeWidth={1.9}
          aria-hidden
        />
      </span>
    </motion.div>
  );
}

/** The dark pill either side of the hub. */
function Node({ at, label }: { at: [number, number]; label: string }) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: pc(at[0], W), top: pc(at[1], H) }}
    >
      <span
        className="inline-flex items-center gap-2 px-4 py-2 whitespace-nowrap"
        style={{
          borderRadius: 999,
          background: "#14161A",
          boxShadow: "0 10px 26px -14px rgba(0,0,0,0.5)",
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
        <span className="text-[12px] font-semibold tracking-[-0.01em] text-white">
          {label}
        </span>
      </span>
    </div>
  );
}

/**
 * The hub: the mark, and two rings leaving it.
 *
 * It fills whatever box it is given, so the wide layout can size that box as a
 * percentage of the canvas and the stacked layout in pixels. The size is *not*
 * set here in `vw`: the canvas lives inside `rams-container`, which caps at
 * 1232 and carries padding, so a viewport unit would keep growing after the
 * canvas had stopped.
 */
function Hub() {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* two rings, half a cycle apart, so one is always leaving */}
      <span aria-hidden className="ptrflow-ring" />
      <span
        aria-hidden
        className="ptrflow-ring"
        style={{ animationDelay: "1.6s" }}
      />

      <span
        className="relative flex items-center justify-center w-full h-full"
        style={{
          borderRadius: 999,
          background: "#14161A",
          boxShadow:
            "0 22px 44px -20px rgba(0,0,0,0.45), 0 0 0 8px rgba(255,255,255,0.9)",
        }}
      >
        <RAMSLogo className="h-[26px]" variant="white" />
      </span>
    </div>
  );
}

export function PartnersFlow() {
  const reduce = useReducedMotion();

  const wires: { d: string; delay: number }[] = [
    ...SOURCES.map((s, i) => ({
      d: wire([s.x, s.y], CONNECT),
      delay: i * 0.42,
    })),
    ...OUTCOMES.map((o, i) => ({
      d: wire(DELIVER, [o.x, o.y]),
      delay: 1.1 + i * 0.42,
    })),
    { d: wire(CONNECT, HUB), delay: 0.9 },
    { d: wire(HUB, DELIVER), delay: 2.0 },
  ];

  return (
    <>
      <style>{`
        .ptrflow-pulse {
          stroke-dasharray: 0.055 1;
          stroke-dashoffset: 1.055;
          animation: ptrflow-run 3.4s linear infinite;
        }
        @keyframes ptrflow-run { to { stroke-dashoffset: 0; } }

        .ptrflow-ring {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          border: 1.5px solid rgba(255,106,0,0.55);
          pointer-events: none;
          animation: ptrflow-ring 3.2s ease-out infinite;
        }
        @keyframes ptrflow-ring {
          0%   { transform: scale(1);    opacity: 0.55; }
          100% { transform: scale(1.75); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ptrflow-pulse { animation: none; opacity: 0; }
          .ptrflow-ring { animation: none; opacity: 0; }
        }
      `}</style>

      {/* ── wide ───────────────────────────────────────── */}
      <div
        className="relative w-full hidden lg:block"
        style={{ aspectRatio: `${W} / ${H}` }}
        aria-hidden
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 w-full h-full"
          fill="none"
        >
          {wires.map((w, i) => (
            <g key={i}>
              <path d={w.d} stroke={HAIR} strokeWidth={1.25} />
              <path
                d={w.d}
                pathLength={1}
                stroke="#FF6A00"
                strokeWidth={2}
                strokeLinecap="round"
                className="ptrflow-pulse"
                style={{ animationDelay: `${w.delay}s` }}
              />
            </g>
          ))}
        </svg>

        {SOURCES.map((c, i) => (
          <IconChip key={c.label} chip={c} i={i} reduce={!!reduce} />
        ))}
        {OUTCOMES.map((c, i) => (
          <IconChip key={c.label} chip={c} i={i + 5} reduce={!!reduce} />
        ))}

        {/* Sized as a percentage of the canvas, which is the positioned
            parent — so the hub scales with the diagram rather than with the
            viewport. `aspect-ratio: 1` gives it its height from that width. */}
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            left: pc(HUB[0], W),
            top: pc(HUB[1], H),
            width: pc(HUB_D, W),
            aspectRatio: "1",
          }}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <Hub />
        </motion.div>

        <Node at={CONNECT} label="Connect" />
        <Node at={DELIVER} label="Deliver" />
      </div>

      {/* ── narrow ─────────────────────────────────────── */}
      <div className="lg:hidden flex flex-col items-center" aria-hidden>
        <div className="flex items-center justify-center gap-2.5 flex-wrap">
          {SOURCES.map((s) => (
            <span
              key={s.label}
              className="flex items-center justify-center bg-white"
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                border: `1px solid ${HAIR}`,
              }}
            >
              <s.icon
                className="w-[18px] h-[18px]"
                style={{ color: s.tint }}
                strokeWidth={1.9}
              />
            </span>
          ))}
        </div>

        <div className="my-7 w-px h-9" style={{ background: HAIR }} />

        <div style={{ width: 120, height: 120 }}>
          <Hub />
        </div>

        <div className="my-7 w-px h-9" style={{ background: HAIR }} />

        <div className="flex items-center justify-center gap-2.5 flex-wrap">
          {OUTCOMES.map((o) => (
            <span
              key={o.label}
              className="flex items-center justify-center bg-white"
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                border: `1px solid ${HAIR}`,
              }}
            >
              <o.icon
                className="w-[18px] h-[18px]"
                style={{ color: o.tint }}
                strokeWidth={1.9}
              />
            </span>
          ))}
        </div>
      </div>

      {/* The diagram is decorative; this is what it says, for anything that
          cannot see it. */}
      <p className="sr-only">
        Partner technology — IoT and sensing, RFID and location, cameras and
        LiDAR, machines and telemetry, and business systems — connects into
        RAMS Digital, which delivers safety, productivity, inventory,
        maintenance and management outcomes.
      </p>
    </>
  );
}
