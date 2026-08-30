import type { Metadata } from "next";
import { MepsHero } from "@/components/sections/meps/MepsHero";
import { MepsWhatIs } from "@/components/sections/meps/MepsWhatIs";
import { MepsCommandCentre } from "@/components/sections/meps/MepsCommandCentre";
import { MepsProductivity } from "@/components/sections/meps/MepsProductivity";
import { MepsEfficiency } from "@/components/sections/meps/MepsEfficiency";
import { MepsEfficiencyAnalytics } from "@/components/sections/meps/MepsEfficiencyAnalytics";
import { MepsHistory } from "@/components/sections/meps/MepsHistory";
import { MepsOptimisation } from "@/components/sections/meps/MepsOptimisation";
import { MepsFleetSizing } from "@/components/sections/meps/MepsFleetSizing";
import { MepsSafety } from "@/components/sections/meps/MepsSafety";
import { MepsHardware } from "@/components/sections/meps/MepsHardware";
import { MepsDeployment } from "@/components/sections/meps/MepsDeployment";
import { MepsBusinessCase } from "@/components/sections/meps/MepsBusinessCase";
import { MepsCalculator } from "@/components/sections/meps/MepsCalculator";
import { MepsWho } from "@/components/sections/meps/MepsWho";
import { MepsEcosystem } from "@/components/sections/meps/MepsEcosystem";
import { MepsCTA } from "@/components/sections/meps/MepsCTA";

export const metadata: Metadata = {
  title: "RAMS MHE Intelligence — Powered by MEPS | RAMS",
  description:
    "MEPS connects live MHE movement with the warehouse Digital Twin and turns it into productivity, efficiency and operational intelligence — where equipment is, what work it is doing, where performance is being lost and what can be improved.",
};

/**
 * RAMS MHE Intelligence — the MEPS platform page.
 *
 * Built section by section on the system established by /platform/irds:
 * <Section> surfaces, <SectionHeader>, the shared card and frame treatments.
 * Content follows the MEPS source document without change.
 */
export default function MepsPlatformPage() {
  return (
    <>
      <MepsHero />
      <MepsWhatIs />
      <MepsCommandCentre />
      <MepsProductivity />
      <MepsEfficiency />
      <MepsEfficiencyAnalytics />
      <MepsHistory />
      <MepsOptimisation />
      <MepsFleetSizing />
      <MepsSafety />
      <MepsHardware />
      <MepsDeployment />
      <MepsBusinessCase />
      <MepsCalculator />
      <MepsWho />
      <MepsEcosystem />
      <MepsCTA />
    </>
  );
}
