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
  const pathname = usePathname();

  /* The navbar goes transparent with white links and a white logo while the
     page is at the top, which works because every hero on this site is dark.
     On a light hero the whole bar disappears.

     Rather than keep a list of routes here, a hero declares its own tone with
     `data-hero-tone="light"` and this looks for one. Any future light hero is
     handled by adding that attribute and nothing else. Re-checked on
     navigation, since the App Router keeps this component mounted across
     routes.

     The read runs in a frame callback rather than in the effect body: the new
     route's markup is not necessarily committed when the effect fires, and a
     synchronous setState here would also cascade a second render. */
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setLightHero(Boolean(document.querySelector('[data-hero-tone="light"]')));
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);

      if (y < 80) {
        // At top — always show
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

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
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
