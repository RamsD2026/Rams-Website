"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 13 — Global reach.
 *
 * A dotted world map with the places marked on it, then the two facts under
 * it: where the company is, and where the partners are.
 *
 * ── The map ─────────────────────────────────────────────────────────
 * `public/about/reach/world-dots-light.png`, generated from
 * `src/data/countries-110m.json` — the TopoJSON already in this repo — by a
 * script that walks a 1.6° grid, tests each point against the land polygons
 * and writes a dot where it lands. 5,843 dots at 2400×873, 44KB.
 *
 * The dots are baked at #D5D5DD rather than painted black and held back
 * with opacity. 0.13 black on white is the same pixel as #DEDEDE and one
 * fewer thing to get wrong — and this band is light, so the earlier white
 * dots would have been invisible on it.
 *
 * Two things about that generation are worth keeping written down, because
 * both looked like rendering bugs:
 *
 *   Rings that cross the antimeridian are stored wrapped. Fiji's runs -180 to
 *   180 at one latitude, so a naive ray cast called that entire latitude band
 *   land and drew a line of dots across the ocean. The rings are unwrapped
 *   first, and each point is tested at lon, lon+360 and lon-360 — which also
 *   keeps Russia whole rather than splitting it at Chukotka.
 *
 *   The projection is clipped to 75N–56S rather than 90N–90S. Antarctica is a
 *   solid band across the foot of a full map and says nothing here, and the
 *   Arctic islands stretch under equirectangular into a bar along the top.
 *
 * The projection is plain equirectangular, which is what makes the pins
 * cheap: x = (lon + 180) / 360 and y = (75 - lat) / 131, both as percentages
 * of the image, so a marker is two numbers and no projection library ships to
 * the browser.
 *
 * ── The header names no country ─────────────────────────────────────
 * It used to read "Built in India. Globally connected. / Engineering from
 * Pune." Naming the places twice — once in the header and again in the pins
 * and the cards — made the header a caption for the map rather than a
 * statement. The header now says the shape of the thing (one base, many
 * markets) and the map and the two cards say where.
 *
 * ── The pins ────────────────────────────────────────────────────────
 * Pune is the headquarters and is drawn larger with a halo; the three partner
 * markets are smaller and unfilled. That difference is the whole point of the
 * section — one company, three markets it reaches through partners — and it
 * is why they are not all the same dot.
 *
 * The labels say "Partner presence" rather than naming a city, because the
 * source says presence and not offices, and a pin captioned with an office
 * that does not exist is a fabricated fact. That wording is now the only
 * thing qualifying the claim: the source document's footnote — that service
 * availability and local delivery should be confirmed per market — sat under
 * these facts until it was removed on request. Keep the pins saying presence.
 *
 * ── The band is short on purpose ────────────────────────────────────
 * `padding="tight"` rather than the default — 112px against 176px, an
 * existing value on `Section` rather than a number invented here.
 *
 * The map is capped at 960px rather than running to the full 1232 measure.
 * At 2.75:1 the full width is 448px tall and 960 is 349px, so the cap takes
 * a hundred pixels off the band without shrinking the type or crowding
 * anything — and a world map does not get more legible past a point, it just
 * gets taller. The internal gaps came in with it.
 *
 * ── Hover, and what happens without one ─────────────────────────────
 * The tooltip opens on hover and on focus, and every pin is a real `button`
 * in tab order. On a touch screen a tap opens it, and the labels under the
 * facts under it carry the same places in text, so nothing here is only
 * available
 * to a pointer.
 */

/** Equirectangular, clipped 75N to 56S — the same numbers the generator used. */
const LAT_N = 75;
const LAT_SPAN = 131;
const pos = (lon: number, lat: number) => ({
  left: `${((lon + 180) / 360) * 100}%`,
  top: `${((LAT_N - lat) / LAT_SPAN) * 100}%`,
});

const PLACES: {
  id: string;
  lon: number;
  lat: number;
  country: string;
  line: string;
  hq?: boolean;
}[] = [
  {
    id: "pune",
    lon: 73.86,
    lat: 18.52,
    country: "India",
    line: "Baner, Pune — headquarters",
    hq: true,
  },
  {
    id: "usa",
    lon: -98.6,
    lat: 39.8,
    country: "United States",
    line: "Partner presence",
  },
  {
    id: "ireland",
    lon: -6.26,
    lat: 53.35,
    country: "Ireland",
    line: "Partner presence",
  },
  {
    id: "australia",
    lon: 133.8,
    lat: -25.3,
    country: "Australia",
    line: "Partner presence",
  },
];

