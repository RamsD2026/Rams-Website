"use client";

import { motion } from "framer-motion";
import { HAIR, SOFT } from "@/components/sections/twin/TwinPanels";

/**
 * The five right-hand panes for `AtsHow`.
 *
 * Same language as `TwinPanels`, `MepsPanels` and `RdsPanels` — white ground,
 * #E8E8ED hairlines, mono caps labels, the RAG state set, one type scale — and
 * the same rule: they share a language, deliberately not a layout. The shape
 * of the pane carries as much of "which step is this" as the copy does:
 *
 *   01 Ingest      demand arriving from four sources
 *   02 Structure   one order opening into its tasks
 *   03 Orchestrate the queue sorting itself by priority
 *   04 Execute     tasks matched to the resource that will do them
 *   05 Adapt       plan v18 against plan v19, as a diff
 *
 * Nothing is generated. Every value is written down, so the server and the
 * client render the same first frame. Figures illustrate the mechanism; they
 * are not measured results.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

type State = "ok" | "warn" | "crit" | "sync" | "pend";

const STATE: Record<State, { bg: string; fg: string; glyph: string }> = {
  ok: { bg: "rgba(22,163,74,0.12)", fg: "#16A34A", glyph: "✓" },
  warn: { bg: "rgba(224,135,0,0.14)", fg: "#E08700", glyph: "•" },
  crit: { bg: "rgba(220,38,38,0.12)", fg: "#DC2626", glyph: "!" },
  sync: { bg: "rgba(62,99,221,0.12)", fg: "#3E63DD", glyph: "↻" },
  pend: { bg: "#F1F1F4", fg: "#A8A8B0", glyph: "○" },
};

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

function Badge({ state }: { state: State }) {
  const c = STATE[state];
  return (
    <span
      className="flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold shrink-0"
      style={{ background: c.bg, color: c.fg }}
    >
      {c.glyph}
    </span>
  );
}

function Micro({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[8.5px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/40">
      {children}
    </p>
  );
}

const FIG =
  "text-[30px] font-bold leading-none tracking-[-0.04em] text-carbon tabular-nums";
const UNIT = "text-[12px] font-semibold text-graphite/45";

const CARD_GAP = 8;
const CARD_H = 44;
const PITCH = CARD_H + CARD_GAP;

/* Fixed pitch, the list rendered twice, a linear translate of exactly one
   list's worth — the seamless loop every pane on this site uses. */
