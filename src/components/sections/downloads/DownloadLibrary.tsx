"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Download, FileText, Plus, X } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { FilterBar } from "@/components/sections/FilterBar";
import {
  GROUPS,
  RESOURCES,
  packHref,
  type Resource,
} from "./download-data";

/**
 * 02 — The library.
 *
 * `CaseWork`, `VideoLibrary`, `NewsFeed` and `WebinarLibrary` are the
 * reference: `FilterBar` with the tabs left and the search right, then a 3-up
 * grid with `AnimatePresence` keyed by id so a card surviving a filter change
 * stays put.
 *
 * A "Start here" section sat above this with three featured documents on
 * typographic covers, and the three pack steps under them. It was removed on
 * request. Nothing was lost with it: all thirteen resources are in this grid,
 * the pack works the same way, and the tray explains itself the moment
 * something is selected.
 *
 * ── No card links to a file, and that is the source's design ────────
 * "This concept intentionally does not fabricate PDF downloads … the request
 * workflow below is ready to use in the meantime." So every action is "Add to
 * pack", the pack becomes one pre-filled email, and nothing on this page
 * points at a PDF that does not exist.
 *
 * A resource that gains a `file` URL in `download-data` flips to a real
 * download and relabels itself. Both paths are already written.
 *
 * A note under the grid said all this in words and was removed on request.
 * What carries it now is each card's own "Request only" label beside its
 * button, and the FAQ's first answer — which is the better place for it
 * anyway, since it is read before pressing rather than after scrolling past.
 *
 * ── The tray, not a cart page ───────────────────────────────────────
 * Selecting shows a fixed bar at the foot of the viewport with the count and
 * the request button. It is `position: fixed` and nothing above it is
 * transformed, so it is not the header-drawer trap this site hit before —
 * a transformed ancestor becomes the containing block for its fixed
 * descendants, and there is none here.
 *
 * It appears only when something is selected, so a reader who never selects
 * anything never has a bar over their content.
 *
 * ── The selection is a Set, and the order is the library's ──────────
 * `pack` holds ids; the email body is built by walking `RESOURCES` and
 * keeping the selected ones. That way the list arrives in the library's own
 * order rather than in click order, which is the order the RAMS team reads
 * their own catalogue in.
 */

const HAIR = "#E8E8ED";

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[10.5px] font-semibold tracking-[0.12em] uppercase text-graphite/55 px-2.5 py-1"
      style={{ borderRadius: 999, background: "#F2F2F2" }}
    >
      {children}
    </span>
  );
}

