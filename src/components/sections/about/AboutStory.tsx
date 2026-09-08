"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 03 — Our story.
 *
 * Centred `SectionHeader` at `compact`, then the four stages as picture cards.
 *
 * ── The photography ─────────────────────────────────────────────────
 * Four images, one per stage, and each is the stage rather than a warehouse
 * that happens to be nearby:
 *
 *   01  an engineer crouched at a rack frame examining a bent upright
 *   02  a scanner held to a blank asset label on an upright
 *   03  a sensor and camera on a column, a truck crossing out of focus below
 *   04  two staff at a floor control desk, the warehouse through the glass
 *
 * They were generated rather than taken from a stock library — an unlicensed
 * asset on a live commercial site is a real exposure — and every prompt asked
 * for no text, no signage and no logos, so nothing in frame is a mark that
 * belongs to somebody. The labels and screens are deliberately blank or out of
 * focus for the same reason: invented barcodes and invented dashboards are
 * fabricated detail.
 *
 * Exported at 586×440, which is 2× the 293px card on the 1232 measure and no
 * more. 24–50KB each.
 *
 * ── Why cards, and how the sequence survives ────────────────────────
 * This section replaced a stepped rail. A rail carries order in its geometry
 * and a card grid does not, so the order moved into the kicker — `01 · Field
 * experience` — rather than being lost. The images are what earn the change:
 * a rail cannot hold one.
 */

const STAGES: {
  img: string;
  alt: string;
  kicker: string;
  title: string;
  body: string;
}[] = [
  {
    img: "/about/story/field.webp",
    alt: "An engineer in a high-visibility vest crouched at the base of a warehouse racking frame, examining a bent steel upright",
    kicker: "Field experience",
    title: "Understand the physical problem",
    body: "Engineering assessments and warehouse inspections revealed how quickly asset condition and operating reality separate from drawings and reports.",
  },
  {
    img: "/about/story/identity.webp",
    alt: "A gloved hand holding a rugged scanner up to an asset label fixed to a racking upright",
    kicker: "Digital organisation",
    title: "Create persistent asset identity",
    body: "Facilities and physical assets became digitally structured, tagged and connected to inspection, action and lifecycle records.",
  },
  {
    img: "/about/story/live.webp",
    alt: "A sensor unit and camera mounted high on a warehouse column, with a forklift crossing an aisle below",
    kicker: "Live connection",
    title: "Bring operations into the model",
    body: "Sensor, MHE, inventory, safety and enterprise data added a live layer to the physical context.",
  },
  {
    img: "/about/story/platform.webp",
    alt: "Two operations staff at a warehouse-floor control desk, the racking visible through the glass behind them",
    kicker: "Physical operating system",
    title: "Build applications around reality",
    body: "RAMS evolved into a platform where operational applications and customer-specific workflows run against the same Digital Twin foundation.",
  },
];

export function AboutStory() {
  return (
    <Section surface="white" id="story">
      <SectionHeader
        eyebrow="Our story"
        top="Built from the"
        bottom="Ground reality up."
        size="compact"
        width="wide"
        body="RAMS did not begin with a generic dashboard. It grew from hands-on engineering and inspection work, where physical assets, operational risks and corrective actions were still managed through static records."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STAGES.map((s, i) => (
          <motion.article
            key={s.kicker}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            className="group flex flex-col overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1"
            style={{
              borderRadius: 14,
              border: "1px solid #E8E8ED",
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
            }}
          >
            {/* The picture is the top of the card, edge to edge — a photograph
                inset inside a padded card reads as an attachment rather than
                as the card's subject. */}
            <div
              className="relative w-full overflow-hidden shrink-0"
              style={{ aspectRatio: "4 / 3" }}
            >
              <Image
                src={s.img}
                alt={s.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 293px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>

            <div className="flex flex-col p-6 sm:p-7">
              {/* A card grid carries no order, so the stage number moves into
                  the kicker rather than being lost with the rail. */}
              <span className="text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange tabular-nums">
                0{i + 1} · {s.kicker}
              </span>

              {/* Two lines reserved — three of the four titles wrap. */}
              <h3 className="mt-3.5 min-h-[2.4em] text-[20px] sm:text-[22px] font-semibold tracking-[-0.02em] text-carbon leading-[1.2]">
                {s.title}
              </h3>

              <p className="mt-3 text-[14.5px] leading-[1.6] text-graphite/60">
                {s.body}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
