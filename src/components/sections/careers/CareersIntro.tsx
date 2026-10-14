"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Search, X } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import {
  CAREERS_EMAIL,
  FAMILIES,
  GROUPS,
  HERO_CHIPS,
  type GroupId,
} from "./careers-data";

/**
 * The careers hero and the career-area explorer, in one component because
 * the hero's search drives the explorer below it.
 *
 * DXC's careers page opens on a job search over a photograph and follows it
 * with categories to explore. RAMS has career areas rather than live
 * vacancies (see `careers-data`), so the search here filters those areas —
 * title, description and skills — and the categories are four photo tiles,
 * each filtering the nine family cards to its own set. Submitting the hero
 * search scrolls to the results.
 *
 * The hero is dark and does not declare `data-hero-tone="light"`, so the
 * navbar keeps its transparent treatment over it like every dark hero.
 */

const HAIR = "#E8E8ED";

export function CareersIntro() {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<GroupId | null>(null);

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return FAMILIES.filter((f) => {
      if (group && f.group !== group) return false;
      if (!term) return true;
      return (
        f.title.toLowerCase().includes(term) ||
        f.body.toLowerCase().includes(term) ||
        f.tags.some((t) => t.toLowerCase().includes(term))
      );
    });
  }, [q, group]);

  const toAreas = () =>
    document.getElementById("areas")?.scrollIntoView({ behavior: "smooth", block: "start" });

  const activeGroup = GROUPS.find((g) => g.id === group);

  return (
    <>
      {/* ── hero ─────────────────────────────────────── */}
      <section
        className="relative overflow-hidden text-white"
        style={{
          background:
            "radial-gradient(80% 100% at 50% 0%, #1D1D1F 0%, #0E0E0F 55%, #08080A 100%)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[680px]"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 12%, rgba(255,106,0,0.20), transparent 70%)",
          }}
        />

        <div className="relative rams-container pt-36 sm:pt-44 lg:pt-48 pb-20 sm:pb-24">
          <div className="max-w-[920px] mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.04]"
            >
              <span className="relative flex w-2 h-2" aria-hidden>
                <span className="absolute inset-0 rounded-full bg-[#2BCB74] opacity-60 animate-ping" />
                <span className="relative w-2 h-2 rounded-full bg-[#2BCB74]" />
              </span>
              <span className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-white/70">
                Careers · Talent network open
              </span>
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
              className="mt-7 text-[38px] sm:text-[58px] lg:text-[72px] font-bold leading-[1.04] tracking-[-0.04em]"
            >
              <span className="block text-white">Build technology that changes</span>
              <span className="block text-white/45">what happens on the ground.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
              className="mt-6 mx-auto max-w-[640px] text-[15px] sm:text-[17px] leading-[1.6] text-white/55"
            >
              Join engineers, safety specialists, designers and operators
              building a digital operating context for warehouses, factories
              and other physical environments.
            </motion.p>

            {/* the search — over career areas, not job listings */}
            <motion.form
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28, ease: EASE }}
              onSubmit={(e) => {
                e.preventDefault();
                setGroup(null);
                toAreas();
              }}
              role="search"
              className="mt-9 mx-auto max-w-[620px] flex items-center gap-2 p-1.5 rounded-full bg-white/[0.06] border border-white/12 focus-within:border-signal-orange/70 transition-colors"
            >
              <Search className="ml-3.5 w-4 h-4 text-white/40 shrink-0" aria-hidden />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search career areas — e.g. data, inspection, design"
                aria-label="Search career areas"
                className="flex-1 min-w-0 bg-transparent py-2.5 text-[14px] text-white placeholder:text-white/35 outline-none"
              />
              <button
                type="submit"
                className="shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-signal-orange text-white text-[13.5px] font-semibold transition-colors hover:bg-signal-orange-hover"
              >
                <span className="hidden sm:inline">Search areas</span>
                <span className="sm:hidden">Search</span>
              </button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-7 flex flex-wrap justify-center gap-2"
            >
              {HERO_CHIPS.map((c) => (
                <span
                  key={c}
                  className="px-3.5 py-1.5 rounded-full text-[12.5px] text-white/65 border border-white/10 bg-white/[0.03]"
                >
                  {c}
                </span>
              ))}
            </motion.div>

            <button
              type="button"
              onClick={toAreas}
              className="mt-10 inline-flex items-center gap-2 text-[13px] font-semibold text-white/60 hover:text-white transition-colors"
            >
              Explore career areas
              <ArrowDown className="w-4 h-4" aria-hidden />
            </button>
          </div>
        </div>
      </section>

      {/* ── explore ──────────────────────────────────── */}
      <Section surface="white" id="areas">
        <SectionHeader
          eyebrow="Career areas"
          top="Find where your craft"
          bottom="Meets the physical world."
          size="compact"
          width="wide"
          body="Explore the kinds of work RAMS needs as the platform, field network and customer base grow."
          className="!mb-10 sm:!mb-12"
        />

        {/* the four category tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {GROUPS.map((g) => {
            const on = group === g.id;
            const count = FAMILIES.filter((f) => f.group === g.id).length;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setGroup(on ? null : g.id)}
                aria-pressed={on}
                className={
                  "group relative overflow-hidden rounded-2xl text-left aspect-[4/5] sm:aspect-[4/3] lg:aspect-[3/4] outline-none transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-signal-orange " +
                  (on ? "ring-2 ring-signal-orange ring-offset-2" : "")
                }
                style={{ background: "#0E0E10" }}
              >
                <Image
                  src={g.img}
                  alt={g.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 300px"
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                />
                <span
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(8,8,10,0.92) 0%, rgba(8,8,10,0.55) 40%, rgba(8,8,10,0.05) 75%)",
                  }}
                />
                <span className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-white">
                  <span className="block text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-signal-orange">
                    {count} {count === 1 ? "area" : "areas"}
                  </span>
                  <span className="mt-1.5 block text-[16px] sm:text-[19px] font-bold tracking-[-0.02em] leading-[1.2]">
                    {g.title}
                  </span>
                  <span className="mt-1 hidden sm:block text-[12.5px] leading-[1.5] text-white/65">
                    {g.body}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* the result bar */}
        <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-graphite/60">
            Showing <span className="font-semibold text-carbon">{shown.length}</span> of{" "}
            {FAMILIES.length} career areas
          </p>
          <div className="flex flex-wrap gap-2">
            {activeGroup && (
              <button
                type="button"
                onClick={() => setGroup(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-medium bg-carbon text-white"
              >
                {activeGroup.title}
                <X className="w-3.5 h-3.5" aria-hidden />
              </button>
            )}
            {q.trim() && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-medium bg-[#F2F2F2] text-carbon"
              >
                “{q.trim()}”
                <X className="w-3.5 h-3.5" aria-hidden />
              </button>
            )}
          </div>
        </div>

        {/* the family cards */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {shown.map((f) => (
              <motion.article
                key={f.code}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="group flex flex-col p-6 rounded-2xl bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-28px_rgba(14,14,15,0.35)]"
                style={{ boxShadow: `inset 0 0 0 1px ${HAIR}` }}
              >
                <span
                  className="self-start inline-flex px-2.5 py-1 rounded-md text-[10.5px] font-mono font-bold tracking-[0.14em] text-signal-orange"
                  style={{ background: "rgba(255,106,0,0.08)" }}
                >
                  {f.code}
                </span>
                <h3 className="mt-4 text-[19px] font-bold tracking-[-0.02em] text-carbon leading-[1.25]">
                  {f.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-[1.65] text-graphite/65 flex-1">
                  {f.body}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {f.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-full text-[11.5px] font-medium text-graphite bg-[#F5F5F7]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <a
                  href={`mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(`Career interest — ${f.title}`)}`}
                  className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-carbon group-hover:text-signal-orange transition-colors"
                >
                  Ask about this area
                  <ArrowUpRight className="w-4 h-4" aria-hidden />
                </a>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {shown.length === 0 && (
          <p className="py-14 text-center text-[14.5px] leading-[1.7] text-graphite/55">
            No career area matches that search. Try another word, or{" "}
            <button
              type="button"
              onClick={() => {
                setQ("");
                setGroup(null);
              }}
              className="font-semibold text-carbon underline underline-offset-2 hover:text-signal-orange"
            >
              show all areas
            </button>
            .
          </p>
        )}

        <p className="mt-10 text-center text-[12.5px] leading-[1.65] text-graphite/45 max-w-[760px] mx-auto">
          These are career areas, not a guarantee that every role is currently
          open. Share your profile with the team to check current opportunities.
        </p>
      </Section>
    </>
  );
}
