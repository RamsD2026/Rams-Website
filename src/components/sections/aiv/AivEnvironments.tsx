"use client";

import { useCallback, useState } from "react";
import { Head, Media, Reveal } from "./aiv-shared";
import { AivEnvScene } from "./AivEnvScene";
import { ENVS } from "./aiv-data";

/**
 * 02 — Environments.
 *
 * The reference runs a second WebGL canvas here: four procedural low-poly
 * dioramas (forklift guard, robot cell fence, dock door, ceiling drop) in a
 * clay-grey style, each with a translucent vision cone and a figure that walks
 * into it, cross-fading as you change tab.
 *
 * What is ported is the tab shell and its photo fallback — again the
 * reference's own, for browsers without WebGL. The stage keeps the same 16/9
 * frame and light radial ground, so dropping a canvas in later is a swap of the
 * `<Media>` for a renderer and nothing else.
 *
 * The tab list is a real tablist: arrow keys move between tabs, and only the
 * selected one is in the tab order, which is what `tabIndex={-1}` on the rest
 * is doing.
 */
export function AivEnvironments({ onOpen }: { onOpen: (key: string) => void }) {
  const [active, setActive] = useState(0);
  // The diorama reports its own failure; only then does the stage fall back to
  // the context photos.
  const [noGl, setNoGl] = useState(false);
  const glUnavailable = useCallback(() => setNoGl(true), []);
  const env = ENVS[active];

  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (active + d + ENVS.length) % ENVS.length;
    setActive(next);
    document.getElementById("aiv-tab-" + ENVS[next].key)?.focus();
  };

  return (
    <section className="section" id="environments">
      <div className="wrap">
        <Head
          center
          label="One camera"
          top="Every environment."
          intro="The same unit bolts to a truck, a fence post, a door frame or a ceiling drop. What changes is the zone you draw and the rule you give it."
        />

        <Reveal className={"env-stage" + (noGl ? " no-gl" : "")}>
          {noGl ? (
            <Media key={env.key} src={env.img} alt={env.imgAlt} label={env.label} tone="light" />
          ) : (
            <AivEnvScene active={env.key} onUnavailable={glUnavailable} />
          )}
        </Reveal>

        <div className="env-ui">
          <div className="seg" role="tablist" aria-label="Environment" onKeyDown={onKey}>
            {ENVS.map((e, i) => (
              <button
                key={e.key}
                id={"aiv-tab-" + e.key}
                role="tab"
                type="button"
                aria-selected={i === active}
                aria-controls={"aiv-panel-" + e.key}
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
              >
                {e.tab}
              </button>
            ))}
          </div>

          <div
            className="env-cap"
            id={"aiv-panel-" + env.key}
            role="tabpanel"
            aria-labelledby={"aiv-tab-" + env.key}
          >
            <h3>{env.title}</h3>
            <p>{env.body}</p>
            <button type="button" className="link" onClick={() => onOpen(env.uc)}>
              {env.link}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
