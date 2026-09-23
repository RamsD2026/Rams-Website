"use client";

import { useEffect, useRef } from "react";
import { Media } from "@/components/sections/hardware/hw-shared";
import { StageBadge, StageRail } from "./GiShared";
import { INFO, type Sheet } from "./gi-data";
import type { InsideView } from "./GiInside";

/**
 * The machine sheet — one full-screen panel per machine.
 *
 * One template, two fillings: product shot → what it is → how it helps → what it
 * looks at → context photo → **what we're building** → the stage rail → CTA.
 *
 * ── Where a spec sheet would be ─────────────────────────────────────
 * "What we're building" is not a euphemism for a spec table with the numbers
 * taken out; it is a different table. Every row says how something will work
 * rather than how well, and the last row says outright that the specification is
 * not published because it is a concept. The stage rail under it repeats the
 * point in a picture. This is the page's central honesty rule made structural —
 * there is no slot here for a figure to creep into.
 *
 * The accessibility contract is the OmniBox sheet's, unchanged: focus moves in
 * and returns, Tab is trapped, Escape closes, and the page behind is pinned with
 * `position: fixed` rather than `overflow: hidden`, because iOS Safari ignores
 * the latter behind a fixed overlay.
 */
export function GiSheet({
  sheet,
  open,
  onClose,
  onInside,
}: {
  sheet: Sheet;
  open: boolean;
  onClose: () => void;
  onInside: (k: Sheet["key"], view?: InsideView) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);
  const scrollY = useRef(0);

  useEffect(() => {
    if (!open) return;
    restoreFocus.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });

    scrollY.current = window.scrollY;
    const body = document.body;
    const prev = { position: body.style.position, top: body.style.top, width: body.style.width };
    body.style.position = "fixed";
    body.style.top = `-${scrollY.current}px`;
    body.style.width = "100%";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const root = panelRef.current;
      if (!root) return;
      const f = Array.from(
        root.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"]),summary'),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      window.scrollTo(0, scrollY.current);
      restoreFocus.current?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  if (!open) return null;

  const headingId = "gi-sh-" + sheet.key;

  return (
    <div className="hw-sheet open" role="dialog" aria-modal="true" aria-labelledby={headingId}>
      <button className="sheet-back" onClick={onClose} aria-label="Close" tabIndex={-1} />

      <article className="sheet-panel" ref={panelRef}>
        <button ref={closeRef} className="sheet-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 14 14">
            <path d="M1 1l12 12M13 1L1 13" />
          </svg>
        </button>

        <Media src={sheet.hero} alt={sheet.heroAlt} label={sheet.hero} className="contain" tone="light" />

        <div className="sheet-body">
          <span className="label">
            {INFO[sheet.key].name} <StageBadge machine={sheet.key} />
          </span>
          <h2 id={headingId}>{sheet.title}</h2>
          <p className="intro">{sheet.intro}</p>

          <h3 className="sheet-h">How it helps</h3>
          <ul className="outcomes">
            {sheet.outcomes.map((o) => (
              <li key={o.t}>
                {o.t}
                <span>{o.s}</span>
              </li>
            ))}
          </ul>

          <h3 className="sheet-h">What it looks at</h3>
          <ul className="connects">
            {sheet.looks.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <button
            type="button"
            className="link conn-link"
            onClick={() => {
              onClose();
              onInside(sheet.key, "scan");
            }}
          >
            Watch it scan in 3D
          </button>

          <div className="ctx">
            <Media src={undefined} alt={sheet.ctx.alt} label={sheet.ctx.img} />
            <div>
              <h3 className="sheet-h" style={{ marginTop: 0 }}>
                {sheet.ctx.title}
              </h3>
              <p>{sheet.ctx.body}</p>
            </div>
          </div>

          {/* Not "The short spec". See the note at the head of this file. */}
          <h3 className="sheet-h">What we’re building</h3>
          <dl className="sspecs">
            {sheet.building.map(([dt, dd]) => (
              <div key={dt}>
                <dt>{dt}</dt>
                <dd>{dd}</dd>
              </div>
            ))}
          </dl>

          <StageRail machine={sheet.key} />

          <div className="sheet-cta">
            <p>{sheet.ctaLine}</p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                onClose();
                onInside(sheet.key);
              }}
            >
              See inside
            </button>
            <a className="btn btn-primary" href={sheet.mail}>
              Tell us what to look at
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
