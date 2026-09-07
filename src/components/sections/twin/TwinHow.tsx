"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TwinFacility } from "./TwinFacility";
import {
  PanelConnect,
  PanelDigitise,
  PanelLearn,
  PanelOperate,
  PanelSimulate,
  PanelTag,
} from "./TwinPanels";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 04 — How it works.
 *
 * One facility, six layers. The rail along the top is a timeline controlling a
 * single evolving demonstration, not a switch between six screens: `step` only
 * ever adds to what `TwinFacility` is already drawing, so nothing the viewer
 * has understood disappears when the step changes.
 *
 * The copy column on the left stays put. Only the right side moves — the
 * facility gains a layer, and its panel swaps for the next one.
 *
 * Every pane scrolls its rows upward on the same loop — a fixed pitch, the
 * list rendered twice, and a linear translate of one list's worth. The
 * layouts differ per step; the motion does not.
 *
 * Autoplay advances every ~7s and keeps running. Clicking a step jumps there
 * and restarts that step's dwell, so the rail always moves forward.
 *
 * Figures are illustrative of the mechanism, not measured results.
 */

const TICK_MS = 90;
const STEP_TICKS = 78;

const HAIR = "#E8E8ED";
const SOFT = "#FAFAFB";

/* ── the six panes ───────────────────────────────────────
   Each step gets its own layout, not the same list six times — see the note
   in `TwinPanels.tsx`. Only the header label and state chip are shared.     */

const PANES: {
  title: string;
  chip: string;
  chipTint: string;
  node: (t: number) => React.ReactNode;
}[] = [
  {
    title: "Facility model",
    chip: "Building",
    chipTint: "#D95A00",
    node: (t) => <PanelDigitise t={t} />,
  },
  {
    title: "Asset register",
    chip: "1,264 tagged",
    chipTint: "#16A34A",
    node: (t) => <PanelTag t={t} />,
  },
  {
    title: "Scenario 03",
    chip: "Simulating",
    chipTint: "#D95A00",
    node: () => <PanelSimulate />,
  },
  {
    title: "Connected sources",
    chip: "Streaming",
    chipTint: "#16A34A",
    node: () => <PanelConnect />,
  },
  {
    title: "Findings feed",
    chip: "Live",
    chipTint: "#16A34A",
    node: () => <PanelOperate />,
  },
  {
    title: "Patterns",
    chip: "Learning",
    chipTint: "#D95A00",
    node: () => <PanelLearn />,
  },
];

/* ── the steps ───────────────────────────────────────────── */

const STEPS = [
  {
    n: "01",
    title: "Digitise",
    body: "Draw inside the platform or reconstruct the existing facility from LiDAR scan files.",
    detail: ["Shell, structure and aisles", "Survey, DWG or point cloud"],
  },
  {
    n: "02",
    title: "Tag",
    body: "Give assets a digital identity, location and structured record.",
    detail: [
      "One ID for the asset's whole life",
      "Racks, vehicles, doors, zones",
    ],
  },
  {
    n: "03",
    title: "Simulate",
    body: "Test selected physical changes before implementation.",
    detail: [
      "Clearance, access and capacity",
      "Answered before anything moves",
    ],
  },
  {
    n: "04",
    title: "Connect",
    body: "Integrate live devices, operational systems, edge processing and AI.",
    detail: [
      "Sensors, inspections and systems",
      "Open protocols, your hardware too",
    ],
  },
  {
    n: "05",
    title: "Operate",
    body: "Run applications on the live model and act on what is happening now.",
    detail: [
      "Findings resolved to a location",
      "One view for floor and office",
    ],
  },
  {
    n: "06",
    title: "Evaluate + Learn",
    body: "Preserve history and improve decisions over time.",
    detail: [
      "Patterns across retained history",
      "A recommendation, not just a number",
    ],
  },
];

/* ── the section ─────────────────────────────────────────── */

