"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  ClipboardCheck,
  FileText,
  Forklift,
  Gauge,
  Layers,
  Ruler,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { HeroTiles, LightHeroGround, type HeroTile } from "@/components/sections/LightHero";
import { ClientStrip } from "@/components/sections/ClientStrip";
import { FilterBar } from "@/components/sections/FilterBar";
import { BlogMeta } from "./BlogMeta";
import type { BlogPost } from "./content/posts";

/** A post with its card illustration, prepared on the server. */
export type BlogCard = BlogPost & { thumb: string; date?: string };

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

/* The orbit of tiles the Resources heroes carry (webinars, videos, news),
   with the subjects of this series. */
const TILES: HeroTile[] = [
  { icon: BookOpen, tint: "#3E63DD" },
  { icon: ShieldCheck, tint: "#F76808" },
  { icon: Forklift, tint: "#0891B2" },
  { icon: Layers, tint: "#DB2777" },
  { icon: Gauge, tint: "#6647F0" },
  { icon: FileText, tint: "#299764" },
  { icon: ClipboardCheck, tint: "#CA8A04" },
  { icon: Boxes, tint: "#E5484D" },
  { icon: Wrench, tint: "#65A30D" },
  { icon: Ruler, tint: "#0F766E" },
];

/** The card picture: the article's illustration in a rounded frame, its tier
    on a frosted tag, zooming a touch on hover. */
function Thumb({ post, className = "" }: { post: BlogCard; className?: string }) {
  return (
    <div className={"relative overflow-hidden rounded-xl bg-[#0B1016] " + className}>
      <div
        aria-hidden
        className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
        dangerouslySetInnerHTML={{ __html: post.thumb }}
      />
      <span
        className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-white"
        style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)" }}
      >
        {post.tier}
      </span>
    </div>
  );
}

/** A small label over a group of cards, ruled off to the right. */
function GroupLabel({ children, live = false }: { children: React.ReactNode; live?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {live && <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-signal-orange" />}
      <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-carbon">{children}</span>
      <span aria-hidden className="flex-1 h-px bg-[#E4E4E9]" />
    </div>
  );
}

/** "Read article" with an arrow that nudges on hover. */
function ReadMore({ className = "" }: { className?: string }) {
  return (
    <span className={"inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-carbon transition-colors duration-200 group-hover:text-signal-orange " + className}>
      Read article
      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
    </span>
  );
}

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

  const browsing = tier === ALL && !q.trim();
  const featured = browsing ? shown[0] : undefined;
  const rest = featured ? shown.slice(1) : shown;

  return (
    <>
      {/* ── hero ─────────────────────────────────────── */}
      <section className="relative overflow-hidden" id="top" data-hero-tone="light" style={{ background: "#FFFFFF" }}>
        <LightHeroGround />
        <div className="relative rams-container pt-40 sm:pt-52 lg:pt-60 pb-20 sm:pb-24 lg:pb-28">
          <HeroTiles tiles={TILES} />
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
              className="mt-8 text-[46px] sm:text-[72px] lg:text-[96px] font-bold leading-[1.06] tracking-[-0.045em]"
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
              Expert perspectives on rack safety, inspection, load capacity and
              the practices that keep warehouses safe, productive and compliant.
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

          {/* the client strip, in the slot the other Resources heroes put it in */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
            className="relative mt-24 sm:mt-28 lg:mt-32"
          >
            <ClientStrip label="Trusted on the warehouse floor" />
          </motion.div>
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

        {/* With no filter or search, the first article leads as the latest
            post in a wide card; the rest follow under More articles. */}
        {featured && (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-10"
          >
            <GroupLabel live>Latest post</GroupLabel>
            <Link
              href={`/resources/insights/${featured.slug}`}
              className="group grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center"
            >
              <Thumb post={featured} className="lg:col-span-7 aspect-[16/9]" />
              <div className="lg:col-span-5">
                <BlogMeta author={featured.author} date={featured.date} />
                <h2 className="mt-4 text-[26px] sm:text-[32px] font-bold tracking-[-0.03em] leading-[1.15] text-carbon">
                  {featured.title}
                </h2>
                <p className="mt-4 text-[15px] sm:text-[16px] leading-[1.65] text-graphite/65 line-clamp-3">
                  {featured.standfirst}
                </p>
                <ReadMore className="mt-7" />
              </div>
            </Link>
          </motion.article>
        )}

        {featured && rest.length > 0 && (
          <div className="mt-16 sm:mt-20">
            <GroupLabel>More articles</GroupLabel>
          </div>
        )}
        <div className={(featured ? "" : "mt-10 ") + "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12"}>
          {rest.map((p, i) => (
            <motion.article
              key={p.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.06, ease: EASE }}
            >
              <Link href={`/resources/insights/${p.slug}`} className="group flex flex-col h-full">
                <Thumb post={p} className="aspect-[16/10]" />
                <BlogMeta author={p.author} date={p.date} className="mt-5" />
                <h2 className="mt-3 text-[19px] sm:text-[20px] font-bold tracking-[-0.025em] leading-[1.28] text-carbon">
                  {p.title}
                </h2>
                <p className="mt-2.5 text-[14.5px] leading-[1.6] text-graphite/60 line-clamp-2">{p.standfirst}</p>
                <ReadMore className="mt-auto pt-5" />
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
