import type { Metadata } from "next";
import {
  IndustriesCTA,
  IndustriesEngage,
  IndustriesGap,
  IndustrySections,
  IndustriesHero,
  IndustriesLayer,
  IndustriesReality,
} from "@/components/sections/industries/Industries";

export const metadata: Metadata = {
  title: "Industries We Serve | RAMS Digital",
  description:
    "Warehousing, 3PL, e-commerce, cold storage, manufacturing, automotive, FMCG, food & beverage and pharmaceuticals — the warehouse problem and the RAMS response for each.",
};

/**
 * /industries — all nine, on one page.
 *
 *   01 Hero      light     the claim, three facts, and the client strip
 *   02 Gap       white     why a warehouse is never generic, in four columns
 *   04 Nine      alternating  one full-width section per industry
 *   04 Layer     white     the five-tier stack, and the four lenses
 *   05 Engage    offWhite  four steps from discovery to adoption
 *   06 Reality   white     four things the design is built around
 *      Close     dark      the site's unified close
 *
 * Surfaces alternate and every section uses `SectionHeader` at `compact`.
 *
 * ── Nine cards, not nine pages ──────────────────────────────────────
 * `navigation-v2.ts` lists five industries as their own routes —
 * `/industries/retail`, `/industries/automotive`, `/industries/3pl-logistics`
 * and others — and not one of them is built. The footer links four more.
 *
 * This is the page the source itself is, and it carries all nine. The
 * source's own "Explore …" link at the foot of each card pointed at those
 * unbuilt routes; it is dropped rather than redirected somewhere plausible,
 * because a card that already states the problem, the response and the stack
 * has said what it has to say, and a link to a 404 is worse than no link.
 *
 * If those per-industry pages are ever built, each card gains an `href` and
 * the link comes back — the data already carries a stable `id` per industry.
 *
 * ── It is a top-level section, so it uses the Company ground ────────
 * `AboutHero`'s: the solutions radial inverted between white and offWhite,
 * the orange glow at 0.10, a 46/72/92 heading in one colour, pt-40/48/56.
 * Not `LightHeroGround` and the orbiting tiles — that is the five
 * `/resources` index pages' signature and it belongs to them.
 *
 * ── The scope line is the source's, and it sits above the grid ──────
 * "Examples show typical use cases. Final capabilities depend on the agreed
 * audit, hardware, integration and application scope."
 *
 * Every one of the nine cards describes what RAMS *can* do in a sector, which
 * on an industries page reads as what it *will* do for the reader's own site.
 * So the caveat is placed where it is read before the cards rather than after
 * them, and the copy keeps the source's hedges throughout — "supported",
 * "approved", "typical" — rather than being tightened into commitments the
 * document did not make.
 *
 * There is no figure anywhere on this page that was not in the source, and
 * the three in the hero are counts of what the page itself contains.
 */
export default function IndustriesPage() {
  return (
    <>
      <IndustriesHero />
      <IndustriesGap />
      <IndustrySections />
      <IndustriesLayer />
      <IndustriesEngage />
      <IndustriesReality />
      <IndustriesCTA />
    </>
  );
}
