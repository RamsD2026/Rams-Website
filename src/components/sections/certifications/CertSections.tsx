"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Cpu,
  FileCheck2,
  KeyRound,
  Lock,
  RefreshCcw,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import { EASE, Section, SURFACE } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EMAIL } from "@/components/sections/contact/contact-data";
import { CertGlance } from "./CertGlance";
import { CertShield } from "./CertShield";
import {
  DOMAINS,
  EVIDENCE,
  FAQS,
  QUESTIONS,
  REGISTER,
  SOC2,
  STATUS_LABEL,
  ask,
  packHref,
  type Status,
} from "./cert-data";

/**
 * Certifications and security — a Company page, in the site's own vocabulary.
 *
 * ── Two revisions were wrong before this ────────────────────────────
 * The first built the hero on `LightHeroGround` and the orbiting tiles: that
 * is the five `/resources` index pages' signature, and this sits under
 * `/company`.
 *
 * The second fixed the ground but kept a page full of invented objects — a
 * warm-gradient panel with SOC 2 set at 56px, a bordered four-column
 * assurance card, boxed cards in every section, a register drawn as a table
 * and a fixed selection tray lifted from the downloads library. None of those
 * exists anywhere else on this site.
 *
 * This one uses what the site actually has, and nothing else:
 *
 *   ground        `AboutHero`'s — the solutions radial inverted between white
 *                 and offWhite, the orange glow at 0.10, a 46/72/92 heading
 *                 in one colour, pt-36/44/48
 *   scope line    `WebinarHero`'s single mono row with dot dividers, in place
 *                 of the bordered panel
 *   the diagram   `CertCore`, built on `PartnersFlow`'s arrangement — one SVG
 *                 viewBox with HTML chips positioned in percentages of it
 *   bare columns  an orange 24px glyph, a 19/20 semibold heading and a 14px
 *                 line — `CaseOutcomes`, `VideoNext`, `WebinarTracks`,
 *                 `ContactTrust` and `DownloadGovernance` are all this
 *   hairline rows `CaseFAQ`'s row, for the register and the evidence list
 *   the note      the centred `text-graphite/45` caveat every page closes a
 *                 section with
 *   the close     the site's unified dark close
 *
 * ── The one thing that is not a borrowed pattern ────────────────────
 * The framed non-claim under the SOC 2 statement. It is the technical notes'
 * specification banner, and it is here for the same reason: the source's rule
 * is "no badge inflation", a security page is read by a procurement team
 * deciding whether to skip a diligence step, and the sentence that says what
 * RAMS does *not* claim has to be impossible to skim past.
 */

const HAIR = "#E0E0E6";

/**
 * The register's status colours.
 *
 * Only `stated` is green — it is the one row that is a public claim.
 * Everything else is something a customer configures or agrees, and colouring
 * those alike would be the badge inflation this page exists to avoid.
 */
const STATUS_TINT: Record<Status, string> = {
  stated: "#299764",
  configurable: "#3E63DD",
  workflow: "#6647F0",
  scope: "#CA8A04",
  contract: "#E5484D",
  verify: "#0891B2",
};

/** One glyph per security domain, in the order `DOMAINS` lists them. */
const DOMAIN_ICONS = [KeyRound, Lock, ScrollText, Cpu, ShieldCheck, RefreshCcw];

/* ── 01 Hero ──────────────────────────────────────────────────────── */

