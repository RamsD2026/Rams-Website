"use client";

import { motion } from "framer-motion";
import {
  Boxes,
  ClipboardCheck,
  TriangleAlert,
  CheckCircle2,
  TrendingUp,
  LayoutGrid,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const CAPS = [
  {
    icon: Boxes,
    title: "Digital Rack Twin",
    body: "Give every rack, row, bay, upright and inspection point a persistent digital identity for traceability across its lifecycle.",
  },
  {
    icon: ClipboardCheck,
    title: "Inspection Intelligence",
    body: "Capture observed damage, photographs, measurements, element type, severity and recommended action in a structured workflow.",
  },
  {
    icon: TriangleAlert,
    title: "RAG Risk Classification",
    body: "Visualise rack condition using Red, Amber and Green severity so teams can focus on the right corrective action first.",
  },
  {
    icon: CheckCircle2,
    title: "Corrective Action Closure",
    body: "Assign, track, verify and close findings with evidence instead of losing actions in spreadsheets, emails and chat threads.",
  },
  {
    icon: TrendingUp,
    title: "Trend & Recurrence Analysis",
    body: "See which rack elements, aisles, zones and operating patterns repeatedly generate damage and safety risk.",
  },
  {
    icon: LayoutGrid,
    title: "Multi-site Visibility",
    body: "Compare rack health, open risks, closure performance and inspection status across warehouses from one management view.",
  },
];

export function IrdsCapabilities() {
  return (
    <section
      id="capabilities"
      className="bg-white pt-28 sm:pt-36 lg:pt-44 pb-28 sm:pb-36 lg:pb-44"
    >
      <style>{`
        @property --irdscap-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .irdscap-card { position: relative; isolation: isolate; }
        .irdscap-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--irdscap-shine-angle),
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
        .irdscap-card:hover::before {
          opacity: 1;
          animation: irdscap-shine 2.4s linear infinite;
        }
        @keyframes irdscap-shine {
          to { --irdscap-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .irdscap-card:hover::before { animation: none; }
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
            From rack inspection <br />
            <span className="text-graphite/50">to rack intelligence.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[15px] text-graphite/65 leading-[1.55] max-w-[880px] mx-auto"
          >
            RAMS turns scattered inspection records, photographs, rack drawings
            and corrective actions into a structured intelligence layer for
            every bay, upright and component.
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
                className="irdscap-card group relative flex flex-col p-8 sm:p-9 bg-white transition-all duration-300 hover:-translate-y-1"
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
                  <Icon className="w-[22px] h-[22px]" strokeWidth={1.75} aria-hidden />
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
