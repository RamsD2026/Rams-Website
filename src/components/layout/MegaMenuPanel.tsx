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
