"use client";

import { motion } from "framer-motion";
import {
  ArchiveBoxIcon,
  BeakerIcon,
  BoltIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CubeIcon,
  HeartIcon,
  MapPinIcon,
  QueueListIcon,
  ShareIcon,
  ShieldCheckIcon,
  SignalIcon,
  Squares2X2Icon,
  TruckIcon,
  WindowIcon,
} from "@heroicons/react/24/solid";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 03 — Product overview.
 *
 * The sixteen things the twin holds about a facility, four across and four
 * down, as coloured tiles — the ClickUp-style treatment from the supplied
 * reference, over the site's own centred `SectionHeader`.
 *
 * Icons come from `@heroicons/react/24/solid`, not lucide. Lucide is a stroke
 * set: at 21px on a saturated tile its hairlines disappear, and it has no
 * filled variant to switch to. Heroicons ships a solid set drawn to be filled,
 * which is why it is the one place on this site that does not use lucide.
 *
 * Every `body` is kept under about 25 characters on purpose. The text column
 * is roughly 190px at `lg`, which takes one line of 13px and no more; a longer
 * line wraps and the row below it stops aligning. Check the width before
 * lengthening one.
 *
 * The sixteen tints were sampled pixel-by-pixel out of the supplied reference
 * and applied in the same row-major order, so the colour layout of this grid
 * matches it position for position. Three repeat because the reference repeats
 * them (#E5484D, #F76808 and #6647F0 each appear twice); the sixteenth tile
 * there is a white composite of four mini-icons rather than a solid, so
 * Compliance takes the green from position one.
 *
 * Note what this costs: every other card grid on this site puts one
 * signal-orange icon in a tinted orange tile, because the brand rules keep
 * orange at 5% and reserve the RAG set for risk state. This grid is
 * deliberately polychrome — sixteen items read as a list rather than a system
 * when they are all one colour — and the tints carry no meaning, so nothing
 * here can be misread as a severity. `TILES` is the whole palette; it lives in
 * one place so it can be collapsed back to orange in a single edit.
 */

const TILES = [
  {
    icon: CubeIcon,
    tint: "#299764",
    title: "Geometry",
    body: "The building, measured",
  },
  {
    icon: ArchiveBoxIcon,
    tint: "#3E63DD",
    title: "Assets",
    body: "Every thing, identified",
  },
  {
    icon: MapPinIcon,
    tint: "#E5484D",
    title: "Locations",
    body: "One address, agreed",
  },
  {
    icon: ShareIcon,
    tint: "#6647F0",
    title: "Relationships",
    body: "What sits next to what",
  },
  {
    icon: Squares2X2Icon,
    tint: "#12A594",
    title: "Zones",
    body: "Areas and restrictions",
  },
  {
    icon: HeartIcon,
    tint: "#F76808",
    title: "Condition",
    body: "State against standard",
  },
  {
    icon: ClockIcon,
    tint: "#E5484D",
    title: "History",
    body: "Every state, retained",
  },
  {
    icon: TruckIcon,
    tint: "#0091FF",
    title: "Movement",
    body: "Equipment and pallets",
  },
  {
    icon: BoltIcon,
    tint: "#FFC53D",
    title: "Events",
    body: "Impacts and exceptions",
  },
  {
    icon: ChartBarIcon,
    tint: "#AB4ABA",
    title: "Operational data",
    body: "Throughput, utilisation",
  },
  {
    icon: SignalIcon,
    tint: "#5A3CD7",
    title: "Sensors",
    body: "Live readings, in place",
  },
  {
    icon: WindowIcon,
    tint: "#E93D82",
    title: "Applications",
    body: "Everything built on top",
  },
  {
    icon: BeakerIcon,
    tint: "#F76808",
    title: "Simulation",
    body: "Change, tested first",
  },
  {
    icon: QueueListIcon,
    tint: "#6647F0",
    title: "Tasks",
    body: "Work, where it happens",
  },
  {
    icon: ClipboardDocumentCheckIcon,
    tint: "#00B499",
    title: "Maintenance",
    body: "Repairs and actions",
  },
  {
    icon: ShieldCheckIcon,
    tint: "#299764",
    title: "Compliance",
    body: "Standards and evidence",
  },
];

export function TwinOverview() {
  return (
    <Section surface="offWhite" id="overview">
      <SectionHeader
        eyebrow="Product overview"
        top="The physical world,"
        bottom="Digitally organised."
        size="compact"
        width="wide"
        body="RAMS Digital Twin creates a persistent digital representation of the facility and everything operating inside it."
      />

      <style>{`
        /* The whole hover is the grey rectangle. No lift, no icon scale —
           sixteen items moving under the cursor is noise at this density. */
        .twinov-card {
          border-radius: 12px;
          background: transparent;
          transition: background .25s ease;
        }
        /* The section ground is #F5F5F7 now, so the hover has to be white
           to read at all — the tint that worked on a white section is
           invisible on a grey one. */
        .twinov-card:hover {
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
            transition={{
              duration: 0.55,
              delay: (i % 4) * 0.07,
              ease: EASE,
            }}
            className="twinov-card flex items-start gap-3.5 p-4"
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
