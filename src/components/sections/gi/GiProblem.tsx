"use client";

import { useEffect, useRef } from "react";
import { Head, Reveal } from "@/components/sections/hardware/hw-shared";
import { PROBLEMS, SIGNALS } from "./gi-data";

/**
 * 02 — The problem.
 *
 * The Omnibox fuse board, making this page's argument: six checks on the same
 * building — a rack inspection on a clipboard, a cycle count on a handheld, a
 * bent upright in an email, a mismatch in the WMS, a floor survey as a
 * contractor's PDF, a crack in a photo — slide together into **one marked-up
 * plan**. Nothing is added; the six are simply put in the same place, which is
 * the entire pitch of the two machines below.
 *
 * ── The scroll is the timeline ──────────────────────────────────────
 * Progress comes from where the board sits in the viewport, so the reader drives
 * it and can scroll back to re-read. Each chip is staggered *in scroll space*
 * rather than with a transition delay, which is why nothing here transitions its
 * transform — one would fight the scrubbing and lag behind the pointer.
 *
 * ── The chips dock onto a layout, not onto coordinates ──────────────
 * Each slot in the card is an empty spacer resized to its chip, so the card's
 * flex row decides where six chips of different widths land. Destinations are
 * read with `offsetLeft`/`offsetTop`, which ignore transforms —
 * `getBoundingClientRect` would fold in the reveal lift and the chips would aim
 * at a moving target. Web fonts change chip widths, so it re-measures once fonts
 * are ready. Under 600px the scatter becomes a zig-zag column; under
 * `prefers-reduced-motion` the board starts docked.
 */
const ease = (k: number) => {
  const t = Math.min(1, Math.max(0, k));
  return t * t * (3 - 2 * t);
};

export function GiProblem() {
  const fuseRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLElement | null)[]>([]);
  const chipRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const fuse = fuseRef.current;
    const card = cardRef.current;
    if (!fuse || !card) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let homes: { x: number; y: number; r: number }[] = [];
    let dests: { x: number; y: number }[] = [];
    let lastP = -1;

    const update = () => {
      const r = fuse.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = still ? 1 : Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (vh * 0.5)));
      if (Math.abs(p - lastP) < 0.001) return;
      lastP = p;
      chipRefs.current.forEach((s, i) => {
        const h = homes[i];
        const d = dests[i];
        if (!s || !h || !d) return;
        const k = ease((p - 0.05 - i * 0.035) / 0.62);
        s.style.transform =
          `translate(${(h.x + (d.x - h.x) * k).toFixed(1)}px,${(h.y + (d.y - h.y) * k).toFixed(1)}px)` +
          ` rotate(${(h.r * (1 - k)).toFixed(2)}deg)`;
        s.classList.toggle("docked", k > 0.9);
      });
      card.style.opacity = ease((p - 0.35) / 0.4).toFixed(3);
      fuse.classList.toggle("done", p > 0.9);
    };

    const measure = () => {
      const W = fuse.clientWidth;
      const H = fuse.clientHeight;
      const narrow = W < 600;
      chipRefs.current.forEach((s, i) => {
        const slot = slotRefs.current[i];
        if (!s || !slot) return;
        slot.style.width = s.offsetWidth + "px";
        slot.style.height = s.offsetHeight + "px";
      });
      homes = [];
      dests = [];
      chipRefs.current.forEach((s, i) => {
        const slot = slotRefs.current[i];
        if (!s || !slot) return;
        const w = s.offsetWidth;
        const h = s.offsetHeight;
        const sig = SIGNALS[i];
        const fx = narrow ? (i % 2 ? 0.66 : 0.34) : sig.x;
        const fy = narrow ? 0.14 + i * 0.145 : sig.y;
        homes[i] = {
          x: Math.min(Math.max(14, fx * W - w / 2), W - w - 14),
          y: Math.min(Math.max(50, fy * H - h / 2), H - h - 14),
          r: sig.r || 0,
        };
        dests[i] = { x: card.offsetLeft + slot.offsetLeft, y: card.offsetTop + slot.offsetTop };
      });
      lastP = -1;
      update();
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (!en.isIntersecting) continue;
          fuse.classList.add("in");
          io.unobserve(en.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(fuse);

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measure);
    if (document.fonts?.ready) document.fonts.ready.then(measure).catch(() => {});
    measure();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section className="section" id="problem">
      <div className="wrap">
        <Head
          center
          label="The problem today"
          top="The things that never move are the ones nobody checks."
          intro="Racking and floors are the biggest fixed assets in the building. Today they’re inspected in pieces — a clipboard here, a count there, a survey every few years — and nothing ever joins up."
        />

        <div
          ref={fuseRef}
          className="reveal fuse"
          role="img"
          aria-label="Six separate checks from different people and systems come together into one marked-up plan of the building."
        >
          <span className="fuse-cap before" aria-hidden>
            Six checks, six different places
          </span>
          <span className="fuse-cap after" aria-hidden>
            One marked-up plan of the building
          </span>

          <div className="fuse-card" ref={cardRef} aria-hidden>
            <div className="fc-head">
              <i className="fc-live" />
              <b>One marked-up plan</b>
              <small>AirScan + FloorScan</small>
            </div>
            <div className="fc-slots">
              {SIGNALS.map((s, i) => (
                <i
                  key={s.label}
                  className="slot"
                  ref={(el) => {
                    slotRefs.current[i] = el;
                  }}
                />
              ))}
            </div>
            <p className="fc-act">
              Every bay, every level and the slab beneath. <span>Located, ranked, ready to fix.</span>
            </p>
          </div>

          {SIGNALS.map((s, i) => (
            <span
              key={s.label}
              className="sig"
              aria-hidden
              ref={(el) => {
                chipRefs.current[i] = el;
              }}
            >
              <i />
              {s.label}
              <em>{s.src}</em>
            </span>
          ))}
        </div>

        <div className="pcards">
          {PROBLEMS.map((p, i) => (
            <Reveal key={p.n} className="pcard" delay={i * 60}>
              <span className="n">{p.n}</span>
              <h3>{p.h}</h3>
              <p>{p.p}</p>
              <p className="fix">{p.fix}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="principle">
          <p>
            Cameras watch what moves. Guided Inspection goes and looks at <span>what doesn’t.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
