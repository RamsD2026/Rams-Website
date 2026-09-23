"use client";

import { useState } from "react";
import { Head, Reveal, useReveal } from "@/components/sections/hardware/hw-shared";
import { StageBadge } from "./GiShared";
import { INFO, KNOW, MACHINES, PLACES, WHY, type MachineKey, type PlaceId } from "./gi-data";
import type { InsideView } from "./GiInside";

/**
 * 05 — Find your inspection.
 *
 * Two questions, both multi-select, on the OmniBox builder's shell. What's on
 * your floor, then what you want to know — and the second question only offers
 * what the first makes relevant, which is what keeps it to four or five options
 * instead of eight.
 *
 * ── It is pointed the other way round ───────────────────────────────
 * The OmniBox builder configures something you can buy. This cannot: both
 * machines are concepts. So the result panel sells a conversation instead — the
 * note under it says in as many words that sending this orders nothing, and the
 * section header says the answers tell us what to build first. That is the
 * honest version of a configurator for a product that does not exist, and it is
 * the reference's own framing.
 *
 * Before anything is picked in the second question the panel still suggests from
 * the floor alone, so it is never empty once the reader has answered anything.
 *
 * Nothing is sent from this page: the button opens the reader's own mail client
 * with the answers written out.
 */

const ICONS: Record<PlaceId, React.ReactNode> = {
  racking: <path d="M4 3v18M20 3v18M4 9h16M4 15h16" />,
  floor: <path d="M3 19h18M5 19v-6h6v6M13 19v-9h6v9" />,
  auto: (
    <>
      <rect x="5" y="8" width="14" height="9" rx="2" />
      <circle cx="9" cy="19.5" r="1.5" />
      <circle cx="15" cy="19.5" r="1.5" />
      <path d="M12 8V5M10 12h.01M14 12h.01" />
    </>
  ),
  slab: <path d="M3 14h18v6H3zM8 14l2-4 2 2 3-5" />,
};

