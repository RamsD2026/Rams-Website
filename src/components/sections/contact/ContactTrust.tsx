"use client";

import { motion } from "framer-motion";
import { Cable, FileCheck2, LifeBuoy, ShieldCheck } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 02 — What a working relationship looks like.
 *
 * Four points under the hero: an icon, a heading, a line. No tile, no border,
 * no card — the site's bare-column treatment, which is what it uses for a
 * statement of position rather than a set of things on offer.
 *
 * ── They are about security, access and support ─────────────────────
 * These four replaced a set about the company's origins — engineering first,
 * evidence, offices, start small. Those read as an about page. What a
 * prospective customer wants to know before they write is who will hold their
 * data, what the platform will be allowed to do inside their systems, and
 * what happens when something breaks.
 *
 * ── Every one is sourced, and none is a certification claim ─────────
 * A trust section is the easiest place on a site to write something that
 * cannot be backed, so each of these traces to copy already published in this
 * project:
 *
 *   Scoped access        the AIMS FAQ — permissions, and high-impact
 *                        decisions behind authorised human approval
 *   Your systems         `AboutBuilt`'s business-systems layer — read, and
 *   stay yours           write back only where it is approved
 *   Evidence you can     the partner programme's delivery standard —
 *   audit                attributable records for inspections, actions,
 *                        changes and acceptance
 *   A support route      the contact document's own triage fields: site,
 *                        module, time and operational impact
 *
 * Deliberately absent: a certification name, an uptime figure, a response
 * time and a customer count. The footer carries the SOC badges the company
 * publishes; restating a standard in body copy is how a page ends up claiming
 * a scope the certificate does not cover, and the other three are not written
 * down anywhere in this repository.
 *
 * ── The icons are bare and orange ───────────────────────────────────
 * No tile behind them. The hero directly above already carries five orange
 * discs, and four more filled shapes under it would make the top of this page
 * a field of orange circles.
 */

const POINTS: { icon: typeof ShieldCheck; title: string; body: string }[] = [
  {
    icon: ShieldCheck,
    title: "Access is scoped",
    body: "Permissions, roles, sites and modules are configured per customer, and high-impact actions stay behind authorised human approval.",
  },
  {
    icon: Cable,
    title: "Your systems stay yours",
    body: "RAMS reads from the sources you approve and writes back only where you have authorised it. Your records remain your records.",
  },
  {
    icon: FileCheck2,
    title: "Evidence you can audit",
    body: "Inspections, actions, changes and acceptance carry attributable records, so any finding traces back to who saw it and when.",
  },
  {
    icon: LifeBuoy,
    title: "A support route, not an inbox",
    body: "Existing customers raise an issue with the site, module, time and operational impact, and it is triaged by the team that owns it.",
  },
];

export function ContactTrust() {
  return (
    <Section surface="white" id="why">
      <SectionHeader
        eyebrow="Working with RAMS"
        top="What happens to your"
        bottom="Data, access and issues."
        size="compact"
        width="wide"
        body="Before the first conversation, the four things most operations teams want settled."
        className="!mb-10 sm:!mb-12"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
        {POINTS.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
            className="flex flex-col"
          >
            <p.icon
              className="w-[24px] h-[24px] shrink-0 text-signal-orange"
              strokeWidth={1.9}
              aria-hidden
            />

            <h3 className="mt-5 text-[19px] sm:text-[20px] font-semibold tracking-[-0.02em] text-carbon leading-[1.25]">
              {p.title}
            </h3>

            <p className="mt-2.5 text-[14px] leading-[1.65] text-graphite/60">
              {p.body}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
