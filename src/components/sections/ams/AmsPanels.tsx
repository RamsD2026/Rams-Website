"use client";

import { motion } from "framer-motion";
import { HAIR, SOFT } from "@/components/sections/twin/TwinPanels";

/**
 * The six right-hand panes for `AmsHow`, reused by `AmsCapabilities`.
 *
 * Same language as the panel sets on the other platform pages — white ground,
 * #E8E8ED hairlines, mono caps labels, one type scale — and the same rule:
 * they share a language, deliberately not a layout. The shape of the pane
 * carries as much of "which step is this" as the copy does:
 *
 *   01 Connect     the sources coming up, one at a time
 *   02 Context     one signal collecting the six things that place it
 *   03 Analyse     two module series over one day, and where they coincide
 *   04 Prioritise  issues ranked by what they cost the operation
 *   05 Act         the management case — owner, due date, approval, evidence
 *   06 Learn       closure and recurrence, read across sites
 *
 * Green, amber and red mean condition here, as everywhere else on this site.
 *
 * Nothing is generated. Every value is written down, so the server and the
 * client render the same first frame. Figures illustrate the mechanism; they
 * are not measured results, and no site named is a customer.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const GREEN = "#16A34A";
const AMBER = "#E08700";
const RED = "#DC2626";
const BLUE = "#3E63DD";

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="flex flex-col min-h-0 h-full overflow-hidden px-4 py-4"
    >
      {children}
    </motion.div>
  );
}

function Micro({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[8.5px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/40">
      {children}
    </p>
  );
}

const ROW: React.CSSProperties = {
  background: SOFT,
  border: `1px solid ${HAIR}`,
  borderRadius: 10,
};

/* ── 01 · connect ────────────────────────────────────────
   What AIMS is allowed to see decides everything after it, so the first pane
   is the source list coming up. The counter walks a modulo cycle with three
   idle beats at the end — a saturating `Math.min` would freeze the pane a few
   seconds in and leave it frozen. */

const SOURCES: [string, string][] = [
  ["Digital Twin", "spatial context"],
  ["IRDS", "12 sites"],
  ["MEPS", "18 sites"],
  ["RTSS", "9 sites"],
  ["IMDS", "24 sites"],
  ["ATOS", "16 sites"],
  ["WMS / ERP", "approved APIs"],
];

export function PanelConnect({ t }: { t: number }) {
  const up = Math.floor(t / 9) % (SOURCES.length + 3);

  return (
    <Wrap>
      <div className="flex items-baseline justify-between gap-3">
        <Micro>Sources</Micro>
        <span className="text-[8.5px] font-mono font-bold tabular-nums text-graphite/35">
          {Math.min(up, SOURCES.length)}/{SOURCES.length}
        </span>
      </div>

      <div className="mt-3 flex flex-col flex-1 min-h-0 gap-1.5">
        {SOURCES.map(([k, v], i) => {
          const on = i < up;
          return (
            <motion.div
              key={k}
              className="flex items-center gap-2.5 px-2.5 shrink-0"
              style={{ ...ROW, height: 30 }}
              initial={false}
              animate={{ opacity: on ? 1 : 0.4, x: on ? 0 : -4 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <motion.span
                className="flex items-center justify-center w-4 h-4 rounded-full text-[8px] font-bold shrink-0"
                initial={false}
                animate={{
                  backgroundColor: on ? "rgba(22,163,74,0.12)" : "#F1F1F4",
                  color: on ? GREEN : "#A8A8B0",
                }}
                transition={{ duration: 0.35 }}
              >
                {on ? "✓" : "○"}
              </motion.span>
              <span className="text-[10px] font-bold text-carbon truncate">
                {k}
              </span>
              <span className="ml-auto text-[9px] font-mono text-graphite/40 shrink-0">
                {on ? v : "—"}
              </span>
            </motion.div>
          );
        })}
      </div>
    </Wrap>
  );
}

/* ── 02 · context ────────────────────────────────────────
   One signal, and the six things that turn it from an event into something a
   manager can act on. Without these it is a row in a log. */

const CONTEXT: [string, string][] = [
  ["Site", "Pune DC–02"],
  ["Location", "Aisle B · outbound"],
  ["Asset", "Rack B-14 · MHE 07"],
  ["Operator", "Session OP-118"],
  ["Process", "Dispatch peak"],
  ["Time", "18:04 · shift 2"],
];

export function PanelContext() {
  return (
    <Wrap>
      <div className="flex items-baseline justify-between gap-3">
        <Micro>Signal in context</Micro>
        <span className="text-[8.5px] font-mono font-bold text-graphite/35">
          IRDS · impact
        </span>
      </div>

      <div className="mt-3 flex flex-col flex-1 min-h-0">
        {CONTEXT.map(([k, v], i) => (
          <motion.span
            key={k}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07, ease: EASE }}
            className="flex items-center justify-between gap-3 flex-1 min-h-0"
            style={{ borderBottom: `1px dashed ${HAIR}` }}
          >
            <span className="text-[10px] text-graphite/50 truncate">{k}</span>
            <span className="text-[10px] font-mono font-bold text-carbon text-right truncate shrink-0">
              {v}
            </span>
          </motion.span>
        ))}
      </div>
    </Wrap>
  );
}

