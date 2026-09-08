"use client";

import { motion } from "framer-motion";
import { History, Hourglass, Puzzle, Unlink } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 02 — Why RAMS exists.
 *
 * The site's section, not a bespoke one. An earlier pass set this page as a
 * ranged-left document with its own header component; this is `SectionHeader`
 * at `compact` and the standard four-up card, so it matches the platform and
 * solution pages exactly — centred eyebrow, two-line heading, subline, then
 * four cards on `gap-5` with a 48px tinted icon tile, a 20/21px bold title and
 * 14px/1.65 body.
 *
 * The source numbers these 01–04 and the numerals are gone, as on every other
 * page carrying this section: four symptoms of one problem are not a sequence.
 * The icon tile is what the site puts there instead.
 *
 * Each icon reads its own title. `History` is a clock turned backwards, which
 * is what an outdated model is; `Unlink` is the record separating from the
 * asset; `Puzzle` is a system that holds one piece; `Hourglass` is information
 * arriving after the fact. None is decorative.
 *
 * Two titles carry a word or two more than the source's, on request, so all
 * four wrap to two lines. The card reserves two lines with `min-h-[2.4em]`
 * either way, so a one-line title left a visible hole above its body copy and
 * broke the row's rhythm.
 *
 * The extra words come from each card's own body rather than being padding:
 * "operating history" is what the body means by condition, movement and
 * maintenance separating from the asset, and "after reality changes" is its
 * "reality may have changed".
 *
 * Hover is the shared signature, namespaced `abtwhy`.
 */

const CARDS = [
  {
    icon: History,
    title: "The model becomes outdated",
    body: "Drawings and layouts rarely preserve every change made after installation.",
  },
  {
    icon: Unlink,
    title: "Assets lose their operating history",
    body: "Condition, movement, maintenance and documents separate from the physical asset.",
  },
  {
    icon: Puzzle,
    title: "Systems explain fragments",
    body: "WMS, ERP, sensors and reports each see part of the operation — not the whole context.",
  },
  {
    icon: Hourglass,
    title: "Decisions arrive after reality changes",
    body: "By the time information moves through calls, reports and presentations, reality may have changed.",
  },
];

export function AboutWhy() {
  return (
    <Section surface="offWhite" id="why" paddingTop="tight">
      <style>{`
        @property --abtwhy-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .abtwhy-card { position: relative; isolation: isolate; }
        .abtwhy-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--abtwhy-shine-angle),
            transparent 0deg,
            transparent 300deg,
            rgba(255,106,0,0.9) 340deg,
            transparent 360deg
          );
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
                  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
          z-index: 1;
        }
        .abtwhy-card:hover::before {
          opacity: 1;
          animation: abtwhy-shine 2.4s linear infinite;
        }
        @keyframes abtwhy-shine {
          to { --abtwhy-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .abtwhy-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Why RAMS exists"
        top="Physical operations generate data"
        bottom="Very little of it has context."
        size="compact"
        width="wide"
        body="Facilities are managed through disconnected drawings, inspections, sensors, spreadsheets, systems and personal knowledge."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {CARDS.map((c, i) => (
          <motion.article
            key={c.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            className="abtwhy-card group relative flex flex-col p-7 sm:p-8 bg-white transition-all duration-300 hover:-translate-y-1"
            style={{
              borderRadius: 12,
              border: "1px solid #E8E8ED",
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
            }}
          >
            <div
              className="w-12 h-12 flex items-center justify-center mb-6"
              style={{
                borderRadius: 8,
                background: "rgba(255,106,0,0.08)",
                border: "1px solid rgba(255,106,0,0.18)",
              }}
            >
              <c.icon
                className="w-[22px] h-[22px] text-signal-orange"
                strokeWidth={2}
              />
            </div>

            {/* Two lines reserved — all four titles wrap. */}
            <h3 className="min-h-[2.4em] text-[20px] sm:text-[21px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
              {c.title}
            </h3>

            <p className="mt-4 text-[14px] text-graphite/65 leading-[1.65]">
              {c.body}
            </p>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
