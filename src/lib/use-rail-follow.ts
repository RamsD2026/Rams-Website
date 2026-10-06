"use client";

import { useEffect, useRef } from "react";

/**
 * Keeps the current step of a horizontal step rail in view.
 *
 * The "How it works" rails autoplay through five or six steps, and below lg
 * they sit in an `overflow-x-auto` box wider than the screen. Nothing moved
 * that box, so as the rail advanced the current step walked off the right
 * edge and was cropped. This scrolls the box itself — never the page — so the
 * current step sits in the middle and the earlier ones slide out to the left,
 * the way they do when the rail is swiped by hand. At either end the box
 * simply stops at its edge.
 *
 * Attach the returned ref to the `overflow-x-auto` element. The steps are its
 * `button`s, in order. When the rail fits (lg and up) there is nothing to
 * scroll and this does nothing.
 */
export function useRailFollow<T extends HTMLElement = HTMLDivElement>(
  index: number,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const rail = ref.current;
    if (!rail || rail.scrollWidth <= rail.clientWidth) return;

    const step = rail.querySelectorAll<HTMLElement>("button")[index];
    if (!step) return;

    const railBox = rail.getBoundingClientRect();
    const stepBox = step.getBoundingClientRect();
    const centre =
      rail.scrollLeft +
      (stepBox.left - railBox.left) +
      stepBox.width / 2 -
      rail.clientWidth / 2;
    const left = Math.max(
      0,
      Math.min(rail.scrollWidth - rail.clientWidth, centre),
    );

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollTo({ left, behavior: reduce ? "auto" : "smooth" });
  }, [index]);

  return ref;
}
