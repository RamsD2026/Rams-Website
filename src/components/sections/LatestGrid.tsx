"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * "Latest" — a bento of three, directly under the hero.
 *
 * The same section on the case studies, the videos and the newsroom, from one
 * file. Three pages drawing one arrangement three ways is how a design system
 * stops being one, which is the reasoning `FilterBar` was pulled out on.
 *
 * ── Light tiles. There is no dark panel here ────────────────────────
 * Two revisions of this section were built on a near-black card: first with
 * the type scrimmed over the picture, then with the type on an ink block
 * under it. Both were wrong for the same reason. These pages are light — the
 * hero above is white with orange washes and the grid below is white cards on
 * the section's own ground — and a slab of #0E0E11 between them reads as a
 * hole punched in the page rather than as a card on it.
 *
 * So the tile is white on the offWhite section, with a hairline and no drop
 * shadow, and the picture is *inset* inside it on its own smaller radius rather
 * than bleeding to the tile's edge. The inset is what makes it a bento tile
 * and not a photograph with a caption: the white margin belongs to the tile,
 * so the picture reads as content the tile is holding.
 *
 * Dark now appears only where it is genuinely the artwork — a product render
 * shot on black is a dark picture, which is a different thing from a dark box
 * behind text.
 *
 * ── The bento ───────────────────────────────────────────────────────
 * Five columns, rows of 204. The lead takes `col-span-3 row-span-2`, so it
 * is 731 × 428 with its picture across the top and its type under it; the
 * two beside take `col-span-2` and stack at 481 × 204, running horizontally
 * — picture left, type right. Two shapes rather than one shape at two
 * sizes, which is the asymmetry.
 *
 * It was three columns, which made the pair 397 wide. After the tile's own
 * inset and the picture beside it that left about 200px for a headline, and
 * a title like "What Every Warehouse Should Know About Rack Inspections"
 * came out four lines deep — which then dragged the picture into a tall
 * portrait, because it stretches to the tile. Five columns and a 3/2 split
 * give the same headline about 290px and two lines, and the picture settles
 * back to landscape on its own.
 *
 * ── The two spans are one decision ──────────────────────────────────
 * `col-span-3` on the lead and `col-span-2` on each of the pair have to
 * add up to the five columns, and they were changed one at a time once:
 * the lead went to 3 and the pair kept the implicit 1 each, so instead of
 * stacking in the remaining two columns they sat side by side at 230 wide
 * with a headline one word per line. Change either number and change the
 * other in the same edit.
 *
 * ── The lead's picture takes what the type leaves ───────────────────
 * `lg:flex-1` on the picture and `lg:flex-none` on the type, rather than a
 * fixed picture height. The tile is a fixed 428 at `lg`, so a hard-coded
 * picture height has to be re-derived from the row height and the type's
 * own depth every time either moves — and when it is wrong the tile is
 * `overflow-hidden`, so the call to action is quietly cut off instead of
 * complaining. Letting the picture absorb the remainder cannot be wrong.
 *
 * ── The picture is a width, not a fraction ──────────────────────────
 * `w-[124px] sm:w-[148px]`, not `40%`. A percentage looks the same at every
 * width and behaves differently at each: on a 490px card in the stacked
 * layout, 40% is a 196px picture and on a 300px one it is 120. A fixed
 * width keeps the picture the same object at every size and gives the
 * headline all the width the card gains.
 *
 * ── The headline is 15/16 semibold, not 15.5/16.5 bold ──────────────
 * At 481 × 204 the tile has three short lines of type in it. Bold at that
 * size against a 12.5px eyebrow and a 12.5px call to action made the title
 * the only thing on the tile with any weight, so it read as a heading
 * looking for a page rather than as a line in a card. Semibold sits it back
 * into the group; the lead keeps bold, because at 731 wide it is a heading.
 *
 * `lg:auto-rows-[220px]` and the spans are all `lg:` prefixed. Below that
 * the three stack in one column at their own heights, because a bento is a
 * relationship between tiles and there is no relationship in a single file.
 *
 * ── The pair carries the same fields ────────────────────────────────
 * One of the two used to show a paragraph and the other did not, on the
 * argument that the extra line stopped them reading as one control twice.
 * It did the opposite: the two tiles came out at different heights, their
 * pictures stretched to different depths, and the call to action sat on a
 * different baseline in each. Below `lg`, where they stack full width, one
 * card was half again as tall as the other for no reason a reader could
 * see.
 *
 * Both carry the same four now — meta, title, subline, call to action —
 * and the subline is `line-clamp-2` rather than trusted to fit. These
 * summaries were written for the lead and for the grid further down the
 * page, where there is room for four lines; two is what this tile has, and
 * a clamp is the only thing that keeps two tiles the same height when the
 * copy behind them is not the same length.
 *
 * ── 20 is the smallest gap on the tile ──────────────────────────────
 * `p-5` on the tile, `gap-5` between the picture and the type, and no
 * padding of its own on either — so the picture's edges and the type's are
 * the same 20 from the tile, and the space between them is the same 20
 * again. It was 12 and 16, which put the type nearer the tile's edge than
 * the picture was to the type and made the card read as two things pushed
 * together.
 *
 * The lead is the same: the tile's inset is its only horizontal padding,
 * so the headline starts exactly where the picture above it does.
 *
 * ── The picture stretches, it does not float ────────────────────────
 * `items-stretch` on the row and `self-stretch` on the plate, so the picture
 * is exactly as tall as the tile whatever the title wraps to. It was
 * `h-full` with a `min-h`, which resolves against a parent that has no
 * resolved height below `lg` — so the picture fell back to its minimum and
 * left white space under itself.
 *
 * ── The header is left, not centred ─────────────────────────────────
 * Every other section on these pages uses `SectionHeader`, which is centred.
 * This one is not, and it is the only one: a centred header over an
 * asymmetric grid points at the middle of a layout that has nothing in its
 * middle. The eyebrow, the heading and the subline run down the left and the
 * note sits against the right, so the block shares a left edge with the lead
 * tile and a right edge with the column beside it.
 *
 * The type is `SectionHeader`'s own — eyebrow at 11px/0.22em, the heading at
 * the `compact` 36/54/68, the body at 15/16 — so it is the same header
 * without the centring, not a different one. `docs/section-header.md` is the
 * source for those values.
 *
 * ── An item links or it opens ───────────────────────────────────────
 * The newsroom's stories are published elsewhere, so they are `<a>` with
 * `target="_blank"` and take the out-arrow. The case studies and the films
 * open a panel in place, so they take `onOpen` and a button, and the arrow
 * steps right. Passing `href` and `onOpen` both is a mistake — `href` wins,
 * because a link that swallows its own navigation is worse than a button that
 * looks like one.
 *
 * ── `cover` is JSX, and nothing is drawn on top of it ───────────────
 * The caller passes it and it fills the inset picture region. Two of the
 * three pages have photographs and hand over `next/image`; the newsroom has
 * none — there is no honest way to illustrate a real published article with a
 * generated picture — and hands over a typographic panel instead. A `src`
 * prop here would have forced that page to invent one.
 *
 * A caller that wants a play control puts it on the call to action, where it
 * cannot cover the one thing in the frame worth seeing.
 */

