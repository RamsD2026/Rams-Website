"use client";

import { motion } from "framer-motion";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Progressive deployment.
 *
 * The document's four levels are cumulative — each one keeps everything below
 * it and adds one thing. The four-segment bar at the top of each card fills as
 * you move right, so the accumulation is visible before any of it is read.
 */

const HAIR = "rgba(255,255,255,0.10)";

const LEVELS = [
  {
    lv: "Locate",
    title: "See where the fleet is",
    adds: "LiDAR + OmniBox Motion + Digital Twin",
    body: "Location, route, speed, zones, dwell and utilisation.",
  },
  {
    lv: "Add load context",
    title: "Separate loaded from empty",
    adds: "+ Pallet Detection",
    body: "Loaded vs empty travel, pallet handling, idle with load, pallet efficiency.",
  },
  {
    lv: "Add operator context",
    title: "Attribute the session",
    adds: "+ Authentication",
    body: "Operator-linked performance, sessions, pairing and shift comparison.",
  },
  {
    lv: "Connect tasks",
    title: "Add the work order",
    adds: "+ WMS / ERP / ATOS / IROS",
    body: "Task and execution context on top of movement.",
  },
];

export function MepsDeployment() {
  return (
    <Section surface="darkMid" id="deployment">
      {/* Set locally rather than through <SectionHeader>. Line two is 40
          characters, which needs ~1360px at the compact 68px and so wraps to a
          third line inside the 1180px wide wrapper. Everything else — the
          eyebrow, the gradient second line, the motion — is the guideline's,
          at 56px. */}
      <div className="max-w-[1180px] mx-auto text-center mb-16 sm:mb-20">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange mb-5"
        >
          Progressive deployment
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, ease: EASE }}
          className="text-[30px] sm:text-[44px] lg:text-[56px] font-bold tracking-[-0.04em] leading-[1.08] text-white"
        >
          Start with movement.
          <br />
          <span
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.35) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Add context as the operation requires it.
          </span>
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {LEVELS.map((l, i) => (
          <motion.article
            key={l.lv}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: i * 0.09, ease: EASE }}
            className="flex flex-col px-6 py-7"
            style={{
              minHeight: 320,
              borderRadius: 12,
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${HAIR}`,
            }}
          >
            {/* what this level carries — everything below it, plus one more */}
            <div className="flex gap-1.5 mb-7" aria-hidden>
              {LEVELS.map((_, seg) => (
                <motion.span
                  key={seg}
                  className="h-1 flex-1 rounded-full"
                  initial={{ opacity: 0, scaleX: 0.4 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.45,
                    delay: i * 0.09 + seg * 0.06,
                    ease: EASE,
                  }}
                  style={{
                    transformOrigin: "left",
                    background: seg <= i ? "#FF6A00" : "rgba(255,255,255,0.12)",
                  }}
                />
              ))}
            </div>

            <p className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange">
              {l.lv}
            </p>
            <h3 className="mt-3 text-[19px] sm:text-[20px] font-bold tracking-[-0.022em] text-white leading-[1.22]">
              {l.title}
            </h3>
            <p className="mt-3 text-[13.5px] text-white/50 leading-[1.6]">
              {l.body}
            </p>

            <span
              className="mt-auto pt-7 text-[11.5px] font-mono text-signal-orange leading-[1.5]"
              style={{ letterSpacing: "0.01em" }}
            >
              {l.adds}
            </span>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
