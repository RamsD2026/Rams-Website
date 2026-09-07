"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Box,
  Tag,
  GitCompareArrows,
  Radio,
  Network,
  LayoutGrid,
} from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 04 — Core capabilities.
 *
 * Two halves. The 8D framework is the interactive product UI: eight questions
 * the twin can answer about one asset, and the record behind each answer.
 * Everything is asked of the same asset — RCK-A3-C07, the rack the rest of
 * this page keeps returning to — so the eight dimensions read as eight views
 * of one thing rather than eight features.
 *
 * Beneath it, the six capability groups those dimensions are delivered
 * through. The conic shine on hover is the shared light-card signature; the
 * custom property is namespaced `twincap` so it cannot collide with another
 * section on this page.
 */

const ASSET = "RCK-A3-C07";

const DIMENSIONS = [
  {
    n: "01",
    key: "spatial",
    label: "Spatial",
    q: "Where is it?",
    body: "Position, orientation and footprint in the building, plus what it is next to. A location the whole operation can point at, not a text field someone typed.",
    rows: [
      ["Site", "Warehouse 01"],
      ["Aisle · Bay", "A3 · C07"],
      ["Adjacent", "Walkway W1, Route R2"],
      ["Coordinates", "X 581 · Y 184"],
    ],
  },
  {
    n: "02",
    key: "asset",
    label: "Asset",
    q: "What is it?",
    body: "Class, make, specification and the identity that follows it for life. One record, not a row in four different systems.",
    rows: [
      ["Class", "Selective pallet rack"],
      ["OEM", "Bay 7 upright · 90×70"],
      ["Design load", "2,400 kg / level"],
      ["Asset ID", ASSET],
    ],
  },
  {
    n: "03",
    key: "time",
    label: "Time",
    q: "How has it changed?",
    body: "Every state the asset has been in, kept. What was moved, repaired, reconfigured or replaced, and when — so change is measurable rather than remembered.",
    rows: [
      ["Installed", "14 Mar 2022"],
      ["Reconfigured", "09 Nov 2023"],
      ["Beam replaced", "02 Feb 2025"],
      ["States retained", "37"],
    ],
  },
  {
    n: "04",
    key: "condition",
    label: "Condition",
    q: "What condition is it in?",
    body: "Structural state against the standard it was designed to: damage, deflection, plumbness, and the severity that follows from it.",
    rows: [
      ["Severity", "Amber"],
      ["Last inspection", "21 Aug 2025"],
      ["Open observation", "Upright dent · 8 mm"],
      ["Action", "Repair · due 12 Sep"],
    ],
  },
  {
    n: "05",
    key: "operation",
    label: "Operation",
    q: "How is it being used?",
    body: "What actually happens to it — occupancy, throughput, the traffic that passes it and the equipment that works it.",
    rows: [
      ["Occupancy", "84%"],
      ["Picks · 30 days", "1,412"],
      ["MHE passes / shift", "196"],
      ["Peak shift", "B · 14:00–22:00"],
    ],
  },
  {
    n: "06",
    key: "simulation",
    label: "Simulation",
    q: "What if we change it?",
    body: "Test a change against the model before it is made physically. Reach, clearance, flow and capacity are checked while it is still a proposal.",
    rows: [
      ["Scenario", "Narrow aisle to 2.9 m"],
      ["Reach truck clearance", "Fails by 140 mm"],
      ["Storage gained", "+6 bays"],
      ["Verdict", "Blocked"],
    ],
  },
  {
    n: "07",
    key: "live",
    label: "Live",
    q: "What is happening now?",
    body: "The current reading, in place. Impact, tilt, load, movement and the events arriving from cameras, sensors and controllers this second.",
    rows: [
      ["Impact sensor", "IMP-A3-07 · online"],
      ["Last event", "09:42:07 — impact"],
      ["Tilt", "0.4°"],
      ["Load now", "1,980 kg / level"],
    ],
  },
  {
    n: "08",
    key: "intelligence",
    label: "Intelligence",
    q: "What does it mean next?",
    body: "The seven dimensions above, read together. A pattern rather than an alert: what is likely to happen, where, and what to do before it does.",
    rows: [
      ["Pattern", "3rd impact, same upright"],
      ["Common factor", "Route R2 turn radius"],
      ["Risk", "Rising"],
      ["Recommendation", "Reroute R2, add guard"],
    ],
  },
] as const;

const GROUPS = [
  {
    icon: Box,
    title: "Spatial modelling",
    body: "Model the shell, structure, racking, zones and walkways from a plan, a scan or a survey — at the accuracy the work actually needs.",
  },
  {
    icon: Tag,
    title: "Asset tagging & lifecycle",
    body: "Give every physical thing an identity, a location and a life: install, inspect, repair, reconfigure, replace, retire.",
  },
  {
    icon: GitCompareArrows,
    title: "Change simulation",
    body: "Move a rack, narrow an aisle, add a dock. See what it does to reach, flow and capacity before anyone touches the floor.",
  },
  {
    icon: Radio,
    title: "Live operations",
    body: "Movement, condition, tasks and alerts resolved to a place, so an event is read where it happened rather than in a log.",
  },
  {
    icon: Network,
    title: "Open connectivity",
    body: "WMS, ERP, MES, BMS, cameras, controllers, RAMS hardware and third-party sensors — through open protocols and APIs.",
  },
  {
    icon: LayoutGrid,
    title: "Applications platform",
    body: "Every RAMS application reads from the twin and writes back to it. So can yours, through the same interfaces.",
  },
];

