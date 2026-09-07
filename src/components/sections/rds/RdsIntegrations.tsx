"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 08 — Integrations.
 *
 * `MepsIntegrations`, which is `TwinIntegrations`, which is `AimsDirection`:
 * cards carrying a 196px well with a live widget in it, then a kicker, a title
 * and the chip list. `CARD`, `WELL`, `WidgetHead` and the 110ms tick are
 * copied rather than re-derived so the four sections read as one system.
 *
 * One interval drives all three widgets — independent timers drift apart
 * within a minute and the row stops reading as one thing.
 *
 * Each widget does what its own card says:
 *
 *   · "Capture reliable evidence"     a checklist being worked, with the
 *                                     evidence count rising behind it
 *   · "Connect action and events"     an event on one side, the work order it
 *                                     raises on the other, and the link drawn
 *   · "Build cross-module context"    five modules stacking into one context
 *
 * The third is deliberately the same widget as on the MEPS page. It is the
 * same sentence making the same claim, and giving one claim two different
 * pictures would suggest they are two different things.
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

/* ── 01 · field + inspection ─────────────────────────────
   The card says "capture reliable evidence", so the widget captures: a
   checklist worked through, and the evidence count rising as it goes. */

const CAPTURE: [string, string][] = [
  ["Upright plumb", "measure"],
  ["Beam deflection", "measure"],
  ["Baseplate + anchors", "2 photos"],
  ["Bracing", "1 photo"],
  ["Impact survey", "3 photos"],
];

