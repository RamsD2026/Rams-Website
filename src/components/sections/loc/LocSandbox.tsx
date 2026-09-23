"use client";

import { useCallback, useRef, useState } from "react";
import { Head, Reveal } from "@/components/sections/hardware/hw-shared";
import { LocPlan } from "./LocPlan";
import {
  ORDER, SCALE_TICKS, TECH, coarsestTechFor, scaleAccAt, scaleBuysAt, scaleMarkPct,
  type TechKey,
} from "./loc-data";

/**
 * 03 — the accuracy sandbox. The centrepiece.
 *
 * Four tabs, one floor, one truck. The circle around the truck is the selected
 * technology's accuracy drawn to scale on 48 × 28 m of warehouse, so switching
 * from LiDAR to Wi-Fi swallows two aisles in front of you and no one has to be
 * told what "5–15 m" means. The reader can drag the truck anywhere on the floor,
 * which is the moment the picture stops being a diagram: park the Bluetooth
 * circle next to a rack and it plainly covers four of them.
 *
 * The strip underneath places the same number on a log scale from 10 mm to 15 m,
 * labelled by what it buys — which millimetre, which slot, which rack, which
 * aisle, which zone.
 *
 * ── The strip is draggable, and the direction is the argument ───────
 * Dragging the marker asks the page the question the deck actually poses: how
 * precise does *your* use case need to be? The answer is `coarsestTechFor` —
 * the least infrastructure that clears that bar, not the most accurate sensor
 * on the page. Drag to "which aisle" and it lands on Bluetooth, because paying
 * for LiDAR to find an aisle is the mistake this section exists to prevent.
 *
 * The marker is its own state rather than a function of the selected tab, and
 * that is deliberate. If the tab drove the marker while the marker drove the
 * tab, dragging to 1 m would select UWB, which would snap the marker back to
 * 20 cm and out from under the pointer. So: a tab click moves the marker, a
 * drag moves the tabs, and neither writes back. The `left` transition is
 * dropped while dragging or the marker would trail the finger by half a
 * second.
 *
 * Everything shown comes from `TECH` in `loc-data.ts`, including the badge that
 * separates the one technology we run today from the three we pilot first.
 */
