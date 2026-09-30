"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  AlertTriangle,
  Boxes,
  Forklift,
  LineChart,
  Wrench,
  Workflow,
} from "lucide-react";

import { Section, EASE } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * /solutions — the index the Solutions menu has always pointed at.
 *
 * Six solution pages existed and the route above them did not, so "Solutions"
 * in the navigation and "View all Solutions" in the mega menu both 404ed. It
 * is built on the same skeleton as the services index: a dark hero with the
 * grid motif, then one card per solution on an off-white surface.
 *
 * The labels and one-line descriptions are the navigation's own, so the menu
 * and this page cannot drift apart. The icons are the only thing added here —
 * a card grid with no marks reads as a table of contents.
 */

const SOLUTIONS = [
  {
    label: "Rack Safety and Intelligence",
    href: "/solutions/rack-safety-intelligence",
    description: "Improve rack safety, compliance, and lifecycle management.",
    icon: AlertTriangle,
  },
  {
    label: "MHE Safety and Productivity",
    href: "/solutions/mhe-intelligence",
    description: "Improve vehicle safety and operator productivity.",
    icon: Forklift,
  },
  {
    label: "Inventory Intelligence",
    href: "/solutions/inventory-intelligence",
    description: "Real-time inventory visibility across every location.",
    icon: Boxes,
  },
  {
    label: "Warehouse Execution",
    href: "/solutions/warehouse-execution",
    description: "Orchestrate warehouse operations with precision and speed.",
    icon: Workflow,
  },
  {
    label: "MHE Diagnostics and Maintenance",
    href: "/solutions/mhe-diagnostics",
    description: "Predictive maintenance before failures occur.",
    icon: Wrench,
  },
  {
    label: "Management Intelligence",
    href: "/solutions/management-intelligence",
    description: "Enterprise-wide dashboards and performance insight.",
    icon: LineChart,
  },
];

export function SolutionsIndex() {
  return (
    <>
      <section
        className="relative overflow-hidden text-white"
        id="top"
        data-hero-tone="dark"
        style={{
          background:
            "radial-gradient(80% 100% at 50% 0%, #1D1D1F 0%, #0E0E0F 55%, #08080A 100%)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[720px]"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 20%, rgba(255,106,0,0.22), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
          }}
        />

        <div className="relative rams-container pt-40 sm:pt-48 lg:pt-56 pb-20 sm:pb-24 lg:pb-28">
          <div className="max-w-[1000px] mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
              <span className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-white/70">
                Solutions
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
              className="mt-8 text-[44px] sm:text-[68px] lg:text-[86px] font-bold leading-[1.06] tracking-[-0.045em]"
            >
              <span className="block text-white">Start with the problem</span>
              <span
                className="block"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.35) 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                you need to solve.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
              className="mt-6 text-[14px] sm:text-[16px] text-white/60 leading-[1.6] max-w-[820px] mx-auto"
            >
              Six solutions, each assembled from the same platform, hardware
              and services — scoped to an operational problem rather than to a
              product line.
            </motion.p>
          </div>
        </div>
      </section>

      <Section surface="offWhite" id="solutions">
        <SectionHeader
          eyebrow="By business challenge"
          top="Six solutions,"
          bottom="one operating system."
          size="compact"
          width="wide"
          body="Every one runs on the same live record of the site, so a rack finding, a machine fault and an inventory discrepancy are read against each other rather than in isolation."
          className="!mb-10 sm:!mb-12"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SOLUTIONS.map((s, i) => (
            <motion.div
              key={s.href}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
            >
              <Link
                href={s.href}
                className="group flex flex-col h-full p-6 bg-white transition-transform duration-300 hover:-translate-y-1"
                style={{
                  borderRadius: 12,
                  border: "1px solid #E8E8ED",
                  boxShadow:
                    "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
                }}
              >
                <span
                  className="w-12 h-12 flex items-center justify-center"
                  style={{
                    borderRadius: 10,
                    background: "rgba(255,106,0,0.08)",
                    border: "1px solid rgba(255,106,0,0.18)",
                  }}
                >
                  <s.icon
                    className="w-[22px] h-[22px] text-signal-orange"
                    strokeWidth={2}
                    aria-hidden
                  />
                </span>

                <span className="mt-5 text-[20px] sm:text-[22px] font-semibold tracking-[-0.02em] text-carbon leading-[1.2]">
                  {s.label}
                </span>
                <span className="mt-2 text-[14.5px] leading-[1.6] text-graphite/65">
                  {s.description}
                </span>

                <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-signal-orange">
                  Explore the solution
                  <ArrowUpRight
                    className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/company/contact"
            className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3 rounded-lg transition-colors duration-200 hover:bg-signal-orange-hover"
          >
            Talk through your operation
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
          <Link
            href="/platform/overview"
            className="inline-flex items-center gap-2 text-carbon text-[14px] font-semibold px-6 py-3 rounded-lg border border-[#E8E8ED] transition-colors duration-200 hover:bg-white"
          >
            See the platform underneath
          </Link>
        </div>
      </Section>
    </>
  );
}
