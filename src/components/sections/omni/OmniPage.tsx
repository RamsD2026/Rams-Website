"use client";

import { useCallback, useEffect, useState } from "react";
import { OmniFilm } from "./OmniFilm";
import { OmniHero } from "./OmniHero";
import { OmniProblem } from "./OmniProblem";
import { OmniFamily } from "./OmniFamily";
import { OmniInside, type InsideView } from "./OmniInside";
import { OmniBuilder } from "./OmniBuilder";
import { OmniCompare, OmniConnects, OmniCore, OmniCTA, OmniFAQ, OmniLoop, OmniWhere, OmniWorks } from "./OmniSections";
import { OmniSheet } from "./OmniSheet";
import { HAS_CONN, MODELS, type ModelKey } from "./omni-data";

/**
 * The page shell.
 *
 * Holds the two pieces of state the sections share:
 *
 *   · **which model sheet is open**, mirrored into the URL as `#omni-edge`,
 *     `#omni-ai`, `#omni-motion`, `#omni-core`, so a sheet is shareable and the
 *     Back gesture closes it rather than leaving the page. Same contract as the
 *     AI Vision use-case sheets.
 *   · **what the Inside viewer is showing** — which model, and whether it is in
 *     "Inside" or "What it connects to". Four places drive it: the viewer's own
 *     tabs, "See inside" on each family card, "See it connected in 3D" inside a
 *     sheet, and the builder's result panel. Lifting it here is what lets a
 *     button three sections away scroll to the viewer and set it up.
 */
export function OmniPage() {
  const [openKey, setOpenKey] = useState<ModelKey | null>(null);
  const [pushed, setPushed] = useState(false);
  const [noFilm, setNoFilm] = useState(false);
  const [insideKey, setInsideKey] = useState<ModelKey>("edge");
  // Connections first: where a box has a fixed kit, what it is wired to is the
  // more telling first picture than its parts. AI and Core fall back to Inside.
  const [insideView, setInsideView] = useState<InsideView>("connect");

  const filmUnavailable = useCallback(() => setNoFilm(true), []);

  const sync = useCallback(() => {
    const m = /^#omni-([a-z]+)$/.exec(window.location.hash);
    const key = m && MODELS.some((x) => x.key === m[1]) ? (m[1] as ModelKey) : null;
    setOpenKey(key);
    if (!key) setPushed(false);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(sync);
    window.addEventListener("hashchange", sync);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("hashchange", sync);
    };
  }, [sync]);

  const open = useCallback((key: ModelKey) => {
    setPushed(true);
    window.location.hash = "omni-" + key;
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
      window.location.hash = "";
    }
    setOpenKey(null);
  }, [pushed]);

  /** Point the viewer at a model and scroll to it. */
  const showInside = useCallback((key: ModelKey, view: InsideView = "connect") => {
    setInsideKey(key);
    // Core has no fixed kit, so there is nothing to connect it to.
    setInsideView(HAS_CONN.includes(key) ? view : "inside");
    requestAnimationFrame(() => {
      document.getElementById("inside")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  return (
    // The page ground is #F5F5F7, so the site navbar must not go transparent
    // over it — see `layout/Header.tsx`.
    <div className={"hw-page omni-page" + (noFilm ? " no-film" : "")} data-hero-tone="light">
      <OmniFilm onUnavailable={filmUnavailable} />
      <OmniHero />

      <div className="hw-doc">
        <OmniProblem />
        <OmniLoop />
        <OmniFamily onOpen={open} onInside={showInside} />
        <OmniInside
          active={insideKey}
          view={insideView}
          onActive={setInsideKey}
          onView={setInsideView}
          onOpen={open}
        />
        <OmniBuilder onOpen={open} onInside={showInside} />
        <OmniCompare />
        <OmniWhere />
        <OmniConnects />
        <OmniWorks />
        <OmniCore />
        <OmniFAQ />
        <OmniCTA />
      </div>

      {MODELS.map((m) => (
        <OmniSheet
          key={m.key}
          model={m}
          open={openKey === m.key}
          onClose={close}
          onInside={showInside}
        />
      ))}
    </div>
  );
}
