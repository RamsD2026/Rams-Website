"use client";

import { Media } from "@/components/sections/hardware/hw-shared";
import { IMG } from "./aiv-data";

/**
 * 01 — Hero.
 *
 * This is the static hero, and it is not what most visitors see. `AivFilm`
 * renders the scroll-driven film over the top of it; CSS reveals this block
 * only under `.no-film`, which `AivPage` sets when the film reports it cannot
 * run — no WebGL2, a failed GLB, or a load past ten seconds.
 *
 * It is the reference's own documented fallback (`#staticHero`) rather than an
 * improvisation, which is why the layout and copy are unchanged from it. Its
 * spec plate is gone, here and in the film: the numbers live on the spec sheet
 * further down the page.
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
        <p className="hero-support">
          On-device AI <span aria-hidden>·</span> Event-based evidence{" "}
          <span aria-hidden>·</span> Works with what you already run
        </p>
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
