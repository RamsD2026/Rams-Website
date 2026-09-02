"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Check,
  Fingerprint,
  FileCheck,
  Lock,
  ShieldAlert,
  Unlock,
  X,
} from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Pre-shift inspection.
 *
 * The argument is that the check cannot be skipped, so the checklist is the
 * one thing on the page you can actually operate: tap an item to pass it, tap
 * again to fail it. The machine state at the foot follows from what you did —
 * the gate is not decoration, it is the outcome of the list above it.
 *
 * What the check guarantees sits on the left as plain rows, so the widget is
 * the only object with a frame.
 */

const LINE = "#E8E8ED";
const GREEN = "#16A34A";
const RED = "#C6413A";

type State = 0 | 1 | 2; // untouched · passed · failed

const ITEMS: { t: string; m?: string }[] = [
  { t: "Forks, carriage and mast condition", m: "Photo required" },
  { t: "Hydraulic hoses and visible leaks", m: "Photo required" },
  { t: "Tyres and wheel condition" },
  { t: "Horn, lights and warning beacon" },
  { t: "Brakes and parking brake" },
  { t: "Battery charge and connections" },
  { t: "Seat belt and operator restraint", m: "Photo required" },
  { t: "Operator biometric sign-off", m: "Mandatory" },
];

const GUARANTEES = [
  {
    Icon: Camera,
    tag: "Mandatory",
    title: "Photo capture",
    body: "Items that need proof carry a photo requirement, timestamped and attached to the record.",
  },
  {
    Icon: Fingerprint,
    tag: "Mandatory",
    title: "Biometric sign-off",
    body: "The check is signed by an authenticated operator, so the record names a person rather than a shift.",
  },
  {
    Icon: ShieldAlert,
    tag: "Automatic",
    title: "Restriction on failure",
    body: "A failed or incomplete check keeps the machine out of service and raises the fault to maintenance.",
  },
  {
    Icon: FileCheck,
    tag: "Automatic",
    title: "Defensible record",
    body: "Every check timestamped, photographed and linked to the operator and the machine.",
  },
];

/* ── the checklist ───────────────────────────────────────── */

