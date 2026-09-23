"use client";

import { useCallback, useState } from "react";
import { LocFilm } from "./LocFilm";
import { LocHero } from "./LocHero";
import { LocSandbox } from "./LocSandbox";
import { LocQuiz } from "./LocQuiz";
import { LocCTA, LocFAQ, LocHow, LocJobs, LocPilot, LocProblem } from "./LocSections";

/**
 * The page shell.
 *
 * No shared state — the hero, the sandbox and the quiz each own theirs, and
 * nothing on this page reaches across a section the way the OmniBox builder
 * reaches into its 3D viewer. So this is the reference's section order and
 * nothing else.
 *
 * ── Surfaces ────────────────────────────────────────────────────────
 * No two adjacent sections share a background, per `AGENTS.md`. Reading down:
 * dark hero → page ground → white → ground → white → **black** → white →
 * ground → white → ground → white close. The jobs act is the page's one
 * full-black surface, the same role the use-case act plays on
 * `/hardware/ai-vision`.
 *
 * ── No `data-hero-tone` ─────────────────────────────────────────────
 * Deliberate. The hero is dark, so the navbar's default transparent state with
 * white links is correct over it. `/hardware/omnibox` needs the attribute
 * because its ground is `#F5F5F7`; this one does not. See `layout/Header.tsx`.
 *
 * The hero is now a scroll-driven 3D film (`LocFilm`), built from the Sensor
 * Stack's forklift and point-cloud warehouse — see its head for why that works
 * where an earlier "empty shed" film did not. `LocHero`, the 2D floor plan, is
 * the fallback when WebGL is unavailable (`.no-film`).
 */
export function LocPage() {
  // Without WebGL the film stands down and the 2D floor-plan hero takes over.
  const [noFilm, setNoFilm] = useState(false);
  const filmUnavailable = useCallback(() => setNoFilm(true), []);
  return (
    <div className={"hw-page loc-page" + (noFilm ? " no-film" : "")}>
      <LocFilm onUnavailable={filmUnavailable} />
      <LocHero />
      <div className="hw-doc">
      <LocProblem />
      <LocSandbox />
      <LocQuiz />
      <LocJobs />
      <LocHow />
      <LocPilot />
      <LocFAQ />
      <LocCTA />
      </div>
    </div>
  );
}
