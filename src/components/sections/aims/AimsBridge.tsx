"use client";

import { motion } from "framer-motion";

/**
 * The turn, in one line.
 *
 * A single white band between the hero and the capabilities: what the
 * operation has today on the left, what it becomes on the right, and the
 * modules that feed it as chips. One row, no card — the page has not started
 * arguing yet.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const MODULES = ["Racks", "MHE", "Inventory", "People", "Actions"];

export function AimsBridge() {
  return (
    <section
      className="bg-white"
      aria-label="From operational data to management intelligence"
    >
      <div className="rams-container py-10 sm:py-12">
        <div className="flex items-center justify-between gap-8 flex-wrap max-w-[1240px] mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex items-center gap-4 flex-wrap text-[15px] sm:text-[17px] tracking-[-0.01em]"
          >
            <span className="text-graphite/45">
              From disconnected operational data
            </span>
            <span aria-hidden className="text-signal-orange">
              →
            </span>
            <span className="font-semibold text-carbon">
              to one management intelligence system
            </span>
          </motion.p>

          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="flex items-center gap-2 flex-wrap"
          >
            {MODULES.map((m) => (
              <span
                key={m}
                className="px-3 py-1.5 rounded-full text-[10.5px] font-mono font-bold tracking-[0.14em] uppercase text-graphite/55"
                style={{ border: "1px solid #E8E8ED" }}
              >
                {m}
              </span>
            ))}
          </motion.span>
        </div>
      </div>
    </section>
  );
}
