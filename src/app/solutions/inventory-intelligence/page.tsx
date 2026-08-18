import type { Metadata } from "next";
import { InvHero } from "@/components/sections/inv/InvHero";
import { InvStatsBand } from "@/components/sections/inv/InvStatsBand";
import { InvFeatures } from "@/components/sections/inv/InvFeatures";
import { InvFeaturePanels } from "@/components/sections/inv/InvFeaturePanels";
import { InvWorkflow } from "@/components/sections/inv/InvWorkflow";
import { InvAnalytics } from "@/components/sections/inv/InvAnalytics";
import { InvWhy } from "@/components/sections/inv/InvWhy";
import { InvProofResults } from "@/components/sections/inv/InvProofResults";
import { InvCTA } from "@/components/sections/inv/InvCTA";

export const metadata: Metadata = {
  title: "Inventory Intelligence | RAMS",
  description:
    "Real-time inventory visibility across every location. RAMS Inventory Intelligence unifies AI vision, IoT and WMS reconciliation into a single source of truth.",
};

export default function InventoryIntelligencePage() {
  return (
    <>
      <InvHero />
      <InvStatsBand />
      <InvFeatures />
      <InvFeaturePanels />
      <InvWorkflow />
      <InvAnalytics />
      <InvWhy />
      <InvProofResults />
      <InvCTA />
    </>
  );
}
