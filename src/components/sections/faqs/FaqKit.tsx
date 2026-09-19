"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { RAMSLogo } from "@/components/ui/RAMSLogo";
import { KITS, type KitItem } from "./kit-data";

/**
 * 07 — What comes with each solution.
 *
 * Pick a solution; the diagram shows the hardware it connects on the left,
 * RAMS in the middle, and the platform modules it is delivered through on
 * the right. It is `PartnersFlow`'s drawing — one 1080 × 400 viewBox with
 * HTML positioned in percentages of it, the container locked to that ratio,
 * wires centre to centre under opaque chips, and the pulse normalised with
 * `pathLength="1"` so every wire runs at one speed. See that file for why
 * each of those holds.
 *
 * Two things differ, because this diagram changes with the tab:
 *
 *   the chips   carry their label, since a buying guide read by icon alone
 *               is a quiz — so they are pills, and the ellipse is narrower
 *               (rx 230) to keep the outer pills inside the canvas
 *   the count   is whatever the solution needs, one to five a side; the
 *               chips are sampled evenly across ±70° of the ellipse for that
 *               count, so the fan stays symmetrical at any number
 *
 * Every item comes from `kit-data`, which cites where the site says it.
 */

const W = 1080;
const H = 400;
const CONNECT: [number, number] = [330, 200];
const DELIVER: [number, number] = [750, 200];
const HUB: [number, number] = [540, 200];
const HUB_D = 150;
const RX = 230;
const RY = 158;
const HAIR = "#E0E0E6";

const pc = (v: number, total: number) => `${(v / total) * 100}%`;

function wire([x1, y1]: [number, number], [x2, y2]: [number, number]) {
  const dx = (x2 - x1) * 0.5;
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

/** Points on the node's ellipse, top to bottom, for `n` chips. */
function fan(n: number, [cx, cy]: [number, number], side: -1 | 1) {
  return Array.from({ length: n }, (_, k) => {
    const deg = n === 1 ? 0 : 70 - (k * 140) / (n - 1);
    const a = (deg * Math.PI) / 180;
    return [
      Math.round(cx + side * RX * Math.cos(a)),
      Math.round(cy - RY * Math.sin(a)),
    ] as [number, number];
  });
}

function Pill({ item, at, i }: { item: KitItem; at: [number, number]; i: number }) {
  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: pc(at[0], W), top: pc(at[1], H) }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
    >
      <span
        className="inline-flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 bg-white whitespace-nowrap"
        style={{
          borderRadius: 999,
          border: `1px solid ${HAIR}`,
          boxShadow: "0 6px 18px -8px rgba(0,0,0,0.18)",
        }}
      >
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
          style={{ background: `${item.tint}14` }}
        >
          <item.icon
            className="w-[15px] h-[15px]"
            style={{ color: item.tint }}
            strokeWidth={2}
            aria-hidden
          />
        </span>
        <span className="text-[12.5px] font-semibold tracking-[-0.01em] text-carbon">
          {item.label}
        </span>
      </span>
    </motion.div>
  );
}

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

