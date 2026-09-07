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
 * four platform pages read as one system.
 *
 * One interval drives all three widgets — independent timers drift apart
 * within a minute and the row stops reading as one thing.
 *
 * Each widget does what its own card says:
 *
 *   · "Capture physical events"    one event walking detect → classify →
 *                                  locate → alert, which is the RTSS claim
 *   · "Use available data"         one event resolved against a client system
 *   · "Connect safety with ops"    five modules stacking into one context
 *
 * Only the third of those is shared with the other platform pages, and that
 * one should be: it is the same RAMS module stack everywhere.
 *
 * The rail underneath is a real sequence — a signal is detected, processed
 * at the edge, placed in the twin, worked by RTSS and read across sites by
 * AIMS — so unlike the module rails on the other platform pages it earns
 * its order. RTSS is the marked node.
 */

const LINE = "#E8E8ED";
const ORANGE = "#FF6A00";
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

/* ── 01 · RAMS hardware — the event resolving ────────────
   The card says "capture physical events", and RTSS's claim about them is
   that they resolve in seconds rather than at the end of a shift. So the
   widget walks one event through the four things that happen to it, with the
   line under the strip saying what each step actually does.

   A scrolling list of arriving rows was ATOS's widget — it says "things are
   coming in", which is true of every product on this site. */

const STEPS: [string, string][] = [
  ["Detect", "Supported sensors and vision pick up the physical event."],
  ["Classify", "Type and severity read from the event and its signals."],
  ["Locate", "The Digital Twin places it — aisle, zone, asset, machine."],
  ["Alert", "The right owner is notified, with the evidence attached."],
];

/** 16 ticks a step, so one event takes about seven seconds to walk. */
const STEP_TICKS = 16;

