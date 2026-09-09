import type { Metadata } from "next";
import { NewsHero } from "@/components/sections/newsroom/NewsHero";
import { NewsLatest } from "@/components/sections/newsroom/NewsLatest";
import { NewsFeed } from "@/components/sections/newsroom/NewsFeed";
import { NewsFAQ } from "@/components/sections/newsroom/NewsFAQ";
import { NewsCTA } from "@/components/sections/newsroom/NewsCTA";

export const metadata: Metadata = {
  title: "Newsroom — Announcements & Press Kit | RAMS Digital",
  description:
    "Announcements, product releases and press material from RAMS Digital, plus brand marks, product films and a direct line for media enquiries.",
};

/**
 * /resources/insights — the newsroom.
 *
 *   01 Hero    light     the claim, the tiles, and the client strip
 *   02 Latest  offWhite  the newest three: one lead and two beside it
 *   03 Feed    white     six published stories, tabbed and searchable
 *   04 FAQ     offWhite  four questions, the first the one the page raises
 *      Close   dark      the site's unified close, on a person
 *
 * The three in 02 appear again in 03. That is what a lead is — the same
 * stories, once at reading size and once in the archive — and the section
 * takes `SORTED.slice(0, 3)` rather than a hand-picked set, so publishing a
 * story is the only thing needed to lead with it.
 *
 * An announcement-areas section and a media-resources section sat between 02
 * and the FAQ and were removed on request. What they carried is not lost: the
 * FAQ's first answer still draws the line between published writing and a
 * company announcement, and the close still carries the media address.
 *
  * ── Two dead links pointed here, under two names ────────────────────
 * The mega menu has "News Room" at `/resources/insights` in
 * `src/lib/navigation.ts` and "Insights" at the same route in
 * `navigation-v2.ts`; the footer had "Newsroom" at `/company/newsroom`.
 * All three were 404s.
 *
 * This is the one page, at the route the menus already use. The footer now
 * points at it too, and `next.config.ts` redirects `/company/newsroom` here
 * permanently so anything already linking the old path still lands.
 *
 * The components stay under `src/components/sections/newsroom/` because that
 * is what they are. The URL is the nav's word for it, not the page's.
 *
 * ── It is the case-studies and videos format ────────────────────────
 * Deliberately: the same `LightHeroGround`, the same six floating tiles from
 * `LightHero`, the same pill → 96px two-line h1 → subline → two buttons →
 * `ClientStrip` on mt-24/28/32, the same segmented pill filter, the same 3-up
 * card with the type under the cover on the section's own ground, the same
 * bare columns, the same hairline FAQ and the same dark close.
 *
 * The card's cover is two words rather than a photograph. There is no image
 * for any of these articles and no honest way to make one — an invented
 * photograph of a collapsed rack attached to a real published piece is a
 * fabricated illustration of a real event. The source solves it the same way.
 *
 * ── The stories are real. The announcements do not exist ────────────
 * This is the one thing worth reading before editing anything here, because
 * the page carries two things that look alike and are not.
 *
 * The six stories in section 02 are published RAMS Digital articles, from
 * `RAMS_Digital_Newsroom.html`. Every URL was requested and returned 200
 * before it was written into `news-data.ts`; a newsroom of dead links is
 * worse than an empty one. They live on `backend.rams.digital`, which is the
 * host the source links and the only one that serves those slugs —
 * `rams.digital` 404s on all six — so if they are ever fronted on the main
 * domain, six `href`s change and nothing else does.
 *
 * There are no company announcements on this page, and none were written.
 * The source is explicit about why and it is the position the page took
 * before the source arrived: "Announcement areas are intentionally structured
 * without invented releases." A dated announcement is the one kind of content
 * where a plausible-looking placeholder is a false statement about what a
 * company said and when, and a reader would have no way to tell. The FAQ's
 * first answer draws that line so a reader does not take six articles for six
 * announcements.
 *
 * ── Tabs, not a second filter style ─────────────────────────────────
 * The source's four buttons — All stories, Rack safety, Standards,
 * Operations — as the site's segmented pill, the control the home page, the
 * case studies and the videos already use. `TOPICS` is derived by walking
 * the stories, so a new story on a new topic gets a tab on its own.
 *
 * A story carries `topics: string[]` rather than one `kind`: the source
 * files five of the six under two categories at once, and squashing that to
 * one would drop "Safe Load Capacity" out of Operations — a tab hiding a
 * story that belongs in it. The search box beside the tabs is the source's
 * too, matching the title, the summary and the keyword string on each story.
 *
 * ── And nothing here invents a policy ───────────────────────────────
 * No embargo terms, no approval turnaround, no exclusivity, no subscribe
 * field over a list that does not exist. Those are things a company decides
 * and writes down; a site that answers them on the company's behalf has made
 * commitments nobody agreed to. Every answer either states a fact the site
 * already carries or points at the team.
 */
export default function NewsroomPage() {
  return (
    <>
      <NewsHero />
      <NewsLatest />
      <NewsFeed />
      <NewsFAQ />
      <NewsCTA />
    </>
  );
}
