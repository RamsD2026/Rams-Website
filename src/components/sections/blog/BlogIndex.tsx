"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { LightHeroGround } from "@/components/sections/LightHero";
import { FilterBar } from "@/components/sections/FilterBar";
import type { BlogPost } from "./content/posts";

/** A post with its card illustration, prepared on the server. */
export type BlogCard = BlogPost & { thumb: string };

/**
 * /resources/insights — the blog: the RAMS Inspect "Rack Safety Series".
 *
 * The Resources pages' parts: the light hero (LightHeroGround, the label
 * pill, the two-line h1, rounded-full buttons), then the shared FilterBar —
 * the series' four tiers as tabs, with search — over a 3-up card grid. Each
 * card carries its article's own illustration.
 *
 * The article titles, tiers, standfirsts and read times are the source
 * files' own (see content/posts.ts, generated from them).
 */

const ALL = "All articles";

export function BlogIndex({ posts: POSTS }: { posts: BlogCard[] }) {
  const TIERS = ["Awareness", "Educational", "Deep Technical", "Thought Leadership"].filter((t) =>
    POSTS.some((p) => p.tier === t),
  );
  const [tier, setTier] = useState(ALL);
  const [q, setQ] = useState("");

  const counts = useMemo(
    () => Object.fromEntries([[ALL, POSTS.length], ...TIERS.map((t) => [t, POSTS.filter((p) => p.tier === t).length])]),
    [POSTS, TIERS],
  );

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return POSTS.filter((p) => {
      if (tier !== ALL && p.tier !== tier) return false;
      if (!term) return true;
      return [p.title, p.standfirst, p.kicker].join(" ").toLowerCase().includes(term);
    });
  }, [POSTS, tier, q]);

  return (
    <>
      {/* ── hero ─────────────────────────────────────── */}
      <section className="relative overflow-hidden" id="top" data-hero-tone="light" style={{ background: "#FFFFFF" }}>
        <LightHeroGround />
        <div className="relative rams-container pt-40 sm:pt-48 lg:pt-56 pb-16 sm:pb-20">
          <div className="max-w-[1080px] mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur"
              style={{ boxShadow: "inset 0 0 0 1px #E8E8ED" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
              <span className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-graphite/70">
                Blogs
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
              className="mt-8 text-[44px] sm:text-[68px] lg:text-[88px] font-bold leading-[1.06] tracking-[-0.045em]"
            >
              <span className="block text-carbon">Rack Safety</span>
              <span className="block text-graphite/50">Series.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
              className="mt-6 text-[14px] sm:text-[16px] text-graphite/65 leading-[1.6] max-w-[760px] mx-auto"
            >
              {POSTS.length} articles from RAMS on rack safety, inspection, load
              capacity and the culture that keeps warehouses safe — from first
              awareness to deep technical detail.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32, ease: EASE }}
              className="mt-10 flex items-center justify-center gap-3 flex-wrap"
            >
              <Link
                href="#articles"
                className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-px hover:bg-signal-orange-hover"
              >
                Read the series
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
              <Link
                href="/company/contact"
                className="inline-flex items-center gap-2 bg-white text-carbon text-[14px] font-semibold px-6 py-3.5 rounded-full transition-colors duration-200 hover:bg-[#F5F5F7]"
                style={{ boxShadow: "inset 0 0 0 1px #E0E0E6" }}
              >
                Book a rack assessment
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── the articles ─────────────────────────────── */}
      <Section surface="offWhite" id="articles" padding="tight">
        <FilterBar
          tabs={[ALL, ...TIERS]}
          active={tier}
          onTab={setTier}
          label="Filter articles by type"
          query={q}
          onQuery={setQ}
          placeholder="Search articles…"
          slide
          counts={counts}
        />

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {shown.map((p, i) => (
            <motion.article
              key={p.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.06, ease: EASE }}
            >
              <Link
                href={`/resources/insights/${p.slug}`}
                className="group flex flex-col h-full overflow-hidden rounded-2xl bg-white border border-[#ECECEF] transition-transform duration-300 hover:-translate-y-1"
              >
                <div
                  className="blog-thumb relative aspect-[16/9] overflow-hidden bg-white border-b border-[#ECECEF] [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
                  aria-hidden
                  dangerouslySetInnerHTML={{ __html: p.thumb }}
                />
                <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-center gap-2.5 text-[12px] text-graphite/55">
                    <span className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-signal-orange px-2.5 py-1 rounded-full bg-[rgba(255,106,0,0.08)]">
                      {p.tier}
                    </span>
                    <span>{p.readTime}</span>
                  </div>
                  <h2 className="mt-3.5 text-[19px] font-bold tracking-[-0.02em] leading-[1.3] text-carbon group-hover:text-signal-orange transition-colors">
                    {p.title}
                  </h2>
                  <p className="mt-2.5 text-[14px] leading-[1.6] text-graphite/65 line-clamp-3">{p.standfirst}</p>
                  <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-carbon group-hover:text-signal-orange transition-colors">
                    Read article
                    <ArrowRight className="w-4 h-4" aria-hidden />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {shown.length === 0 && (
          <p className="mt-12 text-center text-[14px] text-graphite/55">No articles match that search.</p>
        )}
      </Section>
    </>
  );
}
