# Layout components

The shell is fixed: `<Header />` (announcement bar + navbar), `<main>`, then
`<Footer />`. Every route renders inside it. Header heights are CSS tokens —
`--header-announcement: 40px`, `--header-nav: 80px`, `--header-total: 120px`.

**The navbar contract that matters for design:** while the page is scrolled to
the top the navbar is transparent with white links, which only works over a
**dark hero**. A hero opts out by putting `data-hero-tone="light"` on its root
element — `Header` queries the DOM for one on every navigation. There is no
route list. Any new light hero needs that attribute and nothing else.

### `src/app/layout.tsx`
Root layout. Loads the three fonts via `next/font/google` and attaches their CSS variables to `<html>`.

```tsx
import type { Metadata } from "next";
import { IBM_Plex_Sans, Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/* Headings — IBM Plex Sans (as used by Verity.net) */
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

/* Body & UI — Roboto */
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

/* Mono — Roboto Mono */
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RAMS 2.0 - Operational Intelligence for the Modern Warehouse",
  description:
    "RAMS delivers AI-powered warehouse intelligence, digital twin platforms, and enterprise automation solutions trusted by global operations teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${roboto.variable} ${robotoMono.variable} antialiased`}>
      <body className="min-h-screen">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

### `src/components/layout/Header.tsx`
Fixed header wrapper. Hide-on-scroll-down, reveal on scroll-up or mouse-near-top, plus the `data-hero-tone` detection described above.

```tsx
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
```

### `src/components/layout/AnnouncementBar.tsx`
The 40px bar above the navbar.

```tsx
"use client";

import { useState } from "react";
import { Globe, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const ANNOUNCEMENTS = [
  "Introducing RAMS AI Vision — Intelligent Warehouse Perception",
  "New Digital Twin Platform Now Available",
  "RAMS 2.0 Enterprise Suite — GA Release",
];

const LANGUAGES = ["English", "Deutsch", "Français", "日本語", "中文"];

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [announcementIndex] = useState(0);
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");

  if (!visible) return null;

  return (
    <div className="relative z-50 h-10 bg-carbon flex items-center">
      <div className="max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">

        {/* Left — Region */}
        <div className="hidden sm:flex items-center gap-1.5 text-steel/60 hover:text-steel transition-colors cursor-pointer shrink-0">
          <Globe className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="text-xs font-medium tracking-wide uppercase">Global</span>
        </div>

        {/* Center — Announcement */}
        <AnimatePresence mode="wait">
          <motion.p
            key={announcementIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="text-[12.5px] text-steel/75 font-medium tracking-wide text-center truncate"
            aria-live="polite"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-none bg-signal-orange mr-2 align-middle" aria-hidden="true" />
            {ANNOUNCEMENTS[announcementIndex]}
          </motion.p>
        </AnimatePresence>

        {/* Right */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Language */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-xs text-steel/60 hover:text-steel transition-colors font-medium tracking-wide"
              aria-expanded={langOpen}
              aria-haspopup="listbox"
              aria-label="Select language"
            >
              {selectedLang}
              <ChevronDown
                className={cn("w-3 h-3 transition-transform duration-200", langOpen && "rotate-180")}
                aria-hidden="true"
              />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.ul
                  role="listbox"
                  aria-label="Language options"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-32 bg-graphite border border-white/10 rounded-none overflow-hidden shadow-xl z-50"
                >
                  {LANGUAGES.map((lang) => (
                    <li
                      key={lang}
                      role="option"
                      aria-selected={lang === selectedLang}
                      onClick={() => { setSelectedLang(lang); setLangOpen(false); }}
                      className={cn(
                        "px-3 py-2 text-xs cursor-pointer transition-colors",
                        lang === selectedLang
                          ? "text-white bg-white/10"
                          : "text-steel/70 hover:text-white hover:bg-white/5"
                      )}
                    >
                      {lang}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          <a href="/contact" className="text-xs text-steel/60 hover:text-steel transition-colors font-medium tracking-wide hidden sm:block">
            Contact
          </a>
          <a href="/support" className="text-xs text-steel/60 hover:text-steel transition-colors font-medium tracking-wide hidden sm:block">
            Support
          </a>
          <a
            href="/platform/login"
            className="text-xs text-steel/75 hover:text-white border border-white/15 hover:border-white/30px-2.5 py-0.5 transition-all duration-200 font-medium tracking-wide hidden md:block"
          >
            Platform Login
          </a>

          <button
            onClick={() => setVisible(false)}
            className="text-steel/40 hover:text-steel transition-colors ml-1"
            aria-label="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
```

