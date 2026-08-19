"use client";

import { motion } from "framer-motion";
import { ArrowRight, Truck } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

type BadgeTone = "dark" | "amber" | "blue" | "orange" | "green";

const BADGE_STYLES: Record<BadgeTone, { bg: string; color: string }> = {
  dark: { bg: "#EAF1F4", color: "#18323A" },
  amber: { bg: "#FFF5E6", color: "#A45C00" },
  blue: { bg: "#EEF5FF", color: "#2E78C7" },
  orange: { bg: "#FFF0E6", color: "#D85A00" },
  green: { bg: "#EDF9F2", color: "#22945A" },
};

const STEPS: {
  n: string;
  title: string;
  body: string;
  badge: string;
  tone: BadgeTone;
}[] = [
  {
    n: "01",
    title: "Original plan created",
    body: "The shift starts with planned unloading, staging, replenishment and dispatch activities already sequenced for the expected truck arrival.",
    badge: "Planned execution",
    tone: "dark",
  },
  {
    n: "02",
    title: "Truck delay occurs",
    body: "The inbound truck is delayed due to traffic, which means the original unloading and follow-on tasks can no longer happen as planned.",
    badge: "Delay detected",
    tone: "amber",
  },
  {
    n: "03",
    title: "Delay update flows into ATOS",
    body: "The revised ETA can come through an integrated GPS tracker or a manual update by the warehouse manager, giving ATOS the live input needed to adjust the plan.",
    badge: "ETA updated",
    tone: "blue",
  },
  {
    n: "04",
    title: "ATOS reprioritises tasks",
    body: "ATOS reorders pending work, shifts task priority and reallocates MHE/operator attention to the next most useful activities during the delay window.",
    badge: "Plan re-sequenced",
    tone: "orange",
  },
  {
    n: "05",
    title: "Updated execution goes live",
    body: "Supervisors and operators now work from a revised plan that reduces idle time, protects throughput and prepares for the delayed truck's new arrival.",
    badge: "Execution updated",
    tone: "green",
  },
];

const ORIGINAL_PLAN = [
  { label: "Unload TRK-118", moved: true },
  { label: "Stage inbound", moved: true },
  { label: "Replenish B-12", moved: false },
  { label: "Dispatch wave 3", moved: false },
];

const REVISED_PLAN = [
  { label: "Replenish B-12", moved: false },
  { label: "Dispatch wave 3", moved: false },
  { label: "Cycle count C-08", moved: false, added: true },
  { label: "Unload TRK-118", moved: true },
];

