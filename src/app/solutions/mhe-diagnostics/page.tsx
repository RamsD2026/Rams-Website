import type { Metadata } from "next";
import { DiaHero } from "@/components/sections/dia/DiaHero";
import { DiaStatsBand } from "@/components/sections/dia/DiaStatsBand";
import { DiaCapabilities } from "@/components/sections/dia/DiaCapabilities";
import { DiaPanels } from "@/components/sections/dia/DiaPanels";
import { DiaWorkflow } from "@/components/sections/dia/DiaWorkflow";
import { DiaWhy } from "@/components/sections/dia/DiaWhy";
import { DiaAnalytics } from "@/components/sections/dia/DiaAnalytics";
import { DiaCTA } from "@/components/sections/dia/DiaCTA";

export const metadata: Metadata = {
  title: "MHE Diagnostics and Maintenance | RAMS",
  description:
    "Know machine health, prevent downtime and keep fleets ready. RAMS brings machine diagnostics, battery intelligence, maintenance planning and service visibility into one connected layer for warehouse MHE operations.",
};

/**
 * MHE Diagnostics and Maintenance — the fifth solution page.
 *
 * Built on the same system as the other solution pages: the dark hero with a
 * full-width product board, then the light sections beneath. Content follows
 * the IMDS solution source document.
 */
export default function MheDiagnosticsPage() {
  return (
    <>
      <DiaHero />
      <DiaStatsBand />
      <DiaCapabilities />
      <DiaPanels />
      <DiaWorkflow />
      <DiaWhy />
      <DiaAnalytics />
      <DiaCTA />
    </>
  );
}
