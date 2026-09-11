"use client";

import Image from "next/image";
import { HERO_CLIENTS } from "@/data/clients";

/**
 * The client strip — the light one, for a light hero.
 *
 * It was `about/AboutClients` and lived in that page's namespace until the
 * case-studies hero needed it too. Two pages importing a component named
 * after a third is how a shared thing ends up copied instead, so it moved
 * here and took a `label` prop with it — `RiqClients` already had one for the
 * same reason.
 *
 * `RiqClients` is the dark version. It reads the same list from a second
 * folder, `public/clients-dark/`, where every mark is reversed for a dark
 * ground with the white letters inside a fill knocked out as cut-outs — see
 * `scripts/gen-dark-clients.mjs`. Same list, same 46s loop, same edge fade,
 * same pause-on-hover and reduced-motion handling; only the files differ.
 *
 * ── The light treatment ─────────────────────────────────────────────
 * The marks are in their real colours here, so the logo-strip convention
 * applies: desaturated and held back so the row reads as one texture, full
 * colour on hover so any single mark can still be identified.
 *
 * The files are transparent PNGs — the white card each was cut from is
 * knocked out — so nothing paints a white tile over the hero's radial ground
 * and its grid.
 *
 * ── The list ────────────────────────────────────────────────────────
 * `HERO_CLIENTS` from `src/data/clients.ts`, the same fourteen the platform
 * heroes carry. This used to be four hand-typed wordmarks with a note saying
 * real files had to come from the customers or from RAMS's own brand pack.
 * They came from the brand pack — `public/logo/` — and the note about never
 * pulling a mark off a logo search still stands for anything not in it.
 */

/** Names enter and leave rather than snapping. */
const EDGE_FADE =
  "linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%)";

export function ClientStrip({
  label = "Trusted on the warehouse floor",
}: {
  /** The line above the marquee. Pass `null` to drop it. */
  label?: string | null;
} = {}) {
  return (
    <div className="relative mt-12 sm:mt-14">
      <style>{`
        @keyframes clstrip {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .clstrip-track {
          display: flex;
          width: max-content;
          animation: clstrip 46s linear infinite;
        }
        .clstrip-wrap:hover .clstrip-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .clstrip-track { animation: none; }
        }
      `}</style>

      {label && (
        <p className="text-center text-[10.5px] font-mono font-semibold tracking-[0.22em] uppercase text-graphite/40 mb-8">
          {label}
        </p>
      )}

      {/* The edges fade the track itself rather than covering it with a painted
          block — the strip sits over the hero's radial ground and its grid, so
          no solid colour can match what is actually behind it here. */}
      <div
        className="clstrip-wrap relative overflow-hidden"
        style={{ WebkitMaskImage: EDGE_FADE, maskImage: EDGE_FADE }}
      >
        <div className="clstrip-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
              {HERO_CLIENTS.map((c) => (
                <span
                  key={copy + c.slug}
                  className="group flex items-center justify-center h-[46px] px-10 shrink-0"
                >
                  <Image
                    src={`/clients/${c.slug}.png`}
                    alt={c.name}
                    width={c.w}
                    height={c.h}
                    className="h-[26px] w-auto object-contain grayscale opacity-55 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
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
