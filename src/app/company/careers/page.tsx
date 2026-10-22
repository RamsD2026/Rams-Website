import type { Metadata } from "next";
import { CareersIntro } from "@/components/sections/careers/CareersIntro";
import { CareersClose } from "@/components/sections/careers/CareersSections";

export const metadata: Metadata = {
  title: "Careers | RAMS Digital",
  description:
    "Build technology that changes what happens on the ground. See open roles at RAMS Digital and share your profile with the team.",
};

/**
 * /company/careers.
 *
 * Built from RAMS's `RAMS_Digital_Careers.html` (Downloads/07-09), in the
 * section order of DXC's careers page: a hero with a search, career areas to
 * explore, a talent-network band, about-the-company content, how hiring
 * works, an FAQ and a close. It replaces the `CareersComingSoon` holding
 * page, which is kept for reuse.
 *
 * There are no job listings. The source lists career areas, not vacancies,
 * and says so; the page keeps that note and sends every application to
 * connect@rams.digital. See `careers-data` before adding anything that looks
 * like an opening.
 *
 * The hero is dark and does not set `data-hero-tone="light"`, so the navbar
 * keeps its transparent treatment over it like every other dark hero.
 */
export default function CareersPage() {
  return (
    <>
      {/* Trimmed at the owner's request (2026-10-22): hero, open roles and
          the Join close. The full page is commit 662f6c0. */}
      <CareersIntro />
      <CareersClose />
    </>
  );
}
