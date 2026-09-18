"use client";

import { useEffect, useState } from "react";
import { LocPlan } from "./LocPlan";
import { BUYS, ORDER, TECH, type TechKey } from "./loc-data";

/**
 * 01 — the hero.
 *
 * A dark act with the floor plan running behind the headline, cycling the four
 * technologies every 4.2 seconds. The readout in the corner names whichever one
 * is on screen and what its accuracy buys you, so the cycle reads as an
 * argument — same floor, same truck, four circles of very different sizes —
 * rather than as decoration. It is the sandbox's thesis in eighteen seconds,
 * before the reader has scrolled anywhere.
 *
 * The hero is dark, so it wants **no** `data-hero-tone` on the page root: the
 * navbar's transparent-with-white-links state is exactly right over it. See
 * `layout/Header.tsx`.
 *
 * The readout is `aria-hidden`: it labels a canvas that is itself decorative
 * here, and every number in it is stated again, in text, in the accuracy
 * sandbox and the technology cards below.
 */
export function LocHero() {
  const [key, setKey] = useState<TechKey>("lidar");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setKey((k) => ORDER[(ORDER.indexOf(k) + 1) % ORDER.length]);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  const T = TECH[key];

  return (
    <section className="li-hero dark" aria-label="Location Intelligence">
      <LocPlan tech={key} theme="dark" hero />
      <div className="hero-shade" aria-hidden />

      <div className="hero-in">
        <div className="hero-copy">
          <p className="kicker">RAMS Digital</p>
          <h1>
            Location
            <br />
            Intelligence
          </h1>
          <p className="tag">
            Know where everything is <b>inside the building</b> — where GPS gives up.
          </p>
          <div className="hero-cta">
            <a className="btn btn-primary" href="#accuracy">
              See what accuracy buys you
            </a>
            <a className="btn btn-secondary" href="#contact">
              Talk to us
            </a>
          </div>

          <dl className="plate">
            <div>
              <dt>LiDAR accuracy today</dt>
              <dd>
                ±10<small>mm</small>
              </dd>
            </div>
            <div>
              <dt>Technologies</dt>
              <dd>4</dd>
            </div>
            <div>
              <dt>Starts with</dt>
              <dd>
                1<small>aisle</small>
              </dd>
            </div>
            <div>
              <dt>Decisions</dt>
              <dd>on site</dd>
            </div>
          </dl>

          <div className="hero-read" aria-hidden>
            <span
              className="hr-dot"
              style={{ background: T.colour, boxShadow: "0 0 0 4px " + T.colour + "2e" }}
            />
            <b>{T.name}</b>
            <span className="hr-acc">
              {T.accTxt} {T.accUnit}
            </span>
            <span className="hr-sub">{BUYS[key]}</span>
          </div>
        </div>
      </div>

      <span className="plan-cap">Live floor plan · the same map, seen by four technologies</span>
    </section>
  );
}
