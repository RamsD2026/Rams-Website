"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Head, Media, Reveal } from "@/components/sections/hardware/hw-shared";
import { StageBadge, StageRail } from "./GiShared";
import { COMPARE_ROWS, FAQ, INFO, MACHINES, PARTNER_PILLS, PARTNER_STEPS, WHERE } from "./gi-data";

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

/**
 * The reference pointed all three tiles at sibling static sites. All three are
 * real routes here.
 */
export function GiWorks() {
  return (
    <section className="section" id="works">
      <div className="wrap">
        <Head label="Works with" top="Part of a" bottom="bigger picture." />
        <div className="bento">
          <Reveal className="tile span-7">
            <span className="label">RAMS AI Camera</span>
            <h3>Eyes that stay. Eyes that move.</h3>
            <p className="sub">
              The AI Camera watches the places where people and machines meet. AirScan and FloorScan go and look at
              everything it can’t see — the top of the racking and the floor underneath.
            </p>
            <a className="link" href="/hardware/ai-vision">
              Explore the AI Camera
            </a>
          </Reveal>

          <Reveal className="tile span-5" delay={80}>
            <span className="label">Omnibox &amp; Location Intelligence</span>
            <h3>Decided on site. Put in its place.</h3>
            <p className="sub">The same on-site thinking as Omnibox, and the same sense of where things are.</p>
            <a className="link" href="/hardware/omnibox">
              Explore Omnibox
            </a>
          </Reveal>

          <Reveal className="tile ink span-12">
            <span className="label">RAMS Digital Twin</span>
            <h3 style={{ maxWidth: "18em" }}>Every finding, on the same picture as everything else.</h3>
            <p className="sub" style={{ maxWidth: "40em" }}>
              Rack damage next to the impacts that caused it. A void next to the trucks that drive over it. Ready for
              the engineer, the insurer and the management meeting.
            </p>
            <a className="link" href="/hardware/rtls">
              See Location Intelligence
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── 09 where we are today ───────────────────────────────────────── */

/**
 * The honesty section, and the page's actual ask.
 *
 * It takes the slot the Omnibox page gives to Core. Two stage rails, then what
 * is already real underneath (on-device vision, on-site decisions, LiDAR
 * positioning — all of which RAMS does run today), then four steps of what being
 * a design partner means. The CTA is "become a design partner", never "buy", on
 * this page and in both sheets.
 */
export function GiToday() {
  return (
    <section className="section white" id="today">
      <div className="wrap">
        <Head
          label="Where we are today"
          top="Built with you,"
          bottom="not just for you."
          intro="Both machines are concepts. Neither has run in a customer’s building yet, so you won’t find a spec sheet or a performance figure on this page — there’s nothing honest to measure yet."
        />

        <div className="stages">
          {MACHINES.map((m, i) => (
            <Reveal key={m.key} className="tile" delay={i * 70}>
              <h3>
                {INFO[m.key].name} <StageBadge machine={m.key} />
              </h3>
              <p className="sub">{INFO[m.key].tag}</p>
              <StageRail machine={m.key} />
            </Reveal>
          ))}
        </div>

        <Reveal className="honest">
          <p>
            <b>What’s already real is what sits underneath.</b> RAMS runs on-device vision, on-site decisions and LiDAR
            positioning in live industrial buildings today. Guided Inspection puts that on something that moves by
            itself.
          </p>
          <p>
            <b>So we’re looking for design partners.</b> A site with racking worth auditing or a floor worth worrying
            about, and people willing to tell us what would actually help — before we build the wrong thing.
          </p>
        </Reveal>

        <ol className="steps four">
          {PARTNER_STEPS.map((s, i) => (
            <Reveal key={s.b} as="li" delay={i * 60}>
              <b>{s.b}</b>
              <span>{s.s}</span>
            </Reveal>
          ))}
        </ol>

        <Reveal className="shape">
          <div className="pills" aria-label="What a design partner gets">
            {PARTNER_PILLS.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
          <a className="btn btn-primary" href="mailto:connect@rams.digital?subject=Guided%20Inspection%20design%20partner">
            Become a design partner
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 10 faq ──────────────────────────────────────────────────────── */

export function GiFAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="section" id="faq">
      <div className="wrap">
        <Head label="FAQ" top="Frequently asked" bottom="questions." />
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
          <a className="btn btn-primary" href="mailto:connect@rams.digital?subject=Guided%20Inspection%20design%20partner">
            Become a design partner
          </a>
          <a className="btn btn-secondary" href="tel:+919028638907">
            +91 90286 38907
          </a>
        </div>
        <p className="cta-meta">Coming soon · Built with design partners · By RAMS Digital</p>
      </Reveal>
    </section>
  );
}
