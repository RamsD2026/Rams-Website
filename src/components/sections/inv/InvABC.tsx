"use client";

import { motion } from "framer-motion";
import { Boxes, Map, Clock, TriangleAlert } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const INSIGHTS = [
  { label: "Analyse by", value: "SKU / Category", Icon: Boxes },
  { label: "Compare by", value: "Site / Zone", Icon: Map },
  { label: "Track with", value: "Aging", Icon: Clock },
  { label: "Act on", value: "Exceptions", Icon: TriangleAlert },
];

const CLASSES = [
  {
    letter: "A",
    tier: "Tier 1 · Highest priority",
    title: "High-value / Critical Inventory",
    body: "Items requiring the strongest visibility and tighter operational control because they contribute the highest value or business impact.",
    bullets: [
      "Higher cycle-count frequency",
      "Stricter location accuracy",
      "Closer aging & exception monitoring",
    ],
    control: 3,
    swatch: {
      bg: "linear-gradient(135deg, #FFE1CC 0%, #FFC79A 100%)",
      fg: "#B14700",
      accent: "#FF6A00",
    },
  },
  {
    letter: "B",
    tier: "Tier 2 · Balanced control",
    title: "Moderate-value Inventory",
    body: "Items that need balanced control — regular verification and replenishment visibility without the same intensity as A-class inventory.",
    bullets: [
      "Periodic cycle counting",
      "Movement & dwell-time monitoring",
      "Exception-based review",
    ],
    control: 2,
    swatch: {
      bg: "linear-gradient(135deg, #DDEAFF 0%, #B3D0FF 100%)",
      fg: "#1F5CB2",
      accent: "#4A8BE8",
    },
  },
  {
    letter: "C",
    tier: "Tier 3 · Simplified control",
    title: "Lower-value / High-volume Inventory",
    body: "Items that may represent a larger number of SKUs but comparatively lower inventory value, allowing simpler control policies.",
    bullets: [
      "Simplified counting strategy",
      "Bulk movement visibility",
      "Space & replenishment optimisation",
    ],
    control: 1,
    swatch: {
      bg: "linear-gradient(135deg, #D4F1E1 0%, #A4E2BE 100%)",
      fg: "#146F42",
      accent: "#2FA76A",
    },
  },
];