/**
 * The tile's corner, and the picture's inside it.
 *
 * 24 and 14 first, which put the largest radius on the site on the one
 * section that also has the most corners — a tile, a picture inside it, and
 * three of them in a row. At that size the curve is the first thing the eye
 * reads and the grid goes soft.
 *
 * 16 is `ProductFrame`'s, which is the closest thing on this site to what
 * this is: a box holding a picture. The inner 10 is the same 6px of tile
 * margin as before, so the two curves stay concentric — an inner radius
 * equal to the outer minus the inset is what stops the white margin looking
 * thicker at the corners than along the edges.
 */
const RADIUS = 16;
const RADIUS_IN = 10;

const TILE = "#FFFFFF";
const HAIR = "#ECECF0";
const HAIR_ON = "#DCDCE4";

export type LatestItem = {
  id: string;
  /** The coloured lead-in — the kind of thing this is. */
  eyebrow: string;
  /** The mono line beside it: a sector, a subject or a date. */
  meta: string;
  title: string;
  body: string;
  cta: string;
  /** Rendered before the call-to-action label, e.g. a play glyph. */
  ctaIcon?: React.ReactNode;
  /** Published elsewhere. Takes precedence over `onOpen`. */
  href?: string;
  /** Opens a panel in place. */
  onOpen?: () => void;
  cover: React.ReactNode;
};

