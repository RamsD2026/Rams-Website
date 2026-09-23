"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Head, Media, Reveal } from "@/components/sections/hardware/hw-shared";
import {
  COMPARE_HEAD, COMPARE_ROWS, CONNECTS, CORE_SHAPE, CORE_STEPS, FAQ, LOOP,
  MODEL_BY_KEY, WHERE,
} from "./omni-data";

/** The site's FAQ easing, from `rackiq-shared`. */
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The loop, Compare, Where it's used, What it connects to, Works with, Core,
 * FAQ and the close.
 *
 * Eight short sections in one file: only the FAQ carries behaviour, and
 * splitting them eight ways would cost more in imports than it buys in
 * navigation.
 */

/* ── the loop ────────────────────────────────────────────────────── */

/**
 * Sense. Decide. Act. Sync. — copy deck §3.
 *
 * The page had no how-it-works loop. `FORMULA`, rendered up in `OmniFamily`,
 * lists what a box is made of (compute, connectivity, context, action); this is
 * what it does with those parts, in order. The sibling AI Camera page has
 * carried its equivalent from the start as "See. Understand. Act.", and the
 * absence here was the reason this page jumped from the problem straight to a
 * product catalogue.
 *
 * Numbered, unlike most lists on these pages, because this genuinely is a
 * sequence — each beat hands to the next, and the last one is the only part
 * that needs a network.
 */
