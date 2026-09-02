import type { Metadata } from "next";
import { ImdsHero } from "@/components/sections/imds/ImdsHero";
import { ImdsArchitecture } from "@/components/sections/imds/ImdsArchitecture";
import { ImdsTriggers } from "@/components/sections/imds/ImdsTriggers";
import { ImdsSignals } from "@/components/sections/imds/ImdsSignals";
import { ImdsSensors } from "@/components/sections/imds/ImdsSensors";
import { ImdsPreshift } from "@/components/sections/imds/ImdsPreshift";
import { ImdsFaults } from "@/components/sections/imds/ImdsFaults";
import { ImdsWorkOrders } from "@/components/sections/imds/ImdsWorkOrders";
import { ImdsDamage } from "@/components/sections/imds/ImdsDamage";
import { ImdsHealth } from "@/components/sections/imds/ImdsHealth";
import { ImdsValue } from "@/components/sections/imds/ImdsValue";
import { ImdsEcosystem } from "@/components/sections/imds/ImdsEcosystem";
import { ImdsCTA } from "@/components/sections/imds/ImdsCTA";

export const metadata: Metadata = {
  title: "RAMS MHE Maintenance Intelligence — Powered by IMDS | RAMS",
  description:
    "IMDS turns real MHE usage — operating hours, lift cycles, fault codes and impacts — into planned maintenance, digital pre-shift inspections and tracked work orders. From reactive breakdowns to planned maintenance.",
};

/**
 * RAMS MHE Maintenance Intelligence — the IMDS platform page.
 *
 * Built section by section on the system established by /platform/irds,
 * /platform/meps and /platform/rtss: <Section> surfaces, <SectionHeader>, the
 * shared card and frame treatments. Content follows the IMDS source document.
 */
export default function ImdsPlatformPage() {
  return (
    <>
      <ImdsHero />
      <ImdsArchitecture />
      <ImdsTriggers />
      <ImdsSignals />
      <ImdsSensors />
      <ImdsPreshift />
      <ImdsFaults />
      <ImdsWorkOrders />
      <ImdsDamage />
      <ImdsHealth />
      <ImdsValue />
      <ImdsEcosystem />
      <ImdsCTA />
    </>
  );
}
