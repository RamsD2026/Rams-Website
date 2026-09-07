"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import {
  PanelAct,
  PanelAnalyse,
  PanelContext,
  PanelLearn,
  PanelPrioritise,
} from "./AmsPanels";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 05 — Core capabilities.
 *
 * Sticky-scroll, on `TwinLayers`: the six groups pass on the left and the
 * frame on the right is pinned, swapping to whichever group is in view.
 * `useScroll` over the track drives the index — the viewer is the one moving
 * through it, not a timer.
 *
 * The frame is a device edge with no browser chrome and no drop shadow, on a
 * gradient stage, inset from the top left and running off the bottom right.
 * The screen is the subject, not a web page.
 *
 * There is no AIMS capture in /public and the only registered screens in
 * `SHOTS` are IRDS's, so each group pins a **live pane** — the same panes the
 * workflow section uses, drawn from written-down data rather than borrowed
 * from another product. Twin visibility and asset drill-down share a pane
 * because they are two readings of one thing: getting from a number to the
 * object behind it.
 *
 * `clip={false}`: an ancestor with `overflow: hidden` disables `position:
 * sticky` inside it.
 */

const HAIR = "#E8E8ED";

const GROUPS: {
  n: string;
  group: string;
  title: string;
  line: string;
  body: string;
  node: () => React.ReactNode;
}[] = [
  {
    n: "01",
    group: "Live Digital Twin visibility",
    title: "See the site as it is now",
    line: "No travel required for routine visibility",
    body: "Open any connected facility, view authorised changes and inspect the current physical operating context.",
    node: () => <PanelContext />,
  },
  {
    n: "02",
    group: "Asset drill-down",
    title: "Move from KPI to field reality",
    line: "The underlying evidence stays one click away",
    body: "Select a moving forklift, rack, pallet, machine or zone to review available status, parameters and history.",
    node: () => <PanelContext />,
  },
  {
    n: "03",
    group: "Cross-module analytics",
    title: "Find what separate systems miss",
    line: "Relationships become visible across the platform",
    body: "Connect safety, productivity, inventory, maintenance and execution signals around shared context.",
    node: () => <PanelAnalyse />,
  },
  {
    n: "04",
    group: "AI-assisted insights",
    title: "Surface patterns for review",
    line: "Evidence and source remain visible to decision-makers",
    body: "Use configured analytics to flag correlations, anomalies, recurring conditions and management priorities.",
    node: () => <PanelPrioritise />,
  },
  {
    n: "05",
    group: "Multi-site benchmarking",
    title: "Compare facilities consistently",
    line: "See leaders, outliers and overdue intervention",
    body: "Review common safety, productivity, efficiency and visibility indicators across the network.",
    node: () => <PanelLearn />,
  },
  {
    n: "06",
    group: "Action + closure governance",
    title: "Carry insight into accountable work",
    line: "Management visibility continues until closure",
    body: "Connect priority, owner, due date, evidence, approval, verification and outcome.",
    node: () => <PanelAct />,
  },
];

const STAGE_RATIO = "5 / 4";

/** A gradient panel with the screen inset top-left and running off bottom-right. */
function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: STAGE_RATIO,
        borderRadius: 24,
        background:
          "radial-gradient(95% 85% at 18% 12%, rgba(255,106,0,0.34) 0%, transparent 58%)," +
          "linear-gradient(148deg, #26262E 0%, #15151A 58%, #0C0C0F 100%)",
      }}
    >
      <div className="absolute left-[9%] top-[11%] right-[-16%] bottom-[-18%]">
        {children}
      </div>
    </div>
  );
}

export function AmsCapabilities() {
  const track = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);

  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start 30%", "end 70%"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setAt(
      Math.max(0, Math.min(GROUPS.length - 1, Math.floor(v * GROUPS.length))),
    );
  });

  const g = GROUPS[at];

  return (
    <Section surface="offWhite" id="capabilities" clip={false}>
      <SectionHeader
        eyebrow="Core capabilities"
        top="Management intelligence"
        bottom="Without losing operational detail."
        size="compact"
        width="wide"
        body="Move from an enterprise overview to the exact site, asset, event and evidence behind every signal."
      />

      <div
        ref={track}
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-10 lg:gap-16"
      >
        {/* the six, scrolling */}
        <div className="flex flex-col">
          {GROUPS.map((x, n) => {
            const now = n === at;
            return (
              <div
                key={x.n}
                className="py-8 lg:min-h-[44vh] flex flex-col justify-center"
              >
                <motion.div
                  initial={false}
                  animate={{ opacity: now ? 1 : 0.36 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange tabular-nums">
                    {x.n} · {x.group}
                  </span>
                  <h3 className="mt-3 text-[26px] sm:text-[32px] font-bold tracking-[-0.03em] leading-[1.15] text-carbon">
                    {x.title}
                  </h3>
                  <p className="mt-2 text-[15px] sm:text-[17px] italic text-graphite/50">
                    {x.line}
                  </p>
                  <p className="mt-4 text-[14px] leading-[1.65] text-graphite/65 max-w-[46ch]">
                    {x.body}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* the pinned screen */}
        <div className="hidden lg:block">
          <div className="sticky top-28">
            {/* A dissolve. Both frames stack in the same box and cross-fade —
                `mode="wait"` would empty the box between them, which reads as
                a flash. */}
            <Stage>
              <AnimatePresence>
                <motion.div
                  key={g.n}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.015 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                >
                  <div
                    className="w-full h-full overflow-hidden"
                    style={{
                      borderRadius: 16,
                      background: "#FFFFFF",
                      border: "1px solid rgba(255,255,255,0.22)",
                    }}
                  >
                    <div className="w-full h-full max-w-[520px]">{g.node()}</div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </Stage>

            <div className="mt-6 flex items-center gap-4">
              <span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/45 tabular-nums shrink-0">
                Capability {g.n} / 06
              </span>
              <span className="flex items-center gap-1.5 flex-1">
                {GROUPS.map((x, n) => (
                  <span
                    key={x.n}
                    className="h-[3px] flex-1 rounded-full transition-colors duration-500"
                    style={{
                      background:
                        n === at
                          ? "#FF6A00"
                          : n < at
                            ? "rgba(255,106,0,0.32)"
                            : HAIR,
                    }}
                  />
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
