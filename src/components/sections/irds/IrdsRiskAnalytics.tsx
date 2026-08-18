"use client";

import { motion } from "framer-motion";
import { AlertOctagon, AlertTriangle, CheckCircle2, type LucideIcon } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const VIEWS = [
  { label: "Management view", body: "risk by site, row and rack element." },
  { label: "Operations view", body: "what needs action and where." },
  {
    label: "Engineering view",
    body: "finding history, evidence and verification.",
  },
];

const RISKS: {
  tone: "red" | "amber" | "green";
  label: string;
  title: string;
  body: string;
  icon: LucideIcon;
}[] = [
  {
    tone: "red",
    label: "RED",
    title: "Immediate high-priority action",
    body: "Critical damage or unsafe condition requiring immediate control, isolation or replacement as applicable.",
    icon: AlertOctagon,
  },
  {
    tone: "amber",
    label: "AMBER",
    title: "Planned corrective action",
    body: "Damage requiring timely corrective action and controlled monitoring until rectification is completed.",
    icon: AlertTriangle,
  },
  {
    tone: "green",
    label: "GREEN",
    title: "Observe and monitor",
    body: "Minor condition recorded for continued observation, trending and future inspection comparison.",
    icon: CheckCircle2,
  },
];

const KPIS = [
  { label: "Rack health", value: "91%" },
  { label: "Open findings", value: "14" },
  { label: "Critical risks", value: "2" },
  { label: "Closure rate", value: "79%" },
];

const TONE_LIGHT: Record<
  "green" | "amber" | "red",
  { bg: string; color: string; grad: string }
> = {
  green: {
    bg: "rgba(43,168,96,0.12)",
    color: "#1F8A4E",
    grad: "linear-gradient(90deg, rgba(43,168,96,0.07), transparent)",
  },
  amber: {
    bg: "rgba(214,140,20,0.12)",
    color: "#B7770F",
    grad: "linear-gradient(90deg, rgba(214,140,20,0.07), transparent)",
  },
  red: {
    bg: "rgba(200,50,50,0.12)",
    color: "#B0322F",
    grad: "linear-gradient(90deg, rgba(200,50,50,0.07), transparent)",
  },
};

export function IrdsRiskAnalytics() {
  return (
    <>
      {/* ── Rack Health (light) ─────────────────────────── */}
      <section className="relative overflow-hidden bg-white py-24 sm:py-32 lg:py-40">
        <div className="rams-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-2 gap-y-6 items-stretch">
            {/* Copy panel — plain, left-aligned */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, ease: EASE }}
              className="lg:col-span-6"
            >
              <p className="text-[10.5px] font-mono font-bold tracking-[0.22em] uppercase text-signal-orange mb-4">
                Rack Health
              </p>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-carbon leading-[1.04] tracking-[-0.03em]">
                See risk before it{" "}
                <span className="text-signal-orange">becomes downtime.</span>
              </h2>

              <p className="mt-6 text-base sm:text-lg text-graphite/60 leading-[1.65] max-w-[460px]">
                Make rack condition understandable at a glance while preserving
                the detailed evidence behind every finding.
              </p>

              <div className="mt-8 space-y-3">
                {VIEWS.map((v) => (
                  <p
                    key={v.label}
                    className="text-sm text-graphite/75 leading-[1.55]"
                  >
                    <b className="text-carbon font-bold">{v.label}:</b> {v.body}
                  </p>
                ))}
              </div>
            </motion.div>

            {/* Risk list */}
            <div className="lg:col-span-6 flex flex-col gap-3">
              {RISKS.map((r, i) => {
                const s = TONE_LIGHT[r.tone];
                const Icon = r.icon;
                return (
                  <motion.article
                    key={r.label}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.06,
                      ease: EASE,
                    }}
                    className="border border-steel-cool rounded-lg p-5 bg-white"
                  >
                    <div
                      className="inline-flex items-center gap-2.5 text-2xl font-extrabold tracking-[0.14em] mb-4"
                      style={{ color: s.color }}
                    >
                      <Icon className="w-7 h-7" strokeWidth={2.25} aria-hidden />
                      {r.label}
                    </div>

                    <h3 className="text-[15px] font-bold text-carbon leading-[1.3] mb-1.5">
                      {r.title}
                    </h3>
                    <p className="text-[13px] text-graphite/60 leading-[1.55] m-0">
                      {r.body}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Intelligence Layer (dark) ───────────────────── */}
      <section className="irds-il-section relative overflow-hidden pt-16 sm:pt-20 lg:pt-24 pb-0">
        <style>{`
          .irds-il-section{
            background:
              radial-gradient(circle at 78% 22%, rgba(255,106,0,0.22), transparent 16%),
              #0E0E0F;
          }
          .irds-il-section:before{
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
          {/* Sub-header — centered */}
          <div className="max-w-[820px] mx-auto text-center mb-12 sm:mb-16">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45 }}
              className="text-[10.5px] font-mono font-bold tracking-[0.22em] uppercase text-signal-orange mb-4"
            >
              Intelligence Layer
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.04] tracking-[-0.03em]"
            >
              Turn inspection history into{" "}
              <span className="text-signal-orange">operational insight.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-base sm:text-lg text-white/55 leading-[1.65] max-w-[620px] mx-auto"
            >
              Go beyond a static report. Track risk concentration, recurring
              damage, closure performance and rack-health movement over time.
            </motion.p>
          </div>

          {/* Dashboard card — Apple-style mockup bezel */}
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
                  Warehouse Rack Safety Overview
                </div>
                <h3 className="text-xl sm:text-[22px] font-bold text-white leading-[1.15] tracking-[-0.02em] m-0">
                  Pune Distribution Centre
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
                INSPECTION ACTIVE
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
                  <linearGradient id="irds-chart-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#FF6A00" />
                    <stop offset="1" stopColor="#FF6A00" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 1.6, ease: EASE }}
                  d="M0,160 C90,140 140,150 210,120 C300,82 350,105 430,86 C520,65 575,80 650,54 C735,25 790,52 900,34"
                  fill="none"
                  stroke="#FF6A00"
                  strokeWidth="3.5"
                />
                <motion.path
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.22 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 1, delay: 0.9 }}
                  d="M0,160 C90,140 140,150 210,120 C300,82 350,105 430,86 C520,65 575,80 650,54 C735,25 790,52 900,34 L900,220 L0,220 Z"
                  fill="url(#irds-chart-fill)"
                />
              </svg>
            </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
