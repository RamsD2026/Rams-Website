"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  CalendarDays,
  Check,
  Clock,
  Link2,
  MapPin,
  Users,
} from "lucide-react";
import { EASE } from "@/components/sections/rackiq/rackiq-shared";
import { JOURNEY } from "./careers-data";
import type { Job } from "./jobs-data";
import { useSavedJobs } from "./career-store";
import { ApplyDialog, familyTitle, postedLabel } from "./CareerDialogs";

/**
 * A role's own page — /company/careers/jobs/[id].
 *
 * The job board's popup became a page so a role can be linked, shared and
 * read at length: a dark hero in the careers page's own treatment with the
 * role's facts and actions, then the description beside a sticky summary
 * card that keeps "Apply" in reach the whole way down, then the other open
 * roles. On a phone the summary card is not sticky, so a bar pinned to the
 * bottom of the screen carries Apply instead.
 *
 * Apply opens the same `ApplyDialog` the board uses (résumé autofill, manual,
 * last application, LinkedIn soon); Save is the same device-local list.
 * Sample roles (see `jobs-data`) keep their "Sample" tag, open with a notice
 * that they are not vacancies, and every apply action becomes "Join the
 * talent network" — a general application, not one to the role.
 */

const HAIR = "#E8E8ED";

const reveal = (i = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, delay: i * 0.05, ease: EASE },
});

function Block({ title, items }: { title: string; items?: string[] }) {
  if (!items || !items.length) return null;
  return (
    <motion.section {...reveal()} className="pt-10 first:pt-0">
      <h2 className="text-[22px] sm:text-[24px] font-bold tracking-[-0.025em] text-carbon">
        {title}
      </h2>
      <ul className="mt-5 space-y-3.5">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-3.5 text-[15.5px] leading-[1.65] text-graphite/75">
            <span
              className="mt-[3px] flex items-center justify-center w-5 h-5 rounded-full shrink-0"
              style={{ background: "rgba(255,106,0,0.10)" }}
              aria-hidden
            >
              <Check className="w-3 h-3 text-signal-orange" strokeWidth={2.5} />
            </span>
            {it}
          </li>
        ))}
      </ul>
    </motion.section>
  );
}