/* ── 03 · analyse ────────────────────────────────────────
   The source document's own example: rack impacts against MHE congestion
   across one day, and the hour where both peak. Two series in one frame is
   the only shape that can show a relationship — a number cannot. */

const HOURS = ["06", "09", "12", "15", "18", "21"];
/** Two modules' readings for one site, by hour. Both scaled 0–1. */
const IMPACTS = [0.15, 0.25, 0.3, 0.45, 0.95, 0.4];
const CONGESTION = [0.2, 0.35, 0.4, 0.55, 0.9, 0.35];
/** Where they coincide. */
const AT = 4;

export function PanelAnalyse() {
  return (
    <Wrap>
      <div className="flex items-baseline justify-between gap-3">
        <Micro>Correlation</Micro>
        <span className="text-[8.5px] font-mono font-bold text-graphite/35">
          Pune DC–02 · 24 h
        </span>
      </div>

      <div className="mt-3 flex items-center gap-3 shrink-0">
        {[
          ["Rack impacts", RED],
          ["MHE congestion", BLUE],
        ].map(([k, tint]) => (
          <span key={k} className="flex items-center gap-1.5">
            <span
              className="w-2 h-[3px] rounded-full"
              style={{ background: tint }}
            />
            <span className="text-[8px] font-mono font-bold tracking-[0.1em] uppercase text-graphite/40">
              {k}
            </span>
          </span>
        ))}
      </div>

      <div className="mt-3 flex-1 min-h-0 flex items-end gap-1.5">
        {HOURS.map((h, i) => {
          const hot = i === AT;
          return (
            <span
              key={h}
              className="flex-1 h-full flex flex-col justify-end items-center gap-1"
            >
              <span className="w-full flex-1 flex items-end justify-center gap-[3px]">
                {[
                  [IMPACTS[i], RED],
                  [CONGESTION[i], BLUE],
                ].map(([f, tint], n) => (
                  <motion.span
                    key={n}
                    className="w-[6px] rounded-t-[2px]"
                    style={{ background: tint as string }}
                    initial={{ height: 0 }}
                    animate={{ height: `${(f as number) * 100}%` }}
                    transition={{
                      duration: 0.6,
                      delay: 0.1 + i * 0.05,
                      ease: EASE,
                    }}
                  />
                ))}
              </span>
              <span
                className="text-[8px] font-mono tabular-nums"
                style={{ color: hot ? "#D95A00" : "rgba(20,22,26,0.35)" }}
              >
                {h}
              </span>
            </span>
          );
        })}
      </div>

      <p
        className="mt-3 px-2.5 py-2 text-[9px] leading-[1.5] text-graphite/60 shrink-0"
        style={{
          borderRadius: 8,
          background: "rgba(255,106,0,0.06)",
          border: "1px solid rgba(255,106,0,0.22)",
        }}
      >
        Impacts and congestion peak together at the 18:00 dispatch window.
      </p>
    </Wrap>
  );
}

/* ── 04 · prioritise ─────────────────────────────────────
   Ranked by what the condition costs the operation, not by which module
   shouted loudest. The bar is the rank made visible. */

const PRIORITIES: [string, string, number, string][] = [
  ["Rack impacts at dispatch", "Pune DC–02", 0.94, RED],
  ["Repeat MHE downtime", "Patna DC", 0.81, RED],
  ["Inventory dwell exceptions", "Surat DC", 0.66, AMBER],
  ["Overdue rack closure", "Bhubaneswar", 0.52, AMBER],
  ["Safety near-miss trend", "Kolkata DC", 0.38, AMBER],
];

