"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CornerDownLeft, Search, X } from "lucide-react";
import { POPULAR, searchSite, type SearchEntry } from "@/lib/search-index";
import { SearchTakeover } from "@/components/layout/SearchTakeover";
import { useSearchVersion } from "@/components/layout/search-version";
import { EASE } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Site search.
 *
 * The magnifier in the navbar had no behaviour at all — it was an icon. This
 * is what it opens.
 *
 * ── The shape is HubSpot's ──────────────────────────────────────────
 * A panel drops from under the header across the full width, the page behind
 * it dims, and the whole thing is one oversized input with results beneath.
 * Not a modal box floating in the middle, and not a field that expands inside
 * the bar: a search that takes over the top of the page tells you the site is
 * now listening, and leaves room for results without covering the page.
 *
 * ── It answers before it is asked ───────────────────────────────────
 * Opening it shows the six pages people arrive looking for. An empty panel
 * makes someone invent a query; a panel with the popular pages often saves
 * them typing at all.
 *
 * ── What it searches ────────────────────────────────────────────────
 * `SEARCH_INDEX`, derived from the navigation — every menu link with its
 * one-line description. Ranking and the index both live in
 * `src/lib/search-index.ts`.
 *
 * ── Keyboard ────────────────────────────────────────────────────────
 * ⌘K / Ctrl-K opens from anywhere, Escape closes, ↑ ↓ move through results
 * and Enter opens the highlighted one. The highlight resets to the first row
 * on every keystroke, so Enter after typing always opens the best match.
 */

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [version, setVersion] = useSearchVersion();

  return (
    <AnimatePresence>
      {open &&
        (version === "v2" ? (
          <SearchTakeover
            key="v2"
            onClose={onClose}
            onSwitchVersion={() => setVersion("v1")}
          />
        ) : (
          <SearchPanel key="v1" onClose={onClose} />
        ))}
    </AnimatePresence>
  );
}

/**
 * The panel only exists while search is open, so the query and the highlight
 * start empty by virtue of mounting — no effect resets them when it opens.
 */
function SearchPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results = useMemo(() => searchSite(query), [query]);
  const rows: SearchEntry[] = query.trim() ? results : POPULAR;

  useEffect(() => {
    // The panel animates in; focusing on the next frame avoids the browser
    // scrolling the page to an element that is still off its final position.
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, []);

  /* Any click outside the panel closes it — the dimmed page did that
     already, but the header sits above that scrim, so clicking a menu, the
     logo or the announcement bar left search hanging open behind whatever
     the click opened.

     The magnifier is the one exception: it is a toggle, and closing here
     first would let its own handler reopen the panel it just closed. */
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (panelRef.current?.contains(target ?? null)) return;
      if (target?.closest('button[aria-label="Search this site"]')) return;
      onClose();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [onClose]);

  const go = (entry: SearchEntry) => {
    onClose();
    router.push(entry.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => (rows.length ? (c + 1) % rows.length : 0));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => (rows.length ? (c - 1 + rows.length) % rows.length : 0));
      return;
    }
    if (e.key === "Enter" && rows[cursor]) {
      e.preventDefault();
      go(rows[cursor]);
    }
  };

  return (
    <>
          {/* The page behind, dimmed — the same weight, and the same
              `pointer-events-none`, as the mega menu's scrim.

              It used to take the clicks itself. Because it covers the header
              too, that swallowed every click on the nav and the announcement
              bar, and worse: clicking the magnifier removed the scrim on
              pointerdown, so the click that followed landed on the button and
              reopened the panel it had just closed. Closing is the outside-
              click effect's job alone now; this only dims. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-carbon/20 z-40 pointer-events-none"
            aria-hidden
          />

          {/* Anchored under the header, not over it: `absolute top-full`
              inside the navbar's own relative box, exactly where a mega menu
              opens. The announcement bar and the nav stay visible and
              usable — search is another panel the header opens, not a
              different screen. */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.24, ease: EASE }}
            ref={panelRef}
            className="absolute top-full left-0 right-0 z-50 bg-white border-t border-steel shadow-[0_16px_48px_-8px_rgba(14,14,15,0.12)]"
            role="dialog"
            aria-modal="false"
            aria-label="Search this site"
            onKeyDown={onKeyDown}
          >
            {/* ── the input ─────────────────────────────── */}
            <div className="rams-container">
              <div className="max-w-[820px] mx-auto flex items-center gap-3 py-5">
                {/* A field rather than a bare line of oversized type. At 22px
                    the placeholder read as a heading — it announced itself
                    louder than the results underneath it. 15/16px inside a
                    tinted, rounded field is the shape a search box has
                    everywhere else, and the whole field lights up on focus
                    rather than only the caret. */}
                <div className="flex-1 min-w-0 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#F6F6F8] border border-[#E8E8ED] transition-colors duration-200 focus-within:bg-white focus-within:border-signal-orange/40">
                  <Search
                    className="w-[18px] h-[18px] shrink-0 text-signal-orange"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setCursor(0);
                    }}
                    placeholder="Search products, solutions, services…"
                    aria-label="Search this site"
                    className="flex-1 min-w-0 bg-transparent text-[15px] sm:text-[16px] text-carbon outline-none placeholder:text-graphite/40"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setCursor(0);
                        inputRef.current?.focus();
                      }}
                      aria-label="Clear search"
                      className="shrink-0 text-[11px] font-mono font-semibold tracking-[0.14em] uppercase text-graphite/40 hover:text-carbon transition-colors duration-150"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {/* A close control rather than an `Esc` chip: the chip named a
                    key, which tells a mouse user what to do with a keyboard
                    and gives them nothing to click. Escape still closes the
                    panel — that is in `onKeyDown` — it is simply no longer
                    the only way out. */}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close search"
                  className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-graphite/50 transition-colors duration-200 hover:bg-[#F5F5F7] hover:text-carbon outline-none focus-visible:ring-2 focus-visible:ring-signal-orange/30"
                >
                  <X className="w-5 h-5" aria-hidden />
                </button>
              </div>
            </div>

            <div className="h-px bg-[#E8E8ED]" />

            {/* ── results ───────────────────────────────── */}
            <div className="rams-container">
              <div className="max-w-[820px] mx-auto py-5 max-h-[min(58vh,520px)] overflow-y-auto">
                <p className="mb-3 text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/40">
                  {query.trim()
                    ? `${results.length} ${results.length === 1 ? "result" : "results"}`
                    : "Popular"}
                </p>

                {rows.length === 0 && (
                  <div className="py-6">
                    <p className="text-[15px] text-carbon">
                      Nothing matches “{query.trim()}”.
                    </p>
                    <p className="mt-2 text-[14px] leading-[1.6] text-graphite/60">
                      Try a product name — IRDS, Digital Twin, MEPS — or{" "}
                      <button
                        type="button"
                        onClick={() =>
                          go({
                            label: "Contact",
                            href: "/company/contact",
                            section: "Company",
                          })
                        }
                        className="font-semibold text-signal-orange hover:underline underline-offset-4"
                      >
                        ask us directly
                      </button>
                      .
                    </p>
                  </div>
                )}

                <ul>
                  {rows.map((entry, i) => {
                    const active = i === cursor;
                    return (
                      <li key={entry.href}>
                        <button
                          type="button"
                          onMouseEnter={() => setCursor(i)}
                          onClick={() => go(entry)}
                          className={
                            "group w-full flex items-center gap-4 px-3 py-3 rounded-lg text-left transition-colors duration-150 " +
                            (active ? "bg-[#F5F5F7]" : "hover:bg-[#FAFAFA]")
                          }
                        >
                          <span className="flex-1 min-w-0">
                            <span className="flex items-baseline gap-2.5">
                              {/* Orange on the row under the pointer, as the
                                  takeover does and as every other hover on
                                  this site does — the grey fill alone made
                                  the highlighted row read as disabled rather
                                  than as the one Enter will open. */}
                              <span
                                className={
                                  "text-[15px] font-semibold tracking-[-0.01em] truncate transition-colors duration-150 " +
                                  (active ? "text-signal-orange" : "text-carbon")
                                }
                              >
                                {entry.label}
                              </span>
                              <span className="shrink-0 text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-graphite/35">
                                {entry.section}
                              </span>
                            </span>
                            {entry.description && (
                              <span className="mt-0.5 block text-[13px] leading-[1.5] text-graphite/55 truncate">
                                {entry.description}
                              </span>
                            )}
                          </span>

                          {active ? (
                            <CornerDownLeft
                              className="w-4 h-4 shrink-0 text-signal-orange"
                              aria-hidden
                            />
                          ) : (
                            <ArrowRight
                              className="w-4 h-4 shrink-0 text-graphite/25"
                              aria-hidden
                            />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="h-px bg-[#E8E8ED]" />
            <div className="rams-container">
              <div className="max-w-[820px] mx-auto py-3 flex items-center gap-5 text-[11px] text-graphite/40">
                <span className="hidden sm:inline">↑ ↓ to move</span>
                <span className="hidden sm:inline">↵ to open</span>
                <span className="sm:hidden">Tap a result to open</span>
                {/* The link that offered the full-screen design sat here
                    while the two were being compared. v1 is the chosen
                    design, so visitors are no longer shown a door to the
                    other one. `SearchTakeover` and `useSearchVersion` stay in
                    the tree: setting `rams-search-version` to `v2` in local
                    storage still brings it up, which is all that is needed to
                    look at it again. */}
                <span className="ml-auto font-mono tracking-[0.14em] uppercase">
                  RAMS Digital
                </span>
              </div>
            </div>
          </motion.div>
    </>
  );
}
