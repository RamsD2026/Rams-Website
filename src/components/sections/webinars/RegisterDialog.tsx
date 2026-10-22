"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, CheckCircle2, X } from "lucide-react";
import { EMAIL } from "@/components/sections/contact/contact-data";
import { FEATURED, type Featured } from "./webinar-data";

/**
 * The webinar registration form.
 *
 * Opened by every Register button on /resources/webinars, with that session
 * chosen. The shell is the careers application's (`CareerDialogs`): a
 * blurred backdrop, a 20px-radius white panel that rises from the bottom on a
 * phone, a round close button, Escape and a scroll lock.
 *
 * It posts to /api/webinars/register, which emails the registration to the
 * RAMS team. While that route is switched off (no Resend key) it answers 503
 * with `fallback: "mailto"`, and the form then offers a ready-made email with
 * every field filled in — so nobody's registration is lost.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const HAIR = "#E8E8ED";

type Details = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  designation: string;
  phone: string;
};

const EMPTY: Details = { firstName: "", lastName: "", email: "", company: "", designation: "", phone: "" };

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  autoComplete,
}: {
  label: string;
  name: keyof Details;
  value: string;
  onChange: (name: keyof Details, v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
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

export function RegisterDialog({ session, onClose }: { session: Featured; onClose: () => void }) {
  const [chosen, setChosen] = useState(session.id);
  const [d, setD] = useState<Details>(EMPTY);
  const [consent, setConsent] = useState(false);
  const [trap, setTrap] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fallback, setFallback] = useState(false);
  const [done, setDone] = useState(false);

  const s = FEATURED.find((x) => x.id === chosen) ?? session;
  const set = (name: keyof Details, v: string) => setD((p) => ({ ...p, [name]: v }));

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

  const mailto = () => {
    const body = [
      "Hello RAMS Digital,",
      "",
      `I would like to register for "${s.title}" on ${s.pill}.`,
      "",
      `Name: ${d.firstName} ${d.lastName}`,
      `Company: ${d.company}`,
      d.designation ? `Designation: ${d.designation}` : null,
      `Email: ${d.email}`,
      d.phone ? `Phone: ${d.phone}` : null,
      "",
      "Thank you.",
    ]
      .filter((l): l is string => l !== null)
      .join("\n");
    return `mailto:${EMAIL}?subject=${encodeURIComponent(`Webinar Registration - ${s.title}`)}&body=${encodeURIComponent(body)}`;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!consent) {
      setError("Please agree to the privacy notice.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/webinars/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session: s.title, when: s.pill, ...d, consent, website: trap }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setDone(true);
      } else {
        setError(json.error || "The registration could not be sent.");
        setFallback(json.fallback === "mailto" || res.status >= 500);
      }
    } catch {
      setError("The registration could not be sent.");
      setFallback(true);
    } finally {
      setBusy(false);
    }
  };

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
      aria-label="Register for a webinar"
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
        style={{ maxWidth: 640, boxShadow: "0 40px 90px -40px rgba(0,0,0,0.6)" }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-[1] flex items-center justify-center w-9 h-9 rounded-full bg-[#F2F2F2] hover:bg-[#E8E8ED] transition-colors"
        >
          <X className="w-4 h-4 text-carbon" strokeWidth={2} aria-hidden />
        </button>

        {done ? (
          <div className="p-7 sm:p-10 text-center">
            <CheckCircle2 className="mx-auto w-12 h-12 text-[#1E9E5A]" strokeWidth={1.75} aria-hidden />
            <h2 className="mt-5 text-[24px] sm:text-[28px] font-bold tracking-[-0.03em] text-carbon">
              You&rsquo;re registered.
            </h2>
            <p className="mt-3 text-[15px] leading-[1.6] text-graphite/65">
              Thank you, {d.firstName}. The RAMS team will confirm your place for{" "}
              <span className="font-semibold text-carbon">{s.title}</span> and send the joining link to{" "}
              <span className="font-semibold text-carbon">{d.email}</span>.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-8 inline-flex items-center gap-2 bg-carbon text-white text-[14px] font-semibold px-6 py-3 rounded-full transition-colors hover:bg-black"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-7 sm:p-9">
            <p className="text-[11px] font-mono font-semibold tracking-[0.2em] uppercase text-signal-orange">
              Webinar registration
            </p>
            <h2 className="mt-3 pr-10 text-[22px] sm:text-[26px] font-bold tracking-[-0.03em] leading-[1.2] text-carbon">
              {s.title}
            </h2>
            <p className="mt-2 inline-flex items-center gap-2 text-[13.5px] text-graphite/65">
              <CalendarDays className="w-4 h-4 text-signal-orange" aria-hidden />
              {s.pill}
            </p>

            <label className="mt-7 block">
              <span className="text-[12px] font-semibold text-carbon">
                Session<span className="text-signal-orange"> *</span>
              </span>
              <select
                value={chosen}
                onChange={(e) => setChosen(e.target.value)}
                className="mt-1.5 w-full rounded-xl bg-[#F7F7F9] px-4 py-3 text-[14px] text-carbon outline-none transition-shadow focus:shadow-[inset_0_0_0_1.5px_#FF6A00]"
                style={{ boxShadow: `inset 0 0 0 1px ${HAIR}` }}
              >
                {FEATURED.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.title} — {f.pill}
                  </option>
                ))}
              </select>
            </label>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First name" name="firstName" value={d.firstName} onChange={set} required autoComplete="given-name" />
              <Field label="Last name" name="lastName" value={d.lastName} onChange={set} required autoComplete="family-name" />
              <Field label="Work email" name="email" type="email" value={d.email} onChange={set} required autoComplete="email" />
              <Field label="Company" name="company" value={d.company} onChange={set} required autoComplete="organization" />
              <Field label="Designation" name="designation" value={d.designation} onChange={set} autoComplete="organization-title" />
              <Field label="Phone" name="phone" type="tel" value={d.phone} onChange={set} autoComplete="tel" />
            </div>

            {/* people never see this; bots fill it */}
            <input
              type="text"
              name="website"
              value={trap}
              onChange={(e) => setTrap(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="absolute -left-[9999px] w-px h-px opacity-0"
            />

            <label className="mt-6 flex items-start gap-3 text-[13px] leading-[1.55] text-graphite/70">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#FF6A00] shrink-0"
              />
              <span>
                I agree that RAMS Digital may use these details to manage my registration and contact me
                about this webinar, as described in the{" "}
                <Link href="/legal/privacy" className="font-semibold text-carbon underline underline-offset-2">
                  privacy notice
                </Link>
                .
              </span>
            </label>

            {error && (
              <div className="mt-5 px-4 py-3 rounded-xl text-[13px] leading-[1.55] text-carbon" style={{ background: "#FFF6EC", boxShadow: "inset 0 0 0 1px rgba(255,106,0,0.28)" }}>
                {error}
                {fallback && (
                  <>
                    {" "}
                    <a href={mailto()} className="font-semibold underline underline-offset-2">
                      Send it by email instead
                    </a>
                    {" "}— your details are already filled in.
                  </>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="mt-7 w-full inline-flex items-center justify-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3.5 rounded-full transition-colors hover:bg-signal-orange-hover disabled:opacity-60"
            >
              {busy ? "Registering…" : "Register"}
              {!busy && <ArrowRight className="w-4 h-4" aria-hidden />}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>,
    document.body,
  );
}
