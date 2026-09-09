"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { EASE } from "@/components/sections/rackiq/rackiq-shared";

/**
 * The light hero's ground and its floating tiles.
 *
 * Both were written for `/resources/case-studies` and both are wanted again,
 * unchanged, by `/resources/videos`. They live here for the same reason
 * `ClientStrip` moved out of the About page: two heroes rendering the same
 * four gradients from two files is two places to edit and one place to get
 * them out of step.
 *
 * Nothing here is page-specific. The tiles take their glyphs and hues from
 * the caller; the geometry is shared because it is the *heading* the tiles
 * are placed against, and both heroes set that heading at the same size.
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
 * hero's last row sits — a client strip on one page, a framed player on the
 * other — and the wash meeting that row is what stops it reading as a card
 * dropped onto a gradient.
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

/* ── the tiles ───────────────────────────────────────────────────── */

export type HeroTile = { icon: LucideIcon; tint: string };

/**
 * Where the six tiles sit: offset from the container's centre line, and from
 * its top, in px.
 *
 * They are placed at `calc(50% + Npx)` rather than at a percentage of the
 * container. The heading is centred and its type is a fixed size, so a fixed
 * offset from the centre is a fixed gap from the words; a percentage offset
 * would close that gap as the window narrowed and eventually sit a tile on
 * the heading itself.
 *
 * `hidden xl:block` below is what makes that arithmetic safe. `rams-container`
 * caps at 1280, so from the `xl` breakpoint upward the container is exactly
 * 1280 wide and this is one fixed drawing: the heading's second line runs to
 * about 366 either side of centre, the tiles sit between 445 and 560, and the
 * outermost clears the viewport edge by 50. Below `xl` the container is
 * narrower than these numbers assume and the layer is not rendered at all.
 *
 * `y` is measured from the container's own top, which is the section top, so
 * the values track `pt-60` (240) plus the pill, the 32px gap and two 96px
 * lines at 1.06. A hero using these must set that padding and that heading
 * size, or move the numbers with it — that is the cost of positioning against
 * a layout rather than inside it.
 */
const SLOTS: { x: number; y: number }[] = [
  { x: -560, y: 290 },
  { x: -452, y: 428 },
  { x: -532, y: 566 },
  { x: 552, y: 298 },
  { x: 445, y: 436 },
  { x: 525, y: 572 },
];

/**
 * Six white rounded squares flanking the heading, each holding one coloured
 * glyph, drifting a few pixels.
 *
 * The reference this came from fills them with the marks of the products it
 * integrates. We cannot: those are somebody's trademarks, and the same rule
 * that keeps generated photography free of signage keeps invented marks out
 * of a hero. So each page passes the six things its own content is *about*,
 * in `PartnersFlow`'s ten-hue palette — written down rather than picked at
 * random, because the server and the client render this markup independently
 * and a `Math.random` here would hand them different palettes.
 *
 * There is nothing to read, so the layer is `aria-hidden`. Pass exactly six;
 * anything past the sixth has no slot and is dropped.
 */
export function HeroTiles({ tiles }: { tiles: HeroTile[] }) {
  const reduce = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none hidden xl:block">
      {SLOTS.map((slot, i) => {
        const tile = tiles[i];
        if (!tile) return null;
        const Icon = tile.icon;

        return (
          <motion.div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `calc(50% + ${slot.x}px)`, top: slot.y }}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={
              reduce
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 1, scale: 1, y: [0, -7, 0] }
            }
            transition={{
              opacity: { duration: 0.6, delay: 0.45 + i * 0.09, ease: EASE },
              scale: { duration: 0.6, delay: 0.45 + i * 0.09, ease: EASE },
              y: {
                duration: 5 + (i % 3) * 0.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              },
            }}
          >
            <span
              className="flex items-center justify-center bg-white"
              style={{
                width: 60,
                height: 60,
                borderRadius: 18,
                border: "1px solid #E8E8ED",
                boxShadow: "0 16px 34px -16px rgba(0,0,0,0.28)",
              }}
            >
              <Icon
                className="w-[24px] h-[24px]"
                style={{ color: tile.tint }}
                strokeWidth={1.8}
              />
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
