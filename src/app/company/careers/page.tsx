import type { Metadata } from "next";
import { CareersIntro } from "@/components/sections/careers/CareersIntro";
import {
  CareersBuild,
  CareersClose,
  CareersFAQ,
  CareersHiring,
  CareersHowWeWork,
  CareersTalent,
  CareersTeams,
  CareersWhy,
} from "@/components/sections/careers/CareersSections";

export const metadata: Metadata = {
  title: "Careers | RAMS Digital",
  description:
    "Build technology that changes what happens on the ground. Explore career areas at RAMS Digital and share your profile with the team.",
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
      <CareersIntro />
      <CareersTalent />
      <CareersWhy />
      <CareersTeams />
      <CareersBuild />
      <CareersHowWeWork />
      <CareersHiring />
      <CareersFAQ />
      <CareersClose />
    </>
  );
}
