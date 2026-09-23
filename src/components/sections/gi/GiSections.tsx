"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Head, Media, Reveal } from "@/components/sections/hardware/hw-shared";
import { StageBadge } from "./GiShared";
import { COMPARE_ROWS, FAQ, INFO, MACHINES, WHERE } from "./gi-data";

/** The site's FAQ easing, from `rackiq-shared`. */
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * 06–11 — Compare, where it's used, works with, where we are today, FAQ and the
 * close. Only the FAQ carries behaviour, so they share a file.
 */

/* ── 06 compare ──────────────────────────────────────────────────── */

export function GiCompare() {
  return (
    <section className="section" id="compare">
      <div className="wrap">
        <Head label="Compare" top="Side by side." />
        <Reveal className="cmp-wrap">
          <table className="cmp two">
            <thead>
              <tr>
                <th scope="col">
                  <span style={{ position: "absolute", left: -9999 }}>Feature</span>
                </th>
                {MACHINES.map((m) => (
                  <th scope="col" key={m.key}>
                    <Media src={m.img} alt="" label={m.img} className="contain" tone="light" />
                    <b>{INFO[m.key].name}</b>
                    <span>{INFO[m.key].tag}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row) => (
                <tr key={row.h}>
                  <th scope="row">{row.h}</th>
                  {[row.air, row.floor].map((cell, i) => (
                    <td key={i} className={cell === "—" ? "no" : undefined}>
                      {cell === true ? <span className="yes" aria-label="Yes" /> : cell}
                    </td>
                  ))}
                </tr>
              ))}
              {/* The last row is the stage, so the table cannot be read as a
                  comparison of two things you could order today. */}
              <tr>
                <th scope="row">Stage</th>
                {MACHINES.map((m) => (
                  <td key={m.key}>
                    <StageBadge machine={m.key} />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 07 where it's used ──────────────────────────────────────────── */

/**
 * The seven scene photographs were never generated, so each tile renders the
 * reference's own missing-media treatment carrying the file name that belongs
 * there. That is a designed state rather than an error path — and its spec adds
 * a rule for whoever fills them: **no photograph here may show a drone or a
 * robot**, because nothing on this page may imply the machines already exist.
 */
export function GiWhere() {
  return (
    <section className="section dark" id="where">
      <div className="wrap">
        <Head
          label="Where it’s used"
          top="Buildings with more"
          bottom="up top and underneath."
          intro="Wherever racking runs high, stock moves fast, or the floor carries more than anyone planned for."
        />
        <div className="where">
          {WHERE.map((w, i) => (
            <Reveal key={w.h} className={"wtile" + (w.wide ? " wide" : "")} delay={(i % 3) * 60}>
              <Media alt={w.alt} label={w.img} />
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

/* ── 08 works with ───────────────────────────────────────────────── */

/* ── 09 where we are today ───────────────────────────────────────── */

/* ── 10 faq ──────────────────────────────────────────────────────── */

export function GiFAQ() {
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

/* ── 11 close ────────────────────────────────────────────────────── */

export function GiCTA() {
  return (
    <section className="section cta white" id="contact">
      <Reveal className="wrap">
        <span className="label">Start here</span>
        <h2 className="h2">What would you look at first?</h2>
        <p className="intro">
          The racking you sign off every year without really seeing, or the floor you’re about to put automation on.
          Tell us which one keeps you up.
        </p>
        <div className="cta-actions">
          <a className="btn btn-primary" href="mailto:connect@rams.digital?subject=Guided%20Inspection%20enquiry">
            Tell us what to look at
          </a>
          <a className="btn btn-secondary" href="tel:+919028638907">
            +91 90286 38907
          </a>
        </div>
        <p className="cta-meta">Every bay and every metre · Findings on your own plan · By RAMS Digital</p>
      </Reveal>
    </section>
  );
}
