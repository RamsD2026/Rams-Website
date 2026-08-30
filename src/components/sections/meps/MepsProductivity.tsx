"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Productivity intelligence.
 *
 * The document's three questions — work, asset & operator, environment — are
 * asked of the same movement data, so they are tabs rather than three stacked
 * blocks: one heading, one panel, three ways of reading it.
 *
 * Each panel is a 4/8 split: the question and its three readings in a narrow
 * left column, the screen in the wide one. The readings are keywords rather
 * than sentences — at a third of the width, prose would set as a ribbon.
 *
 * All three frames play a recording; see the MEDIA note on Screen below for
 * what is actually in it.
 */

const LINE = "#E4E4E9";

const TABS = [
  { k: "work", label: "Work" },
  { k: "asset", label: "Asset & operator" },
  { k: "env", label: "Environment" },
] as const;

type TabKey = (typeof TABS)[number]["k"];

/* ── pieces ──────────────────────────────────────────────── */

/**
 * The screen inside a frame.
 *
 * ── MEDIA ────────────────────────────────────────────────────────────
 * SCREEN_SRC is a placeholder. There is no MEPS footage in /public — this is
 * the clip the IRDS hero uses, which is Atlassian's "CSD-24696 Agents In
 * Jira". All three frames point at this one constant; swap it for real Task,
 * Asset and Environment recordings and nothing else here changes.
 *
 * The source document marks two of the three "Awaiting product screen", so
 * those tags stay dashed until real footage lands.
 * ─────────────────────────────────────────────────────────────────────
 */
const SCREEN_SRC = "/Product/irds/hero.mp4";

function Screen() {
  const videoRef = useRef<HTMLVideoElement>(null);

  /* React sets `muted` as a property rather than a reliable attribute, so a
     browser can decide the element is unmuted and refuse to autoplay it. */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const start = () => v.play().catch(() => {});
    start();
    v.addEventListener("loadeddata", start);
    return () => v.removeEventListener("loadeddata", start);
  }, []);

  return (
    <video
      ref={videoRef}
      src={SCREEN_SRC}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      className="block w-full h-auto"
    />
  );
}

function Frame({
  title,
  tag,
  solidTag,
}: {
  title: string;
  tag: string;
  solidTag?: boolean;
}) {
  return (
    <div
      className="overflow-hidden"
      style={{
        borderRadius: 14,
        background: "#FFFFFF",
        border: `1px solid ${LINE}`,
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.02), 0 16px 40px -20px rgba(14,14,15,0.14)",
      }}
    >
      <div
        className="flex items-center gap-2.5 px-4 h-11 flex-wrap"
        style={{ borderBottom: `1px solid ${LINE}`, background: "#FAFAFB" }}
      >
        <span className="text-[11.5px] font-semibold text-carbon">{title}</span>
        <span
          className="ml-auto px-2.5 py-1 rounded-full text-[9.5px] font-mono font-bold tracking-[0.12em] uppercase text-graphite/45"
          style={{ border: `1px ${solidTag ? "solid" : "dashed"} ${LINE}` }}
        >
          {tag}
        </span>
      </div>
      <Screen />
    </div>
  );
}

