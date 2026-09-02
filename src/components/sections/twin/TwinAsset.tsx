"use client";

import { motion } from "framer-motion";
import {
  Gauge,
  History,
  ListChecks,
  MapPin,
  Route,
  ShieldAlert,
  UserCheck,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Asset identity.
 *
 * Nine cards, one identity — everything that accumulates against the same
 * asset once it has been tagged.
 */

const LINE = "#E8E8ED";

const FIELDS: { Icon: LucideIcon; k: string; v: string }[] = [
  {
    Icon: MapPin,
    k: "Identity & home",
    v: "Where it belongs, what it is, which zones it is permitted to operate in.",
  },
  {
    Icon: UserCheck,
    k: "Operator sessions",
    v: "Who authenticated on it, when, and for how long.",
  },
  {
    Icon: Route,
    k: "Movement",
    v: "Routes travelled, aisles entered, distance loaded versus empty.",
  },
  {
    Icon: Gauge,
    k: "Utilisation",
    v: "Working time against idle time, across shifts and across sites.",
  },
  {
    Icon: ShieldAlert,
    k: "Safety events",
    v: "Near-misses, zone entries, interventions — each one located.",
  },
  {
    Icon: Zap,
    k: "Impacts",
    v: "Force, position, what was struck, and what happened immediately before.",
  },
  {
    Icon: Wrench,
    k: "Maintenance",
    v: "Triggers raised, work orders, parts, downtime, verification.",
  },
  {
    Icon: ListChecks,
    k: "Tasks",
    v: "What it was asked to do, and what it actually completed.",
  },
  {
    Icon: History,
    k: "History",
    v: "The full accumulated record — the thing no handover note ever captures.",
  },
];

export function TwinAsset() {
  return (
    <Section surface="white" id="asset">
      <SectionHeader
        eyebrow="Asset identity"
        top="Tag the asset once."
        bottom="Build intelligence around it for the rest of its life."
        body="The twin starts by knowing one thing about an asset: where it belongs. Everything after that accumulates against the same identity — so the record follows the machine rather than the spreadsheet it was last mentioned in."
        size="long"
        width="wide"
        bodyWidth="wide"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[1180px] mx-auto">
        {FIELDS.map((f, i) => (
          <motion.article
            key={f.k}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.07, ease: EASE }}
            className="p-6 bg-white"
            style={{ borderRadius: 14, border: `1px solid ${LINE}` }}
          >
            <span
              className="flex items-center justify-center w-10 h-10 rounded-[11px]"
              style={{
                background: "rgba(255,106,0,0.07)",
                border: "1px solid rgba(255,106,0,0.18)",
              }}
            >
              <f.Icon
                className="w-[18px] h-[18px] text-signal-orange"
                strokeWidth={1.8}
                aria-hidden
              />
            </span>

            <h3 className="mt-5 font-rams-heading text-[17px] font-bold tracking-[-0.02em] leading-[1.25] text-carbon">
              {f.k}
            </h3>
            <p className="mt-2.5 text-[13px] leading-[1.6] text-graphite/60">
              {f.v}
            </p>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
