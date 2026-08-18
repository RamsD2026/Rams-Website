"use client";

import { useEffect } from "react";
import { X, ChevronRight, Globe, LogIn, Headphones } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { RAMSLogo } from "@/components/ui/RAMSLogo";

const NAV_ITEMS = [
  { label: "Solutions",   href: "/solutions" },
  { label: "Platform",    href: "/platform" },
  { label: "Hardware",    href: "/hardware" },
  { label: "Services",    href: "/services" },
  { label: "Industries",  href: "/industries" },
  { label: "Resources",   href: "/resources" },
  { label: "Company",     href: "/company" },
];

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
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
            onClick={onClose}
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
                onClick={onClose}
                className="p-2 rounded-none text-graphite hover:text-carbon hover:bg-off-white transition-colors"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto py-4" aria-label="Mobile navigation">
              <ul role="list">
                {NAV_ITEMS.map((item, i) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center justify-between px-6 py-4 text-base font-semibold text-carbon hover:text-signal-orange hover:bg-off-white transition-colors group"
                    >
                      {item.label}
                      <ChevronRight
                        className={cn(
                          "w-4 h-4 text-steel group-hover:text-signal-orange transition-colors"
                        )}
                        aria-hidden="true"
                      />
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mx-6 my-4 border-t border-steel" />

              {/* Secondary links */}
              <div className="px-6 space-y-1">
                <Link
                  href="/platform/login"
                  onClick={onClose}
                  className="flex items-center gap-3 py-3 text-sm font-medium text-graphite hover:text-carbon transition-colors"
                >
                  <LogIn className="w-4 h-4" aria-hidden="true" />
                  Platform Login
                </Link>
                <Link
                  href="/support"
                  onClick={onClose}
                  className="flex items-center gap-3 py-3 text-sm font-medium text-graphite hover:text-carbon transition-colors"
                >
                  <Headphones className="w-4 h-4" aria-hidden="true" />
                  Support
                </Link>
                <Link
                  href="/company/contact"
                  onClick={onClose}
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
                onClick={onClose}
                className="flex items-center justify-center w-full px-5 py-3 rounded-none text-base font-semibold text-carbon border-2 border-carbon hover:bg-carbon hover:text-white transition-all duration-200"
              >
                Find Your Starting Point
              </Link>
              <Link
                href="/book-a-demo"
                onClick={onClose}
                className="flex items-center justify-center w-full px-5 py-3 rounded-none text-base font-semibold bg-signal-orange text-white hover:bg-signal-orange-hover transition-all duration-200"
              >
                Book a Demo
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
