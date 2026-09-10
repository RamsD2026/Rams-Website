"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ShieldAlert } from "lucide-react";
import { EASE, SURFACE } from "@/components/sections/rackiq/rackiq-shared";
import { EMAIL, PHONE_1, tel } from "@/components/sections/contact/contact-data";
import {
  CodeBlock,
  TechSidebar,
  TechToc,
  useScrollSpy,
} from "./TechShell";
import {
  CONCEPTS,
  CONTEXT,
  ENTRY,
  EVENTS,
  EVENT_SAMPLE,
  FAQS,
  MODEL_RULES,
  MODULES,
  PHASES,
  PRODUCERS,
  RESOURCES,
  RESPONSE,
  SAFEGUARDS,
  SAMPLES,
  STEPS,
  NAV,
  TOC,
} from "./tech-data";

/**
 * The technical notes, in the shell.
 *
 * `TechShell` owns the two rails, the scroll-spy and the code block; this
 * file is the middle column — eleven sections in the order both rails list
 * them, each with the `id` the spy and the anchors use.
 *
 * ── The banner is at the top, and it is the point ───────────────────
 * Every route, payload and event name below is a *pattern*. The source says
 * so in six separate places and this carries all six, because a documentation
 * page is the one kind of content a developer copies straight into a client:
 * the banner sits above the first heading rather than in a footnote, every
 * code block is labelled ILLUSTRATIVE by `CodeBlock` itself, every event
 * carries a PATTERN chip, and the first FAQ answer is the question somebody
 * would actually ask.
 *
 * Nothing here was invented to fill a gap. Where the source says "confirm
 * during implementation", so does this.
 *
 * ── Type scale ──────────────────────────────────────────────────────
 * Documentation, not marketing: h1 at 44, section headings at 26, body at 15
 * on a 1.75 measure, and a 760px column. The page's own type is smaller than
 * anything else on this site on purpose — the platform pages set a heading at
 * 68 because they are read once, and this is read with something else open
 * beside it.
 */

const HAIR = "rgba(255,255,255,0.08)";
const CARD = "rgba(255,255,255,0.03)";

/* ── shared bits of the middle column ─────────────────────────────── */

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

/* ── the FAQ rows ─────────────────────────────────────────────────── */

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

/* ── the page ─────────────────────────────────────────────────────── */