function Hub() {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <span aria-hidden className="kitflow-ring" />
      <span aria-hidden className="kitflow-ring" style={{ animationDelay: "1.6s" }} />
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

/** The stacked list below `lg` — the same three groups, readable on a phone. */
function Stack({ title, items }: { title: string; items: KitItem[] }) {
  return (
    <div>
      <p className="text-[10.5px] font-mono font-bold tracking-[0.2em] uppercase text-graphite/45 text-center">
        {title}
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {items.map((it) => (
          <span
            key={it.label}
            className="inline-flex items-center gap-2 pl-1.5 pr-3 py-1.5 bg-white"
            style={{ borderRadius: 999, border: `1px solid ${HAIR}` }}
          >
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: `${it.tint}14` }}
            >
              <it.icon className="w-[13px] h-[13px]" style={{ color: it.tint }} strokeWidth={2} aria-hidden />
            </span>
            <span className="text-[12.5px] font-semibold text-carbon">{it.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function FaqKit() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const kit = KITS[active];

  const left = fan(kit.hardware.length, CONNECT, -1);
  const right = fan(kit.modules.length, DELIVER, 1);
  const wires = [
    ...left.map((p, i) => ({ d: wire(p, CONNECT), delay: i * 0.42 })),
    ...right.map((p, i) => ({ d: wire(DELIVER, p), delay: 1.1 + i * 0.42 })),
    { d: wire(CONNECT, HUB), delay: 0.9 },
    { d: wire(HUB, DELIVER), delay: 2.0 },
  ];

  return (
    <Section surface="offWhite" id="what-you-need">
      <style>{`
        .kitflow-pulse {
          stroke-dasharray: 0.055 1;
          stroke-dashoffset: 1.055;
          animation: kitflow-run 3.4s linear infinite;
        }
        @keyframes kitflow-run { to { stroke-dashoffset: 0; } }
        .kitflow-ring {
          position: absolute; inset: 0; border-radius: 999px;
          border: 1.5px solid rgba(255,106,0,0.55);
          pointer-events: none;
          animation: kitflow-ring 3.2s ease-out infinite;
        }
        @keyframes kitflow-ring {
          0%   { transform: scale(1);    opacity: 0.55; }
          100% { transform: scale(1.75); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .kitflow-pulse { animation: none; opacity: 0; }
          .kitflow-ring { animation: none; opacity: 0; }
        }
      `}</style>

      <SectionHeader
        eyebrow="What you need"
        top="What comes with"
        bottom="Each solution."
        size="compact"
        width="wide"
        body="Choose a solution to see the hardware it connects and the platform modules it runs on."
        className="!mb-10 sm:!mb-12"
      />

      {/* the solutions */}
      <div
        role="tablist"
        aria-label="Solutions"
        className="flex gap-2 overflow-x-auto no-scrollbar justify-start lg:justify-center pb-1"
      >
        {KITS.map((k, i) => {
          const on = i === active;
          return (
            <button
              key={k.solution}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls="kit-panel"
              onClick={() => setActive(i)}
              className={
                "shrink-0 px-4 py-2.5 rounded-full text-[13.5px] font-semibold transition-colors duration-200 " +
                (on
                  ? "bg-carbon text-white"
                  : "bg-white text-graphite/65 hover:text-carbon")
              }
              style={on ? undefined : { boxShadow: `inset 0 0 0 1px ${HAIR}` }}
            >
              {k.solution}
            </button>
          );
        })}
      </div>

      <div
        id="kit-panel"
        role="tabpanel"
        className="mt-10 sm:mt-14"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={kit.solution}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* wide */}
            <div
              className="relative w-full hidden lg:block max-w-[1080px] mx-auto"
              style={{ aspectRatio: `${W} / ${H}` }}
              aria-hidden
            >
              <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" fill="none">
                {wires.map((w, i) => (
                  <g key={i}>
                    <path d={w.d} stroke={HAIR} strokeWidth={1.25} />
                    {!reduce && (
                      <path
                        d={w.d}
                        pathLength={1}
                        stroke="#FF6A00"
                        strokeWidth={2}
                        strokeLinecap="round"
                        className="kitflow-pulse"
                        style={{ animationDelay: `${w.delay}s` }}
                      />
                    )}
                  </g>
                ))}
              </svg>

              {kit.hardware.map((it, i) => (
                <Pill key={it.label} item={it} at={left[i]} i={i} />
              ))}
              {kit.modules.map((it, i) => (
                <Pill key={it.label} item={it} at={right[i]} i={i + 5} />
              ))}

              <div
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: pc(HUB[0], W), top: pc(HUB[1], H), width: pc(HUB_D, W), aspectRatio: "1" }}
              >
                <Hub />
              </div>
              <Node at={CONNECT} label="Connect" />
              <Node at={DELIVER} label="Modules" />
            </div>

            {/* narrow */}
            <div className="lg:hidden flex flex-col items-center gap-7" aria-hidden>
              <Stack title="Connect" items={kit.hardware} />
              <div className="w-px h-8" style={{ background: HAIR }} />
              <div style={{ width: 110, height: 110 }}>
                <Hub />
              </div>
              <div className="w-px h-8" style={{ background: HAIR }} />
              <Stack title="Modules" items={kit.modules} />
            </div>

            <p className="sr-only">
              {kit.solution} connects {kit.hardware.map((h) => h.label).join(", ")} and
              runs on {kit.modules.map((m) => m.label).join(", ")}.
            </p>

            {kit.note && (
              <p className="mt-8 text-center text-[13px] leading-[1.6] text-graphite/55 max-w-[720px] mx-auto">
                {kit.note}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
}
