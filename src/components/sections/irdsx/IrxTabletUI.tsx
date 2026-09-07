"use client";

import { motion } from "framer-motion";

/**
 * IRDS Field — the audit app, drawn. It runs on a **tablet**, not a phone.
 *
 * That is not a cosmetic difference. A rack audit needs the structure and the
 * work visible at the same time — the inspector is standing at a bay, moving
 * down a row, and has to see where they are while they record what they found.
 * So the app is a two-pane layout: the estate tree on the left, the work on
 * the right. A phone can only show one of those at a time, which is why the
 * first version of this file was wrong about more than the device.
 *
 * The left pane is constant across all six screens and only the right pane
 * changes, because that is how the app behaves — you are navigating one
 * application, not flipping through six screenshots.
 *
 * Everything is written down; nothing is generated, so the server and the
 * client draw the same first frame.
 */

const BG = "#08080A";
const PANE = "#0C0C10";
const CARD = "rgba(255,255,255,0.045)";
const HAIR = "rgba(255,255,255,0.08)";
const ORANGE = "#FF6A00";
const GREEN = "#54DE91";
const AMBER = "#E8A33D";
const RED = "#FF6C6C";

export type TabletScreen =
  | "checklist"
  | "element"
  | "scan"
  | "capture"
  | "test"
  | "sync";

/* ── the shell ───────────────────────────────────────────── */

function Header({ synced }: { synced: boolean }) {
  return (
    <div
      className="flex items-center gap-2 px-3.5 h-9 shrink-0"
      style={{ borderBottom: `1px solid ${HAIR}`, background: "#0A0A0D" }}
    >
      <span className="text-[9px] leading-none text-white/35">‹</span>
      <span className="text-[8.5px] font-mono font-bold tracking-[0.12em] uppercase text-white/45">
        Cycle 04 · Kolkata DC
      </span>
      <span className="ml-auto flex items-center gap-1.5">
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: synced ? GREEN : AMBER }}
        />
        <span
          className="text-[7.5px] font-mono font-bold tracking-[0.1em] uppercase"
          style={{ color: synced ? GREEN : AMBER }}
        >
          {synced ? "Synced" : "Offline"}
        </span>
      </span>
    </div>
  );
}

/** The estate tree. Constant on every screen — it is where you are. */
const TREE: [string, number, boolean][] = [
  ["Row A3", 0, false],
  ["Bay B-023", 1, false],
  ["Bay B-024", 1, true],
  ["Level 1", 2, false],
  ["Level 2", 2, true],
  ["U-024-03", 3, true],
  ["Bay B-025", 1, false],
  ["Bay B-026", 1, false],
];

function Tree() {
  return (
    <div
      className="w-[36%] shrink-0 p-2.5 flex flex-col gap-1 overflow-hidden"
      style={{ borderRight: `1px solid ${HAIR}`, background: PANE }}
    >
      <p className="px-1 pb-1 text-[7px] font-mono font-bold tracking-[0.16em] uppercase text-white/25">
        Scope
      </p>
      {TREE.map(([k, depth, on]) => (
        <span
          key={k}
          className="flex items-center gap-1.5 px-1.5 rounded-[5px] shrink-0"
          style={{
            height: 19,
            marginLeft: depth * 7,
            background: on ? "rgba(255,106,0,0.12)" : "transparent",
          }}
        >
          <span
            className="w-1 h-1 rounded-full shrink-0"
            style={{
              background: on ? ORANGE : "rgba(255,255,255,0.18)",
            }}
          />
          <span
            className="text-[7.5px] truncate"
            style={{ color: on ? "#FFFFFF" : "rgba(255,255,255,0.42)" }}
          >
            {k}
          </span>
        </span>
      ))}
    </div>
  );
}

