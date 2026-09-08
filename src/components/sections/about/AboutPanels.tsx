"use client";

/**
 * The six panes pinned by `AboutBuilt`.
 *
 * Same language as the panel sets on the platform pages — white ground,
 * #E8E8ED hairlines, mono caps labels, one type scale — and the same rule:
 * they share a language, deliberately not a layout. The shape of the pane
 * carries as much of "which layer is this" as the copy beside it:
 *
 *   Business systems      an exchange table — system, direction, volume
 *   Process applications  the six workflows as tiles, each with its count
 *   AI + analytics        a field of readings with one cluster resolved
 *   Edge + IoT            devices on the floor line, with their coverage
 *   Digital Twin          one asset's record, key by key
 *   Physical world        the building from above
 *
 * A table, a tile grid, a chart, an elevation, a record and a plan. Six
 * different shapes, and none would make sense against another layer — which
 * is the rule this site's wells are on after six platform pages ended up
 * running the same three widgets.
 *
 * Static. The capabilities section is driven by the reader's scroll, so a pane
 * that also animates on a timer competes with the one thing the section is
 * actually doing. Nothing is generated at render time either, so the server
 * and the client agree on the first frame.
 */

const HAIR = "#E8E8ED";
const SOFT = "#FAFAFB";
const ORANGE = "#FF6A00";
const INK = "rgba(20,22,26,0.55)";
const INK_SOFT = "rgba(20,22,26,0.30)";
const GREEN = "#16A34A";
const AMBER = "#E08700";

function Wrap({
  label,
  note,
  children,
}: {
  label: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden bg-white">
      <div
        className="flex items-center gap-2 px-4 py-3 shrink-0"
        style={{ borderBottom: `1px solid ${HAIR}`, background: SOFT }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: ORANGE }}
        />
        <span className="text-[9px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/45 truncate">
          {label}
        </span>
        {note && (
          <span className="ml-auto text-[9px] font-mono text-graphite/35 shrink-0">
            {note}
          </span>
        )}
      </div>
      <div className="flex-1 min-h-0 p-4">{children}</div>
    </div>
  );
}

/* ── 01 · business systems — the exchange table ──────────
   Three columns, because the honest detail about an enterprise connection is
   not that it exists but which way it runs and how much moves. */

const EXCHANGE: [string, "read" | "both", string][] = [
  ["ERP", "read", "cost, assets"],
  ["WMS", "read", "orders, tasks"],
  ["MES", "read", "production"],
  ["CMMS", "both", "work orders"],
  ["TMS", "read", "dispatch"],
];

export function PaneSystems() {
  return (
    <Wrap label="Connected systems" note="approved scope">
      <div className="flex items-center gap-3 px-2 pb-2">
        <span className="w-[52px] text-[8px] font-mono font-bold tracking-[0.12em] uppercase text-graphite/30">
          System
        </span>
        <span className="w-[64px] text-[8px] font-mono font-bold tracking-[0.12em] uppercase text-graphite/30">
          Direction
        </span>
        <span className="flex-1 text-[8px] font-mono font-bold tracking-[0.12em] uppercase text-graphite/30">
          Carries
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {EXCHANGE.map(([k, dir, what]) => {
          const both = dir === "both";
          return (
            <div
              key={k}
              className="flex items-center gap-3 px-2.5 h-[30px] rounded-md"
              style={{ background: SOFT, border: `1px solid ${HAIR}` }}
            >
              <span className="w-[46px] text-[10px] font-mono font-bold text-carbon">
                {k}
              </span>
              <span
                className="w-[64px] text-[9px] font-mono font-bold"
                style={{ color: both ? GREEN : INK_SOFT }}
              >
                {both ? "⇄ write" : "→ read"}
              </span>
              <span className="flex-1 text-[9.5px] font-mono truncate" style={{ color: INK }}>
                {what}
              </span>
            </div>
          );
        })}
      </div>
    </Wrap>
  );
}

/* ── 02 · process applications — the tiles ───────────────
   Six workflows running alongside each other, so a set rather than a list.
   Each carries its own open count, which is what an application actually
   looks like from the outside. */

const APPS: [string, string, string][] = [
  ["Safety", "02", AMBER],
  ["Productivity", "78%", INK],
  ["Inventory", "12", AMBER],
  ["Maintenance", "08", INK],
  ["Inspection", "03", "#DC2626"],
  ["Execution", "92%", GREEN],
];

export function PaneApps() {
  return (
    <Wrap label="Running workflows" note="6 applications">
      <div className="grid grid-cols-2 grid-rows-3 gap-2 h-full">
        {APPS.map(([k, v, tint]) => (
          <div
            key={k}
            className="flex flex-col justify-center px-3 rounded-md"
            style={{ background: SOFT, border: `1px solid ${HAIR}` }}
          >
            <span className="text-[8.5px] font-mono font-bold tracking-[0.14em] uppercase text-graphite/35">
              {k}
            </span>
            <span
              className="mt-1 text-[15px] font-bold tabular-nums leading-none tracking-[-0.02em]"
              style={{ color: tint }}
            >
              {v}
            </span>
          </div>
        ))}
      </div>
    </Wrap>
  );
}

/* ── 03 · AI + analytics — the field ─────────────────────
   A reading only means something against everything that is not one, so the
   pane is a field with one group resolved out of it. */

