"use client";

import { useEffect, useRef } from "react";
import { Media } from "./aiv-shared";
import { AivBlindSpot } from "./AivBlindSpot";
import type { UseCase } from "./aiv-data";

/**
 * The full-screen use-case sheet.
 *
 * One template, four fillings: hero media → the problem → what it sees / what
 * it does → what changes → context photo → CTA, with the blind-spot
 * interactive dropped into the MHE sheet only.
 *
 * ── The accessibility contract, which is most of this file ──────────
 * It is a modal dialog, so it owes the reader four things, all of which the
 * reference implemented by hand and all of which are kept:
 *
 *   · focus moves into the panel on open and returns to whatever opened it on
 *     close — otherwise a keyboard reader is dumped at the top of the document;
 *   · Tab cycles inside the panel and cannot escape to the page behind;
 *   · Escape closes it;
 *   · the page behind does not scroll while it is open.
 *
 * The body scroll lock is the one piece that differs. The reference sets
 * `overflow:hidden` on `<body>`; this pins `position:fixed` with the scroll
 * offset held in a ref and restored on close, because on iOS Safari
 * `overflow:hidden` alone does not stop the background scrolling behind a
 * fixed overlay.
 */
export function AivSheet({
  uc,
  open,
  onClose,
}: {
  uc: UseCase;
  open: boolean;
  onClose: () => void;
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
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };
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
        root.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"]),summary',
        ),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
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

  const headingId = "aiv-sh-" + uc.key;

  return (
    <div
      className="aiv-sheet open"
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
    >
      <button className="sheet-back" onClick={onClose} aria-label="Close" tabIndex={-1} />

      <article className="sheet-panel" ref={panelRef}>
        <button ref={closeRef} className="sheet-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 14 14">
            <path d="M1 1l12 12M13 1L1 13" />
          </svg>
        </button>

        <Media
          src={uc.sheet.img}
          alt={uc.sheet.alt}
          label={uc.sheet.label}
          hud={uc.sheet.nohud ? undefined : uc.sheet.hud}
        />

        <div className="sheet-body">
          <span className="label">{uc.label}</span>
          <h2 id={headingId}>{uc.sheetTitle}</h2>
          <p className="intro">{uc.intro}</p>

          <div className="sheet-grid">
            <div className="card">
              <h3>What it sees</h3>
              <div className="pills">
                {uc.sees.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>
            <div className="card">
              <h3>What it does</h3>
              <div className="pills">
                {uc.does.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>
          </div>

          {uc.blindSpot && <AivBlindSpot />}

          <h3 className="sheet-h">What changes</h3>
          <ul className="outcomes">
            {uc.outcomes.map((o) => (
              <li key={o.t}>
                {o.t}
                <span>{o.s}</span>
              </li>
            ))}
          </ul>

          <div className="ctx">
            <Media src={uc.ctx.img} alt={uc.ctx.alt} label={uc.ctx.label} tone="light" />
            <div>
              <h3 className="sheet-h" style={{ marginTop: 0 }}>
                {uc.ctx.title}
              </h3>
              <p>{uc.ctx.body}</p>
              {uc.ctx.fitlist && (
                <ul className="fitlist">
                  {uc.ctx.fitlist.map((f) => (
                    <li key={f.b}>
                      <b>{f.b}</b>
                      <span>{f.s}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="sheet-cta">
            <p>{uc.cta.line}</p>
            <a className="btn btn-primary" href={uc.cta.mail}>
              Book an assessment
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
