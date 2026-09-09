import type { Metadata } from "next";
import { CareersComingSoon } from "@/components/sections/careers/CareersComingSoon";

export const metadata: Metadata = {
  title: "Careers | RAMS Digital",
  description:
    "Careers at RAMS Digital. Roles are on their way.",
};

/**
 * /company/careers — a holding page.
 *
 * The footer has linked Careers since it was written and the route returned a
 * 404, which is worse than an honest holding page: a dead link in a footer
 * reads as a broken site rather than as a page that is not ready.
 *
 * One section, full viewport, and no header of its own — see
 * `CareersComingSoon` for the eclipse. The page is dark and does not set
 * `data-hero-tone="light"`, so the navbar keeps its default transparent
 * treatment over it, which is what every other dark hero on the site does.
 *
 * The source document for the real careers page is in `Downloads/07-09`
 * (`RAMS_Digital_Careers.html`) when the roles exist.
 */
export default function CareersPage() {
  return <CareersComingSoon />;
}
