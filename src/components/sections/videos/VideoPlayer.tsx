"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { EASE } from "@/components/sections/rackiq/rackiq-shared";
import type { Video } from "./video-data";

/**
 * The player behind a library card.
 *
 * `CaseModal` is the reference and the shell is value for value: a portal
 * into `document.body`, a scrim that closes on click, Escape, and the body's
 * overflow pinned and *restored* rather than set to `auto` — a page that
 * arrived with something else set would otherwise lose it.
 *
 * ── The portal is not decoration ────────────────────────────────────
 * `<header>` is `position: fixed` and once carried an inline transform, and a
 * transformed element becomes the containing block for its fixed descendants
 * — which collapsed the mobile drawer to the header's height. A dialog
 * belongs at the top of the tree.
 *
 * ── What is different from `CaseModal` ──────────────────────────────
 * A case study is four blocks of copy beside a picture. This is one video and
 * a caption, so the panel is the film's own box with the type under it, and
 * the box is `aspect-video` with `object-contain` on black: these clips are
 * product renders at 3:2 and UI captures at 16:9 and 2.1:1, and `cover` would
 * crop a corner off a screen recording. Letterboxing a film is normal;
 * cropping one is a mistake.
 *
 * ── It plays, and it stops when it closes ───────────────────────────
 * `autoPlay` with `controls`, unmuted — a click on a card is the gesture a
 * browser wants before it will play sound, so there is no need to nudge this
 * one the way the autoplaying hero panel is nudged. Unmounting the element
 * stops the download as well as the sound; nothing keeps streaming behind a
 * closed dialog.
 *
 * `preload` is "auto" for everything except a `heavy` clip, which waits to be
 * told. `rack-3d-view.webm` is 60 MB.
 */

export function VideoPlayer({
  video,
  onClose,
}: {
  video: Video;
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
      aria-label={video.title}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        style={{ background: "rgba(6,6,8,0.82)", backdropFilter: "blur(4px)" }}
      />

      <motion.div
        className="relative w-full max-w-[1040px] max-h-[90svh] overflow-auto bg-white"
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

        <div
          className="w-full overflow-hidden"
          style={{
            aspectRatio: "16 / 9",
            background: "#08080A",
            borderRadius: "20px 20px 0 0",
          }}
        >
          <video
            key={video.id}
            src={video.src}
            poster={video.poster}
            controls
            autoPlay
            loop
            playsInline
            preload={video.heavy ? "none" : "auto"}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="p-7 sm:p-9">
          <p className="text-[10.5px] font-mono font-bold tracking-[0.2em] uppercase text-graphite/45">
            {video.subject}
          </p>

          <h3 className="mt-3.5 text-[24px] sm:text-[28px] font-bold tracking-[-0.03em] text-carbon leading-[1.2]">
            {video.title}
          </h3>

          <p className="mt-4 text-[14.5px] leading-[1.7] text-graphite/65 max-w-[720px]">
            {video.body}
          </p>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
