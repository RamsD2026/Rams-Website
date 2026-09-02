"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { Check } from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
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

/**
 * The foundation.
 *
 * The claim is that everything physical attaches to one model, so the reader
 * attaches it: each control adds a layer, and the drawing takes the new
 * objects in one at a time rather than cutting to a finished picture. The
 * building never changes underneath — that is the argument.
 *
 * Nothing here resets. What you add stays added, so the end state is the
 * whole operation on one plan.
 *
 * The reader does not press anything: the layers attach as the section is
 * scrolled, one per step of a runway underneath a pinned panel. By the time
 * the runway is spent the building is complete, and the page moves on.
 */

/* The section runs on the dark ground, so the plan is light geometry on a
   dark floor rather than the other way round. */
const LINE = "rgba(255,255,255,0.10)";
const INK = "#FFFFFF";
const GREEN = "#54DE91";
const RED = "#FF6C6C";
const CARD = "#0E0E11";
const CHROME = "#111114";

type Key = "assets" | "zones" | "sensors" | "data";

const LAYERS: {
  key: Key;
  tab: string;
  label: string;
  items: string;
  caption: string;
}[] = [
  {
    key: "assets",
    tab: "Assets",
    label: "Assets",
    items:
      "Racks · MHEs · Machines · Pallets · Utilities · Equipment · Safety systems",
    caption:
      "Racks, machines, staging and work areas — each one an addressable object with an identity, not a shape on a drawing.",
  },
  {
    key: "zones",
    tab: "People & zones",
    label: "People & zones",
    items: "Operators · Pedestrian areas · Work zones · Restricted zones",
    caption:
      "Pedestrian walkways, restricted areas and work zones defined in the model, so a zone breach is a defined event rather than a judgement call.",
  },
  {
    key: "sensors",
    tab: "Sensors",
    label: "Sensors",
    items: "Location · Vision · Impact · Distance · Condition · Environmental",
    caption:
      "Fixed and mobile sensing placed against real geometry — coverage, blind spots and overlaps visible before installation.",
  },
  {
    key: "data",
    tab: "Movement & events",
    label: "Data",
    items:
      "Movement · Events · Condition · Tasks · History · Inspection · Maintenance",
    caption:
      "Movement paths, equipment positions and located events. Where things happen, and where they keep happening.",
  },
];

/* ── how a layer arrives ─────────────────────────────────
   Variants rather than per-element transitions: each layer is one motion
   group, so its children stagger in on mount and back out on removal.
   AnimatePresence can only animate an exit when the child it is watching is
   itself a motion element — which is what was wrong before.            */

const layerV = {
  hidden: { transition: { staggerChildren: 0.004, staggerDirection: -1 } },
  show: { transition: { staggerChildren: 0.012, delayChildren: 0.04 } },
};

/** Slower, for the layers that carry only a handful of objects. */
const slowV = {
  hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const itemV = {
  hidden: { opacity: 0, scale: 0.72, transition: { duration: 0.22 } },
  show: { opacity: 1, scale: 1, transition: { duration: 0.42, ease: EASE } },
};

/* A route fades in and keeps its marching dashes. It must not animate
   pathLength: framer drives that through stroke-dasharray and dashoffset,
   which is exactly what the CSS run animation is already using — the two
   write the same properties every frame and the line blinks. */
const pathV = {
  hidden: { opacity: 0, transition: { duration: 0.2 } },
  show: { opacity: 0.8, transition: { duration: 0.5, ease: EASE } },
};

/** SVG scales from its own centre only if the box is told to. */
const CENTRED = {
  transformBox: "fill-box",
  transformOrigin: "center",
} as const;

/** A label the layer leaves on the plan, so the reader sees what arrived. */
function Pop({
  x,
  y,
  text,
  colour,
  delay = 0,
}: {
  x: number;
  y: number;
  text: string;
  colour: string;
  delay?: number;
}) {
  const w = text.length * 5.7 + 28;
  return (
    <motion.g
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6, transition: { duration: 0.2 } }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      <g className="twinatt-float" style={{ animationDelay: `${delay}s` }}>
        <line
          x1={x}
          y1={y}
          x2={x}
          y2={y - 15}
          stroke={colour}
          strokeWidth={1}
          strokeOpacity={0.45}
        />
        <rect
          x={x - w / 2}
          y={y - 37}
          width={w}
          height={22}
          rx={11}
          fill="#15151B"
          stroke={colour}
          strokeOpacity={0.35}
          strokeWidth={1}
        />
        <circle cx={x - w / 2 + 13} cy={y - 26} r={3} fill={colour} />
        <text
          x={x - w / 2 + 21}
          y={y - 22}
          fontSize={10.5}
          fontFamily="ui-monospace, monospace"
          fill="#FFFFFF"
          fillOpacity={0.75}
        >
          {text}
        </text>
      </g>
    </motion.g>
  );
}

/* ── the drawing ─────────────────────────────────────────── */

