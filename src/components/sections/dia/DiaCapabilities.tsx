"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BatteryCharging,
  CalendarClock,
  FileClock,
  LineChart,
  TriangleAlert,
} from "lucide-react";

/**
 * Capabilities.
 *
 * The six-card grid the other solution pages use, in the same card
 * treatment — icon tile, hairline, two-layer shadow and the conic orange
 * shine on hover, namespaced to this section.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const CAPS = [
  {
    icon: Activity,
    title: "Live Equipment Health",
    body: "Monitor machine condition across the fleet and understand which assets are healthy, degraded or at risk of failure.",
  },
  {
    icon: BatteryCharging,
    title: "Battery & Charging Intelligence",
    body: "Track charging behaviour, battery condition and readiness to help avoid avoidable interruptions in MHE availability.",
  },
  {
    icon: TriangleAlert,
    title: "Fault & Alert Detection",
    body: "Identify emerging issues, error conditions and abnormal behaviour early so maintenance teams can intervene faster.",
  },
  {
    icon: CalendarClock,
    title: "Preventive Maintenance Planning",
    body: "Use machine health signals, usage patterns and due schedules to plan service work before breakdowns affect operations.",
  },
  {
    icon: FileClock,
    title: "Service History & Traceability",
    body: "Maintain a structured record of equipment service status, maintenance actions, open issues and historical performance.",
  },
  {
    icon: LineChart,
    title: "Operational Intelligence",
    body: "Convert diagnostics, maintenance and utilisation information into dashboards, trends and decision support.",
  },
];

export function DiaCapabilities() {
  return (
    <section
      id="capabilities"
      className="bg-white pt-28 sm:pt-36 lg:pt-44 pb-28 sm:pb-36 lg:pb-44"
    >
      <style>{`
        @property --diacap-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .diacap-card { position: relative; isolation: isolate; }
        .diacap-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--diacap-shine-angle),
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
        .diacap-card:hover::before {
          opacity: 1;
          animation: diacap-shine 2.4s linear infinite;
        }
        @keyframes diacap-shine {
          to { --diacap-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .diacap-card:hover::before { animation: none; }
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
            IMDS
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.85, ease: EASE }}
            className="text-[40px] sm:text-[60px] lg:text-[74px] font-bold text-carbon leading-[1.04] tracking-[-0.04em]"
          >
            From equipment visibility <br />
            <span className="text-graphite/50">to maintenance control.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[15px] text-graphite/65 leading-[1.55] max-w-[880px] mx-auto"
          >
            RAMS connects machine condition, battery performance, service
            activity and operational analysis so teams can understand equipment
            health, act earlier and run more reliable warehouse fleets.
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
                className="diacap-card group relative flex flex-col p-8 sm:p-9 bg-white transition-all duration-300 hover:-translate-y-1"
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
