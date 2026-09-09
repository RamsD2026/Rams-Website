"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { LatestGrid, type LatestItem } from "@/components/sections/LatestGrid";
import { CASES, type CaseStudy } from "./case-data";
import { CaseModal } from "./CaseModal";

/**
 * 02 — Recent work.
 *
 * Three engagements under the hero: one lead and two beside it. `LatestGrid`
 * owns the arrangement, the scrim and the type; this file decides which
 * three, supplies the photographs, and holds the panel.
 *
 * ── Its own modal state ─────────────────────────────────────────────
 * `CaseWork` below has one too. They are separate on purpose: lifting a
 * single `open` into the page would make two sections share a piece of state
 * neither owns, to save one `useState` and one `CaseModal` — which renders
 * nothing at all until something is open. `CaseModal` portals into
 * `document.body`, so two of them cannot fight over stacking either.
 *
 * ── The first three, not a hand-picked set ──────────────────────────
 * `CASES.slice(0, 3)`, in the order the source lists them. A curated lead has
 * to be re-curated whenever the list changes, and the one that gets forgotten
 * is the one that makes the section wrong.
 *
 * All three appear again in the filtered grid below, which is what a lead is
 * — the same work, once at reading size and once in the set.
 *
 * ── `sizes` is not the grid's ───────────────────────────────────────
 * The lead is a 642-wide panel in the 1232 container and the two beside it
 * are 558. Handing either the work grid's `397px` would under-fetch both, and
 * these are the first photographs on the page.
 */

function Cover({ study, big }: { study: CaseStudy; big: boolean }) {
  return (
    <Image
      src={study.img}
      alt={study.alt}
      fill
      sizes={
        big
          ? "(max-width: 1024px) 92vw, 642px"
          : "(max-width: 1024px) 92vw, 246px"
      }
      className="object-cover"
    />
  );
}

export function CaseLatest() {
  const [open, setOpen] = useState<CaseStudy | null>(null);

  const items: LatestItem[] = CASES.slice(0, 3).map((c, i) => ({
    id: c.id,
    eyebrow: c.kind,
    meta: c.sector,
    title: c.title,
    body: c.problem,
    cta: "Read case study",
    onOpen: () => setOpen(c),
    cover: <Cover study={c} big={i === 0} />,
  }));

  return (
    <>
      <LatestGrid
        id="latest"
        eyebrow="Recent work"
        top="What the last"
        bottom="Engagements found."
        body="Three of the six below, at reading size. Every one runs on the same digital twin."
        note="Client details withheld. Named references under NDA."
        items={items}
      />

      <AnimatePresence>
        {open && <CaseModal study={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </>
  );
}
