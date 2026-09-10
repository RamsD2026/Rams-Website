"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  CircleCheck,
  CircleDot,
  ClipboardList,
  FileSearch,
  FileText,
  FileX2,
  Footprints,
  Gauge,
  GraduationCap,
  Layers,
  LifeBuoy,
  MapPin,
  PackageSearch,
  PencilRuler,
  Radio,
  Route,
  Ruler,
  ScanLine,
  Scale,
  ShieldAlert,
  Stamp,
  Tags,
  Timer,
  TrendingUp,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import {
  Section,
  EASE,
  type SurfaceKey,
} from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import type { Item, Service, ServiceSection } from "./service-types";

/**
 * The one theme every /services page wears.
 *
 * It is built from the platform and solution pages' vocabulary rather than a
 * new one: the dark radial hero with the 72px grid and the orange glow from
 * `IrdsHero`, `SectionHeader` for every block, the numbered process band from
 * `IrdsWorkflow`, and the hairline accordion from `CaseFAQ`. A service page is
 * a sibling of a platform page, so it should read as one.
 *
 * What is new here is only what services need and products do not: the scope
 * caveat set in mono caps, the deliverables register, and the mode cards for
 * "on-site or remote".
 */

const HAIR = "#E0E0E6";
const HAIR_DARK = "rgba(255,255,255,0.10)";

/**
 * Name → glyph.
 *
 * The data files carry icon *names* because they are data files with no React
 * in them. Anything missing or misspelled resolves to `CircleDot`, so a bad
 * name costs a glyph rather than the page.
 */
const ICONS: Record<string, LucideIcon> = {
  BarChart3,
  Boxes,
  CircleCheck,
  ClipboardList,
  FileSearch,
  FileText,
  FileX2,
  Footprints,
  Gauge,
  GraduationCap,
  Layers,
  LifeBuoy,
  MapPin,
  PackageSearch,
  PencilRuler,
  Radio,
  Route,
  Ruler,
  ScanLine,
  Scale,
  ShieldAlert,
  Stamp,
  Tags,
  Timer,
  TrendingUp,
  Wrench,
};

const glyph = (name?: string): LucideIcon => (name && ICONS[name]) || CircleDot;

/**
 * The hover shine, and the one `<style>` that carries it.
 *
 * This is the card shine the solution pages already run — `irdscap-card`,
 * `irdswhy-card`, `invfeat-card`, `wexcap-card` and the rest — copied here
 * unchanged apart from its namespace. A conic gradient is rotated round the
 * card by a registered `@property` angle and masked to the 1px border, so a
 * bright arc travels the edge for as long as the pointer is on the card.
 *
 * A previous revision reimplemented this as a linear band that swept across
 * once. That was a second answer to a question the project had already
 * answered, and two card shines on one site is one too many.
 *
 * The angle property, the class and the keyframe are all namespaced `svc-`,
 * because `@property` and `@keyframes` are global however local the
 * `<style>` tag looks — which is why every page that carries this effect
 * gives it its own prefix rather than sharing one.
 */
function ShineStyle() {
  return (
    <style>{`
      @property --svc-shine-angle {
        syntax: '<angle>';
        initial-value: 0deg;
        inherits: false;
      }
      .svc-shine { position: relative; isolation: isolate; }
      .svc-shine::before {
        content: "";
        position: absolute;
        inset: -1px;
        border-radius: inherit;
        padding: 1px;
        background: conic-gradient(
          from var(--svc-shine-angle),
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
      .svc-shine.svc-on-dark::before {
        background: conic-gradient(
          from var(--svc-shine-angle),
          transparent 0deg,
          transparent 300deg,
          rgba(255,255,255,0.85) 340deg,
          transparent 360deg
        );
      }
      .svc-shine:hover::before {
        opacity: 1;
        animation: svc-shine 2.4s linear infinite;
      }
      @keyframes svc-shine {
        to { --svc-shine-angle: 360deg; }
      }
      @media (prefers-reduced-motion: reduce) {
        .svc-shine:hover::before { animation: none; }
      }
    `}</style>
  );
}

