"use client";

import { motion } from "framer-motion";
import { HAIR, SOFT } from "@/components/sections/twin/TwinPanels";

/**
 * The five right-hand panes for `MepsHow`.
 *
 * Same language as `TwinPanels` — white ground, #E8E8ED hairlines, mono caps
 * labels, the RAG state set, one type scale — and the same rule: they share a
 * language, deliberately not a layout. Five identical lists of rows would tell
 * the viewer nothing about which step they were on, so the shape of the pane
 * carries as much of that as the copy does:
 *
 *   01 Connect    a register filling in, machine by machine
 *   02 Map        a grid of zones, not a column
 *   03 Classify   one shift split into its activity states
 *   04 Measure    assets compared on one bar, ranked
 *   05 Improve    the opportunities that fall out, scrolling
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

/* ── shared atoms ────────────────────────────────────────── */

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

/* One scale for all five panes, the same one the Digital Twin's use. */
const FIG =
  "text-[30px] font-bold leading-none tracking-[-0.04em] text-carbon tabular-nums";
const UNIT = "text-[12px] font-semibold text-graphite/45";

const CARD_GAP = 8;
const CARD_H = 44;
const PITCH = CARD_H + CARD_GAP;

/* ── the upward scroll ───────────────────────────────────
   The loop every pane on the site uses: a fixed pitch per row, the list
   rendered twice, and a linear translate of exactly one list's worth so there
   is no seam. `PITCH` has to stay tied to `CARD_H` or the loop shows a join. */
function ScrollRows<T>({
  items,
  speed = 1.8,
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

/* ── 01 · connect the fleet ──────────────────────────────
   A register filling in. The tick walks the list, so machines come online one
   after another rather than all at once — that is what connecting a fleet
   actually looks like. */

const FLEET: [string, string][] = [
  ["MHE-01", "Reach truck"],
  ["MHE-02", "Counterbalance"],
  ["MHE-04", "Reach truck"],
  ["MHE-07", "PPT"],
  ["MHE-09", "VNA"],
  ["MHE-11", "Counterbalance"],
  ["MHE-14", "PPT"],
  ["MHE-18", "Reach truck"],
];

export function PanelConnect({ t }: { t: number }) {
  /* Eight beats to link the fleet, three to hold it linked. Without the
     modulo the register fills once and never runs again. */
  const online = Math.min(FLEET.length, (Math.floor(t / 9) % 11) + 1);
  return (
    <Wrap>
      <div className="flex items-baseline justify-between gap-3">
        <Micro>Fleet register</Micro>
        <span className="text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-signal-orange tabular-nums">
          {online}/{FLEET.length} linked
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-2 flex-1 min-h-0 overflow-hidden">
        {FLEET.map(([id, kind], i) => {
          const on = i < online;
          return (
            <div
              key={id}
              className="flex shrink-0 items-center gap-2.5 px-3 rounded-[10px] transition-opacity duration-500"
              style={{
                height: 38,
                background: SOFT,
                border: `1px solid ${on ? "rgba(22,163,74,0.28)" : HAIR}`,
                opacity: on ? 1 : 0.4,
              }}
            >
              <Badge state={on ? "ok" : "pend"} />
              <span className="text-[10.5px] font-mono font-semibold text-carbon tabular-nums">
                {id}
              </span>
              <span className="ml-auto text-[9.5px] font-mono text-graphite/45 truncate">
                {on ? kind : "waiting"}
              </span>
            </div>
          );
        })}
      </div>
    </Wrap>
  );
}

/* ── 02 · map the operation ──────────────────────────────
   A grid, not a column. Zones are places in a building; a list of them reads
   as inventory, a grid reads as a floor. */

const ZONES: [string, string, string][] = [
  ["Aisles", "24", "#3E63DD"],
  ["Docks", "5", "#16A34A"],
  ["Charging", "6", "#E08700"],
  ["Staging", "4", "#6647F0"],
  ["Work zones", "9", "#E93D82"],
  ["Restricted", "2", "#DC2626"],
];

export function PanelMap() {
  return (
    <Wrap>
      <div className="flex items-baseline justify-between gap-3">
        <Micro>Mapped zones</Micro>
        <span className="text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-signal-orange">
          In the twin
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 flex-1 min-h-0">
        {ZONES.map(([k, n, tint], i) => (
          <motion.div
            key={k}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 * i, ease: EASE }}
            className="flex flex-col justify-center px-3 rounded-[10px] min-h-0"
            style={{ background: SOFT, border: `1px solid ${HAIR}` }}
          >
            <span className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: tint }}
              />
              <span className="text-[8.5px] font-mono font-bold tracking-[0.14em] uppercase text-graphite/45 truncate">
                {k}
              </span>
            </span>
            <span className="mt-1 text-[19px] font-bold leading-none tracking-[-0.03em] text-carbon tabular-nums">
              {n}
            </span>
          </motion.div>
        ))}
      </div>
    </Wrap>
  );
}

/* ── 03 · classify activity ──────────────────────────────
   One shift, split. A stacked bar says "this is one whole thing divided up",
   which a list of six percentages does not. */

const ACTIVITY: [string, number, string][] = [
  ["Productive work", 38, "#16A34A"],
  ["Travel", 24, "#3E63DD"],
  ["Waiting", 14, "#E08700"],
  ["Idle", 12, "#A8A8B0"],
  ["Charging", 8, "#6647F0"],
  ["Offline", 4, "#D4D4DA"],
];

