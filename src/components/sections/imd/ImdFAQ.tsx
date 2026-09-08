"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 10 — FAQ.
 *
 * `TwinFAQ`, value for value: hairline rows on the section ground rather than
 * cards, question at card-title weight, answer at body, and a toggle made of
 * two spans forming a cross — the vertical one scales to zero when the row
 * opens, so plus becomes minus in one transform rather than swapping an icon.
 *
 * Two of the six answers are a flat no, and both are load-bearing. IMDS does
 * not replace the OEM diagnostic tool, and it cannot predict every
 * breakdown. A diagnostics product that implies either invites a workshop
 * to skip manufacturer procedure or a fleet manager to stop inspecting —
 * so the answers name the qualified technician and the data conditions
 * prediction actually depends on.
 */

const FAQS: [string, string][] = [
  [
    "Can IMDS connect to every make of MHE?",
    "MHE data availability differs by manufacturer, model, controller and customer access. IMDS compatibility is validated asset-by-asset before parameters or fault codes are used operationally.",
  ],
  [
    "Does IMDS replace the OEM diagnostic tool?",
    "No. IMDS provides connected monitoring, context, workflow and lifecycle intelligence. OEM diagnostic tools and qualified technicians remain necessary for manufacturer-specific troubleshooting, calibration and repair.",
  ],
  [
    "How do WMS, ERP, CCTV and RFID help?",
    "WMS can add task context, ERP can add cost and procurement data, CCTV can provide permitted event evidence, and RFID can support identity or movement context. Each integration is scoped and validated separately.",
  ],
  [
    "Can IMDS predict every breakdown?",
    "No. It can surface supported conditions, thresholds and patterns that warrant review. Predictive performance depends on reliable data, validated failure signatures and sufficient history.",
  ],
  [
    "Can a fault automatically create maintenance work?",
    "Yes, for approved conditions and connected workflows. Deployments can begin with recommendations and human approval before automating selected work-order creation or equipment restrictions.",
  ],
  [
    "Can we start with one MHE model or battery fleet?",
    "Yes. A focused pilot is usually the clearest way to validate data access, diagnostic mapping, maintenance workflow and measurable operational value before scaling.",
  ],
];

const HAIR = "#E0E0E6";

function Toggle({ open }: { open: boolean }) {
  return (
    <span aria-hidden className="relative w-3.5 h-3.5 shrink-0 mt-1">
      <span
        className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full"
        style={{ background: "#FF6A00" }}
      />
      <motion.span
        className="absolute top-0 bottom-0 left-1/2 w-[2px] -translate-x-1/2 rounded-full origin-center"
        style={{ background: "#FF6A00" }}
        initial={false}
        animate={{ scaleY: open ? 0 : 1 }}
        transition={{ duration: 0.3, ease: EASE }}
      />
    </span>
  );
}

export function ImdFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section surface="white" id="faq">
      <SectionHeader
        eyebrow="FAQ"
        top="Questions fleet and"
        bottom="Maintenance teams ask."
        size="compact"
        width="wide"
      />

      <div
        className="max-w-[900px] mx-auto"
        style={{ borderTop: `1px solid ${HAIR}` }}
      >
        {FAQS.map(([q, a], i) => {
          const on = open === i;
          return (
            <div key={q} style={{ borderBottom: `1px solid ${HAIR}` }}>
              <button
                type="button"
                onClick={() => setOpen(on ? null : i)}
                aria-expanded={on}
                className="w-full flex items-start justify-between gap-6 text-left py-6 group"
              >
                <span
                  className={
                    "text-[16px] sm:text-[17px] font-bold tracking-[-0.015em] leading-[1.4] transition-colors duration-300 " +
                    (on
                      ? "text-carbon"
                      : "text-carbon/85 group-hover:text-carbon")
                  }
                >
                  {q}
                </span>
                <Toggle open={on} />
              </button>

              <AnimatePresence initial={false}>
                {on && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <p className="pb-7 pr-10 text-[14.5px] leading-[1.7] text-graphite/65">
                      {a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
