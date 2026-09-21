"use client";

import { Head, Reveal } from "@/components/sections/hardware/hw-shared";
import { TECH, TECH_CARDS } from "./loc-data";

/**
 * 04 — the four technologies, a card each.
 *
 * The sandbox above answers "how big is the circle"; this answers "what does it
 * cost you". Every card carries the same six things in the same order —
 * accuracy, tags, fixed kit, update rate, what it is good at, what it costs
 * you — so the four can be compared by eye rather than by reading. The "costs
 * you" column is the reason the page is trusted: it is as long as the "good at"
 * column on all four, including the one we sell.
 *
 * Name, sub-title and badge come from `TECH`; the prose and the two lists come
 * from `TECH_CARDS`, keyed to it.
 */
export function LocTech() {
  return (
    <section className="section" id="tech">
      <div className="wrap">
        <Head
          label="The four"
          top="Four ways to answer"
          bottom="“where is it?”"
          intro="No single technology wins everywhere. What matters is how precise you need to be, how many things you are tracking, and how much kit you are willing to put on the walls."
        />

        <div className="techs">
          {TECH_CARDS.map((c, i) => {
            const T = TECH[c.key];
            return (
              <Reveal key={c.key} as="section" className="tech" delay={i * 70}>
                <div className="tech-top">
                  <div>
                    <h3>{T.name}</h3>
                    <p className="sub">{T.sub}</p>
                  </div>
                  <span className={"badge " + (T.live ? "live" : "pilot")}>{T.badge}</span>
                </div>

                <p className="lead">{c.lead}</p>

                <dl>
                  {c.facts.map(([dt, dd]) => (
                    <div key={dt}>
                      <dt>{dt}</dt>
                      <dd>{dd}</dd>
                    </div>
                  ))}
                </dl>

                <div className="cols">
                  <div>
                    <h4>Good at</h4>
                    <ul>
                      {c.good.map((g) => (
                        <li key={g}>{g}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="cost">
                    <h4>Costs you</h4>
                    <ul>
                      {c.cost.map((g) => (
                        <li key={g}>{g}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