const FACTS: { label: string; value: string }[] = [
  { label: "Headquarters", value: "Baner, Pune · India" },
  { label: "Global partners", value: "United States · Australia · Ireland" },
];

export function AboutReach() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <Section surface="white" id="reach" padding="tight">
      <SectionHeader
        eyebrow="Global reach"
        top="One engineering base."
        bottom="Partnerships across markets."
        size="compact"
        width="wide"
        body="The platform is built and maintained by a single engineering team, and reaches further markets through published partner relationships."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative w-full max-w-[960px] mx-auto"
        style={{ aspectRatio: "2400 / 873" }}
      >
        <Image
          src="/about/reach/world-dots-light.png"
          alt="A dotted world map"
          fill
          sizes="(max-width: 1024px) 96vw, 960px"
          className="object-contain select-none pointer-events-none"
          priority={false}
        />

        {PLACES.map((p) => {
          const now = open === p.id;
          return (
            <button
              key={p.id}
              type="button"
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              style={pos(p.lon, p.lat)}
              onMouseEnter={() => setOpen(p.id)}
              onMouseLeave={() => setOpen((v) => (v === p.id ? null : v))}
              onFocus={() => setOpen(p.id)}
              onBlur={() => setOpen((v) => (v === p.id ? null : v))}
              onClick={() => setOpen((v) => (v === p.id ? null : p.id))}
              aria-label={`${p.country} — ${p.line}`}
            >
              {/* The headquarters carries a halo and the partner markets do
                  not: the difference between the two is the section. */}
              {p.hq && (
                <span
                  aria-hidden
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: 34,
                    height: 34,
                    background:
                      "radial-gradient(circle, rgba(255,106,0,0.38) 0%, transparent 70%)",
                  }}
                />
              )}
              <span
                className="relative block rounded-full transition-transform duration-300 group-hover:scale-125"
                style={
                  p.hq
                    ? {
                        width: 12,
                        height: 12,
                        background: "#FF6A00",
                        boxShadow: "0 0 0 3px rgba(255,106,0,0.22)",
                      }
                    : {
                        width: 9,
                        height: 9,
                        background: "rgba(255,106,0,0.18)",
                        border: "1.5px solid #FF6A00",
                      }
                }
              />

              <span
                role="tooltip"
                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 whitespace-nowrap text-left transition-all duration-200"
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "#14161A",
                  boxShadow: "0 12px 32px -14px rgba(0,0,0,0.45)",
                  opacity: now ? 1 : 0,
                  transform: `translate(-50%, ${now ? 0 : 4}px)`,
                  pointerEvents: "none",
                }}
              >
                <span className="block text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
                  {p.country}
                </span>
                <span className="block mt-1 text-[12.5px] text-white/70">
                  {p.line}
                </span>
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Two facts, not two cards. A box says "this is a component"; these
          are the caption to the map above them, and a caption is set, not
          boxed. The label is small and orange, the value carries the weight,
          and one hairline separates the pair — which is the whole structure
          the two boxes were drawing four edges each to imply. */}
      <div className="mt-9 sm:mt-10 flex flex-col sm:flex-row items-center justify-center">
        {FACTS.map((f, i) => (
          <div
            key={f.label}
            /* The rule is horizontal when the two stack and vertical when they
               sit side by side, so it is on classes rather than on `style` —
               an inline border cannot be made to change at a breakpoint, and
               a left border on a full-width column reads as a stray mark. */
            className={
              "flex flex-col items-center text-center px-6 sm:px-12 lg:px-16 py-6 sm:py-0 " +
              (i > 0
                ? "w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-[#E8E8ED]"
                : "")
            }
          >
            <span className="text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
              {f.label}
            </span>
            <span className="mt-3.5 text-[19px] sm:text-[22px] font-semibold tracking-[-0.02em] text-carbon leading-[1.35] sm:whitespace-nowrap">
              {f.value}
            </span>
          </div>
        ))}
      </div>

    </Section>
  );
}
