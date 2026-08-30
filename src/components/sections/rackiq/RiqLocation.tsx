"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "./rackiq-shared";

/**
 * Question 03 — why & where.
 *
 * The Digital Twin, shown directly — no rebuilt bay grid, no risk filter, no
 * record panel and no browser mockup around it. The clip is fitted whole over
 * grainient-warm.png, which fills whatever the frame does not.
 *
 * ── WHY THIS LOADS LAZILY ────────────────────────────────────────────
 * This page ships ~93 MB of autoplaying video: two copies of the 16 MB hero
 * plus this 59 MB clip. A browser opens about six connections per host, so
 * they all buffer against each other on load, and this one — the largest and
 * the furthest down the page — is the one that stalls.
 *
 * So the src is not attached until the section is near the viewport. Nothing
 * is requested before then, and the box is sized from the known 1920×910 so
 * nothing shifts when it arrives.
 *
 * The real fix is still to re-encode: 122 s at 4.1 Mbps VP9. The same clip at
 * ~1.2 Mbps would be under 20 MB with no visible loss at this size. There is
 * no ffmpeg on this machine, so it could not be done here.
 * ─────────────────────────────────────────────────────────────────────
 */

const TWIN_SRC = "/rack-3d-view.webm";
const STAGE_BG = "/grainient-warm.png";

/** Native dimensions — reserves layout space and rules out any crop. */
const RATIO = "1920 / 910";

export function RiqLocation() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(false);

  /* Attach the source only once the section is close to view. */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    // No observer (very old browsers): arm on the next tick rather than
    // synchronously, which would cascade a render from inside the effect.
    if (typeof IntersectionObserver === "undefined") {
      const t = setTimeout(() => setArmed(true), 0);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /**
   * React sets `muted` as a DOM property rather than a reliable attribute, so
   * a browser can decide the element is unmuted and refuse to autoplay it. Set
   * it imperatively and ask for playback once there is data; a rejected
   * promise only means the browser declined.
   */
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !armed) return;
    v.muted = true;
    const start = () => v.play().catch(() => {});
    start();
    v.addEventListener("loadeddata", start);
    return () => v.removeEventListener("loadeddata", start);
  }, [armed]);

  return (
    <Section surface="white" id="q3">
      <SectionHeader
        eyebrow="Why & where"
        top="Every finding has a location."
        bottom="Every location has a history."
        body="Filter the Digital Twin by risk. Select any bay to open its complete condition record."
        size="compact"
        width="wide"
      />

      <motion.div
        ref={wrapRef}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="p-1.5 sm:p-2"
        style={{
          borderRadius: 16,
          // 70% white over the image — the section behind is white, so this
          // reads as the grainient at 30% without a separate layer that the
          // video would then have to sit above.
          backgroundImage: `linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url(${STAGE_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <video
          ref={videoRef}
          src={armed ? TWIN_SRC : undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="block w-full"
          style={{ borderRadius: 9, aspectRatio: RATIO, objectFit: "contain" }}
        />
      </motion.div>
    </Section>
  );
}
