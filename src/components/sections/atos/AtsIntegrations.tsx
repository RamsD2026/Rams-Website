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
 *   · "Receive demand and status"   orders arriving and being acknowledged
 *   · "Understand what changed"     an event landing and the ETA moving with it
 *   · "Orchestrate with context"    five modules stacking into one context
 *
 * The rail underneath is not a chain of equal parts: ATOS is the marked node
 * because the section is about what sits between the systems that know what is
 * required and the people who move the work.
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

/* ── 01 · business systems — demand arriving ─────────────
   Row pitch is tied to the row height, or the loop shows a seam. */

const ROW_H = 30;
const ROW_GAP = 6;
const ROW_PITCH = ROW_H + ROW_GAP;

const ORDERS: [string, string][] = [
  ["WMS", "DO-4821 received"],
  ["TMS", "IN-7138 ETA 14:34"],
  ["ERP", "PO-2210 released"],
  ["WMS", "RPL-092 created"],
  ["MES", "Line call · 4 pallets"],
  ["CMMS", "MHE 04 available"],
];

function WDemand() {
  return (
    <div className="h-full flex flex-col">
      <WidgetHead label="Demand in" note="live" />
      {/* The list is rendered twice and translated one list's worth, so the
          loop closes without a join. */}
      <div className="relative flex-1 min-h-0 overflow-hidden px-3 py-2">
        <motion.div
          className="flex flex-col"
          initial={{ y: 0 }}
          animate={{ y: [0, -(ORDERS.length * ROW_PITCH)] }}
          transition={{
            duration: ORDERS.length * 1.6,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {[...ORDERS, ...ORDERS].map(([src, what], i) => (
            <div
              key={`${src}-${i}`}
              className="flex items-center gap-2 px-2.5 rounded-md shrink-0"
              style={{
                height: ROW_H,
                marginBottom: ROW_GAP,
                background: "#FAFAFB",
                border: `1px solid ${LINE}`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: GREEN }}
              />
              <span className="text-[9.5px] font-mono font-bold text-carbon shrink-0">
                {src}
              </span>
              <span className="ml-auto text-[9px] font-mono text-graphite/45 truncate">
                {what}
              </span>
            </div>
          ))}
        </motion.div>

        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-6 pointer-events-none"
          style={{ background: "linear-gradient(to top, #FFFFFF, transparent)" }}
        />
      </div>
    </div>
  );
}

/* ── 02 · live operations — the ETA moving ───────────────
   The card says "understand what changed", so the widget shows one thing
   changing: an event lands and the arrival slides with it. */

const ETAS = ["14:34", "14:41", "15:02", "15:19"];

function WEvents({ t }: { t: number }) {
  /* Four beats to walk the ETA out, three to hold it. */
  const step = Math.floor(t / 14) % 7;
  const at = Math.min(step, ETAS.length - 1);
  const late = at > 0;

  return (
    <div className="h-full flex flex-col">
      <WidgetHead label="IN-7138 · inbound" note="GPS / TMS" />

      <div className="flex-1 min-h-0 flex flex-col justify-center px-3 py-3 gap-3">
        <div>
          <p className="text-[8px] font-mono font-bold tracking-[0.14em] uppercase text-graphite/40">
            Arrival
          </p>
          <p className="mt-1 flex items-baseline gap-2">
            <motion.span
              key={ETAS[at]}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="text-[26px] font-bold tabular-nums leading-none tracking-[-0.04em]"
              style={{ color: late ? "#E08700" : "#08080A" }}
            >
              {ETAS[at]}
            </motion.span>
            {late && (
              <span className="text-[10px] font-mono font-bold text-[#E08700]">
                +{at * 15}m
              </span>
            )}
          </p>
        </div>

        {/* the road in */}
        <span
          className="relative h-1.5 rounded-full overflow-hidden shrink-0"
          style={{ background: "#F1F1F4" }}
        >
          <motion.span
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: late ? "#E08700" : GREEN }}
            initial={false}
            animate={{ width: `${88 - at * 18}%` }}
            transition={{ duration: 0.6, ease: EASE }}
          />
        </span>

        <div
          className="px-2.5 py-2 rounded-md"
          style={{
            background: late ? "rgba(224,135,0,0.08)" : "#FAFAFB",
            border: `1px solid ${late ? "rgba(224,135,0,0.30)" : LINE}`,
          }}
        >
          <span className="text-[9px] leading-[1.5] text-graphite/60">
            {late
              ? "Dock 02 resource released. Dependent tasks resequenced."
              : "On plan. Dock 02 held for arrival."}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── 03 · RAMS platform — context accumulating ───────────
   Five equal rows. A module that has not landed yet is drawn unfilled rather
   than hidden, so the well is the same shape at every point in the cycle. */

const LAYERS: [string, string, string][] = [
  ["Digital Twin", "Place", "#3E63DD"],
  ["MEPS", "Movement", "#F76808"],
  ["IROS", "Inventory", "#299764"],
  ["IMDS / RTSS", "Health", "#E5484D"],
  ["AIMS", "Insight", "#6647F0"],
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
    kicker: "Business systems",
    title: "Receive demand and status",
    chips: ["WMS", "ERP", "TMS", "MES", "CMMS", "Approved APIs"],
    Widget: () => <WDemand />,
  },
  {
    kicker: "Live operations",
    title: "Understand what changed",
    chips: [
      "GPS / telematics",
      "Supervisor input",
      "MHE systems",
      "Edge + IoT",
      "Dock events",
      "Location systems",
    ],
    Widget: ({ t }) => <WEvents t={t} />,
  },
  {
    kicker: "RAMS platform",
    title: "Orchestrate with context",
    chips: ["Digital Twin", "MEPS", "IROS", "IMDS", "RTSS", "AIMS"],
    Widget: ({ t }) => <WContext t={t} />,
  },
];

/** What sits between the systems and the work. ATOS is the marked node. */
const RAIL: [string, string, string][] = [
  ["WMS / ERP / TMS", "Orders, demand and ETA", "#3E63DD"],
  ["Digital Twin", "Location + asset context", "#299764"],
  ["ATOS", "Priority + orchestration", ORANGE],
  ["People + MHE", "Physical execution", "#E5484D"],
  ["AIMS", "Management insight", "#6647F0"],
];

export function AtsIntegrations() {
  const t = useTick();

  return (
    <Section surface="offWhite" id="integrations">
      <SectionHeader
        eyebrow="Integrations"
        top="Connect business demand"
        bottom="To physical execution."
        size="compact"
        width="wide"
        body="ATOS is designed to fit between planning systems, operational signals, RAMS intelligence and the people performing the work."
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
                const hub = k === "ATOS";
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
        Integration scope, update frequency, write-back and automated dispatch
        depend on validated interfaces, customer permissions and the agreed
        deployment.
      </p>
    </Section>
  );
}
