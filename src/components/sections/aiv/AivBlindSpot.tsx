"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The blind-spot interactive, inside the MHE sheet.
 *
 * Drag the worker around the truck and watch where they vanish for the
 * operator, then flip to "With AI Camera" and watch the wedges lift.
 *
 * ── The one number that matters ─────────────────────────────────────
 * `BLIND` is four angular wedges in degrees, clockwise from straight ahead:
 * behind the mast, and over each shoulder, plus the rear. Both the shaded
 * wedges and the verdict read from that same table, so the picture and the
 * words can never disagree — which is the whole point of the widget. The
 * "floor visible" figure is derived from it too (360 minus the summed spans),
 * never typed in.
 *
 * The wedge spans are indicative of a seated counterbalance operator with a
 * standard mast and a loaded pallet; the note under the readout says so, and it
 * stays.
 */

const BLIND: [number, number][] = [
  [345, 15],
  [110, 145],
  [215, 250],
  [170, 190],
];
const C = 200;
const R = 196;

const norm = (d: number) => ((d % 360) + 360) % 360;
const span = (w: [number, number]) => norm(w[1] - w[0]);

/** Total floor the operator can see, once the four wedges are taken out. */
const VISIBLE_PCT = Math.round(100 - (BLIND.reduce((n, w) => n + span(w), 0) / 360) * 100);

const polar = (deg: number, r: number): [number, number] => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [C + Math.cos(a) * r, C + Math.sin(a) * r];
};

/** One wedge as a pie slice from the truck's centre out to the edge. */
const wedgePath = (w: [number, number]) => {
  const s = span(w);
  const [x0, y0] = polar(w[0], R);
  const [x1, y1] = polar(w[1], R);
  return `M${C} ${C} L${x0.toFixed(1)} ${y0.toFixed(1)} A${R} ${R} 0 ${s > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z`;
};

const inBlind = (d: number) => {
  const a = norm(d);
  return BLIND.some(([l0, h0]) => {
    const l = norm(l0);
    const h = norm(h0);
    return l < h ? a >= l && a <= h : a >= l || a <= h;
  });
};

export function AivBlindSpot() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [deg, setDeg] = useState(205);
  const [seen, setSeen] = useState(false);
  const [radius, setRadius] = useState(0);
  const dragging = useRef(false);

  // The worker orbits at 40% of the rendered stage width, so the widget scales
  // with its container rather than assuming the 460px maximum.
  useEffect(() => {
    const measure = () => setRadius((stageRef.current?.clientWidth ?? 0) * 0.4);
    measure();
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, []);

  const fromEvent = useCallback((e: { clientX: number; clientY: number }) => {
    const el = stageRef.current;
    if (!el) return;
    const b = el.getBoundingClientRect();
    const a = Math.atan2(e.clientY - (b.top + b.height / 2), e.clientX - (b.left + b.width / 2));
    setDeg((a * 180) / Math.PI + 90);
  }, []);

  const blind = inBlind(deg);
  const rad = ((deg - 90) * Math.PI) / 180;

  return (
    <div className="bs-card">
      <p className="bs-h">You can’t see them. It can.</p>
      <p className="bs-p">
        Drag the worker around the truck and watch where they disappear for the operator.
      </p>

      <div className={"bs" + (seen ? " seen" : "")}>
        <div
          className="bs-stage"
          ref={stageRef}
          onPointerDown={(e) => {
            dragging.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            fromEvent(e);
          }}
          onPointerMove={(e) => dragging.current && fromEvent(e)}
          onPointerUp={() => (dragging.current = false)}
          onPointerCancel={() => (dragging.current = false)}
        >
          <svg className="bs-svg" viewBox="0 0 400 400" aria-hidden>
            <defs>
              <radialGradient id="aiv-camwash" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00c8ff" stopOpacity=".30" />
                <stop offset="100%" stopColor="#00c8ff" stopOpacity="0" />
              </radialGradient>
            </defs>
            <g className="bs-grid">
              <path d="M0 100H400M0 200H400M0 300H400M100 0V400M200 0V400M300 0V400" />
            </g>
            <circle className="bs-cover" cx="200" cy="200" r="168" fill="url(#aiv-camwash)" />
            <g className="bs-blind">
              {BLIND.map((w, i) => (
                <path key={i} d={wedgePath(w)} />
              ))}
            </g>
            <g className="bs-truck">
              <rect x="172" y="176" width="56" height="86" rx="7" />
              <rect x="178" y="126" width="44" height="52" rx="4" className="bs-mast" />
              <rect x="184" y="96" width="8" height="36" rx="3" className="bs-fork" />
              <rect x="208" y="96" width="8" height="36" rx="3" className="bs-fork" />
              <circle cx="200" cy="212" r="9" className="bs-seat" />
            </g>
            <g className="bs-unit">
              <rect x="168" y="168" width="11" height="11" rx="2" />
              <rect x="221" y="168" width="11" height="11" rx="2" />
            </g>
          </svg>

          <div
            className="bs-worker"
            role="slider"
            tabIndex={0}
            aria-label="Worker position around the truck"
            aria-valuemin={0}
            aria-valuemax={359}
            aria-valuenow={Math.round(norm(deg))}
            style={{
              transform: `translate(${Math.cos(rad) * radius}px, ${Math.sin(rad) * radius}px)`,
            }}
            onKeyDown={(e) => {
              const k = { ArrowLeft: -6, ArrowRight: 6, ArrowUp: 6, ArrowDown: -6 }[e.key];
              if (k === undefined) return;
              e.preventDefault();
              setDeg((d) => d + k);
            }}
          >
            <span className="bs-dot" />
            <span className="bs-tag">PED-014</span>
          </div>

          <div className={"bs-verdict" + (seen || !blind ? " ok" : "")}>
            {seen ? "DETECTED · TRACKED" : blind ? "UNSEEN BY OPERATOR" : "IN OPERATOR’S VIEW"}
          </div>
        </div>

        <div>
          <div className="bs-toggle" role="tablist">
            <button
              type="button"
              role="tab"
              className={seen ? "" : "on"}
              aria-selected={!seen}
              onClick={() => setSeen(false)}
            >
              Operator only
            </button>
            <button
              type="button"
              role="tab"
              className={seen ? "on" : ""}
              aria-selected={seen}
              onClick={() => setSeen(true)}
            >
              With AI Camera
            </button>
          </div>

          <dl className="bs-read">
            <div>
              <dt>Floor visible to operator</dt>
              <dd>
                {seen ? 100 : VISIBLE_PCT}
                <em>%</em>
              </dd>
            </div>
            <div>
              <dt>Worker bearing</dt>
              <dd>
                {Math.round(norm(deg))}
                <em>°</em>
              </dd>
            </div>
            <div>
              <dt>Detection</dt>
              <dd>{seen ? <>PED-014 <em>98%</em></> : "—"}</dd>
            </div>
          </dl>

          <p className="bs-note">
            Wedges are indicative of a seated counterbalance operator with a standard mast and a
            loaded pallet. Actual coverage varies by truck and load.
          </p>
        </div>
      </div>
    </div>
  );
}
