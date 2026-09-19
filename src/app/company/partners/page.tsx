import type { Metadata } from "next";
import { PartnersHero } from "@/components/sections/partners/PartnersHero";
import { PartnersWhy } from "@/components/sections/partners/PartnersWhy";
import { PartnersModels } from "@/components/sections/partners/PartnersModels";
import { PartnersMarket } from "@/components/sections/partners/PartnersMarket";
import { PartnersHow } from "@/components/sections/partners/PartnersHow";
import { PartnersFit } from "@/components/sections/partners/PartnersFit";
import { PartnersFAQ } from "@/components/sections/partners/PartnersFAQ";
import { PartnersCTA } from "@/components/sections/partners/PartnersCTA";

export const metadata: Metadata = {
  title: "Technology & Channel Partners | RAMS Digital",
  description:
    "Combine your technology, market reach or operational expertise with RAMS Digital to deliver safer, more productive and more visible facilities. Technology, channel, delivery and solution partnership models.",
};

/**
 * /company/partners — the partner programme.
 *
 *   01 Hero        light     the ecosystem, and the four kinds of partner
 *   02 Why         offWhite  four reasons, on the platform icon card
 *   03 Models      white     four profiles on tabs, copy left, picture right
 *   04 Ecosystem   removed at the owner's request (`PartnersEcosystem`, on disk)
 *   05 Technology  removed at the owner's request (`PartnersRoles`, on disk)
 *   06 Channel     removed with it
 *   07 Market      white     the Twin and the six modules, on a track
 *   08 How         offWhite  five stages on one timed track
 *   09 Fit         white     eight organisation types, flat
 *   10 FAQ         offWhite  six questions, three of them saying no
 *      Close       dark      the site's unified close
 *
 * Surfaces alternate throughout, and every section uses `SectionHeader` at
 * `compact` so the page matches the platform, solution and About pages.
 *
 * ── Ten of the source document's fifteen ────────────────────────────
 * Five sections are deliberately not built:
 *
 *   Partner experience   an illustrative partner-workspace mock. There is no
 *                        such product to capture, and a page that invents a
 *                        screenshot of a portal is promising software.
 *   Enablement & support two columns of three training steps. Section 08's
 *                        Enable stage already states it at the right depth.
 *   Quality & governance four rules about role boundaries and claims. Real,
 *                        but it belongs in a partner agreement rather than on
 *                        the page that recruits partners.
 *   Shared value         three lines about recurring revenue, which sections
 *                        02 and 06 already make.
 *   Who should partner   kept, as 09.
 *
 * The one thing those five carried that the page would be worse without is
 * the source's closing hedge — no exclusivity, no fixed margins, no
 * guaranteed opportunities. It is under the FAQ, where the last answer
 * depends on it.
 *
 * ── No two sections repeat a layout ─────────────────────────────────
 * Which matters on a page where almost every section carries three, four or
 * six items: 02 is the platform pages' icon card, which is what a reader
 * arriving from `/platform` has already seen five times, 03 is a selector
 * because the reader is one of four things and not
 * all four, 04 is a layer diagram because the claim is about sitting between
 * two layers, 05 and 06 share a card because they are the same object with
 * different data, 07 is a track because seven linked cards are a list to move
 * through rather than a grid to scroll past, 08
 * is the timed rail because its stages only happen in order, and 09 is the
 * flattest thing on the page because it is a list the reader scans for
 * themselves.
 */
export default function PartnersPage() {
  return (
    <>
      <PartnersHero />
      <PartnersWhy />
      <PartnersModels />
      <PartnersMarket />
      <PartnersHow />
      <PartnersFit />
      <PartnersFAQ />
      <PartnersCTA />
    </>
  );
}
