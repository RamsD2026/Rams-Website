"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  BookOpenCheck,
  Building2,
  CheckCheck,
  ClipboardList,
  Crosshair,
  Database,
  Eye,
  FileCheck2,
  FileSignature,
  Gauge,
  GraduationCap,
  Handshake,
  History,
  KeyRound,
  Layers,
  Plug,
  Radio,
  RefreshCcw,
  ScanLine,
  Search,
  Server,
  ShieldCheck,
  Siren,
  SlidersHorizontal,
  Tags,
  UserCheck,
  Wrench,
} from "lucide-react";

import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { DOMAIN_ICONS, STATUS_TINT } from "./CertSections";
import {
  CERT_CARD,
  CERT_CARD_DARK,
  CERT_LINE,
  CertFlow,
  CertLink,
  CertShine,
  CertTile,
} from "./cert-ui";
import {
  DATAFLOW,
  DOMAINS,
  EVIDENCE,
  FEED,
  INTERFACE_PRINCIPLES,
  INTERFACE_SOURCES,
  PATH,
  QUESTIONS,
  RECOVERY,
  REGISTER,
  ROLES,
  SHARED,
  STATUS_LABEL,
  WORKFLOW,
  packHref,
} from "./cert-data";

/**
 * The certifications page below the hero, rebuilt from
 * `RAMS_Digital_Certifications_and_Security.html` section for section, in
 * the platform pages' card vocabulary (`cert-ui`).
 *
 * The source carries fourteen sections after its hero; the page had shipped
 * six, and those six were hairline rows and bare columns — type on the
 * ground, with nothing to hold it. Every section here is the source's, in the
 * source's order, and every line is the source's words: nothing on this page
 * claims more than the document does.
 */

const card =
  "certx-card group relative transition-all duration-300 hover:-translate-y-1 ";

function rise(i: number, per = 4) {
  return {
    initial: { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.6, delay: (i % per) * 0.07, ease: EASE },
  } as const;
}

/* ── 02 Four questions ───────────────────────────────────────────── */

const QUESTION_ICONS = [BadgeCheck, BookOpenCheck, KeyRound, FileSignature];

