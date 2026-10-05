"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
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
 * 05 — The RAMS 8D framework.
 *
 * Sticky-scroll: the eight layers scroll past on the left and the frame on the
 * right is pinned, swapping to whichever layer is in view. The scroll position
 * drives the index — `useScroll` over the track, the same mechanism
 * `PhysicalOperation` uses — rather than an interval, because the viewer is
 * the one moving through it.
 *
 * The frame is deliberately **not** the shared `ProductFrame`. That one wears
 * browser chrome — traffic lights and a URL bar — which says "this is a web
 * page". Here the screen is the subject: a device frame with a hairline edge
 * and no drop shadow, placed on a gradient stage with room above and to its
 * left and running off the bottom right — the composition from the reference.
 *
 * Seven of the eight layers map onto a screen we actually have. **Simulation
 * does not** — there is no capture of it in /public/Product — so it gets a
 * dashed pending slot rather than a borrowed screenshot of something else.
 * Drop a real capture in, register it in `SHOTS`, and set `shot` on it.
 *
 * `clip={false}` on the section: an ancestor with `overflow: hidden` disables
 * `position: sticky` inside it, so the pinned column would just scroll away.
 *
 * ── Below lg ────────────────────────────────────────────────────────
 * There is no room for two columns, so the frame goes after the section's
 * body text and pins to the top of the screen, with the eight layers
 * scrolling up beneath it. The layer is picked by whichever one crosses the
 * middle of the screen (`useInView` on a thin band), not by progress over
 * the track: the pinned frame takes the top third, so a progress mapping
 * would switch layers while their text was still under it. The pin is
 * scoped to the mobile track, so once layer 08 has scrolled through it
 * lets go and the page scrolls on as normal. It pins at the very top
 * because the site header slides away while the reader scrolls down.
 */

const HAIR = "#E8E8ED";

type Layer = {
  n: string;
  title: string;
  q: string;
  body: string;
  shot?: ShotKey;
};

const LAYERS: Layer[] = [
  {
    n: "01",
    title: "Spatial",
    q: "Where is it?",
    body: "Geometry, layout, dimensions, zones and the spatial relationships between everything in the building.",
    shot: "regionalDashboard",
  },
  {
    n: "02",
    title: "Asset",
    q: "What is it?",
    body: "Class, specification, make and the identity that follows the asset from installation to disposal.",
    shot: "taskDetails",
  },
  {
    n: "03",
    title: "Time",
    q: "How has it changed?",
    body: "Every state the facility has been in, retained — so change is measurable rather than remembered.",
    shot: "regionalRanking",
  },
  {
    n: "04",
    title: "Condition",
    q: "What condition is it in?",
    body: "Structural and operational state against the standard it was designed to, with the severity that follows.",
    shot: "rackHealth3d",
  },
  {
    n: "05",
    title: "Operation",
    q: "How is it being used?",
    body: "Occupancy, throughput, the traffic that passes it and the equipment that works it.",
    shot: "regionalAnalytics",
  },
  {
    n: "06",
    title: "Simulation",
    q: "What if we change it?",
    body: "Reach, clearance, flow and capacity, answered against the model while the change is still a proposal.",
  },
  {
    n: "07",
    title: "Live",
    q: "What is happening now?",
    body: "The current reading, in place — impact, tilt, load, movement and the events arriving this second.",
    shot: "regionalActions",
  },
  {
    n: "08",
    title: "Intelligence",
    q: "What does it mean next?",
    body: "The seven layers above read together: a pattern rather than an alert, and what to do before it repeats.",
    shot: "dashboard",
  },
];

/** The stage the mockup sits on. */
const STAGE_RATIO = "5 / 4";
/** Shorter on a phone, so the pinned frame leaves room for the text. */
const STAGE_RATIO_MOBILE = "16 / 11";

/**
 * The stage.
 *
 * A gradient panel with the device inset from the top left and running off the
 * bottom right — the composition from the reference. The point of it is the
 * space: the mockup is not fitted to a box, it is placed on a ground with room
 * around two of its sides and cropped by the other two.
 *
 * The gradient is a warm near-black with an orange bloom rather than the
 * reference's magenta — signal-orange is the only accent this site has, and a
 * white product screen reads cleanly on a dark ground.
 */
function Stage({
  children,
  ratio = STAGE_RATIO,
}: {
  children: React.ReactNode;
  ratio?: string;
}) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: ratio,
        borderRadius: 24,
        background:
          "radial-gradient(95% 85% at 18% 12%, rgba(255,106,0,0.34) 0%, transparent 58%)," +
          "linear-gradient(148deg, #26262E 0%, #15151A 58%, #0C0C0F 100%)",
      }}
    >
      {/* Inset top left, past the edge bottom right. */}
      <div className="absolute left-[9%] top-[11%] right-[-16%] bottom-[-18%]">
        {children}
      </div>
    </div>
  );
}

/**
 * Device frame. No browser chrome and no drop shadow — a hairline edge and an
 * inner ring, sitting on the stage.
 *
 * The capture is `object-cover` in a fixed box. The eight screenshots are all
 * different shapes (1633×908, 1908×909, 1484×840, 1472×976), so fitting each
 * one made the frame jump size on every layer.
 */
