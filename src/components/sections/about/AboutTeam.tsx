"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 09 — The team behind RAMS.
 *
 * Four disciplines as the home page's Platform Intelligence cards: a portrait
 * photograph with the discipline over it, flipping on hover to a white face
 * carrying the line.
 *
 * ── It is `OperationShowcase`'s card, value for value ────────────────
 *
 *   the tile is 3 / 5 on a 1600px perspective, `transformStyle: preserve-3d`
 *   rotateY 0 -> 180 on hover, 0.7s on [0.4, 0, 0.2, 1]
 *   both faces are absolutely placed with `backfaceVisibility: hidden`
 *   18px radius, a 1px #E8E8ED hairline on each face
 *   the front is the photograph, a scrim from 55% down to rgba(0,0,0,0.55),
 *     and the label at the bottom edge in 28/30 bold
 *   the back is white, padded 40 / 32 / 32, an orange kicker at 10.5px
 *     tracked 0.16em, then the copy
 *
 * ── What is different, and why ──────────────────────────────────────
 * No CTA on the back. On the home page it opens a modal of three product
 * captures; a discipline has nothing behind it, and a button that does nothing
 * when pressed is worse than no button. Its place at the foot of the card is
 * taken by the domain the discipline owns, above a hairline — which is the
 * section's own subject line ("structures, sites, operations, data and
 * software") mapped one to one onto the four, rather than a phrase invented to
 * fill the space.
 *
 * The body sits at 14.5px rather than the home page's 13px: that card carries
 * a kicker, a heading, three lines and a button, and this one carries a
 * sentence.
 *
 * ── The photography ─────────────────────────────────────────────────
 * One per discipline, and each is the discipline at work:
 *
 *   Engineers            two people over a printed rack elevation, a laptop
 *   Field specialists    a specialist on a scissor lift at an upper beam
 *   Technologists        over the shoulder at a workstation, screens unreadable
 *   Operations thinkers  three managers on a mezzanine over the floor
 *
 * They are deliberately unlike the eight already on this page — `AboutStory`
 * holds four ground-level working shots and `AboutThink` four more, so these
 * take the positions those do not: a table, a height, a desk and a gallery.
 *
 * Generated rather than taken from a stock library, and every prompt asked for
 * no text, no signage and no logos, so nothing in frame is a mark that belongs
 * to somebody. Nobody here is captioned as a real person: the labels are
 * disciplines. Exported at 586×977, 2× the 293px card.
 */

const DISCIPLINES: {
  id: string;
  img: string;
  alt: string;
  name: string;
  domain: string;
  body: string;
}[] = [
  {
    id: "engineers",
    img: "/about/team/engineers.webp",
    alt: "Two engineers at a site table studying a large printed structural elevation drawing of steel racking, a laptop and hard hats beside it",
    name: "Engineers",
    domain: "Structures",
    body: "Translate physical structures, constraints, measurements and risk into dependable digital context.",
  },
  {
    id: "field",
    img: "/about/team/field.webp",
    alt: "A specialist in a high-visibility vest and helmet on a scissor lift platform, inspecting an upper beam connection of warehouse racking at height",
    name: "Field specialists",
    domain: "Sites",
    body: "Bring the practical reality of inspection, safety, maintenance and site implementation.",
  },
  {
    id: "technologists",
    img: "/about/team/technologists.webp",
    alt: "Over-the-shoulder view of a software engineer at a two-monitor workstation, the screens glowing and out of focus",
    name: "Technologists",
    domain: "Data and software",
    body: "Build the Digital Twin, applications, integrations, analytics, AI and edge systems.",
  },
  {
    id: "operations",
    img: "/about/team/operations.webp",
    alt: "Three operations managers at the railing of a mezzanine walkway, looking out over a working warehouse floor below",
    name: "Operations thinkers",
    domain: "Operations",
    body: "Connect product capability to throughput, reliability, adoption and measurable business value.",
  },
];

const HAIR = "#E8E8ED";
const FACE = {
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
  borderRadius: 18,
  border: `1px solid ${HAIR}`,
} as const;

function FlipCard({ d }: { d: (typeof DISCIPLINES)[number] }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative w-full"
      style={{ perspective: "1600px", aspectRatio: "3 / 5" }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onFocus={() => setFlipped(true)}
      onBlur={() => setFlipped(false)}
      tabIndex={0}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* FRONT */}
        <div className="absolute inset-0 overflow-hidden" style={FACE}>
          <Image
            src={d.img}
            alt={d.alt}
            fill
            sizes="(max-width: 640px) 88vw, (max-width: 1024px) 44vw, 293px"
            className="object-cover object-center"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 p-8">
            <h3
              className="text-white text-[28px] sm:text-[30px] font-bold leading-[1.05]"
              style={{ letterSpacing: "-0.02em" }}
            >
              {d.name}
            </h3>
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 overflow-hidden bg-white flex flex-col"
          style={{ ...FACE, transform: "rotateY(180deg)" }}
        >
          <div
            className="flex flex-col h-full"
            style={{ padding: "40px 32px 32px 32px" }}
          >
            <p
              className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-signal-orange"
              style={{ marginBottom: 24 }}
            >
              {d.name}
            </p>

            <p className="text-[14.5px] leading-[1.7] text-graphite-alt">
              {d.body}
            </p>

            {/* The home page puts a button here. There is nowhere for one to
                go, so the domain sits in its place. */}
            <div style={{ marginTop: "auto", paddingTop: 24 }}>
              <span
                aria-hidden
                className="block w-8"
                style={{ height: 1, background: HAIR, marginBottom: 14 }}
              />
              <span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/45">
                {d.domain}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function AboutTeam() {
  return (
    <Section surface="white" id="team">
      <SectionHeader
        eyebrow="The team behind RAMS"
        top="Different disciplines."
        bottom="One physical reality."
        size="compact"
        width="wide"
        body="RAMS is built by people who understand structures, sites, operations, data and software — and know that none of them works alone."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {DISCIPLINES.map((d, i) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.35, delay: i * 0.06, ease: [0.4, 0, 0.2, 1] }}
          >
            <FlipCard d={d} />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
