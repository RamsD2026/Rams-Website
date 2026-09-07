"use client";

import { motion } from "framer-motion";
import {
  ArrowPathIcon,
  CameraIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  QueueListIcon,
  ScaleIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/solid";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 03 — Product overview.
 *
 * The twelve things the rack record holds, four across and three down, in the
 * coloured-tile treatment established by `TwinOverview`. Same construction:
 * `gap-3`, `max-w-[1120px]`, an 11px tile at 10px radius with a 21px solid
 * icon, a 15px bold title and a 13px body, and a hover that is the white
 * rectangle and nothing else.
 *
 * Icons are `@heroicons/react/24/solid`, not lucide. Lucide is a stroke set —
 * at 21px on a saturated tile its hairlines disappear, and it has no filled
 * variant. This is the one place on the site that does not use lucide.
 *
 * Every `body` is kept under about 25 characters on purpose. The text column
 * is roughly 190px at `lg`, which takes one line of 13px and no more; a longer
 * line wraps and the row below it stops aligning.
 *
 * The tints are the first twelve of the palette `TwinOverview` sampled from
 * its reference, in the same row-major order, so the two grids read as the
 * same object. They carry no meaning — which matters here more than there,
 * because this page uses Red/Amber/Green as a real severity scale a few
 * sections down. Nothing in this grid may be read as a risk state, which is
 * why no tile is coloured by its own subject.
 */

const TILES = [
  { icon: CubeIcon, title: "Rack identity", body: "One ID for its life", tint: "#299764" },
  { icon: MapPinIcon, title: "Row + bay location", body: "Where it stands", tint: "#3E63DD" },
  { icon: QueueListIcon, title: "Component registry", body: "Uprights, beams, braces", tint: "#E5484D" },
  { icon: ArrowPathIcon, title: "Inspection cycle", body: "Scope and schedule", tint: "#6647F0" },
  { icon: ClipboardDocumentCheckIcon, title: "Checklist", body: "The agreed method", tint: "#12A594" },
  { icon: ScaleIcon, title: "Measurements", body: "Recorded, not recalled", tint: "#F76808" },
  { icon: CameraIcon, title: "Photo evidence", body: "Proof with the finding", tint: "#E5484D" },
  { icon: ExclamationTriangleIcon, title: "RAG risk", body: "Red, amber, green", tint: "#0091FF" },
  { icon: WrenchScrewdriverIcon, title: "Corrective action", body: "Owner and due date", tint: "#FFC53D" },
  { icon: Cog6ToothIcon, title: "Repair / replacement", body: "What it needs", tint: "#AB4ABA" },
  { icon: CheckBadgeIcon, title: "Verification", body: "Closure, evidenced", tint: "#5A3CD7" },
  { icon: ChartBarIcon, title: "Lifecycle trend", body: "Cycle against cycle", tint: "#E93D82" },
];

export function RdsOverview() {
  return (
    <Section surface="offWhite" id="overview">
      <SectionHeader
        eyebrow="Product overview"
        top="The operating record"
        bottom="For rack safety."
        size="compact"
        width="wide"
        body="IRDS creates a persistent rack safety layer on the Digital Twin—connecting assets, inspections, risk, evidence, maintenance, procurement and verification."
      />

      <style>{`
        /* The whole hover is the white rectangle. No lift, no icon scale —
           twelve items moving under the cursor is noise at this density. */
        .rdsov-card {
          border-radius: 12px;
          background: transparent;
          transition: background .25s ease;
        }
        .rdsov-card:hover {
          background: #FFFFFF;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06);
        }
      `}</style>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-[1120px] mx-auto">
        {TILES.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: (i % 4) * 0.07, ease: EASE }}
            className="rdsov-card flex items-start gap-3.5 p-4"
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
