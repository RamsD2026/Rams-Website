import * as p01 from "./post-01";
import * as p02 from "./post-02";
import * as p03 from "./post-03";
import * as p04 from "./post-04";
import * as p05 from "./post-05";
import * as p06 from "./post-06";
import * as p07 from "./post-07";
import * as p08 from "./post-08";
import * as p09 from "./post-09";
import { POSTS, type BlogPost } from "./posts";
import { DATES } from "./dates";

/** Each post's illustration and article HTML, by number. */
const BODIES: Record<string, { heroSvg: string; html: string }> = {
  "01": p01,
  "02": p02,
  "03": p03,
  "04": p04,
  "05": p05,
  "06": p06,
  "07": p07,
  "08": p08,
  "09": p09,
};

export { POSTS, type BlogPost };

export function getPost(slug: string) {
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return undefined;
  return { ...post, ...BODIES[post.num], date: DATES[post.slug] };
}

/* Card framing for illustrations whose drawing sits small inside its
   frame: a tighter viewBox (16:10) so it fills the card like the rest. */
const THUMB_VIEW: Record<string, string> = {
  "04": "453 30 664 415",
};

/** An illustration cropped to fill a card's frame rather than letterboxed. */
export function thumbSvg(num: string) {
  let svg = BODIES[num].heroSvg;
  if (THUMB_VIEW[num]) svg = svg.replace(/viewBox="[^"]*"/, 'viewBox="' + THUMB_VIEW[num] + '"');
  return svg.replace("<svg ", '<svg preserveAspectRatio="xMidYMid slice" ');
}

/** A post's publish date (ISO), once one is set in dates.ts. */
export function postDate(slug: string): string | undefined {
  return DATES[slug];
}
