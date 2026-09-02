"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Inbox, ListTree, TrendingUp } from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import {
  LIGHT_LINE as LINE,
  PanelFrame,
  Points,
  type Point,
} from "@/components/sections/imds/imds-shared";

/**
 * Fault intelligence.
 *
 * Same shape as `Beyond the hour meter`: pick a severity, read one record,
 * then three columns on what the system does with it. The severities are the
 * argument — the same code means three different things depending on how the
 * OEM classifies it, and what happens next follows from that alone.
 */

const GREEN = "#16A34A";
const AMBER = "#D9A21B";
const RED = "#C6413A";

const TABS = ["Informational", "Warning", "Critical"];

type Fault = {
  code: string;
  desc: string;
  mhe: string;
  first: string;
  count: string;
  /** Emphasised when the count is the fact that changes the outcome. */
  recurring?: boolean;
  resp: string;
  colour: string;
};

const FAULTS: Fault[] = [
  {
    code: "I-2140",
    desc: "Service interval approaching",
    mhe: "MHE 07",
    first: "12 Aug",
    count: "1",
    resp: "Logged against the machine and included in the next scheduled check.",
    colour: GREEN,
  },
  {
    code: "W-3312",
    desc: "Hydraulic pressure warning",
    mhe: "MHE 04",
    first: "02 Jul",
    count: "4 in 2 months",
    recurring: true,
    resp: "Logged, trended and raised to maintenance for review. Recurrence at this rate raises a work order.",
    colour: AMBER,
  },
  {
    code: "C-1108",
    desc: "Brake circuit fault",
    mhe: "MHE 09",
    first: "Today",
    count: "1",
    resp: "Escalated immediately. The machine is restricted from service until the fault is cleared and signed off.",
    colour: RED,
  },
];

const POINTS: Point[] = [
  {
    Icon: Inbox,
    ix: "Capture",
    title: "However it arrives",
    body: "From the machine display, an indicator, or manual entry by the operator or technician — the code lands in one place.",
  },
  {
    Icon: ListTree,
    ix: "Classify",
    title: "Brand-configurable mapping",
    body: "Codes are mapped to Informational, Warning or Critical against the OEM's own scheme for that machine.",
  },
  {
    Icon: TrendingUp,
    ix: "Trend",
    title: "Per machine, per fleet",
    body: "Frequency and recurrence tracked over time, so a repeating warning becomes a pattern instead of an anecdote.",
  },
];

/** The record, read one field at a time. */
function Field({
  k,
  v,
  accent,
}: {
  k: string;
  v: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="px-5 py-4 sm:px-6 bg-white">
      <p className="text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-graphite/40">
        {k}
      </p>
      <p
        className="mt-1.5 text-[14px] font-semibold tracking-[-0.01em]"
        style={{ color: accent ?? "#08080A" }}
      >
        {v}
      </p>
    </div>
  );
}

function Record({ f }: { f: Fault }) {
  return (
    <>
      <div
        className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6 flex-wrap"
        style={{ borderBottom: `1px solid ${LINE}`, background: "#FAFAFB" }}
      >
        <p className="flex items-center gap-3">
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: f.colour }}
          />
          <span className="font-mono text-[13px] font-semibold tracking-[0.02em] text-carbon">
            {f.code}
          </span>
          <span className="text-[14px] text-graphite/70">{f.desc}</span>
        </p>
        <span
          className="px-2.5 py-1 rounded-full text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase"
          style={{
            color: f.colour,
            border: `1px solid ${f.colour}40`,
            background: `${f.colour}0F`,
          }}
        >
          {TABS[FAULTS.indexOf(f)]}
        </span>
      </div>

      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-px"
        style={{ background: LINE }}
      >
        <Field k="Machine" v={f.mhe} />
        <Field k="First seen" v={f.first} />
        <Field
          k="Occurrences"
          v={f.count}
          accent={f.recurring ? "#FF6A00" : undefined}
        />
        <Field k="Source" v="Machine display" />
      </div>

      <div
        className="px-5 py-5 sm:px-6"
        style={{ borderTop: `1px solid ${LINE}`, background: "#FAFAFB" }}
      >
        <p className="text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-graphite/40">
          What happens next
        </p>
        <p className="mt-2 text-[13.5px] leading-[1.6] text-carbon max-w-[70ch]">
          {f.resp}
        </p>
      </div>
    </>
  );
}

export function ImdsFaults() {
  const [tab, setTab] = useState(1);

  return (
    <Section surface="white" id="faults" paddingTop="tight">
      <SectionHeader
        eyebrow="Fault intelligence"
        top="The same warning,"
        bottom="Four times in two months."
        body="A fault code appears on the display, the operator mentions it on the radio, and it goes no further. Nobody sees that the same hydraulic warning has now appeared four times on the same machine — which is the only fact that would have changed anything."
        size="compact"
        width="wide"
        bodyWidth="wide"
      />

      <PanelFrame
        tabs={TABS}
        active={tab}
        onChange={setTab}
        label="Fault severity"
        tone="light"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            <Record f={FAULTS[tab]} />
          </motion.div>
        </AnimatePresence>
      </PanelFrame>

      <Points items={POINTS} tone="light" />
    </Section>
  );
}
