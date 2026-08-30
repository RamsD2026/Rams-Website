"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "./rackiq-shared";

/**
 * What is IRDS.
 *
 * Header, rhythm and surface come from the site system — <Section> for the
 * padding and container, <SectionHeader> for eyebrow → two-line heading →
 * subline. See docs/section-header.md; the classes are not re-typed here.
 *
 * The body borrows the homepage EcosystemSection composition: a 2fr/3fr split
 * of copy against a dark media card, at that section's measures — 20px orange
 * eyebrow, 44px headline, 13px list.
 *
 * The one deliberate departure is the list marker. The homepage fills its
 * circle with orange and a white check because its list is what you get. These
 * six are what IRDS replaces, so the circle is an empty outline with a grey
 * dash — same rhythm and footprint, opposite meaning.
 *
 * NOTE ON MEDIA: /Product/irds/hero.mp4 is placeholder footage. Swap it for a
 * real IRDS screen recording when one exists — it is the only media reference
 * in this file.
 */

const SCATTERED = [
  "Inspection reports",
  "Photographs",
  "Spreadsheets",
  "Emails",
  "Quotations",
  "Individual knowledge",
];

export function RiqWhatIs() {
  const [videoPaused, setVideoPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleVideo = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setVideoPaused(false);
    } else {
      v.pause();
      setVideoPaused(true);
    }
  }, []);

  return (
    <Section surface="white" id="what">
      <SectionHeader
        eyebrow="What is IRDS"
        top="One rack. One digital record."
        bottom="Its complete condition history."
        body="IRDS gives every rack a structured digital identity — connecting its inspections, defects, photographs, measurements, integrity tests, classifications, corrective actions, repairs and verification records to the physical asset."
        size="compact"
        width="wide"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-10 lg:gap-16 items-stretch"
      >
        {/* ── copy column ──────────────────────────────────
            Eyebrow → headline → label → list. Spacing opens up
            as the type gets smaller, so the headline reads as a
            statement rather than as a caption over the list.    */}
        <div className="flex flex-col justify-center">
          <p className="text-[20px] font-bold tracking-[0.04em] uppercase text-signal-orange mb-6">
            IRDS makes it
          </p>

          <h3
            className="text-[28px] sm:text-[36px] lg:text-[44px] font-bold text-carbon leading-[1.08] mb-10 sm:mb-12"
            style={{ letterSpacing: "-0.02em" }}
          >
            One connected source of rack-condition intelligence.
          </h3>

          <p className="text-[10.5px] font-mono font-semibold tracking-[0.2em] uppercase text-graphite/40 mb-6">
            Traditionally scattered across
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {SCATTERED.map((item) => (
              <span
                key={item}
                className="flex items-center gap-3 text-[13px] font-medium text-graphite-alt"
              >
                <span
                  aria-hidden
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ border: "1px solid #E8E8ED" }}
                >
                  <span className="w-2 h-px bg-steel" />
                </span>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ── the platform ─────────────────────────────── */}
        <div
          className="relative overflow-hidden bg-carbon"
          style={{ borderRadius: 16, minHeight: 460 }}
        >
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle, #3A3A3E 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              bottom: -40,
              right: -40,
              width: 280,
              height: 280,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,106,0,0.18) 0%, transparent 70%)",
              filter: "blur(32px)",
            }}
          />
          <video
            ref={videoRef}
            src="/Product/irds/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={toggleVideo}
            aria-label={videoPaused ? "Play video" : "Pause video"}
            className="absolute bottom-3 right-3 flex items-center justify-center w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/20 text-white transition-all duration-200 z-10"
          >
            {videoPaused ? (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            ) : (
              <Pause className="w-3.5 h-3.5 fill-current" />
            )}
          </button>
        </div>
      </motion.div>
    </Section>
  );
}