### `src/components/layout/Navbar.tsx`
The 80px nav: logo, mega-menu triggers, search, ROI calculator, CTA, mobile trigger. Picks V1 or V2 nav config from `useNavVersion()`.

```tsx
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Menu, Search } from "lucide-react";
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

            {/* Desktop — search, and the one standing CTA.
                The rest of the page CTAs live in the hero; this one is in the
                bar because the calculator is a tool a reader may want at any
                point in a visit, not only at the top of a page. */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <Link
                href="/roi-calculator"
                className={cn(
                  "inline-flex items-center gap-2 h-9 px-4 rounded-full text-[13px] font-semibold whitespace-nowrap",
                  "bg-signal-orange text-white transition-all duration-200",
                  "hover:-translate-y-px hover:bg-signal-orange-hover",
                  "outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                  isTransparent ? "focus-visible:ring-white" : "focus-visible:ring-carbon"
                )}
              >
                <Calculator className="w-[15px] h-[15px]" aria-hidden="true" />
                ROI calculator
              </Link>

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
```

### `src/components/layout/MegaMenuPanel.tsx`
The V1 mega-menu panel — the one that ships. Renders `NAV_CONFIG` groups + a featured card.

```tsx
"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItemConfig, NavLink } from "@/lib/navigation";

/* ── Animation ── */
const panelVariants: Variants = {
  hidden:  { opacity: 0, y: -6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.18, ease: "easeOut" } },
  exit:    { opacity: 0, y: -4, transition: { duration: 0.12, ease: "easeIn" } },
};

const listVariants: Variants = {
  visible: { transition: { staggerChildren: 0.025, delayChildren: 0.03 } },
};

const rowVariant: Variants = {
  hidden:  { opacity: 0, y: 4 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.16, ease: "easeOut" } },
};

/* ── Single link row ── */
function LinkRow({ link, onClose }: { link: NavLink; onClose: () => void }) {
  return (
    <motion.div variants={rowVariant}>
      <Link
        href={link.href}
        onClick={onClose}
        className={cn(
          "group flex flex-col py-3 px-4 rounded-none transition-colors duration-150",
          "outline-none focus-visible:ring-2 focus-visible:ring-signal-orange focus-visible:ring-offset-1"
        )}
      >
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-sm font-semibold text-carbon group-hover:text-signal-orange transition-colors leading-tight">
            {link.label}
          </span>
          {link.meta && (
            <span className="shrink-0 text-xs font-semibold tracking-wide text-graphite border border-steel rounded-none px-2 py-0.5 leading-none">
              {link.meta}
            </span>
          )}
        </div>
        {link.description && (
          <span className="mt-0.5 text-[12.5px] text-graphite/70 leading-snug">
            {link.description}
          </span>
        )}
      </Link>
    </motion.div>
  );
}

/* ── Group heading ── */
function GroupHeading({ title }: { title?: string }) {
  if (!title) return null;
  return (
    <p className="mb-3 px-4 text-[10.5px] font-bold tracking-[0.18em] uppercase text-graphite/50 whitespace-nowrap">
      {title}
    </p>
  );
}

/* ── Featured dark card (Carbon surface) ── */
function FeaturedCard({ config, onClose }: { config: NavItemConfig; onClose: () => void }) {
  const { featured } = config;
  return (
    <div className="relative h-full min-h-[220px] rounded-none overflow-hidden bg-carbon flex flex-col p-7">
      {/* Topographic texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Signal Orange glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 -right-8 w-40 h-40 rounded-none bg-signal-orange/20 blur-3xl"
      />

      <div className="relative z-10 flex flex-col h-full">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-signal-orange mb-3">
          {featured.eyebrow}
        </p>
        <h3 className="text-lg font-bold text-white leading-snug mb-2.5">
          {featured.title}
        </h3>
        <p className="text-[12.5px] text-steel/60 leading-relaxed flex-1">
          {featured.description}
        </p>

        {featured.stat && (
          <div className="mt-5 pt-4 border-t border-white/8 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white leading-none">
              {featured.stat.value}
            </span>
            <span className="text-xs uppercase tracking-wide text-steel/40">
              {featured.stat.label}
            </span>
          </div>
        )}

        <Link
          href={featured.href}
          onClick={onClose}
          className="mt-5 inline-flex items-center gap-1.5 self-start rounded-none bg-signal-orange hover:bg-signal-orange-hover px-4 py-2 text-[12.5px] font-semibold text-white transition-colors duration-150"
        >
          {featured.cta}
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

/* ── Vertical divider ── */
function ColDivider() {
  return <div className="w-px bg-steel self-stretch mx-2" aria-hidden="true" />;
}

/* ════════════════════════
   Standard (1 group, 2-col + featured)
════════════════════════ */
function StandardPanel({ config, onClose }: { config: NavItemConfig; onClose: () => void }) {
  const group = config.groups[0];
  const half = Math.ceil(group.links.length / 2);
  const col1 = group.links.slice(0, half);
  const col2 = group.links.slice(half);

  return (
    <div className="flex gap-6 items-start">
      <div className="flex-1 grid grid-cols-2 gap-x-2">
        <div>
          <GroupHeading title={group.title} />
          <motion.div variants={listVariants} initial="hidden" animate="visible" className="space-y-0.5">
            {col1.map((l) => <LinkRow key={l.href} link={l} onClose={onClose} />)}
          </motion.div>
        </div>
        <div>
          {group.title && <div className="mb-3 h-[1.0625rem]" aria-hidden="true" />}
          <motion.div variants={listVariants} initial="hidden" animate="visible" className="space-y-0.5">
            {col2.map((l) => <LinkRow key={l.href} link={l} onClose={onClose} />)}
          </motion.div>
        </div>
      </div>
      <ColDivider />
      <div className="w-[260px] shrink-0">
        <FeaturedCard config={config} onClose={onClose} />
      </div>
    </div>
  );
}

/* ════════════════════════
   Hardware (4 cols + featured)
════════════════════════ */
function HardwarePanel({ config, onClose }: { config: NavItemConfig; onClose: () => void }) {
  return (
    <div className="flex items-start">
      <div
        className="w-full grid gap-x-2 min-w-0"
        style={{ gridTemplateColumns: `repeat(${config.groups.length}, minmax(0, 1fr))` }}
      >
        {config.groups.map((group) => (
          <div key={group.title} className="min-w-0">
            <GroupHeading title={group.title} />
            <motion.div variants={listVariants} initial="hidden" animate="visible" className="space-y-0.5">
              {group.links.map((l) => (
                <motion.div key={l.label} variants={rowVariant}>
                  <Link
                    href={l.href}
                    onClick={onClose}
                    className={cn(
                      "group flex flex-col py-2.5 px-3 rounded-none transition-colors duration-150",
                      "outline-none focus-visible:ring-2 focus-visible:ring-signal-orange"
                    )}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-carbon group-hover:text-signal-orange transition-colors leading-tight">
                        {l.label}
                      </span>
                      {l.meta && (
                        <span className="shrink-0 text-[9.5px] font-semibold tracking-wide text-graphite border border-steel rounded-none px-1.5 py-0.5 leading-none">
                          {l.meta}
                        </span>
                      )}
                    </div>
                    {l.description && (
                      <span className="mt-0.5 text-[11.5px] text-graphite/60 leading-snug">
                        {l.description}
                      </span>
                    )}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════
   Industries (2-col + featured)
════════════════════════ */
function IndustriesPanel({ config, onClose }: { config: NavItemConfig; onClose: () => void }) {
  const group = config.groups[0];
  const half = Math.ceil(group.links.length / 2);
  return (
    <div className="flex gap-6 items-start">
      <div className="flex-1 grid grid-cols-2 gap-x-2">
        <div>
          <GroupHeading title={group.title} />
          <motion.div variants={listVariants} initial="hidden" animate="visible" className="space-y-0.5">
            {group.links.slice(0, half).map((l) => <LinkRow key={l.href} link={l} onClose={onClose} />)}
          </motion.div>
        </div>
        <div>
          <div className="mb-3 h-[1.0625rem]" aria-hidden="true" />
          <motion.div variants={listVariants} initial="hidden" animate="visible" className="space-y-0.5">
            {group.links.slice(half).map((l) => <LinkRow key={l.href} link={l} onClose={onClose} />)}
          </motion.div>
        </div>
      </div>
      <ColDivider />
      <div className="w-[260px] shrink-0">
        <FeaturedCard config={config} onClose={onClose} />
      </div>
    </div>
  );
}

/* ════════════════════════
   Resources (Learn + Reference + featured)
════════════════════════ */
function ResourcesPanel({ config, onClose }: { config: NavItemConfig; onClose: () => void }) {
  return (
    <div className="flex gap-6 items-start">
      <div className="flex-1 grid grid-cols-2 gap-x-2">
        {config.groups.map((group) => (
          <div key={group.title}>
            <GroupHeading title={group.title} />
            <motion.div variants={listVariants} initial="hidden" animate="visible" className="space-y-0.5">
              {group.links.map((l) => <LinkRow key={l.href} link={l} onClose={onClose} />)}
            </motion.div>
          </div>
        ))}
      </div>
      <ColDivider />
      <div className="w-[260px] shrink-0">
        <FeaturedCard config={config} onClose={onClose} />
      </div>
    </div>
  );
}

/* ════════════════════════
   Root export
════════════════════════ */
interface MegaMenuPanelProps {
  config: NavItemConfig;
  onClose: () => void;
}

export function MegaMenuPanel({ config, onClose }: MegaMenuPanelProps) {
  const content = (() => {
    switch (config.layout) {
      case "hardware":   return <HardwarePanel   config={config} onClose={onClose} />;
      case "industries": return <IndustriesPanel config={config} onClose={onClose} />;
      case "resources":  return <ResourcesPanel  config={config} onClose={onClose} />;
      default:           return <StandardPanel   config={config} onClose={onClose} />;
    }
  })();

  return (
    <motion.div
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute top-full left-0 right-0 z-50 bg-white border-t border-steel shadow-[0_16px_48px_-8px_rgba(14,14,15,0.12)]"
      role="region"
      aria-label={`${config.label} navigation panel`}
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 py-8">
        {/* Panel header */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-[10.5px] font-bold tracking-[0.2em] uppercase text-graphite/50">
            {config.label}
          </span>
          <Link
            href={config.href}
            onClick={onClose}
            className="group flex items-center gap-1 text-xs font-semibold text-graphite hover:text-signal-orange transition-colors"
          >
            View all {config.label}
            <ArrowRight
              className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-150"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Divider */}
        <div className="mb-7 h-px bg-steel" aria-hidden="true" />

        {content}
      </div>

      {/* Footer strip */}
      <div className="border-t border-steel bg-off-white/60">
        <div className="px-8 py-3 flex items-center gap-6">
          <span className="text-xs text-graphite/50 font-medium">Quick access</span>
          <Link
            href="/get-started"
            onClick={onClose}
            className="text-[11.5px] font-semibold text-carbon hover:text-signal-orange transition-colors flex items-center gap-1"
          >
            Find Your Starting Point
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </Link>
          <Link
            href="/book-demo"
            onClick={onClose}
            className="text-[11.5px] font-semibold text-graphite/60 hover:text-carbon transition-colors flex items-center gap-1"
          >
            Book a Demo
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
```

