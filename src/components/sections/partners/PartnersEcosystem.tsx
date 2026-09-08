"use client";

import { motion } from "framer-motion";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 04 — Technology ecosystem.
 *
 * Four kinds of source on the left, the Digital Twin in the middle, six
 * things it makes possible on the right, and a dotted line from every source
 * to the hub and from the hub to every outcome — with a lit dot travelling
 * along each.
 *
 * ── It is not the hero again ────────────────────────────────────────
 * Both are fan diagrams, and on a page that carries two of them the
 * difference has to be deliberate or the second one reads as a repeat:
 *
 *   hero        round icon chips, solid hairline wires, a Connect and a
 *               Deliver pill, and the RAMS mark at the centre. It says who
 *               takes part.
 *   this        named cards with a sub-line, dotted paths, rings behind the
 *               hub, and the Digital Twin at the centre. It says what
 *               actually flows, and every node is labelled because the point
 *               is the list, not the shape.
 *
 * ── The geometry ────────────────────────────────────────────────────
 * One SVG on a 1180 × 620 viewBox with the cards, the hub and the axis labels
 * positioned in percentages of the same box, and the container locked to
 * `aspect-ratio: 1180 / 620` so `xMidYMid meet` scales both together. Same
 * arrangement as the hero, and the same failure mode if that ratio is ever
 * allowed to drift.
 *
 * Four sources over 500 units of height leaves 59 units clear between cards;
 * six outcomes over the same leaves 21. That asymmetry is the section's
 * point — connecting a handful of systems is what produces more than a
 * handful of things — and it is why the two sides are not a matched grid.
 *
 * ── The paths start at the card edge ────────────────────────────────
 * Unlike the hero, whose wires run centre to centre under opaque chips, these
 * cards are 250 units wide: a line from a card's centre would run visibly
 * along under its own label. So each path begins at the card's inner edge and
 * ends at the hub's centre, where the hub covers it.
 *
 * ── The travelling dot ──────────────────────────────────────────────
 * Every path carries a second copy of itself with `pathLength="1"` and a
 * `0.012 1` dash, round-capped — one dot, 1.2% of the path, sliding from end
 * to end. Normalising the length is what makes ten paths of ten different
 * lengths run at one speed; without it the short ones arrive first and the
 * diagram looks broken rather than busy.
 */

const W = 1180;
const H = 620;
const HUB: [number, number] = [590, 310];
const HUB_R = 75;

/** Card geometry, in viewBox units. */
const CARD_W = 250;
const SRC_X = 145;
const DST_X = 1035;

const SOURCES: { title: string; line: string; y: number }[] = [
  { title: "Business systems", line: "WMS · ERP · MES · CMMS · TMS", y: 123 },
  { title: "Machines & telemetry", line: "MHE · PLC · automation · OEM", y: 248 },
  { title: "Sensing & vision", line: "IoT · RFID · CCTV · LiDAR", y: 373 },
  { title: "Specialist applications", line: "Safety · energy · quality", y: 498 },
];

const OUTCOMES: { title: string; line: string; y: number }[] = [
  {
    title: "Physical context",
    line: "Events tied to assets, zones and routes",
    y: 102,
  },
  {
    title: "Live visibility",
    line: "Changing conditions, in context",
    y: 185,
  },
  {
    title: "Shared history",
    line: "Asset, inspection and event records",
    y: 268,
  },
  {
    title: "Cross-module insight",
    line: "Signals combined to explain patterns",
    y: 352,
  },
  {
    title: "Operational action",
    line: "Tasks, escalation and closure",
    y: 435,
  },
  {
    title: "Customer applications",
    line: "Workflows not covered out of the box",
    y: 518,
  },
];

const HAIR = "#E8E8ED";
const DOTTED = "#D8D8E0";

const pc = (v: number, total: number) => `${(v / total) * 100}%`;

/** A horizontal-eased cubic between two points. */
function path([x1, y1]: [number, number], [x2, y2]: [number, number]) {
  const dx = (x2 - x1) * 0.55;
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

function Card({
  title,
  line,
  x,
  y,
  i,
}: {
  title: string;
  line: string;
  x: number;
  y: number;
  i: number;
}) {
  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: pc(x, W), top: pc(y, H), width: pc(CARD_W, W) }}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay: 0.1 + i * 0.06, ease: EASE }}
    >
      <div
        className="px-4 py-3 bg-white"
        style={{
          borderRadius: 10,
          border: `1px solid ${HAIR}`,
          boxShadow: "0 1px 2px rgba(0,0,0,0.02), 0 6px 16px -10px rgba(0,0,0,0.10)",
        }}
      >
        <span className="block text-[13.5px] font-semibold tracking-[-0.015em] text-carbon leading-[1.25] truncate">
          {title}
        </span>
        <span className="block mt-1 text-[11px] font-mono text-graphite/50 leading-[1.4] truncate">
          {line}
        </span>
      </div>
    </motion.div>
  );
}

