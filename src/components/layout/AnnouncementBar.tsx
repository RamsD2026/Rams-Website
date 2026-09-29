"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const ANNOUNCEMENTS = [
  "Introducing RAMS AI Vision — Intelligent Warehouse Perception",
  "New Digital Twin Platform Now Available",
  "RAMS 2.0 Enterprise Suite — GA Release",
];

const LANGUAGES = ["English", "Deutsch", "Français", "日本語", "中文"];

export function AnnouncementBar() {
  const [announcementIndex] = useState(0);
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");

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
