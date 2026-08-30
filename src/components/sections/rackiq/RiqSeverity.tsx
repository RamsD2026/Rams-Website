"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ChapterHead,
  EASE,
  Flow,
  NoteLine,
  RAG,
  Section,
  Split,
} from "./rackiq-shared";

/**
 * Question 02 — Severity.
 *
 * Left/right: the argument on one side, the engineering check on the other.
 * <ChapterHead> and <Split> keep it in the same composition as the rest of the
 * chapters.
 *
 * The reading on the scale is draggable. Moving it across the configured limit
 * flips the classification, which turns the section's claim into something the
 * visitor can test: the colour is not an opinion, it is where the number fell
 * against a limit somebody configured.
 */

const LINE = "#E8E8ED";

/** The reading, in millimetres, against a 0–20 scale. */
const MEASURED = 14.2;
const LIMIT = 10;
const SCALE_MAX = 20;

const pct = (v: number) => (v / SCALE_MAX) * 100;

/**
 * The engineering check.
 *
 * The control is a transparent range input laid over the track, so dragging,
 * clicking, touch and arrow keys all work without any measurement code — and
 * it is focusable and announced without a custom ARIA slider.
 */
function Instrument() {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(MEASURED);
  const [dragging, setDragging] = useState(false);

  const over = value > LIMIT;
  const rag = over ? RAG.red : RAG.green;

  return (
    <div className="px-6 py-8 sm:px-9 sm:py-10">
      <p className="text-[10.5px] font-mono font-bold tracking-[0.14em] uppercase text-graphite/45">
        Plumbness · R07 / Bay 14 / L3
      </p>

      {/* the reading, against the limit it is judged by */}
      <div className="mt-7 flex items-end gap-10 sm:gap-14 flex-wrap">
        <span className="flex flex-col">
          <span className="text-[10px] font-mono tracking-[0.1em] uppercase text-graphite/40 mb-2">
            Measured
          </span>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.15, ease: EASE }}
            className="text-[42px] sm:text-[52px] font-bold tabular-nums leading-[0.9] tracking-[-0.035em] transition-colors duration-200"
            style={{ color: rag.app }}
          >
            {value.toFixed(1)}
            <span className="text-[15px] font-semibold ml-1">mm</span>
          </motion.span>
        </span>

        <span className="flex flex-col">
          <span className="text-[10px] font-mono tracking-[0.1em] uppercase text-graphite/40 mb-2">
            Configured limit
          </span>
          <span className="text-[42px] sm:text-[52px] font-bold tabular-nums leading-[0.9] tracking-[-0.035em] text-carbon">
            {LIMIT.toFixed(1)}
            <span className="text-[15px] font-semibold ml-1">mm</span>
          </span>
        </span>
      </div>

      {/* the scale — where the reading falls is the whole argument */}
      <div className="mt-9">
        {/* padded so the hit target is comfortable without moving the rail */}
        <div className="relative py-3 -my-3">
          <div
            className="relative h-[3px] rounded-full overflow-hidden"
            style={{ background: "#EFEFF2" }}
          >
            <motion.span
              className="absolute inset-y-0 left-0 origin-left"
              style={{
                width: `${pct(LIMIT)}%`,
                background: RAG.green.app,
                opacity: 0.3,
              }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            />
            <motion.span
              className="absolute inset-y-0 origin-left"
              style={{
                left: `${pct(LIMIT)}%`,
                right: 0,
                background: RAG.red.app,
                opacity: 0.3,
              }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
            />
          </div>

          <motion.span
            aria-hidden
            className="absolute top-1/2 -translate-y-1/2 w-px h-[22px]"
            style={{ left: `${pct(LIMIT)}%`, background: "#0E0E0F" }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.55, ease: EASE }}
          />

          {/* the handle travels in on entry, then tracks the pointer with no
              easing so dragging feels direct rather than elastic */}
          <motion.span
            aria-hidden
            className="absolute top-1/2 w-[17px] h-[17px] rounded-full pointer-events-none"
            style={{
              marginTop: -8.5,
              marginLeft: -8.5,
              background: rag.app,
              border: "2.5px solid #FFFFFF",
              boxShadow: dragging
                ? `0 0 0 6px ${rag.appBg}, 0 2px 10px -2px rgba(0,0,0,0.35)`
                : "0 2px 10px -2px rgba(0,0,0,0.35)",
            }}
            initial={{ left: "0%" }}
            animate={{ left: `${pct(value)}%` }}
            transition={{
              duration: dragging || reduce ? 0 : 0.9,
              delay: dragging || reduce ? 0 : 0.65,
              ease: EASE,
            }}
          />

          <input
            type="range"
            min={0}
            max={SCALE_MAX}
            step={0.1}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            onPointerDown={() => setDragging(true)}
            onPointerUp={() => setDragging(false)}
            onPointerCancel={() => setDragging(false)}
            onBlur={() => setDragging(false)}
            aria-label="Measured plumbness, in millimetres"
            className="riq-sev-range absolute inset-0 w-full h-full opacity-0 cursor-grab active:cursor-grabbing"
          />
        </div>

        {/* axis */}
        <div className="relative mt-5 h-8">
          <span className="absolute left-0 text-[10px] font-mono text-graphite/35">
            0
          </span>
          <span
            className="absolute -translate-x-1/2 flex flex-col items-center gap-1"
            style={{ left: `${pct(LIMIT)}%` }}
          >
            <span className="text-[10px] font-mono tracking-[0.08em] uppercase text-graphite/40">
              Limit
            </span>
          </span>
          <span className="absolute right-0 text-[10px] font-mono text-graphite/35">
            {SCALE_MAX} mm
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between gap-3 flex-wrap">
          <span className="text-[10px] font-mono text-graphite/35">
            Drag the reading to test it against the limit
          </span>
          <span
            className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-[0.1em] uppercase whitespace-nowrap transition-colors duration-200"
            style={{ background: rag.appBg, color: rag.app }}
          >
            {over ? "Outside limit" : "Within limit"}
          </span>
        </div>
      </div>

      {/* result */}
      <div
        className="mt-8 pt-6 flex items-center justify-between gap-4 flex-wrap"
        style={{ borderTop: `1px solid ${LINE}` }}
      >
        <span className="text-[10px] font-mono font-bold tracking-[0.14em] uppercase text-graphite/45">
          Result → classification
        </span>
        <span className="flex items-center gap-2.5">
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-bold transition-colors duration-200"
            style={{ background: rag.app, color: "#fff" }}
          >
            {over ? "R" : "G"}
          </span>
          <span className="text-[14px] font-semibold text-carbon">
            {over ? "Red · action required" : "Green · no action required"}
          </span>
        </span>
      </div>
    </div>
  );
}

