"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChapterHead, EASE, Section } from "./rackiq-shared";

/** The five questions, as the reference's card row. */

const QUESTIONS = [
  {
    n: "01",
    q: "What is the condition?",
    a: "Inspect and measure — on the rack, at the source.",
    href: "#q1",
  },
  {
    n: "02",
    q: "How serious is it?",
    a: "Compare against configured limits. Classify by risk.",
    href: "#q2",
  },
  {
    n: "03",
    q: "Why and where is it happening?",
    a: "Use the Digital Twin, history and spatial pattern.",
    href: "#q3",
  },
  {
    n: "04",
    q: "What needs to be done?",
    a: "Corrective action, responsibility and a technical BoQ.",
    href: "#q4",
  },
  {
    n: "05",
    q: "Was it solved — and is it recurring?",
    a: "Verify closure. Use history to reveal recurrence.",
    href: "#q5",
  },
];

export function RiqQuestions() {
  return (
    <Section surface="warm" id="questions">
      <ChapterHead
        eyebrow="How it works"
        top="The five questions"
        bottom="IRDS answers."
        lede="Condition → Classification → Pattern → Action → Closure → Intelligence."
      />

      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {QUESTIONS.map((item, i) => (
          <motion.div
            key={item.n}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
          >
            <Link
              href={item.href}
              className="group flex flex-col h-full px-6 py-7 transition-all duration-300 hover:-translate-y-1.5"
              style={{
                borderRadius: 18,
                background: "#FFFFFF",
                border: "1px solid #E4E4E9",
                minHeight: 226,
              }}
            >
              <span className="text-[13px] font-mono font-semibold text-signal-orange">
                {item.n}
              </span>
              <span className="mt-3.5 font-rams-heading text-[18px] font-bold tracking-[-0.02em] leading-[1.15] text-carbon">
                {item.q}
              </span>
              <span className="mt-2.5 flex-1 text-[13.5px] text-graphite/60 leading-[1.5]">
                {item.a}
              </span>
              <span className="mt-4 text-[13px] font-semibold text-signal-orange inline-flex items-center gap-1.5">
                See how
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
