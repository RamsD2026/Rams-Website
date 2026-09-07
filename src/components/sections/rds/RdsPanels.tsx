"use client";

import { motion } from "framer-motion";
import { HAIR, SOFT } from "@/components/sections/twin/TwinPanels";

/**
 * The five right-hand panes for `RdsHow`.
 *
 * Same language as `TwinPanels` and `MepsPanels` — white ground, #E8E8ED
 * hairlines, mono caps labels, the RAG state set, one type scale — and the
 * same rule: they share a language, deliberately not a layout. The shape of
 * the pane carries as much of "which step is this" as the copy does:
 *
 *   01 Digitise   the structure counting itself up
 *   02 Inspect    one checklist being worked through
 *   03 Classify   the cycle's findings split by severity
 *   04 Rectify    actions with an owner and a state, scrolling
 *   05 Verify     closures verified, and the pattern behind them
 *
 * Red, Amber and Green mean severity here and nowhere else on the page. That
 * is why the overview grid's twelve tints are decorative and unrelated: on a
 * rack-safety page a colour that could be read as a risk state must be one.
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

/* ── the upward scroll ───────────────────────────────────
   Fixed pitch per row, the list rendered twice, and a linear translate of
   exactly one list's worth so there is no seam. `PITCH` stays tied to
   `CARD_H` or the loop shows a join. */
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

/* ── 01 · digitise + plan ────────────────────────────────
   The structure counting itself up. Four numbers arriving in order is what
   digitising an estate looks like from outside. */

const STRUCTURE: [string, number][] = [
  ["Rows", 12],
  ["Racks", 208],
  ["Bays", 1040],
  ["Components", 6240],
];

