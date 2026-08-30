"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Live Command Centre.
 *
 * ── MEDIA ────────────────────────────────────────────────────────────
 * TWIN_SRC is a placeholder. There is no MHE or MEPS footage in /public —
 * this is the clip the IRDS hero uses, which is Atlassian's "CSD-24696
 * Agents In Jira". Swap in a Command Centre recording and change this one
 * constant.
 *
 * The Fleet / Travel / Motion controls the document specifies were built and
 * working against a drawn twin; they are removed here because a recording
 * cannot respond to them, and controls that do nothing are worse than none.
 * They come back with the twin if the drawn version is preferred.
 * ─────────────────────────────────────────────────────────────────────
 */

const HAIR = "rgba(255,255,255,0.10)";
const TWIN_SRC = "/Product/irds/hero.mp4";

const CALLOUTS = [
  [
    "01",
    "Every connected machine, its route, direction and current activity, against the real building.",
  ],
  [
    "02",
    "Select any machine to open its live session — operator, zone, speed and load state.",
  ],
  [
    "03",
    "Filter the floor by loaded or empty travel and the picture changes completely.",
  ],
];

export function MepsCommandCentre() {
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
    <Section surface="darkMid" id="command-centre">
      <SectionHeader
        eyebrow="Live Command Centre"
        top="See the moving"
        bottom="warehouse live."
        body="Connected MHEs are positioned inside the warehouse Digital Twin, creating a live view of fleet movement and the physical environment that movement happens in."
        tone="dark"
        size="compact"
        width="wide"
      />

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
        {/* bar */}
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
            Live Command Centre — Digital Twin
          </span>
          <span
            className="ml-auto px-2.5 py-1 rounded-full text-[9.5px] font-mono font-bold tracking-[0.12em] uppercase text-white/55"
            style={{ border: `1px dashed ${HAIR}` }}
          >
            Product screen
          </span>
        </div>

        {/* twin */}
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

        {/* callouts */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3"
          style={{ borderTop: `1px solid ${HAIR}` }}
        >
          {CALLOUTS.map(([n, text], i) => (
            <div
              key={n}
              className="px-5 py-5"
              style={{
                borderRight:
                  i < CALLOUTS.length - 1 ? `1px solid ${HAIR}` : "none",
              }}
            >
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] tabular-nums text-signal-orange">
                {n}
              </span>
              <p className="mt-2.5 text-[13px] text-white/55 leading-[1.6]">
                {text}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-14 sm:mt-16 text-center font-rams-heading text-[22px] sm:text-[28px] lg:text-[32px] font-bold tracking-[-0.025em] leading-[1.2] text-white"
      >
        See the warehouse through the{" "}
        <span className="text-signal-orange">movement</span> of its fleet.
      </motion.p>
    </Section>
  );
}
