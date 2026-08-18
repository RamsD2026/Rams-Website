"use client";

import { motion } from "framer-motion";

const FACTS = [
  { k: "Deployment", v: "Edge-first, WMS-agnostic" },
  { k: "Latency",    v: "< 50ms telemetry loop" },
  { k: "Coverage",   v: "Every MHE, every shift" },
  { k: "Integrations", v: "WMS · ERP · TMS · MHE OEMs" },
];

export function MepsIntro() {
  return (
    <section className="bg-white py-24 sm:py-32 lg:py-40">
      <div className="mx-auto px-6 lg:px-14" style={{ maxWidth: 1280 }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left — narrative */}
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45 }}
              className="text-[10.5px] font-mono font-bold tracking-[0.22em] uppercase text-[#FF6A00] mb-4"
            >
              What is MEPS
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-[34px] sm:text-[46px] lg:text-[56px] font-bold text-[#0E0E0F] leading-[1.06] tracking-[-0.02em]"
            >
              An operating system for
              <br />
              your <span className="text-[#FF6A00]">material handling fleet.</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-8 space-y-5 text-[16px] sm:text-[17px] text-[#33363A]/70 leading-[1.65] max-w-[620px]"
            >
              <p>
                MEPS pairs edge compute, sensor arrays, and AI vision on every
                forklift, reach truck, and MHE unit — replacing paper checklists
                and blind spots with a continuous, structured signal.
              </p>
              <p>
                Speed, location, idle time, impact events, operator identity, and
                battery health flow into one operating layer that governs safety,
                utilisation, and throughput in real time.
              </p>
            </motion.div>
          </div>

          {/* Right — key facts */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 border border-[#E2E2E0] bg-[#F7F5F0]"
          >
            <div className="px-6 py-5 border-b border-[#E2E2E0] flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-[#FF6A00]" />
              <p className="text-[10.5px] font-mono font-bold tracking-[0.22em] uppercase text-[#33363A]/60">
                Product Fact Sheet
              </p>
            </div>
            <dl className="divide-y divide-[#E2E2E0]">
              {FACTS.map((f) => (
                <div key={f.k} className="px-6 py-5 flex items-baseline justify-between gap-6">
                  <dt className="text-[12px] font-mono font-medium tracking-[0.1em] uppercase text-[#33363A]/55">
                    {f.k}
                  </dt>
                  <dd className="text-[14px] sm:text-[15px] font-semibold text-[#0E0E0F] text-right">
                    {f.v}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
