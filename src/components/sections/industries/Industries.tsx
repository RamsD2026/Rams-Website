"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Boxes,
  Crosshair,
  Forklift,
  History,
  Layers,
  LineChart,
  PlugZap,
  RefreshCcw,
} from "lucide-react";
import { EASE, Section, SURFACE } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { ClientStrip } from "@/components/sections/ClientStrip";
import { EMAIL, PHONE_1, tel } from "@/components/sections/contact/contact-data";
import {
  GAP,
  INDUSTRIES,
  LAYERS,
  LENSES,
  REALITY,
  STEPS,
  type Industry,
} from "./industry-data";

/**
 * /industries — all nine, on one page.
 *
 * ── The Company pages' hero, not the resources pages' ───────────────
 * Industries is its own top-level section, and the ground is `AboutHero`'s:
 * the solutions radial inverted between white and offWhite, the orange glow
 * at 0.10, a 46/72/92 heading in one colour. Not `LightHeroGround` and the
 * orbiting tiles — that is the five `/resources` index pages' signature.
 *
 * ── Nine sections, one route ────────────────────────────────────────
 * The mega menu offers all nine industries as their own destinations across
 * three different slug spellings, and not one of those routes was built. They
 * all point at `/industries#<id>` now, and each industry is a full-width
 * section on this page carrying its own `id`.
 *
 * It was a three-up card grid for a revision. A card cannot be a destination:
 * landing on one puts a reader in the middle of a row with eight other things
 * competing for the same glance, and the card has to compress the problem and
 * the response to fit the column. A section can hold both at full length and
 * still be the thing a menu press lands on.
 *
 * A chip rail sat under the hero repeating the same nine for a revision and
 * was removed on request. The menu still reaches every section directly, and
 * the sections themselves are the index — nine headings down one page is a
 * list a reader can already see.
 *
 * ── The scope line is the source's, and it sits above the grid ──────
 * "Examples show typical use cases. Final capabilities depend on the agreed
 * audit, hardware, integration and application scope."
 *
 * Every card describes what RAMS *can* do in a sector, which on an industries
 * page reads as what it *will* do for the reader's own site. So the caveat is
 * placed where it is read before the cards rather than after them, and the
 * copy keeps the source's hedges — "supported", "approved", "typical".
 *
 * ── The section vocabulary is the site's ────────────────────────────
 * `Section` and `SectionHeader` at `compact`, `FilterBar` with the tabs left
 * and no search — nine items do not need one — bare columns with an orange
 * numeral, hairline rows for the stack, and the unified dark close.
 */

const HAIR = "#E0E0E6";

/**
 * One glyph per tier and per point, in the order the data lists them.
 *
 * They sit beside the arrays rather than inside them because `industry-data`
 * is a data file with no React in it — putting a component reference there
 * would make it one.
 */
const LAYER_ICONS = [LineChart, Layers, Boxes, PlugZap, Forklift];
const REALITY_ICONS = [Crosshair, RefreshCcw, History, Blocks];

/* ── 01 Hero ──────────────────────────────────────────────────────── */

