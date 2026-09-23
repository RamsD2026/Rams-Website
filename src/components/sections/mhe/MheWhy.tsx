"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Warehouse, LineChart, ClipboardCheck } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const AUDIENCES = [
  {
    Icon: ShieldAlert,
    title: "For safety teams",
    tagline: "See the behaviour, not just the incident.",
    body: "Identify unsafe behaviour, review impact events, validate operator access and improve compliance in high-risk zones.",
  },
  {
    Icon: Warehouse,
    title: "For operations teams",
    tagline: "Know where fleet time goes.",
    body: "Understand where fleet time is being spent, reduce idle behaviour and improve throughput using movement-based insights.",
  },
  {
    Icon: ClipboardCheck,
    title: "For supervisors",
    tagline: "Intervene during the shift.",
    body: "Spot unsafe behaviour, congestion and pallet-flow delays during shifts so teams can intervene quickly and keep operations moving.",
  },
  {
    Icon: LineChart,
    title: "For leadership",
    tagline: "One framework, every site.",
    body: "Compare fleet usage, unsafe events and productivity trends across warehouses with a standard monitoring framework.",
  },
];

/**
 * 07 — Built for, in `IrdsWhy`'s card: the centred header, the icon tile,
 * the tagline in orange and the line under it.
 *
 * It was four 460px stock photographs with an orange wash on hover — the
 * only solution page that answers "who is this for" with photography, and
 * the pictures were generic desk-and-warehouse stock that said nothing the
 * headings did not.
 */
export function MheWhy() {
  return (
    <section className="bg-white pt-28 sm:pt-36 lg:pt-44 pb-28 sm:pb-36 lg:pb-44 overflow-hidden">
      <style>{`
        @property --mhewhy-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .mhewhy-card { position: relative; isolation: isolate; }
        .mhewhy-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--mhewhy-shine-angle),
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
        .mhewhy-card:hover::before {
          opacity: 1;
          animation: mhewhy-shine 2.4s linear infinite;
        }
        @keyframes mhewhy-shine {
          to { --mhewhy-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mhewhy-card:hover::before { animation: none; }
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
            Built For
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.85, ease: EASE }}
            className="text-[40px] sm:text-[60px] lg:text-[78px] font-bold text-carbon leading-[1.0] tracking-[-0.04em]"
          >
            MHE safety is operational <br />
            <span className="text-graphite/50">control, not just tracking.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[15px] text-graphite/65 leading-[1.55] max-w-[880px] mx-auto"
          >
            RAMS is the MHE visibility and control layer that supports both
            safety improvement and measurable warehouse productivity — across
            teams and sites.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AUDIENCES.map((aud, i) => (
            <motion.article
              key={aud.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
              className="mhewhy-card group relative flex flex-col p-7 sm:p-8 bg-white transition-all duration-300 hover:-translate-y-1"
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

              <h3 className="text-[21px] sm:text-[23px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
                {aud.title}
              </h3>

              <div className="mt-2 text-[14px] font-semibold text-signal-orange leading-[1.4]">
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
