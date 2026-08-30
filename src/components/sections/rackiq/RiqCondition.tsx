"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section, frameStyle } from "./rackiq-shared";

/**
 * Question 01 — Condition.
 *
 * One centred composition: header → five-step control → one screen. The five
 * steps above the frame are the only navigation; nothing sits below the screen.
 *
 * The stage is a screen recording of the real application, not a rebuilt
 * interface. Each step swaps the clip inside the same browser chrome, so the
 * frame never moves and the five stages read as one continuous session.
 *
 * ── SWAPPING IN THE REAL RECORDINGS ──────────────────────────────────
 * Every step's clip is the `src` in STEPS below, and nothing else in this
 * file needs to change. Today all five point at the placeholder footage the
 * site already ships (`/Jira PT VP …`), so the same clip repeats — that is
 * expected until the real captures land. Drop the recordings into
 * /public/Product/irds/ and replace the five paths.
 *
 * Recording notes for whoever captures them: 16:9, no browser chrome in shot
 * (this frame supplies it), and short enough to read in one pass — the stage
 * advances on STEP_MS below, so keep each clip at or under that. Once the real
 * clips exist, advancing on the video's own `ended` event reads better than a
 * fixed timer.
 * ─────────────────────────────────────────────────────────────────────
 */

const LINE = "#E8E8ED";
const ORANGE = "#FF6A00";

const PLACEHOLDER_1 = "/Jira PT VP 1 Demo Placeholder-948px-60fps-crf23.mp4";
const PLACEHOLDER_2 = "/Jira PT VP 2 Demo Placeholder-948px-60fps-crf23.mp4";
const PLACEHOLDER_3 = "/Jira PT VP 3 Demo Placeholder-948px-60fps-crf23.mp4";

const STEPS = [
  {
    n: "01",
    key: "identify",
    label: "Identify",
    path: "app.rams.digital/irds/inspection/identify",
    src: PLACEHOLDER_1,
  },
  {
    n: "02",
    key: "inspect",
    label: "Inspect",
    path: "app.rams.digital/irds/inspection/checklist",
    src: PLACEHOLDER_2,
  },
  {
    n: "03",
    key: "capture",
    label: "Capture",
    path: "app.rams.digital/irds/inspection/finding",
    src: PLACEHOLDER_3,
  },
  {
    n: "04",
    key: "measure",
    label: "Measure",
    path: "app.rams.digital/irds/inspection/measurement",
    src: PLACEHOLDER_1,
  },
  {
    n: "05",
    key: "save",
    label: "Save",
    path: "app.rams.digital/irds/inspection/record",
    src: PLACEHOLDER_2,
  },
] as const;

const STEP_MS = 6000;

export function RiqCondition() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [manual, setManual] = useState(false);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (reduce || manual || paused) return;
    const id = setInterval(() => setStep((s) => (s + 1) % STEPS.length), STEP_MS);
    return () => clearInterval(id);
  }, [reduce, manual, paused]);

  const pick = (i: number) => {
    setManual(true);
    setStep(i);
  };

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  };

  const active = STEPS[step];

  return (
    <Section surface="white" id="q1">
      {/* ── centred header ───────────────────────────── */}
      <SectionHeader
        eyebrow="Condition"
        top="Inspect on the rack."
        bottom="Structure the data at the source."
        size="compact"
        width="wide"
        className="!mb-0"
      />
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
        className="mt-6 text-[14px] sm:text-[15px] leading-[1.55] text-graphite/65 max-w-[660px] mx-auto text-center"
      >
        The inspector works on the floor, in the application. Every finding is
        structured as it is captured — so nothing has to be interpreted later.
      </motion.p>

      {/* ── the only workflow navigation ─────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
        className="relative mt-14 sm:mt-16 max-w-[840px] mx-auto"
        role="tablist"
        aria-label="Inspection stages"
      >
        <span
          aria-hidden
          className="absolute left-[10%] right-[10%] top-[7px] h-px"
          style={{ background: LINE }}
        />
        <motion.span
          aria-hidden
          className="absolute left-[10%] top-[7px] h-px origin-left"
          style={{ background: ORANGE }}
          animate={{ width: `${(step / (STEPS.length - 1)) * 80}%` }}
          transition={{ duration: 0.5, ease: EASE }}
        />

        <div className="relative grid grid-cols-5">
          {STEPS.map((s, i) => {
            const on = i === step;
            const done = i < step;
            return (
              <button
                key={s.key}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => pick(i)}
                className="group flex flex-col items-center gap-3 pb-1 outline-none focus-visible:ring-2 focus-visible:ring-signal-orange/50 rounded-md"
              >
                <span
                  className="w-[15px] h-[15px] rounded-full flex items-center justify-center transition-colors duration-200"
                  style={{
                    background: on || done ? ORANGE : "#FFFFFF",
                    border: `1px solid ${on || done ? ORANGE : "#D9DBDD"}`,
                    boxShadow: "0 0 0 4px #FFFFFF",
                  }}
                >
                  <span
                    className="w-[5px] h-[5px] rounded-full transition-colors duration-200"
                    style={{ background: on || done ? "#FFFFFF" : "transparent" }}
                  />
                </span>

                <span className="flex flex-col items-center gap-1">
                  <span
                    className="text-[9.5px] font-mono font-bold tracking-[0.16em] tabular-nums transition-colors duration-200"
                    style={{ color: on ? ORANGE : "rgba(51,54,58,0.35)" }}
                  >
                    {s.n}
                  </span>
                  <span
                    className={
                      "text-[12px] sm:text-[13px] tracking-[-0.01em] transition-colors duration-200 " +
                      (on
                        ? "font-semibold text-carbon"
                        : "font-medium text-graphite/45 group-hover:text-carbon")
                    }
                  >
                    {s.label}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ── one screen, recorded ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        className="mt-10 sm:mt-12 max-w-[1080px] mx-auto"
      >
        {/* frameStyle carries the site's drop shadow; overridden here only,
            so every other framed visual on the page keeps it. */}
        <div
          className="overflow-hidden"
          style={{ ...frameStyle("light"), boxShadow: "none" }}
        >
          {/* browser chrome — held still while the clip beneath changes */}
          <div
            className="flex items-center gap-2 px-4 h-10 shrink-0"
            style={{ borderBottom: `1px solid ${LINE}`, background: "#FAFAFB" }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: "#E4E4E9" }}
              />
            ))}
            <div
              className="ml-3 flex-1 max-w-[340px] h-6 rounded-md flex items-center px-3 min-w-0"
              style={{ background: "#F1F1F4" }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={active.key}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.22, ease: EASE }}
                  className="text-[10.5px] font-mono truncate text-graphite/45"
                >
                  {active.path}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* the recording */}
          <div className="relative aspect-[16/9] bg-carbon">
            <AnimatePresence mode="wait">
              <motion.video
                key={active.key}
                ref={videoRef}
                src={active.src}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                initial={{ opacity: 0, scale: 1.01 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.995 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>

            <button
              type="button"
              onClick={toggle}
              aria-label={paused ? "Play recording" : "Pause recording"}
              className="absolute bottom-3 right-3 flex items-center justify-center w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/20 text-white transition-all duration-200 z-10"
            >
              {paused ? (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              ) : (
                <Pause className="w-3.5 h-3.5 fill-current" />
              )}
            </button>
          </div>
        </div>
      </motion.div>

    </Section>
  );
}
