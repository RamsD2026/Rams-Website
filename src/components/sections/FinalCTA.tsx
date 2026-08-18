"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  HardHat,
  ShieldCheck,
  Activity,
  Globe2,
  Code2,
} from "lucide-react";

const TRUST_POINTS = [
  { icon: HardHat, label: "Engineering-led Deployment" },
  { icon: ShieldCheck, label: "Enterprise Security" },
  { icon: Activity, label: "24/7 Monitoring" },
  { icon: Globe2, label: "Global Support" },
  { icon: Code2, label: "API Ready" },
];

export function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const blueprintY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-off-white-hover pt-[120px] sm:pt-[140px] lg:pt-[160px] pb-[100px] sm:pb-[120px] lg:pb-[140px]"
    >
      {/* Wireframe blueprint background */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        style={{ y: blueprintY }}
      >
        <BlueprintSVG />
      </motion.div>

      {/* Content */}
      <div className="relative rams-container text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-base font-bold tracking-[0.22em] uppercase text-signal-orange"
        >
          Ready to modernise your warehouse?
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-8 max-w-[960px] text-[36px] sm:text-[52px] md:text-[64px] lg:text-[80px] font-bold text-carbon leading-[1.04]"
          style={{
            letterSpacing: "-0.025em",
          }}
        >
          Transform warehouse operations with engineering, AI and real-time
          intelligence.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-10 max-w-[680px] text-base sm:text-lg lg:text-xl text-graphite/60 leading-[1.6]"
        >
          From rack safety and AI vision to digital inspections and operational
          intelligence, RAMS helps enterprise warehouses operate safer, smarter
          and more efficiently.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#book-demo"
            className="group inline-flex items-center gap-2 bg-signal-orange hover:bg-signal-orange-hover px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-px active:translate-y-0"
          >
            Book a Demo
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>

          <a
            href="#talk-engineer"
            className="inline-flex items-center gap-2 border border-carbon/15 bg-white hover:bg-off-white-hover px-7 py-3.5 text-[15px] font-semibold text-carbon transition-all duration-200 hover:-translate-y-px active:translate-y-0"
          >
            Talk to an Engineer
          </a>
        </motion.div>

        {/* Trust Row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-5"
        >
          {TRUST_POINTS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="inline-flex items-center gap-2.5 text-[13px] lg:text-sm text-graphite/70"
            >
              <Icon
                size={16}
                className="text-carbon/60 shrink-0"
                strokeWidth={1.75}
              />
              <span className="leading-none">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function BlueprintSVG() {
  return (
    <svg
      width="1600"
      height="900"
      viewBox="0 0 1600 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        opacity: 0.022,
        maxWidth: "100%",
        height: "auto",
      }}
    >
      {/* Warehouse rack grid — top-down blueprint */}
      <g stroke="var(--color-carbon)" strokeWidth="1.2" fill="none">
        {/* Outer perimeter */}
        <rect x="80" y="80" width="1440" height="740" strokeWidth="1.6" />

        {/* Aisles — horizontal racks */}
        {Array.from({ length: 7 }).map((_, i) => (
          <g key={`aisle-${i}`}>
            <rect
              x={120}
              y={130 + i * 100}
              width={640}
              height={40}
            />
            <rect
              x={840}
              y={130 + i * 100}
              width={640}
              height={40}
            />
          </g>
        ))}

        {/* Central aisle divider */}
        <line x1="800" y1="80" x2="800" y2="820" strokeDasharray="6 6" />

        {/* Dock doors — bottom */}
        {Array.from({ length: 10 }).map((_, i) => (
          <rect
            key={`dock-${i}`}
            x={140 + i * 130}
            y={820}
            width={90}
            height={30}
          />
        ))}

        {/* Grid overlay */}
        <g strokeWidth="0.6" opacity="0.6">
          {Array.from({ length: 32 }).map((_, i) => (
            <line
              key={`vgrid-${i}`}
              x1={i * 50}
              y1="0"
              x2={i * 50}
              y2="900"
            />
          ))}
          {Array.from({ length: 18 }).map((_, i) => (
            <line
              key={`hgrid-${i}`}
              x1="0"
              y1={i * 50}
              x2="1600"
              y2={i * 50}
            />
          ))}
        </g>

        {/* Detection paths — AI vision cones */}
        <g strokeWidth="1" strokeDasharray="4 4">
          <path d="M 200 200 L 400 350 L 600 200 Z" />
          <path d="M 1000 500 L 1200 650 L 1400 500 Z" />
        </g>

        {/* Corner markers */}
        {[
          [80, 80],
          [1520, 80],
          [80, 820],
          [1520, 820],
        ].map(([cx, cy], i) => (
          <g key={`marker-${i}`}>
            <circle cx={cx} cy={cy} r="6" />
            <circle cx={cx} cy={cy} r="14" strokeWidth="0.8" />
          </g>
        ))}
      </g>
    </svg>
  );
}
