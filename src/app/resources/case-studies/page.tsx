import type { Metadata } from "next";
import { CaseHero } from "@/components/sections/cases/CaseHero";
import { CaseLatest } from "@/components/sections/cases/CaseLatest";
import { CaseWork } from "@/components/sections/cases/CaseWork";
import { CaseOutcomes } from "@/components/sections/cases/CaseOutcomes";
import { CaseFAQ } from "@/components/sections/cases/CaseFAQ";
import { CaseCTA } from "@/components/sections/cases/CaseCTA";

export const metadata: Metadata = {
  title: "Case Studies — Proof From the Floor | RAMS Digital",
  description:
    "Rack safety, digital-twin rollouts, MHE safety and forensic investigations — the work behind 200+ live sites, built to EN 15635. Named references available under NDA.",
};

/**
 * /resources/case-studies — the work.
 *
 *   01 Hero      light     the claim, the tiles, and the client strip
 *   02 Latest    offWhite  three engagements: one lead and two beside it
 *   03 Work      white     six story cards, filtered and searchable
 *   04 Outcomes  offWhite  six categories, bare columns
 *   05 FAQ       white     four questions, the first the one that matters
 *      Close     dark      the site's unified close
 *
 * The three in 02 appear again in 03. That is what a lead is — the same
 * work, once at reading size and once in the set — and it takes
 * `CASES.slice(0, 3)` rather than a hand-picked trio, so nothing has to be
 * re-picked when the list changes.
 *
 * A References section sat between Outcomes and the FAQ and was removed on
 * request; the claim it carried survives in the note under the case grid
 * and in the FAQ's second answer.
 *
 * Surfaces alternate, and every section uses `SectionHeader` at `compact` so
 * the page matches the platform, solution, About, Partners and Contact pages.
 *
 * A References section sat between 03 and the FAQ — what is shared under NDA,
 * in three columns, with a "Request references" button. It was removed on
 * request. The claim it carried survives in two places: the note under the
 * case grid, which says named references are available under NDA, and the
 * FAQ's second answer, which says the same and points at getting in touch.
 * Both should stay for that reason.
 *
 * ── The footer has linked this since it was written ─────────────────
 * `/resources/case-studies` returned a 404 until now, which is worse than a
 * thin page: a dead link in a footer reads as a broken site.
 *
 * ── Nothing here names a customer ───────────────────────────────────
 * Six case studies, no client, no site, no figure attributable to one. That
 * is the source document's own position and the note under the grid states
 * it — representative of real engagements, details withheld, named references
 * under NDA. Section 04 exists to turn that from a caveat into an offer.
 *
 * The three figures in the hero's chips — 200+ sites, 8 investigations,
 * EN 15635 — are the document's, not measurements taken here, and two of them
 * repeat in the FAQ. There is no shared constant for them, so a change has to
 * be made in both files.
 *
 * ── The hero is the solution pages', in light ───────────────────────
 * Pill, a two-line h1, a subline, three chips, two buttons and a framed panel
 * — `IrdsHero`'s structure value for value. It is light rather than dark, and
 * the panel holds a photograph rather than a live product view. Neither
 * substitution is a swap of values; the reasoning for each is in `CaseHero`,
 * and the short version is that alpha does not translate between a near-black
 * ground and a white one.
 *
 * ── The cards are the home page's `CustomerSuccess` story card ──────
 * A 280px image on a 20px radius, then the type under it on the section's own
 * ground — no box, no border, no shadow. Six containers in a grid compete
 * with each other; six images with type under them read as one set, which is
 * what a page of case studies is.
 *
 * The situation and the three outcomes live in a panel rather than on the
 * card. Six white cards each holding a paragraph, a rule and a bulleted list
 * was a page of documents.
 *
 * No image shows an identifiable customer site, which matters on a page whose
 * whole position is that client details are withheld.
 *
 * ── The filter chips are derived from the cases ─────────────────────
 * `CATEGORIES` in `case-data.ts` walks `CASES` rather than being typed out.
 * The source lists five chips against six cards, leaving Operations and
 * Compliance reachable only through "All" — a filter bar that hides part of
 * its own set. Add a case with a new kind now and its chip appears with it.
 */
export default function CaseStudiesPage() {
  return (
    <>
      <CaseHero />
      <CaseLatest />
      <CaseWork />
      <CaseOutcomes />
      <CaseFAQ />
      <CaseCTA />
    </>
  );
}
