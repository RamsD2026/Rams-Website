"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
    clamped to three lines, and a "Read full review" prompt. The whole card
    opens the full review. */
function VoiceCard({ v, onOpen }: { v: Testimonial; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex flex-col w-full h-full text-left bg-white p-7 transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.25)] focus-visible:outline-2 focus-visible:outline-signal-orange"
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
      <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-carbon transition-colors group-hover:text-signal-orange">
        Read full review
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
      </span>
    </button>
  );
}

/** The full review, a larger card centred over the page with the
    company's mark. Closes on the ✕, a click outside or Escape. */
function ReviewDialog({ v, onClose }: { v: Testimonial; onClose: () => void }) {
  const mark = v.logo ? LOGOS.get(v.logo) : undefined;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal="true"
      aria-label={`Review from ${v.name}`}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        style={{ background: "rgba(6,6,8,0.6)", backdropFilter: "blur(4px)" }}
      />
      <motion.article
        className="relative w-full max-w-[600px] max-h-[86svh] overflow-auto bg-white p-8 sm:p-10"
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ borderRadius: 22, boxShadow: "0 40px 90px -40px rgba(0,0,0,0.6)" }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full bg-[#F2F2F2] hover:bg-[#E8E8ED] transition-colors"
        >
          <X className="w-4 h-4 text-carbon" strokeWidth={2} aria-hidden />
        </button>

        <div className="h-9 flex items-center pr-12">
          {mark ? (
            <Image
              src={`/clients/${mark.slug}.png`}
              alt={mark.name}
              width={mark.w}
              height={mark.h}
              className="h-8 w-auto max-w-[180px] object-contain object-left"
            />
          ) : (
            <span className="text-[15px] font-bold tracking-[-0.01em] text-carbon">{v.company}</span>
          )}
        </div>

        <span aria-hidden className="mt-7 block font-rams-heading text-[52px] leading-[0.6] text-signal-orange">
          &ldquo;
        </span>
        <p className="mt-4 text-[16px] sm:text-[17px] leading-[1.75] text-carbon/80">{v.quote}</p>

        <span aria-hidden className="my-7 block" style={{ height: 1, background: HAIR }} />
        <Who v={v} />
      </motion.article>
    </motion.div>,
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
  const [open, setOpen] = useState<Testimonial | null>(null);
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
            <VoiceCard v={v} onOpen={() => setOpen(v)} />
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
        {open && <ReviewDialog key={open.name} v={open} onClose={() => setOpen(null)} />}
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