export function IndustriesHero() {
  return (
    <section
      className="relative overflow-hidden"
      id="top"
      data-hero-tone="light"
      style={{
        background:
          "radial-gradient(80% 100% at 50% 0%, #FFFFFF 0%, #FBFBFC 55%, #F5F5F7 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[720px]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 20%, rgba(255,106,0,0.10), transparent 70%)",
        }}
      />

      {/* The measured field the copy sits on.

          Same 72px grid the dark heroes carry, inverted for a light ground:
          the line is the dotted field’s ink at a third of its weight, since a
          continuous rule reads far heavier than a dot at the same value.

          The mask is what makes it a ground rather than graph paper — it
          holds full strength under the heading and is gone by the edges and
          well before the client strip, so no line ever meets a logo or ends
          against the section boundary. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(14,14,15,0.035) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(14,14,15,0.035) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(78% 62% at 50% 26%, #000 0%, #000 42%, transparent 82%)",
          WebkitMaskImage:
            "radial-gradient(78% 62% at 50% 26%, #000 0%, #000 42%, transparent 82%)",
        }}
      />

      <div className="relative rams-container pt-40 sm:pt-48 lg:pt-56 pb-20 sm:pb-24 lg:pb-28">
        <div className="relative z-[1] max-w-[1180px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur"
            style={{ boxShadow: "inset 0 0 0 1px #E8E8ED" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
            <span className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-graphite/70">
              Industries we serve
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
            className="mt-8 sm:mt-10 text-[46px] sm:text-[72px] lg:text-[92px] font-bold leading-[1.04] tracking-[-0.045em] text-carbon"
          >
            Physical operations.
            <br />
            Industry-specific
            <br className="hidden sm:block" /> intelligence.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[16px] text-graphite/65 leading-[1.6] max-w-[860px] mx-auto"
          >
            Facility audits, Digital Twin context, connected hardware and
            operational applications — applied to the safety, visibility and
            performance problems that look different in every industry.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease: EASE }}
            className="mt-10 flex items-center justify-center gap-3 flex-wrap"
          >
            <Link
              href="#warehousing"
              className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-px hover:bg-signal-orange-hover"
            >
              View industry use cases
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="/company/contact"
              className="inline-flex items-center gap-2 bg-white text-carbon text-[14px] font-semibold px-6 py-3.5 rounded-full transition-colors duration-200 hover:bg-[#F5F5F7]"
              style={{ boxShadow: "inset 0 0 0 1px #E0E0E6" }}
            >
              Discuss your operation
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
          className="relative z-[1] mt-20 sm:mt-24"
        >
          <ClientStrip label="Trusted on the warehouse floor" />
        </motion.div>
      </div>
    </section>
  );
}

/* ── 02 The gap ───────────────────────────────────────────────────── */

export function IndustriesGap() {
  return (
    <Section surface="white" id="gap">
      <SectionHeader
        eyebrow="The industry gap"
        top="The warehouse"
        bottom="Is never generic."
        size="compact"
        width="wide"
        body="A cold store, a multi-client 3PL and an automotive plant may use similar racks, MHE and systems — but their constraints, risks and decisions are different."
        className="!mb-10 sm:!mb-12"
      />

      {/* The four gaps as bordered cards.

          Same shell as the tiers and the four realities further down — white,
          16px, a 1px inset hairline — so a reader meets one card on this page,
          not three. The gutters go even (gap-5) because a card carries its own
          edge and no longer needs the wide column gap that separated four
          columns of loose type.

          Hover is the shipped one: lift half a step, the hairline warms to the
          orange tint and a soft shadow appears under it. The number tile fills
          at the same time, which is what makes the whole card read as one
          object responding rather than a border changing colour. Both sit on
          the same 300ms so they move together. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {GAP.map((g, i) => (
          <motion.div
            key={g.n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: (i % 4) * 0.07, ease: EASE }}
            className="group flex flex-col h-full p-6 rounded-2xl bg-white transition-all duration-300 hover:-translate-y-0.5 shadow-[inset_0_0_0_1px_#E8E8ED] hover:shadow-[inset_0_0_0_1px_#FFC79A,0_18px_40px_-24px_rgba(8,8,10,0.30)]"
          >
            <span className="flex items-center justify-center w-10 h-10 shrink-0 rounded-[10px] bg-[rgba(255,106,0,0.08)] text-[11px] font-mono font-bold tracking-[0.14em] text-signal-orange tabular-nums transition-colors duration-300 group-hover:bg-signal-orange group-hover:text-white">
              {g.n}
            </span>

            <h3 className="mt-5 text-[17px] sm:text-[18px] font-semibold tracking-[-0.02em] text-carbon leading-[1.3]">
              {g.title}
            </h3>

            <p className="mt-2.5 text-[13.5px] leading-[1.65] text-graphite/60">
              {g.body}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ── 03 The nine, one section each ────────────────────────────────── */

/**
 * One industry, one full-width section.
 *
 * ── Why sections and not a grid of cards ────────────────────────────
 * The mega menu offers all nine as their own destinations. A card in a
 * three-up grid cannot be a destination — landing on it puts a reader in the
 * middle of a row with eight other things competing, and the card has to
 * compress the problem and the response into a few lines to fit.
 *
 * A section can. Each one carries its own `id`, its own surface, and enough
 * room for the problem and the response at full length. `scroll-mt-24` keeps
 * the heading clear of the fixed header when a deep link lands on it.
 *
 * ── The layout alternates, the type does not ────────────────────────
 * The mark column and the copy column swap sides on odd entries, so nine
 * sections in a row do not read as one section repeated nine times. Nothing
 * else changes between them — same type scale, same labels, same order — so
 * the alternation is rhythm rather than nine different designs.
 *
 * ── The media column is one object ──────────────────────────────────
 * The photograph, with the reference, the group, the code and the stack all
 * on it. Nothing sits underneath it and there is no rule between them.
 *
 * It was laid out the other way for a revision — reference above the picture,
 * a hairline under it, then the stack — which made the column three stacked
 * blocks rather than one. Everything there belongs to the same industry, so
 * it belongs inside the same frame.
 *
 * A three-stop scrim carries it: opaque enough at the foot to hold 11px chips
 * over a busy warehouse floor, gone by 62% so the picture is still a picture.
 * A second, much lighter wash falls from the top for the reference line.
 */
function IndustrySection({ item, i }: { item: Industry; i: number }) {
  const flip = i % 2 === 1;

  return (
    <Section
      surface={i % 2 === 0 ? "offWhite" : "white"}
      id={item.id}
      padding="tight"
      className="scroll-mt-24"
    >
      {/* The track is written the other way round on a flipped section.
          `order` reorders grid *placement*, not just paint order — so on a
          flipped section the media item, being `order-2`, was landing in the
          second column. With a 0.72fr / 1fr track that made every other
          photograph wider than the one above it. Swapping the track keeps the
          media column at 0.72fr whichever side it sits on. */}
      <div
        className={
          "grid grid-cols-1 gap-10 lg:gap-16 items-start " +
          (flip
            ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,0.72fr)]"
            : "lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)]")
        }
      >
        {/* the photograph, and everything that belongs to it, on it */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: EASE }}
          className={flip ? "lg:order-2" : undefined}
        >
          <div
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: "4 / 3",
              borderRadius: 16,
              background: "#0E0E0F",
            }}
          >
            <Image
              src={item.img}
              alt={item.alt}
              fill
              sizes="(max-width: 1024px) 92vw, 480px"
              className="object-cover"
            />

            {/* The scrim. Three stops rather than a flat wash: opaque enough
                at the foot to hold 11px chips over a busy warehouse floor,
                gone by 62% so the picture is still a picture. */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(8,8,10,0.92) 0%, rgba(8,8,10,0.66) 24%, rgba(8,8,10,0.18) 46%, transparent 62%)," +
                  "linear-gradient(to bottom, rgba(8,8,10,0.45) 0%, transparent 26%)",
              }}
            />

            {/* the reference and group, top */}
            <span className="absolute left-5 top-5 text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-white/75">
              {item.ref} · {item.group}
            </span>

            {/* the code and the stack, foot */}
            <div className="absolute inset-x-5 bottom-5">
              <p className="text-[34px] font-bold tracking-[-0.04em] text-white leading-none">
                {item.code}
              </p>

              <p className="mt-4 text-[9px] font-mono font-bold tracking-[0.18em] uppercase text-white/45">
                Typical RAMS stack
              </p>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {item.stack.map((m) => (
                  <span
                    key={m}
                    className="text-[11px] font-semibold text-white/85 px-2.5 py-1"
                    style={{
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.14)",
                      backdropFilter: "blur(6px)",
                      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)",
                    }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* the copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, delay: 0.08, ease: EASE }}
          className={flip ? "lg:order-1" : undefined}
        >
          <h2 className="text-[32px] sm:text-[40px] font-bold tracking-[-0.035em] text-carbon leading-[1.1]">
            {item.name}
          </h2>
          <p className="mt-3 text-[16px] sm:text-[17px] font-semibold tracking-[-0.015em] text-signal-orange">
            {item.tagline}
          </p>

          <div className="mt-9" style={{ borderTop: `1px solid ${HAIR}` }}>
            {(
              [
                ["Warehouse problem", item.problem],
                ["RAMS response", item.response],
              ] as [string, [string, string]][]
            ).map(([label, [head, detail]]) => (
              <div
                key={label}
                className="py-6"
                style={{ borderBottom: `1px solid ${HAIR}` }}
              >
                <p className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-graphite/35">
                  {label}
                </p>
                <p className="mt-3 text-[18px] sm:text-[19px] font-semibold tracking-[-0.02em] text-carbon leading-[1.35]">
                  {head}
                </p>
                <p className="mt-2.5 text-[15px] leading-[1.75] text-graphite/60 max-w-[640px]">
                  {detail}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

/**
 * All nine, in order.
 *
 * The source's caveat leads them rather than following: every section below
 * describes what RAMS *can* do in a sector, which on an industries page reads
 * as what it *will* do for the reader's own site.
 */
export function IndustrySections() {
  return (
    <>
      <Section surface="offWhite" paddingTop="tight" paddingBottom="strip">
        <SectionHeader
          eyebrow="Industry use cases"
          top="One physical platform."
          bottom="Nine operating realities."
          size="compact"
          width="wide"
          body="The warehouse problem, and the RAMS response, for each industry."
          className="!mb-8 sm:!mb-10"
        />

        <p className="text-center text-[12.5px] leading-[1.65] text-graphite/45 max-w-[820px] mx-auto">
          Examples show typical use cases. Final capabilities depend on the
          agreed audit, hardware, integration and application scope.
        </p>
      </Section>

      {INDUSTRIES.map((item, i) => (
        <IndustrySection key={item.id} item={item} i={i} />
      ))}
    </>
  );
}

/* ── 04 The operating layer ───────────────────────────────────────── */

export function IndustriesLayer() {
  return (
    <Section surface="white" id="layer">
      <SectionHeader
        eyebrow="Across every industry"
        top="A physical intelligence"
        bottom="Layer for the operation."
        size="compact"
        width="wide"
        body="The Digital Twin gives every event location and asset context; the applications turn that context into workflows and insight."
        className="!mb-10 sm:!mb-12"
      />

      {/* Five tiers, five columns, one line.

          They are a stack — Manage on top, Ground at the bottom — so laying
          them along a single row reads the way the stack does, left to
          right, with nothing wrapping to a second line to break the order.
          That fixes the measure at (1232 − 4×16) / 5 = 233px a card, so the
          type steps down a notch from the four-across cards elsewhere on
          the page and the icon tile sits above the label, not beside it.

          Everything is top-aligned and the card is sized by its content, not
          by a min-height. Both alternatives were tried and both were worse:
          a forced height leaves a foot of dead space under every card, and
          bottom-anchoring the text to absorb it makes the five tier labels
          land at five different heights, since each block is a different
          number of lines. Aligned tops are the only arrangement where the
          row reads as one horizontal stack; the leftover height falls under
          the shorter cards, where nothing is looking. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {LAYERS.map((l, i) => {
          const Icon = LAYER_ICONS[i];
          return (
            <motion.div
              key={l.tier}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
              className="flex flex-col h-full px-5 py-6"
              style={{
                borderRadius: 16,
                background: "#FFFFFF",
                boxShadow: "inset 0 0 0 1px #E8E8ED",
              }}
            >
              <span
                className="flex items-center justify-center w-10 h-10 shrink-0"
                style={{ borderRadius: 10, background: "rgba(255,106,0,0.08)" }}
              >
                <Icon
                  className="w-[18px] h-[18px] text-signal-orange"
                  strokeWidth={1.9}
                  aria-hidden
                />
              </span>

              <span className="mt-5 text-[9.5px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/35">
                {l.tier}
              </span>

              <p className="mt-2 text-[13.5px] font-bold tracking-[-0.02em] text-carbon leading-[1.45]">
                {l.title}
              </p>

              <p className="mt-3 text-[13px] leading-[1.7] text-graphite/60">
                {l.body}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* the four lenses */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
        {LENSES.map((l, i) => (
          <motion.div
            key={l.n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: (i % 4) * 0.07, ease: EASE }}
            className="flex flex-col"
          >
            <span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
              {l.n} / {l.name}
            </span>

            <h3 className="mt-4 text-[18px] sm:text-[19px] font-semibold tracking-[-0.02em] text-carbon leading-[1.3]">
              {l.title}
            </h3>

            <p className="mt-2.5 text-[14px] leading-[1.65] text-graphite/60">
              {l.body}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ── 05 How we engage ─────────────────────────────────────────────── */

export function IndustriesEngage() {
  return (
    <Section surface="offWhite" id="engage">
      <SectionHeader
        eyebrow="How we engage"
        top="Start with the problem"
        bottom="Not the module."
        size="compact"
        width="wide"
        body="RAMS can begin with an expert warehouse audit, a focused technology deployment or a phased combination of both."
        className="!mb-10 sm:!mb-12"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: (i % 4) * 0.07, ease: EASE }}
            className="flex flex-col"
          >
            <span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
              {s.n} / {s.name}
            </span>

            <h3 className="mt-4 text-[18px] sm:text-[19px] font-semibold tracking-[-0.02em] text-carbon leading-[1.3]">
              {s.title}
            </h3>

            <p className="mt-2.5 text-[14px] leading-[1.65] text-graphite/60">
              {s.body}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ── 06 Built for operational reality ─────────────────────────────── */

export function IndustriesReality() {
  return (
    <Section surface="white" id="reality">
      <SectionHeader
        eyebrow="Built for operational reality"
        top="An audit-grade view"
        bottom="Of the ground."
        size="compact"
        width="wide"
        body="RAMS is designed around the physical details that determine whether a facility is safe, visible and operable — not only around transactions in a business system."
        className="!mb-10 sm:!mb-12"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {REALITY.map(([title, body], i) => {
          const Icon = REALITY_ICONS[i];
          return (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.05, ease: EASE }}
              className="flex flex-col h-full p-6"
              style={{
                borderRadius: 16,
                background: "#FFFFFF",
                boxShadow: `inset 0 0 0 1px #E8E8ED`,
              }}
            >
              <span
                className="flex items-center justify-center w-11 h-11 shrink-0"
                style={{ borderRadius: 10, background: "rgba(255,106,0,0.08)" }}
              >
                <Icon
                  className="w-[19px] h-[19px] text-signal-orange"
                  strokeWidth={1.9}
                  aria-hidden
                />
              </span>

              <p className="mt-5 text-[15.5px] font-bold tracking-[-0.02em] text-carbon leading-[1.35]">
                {title}
              </p>

              <p className="mt-2.5 text-[13.5px] leading-[1.65] text-graphite/60">
                {body}
              </p>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

/* ── the close ────────────────────────────────────────────────────── */

export function IndustriesCTA() {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{ background: SURFACE.darkBottom }}
      id="start"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[520px]"
        style={{
          background:
            "radial-gradient(58% 60% at 50% 100%, rgba(255,106,0,0.16), transparent 70%)",
        }}
      />

      <div className="relative rams-container text-center pt-32 sm:pt-40 lg:pt-44 pb-32 sm:pb-40 lg:pb-44">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-[12px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange"
        >
          Your industry. Your operation.
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, ease: EASE }}
          className="mt-5 text-[32px] sm:text-[46px] lg:text-[58px] font-bold tracking-[-0.04em] leading-[1.06] mx-auto"
        >
          <span className="text-white">Bring us the</span>
          <br />
          <span className="text-white/45">
            physical <span className="text-signal-orange">problem</span>.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
          className="mt-7 text-[16px] sm:text-[18px] text-white/55 leading-[1.6] max-w-[880px] mx-auto"
        >
          We will help define the right combination of facility audit, Digital
          Twin, connected technology and operational applications for your
          site.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="mt-10 flex items-center justify-center gap-3.5 flex-wrap"
        >
          <Link
            href="/company/contact"
            className="inline-flex items-center gap-2 bg-signal-orange text-white text-[16px] font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:bg-signal-orange-hover hover:-translate-y-0.5"
          >
            Request an industry consultation
            <ArrowUpRight className="w-4 h-4" aria-hidden />
          </Link>
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex items-center gap-2 text-white text-[16px] font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:bg-white hover:text-carbon"
            style={{ boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.18)" }}
          >
            {EMAIL}
          </a>
          <a
            href={tel(PHONE_1)}
            className="inline-flex items-center gap-2 text-white/70 text-[16px] font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:text-white hover:bg-white/[0.06]"
            style={{ boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.12)" }}
          >
            {PHONE_1}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
