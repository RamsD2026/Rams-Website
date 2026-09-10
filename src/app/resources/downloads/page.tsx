import type { Metadata } from "next";
import { DownloadHero } from "@/components/sections/downloads/DownloadHero";
import { DownloadLibrary } from "@/components/sections/downloads/DownloadLibrary";
import { DownloadGovernance } from "@/components/sections/downloads/DownloadGovernance";
import { DownloadFAQ } from "@/components/sections/downloads/DownloadFAQ";
import { DownloadCTA } from "@/components/sections/downloads/DownloadCTA";

export const metadata: Metadata = {
  title: "Downloads — Datasheets, Brochures & Specifications | RAMS Digital",
  description:
    "Product brochures, solution briefs, datasheets and technical specifications for RAMS Digital software, hardware and services. Build a request pack.",
};

/**
 * /resources/downloads — the resource library.
 *
 *   01 Hero        light     the claim, the tiles, and the client strip
 *   02 Library     white     thirteen resources, filtered and searchable
 *   03 Governance  offWhite  five controls, addressed to whoever publishes
 *   04 FAQ         white     four questions, the first the one this page owes
 *
 * A "Start here" section led with three featured documents on typographic
 * covers and carried the three pack steps. It was removed on request; every
 * resource is in the library grid and the pack behaves the same.
 *      Close       dark      the site's unified close
 *
 * Surfaces alternate and every section uses `SectionHeader` at `compact`, so
 * the page matches the platform, solution, About, Partners, Contact, Case
 * Studies, Videos, Newsroom and Webinars pages. `FilterBar` is the same
 * control — tabs left, search right — those pages carry.
 *
 * ── Nothing on this page downloads, and that is the source's design ─
 * This is the thing to know before editing anything here.
 *
 * `RAMS_Digital_Downloads.html` says it twice, once in the library and once
 * in its FAQ: "This concept intentionally does not fabricate PDF downloads …
 * the request workflow below is ready to use in the meantime." The approved
 * files and their versions are issued by the RAMS team per project, and a
 * download button pointing at a PDF that does not exist is the one thing a
 * downloads page must not do.
 *
 * So every card adds to a pack, the pack becomes one pre-filled email with
 * every title listed, and the FAQ's first answer says so plainly rather than
 * "coming soon". No page count, file size or version number appears anywhere
 * — those belong to files that do not exist yet, and inventing "04 pages ·
 * 2.4 MB" is the same failure as inventing the file.
 *
 * Give a resource a `file` URL in `download-data.ts` and its card becomes a
 * real download and relabels itself. Both paths are already written.
 *
 * ── Thirteen resources, all of them real RAMS things ────────────────
 * Seven modules that have pages on this site, two hardware units that appear
 * in `TechnologySystems`, one integration guide matching the technical notes,
 * one service and two company brochures. Nothing was added to round the
 * number up, and the hero counts `RESOURCES.length` rather than stating a
 * figure — the source's own header says "13 FILES" in one place and "12
 * RESOURCES" in another, which is what happens when a count is typed beside
 * the thing it counts.
 *
 * ── The menu has linked this for a while ────────────────────────────
 * `/resources/downloads` is in the mega menu under Resources — and gained the
 * white papers when that entry was folded into it — and returned a 404 until
 * now. `/resources/compliance-guides` and `/resources/faqs` are still 404s in
 * that menu.
 */
export default function DownloadsPage() {
  return (
    <>
      <DownloadHero />
      <DownloadLibrary />
      <DownloadGovernance />
      <DownloadFAQ />
      <DownloadCTA />
    </>
  );
}
