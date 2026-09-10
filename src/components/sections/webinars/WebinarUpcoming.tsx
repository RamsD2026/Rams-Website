"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/sections/rackiq/rackiq-shared";
import { FEATURED, type Featured } from "./webinar-data";

/**
 * 02 — The featured sessions.
 *
 * Three cards on a shelf, one on screen at a time with the next peeking, the
 * track advancing on its own, and the dot pill under it — the home page's
 * `IndustriesCarousel` mechanism at `visible = 1`.
 *
 *   cardWidth = viewport / (1 + PEEK)
 *
 * ── The card is the reference's ─────────────────────────────────────
 * A photograph filling the frame, a gradient rising off the bottom, and every
 * word in the lower half of it: a small pill, a two-line heading, a line of
 * copy, a button. Nothing sits in the upper half, which is what keeps a
 * cinematic card from becoming a poster with text scattered over it.
 *
 * The ratio widens with the viewport — 4:3 on a phone, 16:9 at `sm`, 21:9 at
 * `lg` — so the picture stays a picture rather than a letterbox on small
 * screens and a wall on large ones.
 *
 * ── Three revisions to get here ─────────────────────────────────────
 * Two pale boxes side by side, then a full dark band, then a white section
 * with a photograph beside the copy. The first was flat, the second put a
 * slab of near-black in the middle of a light page, and the third gave one
 * card the whole 1232 and still read as a panel rather than as a feature.
 *
 * This is the shelf: three cards, one at a time, at the width the reference
 * uses. The section keeps the white ground — the contrast lives inside the
 * photograph, where it belongs.
 *
 * ── One of the three is live, and the pills say which ───────────────
 * The source has one dated session and no second. Inventing two more live
 * dates would be a webinar page advertising sessions nobody has scheduled, so
 * the other two cards are recordings and each card's pill says what it is —
 * a date and a time, or a running length. `FEATURED` in `webinar-data` is
 * where that set is chosen; give it two more live sessions and they take
 * those slots unchanged.
 *
 * ── It advances on its own, and stops when you touch it ─────────────
 * A 6s interval steps the track and wraps at the end. It pauses while the
 * pointer is over the viewport, and a press on any dot stops it for good —
 * `manual` latches — because a carousel that keeps moving after somebody has
 * chosen a slide takes the page back off them.
 *
 * `prefers-reduced-motion` disables the timer entirely rather than shortening
 * it, and the spring collapses to a zero-duration jump.
 *
 * ── The pulse says live ─────────────────────────────────────────────
 * One dot with a ring expanding out of it, and the keyframes are namespaced
 * `wbnr-` because `@keyframes` is global and this site has been caught by
 * that before. Only the live card carries it, and it is `aria-hidden` — the
 * pill beside it already says the word.
 */

const GAP = 20;
const PEEK = 0.12;
const AUTOPLAY_MS = 6000;

function Card({ item }: { item: Featured }) {
  const live = item.kind === "live";

  return (
    <a
      href={item.href}
      className="group relative block w-full overflow-hidden aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]"
      style={{ borderRadius: 20, background: "#08080A" }}
    >
      <Image
        src={item.img}
        alt={item.alt}
        fill
        sizes="(max-width: 1024px) 92vw, 1100px"
        className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        priority
      />

      {/* everything is read in the lower half, so that is where the ink is */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(8,8,10,0.92) 0%, rgba(8,8,10,0.72) 22%, rgba(8,8,10,0.34) 44%, rgba(8,8,10,0.06) 66%, transparent 82%)",
        }}
      />

      <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9 lg:p-11 text-white">
        <span
          className="inline-flex items-center gap-2 px-3 py-1.5 text-[10.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/90"
          style={{
            borderRadius: 999,
            background: "rgba(255,255,255,0.13)",
            backdropFilter: "blur(6px)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.20)",
          }}
        >
          {live && (
            <span
              aria-hidden
              className="wbnr-dot"
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: "#FF6A00",
              }}
            />
          )}
          {item.pill}
        </span>

        <h3 className="mt-4 text-[26px] sm:text-[34px] lg:text-[40px] font-bold tracking-[-0.04em] leading-[1.08] max-w-[680px]">
          {item.title}
        </h3>

        <p className="mt-3 text-[13.5px] sm:text-[15px] text-white/60 leading-[1.55] max-w-[560px]">
          {item.body}
        </p>

        <span className="mt-6 inline-flex items-center gap-2 bg-white text-carbon text-[13.5px] font-semibold px-5 py-3 rounded-full transition-all duration-200 group-hover:bg-signal-orange group-hover:text-white">
          {item.cta}
          <ArrowUpRight className="w-4 h-4" aria-hidden />
        </span>
      </div>
    </a>
  );
}

