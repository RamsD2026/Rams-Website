import type { Metadata } from "next";
import { RtsHero } from "@/components/sections/rts/RtsHero";
import { RtsProblem } from "@/components/sections/rts/RtsProblem";
import { RtsOverview } from "@/components/sections/rts/RtsOverview";
import { RtsHow } from "@/components/sections/rts/RtsHow";
import { RtsCapabilities } from "@/components/sections/rts/RtsCapabilities";
import { RtsExperience } from "@/components/sections/rts/RtsExperience";
import { RtsOutcomes } from "@/components/sections/rts/RtsOutcomes";
import { RtsIntegrations } from "@/components/sections/rts/RtsIntegrations";
import { RtsFAQ } from "@/components/sections/rts/RtsFAQ";
import { RtsCTA } from "@/components/sections/rts/RtsCTA";

export const metadata: Metadata = {
  title: "RAMS RTSS — Real-Time Safety System | RAMS",
  description:
    "RTSS connects MHE movement, impacts, driver behaviour, safety zones and live operational context so teams can detect risk, respond faster and prevent recurrence.",
};

/**
 * RAMS RTSS — the real-time safety platform page.
 *
 * Rebuilt on the eleven-section shape settled by /platform/digital-twin,
 * /platform/meps, /platform/irds and /platform/ai-operational-intelligence,
 * using only the section patterns those established.
 *
 *   01 Hero      darkTop   the safety command centre, on the first screen
 *   02 Problem   white     the four ways a safety system arrives too late
 *   03 Overview  offWhite  the six things the safety layer holds
 *   04 How       white     five steps, physical signal to preventive action
 *   05 Capab.    offWhite  the six capability groups, sticky-scrolled
 *   06 Exper.    ink       one proximity event, and the record re-reading
 *   07 Outcomes  white     where safety becomes measurable
 *   08 Integr.   offWhite  hardware, client systems and the RAMS modules
 *   09 FAQ       white     six questions, one of them the important no
 *   10 CTA       darkBtm   the close
 *
 * Surfaces alternate — no two adjacent sections share one.
 *
 * Nothing on this page is a grey placeholder and nothing is borrowed. There is
 * no RTSS capture in /public and the only registered screens in `SHOTS` are
 * IRDS's, so every product view is drawn from written-down data.
 *
 * Section six is the argument. The switch runs the source document's own
 * "simulate proximity risk": on one side MHE 04 is inside every limit — 5.2
 * km/h against a 6.0 limit, 6.4 m of separation — and on the other, one thing
 * has changed in the physical world and the speed, the separation, the risk
 * status, the event list and the high-risk count all re-read together. The
 * layout is identical on both sides, so what the reader sees move is the
 * information, not the page.
 *
 * The most important sentence on the page is in the FAQ: no technology can
 * guarantee that no accident happens. A safety product that implies otherwise
 * invites a site to lean on it instead of on risk assessment, engineered
 * controls, training and supervision, so the answer names all four. Nothing
 * here is presented as a customer result either.
 *
 * The previous build composed this page from the `rtss` components (RtssHero
 * through RtssCTA). Those are all still on disk and unimported.
 */
export default function RtssPlatformPage() {
  return (
    <>
      <RtsHero />
      <RtsProblem />
      <RtsOverview />
      <RtsHow />
      <RtsCapabilities />
      <RtsExperience />
      <RtsOutcomes />
      <RtsIntegrations />
      <RtsFAQ />
      <RtsCTA />
    </>
  );
}
