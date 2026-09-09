"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { EASE, SURFACE } from "@/components/sections/rackiq/rackiq-shared";
import { ContactForm } from "./ContactForm";
import { ContactLocations } from "./ContactLocations";

/**
 * The contact page, which is one section.
 *
 * The platform heroes' ground — `SURFACE.darkTop`, the signal-orange glow at
 * `60% 60% at 50% 20%` over 720px at 0.22, and the 72px grid in white at 0.06
 * masked out through the lower half. Value for value from `AmsHero`, so a
 * reader arriving from `/platform` crosses no boundary.
 *
 * ── Why the page is only this ───────────────────────────────────────
 * It carried ten sections: routing cards, direct channels, what to bring,
 * what happens next, four locations, a support and safety pair, a FAQ and a
 * close. All of it was true and none of it was what a visitor came for. A
 * contact page has one job, and every section between the reader and the form
 * is a section they scroll past to reach it.
 *
 * What is worth keeping from those ten is in the footer already — the
 * registered entity, the Pune address, the email and both numbers — and the
 * form's own foot repeats the two direct channels for anyone who does not
 * want a form at all.
 *
 * ── Left states, right acts ─────────────────────────────────────────
 * The copy and the five points on the left, the form on the right. Not
 * centred and not stacked: a form under a paragraph is a page you scroll, and
 * the whole point of the change is that the form is above the fold beside the
 * reason for filling it in.
 *
 * The columns are 0.9fr / 1.1fr. The copy runs to a comfortable measure at
 * about 500px and the form wants the rest — an even split gives the type too
 * wide a measure and squeezes the paired fields into one column each.
 *
 * They align at the top, not on their centres. The two are different heights
 * and always will be, so `items-center` floated the copy down against a taller
 * form and left the eyebrow starting somewhere in the middle of the card. The
 * first line of each column now begins on the same baseline.
 *
 * ── The address sits at the foot of it ──────────────────────────────
 * `ContactLocations` was a section of its own on the light ground below.
 * A contact page's details belong with its form rather than a scroll away
 * from it, so the block moved up here behind a hairline — and it is written
 * for this ground now, not the old one.
 *
 * ── `data-hero-tone` is not set ─────────────────────────────────────
 * Deliberately. That attribute tells the header a hero is light; this one is
 * dark, so the navbar keeps its default transparent-over-dark treatment,
 * which is what every platform hero does.
 */

const POINTS = [
  "A solution-led conversation, not a generic enquiry form",
  "Routed to the right product, engineering, delivery or support team",
  "Rack audits, platform demonstrations, integrations and customer support",
  "Multi-site operations across India and the global partner network",
  "A defined next step — a discovery call, a demonstration or a site visit",
];

export function ContactHero() {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{ background: SURFACE.darkTop }}
      id="top"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[720px]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 20%, rgba(255,106,0,0.22), transparent 70%)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
        }}
      />

      <div className="relative rams-container pt-32 sm:pt-36 lg:pt-40 pb-20 sm:pb-24 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-12 lg:gap-16 items-start">
          {/* ── left: the reason ─────────────────────── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full"
              style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
              <span className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-white/70">
                Contact RAMS Digital
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
              className="mt-7 text-[38px] sm:text-[50px] lg:text-[60px] font-bold leading-[1.06] tracking-[-0.04em] text-white"
            >
              Tell us what is
              <br />
              happening on the ground.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
              className="mt-6 max-w-[540px] text-[15px] sm:text-[16px] leading-[1.65] text-white/55"
            >
              Whether you need a rack audit, a platform demonstration, an
              operational solution or technical support, start with the problem
              you want to solve.
            </motion.p>

            <ul className="mt-9 flex flex-col gap-4">
              {POINTS.map((p, i) => (
                <motion.li
                  key={p}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.3 + i * 0.08,
                    ease: EASE,
                  }}
                  className="flex items-start gap-3.5"
                >
                  {/* A dark orange disc with the tick inside it. Solid orange
                      five times over would spend most of the hero's accent on
                      bullet points; at 0.16 on this ground it still reads as
                      orange and the tick carries the contrast. */}
                  <span
                    className="flex items-center justify-center w-[22px] h-[22px] mt-[1px] shrink-0"
                    style={{
                      borderRadius: 999,
                      background: "rgba(255,106,0,0.16)",
                      border: "1px solid rgba(255,106,0,0.30)",
                    }}
                  >
                    <Check
                      width={12}
                      height={12}
                      strokeWidth={3}
                      className="text-signal-orange"
                      aria-hidden
                    />
                  </span>
                  <span className="text-[14.5px] leading-[1.55] text-white/70">
                    {p}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* ── right: the form ──────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
            id="enquiry"
          >
            <ContactForm />
          </motion.div>
        </div>

        {/* the address and the partner contacts, under the two
            columns and behind a hairline */}
        <ContactLocations />
      </div>
    </section>
  );
}
