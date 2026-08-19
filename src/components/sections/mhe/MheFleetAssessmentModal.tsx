"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight, ArrowLeft, ChevronDown } from "lucide-react";

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
  { n: 1, label: "1. Utilisation", short: "Util" },
  { n: 2, label: "2. Productivity", short: "Prod" },
  { n: 3, label: "3. Safety", short: "Safety" },
  { n: 4, label: "4. Right-sizing", short: "Sizing" },
  { n: 5, label: "5. Your Score", short: "Score" },
];

const TOTAL_STEPS = TABS.length;

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
  const [step, setStep] = useState(1);

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

  if (typeof document === "undefined") return null;

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
          className="relative bg-white w-full my-auto"
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
          <div className="px-6 sm:px-8 lg:px-10 pt-6 sm:pt-7 pb-5 border-b border-[#EDF1F2]">
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

          <div className="px-6 sm:px-8 lg:px-10 pt-5 pb-2">
            <div>
              <div>
                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-[#768287] mb-2">
                    <span>Step {step} of {TOTAL_STEPS}</span>
                    <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-[#EDF1F2] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-signal-orange rounded-full"
                      animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                      transition={{ duration: 0.35, ease: EASE }}
                    />
                  </div>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-5">
                  {TABS.map((t) => (
                    <button
                      key={t.n}
                      onClick={() => setStep(t.n)}
                      className={`text-[11px] sm:text-[12px] font-extrabold rounded-lg px-1.5 sm:px-2.5 py-2.5 whitespace-nowrap transition-colors ${
                        step === t.n
                          ? "border border-[#FFB27B] bg-[#FFF5EE] text-[#D75B00]"
                          : "border border-[#DFE5E7] bg-[#F9FBFB] text-[#718086] hover:bg-white"
                      }`}
                    >
                      <span className="sm:hidden">{t.short}</span>
                      <span className="hidden sm:inline">{t.label}</span>
                    </button>
                  ))}
                </div>

                {/* Sections — fixed height, internal scroll */}
                <div
                  className="mhe-step-scroll overflow-y-auto pr-2 -mr-2"
                  style={{ height: 420 }}
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
                            className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-2.5 ${
                              i === 0 ? "sm:pt-0" : ""
                            } ${
                              i < SAFETY_QUESTIONS.length - 1
                                ? "border-b border-[#EDF1F2]"
                                : ""
                            }`}
                          >
                            <div className="flex-1 min-w-0 font-semibold text-[13px] text-carbon leading-[1.4]">
                              {q.q}
                            </div>
                            <div className="flex gap-1.5 shrink-0">
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
                                    className={`text-[11.5px] font-bold rounded-[7px] px-2.5 py-1.5 whitespace-nowrap transition-colors ${
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
                  {step === 5 && (
                    <StepPanel key="s5">
                      <SectionHead
                        eyebrow="Your Result"
                        title="Your fleet efficiency score."
                        body="Based on the utilisation, productivity, safety and right-sizing inputs you provided. Use approximate values if your fleet is not digitally monitored."
                      />
                      <ResultsBlock calc={calc} fleet={fleet} />
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
                  {step < TOTAL_STEPS ? (
                    <button
                      onClick={() => setStep(step + 1)}
                      className="ml-auto inline-flex items-center gap-2 bg-signal-orange hover:bg-signal-orange-hover text-white font-bold text-[13px] rounded-lg px-5 py-2.5 transition-all hover:-translate-y-px"
                    >
                      {step === TOTAL_STEPS - 1 ? "Calculate My Score" : "Next"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setStep(1)}
                      className="ml-auto inline-flex items-center gap-2 border border-[#CDD6DA] bg-white text-carbon font-bold text-[13px] rounded-lg px-5 py-2.5 hover:bg-[#FAFBFC] transition-colors"
                    >
                      Start over
                    </button>
                  )}
                </div>
              </div>

            </div>

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
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="peer w-full h-10 appearance-none border border-[#D7DFE2] rounded-[8px] pl-3 pr-9 bg-white text-carbon text-sm leading-none outline-none focus:border-[#FF9C58] focus:ring-[3px] focus:ring-signal-orange/10 transition cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C8A90] peer-focus:text-signal-orange transition-colors"
      />
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
      ? `Demand looks equivalent to ~${calc.indicative} MHEs against your current ${fleet}. Validate peaks, MHE type and redundancy before acting.`
      : diff <= -2
      ? `Demand looks equivalent to ~${calc.indicative} MHEs, above your current ${fleet}. Check task peaks, travel distance and congestion first.`
      : `Fleet size looks broadly aligned with your utilisation target. The bigger gain is likely in utilisation balancing and safety visibility.`;

  const safetyText =
    calc.safety < 40
      ? "Operator, speed and impact data not captured"
      : calc.safety < 70
      ? "Partial operator and event coverage, gaps remain"
      : "Strong operator and event coverage in place";

  return (
    <div className="flex flex-col gap-3">
      {/* Score */}
      <div className="bg-[#06171B] text-white rounded-[18px] px-6 py-5">
        <div className="flex items-center justify-between gap-4 mb-3.5">
          <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#7E8F95]">
            Your score
          </span>
          <span className="inline-flex px-2.5 py-1 rounded-full bg-signal-orange/15 text-[#FF9B57] text-[11px] font-bold">
            {maturity(calc.overall)}
          </span>
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className="text-[52px] font-black leading-none tracking-[-0.06em] tabular-nums">
            {calc.overall}
          </span>
          <span className="text-[14px] text-[#8FA0A5]">/100</span>
        </div>

        <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-signal-orange"
            initial={{ width: 0 }}
            animate={{ width: `${calc.overall}%` }}
            transition={{ duration: 0.8, ease: EASE }}
          />
        </div>
      </div>

      {/* Four results — number, name, one line of context */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <ResultCard
          value={`${Math.round(calc.util)}%`}
          label="Utilisation"
          sub={`${Math.round(100 - calc.util)}% of scheduled capacity not active`}
        />
        <ResultCard
          value={`${Math.round(calc.productivity)}%`}
          label="Productivity"
          sub={`~${Math.round(calc.idlePenalty)}% of time idle or waiting`}
        />
        <ResultCard
          value={`${calc.safety}%`}
          label="Safety visibility"
          sub={safetyText}
        />
        <ResultCard
          value={`${Math.round(calc.availability)}%`}
          label="Availability"
          sub={`${Math.round(100 - calc.availability)}% lost to maintenance downtime`}
        />
      </div>

      <div className="flex gap-3 items-start rounded-[14px] px-4 py-3.5 bg-[#FFF7F1] border border-[#FFE0C7]">
        <span className="w-1.5 h-1.5 rounded-full bg-signal-orange shrink-0 mt-[7px]" />
        <div>
          <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#B4661F]">
            Fleet sizing
          </span>
          <p className="mt-1 text-[12.5px] text-[#6B5443] leading-[1.5] m-0">
            {rightSizingText}
          </p>
        </div>
      </div>

      {/* Lead capture */}
      <div
        id="leadBox"
        className="rounded-[18px] bg-[#FAFBFB] border border-[#E0E6E8] p-5 sm:p-6"
      >
        <h3 className="text-[17px] font-bold text-carbon leading-[1.25] tracking-[-0.015em]">
          Turn assumptions into actual MHE data.
        </h3>
        <p className="mt-1.5 mb-4 text-[12.5px] text-[#69767B] leading-[1.5]">
          We will validate this assessment against real utilisation, operator
          and safety data from your fleet.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <LeadInput placeholder="Name" />
          <LeadInput placeholder="Company" />
          <LeadInput placeholder="Work email" />
          <LeadInput placeholder="Phone" />
          <button className="col-span-full inline-flex items-center justify-center gap-2 bg-signal-orange hover:bg-signal-orange-hover text-white font-bold text-[13px] rounded-lg px-5 py-3 transition-all hover:-translate-y-px">
            Request My Detailed Assessment
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-[10.5px] text-[#8A969B] leading-[1.5]">
        Indicative assessment only, based on your inputs and simplified
        assumptions. Actual fleet requirements depend on MHE type, task profile,
        peak demand, layout, redundancy and maintenance practice.
      </p>
    </div>
  );
}

/** One result: the number, what it is, and a single line of context. */
function ResultCard({
  value,
  label,
  sub,
}: {
  value: string;
  label: string;
  sub: string;
}) {
  return (
    <div className="border border-[#E0E6E8] rounded-[14px] px-4 py-4 bg-white flex flex-col">
      <span className="text-[28px] font-bold text-carbon leading-none tabular-nums tracking-[-0.035em]">
        {value}
      </span>
      <span className="mt-2 text-[10px] font-bold tracking-[0.14em] uppercase text-[#879399]">
        {label}
      </span>
      <span className="mt-1.5 text-[12px] text-[#5C686D] leading-[1.45]">
        {sub}
      </span>
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
      className={`h-10 rounded-[8px] border border-[#D7DFE2] bg-white text-carbon text-sm placeholder:text-[#93A0A5] px-3 outline-none focus:border-[#FF9C58] focus:ring-[3px] focus:ring-signal-orange/10 transition ${
        full ? "col-span-full" : ""
      }`}
    />
  );
}
