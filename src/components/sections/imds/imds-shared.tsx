"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { EASE } from "@/components/sections/rackiq/rackiq-shared";

/**
 * The two pieces the IMDS instrument sections share.
 *
 * `Beyond the hour meter` set the pattern: a pill tab bar over one framed
 * panel, and three plain columns underneath saying what the panel is worth.
 * Both work on either surface, so a section can be light or dark without the
 * treatment drifting.
 */

export const LIGHT_LINE = "#E8E8ED";
export const DARK_LINE = "rgba(255,255,255,0.10)";

export type Tone = "light" | "dark";

/* ── the framed panel ────────────────────────────────────── */

/**
 * One panel, with its tabs inside the frame rather than floating above it.
 * The tabs belong to the instrument they switch, so they read as part of its
 * chrome — a row of quiet labels along the top edge, not a control bar.
 */
export function PanelFrame({
  tabs,
  active,
  onChange,
  label,
  tone = "dark",
  children,
}: {
  tabs: string[];
  active: number;
  onChange: (i: number) => void;
  label: string;
  tone?: Tone;
  children: React.ReactNode;
}) {
  const dark = tone === "dark";
  const line = dark ? DARK_LINE : LIGHT_LINE;
  return (
    <div
      className="overflow-hidden max-w-[1080px] mx-auto"
      style={{
        borderRadius: 16,
        background: dark ? "#0E0E11" : "#FFFFFF",
        border: `1px solid ${line}`,
      }}
    >
      <div
        className="flex flex-wrap gap-x-7 px-5 sm:px-8"
        style={{
          borderBottom: `1px solid ${line}`,
          background: dark ? "#0A0C0E" : "#FAFAFB",
        }}
        role="tablist"
        aria-label={label}
      >
        {tabs.map((t, i) => {
          const on = i === active;
          return (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => onChange(i)}
              className={
                "relative pt-4 pb-3.5 text-[12.5px] tracking-[-0.01em] whitespace-nowrap transition-colors duration-200 " +
                (on
                  ? "font-semibold " + (dark ? "text-white" : "text-carbon")
                  : "font-medium " +
                    (dark
                      ? "text-white/40 hover:text-white/75"
                      : "text-graphite/45 hover:text-carbon"))
              }
            >
              {t}
              {on && (
                <motion.span
                  layoutId={`imds-panel-tab-${label}`}
                  className="absolute left-0 right-0 -bottom-px h-px bg-signal-orange"
                  transition={{ duration: 0.35, ease: EASE }}
                />
              )}
            </button>
          );
        })}
      </div>

      {children}
    </div>
  );
}

/* ── tab bar ─────────────────────────────────────────────── */

/**
 * Tabs that sit above a panel rather than inside it.
 *
 * `icons` is optional and positional — one per tab — so existing tab bars are
 * unaffected.
 */
export function TabBar({
  tabs,
  icons,
  active,
  onChange,
  label,
  tone = "dark",
}: {
  tabs: string[];
  icons?: LucideIcon[];
  active: number;
  onChange: (i: number) => void;
  label: string;
  tone?: Tone;
}) {
  const dark = tone === "dark";
  return (
    <div className="flex justify-center">
      <div
        className="inline-flex flex-wrap justify-center gap-1 p-1"
        style={{
          borderRadius: 999,
          background: dark ? "rgba(255,255,255,0.04)" : "#F5F5F7",
          border: `1px solid ${dark ? DARK_LINE : LIGHT_LINE}`,
        }}
        role="tablist"
        aria-label={label}
      >
        {tabs.map((t, i) => {
          const on = i === active;
          const Icon = icons?.[i];
          return (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => onChange(i)}
              className={
                "inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-[12.5px] sm:text-[13px] font-semibold tracking-[-0.01em] whitespace-nowrap transition-colors duration-200 " +
                (on
                  ? "text-white"
                  : dark
                    ? "text-white/50 hover:text-white/85"
                    : "text-graphite/55 hover:text-carbon")
              }
              style={{ background: on ? "#FF6A00" : "transparent" }}
            >
              {Icon && (
                <Icon
                  className="w-[15px] h-[15px] shrink-0"
                  strokeWidth={2}
                  aria-hidden
                />
              )}
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── the three points ────────────────────────────────────── */

export type Point = {
  Icon: LucideIcon;
  ix: string;
  title: string;
  body: string;
};

/**
 * What the reading above is actually worth. Plain columns, no card: the panel
 * is the object, these are the notes on it.
 */
export function Points({
  items,
  tone = "dark",
}: {
  items: Point[];
  tone?: Tone;
}) {
  const dark = tone === "dark";
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-9 max-w-[1080px] mx-auto mt-12">
      {items.map((p, i) => (
        <motion.div
          key={p.ix}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
        >
          <p className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-signal-orange">
            {p.ix}
          </p>
          <h4
            className={
              "mt-3 flex items-center gap-2.5 font-rams-heading text-[17px] font-bold tracking-[-0.02em] leading-[1.25] " +
              (dark ? "text-white" : "text-carbon")
            }
          >
            <p.Icon
              className="w-[18px] h-[18px] text-signal-orange shrink-0"
              strokeWidth={1.8}
              aria-hidden
            />
            {p.title}
          </h4>
          <p
            className={
              "mt-2.5 text-[13px] leading-[1.6] " +
              (dark ? "text-white/50" : "text-graphite/60")
            }
          >
            {p.body}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
