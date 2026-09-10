"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Search } from "lucide-react";
import { EASE } from "@/components/sections/rackiq/rackiq-shared";
import {
  LETTERS,
  SOURCES,
  TERMS,
  countOf,
  type Source,
  type Term,
} from "./glossary-data";

/**
 * The glossary itself: search, a source filter, an A–Z rail and 28 rows that
 * open in place.
 *
 * ── Three filters that compose, and one that clears them ────────────
 * Source, letter and search all narrow the same list at once, which is what
 * the source document's own controls do. The count above the rail is the
 * filtered length rather than 28, so it always describes what is on screen.
 *
 * A letter with nothing behind it is not rendered: `LETTERS` is derived from
 * the terms, so the rail is exactly the letters that have an entry. An A–Z of
 * mostly dead buttons is a control that lies about its own contents.
 *
 * ── Rows, not cards ─────────────────────────────────────────────────
 * Twenty-eight definitions in a card grid is a wall. These are hairline rows
 * that open to five labelled blocks — definition, why it matters, how it is
 * used, applicability, and what RAMS does with it — which is the shape the
 * source's own detail panel has.
 *
 * Only one is open at a time. Reading two definitions side by side is not
 * what this page is for, and an accordion that lets everything open turns
 * back into the wall it replaced.
 *
 * ── Applicability is never collapsed away ───────────────────────────
 * `scope` is the sentence that keeps each entry a reference rather than a
 * rule — "SEMA/HSE UK context", "verify local requirements" — so it renders
 * in its own bordered block rather than as one more paragraph. A reader
 * skimming an open row should not be able to miss the boundary while reading
 * the definition.
 */

const HAIR = "rgba(255,255,255,0.08)";

const TINT: Record<Source, string> = {
  sema: "#3E63DD",
  fem: "#6647F0",
  osha: "#E5484D",
  general: "#65A30D",
};

const LABEL: Record<Source, string> = {
  sema: "SEMA",
  fem: "FEM",
  osha: "OSHA",
  general: "General practice",
};

function Block({ label, children }: { label: string; children: string }) {
  return (
    <div>
      <p className="text-[9.5px] font-mono font-bold tracking-[0.18em] uppercase text-white/30">
        {label}
      </p>
      <p className="mt-2 text-[13.5px] leading-[1.7] text-white/55">
        {children}
      </p>
    </div>
  );
}

