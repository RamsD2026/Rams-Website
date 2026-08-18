import type { Metadata } from "next";
import { MheHero } from "@/components/sections/mhe/MheHero";
import { MheStatsBand } from "@/components/sections/mhe/MheStatsBand";
import { MheCapabilities } from "@/components/sections/mhe/MheCapabilities";
import { MheFeaturePanels } from "@/components/sections/mhe/MheFeaturePanels";
import { MheWorkflow } from "@/components/sections/mhe/MheWorkflow";
import { MheWhy } from "@/components/sections/mhe/MheWhy";
import { MheAnalytics } from "@/components/sections/mhe/MheAnalytics";
import { MheProofResults } from "@/components/sections/mhe/MheProofResults";
import { MheCTA } from "@/components/sections/mhe/MheCTA";

export const metadata: Metadata = {
  title: "MHE Safety & Productivity | RAMS",
  description:
    "Monitor MHE activity, improve utilisation, reduce unsafe behaviour and turn movement data into actionable warehouse intelligence with RAMS.",
};

export default function MheIntelligencePage() {
  return (
    <>
      <MheHero />
      <MheStatsBand />
      <MheCapabilities />
      <MheFeaturePanels />
      <MheWorkflow />
      <MheAnalytics />
      <MheWhy />
      <MheProofResults />
      <MheCTA />
    </>
  );
}
