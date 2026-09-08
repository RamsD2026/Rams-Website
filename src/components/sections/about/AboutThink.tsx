"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 08 — How we think.
 *
 * Four principles on a track, two in view at a time. This is the home page's
 * Industries carousel, value for value: the same card, the same motion and the
 * same dot pill.
 *
 * ── It is the same component in everything but its data ─────────────
 * `IndustriesCarousel` is the pattern this site already ships for a track of
 * picture cards, so nothing here is re-derived:
 *
 *   the viewport is clipped and measured by a `ResizeObserver`
 *   width = card * (visible + PEEK) + GAP * (visible - 1)   PEEK 0.15, GAP 20
 *   the spring is 220 / 30 / 0.9
 *   the card is 560 tall on a 28px radius, the photograph full bleed
 *   the media sits at 1.04 and goes to 1.12 on hover
 *   grain, then a bottom gradient at 0.85 going to 1
 *   the copy sits at the bottom edge and rises 6px
 *   the dot pill is 44 tall on #F0F0F2, the active dot 24 x 6
 *
 * Sizing the card from the measured viewport rather than from a breakpoint is
 * what keeps the peek proportional at every width instead of being a number
 * that only holds at 1440.
 *
 * ── What is different, and why ──────────────────────────────────────
 * Two in view rather than three, because that is what was asked for and
 * because four items over three stops is a track the reader can finish. On the
 * 1232 measure two gives a 563.7px card, so the photograph is half again the
 * size it is on the home page.
 *
 * No arrow button, and no cursor. An industry card opens a modal; a principle
 * goes nowhere, and an affordance that does nothing when pressed is worse than
 * no affordance. No index over the picture either: the copy is the title and
 * its line, nothing above them. The hover glow is orange on all four rather
 * than a colour per card — the home page's accents exist to separate eight
 * industries with nothing else telling them apart, and four principles read in
 * the order they are laid out.
 *
 * The last stop flushes the track to the right edge rather than landing on
 * `2 * step`. With a peek the two are not the same: stepping by a whole card
 * twice overshoots by the width of the peek, and the track would end with 85px
 * of empty ground where a card should be.
 *
 * ── The photography ─────────────────────────────────────────────────
 * One per principle, and each is the principle rather than a warehouse that
 * happens to be nearby:
 *
 *   01  a clean aisle straight down its centre line, one worker far down it
 *   02  a gauge held against a dented upright, a tablet in the other hand
 *   03  a supervisor handing a tablet across to a technician, tools at his feet
 *   04  one bay cordoned and worked on while the rest of the floor runs
 *
 * Generated rather than taken from a stock library — an unlicensed asset on a
 * live commercial site is a real exposure — and every prompt asked for no
 * text, no signage and no logos, so nothing in frame is a mark that belongs to
 * somebody. Cropped to the card's own ratio and exported at 1128×1120, 2× the
 * card, so nothing is upscaled under `object-cover`. 63–234KB each.
 */

const PRINCIPLES: {
  img: string;
  alt: string;
  n: string;
  title: string;
  body: string;
}[] = [
  {
    img: "/about/think/clarity.webp",
    alt: "A clean warehouse aisle seen straight down its centre line, racking rising on both sides and one worker walking away in the distance",
    n: "01",
    title: "Clarity before complexity",
    body: "Make the physical situation understandable before adding automation.",
  },
  {
    img: "/about/think/evidence.webp",
    alt: "A gloved hand holding a measuring gauge against a dented steel racking upright, a rugged tablet in the other hand",
    n: "02",
    title: "Evidence before assumption",
    body: "Keep measurements, events, source records and limitations visible.",
  },
  {
    img: "/about/think/action.webp",
    alt: "A warehouse supervisor handing a rugged tablet across to a maintenance technician, a tool bag at their feet",
    n: "03",
    title: "Action before reporting",
    body: "Connect findings to ownership, response, verification and learning.",
  },
  {
    img: "/about/think/evolution.webp",
    alt: "A warehouse floor seen from above, one area cordoned with safety barriers and worked on by two technicians while the rest of the building operates",
    n: "04",
    title: "Evolution before disruption",
    body: "Start with one valuable use case and expand the operating system over time.",
  },
];

const GAP = 20;
/** 15% of a card left visible, so the track reads as a track. */
const PEEK = 0.15;
const CARD_H = 560;

