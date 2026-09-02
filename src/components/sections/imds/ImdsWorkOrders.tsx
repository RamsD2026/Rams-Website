"use client";

import { motion } from "framer-motion";
import { Network, Receipt, Route, Smartphone } from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import {
  EASE,
  ProductVideo,
  Section,
} from "@/components/sections/rackiq/rackiq-shared";
import { LIGHT_LINE as LINE } from "@/components/sections/imds/imds-shared";

/**
 * Work order management.
 *
 * The pre-shift split: what the order guarantees on the left, the
 * technician's screen on the right.
 */

const GUARANTEES = [
  {
    Icon: Smartphone,
    tag: "In the field",
    title: "Mobile for technicians",
    body: "The work order opens where the machine is, not at a desk afterwards.",
  },
  {
    Icon: Receipt,
    tag: "Recorded",
    title: "Parts and cost",
    body: "Replacement parts logged with cost captured against the machine, building real cost per operating hour.",
  },
  {
    Icon: Route,
    tag: "Tracked",
    title: "Trigger to resolution",
    body: "Every order carries the reason it was raised, so nobody has to reconstruct why later.",
  },
  {
    Icon: Network,
    tag: "Connected",
    title: "Alongside your CMMS",
    body: "IMDS can feed an existing CMMS through the API, or replace manual scheduling where there isn't one.",
  },
];

export function ImdsWorkOrders() {
  return (
    <Section surface="offWhite" id="workorders">
      <SectionHeader
        eyebrow="Work order management"
        top="From trigger to"
        bottom="Verified closure."
        body="A trigger that raises an alert and nothing else is just a different way of being surprised. Each work order is created, assigned, worked and verified — with the parts and the cost recorded against the machine."
        size="compact"
        width="wide"
        bodyWidth="wide"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start max-w-[1180px] mx-auto">
        <div className="lg:col-span-4">
          {GUARANTEES.map((g, i) => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
              className="flex items-start gap-4 py-5"
              style={{ borderTop: i ? `1px solid ${LINE}` : undefined }}
            >
              <g.Icon
                className="w-[19px] h-[19px] text-signal-orange shrink-0 mt-[3px]"
                strokeWidth={1.8}
                aria-hidden
              />
              <div className="min-w-0">
                <p className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-rams-heading text-[16.5px] font-bold tracking-[-0.02em] text-carbon">
                    {g.title}
                  </span>
                  <span className="text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-graphite/35">
                    {g.tag}
                  </span>
                </p>
                <p className="mt-1.5 text-[13px] leading-[1.6] text-graphite/60">
                  {g.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="lg:col-span-8"
        >
          <ProductVideo
            src="/Product/irds/hero.mp4"
            path="rams.digital / mhe / imds / work-orders / WO-4471"
            tone="light"
            shadow={false}
          />
        </motion.div>
      </div>
    </Section>
  );
}
