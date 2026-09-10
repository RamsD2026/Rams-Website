import type { Metadata } from "next";
import { WebinarHero } from "@/components/sections/webinars/WebinarHero";
import { WebinarUpcoming } from "@/components/sections/webinars/WebinarUpcoming";
import { WebinarLibrary } from "@/components/sections/webinars/WebinarLibrary";
import { WebinarTracks } from "@/components/sections/webinars/WebinarTracks";
import { WebinarFAQ } from "@/components/sections/webinars/WebinarFAQ";
import { WebinarCTA } from "@/components/sections/webinars/WebinarCTA";

export const metadata: Metadata = {
  title: "Webinars & Recordings | RAMS Digital",
  description:
    "Live sessions and expert recordings on rack safety, MHE operations, physical visibility and the decisions that keep warehouses safe, productive and controlled.",
};

/**
 * /resources/webinars — the programme.
 *
 *   01 Hero        light     the claim, the tiles, and the client strip
 *   02 Featured    white     three cards on a shelf, one at a time, auto-running
 *   03 Recordings  offWhite  nine sessions, filtered and searchable, 3-up grid
 *   04 Tracks      white     six tracks, each pointing at a built page
 *   05 FAQ         offWhite  the source’s five questions, unchanged
 *      Close       dark      the site's unified close
 *
 * Surfaces alternate and every section but the hero and the upcoming block
 * uses `SectionHeader` at `compact`, so the page matches the platform,
 * solution, About, Partners, Contact, Case Studies, Videos and Newsroom
 * pages.
 *
 * ── The menu has linked this since the last edit ────────────────────
 * `/resources/webinars` went into both nav configs when White Papers was
 * folded into Downloads, and returned a 404 until now. A dead link in a mega
 * menu reads as a broken site — the same reason the case studies, videos and
 * newsroom pages were built.
 *
 * ── It is the other three index pages' format ───────────────────────
 * The same `LightHeroGround`, the same six floating tiles from `LightHero`,
 * the same pill → 96px two-line h1 → subline → two buttons → `ClientStrip`
 * on mt-24/28/32, the same `FilterBar` with tabs left and search right, the
 * same 3-up card with the type under the cover on the section's own ground,
 * the same bare columns, the same hairline FAQ and the same dark close.
 *
 * What differs is section 02. The other three lead with `LatestGrid`, whose
 * lead tile is a picture with type under it. There is no picture of a session
 * that has not happened, and a generated photograph of an audience would be
 * an invented illustration of a real dated event. So the date takes the
 * picture's place, which is what a live session leads with anyway.
 *
 * ── Nine recordings, and no file behind any of them ─────────────────
 * This is the thing to know before editing the library.
 *
 * `RAMS_Digital_Webinars.html` lists nine recordings with titles, topics and
 * running times, and its play controls link nowhere — there is not one `href`
 * on a card in the document. So the sessions are real and there is nothing to
 * stream today, and a "Watch recording" button opening a player with no
 * source in it is the one thing this page must not do.
 *
 * Every card opens a pre-filled email instead, which is the source's own
 * mechanism for every action on the page, registration included. Give a
 * session a `watch` URL in `webinar-data.ts` and its card becomes a direct
 * link and relabels itself. That is the whole change.
 *
 * ── The live session expires on its own ─────────────────────────────
 * 17 September 2026 is the source's date. `WebinarUpcoming` compares
 * `UPCOMING.iso` against today and switches its eyebrow, its note and its
 * button once the date has passed, rather than advertising a session that has
 * already run.
 *
 * ── The speaker is named, and has no face ───────────────────────────
 * Greeba Rampaul-Essue is named in the source, so named here, with initials
 * rather than a portrait. No generated photograph goes beside a real person's
 * name on this site.
 *
 * ── Two things the source has that this does not ────────────────────
 * A subscribe field, over a mailing list that does not exist and a site with
 * no form backend — it would collect addresses into nothing, the same reason
 * the newsroom's close carries an address instead. And a WhatsApp button,
 * which is the only channel on this site that leaves for an app; the phone
 * number is offered in its place.
 *
 * The source's "Practical resources" row is dropped too: three of its four
 * cards point at `/resources/white-papers`, `/resources/compliance-guides`
 * and `/resources/technical-notes`, none of which is built. The Tracks
 * section does that job with six links that all resolve.
 */
export default function WebinarsPage() {
  return (
    <>
      <WebinarHero />
      <WebinarUpcoming />
      <WebinarLibrary />
      <WebinarTracks />
      <WebinarFAQ />
      <WebinarCTA />
    </>
  );
}
