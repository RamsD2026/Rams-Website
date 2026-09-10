"use client";

import { motion } from "framer-motion";
import { Cpu, KeyRound, Lock, RefreshCcw } from "lucide-react";

/**
 * The shield behind the headline, and the four satellites around it.
 *
 * The reference is a cyber-security template: one large shield outline
 * centred behind the type, small circular badges scattered either side each
 * carrying a two-line label, and a dotted field behind all of it. This is
 * that composition on the site's white ground rather than its blue one.
 *
 * ── The shield is behind the words, not beside them ─────────────────
 * It is 520 × 624 centred on the container and starts 152 down from the
 * section's top, so its upper half sits behind the pill and the first line of
 * the h1.
 *
 * That 152, the dotted field's 122 and the satellites' 227 and 352 are all
 * measured from the section's top edge, which means they are keyed to the
 * hero's `pt-40/48/56`. Change that padding and every one of them moves by
 * the same amount, or the shield stops sitting behind the words.
 *
 * That overlap is the reference's whole move — a shield the type sits
 * *inside* reads as protection, and a shield placed next to the type reads as
 * an illustration.
 *
 * Which is why it is drawn at a 1px hairline with a 4% fill rather than as
 * artwork: at any more weight the headline would be competing with it. The
 * stroke is a vertical gradient that fades out by 70%, so the shield arrives
 * at the top and dissolves before it reaches the buttons.
 *
 * ── The satellites clear the headline by arithmetic ─────────────────
 * Each is a badge over a two-line label, about 120 wide, so its half-width is
 * 60. `rams-container` caps at 1280 with 24px padding, so the half-width to
 * play with is 616 and the outermost satellite centre can be no further than
 * 556.
 *
 * The heading is 92px bold at -0.045em, which puts "demonstrable." at roughly
 * 568 wide — 284 either side of centre. The inner pair sit at ±395, so their
 * inner edge is 335 and clears the type by 51.
 *
 * They are `hidden xl:block` for the same reason the numbers work at all:
 * below `xl` the container is narrower than 1280 and the arithmetic stops
 * holding.
 *
 * ── The dotted field ────────────────────────────────────────────────
 * A 26px dot grid, masked to an ellipse behind the shield so it never reaches
 * the section's edges. The reference runs its dots across the whole hero; on
 * white that reads as noise, so this one exists only where the shield is and
 * fades before the copy does.
 */

const SATELLITES: {
  icon: typeof KeyRound;
  title: string;
  note: string;
  x: number;
  y: number;
}[] = [
  {
    icon: KeyRound,
    title: "Role-scoped",
    note: "Access by site",
    x: -395,
    y: 227,
  },
  {
    icon: Lock,
    title: "Examined",
    note: "SOC 2 Type I",
    x: -520,
    y: 352,
  },
  {
    icon: Cpu,
    title: "Least privilege",
    note: "Every interface",
    x: 395,
    y: 227,
  },
  {
    icon: RefreshCcw,
    title: "Traceable",
    note: "Actions & history",
    x: 520,
    y: 352,
  },
];

export function CertShield() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* the dotted field, only where the shield is */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: 122,
          width: 900,
          height: 700,
          backgroundImage:
            "radial-gradient(circle, rgba(14,14,15,0.10) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(ellipse 46% 46% at 50% 46%, #000 0%, #000 42%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 46% 46% at 50% 46%, #000 0%, #000 42%, transparent 78%)",
        }}
      />

      {/* the shield */}
      <motion.svg
        viewBox="0 0 100 120"
        fill="none"
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: 152, width: 520, height: 624 }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <defs>
          <linearGradient id="cert-shield-line" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6A00" stopOpacity="0.55" />
            <stop offset="38%" stopColor="#FF6A00" stopOpacity="0.28" />
            <stop offset="72%" stopColor="#FF6A00" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="cert-shield-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6A00" stopOpacity="0.05" />
            <stop offset="60%" stopColor="#FF6A00" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d="M50 2 L96 18 V58 C96 88 74 108 50 118 C26 108 4 88 4 58 V18 Z"
          fill="url(#cert-shield-fill)"
          stroke="url(#cert-shield-line)"
          strokeWidth="0.8"
        />
        <path
          d="M50 10 L88 23 V57 C88 82 70 99 50 108 C30 99 12 82 12 57 V23 Z"
          stroke="url(#cert-shield-line)"
          strokeWidth="0.5"
          opacity="0.6"
        />
      </motion.svg>

      {/* the satellites */}
      <div className="hidden xl:block">
        {SATELLITES.map((s, i) => (
          <motion.div
            key={s.title}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-[132px] text-center"
            style={{ left: `calc(50% + ${s.x}px)`, top: s.y }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.7 + i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span
              className="inline-flex items-center justify-center w-11 h-11 bg-white"
              style={{
                borderRadius: 999,
                border: "1px solid #E8E8ED",
                boxShadow: "0 12px 26px -14px rgba(0,0,0,0.22)",
              }}
            >
              <s.icon
                className="w-[17px] h-[17px] text-signal-orange"
                strokeWidth={1.9}
              />
            </span>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-[12.5px] font-semibold tracking-[-0.01em] text-carbon">
              <span
                aria-hidden
                className="w-1 h-1 rounded-full bg-signal-orange"
              />
              {s.title}
            </p>
            <p className="mt-0.5 text-[11.5px] text-graphite/50">{s.note}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
