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
                                <div key={group.title} className="pt-3">
                                  {item.groups.length > 1 && (
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
