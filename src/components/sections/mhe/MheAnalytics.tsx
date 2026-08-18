"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const KPIS = [
  { label: "Active MHEs", value: "18" },
  { label: "Utilisation", value: "76%" },
  { label: "Safety alerts", value: "3" },
  { label: "Trips / Shift", value: "248" },
];

export function MheAnalytics() {
  return (
    <section className="mhe-analytics-section relative overflow-hidden pt-16 sm:pt-20 lg:pt-24 pb-0">
      <style>{`
        .mhe-analytics-section{
          background:
            radial-gradient(circle at 78% 22%, rgba(255,106,0,0.22), transparent 16%),
            #0E0E0F;
        }
        .mhe-analytics-section:before{
          content:"";position:absolute;inset:0;opacity:.55;pointer-events:none;
          background-image:
            linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,.12) 1px, transparent 1px);
          background-size:54px 54px;
          mask-image:linear-gradient(to bottom,black,transparent 88%);
          -webkit-mask-image:linear-gradient(to bottom,black,transparent 88%);
        }
      `}</style>
      <div className="relative rams-container">
        {/* Header — centered */}
        <div className="max-w-[820px] mx-auto text-center mb-12 sm:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45 }}
            className="text-[10.5px] font-mono font-bold tracking-[0.22em] uppercase text-signal-orange mb-4"
          >
            Analytics Layer
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.04] tracking-[-0.03em]"
          >
            See performance trends across{" "}
            <span className="text-signal-orange">fleet, shift and zone.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-base sm:text-lg text-white/55 leading-[1.65] max-w-[620px] mx-auto"
          >
            Go beyond live tracking. Analyse how equipment is being used, where
            unsafe events cluster and which operators or zones need focused
            improvement.
          </motion.p>
        </div>

        {/* Dashboard card — Apple-style bezel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.85, ease: EASE }}
          className="relative rounded-t-[10px] p-[10px] pb-0 bg-carbon"
          style={{
            boxShadow:
              "0 40px 90px -30px rgba(0,0,0,0.6), 0 24px 60px -20px rgba(255,106,0,0.12), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          <div
            className="relative rounded-t-[2px] p-5 sm:p-6 pb-0 overflow-hidden"
            style={{
              background: "linear-gradient(180deg,#071A1F,#041216)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 40px rgba(0,0,0,0.35)",
            }}
          >
            {/* Top */}
            <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
              <div>
                <div className="text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase text-white/45 mb-1.5">
                  MHE Fleet Overview
                </div>
                <h3 className="text-xl sm:text-[22px] font-bold text-white leading-[1.15] tracking-[-0.02em] m-0">
                  Warehouse Operations Dashboard
                </h3>
              </div>
              <span
                className="inline-flex items-center gap-1.5 text-[10.5px] font-mono font-bold tracking-[0.14em] px-2.5 py-1.5 rounded-full"
                style={{
                  background: "rgba(43,203,116,0.13)",
                  color: "#54DE91",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#2BCB74" }}
                />
                SYSTEM ACTIVE
              </span>
            </div>

            {/* KPIs — 4 × span-3 within 12-col */}
            <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-4">
              {KPIS.map((kpi, i) => (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.55,
                    delay: i * 0.05,
                    ease: EASE,
                  }}
                  className="lg:col-span-3 border border-white/8 rounded-[3px] p-3 bg-surface-teal-card"
                >
                  <span className="text-[10px] font-mono font-bold tracking-[0.14em] uppercase text-white/50">
                    {kpi.label}
                  </span>
                  <b className="block text-xl sm:text-2xl font-bold text-white tabular-nums tracking-[-0.02em] mt-1.5">
                    {kpi.value}
                  </b>
                </motion.div>
              ))}
            </div>

            {/* Chart */}
            <div
              className="mt-3 relative overflow-hidden border border-white/8 border-b-0 rounded-none h-[220px]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                backgroundSize: "100% 44px, 72px 100%",
              }}
            >
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 900 220"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="mhe-chart-fill" x1="0" y1="0" x2="0" y2="1">
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
                  strokeWidth="3.5"
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
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 1.6, delay: 0.3, ease: EASE }}
                  d="M0,178 C92,184 160,158 220,164 C310,172 360,122 450,128 C560,136 590,92 660,98 C780,108 820,84 900,76"
                  fill="none"
                  stroke="#46A7FF"
                  strokeWidth="3"
                />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
