import type { Metadata } from "next";
import { RdsHero } from "@/components/sections/rds/RdsHero";
import { RdsProblem } from "@/components/sections/rds/RdsProblem";
import { RdsOverview } from "@/components/sections/rds/RdsOverview";
import { RdsHow } from "@/components/sections/rds/RdsHow";
import { RdsCapabilities } from "@/components/sections/rds/RdsCapabilities";
import { RdsExperience } from "@/components/sections/rds/RdsExperience";
import { RdsOutcomes } from "@/components/sections/rds/RdsOutcomes";
import { RdsIntegrations } from "@/components/sections/rds/RdsIntegrations";
import { RdsUseCases } from "@/components/sections/rds/RdsUseCases";
import { RdsFAQ } from "@/components/sections/rds/RdsFAQ";
import { RdsCTA } from "@/components/sections/rds/RdsCTA";

export const metadata: Metadata = {
  title: "RAMS Rack Intelligence — Powered by IRDS | RAMS",
  description:
    "IRDS—Integrated Rack Diagnostic Suite—digitises rack inspections, maps findings to exact components, prioritises risk and manages corrective action through verification.",
};

/**
 * RAMS Rack Intelligence — the IRDS platform page.
 *
 * Rebuilt on the eleven-section shape settled by /platform/digital-twin and
 * /platform/meps, and using only the section patterns those two established.
 *
 *   01 Hero      darkTop   know the health of every rack
 *   02 Problem   white     the four ways a finding goes cold
 *   03 Overview  offWhite  the twelve things the rack record holds
 *   04 How       white     five steps, inspection to verified closure
 *   05 Capab.    offWhite  six capabilities, sticky-scrolled over real screens
 *   06 Exper.    ink       rack health, filtered four ways
 *   07 Outcomes  white     where rack safety becomes measurable
 *   08 Integr.   offWhite  what IRDS connects, and who shares the rack identity
 *   09 Use cases white      the six programme areas, in the carousel
 *   10 FAQ       offWhite  six questions rack safety teams ask
 *   11 CTA       darkBtm   the close
 *
 * Surfaces alternate — no two adjacent sections share one.
 *
 * Two joins made against the source document rather than following it
 * literally:
 *
 *   · Its Proof section listed four measures with no outcomes and its Outcomes
 *     section listed four outcomes with no measures. They are merged into 07:
 *     an outcome without its measure is an adjective, and a measure with no
 *     outcome attached is a chart.
 *   · Its customer logo strip is not repeated in 09. `RiqClients` already runs
 *     once on this page, in the hero.
 *
 * Held back, because neither of the first two pages established a pattern for
 * them: Security & Compliance, Deployment / Implementation, and Scalability.
 *
 * The previous build composed this page entirely from the `rackiq` components
 * (RiqHero through RiqCTA). Those are all still on disk and still used by
 * /platform/rackiq.
 */
export default function IrdsPlatformPage() {
  return (
    <>
      <RdsHero />
      <RdsProblem />
      <RdsOverview />
      <RdsHow />
      <RdsCapabilities />
      <RdsExperience />
      <RdsOutcomes />
      <RdsIntegrations />
      <RdsUseCases />
      <RdsFAQ />
      <RdsCTA />
    </>
  );
}
