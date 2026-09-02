import type { Metadata } from "next";
import { RtssHero } from "@/components/sections/rtss/RtssHero";
import { RtssDriving } from "@/components/sections/rtss/RtssDriving";
import { RtssOperator } from "@/components/sections/rtss/RtssOperator";
import { RtssImpact } from "@/components/sections/rtss/RtssImpact";
import { RtssActive } from "@/components/sections/rtss/RtssActive";
import { RtssResponse } from "@/components/sections/rtss/RtssResponse";
import { RtssHistory } from "@/components/sections/rtss/RtssHistory";
import { RtssAction } from "@/components/sections/rtss/RtssAction";
import { RtssOwners } from "@/components/sections/rtss/RtssOwners";
import { RtssVerify } from "@/components/sections/rtss/RtssVerify";
import { RtssValue } from "@/components/sections/rtss/RtssValue";
import { RtssEcosystem } from "@/components/sections/rtss/RtssEcosystem";
import { RtssCTA } from "@/components/sections/rtss/RtssCTA";
// import { RtssHardware } from "@/components/sections/rtss/RtssHardware";

export const metadata: Metadata = {
  title: "RAMS MHE Safety Intelligence — Powered by RTSS | RAMS",
  description:
    "RTSS turns MHE driving behaviour and safety events into connected intelligence — behaviour, event, context, evidence, pattern, action. Detect. Understand. Verify. Act. Learn.",
};

/**
 * RAMS MHE Safety Intelligence — the RTSS platform page.
 *
 * Built section by section on the system established by /platform/irds and
 * /platform/meps: <Section> surfaces, <SectionHeader>, the shared card and
 * frame treatments. Content follows the RTSS source document without change.
 */
export default function RtssPlatformPage() {
  return (
    <>
      <RtssHero />
      <RtssDriving />
      <RtssOperator />
      <RtssImpact />
      <RtssActive />
      <RtssResponse />
      <RtssHistory />
      <RtssAction />
      <RtssOwners />
      <RtssVerify />
      <RtssValue />
      <RtssEcosystem />
      <RtssCTA />
      {/* Hidden for now — the component is intact in
          src/components/sections/rtss/RtssHardware.tsx; uncomment the import
          above and this line to bring it back. */}
      {/* <RtssHardware /> */}
    </>
  );
}