/**
 * The tile, and whatever will carry the click.
 *
 * The hairline is an inset box-shadow rather than a border so it costs no
 * layout — a 1px border on a tile in a fixed-height row would push the
 * content box 2px smaller than the one beside it.
 */
function Tile({
  item,
  className,
  children,
}: {
  item: LatestItem;
  className: string;
  children: React.ReactNode;
}) {
  const shared =
    "group relative block w-full h-full overflow-hidden text-left p-5 transition-all duration-300 hover:-translate-y-0.5 " +
    className;

  const style: React.CSSProperties = {
    borderRadius: RADIUS,
    background: TILE,
    boxShadow: `inset 0 0 0 1px ${HAIR}`,
  };

  const inner = (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ borderRadius: RADIUS, boxShadow: `inset 0 0 0 1px ${HAIR_ON}` }}
      />
      {children}
    </>
  );

  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        className={shared}
        style={style}
      >
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={item.onOpen} className={shared} style={style}>
      {inner}
    </button>
  );
}

/** The inset picture region. Nothing is ever painted over it. */
function Plate({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <div
      className={
        "relative overflow-hidden shrink-0 [&_img]:object-cover [&_img]:transition-transform [&_img]:duration-[900ms] [&_img]:ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[&_img]:scale-[1.05] " +
        className
      }
      style={{ borderRadius: RADIUS_IN, background: "#F0F0F2" }}
    >
      {children}
    </div>
  );
}

function Cta({ item, small }: { item: LatestItem; small?: boolean }) {
  const Icon = item.href ? ArrowUpRight : ArrowRight;
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 font-semibold text-carbon group-hover:text-signal-orange transition-colors " +
        (small ? "text-[12.5px]" : "text-[13px]")
      }
    >
      {item.ctaIcon}
      {item.cta}
      <Icon
        size={small ? 13 : 14}
        className={
          "transition-transform duration-300 " +
          (item.href
            ? "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            : "group-hover:translate-x-1")
        }
        aria-hidden
      />
    </span>
  );
}

/** Eyebrow and meta, on one baseline. */
function Meta({ item, small }: { item: LatestItem; small?: boolean }) {
  return (
    <div className="flex items-baseline gap-2.5 flex-wrap">
      <span
        className={
          "font-bold leading-none text-signal-orange " +
          (small ? "text-[12.5px]" : "text-[15px]")
        }
        style={{ letterSpacing: "-0.015em" }}
      >
        {item.eyebrow}
      </span>
      <span
        className={
          "font-mono font-bold tracking-[0.16em] uppercase text-graphite/45 " +
          (small ? "text-[9.5px]" : "text-[10px]")
        }
      >
        {item.meta}
      </span>
    </div>
  );
}

