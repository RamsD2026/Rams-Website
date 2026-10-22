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
  return { ...post, ...BODIES[post.num] };
}

/** An illustration cropped to fill a card's frame rather than letterboxed. */
export function thumbSvg(num: string) {
  return BODIES[num].heroSvg.replace("<svg ", '<svg preserveAspectRatio="xMidYMid slice" ');
}
