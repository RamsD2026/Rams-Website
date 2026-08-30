"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Efficiency analytics.
 *
 * Built on the pattern the IRDS Action section uses: steps down the left with
 * a rail that fills across the dwell, one screen on the right, and clicking a
 * step taking over from the auto-advance.
 *
 * Two steps, because the document has two: pallet efficiency and environment
 * efficiency. Each step's body carries that block's heading and its subline.
 *
 * ── MEDIA ────────────────────────────────────────────────────────────
 * SCREEN_SRC is a placeholder. There is no MEPS footage in /public — this is
 * the clip the IRDS hero uses, which is Atlassian's "CSD-24696 Agents In
 * Jira". Step 01 points at it. Step 02 is real: the zone-to-zone matrix is
 * the document's own data.
 * ─────────────────────────────────────────────────────────────────────
 */

const LINE = "#E4E4E9";
const DWELL = 5200;
const SCREEN_SRC = "/Product/irds/hero.mp4";

const STEPS: {
  n: string;
  k: string;
  title: string;
  body: string;
  frame: string;
  stage: "screen" | "matrix";
}[] = [
  {
    n: "01",
    k: "pallet",
    title: "Pallet efficiency",
    body: "How much time and distance does it take to move one pallet? Cycle time, distance, empty travel rate and fleet balance reduce a whole shift to one comparable number — across machines, operators and sites.",
    frame: "MEPS — Pallet & Fleet Efficiency",
    stage: "screen",
  },
  {
    n: "02",
    k: "environment",
    title: "Environment efficiency",
    body: "Movement data becomes built-environment intelligence. By mapping MHE activity against the Digital Twin, MEPS helps teams understand whether layout, staging, routes and traffic flow are influencing performance.",
    frame: "Environment Efficiency — Digital Twin & zone flow",
    stage: "matrix",
  },
];

const ZONES = ["Inbound", "Pick A", "Pick B", "Bulk C", "Rework", "Outbound"];

/** null = no recorded movement. Alpha per cell is derived from the value. */
const FLOW: { from: string; to: (number | null)[] }[] = [
  { from: "Inbound", to: [null, 418, 246, 357, 31, 44] },
  { from: "Pick A", to: [22, null, 88, 36, 67, 471] },
  { from: "Pick B", to: [14, 96, null, 29, 52, 318] },
  { from: "Bulk C", to: [null, 288, 201, null, 18, 58] },
];

const PEAK = 471;

/* ── the two stages ──────────────────────────────────────── */

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

/**
 * Zone-to-zone pallet flow. Cell tint is the value against the peak lane; the
 * number flips to white once the tint is dark enough to swallow carbon.
 */
