"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, animate, stagger, usePresence, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Star, X } from "lucide-react";
import { CLIENTS } from "@/data/clients";
import { Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * Customers & collaboration — the client band from the previous About page
 * (`AboutCustomers`), then real customer testimonials in a scrolling row.
 *
 * The band runs every mark in `src/data/clients.ts` — RAMS's own asset pack
 * — in greyscale at 0.55, full colour on hover, looping at 92s, holding on
 * hover and stopping under `prefers-reduced-motion`.
 */

/** Content enters and leaves rather than snapping. */
const EDGE_FADE =
  "linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)";

/* ── the review cards ─────────────────────────────────────────────── */

const HAIR = "#E8E8ED";
const STEP_MS = 3500;
const GAP = 20;

/* The owner's testimonials (Testimonials.docx, 2026-10-23), quotes as
   written. `logo` is the company's mark from src/data/clients.ts where RAMS
   holds one; without it the card names the company in text. */
type Testimonial = {
  quote: string;
  name: string;
  company: string;
  logo?: string;
  /** 1–5, only when the customer gave one. None are given yet. */
  rating?: number;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "A good technical expertise on racking system evaluation & Assessment. in EK case, A through study was carried out by competent engineers and elaborative Assessment has been shared on time which is quite appreciable. I appreciate their support & transferring technical knowhow to customer especially on Racking system.....Good Job...Keep it up!!!",
    name: "Dhananjay Joshi",
    company: "Elringklinger India",
    logo: "elringklinger",
  },
  {
    quote:
      "It's a valuable experience to conduct audits and generate reports from RAMS. Currently, we perform manual audits, such as removing materials from bin locations after supplier inspections. However, implementing machine-based audits to identify materials would be beneficial and more efficient for warehouse operations.",
    name: "Haridass Kristan",
    company: "Caterpillar Pvt Ltd",
    logo: "caterpillar",
  },
  {
    quote: "The RAMS team's innovative concept has been highly beneficial to our business and end users.",
    name: "Kunal Kishor",
    company: "GE Vernova (LM Wind Power Blades India Pvt Ltd)",
    logo: "ge-vernova",
  },
  {
    quote: "Response is good and prompt.",
    name: "Mahesh Kapadi",
    company: "Koerber Supply Chain IN Ltd",
  },
  {
    quote: "Overall service is good",
    name: "Logeshkumar Chandru",
    company: "Amalgamations Valeo Clutch Private Limited",
    logo: "valeo",
  },
  {
    quote: "Good service and immediate response",
    name: "Dinesh Pandey",
    company: "JM Baxi Ports and Logistics",
    logo: "jm-baxi",
  },
  {
    quote:
      "We had a great experience working with Rams. The team consists of qualified personnel who communicate politely and professionally. The execution of the work was smooth and handled in a highly professional manner. We look forward to collaborating with Rams again in the future.",
    name: "Nishant Sonawane",
    company: "Yamazaki Mazak Machine Tools Pvt. Ltd.",
    logo: "mazak",
  },
  {
    quote:
      "We appreciate the efforts put in during the Rack Audit. However, there is scope for improving the overall experience. Timely coordination, clearer communication on observations, and quicker turnaround on the final report would make the process more efficient. Enhancing the detailing of findings with supporting photos and recommendations will also help us take corrective actions faster.",
    name: "Prasad Ghadigaonkar",
    company: "Rhenus Logistics India Pvt. Ltd.",
    logo: "rhenus-logistics",
  },
  {
    quote:
      "Audit was done with professionals & results were in line with the expectation. Results sharing & data representation is very good & effective",
    name: "Sumit Aggarwal",
    company: "Continental Automotive Components India Private Limited",
    logo: "continental",
  },
];

const LOGOS = new Map(CLIENTS.map((c) => [c.slug, c]));

