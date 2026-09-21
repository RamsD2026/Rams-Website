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
 * can do, this says which one the reader's own job needs. Three taps, then a
 * named stack with its accuracy, its kit list and — the part that matters — the
 * reason, in a sentence anyone can check. `compute()` in `loc-data.ts` is
 * deliberately a short set of rules rather than a score, so the answer can be
 * argued with.
 *
 * **Nothing is sent from this page.** Both email buttons open the reader's own
 * mail client with the summary already written; there is no endpoint and no
 * analytics behind them. The note under the card says so, because a form that
 * asks for an email address and does not explain itself is a form people do not
 * fill in.
 *
 * Arriving with `?find=…&prec=…&act=…` — the link the Omnibox page carries
 * back — skips straight to the result. Only those three ids travel; everything
 * shown is recomputed here, so the link cannot be edited into a claim we would
 * not make. It is read from `window.location.search` in an effect rather than
 * with `useSearchParams()`, which would cost this route its static prerender.
 */
export function LocQuiz() {
  const [a, setA] = useState<Partial<Answers>>({});
  const [step, setStep] = useState(0);
  const [mail, setMail] = useState("");
  const [err, setErr] = useState(false);

  /* Deferred to a frame callback rather than run in the effect body: a
     synchronous setState there cascades a second render, which is the same
     reason `layout/Header.tsx` reads the hero tone in one. */
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const back = fromQuery(window.location.search);
      if (!back) return;
      setA(back);
      setStep(3);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const done = step >= 3;
  const s = done ? compute(a as Answers) : null;

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

  const Q = QUESTIONS[Math.min(step, QUESTIONS.length - 1)];

  return (
    <section className="section white" id="stack">
      <div className="wrap">
        <Head label="Find your stack" top="Three questions." bottom="One recommended stack." center />

        <Reveal className="quiz">
          <div className="quiz-top">
            <span className="quiz-step">{done ? "Your stack" : "Question " + (step + 1) + " of 3"}</span>
            <span className="quiz-dots" aria-hidden>
              {[0, 1, 2].map((i) => (
                <i key={i} className={i < step ? "done" : i === step ? "on" : undefined} />
              ))}
            </span>
          </div>

          <div className="quiz-body" aria-live="polite">
            {!done && (
              <>
                <h3 className="quiz-q">{Q.q}</h3>
                <div className="q-opts">
                  {Q.opts.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      className={"q-opt" + (a[Q.k] === o.id ? " on" : "")}
                      onClick={() => {
                        setA((prev) => ({ ...prev, [Q.k]: o.id }));
                        setStep(step + 1);
                      }}
                    >
                      <b>{o.l}</b>
                      <span>{o.s}</span>
                    </button>
                  ))}
                </div>
                {step > 0 && (
                  <div className="quiz-foot">
                    <button type="button" className="link" onClick={() => setStep(step - 1)}>
                      Back
                    </button>
                  </div>
                )}
              </>
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
                  <button type="button" className="link" onClick={() => send("connect@rams.digital")}>
                    Send it to RAMS
                  </button>
                </div>
                {err && <p className="res-err">Add an email address first.</p>}

                <div className="quiz-foot">
                  <button type="button" className="link" onClick={() => setStep(2)}>
                    Back
                  </button>
                  <button
                    type="button"
                    className="link"
                    onClick={() => {
                      setA({});
                      setStep(0);
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

        <p className="note center">
          Nothing is sent from this page — the email buttons open your own mail app with the summary
          already written.
        </p>
      </div>
    </section>
  );
}
