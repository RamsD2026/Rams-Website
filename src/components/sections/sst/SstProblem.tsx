"use client";

import { useEffect, useRef } from "react";
import { Head, Reveal } from "@/components/sections/hardware/hw-shared";
import { PROBLEMS, SIGNALS } from "./sst-data";

/**
 * 02 — The problem.
 *
 * The same fuse board as the OmniBox page, making a different argument. There
 * the six chips are six *signals* converging into one decision; here they are
 * six **questions about one forklift** — who started it, what bent that upright,
 * why it was fast by the dock — each answered today from a different place: a
 * key log, a walk-round, a complaint, a radio, a guess, the workshop. They slide
 * together into one truck record that answers all six from the truck itself.
 *
 * ── The scroll is the timeline ──────────────────────────────────────
 * Progress comes from where the board sits in the viewport, not from a timer, so
 * the reader drives the argument at their own pace and can scroll back to
 * re-read it. Each chip is staggered *in scroll space* rather than with a
 * transition delay, which is why nothing here has a transform transition — one
 * would fight the scrubbing and lag behind the pointer. Only colour is
 * transitioned, on `.docked`.
 *
 * ── The chips dock onto a layout, not onto coordinates ──────────────
 * Each slot in the card is an empty spacer resized to its chip, so the card's
 * own flex row decides where six chips of different widths land; the chip then
 * flies to its slot. Destinations are read with `offsetLeft`/`offsetTop`, which
 * ignore transforms — `getBoundingClientRect` would fold in the reveal lift and
 * the chips would aim at a moving target. Web fonts change chip widths, so it
 * re-measures once fonts are ready.
 *
 * Under 600px there is no room for a scatter, so the chips become a zig-zag
 * column; under `prefers-reduced-motion` the board starts docked, because the
 * finished picture carries the meaning and the movement is decoration on top.
 */
const ease = (k: number) => {
  const t = Math.min(1, Math.max(0, k));
  return t * t * (3 - 2 * t);
};

export function SstProblem() {
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

    /* home = the scattered spot; dest = its slot in the card */
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

    /* The board's own fade-up, driven here rather than through `Reveal`: the
       scroll maths needs this same element, and `Reveal` keeps its ref. */
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
          top="A forklift knows nothing about itself."
          intro="Who drove it, what it hit, how fast it went and whether the battery will last the shift — today those answers come from key logs, walk-rounds, radios and guesswork, days after they mattered."
        />

        <div
          ref={fuseRef}
          className="reveal fuse"
          role="img"
          aria-label="Six separate questions about a forklift, answered from six different places, come together into one record from the truck itself."
        >
          <span className="fuse-cap before" aria-hidden>
            Six questions, six places to ask
          </span>
          <span className="fuse-cap after" aria-hidden>
            One record, from the truck itself
          </span>

          <div className="fuse-card" ref={cardRef} aria-hidden>
            <div className="fc-head">
              <i className="fc-live" />
              <b>Truck 07 · this shift</b>
              <small>RAMS Sensor Stack</small>
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
              Driver verified. One knock logged, with the place. <span>Battery healthy.</span>
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

        <div className="pcards six">
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
            A forklift that knows itself is a forklift you can <span>manage.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
