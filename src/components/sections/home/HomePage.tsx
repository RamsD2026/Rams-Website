"use client";

import { useCallback, useState } from "react";
import { HomeFilm } from "./HomeFilm";
import { HomeGap, HomeStart, HomeSystems } from "./HomeSections";
import { Hero } from "../Hero";
import { IndustriesCarousel } from "../IndustriesCarousel";
import { CustomerSuccess } from "../CustomerSuccess";
import { TrustCinematic } from "../TrustCinematic";
import { FinalCTA } from "../FinalCTA";

/**
 * The homepage shell.
 *
 * ── Two heroes, one of which is a fallback ──────────────────────────
 * `HomeFilm` is the hero. `Hero` — the existing video hero, untouched — is
 * what shows under `.no-film` when WebGL2 is missing or the film takes longer
 * than ten seconds to start. The front door is the one page on this site that
 * must never come up blank, and the cheapest guarantee of that was the hero
 * that already worked.
 *
 * ── The film ends at the fold ──────────────────────────────────────
 * As on the hardware pages, `.home-doc` is opaque and scrolls up over the film.
 *
 * ── No `data-hero-tone` ─────────────────────────────────────────────
 * The film is dark, and so is the fallback video hero, so the navbar's default
 * transparent state with white links is right over both. See
 * `layout/Header.tsx`.
 */
export function HomePage() {
  const [noFilm, setNoFilm] = useState(false);
  const filmUnavailable = useCallback(() => setNoFilm(true), []);

  return (
    <div className={"home-page" + (noFilm ? " no-film" : "")}>
      <HomeFilm onUnavailable={filmUnavailable} />

      {/* The fallback hero. CSS shows it only under `.no-film`. */}
      <div className="home-fallback">
        <Hero />
      </div>

      <div className="home-doc">
        <HomeGap />
        <HomeSystems />
        <HomeStart />

        {/* Kept from the existing page, untouched. */}
        <IndustriesCarousel />
        <CustomerSuccess />
        <TrustCinematic />
        <FinalCTA />
      </div>
    </div>
  );
}
