"use client";

import { Search } from "lucide-react";

/**
 * The filter bar: tabs on the left, search on the right.
 *
 * One component for the case studies, the videos and the newsroom. All three
 * had the same control drawn slightly differently — the first two centred
 * their tabs with no search at all, the third grew a search box beside them —
 * and three copies of one bar is how the client strips on this site drifted
 * apart before they were pulled into `src/data/clients.ts`.
 *
 * ── Left and right, not centred ─────────────────────────────────────
 * `justify-between` on a full-width row. The tabs were centred under a
 * centred `SectionHeader` while they were the only control; a centred pair
 * reads as one floating object and neither half gets an edge to sit against.
 * Split to the container's own edges, the tabs line up with the left of the
 * grid below and the search with its right.
 *
 * Below `lg` they stack and centre: at 375px a row of four pills and a
 * 260px field is two lines whatever the justification, and two centred lines
 * under a centred heading is the better of those.
 *
 * ── The tabs are the site's segmented pill ──────────────────────────
 * The same control as the home page's `TechnologySystems`: `#F2F2F2` track,
 * `rounded-full p-1.5 gap-0.5`, active `bg-carbon text-white`, inactive
 * `text-graphite` going orange on hover. Nothing here invents a fourth tab
 * style.
 *
 * ── Search is optional, and it is not a form ────────────────────────
 * Pass `query` and `onQuery` to get the field; leave them off and the row is
 * tabs alone, still left-aligned. It filters as you type, so there is no
 * submit and no `<form>` — an Enter key that reloads the page would lose the
 * tab you were on.
 *
 * `type="search"` gives the browser its own clear affordance. The focus ring
 * is an inset orange box-shadow rather than an outline, so it follows the
 * pill's radius instead of drawing a rectangle around it.
 */

const HAIR = "#E0E0E6";

export function FilterBar({
  tabs,
  active,
  onTab,
  label,
  query,
  onQuery,
  placeholder = "Search…",
}: {
  /** Includes the "all" option — the caller decides what it is called. */
  tabs: string[];
  active: string;
  onTab: (tab: string) => void;
  /** Names the tablist for a screen reader, e.g. "Filter case studies". */
  label: string;
  /** Pass both to show the search field; omit both to hide it. */
  query?: string;
  onQuery?: (q: string) => void;
  placeholder?: string;
}) {
  const searchable = query !== undefined && onQuery !== undefined;

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div
        role="tablist"
        aria-label={label}
        className="inline-flex flex-wrap justify-center lg:justify-start items-center self-center lg:self-auto bg-[#F2F2F2] rounded-full p-1.5 gap-0.5"
      >
        {tabs.map((t) => {
          const now = t === active;
          return (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={now}
              onClick={() => onTab(t)}
              className={
                "py-2.5 px-4 text-[13px] font-medium transition-all duration-200 rounded-full whitespace-nowrap " +
                (now
                  ? "bg-carbon text-white"
                  : "text-graphite hover:text-signal-orange")
              }
            >
              {t}
            </button>
          );
        })}
      </div>

      {searchable && (
        <div
          className="relative flex items-center w-full max-w-[300px] self-center lg:self-auto lg:w-[280px] bg-white rounded-full"
          style={{ boxShadow: `inset 0 0 0 1px ${HAIR}` }}
        >
          <Search
            className="absolute left-4 w-4 h-4 text-graphite/40 pointer-events-none"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
            className="w-full bg-transparent pl-11 pr-4 py-3 text-[13px] text-carbon placeholder:text-graphite/40 outline-none rounded-full focus:shadow-[inset_0_0_0_1.5px_#FF6A00]"
          />
        </div>
      )}
    </div>
  );
}
