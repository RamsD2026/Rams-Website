"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Hardware.
 *
 * The source draws this as a dark 800×300 SVG of eleven boxes. Rebuilt here in
 * layout rather than in a drawing: light nodes on the section's own white, no
 * framed panel, and four vertical columns read left to right.
 *
 * The signal walks one node at a time rather than lighting a whole tier at
 * once. A tier flashing as a block reads as four things happening together,
 * which is louder and says less; a single travelling highlight traces the
 * actual path — each sensor in turn into the edge, the edge into RTSS, then
 * each output in turn — and stays quiet while doing it.
 */

const LINE = "#E8E8ED";

/* ── the nodes, in the order the signal visits them ──────── */

type Node = { id: string; t: string; sub?: string; accent?: boolean };

const INPUTS: Node[] = [
  { id: "meps", t: "MEPS + Digital Twin", accent: true },
  { id: "impact", t: "Impact Sensor" },
  { id: "vision", t: "AI Vision" },
  { id: "reverse", t: "Reverse Assistance" },
];

const EDGE: Node = {
  id: "omnibox",
  t: "OmniBox",
  sub: "Edge integration + response",
};

const CORE: Node = { id: "rtss", t: "RTSS", accent: true };

const OUTPUTS: Node[] = [
  { id: "driving", t: "Driving" },
  { id: "impact-out", t: "Impact" },
  { id: "active", t: "Active safety" },
  { id: "evidence", t: "Evidence" },
  { id: "patterns", t: "Patterns" },
  { id: "actions", t: "Actions" },
];

/** Visit order — every node, one at a time. */
const ORDER = [
  ...INPUTS.map((n) => n.id),
  EDGE.id,
  CORE.id,
  ...OUTPUTS.map((n) => n.id),
];

/** How long each node holds the signal. */
const STEP_MS = 620;

/**
 * `level` is 1 at the signal, 0.45 just behind it, 0 elsewhere — a short tail
 * so the highlight reads as something passing through rather than lamps
 * switching on and off. Nothing moves: a transform made each pill hop and
 * settle, which is a bounce, not a flow.
 */
function Pill({ n, level }: { n: Node; level: number }) {
  const idle = n.accent ? "rgba(255,106,0,0.32)" : LINE;

  return (
    <motion.span
      animate={{
        borderColor:
          level === 0
            ? idle
            : `rgba(255,106,0,${(0.35 + level * 0.65).toFixed(2)})`,
      }}
      transition={{ duration: 0.55, ease: "easeInOut" }}
      className="flex flex-col items-center justify-center text-center px-4 py-3 rounded-[10px] border"
      style={{ borderStyle: "solid" }}
    >
      <motion.span
        animate={{ color: level >= 1 || n.accent ? "#FF6A00" : "#3A3A3E" }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
        className="text-[11.5px] font-mono font-semibold tracking-[0.04em] whitespace-nowrap"
      >
        {n.t}
      </motion.span>
      {n.sub && (
        <span className="mt-1 text-[9.5px] font-mono tracking-[0.1em] uppercase text-graphite/40 whitespace-nowrap">
          {n.sub}
        </span>
      )}
    </motion.span>
  );
}

/** The horizontal step between two columns. */
function Step({ lit }: { lit: boolean }) {
  return (
    <span aria-hidden className="flex items-center shrink-0 px-2 sm:px-3">
      <motion.span
        animate={{ backgroundColor: lit ? "rgba(255,106,0,0.5)" : LINE }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
        className="h-px w-6 sm:w-9"
      />
      <motion.span
        animate={{ color: lit ? "#FF6A00" : "#D6D6DC" }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
        className="-ml-[3px]"
      >
        <ChevronRight className="w-3.5 h-3.5" strokeWidth={2} />
      </motion.span>
    </span>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-[9.5px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/35 mb-2.5">
      {children}
    </span>
  );
}

/**
 * Four vertical columns, the signal moving horizontally between them.
 *
 * Each column is a tier stacked vertically; the walk still visits one node at
 * a time, and the step between two columns lights once the signal has crossed
 * it — so the path fills in left to right as it goes.
 */
function Flow({ still }: { still: boolean }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (still) return;
    const id = setInterval(() => setI((p) => (p + 1) % ORDER.length), STEP_MS);
    return () => clearInterval(id);
  }, [still]);

  const level = (id: string) => {
    if (still) return 0;
    const idx = ORDER.indexOf(id);
    if (idx === i) return 1;
    if (idx === (i - 1 + ORDER.length) % ORDER.length) return 0.45;
    return 0;
  };
  const past = (n: number) => !still && i >= n;

  return (
    <div className="max-w-[1180px] mx-auto overflow-x-auto">
      <div className="flex items-center justify-center min-w-[840px] py-2">
        {/* inputs */}
        <div className="flex flex-col gap-5 shrink-0">
          <div>
            <Label>Foundation</Label>
            <Pill n={INPUTS[0]} level={level(INPUTS[0].id)} />
          </div>
          <div>
            <Label>Optional inputs</Label>
            <div className="flex flex-col gap-2.5">
              {INPUTS.slice(1).map((n) => (
                <Pill key={n.id} n={n} level={level(n.id)} />
              ))}
            </div>
          </div>
        </div>

        <Step lit={past(INPUTS.length)} />

        <div className="shrink-0">
          <Pill n={EDGE} level={level(EDGE.id)} />
        </div>

        <Step lit={past(INPUTS.length + 1)} />

        <div className="shrink-0">
          <Pill n={CORE} level={level(CORE.id)} />
        </div>

        <Step lit={past(INPUTS.length + 2)} />

        {/* outputs */}
        <div className="flex flex-col gap-2.5 shrink-0">
          {OUTPUTS.map((n) => (
            <Pill key={n.id} n={n} level={level(n.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function RtssHardware() {
  const reduce = useReducedMotion();

  return (
    <Section surface="white" id="hardware">
      <SectionHeader
        eyebrow="Hardware"
        top="Different risks"
        bottom="Need different senses."
        size="compact"
        width="wide"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.75, ease: EASE }}
      >
        <Flow still={!!reduce} />
      </motion.div>
    </Section>
  );
}
