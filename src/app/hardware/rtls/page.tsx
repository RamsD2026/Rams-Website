import type { Metadata } from "next";
import { LocPage } from "@/components/sections/loc/LocPage";
import "@/styles/hardware-base.css";
import "./rtls.css";

export const metadata: Metadata = {
  title: "Location Intelligence — know where everything is, indoors | RAMS",
  description:
    "LiDAR, UWB, Bluetooth and Wi-Fi positioning for warehouses and plants. See what each level of accuracy buys you, and start with one aisle.",
};

/**
 * /hardware/rtls
 *
 * The third route in the `/hardware` namespace, and the last of the four
 * Location Intelligence entries in the Hardware mega menu — `lib/navigation.ts`
 * sends LiDAR, Wi-Fi, Bluetooth and UWB to this one href, and
 * `lib/navigation-v2.ts` gives it an "RTLS" family card. All five were 404s
 * until this page.
 *
 * ── Where the design came from ──────────────────────────────────────
 * A port of the Location Intelligence showcase build supplied as a static site
 * (`Location Intelligence/`: `index.html` + `site.css` + `loc.css` + `stack.js`,
 * with its design note under `docs/superpowers/specs/`). Structure, copy,
 * geometry and motion are carried across as given, with the same three
 * adaptations as `/hardware/ai-vision` and `/hardware/omnibox`:
 *
 *   · **Its nav and footer are dropped** for this site's `<Header>` and
 *     `<Footer>`, so `--nav-h` follows `--header-total`. The reference's own
 *     52px bar, its six-link section nav and its ported footer all go; the
 *     anchors they pointed at (`#accuracy`, `#tech`, `#stack`, `#jobs`,
 *     `#pilot`, `#faq`, `#contact`) are kept, because the page links to them
 *     from inside itself.
 *   · **Its fonts are replaced** by IBM Plex Sans / Roboto per
 *     `docs/typography.md`, with every type ceiling capped at this site's
 *     documented maximum — see the head of `rtls.css` for the six that moved.
 *   · **Its palette is bound to the brand tokens** in `globals.css`, except the
 *     three technology identity colours, which the brand set has no equivalent
 *     for. That call is argued at the head of `loc-data.ts`.
 *
 * Its `site.css` is the same stylesheet as the other two hardware pages', so
 * `styles/hardware-base.css` covers it and `rtls.css` adds only this page's own
 * components.
 *
 * ── What is built ───────────────────────────────────────────────────
 * Everything the reference has, including both canvases — the hero floor plan
 * cycling the four technologies, and the accuracy sandbox where the reader
 * drags the truck around 48 × 28 m of warehouse and watches the circle. They
 * are one renderer, `LocPlan.tsx`, drawn in metres so the circle is honestly the
 * size that accuracy would be on a real floor. Plain 2D canvas: no WebGL, no
 * CDN, works offline and on a phone, and honours `prefers-reduced-motion`.
 *
 * The stack quiz is here too, with its `?find=&prec=&act=` round trip to
 * `/hardware/omnibox`. The far half of that trip — the reference's `.li-stack`
 * block, which renders the recommended sensor stack *inside* the Omnibox on
 * that page — is still not ported; see the note at the head of `omnibox.css`.
 * The link works regardless: the hash opens the recommended model's sheet.
 *
 * ── Still open ──────────────────────────────────────────────────────
 * `next.config.ts` has no redirects for the sixteen other hardware slugs the
 * nav still points at. This page claims four of them by sharing one href; the
 * rest remain 404s.
 */
export default function RtlsPage() {
  return <LocPage />;
}
