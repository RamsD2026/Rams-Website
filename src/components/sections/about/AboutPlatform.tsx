"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 07 — Platform ecosystem.
 *
 * Eight applications in a four-by-two: the code, the name, one line, and a way
 * through where there is somewhere to go.
 *
 * ── Why it looks different to section two ───────────────────────────
 * Section two is also a boxed card grid, so this one has to earn the
 * difference rather than repeat it: no icon tile, a mono code in place of it,
 * and the whole card is a link. Those are the changes that turn a card from a
 * statement into an index entry — which is what these are. Every other section
 * on this page tells the reader something; this one takes them somewhere.
 *
 * The hover border is the site's own — the conic orange sweep that fifty other
 * cards on this site use, namespaced `abtplat` because `@property` and the
 * keyframes are global and two sections sharing a name would fight. It goes on
 * all eight rather than only the six that link: on this site the sweep is the
 * card's own signature rather than a click affordance, and `AboutWhy`'s cards
 * carry it without being links at all.
 *
 * What separates the two on hover is the call to action, not the border: on a
 * linked card it lifts, the arrow moves and "Explore" goes orange; on the two
 * that do not link, none of that happens and the label stays "Talk to us".
 * The affordance is in the thing that would be clicked.
 *
 * Only the span is coloured, not the arrow: lucide strokes with `currentColor`,
 * so the glyph comes with it — one transition rather than two that can fall out
 * of step.
 *
 * ── Two cards do not link, on purpose ───────────────────────────────
 * IROS has no page under `src/app`, and custom applications are a conversation
 * rather than a destination. A link to a 404 is worse than no link, and this
 * is the call `TwinApps` already made when AIMS had no page yet. Add the href
 * when the page exists and the card becomes a link with no other change — the
 * two branches are the same markup.
 *
 * Eight cards in a four-up, so both rows are full. Six would have left a hole,
 * and padding the grid with a ninth invented product is not an option.
 */

const APPS: {
  code: string;
  name: string;
  body: string;
  href?: string;
}[] = [
  {
    code: "IRDS",
    name: "Rack safety",
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
    name: "Inventory intelligence",
    body: "Location, movement, dwell, accuracy and storage optimisation.",
  },
  {
    code: "IMDS",
    name: "MHE diagnostics",
    body: "Condition, faults, battery health, maintenance and equipment lifecycle.",
    href: "/platform/imds",
  },
  {
    code: "ATOS",
    name: "Task orchestration",
    body: "Demand, priority, resources, execution plans and live replanning.",
    href: "/platform/ai-operational-intelligence",
  },
  {
    code: "AIMS",
    name: "Management intelligence",
    body: "Multi-site visibility, cross-module analytics and decision support.",
    href: "/platform/security",
  },
  {
    code: "Custom apps",
    name: "Your operational problem",
    body: "Customer-specific applications built on the same physical context.",
  },
];

const HAIR = "#E8E8ED";

function Body({ app }: { app: (typeof APPS)[number] }) {
  return (
    <div className="flex flex-col h-full p-7">
      <span className="text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
        {app.code}
      </span>

      {/* Two lines reserved — half the names wrap and half do not, and a card
          grid with its bodies at two different heights reads as a mistake. */}
      <h3 className="mt-4 min-h-[2.4em] text-[20px] sm:text-[22px] font-semibold tracking-[-0.02em] text-carbon leading-[1.2]">
        {app.name}
      </h3>

      <p className="mt-2 text-[14.5px] leading-[1.6] text-graphite/60">
        {app.body}
      </p>

      <span className="mt-auto pt-6">
        {app.href ? (
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

export function AboutPlatform() {
  return (
    <Section surface="white" id="platform">
      <style>{`
        @property --abtplat-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .abtplat-card { position: relative; isolation: isolate; }
        .abtplat-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--abtplat-shine-angle),
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
        .abtplat-card:hover::before {
          opacity: 1;
          animation: abtplat-shine 2.4s linear infinite;
        }
        @keyframes abtplat-shine {
          to { --abtplat-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .abtplat-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Platform ecosystem"
        top="One foundation."
        bottom="Multiple operational applications."
        size="compact"
        width="wide"
        body="RAMS applications address specific workflows while remaining connected through the Digital Twin."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {APPS.map((app, i) => (
          <motion.div
            key={app.code}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: (i % 4) * 0.06, ease: EASE }}
            className="h-full"
          >
            {app.href ? (
              <Link
                href={app.href}
                className="abtplat-card group block h-full bg-white transition-all duration-300 hover:-translate-y-1"
                style={{
                  borderRadius: 14,
                  border: `1px solid ${HAIR}`,
                  boxShadow:
                    "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
                }}
              >
                <Body app={app} />
              </Link>
            ) : (
              <div
                className="abtplat-card h-full bg-white"
                style={{
                  borderRadius: 14,
                  border: `1px solid ${HAIR}`,
                  boxShadow:
                    "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
                }}
              >
                <Body app={app} />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