export function TwinHow() {
  const [clock, setClock] = useState({ t: 0, i: 0, anchor: 0 });

  useEffect(() => {
    const id = setInterval(() => {
      setClock((prev) => {
        const t = prev.t + 1;
        return t - prev.anchor >= STEP_TICKS
          ? { t, i: (prev.i + 1) % STEPS.length, anchor: t }
          : { ...prev, t };
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  const { t, i } = clock;
  const p = Math.min(1, (t - clock.anchor) / STEP_TICKS);
  const step = STEPS[i];
  const card = PANES[i];

  /* Picking a step jumps there and restarts its dwell. Autoplay is never
     switched off — an earlier version stopped it for good on the first click,
     which left the rail frozen for the rest of the visit. */
  const goTo = (n: number) =>
    setClock((prev) => ({ ...prev, i: n, anchor: prev.t }));

  return (
    <Section surface="white" id="how">
      <SectionHeader
        eyebrow="How it works"
        top="From facility capture"
        bottom="To continuous learning."
        size="compact"
        width="wide"
        body="A simple adoption workflow creates value early and adds intelligence progressively."
      />

      {/* ── the rail ──────────────────────────────────────
          The track runs between the first and last dot centres, not edge to
          edge: with six equal columns those sit at 1/12 and 11/12, so the
          line is inset by 8.333% each side. Running it full width left a stub
          hanging past both ends.

          Only the current step is filled. Filling every step behind it made
          the whole rail solid orange by step 06, which reads as six active
          steps rather than one. Completed steps keep an orange outline. */}
      <div className="relative mb-10 sm:mb-12 overflow-x-auto">
        <div className="relative min-w-[640px] lg:min-w-0 pt-1">
          <span
            aria-hidden
            className="absolute top-[13px] h-px"
            style={{ left: "8.333%", right: "8.333%", background: "#E4E4E9" }}
          />
          <motion.span
            aria-hidden
            className="absolute top-[13px] h-px origin-left"
            style={{ left: "8.333%", right: "8.333%", background: "#FF6A00" }}
            animate={{ scaleX: (i + p) / (STEPS.length - 1) }}
            transition={{ duration: 0.25, ease: "linear" }}
          />

          <div className="relative grid grid-cols-6">
            {STEPS.map((s, n) => {
              const done = n < i;
              const now = n === i;
              return (
                <button
                  key={s.n}
                  type="button"
                  onClick={() => goTo(n)}
                  className="group flex flex-col items-center text-center px-2"
                >
                  <span
                    className="flex items-center justify-center w-[26px] h-[26px] rounded-full transition-all duration-300"
                    style={{
                      background: now ? "#FF6A00" : "#FFFFFF",
                      border: `1.5px solid ${
                        now ? "#FF6A00" : done ? "#FFC59E" : "#E0E0E6"
                      }`,
                    }}
                  >
                    <span
                      className="text-[9.5px] font-mono font-bold tabular-nums transition-colors duration-300"
                      style={{
                        color: now ? "#FFFFFF" : done ? "#D95A00" : "#B0B0B8",
                      }}
                    >
                      {s.n}
                    </span>
                  </span>

                  <span
                    className={
                      "mt-3.5 text-[12px] tracking-[-0.01em] transition-colors duration-300 " +
                      (now
                        ? "font-semibold text-carbon"
                        : "font-medium text-graphite/45 group-hover:text-graphite/75")
                    }
                  >
                    {s.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── the canvas ────────────────────────────────
          Step copy on the left, and on the right the two things that change:
          the facility gaining a layer, and its panel. */}
      <div
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] overflow-hidden"
        style={{
          borderRadius: 20,
          background: "#FFFFFF",
          border: `1px solid ${HAIR}`,
          boxShadow:
            "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
        }}
      >
        <div
          className="px-8 py-9 lg:py-10 flex flex-col justify-center lg:border-r"
          style={{ borderColor: HAIR }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange tabular-nums">
                Step {step.n}
              </span>
              <h3 className="mt-4 text-[24px] sm:text-[27px] font-bold tracking-[-0.03em] leading-[1.2] text-carbon">
                {step.title}
              </h3>
              <p className="mt-4 text-[13.5px] leading-[1.7] text-graphite/60">
                {step.body}
              </p>
              {/* Ticks rather than dashes: these are things the step gives
                  you, and a rule reads as a list marker where a tick reads as
                  a claim being met. */}
              <div className="mt-8 flex flex-col gap-3.5">
                {step.detail.map((d) => (
                  <span
                    key={d}
                    className="flex items-start gap-3 text-[12px] leading-[1.55] text-graphite/70"
                  >
                    <span
                      aria-hidden
                      className="mt-[1px] flex items-center justify-center w-[15px] h-[15px] rounded-full text-[9px] font-bold shrink-0"
                      style={{
                        background: "rgba(255,106,0,0.10)",
                        color: "#D95A00",
                      }}
                    >
                      ✓
                    </span>
                    {d}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* what actually changes */}
        {/* One product screen. The facility and its data are two halves of
            the same view, divided by a hairline — not two cards. */}
        <div className="flex flex-col min-w-0">
          {/* one header for the whole screen */}
          <div
            className="flex shrink-0 items-center gap-3 px-4 py-3"
            style={{ borderBottom: `1px solid ${HAIR}`, background: SOFT }}
          >
            <span className="text-[9px] font-mono font-bold tracking-[0.2em] uppercase text-graphite/45 truncate">
              {card.title}
            </span>
            <span className="hidden sm:flex items-center gap-2.5 ml-3">
              {[
                ["Racking", "#3E63DD"],
                ["Live", "#16A34A"],
                ["Findings", "#E5484D"],
              ].map(([k, tint]) => (
                <span key={k} className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: tint }}
                  />
                  <span className="text-[8px] font-mono font-bold tracking-[0.12em] uppercase text-graphite/40">
                    {k}
                  </span>
                </span>
              ))}
            </span>
            <span
              className="ml-auto shrink-0 inline-flex items-center gap-1.5 px-2 py-[3px] rounded-full text-[8.5px] font-mono font-bold tracking-[0.12em] uppercase"
              style={{
                background: `${card.chipTint}1F`,
                color: card.chipTint,
              }}
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: card.chipTint }}
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {card.chip}
            </span>
          </div>

          <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-[minmax(0,1.48fr)_minmax(0,1fr)]">
            {/* Aspect-locked to the drawing (848 × 468 plus the pane's own
                  padding), so the facility fills its half exactly. A fixed
                  height cannot: the drawing keeps its ratio and whatever the
                  container has spare becomes letterbox. */}
            <div className="p-3 sm:p-4 aspect-[884/504]">
              <TwinFacility step={i} />
            </div>
            {/* The pane is taken out of flow at xl and pinned to the cell.
                  In flow its feed is ~860px of duplicated rows, and a grid row
                  is as tall as its tallest column — so the facility's aspect
                  lock counted for nothing and the whole screen stretched. Out
                  of flow it contributes no height and the facility sets it. */}
            <div
              className="relative min-h-[340px] xl:min-h-0 border-t xl:border-t-0 xl:border-l"
              style={{ borderColor: HAIR }}
            >
              <div className="absolute inset-0 overflow-hidden">
                <AnimatePresence mode="wait">
                  <div key={step.n} className="h-full">
                    {card.node(t)}
                  </div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
