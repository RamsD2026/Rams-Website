"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Boxes,
  Brain,
  LayoutGrid,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 03 — Where to go next.
 *
 * `CaseOutcomes` is the reference: six bare columns, an icon, a heading, a
 * line, no box. The layout is value for value and only the job differs.
 *
 * ── Why this and not a list of topics ───────────────────────────────
 * The obvious section here is "what the films cover", six subjects in a row.
 * There are five films covering three subjects, so five of those six columns
 * would be describing footage that does not exist — the same over-claim the
 * catalogue in `video-data` is careful to avoid.
 *
 * These are pages instead, and every one of them is a route that resolves
 * today. A visitor who has just watched two minutes of hardware wants the
 * page about the hardware, and a resources page whose job ends at "hope you
 * enjoyed it" has stopped one step early.
 *
 * ── They are links, which `CaseOutcomes` is not ─────────────────────
 * That section names measurement categories; there is nowhere for them to go.
 * These are destinations, so the whole column is the target and the arrow
 * steps out on hover — the same affordance the case cards use for "Read case
 * study", turned up rather than right because it leaves the page.
 */

const NEXT: {
  icon: typeof ShieldCheck;
  title: string;
  body: string;
  href: string;
}[] = [
  {
    icon: ShieldCheck,
    title: "Rack safety",
    body: "IRDS — inspection, findings and rack health, the product in the film above.",
    href: "/platform/irds",
  },
  {
    icon: Boxes,
    title: "Digital twin",
    body: "The estate as a live model: every bay and upright an object with a condition.",
    href: "/platform/digital-twin",
  },
  {
    icon: Truck,
    title: "MHE safety",
    body: "RTSS — impact detection, near-miss alerting and pedestrian separation.",
    href: "/platform/rtss",
  },
  {
    icon: Wrench,
    title: "Fleet health",
    body: "IMDS — the hours, cycles and faults the sensor film is reading off the machine.",
    href: "/platform/imds",
  },
  {
    icon: Brain,
    title: "AI intelligence",
    body: "AIMS — what the platform does with everything the hardware sends it.",
    href: "/platform/ai-operational-intelligence",
  },
  {
    icon: LayoutGrid,
    title: "The whole platform",
    body: "How the modules, the edge units and the twin fit together on one site.",
    href: "/platform/overview",
  },
];

export function VideoNext() {
  return (
    <Section surface="offWhite" id="next">
      <SectionHeader
        eyebrow="Where to go next"
        top="The pages behind"
        bottom="The footage."
        size="compact"
        width="wide"
        body="Each film belongs to a part of the platform. These are the pages that explain them."
        className="!mb-10 sm:!mb-12"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
        {NEXT.map((n, i) => (
          <motion.div
            key={n.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.07, ease: EASE }}
          >
            <Link href={n.href} className="group flex flex-col">
              <n.icon
                className="w-[24px] h-[24px] shrink-0 text-signal-orange"
                strokeWidth={1.9}
                aria-hidden
              />

              <h3 className="mt-5 inline-flex items-center gap-1.5 text-[19px] sm:text-[20px] font-semibold tracking-[-0.02em] text-carbon leading-[1.25] transition-colors duration-300 group-hover:text-signal-orange">
                {n.title}
                <ArrowUpRight
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </h3>

              <p className="mt-2.5 text-[14px] leading-[1.65] text-graphite/60">
                {n.body}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
