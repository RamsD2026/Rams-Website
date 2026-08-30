"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * History & pattern intelligence.
 *
 * Opens on the document's chain — One MHE → … → One decision — as a marquee,
 * because the chain has no last item: it is the same loop every shift. Then
 * the twin over a period, and the line that closes it.
 *
 * ── MEDIA ────────────────────────────────────────────────────────────
 * TWIN_SRC is a placeholder. There is no MEPS footage in /public — this is
 * the clip the IRDS hero uses, which is Atlassian's "CSD-24696 Agents In
 * Jira". Swap in a historical-pattern recording and change this one constant.
 *
 * The document specifies Layer / Period / Shift filters on this screen. They
 * are not built here: a recording cannot answer them, and controls that do
 * nothing read worse than none. They belong to the real product screen.
 * ─────────────────────────────────────────────────────────────────────
 */

const HAIR = "rgba(255,255,255,0.10)";
const TWIN_SRC = "/Product/irds/hero.mp4";

const CHAIN = [
  "One MHE",
  "One movement",
  "One pallet",
  "One operator",
  "One shift",
  "One fleet",
  "One warehouse",
  "One pattern",
  "One decision",
];

export function MepsHistory() {
  const reduce = useReducedMotion();
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
    <Section surface="darkMid" id="history">
      {/* ── the chain, which has no last item ───────────── */}
      <div
        className="relative overflow-hidden py-7 mb-16 sm:mb-20"
        style={{
          borderTop: `1px solid ${HAIR}`,
          borderBottom: `1px solid ${HAIR}`,
        }}
      >
        <style>{`
          @keyframes meps-chain {
            from { transform: translateX(-50%); }
            to   { transform: translateX(0); }
          }
          .meps-chain-track {
            display: flex;
            width: max-content;
            animation: meps-chain 42s linear infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .meps-chain-track { animation: none; }
          }
        `}</style>

        <div
          className={
            reduce ? "flex flex-wrap justify-center" : "meps-chain-track"
          }
        >
          {(reduce ? [0] : [0, 1]).map((copy) => (
            <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
              {CHAIN.map((l) => (
                <span key={copy + l} className="flex items-center shrink-0">
                  <span className="font-rams-heading text-[16px] sm:text-[20px] font-bold tracking-[-0.02em] text-white/85 whitespace-nowrap">
                    {l}
                  </span>
                  <span
                    className="text-signal-orange text-[14px] mx-4 sm:mx-6"
                    aria-hidden
                  >
                    →
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>

        {!reduce && (
          <>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28"
              style={{
                background: "linear-gradient(to right, #0E0E0F, transparent)",
              }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28"
              style={{
                background: "linear-gradient(to left, #0E0E0F, transparent)",
              }}
            />
          </>
        )}
      </div>

      <SectionHeader
        eyebrow="History & pattern intelligence"
        top="One shift shows activity."
        bottom="History reveals the pattern."
        body="A single movement is an event. The same movement, at the same hour, in the same aisle, for six weeks, is an operating pattern — and patterns are what can actually be changed."
        tone="dark"
        size="compact"
        width="wide"
      />

      {/* ── the twin, over a period ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.85, ease: EASE }}
        className="overflow-hidden"
        style={{
          borderRadius: 16,
          background: "#0E0E11",
          border: `1px solid ${HAIR}`,
          boxShadow: "0 60px 120px -50px rgba(0,0,0,0.9)",
        }}
      >
        <div
          className="flex items-center gap-2.5 px-4 h-11 flex-wrap"
          style={{ borderBottom: `1px solid ${HAIR}`, background: "#111114" }}
        >
          <span className="relative flex w-2 h-2 shrink-0">
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ background: "#54DE91" }}
              animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            <span
              className="relative w-2 h-2 rounded-full"
              style={{ background: "#54DE91" }}
            />
          </span>
          <span className="text-[11.5px] font-semibold text-white/85">
            Digital Twin — historical movement patterns
          </span>
          <span
            className="ml-auto px-2.5 py-1 rounded-full text-[9.5px] font-mono font-bold tracking-[0.12em] uppercase text-white/55"
            style={{ border: `1px solid ${HAIR}` }}
          >
            Live Digital Twin
          </span>
        </div>

        <div className="relative p-3 sm:p-5" style={{ background: "#0A0C0E" }}>
          <video
            ref={videoRef}
            src={TWIN_SRC}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="block w-full h-auto"
            style={{ borderRadius: 10 }}
          />
        </div>

        <p
          className="px-5 py-4 text-[13px] text-white/55 leading-[1.6]"
          style={{ borderTop: `1px solid ${HAIR}` }}
        >
          Movement density — where the fleet spends most of its travelling time
          across the selected period.
        </p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-20 sm:mt-24 text-center font-rams-heading text-[22px] sm:text-[28px] lg:text-[32px] font-bold tracking-[-0.025em] leading-[1.2] text-white"
      >
        The next shift should start with what you learned from the{" "}
        <span className="text-signal-orange">last</span> one.
      </motion.p>
    </Section>
  );
}