function Row({
  item,
  open,
  onToggle,
}: {
  item: Term;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{ borderBottom: `1px solid ${HAIR}` }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-5 text-left py-4 group"
      >
        <span className="flex items-center gap-3.5 min-w-0">
          <span
            aria-hidden
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: TINT[item.source] }}
          />
          <span
            className={
              "text-[14.5px] font-semibold tracking-[-0.01em] transition-colors duration-300 " +
              (open ? "text-white" : "text-white/75 group-hover:text-white")
            }
          >
            {item.term}
          </span>
        </span>

        <span className="flex items-center gap-4 shrink-0">
          <span
            className="hidden sm:inline text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase px-2 py-1"
            style={{
              borderRadius: 999,
              background: "rgba(255,255,255,0.06)",
              color: TINT[item.source],
            }}
          >
            {LABEL[item.source]}
          </span>

          <span aria-hidden className="relative w-3 h-3">
            <span
              className="absolute left-0 right-0 top-1/2 h-[1.5px] -translate-y-1/2 rounded-full"
              style={{ background: "#FF6A00" }}
            />
            <motion.span
              className="absolute top-0 bottom-0 left-1/2 w-[1.5px] -translate-x-1/2 rounded-full origin-center"
              style={{ background: "#FF6A00" }}
              initial={false}
              animate={{ scaleY: open ? 0 : 1 }}
              transition={{ duration: 0.3, ease: EASE }}
            />
          </span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-7 pl-[22px] grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              <Block label="Definition">{item.definition}</Block>
              <Block label="Why it matters">{item.why}</Block>
              <Block label="Operational use">{item.use}</Block>
              <Block label="RAMS context">{item.rams}</Block>

              {/* The boundary gets its own frame. It is the sentence that
                  keeps the entry a reference rather than a rule, and a
                  reader skimming the definition must not be able to miss
                  it. */}
              <div
                className="sm:col-span-2 p-4 rounded-lg"
                style={{
                  background: "rgba(255,106,0,0.06)",
                  boxShadow: "inset 0 0 0 1px rgba(255,106,0,0.20)",
                }}
              >
                <p className="text-[9.5px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
                  Applicability
                </p>
                <p className="mt-2 text-[13.5px] leading-[1.7] text-white/65">
                  {item.scope}
                </p>
              </div>

              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="sm:col-span-2 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-white/70 hover:text-signal-orange transition-colors"
                >
                  Open the official source
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function GlossaryList() {
  const [source, setSource] = useState<Source | "all">("all");
  const [letter, setLetter] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return TERMS.filter((t) => {
      if (source !== "all" && t.source !== source) return false;
      if (letter && t.term[0].toUpperCase() !== letter) return false;
      if (!term) return true;
      return (
        t.term.toLowerCase().includes(term) ||
        t.definition.toLowerCase().includes(term) ||
        t.why.toLowerCase().includes(term) ||
        t.use.toLowerCase().includes(term)
      );
    });
  }, [source, letter, q]);

  const clear = () => {
    setSource("all");
    setLetter(null);
    setQ("");
  };

  const filtered = source !== "all" || letter !== null || q.trim() !== "";

  return (
    <div>
      {/* search */}
      <div
        className="relative flex items-center w-full rounded-xl"
        style={{
          background: "rgba(255,255,255,0.04)",
          boxShadow: `inset 0 0 0 1px ${HAIR}`,
        }}
      >
        <Search
          className="absolute left-4 w-4 h-4 text-white/30 pointer-events-none"
          aria-hidden
        />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search a term, acronym or topic…"
          aria-label="Search the compliance glossary"
          className="w-full bg-transparent pl-11 pr-4 py-3.5 text-[13.5px] text-white placeholder:text-white/30 outline-none rounded-xl focus:shadow-[inset_0_0_0_1.5px_#FF6A00]"
        />
      </div>

      {/* source filter — counted, never typed */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {[
          { id: "all" as const, label: "All terms", n: TERMS.length },
          ...SOURCES.map((s) => ({
            id: s.id,
            label: s.label,
            n: countOf(s.id),
          })),
        ].map((s) => {
          const on = source === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSource(s.id)}
              aria-pressed={on}
              className={
                "inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[12.5px] font-medium transition-colors duration-200 " +
                (on ? "text-white" : "text-white/45 hover:text-white/80")
              }
              style={{
                background: on ? "rgba(255,255,255,0.10)" : "transparent",
                boxShadow: on ? undefined : `inset 0 0 0 1px ${HAIR}`,
              }}
            >
              {s.label}
              <span className="text-[10.5px] font-mono tabular-nums text-white/35">
                {s.n}
              </span>
            </button>
          );
        })}
      </div>

      {/* A–Z, only the letters that have a term */}
      <div className="mt-4 flex flex-wrap items-center gap-1">
        {LETTERS.map((l) => {
          const on = letter === l;
          return (
            <button
              key={l}
              type="button"
              onClick={() => setLetter(on ? null : l)}
              aria-pressed={on}
              className={
                "w-7 h-7 rounded-md text-[11.5px] font-semibold transition-colors duration-200 " +
                (on
                  ? "bg-signal-orange text-white"
                  : "text-white/40 hover:text-white hover:bg-white/[0.08]")
              }
            >
              {l}
            </button>
          );
        })}

        {filtered && (
          <button
            type="button"
            onClick={clear}
            className="ml-2 text-[11.5px] font-semibold text-white/40 hover:text-signal-orange transition-colors px-2 py-1"
          >
            Clear filters
          </button>
        )}
      </div>

      <p className="mt-6 text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-white/30">
        {list.length} {list.length === 1 ? "term" : "terms"}
      </p>

      <div className="mt-3" style={{ borderTop: `1px solid ${HAIR}` }}>
        {list.map((t) => (
          <Row
            key={t.term}
            item={t}
            open={open === t.term}
            onToggle={() => setOpen(open === t.term ? null : t.term)}
          />
        ))}
      </div>

      {list.length === 0 && (
        <p className="text-[13.5px] leading-[1.7] text-white/45 py-10">
          No matching term found. Try a broader word, or clear the source and
          letter filters.
        </p>
      )}
    </div>
  );
}
