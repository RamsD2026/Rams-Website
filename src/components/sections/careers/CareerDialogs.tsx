"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  FileText,
  History,
  Loader2,
  MapPin,
  PenLine,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { EASE } from "@/components/sections/rackiq/rackiq-shared";
import { FAMILIES } from "./careers-data";
import type { Job } from "./jobs-data";
import {
  EMPTY_DETAILS,
  readLastApplication,
  saveLastApplication,
  type ApplicantDetails,
} from "./career-store";
import { CAREERS_EMAIL } from "./careers-data";

/**
 * The careers application dialog. (A role's details have their own page,
 * /company/careers/jobs/[id] — see JobPage.)
 *
 * It sits on the shell `CaseModal` uses (portal, blurred scrim, white
 * 20px-radius panel, round close button, Escape and scroll lock), so it opens
 * the way a case study does elsewhere on the site.
 *
 * ── The application offers four ways in, after DXC's ────────────────
 *   Autofill with résumé — the PDF is read in the browser (`resume-parse`)
 *                          to fill the contact fields; it is attached too.
 *   Apply manually       — the empty form.
 *   Use my last application — the previous application's text fields, from
 *                          this device (`career-store`); the résumé is
 *                          attached again.
 *   Apply with LinkedIn  — shown, disabled, "Coming soon": it needs a
 *                          LinkedIn app registered by RAMS.
 * It submits to `/api/careers/apply`, which emails it to the careers inbox.
 * If email is not configured yet, the route says so and this offers a
 * ready-made email instead, so an applicant is never left at a dead end.
 */

const HAIR = "#E8E8ED";

export function familyTitle(code: string) {
  return FAMILIES.find((f) => f.code === code)?.title ?? code;
}

