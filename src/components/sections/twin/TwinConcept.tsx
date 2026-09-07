"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Layers, History } from "lucide-react";
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
import {
  EASE,
  Flow,
  NoteLine,
  Section,
} from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 02 — Product concept.
 *
 * The facility is real; its information is scattered. This section answers
 * that by building the model up one layer at a time, in the order the product
 * actually builds it: geometry, then the assets that sit in it, then the live
 * data those assets emit, then the meaning drawn out of it.
 *
 * The drawing is the same Warehouse 01 as the hero — every coordinate comes
 * from `twin-plan.ts`, so the building here and the building in the 3D scene
 * are one building. Nothing is random, so the server and the client agree.
 */

const LAYERS = [
  {
    key: "geometry",
    label: "Geometry",
    note: "The shell, the columns, the docks, the walkways. The building, measured.",
  },
  {
    key: "assets",
    label: "Assets",
    note: "104 bays, each with an address the whole operation agrees on.",
  },
  {
    key: "live",
    label: "Live data",
    note: "Sensing nodes and the routes equipment actually runs.",
  },
  {
    key: "intelligence",
    label: "Intelligence",
    note: "Open events, in the place and the context they happened.",
  },
] as const;

const TRIPLET = [
  {
    icon: MapPin,
    title: "Every asset gets a place",
    body: "A rack, a pallet, a truck, a sensor — each one resolves to a location the rest of the system can point at.",
  },
  {
    icon: Layers,
    title: "Every event gets context",
    body: "An impact is not a reading. It is this upright, in this aisle, next to this route, under this load.",
  },
  {
    icon: History,
    title: "Every change gets history",
    body: "What the facility looked like last quarter is still there, so you can see what moved and when.",
  },
];

const SPINE = ["Model", "Tag", "Simulate", "Connect", "Operate", "Learn"];

const HOLD_MS = 2000;

