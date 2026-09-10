"use client";

import { motion } from "framer-motion";

/**
 * The live panes.
 *
 * They serve two sections, the way `MepsPanels` serves `MepsHow` and
 * `MepsCapabilities`: the right half of the How canvas, and the pinned screen
 * in Core capabilities. Both are light — the canvas is a white card and the
 * Stage holds a white device screen — so these are light panes, not dark ones.
 *
 * `RdsCapabilities` pins a real screenshot per capability, because IRDS is the
 * one platform on this site with genuine captures in `SHOTS`. There is no IROS
 * capture, and `MepsCapabilities` already ruled on that case: "Putting a rack
 * dashboard behind 'Route & travel analytics' would be a lie told with a
 * picture, so each group pins a live pane instead — drawn from data rather
 * than borrowed from another product."
 *
 * Every value here is the source document's own — 12,480 mapped records, 147
 * exceptions, 4.6% aged, 72.4% occupied, 48,920 positions, the C12 → D02
 * mismatch, the +2 quantity variance, the 126 days in Zone Q02. Nothing is a
 * figure the document did not state.
 *
 * They are diagrams and not screenshots: no window chrome, no cursor, no
 * invented menu. A reader should be able to tell this is an illustration of
 * the data model, which is what it is.
 */

const HAIR = "#E8E8ED";
const SOFT = "#FAFAFB";
const ORANGE = "#FF6A00";

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] font-mono font-bold tracking-[0.2em] uppercase text-graphite/40 mb-4">
      {children}
    </p>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "orange" | "muted";
}) {
  return (
    <div
      className="flex items-baseline justify-between gap-4 py-2"
      style={{ borderBottom: `1px solid ${HAIR}` }}
    >
      <span className="text-[11px] text-graphite/55 leading-[1.4]">{label}</span>
      <span
        className={
          "text-[11.5px] font-mono font-bold tabular-nums shrink-0 " +
          (tone === "orange"
            ? "text-signal-orange"
            : tone === "muted"
              ? "text-graphite/45"
              : "text-carbon")
        }
      >
        {value}
      </span>
    </div>
  );
}

/** Every pane sits in the same padded, scroll-free box. */
function Pane({ children }: { children: React.ReactNode }) {
  return <div className="h-full w-full p-5 sm:p-6 overflow-hidden">{children}</div>;
}

/* ── 01 location visibility ───────────────────────────────────────── */

export function PaneLocations() {
  const cells = Array.from({ length: 32 }, (_, i) => i);
  const filled = new Set([1, 3, 4, 6, 9, 10, 12, 15, 17, 20, 23, 25, 26, 29]);
  const marked = 18;

  return (
    <Pane>
      <Kicker>Site / zone / rack / bay / level</Kicker>

      <div className="grid grid-cols-8 gap-1.5">
        {cells.map((i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: (i % 8) * 0.02 }}
            className="aspect-square rounded-[3px]"
            style={{
              background:
                i === marked ? ORANGE : filled.has(i) ? "#DDDDE3" : "#F1F1F4",
              boxShadow:
                i === marked ? "0 0 0 3px rgba(255,106,0,0.16)" : undefined,
            }}
          />
        ))}
      </div>

      <div className="mt-5">
        <Row label="Mapped stock records" value="12,480" />
        <Row label="Selected position" value="D02 · L3" tone="orange" />
      </div>
    </Pane>
  );
}

/* ── 02 pallet and stock mapping ──────────────────────────────────── */

export function PaneRecord() {
  return (
    <Pane>
      <Kicker>Stock record</Kicker>
      <Row label="SKU" value="7712" />
      <Row label="Quantity" value="32" />
      <Row label="Pallet" value="BT-091" />
      <Row label="Location" value="C12" tone="orange" />
      <Row label="Status" value="Available" tone="muted" />
    </Pane>
  );
}

/* ── 03 movement history ──────────────────────────────────────────── */

