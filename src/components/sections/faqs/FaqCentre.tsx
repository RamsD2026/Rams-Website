"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Boxes,
  Check,
  ClipboardCheck,
  Cpu,
  Forklift,
  Layers,
  LifeBuoy,
  Link2,
  Search,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { ClientStrip } from "@/components/sections/ClientStrip";
import {
  HeroTiles,
  LightHeroGround,
  type HeroTile,
} from "@/components/sections/LightHero";
import {
  FAQS,
  TOPICS,
  countOf,
  popular,
  topicOf,
  type Faq,
} from "./faq-data";

/**
 * The help centre: hero, topic grid, most asked, and the full library.
 *
 * One client component because all four share two pieces of state — the
 * search term and the selected topic. Pressing a topic card in the hero or in
 * the topic grid sets the filter and scrolls to the library. Splitting them
 * into four sections would mean lifting that state into the page, which puts
 * it further from the only things that read it.
 *
 * The search sat in the hero for a revision, which is where the source puts
 * it, and was moved down to the library on request. It is better there: a
 * field 900px above the rows it narrows is a control a reader has to remember
 * rather than one they can reach for. The hero keeps the topic shortcuts,
 * which are navigation rather than filtering.
 *
 * ── The counts are counted ──────────────────────────────────────────
 * Every "50 answers", every topic tally, and the label above the list are
 * derived from `FAQS`. The source writes "50 ANSWERS" in three places and a
 * per-topic count in a fourth, which stays true exactly as long as nobody
 * edits the array.
 *
 * ── An answer can be linked to, and the link works on arrival ───────
 * The source lets a reader copy a direct link to one answer. The ids are
 * carried through unchanged, each row has a copy control, and on mount the
 * component opens the answer named in `location.hash` and scrolls to it — so
 * a link somebody pasted into a ticket lands on the open answer rather than
 * at the top of a list of fifty.
 *
 * The hash is read once in an effect rather than during render: it does not
 * exist on the server, and reading it in the render pass is a hydration
 * mismatch waiting for the first person to share a link.
 *
 * ── Copy is guarded, and silent when it fails ───────────────────────
 * `navigator.clipboard` is undefined on an insecure origin. The write is
 * guarded and the failure does nothing rather than throwing into the console
 * — the same call `CodeBlock` makes on the technical notes.
 */

const HAIR = "#E8E8ED";

/** The ten glyphs the hero orbit carries — the subjects the answers cover. */
const TILES: HeroTile[] = [
  { icon: LifeBuoy, tint: "#3E63DD" },
  { icon: Layers, tint: "#F76808" },
  { icon: ShieldCheck, tint: "#0891B2" },
  { icon: Forklift, tint: "#DB2777" },
  { icon: Boxes, tint: "#6647F0" },
  { icon: Cpu, tint: "#299764" },
  { icon: Wrench, tint: "#CA8A04" },
  { icon: ClipboardCheck, tint: "#E5484D" },
  { icon: Search, tint: "#65A30D" },
  { icon: Link2, tint: "#0F766E" },
];

/* ── one answer ───────────────────────────────────────────────────── */