/** The three readings — ticked keywords down the narrow column. */
function Points({ items }: { items: string[] }) {
  return (
    <div className="mt-8">
      {items.map((text, i) => (
        <div
          key={text}
          className="flex gap-3 py-3.5"
          style={{ borderTop: i === 0 ? "none" : `1px solid ${LINE}` }}
        >
          {/* the filled tick from EcosystemSection */}
          <span
            aria-hidden
            className="w-5 h-5 rounded-full bg-signal-orange flex items-center justify-center shrink-0 mt-px"
          >
            <Check className="w-3 h-3 text-white stroke-[2.5]" />
          </span>
          <p className="text-[14px] sm:text-[15px] font-medium text-carbon leading-[1.45] tracking-[-0.01em]">
            {text}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * One question. Copy left, screen right — 4/8 from lg up, stacked below it.
 *
 * No measure on the h3: the column is the measure.
 */
function Panel({
  heading,
  sub,
  points,
  frame,
}: {
  heading: React.ReactNode;
  sub: string;
  points: string[];
  frame: { title: string; tag: string; solidTag?: boolean };
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
      <div className="lg:col-span-4">
        <h3 className="font-rams-heading text-[23px] sm:text-[27px] lg:text-[29px] font-bold tracking-[-0.03em] leading-[1.2] text-carbon">
          {heading}
        </h3>
        <p className="mt-5 text-[14px] text-graphite/60 leading-[1.65]">
          {sub}
        </p>
        <Points items={points} />
      </div>

      <motion.div
        className="lg:col-span-8"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <Frame {...frame} />
      </motion.div>
    </div>
  );
}

/* ── the panels ──────────────────────────────────────────── */

function WorkPanel() {
  return (
    <Panel
      heading={
        <>How much of your fleet&rsquo;s travel actually moves material?</>
      }
      sub="Location tells us the MHE moved. Pallet Detection helps tell us whether that movement created material flow."
      points={[
        "Loaded vs empty travel, pallets per hour",
        "Idle-with-load time",
        "Hours lost to congestion",
      ]}
      frame={{
        title: "MEPS — Task Productivity",
        tag: "Awaiting product screen",
      }}
    />
  );
}

function AssetPanel() {
  return (
    <Panel
      heading="Understand the interaction between equipment, operator and work."
      sub="This is not a surveillance tool. It exists to balance workload, allocate resources, target training, test whether a machine type suits a zone, and compare shifts on the same measure."
      points={[
        "Performance by machine, operator, session",
        "Operator–MHE pairing",
        "Utilisation across sessions",
      ]}
      frame={{
        title: "MEPS — Asset Productivity",
        tag: "Awaiting product screen",
      }}
    />
  );
}

function EnvironmentPanel() {
  return (
    <Panel
      heading="Sometimes the MHE is not the problem. The environment is."
      sub="Output read by zone rather than by machine — layout, aisle configuration and travel distance all shape what a shift can produce."
      points={[
        "Output by zone, not by machine",
        "Layout, aisles, staging, travel distance",
        "Queueing and congestion by zone",
      ]}
      frame={{
        title: "Environment Productivity — Digital Twin",
        tag: "Live Digital Twin",
        solidTag: true,
      }}
    />
  );
}

/* ── the section ─────────────────────────────────────────── */

export function MepsProductivity() {
  const [tab, setTab] = useState<TabKey>("work");

  return (
    <Section surface="white" id="productivity">
      <SectionHeader
        eyebrow="Productivity intelligence"
        top="A moving MHE is not"
        bottom="always a productive MHE."
        body="Three questions, asked of the same movement data: how much of it moved material, which machines and operators produced it, and whether the building helped or got in the way."
        size="compact"
        width="wide"
        className="!mb-12 sm:!mb-14"
      />

      {/* the three questions, as the site's segmented control */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="flex justify-center mb-14 sm:mb-16"
        role="tablist"
        aria-label="Productivity intelligence"
      >
        <div className="inline-flex items-center bg-[#F2F2F2] rounded-full p-1.5 gap-0.5 w-full max-w-[520px]">
          {TABS.map((t) => {
            const on = t.k === tab;
            return (
              <button
                key={t.k}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setTab(t.k)}
                className={
                  "flex-1 py-2.5 text-[13px] font-medium transition-all duration-200 rounded-full whitespace-nowrap text-center " +
                  (on
                    ? "bg-carbon text-white"
                    : "text-graphite hover:text-signal-orange")
                }
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.28, ease: EASE }}
        >
          {tab === "work" && <WorkPanel />}
          {tab === "asset" && <AssetPanel />}
          {tab === "env" && <EnvironmentPanel />}
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}
