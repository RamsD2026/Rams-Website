"use client";

import Image from "next/image";

/** Shared primitives for the IRDS platform page. */

export const EASE = [0.22, 1, 0.36, 1] as const;

export const ORANGE = "#FF6A00";
export const ORANGE_SOFT = "#FF9B4D";

/**
 * Section surfaces — the same set the Rack Safety, Inventory and Warehouse
 * Execution pages use. The site alternates LIGHT and DARK sections; it does not
 * step through shades of dark. See docs/section-header.md.
 */
export const SURFACE = {
  /** Default light section. */
  white: "#FFFFFF",
  /** Light section that needs separation from a white neighbour. */
  offWhite: "#F5F5F7",
  /** Warm band — used sparingly, for a summary or closing section. */
  warm: "rgba(247, 242, 232, 0.3)",
  /** Flat near-black band, typically directly under the hero. */
  ink: "#08080A",
  /** Dark radial, lifting from the top edge. */
  darkTop:
    "radial-gradient(80% 100% at 50% 0%, #1D1D1F 0%, #0E0E0F 55%, #08080A 100%)",
  /** Dark radial for mid-page sections. */
  darkMid:
    "radial-gradient(80% 100% at 50% 0%, #1D1D1F 0%, #0E0E0F 60%, #08080A 100%)",
  /** Dark radial, lifting from the bottom edge — closings. */
  darkBottom:
    "radial-gradient(80% 100% at 50% 100%, #1D1D1F 0%, #0E0E0F 55%, #08080A 100%)",
} as const;

export type SurfaceKey = keyof typeof SURFACE;
export type Tone = "light" | "dark";

const DARK_SURFACES: SurfaceKey[] = ["ink", "darkTop", "darkMid", "darkBottom"];
export const toneOf = (s: SurfaceKey): Tone =>
  DARK_SURFACES.includes(s) ? "dark" : "light";

/** Per-tone tokens, so a section styles itself from one place. */
export const T: Record<
  Tone,
  {
    title: string;
    body: string;
    muted: string;
    chipBg: string;
    chipBorder: string;
    chipText: string;
    hair: string;
    cardBg: string;
    cardBorder: string;
  }
> = {
  dark: {
    title: "text-white",
    body: "text-white/55",
    muted: "text-white/35",
    chipBg: "rgba(255,255,255,0.035)",
    chipBorder: "rgba(255,255,255,0.09)",
    chipText: "text-white/70",
    hair: "rgba(255,255,255,0.10)",
    cardBg: "rgba(255,255,255,0.025)",
    cardBorder: "rgba(255,255,255,0.08)",
  },
  light: {
    title: "text-carbon",
    body: "text-graphite/65",
    muted: "text-graphite/45",
    chipBg: "#F5F5F7",
    chipBorder: "#E8E8ED",
    chipText: "text-graphite/70",
    hair: "#E8E8ED",
    cardBg: "#FFFFFF",
    cardBorder: "#E8E8ED",
  },
};

/** Real IRDS screens available today. */
export const SHOTS = {
  dashboard: {
    src: "/Product/irds/dashboard.webp",
    w: 1472,
    h: 976,
    alt: "IRDS Dashboard showing rack health score, rack stability, open actions and the observation lifecycle",
  },
  rackHealth3d: {
    src: "/Product/irds/rack-health-3d.webp",
    w: 1484,
    h: 840,
    alt: "IRDS Rack Health Analytics with a 3D rack model and issues highlighted by severity",
  },
  portfolio: {
    src: "/Product/irds/portfolio.png",
    w: 1906,
    h: 909,
    alt: "IRDS portfolio dashboard with project counts, warehouse map and a critical observation log",
  },
  reportBuilder: {
    src: "/Product/irds/report-builder.jpg",
    w: 3840,
    h: 1966,
    alt: "IRDS report template builder with a module library, report canvas and module settings",
  },
} as const;

