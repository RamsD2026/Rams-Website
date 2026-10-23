import type { Metadata } from "next";
import { BlogIndex } from "@/components/sections/blog/BlogIndex";
import { POSTS, postDate, thumbSvg } from "@/components/sections/blog/content";

export const metadata: Metadata = {
  title: "Blogs — Rack Safety Series | RAMS Digital",
  description:
    "Articles from RAMS on rack safety, inspection, load capacity and the culture that keeps warehouses safe.",
};

/**
 * /resources/insights — the blog (current version, 2026-10-22).
 *
 * The RAMS Inspect "Rack Safety Series": nine articles built from the
 * owner's HTML files (components/sections/blog/content). The previous page —
 * the newsroom sections — is commit d511af6; its components are kept in
 * sections/newsroom.
 */
export default function BlogsPage() {
  const posts = POSTS.map((p) => ({ ...p, thumb: thumbSvg(p.num), date: postDate(p.slug) }));
  return <BlogIndex posts={posts} />;
}
