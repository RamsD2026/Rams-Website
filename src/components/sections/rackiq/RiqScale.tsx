"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, SHOTS, Section } from "./rackiq-shared";

/**
 * Multi-site intelligence.
 *
 * Paginated like the homepage IndustriesCarousel: centred header, the media,
 * then the dot pill — 44px tall, #F0F0F2, the active dot widening 6px → 24px
 * over 320ms.
 *
 * Four views of the regional dashboard, in the order a regional lead reads
 * it: the map with a site opened, the warehouse ranking and action centre,
 * the analytics, then the closure and activity boards.
 *
 * ── BEFORE THIS SHIPS ────────────────────────────────────────────────
 * Both captures carry a real customer name — "Nestlé Maharashtra" in the
 * title bar, and "Nestlé · Solapur" inside the site card on slide two. The
 * map tiles also failed to load, so "API KEY REQUIRED" is watermarked across
 * them. Recapture on a neutral account with a working basemap key.
 * ─────────────────────────────────────────────────────────────────────
 */

const LINE = "#E8E8ED";

const VIEWS = [
  { k: "map", shot: SHOTS.regionalDashboard },
  { k: "ranking", shot: SHOTS.regionalRanking },
  { k: "analytics", shot: SHOTS.regionalAnalytics },
  { k: "actions", shot: SHOTS.regionalActions },
] as const;

export function RiqScale() {
  const [i, setI] = useState(0);
  const view = VIEWS[i];

  return (
    <Section surface="warm" id="multisite">
      <SectionHeader
        eyebrow="Multi-site intelligence"
        top="Rack-level evidence."
        bottom="Enterprise-level intelligence."
        body="One rack → one warehouse → every warehouse. Compare open findings, closure rates, recurring locations and lifecycle distribution across sites."
        size="compact"
        width="wide"
      />

      {/* ── the screen ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="overflow-hidden bg-white"
        style={{
          borderRadius: 14,
          border: `1px solid ${LINE}`,
          boxShadow:
            "0 1px 2px rgba(0,0,0,0.02), 0 16px 40px -20px rgba(14,14,15,0.16)",
        }}
      >
        <div
          className="flex items-center gap-2 px-4 h-10 shrink-0"
          style={{ borderBottom: "1px solid #EDEDF1", background: "#FAFAFB" }}
        >
          {[0, 1, 2].map((d) => (
            <span
              key={d}
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: "#E4E4E9" }}
            />
          ))}
          <div
            className="ml-3 flex-1 max-w-[320px] h-6 rounded-md flex items-center px-3 min-w-0"
            style={{ background: "#F1F1F4" }}
          >
            <span className="text-[10.5px] font-mono truncate text-graphite/45">
              app.rams.digital/irds/regional
            </span>
          </div>
        </div>

        {/* both captures are 1633×907–908, so the box never shifts */}
        <div className="relative" style={{ aspectRatio: "1633 / 907" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={view.k}
              initial={{ opacity: 0, scale: 1.005 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.998 }}
              transition={{ duration: 0.32, ease: EASE }}
              className="absolute inset-0"
            >
              <Image
                src={view.shot.src}
                alt={view.shot.alt}
                width={view.shot.w}
                height={view.shot.h}
                sizes="(max-width: 1024px) 100vw, 1232px"
                className="block w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Apple-style pagination — the IndustriesCarousel dot pill */}
      <div className="mt-14 flex items-center justify-center gap-3">
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
          {VIEWS.map((v, n) => {
            const active = n === i;
            return (
              <button
                key={v.k}
                type="button"
                onClick={() => setI(n)}
                aria-label={`Go to slide ${n + 1}`}
                aria-current={active ? "true" : undefined}
                style={{
                  width: active ? 24 : 6,
                  height: 6,
                  borderRadius: 999,
                  background: active ? "var(--color-carbon-alt)" : "#86868B",
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

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-16 sm:mt-20 text-center font-rams-heading text-[22px] sm:text-[28px] lg:text-[32px] font-bold tracking-[-0.025em] leading-[1.2] text-carbon"
      >
        The platform becomes more valuable{" "}
        <span className="text-graphite/45">with every inspection cycle.</span>
      </motion.p>
    </Section>
  );
}
