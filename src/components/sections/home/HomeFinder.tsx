"use client";

import { useMemo, useState } from "react";
import {
  OUTCOMES, OUTCOME_SUITES, OUTCOME_TEXT, PROBLEMS, RECOMMENDATIONS, SIGNALS,
  SIGNAL_SUITES, SUITE_ROWS, type SuiteKey,
} from "./home-data";

/** "a, b and c" — for naming the problems a combined setup covers. */
function list(items: string[]) {
  return items.length < 2 ? items[0] ?? "" : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/**
 * 05 — the solution finder.
 *
 * Three questions, and a map of the RAMS suite that lights up as they are
 * answered: the problems pick base stacks, and the signals and outcomes each
 * add to them. The rules are the design's, unchanged.
 *
 * ── Every question takes more than one answer ───────────────────────
 * The design allowed one answer each, which forces a real operation to
 * describe itself as the single thing it most cares about — a site with rack
 * damage *and* MHE impacts had to pick. Each question now takes any number,
 * and the recommendation is the union of what they ask for: pick two problems
 * and the map shows the stack that covers both.
 *
 * One answer per question always stays selected. An empty question recommends
 * nothing, and a panel that can empty itself invites the reader to land on a
 * blank map and conclude RAMS does not cover them.
 *
 * The design drove this by hand — `classList.toggle` per row, `textContent`
 * per field, a `finderState` object beside the DOM. Here the answers are the
 * state and everything shown is derived from them, so the table cannot fall
 * out of step with the count above it, which is the one bug that shape
 * invites.
 */
export function HomeFinder() {
  const [problems, setProblems] = useState<string[]>(["rack"]);
  const [signals, setSignals] = useState<string[]>(["condition"]);
  const [outcomes, setOutcomes] = useState<string[]>(["action"]);

  /** Toggle, but never empty: the last answer standing cannot be turned off. */
  const toggle = (set: (f: (v: string[]) => string[]) => void) => (v: string) =>
    set((cur) => (cur.includes(v) ? (cur.length > 1 ? cur.filter((x) => x !== v) : cur) : [...cur, v]));

  const included = useMemo(() => {
    const set = new Set<SuiteKey>();
    problems.forEach((k) => RECOMMENDATIONS[k].suites.forEach((s) => set.add(s)));
    signals.forEach((k) => SIGNAL_SUITES[k].forEach((s) => set.add(s)));
    outcomes.forEach((k) => OUTCOME_SUITES[k].forEach((s) => set.add(s)));
    return set;
  }, [problems, signals, outcomes]);

  /* With one problem chosen the design's own title and lead stand. With
     several there is no single named setup, so the panel says what it is: the
     stack that covers all of them, named in the order they were asked. */
  const single = problems.length === 1 ? RECOMMENDATIONS[problems[0]] : null;
  const chosen = PROBLEMS.filter((p) => problems.includes(p.v));
  const title = single ? single.title : "Your combined RAMS setup";
  const lead = single
    ? single.lead
    : `The highlighted stack covers ${list(chosen.map((p) => p.b.toLowerCase()))} in one physical context.`;

  return (
    <section className="section solution-finder" id="technology">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">Find Your RAMS Solution</div>
          <h2>Start with the operational problem.</h2>
          <p>
            Answer three quick questions. RAMS recommends the hardware, platform and operating
            context that fit the challenge—not a one-size-fits-all stack.
          </p>
        </div>

        <div className="finder-grid reveal">
          <div className="finder-questions" aria-label="RAMS solution finder questions">
            <fieldset className="finder-step">
              <legend>
                <span>01</span> What needs attention?
              </legend>
              <p>Choose the operational problems to solve — as many as apply.</p>
              <div className="choice-grid">
                {PROBLEMS.map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    className={"solution-choice" + (problems.includes(o.v) ? " selected" : "")}
                    aria-pressed={problems.includes(o.v)}
                    onClick={() => toggle(setProblems)(o.v)}
                  >
                    <b>{o.b}</b>
                    <small>{o.s}</small>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="finder-step">
              <legend>
                <span>02</span> What should RAMS understand?
              </legend>
              <p>Select every physical signal that matters.</p>
              <div className="finder-pills">
                {SIGNALS.map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    className={"solution-pill" + (signals.includes(o.v) ? " selected" : "")}
                    aria-pressed={signals.includes(o.v)}
                    onClick={() => toggle(setSignals)(o.v)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="finder-step">
              <legend>
                <span>03</span> What should happen next?
              </legend>
              <p>Define the operating responses you need.</p>
              <div className="finder-pills">
                {OUTCOMES.map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    className={"solution-pill" + (outcomes.includes(o.v) ? " selected" : "")}
                    aria-pressed={outcomes.includes(o.v)}
                    onClick={() => toggle(setOutcomes)(o.v)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <aside className="recommendation-panel" aria-live="polite">
            <div className="recommendation-top">
              <span>Your recommended setup</span>
              <button
                type="button"
                onClick={() => {
                  setProblems(["rack"]);
                  setSignals(["condition"]);
                  setOutcomes(["action"]);
                }}
              >
                Start over ↗
              </button>
            </div>
            <h3>{title}</h3>
            <p>{lead}</p>

            <div className="suite-table-head">
              <span>RAMS suite map</span>
              <small>{included.size} of {SUITE_ROWS.length} components recommended</small>
            </div>

            <div className="suite-table-wrap">
              <table className="suite-table">
                <thead>
                  <tr>
                    <th>Layer</th>
                    <th>RAMS capability</th>
                    <th>Role</th>
                    <th>Now</th>
                  </tr>
                </thead>
                <tbody>
                  {SUITE_ROWS.map((r) => (
                    <tr key={r.key} className={included.has(r.key) ? "included" : undefined}>
                      {r.layer ? <td rowSpan={r.span}>{r.layer}</td> : null}
                      <td>{r.name}</td>
                      <td>{r.role}</td>
                      <td>
                        <i />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="recommendation-outcome">
              <span>Result</span>
              {outcomes.map((o) => (
                <p key={o}>{OUTCOME_TEXT[o]}</p>
              ))}
            </div>

            <div className="recommendation-actions">
              <a className="btn primary" href="/contact">
                Discuss this setup →
              </a>
              <a className="finder-link" href="#platform">
                Explore the platform
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
