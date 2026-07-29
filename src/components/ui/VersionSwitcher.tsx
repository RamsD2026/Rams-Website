"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

/* ── Types ── */
export type NavVersion = "v1" | "v2";

const STORAGE_KEY = "rams-nav-version";

/* ── Hook ── */
export function useNavVersion(): [NavVersion, (v: NavVersion) => void] {
  const [version, setVersionState] = useState<NavVersion>("v1");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as NavVersion | null;
      if (stored === "v1" || stored === "v2") {
        setVersionState(stored);
      }
    } catch {
      // localStorage unavailable (SSR or private browsing)
    }
  }, []);

  const setVersion = (v: NavVersion) => {
    setVersionState(v);
    try {
      localStorage.setItem(STORAGE_KEY, v);
    } catch {
      // ignore
    }
  };

  return [version, setVersion];
}

/* ── Dropdown animation ── */
const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.18, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: 6,
    scale: 0.97,
    transition: { duration: 0.13, ease: "easeIn" },
  },
};

/* ── Component ── */
const OPTIONS: { version: NavVersion; label: string; sub: string }[] = [
  { version: "v1", label: "V1 — Classic", sub: "Functional mega menu" },
  { version: "v2", label: "V2 — Editorial", sub: "Image-driven mega menu" },
];

export function VersionSwitcher() {
  const [version, setVersion] = useNavVersion();
  const [open, setOpen] = useState(false);

  const activeOption = OPTIONS.find((o) => o.version === version) ?? OPTIONS[0];

  const handleSelect = (v: NavVersion) => {
    setVersion(v);
    setOpen(false);
    if (v !== version) window.location.reload();
  };

  return (
    <div className="fixed top-6 right-6 z-[200] flex flex-col-reverse items-end gap-2">
      {/* Dropdown (renders below the pill) */}
      <AnimatePresence>
        {open && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-[#0E0E0F] border border-white/10 rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] min-w-[200px]"
            role="listbox"
            aria-label="Select navigation version"
          >
            {OPTIONS.map((opt) => {
              const isActive = opt.version === version;
              return (
                <button
                  key={opt.version}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => handleSelect(opt.version)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-150 outline-none",
                    "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FF6A00]",
                    isActive ? "bg-white/5" : "hover:bg-white/5"
                  )}
                >
                  {/* Orange dot indicator */}
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full shrink-0 transition-colors duration-150",
                      isActive ? "bg-[#FF6A00]" : "bg-white/20"
                    )}
                    aria-hidden="true"
                  />
                  <div className="flex flex-col min-w-0">
                    <span
                      className={cn(
                        "text-[13px] font-semibold leading-tight",
                        isActive ? "text-white" : "text-white/60"
                      )}
                    >
                      {opt.label}
                    </span>
                    <span className="text-[11px] text-white/35 leading-tight mt-0.5">
                      {opt.sub}
                    </span>
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pill trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Switch navigation version"
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-full",
          "bg-[#0E0E0F] border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.4)]",
          "text-white text-[12.5px] font-semibold",
          "transition-all duration-200 hover:border-[#FF6A00]/50 hover:shadow-[0_4px_20px_rgba(255,106,0,0.2)]",
          "outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00] focus-visible:ring-offset-1 focus-visible:ring-offset-[#0E0E0F]",
          open && "border-[#FF6A00]/50"
        )}
      >
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FF6A00] text-white leading-none shrink-0">
          {version.toUpperCase()}
        </span>
        <span>{activeOption.label}</span>
        <motion.span
          aria-hidden="true"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="text-white/40 text-[10px] leading-none"
        >
          ▲
        </motion.span>
      </button>
    </div>
  );
}
