"use client";

import { motion } from "framer-motion";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 07 — Use cases.
 *
 * Six things teams actually do on the twin, each with the screen they do it
 * on. The mockups are drawn rather than screenshotted: they are small enough
 * that a real capture would be unreadable at this size, and every one of them
 * is a simplification of a panel that appears full size elsewhere on the page.
 *
 * Card geometry is the site standard — 12px radius, #E8E8ED hairline, the
 * two-part shadow, a 19px bold title. The shine variable is namespaced
 * `twinuc` so it cannot collide with the capabilities grid.
 */

const HAIR = "#ECEDF1";

/* ── the six mockups ─────────────────────────────────────── */

function Mock({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="h-[132px] p-3.5 overflow-hidden"
      style={{ background: "#FAFAFB", borderBottom: `1px solid ${HAIR}` }}
    >
      {children}
    </div>
  );
}

function SimMock() {
  return (
    <div className="flex gap-2.5 h-full">
      {[
        ["Current", "#D8D8DE", 6],
        ["Proposed", "#FF6A00", 7],
      ].map(([label, colour, cols]) => (
        <div
          key={String(label)}
          className="flex-1 rounded-md p-2.5 flex flex-col"
          style={{ background: "#FFFFFF", border: `1px solid ${HAIR}` }}
        >
          <span className="text-[8px] font-mono font-bold tracking-[0.14em] uppercase text-graphite/40">
            {label}
          </span>
          <div className="mt-2 grid grid-cols-7 gap-[3px] flex-1 content-start">
            {Array.from({ length: 21 }, (_, i) => (
              <span
                key={i}
                className="h-[9px] rounded-[1.5px]"
                style={{
                  background:
                    i % 7 < (cols as number) ? (colour as string) : "transparent",
                  opacity: i % 7 < (cols as number) ? 0.7 : 0,
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function LifecycleMock() {
  const stages = ["Install", "Inspect", "Repair", "Replace"];
  return (
    <div className="h-full flex flex-col justify-center">
      <div className="relative">
        <span
          className="absolute left-0 right-0 top-[5px] h-px"
          style={{ background: "#E0E0E6" }}
        />
        <div className="relative flex justify-between">
          {stages.map((s, i) => (
            <span key={s} className="flex flex-col items-center gap-2 w-[52px]">
              <span
                className="w-[11px] h-[11px] rounded-full"
                style={{
                  background: i === 2 ? "#FF6A00" : "#FFFFFF",
                  border: `2px solid ${i === 2 ? "#FF6A00" : "#D0D0D8"}`,
                }}
              />
              <span className="text-[8px] font-mono font-bold tracking-[0.1em] uppercase text-graphite/45">
                {s}
              </span>
            </span>
          ))}
        </div>
      </div>
      <div
        className="mt-5 rounded-md px-2.5 py-2"
        style={{ background: "#FFFFFF", border: `1px solid ${HAIR}` }}
      >
        <span className="block text-[9px] font-semibold text-carbon">
          RCK-A3-C07 · beam replaced
        </span>
        <span className="block mt-0.5 text-[8.5px] font-mono text-graphite/45">
          02 Feb 2025 · 37 states retained
        </span>
      </div>
    </div>
  );
}

function LiveMock() {
  const rows = [
    ["09:42", "Impact · A3-C07", "#DC2626"],
    ["09:38", "Speed · walkway W1", "#E08700"],
    ["09:36", "Dock 3 opened", "#33363A"],
  ] as const;
  return (
    <div className="h-full flex flex-col justify-center gap-1.5">
      {rows.map(([t, what, colour]) => (
        <div
          key={t}
          className="flex items-center gap-2.5 rounded-md px-2.5 py-2"
          style={{ background: "#FFFFFF", border: `1px solid ${HAIR}` }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: colour }}
          />
          <span className="text-[8.5px] font-mono text-graphite/40 tabular-nums">
            {t}
          </span>
          <span className="text-[9.5px] font-semibold truncate" style={{ color: colour }}>
            {what}
          </span>
        </div>
      ))}
    </div>
  );
}

function EfficiencyMock() {
  const bars = [42, 58, 51, 67, 74, 63, 81, 88];
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-baseline justify-between">
        <span className="text-[8px] font-mono font-bold tracking-[0.14em] uppercase text-graphite/40">
          Travel per pick
        </span>
        <span className="text-[9px] font-semibold tabular-nums text-[#16A34A]">
          ↓ 18%
        </span>
      </div>
      <div className="mt-auto flex items-end gap-1.5 h-[74px]">
        {bars.map((v, i) => (
          <span
            key={i}
            className="flex-1 rounded-t-[2px]"
            style={{
              height: `${v}%`,
              background: i === bars.length - 1 ? "#FF6A00" : "#D8D8DE",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function PlanningMock() {
  return (
    <div className="h-full flex items-center">
      <div
        className="w-full rounded-md p-2.5"
        style={{ background: "#FFFFFF", border: `1px solid ${HAIR}` }}
      >
        <div className="grid grid-cols-10 gap-[3px]">
          {Array.from({ length: 40 }, (_, i) => {
            const expansion = i % 10 >= 7 && i >= 10;
            return (
              <span
                key={i}
                className="h-[13px] rounded-[1.5px]"
                style={{
                  background: expansion ? "rgba(255,106,0,0.22)" : "#EDEDF1",
                  border: expansion ? "1px dashed rgba(255,106,0,0.6)" : "none",
                }}
              />
            );
          })}
        </div>
        <div className="mt-2.5 flex items-center justify-between">
          <span className="text-[8px] font-mono font-bold tracking-[0.12em] uppercase text-graphite/40">
            Phase 2 · +9 bays
          </span>
          <span className="text-[8px] font-mono font-bold tracking-[0.12em] uppercase text-signal-orange">
            Clearance OK
          </span>
        </div>
      </div>
    </div>
  );
}

function CustomMock() {
  const mods = ["Rack safety", "MHE diagnostics", "Inventory", "Your module"];
  return (
    <div className="h-full flex flex-col justify-center gap-1.5">
      {mods.map((m, i) => {
        const own = i === mods.length - 1;
        return (
          <div
            key={m}
            className="flex items-center gap-2.5 rounded-md px-2.5 py-[7px]"
            style={{
              background: "#FFFFFF",
              border: own ? "1px dashed rgba(255,106,0,0.55)" : `1px solid ${HAIR}`,
            }}
          >
            <span
              className="w-[9px] h-[9px] rounded-[2px] shrink-0"
              style={{ background: own ? "#FF6A00" : "#D0D0D8" }}
            />
            <span
              className={
                "text-[9.5px] font-semibold " +
                (own ? "text-signal-orange" : "text-graphite/60")
              }
            >
              {m}
            </span>
            <span className="ml-auto text-[8px] font-mono tracking-[0.1em] uppercase text-graphite/35">
              reads twin
            </span>
          </div>
        );
      })}
    </div>
  );
}

const CASES = [
  {
    tag: "Simulation",
    title: "Test a layout before you build it",
    body: "Narrow an aisle, add a rack run, move a dock. The twin answers with clearance, reach and flow — before anything is bolted down.",
    mock: <SimMock />,
  },
  {
    tag: "Lifecycle",
    title: "Manage assets across their whole life",
    body: "Install, inspect, repair, reconfigure, replace. Each event lands on the asset record and stays there, so condition is a history rather than a snapshot.",
    mock: <LifecycleMock />,
  },
  {
    tag: "Live ops",
    title: "Run the shift from one view",
    body: "Movement, alerts, tasks and dock state in the place they are happening, so the floor team and the control room are looking at the same thing.",
    mock: <LiveMock />,
  },
  {
    tag: "Efficiency",
    title: "Find the travel nobody budgeted for",
    body: "Routes, dwell, re-handling and congestion measured against the actual building — the metres you are paying for but never see in a report.",
    mock: <EfficiencyMock />,
  },
  {
    tag: "Planning",
    title: "Phase an expansion with evidence",
    body: "Model the next phase against the current one. Capacity gained, clearance kept, disruption scoped, all before the capex request.",
    mock: <PlanningMock />,
  },
  {
    tag: "Custom",
    title: "Build your own application on it",
    body: "Every RAMS module reads the twin through the same interfaces yours would. If you need something we do not ship, build it on the same foundation.",
    mock: <CustomMock />,
  },
];

export function TwinUseCases() {
  return (
    <Section surface="offWhite" id="usecases">
      <style>{`
        @property --twinuc-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .twinuc-card { position: relative; isolation: isolate; }
        .twinuc-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--twinuc-shine-angle),
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
        .twinuc-card:hover::before {
          opacity: 1;
          animation: twinuc-shine 2.4s linear infinite;
        }
        @keyframes twinuc-shine {
          to { --twinuc-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .twinuc-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Use cases"
        top="What teams accomplish"
        bottom="On the Digital Twin."
        size="compact"
        width="wide"
        body="Six starting points. None of them needs the others to be in place first — the twin is worth having from the first asset you tag."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {CASES.map((c, i) => (
          <motion.div
            key={c.tag}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: EASE }}
            className="twinuc-card overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-1"
            style={{
              borderRadius: 12,
              background: "#FFFFFF",
              border: "1px solid #E8E8ED",
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
            }}
          >
            <Mock>{c.mock}</Mock>
            <div className="p-6 flex-1 flex flex-col">
              <span className="text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
                {c.tag}
              </span>
              <h3 className="mt-3.5 text-[19px] font-bold leading-[1.2] tracking-[-0.02em] text-carbon">
                {c.title}
              </h3>
              <p className="mt-3 text-[14px] leading-[1.6] text-graphite/65">
                {c.body}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
