"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { EMAIL, ENQUIRIES } from "./contact-data";

/**
 * The enquiry form — the right-hand half of the hero.
 *
 * A white card on the dark ground. It renders no `Section` and no heading of
 * its own: it sits inside `ContactHero`, which owns the surface, and a form
 * with its own section header inside another section's header is two titles
 * for one thing.
 *
 * ── It is short on purpose ──────────────────────────────────────────
 * The fields pair off — name with company, email with phone, enquiry type
 * with country — so seven inputs occupy three rows rather than seven. The
 * message box is four rows, not six. "Facility / city" and "Number of sites"
 * are gone: both are useful to the team and neither is needed to start a
 * conversation, and every field on a contact form is a reason not to fill it
 * in. They can be asked in the reply.
 *
 * The labels sit at 12px with 6px under them rather than the site's usual
 * 12.5/8, which is the difference between this card fitting beside the copy
 * at 1280 and pushing the hero taller than the viewport.
 *
 * ══════════════════════════════════════════════════════════════════════
 *  THIS FORM HAS NO BACKEND. IT COMPOSES AN EMAIL.
 * ══════════════════════════════════════════════════════════════════════
 *
 * On submit it validates, builds a structured message and hands it to the
 * visitor's mail client through a `mailto:` link. Nothing is posted anywhere,
 * nothing is stored, and no third party sees the fields.
 *
 * That is the source document's own design — its FAQ says a production
 * website should connect the form to an approved CRM or secure
 * form-processing service — and it is the only honest option while no
 * endpoint exists in this repository. A form that appears to submit while
 * quietly dropping every enquiry is worse than no form at all. When an
 * endpoint exists, replace `send()`; the validation, the state and the fields
 * do not change.
 *
 * `mailto:` has a practical limit of roughly 2,000 characters in some
 * clients, so the message field is capped at 1,200. That cap is why: it is
 * not an opinion about how much anyone should write.
 *
 * ── Nothing is written under the button ─────────────────────────────
 * It carried two lines: that this page posts nothing anywhere and that a
 * reader should not type a password into it, and a direct email and phone
 * under that. Both were removed on request.
 *
 * Two consequences worth knowing. The reader is no longer told the form does
 * not submit — they find out when their mail client opens — and there is no
 * confirmation after the button is pressed, so if a browser blocks the
 * `mailto:` handler nothing visible happens. The credential warning survives
 * only in `AGENTS`-adjacent docs and this comment; the source document put it
 * on the form for a reason, and a support enquiry is exactly where somebody
 * pastes a token to be helpful.
 *
 * ── Validation ──────────────────────────────────────────────────────
 * Client-side, on submit rather than on keystroke, and each message is the
 * source document's own. Errors are tied to their field with
 * `aria-describedby` and the field carries `aria-invalid`, so the first
 * failure is announced rather than only outlined in red.
 */

const COUNTRIES = [
  "India",
  "Australia",
  "United States",
  "Ireland",
  "Middle East",
  "Other",
];

const HAIR = "#E0E0E6";
const MAX_MESSAGE = 1200;

type Fields = {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  enquiry: string;
  message: string;
  consent: boolean;
};

const EMPTY: Fields = {
  name: "",
  company: "",
  email: "",
  phone: "",
  country: "",
  enquiry: "",
  message: "",
  consent: false,
};

/** Deliberately permissive — this rejects typos, not unusual addresses. */
const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function labelFor(id: string) {
  return ENQUIRIES.find((e) => e.id === id)?.label ?? id;
}

const field =
  "w-full px-3.5 py-2.5 text-[14px] text-carbon bg-white rounded-lg outline-none transition-shadow duration-200 focus:ring-2 focus:ring-signal-orange/30";

function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block mb-1.5 text-[12px] font-semibold text-carbon"
    >
      {children}
      {required && <span className="text-signal-orange"> *</span>}
    </label>
  );
}

function Err({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={id} className="mt-1 text-[11.5px] text-[#E5484D]">
      {msg}
    </p>
  );
}

