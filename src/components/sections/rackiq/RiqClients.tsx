"use client";

import Image from "next/image";
import { HERO_CLIENTS } from "@/data/clients";

/**
 * Client strip under the hero video, on the dark platform heroes.
 *
 * The marks now come from `src/data/clients.ts`, which reads RAMS's own asset
 * pack in `public/logo/`. This used to be four hand-typed wordmarks with a
 * note saying to swap them for images when the real files landed. They have.
 *
 * ── The dark treatment ──────────────────────────────────────────────
 * Every file is a transparent PNG in the mark's real colours, which is right
 * on a light ground and useless here: Caterpillar's black and Ferrero's brown
 * vanish against #0E0E0F. So they render as flat white silhouettes —
 * `brightness(0) invert(1)` collapses any colour, dark or light, to white —
 * held at 0.5 and coming up to 0.9 on hover. That is one line of CSS rather
 * than a second set of files, and it is what the wordmarks were already
 * doing: white, held back, brighter on hover.
 *
 * The row height stays 46px and each cell is a flex box, so the layout is
 * unchanged from the wordmark version that shipped on nine heroes.
 */

/** Names enter and leave rather than snapping. Transparent at both ends so it
    works on any surface — see the note where it is applied. */
const EDGE_FADE =
  "linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%)";

export function RiqClients({
  /**
   * The line above the marquee. Pass `null` to drop it where the hero above
   * already carries the claim — opt-in, so the four heroes that shipped with
   * it are unaffected.
   */
  label = "Trusted on the warehouse floor",
}: {
  label?: string | null;
} = {}) {
  return (
    <div className="relative mt-14 sm:mt-16">
      <style>{`
        @keyframes riq-clients {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .riq-clients-track {
          display: flex;
          width: max-content;
          animation: riq-clients 46s linear infinite;
        }
        .riq-clients-wrap:hover .riq-clients-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .riq-clients-track { animation: none; }
        }
      `}</style>

      {label && (
        <p className="text-center text-[10.5px] font-mono font-semibold tracking-[0.22em] uppercase text-white/30 mb-7">
          {label}
        </p>
      )}

      {/* The edges fade the track itself rather than covering it with a
          painted block — the strip sits on a radial gradient with the beams
          and the orange glow over it, so no solid colour can match what is
          actually behind it at this height. */}
      <div
        className="riq-clients-wrap relative overflow-hidden"
        style={{
          WebkitMaskImage: EDGE_FADE,
          maskImage: EDGE_FADE,
        }}
      >
        <div className="riq-clients-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
              {HERO_CLIENTS.map((c) => (
                <span
                  key={copy + c.slug}
                  className="flex items-center justify-center h-[46px] px-9 shrink-0"
                >
                  <Image
                    src={`/clients/${c.slug}.png`}
                    alt={c.name}
                    width={c.w}
                    height={c.h}
                    className="h-[26px] w-auto object-contain opacity-50 transition-opacity duration-300 hover:opacity-90"
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
