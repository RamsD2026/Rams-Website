"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import {
  DIAL_COUNTRIES,
  countryByIso,
  type DialCountry,
} from "./dial-codes";

/**
 * The phone field: a country picker and a number, in one shell.
 *
 * ── Why this is not a `<select>` ────────────────────────────────────
 * A native select shows the selected option's own text when closed, so a list
 * useful enough to pick from — `India +91` — is also what sits in the field,
 * and on a half-width field that leaves barely any room to type the number.
 * The pattern every modern form uses instead is asymmetric: **closed it shows
 * only the flag and the dial code**; **open it shows the country names**. A
 * select cannot do that, so this is a button plus a listbox.
 *
 * ── What it gives back ──────────────────────────────────────────────
 * The ISO code, not the dial code, because several countries share one (+1 is
 * the US and Canada both). The form turns it into a dial code when it writes
 * the enquiry.
 *
 * ── Keyboard and pointer ────────────────────────────────────────────
 * Escape closes and returns focus to the button. A click anywhere outside
 * closes. The list is a real `listbox` with `option` rows and
 * `aria-selected`, and opening it focuses the search box, so a keyboard user
 * types two letters and hits Enter rather than arrowing through a hundred
 * countries.
 */

/**
 * The flag: a 40px-wide PNG from `/public/flags`, one per country in
 * `DIAL_COUNTRIES`, 124KB for the set.
 *
 * It was a regional-indicator emoji first, which costs nothing to ship — but
 * Windows has no flag glyphs in its emoji font and draws the two characters
 * as the country's letters instead, so on the machines most of these visitors
 * use there was no flag at all. The images are served from this origin rather
 * than a flag CDN: no third-party request from a contact form, and nothing to
 * break the day that CDN moves.
 *
 * `alt` is empty because the country name sits next to it in the list, and
 * the button already carries the country in its `aria-label`. If an image
 * fails, the ISO letters underneath it show through.
 */
function Flag({ iso }: { iso: string }) {
  return (
    <span className="relative w-5 h-[14px] shrink-0 overflow-hidden rounded-[2px] bg-[#F1F1F4]">
      <span className="absolute inset-0 flex items-center justify-center text-[7px] font-semibold tracking-tight text-graphite/55">
        {iso}
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/flags/${iso.toLowerCase()}.png`}
        alt=""
        width={20}
        height={14}
        loading="lazy"
        decoding="async"
        className="relative w-full h-full object-cover"
      />
    </span>
  );
}

export function PhoneField({
  iso,
  onIso,
  phone,
  onPhone,
  hair,
  ringStyle,
}: {
  iso: string;
  onIso: (iso: string) => void;
  phone: string;
  onPhone: (v: string) => void;
  hair: string;
  ringStyle: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = countryByIso(iso);

  const q = query.trim().toLowerCase();
  const matches: DialCountry[] = q
    ? DIAL_COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.dial.includes(q) ||
          c.iso.toLowerCase() === q,
      )
    : DIAL_COUNTRIES;

  useEffect(() => {
    if (!open) return;

    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };

    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    searchRef.current?.focus();

    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (c: DialCountry) => {
    onIso(c.iso);
    setOpen(false);
    setQuery("");
    buttonRef.current?.focus();
  };

  return (
    <div ref={wrapRef} className="relative">
      <div
        className="flex items-stretch bg-white rounded-lg"
        style={ringStyle}
      >
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen(!open)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={`Country code: ${selected.name} ${selected.dial}`}
          className="shrink-0 flex items-center gap-1.5 pl-3.5 pr-3 py-2.5 rounded-l-lg text-carbon outline-none focus-visible:ring-2 focus-visible:ring-signal-orange/30"
        >
          <Flag iso={selected.iso} />
          <ChevronDown
            className={
              "w-3.5 h-3.5 text-graphite/45 transition-transform duration-200 " +
              (open ? "rotate-180" : "")
            }
            aria-hidden
          />
          <span className="text-[14px] text-carbon tabular-nums">
            {selected.dial}
          </span>
        </button>

        <span
          aria-hidden
          className="w-px my-2 shrink-0"
          style={{ background: hair }}
        />

        <input
          id="c-phone"
          type="tel"
          inputMode="tel"
          placeholder="00000 00000"
          className="w-full min-w-0 px-3.5 py-2.5 text-[14px] text-carbon bg-transparent rounded-r-lg outline-none placeholder:text-graphite/35 focus:ring-2 focus:ring-signal-orange/30"
          value={phone}
          onChange={(e) => onPhone(e.target.value)}
          autoComplete="tel-national"
        />
      </div>

      {open && (
        <div
          className="absolute left-0 top-[calc(100%+6px)] z-30 w-[300px] max-w-[calc(100vw-48px)] rounded-lg bg-white overflow-hidden"
          style={{
            border: `1px solid ${hair}`,
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.04), 0 24px 48px -24px rgba(0,0,0,0.45)",
          }}
        >
          <div
            className="flex items-center gap-2 px-3 py-2.5"
            style={{ borderBottom: `1px solid ${hair}` }}
          >
            <Search className="w-3.5 h-3.5 text-graphite/40" aria-hidden />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country"
              aria-label="Search country"
              className="w-full text-[13px] text-carbon bg-transparent outline-none placeholder:text-graphite/35"
            />
          </div>

          <ul
            role="listbox"
            aria-label="Country dialling code"
            className="max-h-[240px] overflow-y-auto py-1"
          >
            {matches.map((c) => {
              const active = c.iso === selected.iso;
              return (
                <li key={c.iso}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => choose(c)}
                    className={
                      "w-full flex items-center gap-2.5 px-3 py-2 text-left text-[13px] transition-colors duration-150 " +
                      (active
                        ? "bg-signal-orange/[0.08] text-carbon"
                        : "text-graphite hover:bg-[#F5F5F7]")
                    }
                  >
                    <Flag iso={c.iso} />
                    <span className="flex-1 truncate">{c.name}</span>
                    <span className="text-graphite/50 tabular-nums">
                      {c.dial}
                    </span>
                  </button>
                </li>
              );
            })}

            {matches.length === 0 && (
              <li className="px-3 py-3 text-[13px] text-graphite/50">
                No country matches “{query}”.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