function Pane({
  title,
  sub,
  children,
  action,
  tint = ORANGE,
}: {
  title: string;
  sub: string;
  children: React.ReactNode;
  action: string;
  tint?: string;
}) {
  return (
    <div className="flex-1 min-w-0 flex flex-col p-3">
      <p className="text-[7px] font-mono font-bold tracking-[0.16em] uppercase text-white/25">
        {sub}
      </p>
      <p className="mt-1 text-[11px] font-bold tracking-[-0.02em] text-white">
        {title}
      </p>

      <div className="mt-2.5 flex-1 min-h-0 flex flex-col gap-1.5">
        {children}
      </div>

      <span
        className="mt-2.5 flex items-center justify-center h-7 rounded-md text-[9px] font-bold shrink-0"
        style={{ background: tint, color: "#0A0A0A" }}
      >
        {action}
      </span>
    </div>
  );
}

function Row({
  k,
  v,
  tint,
  i = 0,
}: {
  k: string;
  v?: string;
  tint?: string;
  i?: number;
}) {
  return (
    <motion.span
      className="flex items-center gap-2 px-2 rounded-md shrink-0"
      style={{
        height: 22,
        background: CARD,
        border: `1px solid ${tint ? `${tint}44` : HAIR}`,
      }}
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.05 * i }}
    >
      {tint && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: tint }}
        />
      )}
      <span className="text-[8px] text-white/70 truncate">{k}</span>
      {v && (
        <span
          className="ml-auto text-[7.5px] font-mono font-bold shrink-0"
          style={{ color: tint ?? "rgba(255,255,255,0.4)" }}
        >
          {v}
        </span>
      )}
    </motion.span>
  );
}

/* ── the six right panes ─────────────────────────────────── */

const CHECKS: [string, string, string][] = [
  ["Upright plumb", "Pass", GREEN],
  ["Beam deflection", "Pass", GREEN],
  ["Baseplate + anchors", "Amber", AMBER],
  ["Bracing", "Pass", GREEN],
  ["Load sign", "Pass", GREEN],
  ["Impact damage", "Red", RED],
];

function Checklist() {
  return (
    <Pane
      sub="Bay B-024 · level 2"
      title="Upright U-024-03"
      action="Complete check point"
    >
      {CHECKS.map(([k, v, tint], i) => (
        <Row key={k} k={k} v={v} tint={tint} i={i} />
      ))}
    </Pane>
  );
}

const ELEMENTS: [string, string, string][] = [
  ["Upright U-024-03", "Front, aisle side", ORANGE],
  ["Upright U-024-04", "Rear", GREEN],
  ["Beam pair L2-A", "Level 2", GREEN],
  ["Beam pair L2-B", "Level 2", GREEN],
  ["Brace set 024", "Diagonal + horizontal", AMBER],
  ["Baseplate 024-03", "Anchored", AMBER],
];

function ElementList() {
  return (
    <Pane sub="Bay B-024" title="Elements in this bay" action="Open element">
      {ELEMENTS.map(([k, v, tint], i) => (
        <Row key={k} k={k} v={v} tint={tint} i={i} />
      ))}
    </Pane>
  );
}

function Scan() {
  return (
    <Pane sub="Any rack, any bay" title="Scan asset label" action="Open record">
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <div className="relative h-full aspect-[4/3]">
          {[
            "top-0 left-0 border-t-2 border-l-2 rounded-tl",
            "top-0 right-0 border-t-2 border-r-2 rounded-tr",
            "bottom-0 left-0 border-b-2 border-l-2 rounded-bl",
            "bottom-0 right-0 border-b-2 border-r-2 rounded-br",
          ].map((c) => (
            <span
              key={c}
              className={"absolute w-4 h-4 " + c}
              style={{ borderColor: ORANGE }}
            />
          ))}
          <motion.span
            className="absolute inset-x-2 h-[2px] rounded-full"
            style={{ background: ORANGE, boxShadow: `0 0 10px ${ORANGE}` }}
            animate={{ top: ["14%", "86%", "14%"] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span
              className="px-2 py-0.5 rounded text-[7.5px] font-mono font-bold tracking-[0.1em]"
              style={{
                background: "rgba(0,0,0,0.65)",
                color: "rgba(255,255,255,0.55)",
              }}
            >
              RCK-A3-C07
            </span>
          </span>
        </div>
      </div>
    </Pane>
  );
}

function Capture() {
  return (
    <Pane sub="Upright U-024-03" title="Impact damage" action="Raise issue">
      <div className="grid grid-cols-3 gap-1.5 shrink-0">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="aspect-[4/3] rounded-md flex items-center justify-center"
            style={{ background: CARD, border: `1px solid ${HAIR}` }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.08 * i }}
          >
            <span className="text-[6.5px] font-mono text-white/25">
              PHOTO {i + 1}
            </span>
          </motion.span>
        ))}
      </div>

      <span
        className="px-2 py-1.5 rounded-md shrink-0"
        style={{ background: CARD, border: `1px solid ${HAIR}` }}
      >
        <span className="block text-[7px] font-mono font-bold tracking-[0.12em] uppercase text-white/30">
          Measurement
        </span>
        <span className="mt-0.5 block text-[14px] font-bold tabular-nums leading-none text-white">
          8.4 <span className="text-[8px] font-semibold text-white/40">mm</span>
        </span>
      </span>

      <Row k="Severity" v="Red" tint={RED} i={3} />
      <Row k="Rule applied" v="Out of tolerance" tint={ORANGE} i={4} />
    </Pane>
  );
}

