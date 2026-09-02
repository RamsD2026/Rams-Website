"use client";

import { motion } from "framer-motion";
import {
  ClipboardCheck,
  Gauge,
  TriangleAlert,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Architecture strip.
 *
 * A tight band rather than a full section — it belongs to the hero, naming the
 * four things IMDS does before the page walks through them. The source's
 * foundation line carries it as the heading.
 *
 * Everything is on the face of the card: name, what it is for, and the flow it
 * runs. The flow was behind a hover flip, which hid the most concrete thing on
 * each card behind an interaction and left the front telling you to hover.
 */

const LINE = "#E8E8ED";

/* Each subline names the outcome the flow arrives at, so the card says what
   the capability is for before you read the steps. */
const PILLARS: {
  n: string;
  title: string;
  sub: string;
  flow: string[];
  Icon: LucideIcon;
}[] = [
  {
    n: "01",
    title: "Pre-shift inspection",
    sub: "Checked and signed off before the machine is released.",
    flow: ["Checklist", "Photo", "Sign-off", "Release or restrict"],
    Icon: ClipboardCheck,
  },
  {
    n: "02",
    title: "Fault intelligence",
    sub: "Codes captured and classified, so a repeat becomes a trend.",
    flow: ["Capture", "Classify", "Escalate", "Trend"],
    Icon: TriangleAlert,
  },
  {
    n: "03",
    title: "Usage-based triggers",
    sub: "Five signals from real use, not the calendar.",
    flow: ["Hours", "Cycles", "Faults", "Battery", "Impacts"],
    Icon: Gauge,
  },
  {
    n: "04",
    title: "Work orders & damage",
    sub: "Raised, assigned and tracked through to verified closure.",
    flow: ["Create", "Assign", "Repair", "Verify", "Close"],
    Icon: Wrench,
  },
];

export function ImdsArchitecture() {
  return (
    <Section surface="white" padding="strip" id="architecture">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="text-center font-rams-heading text-[26px] sm:text-[32px] lg:text-[38px] font-bold tracking-[-0.032em] leading-[1.18] text-carbon mx-auto mb-12 sm:mb-14"
      >
        Powered by{" "}
        <span className="text-signal-orange">MEPS + Digital Twin</span> context
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-[1180px] mx-auto items-stretch">
        {PILLARS.map((p, i) => (
          <motion.article
            key={p.n}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
            className="flex flex-col p-6 bg-white transition-transform duration-300 hover:-translate-y-1"
            style={{
              borderRadius: 14,
              border: `1px solid ${LINE}`,
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <span
                className="w-10 h-10 rounded-[11px] flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(255,106,0,0.08)",
                  border: "1px solid rgba(255,106,0,0.2)",
                }}
              >
                <p.Icon
                  className="w-[18px] h-[18px] text-signal-orange"
                  strokeWidth={1.8}
                  aria-hidden
                />
              </span>
              <span className="text-[10px] font-mono font-bold tracking-[0.16em] text-signal-orange">
                {p.n}
              </span>
            </div>

            <h3 className="mt-5 text-[21px] sm:text-[22px] font-bold tracking-[-0.022em] leading-[1.2] text-carbon">
              {p.title}
            </h3>
            <p className="mt-2.5 mb-7 text-[12.5px] text-graphite/55 leading-[1.55]">
              {p.sub}
            </p>

            {/* Step then arrow, as the source sets it. A wrapping flex row
                rather than inline text: the spans sit flush against each other
                with no whitespace between them, so inline layout had no break
                opportunity and ran the whole chain off the card. */}
            <div
              className="mt-auto pt-6 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] font-mono"
              style={{ borderTop: `1px solid ${LINE}` }}
            >
              {p.flow.map((step, si) => {
                const last = si === p.flow.length - 1;
                return (
                  <span key={step} className="whitespace-nowrap">
                    {si > 0 && (
                      <span
                        aria-hidden
                        className="mr-1.5 text-signal-orange/60"
                      >
                        →
                      </span>
                    )}
                    <span
                      className={
                        last ? "font-semibold text-carbon" : "text-graphite/60"
                      }
                    >
                      {step}
                    </span>
                  </span>
                );
              })}
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