export function TwinCapabilities() {
  const [i, setI] = useState(0);
  const d = DIMENSIONS[i];

  return (
    <Section surface="white" id="capabilities">
      <style>{`
        @property --twincap-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .twincap-card { position: relative; isolation: isolate; }
        .twincap-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--twincap-shine-angle),
            transparent 0deg,
            transparent 300deg,
            rgba(255,106,0,0.9) 340deg,
            transparent 360deg
          );
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
                  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
          z-index: 1;
        }
        .twincap-card:hover::before {
          opacity: 1;
          animation: twincap-shine 2.4s linear infinite;
        }
        @keyframes twincap-shine {
          to { --twincap-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .twincap-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Core capabilities"
        top="Eight dimensions"
        bottom="Of one physical thing."
        size="compact"
        width="wide"
        body="The RAMS 8D framework is what separates a model of a building from a model of an operation. Ask the same rack eight questions and you get eight answers, all of them about the same object."
      />

      {/* ── the 8D tool ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="overflow-hidden"
        style={{
          borderRadius: 16,
          background: "#FFFFFF",
          border: "1px solid #E4E4E9",
          boxShadow: "0 40px 90px -40px rgba(14,14,15,0.2)",
        }}
      >
        <div
          className="flex items-center gap-3 px-5 py-3.5 flex-wrap"
          style={{ borderBottom: "1px solid #ECEDF1", background: "#FAFAFB" }}
        >
          <span className="text-[14px] font-semibold text-carbon tracking-[-0.01em]">
            8D record
          </span>
          <span
            className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold text-graphite/60"
            style={{ background: "#F1F1F4", border: "1px solid #E4E4E9" }}
          >
            {ASSET}
          </span>
          <span className="ml-auto text-[10px] font-mono font-semibold tracking-[0.12em] uppercase text-signal-orange">
            Dimension {d.n} / 08
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr]">
          {/* the eight */}
          <div
            className="flex lg:flex-col gap-px overflow-x-auto"
            style={{ background: "#ECEDF1" }}
          >
            {DIMENSIONS.map((x, n) => {
              const active = n === i;
              return (
                <button
                  key={x.key}
                  type="button"
                  onClick={() => setI(n)}
                  className="relative text-left px-4 sm:px-5 py-3.5 shrink-0 lg:shrink transition-colors duration-250 min-w-[142px]"
                  style={{ background: active ? "#FFFFFF" : "#FAFAFB" }}
                >
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 bottom-0 w-[2px] hidden lg:block transition-colors duration-250"
                    style={{ background: active ? "#FF6A00" : "transparent" }}
                  />
                  <span className="flex items-baseline gap-2.5">
                    <span className="text-[10px] font-mono font-bold tracking-[0.14em] text-graphite/35 tabular-nums">
                      {x.n}
                    </span>
                    <span
                      className={
                        "text-[12.5px] font-semibold tracking-[-0.01em] " +
                        (active ? "text-carbon" : "text-graphite/55")
                      }
                    >
                      {x.label}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* the answer */}
          <div className="px-6 sm:px-8 py-7 sm:py-9 min-h-[360px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={d.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <p className="text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
                  {d.n} · {d.label}
                </p>
                <h3 className="mt-3 text-[26px] sm:text-[32px] font-bold leading-[1.15] tracking-[-0.025em] text-carbon">
                  {d.q}
                </h3>
                <p className="mt-4 text-[14.5px] leading-[1.6] text-graphite/65 max-w-[62ch]">
                  {d.body}
                </p>

                <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-x-10">
                  {d.rows.map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-center justify-between gap-4 py-2.5"
                      style={{ borderBottom: "1px solid #ECEDF1" }}
                    >
                      <span className="text-[11.5px] text-graphite/50">
                        {k}
                      </span>
                      <span className="text-[11.5px] font-semibold text-carbon text-right tabular-nums">
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* ── the six groups ──────────────────────────────── */}
      <div className="mt-16 sm:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {GROUPS.map((g, n) => (
          <motion.div
            key={g.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: (n % 3) * 0.08, ease: EASE }}
            className="twincap-card group p-7 flex flex-col transition-transform duration-300 hover:-translate-y-1"
            style={{
              minHeight: 250,
              borderRadius: 12,
              background: "#FFFFFF",
              border: "1px solid #E8E8ED",
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
            }}
          >
            <g.icon
              className="w-5 h-5 text-signal-orange"
              strokeWidth={1.6}
              aria-hidden
            />
            <h3 className="mt-6 text-[19px] font-bold leading-[1.2] tracking-[-0.02em] text-carbon">
              {g.title}
            </h3>
            <p className="mt-3 text-[14px] leading-[1.6] text-graphite/65">
              {g.body}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