export function PaneMovement() {
  const stops: [string, string][] = [
    ["Receipt", "C12"],
    ["Putaway", "C12"],
    ["Transfer", "D02"],
  ];
  return (
    <Pane>
      <Kicker>Supported movement</Kicker>

      <div className="relative pl-5">
        <span
          aria-hidden
          className="absolute left-[3px] top-3 bottom-3 w-px"
          style={{ background: HAIR }}
        />
        {stops.map(([what, where], i) => (
          <div key={what} className="relative py-2.5">
            <span
              aria-hidden
              className="absolute -left-5 top-[13px] w-[7px] h-[7px] rounded-full"
              style={{
                background: i === stops.length - 1 ? ORANGE : "#D5D5DC",
              }}
            />
            <p className="text-[12px] font-semibold text-carbon leading-none">
              {what}
            </p>
            <p className="mt-1.5 text-[11px] text-graphite/50">
              Location {where}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3">
        <Row label="Last event" value="14:42" tone="orange" />
      </div>
    </Pane>
  );
}

/* ── 04 reconciliation ────────────────────────────────────────────── */

export function PaneReconcile() {
  const boxes: [string, string, string, string][] = [
    ["WMS / ERP", "C12", SOFT, "#0E0E0F"],
    ["Digital Twin", "D02", "rgba(255,106,0,0.07)", ORANGE],
  ];
  return (
    <Pane>
      <Kicker>Record against reality</Kicker>

      <div className="grid grid-cols-2 gap-2.5">
        {boxes.map(([label, value, bg, ink]) => (
          <div
            key={label}
            className="p-3.5"
            style={{ borderRadius: 10, background: bg, border: `1px solid ${HAIR}` }}
          >
            <p className="text-[9px] font-mono font-bold tracking-[0.16em] uppercase text-graphite/40">
              {label}
            </p>
            <p
              className="mt-2.5 text-[24px] font-bold tabular-nums leading-none"
              style={{ color: ink }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-signal-orange">
        Location exception
      </p>
      <p className="mt-2 text-[11.5px] leading-[1.6] text-graphite/60">
        Correct stock, different place. Routed for recount and movement review.
      </p>
    </Pane>
  );
}

/* ── 05 ageing and dwell ──────────────────────────────────────────── */

export function PaneAgeing() {
  const buckets: [string, number][] = [
    ["0–30", 62],
    ["31–60", 24],
    ["61–90", 9],
    ["90+", 4.6],
  ];
  return (
    <Pane>
      <Kicker>Dwell by configured bucket</Kicker>

      <div className="flex flex-col gap-3">
        {buckets.map(([label, pct], i) => (
          <div key={label}>
            <div className="flex items-baseline justify-between gap-4 mb-1.5">
              <span className="text-[11px] text-graphite/55">{label} days</span>
              <span className="text-[11px] font-mono font-bold tabular-nums text-carbon">
                {pct}%
              </span>
            </div>
            <span
              className="block h-[5px] rounded-full overflow-hidden"
              style={{ background: "#F1F1F4" }}
            >
              <motion.span
                className="block h-full rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  background: i === buckets.length - 1 ? ORANGE : "#C8C8D0",
                }}
              />
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <Row label="Aged stock" value="4.6%" tone="orange" />
      </div>
    </Pane>
  );
}

/* ── 06 exception detection ───────────────────────────────────────── */

export function PaneExceptions() {
  const rows: [string, string, boolean][] = [
    ["Location", "System C12 · physical D02", true],
    ["Quantity", "+2 — recount and review", true],
    ["Aged", "126 days in Zone Q02", true],
    ["Match", "Identity, quantity and place agree", false],
  ];
  return (
    <Pane>
      <Kicker>Open exceptions · 147</Kicker>

      <div className="flex flex-col">
        {rows.map(([kind, detail, open]) => (
          <div
            key={kind}
            className="flex items-start gap-3 py-2.5"
            style={{ borderBottom: `1px solid ${HAIR}` }}
          >
            <span
              className="mt-[5px] w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: open ? ORANGE : "#16A34A" }}
              aria-hidden
            />
            <span className="min-w-0">
              <span className="block text-[9px] font-mono font-bold tracking-[0.16em] uppercase text-graphite/40">
                {kind}
              </span>
              <span className="mt-1 block text-[11.5px] text-graphite/65 leading-[1.5]">
                {detail}
              </span>
            </span>
          </div>
        ))}
      </div>
    </Pane>
  );
}

/* ── 07 space and capacity ────────────────────────────────────────── */

export function PaneCapacity() {
  const split: [string, number, string][] = [
    ["Occupied", 72.4, ORANGE],
    ["Available", 21.0, "#C8C8D0"],
    ["Blocked", 6.6, "#E6E6EB"],
  ];
  return (
    <Pane>
      <Kicker>Position use</Kicker>

      <span className="flex h-[10px] rounded-full overflow-hidden">
        {split.map(([label, pct, bg]) => (
          <motion.span
            key={label}
            className="block h-full"
            initial={{ width: 0 }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: bg }}
          />
        ))}
      </span>

      <div className="mt-5">
        {split.map(([label, pct]) => (
          <Row
            key={label}
            label={label}
            value={`${pct}%`}
            tone={label === "Occupied" ? "orange" : "muted"}
          />
        ))}
        <Row label="Positions mapped" value="48,920" />
      </div>
    </Pane>
  );
}

/* ── 08 flexible capture ──────────────────────────────────────────── */

export function PaneCapture() {
  const methods = [
    "Manual",
    "Barcode",
    "QR",
    "RFID",
    "Vision",
    "Drone",
    "AGV",
    "System event",
  ];
  return (
    <Pane>
      <Kicker>Approved capture methods</Kicker>

      <div className="flex flex-wrap gap-1.5">
        {methods.map((m, i) => (
          <motion.span
            key={m}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
            className="text-[10px] font-mono font-semibold tracking-[0.1em] uppercase px-2 py-1.5"
            style={{
              borderRadius: 7,
              background: i < 3 ? "rgba(255,106,0,0.08)" : SOFT,
              color: i < 3 ? "#D95A00" : "rgba(90,90,100,0.75)",
              border: `1px solid ${i < 3 ? "rgba(255,106,0,0.20)" : HAIR}`,
            }}
          >
            {m}
          </motion.span>
        ))}
      </div>

      <p className="mt-5 text-[11.5px] leading-[1.6] text-graphite/60">
        Only the methods validated for the agreed scope are enabled. Coverage,
        confidence and duplicate-read controls are confirmed per method.
      </p>
    </Pane>
  );
}
