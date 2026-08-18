import type { Metadata } from "next";
import { MepsHero } from "@/components/sections/meps/MepsHero";
import { MepsIntro } from "@/components/sections/meps/MepsIntro";
import { MepsCapabilities } from "@/components/sections/meps/MepsCapabilities";
import { MepsHowItWorks } from "@/components/sections/meps/MepsHowItWorks";
import { MepsIntegrations } from "@/components/sections/meps/MepsIntegrations";
import { MepsOutcomes } from "@/components/sections/meps/MepsOutcomes";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "MEPS - MHE Efficiency and Productivity System | RAMS",
  description:
    "MEPS turns your MHE fleet into a live, measurable, and controllable system - vehicle telemetry, operator behaviour, and utilisation intelligence unified at the edge.",
};

export default function MepsPage() {
  return (
    <>
      <MepsHero />
      <MepsIntro />
      <MepsCapabilities />
      <MepsHowItWorks />
      <MepsIntegrations />
      <MepsOutcomes />
      <FinalCTA />
    </>
  );
}
