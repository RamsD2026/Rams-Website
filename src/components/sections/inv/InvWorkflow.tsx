"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const STEPS = [
  {
    n: "01",
    title: "Map",
    body: "Create the digital hierarchy for warehouse, zone, rack, bay and pallet position.",
  },
  {
    n: "02",
    title: "Capture",
    body: "Record inventory presence, pallet identity and location data through manual or automated workflows.",
  },
  {
    n: "03",
    title: "Compare",
    body: "Compare physical observations with expected inventory records and storage locations.",
  },
  {
    n: "04",
    title: "Reconcile",
    body: "Prioritise mismatches, misplaced inventory and missing stock for corrective action.",
  },
  {
    n: "05",
    title: "Improve",
    body: "Use trend, aging and exception data to improve inventory control and warehouse productivity.",
  },
];

export function InvWorkflow() {
  return (
    <section className="bg-white pt-28 sm:pt-36 lg:pt-44 pb-28 sm:pb-36 lg:pb-44">
      <div className="rams-container">
        <div className="max-w-[900px] mx-auto text-center mb-20 sm:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange mb-5"
          >
            How it works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.85, ease: EASE }}
            className="text-[40px] sm:text-[60px] lg:text-[78px] font-bold text-carbon leading-[1.0] tracking-[-0.04em]"
          >
            A closed-loop <br />
            <span className="text-graphite/50">inventory workflow.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[15px] text-graphite/65 leading-[1.55] max-w-[880px] mx-auto"
          >
            RAMS connects warehouse layout, inventory capture and exception
            handling into a repeatable process that improves stock visibility
            and reconciliation over time.
          </motion.p>
        </div>

        <div className="relative max-w-[1240px] mx-auto">
          {/* Continuous flow line — desktop */}
          <div
            aria-hidden
            className="hidden md:block absolute left-0 right-0 top-[46px] h-px"
            style={{
              background:
                "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.08) 12%, rgba(0,0,0,0.08) 88%, transparent 100%)",
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-8">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
                className="relative flex flex-col items-center text-center px-4"
              >
                <div className="relative mb-8">
                  {/* halo */}
                  <div
                    aria-hidden
                    className="absolute inset-0 rounded-full blur-2xl opacity-70"
                    style={{
                      background:
                        "radial-gradient(closest-side, rgba(255,106,0,0.35), transparent 70%)",
                    }}
                  />
                  <div
                    className="relative w-[92px] h-[92px] rounded-full flex items-center justify-center font-mono font-bold text-[18px] tracking-[0.02em] bg-white"
                    style={{
                      border: "1px solid #EBEBEF",
                      color: "#0E0E0F",
                      boxShadow:
                        "0 10px 30px -12px rgba(0,0,0,0.12), 0 2px 6px -1px rgba(0,0,0,0.04)",
                    }}
                  >
                    <span
                      style={{
                        background:
                          "linear-gradient(135deg, #FF6A00 0%, #FF8A3C 100%)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      {s.n}
                    </span>
                  </div>
                </div>
                <h3 className="text-[26px] sm:text-[30px] font-bold text-carbon tracking-[-0.025em] leading-[1.15]">
                  {s.title}
                </h3>
                <p className="mt-4 text-[15.5px] text-graphite/65 leading-[1.65] max-w-[320px]">
                  {s.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