export function postedLabel(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/* ── the shell ────────────────────────────────────────────────────── */

function Shell({
  label,
  onClose,
  width = 760,
  children,
}: {
  label: string;
  onClose: () => void;
  width?: number;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        style={{ background: "rgba(6,6,8,0.72)", backdropFilter: "blur(4px)" }}
      />
      <motion.div
        className="relative w-full max-h-[92svh] sm:max-h-[88svh] overflow-auto bg-white rounded-t-[20px] sm:rounded-[20px]"
        initial={{ opacity: 0, y: 24, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.99 }}
        transition={{ duration: 0.35, ease: EASE }}
        style={{ maxWidth: width, boxShadow: "0 40px 90px -40px rgba(0,0,0,0.6)" }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-[1] flex items-center justify-center w-9 h-9 rounded-full bg-[#F2F2F2] hover:bg-[#E8E8ED] transition-colors"
        >
          <X className="w-4 h-4 text-carbon" strokeWidth={2} aria-hidden />
        </button>
        {children}
      </motion.div>
    </motion.div>,
    document.body,
  );
}

export function JobMeta({ job, dark = false }: { job: Job; dark?: boolean }) {
  const c = dark ? "text-white/55" : "text-graphite/60";
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] ${c}`}>
      <span className="inline-flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5" aria-hidden />
        {job.location}
      </span>
      <span>{job.type}</span>
      <span>{job.mode}</span>
      {job.experience && <span>{job.experience}</span>}
    </div>
  );
}

/* ── the application ──────────────────────────────────────────────── */

type Method = "resume" | "manual" | "last" | "linkedin";

const METHOD_LABEL: Record<Method, string> = {
  resume: "Autofill with résumé",
  manual: "Apply manually",
  last: "Use my last application",
  linkedin: "Apply with LinkedIn",
};

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  autoComplete,
  wide = false,
}: {
  label: string;
  name: keyof ApplicantDetails;
  value: string;
  onChange: (name: keyof ApplicantDetails, v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  wide?: boolean;
}) {
  return (
    <label className={"block " + (wide ? "sm:col-span-2" : "")}>
      <span className="text-[12px] font-semibold text-carbon">
        {label}
        {required && <span className="text-signal-orange"> *</span>}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(e) => onChange(name, e.target.value)}
        className="mt-1.5 w-full rounded-xl bg-[#F7F7F9] px-4 py-3 text-[14px] text-carbon outline-none transition-shadow focus:shadow-[inset_0_0_0_1.5px_#FF6A00]"
        style={{ boxShadow: `inset 0 0 0 1px ${HAIR}` }}
      />
    </label>
  );
}

export function ApplyDialog({ job, onClose }: { job: Job | null; onClose: () => void }) {
  const [step, setStep] = useState<"choose" | "form" | "done">("choose");
  const [method, setMethod] = useState<Method>("manual");
  const [details, setDetails] = useState<ApplicantDetails>(EMPTY_DETAILS);
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState<"" | "parsing" | "sending">("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [fallback, setFallback] = useState(false);
  /* The dialog only mounts in the browser, after a click, so storage can be
     read once up front. */
  const [last] = useState<ApplicantDetails | null>(() => readLastApplication());

  const roleTitle = job ? job.title : "General application";
  const set = (name: keyof ApplicantDetails, v: string) => setDetails((d) => ({ ...d, [name]: v }));

  const accept = (f: File | null | undefined): f is File => {
    if (!f) return false;
    if (f.size > 4 * 1024 * 1024) {
      setError("Résumé must be 4 MB or smaller.");
      return false;
    }
    if (!/\.(pdf|docx?)$/i.test(f.name)) {
      setError("Résumé must be a PDF or Word document.");
      return false;
    }
    setError("");
    return true;
  };

  const onResumeChosen = async (f: File | null | undefined) => {
    if (!accept(f)) return;
    setFile(f);
    setMethod("resume");
    if (!/\.pdf$/i.test(f.name)) {
      setNotice("Autofill reads PDF files. Your Word résumé is attached — please complete the details.");
      setStep("form");
      return;
    }
    setBusy("parsing");
    try {
      const { parseResume } = await import("./resume-parse");
      const p = await parseResume(f);
      const found = Object.values(p).filter(Boolean).length;
      setDetails((d) => ({
        ...d,
        firstName: p.firstName ?? d.firstName,
        lastName: p.lastName ?? d.lastName,
        email: p.email ?? d.email,
        phone: p.phone ?? d.phone,
        linkedin: p.linkedin ?? d.linkedin,
        portfolio: p.portfolio ?? d.portfolio,
      }));
      setNotice(
        found
          ? "We filled in what we could find in your résumé. Please check every field."
          : "We could not read details from this résumé, but it is attached. Please complete the form.",
      );
    } catch {
      setNotice("We could not read this résumé, but it is attached. Please complete the form.");
    } finally {
      setBusy("");
      setStep("form");
    }
  };

  const mailtoFallback = () => {
    const body = [
      `Role: ${roleTitle}${job ? ` (${job.id})` : ""}`,
      `Name: ${details.firstName} ${details.lastName}`,
      `Email: ${details.email}`,
      details.phone && `Phone: ${details.phone}`,
      details.location && `Location: ${details.location}`,
      details.linkedin && `LinkedIn: ${details.linkedin}`,
      details.portfolio && `Portfolio: ${details.portfolio}`,
      details.note && `\n${details.note}`,
      "\n(Please attach your résumé to this email.)",
    ]
      .filter(Boolean)
      .join("\n");
    return `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(`Application: ${roleTitle}`)}&body=${encodeURIComponent(body)}`;
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError("Please attach your résumé.");
      return;
    }
    if (!consent) {
      setError("Please agree to the privacy notice.");
      return;
    }
    setBusy("sending");
    setError("");
    setFallback(false);
    const body = new FormData();
    Object.entries(details).forEach(([k, v]) => body.append(k, v));
    body.append("jobId", job?.id ?? "");
    body.append("jobTitle", roleTitle);
    body.append("method", METHOD_LABEL[method]);
    body.append("consent", "yes");
    body.append("website", (e.currentTarget.elements.namedItem("website") as HTMLInputElement)?.value ?? "");
    body.append("resume", file);
    try {
      const res = await fetch("/api/careers/apply", { method: "POST", body });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fallback?: string };
      if (res.ok && json.ok) {
        saveLastApplication(details);
        setStep("done");
      } else {
        setError(json.error ?? "The application could not be sent.");
        setFallback(json.fallback === "mailto" || res.status >= 500);
      }
    } catch {
      setError("The application could not be sent. Check your connection and try again.");
      setFallback(true);
    } finally {
      setBusy("");
    }
  };

  /* ── step 1: how to apply ── */
  const options: {
    id: Method;
    icon: React.ReactNode;
    title: string;
    body: string;
    disabled?: boolean;
    badge?: string;
    onPick: () => void;
  }[] = [
    {
      id: "resume",
      icon: <Sparkles className="w-5 h-5" aria-hidden />,
      title: "Autofill with résumé",
      body: "Upload a PDF and we fill in your details. It stays attached to your application.",
      onPick: () => {},
    },
    {
      id: "manual",
      icon: <PenLine className="w-5 h-5" aria-hidden />,
      title: "Apply manually",
      body: "Fill in your details yourself and attach your résumé.",
      onPick: () => {
        setMethod("manual");
        setNotice("");
        setStep("form");
      },
    },
    {
      id: "last",
      icon: <History className="w-5 h-5" aria-hidden />,
      title: "Use my last application",
      body: last
        ? `Start from your previous details (${last.firstName} ${last.lastName}). Attach your résumé again.`
        : "Available after you apply once from this device.",
      disabled: !last,
      onPick: () => {
        if (!last) return;
        setDetails({ ...last, note: "" });
        setMethod("last");
        setNotice("We filled in your last application's details. Please check them and attach your résumé.");
        setStep("form");
      },
    },
    {
      id: "linkedin",
      icon: (
        <span aria-hidden className="text-[15px] font-bold leading-none tracking-[-0.02em]">
          in
        </span>
      ),
      title: "Apply with LinkedIn",
      body: "Use your LinkedIn profile to apply.",
      disabled: true,
      badge: "Coming soon",
      onPick: () => {},
    },
  ];

  return (
    <Shell label={`Apply — ${roleTitle}`} onClose={onClose} width={680}>
      <div className="p-7 sm:p-10">
        <p className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-signal-orange pr-10">
          {step === "done" ? "Application sent" : "Apply"}
        </p>
        <h2 className="mt-3 text-[24px] sm:text-[28px] font-bold tracking-[-0.03em] text-carbon leading-[1.2] pr-10">
          {roleTitle}
        </h2>
        {job && (
          <div className="mt-2.5">
            <JobMeta job={job} />
          </div>
        )}

        {step === "choose" && (
          <>
            <p className="mt-6 text-[14.5px] leading-[1.65] text-graphite/65">
              Choose how you would like to apply.
            </p>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {options.map((o) => {
                const parsing = o.id === "resume" && busy === "parsing";
                const cls =
                  "relative block text-left p-5 rounded-2xl transition-all duration-300 " +
                  (o.disabled
                    ? "bg-[#F7F7F9] opacity-60 cursor-not-allowed"
                    : "bg-white cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-24px_rgba(14,14,15,0.35)] focus-within:shadow-[inset_0_0_0_1.5px_#FF6A00]");
                const inner = (
                  <>
                    <span
                      className="flex items-center justify-center w-10 h-10 rounded-xl text-signal-orange"
                      style={{ background: "rgba(255,106,0,0.08)" }}
                    >
                      {parsing ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden /> : o.icon}
                    </span>
                    {o.badge && (
                      <span className="absolute top-4 right-4 text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase text-graphite/55 px-2 py-0.5 rounded-full bg-[#ECECEF]">
                        {o.badge}
                      </span>
                    )}
                    <span className="mt-4 block text-[15px] font-bold tracking-[-0.01em] text-carbon">{o.title}</span>
                    <span className="mt-1.5 block text-[13px] leading-[1.55] text-graphite/60">
                      {parsing ? "Reading your résumé…" : o.body}
                    </span>
                  </>
                );
                /* The résumé option is a label around its file input, so a
                   click opens the picker without reaching for a ref. */
                return o.id === "resume" ? (
                  <label key={o.id} className={cls} style={{ boxShadow: `inset 0 0 0 1px ${HAIR}` }}>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf"
                      className="sr-only"
                      disabled={busy === "parsing"}
                      onChange={(e) => onResumeChosen(e.target.files?.[0])}
                    />
                    {inner}
                  </label>
                ) : (
                  <button
                    key={o.id}
                    type="button"
                    disabled={o.disabled || busy === "parsing"}
                    onClick={o.onPick}
                    className={cls}
                    style={{ boxShadow: `inset 0 0 0 1px ${HAIR}` }}
                  >
                    {inner}
                  </button>
                );
              })}
            </div>
            {error && <p className="mt-4 text-[13px] text-[#D93D3D]">{error}</p>}
          </>
        )}

        {step === "form" && (
          <form onSubmit={submit} noValidate={false} className="mt-6">
            {notice && (
              <p
                className="mb-5 px-4 py-3 rounded-xl text-[13px] leading-[1.55] text-carbon"
                style={{ background: "rgba(255,106,0,0.07)", boxShadow: "inset 0 0 0 1px rgba(255,106,0,0.2)" }}
              >
                {notice}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First name" name="firstName" value={details.firstName} onChange={set} required autoComplete="given-name" />
              <Field label="Last name" name="lastName" value={details.lastName} onChange={set} required autoComplete="family-name" />
              <Field label="Email" name="email" type="email" value={details.email} onChange={set} required autoComplete="email" />
              <Field label="Phone" name="phone" type="tel" value={details.phone} onChange={set} autoComplete="tel" />
              <Field label="Current location" name="location" value={details.location} onChange={set} autoComplete="address-level2" />
              <Field label="LinkedIn profile" name="linkedin" type="url" value={details.linkedin} onChange={set} />
              <Field label="Portfolio or work samples" name="portfolio" type="url" value={details.portfolio} onChange={set} wide />
            </div>

            {/* résumé */}
            <div className="mt-5">
              <span className="text-[12px] font-semibold text-carbon">
                Résumé <span className="text-signal-orange">*</span>
              </span>
              <label
                className="mt-1.5 w-full flex items-center gap-3 rounded-xl px-4 py-3.5 text-left bg-[#F7F7F9] hover:bg-[#F2F2F4] transition-colors cursor-pointer focus-within:shadow-[inset_0_0_0_1.5px_#FF6A00]"
                style={{ boxShadow: `inset 0 0 0 1px ${file ? "rgba(255,106,0,0.35)" : HAIR}` }}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (accept(f)) setFile(f);
                  }}
                />
                {file ? (
                  <FileText className="w-5 h-5 text-signal-orange shrink-0" aria-hidden />
                ) : (
                  <Upload className="w-5 h-5 text-graphite/50 shrink-0" aria-hidden />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-medium text-carbon">
                    {file ? file.name : "Attach your résumé"}
                  </span>
                  <span className="block text-[12px] text-graphite/50">
                    {file ? "Click to replace" : "PDF or Word, up to 4 MB"}
                  </span>
                </span>
              </label>
            </div>

            <label className="block mt-5">
              <span className="text-[12px] font-semibold text-carbon">
                What problems would you like to solve?
              </span>
              <textarea
                value={details.note}
                onChange={(e) => set("note", e.target.value)}
                rows={4}
                maxLength={3000}
                className="mt-1.5 w-full rounded-xl bg-[#F7F7F9] px-4 py-3 text-[14px] text-carbon outline-none resize-y transition-shadow focus:shadow-[inset_0_0_0_1.5px_#FF6A00]"
                style={{ boxShadow: `inset 0 0 0 1px ${HAIR}` }}
              />
            </label>

            {/* bots fill this; people never see it */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

            <label className="mt-5 flex items-start gap-3 text-[13px] leading-[1.55] text-graphite/70">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#FF6A00] shrink-0"
              />
              <span>
                I agree that RAMS Digital may use these details and my résumé to
                consider my application, as described in the{" "}
                <Link href="/legal/privacy" target="_blank" className="font-semibold text-carbon underline underline-offset-2">
                  privacy policy
                </Link>
                .
              </span>
            </label>

            {error && (
              <div className="mt-5 px-4 py-3 rounded-xl bg-[#FDECEC] text-[13px] leading-[1.55] text-[#B42323]">
                {error}
                {fallback && (
                  <>
                    {" "}
                    <a href={mailtoFallback()} className="font-semibold underline underline-offset-2">
                      Send it by email instead
                    </a>{" "}
                    — your details are filled in; attach your résumé.
                  </>
                )}
              </div>
            )}

            <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setStep("choose");
                  setError("");
                }}
                className="text-[13.5px] font-semibold text-graphite/60 hover:text-carbon transition-colors"
              >
                ← Other ways to apply
              </button>
              <button
                type="submit"
                disabled={busy === "sending"}
                className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3 rounded-full transition-colors hover:bg-signal-orange-hover disabled:opacity-60"
              >
                {busy === "sending" ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                ) : (
                  <ArrowRight className="w-4 h-4" aria-hidden />
                )}
                {busy === "sending" ? "Sending…" : "Submit application"}
              </button>
            </div>
          </form>
        )}

        {step === "done" && (
          <div className="mt-8 text-center">
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#E7F8EE]">
              <Check className="w-7 h-7 text-[#1E9E5A]" aria-hidden />
            </span>
            <p className="mt-5 text-[16px] font-bold text-carbon">Thank you, {details.firstName}.</p>
            <p className="mt-2 mx-auto max-w-[440px] text-[14px] leading-[1.65] text-graphite/65">
              Your application for {roleTitle} has been sent to the RAMS Digital
              team. If the fit is right, we will be in touch at {details.email}.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-7 inline-flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-semibold text-carbon hover:bg-[#F2F2F2] transition-colors"
              style={{ boxShadow: `inset 0 0 0 1px ${HAIR}` }}
            >
              Back to careers
            </button>
          </div>
        )}
      </div>
    </Shell>
  );
}
