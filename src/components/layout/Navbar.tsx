"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { RAMSLogo } from "@/components/ui/RAMSLogo";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import { MegaMenuPanel } from "@/components/layout/MegaMenuPanel";
import { MegaMenuV2Panel } from "@/components/layout/MegaMenuV2Panel";
import { NAV_CONFIG, type NavItemConfig } from "@/lib/navigation";
import { NAV_CONFIG_V2 } from "@/lib/navigation-v2";
import { useNavVersion } from "@/components/ui/VersionSwitcher";

const HOVER_OPEN_DELAY = 150;
const HOVER_CLOSE_DELAY = 120;

interface NavbarProps {
  scrolled: boolean;
  heroMode?: boolean;
}

function NavLabel({
  item,
  isActive,
  heroMode,
  menuOpen,
  onMouseEnter,
  onMouseLeave,
  onFocus,
}: {
  item: NavItemConfig;
  isActive: boolean;
  heroMode: boolean;
  menuOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        aria-expanded={isActive}
        aria-haspopup="true"
        className={cn(
          "relative flex flex-col items-center py-1 px-1 text-xs font-normal tracking-[0.14em] uppercase font-mono transition-colors duration-200",
          "outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-none",
          heroMode
            ? isActive
              ? "text-white focus-visible:ring-white"
              : "text-white/80 hover:text-white focus-visible:ring-white"
            : isActive
              ? "text-signal-orange focus-visible:ring-signal-orange"
              : menuOpen
                ? "text-carbon hover:text-carbon focus-visible:ring-carbon"
                : "text-graphite hover:text-carbon focus-visible:ring-carbon"
        )}
      >
        {item.label}
        <motion.span
          className={cn(
            "absolute bottom-0 left-0 h-[2px] rounded-none",
            heroMode ? "bg-white" : "bg-signal-orange"
          )}
          animate={isActive ? { width: "100%", opacity: 1 } : { width: "0%", opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          aria-hidden="true"
        />
      </button>
    </li>
  );
}

export function Navbar({ scrolled, heroMode = false }: NavbarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navVersion] = useNavVersion();

  const openTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const activeConfig = NAV_CONFIG.find((n) => n.label === activeMenu) ?? null;
  const activeConfigV2 = NAV_CONFIG_V2.find((n) => n.label === activeMenu) ?? null;

  const clearTimers = () => {
    if (openTimer.current)  clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const scheduleOpen = useCallback((label: string) => {
    clearTimers();
    if (activeMenu !== null) {
      setActiveMenu(label);
    } else {
      openTimer.current = setTimeout(() => setActiveMenu(label), HOVER_OPEN_DELAY);
    }
  }, [activeMenu]);

  const scheduleClose = useCallback(() => {
    clearTimers();
    closeTimer.current = setTimeout(() => setActiveMenu(null), HOVER_CLOSE_DELAY);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const closeMenu = useCallback(() => {
    clearTimers();
    setActiveMenu(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeMenu(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeMenu]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) closeMenu();
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [closeMenu]);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  const isTransparent = heroMode && !activeMenu;

  return (
    <>
      <div ref={navRef} onMouseLeave={scheduleClose} className="relative">
        {/* Nav bar */}
        <nav
          className={cn(
            "w-full transition-all duration-300",
            isTransparent
              ? "bg-transparent"
              : scrolled
                ? "bg-white shadow-[0_1px_24px_rgba(14,14,15,0.08)]"
                : "bg-white border-b border-steel"
          )}
          aria-label="Main navigation"
        >
          <div className="max-w-[1280px] mx-auto px-6 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-6 sm:gap-10">

            {/* Logo */}
            <div className="shrink-0 h-9 flex items-center">
              <RAMSLogo
                asLink
                className="h-9"
                variant={isTransparent ? "white" : "dark"}
              />
            </div>

            {/* Desktop nav */}
            <ul
              role="list"
              className="hidden lg:flex items-center flex-1 justify-center"
              style={{ columnGap: 28 }}
            >
              {NAV_CONFIG.map((item) => (
                <NavLabel
                  key={item.label}
                  item={item}
                  isActive={activeMenu === item.label}
                  heroMode={isTransparent}
                  menuOpen={activeMenu !== null}
                  onMouseEnter={() => scheduleOpen(item.label)}
                  onMouseLeave={scheduleClose}
                  onFocus={() => setActiveMenu(item.label)}
                />
              ))}
            </ul>

            {/* Desktop — Search only, CTAs live in hero */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <button
                type="button"
                aria-label="Search"
                className={cn(
                  "p-2 rounded-none transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                  isTransparent
                    ? "text-white/60 hover:text-white hover:bg-white/10 focus-visible:ring-white"
                    : "text-graphite hover:text-carbon hover:bg-off-white focus-visible:ring-carbon"
                )}
              >
                <Search className="w-[18px] h-[18px]" aria-hidden="true" />
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              ref={menuButtonRef}
              onClick={() => setDrawerOpen(true)}
              className={cn(
                "lg:hidden p-2 rounded-none transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                isTransparent
                  ? "text-white/75 hover:text-white hover:bg-white/10 focus-visible:ring-white"
                  : "text-graphite hover:text-carbon hover:bg-off-white focus-visible:ring-carbon"
              )}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
            >
              <Menu className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
        </nav>

        {/* Mega menu panel */}
        <AnimatePresence>
          {navVersion === "v1" && activeConfig && (
            <div onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
              <MegaMenuPanel config={activeConfig} onClose={closeMenu} />
            </div>
          )}
          {navVersion === "v2" && activeConfigV2 && (
            <div onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
              <MegaMenuV2Panel config={activeConfigV2} onClose={closeMenu} />
            </div>
          )}
        </AnimatePresence>

        {/* Backdrop */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-carbon/20 z-40 pointer-events-none"
              aria-hidden="true"
            />
          )}
        </AnimatePresence>
      </div>

      <MobileDrawer isOpen={drawerOpen} onClose={closeDrawer} />
    </>
  );
}