function ScrollRows<T>({
  items,
  speed = 1.9,
  render,
}: {
  items: T[];
  speed?: number;
  render: (item: T) => React.ReactNode;
}) {
  return (
    <div className="relative mt-3 flex-1 min-h-0 overflow-hidden">
      <motion.div
        className="flex flex-col"
        initial={{ y: 0 }}
        animate={{ y: [0, -(items.length * PITCH)] }}
        transition={{
          duration: items.length * speed,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {[...items, ...items].map((it, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-2.5 px-3 rounded-[10px]"
            style={{
              height: CARD_H,
              marginBottom: CARD_GAP,
              background: SOFT,
              border: `1px solid ${HAIR}`,
            }}
          >
            {render(it)}
          </div>
        ))}
      </motion.div>

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-8 pointer-events-none"
        style={{ background: "linear-gradient(to top, #FFFFFF, transparent)" }}
      />
    </div>
  );
}

/* ── 01 · ingest ─────────────────────────────────────────
   Demand arriving from four sources. The source is the point — a queue that
   cannot say where a task came from is a to-do list. */

const DEMAND: [string, string, State][] = [
  ["DO-4821 · outbound", "WMS", "sync"],
  ["IN-7138 · inbound", "TMS", "sync"],
  ["RPL-092 · replenish", "WMS", "sync"],
  ["Damage check · A14", "Supervisor", "warn"],
  ["PA-410 · putaway", "WMS", "sync"],
  ["Dock 02 ready", "Dock event", "ok"],
];

export function PanelIngest() {
  return (
    <Wrap>
      <div className="flex items-baseline justify-between gap-3">
        <Micro>Demand intake</Micro>
        <span className="text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-signal-orange">
          4 sources
        </span>
      </div>

      <ScrollRows
        items={DEMAND}
        render={([what, src, st]) => (
          <>
            <Badge state={st} />
            <span className="flex-1 min-w-0 flex flex-col gap-0.5">
              <span className="text-[10.5px] font-semibold text-carbon truncate">
                {what}
              </span>
              <span className="text-[9px] font-mono text-graphite/45 truncate">
                {src}
              </span>
            </span>
          </>
        )}
      />
    </Wrap>
  );
}

/* ── 02 · structure ──────────────────────────────────────
   One order opening into its tasks. A template is the difference between an
   order and work someone can actually be given. */

const TASKS: [string, string][] = [
  ["Confirm dock readiness", "Dock 06"],
  ["Pick wave 4821-A", "Aisles 03–07"],
  ["Stage to dock face", "22 pallets"],
  ["Load and seal", "Dock 06"],
];

export function PanelStructure({ t }: { t: number }) {
  /* Four beats to open the template, three to hold it. */
  const open = Math.min(TASKS.length, (Math.floor(t / 12) % 7) + 1);

  return (
    <Wrap>
      <div className="flex items-baseline justify-between gap-3">
        <Micro>Template · outbound order</Micro>
        <span className="text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-signal-orange tabular-nums">
          {open}/4 tasks
        </span>
      </div>

      <div
        className="mt-3 flex items-center gap-2.5 px-3 rounded-[10px] shrink-0"
        style={{
          height: 36,
          background: "rgba(255,106,0,0.06)",
          border: "1px solid rgba(255,106,0,0.30)",
        }}
      >
        <span className="text-[10.5px] font-mono font-bold text-signal-orange">
          DO-4821
        </span>
        <span className="ml-auto text-[9px] font-mono text-graphite/45">
          Due 15:10
        </span>
      </div>

      <div className="mt-2 flex flex-col gap-1.5 flex-1 min-h-0 overflow-hidden">
        {TASKS.map(([k, v], i) => {
          const on = i < open;
          return (
            <motion.div
              key={k}
              className="flex items-center gap-2.5 px-3 rounded-[10px] shrink-0"
              style={{
                height: 32,
                marginLeft: 12,
                background: SOFT,
                border: `1px solid ${HAIR}`,
              }}
              initial={false}
              animate={{ opacity: on ? 1 : 0.25, x: on ? 0 : -8 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <span className="text-[9px] font-mono font-bold text-graphite/35 tabular-nums shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-graphite/65 truncate">{k}</span>
              <span className="ml-auto text-[8.5px] font-mono text-graphite/40 shrink-0">
                {on ? v : "—"}
              </span>
            </motion.div>
          );
        })}
      </div>
    </Wrap>
  );
}

/* ── 03 · orchestrate ────────────────────────────────────
   The queue ordering itself. The reason column is the pane: a priority with
   no stated reason is an instruction, not a plan. */

const PLAN: [string, string, State][] = [
  ["Stage outbound · DO-4821", "SLA 15:10", "crit"],
  ["Unload inbound · IN-7138", "Dock free", "warn"],
  ["Replenish · RPL-092", "Feeds wave 5", "warn"],
  ["Putaway · PA-410", "No dependency", "ok"],
];

export function PanelOrchestrate() {
  return (
    <Wrap>
      <Micro>Sequenced plan · v18</Micro>

      <div className="mt-3 flex flex-col gap-2 flex-1 min-h-0 overflow-hidden">
        {PLAN.map(([k, why, st], i) => (
          <motion.div
            key={k}
            className="flex flex-col justify-center gap-1 px-3 rounded-[10px] shrink-0"
            style={{
              height: 52,
              background: SOFT,
              border: `1px solid ${i === 0 ? "rgba(255,106,0,0.32)" : HAIR}`,
            }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.45, delay: i * 0.1, ease: EASE }}
          >
            <span className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-bold text-graphite/35 tabular-nums shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[10.5px] font-semibold text-carbon truncate">
                {k}
              </span>
            </span>
            <span className="flex items-center gap-1.5 pl-5">
              <Badge state={st} />
              <span className="text-[9px] font-mono text-graphite/45 truncate">
                {why}
              </span>
            </span>
          </motion.div>
        ))}
      </div>
    </Wrap>
  );
}

/* ── 04 · execute ────────────────────────────────────────
   Work matched to the resource that will do it. Two columns, because an
   assignment is a pair. */

const PAIRS: [string, string, State][] = [
  ["Stage outbound", "MHE 07 · Dock 06", "ok"],
  ["Unload inbound", "Team B · Dock 02", "ok"],
  ["Replenish A14", "MHE 04", "warn"],
  ["Putaway buffer", "Unassigned", "pend"],
];

export function PanelExecute() {
  return (
    <Wrap>
      <div className="flex items-baseline justify-between gap-3">
        <Micro>Assignments</Micro>
        <span className="text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-signal-orange">
          Approved rules
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-2 flex-1 min-h-0 overflow-hidden">
        {PAIRS.map(([task, res, st], i) => (
          <motion.div
            key={task}
            className="flex items-center gap-2 px-3 rounded-[10px] shrink-0"
            style={{ height: 46, background: SOFT, border: `1px solid ${HAIR}` }}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.45, delay: i * 0.09, ease: EASE }}
          >
            <span className="text-[10px] text-graphite/65 truncate min-w-0 flex-1">
              {task}
            </span>
            <span
              aria-hidden
              className="text-[11px] leading-none shrink-0"
              style={{ color: "#FF6A00" }}
            >
              →
            </span>
            <span className="flex items-center gap-1.5 min-w-0 flex-1 justify-end">
              <span className="text-[9.5px] font-mono font-bold text-carbon truncate">
                {res}
              </span>
              <Badge state={st} />
            </span>
          </motion.div>
        ))}
      </div>
    </Wrap>
  );
}

/* ── 05 · adapt ──────────────────────────────────────────
   The replan, as a diff. A new plan version that cannot be compared with the
   one before it is not traceable, and traceability is the whole control. */

const DIFF: [string, string, State][] = [
  ["Replenishment moved ahead", "RPL-092", "ok"],
  ["Inbound resource released", "Team B", "ok"],
  ["Dependent tasks updated", "4 tasks", "sync"],
  ["Outbound SLA protected", "DO-4821", "ok"],
];

export function PanelAdapt() {
  return (
    <Wrap>
      <Micro>Replan · truck delayed 45 min</Micro>

      <div className="mt-2 flex items-baseline gap-1.5 shrink-0">
        <span className={FIG}>v19</span>
        <span className={UNIT}>from v18</span>
      </div>

      <ScrollRows
        items={DIFF}
        speed={2.1}
        render={([what, who, st]) => (
          <>
            <Badge state={st} />
            <span className="flex-1 min-w-0 flex flex-col gap-0.5">
              <span className="text-[10.5px] font-semibold text-carbon truncate">
                {what}
              </span>
              <span className="text-[9px] font-mono text-graphite/45 truncate">
                {who}
              </span>
            </span>
          </>
        )}
      />
    </Wrap>
  );
}
