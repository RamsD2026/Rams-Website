"use client";

import type { LucideIcon } from "lucide-react";

/**
 * The card vocabulary the certifications page shares with the platform
 * pages — `RdsProblem`, `WexWhy` — so every section below the hero is built
 * from the same three things:
 *
 *   CERT_CARD   12px radius, the #E8E8ED hairline, the two-part shadow
 *   CertTile    a 48px tile tinted orange holding a 22px glyph at stroke 2
 *   CertShine   the conic border shine on hover, namespaced `certx`
 *
 * Pair a card with `certx-card` and the hover lift; add `certx-dark` on the
 * dark bands so the travelling arc is white instead of orange.
 */

export const CERT_LINE = "#E8E8ED";

export const CERT_CARD: React.CSSProperties = {
  borderRadius: 12,
  border: `1px solid ${CERT_LINE}`,
  boxShadow: "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
};

export const CERT_CARD_DARK: React.CSSProperties = {
  borderRadius: 12,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.10)",
};

export const CERT_TILE: React.CSSProperties = {
  borderRadius: 8,
  background: "rgba(255,106,0,0.08)",
  border: "1px solid rgba(255,106,0,0.18)",
};

const CERT_TILE_DARK: React.CSSProperties = {
  borderRadius: 8,
  background: "rgba(255,106,0,0.14)",
  border: "1px solid rgba(255,106,0,0.30)",
};

export function CertTile({
  icon: Icon,
  dark = false,
}: {
  icon: LucideIcon;
  dark?: boolean;
}) {
  return (
    <div
      className="w-12 h-12 flex items-center justify-center shrink-0"
      style={dark ? CERT_TILE_DARK : CERT_TILE}
    >
      <Icon
        className="w-[22px] h-[22px] text-signal-orange"
        strokeWidth={2}
        aria-hidden
      />
    </div>
  );
}

/**
 * A connector between two tiles. It is drawn edge to edge — from one tile's
 * border to the next — rather than as one track running behind the row,
 * because the tiles are translucent and a track behind them shows through.
 * An orange pulse travels along it on a loop: the partners flow's
 * `ptrflow-run`, in HTML rather than SVG. Position it with `className`;
 * render `<CertFlow />` once in the section that uses it.
 */
export function CertLink({
  axis,
  dark = false,
  delay = 0,
  className = "",
  style,
}: {
  axis: "x" | "y";
  dark?: boolean;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={`certflow certflow-${axis} absolute overflow-hidden ${className}`}
      style={{
        background: dark ? "rgba(255,255,255,0.12)" : "#E4E4E9",
        ...style,
      }}
    >
      <span
        className="certflow-pulse"
        style={{ animationDelay: `${delay}s` }}
      />
    </span>
  );
}

/** The pulse's keyframes, namespaced `certflow`. */
export function CertFlow() {
  return (
    <style>{`
      .certflow-pulse { position: absolute; display: block; }
      .certflow-x .certflow-pulse {
        top: 0; bottom: 0; left: 0; width: 50%;
        background: linear-gradient(to right, transparent, rgba(255,106,0,0.95), transparent);
        animation: certflow-x 2.4s linear infinite;
      }
      .certflow-y .certflow-pulse {
        left: 0; right: 0; top: 0; height: 50%;
        background: linear-gradient(to bottom, transparent, rgba(255,106,0,0.95), transparent);
        animation: certflow-y 1.6s linear infinite;
      }
      @keyframes certflow-x {
        from { transform: translateX(-100%); }
        to   { transform: translateX(200%); }
      }
      @keyframes certflow-y {
        from { transform: translateY(-100%); }
        to   { transform: translateY(200%); }
      }
      @media (prefers-reduced-motion: reduce) {
        .certflow-pulse { animation: none; opacity: 0; }
      }
    `}</style>
  );
}

/**
 * The shine. `@property` and `@keyframes` are global however local the
 * `<style>` looks, so this is namespaced `certx` — distinct from `certcl`,
 * which the SOC 2 bento carries — and identical wherever it is rendered, so
 * several sections rendering it is harmless.
 */
export function CertShine() {
  return (
    <style>{`
      @property --certx-shine-angle {
        syntax: '<angle>';
        initial-value: 0deg;
        inherits: false;
      }
      .certx-card { position: relative; isolation: isolate; }
      .certx-card::before {
        content: "";
        position: absolute;
        inset: -1px;
        border-radius: inherit;
        padding: 1px;
        background: conic-gradient(
          from var(--certx-shine-angle),
          transparent 0deg,
          transparent 300deg,
          rgba(255,106,0,0.9) 340deg,
          transparent 360deg
        );
        -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
                mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
        -webkit-mask-composite: xor;
                mask-composite: exclude;
        opacity: 0;
        transition: opacity 0.35s ease;
        pointer-events: none;
        z-index: 1;
      }
      .certx-card.certx-dark::before {
        background: conic-gradient(
          from var(--certx-shine-angle),
          transparent 0deg,
          transparent 300deg,
          rgba(255,255,255,0.85) 340deg,
          transparent 360deg
        );
      }
      .certx-card:hover::before {
        opacity: 1;
        animation: certx-shine 2.4s linear infinite;
      }
      @keyframes certx-shine {
        to { --certx-shine-angle: 360deg; }
      }
      @media (prefers-reduced-motion: reduce) {
        .certx-card:hover::before { animation: none; }
      }
    `}</style>
  );
}
