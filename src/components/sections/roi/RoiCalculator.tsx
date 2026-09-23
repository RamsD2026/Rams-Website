"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import {
  CURRENCIES,
  MODULES,
  OPS_DEFAULT,
  OPS_FIELDS,
  SOURCES,
  fmtPlain,
  fmtShort,
  type CurrencyKey,
  type ModuleKey,
  type Ops,
} from "./roi-model";

/**
 * The ROI calculator.
 *
 * Seven levers, each one switchable, each one the reader's own numbers. The
 * arithmetic and the sourcing rules live in `roi-model.ts`; this file is the
 * surface.
 *
 * ── Why the levers switch off ───────────────────────────────────────
 * Not decoration. A calculator that adds seven savings together by default
 * produces an enormous figure for an operation that only has two of the seven
 * problems, and an enormous figure nobody believes is worth less than a small
 * one they do. Everything starts **off except the three most sites can check
 * against their own records** — rack damage, counting labour, and time lost
 * looking for stock. The rest are opted into deliberately.
 *
 * ── The result restates the input ───────────────────────────────────
 * Every enabled lever prints the assumptions it was given, under its own
 * number and again in the summary. The page cannot be screenshotted as a RAMS
 * promise, because the sentence next to the figure is the reader's own
 * sentence.
 *
 * ── One client boundary ─────────────────────────────────────────────
 * The route's hero and closing section stay server-rendered; this is the only
 * component on the page that needs state.
 */

const ON_BY_DEFAULT: ModuleKey[] = ["rack", "count", "search"];

