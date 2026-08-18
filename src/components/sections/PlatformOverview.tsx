"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HOTSPOTS = [
  {
    id: "racks",
    label: "Racks",
    x: 28,
    y: 35,
    headline: "Rack Monitoring",
    description: "Structural condition, damage history, load compliance and inspection status — tracked continuously across every bay.",
    stat: "100% bay coverage",
  },
  {
    id: "mhe",
    label: "MHE",
    x: 52,
    y: 55,
    headline: "MHE Intelligence",
    description: "Every forklift tracked live — speed, location, idle time, impact events, and battery health in real time.",
    stat: "Real-time fleet tracking",
  },
  {
    id: "pallets",
    label: "Pallets",
    x: 38,
    y: 68,
    headline: "Pallet Tracking",
    description: "Physical location versus WMS record — reconciled automatically. Wrong-bay placements and mismatches caught on the spot.",
    stat: "Zero manual audits",
  },
  {
    id: "people",
    label: "People",
    x: 65,
    y: 40,
    headline: "People & Operators",
    description: "Each operator linked to their equipment, tasks, and completed actions. Safety interactions and restricted-zone events recorded.",
    stat: "Full operator context",
  },
  {
    id: "inventory",
    label: "Inventory",
    x: 20,
    y: 58,
    headline: "Inventory Intelligence",
    description: "Live stock reconciliation against WMS. Expiry priorities, FIFO/FEFO exceptions and lost pallets surfaced without manual input.",
    stat: "Live WMS sync",
  },
  {
    id: "dock",
    label: "Dock Area",
    x: 80,
    y: 75,
    headline: "Dock & Staging",
    description: "Inbound and outbound flow tracked at the dock. Staging area utilisation, dwell time, and sequencing visibility.",
    stat: "End-to-end flow",
  },
  {
    id: "safety",
    label: "Safety Zones",
    x: 72,
    y: 22,
    headline: "Safety Zones",
    description: "Restricted areas enforced automatically. Speed violations, pedestrian proximity alerts, and near-miss events logged instantly.",
    stat: "Automated enforcement",
  },
] as const;

type HotspotId = (typeof HOTSPOTS)[number]["id"];

function PulsingDot({ active }: { active: boolean }) {
  return (
    <span className="relative flex h-4 w-4">
      {active && (
        <span className="animate-ping absolute inline-flex h-full w-full bg-signal-orange opacity-50" />
      )}
      <span
        className={`relative inline-flex h-4 w-4 border-2 transition-colors duration-200 ${
          active
            ? "bg-signal-orange border-signal-orange"
            : "bg-white border-signal-orange"
        }`}
      />
    </span>
  );
}

