"use client";

import { LocHero } from "./LocHero";
import { LocSandbox } from "./LocSandbox";
import { LocTech } from "./LocTech";
import { LocQuiz } from "./LocQuiz";
import { LocCTA, LocFAQ, LocHow, LocJobs, LocPilot, LocProblem, LocToday } from "./LocSections";

/**
 * The page shell.
 *
 * No shared state — the hero, the sandbox and the quiz each own theirs, and
 * nothing on this page reaches across a section the way the Omnibox builder
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
 */
export function LocPage() {
  return (
    <div className="hw-page loc-page">
      <LocHero />
      <LocProblem />
      <LocSandbox />
      <LocTech />
      <LocQuiz />
      <LocJobs />
      <LocToday />
      <LocHow />
      <LocPilot />
      <LocFAQ />
      <LocCTA />
    </div>
  );
}