export function GiChooser({
  onOpen,
  onInside,
}: {
  onOpen: (k: MachineKey) => void;
  onInside: (k: MachineKey, view?: InsideView) => void;
}) {
  const [place, setPlace] = useState<Record<string, boolean>>({});
  const [know, setKnow] = useState<Record<string, boolean>>({});
  const { ref: step1Ref, cls: step1Cls } = useReveal<HTMLFieldSetElement>();
  const { ref: step2Ref, cls: step2Cls } = useReveal<HTMLFieldSetElement>();

  const anyPlace = Object.keys(place).length > 0;
  const visibleKnow = KNOW.filter((k) => k.at.some((a) => place[a]));
  const picked = visibleKnow.some((k) => know[k.id]);

  /** Which machines the answers point at — or, before the second question is
      answered, which the floor alone suggests. */
  const machines: MachineKey[] = (() => {
    const m: Partial<Record<MachineKey, boolean>> = {};
    for (const k of visibleKnow) if (know[k.id]) m[k.m] = true;
    if (!Object.keys(m).length) {
      if (place.racking) m.airscan = true;
      if (place.floor || place.auto || place.slab) m.floorscan = true;
    }
    return (["airscan", "floorscan"] as MachineKey[]).filter((k) => m[k]);
  })();

  const toggle = (set: typeof setPlace, id: string) =>
    set((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });

  const reset = () => {
    setPlace({});
    setKnow({});
  };

  const title = machines.map((k) => INFO[k].name).join(" + ");

  const mailHref = (() => {
    const names = (list: { id: string; label: string }[], sel: Record<string, boolean>) =>
      list.filter((o) => sel[o.id]).map((o) => o.label).join(", ");
    const body =
      "Hi RAMS Digital,\n\nI’d like to talk about Guided Inspection.\n\n" +
      "What we’re up against: " + names(PLACES, place) + "\n" +
      "What we want to know: " + (names(visibleKnow, know) || "-") + "\n" +
      "Suggested: " + title + "\n\nCould you get in touch?\n";
    return (
      "mailto:connect@rams.digital?subject=" +
      encodeURIComponent("Guided Inspection: " + title) +
      "&body=" +
      encodeURIComponent(body)
    );
  })();

  return (
    <section className="section white" id="choose">
      <div className="wrap">
        <Head
          label="Find your inspection"
          top="What do you need to know?"
          intro="Two quick questions. We’ll show which machine answers them — and because both are still being shaped, your answers tell us what to build first."
        />

        <div className="builder">
          <div className="b-steps">
            {/* `.b-step` has to be the `<fieldset>` itself — the shared shell
                styles `.b-step[disabled]` and floats `.b-step legend` — so these
                take `useReveal` directly rather than a `<Reveal>` wrapper. */}
            <fieldset ref={step1Ref} className={step1Cls + " b-step"}>
              <legend>
                <span className="b-n">1</span>What’s the problem?<small>Pick all that apply</small>
              </legend>
              <div className="b-opts big">
                {PLACES.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    className="b-opt"
                    aria-pressed={!!place[o.id]}
                    onClick={() => toggle(setPlace, o.id)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden>
                      {ICONS[o.id]}
                    </svg>
                    <span>
                      <b>{o.label}</b>
                      <span>{o.sub}</span>
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset ref={step2Ref} className={step2Cls + " b-step"} disabled={!anyPlace}>
              <legend>
                <span className="b-n">2</span>What do you want to know?<small>Pick all that apply</small>
              </legend>
              <div className="b-opts">
                {visibleKnow.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    className="b-opt"
                    aria-pressed={!!know[o.id]}
                    onClick={() => toggle(setKnow, o.id)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              {!anyPlace && <p className="b-empty">Tell us what’s on your floor first.</p>}
            </fieldset>
          </div>

          <Reveal as="div" className="b-result" delay={80}>
            <div className="b-panel">
              <div className="b-top">
                <span className="label">Your inspection</span>
                {anyPlace && (
                  <button type="button" className="link b-reset" onClick={reset}>
                    Start over
                  </button>
                )}
              </div>

              <h3>{machines.length ? title : "Your machine appears here."}</h3>

              <div className="pick">
                {machines.map((k) => {
                  const gets = visibleKnow.filter((x) => x.m === k && know[x.id]);
                  const card = MACHINES.find((m) => m.key === k)!;
                  return (
                    <div className="pick-row" key={k}>
                      <div className="pick-img">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={card.img} alt="" />
                      </div>
                      <div>
                        <b className="pn">
                          {INFO[k].name} <StageBadge machine={k} />
                        </b>
                        <div className="pick-chips">
                          {gets.length ? (
                            gets.map((x) => (
                              <span className="hchip" key={x.id}>
                                <i />
                                {x.get}
                              </span>
                            ))
                          ) : (
                            <span className="hchip ghost">
                              <i />
                              Pick what you want to know
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="b-why" aria-live="polite">
                {machines.length
                  ? machines.map((k) => WHY[k]).join(" ") +
                    (picked ? " Every finding lands on your plan, ranked by what to fix first." : "")
                  : "Tell us what’s on your floor to get started."}
              </p>

              {machines.length > 0 && (
                <div className="b-cta">
                  <a className="btn btn-primary btn-sm" href={mailHref}>
                    Send this to us
                  </a>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => onInside(machines[0], "scan")}>
                    Watch it scan in 3D
                  </button>
                  <button type="button" className="link" onClick={() => onOpen(machines[0])}>
                    Learn more about {INFO[machines[0]].name}
                  </button>
                </div>
              )}

              {/* The honest version of a configurator for something you cannot
                  buy — see the note at the head of this file. */}
              <p className="b-note">
                Both machines are at concept stage. Sending this doesn’t order anything — it tells us which problems
                matter most.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
