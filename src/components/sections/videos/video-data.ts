/**
 * The video library.
 *
 * ── Everything here is a file that exists ───────────────────────────
 * Five clips, and every one of them is already shipping somewhere on this
 * site: the IRDS capture runs in sixteen hero and feature panels, the sensor
 * film is the IMDS hero, the OmniBox and camera turntables are the two
 * `TechnologySystems` product stages, and the 3D capture is `RiqLocation`.
 *
 * That is the whole editorial rule for this page. A video library is the one
 * page where an invented entry is not a placeholder but a broken promise —
 * a card that opens a player and plays nothing. So the catalogue is short and
 * true rather than padded out to fill a grid, and it grows when footage does.
 *
 * The three `Jira PT VP … Placeholder` files in `/public` are deliberately
 * not here. They are stand-ins the product pages fall back on, they are named
 * as such, and listing them as RAMS films would be the exact failure above.
 *
 * ── The posters are stills of the same subject ──────────────────────
 * There is no ffmpeg on this machine, so no frame could be pulled out of the
 * files themselves. Each poster is instead the still the site already uses
 * for that subject: the OmniBox and camera renders, the AI Sensor render, and
 * the Rack Health Analytics screen. They are 3:2 or close to it, which is why
 * the card box is 3:2 rather than 16:9 — at 16:9 every one of them would be
 * cropped or pillarboxed, and a letterboxed thumbnail grid reads as broken
 * artwork rather than as a design decision.
 *
 * ── The IRDS capture is in the list, not above it ───────────────────
 * It opened the page as a framed player in the hero for a while. The hero
 * carries no video now, so the clip sits at the head of the library instead
 * — losing it altogether would take the one recording of the actual software
 * off the page whose subject is the software.
 *
 * It also squares the grid: five films are 3 + 2 across three columns, where
 * four were 3 + 1 and left a card alone on its own row.
 *
 * ── `heavy` ─────────────────────────────────────────────────────────
 * `rack-3d-view.webm` is 60 MB — 122 seconds at 4.1 Mbps VP9. `RiqLocation`
 * already refuses to attach it until the section is near the viewport, and
 * this page goes further: no card attaches its source until the pointer is
 * over it, so a visitor who scrolls past downloads nothing but the posters.
 * The flag is what tells the player not to preload it either.
 */

export type Video = {
  id: string;
  /** The filter chip. Derived into `CATEGORIES` below, never typed twice. */
  kind: string;
  /** The mono eyebrow — what is on screen. */
  subject: string;
  title: string;
  body: string;
  src: string;
  poster: string;
  posterAlt: string;
  /** Large enough that nothing may request it without being asked. */
  heavy?: boolean;
};

export const VIDEOS: Video[] = [
  {
    id: "irds",
    kind: "Platform",
    subject: "IRDS",
    title: "Inspection, findings and rack health, in the product",
    body: "A walk through the live platform: an inspection raised on the floor, the findings it produces, and the rack health those findings move. The only clip here that is a recording rather than a render.",
    src: "/Product/irds/hero.mp4",
    poster: "/Product/irds/dashboard.webp",
    posterAlt:
      "The IRDS dashboard: rack health score, rack stability, open actions and the observation lifecycle",
  },
  {
    id: "omnibox",
    kind: "Hardware",
    subject: "RAMS OmniBox",
    title: "The edge unit that ties the floor together",
    body: "Cameras, sensors, gateways and machines terminate on one box at the rack. It runs the models on site, so the floor keeps working when the link does not.",
    src: "/Product/Omni box.mp4",
    poster: "/OmniBox.png",
    posterAlt:
      "A RAMS OmniBox mounted on a rack upright, linked to cameras, sensors and machines across a warehouse",
  },
  {
    id: "ai-vision",
    kind: "Hardware",
    subject: "AI Vision Camera",
    title: "What the camera sees in the aisle",
    body: "People, pallets and MHE tracked as objects rather than as pixels — the layer underneath impact detection, near-miss alerting and location intelligence.",
    src: "/Product/AI vision Camera.mp4",
    poster: "/AI Vision.png",
    posterAlt:
      "A RAMS AI Vision Camera on a rack upright, with people, pallets and a forklift picked out as tracked objects",
  },
  {
    id: "sensors",
    kind: "Hardware",
    subject: "AI Sensor",
    title: "Reading hours, cycles, faults and impacts",
    body: "The sensing layer that fits to the machine and the rack. It is where fleet health, utilisation and impact history come from — no manual log, no walk round.",
    src: "/Product/sensors.mp4",
    poster: "/Product/sensor.png",
    posterAlt: "A RAMS AI Sensor unit, product render on black",
  },
  {
    id: "rack-twin",
    kind: "Digital twin",
    subject: "Rack Health Analytics",
    title: "The estate as a live 3D model",
    body: "Every bay, beam and upright as an object with a condition against it. Severity is highlighted in place, so a finding is somewhere you can point at rather than a row in a report.",
    src: "/rack-3d-view.webm",
    poster: "/Product/irds/rack-health-3d.webp",
    posterAlt:
      "IRDS Rack Health Analytics: a 3D rack model with issues highlighted by severity",
    heavy: true,
  },
];

/**
 * The chips, walked out of the catalogue rather than typed beside it.
 *
 * Three today, and each earns its place: the platform capture, three hardware
 * films and one recording of the twin. Add a clip with a new kind and its chip
 * appears with it — which is the only way a filter bar cannot end up hiding
 * part of its own set.
 */
export const CATEGORIES: string[] = VIDEOS.reduce<string[]>(
  (out, v) => (out.includes(v.kind) ? out : [...out, v.kind]),
  [],
);
