"use client";

import { useEffect, useRef } from "react";
import { Head, Reveal } from "@/components/sections/hardware/hw-shared";
import { PROBLEMS, PROBLEM_STATS, SIGNALS } from "./omni-data";

/**
 * 01 — The problem.
 *
 * The section argues that scattered signals are not a decision, and the fuse
 * diagram *is* the argument: six chips from six different systems — an impact
 * sensor, a camera, the fleet list, the site map, access control, the
 * maintenance history — sit apart on the board, then slide together and dock
 * into one card that says what actually happens next.
 *
 * ── The scroll is the timeline ──────────────────────────────────────
 * Progress comes from where the board sits in the viewport, not from a timer:
 * the chips converge as you scroll down and scatter again as you scroll back,
 * so the visitor drives the argument at their own pace and can re-read it. A
 * one-shot animation on reveal plays once, usually while the board is still
 * half off-screen, and then there is no way to see it again.
 *
 * Each chip is staggered *in scroll space* rather than with a transition delay
 * (`(p - .05 - i*.035) / .62`), which is why nothing here has a transform
 * transition — a transition would fight the scrubbing and lag the pointer.
 * Only colour changes are transitioned, on `.docked`.
 *
 * ── The chips dock onto a layout, not onto coordinates ──────────────
 * Each slot in the card is an empty spacer resized to its chip, so the card's
 * flex row works out where six chips of different widths actually land; the
 * chip then flies to its slot. Destinations are read with `offsetLeft` /
 * `offsetTop`, which ignore transforms — `getBoundingClientRect` would fold in
 * the reveal lift and the chips would aim at a moving target. Web fonts change
 * chip widths, so it all re-measures once fonts are ready.
 *
 * `SIGNALS` carries `x`/`y` as 0–1 of the board rather than pixels, so the
 * scatter holds its composition at any width, clamped to stay inside the board
 * and clear of the caption. Under 600px there is no room for a scatter at all,
 * so the chips become a zig-zag column. Under `prefers-reduced-motion` the
 * board starts docked — the finished picture carries the meaning, the movement
 * is decoration on top of it.
 */
const ease = (k: number) => {
  const t = Math.min(1, Math.max(0, k));
  return t * t * (3 - 2 * t);
};

export function OmniProblem() {
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
      const vh = innerHeight;
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

    /* home = the scattered spot; dest = its slot in the card */
    const measure = () => {
      const W = fuse.clientWidth;
      const H = fuse.clientHeight;
      const narrow = W < 600;
      // size each slot to its chip first, so the card's flex row settles before
      // we read where the slots ended up
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

    /* The board's own fade-up. It is driven here rather than through `Reveal`
       because the scroll maths needs the same element, and `Reveal` keeps its
       ref to itself. */
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          fuse.classList.add("in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(fuse);

    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", measure);
    // web fonts change the chip widths, so the slots have to be re-measured
    if (document.fonts?.ready) document.fonts.ready.then(measure).catch(() => {});
    measure();
    return () => {
      io.disconnect();
      removeEventListener("scroll", update);
      removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section className="section" id="problem">
      <div className="wrap">
        <Head
          center
          label="The problem today"
          top="Physical operations move faster than cloud-only systems."
          intro="Sensors produce signals. Cameras produce detections. Machines produce logs. Without intelligence on site that knows where and when it all happened, the operation still gets scattered data instead of a decision it can use."
        />

        <div
          ref={fuseRef}
          className="reveal fuse"
          role="img"
          aria-label="Six separate signals from different systems come together into one decision: driver warned, supervisor alerted, logged for the safety review."
        >
          <span className="fuse-cap before" aria-hidden>
            Six signals, six separate systems
          </span>
          <span className="fuse-cap after" aria-hidden>
            One decision, made on site
          </span>

          <div className="fuse-card" ref={cardRef} aria-hidden>
            <div className="fc-head">
              <i className="fc-live" />
              <b>One decision</b>
              <small>Omnibox, on the truck</small>
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
              Driver warned. Supervisor alerted. <span>Logged for the safety review.</span>
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
            <Reveal key={p.n} as="div" className="pcard" delay={i * 60}>
              <span className="n">{p.n}</span>
              <h3>{p.h}</h3>
              <p>{p.p}</p>
              <p className="fix">{p.fix}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="principle">
          <p>
            The closer intelligence gets to the event, the faster data becomes{" "}
            <span>action.</span>
          </p>
        </Reveal>

        <div className="stats three">
          {PROBLEM_STATS.map((s, i) => (
            <Reveal key={s.h} className="stat" delay={i * 80}>
              <div className="num">
                {s.v}
                <small>{s.unit}</small>
              </div>
              <h3>{s.h}</h3>
              <p>{s.p}</p>
            </Reveal>
          ))}
        </div>

        <p className="note center">
          Indicative. Response depends on the model and the installation; validated figures on
          request.
        </p>
      </div>
    </section>
  );
}
