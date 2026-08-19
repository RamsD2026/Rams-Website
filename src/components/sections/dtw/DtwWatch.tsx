"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Kicker } from "./dtw-shared";

const ROLES = [
  { role: "Safety manager", ask: "Which uprights went amber this month?" },
  { role: "Inventory lead", ask: "Where has PLT-2048 been since Monday?" },
  { role: "Shift supervisor", ask: "Which bays in Zone C are blocked right now?" },
  { role: "Maintenance", ask: "Which racks were hit by MHE-07 this quarter?" },
  { role: "Site director", ask: "How does Pune compare to Chennai on rack health?" },
  { role: "Systems team", ask: "Push every location change into our WMS." },
];

const FEED = [
  { t: "12:04:18", who: "Scan", msg: "PLT-2048 bound to A-04-12-3", ok: true },
  { t: "12:04:11", who: "MEPS", msg: "MHE-07 entered Zone D", ok: true },
  { t: "12:03:57", who: "IRDS", msg: "U-B18 condition → amber", ok: false },
  { t: "12:03:40", who: "ATOS", msg: "Task ATOS-324 closed", ok: true },
  { t: "12:03:22", who: "Scan", msg: "PLT-6110 → Staging 2", ok: true },
  { t: "12:03:04", who: "AIMS", msg: "Zone C aging report refreshed", ok: true },
  { t: "12:02:51", who: "RTSS", msg: "Pedestrian event · Aisle B", ok: false },
  { t: "12:02:33", who: "IMDS", msg: "MHE-03 hydraulic warning", ok: false },
];

export function DtwWatch() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % ROLES.length), 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="watch"
      className="relative overflow-hidden text-white border-t border-white/[0.07]"
      style={{ background: "#08080A" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-0 w-[720px] h-[720px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,106,0,0.13), transparent 70%)",
        }}
      />

      <div className="relative rams-container py-28 sm:py-36">
        <div className="max-w-[820px] mb-14 sm:mb-16">
          <Kicker>The twin already knows</Kicker>
          <h2 className="mt-5 text-[36px] sm:text-[52px] lg:text-[62px] font-bold leading-[1.04] tracking-[-0.04em]">
            Ask the floor anything. <br />
            <span className="text-white/40">Watch it answer.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-5">
          {/* rotating roles */}
          <div className="flex flex-col gap-2">
            {ROLES.map((r, i) => {
              const on = i === active;
              return (
                <button
                  key={r.role}
                  onClick={() => setActive(i)}
                  className="text-left px-6 py-5 transition-all duration-300"
                  style={{
                    borderRadius: 14,
                    background: on ? "rgba(255,106,0,0.08)" : "rgba(255,255,255,0.025)",
                    border: on
                      ? "1px solid rgba(255,106,0,0.35)"
                      : "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div
                    className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase mb-2"
                    style={{ color: on ? "#FF9B4D" : "rgba(255,255,255,0.32)" }}
                  >
                    {r.role}
                  </div>
                  <div
                    className="text-[14.5px] leading-[1.5]"
                    style={{ color: on ? "#FFFFFF" : "rgba(255,255,255,0.5)" }}
                  >
                    {r.ask}
                  </div>
                </button>
              );
            })}
          </div>

          {/* live feed */}
          <div
            className="relative overflow-hidden flex flex-col"
            style={{
              borderRadius: 18,
              background: "linear-gradient(180deg, #101013 0%, #0A0A0C 100%)",
              border: "1px solid rgba(255,255,255,0.09)",
              minHeight: 460,
            }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
              <Kicker tone="muted">Pune DC · twin activity</Kicker>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-signal-orange animate-pulse" />
                <span className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/45">
                  Live
                </span>
              </span>
            </div>

            <div className="flex-1 p-4 flex flex-col gap-1.5 overflow-hidden">
              {FEED.map((e, i) => (
                <motion.div
                  key={e.t}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.055)",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: e.ok ? "#2BCB74" : "#FFB020" }}
                  />
                  <span className="text-[10.5px] font-mono text-white/30 tabular-nums shrink-0">
                    {e.t}
                  </span>
                  <span className="text-[9.5px] font-mono font-bold tracking-[0.1em] text-white/45 w-11 shrink-0">
                    {e.who}
                  </span>
                  <span className="text-[12.5px] text-white/75 truncate">
                    {e.msg}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-white/[0.07]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="text-[12px] text-white/45 truncate">
                    {ROLES[active].ask}
                  </span>
                  <span className="text-[12px] font-bold text-signal-orange tabular-nums shrink-0">
                    0.4s
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
