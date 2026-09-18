"use client";

import { useEffect, useRef, useState } from "react";
import { Head, HudClock } from "@/components/sections/hardware/hw-shared";
import { SUA_STEPS } from "./aiv-data";

/**
 * 04 — See → Understand → Act.
 *
 * A 330vh track with a pinned panel: the step list on the left dims to the
 * active one while a single SVG scene gains a layer per step. Layer visibility
 * is pure CSS keyed off `data-step` on the panel (`.s-l1`/`.s-l2`/`.s-l3`, plus
 * `.s-only12` for the bits that must disappear once the breach fires), so this
 * component only has to decide which of the three numbers is current.
 *
 * The scene: two workers on a press line. Step 1 boxes them both. Step 2 adds
 * the hazard zone and a predicted track with an ETA. Step 3 walks worker A into
 * the zone, swaps their teal box for a red breach box and files the event card.
 *
 * Under `prefers-reduced-motion` the track collapses (CSS) and the panel parks
 * on step 3 — the finished state, so the reader sees the whole story at once
 * rather than a scene missing two thirds of its layers.
 */
export function AivHow() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);

  useEffect(() => {
    // Reduced motion parks on step 3 — the finished state — so the whole story
    // is visible at once instead of a scene missing two of its three layers.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setStep(3));
      return () => cancelAnimationFrame(id);
    }

    const update = () => {
      const el = trackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const k = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
      setStep(k < 0.33 ? 1 : k < 0.66 ? 2 : 3);
    };

    // The first read is deferred to a frame callback for the same reason as in
    // `layout/Header.tsx`: a synchronous setState in the effect body cascades a
    // second render before paint.
    const first = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section className="white" id="how" style={{ scrollMarginTop: "var(--nav-h)" }}>
      <div className="section" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          <Head
            center
            label="How it works"
            top="It doesn’t just record."
            bottom="It responds."
            intro="Cameras have watched factories for decades. This one understands what it is looking at, and does something about it before anyone reviews the footage."
          />
        </div>
      </div>

      <div className="sua" ref={trackRef}>
        <div className="sua-sticky">
          <ol className="sua-steps">
            {SUA_STEPS.map((s, i) => (
              <li key={s.n} className={"sua-step" + (step === i + 1 ? " on" : "")}>
                <span className="n">{s.n}</span>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </li>
            ))}
          </ol>

          <div className="sua-panel" data-step={step}>
            <svg
              className="sua-svg"
              viewBox="0 0 640 480"
              role="img"
              aria-label="Illustration: the camera detects two workers, predicts one entering a hazard zone, then raises a zone breach event"
            >
              <defs>
                <pattern
                  id="aiv-hatch"
                  width="16"
                  height="16"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(45)"
                >
                  <rect width="8" height="16" fill="#FFC107" />
                </pattern>
                <linearGradient id="aiv-floorG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#16191d" />
                  <stop offset="1" stopColor="#2a2e34" />
                </linearGradient>
              </defs>

              <rect width="640" height="480" fill="url(#aiv-floorG)" />
              <rect width="640" height="160" fill="#0f1114" />
              <g stroke="#30353c" strokeWidth="1">
                <path d="M320 150 L-320 480 M320 150 L-40 480 M320 150 L180 480 M320 150 L460 480 M320 150 L700 480 M320 150 L960 480" />
                <path d="M0 200 H640 M0 256 H640 M0 330 H640 M0 420 H640" />
              </g>

              {/* press */}
              <g>
                <rect x="372" y="54" width="176" height="176" rx="6" fill="#3a3f47" />
                <rect x="360" y="40" width="200" height="34" rx="5" fill="#FF6A00" opacity=".9" />
                <rect x="408" y="118" width="104" height="44" rx="3" fill="#22262c" />
                <rect x="396" y="190" width="128" height="18" rx="3" fill="#565c66" />
              </g>

              {/* zone */}
              <polygon points="318,244 596,244 640,404 262,404" fill="url(#aiv-hatch)" opacity=".22" />
              <g className="s-l2">
                <polygon
                  points="318,244 596,244 640,404 262,404"
                  fill="rgba(255,106,0,.14)"
                  stroke="#FF6A00"
                  strokeWidth="2"
                />
                <rect x="508" y="374" width="116" height="20" rx="4" fill="#FF6A00" />
                <text x="516" y="388" fontSize="11" fill="#fff">
                  ZONE B · PRESS
                </text>
              </g>

              {/* worker B — far, PPE ok */}
              <g transform="translate(96 176) scale(.62)">
                <circle cx="25" cy="14" r="10" fill="#c99b76" />
                <path d="M14 13a11 11 0 0 1 22 0z" fill="#f2f2f2" />
                <rect x="11" y="26" width="28" height="44" rx="9" fill="#d7e021" />
                <rect x="13" y="68" width="10" height="42" rx="4" fill="#4a5568" />
                <rect x="27" y="68" width="10" height="42" rx="4" fill="#4a5568" />
                <g className="s-l1">
                  <rect x="-6" y="-6" width="62" height="124" rx="3" fill="none" stroke="#00C8FF" strokeWidth="2.5" />
                  <rect x="-7" y="-34" width="118" height="24" rx="4" fill="#00C8FF" />
                  <text x="0" y="-17" fontSize="15" fill="#0E0E0F">
                    PPE OK 0.96
                  </text>
                </g>
              </g>

              {/* worker A — walks into the zone at step 3 */}
              <g transform="translate(176 250)">
                <g className="s-walk">
                  <circle cx="25" cy="12" r="10" fill="#c99b76" />
                  <path d="M15 9a10 9 0 0 1 20 0z" fill="#2a2a2a" />
                  <rect x="11" y="24" width="28" height="44" rx="9" fill="#d7e021" />
                  <rect x="13" y="66" width="10" height="42" rx="4" fill="#4a5568" />
                  <rect x="27" y="66" width="10" height="42" rx="4" fill="#4a5568" />
                  <g className="s-l1 s-only12">
                    <rect x="-6" y="-6" width="62" height="122" rx="3" fill="none" stroke="#00C8FF" strokeWidth="2" />
                    <rect x="-7" y="-30" width="92" height="20" rx="4" fill="#00C8FF" />
                    <text x="0" y="-16" fontSize="11" fill="#0E0E0F">
                      PERSON 0.98
                    </text>
                  </g>
                  <g className="s-l3">
                    <rect x="-6" y="-6" width="62" height="122" rx="3" fill="none" stroke="#FF6C6C" strokeWidth="2.5" />
                    <rect x="-7" y="-30" width="170" height="20" rx="4" fill="#FF6C6C" />
                    <text x="0" y="-16" fontSize="11" fill="#fff">
                      ZONE BREACH · NO HELMET
                    </text>
                  </g>
                </g>
              </g>

              {/* predicted track */}
              <g className="s-l2 s-only12">
                <path
                  d="M214 362 C 250 360, 282 356, 322 350"
                  fill="none"
                  stroke="#FF6A00"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                />
                <path d="M322 350 l-11 -6 l2 12 z" fill="#FF6A00" />
                <rect x="228" y="370" width="98" height="20" rx="4" fill="rgba(255,106,0,.92)" />
                <text x="236" y="384" fontSize="11" fill="#fff">
                  ETA ZONE 1.8 s
                </text>
              </g>

              {/* event card */}
              <g className="s-l3" transform="translate(20 318)">
                <rect width="230" height="146" rx="14" fill="#fff" />
                <circle cx="22" cy="26" r="6" fill="#FF6C6C" />
                <text x="36" y="30" fontSize="12" fill="#1D1D1F">
                  EVENT 4821 · ZONE B
                </text>
                <line x1="16" y1="46" x2="214" y2="46" stroke="#E8E8ED" />
                <text x="16" y="70" fontSize="11" fill="#6E6E73">Stop signal</text>
                <text x="214" y="70" fontSize="11" fill="#C81C1C" textAnchor="end">SENT</text>
                <text x="16" y="94" fontSize="11" fill="#6E6E73">Local alarm</text>
                <text x="214" y="94" fontSize="11" fill="#1D1D1F" textAnchor="end">ON</text>
                <text x="16" y="118" fontSize="11" fill="#6E6E73">Clip · supervisor</text>
                <text x="214" y="118" fontSize="11" fill="#1D1D1F" textAnchor="end">FILED</text>
              </g>

              <text x="20" y="24" fontSize="11" fill="#fff">
                CAM_04 / PRESS LINE
              </text>
              <text x="620" y="24" fontSize="11" fill="#fff" textAnchor="end">
                <HudClock as="tspan" />
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
