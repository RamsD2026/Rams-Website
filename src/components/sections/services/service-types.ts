/**
 * The shape of a service page.
 *
 * There are six of them — rack inspection, structural verification, inventory
 * reconciliation, MHE productivity, safety and operational assessment, and
 * deployment and support — and they are one page rendered six times, not six
 * pages that resemble each other. Everything a service differs in lives here as
 * data; everything they share lives in `ServiceShell`.
 *
 * ── Why a section list rather than fixed slots ──────────────────────
 * The six source documents do not carry the same blocks. Rack inspection has
 * two delivery routes and a RAG scale; structural verification has load cases,
 * governing checks, field tests and a standards list; deployment has three
 * pillars and a plan ladder. A fixed set of named slots would have meant
 * inventing a block for the services that lack one, or dropping a block from
 * the services that have two.
 *
 * So a service carries an ordered `sections` array of tagged blocks, and the
 * shell renders whatever it finds. Adding a seventh service is a data change.
 *
 * ── Surfaces are computed, never typed ─────────────────────────────
 * No section names its own background. The shell alternates white and offWhite
 * down the page and forces the process band dark, which is the only way to keep
 * "no two adjacent sections share a surface" true when the sections themselves
 * vary per service. See `surfacesFor` in the shell.
 */

/** One labelled thing: a scope item, a finding class, a question. */
export type Item = {
  title: string;
  body: string;
  /**
   * A lucide icon, named rather than imported.
   *
   * This is a data file with no React in it, and a component reference would
   * make it one. The shell holds the name → component table and falls back to
   * a neutral glyph when a name is absent or unknown, so a typo costs an icon
   * and never a render.
   */
  icon?: string;
  /** Short mono chips under the body. Used by the lens and mode blocks. */
  tags?: string[];
  /** Traffic-light coding. Only the lens block reads it. */
  tone?: "red" | "amber" | "green" | "neutral";
};

export type Step = { n: string; title: string; body: string };

/** The header every block opens with, in `SectionHeader`'s own vocabulary. */
type Head = {
  eyebrow: string;
  top: string;
  bottom?: string;
  body?: string;
  /**
   * The source's own caveat, set in mono caps under the block. These are the
   * lines that keep a service page describing what RAMS *can* do rather than
   * promising what it *will* do, so they are carried verbatim and never
   * tightened.
   */
  note?: string;
};

export type ServiceSection =
  /** The problem, as numbered statements. Opens the page's argument. */
  | ({ kind: "problem"; items: Item[] } & Head)
  /** A plain grid of labelled items — scope, loads, tests, standards. */
  | ({ kind: "grid"; items: Item[]; cols?: 2 | 3 | 4 } & Head)
  /** Two or three wide cards: delivery routes, approaches, plans. */
  | ({ kind: "modes"; items: Item[] } & Head)
  /** The numbered sequence. Always the dark band. */
  | ({ kind: "process"; steps: Step[] } & Head)
  /** Tone-coded classes: RAG, variance types, time categories. */
  | ({ kind: "lens"; items: Item[] } & Head)
  /** The output pack: a numbered register beside a single callout. */
  | ({ kind: "deliverables"; items: Item[]; callout: Item } & Head)
  /** Questions and answers. */
  | ({ kind: "faq"; items: Item[] } & Head);

export type Service = {
  slug: string;
  /** The source's own short mark, e.g. "RI". Used in the hero and the rail. */
  code: string;
  /** Menu label. */
  name: string;
  /** Hero chip. */
  eyebrow: string;
  /** Two heading lines. The second is dimmed. */
  h1: [string, string];
  intro: string;
  /** Three mono chips under the intro. */
  chips: string[];
  /** The four assurances the source's hero panel carries. */
  assurances: Item[];
  /** Primary call to action label. The href is always the contact page. */
  action: string;
  sections: ServiceSection[];
  cta: {
    top: string;
    bottom: string;
    body: string;
    /**
     * The close's secondary button. Defaults to "All services" at /services.
     *
     * The shell is also what renders the IROS platform page, which has no
     * business sending a reader to the services index — so the destination is
     * data rather than a constant.
     */
    secondary?: { label: string; href: string };
  };
  /** Meta description. */
  meta: string;
};
