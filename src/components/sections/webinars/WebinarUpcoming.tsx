"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Clock, UserRound } from "lucide-react";
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
 * The frame keeps its size and the copy is fitted to it. A 4:3 frame on a
 * phone is about 230px tall; a three-line 26px heading over a three- or
 * four-line body needed far more, so the copy rose past the top edge and the
 * heading was cropped. On a phone the heading is 20px, the body is clamped
 * to two lines, and the padding, gaps and button are a step tighter — about
 * 200px of copy, leaving clear room above it. At `sm` the heading is 30px
 * and the body runs in full. From `lg` nothing changes.
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

/** "RAMS session" or "Guest session" — a quiet tint, the careers board's
    badge, so it labels the card without competing with the title. */
function HostTag({ host, onDark = false }: { host: Featured["host"]; onDark?: boolean }) {
  const guest = host === "guest";
  const style = onDark
    ? {
        color: guest ? "#FFB27A" : "rgba(255,255,255,0.8)",
        background: "rgba(255,255,255,0.10)",
        backdropFilter: "blur(6px)",
      }
    : guest
      ? { color: "#E05E00", background: "rgba(255,106,0,0.08)" }
      : { color: "rgba(60,60,67,0.7)", background: "#F2F2F4" };
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 text-[10px] font-mono font-bold tracking-[0.14em] uppercase rounded-full whitespace-nowrap"
      style={style}
    >
      {guest ? "Guest session" : "RAMS session"}
    </span>
  );
}

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

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9 lg:p-11 text-white">
        <div className="flex flex-wrap items-center gap-2">
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
              <span aria-hidden className="wbnr-dot" />
            )}
            {item.pill}
          </span>
          <HostTag host={item.host} onDark />
        </div>

        <h3 className="mt-5 sm:mt-4 text-[20px] sm:text-[30px] lg:text-[40px] font-bold tracking-[-0.04em] leading-[1.08] max-w-[680px]">
          {item.title}
        </h3>

        {item.body && (
          <p className="mt-2 sm:mt-3 flex items-center gap-2 text-[12.5px] sm:text-[15px] text-white/70 leading-[1.5] sm:leading-[1.55] max-w-[560px]">
            <span
              aria-hidden
              className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full shrink-0"
              style={{ background: "rgba(255,255,255,0.14)" }}
            >
              <UserRound className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
            <span className="sr-only">Speakers: </span>
            <span className="line-clamp-1 sm:line-clamp-none">{item.body}</span>
          </p>
        )}

        <span className="mt-3 sm:mt-6 inline-flex items-center gap-2 bg-white text-carbon text-[12.5px] sm:text-[13.5px] font-semibold px-4 sm:px-5 py-2.5 sm:py-3 rounded-full transition-all duration-200 group-hover:bg-signal-orange group-hover:text-white">
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
        /* A solid dot with a soft filled halo growing out from behind it.
           The halo was a 1.5px outline the size of the dot, so at the start
           of each pulse the two edges sat on top of each other. */
        .wbnr-dot {
          position: relative; flex-shrink: 0;
          width: 7px; height: 7px; border-radius: 999px; background: #FF6A00;
        }
        .wbnr-dot::before {
          content: ""; position: absolute; inset: 0; border-radius: 999px;
          background: #FF6A00; z-index: -1;
          animation: wbnr-pulse 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes wbnr-pulse {
          0%   { transform: scale(1);   opacity: 0.55; }
          80%, 100% { transform: scale(2.6); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .wbnr-dot::before { animation: none; opacity: 0; }
        }
      `}</style>

      {/* the header, off the centre line like the other index pages' */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-6 lg:gap-12 items-end mb-10 sm:mb-12">
        <div className="max-w-[760px]">
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-signal-orange">
            Upcoming webinars
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

      {/* The whole series, in the careers board's card: date tile, tag,
          title, then time and speakers, and the action on the right. */}
      <h3 className="mt-16 sm:mt-20 text-[22px] sm:text-[24px] font-bold tracking-[-0.025em] text-carbon">
        Upcoming webinar schedule
      </h3>
      <ol className="mt-6 space-y-5">
        {FEATURED.map((f) => (
          <li
            key={f.id}
            className="group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl bg-white border border-[#ECECEF] transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-start gap-4 sm:gap-6 flex-1 min-w-0">
              {/* date tile */}
              <div
                className="flex flex-col items-center justify-center w-[72px] h-[80px] rounded-xl shrink-0 text-center bg-[#F5F5F7]"
              >
                <span className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-graphite/50">
                  {f.date.weekday}
                </span>
                <span className="mt-0.5 text-[26px] font-bold tracking-[-0.03em] leading-none text-carbon tabular-nums">
                  {f.date.day}
                </span>
                <span className="mt-1 text-[11px] font-semibold text-graphite/60">
                  {f.date.month} {f.date.year}
                </span>
              </div>

              <div className="min-w-0">
                <HostTag host={f.host} />
                <p className="mt-2.5 text-[17px] sm:text-[18px] font-bold tracking-[-0.02em] text-carbon leading-[1.3]">
                  {f.title}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13.5px] text-graphite/65">
                  {f.time && (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-graphite/40" aria-hidden />
                      {f.time}
                    </span>
                  )}
                  {f.body && (
                    <span className="inline-flex items-center gap-1.5">
                      <UserRound className="w-4 h-4 text-graphite/40" aria-hidden />
                      <span className="sr-only">Speakers: </span>
                      <span className="font-medium text-carbon/80">{f.body}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <a
              href={f.href}
              className="inline-flex items-center justify-center gap-1.5 px-5 h-11 rounded-full bg-signal-orange text-white text-[13.5px] font-semibold transition-colors hover:bg-signal-orange-hover shrink-0"
            >
              {f.cta}
              <ArrowUpRight className="w-4 h-4" aria-hidden />
            </a>
          </li>
        ))}
      </ol>
    </Section>
  );
}