function Hub() {
  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        left: pc(HUB[0], W),
        top: pc(HUB[1], H),
        width: pc(HUB_R * 2, W),
        aspectRatio: "1",
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div
        className="flex flex-col items-center justify-center w-full h-full text-center"
        style={{
          borderRadius: 999,
          background: "#14161A",
          boxShadow:
            "0 24px 48px -22px rgba(0,0,0,0.45), 0 0 0 10px rgba(255,255,255,0.9)",
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
        <span className="mt-2 text-[12px] sm:text-[13px] font-semibold tracking-[-0.02em] text-white leading-[1.2]">
          Digital
          <br />
          Twin
        </span>
      </div>
    </motion.div>
  );
}

export function PartnersEcosystem() {
  const wires: { d: string; delay: number }[] = [
    ...SOURCES.map((s, i) => ({
      d: path([SRC_X + CARD_W / 2, s.y], HUB),
      delay: i * 0.5,
    })),
    ...OUTCOMES.map((o, i) => ({
      d: path(HUB, [DST_X - CARD_W / 2, o.y]),
      delay: 1.2 + i * 0.4,
    })),
  ];

  return (
    <Section surface="offWhite" id="ecosystem">
      <style>{`
        .ptreco-dot {
          stroke-dasharray: 0.012 1;
          stroke-dashoffset: 1.012;
          animation: ptreco-run 4s linear infinite;
        }
        @keyframes ptreco-run { to { stroke-dashoffset: 0; } }
        @media (prefers-reduced-motion: reduce) {
          .ptreco-dot { animation: none; opacity: 0; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Technology ecosystem"
        top="Bring partner technology into"
        bottom="The same operating context."
        size="compact"
        width="wide"
        body="RAMS can sit between the physical environment and operational applications — connecting supported devices, customer systems and analytical services around assets and locations."
        className="!mb-10 sm:!mb-12"
      />

      {/* ── wide ───────────────────────────────────────── */}
      <div
        className="relative w-full hidden lg:block"
        style={{ aspectRatio: `${W} / ${H}` }}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 w-full h-full"
          fill="none"
          aria-hidden
        >
          {/* rings behind the hub */}
          {[HUB_R + 55, HUB_R + 110, HUB_R + 170].map((r, i) => (
            <circle
              key={r}
              cx={HUB[0]}
              cy={HUB[1]}
              r={r}
              stroke="#EAEAEF"
              strokeWidth={1}
              opacity={1 - i * 0.28}
            />
          ))}

          {wires.map((w, i) => (
            <g key={i}>
              <path
                d={w.d}
                stroke={DOTTED}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeDasharray="1 8"
              />
              <path
                d={w.d}
                pathLength={1}
                stroke="#FF6A00"
                strokeWidth={5}
                strokeLinecap="round"
                className="ptreco-dot"
                style={{ animationDelay: `${w.delay}s` }}
              />
            </g>
          ))}
        </svg>

        {/* The axis labels, set vertically. Every part of the transform is
            inline: an inline `transform` replaces the one Tailwind's
            `-translate-y-1/2` writes, so mixing the two silently drops the
            centring. */}
        <span
          aria-hidden
          className="absolute text-[9.5px] font-mono font-bold tracking-[0.3em] uppercase text-graphite/35"
          style={{
            left: 0,
            top: "50%",
            writingMode: "vertical-rl",
            transform: "translate(-140%, -50%) rotate(180deg)",
          }}
        >
          Sources
        </span>
        <span
          aria-hidden
          className="absolute text-[9.5px] font-mono font-bold tracking-[0.3em] uppercase text-graphite/35"
          style={{
            right: 0,
            top: "50%",
            writingMode: "vertical-rl",
            transform: "translate(140%, -50%)",
          }}
        >
          Outcomes
        </span>

        {SOURCES.map((s, i) => (
          <Card key={s.title} {...s} x={SRC_X} i={i} />
        ))}
        {OUTCOMES.map((o, i) => (
          <Card key={o.title} {...o} x={DST_X} i={i} />
        ))}

        <Hub />
      </div>

      {/* ── narrow ─────────────────────────────────────── */}
      <div className="lg:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SOURCES.map((s) => (
            <div
              key={s.title}
              className="px-4 py-3 bg-white"
              style={{ borderRadius: 10, border: `1px solid ${HAIR}` }}
            >
              <span className="block text-[13.5px] font-semibold tracking-[-0.015em] text-carbon leading-[1.25]">
                {s.title}
              </span>
              <span className="block mt-1 text-[11px] font-mono text-graphite/50 leading-[1.4]">
                {s.line}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center my-7">
          <span className="w-px h-8" style={{ background: HAIR }} />
          <span
            className="flex flex-col items-center justify-center text-center my-3"
            style={{
              width: 120,
              height: 120,
              borderRadius: 999,
              background: "#14161A",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
            <span className="mt-2 text-[13px] font-semibold tracking-[-0.02em] text-white leading-[1.2]">
              Digital
              <br />
              Twin
            </span>
          </span>
          <span className="w-px h-8" style={{ background: HAIR }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {OUTCOMES.map((o) => (
            <div
              key={o.title}
              className="px-4 py-3 bg-white"
              style={{ borderRadius: 10, border: `1px solid ${HAIR}` }}
            >
              <span className="block text-[13.5px] font-semibold tracking-[-0.015em] text-carbon leading-[1.25]">
                {o.title}
              </span>
              <span className="block mt-1 text-[11px] font-mono text-graphite/50 leading-[1.4]">
                {o.line}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
