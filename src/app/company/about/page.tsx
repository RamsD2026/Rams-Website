import type { Metadata } from "next";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { AboutWhy } from "@/components/sections/about/AboutWhy";
import { AboutStory } from "@/components/sections/about/AboutStory";
import { AboutBuilt } from "@/components/sections/about/AboutBuilt";
import { AboutDifferent } from "@/components/sections/about/AboutDifferent";
import { AboutHow } from "@/components/sections/about/AboutHow";
import { AboutPlatform } from "@/components/sections/about/AboutPlatform";
import { AboutThink } from "@/components/sections/about/AboutThink";
import { AboutTeam } from "@/components/sections/about/AboutTeam";
import { AboutWhere } from "@/components/sections/about/AboutWhere";
import { AboutCustomers } from "@/components/sections/about/AboutCustomers";
import { AboutWork } from "@/components/sections/about/AboutWork";
import { AboutReach } from "@/components/sections/about/AboutReach";
import { AboutCTA } from "@/components/sections/about/AboutCTA";

export const metadata: Metadata = {
  title: "About RAMS Digital — We make the warehouse see itself | RAMS",
  description:
    "RAMS Digital brings engineering, field operations, Digital Twin technology, IoT, AI and workflow software together, so organisations can understand and improve what is actually happening inside warehouses, factories and other built environments.",
};

/**
 * /company/about — the company page.
 *
 *   01 Hero        white     the estate backdrop, three tiles, the client strip
 *   02 Why         offWhite  four symptoms of one problem, as cards
 *   03 Story       white     four stages, as picture cards
 *   04 What built  offWhite  the six layers, sticky-scrolled against a pane
 *   05 Different   white     four principles, ranged left, no box
 *   06 How        offWhite  six steps on one track, each with its own copy
 *   07 Platform   white     eight applications, as a linked index
 *   08 Think      offWhite  four principles, on the Industries track
 *   09 Team       white     four disciplines, on the flip grid
 *   10 Where      offWhite  eight environments, on a timed track
 *   11 Customers  white     the customer marks and eight reviews, on two lines
 *   12 Work       offWhite  two ways in, as two picture cards
 *   13 Reach      white     a dotted world map, the places pinned
 *   14 Close      dark      the site's unified close
 *
 * Surfaces alternate. Sections two, three and four all use `SectionHeader` at
 * `compact`, so the page matches the platform and solution pages rather than
 * the ranged-left document treatment it briefly had.
 *
 * No two sections repeat a layout, which matters on a page where almost every
 * section carries four or six items: two is the boxed four-up because its
 * items have no order, three is picture cards because it has photography and a
 * sequence, four is the sticky-scrolled capabilities frame because each layer
 * needs a screen beside it, five is bare columns because it is a statement of
 * principle rather than a list of things, and six is the timed rail because
 * its items only happen in order.
 *
 * Four and six are the two closest — both are the platform pages' patterns and
 * both carry six items — and the difference is the argument each makes. Four's
 * layers are all true at once and the reader drives the index by scrolling;
 * six's steps only happen in sequence, so a clock drives it.
 *
 * Eight is the fourth section on this page carrying four items, and the only
 * one the reader has to move. It is the home page's Industries carousel with
 * its own data — same card, same spring, same dot pill — running two up rather
 * than three, so the photograph is half again the size it is there. That is
 * what earns it a fourth set of four: a principle stated over a picture of the
 * thing it is about carries further than one in a box.
 *
 * Nine is the last of the four-item sections and the only one that hides half
 * its copy: the home page's flip card, whose front is a portrait and whose
 * back carries the line. It can afford to — the four names on the fronts are
 * the section's argument, and the sentences behind them are the detail.
 *
 * Ten is the third track on this page and the only one that moves on its own.
 * It can: eight one-word cards over five stops is more than a reader will page
 * through by hand, and there is nothing on a card worth stopping for. Eight
 * carries four photographs with a sentence each, so it waits to be asked.
 *
 * Eleven is the page's second name strip and deliberately not the first one
 * again: the hero's is four names under the photography, a proof strip the
 * reader passes; this is twelve at 21/25 with the reviews running beneath
 * them, in the section those names are the subject of. The two lists are
 * different claims — see `AboutCustomers` on what qualifies each. Its eight
 * reviews are placeholders — read the banner in that file before this page
 * goes to production.
 *
 * Twelve is the only section with fewer than four items, and the only one that
 * asks for something: everything above it is a set the reader scans, and this
 * is a choice they make. Two cards at half the measure each is what a choice
 * looks like, and the buttons are weighted — filled for the operator,
 * outlined for the partner — rather than competing at the same weight.
 *
 * Thirteen is the page's last statement of fact before the close, and it is
 * set tight: a 2.75:1 map is only 448px tall on this measure, so the default
 * padding gave the band more air than the sections holding eight cards.
 *
 * Fourteen is the site's own close, not a new one: the same dark ground, glow,
 * eyebrow, two-line heading and buttons as the eight platform closes. A close
 * that looked different here would read as a different site.
 *
 * The rest of the source material — the founder's account, the mission, the
 * team, the platform index, contact and the close — was removed on request and
 * those components are deleted rather than left unimported. The copy is in the
 * two source documents under `Downloads/06-09` if any of it is wanted back.
 */
export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutWhy />
      <AboutStory />
      <AboutBuilt />
      <AboutDifferent />
      <AboutHow />
      <AboutPlatform />
      <AboutThink />
      <AboutTeam />
      <AboutWhere />
      <AboutCustomers />
      <AboutWork />
      <AboutReach />
      <AboutCTA />
    </>
  );
}
