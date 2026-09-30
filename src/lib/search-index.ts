import { NAV_CONFIG } from "./navigation";

/**
 * What site search searches.
 *
 * ── It is derived, not written ──────────────────────────────────────
 * The index is built from `NAV_CONFIG` at module load: every menu link is
 * already a page with a label and a one-line description, which is exactly
 * what a result row needs. A hand-kept list would be a second copy of the
 * navigation and would rot the first time a page moved.
 *
 * `EXTRA` is the short tail of pages that exist but are not in a menu —
 * contact, the privacy policy, sign-in, the calculator. Add to it when a
 * route is worth finding and has no home in the nav.
 */

export type SearchEntry = {
  label: string;
  href: string;
  description?: string;
  /** The menu it lives under — shown as the row's tag. */
  section: string;
  /** The group inside that menu, where there is one. */
  group?: string;
};

const EXTRA: SearchEntry[] = [
  {
    label: "Contact RAMS",
    href: "/company/contact",
    description: "Start a conversation with the product, engineering or support team.",
    section: "Company",
  },
  {
    label: "ROI calculator",
    href: "/roi-calculator",
    description: "Model the return on a RAMS deployment across your estate.",
    section: "Tools",
  },
  {
    label: "Platform sign-in",
    href: "/platform/login",
    description: "Sign in to your RAMS instance.",
    section: "Platform",
  },
  {
    label: "Privacy policy",
    href: "/legal/privacy",
    description: "How RAMS handles personal information.",
    section: "Legal",
  },
  {
    label: "Careers",
    href: "/company/careers",
    description: "Roles at RAMS Digital.",
    section: "Company",
  },
];

function build(): SearchEntry[] {
  const seen = new Set<string>();
  const out: SearchEntry[] = [];

  const push = (e: SearchEntry) => {
    if (seen.has(e.href)) return;
    seen.add(e.href);
    out.push(e);
  };

  for (const item of NAV_CONFIG) {
    for (const group of item.groups) {
      for (const link of group.links) {
        push({
          label: link.label,
          href: link.href,
          description: link.description,
          section: item.label,
          group: group.title,
        });
      }
    }
    // The menu's own landing page, after its children: someone searching
    // "platform" wants the products first and the index page second.
    push({
      label: `${item.label} overview`,
      href: item.href,
      section: item.label,
    });
  }

  for (const e of EXTRA) push(e);
  return out;
}

export const SEARCH_INDEX: SearchEntry[] = build();

/** Shown before anyone types — the pages people actually arrive looking for. */
export const POPULAR_HREFS = [
  "/platform/irds",
  "/platform/digital-twin",
  "/solutions/rack-safety-intelligence",
  "/resources/case-studies",
  "/roi-calculator",
  "/company/contact",
];

export const POPULAR: SearchEntry[] = POPULAR_HREFS.map((href) =>
  SEARCH_INDEX.find((e) => e.href === href),
).filter(Boolean) as SearchEntry[];

/**
 * Ranked match.
 *
 * Label matches beat description matches, and a label that *starts* with the
 * query beats one that merely contains it — typing "rack" should put "Rack
 * safety" above a page whose description happens to mention racks.
 */
export function searchSite(query: string, limit = 12): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored: { entry: SearchEntry; score: number }[] = [];

  for (const entry of SEARCH_INDEX) {
    const label = entry.label.toLowerCase();
    let score = 0;

    if (label === q) score = 100;
    else if (label.startsWith(q)) score = 70;
    else if (label.includes(q)) score = 50;

    if (!score && entry.group?.toLowerCase().includes(q)) score = 30;
    if (!score && entry.section.toLowerCase().includes(q)) score = 25;
    if (!score && entry.description?.toLowerCase().includes(q)) score = 20;
    if (!score && entry.href.toLowerCase().includes(q)) score = 10;

    if (score) scored.push({ entry, score });
  }

  return scored
    .sort((a, b) => b.score - a.score || a.entry.label.localeCompare(b.entry.label))
    .slice(0, limit)
    .map((s) => s.entry);
}
