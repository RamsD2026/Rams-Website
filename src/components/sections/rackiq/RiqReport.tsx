"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "./rackiq-shared";

/**
 * Reporting — deliberately late, and deliberately framed as an output.
 *
 * Centred header, then the real designed cover of each report the dataset
 * produces. The report-builder screenshot is gone: the section's claim is that
 * the report is an output, and leading with the builder made the tool the
 * subject.
 *
 * Covers are 1054×1492 originals, re-encoded to 700px WebP — 4.8 MB of PNG
 * down to 317 KB, and still 3× the ~230px they render at.
 */

const PAGES = [
  { title: "Executive summary", file: "executive_summary" },
  { title: "Detailed finding", file: "detailed_finding" },
  { title: "Integrity-test result", file: "integrity_test_result" },
  { title: "Hotspot map", file: "hotspot_map" },
  { title: "Corrective-action summary", file: "corrective_action_summary" },
];

export function RiqReport() {
  return (
    <Section surface="white" id="report">
      <SectionHeader
        eyebrow="Reporting"
        top="The report is an output of the system"
        bottom="— not the system itself."
        size="compact"
        width="wide"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {PAGES.map(({ title, file }, i) => (
          <motion.div
            key={file}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: i * 0.06, ease: EASE }}
            className="text-center"
          >
            {/* the cover — box matches the source so nothing crops */}
            <div
              className="relative overflow-hidden"
              style={{
                aspectRatio: "1054 / 1492",
                borderRadius: 10,
                border: "1px solid #E4E4E9",
                boxShadow: "0 12px 30px rgba(17,17,19,0.06)",
              }}
            >
              <Image
                src={`/Product/irds/reports/${file}.webp`}
                alt={`${title} — IRDS report cover`}
                width={700}
                height={991}
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 240px"
                className="block w-full h-full object-cover"
              />
            </div>

            <p className="mt-3.5 text-[13px] text-graphite/60">{title}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-16 sm:mt-20 text-center"
      >
        <p className="font-rams-heading text-[22px] sm:text-[28px] lg:text-[32px] font-bold tracking-[-0.025em] leading-[1.2] text-carbon">
          One structured dataset.{" "}
          <span className="text-graphite/45">Multiple operational outputs.</span>
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-flex items-center gap-2 text-[15px] font-semibold text-carbon px-7 py-3.5 rounded-full transition-all duration-200 hover:bg-carbon hover:text-white"
          style={{ boxShadow: "inset 0 0 0 1.5px #D9DBDD" }}
        >
          View Sample IRDS Report
        </Link>
      </motion.div>
    </Section>
  );
}
