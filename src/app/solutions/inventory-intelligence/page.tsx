import type { Metadata } from "next";
import { InvHero } from "@/components/sections/inv/InvHero";
import { InvStatsBand } from "@/components/sections/inv/InvStatsBand";
import { InvFeatures } from "@/components/sections/inv/InvFeatures";
import { InvABC } from "@/components/sections/inv/InvABC";
import { InvATOS } from "@/components/sections/inv/InvATOS";
import { InvFeaturePanels } from "@/components/sections/inv/InvFeaturePanels";
import { InvWorkflow } from "@/components/sections/inv/InvWorkflow";
import { InvAnalytics } from "@/components/sections/inv/InvAnalytics";
import { InvWhy } from "@/components/sections/inv/InvWhy";
import { InvCTA } from "@/components/sections/inv/InvCTA";

export const metadata: Metadata = {
  title: "Inventory Intelligence | RAMS",
  description:
    "Know what you have. Know where it is. RAMS turns inventory movement, location and reconciliation data into a connected intelligence layer — with ABC classification and ATOS pallet-movement intelligence built in.",
};

export default function InventoryIntelligencePage() {
  return (
    <>
      <InvHero />
      <InvStatsBand />
      <InvFeatures />
      <InvABC />
      <InvATOS />
      <InvFeaturePanels />
      <InvWorkflow />
      <InvAnalytics />
      <InvWhy />
      <InvCTA />
    </>
  );
}
