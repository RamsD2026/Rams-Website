"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 03 — Partnership models.
 *
 * Four profiles on a row of tabs, and the one selected opens below as copy on
 * the left and a photograph on the right.
 *
 * ── The tabs are the home page's ────────────────────────────────────
 * A segmented pill: a #F2F2F2 track at 1.5 padding, four equal segments at
 * 13px medium on a full radius, the active one filled carbon and the rest
 * going orange on hover. `TechnologySystems` ships it on the home page and
 * this is the same object with different labels.
 *
 * It replaced four bordered cards carrying a name and a sub-line each. Those
 * were four objects competing with the panel underneath them; a pill is one
 * object, and the reader can see all four states at once without reading four
 * boxes. The sub-lines moved into the panel, where they are the kicker.
 *
 * Below `sm` the pill wraps to two rows rather than scrolling — four labels
 * at 13px do not fit a phone in one line, and a rounded track that scrolls
 * sideways hides its own ends.
 *
 * ── Why a selector and not four cards ───────────────────────────────
 * Because the reader is one of these four, not all of them. Four cards side
 * by side asks them to read three things that are not about them; a selector
 * asks them to pick themselves out of a list of four words and then reads
 * only their own. The source document does the same — "Select a profile to
 * see how the relationship can work."
 *
 * ── The panel is left copy, right picture ───────────────────────────
 * The layout the platform pages use for their capability sections, and the
 * one this site reaches for whenever a block has one subject and something to
 * show for it. The picture is what the earlier version of this section did
 * not have: four tabs over four blocks of type gave the reader no reason to
 * press a tab, because pressing one only swapped one paragraph for another.
 *
 * The columns are 0.9fr / 1.1fr rather than even. The copy runs to a
 * comfortable measure at 525px and the photograph wants the extra width — an
 * even split gives the type a measure that is too wide and the picture one
 * that is too narrow.
 *
 * ── The exchange is three points, stacked ───────────────────────────
 * What you bring, what RAMS adds, what the two make — one under the other,
 * with nothing drawn around them and nothing beside them.
 *
 * It has been a three-column row, a two-up with a filled outcome panel, and a
 * stack with an icon on every label. Each of those added structure to three
 * short lines that did not need it; the icons in particular put three glyphs
 * next to three labels that already say what they are. Label, value, next.
 *
 * ── Nothing below the panel may move ────────────────────────────────
 * The picture is fixed at 4:3, so its height never changes. The copy does, so
 * the left column carries a `min-h` and every varying line is pinned:
 * four profiles whose bodies wrap to different depths would otherwise shift
 * the whole section every time a tab is pressed. That is the rule the
 * two-state panels on the platform pages follow.
 *
 * ── The exchange is derived, not invented ───────────────────────────
 * The source spells the triplet out for the technology profile — "Technology,
 * interfaces and expertise / Context, applications and operations / A
 * connected customer solution". The other three are written from that
 * document's own descriptions of each profile: what the channel, delivery and
 * solution partner is said to do, put into the same three slots. Nothing here
 * claims a commercial term, a margin, a territory or an exclusivity, because
 * the source says explicitly that none of those is fixed on this page.
 *
 * ── The photography ─────────────────────────────────────────────────
 *   technology  a hardware engineer inspecting an unbranded sensor module
 *   channel     two people over a laptop in a meeting, an estate beyond
 *   delivery    an inspector at a rack frame with a tablet, a colleague behind
 *   solution    three colleagues drawing on a printed floor plan
 *
 * Generated rather than taken from a stock library, and every prompt asked for
 * no text, no signage and no logos, so nothing in frame is a mark that belongs
 * to somebody. Exported at 1280×960, 2× the 643px column.
 */

const MODELS: {
  id: string;
  tab: string;
  sub: string;
  title: string;
  body: string;
  bring: string;
  adds: string;
  outcome: string;
  img: string;
  alt: string;
}[] = [
  {
    id: "technology",
    tab: "Technology partner",
    sub: "Hardware, platforms and data",
    title: "Connect your technology to physical context.",
    body: "Integrate supported sensors, machines, enterprise systems or specialist data services with the RAMS Digital Twin and application layer.",
    bring: "Technology, interfaces and expertise",
    adds: "Context, applications and operations",
    outcome: "A connected customer solution",
    img: "/partners/models/technology.webp",
    alt: "A hardware engineer at a workbench holding up a small unbranded sensor module, a laptop and mounting brackets laid out beside it",
  },
  {
    id: "channel",
    tab: "Channel partner",
    sub: "Market access and co-selling",
    title: "Take the platform to the customers you already hold.",
    body: "Introduce, qualify and co-sell RAMS opportunities in agreed sectors or territories, with joint account planning and solution discovery.",
    bring: "Market access and customer relationships",
    adds: "Platform, positioning and solution support",
    outcome: "Qualified opportunities in agreed sectors",
    img: "/partners/models/channel.webp",
    alt: "Two people at a meeting table in a bright office working over an open laptop, an industrial estate visible through the window behind",
  },
  {
    id: "delivery",
    tab: "Delivery partner",
    sub: "Inspection and implementation",
    title: "Execute the work with defined methods and evidence.",
    body: "Deliver approved inspection and implementation work using structured digital workflows, training pathways and quality review.",
    bring: "Field capability and local execution",
    adds: "Workflows, training and evidence standards",
    outcome: "Consistent delivery with attributable records",
    img: "/partners/models/delivery.webp",
    alt: "An inspector in a high-visibility vest crouched at a warehouse racking frame holding a rugged tablet, a colleague standing behind",
  },
  {
    id: "solution",
    tab: "Solution partner",
    sub: "Customer-specific applications",
    title: "Design applications around workflows nobody ships.",
    body: "Build customer-specific applications on the same physical context, for the operational problems that are not covered out of the box.",
    bring: "Domain knowledge and application design",
    adds: "Physical context, history and platform services",
    outcome: "An application built for one operation",
    img: "/partners/models/solution.webp",
    alt: "Three colleagues around a table in a bright office marking up a large printed warehouse floor plan",
  },
];

