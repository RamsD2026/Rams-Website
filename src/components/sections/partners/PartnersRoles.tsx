"use client";

import { motion } from "framer-motion";
import {
  AppWindow,
  Brain,
  Check,
  CircuitBoard,
  ClipboardCheck,
  Factory,
  Users,
} from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 05 and 06 — Technology partners, and channel & delivery partners.
 *
 * Two sections in one file because they are the same object with different
 * data: three cards, each an icon, a heading, a line and three things the
 * partner actually does. Writing the card twice would guarantee the two
 * drift apart, which is exactly what happened to the platform pages' bento
 * widgets before they were pulled back together.
 *
 * ── The card ────────────────────────────────────────────────────────
 * A bare orange icon, then the heading, the line, a rule and three ticks.
 *
 * The icon carried a tile behind it and the source document's shorthand — HW,
 * SW, AI, CH, FD, OEM — beside it. Both are gone: a filled square under every
 * icon and a code next to it made the top of the card the heaviest part of
 * it, and the code says nothing the heading does not. `code` survives in the
 * data as the React key.
 *
 * The three bullets are ticks in their own discs rather than bare marks
 * floating beside the text: each is a capability the partner has, not an item
 * in a list, and the disc is what makes it read as confirmed.
 *
 * The conic orange hover sweep is namespaced `ptrrole` — `@property` and the
 * keyframes are global, so two sections sharing a name would fight, and these
 * two sections share this one deliberately.
 *
 * ── Why they are two sections and not one six-up ────────────────────
 * They answer different questions. Five is what you connect; six is what you
 * sell and deliver. A six-card grid would put an AI vendor and a field
 * inspection firm in the same list and leave the reader to work out that they
 * are not the same kind of thing.
 */

type Role = {
  icon: typeof CircuitBoard;
  code: string;
  title: string;
  body: string;
  does: [string, string, string];
};

const TECHNOLOGY: Role[] = [
  {
    icon: CircuitBoard,
    code: "HW",
    title: "Hardware & sensor partners",
    body: "Connect supported edge devices and physical signals to a location-aware operational platform.",
    does: [
      "IoT and environmental sensing",
      "RFID, location and impact systems",
      "Cameras, LiDAR and machine interfaces",
    ],
  },
  {
    icon: AppWindow,
    code: "SW",
    title: "Software & platform partners",
    body: "Exchange the operational data needed to maintain one reliable view of the facility.",
    does: [
      "WMS, ERP, MES and CMMS",
      "Workforce and transport systems",
      "Analytics and reporting platforms",
    ],
  },
  {
    icon: Brain,
    code: "AI",
    title: "AI & specialist intelligence",
    body: "Add domain models, detection services and optimisation logic to physical context and history.",
    does: [
      "Computer vision and pattern detection",
      "Planning and optimisation services",
      "Sector-specific analytical models",
    ],
  },
];

const CHANNEL: Role[] = [
  {
    icon: Users,
    code: "CH",
    title: "Channel partners",
    body: "Introduce, qualify and co-sell RAMS opportunities in agreed sectors or territories.",
    does: [
      "Joint account planning",
      "Solution discovery and demonstrations",
      "Commercial alignment by opportunity",
    ],
  },
  {
    icon: ClipboardCheck,
    code: "FD",
    title: "Field delivery partners",
    body: "Deliver approved inspection and implementation work using defined methods and evidence standards.",
    does: [
      "Structured digital workflows",
      "Training and competency pathways",
      "Quality review and escalation",
    ],
  },
  {
    icon: Factory,
    code: "OEM",
    title: "OEM & service partners",
    body: "Connect the installed asset base with inspections, diagnostics, rectification and lifecycle records.",
    does: [
      "Equipment and component context",
      "Service and replacement workflows",
      "Post-installation visibility",
    ],
  },
];

const HAIR = "#E8E8ED";

const SHINE = `
  @property --ptrrole-shine-angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }
  .ptrrole-card { position: relative; isolation: isolate; }
  .ptrrole-card::before {
    content: "";
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    padding: 1px;
    background: conic-gradient(
      from var(--ptrrole-shine-angle),
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
  .ptrrole-card:hover::before {
    opacity: 1;
    animation: ptrrole-shine 2.4s linear infinite;
  }
  @keyframes ptrrole-shine {
    to { --ptrrole-shine-angle: 360deg; }
  }
  @media (prefers-reduced-motion: reduce) {
    .ptrrole-card:hover::before { animation: none; }
  }
`;

function RoleGrid({ roles }: { roles: Role[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {roles.map((r, i) => (
        <motion.article
          key={r.code}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
          className="ptrrole-card flex flex-col h-full p-7 sm:p-8 bg-white transition-transform duration-300 hover:-translate-y-1"
          style={{
            borderRadius: 14,
            border: `1px solid ${HAIR}`,
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
          }}
        >
          <r.icon
            className="w-[24px] h-[24px] shrink-0 text-signal-orange"
            strokeWidth={1.9}
            aria-hidden
          />

          {/* No reserved height. All six titles fit one line at a third of
              the 1232 measure, so pinning two lines only ever held an empty
              one between every heading and its body. */}
          <h3 className="mt-5 text-[20px] sm:text-[21px] font-bold tracking-[-0.02em] text-carbon leading-[1.2]">
            {r.title}
          </h3>

          <p className="mt-3 text-[14px] leading-[1.65] text-graphite/65">
            {r.body}
          </p>

          <ul className="mt-6 pt-6 space-y-3" style={{ borderTop: `1px solid ${HAIR}` }}>
            {r.does.map((d) => (
              <li key={d} className="flex items-start gap-3">
                {/* The tick sits in its own orange disc rather than floating
                    beside the text — at 0.10 rather than solid, because
                    eighteen filled orange circles is most of a page's orange
                    spent on bullets. */}
                <span
                  className="flex items-center justify-center w-[18px] h-[18px] mt-[2px] shrink-0"
                  style={{
                    borderRadius: 999,
                    background: "rgba(255,106,0,0.10)",
                  }}
                >
                  <Check
                    width={11}
                    height={11}
                    className="text-signal-orange"
                    strokeWidth={3}
                    aria-hidden
                  />
                </span>
                <span className="text-[13.5px] leading-[1.5] text-graphite/70">
                  {d}
                </span>
              </li>
            ))}
          </ul>
        </motion.article>
      ))}
    </div>
  );
}

export function PartnersTechnology() {
  return (
    <Section surface="white" id="technology-partners">
      <style>{SHINE}</style>
      <SectionHeader
        eyebrow="Technology partners"
        top="Connect once."
        bottom="Create more complete solutions."
        size="compact"
        width="wide"
        body="Technology partnerships can combine complementary products without forcing customers to rebuild their operating environment."
      />
      <RoleGrid roles={TECHNOLOGY} />
    </Section>
  );
}

export function PartnersChannel() {
  return (
    <Section surface="offWhite" id="channel-partners">
      <SectionHeader
        eyebrow="Channel & delivery"
        top="Extend the relationship"
        bottom="Beyond the first transaction."
        size="compact"
        width="wide"
        body="Partners can combine products and field expertise with persistent digital visibility — creating recurring inspection, safety, maintenance and performance services."
      />
      <RoleGrid roles={CHANNEL} />
    </Section>
  );
}