function Lead({ item }: { item: LatestItem }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="lg:col-span-3 lg:row-span-2"
    >
      <Tile item={item} className="flex flex-col">
        <Plate className="w-full h-[200px] sm:h-[240px] lg:h-auto lg:flex-1 lg:min-h-[120px]">
          {item.cover}
        </Plate>

        <div className="flex flex-col justify-center flex-1 lg:flex-none pt-6 lg:pt-5">
          <Meta item={item} />

          <h3 className="mt-3.5 text-[21px] sm:text-[24px] font-bold tracking-[-0.03em] text-carbon leading-[1.2] transition-colors duration-300 group-hover:text-signal-orange">
            {item.title}
          </h3>

          <p className="mt-3 text-[13.5px] text-graphite/60 leading-[1.6] max-w-[600px]">
            {item.body}
          </p>

          <div className="mt-5">
            <Cta item={item} />
          </div>
        </div>
      </Tile>
    </motion.div>
  );
}

function Beside({ item, index }: { item: LatestItem; index: 0 | 1 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: 0.08 + index * 0.08, ease: EASE }}
      className="lg:col-span-2"
    >
      <Tile item={item} className="flex flex-row items-stretch gap-5">
        <Plate className="w-[132px] sm:w-[168px] self-stretch min-h-[124px]">
          {item.cover}
        </Plate>

        {/* Top-aligned, not centred. The picture starts at the tile's own
            12px inset, so the meta line has to start there too or the two
            columns read as two unrelated blocks that happen to share a box.
            No top padding of its own for the same reason — the tile's `p-3`
            is the shared top edge. */}
        <div className="flex flex-col flex-1 min-w-0">
          <Meta item={item} small />

          <h3 className="mt-2.5 text-[15px] lg:text-[16px] font-semibold tracking-[-0.015em] text-carbon leading-[1.35] transition-colors duration-300 group-hover:text-signal-orange">
            {item.title}
          </h3>

          {/* Clamped rather than trusted to fit. These summaries are written
              for the lead and the grid below, where there is room for four
              lines; two is what this tile has. */}
          <p className="mt-2 text-[12.5px] text-graphite/55 leading-[1.55] line-clamp-2">
            {item.body}
          </p>

          {/* Pinned to the bottom of the tile, not floated under the
              subline. `mt-auto` takes the slack, `pt-3` is the smallest gap
              it may sit at when a two-line title and a two-line subline leave
              none. Both tiles are the same height, so both calls to action
              land on the same baseline — which is the point: two links at two
              different heights in one column read as a mistake. */}
          <div className="mt-auto pt-3">
            <Cta item={item} small />
          </div>
        </div>
      </Tile>
    </motion.div>
  );
}

/**
 * Pass exactly three. The first leads; anything past the third has nowhere to
 * go and is dropped rather than silently changing the layout.
 */
export function LatestGrid({
  id,
  eyebrow,
  top,
  bottom,
  body,
  note,
  items,
}: {
  id: string;
  eyebrow: string;
  top: string;
  bottom: string;
  body?: string;
  /** The small line against the right edge of the header. */
  note?: string;
  items: LatestItem[];
}) {
  const [lead, ...rest] = items;
  if (!lead) return null;

  return (
    <Section surface="offWhite" id={id} padding="tight">
      {/* the header — `SectionHeader`'s type, off the centre line */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-6 lg:gap-12 items-end mb-10 sm:mb-12">
        <div className="max-w-[760px]">
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-signal-orange">
            {eyebrow}
          </p>

          <h2 className="mt-4 text-[36px] sm:text-[54px] lg:text-[68px] font-bold tracking-[-0.04em] leading-[1.04]">
            <span className="block text-carbon">{top}</span>
            <span className="block text-graphite/45">{bottom}</span>
          </h2>

          {body && (
            <p className="mt-6 text-[15px] sm:text-[16px] text-graphite/60 leading-[1.65] max-w-[620px]">
              {body}
            </p>
          )}
        </div>

        {note && (
          <p className="text-[12.5px] leading-[1.6] text-graphite/45 max-w-[260px] lg:text-right">
            {note}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:auto-rows-[204px]">
        <Lead item={lead} />

        {rest.slice(0, 2).map((it, i) => (
          <Beside key={it.id} item={it} index={i === 0 ? 0 : 1} />
        ))}
      </div>
    </Section>
  );
}
