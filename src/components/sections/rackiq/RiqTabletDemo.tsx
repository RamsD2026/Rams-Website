"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { EASE, RAG } from "./rackiq-shared";

/**
 * The RAMS tablet inspection application, on the warehouse floor.
 *
 * Five steps — Identify, Inspect, Capture, Measure, Save. Auto-advances until
 * the visitor takes over, then stays where they put it.
 */

const STEPS = [
  { key: "identify", label: "Identify" },
  { key: "inspect", label: "Inspect" },
  { key: "capture", label: "Capture" },
  { key: "measure", label: "Measure" },
  { key: "save", label: "Save" },
] as const;

const STEP_MS = 3800;

const HIERARCHY = [
  { k: "Warehouse", v: "WH-01 · Bhiwandi West" },
  { k: "Area", v: "Area B" },
  { k: "Aisle", v: "Aisle 07" },
  { k: "Rack", v: "R07" },
  { k: "Bay", v: "Bay 14" },
  { k: "Level", v: "Level 3" },
  { k: "Component", v: "Upright U-07-14" },
];

const ELEMENTS = [
  { n: "Uprights", s: "issue" },
  { n: "Bracing", s: "ok" },
  { n: "Beams", s: "ok" },
  { n: "Connections", s: "ok" },
  { n: "Safety locks", s: "warn" },
  { n: "Baseplates", s: "ok" },
  { n: "Anchors", s: "ok" },
  { n: "Rack protection", s: "warn" },
  { n: "Geometry", s: "pending" },
  { n: "Plumbness", s: "pending" },
] as const;

const DOWNSTREAM = [
  "Digital Twin",
  "Engineering",
  "Report",
  "Bill of Quantity",
  "Call to Action",
  "History",
];

export function RiqTabletDemo() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    if (reduce || manual) return;
    const id = setInterval(
      () => setStep((s) => (s + 1) % STEPS.length),
      STEP_MS
    );
    return () => clearInterval(id);
  }, [reduce, manual]);

  const pick = (i: number) => {
    setManual(true);
    setStep(i);
  };

  return (
    <div>
      {/* ── device ──────────────────────────────────────── */}
      <div
        className="relative mx-auto w-full max-w-[720px] p-2.5 sm:p-3"
        style={{
          borderRadius: 26,
          background: "linear-gradient(160deg, #26262A 0%, #131316 100%)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow:
            "0 50px 100px -40px rgba(0,0,0,0.75), 0 0 0 1px rgba(0,0,0,0.4)",
        }}
      >
        <div
          className="relative overflow-hidden"
          style={{ borderRadius: 16, background: "#FFFFFF" }}
        >
          {/* app bar */}
          <div
            className="flex items-center justify-between gap-3 px-4 py-3"
            style={{ borderBottom: "1px solid #ECEDF1", background: "#FAFAFB" }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                style={{ background: "#2F6BFF" }}
              >
                <span className="w-2.5 h-2.5 rounded-[2px] border-[1.5px] border-white" />
              </span>
              <span className="text-[12px] font-semibold text-carbon truncate">
                IRDS Inspection
              </span>
            </div>
            <span className="flex items-center gap-2 shrink-0">
              <span className="text-[9.5px] font-mono font-bold tracking-[0.12em] uppercase text-graphite/40">
                Offline ready
              </span>
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: RAG.green.app }}
              />
            </span>
          </div>

          {/* breadcrumb */}
          <div
            className="px-4 py-2 flex items-center gap-1.5 flex-wrap"
            style={{ borderBottom: "1px solid #F1F2F5" }}
          >
            {["WH-01", "Area B", "A07", "R07", "B14", "L3"].map((b, i) => (
              <span key={b} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span className="text-graphite/25 text-[10px]">/</span>
                )}
                <span
                  className={
                    "text-[10.5px] font-mono " +
                    (i === 5
                      ? "font-bold text-signal-orange"
                      : "text-graphite/50")
                  }
                >
                  {b}
                </span>
              </span>
            ))}
          </div>

          {/* screen */}
          <div className="relative h-[318px] sm:h-[342px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={STEPS[step].key}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.32, ease: EASE }}
                className="absolute inset-0 p-4 overflow-hidden"
              >
                {step === 0 && <Identify />}
                {step === 1 && <Inspect />}
                {step === 2 && <Capture />}
                {step === 3 && <Measure />}
                {step === 4 && <Saved />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── step rail ───────────────────────────────────── */}
      <div className="mt-7 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
        {STEPS.map((s, i) => (
          <span key={s.key} className="flex items-center gap-1.5 sm:gap-2">
            {i > 0 && (
              <span
                className="w-3 sm:w-6 h-px transition-colors duration-300"
                style={{ background: i <= step ? "#FF6A00" : "#DCDDE3" }}
              />
            )}
            <button
              type="button"
              onClick={() => pick(i)}
              aria-current={i === step}
              className={
                "px-3 py-1.5 rounded-full text-[10.5px] font-mono font-bold tracking-[0.12em] uppercase transition-all duration-200 " +
                (i === step
                  ? "text-signal-orange"
                  : "text-graphite/45 hover:text-carbon")
              }
              style={{
                background: i === step ? "rgba(255,106,0,0.08)" : "#FFFFFF",
                border: `1px solid ${
                  i === step ? "rgba(255,106,0,0.28)" : "#E4E6EC"
                }`,
              }}
            >
              {s.label}
            </button>
          </span>
        ))}
      </div>

      <p className="mt-6 text-[9.5px] font-mono tracking-[0.12em] uppercase text-graphite/30 text-center">
        Illustrative UI
      </p>
    </div>
  );
}

