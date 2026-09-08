"use client";

import { motion } from "framer-motion";
import { Handshake, PlugZap, Target, Workflow } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 02 — Why partnerships matter.
 *
 * The platform pages' icon card, value for value: a 48px orange tile at 8px
 * radius on a `rgba(255,106,0,0.08)` fill and a `0.18` border, the heading
 * under it, the body under that, a 12px card radius on the site's hairline
 * and card shadow, a 1px lift on hover and the conic orange sweep around the
 * border.
 *
 * ── It used to be bare columns ──────────────────────────────────────
 * Four icons ranged left on the open ground, each with its own tint — the
 * About page's treatment for a statement of position. This is the pattern the
 * platform pages actually ship, and the one a reader arriving from `/platform`
 * has already seen five times, so it is the one this page uses.
 *
 * The per-icon tints went with the box. The platform card carries one orange
 * tile, and four different tints inside four identical boxes would be
 * decoration rather than a distinction — the box is already doing the
 * separating the tints were there for.
 *
 * ── Not the same card as 05 and 06 ──────────────────────────────────
 * Those carry a mono code badge, a rule and three ticks, because each one
 * describes what a kind of partner does and is worth reading through. This
 * one is an icon, a heading and a line. Same family, different weight, which
 * is what keeps a page of cards from reading as one long grid.
 *
 * ── No numeral on the card ──────────────────────────────────────────
 * It carried 01 to 04 above the heading. Four reasons are not four steps —
 * nothing here happens in an order — and a numeral on a card is a promise
 * that it does. The icon is the thing that separates them.
 *
 * ── The icons ───────────────────────────────────────────────────────
 *   PlugZap    open at the edge is the literal connection
 *   Target     specific in the market is aim
 *   Workflow   consistent in delivery is a defined method run repeatedly
 *   Handshake  shared in value is the agreement itself
 *
 * None repeats one used elsewhere on this page — `PartnersHow` holds
 * ScanSearch, BadgeCheck, GraduationCap, Rocket and TrendingUp, `PartnersFit`
 * holds eight more, and the hero's flow holds ten.
 */

const REASONS: {
  icon: typeof PlugZap;
  title: string;
  body: string;
}[] = [
  {
    icon: PlugZap,
    title: "Open at the edge",
    body: "Bring supported partner devices and customer infrastructure into the same operating context.",
  },
  {
    icon: Target,
    title: "Specific in the market",
    body: "Combine RAMS technology with the sector knowledge and relationships partners already have.",
  },
  {
    icon: Workflow,
    title: "Consistent in delivery",
    body: "Use structured workflows, training and evidence to scale execution without losing quality.",
  },
  {
    icon: Handshake,
    title: "Shared in value",
    body: "Create a commercial model around the role each partner genuinely performs.",
  },
];

const HAIR = "#E8E8ED";

export function PartnersWhy() {
  return (
    <Section surface="offWhite" id="why">
      <style>{`
        @property --ptrwhy-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .ptrwhy-card { position: relative; isolation: isolate; }
        .ptrwhy-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--ptrwhy-shine-angle),
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
        .ptrwhy-card:hover::before {
          opacity: 1;
          animation: ptrwhy-shine 2.4s linear infinite;
        }
        @keyframes ptrwhy-shine {
          to { --ptrwhy-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ptrwhy-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Why partnerships matter"
        top="No single company owns"
        bottom="Every part of the operation."
        size="compact"
        width="wide"
        body="No single company owns every sensor, system, asset relationship or field capability. The stronger platform is the one that can connect them."
        /* The site default is mb-16/20. This header is two long lines and a
           long body, so at 80px it left a hole between the copy and the
           cards; the override is local to this section. */
        className="!mb-10 sm:!mb-12"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {REASONS.map((r, i) => (
          <motion.article
            key={r.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
            className="ptrwhy-card flex flex-col h-full p-7 sm:p-8 bg-white transition-transform duration-300 hover:-translate-y-1"
            style={{
              borderRadius: 12,
              border: `1px solid ${HAIR}`,
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
            }}
          >
            <span
              className="flex items-center justify-center w-12 h-12 shrink-0 mb-5"
              style={{
                borderRadius: 8,
                background: "rgba(255,106,0,0.08)",
                border: "1px solid rgba(255,106,0,0.18)",
              }}
            >
              <r.icon
                className="w-[22px] h-[22px] text-signal-orange"
                strokeWidth={2}
                aria-hidden
              />
            </span>

            {/* No reserved height. The platform card pins two lines because
                four of its six titles wrap; none of these four do at any
                width the grid actually renders at, so the pin was holding an
                empty line between every heading and its body. */}
            <h3 className="text-[20px] sm:text-[21px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
              {r.title}
            </h3>

            <p className="mt-3 text-[14px] text-graphite/65 leading-[1.65]">
              {r.body}
            </p>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
