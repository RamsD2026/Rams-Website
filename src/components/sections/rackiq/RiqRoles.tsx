"use client";

import { motion } from "framer-motion";
import {
  ClipboardCheck,
  DraftingCompass,
  Factory,
  LineChart,
  ShieldCheck,
  ShoppingCart,
  Warehouse,
  Wrench,
} from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "./rackiq-shared";

/**
 * Who the platform is for.
 *
 * Built on the InvWhy composition: centred header, then a four-up grid of
 * cards carrying an orange icon tile, the audience, the promise in orange, and
 * the body. Same measures — 12px radius, #E8E8ED, the two-layer shadow, the
 * conic shine on hover, namespaced per section.
 *
 * Eight roles rather than four, so it runs to two rows.
 */

const ROLES = [
  {
    Icon: ClipboardCheck,
    title: "Rack Inspector",
    tagline: "Captures the evidence.",
    body: "Guided field inspection, images, measurements, tests, structured findings.",
  },
  {
    Icon: ShieldCheck,
    title: "EHS / Safety",
    tagline: "Understands the risk.",
    body: "RAG status, open actions, hotspots, overdue issues, site condition.",
  },
  {
    Icon: DraftingCompass,
    title: "Engineering",
    tagline: "Understands the technical condition.",
    body: "Integrity tests, plumbness, measurements, historical evidence, review.",
  },
  {
    Icon: Warehouse,
    title: "Warehouse Operations",
    tagline: "Sees where action is required.",
    body: "Affected racks, operational patterns, recurring damage, current restrictions.",
  },
  {
    Icon: Wrench,
    title: "Maintenance",
    tagline: "Knows what must be corrected.",
    body: "Component, action, priority, repair status, verification status.",
  },
  {
    Icon: ShoppingCart,
    title: "Procurement",
    tagline: "Knows what must be purchased.",
    body: "Technical BoQ, quantities, specification, OEM information, intervention.",
  },
  {
    Icon: Factory,
    title: "Rack OEM",
    tagline: "Receives a defined requirement.",
    body: "Component, location, quantity, condition, evidence, repair requirement.",
  },
  {
    Icon: LineChart,
    title: "Management",
    tagline: "Sees the pattern.",
    body: "Sites, risks, recurrence, closure, lifecycle distribution, hotspot trends.",
  },
];

export function RiqRoles() {
  return (
    <Section surface="white" id="users">
      <style>{`
        @property --riqroles-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .riqroles-card { position: relative; isolation: isolate; }
        .riqroles-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--riqroles-shine-angle),
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
        .riqroles-card:hover::before {
          opacity: 1;
          animation: riqroles-shine 2.4s linear infinite;
        }
        @keyframes riqroles-shine {
          to { --riqroles-shine-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .riqroles-card:hover::before { animation: none; }
        }
      `}</style>

      <SectionHeader
        eyebrow="Who it's for"
        top="One platform."
        bottom="Different decisions for different teams."
        body="Inspector captures. Engineering understands. Maintenance corrects. Management sees the pattern — one record, read differently by every team that depends on it."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {ROLES.map((role, i) => (
          <motion.article
            key={role.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease: EASE }}
            className="riqroles-card group relative flex flex-col p-7 sm:p-8 bg-white transition-all duration-300 hover:-translate-y-1"
            style={{
              minHeight: 300,
              borderRadius: 12,
              border: "1px solid #E8E8ED",
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
            }}
          >
            <div
              className="w-12 h-12 flex items-center justify-center mb-8"
              style={{
                borderRadius: 8,
                background: "rgba(255,106,0,0.08)",
                border: "1px solid rgba(255,106,0,0.18)",
              }}
            >
              <role.Icon
                className="w-[22px] h-[22px] text-signal-orange"
                strokeWidth={2}
              />
            </div>

            <h3 className="text-[21px] sm:text-[22px] font-bold text-carbon leading-[1.2] tracking-[-0.02em]">
              {role.title}
            </h3>

            <div className="mt-2 text-[14px] font-semibold text-signal-orange leading-[1.4]">
              {role.tagline}
            </div>

            <p className="mt-4 text-[14px] text-graphite/65 leading-[1.65]">
              {role.body}
            </p>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