/* ── screens ───────────────────────────────────────────── */

function ScreenTitle({ children, hint }: { children: string; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 mb-3">
      <p className="text-[13px] font-semibold text-carbon">{children}</p>
      {hint && (
        <span className="text-[10px] font-mono font-semibold tracking-[0.1em] uppercase text-graphite/40">
          {hint}
        </span>
      )}
    </div>
  );
}

function Identify() {
  return (
    <>
      <ScreenTitle hint="Scan or select">Identify the asset</ScreenTitle>
      <div className="flex gap-3">
        <div className="flex-1 min-w-0 flex flex-col">
          {HIERARCHY.map((h, i) => (
            <span
              key={h.k}
              className="flex items-center justify-between gap-3 py-[7px]"
              style={{ borderTop: i === 0 ? undefined : "1px solid #F1F2F5" }}
            >
              <span className="text-[10.5px] font-mono tracking-[0.08em] uppercase text-graphite/40 shrink-0">
                {h.k}
              </span>
              <span
                className={
                  "text-[11.5px] truncate " +
                  (i === HIERARCHY.length - 1
                    ? "font-semibold text-signal-orange"
                    : "font-medium text-carbon")
                }
              >
                {h.v}
              </span>
            </span>
          ))}
        </div>
        <div
          className="w-[104px] shrink-0 flex flex-col items-center justify-center gap-2 rounded-xl"
          style={{ background: "#F7F8FA", border: "1px solid #ECEDF1" }}
        >
          <svg viewBox="0 0 40 40" className="w-11 h-11" aria-hidden>
            <rect x="4" y="4" width="12" height="12" rx="2" fill="none" stroke="#0E0E0F" strokeWidth="2.4" />
            <rect x="24" y="4" width="12" height="12" rx="2" fill="none" stroke="#0E0E0F" strokeWidth="2.4" />
            <rect x="4" y="24" width="12" height="12" rx="2" fill="none" stroke="#0E0E0F" strokeWidth="2.4" />
            <rect x="24" y="24" width="5" height="5" fill="#0E0E0F" />
            <rect x="31" y="31" width="5" height="5" fill="#0E0E0F" />
          </svg>
          <span className="text-[9.5px] font-mono font-bold tracking-[0.1em] uppercase text-graphite/50 text-center px-2">
            Scan rack QR
          </span>
        </div>
      </div>
    </>
  );
}

function Inspect() {
  const dot = (s: string) =>
    s === "issue"
      ? RAG.red.app
      : s === "warn"
        ? RAG.amber.app
        : s === "ok"
          ? RAG.green.app
          : "#C9CCD4";
  return (
    <>
      <ScreenTitle hint="10 elements">Guided element check</ScreenTitle>
      <div className="grid grid-cols-2 gap-x-3 gap-y-0">
        {ELEMENTS.map((e, i) => (
          <span
            key={e.n}
            className="flex items-center justify-between gap-2 py-[8px]"
            style={{ borderTop: i > 1 ? "1px solid #F1F2F5" : undefined }}
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: dot(e.s) }}
              />
              <span
                className={
                  "text-[11.5px] truncate " +
                  (e.s === "pending"
                    ? "text-graphite/40"
                    : "text-carbon font-medium")
                }
              >
                {e.n}
              </span>
            </span>
            <span className="text-[9.5px] font-mono font-bold tracking-[0.08em] uppercase text-graphite/35 shrink-0">
              {e.s === "pending" ? "—" : e.s === "issue" ? "1 found" : "ok"}
            </span>
          </span>
        ))}
      </div>
    </>
  );
}

