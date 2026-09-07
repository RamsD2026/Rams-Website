import type { Metadata } from "next";
import { IrxHero } from "@/components/sections/irdsx/IrxHero";
import { IrxNav } from "@/components/sections/irdsx/IrxNav";
import { IrxStory } from "@/components/sections/irdsx/IrxStory";
import { IrxField } from "@/components/sections/irdsx/IrxField";
import { IrxConsole } from "@/components/sections/irdsx/IrxConsole";
import { IrxSystem } from "@/components/sections/irdsx/IrxSystem";
import { IrxResult } from "@/components/sections/irdsx/IrxResult";
import { IrxRoles } from "@/components/sections/irdsx/IrxRoles";
import { IrxCTA } from "@/components/sections/irdsx/IrxCTA";

export const metadata: Metadata = {
  title: "IRDS 0.1 — The rack inspection platform | RAMS",
  description:
    "One rack record, written from the floor and the desk. The field app captures the audit at the rack; the web console configures the method, reviews the findings and builds the evidence.",
  /* Hidden while it is being worked on: no nav entry, and not indexed. The
     route still resolves, so the URL can be opened directly to review it. */
  robots: { index: false, follow: false },
};

/**
 * IRDS 0.1 — the platform page.
 *
 * Two products and one storyline. That is the whole structure, and it is the
 * thing the first two attempts at this page got wrong: they described a
 * platform without ever saying what the app is, what the console is, or which
 * one a given piece of work happens on.
 *
 *   01 Hero     darkTop   what it is, with the product on the first screen
 *   --  Nav     sticky    anchors into every section
 *   02 Story    ink       one cycle as a swimlane — console lane, field lane,
 *                         and the line that crosses between them
 *   03 Field    offWhite  IRDS Field, the audit app, with its six features
 *   04 Console  white     IRDS Console, the web platform, with its eight
 *                         modules — built as a sidebar and a workspace
 *   05 Link     offWhite  how the two write to one record
 *   06 Result   white     the rack summary one cycle produces
 *   07 Roles    offWhite  who acts on the record
 *   08 Why RAMS white     structured, traceable, connected, scalable
 *   09 CTA      darkBtm   the close
 *
 * Surfaces alternate — no two adjacent sections share one.
 *
 * The two product sections are deliberately built differently. Field is a
 * phone flanked by its features, because a phone is one screen at a time.
 * Console is a sidebar and a workspace, because that is what a console is.
 * Giving them the same interaction would have said they are the same product,
 * which is the confusion this page exists to remove.
 *
 * Nothing is illustrated. Where a real capture goes, a labelled grey plate
 * goes instead, carrying the brief for the recording it stands in for.
 *
 * `/platform/irds` is untouched and still uses the `rds` components.
 *
 * This page is currently **hidden**: it has no entry in either navigation
 * config and carries `robots: noindex, nofollow`. The route still resolves,
 * so /platform/irds-0-1 opens directly. Put the nav entry back in
 * `navigation.ts` (Platform group, after IRDS) and drop the `robots` field
 * to publish it.
 */
export default function Irds01Page() {
  return (
    <>
      <IrxHero />
      <IrxNav />
      <IrxStory />
      <IrxField />
      <IrxConsole />
      <IrxSystem />
      <IrxResult />
      <IrxRoles />
      <IrxCTA />
    </>
  );
}