/**
 * `AboutHero`'s ground, value for value.
 *
 * The solutions heroes run `80% 100% at 50% 0%` from #1D1D1F to #08080A —
 * lightest at the top, falling away down the section. The same geometry
 * between white and the site's offWhite keeps that falloff without going
 * dark. The glow is their `60% 60% at 50% 20%` over 720px, at 0.10 rather
 * than 0.22 because the same wash reads far stronger on white.
 *
 * ── The composition is the reference's ─────────────────────────────
 * A large shield outline centred *behind* the headline, four small badges
 * scattered either side of it, and a row of three cards closing the hero —
 * the middle one lifted and carrying the claim. `CertShield` draws the first
 * two; `CertGlance` is the row.
 *
 * The reference boxes one word of its headline in a soft wash, and this had
 * it on "demonstrable" for a revision. It was removed: their wash sits on a
 * blue ground where a lighter patch reads as a highlight, and on white the
 * same shape reads as a background that failed to load — which is what it
 * did, over the dotted field the shield already puts there.
 *
 * On white rather than the reference's blue, which changes two things. The
 * dotted field is masked to an ellipse behind the shield instead of running
 * edge to edge — dots at that density read as noise on white. And the shield
 * is a 1px hairline on a 4% fill rather than a lit outline: the reference's
 * glow works because its ground is dark, and the same weight here would have
 * the headline competing with its own backdrop.
 *
 * The hero ended on a scope line alone for one revision, and on a spoke
 * diagram for another. Both were flat — a hero that stops at a subline and
 * two buttons has no anchor, and a diagram nobody reads is not one either.
 *
 * A row of customer logos would be the wrong close for a second reason — a
 * security page is read by somebody checking whether a claim is examinable,
 * and answering that with social proof is the move this page exists not to
 * make.
 *
 * ── The top padding clears the navbar ───────────────────────────────
 * pt-40/48/56 — 160, 192 and 224. The header is fixed at h-16 sm:h-20, so
 * that leaves 96 at the smallest and 144 at `lg`.
 *
 * It was pt-36/44/48. The number alone was the same as About's, but this hero
 * starts a dotted field at 90 and a shield at 120 from the section's top —
 * both of which arrive well above the pill — so the same padding read tighter
 * here than it does there. `CertShield`'s offsets moved down with it; they
 * are keyed to this padding and have to move together.
 *
 * `data-hero-tone="light"` is set, which the dark heroes do not need: without
 * it the navbar renders white-on-transparent at the top and disappears.
 */

const SCOPE = [
  "SOC 2 Type I publicly stated",
  "Standards-aligned workflows",
  "Scope-conscious claims",
];

export function CertHero() {
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

      <div className="relative rams-container pt-40 sm:pt-48 lg:pt-56 pb-24 sm:pb-28 lg:pb-32">
        <CertShield />

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
              Certifications &amp; security
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
            className="mt-8 sm:mt-10 text-[46px] sm:text-[72px] lg:text-[92px] font-bold leading-[1.04] tracking-[-0.045em] text-carbon"
          >
            Trust must be
            <br />
            demonstrable.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[16px] text-graphite/65 leading-[1.6] max-w-[820px] mx-auto"
          >
            The standards, assurance evidence and security practices supporting
            RAMS Digital — before operational data becomes part of the
            platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease: EASE }}
            className="mt-10 flex items-center justify-center gap-3 flex-wrap"
          >
            <Link
              href="#posture"
              className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-px hover:bg-signal-orange-hover"
            >
              Review the posture
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <a
              href={ask("RAMS Digital trust pack")}
              className="inline-flex items-center gap-2 bg-white text-carbon text-[14px] font-semibold px-6 py-3.5 rounded-full transition-colors duration-200 hover:bg-[#F5F5F7]"
              style={{ boxShadow: "inset 0 0 0 1px #E0E0E6" }}
            >
              Request a trust pack
            </a>
          </motion.div>

          {/* the source's three qualifiers, as one mono line — the row
              `WebinarHero` uses for its topics, not a bordered panel */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.44, ease: EASE }}
            className="mt-10 flex items-center justify-center gap-x-3 gap-y-2 flex-wrap text-[10px] font-mono font-semibold tracking-[0.2em] uppercase text-graphite/40"
          >
            {SCOPE.map((s, i) => (
              <span key={s} className="inline-flex items-center gap-3">
                {i > 0 && (
                  <span
                    aria-hidden
                    className="w-1 h-1 rounded-full bg-graphite/25"
                  />
                )}
                {s}
              </span>
            ))}
          </motion.p>
        </div>

        {/* the three cards, in the slot the reference closes its hero on */}
        <div className="relative z-[1] mt-16 sm:mt-20">
          <CertGlance />
        </div>
      </div>
    </section>
  );
}

/* ── 02 The claim, and what it is not ─────────────────────────────── */

