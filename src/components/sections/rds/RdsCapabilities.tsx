"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Image from "next/image";
import {
  EASE,
  SHOTS,
  Section,
  type ShotKey,
} from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 05 — Core capabilities.
 *
 * Sticky-scroll, on `TwinLayers`: the seven groups scroll past on the left and
 * the frame on the right is pinned, swapping to whichever group is in view.
 * `useScroll` over the track drives the index — the same mechanism
 * `PhysicalOperation` uses — because the viewer is the one moving through it.
 *
 * The frame is deliberately **not** the shared `ProductFrame`. That one wears
 * browser chrome, which says "this is a web page". Here the screen is the
 * subject: a device edge with a hairline and no drop shadow, on a gradient
 * stage, inset from the top left and running off the bottom right.
 *
 * Every one of the seven is a **real capture**. This is the only page on the
 * site where that is true — `SHOTS` is entirely IRDS screens — so where the
 * Digital Twin needed a dashed pending slot for its simulation layer and MEPS
 * had to pin live panes instead of screenshots, this section can show the
 * product itself, seven times, with each capability landing on the screen that
 * actually does it.
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
  shot: ShotKey;
}[] = [
  {
    n: "01",
    group: "Digital rack twin",
    title: "Rack & component registry",
    line: "Pin every issue to its true location",
    body: "Organise site, row, rack, bay, level and component identities in a spatial operating model.",
    shot: "regionalDashboard",
  },
  {
    n: "02",
    group: "Audit workflow",
    title: "Internal & external inspections",
    line: "Standardise how inspections happen",
    body: "Schedule audit cycles, configure checklists and capture observations consistently through guided workflows.",
    shot: "findingsList",
  },
  {
    n: "03",
    group: "Risk",
    title: "RAG classification",
    line: "Make urgency visible",
    body: "Prioritise findings using configured Red, Amber and Green response logic with clear actions.",
    shot: "findingsFiltered",
  },
  {
    n: "04",
    group: "Evidence",
    title: "Visual finding records",
    line: "Keep proof with the finding",
    body: "Connect measurements, photographs, comments and inspector evidence to each exact component.",
    shot: "taskDetails",
  },
  {
    /* Testing sits between the evidence and the closure because a failed
       test is what raises the corrective action. The screen is the real
       regional analytics capture: its lower third is the Test Performance
       panel, IRDS structural testing pass rate by class, and the stage crop
       leaves the header and three full test cards in frame. */
    n: "05",
    group: "Testing",
    title: "Structural testing",
    line: "Measure what the eye cannot judge",
    body: "Record plumbness, rack run straightness, lateral sway, floor flatness and upright bend by class, see the pass rate for each, and trace every failed test to its asset.",
    shot: "regionalAnalytics",
  },
  {
    n: "06",
    group: "Closure",
    title: "Corrective action & verification",
    line: "Close the loop",
    body: "Assign repair or replacement, track status, collect completion evidence and verify closure.",
    shot: "actionAssign",
  },
  {
    n: "07",
    group: "Intelligence",
    title: "BoQ, history & trends",
    line: "Turn inspections into decisions",
    body: "Translate findings into component requirements, compare cycles and identify recurring damage patterns.",
    shot: "boq",
  },
];

const STAGE_RATIO = "5 / 4";

/**
 * The stage — a gradient panel with the device inset from the top left and
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

/**
 * The capture is `object-cover` in a fixed box. The screenshots are all
 * different shapes (1916×908, 1633×908, 1917×910), so fitting each one would
 * make the frame jump size on every group.
 */
function Shot({ shot }: { shot: ShotKey }) {
  const s = SHOTS[shot];
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        borderRadius: 16,
        background: "#FFFFFF",
        border: "1px solid rgba(255,255,255,0.22)",
      }}
    >
      <Image
        src={s.src}
        alt={s.alt}
        fill
        sizes="(max-width: 1024px) 100vw, 720px"
        className="object-cover object-left-top"
      />
    </div>
  );
}

export function RdsCapabilities() {
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
        top="A complete rack"
        bottom="Diagnostic workflow."
        size="compact"
        width="wide"
        body="Seven connected capabilities move rack safety from periodic audit to continuous management."
      />

      <div
        ref={track}
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-10 lg:gap-16"
      >
        {/* the seven, scrolling */}
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
                  <Shot shot={g.shot} />
                </motion.div>
              </AnimatePresence>
            </Stage>

            <div className="mt-6 flex items-center gap-4">
              <span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/45 tabular-nums shrink-0">
                Capability {g.n} / {String(GROUPS.length).padStart(2, "0")}
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
