"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight, ArrowLeft } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const SAFETY_QUESTIONS = [
  { key: "operator", q: "Can you identify which operator is using each MHE?" },
  { key: "speed", q: "Can you detect MHE overspeeding automatically?" },
  { key: "zones", q: "Can speed or safety thresholds differ by warehouse zone?" },
  { key: "impact", q: "Are MHE impacts / crash events digitally recorded?" },
  { key: "location", q: "Can you identify where an MHE event happened?" },
  { key: "access", q: "Can unauthorised operators be prevented from using an MHE?" },
  { key: "battery", q: "Do you have visibility into battery / equipment health?" },
  { key: "operatorperf", q: "Can safety performance be compared by operator?" },
];

const CHOICES = [
  { value: "1", label: "Yes" },
  { value: ".5", label: "Partially" },
  { value: "0", label: "No" },
];

const TABS = [
  { n: 1, label: "1. Utilisation" },
  { n: 2, label: "2. Productivity" },
  { n: 3, label: "3. Safety" },
  { n: 4, label: "4. Right-sizing" },
];

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const maturity = (s: number) =>
  s < 40
    ? "Limited Visibility"
    : s < 60
    ? "Developing"
    : s < 80
    ? "Connected Operations"
    : "Intelligent Operations";

export function MheFleetAssessmentModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [showResults, setShowResults] = useState(false);

  // Utilisation
  const [fleet, setFleet] = useState(25);
  const [shifts, setShifts] = useState(2);
  const [hoursShift, setHoursShift] = useState(8);
  const [daysMonth, setDaysMonth] = useState(26);
  const [activeHours, setActiveHours] = useState(8.5);
  const [idleHours, setIdleHours] = useState(3);

  // Productivity
  const [waitHours, setWaitHours] = useState(1.2);
  const [maintHours, setMaintHours] = useState(14);
  const [actualTrips, setActualTrips] = useState(95);
  const [targetTrips, setTargetTrips] = useState(120);

  // Safety answers
  const [safety, setSafety] = useState<Record<string, string>>(() =>
    SAFETY_QUESTIONS.reduce(
      (acc, q) => ({ ...acc, [q.key]: "0" }),
      {} as Record<string, string>
    )
  );

  // Right-sizing
  const [targetUtil, setTargetUtil] = useState(".75");
  const [peakAllowance, setPeakAllowance] = useState(".10");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const calc = useMemo(() => {
    const availableHoursPerDay = Math.max(1, shifts * hoursShift);
    const util = clamp((activeHours / availableHoursPerDay) * 100, 0, 100);
    const tripPerf = clamp((actualTrips / Math.max(1, targetTrips)) * 100, 0, 100);
    const idlePenalty = clamp(
      ((idleHours + waitHours) / availableHoursPerDay) * 100,
      0,
      100
    );
    const productivity = clamp(
      tripPerf * 0.7 + (100 - idlePenalty) * 0.3,
      0,
      100
    );
    const monthlyAvailablePerMHE =
      availableHoursPerDay * Math.max(1, daysMonth);
    const availability = clamp(
      (1 - maintHours / Math.max(1, monthlyAvailablePerMHE)) * 100,
      0,
      100
    );
    const safetyScore = Math.round(
      (SAFETY_QUESTIONS.reduce(
        (acc, q) => acc + parseFloat(safety[q.key] || "0"),
        0
      ) /
        SAFETY_QUESTIONS.length) *
        100
    );
    const overall = Math.round(
      util * 0.3 +
        productivity * 0.25 +
        safetyScore * 0.3 +
        availability * 0.15
    );

    const effectiveDemand = Math.max(1, fleet * (util / 100));
    let indicative = Math.ceil(
      (effectiveDemand / Math.max(0.1, parseFloat(targetUtil))) *
        (1 + parseFloat(peakAllowance))
    );
    indicative = Math.max(1, Math.min(fleet * 2, indicative));

    return {
      util,
      productivity,
      safety: safetyScore,
      availability,
      overall,
      tripPerf,
      idlePenalty,
      indicative,
    };
  }, [
    fleet,
    shifts,
    hoursShift,
    daysMonth,
    activeHours,
    idleHours,
    waitHours,
    maintHours,
    actualTrips,
    targetTrips,
    safety,
    targetUtil,
    peakAllowance,
  ]);

  if (!mounted) return null;

  const overlay = (
    <motion.div
      key="mhe-assess-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] overflow-y-auto"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-none" />

      <div className="flex min-h-full items-start justify-center p-3 sm:p-6 lg:p-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 24 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="relative bg-[#F7F9FA] w-full my-auto"
          style={{ borderRadius: 20, maxWidth: 1200 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white hover:bg-[#F0F2F3] flex items-center justify-center transition-colors shadow-md"
          >
            <X className="w-4 h-4 text-carbon" />
          </button>

          {/* Header */}
          <div className="px-6 sm:px-8 lg:px-10 pt-6 sm:pt-7 pb-1">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-[7px] h-[7px] rounded-full bg-signal-orange" />
              <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-signal-orange">
                MHE Fleet Efficiency Assessment
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-carbon leading-[1.1] tracking-[-0.03em] max-w-[720px]">
              How efficiently is your{" "}
              <span className="text-signal-orange">MHE fleet</span> really being
              used?
            </h2>
          </div>

          <div className="p-4 sm:p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">
            {/* Assessment column */}
            <div>
              <div className="bg-white border border-[#E1E7E9] rounded-[18px] p-5 sm:p-6 shadow-[0_14px_40px_rgba(20,39,46,0.05)]">
                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-[#768287] mb-2">
                    <span>Step {step} of 4</span>
                    <span>{step * 25}%</span>
                  </div>
                  <div className="h-1.5 bg-[#EDF1F2] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-signal-orange rounded-full"
                      animate={{ width: `${step * 25}%` }}
                      transition={{ duration: 0.35, ease: EASE }}
                    />
                  </div>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
                  {TABS.map((t) => (
                    <button
                      key={t.n}
                      onClick={() => {
                        setStep(t.n);
                        setShowResults(false);
                      }}
                      className={`text-[12px] font-extrabold rounded-lg px-2.5 py-2.5 transition-colors ${
                        step === t.n
                          ? "border border-[#FFB27B] bg-[#FFF5EE] text-[#D75B00]"
                          : "border border-[#DFE5E7] bg-[#F9FBFB] text-[#718086] hover:bg-white"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Sections — fixed height, internal scroll */}
                <div
                  className="mhe-step-scroll overflow-y-auto pr-2 -mr-2"
                  style={{ height: 340 }}
                >
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <StepPanel key="s1">
                      <SectionHead
                        eyebrow="Fleet Utilisation"
                        title="Start with your available fleet capacity."
                        body="Use approximate numbers if exact telemetry data is not currently available."
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Number of MHEs">
                          <NumInput value={fleet} onChange={setFleet} min={1} />
                        </Field>
                        <Field label="Operating shifts per day">
                          <NumInput
                            value={shifts}
                            onChange={setShifts}
                            min={1}
                            max={4}
                          />
                        </Field>
                        <Field label="Hours per shift">
                          <NumInput
                            value={hoursShift}
                            onChange={setHoursShift}
                            min={1}
                            max={24}
                            step={0.5}
                          />
                        </Field>
                        <Field label="Working days per month">
                          <NumInput
                            value={daysMonth}
                            onChange={setDaysMonth}
                            min={1}
                            max={31}
                          />
                        </Field>
                        <Field
                          label="Average active operating hours / MHE / day"
                          hint="Time when the MHE is actually in operating use."
                        >
                          <NumInput
                            value={activeHours}
                            onChange={setActiveHours}
                            min={0}
                            max={24}
                            step={0.1}
                          />
                        </Field>
                        <Field label="Average idle hours / MHE / day">
                          <NumInput
                            value={idleHours}
                            onChange={setIdleHours}
                            min={0}
                            max={24}
                            step={0.1}
                          />
                        </Field>
                      </div>
                    </StepPanel>
                  )}

                  {step === 2 && (
                    <StepPanel key="s2">
                      <SectionHead
                        eyebrow="Productivity Loss"
                        title="Where is fleet time being lost?"
                        body="Estimate waiting, downtime and task performance against the expected operational target."
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Average waiting / queue time per MHE / day">
                          <NumInput
                            value={waitHours}
                            onChange={setWaitHours}
                            min={0}
                            max={24}
                            step={0.1}
                          />
                        </Field>
                        <Field label="Average maintenance downtime / MHE / month">
                          <NumInput
                            value={maintHours}
                            onChange={setMaintHours}
                            min={0}
                            step={0.5}
                          />
                        </Field>
                        <Field label="Average trips / tasks completed per shift">
                          <NumInput
                            value={actualTrips}
                            onChange={setActualTrips}
                            min={0}
                          />
                        </Field>
                        <Field label="Target trips / tasks per shift">
                          <NumInput
                            value={targetTrips}
                            onChange={setTargetTrips}
                            min={1}
                          />
                        </Field>
                      </div>
                    </StepPanel>
                  )}

                  {step === 3 && (
                    <StepPanel key="s3">
                      <SectionHead
                        eyebrow="Safety Visibility"
                        title="How much MHE safety data can you actually see?"
                        body="Select the answer that best reflects your current operation."
                      />
                      <div>
                        {SAFETY_QUESTIONS.map((q, i) => (
                          <div
                            key={q.key}
                            className={`py-3 ${
                              i === 0 ? "pt-0" : ""
                            } ${
                              i < SAFETY_QUESTIONS.length - 1
                                ? "border-b border-[#EDF1F2]"
                                : ""
                            }`}
                          >
                            <div className="font-bold text-[13px] text-carbon mb-2">
                              {q.q}
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              {CHOICES.map((c) => {
                                const selected = safety[q.key] === c.value;
                                return (
                                  <button
                                    key={c.value}
                                    onClick={() =>
                                      setSafety((prev) => ({
                                        ...prev,
                                        [q.key]: c.value,
                                      }))
                                    }
                                    className={`text-[12px] font-bold rounded-[8px] px-3 py-2 transition-colors ${
                                      selected
                                        ? "border border-[#FF9B55] bg-[#FFF3EA] text-[#D85A00]"
                                        : "border border-[#D9E1E4] bg-white text-[#59676D] hover:bg-[#FAFBFC]"
                                    }`}
                                  >
                                    {c.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </StepPanel>
                  )}

                  {step === 4 && (
                    <StepPanel key="s4">
                      <SectionHead
                        eyebrow="Fleet Right-sizing"
                        title="Is your fleet size aligned with demand?"
                        body="This produces only an indicative opportunity estimate. Peak demand, redundancy, MHE type and operational constraints must also be considered."
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Target utilisation you would consider healthy">
                          <Select
                            value={targetUtil}
                            onChange={setTargetUtil}
                            options={[
                              { value: ".65", label: "65%" },
                              { value: ".70", label: "70%" },
                              { value: ".75", label: "75%" },
                              { value: ".80", label: "80%" },
                              { value: ".85", label: "85%" },
                            ]}
                          />
                        </Field>
                        <Field
                          label="Peak-demand allowance"
                          hint="Allows for operational peaks and fleet resilience."
                        >
                          <Select
                            value={peakAllowance}
                            onChange={setPeakAllowance}
                            options={[
                              { value: ".05", label: "5%" },
                              { value: ".10", label: "10%" },
                              { value: ".15", label: "15%" },
                              { value: ".20", label: "20%" },
                            ]}
                          />
                        </Field>
                      </div>
                    </StepPanel>
                  )}
                </AnimatePresence>
                </div>
                <style>{`
                  .mhe-step-scroll::-webkit-scrollbar{width:6px}
                  .mhe-step-scroll::-webkit-scrollbar-track{background:transparent}
                  .mhe-step-scroll::-webkit-scrollbar-thumb{background:#D7DFE2;border-radius:6px}
                  .mhe-step-scroll::-webkit-scrollbar-thumb:hover{background:#B9C3C7}
                  .mhe-step-scroll{scrollbar-width:thin;scrollbar-color:#D7DFE2 transparent}
                `}</style>

                {/* Actions */}
                <div className="flex justify-between gap-3 mt-4 pt-4 border-t border-[#EEF1F2]">
                  {step > 1 ? (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="inline-flex items-center gap-2 border border-[#CDD6DA] bg-white text-carbon font-bold text-[13px] rounded-lg px-4 py-2.5 hover:bg-[#FAFBFC] transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Previous
                    </button>
                  ) : (
                    <div />
                  )}
                  <button
                    onClick={() => {
                      if (step < 4) setStep(step + 1);
                      else setShowResults(true);
                    }}
                    className="ml-auto inline-flex items-center gap-2 bg-signal-orange hover:bg-signal-orange-hover text-white font-bold text-[13px] rounded-lg px-5 py-2.5 transition-all hover:-translate-y-px"
                  >
                    {step === 4 ? "Calculate My Score" : "Next"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Results */}
              <AnimatePresence>
                {showResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="mt-7"
                  >
                    <ResultsBlock calc={calc} fleet={fleet} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <aside className="bg-[#07181C] text-white rounded-[18px] p-5 lg:sticky lg:top-6 shadow-[0_18px_50px_rgba(0,0,0,0.16)]">
              <div className="text-[11px] tracking-[0.12em] uppercase text-[#96A3A8] font-bold">
                Live assessment preview
              </div>
              <div className="text-[42px] font-black leading-none tracking-[-0.06em] mt-1.5 mb-2 tabular-nums">
                {calc.overall}
                <span className="text-[14px] text-[#98A4A9] font-normal">
                  /100
                </span>
              </div>
              <div className="inline-flex px-2.5 py-1 rounded-full bg-signal-orange/15 text-[#FF9B57] text-[11px] font-bold">
                {maturity(calc.overall)}
              </div>

              <div className="grid gap-2.5 mt-4">
                <MeterRow label="Utilisation" value={calc.util} />
                <MeterRow label="Productivity" value={calc.productivity} />
                <MeterRow label="Safety visibility" value={calc.safety} />
                <MeterRow label="Fleet availability" value={calc.availability} />
              </div>

              <p className="mt-4 text-[11px] text-[#87959A] leading-[1.5]">
                Scores update as you complete the assessment. Use approximate
                values if your current fleet is not digitally monitored.
              </p>
            </aside>
          </div>

          <div className="pb-5" />
        </motion.div>
      </div>
    </motion.div>
  );

  return createPortal(
    <AnimatePresence>{open && overlay}</AnimatePresence>,
    document.body
  );
}

/* ── Building blocks ─────────────────────────────────────── */

function StepPanel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function SectionHead({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="mb-4">
      <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-signal-orange mb-1.5">
        {eyebrow}
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-carbon leading-[1.15] tracking-[-0.02em] mb-1">
        {title}
      </h3>
      <p className="text-[13px] text-[#6B777C] leading-[1.5] m-0">{body}</p>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[12px] font-bold text-carbon mb-1">
        {label}
      </label>
      {children}
      {hint && (
        <small className="block text-[#8A959A] text-[11px] mt-1">
          {hint}
        </small>
      )}
    </div>
  );
}

function NumInput({
  value,
  onChange,
  min,
  max,
  step,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      className="w-full h-10 border border-[#D7DFE2] rounded-[8px] px-3 bg-white text-carbon text-sm outline-none focus:border-[#FF9C58] focus:ring-[3px] focus:ring-signal-orange/10 transition"
    />
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-10 border border-[#D7DFE2] rounded-[8px] px-3 bg-white text-carbon text-sm outline-none focus:border-[#FF9C58] focus:ring-[3px] focus:ring-signal-orange/10 transition"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function MeterRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-2.5 border border-white/[0.09] rounded-lg bg-white/[0.025]">
      <div className="flex justify-between gap-2.5 text-[11px] text-[#AEB8BC]">
        <span>{label}</span>
        <b className="text-white tabular-nums">{Math.round(value)}%</b>
      </div>
      <div className="h-1 bg-[#153137] rounded-full overflow-hidden mt-2">
        <motion.div
          className="h-full bg-signal-orange rounded-full"
          animate={{ width: `${Math.round(value)}%` }}
          transition={{ duration: 0.4, ease: EASE }}
        />
      </div>
    </div>
  );
}

function ResultsBlock({
  calc,
  fleet,
}: {
  calc: {
    util: number;
    productivity: number;
    safety: number;
    availability: number;
    overall: number;
    tripPerf: number;
    idlePenalty: number;
    indicative: number;
  };
  fleet: number;
}) {
  const diff = fleet - calc.indicative;

  const rightSizingText =
    diff >= 2
      ? `Your current inputs suggest the operation may warrant a fleet right-sizing study. A simplified estimate indicates demand equivalent to about ${calc.indicative} MHEs versus the current ${fleet}. This is not a recommendation to remove equipment; peak demand, MHE type, task criticality and redundancy must be validated first.`
      : diff <= -2
      ? `Your current inputs suggest fleet demand may be relatively high versus the selected target utilisation. A simplified estimate indicates an equivalent requirement of about ${calc.indicative} MHEs. Validate task peaks, travel distance and congestion before considering fleet expansion.`
      : `Your current fleet size appears broadly aligned with the selected utilisation target under this simplified model. The stronger opportunity may be in utilisation balancing, operator productivity and safety visibility rather than fleet count alone.`;

  const safetyText =
    calc.safety < 40
      ? "Safety visibility is limited. Operator identity, speed, impact, location or access-control data may currently be difficult to monitor consistently."
      : calc.safety < 70
      ? "You have partial safety visibility, but there are still important gaps that may prevent consistent operator- and event-level analysis."
      : "Your operation already has relatively strong safety visibility. The next opportunity is to connect events, operators, zones and trends into one intelligence layer.";

  return (
    <div>
      <div className="bg-[#06171B] text-white rounded-[24px] p-7 sm:p-8 grid grid-cols-1 lg:grid-cols-[.8fr_1.2fr] gap-6 items-center">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-[7px] h-[7px] rounded-full bg-signal-orange" />
            <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-signal-orange">
              Your Result
            </span>
          </div>
          <div className="text-[72px] font-black leading-none tracking-[-0.07em] tabular-nums">
            {calc.overall}
            <span className="text-[18px] text-[#8FA0A5] font-normal">/100</span>
          </div>
          <div className="inline-flex mt-3 px-2.5 py-1.5 rounded-full bg-signal-orange/15 text-[#FF9B57] text-[11px] font-bold">
            {maturity(calc.overall)}
          </div>
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white leading-[1.05] tracking-[-0.02em] mb-2">
            Your RAMS MHE Intelligence Score
          </h3>
          <p className="text-[#AEB8BC] text-[15px] leading-[1.55] mb-4">
            Your indicative score is {calc.overall}/100 (
            {maturity(calc.overall)}). The assessment combines utilisation,
            productivity, safety visibility and fleet availability to highlight
            where deeper MHE data may create operational value.
          </p>
          <a
            href="#leadBox"
            className="inline-flex items-center gap-2 bg-signal-orange hover:bg-signal-orange-hover text-white font-bold text-[13px] rounded-lg px-5 py-3 transition-all hover:-translate-y-px"
          >
            Get Detailed Assessment
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        <ResultKpi label="Fleet utilisation" value={`${Math.round(calc.util)}%`} />
        <ResultKpi
          label="Productivity score"
          value={`${Math.round(calc.productivity)}%`}
        />
        <ResultKpi label="Safety visibility" value={`${calc.safety}/100`} />
        <ResultKpi
          label="Fleet availability"
          value={`${Math.round(calc.availability)}%`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <Insight
          title="Potential unutilised capacity"
          body={`Based on the inputs, approximately ${Math.round(
            100 - calc.util
          )}% of scheduled fleet capacity is not currently reflected as active operating time.`}
        />
        <Insight
          title="Productivity loss exposure"
          body={`Your current task performance is approximately ${Math.round(
            calc.tripPerf
          )}% of target, with an estimated ${Math.round(
            calc.idlePenalty
          )}% of daily scheduled time exposed to idle and waiting activity.`}
        />
        <Insight title="Safety visibility gap" body={safetyText} />
        <Insight
          title="Operational visibility"
          body={
            calc.overall < 60
              ? "The assessment suggests a meaningful opportunity to improve data visibility before making fleet productivity or safety decisions."
              : "Your operation shows a useful level of visibility, with scope to improve decision quality using continuous MHE telemetry and trend analysis."
          }
        />
      </div>

      <div className="mt-4 p-6 rounded-[18px] bg-[#FFF5ED] border border-[#FFD5B5]">
        <h3 className="text-[18px] font-bold text-carbon leading-[1.2] mb-2">
          Indicative fleet optimisation opportunity
        </h3>
        <p className="text-[14px] text-[#6C7477] leading-[1.55] m-0">
          {rightSizingText}
        </p>
      </div>

      <div
        id="leadBox"
        className="mt-6 rounded-[22px] bg-[#111C20] text-white p-7 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center"
      >
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-[7px] h-[7px] rounded-full bg-signal-orange" />
            <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#FF9F61]">
              Next Step
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold leading-[1.05] tracking-[-0.02em] mb-2">
            Turn assumptions into actual MHE data.
          </h3>
          <p className="text-[#B3BDC1] text-[15px] leading-[1.55] m-0">
            RAMS MEPS can help validate your assessment using actual location,
            operator, safety event, utilisation and equipment data from your
            fleet.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <LeadInput placeholder="Name" />
          <LeadInput placeholder="Company" />
          <LeadInput placeholder="Work email" />
          <LeadInput placeholder="Phone" />
          <LeadInput placeholder="Warehouse location" full />
          <button className="col-span-full inline-flex items-center justify-center gap-2 bg-signal-orange hover:bg-signal-orange-hover text-white font-bold text-[13px] rounded-lg px-5 py-3 transition-all hover:-translate-y-px">
            Request My Detailed MHE Assessment
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="mt-4 text-[11px] text-[#8C989D] leading-[1.55]">
        This calculator provides an indicative assessment only. Results are
        based on user-provided inputs and simplified assumptions. Actual fleet
        requirements depend on MHE type, task profile, peak demand, travel
        distance, warehouse layout, redundancy requirements, maintenance
        practices and operational constraints.
      </p>
    </div>
  );
}

function ResultKpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#DFE6E8] rounded-2xl p-4 bg-white">
      <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#879399]">
        {label}
      </span>
      <b className="block text-[24px] font-bold text-carbon tabular-nums tracking-[-0.02em] mt-1">
        {value}
      </b>
    </div>
  );
}

function Insight({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-[#E0E6E8] rounded-2xl p-5 bg-[#FAFBFB]">
      <h3 className="text-[16px] font-bold text-carbon leading-[1.2] mb-2">
        {title}
      </h3>
      <p className="text-[13px] text-[#69767B] leading-[1.55] m-0">{body}</p>
    </div>
  );
}

function LeadInput({
  placeholder,
  full,
}: {
  placeholder: string;
  full?: boolean;
}) {
  return (
    <input
      placeholder={placeholder}
      className={`h-11 rounded-[9px] border border-white/[0.14] bg-[#1A292D] text-white placeholder:text-white/40 px-3 outline-none focus:border-signal-orange/60 transition ${
        full ? "col-span-full" : ""
      }`}
    />
  );
}
