import type { Metadata } from "next";
import { CareersComingSoon } from "@/components/sections/careers/CareersComingSoon";

export const metadata: Metadata = {
  title: "Technical Notes — Coming Soon | RAMS Digital",
  description:
    "Integration and API notes for connecting enterprise systems, sensors and edge devices to the RAMS Digital Twin. Coming soon.",
};

/**
 * /resources/technical-notes — a holding page until the notes are published.
 *
 * The notes themselves are still on disk: `technotes/TechNotes` and
 * `technotes/DocsClose` render the full library, and restoring this page is
 * a matter of rendering them here again in place of the holding screen.
 */
export default function TechnicalNotesPage() {
  return <CareersComingSoon eyebrow="Technical notes" />;
}
