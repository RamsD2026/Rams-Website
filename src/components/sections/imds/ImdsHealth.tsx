"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { ArrowRight } from "lucide-react";
import {
  ChapterHead,
  EASE,
  ProductVideo,
  Section,
} from "@/components/sections/rackiq/rackiq-shared";
import { LIGHT_LINE as LINE } from "./imds-shared";

/**
 * Fleet health over time.
 *
 * The before/after follows the RTSS verification split: the claim on the
 * left, one widget on the right. Two facing tables make the reader do the
 * matching themselves — here each measure is a single line that crosses out
 * what it was and states what it became, so the change is the only thing
 * carrying colour.
 */

const GREEN = "#16A34A";

const CALLOUTS = [
  "Cost per operating hour by machine — which asset is quietly expensive.",
  "Preventive versus reactive balance, and how it is shifting month to month.",
  "Fault recurrence and mean time to repair across the fleet.",
];

const MEASURES: [string, string, string][] = [
  ["Maintenance mix", "Mostly reactive", "Planned, trigger-led"],
  ["Pre-shift compliance", "Unverifiable", "Verified per shift"],
  ["Fault history", "Verbal / paper", "Trended per machine"],
  ["Cost per hour", "Not known", "Measured"],
];

/** What is the same either side of the comparison. */
const CONTEXT = ["Same fleet", "Usage-based maintenance", "Same measures"];

export function ImdsHealth() {
  return (
    <Section surface="offWhite" id="health">
      <SectionHeader
        eyebrow="Fleet health over time"
        top="Maintenance becomes"
        bottom="A number you can manage."
        body="Once every hour, cycle, fault, part and repair sits against the machine, maintenance stops being a cost line and starts being a measure."
        size="compact"
        width="wide"
        bodyWidth="wide"
      />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="max-w-[1080px] mx-auto"
      >
        <ProductVideo
          src="/Product/irds/hero.mp4"
          path="rams.digital / mhe / imds / fleet-health"
          tone="light"
          shadow={false}
        />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-6 max-w-[1080px] mx-auto mt-10">
        {CALLOUTS.map((c, i) => (
          <motion.p
            key={c}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
            className="flex gap-3 text-[13px] leading-[1.6] text-graphite/60"
          >
            <span className="text-[10px] font-mono font-bold tracking-[0.14em] text-signal-orange shrink-0 mt-[3px]">
              {String(i + 1).padStart(2, "0")}
            </span>
            {c}
          </motion.p>
        ))}
      </div>

      {/* the change, measured — the verification split */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.12fr] gap-10 lg:gap-14 items-center max-w-[1180px] mx-auto mt-20 sm:mt-24">
        <div>
          <ChapterHead
            eyebrow="Measured outcome"
            top="Measure the change,"
            bottom="Not the promise."
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.75, ease: EASE }}
          className="overflow-hidden bg-white"
          style={{
            borderRadius: 16,
            border: `1px solid ${LINE}`,
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.02), 0 18px 44px -24px rgba(0,0,0,0.14)",
          }}
        >
          <div
            className="flex items-center gap-2 flex-wrap px-5 py-4 sm:px-7"
            style={{ background: "#FAFAFB", borderBottom: `1px solid ${LINE}` }}
          >
            {CONTEXT.map((c, i) => (
              <span key={c} className="flex items-center gap-2">
                {i > 0 && (
                  <span aria-hidden className="text-graphite/25 text-[11px]">
                    ·
                  </span>
                )}
                <span
                  className={
                    "text-[11.5px] font-mono tracking-[0.04em] " +
                    (i === 1
                      ? "text-signal-orange font-semibold"
                      : "text-graphite/55")
                  }
                >
                  {c}
                </span>
              </span>
            ))}

            <span className="ml-auto flex items-center gap-3 shrink-0">
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-1.5 rounded-full"
                  style={{ background: "#D3D3D9" }}
                />
                <span className="text-[9.5px] font-mono tracking-[0.14em] uppercase text-graphite/40">
                  Before
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-1.5 rounded-full"
                  style={{ background: GREEN }}
                />
                <span className="text-[9.5px] font-mono tracking-[0.14em] uppercase text-graphite/40">
                  After
                </span>
              </span>
            </span>
          </div>

          {MEASURES.map(([label, before, after], i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
              className="px-5 py-5 sm:px-7"
              style={{ borderTop: i > 0 ? `1px solid ${LINE}` : undefined }}
            >
              <div className="flex items-baseline justify-between gap-x-5 gap-y-2 flex-wrap">
                <span className="text-[13.5px] sm:text-[14px] font-medium text-carbon">
                  {label}
                </span>

                <span className="flex items-baseline gap-2.5 shrink-0">
                  <span className="text-[13.5px] text-graphite/40">
                    {before}
                  </span>
                  <ArrowRight
                    className="w-3.5 h-3.5 text-graphite/30 self-center shrink-0"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <span
                    className="inline-flex items-center px-2.5 py-[5px] rounded-full text-[12.5px] font-semibold tracking-[-0.01em]"
                    style={{ background: "rgba(22,163,74,0.09)", color: GREEN }}
                  >
                    {after}
                  </span>
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
