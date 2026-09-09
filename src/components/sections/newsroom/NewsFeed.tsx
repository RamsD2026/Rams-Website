"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { FilterBar } from "@/components/sections/FilterBar";
import { SORTED, TOPICS, type Story } from "./news-data";

/**
 * 02 — Browse the newsroom.
 *
 * `CaseWork` and `VideoLibrary` are the reference and this is the same
 * object: the segmented pill filter, the 3-up grid, `AnimatePresence` keyed
 * by id so a card surviving a filter change stays put, and the card shape
 * with the type *under* the cover on the section's own ground — no box, no
 * border, no shadow.
 *
 * ── The tabs ────────────────────────────────────────────────────────
 * The source's own filter bar: All stories, Rack safety, Standards,
 * Operations. They are the site's segmented pill rather than the source's
 * underlined buttons, because that control already appears on the home page,
 * the case studies and the videos, and a fourth page inventing a fourth tab
 * style is how a design system stops being one.
 *
 * `TOPICS` is derived in `news-data`, so the tabs are the topics the stories
 * actually carry. The source hard-codes four buttons against six articles;
 * derived, they come out the same today and stay correct tomorrow.
 *
 * ── A story is in more than one tab, and that is deliberate ─────────
 * Five of the six are filed under two topics. The filter tests `includes`
 * rather than equality, so "Safe Load Capacity" appears under Rack safety and
 * under Operations — which is where a reader looking for either would expect
 * to find it. The counts on the tabs will not add up to six for that reason,
 * which is why there are no counts on the tabs.
 *
 * ── The search box is the source's ──────────────────────────────────
 * It matches the title, the summary and a keyword string carried on each
 * story — `search` in `news-data`, taken from the source's own `data-search`
 * attributes. Matching the title alone would miss "compliance", "forklift"
 * and "overload", which are the words somebody would actually type.
 *
 * The bar itself is `FilterBar`, shared with the case studies and the videos:
 * tabs left, search right. It was drawn here first and moved out when those
 * two pages wanted the same control.
 *
 * Filtering happens in a `useMemo` over a constant array. It is six items and
 * would be fine either way; the memo is there so the empty-result branch and
 * the grid read from one value rather than recomputing the filter twice.
 *
 * ── The cover is two words ──────────────────────────────────────────
 * There is no photograph for any of these and no honest way to make one — an
 * invented image of a collapsed rack attached to a real published article is
 * a fabricated illustration of a real event. The source solves it
 * typographically and so does this: two words on the ink ground, the second
 * held back, in the 3:2 box the other two pages put a picture in.
 *
 * ── Every card leaves the site ──────────────────────────────────────
 * These articles live on `backend.rams.digital`, so each is an `<a>` with
 * `target="_blank"` and `rel="noreferrer"`, and takes the out-arrow rather
 * than the arrow that steps right. `next/link` is for routes; this is not
 * one.
 */

/**
 * The date, formatted from the ISO string by hand.
 *
 * `news-data` holds ISO so the list can be sorted on it, and this derives the
 * display string. Not `toLocaleDateString`: the server and the client format
 * independently, and letting either pick up the machine's locale or offset is
 * how a date renders "24 July 2026" on one and "July 24, 2026" on the other
 * and React throws a hydration mismatch.
 *
 * A fixed `en-GB` locale fixes that but abbreviates September to "Sept",
 * which sits beside "Jul" in the same grid and reads as a typo. Three letters
 * for every month, and no `Date` at all — parsing "2026-07-24" only to format
 * it back is a round trip through a time zone for nothing.
 */
const MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");

const shown = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
};

function Card({ story, index }: { story: Story; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.05, ease: EASE }}
      className="group block"
    >
      <a href={story.href} target="_blank" rel="noreferrer">
        {/* the cover — two words where the other two pages put a picture */}
        <div
          className="relative w-full overflow-hidden flex flex-col justify-between p-6"
          style={{
            aspectRatio: "3 / 2",
            borderRadius: 20,
            background:
              "radial-gradient(90% 100% at 50% 0%, #1D1D1F 0%, #0E0E0F 60%, #08080A 100%)",
          }}
        >
          <div className="relative flex items-center justify-between gap-3">
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-white/35">
              {story.form}
            </span>
            <span
              className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-signal-orange px-2.5 py-1"
              style={{ borderRadius: 999, background: "rgba(255,106,0,0.10)" }}
            >
              {story.subject}
            </span>
          </div>

          <div className="relative text-[34px] sm:text-[38px] font-bold leading-[1.02] tracking-[-0.045em]">
            <span className="block text-white">{story.cover[0]}</span>
            <span className="block text-white/35 italic">
              {story.cover[1]}
            </span>
          </div>
        </div>

        <div className="mt-7 lg:mt-8">
          <p className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-graphite/55">
            {story.byline} · <time dateTime={story.date}>{shown(story.date)}</time>
          </p>

          <h3 className="mt-4 text-[20px] lg:text-[22px] font-bold text-carbon leading-[1.25] transition-colors duration-300 group-hover:text-signal-orange">
            {story.title}
          </h3>

          <p className="mt-4 text-[14px] text-graphite/65 leading-[1.65]">
            {story.body}
          </p>

          <span className="mt-7 inline-flex items-center gap-1.5 text-[13px] font-semibold text-carbon group-hover:text-signal-orange transition-colors">
            Read the {story.form.toLowerCase()}
            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </span>
        </div>
      </a>
    </motion.div>
  );
}

export function NewsFeed() {
  const [tab, setTab] = useState("All stories");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return SORTED.filter((s) => {
      const onTab = tab === "All stories" || s.topics.includes(tab);
      if (!onTab) return false;
      if (!term) return true;
      return (
        s.title.toLowerCase().includes(term) ||
        s.body.toLowerCase().includes(term) ||
        s.search.includes(term)
      );
    });
  }, [tab, q]);

  return (
    <Section surface="white" id="feed">
      <SectionHeader
        eyebrow="News & insights"
        top="Browse"
        bottom="The newsroom."
        size="compact"
        width="wide"
        body="Published RAMS Digital writing by topic, from rack safety fundamentals to standards and modern warehouse operations."
        className="!mb-10 sm:!mb-12"
      />

      <FilterBar
        tabs={["All stories", ...TOPICS]}
        active={tab}
        onTab={setTab}
        label="Filter stories by topic"
        query={q}
        onQuery={setQ}
        placeholder="Search the newsroom…"
      />

      <div className="mt-12 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14 lg:gap-y-16 items-start">
        <AnimatePresence mode="popLayout">
          {list.map((s, i) => (
            <Card key={s.id} story={s} index={i} />
          ))}
        </AnimatePresence>
      </div>

      {/* The source carries this line for the same case. A grid that simply
          empties looks broken; one that says why does not. */}
      {list.length === 0 && (
        <p className="text-center text-[14.5px] leading-[1.7] text-graphite/55 py-16">
          No stories match that search. Try another topic or keyword.
        </p>
      )}
    </Section>
  );
}
