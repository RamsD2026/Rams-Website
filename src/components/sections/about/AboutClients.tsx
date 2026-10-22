"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { CLIENTS } from "@/data/clients";
import { Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { VOICES, type Voice } from "./AboutCustomers";

/**
 * Customers & collaboration — the client band and the review cards from the
 * previous About page (`AboutCustomers`). The reviews are that page's
 * placeholders, shown labelled as samples until real ones replace them.
 *
 * The band runs every mark in `src/data/clients.ts` — RAMS's own asset pack
 * — in greyscale at 0.55, full colour on hover, looping at 92s, holding on
 * hover and stopping under `prefers-reduced-motion`.
 */

/** Content enters and leaves rather than snapping. */
const EDGE_FADE =
  "linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)";

/* ── the review cards ─────────────────────────────────────────────── */

const HAIR = "#E8E8ED";
const STEP_MS = 3500;
const GAP = 20;

function Rating({ n }: { n: number }) {
  return (
    <span className="flex items-center gap-[3px] shrink-0" aria-label={`${n} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden
          className="w-[13px] h-[13px]"
          strokeWidth={0}
          style={{ fill: i <= n ? "#FF6A00" : "rgba(255,106,0,0.18)" }}
        />
      ))}
    </span>
  );
}

function initials(s: string) {
  return s
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function VoiceCard({ v }: { v: Voice }) {
  return (
    <article
      className="flex flex-col h-full bg-white p-7"
      style={{
        borderRadius: 16,
        border: `1px solid ${HAIR}`,
        boxShadow: "0 1px 2px rgba(0,0,0,0.02), 0 10px 30px -14px rgba(0,0,0,0.07)",
      }}
    >
      <div className="flex items-center gap-3">
        {v.avatar ? (
          <Image
            src={v.avatar}
            alt=""
            width={120}
            height={120}
            className="w-11 h-11 shrink-0 rounded-full object-cover"
            style={{ border: `1px solid ${HAIR}` }}
          />
        ) : (
          <span
            aria-hidden
            className="flex items-center justify-center w-11 h-11 shrink-0 text-[12px] font-mono font-bold text-signal-orange"
            style={{ borderRadius: 999, background: "rgba(255,106,0,0.08)", border: "1px solid rgba(255,106,0,0.18)" }}
          >
            {initials(v.name)}
          </span>
        )}
        <span className="flex flex-col min-w-0 flex-1">
          <span className="text-[14px] font-semibold text-carbon leading-[1.3] truncate">{v.name}</span>
          <span className="mt-0.5 text-[12px] text-graphite/55 leading-[1.35] truncate">{v.role}</span>
        </span>
        <Rating n={v.rating} />
      </div>
      <span aria-hidden className="my-6 block" style={{ height: 1, background: HAIR }} />
      <p className="text-[14.5px] leading-[1.7] text-carbon/75">{v.quote}</p>
      <span className="mt-auto pt-6 flex items-center justify-between gap-3">
        <span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/40">{v.company}</span>
        <span className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-graphite/50 px-2 py-0.5 rounded-full bg-[#F2F2F2]">
          Sample
        </span>
      </span>
    </article>
  );
}

/**
 * The review row: a horizontal rail the reader can scroll themselves —
 * swipe on a phone, trackpad or the arrow buttons on a desktop — with cards
 * snapping into place. It also steps one card on its own every STEP_MS,
 * returning to the start after the last, and holds while the pointer is over
 * it, a finger is on it or it is being scrolled, and under
 * `prefers-reduced-motion`.
 *
 * THESE ARE THE PREVIOUS PAGE'S PLACEHOLDER REVIEWS (AboutCustomers' VOICES)
 * and each card carries a Sample tag until real testimonials replace them.
 * Swap VOICES for real ones and drop the tag then.
 */
/** Move a rail one card along, or back to the start from the last card. */
function advance(el: HTMLDivElement | null, dir: 1 | -1) {
  if (!el) return;
  const card = el.querySelector<HTMLElement>("[data-card]");
  const step = card ? card.offsetWidth + GAP : 420;
  const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
  if (dir === 1 && end) el.scrollTo({ left: 0, behavior: "smooth" });
  else el.scrollBy({ left: dir * step, behavior: "smooth" });
}

function Voices() {
  const reduce = useReducedMotion();
  const rail = useRef<HTMLDivElement>(null);
  const [hold, setHold] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const idle = useRef<ReturnType<typeof setTimeout> | null>(null);
  // true while the rail is moving on its own, so that scroll is not taken
  // for the reader's hand
  const auto = useRef(false);

  const go = (dir: 1 | -1) => advance(rail.current, dir);

  // the edges, for the arrows
  const onScroll = () => {
    const el = rail.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    if (auto.current) return;
    // a hand on the rail holds the auto-step until it has been still a while
    setHold(true);
    if (idle.current) clearTimeout(idle.current);
    idle.current = setTimeout(() => setHold(false), STEP_MS);
  };

  useEffect(() => {
    if (reduce || hold) return;
    const t = setInterval(() => {
      auto.current = true;
      advance(rail.current, 1);
      setTimeout(() => {
        auto.current = false;
      }, 900);
    }, STEP_MS);
    return () => clearInterval(t);
  }, [reduce, hold]);

  useEffect(() => () => {
    if (idle.current) clearTimeout(idle.current);
  }, []);

  return (
    <div className="mt-14 sm:mt-16">
      <div
        ref={rail}
        onScroll={onScroll}
        onMouseEnter={() => setHold(true)}
        onMouseLeave={() => setHold(false)}
        onTouchStart={() => setHold(true)}
        className="flex items-stretch overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-px-1 pb-2"
        style={{ gap: GAP }}
        aria-label="Testimonials"
        tabIndex={0}
      >
        {VOICES.map((v) => (
          <div
            key={v.name}
            data-card
            className="shrink-0 snap-start w-[86%] sm:w-[400px]"
          >
            <VoiceCard v={v} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        {([-1, 1] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            onClick={() => go(dir)}
            disabled={dir === -1 && atStart}
            aria-label={dir === -1 ? "Previous testimonials" : "Next testimonials"}
            className="flex items-center justify-center w-11 h-11 rounded-full bg-white text-carbon transition-colors hover:bg-[#F5F5F7] disabled:opacity-40 disabled:cursor-default"
            style={{ boxShadow: `inset 0 0 0 1px ${HAIR}` }}
          >
            {dir === -1 ? <ArrowLeft className="w-4 h-4" aria-hidden /> : <ArrowRight className="w-4 h-4" aria-hidden />}
          </button>
        ))}
        <span className="sr-only">{atEnd ? "End of testimonials" : ""}</span>
      </div>
    </div>
  );
}

export function AboutClients() {
  return (
    <Section surface="white" id="customers" padding="tight">
      <style>{`
        @keyframes abtcl-run {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .abtcl-track {
          display: flex;
          width: max-content;
          animation: abtcl-run 92s linear infinite;
        }
        .abtcl-wrap:hover .abtcl-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .abtcl-track { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Customers & collaboration"
        top="Built through real"
        bottom="Operational relationships."
        size="compact"
        width="wide"
        body="RAMS Digital publicly recognises relationships with organisations across logistics, manufacturing, engineering, retail and industrial operations."
        className="!mb-12 sm:!mb-14"
      />

      <div
        className="abtcl-wrap relative overflow-hidden"
        style={{ WebkitMaskImage: EDGE_FADE, maskImage: EDGE_FADE }}
      >
        <div className="abtcl-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {CLIENTS.map((c) => (
                <span
                  key={c.slug}
                  className="group flex items-center justify-center h-[64px] px-8 sm:px-10 shrink-0"
                >
                  <Image
                    src={`/clients/${c.slug}.png`}
                    alt={copy === 1 ? "" : c.name}
                    width={c.w}
                    height={c.h}
                    className="h-[30px] sm:h-[34px] w-auto object-contain grayscale opacity-55 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                  />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Voices />
    </Section>
  );
}
