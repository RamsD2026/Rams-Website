"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Boxes,
  CalendarRange,
  CheckCircle2,
  FileText,
  Ruler,
  SlidersHorizontal,
  TriangleAlert,
} from "lucide-react";
import Image from "next/image";
import {
  SHOTS,
  Section,
  type ShotKey,
} from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE } from "./irdsx-shared";

/**
 * 04 — IRDS Console. The web platform.
 *
 * Its own section, and built as the thing it describes: a sidebar of modules
 * and a screen. The field section beside it is a phone flanked by features,
 * because that is what a phone is — one screen at a time. This one is a
 * console, because that is what a console is — a nav and a workspace. Two
 * sections that used the same interaction would have said the two products are
 * the same product, which is the mistake this page exists to avoid.
 *
 * Eight modules, each with its own screen and its own three lines of what it
 * does. The walk moves every 4.6s; clicking a module takes it over without
 * stopping it.
 *
 * The frame's height is fixed and the copy block reserves its lines, so
 * changing module never moves the page.
 */

const DWELL_MS = 4600;
const LINE = "rgba(255,255,255,0.08)";

const MODULES = [
  {
    key: "estate",
    shot: "portfolio" as ShotKey,
    icon: Boxes,
    label: "Rack estate",
    title: "Build the estate once",
    body: "Site, rack system, row, rack, bay, level and component — each with an identity that lasts the asset's life.",
    points: ["Component registry", "Rack types and configurations", "Multi-site structure"],
  },
  {
    key: "rules",
    shot: "actionAssign" as ShotKey,
    icon: SlidersHorizontal,
    label: "Rules & action",
    title: "Write the method into the system",
    body: "Element, check point, work phase, issue detail and the action that follows — configured once, applied on every cycle.",
    points: ["Check point library", "Work-phase logic", "Action rules per finding"],
  },
  {
    key: "planner",
    shot: "maintenance" as ShotKey,
    icon: CalendarRange,
    label: "Planner",
    title: "Schedule and assign the programme",
    body: "Cycles across sites, assigned to teams, with upcoming, active, overdue and completed work in one view.",
    points: ["Cycle scheduling", "Team assignment", "Status across the portfolio"],
  },
  {
    key: "findings",
    shot: "findingsList" as ShotKey,
    icon: TriangleAlert,
    label: "Findings",
    title: "Triage what came back from the floor",
    body: "Every observation arrives with its location, its evidence and the rule that raised it, ready to be judged.",
    points: ["Severity by configured logic", "Filter by location or component", "Bulk review and action"],
  },
  {
    key: "testing",
    shot: "regionalAnalytics" as ShotKey,
    icon: Ruler,
    label: "Testing",
    title: "Compute results, not opinions",
    body: "Field readings are calculated against the configured threshold, and the result carries the arithmetic behind it.",
    points: ["G1–G5 test set", "Threshold and severity logic", "Result traceable to the reading"],
  },
  {
    key: "closure",
    shot: "taskDetails" as ShotKey,
    icon: CheckCircle2,
    label: "Closure",
    title: "Take a finding to verified",
    body: "Owner, due date, repair or replacement scope, completion evidence and the verification that closes it.",
    points: ["Corrective action", "Repair and replacement scope", "Evidence-based verification"],
  },
  {
    key: "reports",
    shot: "boq" as ShotKey,
    icon: FileText,
    label: "Reports",
    title: "Assemble the evidence pack",
    body: "Cycle and site reports built from the records themselves, with test annexures and traceability to each element.",
    points: ["Cycle and site reports", "Test annexures", "PDF and Excel export"],
  },
  {
    key: "analytics",
    shot: "regionalRanking" as ShotKey,
    icon: BarChart3,
    label: "Analytics",
    title: "Read across cycles, not inside one",
    body: "Coverage, risk distribution, closure performance and recurrence — compared cycle against cycle and site against site.",
    points: ["Coverage and closure", "Risk by location", "Recurrence between cycles"],
  },
];

