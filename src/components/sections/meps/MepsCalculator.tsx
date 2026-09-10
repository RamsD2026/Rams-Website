"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Scenario calculator.
 *
 * A working calculator, not a picture of one. The arithmetic is the source
 * document's, unchanged:
 *
 *   hours    = fleet × shifts × days × (minutes ÷ 60)
 *   machines = hours ÷ (shifts × days × productive hours)
 *   value    = machines × cost per month × 12
 *
 * Every figure is the reader's own — the section says so, and the assumptions
 * line under the results restates whatever they entered. Nothing here is a
 * RAMS estimate, and the copy is careful never to imply otherwise.
 *
 * Indian digit grouping is done by hand rather than through
 * toLocaleString("en-IN"): Node and the browser can disagree on ICU data,
 * which would hydrate as a mismatch.
 */

/**
 * The calculator runs on either ground.
 *
 * It was written for the MEPS page, which is dark, and it is now also the
 * whole of `/roi-calculator`, which is not. Rather than a second copy that
 * has to keep agreeing with this one, the colours are a table and the tone is
 * a prop — dark by default, so the MEPS page is unaffected if it ever picks
 * the section back up.
 *
 * Only the surface changes. The arithmetic, the fields, the wording and the
 * "indicative only" line are the same on both.
 */
type Tone = "dark" | "light";

const PALETTE = {
  dark: {
    surface: "darkMid" as const,
    hair: "rgba(255,255,255,0.10)",
    panel: "rgba(255,255,255,0.03)",
    label: "text-white/40",
    field: "text-white/60",
    value: "text-white",
    note: "text-white/50",
    unit: "text-white/45",
    fine: "text-white/35",
    input: "rgba(255,255,255,0.04)",
    inputText: "text-white placeholder:text-white/25",
    resultPanel: "#0E0E11",
    resultBorder: "1px solid rgba(255,106,0,0.22)",
    resultShadow: "0 40px 90px -50px rgba(0,0,0,0.7)",
    track: "rgba(255,255,255,0.12)",
    thumbShadow: "0 2px 8px rgba(0,0,0,0.45)",
  },
  light: {
    surface: "white" as const,
    hair: "#E0E0E6",
    panel: "#FFFFFF",
    label: "text-graphite/40",
    field: "text-graphite/65",
    value: "text-carbon",
    note: "text-graphite/60",
    unit: "text-graphite/50",
    fine: "text-graphite/45",
    input: "#FFFFFF",
    inputText: "text-carbon placeholder:text-graphite/35",
    resultPanel: "linear-gradient(180deg, #FFF6EF 0%, #FFFFFF 100%)",
    resultBorder: "1px solid #FFD9BC",
    resultShadow: "0 30px 70px -46px rgba(8,8,10,0.35)",
    track: "rgba(14,14,15,0.12)",
    thumbShadow: "0 2px 8px rgba(8,8,10,0.20)",
  },
};

function fmtIN(n: number) {
  const s = Math.round(n).toString();
  if (s.length <= 3) return s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3;
}

const FIELDS = [
  { k: "fleet", label: "Number of MHEs", min: 5, max: 120, step: 1 },
  { k: "shifts", label: "Shifts per day", min: 1, max: 3, step: 1 },
  { k: "days", label: "Operating days per year", min: 200, max: 365, step: 5 },
  {
    k: "prod",
    label: "Productive hours per MHE per shift",
    min: 2,
    max: 8,
    step: 0.5,
  },
  {
    k: "empty",
    label: "Empty travel — your estimate",
    min: 10,
    max: 60,
    step: 1,
  },
  {
    k: "mins",
    label: "Minutes you believe could be recovered, per MHE per shift",
    min: 0,
    max: 60,
    step: 1,
  },
] as const;

type Key = (typeof FIELDS)[number]["k"];

function Result({
  label,
  value,
  unit,
  note,
  c,
}: {
  label: string;
  value: string;
  unit?: string;
  note: string;
  c: (typeof PALETTE)[Tone];
}) {
  return (
    <div className="pt-5" style={{ borderTop: `1px solid ${c.hair}` }}>
      <p
        className={
          "text-[10.5px] font-mono tracking-[0.12em] uppercase " + c.label
        }
      >
        {label}
      </p>
      <p className="mt-2 flex items-baseline gap-2 flex-wrap">
        <span
          className={
            "font-rams-heading text-[26px] sm:text-[32px] font-bold tracking-[-0.035em] tabular-nums leading-none " +
            c.value
          }
        >
          {value}
        </span>
        {unit && (
          <span className={"text-[12px] leading-none " + c.unit}>{unit}</span>
        )}
      </p>
      <p className={"mt-2.5 text-[12.5px] leading-[1.6] " + c.note}>{note}</p>
    </div>
  );
}