function WCapture({ t }: { t: number }) {
  /* Five beats to fill, three to hold, then round again — `t` only
     grows, so without the modulo the checklist completes once and the
     widget is a still image for the rest of the visit. */
  const done = Math.min(CAPTURE.length, (Math.floor(t / 11) % 8) + 1);
  const shots = [0, 0, 2, 3, 6][done - 1] ?? 0;

  return (
    <div className="h-full flex flex-col">
      <WidgetHead label="Rack B-11 · capture" note={`${shots} evidence`} />

      <div className="flex-1 min-h-0 flex flex-col justify-center gap-1.5 px-3 py-3">
        {CAPTURE.map(([k, kind], i) => {
          const on = i < done;
          return (
            <motion.div
              key={k}
              className="flex items-center gap-2 px-2.5 rounded-md shrink-0"
              style={{
                height: 26,
                background: "#FAFAFB",
                border: `1px solid ${on ? "rgba(22,163,74,0.30)" : LINE}`,
              }}
              initial={false}
              animate={{ opacity: on ? 1 : 0.3, x: on ? 0 : -8 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <span
                className="flex items-center justify-center w-3.5 h-3.5 rounded-full text-[8px] font-bold shrink-0"
                style={{
                  background: on ? "rgba(22,163,74,0.12)" : "#F1F1F4",
                  color: on ? "#16A34A" : "#A8A8B0",
                }}
              >
                {on ? "✓" : "○"}
              </span>
              <span className="text-[9.5px] text-graphite/65 truncate">{k}</span>
              <span className="ml-auto text-[8.5px] font-mono text-graphite/40 shrink-0">
                {on ? kind : "—"}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ── 02 · systems + hardware ─────────────────────────────
   The card says "connect action and events", so the widget connects one to
   the other: the event on the left, the work it raises on the right, and the
   line drawn between the pair being matched. */

const EVENTS = ["Impact · A3-07", "AI vision · flag", "Red finding · B-11"];
const WORK = ["CMMS WO-2291", "ERP PR-8842", "Doc · closure pack"];
const PAIRS = [0, 2, 1];

const ROW_H = 34;
const ROW_GAP = 8;
const mid = (i: number) => i * (ROW_H + ROW_GAP) + ROW_H / 2;
const COL_H = 3 * ROW_H + 2 * ROW_GAP;

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

function WSystems({ t }: { t: number }) {
  const at = Math.floor(t / 16) % PAIRS.length;
  const to = PAIRS[at];
  const d = `M0 ${mid(at)} C 14 ${mid(at)}, 14 ${mid(to)}, 28 ${mid(to)}`;

  return (
    <div className="h-full flex flex-col">
      <WidgetHead label="Raising work" note={`${at + 1}/3`} />

      <div className="flex-1 min-h-0 flex items-center px-3 py-2">
        <div
          className="w-full grid grid-cols-[minmax(0,1fr)_28px_minmax(0,1fr)]"
          style={{ height: COL_H }}
        >
          <div className="flex flex-col" style={{ gap: ROW_GAP }}>
            {EVENTS.map((x, i) => (
              <LinkRow key={x} label={x} on={i === at} />
            ))}
          </div>

          {/* `pathLength` manages its own dash array — never combine it with
              a manual strokeDasharray, which draws the line in two pieces. */}
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
            {WORK.map((x, i) => (
              <LinkRow key={x} label={x} on={i === to} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 03 · RAMS platform ──────────────────────────────────
   The modules stack up a layer at a time until the context is complete, then
   it starts again. Same widget as the MEPS page carries under the same
   sentence, with the rack in the first layer instead of the floor. */

const LAYERS: [string, string, string][] = [
  ["Digital Twin", "Place", "#3E63DD"],
  ["IRDS", "Rack lifecycle", ORANGE],
  ["RTSS / MEPS", "Impact", "#E5484D"],
  ["IMDS", "Diagnostics", "#6647F0"],
  ["AIMS", "Insight", "#299764"],
];

function WModules({ t }: { t: number }) {
  const step = Math.floor(t / 9) % 8;
  const built = Math.min(step + 1, LAYERS.length);

  return (
    <div className="h-full flex flex-col">
      <WidgetHead label="Context" note={`${built}/${LAYERS.length} layers`} />

      {/* Five equal rows. A layer that has not landed yet is drawn unfilled
          rather than hidden, so the well is the same shape at every point in
          the cycle and the stack is seen to fill rather than to appear. */}
      <div className="flex-1 min-h-0 flex flex-col justify-center gap-1.5 px-3 py-2">
        {LAYERS.map(([k, v, tint], i) => {
          const on = i < built;
          return (
            <motion.div
              key={k}
              className="relative flex items-center gap-2 pl-3.5 pr-2.5 rounded-md overflow-hidden"
              /* 25 not 26: the well gives the body 151px and five 26px rows at a
                 6px gap need 154. Three pixels over is a clipped bottom row. */
              style={{ height: 25, borderWidth: 1, borderStyle: "solid" }}
              initial={false}
              animate={{
                backgroundColor: on ? `${tint}12` : "rgba(20,22,26,0.02)",
                borderColor: on ? `${tint}40` : LINE,
                x: on ? 0 : -4,
              }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {/* the layer's own edge, filling as it lands */}
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
    kicker: "Field + inspection",
    title: "Capture reliable evidence",
    chips: [
      "Inspector mobile workflow",
      "Configured checklists",
      "Measurements",
      "Photo evidence",
      "QR / asset identity",
      "Offline-capable collection*",
    ],
    Widget: ({ t }) => <WCapture t={t} />,
  },
  {
    kicker: "Systems + hardware",
    title: "Connect action and events",
    chips: [
      "CMMS",
      "ERP / procurement",
      "Document systems",
      "Impact sensors",
      "AI Vision",
      "Approved APIs",
    ],
    Widget: ({ t }) => <WSystems t={t} />,
  },
  {
    kicker: "RAMS platform",
    title: "Build cross-module context",
    chips: [
      "Digital Twin",
      "RTSS safety",
      "MEPS movement",
      "IMDS diagnostics",
      "AIMS intelligence",
      "Customer applications",
    ],
    Widget: ({ t }) => <WModules t={t} />,
  },
];

/** The five that share the rack identity. A set, not a sequence. */
const MODULES: [string, string, string][] = [
  ["Digital Twin", "Exact physical location", "#3E63DD"],
  ["IRDS", "Inspection + rack lifecycle", ORANGE],
  ["RTSS / MEPS", "Impact + movement context", "#E5484D"],
  ["CMMS / ERP", "Work + procurement", "#6647F0"],
  ["AIMS", "Management insight", "#299764"],
];

export function RdsIntegrations() {
  const t = useTick();

  return (
    <Section surface="offWhite" id="integrations">
      <SectionHeader
        eyebrow="Integrations"
        top="Rack safety in the context"
        bottom="Of the whole operation."
        size="compact"
        width="wide"
        body="Connect inspection, physical events, maintenance workflows and management intelligence around the same rack identity."
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
          The line through these five is the rack identity they share, not an
          order they run in, so each node carries its own module colour rather
          than a position. IRDS is the marked node because it is the one the
          section is about. */}
      <div className="mt-14 sm:mt-16 max-w-[1240px] mx-auto">
        <div className="overflow-x-auto">
          <div className="relative min-w-[680px] lg:min-w-0">
            <span
              aria-hidden
              className="absolute top-[13px] h-px"
              style={{ left: "10%", right: "10%", background: LINE }}
            />

            <div className="relative grid grid-cols-5 gap-x-3">
              {MODULES.map(([k, v, tint], i) => {
                const hub = k === "IRDS";
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

      <p className="mt-10 text-center text-[11px] leading-[1.6] text-graphite/45 max-w-[820px] mx-auto">
        *Offline availability depends on the configured mobile workflow and
        deployment scope.
      </p>

    </Section>
  );
}
