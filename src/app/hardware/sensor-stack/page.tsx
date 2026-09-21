import type { Metadata } from "next";
import { SstPage } from "@/components/sections/sst/SstPage";
import "@/styles/hardware-base.css";
import "@/styles/hardware-omni.css";
import "./sensor-stack.css";

export const metadata: Metadata = {
  title: "Sensor Stack — a forklift that knows itself | RAMS",
  description:
    "Access control, crash, speed and location monitoring, pallet detection and battery management. Six sensors on one truck, decided on the truck by Omnibox Motion.",
};

/**
 * /hardware/sensor-stack
 *
 * The fourth route in the `/hardware` namespace, and the one that ties the other
 * three together: the sensors here run on `/hardware/omnibox`'s Motion box, use
 * the same LiDAR positioning `/hardware/rtls` sells, and sit beside
 * `/hardware/ai-vision` in the same Digital Twin.
 *
 * ── Where the design came from ──────────────────────────────────────
 * A port of the Sensor Stack showcase build supplied as a static site
 * (`Sensor Stack Website/`: `index.html` + `site.css` + `sensors.css` +
 * `models/rams-forklift-model.js`, with its design note under
 * `docs/superpowers/specs/`). Structure, copy, geometry and motion are carried
 * across as given, with the same three adaptations as the other hardware pages:
 * the site's `<Header>`/`<Footer>` replace the reference's own (so `--nav-h`
 * follows `--header-total`), the type is IBM Plex Sans / Roboto per
 * `docs/typography.md` with every ceiling capped, and the palette is bound to
 * the brand tokens in `globals.css`.
 *
 * Its `sensors.css` is, in the reference's own words, "omnibox.css minus the
 * builder, plus this page's components" — so the shared part now lives in
 * `styles/hardware-omni.css`, imported by this route and the Omnibox one, and
 * `sensor-stack.css` adds only this page's own. See that file's head.
 *
 * ── What is built ───────────────────────────────────────────────────
 * Everything the reference has, including all three WebGL scenes, which share
 * one kit in `sst-3d.ts`:
 *
 *   · the **hero film** — the real forklift with all five devices mounted where
 *     the model's own named parts put them, haloed and tagged, then a LiDAR
 *     point-cloud chapter on a near-black ground;
 *   · the **LiDAR showcase** — one point-cloud warehouse and one truck on a
 *     loop, read three ways: its position and trail, its speed against per-zone
 *     limits, and a drift into a rack upright that sends a red shockwave through
 *     the points and lands in the event log;
 *   · the **hardware viewer** — the same five devices alone, drag to turn, with
 *     labels laid out rather than merely projected.
 *
 * Plus the three that are not WebGL: the interactive Access Control faceplate
 * (RFID, fingerprint, PIN — and the denial path), the pallet-detection side
 * view, and the battery chip.
 *
 * ── The forklift ────────────────────────────────────────────────────
 * The reference shipped `Better_forklift.glb` as 3.2 MB of base64 inside a
 * classic `<script>`, because it had to run from `file://`. Here it is decoded
 * to `public/sensor-stack/rams-forklift.glb` (2.32 MB) and loaded with
 * GLTFLoader, once, shared by both scenes that use it — the same treatment
 * `/hardware/ai-vision` gives its camera.
 *
 * ── What may not be said ────────────────────────────────────────────
 * Most of this page was written from two supplied product manuals, and its spec
 * is explicit about what must never reach it: no Wi-Fi names, passwords, IP
 * addresses or admin logins, no partner branding or screenshots, and no figures
 * for crash thresholds, speed values, battery readings or LiDAR range. The
 * constraint is restated where it bites, at the head of `sst-data.ts`.
 *
 * ── Still open ──────────────────────────────────────────────────────
 * Nothing in `lib/navigation.ts` or `navigation-v2.ts` points here yet. The
 * Hardware menu's sensor entries want auditing against this page, and the
 * sixteen other never-built hardware slugs still want redirects in
 * `next.config.ts`.
 */
export default function SensorStackPage() {
  return <SstPage />;
}
