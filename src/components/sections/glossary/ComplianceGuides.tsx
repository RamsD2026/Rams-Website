"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ShieldAlert } from "lucide-react";
import { EASE, SURFACE } from "@/components/sections/rackiq/rackiq-shared";
import { EMAIL } from "@/components/sections/contact/contact-data";
import {
  TechSidebar,
  TechToc,
  useScrollSpy,
} from "@/components/sections/technotes/TechShell";
import { GlossaryList } from "./GlossaryList";
import {
  BRIDGE,
  CONTEXT,
  FAQS,
  FRAMEWORKS,
  LEVELS,
  LOOP,
  NAV,
  OSHA_REFS,
  PRINCIPLES,
  ROLES,
  SEMA_ROLES,
  TOC,
} from "./glossary-content";

/**
 * The compliance glossary, in the technical-notes shell.
 *
 * `TechShell` owns the two rails and the scroll-spy; this file is the middle
 * column — ten sections in the order both rails list them, each with the `id`
 * the spy and the anchors use. The shell was written for the technical notes
 * and generalised when this page arrived: it takes `nav`, `toc` and the right
 * rail's card as props rather than importing one page's data.
 *
 * ── The banner is at the top, and it is the whole point ─────────────
 * This is a reference, not a compliance determination. The source says so in
 * its own banner and this carries it above the first heading, because a
 * glossary of safety terminology is read by somebody deciding whether a
 * damaged upright can stay in service.
 *
 * That warning is repeated where it can actually intercept a decision rather
 * than only at the top: every term in `GlossaryList` renders its own
 * applicability boundary in a framed block, every framework card states what
 * it *is* and where it applies, every role carries the limit of its own
 * authority, the OSHA section says it is a navigation point rather than the
 * rule, and the loop closes with the sentence that a glossary does not decide
 * severity or approve a repair.
 *
 * None of those was shortened to fit a card. Where the source hedges, so does
 * this.
 *
 * ── The official links leave the site, deliberately ─────────────────
 * SEMA, FEM and three OSHA regulations, all `target="_blank"` with
 * `rel="noreferrer"`. Every URL was requested and returned 200 before it was
 * written down — a compliance reference pointing at a dead regulation is
 * worse than one with no links at all. These are the only outbound links on
 * this site to a body that writes rules, and a reader who wants the authority
 * should reach it in one press rather than a search.
 */

const HAIR = "rgba(255,255,255,0.08)";
const CARD = "rgba(255,255,255,0.03)";

function H({ id, eyebrow, title }: { id: string; eyebrow: string; title: string }) {
  return (
    <div className="mb-7">
      <p className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-3 text-[24px] sm:text-[26px] font-bold tracking-[-0.03em] text-white leading-[1.2] scroll-mt-28"
      >
        {title}
      </h2>
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[15px] leading-[1.75] text-white/55 max-w-[680px]">
      {children}
    </p>
  );
}

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={"p-5 rounded-xl " + (className ?? "")}
      style={{ background: CARD, boxShadow: `inset 0 0 0 1px ${HAIR}` }}
    >
      {children}
    </div>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="py-14 first:pt-0"
      style={{ borderTop: `1px solid ${HAIR}` }}
    >
      {children}
    </motion.section>
  );
}

/** A boundary line, framed so it cannot be skimmed past. */
function Boundary({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="p-4 rounded-lg"
      style={{
        background: "rgba(255,106,0,0.06)",
        boxShadow: "inset 0 0 0 1px rgba(255,106,0,0.20)",
      }}
    >
      <p className="text-[13px] leading-[1.7] text-white/65">{children}</p>
    </div>
  );
}

