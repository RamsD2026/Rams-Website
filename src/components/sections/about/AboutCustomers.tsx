"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { CLIENTS } from "@/data/clients";
import { Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 11 — Customers and collaboration.
 *
 * One section, two lines, both travelling forward: the names above, the
 * reviews below.
 *
 * ── Why one section and not two ─────────────────────────────────────
 * The names and the words are one claim. Split across two sections they read
 * as two, and the second repeats the first one's job — the reader has already
 * been told who the customers are by the time the quotes arrive. Together the
 * strip states the who and the row states the what, and neither needs its own
 * heading.
 *
 * ── Why a moving row and not the wall ───────────────────────────────
 * The wall this replaced put eight cards in four columns, which gave the
 * section two shapes with nothing joining them. One line under another, both
 * running the same way, is one object: the eye reads a single band of
 * evidence rather than a strip plus a grid.
 *
 * The names run at 58s and the cards at 76s. A card is far wider than a
 * wordmark, so the slower loop puts the two lines at close to the same
 * apparent speed while keeping them out of step. Both hold while the pointer
 * is over them and both stop under `prefers-reduced-motion`.
 *
 * ── The card ────────────────────────────────────────────────────────
 * Identity leads, because in a row that moves the reader has a second to
 * decide whether to stop: the monogram, the name, the role and the rating on
 * one line, a hairline, then the words, and the company at the foot in mono.
 * Fixed at 400px so the loop is even, and no height is set — a flex row
 * stretches every item to the tallest, so the cards match without a number
 * being invented for it.
 *
 * ══════════════════════════════════════════════════════════════════════
 *  THE EIGHT REVIEWS ARE PLACEHOLDERS. REPLACE BEFORE LAUNCH.
 * ══════════════════════════════════════════════════════════════════════
 *
 * Nobody said these words. The names and the ratings are invented too, and
 * that is safe only because of the field that is not: `company` is a
 * category — "3PL operator", "FMCG manufacturer" — never a real business. An
 * invented person at an unnamed generic operator is a placeholder and
 * identifies nobody. The same invented quote with "Nestlé" or "Siemens" under
 * it is a false statement about a real company, actionable against RAMS
 * whatever note sits beside it. So `company` is the field that has to change
 * first, and it has to change to something true. A star rating implies a
 * survey; replace those with what was actually given.
 *
 * The portraits are placeholders on the same terms. They are of nobody: no
 * real person is depicted, and none is named as an employee of any company.
 * Replace them with real headshots alongside the real quotes, or unset
 * `avatar` and the card falls back to the monogram it carried before.
 *
 * ── The names line ─────────────────────────────────────────────────
 * All fifty-nine marks in `src/data/clients.ts`, which reads RAMS's own asset
 * pack in `public/logo/`. The hero strips carry a fourteen-mark subset of the
 * same list — a hero strip is a glance, and this is the section those
 * companies are the subject of, so it runs the lot.
 *
 * They are transparent PNGs in their real colours, held back in greyscale at
 * 0.55 so the line reads as one texture, and coming to full colour on hover
 * so any single mark can still be identified.
 *
 * Nothing goes in `public/clients/` that did not come out of `public/logo/`.
 * A mark pulled off a logo search is somebody's trademark on a live
 * commercial site, and an AI-drawn one is a forgery of it.
 */

type Voice = {
  quote: string;
  /** 1–5. Only ship a number somebody actually gave. */
  rating: number;
  name: string;
  role: string;
  /** A category while this is a placeholder. The real company, once known. */
  company: string;
  /** `/about/voices/<file>.webp`. Falls back to the monogram when unset. */
  avatar?: string;
};

const VOICES: Voice[] = [
  {
    quote:
      "We stopped arguing about whether a rack was damaged and started arguing about how fast we could close it. That is a much better argument to be having.",
    rating: 5,
    name: "Arjun Mehta",
    avatar: "/about/voices/arjun.webp",
    role: "Head of warehouse operations",
    company: "3PL operator",
  },
  {
    quote:
      "The inspection record used to live in a spreadsheet and somebody's memory. Now it lives with the bay, and it is still there twelve months later.",
    rating: 5,
    name: "Priya Nair",
    avatar: "/about/voices/priya.webp",
    role: "Safety manager",
    company: "FMCG manufacturer",
  },
  {
    quote:
      "What changed was not the reporting. It was that every finding arrived with an owner attached.",
    rating: 4,
    name: "Rahul Deshpande",
    avatar: "/about/voices/rahul.webp",
    role: "Site engineering lead",
    company: "Industrial plant",
  },
  {
    quote:
      "We could see which aisle the impacts were happening in, and then we could see why. The layout change paid for itself in a quarter.",
    rating: 5,
    name: "Sneha Kulkarni",
    avatar: "/about/voices/sneha.webp",
    role: "Operations director",
    company: "Distribution centre",
  },
  {
    quote:
      "Our maintenance was on a calendar. It is now on actual running hours, and the difference showed up in the availability numbers almost immediately.",
    rating: 5,
    name: "Vikram Rao",
    avatar: "/about/voices/vikram.webp",
    role: "Fleet manager",
    company: "Logistics facility",
  },
  {
    quote:
      "The first thing it did was tell us how much we did not know about our own floor. That was uncomfortable and then it was useful.",
    rating: 4,
    name: "Ananya Iyer",
    avatar: "/about/voices/ananya.webp",
    role: "General manager",
    company: "Retail distribution",
  },
  {
    quote:
      "Rolling it out one aisle at a time meant the operation never stopped to accommodate the software. That mattered more than any feature.",
    rating: 5,
    name: "Karthik Menon",
    avatar: "/about/voices/karthik.webp",
    role: "Continuous improvement lead",
    company: "Automotive supplier",
  },
  {
    quote:
      "Audits used to take a week of preparation. The evidence is now already assembled, because it was assembled as the work happened.",
    rating: 5,
    name: "Divya Sharma",
    avatar: "/about/voices/divya.webp",
    role: "Compliance manager",
    company: "Pharmaceutical warehouse",
  },
];

const HAIR = "#E8E8ED";

/** Content enters and leaves rather than snapping. */
const EDGE_FADE =
  "linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)";

/** Up to two initials, for the monogram. */
function initials(s: string) {
  return s
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function Rating({ n }: { n: number }) {
  return (
    <span
      className="flex items-center gap-[3px] shrink-0"
      aria-label={`${n} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden
          className="w-[13px] h-[13px]"
          strokeWidth={0}
          /* The unfilled stars are the same orange at 0.18 rather than grey —
             a grey star beside an orange one reads as broken, not as empty. */
          style={{ fill: i <= n ? "#FF6A00" : "rgba(255,106,0,0.18)" }}
        />
      ))}
    </span>
  );
}

/**
 * One line of the band. The content is rendered twice so the -50% translate
 * lands exactly where it started; the second copy is hidden from the reader.
 */
function Line({
  seconds,
  children,
}: {
  seconds: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="abtcust-wrap relative overflow-hidden"
      style={{ WebkitMaskImage: EDGE_FADE, maskImage: EDGE_FADE }}
    >
      <div
        className="abtcust-track"
        style={{ animationDuration: `${seconds}s` }}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-stretch"
            aria-hidden={copy === 1}
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AboutCustomers() {
  return (
    <Section surface="white" id="customers">
      <style>{`
        @keyframes abtcust-run {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .abtcust-track {
          display: flex;
          width: max-content;
          animation-name: abtcust-run;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .abtcust-wrap:hover .abtcust-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .abtcust-track { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Customers & collaboration"
        top="Built through real"
        bottom="Operational relationships."
        size="compact"
        width="wide"
        body="RAMS Digital publicly recognises relationships with organisations across logistics, manufacturing, engineering, retail and industrial operations."
      />

      {/* the who */}
      <Line seconds={92}>
        {CLIENTS.map((c) => (
          <span
            key={c.slug}
            className="group flex items-center justify-center h-[64px] px-8 sm:px-10 shrink-0"
          >
            <Image
              src={`/clients/${c.slug}.png`}
              alt={c.name}
              width={c.w}
              height={c.h}
              className="h-[30px] sm:h-[34px] w-auto object-contain grayscale opacity-55 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
            />
          </span>
        ))}
      </Line>

      {/* the what */}
      <div className="mt-10 sm:mt-12">
        <Line seconds={76}>
          {VOICES.map((v) => (
            <div key={v.name} className="pr-5 shrink-0" style={{ width: 400 }}>
              <article
                className="flex flex-col h-full bg-white p-7"
                style={{
                  borderRadius: 16,
                  border: `1px solid ${HAIR}`,
                  boxShadow:
                    "0 1px 2px rgba(0,0,0,0.02), 0 10px 30px -14px rgba(0,0,0,0.07)",
                }}
              >
                <div className="flex items-center gap-3">
                  {v.avatar ? (
                    <Image
                      src={v.avatar}
                      alt=""
                      width={120}
                      height={120}
                      className="w-11 h-11 shrink-0 rounded-full object-cover"
                      style={{ border: `1px solid ${HAIR}` }}
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="flex items-center justify-center w-11 h-11 shrink-0 text-[12px] font-mono font-bold text-signal-orange"
                      style={{
                        borderRadius: 999,
                        background: "rgba(255,106,0,0.08)",
                        border: "1px solid rgba(255,106,0,0.18)",
                      }}
                    >
                      {initials(v.name)}
                    </span>
                  )}

                  <span className="flex flex-col min-w-0 flex-1">
                    <span className="text-[14px] font-semibold text-carbon leading-[1.3] truncate">
                      {v.name}
                    </span>
                    <span className="mt-0.5 text-[12px] text-graphite/55 leading-[1.35] truncate">
                      {v.role}
                    </span>
                  </span>

                  <Rating n={v.rating} />
                </div>

                <span
                  aria-hidden
                  className="my-6 block"
                  style={{ height: 1, background: HAIR }}
                />

                <p className="text-[14.5px] leading-[1.7] text-carbon/75">
                  {v.quote}
                </p>

                {/* The company sits at the foot, so the four cards in view
                    line their last row up however long the quote runs. */}
                <span className="mt-auto pt-6 text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/40">
                  {v.company}
                </span>
              </article>
            </div>
          ))}
        </Line>
      </div>
    </Section>
  );
}
