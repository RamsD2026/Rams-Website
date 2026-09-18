"use client";

import { useEffect, useRef } from "react";
import { Media } from "@/components/sections/hardware/hw-shared";
import { SHEET_DEVICE, type LidarMode, type Sheet } from "./sst-data";
import type { DevKey } from "./sst-3d";

/**
 * The sensor sheet — one full-screen panel per sensor.
 *
 * One template, four fillings: product shot → what it is → how it helps → what
 * it does or records → context photo → the short spec → CTA. Pallet Detection
 * and Battery Management carry no spec table; the reference leaves them out
 * because there is nothing quotable to put in one, which is the same reason the
 * battery block has no figures.
 *
 * The accessibility contract is the Omnibox sheet's, unchanged and for the same
 * reasons: focus moves in and returns, Tab is trapped, Escape closes, and the
 * page behind is pinned with `position: fixed` rather than `overflow: hidden`,
 * because iOS Safari ignores the latter behind a fixed overlay.
 *
 * Both of its outbound buttons leave the sheet first and then move the page —
 * "See it in 3D" to the hardware viewer on that device, and the jump link to
 * the access demo or to the LiDAR showcase on the matching answer. A sheet that
 * scrolls the page behind itself and stays open is disorienting.
 */
export function SstSheet({
  sheet,
  open,
  onClose,
  onHw,
  onLidar,
  onGoto,
}: {
  sheet: Sheet;
  open: boolean;
  onClose: () => void;
  onHw: (k: DevKey) => void;
  onLidar: (m: LidarMode) => void;
  onGoto: (id: string) => void;
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

  const headingId = "sst-sh-" + sheet.key;

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
          <span className="label">{sheet.label}</span>
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

          <h3 className="sheet-h">{sheet.does.heading}</h3>
          <ul className="connects">
            {sheet.does.items.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>

          {sheet.jump && (
            <button
              type="button"
              className="link conn-link"
              onClick={() => {
                onClose();
                if ("lidar" in sheet.jump!) onLidar(sheet.jump!.lidar as LidarMode);
                else onGoto((sheet.jump as { to: string }).to);
              }}
            >
              {sheet.jump.label}
            </button>
          )}

          {sheet.ctx && (
            <div className="ctx">
              <Media src={sheet.ctx.img} alt={sheet.ctx.alt} label={sheet.ctx.img} />
              <div>
                <h3 className="sheet-h" style={{ marginTop: 0 }}>
                  {sheet.ctx.title}
                </h3>
                <p>{sheet.ctx.body}</p>
              </div>
            </div>
          )}

          {sheet.specs && (
            <>
              <h3 className="sheet-h">The short spec</h3>
              <dl className="sspecs">
                {sheet.specs.map(([dt, dd]) => (
                  <div key={dt}>
                    <dt>{dt}</dt>
                    <dd>{dd}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}

          <div className="sheet-cta">
            <p>{sheet.ctaLine}</p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                onClose();
                onHw(SHEET_DEVICE[sheet.key]);
              }}
            >
              See it in 3D
            </button>
            <a className="btn btn-primary" href={sheet.mail}>
              Talk to us
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
