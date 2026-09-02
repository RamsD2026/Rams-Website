"use client";

/**
 * Full-bleed keyword marquee that closes the hero.
 * Terms are drawn from the real IRDS module list and inspection vocabulary.
 */

const KEYWORDS = [
  "Rack inspection",
  "Integrity testing",
  "Plumbness",
  "Rack run straightness",
  "System lateral sway",
  "Floor flatness",
  "Beam deflection",
  "Digital rack identity",
  "RAG classification",
  "Inspection findings",
  "TPI findings",
  "Corrective actions",
  "Rack health analytics",
  "Inspection cycles",
  "Rules and action",
  "Bill of quantity",
  "Element stock",
  "Escalation logs",
  "LARC drawings",
  "Compliance records",
];

/** Terms enter and leave rather than snapping. Transparent at both ends so it
    works on any surface. */
const EDGE_FADE =
  "linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)";

export function IrdspKeywords() {
  return (
    <div
      className="relative overflow-hidden py-6"
      style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
    >
      <style>{`
        @keyframes irdsp-kw {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .irdsp-kw-track {
          display: flex;
          width: max-content;
          animation: irdsp-kw 52s linear infinite;
        }
        .irdsp-kw-wrap:hover .irdsp-kw-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .irdsp-kw-track { animation: none; }
        }
      `}</style>

      {/* Masks the track rather than covering it with a painted block — the
          hero sits on a radial gradient, so no solid colour matches what is
          behind the edges. The rule above stays full width. */}
      <div
        className="irdsp-kw-wrap"
        style={{ WebkitMaskImage: EDGE_FADE, maskImage: EDGE_FADE }}
      >
        <div className="irdsp-kw-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
              {KEYWORDS.map((k) => (
                <span key={copy + k} className="flex items-center shrink-0">
                  <span className="text-[11.5px] font-mono font-semibold tracking-[0.16em] uppercase text-white/35 whitespace-nowrap">
                    {k}
                  </span>
                  <span
                    aria-hidden
                    className="w-1 h-1 rounded-full mx-6 shrink-0"
                    style={{ background: "rgba(255,106,0,0.55)" }}
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
