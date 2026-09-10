"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { TRACKS } from "./webinar-data";

/**
 * 04 — Learning tracks.
 *
 * `CaseOutcomes`, `VideoNext` and the newsroom's kit are the reference: six
 * bare columns, a heading, a line, no box. Numbered here rather than
 * iconned, because a track is a sequence and the source numbers them.
 *
 * ── Every track goes to a page that exists ──────────────────────────
 * The source sends five of its six tracks to a filter on its own recordings
 * grid and the sixth to the AIMS page. A track that scrolls you 400px up the
 * same page is a heading pretending to be a link, and the recordings above
 * already have a filter bar with those exact topics in it.
 *
 * So each track points at the platform or solution page that covers it —
 * IRDS, RTSS, Digital Twin, Warehouse Execution, IMDS, AIMS. All six are
 * built routes. The source's fifth, "Engineering & Compliance", pointed at
 * `/resources/technical-notes`, which is a 404; it is replaced by fleet
 * health, which is a real page and a real track in the recordings above.
 */

export function WebinarTracks() {
  return (
    <Section surface="white" id="tracks">
      <SectionHeader
        eyebrow="Learning tracks"
        top="Follow the topics"
        bottom="That matter to you."
        size="compact"
        width="wide"
        body="The programme connects physical safety, asset condition, movement and management visibility. Each track has a page behind it."
        className="!mb-10 sm:!mb-12"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
        {TRACKS.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.07, ease: EASE }}
          >
            <Link href={t.href} className="group flex flex-col">
              <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-signal-orange tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>

              <h3 className="mt-4 inline-flex items-start gap-1.5 text-[19px] sm:text-[20px] font-semibold tracking-[-0.02em] text-carbon leading-[1.25] transition-colors duration-300 group-hover:text-signal-orange">
                {t.title}
                <ArrowUpRight
                  className="w-4 h-4 mt-1 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </h3>

              <p className="mt-2.5 text-[14px] leading-[1.65] text-graphite/60">
                {t.body}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
