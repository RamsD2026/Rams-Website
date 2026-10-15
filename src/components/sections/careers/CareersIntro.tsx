"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BookmarkCheck,
  Check,
  Search,
  X,
} from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { FilterBar } from "@/components/sections/FilterBar";
import { APPLY_EVENT, CAREERS_EMAIL, FAMILIES, GROUPS, HERO_CHIPS, type GroupId } from "./careers-data";
import { listedJobs, type Job } from "./jobs-data";
import { useSavedJobs } from "./career-store";
import { ApplyDialog, JobMeta, familyTitle, postedLabel } from "./CareerDialogs";

/**
 * The top of the careers page — hero, open roles and career areas — as one
 * client component, because the three share state: the hero search filters
 * the job board, and a career area can send you to its roles.
 *
 * ── After DXC's careers page ────────────────────────────────────────
 * DXC opens on a job search and lists roles you can save or apply to; the
 * application offers autofill from a résumé, a manual form, the last
 * application and LinkedIn. All of that is here (`CareerDialogs`), built from
 * the site's own parts: the hero follows the site's dark heroes, the board's
 * filter is the shared `FilterBar` (with `slide`, so it is one swipeable row
 * on a phone), and the dialogs use `CaseModal`'s shell.
 *
 * ── Roles are real or they are absent ───────────────────────────────
 * The board reads `listedJobs()` (see `jobs-data`). With no real openings it
 * says so and offers the talent network — a general application through the
 * same apply flow — rather than inventing vacancies.
 */

const HAIR = "#E8E8ED";
const ALL = "All roles";

