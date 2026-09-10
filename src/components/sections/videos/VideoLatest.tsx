"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";
import { LatestGrid, type LatestItem } from "@/components/sections/LatestGrid";
import { VIDEOS, type Video } from "./video-data";
import { VideoPlayer } from "./VideoPlayer";

/**
 * 02 — Start here.
 *
 * Three films under the hero: one lead and two beside it. `LatestGrid` owns
 * the arrangement, the scrim and the type; this file decides which three,
 * supplies the posters, and holds the player.
 *
 * ── Its own player state ────────────────────────────────────────────
 * `VideoLibrary` below has one too, and they are separate on purpose.
 * Lifting a single `open` into the page would make two sections share a piece
 * of state neither owns, to save one `useState` and one `VideoPlayer` — which
 * renders nothing until something is open, and portals into `document.body`
 * when it does, so two of them cannot fight over stacking.
 *
 * ── Posters only. Nothing streams from this section ─────────────────
 * The library's cards mount a `<video>` on first hover and preview in place.
 * This one does not, and that is deliberate: it sits directly under the hero,
 * so it is the first thing on screen, and the three clips behind it come to
 * 29 MB. A section that begins downloading video because a pointer crossed it
 * on the way down the page is the worst place on the site to do that.
 *
 * A press opens the player, which is a deliberate act and the right moment to
 * start the file. The badge is what says so.
 *
 * ── The play control is on the call to action, not on the poster ────
 * It was a 54px badge floating over the picture. On the OmniBox and the
 * camera it landed squarely on the unit — the one thing in each frame
 * worth seeing — and on the IRDS capture it covered a panel of the
 * dashboard. `LatestGrid` paints nothing over a picture now, and this
 * follows it: an 11px glyph in front of "Watch the film", which is where
 * `VideoLibrary` already puts one.
 *
 * ── The first three, and the twin is not among them ─────────────────
 * `VIDEOS.slice(0, 3)` — the IRDS capture, the OmniBox and the camera. The
 * 60 MB twin recording is fourth in the list and stays in the library, where
 * it is reached by a press rather than sitting under the hero. That is a
 * property of the array's order rather than a filter, which is worth knowing
 * before reordering `video-data`.
 */

function Cover({ video, big }: { video: Video; big: boolean }) {
  return (
    <Image
      src={video.poster}
      alt={video.posterAlt}
      fill
      sizes={
        big
          ? "(max-width: 1024px) 92vw, 731px"
          : "(max-width: 640px) 132px, 168px"
      }
      className="object-cover"
    />
  );
}

export function VideoLatest() {
  const [open, setOpen] = useState<Video | null>(null);

  const items: LatestItem[] = VIDEOS.slice(0, 3).map((v, i) => ({
    id: v.id,
    eyebrow: v.kind,
    meta: v.subject,
    title: v.title,
    body: v.body,
    cta: "Watch the film",
    ctaIcon: (
      <Play
        className="w-[11px] h-[11px]"
        fill="currentColor"
        strokeWidth={0}
        aria-hidden
      />
    ),
    onOpen: () => setOpen(v),
    cover: <Cover video={v} big={i === 0} />,
  }));

  return (
    <>
      <LatestGrid
        id="latest"
        eyebrow="Start here"
        top="The platform,"
        bottom="And what reads it."
        body="Three films to begin with: the product running, and the two units that put data into it."
        note="Nothing loads until you press play."
        items={items}
      />

      <AnimatePresence>
        {open && <VideoPlayer video={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </>
  );
}
