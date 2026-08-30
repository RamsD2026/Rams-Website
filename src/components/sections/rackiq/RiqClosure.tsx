"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Flow, SHOTS, Section } from "./rackiq-shared";

/**
 * Question 05 — closure.
 *
 * Centred header, then the real Task Details screen at full container width.
 * Dropping the two-column split gives the screenshot the whole 1232px rather
 * than the ~555px a copy column left it, which is the difference between the
 * screen reading as evidence and reading as a thumbnail.
 *
 * The screen's primary action — Verify & Close Issue — is the section's
 * argument, which is why it is shown rather than described.
 */

const LINE = "#E8E8ED";

export function RiqClosure() {
  const shot = SHOTS.taskDetails;

  return (
    <Section surface="warm" id="q5">
      <SectionHeader
        eyebrow="Closure"
        top="Repair is not closure."
        bottom="Verification is."
        body="IRDS retains the corrective action, completion evidence, responsible party, verification record and reviewer. Once verified, the finding closes — while the record is preserved."
        size="compact"
        width="wide"
        className="!mb-10 sm:!mb-12"
      />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.55, ease: EASE }}
        className="mb-12 sm:mb-14"
      >
        <Flow
          steps={["Correct", "Verify", "Close", "Remember"]}
          size="sm"
          center
        />
      </motion.div>

      {/* ── the screen ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="overflow-hidden bg-white"
        style={{
          borderRadius: 14,
          border: `1px solid ${LINE}`,
          boxShadow:
            "0 1px 2px rgba(0,0,0,0.02), 0 16px 40px -20px rgba(14,14,15,0.16)",
        }}
      >
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
            <span className="text-[10.5px] font-mono truncate text-graphite/45">
              app.rams.digital/irds/maintenance/task
            </span>
          </div>
        </div>

        <Image
          src={shot.src}
          alt={shot.alt}
          width={shot.w}
          height={shot.h}
          sizes="(max-width: 1024px) 100vw, 1232px"
          className="block w-full h-auto"
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        className="mt-14 sm:mt-16 text-center font-rams-heading text-[22px] sm:text-[28px] lg:text-[32px] font-bold tracking-[-0.025em] leading-[1.2] text-carbon"
      >
        The issue closes.{" "}
        <span className="text-graphite/45">The intelligence remains.</span>
      </motion.p>
    </Section>
  );
}
