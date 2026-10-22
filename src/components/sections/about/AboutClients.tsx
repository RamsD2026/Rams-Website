"use client";

import Image from "next/image";
import { CLIENTS } from "@/data/clients";
import { Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * Customers & collaboration — the client band from the previous About page
 * (`AboutCustomers`), without its review cards.
 *
 * The reviews there are placeholders (invented quotes, names, ratings and
 * portraits) and stay off the live page until real testimonials replace
 * them; `AboutCustomers` keeps them, with the rules for replacing them.
 *
 * The band runs every mark in `src/data/clients.ts` — RAMS's own asset pack
 * — in greyscale at 0.55, full colour on hover, looping at 92s, holding on
 * hover and stopping under `prefers-reduced-motion`.
 */

/** Content enters and leaves rather than snapping. */
const EDGE_FADE =
  "linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)";

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
    </Section>
  );
}
