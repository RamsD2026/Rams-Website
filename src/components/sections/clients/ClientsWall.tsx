"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Section, EASE } from "@/components/sections/rackiq/rackiq-shared";
import { RiqClients } from "@/components/sections/rackiq/RiqClients";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { CLIENTS, FOOTPRINT, HERO_GRID, SECTORS } from "./client-data";

/**
 * Clients — the logo wall.
 *
 * Built from the clients document RAMS supplied, rewritten in this site's
 * vocabulary rather than transcribed: the reference page had its own header,
 * its own typeface, square cards and a filter bar; this has the dark hero
 * every page here opens with, the section header shape, the card radius and
 * border the rest of the site uses, and the surfaces alternating light to
 * dark down the page.
 *
 * ── What changed from the reference, and why ────────────────────────
 * The reference filtered the wall by sector, but only twelve of its ninety
 * organisations carried a sector; classifying the other seventy-eight would
 * have meant guessing which industry a customer belongs to, and a wrong
 * guess about a real company is worse than no filter. The wall takes a name
 * filter instead — which is what someone looking for their own company, or
 * a competitor, actually does.
 *
 * Sixteen of the ninety have no logo in the source. They are listed by name
 * in the same cell a logo would occupy, because inventing a mark for a real
 * company is not an option.
 *
 * The disclaimer at the foot of the wall is the reference's own and stays
 * verbatim: a named relationship is not a claim about which products that
 * customer runs or what results they saw.
 */

const JOURNEY = [
  {
    step: "01",
    title: "Understand the site",
    body: "Assess the asset, condition, movement, risk and operational constraint before deciding what to change.",
    product: "Engineering services",
  },
  {
    step: "02",
    title: "Make it visible",
    body: "Model the facility and tag the assets so inspection, movement and event data has a clear physical context.",
    product: "RAMS Digital Twin",
  },
  {
    step: "03",
    title: "Connect the signals",
    body: "Bring sensors, AI vision, location data and enterprise systems into the same operational picture.",
    product: "Hardware + integrations",
  },
  {
    step: "04",
    title: "Improve the operation",
    body: "Use applications to prioritise risk, manage work and learn across sites, assets and teams.",
    product: "RAMS applications",
  },
];

const OUTCOMES = [
  {
    num: "01",
    title: "Safety",
    body: "Understand physical risk, evidence it clearly and drive actions through to verified closure.",
  },
  {
    num: "02",
    title: "Visibility",
    body: "See assets, activities and conditions in their exact physical and operational context.",
  },
  {
    num: "03",
    title: "Productivity",
    body: "Understand how MHEs, people and workflows produce work — and where capacity is being lost.",
  },
  {
    num: "04",
    title: "Continuity",
    body: "Build a persistent history of assets, events and improvements instead of starting from a new report each time.",
  },
];

/* The ids are the anchors the footer links to; keep them if an entry is
   renamed, or those five links go nowhere. */
const INDUSTRIES = [
  {
    id: "warehousing",
    num: "01",
    title: "Warehousing & distribution",
    body: "Improve safety, movement, storage and execution across the facility.",
  },
  {
    id: "3pl",
    num: "02",
    title: "3PL & logistics",
    body: "Bring consistency and visibility to complex, multi-client operations.",
  },
  {
    id: "manufacturing",
    num: "03",
    title: "Manufacturing",
    body: "Connect machines, people, material flow and facility infrastructure.",
  },
  {
    id: "automotive",
    num: "04",
    title: "Automotive",
    body: "Support traceable, efficient operations around parts, MHEs and production assets.",
  },
  {
    id: "fmcg",
    num: "05",
    title: "FMCG & food",
    body: "Manage fast-moving inventory, safety-sensitive zones and high-throughput work.",
  },
  {
    id: "pharmaceuticals",
    num: "06",
    title: "Pharma & healthcare",
    body: "Build location-aware visibility and evidence around regulated physical processes.",
  },
  {
    id: "industrial",
    num: "07",
    title: "Industrial & utilities",
    body: "Make asset condition, maintenance and operational events easier to understand.",
  },
  {
    id: "ecommerce",
    num: "08",
    title: "Retail & e-commerce",
    body: "Improve fulfilment flow, storage accuracy and performance across sites.",
  },
  /* These two are not in the source document, but the navigation and the
     footer link to `#cold-storage` and `#food-beverage`, and an anchor with
     nothing behind it dumps the reader at the top of the page. The wording is
     RAMS's own, from the industry pages this page replaced. */
  {
    id: "cold-storage",
    num: "09",
    title: "Cold storage",
    body: "Temperature-controlled operations: dwell, door-open time, battery drain and rack condition in a harsh environment.",
  },
  {
    id: "food-beverage",
    num: "10",
    title: "Food & beverage",
    body: "Cold chain and FIFO compliance across high-throughput, safety-sensitive work.",
  },
];

