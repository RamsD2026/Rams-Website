import type { Metadata } from "next";
import { AtsHero } from "@/components/sections/atos/AtsHero";
import { AtsProblem } from "@/components/sections/atos/AtsProblem";
import { AtsOverview } from "@/components/sections/atos/AtsOverview";
import { AtsHow } from "@/components/sections/atos/AtsHow";
import { AtsCapabilities } from "@/components/sections/atos/AtsCapabilities";
import { AtsExperience } from "@/components/sections/atos/AtsExperience";
import { AtsOutcomes } from "@/components/sections/atos/AtsOutcomes";
import { AtsIntegrations } from "@/components/sections/atos/AtsIntegrations";
import { AtsUseCases } from "@/components/sections/atos/AtsUseCases";
import { AtsFAQ } from "@/components/sections/atos/AtsFAQ";
import { AtsCTA } from "@/components/sections/atos/AtsCTA";

export const metadata: Metadata = {
  title: "RAMS ATOS — Automated Task Orchestration System | RAMS",
  description:
    "ATOS converts orders, priorities, constraints and live operational events into executable warehouse tasks, resource assignments and continuously updated plans.",
};

/**
 * RAMS ATOS — the task orchestration platform page.
 *
 * Built on the eleven-section shape settled by /platform/digital-twin,
 * /platform/meps and /platform/irds, and using only the section patterns
 * those three established.
 *
 *   01 Hero      darkTop   the command centre, on the first screen
 *   02 Problem   white     the four ways a static plan fails a live operation
 *   03 Overview  offWhite  the six things the execution layer holds
 *   04 How       white     five steps, demand in to coordinated work out
 *   05 Capab.    offWhite  the six capability groups, sticky-scrolled
 *   06 Exper.    ink       one event, one replan — plan v18 against v19
 *   07 Outcomes  white     where execution becomes measurable
 *   08 Integr.   offWhite  what ATOS sits between
 *   09 Use cases white     the six process areas, in the carousel
 *   10 FAQ       offWhite  six questions, two of them saying no
 *   11 CTA       darkBtm   the close
 *
 * Surfaces alternate — no two adjacent sections share one.
 *
 * Nothing on this page is a grey placeholder and nothing is borrowed. There is
 * no ATOS capture in /public and the only registered screens in `SHOTS` are
 * IRDS's, so every product view here is drawn from written-down data — the
 * hero command centre, the five workflow panes, the three integration widgets
 * and the section-six frame. Another product's screenshot under an ATOS
 * heading would be a lie told with a picture.
 *
 * Section six is the page's argument. The switch is not before/after, it is
 * **plan v18 against plan v19**: one inbound truck is 45 minutes late, and the
 * same four figures, four queue rows, five resource lanes and one decision
 * block re-read themselves. The layout is identical on both sides — only the
 * values arrive — because the claim is that the warehouse did not change, the
 * plan did.
 *
 * Two joins made against the source document rather than following it
 * literally, both the same as on the IRDS page:
 *
 *   · Its Proof section listed four measures with no outcomes and its Outcomes
 *     section listed four outcomes with no measures. Merged into 07.
 *   · Its customer logo strip is not repeated — `RiqClients` already runs once
 *     on this page, in the hero.
 *
 * Held back, because none of the first three pages established a pattern for
 * them: Security & Compliance, Deployment / Implementation, and Scalability.
 */
export default function AtosPlatformPage() {
  return (
    <>
      <AtsHero />
      <AtsProblem />
      <AtsOverview />
      <AtsHow />
      <AtsCapabilities />
      <AtsExperience />
      <AtsOutcomes />
      <AtsIntegrations />
      <AtsUseCases />
      <AtsFAQ />
      <AtsCTA />
    </>
  );
}
