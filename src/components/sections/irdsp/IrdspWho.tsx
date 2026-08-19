"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE, SURFACE, Section } from "./irdsp-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

const ROLES = [
  {
    role: "Inspection team",
    line: "Work a consistent checklist against the rack and raise findings in place.",
    uses: ["Inspection", "Rules and Action", "Findings"],
  },
  {
    role: "Engineering team",
    line: "Run integrity tests and turn measurements into defensible results.",
    uses: ["Integrity Test", "Rack Health Analytics", "LARC Drawings"],
  },
  {
    role: "TPI",
    line: "Record third-party findings alongside internal inspection history.",
    uses: ["TPI Findings", "Compliance", "Report"],
  },
  {
    role: "Warehouse team",
    line: "See what is blocked, what is being repaired and what has been cleared.",
    uses: ["Call To Action", "Maintenance", "Dashboard"],
  },
  {
    role: "Management",
    line: "Compare sites, track closure and hold the audit record in one place.",
    uses: ["Project Planner", "Compliance", "Report"],
  },
];

const WHY_RAMS = [
  { t: "Structured", b: "Every observation resolves to a rack, bay and element." },
  { t: "Traceable", b: "Finding, test, action and closure stay connected." },
  { t: "Connected", b: "One data model behind all eighteen modules." },
  { t: "Scalable", b: "The same structure across every site in the network." },
];

export function IrdspWho() {
  return (
    <>
      <Section surface="white">
        <SectionHeader
          tone="light"
          eyebrow="Who uses IRDS"
          top="Built for everyone"
          bottom="in the process."
          body="Inspectors, engineers, third-party inspection, warehouse teams and management all work from the same rack record."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROLES.map((r, i) => (
            <motion.article
              key={r.role}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.07, ease: EASE }}
              className="flex flex-col p-7"
              style={{
                borderRadius: 18,
                background: "#FFFFFF",
                border: "1px solid #E8E8ED",
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
              }}
            >
              <h3 className="text-[18px] font-bold tracking-[-0.02em] text-carbon">
                {r.role}
              </h3>
              <p className="mt-3 text-[13.5px] text-graphite/60 leading-[1.65]">
                {r.line}
              </p>
              <div className="mt-auto pt-6 flex flex-wrap gap-1.5">
                {r.uses.map((u) => (
                  <span
                    key={u}
                    className="px-2 py-1 rounded-md text-[10.5px] font-mono font-semibold text-graphite/55"
                    style={{ background: "#F5F5F7" }}
                  >
                    {u}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </Section>

      <Section surface="warm">
        <SectionHeader
          tone="light"
          eyebrow="Why RAMS"
          top="One system,"
          bottom="end to end."
        />
        <div className="max-w-[1000px] mx-auto">
          <div
            className="grid grid-cols-1 sm:grid-cols-2"
            style={{ borderTop: "1px solid #E4E0D8" }}
          >
            {WHY_RAMS.map((w, i) => (
              <motion.div
                key={w.t}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: i * 0.06, ease: EASE }}
                className="px-7 py-8 -mb-px -mr-px"
                style={{
                  borderBottom: "1px solid #E4E0D8",
                  borderRight: "1px solid #E4E0D8",
                }}
              >
                <h3 className="text-[16px] font-bold tracking-[-0.01em] text-signal-orange">
                  {w.t}
                </h3>
                <p className="mt-2.5 text-[13.5px] text-graphite/60 leading-[1.65]">
                  {w.b}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <section
        className="relative overflow-hidden text-white border-t border-white/[0.07]"
        style={{ background: SURFACE.darkBottom }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[560px]"
          style={{
            background:
              "radial-gradient(58% 58% at 50% 100%, rgba(255,106,0,0.18), transparent 70%)",
          }}
        />
        <div className="relative rams-container py-28 sm:py-36">
          <div className="text-center">
            <SectionHeader
              tone="dark"
              eyebrow="Get started"
              top="See IRDS"
              bottom="in action."
              body="A walkthrough of the real product — configuration, inspection, testing, issues and the report that comes out the other end."
              className="!mb-10"
            />
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                href="/book-a-demo"
                className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3 rounded-lg transition-colors duration-200 hover:bg-signal-orange-hover"
              >
                Book a Demo
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
              <Link
                href="/solutions/rack-safety-intelligence"
                className="inline-flex items-center gap-2 text-white text-[14px] font-semibold px-6 py-3 rounded-lg border border-white/15 transition-colors duration-200 hover:bg-white/[0.06]"
              >
                Rack Safety solution
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
