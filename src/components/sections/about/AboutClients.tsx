"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
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
 * The review row: one card at a time slides in after a pause (STEP_MS),
 * looping seamlessly, holding while the pointer is over it, and still under
 * `prefers-reduced-motion`.
 *
 * THESE ARE THE PREVIOUS PAGE'S PLACEHOLDER REVIEWS (AboutCustomers' VOICES)
 * and are shown labelled as samples — a note above the row and a tag on each
 * card — until real testimonials replace them. Swap VOICES for real ones and
 * drop the labels then.
 */
function Voices() {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(400);
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [hover, setHover] = useState(false);
  const items = [...VOICES, ...VOICES];

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setW(Math.min(400, Math.round(el.clientWidth * 0.86)));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || hover) return;
    const t = setTimeout(() => {
      setAnimate(true);
      setIndex((i) => i + 1);
    }, STEP_MS);
    return () => clearTimeout(t);
  }, [index, hover, reduce]);

  return (
    <div className="mt-14 sm:mt-16">
      <p className="mb-6 text-center text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-graphite/45">
        Sample testimonials — illustrative only, not customer reviews
      </p>
      <div
        ref={box}
        className="relative overflow-hidden"
        style={{ WebkitMaskImage: EDGE_FADE, maskImage: EDGE_FADE }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          className="flex items-stretch"
          style={{
            gap: GAP,
            transform: `translateX(${-index * (w + GAP)}px)`,
            transition: animate ? "transform 0.7s cubic-bezier(0.22,1,0.36,1)" : "none",
          }}
          onTransitionEnd={() => {
            // past the first set: jump back to the same card in it, unseen
            if (index >= VOICES.length) {
              setAnimate(false);
              setIndex(index - VOICES.length);
            }
          }}
        >
          {items.map((v, i) => (
            <div key={i} className="shrink-0" style={{ width: w }} aria-hidden={i >= VOICES.length}>
              <VoiceCard v={v} />
            </div>
          ))}
        </div>
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
