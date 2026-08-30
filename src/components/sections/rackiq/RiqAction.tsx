"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, SHOTS, Section, type ShotKey } from "./rackiq-shared";

/**
 * Question 04 — action.
 *
 * Four steps down the left, one screen on the right, in the pattern Atlassian
 * use for Jira: the active step carries a progress bar, the panel advances on
 * its own, and clicking a step takes over.
 *
 * ── SCREENSHOTS ──────────────────────────────────────────────────────
 * `shot` on each step points at the real shipped screens in
 * /public/Product/irds.
 *
 * All five are real shipped screens: Inspection Findings plain, then
 * filtered, the Set Action panel, the Bill Of Quantity, and Maintenance.
 * Nothing here is a stand-in.
 * ─────────────────────────────────────────────────────────────────────
 */

const LINE = "#E4E4E9";
const DWELL = 5200;

const STEPS: {
  n: string;
  k: string;
  title: string;
  body: string;
  shot: ShotKey;
}[] = [
  {
    n: "01",
    k: "list",
    title: "Finding issue list",
    body: "Every observation in one list — severity, rack, bay, element, activity phase and the action already assigned.",
    shot: "findingsList",
  },
  {
    n: "02",
    k: "filter",
    title: "Filter and sort",
    body: "Filter by severity and flag, group by location, sort by date — twenty-four findings narrow to the seven that need action.",
    shot: "findingsFiltered",
  },
  {
    n: "03",
    k: "assign",
    title: "Action assignment",
    body: "Review the selected observations, set the action type and load handling, then assign it across all of them at once.",
    shot: "actionAssign",
  },
  {
    n: "04",
    k: "bill-of-quantity",
    title: "Bill of Quantity",
    body: "Twenty-five line items grouped by OEM — repair, replace and required quantities, labour and available stock. Out as PDF or Excel.",
    shot: "boq",
  },
  {
    n: "05",
    k: "maintenance",
    title: "Maintenance",
    body: "Repairs move through pending assignment, in progress, review and done — each with a priority, a due date and an owner.",
    shot: "maintenance",
  },
];

export function RiqAction() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    if (reduce || manual) return;
    const id = setInterval(() => setI((v) => (v + 1) % STEPS.length), DWELL);
    return () => clearInterval(id);
  }, [reduce, manual]);

  const pick = (n: number) => {
    setManual(true);
    setI(n);
  };

  const active = STEPS[i];
  const shot = SHOTS[active.shot];

  return (
    <Section surface="warm" id="q4">
      <SectionHeader
        eyebrow="Action"
        top="From thousands of findings"
        bottom="to one structured repair requirement."
        body="Because location, component, specification, classification and quantity are already structured, findings consolidate into a technical BoQ."
        size="compact"
        width="wide"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 lg:gap-12 items-start">
        {/* ── the four steps ───────────────────────────── */}
        <div
          className="flex flex-col"
          role="tablist"
          aria-label="From finding to maintenance"
        >
          {STEPS.map((s, n) => {
            const on = n === i;
            return (
              <button
                key={s.k}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => pick(n)}
                className="relative text-left py-5 pl-6 pr-2 outline-none focus-visible:ring-2 focus-visible:ring-signal-orange/50 rounded-r-lg"
                style={{
                  borderTop: n === 0 ? "none" : `1px solid ${LINE}`,
                }}
              >
                {/* rail — fills across the dwell on the active step */}
                <span
                  aria-hidden
                  className="absolute left-0 top-0 bottom-0 w-[2px] overflow-hidden"
                  style={{ background: "#E4E4E9" }}
                >
                  {on && (
                    <motion.span
                      key={`${s.k}-${manual}`}
                      className="block w-full origin-top"
                      style={{ background: "#FF6A00", height: "100%" }}
                      initial={{ scaleY: reduce || manual ? 1 : 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{
                        duration: reduce || manual ? 0.3 : DWELL / 1000,
                        ease: reduce || manual ? EASE : "linear",
                      }}
                    />
                  )}
                </span>

                <span className="flex items-baseline gap-3">
                  <span
                    className="text-[10px] font-mono font-bold tracking-[0.18em] tabular-nums transition-colors duration-200"
                    style={{ color: on ? "#FF6A00" : "rgba(51,54,58,0.35)" }}
                  >
                    {s.n}
                  </span>
                  <span
                    className={
                      "font-rams-heading text-[18px] sm:text-[20px] font-bold tracking-[-0.022em] transition-colors duration-200 " +
                      (on ? "text-carbon" : "text-graphite/50")
                    }
                  >
                    {s.title}
                  </span>
                </span>

                <AnimatePresence initial={false}>
                  {on && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="overflow-hidden text-[13.5px] leading-[1.6] text-graphite/60 pl-[30px] pr-2"
                    >
                      <span className="block pt-3">{s.body}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>

        {/* ── the screen ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="overflow-hidden bg-white"
          style={{
            borderRadius: 16,
            border: `1px solid ${LINE}`,
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
          }}
        >
          {/* browser chrome */}
          <div
            className="flex items-center gap-2 px-4 h-10 shrink-0"
            style={{ borderBottom: `1px solid #EDEDF1`, background: "#FAFAFB" }}
          >
            {[0, 1, 2].map((d) => (
              <span
                key={d}
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: "#E4E4E9" }}
              />
            ))}
            <div
              className="ml-3 flex-1 max-w-[320px] h-6 rounded-md flex items-center px-3 min-w-0"
              style={{ background: "#F1F1F4" }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={active.k}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="text-[10.5px] font-mono truncate text-graphite/45"
                >
                  app.rams.digital/irds/{active.k}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* the shot — contained, never cropped */}
          {/* The stage matches findings-list.png exactly (1916×908), so the
              real screen fills it edge to edge. Capture the remaining three
              from the same browser window and they will too; anything a
              different shape letterboxes rather than crops. */}
          <div
            className="relative aspect-[1916/908]"
            style={{ background: "#F5F5F7" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active.k}
                initial={{ opacity: 0, scale: 1.01 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.995 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="absolute inset-0"
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={shot.w}
                  height={shot.h}
                  sizes="(max-width: 1024px) 100vw, 820px"
                  className="w-full h-full object-contain"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

    </Section>
  );
}
