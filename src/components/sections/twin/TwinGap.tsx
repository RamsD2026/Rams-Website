"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * 01 — The gap.
 *
 * The section was four cards and a list, which is the shape of an argument
 * but not the argument itself. Now it runs it: the facility asks one of its
 * questions, the query goes out to all four enterprise systems, and all four
 * come back with nothing. Watching it happen eight times is the point the
 * copy is making.
 *
 * One clock drives the question, the query and the four answers, so nothing
 * drifts. Under prefers-reduced-motion it holds on the first question with
 * the answers already returned.
 */

const LINE = "#E8E8ED";

/** 100ms ticks. Each question gets one cycle. */
const TICK_MS = 100;
const CYCLE = 34;
/** The query is out for the first part of the cycle. */
const ASKING = 9;

const SYSTEMS = [
  {
    code: "ERP",
    title: "What was purchased",
    body: "Orders, costs, materials, commitments. Accurate on paper. Silent on the floor.",
  },
  {
    code: "WMS",
    title: "What was recorded",
    body: "Stock, locations, transactions. It knows the bin number. It does not know the bay is damaged.",
  },
  {
    code: "MES",
    title: "What was produced",
    body: "Output, cycles, quality. Bound to the process, not to the space the process happens in.",
  },
  {
    code: "IoT",
    title: "What a sensor measured",
    body: "A number with a timestamp. No idea what it was next to, or whether it has happened there before.",
  },
];

const QUESTIONS = [
  "Where exactly did it happen?",
  "What asset was there?",
  "What was around it?",
  "How was the equipment moving?",
  "Was the layout contributing?",
  "Was the route efficient?",
  "Was something unsafe?",
  "What changed physically?",
];

function useTick(still: boolean) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (still) return;
    const id = setInterval(() => setT((v) => v + 1), TICK_MS);
    return () => clearInterval(id);
  }, [still]);
  return t;
}

export function TwinGap() {
  const still = useReducedMotion() ?? false;
  const t = useTick(still);

  const q = still ? 0 : Math.floor(t / CYCLE) % QUESTIONS.length;
  const phase = still ? CYCLE - 1 : t % CYCLE;
  /* the query is out, and then it is back with nothing */
  const asking = phase < ASKING;

  return (
    <Section surface="white" id="gap">
      <SectionHeader
        eyebrow="The gap"
        top="Enterprise systems know transactions."
        bottom="Who understands physical reality?"
        body="Every enterprise system in a warehouse or factory describes the operation in records. The facility itself is asking a completely different set of questions — and no record answers them."
        size="compact"
        width="wide"
        bodyWidth="wide"
      />

      <div
        className="overflow-hidden max-w-[1180px] mx-auto bg-white"
        style={{ borderRadius: 16, border: `1px solid ${LINE}` }}
      >
        {/* the question the building is asking right now */}
        <div
          className="px-6 py-8 sm:px-10 sm:py-10"
          style={{ background: "#FAFAFB" }}
        >
          <p className="flex items-center gap-2.5 text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/40">
            <span className="relative flex w-1.5 h-1.5">
              {!still && (
                <motion.span
                  key={q}
                  className="absolute inset-0 rounded-full bg-signal-orange"
                  initial={{ scale: 1, opacity: 0.75 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 1.1, ease: "easeOut" }}
                />
              )}
              <span className="relative w-1.5 h-1.5 rounded-full bg-signal-orange" />
            </span>
            The facility is asking
          </p>

          <div className="relative mt-5 h-[58px] sm:h-[68px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={q}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="absolute inset-0 font-rams-heading text-[26px] sm:text-[36px] lg:text-[42px] font-bold tracking-[-0.035em] leading-[1.15] text-carbon"
              >
                {QUESTIONS[q]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* which of the eight is on the floor */}
          <div className="mt-6 flex items-center gap-1.5">
            {QUESTIONS.map((qq, i) => (
              <span
                key={qq}
                className="h-[2px] flex-1 rounded-full transition-colors duration-300"
                style={{ background: i === q ? "#FF6A00" : "#E4E4E9" }}
              />
            ))}
          </div>
        </div>

        {/* and what comes back */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px"
          style={{ background: LINE, borderTop: `1px solid ${LINE}` }}
        >
          {SYSTEMS.map((s, i) => (
            <div key={s.code} className="px-6 py-7 bg-white">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-mono font-bold tracking-[0.18em] uppercase text-carbon">
                  {s.code}
                </span>
                <span
                  className="text-[9.5px] font-mono font-bold tracking-[0.12em] uppercase transition-colors duration-300"
                  style={{
                    color: asking
                      ? "rgba(255,106,0,0.85)"
                      : "rgba(56,56,62,0.32)",
                  }}
                >
                  {asking ? "Querying" : "No record"}
                </span>
              </div>

              {/* the query goes out, and the line comes back empty */}
              <span
                className="block relative h-[2px] rounded-full mt-3.5 overflow-hidden"
                style={{ background: "#F1F1F4" }}
              >
                <motion.span
                  className="absolute inset-y-0 left-0 rounded-full bg-signal-orange"
                  animate={{
                    width: asking ? "100%" : "0%",
                    opacity: asking ? 1 : 0,
                  }}
                  transition={{
                    duration: asking ? 0.5 : 0.35,
                    delay: asking ? i * 0.07 : 0,
                    ease: EASE,
                  }}
                />
              </span>

              <h3 className="mt-5 font-rams-heading text-[17px] font-bold tracking-[-0.02em] leading-[1.25] text-carbon">
                {s.title}
              </h3>
              <p className="mt-2.5 text-[13px] leading-[1.65] text-graphite/60">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <p
          className="px-6 py-7 sm:px-10 text-center font-rams-heading text-[17px] sm:text-[20px] font-bold tracking-[-0.022em] leading-[1.35] text-carbon"
          style={{ borderTop: `1px solid ${LINE}`, background: "#FAFAFB" }}
        >
          Eight questions, four systems, no record that answers them.
        </p>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="max-w-[900px] mx-auto mt-20 sm:mt-24 text-center font-rams-heading text-[26px] sm:text-[34px] lg:text-[40px] font-bold tracking-[-0.034em] leading-[1.18] text-carbon"
      >
        {/* Broken at the sentence, so the two claims sit one above the other
            and read as a pair rather than one long wrap. */}
        A WMS tracks transactions.
        <br />
        The Digital Twin tracks{" "}
        <span className="text-signal-orange">physical reality</span>.
        <span className="block mt-4 text-[16px] sm:text-[19px] font-medium tracking-[-0.015em] leading-[1.45] text-graphite/50">
          Every other system finally has somewhere to point.
        </span>
      </motion.p>
    </Section>
  );
}
