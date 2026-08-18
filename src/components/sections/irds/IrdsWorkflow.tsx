"use client";

import { motion } from "framer-motion";
import { MapPin, ClipboardCheck, ListChecks, Gauge, Wrench, ShieldCheck } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const STEPS = [
  {
    n: "01",
    icon: MapPin,
    title: "Map",
    body: "Create the digital rack hierarchy for site, zone, row, bay and element.",
  },
  {
    n: "02",
    icon: ClipboardCheck,
    title: "Inspect",
    body: "Record condition, photographs, measurements and observations at the rack location.",
  },
  {
    n: "03",
    icon: ListChecks,
    title: "Classify",
    body: "Prioritise findings using defined severity and rack-safety rules.",
  },
  {
    n: "04",
    icon: Gauge,
    title: "Quantify",
    body: "Measure severity, exposure and impact to translate findings into a rack-health score.",
  },
  {
    n: "05",
    icon: Wrench,
    title: "Rectify",
    body: "Convert findings into accountable corrective actions with status and ownership.",
  },
  {
    n: "06",
    icon: ShieldCheck,
    title: "Verify",
    body: "Close the loop with evidence, verification and an updated rack-health view.",
  },
];

export function IrdsWorkflow() {
  return (
    <section className="bg-off-white-cool py-24 sm:py-32 lg:py-40 overflow-hidden">
      <div className="rams-container">
        {/* Header — stacked */}
        <div className="max-w-[860px] mb-14 sm:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45 }}
            className="text-[10.5px] font-mono font-bold tracking-[0.22em] uppercase text-signal-orange mb-4"
          >
            Workflow
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-carbon leading-[1.04] tracking-[-0.03em]"
          >
            A closed-loop{" "}
            <span className="text-signal-orange">rack safety process.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-base sm:text-lg text-graphite/60 leading-[1.65] max-w-[620px]"
          >
            Designed to connect the physical inspection on the warehouse floor
            with management-level visibility and measurable closure.
          </motion.p>
        </div>

        {/* Steps — 6 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-x-5 gap-y-6">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.article
                key={step.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.06,
                  ease: EASE,
                }}
                className="group relative bg-white border border-steel-cool rounded-lg p-6 min-h-[240px] overflow-hidden hover:border-signal-orange/50 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(11,22,25,0.35)] transition-all duration-300"
              >
                {/* Large light number — top-right corner */}
                <span
                  aria-hidden
                  className="absolute top-3 right-4 text-5xl sm:text-6xl font-extrabold tabular-nums tracking-tighter text-carbon/[0.06] leading-none select-none group-hover:text-signal-orange/15 transition-colors duration-300"
                >
                  {step.n}
                </span>

                {/* Icon — top-left, no background */}
                <Icon
                  className="relative w-6 h-6 text-carbon-teal mb-6 group-hover:text-signal-orange transition-colors duration-300"
                  strokeWidth={1.75}
                  aria-hidden
                />

                <h3 className="relative text-lg sm:text-xl font-bold text-carbon leading-[1.2] mb-2">
                  {step.title}
                </h3>
                <p className="relative text-[13px] text-graphite/65 leading-[1.6]">
                  {step.body}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