function FlowMatrix() {
  return (
    <div className="px-4 py-6 sm:px-6 bg-white">
      <p className="text-[10px] font-mono tracking-[0.14em] uppercase text-graphite/45 mb-3">
        Zone-to-zone pallet flow — 7 days
      </p>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[620px] border-collapse">
          <thead>
            <tr>
              <th className="text-left px-3 py-2.5 text-[10px] font-mono font-bold tracking-[0.1em] uppercase text-graphite/45 whitespace-nowrap">
                From ↓ / To →
              </th>
              {ZONES.map((z) => (
                <th
                  key={z}
                  className="px-3 py-2.5 text-[10px] font-mono font-bold tracking-[0.1em] uppercase text-graphite/45 whitespace-nowrap"
                >
                  {z}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FLOW.map((row, r) => (
              <tr key={row.from}>
                <th
                  className="text-left px-3 py-2.5 text-[11.5px] font-semibold text-carbon whitespace-nowrap"
                  style={{ borderTop: `1px solid ${LINE}` }}
                >
                  {row.from}
                </th>
                {row.to.map((v, c) => {
                  const alpha = v === null ? 0 : (v / PEAK) * 0.62;
                  return (
                    <motion.td
                      key={c}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: (r * 6 + c) * 0.015 }}
                      className="px-3 py-2.5 text-center text-[12.5px] font-mono tabular-nums"
                      style={{
                        borderTop: `1px solid ${LINE}`,
                        background:
                          v === null
                            ? "rgba(14,14,15,0.03)"
                            : `rgba(255,106,0,${alpha})`,
                        color:
                          v === null
                            ? "rgba(14,14,15,0.28)"
                            : alpha > 0.38
                              ? "#FFFFFF"
                              : "#1D1D1F",
                      }}
                    >
                      {v === null ? "—" : v}
                    </motion.td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex items-center gap-5 flex-wrap">
        {[
          ["rgba(255,106,0,0.6)", "High-frequency flow"],
          ["rgba(255,106,0,0.1)", "Low-frequency flow"],
          ["rgba(14,14,15,0.06)", "No recorded movement"],
        ].map(([bg, label]) => (
          <span key={label} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-[3px]"
              style={{ background: bg, border: `1px solid ${LINE}` }}
            />
            <span className="text-[10.5px] text-graphite/55">{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── the section ─────────────────────────────────────────── */

export function MepsEfficiencyAnalytics() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    if (reduce || manual) return;
    const id = setInterval(() => setI((v) => (v + 1) % STEPS.length), DWELL);
    return () => clearInterval(id);
  }, [reduce, manual]);

  const pick = (n: number) => {
    setManual(true);
    setI(n);
  };

  const active = STEPS[i];

  return (
    <Section surface="warm" id="efficiency-analytics">
      <SectionHeader
        eyebrow="Efficiency analytics"
        top="Where the losses show up."
        bottom="Per pallet, and per zone."
        body="The four losses are not abstract. One screen measures what a single pallet costs in time and distance; the other maps the same movement back onto the building it happened in."
        size="compact"
        width="wide"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 lg:gap-12 items-start">
        {/* ── the four steps ───────────────────────────── */}
        <div
          className="flex flex-col"
          role="tablist"
          aria-label="Efficiency analytics"
        >
          {STEPS.map((s, n) => {
            const on = n === i;
            return (
              <div key={s.k}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => pick(n)}
                  className="relative w-full text-left py-6 pl-6 pr-2 outline-none focus-visible:ring-2 focus-visible:ring-signal-orange/50 rounded-r-lg"
                  style={{ borderTop: n === 0 ? "none" : `1px solid ${LINE}` }}
                >
                  {/* rail — fills across the dwell on the active step */}
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 bottom-0 w-[2px] overflow-hidden"
                    style={{ background: "#E4E4E9" }}
                  >
                    {on && (
                      <motion.span
                        key={`${s.k}-${manual}`}
                        className="block w-full origin-top"
                        style={{ background: "#FF6A00", height: "100%" }}
                        initial={{ scaleY: reduce || manual ? 1 : 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{
                          duration: reduce || manual ? 0.3 : DWELL / 1000,
                          ease: reduce || manual ? EASE : "linear",
                        }}
                      />
                    )}
                  </span>

                  <span className="flex items-baseline gap-3">
                    <span
                      className="text-[10px] font-mono font-bold tracking-[0.18em] tabular-nums transition-colors duration-200"
                      style={{ color: on ? "#FF6A00" : "rgba(51,54,58,0.35)" }}
                    >
                      {s.n}
                    </span>
                    <span
                      className={
                        "font-rams-heading text-[18px] sm:text-[20px] font-bold tracking-[-0.022em] transition-colors duration-200 " +
                        (on ? "text-carbon" : "text-graphite/50")
                      }
                    >
                      {s.title}
                    </span>
                  </span>

                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="overflow-hidden text-[13.5px] leading-[1.6] text-graphite/60 pl-[30px] pr-2"
                      >
                        <span className="block pt-3">{s.body}</span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            );
          })}
        </div>

        {/* ── the screen ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="overflow-hidden bg-white"
          style={{
            borderRadius: 16,
            border: `1px solid ${LINE}`,
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
          }}
        >
          {/* browser chrome */}
          <div
            className="flex items-center gap-2 px-4 h-10 shrink-0"
            style={{ borderBottom: "1px solid #EDEDF1", background: "#FAFAFB" }}
          >
            {[0, 1, 2].map((d) => (
              <span
                key={d}
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: "#E4E4E9" }}
              />
            ))}
            <div
              className="ml-3 flex-1 max-w-[320px] h-6 rounded-md flex items-center px-3 min-w-0"
              style={{ background: "#F1F1F4" }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={active.k}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="text-[10.5px] font-mono truncate text-graphite/45"
                >
                  app.rams.digital/meps/{active.k}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* the frame's own title, which changes with the step */}
          <div
            className="flex items-center gap-3 px-4 h-11"
            style={{ borderBottom: `1px solid ${LINE}`, background: "#FFFFFF" }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={active.frame}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="text-[11.5px] font-semibold text-carbon truncate"
              >
                {active.frame}
              </motion.span>
            </AnimatePresence>
            <span
              className="ml-auto px-2.5 py-1 rounded-full text-[9.5px] font-mono font-bold tracking-[0.12em] uppercase text-graphite/45 shrink-0"
              style={{
                border: `1px ${active.stage === "matrix" ? "solid" : "dashed"} ${LINE}`,
              }}
            >
              {active.stage === "matrix"
                ? "Live Digital Twin"
                : "Awaiting product screen"}
            </span>
          </div>

          {/* Keyed on the stage, not the step: 01–03 share one recording, so
              re-mounting between them would restart the video for no gain. */}
          <div style={{ background: "#F5F5F7" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active.stage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                {active.stage === "matrix" ? <FlowMatrix /> : <Screen />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
