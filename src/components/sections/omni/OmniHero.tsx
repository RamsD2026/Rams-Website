"use client";

import { Media } from "@/components/sections/hardware/hw-shared";
import { IMG } from "./omni-data";

/**
 * The static hero — the reference's own `#staticHero`, shown only when the film
 * cannot run. CSS hides it otherwise.
 *
 * `data-hero-tone` is set on the page root rather than here, because this
 * element is usually absent from the layout entirely.
 */
export function OmniHero() {
  return (
    <section className="hw-hero" id="top" aria-label="OmniBox">
      <div>
        <p className="kicker">RAMS Digital</p>
        <h1>OmniBox</h1>
        <p className="tag">
          The on-site brain that turns what cameras and sensors notice into <b>action.</b>
        </p>
        <div className="hero-cta">
          <a className="btn btn-primary" href="#choose">
            Find your OmniBox
          </a>
          <a className="btn btn-secondary" href="#models">
            Meet the family
          </a>
        </div>
        <p className="hero-support">
          Edge compute <span aria-hidden>·</span> Local decision logic{" "}
          <span aria-hidden>·</span> Machine &amp; sensor integration
        </p>
      </div>

      <Media
        src={IMG.lineup}
        alt="The four OmniBox models side by side"
        label={IMG.lineup}
        className="contain"
        tone="light"
        priority
      />
    </section>
  );
}