export function PanelPrioritise() {
  return (
    <Wrap>
      <div className="flex items-baseline justify-between gap-3">
        <Micro>Ranked by impact</Micro>
        <span className="text-[8.5px] font-mono font-bold text-graphite/35">
          safety · cost · output
        </span>
      </div>

      <div className="mt-3 flex flex-col flex-1 min-h-0 gap-2">
        {PRIORITIES.map(([k, site, f, tint], i) => (
          <motion.div
            key={k}
            className="flex flex-col justify-center gap-1.5 px-2.5 flex-1 min-h-0"
            style={ROW}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
          >
            <span className="flex items-baseline justify-between gap-2">
              <span className="text-[10px] font-bold text-carbon truncate">
                {k}
              </span>
              <span className="text-[8.5px] font-mono text-graphite/40 shrink-0">
                {site}
              </span>
            </span>
            <span
              className="relative h-1 rounded-full overflow-hidden"
              style={{ background: "#F1F1F4" }}
            >
              <motion.span
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: tint }}
                initial={{ width: 0 }}
                animate={{ width: `${f * 100}%` }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.06, ease: EASE }}
              />
            </span>
          </motion.div>
        ))}
      </div>
    </Wrap>
  );
}

/* ── 05 · act ────────────────────────────────────────────
   One management case. The source document is specific that high-impact
   decisions stay behind authorised approval, so approval is a row here and
   not an implication. */

const CASE: [string, string][] = [
  ["Owner", "Regional ops · RK"],
  ["Due", "12 Sep · 18:00"],
  ["Modules", "IRDS · MEPS · ATOS"],
  ["Evidence", "3 findings · 1 clip"],
  ["Approval", "Site head · pending"],
];

export function PanelAct() {
  return (
    <Wrap>
      <div className="flex items-baseline justify-between gap-3">
        <Micro>Management case</Micro>
        <span
          className="px-2 py-[3px] rounded-full text-[8px] font-mono font-bold tracking-[0.12em] uppercase"
          style={{ background: "rgba(224,135,0,0.14)", color: AMBER }}
        >
          Assigned
        </span>
      </div>

      <div
        className="mt-3 px-3 py-2.5 shrink-0"
        style={{ ...ROW, background: "#FFFFFF" }}
      >
        <p className="text-[11px] font-bold text-carbon leading-[1.3]">
          Pune DC–02 · dispatch-peak intervention
        </p>
        <p className="mt-1 text-[9px] leading-[1.5] text-graphite/55">
          Rack safety, route and staging actions connected under one case.
        </p>
      </div>

      <div className="mt-2.5 flex flex-col flex-1 min-h-0">
        {CASE.map(([k, v], i) => (
          <motion.span
            key={k}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07, ease: EASE }}
            className="flex items-center justify-between gap-3 flex-1 min-h-0"
            style={{ borderBottom: `1px dashed ${HAIR}` }}
          >
            <span className="text-[10px] text-graphite/50 truncate">{k}</span>
            <span className="text-[10px] font-mono font-bold text-carbon text-right truncate shrink-0">
              {v}
            </span>
          </motion.span>
        ))}
      </div>
    </Wrap>
  );
}

/* ── 06 · learn ──────────────────────────────────────────
   Closure on its own proves paperwork. Recurrence is the column that says
   whether the intervention actually held, which is why both are here and why
   the worst recurrence is the one flagged. */

const LEARN: [string, string, string, string][] = [
  ["Pune DC–02", "94%", "1 of 12", GREEN],
  ["Patna DC", "72%", "4 of 9", RED],
  ["Surat DC", "88%", "2 of 11", AMBER],
  ["Kolkata DC", "91%", "1 of 8", GREEN],
  ["Bhubaneswar", "79%", "3 of 10", AMBER],
];

export function PanelLearn() {
  return (
    <Wrap>
      <div className="flex items-baseline justify-between gap-3">
        <Micro>After closure</Micro>
        <span className="text-[8.5px] font-mono font-bold text-graphite/35">
          90 days
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2 px-2.5 shrink-0">
        <span className="text-[8px] font-mono font-bold tracking-[0.12em] uppercase text-graphite/30 flex-1">
          Site
        </span>
        <span className="text-[8px] font-mono font-bold tracking-[0.12em] uppercase text-graphite/30 w-[52px] text-right">
          Closed
        </span>
        <span className="text-[8px] font-mono font-bold tracking-[0.12em] uppercase text-graphite/30 w-[58px] text-right">
          Recurred
        </span>
      </div>

      <div className="mt-1.5 flex flex-col flex-1 min-h-0 gap-1.5">
        {LEARN.map(([site, closed, again, tint], i) => (
          <motion.div
            key={site}
            className="flex items-center gap-2 px-2.5 flex-1 min-h-0"
            style={ROW}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
          >
            <span className="text-[10px] font-bold text-carbon truncate flex-1">
              {site}
            </span>
            <span className="w-[52px] text-right text-[10px] font-mono tabular-nums text-graphite/55">
              {closed}
            </span>
            <span
              className="w-[58px] text-right text-[10px] font-mono font-bold tabular-nums"
              style={{ color: tint }}
            >
              {again}
            </span>
          </motion.div>
        ))}
      </div>
    </Wrap>
  );
}
