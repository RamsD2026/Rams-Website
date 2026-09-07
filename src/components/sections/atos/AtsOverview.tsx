"use client";

import { motion } from "framer-motion";
import {
  ArrowPathIcon,
  BoltIcon,
  InboxArrowDownIcon,
  QueueListIcon,
  ScaleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 03 — Product overview.
 *
 * The six things the execution layer holds, in the coloured-tile treatment
 * established by `TwinOverview` and carried on the IRDS page. Same
 * construction: `gap-3`, an 11px tile at 10px radius with a 21px solid icon, a
 * 15px bold title and a 13px body, and a hover that is the white rectangle and
 * nothing else.
 *
 * Three across rather than four, because there are six: two rows of three read
 * as a set, where four-then-two reads as a grid that ran out.
 *
 * Icons are `@heroicons/react/24/solid`. Lucide is a stroke set — at 21px on a
 * saturated tile its hairlines disappear, and it has no filled variant.
 *
 * The six tints are the first six of the palette `TwinOverview` sampled from
 * its reference, in the same order, so the grids read as the same object
 * across the platform pages. They carry no meaning.
 */

const TILES = [
  {
    icon: InboxArrowDownIcon,
    title: "Demand",
    body: "Orders, requests and events",
    tint: "#299764",
  },
  {
    icon: ScaleIcon,
    title: "Rules",
    body: "Priority, SLA and constraints",
    tint: "#3E63DD",
  },
  {
    icon: QueueListIcon,
    title: "Tasks",
    body: "Templates and dependencies",
    tint: "#E5484D",
  },
  {
    icon: UserGroupIcon,
    title: "Resources",
    body: "People, MHE, docks and zones",
    tint: "#6647F0",
  },
  {
    icon: BoltIcon,
    title: "Execution",
    body: "Assignments and live queues",
    tint: "#12A594",
  },
  {
    icon: ArrowPathIcon,
    title: "Learning",
    body: "History, exceptions, outcomes",
    tint: "#F76808",
  },
];

export function AtsOverview() {
  return (
    <Section surface="offWhite" id="overview">
      <SectionHeader
        eyebrow="Product overview"
        top="The execution layer"
        bottom="Between demand and work."
        size="compact"
        width="wide"
        body="ATOS takes demand from business systems and operational teams, converts it into structured tasks, applies priorities and dependencies, matches available resources, and updates the plan when conditions change."
      />

      <style>{`
        /* The whole hover is the white rectangle. No lift, no icon scale. */
        .atsov-card {
          border-radius: 12px;
          background: transparent;
          transition: background .25s ease;
        }
        .atsov-card:hover {
          background: #FFFFFF;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06);
        }
      `}</style>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-[1000px] mx-auto">
        {TILES.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: (i % 3) * 0.07, ease: EASE }}
            className="atsov-card flex items-start gap-3.5 p-4"
          >
            <span
              className="w-11 h-11 shrink-0 flex items-center justify-center"
              style={{ borderRadius: 10, background: t.tint }}
            >
              <t.icon className="w-[21px] h-[21px] text-white" aria-hidden />
            </span>

            <span className="min-w-0">
              <span className="block text-[15px] font-bold tracking-[-0.01em] text-carbon leading-[1.2]">
                {t.title}
              </span>
              <span className="mt-1.5 block text-[13px] leading-[1.5] text-graphite/60">
                {t.body}
              </span>
            </span>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
