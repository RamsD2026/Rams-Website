"use client";

/** Shared dark-surface primitives for the Digital Twin platform page. */

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Fine noise + grid texture laid over a dark section. */
export function Texture({ glow = "top" }: { glow?: "top" | "bottom" | "none" }) {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(80% 60% at 50% 40%, black, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(80% 60% at 50% 40%, black, transparent 80%)",
        }}
      />
      {glow !== "none" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 h-[560px]"
          style={{
            [glow]: 0,
            background:
              glow === "top"
                ? "radial-gradient(60% 60% at 50% 0%, rgba(255,106,0,0.16), transparent 70%)"
                : "radial-gradient(60% 60% at 50% 100%, rgba(255,106,0,0.16), transparent 70%)",
          } as React.CSSProperties}
        />
      )}
    </>
  );
}

/** Small mono label used above headings and inside panels. */
export function Kicker({
  children,
  tone = "orange",
}: {
  children: React.ReactNode;
  tone?: "orange" | "muted";
}) {
  return (
    <span
      className={
        "text-[10.5px] font-mono font-bold tracking-[0.2em] uppercase " +
        (tone === "orange" ? "text-signal-orange" : "text-white/40")
      }
    >
      {children}
    </span>
  );
}

/** Dark glass card. */
export function Glass({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{
        borderRadius: 18,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.015) 100%)",
        border: "1px solid rgba(255,255,255,0.09)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export const DARK_BG = "#08080A";
