"use client";

import { AnimatePresence, motion } from "framer-motion";

/**
 * The six right-hand panes.
 *
 * They share a language — white ground, #E8E8ED hairlines, mono caps labels,
 * the RAG state set — but deliberately not a layout. Six identical lists of
 * rows told the viewer nothing about which step they were on; the shape of the
 * pane now carries as much of that as the copy does:
 *
 *   01 Digitise   a build progress bar over what has resolved
 *   02 Tag        one asset record, cycling — a record, not a list
 *   03 Simulate   a current / proposed comparison with a verdict
 *   04 Connect    a grid of source tiles, not a column
 *   05 Operate    the continuously scrolling findings feed
 *   06 Learn      a trend line and the recommendation it produced
 *
 * Nothing is generated. Every value is written down, so the server and the
 * client render the same first frame. Figures illustrate the mechanism; they
 * are not measured results.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

export const HAIR = "#E8E8ED";
export const SOFT = "#FAFAFB";

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
      exit={{ opacity: 0, x: -10 }}
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

function Note({ label, state }: { label: string; state: State }) {
  return (
    <span
      className="text-[8.5px] font-mono font-bold tracking-[0.14em] uppercase shrink-0"
      style={{ color: STATE[state].fg }}
    >
      {label}
    </span>
  );
}

/* One scale for all six panes. Each pane has its own layout; none of them has
   its own type sizes or paddings. */
const FIG =
  "text-[30px] font-bold leading-none tracking-[-0.04em] text-carbon tabular-nums";
const UNIT = "text-[12px] font-semibold text-graphite/45";

/** The row every list is built from, whatever the pane. */
function RowCard({
  children,
  dim,
}: {
  children: React.ReactNode;
  dim?: boolean;
}) {
  return (
    <div
      className="flex shrink-0 items-center gap-2.5 rounded-[10px] px-3 py-2 transition-opacity duration-500"
      style={{
        background: SOFT,
        border: `1px solid ${HAIR}`,
        opacity: dim ? 0.32 : 1,
      }}
    >
      {children}
    </div>
  );
}

