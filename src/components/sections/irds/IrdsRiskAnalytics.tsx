"use client";

import { motion } from "framer-motion";
import { AlertOctagon, AlertTriangle, CheckCircle2, type LucideIcon } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const KPIS = [
  { label: "Rack Health", value: "91%" },
  { label: "Open Findings", value: "14" },
  { label: "Critical Risks", value: "2" },
  { label: "Closure Rate", value: "79%" },
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

const RAG_TONES: Record<"red" | "amber" | "green", { bg: string; color: string; dot: string }> = {
  red: { bg: "rgba(255,77,77,0.13)", color: "#FF8A8A", dot: "#FF4D4D" },
  amber: { bg: "rgba(255,176,32,0.14)", color: "#FFC773", dot: "#FFB020" },
  green: { bg: "rgba(43,203,116,0.13)", color: "#54DE91", dot: "#2BCB74" },
};

export function IrdsRiskAnalytics() {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(80% 100% at 50% 100%, #1D1D1F 0%, #0E0E0F 60%, #08080A 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(to top, black 0%, black 70%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to top, black 0%, black 70%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 w-[720px] h-[720px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,106,0,0.18), transparent 70%)",
        }}
      />

      <div className="relative rams-container pt-28 sm:pt-36 lg:pt-44 pb-0">
        <div className="max-w-[1180px] mx-auto text-center mb-16 sm:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange mb-5"
          >
            Rack Health Analytics
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.85, ease: EASE }}
            className="text-[36px] sm:text-[54px] lg:text-[68px] font-bold leading-[1.05] tracking-[-0.04em]"
          >
            <span className="block text-white">
              See rack risk before it
            </span>
            <span
              className="block"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.35) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              becomes downtime.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[15px] text-white/60 leading-[1.55] max-w-[880px] mx-auto"
          >
            Go beyond a static inspection report. Track risk concentration,
            recurring damage, closure performance and rack-health movement
            across sites — with detailed evidence behind every finding.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1, ease: EASE }}
          className="relative mx-auto"
          style={{
            maxWidth: 1240,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            borderLeft: "1px solid rgba(255,255,255,0.08)",
            borderRight: "1px solid rgba(255,255,255,0.08)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
            padding: "14px 14px 0",
            boxShadow:
              "0 -20px 80px -20px rgba(255,106,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="relative overflow-hidden"
            style={{
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              background:
                "linear-gradient(180deg, #0A0F14 0%, #06090C 100%)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              borderRight: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-center justify-between gap-4 flex-wrap p-6 sm:p-8 pb-4">
              <div>
                <div className="text-[10.5px] font-mono font-bold tracking-[0.22em] uppercase text-white/45 mb-1.5">
                  Warehouse Rack Safety Overview
                </div>
                <h3 className="text-[20px] sm:text-[24px] font-bold text-white leading-[1.15] tracking-[-0.02em]">
                  Pune Distribution Centre
                </h3>
              </div>
              <span
                className="inline-flex items-center gap-1.5 text-[10.5px] font-mono font-bold tracking-[0.14em] px-3 py-1.5 rounded-full"
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

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-6 sm:px-8">
              {KPIS.map((k, i) => (
                <motion.div
                  key={k.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.06,
                    ease: EASE,
                  }}
                  className="p-4 rounded-xl"
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
                  }}
                >
                  <span className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-white/45">
                    {k.label}
                  </span>
                  <b className="block text-[24px] sm:text-[28px] font-bold text-white tabular-nums tracking-[-0.025em] mt-1.5">
                    {k.value}
                  </b>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 px-6 sm:px-8 mt-4">
              {RISKS.map((r, i) => {
                const s = RAG_TONES[r.tone];
                const Icon = r.icon;
                return (
                  <motion.article
                    key={r.label}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.55, delay: 0.1 + i * 0.06, ease: EASE }}
                    className="p-4 rounded-xl"
                    style={{
                      border: "1px solid rgba(255,255,255,0.08)",
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded-md"
                        style={{ background: s.bg, color: s.color }}
                      >
                        <Icon className="w-3.5 h-3.5" strokeWidth={2.25} aria-hidden />
                      </span>
                      <span
                        className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase"
                        style={{ color: s.color }}
                      >
                        {r.label}
                      </span>
                    </div>
                    <h4 className="text-[14px] font-bold text-white leading-[1.3] tracking-[-0.01em]">
                      {r.title}
                    </h4>
                    <p className="mt-1.5 text-[12.5px] text-white/55 leading-[1.55]">
                      {r.body}
                    </p>
                  </motion.article>
                );
              })}
            </div>

            <div
              className="mt-5 mx-6 sm:mx-8 relative overflow-hidden"
              style={{
                height: 260,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                borderLeft: "1px solid rgba(255,255,255,0.06)",
                borderRight: "1px solid rgba(255,255,255,0.06)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.02), transparent)",
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                backgroundSize: "100% 48px, 72px 100%",
              }}
            >
              <div className="absolute top-4 left-4 flex items-center gap-4 z-10">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-white/60">
                  <span className="w-2 h-2 rounded-full bg-signal-orange" />
                  Rack health
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-white/60">
                  <span className="w-2 h-2 rounded-full bg-white/40" />
                  Baseline
                </div>
              </div>
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 900 260"
                preserveAspectRatio="none"
                aria-hidden
              >
                <defs>
                  <linearGradient id="irds-chart-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#FF6A00" stopOpacity="0.35" />
                    <stop offset="1" stopColor="#FF6A00" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.4 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 1.4, ease: EASE }}
                  d="M0,150 L900,150"
                  fill="none"
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                />
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 1.8, delay: 0.2, ease: EASE }}
                  d="M0,180 C90,165 140,175 210,145 C300,105 350,130 430,105 C520,82 575,98 650,68 C735,38 790,62 900,52"
                  fill="none"
                  stroke="#FF6A00"
                  strokeWidth="3"
                />
                <motion.path
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 1, delay: 1.2 }}
                  d="M0,180 C90,165 140,175 210,145 C300,105 350,130 430,105 C520,82 575,98 650,68 C735,38 790,62 900,52 L900,260 L0,260 Z"
                  fill="url(#irds-chart-fill)"
                />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
