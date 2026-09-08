"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 12 — Work with RAMS.
 *
 * Two ways in, as two picture cards: the photograph, the audience, what they
 * start with, and the way through.
 *
 * ── Why two and not four ────────────────────────────────────────────
 * Because there are two. This is the only section on the page with a card
 * count under four, and it is the last thing before the close, so the cards
 * take half the measure each — 606px — and the photograph runs at 16:9 across
 * the top. Everything above this section is a set the reader scans; this one
 * is a choice they make, and two big cards is what a choice looks like.
 *
 * ── The two buttons are not the same weight ─────────────────────────
 * Filled orange for the operator, outlined for the partner. The site's palette
 * puts orange at "5% — CTAs, critical emphasis only", so two filled orange
 * buttons side by side would spend the whole allowance on one row and tell the
 * reader nothing about which door is theirs. An operator with a physical
 * problem is the page's primary reader; a partner is the second path.
 *
 * Both go to `/contact`, which is the route the platform closes already link
 * to. There is no partner page under `src/app` and a link to a 404 is worse
 * than a link to the right form.
 *
 * ── The photography ─────────────────────────────────────────────────
 *   operators   two people in an aisle, one pointing up at a bay — the
 *               physical problem, being looked at
 *   partners    two people shaking hands on the floor, both smiling — the
 *               agreement, not the equipment
 *
 * Neither repeats a frame already on this page: `AboutStory` and `AboutThink`
 * are at ground level with a person and an asset, `AboutTeam` is portraits.
 * The two here are the only frames on the page where the subject is a
 * relationship rather than a thing, which is what this section is asking for.
 *
 * The partner frame is `handshake.webp` rather than `partners.webp`: it
 * replaced an earlier workbench shot at the same path, and a browser that
 * had already loaded the old one kept serving it from cache. A new name is
 * a new URL, which is the only reliable way past that.
 *
 * Generated rather than taken from a stock library, and every prompt asked for
 * no text, no signage and no logos, so nothing in frame is a mark that belongs
 * to somebody. Exported at 1212×682, 2× the 606px card.
 */

const HAIR = "#E8E8ED";

const WAYS: {
  img: string;
  alt: string;
  kicker: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  primary?: boolean;
}[] = [
  {
    img: "/about/work/operators.webp",
    alt: "Two people in a warehouse aisle looking up at the high racking, one in a high-visibility vest pointing at a bay",
    kicker: "For operators",
    title: "Start with a physical problem",
    body: "Identify the safety, productivity, maintenance, inventory or visibility challenge where connected context can create measurable value.",
    cta: "Discuss your operation",
    href: "/contact",
    primary: true,
  },
  {
    img: "/about/work/handshake.webp",
    alt: "Two people shaking hands and smiling on a warehouse floor, one in a high-visibility vest, racking and a forklift behind them",
    kicker: "For partners",
    title: "Extend the platform",
    body: "Bring complementary hardware, services, domain expertise or local delivery capability into a connected customer solution.",
    cta: "Explore partnership",
    href: "/contact",
  },
];

export function AboutWork() {
  return (
    <Section surface="offWhite" id="work-with-rams">
      <SectionHeader
        eyebrow="Work with RAMS"
        top="Build, deploy and grow"
        bottom="The physical operating system."
        size="compact"
        width="wide"
        body="RAMS works with asset owners, operators, technology providers, OEMs, inspectors and solution partners."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {WAYS.map((w, i) => (
          <motion.article
            key={w.kicker}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            className="group flex flex-col overflow-hidden bg-white transition-transform duration-300 hover:-translate-y-1"
            style={{
              borderRadius: 18,
              border: `1px solid ${HAIR}`,
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.02), 0 10px 30px -14px rgba(0,0,0,0.07)",
            }}
          >
            {/* The picture is the top of the card, edge to edge — a photograph
                inset inside a padded card reads as an attachment rather than
                as the card's subject. */}
            <div
              className="relative w-full overflow-hidden shrink-0"
              style={{ aspectRatio: "16 / 9" }}
            >
              <Image
                src={w.img}
                alt={w.alt}
                fill
                sizes="(max-width: 1024px) 92vw, 606px"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>

            <div className="flex flex-col flex-1 p-8 sm:p-10">
              <span className="text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
                {w.kicker}
              </span>

              <h3 className="mt-4 text-[24px] sm:text-[28px] font-semibold tracking-[-0.02em] text-carbon leading-[1.2]">
                {w.title}
              </h3>

              <p className="mt-3 text-[15px] leading-[1.65] text-graphite/60">
                {w.body}
              </p>

              {/* `mt-auto` so both buttons sit on one line however the two
                  bodies wrap. */}
              <span className="mt-auto pt-8">
                <Link
                  href={w.href}
                  className={
                    w.primary
                      ? "inline-flex items-center gap-2 bg-signal-orange text-white text-[15px] font-semibold px-7 py-3.5 rounded-full transition-all duration-200 hover:bg-signal-orange-hover hover:-translate-y-0.5"
                      : "inline-flex items-center gap-2 text-carbon text-[15px] font-semibold px-7 py-3.5 rounded-full transition-all duration-200 hover:bg-carbon hover:text-white"
                  }
                  style={
                    w.primary
                      ? undefined
                      : { boxShadow: "inset 0 0 0 1.5px rgba(20,22,26,0.16)" }
                  }
                >
                  {w.cta}
                  <ArrowUpRight className="w-4 h-4" aria-hidden />
                </Link>
              </span>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