export function MepsCalculator({ tone = "dark" }: { tone?: Tone } = {}) {
  const c = PALETTE[tone];
  const [v, setV] = useState<Record<Key, number>>({
    fleet: 25,
    shifts: 2,
    days: 300,
    prod: 5,
    empty: 40,
    mins: 15,
  });
  const [cost, setCost] = useState("");

  const set = (k: Key, n: number) => setV((p) => ({ ...p, [k]: n }));

  const hours = v.fleet * v.shifts * v.days * (v.mins / 60);
  const perMachineYear = v.shifts * v.days * v.prod;
  const machines = perMachineYear > 0 ? hours / perMachineYear : 0;

  const costNum = parseFloat(cost);
  const showCost = costNum > 0;
  const annual = machines * costNum * 12;

  const shown = (k: Key) =>
    k === "prod"
      ? v.prod.toFixed(1)
      : k === "empty"
        ? `${v.empty}%`
        : String(v[k]);

  return (
    <Section surface={c.surface} id="roi">
      <style>{`
        .meps-range {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 4px;
          border-radius: 999px;
          outline: none;
          cursor: pointer;
          background: linear-gradient(
            90deg,
            #FF6A00 var(--fill),
            var(--track) var(--fill)
          );
        }
        .meps-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 2px solid #FF6A00;
          box-shadow: var(--thumb-shadow);
          cursor: pointer;
        }
        .meps-range::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 2px solid #FF6A00;
          box-shadow: var(--thumb-shadow);
          cursor: pointer;
        }
        .meps-range:focus-visible {
          box-shadow: 0 0 0 3px rgba(255,106,0,0.35);
        }
      `}</style>

      <SectionHeader
        eyebrow="Scenario calculator"
        top="Test the opportunity"
        bottom="against your own assumptions."
        body="Every value below is yours to set. MEPS does not supply the improvement figures — it supplies the measurement that tells you whether your assumption was right."
        tone={tone}
        size="compact"
        width="wide"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ── your operation ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="px-5 py-6 sm:px-7 sm:py-7"
          style={{
            borderRadius: 14,
            background: c.panel,
            border: `1px solid ${c.hair}`,
          }}
        >
          <p
            className={
              "text-[10px] font-mono font-bold tracking-[0.2em] uppercase mb-6 " +
              c.label
            }
          >
            Your operation
          </p>

          <div className="flex flex-col gap-5">
            {FIELDS.map((f) => {
              const pct = ((v[f.k] - f.min) / (f.max - f.min)) * 100;
              return (
                <div key={f.k}>
                  <label
                    htmlFor={`calc-${f.k}`}
                    className="flex items-baseline justify-between gap-4 mb-2.5"
                  >
                    <span className={"text-[13px] leading-[1.4] " + c.field}>
                      {f.label}
                    </span>
                    <span className="text-[14px] font-mono font-bold tabular-nums text-signal-orange shrink-0">
                      {shown(f.k)}
                    </span>
                  </label>
                  <input
                    id={`calc-${f.k}`}
                    type="range"
                    className="meps-range"
                    min={f.min}
                    max={f.max}
                    step={f.step}
                    value={v[f.k]}
                    onChange={(e) => set(f.k, Number(e.target.value))}
                    style={
                      {
                        "--fill": `${pct}%`,
                        "--track": c.track,
                        "--thumb-shadow": c.thumbShadow,
                      } as React.CSSProperties
                    }
                  />
                </div>
              );
            })}

            <div className="pt-5" style={{ borderTop: `1px solid ${c.hair}` }}>
              <label
                htmlFor="calc-cost"
                className={"block text-[13px] leading-[1.4] mb-2.5 " + c.field}
              >
                Your cost per MHE per month (optional, ₹)
              </label>
              <input
                id="calc-cost"
                type="number"
                inputMode="numeric"
                min={0}
                step={1000}
                placeholder="e.g. 45000"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className={
                  "w-full px-3.5 py-2.5 text-[13.5px] font-mono tabular-nums outline-none focus:border-signal-orange/50 transition-colors " +
                  c.inputText
                }
                style={{
                  borderRadius: 9,
                  background: c.input,
                  border: `1px solid ${c.hair}`,
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* ── what that would mean ────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="relative overflow-hidden px-5 py-6 sm:px-7 sm:py-7"
          style={{
            borderRadius: 14,
            background: c.resultPanel,
            border: c.resultBorder,
            boxShadow: c.resultShadow,
          }}
        >
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,106,0,0.55), transparent)",
            }}
          />

          <p className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange mb-6">
            What that would mean
          </p>

          <div className="flex flex-col gap-5">
            <Result
              c={c}
              label="Machine-hours recovered per year"
              value={fmtIN(hours)}
              unit="hours"
              note="Across the whole fleet, at the recovery you entered."
            />
            <Result
              c={c}
              label="Equivalent annual capacity"
              value={machines.toFixed(1)}
              unit="machines’ worth"
              note="Capacity you may already own, expressed as machines — before adding any."
            />
            <Result
              c={c}
              label="Travel currently carrying nothing"
              value={String(v.empty)}
              unit="% of fleet travel"
              note="Your estimate. MEPS measures the real figure once Pallet Detection is deployed."
            />
            {showCost && (
              <Result
                c={c}
                label="At the rate you entered"
                value={
                  annual >= 1e7
                    ? `₹${(annual / 1e7).toFixed(2)}`
                    : `₹${(annual / 1e5).toFixed(1)}`
                }
                unit={annual >= 1e7 ? "Cr / year" : "Lakh / year"}
                note="Annual value of that capacity, using your own cost per MHE. Not a RAMS estimate."
              />
            )}
          </div>

          <p
            className={"mt-7 pt-5 text-[11.5px] leading-[1.65] " + c.fine}
            style={{ borderTop: `1px solid ${c.hair}` }}
          >
            Assumptions: {v.fleet} MHEs · {v.shifts} shift
            {v.shifts > 1 ? "s" : ""} · {v.days} days · {v.prod.toFixed(1)}{" "}
            productive hours per shift · {v.mins} min recovered per MHE per
            shift
            {showCost ? ` · ₹${fmtIN(costNum)} per MHE per month` : ""}.
            Indicative only — not a guarantee of savings, fleet reduction or
            productivity improvement.
          </p>
        </motion.div>
      </div>
    </Section>
  );
}
