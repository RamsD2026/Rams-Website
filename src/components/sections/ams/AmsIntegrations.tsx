"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 08 — Integrations.
 *
 * `TwinIntegrations` → `AimsDirection`: cards carrying a 196px well with a
 * live widget in it, then a kicker, a title and the chip list. `CARD`, `WELL`,
 * `WidgetHead` and the 110ms tick are copied rather than re-derived, so the
 * platform pages read as one system.
 *
 * One interval drives all three widgets — independent timers drift apart
 * within a minute and the row stops reading as one thing.
 *
 * The three widgets are AIMS's own, not the set the other pages run. Putting
 * the same feed / matcher / stack on a seventh page is how these bentos ended
 * up being one section printed several times, and the fix is the same one
 * applied on RTSS and IMDS: each well shows the thing only this card can say.
 *
 *   · "Connect operational modules"  the coverage matrix filling in — which
 *                                    module is live at which site
 *   · "See where it is happening"    the fix tightening onto a rack as each
 *                                    sensing layer reports
 *   · "Connect business context"     which way data moves with each system,
 *                                    with the packet travelling that way
 *
 * The rail underneath is a real sequence — the physical world produces
 * signals, the edge carries them, the Twin places them, the modules interpret
 * them, and AIMS decides on them — so it earns its order. AIMS is the marked
 * node, and it is last, because that is where it sits.
 */

const LINE = "#E8E8ED";
const ORANGE = "#FF6A00";
const GREEN = "#16A34A";
const TICK_MS = 110;

const CARD: React.CSSProperties = {
  borderRadius: 12,
  border: `1px solid ${LINE}`,
  background: "#FFFFFF",
};

const WELL: React.CSSProperties = {
  borderRadius: 10,
  border: `1px solid ${LINE}`,
  background: "linear-gradient(180deg, #FAFAFB 0%, #FFFFFF 100%)",
};

