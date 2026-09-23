"use client";

import { useEffect, useRef, useState } from "react";
import { Head } from "@/components/sections/hardware/hw-shared";
import { SUA_FRAMES, SUA_STEPS } from "./aiv-data";

/**
 * 04 — See → Understand → Act.
 *
 * A 330vh track with a pinned panel: the step list on the left dims to the
 * active one while the panel cross-fades between three frames of the same
 * camera view. Which frame shows is pure CSS keyed off `data-step` on the
 * panel (`.sua-frame`, cumulative, so the background never flickers), so this
 * component only has to decide which of the three numbers is current.
 *
 * The frames were a hand-drawn SVG until the photography landed. They are now
 * three stills from one generated press-line view, with the HUD burned in:
 * step 1 boxes both workers — one helmeted, one not — step 2 lights the hazard
 * zone and predicts the near worker's path into it, step 3 has him inside it,
 * his box red, and the event filed.
 *
 * The timestamps are baked into the images (16:02:48 / :58 / 16:03:10), which
 * is why `HudClock` is no longer used here: a live clock ticking beside three
 * fixed frames would have contradicted them.
 *
 * Under `prefers-reduced-motion` the track collapses (CSS) and the panel parks
 * on step 3 — the finished state, so the reader sees the whole story at once
 * rather than the opening frame of three.
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

          <div
            className="sua-panel"
            data-step={step}
            role="img"
            aria-label="A press line seen from a ceiling camera. The system boxes two workers, predicts that the bare-headed one is about to enter the hazard zone in front of the press, and files a zone-breach event when he does."
          >
            <div className="sua-frames">
              {SUA_FRAMES.map((src) => (
                /* Raw <img>, as everywhere else in this page family — see the
                   same exemption in `hw-shared.tsx`. next/image wants to own
                   layout and sizing, and these three have to sit in one grid
                   cell at identical size for the cross-fade to work. They are
                   pre-sized WebP at 1448x1086, ~145 KB each, so there is
                   nothing left for it to optimise. */
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  className="sua-frame"
                  src={src}
                  alt=""
                  width={1448}
                  height={1086}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
