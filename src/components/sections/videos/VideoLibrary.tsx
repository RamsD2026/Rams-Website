"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Play } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { FilterBar } from "@/components/sections/FilterBar";
import { CATEGORIES, VIDEOS, type Video } from "./video-data";
import { VideoPlayer } from "./VideoPlayer";

/**
 * 02 — The library.
 *
 * `CaseWork` is the reference: the same segmented pill filter, the same
 * `AnimatePresence` keyed by id so a card surviving a filter change stays put,
 * and the same card shape — a thumbnail on a 20px radius, then the type
 * *under* it on the section's own ground. No box, no border, no shadow.
 *
 * ── Three to a row ─────────────────────────────────────────────────
 * The same 3-up grid as `CaseWork`, so the two sibling pages scan as one
 * set: 397px cards at the 1232 cap, breaking to 2 at `sm` and 1 below it.
 *
 * It was 2-up first, on the argument that a video thumbnail is asking to be
 * watched and 397px of it is a contact sheet. That is still true of the
 * thumbnail — which is why the play control is painted on it rather than
 * left to a hover state — but matching the sibling page won the trade.
 *
 * Five films are 3 + 2, and filtering to Hardware fills exactly one row.
 * It was four for a while, with the IRDS capture playing in the hero instead;
 * that left a card alone on row two, and moving the clip down here closed it.
 *
 * ── The bar is shared, and it searches ──────────────────────────────
 * `FilterBar` — tabs left, search right — is the same control the case
 * studies and the newsroom carry. The tabs used to be centred here with no
 * search beside them; three pages drawing one bar three ways is how a
 * design system stops being one.
 *
 * The search matches the title, the summary, the subject and the kind, so
 * "OmniBox", "twin" and "sensor" all find something whether or not they
 * are in a heading.
 *
 * ── No pager ────────────────────────────────────────────────────────
 * `CaseWork` pages at three because it has six, which is two full pages.
 * Four films are one row and a bit, and a pager that cannot page is furniture
 * — the same reason that page hides its own control below two pages.
 *
 * ── The box is 3:2, and that is the posters' shape ──────────────────
 * The OmniBox, camera and sensor renders are all 1536×1024 and the IRDS
 * screens are 1472×976 and 1484×840. At 16:9 every one of them would be
 * cropped or pillarboxed. At 3:2 four of the five fill the box exactly.
 *
 * The player is 16:9 with `object-contain`, because there the file's own
 * shape is what matters and cropping a screen recording loses a corner of the
 * interface. A thumbnail may crop; a film may not.
 *
 * ── Nothing downloads until the pointer is on it ────────────────────
 * A card renders its poster and no `<video>` at all. The element is mounted
 * on first hover — `armed` — and from then on it plays on enter and pauses
 * and rewinds on leave. Four of the clips are 38 MB together and the fifth is
 * 60 on its own; a page that attached five sources on load would spend all of
 * that on a visitor who scrolled past.
 *
 * `armed` is a Set in state rather than a flag per card so the mounting
 * survives a filter change: a card that has been hovered stays armed if it
 * leaves the grid and comes back.
 *
 * Touch has no hover. Those visitors get the poster and open the player,
 * which is the whole interaction anyway — the preview is a nicety, not the
 * feature.
 */

