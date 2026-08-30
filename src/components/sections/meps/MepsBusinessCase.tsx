"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, Check } from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * The business case.
 *
 * Claim, then evidence, then conclusion, then the way to act on it — the
 * order the section has to be read in. The eight measurables sit in one ruled
 * panel rather than eight loose cards: they are one list, and the panel is
 * what makes them read as the ground the claim stands on.
 *
 * The caveat about indicative outputs stays inside the CTA band, next to the
 * button it qualifies.
 */

const LINE = "#E8E8ED";

const BASIS = [
  "Fleet utilisation and balance",
  "Empty travel and deadhead distance",
  "Idle time and waiting",
  "Congestion cost",
  "Pallet throughput per machine",
  "Fleet right-sizing evidence",
  "Operator allocation",
  "Layout and staging improvement",
];

export function MepsBusinessCase() {
  return (
    <Section surface="white" id="business-case">
      <SectionHeader
        eyebrow="The business case"
        top="Turn operational visibility"
        bottom="into measurable value."
        body="MEPS does not create savings by tracking a machine. It creates them by exposing where time, distance and capacity are going — then letting the operation decide what to do about it."
        size="compact"
        width="wide"
      />

      {/* ── what the case is measured on ────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.75, ease: EASE }}
        className="overflow-hidden"
        style={{
          borderRadius: 14,
          border: `1px solid ${LINE}`,
          boxShadow:
            "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
        }}
      >
        <div
          className="px-6 py-4"
          style={{ background: "#FAFAFB", borderBottom: `1px solid ${LINE}` }}
        >
          <p className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-graphite/45">
            What the case is measured on
          </p>
        </div>

        {/* gap-px over the line colour rules the grid at every breakpoint */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px"
          style={{ background: LINE }}
        >
          {BASIS.map((b, i) => (
            <motion.div
              key={b}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="flex items-start gap-3 bg-white px-6 py-7"
            >
              <span
                aria-hidden
                className="w-[18px] h-[18px] rounded-full bg-signal-orange flex items-center justify-center shrink-0 mt-px"
              >
                <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
              </span>
              <span className="text-[14px] font-medium text-carbon leading-[1.45] tracking-[-0.01em]">
                {b}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── what that adds up to ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-20 sm:mt-24 text-center"
      >
        <p className="font-rams-heading text-[22px] sm:text-[28px] lg:text-[32px] font-bold tracking-[-0.028em] leading-[1.22] text-carbon max-w-[38ch] mx-auto">
          The ROI does not come from tracking the MHE. It comes from acting on
          what the <span className="text-signal-orange">movement</span> reveals.
        </p>
        <p className="mt-5 text-[15px] sm:text-[16px] text-graphite/60 leading-[1.6]">
          Measure the opportunity before you buy more capacity.
        </p>
      </motion.div>

      {/* ── the way to act on it ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.75, ease: EASE }}
        className="relative overflow-hidden mt-12 sm:mt-14 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10 px-7 py-8 sm:px-10 sm:py-9"
        style={{
          borderRadius: 14,
          background:
            "radial-gradient(120% 180% at 50% 0%, #1D1D1F 0%, #0E0E0F 60%, #08080A 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 30px 70px -40px rgba(14,14,15,0.55)",
        }}
      >
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,106,0,0.45), transparent)",
          }}
        />

        <div className="lg:max-w-[640px]">
          <p className="text-[19px] sm:text-[22px] font-bold tracking-[-0.025em] text-white leading-[1.25]">
            Test the opportunity against your own assumptions.
          </p>
          <p className="mt-3 text-[13px] text-white/50 leading-[1.6]">
            Scenario outputs reflect the assumptions you enter. They are
            indicative, not guaranteed savings.
          </p>
        </div>

        <Link
          href="#roi"
          className="lg:ml-auto shrink-0 inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3 rounded-lg transition-colors duration-200 hover:bg-signal-orange-hover"
        >
          Calculate the business case
          <ArrowDown className="w-4 h-4" aria-hidden />
        </Link>
      </motion.div>
    </Section>
  );
}
