import type { Metadata } from "next";
import { MepsHero } from "@/components/sections/meps/MepsHero";
import { MepsProblem } from "@/components/sections/meps/MepsProblem";
import { MepsCapture } from "@/components/sections/meps/MepsCapture";
import { MepsHow } from "@/components/sections/meps/MepsHow";
import { MepsCapabilities } from "@/components/sections/meps/MepsCapabilities";
import { MepsExperience } from "@/components/sections/meps/MepsExperience";
import { MepsIntegrations } from "@/components/sections/meps/MepsIntegrations";
import { MepsProof } from "@/components/sections/meps/MepsProof";
import { MepsFAQ } from "@/components/sections/meps/MepsFAQ";
import { MepsCTA } from "@/components/sections/meps/MepsCTA";

export const metadata: Metadata = {
  title: "RAMS MHE Intelligence — Powered by MEPS | RAMS",
  description:
    "MEPS connects live MHE movement with the warehouse Digital Twin and turns it into productivity, efficiency and operational intelligence — where equipment is, what work it is doing, where performance is being lost and what can be improved.",
};

/**
 * RAMS MHE Intelligence — the MEPS platform page.
 *
 * Being rebuilt section by section, in order, as each one is approved. It
 * follows the section structure already settled on /platform/digital-twin.
 *
 *   01 Hero     darkTop  make every MHE movement count
 *   02 Problem  white    the four places movement stops being productive
 *   03 Capture  offWhite four things read, three questions answered
 *   04 How      white    five steps, one facility gaining a layer each
 *   05 Capab.   offWhite the six capability groups, sticky-scrolled
 *   06 Exper.   ink      the command centre, filtered three ways
 *   07 Integr.  offWhite what MEPS combines, and who shares the context
 *   08 Proof    white    what improvement is measured against
 *   09 FAQ      offWhite six questions, four of them drawing a boundary
 *   10 CTA      darkBtm  the close
 *
 * Surfaces alternate — no two adjacent sections share one.
 *
 * Still on disk but unimported, from the earlier full build:
 * MepsWhatIs, MepsCommandCentre, MepsProductivity, MepsEfficiency,
 * MepsEfficiencyAnalytics, MepsHistory, MepsOptimisation, MepsFleetSizing,
 * MepsSafety, MepsHardware, MepsDeployment, MepsBusinessCase, MepsCalculator,
 * MepsWho, MepsEcosystem.
 */
export default function MepsPlatformPage() {
  return (
    <>
      <MepsHero />
      <MepsProblem />
      <MepsCapture />
      <MepsHow />
      <MepsCapabilities />
      <MepsExperience />
      <MepsIntegrations />
      <MepsProof />
      <MepsFAQ />
      <MepsCTA />
    </>
  );
}