export function CertQuestions() {
  return (
    <Section surface="white" id="questions">
      <CertShine />
      <SectionHeader
        eyebrow="Trust posture"
        top="One trust posture."
        bottom="Four distinct questions."
        size="compact"
        width="wide"
        body="Certifications matter, but enterprise trust also depends on how controls operate, how standards are applied and what the contract actually commits to."
        className="!mb-12 sm:!mb-14"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {QUESTIONS.map((q, i) => (
          <motion.article
            key={q.code}
            {...rise(i)}
            className={card + "flex flex-col h-full p-7 bg-white"}
            style={CERT_CARD}
          >
            <CertTile icon={QUESTION_ICONS[i] ?? ShieldCheck} />
            <span className="mt-6 text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
              {q.code}
            </span>
            <h3 className="mt-3 text-[18px] sm:text-[19px] font-bold tracking-[-0.02em] text-carbon leading-[1.25]">
              {q.question}
            </h3>
            <p className="mt-3 text-[14px] leading-[1.65] text-graphite/65">
              {q.body}
            </p>
            <div className="mt-auto pt-6">
              <span
                className="inline-flex px-2.5 py-1 rounded-full text-[10.5px] text-graphite/60"
                style={{
                  background: "#FAFAFB",
                  border: `1px solid ${CERT_LINE}`,
                }}
              >
                {q.tag}
              </span>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

/* ── 04 Standards — EN 15635 as a workflow ───────────────────────── */

const WORKFLOW_ICONS = [ScanLine, Gauge, ClipboardList, Wrench, BadgeCheck];
const ROLE_ICONS = [BookOpen, GraduationCap, Layers, Building2];

export function CertStandards() {
  return (
    <Section surface="ink" id="standards">
      <CertShine />
      <CertFlow />
      <SectionHeader
        eyebrow="Standards alignment"
        top="A standard only creates value"
        bottom="When it changes the workflow."
        tone="dark"
        size="long"
        width="wide"
        body="RAMS connects inspection evidence, asset context and corrective actions so safety standards can become an operational process — not a static certificate."
        className="!mb-12 sm:!mb-14"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-5">
        {/* the workflow the standard becomes */}
        <motion.div
          {...rise(0)}
          className={card + "certx-dark flex flex-col p-8 sm:p-9"}
          style={CERT_CARD_DARK}
        >
          <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange">
            Rack safety · EN 15635
          </span>
          <h3 className="mt-4 text-[22px] sm:text-[24px] font-bold tracking-[-0.025em] text-white leading-[1.2]">
            From inspection to verified closure.
          </h3>
          <p className="mt-3 text-[14px] leading-[1.65] text-white/55 max-w-[52ch]">
            Support competent inspection programmes with digital records linked
            to racks, bays, locations and actions.
          </p>

          <ol className="relative mt-8">
            {WORKFLOW.map(([step, line], i) => {
              const Icon = WORKFLOW_ICONS[i] ?? BadgeCheck;
              return (
                <li
                  key={step}
                  className="relative flex items-center gap-5 py-2.5"
                >
                  {/* tile bottom to the next tile's top: the rows are one
                      height, so that is the row less the 48px tile */}
                  {i < WORKFLOW.length - 1 && (
                    <CertLink
                      axis="y"
                      dark
                      delay={i * 0.4}
                      className="left-[23.5px] w-px"
                      style={{
                        top: "calc(50% + 24px)",
                        height: "calc(100% - 48px)",
                      }}
                    />
                  )}
                  <CertTile icon={Icon} dark />
                  <div className="min-w-0">
                    <p className="text-[16px] font-bold tracking-[-0.015em] text-white leading-[1.3]">
                      {step}
                    </p>
                    <p className="mt-0.5 text-[13px] text-white/50">{line}</p>
                  </div>
                  <span className="ml-auto text-[10.5px] font-mono font-bold tracking-[0.18em] tabular-nums text-white/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </li>
              );
            })}
          </ol>
        </motion.div>

        {/* the distinction the standard does not make for you */}
        <motion.div
          {...rise(1)}
          className={card + "certx-dark flex flex-col p-8 sm:p-9"}
          style={CERT_CARD_DARK}
        >
          <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange">
            Important distinction
          </span>
          <h3 className="mt-4 text-[22px] sm:text-[24px] font-bold tracking-[-0.025em] text-white leading-[1.2]">
            Alignment is not accreditation.
          </h3>
          <p className="mt-3 text-[14px] leading-[1.65] text-white/55">
            EN 15635 can inform a rack-safety programme. It does not certify the
            software, the site or the customer by itself.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
            {ROLES.map(([role, line], i) => (
              <div
                key={role}
                className="flex flex-col p-5"
                style={{
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <CertTile icon={ROLE_ICONS[i] ?? Layers} dark />
                <p className="mt-4 text-[15px] font-bold tracking-[-0.015em] text-white">
                  {role}
                </p>
                <p className="mt-1 text-[13px] leading-[1.55] text-white/50">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

/* ── 05 Security architecture ────────────────────────────────────── */

export function CertArchitecture() {
  return (
    <Section surface="white" id="architecture">
      <CertShine />
      <SectionHeader
        eyebrow="Security architecture"
        top="Protection across identity,"
        bottom="Data and operations."
        size="compact"
        width="wide"
        body="The assurance conversation should cover the whole operating chain — from a user opening the platform to a sensor or business system exchanging data."
        className="!mb-12 sm:!mb-14"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {DOMAINS.map((d, i) => (
          <motion.article
            key={d.code}
            {...rise(i, 3)}
            className={card + "flex flex-col h-full p-7 sm:p-8 bg-white"}
            style={CERT_CARD}
          >
            <div className="flex items-start justify-between gap-4">
              <CertTile icon={DOMAIN_ICONS[i] ?? ShieldCheck} />
              <span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/35">
                {d.code}
              </span>
            </div>
            <h3 className="mt-6 text-[20px] sm:text-[21px] font-bold tracking-[-0.02em] text-carbon leading-[1.2]">
              {d.title}
            </h3>
            <p className="mt-3 text-[14px] leading-[1.65] text-graphite/65">
              {d.body}
            </p>
            {/* mt-auto on a wrapper, not the list: an inline margin on the
                list would override it and the points would stop floating to
                the foot of the card */}
            <div className="mt-auto pt-6">
              <ul
                className="pt-5 space-y-2.5"
                style={{ borderTop: `1px solid ${CERT_LINE}` }}
              >
                {d.points.map((pt) => (
                  <li
                    key={pt}
                    className="flex items-start gap-2.5 text-[13.5px] leading-[1.55] text-graphite/70"
                  >
                    <span
                      className="mt-[7px] w-1.5 h-1.5 rounded-full bg-signal-orange shrink-0"
                      aria-hidden
                    />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

/* ── 06 Control register ─────────────────────────────────────────── */

export function CertRegister() {
  return (
    <Section surface="offWhite" id="register">
      <CertShine />
      <SectionHeader
        eyebrow="Control register"
        top="Published, configurable"
        bottom="Or contractual."
        size="compact"
        width="wide"
        body="That distinction keeps security statements accurate — and gives procurement teams a faster route to the evidence they need."
        className="!mb-12 sm:!mb-14"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {REGISTER.map((r, i) => (
          <motion.article
            key={r.area}
            {...rise(i, 3)}
            className={card + "flex flex-col h-full p-7 bg-white"}
            style={CERT_CARD}
          >
            <span
              className="self-start inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-semibold text-graphite/70"
              style={{
                background: "#FAFAFB",
                border: `1px solid ${CERT_LINE}`,
              }}
            >
              <span
                aria-hidden
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: STATUS_TINT[r.status] }}
              />
              {STATUS_LABEL[r.status]}
            </span>
            <h3 className="mt-6 text-[19px] sm:text-[20px] font-bold tracking-[-0.02em] text-carbon leading-[1.25]">
              {r.area}
            </h3>
            <div className="mt-auto pt-6">
              <p className="text-[9.5px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/40">
                How to evaluate it
              </p>
              <p className="mt-2 text-[14px] leading-[1.65] text-graphite/65">
                {r.evaluate}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

/* ── 07 Data flow ────────────────────────────────────────────────── */

const DATAFLOW_ICONS = [Search, Tags, SlidersHorizontal, CheckCheck];

export function CertDataFlow() {
  return (
    <Section surface="white" id="data">
      <CertFlow />
      <SectionHeader
        eyebrow="Data protection"
        top="Start with the data flow,"
        bottom="Not the checkbox."
        size="compact"
        width="wide"
        body="A useful security review identifies what the platform receives, why it is needed, where it moves, who can access it and how long it should remain."
        className="!mb-14 sm:!mb-16"
      />

      {/* The platform pages' rail, drawn tile to tile. Each column's tile is
          centred, so from its right edge (50% + 24px) to the next tile's left
          edge is the column width plus the 24px gap, less the 48px tile. */}
      <div className="relative overflow-x-auto">
        <div className="relative min-w-[640px] lg:min-w-0">
          <div className="relative grid grid-cols-4 gap-6">
            {DATAFLOW.map((d, i) => (
              <motion.div
                key={d.n}
                {...rise(i)}
                className="relative flex flex-col items-center text-center px-2"
              >
                {i < DATAFLOW.length - 1 && (
                  <CertLink
                    axis="x"
                    delay={i * 0.6}
                    className="top-[23.5px] h-px"
                    style={{
                      left: "calc(50% + 24px)",
                      width: "calc(100% - 24px)",
                    }}
                  />
                )}
                <CertTile icon={DATAFLOW_ICONS[i] ?? CheckCheck} />
                <span className="mt-5 text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange tabular-nums">
                  {d.n}
                </span>
                <h3 className="mt-2 text-[19px] sm:text-[20px] font-bold tracking-[-0.02em] text-carbon leading-[1.2]">
                  {d.title}
                </h3>
                <p className="mt-3 text-[14px] leading-[1.65] text-graphite/65 max-w-[240px]">
                  {d.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ── 08 Attributable evidence ────────────────────────────────────── */

/** Tints from the platform's coloured-tile palette; they carry no meaning. */
const FEED_TINT = ["#3E63DD", "#12A594", "#6647F0", "#F76808"];

export function CertFeed() {
  return (
    <Section surface="offWhite" id="evidence">
      <CertShine />
      <SectionHeader
        eyebrow="Evidence & traceability"
        top="From verbal updates"
        bottom="To attributable evidence."
        size="compact"
        width="wide"
        body="Operational records become more useful when they connect the person, action, time, site and physical asset — instead of being scattered across email, spreadsheets and presentations."
        className="!mb-12 sm:!mb-14"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-5">
        <motion.div
          {...rise(0)}
          className={card + "flex flex-col justify-between p-8 sm:p-10"}
          style={{
            borderRadius: 12,
            background: "linear-gradient(160deg, #FFF6EF 0%, #FFFFFF 72%)",
            border: "1px solid #FFD9BC",
          }}
        >
          <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange">
            The principle
          </span>
          <p className="mt-8 font-rams-heading text-[26px] sm:text-[30px] font-bold tracking-[-0.03em] leading-[1.18] text-carbon">
            Data shows what changed.{" "}
            <span className="text-graphite/45">
              Context shows where, why and by whom.
            </span>
          </p>
          <div className="mt-10 flex flex-wrap gap-1.5">
            {["Person", "Action", "Time", "Site", "Asset"].map((c) => (
              <span
                key={c}
                className="px-2.5 py-1 rounded-full text-[10.5px] text-graphite/60 bg-white"
                style={{ border: "1px solid #F3DCC8" }}
              >
                {c}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          {...rise(1)}
          className={card + "flex flex-col p-6 sm:p-7 bg-white"}
          style={CERT_CARD}
        >
          <div
            className="flex items-center gap-2.5 pb-4"
            style={{ borderBottom: `1px solid ${CERT_LINE}` }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-signal-orange"
              aria-hidden
            />
            <span className="text-[11px] font-mono font-bold tracking-[0.16em] uppercase text-graphite/60">
              Site 03 · Assurance activity
            </span>
            <span className="ml-auto text-[10px] font-mono tracking-[0.14em] uppercase text-graphite/35">
              Illustrative activity
            </span>
          </div>

          <ul>
            {FEED.map((f, i) => (
              <li
                key={f.title}
                className="flex items-center gap-4 py-4"
                style={
                  i === 0 ? undefined : { borderTop: `1px solid ${CERT_LINE}` }
                }
              >
                <span
                  className="w-11 h-11 shrink-0 flex items-center justify-center text-[11px] font-mono font-bold tracking-[0.04em] text-white"
                  style={{
                    borderRadius: 10,
                    background: FEED_TINT[i % FEED_TINT.length],
                  }}
                  aria-hidden
                >
                  {f.code}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold tracking-[-0.01em] text-carbon leading-[1.3]">
                    {f.title}
                  </span>
                  <span className="mt-1 block text-[13px] text-graphite/55 truncate">
                    {f.meta}
                  </span>
                </span>
                <span className="text-[11.5px] font-mono tabular-nums text-graphite/45 shrink-0">
                  {f.when}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </Section>
  );
}

/* ── 09 Controlled interfaces ────────────────────────────────────── */

const SOURCE_ICONS = [Database, ClipboardList, Radio, Plug];
const PRINCIPLE_ICONS = [Crosshair, KeyRound, Eye, RefreshCcw];

export function CertInterfaces() {
  return (
    <Section surface="white" id="interfaces">
      <CertShine />
      <SectionHeader
        eyebrow="Integrations & third parties"
        top="Connected intelligence needs"
        bottom="Controlled interfaces."
        size="compact"
        width="wide"
        body="RAMS can integrate with operational and enterprise systems. Each connection should have a named owner, defined purpose, limited permissions and monitored credentials."
        className="!mb-12 sm:!mb-14"
      />

      {/* the systems that connect */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {INTERFACE_SOURCES.map((src, i) => {
          const Icon = SOURCE_ICONS[i] ?? Plug;
          return (
            <motion.div
              key={src}
              {...rise(i)}
              className="flex items-center gap-3 px-4 py-3.5 bg-white"
              style={{ borderRadius: 10, border: `1px solid ${CERT_LINE}` }}
            >
              <Icon
                className="w-[18px] h-[18px] text-graphite/45 shrink-0"
                strokeWidth={2}
                aria-hidden
              />
              <span className="text-[13.5px] font-semibold text-carbon/80">
                {src}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* through one governed boundary */}
      <div className="flex flex-col items-center">
        <span
          aria-hidden
          className="block w-px h-10"
          style={{ background: "#E4E4E9" }}
        />
        <motion.div
          {...rise(0)}
          className="flex items-center gap-4 px-6 py-4"
          style={{
            borderRadius: 12,
            background: "linear-gradient(160deg, #FFF6EF 0%, #FFFFFF 80%)",
            border: "1px solid #FFD9BC",
            boxShadow: "0 12px 32px -18px rgba(255,106,0,0.35)",
          }}
        >
          <span
            className="w-11 h-11 flex items-center justify-center shrink-0"
            style={{ borderRadius: 10, background: "#FF6A00" }}
          >
            <ShieldCheck
              className="w-[22px] h-[22px] text-white"
              strokeWidth={2}
              aria-hidden
            />
          </span>
          <span>
            <span className="block text-[15px] font-bold tracking-[-0.01em] text-carbon">
              RAMS Digital
            </span>
            <span className="block text-[12.5px] text-graphite/55">
              Governed integration boundary
            </span>
          </span>
        </motion.div>
        <span
          aria-hidden
          className="block w-px h-10"
          style={{ background: "#E4E4E9" }}
        />
      </div>

      {/* on four conditions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {INTERFACE_PRINCIPLES.map(([title, line], i) => (
          <motion.article
            key={title}
            {...rise(i)}
            className={card + "flex flex-col h-full p-7 bg-white"}
            style={CERT_CARD}
          >
            <CertTile icon={PRINCIPLE_ICONS[i] ?? ShieldCheck} />
            <h3 className="mt-6 text-[18px] sm:text-[19px] font-bold tracking-[-0.02em] text-carbon leading-[1.25]">
              {title}
            </h3>
            <p className="mt-3 text-[14px] leading-[1.65] text-graphite/65">
              {line}
            </p>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

/* ── 10 Shared compliance ────────────────────────────────────────── */

const SHARED_ICONS = [UserCheck, Server, Handshake];
const SHARED_WHO = ["Customer", "RAMS", "Together"];

export function CertShared() {
  return (
    <Section surface="offWhite" id="shared">
      <CertShine />
      <SectionHeader
        eyebrow="Privacy & governance"
        top="Compliance is shared,"
        bottom="Scoped and jurisdiction-specific."
        size="long"
        width="wide"
        body="RAMS can support controlled data handling, but no software platform makes a customer automatically compliant. The applicable law, roles and obligations depend on the deployment."
        className="!mb-12 sm:!mb-14"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SHARED.map(([title, body], i) => (
          <motion.article
            key={title}
            {...rise(i, 3)}
            className={card + "flex flex-col h-full p-7 sm:p-8 bg-white"}
            style={CERT_CARD}
          >
            <div className="flex items-start justify-between gap-4">
              <CertTile icon={SHARED_ICONS[i] ?? Handshake} />
              <span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/35">
                {SHARED_WHO[i]}
              </span>
            </div>
            <h3 className="mt-6 text-[20px] sm:text-[21px] font-bold tracking-[-0.02em] text-carbon leading-[1.2]">
              {title}
            </h3>
            <p className="mt-3 text-[14px] leading-[1.65] text-graphite/65">
              {body}
            </p>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

/* ── 11 Recovery ─────────────────────────────────────────────────── */

const RECOVERY_ICONS = [Activity, History, Siren];

/**
 * One card, three columns — a spec sheet rather than three more tiles, so it
 * does not read as a repeat of the shared-compliance row directly above.
 */
export function CertRecovery() {
  return (
    <Section surface="white" id="recovery">
      <SectionHeader
        eyebrow="Resilience"
        top="Define recovery"
        bottom="Before it is needed."
        size="compact"
        width="wide"
        body="A production deployment should translate availability expectations into explicit architecture, recovery targets, incident ownership and communication paths."
        className="!mb-12 sm:!mb-14"
      />

      <motion.div
        {...rise(0)}
        className="grid grid-cols-1 md:grid-cols-3 bg-white overflow-hidden"
        style={CERT_CARD}
      >
        {RECOVERY.map(([title, body], i) => (
          <div
            key={title}
            className="flex flex-col p-7 sm:p-9"
            style={
              i === 0 ? undefined : { borderLeft: `1px solid ${CERT_LINE}` }
            }
          >
            <CertTile icon={RECOVERY_ICONS[i] ?? Activity} />
            <h3 className="mt-6 text-[20px] sm:text-[21px] font-bold tracking-[-0.02em] text-carbon leading-[1.2]">
              {title}
            </h3>
            <p className="mt-3 text-[14px] leading-[1.65] text-graphite/65">
              {body}
            </p>
          </div>
        ))}
      </motion.div>
    </Section>
  );
}

/* ── 12 Implementation path ──────────────────────────────────────── */

export function CertPath() {
  return (
    <Section surface="ink" id="path">
      <SectionHeader
        eyebrow="Implementation"
        top="Security is configured"
        bottom="With the operation."
        tone="dark"
        size="compact"
        width="wide"
        body="Move from diligence to production through a controlled implementation path."
        className="!mb-14 sm:!mb-16"
      />

      <div className="relative">
        <div
          aria-hidden
          className="hidden lg:block absolute left-0 right-0 top-[34px] h-px"
          style={{
            background:
              "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.14) 12%, rgba(255,255,255,0.14) 88%, transparent 100%)",
          }}
        />
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-6">
          {PATH.map(([title, body], i) => (
            <motion.div
              key={title}
              {...rise(i, 5)}
              className="flex flex-col items-center text-center px-2"
            >
              <span
                className="flex items-center justify-center w-[68px] h-[68px] rounded-full font-mono font-bold text-[15px] text-signal-orange"
                style={{
                  background: "#0E0E0F",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 text-[19px] sm:text-[21px] font-bold text-white tracking-[-0.025em] leading-[1.2]">
                {title}
              </h3>
              <p className="mt-3 text-[13.5px] leading-[1.7] text-white/50 max-w-[220px]">
                {body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ── 13 Customer assurance pack ──────────────────────────────────── */

export function CertPack() {
  return (
    <Section surface="white" id="pack">
      <CertShine />
      <SectionHeader
        eyebrow="Customer assurance pack"
        top="A clear route"
        bottom="To diligence."
        size="compact"
        width="wide"
        body="Request the evidence relevant to your assessment. The exact materials available may depend on confidentiality, deployment scope and approval."
        className="!mb-12 sm:!mb-14"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {EVIDENCE.map((e, i) => (
          <motion.article
            key={e.id}
            {...rise(i, 3)}
            className={card + "flex flex-col h-full p-7 bg-white"}
            style={CERT_CARD}
          >
            <div className="flex items-start justify-between gap-4">
              <CertTile icon={FileCheck2} />
              <span className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-graphite/40 text-right leading-[1.5]">
                {e.gate}
              </span>
            </div>
            <h3 className="mt-6 text-[18px] sm:text-[19px] font-bold tracking-[-0.02em] text-carbon leading-[1.25]">
              {e.title}
            </h3>
            <p className="mt-3 text-[14px] leading-[1.65] text-graphite/65">
              {e.body}
            </p>
          </motion.article>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <a
          href={packHref(EVIDENCE.map((e) => e.title))}
          className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3 rounded-lg transition-colors duration-200 hover:bg-signal-orange-hover"
        >
          Request the trust pack
          <ArrowUpRight className="w-4 h-4" aria-hidden />
        </a>
      </div>
    </Section>
  );
}
