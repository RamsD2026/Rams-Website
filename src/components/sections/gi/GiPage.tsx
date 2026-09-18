"use client";

import { useCallback, useEffect, useState } from "react";
import { GiFilm } from "./GiFilm";
import { GiHero } from "./GiHero";
import { GiProblem } from "./GiProblem";
import { GiMachines } from "./GiMachines";
import { GiInside, type InsideView } from "./GiInside";
import { GiChooser } from "./GiChooser";
import { GiCompare, GiCTA, GiFAQ, GiToday, GiWhere, GiWorks } from "./GiSections";
import { GiSheet } from "./GiSheet";
import { SHEETS, type MachineKey } from "./gi-data";

/**
 * The page shell.
 *
 * Holds the two pieces of state the sections share:
 *
 *   · **which machine sheet is open**, mirrored into the URL as `#gi-airscan` /
 *     `#gi-floorscan`, so a sheet is shareable and the Back gesture closes it
 *     rather than leaving the page. Same contract as the Omnibox, AI Vision and
 *     Sensor Stack sheets.
 *   · **what the Inside viewer is showing** — which machine, and whether it is
 *     taken apart or at work. Four places drive it: the viewer's own tabs, "See
 *     inside" and "Watch it scan" on each machine card, both buttons in a sheet,
 *     and the chooser's result panel. Lifting it here is what lets a button five
 *     sections away scroll to the viewer and set it up.
 *
 * ── Surfaces ────────────────────────────────────────────────────────
 * Reading down: film → page ground → white → ground → white → ground →
 * **black** → ground → white → ground → white close. No two adjacent sections
 * share a background, per `AGENTS.md`.
 *
 * ── `data-hero-tone` ────────────────────────────────────────────────
 * Set to `light`, as on the other film pages: the page ground is `#F5F5F7` and
 * the film's first chapter sits on it, so the navbar keeps its dark links rather
 * than going transparent over white. See `layout/Header.tsx`.
 */
export function GiPage() {
  const [openKey, setOpenKey] = useState<MachineKey | null>(null);
  const [pushed, setPushed] = useState(false);
  const [noFilm, setNoFilm] = useState(false);
  const [insideKey, setInsideKey] = useState<MachineKey>("airscan");
  const [insideView, setInsideView] = useState<InsideView>("inside");

  const filmUnavailable = useCallback(() => setNoFilm(true), []);

  const sync = useCallback(() => {
    const m = /^#gi-([a-z]+)$/.exec(window.location.hash);
    const key = m && SHEETS.some((s) => s.key === m[1]) ? (m[1] as MachineKey) : null;
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

  const open = useCallback((key: MachineKey) => {
    setPushed(true);
    window.location.hash = "gi-" + key;
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

  /** Point the viewer at a machine and a view, and scroll to it. */
  const showInside = useCallback((key: MachineKey, view: InsideView = "inside") => {
    setInsideKey(key);
    setInsideView(view);
    requestAnimationFrame(() => {
      document.getElementById("inside")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  return (
    // The page ground is #F5F5F7, so the site navbar must not go transparent
    // over it — see `layout/Header.tsx`.
    <div className={"hw-page gi-page" + (noFilm ? " no-film" : "")} data-hero-tone="light">
      <GiFilm onUnavailable={filmUnavailable} />
      <GiHero />

      <div className="hw-doc">
        <GiProblem />
        <GiMachines onOpen={open} onInside={showInside} />
        <GiInside
          active={insideKey}
          view={insideView}
          onActive={setInsideKey}
          onView={setInsideView}
          onOpen={open}
        />
        <GiChooser onOpen={open} onInside={showInside} />
        <GiCompare />
        <GiWhere />
        <GiWorks />
        <GiToday />
        <GiFAQ />
        <GiCTA />
      </div>

      {SHEETS.map((s) => (
        <GiSheet key={s.key} sheet={s} open={openKey === s.key} onClose={close} onInside={showInside} />
      ))}
    </div>
  );
}
