"use client";

import { motion } from "framer-motion";
import {
  Radar,
  UserCheck,
  Gauge,
  Zap,
  TrendingUp,
  LayoutGrid,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const CAPS = [
  {
    icon: Radar,
    title: "Live MHE Tracking",
    body: "Track each MHE in real time across aisles, docks, staging zones and work areas to understand movement flow, zone occupancy and where operating time is being spent.",
  },
  {
    icon: UserCheck,
    title: "Operator Access Control",
    body: "Allow only authorised operators to use equipment and link every trip, session and safety event to the responsible person for stronger accountability.",
  },
  {
    icon: Gauge,
    title: "Speed & Behaviour Monitoring",
    body: "Monitor overspeeding, harsh movement and zone-level rule violations to improve driving behaviour and reduce unsafe operating practices.",
  },
  {
    icon: Zap,
    title: "Impact & Safety Events",
    body: "Capture impacts, unsafe incidents and location-linked alerts with time, MHE and operator context for faster response and better event analysis.",
  },
  {
    icon: TrendingUp,
    title: "Pallet & Fleet Efficiency",
    body: "Measure trip count, idle time, pallet movement efficiency and fleet utilisation to identify bottlenecks and improve throughput.",
  },
  {
    icon: LayoutGrid,
    title: "Zone & Congestion Intelligence",
    body: "Identify traffic build-up, waiting zones and repeated movement bottlenecks to reduce delays, improve MHE flow and make warehouse operations more efficient.",
  },
];

/**
 * 03 — Capabilities, in the solution pages' card: the centred 40/60/78
 * header, the 12px card on the #E8E8ED hairline with the two-part shadow,
 * the 48px orange-tinted tile, and the conic border shine on hover.
 *
 * It was a 12-column grid of `rounded-lg` cards with a mouse-tracking
 * radial border and a numeral in the corner — a second card system on a page
 * that already had one.
 */
export function MheCapabilities() {
  return (
    <section
      id="capabilities"
      className="bg-white pt-28 sm:pt-36 lg:pt-44 pb-28 sm:pb-36 lg:pb-44"
    >
      <style>{`
        @property --mhecap-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .mhecap-card { position: relative; isolation: isolate; }
        .mhecap-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--mhecap-shine-angle),
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
        .mhecap-card:hover::before {
          opacity: 1;
          animation: mhecap-shine 2.4s linear infinite;
        }
        @keyframes mhecap-shine {
          to { --mhecap-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mhecap-card:hover::before { animation: none; }
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
            Capabilities
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.85, ease: EASE }}
            className="text-[40px] sm:text-[60px] lg:text-[78px] font-bold text-carbon leading-[1.0] tracking-[-0.04em]"
          >
            MHE intelligence for safety, <br />
            <span className="text-graphite/50">utilisation and control.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[15px] text-graphite/65 leading-[1.55] max-w-[880px] mx-auto"
          >
            RAMS brings together tracking, access control, safety monitoring and
            utilisation analytics so warehouse teams can manage MHE fleets with
            more visibility and less guesswork.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAPS.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: (i % 3) * 0.08,
                  ease: EASE,
                }}
                className="mhecap-card group relative flex flex-col p-8 sm:p-9 bg-white transition-all duration-300 hover:-translate-y-1"
                style={{
                  borderRadius: 12,
                  border: "1px solid #E8E8ED",
                  boxShadow:
                    "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  className="w-12 h-12 flex items-center justify-center mb-8 transition-transform duration-300 group-hover:scale-105"
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
                <h3 className="text-[20px] sm:text-[22px] font-semibold text-carbon tracking-[-0.02em] leading-[1.2]">
                  {f.title}
                </h3>
                <p className="mt-3 text-[14.5px] text-graphite/65 leading-[1.6]">
                  {f.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
