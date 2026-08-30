"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Basic safety intelligence.
 *
 * Deliberately bounded: the document is careful that this is speed-related
 * visibility, not connected safety, and that RTSS is where the latter lives.
 * That boundary is stated in the section subline.
 *
 * ── MEDIA ────────────────────────────────────────────────────────────
 * SCREEN_SRC is a placeholder. There is no MEPS footage in /public — this is
 * the clip the IRDS hero uses, which is Atlassian's "CSD-24696 Agents In
 * Jira". The document marks this frame "Awaiting product screen", so the tag
 * stays dashed until a real Safety Analytics capture lands.
 * ─────────────────────────────────────────────────────────────────────
 */

const HAIR = "rgba(255,255,255,0.10)";
const SCREEN_SRC = "/Product/irds/hero.mp4";

const CALLOUTS: [string, string][] = [
  [
    "01",
    "Speed compliance and overspeed events, resolved to the zone and the session they happened in.",
  ],
  [
    "02",
    "Speed against productivity in one view — where more speed stops producing more pallets.",
  ],
  [
    "03",
    "Driving sessions and behaviour trends give coaching a starting point rather than an opinion.",
  ],
];

export function MepsSafety() {
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
    <Section surface="darkMid" id="safety">
      <SectionHeader
        eyebrow="Basic safety intelligence"
        top="Performance, without"
        bottom="ignoring speed behaviour."
        body="MEPS provides basic safety visibility from movement and speed-related data — compliance, overspeed events, speed by zone, by machine and by session. Deeper connected safety intelligence belongs to RTSS."
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
        <div
          className="flex items-center gap-2.5 px-4 h-11 flex-wrap"
          style={{ borderBottom: `1px solid ${HAIR}`, background: "#111114" }}
        >
          <span className="text-[11.5px] font-semibold text-white/85">
            MEPS — Safety Analytics
          </span>
          <span
            className="ml-auto px-2.5 py-1 rounded-full text-[9.5px] font-mono font-bold tracking-[0.12em] uppercase text-white/55"
            style={{ border: `1px dashed ${HAIR}` }}
          >
            Awaiting product screen
          </span>
        </div>

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
    </Section>
  );
}