function Plan({ on }: { on: Record<Key, boolean> }) {
  return (
    <svg
      viewBox={`0 0 ${PLAN.w} ${PLAN.h}`}
      className="block w-full h-auto"
      role="img"
      aria-label="Plan of the facility, with data layers attached to it"
    >
      {/* the building, always */}
      <rect
        x={SHELL.x}
        y={SHELL.y}
        width={SHELL.w}
        height={SHELL.h}
        fill="none"
        stroke={INK}
        strokeOpacity={0.4}
        strokeWidth={1.6}
      />
      {COLUMNS.map((x) =>
        [SHELL.y - 4, SHELL.y + SHELL.h - 4].map((y) => (
          <rect
            key={`c-${x}-${y}`}
            x={x}
            y={y}
            width={8}
            height={8}
            fill={INK}
            fillOpacity={0.32}
          />
        )),
      )}

      <AnimatePresence>
        {on.assets && (
          <motion.g
            key="assets"
            variants={layerV}
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            {BAY_Y.map((y) =>
              BAY_X.map((x) => (
                <motion.rect
                  key={`${x}-${y}`}
                  variants={itemV}
                  style={CENTRED}
                  x={x}
                  y={y}
                  width={BAY.w}
                  height={BAY.h}
                  fill={INK}
                  fillOpacity={0.08}
                  stroke={INK}
                  strokeOpacity={0.3}
                  strokeWidth={0.8}
                />
              )),
            )}
            {DOCKS.map((y) => (
              <motion.rect
                key={`d-${y}`}
                variants={itemV}
                style={CENTRED}
                x={DOCK.x}
                y={y}
                width={DOCK.w}
                height={DOCK.h}
                fill={INK}
                fillOpacity={0.55}
              />
            ))}
            <Pop
              x={499}
              y={92}
              text="Aisle A1 · 13 bays"
              colour="#FFFFFF"
              delay={0.8}
            />
          </motion.g>
        )}

        {on.zones && (
          <motion.g
            key="zones"
            variants={slowV}
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            {ZONES.map(([x, y, w, h, label, restricted]) => (
              <motion.rect
                key={label}
                variants={itemV}
                style={CENTRED}
                x={x}
                y={y}
                width={w}
                height={h}
                fill={restricted ? RED : INK}
                fillOpacity={restricted ? 0.14 : 0.05}
                stroke={restricted ? RED : INK}
                strokeOpacity={restricted ? 0.55 : 0.26}
                strokeWidth={0.9}
                strokeDasharray="4 3"
              />
            ))}
            {WALKWAYS.map(([x, y, w, h]) => (
              <motion.rect
                key={`w-${x}-${y}`}
                variants={itemV}
                style={CENTRED}
                x={x}
                y={y}
                width={w}
                height={h}
                fill={GREEN}
                fillOpacity={0.4}
              />
            ))}
            <Pop
              x={112}
              y={252}
              text="Restricted · Battery"
              colour={RED}
              delay={0.5}
            />
          </motion.g>
        )}

        {on.sensors && (
          <motion.g
            key="sensors"
            variants={slowV}
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            {SENSORS.map(([x, y], i) => (
              <motion.g key={`s-${x}-${y}`} variants={itemV} style={CENTRED}>
                <circle
                  cx={x}
                  cy={y}
                  r={16}
                  fill="none"
                  stroke="#FF6A00"
                  strokeOpacity={0.2}
                  strokeWidth={0.8}
                />
                <circle
                  cx={x}
                  cy={y}
                  r={9}
                  fill="none"
                  stroke="#FF6A00"
                  strokeOpacity={0.5}
                  strokeWidth={0.9}
                  className="twinatt-ping"
                  style={{ animationDelay: `${i * 0.28}s` }}
                />
                <circle cx={x} cy={y} r={4.6} fill="#FF6A00" />
              </motion.g>
            ))}
            <Pop
              x={560}
              y={470}
              text="Vision · covers A4"
              colour="#FF6A00"
              delay={0.75}
            />
          </motion.g>
        )}

        {on.data && (
          <motion.g
            key="data"
            variants={slowV}
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            {ROUTES.map((d) => (
              <motion.path
                key={d}
                d={d}
                fill="none"
                stroke="#FF6A00"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                className="twinatt-run"
                variants={pathV}
              />
            ))}
            {EVENTS.map(([x, y, c0]) => {
              const c = c0 === "#C6413A" ? RED : "#FFBE47";
              return (
                <motion.g key={`e-${x}-${y}`} variants={itemV} style={CENTRED}>
                  <circle
                    cx={x}
                    cy={y}
                    r={12}
                    fill="none"
                    stroke={c}
                    strokeWidth={1}
                    strokeOpacity={0.4}
                  />
                  <circle cx={x} cy={y} r={5.5} fill={c} fillOpacity={0.95} />
                </motion.g>
              );
            })}
            <Pop
              x={620}
              y={148}
              text="Impact · Aisle 7"
              colour={RED}
              delay={0.65}
            />
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  );
}

/* ── the section ─────────────────────────────────────────── */

/** Where in the runway each layer lands. */
const STEPS = [0.1, 0.32, 0.54, 0.76];

export function TwinAttach() {
  const still = useReducedMotion() ?? false;
  const runway = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  const { scrollYProgress } = useScroll({
    target: runway,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setCount(STEPS.filter((t) => p >= t).length);
  });

  /* Motion off means the building is simply already built. */
  const shown = still ? LAYERS.length : count;
  const on = {
    assets: shown > 0,
    zones: shown > 1,
    sensors: shown > 2,
    data: shown > 3,
  } as Record<Key, boolean>;

  const latest = shown > 0 ? LAYERS[shown - 1] : null;

  return (
    <Section surface="darkMid" id="attach" clip={false}>
      <style>{`
        @keyframes twinatt-ping {
          0%   { transform: scale(0.7); opacity: 0.75; }
          70%  { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .twinatt-ping {
          transform-box: fill-box;
          transform-origin: center;
          animation: twinatt-ping 2.6s cubic-bezier(0.22,1,0.36,1) infinite;
        }
        @keyframes twinatt-run { to { stroke-dashoffset: -40; } }
        @keyframes twinatt-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-3px); }
        }
        .twinatt-float { animation: twinatt-float 3.4s ease-in-out infinite; }
        .twinatt-run { animation: twinatt-run 1.6s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .twinatt-ping, .twinatt-run, .twinatt-float { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="The foundation"
        top="Once the facility exists digitally,"
        bottom="Everything physical can attach to it."
        body="Assets, people, zones, sensors and events stop being separate datasets. They become properties of the same place. The Digital Twin gives every data point somewhere to live."
        tone="dark"
        size="compact"
        width="wide"
        bodyWidth="wide"
      />

      {/* a runway to scroll, with the panel pinned inside it */}
      <div ref={runway} className="relative" style={{ height: "300vh" }}>
        <div className="sticky top-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center max-w-[1180px] mx-auto">
            {/* what has attached so far */}
            <div className="lg:col-span-5">
              {LAYERS.map((l, i) => {
                const added = on[l.key];
                return (
                  <div
                    key={l.key}
                    className="flex w-full items-center gap-5 py-5"
                    style={{ borderTop: i ? `1px solid ${LINE}` : undefined }}
                  >
                    <span className="min-w-0 flex-1">
                      <span
                        className="block font-rams-heading text-[17px] font-bold tracking-[-0.02em] transition-colors duration-500"
                        style={{
                          color: added ? "#FFFFFF" : "rgba(255,255,255,0.35)",
                        }}
                      >
                        {l.label}
                      </span>
                      <span
                        className="block mt-2 text-[13px] leading-[1.6] transition-colors duration-500"
                        style={{
                          color: added
                            ? "rgba(255,255,255,0.6)"
                            : "rgba(255,255,255,0.22)",
                        }}
                      >
                        {l.items}
                      </span>
                    </span>

                    <span className="flex items-center gap-3 shrink-0">
                      <span
                        className="text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase transition-colors duration-500"
                        style={{
                          color: added ? "#FF6A00" : "rgba(255,255,255,0.22)",
                        }}
                      >
                        {added ? "Attached" : "Waiting"}
                      </span>
                      <span
                        className="flex items-center justify-center w-[26px] h-[26px] rounded-full transition-colors duration-500"
                        style={{
                          background: added ? "#FF6A00" : "transparent",
                          border: `1px solid ${added ? "#FF6A00" : "rgba(255,255,255,0.18)"}`,
                        }}
                      >
                        {added && (
                          <Check
                            className="w-3.5 h-3.5 text-white"
                            strokeWidth={3}
                            aria-hidden
                          />
                        )}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-7">
              <div
                className="overflow-hidden"
                style={{
                  borderRadius: 16,
                  background: CARD,
                  border: `1px solid ${LINE}`,
                }}
              >
                <div
                  className="flex items-center justify-between gap-3 px-5 py-3.5"
                  style={{
                    borderBottom: `1px solid ${LINE}`,
                    background: CHROME,
                  }}
                >
                  <span className="text-[11.5px] font-semibold text-white/85">
                    Warehouse 01 — Digital Twin
                  </span>
                  <span className="text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase tabular-nums text-white/40">
                    {shown} / {LAYERS.length} attached
                  </span>
                </div>

                <div className="p-4 sm:p-6">
                  <Plan on={on} />
                </div>

                <div
                  className="relative px-5 py-4 min-h-[62px] flex items-center"
                  style={{ borderTop: `1px solid ${LINE}`, background: CHROME }}
                >
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={latest?.key ?? "empty"}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.32, ease: EASE }}
                      className="text-[12.5px] leading-[1.6] text-white/50"
                    >
                      {latest?.caption ?? "An empty building. Keep scrolling."}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
