"use client";

import { motion } from "framer-motion";
import { HAIR, SOFT } from "@/components/sections/twin/TwinPanels";

/**
 * The five right-hand panes for `ImdHow`.
 *
 * Same language as the panel sets on the other four platform pages — white
 * ground, #E8E8ED hairlines, mono caps labels, the RAG state set, one type
 * scale — and the same rule: they share a language, deliberately not a layout.
 * The shape of the pane carries as much of "which step is this" as the copy:
 *
 *   01 Connect     the interfaces coming up, one at a time
 *   02 Diagnose    live parameters against their configured thresholds
 *   03 Prioritise  assets ranked by what the condition costs the operation
 *   04 Maintain    the work order, with its parts and its owner
 *   05 Verify      recurrence after closure — did the repair hold
 *
 * Green, amber and red mean asset condition here, which is why the overview
 * grid's six tints upstream are decorative and unrelated.
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

/* ── 01 · connect ────────────────────────────────────────
   Interfaces coming up. On this product that is the honest first step: what a
   fleet can be told about itself is decided entirely by what it will talk to. */

const FEEDS: [string, string][] = [
  ["MHE CAN / OEM API", "22 assets"],
  ["Battery systems", "34 packs"],
  ["Telematics", "34 assets"],
  ["Impact sensors", "18 units"],
  ["OmniBox Edge", "2 units"],
  ["CMMS", "work orders"],
];

export function PanelConnect({ t }: { t: number }) {
  /* Six beats to bring the interfaces up, three to hold them. */
  const live = Math.min(FEEDS.length, (Math.floor(t / 10) % 9) + 1);

  return (
    <Wrap>
      <div className="flex items-baseline justify-between gap-3">
        <Micro>Equipment interfaces</Micro>
        <span className="text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-signal-orange tabular-nums">
          {live}/{FEEDS.length} validated
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-1.5 flex-1 min-h-0 overflow-hidden">
        {FEEDS.map(([k, v], i) => {
          const on = i < live;
          return (
            <motion.div
              key={k}
              className="flex shrink-0 items-center gap-2.5 px-3 rounded-[10px]"
              style={{
                height: 32,
                background: SOFT,
                border: `1px solid ${on ? "rgba(22,163,74,0.28)" : HAIR}`,
              }}
              initial={false}
              animate={{ opacity: on ? 1 : 0.35, x: on ? 0 : -8 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <Badge state={on ? "ok" : "pend"} />
              <span className="text-[10px] text-graphite/65 truncate">{k}</span>
              <span className="ml-auto text-[9px] font-mono text-graphite/45 shrink-0">
                {on ? v : "—"}
              </span>
            </motion.div>
          );
        })}
      </div>
    </Wrap>
  );
}

/* ── 02 · diagnose ───────────────────────────────────────
   Parameters against their thresholds. A reading with no threshold beside it
   is a number; the pair is a diagnosis. */

const PARAMS: [string, string, string, State][] = [
  ["Battery temperature", "48 °C", "45 °C", "crit"],
  ["Battery SOH", "91%", "80%", "ok"],
  ["Motor temperature", "58 °C", "90 °C", "ok"],
  ["Hydraulic pressure", "168 bar", "175 bar", "warn"],
  ["Operating hours", "4,812 h", "5,000 h", "warn"],
];

export function PanelDiagnose() {
  return (
    <Wrap>
      <Micro>MHE 04 · live parameters</Micro>

      <div className="mt-3 flex flex-col gap-2 flex-1 min-h-0 overflow-hidden">
        {PARAMS.map(([k, v, limit, st], i) => (
          <motion.div
            key={k}
            className="flex flex-col justify-center gap-1 px-3 rounded-[10px] shrink-0"
            style={{
              height: 46,
              background: SOFT,
              border: `1px solid ${st === "crit" ? `${STATE.crit.fg}3D` : HAIR}`,
            }}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, delay: i * 0.07, ease: EASE }}
          >
            <span className="flex items-center gap-2">
              <Badge state={st} />
              <span className="text-[10px] text-graphite/65 truncate">{k}</span>
              <span
                className="ml-auto text-[11px] font-mono font-bold tabular-nums shrink-0"
                style={{ color: STATE[st].fg }}
              >
                {v}
              </span>
            </span>
            <span className="pl-6 text-[8.5px] font-mono text-graphite/40">
              threshold {limit}
            </span>
          </motion.div>
        ))}
      </div>
    </Wrap>
  );
}

