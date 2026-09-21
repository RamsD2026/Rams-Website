"use client";

import { Head, Media, Reveal } from "./aiv-shared";
import { DETECTS, IDEAS, TRIGGERS } from "./aiv-data";

/**
 * 05 — Build your own.
 *
 * A 12-column bento. The argument the section is making is that a use case is
 * usually just a zone plus a rule, so the `IF / IN / FOR / THEN` strip is the
 * point of the whole block, not decoration — it is the thing a reader mentally
 * fills in with their own floor.
 */
export function AivBuild() {
  return (
    <section className="section" id="build">
      <div className="wrap">
        <Head
          label="Build your own"
          top="What would you"
          bottom="point it at?"
          intro="Most use cases are a zone and a rule. If you can describe what should never happen on your floor, the camera can watch for it."
        />

        <div className="bento">
          <Reveal className="tile span-7">
            <span className="label">It detects</span>
            <h3>People, kit and machines.</h3>
            <div className="pills">
              {DETECTS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </Reveal>

          <Reveal className="tile span-5" delay={80}>
            <span className="label">It triggers</span>
            <h3>Something useful.</h3>
            <div className="pills">
              {TRIGGERS.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </Reveal>

          <Reveal className="tile ink span-4">
            <span className="label">It runs</span>
            <div className="big">On-device</div>
            <p className="sub">
              inference. Detects and decides without a network, and syncs events when it has one.
            </p>
          </Reveal>

          <Reveal className="tile span-8" delay={80}>
            <span className="label">Rules, not code</span>
            <h3>Draw a zone. Say what matters.</h3>
            <div
              className="rule"
              aria-label="Example rule: if a person without a helmet is in Zone B for more than 2 seconds, then send a stop signal and alert the supervisor"
            >
              <span className="k">IF</span>
              <span className="v">Person · no helmet</span>
              <span className="k">IN</span>
              <span className="v">Zone B</span>
              <span className="k">FOR</span>
              <span className="v">&gt; 2 s</span>
              <span className="k">THEN</span>
              <span className="v o">Stop signal</span>
              <span className="v o">Alert supervisor</span>
            </div>
            <p className="sub" style={{ marginTop: 18 }}>
              Set at commissioning, tuned from real events — not guessed.
            </p>
          </Reveal>

          {IDEAS.map((idea, i) => (
            <Reveal key={idea.b} className="tile idea span-3" delay={i * 60}>
              <Media src={idea.img} alt={idea.alt} label={idea.label} tone="light" />
              <div className="t">
                <b>{idea.b}</b>
                <span>{idea.s}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
