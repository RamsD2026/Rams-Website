import type { Metadata } from "next";
import { AivPage } from "@/components/sections/aiv/AivPage";
import "@/styles/hardware-base.css";

export const metadata: Metadata = {
  title: "RAMS AI Camera — Industrial vision. Human intelligence.",
  description:
    "The RAMS AI Camera sees people, machines and zones, understands what is happening, and acts on it while it is still happening — on forklifts, robotic cells, dock doors and hazard zones.",
};

/**
 * /hardware/ai-vision
 *
 * The first route in the `/hardware` namespace. The Hardware mega menu in
 * `lib/navigation.ts` points three entries here (AI Vision Pro, Ultra and Max,
 * all at this one href) and `lib/navigation-v2.ts` points its "AI Vision
 * Systems" family and featured card here. Every one of those was a 404 until
 * this page; sixteen sibling hardware slugs still are.
 *
 * ── Where the design came from ──────────────────────────────────────
 * This is a port of the AI Camera showcase build supplied as a static site
 * (`AI Camera Website - General/`: `index.html` + `site.css`, with its design
 * note under `docs/superpowers/specs/`). Its structure, copy, geometry and
 * motion are carried across as given. Two things are deliberately not:
 *
 *   · **Its nav and footer.** The page renders inside this site's `<Header>`
 *     and `<Footer>` from `app/layout.tsx`, so the reference's own 52px frosted
 *     bar and its ported footer are dropped. `--nav-h` follows `--header-total`
 *     instead, which is what keeps the pinned section and every
 *     `scroll-margin-top` clear of a header twice the height it was designed
 *     against.
 *   · **Its fonts.** The reference sets everything in Inter with JetBrains Mono
 *     for instrument text. This uses the site's own families — IBM Plex Sans,
 *     Roboto, Roboto Mono — per `docs/typography.md`. The two type scales are
 *     close enough that nothing else had to move: its
 *     `clamp(40px, 5.6vw, 80px)` section headline and this site's
 *     `40 / 60 / 78px` land within a couple of pixels of each other.
 *
 * ── The 3D ────────────────────────────────────────────────────────
 * Both WebGL pieces are ported. `AivFilm.tsx` is the scroll-driven film of the
 * camera GLB — four chapters across a 520vh track, ending with the housing
 * exploded. `AivEnvScene.tsx` is the second canvas, four procedural dioramas
 * behind the environments tabs. Both import three dynamically inside an effect,
 * and both fall back to the reference's own designed static treatment when
 * WebGL2 is missing or the GLB fails — a designed state rather than a degraded
 * one. See the notes in each file.
 *
 * Thirteen of the reference's fifteen images were never generated; those frames
 * render as labelled placeholders carrying the file name that belongs there.
 * `aiv-data.ts` is where a real file gets named once it exists.
 *
 * ── Content ────────────────────────────────────────────────────────
 * The copy is reconciled against `RAMS_Digital_Hardware_Website_Rewritten_Copy.md`
 * §2. That deck states no performance figure anywhere, so the showcase build's
 * hard claims — 26 TOPS, < 0.5 s frame to alert, 100% on-device — are gone
 * page-wide in favour of capability language. The reasoning, and the rule for
 * putting a figure back, is in the `aiv-data.ts` header.
 *
 * ── Still open ──────────────────────────────────────────────────────
 * "AI Vision" is also linked as `/platform/ai-vision` (`EcosystemSection`,
 * `ChallengeProblemGrid`) and `/solutions/ai-vision` (`SolutionsGrid`). Both
 * remain 404s. If this route is canonical they want redirects in
 * `next.config.ts`, beside the `/industries/*` block that exists for exactly
 * this reason.
 */
export default function AiVisionPage() {
  return <AivPage />;
}
