import type { Metadata } from "next";
import { ImdHero } from "@/components/sections/imd/ImdHero";
import { ImdProblem } from "@/components/sections/imd/ImdProblem";
import { ImdCapture } from "@/components/sections/imd/ImdCapture";
import { ImdHow } from "@/components/sections/imd/ImdHow";
import { ImdCapabilities } from "@/components/sections/imd/ImdCapabilities";
import { ImdExperience } from "@/components/sections/imd/ImdExperience";
import { ImdOutcomes } from "@/components/sections/imd/ImdOutcomes";
import { ImdIntegrations } from "@/components/sections/imd/ImdIntegrations";
import { ImdFAQ } from "@/components/sections/imd/ImdFAQ";
import { ImdCTA } from "@/components/sections/imd/ImdCTA";

export const metadata: Metadata = {
  title: "RAMS IMDS — Integrated MHE Diagnostic System | RAMS",
  description:
    "IMDS connects equipment condition, faults, battery health, usage, impacts, inspections and maintenance history to create a living diagnostic record for every MHE.",
};

/**
 * RAMS IMDS — the MHE diagnostics platform page.
 *
 * Rebuilt on the eleven-section shape shared with /platform/digital-twin,
 * /platform/meps, /platform/irds, /platform/ai-operational-intelligence and
 * /platform/rtss, using only the section patterns those established.
 *
 *   01 Hero      darkTop   the diagnostics command centre, on the first screen
 *   02 Problem   white     the four ways maintenance starts too late
 *   03 What it is offWhite  five sources into one record, on one canvas
 *   04 How       white     five steps, equipment signal to verified maintenance
 *   05 Capab.    offWhite  the six capability groups, sticky-scrolled
 *   06 Exper.    ink       one parameter crossing its threshold
 *   07 Outcomes  white     where reliability becomes measurable
 *   08 Integr.   offWhite  the fleet, the site systems and the RAMS modules
 *   09 FAQ       white     six questions, two of them saying no
 *   10 CTA       darkBtm   the close
 *
 * Surfaces alternate — no two adjacent sections share one.
 *
 * Nothing here is a grey placeholder and nothing is borrowed. There is no IMDS
 * capture in /public and the only registered screens in `SHOTS` are IRDS's, so
 * every product view is drawn from written-down data.
 *
 * Section six is the argument, and it runs the source document's own "simulate
 * diagnostic fault": on one side MHE 04 is healthy at 87 with no open codes;
 * on the other, one battery temperature has crossed 45 °C and the score, the
 * fleet counts, the trend's last point, the six asset rows and the attention
 * list all re-read together. The layout is identical on both sides.
 *
 * Two of the FAQ answers are a flat no, and both are load-bearing: IMDS does
 * not replace the OEM diagnostic tool, and it cannot predict every breakdown.
 * A diagnostics product that implies either invites a workshop to skip
 * manufacturer procedure or a fleet manager to stop inspecting.
 *
 * The previous build composed this page from the `imds` components (ImdsHero
 * through ImdsCTA). Those are all still on disk and now unimported.
 */
export default function ImdsPlatformPage() {
  return (
    <>
      <ImdHero />
      <ImdProblem />
      <ImdCapture />
      <ImdHow />
      <ImdCapabilities />
      <ImdExperience />
      <ImdOutcomes />
      <ImdIntegrations />
      <ImdFAQ />
      <ImdCTA />
    </>
  );
}
