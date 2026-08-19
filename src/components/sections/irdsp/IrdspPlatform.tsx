"use client";

import { motion } from "framer-motion";
import { EASE, ORANGE_SOFT, Section } from "./irdsp-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/** The real IRDS module list, as it appears in the product sidebar. */
const MODULES = [
  { name: "Dashboard", body: "Rack health, stability, open actions and the observation lifecycle at a glance." },
  { name: "Project Planner", body: "Schedule inspection cycles and assign them across sites and teams." },
  { name: "Inspection", body: "Run the inspection against the rack structure, element by element." },
  { name: "Inspection Cycle Insights", body: "How each cycle performed — coverage, duration and outcomes." },
  { name: "Inspection Findings", body: "Every observation raised, with location, severity and evidence." },
  { name: "TPI Findings", body: "Third-party inspection results held alongside your own." },
  { name: "Integrity Test", body: "Structured engineering tests with readings, thresholds and results." },
  { name: "Rack Health Analytics", body: "2D and 3D rack condition with issues highlighted by severity." },
  { name: "Call To Action", body: "Corrective actions with owners, due dates and completion status." },
  { name: "Bill Of Quantity", body: "Quantities and materials required to close the open work." },
  { name: "Element Stock Management", body: "Spare rack components tracked against what the repairs need." },
  { name: "Purchase Request & Specs", body: "Requests and specifications generated from the work identified." },
  { name: "Maintenance", body: "Repair activity recorded against the elements it was carried out on." },
  { name: "Compliance", body: "The record of what was found, what was done and when." },
  { name: "Rules and Action", body: "Configure checkpoints, issue definitions and the actions they trigger." },
  { name: "Escalation Logs", body: "What was escalated, to whom, and how it was resolved." },
  { name: "LARC Drawings", body: "Rack drawings held against the structure they describe." },
  { name: "Report", body: "Compose, version and publish reports from captured data." },
];

export function IrdspPlatform() {
  return (
    <Section id="platform" surface="darkMid">
      <SectionHeader
        tone="dark"
        eyebrow="The platform"
        top="Everything your"
        bottom="inspection team needs."
        body="Eighteen modules, one data model. Each one reads the same rack structure, so nothing has to be re-entered or reconciled."
      />

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.09)" }}
      >
        {MODULES.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: (i % 3) * 0.06, ease: EASE }}
            className="flex flex-col px-6 py-7 -mb-px -mr-px transition-colors duration-300 hover:bg-white/[0.03]"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.09)",
              borderRight: "1px solid rgba(255,255,255,0.09)",
            }}
          >
            <div className="flex items-baseline gap-2.5">
              <span
                className="text-[9.5px] font-mono font-bold tabular-nums shrink-0"
                style={{ color: ORANGE_SOFT }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[15px] font-semibold tracking-[-0.01em]">
                {m.name}
              </h3>
            </div>
            <p className="mt-2.5 text-[12.5px] text-white/45 leading-[1.6] pl-[26px]">
              {m.body}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
