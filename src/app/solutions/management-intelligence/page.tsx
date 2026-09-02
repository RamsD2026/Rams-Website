import type { Metadata } from "next";
import { AimsHero } from "@/components/sections/aims/AimsHero";
import { AimsStatsBand } from "@/components/sections/aims/AimsStatsBand";
import { AimsConnected } from "@/components/sections/aims/AimsConnected";
import { AimsTwin } from "@/components/sections/aims/AimsTwin";
import { AimsCrossModule } from "@/components/sections/aims/AimsCrossModule";
import { AimsLoop } from "@/components/sections/aims/AimsLoop";
import { AimsDirection } from "@/components/sections/aims/AimsDirection";
import { AimsBenchmark } from "@/components/sections/aims/AimsBenchmark";
import { AimsLevels } from "@/components/sections/aims/AimsLevels";
import { AimsCTA } from "@/components/sections/aims/AimsCTA";

export const metadata: Metadata = {
  title: "Management Intelligence | RAMS",
  description:
    "One warehouse network, one decision layer. RAMS Management Intelligence unifies safety, asset, inventory and productivity data into a live management view that reveals what is changing on site, why it matters and who must act.",
};

/**
 * Management Intelligence — the sixth solution page.
 *
 * Built on the same system as the other solution pages: the dark hero with a
 * full-width product board, then the sections beneath. Content follows the
 * AIMS solution source.
 */
export default function ManagementIntelligencePage() {
  return (
    <>
      <AimsHero />
      <AimsStatsBand />
      <AimsConnected />
      <AimsTwin />
      <AimsCrossModule />
      <AimsLoop />
      <AimsDirection />
      <AimsBenchmark />
      <AimsLevels />
      <AimsCTA />
    </>
  );
}
