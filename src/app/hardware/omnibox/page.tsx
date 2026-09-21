import type { Metadata } from "next";
import { OmniPage } from "@/components/sections/omni/OmniPage";
import "@/styles/hardware-base.css";
import "@/styles/hardware-omni.css";
import "./omnibox.css";

export const metadata: Metadata = {
  title: "Omnibox — The on-site brain for your floor | RAMS",
  description:
    "Omnibox turns what cameras and sensors notice into action, on site and without a network. Four models — Edge, AI, Motion and Core — one physical intelligence layer.",
};

/**
 * /hardware/omnibox
 *
 * The second route in the `/hardware` namespace. `lib/navigation.ts` sends four
 * Hardware entries here (OmniBox Edge, AI, Motion and Core all share this one
 * href) and `lib/navigation-v2.ts` gives it an "OmniBox Platform" family.
 * `/hardware/omnibox-edge`, `-ai`, `-motion` and `-core` are separate slugs and
 * still 404 — this page covers all four models, so those want redirects here.
 *
 * ── Where the design came from ──────────────────────────────────────
 * A port of the Omnibox showcase build supplied as a static site
 * (`Omnibox Website/`: `index.html` + `site.css` + `omnibox.css`, with its
 * design note under `docs/superpowers/specs/`). Structure, copy, geometry and
 * motion are carried across as given, with the same three adaptations as
 * `/hardware/ai-vision`:
 *
 *   · **Its nav and footer are dropped** for this site's `<Header>` and
 *     `<Footer>`, so `--nav-h` follows `--header-total`.
 *   · **Its fonts are replaced** by IBM Plex Sans / Roboto per
 *     `docs/typography.md`, with every type ceiling capped at this site's
 *     documented maximum.
 *   · **Its palette is bound to the brand tokens** in `globals.css`.
 *
 * Its `site.css` is byte-identical to the AI Camera site's, so the shared
 * `styles/hardware-base.css` covers it. Its own `omnibox.css` has since been
 * split: everything /hardware/sensor-stack also uses lives in
 * `styles/hardware-omni.css`, and what is left here is the film's scroll length
 * and the setup builder. See that file's head.
 *
 * ── What is built ───────────────────────────────────────────────────
 * Everything the reference has, including both WebGL canvases: the hero film
 * (four boxes in a lineup that explode together and reassemble) and the Inside
 * viewer (one box at a time, drag to turn, take apart with plain-language part
 * labels, or switch to the devices it connects to with animated cables). The
 * boxes are procedural stand-ins — the reference ships no GLBs, only a
 * `models/README.md` describing how a real one would drop in.
 *
 * Not ported: the `.li-stack` block, which renders a Location Intelligence
 * sensor stack inside its Omnibox and is driven by `stack.js` from a sibling
 * reference site. That site has no route here yet.
 */
export default function OmniboxPage() {
  return <OmniPage />;
}
