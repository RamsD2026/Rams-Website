"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { FilterBar } from "@/components/sections/FilterBar";
import { CASES, CATEGORIES, type CaseStudy } from "./case-data";
import { CaseModal } from "./CaseModal";

/**
 * 02 — The work.
 *
 * Six engagements, filtered by kind, each opening a panel.
 *
 * ── The card is the home page's `CustomerSuccess` story card ────────
 * Value for value: a 280px image on a 20px radius that scales to 1.05 over
 * 900ms on hover, then the text *under* it on the section's own ground — a
 * coloured lead-in, a mono eyebrow, a heading, a line, and "Read case study"
 * with an arrow that steps right.
 *
 * There is no box, no border and no shadow. That is the whole difference: a
 * card is a container the eye reads as one object, and six of them in a grid
 * compete with each other. Six images with type under them read as one set,
 * which is what a page of case studies is.
 *
 * ── What it replaced, twice ─────────────────────────────────────────
 * First a white card holding a chip, a sector, a heading, a paragraph, a rule
 * and three ticked bullets — a page of documents. Then the home page's
 * *industry* card, full-bleed with the copy over the photograph, which is the
 * right object for eight industries and the wrong one here: a case study's
 * title is a sentence, and a sentence set over a photograph at 21px is
 * harder to read than the same sentence on white.
 *
 * The situation and the three outcomes stay in `CaseModal` either way.
 *
 * ── The kind takes the place of the company name ────────────────────
 * `CustomerSuccess` leads each card with the customer's name in the
 * customer's own colour. This page names no customer — that is its whole
 * position — so the kind of engagement leads instead, in signal orange. The
 * sector then sits in the eyebrow where that card puts the location.
 *
 * ── The photography ─────────────────────────────────────────────────
 * One per engagement, and each is the engagement rather than a warehouse that
 * happens to be nearby: a deformed upright being measured, a scanner at a
 * blank label, an estate from the mezzanine, a forklift turning, a pallet
 * truck crossing a staging area, a frosted cold-store aisle.
 *
 * Generated rather than taken from a stock library, and every prompt asked
 * for no text, no signage and no logos, so nothing in frame is a mark that
 * belongs to somebody — and no image shows an identifiable customer site,
 * which matters on a page whose whole position is that client details are
 * withheld. Exported at 800×564, 2× the 397×280 slot, cropped on
 * `position: "attention"` because the sources are portrait and a centre crop
 * would take a band of empty aisle out of some of them.
 *
 * ── Three to a page ─────────────────────────────────────────────────
 * `PER_PAGE` is 3, which is one full row at `lg` and two pages of the six.
 * The pager renders only when there is more than one page, so a filter that
 * narrows to a single row does not leave a control with one button in it.
 *
 * The current page is clamped on read rather than corrected in an effect:
 * choosing a filter with fewer results while on page two would otherwise
 * render an empty grid for a frame and then fix itself. `filter` resets the
 * page as well, and the clamp is the belt to that brace.
 *
 * ── The bar is shared, and it searches ──────────────────────────────
 * `FilterBar` — tabs left, search right — is the same control the videos
 * and the newsroom carry. The tabs used to be centred here with no search
 * beside them; three pages drawing one bar three ways is how a design
 * system stops being one.
 *
 * The search matches the title, the situation, the sector, the kind and the
 * three outcomes. Outcomes are in it because "collapse", "insurer" and
 * "downtime" are words somebody would type and none of them is in a title.
 *
 * Both controls reset the page, and the clamp below is still the belt to
 * that brace: typing a term that narrows six results to two while on page
 * two would otherwise render an empty grid.
 *
 * ── Filtering, not paging ───────────────────────────────────────────
 * The grid re-renders with `AnimatePresence` and each card keyed by its id,
 * so a card that survives a filter change stays put and only the ones
 * entering and leaving animate. Keying on the index instead would animate
 * every card on every press, which reads as the whole grid flashing.
 *
 * ── The chips come from the cards ───────────────────────────────────
 * `CATEGORIES` is derived in `case-data.ts` rather than typed out. The source
 * document lists five chips against six cards, which leaves two kinds
 * reachable only through "All" — a filter bar that hides part of its own set.
 */