export function RoiCalculator() {
  const [cur, setCur] = useState<CurrencyKey>("INR");
  const [ops, setOps] = useState<Ops>(OPS_DEFAULT);
  const [on, setOn] = useState<Record<string, boolean>>(
    Object.fromEntries(MODULES.map((m) => [m.key, ON_BY_DEFAULT.includes(m.key)])),
  );
  const [vals, setVals] = useState<Record<string, Record<string, number>>>(
    Object.fromEntries(MODULES.map((m) => [m.key, { ...m.defaults }])),
  );
  const [spend, setSpend] = useState<number>(0);

  const lakh = CURRENCIES[cur].lakh;
  const sym = CURRENCIES[cur].sym;
  const money = (n: number) => `${sym}${fmtPlain(n, lakh)}`;

  const rows = useMemo(
    () =>
      MODULES.map((m) => ({
        m,
        on: !!on[m.key],
        value: on[m.key] ? Math.max(0, m.value(vals[m.key], ops)) : 0,
      })),
    [on, vals, ops],
  );
  const total = rows.reduce((a, r) => a + r.value, 0);
  const big = fmtShort(total, cur);
  const enabled = rows.filter((r) => r.on);

  const paybackMonths = spend > 0 && total > 0 ? spend / (total / 12) : null;
  const multiple = spend > 0 ? total / spend : null;

  const set = (k: ModuleKey, f: string, n: number) =>
    setVals((p) => ({ ...p, [k]: { ...p[k], [f]: n } }));

  const reset = () => {
    setOps(OPS_DEFAULT);
    setOn(Object.fromEntries(MODULES.map((m) => [m.key, ON_BY_DEFAULT.includes(m.key)])));
    setVals(Object.fromEntries(MODULES.map((m) => [m.key, { ...m.defaults }])));
    setSpend(0);
  };

  return (
    <>
      {/* ── 01 the operation ───────────────────────────────────── */}
      <Section surface="white" id="roi">
        <div className="rams-container">
          <SectionHeader
            eyebrow="Step one"
            top="Describe the building."
            body="Five numbers. Everything after this is worked out from them, so it is worth getting these close."
            align="left"
          />

          <div className="mt-10 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-black/40">
              Currency
            </span>
            {(Object.keys(CURRENCIES) as CurrencyKey[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setCur(k)}
                aria-pressed={cur === k}
                className={
                  "px-3 py-1.5 rounded-full text-[12px] font-mono transition-colors border " +
                  (cur === k
                    ? "border-signal-orange text-signal-orange bg-signal-orange/5"
                    : "border-black/10 text-black/50 hover:border-black/25")
                }
              >
                {CURRENCIES[k].sym.trim()} {k}
              </button>
            ))}
            <span className="ml-1 text-[11px] text-black/35">
              Symbol only — nothing is converted.
            </span>
          </div>

          <div className="mt-8 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
            {OPS_FIELDS.map((f) => (
              <NumberField
                key={f.key}
                label={f.label}
                hint={f.hint}
                value={ops[f.key]}
                min={f.min}
                max={f.max}
                step={f.step}
                prefix={f.money ? sym : undefined}
                lakh={lakh}
                onChange={(n) => setOps((p) => ({ ...p, [f.key]: n }))}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* ── 02 the levers ──────────────────────────────────────── */}
      <Section surface="offWhite">
        <div className="rams-container">
          <SectionHeader
            eyebrow="Step two"
            top="Switch on what you actually have."
            body="Three are on to start with, because most sites can check them against their own records. Turn on the rest only where the problem is real — a total built from problems you do not have is not a number you can take to anyone."
            align="left"
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_360px] lg:items-start">
            <div className="grid gap-5">
              {rows.map(({ m, on: isOn, value }) => (
                <article
                  key={m.key}
                  className={
                    "rounded-2xl border bg-white transition-colors " +
                    (isOn ? "border-signal-orange/30" : "border-black/8")
                  }
                >
                  <div className="flex items-start gap-4 p-6">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isOn}
                      aria-label={`Include ${m.name}`}
                      onClick={() => setOn((p) => ({ ...p, [m.key]: !p[m.key] }))}
                      className={
                        "mt-1 shrink-0 w-11 h-6 rounded-full p-[3px] transition-colors " +
                        (isOn ? "bg-signal-orange" : "bg-black/15")
                      }
                    >
                      <span
                        className={
                          "block w-[18px] h-[18px] rounded-full bg-white transition-transform " +
                          (isOn ? "translate-x-[20px]" : "")
                        }
                      />
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <h3 className="text-[19px] font-semibold tracking-[-0.02em] text-black">
                          {m.name}
                        </h3>
                        <span
                          className={
                            "font-mono text-[15px] tabular-nums " +
                            (isOn ? "text-black" : "text-black/25")
                          }
                        >
                          {isOn ? `${money(Math.round(value))} / yr` : "—"}
                        </span>
                      </div>
                      <p className="mt-2 text-[14px] leading-[1.65] text-black/55">{m.blurb}</p>
                      <Link
                        href={m.href}
                        className="mt-2 inline-block text-[12px] font-mono uppercase tracking-[0.14em] text-signal-orange hover:underline"
                      >
                        {m.product}
                      </Link>

                      {isOn && (
                        <>
                          <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                            {m.fields.map((f) => (
                              <NumberField
                                key={f.key}
                                label={f.label}
                                hint={f.hint}
                                value={vals[m.key][f.key]}
                                min={f.min}
                                max={f.max}
                                step={f.step}
                                prefix={f.money ? sym : undefined}
                                suffix={f.pct ? "%" : undefined}
                                lakh={lakh}
                                onChange={(n) => set(m.key, f.key, n)}
                              />
                            ))}
                          </div>
                          <p className="mt-5 border-t border-black/8 pt-4 text-[12px] leading-[1.6] text-black/40">
                            Your assumption: {m.restate(vals[m.key], ops, money)}.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* ── the running total ──────────────────────────── */}
            <aside className="lg:sticky lg:top-28">
              <div className="rounded-2xl bg-[#0E0E11] p-7 text-white ring-1 ring-signal-orange/20">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
                  Annual opportunity
                </p>
                <p className="mt-3 flex items-baseline gap-2">
                  <span className="text-[40px] font-bold leading-none tracking-[-0.04em] tabular-nums">
                    {big.v}
                  </span>
                  {big.unit && <span className="text-[15px] text-white/50">{big.unit}</span>}
                </p>
                <p className="mt-1 text-[12px] text-white/35">
                  {enabled.length} of {MODULES.length} levers on
                </p>

                {enabled.length > 0 && (
                  <>
                    <div className="mt-6 flex h-2 overflow-hidden rounded-full bg-white/8">
                      {enabled.map((r, i) => (
                        <span
                          key={r.m.key}
                          style={{
                            width: `${total > 0 ? (r.value / total) * 100 : 0}%`,
                            background: i % 2 ? "rgba(255,106,0,0.55)" : "#FF6A00",
                          }}
                        />
                      ))}
                    </div>
                    <ul className="mt-5 space-y-2">
                      {[...enabled]
                        .sort((a, b) => b.value - a.value)
                        .map((r) => (
                          <li
                            key={r.m.key}
                            className="flex items-baseline justify-between gap-3 text-[12.5px]"
                          >
                            <span className="truncate text-white/55">{r.m.name}</span>
                            <span className="shrink-0 font-mono tabular-nums text-white/85">
                              {total > 0 ? Math.round((r.value / total) * 100) : 0}%
                            </span>
                          </li>
                        ))}
                    </ul>
                  </>
                )}

                <div className="mt-7 border-t border-white/10 pt-6">
                  <NumberField
                    dark
                    label="What you expect to spend"
                    hint="A year, all in. Optional."
                    value={spend}
                    min={0}
                    max={100000000}
                    step={50000}
                    prefix={sym}
                    lakh={lakh}
                    onChange={setSpend}
                  />
                  {paybackMonths !== null && multiple !== null && (
                    <div className="mt-5 grid grid-cols-2 gap-4">
                      <Stat
                        k="Payback"
                        v={paybackMonths < 120 ? `${paybackMonths.toFixed(1)}` : "—"}
                        u="months"
                      />
                      <Stat k="Return" v={`${multiple.toFixed(1)}×`} u="on spend" />
                    </div>
                  )}
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="rounded-full bg-signal-orange px-5 py-2.5 text-[13px] font-semibold text-white"
                  >
                    Check this against your site
                  </Link>
                  <button
                    type="button"
                    onClick={reset}
                    className="rounded-full border border-white/15 px-5 py-2.5 text-[13px] text-white/70 hover:border-white/35"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <p className="mt-4 text-[11.5px] leading-[1.65] text-black/40">
                Indicative only. Every figure above is one you set or one you left at a starting
                value — none of them is a RAMS estimate of what you will save. RAMS supplies the
                measurement; the improvement is yours to verify.
              </p>
            </aside>
          </div>
        </div>
      </Section>

      {/* ── 03 the sources ─────────────────────────────────────── */}
      <Section surface="white">
        <div className="rams-container">
          <SectionHeader
            eyebrow="Step three"
            top="Check the starting numbers."
            body="Where a default came from published industry work, it is listed here and linked. Where it did not, it is a neutral starting point and nothing more — not research, and not a RAMS figure."
            align="left"
          />
          <ul className="mt-10 divide-y divide-black/8 border-y border-black/8">
            {SOURCES.map((s) => (
              <li key={s.id} className="grid gap-2 py-6 sm:grid-cols-[180px_1fr] sm:gap-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-black/40">
                  {s.what}
                </p>
                <div>
                  <p className="text-[15px] leading-[1.6] text-black/75">{s.says}</p>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-2 inline-block text-[12.5px] text-signal-orange hover:underline"
                  >
                    {s.who}
                  </a>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-[760px] text-[13px] leading-[1.7] text-black/45">
            Defaults with no source above — inspection and counting effort, MHE minutes, the cost of
            a slab repair — vary too much between buildings for a published figure to mean anything.
            They are starting points, put there so the fields are not empty. Replace them with your
            own before you take the total anywhere.
          </p>
        </div>
      </Section>
    </>
  );
}

/* ── fields ──────────────────────────────────────────────────────── */

function Stat({ k, v, u }: { k: string; v: string; u: string }) {
  return (
    <div>
      <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/35">{k}</p>
      <p className="mt-1.5 text-[22px] font-semibold leading-none tabular-nums">{v}</p>
      <p className="mt-1 text-[11px] text-white/35">{u}</p>
    </div>
  );
}

/**
 * A number, as a slider and as something you can type into.
 *
 * Both, because the two uses are different: the slider is for feeling how
 * sensitive the total is to an assumption, and the box is for entering the
 * figure you already know. A slider alone cannot take 47,500, and a box alone
 * never shows you that the answer barely moves.
 *
 * The text box holds its own string while focused so that clearing it to type
 * does not snap to the minimum under the cursor.
 */
function NumberField({
  label,
  hint,
  value,
  min,
  max,
  step,
  prefix,
  suffix,
  lakh,
  dark,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  lakh?: boolean;
  dark?: boolean;
  onChange: (n: number) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const shown = draft ?? fmtPlain(value, lakh);

  return (
    <div>
      <label className="flex items-baseline justify-between gap-3">
        <span
          className={
            "text-[12.5px] font-medium " + (dark ? "text-white/70" : "text-black/70")
          }
        >
          {label}
        </span>
        <span className="flex items-center gap-1">
          {prefix && (
            <span className={"text-[12px] " + (dark ? "text-white/40" : "text-black/35")}>
              {prefix}
            </span>
          )}
          <input
            inputMode="decimal"
            value={shown}
            onFocus={() => setDraft(String(value))}
            onChange={(e) => {
              setDraft(e.target.value);
              const raw = e.target.value.replace(/[^\d.-]/g, "");
              // An empty box is mid-edit, not a zero. Without this, clearing
              // the field to retype snaps the value — and the slider — to the
              // minimum under the cursor, which is the thing the draft state
              // is here to prevent.
              if (raw === "") return;
              const n = Number(raw);
              if (Number.isFinite(n)) onChange(clamp(n));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
            onBlur={() => setDraft(null)}
            className={
              "w-[92px] rounded-md border px-2 py-1 text-right font-mono text-[13px] tabular-nums outline-none focus:border-signal-orange " +
              (dark
                ? "border-white/12 bg-white/[0.04] text-white"
                : "border-black/12 bg-black/[0.02] text-black")
            }
          />
          {suffix && (
            <span className={"text-[12px] " + (dark ? "text-white/40" : "text-black/35")}>
              {suffix}
            </span>
          )}
        </span>
      </label>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="roi-range mt-3 w-full"
        data-dark={dark ? "" : undefined}
      />

      {hint && (
        <p className={"mt-1.5 text-[11.5px] " + (dark ? "text-white/35" : "text-black/40")}>
          {hint}
        </p>
      )}
    </div>
  );
}
