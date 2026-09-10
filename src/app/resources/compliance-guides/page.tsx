import type { Metadata } from "next";
import { ComplianceGuides } from "@/components/sections/glossary/ComplianceGuides";
import { DocsCTA } from "@/components/sections/technotes/DocsClose";

export const metadata: Metadata = {
  title: "Industry Compliance Glossary — SEMA, FEM & OSHA | RAMS Digital",
  description:
    "A practical reference for SEMA, FEM and OSHA terminology across storage equipment, materials handling, rack inspection and warehouse safety. Educational reference, not a compliance determination.",
};

/**
 * /resources/compliance-guides — the industry compliance glossary.
 *
 * ── It shares the technical notes' shell ────────────────────────────
 * Same three columns: a filterable section list on the left, the reference in
 * the middle at a 760px measure, and "On this page" plus a card on the right.
 * `TechShell` was written for that page and generalised when this one arrived
 * — it takes `nav`, `toc`, the rail's label and the right card as props now
 * rather than importing one page's data.
 *
 * That shape is right for both and wrong for the rest of the site. These are
 * the two pages a reader arrives at from a search result, halfway down,
 * looking for one heading — so they get a scroll-spy, anchors on every
 * section, and a smaller type scale than anything else here.
 *
 * ── This page is a reference, not a compliance determination ────────
 * This is the thing to know before editing anything here, and it matters more
 * on this page than on any other on the site: a glossary of safety
 * terminology is read by somebody deciding whether a damaged upright can stay
 * in service.
 *
 * The source is careful about it and every guard is carried through, placed
 * where it can intercept a decision rather than only at the top:
 *
 *   the banner       above the first heading, not in a footnote
 *   every term       renders its own `scope` — the applicability boundary —
 *                    in a framed block inside the open row, so a reader
 *                    skimming the definition cannot miss it
 *   every framework  states what it *is* and where it applies, and whether
 *                    it is guidance or law
 *   every role       carries the limit of its own authority
 *   the OSHA block   says it is a navigation point, not the rule
 *   the loop         closes on the sentence that a glossary does not decide
 *                    severity or approve a repair
 *   the FAQ          opens on whether following this certifies a warehouse.
 *                    It does not.
 *
 * None of those was shortened to fit a card, and nothing the source hedged
 * was tightened into a claim it did not make.
 *
 * ── The twenty-eight terms are the source's, unedited ───────────────
 * Extracted from the document's own `terms` array rather than retyped, so no
 * definition drifted in transcription. Each keeps all five fields.
 *
 * ── The official links are real, and were checked ───────────────────
 * SEMA, FEM and three OSHA regulations — every URL requested and answering
 * 200 before it was written down. A compliance reference pointing at a dead
 * regulation is worse than one with no links at all. (OSHA refuses a default
 * user agent and answers a browser one; the pages are live.)
 *
 * These are the only outbound links on this site to a body that writes rules,
 * so they open in a new tab with `rel="noreferrer"` and a reader who wants
 * the authority reaches it in one press.
 *
 * ── It closes on the site's unified dark band ──────────────────────
 * The reading column ends, then the close, then the footer — the same two the
 * technical notes end on, from the same `DocsClose`. A light "where to go
 * next" section sat between them for a revision and was removed on request.
 *
 * The close is careful with its own heading. "A glossary defines. An
 * inspection decides." is the page's whole position in five words, and it is
 * the last thing a reader sees before the footer for that reason.
 *
 * ── The menu has linked this for a while ────────────────────────────
 * `/resources/compliance-guides` is in the mega menu as "Glossary (Industry
 * Compliance Guides)" and returned a 404 until now. `/resources/faqs` is the
 * last 404 left in that menu.
 */
export default function ComplianceGuidesPage() {
  return (
    <>
      <ComplianceGuides />

      <DocsCTA
        eyebrow="Reference to evidence"
        top="A glossary defines."
        held="An inspection decides."
        hot="inspection"
        body="Map the asset, record the condition, apply the right framework, assign the response and verify closure — with the evidence retained against the rack it came from."
        primary={{
          label: "Request a rack inspection",
          href: "/company/contact",
        }}
        secondary={{ label: "Explore IRDS", href: "/platform/irds" }}
      />
    </>
  );
}
