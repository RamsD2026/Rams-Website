"use client";

import { motion } from "framer-motion";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { GOVERNANCE } from "./download-data";

/**
 * 04 — Document governance.
 *
 * `CaseOutcomes`, `VideoNext` and `WebinarTracks` are the reference: bare
 * columns, a heading, a line, no box. Five of them, so 3 + 2 — the same count
 * the videos library settled at, and the alternative is padding to six with
 * an invented sixth control.
 *
 * ── It is addressed to the people who publish, not the reader ───────
 * The source is explicit that this is CMS guidance: owner, version, scope,
 * access level, change history. That is unusual on a public page and it earns
 * its place here — a downloads page whose files carry no version or owner is
 * how a superseded specification ends up in a tender, and saying so out loud
 * is what makes the request-only workflow above read as care rather than as a
 * missing feature.
 */

export function DownloadGovernance() {
  return (
    <Section surface="offWhite" id="governance">
      <SectionHeader
        eyebrow="Document governance"
        top="Make every file"
        bottom="Useful and trustworthy."
        size="compact"
        width="wide"
        body="Product material is most valuable when a reader can see its scope, its owner and its version status."
        className="!mb-10 sm:!mb-12"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
        {GOVERNANCE.map((g, i) => (
          <motion.div
            key={g.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.07, ease: EASE }}
            className="flex flex-col"
          >
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-signal-orange tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>

            <h3 className="mt-4 text-[19px] sm:text-[20px] font-semibold tracking-[-0.02em] text-carbon leading-[1.25]">
              {g.title}
            </h3>

            <p className="mt-2.5 text-[14px] leading-[1.65] text-graphite/60">
              {g.body}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
