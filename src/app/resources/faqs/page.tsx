import type { Metadata } from "next";
import { FaqCentre } from "@/components/sections/faqs/FaqCentre";
import {
  FaqCTA,
  FaqProductMap,
  FaqStages,
} from "@/components/sections/faqs/FaqExtras";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | RAMS Digital",
  description:
    "Answers about the RAMS platform, Digital Twin, rack safety, MHE, inventory, integrations, implementation, security and support.",
};

/**
 * /resources/faqs — the help centre.
 *
 *   01 Hero      light     the claim, the search, the topic shortcuts
 *   02 Topics    white     nine topic cards, each with a counted total
 *   03 Popular   offWhite  the six the source leads with
 *   04 Library   white     all fifty, filtered by topic and by the hero search
 *   05 Products  offWhite  which application to ask about
 *   06 Stages    white     how an answer becomes a project
 *      Close     dark      the site's unified close
 *
 * Surfaces alternate and every section uses `SectionHeader` at `compact`, so
 * the page matches the platform, solution, About, Partners, Contact, Case
 * Studies, Videos, Newsroom, Webinars and Downloads pages.
 *
 * ── Sections 01–04 are one client component ─────────────────────────
 * `FaqCentre` holds the search term and the topic filter, and all four read
 * them: the hero's search is the library's search, and a topic card sets the
 * filter and scrolls down to it. Splitting them would mean lifting that state
 * into this file, which puts it further from the only things that use it.
 *
 * 05, 06 and the close read neither, so they are separate — a keystroke in
 * the hero search should not re-render eight product cards.
 *
 * ── An answer can be linked to, and the link works ──────────────────
 * Every answer keeps the source's own id, each row has a copy control, and on
 * mount the page opens the answer named in `location.hash` and scrolls to it.
 * A link pasted into a ticket lands on the open answer rather than at the top
 * of a list of fifty.
 *
 * The hash is read in an effect rather than during render — it does not exist
 * on the server, and reading it in the render pass is a hydration mismatch
 * waiting for the first person to share one.
 *
 * ── Fifty answers, extracted rather than retyped ────────────────────
 * From the document's own `faqs` array, so nothing drifted in transcription.
 * Every count on the page — the hero placeholder, the nine topic tallies, the
 * label above the list, the "answers in" line on each product card — is
 * derived from that array. The source writes "50 ANSWERS" in three places,
 * which stays true exactly as long as nobody edits the list.
 *
 * ── The capability caveat is the source's, and it stays ─────────────
 * "Capabilities may vary by agreed modules, hardware, integrations and
 * deployment scope." Several of these answers describe what the platform
 * *can* do, and on a help centre that reads as what it *will* do for the
 * reader's own site — so the line sits above the library rather than in a
 * footnote, and the answers keep the source's hedges ("supported", "where
 * available", "confirm during implementation") rather than being tightened
 * into promises the document did not make.
 *
 * ── The last 404 in the Resources menu ──────────────────────────────
 * `/resources/faqs` is in the mega menu as "Frequently Asked Questions
 * (FAQs)" and returned a 404 until now. With this, every link in that menu
 * resolves.
 */
export default function FaqsPage() {
  return (
    <>
      <FaqCentre />
      <FaqProductMap />
      <FaqStages />
      <FaqCTA />
    </>
  );
}
