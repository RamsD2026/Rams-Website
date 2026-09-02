"use client";

import { motion } from "framer-motion";
import {
  EASE,
  ProductVideo,
  Section,
} from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * Live Digital Twin + AIMS.
 *
 * The centred header the rest of the site uses, then the row beneath it:
 * what the twin lets management do on the left, the product itself on the
 * right.
 */

const LINE = "#E8E8ED";

const POINTS: { ix: string; title: string; body: string }[] = [
  {
    ix: "01",
    title: "Remote, real-time visibility",
    body: "Open Kolkata — or any connected facility — from one screen. See how the site is functioning, review live parameters and examine operational changes without a physical visit.",
  },
  {
    ix: "02",
    title: "Asset-to-field drill-down",
    body: "Select a moving forklift, rack, pallet or operating zone to see its current field status, measurements, history and connected evidence.",
  },
  {
    ix: "03",
    title: "Direct operational truth",
    body: "Replace the long chain of verbal updates, reports and presentations with direct visibility. Management sees the underlying reality before detail is diluted through hierarchy.",
  },
];

export function AimsTwin() {
  return (
    <Section surface="offWhite" id="live-visibility">
      <SectionHeader
        eyebrow="Live Digital Twin + AIMS"
        top="See the site as it is."
        bottom="Not as it was reported."
        body="Every authorised site change can be reflected on the RAMS Digital Twin. Management can open any facility, inspect the current operating picture and drill down to an individual asset — without travelling to the location."
        size="compact"
        width="wide"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-14 items-center max-w-[1240px] mx-auto">
        {/* what it lets management do */}
        <div>
          {POINTS.map((pt, i) => (
            <motion.div
              key={pt.ix}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              className="flex gap-4 py-7 first:pt-0 last:pb-0"
              style={{ borderTop: i === 0 ? "none" : `1px solid ${LINE}` }}
            >
              <span className="text-[11px] font-mono font-bold text-signal-orange pt-1 shrink-0">
                {pt.ix}
              </span>
              <div className="min-w-0">
                <h3 className="text-[19px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
                  {pt.title}
                </h3>
                <p className="mt-3 text-[14px] text-graphite/65 leading-[1.65]">
                  {pt.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* the site, as the twin renders it */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <ProductVideo
            src="/Product/irds/hero.mp4"
            path="rams.digital / aims / digital-twin / kolkata-dc-01"
            tone="light"
          />
        </motion.div>
      </div>
    </Section>
  );
}
