import type { Metadata } from "next";
import { TwinHero } from "@/components/sections/twin/TwinHero";
import { TwinProblem } from "@/components/sections/twin/TwinProblem";
import { TwinOverview } from "@/components/sections/twin/TwinOverview";
import { TwinHow } from "@/components/sections/twin/TwinHow";
import { TwinLayers } from "@/components/sections/twin/TwinLayers";
import { TwinExperience } from "@/components/sections/twin/TwinExperience";
import { TwinOutcomes } from "@/components/sections/twin/TwinOutcomes";
import { TwinIntegrations } from "@/components/sections/twin/TwinIntegrations";
import { TwinProof } from "@/components/sections/twin/TwinProof";
import { TwinFAQ } from "@/components/sections/twin/TwinFAQ";
import { TwinCTA } from "@/components/sections/twin/TwinCTA";

export const metadata: Metadata = {
  title: "Digital Twin | RAMS Platform",
  description:
    "Turn your facility into a living digital system. One structured model of the building that every asset, sensor, camera and application resolves back into — every event in context, every change kept as history.",
};

/**
 * Rebuilt section by section, in order, as each one is approved.
 *
 *   01 Hero      darkTop   the live model
 *   02 Problem   white     four things scattered information costs you
 *   03 Overview  offWhite  the sixteen dimensions the twin holds
 *   04 How       white     six steps, one facility gaining a layer each
 *   05 Layers    offWhite  the 8D framework, sticky-scrolled
 *   06 Experience ink      static model ⇄ live data, one switch
 *   07 Outcomes  white     the four places value lands
 *   08 Integr.   offWhite  four connection routes, and the signal path
 *   09 Proof     white     the seven applications already on the twin
 *   10 FAQ       offWhite  eight questions, three of them answered no
 *   11 CTA       darkBtm   the close
 *
 * Surfaces alternate — no two adjacent sections share one.
 *
 * Still on disk but unimported, from the earlier full build:
 * TwinConcept, TwinCapabilities, TwinAction, TwinIntelligence, TwinUseCases,
 * TwinSecurity.
 */
export default function DigitalTwinPage() {
  return (
    <>
      <TwinHero />
      <TwinProblem />
      <TwinOverview />
      <TwinHow />
      <TwinLayers />
      <TwinExperience />
      <TwinOutcomes />
      <TwinIntegrations />
      <TwinProof />
      <TwinFAQ />
      <TwinCTA />
    </>
  );
}
