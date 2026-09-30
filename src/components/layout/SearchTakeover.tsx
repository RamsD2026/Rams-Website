"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { POPULAR, searchSite, type SearchEntry } from "@/lib/search-index";
import { EASE, SURFACE } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Search, version two — the full-screen takeover.
 *
 * ── How it differs from v1, and why ─────────────────────────────────
 * v1 is a white panel that drops from under the header: quick, polite, and
 * the page stays visible behind it. This is the opposite argument. The whole
 * screen becomes the search, on the site's own dark ground, and the query is
 * set at headline size — 32 to 56px, the scale the heroes use.
 *
 * That buys two things a drop panel cannot have. The results get room to
 * breathe in two columns instead of a scrolling strip, so twelve of them are
 * readable at once rather than four. And the moment reads as a mode: you are
 * searching, the marketing page is gone, nothing else is competing for
 * attention. The cost is that it is heavier — it replaces the page rather
 * than annotating it — which is exactly the trade to judge between them.
 *
 * ── Type as the interface ───────────────────────────────────────────
 * No input chrome: no box, no border, just the caret and a hairline under
 * the line, which brightens to orange while the field has focus. The
 * placeholder is a question rather than a label, because at this size a
 * label reads as a heading and a question reads as an invitation.
 *
 * Everything else matches v1 exactly — the same index, the same ranking, the
 * same keys (↑ ↓ Enter Escape), the same popular pages before a query. Only
 * the surface changed, which is what makes the two comparable.
 */

export function SearchTakeover({
  onClose,
  onSwitchVersion,
}: {
  onClose: () => void;
  onSwitchVersion: () => void;
}) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => searchSite(query, 12), [query]);
  const rows: SearchEntry[] = query.trim() ? results : POPULAR;

  useEffect(() => {
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = overflow;
    };
  }, []);

  const go = (entry: SearchEntry) => {
    onClose();
    router.push(entry.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => (rows.length ? (c + 1) % rows.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => (rows.length ? (c - 1 + rows.length) % rows.length : 0));
    } else if (e.key === "Enter" && rows[cursor]) {
      e.preventDefault();
      go(rows[cursor]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: EASE }}
      onKeyDown={onKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Search this site"
      className="fixed inset-0 z-[60] overflow-y-auto text-white"
      style={{ background: SURFACE.darkTop }}
    >
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-[560px]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(255,106,0,0.18), transparent 70%)",
        }}
      />

      <div className="relative rams-container min-h-full flex flex-col">
        {/* ── bar ───────────────────────────────────────── */}
        <div className="flex items-center justify-between py-6">
          <span className="text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange">
            Search RAMS
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-white/12 text-white/60 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <X className="w-5 h-5" aria-hidden />
          </button>
        </div>

        {/* ── the query ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
          className="pt-6 sm:pt-10"
        >
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            placeholder="What are you looking for?"
            aria-label="Search this site"
            className="peer w-full bg-transparent text-[32px] sm:text-[44px] lg:text-[56px] font-bold tracking-[-0.04em] leading-[1.1] text-white caret-signal-orange outline-none placeholder:text-white/25"
          />
          <div className="mt-4 h-px bg-white/12 transition-colors duration-300 peer-focus:bg-signal-orange/60" />
          <p className="mt-4 text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-white/30">
            {query.trim()
              ? `${results.length} ${results.length === 1 ? "result" : "results"}`
              : "Popular right now"}
          </p>
        </motion.div>

        {/* ── results, two columns ──────────────────────── */}
        <div className="flex-1 py-8">
          {rows.length === 0 ? (
            <div className="max-w-[620px]">
              <p className="text-[20px] font-semibold tracking-[-0.02em] text-white">
                Nothing matches “{query.trim()}”.
              </p>
              <p className="mt-3 text-[15px] leading-[1.6] text-white/50">
                Try a product name — IRDS, Digital Twin, MEPS, IBIS — or{" "}
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
                  tell us what you need
                </button>
                .
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-1">
              {rows.map((entry, i) => {
                const active = i === cursor;
                return (
                  <li key={entry.href}>
                    <button
                      type="button"
                      onMouseEnter={() => setCursor(i)}
                      onClick={() => go(entry)}
                      className="group w-full text-left py-3.5 flex items-start gap-4 border-b border-white/[0.06] outline-none"
                    >
                      <span
                        aria-hidden
                        className={
                          "mt-2 h-px shrink-0 transition-all duration-300 " +
                          (active
                            ? "w-8 bg-signal-orange"
                            : "w-4 bg-white/20 group-hover:w-6")
                        }
                      />
                      <span className="flex-1 min-w-0">
                        <span className="flex items-baseline gap-3">
                          <span
                            className={
                              "text-[17px] sm:text-[19px] font-semibold tracking-[-0.02em] truncate transition-colors duration-200 " +
                              (active ? "text-signal-orange" : "text-white")
                            }
                          >
                            {entry.label}
                          </span>
                          <span className="shrink-0 text-[9.5px] font-mono font-bold tracking-[0.18em] uppercase text-white/30">
                            {entry.section}
                          </span>
                        </span>
                        {entry.description && (
                          <span className="mt-1 block text-[13.5px] leading-[1.55] text-white/45 truncate">
                            {entry.description}
                          </span>
                        )}
                      </span>
                      <ArrowUpRight
                        className={
                          "w-4 h-4 mt-1 shrink-0 transition-all duration-200 " +
                          (active
                            ? "text-signal-orange translate-x-0.5 -translate-y-0.5"
                            : "text-white/20")
                        }
                        aria-hidden
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* ── foot ──────────────────────────────────────── */}
        <div className="flex items-center gap-6 py-5 border-t border-white/[0.06] text-[11px] text-white/30">
          <span className="hidden sm:inline">↑ ↓ to move</span>
          <span className="hidden sm:inline">↵ to open</span>
          <span className="hidden sm:inline">Esc to close</span>
          <button
            type="button"
            onClick={onSwitchVersion}
            data-search-switch
            className="ml-auto font-mono tracking-[0.14em] uppercase text-white/40 hover:text-signal-orange transition-colors duration-200"
          >
            Use the panel design →
          </button>
        </div>
      </div>
    </motion.div>
  );
}
