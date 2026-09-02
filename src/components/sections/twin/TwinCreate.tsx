"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PenLine, ScanLine } from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { TabBar } from "@/components/sections/imds/imds-shared";

/**
 * Creation.
 *
 * Two routes in, so two tabs. Copy left, the screen right, and what the route
 * is made of running full width underneath — the same shape on both tabs, so
 * switching changes the content and not the layout.
 *
 * The pipeline is drawn as a pipeline: five nodes on one rail with the signal
 * travelling between them, ending on the thing it produces. No shadows
 * anywhere — depth comes from the rail and the movement along it.
 */

const LINE = "#E8E8ED";

/* ── MEDIA ──────────────────────────────────────────────────────────
   Both slots are marked "Awaiting product screen" in the source. They run
   the Jira placeholder the other product pages fall back on until a real
   builder capture and a real scan-to-model capture exist.
   ─────────────────────────────────────────────────────────────────── */
const PLACEHOLDER = "/Product/irds/hero.mp4";

const TABS = ["Draw", "Scan"];
const ICONS = [PenLine, ScanLine];

const ROUTES = [
  {
    top: "For facilities where the",
    bottom: "geometry is known.",
    body: "The environment is built directly in the platform. Deliberately simple enough that a facility can be modelled by the people who run it — not only by a survey team.",
    listLabel: "What gets modelled",
    frame: "Digital Twin — drawing environment",
    state: "Building",
  },
  {
    top: "For facilities that already",
    bottom: "exist and already run.",
    body: "The building is captured as it is — including everything that drifted from the original drawing — then cleaned, processed and resolved into a structured model.",
    listLabel: "How it arrives",
    frame: "Point cloud → structured model",
    state: "Resolving",
  },
];

const DRAWABLE = [
  "Warehouse",
  "Factory",
  "Racks",
  "Aisles",
  "Docks",
  "Machines",
  "Work areas",
  "Walls",
  "Columns",
  "Zones",
  "Physical assets",
];

const FLOW = [
  "LiDAR scan",
  "Upload",
  "Clean & process",
  "Draw",
  "Digital Twin",
];

/* ── the screen ──────────────────────────────────────────── */

