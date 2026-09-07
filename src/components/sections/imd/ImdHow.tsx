"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TwinFacility } from "@/components/sections/twin/TwinFacility";
import {
  PanelConnect,
  PanelDiagnose,
  PanelMaintain,
  PanelPrioritise,
  PanelVerify,
} from "./ImdPanels";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 04 — How it works.
 *
 * `TwinHow`'s shape, the settled one for a five-step process on this site: a
 * rail across the top driving one evolving demonstration. The copy column
 * stays put; only the right side moves — the facility gains a layer and its
 * panel swaps.
 *
 * The facility is `TwinFacility` with its MHE routes running, because the
 * subject of every step is a machine that is working while it degrades. Its
 * layers do not map one-to-one onto these five steps and are not forced to:
 * 03 and 04 share a layer, because prioritising and planning change the
 * record rather than the floor.
 *
 * Autoplay advances every ~7s and keeps running. Clicking a step jumps there
 * and restarts that step's dwell.
 *
 * Figures are illustrative of the mechanism, not measured results.
 */

const TICK_MS = 90;
const STEP_TICKS = 78;

const HAIR = "#E8E8ED";
const SOFT = "#FAFAFB";

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
    title: "Connect",
    body: "Receive supported onboard, battery, telematics, inspection and enterprise-system data.",
    detail: ["Validated asset by asset", "What it will talk to sets the limit"],
    layer: 0,
    pane: { title: "Equipment interfaces", chip: "Validating", chipTint: "#3E63DD" },
    node: (t) => <PanelConnect t={t} />,
  },
  {
    n: "02",
    title: "Diagnose",
    body: "Surface configured fault codes, thresholds, anomalies and inspection findings.",
    detail: ["Every reading against a limit", "Decision support, not OEM diagnosis"],
    layer: 3,
    pane: { title: "Live parameters", chip: "Reading", chipTint: "#16A34A" },
    node: () => <PanelDiagnose />,
  },
  {
    n: "03",
    title: "Prioritise",
    body: "Connect severity with usage, task, safety, location, history and operational criticality.",
    detail: ["Ranked by operational impact", "Not by how loud the code is"],
    layer: 4,
    pane: { title: "Operational impact", chip: "Ranked", chipTint: "#D95A00" },
    node: () => <PanelPrioritise />,
  },
  {
    n: "04",
    title: "Maintain",
    body: "Create, assign or integrate approved inspection and maintenance workflows.",
    detail: ["An owner, a window, a part", "Recommend first, automate later"],
    layer: 4,
    pane: { title: "Maintenance action", chip: "Assigned", chipTint: "#D95A00" },
    node: () => <PanelMaintain />,
  },
  {
    n: "05",
    title: "Verify",
    body: "Confirm work, retain evidence and use lifecycle history to improve future decisions.",
    detail: ["Did the repair hold", "Recurrence is the real test"],
    layer: 5,
    pane: { title: "After closure", chip: "30 days", chipTint: "#16A34A" },
    node: () => <PanelVerify />,
  },
];

export function ImdHow() {
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

  const goTo = (n: number) =>
    setClock((prev) => ({ ...prev, i: n, anchor: prev.t }));

  return (
    <Section surface="white" id="how">
      <SectionHeader
        eyebrow="How it works"
        top="From equipment signal"
        bottom="To verified maintenance."
        size="compact"
        width="wide"
        body="IMDS creates a governed diagnostic loop around the MHE asset."
      />

      {/* ── the rail ──────────────────────────────────────
          The track runs between the first and last dot centres: with five
          equal columns those sit at 1/10 and 9/10, so it is inset 10% each
          side. Only the current step is filled; completed steps keep an
          orange outline. */}
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

      {/* ── the canvas ──────────────────────────────── */}
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
              <p className="mt-4 min-h-[5.2em] text-[13.5px] leading-[1.7] text-graphite/60">
                {step.body}
              </p>
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
                ["Condition", "#3E63DD"],
                ["Faults", "#E5484D"],
                ["Work", "#16A34A"],
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
            {/* Aspect-locked to the drawing plus the pane's own padding. */}
            <div className="p-3 sm:p-4 aspect-[884/504]">
              <TwinFacility step={step.layer} routes />
            </div>
            {/* Out of flow at xl — a scrolling pane in flow is hundreds of
                pixels of duplicated rows, and a grid row is as tall as its
                tallest column. */}
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
