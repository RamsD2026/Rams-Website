"use client";

import { motion } from "framer-motion";
import { Cpu, Radio, Brain, Zap } from "lucide-react";

const STEPS = [
  {
    icon: Cpu,
    step: "01",
    title: "Onboard MHE",
    body: "Retrofit any forklift with the OmniBox edge unit and sensor stack. No OEM lock-in, no rewiring — install in under 30 minutes.",
    ttl: "< 30 min per unit",
  },
  {
    icon: Radio,
    step: "02",
    title: "Capture at the Edge",
    body: "Vehicle telemetry, operator identity, impacts, and location stream continuously from OmniBox to the RAMS edge layer.",
    ttl: "< 50ms telemetry",
  },
  {
    icon: Brain,
    step: "03",
    title: "Process with AI",
    body: "MEPS models classify events, correlate operator behaviour with outcomes, and surface anomalies before they become incidents.",
    ttl: "Streaming inference",
  },
  {
    icon: Zap,
    step: "04",
    title: "Act in Real Time",
    body: "Auto-throttle speed in zones, escalate impact events, push utilisation dashboards, and sync back to your WMS.",
    ttl: "Closed-loop control",
  },
];

export function MepsHowItWorks() {
  return (
    <section className="bg-carbon py-24 sm:py-32 lg:py-40 overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-14">
        {/* Header */}
        <div className="mb-14 sm:mb-20 max-w-[720px]">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45 }}
            className="text-[10.5px] font-mono font-bold tracking-[0.22em] uppercase text-signal-orange mb-4"
          >
            How It Works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-[34px] sm:text-[46px] lg:text-[56px] font-bold text-white leading-[1.06] tracking-[-0.02em]"
          >
            From vehicle
            <br />
            to <span className="text-signal-orange">real-time action.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-[15px] sm:text-[17px] text-white/55 leading-[1.65] max-w-[560px]"
          >
            A single loop connecting hardware, edge inference, and your
            operational systems — no batch jobs, no manual sync.
          </motion.p>
        </div>

        {/* Flow */}
        <div className="relative">
          {/* Connecting line */}
          <div
            aria-hidden
            className="hidden lg:block absolute left-0 right-0 top-[68px] h-px"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,106,0,0) 0%, rgba(255,106,0,0.5) 15%, rgba(255,106,0,0.5) 85%, rgba(255,106,0,0) 100%)",
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative"
                >
                  {/* Icon node */}
                  <div className="relative z-10 w-[136px] h-[136px] border border-white/15 bg-[#161617] flex items-center justify-center mb-6 group">
                    <div className="absolute inset-3 border border-white/5" />
                    <Icon
                      className="w-9 h-9 text-signal-orange"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <span className="absolute top-3 right-3 text-[9.5px] font-mono font-bold tracking-[0.18em] uppercase text-white/30">
                      {s.step}
                    </span>
                  </div>

                  <h3 className="text-[18px] sm:text-[20px] font-bold text-white leading-tight mb-3">
                    {s.title}
                  </h3>
                  <p className="text-[14px] text-white/55 leading-[1.65] mb-6">
                    {s.body}
                  </p>

                  <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                    <div className="w-1.5 h-1.5 bg-signal-orange" />
                    <p className="text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
                      {s.ttl}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