### `src/components/layout/MobileDrawer.tsx`
Mobile navigation drawer with submenu accordions.

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, ChevronDown, Globe, LogIn, Headphones } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { RAMSLogo } from "@/components/ui/RAMSLogo";
import { NAV_CONFIG } from "@/lib/navigation";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const close = useCallback(() => {
    setExpanded(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close]);

  // Rendered into <body>: the sticky <header> carries a transform, which would
  // otherwise become the containing block for these position:fixed children
  // and collapse the drawer to the header's height.
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-carbon/40 backdrop-blur-sm z-[90]"
            onClick={close}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[100] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-steel">
              <RAMSLogo className="h-7" />
              <button
                onClick={close}
                className="p-2 rounded-none text-graphite hover:text-carbon hover:bg-off-white transition-colors"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto py-4" aria-label="Mobile navigation">
              <ul role="list">
                {NAV_CONFIG.map((item, i) => {
                  const isOpenItem = expanded === item.label;
                  return (
                    <motion.li
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.2 }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setExpanded(isOpenItem ? null : item.label)
                        }
                        aria-expanded={isOpenItem}
                        className={cn(
                          "flex items-center justify-between w-full px-6 py-4 text-left text-base font-semibold transition-colors",
                          isOpenItem
                            ? "text-signal-orange bg-off-white"
                            : "text-carbon hover:text-signal-orange hover:bg-off-white",
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 shrink-0 transition-transform duration-200",
                            isOpenItem
                              ? "rotate-180 text-signal-orange"
                              : "text-steel",
                          )}
                          aria-hidden="true"
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpenItem && (
                          <motion.div
                            key="panel"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden bg-off-white/60"
                          >
                            <div className="pb-3">
                              {item.groups.map((group) => (
                                <div key={group.title ?? "ungrouped"} className="pt-3">
                                  {group.title && (
                                    <div className="px-6 pb-1 text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-graphite/45">
                                      {group.title}
                                    </div>
                                  )}
                                  {group.links.map((link) => (
                                    <Link
                                      key={link.href}
                                      href={link.href}
                                      onClick={close}
                                      className="block pl-10 pr-6 py-2.5 text-[14px] font-medium text-graphite hover:text-signal-orange transition-colors"
                                    >
                                      {link.label}
                                    </Link>
                                  ))}
                                </div>
                              ))}

                              <Link
                                href={item.href}
                                onClick={close}
                                className="block pl-10 pr-6 pt-3 text-[12px] font-mono font-semibold tracking-[0.12em] uppercase text-signal-orange"
                              >
                                All {item.label} &rarr;
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  );
                })}
              </ul>

              <div className="mx-6 my-4 border-t border-steel" />

              {/* Secondary links */}
              <div className="px-6 space-y-1">
                <Link
                  href="/platform/login"
                  onClick={close}
                  className="flex items-center gap-3 py-3 text-sm font-medium text-graphite hover:text-carbon transition-colors"
                >
                  <LogIn className="w-4 h-4" aria-hidden="true" />
                  Platform Login
                </Link>
                <Link
                  href="/support"
                  onClick={close}
                  className="flex items-center gap-3 py-3 text-sm font-medium text-graphite hover:text-carbon transition-colors"
                >
                  <Headphones className="w-4 h-4" aria-hidden="true" />
                  Support
                </Link>
                <Link
                  href="/company/contact"
                  onClick={close}
                  className="flex items-center gap-3 py-3 text-sm font-medium text-graphite hover:text-carbon transition-colors"
                >
                  <Globe className="w-4 h-4" aria-hidden="true" />
                  Contact Us
                </Link>
              </div>
            </nav>

            {/* CTA Buttons */}
            <div className="p-6 border-t border-steel space-y-3">
              <Link
                href="/find-your-starting-point"
                onClick={close}
                className="flex items-center justify-center w-full px-5 py-3 rounded-none text-base font-semibold text-carbon border-2 border-carbon hover:bg-carbon hover:text-white transition-all duration-200"
              >
                Find Your Starting Point
              </Link>
              <Link
                href="/book-a-demo"
                onClick={close}
                className="flex items-center justify-center w-full px-5 py-3 rounded-none text-base font-semibold bg-signal-orange text-white hover:bg-signal-orange-hover transition-all duration-200"
              >
                Book a Demo
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
```

### `src/components/layout/Footer.tsx`
Site footer. Note: its Hardware column links `/hardware/ai-cameras`, `/hardware/omnibox-edge`, `/hardware/omnibox-ai`, `/hardware/lidar`, `/hardware/driver-monitoring` — none of which exist yet.

```tsx
"use client";

