"use client";

import { motion } from "framer-motion";
import {
  Boxes,
  Building2,
  Check,
  Forklift,
  Users,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Who does what next.
 *
 * The four things an event can land on — the operator, the machine, the
 * structure, the building — and the specific work each one implies. It is the
 * counterpart to the closure flow in the section above: that one shows the
 * route, this one shows who walks it.
 */

const LINE = "#E8E8ED";

/* Each subline says when that owner is the right answer — the page has
   already argued that the same event count can point at a person, a machine
   or a place, so the card has to say which case it covers. */
const OWNERS: {
  ix: string;
  t: string;
  sub: string;
  items: string[];
  Icon: LucideIcon;
}[] = [
  {
    ix: "Operator",
    t: "People",
    sub: "When the events follow the operator rather than the place.",
    items: ["Skill training", "Behaviour coaching"],
    Icon: Users,
  },
  {
    ix: "MHE",
    t: "Machine",
    sub: "When the events follow one machine across different operators.",
    items: ["Inspection", "Maintenance review"],
    Icon: Forklift,
  },
  {
    ix: "Rack",
    t: "Structure",
    sub: "When the event sits against rack and the condition has to be confirmed.",
    items: ["IRDS inspection", "Repair or replacement where required"],
    Icon: Boxes,
  },
  {
    ix: "Environment",
    t: "The building",
    sub: "When the events cluster at a place rather than with a person.",
    items: [
      "Floor repair · rack protection",
      "Layout, traffic and speed-zone review",
    ],
    Icon: Building2,
  },
];

export function RtssOwners() {
  return (
    <Section surface="warm" id="owners" padding="tight">
      <SectionHeader
        eyebrow="Next steps"
        top="Who needs to do what next?"
        size="compact"
        width="wide"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1180px] mx-auto">
        {OWNERS.map((o, i) => (
          <motion.article
            key={o.t}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
            className="flex flex-col p-6 bg-white"
            style={{
              borderRadius: 14,
              border: `1px solid ${LINE}`,
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
            }}
          >
            <span
              className="w-10 h-10 rounded-[11px] flex items-center justify-center"
              style={{
                background: "rgba(255,106,0,0.08)",
                border: "1px solid rgba(255,106,0,0.2)",
              }}
            >
              <o.Icon
                className="w-[18px] h-[18px] text-signal-orange"
                strokeWidth={1.8}
                aria-hidden
              />
            </span>

            <span className="mt-5 text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
              {o.ix}
            </span>
            <h3 className="mt-1.5 text-[19px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
              {o.t}
            </h3>
            <p className="mt-2.5 text-[13px] text-graphite/55 leading-[1.6]">
              {o.sub}
            </p>

            <ul
              className="mt-5 pt-5 flex flex-col gap-2.5"
              style={{ borderTop: `1px solid ${LINE}` }}
            >
              {o.items.map((it) => (
                <li key={it} className="flex items-start gap-2.5">
                  <span
                    aria-hidden
                    className="w-[18px] h-[18px] rounded-full bg-signal-orange flex items-center justify-center shrink-0 mt-px"
                  >
                    <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                  </span>
                  <span className="text-[13.5px] text-graphite/65 leading-[1.55]">
                    {it}
                  </span>
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
