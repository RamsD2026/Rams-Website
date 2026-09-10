"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Boxes,
  MapPin,
  PackageSearch,
  Route,
  Timer,
} from "lucide-react";
import {
  ArrowPathIcon,
  ArrowsRightLeftIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  QueueListIcon,
  ScaleIcon,
  Squares2X2Icon,
  TagIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";

import {
  EASE,
  ProductVideo,
  Section,
  SURFACE,
  frameStyle,
} from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { TwinFacility } from "@/components/sections/twin/TwinFacility";
import { RiqClients } from "@/components/sections/rackiq/RiqClients";
import { BackgroundBeams } from "@/components/ui/background-beams";
import {
  PaneAgeing,
  PaneCapacity,
  PaneCapture,
  PaneExceptions,
  PaneLocations,
  PaneMovement,
  PaneReconcile,
  PaneRecord,
} from "./IrosPanes";
import {
  WCapture,
  WModules,
  WSystems,
  useTick,
} from "./IrosWidgets";
import { CLOSE, FAQS, HERO, NOTES, OUTCOMES, PROBLEM } from "./iros-data";

/**
 * IROS — the platform page, composed the way the platform pages are composed.
 *
 * ── The spine ───────────────────────────────────────────────────────
 * `/platform/irds` runs Hero → Problem → Overview → How → Capabilities →
 * Experience → Outcomes → Integrations → FAQ → CTA, and `/platform/meps` runs
 * the same shape with Capture for Overview and Proof for Outcomes. This page
 * is that spine, with the source's content mapped into each of those sections
 * rather than a new section invented per source heading.
 *
 * Two earlier revisions got this wrong in two different ways: the first
 * rendered the content through the /services shell, and the second copied
 * `sections/irds`, which despite its name is the *solution* page
 * (/solutions/rack-safety-intelligence). The platform families are `rds`,
 * `meps`, `twin`, `rts` and `imd`.
 *
 * ── What is held back, and why ─────────────────────────────────────
 * The source also carries ABC classification, security and governance, a
 * five-stage rollout, and a who-uses-it grid. `/platform/irds` states the rule
 * for exactly this case: "Held back, because neither of the first two pages
 * established a pattern for them: Security & Compliance, Deployment /
 * Implementation, and Scalability." The same applies here, so those four are
 * not on the page. ABC survives as one of the eight capabilities, which is
 * what it is; its caveat travels with it.
 *
 * The Experience section is held back too, for a different reason — there is
 * no IROS capture and that section is a product tour. What it would have shown
 * is in the capability panes instead.
 */

const HAIR = "#E8E8ED";

const CARD: React.CSSProperties = {
  borderRadius: 12,
  border: `1px solid ${HAIR}`,
  boxShadow: "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
};

const TILE: React.CSSProperties = {
  borderRadius: 8,
  background: "rgba(255,106,0,0.08)",
  border: "1px solid rgba(255,106,0,0.18)",
};

function Shine({ ns }: { ns: string }) {
  return (
    <style>{`
      @property --${ns}-shine-angle {
        syntax: '<angle>';
        initial-value: 0deg;
        inherits: false;
      }
      .${ns}-card { position: relative; isolation: isolate; }
      .${ns}-card::before {
        content: "";
        position: absolute;
        inset: -1px;
        border-radius: inherit;
        padding: 1px;
        background: conic-gradient(
          from var(--${ns}-shine-angle),
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
      .${ns}-card:hover::before {
        opacity: 1;
        animation: ${ns}-shine 2.4s linear infinite;
      }
      @keyframes ${ns}-shine {
        to { --${ns}-shine-angle: 360deg; }
      }
      @media (prefers-reduced-motion: reduce) {
        .${ns}-card:hover::before { animation: none; }
      }
    `}</style>
  );
}

/* ── 01 hero ──────────────────────────────────────────────────────── */

export function IrosHero() {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{ background: SURFACE.darkTop }}
      id="top"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[720px]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 20%, rgba(255,106,0,0.22), transparent 70%)",
        }}
      />
      <BackgroundBeams className="opacity-[0.5]" />

      <div className="relative rams-container pt-36 sm:pt-44 lg:pt-48 pb-20 sm:pb-24 lg:pb-28">
        <div className="max-w-[1180px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
            <span className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-white/70">
              RAMS IROS Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
            className="mt-8 sm:mt-10 text-[56px] sm:text-[84px] lg:text-[112px] font-bold leading-[1.06] tracking-[-0.045em]"
          >
            <span className="block text-white">Know what you have.</span>
            <span className="block text-white">
              Know <span className="text-signal-orange">where.</span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="mt-6 text-[15px] sm:text-[16px] text-white/60 leading-[1.6] max-w-[880px] mx-auto"
          >
            {HERO.body}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.29, ease: EASE }}
            className="mt-6 text-[15px] sm:text-[16px] font-bold tracking-[-0.01em] text-white"
          >
            Locate Precisely. Compare Honestly. Act Before It Costs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.36, ease: EASE }}
            className="mt-9 flex items-center justify-center gap-3 flex-wrap"
          >
            <Link
              href="#problem"
              className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3 rounded-lg transition-colors duration-200 hover:bg-signal-orange-hover"
            >
              Explore IROS
              <ArrowDown className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="/book-a-demo"
              className="inline-flex items-center gap-2 text-white text-[14px] font-semibold px-6 py-3 rounded-lg border border-white/15 transition-colors duration-200 hover:bg-white/[0.06]"
            >
              Request a Demo
            </Link>
          </motion.div>
        </div>

        {/* ── the product ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: EASE }}
          className="mt-16 sm:mt-20 max-w-[1180px] mx-auto"
        >
          {/* The shared hero capture, in the chrome, the way `RiqHero` and
              the MEPS hero mount theirs.

              It is not an IROS capture. There is no IROS footage in
              /public/Product, and this is the same `/Product/irds/hero.mp4`
              those two heroes already play — the MEPS hero's own comment
              says as much about borrowing it. Drop a real inventory capture
              in and only the `src` changes; the path in the chrome above it
              already reads as the inventory application, not the rack one. */}
          <ProductVideo
            src="/Product/irds/hero.mp4"
            path="app.rams.digital/inventory/iros"
            tone="dark"
          />

          <RiqClients />
        </motion.div>
      </div>
    </section>
  );
}

