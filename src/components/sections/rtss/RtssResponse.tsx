"use client";

import { motion } from "framer-motion";
import {
  ChevronRight,
  Eye,
  Gauge,
  Hand,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Active response.
 *
 * A ladder, so it is drawn as a flow: four nodes joined by arrows, left to
 * right. Each rung is a stronger physical intervention than the one before —
 * logging, then warning, then reducing speed, then braking — and the nodes
 * intensify along the run so the escalation is visible rather than merely
 * listed in order.
 */

const LADDER: { n: string; v: string; body: string; Icon: LucideIcon }[] = [
  {
    n: "01",
    v: "See",
    body: "The detection is logged with machine, operator, location and speed attached.",
    Icon: Eye,
  },
  {
    n: "02",
    v: "Warn",
    body: "Visual and audible warning, and the operator display, at a distance where there is still room to act.",
    Icon: TriangleAlert,
  },
  {
    n: "03",
    v: "Slow",
    body: "Compatible speed reduction, so the closing speed comes down before the clearance does.",
    Icon: Gauge,
  },
  {
    n: "04",
    v: "Stop",
    body: "Compatible braking response where the integration supports it — active intervention rather than an alert alone.",
    Icon: Hand,
  },
];

export function RtssResponse() {
  return (
    <Section surface="warm" id="response" padding="tight">
      <SectionHeader
        eyebrow="Active response"
        top="From warning to active response —"
        bottom="Where the MHE integration supports it."
        size="compact"
        width="wide"
      />

      <div className="max-w-[1080px] mx-auto overflow-x-auto">
        <ol className="flex flex-nowrap items-start min-w-[860px]">
          {LADDER.map((st, i) => {
            /* the rungs strengthen as the response becomes more physical */
            const fill = 0.06 + i * 0.05;
            const edge = 0.2 + i * 0.15;

            return (
              <li key={st.n} className="contents">
                {i > 0 && (
                  <span
                    aria-hidden
                    className="flex items-center shrink-0 pt-[25px] px-1"
                  >
                    <span
                      className="h-px w-6"
                      style={{ background: `rgba(255,106,0,${edge})` }}
                    />
                    <ChevronRight
                      className="w-3.5 h-3.5 -ml-[3px]"
                      strokeWidth={2}
                      style={{ color: `rgba(255,106,0,${edge + 0.25})` }}
                    />
                  </span>
                )}

                <motion.span
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.55, delay: i * 0.09, ease: EASE }}
                  className="flex flex-col items-center text-center px-3"
                  style={{ flex: "1 1 200px", minWidth: 0 }}
                >
                  <span
                    className="flex items-center justify-center w-[52px] h-[52px] rounded-full shrink-0"
                    style={{
                      background: `rgba(255,106,0,${fill})`,
                      border: `1px solid rgba(255,106,0,${edge})`,
                    }}
                  >
                    <st.Icon
                      className="w-[21px] h-[21px] text-signal-orange"
                      strokeWidth={1.8}
                      aria-hidden
                    />
                  </span>

                  <span className="mt-4 text-[9.5px] font-mono font-bold tracking-[0.16em] text-signal-orange">
                    {st.n}
                  </span>
                  <span className="mt-1.5 font-rams-heading text-[22px] sm:text-[24px] font-bold tracking-[-0.03em] leading-none text-carbon">
                    {st.v}
                  </span>
                  <span className="mt-3 text-[13px] text-graphite/65 leading-[1.6]">
                    {st.body}
                  </span>
                </motion.span>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
