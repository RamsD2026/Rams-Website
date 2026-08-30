"use client";

/**
 * Client strip under the hero video.
 *
 * Monochrome wordmarks on a continuous marquee, edge-faded so names enter and
 * leave rather than snapping. Swap a name for an <Image> here when the real
 * logo files land — the row height is fixed so the layout won't move.
 *
 * NOTE: the list below is taken from the warehouses shown in the IRDS
 * dashboard screenshots. Confirm it before this goes public — a client strip
 * is a claim about who the customers are.
 */

const CLIENTS = [
  "Welspun",
  "Mahindra Logistics",
  "Indospace",
  "ESR",
  "Flipkart",
  "DHL Supply Chain",
  "Reliance Retail",
  "Delhivery",
];

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

      <div className="riq-clients-wrap relative overflow-hidden">
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

        {/* edge fades */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40"
          style={{
            background: "linear-gradient(to right, #0E0E0F, transparent)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40"
          style={{
            background: "linear-gradient(to left, #0E0E0F, transparent)",
          }}
        />
      </div>
    </div>
  );
}
