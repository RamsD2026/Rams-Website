"use client";

import { useEffect, useRef, useState } from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";

export function Header() {
  const [scrolled, setScrolled]       = useState(false);
  const [visible, setVisible]         = useState(true);
  const [mouseNearTop, setMouseNearTop] = useState(false);
  const lastY = useRef(0);

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

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 w-full transition-transform duration-300 ease-in-out"
      style={{ transform: show ? "translateY(0)" : "translateY(-100%)" }}
    >
      <AnnouncementBar />
      <Navbar scrolled={scrolled} heroMode={!scrolled} />
    </header>
  );
}
