"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  ClipboardCheck,
  Layers3,
  QrCode,
  Ruler,
  WifiOff,
} from "lucide-react";
import { Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, HAIR, SOFT } from "./irdsx-shared";
import { TabletUI, type TabletScreen } from "./IrxTabletUI";

/**
 * 03 — IRDS Field. The audit app.
 *
 * A **tablet**, not a phone. A rack audit needs the estate structure and the
 * work visible at once — the inspector is standing at a bay, moving down a
 * row, and has to see where they are while recording what they found. That is
 * a two-pane layout, and a phone cannot hold one.
 *
 * The tablet runs the section, full width, with the six features beneath it in
 * a 3 × 2 grid. **Every feature shows its whole body, always.** An earlier
 * version opened only the live one and collapsed the other five, which meant a
 * reader looking for the feature list found six headings and one paragraph.
 * The live feature is marked by colour, not by being the only one legible.
 *
 * The walk moves every 3.6s; clicking a feature takes it over without stopping
 * it.
 */

const DWELL_MS = 3600;
const BLUE = "#5B8DEF";

const FEATURES: {
  key: string;
  screen: TabletScreen;
  icon: typeof Camera;
  k: string;
  body: string;
}[] = [
  {
    key: "checklist",
    screen: "checklist",
    icon: ClipboardCheck,
    k: "Guided check points",
    body: "The configured method arrives on screen at the bay — the same questions, in the same order, for every inspector on every site.",
  },
  {
    key: "element",
    screen: "element",
    icon: Layers3,
    k: "Element-level capture",
    body: "A finding is raised against the upright, beam, brace or baseplate itself, never against the rack in general.",
  },
  {
    key: "scan",
    screen: "scan",
    icon: QrCode,
    k: "Scan to the rack",
    body: "Scan the asset label and the app opens the rack in front of you, already in the right cycle and the right scope.",
  },
  {
    key: "evidence",
    screen: "capture",
    icon: Camera,
    k: "Photo + measurement",
    body: "Photographs and measurements attach to the finding at the moment it is raised, not typed up afterwards from memory.",
  },
  {
    key: "test",
    screen: "test",
    icon: Ruler,
    k: "Structured test readings",
    body: "G1 to G5 readings are captured at the element and sent to be computed against the configured threshold.",
  },
  {
    key: "offline",
    screen: "sync",
    icon: WifiOff,
    k: "Offline-tolerant",
    body: "A warehouse aisle is a poor place to depend on signal. Work continues, queues, and sends when there is one.*",
  },
];

function FeatureCard({
  f,
  on,
  onPick,
}: {
  f: (typeof FEATURES)[number];
  on: boolean;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      aria-current={on ? "true" : undefined}
      className="h-full text-left p-6 transition-all duration-300"
      style={{
        borderRadius: 12,
        background: "#FFFFFF",
        border: `1px solid ${on ? `${BLUE}66` : HAIR}`,
        boxShadow: on
          ? "0 1px 2px rgba(0,0,0,0.02), 0 16px 36px -18px rgba(91,141,239,0.35)"
          : "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
        transform: on ? "translateY(-2px)" : "none",
      }}
    >
      <span
        className="flex items-center justify-center w-11 h-11 rounded-lg transition-colors duration-300"
        style={{
          background: on ? `${BLUE}1A` : SOFT,
          border: `1px solid ${on ? `${BLUE}4D` : HAIR}`,
        }}
      >
        <f.icon
          className="w-[20px] h-[20px]"
          strokeWidth={2}
          style={{ color: on ? BLUE : "#9A9AA4" }}
        />
      </span>

      <span className="mt-5 block text-[17px] font-bold tracking-[-0.02em] leading-[1.2] text-carbon">
        {f.k}
      </span>

      {/* Always open. A feature list where five of six are collapsed is not a
          feature list. */}
      <span className="mt-3 block text-[13.5px] leading-[1.6] text-graphite/65">
        {f.body}
      </span>
    </button>
  );
}

export function IrxField() {
  const [at, setAt] = useState(0);
  const [nudge, setNudge] = useState(0);
  const f = FEATURES[at];

  useEffect(() => {
    const id = setInterval(
      () => setAt((v) => (v + 1) % FEATURES.length),
      DWELL_MS,
    );
    return () => clearInterval(id);
  }, [nudge]);

  const pick = (n: number) => {
    setAt(n);
    setNudge((v) => v + 1);
  };

  return (
    <Section surface="offWhite" id="field">
      <SectionHeader
        eyebrow="IRDS Field · the audit app"
        top="A tablet at the bay,"
        bottom="Not a clipboard."
        size="compact"
        width="wide"
        body="The inspector's product. The estate on the left, the work on the right — so you can see where you are while you record what you found."
      />

      {/* ── the device ─────────────────────────────────── */}
      <div className="max-w-[880px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={f.key}
              initial={{ opacity: 0, scale: 1.008 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <TabletUI screen={f.screen} />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* which of the six is on screen */}
        <div className="mt-6 flex items-center justify-center gap-1.5">
          {FEATURES.map((x, n) => (
            <button
              key={x.key}
              type="button"
              onClick={() => pick(n)}
              aria-label={x.k}
              className="h-[3px] rounded-full transition-all duration-500"
              style={{
                width: n === at ? 26 : 8,
                background: n === at ? BLUE : "#D8D8DE",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── every feature, open ────────────────────────── */}
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((x, n) => (
          <motion.div
            key={x.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: (n % 3) * 0.07, ease: EASE }}
          >
            <FeatureCard f={x} on={n === at} onPick={() => pick(n)} />
          </motion.div>
        ))}
      </div>

      <p className="mt-10 text-center text-[11px] leading-[1.6] text-graphite/45 max-w-[720px] mx-auto">
        *Offline availability depends on the configured mobile workflow and the
        deployment scope agreed for the site.
      </p>
    </Section>
  );
}