export function JobPage({ job, others }: { job: Job; others: Job[] }) {
  const { toggle, isSaved } = useSavedJobs();
  const [applying, setApplying] = useState(false);
  const [copied, setCopied] = useState(false);
  const saved = isSaved(job.id);
  const applyLabel = job.sample ? "Join the talent network" : "Apply for this role";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — nothing to do */
    }
  };

  const facts: { icon: React.ReactNode; label: string; value: string }[] = [
    { icon: <Users className="w-4 h-4" aria-hidden />, label: "Team", value: familyTitle(job.family) },
    { icon: <MapPin className="w-4 h-4" aria-hidden />, label: "Location", value: job.location },
    { icon: <Briefcase className="w-4 h-4" aria-hidden />, label: "Job type", value: job.type },
    { icon: <Clock className="w-4 h-4" aria-hidden />, label: "Work mode", value: job.mode },
    ...(job.experience
      ? [{ icon: <Check className="w-4 h-4" aria-hidden />, label: "Experience", value: job.experience }]
      : []),
    { icon: <CalendarDays className="w-4 h-4" aria-hidden />, label: "Posted", value: postedLabel(job.posted) },
  ];

  const saveButton = (dark = false) => (
    <button
      type="button"
      onClick={() => toggle(job.id)}
      aria-pressed={saved}
      className={
        "inline-flex items-center justify-center gap-2 text-[14px] font-semibold px-6 py-3.5 rounded-full transition-all duration-200 " +
        (dark
          ? "text-white border border-white/15 hover:bg-white/[0.06]"
          : "text-carbon hover:bg-[#F2F2F2]")
      }
      style={dark ? undefined : { boxShadow: `inset 0 0 0 1px ${HAIR}` }}
    >
      {saved ? (
        <BookmarkCheck className="w-4 h-4 text-signal-orange" aria-hidden />
      ) : (
        <Bookmark className="w-4 h-4" aria-hidden />
      )}
      {saved ? "Saved" : "Save job"}
    </button>
  );

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
          className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
          style={{
            background:
              "radial-gradient(60% 60% at 30% 10%, rgba(255,106,0,0.18), transparent 70%)",
          }}
        />
        <div className="relative rams-container pt-32 sm:pt-40 pb-14 sm:pb-16">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[12.5px] text-white/45">
            <Link href="/company/careers" className="hover:text-white transition-colors">
              Careers
            </Link>
            <span aria-hidden>›</span>
            <Link href="/company/careers#jobs" className="hover:text-white transition-colors">
              Open roles
            </Link>
            <span aria-hidden>›</span>
            <span className="text-white/70 truncate max-w-[60vw]">{job.title}</span>
          </nav>

          {job.sample && (
            <p
              role="note"
              className="mt-6 max-w-[760px] px-4 py-3 rounded-xl text-[13.5px] leading-[1.55] text-white/80"
              style={{ background: "rgba(255,106,0,0.10)", boxShadow: "inset 0 0 0 1px rgba(255,106,0,0.30)" }}
            >
              <span className="font-semibold text-white">Sample role.</span> This is an
              example to preview the careers page, not an open vacancy. To be considered
              for future roles, join the talent network.
            </p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-8 max-w-[860px]"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange px-3 py-1.5 rounded-full"
                style={{ background: "rgba(255,106,0,0.12)", boxShadow: "inset 0 0 0 1px rgba(255,106,0,0.28)" }}
              >
                {familyTitle(job.family)}
              </span>
              {job.sample && (
                <span className="text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase text-white/60 px-3 py-1.5 rounded-full border border-white/12">
                  Sample role
                </span>
              )}
            </div>

            <h1 className="mt-5 text-[34px] sm:text-[48px] lg:text-[56px] font-bold tracking-[-0.04em] leading-[1.06]">
              {job.title}
            </h1>
            <p className="mt-5 max-w-[680px] text-[15.5px] sm:text-[17px] leading-[1.6] text-white/60">
              {job.summary}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {[job.location, job.type, job.mode, job.experience].filter(Boolean).map((t) => (
                <span
                  key={t}
                  className="px-3.5 py-1.5 rounded-full text-[12.5px] text-white/70 border border-white/10 bg-white/[0.03]"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setApplying(true)}
                className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-px hover:bg-signal-orange-hover"
              >
                {applyLabel}
                <ArrowRight className="w-4 h-4" aria-hidden />
              </button>
              {saveButton(true)}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── description + summary ────────────────────── */}
      <section className="bg-white">
        <div className="rams-container py-16 sm:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-12 lg:gap-16 items-start">
          <div className="min-w-0 max-w-[760px]">
            <motion.section {...reveal()}>
              <h2 className="text-[22px] sm:text-[24px] font-bold tracking-[-0.025em] text-carbon">
                About the role
              </h2>
              <p className="mt-4 text-[16px] leading-[1.75] text-graphite/75">{job.summary}</p>
            </motion.section>

            <div className="mt-10">
              <Block title="What you will do" items={job.responsibilities} />
              <Block title="What you bring" items={job.requirements} />
              <Block title="Nice to have" items={job.niceToHave} />
            </div>

            {/* how hiring works — the careers page's candidate journey */}
            <motion.section
              {...reveal()}
              className="mt-12 p-7 sm:p-8 rounded-2xl bg-[#F5F5F7]"
            >
              <h2 className="text-[20px] font-bold tracking-[-0.02em] text-carbon">How we hire</h2>
              <p className="mt-2 text-[14px] leading-[1.6] text-graphite/60">
                The sequence may vary by role, but you should understand the work,
                team and expectations before a decision.
              </p>
              <ol className="mt-6 space-y-4">
                {JOURNEY.map((j, i) => (
                  <li key={j.title} className="flex items-start gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-carbon text-white text-[12px] font-bold tabular-nums shrink-0">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-[15px] font-bold text-carbon">{j.title}</p>
                      <p className="mt-0.5 text-[13.5px] leading-[1.6] text-graphite/60">{j.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </motion.section>

            <p className="mt-8 text-[12.5px] leading-[1.65] text-graphite/45">
              Role availability and employment terms are confirmed during the hiring process.
            </p>
          </div>

          {/* the sticky summary */}
          <aside className="lg:sticky lg:top-28">
            <div
              className="p-6 sm:p-7 rounded-2xl bg-white"
              style={{ boxShadow: `inset 0 0 0 1px ${HAIR}, 0 24px 48px -32px rgba(14,14,15,0.25)` }}
            >
              <p className="text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/45">
                Role summary
              </p>
              <dl className="mt-5 space-y-3.5">
                {facts.map((f) => (
                  <div key={f.label} className="flex items-start gap-3">
                    <span className="mt-0.5 text-signal-orange shrink-0">{f.icon}</span>
                    <div className="min-w-0">
                      <dt className="text-[11.5px] text-graphite/50">{f.label}</dt>
                      <dd className="text-[14px] font-semibold text-carbon">{f.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
              <div className="mt-7 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => setApplying(true)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-px hover:bg-signal-orange-hover"
                >
                  {applyLabel}
                  <ArrowRight className="w-4 h-4" aria-hidden />
                </button>
                {saveButton()}
                <button
                  type="button"
                  onClick={copyLink}
                  className="inline-flex items-center justify-center gap-2 text-[13px] font-semibold text-graphite/60 hover:text-carbon py-2 rounded-full transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-[#1E9E5A]" aria-hidden />
                  ) : (
                    <Link2 className="w-4 h-4" aria-hidden />
                  )}
                  {copied ? "Link copied" : "Copy link"}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ── other roles ──────────────────────────────── */}
      {others.length > 0 && (
        <section className="bg-[#F5F5F7]">
          <div className="rams-container py-16 sm:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-[26px] sm:text-[32px] font-bold tracking-[-0.03em] text-carbon">
                Other open roles
              </h2>
              <Link
                href="/company/careers#jobs"
                className="inline-flex items-center gap-2 text-[14px] font-semibold text-carbon hover:text-signal-orange transition-colors"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden />
                All open roles
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {others.map((o, i) => (
                <motion.div key={o.id} {...reveal(i)}>
                  <Link
                    href={`/company/careers/jobs/${o.id}`}
                    className="group flex flex-col h-full p-6 rounded-2xl bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-28px_rgba(14,14,15,0.35)]"
                    style={{ boxShadow: `inset 0 0 0 1px ${HAIR}` }}
                  >
                    <span className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-signal-orange">
                      {familyTitle(o.family)}
                    </span>
                    <span className="mt-3 text-[17px] font-bold tracking-[-0.02em] text-carbon leading-[1.3] group-hover:text-signal-orange transition-colors">
                      {o.title}
                    </span>
                    <span className="mt-2 text-[13px] text-graphite/55">
                      {o.location} · {o.type} · {o.mode}
                    </span>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-carbon group-hover:text-signal-orange transition-colors">
                      View role
                      <ArrowRight className="w-4 h-4" aria-hidden />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── phone: Apply pinned to the bottom ────────── */}
      <div
        className="lg:hidden sticky bottom-0 z-30 flex items-center gap-3 px-4 py-3 bg-white/95 backdrop-blur"
        style={{ borderTop: `1px solid ${HAIR}` }}
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-bold text-carbon">{job.title}</p>
          <p className="truncate text-[12px] text-graphite/55">{job.location}</p>
        </div>
        <button
          type="button"
          onClick={() => setApplying(true)}
          className="shrink-0 inline-flex items-center gap-1.5 bg-signal-orange text-white text-[13.5px] font-semibold px-5 py-3 rounded-full transition-colors hover:bg-signal-orange-hover"
        >
          {job.sample ? "Join network" : "Apply"}
          <ArrowRight className="w-4 h-4" aria-hidden />
        </button>
      </div>

      <AnimatePresence>
        {applying && (
          <ApplyDialog job={job.sample ? null : job} onClose={() => setApplying(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
