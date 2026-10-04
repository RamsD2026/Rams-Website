"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";

export function Header() {
  const [scrolled, setScrolled]       = useState(false);
  const [visible, setVisible]         = useState(true);
  const [mouseNearTop, setMouseNearTop] = useState(false);
  const [lightHero, setLightHero] = useState(false);
  const lastY = useRef(0);
  /* Whether the reader has scrolled this page themselves yet. Cleared on
     every route change, set by the first wheel, swipe or scroll key. */
  const touched = useRef(false);
  const pathname = usePathname();

  /* The navbar goes transparent with white links and a white logo while the
     page is at the top, which works because every hero on this site is dark.
     On a light hero the whole bar disappears.

     Rather than keep a list of routes here, a hero declares its own tone with
     `data-hero-tone="light"` and this looks for one. Any future light hero is
     handled by adding that attribute and nothing else. Re-checked on
     navigation, since the App Router keeps this component mounted across
     routes.

     ── Why this watches rather than reads once ─────────────────────────
     It used to read in a single `requestAnimationFrame` after the pathname
     changed. That holds on a fresh load, but not on a client-side
     navigation: the App Router commits the new route's markup a frame or
     more later, so the query ran against the *old* page — or against
     nothing — and a light hero was missed. The bar then stayed in hero
     mode and painted a white logo and white links onto a white page.

     So the check re-runs while the DOM settles: once immediately, again on
     the next frame, and on any mutation until the route's markup is in.
     The observer disconnects as soon as it has an answer that matches the
     committed page, and in any case after a second. */
  useEffect(() => {
    touched.current = false;
  }, [pathname]);

  useEffect(() => {
    const read = () =>
      setLightHero(Boolean(document.querySelector('[data-hero-tone="light"]')));

    read();
    const frame = requestAnimationFrame(read);
    const observer = new MutationObserver(read);
    observer.observe(document.body, { childList: true, subtree: true });
    const stop = setTimeout(() => observer.disconnect(), 1000);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(stop);
      observer.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);

      /* The bar hides when the *reader* scrolls down — not when the browser
         moves the page.

         Five of the footer's links go to `/clients#<industry>`, and the
         page carries `scroll-behavior: smooth`, so arriving there animates
         the jump as a long run of ordinary scroll-down events. The bar read
         that as the reader leaving and hid itself before they had seen it:
         the page opened with no navigation at all. The further down the
         anchor, the longer that run, so no amount of waiting fixes it —
         which is why this asks who moved the page rather than how long ago
         the route changed.

         `touched` is set by a wheel, a swipe or a scroll key, and cleared on
         every route change. Until one of those happens, whatever the scroll
         position is doing is the browser's doing. */
      if (y < 80 || !touched.current) {
        // At the top, or the reader has not scrolled this page yet — show
        setVisible(true);
      } else if (y > lastY.current) {
        // Scrolling down — hide
        setVisible(false);
      }
      // Scrolling up → do nothing; mouse proximity handles reveal

      lastY.current = y;
    };

    const onMouseMove = (e: MouseEvent) => {
      const near = e.clientY < 80;
      setMouseNearTop(near);
      if (near) setVisible(true);
    };

    const onIntent = () => {
      touched.current = true;
    };
    const onKey = (e: KeyboardEvent) => {
      if (
        ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(
          e.key,
        )
      )
        touched.current = true;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("wheel", onIntent, { passive: true });
    window.addEventListener("touchmove", onIntent, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("wheel", onIntent);
      window.removeEventListener("touchmove", onIntent);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const show = visible || mouseNearTop;

  // `none` rather than translateY(0) while visible: a transformed ancestor
  // becomes the containing block for position:fixed descendants, which would
  // collapse the mobile drawer and the mega-menu scrim into the header box.
  const hideTransform = show ? "none" : "translateY(-100%)";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 w-full transition-transform duration-300 ease-in-out"
      style={{ transform: hideTransform }}
    >
      <AnnouncementBar />
      <Navbar scrolled={scrolled} heroMode={!scrolled && !lightHero} />
    </header>
  );
}