const DOTS = Array.from({ length: 84 }, (_, i) => ({
  x: 10 + (i % 21) * 14,
  y: 12 + (((i * 37) % 7) + Math.floor(i / 21) * 2) * 12,
}));

export function PaneAnalytics() {
  const cx = 196;
  const cy = 62;
  return (
    <Wrap label="Pattern recognition" note="30 days">
      <div className="flex flex-col h-full">
        <svg viewBox="0 0 300 128" className="w-full flex-1 min-h-0" aria-hidden>
          {DOTS.map((d, i) => {
            const inside = Math.hypot(d.x - cx, d.y - cy) < 32;
            return (
              <circle
                key={i}
                cx={d.x}
                cy={d.y}
                r={inside ? 2.6 : 1.9}
                fill={inside ? ORANGE : "rgba(20,22,26,0.24)"}
                fillOpacity={inside ? 0.8 : 0.6}
              />
            );
          })}
          <circle
            cx={cx}
            cy={cy}
            r="32"
            fill="none"
            stroke={ORANGE}
            strokeOpacity="0.5"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
        </svg>
        <p
          className="mt-2 px-2.5 py-2 text-[9.5px] leading-[1.5] shrink-0 rounded-md"
          style={{
            color: INK,
            background: "rgba(255,106,0,0.06)",
            border: "1px solid rgba(255,106,0,0.22)",
          }}
        >
          Rack impacts cluster at the 18:00 dispatch window.
        </p>
      </div>
    </Wrap>
  );
}

/* ── 04 · edge + IoT — the elevation ─────────────────────
   The only pane here drawn from the side. What is fixed to the building and
   how far it reaches is a question about height, and a plan cannot answer it. */

const DEVICES: [number, string][] = [
  [58, "LiDAR"],
  [150, "Vision"],
  [242, "Sensor"],
];

export function PaneEdge() {
  return (
    <Wrap label="Fixed sensing" note="coverage">
      <svg viewBox="0 0 300 128" className="w-full h-full" aria-hidden>
        <path d="M8 106 H292" stroke={HAIR} strokeWidth="1.5" />
        {DEVICES.map(([x, label]) => (
          <g key={label}>
            {[20, 33, 46].map((r, n) => (
              <path
                key={r}
                d={`M${x - r} 94 A ${r} ${r} 0 0 1 ${x + r} 94`}
                fill="none"
                stroke={ORANGE}
                strokeOpacity={0.28 - n * 0.075}
                strokeWidth="1.2"
              />
            ))}
            <rect
              x={x - 12}
              y="88"
              width="24"
              height="18"
              rx="4"
              fill="#FFFFFF"
              stroke={HAIR}
            />
            <circle cx={x} cy="97" r="3" fill={ORANGE} fillOpacity="0.65" />
            <text
              x={x}
              y="122"
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fill={INK_SOFT}
            >
              {label}
            </text>
          </g>
        ))}
      </svg>
    </Wrap>
  );
}

/* ── 05 · the Digital Twin — the record ──────────────────
   Key by key, because that is what "persistent" means: the same asset still
   answering the same questions months later. */

const RECORD: [string, string, string][] = [
  ["Asset", "Rack B-14", INK],
  ["Place", "Aisle 07 · Zone B", INK],
  ["Condition", "Amber · 2 findings", AMBER],
  ["History", "14 records · 3 years", INK],
  ["Live", "Impact 2.1 g", "#DC2626"],
];

export function PaneTwin() {
  return (
    <Wrap label="Asset record" note="persistent">
      <div className="flex flex-col h-full">
        {RECORD.map(([k, v, tint]) => (
          <span
            key={k}
            className="flex items-center justify-between gap-3 flex-1 min-h-0"
            style={{ borderBottom: `1px dashed ${HAIR}` }}
          >
            <span className="text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-graphite/35">
              {k}
            </span>
            <span
              className="text-[10.5px] font-mono font-bold text-right truncate"
              style={{ color: tint }}
            >
              {v}
            </span>
          </span>
        ))}
      </div>
    </Wrap>
  );
}

/* ── 06 · physical world — the plan ──────────────────────
   The building itself. Every other pane here is an abstraction of it, so the
   last one is the thing. */

export function PaneFloor() {
  const rows = [28, 52, 76, 100];
  const bays = Array.from({ length: 10 }, (_, i) => 62 + i * 23);
  return (
    <Wrap label="Warehouse 01" note="plan view">
      <svg viewBox="0 0 300 128" className="w-full h-full" aria-hidden>
        <rect
          x="6"
          y="8"
          width="288"
          height="112"
          rx="4"
          fill="none"
          stroke={HAIR}
          strokeWidth="1.5"
        />
        {[24, 52, 80].map((y) => (
          <rect key={y} x="3" y={y} width="6" height="18" rx="1" fill="rgba(20,22,26,0.16)" />
        ))}
        {rows.map((y) =>
          bays.map((x) => (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="19"
              height="8"
              rx="1"
              fill="rgba(20,22,26,0.10)"
            />
          )),
        )}
        <path
          d="M34 18 V112 M34 64 H286"
          stroke={ORANGE}
          strokeOpacity="0.22"
          strokeWidth="1.2"
          strokeDasharray="5 5"
        />
        <circle cx="172" cy="64" r="9" fill={ORANGE} fillOpacity="0.10" />
        <circle cx="172" cy="64" r="3.6" fill={ORANGE} fillOpacity="0.7" />
      </svg>
    </Wrap>
  );
}
