"use client";

import { Media } from "@/components/sections/hardware/hw-shared";
import { IMG, PLATE } from "./aiv-data";

/**
 * 01 — Hero.
 *
 * The reference opens on a scroll-driven three.js film: the camera GLB lit in a
 * studio rig, scrubbing through four chapters (hero → Design → Power + I/O →
 * Inside, with the housing exploding apart) across a 520vh scroll track.
 *
 * This is not that. It is the static hero the reference already ships for
 * browsers without WebGL — `#staticHero`, its own documented fallback — which
 * is why the layout, the copy and the spec plate below are unchanged: that
 * fallback was designed, not improvised. Porting the film is a separate job
 * that brings a 7.7MB GLB and ~500 lines of three.js with it; when it lands it
 * replaces the `<Media>` in this component and nothing else on the page moves.
 *
 * `data-hero-tone="light"` is essential rather than decorative. The site navbar
 * goes transparent with white links while the page is at the top, which works
 * because every other hero on this site is dark. This page's ground is
 * `#F5F5F7`. Without this attribute the navbar renders white-on-near-white and
 * the header is invisible until the first scroll. See `layout/Header.tsx`.
 */
export function AivHero() {
  return (
    <section className="hw-hero" id="top" data-hero-tone="light" aria-label="RAMS AI Camera">
      <div>
        <p className="kicker">RAMS Digital</p>
        <h1>AI Camera</h1>
        <p className="tag">
          Industrial vision. <b>Human intelligence.</b>
        </p>
        <div className="hero-cta">
          <a className="btn btn-primary" href="#contact">
            Book an assessment
          </a>
          <a className="btn btn-secondary" href="#use-cases">
            Explore use cases
          </a>
        </div>
        <dl className="plate">
          {PLATE.map((p) => (
            <div key={p.dt}>
              <dt>{p.dt}</dt>
              <dd>
                {p.dd}
                <small>{p.unit}</small>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <Media
        src={IMG.product}
        alt="The RAMS AI Camera — machined aluminium housing, white faceplate, single lens"
        label="media/product-beauty-light.jpg"
        priority
      />
    </section>
  );
}
