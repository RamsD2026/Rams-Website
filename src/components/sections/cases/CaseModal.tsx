"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { EASE } from "@/components/sections/rackiq/rackiq-shared";
import type { CaseStudy } from "./case-data";

/**
 * The panel behind a case-study card.
 *
 * The card carries the picture, the kind and the title. Everything the card
 * used to carry underneath — the situation and the three outcomes — is here,
 * which is the point of the change: a grid of six cards each holding a
 * paragraph and a bulleted list is a page of documents, not a set of cards.
 *
 * `IndustryModal` on the home page does the same job for the industries
 * carousel. This is a much smaller version of it — the picture, four blocks
 * of copy and a close — because a case study has less to say than an industry
 * and a modal that scrolls is a modal nobody finishes.
 *
 * ── It renders through a portal ─────────────────────────────────────
 * Into `document.body`, so no ancestor can capture it. The site has been
 * caught by this before: `<header>` is `position: fixed` and once carried an
 * inline transform, and a transformed element becomes the containing block
 * for its fixed descendants — which collapsed the mobile drawer to the
 * header's height. A dialog belongs at the top of the tree.
 *
 * ── Escape, the scrim and the body lock ─────────────────────────────
 * Escape closes it, a click on the scrim closes it, and the body's overflow
 * is pinned while it is open so the page behind does not scroll under the
 * panel. The effect restores the previous overflow rather than setting
 * `auto`, because a page that arrived with something else set would lose it.
 */

export function CaseModal({
  study,
  onClose,
}: {
  study: CaseStudy;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      role="dialog"
      aria-modal="true"
      aria-label={study.title}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        style={{ background: "rgba(6,6,8,0.72)", backdropFilter: "blur(4px)" }}
      />

      <motion.div
        className="relative w-full max-w-[880px] max-h-[88svh] overflow-auto bg-white"
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.99 }}
        transition={{ duration: 0.35, ease: EASE }}
        style={{
          borderRadius: 20,
          boxShadow: "0 40px 90px -40px rgba(0,0,0,0.6)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-[1] flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-200"
          style={{
            background: "rgba(255,255,255,0.9)",
            boxShadow: "0 6px 18px -8px rgba(0,0,0,0.35)",
          }}
        >
          <X className="w-4 h-4 text-carbon" strokeWidth={2} aria-hidden />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div
            className="relative w-full min-h-[220px] sm:min-h-full"
            style={{ aspectRatio: "3 / 4" }}
          >
            <Image
              src={study.img}
              alt={study.alt}
              fill
              sizes="(max-width: 640px) 92vw, 350px"
              className="object-cover"
              style={{ borderRadius: "20px 0 0 20px" }}
            />
          </div>

          <div className="flex flex-col p-7 sm:p-9">
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange px-2.5 py-1"
                style={{ borderRadius: 999, background: "rgba(255,106,0,0.08)" }}
              >
                {study.kind}
              </span>
              <span className="text-[12px] text-graphite/50">
                {study.sector}
              </span>
            </div>

            <h3 className="mt-5 text-[24px] sm:text-[28px] font-bold tracking-[-0.03em] text-carbon leading-[1.2]">
              {study.title}
            </h3>

            <p className="mt-4 text-[14.5px] leading-[1.7] text-graphite/65">
              {study.problem}
            </p>

            <span className="mt-8 text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-graphite/45">
              What the engagement produced
            </span>

            <ul className="mt-4 space-y-3.5">
              {study.outcomes.map((o) => (
                <li key={o} className="flex items-start gap-3">
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
                  <span className="text-[14px] leading-[1.55] text-carbon/80">
                    {o}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-[11.5px] leading-[1.6] text-graphite/40">
              Representative of a real engagement. Client details withheld for
              confidentiality; named references available under NDA.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