export function RiqSeverity() {
  return (
    <Section surface="warm" id="q2">
      {/* the range thumb is sized here so the invisible control has a real
          grab target; the visible handle is the motion span above it */}
      <style>{`
        .riq-sev-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 26px;
          height: 26px;
        }
        .riq-sev-range::-moz-range-thumb {
          width: 26px;
          height: 26px;
          border: 0;
        }
      `}</style>

      <Split>
        {/* ── the argument ─────────────────────────────── */}
        <div>
          <ChapterHead
            eyebrow="Severity"
            top="Measured condition. Defined limit."
            bottom="Structured decision."
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="mt-10"
          >
            <p className="text-[11px] font-mono font-bold tracking-[0.16em] uppercase text-graphite/45 mb-5">
              Configured criteria
            </p>
            <p className="text-[16px] sm:text-[18px] text-graphite/70 leading-[1.6]">
              IRDS stores engineering measurements against the exact rack asset
              and compares defined parameters — plumbness, integrity, geometry,
              deformation — against{" "}
              <span className="font-semibold text-carbon">configured</span>{" "}
              acceptance criteria.
            </p>

            <div className="mt-8">
              <Flow steps={["Measure", "Compare", "Classify"]} size="sm" />
            </div>

            <NoteLine className="mt-8">
              IRDS supports competent inspection and engineering — it does not
              replace competent engineering judgement.
            </NoteLine>
          </motion.div>
        </div>

        {/* ── the engineering check ─────────────────────────
            Not <Media> — that fills #F5F5F7, a cool grey, and this
            section is the warm surface. The card treatment below is
            the one the solution pages use on warm ground (see
            IrdsProofResults.tsx:138): white, 12px, #E8E8ED. The
            caption bar is Media's, kept verbatim.                */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="overflow-hidden bg-white"
          style={{
            borderRadius: 12,
            border: `1px solid ${LINE}`,
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
          }}
        >
          <Instrument />

          <div
            className="flex items-center justify-between gap-4 px-5 py-3.5"
            style={{ borderTop: `1px solid ${LINE}` }}
          >
            <span className="text-[10px] font-mono tracking-[0.1em] uppercase text-graphite/45">
              Engineering check
            </span>
            <span className="text-[10px] font-mono tracking-[0.1em] uppercase text-graphite/35">
              Measure → compare → classify
            </span>
          </div>
        </motion.div>
      </Split>
    </Section>
  );
}