/* ── 03 · prioritise ─────────────────────────────────────
   Assets ranked by what the condition costs the operation, not by how loud
   the fault code is. */

const RANK: [string, string, number, State][] = [
  ["MHE 04", "Battery temperature", 92, "crit"],
  ["MHE 12", "Hydraulic pressure", 74, "warn"],
  ["MHE 09", "Service overdue", 61, "warn"],
  ["MHE 17", "Repeat fault", 48, "warn"],
  ["MHE 22", "Within limits", 12, "ok"],
];

export function PanelPrioritise() {
  return (
    <Wrap>
      <Micro>Operational impact · ranked</Micro>

      <div className="mt-3 flex flex-col gap-2.5 flex-1 min-h-0 overflow-hidden">
        {RANK.map(([id, why, pct, st], i) => (
          <div key={id} className="shrink-0">
            <span className="flex items-baseline justify-between gap-3">
              <span className="text-[10px] font-mono font-semibold text-carbon shrink-0">
                {id}
              </span>
              <span className="text-[9.5px] text-graphite/50 truncate ml-2 flex-1">
                {why}
              </span>
              <span
                className="text-[10px] font-mono font-bold tabular-nums shrink-0"
                style={{ color: STATE[st].fg }}
              >
                {pct}
              </span>
            </span>
            <span
              className="mt-1.5 block h-1.5 rounded-full overflow-hidden"
              style={{ background: "#F1F1F4" }}
            >
              <motion.span
                className="block h-full rounded-full"
                style={{ background: STATE[st].fg }}
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
              />
            </span>
          </div>
        ))}
      </div>
    </Wrap>
  );
}

/* ── 04 · maintain ───────────────────────────────────────
   The work order. A diagnosis with no owner, window or part number is an
   observation. */

const WORK: [string, string][] = [
  ["Work order", "WO-2291"],
  ["Asset", "MHE 04 · reach truck"],
  ["Condition", "DTC-B17 · battery temp"],
  ["Assigned", "Workshop · A. Kale"],
  ["Window", "Tonight · 22:00"],
  ["Parts", "Cell pack · 1"],
  ["Restriction", "Reduced duty until repair"],
];

export function PanelMaintain() {
  return (
    <Wrap>
      <Micro>Maintenance action</Micro>

      <div className="mt-3 flex flex-col flex-1 min-h-0 overflow-hidden">
        {WORK.map(([k, v], i) => (
          <motion.span
            key={k}
            initial={{ opacity: 0, x: 8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
            className="flex items-center justify-between gap-3 py-2.5 shrink-0"
            style={{ borderBottom: `1px solid ${HAIR}` }}
          >
            <span className="text-[10.5px] text-graphite/50 truncate">{k}</span>
            <span
              className="text-[10.5px] font-mono font-bold tabular-nums text-right shrink-0"
              style={{
                color: k === "Restriction" ? STATE.crit.fg : "#08080A",
              }}
            >
              {v}
            </span>
          </motion.span>
        ))}
      </div>
    </Wrap>
  );
}

/* ── 05 · verify ─────────────────────────────────────────
   Recurrence after closure. The only honest test of a repair is whether the
   same condition comes back. */

const AFTER: [string, string, State][] = [
  ["MHE 04 · battery temp", "No recurrence · 21 days", "ok"],
  ["MHE 12 · hydraulic", "Recurred · 9 days", "crit"],
  ["MHE 09 · service", "Closed · verified", "ok"],
  ["MHE 17 · fault B04", "Recurred · 14 days", "warn"],
  ["MHE 22 · inspection", "Closed · verified", "ok"],
];

export function PanelVerify() {
  return (
    <Wrap>
      <Micro>After closure · 30 days</Micro>

      <div className="mt-2 flex items-baseline gap-1.5 shrink-0">
        <span className={FIG}>2</span>
        <span className={UNIT}>of 9 repairs recurred</span>
      </div>

      <ScrollRows
        items={AFTER}
        speed={2.1}
        render={([what, note, st]) => (
          <>
            <Badge state={st} />
            <span className="flex-1 min-w-0 flex flex-col gap-0.5">
              <span className="text-[10.5px] font-semibold text-carbon truncate">
                {what}
              </span>
              <span className="text-[9px] font-mono text-graphite/45 truncate">
                {note}
              </span>
            </span>
          </>
        )}
      />
    </Wrap>
  );
}
