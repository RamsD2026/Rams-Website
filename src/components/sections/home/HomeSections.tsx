"use client";

import { GAPS, STARTS, SYSTEM_CARDS } from "./home-data";

/**
 * The three rebuilt sections, in one file.
 *
 * They belong together: all three are lists rendered from `home-data.ts`, none
 * carries behaviour, and splitting them three ways would cost more in imports
 * than it buys. The section they replace, `TechnologySystems.tsx`, was 1,961
 * lines for the middle one alone.
 *
 * ── These scroll over a live film ───────────────────────────────────
 * The first two are transparent: the warehouse is still rendering behind them
 * and the camera is still moving, so a solid background here would end the
 * film early. `HomeStart` is where the page takes over, so it is the first
 * one with a ground of its own.
 */

/** 06 — the gap. Picks up where the film's bay card leaves off. */
export function HomeGap() {
  return (
    <section className="hm-sec hm-clear" id="gap">
      <div className="hm-wrap">
        <div className="hm-head">
          <span className="hm-label">The gap</span>
          <h2>
            The floor already knows.
            <br />
            Nobody asked it.
          </h2>
          <p className="hm-intro">
            None of this is a data problem in the abstract. It is four specific questions a
            warehouse gets asked every week and cannot answer without sending somebody to look.
          </p>
        </div>

        <ul className="hm-gaps">
          {GAPS.map((g) => (
            <li key={g.b}>
              <b>{g.b}</b>
              <span>{g.s}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** 07 — the five systems. */
export function HomeSystems() {
  return (
    <section className="hm-sec hm-clear" id="systems">
      <div className="hm-wrap">
        <div className="hm-head">
          <span className="hm-label">The platform</span>
          <h2>
            One platform.
            <br />
            Five intelligent systems.
          </h2>
          <p className="hm-intro">
            Each one answers on its own. Connected, they stop being five products and start being
            one picture of the building.
          </p>
        </div>

        <div className="hm-systems">
          {SYSTEM_CARDS.map((s, i) => (
            <a key={s.id} className="hm-system" href={s.href}>
              <span className="hm-n">{String(i + 1).padStart(2, "0")}</span>
              <h3>{s.name}</h3>
              <p className="hm-line">{s.line}</p>
              <p className="hm-body">{s.body}</p>
              <span className="hm-go">Explore</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/** 08 — three ways in. The first section with a ground of its own: the film
 *  has handed the page over by here. */
export function HomeStart() {
  return (
    <section className="hm-sec hm-solid" id="start">
      <div className="hm-wrap">
        <div className="hm-head">
          <span className="hm-label">Start anywhere</span>
          <h2>
            Start with a service,
            <br />
            a device or the platform.
          </h2>
          <p className="hm-intro">
            There is no order these have to happen in, and no version of this that begins with
            replacing what you run today.
          </p>
        </div>

        <div className="hm-starts">
          {STARTS.map((s) => (
            <article key={s.n} className="hm-start">
              <span className="hm-n">{s.n}</span>
              <h3>{s.b}</h3>
              <p>{s.s}</p>
              <a className="hm-go" href={s.href}>
                {s.cta}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
