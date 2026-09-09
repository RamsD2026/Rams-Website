"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/components/sections/rackiq/rackiq-shared";

/**
 * /company/careers — the holding page.
 *
 * A dark ground with an aurora drifting across it, and the words set over it.
 *
 * ── The aurora is three drifting fields, not one ────────────────────
 * A single moving gradient reads as a gradient moving. Three do not: each is
 * a large blurred radial in its own hue, on its own path, at its own period —
 * 26, 32 and 38 seconds — so the three never return to the same arrangement
 * and the eye cannot find the loop. That is the whole trick; the shapes
 * themselves are three circles.
 *
 * The periods are deliberately coprime-ish rather than multiples of each
 * other. 20 / 30 / 40 would realign every minute and the page would visibly
 * repeat.
 *
 * ── The hues ────────────────────────────────────────────────────────
 * Orange leads, because this is the only page on the site where a colour
 * occupies most of the screen and it has to be the brand's. The other two are
 * the palette's own red and violet — `TwinOverview`'s #E5484D and #6647F0 —
 * at roughly two thirds and half the orange's alpha, which is what turns one
 * glow into an aurora rather than three lamps.
 *
 * All three are heavily blurred and none exceeds 0.30 alpha: the ground has
 * to stay dark enough for white type to sit on it without a scrim.
 *
 * ── It replaced an eclipse ──────────────────────────────────────────
 * A near-black sphere with a burning rim. It was the reference's shape, but
 * it put a hard edge in the middle of a page whose only content is a line of
 * type, and the words had to cross it. Nothing crosses an aurora.
 *
 * ── Two lines, and nothing else ─────────────────────────────────────
 * An eyebrow and the words. It carried a sentence and a button to /contact
 * before this; a page that says "coming soon" and then asks for something is
 * not a holding page, it is a form with a headline. When there are roles,
 * there is a page. Until then there is a date the site is not giving.
 *
 * ── The words ───────────────────────────────────────────────────────
 * Each letter is its own element so they can arrive one at a time on a
 * blur-in, and the tracking is 0.42em — the reference's spacing, which is
 * what makes eleven letters read as a horizon line rather than as a word.
 *
 * The space between the two words carries an explicit 0.9em width. Letter
 * spacing does not apply to a collapsed space in a flex row, so without it
 * "COMING" and "SOON" run together at exactly the spacing the rest of the
 * line does not have.
 *
 * Everything stops under `prefers-reduced-motion`: the letters arrive at
 * once, the aurora holds still, and nothing about the page depends on any of
 * it moving.
 */

const WORD = "COMING SOON";

export function CareersComingSoon() {
  const reduce = useReducedMotion();

  return (
    <section
      className="relative flex flex-col items-center justify-center overflow-hidden text-white"
      style={{ minHeight: "100svh", background: "#050506" }}
      id="top"
    >
      <style>{`
        .crs-aurora {
          position: absolute;
          border-radius: 999px;
          filter: blur(90px);
          will-change: transform;
        }
        .crs-a1 {
          width: 78vw; height: 78vw;
          left: -14vw; top: -26vw;
          background: radial-gradient(circle, rgba(255,106,0,0.30) 0%, rgba(255,106,0,0.10) 42%, transparent 66%);
          animation: crs-d1 26s ease-in-out infinite;
        }
        .crs-a2 {
          width: 66vw; height: 66vw;
          right: -12vw; top: 6vh;
          background: radial-gradient(circle, rgba(229,72,77,0.20) 0%, rgba(229,72,77,0.07) 42%, transparent 66%);
          animation: crs-d2 32s ease-in-out infinite;
        }
        .crs-a3 {
          width: 88vw; height: 58vw;
          left: 8vw; bottom: -28vh;
          background: radial-gradient(circle, rgba(102,71,240,0.16) 0%, rgba(102,71,240,0.06) 42%, transparent 66%);
          animation: crs-d3 38s ease-in-out infinite;
        }
        @keyframes crs-d1 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50%      { transform: translate3d(9vw, 7vh, 0) scale(1.14); }
        }
        @keyframes crs-d2 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1.06); }
          50%      { transform: translate3d(-11vw, 10vh, 0) scale(0.94); }
        }
        @keyframes crs-d3 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50%      { transform: translate3d(6vw, -9vh, 0) scale(1.12); }
        }
        @media (prefers-reduced-motion: reduce) {
          .crs-a1, .crs-a2, .crs-a3 { animation: none; }
        }
      `}</style>

      {/* ── the aurora ──────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <span className="crs-aurora crs-a1" />
        <span className="crs-aurora crs-a2" />
        <span className="crs-aurora crs-a3" />

        {/* A vignette, so the fields fall away at the edges and the type in
            the middle always has ground under it. */}
        <span
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(72% 62% at 50% 50%, transparent 0%, rgba(5,5,6,0.55) 78%, rgba(5,5,6,0.85) 100%)",
          }}
        />
      </div>

      {/* ── the words ───────────────────────────────── */}
      <div className="relative rams-container text-center">
        <motion.p
          initial={reduce ? undefined : { opacity: 0, y: 8 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-[11px] font-mono font-semibold tracking-[0.28em] uppercase text-signal-orange"
        >
          Careers at RAMS Digital
        </motion.p>

        <h1
          className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center text-[22px] sm:text-[34px] lg:text-[44px] font-light leading-none text-white"
          style={{ letterSpacing: "0.42em" }}
          aria-label={WORD}
        >
          {WORD.split("").map((c, i) => (
            <motion.span
              key={`${c}-${i}`}
              aria-hidden
              initial={reduce ? undefined : { opacity: 0, filter: "blur(8px)" }}
              animate={reduce ? undefined : { opacity: 1, filter: "blur(0px)" }}
              transition={{
                duration: 0.8,
                delay: 0.35 + i * 0.07,
                ease: EASE,
              }}
              /* A space cannot carry tracking on its own — it collapses at
                 the wrap. Given a width, the gap between the two words stays
                 proportional to the letter spacing. */
              style={c === " " ? { width: "0.9em" } : undefined}
            >
              {c === " " ? " " : c}
            </motion.span>
          ))}
        </h1>
      </div>
    </section>
  );
}
