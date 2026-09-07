"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TwinFacility } from "@/components/sections/twin/TwinFacility";
import {
  PanelClassify,
  PanelConnect,
  PanelImprove,
  PanelMap,
  PanelMeasure,
} from "./MepsPanels";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 04 — How it works.
 *
 * Built on `TwinHow`, which is the settled shape for a five- or six-step
 * process on this site: a rail across the top driving one evolving
 * demonstration, not a switch between five screens. `step` only ever adds to
 * what the facility is already drawing, so nothing the viewer has understood
 * disappears when the step changes.
 *
 * The facility is `TwinFacility` — the Digital Twin's own drawing, with its
 * MHE lanes running the whole time. That is not a shortcut. MEPS's claim is
 * that movement is placed *inside the Digital Twin*, so the honest picture of
 * that claim is the Digital Twin with movement in it, not a second warehouse
 * drawn to look similar. Simulation (its step 2) is skipped: MEPS does not
 * simulate, so the rail steps through 0 → 1 → 3 → 4 → 5.
 *
 * The copy column on the left stays put. Only the right side moves — the
 * facility gains a layer, and its panel swaps for the next one.
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

/* ── the five steps ──────────────────────────────────────
   `layer` is the TwinFacility step this one draws at. */

const STEPS: {
  n: string;
  title: string;
  body: string;
  detail: [string, string];
  layer: number;
  pane: { title: string; chip: string; chipTint: string };
  node: (t: number) => React.ReactNode;
}[] = [
  {
    n: "01",
    title: "Connect the fleet",
    body: "Create MHE identities and connect supported positioning, telemetry or task data.",
    detail: ["One ID per machine, for its life", "Positioning, telemetry, tasks"],
    layer: 0,
    pane: { title: "Fleet register", chip: "Linking", chipTint: "#D95A00" },
    node: (t) => <PanelConnect t={t} />,
  },
  {
    n: "02",
    title: "Map the operation",
    body: "Place movement inside the Digital Twin—aisles, docks, charging, staging and work zones.",
    detail: ["Movement resolved to a place", "Zones the building already has"],
    layer: 1,
    pane: { title: "Mapped zones", chip: "Placed", chipTint: "#16A34A" },
    node: () => <PanelMap />,
  },
  {
    n: "03",
    title: "Classify activity",
    body: "Separate productive work, travel, waiting, idle, charging and offline periods.",
    detail: ["Busy is not the same as useful", "Every minute lands in a state"],
    layer: 3,
    pane: { title: "Activity split", chip: "Classified", chipTint: "#3E63DD" },
    node: () => <PanelClassify />,
  },
  {
    n: "04",
    title: "Measure performance",
    body: "Compare utilisation, distance, trips, dwell and task activity by shift or asset.",
    detail: ["One measure, every machine", "Shift, asset, zone or task"],
    layer: 4,
    pane: { title: "Performance", chip: "Measured", chipTint: "#16A34A" },
    node: () => <PanelMeasure />,
  },
  {
    n: "05",
    title: "Improve the system",
    body: "Act on route, zone, task, fleet-sizing and operating opportunities.",
    detail: ["A change, not just a number", "Ranked by what it returns"],
    layer: 5,
    pane: { title: "Opportunities", chip: "Ranked", chipTint: "#D95A00" },
    node: () => <PanelImprove />,
  },
];

/* ── the section ─────────────────────────────────────────── */

export function MepsHow() {
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

  /* Picking a step jumps there and restarts its dwell. Autoplay is never
     switched off — stopping it on the first click leaves the rail frozen for
     the rest of the visit. */
  const goTo = (n: number) =>
    setClock((prev) => ({ ...prev, i: n, anchor: prev.t }));

  return (
    <Section surface="white" id="how">
      <SectionHeader
        eyebrow="How it works"
        top="Position. Classify."
        bottom="Measure. Improve."
        size="compact"
        width="wide"
        body="MEPS converts raw movement into operational information that warehouse teams can act on."
      />

      {/* ── the rail ──────────────────────────────────────
          The track runs between the first and last dot centres, not edge to
          edge: with five equal columns those sit at 1/10 and 9/10, so the line
          is inset by 10% each side.

          Only the current step is filled. Filling every step behind it makes
          the rail solid orange by step 05, which reads as five active steps
          rather than one. Completed steps keep an orange outline. */}
      <div className="relative mb-10 sm:mb-12 overflow-x-auto">
        <div className="relative min-w-[560px] lg:min-w-0 pt-1">
          <span
            aria-hidden
            className="absolute top-[13px] h-px"
            style={{ left: "10%", right: "10%", background: "#E4E4E9" }}
          />
          <motion.span
            aria-hidden
            className="absolute top-[13px] h-px origin-left"
            style={{ left: "10%", right: "10%", background: "#FF6A00" }}
            animate={{ scaleX: (i + p) / (STEPS.length - 1) }}
            transition={{ duration: 0.25, ease: "linear" }}
          />

          <div className="relative grid grid-cols-5">
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

        {/* what actually changes — one product screen, the facility and its
            data divided by a hairline rather than sitting in two cards */}
        <div className="flex flex-col min-w-0">
          <div
            className="flex shrink-0 items-center gap-3 px-4 py-3"
            style={{ borderBottom: `1px solid ${HAIR}`, background: SOFT }}
          >
            <span className="text-[9px] font-mono font-bold tracking-[0.2em] uppercase text-graphite/45 truncate">
              {step.pane.title}
            </span>
            <span className="hidden sm:flex items-center gap-2.5 ml-3">
              {[
                ["MHE", "#FF6A00"],
                ["Zones", "#3E63DD"],
                ["Activity", "#16A34A"],
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
                background: `${step.pane.chipTint}1F`,
                color: step.pane.chipTint,
              }}
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: step.pane.chipTint }}
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {step.pane.chip}
            </span>
          </div>

          <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-[minmax(0,1.48fr)_minmax(0,1fr)]">
            {/* Aspect-locked to the drawing plus the pane's own padding, so
                the facility fills its half exactly. A fixed height cannot: the
                drawing keeps its ratio and the spare becomes letterbox. */}
            <div className="p-3 sm:p-4 aspect-[884/504]">
              <TwinFacility step={step.layer} routes />
            </div>
            {/* Out of flow at xl. In flow a scrolling pane is hundreds of
                pixels of duplicated rows, and a grid row is as tall as its
                tallest column — so the facility's aspect lock would count for
                nothing and the whole screen would stretch. */}
            <div
              className="relative min-h-[340px] xl:min-h-0 border-t xl:border-t-0 xl:border-l"
              style={{ borderColor: HAIR }}
            >
              <div className="absolute inset-0 overflow-hidden">
                <div key={step.n} className="h-full">
                  {step.node(t)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
