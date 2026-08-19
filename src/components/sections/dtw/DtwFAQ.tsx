"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { EASE, Kicker } from "./dtw-shared";

const QA = [
  {
    q: "Do we need new hardware to build the twin?",
    a: "Not necessarily. The model is built from a survey of the site and then fed by whatever you already capture — WMS records, barcode scans, existing cameras and sensors. Extra sensing improves resolution, but the twin does not require replacing your stack.",
  },
  {
    q: "How is this different from the warehouse map in our WMS?",
    a: "A WMS holds slot records. It does not model the physical structure, its condition, or how either changes over time. The twin models the site itself — rack elements, damage, equipment and movement — and keeps a versioned history of all of it.",
  },
  {
    q: "What happens when we change the layout?",
    a: "The model is edited to match and the change is recorded rather than overwritten. Earlier states stay queryable, so reporting across a period that spans the change is still accurate.",
  },
  {
    q: "Which RAMS systems depend on it?",
    a: "IRDS, MEPS, ATOS, RTSS, IMDS and AIMS all resolve their data against the twin. That is what lets a rack finding, a pallet move and a task refer to the same location without translation between systems.",
  },
  {
    q: "Can we get the data out?",
    a: "Yes. The twin exposes a REST API and event webhooks, and can feed a data warehouse or BI tool directly. It is designed to be a source your other systems read from, not a closed store.",
  },
  {
    q: "How long does it take to stand up?",
    a: "It depends on site size and how much of the layout is already documented. The survey and model build are the fixed work; connecting existing data sources is usually the faster part.",
  },
];

export function DtwFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      className="relative text-white border-t border-white/[0.07]"
      style={{ background: "#08080A" }}
    >
      <div className="rams-container py-28 sm:py-36">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-[0.7fr_1.3fr] gap-12 lg:gap-20 items-start">
          <div>
            <Kicker>Questions</Kicker>
            <h2 className="mt-5 text-[34px] sm:text-[46px] lg:text-[54px] font-bold leading-[1.05] tracking-[-0.038em]">
              You have questions. <br />
              <span className="text-white/40">The twin has answers.</span>
            </h2>
          </div>

          <div className="flex flex-col">
            {QA.map((item, i) => {
              const on = open === i;
              return (
                <div
                  key={item.q}
                  style={{
                    borderTop:
                      i === 0 ? "none" : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <button
                    onClick={() => setOpen(on ? null : i)}
                    aria-expanded={on}
                    className="flex items-start justify-between gap-6 w-full text-left py-6"
                  >
                    <span className="text-[17px] sm:text-[18px] font-semibold leading-[1.4] tracking-[-0.01em]">
                      {item.q}
                    </span>
                    <span
                      className="shrink-0 w-8 h-8 rounded-full grid place-items-center transition-all duration-300"
                      style={{
                        background: on ? "#FF6A00" : "rgba(255,255,255,0.05)",
                        border: on
                          ? "1px solid #FF6A00"
                          : "1px solid rgba(255,255,255,0.12)",
                        transform: on ? "rotate(45deg)" : "rotate(0deg)",
                      }}
                    >
                      <Plus
                        className="w-4 h-4"
                        strokeWidth={2.2}
                        style={{ color: on ? "#FFFFFF" : "rgba(255,255,255,0.6)" }}
                        aria-hidden
                      />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="pb-7 pr-14 text-[14.5px] text-white/50 leading-[1.75]">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
