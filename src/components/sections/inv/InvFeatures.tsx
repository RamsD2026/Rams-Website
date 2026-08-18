"use client";

import { motion } from "framer-motion";
import { Boxes, Scan, MapPinned, Radar, Layers, Gauge } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const FEATURES = [
  {
    icon: Boxes,
    title: "Location-level truth",
    body: "Every pallet, tote and rack position mapped to a live location, reconciled continuously against your WMS.",
  },
  {
    icon: Scan,
    title: "AI vision counting",
    body: "Camera-based recognition confirms physical presence and quantity without operator intervention.",
  },
  {
    icon: MapPinned,
    title: "Spatial digital twin",
    body: "A live 3D twin of your facility — every zone, aisle and bay reflects what's actually on the floor.",
  },
  {
    icon: Radar,
    title: "Anomaly detection",
    body: "Silent drift, phantom stock and misplacements surface the moment they happen — not at cycle count.",
  },
  {
    icon: Layers,
    title: "WMS + ERP sync",
    body: "Bi-directional connectors to SAP, Manhattan, Blue Yonder and Oracle keep every system in agreement.",
  },
  {
    icon: Gauge,
    title: "Executive KPIs",
    body: "Accuracy, coverage and shrink tracked at the site, region and network level in a single view.",
  },
];

export function InvFeatures() {
  return (
    <section
      id="features"
      className="bg-[#F5F5F7] pt-28 sm:pt-36 lg:pt-44 pb-28 sm:pb-36 lg:pb-44"
    >
      <div className="rams-container">
        <div className="max-w-[900px] mx-auto text-center mb-20 sm:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange mb-5"
          >
            Capabilities
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.85, ease: EASE }}
            className="text-[40px] sm:text-[60px] lg:text-[78px] font-bold text-carbon leading-[1.0] tracking-[-0.04em]"
          >
            Everything you need. <br />
            <span className="text-graphite/50">Nothing you don&apos;t.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
            className="mt-8 text-[17px] sm:text-[19px] text-graphite/65 leading-[1.6] max-w-[600px] mx-auto"
          >
            Six capabilities engineered to work as one — so inventory truth
            becomes the default state, not a quarterly exercise.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: (i % 3) * 0.08,
                  ease: EASE,
                }}
                className="group relative flex flex-col p-8 sm:p-9 bg-white transition-all duration-300"
                style={{
                  borderRadius: 24,
                  boxShadow:
                    "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-300 group-hover:scale-105"
                  style={{
                    background: "rgba(255,106,0,0.08)",
                    color: "#FF6A00",
                  }}
                >
                  <Icon className="w-[22px] h-[22px]" strokeWidth={1.75} aria-hidden />
                </div>
                <h3 className="text-[20px] sm:text-[22px] font-semibold text-carbon tracking-[-0.02em] leading-[1.2]">
                  {f.title}
                </h3>
                <p className="mt-3 text-[14.5px] text-graphite/65 leading-[1.6]">
                  {f.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
