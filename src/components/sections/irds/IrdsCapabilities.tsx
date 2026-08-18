"use client";

import { motion } from "framer-motion";
import {
  Boxes,
  ClipboardCheck,
  TriangleAlert,
  CheckCircle2,
  TrendingUp,
  LayoutGrid,
} from "lucide-react";

const CAPS = [
  {
    icon: Boxes,
    title: "Digital Rack Twin",
    body: "Give every rack, row, bay, upright and inspection point a persistent digital identity for traceability across its lifecycle.",
    meta: "Persistent identity",
  },
  {
    icon: ClipboardCheck,
    title: "Inspection Intelligence",
    body: "Capture observed damage, photographs, measurements, element type, severity and recommended action in a structured workflow.",
    meta: "Structured workflow",
  },
  {
    icon: TriangleAlert,
    title: "Risk Classification",
    body: "Visualise rack condition using Red, Amber and Green severity so teams can focus on the right corrective action first.",
    meta: "RAG severity",
  },
  {
    icon: CheckCircle2,
    title: "Corrective Action Closure",
    body: "Assign, track, verify and close findings with evidence instead of losing actions in spreadsheets, emails and chat threads.",
    meta: "Evidence-based closure",
  },
  {
    icon: TrendingUp,
    title: "Trend & Recurrence Analysis",
    body: "See which rack elements, aisles, zones and operating patterns repeatedly generate damage and safety risk.",
    meta: "Pattern insight",
  },
  {
    icon: LayoutGrid,
    title: "Multi-site Visibility",
    body: "Compare rack health, open risks, closure performance and inspection status across warehouses from one management view.",
    meta: "Cross-site view",
  },
];

export function IrdsCapabilities() {
  return (
    <section className="bg-white py-24 sm:py-32 lg:py-40 overflow-hidden">
      <div className="rams-container">
        <div className="mb-14 sm:mb-20 text-center max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45 }}
            className="text-[10.5px] font-mono font-bold tracking-[0.22em] uppercase text-signal-orange mb-4"
          >
            One connected system
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold text-carbon leading-tight tracking-tight"
          >
            From rack inspection to
            <br />
            <span className="text-signal-orange">rack intelligence.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-sm sm:text-base lg:text-lg text-graphite/60 leading-relaxed mx-auto max-w-2xl"
          >
            RAMS turns scattered inspection records, photographs, rack drawings
            and corrective actions into a structured intelligence layer for
            every bay, upright and component.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-6">
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
                onMouseMove={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  const rect = target.getBoundingClientRect();
                  target.style.setProperty(
                    "--mouse-x",
                    `${e.clientX - rect.left}px`
                  );
                  target.style.setProperty(
                    "--mouse-y",
                    `${e.clientY - rect.top}px`
                  );
                }}
                className="group relative lg:col-span-4 rounded-lg overflow-hidden bg-white border border-steel-soft transition-colors duration-300 hover:border-signal-orange/30"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(320px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,106,0,0.7), transparent 45%)",
                    WebkitMask:
                      "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                    WebkitMaskComposite: "xor",
                    mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                    maskComposite: "exclude",
                    padding: 1,
                  }}
                />

                <div className="relative p-8 lg:p-10">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-11 h-11 border border-steel-soft bg-off-white-warm rounded-lg flex items-center justify-center group-hover:border-signal-orange group-hover:bg-white transition-colors duration-200">
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

                  <h3 className="text-lg sm:text-xl font-bold text-carbon leading-snug mb-3">
                    {cap.title}
                  </h3>
                  <p className="text-sm text-graphite/65 leading-relaxed">
                    {cap.body}
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