export function WebinarUpcoming() {
  const [index, setIndex] = useState(0);
  const [manual, setManual] = useState(false);
  const [hover, setHover] = useState(false);
  const [width, setWidth] = useState(0);
  const viewport = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cardWidth = width > 0 ? width / (1 + PEEK) : 900;
  const step = cardWidth + GAP;
  const maxIndex = Math.max(0, FEATURED.length - 1);

  useEffect(() => {
    if (reduce || manual || hover || maxIndex === 0) return;
    const t = setInterval(
      () => setIndex((i) => (i >= maxIndex ? 0 : i + 1)),
      AUTOPLAY_MS,
    );
    return () => clearInterval(t);
  }, [reduce, manual, hover, maxIndex]);

  return (
    <Section surface="white" id="upcoming" padding="tight">
      <style>{`
        .wbnr-dot { position: relative; display: inline-flex; }
        .wbnr-dot::after {
          content: ""; position: absolute; inset: 0; border-radius: 999px;
          border: 1.5px solid rgba(255,106,0,0.75);
          animation: wbnr-pulse 2.6s ease-out infinite;
        }
        @keyframes wbnr-pulse {
          0%   { transform: scale(1);   opacity: 0.75; }
          100% { transform: scale(3.4); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .wbnr-dot::after { animation: none; opacity: 0; }
        }
      `}</style>

      {/* the header, off the centre line like the other index pages' */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-6 lg:gap-12 items-end mb-10 sm:mb-12">
        <div className="max-w-[760px]">
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-signal-orange">
            Live &amp; featured
          </p>

          <h2 className="mt-4 text-[36px] sm:text-[54px] lg:text-[68px] font-bold tracking-[-0.04em] leading-[1.04]">
            <span className="block text-carbon">Join the next</span>
            <span className="block text-graphite/45">session live.</span>
          </h2>
        </div>

        <p className="text-[12.5px] leading-[1.6] text-graphite/45 max-w-[260px] lg:text-right">
          Free to attend. Registration confirms your place and sends the joining
          link.
        </p>
      </div>

      <div
        ref={viewport}
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <motion.div
          className="flex"
          style={{ gap: GAP, willChange: "transform" }}
          animate={{ x: -index * step }}
          transition={
            reduce
              ? { duration: 0 }
              : { type: "spring", stiffness: 220, damping: 30, mass: 0.9 }
          }
        >
          {FEATURED.map((f) => (
            <div key={f.id} style={{ width: cardWidth, flexShrink: 0 }}>
              <Card item={f} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* the dot pill — the home page's, value for value */}
      <div className="mt-10 flex items-center justify-center">
        <div
          className="flex items-center"
          style={{
            background: "#F0F0F2",
            borderRadius: 999,
            padding: "0 18px",
            height: 44,
            gap: 14,
          }}
        >
          {FEATURED.map((f, i) => {
            const active = i === index;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setManual(true);
                  setIndex(i);
                }}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={active ? "true" : undefined}
                style={{
                  width: active ? 24 : 6,
                  height: 6,
                  borderRadius: 999,
                  background: active ? "var(--color-carbon-alt)" : "#86868B",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  transition:
                    "width 320ms cubic-bezier(0.22,1,0.36,1), background 200ms ease",
                }}
              />
            );
          })}
        </div>
      </div>
    </Section>
  );
}
