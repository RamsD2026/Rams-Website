"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import {
  PaneAnalytics,
  PaneApps,
  PaneEdge,
  PaneFloor,
  PaneSystems,
  PaneTwin,
} from "./AboutPanels";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 04 — What we built.
 *
 * The platform pages' Core capabilities section, value for value: the six
 * groups pass on the left and the frame on the right is pinned, swapping to
 * whichever group is in view. `useScroll` over the track drives the index —
 * the reader is the one moving through it, not a timer.
 *
 * The frame is a device edge with no browser chrome and no drop shadow, on a
 * gradient stage, inset from the top left and running off the bottom right.
 * The screen is the subject, not a web page. `Stage`, the offsets, the
 * cross-fade and the progress row are copied from `AmsCapabilities` rather
 * than re-derived.
 *
 * `clip={false}`: an ancestor with `overflow: hidden` disables `position:
 * sticky` inside it. That one has caught this section three times on this
 * site.
 *
 * ── What each group pins ────────────────────────────────────────────
 * There is no product capture for any of this — the six registered screens in
 * `SHOTS` are all IRDS's — so each group pins a **pane** drawn from
 * written-down data, exactly as the IMDS and AIMS capability sections do.
 *
 * Six layers, six panes, six different shapes: a table, a tile grid, a chart,
 * an elevation, a record and a plan. None would make sense against another
 * layer. That rule is why this site's wells exist in the state they do — six
 * platform pages once ran the same three widgets because the visuals were
 * carried across with the layout.
 *
 * The order is the source document's, read from the floor up: the physical
 * world, what senses it, the Twin that holds it, what interprets it, what acts
 * on it, and what consumes it. The Twin is the middle of six on purpose — it
 * is the layer everything above stands on.
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
    group: "Physical world",
    title: "Start with what is actually there",
    line: "People, assets, machines, inventory, infrastructure",
    body: "The building and everything working in it. Every other layer here is an abstraction of this one, and is only worth anything while it still matches.",
    node: () => <PaneFloor />,
  },
  {
    n: "02",
    group: "Edge + IoT",
    title: "Read the building as it works",
    line: "Coverage depends on the hardware and the site",
    body: "LiDAR, sensors, cameras, machines and supported customer hardware, reporting position, condition and event as they happen rather than at the end of a shift.",
    node: () => <PaneEdge />,
  },
  {
    n: "03",
    group: "Digital Twin",
    title: "Hold the physical truth",
    line: "The layer everything above it stands on",
    body: "Physical context, asset identity and lifecycle history, kept current — so an asset still answers the same questions months later, and every reading has somewhere to belong.",
    node: () => <PaneTwin />,
  },
  {
    n: "04",
    group: "AI + analytics",
    title: "Find what separate systems miss",
    line: "Evidence and source stay visible",
    body: "Vision, spatial analysis, pattern recognition and decision support, applied to what the floor reports rather than to a summary of it.",
    node: () => <PaneAnalytics />,
  },
  {
    n: "05",
    group: "Process applications",
    title: "Run the work in context",
    line: "Each stands alone, and connects",
    body: "Safety, productivity, inventory, maintenance, inspection and execution, every one of them running against the same physical record.",
    node: () => <PaneApps />,
  },
  {
    n: "06",
    group: "Business systems",
    title: "Connect without erasing the source",
    line: "Read, and write back where it is approved",
    body: "ERP, WMS, MES, CMMS, TMS and customer platforms, connected so operational reality reaches them — and so their context reaches the floor.",
    node: () => <PaneSystems />,
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

export function AboutBuilt() {
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
    <Section surface="offWhite" id="what-we-built" clip={false}>
      <SectionHeader
        eyebrow="What we built"
        top="The operating context"
        bottom="For the physical world."
        size="compact"
        width="wide"
        body="RAMS Digital creates a persistent connection between the facility, its assets, their lifecycle and the work happening around them."
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
                Layer {g.n} / 06
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
