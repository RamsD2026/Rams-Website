import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { LightHeroGround } from "@/components/sections/LightHero";
import type { BlogPost } from "./content/posts";
import { BLOG_CSS } from "./blog-styles";

/**
 * One article of the Rack Safety Series.
 *
 * The frame is the site's: the light Resources hero (LightHeroGround, the
 * label pill, the h1 and standfirst), the docs pages' sticky contents column,
 * and a "More from the series" row of the blog's cards.
 *
 * The words are the source file's, as written. The design is the site's: the
 * components are drawn by BLOG_CSS (blog-styles.ts) from the site's own
 * parts, and the illustrations are recoloured into the animated-screen theme
 * of the Solutions heroes (content/post-NN.ts, generated).
 */

type Full = BlogPost & { heroSvg: string; html: string };

export function BlogArticle({ post, more }: { post: Full; more: (BlogPost & { thumb: string })[] }) {
  const hasToc = post.toc.length > 0;

  return (
    <>
      <style>{BLOG_CSS}</style>

      {/* ── hero ─────────────────────────────────────── */}
      <section className="relative overflow-hidden" id="top" data-hero-tone="light" style={{ background: "#FFFFFF" }}>
        <LightHeroGround />
        <div className="relative rams-container pt-36 sm:pt-44 lg:pt-48 pb-12 sm:pb-14">
          <div className="max-w-[920px] mx-auto text-center">
            <Link
              href="/resources/insights"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-graphite/55 hover:text-carbon transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden />
              All articles
            </Link>
            <div className="mt-6">
              <span
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur"
                style={{ boxShadow: "inset 0 0 0 1px #E8E8ED" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
                <span className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-graphite/70">
                  {post.kicker}
                </span>
              </span>
            </div>
            <h1 className="mt-6 text-[34px] sm:text-[48px] lg:text-[60px] font-bold leading-[1.06] tracking-[-0.04em] text-carbon">
              {post.title}
            </h1>
            <p className="mt-5 mx-auto max-w-[720px] text-[16px] sm:text-[19px] leading-[1.55] text-graphite/65">
              {post.standfirst}
            </p>
            <div className="mt-7 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[13.5px] text-graphite/55">
              <span className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-signal-orange px-2.5 py-1 rounded-full bg-[rgba(255,106,0,0.08)]">
                {post.tier}
              </span>
              {post.author && (
                <span>
                  By <b className="font-semibold text-carbon">{post.author}</b>
                </span>
              )}
              {post.readTime && <span>· {post.readTime}</span>}
              {post.series && <span>· {post.series}</span>}
            </div>
          </div>

          {/* the article's own hero illustration */}
          <figure className="blog-art mt-12 max-w-[1080px] mx-auto">
            <div dangerouslySetInnerHTML={{ __html: post.heroSvg }} />
            {post.heroCaption && <figcaption>{post.heroCaption}</figcaption>}
          </figure>
        </div>
      </section>

      {/* ── the article ──────────────────────────────── */}
      <section className="bg-white pb-24 sm:pb-28">
        <div
          className={
            "rams-container pt-6 sm:pt-10 " +
            (hasToc ? "lg:grid lg:grid-cols-[220px_minmax(0,42rem)] lg:justify-center lg:gap-14 lg:items-start" : "")
          }
        >
          {hasToc && (
            <nav aria-label="In this article" className="hidden lg:block sticky top-28 pt-2">
              {post.tocTitle && (
                <p className="text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/45 mb-3">
                  {post.tocTitle}
                </p>
              )}
              <ul className="space-y-0.5">
                {post.toc.map((t) => (
                  <li key={t.id}>
                    <a
                      href={`#${t.id}`}
                      className="block border-l-2 border-[#ECECEF] pl-3.5 py-1.5 text-[13.5px] leading-[1.35] text-graphite/60 hover:text-carbon hover:border-signal-orange transition-colors"
                    >
                      {t.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <div className={`blog-body min-w-0 ${hasToc ? "" : "max-w-[46rem] mx-auto"}`}>
            <article dangerouslySetInnerHTML={{ __html: post.html }} />
          </div>
        </div>
      </section>

      {/* ── more from the series ─────────────────────── */}
      {more.length > 0 && (
        <section className="bg-[#F5F5F7]">
          <div className="rams-container py-16 sm:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-[26px] sm:text-[32px] font-bold tracking-[-0.03em] text-carbon">More from the series</h2>
              <Link
                href="/resources/insights"
                className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-carbon hover:text-signal-orange transition-colors"
              >
                All articles
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
              {more.map((p) => (
                <Link
                  key={p.slug}
                  href={`/resources/insights/${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-[#ECECEF] transition-transform duration-300 hover:-translate-y-1"
                >
                  <div
                    className="relative aspect-[16/9] overflow-hidden bg-[#0B1016] [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
                    aria-hidden
                    dangerouslySetInnerHTML={{ __html: p.thumb }}
                  />
                  <div className="p-6">
                    <span className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-signal-orange">
                      {p.tier}
                    </span>
                    <p className="mt-2 text-[17px] font-bold tracking-[-0.02em] leading-[1.3] text-carbon group-hover:text-signal-orange transition-colors">
                      {p.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