export function InvABC() {
  return (
    <section
      id="abc-analysis"
      className="relative overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(90% 100% at 50% 0%, #1D1D1F 0%, #0E0E0F 60%, #08080A 100%)",
      }}
    >
      {/* orange corner glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-0 w-[720px] h-[720px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,106,0,0.14), transparent 70%)",
        }}
      />
      {/* fine grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
        }}
      />

      <div className="relative rams-container pt-28 sm:pt-36 lg:pt-44 pb-28 sm:pb-36 lg:pb-44">
        {/* ─── Header ─────────────────────────────────────────── */}
        <div className="max-w-[900px] mx-auto text-center mb-20 sm:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange mb-5"
          >
            ABC Inventory Analysis
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.85, ease: EASE }}
            className="text-[40px] sm:text-[60px] lg:text-[78px] font-bold leading-[1.0] tracking-[-0.04em]"
          >
            <span className="text-white">Focus attention</span> <br />
            <span
              className="whitespace-nowrap"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.35) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              where value matters most.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[15px] text-white/60 leading-[1.55] max-w-[880px] mx-auto"
          >
            Classify inventory into A, B and C categories using consumption
            value, movement and business criticality — so teams apply the
            right level of control, cycle counting and replenishment
            attention.
          </motion.p>
        </div>

        {/* ─── The 3 Classes (the meaning) ────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 max-w-[1240px] mx-auto mb-20 sm:mb-24">
          {CLASSES.map((c, i) => (
            <motion.article
              key={c.letter}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.75,
                delay: 0.05 + i * 0.1,
                ease: EASE,
              }}
              className="group relative flex flex-col overflow-hidden"
              style={{
                borderRadius: 28,
                border: "1px solid rgba(255,255,255,0.08)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)",
                backdropFilter: "blur(20px)",
                boxShadow:
                  "0 40px 100px -40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              {/* Accent top bar */}
              <div
                aria-hidden
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: c.swatch.accent }}
              />

              <div className="flex flex-col flex-1 p-8 sm:p-10">
                {/* Letter + tier label */}
                <div className="flex items-center gap-4 mb-8">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center font-extrabold text-[28px] shrink-0"
                    style={{
                      background: c.swatch.bg,
                      color: c.swatch.fg,
                    }}
                  >
                    {c.letter}
                  </div>
                  <div className="min-w-0">
                    <div
                      className="text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase"
                      style={{ color: c.swatch.accent }}
                    >
                      {c.tier}
                    </div>
                    {/* Control intensity dots */}
                    <div className="flex items-center gap-1.5 mt-2">
                      {[1, 2, 3].map((n) => (
                        <span
                          key={n}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            background:
                              n <= c.control
                                ? c.swatch.accent
                                : "rgba(255,255,255,0.12)",
                          }}
                        />
                      ))}
                      <span className="ml-1.5 text-[10px] font-mono uppercase tracking-[0.14em] text-white/40">
                        Control intensity
                      </span>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-[22px] sm:text-[24px] font-bold text-white leading-[1.2] tracking-[-0.02em]">
                  {c.title}
                </h3>
                <p className="mt-4 text-[14.5px] text-white/60 leading-[1.65]">
                  {c.body}
                </p>

                {/* Bullets */}
                <ul className="mt-8 pt-8 space-y-3 border-t border-white/[0.06]">
                  {c.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-3 text-[13.5px] text-white/75 leading-[1.5]"
                    >
                      <span
                        aria-hidden
                        className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: c.swatch.accent }}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>

        {/* ─── Chapter divider ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="max-w-[1240px] mx-auto mb-12 sm:mb-14 flex items-center gap-5"
        >
          <span className="text-[10.5px] font-mono font-bold tracking-[0.22em] uppercase text-signal-orange shrink-0">
            How RAMS applies it
          </span>
          <span
            aria-hidden
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,106,0,0.4) 0%, rgba(255,255,255,0.06) 40%, transparent 100%)",
            }}
          />
        </motion.div>

        {/* ─── Priority-led control (the "how") ───────────────── */}
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left — intro + formula (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="lg:col-span-7 p-8 sm:p-10 lg:p-12"
            style={{
              borderRadius: 28,
              border: "1px solid rgba(255,255,255,0.08)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
              backdropFilter: "blur(20px)",
              boxShadow:
                "0 40px 100px -40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="w-[7px] h-[7px] rounded-full bg-signal-orange" />
              <span className="text-[10.5px] font-mono font-semibold tracking-[0.22em] uppercase text-white/70">
                Priority-led control
              </span>
            </div>
            <h3 className="text-[26px] sm:text-[32px] lg:text-[36px] font-bold text-white leading-[1.15] tracking-[-0.02em] max-w-[520px]">
              Not every SKU needs the same level of attention.
            </h3>
            <p className="mt-5 text-[15px] sm:text-[16px] text-white/60 leading-[1.7] max-w-[560px]">
              RAMS can combine inventory value, usage frequency, dwell time
              and stock movement to identify which items require tighter
              monitoring and which can be managed with simpler controls.
            </p>

            {/* Formula box */}
            <div
              className="mt-8 p-6 sm:p-7"
              style={{
                borderRadius: 18,
                border: "1px solid rgba(255,106,0,0.22)",
                background:
                  "linear-gradient(180deg, rgba(255,106,0,0.08) 0%, rgba(255,106,0,0.02) 100%)",
              }}
            >
              <div className="text-[10.5px] font-mono font-bold tracking-[0.22em] uppercase text-signal-orange mb-3">
                Typical basis
              </div>
              <div className="text-[17px] sm:text-[20px] font-semibold text-white leading-[1.4] tracking-[-0.01em]">
                Annual Consumption Value ={" "}
                <span className="text-signal-orange">Annual Usage</span> ×{" "}
                <span className="text-signal-orange">Unit Cost</span>
              </div>
              <div className="mt-3 text-[12.5px] text-white/55 leading-[1.55]">
                Classification thresholds are configurable to match your
                organisation&apos;s inventory policy.
              </div>
            </div>
          </motion.div>

          {/* Right — 4 KPI insights (5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="lg:col-span-5 flex flex-col p-8 sm:p-10"
            style={{
              borderRadius: 28,
              border: "1px solid rgba(255,255,255,0.08)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
              backdropFilter: "blur(20px)",
              boxShadow:
                "0 40px 100px -40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            <div className="mb-6">
              <div className="text-[10.5px] font-mono font-semibold tracking-[0.22em] uppercase text-white/50 mb-2">
                Operating levers
              </div>
              <div className="text-[16px] text-white/70 leading-[1.5]">
                Four ways RAMS turns classification into daily action.
              </div>
            </div>

            <div className="grid grid-cols-2 auto-rows-fr gap-3 sm:gap-4 flex-1">
              {INSIGHTS.map((k, i) => (
                <motion.div
                  key={k.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2 + i * 0.06,
                    ease: EASE,
                  }}
                  className="flex flex-col justify-between p-5 sm:p-6 min-h-[150px]"
                  style={{
                    borderRadius: 16,
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.025)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background: "rgba(255,106,0,0.10)",
                      border: "1px solid rgba(255,106,0,0.20)",
                    }}
                  >
                    <k.Icon className="w-[18px] h-[18px] text-signal-orange" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-white/45">
                      {k.label}
                    </div>
                    <div className="mt-1.5 text-[15px] sm:text-[16px] font-semibold text-white leading-[1.25] tracking-[-0.01em]">
                      {k.value}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
