"use client";

import { useEffect, useState } from "react";
import { Head, Reveal } from "@/components/sections/hardware/hw-shared";
import {
  QUESTIONS,
  compute,
  fromQuery,
  omniboxHref,
  summary,
  type Answers,
} from "./loc-data";

/**
 * 05 — three questions, one recommended stack.
 *
 * The page's other half of the argument: the sandbox shows what each technology
 * can do, this says which one the reader's own job needs. `compute()` in
 * `loc-data.ts` is deliberately a short set of rules rather than a score, so
 * the answer can be argued with.
 *
 * ── Built on the OmniBox builder, not on a wizard ───────────────────
 * This was three sequential steps: one question on screen, the next replacing
 * it, the answer only at the end. The OmniBox page's `OmniBuilder` had already
 * settled the better shape for the same job — every question visible at once,
 * in numbered fieldsets, beside a panel that fills in as you pick — and two
 * pages asking three questions in two different ways was the kind of
 * inconsistency a reader feels without being able to name.
 *
 * So the shell is that one, down to `.builder` / `.b-step` / `.b-opt`, which
 * live in `hardware-omni.css` under `.hw-page` and so already apply here.
 * Three differences are deliberate:
 *
 *   · **The answers stay single-select.** OmniBuilder is multi-select because
 *     a site can be several places at once; `compute()` takes exactly one
 *     answer per question, and a stack recommendation built from "10 mm *and*
 *     10 m" would be incoherent. So these are radios in behaviour, and the
 *     option carries `aria-checked` rather than `aria-pressed`.
 *   · **The panel says what it is waiting for.** With nothing answered
 *     OmniBuilder can still draw an empty hub; a stack recommendation cannot
 *     half-exist, so the panel names the questions still outstanding instead
 *     of showing a result that is not yet earned.
 *   · **The questions still arrive one at a time.** A question appears once
 *     everything before it is answered, and answered ones stay on screen so a
 *     reader can change their mind. Three unanswered questions stacked up on
 *     arrival read as a form; one at a time reads as being asked something.
 *     The panel carries the progress, so no step counter is needed.
 *
 * ── The cross-page link ─────────────────────────────────────────────
 * Arriving with `?find=…&prec=…&act=…` — the link the OmniBox page carries
 * back — now pre-selects the three answers rather than skipping to a result,
 * because with every question on screen there is nothing to skip. Only those
 * three ids travel; everything shown is recomputed here, so the link cannot be
 * edited into a claim we would not make. It is read from
 * `window.location.search` in an effect rather than with `useSearchParams()`,
 * which would cost this route its static prerender.
 *
 * **Nothing is sent from this page.** Both email buttons open the reader's own
 * mail client with the summary already written; there is no endpoint and no
 * analytics behind them. The note under the card says so, because a form that
 * asks for an email address and does not explain itself is a form people do
 * not fill in.
 */
export function LocQuiz() {
  const [a, setA] = useState<Partial<Answers>>({});
  const [mail, setMail] = useState("");
  const [err, setErr] = useState(false);

  /* Deferred to a frame callback rather than run in the effect body: a
     synchronous setState there cascades a second render, which is the same
     reason `layout/Header.tsx` reads the hero tone in one. */
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const back = fromQuery(window.location.search);
      if (back) setA(back);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  /* Questions arrive one at a time: a question is on screen once every
     question before it has an answer. Answered ones stay put so a reader can
     see and change what they picked, but the section never opens with three
     unanswered questions stacked up — which read as a form to fill in rather
     than a conversation. */
  const reached = QUESTIONS.findIndex((q) => !a[q.k]);
  const upTo = reached === -1 ? QUESTIONS.length - 1 : reached;
  const done = QUESTIONS.every((q) => a[q.k]);
  const s = done ? compute(a as Answers) : null;
  const left = QUESTIONS.filter((q) => !a[q.k]).length;

  const send = (to: string) => {
    const stack = compute(a as Answers);
    const subject = "Location Intelligence stack: " + stack.title;
    const body = summary(a as Answers, stack);
    window.location.href =
      "mailto:" +
      encodeURIComponent(to) +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body);
  };

  const sendToMe = () => {
    const v = mail.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) {
      setErr(true);
      return;
    }
    setErr(false);
    send(v);
  };

  return (
    <section className="section" id="stack">
      <div className="wrap">
        <Head
          label="Find your stack"
          top="Three questions."
          bottom="One recommended stack."
          intro="Three questions, one at a time, and the recommendation settles as you go. Every answer is a rule you can argue with, not a score — the reason is always on the card."
        />

        <div className="builder">
          <div className="b-steps">
            {QUESTIONS.filter((_, i) => i <= upTo).map((q, i) => (
              <Reveal as="div" key={q.k}>
                <fieldset className="b-step">
                  <legend>
                    <span className="b-n">{i + 1}</span>
                    {q.q}
                    <small>Pick one</small>
                  </legend>
                  <div className="b-opts big" role="radiogroup" aria-label={q.q}>
                    {q.opts.map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        className="b-opt"
                        role="radio"
                        aria-checked={a[q.k] === o.id}
                        onClick={() =>
                          setA((prev) =>
                            /* Picking the selected option again clears it, so a
                               reader can back out of a question without having
                               to restart the whole thing. */
                            prev[q.k] === o.id ? { ...prev, [q.k]: undefined } : { ...prev, [q.k]: o.id },
                          )
                        }
                      >
                        <span>
                          <b>{o.l}</b>
                          <span>{o.s}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </fieldset>
              </Reveal>
            ))}
          </div>

          <Reveal as="div" className="b-result" delay={120}>
            <div className="quiz" aria-live="polite">
              {!done && (
                <div className="res-wait">
                  <span className="res-wait-n">{3 - left}/3</span>
                  <p>
                    {left === 3
                      ? "Answer the three questions and the stack that fits appears here."
                      : left === 1
                        ? "One question left."
                        : `${left} questions left.`}
                  </p>
                </div>
              )}

              {done && s && (
                <div className="res">
                  <div className="res-top">
                    <span className={"badge " + (s.T.live ? "live" : "pilot")}>{s.T.badge}</span>
                    <h3>{s.title}</h3>
                    <p className="res-acc">
                      {s.acc}
                      <span> {s.accNote}</span>
                    </p>
                  </div>

                  <p className="res-why">{s.why}</p>
                  {/* Only present when the action forced the accuracy up a step. */}
                  {s.note && <p className="res-note">{s.note}</p>}

                  <ul className="res-kit">
                    {s.kit.map((k) => (
                      <li key={k}>{k}</li>
                    ))}
                  </ul>

                  <div className="res-mail">
                    <input
                      type="email"
                      value={mail}
                      onChange={(e) => setMail(e.target.value)}
                      placeholder="you@company.com"
                      aria-label="Your email address"
                    />
                    <button type="button" className="btn btn-primary btn-sm" onClick={sendToMe}>
                      Email me this
                    </button>
                    <a className="btn btn-secondary btn-sm" href={omniboxHref(a as Answers)}>
                      See it on the {s.boxName} page
                    </a>
                    <button
                      type="button"
                      className="link"
                      onClick={() => send("connect@rams.digital")}
                    >
                      Send it to RAMS
                    </button>
                  </div>
                  {err && <p className="res-err">Add an email address first.</p>}

                  <div className="quiz-foot">
                    <button
                      type="button"
                      className="link"
                      onClick={() => {
                        setA({});
                        setErr(false);
                      }}
                    >
                      Start over
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>

        <p className="note center">
          Nothing is sent from this page — the email buttons open your own mail app with the summary
          already written.
        </p>
      </div>
    </section>
  );
}
