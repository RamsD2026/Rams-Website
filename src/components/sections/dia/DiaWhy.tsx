"use client";

import { motion } from "framer-motion";
import { ClipboardList, LineChart, TrendingUp, Wrench } from "lucide-react";

/**
 * Who it is for.
 *
 * The four-tile audience grid the other solution pages carry, in the same
 * card treatment with the conic shine namespaced to this section. The source
 * gives a title and a paragraph for each; the tagline is the line that makes
 * the tile scannable.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const AUDIENCES = [
  {
    Icon: ClipboardList,
    title: "Operations teams",
    tagline: "Know what is ready to run.",
    body: "Know which machines are ready, which are at risk and where maintenance issues may affect warehouse continuity.",
  },
  {
    Icon: Wrench,
    title: "Maintenance teams",
    tagline: "Find it before it stops.",
    body: "Improve troubleshooting, detect issues earlier and manage maintenance activity through better equipment intelligence.",
  },
  {
    Icon: LineChart,
    title: "Management",
    tagline: "One framework, every site.",
    body: "Track fleet health, service load, maintenance responsiveness and downtime risk across warehouses using a consistent framework.",
  },
  {
    Icon: TrendingUp,
    title: "Reliability improvement",
    tagline: "More uptime from the same fleet.",
    body: "Use machine and service insights to improve uptime, reduce unplanned failures and make better use of available equipment capacity.",
  },
];

export function DiaWhy() {
  return (
    <section
      id="intelligence"
      className="pt-28 sm:pt-36 lg:pt-44 pb-28 sm:pb-36 lg:pb-44 overflow-hidden"
      style={{ background: "#F5F5F7" }}
    >
      <style>{`
        @property --diawhy-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .diawhy-card { position: relative; isolation: isolate; }
        .diawhy-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--diawhy-shine-angle),
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
        .diawhy-card:hover::before {
          opacity: 1;
          animation: diawhy-shine 2.4s linear infinite;
        }
        @keyframes diawhy-shine {
          to { --diawhy-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .diawhy-card:hover::before { animation: none; }
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
            Operational Value
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.85, ease: EASE }}
            className="text-[40px] sm:text-[60px] lg:text-[74px] font-bold text-carbon leading-[1.04] tracking-[-0.04em]"
          >
            MHE diagnostics is more <br />
            <span className="text-graphite/50">than fault reporting.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[15px] text-graphite/65 leading-[1.55] max-w-[880px] mx-auto"
          >
            RAMS is an intelligence layer that helps organisations understand
            equipment health, service readiness, battery condition and fleet
            performance in one connected system.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {AUDIENCES.map((aud, i) => (
            <motion.article
              key={aud.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
              className="diawhy-card group relative flex flex-col p-7 sm:p-8 bg-white transition-all duration-300 hover:-translate-y-1"
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
                <aud.Icon
                  className="w-[22px] h-[22px] text-signal-orange"
                  strokeWidth={2}
                  aria-hidden
                />
              </div>

              <h3 className="text-[20px] sm:text-[21px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
                {aud.title}
              </h3>

              <div className="mt-2 text-[13.5px] font-semibold text-signal-orange leading-[1.4]">
                {aud.tagline}
              </div>

              <p className="mt-4 text-[14px] text-graphite/65 leading-[1.65]">
                {aud.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
