"use client";

import { Fragment } from "react";

import { Head, Media, Reveal, useReveal } from "@/components/sections/hardware/hw-shared";
import { FORMULA, MODELS, type ModelKey } from "./omni-data";

/**
 * 02 — The family.
 *
 * Four models at equal weight, then the formula that says what they have in
 * common. The spec is explicit that no model is the hero: each card is the same
 * height, carries the same four blocks (tag, name, one-line job, "best for",
 * three checks) and the same pair of actions.
 *
 * `Learn more` opens the model's sheet; `See inside` scrolls to the 3D viewer
 * and switches it to that model — which is why both are buttons rather than
 * links, and why the page shell owns both handlers.
 */
export function OmniFamily({
  onOpen,
  onInside,
}: {
  onOpen: (key: ModelKey) => void;
  onInside: (key: ModelKey, view?: "inside" | "connect") => void;
}) {
  // The formula's connector lines draw themselves once the block is in view.
  const { ref: layerRef, shown: layerIn } = useReveal<HTMLDivElement>();

  return (
    <section className="section white" id="models">
      <div className="wrap">
        <Head
          label="The family"
          top="Four edge systems."
          bottom="One physical intelligence layer."
          intro="Each OmniBox is matched to its job — the right brain, the right connections, the right enclosure. Every event that matters then flows into the same RAMS Digital Twin."
        />

        <div className="family">
          {MODELS.map((m, i) => (
            <Reveal key={m.key} className="fcard" delay={i * 60}>
              <Media src={m.img} alt={m.name} label={m.img} className="contain" tone="light" />
              <div className="fbody">
                <p className="ftag">{m.tag}</p>
                <h3 className="fname">{m.name}</h3>
                <p className="fline">
                  <b>{m.lineTitle}</b>
                  {m.line}
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

          {/* Four lines converging on one point: the four terms becoming one
              layer. The orange overlay runs once the grey lines have drawn. */}
          <svg className="layer-lines" viewBox="0 0 1200 90" preserveAspectRatio="none" aria-hidden>
            {["M150 0C150 60 600 30 600 90", "M450 0C450 60 600 30 600 90", "M750 0C750 60 600 30 600 90", "M1050 0C1050 60 600 30 600 90"].map(
              (d) => (
                <path key={d} pathLength={1} d={d} />
              ),
            )}
            {["M150 0C150 60 600 30 600 90", "M450 0C450 60 600 30 600 90", "M750 0C750 60 600 30 600 90", "M1050 0C1050 60 600 30 600 90"].map(
              (d) => (
                <path key={d + "-flow"} className="flow" pathLength={1} d={d} />
              ),
            )}
          </svg>

          <div className="layer-bar">
            <div>
              <span className="label">RAMS Digital Twin</span>
              <h3>Every box. Every event. One live picture.</h3>
              <p>Right-sized for the use case. Unified through RAMS.</p>
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
