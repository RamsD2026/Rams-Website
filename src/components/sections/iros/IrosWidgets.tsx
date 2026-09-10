"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EASE } from "@/components/sections/rackiq/rackiq-shared";

/**
 * The three widget wells the integrations section runs.
 *
 * `RdsIntegrations` puts a 196px animated well at the top of each integration
 * card — a small working diagram rather than an icon — and the card carries a
 * kicker, a title and a row of chips beneath it. These are that, for the three
 * groups the six IROS channels fall into: what captures, what it connects to,
 * and what the platform does with it.
 *
 * Every label is a term the source document uses. The animation is a clock,
 * not data: it steps through the same fixed rows on a tick, the way the rack
 * widgets do, so nothing here should be read as a live feed.
 */

const LINE = "#E8E8ED";
const ORANGE = "#FF6A00";
const TICK_MS = 110;

const ROW_H = 26;
const ROW_GAP = 8;
const mid = (i: number) => i * (ROW_H + ROW_GAP) + ROW_H / 2;
const COL_H = 3 * ROW_H + 2 * ROW_GAP;

export function useTick() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((v) => v + 1), TICK_MS);
    return () => clearInterval(id);
  }, []);
  return t;
}

function WidgetHead({ label, note }: { label: string; note?: string }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2"
      style={{ borderBottom: `1px solid ${LINE}` }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: ORANGE }}
      />
      <span className="text-[8.5px] font-mono font-bold tracking-[0.16em] uppercase text-graphite/50 truncate">
        {label}
      </span>
      {note && (
        <span className="ml-auto text-[8.5px] font-mono text-graphite/35 shrink-0">
          {note}
        </span>
      )}
    </div>
  );
}

function LinkRow({ label, on }: { label: string; on: boolean }) {
  return (
    <div
      className="flex items-center px-2.5 rounded-md transition-colors duration-300"
      style={{
        height: ROW_H,
        background: on ? "rgba(255,106,0,0.06)" : "#FAFAFB",
        border: `1px solid ${on ? "rgba(255,106,0,0.34)" : LINE}`,
      }}
    >
      <span
        className="text-[9px] font-mono font-bold truncate transition-colors duration-300"
        style={{ color: on ? "#D95A00" : "rgba(20,22,26,0.45)" }}
      >
        {label}
      </span>
    </div>
  );
}

/* ── 01 capture ───────────────────────────────────────────────────── */

const READS = ["Barcode · SKU 7712", "RFID · pallet BT-091", "Vision · bay D02"];

/**
 * A read lands, and the position it belongs to lights up.
 *
 * The point of the widget is that a capture event is worth nothing until it
 * resolves to a place, so the read on the left and the cell on the right are
 * always the same colour at the same moment.
 */
export function WCapture({ t }: { t: number }) {
  const at = Math.floor(t / 16) % READS.length;
  const cells = Array.from({ length: 24 }, (_, i) => i);
  const marked = [7, 13, 18][at];

  return (
    <div className="h-full flex flex-col">
      <WidgetHead label="Identity and place" note={`${at + 1}/3`} />

      <div className="flex-1 min-h-0 grid grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] gap-3 px-3 py-2 items-center">
        <div className="flex flex-col" style={{ gap: ROW_GAP }}>
          {READS.map((x, i) => (
            <LinkRow key={x} label={x} on={i === at} />
          ))}
        </div>

        <div className="grid grid-cols-6 gap-1">
          {cells.map((i) => (
            <span
              key={i}
              className="aspect-square rounded-[2px] transition-colors duration-300"
              style={{
                background:
                  i === marked
                    ? ORANGE
                    : i % 3 === 0
                      ? "#DDDDE3"
                      : "#F1F1F4",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 02 systems ───────────────────────────────────────────────────── */

const RECORDS = ["WMS · qty 32", "ERP · batch L-44", "MHE · move 14:42"];
const PLACES = ["Twin · C12", "Twin · D02", "Twin · Q02"];
const PAIRS = [0, 2, 1];

/**
 * The system's record on the left, the physical place on the right, and the
 * line that has to be drawn between them.
 *
 * `pathLength` manages its own dash array — never combine it with a manual
 * `strokeDasharray`, which draws the line in two pieces.
 */
export function WSystems({ t }: { t: number }) {
  const at = Math.floor(t / 16) % PAIRS.length;
  const to = PAIRS[at];
  const d = `M0 ${mid(at)} C 14 ${mid(at)}, 14 ${mid(to)}, 28 ${mid(to)}`;

  return (
    <div className="h-full flex flex-col">
      <WidgetHead label="Record to place" note={`${at + 1}/3`} />

      <div className="flex-1 min-h-0 flex items-center px-3 py-2">
        <div
          className="w-full grid grid-cols-[minmax(0,1fr)_28px_minmax(0,1fr)]"
          style={{ height: COL_H }}
        >
          <div className="flex flex-col" style={{ gap: ROW_GAP }}>
            {RECORDS.map((x, i) => (
              <LinkRow key={x} label={x} on={i === at} />
            ))}
          </div>

          <svg
            viewBox={`0 0 28 ${COL_H}`}
            preserveAspectRatio="none"
            className="w-full h-full"
            aria-hidden
          >
            <motion.path
              key={at}
              d={d}
              fill="none"
              stroke={ORANGE}
              strokeWidth="1.4"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
            />
          </svg>

          <div className="flex flex-col" style={{ gap: ROW_GAP }}>
            {PLACES.map((x, i) => (
              <LinkRow key={x} label={x} on={i === to} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 03 platform ──────────────────────────────────────────────────── */

const HANDOFF: [string, string, string][] = [
  ["Digital Twin", "Physical context", "#12A594"],
  ["ATOS", "Count and correct", "#6647F0"],
  ["AIMS", "Site comparison", "#E93D82"],
];

/** The exception moves along the modules that pick it up. */
export function WModules({ t }: { t: number }) {
  const at = Math.floor(t / 16) % HANDOFF.length;

  return (
    <div className="h-full flex flex-col">
      <WidgetHead label="Cross-module context" note={`${at + 1}/3`} />

      <div className="flex-1 min-h-0 flex flex-col justify-center gap-2 px-3 py-2">
        {HANDOFF.map(([name, what, tint], i) => {
          const on = i === at;
          return (
            <div
              key={name}
              className="flex items-center gap-2.5 px-2.5 rounded-md transition-colors duration-300"
              style={{
                height: ROW_H + 4,
                background: on ? "rgba(255,106,0,0.06)" : "#FAFAFB",
                border: `1px solid ${on ? "rgba(255,106,0,0.34)" : LINE}`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: tint }}
                aria-hidden
              />
              <span
                className="text-[9px] font-mono font-bold shrink-0 transition-colors duration-300"
                style={{ color: on ? "#D95A00" : "rgba(20,22,26,0.55)" }}
              >
                {name}
              </span>
              <span className="ml-auto text-[8.5px] font-mono text-graphite/40 truncate">
                {what}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
