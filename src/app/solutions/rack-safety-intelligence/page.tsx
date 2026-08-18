import type { Metadata } from "next";
import { IrdsHero } from "@/components/sections/irds/IrdsHero";
import { IrdsStatsBand } from "@/components/sections/irds/IrdsStatsBand";
import { IrdsCapabilities } from "@/components/sections/irds/IrdsCapabilities";
import { IrdsFeaturePanels } from "@/components/sections/irds/IrdsFeaturePanels";
import { IrdsWorkflow } from "@/components/sections/irds/IrdsWorkflow";
import { IrdsRiskAnalytics } from "@/components/sections/irds/IrdsRiskAnalytics";
import { IrdsWhy } from "@/components/sections/irds/IrdsWhy";
import { IrdsProofResults } from "@/components/sections/irds/IrdsProofResults";
import { IrdsCTA } from "@/components/sections/irds/IrdsCTA";

export const metadata: Metadata = {
  title: "Rack Safety and Intelligence | RAMS",
  description:
    "Improve rack safety, compliance, and lifecycle management with RAMS - unifying expert rack inspection, digital rack twin, RAG risk classification, and corrective-action closure.",
};

export default function RackSafetyIntelligencePage() {
  return (
    <>
      <IrdsHero />
      <IrdsStatsBand />
      <IrdsCapabilities />
      <IrdsFeaturePanels />
      <IrdsWorkflow />
      <IrdsRiskAnalytics />
      <IrdsWhy />
      <IrdsProofResults />
      <IrdsCTA />
    </>
  );
}
