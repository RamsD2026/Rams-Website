"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const SOLUTIONS = [
  {
    id: "ai-vision",
    name: "AI Vision",
    description: "Real-time visual intelligence to detect, monitor, and understand every movement inside your warehouse.",
    href: "/solutions/ai-vision",
    gradient: "from-[#3B1FA8] via-[#6B21A8] to-[#1e1054]",
    visual: (
      <svg viewBox="0 0 320 200" fill="none" className="w-full h-full">
        <circle cx="160" cy="90" r="60" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
        <circle cx="160" cy="90" r="36" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
        <circle cx="160" cy="90" r="10" fill="rgba(255,255,255,0.3)"/>
        <path d="M80 90 Q160 30 240 90 Q160 150 80 90Z" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="rgba(255,255,255,0.03)"/>
        <rect x="110" y="62" width="36" height="26" rx="2" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="3 2"/>
        <rect x="174" y="72" width="24" height="38" rx="2" stroke="rgba(255,165,0,0.5)" strokeWidth="1" strokeDasharray="3 2"/>
        <circle cx="230" cy="55" r="18" stroke="rgba(255,255,255,0.08)" strokeWidth="40" strokeOpacity="0.15" fill="rgba(139,92,246,0.3)"/>
        <circle cx="90" cy="130" r="24" fill="rgba(139,92,246,0.2)"/>
        <circle cx="240" cy="130" r="16" fill="rgba(168,85,247,0.25)"/>
      </svg>
    ),
  },
  {
    id: "guided-inspection",
    name: "Guided Inspection",
    description: "AI-powered inspections that identify risks, ensure compliance and drive corrective actions faster.",
    href: "/solutions/guided-inspection",
    gradient: "from-[#1e3a8a] via-[#1d4ed8] to-[#0c1a4a]",
    visual: (
      <svg viewBox="0 0 320 200" fill="none" className="w-full h-full">
        <rect x="60" y="30" width="80" height="140" rx="3" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
        <rect x="180" y="30" width="80" height="140" rx="3" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
        <line x1="60" y1="65" x2="140" y2="65" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"/>
        <line x1="60" y1="100" x2="140" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"/>
        <line x1="60" y1="135" x2="140" y2="135" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"/>
        <line x1="180" y1="65" x2="260" y2="65" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"/>
        <line x1="180" y1="100" x2="260" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"/>
        <line x1="180" y1="135" x2="260" y2="135" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"/>
        <rect x="70" y="72" width="30" height="20" rx="1" fill="rgba(59,130,246,0.3)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
        <rect x="110" y="72" width="22" height="20" rx="1" fill="rgba(239,68,68,0.35)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
        <circle cx="220" cy="82" r="12" stroke="rgba(74,222,128,0.7)" strokeWidth="1.5"/>
        <path d="M215 82L219 86L226 78" stroke="rgba(74,222,128,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="80" cy="160" r="30" fill="rgba(29,78,216,0.2)"/>
        <circle cx="250" cy="50" r="20" fill="rgba(96,165,250,0.15)"/>
      </svg>
    ),
  },
  {
    id: "location-intelligence",
    name: "Location Intelligence",
    description: "High-accuracy tracking and insights to optimise inventory, location, flow and warehouse performance.",
    href: "/solutions/location-intelligence",
    gradient: "from-[#0f4c75] via-[#1b6ca8] to-[#051f3a]",
    visual: (
      <svg viewBox="0 0 320 200" fill="none" className="w-full h-full">
        <circle cx="160" cy="100" r="70" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        <circle cx="160" cy="100" r="45" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
        <circle cx="160" cy="100" r="20" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
        <circle cx="105" cy="68" r="6" fill="rgba(96,165,250,0.7)"/>
        <circle cx="210" cy="80" r="6" fill="rgba(96,165,250,0.7)"/>
        <circle cx="125" cy="138" r="6" fill="rgba(96,165,250,0.7)"/>
        <circle cx="195" cy="130" r="6" fill="rgba(96,165,250,0.5)"/>
        <line x1="105" y1="68" x2="160" y2="100" stroke="rgba(96,165,250,0.3)" strokeWidth="0.8"/>
        <line x1="210" y1="80" x2="160" y2="100" stroke="rgba(96,165,250,0.3)" strokeWidth="0.8"/>
        <line x1="125" y1="138" x2="160" y2="100" stroke="rgba(96,165,250,0.3)" strokeWidth="0.8"/>
        <circle cx="160" cy="100" r="4" fill="white" fillOpacity="0.8"/>
        <circle cx="50" cy="150" r="35" fill="rgba(27,108,168,0.2)"/>
        <circle cx="270" cy="50" r="25" fill="rgba(96,165,250,0.15)"/>
      </svg>
    ),
  },
  {
    id: "omnibox",
    name: "OmniBox",
    description: "Edge intelligence devices that connect, capture and processes data where operations happen.",
    href: "/solutions/omnibox",
    gradient: "from-[#4a1942] via-[#7c3aed] to-[#2d0a3e]",
    visual: (
      <svg viewBox="0 0 320 200" fill="none" className="w-full h-full">
        <rect x="110" y="50" width="100" height="100" rx="8" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
        <rect x="125" y="65" width="70" height="70" rx="4" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
        <circle cx="160" cy="100" r="15" fill="rgba(167,139,250,0.25)" stroke="rgba(167,139,250,0.5)" strokeWidth="1"/>
        <line x1="50" y1="75" x2="110" y2="75" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" strokeDasharray="4 3"/>
        <line x1="50" y1="100" x2="110" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" strokeDasharray="4 3"/>
        <line x1="50" y1="125" x2="110" y2="125" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" strokeDasharray="4 3"/>
        <line x1="210" y1="75" x2="270" y2="75" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" strokeDasharray="4 3"/>
        <line x1="210" y1="100" x2="270" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" strokeDasharray="4 3"/>
        <line x1="210" y1="125" x2="270" y2="125" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" strokeDasharray="4 3"/>
        <circle cx="55" cy="155" r="30" fill="rgba(124,58,237,0.2)"/>
        <circle cx="265" cy="45" r="22" fill="rgba(167,139,250,0.15)"/>
      </svg>
    ),
  },
  {
    id: "digital-twin",
    name: "Digital Twin",
    description: "Virtual replica of your warehouse to simulate, analyse and optimise operations in real time.",
    href: "/solutions/digital-twin",
    gradient: "from-[#064e3b] via-[#0d9488] to-[#022c22]",
    visual: (
      <svg viewBox="0 0 320 200" fill="none" className="w-full h-full">
        <rect x="40" y="50" width="100" height="100" rx="3" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
        <rect x="180" y="50" width="100" height="100" rx="3" stroke="rgba(20,184,166,0.5)" strokeWidth="1" strokeDasharray="4 2"/>
        <line x1="140" y1="100" x2="180" y2="100" stroke="rgba(20,184,166,0.5)" strokeWidth="1" strokeDasharray="3 2"/>
        <rect x="55" y="65" width="30" height="22" rx="1" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
        <rect x="95" y="65" width="30" height="22" rx="1" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
        <rect x="195" y="65" width="30" height="22" rx="1" fill="rgba(20,184,166,0.15)" stroke="rgba(20,184,166,0.4)" strokeWidth="0.5" strokeDasharray="2 1"/>
        <rect x="235" y="65" width="30" height="22" rx="1" fill="rgba(20,184,166,0.15)" stroke="rgba(20,184,166,0.4)" strokeWidth="0.5" strokeDasharray="2 1"/>
        <circle cx="280" cy="155" r="28" fill="rgba(13,148,136,0.2)"/>
        <circle cx="42" cy="42" r="20" fill="rgba(20,184,166,0.12)"/>
        <circle cx="230" cy="125" r="8" fill="rgba(20,184,166,0.4)" stroke="rgba(20,184,166,0.7)" strokeWidth="1"/>
      </svg>
    ),
  },
  {
    id: "analytics",
    name: "Analytics",
    description: "Actionable insights and dashboards that turn data into decisions and measurable warehouse outcomes.",
    href: "/solutions/analytics",
    gradient: "from-[#1a3a1a] via-[#166534] to-[#0a1f0a]",
    visual: (
      <svg viewBox="0 0 320 200" fill="none" className="w-full h-full">
        <line x1="40" y1="160" x2="280" y2="160" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
        <line x1="40" y1="40" x2="40" y2="160" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
        <rect x="65" y="110" width="28" height="50" rx="2" fill="rgba(74,222,128,0.25)" stroke="rgba(74,222,128,0.4)" strokeWidth="0.5"/>
        <rect x="115" y="80" width="28" height="80" rx="2" fill="rgba(74,222,128,0.35)" stroke="rgba(74,222,128,0.5)" strokeWidth="0.5"/>
        <rect x="165" y="100" width="28" height="60" rx="2" fill="rgba(74,222,128,0.3)" stroke="rgba(74,222,128,0.45)" strokeWidth="0.5"/>
        <rect x="215" y="60" width="28" height="100" rx="2" fill="rgba(74,222,128,0.45)" stroke="rgba(74,222,128,0.6)" strokeWidth="0.5"/>
        <polyline points="79,110 129,80 179,100 229,60" stroke="rgba(74,222,128,0.8)" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
        <circle cx="79" cy="110" r="3" fill="rgba(74,222,128,0.9)"/>
        <circle cx="129" cy="80" r="3" fill="rgba(74,222,128,0.9)"/>
        <circle cx="229" cy="60" r="4" fill="rgba(74,222,128,1)"/>
        <circle cx="260" cy="155" r="30" fill="rgba(22,101,52,0.2)"/>
        <circle cx="55" cy="50" r="18" fill="rgba(74,222,128,0.1)"/>
      </svg>
    ),
  },
] as const;