function Capture() {
  return (
    <>
      <ScreenTitle hint="Upright U-07-14">Record the finding</ScreenTitle>
      <div className="flex gap-3">
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          {[
            ["Component", "Upright — front, aisle side"],
            ["Finding", "Upright bent — impact"],
            ["Observation", "Deformation at 320 mm from base"],
          ].map(([k, v]) => (
            <span key={k} className="flex flex-col gap-1">
              <span className="text-[9.5px] font-mono font-bold tracking-[0.1em] uppercase text-graphite/40">
                {k}
              </span>
              <span
                className="px-2.5 py-2 rounded-lg text-[11.5px] text-carbon"
                style={{ background: "#F7F8FA", border: "1px solid #ECEDF1" }}
              >
                {v}
              </span>
            </span>
          ))}
        </div>
        <div className="w-[112px] shrink-0 flex flex-col gap-2">
          <span className="text-[9.5px] font-mono font-bold tracking-[0.1em] uppercase text-graphite/40">
            Photos · 3
          </span>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-[62px] rounded-lg flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, #EDEFF3 0%, #E2E5EB 100%)",
                border: "1px solid #E4E6EC",
              }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 opacity-30" aria-hidden>
                <path
                  d="M3 7h4l2-2h6l2 2h4v12H3z"
                  fill="none"
                  stroke="#0E0E0F"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="13" r="3.2" fill="none" stroke="#0E0E0F" strokeWidth="1.6" />
              </svg>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

function Measure() {
  return (
    <>
      <ScreenTitle hint="Integrity test">Enter the measurement</ScreenTitle>
      <div
        className="rounded-xl p-3.5"
        style={{ background: "#F7F8FA", border: "1px solid #ECEDF1" }}
      >
        <p className="text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase text-graphite/45 mb-3">
          Plumbness · front upright
        </p>
        <div className="flex items-end gap-6">
          <span className="flex flex-col">
            <span className="text-[9.5px] font-mono tracking-[0.08em] uppercase text-graphite/40 mb-1">
              Measured
            </span>
            <span
              className="text-[30px] font-bold tabular-nums leading-none"
              style={{ color: RAG.red.app }}
            >
              14.2
              <span className="text-[13px] font-semibold ml-1">mm</span>
            </span>
          </span>
          <span className="flex flex-col">
            <span className="text-[9.5px] font-mono tracking-[0.08em] uppercase text-graphite/40 mb-1">
              Configured limit
            </span>
            <span className="text-[30px] font-bold tabular-nums leading-none text-carbon">
              10.0
              <span className="text-[13px] font-semibold ml-1">mm</span>
            </span>
          </span>
        </div>

        {/* scale */}
        <div className="mt-4 relative h-1.5 rounded-full" style={{ background: "#E4E6EC" }}>
          <span
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ width: "69%", background: RAG.green.app, opacity: 0.55 }}
          />
          <span
            className="absolute top-1/2 -translate-y-1/2 w-px h-3"
            style={{ left: "60%", background: "#0E0E0F" }}
          />
          <motion.span
            className="absolute top-1/2 w-3 h-3 rounded-full border-2 border-white"
            style={{ background: RAG.red.app, marginTop: -6 }}
            initial={{ left: "0%" }}
            animate={{ left: "84%" }}
            transition={{ duration: 0.9, ease: EASE }}
          />
        </div>
        <div className="mt-2.5 flex items-center justify-between">
          <span className="text-[9.5px] font-mono tracking-[0.08em] uppercase text-graphite/40">
            Limit at 10.0 mm
          </span>
          <span
            className="px-2 py-[3px] rounded-full text-[9.5px] font-mono font-bold tracking-[0.1em] uppercase"
            style={{ background: RAG.red.appBg, color: RAG.red.app }}
          >
            Outside limit
          </span>
        </div>
      </div>
    </>
  );
}

function Saved() {
  return (
    <>
      <ScreenTitle hint="Synced">Save to Rack Record</ScreenTitle>
      <div
        className="rounded-xl px-4 py-4 mb-3 flex items-center gap-3"
        style={{ background: RAG.green.appBg, border: `1px solid ${RAG.green.app}33` }}
      >
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: RAG.green.app }}
        >
          <svg viewBox="0 0 16 16" className="w-4 h-4" aria-hidden>
            <path
              d="M3.5 8.5 6.5 11.5 12.5 5"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="min-w-0">
          <span className="block text-[12.5px] font-semibold text-carbon">
            Finding F-2417 written to RACK-A07-B14
          </span>
          <span className="block text-[11px] text-graphite/55 mt-0.5">
            Photos, observation, measurement and location attached
          </span>
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {DOWNSTREAM.slice(0, 6).map((d) => (
          <span
            key={d}
            className="px-2.5 py-2 rounded-lg text-[10.5px] font-medium text-graphite/65 text-center"
            style={{ background: "#F7F8FA", border: "1px solid #ECEDF1" }}
          >
            {d}
          </span>
        ))}
      </div>
    </>
  );
}
