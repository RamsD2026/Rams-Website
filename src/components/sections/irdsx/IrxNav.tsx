"use client";

import { useEffect, useState } from "react";

/**
 * 02 — The product nav.
 *
 * A sticky bar of anchors, so a reader who already knows what they came for
 * can jump straight into it. Platform pages that work all have one; a
 * fourteen-section page without one is a scroll.
 *
 * It highlights the section currently in view with an `IntersectionObserver`
 * rather than by measuring scroll offsets on every frame — offsets go wrong
 * the moment a section above changes height, and several on this page do.
 *
 * `top-16` clears the site header. The bar itself is the page's own chrome, so
 * it carries a hairline and a blur rather than a surface: it has to sit over
 * whichever section is passing under it, light or dark.
 */

const ITEMS: [string, string][] = [
  ["The story", "story"],
  ["Field app", "field"],
  ["Web console", "console"],
  ["How they connect", "link"],
  ["Result", "result"],
  ["Roles", "roles"],
  ["Why RAMS", "why-rams"],
];

export function IrxNav() {
  const [at, setAt] = useState<string>(ITEMS[0][1]);

  useEffect(() => {
    const els = ITEMS.map(([, id]) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!els.length) return;

    /* The band is the top third of the viewport: a section counts as "here"
       once its heading has arrived, not once it fills the screen. */
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit?.target.id) setAt(hit.target.id);
      },
      { rootMargin: "-12% 0px -70% 0px", threshold: 0 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div
      className="sticky top-16 z-30 w-full"
      style={{
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid #E8E8ED",
      }}
    >
      <div className="rams-container">
        <div className="flex items-center gap-1 overflow-x-auto py-2.5 -mx-1 px-1">
          {ITEMS.map(([label, id]) => {
            const on = at === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                aria-current={on ? "true" : undefined}
                className={
                  "shrink-0 px-3.5 py-2 rounded-full text-[12.5px] font-semibold transition-colors duration-250 " +
                  (on
                    ? "text-carbon"
                    : "text-graphite/50 hover:text-carbon hover:bg-black/[0.03]")
                }
                style={
                  on
                    ? {
                        background: "rgba(255,106,0,0.10)",
                        boxShadow: "inset 0 0 0 1px rgba(255,106,0,0.30)",
                      }
                    : undefined
                }
              >
                {label}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