export function SolutionsGrid() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-[1440px] mx-auto px-8">

        {/* ── Centered header ── */}
        <div className="text-center mb-14 max-w-[680px] mx-auto">
          <h2 className="text-[38px] md:text-[52px] font-bold text-carbon leading-[1.06]">
            One Intelligent Platform.
            <br />
            Six Connected Solutions.
          </h2>

          <p className="mt-5 text-[15px] text-graphite/55 leading-relaxed font-normal">
            RAMS brings AI Vision, Digital Twin, Guided Inspection, Location Intelligence,
            OmniBox, and Analytics together in one connected warehouse platform. Explore
            each solution to see how they work together.
          </p>

          <div className="mt-8">
            <Link
              href="/platform"
              className="inline-flex items-center gap-2 bg-carbon hover:bg-[#1a1a1b] text-white px-6 py-3 rounded-full text-[14px] font-semibold transition-all duration-200 hover:-translate-y-px"
            >
              Explore Platform
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ── 3×2 card grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SOLUTIONS.map((solution, i) => (
            <motion.div
              key={solution.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, scale: 1.01 }}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${solution.gradient} cursor-pointer`}
              style={{ minHeight: 300 }}
            >
              {/* Abstract visual — fills upper portion */}
              <div className="absolute inset-0 flex items-center justify-center opacity-60 group-hover:opacity-80 transition-opacity duration-500">
                {solution.visual}
              </div>

              {/* Bottom gradient fade for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Content pinned to bottom */}
              <div className="relative z-10 flex flex-col justify-end h-full p-7 pt-32">
                <h3 className="text-[18px] font-bold text-white leading-tight">
                  {solution.name}
                </h3>
                <p className="mt-2 text-[13px] text-white/65 font-normal leading-relaxed">
                  {solution.description}
                </p>
                <Link
                  href={solution.href}
                  className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-white/50 hover:text-white transition-colors duration-150 group/link"
                >
                  Learn More
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover/link:translate-x-0.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