/* ── surfaces ─────────────────────────────────────────────────────── */

/**
 * Assign a background to each section.
 *
 * The rule the site follows is that no two adjacent sections share a surface.
 * With a section list that changes per service, that cannot be typed into the
 * data without getting it wrong the first time a block is added or dropped —
 * so it is computed: the process band is always ink, everything else
 * alternates, and the alternation restarts after a dark band so the section
 * following it is always white.
 *
 * The run is seeded so the first section — the one directly under the hero —
 * comes out white. It reads as the page proper beginning after the dark band,
 * where offWhite read as a continuation of the hero's furniture.
 */
function surfacesFor(sections: ServiceSection[]): SurfaceKey[] {
  let last: SurfaceKey = "offWhite";
  return sections.map((s) => {
    if (s.kind === "process") {
      last = "ink";
      return "ink";
    }
    last = last === "white" ? "offWhite" : "white";
    return last;
  });
}

const isDark = (s: SurfaceKey) => s === "ink";

/* ── shared card ──────────────────────────────────────────────────── */

function cardStyle(dark: boolean): React.CSSProperties {
  return {
    borderRadius: 16,
    background: dark ? "rgba(255,255,255,0.03)" : "#FFFFFF",
    boxShadow: `inset 0 0 0 1px ${dark ? HAIR_DARK : "#E8E8ED"}`,
  };
}

/** The mono caps caveat the sources set under a block. */
function Note({ text, dark }: { text: string; dark: boolean }) {
  return (
    <p
      className={
        "mt-10 mx-auto max-w-[820px] text-center text-[10.5px] font-mono font-semibold tracking-[0.16em] uppercase leading-[1.7] " +
        (dark ? "text-white/35" : "text-graphite/40")
      }
    >
      {text}
    </p>
  );
}

function Reveal({
  i = 0,
  className,
  children,
}: {
  i?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: (i % 4) * 0.06, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── 01 hero ──────────────────────────────────────────────────────── */

export function ServiceHero({ service }: { service: Service }) {
  return (
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
            "radial-gradient(60% 60% at 50% 20%, rgba(255,106,0,0.22), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
        }}
      />

      <div className="relative rams-container pt-40 sm:pt-48 lg:pt-56 pb-24 sm:pb-32 lg:pb-40">
        <div className="max-w-[1080px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
            <span className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-white/70">
              {service.eyebrow}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
            className="mt-8 text-[44px] sm:text-[68px] lg:text-[86px] font-bold leading-[1.06] tracking-[-0.045em]"
          >
            <span className="block text-white">{service.h1[0]}</span>
            <span
              className="block"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.35) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {service.h1[1]}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="mt-6 text-[14px] sm:text-[16px] text-white/60 leading-[1.6] max-w-[900px] mx-auto"
          >
            {service.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28, ease: EASE }}
            className="mt-8 flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap"
          >
            {service.chips.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur text-[10.5px] font-mono font-semibold tracking-[0.22em] uppercase text-white/70"
              >
                <span
                  className="w-1 h-1 rounded-full bg-signal-orange"
                  aria-hidden
                />
                {c}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease: EASE }}
            className="mt-10 flex items-center justify-center gap-3 flex-wrap"
          >
            <Link
              href="/company/contact"
              className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-px hover:bg-signal-orange-hover"
            >
              {service.action}
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="#process"
              className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.04] text-white text-[14px] font-semibold px-6 py-3.5 rounded-full transition-colors duration-200 hover:bg-white/[0.08]"
            >
              See how it works
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── 01b band ──────────────────────────────────────── */

