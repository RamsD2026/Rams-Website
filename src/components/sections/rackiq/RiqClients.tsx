"use client";

/**
 * Client strip under the hero video.
 *
 * Monochrome wordmarks on a continuous marquee, edge-faded so names enter and
 * leave rather than snapping. Swap a name for an <Image> here when the real
 * logo files land — the row height is fixed so the layout won't move.
 *
 * NOTE: the list below is only the warehouses actually named in the IRDS
 * dashboard screenshots. It is a claim about who the customers are, so
 * nothing goes in it that has not been confirmed.
 */

const CLIENTS = ["Welspun", "Mahindra Logistics", "Indospace", "ESR"];

/** Names enter and leave rather than snapping. Transparent at both ends so it
    works on any surface — see the note where it is applied. */
const EDGE_FADE =
  "linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%)";

export function RiqClients() {
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

      <p className="text-center text-[10.5px] font-mono font-semibold tracking-[0.22em] uppercase text-white/30 mb-7">
        Trusted on the warehouse floor
      </p>

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
              {CLIENTS.map((c) => (
                <span
                  key={copy + c}
                  className="flex items-center justify-center h-[46px] px-9 shrink-0"
                >
                  <span
                    className="text-[17px] sm:text-[19px] font-semibold tracking-[-0.01em] whitespace-nowrap transition-colors duration-300 text-white/40 hover:text-white/85"
                    style={{
                      // brushed-metal sheen rather than flat white
                      background:
                        "linear-gradient(105deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.95) 38%, rgba(255,255,255,0.5) 62%, rgba(255,255,255,0.85) 100%)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                      opacity: 0.55,
                    }}
                  >
                    {c}
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
