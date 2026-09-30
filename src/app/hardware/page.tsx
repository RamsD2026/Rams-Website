import type { Metadata } from "next";
import { CareersComingSoon } from "@/components/sections/careers/CareersComingSoon";

export const metadata: Metadata = {
  title: "Hardware | RAMS Digital",
  description:
    "RAMS hardware — OmniBox, sensors, AI vision, LiDAR and indoor positioning. The hardware pages are in preparation.",
};

/**
 * /hardware — a holding page.
 *
 * The Hardware menu carries nineteen links and not one of those routes was
 * ever built, so every item in it 404ed. An honest holding page under the
 * menu is better than nineteen dead ends: the redirects in `next.config.ts`
 * send all of `/hardware/*` here until the real pages exist.
 *
 * Same treatment as Careers and IRTS, which are the site's other holding
 * pages.
 */
export default function HardwarePage() {
  return <CareersComingSoon eyebrow="Hardware — OmniBox, sensors and vision" />;
}
