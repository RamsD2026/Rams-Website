"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const KPIS = [
  { label: "Active MHEs", value: "18" },
  { label: "Utilisation", value: "76%" },
  { label: "Safety alerts", value: "3" },
  { label: "Trips / shift", value: "248" },
];

/**
 * 06 — The analytics layer.
 *
 * The dashboard is kept; its ground and header are not. The section now runs
 * the solution pages' dark stack — the #1D1D1F → #08080A radial, the orange
 * glow at `60% 60% at 50% 20%` and the 72px grid at 6% masked out through
 * the lower third — in place of the flat #0E0E0F with a 54px grid at 55%,
 * and the header is the centred 40/60/78 the other sections carry.
 *
 * The frame is the platform pages' dark chrome rather than the teal bezel.
 */
export function MheAnalytics() {
  return (
    <section className="relative overflow-hidden text-white">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 100% at 50% 0%, #1D1D1F 0%, #0E0E0F 55%, #08080A 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[720px]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 20%, rgba(255,106,0,0.22), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
        }}
      />

      <div className="relative rams-container pt-28 sm:pt-36 lg:pt-44 pb-28 sm:pb-36 lg:pb-44">
        <div className="max-w-[900px] mx-auto text-center mb-16 sm:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange mb-5"
          >
            Analytics layer
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.85, ease: EASE }}
            className="text-[40px] sm:text-[60px] lg:text-[78px] font-bold leading-[1.0] tracking-[-0.04em] text-white"
          >
            See performance across <br />
            <span
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.35) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              fleet, shift and zone.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[15px] text-white/60 leading-[1.55] max-w-[880px] mx-auto"
          >
            Go beyond live tracking. Analyse how equipment is being used, where
            unsafe events cluster and which operators or zones need focused
            improvement.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.85, ease: EASE }}
          className="max-w-[1080px] mx-auto overflow-hidden"
          style={{
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.02)",
            boxShadow: "0 40px 120px -40px rgba(0,0,0,0.6)",
          }}
        >
          {/* chrome */}
          <div
            className="flex items-center gap-2 px-5 h-11"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            <span className="ml-3 text-[11px] font-mono font-semibold tracking-[0.16em] uppercase text-white/45">
              MHE fleet overview
            </span>
            <span
              className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-[0.14em] uppercase px-2.5 py-1 rounded-full"
              style={{ background: "rgba(46,158,91,0.16)", color: "#57C98A" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#2E9E5B" }}
              />
              System active
            </span>
          </div>

          <div className="p-5 sm:p-7">
            <h3 className="text-[20px] sm:text-[22px] font-bold text-white leading-[1.15] tracking-[-0.02em]">
              Warehouse operations dashboard
            </h3>

            <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
              {KPIS.map((kpi, i) => (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.55, delay: i * 0.05, ease: EASE }}
                  className="p-4"
                  style={{
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-white/45">
                    {kpi.label}
                  </span>
                  <b className="block mt-2 text-[24px] sm:text-[28px] font-bold text-white tabular-nums tracking-[-0.03em] leading-none">
                    {kpi.value}
                  </b>
                </motion.div>
              ))}
            </div>

            {/* the two traces: utilisation over the shift, and safety events */}
            <div
              className="mt-3 relative overflow-hidden h-[220px]"
              style={{
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.08)",
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                backgroundSize: "100% 44px, 72px 100%",
              }}
            >
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 900 220"
                preserveAspectRatio="none"
                aria-hidden
              >
                <defs>
                  <linearGradient
                    id="mhe-chart-fill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0" stopColor="#FF6A00" />
                    <stop offset="1" stopColor="#FF6A00" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 1.6, ease: EASE }}
                  d="M0,160 C70,150 120,140 190,116 C255,94 320,104 400,80 C470,60 545,66 620,48 C690,32 780,44 900,22"
                  fill="none"
                  stroke="#FF6A00"
                  strokeWidth="3"
                />
                <motion.path
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.22 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 1, delay: 0.9 }}
                  d="M0,160 C70,150 120,140 190,116 C255,94 320,104 400,80 C470,60 545,66 620,48 C690,32 780,44 900,22 L900,220 L0,220 Z"
                  fill="url(#mhe-chart-fill)"
                />
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.5 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 1.6, delay: 0.3, ease: EASE }}
                  d="M0,178 C92,184 160,158 220,164 C310,172 360,122 450,128 C560,136 590,92 660,98 C780,108 820,84 900,76"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeDasharray="6 7"
                />
              </svg>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="inline-flex items-center gap-2 text-[11.5px] text-white/55">
                <span
                  aria-hidden
                  className="w-4 h-0.5 rounded-full"
                  style={{ background: "#FF6A00" }}
                />
                Fleet utilisation
              </span>
              <span className="inline-flex items-center gap-2 text-[11.5px] text-white/55">
                <span
                  aria-hidden
                  className="w-4 h-0.5 rounded-full"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, rgba(255,255,255,0.6) 0 3px, transparent 3px 6px)",
                  }}
                />
                Safety events
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
