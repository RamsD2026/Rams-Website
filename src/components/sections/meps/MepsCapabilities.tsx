"use client";

import { motion } from "framer-motion";
import {
  Radar,
  UserCog,
  Gauge,
  ShieldAlert,
  MapPin,
  BatteryCharging,
} from "lucide-react";

const CAPS = [
  {
    icon: Radar,
    title: "Real-time Vehicle Tracking",
    body: "Every MHE unit reports position, speed, and status continuously — no dead spots, no manual logging.",
    meta: "Live · < 50ms",
  },
  {
    icon: UserCog,
    title: "Operator Behaviour Analytics",
    body: "Identify each operator by RFID or vision. Score driving patterns, restricted-zone events, and safety interactions.",
    meta: "Per-operator scoring",
  },
  {
    icon: Gauge,
    title: "Idle Time and Utilisation",
    body: "Distinguish productive minutes from idle, wait, and travel. Surface underused assets before they cost you.",
    meta: "Minute-level resolution",
  },
  {
    icon: ShieldAlert,
    title: "Impact and Collision Detection",
    body: "3-axis accelerometers flag every impact instantly. Photo, location, operator — captured, escalated, actionable.",
    meta: "Automated escalation",
  },
  {
    icon: MapPin,
    title: "Zone Compliance and Speed Governance",
    body: "Enforce speed limits and restricted areas by zone. Auto-throttle and alert on breach — hardware-level enforcement.",
    meta: "Edge-enforced",
  },
  {
    icon: BatteryCharging,
    title: "Battery Health and Charge Cycles",
    body: "Live SOC, temperature, and cycle count for every battery. Predict end-of-life and prevent shift downtime.",
    meta: "Predictive lifecycle",
  },
];

export function MepsCapabilities() {
  return (
    <section className="bg-off-white-cool py-24 sm:py-32 lg:py-40 overflow-hidden">
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
            Core Capabilities
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-[34px] sm:text-[46px] lg:text-[56px] font-bold text-carbon leading-[1.06] tracking-[-0.02em]"
          >
            Six systems.
            <br />
            <span className="text-signal-orange">One connected fleet.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-[15px] sm:text-[17px] text-graphite/60 leading-[1.65] max-w-[560px]"
          >
            MEPS ships as a unified capability set — every module runs on the
            same edge stack, backed by the same data model.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-steel-soft border border-steel-soft">
          {CAPS.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <motion.article
                key={cap.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: (i % 3) * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative bg-white p-8 lg:p-10 hover:bg-off-white-hover transition-colors duration-200"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="w-11 h-11 border border-steel-soft bg-off-white-cool flex items-center justify-center group-hover:border-signal-orange group-hover:bg-white transition-colors duration-200">
                    <Icon
                      className="w-5 h-5 text-graphite group-hover:text-signal-orange transition-colors duration-200"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-graphite/40">
                    0{i + 1}
                  </span>
                </div>

                <h3 className="text-[19px] sm:text-[20px] font-bold text-carbon leading-[1.25] mb-3">
                  {cap.title}
                </h3>
                <p className="text-sm text-graphite/65 leading-[1.6] mb-6">
                  {cap.body}
                </p>

                <div className="flex items-center gap-2 pt-5 border-t border-off-white-warm">
                  <div className="w-1.5 h-1.5 bg-signal-orange" />
                  <p className="text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
                    {cap.meta}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
