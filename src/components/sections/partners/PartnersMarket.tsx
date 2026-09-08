"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 07 — What partners can take to market.
 *
 * Seven products on a row that scrolls, with the home page's dot pill under
 * it.
 *
 * ── The mechanism is the site's own ─────────────────────────────────
 * `IndustriesCarousel` on the home page, and `AmsUseCases` on the platform
 * pages, already solve this: a clipped viewport, a `ResizeObserver` on it,
 * and the card width solved from the measured width rather than from a
 * breakpoint —
 *
 *   width = card * (visible + PEEK) + GAP * (visible - 1)
 *
 * so the peek of the next card stays proportional at every width instead of
 * being a number that only holds at 1440. The spring is 220 / 30 / 0.9, the
 * same one both of those use.
 *
 * The control is the dot pill, not chevrons: 44 tall on #F0F0F2, the active
 * dot growing to 24 x 6 on a 320ms `cubic-bezier(0.22,1,0.36,1)`. That is
 * what the home page ships.
 *
 * ── Why it scrolls now ──────────────────────────────────────────────
 * It was a full-width Digital Twin row above a six-up grid — eight cards'
 * worth of vertical space for what is really one list. On a track the reader
 * moves through the list instead of scrolling past it, and the Twin becomes
 * the first card rather than a banner, which is also more honest: it is the
 * first thing a partner connects to, not a headline over the others.
 *
 * ── The lines come from the site, not from the brief ────────────────
 * The source document gives each product a code and a two-word name and
 * nothing else, which is too thin for a card. The one-line descriptions are
 * `AboutPlatform`'s, already shipped on `/company/about` — so the same
 * product says the same thing in both places.
 *
 * ── IROS has no page ────────────────────────────────────────────────
 * It is named across the site and has no route under `src/app`, so its card
 * does not link. A link to a 404 is worse than no link, and this is the call
 * `TwinApps` and `AboutPlatform` already made. Add the href when the page
 * exists and the card becomes a link with no other change — the two branches
 * are the same markup.
 */

const MODULES: {
  code: string;
  name: string;
  body: string;
  href?: string;
}[] = [
  {
    code: "Digital Twin",
    name: "Physical context",
    body: "Physical context, asset identity and lifecycle history, kept current — the layer every module below stands on.",
    href: "/platform/digital-twin",
  },
  {
    code: "IRDS",
    name: "Rack intelligence",
    body: "Inspection, risk classification, corrective action and lifecycle intelligence.",
    href: "/platform/irds",
  },
  {
    code: "MEPS",
    name: "MHE productivity",
    body: "Movement, utilisation, travel, idle time and operational efficiency.",
    href: "/platform/meps",
  },
  {
    code: "RTSS",
    name: "Real-time safety",
    body: "Impact, driver behaviour, zones, alerts and preventive action.",
    href: "/platform/rtss",
  },
  {
    code: "IROS",
    name: "Inventory visibility",
    body: "Location, movement, dwell, accuracy and storage optimisation.",
  },
  {
    code: "IMDS",
    name: "MHE diagnostics",
    body: "Condition, faults, battery health, maintenance and equipment lifecycle.",
    href: "/platform/imds",
  },
  {
    code: "AIMS",
    name: "Management insight",
    body: "Multi-site visibility, cross-module analytics and decision support.",
    href: "/platform/security",
  },
];

const GAP = 20;
const PEEK = 0.15;
const HAIR = "#E8E8ED";

const CARD = {
  borderRadius: 14,
  border: `1px solid ${HAIR}`,
  boxShadow: "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
} as const;

function Body({ m }: { m: (typeof MODULES)[number] }) {
  return (
    <div className="flex flex-col h-full p-7">
      <span className="text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
        {m.code}
      </span>

      {/* Two lines reserved: at a quarter of the measure "Inventory
          visibility" wraps and "Rack intelligence" does not, and a row of
          cards with their bodies at two heights reads as a mistake. */}
      <h3 className="mt-4 min-h-[2.4em] text-[19px] sm:text-[20px] font-semibold tracking-[-0.02em] text-carbon leading-[1.2]">
        {m.name}
      </h3>

      <p className="mt-2.5 text-[14px] leading-[1.6] text-graphite/60">
        {m.body}
      </p>

      <span className="mt-auto pt-6">
        {m.href ? (
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-carbon transition-colors duration-300 group-hover:text-signal-orange">
            Explore
            <ArrowRight
              className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-[3px]"
              aria-hidden
            />
          </span>
        ) : (
          <span className="text-[13px] font-semibold text-graphite/35">
            Talk to us
          </span>
        )}
      </span>
    </div>
  );
}

export function PartnersMarket() {
  const viewport = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(4);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const read = () => {
      const vw = window.innerWidth;
      setVisible(vw < 640 ? 1 : vw < 1024 ? 2 : vw < 1280 ? 3 : 4);
    };
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const read = () => setWidth(el.clientWidth);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const card =
    width > 0 ? (width - GAP * (visible - 1)) / (visible + PEEK) : 300;
  const step = card + GAP;
  const last = Math.max(0, MODULES.length - visible);

  /* Clamped during render, not in an effect — a resize can shrink `last`
     below the current index. */
  const at = Math.min(index, last);

  return (
    <Section surface="white" id="market">
      <style>{`
        @property --ptrmkt-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .ptrmkt-card { position: relative; isolation: isolate; }
        .ptrmkt-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--ptrmkt-shine-angle),
            transparent 0deg,
            transparent 300deg,
            rgba(255,106,0,0.9) 340deg,
            transparent 360deg
          );
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
                  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
          z-index: 1;
        }
        .ptrmkt-card:hover::before {
          opacity: 1;
          animation: ptrmkt-shine 2.4s linear infinite;
        }
        @keyframes ptrmkt-shine {
          to { --ptrmkt-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ptrmkt-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="What partners take to market"
        top="One platform."
        bottom="Multiple customer entry points."
        size="compact"
        width="wide"
        body="Start with a defined operational problem, then expand as the customer connects more assets, sites and workflows."
        className="!mb-10 sm:!mb-12"
      />

      <div ref={viewport} className="relative w-full overflow-hidden">
        <motion.div
          className="flex items-stretch"
          style={{ gap: GAP, willChange: "transform" }}
          animate={{ x: -at * step }}
          transition={
            reduce
              ? { duration: 0 }
              : { type: "spring", stiffness: 220, damping: 30, mass: 0.9 }
          }
        >
          {MODULES.map((m) => (
            <div key={m.code} style={{ width: card, flexShrink: 0 }}>
              {m.href ? (
                <Link
                  href={m.href}
                  className="ptrmkt-card group block h-full bg-white transition-all duration-300 hover:-translate-y-1"
                  style={CARD}
                >
                  <Body m={m} />
                </Link>
              ) : (
                <div className="ptrmkt-card h-full bg-white" style={CARD}>
                  <Body m={m} />
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </div>

      {/* the home page's pill, value for value */}
      <div className="mt-12 flex items-center justify-center">
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
            const now = i === at;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
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