/**
 * The certification statement, and the four questions trust turns on.
 *
 * The claim is set as type on the section's own ground — no panel, no
 * gradient, no 56px badge. What carries it is the mono label above and the
 * three checks as hairline rows below, which is `CaseFAQ`'s row and
 * `ContactLocations`' list.
 *
 * The non-claim is the one framed thing on the page, in the technical notes'
 * banner treatment, directly under the claim.
 */
export function CertClaim() {
  return (
    <Section surface="white" id="posture">
      <SectionHeader
        eyebrow="Certification & assurance"
        top="A control claim"
        bottom="Buyers can examine."
        size="compact"
        width="wide"
        body={SOC2.body}
        className="!mb-12 sm:!mb-14"
      />

      <div className="max-w-[900px] mx-auto">
        <p className="text-[10px] font-mono font-bold tracking-[0.22em] uppercase text-signal-orange">
          {SOC2.kind}
        </p>

        <p className="mt-4 text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-graphite/40">
          What to ask for during diligence
        </p>

        <div className="mt-5" style={{ borderTop: `1px solid ${HAIR}` }}>
          {SOC2.checks.map(([t, b]) => (
            <div
              key={t}
              className="flex items-start gap-4 py-5"
              style={{ borderBottom: `1px solid ${HAIR}` }}
            >
              <span
                className="flex items-center justify-center w-[18px] h-[18px] mt-[3px] shrink-0"
                style={{
                  borderRadius: 999,
                  background: "rgba(255,106,0,0.10)",
                }}
              >
                <Check
                  width={11}
                  height={11}
                  className="text-signal-orange"
                  strokeWidth={3}
                  aria-hidden
                />
              </span>
              <div>
                <p className="text-[15px] font-semibold tracking-[-0.01em] text-carbon leading-[1.4]">
                  {t}
                </p>
                <p className="mt-1.5 text-[14px] leading-[1.7] text-graphite/60">
                  {b}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* The source's own non-claim. Framed, and directly under the claim —
            the second thing read on this page, deliberately. */}
        <div
          className="mt-8 p-5"
          style={{
            borderRadius: 12,
            background: "rgba(255,106,0,0.06)",
            boxShadow: "inset 0 0 0 1px rgba(255,106,0,0.20)",
          }}
        >
          <p className="text-[13.5px] leading-[1.7] text-graphite/70">
            {SOC2.notClaimed}
          </p>
        </div>
      </div>

      {/* the four questions, as bare columns */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
        {QUESTIONS.map((q, i) => (
          <motion.div
            key={q.code}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: (i % 4) * 0.07, ease: EASE }}
            className="flex flex-col"
          >
            <span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
              {q.code}
            </span>

            <h3 className="mt-4 text-[19px] sm:text-[20px] font-semibold tracking-[-0.02em] text-carbon leading-[1.25]">
              {q.question}
            </h3>

            <p className="mt-2.5 text-[14px] leading-[1.65] text-graphite/60">
              {q.body}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ── 03 Security architecture ─────────────────────────────────────── */

/**
 * Six bare columns — the icon, the heading, the line, then the three points.
 *
 * `CaseOutcomes`, `VideoNext`, `WebinarTracks`, `ContactTrust` and
 * `DownloadGovernance` are all this shape. No card, no border, no shadow.
 */
export function CertArchitecture() {
  return (
    <Section surface="offWhite" id="architecture">
      <SectionHeader
        eyebrow="Security architecture"
        top="Protection across identity,"
        bottom="Data and operations."
        size="compact"
        width="wide"
        body="The assurance conversation should cover the whole operating chain — from a user opening the platform to a sensor or business system exchanging data."
        className="!mb-10 sm:!mb-12"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
        {DOMAINS.map((d, i) => {
          const Icon = DOMAIN_ICONS[i];
          return (
            <motion.div
              key={d.code}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.07, ease: EASE }}
              className="flex flex-col"
            >
              <Icon
                className="w-[24px] h-[24px] shrink-0 text-signal-orange"
                strokeWidth={1.9}
                aria-hidden
              />

              <h3 className="mt-5 text-[19px] sm:text-[20px] font-semibold tracking-[-0.02em] text-carbon leading-[1.25]">
                {d.title}
              </h3>

              <p className="mt-2.5 text-[14px] leading-[1.65] text-graphite/60">
                {d.body}
              </p>

              <ul className="mt-4 space-y-2">
                {d.points.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-2.5 text-[13.5px] leading-[1.6] text-graphite/55"
                  >
                    <span
                      aria-hidden
                      className="w-1 h-1 rounded-full shrink-0 mt-2"
                      style={{ background: "#FF6A00" }}
                    />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

/* ── 04 Control register ──────────────────────────────────────────── */

/**
 * Six hairline rows.
 *
 * "Separate what is published, configurable and contractual. That distinction
 * keeps security statements accurate." Only the SOC 2 row carries a green
 * dot, because it is the only row that is a public claim — the other five are
 * things a customer configures or agrees, and colouring them alike would turn
 * a permission matrix into a certification.
 */
export function CertRegister() {
  return (
    <Section surface="white" id="register">
      <SectionHeader
        eyebrow="Control register"
        top="Published, configurable"
        bottom="Or contractual."
        size="compact"
        width="wide"
        body="That distinction keeps security statements accurate — and gives procurement teams a faster route to the evidence they need."
        className="!mb-10 sm:!mb-12"
      />

      <div
        className="max-w-[900px] mx-auto"
        style={{ borderTop: `1px solid ${HAIR}` }}
      >
        {REGISTER.map((r, i) => (
          <motion.div
            key={r.area}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: (i % 3) * 0.05, ease: EASE }}
            className="py-6"
            style={{ borderBottom: `1px solid ${HAIR}` }}
          >
            <div className="flex items-baseline justify-between gap-6 flex-wrap">
              <p className="text-[16px] sm:text-[17px] font-bold tracking-[-0.015em] text-carbon leading-[1.4]">
                {r.area}
              </p>

              <p className="flex items-center gap-2 text-[12.5px] font-semibold text-graphite/60 shrink-0">
                <span
                  aria-hidden
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: STATUS_TINT[r.status] }}
                />
                {STATUS_LABEL[r.status]}
              </p>
            </div>

            <p className="mt-2.5 text-[14px] leading-[1.7] text-graphite/60 max-w-[620px]">
              {r.evaluate}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ── 05 The trust pack ────────────────────────────────────────────── */

/**
 * Six hairline rows, and one request.
 *
 * It was a selectable grid with a fixed tray at the foot of the viewport —
 * the downloads library's pack builder. That mechanic belongs to a page with
 * thirteen brochures a reader picks between; six pieces of diligence evidence
 * are requested together or not at all, and a floating cart on a security
 * page is theatre.
 *
 * So the list states what each item is and when it is released — "On
 * request", "Diligence", "Contract" — and one button asks for the set, with
 * every title already in the email body. Nothing here links to a file: the
 * source is explicit that availability "may depend on confidentiality,
 * deployment scope and approval", and a security questionnaire response is
 * not a public asset.
 */
export function CertPack() {
  return (
    <Section surface="offWhite" id="pack">
      <SectionHeader
        eyebrow="Customer assurance pack"
        top="A clear route"
        bottom="To diligence."
        size="compact"
        width="wide"
        body="What procurement and security teams usually ask for, and when each item is released."
        className="!mb-10 sm:!mb-12"
      />

      <div
        className="max-w-[900px] mx-auto"
        style={{ borderTop: `1px solid ${HAIR}` }}
      >
        {EVIDENCE.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: (i % 3) * 0.05, ease: EASE }}
            className="flex items-start gap-4 py-5"
            style={{ borderBottom: `1px solid ${HAIR}` }}
          >
            <FileCheck2
              className="w-[18px] h-[18px] mt-[3px] shrink-0 text-signal-orange"
              strokeWidth={1.9}
              aria-hidden
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-5 flex-wrap">
                <p className="text-[15px] font-semibold tracking-[-0.01em] text-carbon leading-[1.4]">
                  {e.title}
                </p>
                <span className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-graphite/40 shrink-0">
                  {e.gate}
                </span>
              </div>

              <p className="mt-1.5 text-[14px] leading-[1.7] text-graphite/60">
                {e.body}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <a
          href={packHref(EVIDENCE.map((e) => e.title))}
          className="inline-flex items-center gap-2 bg-carbon text-white text-[14px] font-semibold px-6 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-px"
        >
          Request the trust pack
          <ArrowUpRight className="w-4 h-4" aria-hidden />
        </a>
      </div>

      <p className="mt-10 text-center text-[12.5px] leading-[1.65] text-graphite/45 max-w-[820px] mx-auto">
        The exact materials available may depend on confidentiality, deployment
        scope and approval.
      </p>
    </Section>
  );
}

/* ── 06 FAQ ───────────────────────────────────────────────────────── */

function Toggle({ open }: { open: boolean }) {
  return (
    <span aria-hidden className="relative w-3.5 h-3.5 shrink-0 mt-1">
      <span
        className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full"
        style={{ background: "#FF6A00" }}
      />
      <motion.span
        className="absolute top-0 bottom-0 left-1/2 w-[2px] -translate-x-1/2 rounded-full origin-center"
        style={{ background: "#FF6A00" }}
        initial={false}
        animate={{ scaleY: open ? 0 : 1 }}
        transition={{ duration: 0.3, ease: EASE }}
      />
    </span>
  );
}

/**
 * "Clear answers. No badge inflation." — the source's own heading, and the
 * page's position.
 *
 * The first three are what a procurement team asks in order: is it certified,
 * is Type I the same as Type II, and is it ISO 27001. The third answer is a
 * plain no, and it stays a plain no.
 */
export function CertFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section surface="white" id="faq">
      <SectionHeader
        eyebrow="Frequently asked questions"
        top="Clear answers."
        bottom="No badge inflation."
        size="compact"
        width="wide"
        className="!mb-10 sm:!mb-12"
      />

      <div
        className="max-w-[900px] mx-auto"
        style={{ borderTop: `1px solid ${HAIR}` }}
      >
        {FAQS.map(([q, a], i) => {
          const on = open === i;
          return (
            <div key={q} style={{ borderBottom: `1px solid ${HAIR}` }}>
              <button
                type="button"
                onClick={() => setOpen(on ? null : i)}
                aria-expanded={on}
                className="w-full flex items-start justify-between gap-6 text-left py-6 group"
              >
                <span
                  className={
                    "text-[16px] sm:text-[17px] font-bold tracking-[-0.015em] leading-[1.4] transition-colors duration-300 " +
                    (on
                      ? "text-carbon"
                      : "text-carbon/85 group-hover:text-carbon")
                  }
                >
                  {q}
                </span>
                <Toggle open={on} />
              </button>

              <AnimatePresence initial={false}>
                {on && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <p className="pb-7 pr-10 text-[14.5px] leading-[1.7] text-graphite/65">
                      {a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/* ── the close ────────────────────────────────────────────────────── */

export function CertCTA() {
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
          Enterprise assurance
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, ease: EASE }}
          className="mt-5 text-[32px] sm:text-[46px] lg:text-[58px] font-bold tracking-[-0.04em] leading-[1.06] mx-auto"
        >
          <span className="text-white">Build on a foundation</span>
          <br />
          <span className="text-white/45">
            you can <span className="text-signal-orange">examine</span>.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
          className="mt-7 text-[16px] sm:text-[18px] text-white/55 leading-[1.6] max-w-[880px] mx-auto"
        >
          Review the evidence. Confirm the scope. Map the data. Configure the
          controls. Then deploy with trust designed into the operating model.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="mt-10 flex items-center justify-center gap-3.5 flex-wrap"
        >
          <a
            href={ask(
              "RAMS Digital security review",
              "Hello RAMS Digital,\n\nWe would like to schedule a security review.\n\nOrganisation:\nName and role:\nDeployment being assessed:\nSites and regions:\nTarget dates:\n\nThank you.",
            )}
            className="inline-flex items-center gap-2 bg-signal-orange text-white text-[16px] font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:bg-signal-orange-hover hover:-translate-y-0.5"
          >
            Schedule a security review
            <ArrowUpRight className="w-4 h-4" aria-hidden />
          </a>
          <Link
            href="/resources/technical-notes"
            className="inline-flex items-center gap-2 text-white text-[16px] font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:bg-white hover:text-carbon"
            style={{ boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.18)" }}
          >
            Technical notes
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
