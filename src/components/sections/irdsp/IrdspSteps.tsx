"use client";

import { motion } from "framer-motion";
import { Video } from "lucide-react";
import {
  EASE,
  SURFACE,
  T,
  toneOf,
  Kicker,
  Outcome,
  ProductFrame,
  type ShotKey,
  type SurfaceKey,
} from "./irdsp-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

type Step = {
  n: string;
  id: string;
  label: string;
  title: string;
  body: string;
  chain: string[];
  happens: string;
  see: string;
  get: string;
  /** Real screen if we have one; otherwise a capture is still outstanding. */
  shot?: ShotKey;
  path: string;
  /** Recording still to be captured — see the note in the page summary. */
  pending?: string;
};

const STEPS: Step[] = [
  {
    n: "01",
    id: "set-up",
    label: "Set up",
    title: "Start with your rack system.",
    body: "Create the digital foundation for inspection — project, site, warehouse, rack system and the elements inside it.",
    chain: ["Project", "Site", "Warehouse", "Rack system", "Elements"],
    happens: "Your estate is modelled as projects, warehouses and rack systems.",
    see: "Programme dashboard with every project, site and open observation.",
    get: "A structured rack system ready for inspection.",
    shot: "portfolio",
    path: "rams.digital / dashboard",
  },
  {
    n: "02",
    id: "configure",
    label: "Rules & Action",
    title: "Turn inspection knowledge into a repeatable workflow.",
    body: "Define what gets checked, what counts as an issue, and what happens next — once, for every inspector.",
    chain: ["Element", "Check Point", "Work Phase", "Issue Detail", "Action"],
    happens: "Inspection logic is configured centrally rather than held in people's heads.",
    see: "The Rules and Action screen, mapping elements to checkpoints and outcomes.",
    get: "Every inspector follows the same inspection logic.",
    path: "rams.digital / rack / irds / rules-and-action",
    pending: "Rules & Action",
  },
  {
    n: "03",
    id: "plan",
    label: "Planner",
    title: "Know what needs to be inspected.",
    body: "Schedule inspection cycles, assign them to the right team and track what is upcoming, active and complete.",
    chain: ["Plan", "Assign", "Schedule", "Track"],
    happens: "Inspection cycles are planned and assigned across sites.",
    see: "Project Planner with schedule, owners and cycle status.",
    get: "Your inspection programme becomes visible and manageable.",
    path: "rams.digital / rack / irds / project-planner",
    pending: "Project Planner",
  },
  {
    n: "04",
    id: "inspect",
    label: "Inspection",
    title: "Inspect directly against the rack.",
    body: "Work down the structure itself. Every observation lands on the exact element it belongs to.",
    chain: ["Rack", "Bay", "Element", "Checkpoint", "Observation", "Issue"],
    happens: "Inspectors record observations against a specific bay and element.",
    see: "The inspection screen resolving Bay B-024 → Upright U-024-03 → checkpoint.",
    get: "Findings with a precise location, not a note in a document.",
    path: "rams.digital / rack / irds / inspection",
    pending: "Perform inspection",
  },
  {
    n: "05",
    id: "test",
    label: "Integrity Test",
    title: "Validate the rack with structured testing.",
    body: "Inspection is observation. Testing is measurement — readings compared against thresholds to produce a defensible result.",
    chain: ["Select test", "Select element", "Capture reading", "Calculate", "Threshold", "Result"],
    happens: "Engineering tests are run against elements and readings are captured.",
    see: "The Integrity Test screen with the test list, readings and computed results.",
    get: "Measurements become structured, comparable engineering results.",
    path: "rams.digital / rack / irds / integrity-test",
    pending: "Run an integrity test",
  },
  {
    n: "06",
    id: "review",
    label: "Review",
    title: "See the condition of the whole rack system.",
    body: "Roll every observation, test and action up to the structure — then click straight back down to the element and its evidence.",
    chain: ["Issues", "Testing", "Severity", "Status"],
    happens: "Results aggregate to rack, warehouse and project level.",
    see: "Rack Health Analytics in 2D or 3D, with issues highlighted by severity.",
    get: "One clear view of rack condition, traceable to every finding.",
    shot: "rackHealth3d",
    path: "rams.digital / rack / irds / rack-health-analytics",
  },
  {
    n: "07",
    id: "report",
    label: "Report",
    title: "From inspection data to engineering evidence.",
    body: "Compose the report from the data already captured — executive summary, findings log, test annexures and photographic evidence.",
    chain: ["Inspection", "Testing", "Issues", "Results", "Report"],
    happens: "A report template is built from modules and published as a version.",
    see: "The report builder with its module library, canvas and settings.",
    get: "Engineering evidence you can hand to a client or an auditor.",
    shot: "reportBuilder",
    path: "rams.digital / rack / irds / report / templates",
  },
];