/**
 * The four assurances, as the proof band the solution pages use.
 *
 * It was inside the hero for a revision, as a row of cells in the centred
 * 1080px column, and it read as a stray table: the rules stopped short of
 * the page edges, the last cell had no closing edge, and the whole thing
 * floated in the hero’s bottom padding.
 *
 * `IrdsStatsBand` is the shipped answer to the same problem and this is it:
 * its own section on the hero’s own ink, opened by a full-width hairline,
 * the cells laid across the container so the rules run edge to edge, and the
 * grid drawn by giving every cell a top and left border and pulling it a
 * pixel back over its neighbour — which is what makes the interior rules
 * single-width and the outer ones disappear.
 *
 * The cells carry the assurance and its line, and nothing else. The solution
 * bands lead with a large figure because they have one to lead with; a service
 * has four assurances and no measurement, and neither an invented statistic
 * nor a numeral counting to four earns that much of the cell.
 */
export function ServiceBand({ service }: { service: Service }) {
  return (
    <section
      className="border-t border-white/10"
      style={{ background: "#08080A" }}
      aria-label={`${service.name} — what the service assures`}
    >
      <div className="rams-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 overflow-hidden">
          {service.assurances.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, delay: i * 0.06, ease: EASE }}
              className="relative -mt-px -ml-px flex flex-col border-t border-l border-white/10 px-6 sm:px-8 py-8 lg:py-10"
            >
              <div className="text-[14px] sm:text-[15px] font-semibold text-white tracking-[-0.01em] leading-[1.35]">
                {a.title}
              </div>

              <p className="mt-1.5 text-[13px] sm:text-[13.5px] font-medium text-white/55 leading-[1.55] max-w-[240px]">
                {a.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 02 problem ───────────────────────────────────────────────────── */

function Problem({
  block,
  dark,
}: {
  block: Extract<ServiceSection, { kind: "problem" }>;
  dark: boolean;
}) {
  return (
    <>
      <SectionHeader
        eyebrow={block.eyebrow}
        top={block.top}
        bottom={block.bottom}
        body={block.body}
        tone={dark ? "dark" : "light"}
        size="compact"
        width="wide"
        className="!mb-10 sm:!mb-12"
      />

      {/* One row, one column per statement — and no card.

          These are five short statements of a single problem, not five
          separate objects, and a border round each one says the opposite:
          it makes them look like things you could pick up and reorder.
          Left the type on the ground and the row reads as one paragraph in
          five parts, which is what it is.

          The glyph takes over the work the border was doing. It sits on the
          left, flush with the text under it, so the column has a single
          left edge running icon → title → body, and the row aligns across
          on that edge rather than on a box.

          The hairline above each column is the only rule left. It separates
          without enclosing, which is the distinction that matters here.

          No card means no card hover: the shine belongs to the mode cards
          further down the page, which really are separate objects. */}
      <div
        className={
          "grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 " +
          (block.items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-5")
        }
      >
        {block.items.map((it, i) => {
          const Icon = glyph(it.icon);
          return (
            <Reveal key={it.title} i={i}>
              <div
                className="flex flex-col h-full pt-6"
                style={{
                  borderTop: `1px solid ${dark ? HAIR_DARK : HAIR}`,
                }}
              >
                <Icon
                  className="w-[22px] h-[22px] text-signal-orange shrink-0"
                  strokeWidth={1.75}
                  aria-hidden
                />

                <p
                  className={
                    "mt-5 text-[14.5px] font-semibold tracking-[-0.02em] leading-[1.4] " +
                    (dark ? "text-white" : "text-carbon")
                  }
                >
                  {it.title}
                </p>

                <p
                  className={
                    "mt-2.5 text-[13px] leading-[1.7] " +
                    (dark ? "text-white/55" : "text-graphite/60")
                  }
                >
                  {it.body}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>

      {block.note && <Note text={block.note} dark={dark} />}
    </>
  );
}

/* ── 03 grid ──────────────────────────────────────────────────────── */

function Grid({
  block,
  dark,
}: {
  block: Extract<ServiceSection, { kind: "grid" }>;
  dark: boolean;
}) {
  const cols =
    block.cols === 2
      ? "sm:grid-cols-2"
      : block.cols === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <SectionHeader
        eyebrow={block.eyebrow}
        top={block.top}
        bottom={block.bottom}
        body={block.body}
        tone={dark ? "dark" : "light"}
        size="compact"
        width="wide"
        className="!mb-10 sm:!mb-12"
      />

      <div className={"grid grid-cols-1 gap-4 " + cols}>
        {block.items.map((it, i) => (
          <Reveal key={it.title} i={i}>
            <div
              className="flex flex-col h-full p-6 transition-all duration-300 hover:-translate-y-0.5"
              style={cardStyle(dark)}
            >
              <p
                className={
                  "text-[15.5px] font-semibold tracking-[-0.02em] leading-[1.35] " +
                  (dark ? "text-white" : "text-carbon")
                }
              >
                {it.title}
              </p>
              <p
                className={
                  "mt-2.5 text-[13.5px] leading-[1.7] " +
                  (dark ? "text-white/55" : "text-graphite/60")
                }
              >
                {it.body}
              </p>

              {it.tags && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {it.tags.map((t) => (
                    <span
                      key={t}
                      className={
                        "text-[10px] font-mono font-semibold tracking-[0.14em] uppercase px-2 py-1 rounded-full " +
                        (dark
                          ? "text-white/50 bg-white/[0.06]"
                          : "text-graphite/50 bg-[rgba(14,14,15,0.05)]")
                      }
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>

      {block.note && <Note text={block.note} dark={dark} />}
    </>
  );
}

/* ── 04 modes ─────────────────────────────────────────────────────── */

function Modes({
  block,
  dark,
}: {
  block: Extract<ServiceSection, { kind: "modes" }>;
  dark: boolean;
}) {
  return (
    <>
      <SectionHeader
        eyebrow={block.eyebrow}
        top={block.top}
        bottom={block.bottom}
        body={block.body}
        tone={dark ? "dark" : "light"}
        size="long"
        width="wide"
        className="!mb-10 sm:!mb-12"
      />

      <ShineStyle />
      <div
        className={
          "grid grid-cols-1 gap-5 " +
          (block.items.length === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3")
        }
      >
        {block.items.map((it, i) => {
          const Icon = glyph(it.icon);
          return (
            <Reveal key={it.title} i={i}>
              <div
                className={
                  "svc-shine group flex flex-col h-full p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 " +
                  (dark ? "svc-on-dark" : "")
                }
                style={cardStyle(dark)}
              >
                <span
                  className="relative z-[2] flex items-center justify-center w-11 h-11 shrink-0"
                  style={{
                    borderRadius: 12,
                    background: "rgba(255,106,0,0.08)",
                  }}
                >
                  <Icon
                    className="w-[20px] h-[20px] text-signal-orange"
                    strokeWidth={1.9}
                    aria-hidden
                  />
                </span>

                <span className="relative z-[2] mt-6 text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <p
                  className={
                    "relative z-[2] mt-3 text-[21px] sm:text-[23px] font-bold tracking-[-0.03em] leading-[1.2] " +
                    (dark ? "text-white" : "text-carbon")
                  }
                >
                  {it.title}
                </p>

                <p
                  className={
                    "relative z-[2] mt-3.5 text-[14px] leading-[1.7] " +
                    (dark ? "text-white/55" : "text-graphite/60")
                  }
                >
                  {it.body}
                </p>

                {it.tags && (
                  <ul
                    className="relative z-[2] mt-6 pt-5 space-y-2.5"
                    style={{
                      borderTop: `1px solid ${dark ? HAIR_DARK : HAIR}`,
                    }}
                  >
                    {it.tags.map((t) => (
                      <li
                        key={t}
                        className={
                          "flex items-start gap-2.5 text-[13.5px] leading-[1.6] " +
                          (dark ? "text-white/65" : "text-graphite/65")
                        }
                      >
                        <span
                          className="mt-[7px] w-1 h-1 rounded-full bg-signal-orange shrink-0"
                          aria-hidden
                        />
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>

      {block.note && <Note text={block.note} dark={dark} />}
    </>
  );
}

/* ── 05 process ───────────────────────────────────────────────────── */

function Process({
  block,
}: {
  block: Extract<ServiceSection, { kind: "process" }>;
}) {
  const n = block.steps.length;
  const cols =
    n === 5 ? "lg:grid-cols-5" : n === 4 ? "lg:grid-cols-4" : "lg:grid-cols-6";

  return (
    <>
      <SectionHeader
        eyebrow={block.eyebrow}
        top={block.top}
        bottom={block.bottom}
        body={block.body}
        tone="dark"
        size="compact"
        width="wide"
        className="!mb-14 sm:!mb-16"
      />

      <div className="relative">
        {/* the rail the numbers sit on — it stops short of both ends so it
            reads as a run of steps, not a rule drawn across the section */}
        <div
          aria-hidden
          className="hidden lg:block absolute left-0 right-0 top-[34px] h-px"
          style={{
            background:
              "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.14) 12%, rgba(255,255,255,0.14) 88%, transparent 100%)",
          }}
        />

        <div
          className={
            "relative grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-6 " + cols
          }
        >
          {block.steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              className="flex flex-col items-center text-center px-2"
            >
              <span
                className="flex items-center justify-center w-[68px] h-[68px] rounded-full font-mono font-bold text-[15px] text-signal-orange"
                style={{
                  background: "#0E0E0F",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)",
                }}
              >
                {s.n}
              </span>

              <h3 className="mt-6 text-[19px] sm:text-[21px] font-bold text-white tracking-[-0.025em] leading-[1.2]">
                {s.title}
              </h3>

              <p className="mt-3 text-[13.5px] leading-[1.7] text-white/50 max-w-[220px]">
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {block.note && <Note text={block.note} dark />}
    </>
  );
}

/* ── 06 lens ──────────────────────────────────────────────────────── */

const TONE: Record<
  NonNullable<Item["tone"]>,
  { ink: string; wash: string; label: string }
> = {
  red: { ink: "#D93025", wash: "rgba(217,48,37,0.10)", label: "Red" },
  amber: { ink: "#C77700", wash: "rgba(199,119,0,0.10)", label: "Amber" },
  green: { ink: "#137333", wash: "rgba(19,115,51,0.10)", label: "Green" },
  neutral: { ink: "#FF6A00", wash: "rgba(255,106,0,0.10)", label: "" },
};

function Lens({
  block,
  dark,
}: {
  block: Extract<ServiceSection, { kind: "lens" }>;
  dark: boolean;
}) {
  return (
    <>
      <SectionHeader
        eyebrow={block.eyebrow}
        top={block.top}
        bottom={block.bottom}
        body={block.body}
        tone={dark ? "dark" : "light"}
        size="compact"
        width="wide"
        className="!mb-10 sm:!mb-12"
      />

      <div
        className={
          "grid grid-cols-1 gap-4 sm:grid-cols-2 " +
          (block.items.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4")
        }
      >
        {block.items.map((it, i) => {
          const t = TONE[it.tone ?? "neutral"];
          return (
            <Reveal key={it.title} i={i}>
              <div
                className="flex flex-col h-full p-6 transition-all duration-300 hover:-translate-y-0.5"
                style={cardStyle(dark)}
              >
                {/* the tone bar carries the classification; the words carry
                    the instruction. Colour on its own is never the message */}
                <span
                  aria-hidden
                  className="block w-9 h-1.5 rounded-full"
                  style={{ background: t.ink }}
                />

                <p
                  className={
                    "mt-5 text-[15.5px] font-semibold tracking-[-0.02em] leading-[1.35] " +
                    (dark ? "text-white" : "text-carbon")
                  }
                >
                  {it.title}
                </p>

                <p
                  className={
                    "mt-2.5 text-[13.5px] leading-[1.7] " +
                    (dark ? "text-white/55" : "text-graphite/60")
                  }
                >
                  {it.body}
                </p>

                {it.tags && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {it.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono font-semibold tracking-[0.14em] uppercase px-2 py-1 rounded-full"
                        style={{ background: t.wash, color: t.ink }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>

      {block.note && <Note text={block.note} dark={dark} />}
    </>
  );
}

/* ── 07 deliverables ──────────────────────────────────────────────── */

function Deliverables({
  block,
  dark,
}: {
  block: Extract<ServiceSection, { kind: "deliverables" }>;
  dark: boolean;
}) {
  return (
    <>
      <SectionHeader
        eyebrow={block.eyebrow}
        top={block.top}
        bottom={block.bottom}
        body={block.body}
        tone={dark ? "dark" : "light"}
        size="compact"
        width="wide"
        className="!mb-10 sm:!mb-12"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.42fr)] gap-5 items-start">
        {/* the register — one issued document per row, numbered, so it reads
            as a contents page for the pack rather than eight loose cards */}
        <Reveal>
          <div className="p-6 sm:p-8" style={cardStyle(dark)}>
            <div
              className="flex items-center justify-between gap-4 pb-5"
              style={{ borderBottom: `1px solid ${dark ? HAIR_DARK : HAIR}` }}
            >
              <span
                className={
                  "text-[10px] font-mono font-bold tracking-[0.2em] uppercase " +
                  (dark ? "text-white/40" : "text-graphite/40")
                }
              >
                RAMS / Issued pack
              </span>
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange">
                {block.items.length} documents
              </span>
            </div>

            <ul>
              {block.items.map((it, i) => (
                <li
                  key={it.title}
                  className="flex items-start gap-5 py-4"
                  style={
                    i === 0
                      ? undefined
                      : { borderTop: `1px solid ${dark ? HAIR_DARK : HAIR}` }
                  }
                >
                  <span
                    className={
                      "shrink-0 mt-0.5 text-[11px] font-mono font-bold tabular-nums " +
                      (dark ? "text-white/30" : "text-graphite/35")
                    }
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0">
                    <p
                      className={
                        "text-[14.5px] font-semibold tracking-[-0.015em] leading-[1.35] " +
                        (dark ? "text-white" : "text-carbon")
                      }
                    >
                      {it.title}
                    </p>
                    <p
                      className={
                        "mt-1 text-[13px] leading-[1.65] " +
                        (dark ? "text-white/50" : "text-graphite/60")
                      }
                    >
                      {it.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal i={1}>
          <div
            className="p-7 sm:p-8"
            style={{
              borderRadius: 16,
              background: dark
                ? "rgba(255,106,0,0.08)"
                : "linear-gradient(180deg, #FFF6EF 0%, #FFFFFF 100%)",
              boxShadow: `inset 0 0 0 1px ${dark ? "rgba(255,106,0,0.25)" : "#FFD9BC"}`,
            }}
          >
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange">
              What it means
            </span>

            <p
              className={
                "mt-5 text-[19px] sm:text-[20px] font-bold tracking-[-0.03em] leading-[1.25] " +
                (dark ? "text-white" : "text-carbon")
              }
            >
              {block.callout.title}
            </p>

            <p
              className={
                "mt-3.5 text-[13.5px] leading-[1.7] " +
                (dark ? "text-white/60" : "text-graphite/65")
              }
            >
              {block.callout.body}
            </p>
          </div>
        </Reveal>
      </div>

      {block.note && <Note text={block.note} dark={dark} />}
    </>
  );
}

/* ── 08 faq ───────────────────────────────────────────────────────── */

function Toggle({ open }: { open: boolean }) {
  return (
    <span aria-hidden className="relative w-3.5 h-3.5 shrink-0 mt-1.5">
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

function Faq({
  block,
  dark,
}: {
  block: Extract<ServiceSection, { kind: "faq" }>;
  dark: boolean;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const hair = dark ? HAIR_DARK : HAIR;

  return (
    <>
      <SectionHeader
        eyebrow={block.eyebrow}
        top={block.top}
        bottom={block.bottom}
        body={block.body}
        tone={dark ? "dark" : "light"}
        size="compact"
        width="wide"
        className="!mb-10 sm:!mb-12"
      />

      <div
        className="max-w-[900px] mx-auto"
        style={{ borderTop: `1px solid ${hair}` }}
      >
        {block.items.map((it, i) => {
          const on = open === i;
          return (
            <div key={it.title} style={{ borderBottom: `1px solid ${hair}` }}>
              <button
                type="button"
                onClick={() => setOpen(on ? null : i)}
                aria-expanded={on}
                className="w-full flex items-start justify-between gap-6 text-left py-6 group"
              >
                <span
                  className={
                    "text-[16px] sm:text-[17px] font-bold tracking-[-0.015em] leading-[1.4] transition-colors duration-300 " +
                    (dark
                      ? on
                        ? "text-white"
                        : "text-white/80 group-hover:text-white"
                      : on
                        ? "text-carbon"
                        : "text-carbon/85 group-hover:text-carbon")
                  }
                >
                  {it.title}
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
                    <p
                      className={
                        "pb-7 pr-10 text-[14.5px] leading-[1.7] " +
                        (dark ? "text-white/55" : "text-graphite/65")
                      }
                    >
                      {it.body}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {block.note && <Note text={block.note} dark={dark} />}
    </>
  );
}

/* ── the sections, in order ───────────────────────────────────────── */

export function ServiceSections({ service }: { service: Service }) {
  const surfaces = surfacesFor(service.sections);

  return (
    <>
      {service.sections.map((block, i) => {
        const surface = surfaces[i];
        const dark = isDark(surface);
        const id =
          block.kind === "process"
            ? "process"
            : block.kind === "faq"
              ? "faq"
              : undefined;

        return (
          <Section key={block.kind + i} surface={surface} id={id}>
            {block.kind === "problem" && <Problem block={block} dark={dark} />}
            {block.kind === "grid" && <Grid block={block} dark={dark} />}
            {block.kind === "modes" && <Modes block={block} dark={dark} />}
            {block.kind === "process" && <Process block={block} />}
            {block.kind === "lens" && <Lens block={block} dark={dark} />}
            {block.kind === "deliverables" && (
              <Deliverables block={block} dark={dark} />
            )}
            {block.kind === "faq" && <Faq block={block} dark={dark} />}
          </Section>
        );
      })}
    </>
  );
}

/* ── the close ────────────────────────────────────────────────────── */

export function ServiceCTA({ service }: { service: Service }) {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(80% 100% at 50% 100%, #1D1D1F 0%, #0E0E0F 55%, #08080A 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[560px]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 90%, rgba(255,106,0,0.18), transparent 70%)",
        }}
      />

      <div className="relative rams-container py-24 sm:py-32 lg:py-36 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="max-w-[1000px] mx-auto text-[34px] sm:text-[52px] lg:text-[64px] font-bold leading-[1.06] tracking-[-0.04em]"
        >
          <span className="block text-white">{service.cta.top}</span>
          <span
            className="block"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.35) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {service.cta.bottom}
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="mt-6 text-[14px] sm:text-[16px] text-white/60 leading-[1.6] max-w-[760px] mx-auto"
        >
          {service.cta.body}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
          className="mt-10 flex items-center justify-center gap-3 flex-wrap"
        >
          <Link
            href="/company/contact"
            className="inline-flex items-center gap-2 bg-signal-orange text-white text-[15px] font-semibold px-7 py-4 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:bg-signal-orange-hover"
          >
            {service.action}
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
          <Link
            href={service.cta.secondary?.href ?? "/services"}
            className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.04] text-white text-[15px] font-semibold px-7 py-4 rounded-full transition-colors duration-200 hover:bg-white/[0.08]"
          >
            {service.cta.secondary?.label ?? "All services"}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ── the page ─────────────────────────────────────────────────────── */

export function ServicePage({ service }: { service: Service }) {
  return (
    <>
      <ServiceHero service={service} />
      <ServiceBand service={service} />
      <ServiceSections service={service} />
      <ServiceCTA service={service} />
    </>
  );
}