/** Up to two initials, for the monogram. */
function initials(s: string) {
  return s
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/** Stars, only for a rating the customer actually gave (`rating`). */
function Rating({ n }: { n: number }) {
  return (
    <span className="flex items-center gap-[3px] shrink-0" aria-label={`${n} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden
          className="w-[13px] h-[13px]"
          strokeWidth={0}
          style={{ fill: i <= n ? "#FF6A00" : "rgba(255,106,0,0.18)" }}
        />
      ))}
    </span>
  );
}

/** Monogram, name and company — and the stars, when given. */
function Who({ v }: { v: Testimonial }) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden
        className="flex items-center justify-center w-11 h-11 shrink-0 rounded-full text-[12px] font-mono font-bold text-signal-orange"
        style={{ background: "rgba(255,106,0,0.08)", border: "1px solid rgba(255,106,0,0.18)" }}
      >
        {initials(v.name)}
      </span>
      <span className="flex flex-col min-w-0 flex-1">
        <span className="text-[14px] font-semibold text-carbon leading-[1.3] truncate">{v.name}</span>
        <span className="mt-0.5 text-[12px] text-graphite/55 leading-[1.35] truncate">{v.company}</span>
      </span>
      {v.rating ? <Rating n={v.rating} /> : null}
    </div>
  );
}

/** One testimonial card, all the same height: who, a hairline, the quote
    clamped to three lines. Hovering it (or a tap) brings up the full review. */
function VoiceCard({
  v,
  onOpen,
  onEnter,
  onLeave,
}: {
  v: Testimonial;
  onOpen: (el: HTMLElement) => void;
  onEnter: (el: HTMLElement) => void;
  onLeave: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => onOpen(e.currentTarget)}
      onPointerMove={(e) => {
        if (e.pointerType === "mouse" && (e.movementX || e.movementY)) onEnter(e.currentTarget);
      }}
      onPointerLeave={(e) => e.pointerType === "mouse" && onLeave()}
      className="flex flex-col w-full h-full text-left bg-white p-7 cursor-default transition-shadow duration-300 ease-out hover:shadow-[0_22px_44px_-26px_rgba(0,0,0,0.28)] focus-visible:outline-2 focus-visible:outline-signal-orange"
      style={{
        borderRadius: 16,
        border: `1px solid ${HAIR}`,
        boxShadow: "0 1px 2px rgba(0,0,0,0.02), 0 10px 30px -14px rgba(0,0,0,0.07)",
      }}
      aria-label={`Read ${v.name}'s full review`}
    >
      <Who v={v} />
      <span aria-hidden className="my-6 block" style={{ height: 1, background: HAIR }} />
      <p className="text-[14.5px] leading-[1.7] text-carbon/75 line-clamp-3 min-h-[calc(3*1.7em)]">{v.quote}</p>
    </button>
  );
}

const POP_W = 540;
const EDGE = 16;
const EASE = [0.22, 1, 0.36, 1] as const;

/** The full review, lifted out of its card: the white card grows out of the
    one under the pointer into a larger one in the middle of the window, then the company's mark, the
    quote and the person rise in — no dimmed page behind it. It shrinks back
    into the card when the pointer leaves it, on a tap elsewhere, on scroll,
    on the ✕ or on Escape. */
function ReviewPop({
  v,
  from,
  onKeep,
  onLeave,
  onClose,
}: {
  v: Testimonial;
  from: DOMRect;
  onKeep: () => void;
  onLeave: () => void;
  onClose: () => void;
}) {
  const mark = v.logo ? LOGOS.get(v.logo) : undefined;
  const reduce = useReducedMotion();
  const scope = useRef<HTMLElement>(null);
  const parts = (el: HTMLElement) => el.querySelectorAll("[data-in]");
  const [isPresent, safeToRemove] = usePresence();
  const width = Math.min(POP_W, window.innerWidth - EDGE * 2);

  // the move from the card's box to the popup's, as a transform
  const toCard = useCallback(
    (el: HTMLElement) => ({
      x: from.left - parseFloat(el.style.left),
      y: from.top - parseFloat(el.style.top),
      scaleX: from.width / el.offsetWidth,
      scaleY: from.height / el.offsetHeight,
    }),
    [from],
  );

  // placed in the middle of the window, then grown out of its card
  useLayoutEffect(() => {
    const el = scope.current;
    if (!el) return;
    const h = el.offsetHeight;
    const left = (window.innerWidth - width) / 2;
    const top = Math.max(EDGE, (window.innerHeight - h) / 2);
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;

    if (reduce) {
      animate(el, { opacity: [0, 1] }, { duration: 0.2 });
      animate(parts(el), { opacity: [0, 1] }, { duration: 0.2 });
      return;
    }
    const c = toCard(el);
    animate(el, { opacity: 1 }, { duration: 0 });
    animate(
      el,
      { x: [c.x, 0], y: [c.y, 0], scaleX: [c.scaleX, 1], scaleY: [c.scaleY, 1] },
      { duration: 0.6, ease: EASE },
    );
    animate(
      "[data-in]",
      { opacity: [0, 1], y: [14, 0] },
      { duration: 0.6, ease: EASE, delay: stagger(0.1, { startDelay: 0.3 }) },
    );
  }, [from, width, reduce, toCard]);

  // leaving: the content fades, then the card shrinks back into its place
  useEffect(() => {
    if (isPresent) return;
    const el = scope.current;
    if (!el) return;
    const run = async () => {
      if (reduce) {
        await animate(el, { opacity: 0 }, { duration: 0.15 });
      } else {
        animate(parts(el), { opacity: 0 }, { duration: 0.2 });
        await animate(el, { ...toCard(el), opacity: 0 }, { duration: 0.55, ease: EASE });
      }
      safeToRemove?.();
    };
    run();
  }, [isPresent, safeToRemove, reduce, toCard]);

  useEffect(() => {
    if (!isPresent) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onDown = (e: PointerEvent) => {
      if (scope.current && !scope.current.contains(e.target as Node)) onClose();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onClose, { passive: true });
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onClose);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [onClose, isPresent]);

  return createPortal(
    <article
      ref={scope}
      role="dialog"
      aria-label={`Review from ${v.name}`}
      onPointerEnter={onKeep}
      onPointerLeave={(e) => e.pointerType === "mouse" && onLeave()}
      className="fixed z-[200] max-h-[calc(100svh-32px)] overflow-auto bg-white p-8 sm:p-9 origin-top-left"
      style={{
        left: from.left,
        top: from.top,
        width,
        opacity: 0,
        borderRadius: 20,
        border: `1px solid ${HAIR}`,
        boxShadow: "0 2px 6px rgba(14,14,15,0.04), 0 32px 80px -24px rgba(14,14,15,0.30)",
        pointerEvents: isPresent ? "auto" : "none",
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        data-in
        style={{ opacity: 0 }}
        className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full text-graphite/50 hover:text-carbon hover:bg-[#F2F2F2] transition-colors"
      >
        <X className="w-4 h-4" strokeWidth={2} aria-hidden />
      </button>

      <div data-in style={{ opacity: 0 }} className="h-8 flex items-center pr-10">
        {mark ? (
          <Image
            src={`/clients/${mark.slug}.png`}
            alt={mark.name}
            width={mark.w}
            height={mark.h}
            className="h-7 w-auto max-w-[160px] object-contain object-left"
          />
        ) : (
          <span className="text-[15px] font-bold tracking-[-0.01em] text-carbon">{v.company}</span>
        )}
      </div>

      <div data-in style={{ opacity: 0 }}>
        <span aria-hidden className="mt-6 block font-rams-heading text-[46px] leading-[0.6] text-signal-orange">
          &ldquo;
        </span>
        <p className="mt-3 text-[15.5px] sm:text-[16px] leading-[1.75] text-carbon/80">{v.quote}</p>
      </div>

      <div data-in style={{ opacity: 0 }}>
        <span aria-hidden className="my-6 block" style={{ height: 1, background: HAIR }} />
        <Who v={v} />
      </div>
    </article>,
    document.body,
  );
}

/** Move a rail one card along, or back to the start from the last card. */
function advance(el: HTMLDivElement | null, dir: 1 | -1, smooth = true) {
  if (!el) return;
  const card = el.querySelector<HTMLElement>("[data-card]");
  const step = card ? card.offsetWidth + GAP : 420;
  const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
  const behavior: ScrollBehavior = smooth ? "smooth" : "auto";
  if (dir === 1 && end) el.scrollTo({ left: 0, behavior });
  else el.scrollBy({ left: dir * step, behavior });
}

function Voices() {
  const [open, setOpen] = useState<{ v: Testimonial; from: DOMRect } | null>(null);
  const closing = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stop = () => {
    if (closing.current) clearTimeout(closing.current);
  };
  const show = (v: Testimonial, el: HTMLElement) => {
    stop();
    setOpen({ v, from: el.getBoundingClientRect() });
  };
  // moving the mouse over a card opens its review at once: any card, the
  // left and right ones too, and straight on from another open review
  const enter = (v: Testimonial, el: HTMLElement) => {
    if (open?.v === v) return stop();
    show(v, el);
  };
  const close = useCallback(() => {
    if (closing.current) clearTimeout(closing.current);
    setOpen(null);
  }, []);
  // the review holds while the pointer is on its card or on the review
  // itself, and goes a moment after it has left both
  const drop = () => {
    stop();
    closing.current = setTimeout(close, 500);
  };
  const reduce = useReducedMotion();
  const rail = useRef<HTMLDivElement>(null);
  const [hold, setHold] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const idle = useRef<ReturnType<typeof setTimeout> | null>(null);
  // true while the rail is moving on its own, so that scroll is not taken
  // for the reader's hand
  const auto = useRef(false);

  const go = (dir: 1 | -1) => advance(rail.current, dir);

  // the edges, for the arrows
  const onScroll = () => {
    const el = rail.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    if (auto.current) return;
    // a hand on the rail holds the auto-step until it has been still a while
    setHold(true);
    if (idle.current) clearTimeout(idle.current);
    idle.current = setTimeout(() => setHold(false), STEP_MS);
  };

  // a finger lifted lets it run again after a pause
  const release = () => {
    if (idle.current) clearTimeout(idle.current);
    idle.current = setTimeout(() => setHold(false), STEP_MS);
  };

  useEffect(() => {
    if (hold || open) return;
    const t = setInterval(() => {
      auto.current = true;
      advance(rail.current, 1, !reduce);
      setTimeout(() => {
        auto.current = false;
      }, 900);
    }, STEP_MS);
    return () => clearInterval(t);
  }, [reduce, hold, open]);

  useEffect(() => () => {
    if (idle.current) clearTimeout(idle.current);
    stop();
  }, []);

  return (
    <div className="mt-14 sm:mt-16">
      <div
        ref={rail}
        onScroll={onScroll}
        onTouchStart={() => setHold(true)}
        onTouchEnd={release}
        className="flex items-stretch overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-px-1 pb-2"
        style={{ gap: GAP }}
        aria-label="Testimonials"
        tabIndex={0}
      >
        {TESTIMONIALS.map((v) => (
          <div
            key={v.name}
            data-card
            className="shrink-0 snap-start w-[86%] sm:w-[400px]"
          >
            <VoiceCard
              v={v}
              onOpen={(el) => show(v, el)}
              onEnter={(el) => enter(v, el)}
              onLeave={drop}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        {([-1, 1] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            onClick={() => go(dir)}
            disabled={dir === -1 && atStart}
            aria-label={dir === -1 ? "Previous testimonials" : "Next testimonials"}
            className="flex items-center justify-center w-11 h-11 rounded-full bg-white text-carbon transition-colors hover:bg-[#F5F5F7] disabled:opacity-40 disabled:cursor-default"
            style={{ boxShadow: `inset 0 0 0 1px ${HAIR}` }}
          >
            {dir === -1 ? <ArrowLeft className="w-4 h-4" aria-hidden /> : <ArrowRight className="w-4 h-4" aria-hidden />}
          </button>
        ))}
        <span className="sr-only">{atEnd ? "End of testimonials" : ""}</span>
      </div>

      <AnimatePresence>
        {open && <ReviewPop key={open.v.name} v={open.v} from={open.from} onKeep={stop} onLeave={drop} onClose={close} />}
      </AnimatePresence>
    </div>
  );
}

export function AboutClients() {
  return (
    <Section surface="white" id="customers" padding="tight">
      <style>{`
        @keyframes abtcl-run {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .abtcl-track {
          display: flex;
          width: max-content;
          animation: abtcl-run 92s linear infinite;
        }
        .abtcl-wrap:hover .abtcl-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .abtcl-track { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Customers & collaboration"
        top="Built through real"
        bottom="Operational relationships."
        size="compact"
        width="wide"
        body="RAMS Digital publicly recognises relationships with organisations across logistics, manufacturing, engineering, retail and industrial operations."
        className="!mb-12 sm:!mb-14"
      />

      <div
        className="abtcl-wrap relative overflow-hidden"
        style={{ WebkitMaskImage: EDGE_FADE, maskImage: EDGE_FADE }}
      >
        <div className="abtcl-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {CLIENTS.map((c) => (
                <span
                  key={c.slug}
                  className="group flex items-center justify-center h-[64px] px-8 sm:px-10 shrink-0"
                >
                  <Image
                    src={`/clients/${c.slug}.png`}
                    alt={copy === 1 ? "" : c.name}
                    width={c.w}
                    height={c.h}
                    className="h-[30px] sm:h-[34px] w-auto object-contain grayscale opacity-55 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                  />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Voices />
    </Section>
  );
}