export type ShotKey = keyof typeof SHOTS;

/** Small mono label. */
export function Kicker({
  children,
  tone = "dark",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={
        "text-[10.5px] font-mono font-bold tracking-[0.22em] uppercase " +
        (tone === "dark" ? "text-white/40" : "text-graphite/45")
      }
    >
      {children}
    </span>
  );
}

/* ── Product framing ─────────────────────────────────────── */

function Chrome({ path, tone }: { path: string; tone: Tone }) {
  const dark = tone === "dark";
  return (
    <div
      className="flex items-center gap-2 px-4 h-10 border-b"
      style={{
        borderColor: dark ? "rgba(255,255,255,0.07)" : "#EDEDF1",
        background: dark ? "#111114" : "#FAFAFB",
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
  );
}

function frameStyle(tone: Tone): React.CSSProperties {
  return tone === "dark"
    ? {
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "#0E0E11",
        boxShadow: "0 60px 120px -50px rgba(0,0,0,0.9)",
      }
    : {
        borderRadius: 16,
        border: "1px solid #E4E4E9",
        background: "#FFFFFF",
        boxShadow:
          "0 40px 90px -40px rgba(14,14,15,0.22), 0 8px 24px -12px rgba(14,14,15,0.08)",
      };
}

export function ProductFrame({
  shot,
  path,
  tone = "dark",
  priority,
  className,
}: {
  shot: ShotKey;
  path: string;
  tone?: Tone;
  priority?: boolean;
  className?: string;
}) {
  const s = SHOTS[shot];
  return (
    <div
      className={"relative overflow-hidden " + (className ?? "")}
      style={frameStyle(tone)}
    >
      <Chrome path={path} tone={tone} />
      <Image
        src={s.src}
        alt={s.alt}
        width={s.w}
        height={s.h}
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 1200px"
        className="w-full h-auto block"
      />
    </div>
  );
}

export function ProductVideo({
  src,
  path,
  poster,
  tone = "dark",
  className,
}: {
  src: string;
  path: string;
  poster?: string;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={"relative overflow-hidden " + (className ?? "")}
      style={frameStyle(tone)}
    >
      <Chrome path={path} tone={tone} />
      <video
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-auto block"
      />
    </div>
  );
}

/** What happens / What you see / What you get. */
export function Outcome({
  happens,
  see,
  get,
  tone = "dark",
}: {
  happens: string;
  see: string;
  get: string;
  tone?: Tone;
}) {
  const t = T[tone];
  const rows = [
    { k: "What happens", v: happens },
    { k: "What you see", v: see },
    { k: "What you get", v: get, hot: true },
  ];
  return (
    <div className="mt-8 flex flex-col">
      {rows.map((r, i) => (
        <div
          key={r.k}
          className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-5 px-5 py-4"
          style={{
            borderTop: i === 0 ? `1px solid ${t.hair}` : undefined,
            borderBottom: `1px solid ${t.hair}`,
          }}
        >
          <span
            className={
              "text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase shrink-0 w-[104px] " +
              (r.hot ? "text-signal-orange" : t.muted)
            }
          >
            {r.k}
          </span>
          <span
            className={
              "text-[13.5px] leading-[1.6] " + (r.hot ? t.title : t.body)
            }
          >
            {r.v}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Section({
  children,
  id,
  surface = "white",
  className,
}: {
  children: React.ReactNode;
  id?: string;
  surface?: SurfaceKey;
  className?: string;
}) {
  const dark = toneOf(surface) === "dark";
  return (
    <section
      id={id}
      className={
        "relative overflow-hidden " +
        (dark ? "text-white " : "") +
        (className ?? "")
      }
      style={{ background: SURFACE[surface] }}
    >
      <div className="relative rams-container pt-28 sm:pt-36 lg:pt-44 pb-28 sm:pb-36 lg:pb-44">
        {children}
      </div>
    </section>
  );
}
