"use client";

import { motion } from "framer-motion";
import {
  Boxes,
  Building2,
  Cpu,
  Forklift,
  HardHat,
  Lightbulb,
  MapPinned,
  Terminal,
} from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 09 — Who should partner with RAMS.
 *
 * Eight organisation types in a four-by-two, and the flattest cards on the
 * page: a small icon, the type, one line. No badge, no bullets, no hover
 * sweep.
 *
 * ── Why they are quiet ──────────────────────────────────────────────
 * Sections 05 and 06 already run the loud card — a mono code badge, a rule
 * and three ticks. Those describe what a partner does, and are worth reading
 * in full. This one is a list the reader scans for themselves and stops at
 * one entry; making eight of those as heavy as six of those would bury the
 * section that matters more. The whole card is 20px of type over an icon.
 *
 * ── The icons ───────────────────────────────────────────────────────
 * One per type, none repeating anything else on this page — `PartnersWhy`
 * holds PlugZap, Target, Workflow and Handshake, `PartnersHow` holds
 * ScanSearch, BadgeCheck, GraduationCap, Rocket and TrendingUp.
 *
 * They are graphite rather than orange: eight orange tiles in a block is most
 * of the section's colour spent on decoration, and the palette puts orange at
 * "5% — CTAs, critical emphasis only".
 */

const FITS: { icon: typeof Boxes; title: string; body: string }[] = [
  {
    icon: Boxes,
    title: "Rack OEMs & integrators",
    body: "Extend installation relationships into inspection, lifecycle and digital visibility.",
  },
  {
    icon: Forklift,
    title: "MHE OEMs & dealers",
    body: "Add utilisation, safety, diagnostics and maintenance intelligence.",
  },
  {
    icon: Cpu,
    title: "Industrial technology firms",
    body: "Connect sensing, vision, automation and enterprise systems.",
  },
  {
    icon: HardHat,
    title: "Safety & inspection firms",
    body: "Digitise evidence, action closure and multi-site delivery.",
  },
  {
    icon: Lightbulb,
    title: "Consultants & advisors",
    body: "Bring operational insight into transformation programmes.",
  },
  {
    icon: Building2,
    title: "3PL specialists",
    body: "Deliver connected services across customer sites and operations.",
  },
  {
    icon: Terminal,
    title: "Software providers",
    body: "Create connected workflows across business and physical systems.",
  },
  {
    icon: MapPinned,
    title: "Regional channel firms",
    body: "Develop qualified markets with local relationships and support.",
  },
];

export function PartnersFit() {
  return (
    <Section surface="white" id="fit">
      <SectionHeader
        eyebrow="Who should partner with RAMS"
        top="Organisations close"
        bottom="To physical operations."
        size="compact"
        width="wide"
        body="The strongest fit comes from partners who already understand industrial assets, warehouse workflows, safety or enterprise technology."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-11">
        {FITS.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: (i % 4) * 0.06, ease: EASE }}
            className="flex flex-col"
          >
            <f.icon
              className="w-[22px] h-[22px] text-graphite/45"
              strokeWidth={1.75}
              aria-hidden
            />

            {/* Two lines reserved — six of the eight titles wrap at a quarter
                of the measure. */}
            <h3 className="mt-5 min-h-[2.4em] text-[17px] sm:text-[18px] font-semibold tracking-[-0.02em] text-carbon leading-[1.25]">
              {f.title}
            </h3>

            <p className="mt-2 text-[13.5px] leading-[1.6] text-graphite/60">
              {f.body}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
