"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE } from "@/components/sections/rackiq/rackiq-shared";

/**
 * The turn.
 *
 * Two sentences and nothing else. The page has just spent a section on what
 * the twin is worth before any hardware exists; this is the hinge into what
 * it is worth afterwards, and a hinge should be a breath, not a panel.
 *
 * ── MEDIA ────────────────────────────────────────────────────────────
 * Placeholder footage, desaturated and held well back, behind the sentence
 * about the model outliving the drawing. Grey rather than colour so nothing
 * competes with the type. Swap for a real floor capture when one exists.
 * ─────────────────────────────────────────────────────────────────────
 */

const FOOTAGE = "/Jira PT VP 2 Demo Placeholder-948px-60fps-crf23.mp4";

export function TwinTransition() {
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
    <section
      id="transition"
      className="relative overflow-hidden text-white"
      style={{ background: "#08080A" }}
    >
      <video
        ref={ref}
        src={FOOTAGE}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "grayscale(1) contrast(1.05)", opacity: 0.3 }}
      />

      {/* the type has to hold, so the floor stays behind it */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #08080A 0%, rgba(8,8,10,0.72) 38%, rgba(8,8,10,0.72) 62%, #08080A 100%)",
        }}
      />

      <div className="relative rams-container flex items-center min-h-[410px] sm:min-h-[510px] lg:min-h-[610px] pt-28 sm:pt-36 lg:pt-44 pb-28 sm:pb-36 lg:pb-44">
        <div className="w-full max-w-[960px] mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.85, ease: EASE }}
            className="font-rams-heading text-[32px] sm:text-[48px] lg:text-[62px] font-bold tracking-[-0.042em] leading-[1.05]"
          >
            <span className="block text-white">
              A Digital Twin should not die
            </span>
            <span
              className="block"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.32) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              After the design decision.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="mt-9 text-[18px] sm:text-[22px] leading-[1.5] text-white/85"
          >
            That is where its real value{" "}
            <span className="text-signal-orange">begins</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.24, ease: EASE }}
            className="mt-10 flex items-center justify-center gap-3 flex-wrap"
          >
            <Link
              href="/book-a-demo"
              className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3 rounded-lg transition-colors duration-200 hover:bg-signal-orange-hover"
            >
              Request a demo
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="#attach"
              className="inline-flex items-center gap-2 text-white text-[14px] font-semibold px-6 py-3 rounded-lg border border-white/15 transition-colors duration-200 hover:bg-white/[0.06]"
            >
              See what attaches to it
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
