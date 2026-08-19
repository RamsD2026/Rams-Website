import type { Metadata } from "next";
import { DtwHero } from "@/components/sections/dtw/DtwHero";
import { DtwPillars } from "@/components/sections/dtw/DtwPillars";
import { DtwWatch } from "@/components/sections/dtw/DtwWatch";
import { DtwHighlights } from "@/components/sections/dtw/DtwHighlights";
import { DtwCompare } from "@/components/sections/dtw/DtwCompare";
import { DtwSecurity } from "@/components/sections/dtw/DtwSecurity";
import { DtwFAQ } from "@/components/sections/dtw/DtwFAQ";
import { DtwCTA } from "@/components/sections/dtw/DtwCTA";

export const metadata: Metadata = {
  title: "Digital Twin | RAMS Platform",
  description:
    "One live spatial model of your warehouse that every RAMS system reads from and writes back to — every rack, bay, pallet, vehicle and task with a single address the whole operation agrees on.",
};

export default function DigitalTwinPage() {
  return (
    <>
      <DtwHero />
      <DtwPillars />
      <DtwWatch />
      <DtwHighlights />
      <DtwCompare />
      <DtwSecurity />
      <DtwFAQ />
      <DtwCTA />
    </>
  );
}
