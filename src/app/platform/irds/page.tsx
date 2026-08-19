import type { Metadata } from "next";
import { IrdspHero } from "@/components/sections/irdsp/IrdspHero";
import { IrdspWhy } from "@/components/sections/irdsp/IrdspWhy";
import { IrdspSteps } from "@/components/sections/irdsp/IrdspSteps";
import { IrdspPlatform } from "@/components/sections/irdsp/IrdspPlatform";
import { IrdspWho } from "@/components/sections/irdsp/IrdspWho";

export const metadata: Metadata = {
  title: "IRDS Platform | RAMS",
  description:
    "A connected workspace for rack inspection and testing. Configure inspections, run integrity testing, capture results, manage issues and build the engineering evidence — in one system.",
};

export default function IrdsPlatformPage() {
  return (
    <>
      <IrdspHero />
      <IrdspWhy />
      <IrdspSteps />
      <IrdspPlatform />
      <IrdspWho />
    </>
  );
}