function Card({
  video,
  index,
  armed,
  onArm,
  onOpen,
}: {
  video: Video;
  index: number;
  armed: boolean;
  onArm: (id: string) => void;
  onOpen: (v: Video) => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  const enter = () => {
    onArm(video.id);
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  };

  const leave = () => {
    const v = ref.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.05, ease: EASE }}
      onClick={() => onOpen(video)}
      onMouseEnter={enter}
      onMouseLeave={leave}
      className="group block cursor-pointer"
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "3 / 2", borderRadius: 20, background: "#08080A" }}
      >
        <Image
          src={video.poster}
          alt={video.posterAlt}
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 397px"
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />

        {/* Mounted on first hover, and only then. Once it is here it sits over
            the poster and plays; on leave it pauses and rewinds, so the next
            hover starts the film rather than resuming it. */}
        {armed && (
          <video
            ref={ref}
            src={video.src}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        {/* the play control — the one thing painted over the picture */}
        <span
          className="absolute left-4 bottom-4 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
          style={{
            width: 46,
            height: 46,
            borderRadius: 999,
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(6px)",
            boxShadow: "0 10px 26px -12px rgba(0,0,0,0.55)",
          }}
        >
          <Play
            className="w-[16px] h-[16px] text-carbon ml-[2px]"
            fill="currentColor"
            strokeWidth={0}
            aria-hidden
          />
        </span>
      </div>

      <div className="mt-7 lg:mt-8">
        <div
          className="text-[18px] font-bold leading-none mb-5 text-signal-orange"
          style={{ letterSpacing: "-0.02em" }}
        >
          {video.kind}
        </div>

        <p className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-graphite/55">
          {video.subject}
        </p>

        <h3 className="mt-4 text-[20px] lg:text-[22px] font-bold text-carbon leading-[1.25]">
          {video.title}
        </h3>

        <p className="mt-4 text-[14px] text-graphite/65 leading-[1.65]">
          {video.body}
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(video);
          }}
          className="mt-7 inline-flex items-center gap-1.5 text-[13px] font-semibold text-carbon group-hover:text-signal-orange transition-colors cursor-pointer"
        >
          <Play
            className="w-[13px] h-[13px]"
            fill="currentColor"
            strokeWidth={0}
            aria-hidden
          />
          Watch the film
        </button>
      </div>
    </motion.div>
  );
}

export function VideoLibrary() {
  const [at, setAt] = useState("All");
  const [q, setQ] = useState("");
  const [armed, setArmed] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<Video | null>(null);

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return VIDEOS.filter((v) => {
      if (at !== "All" && v.kind !== at) return false;
      if (!term) return true;
      return (
        v.title.toLowerCase().includes(term) ||
        v.body.toLowerCase().includes(term) ||
        v.subject.toLowerCase().includes(term) ||
        v.kind.toLowerCase().includes(term)
      );
    });
  }, [at, q]);

  const arm = (id: string) =>
    setArmed((was) => (was.has(id) ? was : new Set(was).add(id)));

  return (
    <Section surface="white" id="library">
      <SectionHeader
        eyebrow="The library"
        top="Every film"
        bottom="In one place."
        size="compact"
        width="wide"
        body="Hover a card to preview it, or open it for the full film. Nothing loads until you ask for it."
        className="!mb-10 sm:!mb-12"
      />

      <FilterBar
        tabs={["All", ...CATEGORIES]}
        active={at}
        onTab={setAt}
        label="Filter videos"
        query={q}
        onQuery={setQ}
        placeholder="Search the library…"
      />

      <div className="mt-12 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14 lg:gap-y-16 items-start">
        <AnimatePresence mode="popLayout">
          {shown.map((v, i) => (
            <Card
              key={v.id}
              video={v}
              index={i}
              armed={armed.has(v.id)}
              onArm={arm}
              onOpen={setOpen}
            />
          ))}
        </AnimatePresence>
      </div>

      {shown.length === 0 && (
        <p className="text-center text-[14.5px] leading-[1.7] text-graphite/55 py-16">
          No films match that search. Try another kind or keyword.
        </p>
      )}

      {/* What is on this page, and what is not. A video library is the one
          page where padding the list would be a broken promise rather than a
          placeholder — every card here opens a file that exists. */}
      <p className="mt-14 text-center text-[12.5px] leading-[1.65] text-graphite/45 max-w-[820px] mx-auto">
        Product captures and hardware renders. No customer site, customer data
        or named client appears in any film — site walkthroughs are shared
        under NDA.
      </p>

      <AnimatePresence>
        {open && (
          <VideoPlayer video={open} onClose={() => setOpen(null)} />
        )}
      </AnimatePresence>
    </Section>
  );
}
