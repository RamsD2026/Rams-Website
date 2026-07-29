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
          "group flex flex-col py-3 px-4 rounded-lg transition-colors duration-150",
          "hover:bg-[#F3F1EC]",
          "outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00] focus-visible:ring-offset-1"
        )}
      >
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-[14px] font-semibold text-[#0E0E0F] group-hover:text-[#FF6A00] transition-colors leading-tight">
            {link.label}
          </span>
          {link.meta && (
            <span className="shrink-0 text-[10px] font-semibold tracking-wide text-[#33363A] border border-[#D9DBDD] rounded-full px-2 py-0.5 leading-none">
              {link.meta}
            </span>
          )}
        </div>
        {link.description && (
          <span className="mt-0.5 text-[12.5px] text-[#33363A]/70 leading-snug">
            {link.description}
          </span>
        )}
      </Link>
    </motion.div>
  );
}

/* ── Group heading ── */
function GroupHeading({ title }: { title: string }) {
  return (
    <p className="mb-3 px-4 text-[10.5px] font-bold tracking-[0.18em] uppercase text-[#33363A]/50">
      {title}
    </p>
  );
}

/* ── Featured dark card (Carbon surface) ── */
function FeaturedCard({ config, onClose }: { config: NavItemConfig; onClose: () => void }) {
  const { featured } = config;
  return (
    <div className="relative h-full min-h-[220px] rounded-2xl overflow-hidden bg-[#0E0E0F] flex flex-col p-7">
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
        className="pointer-events-none absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-[#FF6A00]/20 blur-3xl"
      />

      <div className="relative z-10 flex flex-col h-full">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#FF6A00] mb-3">
          {featured.eyebrow}
        </p>
        <h3 className="text-[17px] font-bold text-white leading-snug mb-2.5">
          {featured.title}
        </h3>
        <p className="text-[12.5px] text-[#D9DBDD]/60 leading-relaxed flex-1">
          {featured.description}
        </p>

        {featured.stat && (
          <div className="mt-5 pt-4 border-t border-white/8 flex items-baseline gap-2">
            <span className="text-[26px] font-bold text-white leading-none">
              {featured.stat.value}
            </span>
            <span className="text-[11px] uppercase tracking-wide text-[#D9DBDD]/40">
              {featured.stat.label}
            </span>
          </div>
        )}

        <Link
          href={featured.href}
          onClick={onClose}
          className="mt-5 inline-flex items-center gap-1.5 self-start rounded-full bg-[#FF6A00] hover:bg-[#E55F00] px-4 py-2 text-[12.5px] font-semibold text-white transition-colors duration-150"
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
  return <div className="w-px bg-[#D9DBDD] self-stretch mx-2" aria-hidden="true" />;
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
          <div className="mb-3 h-[1.0625rem]" aria-hidden="true" />
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
    <div className="flex gap-6 items-start">
      <div className="flex-1 grid grid-cols-4 gap-x-2">
        {config.groups.map((group) => (
          <div key={group.title}>
            <GroupHeading title={group.title} />
            <motion.div variants={listVariants} initial="hidden" animate="visible" className="space-y-0.5">
              {group.links.map((l) => (
                <motion.div key={l.href} variants={rowVariant}>
                  <Link
                    href={l.href}
                    onClick={onClose}
                    className={cn(
                      "group flex flex-col py-2.5 px-3 rounded-lg transition-colors duration-150",
                      "hover:bg-[#F3F1EC]",
                      "outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]"
                    )}
                  >
                    <span className="text-[13px] font-semibold text-[#0E0E0F] group-hover:text-[#FF6A00] transition-colors leading-tight">
                      {l.label}
                    </span>
                    {l.description && (
                      <span className="mt-0.5 text-[11.5px] text-[#33363A]/60 leading-snug">
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
      <ColDivider />
      <div className="w-[240px] shrink-0">
        <FeaturedCard config={config} onClose={onClose} />
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
      className="absolute top-full left-0 right-0 z-50 bg-white border-t border-[#D9DBDD] shadow-[0_16px_48px_-8px_rgba(14,14,15,0.12)]"
      role="region"
      aria-label={`${config.label} navigation panel`}
    >
      <div className="px-8 py-8">
        {/* Panel header */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-[10.5px] font-bold tracking-[0.2em] uppercase text-[#33363A]/50">
            {config.label}
          </span>
          <Link
            href={config.href}
            onClick={onClose}
            className="group flex items-center gap-1 text-[12px] font-semibold text-[#33363A] hover:text-[#FF6A00] transition-colors"
          >
            View all {config.label}
            <ArrowRight
              className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-150"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Divider */}
        <div className="mb-7 h-px bg-[#D9DBDD]" aria-hidden="true" />

        {content}
      </div>

      {/* Footer strip */}
      <div className="border-t border-[#D9DBDD] bg-[#F3F1EC]/60">
        <div className="px-8 py-3 flex items-center gap-6">
          <span className="text-[11px] text-[#33363A]/50 font-medium">Quick access</span>
          <Link
            href="/get-started"
            onClick={onClose}
            className="text-[11.5px] font-semibold text-[#0E0E0F] hover:text-[#FF6A00] transition-colors flex items-center gap-1"
          >
            Find Your Starting Point
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </Link>
          <Link
            href="/book-demo"
            onClick={onClose}
            className="text-[11.5px] font-semibold text-[#33363A]/60 hover:text-[#0E0E0F] transition-colors flex items-center gap-1"
          >
            Book a Demo
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