export function PanelClassify() {
  return (
    <Wrap>
      <div className="flex items-baseline justify-between gap-3">
        <Micro>Shift 2 · classified</Micro>
        <span className="text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-signal-orange">
          8h 00m
        </span>
      </div>

      {/* the whole shift, as one bar */}
      <div
        className="mt-3 flex h-3 rounded-full overflow-hidden shrink-0"
        style={{ border: `1px solid ${HAIR}` }}
      >
        {ACTIVITY.map(([k, pct, tint], i) => (
          <motion.span
            key={k}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.7, delay: 0.06 * i, ease: EASE }}
            style={{ background: tint }}
          />
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-1.5 flex-1 min-h-0 overflow-hidden">
        {ACTIVITY.map(([k, pct, tint], i) => (
          <motion.span
            key={k}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.06 * i, ease: EASE }}
            className="flex items-center gap-2 shrink-0"
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: tint }}
            />
            <span className="text-[10.5px] text-graphite/65 truncate">{k}</span>
            <span className="ml-auto text-[11px] font-mono font-bold text-carbon tabular-nums shrink-0">
              {pct}%
            </span>
          </motion.span>
        ))}
      </div>
    </Wrap>
  );
}

/* ── 04 · measure performance ────────────────────────────
   Assets on one bar, ranked. The figure at the top is what the comparison is
   of; the bars underneath are who is where against it. */

const RANK: [string, number, State][] = [
  ["MHE-04", 84, "ok"],
  ["MHE-11", 71, "ok"],
  ["MHE-02", 58, "warn"],
  ["MHE-09", 46, "warn"],
  ["MHE-18", 31, "crit"],
];

export function PanelMeasure() {
  return (
    <Wrap>
      <Micro>Loaded travel · by asset</Micro>

      <div className="mt-2 flex items-baseline gap-1.5 shrink-0">
        <span className={FIG}>61</span>
        <span className={UNIT}>% fleet average</span>
      </div>

      <div className="mt-4 flex flex-col gap-2.5 flex-1 min-h-0 overflow-hidden">
        {RANK.map(([id, pct, st], i) => (
          <div key={id} className="shrink-0">
            <span className="flex items-baseline justify-between gap-3">
              <span className="text-[10px] font-mono font-semibold text-carbon tabular-nums">
                {id}
              </span>
              <span
                className="text-[10px] font-mono font-bold tabular-nums"
                style={{ color: STATE[st].fg }}
              >
                {pct}%
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
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, delay: 0.07 * i, ease: EASE }}
              />
            </span>
          </div>
        ))}
      </div>
    </Wrap>
  );
}

/* ── 05 · improve the system ─────────────────────────────
   What falls out of the four steps before it. A scrolling feed, because the
   list of opportunities is never finished. */

const OPPORTUNITIES: [string, string, State][] = [
  ["Reroute Aisle 07 outbound", "−0.4 km / shift", "ok"],
  ["Move charger to Dock 3", "−12 min queue", "ok"],
  ["Re-slot fast movers, Zone B", "−18% empty travel", "ok"],
  ["Rebalance MHE-18 tasks", "+9 tasks / shift", "warn"],
  ["Stagger 18:00 dispatch", "−3 congested runs", "warn"],
  ["Retire one PPT at renewal", "fleet-sizing", "sync"],
];

export function PanelImprove() {
  return (
    <Wrap>
      <div className="flex items-baseline justify-between gap-3">
        <Micro>Opportunities</Micro>
        <span className="text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-signal-orange">
          Ranked
        </span>
      </div>

      <ScrollRows
        items={OPPORTUNITIES}
        speed={2.1}
        render={([label, gain, st]) => (
          <>
            <Badge state={st} />
            <span className="flex-1 min-w-0 flex flex-col gap-0.5">
              <span className="text-[10.5px] font-semibold text-carbon truncate">
                {label}
              </span>
              <span className="text-[9px] font-mono text-graphite/45 truncate">
                {gain}
              </span>
            </span>
          </>
        )}
      />
    </Wrap>
  );
}

/* ── routes · distance and where it went ─────────────────
   A route list with its distance as the bar. Movement is the one capability
   whose subject is a length, so the pane measures lengths. */

const ROUTES: [string, number, string][] = [
  ["Dock 3 → Aisle 07", 92, "1.42 km"],
  ["Aisle 07 → Staging", 74, "1.14 km"],
  ["Staging → Dock 1", 58, "0.89 km"],
  ["Aisle 12 → Charging", 41, "0.63 km"],
  ["Return, empty", 68, "1.05 km"],
];

export function PanelRoutes() {
  return (
    <Wrap>
      <Micro>Travel · by route</Micro>

      <div className="mt-2 flex items-baseline gap-1.5 shrink-0">
        <span className={FIG}>39</span>
        <span className={UNIT}>% travelled empty</span>
      </div>

      <div className="mt-4 flex flex-col gap-2.5 flex-1 min-h-0 overflow-hidden">
        {ROUTES.map(([label, pct, km], i) => {
          const empty = label === "Return, empty";
          return (
            <div key={label} className="shrink-0">
              <span className="flex items-baseline justify-between gap-3">
                <span className="text-[10.5px] text-graphite/65 truncate">
                  {label}
                </span>
                <span className="text-[10px] font-mono font-bold text-carbon tabular-nums shrink-0">
                  {km}
                </span>
              </span>
              <span
                className="mt-1.5 block h-1.5 rounded-full overflow-hidden"
                style={{ background: "#F1F1F4" }}
              >
                <motion.span
                  className="block h-full rounded-full"
                  style={{ background: empty ? "#E08700" : "#3E63DD" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: 0.07 * i, ease: EASE }}
                />
              </span>
            </div>
          );
        })}
      </div>
    </Wrap>
  );
}
