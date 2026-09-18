"use client";

import { useCallback, useEffect, useState } from "react";
import { AivHero } from "./AivHero";
import { AivEnvironments } from "./AivEnvironments";
import { AivUseCases } from "./AivUseCases";
import { AivHow } from "./AivHow";
import { AivBuild } from "./AivBuild";
import { AivNumbers } from "./AivNumbers";
import { AivSoftware } from "./AivSoftware";
import { AivCTA, AivDeploy, AivFAQ, AivSpecs } from "./AivClosing";
import { AivFilm } from "./AivFilm";
import { AivSheet } from "./AivSheet";
import { USE_CASES } from "./aiv-data";

/**
 * The page shell.
 *
 * Holds the one piece of state the sections share — which use-case sheet is
 * open — and keeps it in the URL as `#uc-mhe`, `#uc-cell`, `#uc-dock`,
 * `#uc-zone`, the way the reference does. Two reasons that matters and a
 * `useState` alone would not:
 *
 *   · a sheet is shareable and deep-linkable — someone can send a colleague the
 *     forklift case rather than "scroll down and click the first tile";
 *   · Back closes the sheet instead of leaving the page, which is what a phone
 *     user's Back gesture is expected to do with an overlay.
 *
 * Opening pushes a history entry; closing pops it if this page pushed it, and
 * otherwise strips the hash without adding one. `hashchange` is the single
 * source of truth, so a pasted link, a Back press and a tile click all arrive
 * through the same path.
 */
export function AivPage() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [pushed, setPushed] = useState(false);
  // The film reports its own unavailability (no WebGL2, GLB failed, or it took
  // longer than 10s). `no-film` hides the fixed layers and reveals the static
  // hero — the reference's own designed fallback.
  const [noFilm, setNoFilm] = useState(false);
  const filmUnavailable = useCallback(() => setNoFilm(true), []);

  const sync = useCallback(() => {
    const m = /^#uc-([a-z]+)$/.exec(window.location.hash);
    const key = m && USE_CASES.some((u) => u.key === m[1]) ? m[1] : null;
    setOpenKey(key);
    if (!key) setPushed(false);
  }, []);

  useEffect(() => {
    // The initial read runs in a frame callback, not in the effect body: the
    // hash is an external system we subscribe to, and a synchronous setState
    // here cascades a second render before paint. Same pattern as
    // `layout/Header.tsx`.
    const id = requestAnimationFrame(sync);
    window.addEventListener("hashchange", sync);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("hashchange", sync);
    };
  }, [sync]);

  const open = useCallback((key: string) => {
    setPushed(true);
    window.location.hash = "uc-" + key;
  }, []);

  const close = useCallback(() => {
    if (pushed) {
      setPushed(false);
      window.history.back();
      return;
    }
    try {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    } catch {
      // Some embedded browsers refuse replaceState on a file: or sandboxed
      // origin. Clearing the hash directly still closes the sheet; it just
      // leaves an extra history entry behind.
      window.location.hash = "";
    }
    setOpenKey(null);
  }, [pushed]);

  return (
    // `data-hero-tone="light"` belongs on the page root rather than on a hero
    // element: this page's ground is #F5F5F7 either way, and the film's hero is
    // a fixed overlay that the site `<Header>` must never go transparent over.
    <div className={"hw-page aiv-page" + (noFilm ? " no-film" : "")} data-hero-tone="light">
      <AivFilm onUnavailable={filmUnavailable} />

      {/* The static hero. CSS shows it only under `.no-film`. */}
      <AivHero />

      {/* Everything from here scrolls up over the film and hides it. */}
      <div className="hw-doc">
        <AivEnvironments onOpen={open} />
        <AivUseCases onOpen={open} />
        <AivHow />
        <AivBuild />
        <AivNumbers />
        <AivSoftware />
        <AivDeploy />
        <AivSpecs />
        <AivFAQ />
        <AivCTA />
      </div>

      {USE_CASES.map((uc) => (
        <AivSheet key={uc.key} uc={uc} open={openKey === uc.key} onClose={close} />
      ))}
    </div>
  );
}
