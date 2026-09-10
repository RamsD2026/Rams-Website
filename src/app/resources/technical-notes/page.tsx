import type { Metadata } from "next";
import { TechNotes } from "@/components/sections/technotes/TechNotes";
import { DocsCTA } from "@/components/sections/technotes/DocsClose";

export const metadata: Metadata = {
  title: "Technical Notes — Integration & API Documentation | RAMS Digital",
  description:
    "Integration notes for connecting enterprise systems, sensors, edge devices and customer applications to the RAMS Digital Twin. Patterns, not a live API contract.",
};

/**
 * /resources/technical-notes — the integration notes.
 *
 * ── It is a documentation page, not a marketing page ────────────────
 * Three columns rather than a stack of full-width sections: a filterable
 * section list on the left, the notes in the middle at a 760px measure, and
 * "On this page" plus a support card on the right. Both rails are sticky and
 * scroll independently; only the middle column moves with the page.
 *
 * That is the right shape here and the wrong shape everywhere else on this
 * site. The other pages are read once, top to bottom. This one is arrived at
 * from a search result, halfway down, looking for a single heading — so it
 * gets a scroll-spy, anchors on every section, and a smaller type scale than
 * anything else here: h1 at 44 against the platform pages' 96, body at 15 on
 * a 1.75 measure. It is read with something else open beside it.
 *
 * ── Dark, and this is not the mistake from the bento ────────────────
 * `LatestGrid` was corrected for dropping near-black tiles into light pages.
 * This is a whole page in `SURFACE.ink` — the site's own black, not a new one
 * — and documentation is the one context where dark is the convention rather
 * than a decision. Both references this layout came from are dark, and so is
 * every developer tool a reader of this page already has open.
 *
 * ── Nothing on this page is a live API contract ─────────────────────
 * This is the thing to know before editing anything here.
 *
 * The source is unusually careful about it and every warning is carried
 * through: the banner sits above the first heading rather than in a footnote,
 * `CodeBlock` labels every sample ILLUSTRATIVE in its own header, every event
 * name carries a PATTERN chip, the module table says it shows categories
 * rather than guaranteed fields, and the first FAQ answer is the question a
 * developer would actually ask.
 *
 * The identifiers are deliberately unusable — `site_example`,
 * `asset_example`, `evt_example`, `{{BASE_URL}}`, `{{ACCESS_TOKEN}}` — for
 * the same reason the source uses placeholder tokens: a realistic-looking id
 * in a sample is how a placeholder reaches production.
 *
 * Route names, payload shapes and event types are the one kind of content a
 * developer copies straight into a client. If the real specification ever
 * lands here, the banner comes off in the same edit and not before.
 *
 * ── It closes on the site's unified dark band ──────────────────────
 * The reading column ends, then the close, then the footer. A light "where to
 * go next" section sat between the first two for a revision and was removed
 * on request.
 *
 * ── The menu has linked this for a while ────────────────────────────
 * `/resources/technical-notes` is in both nav configs under Resources and
 * returned a 404 until now — the same reason the case studies, videos,
 * newsroom and webinars pages were built.
 *
 * `/resources/faqs` is the last 404 left in that menu.
 */
export default function TechnicalNotesPage() {
  return (
    <>
      <TechNotes />

      <DocsCTA
        eyebrow="Contract before code"
        top="Bring the system map."
        held="We build the context map."
        hot="context map"
        body="Share the workflow, source systems, device estate, data owners and the decisions you want to enable. We will define the integration path and what belongs in the Digital Twin."
        primary={{
          label: "Start integration discovery",
          href: "/company/contact",
        }}
        secondary={{ label: "See the platform", href: "/platform/overview" }}
      />
    </>
  );
}
