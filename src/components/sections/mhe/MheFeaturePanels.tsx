"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Gauge, Route } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Panel = {
  icon: typeof ShieldCheck;
  eyebrow: string;
  title: string;
  body: string;
  metricLabel: string;
  metricValue: string;
  metricPercent: number;
};

const PANELS: Panel[] = [
  {
    icon: ShieldCheck,
    eyebrow: "Safety-first operations",
    title: "Understand how MHEs are being driven.",
    body: "Track overspeeding, impacts and operator-linked risk events to improve day-to-day safety.",
    metricLabel: "Safety performance",
    metricValue: "82%",
    metricPercent: 82,
  },
  {
    icon: Gauge,
    eyebrow: "Productivity intelligence",
    title: "Turn movement data into productivity insight.",
    body: "Measure utilisation, idle time and movement patterns across shifts and operators.",
    metricLabel: "Fleet utilisation",
    metricValue: "72%",
    metricPercent: 72,
  },
  {
    icon: Route,
    eyebrow: "Fleet & pallet efficiency",
    title: "Improve pallet flow and reduce congestion.",
    body: "Spot waiting zones, movement bottlenecks and inefficient pallet flow to improve throughput.",
    metricLabel: "Flow efficiency",
    metricValue: "76%",
    metricPercent: 76,
  },
];

/**
 * 04 — The three panels the page leads its argument with.
 *
 * They were 24px teal cards on `#000E11` with their own CSS block, the
 * middle one filled solid orange — the only section on any solution page
 * that inverts a card to the accent colour. The accent is 5% of the palette,
 * so here it is the tile and the meter, and the card is the site's own.
 *
 * The meter is kept: it is what makes each panel a measurement rather than
 * a claim.
 */
export function MheFeaturePanels() {
  return (
    <section
      className="pt-28 sm:pt-36 lg:pt-44 pb-28 sm:pb-36 lg:pb-44"
      style={{ background: "#F5F5F7" }}
    >
      <style>{`
        @property --mhefp-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .mhefp-card { position: relative; isolation: isolate; }
        .mhefp-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--mhefp-shine-angle),
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
        .mhefp-card:hover::before {
          opacity: 1;
          animation: mhefp-shine 2.4s linear infinite;
        }
        @keyframes mhefp-shine {
          to { --mhefp-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mhefp-card:hover::before { animation: none; }
        }
      `}</style>

      <div className="rams-container">
        <div className="max-w-[900px] mx-auto text-center mb-20 sm:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange mb-5"
          >
            What it changes
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.85, ease: EASE }}
            className="text-[40px] sm:text-[60px] lg:text-[78px] font-bold text-carbon leading-[1.0] tracking-[-0.04em]"
          >
            Three things a fleet <br />
            <span className="text-graphite/50">can finally measure.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {PANELS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.article
                key={p.eyebrow}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                className="mhefp-card group relative flex flex-col p-8 sm:p-9 bg-white transition-all duration-300 hover:-translate-y-1"
                style={{
                  borderRadius: 12,
                  border: "1px solid #E8E8ED",
                  boxShadow:
                    "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  className="w-12 h-12 flex items-center justify-center"
                  style={{
                    borderRadius: 8,
                    background: "rgba(255,106,0,0.08)",
                    border: "1px solid rgba(255,106,0,0.18)",
                    color: "#FF6A00",
                  }}
                >
                  <Icon
                    className="w-[22px] h-[22px]"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </div>

                <p className="mt-7 text-[10.5px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange">
                  {p.eyebrow}
                </p>

                <h3 className="mt-3 text-[22px] sm:text-[24px] font-bold text-carbon tracking-[-0.025em] leading-[1.2]">
                  {p.title}
                </h3>

                <p className="mt-3 text-[14.5px] text-graphite/65 leading-[1.6]">
                  {p.body}
                </p>

                {/* the meter */}
                <div
                  className="mt-auto pt-8"
                  aria-label={`${p.metricLabel}: ${p.metricValue}`}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] font-mono font-semibold tracking-[0.16em] uppercase text-graphite/50">
                      {p.metricLabel}
                    </span>
                    <span className="text-[20px] font-bold text-carbon tabular-nums tracking-[-0.02em]">
                      {p.metricValue}
                    </span>
                  </div>
                  <div
                    aria-hidden
                    className="mt-3 h-1.5 overflow-hidden"
                    style={{ borderRadius: 999, background: "#EDEDF0" }}
                  >
                    <motion.span
                      className="block h-full"
                      style={{
                        borderRadius: 999,
                        background:
                          "linear-gradient(90deg, #FF6A00 0%, #FF8A3C 100%)",
                      }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${p.metricPercent}%` }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{
                        duration: 1.2,
                        delay: 0.3 + i * 0.08,
                        ease: EASE,
                      }}
                    />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
