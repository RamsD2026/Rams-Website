"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
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

/** One testimonial: who said it first — monogram, name and company, the
    company's mark at the right — then the quote under an orange
    quotation mark. */
function VoiceCard({ v }: { v: Testimonial }) {
  const mark = v.logo ? LOGOS.get(v.logo) : undefined;
  return (
    <article
      className="flex flex-col h-full bg-white p-7"
      style={{
        borderRadius: 16,
        border: `1px solid ${HAIR}`,
        boxShadow: "0 1px 2px rgba(0,0,0,0.02), 0 10px 30px -14px rgba(0,0,0,0.07)",
      }}
    >
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
          <span className="mt-0.5 text-[12px] text-graphite/55 leading-[1.35] line-clamp-2">{v.company}</span>
        </span>
        {mark && (
          <Image
            src={`/clients/${mark.slug}.png`}
            alt=""
            width={mark.w}
            height={mark.h}
            className="h-5 w-auto max-w-[84px] shrink-0 object-contain grayscale opacity-55"
          />
        )}
      </div>

      <span aria-hidden className="my-6 block" style={{ height: 1, background: HAIR }} />

      <span aria-hidden className="block font-rams-heading text-[40px] leading-[0.6] text-signal-orange">
        &ldquo;
      </span>
      <p className="mt-3 text-[14.5px] leading-[1.7] text-carbon/75">{v.quote}</p>
    </article>
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
    if (hold) return;
    const t = setInterval(() => {
      auto.current = true;
      advance(rail.current, 1, !reduce);
      setTimeout(() => {
        auto.current = false;
      }, 900);
    }, STEP_MS);
    return () => clearInterval(t);
  }, [reduce, hold]);

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
            <VoiceCard v={v} />
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
