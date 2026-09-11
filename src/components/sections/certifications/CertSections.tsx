"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Check,
  Cpu,
  FileCheck2,
  Globe,
  KeyRound,
  Lock,
  RefreshCcw,
  ScrollText,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import {
  EASE,
  Section,
  SURFACE,
} from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EMAIL } from "@/components/sections/contact/contact-data";
import { CertShield } from "./CertShield";
import { FAQS, SOC2, ask, type Status } from "./cert-data";

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
export const STATUS_TINT: Record<Status, string> = {
  stated: "#299764",
  configurable: "#3E63DD",
  workflow: "#6647F0",
  scope: "#CA8A04",
  contract: "#E5484D",
  verify: "#0891B2",
};

/** One glyph per security domain, in the order `DOMAINS` lists them. */
export const DOMAIN_ICONS = [
  KeyRound,
  Lock,
  ScrollText,
  Cpu,
  ShieldCheck,
  RefreshCcw,
];

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
 * scattered either side of it — `CertShield` draws both. The hero closes on
 * the footer's two compliance badges and their names, set as the footer sets
 * them; it closed on a row of three cards (`CertGlance`) before that.
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

/**
 * The hero's badge row. The first two are the footer's badges, image, alt and
 * name for name — the only certifications the site states.
 *
 * The rest are PLACEHOLDERS: a drawn seal and a numbered name, not any real
 * scheme's mark. A named badge for a certificate RAMS does not hold would be
 * a claim to the procurement teams this page is written for, so the slots
 * stay generic until a held certificate replaces one — give it `src`, `alt`
 * and its real `label`, and drop the `icon`.
 */
type Badge = {
  label: string;
  src?: string;
  alt?: string;
  icon?: LucideIcon;
};

const BADGES: Badge[] = [
  { src: "/Product/soc-type-1.jpg", alt: "AICPA SOC 2", label: "SOC 2" },
  {
    src: "/Product/soc-type-2.jpg",
    alt: "AICPA SOC 2 Type I",
    label: "SOC 2 · Type I",
  },
  { icon: ShieldCheck, label: "Certification 03" },
  { icon: Lock, label: "Certification 04" },
  { icon: FileCheck2, label: "Certification 05" },
  { icon: Globe, label: "Certification 06" },
  { icon: Award, label: "Certification 07" },
];

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
            RAMS Digital — before operational data becomes part of the platform.
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

        {/* the footer's compliance badges, as the footer sets them — the
            only two marks the site states, so the hero claims no more */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.54, ease: EASE }}
          className="relative z-[1] mt-14 sm:mt-16 flex flex-wrap items-start justify-center gap-x-8 gap-y-7"
        >
          {BADGES.map(({ label, src, alt, icon: Icon = ShieldCheck }) => (
            <div key={label} className="flex flex-col items-center gap-2.5">
              {src ? (
                <Image
                  src={src}
                  alt={alt ?? label}
                  width={88}
                  height={88}
                  className="w-[88px] h-[88px] rounded-full object-cover block"
                />
              ) : (
                // placeholder seal — see BADGES
                <span
                  role="img"
                  aria-label={`${label} (placeholder)`}
                  className="w-[88px] h-[88px] rounded-full flex items-center justify-center bg-white"
                  style={{ boxShadow: "inset 0 0 0 1px #E0E0E6" }}
                >
                  <span
                    className="w-[72px] h-[72px] rounded-full flex flex-col items-center justify-center gap-1"
                    style={{ border: "1px dashed #D4D4DA" }}
                  >
                    <Icon
                      className="w-[22px] h-[22px] text-graphite/40"
                      strokeWidth={1.8}
                      aria-hidden
                    />
                    <span className="text-[7.5px] font-mono font-bold tracking-[0.16em] uppercase text-graphite/35">
                      Badge
                    </span>
                  </span>
                </span>
              )}
              <span className="text-graphite/45 text-[10.5px] tracking-[0.14em] font-semibold uppercase">
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── 02 The claim, and what it is not ─────────────────────────────── */

/**
 * 02 — Certification & assurance, set as the source sets it.
 *
 * Two columns on the teal ink: the footer's SOC 2 Type I badge on the left,
 * three rings round it and the orange glow the dark heroes carry —
 * and on the right the header, flush left, with the three diligence checks
 * as hairline rows beneath it.
 *
 * It was a bento of cards on grey for a revision. The source reads as one
 * statement and three questions to ask of it, and rows keep it that way.
 *
 * Two departures from the source, both deliberate:
 *
 *   the checks   orange, not the source's green — `signal-orange` is the
 *                site's one accent, and green is reserved for the register's
 *                single stated claim
 *   the note     the framed non-claim under the rows is left out; that line
 *                was removed from this page at the owner's request
 *
 * `inkTeal` sits beside the `ink` Standards band: two dark sections, but not
 * one surface, so the boundary between them still reads.
 */

export function CertClaim() {
  return (
    <Section surface="inkTeal" id="posture">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-14 lg:gap-20 items-center">
        {/* the seal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative w-full max-w-[440px] lg:max-w-[540px] mx-auto aspect-square"
        >
          <span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{ border: "1px solid rgba(255,255,255,0.10)" }}
          />
          <span
            aria-hidden
            className="absolute inset-[4.5%] rounded-full"
            style={{ border: "1px dashed rgba(255,255,255,0.10)" }}
          />
          <span
            aria-hidden
            className="absolute inset-[10.5%] rounded-full"
            style={{
              border: "1px dashed rgba(255,255,255,0.08)",
              background:
                "radial-gradient(closest-side, rgba(255,106,0,0.16), rgba(255,106,0,0.05) 60%, transparent 100%)",
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {/* the footer's badge, cropped to its circle and lifted 4% so
                the JPG's white corners never show on the dark ground */}
            <div
              className="relative w-[44%] aspect-square rounded-full overflow-hidden"
              style={{
                boxShadow:
                  "0 24px 60px -24px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.10)",
              }}
            >
              <Image
                src="/Product/soc-type-2.jpg"
                alt="AICPA SOC 2 Type I"
                fill
                sizes="(min-width: 1024px) 240px, 45vw"
                className="object-cover scale-[1.04]"
              />
            </div>
            <span className="mt-6 text-[11px] sm:text-[12px] font-mono font-semibold tracking-[0.2em] uppercase text-white/55">
              {SOC2.kind}
            </span>
          </div>
        </motion.div>

        {/* the claim, and what to ask of it */}
        <div>
          <SectionHeader
            eyebrow="Certification & assurance"
            top="A control claim"
            bottom="Buyers can examine."
            tone="dark"
            size="long"
            align="left"
            body={SOC2.body}
            className="!mb-10"
          />

          <ul>
            {SOC2.checks.map(([t, b], i) => (
              <motion.li
                key={t}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.6,
                  delay: 0.08 + i * 0.08,
                  ease: EASE,
                }}
                className="flex items-start gap-5 py-6"
                style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(255,106,0,0.12)",
                    border: "1px solid rgba(255,106,0,0.28)",
                  }}
                >
                  <Check
                    className="w-4 h-4 text-signal-orange"
                    strokeWidth={2.4}
                    aria-hidden
                  />
                </span>
                <div className="min-w-0 pt-1">
                  <h3 className="text-[16px] sm:text-[17px] font-bold tracking-[-0.015em] text-white leading-[1.3]">
                    {t}
                  </h3>
                  <p className="mt-1.5 text-[14px] leading-[1.6] text-white/55">
                    {b}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
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
    <Section surface="offWhite" id="faq">
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
