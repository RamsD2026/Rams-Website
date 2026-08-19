"use client";

import { motion } from "framer-motion";
import { BarChart3, Route, Layers3 } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const BENEFITS = [
  {
    n: "01",
    Icon: BarChart3,
    title: "Measure pallet movement frequency",
    body: "See how many times each pallet is moved over a day, shift or selected period. High-frequency movement can reveal fast-moving inventory, unnecessary re-handling and avoidable touchpoints.",
  },
  {
    n: "02",
    Icon: Route,
    title: "Understand where every pallet moves",
    body: "Track the sequence of locations a pallet passes through during the day — from storage to staging, picking, dispatch or another rack position — to identify inefficient movement patterns.",
  },
  {
    n: "03",
    Icon: Layers3,
    title: "Smarter Storage Height Decisions",
    body: "Frequently accessed A-class inventory can be evaluated for lower, faster-to-reach storage positions, while slower-moving stock can be considered for higher levels — supporting safer and more efficient slotting decisions.",
  },
];

export function InvATOS() {
  return (
    <section
      id="atos-abc"
      className="relative overflow-hidden bg-[#F5F5F7] pt-28 sm:pt-36 lg:pt-44 pb-28 sm:pb-36 lg:pb-44"
    >
      {/* subtle orange corner glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-0 w-[720px] h-[720px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,106,0,0.10), transparent 70%)",
        }}
      />

      <div className="relative rams-container">
        {/* ─── Header ─────────────────────────────────────────── */}
        <div className="max-w-[1180px] mx-auto text-center mb-20 sm:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange mb-5"
          >
            ATOS + ABC Inventory Intelligence
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.85, ease: EASE }}
            className="text-[36px] sm:text-[54px] lg:text-[68px] font-bold text-carbon leading-[1.05] tracking-[-0.04em]"
          >
            <span className="block whitespace-nowrap">
              Turn pallet movement history
            </span>
            <span className="block whitespace-nowrap text-graphite/50">
              into smarter warehouse decisions.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[15px] text-graphite/65 leading-[1.55] max-w-[880px] mx-auto"
          >
            ABC analysis tells you which inventory deserves the most attention.
            When that priority data is combined with ATOS movement
            intelligence, RAMS can show how pallets actually move through the
            warehouse — and where travel, handling and storage decisions can
            be improved.
          </motion.p>
        </div>

        {/* ─── Intro card: sub-h3 + paragraph + equation callout ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, ease: EASE }}
          className="relative max-w-[1240px] mx-auto mb-6 lg:mb-8 p-8 sm:p-10 lg:p-12 bg-white"
          style={{
            borderRadius: 28,
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.02), 0 30px 80px -30px rgba(0,0,0,0.15)",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-14 items-center">
            {/* LEFT — headline + description */}
            <div>
              <div className="inline-flex items-center gap-2 mb-5">
                <span className="w-[7px] h-[7px] rounded-full bg-signal-orange" />
                <span className="text-[10.5px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange">
                  From classification to optimisation
                </span>
              </div>
              <h3 className="text-[26px] sm:text-[32px] lg:text-[36px] font-bold text-carbon leading-[1.15] tracking-[-0.02em]">
                Know which pallets matter — and how efficiently they are being
                handled.
              </h3>
              <p className="mt-5 text-[15px] sm:text-[16px] text-graphite/70 leading-[1.7]">
                ATOS adds the movement layer to ABC analysis: how often a
                pallet moves, where it travels and how efficiently it is
                stored and handled.
              </p>
            </div>

            {/* RIGHT — equation callout, simple */}
            <div
              className="flex flex-col justify-center p-7 sm:p-8"
              style={{
                borderRadius: 22,
                background:
                  "linear-gradient(180deg, #0F0F11 0%, #1A1A1D 100%)",
                boxShadow: "0 30px 60px -30px rgba(0,0,0,0.35)",
              }}
            >
              <div className="text-[17px] sm:text-[19px] font-bold text-white tracking-[-0.01em] leading-[1.35]">
                ABC Priority{" "}
                <span className="text-signal-orange">+</span> Pallet Movement{" "}
                <span className="text-signal-orange">+</span> Task Intelligence
              </div>
              <p className="mt-3 text-[13.5px] text-white/60 leading-[1.6]">
                Creates a practical basis for smarter pallet placement, MHE
                movement and storage decisions.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ─── Chapter divider ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="max-w-[1240px] mx-auto mt-16 sm:mt-20 mb-10 sm:mb-12 flex items-center gap-5"
        >
          <span className="text-[10.5px] font-mono font-bold tracking-[0.22em] uppercase text-signal-orange shrink-0">
            What ATOS unlocks
          </span>
          <span
            aria-hidden
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,106,0,0.35) 0%, rgba(0,0,0,0.08) 40%, transparent 100%)",
            }}
          />
        </motion.div>

        {/* ─── 3 benefit cards ────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[1240px] mx-auto">
          {BENEFITS.map((b, i) => (
            <motion.article
              key={b.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
              className="group relative flex flex-col p-8 sm:p-9 bg-white transition-all duration-300"
              style={{
                minHeight: 340,
                borderRadius: 24,
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
              }}
            >
              {/* icon + number row */}
              <div className="flex items-center justify-between mb-8">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "rgba(255,106,0,0.08)",
                    border: "1px solid rgba(255,106,0,0.18)",
                  }}
                >
                  <b.Icon
                    className="w-[22px] h-[22px] text-signal-orange"
                    strokeWidth={2}
                  />
                </div>
                <div className="text-[11px] font-mono font-bold tracking-[0.22em] uppercase text-graphite/40">
                  {b.n}
                </div>
              </div>

              <h3 className="text-[22px] sm:text-[24px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
                {b.title}
              </h3>
              <p className="mt-4 text-[14.5px] text-graphite/65 leading-[1.65]">
                {b.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
