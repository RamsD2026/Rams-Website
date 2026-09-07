import type { Metadata } from "next";
import { AmsHero } from "@/components/sections/ams/AmsHero";
import { AmsProblem } from "@/components/sections/ams/AmsProblem";
import { AmsCapture } from "@/components/sections/ams/AmsCapture";
import { AmsHow } from "@/components/sections/ams/AmsHow";
import { AmsCapabilities } from "@/components/sections/ams/AmsCapabilities";
import { AmsExperience } from "@/components/sections/ams/AmsExperience";
import { AmsOutcomes } from "@/components/sections/ams/AmsOutcomes";
import { AmsIntegrations } from "@/components/sections/ams/AmsIntegrations";
import { AmsUseCases } from "@/components/sections/ams/AmsUseCases";
import { AmsFAQ } from "@/components/sections/ams/AmsFAQ";
import { AmsCTA } from "@/components/sections/ams/AmsCTA";

export const metadata: Metadata = {
  title: "RAMS AIMS — AI Intelligence and Management System | RAMS",
  description:
    "AIMS connects live Digital Twin visibility with safety, productivity, inventory, maintenance and execution data to give management one direct view of what is happening and what needs attention.",
};

/**
 * RAMS AIMS — the management intelligence platform page.
 *
 * The route is /platform/security because that is where the platform nav has
 * always pointed AIMS. Until now nothing was there and the link 404ed.
 *
 * Built on the eleven-section shape shared with /platform/digital-twin,
 * /platform/meps, /platform/irds, /platform/ai-operational-intelligence,
 * /platform/rtss and /platform/imds, using only the section patterns those
 * established.
 *
 *   01 Hero      darkTop   the control tower, twenty-four sites, on first screen
 *   02 Problem   white     the four ways the reporting chain loses the operation
 *   03 What it is offWhite four modules into one engine, on one canvas
 *   04 How       white     six steps, connected data to management action
 *   05 Capab.    offWhite  the six capability groups, sticky-scrolled
 *   06 Exper.    ink       one site changes, and the network number moves
 *   07 Outcomes  white     what shortens, and what measures it
 *   08 Integr.   offWhite  the modules, the physical context, the enterprise
 *   09 Use cases white     the six management activities, in the carousel
 *   10 FAQ       offWhite  six questions, two of them saying no
 *   11 CTA       darkBtm   the close
 *
 * Surfaces alternate — no two adjacent sections share one.
 *
 * Section three replaces the coloured-tile overview grid every other platform
 * page carries, on request and for a reason that only applies here: AIMS is
 * the one module whose inputs are other modules. A six-tile grid of nouns
 * cannot say that; a hub with four products feeding it can. The layout is the
 * `MepsCapture` / `ImdCapture` canvas, and the copy is the source document's
 * own "What AIMS is".
 *
 * Nothing here is a grey placeholder and nothing is borrowed. There is no AIMS
 * capture in /public and the only registered screens in `SHOTS` are IRDS's, so
 * every product view is drawn from written-down data.
 *
 * Section six is the argument, and it runs the source document's own "simulate
 * a live site change": on one side the network reads 86.4 with seventeen
 * priorities; on the other, one site's staging zone has changed and the index,
 * the priority ranking, the site record and the closing line all re-read. The
 * layout is identical on both sides.
 *
 * Two of the FAQ answers are a flat no, and both are load-bearing: AIMS is not
 * a reporting dashboard, and it does not decide. A management product that
 * implies the second invites a board to read a ranked list as an instruction,
 * which is why the security section's disclaimer is carried under them.
 */
export default function AimsPlatformPage() {
  return (
    <>
      <AmsHero />
      <AmsProblem />
      <AmsCapture />
      <AmsHow />
      <AmsCapabilities />
      <AmsExperience />
      <AmsOutcomes />
      <AmsIntegrations />
      <AmsUseCases />
      <AmsFAQ />
      <AmsCTA />
    </>
  );
}
