"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const PANELS = [
  {
    eyebrow: "Smarter Task Flow",
    title: "Prioritise work based on what matters now.",
    body: "Sequence tasks using operational priority, inventory demand and current warehouse conditions instead of static task lists.",
    metricLabel: "On-plan execution",
    metricValue: "86%",
    metricPct: 86,
    variant: "dark" as const,
  },
  {
    eyebrow: "Resource Coordination",
    title: "Match tasks with available MHEs and operators.",
    body: "Reduce waiting and manual dispatching by linking task demand with resource availability and location.",
    metricLabel: "Resource utilisation",
    metricValue: "78%",
    metricPct: 78,
    variant: "orange" as const,
  },
  {
    eyebrow: "Execution Intelligence",
    title: "See where time is lost during the shift.",
    body: "Identify waiting, repeated movement, blocked tasks and zone-level bottlenecks so supervisors can improve daily execution.",
    metricLabel: "Tasks closed on time",
    metricValue: "91%",
    metricPct: 91,
    variant: "dark" as const,
  },
];

export function WexFeaturePanels() {
  return (
    <section
      id="execution"
      className="relative overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(80% 100% at 50% 0%, #1D1D1F 0%, #0E0E0F 60%, #08080A 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 20%, rgba(255,106,0,0.14), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
        }}
      />

      <div className="relative rams-container pt-28 sm:pt-36 lg:pt-44 pb-28 sm:pb-36 lg:pb-44">
        <div className="max-w-[900px] mx-auto text-center mb-20 sm:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange mb-5"
          >
            Execution Layer
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.85, ease: EASE }}
            className="text-[40px] sm:text-[60px] lg:text-[78px] font-bold leading-[1.0] tracking-[-0.04em]"
          >
            <span className="text-white">Plan the shift.</span> <br />
            <span
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.35) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Run the shift.
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 max-w-[1240px] mx-auto">
          {PANELS.map((p, i) => {
            const isOrange = p.variant === "orange";
            return (
              <motion.article
                key={p.eyebrow}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  delay: 0.05 + i * 0.1,
                  ease: EASE,
                }}
                className="relative flex flex-col p-8 sm:p-9 overflow-hidden"
                style={{
                  minHeight: 420,
                  borderRadius: 24,
                  border: isOrange
                    ? "1px solid transparent"
                    : "1px solid rgba(255,255,255,0.10)",
                  background: isOrange
                    ? "linear-gradient(180deg, #FF6A00 0%, #E85A00 100%)"
                    : "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
                  backdropFilter: isOrange ? undefined : "blur(20px)",
                  boxShadow: isOrange
                    ? "0 40px 100px -40px rgba(255,106,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)"
                    : "0 40px 100px -40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <div className="inline-flex items-center gap-2 mb-5">
                  <span
                    className="w-[7px] h-[7px] rounded-full"
                    style={{ background: isOrange ? "#111" : "#FF6A00" }}
                  />
                  <span
                    className="text-[10.5px] font-mono font-semibold tracking-[0.22em] uppercase"
                    style={{
                      color: isOrange
                        ? "rgba(17,17,17,0.85)"
                        : "rgba(255,255,255,0.75)",
                    }}
                  >
                    {p.eyebrow}
                  </span>
                </div>

                <h3
                  className="text-[24px] sm:text-[26px] font-bold leading-[1.15] tracking-[-0.02em]"
                  style={{ color: isOrange ? "#111" : "#FFF" }}
                >
                  {p.title}
                </h3>

                <p
                  className="mt-4 text-[14.5px] leading-[1.65]"
                  style={{
                    color: isOrange
                      ? "rgba(17,17,17,0.72)"
                      : "rgba(255,255,255,0.60)",
                  }}
                >
                  {p.body}
                </p>

                <div className="mt-auto pt-6">
                  <div
                    className="p-4"
                    style={{
                      borderRadius: 14,
                      border: isOrange
                        ? "1px solid rgba(0,0,0,0.14)"
                        : "1px solid rgba(255,255,255,0.10)",
                      background: isOrange
                        ? "rgba(255,255,255,0.28)"
                        : "rgba(0,0,0,0.28)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[13px] font-medium"
                        style={{
                          color: isOrange
                            ? "rgba(17,17,17,0.75)"
                            : "rgba(255,255,255,0.65)",
                        }}
                      >
                        {p.metricLabel}
                      </span>
                      <span
                        className="text-[14px] font-bold tabular-nums"
                        style={{ color: isOrange ? "#111" : "#FFF" }}
                      >
                        {p.metricValue}
                      </span>
                    </div>
                    <div
                      className="mt-2.5 h-2 rounded-full overflow-hidden"
                      style={{
                        background: isOrange
                          ? "rgba(0,0,0,0.18)"
                          : "rgba(255,255,255,0.08)",
                      }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${p.metricPct}%` }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{
                          duration: 1.2,
                          delay: 0.35 + i * 0.08,
                          ease: EASE,
                        }}
                        style={{ background: isOrange ? "#111" : "#FF6A00" }}
                      />
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
