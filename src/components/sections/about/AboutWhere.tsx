"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Building2,
  Boxes,
  Cog,
  Construction,
  Factory,
  Truck,
  Warehouse,
  Zap,
} from "lucide-react";
import { Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 10 — Where we work.
 *
 * Eight environments on a track that moves on its own. This is
 * `AmsUseCases` — which is `IndustriesCarousel` with an interval on it —
 * carried over whole:
 *
 *   the viewport is clipped and measured by a `ResizeObserver`
 *   width = card * (visible + PEEK) + GAP * (visible - 1)   PEEK 0.15, GAP 20
 *   four visible at desktop, three, two and one below
 *   the spring is 220 / 30 / 0.9
 *   the index advances every 3.8s and wraps at the end
 *   it holds while the pointer is over the row
 *   the card is the platform pages' icon card: a 48px orange tile at 8px
 *     radius, the heading, the line, a 12px radius and the conic shine
 *   the dot pill is 44 tall on #F0F0F2, the active dot 24 x 6
 *
 * ── Why it moves on its own and section eight does not ──────────────
 * Eight items over five stops is more than a reader will page through by
 * hand, and every card here is one word — there is nothing to stop and read,
 * so a clock costs the reader nothing. Section eight carries four
 * photographs with a sentence each, which is worth stopping on, so it waits
 * to be asked. Both hold while the pointer is over them.
 *
 * ── No kicker on the card ───────────────────────────────────────────
 * `AmsUseCases` runs kicker, heading and body because its headings are verb
 * phrases and the kicker names the use case. Here the heading is the
 * environment, and a second label above it would be the same words twice.
 *
 * ── The icons ───────────────────────────────────────────────────────
 * Each reads its own environment, and none repeats one already on this page —
 * `AboutWhy` holds History, Unlink, Puzzle and Hourglass, `AboutDifferent`
 * holds Ruler, Anchor, Cable and CircleCheckBig, and `AboutHow` holds Frame,
 * Tag, Network, Workflow, LineChart and Gauge.
 *
 * ── The copy is conditional, and stays that way ─────────────────────
 * The section's own line says the foundation *can* extend beyond warehousing.
 * So each card describes the environment — what is in it and what makes it
 * hard — rather than claiming RAMS is deployed there. Nothing on this page
 * may read as a customer that does not exist.
 */

const GAP = 20;
const PEEK = 0.15;
const DWELL_MS = 3800;

const PLACES: {
  icon: typeof Warehouse;
  name: string;
  body: string;
}[] = [
  {
    icon: Warehouse,
    name: "Warehouses",
    body: "Storage structures, handling equipment, inventory and the people moving between them.",
  },
  {
    icon: Boxes,
    name: "Distribution centres",
    body: "High-throughput sites where receiving, staging, put-away and despatch compete for the same floor.",
  },
  {
    icon: Factory,
    name: "Factories",
    body: "Production lines, material flow and the equipment that has to keep running between them.",
  },
  {
    icon: Cog,
    name: "Industrial plants",
    body: "Process equipment and fixed installations, where condition and access are governed by procedure.",
  },
  {
    icon: Truck,
    name: "Logistics facilities",
    body: "Cross-dock, yard and transfer operations, where assets move between owners and systems.",
  },
  {
    icon: Zap,
    name: "Utilities",
    body: "Distributed assets across a network, inspected on a cycle rather than watched continuously.",
  },
  {
    icon: Construction,
    name: "Infrastructure",
    body: "Long-lived built assets, where the condition history matters more than any single survey.",
  },
  {
    icon: Building2,
    name: "Large built environments",
    body: "Campuses, terminals and complexes where several operations share one physical estate.",
  },
];

export function AboutWhere() {
  const viewport = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(4);
  const [width, setWidth] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0);

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

  const card = width > 0 ? (width - GAP * (visible - 1)) / (visible + PEEK) : 300;
  const step = card + GAP;
  const maxIndex = Math.max(0, PLACES.length - visible);

  /* Clamped during render, not in an effect — a resize can shrink `maxIndex`
     below the current index. */
  const at = Math.min(index, maxIndex);

  useEffect(() => {
    if (reduce || maxIndex === 0 || paused) return;
    const id = setInterval(
      () => setIndex((i) => (i >= maxIndex ? 0 : i + 1)),
      DWELL_MS,
    );
    return () => clearInterval(id);
  }, [maxIndex, reduce, paused, tick]);

  return (
    <Section surface="offWhite" id="where-we-work">
      <style>{`
        @property --abtwhere-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .abtwhere-card { position: relative; isolation: isolate; }
        .abtwhere-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--abtwhere-shine-angle),
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
        .abtwhere-card:hover::before {
          opacity: 1;
          animation: abtwhere-shine 2.4s linear infinite;
        }
        @keyframes abtwhere-shine {
          to { --abtwhere-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .abtwhere-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Where we work"
        top="Built for environments"
        bottom="Where physical operations matter."
        size="compact"
        width="wide"
        body="The Digital Twin foundation can extend beyond warehousing wherever assets, infrastructure and live operations require persistent context."
      />

      {/* Holds while the pointer is over it — a row that keeps moving under
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
            reduce
              ? { duration: 0 }
              : { type: "spring", stiffness: 220, damping: 30, mass: 0.9 }
          }
        >
          {PLACES.map((p) => (
            <div key={p.name} style={{ width: card, flexShrink: 0 }}>
              <article
                className="abtwhere-card group flex flex-col h-full p-7 sm:p-8 bg-white transition-transform duration-300 hover:-translate-y-1"
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
                  <p.icon
                    className="w-[22px] h-[22px] text-signal-orange"
                    strokeWidth={2}
                    aria-hidden
                  />
                </div>

                {/* Two lines reserved — several of the eight names wrap at 282px. */}
                <h3 className="min-h-[2.4em] text-[20px] sm:text-[21px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
                  {p.name}
                </h3>

                <p className="mt-3 text-[14px] text-graphite/65 leading-[1.65]">
                  {p.body}
                </p>
              </article>
            </div>
          ))}
        </motion.div>
      </div>

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
            const now = i === at;
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setIndex(i);
                  setTick((v) => v + 1);
                }}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={now ? "true" : undefined}
                style={{
                  width: now ? 24 : 6,
                  height: 6,
                  borderRadius: 999,
                  background: now ? "var(--color-carbon-alt)" : "#86868B",
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
