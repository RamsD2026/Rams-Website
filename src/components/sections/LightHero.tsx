"use client";

import type { LucideIcon } from "lucide-react";

/**
 * The light hero's ground and its orbiting tiles.
 *
 * Both were written for `/resources/case-studies` and both are wanted again,
 * unchanged, by the videos, newsroom, webinars and downloads heroes. They
 * live here for the same reason `ClientStrip` moved out of the About page:
 * five heroes rendering the same four gradients from five files is five
 * places to edit and four places to get them out of step.
 *
 * Nothing here is page-specific. The tiles take their glyphs and hues from
 * the caller; the geometry is shared because it is the *heading* the tiles
 * are placed around, and every one of those heroes sets that heading at the
 * same size.
 */

/* ── the ground ──────────────────────────────────────────────────── */

/**
 * Four washes bleeding in from the corners, and hairline rings out of the
 * bottom two.
 *
 * Not one radial anchored at the top, which is what the dark solution heroes
 * do. The centre is left clean white, which is what makes the type sit on
 * nothing and the colour read as light entering the frame rather than as a
 * panel behind it. The bottom two carry most of it because that is where the
 * hero's last row sits — the client strip — and the wash meeting that row is
 * what stops it reading as a card dropped onto a gradient.
 *
 * The rings are at 0.14 against the wash's 0.34, and each is masked by a
 * radial matching its own wash so they exist only where there is colour to
 * carry them and never cross the clean middle. A ring at the wash's own alpha
 * is a drawn line, and forty of those would be a target rather than a
 * texture.
 *
 * The section that renders this needs `position: relative` and
 * `overflow-hidden`, and `#FFFFFF` under it: these layers are `inset-0` and
 * add colour to whatever ground they are given.
 */
export function LightHeroGround() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(66% 64% at 0% 100%, rgba(255,106,0,0.34) 0%, rgba(255,106,0,0.12) 38%, transparent 70%)," +
            "radial-gradient(62% 60% at 100% 100%, rgba(255,106,0,0.28) 0%, rgba(255,106,0,0.09) 38%, transparent 68%)," +
            "radial-gradient(52% 50% at 100% 0%, rgba(255,106,0,0.16) 0%, transparent 62%)," +
            "radial-gradient(46% 44% at 0% 0%, rgba(255,106,0,0.10) 0%, transparent 60%)",
        }}
      />

      {[
        ["0% 100%", "66% 64% at 0% 100%"],
        ["100% 100%", "62% 60% at 100% 100%"],
      ].map(([at, mask]) => (
        <div
          key={at}
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `repeating-radial-gradient(circle at ${at}, rgba(255,106,0,0.14) 0 1px, transparent 1px 22px)`,
            maskImage: `radial-gradient(${mask}, black 0%, black 25%, transparent 72%)`,
            WebkitMaskImage: `radial-gradient(${mask}, black 0%, black 25%, transparent 72%)`,
          }}
        />
      ))}
    </>
  );
}

/* ── the orbit ───────────────────────────────────────────────────── */

export type HeroTile = { icon: LucideIcon; tint: string };

/**
 * Two concentric rings behind the heading, cut off by the top of the section,
 * with ten tiles riding them anticlockwise at three different sizes.
 *
 * It was six tiles pinned to fixed coordinates — three down each side, each
 * bobbing a few pixels in place. That was a static arrangement wearing an
 * animation, and it depended on a heading wrapping to exactly two lines of a
 * known width. This moves, and nothing in it is measured against a word.
 *
 * ── The geometry, and why these numbers ─────────────────────────────
 * Both rings are centred at 50% across and `CY` down from the section's top,
 * which puts the centre inside the heading. So the top of each ring sits
 * above the section's own top edge and is clipped by its `overflow-hidden` —
 * the cut this arrangement is built on. What shows is the wide left and right
 * sweep either side of the type.
 *
 * The radii are a constraint rather than a taste. The widest thing in the
 * middle column is the subline at ±440 and the largest tile is 64 across, so
 * a ring under 440 + 32 would pass a tile straight through the copy at its
 * own centre height. `R_IN` is 520: at its tightest point against the subline
 * (y ≈ 580, where the ring is at x ≈ 471) it still clears. `R_OUT` is 650,
 * which is the container's own half-width at `xl`.
 *
 * ── The bottom is masked, not shortened ─────────────────────────────
 * A 520 ring centred at 360 reaches y = 880, which is where the client strip
 * is. Shrinking the rings to clear it would push them back into the subline,
 * so the whole layer fades out below 52% of the hero instead. Tiles descend,
 * dissolve, and come back round the top.
 *
 * ── Anticlockwise, and upright ──────────────────────────────────────
 * The orbit wrapper rotates to -360deg and the tile inside counter-rotates to
 * +360deg over the same duration with the same delay, so a tile travels the
 * circle without ever tipping. Miss the counter-rotation and the icons roll
 * along like wheels.
 *
 * Each tile's start angle is a negative `animation-delay` into one shared
 * loop rather than an initial `rotate`, so there is no per-tile transform to
 * keep in sync with the animation.
 *
 * Both keyframes are namespaced `lh-`, because `@keyframes` is global and
 * this site has been caught by that before.
 *
 * ── Below `xl`, and under reduced motion ────────────────────────────
 * Not rendered below `xl`: the outer ring is 1300 across, and on a narrower
 * viewport the two arcs cut through the copy rather than framing it.
 *
 * `prefers-reduced-motion` pauses the rotation where it stands rather than
 * hiding the tiles — the arrangement is still the arrangement, it just holds
 * still.
 */