function TestPane() {
  return (
    <Pane
      sub="Upright U-024-03"
      title="G1 · Plumbness"
      action="Submit readings"
    >
      {["4.1", "6.2", "8.4"].map((r, i) => (
        <Row key={r} k={`Reading ${i + 1}`} v={`${r} mm`} i={i} />
      ))}

      <span
        className="mt-auto px-2 py-1.5 rounded-md shrink-0"
        style={{
          background: "rgba(255,108,108,0.10)",
          border: `1px solid ${RED}55`,
        }}
      >
        <span className="flex items-center justify-between">
          <span className="text-[7.5px] font-mono text-white/45">Threshold</span>
          <span className="text-[8px] font-mono font-bold text-white/70">
            6.0 mm
          </span>
        </span>
        <span className="mt-1 flex items-center justify-between">
          <span className="text-[7.5px] font-mono text-white/45">Result</span>
          <span className="text-[8.5px] font-bold" style={{ color: RED }}>
            Outside threshold
          </span>
        </span>
      </span>
    </Pane>
  );
}

const QUEUE: [string, boolean][] = [
  ["Bay B-024 · 3 findings", true],
  ["Bay B-025 · 1 finding", true],
  ["G1 readings · 6 elements", false],
  ["Photos · 11 files", false],
];

function Sync() {
  return (
    <Pane
      sub="No signal in this aisle"
      title="Sync queue"
      action="Keep working"
      tint="#FFFFFF"
    >
      {QUEUE.map(([k, done], i) => (
        <Row
          key={k}
          k={k}
          v={done ? "Sent" : "Queued"}
          tint={done ? GREEN : undefined}
          i={i}
        />
      ))}

      <span className="mt-auto shrink-0">
        <span
          className="block h-1 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <motion.span
            className="block h-full rounded-full"
            style={{ background: GREEN }}
            animate={{ width: ["14%", "56%", "14%"] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
        <span className="mt-1 block text-[7px] font-mono text-white/30">
          Work continues without signal. Sends when there is one.
        </span>
      </span>
    </Pane>
  );
}

const PANES: Record<TabletScreen, () => React.ReactNode> = {
  checklist: Checklist,
  element: ElementList,
  scan: Scan,
  capture: Capture,
  test: TestPane,
  sync: Sync,
};

/**
 * One screen of the audit app, in a tablet body. 4:3 landscape — the shape
 * the two-pane layout needs and the shape the device actually is.
 */
export function TabletUI({ screen }: { screen: TabletScreen }) {
  const Right = PANES[screen];
  return (
    <div
      className="w-full"
      style={{
        borderRadius: 22,
        padding: 12,
        background: "#141418",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 50px 100px -45px rgba(14,14,15,0.55)",
      }}
    >
      <div
        className="w-full flex flex-col overflow-hidden"
        style={{ aspectRatio: "4 / 3", borderRadius: 12, background: BG }}
      >
        <Header synced={screen !== "sync"} />
        <div className="flex-1 min-h-0 flex">
          <Tree />
          <Right />
        </div>
      </div>
    </div>
  );
}