export function ClientsWall() {
  return (
    <>
      {/* ── 01 hero ─────────────────────────────────────── */}
      <section
        className="relative overflow-hidden text-white"
        id="top"
        data-hero-tone="dark"
        style={{
          background:
            "radial-gradient(80% 100% at 50% 0%, #1D1D1F 0%, #0E0E0F 55%, #08080A 100%)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[720px]"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 15%, rgba(255,106,0,0.20), transparent 70%)",
          }}
        />

        {/* Centred, like every other hero on the site, with the marks moving
            underneath on the shared strip rather than sitting in a static
            panel beside the words. The split hero the reference used put the
            headline off to one side and froze the logos — neither is how this
            site opens a page. */}
        <div className="relative rams-container pt-36 sm:pt-44 lg:pt-48 pb-16 sm:pb-20">
          <div className="max-w-[1000px] mx-auto text-center">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: EASE }}
                className="text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange"
              >
                RAMS customer footprint
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
                className="mt-6 text-[44px] sm:text-[64px] lg:text-[82px] font-bold leading-[1.04] tracking-[-0.045em]"
              >
                <span className="block text-white">Trusted where the</span>
                <span className="block text-white/45">work actually is.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
                className="mt-6 text-[15px] sm:text-[16px] leading-[1.6] text-white/55 max-w-[760px] mx-auto"
              >
                Teams that run complex physical facilities across logistics,
                manufacturing, automotive, consumer goods and industrial
                operations — in the warehouse, on the floor, against the rack.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
                className="mt-9 flex items-center justify-center gap-3 flex-wrap"
              >
                <Link
                  href="#portfolio"
                  className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3 rounded-lg transition-colors duration-200 hover:bg-signal-orange-hover"
                >
                  See the portfolio
                  <ArrowRight className="w-4 h-4" aria-hidden />
                </Link>
                <Link
                  href="/company/contact"
                  className="inline-flex items-center gap-2 text-white text-[14px] font-semibold px-6 py-3 rounded-lg border border-white/15 transition-colors duration-200 hover:bg-white/[0.06]"
                >
                  Talk to RAMS
                </Link>
              </motion.div>

              {/* Twelve marks, six across and two deep, straight on the hero —
                  no cells, no fill, no borders. They come from the knocked-out
                  colour set, whose artwork is transparent and so needs nothing
                  behind it. The marks keep their own colours rather than the
                  white knockouts the strip uses — this grid is the one place on
                  the page where a reader should recognise a brand at a glance.
                  The strip below keeps moving through the wider list. Four
                  across on a phone, where six would be stamps. */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
                className="mt-14 sm:mt-16 max-w-[1080px] mx-auto grid grid-cols-4 sm:grid-cols-6 gap-x-8 gap-y-10"
              >
                {HERO_GRID.map((c) => (
                  <div
                    key={c.name}
                    title={c.name}
                    className="flex items-center justify-center"
                  >
                    <Image
                      src={c.logo as string}
                      alt={c.name}
                      width={140}
                      height={56}
                      className="max-h-7 w-auto object-contain"
                    />
                  </div>
                ))}
              </motion.div>

              {/* footprint */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.38, ease: EASE }}
                className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8 pt-10 border-t border-white/[0.09] max-w-[860px] mx-auto"
              >
                {FOOTPRINT.map((f) => (
                  <div key={f.label}>
                    <p className="text-[30px] sm:text-[34px] font-bold tracking-[-0.03em] leading-none text-white">
                      {f.value}
                    </p>
                    <p className="mt-2 text-[11px] font-mono font-semibold tracking-[0.14em] uppercase text-white/35">
                      {f.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          <RiqClients label="Built with industry" />
        </div>

        {/* sector rail */}
        <div className="relative border-t border-white/[0.07]">
          <div className="rams-container py-4 flex items-center gap-5 flex-wrap justify-center">
            {SECTORS.map((s, i) => (
              <span key={s} className="flex items-center gap-5">
                <span className="text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase text-white/30">
                  {s}
                </span>
                {i < SECTORS.length - 1 && (
                  <span
                    aria-hidden
                    className="w-1 h-1 rounded-full bg-signal-orange/40"
                  />
                )}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 02 the wall ─────────────────────────────────── */}
      <Section surface="white" id="portfolio">
        <SectionHeader
          eyebrow="Selected customer organisations"
          top="Ninety operations,"
          bottom="one operating context."
          size="compact"
          body="A selection of the organisations represented in the RAMS customer portfolio."
          className="!mb-8 sm:!mb-10"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-[#E8E8ED] border border-[#E8E8ED]">
          {CLIENTS.map((c) => (
            <div
              key={c.name}
              title={c.name}
              className="group aspect-[3/2] flex items-center justify-center bg-white p-5 transition-colors duration-200 hover:bg-[#FAFAFA]"
            >
              {c.logo ? (
                <Image
                  src={c.logo}
                  alt={c.name}
                  width={160}
                  height={64}
                  className="max-h-9 w-auto object-contain"
                />
              ) : (
                <span className="text-center text-[12.5px] leading-[1.35] font-semibold text-graphite/55 transition-colors duration-200 group-hover:text-carbon">
                  {c.name}
                </span>
              )}
            </div>
          ))}
        </div>


        <p className="mt-8 text-[12px] leading-[1.6] text-graphite/45 max-w-[760px] mx-auto text-center">
          Customer organisations are shown as references from the RAMS customer
          portfolio. A listed relationship does not imply use of every RAMS
          product or a specific outcome.
        </p>
      </Section>

      {/* ── 03 how customers start ──────────────────────── */}
      <Section surface="darkMid" id="approach">
        <SectionHeader
          eyebrow="How customers start, then grow"
          top="From a site problem"
          bottom="to a connected operating layer."
          size="compact"
          tone="dark"
          body="Start at the point of value. Add visibility, context and coordinated action over time."
          className="!mb-10 sm:!mb-12"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {JOURNEY.map((j, i) => (
            <motion.div
              key={j.step}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
              className="flex flex-col h-full p-6"
              style={{
                borderRadius: 12,
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span className="text-[10.5px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange">
                {j.step}
              </span>
              <h3 className="mt-4 text-[20px] font-semibold tracking-[-0.02em] text-white leading-[1.2]">
                {j.title}
              </h3>
              <p className="mt-2.5 text-[14px] leading-[1.6] text-white/55 flex-1">
                {j.body}
              </p>
              <span className="mt-5 inline-flex text-[11px] font-mono font-semibold tracking-[0.14em] uppercase text-white/35">
                {j.product}
              </span>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── 04 outcomes ─────────────────────────────────── */}
      <Section surface="offWhite" id="outcomes">
        <SectionHeader
          eyebrow="The outcomes that matter"
          top="Built for decisions"
          bottom="that improve the ground operation."
          size="compact"
          body="The platform turns scattered physical signals into useful, accountable action."
          className="!mb-10 sm:!mb-12"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {OUTCOMES.map((o, i) => (
            <motion.div
              key={o.num}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
              className="h-full p-6 bg-white"
              style={{
                borderRadius: 12,
                border: "1px solid #E8E8ED",
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
              }}
            >
              <span className="text-[10.5px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange">
                {o.num}
              </span>
              <h3 className="mt-4 text-[20px] font-semibold tracking-[-0.02em] text-carbon">
                {o.title}
              </h3>
              <p className="mt-2.5 text-[14.5px] leading-[1.6] text-graphite/65">
                {o.body}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── 05 industries ───────────────────────────────── */}
      <Section surface="white" id="industries">
        <SectionHeader
          eyebrow="A platform for varied operations"
          top="One operating context."
          bottom="Many physical environments."
          size="compact"
          body="RAMS adapts to the equipment, the regulatory need and the working reality of each operation."
          className="!mb-10 sm:!mb-12"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {INDUSTRIES.map((ind, i) => (
            <motion.div
              key={ind.id}
              id={ind.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: (i % 4) * 0.06, ease: EASE }}
              className="scroll-mt-32 pt-5 border-t border-[#E8E8ED]"
            >
              <span className="text-[10.5px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange">
                {ind.num}
              </span>
              <h3 className="mt-3 text-[18px] font-semibold tracking-[-0.02em] text-carbon leading-[1.25]">
                {ind.title}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.6] text-graphite/65">
                {ind.body}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── 06 close ────────────────────────────────────── */}
      <section
        className="relative overflow-hidden text-white"
        style={{
          background:
            "radial-gradient(80% 100% at 50% 100%, #1D1D1F 0%, #0E0E0F 55%, #08080A 100%)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[520px]"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 100%, rgba(255,106,0,0.18), transparent 70%)",
          }}
        />
        <div className="relative rams-container text-center pt-28 sm:pt-36 lg:pt-40 pb-28 sm:pb-36 lg:pb-40">
          <p className="text-[12px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange">
            Start with your operation
          </p>
          <h2 className="mt-5 text-[32px] sm:text-[46px] lg:text-[60px] font-bold tracking-[-0.04em] leading-[1.06] mx-auto max-w-[900px]">
            <span className="text-white">Build the next operating layer</span>
            <br />
            <span className="text-white/45">
              around the facility you{" "}
              <span className="text-signal-orange">already have</span>.
            </span>
          </h2>
          <p className="mt-7 text-[16px] sm:text-[18px] text-white/55 leading-[1.6] max-w-[880px] mx-auto">
            Tell us what needs attention on the ground and we will help identify
            the right starting point — from assessment and asset context to
            connected operational intelligence.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3.5 flex-wrap">
            <Link
              href="/company/contact"
              className="inline-flex items-center gap-2 bg-signal-orange text-white text-[16px] font-semibold px-8 py-4 rounded-full transition-colors duration-200 hover:bg-signal-orange-hover"
            >
              Talk to RAMS
              <ArrowUpRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="/resources/case-studies"
              className="inline-flex items-center gap-2 text-white text-[16px] font-semibold px-8 py-4 rounded-full border border-white/15 transition-colors duration-200 hover:bg-white/[0.06]"
            >
              Read the case studies
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
