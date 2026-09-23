"use client";

import { Media } from "@/components/sections/hardware/hw-shared";
import { IMG } from "./sst-data";

/**
 * The static hero — the reference's own `#staticHero`, shown only when the film
 * cannot run. CSS hides it otherwise.
 *
 * `data-hero-tone` is set on the page root rather than here, because this
 * element is usually absent from the layout entirely.
 */
export function SstHero() {
  return (
    <section className="hw-hero" id="top" aria-label="Sensor Stack">
      <div>
        <p className="kicker">RAMS Digital</p>
        <h1>Sensor Stack</h1>
        <p className="tag">
          Who’s driving, how fast, what it hit, where it is, what’s on the forks — and how the
          battery is holding up.
        </p>
        <div className="hero-cta">
          <a className="btn btn-primary" href="#sensors">
            Meet the sensors
          </a>
          <a className="btn btn-secondary" href="#lidar">
            See the LiDAR
          </a>
        </div>
        <p className="hero-support">
          Operator <span aria-hidden>·</span> Location <span aria-hidden>·</span> Speed{" "}
          <span aria-hidden>·</span> Impact <span aria-hidden>·</span> Load{" "}
          <span aria-hidden>·</span> Battery
        </p>
      </div>

      <Media
        src={IMG.truck}
        alt="A forklift fitted with the RAMS Sensor Stack"
        label={IMG.truck}
        tone="light"
        priority
      />
    </section>
  );
}
