"use client";

import { Fragment } from "react";
import { Head, Media, Reveal, useReveal } from "@/components/sections/hardware/hw-shared";
import { FORMULA, SENSORS, type LidarMode, type SheetKey } from "./sst-data";

/**
 * 03 — The six sensors.
 *
 * Six cards at equal weight on the Omnibox family grid, three across. Each
 * carries the same five blocks — photograph, what it is for, its name, one bold
 * line, three checks — so they compare by eye; there is no hero sensor, because
 * a site fits what it needs.
 *
 * ── The "Through LiDAR" line ────────────────────────────────────────
 * Crash, Speed and Location are three cards but **one sensor**. Rather than
 * merge them (they are three different purchases and three different questions)
 * or leave the reader to work it out, each of the three carries a small orange
 * `via` line saying so, and all three open the same LiDAR sheet. It is the one
 * honest way to sell three things that are one piece of hardware.
 *
 * Every card's second action goes somewhere specific: Access Control to its own
 * demo, the three LiDAR cards to the showcase **already switched to that
 * answer**, Pallet and Battery to their sections. So the page shell owns both
 * handlers and these are buttons, not links.
 */
export function SstSensors({
  onOpen,
  onLidar,
}: {
  onOpen: (key: SheetKey) => void;
  onLidar: (mode: LidarMode) => void;
}) {
  // The formula's connector lines draw themselves once the block is in view.
  const { ref: layerRef, shown: layerIn } = useReveal<HTMLDivElement>();

  const LINES = [
    "M150 0C150 60 600 30 600 90",
    "M450 0C450 60 600 30 600 90",
    "M750 0C750 60 600 30 600 90",
    "M1050 0C1050 60 600 30 600 90",
  ];

  return (
    <section className="section white" id="sensors">
      <div className="wrap">
        <Head
          label="The stack"
          top="Six sensors."
          bottom="One truck that knows itself."
          intro="Fit what the site needs. Each sensor answers one question; the LiDAR answers three."
        />

        <div className="family six">
          {SENSORS.map((s, i) => (
            <Reveal key={s.key} className="fcard" delay={(i % 3) * 60}>
              <Media src={s.img} alt={s.alt} label={s.img} className="contain" tone="light" />
              <div className="fbody">
                <p className="ftag">{s.tag}</p>
                <h3 className="fname">{s.name}</h3>
                <p className="fline">
                  <b>{s.lead[0]}</b>
                  {s.lead[1]}
                </p>
                <ul className="checks">
                  {s.checks.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                {s.via && (
                  <p className="via">
                    <i />
                    Through LiDAR
                  </p>
                )}
                <div className="factions">
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => onOpen(s.sheet)}>
                    Learn more
                  </button>
                  {/* Bound to a local so the narrowing survives into the
                      callback — TS drops it for a captured property access. */}
                  {((go) =>
                    "lidar" in go ? (
                      <button type="button" className="link" onClick={() => onLidar(go.lidar)}>
                        {go.label}
                      </button>
                    ) : (
                      <a className="link" href={"#" + go.to}>
                        {go.label}
                      </a>
                    ))(s.go)}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div ref={layerRef} className={"layer" + (layerIn ? " in" : "")}>
          {/* The `+` signs are grid items between the terms, so a Fragment with
              a key is needed rather than a bare one. */}
          <div className="formula">
            {FORMULA.map((t, i) => (
              <Fragment key={t.b}>
                <div className="term">
                  <b>{t.b}</b>
                  <span>{t.s}</span>
                </div>
                {i < FORMULA.length - 1 && (
                  <i className="plus" aria-hidden>
                    +
                  </i>
                )}
              </Fragment>
            ))}
          </div>

          {/* Four lines converging on one point: four jobs, one box on the
              truck. The orange overlay runs once the grey lines have drawn. */}
          <svg className="layer-lines" viewBox="0 0 1200 90" preserveAspectRatio="none" aria-hidden>
            {LINES.map((d) => (
              <path key={d} pathLength={1} d={d} />
            ))}
            {LINES.map((d) => (
              <path key={d + "-flow"} className="flow" pathLength={1} d={d} />
            ))}
          </svg>

          <div className="layer-bar">
            <div>
              <span className="label">Omnibox Motion</span>
              <h3>Every sensor. One box on the truck.</h3>
              <p>Decided on the truck, and sent on to the RAMS Digital Twin.</p>
            </div>
            {/* The reference linked a sibling static site; this is the route. */}
            <a className="link" href="/hardware/omnibox">
              Explore Omnibox
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
