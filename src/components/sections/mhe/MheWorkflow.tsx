"use client";

import { motion } from "framer-motion";
import { Cable, UserCheck, Activity, BellRing, TrendingUp } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const STEPS = [
  {
    n: "01",
    icon: Cable,
    title: "Connect",
    body: "Equip MHEs with the required safety and monitoring hardware stack.",
  },
  {
    n: "02",
    icon: UserCheck,
    title: "Identify",
    body: "Link equipment usage with authorised operators, shifts and operational zones.",
  },
  {
    n: "03",
    icon: Activity,
    title: "Monitor",
    body: "Track location, events, speed, impacts and active operating behaviour in real time.",
  },
  {
    n: "04",
    icon: BellRing,
    title: "Alert",
    body: "Generate alerts for unsafe events, threshold violations and abnormal movement patterns.",
  },
  {
    n: "05",
    icon: TrendingUp,
    title: "Improve",
    body: "Use trend analysis and utilisation insights to improve safety and productivity over time.",
  },
];

export function MheWorkflow() {
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
            A connected{" "}
            <span className="text-signal-orange">MHE monitoring workflow.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-base sm:text-lg text-graphite/60 leading-[1.65] max-w-[620px]"
          >
            RAMS connects fleet hardware, operator identity and movement
            intelligence into a single process for monitoring, alerting and
            performance analysis.
          </motion.p>
        </div>

        {/* Steps — 5 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-5 gap-y-6">
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
                <span
                  aria-hidden
                  className="absolute top-3 right-4 text-5xl sm:text-6xl font-extrabold tabular-nums tracking-tighter text-carbon/[0.06] leading-none select-none group-hover:text-signal-orange/15 transition-colors duration-300"
                >
                  {step.n}
                </span>

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