function Plan({ level }: { level: number }) {
  const on = (n: number) => (level >= n ? 1 : 0);

  return (
    <svg
      viewBox={`0 0 ${PLAN.w} ${PLAN.h}`}
      className="w-full h-auto block"
      role="img"
      aria-label="Warehouse 01, built up as geometry, assets, live data and intelligence"
    >
      {/* ── 0 · geometry ─────────────────────────────── */}
      <g
        style={{
          opacity: on(0),
          transition: "opacity .6s ease",
        }}
      >
        <rect
          x={SHELL.x}
          y={SHELL.y}
          width={SHELL.w}
          height={SHELL.h}
          fill="none"
          stroke="rgba(8,8,10,0.42)"
          strokeWidth="1.4"
        />
        {DOCKS.map((y) => (
          <rect
            key={`d-${y}`}
            x={DOCK.x}
            y={y}
            width={DOCK.w}
            height={DOCK.h}
            fill="rgba(8,8,10,0.10)"
            stroke="rgba(8,8,10,0.32)"
            strokeWidth="1"
          />
        ))}
        {COLUMNS.map((x) => (
          <g key={`c-${x}`}>
            <rect
              x={x - 3}
              y={SHELL.y - 3}
              width="6"
              height="6"
              fill="rgba(8,8,10,0.32)"
            />
            <rect
              x={x - 3}
              y={SHELL.y + SHELL.h - 3}
              width="6"
              height="6"
              fill="rgba(8,8,10,0.32)"
            />
          </g>
        ))}
        {WALKWAYS.map(([x, y, w, h]) => (
          <rect
            key={`w-${x}-${y}`}
            x={x}
            y={y}
            width={w}
            height={h}
            fill="#16A34A"
            opacity="0.5"
          />
        ))}
      </g>

      {/* ── 1 · assets ───────────────────────────────── */}
      <g style={{ opacity: on(1), transition: "opacity .6s ease .05s" }}>
        {ZONES.map(([x, y, w, h, label, restricted]) => (
          <g key={label}>
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              fill={restricted ? "#C6413A" : "#08080A"}
              opacity={restricted ? 0.09 : 0.05}
              stroke={
                restricted ? "rgba(198,65,58,0.4)" : "rgba(8,8,10,0.22)"
              }
              strokeWidth="1"
              strokeDasharray="4 3"
            />
            <text
              x={x + 7}
              y={y + 15}
              fontSize="9"
              fontFamily="var(--font-mono), monospace"
              letterSpacing="0.5"
              fill="rgba(8,8,10,0.45)"
            >
              {label.toUpperCase()}
            </text>
          </g>
        ))}
        {BAY_Y.map((y, r) =>
          BAY_X.map((x, c) => (
            <rect
              key={`b-${r}-${c}`}
              x={x}
              y={y}
              width={BAY.w}
              height={BAY.h}
              fill="#08080A"
              fillOpacity="0.06"
              stroke="rgba(8,8,10,0.26)"
              strokeWidth="0.8"
              style={{
                opacity: level >= 1 ? 1 : 0,
                transition: `opacity .35s ease ${((r * 13 + c) % 26) * 0.014}s`,
              }}
            />
          )),
        )}
      </g>

      {/* ── 2 · live data ────────────────────────────── */}
      <g style={{ opacity: on(2), transition: "opacity .6s ease .05s" }}>
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
            {level >= 2 && (
              <circle r="4" fill="#FF6A00">
                <animateMotion
                  dur={`${7 + i * 1.6}s`}
                  repeatCount="indefinite"
                  path={d}
                />
              </circle>
            )}
          </g>
        ))}
        {SENSORS.map(([x, y], i) => (
          <g key={`s-${x}-${y}`}>
            <circle
              cx={x}
              cy={y}
              r="9"
              fill="none"
              stroke="#16A34A"
              strokeOpacity="0.35"
            >
              {level >= 2 && (
                <>
                  <animate
                    attributeName="r"
                    values="5;13"
                    dur="2.6s"
                    begin={`${(i % 4) * 0.55}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stroke-opacity"
                    values="0.5;0"
                    dur="2.6s"
                    begin={`${(i % 4) * 0.55}s`}
                    repeatCount="indefinite"
                  />
                </>
              )}
            </circle>
            <circle cx={x} cy={y} r="3" fill="#16A34A" />
          </g>
        ))}
      </g>

      {/* ── 3 · intelligence ─────────────────────────── */}
      <g style={{ opacity: on(3), transition: "opacity .6s ease .05s" }}>
        {EVENTS.map(([x, y, c], i) => (
          <g key={`e-${x}-${y}`}>
            <circle cx={x} cy={y} r="16" fill={c} opacity="0.1" />
            <circle
              cx={x}
              cy={y}
              r="7"
              fill="none"
              stroke={c}
              strokeWidth="1.4"
            >
              {level >= 3 && (
                <animate
                  attributeName="stroke-opacity"
                  values="1;0.25;1"
                  dur="1.9s"
                  begin={`${i * 0.4}s`}
                  repeatCount="indefinite"
                />
              )}
            </circle>
            <circle cx={x} cy={y} r="2.6" fill={c} />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function TwinConcept() {
  const [level, setLevel] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (locked) return;
    const id = setInterval(
      () => setLevel((v) => (v + 1) % LAYERS.length),
      HOLD_MS,
    );
    return () => clearInterval(id);
  }, [locked]);

  return (
    <Section surface="white" id="concept">
      <SectionHeader
        eyebrow="Product concept"
        top="The physical world,"
        bottom="Digitally organised."
        size="compact"
        width="wide"
        body="Your facility is real. Its information is scattered — across spreadsheets, drawings, PLCs, WMS records and people's memory. The Digital Twin is one place where all of it resolves to the same building."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-10 items-stretch">
        {/* the model */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="overflow-hidden"
          style={{
            borderRadius: 16,
            background: "#FFFFFF",
            border: "1px solid #E4E4E9",
            boxShadow: "0 30px 70px -40px rgba(14,14,15,0.18)",
          }}
        >
          <div
            className="flex items-center gap-3 px-5 h-11 flex-wrap"
            style={{ borderBottom: "1px solid #EDEDF1", background: "#FAFAFB" }}
          >
            <span className="text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/45">
              Warehouse 01 — plan view
            </span>
            <span className="ml-auto text-[10.5px] font-mono font-semibold tracking-[0.14em] uppercase text-signal-orange">
              Layer {level + 1} / 4
            </span>
          </div>
          <div className="p-4 sm:p-6" style={{ background: "#FCFCFD" }}>
            <Plan level={level} />
          </div>
        </motion.div>

        {/* the layer switch */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="flex flex-col gap-px"
          style={{ background: "#E8E8ED", borderRadius: 12, overflow: "hidden" }}
        >
          {LAYERS.map((l, i) => {
            const active = level === i;
            const reached = level >= i;
            return (
              <button
                key={l.key}
                type="button"
                onClick={() => {
                  setLocked(true);
                  setLevel(i);
                }}
                className="text-left px-5 py-5 flex-1 transition-colors duration-300"
                style={{ background: active ? "#FFFFFF" : "#FAFAFB" }}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-300"
                    style={{
                      background: reached ? "#FF6A00" : "#D6D6DC",
                    }}
                  />
                  <span
                    className={
                      "text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase " +
                      (active ? "text-carbon" : "text-graphite/45")
                    }
                  >
                    {String(i + 1).padStart(2, "0")} · {l.label}
                  </span>
                </span>
                <span
                  className={
                    "mt-2.5 block text-[13px] leading-[1.55] transition-colors duration-300 " +
                    (active ? "text-graphite/70" : "text-graphite/40")
                  }
                >
                  {l.note}
                </span>
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* what that organisation buys you */}
      <div className="mt-16 sm:mt-20 grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "#E8E8ED" }}>
        {TRIPLET.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
            className="bg-white px-7 py-8"
          >
            <t.icon
              className="w-5 h-5 text-signal-orange"
              strokeWidth={1.6}
              aria-hidden
            />
            <h3 className="mt-5 text-[19px] font-bold leading-[1.2] tracking-[-0.02em] text-carbon">
              {t.title}
            </h3>
            <p className="mt-3 text-[14px] leading-[1.6] text-graphite/65">
              {t.body}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-14 flex flex-col items-center gap-6">
        <Flow steps={SPINE} center size="sm" />
        <NoteLine className="text-center">
          The same six moves, in the same order, whether you model one aisle or
          a network of sites.
        </NoteLine>
      </div>
    </Section>
  );
}
