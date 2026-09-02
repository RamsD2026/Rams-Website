"use client";

import { motion } from "framer-motion";
import {
  ChapterHead,
  EASE,
  Section,
} from "@/components/sections/rackiq/rackiq-shared";
import { Terminal } from "@/components/ui/terminal";

/**
 * AI needs a location.
 *
 * The section's argument is an equation, so the left column states it as one
 * and the right column runs it: a detection on its own is one word, and the
 * twin's context arrives underneath it a line at a time until the word means
 * something.
 *
 * The right side is a terminal because that is what a resolve actually is: a
 * query against the model, and an answer that arrives a line at a time. The
 * detection comes back as one word; the twin's context comes back as eight.
 *
 * The caption stays. What the twin can add depends on what is deployed, and
 * the list would overpromise without it.
 */

const ADDS = [
  "Which site — and which building",
  "Which aisle, and which bay",
  "Which safety zone the aisle sits in",
  "Which MHE was approaching",
  "At what speed, and on what route",
  "Which operator was authenticated on it",
  "What infrastructure surrounds the point",
  "Whether this location has done this before",
];

export function TwinAI() {
  return (
    <Section surface="white" id="ai">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-[1180px] mx-auto">
        {/* the equation */}
        <div className="lg:col-span-5">
          <ChapterHead
            eyebrow="AI needs a location"
            top="AI becomes useful when it"
            bottom="Knows where it is operating."
            lede="A camera detects a person. That is a classification, not an insight. The Digital Twin is what turns a detection into a decision worth interrupting someone for."
          />

          {/* the argument, as one line rather than three badges */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            className="mt-9 pt-7 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[15px]"
            style={{ borderTop: "1px solid #E8E8ED" }}
          >
            <span className="text-graphite/60">AI detection</span>
            <span aria-hidden className="text-graphite/30">
              +
            </span>
            <span className="text-graphite/60">Digital Twin context</span>
            <span aria-hidden className="text-graphite/30">
              =
            </span>
            <span className="font-semibold text-signal-orange">
              Physical intelligence
            </span>
          </motion.p>
        </div>

        {/* the resolve, as a query and its answer */}
        <div className="lg:col-span-7">
          <Terminal
            className="max-w-none px-0"
            username="rams@warehouse-01"
            enableSound={false}
            typingSpeed={42}
            delayBetweenCommands={900}
            commands={["camera a7 --detect", "twin resolve --detection person"]}
            outputs={{
              0: ["PERSON", "a classification, not an insight"],
              1: ADDS.map((a) => `+ ${a}`),
            }}
          />

          <p className="mt-4 text-[11.5px] leading-[1.6] text-graphite/45">
            Context available depends on which sensing and suites are deployed
            at the site.
          </p>
        </div>
      </div>
    </Section>
  );
}
