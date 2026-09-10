import type { Metadata } from "next";
import {
  IrosCTA,
  IrosCapabilities,
  IrosExperience,
  IrosFAQ,
  IrosHero,
  IrosHow,
  IrosIntegrations,
  IrosOutcomes,
  IrosOverview,
  IrosProblem,
} from "@/components/sections/iros/Iros";

export const metadata: Metadata = {
  title: "IROS — Inventory Intelligence | RAMS Digital",
  description:
    "Connect SKU, pallet, batch, quantity, movement and dwell to the exact physical warehouse location — comparing system records with operational reality and turning exceptions into controlled action.",
};

/**
 * /platform/iros — from `RAMS_Digital_Inventory_Intelligence_Platform.html`.
 *
 * The platform spine, not a section per source heading:
 *
 *   01 Hero        darkTop   claim, strapline, two buttons, client strip
 *   02 Problem     white     the site's four-up card
 *   03 Overview    offWhite  the twelve-tile operating record
 *   04 How         white     six steps on the dot rail
 *   05 Capability  offWhite  eight, sticky-scroll with a pinned live pane
 *   06 Outcomes    white     four, with the source's dependency caveat
 *   07 Integrate   offWhite  six channels and the five-node module rail
 *   08 FAQ         white     seven questions
 *      Close       darkBtm
 *
 * Surfaces alternate — no two adjacent sections share one.
 *
 * ── Held back ──────────────────────────────────────────────────────
 * The source also carries security and governance, a five-stage rollout, and
 * a who-uses-it grid. `/platform/irds` states the rule for exactly these:
 * "Held back, because neither of the first two pages established a pattern for
 * them: Security & Compliance, Deployment / Implementation, and Scalability."
 * ABC classification is not held back — it is one of the eight capabilities,
 * which is what it is, and its caveat travels with it.
 *

 * ── Why this module needed a page ──────────────────────────────────
 * IROS was the one module in the Platform menu with none — `AboutPlatform`
 * lists it beside MEPS, RTSS, IMDS and ATOS and it is the only entry in that
 * array without an `href`. This is not `/solutions/inventory-intelligence`,
 * the solution page, nor `/services/inventory-audit`, the bounded audit
 * assignment; the source's own last question draws that second line and the
 * answer is carried verbatim in the FAQ.
 */
export default function IrosPlatformPage() {
  return (
    <>
      <IrosHero />
      <IrosProblem />
      <IrosOverview />
      <IrosHow />
      <IrosCapabilities />
      <IrosExperience />
      <IrosOutcomes />
      <IrosIntegrations />
      <IrosFAQ />
      <IrosCTA />
    </>
  );
}