function DownloadCard({
  item,
  added,
  onToggle,
}: {
  item: Resource;
  added: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <div
      className="group flex flex-col h-full p-6 transition-all duration-300 hover:-translate-y-0.5"
      style={{
        borderRadius: 16,
        background: "#FFFFFF",
        boxShadow: `inset 0 0 0 1px ${added ? "#FFC79A" : HAIR}`,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className="flex items-center justify-center w-10 h-10 shrink-0"
          style={{
            borderRadius: 10,
            background: added ? "rgba(255,106,0,0.10)" : "#F5F5F7",
          }}
        >
          <FileText
            className={
              "w-[18px] h-[18px] " +
              (added ? "text-signal-orange" : "text-graphite/45")
            }
            strokeWidth={1.8}
            aria-hidden
          />
        </span>

        <div className="text-right min-w-0">
          <p className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-signal-orange">
            {item.kind}
          </p>
          <p className="mt-1 text-[10px] font-mono tracking-[0.14em] uppercase text-graphite/40 truncate">
            {item.owner}
          </p>
        </div>
      </div>

      <h3 className="mt-5 text-[17px] font-bold tracking-[-0.02em] text-carbon leading-[1.28]">
        {item.title}
      </h3>

      <p className="mt-2.5 text-[13.5px] leading-[1.65] text-graphite/60 flex-1">
        {item.body}
      </p>

      <div className="mt-5 flex items-center gap-2">
        {item.tags.map((t) => (
          <Chip key={t}>{t}</Chip>
        ))}
      </div>

      <div
        className="mt-5 pt-4 flex items-center justify-between gap-3"
        style={{ borderTop: `1px solid ${HAIR}` }}
      >
        {item.file ? (
          <a
            href={item.file}
            download
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-carbon hover:text-signal-orange transition-colors"
          >
            <Download className="w-3.5 h-3.5" aria-hidden />
            Download
          </a>
        ) : (
          <span className="text-[12px] text-graphite/40">
            Request only
          </span>
        )}

        <button
          type="button"
          onClick={() => onToggle(item.id)}
          aria-pressed={added}
          className={
            "inline-flex items-center gap-1.5 text-[12.5px] font-semibold px-3.5 py-2 rounded-full transition-all duration-200 " +
            (added
              ? "bg-signal-orange text-white"
              : "text-carbon hover:text-signal-orange")
          }
          style={
            added ? undefined : { boxShadow: `inset 0 0 0 1px ${HAIR}` }
          }
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" aria-hidden />
              In pack
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" aria-hidden />
              Add to pack
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export function DownloadLibrary() {
  const [tab, setTab] = useState("All resources");
  const [q, setQ] = useState("");
  const [pack, setPack] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setPack((was) => {
      const next = new Set(was);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return RESOURCES.filter((r) => {
      if (tab !== "All resources" && r.group !== tab) return false;
      if (!term) return true;
      return (
        r.title.toLowerCase().includes(term) ||
        r.body.toLowerCase().includes(term) ||
        r.owner.toLowerCase().includes(term) ||
        r.search.includes(term)
      );
    });
  }, [tab, q]);

  /* Walked in library order rather than click order — the person reading the
     email reads their own catalogue in this order. */
  const chosen = RESOURCES.filter((r) => pack.has(r.id));

  return (
    <>
      {/* ── 02 The library ────────────────────────────── */}
      <Section surface="white" id="library">
        <SectionHeader
          eyebrow="Resource library"
          top="Find the document"
          bottom="That moves the decision."
          size="compact"
          width="wide"
          body="Search by product or topic, filter by type, and build a tailored request pack."
          className="!mb-10 sm:!mb-12"
        />

        <FilterBar
          tabs={["All resources", ...GROUPS]}
          active={tab}
          onTab={setTab}
          label="Filter resources by type"
          query={q}
          onQuery={setQ}
          placeholder="Search documents…"
        />

        <div className="mt-12 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          <AnimatePresence mode="popLayout">
            {list.map((r, i) => (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  duration: 0.45,
                  delay: (i % 3) * 0.04,
                  ease: EASE,
                }}
              >
                <DownloadCard
                  item={r}
                  added={pack.has(r.id)}
                  onToggle={toggle}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {list.length === 0 && (
          <p className="text-center text-[14.5px] leading-[1.7] text-graphite/55 py-16">
            No resources match that search. Try a product name, a topic or a
            different filter.
          </p>
        )}

      </Section>

      {/* ── the tray ──────────────────────────────────── */}
      <AnimatePresence>
        {chosen.length > 0 && (
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed inset-x-0 bottom-0 z-[90] px-4 pb-4 sm:px-6 sm:pb-6 pointer-events-none"
          >
            <div
              className="pointer-events-auto mx-auto flex items-center justify-between gap-4 flex-wrap max-w-[880px] px-5 py-4 text-white"
              style={{
                borderRadius: 16,
                background: "rgba(14,14,17,0.94)",
                backdropFilter: "blur(10px)",
                boxShadow:
                  "0 24px 60px -24px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.10)",
              }}
            >
              <div className="min-w-0">
                <p className="text-[13.5px] font-semibold">
                  {chosen.length} document{chosen.length === 1 ? "" : "s"} in
                  your pack
                </p>
                <p className="mt-1 text-[12px] text-white/45 truncate max-w-[420px]">
                  {chosen.map((c) => c.title).join(" · ")}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setPack(new Set())}
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-white/55 hover:text-white px-3 py-2.5 rounded-full transition-colors duration-200"
                >
                  <X className="w-3.5 h-3.5" aria-hidden />
                  Clear
                </button>

                <a
                  href={packHref(chosen.map((c) => c.title))}
                  className="inline-flex items-center gap-2 bg-signal-orange text-white text-[13px] font-semibold px-5 py-3 rounded-full transition-colors duration-200 hover:bg-signal-orange-hover"
                >
                  Request these documents
                  <ArrowUpRight className="w-4 h-4" aria-hidden />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