export function WexReprioritisation() {
  return (
    <section
      id="reprioritisation"
      className="relative overflow-hidden bg-[#F5F5F7] pt-28 sm:pt-36 lg:pt-44 pb-28 sm:pb-36 lg:pb-44"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-0 w-[720px] h-[720px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,106,0,0.10), transparent 70%)",
        }}
      />

      <div className="relative rams-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.75, ease: EASE }}
          className="relative max-w-[1240px] mx-auto p-7 sm:p-10 lg:p-12 bg-white"
          style={{
            borderRadius: 28,
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.02), 0 30px 80px -30px rgba(0,0,0,0.15)",
          }}
        >
          {/* ─── Header ──────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-8 lg:gap-14 items-end mb-10 sm:mb-12">
            <div>
              <div className="inline-flex items-center gap-2 mb-5">
                <span className="w-[7px] h-[7px] rounded-full bg-signal-orange" />
                <span className="text-[10.5px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange">
                  Dynamic Reprioritisation
                </span>
              </div>
              <h2 className="text-[30px] sm:text-[40px] lg:text-[46px] font-bold text-carbon leading-[1.08] tracking-[-0.035em]">
                When a truck is delayed, ATOS rearranges the day&rsquo;s
                execution plan.
              </h2>
            </div>
            <p className="text-[15px] sm:text-[16px] text-graphite/70 leading-[1.7]">
              If an incoming truck is stuck in traffic, the warehouse manager
              can update the delay in the system. ATOS then uses that input to
              re-sequence tasks, shift priorities and align MHE and operator
              effort with the revised arrival time.
            </p>
          </div>

          {/* ─── Before / after plan strip ───────────────────── */}
          <PlanShiftVisual />

          {/* ─── Chapter divider ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="mt-12 sm:mt-14 mb-9 sm:mb-10 flex items-center gap-5"
          >
            <span className="text-[10.5px] font-mono font-bold tracking-[0.22em] uppercase text-signal-orange shrink-0">
              How the change flows
            </span>
            <span
              aria-hidden
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,106,0,0.35) 0%, rgba(0,0,0,0.08) 40%, transparent 100%)",
              }}
            />
          </motion.div>

          {/* ─── 5-step flow ─────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3.5">
            {STEPS.map((s, i) => {
              const badge = BADGE_STYLES[s.tone];
              const isLast = i === STEPS.length - 1;
              return (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                  className="relative flex flex-col p-5 sm:p-6"
                  style={{
                    borderRadius: 18,
                    border: "1px solid #E2E8EA",
                    background: "#F8FAFB",
                    minHeight: 250,
                  }}
                >
                  {!isLast && (
                    <span
                      aria-hidden
                      className="hidden lg:grid absolute -right-[13px] top-1/2 -translate-y-1/2 w-[26px] h-[26px] rounded-full place-items-center z-[2]"
                      style={{ background: "#0C1619" }}
                    >
                      <ArrowRight
                        className="w-[13px] h-[13px] text-white"
                        strokeWidth={2.4}
                      />
                    </span>
                  )}

                  <div
                    className="w-[34px] h-[34px] rounded-full grid place-items-center text-[11px] font-mono font-bold text-white mb-5"
                    style={{ background: "#0C1619" }}
                  >
                    {s.n}
                  </div>

                  <h3 className="text-[17px] sm:text-[18px] font-bold text-carbon leading-[1.22] tracking-[-0.015em]">
                    {s.title}
                  </h3>
                  <p className="mt-2.5 text-[13px] text-graphite/65 leading-[1.6]">
                    {s.body}
                  </p>

                  <div className="mt-auto pt-5">
                    <span
                      className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-[10px] text-[11px] font-semibold"
                      style={{ background: badge.bg, color: badge.color }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: badge.color }}
                      />
                      {s.badge}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Before / after task sequence ─────────────────────────── */

function PlanShiftVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="grid grid-cols-1 lg:grid-cols-[0.72fr_1.28fr] gap-5"
    >
      {/* Delay trigger */}
      <div
        className="flex flex-col justify-center p-6 sm:p-7"
        style={{
          borderRadius: 22,
          background: "linear-gradient(180deg, #0F0F11 0%, #1A1A1D 100%)",
          boxShadow: "0 30px 60px -30px rgba(0,0,0,0.35)",
        }}
      >
        <div className="flex items-center gap-2.5 mb-5">
          <span
            className="w-9 h-9 rounded-[10px] grid place-items-center"
            style={{
              background: "rgba(255,176,32,0.12)",
              border: "1px solid rgba(255,176,32,0.3)",
            }}
          >
            <Truck
              className="w-[18px] h-[18px]"
              strokeWidth={2}
              style={{ color: "#FFBE47" }}
            />
          </span>
          <div>
            <div className="text-[9.5px] font-mono font-bold tracking-[0.18em] uppercase text-white/45">
              Inbound
            </div>
            <div className="text-[14px] font-semibold text-white tracking-[-0.01em]">
              TRK-118
            </div>
          </div>
        </div>

        <div className="flex items-baseline gap-2.5 flex-wrap">
          <span className="text-[15px] font-semibold text-white/40 line-through tabular-nums">
            11:20
          </span>
          <ArrowRight
            className="w-4 h-4 text-white/30 shrink-0"
            strokeWidth={2}
            aria-hidden
          />
          <span className="text-[26px] sm:text-[30px] font-bold text-white tabular-nums tracking-[-0.03em]">
            12:02
          </span>
          <span
            className="text-[10px] font-mono font-bold tracking-[0.12em] uppercase px-2 py-1 rounded-full"
            style={{ background: "rgba(255,176,32,0.14)", color: "#FFBE47" }}
          >
            +42 min
          </span>
        </div>

        <p className="mt-4 text-[13px] text-white/55 leading-[1.6]">
          Revised ETA received from the GPS tracker. ATOS treats the delay as an
          input, not an interruption.
        </p>
      </div>

      {/* Sequence comparison */}
      <div
        className="p-6 sm:p-7"
        style={{
          borderRadius: 22,
          border: "1px solid #E2E8EA",
          background: "#F8FAFB",
        }}
      >
        <PlanRow
          label="Original plan"
          sublabel="Sequenced for 11:20 arrival"
          items={ORIGINAL_PLAN}
          variant="before"
        />

        <div className="my-5 flex items-center gap-3">
          <span
            className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-[0.14em] uppercase shrink-0"
            style={{ background: "#FFF0E6", color: "#D85A00" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#D85A00" }}
            />
            ATOS re-sequences
          </span>
          <span
            aria-hidden
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,106,0,0.4) 0%, rgba(0,0,0,0.08) 60%, transparent 100%)",
            }}
          />
        </div>

        <PlanRow
          label="Revised plan"
          sublabel="Idle time absorbed by ready work"
          items={REVISED_PLAN}
          variant="after"
        />
      </div>
    </motion.div>
  );
}

function PlanRow({
  label,
  sublabel,
  items,
  variant,
}: {
  label: string;
  sublabel: string;
  items: { label: string; moved: boolean; added?: boolean }[];
  variant: "before" | "after";
}) {
  const isAfter = variant === "after";
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
        <span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-carbon/70">
          {label}
        </span>
        <span className="text-[11.5px] text-graphite/55">{sublabel}</span>
      </div>

      <div className="flex items-stretch gap-2 flex-wrap">
        {items.map((it, i) => {
          const highlight = isAfter ? it.moved || it.added : it.moved;
          return (
            <motion.span
              key={`${label}-${it.label}`}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.45,
                delay: (isAfter ? 0.45 : 0.1) + i * 0.07,
                ease: EASE,
              }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-[10px] text-[12px] font-medium"
              style={{
                background: highlight
                  ? isAfter
                    ? "#FFF0E6"
                    : "#FFFFFF"
                  : "#FFFFFF",
                border: highlight
                  ? isAfter
                    ? "1px solid rgba(216,90,0,0.32)"
                    : "1px dashed rgba(164,92,0,0.42)"
                  : "1px solid #E2E8EA",
                color: highlight && isAfter ? "#D85A00" : "#0E0E0F",
                opacity: !isAfter && it.moved ? 0.6 : 1,
              }}
            >
              <span
                className="text-[9.5px] font-mono font-bold tabular-nums"
                style={{
                  color:
                    highlight && isAfter
                      ? "rgba(216,90,0,0.7)"
                      : "rgba(14,14,15,0.35)",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {it.label}
              {isAfter && it.added && (
                <span
                  className="text-[9px] font-mono font-bold tracking-[0.1em] uppercase px-1.5 py-0.5 rounded"
                  style={{ background: "#EDF9F2", color: "#22945A" }}
                >
                  Added
                </span>
              )}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}
