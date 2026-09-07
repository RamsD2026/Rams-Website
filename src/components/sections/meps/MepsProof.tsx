"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Battery,
  Gauge,
  Layers,
  Route,
  Shuffle,
  Timer,
  TrendingUp,
} from "lucide-react";
import { Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 07 — Proof / customers.
 *
 * The Digital Twin's proof section, mechanism for mechanism: `TwinProof`'s
 * carousel, which is itself `IndustriesCarousel`'s — a clipped viewport, a
 * `ResizeObserver` on it, card width solved so `visible` cards fit plus a
 * `PEEK` of the next, a spring on the track, and the Apple dot pill beneath.
 * Four visible at desktop.
 *
 * The card is the four-up card the rest of this page uses — 48px tinted tile,
 * 22px icon at stroke 2, 20/21px bold title, 14px body at 1.65 — with the
 * measure pinned to the bottom behind an orange rule.
 *
 * Two differences from TwinProof, both deliberate:
 *
 *   · No arrow and no link. Every card there is a real route under `src/app`;
 *     these are measures, not destinations, and an arrow on something that
 *     goes nowhere is a promise the card cannot keep.
 *   · No figures. Each card names what the improvement is *measured by* and
 *     says nothing about how much. A proof section that arrives with its own
 *     numbers is not proof, it is a claim — and a baseline belongs to the
 *     customer's site, not to us.
 *
 * White, not the reference's dark panel: section six is `ink`, and two dark
 * sections in a row breaks the alternation the rest of the site holds to.
 */

const GAP = 20;
const PEEK = 0.15;

const MEASURES = [
  {
    icon: Gauge,
    k: "Utilisation",
    body: "Compare productive share before and after the change.",
    measure: "Productive share, % of shift",
  },
  {
    icon: Timer,
    k: "Idle + wait",
    body: "Measure time recovered from queues and inactivity.",
    measure: "Minutes recovered per shift",
  },
  {
    icon: Route,
    k: "Travel per task",
    body: "Track movement reduced through route or staging changes.",
    measure: "Distance per completed task",
  },
  {
    icon: TrendingUp,
    k: "Work per MHE hour",
    body: "Connect fleet time to configured task output.",
    measure: "Tasks per machine hour",
  },
  {
    icon: Shuffle,
    k: "Route change",
    body: "Verify a re-routed lane against the travel it was meant to remove.",
    measure: "Distance on the changed lane",
  },
  {
    icon: Layers,
    k: "Staging & zones",
    body: "Check a moved charger or staging area against the queue it was meant to shorten.",
    measure: "Dwell and queue, by zone",
  },
  {
    icon: Battery,
    k: "Fleet sizing",
    body: "Test a fleet change against the work the shift actually needs.",
    measure: "Machine hours against task demand",
  },
];

export function MepsProof() {
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
  const maxIndex = Math.max(0, MEASURES.length - visible);

  /* Clamped during render, not in an effect. A resize can shrink `maxIndex`
     below the current index, and correcting that with `setState` inside an
     effect costs a second render every time the viewport changes. */
  const at = Math.min(index, maxIndex);

  /* Autoplay. Advances on its own and wraps; a click sets the slide and
     restarts the dwell rather than switching autoplay off, so the row never
     ends up frozen. */
  useEffect(() => {
    if (reduceMotion || maxIndex === 0 || paused) return;
    const id = setInterval(
      () => setIndex((i) => (i >= maxIndex ? 0 : i + 1)),
      3800,
    );
    return () => clearInterval(id);
  }, [maxIndex, reduceMotion, paused, tick]);

  return (
    <Section surface="white" id="proof">
      <style>{`
        @property --mepsproof-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .mepsproof-card { position: relative; isolation: isolate; }
        .mepsproof-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--mepsproof-shine-angle),
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
        .mepsproof-card:hover::before {
          opacity: 1;
          animation: mepsproof-shine 2.4s linear infinite;
        }
        @keyframes mepsproof-shine {
          to { --mepsproof-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mepsproof-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Proof / Customers"
        top="Prove improvement"
        bottom="Against the baseline."
        size="long"
        width="wide"
        body="MEPS creates a measurable path from observed activity to verified operating change. Each change is checked against the measure it was supposed to move, on the site's own baseline."
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
          {MEASURES.map((o) => (
            <div key={o.k} style={{ width: cardWidth, flexShrink: 0 }}>
              <article
                className="mepsproof-card group flex flex-col h-full p-7 sm:p-8 bg-white transition-transform duration-300 hover:-translate-y-1"
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
                  <o.icon
                    className="w-[22px] h-[22px] text-signal-orange"
                    strokeWidth={2}
                  />
                </div>

                {/* Two lines reserved. Four of the seven titles wrap and three
                    do not, which would start the bodies at two heights. */}
                <h3 className="min-h-[2.4em] text-[20px] sm:text-[21px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
                  {o.k}
                </h3>

                <p className="mt-4 mb-7 text-[14px] text-graphite/65 leading-[1.65]">
                  {o.body}
                </p>

                <span className="mt-auto flex items-start gap-2.5 text-[11px] font-mono leading-[1.5] text-graphite/45">
                  <span
                    aria-hidden
                    className="mt-[6px] w-2.5 h-px shrink-0"
                    style={{ background: "#FF6A00" }}
                  />
                  {o.measure}
                </span>
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