function Micro({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[8.5px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/40">
      {children}
    </p>
  );
}

/** Every scrolling list uses this gap, so the pitches stay comparable. */
const CARD_GAP = 8;

/* ── the upward scroll ───────────────────────────────────
   The same loop everywhere: a fixed pitch per row, the list rendered twice,
   and a linear translate of exactly one list's worth so there is no seam.
   `pitch` must equal the row height plus the gap — if they drift apart the
   loop shows a join.                                                       */

function ScrollColumn<T>({
  items,
  pitch,
  speed = 1.8,
  render,
}: {
  items: T[];
  pitch: number;
  speed?: number;
  render: (item: T, i: number) => React.ReactNode;
}) {
  return (
    <div className="relative mt-3 flex-1 min-h-0 overflow-hidden">
      <motion.div
        className="flex flex-col"
        initial={{ y: 0 }}
        animate={{ y: [0, -(items.length * pitch)] }}
        transition={{
          duration: items.length * speed,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {[...items, ...items].map((it, i) => (
          <div key={i} className="shrink-0">
            {render(it, i % items.length)}
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

/* ── the scrolling feed ──────────────────────────────────
   Cards moving upward, on a loop with no seam: a fixed card pitch, the list
   rendered twice, and a linear translate of exactly one list's worth. The
   pitch has to stay tied to the card height or the loop shows a join.      */

const CARD_H = 46;
const PITCH = CARD_H + CARD_GAP;

type FeedRow = [string, string, string | undefined, State];

function ScrollFeed({
  rows,
  speed = 1.8,
}: {
  rows: FeedRow[];
  speed?: number;
}) {
  return (
    <div className="relative mt-3 flex-1 min-h-0 overflow-hidden">
      <motion.div
        className="flex flex-col"
        initial={{ y: 0 }}
        animate={{ y: [0, -(rows.length * PITCH)] }}
        transition={{
          duration: rows.length * speed,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {[...rows, ...rows].map(([id, meta, note, st], i) => (
          <div
            key={`${id}-${i}`}
            className="flex items-center gap-2.5 px-3 rounded-[10px]"
            style={{
              height: CARD_H,
              marginBottom: CARD_GAP,
              background: SOFT,
              border: `1px solid ${HAIR}`,
            }}
          >
            <Badge state={st} />
            <span className="flex-1 min-w-0 text-[10.5px] font-mono font-semibold text-carbon tabular-nums truncate">
              {id}
            </span>
            <span className="text-[9.5px] font-mono text-graphite/50 tabular-nums shrink-0 truncate max-w-[92px]">
              {meta}
            </span>
            {note && <Note label={note} state={st} />}
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

/** The three-figure header Operate and Learn share. */
function Stats({ items }: { items: [string, string, string][] }) {
  return (
    <div className="flex items-start gap-5 shrink-0">
      {items.map(([k, v, tint]) => (
        <span key={k}>
          <span className="block text-[8.5px] font-mono font-bold tracking-[0.16em] uppercase text-graphite/40">
            {k}
          </span>
          <span
            className="block mt-1.5 text-[30px] font-bold leading-none tracking-[-0.04em] tabular-nums"
            style={{ color: tint }}
          >
            {v}
          </span>
        </span>
      ))}
    </div>
  );
}

/* ── 01 · digitise — build progress ──────────────────────── */

const BUILT: [string, string, State][] = [
  ["Shell & structure", "820 × 440", "ok"],
  ["Racking", "8 runs · 104 bays", "ok"],
  ["Dock doors", "D1 — D5", "ok"],
  ["Zones", "4 of 4", "ok"],
  ["Aisle D scan", "importing", "sync"],
];

export function PanelDigitise({ t }: { t: number }) {
  const pct = 40 + Math.round(((t % 120) / 120) * 58);

  return (
    <Wrap>
      <Micro>Model completeness</Micro>
      <div className="mt-2 flex items-baseline gap-2">
        <span className={FIG}>{pct}</span>
        <span className={UNIT}>%</span>
      </div>
      <div
        className="mt-3 h-1.5 rounded-full overflow-hidden"
        style={{ background: "#EDEDF1" }}
      >
        <div
          className="h-full rounded-full transition-[width] duration-150"
          style={{ width: `${pct}%`, background: "#FF6A00" }}
        />
      </div>

      <div className="mt-3 flex-1 min-h-0 flex flex-col gap-2 overflow-hidden">
        {BUILT.map(([k, v, st], i) => {
          const on = pct > (i + 1) * 17;
          return (
            <RowCard key={k} dim={!on}>
              <Badge state={on ? st : "pend"} />
              <span className="text-[11px] font-semibold text-carbon truncate">
                {k}
              </span>
              <span className="ml-auto text-[9.5px] font-mono text-graphite/50 shrink-0">
                {v}
              </span>
            </RowCard>
          );
        })}
      </div>
    </Wrap>
  );
}

/* ── 02 · tag — one asset record ─────────────────────────── */

const RECORDS = [
  {
    id: "RCK-B04",
    kind: "Selective pallet rack",
    tint: "#3E63DD",
    fields: [
      ["Zone", "Aisle B"],
      ["Installed", "14 Mar 2022"],
      ["Design load", "2,400 kg"],
      ["Last inspection", "21 Aug 2025"],
      ["Bays", "13"],
      ["Levels", "4"],
    ],
  },
  {
    id: "MHE-04",
    kind: "Reach truck",
    tint: "#0091FF",
    fields: [
      ["Zone", "Aisle A — D"],
      ["Commissioned", "02 Jun 2023"],
      ["Operator", "Shift B"],
      ["Last service", "18 Aug 2025"],
      ["Hours", "4,180"],
      ["Lift height", "9.50 m"],
    ],
  },
  {
    id: "DOCK-03",
    kind: "Inbound dock door",
    tint: "#AB4ABA",
    fields: [
      ["Zone", "West wall"],
      ["Installed", "14 Mar 2022"],
      ["Clear height", "4.20 m"],
      ["Last service", "09 Jul 2025"],
      ["Leveller", "Hydraulic"],
      ["Seal", "Inflatable"],
    ],
  },
];

const FIELD_H = 38;
const FIELD_PITCH = FIELD_H + CARD_GAP;

export function PanelTag({ t }: { t: number }) {
  const r = RECORDS[Math.floor(t / 40) % RECORDS.length];

  return (
    <Wrap>
      <Micro>Asset record</Micro>

      <AnimatePresence mode="wait">
        <motion.div
          key={r.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="mt-2 shrink-0 rounded-[10px] px-3 py-2"
          style={{ background: SOFT, border: `1px solid ${HAIR}` }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="w-1.5 h-8 rounded-full shrink-0"
              style={{ background: r.tint }}
            />
            <span className="min-w-0">
              <span className="block text-[13px] font-mono font-semibold text-carbon truncate">
                {r.id}
              </span>
              <span className="block text-[10.5px] text-graphite/55 truncate">
                {r.kind}
              </span>
            </span>
            <span className="ml-auto">
              <Note label="Tagged" state="ok" />
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      <ScrollColumn
        items={r.fields}
        pitch={FIELD_PITCH}
        speed={2.1}
        render={([k, v]) => (
          <div
            className="flex items-center gap-2.5 rounded-[10px] px-3"
            style={{
              height: FIELD_H,
              marginBottom: CARD_GAP,
              background: SOFT,
              border: `1px solid ${HAIR}`,
            }}
          >
            <span className="text-[10.5px] text-graphite/55 truncate">{k}</span>
            <span className="ml-auto text-[11px] font-semibold text-carbon tabular-nums shrink-0">
              {v}
            </span>
          </div>
        )}
      />
    </Wrap>
  );
}

/* ── 03 · simulate — current vs proposed ─────────────────── */

const COMPARE: [string, string, string, State][] = [
  ["Aisle width", "2.70 m", "3.10 m", "ok"],
  ["Storage bays", "104", "110", "ok"],
  ["Pallet access", "One side", "Both", "ok"],
  ["Egress route", "1.40 m", "1.20 m", "warn"],
  ["Turning radius", "2.90 m", "2.40 m", "ok"],
  ["Sprinkler drop", "Unchanged", "Unchanged", "ok"],
];

const CMP_H = 56;
const CMP_PITCH = CMP_H + CARD_GAP;

export function PanelSimulate() {
  return (
    <Wrap>
      <div className="flex items-center gap-3 shrink-0">
        <Micro>Current</Micro>
        <span aria-hidden className="text-graphite/30 text-[11px]">
          →
        </span>
        <span className="text-[8.5px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
          Proposed
        </span>
      </div>

      <ScrollColumn
        items={COMPARE}
        pitch={CMP_PITCH}
        speed={2}
        render={([k, a, b, st]) => (
          <div
            className="rounded-[10px] px-3 py-2"
            style={{
              height: CMP_H,
              marginBottom: CARD_GAP,
              background: SOFT,
              border: `1px solid ${HAIR}`,
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10.5px] text-graphite/55 truncate">
                {k}
              </span>
              <Note label={st === "ok" ? "Pass" : "Review"} state={st} />
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-[11.5px] font-semibold text-graphite/40 tabular-nums line-through">
                {a}
              </span>
              <span aria-hidden className="text-graphite/30 text-[10px]">
                →
              </span>
              <span
                className="text-[12.5px] font-bold tabular-nums"
                style={{ color: STATE[st].fg }}
              >
                {b}
              </span>
            </div>
          </div>
        )}
      />
    </Wrap>
  );
}

/* ── 04 · connect — source tiles ─────────────────────────── */

const SOURCES: [string, string, string, State][] = [
  ["WMS", "Tasks, stock", "#3E63DD", "ok"],
  ["Cameras", "AI vision", "#6647F0", "ok"],
  ["Sensors", "Impact, tilt", "#12A594", "ok"],
  ["Inspection", "IRDS", "#299764", "ok"],
  ["ERP", "Assets, cost", "#0091FF", "sync"],
  ["BMS", "Power, HVAC", "#F76808", "pend"],
  ["MES", "Production orders", "#AB4ABA", "pend"],
  ["Edge unit", "OmniBox", "#E08700", "ok"],
];

const SRC_H = 58;
const SRC_PITCH = SRC_H + CARD_GAP;

export function PanelConnect() {
  return (
    <Wrap>
      <Micro>Connected sources</Micro>

      <ScrollColumn
        items={SOURCES}
        pitch={SRC_PITCH}
        speed={1.9}
        render={([name, what, tint, st], n) => (
          <div
            className="flex items-center gap-3 rounded-[10px] px-3"
            style={{
              height: SRC_H,
              marginBottom: CARD_GAP,
              background: SOFT,
              border: `1px solid ${HAIR}`,
            }}
          >
            <motion.span
              className="w-2.5 h-2.5 rounded-[3px] shrink-0"
              style={{ background: tint }}
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{
                duration: 1.9,
                repeat: Infinity,
                ease: "easeInOut",
                delay: (n % 6) * 0.2,
              }}
            />
            <span className="min-w-0">
              <span className="block text-[11px] font-semibold text-carbon truncate">
                {name}
              </span>
              <span className="block text-[9.5px] text-graphite/50 truncate">
                {what}
              </span>
            </span>
            <span className="ml-auto shrink-0">
              <Note
                label={st === "ok" ? "Live" : st === "sync" ? "Sync" : "Mapping"}
                state={st}
              />
            </span>
          </div>
        )}
      />
    </Wrap>
  );
}

/* ── 05 · operate — live findings ───────────────────────── */

const FINDINGS: FeedRow[] = [
  ["F-40220", "C-07 · B-C09", undefined, "ok"],
  ["F-40221", "B-06 · U-B24", "Deflection", "warn"],
  ["F-40222", "C-08 · B-C12", undefined, "ok"],
  ["F-40223", "D-02 · U-D04", "Baseplate", "crit"],
  ["F-40224", "B-07 · B-B31", undefined, "ok"],
  ["F-40225", "C-09 · U-C17", "Bracing", "warn"],
  ["F-40218", "B-04 · U-B18", "Beam lock", "crit"],
  ["F-40219", "B-05 · U-B21", "Upright", "warn"],
];

export function PanelOperate() {
  return (
    <Wrap>
      <Stats
        items={[
          ["Open", "14", "#0E0E0F"],
          ["Critical", "2", "#DC2626"],
          ["Health", "91%", "#16A34A"],
        ]}
      />
      <ScrollFeed rows={FINDINGS} />
    </Wrap>
  );
}

/* ── 06 · learn — retained history and patterns ─────────── */

const HISTORY: FeedRow[] = [
  ["Route R2 moved", "Sep 2025", "Decided", "warn"],
  ["C-07 upright", "Feb 2025", "3rd impact", "crit"],
  ["Aisle B widened", "Nov 2023", "Retained", "ok"],
  ["Facility modelled", "Mar 2022", "Baseline", "ok"],
  ["Bracing", "Aisle B", "3 in 30d", "crit"],
  ["Deflection", "Aisle C", "2 in 30d", "warn"],
  ["Beam impact", "Route R2", "Falling", "warn"],
  ["Baseplate", "Aisle D", "Closed", "ok"],
];

export function PanelLearn() {
  return (
    <Wrap>
      <Stats
        items={[
          ["Retained", "37", "#0E0E0F"],
          ["Recurring", "2", "#DC2626"],
          ["Closed", "9", "#16A34A"],
        ]}
      />
      <ScrollFeed rows={HISTORY} speed={1.9} />
    </Wrap>
  );
}
