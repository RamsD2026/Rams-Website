"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Head, Media, Reveal } from "./aiv-shared";
import { DEPLOY, FAQ, IMG, SPECS } from "./aiv-data";

/** The site's FAQ easing, from `rackiq-shared`. */
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * 08–11 — Deploy, Tech specs, FAQ and the close.
 *
 * Four short sections kept in one file: none of them carries behaviour beyond
 * the FAQ's one-open-at-a-time accordion, and splitting them four ways would
 * cost more in imports than it buys in navigation.
 */

export function AivDeploy() {
  return (
    <section className="section white" id="deploy">
      <div className="wrap">
        <Head
          label="Deploy"
          top="From survey"
          bottom="to live."
          intro="No rip-and-replace. The camera mounts beside what you already have and takes power from what is already there."
        />
        <ol className="steps">
          {DEPLOY.map((s, i) => (
            <Reveal key={s.b} as="li" delay={i * 60}>
              <b>{s.b}</b>
              <span>{s.s}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function AivSpecs() {
  return (
    <section className="section" id="specs">
      <div className="wrap">
        <div className="spec-top">
          <Head
            label="Tech specs"
            top="The sheet."
            intro="One unit, one specification — whichever environment it is going into."
          />
          <Reveal>
            <Media
              src={IMG.productLow}
              alt="The RAMS AI Camera, low angle"
              label="media/product-beauty-light.jpg"
            />
          </Reveal>
        </div>

        <div className="specs">
          {SPECS.map((g) => (
            <Reveal key={g.h} className="spec-row">
              <h3>{g.h}</h3>
              <dl>
                {g.rows.map(([dt, dd]) => (
                  <div key={dt}>
                    <dt>{dt}</dt>
                    <dd>{dd}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ))}
        </div>

        <p className="note">
          Figures reflect the published product claims on this page. Certification numbers, exact
          IP rating, dimensions and weight are to be confirmed against the final production unit.
        </p>
      </div>
    </section>
  );
}

/**
 * 10 — FAQ.
 *
 * Rebuilt on the site's own FAQ pattern rather than the reference's.
 *
 * Every other FAQ on this site — IRDS, Digital Twin, MEPS, RTSS, IMDS, ATOS,
 * AMS, Partners — is the same object, value for value: hairline rows on the
 * section ground rather than cards, the question at card-title weight, the
 * answer at body, the first row open on arrival, and a toggle made of two bars
 * forming a cross whose vertical bar scales to zero as the row opens, so plus
 * becomes minus in one transform instead of swapping an icon. The reference
 * shipped a native `<details>` list with a grey pseudo-element toggle, nothing
 * open, and no height animation — the one section on this page where the site
 * already had a better-resolved answer than the source did.
 *
 * What is kept from this page is its own section header, the sentence-case
 * orange label, because the other ten sections use it and a single mono eyebrow
 * here would read as a mistake rather than as consistency.
 *
 * The height animation is `framer-motion`, as on every other FAQ here. A CSS
 * `grid-template-rows` transition would avoid the dependency, but this page
 * already ships framer-motion through the rest of the site and matching the
 * house timing (0.4s on the shared ease) matters more than shaving an import.
 */
export function AivFAQ() {
  // First row open on arrival — the house default. It shows the reader what a
  // row does without asking them to guess that it opens.
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section white" id="faq">
      <div className="wrap">
        <Head label="FAQ" top="Questions" bottom="worth asking." />

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

export function AivCTA() {
  return (
    <section className="section cta" id="contact">
      <Reveal className="wrap">
        <span className="label">Start here</span>
        <h2 className="h2">Show us your floor.</h2>
        <p className="intro">
          A truck, a cell, a door, a zone. We walk the site, map where people and machines actually
          meet, and show you what the camera would catch. No obligation — you keep the survey either
          way.
        </p>
        <div className="cta-actions">
          <a
            className="btn btn-primary"
            href="mailto:connect@rams.digital?subject=AI%20Camera%20site%20assessment"
          >
            Book an assessment
          </a>
          <a className="btn btn-secondary" href="tel:+919028638907">
            +91 90286 38907
          </a>
        </div>
        <p className="cta-meta">
          Mounts beside existing equipment · Power from what is already there · On-device AI
        </p>
      </Reveal>
    </section>
  );
}
