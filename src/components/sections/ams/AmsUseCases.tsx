"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ClipboardCheck,
  GitCompareArrows,
  MonitorPlay,
  Radar,
  Share2,
  Trophy,
} from "lucide-react";
import { Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 09 — Key use cases.
 *
 * `TwinProof`'s carousel, which is `IndustriesCarousel`'s: a clipped viewport,
 * a `ResizeObserver` on it, card width solved so `visible` cards fit plus a
 * `PEEK` of the next, a spring on the track, and the Apple dot pill beneath.
 * Four visible at desktop; six cards, so the row travels.
 *
 * The card is the four-up card the rest of this page uses.
 *
 * Each icon reads its own card. `Radar` is watching a site you are not
 * standing in; `Share2` is the graph of related signals; `Trophy` is a league
 * table, which is what benchmarking produces; `MonitorPlay` is the live review
 * that replaces the deck. None is decorative, and none repeats within the page.
 *
 * No arrow and no link, unlike TwinProof: every card there points at a real
 * route under `src/app`, and these are management activities, not
 * destinations.
 */

const GAP = 20;
const PEEK = 0.15;

const CASES = [
  {
    icon: Radar,
    kicker: "Remote site review",
    k: "Inspect operations without travelling",
    body: "Open any connected facility to see current status, changes, parameters and available evidence.",
  },
  {
    icon: Share2,
    kicker: "Cross-module root cause",
    k: "Connect related signals",
    body: "Study whether rack impacts, MHE routes, inventory staging and task peaks share a common condition.",
  },
  {
    icon: GitCompareArrows,
    kicker: "Executive control tower",
    k: "See enterprise priorities",
    body: "Bring safety, availability, productivity, efficiency and closure into one management operating picture.",
  },
  {
    icon: Trophy,
    kicker: "Multi-site benchmarking",
    k: "Find leaders and outliers",
    body: "Compare facilities using common definitions while preserving local drill-down.",
  },
  {
    icon: ClipboardCheck,
    kicker: "Action governance",
    k: "Keep priorities moving to closure",
    body: "See owners, due dates, blocked work, evidence and verified completion across teams.",
  },
  {
    icon: MonitorPlay,
    kicker: "Management review",
    k: "Replace static deck updates",
    body: "Review live operating evidence and current indicators instead of relying only on manually consolidated reports.",
  },
];

export function AmsUseCases() {
  const viewport = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(4);
  const [width, setWidth] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const read = () => {
      const vw = window.innerWidth;
      setVisible(vw < 640 ? 1 : vw < 1024 ? 2 : vw < 1280 ? 3 : 4);
    };
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const read = () => setWidth(el.clientWidth);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* width = card * (visible + PEEK) + GAP * (visible - 1) */
  const cardWidth =
    width > 0 ? (width - GAP * (visible - 1)) / (visible + PEEK) : 300;
  const step = cardWidth + GAP;
  const maxIndex = Math.max(0, CASES.length - visible);

  /* Clamped during render, not in an effect — a resize can shrink `maxIndex`
     below the current index. */
  const at = Math.min(index, maxIndex);

  useEffect(() => {
    if (reduceMotion || maxIndex === 0 || paused) return;
    const id = setInterval(
      () => setIndex((i) => (i >= maxIndex ? 0 : i + 1)),
      3800,
    );
    return () => clearInterval(id);
  }, [maxIndex, reduceMotion, paused, tick]);

  return (
    <Section surface="white" id="use-cases">
      <style>{`
        @property --amsuse-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .amsuse-card { position: relative; isolation: isolate; }
        .amsuse-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--amsuse-shine-angle),
            transparent 0deg,
            transparent 300deg,
            rgba(255,106,0,0.9) 340deg,
            transparent 360deg
          );
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
                  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
          z-index: 1;
        }
        .amsuse-card:hover::before {
          opacity: 1;
          animation: amsuse-shine 2.4s linear infinite;
        }
        @keyframes amsuse-shine {
          to { --amsuse-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .amsuse-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Key use cases"
        top="Use intelligence where"
        bottom="Management decisions are made."
        size="compact"
        width="wide"
        body="AIMS supports live operations, review cycles and improvement programmes across sites."
      />

      {/* Pauses while the pointer is over it — a row that keeps moving under
          the cursor is hard to read. */}
      <div
        ref={viewport}
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div
          className="flex"
          style={{ gap: GAP, willChange: "transform" }}
          animate={{ x: -at * step }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 220, damping: 30, mass: 0.9 }
          }
        >
          {CASES.map((c) => (
            <div key={c.kicker} style={{ width: cardWidth, flexShrink: 0 }}>
              <article
                className="amsuse-card group flex flex-col h-full p-7 sm:p-8 bg-white transition-transform duration-300 hover:-translate-y-1"
                style={{
                  borderRadius: 12,
                  border: "1px solid #E8E8ED",
                  boxShadow:
                    "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  className="w-12 h-12 flex items-center justify-center mb-6"
                  style={{
                    borderRadius: 8,
                    background: "rgba(255,106,0,0.08)",
                    border: "1px solid rgba(255,106,0,0.18)",
                  }}
                >
                  <c.icon
                    className="w-[22px] h-[22px] text-signal-orange"
                    strokeWidth={2}
                  />
                </div>

                <span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
                  {c.kicker}
                </span>

                {/* Two lines reserved — four of the six titles wrap. */}
                <h3 className="mt-2.5 min-h-[2.4em] text-[20px] sm:text-[21px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
                  {c.k}
                </h3>

                <p className="mt-3 text-[14px] text-graphite/65 leading-[1.65]">
                  {c.body}
                </p>
              </article>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Apple-style pagination — the dot pill from the homepage carousel */}
      <div className="mt-12 flex items-center justify-center">
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
          {Array.from({ length: maxIndex + 1 }).map((_, i) => {
            const active = i === at;
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setIndex(i);
                  setTick((v) => v + 1);
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
