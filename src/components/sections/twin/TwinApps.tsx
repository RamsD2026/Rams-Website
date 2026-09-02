"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Boxes,
  ClipboardCheck,
  Forklift,
  LayoutGrid,
  Network,
  Package,
  ShieldAlert,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Applications.
 *
 * The suites in the site's card treatment — icon tile filling on hover, the
 * conic orange shine on the border, namespaced to this section.
 *
 * ── ROUTES ───────────────────────────────────────────────────────────
 * Only the suites that have a page are links. AIMS has no route yet, so its
 * card renders as a card rather than a dead link; give it an href here when
 * the page exists.
 * ─────────────────────────────────────────────────────────────────────
 */

const LINE = "#E8E8ED";

const APPS: {
  Icon: LucideIcon;
  code: string;
  name: string;
  body: string;
  href?: string;
}[] = [
  {
    Icon: ClipboardCheck,
    code: "IRDS",
    name: "Rack Intelligence",
    body: "Structured digital inspection, condition classification and repair lifecycle.",
    href: "/platform/irds",
  },
  {
    Icon: Forklift,
    code: "MEPS",
    name: "MHE Productivity",
    body: "Utilisation, movement, pallet handling and operator-linked performance.",
    href: "/platform/meps",
  },
  {
    Icon: ShieldAlert,
    code: "RTSS",
    name: "MHE Safety",
    body: "Impact, proximity, pedestrian detection and in-cab intervention.",
    href: "/platform/rtss",
  },
  {
    Icon: Package,
    code: "IROS",
    name: "Inventory Intelligence",
    body: "Physical location accuracy against recorded stock position.",
    href: "/solutions/inventory-intelligence",
  },
  {
    Icon: Boxes,
    code: "ATOS",
    name: "Warehouse Execution",
    body: "Task allocation and route logic calculated on the real layout.",
    href: "/solutions/warehouse-execution",
  },
  {
    Icon: Wrench,
    code: "IMDS",
    name: "MHE Diagnostics",
    body: "Usage- and condition-informed maintenance and lifecycle records.",
    href: "/platform/imds",
  },
  {
    Icon: Network,
    code: "AIMS",
    name: "Management Intelligence",
    body: "Cross-site analytics and remote operational oversight.",
  },
  {
    Icon: LayoutGrid,
    code: "→",
    name: "The full platform",
    body: "How the suites connect on one foundation.",
    href: "/platform/overview",
  },
];

export function TwinApps() {
  return (
    <Section surface="white" id="apps" paddingBottom="strip">
      <style>{`
        @property --twinapps-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .twinapps-card { position: relative; isolation: isolate; }
        .twinapps-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--twinapps-shine-angle),
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
        .twinapps-card:hover::before {
          opacity: 1;
          animation: twinapps-shine 2.4s linear infinite;
        }
        @keyframes twinapps-shine {
          to { --twinapps-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .twinapps-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Applications"
        top="Start with the Digital Twin."
        bottom="Add the applications you need."
        body="The twin can stand alone. The applications are examples of what can be built on it — deployed when the operation is ready for them, not bundled because the platform requires it."
        size="long"
        width="wide"
        bodyWidth="wide"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1180px] mx-auto">
        {APPS.map((a, i) => {
          const inner = (
            <>
              <div className="flex items-center justify-between gap-4">
                <span className="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0 border transition-colors duration-300 bg-[rgba(255,106,0,0.07)] border-[rgba(255,106,0,0.18)] group-hover:bg-signal-orange group-hover:border-signal-orange">
                  <a.Icon
                    className="w-[19px] h-[19px] text-signal-orange transition-colors duration-300 group-hover:text-white"
                    strokeWidth={1.8}
                    aria-hidden
                  />
                </span>
                <span className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-graphite/30 group-hover:text-signal-orange transition-colors duration-300">
                  {a.code}
                </span>
              </div>

              <h3 className="mt-7 flex items-center gap-2 font-rams-heading text-[18px] font-bold tracking-[-0.02em] leading-[1.22] text-carbon">
                {a.name}
                {a.href && (
                  <ArrowRight
                    className="w-4 h-4 text-signal-orange opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                    strokeWidth={2}
                    aria-hidden
                  />
                )}
              </h3>
              <p className="mt-3 text-[13px] leading-[1.6] text-graphite/60">
                {a.body}
              </p>
            </>
          );

          const className =
            "twinapps-card group overflow-hidden flex flex-col p-6 bg-white transition-transform duration-300 hover:-translate-y-1";
          const style = {
            minHeight: 234,
            borderRadius: 14,
            border: `1px solid ${LINE}`,
          };

          return (
            <motion.div
              key={a.code}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: (i % 4) * 0.06, ease: EASE }}
            >
              {a.href ? (
                <Link href={a.href} className={className} style={style}>
                  {inner}
                </Link>
              ) : (
                <div className={className} style={style}>
                  {inner}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
