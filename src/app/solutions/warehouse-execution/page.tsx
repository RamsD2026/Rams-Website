import type { Metadata } from "next";
import { WexHero } from "@/components/sections/wex/WexHero";
import { WexStatsBand } from "@/components/sections/wex/WexStatsBand";
import { WexCapabilities } from "@/components/sections/wex/WexCapabilities";
import { WexFeaturePanels } from "@/components/sections/wex/WexFeaturePanels";
import { WexWorkflow } from "@/components/sections/wex/WexWorkflow";
import { WexReprioritisation } from "@/components/sections/wex/WexReprioritisation";
import { WexAnalytics } from "@/components/sections/wex/WexAnalytics";
import { WexWhy } from "@/components/sections/wex/WexWhy";
import { WexCTA } from "@/components/sections/wex/WexCTA";

export const metadata: Metadata = {
  title: "Warehouse Execution | RAMS",
  description:
    "Turn warehouse plans into real-time execution. RAMS ATOS connects tasks, MHEs, operators, pallets and zones into one execution layer — prioritising, assigning, tracking and improving work as conditions change.",
};

export default function WarehouseExecutionPage() {
  return (
    <>
      <WexHero />
      <WexStatsBand />
      <WexCapabilities />
      <WexFeaturePanels />
      <WexWorkflow />
      <WexReprioritisation />
      <WexAnalytics />
      <WexWhy />
      <WexCTA />
    </>
  );
}
