"use client";

import { Media } from "@/components/sections/hardware/hw-shared";
import { IMG } from "./gi-data";

/**
 * The static hero — the reference's own `#staticHero`, shown only when the film
 * cannot run. CSS hides it otherwise.
 *
 * `data-hero-tone` is set on the page root rather than here, because this
 * element is usually absent from the layout entirely.
 */
export function GiHero() {
  return (
    <section className="hw-hero" id="top" aria-label="Guided Inspection">
      <div>
        <p className="kicker">RAMS Digital</p>
        <h1>Guided Inspection</h1>
        <p className="tag">Machines that go and look at the parts of your building nobody checks.</p>
        <div className="hero-cta">
          <a className="btn btn-primary" href="#machines">
            Meet the machines
          </a>
          <a className="btn btn-secondary" href="#contact">
            Tell us what to look at
          </a>
        </div>
        <p className="hero-support">
          Every bay, not a sample <span aria-hidden>·</span> Nobody working at height{" "}
          <span aria-hidden>·</span> Findings on your own plan
        </p>
      </div>

      <Media
        src={IMG.lineup}
        alt="AirScan and FloorScan side by side"
        label={IMG.lineup}
        className="contain"
        tone="light"
        priority
      />
    </section>
  );
}
