"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * The Physical Operating System.
 *
 * A stack is a vertical argument, so the reader climbs it: the layers scroll
 * up the left column one at a time, and the diagram on the right stays put
 * and lights the layer you are currently reading. Nothing to click — the
 * scroll is the control.
 *
 * The diagram is drawn in stack order, L5 at the top and L0 on the floor, so
 * the thing on screen matches the thing being described. L1 keeps a ground the
 * others do not: it is the foundation, and the section exists to say so.
 *
 * The section opts out of the standard overflow clip: an ancestor with
 * `overflow: hidden` disables `position: sticky` inside it.
 */

const LINE = "#E8E8ED";

type Layer = {
  n: string;
  title: string;
  label: string;
  body: string;
  tags: string[];
  /** What the pinned panel shows while this layer is being read. */
  img: string;
  base?: boolean;
};

const LAYERS: Layer[] = [
  {
    n: "L5",
    img: "/6th - Management Visibility.png",
    title: "Business & enterprise systems",
    label: "Layer 5",
    body: "ERP, WMS, MES and CMMS remain the systems of record. They are not replaced. They gain a physical counterpart — a place where their records can be checked against what is actually in the building.",
    tags: ["ERP", "WMS", "MES", "CMMS", "Enterprise platforms"],
  },
  {
    n: "L4",
    img: "/Product/irds/findings-list.png",
    title: "Built process applications",
    label: "Layer 4",
    body: "The workflows an operation actually runs: inspection, safety, maintenance, execution, analytics. Each one is a specialised application; all of them read and write against the same physical model.",
    tags: [
      "Safety",
      "Productivity",
      "Efficiency",
      "Inventory",
      "Inspection",
      "Maintenance",
      "Execution",
      "Analytics",
    ],
  },
  {
    n: "L3",
    img: "/AI Vision.png",
    title: "AI & intelligence",
    label: "Layer 3",
    body: "Detection, classification, anomaly and pattern recognition. Useful in isolation, decisive when the output is anchored to a location, an asset and a history at that location.",
    tags: [
      "Computer vision",
      "Pattern recognition",
      "Anomaly detection",
      "Spatial intelligence",
      "Optimisation",
      "Decision support",
    ],
  },
  {
    n: "L2",
    img: "/OmniBox.png",
    title: "Edge & IoT",
    label: "Layer 2",
    body: "The instrumentation and the processing closest to it. Sensors capture, edge processors decide locally, and both resolve back into the twin so the facility keeps the record.",
    tags: [
      "Edge processors",
      "Sensors",
      "Cameras",
      "LiDAR",
      "Machine interfaces",
      "IoT devices",
    ],
  },
  {
    n: "L1",
    img: "/Digital Twin.png",
    title: "Digital Twin — physical context",
    label: "Layer 1 — Foundation",
    body: "The structured, addressable model of the facility. Geometry, assets, zones and identities in one coordinate space. Every layer above resolves into it; without it, each layer builds its own private idea of where things are.",
    tags: [
      "Geometry",
      "Assets",
      "Zones",
      "Identities",
      "Spatial context",
      "History",
    ],
    base: true,
  },
  {
    n: "L0",
    img: "/Racks.png",
    title: "The physical world",
    label: "Layer 0",
    body: "Where value is created or lost. Heavy machines, dense storage and people, interacting continuously — the part of the operation that software has historically understood least.",
    tags: ["Factory", "Warehouse", "Assets", "People", "Material", "Machines"],
  },
];

/* ── the panel that follows the reading ──────────────────── */

function Screen({ at }: { at: number }) {
  const l = LAYERS[at];
  return (
    <div
      className="overflow-hidden bg-white"
      style={{ borderRadius: 16, border: `1px solid ${LINE}` }}
    >
      <div
        className="flex items-center justify-between gap-3 px-5 py-3.5"
        style={{ borderBottom: `1px solid ${LINE}`, background: "#FAFAFB" }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={l.n}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="text-[11.5px] font-semibold text-carbon"
          >
            {l.title}
          </motion.span>
        </AnimatePresence>
        <span className="text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase text-signal-orange shrink-0">
          {l.n}
        </span>
      </div>

      <div className="relative aspect-[4/3]" style={{ background: "#F7F7F9" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={l.img}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="absolute inset-0"
          >
            <Image
              src={l.img}
              alt={l.title}
              fill
              sizes="(max-width: 1024px) 100vw, 560px"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <p
        className="px-5 py-3.5 text-[11.5px] text-graphite/45"
        style={{ borderTop: `1px solid ${LINE}`, background: "#FAFAFB" }}
      >
        Every layer resolves into the one beneath it.
      </p>
    </div>
  );
}

/* ── the section ─────────────────────────────────────────── */

export function TwinStack() {
  const [at, setAt] = useState(0);
  const blocks = useRef<(HTMLDivElement | null)[]>([]);

  /* Whichever block is nearest the middle of the viewport is the one being
     read, so the diagram follows the reading rather than the scrollbar. */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = blocks.current.indexOf(e.target as HTMLDivElement);
          if (i >= 0) setAt(i);
        });
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 },
    );
    blocks.current.forEach((b) => b && io.observe(b));
    return () => io.disconnect();
  }, []);

  return (
    <Section surface="white" id="stack" clip={false}>
      <SectionHeader
        eyebrow="Architecture"
        top="The Physical"
        bottom="Operating System."
        body="Digital Twin is the foundation. AI, IoT and applications make it operational."
        size="compact"
        width="wide"
        bodyWidth="wide"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch max-w-[1180px] mx-auto">
        {/* the layers, climbed one at a time */}
        <div className="lg:col-span-6">
          {LAYERS.map((l, i) => (
            <div
              key={l.n}
              ref={(el) => {
                blocks.current[i] = el;
              }}
              className="py-14 sm:py-16 first:pt-0"
              style={{ borderTop: i ? `1px solid ${LINE}` : undefined }}
            >
              {/* only the layer being read is at full strength, so the
                  column says which one the panel is showing */}
              <motion.div
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                animate={{ opacity: i === at ? 1 : 0.32 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <p className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
                  {l.label}
                </p>
                <h3
                  className="mt-4 font-rams-heading text-[24px] sm:text-[30px] font-bold tracking-[-0.032em] leading-[1.18] transition-colors duration-500"
                  style={{ color: i === at ? "#08080A" : "rgba(56,56,62,0.9)" }}
                >
                  {l.title}
                </h3>
                <p className="mt-4 text-[14.5px] leading-[1.65] text-graphite/60 max-w-[52ch]">
                  {l.body}
                </p>

                <div className="mt-6 flex flex-wrap gap-1.5">
                  {l.tags.map((g) => (
                    <span
                      key={g}
                      className="px-2.5 py-1 rounded-full text-[11.5px] text-graphite/60"
                      style={{ border: `1px solid ${LINE}` }}
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* which stays put and follows along */}
        <div className="lg:col-span-6 lg:h-full">
          <div className="lg:sticky lg:top-28">
            <Screen at={at} />
          </div>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="max-w-[900px] mx-auto mt-20 sm:mt-24 text-center font-rams-heading text-[22px] sm:text-[30px] font-bold tracking-[-0.03em] leading-[1.25] text-carbon"
      >
        Every layer above needs the same answer to one question:{" "}
        <span className="text-signal-orange">
          where is this happening, and what is it happening to?
        </span>
      </motion.p>
    </Section>
  );
}
