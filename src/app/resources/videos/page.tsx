import type { Metadata } from "next";
import { VideoHero } from "@/components/sections/videos/VideoHero";
import { VideoLatest } from "@/components/sections/videos/VideoLatest";
import { VideoLibrary } from "@/components/sections/videos/VideoLibrary";
import { VideoNext } from "@/components/sections/videos/VideoNext";
import { VideoFAQ } from "@/components/sections/videos/VideoFAQ";
import { VideoCTA } from "@/components/sections/videos/VideoCTA";

export const metadata: Metadata = {
  title: "Videos — See the Platform in Motion | RAMS Digital",
  description:
    "Platform walkthroughs, the hardware that reads the warehouse floor, and the digital twin behind it. Short films, no sign-up.",
};

/**
 * /resources/videos — the films.
 *
 *   01 Hero      light     the claim, the tiles, and the client strip
 *   02 Latest    offWhite  three films: one lead and two beside it
 *   03 Library   white     five films, filtered and searchable
 *   04 Next      offWhite  the six pages the footage belongs to
 *   05 FAQ       white     four questions, the first the one that matters
 *      Close     dark      the site's unified close
 *
 * 02 renders posters and mounts no `<video>` at all. It sits directly under
 * the hero, so it is the first thing on screen, and the three clips behind
 * it come to 29 MB — a section that starts downloading video because a
 * pointer crossed it is the worst place on the site to do that. The library
 * previews on hover because a visitor who scrolled that far asked to be
 * there.
 *
 * Surfaces alternate and every section uses `SectionHeader` at `compact`, so
 * the page matches the platform, solution, About, Partners, Contact and Case
 * Studies pages.
 *
 * ── The nav has linked this since it was written ────────────────────
 * `/resources/videos` is in `navigation-v2.ts` under Resources, described as
 * "Product demos and walkthroughs", and returned a 404 until now. A dead link
 * in a mega menu reads as a broken site — the same reason the case studies
 * page was built when the footer had been pointing at it for months.
 *
 * ── It is the case-studies page's design ────────────────────────────
 * Deliberately, and close to the line: the same `LightHeroGround`, the same
 * six floating tiles from `LightHero`, the same pill → 96px two-line h1 →
 * subline → two buttons, the same segmented pill filter, the same card shape
 * with the type under the image on the section's own ground, the same hairline
 * FAQ and the same dark close. Two sibling `/resources` pages should not feel
 * like two sites.
 *
 * Three things differ, each because the content differs:
 *
 *   no hero panel   shorter than either sibling. The case hero closes on a
 *                   client strip and the platform heroes on a product panel;
 *                   this one opened on the IRDS capture until that was
 *                   removed on request, and the clip moved into the library
 *   no pager        five films fit on one screen. `CaseWork` hides its own
 *                   pager below two pages for the same reason
 *   the box is 3:2  not 16:9. Every poster is 3:2 or close, so nothing is
 *                   cropped or pillarboxed. The player is 16:9 and contains
 *
 * ── Every card opens a file that exists ─────────────────────────────
 * Five clips, and all five already ship elsewhere on this site: the IRDS
 * capture in sixteen panels, the sensor film as the IMDS hero, the OmniBox and
 * camera turntables in `TechnologySystems`, the 3D capture in `RiqLocation`.
 * Nothing was invented to fill the grid, and the `Jira PT VP … Placeholder`
 * files in `/public` are deliberately absent — a video library is the one page
 * where a padded list is not a placeholder but a player that plays nothing.
 *
 * The reasoning, and the poster choices, are in `video-data.ts`.
 *
 * ── Nothing streams until it is asked for ───────────────────────────
 * Four of the clips come to 38 MB and the twin capture is 60 on its own. A
 * card renders its poster and mounts no `<video>` at all until the pointer is
 * over it, and the player sets `preload="none"` on the heavy one. A visitor
 * who scrolls the page and leaves has downloaded five stills.
 */
export default function VideosPage() {
  return (
    <>
      <VideoHero />
      <VideoLatest />
      <VideoLibrary />
      <VideoNext />
      <VideoFAQ />
      <VideoCTA />
    </>
  );
}