export function IrdspSteps() {
  return (
    <>
      {/* workflow overview */}
      <section
        id="workflow"
        className="relative overflow-hidden text-white border-t border-white/[0.07]"
        style={{ background: SURFACE.darkMid }}
      >
        <div className="relative rams-container py-24 sm:py-28">
          <SectionHeader
            tone="dark"
            eyebrow="How it works"
            top="Seven steps,"
            bottom="one connected system."
            body="Configuration through to published report — each step is a screen in the product, not a stage in a document."
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {STEPS.map((s, i) => (
              <motion.a
                key={s.id}
                href={`#${s.id}`}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: i * 0.05, ease: EASE }}
                className="flex flex-col px-4 py-4 rounded-xl transition-colors duration-200 hover:bg-white/[0.05]"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <span
                  className="text-[9.5px] font-mono font-bold tracking-[0.16em] tabular-nums text-signal-orange"
                >
                  {s.n}
                </span>
                <span className="mt-1.5 text-[13px] font-semibold">{s.label}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* the steps — alternating side and surface */}
      {STEPS.map((s, i) => (
        <StepSection
          key={s.id}
          step={s}
          flip={i % 2 === 1}
          surface={i % 2 === 0 ? "white" : "offWhite"}
        />
      ))}
    </>
  );
}

function StepSection({
  step,
  flip,
  surface,
}: {
  step: Step;
  flip: boolean;
  surface: SurfaceKey;
}) {
  const tone = toneOf(surface);
  const t = T[tone];
  return (
    <section
      id={step.id}
      className={
        "relative overflow-hidden " + (tone === "dark" ? "text-white" : "")
      }
      style={{ background: SURFACE[surface] }}
    >
      <div className="rams-container py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[0.78fr_1.22fr] gap-10 lg:gap-14 items-center">
          {/* copy — the smaller half; the product is the hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: EASE }}
            className={flip ? "lg:order-2" : ""}
          >
            <div className="flex items-center gap-3">
              <span
                className="text-[11px] font-mono font-bold tracking-[0.18em] px-2 py-1 rounded text-signal-orange"
                style={{ background: "rgba(255,106,0,0.10)" }}
              >
                {step.n}
              </span>
              <Kicker tone={tone}>{step.label}</Kicker>
            </div>

            <h3 className={"mt-5 text-[26px] sm:text-[34px] font-bold leading-[1.12] tracking-[-0.03em] " + t.title}>
              {step.title}
            </h3>
            <p className={"mt-4 text-[14.5px] leading-[1.7] max-w-[440px] " + t.body}>
              {step.body}
            </p>

            {/* chain */}
            <div className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-2">
              {step.chain.map((c, i) => (
                <span key={c} className="flex items-center gap-2">
                  <span
                    className={
                      "px-2.5 py-1.5 rounded-lg text-[11.5px] font-mono font-semibold " +
                      t.chipText
                    }
                    style={{
                      background: t.chipBg,
                      border: `1px solid ${t.chipBorder}`,
                    }}
                  >
                    {c}
                  </span>
                  {i < step.chain.length - 1 && (
                    <span className={"text-[10px] " + t.muted}>→</span>
                  )}
                </span>
              ))}
            </div>

            <Outcome happens={step.happens} see={step.see} get={step.get} tone={tone} />
          </motion.div>

          {/* the product */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
            className={flip ? "lg:order-1" : ""}
          >
            {step.shot ? (
              <ProductFrame shot={step.shot} path={step.path} tone={tone} />
            ) : (
              <CaptureSlot label={step.pending ?? step.label} path={step.path} tone={tone} />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** Placeholder for a screen recording that has not been captured yet. */
function CaptureSlot({
  label,
  path,
  tone,
}: {
  label: string;
  path: string;
  tone: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div
      className="relative overflow-hidden"
      style={{
        borderRadius: 16,
        border: dark ? "1px dashed rgba(255,255,255,0.16)" : "1px dashed #D8D8DE",
        background: dark ? "#0C0C0F" : "#FBFBFC",
      }}
    >
      <div
        className="flex items-center gap-2 px-4 h-10 border-b"
        style={{
          borderColor: dark ? "rgba(255,255,255,0.07)" : "#EDEDF1",
          background: dark ? "#111114" : "#FAFAFB",
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: dark ? "rgba(255,255,255,0.12)" : "#E4E4E9" }}
          />
        ))}
        <div
          className="ml-3 flex-1 max-w-[320px] h-6 rounded-md flex items-center px-3"
          style={{ background: dark ? "rgba(255,255,255,0.05)" : "#F1F1F4" }}
        >
          <span
            className={
              "text-[10.5px] font-mono truncate " +
              (dark ? "text-white/30" : "text-graphite/40")
            }
          >
            {path}
          </span>
        </div>
      </div>

      <div className="aspect-[16/9] flex flex-col items-center justify-center gap-3 px-6 text-center">
        <span
          className="w-11 h-11 rounded-xl grid place-items-center"
          style={{
            background: "rgba(255,106,0,0.09)",
            border: "1px solid rgba(255,106,0,0.22)",
          }}
        >
          <Video className="w-[18px] h-[18px] text-signal-orange" strokeWidth={2} />
        </span>
        <span
          className={
            "text-[13px] font-semibold " +
            (dark ? "text-white/70" : "text-carbon/70")
          }
        >
          {label}
        </span>
        <span
          className={
            "text-[11.5px] max-w-[280px] leading-[1.5] " +
            (dark ? "text-white/35" : "text-graphite/45")
          }
        >
          Screen recording to be captured from the live product.
        </span>
      </div>
    </div>
  );
}