function Out({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-white/70 hover:text-signal-orange transition-colors"
    >
      {children}
      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden />
    </a>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div style={{ borderTop: `1px solid ${HAIR}` }}>
      {FAQS.map(([q, a], i) => {
        const on = open === i;
        return (
          <div key={q} style={{ borderBottom: `1px solid ${HAIR}` }}>
            <button
              type="button"
              onClick={() => setOpen(on ? null : i)}
              aria-expanded={on}
              className="w-full flex items-start justify-between gap-6 text-left py-5 group"
            >
              <span
                className={
                  "text-[14.5px] font-semibold tracking-[-0.01em] leading-[1.45] transition-colors duration-300 " +
                  (on ? "text-white" : "text-white/75 group-hover:text-white")
                }
              >
                {q}
              </span>
              <span aria-hidden className="relative w-3 h-3 shrink-0 mt-1">
                <span
                  className="absolute left-0 right-0 top-1/2 h-[1.5px] -translate-y-1/2 rounded-full"
                  style={{ background: "#FF6A00" }}
                />
                <motion.span
                  className="absolute top-0 bottom-0 left-1/2 w-[1.5px] -translate-x-1/2 rounded-full origin-center"
                  style={{ background: "#FF6A00" }}
                  initial={false}
                  animate={{ scaleY: on ? 0 : 1 }}
                  transition={{ duration: 0.3, ease: EASE }}
                />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {on && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 pr-8 text-[14px] leading-[1.75] text-white/50">
                    {a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export function ComplianceGuides() {
  const ids = useMemo(() => TOC.map((t) => t.id), []);
  const active = useScrollSpy(ids);

  return (
    <div
      className="relative min-h-screen text-white"
      style={{ background: SURFACE.ink }}
    >
      <div
        className="mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_248px] xl:grid-cols-[236px_minmax(0,1fr)_248px] gap-10 xl:gap-12"
        style={{ maxWidth: 1440, paddingTop: 128, paddingBottom: 120 }}
      >
        <TechSidebar nav={NAV} active={active} label="Compliance guides" />

        <main className="min-w-0 max-w-[760px]">
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-signal-orange">
            Industry compliance glossary
          </p>

          <h1 className="mt-4 text-[36px] sm:text-[44px] font-bold tracking-[-0.04em] leading-[1.08]">
            Understand the language behind safer operations.
          </h1>

          <p className="mt-5 text-[16px] leading-[1.7] text-white/55 max-w-[660px]">
            A practical RAMS reference for SEMA, FEM and OSHA terminology used
            across storage equipment, materials handling, rack inspection and
            warehouse safety.
          </p>

          {/* The banner. Above the first heading, because everything below it
              is a reference and a reader who scrolls straight to a term has
              already passed it. */}
          <div
            className="mt-8 flex items-start gap-3.5 p-4 rounded-xl"
            style={{
              background: "rgba(255,106,0,0.07)",
              boxShadow: "inset 0 0 0 1px rgba(255,106,0,0.22)",
            }}
          >
            <ShieldAlert
              className="w-[18px] h-[18px] mt-0.5 shrink-0 text-signal-orange"
              strokeWidth={1.9}
              aria-hidden
            />
            <p className="text-[13.5px] leading-[1.65] text-white/70">
              <span className="font-semibold text-white">
                Reference guide, not a compliance determination.
              </span>{" "}
              Apply the law, adopted standard, OEM instructions and competent
              professional advice relevant to the specific facility and
              jurisdiction.
            </p>
          </div>

          <div className="mt-14">
            {/* ── 01 How to use this ────────────────────── */}
            <Section>
              <H
                id="overview"
                eyebrow="How to use this"
                title="Three sources. Three different roles."
              />
              <P>
                Treating an association guide, a technical code and a workplace
                regulation as interchangeable creates avoidable risk. Start
                with what each source is — and where it applies.
              </P>

              <div className="mt-7">
                <Boundary>
                  Check the current edition, contract requirements and local
                  adoption before using any reference on this page.
                </Boundary>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PRINCIPLES.map((p) => (
                  <Card key={p.code}>
                    <p className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/25">
                      {p.code}
                    </p>
                    <p className="mt-3 text-[14px] font-semibold text-white">
                      {p.title}
                    </p>
                    <p className="mt-2 text-[13px] leading-[1.65] text-white/45">
                      {p.body}
                    </p>
                  </Card>
                ))}
              </div>
            </Section>

            {/* ── 02 Framework map ──────────────────────── */}
            <Section>
              <H
                id="frameworks"
                eyebrow="Framework map"
                title="What each source is, and where it applies."
              />

              <div className="space-y-4">
                {FRAMEWORKS.map((f) => (
                  <Card key={f.code}>
                    <div className="flex items-baseline justify-between gap-4 flex-wrap">
                      <p className="text-[15px] font-bold text-signal-orange">
                        {f.n} · {f.code}
                      </p>
                      <p className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-white/30">
                        {f.kind}
                      </p>
                    </div>

                    <p className="mt-3 text-[14px] font-semibold text-white leading-[1.4]">
                      {f.name}
                    </p>
                    <p className="mt-2.5 text-[13.5px] leading-[1.7] text-white/50">
                      {f.body}
                    </p>

                    <div
                      className="mt-5 pt-4 space-y-2.5"
                      style={{ borderTop: `1px solid ${HAIR}` }}
                    >
                      {f.facts.map(([k, v]) => (
                        <div
                          key={k}
                          className="flex flex-col sm:flex-row sm:gap-4"
                        >
                          <span className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/25 sm:w-[72px] shrink-0 sm:pt-0.5">
                            {k}
                          </span>
                          <span className="text-[13px] leading-[1.6] text-white/60">
                            {v}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5">
                      <Out href={f.url}>{f.cta}</Out>
                    </div>
                  </Card>
                ))}
              </div>
            </Section>

            {/* ── 03 Glossary ───────────────────────────── */}
            <Section>
              <H
                id="glossary"
                eyebrow="Searchable glossary"
                title="Find the term. Understand the operational meaning."
              />
              <P>
                Each entry explains the term in plain language, why it matters
                on site, how it is used, and the boundary of where it applies.
              </P>

              <div className="mt-7">
                <GlossaryList />
              </div>
            </Section>

            {/* ── 04 Inspection system ──────────────────── */}
            <Section>
              <H
                id="inspection"
                eyebrow="SEMA inspection system"
                title="Inspection is a system, not a single annual event."
              />
              <P>
                SEMA describes layered inspection activity: prompt reporting,
                regular visual inspection and expert inspection. The actual
                frequency should reflect risk, operation and applicable
                guidance.
              </P>

              <div className="mt-7 space-y-3">
                {LEVELS.map((l) => (
                  <div
                    key={l.n}
                    className="flex items-center gap-5 px-5 py-4 rounded-xl"
                    style={{
                      background: CARD,
                      boxShadow: `inset 0 0 0 1px ${HAIR}`,
                    }}
                  >
                    <span className="text-[11px] font-mono font-bold tracking-[0.14em] text-signal-orange tabular-nums shrink-0">
                      {l.n}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-white">
                        {l.title}
                      </p>
                      <p className="mt-1 text-[13px] leading-[1.6] text-white/45">
                        {l.body}
                      </p>
                    </div>
                    <span
                      className="shrink-0 text-[9px] font-mono font-bold tracking-[0.16em] uppercase text-white/40 px-2.5 py-1"
                      style={{
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.06)",
                      }}
                    >
                      {l.cadence}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {SEMA_ROLES.map((r) => (
                  <Card key={r.code}>
                    <span
                      className="inline-flex items-center justify-center w-8 h-8 text-[11px] font-mono font-bold text-white/60"
                      style={{
                        borderRadius: 8,
                        background: "rgba(255,255,255,0.06)",
                      }}
                      aria-hidden
                    >
                      {r.code}
                    </span>
                    <p className="mt-3 text-[13.5px] font-semibold text-white leading-[1.35]">
                      {r.title}
                    </p>
                    <p className="mt-2 text-[12.5px] leading-[1.6] text-white/45">
                      {r.body}
                    </p>
                  </Card>
                ))}
              </div>
            </Section>

            {/* ── 05 OSHA quick reference ───────────────── */}
            <Section>
              <H
                id="osha"
                eyebrow="OSHA quick reference"
                title="Start with the exact regulatory text."
              />
              <P>
                These are navigation points for U.S. general-industry
                operations — not substitutes for reading the current rule and
                the applicable interpretations.
              </P>

              <div className="mt-7 space-y-4">
                {OSHA_REFS.map((o) => (
                  <Card key={o.code}>
                    <p className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-signal-orange">
                      {o.code}
                    </p>
                    <p className="mt-3 text-[15px] font-semibold text-white">
                      {o.title}
                    </p>
                    <p className="mt-2 text-[13.5px] leading-[1.7] text-white/50">
                      {o.body}
                    </p>

                    <ul className="mt-4 space-y-1.5">
                      {o.points.map((pt) => (
                        <li
                          key={pt}
                          className="flex items-start gap-2.5 text-[12.5px] leading-[1.6] text-white/55"
                        >
                          <span
                            aria-hidden
                            className="w-1 h-1 rounded-full shrink-0 mt-2"
                            style={{ background: "#FF6A00" }}
                          />
                          {pt}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5">
                      <Out href={o.url}>{o.cta}</Out>
                    </div>
                  </Card>
                ))}
              </div>
            </Section>

            {/* ── 06 Guide to action ────────────────────── */}
            <Section>
              <H
                id="loop"
                eyebrow="From guide to action"
                title="Turn a requirement into a controlled loop."
              />
              <P>
                A reference becomes useful only when the facility can identify
                the asset, record the issue, control exposure and prove
                closure.
              </P>

              <ol
                className="mt-7"
                style={{ borderTop: `1px solid ${HAIR}` }}
              >
                {LOOP.map((l) => (
                  <li
                    key={l.n}
                    className="flex items-start gap-5 py-3.5"
                    style={{ borderBottom: `1px solid ${HAIR}` }}
                  >
                    <span className="text-[11px] font-mono font-bold tracking-[0.14em] text-signal-orange tabular-nums mt-0.5 shrink-0">
                      {l.n}
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-white">
                        {l.title}
                      </p>
                      <p className="mt-1 text-[13px] leading-[1.6] text-white/45">
                        {l.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-6">
                <Boundary>
                  A glossary does not decide severity or approve a repair.
                  Those decisions require the applicable rule set, equipment
                  information and competent assessment for the actual
                  condition.
                </Boundary>
              </div>
            </Section>

            {/* ── 07 Responsibilities ───────────────────── */}
            <Section>
              <H
                id="roles"
                eyebrow="Responsibility map"
                title="Know who observes, decides, acts and verifies."
              />
              <P>
                Titles vary by organisation and jurisdiction. The control
                principle is stable: responsibilities and escalation must be
                explicit.
              </P>

              <div className="mt-7 space-y-3">
                {ROLES.map((r) => (
                  <Card key={r.role}>
                    <p className="text-[14px] font-semibold text-signal-orange">
                      {r.role}
                    </p>
                    <p className="mt-2.5 text-[13.5px] leading-[1.7] text-white/55">
                      {r.duty}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {r.evidence.map((e) => (
                        <span
                          key={e}
                          className="text-[10.5px] font-medium text-white/45 px-2.5 py-1"
                          style={{
                            borderRadius: 999,
                            background: "rgba(255,255,255,0.06)",
                          }}
                        >
                          {e}
                        </span>
                      ))}
                    </div>

                    <p
                      className="mt-4 pt-4 text-[12.5px] leading-[1.65] text-white/40"
                      style={{ borderTop: `1px solid ${HAIR}` }}
                    >
                      <span className="text-signal-orange font-semibold">
                        Boundary ·{" "}
                      </span>
                      {r.boundary}
                    </p>
                  </Card>
                ))}
              </div>
            </Section>

            {/* ── 08 RAMS context ───────────────────────── */}
            <Section>
              <H
                id="bridge"
                eyebrow="RAMS operational bridge"
                title="Keep every finding attached to the physical asset."
              />
              <P>
                IRDS and the RAMS Digital Twin preserve location, asset
                identity, inspection history, evidence, action and
                verification — so guidance becomes traceable work.
              </P>

              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BRIDGE.map((b) => (
                  <Card key={b.title}>
                    <p className="text-[14px] font-semibold text-white">
                      {b.title}
                    </p>
                    <p className="mt-2 text-[13px] leading-[1.65] text-white/45">
                      {b.body}
                    </p>
                  </Card>
                ))}
              </div>

              <p className="mt-7 text-[13.5px] leading-[1.75] text-white/50 max-w-[680px]">
                One term rarely tells the whole story. When a finding is
                opened, the useful context may include the applicable guide,
                asset geometry, manufacturer information, operating exposure,
                event history and previous corrective actions.
              </p>

              <div
                className="mt-5"
                style={{ borderTop: `1px solid ${HAIR}` }}
              >
                {CONTEXT.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex flex-col sm:flex-row sm:gap-6 py-3.5"
                    style={{ borderBottom: `1px solid ${HAIR}` }}
                  >
                    <span className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/25 sm:w-[110px] shrink-0 sm:pt-1">
                      {k}
                    </span>
                    <span className="text-[13.5px] leading-[1.6] text-white/55">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </Section>

            {/* ── 09 Use responsibly ────────────────────── */}
            <Section>
              <H
                id="principles"
                eyebrow="Use the guides responsibly"
                title="Reference to evidence, on the ground."
              />
              <P>
                Map the asset. Record the condition. Apply the right framework.
                Assign the response. Verify closure. Preserve the history.
              </P>

              <div className="mt-7 flex items-center gap-3 flex-wrap">
                <Link
                  href="/company/contact"
                  className="inline-flex items-center gap-2 bg-signal-orange text-white text-[13.5px] font-semibold px-5 py-3 rounded-full transition-all duration-200 hover:-translate-y-px hover:bg-signal-orange-hover"
                >
                  Discuss your compliance workflow
                  <ArrowUpRight className="w-4 h-4" aria-hidden />
                </Link>
                <Link
                  href="/platform/irds"
                  className="inline-flex items-center gap-2 text-white text-[13.5px] font-semibold px-5 py-3 rounded-full transition-colors duration-200 hover:bg-white hover:text-carbon"
                  style={{ boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.18)" }}
                >
                  Explore IRDS
                </Link>
              </div>
            </Section>

            {/* ── 10 FAQ ────────────────────────────────── */}
            <Section>
              <H
                id="faq"
                eyebrow="Frequently asked questions"
                title="Using compliance references correctly."
              />
              <div className="mt-7">
                <Faq />
              </div>
            </Section>
          </div>
        </main>

        <TechToc toc={TOC} active={active}>
          <div
            className="p-5 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              boxShadow: `inset 0 0 0 1px ${HAIR}`,
            }}
          >
            <p className="text-[13.5px] font-bold text-white leading-[1.35]">
              Need a determination, not a definition?
            </p>
            <p className="mt-2.5 text-[12.5px] text-white/45 leading-[1.6]">
              Rack inspection, damage classification and closure evidence for
              your own facility.
            </p>
            <a
              href={`mailto:${EMAIL}?subject=${encodeURIComponent("RAMS Digital rack inspection enquiry")}`}
              className="mt-4 inline-flex items-center gap-1.5 bg-signal-orange text-white text-[12.5px] font-semibold px-4 py-2.5 rounded-full transition-colors duration-200 hover:bg-signal-orange-hover"
            >
              Request an inspection
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden />
            </a>
          </div>
        </TechToc>
      </div>
    </div>
  );
}
