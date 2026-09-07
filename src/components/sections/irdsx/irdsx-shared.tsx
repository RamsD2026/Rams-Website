"use client";

import { motion } from "framer-motion";

/**
 * Shared pieces for the IRDS 0.1 platform page.
 *
 * The software is the argument on this page, so the software is what is on it:
 * the console shows the real IRDS captures out of `SHOTS`, and the field app
 * is drawn screen by screen in `IrxPhoneUI` because there is no mobile capture
 * in /public yet.
 *
 * `Plate` survives for the places where neither is true. It is deliberately
 * obvious — a flat fill, a dashed edge and the caption of the recording it
 * stands in for — because a pretty placeholder is worse than an ugly one: it
 * gets left in. An earlier build of this page was nothing but plates, which is
 * how a platform page ends up with no platform on it.
 *
 * Surfaces here are the site's own, and the type scale is `docs/typography.md`.
 * What is borrowed from the reference is the *composition* — a centred eyebrow
 * and two-tone heading, a two-column old-way/new-way, big product visuals
 * alternating left and right, and a sticky product nav.
 */

export const EASE = [0.22, 1, 0.36, 1] as const;

export const HAIR = "#E8E8ED";
export const SOFT = "#FAFAFB";
export const ORANGE = "#FF6A00";

/* ── the placeholder ─────────────────────────────────────
   A grey plate where a capture goes. It is deliberately obvious: a flat fill,
   a dashed edge and the caption of the recording it is standing in for. A
   pretty placeholder is worse than an ugly one — it gets left in. */

export function Plate({
  label,
  note,
  ratio = "16 / 10",
  tone = "light",
  className,
}: {
  /** What this plate is waiting for — the brief for the capture. */
  label: string;
  /** How long / what it should show. */
  note?: string;
  ratio?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div
      className={"relative w-full overflow-hidden " + (className ?? "")}
      style={{
        aspectRatio: ratio,
        borderRadius: 14,
        background: dark ? "rgba(255,255,255,0.04)" : "#ECECF1",
        border: `1px dashed ${dark ? "rgba(255,255,255,0.18)" : "#D5D5DC"}`,
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
        <span
          className="text-[9.5px] font-mono font-bold tracking-[0.2em] uppercase"
          style={{ color: dark ? "rgba(255,255,255,0.35)" : "#9A9AA4" }}
        >
          Product capture
        </span>
        <span
          className="text-[13px] font-semibold leading-[1.45] max-w-[36ch]"
          style={{ color: dark ? "rgba(255,255,255,0.55)" : "#6E6E78" }}
        >
          {label}
        </span>
        {note && (
          <span
            className="text-[11px] leading-[1.5] max-w-[40ch]"
            style={{ color: dark ? "rgba(255,255,255,0.3)" : "#9A9AA4" }}
          >
            {note}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * A plate inside browser chrome, for anything that is the web console. The
 * chrome is doing work here: this page has to distinguish the desk product
 * from the phone one, and the frame is how a reader tells them apart before
 * reading a word.
 */
export function WebPlate({
  label,
  note,
  path = "app.rams.digital/irds",
  ratio = "16 / 10",
  tone = "light",
}: {
  label: string;
  note?: string;
  path?: string;
  ratio?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div
      className="w-full overflow-hidden"
      style={{
        borderRadius: 16,
        background: dark ? "#0E0E11" : "#FFFFFF",
        border: `1px solid ${dark ? "rgba(255,255,255,0.10)" : "#E4E4E9"}`,
        boxShadow: dark
          ? "0 60px 120px -50px rgba(0,0,0,0.9)"
          : "0 40px 90px -40px rgba(14,14,15,0.22), 0 8px 24px -12px rgba(14,14,15,0.08)",
      }}
    >
      <div
        className="flex items-center gap-2 px-4 h-10 shrink-0"
        style={{
          borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "#EDEDF1"}`,
          background: dark ? "#111114" : SOFT,
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: dark ? "rgba(255,255,255,0.14)" : "#E4E4E9" }}
          />
        ))}
        <div
          className="ml-3 flex-1 max-w-[320px] h-6 rounded-md flex items-center px-3"
          style={{ background: dark ? "rgba(255,255,255,0.05)" : "#F1F1F4" }}
        >
          <span
            className={
              "text-[10.5px] font-mono truncate " +
              (dark ? "text-white/35" : "text-graphite/45")
            }
          >
            {path}
          </span>
        </div>
      </div>

      <div className="p-2 sm:p-2.5">
        <Plate label={label} note={note} ratio={ratio} tone={tone} />
      </div>
    </div>
  );
}

/** A plate in a phone body, for the field app. */
export function PhonePlate({
  label,
  note,
  tone = "light",
}: {
  label: string;
  note?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div
      className="w-full max-w-[260px] mx-auto overflow-hidden"
      style={{
        borderRadius: 34,
        padding: 9,
        background: dark ? "#141418" : "#FFFFFF",
        border: `1px solid ${dark ? "rgba(255,255,255,0.12)" : "#E4E4E9"}`,
        boxShadow: dark
          ? "0 50px 100px -45px rgba(0,0,0,0.9)"
          : "0 40px 90px -40px rgba(14,14,15,0.22)",
      }}
    >
      <div className="relative overflow-hidden" style={{ borderRadius: 26 }}>
        {/* the notch, so it reads as a phone at a glance */}
        <span
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 top-2 w-[68px] h-[5px] rounded-full z-[2]"
          style={{ background: dark ? "rgba(255,255,255,0.14)" : "#DCDCE2" }}
        />
        <Plate label={label} note={note} ratio="9 / 19" tone={tone} />
      </div>
    </div>
  );
}

/* ── the three-line formula ──────────────────────────────
   Every step section closes on the same three lines: what happens, what you
   see, what you get. One shape repeated seven times is what makes a tour feel
   like a tour rather than seven unrelated pitches. */

export function Formula({
  happens,
  see,
  get,
}: {
  happens: string;
  see: string;
  get: string;
}) {
  const rows: [string, string][] = [
    ["What happens", happens],
    ["What you see", see],
    ["What you get", get],
  ];
  return (
    <div className="mt-8 flex flex-col">
      {rows.map(([k, v], i) => (
        <div
          key={k}
          className="flex flex-col gap-1.5 py-3.5"
          style={{ borderTop: i === 0 ? "none" : `1px solid ${HAIR}` }}
        >
          <span className="text-[9.5px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
            {k}
          </span>
          <span className="text-[13.5px] leading-[1.6] text-graphite/70">
            {v}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * A chain of labels with arrows between them — `Rack → Bay → Element →
 * Checkpoint → Observation → Issue`. Used wherever a step is really a path
 * through the data model, which on this product is most of them.
 */
export function Chain({
  items,
  tone = "light",
}: {
  items: string[];
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {items.map((x, i) => (
        <span key={x} className="flex items-center gap-2">
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: EASE }}
            className="px-2.5 py-1.5 rounded-md text-[10.5px] font-mono font-bold tracking-[0.06em] whitespace-nowrap"
            style={{
              background: dark ? "rgba(255,255,255,0.05)" : "#FFFFFF",
              border: `1px solid ${dark ? "rgba(255,255,255,0.12)" : HAIR}`,
              color: dark ? "rgba(255,255,255,0.75)" : "#3A3A42",
            }}
          >
            {x}
          </motion.span>
          {i < items.length - 1 && (
            <span
              aria-hidden
              className="text-[12px] leading-none"
              style={{ color: ORANGE }}
            >
              →
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