export function AboutThink() {
  const viewport = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [at, setAt] = useState(0);
  const [visible, setVisible] = useState(2);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const update = () => setVisible(window.innerWidth < 640 ? 1 : 2);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // The card is sized from the measured viewport, not from a breakpoint, so
  // the peek stays proportional at every width.
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const card =
    width > 0 ? (width - GAP * (visible - 1)) / (visible + PEEK) : 560;
  const step = card + GAP;
  const last = Math.max(0, PRINCIPLES.length - visible);

  // Clamped on read rather than in an effect: when the viewport narrows to one
  // card `last` drops, and correcting a stored index from an effect costs a
  // second render for a value that is derivable here.
  const idx = Math.min(at, last);

  const track = PRINCIPLES.length * card + GAP * (PRINCIPLES.length - 1);
  const x = -Math.min(idx * step, Math.max(0, track - width));

  return (
    <Section surface="offWhite" id="how-we-think">
      <SectionHeader
        eyebrow="How we think"
        top="Four principles"
        bottom="Guide the work."
        size="compact"
        width="wide"
        body="Technology has value only when it improves the reality on the ground."
      />

      <div ref={viewport} className="relative w-full overflow-hidden">
        <motion.div
          className="flex"
          style={{ gap: GAP, willChange: "transform" }}
          animate={{ x }}
          transition={
            reduce
              ? { duration: 0 }
              : { type: "spring", stiffness: 220, damping: 30, mass: 0.9 }
          }
        >
          {PRINCIPLES.map((p, i) => (
            <div key={p.n} style={{ width: card, flexShrink: 0 }}>
              <Card principle={p} index={i} reduce={!!reduce} h={CARD_H} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* The home page's pill, value for value. */}
      <div className="mt-14 flex items-center justify-center">
        <div
          className="flex items-center"
          style={{
            background: "#F0F0F2",
            borderRadius: 999,
            padding: "0 18px",
            height: 44,
            gap: 14,
          }}
        >
          {Array.from({ length: last + 1 }).map((_, i) => {
            const now = i === idx;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setAt(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={now ? "true" : undefined}
                style={{
                  width: now ? 24 : 6,
                  height: 6,
                  borderRadius: 999,
                  background: now ? "var(--color-carbon-alt)" : "#86868B",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  transition:
                    "width 320ms cubic-bezier(0.22,1,0.36,1), background 200ms ease",
                }}
              />
            );
          })}
        </div>
      </div>
    </Section>
  );
}

function Card({
  principle,
  index,
  reduce,
  h,
}: {
  principle: (typeof PRINCIPLES)[number];
  index: number;
  reduce: boolean;
  h: number;
}) {
  return (
    <motion.article
      initial="rest"
      animate="rest"
      whileHover={reduce ? undefined : "hover"}
      className="relative overflow-hidden"
      style={{
        borderRadius: 28,
        width: "100%",
        height: h,
        background: "#15151A",
      }}
    >
      <motion.div
        className="absolute inset-0"
        initial={reduce ? undefined : { opacity: 0, y: 20 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.55, ease: EASE, delay: index * 0.05 }}
      >
        {/* Media — zooms on hover, exactly as the industry card does. */}
        <motion.div
          className="absolute inset-0"
          variants={{ rest: { scale: 1.04 }, hover: { scale: 1.12 } }}
          transition={{ duration: 0.9, ease: EASE }}
          style={{ willChange: "transform" }}
        >
          <Image
            src={principle.img}
            alt={principle.alt}
            fill
            sizes="(max-width: 640px) 88vw, 564px"
            className="object-cover"
          />
        </motion.div>

        {/* Grain */}
        <div
          aria-hidden
          className="absolute inset-0 mix-blend-overlay pointer-events-none opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />

        {/* Bottom gradient — deepens on hover */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          variants={{ rest: { opacity: 0.85 }, hover: { opacity: 1 } }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.45) 65%, rgba(0,0,0,0.82) 100%)",
          }}
        />

        {/* Accent glow — brightens on hover */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            background:
              "radial-gradient(70% 45% at 50% 100%, rgba(255,106,0,0.30) 0%, transparent 70%)",
          }}
        />

        {/* Copy — rises on hover */}
        <motion.div
          className="absolute inset-x-0 bottom-0"
          variants={{ rest: { y: 0 }, hover: { y: -6 } }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ padding: 28 }}
        >
          <h3
            className="text-white text-[24px] lg:text-[26px] font-semibold leading-[1.15]"
            style={{ letterSpacing: "-0.02em", margin: 0 }}
          >
            {principle.title}
          </h3>
          <p
            className="text-white/80 text-[14px] leading-[1.5] max-w-[380px]"
            style={{ marginTop: 8, marginBottom: 0 }}
          >
            {principle.body}
          </p>
        </motion.div>
      </motion.div>
    </motion.article>
  );
}