import Link from "next/link";
import { Globe, ShieldCheck } from "lucide-react";
import { RAMSLogo } from "@/components/ui/RAMSLogo";

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
  </svg>
);

const YouTubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136C4.495 20.455 12 20.455 12 20.455s7.505 0 9.376-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 .3a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.08 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.11 3.18a4.65 4.65 0 0 1 1.24 3.22c0 4.61-2.81 5.63-5.48 5.92.42.36.81 1.09.81 2.2v3.26c0 .32.22.7.83.58A12 12 0 0 0 12 .3" />
  </svg>
);

type FooterColumn = {
  title: string;
  links: { label: string; href: string }[];
};

const COLUMNS: FooterColumn[] = [
  {
    title: "Solutions",
    links: [
      { label: "Rack Intelligence", href: "/solutions/rack-intelligence" },
      { label: "MHE Intelligence", href: "/solutions/mhe-intelligence" },
      { label: "Inventory Intelligence", href: "/solutions/inventory-intelligence" },
      { label: "Warehouse Execution", href: "/solutions/warehouse-execution" },
      { label: "Management Intelligence", href: "/solutions/management-intelligence" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Digital Twin", href: "/platform/digital-twin" },
      { label: "AI Operational Intelligence", href: "/platform/ai-operational-intelligence" },
      { label: "Execution Engine", href: "/platform/execution-engine" },
      { label: "Integrations", href: "/platform/integrations" },
      { label: "Security", href: "/platform/security" },
    ],
  },
  {
    title: "Hardware",
    links: [
      { label: "AI Cameras", href: "/hardware/ai-cameras" },
      { label: "OmniBox Edge", href: "/hardware/omnibox-edge" },
      { label: "OmniBox AI", href: "/hardware/omnibox-ai" },
      { label: "LiDAR", href: "/hardware/lidar" },
      { label: "Driver Monitoring", href: "/hardware/driver-monitoring" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "3PL & Logistics", href: "/industries#3pl" },
      { label: "Retail & E-commerce", href: "/industries#ecommerce" },
      { label: "Manufacturing", href: "/industries#manufacturing" },
      { label: "Cold Chain", href: "/industries#cold-storage" },
      { label: "Automotive", href: "/industries#automotive" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/company/about" },
      { label: "Customers", href: "/company/customers" },
      { label: "Careers", href: "/company/careers" },
      { label: "Newsroom", href: "/resources/insights" },
      { label: "Contact", href: "/company/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/resources/docs" },
      { label: "Case Studies", href: "/resources/case-studies" },
      { label: "Whitepapers", href: "/resources/whitepapers" },
      { label: "Blog", href: "/resources/blog" },
      { label: "Support", href: "/resources/support" },
    ],
  },
];


/** The registered entity. `RAMS Digital` is the product; this is the company,
 *  and a footer is where the two get told apart. */
const LEGAL_NAME = "INODE RAMS BUILT ENV TECH PVT. LTD.";

/**
 * The office and the ways to reach it, under the brand block.
 *
 * The phone numbers are `tel:` links with the spaces stripped and the email is
 * a `mailto:` — a number a reader has to retype by hand is a number that does
 * not get called from a phone.
 */
const COMPANY: { label: string; lines: { text: string; href?: string }[] }[] = [
  {
    label: "Pune office",
    lines: [
      { text: "Sadanand Business Centre" },
      { text: "5th Floor, Baner, Pune – 411045" },
      { text: "Maharashtra, India" },
    ],
  },
  {
    label: "Contact",
    lines: [
      { text: "connect@rams.digital", href: "mailto:connect@rams.digital" },
      { text: "+91 9175870099", href: "tel:+919175870099" },
      { text: "+91 9028638907", href: "tel:+919028638907" },
    ],
  },
];

const SOCIALS = [
  { icon: LinkedInIcon, href: "https://linkedin.com/company/rams", label: "LinkedIn" },
  { icon: XIcon, href: "https://x.com/rams", label: "X" },
  { icon: YouTubeIcon, href: "https://youtube.com/@rams", label: "YouTube" },
  { icon: GitHubIcon, href: "https://github.com/rams", label: "GitHub" },
];

const LEGAL = [
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Use", href: "/legal/terms" },
  { label: "Cookies", href: "/legal/cookies" },
  { label: "Accessibility", href: "/legal/accessibility" },
  { label: "Sitemap", href: "/sitemap" },
];

export function Footer() {
  return (
    <footer className="w-full bg-surface-dark text-white">
      <div className="rams-container pt-[72px] pb-8">
        {/* Top: Brand + Link columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand block */}
          <div className="lg:col-span-3">
            <RAMSLogo className="h-8" variant="white" />

            <p className="mt-4 text-[12.5px] leading-[1.5] text-white/55">
              {LEGAL_NAME}
            </p>

            {/* The brand line, in place of the paragraph of marketing copy
                that used to sit here. It sits close under the legal name
                rather than floating between it and the socials — at 19px with
                20px of air on both sides it read as its own block. Both lines
                are white/55: they are one block, and two weights of grey made
                them look like a heading and a caption. */}
            <p className="mt-2 text-[15px] italic text-white/55 tracking-[-0.01em]">
              Clarity in Motion.
            </p>

            {/* Social icons */}
            <div className="mt-6 flex items-center gap-2">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/25 hover:bg-white/5 transition-all duration-200"
                >
                  <Icon width={14} height={14} />
                </a>
              ))}
            </div>

            {/* The column ran empty below the socials while the address sat in
                a band of its own further down. It belongs with the brand. */}
            <div className="mt-10 space-y-8">
              {COMPANY.map((c) => (
                <div key={c.label}>
                  <h3 className="text-[10.5px] font-mono font-bold tracking-[0.2em] uppercase text-white/40">
                    {c.label}
                  </h3>
                  <div className="mt-3.5 space-y-1.5">
                    {c.lines.map((l) =>
                      l.href ? (
                        <a
                          key={l.text}
                          href={l.href}
                          className="block text-sm leading-[1.6] text-white/70 hover:text-white transition-colors duration-200 w-fit"
                        >
                          {l.text}
                        </a>
                      ) : (
                        <span
                          key={l.text}
                          className="block text-sm leading-[1.6] text-white/70"
                        >
                          {l.text}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-3 gap-x-14 gap-y-12">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-semibold text-white tracking-[0.01em] leading-none">
                  {col.title}
                </h3>
                <ul className="mt-5 space-y-4">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm leading-[1.5] text-white/50 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mt-[60px] mb-14" />

        {/* Trust & Security — clean horizontal band */}
        <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-x-20 gap-y-10">
          {/* Left: eyebrow + heading inline */}
          <div className="flex-1 max-w-[640px]">
            <div className="inline-flex items-center gap-2 text-[10.5px] font-bold tracking-[0.22em] uppercase text-signal-orange mb-4">
              <ShieldCheck size={13} strokeWidth={2} />
              <span>Trust &amp; Security</span>
            </div>
            <h3 className="font-semibold text-white text-2xl leading-[34px] tracking-[-0.015em]">
              Enterprise-grade security, audited and certified.
            </h3>
            <p className="text-white/50 mt-3 text-sm leading-[22px] max-w-[520px]">
              RAMS meets the security, privacy and reliability standards
              trusted by global enterprise operations.
            </p>
          </div>

          {/* Right: floating badges — no card, clean */}
          <div className="flex items-center shrink-0 gap-x-8">
            <div className="flex flex-col items-center gap-2.5">
              <img
                src="/Product/soc-type-1.jpg"
                alt="AICPA SOC 2"
                className="w-[88px] h-[88px] rounded-full object-cover block"
              />
              <span className="text-white/45 text-[10.5px] tracking-[0.14em] font-semibold uppercase">
                SOC 2
              </span>
            </div>
            <div className="flex flex-col items-center gap-2.5">
              <img
                src="/Product/soc-type-2.jpg"
                alt="AICPA SOC 2 Type I"
                className="w-[88px] h-[88px] rounded-full object-cover block"
              />
              <span className="text-white/45 text-[10.5px] tracking-[0.14em] font-semibold uppercase">
                SOC 2 · Type I
              </span>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-white/10 mt-[60px] mb-7" />

        {/* Bottom footer */}
        <div>
          {/* Row 1 — copyright + legal links, single baseline */}
          <div className="flex flex-wrap items-center min-h-10 gap-x-6 gap-y-2">
            <span className="text-white/45 text-base leading-6">
              © 2026 RAMS Global. All rights reserved.
            </span>
            {LEGAL.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-white/45 hover:text-white transition-colors duration-200 text-base leading-6"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Row 2 — region */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-white/45 hover:text-white transition-colors duration-200 mt-4 text-base leading-6"
            aria-label="Change region"
          >
            <Globe size={14} strokeWidth={1.75} />
            <span>United Kingdom (EN)</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
```


## Not included

`src/components/layout/MegaMenuV2Panel.tsx` (586 lines) — the image-driven V2
mega menu. Only reachable by setting `localStorage["rams-nav-version"] = "v2"`
by hand, since `<VersionSwitcher />` is not mounted anywhere. V1 is what ships.

