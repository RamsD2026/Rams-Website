"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItemV2, NavLinkV2, HardwareFamily } from "@/lib/navigation-v2";

/* ════════════════════════════════════
   Shared animation variants
════════════════════════════════════ */
const panelVariants: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.14, ease: "easeIn" } },
};

/* Products col: 120ms fade + 8px lift — per spec */
const productsFade: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.12, ease: "easeOut" } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.1, ease: "easeIn" } },
};

/* Right card content: title slides up 8px */
const contentRise: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut", delay: 0.06 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.12, ease: "easeIn" } },
};

const imageCross: Variants = {
  hidden: { opacity: 0, scale: 1.04 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.32, ease: "easeOut" } },
  exit: { opacity: 0, scale: 1.02, transition: { duration: 0.16, ease: "easeIn" } },
};

/* ════════════════════════════════════
   Shared types
════════════════════════════════════ */
interface FeaturedData {
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
}

/* ════════════════════════════════════
   Editorial featured card
   Lighter overlay — image-forward, not black box
════════════════════════════════════ */
function FeaturedCard({
  data,
  productCount,
  onClose,
}: {
  data: FeaturedData;
  productCount?: number;
  onClose: () => void;
}) {
  return (
    <div className="relative h-full min-h-[340px] rounded-2xl overflow-hidden bg-[#1a1a1b]">
      {/* Crossfading image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`img-${data.title}`}
          variants={imageCross}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute inset-0"
        >
          <Image
            src={data.image}
            alt={data.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1440px) 45vw, 648px"
            unoptimized
          />
        </motion.div>
      </AnimatePresence>

      {/* Lighter gradient — 30–40% overlay so photo breathes */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(14,14,15,0.82) 0%, rgba(14,14,15,0.45) 45%, rgba(14,14,15,0.12) 72%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Eyebrow badge — top left */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`badge-${data.eyebrow}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.1, duration: 0.18 } }}
          exit={{ opacity: 0, transition: { duration: 0.08 } }}
          className="absolute top-5 left-5"
        >
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-signal-orange text-white text-xs font-bold tracking-[0.14em] uppercase">
            <span className="w-[5px] h-[5px] rounded-full bg-white/70" aria-hidden="true" />
            {data.eyebrow}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Bottom content — slides up on swap */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`content-${data.title}`}
          variants={contentRise}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2"
        >
          <h3 className="text-xl font-bold text-white leading-snug">
            {data.title}
          </h3>
          <p className="text-[12.5px] text-white/60 leading-relaxed max-w-[36ch]">
            {data.description}
          </p>

          <div className="flex items-center gap-4 mt-1">
            <Link
              href={data.href}
              onClick={onClose}
              className={cn(
                "inline-flex items-center gap-1.5 group",
                "text-[12.5px] font-semibold text-signal-orange hover:text-white transition-colors duration-150",
                "outline-none focus-visible:ring-2 focus-visible:ring-signal-orange focus-visible:ring-offset-1 focus-visible:ring-offset-carbon rounded-sm"
              )}
            >
              {data.cta}
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true" />
            </Link>

            {productCount !== undefined && (
              <span className="text-xs text-white/30 font-medium">
                {productCount} product{productCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════
   Standard 2-column panel
   (Solutions, Platform, Services, etc.)
════════════════════════════════════ */
function LinkRow({
  link,
  index,
  isActive,
  onMouseEnter,
  onMouseLeave,
  onClose,
}: {
  link: NavLinkV2;
  index: number;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="grid group"
      style={{ gridTemplateColumns: "48px 1fr" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Fixed 48px number gutter — never touched by the active card */}
      <div className="flex items-center justify-center pt-px">
        <span className={cn(
          "text-xs font-bold tabular-nums transition-colors duration-150",
          isActive ? "text-signal-orange" : "text-graphite/30 group-hover:text-graphite/50"
        )}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Content area — active card lives entirely here */}
      <Link
        href={link.href}
        onClick={onClose}
        className={cn(
          "relative flex items-center gap-3 py-3 pl-3 pr-4 rounded-lg transition-colors duration-150",
          "outline-none focus-visible:ring-2 focus-visible:ring-signal-orange focus-visible:ring-offset-1",
          isActive ? "bg-signal-orange/5" : "hover:bg-off-white/70"
        )}
      >
        {/* 3px left accent — stays inside content column */}
        <motion.div
          aria-hidden="true"
          className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-signal-orange"
          animate={{ opacity: isActive ? 1 : 0, scaleY: isActive ? 1 : 0.3 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={{ originY: "50%" }}
        />

        <div className="flex flex-col min-w-0 flex-1 pl-1">
          <span className={cn(
            "text-[13.5px] leading-tight transition-all duration-150",
            isActive ? "font-bold text-carbon" : "font-semibold text-carbon/80"
          )}>
            {link.label}
          </span>
          <span className="mt-0.5 text-xs text-graphite/55 leading-snug">
            {link.description}
          </span>
        </div>
        <ArrowRight className={cn(
          "w-3.5 h-3.5 ml-auto shrink-0 transition-all duration-150",
          isActive
            ? "text-signal-orange opacity-100 translate-x-0"
            : "text-graphite/30 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
        )} aria-hidden="true" />
      </Link>
    </div>
  );
}

function StandardPanel({ config, onClose }: { config: NavItemV2; onClose: () => void }) {
  const [hoveredLink, setHoveredLink] = useState<NavLinkV2 | null>(null);
  const activeFeatured = hoveredLink ? hoveredLink.featured : config.sectionFeatured;

  return (
    <div className="flex gap-8 items-stretch">
      <div className="w-[42%] shrink-0 flex flex-col">
        <div className="mb-5 flex items-center gap-3 pl-[48px]">
          <div className="w-5 h-[2px] rounded-full bg-signal-orange" aria-hidden="true" />
          <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-graphite/50">
            {config.tagline}
          </p>
        </div>
        <div className="flex flex-col gap-0.5">
          {config.links.map((link, i) => (
            <LinkRow
              key={link.href}
              link={link}
              index={i}
              isActive={hoveredLink?.href === link.href}
              onMouseEnter={() => setHoveredLink(link)}
              onMouseLeave={() => setHoveredLink(null)}
              onClose={onClose}
            />
          ))}
        </div>
        <div className="mt-5 pt-5 border-t border-steel pl-[48px]">
          <Link
            href={config.href}
            onClick={onClose}
            className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-graphite/60 hover:text-signal-orange transition-colors duration-150 group outline-none focus-visible:ring-2 focus-visible:ring-signal-orange rounded-sm"
          >
            View all {config.label}
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="w-px bg-steel self-stretch shrink-0" aria-hidden="true" />

      <div className="flex-1 min-w-0">
        <FeaturedCard data={activeFeatured} onClose={onClose} />
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   Hardware: Col 1 — Family selector tab
   Typography + spacing defines hierarchy
   No bullets, no dots
════════════════════════════════════ */
function FamilyTab({
  family,
  isActive,
  onMouseEnter,
}: {
  family: HardwareFamily;
  isActive: boolean;
  onMouseEnter: () => void;
}) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      className={cn(
        "relative cursor-default pl-5 pr-4 py-3.5 rounded-md transition-all duration-150",
        isActive
          ? "bg-signal-orange/[0.04]"
          : "hover:bg-off-white/60"
      )}
    >
      {/* 3px left rail — active only */}
      <motion.div
        aria-hidden="true"
        className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full bg-signal-orange"
        animate={{ opacity: isActive ? 1 : 0, scaleY: isActive ? 1 : 0.3 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        style={{ originY: "50%" }}
      />

      <p className={cn(
        "text-[13.5px] leading-tight transition-all duration-150",
        isActive ? "font-bold text-carbon" : "font-semibold text-carbon/80"
      )}>
        {family.label}
      </p>
      <p className="mt-1 text-[11.5px] leading-snug text-graphite/45">
        {family.tagline}
      </p>
    </div>
  );
}

/* ════════════════════════════════════
   Hardware: Col 2 — Product row
   Self-contained card — accent bar lives
   INSIDE the card, text always at same
   horizontal baseline active or not.

   Spec:
     16px left padding → 2px bar → 16px gap → text
     = pl-[34px] on the Link
     Vertical padding: py-4 (16px)
     Right padding: pr-5 (20px)
════════════════════════════════════ */
function ProductRow({
  link,
  isActive,
  onMouseEnter,
  onMouseLeave,
  onClose,
}: {
  link: NavLinkV2;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="group"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link
        href={link.href}
        onClick={onClose}
        className={cn(
          // Card container — never touches column edge (handled by column px-2)
          "relative flex items-center overflow-hidden rounded-xl transition-all duration-200",
          // Internal padding: 16px top/bottom, text at 34px from left, 20px right
          "py-4 pl-[34px] pr-5",
          "outline-none focus-visible:ring-2 focus-visible:ring-signal-orange focus-visible:ring-offset-1",
          isActive
            ? "bg-signal-orange/[0.045]"
            : "hover:bg-off-white/70"
        )}
      >
        {/* Accent bar: absolute inside card, 16px from left edge, 2px wide */}
        <motion.div
          aria-hidden="true"
          className="absolute left-4 top-3 bottom-3 w-[2px] rounded-full bg-signal-orange"
          animate={{ opacity: isActive ? 1 : 0, scaleY: isActive ? 1 : 0.3 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{ originY: "50%" }}
        />

        {/* Text — always at the same left position (pl-[34px] on parent) */}
        <div className="flex flex-col min-w-0 flex-1">
          <span className={cn(
            "text-sm font-semibold leading-tight transition-colors duration-200",
            isActive ? "text-signal-orange" : "text-carbon"
          )}>
            {link.label}
          </span>
          <span className="mt-0.5 text-[11.5px] text-graphite/55 leading-snug">
            {link.description}
          </span>
        </div>

        {/* Arrow — far right, slides in on hover */}
        <ArrowRight className={cn(
          "w-3.5 h-3.5 shrink-0 ml-3 transition-all duration-200",
          isActive
            ? "text-signal-orange opacity-100 translate-x-0"
            : "text-graphite/30 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
        )} aria-hidden="true" />
      </Link>
    </div>
  );
}

/* ════════════════════════════════════
   3-column Hardware mega panel
   25% | 30% | 45%
════════════════════════════════════ */
function HardwarePanel({ config, onClose }: { config: NavItemV2; onClose: () => void }) {
  const families = config.families!;
  const [activeFamily, setActiveFamily] = useState<HardwareFamily>(families[0]);
  const [hoveredProduct, setHoveredProduct] = useState<NavLinkV2 | null>(null);

  const activeFeatured = hoveredProduct ? hoveredProduct.featured : activeFamily.featured;
  const productCount = activeFamily.products.length;

  const handleFamilyHover = (family: HardwareFamily) => {
    if (activeFamily.label !== family.label) {
      setActiveFamily(family);
      setHoveredProduct(null);
    }
  };

  return (
    <div className="flex flex-col">

      {/* Full-width tagline header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="w-5 h-[2px] rounded-full bg-signal-orange shrink-0" aria-hidden="true" />
        <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-graphite/50 whitespace-nowrap">
          {config.tagline}
        </p>
      </div>

      {/* 3-column body */}
      <div className="flex items-stretch gap-6 flex-1">

      {/* ── Col 1 (25%) — Family selector ── */}
      <div className="w-[25%] shrink-0 flex flex-col">
        <div className="flex flex-col gap-0.5 flex-1">
          {families.map((family) => (
            <FamilyTab
              key={family.href}
              family={family}
              isActive={activeFamily.label === family.label}
              onMouseEnter={() => handleFamilyHover(family)}
            />
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-steel">
          <Link
            href="/hardware"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-graphite/50 hover:text-signal-orange transition-colors duration-150 group outline-none focus-visible:ring-2 focus-visible:ring-signal-orange rounded-sm"
          >
            View all Hardware
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px bg-steel self-stretch shrink-0" aria-hidden="true" />

      {/* ── Col 2 (30%) — Products for selected family ── */}
      {/* px-2 ensures cards never touch the column dividers */}
      <div className="w-[30%] shrink-0 flex flex-col px-2">
        <p className="mb-3 text-xs font-bold tracking-[0.22em] uppercase text-graphite/40">
          Products
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeFamily.label}
            variants={productsFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col gap-1.5"
          >
            {activeFamily.products.map((product) => (
              <ProductRow
                key={product.href}
                link={product}
                isActive={hoveredProduct?.href === product.href}
                onMouseEnter={() => setHoveredProduct(product)}
                onMouseLeave={() => setHoveredProduct(null)}
                onClose={onClose}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 pt-4 border-t border-steel">
          <Link
            href={activeFamily.href}
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-graphite/50 hover:text-signal-orange transition-colors duration-150 group outline-none focus-visible:ring-2 focus-visible:ring-signal-orange rounded-sm"
          >
            Explore {activeFamily.label}
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px bg-steel self-stretch shrink-0" aria-hidden="true" />

      {/* ── Col 3 (45%) — Dynamic featured card ── */}
      <div className="flex-1 min-w-0">
        <FeaturedCard
          data={activeFeatured}
          productCount={hoveredProduct ? undefined : productCount}
          onClose={onClose}
        />
      </div>
      </div>{/* end 3-column body */}
    </div>
  );
}

/* ════════════════════════════════════
   Root export — selects layout by config
════════════════════════════════════ */
interface MegaMenuV2PanelProps {
  config: NavItemV2;
  onClose: () => void;
}

export function MegaMenuV2Panel({ config, onClose }: MegaMenuV2PanelProps) {
  return (
    <motion.div
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute top-full left-0 right-0 z-50 bg-white border-t border-steel shadow-[0_24px_64px_-12px_rgba(14,14,15,0.18)]"
      role="region"
      aria-label={`${config.label} navigation panel`}
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 py-8">
        {config.families ? (
          <HardwarePanel config={config} onClose={onClose} />
        ) : (
          <StandardPanel config={config} onClose={onClose} />
        )}
      </div>

      {/* Footer strip */}
      <div className="border-t border-steel bg-off-white/50">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 py-3.5 flex items-center gap-6">
          <span className="text-xs text-graphite/40 font-medium tracking-wide uppercase">
            Quick access
          </span>
          <div className="w-px h-3 bg-steel" aria-hidden="true" />
          {config.families ? (
            <>
              <Link href="/hardware" onClick={onClose} className="text-xs font-semibold text-carbon hover:text-signal-orange transition-colors flex items-center gap-1.5 group">
                View All Hardware
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <Link href="/book-demo?topic=hardware" onClick={onClose} className="text-xs font-semibold text-graphite/50 hover:text-carbon transition-colors flex items-center gap-1.5 group">
                Book Hardware Demo
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </>
          ) : (
            <>
              <Link href="/get-started" onClick={onClose} className="text-xs font-semibold text-carbon hover:text-signal-orange transition-colors flex items-center gap-1.5 group">
                Find Your Starting Point
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <Link href="/book-demo" onClick={onClose} className="text-xs font-semibold text-graphite/50 hover:text-carbon transition-colors flex items-center gap-1.5 group">
                Book a Demo
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
