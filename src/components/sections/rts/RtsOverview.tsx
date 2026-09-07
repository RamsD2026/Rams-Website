"use client";

import { motion } from "framer-motion";
import {
  BellAlertIcon,
  BoltIcon,
  ChartBarIcon,
  ForwardIcon,
  MapIcon,
  TruckIcon,
} from "@heroicons/react/24/solid";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 03 — Product overview.
 *
 * The six things the safety layer holds, in the coloured-tile treatment
 * established by `TwinOverview` and carried on the IRDS and ATOS pages. Same
 * construction: `gap-3`, an 11px tile at 10px radius with a 21px solid icon,
 * a 15px bold title and a 13px body, hover is the white rectangle only.
 *
 * Three across, because there are six: two rows of three read as a set where
 * four-then-two reads as a grid that ran out.
 *
 * The tints are the first six of the palette `TwinOverview` sampled from its
 * reference, in the same order. They carry no meaning — which matters on this
 * page more than most, because RTSS uses severity colour elsewhere and nothing
 * in this grid may be misread as a risk state.
 */

const TILES = [
  {
    icon: TruckIcon,
    title: "Movement",
    body: "Position, route and interaction",
    tint: "#299764",
  },
  {
    icon: BoltIcon,
    title: "Impacts",
    body: "Severity, time and asset context",
    tint: "#3E63DD",
  },
  {
    icon: ForwardIcon,
    title: "Behaviour",
    body: "Speed and driving events",
    tint: "#E5484D",
  },
  {
    icon: MapIcon,
    title: "Zones",
    body: "Limits and restricted areas",
    tint: "#6647F0",
  },
  {
    icon: BellAlertIcon,
    title: "Response",
    body: "Alert, owner and action",
    tint: "#12A594",
  },
  {
    icon: ChartBarIcon,
    title: "Learning",
    body: "Patterns, recurrence, trends",
    tint: "#F76808",
  },
];

export function RtsOverview() {
  return (
    <Section surface="offWhite" id="overview">
      <SectionHeader
        eyebrow="Product overview"
        top="A live safety layer"
        bottom="For the physical operation."
        size="compact"
        width="wide"
        body="RTSS receives supported sensor, vehicle, vision and system events; places them in operational context; alerts the right people; and carries each significant event through review, action and learning."
      />

      <style>{`
        .rtsov-card {
          border-radius: 12px;
          background: transparent;
          transition: background .25s ease;
        }
        .rtsov-card:hover {
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
            className="rtsov-card flex items-start gap-3.5 p-4"
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
