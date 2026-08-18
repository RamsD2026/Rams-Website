"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export function InvFeaturePanels() {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(80% 100% at 50% 0%, #1D1D1F 0%, #0E0E0F 60%, #08080A 100%)",
      }}
    >
      {/* subtle orange glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 20%, rgba(255,106,0,0.16), transparent 70%)",
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
        {/* Header */}
        <div className="max-w-[900px] mx-auto text-center mb-20 sm:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange mb-5"
          >
            Concepts
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.85, ease: EASE }}
            className="text-[40px] sm:text-[60px] lg:text-[78px] font-bold leading-[1.0] tracking-[-0.04em]"
          >
            <span className="text-white">Two ideas.</span> <br />
            <span
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.35) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              One live system of record.
            </span>
          </motion.h2>
        </div>

        {/* Two panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1240px] mx-auto">
          {/* Panel 1 — AI Vision Counting */}
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: EASE }}
            className="relative overflow-hidden p-9 sm:p-11 flex flex-col"
            style={{
              minHeight: 520,
              borderRadius: 28,
              border: "1px solid rgba(255,255,255,0.08)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.01) 100%)",
              backdropFilter: "blur(20px)",
              boxShadow:
                "0 40px 100px -40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="w-[7px] h-[7px] rounded-full bg-signal-orange" />
              <span className="text-[10.5px] font-mono font-semibold tracking-[0.22em] uppercase text-white/70">
                AI Vision Counting
              </span>
            </div>
            <h3 className="text-[28px] sm:text-[34px] font-bold text-white leading-[1.1] tracking-[-0.025em] max-w-[440px]">
              Every camera becomes an inventory sensor.
            </h3>
            <p className="mt-4 text-[15.5px] text-white/60 leading-[1.65] max-w-[460px]">
              Recognise cases, pallets and totes in real time — no barcodes,
              no operator input. Continuous verification replaces scheduled
              cycle counts.
            </p>

            {/* mini viz — camera detection overlay */}
            <div
              className="mt-auto relative rounded-2xl overflow-hidden"
              style={{
                aspectRatio: "16 / 9",
                background:
                  "linear-gradient(180deg, #0A0F14 0%, #06090C 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* scanlines */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 2px)",
                  backgroundSize: "100% 3px",
                }}
              />
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 400 225"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden
              >
                {/* pallet rows */}
                {[0, 1, 2].map((row) =>
                  [0, 1, 2, 3].map((col) => (
                    <rect
                      key={`${row}-${col}`}
                      x={30 + col * 90}
                      y={50 + row * 55}
                      width={70}
                      height={40}
                      rx={3}
                      fill="rgba(255,255,255,0.06)"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth={0.5}
                    />
                  ))
                )}
                {/* detection boxes */}
                {[
                  { x: 30, y: 50, label: "PALLET · 24 CS" },
                  { x: 210, y: 105, label: "TOTE · 12 EA" },
                  { x: 300, y: 160, label: "PALLET · 18 CS" },
                ].map((d, i) => (
                  <g key={i}>
                    <motion.rect
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.5,
                        delay: 0.3 + i * 0.15,
                        ease: EASE,
                      }}
                      x={d.x}
                      y={d.y}
                      width={70}
                      height={40}
                      rx={3}
                      fill="none"
                      stroke="#FF6A00"
                      strokeWidth={1.5}
                      style={{ transformOrigin: `${d.x + 35}px ${d.y + 20}px` }}
                    />
                    <motion.text
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.4,
                        delay: 0.55 + i * 0.15,
                      }}
                      x={d.x}
                      y={d.y - 6}
                      fontSize={8}
                      fontFamily="ui-monospace, monospace"
                      fontWeight="bold"
                      fill="#FF6A00"
                    >
                      {d.label}
                    </motion.text>
                  </g>
                ))}
              </svg>
              {/* corner brackets */}
              {[
                { top: 10, left: 10, rot: 0 },
                { top: 10, right: 10, rot: 90 },
                { bottom: 10, right: 10, rot: 180 },
                { bottom: 10, left: 10, rot: 270 },
              ].map((c, i) => (
                <div
                  key={i}
                  className="absolute w-4 h-4"
                  style={{
                    ...c,
                    borderTop: "1.5px solid rgba(255,106,0,0.7)",
                    borderLeft: "1.5px solid rgba(255,106,0,0.7)",
                    transform: `rotate(${c.rot}deg)`,
                  }}
                />
              ))}
            </div>
          </motion.article>

          {/* Panel 2 — Continuous Reconciliation */}
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
            className="relative overflow-hidden p-9 sm:p-11 flex flex-col"
            style={{
              minHeight: 520,
              borderRadius: 28,
              background: "linear-gradient(180deg, #FF6A00 0%, #E85A00 100%)",
              boxShadow:
                "0 40px 100px -40px rgba(255,106,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="w-[7px] h-[7px] rounded-full bg-carbon" />
              <span className="text-[10.5px] font-mono font-semibold tracking-[0.22em] uppercase text-carbon/85">
                Continuous Reconciliation
              </span>
            </div>
            <h3 className="text-[28px] sm:text-[34px] font-bold text-carbon leading-[1.1] tracking-[-0.025em] max-w-[440px]">
              Physical and digital, always in agreement.
            </h3>
            <p className="mt-4 text-[15.5px] text-carbon/75 leading-[1.65] max-w-[460px]">
              Every read is matched against your WMS in seconds. Drift,
              phantom stock and misplacements surface the moment they
              happen — not next quarter.
            </p>

            {/* mini viz — reconciliation flow */}
            <div
              className="mt-auto relative rounded-2xl overflow-hidden p-5"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(0,0,0,0.08)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-carbon/70">
                  Live diff · last 60s
                </div>
                <span className="text-[10px] font-mono font-bold tracking-[0.14em] px-2 py-0.5 rounded-full bg-carbon text-white">
                  SYNCED
                </span>
              </div>
              <div className="space-y-2.5">
                {[
                  { loc: "B-03-11", wms: "42", floor: "40", diff: "-2" },
                  { loc: "C-08-02", wms: "310", floor: "310", diff: "0", ok: true },
                  { loc: "D-15-07", wms: "12", floor: "0", diff: "-12" },
                  { loc: "E-06-09", wms: "88", floor: "88", diff: "0", ok: true },
                ].map((r, i) => (
                  <motion.div
                    key={r.loc}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: 0.4 + i * 0.08,
                      ease: EASE,
                    }}
                    className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 text-[12.5px]"
                  >
                    <span className="font-mono text-carbon font-semibold">
                      {r.loc}
                    </span>
                    <span className="text-carbon/60 tabular-nums text-[11.5px] font-mono">
                      WMS {r.wms}
                    </span>
                    <span className="text-carbon/60 tabular-nums text-[11.5px] font-mono">
                      · Floor {r.floor}
                    </span>
                    <span
                      className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
                      style={{
                        background: r.ok
                          ? "rgba(0,0,0,0.1)"
                          : "rgba(0,0,0,0.85)",
                        color: r.ok ? "rgba(0,0,0,0.7)" : "#FF6A00",
                      }}
                    >
                      {r.ok ? "OK" : r.diff}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