export function OmniLoop() {
  return (
    <section className="section dark" id="loop">
      <div className="wrap">
        <Head
          center
          label="How it works"
          top="Sense. Decide."
          bottom="Act. Sync."
          intro="A camera can detect. A sensor can measure. A machine can raise a fault. None of those is a decision — the value shows up when they are read together and something useful happens next."
        />
        <ol className="loop">
          {LOOP.map((l, i) => (
            <Reveal as="li" key={l.b} className="loop-step" delay={i * 90}>
              <span className="loop-n">{l.n}</span>
              <h3>{l.b}</h3>
              <p>{l.s}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── what it connects to ─────────────────────────────────────────── */

/**
 * "Built to connect with the equipment already on the floor" — copy deck §3.
 *
 * `INSIDE_CAPS` already says what each individual box accepts, but that is
 * spread across four model panels behind a tab. The question a maintenance
 * engineer actually arrives with is "will it talk to ours?", and that deserves
 * one consolidated answer rather than four partial ones.
 *
 * The closing note is the deck's own and is load-bearing rather than cautious
 * boilerplate: voltages, safety architecture and I/O genuinely differ per
 * machine, and the page should not imply that any signal on the list is a
 * plug-in job.
 */
export function OmniConnects() {
  return (
    <section className="section white" id="connects">
      <div className="wrap">
        <Head
          label="What it connects to"
          top="It meets the floor"
          bottom="as you already built it."
          intro="Depending on the configuration, an OmniBox can take in and drive most of what is already out there. Nothing here asks you to replace a working sensor."
        />
        <ul className="connects">
          {CONNECTS.map((c, i) => (
            <Reveal as="li" key={c} delay={i * 40}>
              {c}
            </Reveal>
          ))}
        </ul>
        <p className="note">
          The final interface and its failure behaviour are reviewed against the specific machine
          and use case before anything is deployed. Machine signals, voltages, safety architecture
          and I/O requirements vary too much between applications for that to be assumed.
        </p>
      </div>
    </section>
  );
}

/* ── 05 compare ──────────────────────────────────────────────────── */

export function OmniCompare() {
  return (
    <section className="section" id="compare">
      <div className="wrap">
        <Head label="Compare" top="Side by side." />
        <Reveal className="cmp-wrap">
          <table className="cmp">
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr-only" style={{ position: "absolute", left: -9999 }}>
                    Feature
                  </span>
                </th>
                {COMPARE_HEAD.map((c) => (
                  <th scope="col" key={c.key}>
                    <Media
                      src={MODEL_BY_KEY[c.key].img}
                      alt=""
                      label={MODEL_BY_KEY[c.key].img}
                      className="contain"
                      tone="light"
                    />
                    <b>{c.b}</b>
                    <span>{c.s}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row) => (
                <tr key={row.h}>
                  <th scope="row">{row.h}</th>
                  {row.cells.map((cell, i) => (
                    <td key={i} className={cell === "—" ? "no" : undefined}>
                      {cell === true ? <span className="yes" aria-label="Yes" /> : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 06 where it's used ──────────────────────────────────────────── */

export function OmniWhere() {
  return (
    <section className="section dark" id="where">
      <div className="wrap">
        <Head
          label="Where it’s used"
          top="On the floors"
          bottom="that keep you running."
          intro="Warehouses, production lines, robot cells and fleets — wherever people, machines and parts need something to keep an eye out."
        />
        <div className="where">
          {WHERE.map((w, i) => (
            <Reveal key={w.h} className={"wtile" + (w.wide ? " wide" : "")} delay={(i % 3) * 60}>
              <Media src={w.img} alt={w.alt} label={w.img} />
              <div className="wt">
                <div className="mpills">
                  {w.models.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
                <h3>{w.h}</h3>
                <p>{w.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 07 works with ───────────────────────────────────────────────── */

export function OmniWorks() {
  return (
    <section className="section" id="works">
      <div className="wrap">
        <Head label="Works with" top="Part of a" bottom="bigger picture." />
        <div className="bento">
          <Reveal className="tile span-7">
            <span className="label">RAMS AI Camera</span>
            <h3>The eyes. OmniBox is the hands.</h3>
            <p className="sub">
              The AI Camera spots people, PPE and zones. Paired with OmniBox Edge, it stops the
              robot, holds the door or sounds the alarm.
            </p>
            {/* The reference linked a sibling static site; this is the real route. */}
            <a className="link" href="/hardware/ai-vision">
              Explore the AI Camera
            </a>
          </Reveal>

          <Reveal className="tile span-5" delay={80}>
            <span className="label">Sensors</span>
            <h3>The ones you already use.</h3>
            <div className="pills">
              {["360° cameras", "LiDAR", "Impact sensors", "RFID", "Weight sensors", "Displays"].map((p) => (
                <span key={p}>{p}</span>
              ))}
            </div>
          </Reveal>

          <Reveal className="tile ink span-12">
            <span className="label">RAMS Digital Twin</span>
            <h3 style={{ maxWidth: "18em" }}>Every event from every box, on one screen.</h3>
            <p className="sub" style={{ maxWidth: "40em" }}>
              Near-misses, zone entries, failed checks and impacts — ready for the safety review and
              the management meeting, not just the shift.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── 08 core ─────────────────────────────────────────────────────── */

export function OmniCore() {
  return (
    <section className="section white" id="core">
      <div className="wrap">
        <Head
          label="OmniBox Core"
          top="Built around"
          bottom="your problem."
          intro="Some jobs don’t fit a standard box. Core is how we build one that does — using the same parts and know-how as the rest of the family."
        />
        <ol className="steps five">
          {CORE_STEPS.map((s, i) => (
            <Reveal key={s.b} as="li" delay={i * 60}>
              <b>{s.b}</b>
              <span>{s.s}</span>
            </Reveal>
          ))}
        </ol>
        <Reveal className="shape">
          <div className="pills" aria-label="What we can shape">
            {CORE_SHAPE.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
          <a
            className="btn btn-primary"
            href="mailto:connect@rams.digital?subject=OmniBox%20Core%20project"
          >
            Start a Core project
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 09 faq ──────────────────────────────────────────────────────── */

/**
 * On the site's FAQ pattern, as on /hardware/ai-vision: hairline rows, the
 * question at card-title weight, first row open, and a two-bar toggle whose
 * vertical bar scales to zero. The reference shipped a native `<details>` list.
 */
export function OmniFAQ() {
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

/* ── 10 close ────────────────────────────────────────────────────── */

export function OmniCTA() {
  return (
    <section className="section cta white" id="contact">
      <Reveal className="wrap">
        <span className="label">Start here</span>
        <h2 className="h2">Tell us what you’d fix first.</h2>
        <p className="intro">
          A cell, a line, a door or a fleet. We’ll visit, see how the work actually happens, and
          recommend the right OmniBox — no obligation.
        </p>
        <div className="cta-actions">
          <a className="btn btn-primary" href="mailto:connect@rams.digital?subject=OmniBox%20enquiry">
            Talk to us
          </a>
          <a className="btn btn-secondary" href="tel:+919028638907">
            +91 90286 38907
          </a>
        </div>
        <p className="cta-meta">
          Decides on site · Works without internet · Built and supported by RAMS Digital
        </p>
      </Reveal>
    </section>
  );
}
