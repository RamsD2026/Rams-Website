"use client";

import { Head, Media, Reveal } from "./aiv-shared";
import { USE_CASES } from "./aiv-data";

/**
 * 03 — Use cases. The page's one dark act.
 *
 * Four tiles, each a button that opens its full-screen sheet. They are buttons
 * rather than links because the sheet is a dialog, not a route — the URL hash
 * is managed by the page shell so a sheet stays deep-linkable and shareable.
 */
export function AivUseCases({ onOpen }: { onOpen: (key: string) => void }) {
  return (
    <section className="section dark" id="use-cases">
      <div className="wrap">
        <Head
          label="Use cases"
          top="Put it where"
          bottom="the risk is."
          intro="Four places it already earns its keep. Each one is the same camera, the same edge AI — just a different line on the floor."
        />

        <div className="uc-grid">
          {USE_CASES.map((uc, i) => (
            <Reveal key={uc.key} delay={i % 2 === 1 ? 80 : undefined}>
              <button
                type="button"
                className="uc-tile"
                aria-haspopup="dialog"
                onClick={() => onOpen(uc.key)}
                style={{ width: "100%", height: "100%" }}
              >
                <Media
                  src={uc.tile.img}
                  alt={uc.tile.alt}
                  label={uc.tile.label}
                  hud={uc.tile.nohud ? undefined : uc.tile.hud}
                />
                <div className="uc-body">
                  <span className="label">{uc.label}</span>
                  <h3>{uc.title}</h3>
                  <p>{uc.teaser}</p>
                  <span className="plus" aria-hidden>
                    <svg viewBox="0 0 14 14">
                      <path d="M7 1v12M1 7h12" />
                    </svg>
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