function Checklist() {
  const [state, setState] = useState<State[]>(() => ITEMS.map(() => 0));

  const cycle = (i: number) =>
    setState((s) => s.map((v, k) => (k === i ? (((v + 1) % 3) as State) : v)));

  const done = state.filter((v) => v === 1).length;
  const failed = state.some((v) => v === 2);
  const released = !failed && done === ITEMS.length;
  const left = ITEMS.length - done;

  const note = failed
    ? "A failed item keeps the machine out of service and raises the fault to maintenance. The record shows who checked it and when."
    : released
      ? "Check complete and signed off. Timestamped, photographed where required, and linked to the operator and the machine."
      : done === 0
        ? "The machine will not release until every item is signed off. Tap the items to complete the check."
        : `${left} item${left > 1 ? "s" : ""} outstanding. The machine stays restricted until the check is finished.`;

  return (
    <div
      className="overflow-hidden bg-white"
      style={{
        borderRadius: 18,
        border: `1px solid ${LINE}`,
      }}
    >
      <div
        className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6"
        style={{ borderBottom: `1px solid ${LINE}` }}
      >
        <span className="min-w-0">
          <span className="block text-[13.5px] font-semibold text-carbon truncate">
            Pre-shift check
          </span>
          <span className="block text-[10px] font-mono tracking-[0.1em] uppercase text-graphite/40">
            MHE 04 · Operator 17
          </span>
        </span>
        <span
          className="shrink-0 px-2.5 py-1 rounded-full text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase text-signal-orange"
          style={{ border: "1px solid rgba(255,106,0,0.35)" }}
        >
          Try it
        </span>
      </div>

      {/* how far through the check we are */}
      <div className="px-5 pt-4 pb-3 sm:px-6">
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase text-graphite/40">
            Checklist
          </span>
          <span className="text-[11px] font-mono tabular-nums text-graphite/50">
            {done} / {ITEMS.length}
          </span>
        </div>
        <span
          className="block relative h-1 rounded-full overflow-hidden"
          style={{ background: "#F1F1F4" }}
        >
          <motion.span
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: failed ? RED : released ? GREEN : "#FF6A00" }}
            animate={{ width: `${(done / ITEMS.length) * 100}%` }}
            transition={{ duration: 0.35, ease: EASE }}
          />
        </span>
      </div>

      <div>
        {ITEMS.map((it, i) => {
          const v = state[i];
          return (
            <button
              key={it.t}
              type="button"
              onClick={() => cycle(i)}
              aria-pressed={v === 1}
              className="group w-full flex items-center gap-3 px-5 py-[11px] sm:px-6 text-left transition-colors duration-200 hover:bg-[#FAFAFB]"
              style={{ borderTop: `1px solid ${LINE}` }}
            >
              <span
                className="w-[19px] h-[19px] rounded-[6px] flex items-center justify-center shrink-0 transition-colors duration-200"
                style={{
                  background: v === 1 ? GREEN : v === 2 ? RED : "transparent",
                  border:
                    v === 0
                      ? `1px solid ${LINE}`
                      : `1px solid ${v === 1 ? GREEN : RED}`,
                }}
              >
                {v === 1 && (
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                )}
                {v === 2 && (
                  <X className="w-3 h-3 text-white" strokeWidth={3} />
                )}
              </span>

              <span
                className={
                  "flex-1 min-w-0 text-[13.5px] leading-[1.4] transition-colors duration-200 " +
                  (v === 0 ? "text-carbon" : "text-graphite/50")
                }
              >
                {it.t}
              </span>

              {(v === 2 || it.m) && (
                <span
                  className="shrink-0 text-[9px] font-mono font-bold tracking-[0.12em] uppercase"
                  style={{ color: v === 2 ? RED : "rgba(56,56,62,0.4)" }}
                >
                  {v === 2 ? "Failed" : it.m}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* the outcome of the list above */}
      <div
        className="px-5 py-5 sm:px-6"
        style={{ borderTop: `1px solid ${LINE}`, background: "#FAFAFB" }}
      >
        <span
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono font-bold tracking-[0.1em] uppercase transition-colors duration-300"
          style={{
            color: released ? GREEN : RED,
            background: released
              ? "rgba(22,163,74,0.08)"
              : "rgba(198,65,58,0.07)",
            border: `1px solid ${released ? "rgba(22,163,74,0.25)" : "rgba(198,65,58,0.22)"}`,
          }}
        >
          {released ? (
            <Unlock className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
          ) : (
            <Lock className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
          )}
          {released ? "MHE released" : "MHE restricted"}
        </span>
        <p className="mt-3 text-[12.5px] leading-[1.6] text-graphite/60">
          {note}
        </p>
      </div>
    </div>
  );
}

export function ImdsPreshift() {
  return (
    <Section surface="white" id="preshift" paddingBottom="strip">
      <SectionHeader
        eyebrow="Pre-shift inspection"
        top="The inspection that"
        bottom="Cannot be skipped."
        body="Pre-shift checks are legally required in most jurisdictions and routinely rushed, shared or back-filled. Paper checklists go missing, and when something happens there is no defensible record that the check was ever done."
        size="compact"
        width="wide"
        bodyWidth="wide"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start max-w-[1180px] mx-auto">
        <div className="lg:col-span-6">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="font-rams-heading text-[24px] sm:text-[29px] font-bold tracking-[-0.03em] leading-[1.2] text-carbon max-w-[540px]"
          >
            A checklist nobody can skip is worth more than a checklist nobody{" "}
            <span className="text-signal-orange">reads</span>.
          </motion.p>

          <div className="mt-9">
            {GUARANTEES.map((g, i) => (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
                className="flex items-start gap-4 py-5"
                style={{ borderTop: i ? `1px solid ${LINE}` : undefined }}
              >
                <g.Icon
                  className="w-[19px] h-[19px] text-signal-orange shrink-0 mt-[3px]"
                  strokeWidth={1.8}
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-rams-heading text-[16.5px] font-bold tracking-[-0.02em] text-carbon">
                      {g.title}
                    </span>
                    <span className="text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-graphite/35">
                      {g.tag}
                    </span>
                  </p>
                  <p className="mt-1.5 text-[13px] leading-[1.6] text-graphite/60">
                    {g.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="mt-6 text-[11.5px] leading-[1.6] text-graphite/40">
            Automatic restriction requires the operator authentication unit and
            a validated machine integration at the site.
          </p>
        </div>

        <div className="lg:col-span-6">
          <Checklist />
        </div>
      </div>
    </Section>
  );
}
