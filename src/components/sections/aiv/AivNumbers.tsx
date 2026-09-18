"use client";

import { useEffect, useRef, useState } from "react";
import { Head, Reveal } from "./aiv-shared";
import { STATS } from "./aiv-data";

/**
 * 06 — The numbers.
 *
 * Four figures that count up once, when the tile is 60% on screen.
 *
 * The "indicative" note under them is not boilerplate. None of these are
 * validated customer outcomes, and the reference's content rules require the
 * note to travel with the figures. It stays.
 */
function Num({ to, dec = 0, v, unit }: { to?: number; dec?: number; v: string; unit: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(v);

  useEffect(() => {
    const el = ref.current;
    if (!el || to === undefined) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);
          // Decimal figures count from 3 and integers from 0 — the reference's
          // choice, so `0.5` doesn't spend most of the animation reading "0.0".
          const from = dec ? 3 : 0;
          const t0 = performance.now();
          const frame = (now: number) => {
            const k = Math.min(1, (now - t0) / 1400);
            const eased = 1 - Math.pow(1 - k, 3);
            setShown((from + (to - from) * eased).toFixed(dec));
            if (k < 1) requestAnimationFrame(frame);
          };
          requestAnimationFrame(frame);
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, dec]);

  return (
    <div className="num" ref={ref}>
      {shown}
      <small>{unit}</small>
    </div>
  );
}

export function AivNumbers() {
  return (
    <section className="section white" id="numbers">
      <div className="wrap">
        <Head center label="The numbers" top="Fast enough to matter." />

        <div className="stats">
          {STATS.map((s, i) => (
            <Reveal key={s.h} className="stat" delay={i * 80}>
              <Num to={s.to} dec={s.dec} v={s.v} unit={s.unit} />
              <h3>{s.h}</h3>
              <p>{s.p}</p>
            </Reveal>
          ))}
        </div>

        <p className="note center">
          Indicative, based on operational analysis. Validated outcomes on request.
        </p>
      </div>
    </section>
  );
}
