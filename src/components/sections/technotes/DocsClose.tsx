"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { EASE, SURFACE } from "@/components/sections/rackiq/rackiq-shared";
import { EMAIL } from "@/components/sections/contact/contact-data";

/**
 * The close, for the two documentation pages.
 *
 * `/resources/technical-notes` and `/resources/compliance-guides` ended at the
 * bottom of their own column. The footer was there — it is in the layout, so
 * it is on every page — but it is `bg-surface-dark` under a page on
 * `SURFACE.ink`, so it arrived as more of the same black with no edge between
 * the reading column and the site's own foot.
 *
 * So both pages close on the site's unified dark band before it. A light
 * "where to go next" section sat between the column and this one for a
 * revision and was removed on request; the close's own `darkBottom` gradient
 * is the only edge between the reading column and the footer now, which is
 * worth knowing if the two ever need separating again.
 *
 * ── One component, two callers ──────────────────────────────────────
 * The eyebrow, the heading and the buttons all come in as props. The two
 * pages say different things and share a shape, which is the same split
 * `TechShell` makes between the rails and what sits between them.
 */

/**
 * The close.
 *
 * The site's unified dark close: the same `darkBottom` ground, bottom glow,
 * eyebrow, two-line heading with the second line held back and one word in
 * orange, and the same button shapes as every other page's.
 *
 * The third button is the address rather than a third destination — somebody
 * at the bottom of a reference page usually has a question the reference did
 * not answer, and `EMAIL` comes from `contact-data` so it is written once.
 */
export function DocsCTA({
  eyebrow,
  top,
  held,
  hot,
  body,
  primary,
  secondary,
}: {
  eyebrow: string;
  /** The first line, in white. */
  top: string;
  /** The second line, held back — `hot` inside it goes orange. */
  held: string;
  hot: string;
  body: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
}) {
  const [before, after] = held.split(hot);

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
          {eyebrow}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, ease: EASE }}
          className="mt-5 text-[32px] sm:text-[46px] lg:text-[58px] font-bold tracking-[-0.04em] leading-[1.06] mx-auto"
        >
          <span className="text-white">{top}</span>
          <br />
          <span className="text-white/45">
            {before}
            <span className="text-signal-orange">{hot}</span>
            {after}
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
          className="mt-7 text-[16px] sm:text-[18px] text-white/55 leading-[1.6] max-w-[880px] mx-auto"
        >
          {body}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="mt-10 flex items-center justify-center gap-3.5 flex-wrap"
        >
          <Link
            href={primary.href}
            className="inline-flex items-center gap-2 bg-signal-orange text-white text-[16px] font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:bg-signal-orange-hover hover:-translate-y-0.5"
          >
            {primary.label}
            <ArrowUpRight className="w-4 h-4" aria-hidden />
          </Link>
          <Link
            href={secondary.href}
            className="inline-flex items-center gap-2 text-white text-[16px] font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:bg-white hover:text-carbon"
            style={{ boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.18)" }}
          >
            {secondary.label}
          </Link>
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex items-center gap-2 text-white/70 text-[16px] font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:text-white hover:bg-white/[0.06]"
            style={{ boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.12)" }}
          >
            {EMAIL}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