function useTick() {
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

function Chips({ items }: { items: string[] }) {
  return (
    <div className="mt-5 flex flex-wrap gap-1.5">
      {items.map((c) => (
        <span
          key={c}
          className="px-2.5 py-1 rounded-full text-[10.5px] text-graphite/60"
          style={{ background: "#FAFAFB", border: `1px solid ${LINE}` }}
        >
          {c}
        </span>
      ))}
    </div>
  );
}

/* ── 01 · RAMS applications — the coverage matrix ────────
   The card says "connect operational modules", so the widget shows the
   connection being made: six products down the side, sites across the top,
   and each cell resolving as that module at that site comes in.

   A matrix is the only shape that can say the true thing here — not every
   site runs every module, and AIMS starts with the ones that are there. The
   page's own FAQ says exactly that. A list of module names could not.

   The sweep walks a modulo cycle with idle beats at the end. A saturating
   counter freezes the well a few seconds in and leaves it frozen. */

const SITE_COLS = ["PNE", "MUM", "DEL", "BLR"];
/** Which module is live at which site. Written down, and deliberately not full. */
const COVERAGE: [string, boolean[]][] = [
  ["IRDS", [true, true, true, true]],
  ["MEPS", [true, true, false, true]],
  ["RTSS", [true, false, true, true]],
  ["IROS", [true, true, true, false]],
  ["IMDS", [true, true, true, true]],
  ["ATOS", [true, true, false, true]],
];

const CELLS = COVERAGE.length * SITE_COLS.length;
/** How many of those cells are actually live: 20 of 24. */
const LIVE = COVERAGE.reduce((n, [, row]) => n + row.filter(Boolean).length, 0);

/** Live cells resolved so far, for the head count. */
const liveBy = (up: number) =>
  COVERAGE.reduce(
    (n, [, row], i) =>
      n + row.filter((on, j) => on && i * SITE_COLS.length + j < up).length,
    0,
  );

function WCoverage({ t }: { t: number }) {
  /* Row-major sweep, then eight beats holding the finished matrix. */
  const up = Math.floor(t / 3) % (CELLS + 8);
  return (
    <div className="h-full flex flex-col">
      <WidgetHead label="Module coverage" note={`${liveBy(up)}/${LIVE} live`} />

      <div className="flex-1 min-h-0 flex flex-col justify-center px-3 py-2">
        {/* column heads */}
        <div className="flex items-center gap-1 shrink-0 pb-1">
          <span className="w-[38px] shrink-0" />
          {SITE_COLS.map((c) => (
            <span
              key={c}
              className="flex-1 text-center text-[7.5px] font-mono font-bold tracking-[0.1em] uppercase text-graphite/30"
            >
              {c}
            </span>
          ))}
        </div>

        {COVERAGE.map(([mod, row], i) => (
          <div key={mod} className="flex items-center gap-1 shrink-0 mb-[3px]">
            <span className="w-[38px] shrink-0 text-[8.5px] font-mono font-bold text-carbon">
              {mod}
            </span>
            {row.map((on, j) => {
              const n = i * SITE_COLS.length + j;
              const shown = n < up;
              return (
                <motion.span
                  key={j}
                  className="flex-1 flex items-center justify-center"
                  style={{
                    height: 19,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderStyle: shown && !on ? "dashed" : "solid",
                  }}
                  initial={false}
                  animate={{
                    backgroundColor: !shown
                      ? "rgba(20,22,26,0.02)"
                      : on
                        ? "rgba(255,106,0,0.09)"
                        : "transparent",
                    borderColor: !shown
                      ? "rgba(20,22,26,0.06)"
                      : on
                        ? "rgba(255,106,0,0.34)"
                        : "rgba(20,22,26,0.12)",
                  }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <motion.span
                    className="text-[8px] font-bold leading-none"
                    initial={false}
                    animate={{
                      opacity: shown ? 1 : 0,
                      scale: shown ? 1 : 0.4,
                      color: on ? "#D95A00" : "rgba(20,22,26,0.25)",
                    }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    {on ? "✓" : "—"}
                  </motion.span>
                </motion.span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 02 · physical context — the fix tightening ──────────
   The card says "see where it is happening", and its chips are the hardware
   that answers that — Twin, LiDAR, vision, sensors, edge, asset identity. So
   the widget puts a plan on screen and closes on the spot: each layer that
   reports narrows the ring and sharpens what is known, from a site to a rack.

   The earlier version of this well ran a Network → Region → Site → Zone
   ladder, which is an org chart. None of these chips produces an org chart. */

const FIX: [string, string, number][] = [
  ["LiDAR", "Position · aisle B", 74],
  ["AI Vision", "Object · person + MHE", 52],
  ["Sensors", "Event · impact detected", 34],
  ["Digital Twin", "Asset · Rack B-14", 20],
];

/** Where the thing is, as a fraction of the plan box. */
const TX = 63;
const TY = 56;

function WLocate({ t }: { t: number }) {
  const at = Math.floor(t / 14) % FIX.length;
  const [layer, reading, ring] = FIX[at];

  return (
    <div className="h-full flex flex-col">
      <WidgetHead label="Locating" note="Pune DC–02" />

      <div className="flex-1 min-h-0 flex flex-col justify-center gap-2 px-3 py-2">
        {/* the plan */}
        <div
          className="relative overflow-hidden shrink-0"
          style={{
            height: 96,
            borderRadius: 8,
            border: `1px solid ${LINE}`,
            background:
              "linear-gradient(rgba(20,22,26,0.035) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(20,22,26,0.035) 1px, transparent 1px), #FFFFFF",
            backgroundSize: "14px 14px, 14px 14px",
          }}
        >
          {/* three racking runs, so the plan reads as a warehouse */}
          {[18, 44, 70].map((top) => (
            <span
              key={top}
              aria-hidden
              className="absolute left-[10%] right-[10%]"
              style={{
                top,
                height: 8,
                borderRadius: 2,
                background: "rgba(20,22,26,0.06)",
                border: "1px solid rgba(20,22,26,0.08)",
              }}
            />
          ))}

          {/* crosshair on the target */}
          <span
            aria-hidden
            className="absolute h-px"
            style={{
              left: 0,
              right: 0,
              top: `${TY}%`,
              background: "rgba(255,106,0,0.16)",
            }}
          />
          <span
            aria-hidden
            className="absolute w-px"
            style={{
              top: 0,
              bottom: 0,
              left: `${TX}%`,
              background: "rgba(255,106,0,0.16)",
            }}
          />

          {/* the ring closing, one step per reporting layer */}
          <motion.span
            aria-hidden
            className="absolute rounded-full"
            style={{
              left: `${TX}%`,
              top: `${TY}%`,
              x: "-50%",
              y: "-50%",
              border: "1px solid rgba(255,106,0,0.55)",
            }}
            initial={false}
            animate={{ width: ring, height: ring }}
            transition={{ duration: 0.6, ease: EASE }}
          />
          <span
            aria-hidden
            className="absolute w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${TX}%`, top: `${TY}%`, background: ORANGE }}
          />
          <motion.span
            key={at}
            aria-hidden
            className="absolute rounded-full"
            style={{
              left: `${TX}%`,
              top: `${TY}%`,
              x: "-50%",
              y: "-50%",
              border: `1px solid ${ORANGE}`,
            }}
            initial={{ width: ring, height: ring, opacity: 0.55 }}
            animate={{ width: ring + 26, height: ring + 26, opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeOut", repeat: Infinity }}
          />

          <span className="absolute left-2 top-1.5 text-[7.5px] font-mono font-bold tracking-[0.12em] uppercase text-graphite/30">
            Outbound staging
          </span>
        </div>

        {/* what the current layer added. One line, fixed height. */}
        <div
          className="flex items-center gap-2 px-2.5 shrink-0"
          style={{
            height: 30,
            borderRadius: 6,
            background: "#FAFAFB",
            border: `1px solid ${LINE}`,
          }}
        >
          <span className="text-[8px] font-mono font-bold tracking-[0.12em] uppercase text-signal-orange shrink-0 w-[62px] truncate">
            {layer}
          </span>
          <motion.span
            key={reading}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="text-[9px] font-mono text-graphite/55 truncate"
          >
            {reading}
          </motion.span>
          <span className="ml-auto text-[8px] font-mono font-bold tabular-nums text-graphite/30 shrink-0">
            {at + 1}/{FIX.length}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── 03 · enterprise ecosystem — which way it moves ──────
   The card says "connect business context", and the honest detail is that the
   connection has a direction. Some systems AIMS only reads; into one it
   writes an approved action back. The section's own caption says write-back
   depends on validated interfaces and scope, so the widget shows the
   direction rather than implying every arrow points both ways — and the
   packet on the live row actually travels that way. */

const SYSTEMS: [string, string, "read" | "both"][] = [
  ["WMS", "orders, tasks, dwell", "read"],
  ["ERP", "cost, assets, vendors", "read"],
  ["CMMS", "work orders", "both"],
  ["TMS", "dispatch windows", "read"],
  ["MES", "production demand", "read"],
];

const TRACK = 34;

function WExchange({ t }: { t: number }) {
  const at = Math.floor(t / 13) % SYSTEMS.length;

  return (
    <div className="h-full flex flex-col">
      <WidgetHead label="Data exchange" note="approved scope" />

      <div className="flex-1 min-h-0 flex flex-col justify-center gap-2 px-3 py-2">
        {SYSTEMS.map(([k, what, dir], i) => {
          const on = i === at;
          const both = dir === "both";
          return (
            <motion.div
              key={k}
              className="flex items-center gap-2 px-2.5 rounded-md shrink-0"
              style={{ height: 28, borderWidth: 1, borderStyle: "solid" }}
              initial={false}
              animate={{
                backgroundColor: on ? "rgba(255,106,0,0.06)" : "#FAFAFB",
                borderColor: on ? "rgba(255,106,0,0.34)" : LINE,
              }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <span className="w-[30px] shrink-0 text-[9px] font-mono font-bold text-carbon">
                {k}
              </span>

              {/* the wire, with the packet on the live row travelling the way
                  that row's data actually goes */}
              <span
                className="relative shrink-0"
                style={{ width: TRACK, height: 8 }}
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
                  style={{ background: "rgba(20,22,26,0.14)" }}
                />
                <motion.span
                  aria-hidden
                  className="absolute top-1/2 w-1.5 h-1.5 rounded-full -translate-y-1/2"
                  style={{ background: on ? ORANGE : "rgba(20,22,26,0.22)" }}
                  initial={false}
                  animate={
                    on
                      ? { left: [0, TRACK - 6], opacity: [0, 1, 1, 0] }
                      : { left: TRACK - 6, opacity: 1 }
                  }
                  transition={
                    on
                      ? { duration: 1.3, repeat: Infinity, ease: "easeInOut" }
                      : { duration: 0.3 }
                  }
                />
                {both && (
                  <motion.span
                    aria-hidden
                    className="absolute top-1/2 w-1.5 h-1.5 rounded-full -translate-y-1/2"
                    style={{ background: on ? GREEN : "rgba(20,22,26,0.22)" }}
                    initial={false}
                    animate={
                      on
                        ? { left: [TRACK - 6, 0], opacity: [0, 1, 1, 0] }
                        : { left: 0, opacity: 1 }
                    }
                    transition={
                      on
                        ? {
                            duration: 1.3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.45,
                          }
                        : { duration: 0.3 }
                    }
                  />
                )}
              </span>

              <span className="flex-1 min-w-0 text-[8.5px] font-mono text-graphite/45 truncate">
                {what}
              </span>
              <span
                className="shrink-0 text-[7.5px] font-mono font-bold tracking-[0.1em] uppercase"
                style={{ color: both ? GREEN : "rgba(20,22,26,0.28)" }}
              >
                {both ? "write-back" : "read"}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ── the three ───────────────────────────────────────────── */

const CARDS: {
  kicker: string;
  title: string;
  chips: string[];
  Widget: (p: { t: number }) => React.ReactNode;
}[] = [
  {
    kicker: "RAMS applications",
    title: "Connect operational modules",
    chips: [
      "IRDS rack safety",
      "MEPS productivity",
      "RTSS safety",
      "IROS inventory",
      "IMDS maintenance",
      "ATOS execution",
    ],
    Widget: ({ t }) => <WCoverage t={t} />,
  },
  {
    kicker: "Physical context",
    title: "See where it is happening",
    chips: [
      "Digital Twin",
      "LiDAR",
      "AI Vision",
      "Sensors",
      "Edge devices",
      "Asset identity",
    ],
    Widget: ({ t }) => <WLocate t={t} />,
  },
  {
    kicker: "Enterprise ecosystem",
    title: "Connect business context",
    chips: ["WMS", "ERP", "MES", "CMMS", "TMS", "Approved APIs"],
    Widget: ({ t }) => <WExchange t={t} />,
  },
];

/** What sits between the floor and the decision. AIMS is the marked node. */
const RAIL: [string, string, string][] = [
  ["Physical world", "People, assets, inventory", "#3E63DD"],
  ["Edge + IoT", "Live signals and events", "#299764"],
  ["Digital Twin", "Spatial + asset context", "#12A594"],
  ["RAMS modules", "Domain intelligence", "#6647F0"],
  ["AIMS", "Management decisions", ORANGE],
];

export function AmsIntegrations() {
  const t = useTick();

  return (
    <Section surface="offWhite" id="integrations">
      <SectionHeader
        eyebrow="Integrations"
        top="The intelligence layer across"
        bottom="The physical operating system."
        size="compact"
        width="wide"
        body="AIMS connects RAMS modules, Digital Twin context and approved enterprise data without erasing the source of each signal."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[1240px] mx-auto">
        {CARDS.map((c, i) => (
          <motion.div
            key={c.kicker}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
            className="flex flex-col p-5 sm:p-6"
            style={CARD}
          >
            <div
              className="shrink-0 overflow-hidden"
              style={{ ...WELL, height: 196 }}
            >
              <c.Widget t={t} />
            </div>

            <p className="mt-6 text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange">
              {c.kicker}
            </p>
            <h3 className="mt-3 text-[18px] font-bold text-carbon leading-[1.2] tracking-[-0.025em]">
              {c.title}
            </h3>
            <Chips items={c.chips} />
          </motion.div>
        ))}
      </div>

      {/* ── the rail ─────────────────────────────────────
          Five nodes with the track between the first and last centres — with
          five equal columns those sit at 1/10 and 9/10, so it is inset 10%. */}
      <div className="mt-14 sm:mt-16 max-w-[1240px] mx-auto">
        <div className="overflow-x-auto">
          <div className="relative min-w-[680px] lg:min-w-0">
            <span
              aria-hidden
              className="absolute top-[13px] h-px"
              style={{ left: "10%", right: "10%", background: LINE }}
            />

            <div className="relative grid grid-cols-5 gap-x-3">
              {RAIL.map(([k, v, tint], i) => {
                const hub = k === "AIMS";
                return (
                  <motion.div
                    key={k}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
                    className="flex flex-col items-center text-center"
                  >
                    <span
                      className="flex items-center justify-center w-[27px] h-[27px] rounded-full shrink-0"
                      style={{
                        background: hub ? ORANGE : "#FFFFFF",
                        border: `1.5px solid ${hub ? ORANGE : tint + "66"}`,
                      }}
                    >
                      <span
                        className="w-[7px] h-[7px] rounded-full"
                        style={{ background: hub ? "#FFFFFF" : tint }}
                      />
                    </span>

                    <span
                      className={
                        "mt-4 text-[10px] font-mono font-bold tracking-[0.16em] uppercase " +
                        (hub ? "text-signal-orange" : "text-carbon")
                      }
                    >
                      {k}
                    </span>
                    <span className="mt-2 text-[11.5px] leading-[1.5] text-graphite/55 max-w-[15ch]">
                      {v}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-10 text-center text-[11px] leading-[1.6] text-graphite/45 max-w-[860px] mx-auto">
        Integration availability, data frequency, write-back and analytics
        depend on source quality, validated interfaces, permissions and agreed
        deployment scope.
      </p>
    </Section>
  );
}