export function CareersIntro() {
  const jobs = useMemo(() => listedJobs(), []);
  const { saved, toggle, isSaved } = useSavedJobs();

  const [q, setQ] = useState("");
  const [team, setTeam] = useState(ALL);
  const [savedOnly, setSavedOnly] = useState(false);
  const [group, setGroup] = useState<GroupId | null>(null);
  const [applying, setApplying] = useState<{ job: Job | null } | null>(null);

  /* The bands further down the page (`CareersSections`) open a general
     application through this one flow rather than a mailto of their own. */
  useEffect(() => {
    const open = () => setApplying({ job: null });
    window.addEventListener(APPLY_EVENT, open);
    return () => window.removeEventListener(APPLY_EVENT, open);
  }, []);

  const teams = useMemo(() => {
    const present = FAMILIES.filter((f) => jobs.some((j) => j.family === f.code));
    return [ALL, ...present.map((f) => f.title)];
  }, [jobs]);

  const shownJobs = useMemo(() => {
    const term = q.trim().toLowerCase();
    return jobs.filter((j) => {
      if (savedOnly && !saved.includes(j.id)) return false;
      if (team !== ALL && familyTitle(j.family) !== team) return false;
      if (!term) return true;
      return [j.title, j.summary, j.location, j.type, j.mode, familyTitle(j.family), ...j.requirements]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [jobs, q, team, savedOnly, saved]);

  const shownFamilies = FAMILIES.filter((f) => !group || f.group === group);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const seeRoles = (title: string) => {
    setTeam(title);
    setSavedOnly(false);
    setQ("");
    scrollTo("jobs");
  };

  const hasJobs = jobs.length > 0;

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
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
              <span className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-white/70">
                Careers at RAMS Digital
              </span>
            </motion.div>

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

            {/* The hero's two actions, drawn exactly as the solution heroes
                draw theirs: an orange pill primary with an arrow, and an
                outlined pill secondary with no icon. Pills, like every other
                button on this page and the navbar's ROI calculator. */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.26, ease: EASE }}
              className="mt-9 flex items-center justify-center gap-3 flex-wrap"
            >
              <button
                type="button"
                onClick={() => scrollTo("jobs")}
                className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-px hover:bg-signal-orange-hover"
              >
                {hasJobs ? `View ${jobs.length} open ${jobs.length === 1 ? "role" : "roles"}` : "View open roles"}
                <ArrowDown className="w-4 h-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setApplying({ job: null })}
                className="inline-flex items-center gap-2 text-white text-[14px] font-semibold px-6 py-3.5 rounded-full border border-white/15 transition-all duration-200 hover:bg-white/[0.06]"
              >
                Join the talent network
              </button>
            </motion.div>

            {/* job search. The browser's own clear button is hidden (it draws
                a blue ✕ in Chrome) and a grey one is drawn instead. */}
            <motion.form
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.34, ease: EASE }}
              onSubmit={(e) => {
                e.preventDefault();
                setTeam(ALL);
                setSavedOnly(false);
                scrollTo("jobs");
              }}
              role="search"
              className="mt-8 mx-auto max-w-[620px] flex items-center gap-2 p-1.5 rounded-full bg-white/[0.06] border border-white/12 focus-within:border-signal-orange/70 transition-colors"
            >
              <Search className="ml-3.5 w-4 h-4 text-white/40 shrink-0" aria-hidden />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search roles, teams or skills"
                aria-label="Search roles"
                className="flex-1 min-w-0 bg-transparent py-2.5 text-[14px] text-white placeholder:text-white/35 outline-none [&::-webkit-search-cancel-button]:appearance-none"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => setQ("")}
                  aria-label="Clear search"
                  className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full text-white/45 hover:text-white/80 hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" aria-hidden />
                </button>
              )}
              <button
                type="submit"
                className="shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-signal-orange text-white text-[13.5px] font-semibold transition-colors hover:bg-signal-orange-hover"
              >
                <span className="hidden sm:inline">Find roles</span>
                <span className="sm:hidden">Search</span>
              </button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.42 }}
              className="mt-6 flex flex-wrap justify-center gap-2"
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
          </div>
        </div>
      </section>

      {/* ── open roles ───────────────────────────────── */}
      <Section surface="white" id="jobs">
        <SectionHeader
          eyebrow="Open roles"
          top="Find your role"
          bottom="On the ground floor."
          size="compact"
          width="wide"
          body="Search and filter current openings, save the ones you like, and apply in a few minutes."
          className="!mb-10 sm:!mb-12"
        />

        {hasJobs && (
          <>
            <FilterBar
              tabs={teams}
              active={team}
              onTab={(t) => {
                setTeam(t);
                setSavedOnly(false);
              }}
              label="Filter roles by team"
              query={q}
              onQuery={setQ}
              placeholder="Search roles…"
              slide
            />

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[13px] text-graphite/60">
                Showing <span className="font-semibold text-carbon">{shownJobs.length}</span> of{" "}
                {jobs.length} {jobs.length === 1 ? "role" : "roles"}
              </p>
              <button
                type="button"
                onClick={() => setSavedOnly((v) => !v)}
                aria-pressed={savedOnly}
                className={
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold transition-colors " +
                  (savedOnly ? "bg-carbon text-white" : "bg-[#F2F2F2] text-carbon hover:bg-[#E8E8ED]")
                }
              >
                <BookmarkCheck className="w-4 h-4" aria-hidden />
                Saved jobs ({saved.filter((id) => jobs.some((j) => j.id === id)).length})
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <AnimatePresence mode="popLayout">
                {shownJobs.map((j) => {
                  const on = isSaved(j.id);
                  return (
                    <motion.article
                      key={j.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl bg-white transition-all duration-300 hover:shadow-[0_22px_44px_-30px_rgba(14,14,15,0.35)]"
                      style={{ boxShadow: `inset 0 0 0 1px ${HAIR}` }}
                    >
                      <Link
                        href={`/company/careers/jobs/${j.id}`}
                        className="flex-1 min-w-0 text-left"
                      >
                        <span className="flex flex-wrap items-center gap-2">
                          <span
                            className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-signal-orange px-2.5 py-1 rounded-full"
                            style={{ background: "rgba(255,106,0,0.08)" }}
                          >
                            {familyTitle(j.family)}
                          </span>
                          {j.sample && (
                            <span className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-graphite/55 px-2.5 py-1 rounded-full bg-[#F2F2F2]">
                              Sample
                            </span>
                          )}
                          <span className="text-[12px] text-graphite/45">
                            Posted {postedLabel(j.posted)}
                          </span>
                        </span>
                        <span className="mt-2.5 block text-[18px] sm:text-[19px] font-bold tracking-[-0.02em] text-carbon leading-[1.3] group-hover:text-signal-orange transition-colors">
                          {j.title}
                        </span>
                        <span className="mt-2 block">
                          <JobMeta job={j} />
                        </span>
                        <span className="mt-3 block text-[14px] leading-[1.6] text-graphite/65 line-clamp-2 max-w-[720px]">
                          {j.summary}
                        </span>
                      </Link>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggle(j.id)}
                          aria-pressed={on}
                          aria-label={on ? `Remove ${j.title} from saved jobs` : `Save ${j.title}`}
                          className="flex items-center justify-center w-11 h-11 rounded-full transition-colors hover:bg-[#F2F2F2]"
                          style={{ boxShadow: `inset 0 0 0 1px ${HAIR}` }}
                        >
                          {on ? (
                            <BookmarkCheck className="w-[18px] h-[18px] text-signal-orange" aria-hidden />
                          ) : (
                            <Bookmark className="w-[18px] h-[18px] text-carbon" aria-hidden />
                          )}
                        </button>
                        <Link
                          href={`/company/careers/jobs/${j.id}`}
                          className="hidden sm:inline-flex items-center px-5 h-11 rounded-full text-[13.5px] font-semibold text-carbon hover:bg-[#F2F2F2] transition-colors"
                          style={{ boxShadow: `inset 0 0 0 1px ${HAIR}` }}
                        >
                          View role
                        </Link>
                        <button
                          type="button"
                          onClick={() => setApplying({ job: j })}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 h-11 rounded-full bg-signal-orange text-white text-[13.5px] font-semibold transition-colors hover:bg-signal-orange-hover"
                        >
                          Apply
                          <ArrowRight className="w-4 h-4" aria-hidden />
                        </button>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>

            {shownJobs.length === 0 && (
              <div className="py-14 text-center">
                <p className="text-[15px] font-semibold text-carbon">
                  {savedOnly ? "You have not saved any roles yet." : "No roles match that search."}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQ("");
                    setTeam(ALL);
                    setSavedOnly(false);
                  }}
                  className="mt-3 text-[13.5px] font-semibold text-signal-orange hover:underline underline-offset-2"
                >
                  Show all roles
                </button>
              </div>
            )}
          </>
        )}

        {!hasJobs && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="max-w-[820px] mx-auto text-center p-8 sm:p-12 rounded-3xl bg-[#F5F5F7]"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[11px] font-mono font-bold tracking-[0.16em] uppercase text-graphite/60" style={{ boxShadow: `inset 0 0 0 1px ${HAIR}` }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#2BCB74]" aria-hidden />
              Talent network open
            </span>
            <h3 className="mt-5 text-[24px] sm:text-[30px] font-bold tracking-[-0.03em] text-carbon leading-[1.2]">
              No open roles right now.
            </h3>
            <p className="mt-3 mx-auto max-w-[560px] text-[15px] leading-[1.65] text-graphite/65">
              New openings appear here as the team grows. Share your profile
              now and we will be in touch when there is a fit — or explore the
              career areas we hire for below.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setApplying({ job: null })}
                className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3 rounded-full transition-colors hover:bg-signal-orange-hover"
              >
                Join the talent network
                <ArrowRight className="w-4 h-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => scrollTo("areas")}
                className="inline-flex items-center gap-2 text-carbon text-[14px] font-semibold px-6 py-3 rounded-full bg-white hover:bg-[#ECECEF] transition-colors"
                style={{ boxShadow: `inset 0 0 0 1px ${HAIR}` }}
              >
                Explore career areas
              </button>
            </div>
          </motion.div>
        )}
      </Section>

      {/* ── career areas ─────────────────────────────── */}
      <Section surface="offWhite" id="areas">
        <SectionHeader
          eyebrow="Career areas"
          top="Find where your craft"
          bottom="Meets the physical world."
          size="compact"
          width="wide"
          body="The kinds of work RAMS needs as the platform, field network and customer base grow."
          className="!mb-10 sm:!mb-12"
        />

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
                /* No orange ring on the chosen tile — it read as a stray
                   border. While a filter is on, the other tiles dim and the
                   chosen one carries a "Selected" tag; keyboard focus still
                   shows its own outline. */
                className={
                  "group relative overflow-hidden rounded-2xl text-left aspect-[4/5] sm:aspect-[4/3] lg:aspect-[3/4] outline-none focus-visible:ring-2 focus-visible:ring-signal-orange transition-opacity duration-300 " +
                  (group && !on ? "opacity-45 hover:opacity-80" : "opacity-100")
                }
                style={{ background: "#0E0E10" }}
              >
                {on && (
                  <span className="absolute top-3 right-3 z-[1] inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-signal-orange text-white text-[10.5px] font-mono font-bold tracking-[0.12em] uppercase">
                    <Check className="w-3 h-3" aria-hidden />
                    Selected
                  </span>
                )}
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

        {group && (
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => setGroup(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-medium bg-carbon text-white"
            >
              {GROUPS.find((g) => g.id === group)?.title}
              <X className="w-3.5 h-3.5" aria-hidden />
            </button>
          </div>
        )}

        <div className={(group ? "mt-4" : "mt-10 sm:mt-12") + " grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"}>
          <AnimatePresence mode="popLayout">
            {shownFamilies.map((f) => {
              const roles = jobs.filter((j) => j.family === f.code).length;
              return (
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
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className="inline-flex px-2.5 py-1 rounded-md text-[10.5px] font-mono font-bold tracking-[0.14em] text-signal-orange"
                      style={{ background: "rgba(255,106,0,0.08)" }}
                    >
                      {f.code}
                    </span>
                    {roles > 0 && (
                      <span className="text-[11.5px] font-semibold text-[#1E9E5A]">
                        {roles} open {roles === 1 ? "role" : "roles"}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-[19px] font-bold tracking-[-0.02em] text-carbon leading-[1.25]">
                    {f.title}
                  </h3>
                  <p className="mt-2.5 text-[14px] leading-[1.65] text-graphite/65 flex-1">{f.body}</p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {f.tags.map((t) => (
                      <span key={t} className="px-2.5 py-1 rounded-full text-[11.5px] font-medium text-graphite bg-[#F5F5F7]">
                        {t}
                      </span>
                    ))}
                  </div>
                  {roles > 0 ? (
                    <button
                      type="button"
                      onClick={() => seeRoles(f.title)}
                      className="mt-6 self-start inline-flex items-center gap-1.5 text-[13px] font-semibold text-carbon group-hover:text-signal-orange transition-colors"
                    >
                      See open roles
                      <ArrowRight className="w-4 h-4" aria-hidden />
                    </button>
                  ) : (
                    <a
                      href={`mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(`Career interest — ${f.title}`)}`}
                      className="mt-6 self-start inline-flex items-center gap-1.5 text-[13px] font-semibold text-carbon group-hover:text-signal-orange transition-colors"
                    >
                      Ask about this area
                      <ArrowUpRight className="w-4 h-4" aria-hidden />
                    </a>
                  )}
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>

        <p className="mt-10 text-center text-[12.5px] leading-[1.65] text-graphite/45 max-w-[760px] mx-auto">
          These are career areas, not a guarantee that every role is currently
          open. Open roles are listed above.
        </p>
      </Section>

      {/* ── dialogs ──────────────────────────────────── */}
      <AnimatePresence>
        {applying && (
          <ApplyDialog
            key={`apply-${applying.job?.id ?? "general"}`}
            job={applying.job}
            onClose={() => setApplying(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
