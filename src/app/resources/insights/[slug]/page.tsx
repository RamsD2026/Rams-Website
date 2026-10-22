import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/sections/blog/BlogArticle";
import { POSTS, getPost, thumbSvg } from "@/components/sections/blog/content";

/**
 * /resources/insights/[slug] — one article of the Rack Safety Series.
 * Built at build time for every post; any other slug is a 404.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article not found | RAMS Digital" };
  return { title: `${post.title} | RAMS Digital`, description: post.standfirst };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  // the next three in the series, wrapping round
  const i = POSTS.findIndex((p) => p.slug === slug);
  const more = [1, 2, 3]
    .map((k) => POSTS[(i + k) % POSTS.length])
    .map((p) => ({ ...p, thumb: thumbSvg(p.num) }));

  return <BlogArticle post={post} more={more} />;
}