function Frame({
  children,
  dashed,
}: {
  children: React.ReactNode;
  dashed?: boolean;
}) {
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        borderRadius: 16,
        background: "#FFFFFF",
        border: `1px ${dashed ? "dashed" : "solid"} rgba(255,255,255,0.22)`,
      }}
    >
      {children}
    </div>
  );
}

function Shot({ shot }: { shot: ShotKey }) {
  const s = SHOTS[shot];
  return (
    <Frame>
      <Image
        src={s.src}
        alt={s.alt}
        fill
        sizes="(max-width: 1024px) 100vw, 720px"
        className="object-cover object-left-top"
      />
    </Frame>
  );
}

function PendingShot() {
  return (
    <Frame dashed>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/35">
          Capture pending
        </span>
      </div>
    </Frame>
  );
}

/** One layer's copy, dimmed unless it is the current one. */
function LayerCopy({ l, now }: { l: Layer; now: boolean }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: now ? 1 : 0.36 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-signal-orange tabular-nums">
        {l.n}
      </span>
      <h3 className="mt-3 text-[26px] sm:text-[32px] font-bold tracking-[-0.03em] leading-[1.15] text-carbon">
        {l.title}
      </h3>
      <p className="mt-2 text-[15px] sm:text-[17px] italic text-graphite/50">
        {l.q}
      </p>
      <p className="mt-4 text-[14px] leading-[1.65] text-graphite/65 max-w-[46ch]">
        {l.body}
      </p>
    </motion.div>
  );
}

/**
 * The frame for the current layer. A dissolve: both frames are stacked in the
 * same box and cross-fade — `mode="wait"` would empty the box between them,
 * which reads as a flash.
 */
function LayerScreen({ layer, ratio }: { layer: Layer; ratio?: string }) {
  return (
    <Stage ratio={ratio}>
      <AnimatePresence>
        <motion.div
          key={layer.n}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.015 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {layer.shot ? <Shot shot={layer.shot} /> : <PendingShot />}
        </motion.div>
      </AnimatePresence>
    </Stage>
  );
}

/** "Layer 03 / 08" and the eight-segment progress bar. */
function LayerProgress({ at, className }: { at: number; className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className ?? ""}`}>
      <span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/45 tabular-nums shrink-0">
        Layer {LAYERS[at].n} / 08
      </span>
      <span className="flex items-center gap-1.5 flex-1">
        {LAYERS.map((l, n) => (
          <span
            key={l.n}
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
  );
}

/** A layer in the mobile track; reports itself when it crosses mid-screen. */
function MobileLayer({
  l,
  n,
  now,
  onActive,
}: {
  l: Layer;
  n: number;
  now: boolean;
  onActive: (n: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  /* A thin band just below the middle of the screen — under the pinned
     frame, where the reader's eye is. */
  const inView = useInView(ref, { margin: "-52% 0px -42% 0px" });

  useEffect(() => {
    if (inView) onActive(n);
  }, [inView, n, onActive]);

  return (
    <div ref={ref} className="py-8 min-h-[38vh] flex flex-col justify-center">
      <LayerCopy l={l} now={now} />
    </div>
  );
}

export function TwinLayers() {
  const track = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  const [mobileAt, setMobileAt] = useState(0);
  const onMobileActive = useCallback((n: number) => setMobileAt(n), []);

  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start 30%", "end 70%"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setAt(
      Math.max(0, Math.min(LAYERS.length - 1, Math.floor(v * LAYERS.length))),
    );
  });

  return (
    <Section surface="offWhite" id="layers" clip={false}>
      <SectionHeader
        eyebrow="The RAMS 8D framework"
        top="Eight connected layers"
        bottom="Of understanding."
        size="compact"
        width="wide"
        body="A 3D model answers the first two. Everything after that is what makes it a twin."
      />

      {/* Below lg: the frame pinned above the eight, scrolling. */}
      <div className="lg:hidden">
        <div className="sticky top-3 z-10 -mx-2 px-2 pt-2 pb-4 bg-[#F5F5F7]">
          <LayerScreen layer={LAYERS[mobileAt]} ratio={STAGE_RATIO_MOBILE} />
          <LayerProgress at={mobileAt} className="mt-4" />
        </div>
        <div className="flex flex-col">
          {LAYERS.map((l, n) => (
            <MobileLayer
              key={l.n}
              l={l}
              n={n}
              now={n === mobileAt}
              onActive={onMobileActive}
            />
          ))}
        </div>
      </div>

      {/* lg and up: the eight on the left, the frame pinned on the right. */}
      <div
        ref={track}
        className="hidden lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16"
      >
        <div className="flex flex-col">
          {LAYERS.map((l, n) => (
            <div
              key={l.n}
              className="py-8 lg:min-h-[44vh] flex flex-col justify-center"
            >
              <LayerCopy l={l} now={n === at} />
            </div>
          ))}
        </div>

        <div>
          <div className="sticky top-28">
            <LayerScreen layer={LAYERS[at]} />
            <LayerProgress at={at} className="mt-6" />
          </div>
        </div>
      </div>
    </Section>
  );
}
