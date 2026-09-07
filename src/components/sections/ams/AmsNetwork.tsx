"use client";

import { motion } from "framer-motion";

/**
 * The network board — twenty-four connected sites, on a light ground.
 *
 * This is AIMS's equivalent of `TwinFacility` on the other platform pages: one
 * drawing that the workflow section walks through, gaining meaning at each
 * step rather than being replaced.
 *
 * It is drawn fresh rather than borrowed. `SiteMap` in `sections/aims` is the
 * India map from the Management Intelligence solution page and it is a good
 * drawing, but every colour in it is set for a dark section — land at
 * rgba(255,255,255,0.055), white labels — and the workflow canvas here is a
 * white card. A map that has to be re-toned is a new component with a borrowed
 * name.
 *
 * The board is also the more honest picture for this section. A map answers
 * "where are the sites"; the argument on this page is that twenty-four sites
 * are measured the same way and can therefore be put side by side. A grid of
 * equal tiles says that. A map does not.
 *
 * **The skeleton never changes.** Twenty-four tiles, fixed grid, one value
 * slot each, at every step. What moves is what the slot reads and which tiles
 * are emphasised — so nothing here resizes, and an empty slot shows an em
 * dash rather than collapsing.
 *
 * Indices are one network's readout. They are not a benchmark, and no site
 * named here is a customer.
 */

const HAIR = "#E8E8ED";
const SOFT = "#FAFAFB";
const GREEN = "#16A34A";
const AMBER = "#E08700";
const RED = "#DC2626";

type Site = { id: string; region: string; index: number; owner: string };

/** Twenty-four sites, written down. Six across, four down. */
const SITES: Site[] = [
  { id: "PNE", region: "West", index: 84.2, owner: "RK" },
  { id: "MUM", region: "West", index: 90.1, owner: "RK" },
  { id: "AMD", region: "West", index: 88.6, owner: "RK" },
  { id: "SUR", region: "West", index: 76.4, owner: "RK" },
  { id: "VAD", region: "West", index: 87.3, owner: "AN" },
  { id: "RJK", region: "West", index: 91.5, owner: "AN" },

  { id: "DEL", region: "North", index: 89.4, owner: "AN" },
  { id: "JAI", region: "North", index: 82.7, owner: "AN" },
  { id: "LKO", region: "North", index: 88.9, owner: "SV" },
  { id: "CHD", region: "North", index: 92.2, owner: "SV" },
  { id: "LDH", region: "North", index: 85.8, owner: "SV" },
  { id: "PAT", region: "North", index: 74.9, owner: "SV" },

  { id: "BLR", region: "South", index: 93.1, owner: "MP" },
  { id: "HYD", region: "South", index: 90.7, owner: "MP" },
  { id: "CHN", region: "South", index: 86.5, owner: "MP" },
  { id: "CBE", region: "South", index: 88.2, owner: "MP" },
  { id: "COK", region: "South", index: 83.4, owner: "DT" },
  { id: "TVM", region: "South", index: 89.8, owner: "DT" },

  { id: "KOL", region: "East", index: 81.6, owner: "DT" },
  { id: "BBI", region: "East", index: 78.2, owner: "DT" },
  { id: "VIZ", region: "East", index: 87.9, owner: "HB" },
  { id: "GUW", region: "East", index: 84.7, owner: "HB" },
  { id: "NAG", region: "Central", index: 86.1, owner: "HB" },
  { id: "IND", region: "Central", index: 89.3, owner: "HB" },
];

const tone = (i: number) => (i >= 88 ? GREEN : i >= 80 ? AMBER : RED);

/** The three lowest indices: SUR 76.4, PAT 74.9, BBI 78.2. */
const FOCUS = [3, 11, 19];

/**
 * What each step puts in the tile's one value slot, and which tiles it
 * emphasises. Six entries, one per workflow step.
 */
const VIEW: {
  head: string;
  note: string;
  slot: "link" | "region" | "index" | "owner" | "closed";
  focus: number[];
}[] = [
  { head: "Sources connected", note: "24 / 24 sites", slot: "link", focus: [] },
  { head: "Context attached", note: "site · asset · time", slot: "region", focus: [] },
  { head: "Relationships found", note: "normalised index", slot: "index", focus: [] },
  { head: "Priority ranked", note: "3 below threshold", slot: "index", focus: FOCUS },
  { head: "Response assigned", note: "owner + due date", slot: "owner", focus: FOCUS },
  { head: "Change verified", note: "closure + recurrence", slot: "closed", focus: FOCUS },
];

function slotValue(s: Site, slot: (typeof VIEW)[number]["slot"]) {
  switch (slot) {
    case "link":
      return "linked";
    case "region":
      return s.region;
    case "index":
      return s.index.toFixed(1);
    case "owner":
      return s.owner;
    case "closed":
      return "closed";
  }
}

export function AmsNetwork({ step }: { step: number }) {
  const v = VIEW[Math.max(0, Math.min(VIEW.length - 1, step))];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-baseline justify-between gap-3 shrink-0 pb-3">
        <span className="text-[8.5px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/45">
          {v.head}
        </span>
        <span className="text-[8.5px] font-mono font-bold tracking-[0.14em] uppercase text-graphite/30 tabular-nums">
          {v.note}
        </span>
      </div>

      {/* Six across, four down. Every tile is drawn at every step. */}
      <div className="flex-1 min-h-0 grid grid-cols-6 grid-rows-4 gap-1.5 sm:gap-2">
        {SITES.map((s, i) => {
          const hot = v.focus.includes(i);
          const t = tone(s.index);
          /* Before the index exists there is no condition to colour by, so
             every tile reads neutral rather than pretending to a state. */
          const coloured = v.slot === "index" || v.slot === "owner";
          const dot = coloured ? t : "rgba(20,22,26,0.18)";

          return (
            <motion.div
              key={s.id}
              className="relative flex flex-col justify-between min-w-0 overflow-hidden px-1.5 py-1.5 sm:px-2 sm:py-2"
              initial={false}
              animate={{
                backgroundColor: hot ? "rgba(255,106,0,0.06)" : SOFT,
                borderColor: hot ? "rgba(255,106,0,0.38)" : HAIR,
              }}
              transition={{ duration: 0.45, delay: (i % 6) * 0.02 }}
              style={{ borderRadius: 8, borderWidth: 1, borderStyle: "solid" }}
            >
              <span className="flex items-center justify-between gap-1">
                <span className="text-[9.5px] font-mono font-bold tracking-[0.04em] text-carbon truncate">
                  {s.id}
                </span>
                <motion.span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  initial={false}
                  animate={{ backgroundColor: dot }}
                  transition={{ duration: 0.45 }}
                />
              </span>

              {/* One slot, never empty. */}
              <motion.span
                key={`${s.id}-${v.slot}`}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: (i % 6) * 0.03 }}
                className="text-[8.5px] font-mono tabular-nums truncate"
                style={{ color: coloured ? t : "rgba(20,22,26,0.42)" }}
              >
                {slotValue(s, v.slot)}
              </motion.span>

            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