function Screen({ name, state }: { name: string; state: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  /* React sets `muted` as a property rather than a reliable attribute, so a
     browser can decide the element is unmuted and refuse to autoplay it. */
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const start = () => v.play().catch(() => {});
    start();
    v.addEventListener("loadeddata", start);
    return () => v.removeEventListener("loadeddata", start);
  }, []);

  return (
    <div
      className="overflow-hidden bg-white"
      style={{ borderRadius: 16, border: `1px solid ${LINE}` }}
    >
      <div
        className="flex items-center justify-between gap-3 px-5 py-3.5"
        style={{ borderBottom: `1px solid ${LINE}`, background: "#FAFAFB" }}
      >
        <span className="text-[11.5px] font-semibold text-carbon">{name}</span>
        <span className="flex items-center gap-2 text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase text-signal-orange">
          <span className="relative flex w-1.5 h-1.5">
            <motion.span
              className="absolute inset-0 rounded-full bg-signal-orange"
              animate={{ scale: [1, 2.6], opacity: [0.6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
            <span className="relative w-1.5 h-1.5 rounded-full bg-signal-orange" />
          </span>
          {state}
        </span>
      </div>

      <video
        ref={ref}
        src={PLACEHOLDER}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="block w-full h-auto"
      />
    </div>
  );
}

/* ── the pipeline ────────────────────────────────────────── */

const TICK_MS = 90;
/** Ticks per connector, then a rest before it runs again. */
const LEG = 9;
const REST = 8;

function Pipeline({ still }: { still: boolean }) {
  const [t, setT] = useState(0);

  useEffect(() => {
    if (still) return;
    const id = setInterval(() => setT((v) => v + 1), TICK_MS);
    return () => clearInterval(id);
  }, [still]);

  const span = LEG * (FLOW.length - 1) + REST;
  const phase = t % span;
  /** Which connector the signal is on, and how far along it is. */
  const leg = Math.floor(phase / LEG);
  const along = (phase % LEG) / (LEG - 1);
  const arrived = still ? FLOW.length - 1 : Math.min(leg, FLOW.length - 1);

  return (
    <div className="flex items-start">
      {FLOW.map((f, i) => {
        const end = i === FLOW.length - 1;
        const lit = still || i <= arrived;
        return (
          <div key={f} className="flex-1 flex items-start">
            <div className="flex flex-col items-center gap-2.5 w-[74px] shrink-0">
              <span
                className="relative flex items-center justify-center w-[13px] h-[13px] rounded-full transition-colors duration-300"
                style={{
                  background: end && lit ? "#FF6A00" : "#FFFFFF",
                  border: `1px solid ${lit ? "#FF6A00" : "#D3D3D9"}`,
                }}
              >
                {lit && !end && (
                  <span className="w-[5px] h-[5px] rounded-full bg-signal-orange" />
                )}
              </span>
              <span
                className={
                  "text-center text-[11.5px] leading-[1.3] transition-colors duration-300 " +
                  (end
                    ? "font-semibold text-signal-orange"
                    : lit
                      ? "text-carbon"
                      : "text-graphite/45")
                }
              >
                {f}
              </span>
            </div>

            {/* the leg the signal is travelling along */}
            {!end && (
              <span
                className="relative flex-1 h-px mt-[6px] overflow-hidden"
                style={{ background: "#DEDEE4" }}
              >
                <span
                  className="absolute inset-y-0 left-0 bg-signal-orange"
                  style={{
                    width: still
                      ? "100%"
                      : i < leg
                        ? "100%"
                        : i === leg
                          ? `${(along * 100).toFixed(1)}%`
                          : "0%",
                    transition: "width 90ms linear",
                  }}
                />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function TwinCreate() {
  const [tab, setTab] = useState(0);
  const still = useReducedMotion() ?? false;
  const r = ROUTES[tab];

  return (
    <Section surface="offWhite" id="create">
      <SectionHeader
        eyebrow="Creation"
        top="Create the physical"
        bottom="World digitally."
        body="There are two practical starting points, and both end in the same place. Digitising an existing facility should not become another engineering project."
        size="compact"
        width="wide"
        bodyWidth="wide"
      />

      <TabBar
        tabs={TABS}
        icons={ICONS}
        active={tab}
        onChange={setTab}
        label="How the twin is created"
        tone="light"
      />

      <div className="mt-12 sm:mt-14 max-w-[1180px] mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-6">
                <h3 className="font-rams-heading text-[26px] sm:text-[32px] font-bold tracking-[-0.032em] leading-[1.15] text-carbon">
                  {r.top}
                  <br />
                  {r.bottom}
                </h3>

                <p className="mt-5 text-[14.5px] sm:text-[15.5px] leading-[1.65] text-graphite/60 max-w-[50ch]">
                  {r.body}
                </p>

                <div
                  className="mt-9 pt-7"
                  style={{ borderTop: `1px solid ${LINE}` }}
                >
                  <p className="text-[9.5px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/40">
                    {r.listLabel}
                  </p>

                  {tab === 0 ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {DRAWABLE.map((d, i) => (
                        <motion.span
                          key={d}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: 0.1 + i * 0.035,
                            ease: EASE,
                          }}
                          className="px-3.5 py-2 rounded-full text-[12.5px] text-graphite/70 bg-white"
                          style={{ border: `1px solid ${LINE}` }}
                        >
                          {d}
                        </motion.span>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-7">
                      <Pipeline still={still} />
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-6">
                <Screen name={r.frame} state={r.state} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="max-w-[900px] mx-auto mt-20 sm:mt-24 text-center font-rams-heading text-[24px] sm:text-[32px] font-bold tracking-[-0.032em] leading-[1.2] text-carbon"
      >
        Scanning is one route in, not the product.
        <br />
        The output is a{" "}
        <span className="text-signal-orange">
          structured, addressable model
        </span>
        .
      </motion.p>
    </Section>
  );
}