const HAIR = "#E8E8ED";

export function PartnersModels() {
  const [at, setAt] = useState(0);
  const m = MODELS[at];

  return (
    <Section surface="white" id="models">
      <SectionHeader
        eyebrow="Partnership models"
        top="Choose where you"
        bottom="Create the most value."
        size="compact"
        width="wide"
        body="The engagement model can reflect what you bring: technology, access to customers, field execution or the ability to design specialised solutions."
        className="!mb-10 sm:!mb-12"
      />

      {/* the tabs — the home page's segmented pill, value for value: a
          #F2F2F2 track at 1.5 padding, segments at 13px medium on a full
          radius, the active one filled carbon and the rest going orange on
          hover. Four equal segments, so `flex-1`. */}
      <div className="flex justify-center">
        <div
          role="tablist"
          aria-label="Partnership models"
          className="inline-flex flex-wrap sm:flex-nowrap items-center bg-[#F2F2F2] rounded-full p-1.5 gap-0.5 w-full max-w-[720px]"
        >
          {MODELS.map((x, i) => {
            const now = i === at;
            return (
              <button
                key={x.id}
                type="button"
                role="tab"
                aria-selected={now}
                onClick={() => setAt(i)}
                className={
                  "flex-1 basis-[calc(50%-2px)] sm:basis-auto py-2.5 px-3 text-[13px] font-medium transition-all duration-200 rounded-full whitespace-nowrap text-center " +
                  (now
                    ? "bg-carbon text-white"
                    : "text-graphite hover:text-signal-orange")
                }
              >
                {x.tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* the panel */}
      <div className="mt-10 sm:mt-12 grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-10 lg:gap-16 items-center">
        {/* left: the copy */}
        <div className="lg:min-h-[420px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              {/* The tab above is already lit with the profile's name, so
                  the kicker carries the line that used to sit under it in the
                  old tab card rather than repeating the name. */}
              <span className="text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
                {m.sub}
              </span>

              {/* Two lines reserved on the heading and three on the body —
                  four profiles that wrap to different depths would shift the
                  picture beside them every time a tab is pressed. */}
              <h3 className="mt-4 min-h-[2.4em] text-[26px] sm:text-[32px] font-bold tracking-[-0.03em] text-carbon leading-[1.2]">
                {m.title}
              </h3>

              <p className="mt-3 min-h-[4.9em] text-[15px] leading-[1.65] text-graphite/65">
                {m.body}
              </p>

              {/* Three points, one under the other. Nothing drawn around
                  them and nothing beside them: label, value, next. */}
              <div className="mt-8 flex flex-col gap-6">
                {(
                  [
                    ["You bring", m.bring],
                    ["RAMS adds", m.adds],
                    ["Joint outcome", m.outcome],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label} className="flex flex-col">
                    <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-graphite/45">
                      {label}
                    </span>
                    {/* Pinned: the three values wrap to one or two lines
                        depending on the profile, and the picture beside them
                        must not move when a tab is pressed. */}
                    <span className="mt-2 min-h-[1.45em] text-[15px] sm:text-[16px] font-semibold tracking-[-0.015em] text-carbon leading-[1.45]">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* right: the picture */}
        <div
          className="relative w-full overflow-hidden"
          style={{
            aspectRatio: "4 / 3",
            borderRadius: 18,
            border: `1px solid ${HAIR}`,
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.02), 0 22px 48px -26px rgba(0,0,0,0.22)",
          }}
        >
          <AnimatePresence>
            {/* Both frames stack in the same box and cross-fade. `mode="wait"`
                would empty the box between them, which reads as a flash. */}
            <motion.div
              key={m.id}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.015 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <Image
                src={m.img}
                alt={m.alt}
                fill
                sizes="(max-width: 1024px) 92vw, 643px"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
