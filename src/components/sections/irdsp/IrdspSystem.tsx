"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, SURFACE } from "./irdsp-shared";

/** Raw capture flowing into IRDS. */
const INPUTS = [
  { k: "bay", v: "B-024", dot: "#FF9B4D" },
  { k: "upright", v: "U-024-03", dot: "#FF9B4D" },
  { k: "checkpoint", v: "plumbness", dot: "#77BDFF" },
  { k: "reading", v: "8.4 mm", dot: "#77BDFF" },
  { k: "photo", v: "3 attached", dot: "#C7A6FF" },
  { k: "tpi", v: "finding logged", dot: "#54DE91" },
  { k: "cycle", v: "Q3 annual", dot: "#54DE91" },
  { k: "drawing", v: "LARC rev-4", dot: "#C7A6FF" },
];

/** Structured output leaving IRDS. */
const OUTPUTS = [
  "[ FINDING ] U-024-03 out of tolerance",
  "[ TEST ] G1 plumbness · 8.4mm vs 6.0mm",
  "[ SEVERITY ] critical · bay offloaded",
  "[ ACTION ] replace upright · due 19 Aug",
  "[ VERIFIED ] re-inspection passed",
  "[ REPORT ] annexure published v2",
];

/** The four quadrant panels. */
const PANELS = [
  {
    n: "01",
    title: "Inspection",
    items: ["Checkpoints", "Observations", "Findings", "TPI findings"],
    pos: "lg:left-0 lg:top-0",
  },
  {
    n: "02",
    title: "Testing",
    items: ["Integrity tests", "Readings", "Thresholds", "Results"],
    pos: "lg:left-0 lg:bottom-0",
  },
  {
    n: "03",
    title: "Issues & Actions",
    items: ["Severity", "Call to action", "Maintenance", "Escalation"],
    pos: "lg:right-0 lg:top-0",
  },
  {
    n: "04",
    title: "Evidence",
    items: ["Rack health", "Compliance", "Reports", "History"],
    pos: "lg:right-0 lg:bottom-0",
  },
];

const AXES = [
  { label: "Structured", cls: "left-1/2 -translate-x-1/2 top-2" },
  { label: "Traceable", cls: "left-2 top-1/2 -translate-y-1/2" },
  { label: "Evidence", cls: "right-2 top-1/2 -translate-y-1/2" },
  { label: "Closed-loop", cls: "left-1/2 -translate-x-1/2 bottom-2" },
];

export function IrdspSystem() {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{ background: SURFACE.ink }}
    >
      <style>{`
        @keyframes irdsp-in {
          0%   { transform: translateX(0) scale(1); opacity: 0; }
          12%  { opacity: 1; }
          78%  { opacity: 1; }
          100% { transform: translateX(var(--travel)) scale(0.82); opacity: 0; }
        }
        @keyframes irdsp-out {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes irdsp-pulse {
          0%,100% { transform: scale(1);   opacity: 0.55; }
          50%     { transform: scale(1.12); opacity: 0.15; }
        }
        .irdsp-in   { animation: irdsp-in 7s linear infinite; }
        .irdsp-out  { animation: irdsp-out 34s linear infinite; }
        .irdsp-ring { animation: irdsp-pulse 4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .irdsp-in, .irdsp-out, .irdsp-ring { animation: none; }
          .irdsp-in { opacity: 1; }
        }
      `}</style>

      <div className="relative rams-container pt-28 sm:pt-36 lg:pt-44 pb-28 sm:pb-36 lg:pb-44">
        <SectionHeader
          tone="dark"
          eyebrow="The system"
          top="Raw observation in."
          bottom="Engineering evidence out."
          body="Everything captured on the floor resolves into one structured record — and everything the business needs comes back out of it."
        />

        <div className="relative max-w-[1240px] mx-auto">
          {/* ── the core ──────────────────────────────────── */}
          <div className="relative h-[420px] sm:h-[480px] flex items-center justify-center">
            {/* rings */}
            {[300, 230, 165].map((size, i) => (
              <span
                key={size}
                aria-hidden
                className="irdsp-ring absolute rounded-full"
                style={{
                  width: size,
                  height: size,
                  border: "1px solid rgba(255,106,0,0.20)",
                  animationDelay: `${i * 0.7}s`,
                }}
              />
            ))}

            {/* glow */}
            <span
              aria-hidden
              className="absolute rounded-full"
              style={{
                width: 260,
                height: 260,
                background:
                  "radial-gradient(closest-side, rgba(255,106,0,0.28), transparent 70%)",
              }}
            />

            {/* core */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="relative z-10 w-[150px] h-[150px] rounded-full flex flex-col items-center justify-center"
              style={{
                background:
                  "radial-gradient(circle at 50% 35%, #2A1608 0%, #120A04 70%)",
                border: "1px solid rgba(255,106,0,0.42)",
                boxShadow: "0 0 70px -10px rgba(255,106,0,0.55)",
              }}
            >
              <span className="text-[9px] font-mono font-bold tracking-[0.28em] uppercase text-white/40">
                Rack
              </span>
              <span className="mt-1 text-[26px] font-bold tracking-[-0.02em]">
                IRDS
              </span>
              <span className="mt-1 text-[9px] font-mono tracking-[0.18em] uppercase text-signal-orange">
                Live
              </span>
            </motion.div>

            {/* axis labels */}
            {AXES.map((a) => (
              <span
                key={a.label}
                className={
                  "absolute text-[10px] font-mono font-bold tracking-[0.22em] uppercase text-white/30 " +
                  a.cls
                }
              >
                {a.label}
              </span>
            ))}

            {/* inputs streaming in from the left */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-1/2 hidden sm:block overflow-hidden"
            >
              {INPUTS.map((c, i) => (
                <span
                  key={c.v}
                  className="irdsp-in absolute inline-flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap"
                  style={{
                    top: `${8 + i * 11.5}%`,
                    left: 0,
                    ["--travel" as string]: "calc(50vw - 120px)",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    animationDelay: `${i * 0.85}s`,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: c.dot }}
                  />
                  <span className="text-[11px] font-mono text-white/40">
                    {c.k}:
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-white/80">
                    {c.v}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* ── outputs streaming out on the right ─────────── */}
          <div
            className="relative overflow-hidden mt-2"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="irdsp-out flex w-max py-4">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
                  {OUTPUTS.map((o) => (
                    <span key={copy + o} className="flex items-center shrink-0">
                      <span className="text-signal-orange text-[11px] mr-3">
                        &rsaquo;
                      </span>
                      <span className="text-[12px] font-mono text-white/55 whitespace-nowrap">
                        {o}
                      </span>
                      <span className="w-10 shrink-0" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-24"
              style={{ background: "linear-gradient(to right, #08080A, transparent)" }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-24"
              style={{ background: "linear-gradient(to left, #08080A, transparent)" }}
            />
          </div>

          {/* ── quadrant panels ───────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
            {PANELS.map((p, i) => (
              <motion.div
                key={p.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
                className="px-5 py-5"
                style={{
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex items-center gap-2.5 pb-3 mb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <span className="text-[9.5px] font-mono font-bold tabular-nums text-signal-orange">
                    {p.n}
                  </span>
                  <span className="text-[10.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/70">
                    {p.title}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {p.items.map((it) => (
                    <span key={it} className="flex items-center gap-2.5">
                      <span
                        className="w-1 h-1 rounded-full shrink-0"
                        style={{ background: "rgba(255,106,0,0.7)" }}
                      />
                      <span className="text-[12.5px] text-white/55">{it}</span>
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