function Row({
  item,
  open,
  onToggle,
}: {
  item: Faq;
  open: boolean;
  onToggle: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const topic = topicOf(item.topic);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = () => {
    const url = `${window.location.origin}${window.location.pathname}#${item.id}`;
    navigator.clipboard?.writeText(url).then(
      () => setCopied(true),
      () => {},
    );
  };

  return (
    <div id={item.id} className="scroll-mt-28" style={{ borderBottom: `1px solid ${HAIR}` }}>
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex-1 flex items-start justify-between gap-5 text-left py-5 group"
        >
          <span className="min-w-0">
            {topic && (
              <span className="block text-[9.5px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/40 mb-2">
                {topic.name}
              </span>
            )}
            <span
              className={
                "block text-[15.5px] sm:text-[16px] font-bold tracking-[-0.015em] leading-[1.45] transition-colors duration-300 " +
                (open ? "text-carbon" : "text-carbon/85 group-hover:text-carbon")
              }
            >
              {item.question}
            </span>
          </span>

          <span aria-hidden className="relative w-3.5 h-3.5 shrink-0 mt-1">
            <span
              className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full"
              style={{ background: "#FF6A00" }}
            />
            <motion.span
              className="absolute top-0 bottom-0 left-1/2 w-[2px] -translate-x-1/2 rounded-full origin-center"
              style={{ background: "#FF6A00" }}
              initial={false}
              animate={{ scaleY: open ? 0 : 1 }}
              transition={{ duration: 0.3, ease: EASE }}
            />
          </span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="pb-4 pr-10 text-[14.5px] leading-[1.75] text-graphite/65">
              {item.answer}
            </p>

            <button
              type="button"
              onClick={copy}
              className="mb-6 inline-flex items-center gap-1.5 text-[12px] font-semibold text-graphite/45 hover:text-signal-orange transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-signal-orange" aria-hidden />
                  Link copied
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5" aria-hidden />
                  Copy link to this answer
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── the page ─────────────────────────────────────────────────────── */

export function FaqCentre() {
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const library = useRef<HTMLDivElement>(null);

  /* A shared link lands on the open answer, not at the top of fifty.
     `location` does not exist on the server, so it cannot be read during
     render or in a lazy initialiser — either would hydrate a different tree
     than the one the server sent.

     The work happens in a frame callback rather than in the effect body:
     `react-hooks/set-state-in-effect` rejects a synchronous `setOpen` here,
     and deferring is also what lets the row exist before it is scrolled to. */
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id || !FAQS.some((f) => f.id === id)) return;

    const frame = requestAnimationFrame(() => {
      setOpen(id);
      document.getElementById(id)?.scrollIntoView({ block: "center" });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return FAQS.filter((f) => {
      if (topic !== "all" && f.topic !== topic) return false;
      if (!term) return true;
      return (
        f.question.toLowerCase().includes(term) ||
        f.answer.toLowerCase().includes(term)
      );
    });
  }, [q, topic]);

  const jump = (id: string) => {
    setTopic(id);
    library.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* ── 01 Hero ───────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        id="top"
        data-hero-tone="light"
        style={{ background: "#FFFFFF" }}
      >
        <LightHeroGround />

        <div className="relative rams-container pt-40 sm:pt-52 lg:pt-60 pb-20 sm:pb-24 lg:pb-28">
          <HeroTiles tiles={TILES} />

          <div className="max-w-[1080px] mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur"
              style={{ boxShadow: "inset 0 0 0 1px #E8E8ED" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
              <span className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-graphite/70">
                Help centre
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
              className="mt-8 text-[46px] sm:text-[72px] lg:text-[96px] font-bold leading-[1.06] tracking-[-0.045em]"
            >
              <span className="block text-carbon">Answers that move</span>
              <span className="block text-graphite/50">
                your operation forward.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
              className="mt-6 text-[14px] sm:text-[16px] text-graphite/65 leading-[1.6] max-w-[880px] mx-auto"
            >
              The RAMS platform, the Digital Twin, rack safety, MHE, inventory,
              integrations, implementation and support.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32, ease: EASE }}
              className="mt-10 flex items-center justify-center gap-x-2 gap-y-2 flex-wrap text-[12px] text-graphite/45"
            >
              <span className="font-semibold text-graphite/55">
                Jump to a topic:
              </span>
              {[
                "digital-twin",
                "rack-safety",
                "integrations",
                "implementation",
                "security",
              ].map((id) => {
                const t = topicOf(id);
                if (!t) return null;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => jump(id)}
                    className="px-3 py-1.5 rounded-full text-[12px] font-medium text-graphite hover:text-signal-orange transition-colors"
                    style={{ boxShadow: `inset 0 0 0 1px ${HAIR}` }}
                  >
                    {t.name}
                  </button>
                );
              })}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
            className="relative mt-24 sm:mt-28 lg:mt-32"
          >
            <ClientStrip label="Trusted on the warehouse floor" />
          </motion.div>
        </div>
      </section>

      {/* ── 02 Topics ─────────────────────────────────── */}
      <Section surface="white" id="topics">
        <SectionHeader
          eyebrow="Browse by topic"
          top="Go straight to"
          bottom="What matters."
          size="compact"
          width="wide"
          body="Choose a topic to filter the complete answer library."
          className="!mb-10 sm:!mb-12"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOPICS.map((t, i) => (
            <motion.button
              key={t.id}
              type="button"
              onClick={() => jump(t.id)}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.05, ease: EASE }}
              className="group flex items-center gap-4 p-5 text-left transition-all duration-300 hover:-translate-y-0.5"
              style={{
                borderRadius: 16,
                background: "#FFFFFF",
                boxShadow: `inset 0 0 0 1px ${HAIR}`,
              }}
            >
              <span
                className="flex items-center justify-center w-11 h-11 shrink-0 text-[12px] font-mono font-bold text-graphite/50 transition-colors duration-300 group-hover:text-signal-orange"
                style={{ borderRadius: 10, background: "#F5F5F7" }}
                aria-hidden
              >
                {t.code}
              </span>

              <span className="flex-1 min-w-0">
                <span className="block text-[15px] font-semibold tracking-[-0.02em] text-carbon transition-colors duration-300 group-hover:text-signal-orange">
                  {t.name}
                </span>
                <span className="block mt-1 text-[13px] leading-[1.5] text-graphite/55">
                  {t.desc}
                </span>
              </span>

              <span className="text-[13px] font-mono font-bold tabular-nums text-graphite/35 shrink-0">
                {String(countOf(t.id)).padStart(2, "0")}
              </span>
            </motion.button>
          ))}
        </div>

        {/* The source's own caveat, above the library rather than under it.
            Several answers describe what the platform *can* do, which on a
            help centre reads as what it *will* do for the reader's site. */}
        <p className="mt-10 text-center text-[12.5px] leading-[1.65] text-graphite/45 max-w-[820px] mx-auto">
          Capabilities may vary by agreed modules, hardware, integrations and
          deployment scope.
        </p>
      </Section>

      {/* ── 03 Most asked ─────────────────────────────── */}
      <Section surface="offWhite" id="popular">
        <SectionHeader
          eyebrow="Most asked"
          top="Start with"
          bottom="The big questions."
          size="compact"
          width="wide"
          body="What RAMS is, how the Digital Twin works, what rack inspections produce and how the platform connects to existing systems."
          className="!mb-10 sm:!mb-12"
        />

        <div
          className="max-w-[900px] mx-auto"
          style={{ borderTop: `1px solid ${HAIR}` }}
        >
          {popular().map((f) => (
            <Row
              key={`pop-${f.id}`}
              item={f}
              open={open === f.id}
              onToggle={() => setOpen(open === f.id ? null : f.id)}
            />
          ))}
        </div>
      </Section>

      {/* ── 04 The library ────────────────────────────── */}
      <Section surface="white" id="answers">
        <div ref={library} className="scroll-mt-24" />

        <SectionHeader
          eyebrow="Complete answer library"
          top="Every question,"
          bottom="In one place."
          size="compact"
          width="wide"
          body="Search, or filter by topic. Open an answer and copy its direct link when you need to share it."
          className="!mb-10 sm:!mb-12"
        />

        <div className="grid grid-cols-1 lg:grid-cols-[232px_minmax(0,1fr)] gap-10">
          {/* the topic rail */}
          <aside>
            <p className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-graphite/40 mb-4">
              Filter by topic
            </p>

            <div className="flex flex-wrap lg:flex-col gap-1.5">
              {[{ id: "all", name: "All questions" }, ...TOPICS].map((t) => {
                const on = topic === t.id;
                const n = t.id === "all" ? FAQS.length : countOf(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTopic(t.id)}
                    aria-pressed={on}
                    className={
                      "flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-medium transition-colors duration-200 " +
                      (on
                        ? "bg-carbon text-white"
                        : "text-graphite hover:text-signal-orange")
                    }
                  >
                    {t.name}
                    <span
                      className={
                        "text-[11px] font-mono tabular-nums " +
                        (on ? "text-white/50" : "text-graphite/35")
                      }
                    >
                      {n}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              className="mt-6 p-4 rounded-xl"
              style={{ background: "#F5F5F7" }}
            >
              <p className="text-[13px] font-bold text-carbon leading-[1.4]">
                Project-specific question?
              </p>
              <p className="mt-2 text-[12.5px] leading-[1.6] text-graphite/60">
                Ask the team when the answer depends on your facility, asset
                type or system architecture.
              </p>
              <Link
                href="/company/contact"
                className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-carbon hover:text-signal-orange transition-colors"
              >
                Ask RAMS
                <ArrowRight className="w-3.5 h-3.5" aria-hidden />
              </Link>
            </div>
          </aside>

          {/* the answers */}
          <div className="min-w-0">
            {/* The search lives with the list it filters. It was in the
                hero for a revision — the source puts it there — and was moved
                on request; a field 900px above the rows it narrows is a
                control the reader has to remember rather than reach for. */}
            <div
              className="relative flex items-center w-full bg-white rounded-full mb-6"
              style={{ boxShadow: `inset 0 0 0 1px ${HAIR}` }}
            >
              <Search
                className="absolute left-4 w-4 h-4 text-graphite/40 pointer-events-none"
                aria-hidden
              />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={`Search ${FAQS.length} answers…`}
                aria-label="Search the help centre"
                className="w-full bg-transparent pl-11 pr-4 py-3 text-[13.5px] text-carbon placeholder:text-graphite/40 outline-none rounded-full focus:shadow-[inset_0_0_0_1.5px_#FF6A00]"
              />
            </div>

            <div className="flex items-center justify-between gap-4 mb-4">
              <p className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-graphite/40">
                Showing {list.length}{" "}
                {list.length === 1 ? "answer" : "answers"}
              </p>

              {(topic !== "all" || q.trim() !== "") && (
                <button
                  type="button"
                  onClick={() => {
                    setTopic("all");
                    setQ("");
                  }}
                  className="text-[12px] font-semibold text-graphite/45 hover:text-signal-orange transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div style={{ borderTop: `1px solid ${HAIR}` }}>
              {list.map((f) => (
                <Row
                  key={f.id}
                  item={f}
                  open={open === f.id}
                  onToggle={() => setOpen(open === f.id ? null : f.id)}
                />
              ))}
            </div>

            {list.length === 0 && (
              <p className="text-[14.5px] leading-[1.75] text-graphite/55 py-14">
                No answer matches that search. Try a shorter phrase, or send the
                question straight to the RAMS team.
              </p>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
