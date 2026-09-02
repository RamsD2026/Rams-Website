"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Usage-based maintenance.
 *
 * The source states this as a table of four figures. Stated, "serviced at 412
 * hours" and "triggered at 250 hours" are just two numbers; drawn against the
 * 250-hour threshold they are the whole argument — one bar runs past the line,
 * the other stops on it, and the light machine never reaches it at all.
 *
 * Both cards share one scale and one threshold marker, so the two regimes are
 * read against each other rather than each on its own terms.
 */

const LINE = "#E8E8ED";
const GREEN = "#16A34A";
const AMBER = "#D9A21B";

/** The scale every bar is drawn on, and the service threshold on it. */
const SCALE = 450;
const THRESHOLD = 250;

type Row = {
  m: string;
  use: string;
  hours: number;
  outcome: string;
  /** Ran past the threshold before it was serviced. */
  late?: boolean;
  /** Serviced well before it needed anything. */
  early?: boolean;
};

const CARDS: {
  head: string;
  good: boolean;
  rows: Row[];
  intervalKey: string;
  intervalValue: string;
  foot: string;
}[] = [
  {
    head: "Calendar-based · every 3 months",
    good: false,
    rows: [
      {
        m: "MHE 04",
        use: "heavy use",
        hours: 412,
        outcome: "Serviced at 412 hours",
        late: true,
      },
      {
        m: "MHE 09",
        use: "light use",
        hours: 88,
        outcome: "Serviced at 88 hours",
        early: true,
      },
    ],
    intervalKey: "Same interval",
    intervalValue: "Same cost",
    foot: "One machine ran well past its service window. The other was serviced before it needed anything. The interval was the only thing they had in common.",
  },
  {
    head: "Usage-based · IMDS",
    good: true,
    rows: [
      {
        m: "MHE 04",
        use: "heavy use",
        hours: 250,
        outcome: "Triggered at 250 hours",
      },
      {
        m: "MHE 09",
        use: "light use",
        hours: 88,
        outcome: "Not yet due",
      },
    ],
    intervalKey: "Interval",
    intervalValue: "Set by the work done",
    foot: "Each machine is serviced against its own operating history. The heavy user is caught before the window closes; the light user keeps running.",
  },
];

const pct = (n: number) => (n / SCALE) * 100;

function Bar({ r, good, delay }: { r: Row; good: boolean; delay: number }) {
  /* the run up to the threshold, then anything beyond it, drawn separately */
  const upTo = Math.min(r.hours, THRESHOLD);
  const over = Math.max(0, r.hours - THRESHOLD);
  const fill = r.late ? AMBER : good ? GREEN : "#9AA3AE";

  return (
    <div className="py-5" style={{ borderTop: `1px solid ${LINE}` }}>
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <span className="text-[13.5px] text-carbon">
          {r.m}
          <span className="text-graphite/45"> · {r.use}</span>
        </span>
        <span
          className="text-[13.5px] font-semibold tracking-[-0.01em]"
          style={{ color: r.late ? AMBER : good ? GREEN : "#3A3A3E" }}
        >
          {r.outcome}
        </span>
      </div>

      <div className="relative mt-3.5">
        <div
          className="relative h-2 rounded-full overflow-hidden"
          style={{ background: "#F1F1F4" }}
        >
          <motion.span
            className="absolute inset-y-0 left-0"
            style={{ background: fill }}
            initial={{ width: 0 }}
            whileInView={{ width: `${pct(upTo)}%` }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.85, delay, ease: EASE }}
          />
          {over > 0 && (
            <motion.span
              className="absolute inset-y-0"
              style={{
                left: `${pct(THRESHOLD)}%`,
                background: AMBER,
                opacity: 0.45,
              }}
              initial={{ width: 0 }}
              whileInView={{ width: `${pct(over)}%` }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.85, delay: delay + 0.2, ease: EASE }}
            />
          )}
        </div>

        {/* the threshold, in the same place on every bar */}
        <span
          aria-hidden
          className="absolute -top-1 bottom-[-4px] w-px"
          style={{ left: `${pct(THRESHOLD)}%`, background: "#B9BAC1" }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-[9.5px] font-mono tracking-[0.12em] uppercase text-graphite/35">
          {r.hours} h
        </span>
        <span
          className="text-[9.5px] font-mono tracking-[0.12em] uppercase text-graphite/35"
          style={{ marginRight: `${100 - pct(THRESHOLD) - 6}%` }}
        >
          {THRESHOLD} h service point
        </span>
      </div>
    </div>
  );
}

export function ImdsTriggers() {
  return (
    <Section surface="white" padding="tight" id="triggers">
      <SectionHeader
        eyebrow="Usage-based maintenance"
        top="The calendar does not know"
        bottom="How hard the machine worked."
        body="Calendar servicing treats a machine running sixteen hours a day the same as one running four. One gets serviced too late; the other gets serviced for nothing. IMDS triggers from what actually happened to the machine."
        size="compact"
        width="wide"
        bodyWidth="wide"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-[1080px] mx-auto items-start">
        {CARDS.map((c, i) => (
          <motion.div
            key={c.head}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
            className="flex flex-col overflow-hidden bg-white"
            style={{
              borderRadius: 16,
              border: `1px solid ${c.good ? "rgba(22,163,74,0.28)" : LINE}`,
              boxShadow: c.good
                ? "0 1px 2px rgba(0,0,0,0.02), 0 18px 44px -24px rgba(22,163,74,0.28)"
                : "0 1px 2px rgba(0,0,0,0.02), 0 18px 44px -24px rgba(0,0,0,0.14)",
            }}
          >
            <div
              className="flex items-center gap-2.5 px-5 py-4 sm:px-6"
              style={{
                background: c.good ? "rgba(22,163,74,0.05)" : "#FAFAFB",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: c.good ? GREEN : "#B9BAC1" }}
              />
              <span
                className="text-[10.5px] font-mono tracking-[0.09em] uppercase"
                style={{ color: c.good ? GREEN : "#6E7B8B" }}
              >
                {c.head}
              </span>
            </div>

            <div className="px-5 sm:px-6">
              {c.rows.map((r, ri) => (
                <Bar
                  key={r.m}
                  r={r}
                  good={c.good}
                  delay={0.15 + i * 0.1 + ri * 0.12}
                />
              ))}

              <p
                className="flex items-center justify-between gap-4 py-4 flex-wrap"
                style={{ borderTop: `1px solid ${LINE}` }}
              >
                <span className="text-[13px] text-graphite/50">
                  {c.intervalKey}
                </span>
                <span
                  className="text-[13px] font-semibold"
                  style={{ color: c.good ? GREEN : "#3A3A3E" }}
                >
                  {c.intervalValue}
                </span>
              </p>
            </div>

            <p
              className="px-5 py-5 sm:px-6 text-[13.5px] text-graphite/60 leading-[1.65] mt-auto"
              style={{ borderTop: `1px solid ${LINE}`, background: "#FAFAFB" }}
            >
              {c.foot}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-16 sm:mt-20 text-center font-rams-heading text-[22px] sm:text-[28px] lg:text-[34px] font-bold tracking-[-0.03em] leading-[1.2] text-carbon max-w-[34ch] mx-auto"
      >
        Service the machine that{" "}
        <span className="text-signal-orange">worked</span>, not the machine on
        the list.
      </motion.p>
    </Section>
  );
}