export function IrxConsole() {
  const [at, setAt] = useState(0);
  const [nudge, setNudge] = useState(0);
  const m = MODULES[at];

  useEffect(() => {
    const id = setInterval(
      () => setAt((v) => (v + 1) % MODULES.length),
      DWELL_MS,
    );
    return () => clearInterval(id);
  }, [nudge]);

  const pick = (n: number) => {
    setAt(n);
    setNudge((v) => v + 1);
  };

  return (
    <Section surface="white" id="console">
      <SectionHeader
        eyebrow="IRDS Console · the web platform"
        top="Everything decided before"
        bottom="And after the walk."
        size="compact"
        width="wide"
        body="The programme's product. The method, the schedule, the judgement, the closure and the evidence — eight modules on the same rack record the app writes to."
      />

      {/* The section is built as the thing it describes: a sidebar and a
          workspace. */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="overflow-hidden"
        style={{
          borderRadius: 18,
          background: "#0C0C0F",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 60px 120px -50px rgba(14,14,15,0.55)",
        }}
      >
        <div
          className="flex items-center gap-2 px-4 h-11"
          style={{ borderBottom: `1px solid ${LINE}`, background: "#111114" }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.14)" }}
            />
          ))}
          <div
            className="ml-3 flex-1 max-w-[320px] h-6 rounded-md flex items-center px-3"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <span className="text-[10.5px] font-mono text-white/35 truncate">
              app.rams.digital/irds/{m.key}
            </span>
          </div>
          <span className="ml-auto hidden sm:block text-[10px] font-mono font-bold tracking-[0.14em] uppercase text-white/25">
            Kolkata DC · cycle 04
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[214px_minmax(0,1fr)]">
          {/* the module nav */}
          <div
            className="p-3 lg:border-r flex lg:flex-col gap-1 overflow-x-auto"
            style={{ borderColor: LINE, background: "#0A0A0D" }}
          >
            {MODULES.map((x, n) => {
              const on = n === at;
              return (
                <button
                  key={x.key}
                  type="button"
                  onClick={() => pick(n)}
                  aria-current={on ? "true" : undefined}
                  className="relative shrink-0 flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors duration-300"
                  style={{
                    background: on ? "rgba(255,106,0,0.12)" : "transparent",
                  }}
                >
                  {on && (
                    <motion.span
                      layoutId="irx-console-edge"
                      aria-hidden
                      className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full hidden lg:block"
                      style={{ background: "#FF6A00" }}
                      transition={{ duration: 0.35, ease: EASE }}
                    />
                  )}
                  <x.icon
                    className="w-[15px] h-[15px] shrink-0 transition-colors duration-300"
                    strokeWidth={2}
                    style={{
                      color: on ? "#FF9B4D" : "rgba(255,255,255,0.35)",
                    }}
                  />
                  <span
                    className="text-[12.5px] font-semibold whitespace-nowrap transition-colors duration-300"
                    style={{
                      color: on ? "#FFFFFF" : "rgba(255,255,255,0.45)",
                    }}
                  >
                    {x.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* the workspace */}
          <div className="p-4 sm:p-6 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_270px] gap-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={m.key}
                initial={{ opacity: 0, scale: 1.008 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <div
                  className="relative w-full overflow-hidden"
                  style={{
                    aspectRatio: "16 / 10",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.10)",
                  }}
                >
                  <Image
                    src={SHOTS[m.shot].src}
                    alt={SHOTS[m.shot].alt}
                    fill
                    sizes="(max-width: 1280px) 100vw, 760px"
                    className="object-cover object-left-top"
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* what this module is for. Heights reserved so switching does
                not move the frame. */}
            <div className="min-h-[248px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={m.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <p className="text-[9.5px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
                    {m.label}
                  </p>
                  <h3 className="mt-3 min-h-[2.3em] text-[18px] font-bold tracking-[-0.02em] leading-[1.25] text-white">
                    {m.title}
                  </h3>
                  <p className="mt-3 min-h-[5.6em] text-[12.5px] leading-[1.65] text-white/45">
                    {m.body}
                  </p>

                  <div className="mt-5 flex flex-col gap-2.5">
                    {m.points.map((p) => (
                      <span
                        key={p}
                        className="flex items-start gap-2.5 text-[11.5px] leading-[1.5] text-white/55"
                      >
                        <span
                          aria-hidden
                          className="mt-[6px] w-2 h-px shrink-0"
                          style={{ background: "#FF6A00" }}
                        />
                        {p}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
