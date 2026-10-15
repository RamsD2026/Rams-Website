"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { TwinFacility } from "@/components/sections/twin/TwinFacility";
import {
  PanelClassify,
  PanelImprove,
  PanelMap,
  PanelMeasure,
  PanelRoutes,
} from "./MepsPanels";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 05 — Core capabilities.
 *
 * Sticky-scroll, built on `TwinLayers`: the six groups scroll past on the left
 * and the frame on the right is pinned, swapping to whichever group is in
 * view. The scroll position drives the index — `useScroll` over the track,
 * the same mechanism `PhysicalOperation` uses — because the viewer is the one
 * moving through it, not a timer.
 *
 * Same frame as TwinLayers and for the same reason: a device edge with no
 * browser chrome and no drop shadow, on a gradient stage, inset from the top
 * left and running off the bottom right. The screen is the subject, not a web
 * page.
 *
 * What is different is what goes in the frame. TwinLayers pins a screenshot
 * per layer; there is no MEPS capture in /public/Product, and the only
 * registered screens are IRDS rack-safety views. Putting a rack dashboard
 * behind "Route & travel analytics" would be a lie told with a picture, so
 * each group pins a **live pane** instead — the same panes `MepsHow` uses,
 * which are drawn from data rather than borrowed from another product. Drop
 * real MEPS captures into `SHOTS` and these can become `Shot`s.
 *
 * `clip={false}` on the section: an ancestor with `overflow: hidden` disables
 * `position: sticky` inside it, so the pinned column would just scroll away.
 */

const HAIR = "#E8E8ED";

const GROUPS: {
  n: string;
  group: string;
  title: string;
  line: string;
  body: string;
  screen: string;
  node: () => React.ReactNode;
}[] = [
  {
    n: "01",
    group: "Live positioning",
    title: "Live MHE visibility",
    line: "See the fleet, not a list",
    body: "View the last available position and operating state of connected equipment inside the facility context.",
    screen: "Floor · live",
    node: () => (
      <div className="w-full h-full p-4 sm:p-6">
        <TwinFacility step={4} routes />
      </div>
    ),
  },
  {
    n: "02",
    group: "Utilisation",
    title: "Productive vs non-productive time",
    line: "Measure where the shift goes",
    body: "Understand active work, travel, waiting, idle, charging and unavailable time by MHE and shift.",
    screen: "Activity split",
    node: () => <PanelClassify />,
  },
  {
    n: "03",
    group: "Movement",
    title: "Route & travel analytics",
    line: "Find avoidable movement",
    body: "Analyse distance, paths, repeated movements, empty travel and route variation across the Digital Twin.",
    screen: "Travel by route",
    node: () => <PanelRoutes />,
  },
  {
    n: "04",
    group: "Zones",
    title: "Dwell, queue & congestion",
    line: "Find the operational bottleneck",
    body: "Measure time spent in docks, staging, charging, aisles and restricted or high-traffic zones.",
    screen: "Mapped zones",
    node: () => <PanelMap />,
  },
  {
    n: "05",
    group: "Performance",
    title: "Shift & fleet comparison",
    line: "Benchmark operating patterns",
    body: "Compare vehicle, equipment class, operator session, shift and site performance using common measures.",
    screen: "Performance",
    node: () => <PanelMeasure />,
  },
  {
    n: "06",
    group: "Insight",
    title: "Exceptions & improvement signals",
    line: "Move from data to action",
    body: "Surface extended idle, unusual movement, imbalanced use and recurring delays for operational review.",
    screen: "Opportunities",
    node: () => <PanelImprove />,
  },
];

/** The stage the screen sits on. */
const STAGE_RATIO = "5 / 4";

/**
 * The stage — a gradient panel with the screen inset from the top left and
 * running off the bottom right. The point of it is the space: the screen is
 * not fitted to a box, it is placed on a ground with room around two of its
 * sides and cropped by the other two.
 */
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

/** Device frame. No browser chrome and no drop shadow — a hairline edge. */
function Frame({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{
        borderRadius: 16,
        background: "#FFFFFF",
        border: "1px solid rgba(255,255,255,0.22)",
      }}
    >
      <div
        className="flex shrink-0 items-center gap-2.5 px-4 py-3"
        style={{ borderBottom: `1px solid ${HAIR}`, background: "#FAFAFB" }}
      >
        <span className="relative flex w-1.5 h-1.5 shrink-0">
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ background: "#16A34A" }}
            animate={{ scale: [1, 2.6], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
          <span
            className="relative w-1.5 h-1.5 rounded-full"
            style={{ background: "#16A34A" }}
          />
        </span>
        <span className="text-[9px] font-mono font-bold tracking-[0.2em] uppercase text-graphite/45 truncate">
          {label}
        </span>
        <span className="ml-auto text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-graphite/30 shrink-0">
          Warehouse 01
        </span>
      </div>

      {/* The panes are built for a narrow column. Capped and centred here so a
          wide frame does not stretch a six-row list across 700px. */}
      <div className="flex-1 min-h-0 w-full max-w-[560px] mx-auto">
        {children}
      </div>
    </div>
  );
}

export function MepsCapabilities() {
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
        top="See how the fleet"
        bottom="Actually works."
        size="compact"
        width="wide"
        body="Six connected capability groups turn MHE activity into a practical improvement system."
      />

      <div
        ref={track}
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-10 lg:gap-16"
      >
        {/* the six, scrolling */}
        <div className="flex flex-col w-full max-w-[640px] mx-auto lg:max-w-none lg:mx-0">
          {GROUPS.map((x, n) => {
            const now = n === at;
            return (
              <div
                key={x.n}
                className="py-8 lg:min-h-[44vh] flex flex-col justify-center"
              >
                <motion.div
                  // framer writes inline opacity; the pinned pane is lg-only, so undim below lg
                  className="max-lg:opacity-100!"
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
            {/* A dissolve. Both frames are stacked in the same box and
                cross-fade — `mode="wait"` would empty the box between them,
                which reads as a flash. */}
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
                  <Frame label={g.screen}>{g.node()}</Frame>
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