function WDetect({ t }: { t: number }) {
  const at = Math.floor(t / STEP_TICKS) % STEPS.length;

  return (
    <div className="h-full flex flex-col">
      <WidgetHead label="Event · Aisle 07" note="live" />

      <div className="flex-1 min-h-0 flex flex-col justify-center px-3.5 py-3 gap-4">
        {/* The strip. The track runs between the first and last node centres —
            with four equal columns those sit at 1/8 and 7/8. */}
        <div className="relative shrink-0">
          <span
            aria-hidden
            className="absolute top-[9px] h-px"
            style={{ left: "12.5%", right: "12.5%", background: LINE }}
          />
          <motion.span
            aria-hidden
            className="absolute top-[9px] h-px origin-left"
            style={{ left: "12.5%", right: "12.5%", background: ORANGE }}
            initial={false}
            animate={{ scaleX: at / (STEPS.length - 1) }}
            transition={{ duration: 0.5, ease: EASE }}
          />

          <div className="relative grid grid-cols-4">
            {STEPS.map(([k], i) => {
              const done = i <= at;
              return (
                <div key={k} className="flex flex-col items-center">
                  <motion.span
                    className="flex items-center justify-center w-[19px] h-[19px] rounded-full"
                    initial={false}
                    animate={{
                      backgroundColor: done ? ORANGE : "#FFFFFF",
                      borderColor: done ? ORANGE : LINE,
                    }}
                    transition={{ duration: 0.4, ease: EASE }}
                    style={{ borderWidth: 1.5, borderStyle: "solid" }}
                  >
                    <motion.span
                      className="w-[6px] h-[6px] rounded-full"
                      initial={false}
                      animate={{
                        backgroundColor: done ? "#FFFFFF" : "rgba(20,22,26,0.20)",
                      }}
                      transition={{ duration: 0.4 }}
                    />
                  </motion.span>

                  <motion.span
                    className="mt-2.5 text-[8.5px] font-mono font-bold tracking-[0.1em] uppercase"
                    initial={false}
                    animate={{
                      color: i === at ? "#D95A00" : "rgba(20,22,26,0.35)",
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    {k}
                  </motion.span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two lines reserved, so the well is the same shape at every step. */}
        <div
          className="flex items-center h-[46px] px-2.5 rounded-md shrink-0"
          style={{ background: "#FAFAFB", border: `1px solid ${LINE}` }}
        >
          <motion.span
            key={at}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="text-[9px] leading-[1.5] text-graphite/60"
          >
            {STEPS[at][1]}
          </motion.span>
        </div>
      </div>
    </div>
  );
}

/* ── 02 · client ecosystem ───────────────────────────────
   The card says “use available operational data”, so the widget uses it:
   the safety event RTSS detected on the left, the customer record that
   gives it a name on the right, and the line drawn between the pair being
   matched. A separation distance closing showed RAMS hardware measuring —
   which is the card above this one.

   The same matcher `MepsIntegrations` and `RdsIntegrations` use for this card,
   `LK_` prefixed because ROW_H / ROW_GAP above belong to the feed list. Pairs
   are not the identity map — a straight line across reads as a coincidence
   rather than as a match. */

const LK_LEFT = ["Impact · MHE 07", "Zone breach · B4", "Speed flag · Aisle 7"];
const LK_RIGHT = ["Access · OP-118", "Telematics · MHE 04", "CMMS WO-3318"];
/** Which row on the left resolves against which record on the right. */
const LK_PAIRS = [2, 0, 1];

const LK_ROW_H = 34;
const LK_GAP = 8;
/** Centre of row i, in the connector's own viewBox. */
const lkMid = (i: number) => i * (LK_ROW_H + LK_GAP) + LK_ROW_H / 2;
const LK_H = 3 * LK_ROW_H + 2 * LK_GAP;

function LinkRow({ label, on }: { label: string; on: boolean }) {
  return (
    <div
      className="flex items-center px-2.5 rounded-md transition-colors duration-300"
      style={{
        height: LK_ROW_H,
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

function WSystems({ t }: { t: number }) {
  const at = Math.floor(t / 16) % LK_PAIRS.length;
  const to = LK_PAIRS[at];
  const d = `M0 ${lkMid(at)} C 14 ${lkMid(at)}, 14 ${lkMid(to)}, 28 ${lkMid(to)}`;

  return (
    <div className="h-full flex flex-col">
      <WidgetHead label="Matching context" note={`${at + 1}/3`} />

      <div className="flex-1 min-h-0 flex items-center px-3 py-2">
        <div
          className="w-full grid grid-cols-[minmax(0,1fr)_28px_minmax(0,1fr)]"
          style={{ height: LK_H }}
        >
          <div className="flex flex-col" style={{ gap: LK_GAP }}>
            {LK_LEFT.map((x, i) => (
              <LinkRow key={x} label={x} on={i === at} />
            ))}
          </div>

          {/* One line, redrawn each time the pair changes. `pathLength`
              manages its own dash array — never combine it with a manual
              strokeDasharray, which draws the line in two pieces. */}
          <svg
            viewBox={`0 0 28 ${LK_H}`}
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

          <div className="flex flex-col" style={{ gap: LK_GAP }}>
            {LK_RIGHT.map((x, i) => (
              <LinkRow key={x} label={x} on={i === to} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 03 · RAMS platform — context accumulating ───────────
   Five equal rows. A module that has not landed yet is drawn unfilled rather
   than hidden, so the well is the same shape at every point in the cycle. */

/* Five rows, covering all six chips under the card — modules are paired with
   a slash where they share a contribution, the way `MepsIntegrations` and
   `RdsIntegrations` already do it, so the skeleton stays at five.

   Twin at the top and AIMS at the bottom is the architecture, not a
   preference: the Twin gives an event its place, the modules give it their
   domain, AIMS reads it across sites. Ending this stack on ATOS dropped AIMS
   from a card whose own chips name it, and contradicted this section's own
   rail forty pixels below, which ends "AIMS · Cross-site insight". */
const LAYERS: [string, string, string][] = [
  ["Digital Twin", "Place", "#3E63DD"],
  ["IRDS", "Rack health", "#F76808"],
  ["MEPS / IMDS", "Movement + condition", "#E5484D"],
  ["ATOS", "Execution", "#299764"],
  ["AIMS", "Cross-site insight", "#6647F0"],
];

function WContext({ t }: { t: number }) {
  const step = Math.floor(t / 9) % 8;
  const built = Math.min(step + 1, LAYERS.length);

  return (
    <div className="h-full flex flex-col">
      <WidgetHead label="Context" note={`${built}/${LAYERS.length} layers`} />

      <div className="flex-1 min-h-0 flex flex-col justify-center gap-1.5 px-3 py-2">
        {LAYERS.map(([k, v, tint], i) => {
          const on = i < built;
          return (
            <motion.div
              key={k}
              className="relative flex items-center gap-2 pl-3.5 pr-2.5 rounded-md overflow-hidden"
              style={{ height: 25, borderWidth: 1, borderStyle: "solid" }}
              initial={false}
              animate={{
                backgroundColor: on ? `${tint}12` : "rgba(20,22,26,0.02)",
                borderColor: on ? `${tint}40` : LINE,
                x: on ? 0 : -4,
              }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <motion.span
                aria-hidden
                className="absolute left-0 top-0 bottom-0 w-[3px]"
                style={{ background: tint }}
                initial={false}
                animate={{ scaleY: on ? 1 : 0.25, opacity: on ? 1 : 0.3 }}
                transition={{ duration: 0.4, ease: EASE }}
              />
              <motion.span
                className="text-[9px] font-mono font-bold uppercase tracking-[0.08em] truncate"
                initial={false}
                animate={{ color: on ? tint : "rgba(20,22,26,0.28)" }}
                transition={{ duration: 0.4 }}
              >
                {k}
              </motion.span>
              <motion.span
                className="ml-auto text-[8.5px] font-mono shrink-0"
                initial={false}
                animate={{
                  color: on ? "rgba(20,22,26,0.42)" : "rgba(20,22,26,0.20)",
                }}
                transition={{ duration: 0.4 }}
              >
                {on ? v : "—"}
              </motion.span>
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
    kicker: "RAMS hardware",
    title: "Capture physical events",
    chips: [
      "AI Vision Pro",
      "Impact sensors",
      "LiDAR",
      "Proximity sensing",
      "Operator authentication",
      "OmniBox Edge",
    ],
    Widget: ({ t }) => <WDetect t={t} />,
  },
  {
    kicker: "Client ecosystem",
    title: "Use available operational data",
    chips: [
      "MHE telematics",
      "Cameras",
      "Access systems",
      "WMS / ERP",
      "CMMS",
      "Approved APIs",
    ],
    Widget: ({ t }) => <WSystems t={t} />,
  },
  {
    kicker: "RAMS platform",
    title: "Connect safety with operations",
    chips: [
      "Digital Twin",
      "IRDS rack health",
      "MEPS movement",
      "IMDS maintenance",
      "ATOS execution",
      "AIMS intelligence",
    ],
    Widget: ({ t }) => <WContext t={t} />,
  },
];

/** What sits between the signal and the response. RTSS is the marked node. */
const RAIL: [string, string, string][] = [
  ["Sensor / vision", "Physical detection", "#3E63DD"],
  ["Edge", "Local processing", "#299764"],
  ["Digital Twin", "Location + asset context", "#12A594"],
  ["RTSS", "Alert + safety workflow", ORANGE],
  ["AIMS", "Cross-site insight", "#6647F0"],
];

export function RtsIntegrations() {
  const t = useTick();

  return (
    <Section surface="offWhite" id="integrations">
      <SectionHeader
        eyebrow="Integrations"
        top="Bring safety signals into"
        bottom="The same physical context."
        size="compact"
        width="wide"
        body="RTSS can combine supported RAMS hardware, customer systems and Digital Twin context around one safety workflow."
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
                const hub = k === "RTSS";
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
        Detection, latency, coverage and event types depend on the selected
        hardware, site conditions, validated integrations and configured rules.
      </p>
    </Section>
  );
}