/** Ring centre, measured down from the section's top edge. */
const CY = 360;
const R_IN = 520;
const R_OUT = 650;

/** Seconds for one full turn. Different per ring so the two never lock. */
const T_IN = 52;
const T_OUT = 74;

/**
 * A slot per tile: which ring, the start angle in degrees, and the size.
 *
 * Ten of them at 44, 54 and 64. The sizes are written down rather than
 * derived so the large ones are spread around the circle instead of arriving
 * together, and the two rings alternate down the list so a caller's first few
 * glyphs are not all on one path.
 */
const SLOTS: { ring: "in" | "out"; at: number; size: number }[] = [
  { ring: "out", at: 8, size: 64 },
  { ring: "in", at: 46, size: 44 },
  { ring: "out", at: 88, size: 54 },
  { ring: "in", at: 132, size: 64 },
  { ring: "out", at: 168, size: 44 },
  { ring: "in", at: 214, size: 54 },
  { ring: "out", at: 246, size: 64 },
  { ring: "in", at: 292, size: 44 },
  { ring: "out", at: 318, size: 54 },
  { ring: "in", at: 344, size: 64 },
];

const CSS = `
  @keyframes lh-orbit { to { transform: rotate(-360deg); } }
  @keyframes lh-anti  { to { transform: rotate(360deg); } }
  .lh-ring {
    position: absolute; left: 50%; border-radius: 999px;
    border: 1px solid rgba(255,106,0,0.12);
  }
  .lh-orbit {
    position: absolute; left: 50%; border-radius: 999px;
    animation: lh-orbit linear infinite;
  }
  .lh-anti { display: flex; animation: lh-anti linear infinite; }
  @media (prefers-reduced-motion: reduce) {
    .lh-orbit, .lh-anti { animation-play-state: paused; }
  }
`;

/**
 * Each page passes the ten things its own content is about, in
 * `PartnersFlow`'s ten-hue palette.
 *
 * The reference this came from fills the tiles with the marks of the products
 * it integrates. We cannot: those are somebody's trademarks, and the same
 * rule that keeps generated photography free of signage keeps invented marks
 * out of a hero. The hues are written down rather than picked at random,
 * because the server and the client render this markup independently and a
 * `Math.random` here would hand them different palettes.
 *
 * There is nothing to read, so the layer is `aria-hidden`. Pass ten; a
 * shorter list leaves the later slots empty rather than repeating a glyph.
 */
export function HeroTiles({ tiles }: { tiles: HeroTile[] }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden xl:block overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to bottom, #000 0%, #000 52%, transparent 76%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, #000 0%, #000 52%, transparent 76%)",
      }}
    >
      <style>{CSS}</style>

      {[R_IN, R_OUT].map((r) => (
        <span
          key={r}
          className="lh-ring"
          style={{ width: r * 2, height: r * 2, marginLeft: -r, top: CY - r }}
        />
      ))}

      {SLOTS.map((slot, i) => {
        const tile = tiles[i];
        if (!tile) return null;

        const Icon = tile.icon;
        const r = slot.ring === "in" ? R_IN : R_OUT;
        const dur = slot.ring === "in" ? T_IN : T_OUT;
        /* The start angle, as a negative delay into one shared loop. */
        const delay = `-${((slot.at / 360) * dur).toFixed(2)}s`;

        return (
          <span
            key={i}
            className="lh-orbit"
            style={{
              width: r * 2,
              height: r * 2,
              marginLeft: -r,
              top: CY - r,
              animationDuration: `${dur}s`,
              animationDelay: delay,
            }}
          >
            <span
              className="absolute left-1/2 top-0"
              style={{ transform: "translate(-50%, -50%)" }}
            >
              <span
                className="lh-anti items-center justify-center bg-white"
                style={{
                  width: slot.size,
                  height: slot.size,
                  borderRadius: Math.round(slot.size * 0.3),
                  border: "1px solid #E8E8ED",
                  boxShadow: "0 16px 34px -16px rgba(0,0,0,0.28)",
                  animationDuration: `${dur}s`,
                  animationDelay: delay,
                }}
              >
                <Icon
                  style={{
                    color: tile.tint,
                    width: Math.round(slot.size * 0.4),
                    height: Math.round(slot.size * 0.4),
                  }}
                  strokeWidth={1.8}
                />
              </span>
            </span>
          </span>
        );
      })}
    </div>
  );
}
