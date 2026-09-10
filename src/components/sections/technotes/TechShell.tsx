"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Search } from "lucide-react";

export type NavGroup = { title: string; items: { id: string; label: string }[] };

/**
 * The documentation shell: rail, column, rail.
 *
 * Shared by `/resources/technical-notes` and `/resources/compliance-guides`.
 * It took its nav straight from `tech-data` while it had one caller; the
 * second page arrived and it takes `nav`, `toc` and the right rail's card as
 * props instead. A shell that imports one page's data is not a shell.
 *
 * Three columns at `xl` — a filterable section list on the left, the notes in
 * the middle, "On this page" and a support card on the right. Both rails are
 * `sticky` under the fixed header and scroll independently; the middle column
 * is the only thing that moves with the page.
 *
 * This is the one page on the site that is not a stack of full-width
 * sections, and it should be: everything else here is marketing read top to
 * bottom, and this is reference material somebody arrives at from a search
 * result, halfway down, looking for one heading.
 *
 * ── It is dark, and that is not the mistake from before ─────────────
 * The `LatestGrid` tiles were dark boxes dropped into light pages. This is a
 * whole page, and documentation is the one context where dark is the
 * convention rather than a decision — both references the design came from
 * are dark, and so is every developer tool a reader of this page already has
 * open. The site's `SURFACE.ink` is the ground, so it is the site's own black
 * rather than a new one.
 *
 * ── Scroll-spy, and why it is an observer ───────────────────────────
 * `IntersectionObserver` with a `rootMargin` that pulls the top edge down
 * below the fixed header and the bottom edge up to a band near the top of the
 * viewport. The section whose heading is inside that band is the active one.
 *
 * Not a scroll listener measuring `getBoundingClientRect` on every frame:
 * eleven sections × a scroll event is layout thrash on the one page most
 * likely to be read on a laptop with a dozen other tabs open.
 *
 * A section shorter than the band can leave nothing intersecting, so the last
 * match is held rather than cleared — an "On this page" list with nothing
 * highlighted reads as broken.
 *
 * ── The filter is over headings, not content ────────────────────────
 * It matches section labels only, which is what the reference's "Filter 171
 * components" box does. A full-text search over the page would need an index
 * this page has no build step for, and a box that silently searches less than
 * it appears to is worse than one whose scope is obvious from its
 * placeholder.
 *
 * The count in that placeholder is the nav's own length rather than a number
 * written beside it, so a page that adds a section does not have to remember
 * to change it.
 *
 * Groups whose items all filter out are dropped with their heading, rather
 * than leaving a title over nothing.
 */

const HAIR = "rgba(255,255,255,0.08)";

/** Height of the fixed header, plus room for the heading to clear it. */
const HEADER = 96;

export function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  const last = useRef(active);

  useEffect(() => {
    const seen = new Map<string, boolean>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.isIntersecting);
        const hit = ids.find((id) => seen.get(id));
        /* Hold the last match rather than clearing: a section shorter than
           the band leaves nothing intersecting, and an empty highlight reads
           as a broken control. */
        if (hit) {
          last.current = hit;
          setActive(hit);
        }
      },
      { rootMargin: `-${HEADER}px 0px -70% 0px`, threshold: 0 },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [ids]);

  return active;
}

/* ── the left rail ────────────────────────────────────────────────── */