export function PlatformOverview() {
  const [activeId, setActiveId] = useState<HotspotId>("racks");
  const active = HOTSPOTS.find((h) => h.id === activeId)!;

  return (
    <section className="bg-white py-20 sm:py-28 lg:py-36 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 sm:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="text-[10.5px] font-mono font-bold tracking-[0.22em] uppercase text-signal-orange mb-4"
          >
            Warehouse at a Glance
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-[34px] sm:text-[46px] lg:text-[56px] font-bold text-carbon leading-[1.04] max-w-[720px]"
          >
            Everything RAMS monitors,
            <br />
            <span className="text-signal-orange">in one unified platform.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-4 sm:mt-5 text-[14px] sm:text-[16px] text-graphite/50 leading-relaxed max-w-[500px]"
          >
            Click any zone to explore what RAMS sees — live, continuously, across every corner of your facility.
          </motion.p>
        </div>

        {/* Main interactive area */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:gap-8 items-stretch"
        >

          {/* Warehouse floor plan */}
          <div className="relative bg-off-white-cool border border-steel-soft overflow-hidden" style={{ minHeight: "420px" }}>

            {/* Grid overlay */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="wh-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#E2E2E0" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#wh-grid)" />

              {/* Rack rows */}
              {[18, 26, 34, 42].map((y, i) => (
                <rect key={i} x="8%" y={`${y}%`} width="38%" height="4%" rx="0" fill="#E8E6E1" stroke="#D5D3CE" strokeWidth="0.8" />
              ))}

              {/* Dock doors */}
              {[62, 72, 82].map((y, i) => (
                <rect key={i} x="88%" y={`${y}%`} width="10%" height="7%" rx="0" fill="#E8E6E1" stroke="#D5D3CE" strokeWidth="0.8" />
              ))}

              {/* Safety zone */}
              <rect x="60%" y="8%" width="22%" height="20%" rx="0" fill="rgba(255,106,0,0.05)" stroke="#FF6A00" strokeWidth="1" strokeDasharray="5 3" />

              {/* Aisle lines */}
              <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="#D5D3CE" strokeWidth="1" strokeDasharray="6 4" />
              <line x1="8%" y1="55%" x2="88%" y2="55%" stroke="#D5D3CE" strokeWidth="1" strokeDasharray="6 4" />

              {/* Staging area */}
              <rect x="52%" y="58%" width="34%" height="22%" rx="0" fill="rgba(14,14,15,0.03)" stroke="#D5D3CE" strokeWidth="0.8" strokeDasharray="4 3" />

              {/* Labels */}
              <text x="27%" y="15%" textAnchor="middle" fontSize="8" fill="#B0ADA8" fontFamily="monospace" letterSpacing="2">RACK ZONE A</text>
              <text x="74%" y="85%" textAnchor="middle" fontSize="8" fill="#B0ADA8" fontFamily="monospace" letterSpacing="2">STAGING</text>
              <text x="93%" y="58%" textAnchor="middle" fontSize="7" fill="#B0ADA8" fontFamily="monospace" letterSpacing="1" transform="rotate(90, 93%, 58%)">DOCK</text>
            </svg>

            {/* Hotspot buttons */}
            {HOTSPOTS.map((spot) => (
              <button
                key={spot.id}
                type="button"
                onClick={() => setActiveId(spot.id)}
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center gap-1.5 z-10"
                aria-label={spot.label}
              >
                <PulsingDot active={activeId === spot.id} />
                <span
                  className={`text-[9px] font-mono font-bold tracking-[0.14em] uppercase px-1.5 py-0.5 transition-colors duration-200 whitespace-nowrap ${
                    activeId === spot.id
                      ? "text-signal-orange bg-white border border-signal-orange"
                      : "text-graphite/60 bg-white/80 border border-steel-soft group-hover:text-signal-orange group-hover:border-signal-orange"
                  }`}
                >
                  {spot.label}
                </span>
              </button>
            ))}

            {/* Placeholder label */}
            <div className="absolute bottom-3 left-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-signal-orange" />
              <p className="text-[9px] font-mono text-graphite/25 tracking-[0.14em] uppercase">
                Warehouse Map — Placeholder
              </p>
            </div>
          </div>

          {/* Info panel */}
          <div className="border border-steel-soft bg-white flex flex-col">

            {/* Zone list */}
            <div className="border-b border-steel-soft">
              {HOTSPOTS.map((spot, i) => (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => setActiveId(spot.id)}
                  className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors duration-150 ${
                    i < HOTSPOTS.length - 1 ? "border-b border-off-white-warm" : ""
                  } ${
                    activeId === spot.id
                      ? "bg-signal-orange/5"
                      : "hover:bg-off-white-cool"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 shrink-0 transition-colors duration-150 ${
                      activeId === spot.id ? "bg-signal-orange" : "bg-steel"
                    }`}
                  />
                  <span
                    className={`text-[12px] font-medium transition-colors duration-150 ${
                      activeId === spot.id ? "text-signal-orange" : "text-graphite"
                    }`}
                  >
                    {spot.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Active info */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <div className="w-8 h-[3px] bg-signal-orange mb-4" />
                  <h3 className="text-[18px] sm:text-[20px] font-bold text-carbon leading-tight mb-3">
                    {active.headline}
                  </h3>
                  <p className="text-[13px] text-graphite/55 leading-relaxed mb-6">
                    {active.description}
                  </p>
                  <div className="flex items-center gap-2 pt-4 border-t border-off-white-warm">
                    <div className="w-1.5 h-1.5 bg-signal-orange" />
                    <p className="text-[11px] font-mono font-bold tracking-[0.16em] uppercase text-signal-orange">
                      {active.stat}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