/* ── 02 problem ───────────────────────────────────────────────────── */

/**
 * The site's four-up card, to `RdsProblem`'s values.
 *
 * The source lists five failures. This section is four across on every
 * platform page, and five in a four-column grid leaves one card alone on a
 * second row — so the fifth, "differences are adjusted without fixing the
 * cause", is carried in the subline. It is the one that summarises the other
 * four rather than standing beside them, which is where a subline belongs.
 */
const PROBLEM_ICONS = [MapPin, Route, Timer, Boxes, PackageSearch];

export function IrosProblem() {
  return (
    <Section surface="white" id="problem">
      <Shine ns="irosprob" />

      <SectionHeader
        eyebrow="Problem / Current state"
        top="The system records stock."
        bottom="The floor keeps changing."
        size="compact"
        width="wide"
        body="Receipts, putaway, transfers, picking and staging change the physical state every hour — and when a difference is adjusted without finding its cause, the same location, process or master-data problem returns after reconciliation."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {PROBLEM.slice(0, 4).map((c, i) => {
          const Icon = PROBLEM_ICONS[i];
          return (
            <motion.article
              key={c.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
              className="irosprob-card group relative flex flex-col p-7 sm:p-8 bg-white transition-all duration-300 hover:-translate-y-1"
              style={CARD}
            >
              <div
                className="w-12 h-12 flex items-center justify-center mb-6"
                style={TILE}
              >
                <Icon
                  className="w-[22px] h-[22px] text-signal-orange"
                  strokeWidth={2}
                  aria-hidden
                />
              </div>

              <h3 className="min-h-[2.4em] text-[20px] sm:text-[21px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
                {c.title}
              </h3>

              <p className="mt-4 text-[14px] text-graphite/65 leading-[1.65]">
                {c.body}
              </p>
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
}

/* ── 03 product overview ──────────────────────────────────────────── */

/**
 * The twelve things the inventory record holds, in the coloured-tile treatment
 * `TwinOverview` established and `RdsOverview` follows: `gap-3`,
 * `max-w-[1120px]`, an 11px tile at 10px radius with a 21px solid icon, a 15px
 * bold title and a 13px body, and a hover that is the white rectangle and
 * nothing else.
 *
 * Icons are `@heroicons/react/24/solid`, as they are there and nowhere else on
 * the site: lucide is a stroke set, and at 21px on a saturated tile its
 * hairlines disappear.
 *
 * Every body is under about 25 characters, because the text column is roughly
 * 190px at `lg` — one line of 13px and no more. Each is a compression of the
 * source's own words for that field; nothing here names something the document
 * does not.
 *
 * The tints are `TwinOverview`'s palette in the same row-major order, so the
 * grids read as one object. They carry no meaning, which matters on this page
 * because the exception classes a few sections down are a real status scale.
 */
const TILES = [
  { icon: CubeIcon, title: "SKU identity", body: "One record, one item", tint: "#299764" },
  { icon: QueueListIcon, title: "Pallet & batch", body: "Unit, lot and expiry", tint: "#3E63DD" },
  { icon: ScaleIcon, title: "Quantity", body: "Counted, not assumed", tint: "#E5484D" },
  { icon: MapPinIcon, title: "Rack location", body: "Bay and level", tint: "#6647F0" },
  { icon: Squares2X2Icon, title: "Floor position", body: "Blocks and lanes", tint: "#12A594" },
  { icon: TagIcon, title: "Stock status", body: "Held, blocked, free", tint: "#F76808" },
  { icon: UserGroupIcon, title: "Ownership", body: "Whose stock it is", tint: "#E5484D" },
  { icon: ArrowsRightLeftIcon, title: "Movement history", body: "From, to and when", tint: "#0091FF" },
  { icon: ClockIcon, title: "Dwell & ageing", body: "How long in place", tint: "#FFC53D" },
  { icon: ArrowPathIcon, title: "ABC class", body: "Configured thresholds", tint: "#AB4ABA" },
  { icon: ExclamationTriangleIcon, title: "Exception state", body: "What does not agree", tint: "#5A3CD7" },
  { icon: ClipboardDocumentCheckIcon, title: "Capture evidence", body: "Source and timestamp", tint: "#E93D82" },
];

export function IrosOverview() {
  return (
    <Section surface="offWhite" id="overview">
      <SectionHeader
        eyebrow="Product overview"
        top="The operating record"
        bottom="For physical inventory."
        size="compact"
        width="wide"
        body="IROS creates a persistent inventory layer on the Digital Twin — connecting stock records, physical place, movement, ageing, exceptions and the action that closes them."
      />

      <style>{`
        .irosov-card {
          border-radius: 12px;
          background: transparent;
          transition: background .25s ease;
        }
        .irosov-card:hover {
          background: #FFFFFF;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06);
        }
      `}</style>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-[1120px] mx-auto">
        {TILES.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: (i % 4) * 0.07, ease: EASE }}
            className="irosov-card flex items-start gap-3.5 p-4"
          >
            <span
              className="w-11 h-11 shrink-0 flex items-center justify-center"
              style={{ borderRadius: 10, background: t.tint }}
            >
              <t.icon className="w-[21px] h-[21px] text-white" aria-hidden />
            </span>

            <span className="min-w-0">
              <span className="block text-[15px] font-bold tracking-[-0.01em] text-carbon leading-[1.2]">
                {t.title}
              </span>
              <span className="mt-1.5 block text-[13px] leading-[1.5] text-graphite/60">
                {t.body}
              </span>
            </span>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ── 04 how it works ──────────────────────────────────────────────── */

const TICK_MS = 90;
const STEP_TICKS = 78;
const SOFT = "#FAFAFB";

/**
 * The canvas the platform pages put under "How it works".
 *
 * `RdsHow` and `MepsHow` are both this: a clickable rail that advances on its
 * own, and beneath it one bordered card split into a 300px copy column and a
 * pane. The pane has its own header strip — the view's name, a three-dot
 * legend and a live status chip — then the facility drawing beside a live
 * panel. An earlier revision of this page had the rail and stopped there,
 * which left the section as a row of labels rather than a working canvas.
 *
 * The facility is the shared `TwinFacility`, the same drawing those two pages
 * use, stepped through its layers as the sequence advances. The panel beside
 * it is one of the light panes from `IrosPanes`.
 */
const STEPS: {
  n: string;
  title: string;
  body: string;
  detail: [string, string];
  layer: number;
  pane: { title: string; chip: string; chipTint: string };
  node: () => React.JSX.Element;
}[] = [
  {
    n: "01",
    title: "Connect",
    body: "Import approved product, batch, stock and location data from the system of record.",
    detail: ["The customer's authoritative extract", "Field ownership agreed first"],
    layer: 1,
    pane: { title: "Stock record", chip: "Imported", chipTint: "#3E63DD" },
    node: () => <PaneRecord />,
  },
  {
    n: "02",
    title: "Map",
    body: "Link each record to the Digital Twin location structure — rack, bay, level or floor position.",
    detail: ["Every record gets a place", "Racked and floor stock in one model"],
    layer: 2,
    pane: { title: "Location model", chip: "Mapped", chipTint: "#12A594" },
    node: () => <PaneLocations />,
  },
  {
    n: "03",
    title: "Capture",
    body: "Record supported movement, count and status events through the approved capture methods.",
    detail: ["Source, destination and time", "Only validated methods enabled"],
    layer: 3,
    pane: { title: "Movement history", chip: "Capturing", chipTint: "#16A34A" },
    node: () => <PaneMovement />,
  },
  {
    n: "04",
    title: "Compare",
    body: "Detect identity, quantity, location and ageing exceptions against the locked baseline.",
    detail: ["The difference, classified", "Neither source overwritten"],
    layer: 4,
    pane: { title: "Reconciliation", chip: "Exception", chipTint: "#D95A00" },
    node: () => <PaneReconcile />,
  },
  {
    n: "05",
    title: "Act",
    body: "Assign investigation, count, move or data-correction tasks with ownership and closure evidence.",
    detail: ["An owner and a due date", "Adjustment stays with the customer"],
    layer: 4,
    pane: { title: "Open exceptions", chip: "Assigned", chipTint: "#D95A00" },
    node: () => <PaneExceptions />,
  },
  {
    n: "06",
    title: "Learn",
    body: "Use retained history to improve storage, flow and control instead of re-adjusting the same balance.",
    detail: ["Ageing and dwell by location", "Recurring causes, not repeat fixes"],
    layer: 5,
    pane: { title: "Ageing and dwell", chip: "Trending", chipTint: "#16A34A" },
    node: () => <PaneAgeing />,
  },
];

export function IrosHow() {
  const [clock, setClock] = useState({ t: 0, i: 0, anchor: 0 });

  useEffect(() => {
    const id = setInterval(() => {
      setClock((prev) => {
        const t = prev.t + 1;
        return t - prev.anchor >= STEP_TICKS
          ? { t, i: (prev.i + 1) % STEPS.length, anchor: t }
          : { ...prev, t };
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  const { i } = clock;
  const p = Math.min(1, (clock.t - clock.anchor) / STEP_TICKS);
  const step = STEPS[i];

  const goTo = (n: number) =>
    setClock((prev) => ({ ...prev, i: n, anchor: prev.t }));

  return (
    <Section surface="white" id="how">
      <SectionHeader
        eyebrow="How it works"
        top="From stock record"
        bottom="To operational intelligence."
        size="compact"
        width="wide"
        body="A closed loop that keeps the record connected to its physical place, the evidence behind it and the action that resolves it."
      />

      {/* The track runs between the first and last dot centres, not edge to
          edge: with six equal columns those sit at 1/12 and 11/12, so the line
          is inset by 8.33% each side. Only the current step is filled;
          completed steps keep an orange outline. */}
      <div className="relative mb-10 sm:mb-12 overflow-x-auto">
        <div className="relative min-w-[560px] lg:min-w-0 pt-1">
          <span
            aria-hidden
            className="absolute top-[13px] h-px"
            style={{ left: "8.33%", right: "8.33%", background: "#E4E4E9" }}
          />
          <motion.span
            aria-hidden
            className="absolute top-[13px] h-px origin-left"
            style={{ left: "8.33%", right: "8.33%", background: "#FF6A00" }}
            animate={{ scaleX: (i + p) / (STEPS.length - 1) }}
            transition={{ duration: 0.25, ease: "linear" }}
          />

          <div className="relative grid grid-cols-6">
            {STEPS.map((x, n) => {
              const done = n < i;
              const now = n === i;
              return (
                <button
                  key={x.n}
                  type="button"
                  onClick={() => goTo(n)}
                  className="group flex flex-col items-center text-center px-2"
                >
                  <span
                    className="flex items-center justify-center w-[26px] h-[26px] rounded-full transition-all duration-300"
                    style={{
                      background: now ? "#FF6A00" : "#FFFFFF",
                      border: `1.5px solid ${
                        now ? "#FF6A00" : done ? "#FFC59E" : "#E0E0E6"
                      }`,
                    }}
                  >
                    <span
                      className="text-[9.5px] font-mono font-bold tabular-nums transition-colors duration-300"
                      style={{
                        color: now ? "#FFFFFF" : done ? "#D95A00" : "#B0B0B8",
                      }}
                    >
                      {x.n}
                    </span>
                  </span>

                  <span
                    className={
                      "mt-3.5 text-[12px] tracking-[-0.01em] transition-colors duration-300 " +
                      (now
                        ? "font-semibold text-carbon"
                        : "font-medium text-graphite/45 group-hover:text-graphite/75")
                    }
                  >
                    {x.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── the canvas ──────────────────────────────── */}
      <div
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] overflow-hidden"
        style={{
          borderRadius: 20,
          background: "#FFFFFF",
          border: `1px solid ${HAIR}`,
          boxShadow:
            "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
        }}
      >
        <div
          className="px-8 py-9 lg:py-10 flex flex-col justify-center lg:border-r"
          style={{ borderColor: HAIR }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange tabular-nums">
                Step {step.n}
              </span>
              <h3 className="mt-4 text-[24px] sm:text-[27px] font-bold tracking-[-0.03em] leading-[1.2] text-carbon">
                {step.title}
              </h3>
              <p className="mt-4 text-[13.5px] leading-[1.7] text-graphite/60">
                {step.body}
              </p>
              <div className="mt-8 flex flex-col gap-3.5">
                {step.detail.map((d) => (
                  <span
                    key={d}
                    className="flex items-start gap-3 text-[12px] leading-[1.55] text-graphite/70"
                  >
                    <span
                      aria-hidden
                      className="mt-[1px] flex items-center justify-center w-[15px] h-[15px] rounded-full text-[9px] font-bold shrink-0"
                      style={{
                        background: "rgba(255,106,0,0.10)",
                        color: "#D95A00",
                      }}
                    >
                      ✓
                    </span>
                    {d}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col min-w-0">
          <div
            className="flex shrink-0 items-center gap-3 px-4 py-3"
            style={{ borderBottom: `1px solid ${HAIR}`, background: SOFT }}
          >
            <span className="text-[9px] font-mono font-bold tracking-[0.2em] uppercase text-graphite/45 truncate">
              {step.pane.title}
            </span>
            <span className="hidden sm:flex items-center gap-2.5 ml-3">
              {[
                ["Stock", "#3E63DD"],
                ["Exceptions", "#E5484D"],
                ["Verified", "#16A34A"],
              ].map(([k, tint]) => (
                <span key={k} className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: tint }}
                  />
                  <span className="text-[8px] font-mono font-bold tracking-[0.12em] uppercase text-graphite/40">
                    {k}
                  </span>
                </span>
              ))}
            </span>
            <span
              className="ml-auto shrink-0 inline-flex items-center gap-1.5 px-2 py-[3px] rounded-full text-[8.5px] font-mono font-bold tracking-[0.12em] uppercase"
              style={{
                background: `${step.pane.chipTint}1F`,
                color: step.pane.chipTint,
              }}
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: step.pane.chipTint }}
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {step.pane.chip}
            </span>
          </div>

          <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-[minmax(0,1.48fr)_minmax(0,1fr)]">
            {/* Aspect-locked to the drawing plus the pane's own padding, so
                the facility fills its half exactly. */}
            <div className="p-3 sm:p-4 aspect-[884/504]">
              <TwinFacility step={step.layer} />
            </div>
            {/* Out of flow at xl: in flow a pane is hundreds of pixels of
                rows, and a grid row is as tall as its tallest column. */}
            <div
              className="relative min-h-[300px] xl:min-h-0 border-t xl:border-t-0 xl:border-l"
              style={{ borderColor: HAIR }}
            >
              <div className="absolute inset-0 overflow-hidden">
                <div key={step.n} className="h-full">
                  {step.node()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ── 05 core capabilities ─────────────────────────────────────────── */

const STAGE_RATIO = "5 / 4";

/**
 * The pinned stage, to `RdsCapabilities`' values: a device edge with a
 * hairline and no drop shadow, on a gradient stage, inset from the top left
 * and running off the bottom right. What sits in it is a live pane rather than
 * a screenshot — see `IrosPanes` for why.
 */
function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: STAGE_RATIO,
        borderRadius: 24,
        background:
          "radial-gradient(95% 85% at 18% 12%, rgba(255,106,0,0.34) 0%, transparent 58%)," +
          "linear-gradient(148deg, #26262E 0%, #15151A 58%, #0C0C0F 100%)",
      }}
    >
      <div className="absolute left-[9%] top-[11%] right-[-16%] bottom-[-18%]">
        {/* the device screen: white, because the panes are the site's light
            panels — the same ones the How canvas puts in its right half */}
        <div
          className="w-full h-full overflow-hidden"
          style={{
            borderRadius: 16,
            background: "#FFFFFF",
            border: "1px solid rgba(255,255,255,0.14)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

const GROUPS: {
  n: string;
  group: string;
  title: string;
  line: string;
  body: string;
  Pane: () => React.JSX.Element;
}[] = [
  {
    n: "01",
    group: "Location model",
    title: "Location visibility",
    line: "Open the place, not the report",
    body: "View stock by site, zone, rack, bay, level, floor position, staging area or controlled location.",
    Pane: PaneLocations,
  },
  {
    n: "02",
    group: "Stock identity",
    title: "Pallet & stock mapping",
    line: "Every record has a place",
    body: "Connect supported pallet, SKU, batch, quantity, status and owner records to physical place.",
    Pane: PaneRecord,
  },
  {
    n: "03",
    group: "Event history",
    title: "Movement history",
    line: "Where it went, and when",
    body: "Record source, destination, time, quantity and available MHE or operator context for supported moves.",
    Pane: PaneMovement,
  },
  {
    n: "04",
    group: "Reconciliation",
    title: "Record against reality",
    line: "Classify the difference",
    body: "Compare approved system records with captured physical evidence and classify the difference.",
    Pane: PaneReconcile,
  },
  {
    n: "05",
    group: "Ageing",
    title: "Dwell & ABC class",
    line: "See what is standing still",
    body: "Group stock by configurable ageing thresholds and by an approved ABC basis, so review frequency and count priority follow value and risk rather than habit.",
    Pane: PaneAgeing,
  },
  {
    n: "06",
    group: "Exceptions",
    title: "Exception detection",
    line: "Surface it before the pick",
    body: "Surface wrong location, quantity variance, unidentified stock, duplicate identity and status conflicts.",
    Pane: PaneExceptions,
  },
  {
    n: "07",
    group: "Capacity",
    title: "Space & capacity",
    line: "Know what the space is doing",
    body: "Compare occupied, available, blocked and unsuitable positions across rack and floor-storage zones.",
    Pane: PaneCapacity,
  },
  {
    n: "08",
    group: "Capture",
    title: "Flexible capture",
    line: "Only what is validated",
    body: "Use approved manual, barcode, QR, RFID, vision, drone, AGV or system-event methods where validated.",
    Pane: PaneCapture,
  },
];

export function IrosCapabilities() {
  const track = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);

  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start 30%", "end 70%"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setAt(Math.max(0, Math.min(GROUPS.length - 1, Math.floor(v * GROUPS.length))));
  });

  const g = GROUPS[at];

  return (
    /* `clip={false}`: an ancestor with `overflow: hidden` disables
       `position: sticky` inside it, so the pinned column would scroll away. */
    <Section surface="offWhite" id="capabilities" clip={false}>
      <SectionHeader
        eyebrow="Core capabilities"
        top="Inventory that occupies,"
        bottom="Moves and changes."
        size="compact"
        width="wide"
        body="Eight connected capabilities, each staying attached to the same location model, asset identity and event history."
      />

      <div
        ref={track}
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-10 lg:gap-16"
      >
        <div className="flex flex-col">
          {GROUPS.map((x, n) => {
            const now = n === at;
            return (
              <div
                key={x.n}
                className="py-8 lg:min-h-[44vh] flex flex-col justify-center"
              >
                <motion.div
                  initial={false}
                  animate={{ opacity: now ? 1 : 0.36 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange tabular-nums">
                    {x.n} · {x.group}
                  </span>
                  <h3 className="mt-3 text-[26px] sm:text-[32px] font-bold tracking-[-0.03em] leading-[1.15] text-carbon">
                    {x.title}
                  </h3>
                  <p className="mt-2 text-[15px] sm:text-[17px] italic text-graphite/50">
                    {x.line}
                  </p>
                  <p className="mt-4 text-[14px] leading-[1.65] text-graphite/65 max-w-[46ch]">
                    {x.body}
                  </p>

                  {/* the ABC caveat rides with the capability that carries it,
                      rather than becoming a section of its own */}
                  {x.n === "05" && (
                    <p className="mt-5 text-[10.5px] font-mono font-semibold tracking-[0.14em] uppercase leading-[1.7] text-graphite/40 max-w-[52ch]">
                      {NOTES.abc}
                    </p>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-28">
            {/* a dissolve — both panes stacked in the same box and cross-faded.
                `mode="wait"` would empty the box between them, which reads as
                a flash. */}
            <Stage>
              <AnimatePresence>
                <motion.div
                  key={g.n}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.015 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                >
                  <g.Pane />
                </motion.div>
              </AnimatePresence>
            </Stage>

            <div className="mt-6 flex items-center gap-4">
              <span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/45 tabular-nums shrink-0">
                Capability {g.n} / 08
              </span>
              <span className="flex items-center gap-1.5 flex-1">
                {GROUPS.map((x, n) => (
                  <span
                    key={x.n}
                    className="h-[3px] flex-1 rounded-full transition-colors duration-500"
                    style={{
                      background:
                        n === at
                          ? "#FF6A00"
                          : n < at
                            ? "rgba(255,106,0,0.32)"
                            : HAIR,
                    }}
                  />
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ── 06 product experience ─────────────────────────────── */

const LINE_D = "rgba(255,255,255,0.10)";

/**
 * The section-six slot every platform page carries, to `MepsExperience`s
 * shape: one frame on the dark ground, the floor on the left and its record
 * on the right, divided by a hairline rather than sitting in two cards. They
 * are one view of one thing, so they share a screen.
 *
 * The frame wears browser chrome, unlike the one in Core capabilities. That
 * is the right way round — there the screen is the subject and chrome would
 * say "web page"; here the point is that this is an application you open, so
 * the chrome and the URL are doing work.
 *
 * The four tabs are the source’s own: "Switch between location accuracy,
 * movement, ageing and ABC views without losing the physical context." They
 * filter the reading, not the model — the floor is the constant and the
 * question is what moves, which is the whole argument of the section.
 *
 * Every figure is the document’s: 12,480 mapped records, 98.7% accuracy, 147
 * exceptions, 4.6% aged, 48,920 positions, 72.4% occupied, C12 → D02, +2, and
 * 126 days in Zone Q02. None is a benchmark and none is invented.
 */
const VIEWS: {
  key: string;
  label: string;
  layer: number;
  focus: readonly [number, number];
  headline: [string, string];
  rows: [string, string, boolean][];
  note: string;
}[] = [
  {
    key: "accuracy",
    label: "Accuracy",
    layer: 2,
    focus: [0.42, 0.38],
    headline: ["98.7%", "Records agreeing with the floor"],
    rows: [
      ["Mapped stock records", "12,480", false],
      ["Open exceptions", "147", true],
      ["Selected position", "D02 · L3", true],
    ],
    note: "Accuracy is measured against the approved baseline, not against a previous count.",
  },
  {
    key: "movement",
    label: "Movement",
    layer: 3,
    focus: [0.62, 0.46],
    headline: ["C12 → D02", "Last supported move"],
    rows: [
      ["Event time", "14:42", true],
      ["Pallet", "BT-091", false],
      ["Quantity", "32", false],
    ],
    note: "Source, destination, time and available MHE or operator context, where the move is a supported event.",
  },
  {
    key: "ageing",
    label: "Ageing",
    layer: 4,
    focus: [0.28, 0.6],
    headline: ["4.6%", "Stock past the configured bucket"],
    rows: [
      ["Longest dwell", "126 days", true],
      ["Zone", "Q02", true],
      ["Positions mapped", "48,920", false],
    ],
    note: "Date basis, event logic, stock status, exclusions and buckets are configured from approved business rules.",
  },
  {
    key: "abc",
    label: "ABC",
    layer: 5,
    focus: [0.5, 0.3],
    headline: ["72.4%", "Positions occupied"],
    rows: [
      ["Class A · review", "Tighter", true],
      ["Class B · review", "Balanced", false],
      ["Class C · review", "By volume", false],
    ],
    note: "Thresholds, cost fields, period and consumption-value formula are agreed with the customer.",
  },
];

/** What the record column shows before a feed is attached. */
const STATIC_ROWS: [string, string, boolean][] = [
  ["Positions mapped", "48,920", false],
  ["Stock records", "—", false],
  ["Exceptions", "—", false],
];

export function IrosExperience() {
  const [live, setLive] = useState(false);
  const [tab, setTab] = useState(0);
  const v = VIEWS[tab];

  return (
    <Section surface="ink" id="experience">
      <SectionHeader
        eyebrow="Product experience"
        top="Start at the facility."
        bottom="Drill into the stock."
        tone="dark"
        size="compact"
        width="wide"
        body="Open the warehouse view, select a zone or location, inspect occupancy and exceptions, then open the digital record of an individual pallet, SKU or batch."
      />

      {/* the switch — the same two-state control the Digital Twin and MEPS
          product sections open on, and the same argument: the location model
          does not change, only whether anything is attached to it. A twin
          with no feed is a drawing of a warehouse; the tabs have nothing to
          filter until the record is connected, so they stay inert. */}
      <div className="flex justify-center mb-10">
        <div
          className="inline-flex p-1 rounded-full"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: `1px solid ${LINE_D}`,
          }}
        >
          {[
            ["Static model", false],
            ["Connect live data", true],
          ].map(([label, val]) => {
            const on = live === val;
            return (
              <button
                key={String(label)}
                type="button"
                onClick={() => setLive(val as boolean)}
                className={
                  "relative px-5 py-2.5 rounded-full text-[13px] font-semibold transition-colors duration-300 " +
                  (on ? "text-carbon" : "text-white/45 hover:text-white/75")
                }
              >
                {on && (
                  <motion.span
                    layoutId="irosexp-switch"
                    className="absolute inset-0 rounded-full bg-white"
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                )}
                <span className="relative">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="overflow-hidden"
        style={frameStyle("dark")}
      >
        {/* chrome — this one is an application you open, so it wears a URL */}
        <div
          className="flex items-center gap-2 px-4 py-3 flex-wrap"
          style={{ borderBottom: `1px solid ${LINE_D}`, background: "#111114" }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: "rgba(255,255,255,0.14)" }}
            />
          ))}
          <div
            className="ml-3 flex-1 min-w-[180px] max-w-[340px] h-6 rounded-md flex items-center px-3"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <span className="text-[10.5px] font-mono text-white/35 truncate">
              app.rams.digital/inventory/iros
            </span>
          </div>

          <span
            className="ml-3 shrink-0 text-[10px] font-mono font-semibold tracking-[0.14em] uppercase transition-colors duration-500"
            style={{ color: live ? "#FF6A00" : "rgba(255,255,255,0.30)" }}
          >
            {live ? `Live · ${v.label} view` : "Model only"}
          </span>

          {/* Nothing to filter on a model with no records in it, so the
              four views are inert until the feed is connected. */}
          <div
            className="ml-auto flex items-center gap-2 shrink-0 flex-wrap transition-opacity duration-500"
            style={{ opacity: live ? 1 : 0.3 }}
          >
            {VIEWS.map((x, n) => {
              const on = live && n === tab;
              return (
                <button
                  key={x.key}
                  type="button"
                  onClick={() => setTab(n)}
                  disabled={!live}
                  aria-current={on ? "true" : undefined}
                  className={
                    "px-3 py-1.5 rounded-md text-[11.5px] font-semibold transition-colors duration-300 " +
                    (on
                      ? "text-signal-orange"
                      : "text-white/45 " +
                        (live ? "hover:text-white/75" : "cursor-default"))
                  }
                  style={{
                    background: on ? "rgba(255,106,0,0.12)" : "transparent",
                    border: `1px solid ${on ? "rgba(255,106,0,0.42)" : LINE_D}`,
                  }}
                >
                  {x.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          {/* ── the floor ──────────────────────── */}
          <div
            className="p-4 sm:p-6 xl:border-r"
            style={{ borderColor: LINE_D }}
          >
            <div className="w-full aspect-[884/504] overflow-hidden">
              <TwinFacility
                step={live ? v.layer : 1}
                tone="dark"
                focus={live ? v.focus : undefined}
              />
            </div>
          </div>

          {/* ── the record ───────────────────── */}
          <div className="p-5 sm:p-7 border-t xl:border-t-0" style={{ borderColor: LINE_D }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={live ? v.key : "static"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <p className="text-[9.5px] font-mono font-bold tracking-[0.2em] uppercase text-white/35">
                  {live ? v.headline[1] : "No records connected"}
                </p>
                <p className="mt-3 font-rams-heading text-[40px] sm:text-[46px] font-bold leading-none tracking-[-0.04em] text-white tabular-nums">
                  {live ? v.headline[0] : "—"}
                </p>

                <div className="mt-7">
                  {(live ? v.rows : STATIC_ROWS).map(([label, value, hot]) => (
                    <div
                      key={label}
                      className="flex items-baseline justify-between gap-4 py-3"
                      style={{ borderBottom: `1px solid ${LINE_D}` }}
                    >
                      <span className="text-[12.5px] text-white/50 leading-[1.4]">
                        {label}
                      </span>
                      <span
                        className={
                          "text-[12.5px] font-mono font-bold tabular-nums shrink-0 " +
                          (hot ? "text-signal-orange" : "text-white")
                        }
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-6 text-[12px] leading-[1.65] text-white/40">
                  {live
                    ? v.note
                    : "The location model exists before any stock does. Connect the approved extract and every position in it gains a record, a history and an exception state."}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
/* ── 06 outcomes ──────────────────────────────────────────────────── */

export function IrosOutcomes() {
  return (
    <Section surface="white" id="outcomes">
      <Shine ns="irosout" />

      <SectionHeader
        eyebrow="Outcomes / Business value"
        top="Better inventory decisions"
        bottom="Begin with physical truth."
        size="compact"
        width="wide"
        body="Outcomes depend on data quality, capture coverage, operating discipline and the actions implemented by the customer."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {OUTCOMES.map((o, i) => (
          <motion.article
            key={o.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            className="irosout-card group relative flex flex-col p-7 sm:p-8 bg-white transition-all duration-300 hover:-translate-y-1"
            style={CARD}
          >
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>

            <h3 className="mt-6 min-h-[2.4em] text-[20px] sm:text-[21px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
              {o.title}
            </h3>

            <p className="mt-4 text-[14px] text-graphite/65 leading-[1.65]">
              {o.body}
            </p>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

/* ── 07 integrations ────────────────────────────────── */

const WELL: React.CSSProperties = {
  borderRadius: 10,
  border: `1px solid ${HAIR}`,
  background: "linear-gradient(180deg, #FAFAFB 0%, #FFFFFF 100%)",
};

/**
 * Three cards, each opening on a 196px animated well, then the module rail.
 *
 * This is `RdsIntegrations`. An earlier revision of this page listed the six
 * channels as plain text cards, which is the one thing the platform
 * integrations section never is — the well is the section: a small working
 * diagram of what the channel actually does, with the channel names as chips
 * underneath rather than as the headline.
 *
 * The six channels group into three: what captures identity and place, what
 * systems the record comes from, and what the RAMS platform does with the
 * result.
 */
const CARDS: {
  kicker: string;
  title: string;
  chips: string[];
  Widget: (p: { t: number }) => React.ReactNode;
}[] = [
  {
    kicker: "Capture",
    title: "Resolve identity to a place",
    chips: [
      "Barcode / QR",
      "RFID",
      "Vision / scanners",
      "Manual and mobile",
    ],
    Widget: ({ t }) => <WCapture t={t} />,
  },
  {
    kicker: "Systems",
    title: "Connect the record and the floor",
    chips: ["WMS / ERP / SAP", "MHE / IoT", "API or file exchange"],
    Widget: ({ t }) => <WSystems t={t} />,
  },
  {
    kicker: "RAMS platform",
    title: "Build cross-module context",
    chips: ["Digital Twin", "ATOS", "AIMS"],
    Widget: ({ t }) => <WModules t={t} />,
  },
];

const MODULES: [string, string, string][] = [
  ["WMS", "System of record", "#3E63DD"],
  ["Digital Twin", "Physical context", "#12A594"],
  ["IROS", "Inventory layer", "#FF6A00"],
  ["ATOS", "Task execution", "#6647F0"],
  ["AIMS", "Management view", "#E93D82"],
];

export function IrosIntegrations() {
  const t = useTick();

  return (
    <Section surface="offWhite" id="integrations">
      <SectionHeader
        eyebrow="Integrations"
        top="Inventory in the context"
        bottom="Of the whole operation."
        size="compact"
        width="wide"
        body="RAMS receives approved master, stock, transaction and event data through the method agreed during discovery. Identifiers, field ownership, frequency, exception handling and security are confirmed before production use."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[1240px] mx-auto">
        {CARDS.map((c, i) => (
          <motion.div
            key={c.kicker}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
            className="flex flex-col p-5 sm:p-6 bg-white"
            style={{ borderRadius: 12, border: `1px solid ${HAIR}` }}
          >
            <div
              className="shrink-0 overflow-hidden"
              style={{ ...WELL, height: 196 }}
            >
              <c.Widget t={t} />
            </div>

            <p className="mt-6 text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange">
              {c.kicker}
            </p>
            <h3 className="mt-3 text-[18px] font-bold text-carbon leading-[1.2] tracking-[-0.025em]">
              {c.title}
            </h3>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {c.chips.map((x) => (
                <span
                  key={x}
                  className="px-2.5 py-1 rounded-full text-[10.5px] text-graphite/60"
                  style={{ background: "#FAFAFB", border: `1px solid ${HAIR}` }}
                >
                  {x}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* The line through these five is the inventory record they share, not
          an order they run in, so each node carries its own module colour
          rather than a position. IROS is the marked node because it is the
          one the section is about. */}
      <div className="mt-14 sm:mt-16 max-w-[1240px] mx-auto">
        <div className="overflow-x-auto">
          <div className="relative min-w-[680px] lg:min-w-0">
            <span
              aria-hidden
              className="absolute top-[13px] h-px"
              style={{ left: "10%", right: "10%", background: "#E4E4E9" }}
            />

            <div className="relative grid grid-cols-5 gap-x-3">
              {MODULES.map(([k, v, tint], i) => {
                const hub = k === "IROS";
                return (
                  <motion.div
                    key={k}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
                    className="flex flex-col items-center text-center"
                  >
                    <span
                      className="w-[27px] h-[27px] rounded-full flex items-center justify-center"
                      style={{
                        background: hub ? tint : "#FFFFFF",
                        border: `1px solid ${hub ? tint : "#E4E4E9"}`,
                      }}
                    >
                      <span
                        className="w-[7px] h-[7px] rounded-full"
                        style={{ background: hub ? "#FFFFFF" : tint }}
                        aria-hidden
                      />
                    </span>
                    <span className="mt-4 text-[13px] font-bold text-carbon tracking-[-0.01em]">
                      {k}
                    </span>
                    <span className="mt-1 text-[12px] text-graphite/55 leading-[1.45]">
                      {v}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-12 mx-auto max-w-[860px] text-center text-[10.5px] font-mono font-semibold tracking-[0.16em] uppercase leading-[1.7] text-graphite/40">
        {NOTES.integration}
      </p>
    </Section>
  );
}
/* ── 08 questions ─────────────────────────────────────────────────── */

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

export function IrosFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section surface="white" id="faq">
      <SectionHeader
        eyebrow="FAQ"
        top="Before you connect"
        bottom="Inventory to the floor."
        size="compact"
        width="wide"
      />

      <div
        className="max-w-[900px] mx-auto"
        style={{ borderTop: `1px solid #E0E0E6` }}
      >
        {FAQS.map(([q, a], i) => {
          const on = open === i;
          return (
            <div key={q} style={{ borderBottom: `1px solid #E0E0E6` }}>
              <button
                type="button"
                onClick={() => setOpen(on ? null : i)}
                aria-expanded={on}
                className="w-full flex items-start justify-between gap-6 text-left py-6 group"
              >
                <span
                  className={
                    "text-[16px] sm:text-[17px] font-bold tracking-[-0.015em] leading-[1.4] transition-colors duration-300 " +
                    (on ? "text-carbon" : "text-carbon/85 group-hover:text-carbon")
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

export function IrosCTA() {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{ background: SURFACE.darkBottom }}
      id="demo"
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
          {CLOSE.eyebrow}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, ease: EASE }}
          className="mt-5 text-[32px] sm:text-[46px] lg:text-[60px] font-bold tracking-[-0.04em] leading-[1.06] mx-auto"
        >
          <span className="text-white">Connect the inventory record</span>
          <br />
          <span className="text-white/45">
            To the <span className="text-signal-orange">physical truth</span>.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
          className="mt-7 text-[16px] sm:text-[18px] text-white/55 leading-[1.6] max-w-[880px] mx-auto"
        >
          {CLOSE.body}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="mt-10 flex items-center justify-center gap-3 flex-wrap"
        >
          <Link
            href="/book-a-demo"
            className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3 rounded-lg transition-colors duration-200 hover:bg-signal-orange-hover"
          >
            Request a Demo
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
          <Link
            href="/services/inventory-audit"
            className="inline-flex items-center gap-2 text-white text-[14px] font-semibold px-6 py-3 rounded-lg border border-white/15 transition-colors duration-200 hover:bg-white/[0.06]"
          >
            Inventory audit service
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
