import type { Metadata } from "next";
import { GiPage } from "@/components/sections/gi/GiPage";
import "@/styles/hardware-base.css";
import "@/styles/hardware-omni.css";
import "./inspection.css";

export const metadata: Metadata = {
  title: "Guided Inspection — AirScan and FloorScan | RAMS",
  description:
    "Two machines that inspect what nobody checks: AirScan flies the rack face and reads every bay at every level, FloorScan drives the floor and looks down through the slab for voids and settlement.",
};

/**
 * /hardware/inspection
 *
 * The fifth route in the `/hardware` namespace, and the one the nav has been
 * pointing at for some time without it existing: `lib/navigation-v2.ts` sends
 * its "Guided Inspection Systems" family here, and `lib/navigation.ts` now sends
 * its AirScan and Floor Scan entries here too (they were `href: "#"`).
 * `/hardware/airscan`, `/hardware/floorscan` and `/solutions/guided-inspection`
 * are redirects to this page in `next.config.ts` rather than routes of their
 * own — the house pattern for slugs the nav spells several ways.
 *
 * ── Where the design came from ──────────────────────────────────────
 * A port of the Guided Inspection showcase build supplied as a static site
 * (`Guided Inspection Website/`: `index.html` + `site.css` + `inspect.css`, with
 * its design notes under `docs/superpowers/specs/`). Structure, copy, geometry
 * and motion are carried across as given, with the same three adaptations as the
 * other hardware pages: the site's `<Header>`/`<Footer>` replace the reference's
 * own (so `--nav-h` follows `--header-total`), the type is IBM Plex Sans /
 * Roboto per `docs/typography.md` with every ceiling capped, and the palette is
 * bound to the brand tokens in `globals.css`.
 *
 * Its `inspect.css` is the OmniBox stylesheet plus this page's own components,
 * so the shared part comes from `styles/hardware-omni.css` — including the
 * chooser shell, which moved there from `omnibox.css` when this page turned out
 * to use it. `inspection.css` adds only what is this page's alone.
 *
 * ── What is built ───────────────────────────────────────────────────
 * Everything the reference has, both WebGL scenes included, sharing one kit in
 * `gi-3d.ts`:
 *
 *   · the **hero film** — both machines, then a ghost rack behind AirScan as it
 *     climbs and a see-through slab under FloorScan with its reinforcement, a
 *     void and a radar cone, then both taken apart;
 *   · the **Inside viewer** — either machine on a turntable, taken apart with
 *     labelled parts, or at work: AirScan up a full rack reading labels and
 *     flagging damage, FloorScan across a cut-away slab reading reinforcement
 *     and flagging a cable, a crack and a void.
 *
 * Plus the two-question chooser, the compare table, the stage rails and the
 * design-partner ask.
 *
 * ── Both machines are concepts ──────────────────────────────────────
 * That is the page's governing constraint and it shapes the markup, not just the
 * copy: a stage badge on every mention driven by one `STAGE` record, stage
 * rails in two places, "What we're building" where a spec table would be, and no
 * measurement figure anywhere on the page. The rules are restated in full at the
 * head of `gi-data.ts`. If a machine moves on, `STAGE` is the single edit.
 *
 * ── What is not built ───────────────────────────────────────────────
 * The reference ships no GLBs — both machines are drawn procedurally as concept
 * stand-ins, and its `models/README.md` describes how a real model would drop in
 * and replace them. That loader is not ported; see the head of `gi-3d.ts` for
 * where it goes when there is a model to load.
 *
 * Seven scene photographs (`where-*.jpg`) were never generated. Those tiles
 * render the reference's own labelled placeholders carrying the file name that
 * belongs there, exactly as `/hardware/ai-vision` does. Its spec adds one rule
 * for whoever supplies them: **no drones or robots in the photographs**, so
 * nothing implies the machines already exist.
 */
export default function InspectionPage() {
  return <GiPage />;
}
