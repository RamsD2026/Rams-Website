"use client";

import { motion } from "framer-motion";
import { HAIR, SOFT } from "@/components/sections/twin/TwinPanels";

/**
 * The five right-hand panes for `RtsHow`.
 *
 * Same language as `TwinPanels`, `MepsPanels`, `RdsPanels` and `AtsPanels` —
 * white ground, #E8E8ED hairlines, mono caps labels, the RAG state set, one
 * type scale — and the same rule: they share a language, deliberately not a
 * layout. The shape of the pane carries as much of "which step is this" as
 * the copy does:
 *
 *   01 Connect        sources coming online, one at a time
 *   02 Detect         the event feed, scrolling
 *   03 Contextualise  one event opened into the record behind it
 *   04 Respond        the alert, acknowledged and owned
 *   05 Learn          hotspots ranked by recurrence
 *
 * Red, Amber and Green mean severity here. That is the brand rule, and on a
 * safety page it is not optional.
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
   Sources coming online. A safety layer is only as good as what is actually
   feeding it, so the pane counts the feeds rather than describing them. */

const SOURCES: [string, string][] = [
  ["Impact sensors", "18 units"],
  ["AI Vision Pro", "6 cameras"],
  ["LiDAR", "4 nodes"],
  ["Operator auth", "34 MHE"],
  ["MHE telematics", "34 MHE"],
  ["OmniBox Edge", "2 units"],
];

export function PanelConnect({ t }: { t: number }) {
  /* Six beats to bring the feeds up, three to hold them. */
  const live = Math.min(SOURCES.length, (Math.floor(t / 10) % 9) + 1);

  return (
    <Wrap>
      <div className="flex items-baseline justify-between gap-3">
        <Micro>Signal sources</Micro>
        <span className="text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-signal-orange tabular-nums">
          {live}/{SOURCES.length} live
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-1.5 flex-1 min-h-0 overflow-hidden">
        {SOURCES.map(([k, v], i) => {
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

/* ── 02 · detect ─────────────────────────────────────────
   The event feed. Detection is a stream, so the pane is one. */

const EVENTS: [string, string, State][] = [
  ["Rack impact · Zone B4", "14:02 · MHE 07", "crit"],
  ["Speed event · Aisle 07", "14:06 · MHE 04", "warn"],
  ["Proximity · Crossing 02", "14:11 · MHE 11", "crit"],
  ["Harsh braking · Dock 05", "14:18 · MHE 02", "warn"],
  ["Zone entry · Restricted", "14:23 · MHE 09", "warn"],
  ["Session start · OP-118", "14:26 · MHE 04", "ok"],
];

export function PanelDetect() {
  return (
    <Wrap>
      <div className="flex items-baseline justify-between gap-3">
        <Micro>Event feed</Micro>
        <span className="text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-signal-orange">
          live
        </span>
      </div>

      <ScrollRows
        items={EVENTS}
        render={([what, when, st]) => (
          <>
            <Badge state={st} />
            <span className="flex-1 min-w-0 flex flex-col gap-0.5">
              <span className="text-[10.5px] font-semibold text-carbon truncate">
                {what}
              </span>
              <span className="text-[9px] font-mono text-graphite/45 truncate">
                {when}
              </span>
            </span>
          </>
        )}
      />
    </Wrap>
  );
}

/* ── 03 · contextualise ──────────────────────────────────
   One event, opened. The pane is a record rather than a list, because the
   whole claim of this step is that a timestamp on its own explains nothing. */

const RECORD: [string, string][] = [
  ["Event", "Rack impact"],
  ["Time", "14:02:11"],
  ["MHE", "MHE 07 · reach truck"],
  ["Operator", "OP-204 · authenticated"],
  ["Location", "Zone B4 · rack B-17"],
  ["Speed at impact", "7.4 km/h"],
  ["Zone limit", "6.0 km/h"],
];

export function PanelContext() {
  return (
    <Wrap>
      <Micro>Event context</Micro>

      <div className="mt-3 flex flex-col flex-1 min-h-0 overflow-hidden">
        {RECORD.map(([k, v], i) => (
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
              style={{ color: k === "Speed at impact" ? "#DC2626" : "#08080A" }}
            >
              {v}
            </span>
          </motion.span>
        ))}
      </div>
    </Wrap>
  );
}

/* ── 04 · respond ────────────────────────────────────────
   The alert reaching someone. An alert with no owner is a notification. */

const RESPONSE: [string, string, State][] = [
  ["Alert raised", "14:02:12", "crit"],
  ["Supervisor notified", "14:02:14", "ok"],
  ["Acknowledged", "14:02:41", "ok"],
  ["Rack isolated", "14:07", "ok"],
  ["Inspection raised", "IRDS · B-17", "sync"],
  ["Investigation owner", "Safety lead", "warn"],
];

export function PanelRespond() {
  return (
    <Wrap>
      <Micro>Alert · rack impact B4</Micro>

      <div className="mt-2 flex items-baseline gap-1.5 shrink-0">
        <span className={FIG}>29</span>
        <span className={UNIT}>s to acknowledgement</span>
      </div>

      <ScrollRows
        items={RESPONSE}
        speed={2}
        render={([what, when, st]) => (
          <>
            <Badge state={st} />
            <span className="flex-1 min-w-0 flex items-baseline justify-between gap-3">
              <span className="text-[10.5px] text-carbon truncate">{what}</span>
              <span className="text-[9px] font-mono text-graphite/45 shrink-0">
                {when}
              </span>
            </span>
          </>
        )}
      />
    </Wrap>
  );
}

/* ── 05 · learn ──────────────────────────────────────────
   Hotspots ranked by recurrence. One event is an incident; the same event in
   the same place four times is a condition nobody has fixed. */

const HOTSPOTS: [string, number, State][] = [
  ["Outbound turning zone", 9, "crit"],
  ["Crossing 02", 6, "warn"],
  ["Dock 05 approach", 4, "warn"],
  ["Aisle 07 entry", 3, "ok"],
  ["Charging bay", 2, "ok"],
];
const HOT_MAX = 9;

export function PanelLearn() {
  return (
    <Wrap>
      <Micro>Recurrence · last 7 shifts</Micro>

      <div className="mt-2 flex items-baseline gap-1.5 shrink-0">
        <span className={FIG}>24</span>
        <span className={UNIT}>repeat events</span>
      </div>

      <div className="mt-4 flex flex-col gap-2.5 flex-1 min-h-0 overflow-hidden">
        {HOTSPOTS.map(([k, n, st], i) => (
          <div key={k} className="shrink-0">
            <span className="flex items-baseline justify-between gap-3">
              <span className="text-[10px] text-graphite/65 truncate">{k}</span>
              <span
                className="text-[10px] font-mono font-bold tabular-nums shrink-0"
                style={{ color: STATE[st].fg }}
              >
                {n}
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
                whileInView={{ width: `${(n / HOT_MAX) * 100}%` }}
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
