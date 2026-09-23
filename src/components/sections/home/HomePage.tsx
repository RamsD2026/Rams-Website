"use client";

import { useCallback, useState } from "react";
import { HomeFilm } from "./HomeFilm";
import { HomeFinder } from "./HomeFinder";
import {
  HomeAssets, HomeCompare, HomeCTA, HomeEvolution, HomeModel, HomeNowNext,
  HomeOutcomes, HomeStatement,
} from "./HomeSections";

/**
 * The homepage shell.
 *
 * ── Where this page comes from ──────────────────────────────────────
 * A port of the supplied design, `RAMS_Digital_Physical_Warehouse_Homepage-10
 * .html`: its ten sections, its copy and its CSS, with the same adaptations
 * the hardware pages were given — its own nav and footer dropped for this
 * site's `<Header>` and `<Footer>`, its embedded fonts dropped, and its CSS
 * scoped under `.home-page`. See the head of `app/homepage/homepage.css`.
 *
 * ── The hero's visual is the film, not a picture ────────────────────
 * The design put a still render of a warehouse in the hero frame. The page
 * already owns a live one — the same isometric warehouse the previous build
 * ran as a full-screen scroll film — so that runs in the frame instead, in
 * `ambient` mode: sized to the frame, playing its nine chapters on a loop.
 * See `HomeFilm`.
 *
 * The design's still is kept as `public/homepage/twin-fallback.webp` and shows
 * under `.no-film`, which is set when WebGL2 is missing or the film fails to
 * start. The front door is the one page that must never come up blank, and the
 * design's own image is the cheapest guarantee of that.
 *
 * ── What went ──────────────────────────────────────────────────────
 * The previous build's own sections (`HomeGap`, `HomeSystems`, `HomeStart`)
 * and the borrowed ones under them — the industries carousel, customer
 * success, the trust band and the final CTA — are all replaced by the
 * design's ten. Those components are still used by `/`, which is untouched.
 */
export function HomePage() {
  const [noFilm, setNoFilm] = useState(false);
  const filmUnavailable = useCallback(() => setNoFilm(true), []);

  return (
    <div className={"home-page" + (noFilm ? " no-film" : "")}>
      <main id="top">
        <section className="hero">
          <div className="wrap hero-grid">
            <div className="hero-copy reveal">
              <div className="eyebrow">Warehouse Intelligence, Without Starting Over</div>

              <h1>
                The Operating System for <span>Intelligent Facilities.</span>
              </h1>

              <p className="lead">
                RAMS connects and augments physical facilities through{" "}
                <strong>Digital Twin technology, intelligent hardware and operational software</strong>{" "}
                — bringing racks, MHEs, pallets, people, infrastructure and future robotic systems
                into one connected operating environment.
              </p>

              <div className="scope">
                <span>Racks</span>
                <span>MHEs</span>
                <span>Pallets</span>
                <span>People</span>
                <span>Infrastructure</span>
                <span>Robotics</span>
              </div>

              <div className="hero-actions">
                <a className="btn primary" href="#why">
                  See How RAMS Works →
                </a>
                <a className="btn secondary" href="#platform">
                  Explore the Platform
                </a>
              </div>
            </div>

            <figure className="warehouse reveal" aria-label="RAMS Digital Twin warehouse">
              <div className="warehouse-top">
                <span>RAMS DIGITAL TWIN</span>
                <div className="visual-meta">
                  <span>PHYSICAL WAREHOUSE CONTEXT</span>
                  <span className="concept-label">Live model</span>
                </div>
              </div>

              <div className="twin-image-frame">
                <div className="twin-stage">
                  <HomeFilm onUnavailable={filmUnavailable} ambient />
                  {/* The design's own render, shown only under `.no-film`. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="twin-fallback"
                    src="/homepage/twin-fallback.webp"
                    alt="Warehouse racks, inventory, loading docks and equipment within a Digital Twin"
                    width={1536}
                    height={1024}
                  />
                </div>
                <div className="asset-key">
                  <span>RACK</span>
                  <span>MHE</span>
                  <span>PEOPLE</span>
                  <span>PALLET</span>
                  <span>AMR</span>
                </div>
              </div>

              <figcaption className="context-pair">
                <div className="data-card">
                  <b>Physical Context</b>
                  <span>Identity · Location · Condition</span>
                </div>
                <div className="data-card">
                  <b>Operational Context</b>
                  <span>Movement · Interaction · History</span>
                </div>
              </figcaption>

              <div className="warehouse-foot">
                <div className="metric">
                  <strong>Safety</strong>Risk &amp; action
                </div>
                <div className="metric">
                  <strong>Productivity</strong>Movement &amp; use
                </div>
                <div className="metric">
                  <strong>Efficiency</strong>Assets &amp; flow
                </div>
                <div className="metric">
                  <strong>Visibility</strong>Physical reality
                </div>
              </div>
            </figure>
          </div>
        </section>

        <HomeStatement />
        <HomeOutcomes />
        <HomeModel />
        <HomeFinder />
        <HomeCompare />
        <HomeAssets />
        <HomeEvolution />
        <HomeNowNext />
        <HomeCTA />
      </main>
    </div>
  );
}
