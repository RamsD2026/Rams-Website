"use client";

import { useNavVersion } from "@/components/ui/VersionSwitcher";
import { PlatformReveal } from "./PlatformReveal";
import { EcosystemSection } from "./EcosystemSection";
import { ChallengeSelector } from "./ChallengeSelector";
import { OperationShowcase } from "./OperationShowcase";
import { ThreeWaysToStart } from "./ThreeWaysToStart";
import BentoGrid from "./BentoGrid";
import { ProblemSelector } from "./ProblemSelector";
import { PhysicalOperation } from "./PhysicalOperation";
import { VisibilityGap } from "./VisibilityGap";
import { WhyRAMS } from "./WhyRAMS";
import { TechnologySystems } from "./TechnologySystems";
import { IndustriesCarousel } from "./IndustriesCarousel";
import { TrustCinematic } from "./TrustCinematic";
import { CustomerSuccess } from "./CustomerSuccess";
import { FinalCTA } from "./FinalCTA";

export function SectionsVersioned() {
  const [version] = useNavVersion();

  if (version === "v2") {
    return (
      <>
        <ProblemSelector />
        <BentoGrid />
        <PhysicalOperation />
        <VisibilityGap />
      </>
    );
  }

  return (
    <>
      <PlatformReveal />
      <ChallengeSelector />
      <EcosystemSection />
      <OperationShowcase />
      <ThreeWaysToStart />
      <TechnologySystems />
      <IndustriesCarousel />
      <WhyRAMS />
      <CustomerSuccess />
      <TrustCinematic />
      <FinalCTA />
    </>
  );
}