export function ContactForm() {
  const [f, setF] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>(
    {},
  );

  const set = <K extends keyof Fields>(k: K, v: Fields[K]) =>
    setF((p) => ({ ...p, [k]: v }));

  const ring = (k: keyof Fields) => ({
    boxShadow: `inset 0 0 0 1px ${errors[k] ? "#E5484D" : HAIR}`,
  });

  function send(e: React.FormEvent) {
    e.preventDefault();
    const next: Partial<Record<keyof Fields, string>> = {};
    if (!f.name.trim()) next.name = "Please enter your name.";
    if (!EMAIL_OK.test(f.email.trim()))
      next.email = "Please enter a valid email address.";
    if (!f.enquiry) next.enquiry = "Please choose an enquiry type.";
    if (!f.country) next.country = "Please select a country or region.";
    if (!f.message.trim())
      next.message = "Please add a short description of your requirement.";
    if (!f.consent) next.consent = "Please confirm before continuing.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const lines = [
      `Enquiry type: ${labelFor(f.enquiry)}`,
      `Name: ${f.name.trim()}`,
      f.company.trim() && `Company: ${f.company.trim()}`,
      `Email: ${f.email.trim()}`,
      f.phone.trim() && `Phone: ${f.phone.trim()}`,
      `Country / region: ${f.country}`,
      "",
      f.message.trim(),
    ].filter(Boolean) as string[];

    const subject = `${labelFor(f.enquiry)} enquiry — ${f.name.trim()}`;
    window.location.href =
      `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(lines.join("\n"))}`;
  }

  return (
    <form
      onSubmit={send}
      noValidate
      className="p-6 sm:p-7 bg-white"
      style={{
        borderRadius: 18,
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.04), 0 30px 60px -30px rgba(0,0,0,0.55)",
      }}
    >
      <p className="text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
        Send an enquiry
      </p>
      <p className="mt-2 text-[13px] leading-[1.5] text-graphite/55">
        Tell us the problem you want to solve and we will route it to the right
        team.
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
        <div>
          <Label htmlFor="c-name" required>
            Full name
          </Label>
          <input
            id="c-name"
            className={field}
            style={ring("name")}
            value={f.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "c-name-err" : undefined}
            autoComplete="name"
          />
          <Err id="c-name-err" msg={errors.name} />
        </div>

        <div>
          <Label htmlFor="c-company">Company</Label>
          <input
            id="c-company"
            className={field}
            style={ring("company")}
            value={f.company}
            onChange={(e) => set("company", e.target.value)}
            autoComplete="organization"
          />
        </div>

        <div>
          <Label htmlFor="c-email" required>
            Work email
          </Label>
          <input
            id="c-email"
            type="email"
            className={field}
            style={ring("email")}
            value={f.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "c-email-err" : undefined}
            autoComplete="email"
          />
          <Err id="c-email-err" msg={errors.email} />
        </div>

        <div>
          <Label htmlFor="c-phone">Phone number</Label>
          <input
            id="c-phone"
            type="tel"
            className={field}
            style={ring("phone")}
            value={f.phone}
            onChange={(e) => set("phone", e.target.value)}
            autoComplete="tel"
          />
        </div>

        <div>
          <Label htmlFor="c-enquiry" required>
            Enquiry type
          </Label>
          <select
            id="c-enquiry"
            className={field}
            style={ring("enquiry")}
            value={f.enquiry}
            onChange={(e) => set("enquiry", e.target.value)}
            aria-invalid={!!errors.enquiry}
            aria-describedby={errors.enquiry ? "c-enquiry-err" : undefined}
          >
            <option value="">Select</option>
            {ENQUIRIES.map((e) => (
              <option key={e.id} value={e.id}>
                {e.label}
              </option>
            ))}
          </select>
          <Err id="c-enquiry-err" msg={errors.enquiry} />
        </div>

        <div>
          <Label htmlFor="c-country" required>
            Country / region
          </Label>
          <select
            id="c-country"
            className={field}
            style={ring("country")}
            value={f.country}
            onChange={(e) => set("country", e.target.value)}
            aria-invalid={!!errors.country}
            aria-describedby={errors.country ? "c-country-err" : undefined}
          >
            <option value="">Select</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Err id="c-country-err" msg={errors.country} />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="c-message" required>
            What would you like to discuss?
          </Label>
          <textarea
            id="c-message"
            rows={4}
            maxLength={MAX_MESSAGE}
            className={field + " resize-y"}
            style={ring("message")}
            value={f.message}
            onChange={(e) => set("message", e.target.value)}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "c-message-err" : undefined}
          />
          <Err id="c-message-err" msg={errors.message} />
        </div>
      </div>

      <label className="mt-5 flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          className="mt-0.5 w-4 h-4 shrink-0 accent-[#FF6A00]"
          checked={f.consent}
          onChange={(e) => set("consent", e.target.checked)}
          aria-invalid={!!errors.consent}
          aria-describedby={errors.consent ? "c-consent-err" : undefined}
        />
        <span className="text-[12.5px] leading-[1.45] text-graphite/65">
          I agree that RAMS Digital may use these details to respond to this
          enquiry.
          <span className="text-signal-orange"> *</span>
        </span>
      </label>
      <Err id="c-consent-err" msg={errors.consent} />

      <button
        type="submit"
        className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-signal-orange text-white text-[15px] font-semibold px-7 py-3.5 rounded-full transition-all duration-200 hover:bg-signal-orange-hover"
      >
        Prepare enquiry
        <ArrowUpRight className="w-4 h-4" aria-hidden />
      </button>

    </form>
  );
}
