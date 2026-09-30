"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const ANNOUNCEMENTS = [
  "Introducing RAMS AI Vision — Intelligent Warehouse Perception",
  "New Digital Twin Platform Now Available",
  "RAMS 2.0 Enterprise Suite — GA Release",
];

/**
 * The code beside each language is the site's own habit: a mono, letter-spaced
 * micro-label, the same device the eyebrows and group headings use. It also
 * gives the row a right edge to align to, which a bare list of five words in
 * five different scripts does not have.
 */
const LANGUAGES = [
  { label: "English", code: "EN" },
  { label: "Deutsch", code: "DE" },
  { label: "Français", code: "FR" },
  { label: "日本語", code: "JA" },
  { label: "中文", code: "ZH" },
];

export function AnnouncementBar() {
  const [announcementIndex] = useState(0);
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");

  return (
    <div className="relative z-50 h-10 bg-carbon flex items-center">
      <div className="max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">

        {/* Left — language.
            This was a globe reading GLOBAL that did nothing at all: it looked
            like a region switcher, had no menu behind it, and sat opposite a
            separate language dropdown saying much the same thing. HubSpot
            puts one control here — a globe, the language, a chevron — and
            that is what this is now. The duplicate on the right is gone. */}
        <div className="relative shrink-0">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 text-steel/60 hover:text-steel transition-colors"
            aria-expanded={langOpen}
            aria-haspopup="listbox"
            aria-label="Select language"
          >
            <Globe className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="text-xs font-medium tracking-wide hidden sm:inline">
              {selectedLang}
            </span>
            <ChevronDown
              className={cn(
                "w-3 h-3 transition-transform duration-200",
                langOpen && "rotate-180",
              )}
              aria-hidden="true"
            />
          </button>
          {/* The panel was a flat graphite box with square corners and a
              generic shadow — a browser dropdown that happened to be dark.
              This is built from the vocabulary the rest of the site uses: the
              near-black ground the dark sections run on, a hairline border,
              12px corners and the deep soft shadow the cards carry, a mono
              caps heading, and orange for the one that is current. */}
          <AnimatePresence>
            {langOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.99 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-0 top-full mt-2.5 w-[184px] z-50 overflow-hidden"
                style={{
                  background: "#0B0B0D",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 12,
                  boxShadow:
                    "0 1px 2px rgba(0,0,0,0.30), 0 24px 48px -20px rgba(0,0,0,0.75)",
                }}
              >
                <p
                  className="px-3.5 pt-3 pb-2 text-[9.5px] font-mono font-bold tracking-[0.20em] uppercase text-white/30"
                  id="lang-heading"
                >
                  Language
                </p>
                <div
                  aria-hidden
                  className="mx-3.5 h-px"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                />
                <ul
                  role="listbox"
                  aria-labelledby="lang-heading"
                  className="p-1.5"
                >
                  {LANGUAGES.map((lang) => {
                    const current = lang.label === selectedLang;
                    return (
                      <li key={lang.code}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={current}
                          onClick={() => {
                            setSelectedLang(lang.label);
                            setLangOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12.5px] text-left transition-colors duration-150",
                            current
                              ? "text-signal-orange bg-signal-orange/[0.10]"
                              : "text-white/55 hover:text-white hover:bg-white/[0.06]",
                          )}
                        >
                          <span className="flex-1 truncate">{lang.label}</span>
                          <span
                            className={cn(
                              "font-mono text-[9.5px] font-bold tracking-[0.16em]",
                              current ? "text-signal-orange/70" : "text-white/25",
                            )}
                          >
                            {lang.code}
                          </span>
                          <Check
                            className={cn(
                              "w-3 h-3 shrink-0 transition-opacity duration-150",
                              current ? "opacity-100" : "opacity-0",
                            )}
                            aria-hidden="true"
                          />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
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
          {/* Both pointed at routes that do not exist — /contact and
              /support — and 404ed. Contact is the enquiry page; Support is
              the FAQ help centre, which is the closest thing the site has
              until a support portal exists. */}
          <Link href="/company/contact" className="text-xs text-steel/60 hover:text-steel transition-colors font-medium tracking-wide hidden sm:block">
            Contact
          </Link>
          <Link href="/resources/faqs" className="text-xs text-steel/60 hover:text-steel transition-colors font-medium tracking-wide hidden sm:block">
            Support
          </Link>
          {/* The site's text-link treatment — orange, underlined on hover —
              rather than the outlined box it carried, whose padding class was
              broken anyway (`hover:border-white/30px-2.5`, a missing space). */}
          <Link
            href="/platform/login"
            className="text-xs text-signal-orange hover:underline underline-offset-4 transition-colors duration-200 font-semibold tracking-wide hidden md:block"
          >
            Platform Login
          </Link>
        </div>
      </div>
    </div>
  );
}
