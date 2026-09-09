"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Eye,
  FileCheck2,
  PiggyBank,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 03 — What we measure.
 *
 * Six categories, as bare columns: an icon, a heading, a line. No box.
 *
 * ── They are categories, not results ────────────────────────────────
 * The heading under the eyebrow says so and the body says why: no two sites
 * are the same, so the metrics are agreed per engagement and these are the
 * groups they fall into. That distinction is the whole section — a page that
 * printed six numbers here would be claiming outcomes it has not measured on
 * the reader's site, and the case studies above are already careful not to.
 *
 * So there is no figure anywhere in this section, deliberately.
 *
 * ── The icons ───────────────────────────────────────────────────────
 *   ShieldCheck  safety is the risk caught before it is a failure
 *   FileCheck2   compliance is the evidence, signed off
 *   Activity     continuity is the operation still running
 *   PiggyBank    cost avoidance is the spend that did not happen
 *   Eye          visibility is being able to see it
 *   UserCheck    accountability is a finding with an owner
 *
 * None repeats one used elsewhere on this page — the cards above carry only
 * a tick, and the close below carries none.
 */

const OUTCOMES: { icon: typeof ShieldCheck; title: string; body: string }[] = [
  {
    icon: ShieldCheck,
    title: "Safety",
    body: "Fewer incidents, and risks caught before they become failures.",
  },
  {
    icon: FileCheck2,
    title: "Compliance",
    body: "Evidence for audits, insurers and EN 15635.",
  },
  {
    icon: Activity,
    title: "Continuity",
    body: "Less unplanned downtime from damaged racking or MHE.",
  },
  {
    icon: PiggyBank,
    title: "Cost avoidance",
    body: "Prioritised remediation, and averted collapse costs.",
  },
  {
    icon: Eye,
    title: "Visibility",
    body: "One view of condition and risk across the estate.",
  },
  {
    icon: UserCheck,
    title: "Accountability",
    body: "Every finding owned and tracked to closure.",
  },
];

export function CaseOutcomes() {
  return (
    <Section surface="offWhite" id="outcomes">
      <SectionHeader
        eyebrow="What we measure"
        top="The outcomes an"
        bottom="Engagement delivers."
        size="compact"
        width="wide"
        body="No two sites are the same, so the metrics that matter are agreed up front. These are the categories they fall into."
        className="!mb-10 sm:!mb-12"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
        {OUTCOMES.map((o, i) => (
          <motion.div
            key={o.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.07, ease: EASE }}
            className="flex flex-col"
          >
            <o.icon
              className="w-[24px] h-[24px] shrink-0 text-signal-orange"
              strokeWidth={1.9}
              aria-hidden
            />

            <h3 className="mt-5 text-[19px] sm:text-[20px] font-semibold tracking-[-0.02em] text-carbon leading-[1.25]">
              {o.title}
            </h3>

            <p className="mt-2.5 text-[14px] leading-[1.65] text-graphite/60">
              {o.body}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