export function PanelDigitise({ t }: { t: number }) {
  /* One tile lands every ~1.5s, the set holds for three beats, then it
     starts again. Without the modulo it fills once and never resets —
     `t` only grows, so a second pass through this step would arrive
     already finished. */
  const landed = Math.min(
    STRUCTURE.length,
    (Math.floor(t / 14) % 7) + 1,
  );

  return (
    <Wrap>
      <div className="flex items-baseline justify-between gap-3">
        <Micro>Rack structure</Micro>
        <span className="text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-signal-orange tabular-nums">
          {landed}/4 mapped
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 flex-1 min-h-0">
        {STRUCTURE.map(([k, v], i) => (
          <motion.div
            key={k}
            className="flex flex-col justify-center px-3 rounded-[10px] min-h-0"
            style={{ background: SOFT, border: `1px solid ${HAIR}` }}
            initial={false}
            animate={{ opacity: i < landed ? 1 : 0.25, y: i < landed ? 0 : 6 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <span className="text-[8.5px] font-mono font-bold tracking-[0.14em] uppercase text-graphite/45 truncate">
              {k}
            </span>
            <span className="mt-1 text-[19px] font-bold leading-none tracking-[-0.03em] text-carbon tabular-nums">
              {i < landed ? v.toLocaleString("en-GB") : "—"}
            </span>
          </motion.div>
        ))}
      </div>
    </Wrap>
  );
}

/* ── 02 · inspect ────────────────────────────────────────
   One checklist, worked through. An inspection is a sequence of the same
   questions asked at one location, so the pane is that sequence. */

const CHECKS: [string, State][] = [
  ["Upright plumb", "ok"],
  ["Beam deflection", "ok"],
  ["Baseplate + anchors", "warn"],
  ["Bracing", "ok"],
  ["Load sign present", "ok"],
  ["Impact damage survey", "crit"],
];

export function PanelInspect({ t }: { t: number }) {
  /* Six beats to work the checklist, three to hold it complete. */
  const done = Math.min(CHECKS.length, (Math.floor(t / 10) % 9) + 1);

  return (
    <Wrap>
      <div className="flex items-baseline justify-between gap-3">
        <Micro>Checklist · Rack B-17</Micro>
        <span className="text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-signal-orange tabular-nums">
          {done}/{CHECKS.length}
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-1.5 flex-1 min-h-0 overflow-hidden">
        {CHECKS.map(([k, st], i) => {
          const on = i < done;
          return (
            <motion.div
              key={k}
              className="flex shrink-0 items-center gap-2.5 px-3 rounded-[10px]"
              style={{
                height: 30,
                background: SOFT,
                border: `1px solid ${on ? STATE[st].fg + "3D" : HAIR}`,
              }}
              initial={false}
              animate={{ opacity: on ? 1 : 0.3, x: on ? 0 : -8 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <Badge state={on ? st : "pend"} />
              <span className="text-[10px] text-graphite/65 truncate">{k}</span>
            </motion.div>
          );
        })}
      </div>
    </Wrap>
  );
}

/* ── 03 · classify ───────────────────────────────────────
   The cycle's findings split by severity. A stacked bar says "this is one
   whole thing divided up", which three separate counters do not. */

const RAG: [string, number, string][] = [
  ["Green · monitor", 200, "#16A34A"],
  ["Amber · action required", 42, "#E08700"],
  ["Red · immediate action", 3, "#DC2626"],
];
const RAG_TOTAL = RAG.reduce((n, [, v]) => n + v, 0);

export function PanelClassify() {
  return (
    <Wrap>
      <Micro>RAG classification · cycle 04</Micro>

      <div className="mt-2 flex items-baseline gap-1.5 shrink-0">
        <span className={FIG}>{RAG_TOTAL}</span>
        <span className={UNIT}>findings classified</span>
      </div>

      <div
        className="mt-4 flex h-3 rounded-full overflow-hidden shrink-0"
        style={{ border: `1px solid ${HAIR}` }}
      >
        {RAG.map(([k, v, tint], i) => (
          <motion.span
            key={k}
            initial={{ width: 0 }}
            animate={{ width: `${(v / RAG_TOTAL) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.08 * i, ease: EASE }}
            style={{ background: tint }}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-2 flex-1 min-h-0 overflow-hidden">
        {RAG.map(([k, v, tint], i) => (
          <motion.span
            key={k}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.08 * i, ease: EASE }}
            className="flex items-center gap-2 shrink-0"
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: tint }}
            />
            <span className="text-[10.5px] text-graphite/65 truncate">{k}</span>
            <span
              className="ml-auto text-[11px] font-mono font-bold tabular-nums shrink-0"
              style={{ color: tint }}
            >
              {v}
            </span>
          </motion.span>
        ))}
      </div>
    </Wrap>
  );
}

/* ── 04 · rectify ────────────────────────────────────────
   Actions with an owner and a state. A defect list is a report; a work list
   with a name against it is a programme. */

const ACTIONS: [string, string, string, State][] = [
  ["Replace upright", "B-17 · 04", "Site team", "crit"],
  ["Straighten brace", "C-02 · 11", "Maintenance", "warn"],
  ["Re-anchor baseplate", "A-09 · 02", "Contractor", "warn"],
  ["Refit load sign", "D-11 · 07", "Site team", "sync"],
  ["Replace beam pair", "B-04 · 09", "OEM order", "sync"],
  ["Verify repair", "A-03 · 05", "PRSES", "ok"],
];

export function PanelRectify() {
  return (
    <Wrap>
      <div className="flex items-baseline justify-between gap-3">
        <Micro>Corrective actions</Micro>
        <span className="text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-signal-orange">
          Assigned
        </span>
      </div>

      <ScrollRows
        items={ACTIONS}
        render={([what, where, who, st]) => (
          <>
            <Badge state={st} />
            <span className="flex-1 min-w-0 flex flex-col gap-0.5">
              <span className="text-[10.5px] font-semibold text-carbon truncate">
                {what}
              </span>
              <span className="text-[9px] font-mono text-graphite/45 truncate">
                {where} · {who}
              </span>
            </span>
          </>
        )}
      />
    </Wrap>
  );
}

/* ── 05 · verify + learn ─────────────────────────────────
   Closure evidenced, and the pattern the closures reveal. The figure is the
   share verified, not a customer result — the pane is headed by its cycle. */

const VERIFIED: [string, string, State][] = [
  ["A-03 · 05", "Reinspected · closed", "ok"],
  ["D-11 · 07", "Photo evidence · closed", "ok"],
  ["C-02 · 11", "Awaiting reinspection", "warn"],
  ["B-17 · 04", "Repair in progress", "crit"],
  ["A-09 · 02", "Verified · cycle 03", "ok"],
];

export function PanelVerify() {
  return (
    <Wrap>
      <Micro>Verified closure · cycle 04</Micro>

      <div className="mt-2 flex items-baseline gap-1.5 shrink-0">
        <span className={FIG}>74</span>
        <span className={UNIT}>% of actions verified</span>
      </div>

      <ScrollRows
        items={VERIFIED}
        speed={2.1}
        render={([where, note, st]) => (
          <>
            <Badge state={st} />
            <span className="flex-1 min-w-0 flex flex-col gap-0.5">
              <span className="text-[10.5px] font-mono font-semibold text-carbon truncate">
                {where}
              </span>
              <span className="text-[9px] text-graphite/45 truncate">
                {note}
              </span>
            </span>
          </>
        )}
      />
    </Wrap>
  );
}
