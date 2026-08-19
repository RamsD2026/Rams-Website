"use client";

import { motion } from "framer-motion";

/**
 * The canonical section header: eyebrow → two-line heading → subline.
 *
 * Every section on a solution or platform page opens with this. The values are
 * taken from the Rack Safety, Inventory Intelligence and Warehouse Execution
 * pages — see docs/section-header.md before changing anything here, because a
 * change lands on every page at once.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

export type SectionHeaderProps = {
  /** Mono caps label. Two or three words. Never a sentence. */
  eyebrow: string;
  /** First heading line — carries the weight. */
  top: string;
  /** Second heading line — dimmed on light, gradient on dark. Optional. */
  bottom?: string;
  /** Supporting sentence. Two lines at most. Optional. */
  body?: string;
  /** Section background this header sits on. */
  tone?: "light" | "dark";
  /**
   * `default` for standard sections.
   * `compact` for sections whose visual is a wide dashboard, so the heading
   * does not overpower it.
   */
  size?: "default" | "compact";
  /** `wide` pairs with full-bleed visuals below the header. */
  width?: "default" | "wide";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  top,
  bottom,
  body,
  tone = "light",
  size = "default",
  width = "default",
  className,
}: SectionHeaderProps) {
  const dark = tone === "dark";

  const wrapper =
    width === "wide"
      ? "max-w-[1180px] mx-auto text-center mb-16 sm:mb-20"
      : "max-w-[900px] mx-auto text-center mb-20 sm:mb-24";

  const headingSize =
    size === "compact"
      ? "text-[36px] sm:text-[54px] lg:text-[68px] leading-[1.05]"
      : "text-[40px] sm:text-[60px] lg:text-[78px] leading-[1.0]";

  return (
    <div className={wrapper + (className ? " " + className : "")}>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange mb-5"
      >
        {eyebrow}
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.85, ease: EASE }}
        className={
          headingSize +
          " font-bold tracking-[-0.04em] " +
          (dark ? "text-white" : "text-carbon")
        }
      >
        {top}
        {bottom && (
          <>
            <br />
            {dark ? (
              <span
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.35) 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {bottom}
              </span>
            ) : (
              <span className="text-graphite/50">{bottom}</span>
            )}
          </>
        )}
      </motion.h2>

      {body && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
          className={
            "mt-6 text-[14px] sm:text-[15px] leading-[1.55] max-w-[880px] mx-auto " +
            (dark ? "text-white/60" : "text-graphite/65")
          }
        >
          {body}
        </motion.p>
      )}
    </div>
  );
}

/**
 * The page hero header: pill eyebrow → two-line h1 → subline.
 *
 * Distinct from SectionHeader — it is larger and animates on load rather than
 * on scroll, because it sits above the fold. See docs/section-header.md.
 */
export function PageHeader({
  eyebrow,
  top,
  bottom,
  body,
  children,
  className,
}: {
  /** Pill label. Mono caps, two or three words. */
  eyebrow: string;
  top: string;
  /** Second line, rendered in the white→transparent gradient. */
  bottom: string;
  /** Supporting sentence. Optional when the hero uses proof bullets instead. */
  body?: string;
  /** Chips, bullets or anything else that sits between the subline and CTAs. */
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={"max-w-[1080px] mx-auto text-center" + (className ? " " + className : "")}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
        <span className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-white/70">
          {eyebrow}
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
        className="mt-8 text-[56px] sm:text-[84px] lg:text-[112px] font-bold leading-[0.98] tracking-[-0.045em]"
      >
        <span className="block text-white">{top}</span>
        <span
          className="block"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.35) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {bottom}
        </span>
      </motion.h1>

      {body && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
          className="mt-6 text-[14px] sm:text-[16px] text-white/60 leading-[1.55] max-w-[1120px] mx-auto"
        >
          {body}
        </motion.p>
      )}

      {children}
    </div>
  );
}
