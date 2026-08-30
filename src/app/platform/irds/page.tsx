import type { Metadata } from "next";
import { RiqHero } from "@/components/sections/rackiq/RiqHero";
import { RiqWhatIs } from "@/components/sections/rackiq/RiqWhatIs";
import { RiqQuestions } from "@/components/sections/rackiq/RiqQuestions";
import { RiqCondition } from "@/components/sections/rackiq/RiqCondition";
import { RiqSeverity } from "@/components/sections/rackiq/RiqSeverity";
import { RiqLifecycle } from "@/components/sections/rackiq/RiqLifecycle";
import { RiqLocation } from "@/components/sections/rackiq/RiqLocation";
import { RiqHistory } from "@/components/sections/rackiq/RiqHistory";
import { RiqHotspots } from "@/components/sections/rackiq/RiqHotspots";
import { RiqAction } from "@/components/sections/rackiq/RiqAction";
import { RiqAllYear } from "@/components/sections/rackiq/RiqAllYear";
import { RiqClosure } from "@/components/sections/rackiq/RiqClosure";
import { RiqReport } from "@/components/sections/rackiq/RiqReport";
import { RiqTech } from "@/components/sections/rackiq/RiqTech";
import { RiqRoles } from "@/components/sections/rackiq/RiqRoles";
import { RiqScale } from "@/components/sections/rackiq/RiqScale";
import { RiqEcosystem } from "@/components/sections/rackiq/RiqEcosystem";
import { RiqCTA } from "@/components/sections/rackiq/RiqCTA";

export const metadata: Metadata = {
  title: "RAMS Rack Intelligence — Powered by IRDS | RAMS",
  description:
    "IRDS is a structured rack intelligence and lifecycle management platform. Inspect digitally, record engineering measurements, classify by risk and lifecycle, understand recurring patterns, assign corrective action and verify closure — all year, against one connected rack record.",
};

/**
 * RAMS Rack Intelligence — the IRDS platform page.
 *
 * Composition follows the RAMS IRDS reference layout: chapter-tagged,
 * left-aligned section heads and two-column splits. Type, colour and surfaces
 * are the site's own — see docs/typography.md and docs/section-header.md.
 *
 * Surfaces alternate light/dark exactly as the reference does:
 * dark → white → offWhite → white → offWhite → white → dark → white →
 * offWhite → white → warm → white → offWhite → dark → white → offWhite →
 * white → dark.
 */
export default function IrdsPlatformPage() {
  return (
    <>
      <RiqHero />
      <RiqWhatIs />
      <RiqQuestions />

      {/* 01 — what is the condition? */}
      <RiqCondition />

      {/* 02 — how serious is it? */}
      <RiqSeverity />
      <RiqLifecycle />

      {/* 03 — why and where is it happening? */}
      <RiqLocation />
      <RiqHistory />
      <RiqHotspots />

      {/* 04 — what needs to be done? */}
      <RiqAction />
      <RiqAllYear />

      {/* 05 — was it solved? */}
      <RiqClosure />

      <RiqReport />
      <RiqTech />
      <RiqRoles />
      <RiqScale />
      <RiqEcosystem />
      <RiqCTA />
    </>
  );
}