export function TechNotes() {
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
        <TechSidebar nav={NAV} active={active} label="Technical notes" />

        <main className="min-w-0 max-w-[760px]">
          {/* the title block */}
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-signal-orange">
            Integration &amp; API documentation
          </p>

          <h1 className="mt-4 text-[36px] sm:text-[44px] font-bold tracking-[-0.04em] leading-[1.08]">
            Build on the physical context.
          </h1>

          <p className="mt-5 text-[16px] leading-[1.7] text-white/55 max-w-[660px]">
            Technical notes for connecting enterprise systems, sensors, edge
            devices and customer applications to the RAMS Digital Twin and
            operational platform.
          </p>

          {/* The specification banner. Above the first heading rather than in
              a footnote — everything below it is a pattern, and a reader who
              scrolls straight to a code block has already passed it. */}
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
                Specification required.
              </span>{" "}
              Endpoint names, schemas and payloads on this page are integration
              patterns, not a live API contract. Use only the specification,
              environment details and credentials issued for your approved
              implementation.
            </p>
          </div>

          <div className="mt-14">
            {/* ── 01 Overview ───────────────────────────── */}
            <Section>
              <H
                id="overview"
                eyebrow="Technical notes"
                title="Connect systems without losing physical context."
              />
              <P>
                RAMS brings information from operational platforms and connected
                devices into a common spatial and asset context. Use these notes
                to shape the integration conversation, then confirm the final
                contract during solution design.
              </P>

              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <p className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-white/30">
                    Integration principle
                  </p>
                  <p className="mt-3 text-[15px] font-semibold text-white leading-[1.4]">
                    One physical context. Multiple data producers.
                  </p>
                  <p className="mt-2.5 text-[13.5px] leading-[1.65] text-white/45">
                    Enterprise systems, sensors, cameras, machines and customer
                    applications each contribute part of the operating picture.
                  </p>
                </Card>

                <Card>
                  <p className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
                    Important boundary
                  </p>
                  <p className="mt-3 text-[15px] font-semibold text-white leading-[1.4]">
                    Contract before code.
                  </p>
                  <p className="mt-2.5 text-[13.5px] leading-[1.65] text-white/45">
                    Confirm tenancy, credentials, endpoints, schemas, event
                    delivery, retention and security before implementation.
                  </p>
                </Card>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ENTRY.map((e) => (
                  <a key={e.n} href={`#${e.to}`} className="group">
                    <Card className="h-full transition-colors duration-300 hover:bg-white/[0.05]">
                      <span className="text-[10px] font-mono font-bold tracking-[0.18em] text-white/25 tabular-nums">
                        {e.n}
                      </span>
                      <p className="mt-3 flex items-center gap-1.5 text-[14.5px] font-semibold text-white leading-[1.35] transition-colors duration-300 group-hover:text-signal-orange">
                        {e.title}
                        <ArrowRight
                          className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                          aria-hidden
                        />
                      </p>
                      <p className="mt-2 text-[13px] leading-[1.6] text-white/45">
                        {e.body}
                      </p>
                    </Card>
                  </a>
                ))}
              </div>
            </Section>

            {/* ── 02 Architecture ───────────────────────── */}
            <Section>
              <H
                id="architecture"
                eyebrow="Integration architecture"
                title="Bring data into the same physical context."
              />
              <P>
                Business systems and physical signals connect through an
                integration layer, then organise around the Digital Twin and the
                operational applications. The final topology depends on customer
                systems, network boundaries, device estate and approved
                interfaces.
              </P>

              <div className="mt-7 space-y-4">
                <div>
                  <p className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-white/30 mb-3">
                    Data producers
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {PRODUCERS.map((p) => (
                      <Card key={p.title}>
                        <p className="text-[13.5px] font-semibold text-white">
                          {p.title}
                        </p>
                        <p className="mt-1.5 text-[12px] font-mono text-white/40">
                          {p.body}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>

                <div
                  className="p-5 rounded-xl text-center"
                  style={{
                    background: "rgba(255,106,0,0.07)",
                    boxShadow: "inset 0 0 0 1px rgba(255,106,0,0.20)",
                  }}
                >
                  <p className="text-[12px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
                    APIs + Events + Edge
                  </p>
                  <p className="mt-2 text-[13px] text-white/50">
                    Identity · Mapping · Validation · Delivery
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-white/30 mb-3">
                    RAMS context
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {CONTEXT.map((c) => (
                      <Card key={c.title}>
                        <p className="text-[13.5px] font-semibold text-white">
                          {c.title}
                        </p>
                        <p className="mt-1.5 text-[12px] font-mono text-white/40">
                          {c.body}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>

                <p className="text-center text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-white/25 pt-2">
                  Connect → Normalise → Contextualise → Act
                </p>
              </div>
            </Section>

            {/* ── 03 Quick start ────────────────────────── */}
            <Section>
              <H
                id="quick-start"
                eyebrow="Quick start"
                title="Move from use case to verified data flow."
              />
              <P>
                A successful integration begins with the operational decision,
                not the endpoint.
              </P>

              <ol className="mt-7 space-y-0" style={{ borderTop: `1px solid ${HAIR}` }}>
                {STEPS.map((s) => (
                  <li
                    key={s.n}
                    className="flex items-start gap-5 py-4"
                    style={{ borderBottom: `1px solid ${HAIR}` }}
                  >
                    <span className="text-[11px] font-mono font-bold tracking-[0.14em] text-signal-orange tabular-nums mt-0.5 shrink-0">
                      {s.n}
                    </span>
                    <div>
                      <p className="text-[14.5px] font-semibold text-white leading-[1.4]">
                        {s.title}
                      </p>
                      <p className="mt-1.5 text-[13.5px] leading-[1.65] text-white/45">
                        {s.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Section>

            {/* ── 04 API concepts ───────────────────────── */}
            <Section>
              <H
                id="api-concepts"
                eyebrow="API concepts"
                title="Predictable patterns for enterprise integration."
              />
              <P>
                Use these principles to prepare the client and RAMS teams for a
                stable interface contract.
              </P>

              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CONCEPTS.map((c) => (
                  <Card key={c.title}>
                    <p className="text-[14px] font-semibold text-white">
                      {c.title}
                    </p>
                    <p className="mt-2 text-[13px] leading-[1.65] text-white/45">
                      {c.body}
                    </p>
                  </Card>
                ))}
              </div>

              <div className="mt-6">
                <CodeBlock
                  file="integration-example.http"
                  tabs={SAMPLES}
                  caption="Illustrative only — replace placeholders with the approved RAMS integration contract."
                />
              </div>

              <div className="mt-4">
                <CodeBlock
                  file="response.json"
                  tabs={[{ lang: "JSON", code: RESPONSE }]}
                  caption="Shape only. No live endpoint or schema is implied."
                />
              </div>
            </Section>

            {/* ── 05 Data model ─────────────────────────── */}
            <Section>
              <H
                id="data-model"
                eyebrow="Data model"
                title="Every record needs a place in the physical world."
              />
              <P>
                The Digital Twin provides the shared context that lets different
                modules and external systems refer to the same facility, asset
                and event history.
              </P>

              <div className="mt-7 flex flex-wrap gap-2">
                {RESOURCES.map((r) => (
                  <span
                    key={r.name}
                    className="inline-flex items-baseline gap-2 px-3 py-2 rounded-lg"
                    style={{
                      background: CARD,
                      boxShadow: `inset 0 0 0 1px ${HAIR}`,
                    }}
                  >
                    <code className="text-[12.5px] font-mono text-signal-orange">
                      {r.name}
                    </code>
                    <span className="text-[11.5px] text-white/35">
                      {r.body}
                    </span>
                  </span>
                ))}
              </div>

              <p className="mt-5 text-[13.5px] leading-[1.7] text-white/45 max-w-[660px]">
                A useful event does not stand alone. It should be traceable to
                the relevant site, location, asset, time and operational
                workflow.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MODEL_RULES.map((m) => (
                  <Card key={m.n}>
                    <span className="text-[10px] font-mono font-bold tracking-[0.18em] text-white/25 tabular-nums">
                      {m.n}
                    </span>
                    <p className="mt-3 text-[14px] font-semibold text-white">
                      {m.title}
                    </p>
                    <p className="mt-2 text-[13px] leading-[1.65] text-white/45">
                      {m.body}
                    </p>
                  </Card>
                ))}
              </div>
            </Section>

            {/* ── 06 Events ─────────────────────────────── */}
            <Section>
              <H
                id="events"
                eyebrow="Events & webhooks"
                title="Respond when the physical operation changes."
              />
              <P>
                Event-driven integrations notify approved consumers when selected
                operational states change. Confirm available event types and
                delivery behaviour during implementation.
              </P>

              <div className="mt-7 space-y-2">
                {EVENTS.map((e) => (
                  <div
                    key={e.name}
                    className="flex items-center justify-between gap-4 px-4 py-3.5 rounded-lg"
                    style={{
                      background: CARD,
                      boxShadow: `inset 0 0 0 1px ${HAIR}`,
                    }}
                  >
                    <div className="min-w-0">
                      <code className="block text-[12.5px] font-mono text-signal-orange truncate">
                        {e.name}
                      </code>
                      <p className="mt-1 text-[12.5px] text-white/40 truncate">
                        {e.body}
                      </p>
                    </div>
                    <span
                      className="shrink-0 text-[9px] font-mono font-bold tracking-[0.16em] uppercase text-white/35 px-2 py-1"
                      style={{
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.06)",
                      }}
                    >
                      Pattern
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <CodeBlock
                  file="example-event.json"
                  tabs={[{ lang: "JSON", code: EVENT_SAMPLE }]}
                  caption="Validate signatures, idempotency, delivery retries and timeout behaviour against the issued webhook specification."
                />
              </div>
            </Section>

            {/* ── 07 Module data ────────────────────────── */}
            <Section>
              <H
                id="module-data"
                eyebrow="Integration catalogue"
                title="Map data to the application that uses it."
              />
              <P>
                A modular integration should exchange only the data required for
                the agreed workflow and outcome.
              </P>

              <div className="mt-7 space-y-3">
                {MODULES.map((m) => (
                  <Card key={m.name}>
                    <p className="text-[14px] font-semibold text-signal-orange">
                      {m.name}
                    </p>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        ["Typical inbound", m.inbound.join(" · ")],
                        ["Typical outbound", m.outbound.join(" · ")],
                        ["Enterprise systems", m.systems],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <p className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/25">
                            {k}
                          </p>
                          <p className="mt-1.5 text-[12.5px] leading-[1.55] text-white/55">
                            {v}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>

              <p className="mt-5 text-[12.5px] leading-[1.7] text-white/35 max-w-[660px]">
                Examples show integration categories, not guaranteed fields or
                connectors. Confirm supported modules, directions, frequency and
                ownership for every implementation.
              </p>
            </Section>

            {/* ── 08 Security ───────────────────────────── */}
            <Section>
              <H
                id="security"
                eyebrow="Security & operational safeguards"
                title="Design trust into the interface contract."
              />
              <P>
                Technical integration should be reviewed against the customer&rsquo;s
                architecture, access, privacy, monitoring and change-control
                requirements.
              </P>

              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SAFEGUARDS.map((s) => (
                  <Card key={s.code}>
                    <p className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/25">
                      {s.code}
                    </p>
                    <p className="mt-3 text-[14px] font-semibold text-white">
                      {s.title}
                    </p>
                    <p className="mt-2 text-[13px] leading-[1.65] text-white/45">
                      {s.body}
                    </p>
                  </Card>
                ))}
              </div>
            </Section>

            {/* ── 09 Implementation ─────────────────────── */}
            <Section>
              <H
                id="implementation"
                eyebrow="Implementation pathway"
                title="Adopt the integration in controlled stages."
              />
              <P>
                Move from discovery to production with clear ownership and
                acceptance at every gate.
              </P>

              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PHASES.map((p) => (
                  <Card key={p.n}>
                    <p className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-signal-orange">
                      {p.n}
                    </p>
                    <p className="mt-3 text-[15px] font-semibold text-white">
                      {p.title}
                    </p>
                    <p className="mt-2 text-[13px] leading-[1.65] text-white/45">
                      {p.body}
                    </p>
                    <ul className="mt-4 space-y-1.5">
                      {p.points.map((pt) => (
                        <li
                          key={pt}
                          className="flex items-center gap-2 text-[12.5px] text-white/50"
                        >
                          <span
                            aria-hidden
                            className="w-1 h-1 rounded-full shrink-0"
                            style={{ background: "#FF6A00" }}
                          />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </Section>

            {/* ── 10 Support ────────────────────────────── */}
            <Section>
              <H
                id="support"
                eyebrow="Integration support"
                title="Bring the system map. We build the context map."
              />
              <P>
                Share the workflow, source systems, device estate, data owners
                and decisions you want to enable. Include the data direction,
                update frequency, security constraints and target workflow.
              </P>

              <div className="mt-7 flex items-center gap-3 flex-wrap">
                <Link
                  href="/company/contact"
                  className="inline-flex items-center gap-2 bg-signal-orange text-white text-[13.5px] font-semibold px-5 py-3 rounded-full transition-all duration-200 hover:-translate-y-px hover:bg-signal-orange-hover"
                >
                  Start integration discovery
                  <ArrowUpRight className="w-4 h-4" aria-hidden />
                </Link>
                <a
                  href={`mailto:${EMAIL}?subject=${encodeURIComponent("RAMS Digital integration specification")}`}
                  className="inline-flex items-center gap-2 text-white text-[13.5px] font-semibold px-5 py-3 rounded-full transition-colors duration-200 hover:bg-white hover:text-carbon"
                  style={{ boxShadow: `inset 0 0 0 1.5px rgba(255,255,255,0.18)` }}
                >
                  Request the specification
                </a>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <p className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/25">
                    Email
                  </p>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="mt-2 block text-[14px] font-semibold text-white hover:text-signal-orange transition-colors"
                  >
                    {EMAIL}
                  </a>
                </Card>
                <Card>
                  <p className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/25">
                    India
                  </p>
                  <a
                    href={tel(PHONE_1)}
                    className="mt-2 block text-[14px] font-semibold text-white hover:text-signal-orange transition-colors"
                  >
                    {PHONE_1}
                  </a>
                </Card>
              </div>
            </Section>

            {/* ── 11 FAQ ────────────────────────────────── */}
            <Section>
              <H
                id="faq"
                eyebrow="Frequently asked questions"
                title="Before implementation begins."
              />
              <div className="mt-7">
                <Faq />
              </div>
            </Section>
          </div>
        </main>

        <TechToc toc={TOC} active={active}>
          {/* the reference puts a promo card here; this puts the one thing a
              reader of an illustrative spec actually needs — the team that
              issues the real one */}
          <div
            className="p-5 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
            }}
          >
            <p className="text-[13.5px] font-bold text-white leading-[1.35]">
              Need the issued specification?
            </p>
            <p className="mt-2.5 text-[12.5px] text-white/45 leading-[1.6]">
              Endpoints, schemas and credentials are released per environment
              during solution design.
            </p>
            <Link
              href="/company/contact"
              className="mt-4 inline-flex items-center gap-1.5 bg-signal-orange text-white text-[12.5px] font-semibold px-4 py-2.5 rounded-full transition-colors duration-200 hover:bg-signal-orange-hover"
            >
              Request access
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden />
            </Link>
          </div>
        </TechToc>
      </div>
    </div>
  );
}
