"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Clock, Play } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { FilterBar } from "@/components/sections/FilterBar";
import { RECORDINGS, TOPICS, ask, type Recording } from "./webinar-data";

/**
 * 03 — The recordings.
 *
 * `CaseWork`, `VideoLibrary` and `NewsFeed` are the reference: `FilterBar`
 * with the tabs left and the search right, then a 3-up grid, with
 * `AnimatePresence` keyed by id so a card surviving a filter change stays put.
 *
 * It was an auto-running carousel for one revision, which was the right
 * control put on the wrong section — the moving row belongs to the featured
 * sessions above, where there are three cards and one is on screen at a time.
 * Nine sessions behind a filter want to be seen at once, not paged past.
 *
 * ── The card is the picture ─────────────────────────────────────────
 * Full-bleed photograph, a gradient off the bottom edge, and the type on it.
 * That is the one place on this page type goes over an image, and it works
 * here for the reason it did not in the bento on the other index pages: these
 * photographs were generated for this page with no text, no signage and no
 * logos in frame, and the card is 3:4 portrait — so there is a whole empty
 * lower third to set four short lines on, rather than a corner of a dashboard
 * screenshot.
 *
 * The running time sits top-right in a glass pill and the play mark top-left,
 * both clear of the type.
 *
 * ── Every card asks for the recording ───────────────────────────────
 * The source lists nine recordings and links none of them — there is no
 * `href` on a single play control in the document. A "Watch recording" button
 * that opens a player with no source in it is the one thing this page must
 * not do, so each card opens a pre-filled email instead, which is the
 * source's own mechanism for every other action on the page including
 * registration.
 *
 * A session that gains a `watch` URL in `webinar-data` switches to a direct
 * link and its label changes with it. That is the only edit needed.
 *
 * ── A session sits in more than one tab ─────────────────────────────
 * Four of the nine are filed under two topics, so the filter tests `includes`
 * rather than equality — "Where Does Every Vehicle Hour Go?" belongs under
 * MHE and under Operations, which is where somebody looking for either would
 * expect it. The tab counts will not add up to nine for that reason, which is
 * why there are no counts on the tabs.
 *
 * ── Filtering resets the track ──────────────────────────────────────
 * Both controls put the track back to the start, and `index` is clamped
 * against `maxIndex` on read rather than corrected in an effect: narrowing
 * nine results to two while parked on slide six would otherwise scroll past
 * the end of its own content for a frame and then snap back.
 */

function Card({ item }: { item: Recording }) {
  const live = Boolean(item.watch);
  const href =
    item.watch ??
    ask(
      `Webinar recording - ${item.title}`,
      `Hello RAMS Digital,\n\nPlease send me the recording of "${item.title}".\n\nName:\nCompany:\nEmail:\n\nThank you.`,
    );

  return (
    <a
      href={href}
      {...(live ? { target: "_blank", rel: "noreferrer" } : {})}
      className="group relative block w-full overflow-hidden"
      style={{ aspectRatio: "3 / 4", borderRadius: 20, background: "#08080A" }}
    >
      <Image
        src={item.img}
        alt={item.alt}
        fill
        sizes="(max-width: 640px) 88vw, (max-width: 1024px) 44vw, 380px"
        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
      />

      {/* the gradient the type sits on */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(8,8,10,0.94) 0%, rgba(8,8,10,0.74) 26%, rgba(8,8,10,0.30) 52%, rgba(8,8,10,0.10) 74%, rgba(8,8,10,0.22) 100%)",
        }}
      />

      <span
        className="absolute top-5 left-5 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
        style={{
          width: 44,
          height: 44,
          borderRadius: 999,
          background: "rgba(255,255,255,0.92)",
        }}
      >
        <Play
          className="w-4 h-4 text-carbon ml-[2px]"
          fill="currentColor"
          strokeWidth={0}
          aria-hidden
        />
      </span>

      <span
        className="absolute top-5 right-5 inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono font-bold tracking-[0.12em] uppercase text-white/85 tabular-nums"
        style={{
          borderRadius: 999,
          background: "rgba(255,255,255,0.14)",
          backdropFilter: "blur(6px)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.20)",
        }}
      >
        <Clock className="w-3.5 h-3.5" aria-hidden />
        {item.minutes} min
      </span>

      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <p className="text-[9.5px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
          {item.kicker}
        </p>

        <h3 className="mt-3 text-[19px] lg:text-[20px] font-bold tracking-[-0.025em] leading-[1.25] transition-colors duration-300 group-hover:text-signal-orange">
          {item.title}
        </h3>

        <p className="mt-2.5 text-[12.5px] text-white/55 leading-[1.55] line-clamp-2">
          {item.body}
        </p>

        <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-white/80 group-hover:text-signal-orange transition-colors">
          {live ? "Watch the recording" : "Request the recording"}
          <ArrowUpRight
            size={13}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </span>
      </div>
    </a>
  );
}

export function WebinarLibrary() {
  const [tab, setTab] = useState("All topics");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return RECORDINGS.filter((r) => {
      if (tab !== "All topics" && !r.topics.includes(tab)) return false;
      if (!term) return true;
      return (
        r.title.toLowerCase().includes(term) ||
        r.body.toLowerCase().includes(term) ||
        r.search.includes(term)
      );
    });
  }, [tab, q]);

  return (
    <Section surface="offWhite" id="recordings">
      <SectionHeader
        eyebrow="On-demand learning"
        top="Webinar"
        bottom="Recordings."
        size="compact"
        width="wide"
        body="Short, practical sessions built around the questions warehouse teams face on the floor."
        className="!mb-10 sm:!mb-12"
      />

      <FilterBar
        tabs={["All topics", ...TOPICS]}
        active={tab}
        onTab={setTab}
        label="Filter recordings by topic"
        query={q}
        onQuery={setQ}
        placeholder="Search recordings…"
      />

      <div className="mt-12 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {list.map((r, i) => (
            <motion.div
              key={r.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: 0.5,
                delay: (i % 3) * 0.05,
                ease: EASE,
              }}
            >
              <Card item={r} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {list.length === 0 && (
        <p className="text-center text-[14.5px] leading-[1.7] text-graphite/55 py-16">
          No recordings found. Try a broader topic or a different search term.
        </p>
      )}
    </Section>
  );
}
