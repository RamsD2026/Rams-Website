"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Head, Media, Reveal } from "@/components/sections/hardware/hw-shared";
import { COMPARE_HEAD, COMPARE_ROWS, FAQ, WHERE } from "./sst-data";

/** The site's FAQ easing, from `rackiq-shared`. */
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * 09–12 — At a glance, where it's used, works with, FAQ and the close.
 *
 * Five short sections in one file: only the FAQ carries behaviour, and splitting
 * them five ways would cost more in imports than it buys in navigation.
 */

/* ── 09 at a glance ──────────────────────────────────────────────── */

/**
 * The whole stack as one table, with each sensor as a
 * row**. It is not one of the six sensors and is not sold as one, but a reader
 * comparing what each device answers wants it in the same list — and the three
 * LiDAR rows sitting together, all saying "LiDAR" in the last column, is the
 * clearest statement on the page that they are one sensor.
 */
export function SstCompare() {
  return (
    <section className="section white" id="compare">
      <div className="wrap">
        <Head label="At a glance" top="What each sensor answers." />
        <Reveal className="cmp-wrap">
          <table className="cmp">
            <thead>
              <tr>
                <th scope="col">
                  <span style={{ position: "absolute", left: -9999 }}>Sensor</span>
                </th>
                {COMPARE_HEAD.map((c) => (
                  <th scope="col" key={c}>
                    <b>{c}</b>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row) => (
                <tr key={row.h}>
                  <th scope="row">{row.h}</th>
                  {row.cells.map((cell, i) => (
                    <td key={i}>{cell}</td>
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

/* ── 10 where it's used ──────────────────────────────────────────── */

export function SstWhere() {
  return (
    <section className="section dark" id="where">
      <div className="wrap">
        <Head label="Where it’s used" top="Wherever trucks" bottom="and people share the floor." />
        <div className="where">
          {WHERE.map((w, i) => (
            <Reveal key={w.h} className={"wtile" + (w.wide ? " wide" : "") + (w.full ? " full" : "")} delay={(i % 3) * 60}>
              <Media src={w.img} alt={w.alt} label={w.img} />
              <div className="wt">
                <div className="mpills">
                  {w.pills.map((p) => (
                    <span key={p}>{p}</span>
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

/* ── 11 works with ───────────────────────────────────────────────── */

/**
 * The reference pointed all three tiles at sibling static sites. All three are
 * real routes here — `/hardware/omnibox`, `/hardware/rtls` and
 * `/hardware/ai-vision` — so they point at those.
 */
export function SstWorks() {
  return (
    <section className="section" id="works">
      <div className="wrap">
        <Head label="Works with" top="Part of a" bottom="bigger picture." />
        <div className="bento">
          <Reveal className="tile span-7">
            <span className="label">OmniBox Motion</span>
            <h3>Every sensor, into one box.</h3>
            <p className="sub">
              LiDAR, access control, pallet sensing and the rest plug into OmniBox Motion on the
              truck, which powers them, decides on the spot, and keeps the record.
            </p>
            <a className="link" href="/hardware/omnibox">
              Explore OmniBox
            </a>
          </Reveal>

          <Reveal className="tile span-5" delay={80}>
            <span className="label">Location Intelligence</span>
            <h3>The same LiDAR, the whole site.</h3>
            <p className="sub">
              Positioning for every truck, and the other ways RAMS locates things indoors.
            </p>
            <a className="link" href="/hardware/rtls">
              See positioning
            </a>
          </Reveal>

          <Reveal className="tile ink span-12">
            <span className="label">RAMS Digital Twin</span>
            <h3 style={{ maxWidth: "18em" }}>Every truck, every event, on one live picture.</h3>
            <p className="sub" style={{ maxWidth: "40em" }}>
              Who drove, where they went, how fast, what they hit, what they carried and how the
              battery held up — ready for the safety review and the fleet meeting.
            </p>
            <a className="link" href="/hardware/ai-vision">
              Add the AI Camera
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── 12 faq ──────────────────────────────────────────────────────── */

export function SstFAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="section white" id="faq">
      <div className="wrap">
        <Head label="FAQ" top="Frequently asked questions." className="one-line" />
        <div className="faq">
          {FAQ.map((f, i) => {
            const on = open === i;
            return (
              <div key={f.q} className={"faq-row" + (on ? " on" : "")}>
                <button type="button" className="faq-q" aria-expanded={on} onClick={() => setOpen(on ? null : i)}>
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

/* ── 13 close ────────────────────────────────────────────────────── */

export function SstCTA() {
  return (
    <section className="section cta" id="contact">
      <Reveal className="wrap">
        <span className="label">Start here</span>
        <h2 className="h2">Which question would you answer first?</h2>
        <p className="intro">
          Who’s driving, what they hit, how fast they go, where the trucks are, what’s on the forks
          or how the batteries are doing. Tell us, and we’ll fit the sensors that answer it.
        </p>
        <div className="cta-actions">
          <a className="btn btn-primary" href="mailto:connect@rams.digital?subject=Sensor%20Stack%20enquiry">
            Talk to us
          </a>
          <a className="btn btn-secondary" href="tel:+919028638907">
            +91 90286 38907
          </a>
        </div>
        <p className="cta-meta">
          Fits the trucks you have · Works without internet · Built and supported by RAMS Digital
        </p>
      </Reveal>
    </section>
  );
}