export function LocSandbox() {
  const [key, setKey] = useState<TechKey>("lidar");
  /* The precision the reader is asking for, in metres. Seeded from the opening
     tab so the strip reads correctly before anyone touches it. */
  const [need, setNeed] = useState(TECH.lidar.acc);
  const [dragging, setDragging] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const [manual, setManual] = useState(false);
  /* Bumped to hand the truck back to its route; `LocPlan` owns the position. */
  const [resume, setResume] = useState(0);

  const T = TECH[key];
  const pct = scaleMarkPct(need);
  const buys = scaleBuysAt(need);

  /* A position on the bar becomes a required precision, and the precision picks
     the technology. Never the other way round — see the note above. */
  const applyPct = useCallback((next: number) => {
    const acc = scaleAccAt(next);
    setNeed(acc);
    setKey(coarsestTechFor(acc));
  }, []);

  const setFromX = useCallback((clientX: number) => {
    const el = barRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0) return;
    applyPct(((clientX - r.left) / r.width) * 100);
  }, [applyPct]);

  const nudgeTo = applyPct;

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 3;
    const to =
      e.key === "ArrowLeft" || e.key === "ArrowDown" ? pct - step
      : e.key === "ArrowRight" || e.key === "ArrowUp" ? pct + step
      : e.key === "Home" ? 0
      : e.key === "End" ? 100
      : null;
    if (to === null) return;
    e.preventDefault();
    applyPct(Math.max(0, Math.min(100, to)));
  };

  return (
    <section className="section white" id="accuracy">
      <div className="wrap">
        <Head
          label="See it"
          top="How precise do you"
          bottom="actually need to be?"
          intro="Pick a technology and watch the circle around the truck. The smaller the circle, the more you can do with it — and the more kit it takes to get there."
        />

        <Reveal className="sandbox">
          <div className="sb-stage">
            <div className="sb-tabs" role="group" aria-label="Positioning technology">
              {ORDER.map((k) => (
                <button
                  key={k}
                  type="button"
                  className="sb-tab"
                  aria-pressed={key === k}
                  style={{ "--dot": TECH[k].colour } as React.CSSProperties}
                  onClick={() => {
                    setKey(k);
                    setNeed(TECH[k].acc);
                  }}
                >
                  <i />
                  {TECH[k].name}
                </button>
              ))}
            </div>

            <figure className="plan-frame">
              <LocPlan
                tech={key}
                drag
                onManual={setManual}
                resumeToken={resume}
                role="img"
                label="Warehouse plan showing the accuracy circle, tags and fixed anchors for the selected technology. Drag the truck to move it."
              />
            </figure>

            <div className="sb-under">
              <span className="sb-hint">Drag the truck anywhere on the floor</span>
              {manual && (
                <button type="button" className="link sb-resume" onClick={() => setResume((n) => n + 1)}>
                  Drive again
                </button>
              )}
            </div>

            <div className="sb-legend">
              <span className="d1">Where the truck really is</span>
              <span className="d2">Where the system thinks it is</span>
              {T.infraName && (
                <span>
                  <i style={{ background: T.colour }} />
                  {T.infraName} on the walls
                </span>
              )}
            </div>
          </div>

          <aside className="sb-read" aria-live="polite">
            <span className={"badge " + (T.live ? "live" : "pilot")}>{T.badge}</span>
            <h3>{T.name}</h3>
            <p className="sub">{T.sub}</p>
            <p className="sb-acc">
              {T.accTxt}
              <small>{T.accUnit}</small>
            </p>
            <p className="sb-can">{T.can}</p>
            <ul className="sb-facts">
              <li>
                <b>Tags</b>
                <span>{T.tags}</span>
              </li>
              <li>
                <b>Fixed kit</b>
                <span>{T.infra}</span>
              </li>
              <li>
                <b>Updates</b>
                <span>{T.rate}</span>
              </li>
              <li>
                <b>Good for</b>
                <span>{T.forTxt}</span>
              </li>
            </ul>
          </aside>
        </Reveal>

        <Reveal className="scale">
          <div
            className="scale-bar"
            ref={barRef}
            onPointerDown={(e) => {
              /* Same convention as the draggable truck in `LocPlan`: capture on
                 the element so a fast drag that leaves the bar keeps tracking. */
              e.currentTarget.setPointerCapture(e.pointerId);
              setDragging(true);
              setFromX(e.clientX);
            }}
            onPointerMove={(e) => dragging && setFromX(e.clientX)}
            onPointerUp={(e) => {
              e.currentTarget.releasePointerCapture(e.pointerId);
              setDragging(false);
            }}
            onPointerCancel={() => setDragging(false)}
          >
            <span
              className={"scale-mark" + (dragging ? " dragging" : "")}
              style={{ left: pct.toFixed(1) + "%" }}
              role="slider"
              tabIndex={0}
              aria-label="How precise do you need to be?"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pct)}
              aria-valuetext={`${buys.b} — ${buys.s.toLowerCase()}`}
              onKeyDown={onKey}
            />
          </div>
          <div className="scale-ticks">
            {SCALE_TICKS.map((t) => (
              <button
                key={t.b}
                type="button"
                style={{ left: t.left + "%" }}
                onClick={() => nudgeTo(t.left)}
                aria-label={`${t.b} — ${t.s.toLowerCase()}`}
              >
                <b>{t.b}</b>
                {t.s}
              </button>
            ))}
          </div>

          {/* What the current position actually means, in a sentence. Without
              this the strip is a control with no readout. */}
          <p className="scale-read" aria-live="polite">
            Need to know <b>{buys.s.toLowerCase()}</b>? The cheapest thing that gets you there is{" "}
            <b style={{ color: TECH[key].colour }}>{TECH[key].name}</b>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
