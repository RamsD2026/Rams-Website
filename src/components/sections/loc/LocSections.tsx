"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Head, Reveal } from "@/components/sections/hardware/hw-shared";
import { FAQ, JOBS, PILOT_STEPS, PROBLEMS } from "./loc-data";

/** The site's FAQ easing, from `rackiq-shared`. */
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * 02, 06–11 — the seven sections that carry no state of their own.
 *
 * Only the FAQ has behaviour, and splitting seven short sections across seven
 * files would cost more in imports than it buys in navigation. The three with
 * state — hero, sandbox, quiz — each have their own file.
 */

/* ── 02 the problem ──────────────────────────────────────────────── */

export function LocProblem() {
  return (
    <section className="section" id="why">
      <div className="wrap">
        <Head
          label="The problem"
          top="GPS stops at the door."
          intro="Outside, everything knows where it is. Inside a shed full of steel racking, almost nothing does — so most sites can tell you what happened, but not where."
          center
        />
        <div className="pcards3">
          {PROBLEMS.map((p, i) => (
            <Reveal key={p.n} as="section" className="pcard3" delay={i * 70}>
              <span className="n">{p.n}</span>
              <h3>{p.h}</h3>
              <p>{p.p}</p>
            </Reveal>
          ))}
        </div>

        {/* The deck lands the section on one line rather than trailing off after
            the cards. It is the sentence the whole page is an answer to. */}
        <Reveal className="principle">
          <p>
            RAMS adds the <span>where</span> to everything else you already measure.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 06 where it's used ──────────────────────────────────────────── */

/**
 * Six jobs, not six technologies — the section exists to stop the conversation
 * starting at "do you do UWB?". Each tile carries the technologies that answer
 * it, with the one we run today marked, so the honesty constraint survives even
 * here where the copy is at its most confident.
 */
export function LocJobs() {
  return (
    <section className="section dark" id="jobs">
      <div className="wrap">
        <Head
          label="Where it’s used"
          top="Pick the job,"
          bottom="not the technology."
          intro="Tell us what you want to know. We’ll bring the technology that answers it at the lowest cost and the least disruption."
        />
        <div className="jobs">
          {JOBS.map((j, i) => (
            <Reveal key={j.h} as="section" className="job" delay={(i % 3) * 60}>
              <h3>{j.h}</h3>
              <p>{j.p}</p>
              <div className="tags">
                {j.tags.map((t) => (
                  <span key={t.t} className={t.live ? "live" : undefined}>
                    {t.t}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 07 where we are today ───────────────────────────────────────── */

/* ── 08 how it fits ──────────────────────────────────────────────── */

/**
 * Sense → decide → understand.
 *
 * The reference pointed its two cross-links at sibling static sites
 * (`../Omnibox Website/`, `../AI Camera Website - General/`). Both are real
 * routes here, and the third tile is about the Digital Twin, so it points at the
 * Digital Twin page rather than at the camera the reference had to settle for.
 */
export function LocHow() {
  return (
    <section className="section" id="how">
      <div className="wrap">
        <Head
          label="How it fits"
          top="Sensors. Box."
          bottom="One live picture."
          intro="Position on its own is just a dot. It gets useful when it lands next to everything else you already collect."
        />
        <div className="flow3">
          <Reveal className="tile">
            <span className="n">01 · Sense</span>
            <h3>Sensors and tags</h3>
            <p>
              LiDAR on the asset, or tags and anchors around the building. We pick the mix that
              answers your question.
            </p>
          </Reveal>
          <Reveal className="tile" delay={70}>
            <span className="n">02 · Decide</span>
            <h3>OmniBox, on site</h3>
            <p>
              The box turns raw distances into a position, checks it against your zones and rules,
              and acts in the moment — no cloud in the loop.
            </p>
            <a className="link" href="/hardware/omnibox">
              Explore OmniBox
            </a>
          </Reveal>
          <Reveal className="tile ink" delay={140}>
            <span className="n">03 · Understand</span>
            <h3>RAMS Digital Twin</h3>
            <p>
              Every position, event and impact on one live picture of the floor — for the safety
              review, the layout study and the management meeting.
            </p>
            <a className="link" href="/platform/digital-twin">
              See the Digital Twin
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── 09 the pilot ────────────────────────────────────────────────── */

export function LocPilot() {
  return (
    <section className="section white" id="pilot">
      <div className="wrap">
        <Head
          label="How we start"
          top="Start with one aisle."
          intro="Four steps, a few weeks, and a number you can trust before anyone signs off a building-wide rollout."
        />
        <ol className="steps four">
          {PILOT_STEPS.map((s, i) => (
            <Reveal key={s.b} as="li" delay={i * 70}>
              <b>{s.b}</b>
              <span>{s.s}</span>
            </Reveal>
          ))}
        </ol>
        <Reveal className="cta-actions start">
          <a
            className="btn btn-primary"
            href="mailto:connect@rams.digital?subject=Location%20Intelligence%20pilot"
          >
            Start a pilot
          </a>
          <a className="btn btn-secondary" href="#accuracy">
            See the accuracy again
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 10 faq ──────────────────────────────────────────────────────── */

/**
 * On the site's FAQ pattern, as on the other two hardware pages: hairline rows,
 * the question at card-title weight, first row open, and a two-bar toggle whose
 * vertical bar scales to zero. The reference shipped a native `<details>` list
 * with a script that closed the others.
 */
export function LocFAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="section" id="faq">
      <div className="wrap">
        <Head label="FAQ" top="Frequently asked questions." className="one-line" />
        <div className="faq">
          {FAQ.map((f, i) => {
            const on = open === i;
            return (
              <div key={f.q} className={"faq-row" + (on ? " on" : "")}>
                <button
                  type="button"
                  className="faq-q"
                  aria-expanded={on}
                  onClick={() => setOpen(on ? null : i)}
                >
                  <span>{f.q}</span>
                  <span className="faq-toggle" aria-hidden>
                    <i />
                    <i />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      className="faq-a"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    >
                      <p>{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── 11 close ────────────────────────────────────────────────────── */

export function LocCTA() {
  return (
    <section className="section cta white" id="contact">
      <Reveal className="wrap">
        <span className="label">Start here</span>
        <h2 className="h2">What would you find first?</h2>
        <p className="intro">
          A truck, a trolley, a person near a machine, or the whole floor in 3D. Tell us the question
          and we’ll bring the cheapest honest way to answer it.
        </p>
        <div className="cta-actions">
          <a
            className="btn btn-primary"
            href="mailto:connect@rams.digital?subject=Location%20Intelligence%20enquiry"
          >
            Talk to us
          </a>
          <a className="btn btn-secondary" href="tel:+919028638907">
            +91 90286 38907
          </a>
        </div>
        <p className="cta-meta">
          Runs on site · Works without internet · Piloted before it is promised
        </p>
      </Reveal>
    </section>
  );
}
