"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { EASE, Kicker } from "./dtw-shared";

const ROWS = [
  {
    q: "Where is this pallet?",
    before: "Walk the aisle, or trust a stock record nobody has verified",
    after: "Resolved to a bay and level, with the scan that put it there",
  },
  {
    q: "What condition is this rack in?",
    before: "Find the inspection PDF and match a photo to a location from memory",
    after: "Condition held against the exact upright, with full history",
  },
  {
    q: "What changed last Tuesday?",
    before: "Reconstruct it from shift notes and spreadsheets",
    after: "Replay the model at that timestamp",
  },
  {
    q: "Will this slotting change help?",
    before: "Try it on the floor and find out",
    after: "Model it first, compare against current performance",
  },
  {
    q: "Do our systems agree?",
    before: "Each system keeps its own version of the warehouse",
    after: "One model, read and written by all of them",
  },
];

export function DtwCompare() {
  return (
    <section
      className="relative text-white border-t border-white/[0.07]"
      style={{ background: "#08080A" }}
    >
      <div className="rams-container py-28 sm:py-36">
        <div className="max-w-[820px] mb-14 sm:mb-16">
          <Kicker>Nothing else comes close</Kicker>
          <h2 className="mt-5 text-[36px] sm:text-[52px] lg:text-[62px] font-bold leading-[1.04] tracking-[-0.04em]">
            Same questions. <br />
            <span className="text-white/40">Very different answers.</span>
          </h2>
        </div>

        <div className="hidden md:grid grid-cols-[1.1fr_1fr_1fr] gap-4 mb-4 px-1">
          <span />
          <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-white/30 px-6">
            Without a twin
          </span>
          <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange px-6">
            With the twin
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {ROWS.map((r, i) => (
            <motion.div
              key={r.q}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
              className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr_1fr] gap-3 md:gap-4"
            >
              <div className="flex items-center px-6 py-4 md:py-0">
                <span className="text-[16px] font-semibold leading-[1.4] tracking-[-0.01em]">
                  {r.q}
                </span>
              </div>

              <div
                className="flex gap-3 px-6 py-5"
                style={{
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <X className="w-4 h-4 shrink-0 mt-0.5 text-white/25" strokeWidth={2.5} aria-hidden />
                <span className="text-[13.5px] text-white/45 leading-[1.6]">
                  {r.before}
                </span>
              </div>

              <div
                className="flex gap-3 px-6 py-5"
                style={{
                  borderRadius: 14,
                  background: "rgba(255,106,0,0.07)",
                  border: "1px solid rgba(255,106,0,0.28)",
                }}
              >
                <Check className="w-4 h-4 shrink-0 mt-0.5 text-signal-orange" strokeWidth={2.5} aria-hidden />
                <span className="text-[13.5px] text-white/85 leading-[1.6]">
                  {r.after}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