function Card({
  study,
  index,
  onOpen,
}: {
  study: CaseStudy;
  index: number;
  onOpen: (s: CaseStudy) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.05, ease: EASE }}
      onClick={() => onOpen(study)}
      className="group block cursor-pointer"
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ height: 280, borderRadius: 20, background: "#F0F0F2" }}
      >
        <Image
          src={study.img}
          alt={study.alt}
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 397px"
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
      </div>

      <div className="mt-7 lg:mt-8">
        <div
          className="text-[18px] font-bold leading-none mb-5 text-signal-orange"
          style={{ letterSpacing: "-0.02em" }}
        >
          {study.kind}
        </div>

        <p className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-graphite/55">
          {study.sector}
        </p>

        <h3 className="mt-4 text-[20px] lg:text-[22px] font-bold text-carbon leading-[1.25]">
          {study.title}
        </h3>

        <p className="mt-4 text-[14px] text-graphite/65 leading-[1.65]">
          {study.problem}
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(study);
          }}
          className="mt-7 inline-flex items-center gap-1.5 text-[13px] font-semibold text-carbon group-hover:text-signal-orange transition-colors cursor-pointer"
        >
          Read case study
          <ArrowRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden
          />
        </button>
      </div>
    </motion.div>
  );
}

/** Three to a page — one full row at `lg`, and two pages of the six. */
const PER_PAGE = 3;

export function CaseWork() {
  const [at, setAt] = useState("All");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<CaseStudy | null>(null);

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return CASES.filter((c) => {
      if (at !== "All" && c.kind !== at) return false;
      if (!term) return true;
      return (
        c.title.toLowerCase().includes(term) ||
        c.problem.toLowerCase().includes(term) ||
        c.sector.toLowerCase().includes(term) ||
        c.kind.toLowerCase().includes(term) ||
        c.outcomes.some((o) => o.toLowerCase().includes(term))
      );
    });
  }, [at, q]);

  const pages = Math.max(1, Math.ceil(shown.length / PER_PAGE));

  /* Clamped on read rather than in an effect: choosing a filter with fewer
     results while on page two would otherwise render an empty grid for one
     frame and then correct itself. `filter` resets the page with the filter,
     and this is the belt to that brace. */
  const current = Math.min(page, pages);
  const visible = shown.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const filter = (c: string) => {
    setAt(c);
    setPage(1);
  };

  const search = (term: string) => {
    setQ(term);
    setPage(1);
  };

  return (
    <Section surface="white" id="work">
      <SectionHeader
        eyebrow="The work"
        top="Case studies"
        bottom="Across the estate."
        size="compact"
        width="wide"
        body="Filter by the kind of engagement. Every one runs on the same digital twin."
        className="!mb-10 sm:!mb-12"
      />

      <FilterBar
        tabs={["All", ...CATEGORIES]}
        active={at}
        onTab={filter}
        label="Filter case studies"
        query={q}
        onQuery={search}
        placeholder="Search case studies…"
      />

      <div className="mt-12 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14 lg:gap-y-16 items-start">
        <AnimatePresence mode="popLayout">
          {visible.map((c, i) => (
            <Card key={c.id} study={c} index={i} onOpen={setOpen} />
          ))}
        </AnimatePresence>
      </div>

      {shown.length === 0 && (
        <p className="text-center text-[14.5px] leading-[1.7] text-graphite/55 py-16">
          No case studies match that search. Try another kind or keyword.
        </p>
      )}

      {/* Pagination. It renders only when there is more than one page, so a
          filter that narrows to a single row does not leave a control with
          one button in it — a pager that cannot page is furniture.

          Numbers on the same #F2F2F2 track as the filter above, and no
          chevrons: two controls on one section should not speak two
          languages, and at two pages an arrow says less than the number it
          would move to. */}
      {pages > 1 && (
        <nav
          className="mt-14 flex justify-center"
          aria-label="Case study pages"
        >
          <div className="inline-flex items-center bg-[#F2F2F2] rounded-full p-1.5 gap-0.5">
            {Array.from({ length: pages }).map((_, i) => {
              const n = i + 1;
              const now = n === current;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  aria-current={now ? "page" : undefined}
                  aria-label={`Page ${n} of ${pages}`}
                  className={
                    "w-10 h-10 text-[13px] font-medium tabular-nums transition-all duration-200 rounded-full " +
                    (now
                      ? "bg-carbon text-white"
                      : "text-graphite hover:text-signal-orange")
                  }
                >
                  {n}
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* The source document's own note, and what makes six unnamed case
          studies honest rather than vague. */}
      <p className="mt-14 text-center text-[12.5px] leading-[1.65] text-graphite/45 max-w-[820px] mx-auto">
        Case studies are representative of real engagements across 200+ sites;
        client details are withheld for confidentiality. Named references
        available under NDA.
      </p>

      <AnimatePresence>
        {open && <CaseModal study={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </Section>
  );
}
