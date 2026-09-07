"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Boxes,
  Cpu,
  Gauge,
  LayoutGrid,
  ShieldCheck,
  Truck,
  Waypoints,
} from "lucide-react";
import { Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 09 — Product proof.
 *
 * The seven applications that already run on the twin, in the homepage
 * carousel. `IndustriesCarousel` is the reference and the mechanism is copied
 * from it rather than re-derived: a clipped viewport, a `ResizeObserver` on it,
 * card width solved so `visibleCount` cards fit plus a `PEEK` of the next, a
 * spring on the track, and the Apple-style dot pill underneath.
 *
 * Four visible at desktop rather than three — these cards carry a code and a
 * line, not a photograph, so they can be narrower.
 *
 * The card is the solution-page card (`WexWhy`, `RiqRoles`, `InvWhy`): 48px
 * tinted tile, 22px icon at stroke 2, 20/21px bold title, 14px body at 1.65.
 * Every one is a link — a module list you cannot click is a claim; one you can
 * is an invitation to check it. Hrefs are the real routes under `src/app`.
 */

const GAP = 20;
const PEEK = 0.15;

const MODULES = [
  {
    code: "IRDS",
    icon: ShieldCheck,
    title: "Rack safety + lifecycle",
    body: "Inspection, findings, corrective action and the structural history of every rack.",
    href: "/platform/irds",
  },
  {
    code: "MEPS",
    icon: Gauge,
    title: "MHE productivity",
    body: "Movement, utilisation, idle time and task activity across the fleet.",
    href: "/platform/meps",
  },
  {
    code: "RTSS",
    icon: Truck,
    title: "MHE safety",
    body: "Speed, zones, pedestrian interaction and the events that precede an incident.",
    href: "/platform/rtss",
  },
  {
    code: "IROS",
    icon: Boxes,
    title: "Inventory visibility",
    body: "Where stock actually is, how it moves, and where it is re-handled.",
    href: "/solutions/inventory-intelligence",
  },
  {
    code: "ATOS",
    icon: Waypoints,
    title: "Operational execution",
    body: "Task assignment, routing and exception handling on the live floor.",
    href: "/solutions/warehouse-execution",
  },
  {
    code: "IMDS",
    icon: Cpu,
    title: "MHE diagnostics",
    body: "Fault codes, condition and service history read against the machine itself.",
    href: "/platform/imds",
  },
  {
    code: "AIMS",
    icon: LayoutGrid,
    title: "Management intelligence",
    body: "One view across sites, for deciding and acting rather than watching.",
    href: "/solutions/management-intelligence",
  },
];

export function TwinProof() {
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
  const maxIndex = Math.max(0, MODULES.length - visible);

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
      <style>{`.twinproof-card:hover { border-color: rgba(255,106,0,0.36); }`}</style>

      <SectionHeader
        eyebrow="Product proof"
        top="A platform proven"
        bottom="Through operational applications."
        size="long"
        width="wide"
        body="RAMS 2.0 demonstrates that sophisticated safety, productivity, inventory, maintenance and management applications can operate on the Digital Twin."
      />

      {/* Pauses while the pointer is over it — a row that keeps moving under
          the cursor is hard to click. */}
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
          {MODULES.map((m) => (
            <div key={m.code} style={{ width: cardWidth, flexShrink: 0 }}>
              <Link
                href={m.href}
                className="twinproof-card group flex flex-col h-full p-7 sm:p-8 bg-white transition-all duration-300 hover:-translate-y-1"
                style={{ borderRadius: 12, border: "1px solid #E8E8ED" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="w-12 h-12 flex items-center justify-center"
                    style={{
                      borderRadius: 8,
                      background: "rgba(255,106,0,0.08)",
                      border: "1px solid rgba(255,106,0,0.18)",
                    }}
                  >
                    <m.icon
                      className="w-[22px] h-[22px] text-signal-orange"
                      strokeWidth={2}
                    />
                  </div>
                  <ArrowUpRight
                    className="w-4 h-4 text-graphite/25 transition-all duration-300 group-hover:text-signal-orange group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={2}
                    aria-hidden
                  />
                </div>

                <span className="mt-6 text-[11px] font-mono font-bold tracking-[0.18em] text-signal-orange">
                  {m.code}
                </span>
                <h3 className="mt-2.5 text-[20px] sm:text-[21px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
                  {m.title}
                </h3>
                <p className="mt-3 text-[14px] text-graphite/65 leading-[1.65]">
                  {m.body}
                </p>
              </Link>
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