export function TechSidebar({
  nav,
  active,
  label = "Sections",
}: {
  nav: NavGroup[];
  active: string;
  /** Names the rail for a screen reader. */
  label?: string;
}) {
  const [q, setQ] = useState("");

  const count = useMemo(
    () => nav.reduce((n, g) => n + g.items.length, 0),
    [nav],
  );

  const groups = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return nav;
    return nav.map((g) => ({
      ...g,
      items: g.items.filter((i) => i.label.toLowerCase().includes(term)),
    })).filter((g) => g.items.length > 0);
  }, [nav, q]);

  return (
    <nav
      aria-label={label}
      className="hidden xl:block sticky self-start"
      style={{ top: HEADER, maxHeight: `calc(100vh - ${HEADER}px)` }}
    >
      <div className="overflow-y-auto pr-4 pb-16" style={{ maxHeight: `calc(100vh - ${HEADER}px)` }}>
        <div
          className="relative flex items-center w-full rounded-lg mb-7"
          style={{
            background: "rgba(255,255,255,0.04)",
            boxShadow: `inset 0 0 0 1px ${HAIR}`,
          }}
        >
          <Search
            className="absolute left-3 w-3.5 h-3.5 text-white/30 pointer-events-none"
            aria-hidden
          />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Filter ${count} sections…`}
            aria-label="Filter sections"
            className="w-full bg-transparent pl-9 pr-3 py-2.5 text-[12.5px] text-white placeholder:text-white/30 outline-none rounded-lg focus:shadow-[inset_0_0_0_1.5px_#FF6A00]"
          />
        </div>

        {groups.length === 0 && (
          <p className="text-[12.5px] text-white/35 leading-[1.6]">
            No section matches that.
          </p>
        )}

        {groups.map((g) => (
          <div key={g.title} className="mb-7">
            <p className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-white/30 mb-3 px-3">
              {g.title}
            </p>

            <ul className="space-y-0.5">
              {g.items.map((i) => {
                const on = i.id === active;
                return (
                  <li key={i.id}>
                    <a
                      href={`#${i.id}`}
                      aria-current={on ? "true" : undefined}
                      className={
                        "block px-3 py-2 rounded-lg text-[13.5px] font-medium transition-colors duration-200 " +
                        (on
                          ? "text-white"
                          : "text-white/45 hover:text-white/80")
                      }
                      style={
                        on
                          ? { background: "rgba(255,255,255,0.07)" }
                          : undefined
                      }
                    >
                      {i.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}

/* ── the right rail ───────────────────────────────────────────────── */

export function TechToc({
  toc,
  active,
  children,
}: {
  toc: { id: string; label: string }[];
  active: string;
  /** The card under the list. Each page brings its own. */
  children?: React.ReactNode;
}) {
  return (
    <aside
      className="hidden lg:block sticky self-start"
      style={{ top: HEADER, maxHeight: `calc(100vh - ${HEADER}px)` }}
    >
      <div
        className="overflow-y-auto pb-16"
        style={{ maxHeight: `calc(100vh - ${HEADER}px)` }}
      >
        <p className="text-[12px] font-semibold text-white/70 mb-4">
          On this page
        </p>

        <ul className="space-y-2.5 mb-10">
          {toc.map((t) => {
            const on = t.id === active;
            return (
              <li key={t.id}>
                <a
                  href={`#${t.id}`}
                  aria-current={on ? "true" : undefined}
                  className={
                    "block text-[12.5px] leading-[1.45] transition-colors duration-200 " +
                    (on ? "text-signal-orange" : "text-white/40 hover:text-white/70")
                  }
                >
                  {t.label}
                </a>
              </li>
            );
          })}
        </ul>

        {children}
      </div>
    </aside>
  );
}

/* ── a code block ─────────────────────────────────────────────────── */

/**
 * Tabs, a copy button, and a label that says the content is a pattern.
 *
 * The copy state resets after 1.6s through a timeout the effect clears, so a
 * fast second press cannot leave a stuck tick — and the effect is keyed on
 * `copied` rather than firing inside the click handler, which is what makes
 * the unmount path safe.
 *
 * `navigator.clipboard` is undefined on an insecure origin, so the write is
 * guarded and the failure is silent: a copy button that throws into the
 * console on `http://` is worse than one that does nothing.
 */
export function CodeBlock({
  file,
  tabs,
  caption,
}: {
  file: string;
  tabs: { lang: string; code: string }[];
  caption?: string;
}) {
  const [at, setAt] = useState(0);
  const [copied, setCopied] = useState(false);
  const tab = tabs[Math.min(at, tabs.length - 1)];

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = () => {
    navigator.clipboard?.writeText(tab.code).then(
      () => setCopied(true),
      () => {},
    );
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "#0B0B0D", boxShadow: `inset 0 0 0 1px ${HAIR}` }}
    >
      <div
        className="flex items-center justify-between gap-4 px-4 py-2.5"
        style={{ borderBottom: `1px solid ${HAIR}` }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-[11px] font-mono text-white/35 truncate">
            {file}
          </span>
          <span
            className="shrink-0 text-[9px] font-mono font-bold tracking-[0.16em] uppercase text-signal-orange px-2 py-0.5"
            style={{ borderRadius: 999, background: "rgba(255,106,0,0.12)" }}
          >
            Illustrative
          </span>
        </div>

        <div className="flex items-center gap-1">
          {tabs.length > 1 &&
            tabs.map((t, i) => (
              <button
                key={t.lang}
                type="button"
                onClick={() => setAt(i)}
                aria-pressed={i === at}
                className={
                  "px-2.5 py-1 rounded-md text-[11.5px] font-medium transition-colors duration-200 " +
                  (i === at
                    ? "text-white bg-white/[0.08]"
                    : "text-white/40 hover:text-white/70")
                }
              >
                {t.lang}
              </button>
            ))}

          <button
            type="button"
            onClick={copy}
            aria-label="Copy code"
            className="ml-1 flex items-center justify-center w-7 h-7 rounded-md text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors duration-200"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-signal-orange" aria-hidden />
            ) : (
              <Copy className="w-3.5 h-3.5" aria-hidden />
            )}
          </button>
        </div>
      </div>

      <pre className="overflow-x-auto p-4 text-[12.5px] leading-[1.7] font-mono text-white/70">
        <code>{tab.code}</code>
      </pre>

      {caption && (
        <p
          className="px-4 py-2.5 text-[11px] text-white/30 leading-[1.5]"
          style={{ borderTop: `1px solid ${HAIR}` }}
        >
          {caption}
        </p>
      )}
    </div>
  );
}
