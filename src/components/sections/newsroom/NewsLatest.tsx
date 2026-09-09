"use client";

import { LatestGrid, type LatestItem } from "@/components/sections/LatestGrid";
import { SORTED } from "./news-data";

/**
 * 02 — Latest from RAMS.
 *
 * Three stories under the hero: the newest as the lead, the next two beside
 * it. `LatestGrid` owns the arrangement, the scrim and the type; this file
 * only decides which three and what fills the panel behind them.
 *
 * ── The three are taken, not chosen ─────────────────────────────────
 * `SORTED.slice(0, 3)`, newest first. There is no `featured` flag on a story
 * and there should not be: a hand-picked lead has to be re-picked every time
 * something is published, and the one that gets forgotten is the one that
 * makes the section wrong. Publish a story and it leads.
 *
 * All three appear again in the feed below. That is what a lead is — the same
 * stories, once at reading size and once in the archive.
 *
 * ── The cover is two words, and it sits at the top ──────────────────
 * There is no photograph for any of these articles and no honest way to make
 * one: an invented image of a collapsed rack attached to a real published
 * piece is a fabricated illustration of a real event.
 *
 * The words are centred in their region and nothing shares it. `LatestGrid`
 * keeps the type in a separate block below or beside the picture, so this
 * panel is cover art rather than a backdrop with a headline across it.
 *
 * It is a warm light gradient, not the near-black it started as. The tiles
 * are white on offWhite and the two photographic pages put photographs in
 * this slot; a black rectangle in the same position would be the only dark
 * thing on any of the three pages, and would read as a hole rather than as
 * artwork.
 *
 * `big` is the only difference between the two sizes. The lead is a 642-wide
 * panel and the two beside it are 558 at less than half the height, so the
 * same type would be either unreadable or comical.
 */

function Cover({
  words,
  form,
  big,
}: {
  words: [string, string];
  form: string;
  big: boolean;
}) {
  return (
    <div
      className="absolute inset-0 flex flex-col justify-center items-start"
      style={{
        padding: big ? 32 : 18,
        background:
          "linear-gradient(135deg, #FFF4EC 0%, #FFE7D6 48%, #FFD9BE 100%)",
      }}
    >
      {big && (
        <span className="text-[10px] font-mono font-bold tracking-[0.22em] uppercase text-carbon/35 mb-4">
          {form}
        </span>
      )}

      <div
        className="font-bold leading-[0.98] tracking-[-0.05em]"
        style={{ fontSize: big ? 58 : 24 }}
      >
        <span className="block text-carbon">{words[0]}</span>
        <span className="block text-signal-orange">{words[1]}.</span>
      </div>
    </div>
  );
}

export function NewsLatest() {
  const items: LatestItem[] = SORTED.slice(0, 3).map((s, i) => ({
    id: s.id,
    eyebrow: s.form,
    meta: s.subject,
    title: s.title,
    body: s.body,
    cta: `Read the ${s.form.toLowerCase()}`,
    href: s.href,
    cover: <Cover words={s.cover} form={s.form} big={i === 0} />,
  }));

  return (
    <LatestGrid
      id="latest"
      eyebrow="Latest from RAMS"
      top="Ideas, developments"
      bottom="And operating context."
      body="A focused editorial view of the issues shaping rack safety, warehouse operations and the connected physical world."
      note="Every story links to a published RAMS Digital article."
      items={items}
    />
  );
}
