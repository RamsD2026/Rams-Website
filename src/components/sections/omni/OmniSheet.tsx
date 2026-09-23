"use client";

import { useEffect, useRef } from "react";
import { Media } from "@/components/sections/hardware/hw-shared";
import type { Model, ModelKey } from "./omni-data";

/**
 * The model sheet — one full-screen panel per OmniBox.
 *
 * One template, four fillings: product hero → the problem it solves → how it
 * helps → what connects to it (or what it can check) → context photo → the
 * short spec → CTA. Core has no spec sheet, so it shows its four-step process
 * where the others show specs; that is the reference's own choice, not a gap.
 *
 * The accessibility contract is the same as the AI Vision sheet's and for the
 * same reasons: focus moves in and returns, Tab is trapped, Escape closes, and
 * the page behind is pinned with `position: fixed` rather than
 * `overflow: hidden` because iOS Safari ignores the latter behind a fixed
 * overlay.
 */
export function OmniSheet({
  model,
  open,
  onClose,
  onInside,
}: {
  model: Model;
  open: boolean;
  onClose: () => void;
  onInside: (key: ModelKey, view?: "inside" | "connect") => void;
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
        root.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"]),summary',
        ),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
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

  const s = model.sheet;
  const headingId = "omni-sh-" + model.key;

  return (
    <div className="hw-sheet open" role="dialog" aria-modal="true" aria-labelledby={headingId}>
      <button className="sheet-back" onClick={onClose} aria-label="Close" tabIndex={-1} />

      <article className="sheet-panel" ref={panelRef}>
        <button ref={closeRef} className="sheet-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 14 14">
            <path d="M1 1l12 12M13 1L1 13" />
          </svg>
        </button>

        <Media src={s.hero} alt={model.name} label={s.hero} className="contain" tone="light" />

        <div className="sheet-body">
          <span className="label">{model.name}</span>
          <h2 id={headingId}>{s.title}</h2>
          <p className="intro">{s.intro}</p>

          <h3 className="sheet-h">How it helps</h3>
          <ul className="outcomes">
            {s.outcomes.map((o) => (
              <li key={o.t}>
                {o.t}
                <span>{o.s}</span>
              </li>
            ))}
          </ul>

          {s.connects && (
            <>
              <h3 className="sheet-h">What connects to it</h3>
              <ul className="connects">
                {s.connects.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <button
                type="button"
                className="link conn-link"
                onClick={() => {
                  onClose();
                  onInside(model.key, "connect");
                }}
              >
                See it connected in 3D
              </button>
            </>
          )}

          {s.pills && (
            <>
              <h3 className="sheet-h">{s.pills.heading}</h3>
              <div className="pills" style={{ marginTop: 22 }}>
                {s.pills.items.map((p) => (
                  <span key={p}>{p}</span>
                ))}
              </div>
            </>
          )}

          {s.ctx && (
            <div className="ctx">
              <Media
                src={s.ctx.img}
                alt={s.ctx.alt}
                label={s.ctx.img}
                tone={s.ctx.light ? "light" : "dark"}
              />
              <div>
                <h3 className="sheet-h" style={{ marginTop: 0 }}>
                  {s.ctx.title}
                </h3>
                <p>{s.ctx.body}</p>
              </div>
            </div>
          )}

          {s.steps && (
            <>
              <h3 className="sheet-h">How it works</h3>
              <ol className="steps">
                {s.steps.map((st) => (
                  <li key={st.b}>
                    <b>{st.b}</b>
                    <span>{st.s}</span>
                  </li>
                ))}
              </ol>
            </>
          )}

          {s.specs && (
            <>
              <h3 className="sheet-h">The short spec</h3>
              <dl className="sspecs">
                {s.specs.map(([dt, dd]) => (
                  <div key={dt}>
                    <dt>{dt}</dt>
                    <dd>{dd}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}

          <div className="sheet-cta">
            <p>{s.ctaLine}</p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                onClose();
                onInside(model.key);
              }}
            >
              See inside
            </button>
            <a className="btn btn-primary" href={s.mail}>
              {model.key === "core" ? "Start a Core project" : "Talk to us"}
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
