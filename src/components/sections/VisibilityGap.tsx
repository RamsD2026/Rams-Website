"use client";

import { motion } from "framer-motion";

const SYSTEMS = [
  { name: "ERP", desc: "Enterprise Resource Planning" },
  { name: "WMS", desc: "Warehouse Management" },
  { name: "CMMS", desc: "Maintenance Management" },
  { name: "MES", desc: "Manufacturing Execution" },
];

const WAREHOUSE = [
  "Pallet Racks", "Forklifts", "Pallets",
  "Operators", "AI Cameras", "MHE Fleet",
  "QR Labels", "Inspection Markers",
];

const ROWS = [
  { system: "Task created", rams: "Was the task actually completed?" },
  { system: "Pallet assigned to location", rams: "Did the pallet reach the correct bay?" },
  { system: "Inventory moved", rams: "Who moved it, and which MHE was used?" },
  { system: "Maintenance scheduled", rams: "Was equipment condition verified?" },
  { system: "MHE available", rams: "Did it travel loaded or empty?" },
  { system: "Transaction completed", rams: "Was physical execution confirmed?" },
];

// SVG connection paths — left cards → RAMS center → right elements
const LEFT_PATHS = [
  "M 188 78 C 300 78 300 195 412 195",
  "M 188 136 C 300 136 300 195 412 195",
  "M 188 194 C 300 194 300 195 412 195",
  "M 188 252 C 300 252 300 195 412 195",
];

const RIGHT_PATHS = [
  "M 588 195 C 700 195 700 68 812 68",
  "M 588 195 C 700 195 700 108 812 108",
  "M 588 195 C 700 195 700 148 812 148",
  "M 588 195 C 700 195 700 188 812 188",
  "M 588 195 C 700 195 700 228 812 228",
  "M 588 195 C 700 195 700 268 812 268",
  "M 588 195 C 700 195 700 308 812 308",
  "M 588 195 C 700 195 700 322 812 322",
];

export function VisibilityGap() {
  return (
    <section className="bg-white py-24 px-8 lg:px-16">

      {/* ── Heading ── */}
      <div className="mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-16">

        {/* Left — problem statement */}
        <div className="flex-1">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-[#FF6A00] mb-5"
          >
            The Visibility Gap
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-[48px] md:text-[58px] lg:text-[68px] font-bold text-[#0E0E0F] leading-[1.04]"
          >
            Systems track
            <br />
            the record.
            <br />
            <span className="text-[#FF6A00]">RAMS tracks
            <br />
            the floor.</span>
          </motion.h2>
        </div>

        {/* Right — context paragraph + divider */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="md:max-w-[360px] shrink-0"
        >
          <div className="w-8 h-[3px] bg-[#FF6A00] mb-5" />
          <p className="text-[15px] text-[#33363A]/55 leading-relaxed">
            Your ERP, WMS and CMMS log every transaction — but none of them
            can confirm what physically happened on the warehouse floor.
          </p>
          <p className="mt-4 text-[15px] text-[#33363A]/55 leading-relaxed">
            RAMS operates where your systems can&apos;t see — in real time,
            with physical verification at every step.
          </p>
        </motion.div>
      </div>

      {/* ── Three-panel visual ── */}
      <div className="relative w-full" style={{ height: "340px" }}>

        {/* SVG connection lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1000 340"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Left → RAMS */}
          {LEFT_PATHS.map((d, i) => (
            <motion.path
              key={`l-${i}`}
              d={d}
              fill="none"
              stroke="#FF6A00"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: "easeInOut" }}
            />
          ))}
          {/* RAMS → Warehouse */}
          {RIGHT_PATHS.map((d, i) => (
            <motion.path
              key={`r-${i}`}
              d={d}
              fill="none"
              stroke="#FF6A00"
              strokeWidth="1"
              strokeDasharray="3 4"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.7 + i * 0.06, ease: "easeInOut" }}
            />
          ))}
        </svg>

        {/* Left: system cards */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-center gap-3" style={{ width: "18%" }}>
          {SYSTEMS.map((sys, i) => (
            <motion.div
              key={sys.name}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="border border-[#D9DBDD] bg-white px-4 py-3 flex flex-col"
            >
              <span className="text-[13px] font-bold text-[#33363A]">{sys.name}</span>
              <span className="text-[10px] text-[#33363A]/40 mt-0.5 leading-tight">{sys.desc}</span>
            </motion.div>
          ))}
        </div>

        {/* Center: RAMS hub */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            {/* Hub circle */}
            <div className="w-24 h-24 rounded-full bg-[#FF6A00] flex flex-col items-center justify-center mb-3 shadow-lg shadow-[#FF6A00]/20">
              <span className="text-[16px] font-black text-white tracking-tight leading-none">RAMS</span>
            </div>
            <span className="text-[9px] font-bold tracking-[0.18em] uppercase text-[#FF6A00] text-center leading-tight">
              Physical
              <br />
              Intelligence
            </span>
          </motion.div>
        </div>

        {/* Right: warehouse elements */}
        <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center gap-2" style={{ width: "18%" }}>
          {WAREHOUSE.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.06, ease: "easeOut" }}
              className="border border-[#E2E2E0] bg-[#F9F9F8] px-3 py-1.5"
            >
              <span className="text-[11px] font-medium text-[#33363A]/70">{item}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="w-full h-px bg-[#E2E2E0] my-16" />

      {/* ── Comparison rows ── */}
      <div className="max-w-[900px] mx-auto">

        {/* Column headers */}
        <div className="grid grid-cols-2 gap-0 mb-6">
          <p className="text-[9.5px] font-bold tracking-[0.22em] uppercase text-[#33363A]/35 pb-3 border-b border-[#E2E2E0]">
            What existing systems know
          </p>
          <p className="text-[9.5px] font-bold tracking-[0.22em] uppercase text-[#FF6A00] pb-3 border-b border-[#E2E2E0] pl-8">
            What RAMS verifies
          </p>
        </div>

        {/* Rows */}
        {ROWS.map((row, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.45, delay: i * 0.07, ease: "easeOut" }}
            className="grid grid-cols-2 gap-0 border-b border-[#E2E2E0] last:border-b-0"
          >
            {/* System side */}
            <div className="py-4 pr-8 flex items-center gap-3">
              <svg width="12" height="12" viewBox="0 0 12 12" className="shrink-0" aria-hidden="true">
                <circle cx="6" cy="6" r="5" stroke="#D9DBDD" strokeWidth="1" fill="none"/>
                <path d="M3.5 6L5.5 8L8.5 4" stroke="#D9DBDD" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[13.5px] text-[#33363A]/45 line-through decoration-[#D9DBDD]">
                {row.system}
              </span>
            </div>

            {/* RAMS side */}
            <div className="py-4 pl-8 border-l border-[#E2E2E0] flex items-center gap-3">
              <svg width="14" height="14" viewBox="0 0 14 14" className="shrink-0" aria-hidden="true">
                <circle cx="7" cy="7" r="6" fill="#FF6A00"/>
                <path d="M4 7L6.5 9.5L10 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[13.5px] text-[#0E0E0F] font-medium">
                {row.rams}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Supporting statement ── */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-14 text-[15px] text-[#33363A]/50 leading-relaxed text-center max-w-[600px] mx-auto"
      >
        RAMS complements ERP, WMS and maintenance systems by creating intelligence
        around what physically happened inside the operation.
      </motion.p>

    </section>
  );
}
