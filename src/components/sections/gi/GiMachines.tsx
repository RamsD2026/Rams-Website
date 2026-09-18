"use client";

import { Fragment } from "react";
import { Head, Media, Reveal, useReveal } from "@/components/sections/hardware/hw-shared";
import { StageBadge } from "./GiShared";
import { FORMULA, MACHINES, type MachineKey } from "./gi-data";
import type { InsideView } from "./GiInside";

/**
 * 03 — The machines.
 *
 * Two cards at equal weight — one goes up, one goes down — then the formula that
 * says what they have in common. The Omnibox family grid, set to two.
 *
 * Each card carries three actions, and the third is the one that matters:
 * **"Watch it scan"** drops the reader straight into the 3D viewer's scan view
 * for that machine. For a product nobody can buy yet, seeing it work is the only
 * evidence on offer, so the page makes it two clicks from anywhere.
 */
export function GiMachines({
  onOpen,
  onInside,
}: {
  onOpen: (k: MachineKey) => void;
  onInside: (k: MachineKey, view?: InsideView) => void;
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
    <section className="section white" id="machines">
      <div className="wrap">
        <Head
          label="The machines"
          top="Two machines."
          bottom="One marked-up building."
          intro="One goes up the racking, one goes down into the floor. Both run on their own when the building is quiet, and both hand back the same thing: your plan, with every problem pinned to it."
        />

        <div className="family two">
          {MACHINES.map((m, i) => (
            <Reveal key={m.key} className="fcard" delay={i * 70}>
              <Media src={m.img} alt={m.alt} label={m.img} className="contain" tone="light" />
              <div className="fbody">
                <p className="ftag">{m.tag}</p>
                <h3 className="fname">
                  {m.key === "airscan" ? "AirScan" : "FloorScan"}
                  <StageBadge machine={m.key} />
                </h3>
                <p className="fline">
                  <b>{m.lead[0]}</b>
                  {m.lead[1]}
                </p>
                <p className="fbest">
                  Best for<b>{m.bestFor}</b>
                </p>
                <ul className="checks">
                  {m.checks.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <div className="factions">
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => onOpen(m.key)}>
                    Learn more
                  </button>
                  <button type="button" className="link" onClick={() => onInside(m.key)}>
                    See inside
                  </button>
                  <button type="button" className="link" onClick={() => onInside(m.key, "scan")}>
                    Watch it scan
                  </button>
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
              <span className="label">RAMS Digital Twin</span>
              <h3>Every finding. One live picture of the building.</h3>
              <p>Next to everything your cameras and trucks already report.</p>
            </div>
            <a className="link" href="#works">
              How it fits together
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
