"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/**
 * Shared primitives for the RAMS Rack Intelligence (IRDS) page.
 *
 * The product chrome here mirrors the real IRDS application — the module list
 * in `MODULES` is the actual sidebar, read off the shipped screens in
 * /public/Product/irds. Keep it that way: the interactive demos on this page
 * are meant to read as the product, not as an illustration of it.
 */

export const EASE = [0.22, 1, 0.36, 1] as const;

/* ── surfaces ────────────────────────────────────────────── */

export const SURFACE = {
  white: "#FFFFFF",
  offWhite: "#F5F5F7",
  warm: "rgba(247, 242, 232, 0.3)",
  ink: "#08080A",
  darkTop:
    "radial-gradient(80% 100% at 50% 0%, #1D1D1F 0%, #0E0E0F 55%, #08080A 100%)",
  darkMid:
    "radial-gradient(80% 100% at 50% 0%, #1D1D1F 0%, #0E0E0F 60%, #08080A 100%)",
  darkBottom:
    "radial-gradient(80% 100% at 50% 100%, #1D1D1F 0%, #0E0E0F 55%, #08080A 100%)",
} as const;

export type SurfaceKey = keyof typeof SURFACE;
export type Tone = "light" | "dark";

const DARK_SURFACES: SurfaceKey[] = ["ink", "darkTop", "darkMid", "darkBottom"];
export const toneOf = (s: SurfaceKey): Tone =>
  DARK_SURFACES.includes(s) ? "dark" : "light";

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

/* ── RAG ─────────────────────────────────────────────────────
   Risk state only. Never decoration — see docs/section-header.md.
   The `app` values match the real IRDS UI; the `dark` values are the
   site's rag-* tokens, which hold up on a dark section.             */

export type Rag = "green" | "amber" | "red";

export const RAG: Record<
  Rag,
  { label: string; app: string; appBg: string; dark: string; darkBg: string }
> = {
  green: {
    label: "Green",
    app: "#16A34A",
    appBg: "rgba(22,163,74,0.10)",
    dark: "#54DE91",
    darkBg: "rgba(84,222,145,0.12)",
  },
  amber: {
    label: "Amber",
    app: "#E08700",
    appBg: "rgba(224,135,0,0.12)",
    dark: "#FFBE47",
    darkBg: "rgba(255,190,71,0.12)",
  },
  red: {
    label: "Red",
    app: "#DC2626",
    appBg: "rgba(220,38,38,0.10)",
    dark: "#FF6C6C",
    darkBg: "rgba(255,108,108,0.12)",
  },
};

/** The four lifecycle stages a finding is classified against. */
export const LIFECYCLE = [
  { key: "design", label: "Design", note: "Engineering intent, capacity, configuration" },
  { key: "installation", label: "Installation", note: "Erection, anchoring, geometry, plumbness" },
  { key: "operation", label: "Operation", note: "Impact, loading, MHE interaction" },
  { key: "maintenance", label: "Maintenance", note: "Repair, replacement, unresolved action" },
] as const;

export type LifecycleKey = (typeof LIFECYCLE)[number]["key"];

/* ── product screens we actually have ────────────────────── */

export const SHOTS = {
  findingsList: {
    src: "/Product/irds/findings-list.png",
    w: 1916,
    h: 908,
    alt: "IRDS Inspection Findings — every observation with severity, rack, bay, element, activity phase and the action assigned",
  },
  findingsFiltered: {
    src: "/Product/irds/findings-filtered.png",
    w: 1919,
    h: 909,
    alt: "IRDS Inspection Findings, filtered to red severity and flagged observations, grouped by location and sorted by observation date",
  },
  actionAssign: {
    src: "/Product/irds/action-assign.png",
    w: 1916,
    h: 910,
    alt: "IRDS Review Selected Observations with the Set Action panel open — action type, load handling, notes and severity change, assigned across the selection",
  },
  boq: {
    src: "/Product/irds/boq.png",
    w: 1917,
    h: 910,
    alt: "IRDS Bill Of Quantity BOQ-MAR25-1000 — 25 line items grouped by OEM with repair, replace, required quantity, labour and available stock, exportable as PDF or Excel",
  },
  maintenance: {
    src: "/Product/irds/maintenance.png",
    w: 1919,
    h: 907,
    alt: "IRDS Maintenance — repairs across pending assignment, in progress, review and done, each with severity, priority, due date and owner",
  },
  taskDetails: {
    src: "/Product/irds/task-details.png",
    w: 1908,
    h: 909,
    alt: "IRDS Task Details — location, observation summary, measurement and media evidence, with Verify and Close Issue as the primary action",
  },
  regionalDashboard: {
    src: "/Product/irds/regional-safety-dashboard.png",
    w: 1633,
    h: 908,
    alt: "IRDS regional safety dashboard — safety score, warehouse and rack counts, open observations and corrective actions, a site map with a selected warehouse showing compliance, racks and open issues, and a health list sorted highest risk first",
  },
  regionalRanking: {
    src: "/Product/irds/regional-ranking.png",
    w: 1632,
    h: 909,
    alt: "IRDS regional dashboard — warehouse safety ranking highest risk to lowest, the regional action centre, and a twelve-month safety trend",
  },
  regionalAnalytics: {
    src: "/Product/irds/regional-analytics.png",
    w: 1631,
    h: 907,
    alt: "IRDS regional dashboard — observation distribution by type, rack health across 8,400 racks, and structural test pass rates by class",
  },
  regionalActions: {
    src: "/Product/irds/regional-actions.png",
    w: 1631,
    h: 909,
    alt: "IRDS regional dashboard — failed test summary, corrective action closure pipeline, inspection status by warehouse and a live activity feed",
  },
  dashboard: {
    src: "/Product/irds/dashboard.webp",
    w: 1472,
    h: 976,
    alt: "IRDS Dashboard — rack health score, rack stability, open actions and the observation lifecycle",
  },
  rackHealth3d: {
    src: "/Product/irds/rack-health-3d.webp",
    w: 1484,
    h: 840,
    alt: "IRDS Rack Health Analytics — a 3D rack model with issues highlighted by severity",
  },
  portfolio: {
    src: "/Product/irds/portfolio.png",
    w: 1906,
    h: 909,
    alt: "IRDS portfolio dashboard — project counts, warehouse map and a critical observation log",
  },
  reportBuilder: {
    src: "/Product/irds/report-builder.jpg",
    w: 3840,
    h: 1966,
    alt: "IRDS report template builder — module library, report canvas and module settings",
  },
} as const;

export type ShotKey = keyof typeof SHOTS;

/* ── typography helpers ──────────────────────────────────── */

export function Kicker({
  children,
  tone = "dark",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={
        "text-[10.5px] font-mono font-bold tracking-[0.22em] uppercase " +
        (tone === "dark" ? "text-white/40 " : "text-graphite/45 ") +
        (className ?? "")
      }
    >
      {children}
    </span>
  );
}

/** The short memorable line that closes a section. */
export function Statement({
  children,
  tone = "dark",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <p
      className={
        "text-[22px] sm:text-[28px] lg:text-[32px] font-rams-heading font-bold tracking-[-0.025em] leading-[1.2] " +
        (tone === "dark" ? "text-white " : "text-carbon ") +
        (className ?? "")
      }
    >
      {children}
    </p>
  );
}

export function Chip({
  children,
  tone = "dark",
  accent,
}: {
  children: React.ReactNode;
  tone?: Tone;
  accent?: boolean;
}) {
  const t = T[tone];
  return (
    <span
      className={
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11.5px] font-mono font-semibold tracking-[0.14em] uppercase " +
        (accent ? "text-signal-orange" : t.chipText)
      }
      style={{
        background: accent ? "rgba(255,106,0,0.09)" : t.chipBg,
        border: `1px solid ${accent ? "rgba(255,106,0,0.24)" : t.chipBorder}`,
      }}
    >
      {children}
    </span>
  );
}

/* ── product framing ─────────────────────────────────────── */

export function frameStyle(tone: Tone): React.CSSProperties {
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

function Chrome({ path, tone }: { path: string; tone: Tone }) {
  const dark = tone === "dark";
  return (
    <div
      className="flex items-center gap-2 px-4 h-10 border-b shrink-0"
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

/** A real product screenshot in browser chrome. */
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

/** A looping product recording in browser chrome. */
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

/* ── the IRDS application shell ──────────────────────────────
   Reproduces the real chrome so an interactive demo sits inside the
   product rather than beside it. Module names are the live sidebar.  */

export const MODULES = [
  "Dashboard",
  "Project Planner",
  "Inspection",
  "Inspection Cycle Insights",
  "Inspection Findings",
  "TPI Findings",
  "Integrity Test",
  "Rack Health Analytics",
  "Call To Action",
  "Bill Of Quantity",
  "Element Stock Management",
  "Maintenance",
  "Compliance",
  "Rules and Action",
  "Report",
] as const;

export type ModuleName = (typeof MODULES)[number];

function RailIcon({ active }: { active?: boolean }) {
  return (
    <span
      className="w-8 h-8 rounded-lg flex items-center justify-center"
      style={{ background: active ? "#2F6BFF" : "transparent" }}
    >
      <span
        className="w-3.5 h-3.5 rounded-[3px]"
        style={{
          border: `1.5px solid ${active ? "#FFFFFF" : "#C3C6CE"}`,
        }}
      />
    </span>
  );
}

/**
 * The IRDS app frame. Pass the module the demo is showing; the sidebar
 * highlights it, exactly as the product does.
 */
export function AppShell({
  module: mod,
  title,
  toolbar,
  children,
  tone = "light",
  compact,
  className,
}: {
  module: ModuleName;
  title: string;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  tone?: Tone;
  /** Hides the module sidebar — for narrow columns. */
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={"relative overflow-hidden " + (className ?? "")}
      style={frameStyle(tone)}
    >
      <Chrome path={`app.rams.digital/rack/irds/${slug(mod)}`} tone={tone} />

      <div className="flex" style={{ background: "#FFFFFF" }}>
        {/* icon rail */}
        {!compact && (
          <div
            className="hidden sm:flex flex-col items-center gap-3 py-4 px-3 shrink-0"
            style={{ borderRight: "1px solid #ECEDF1", background: "#FFFFFF" }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <RailIcon key={i} active={i === 2} />
            ))}
          </div>
        )}

        {/* module sidebar */}
        {!compact && (
          <div
            className="hidden lg:block w-[188px] shrink-0 py-4"
            style={{ borderRight: "1px solid #ECEDF1", background: "#FFFFFF" }}
          >
            <p className="px-4 pb-3 text-[9.5px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/40">
              Rack
            </p>
            <p className="px-4 pb-2 text-[12px] font-semibold text-carbon">
              IRDS
            </p>
            <div className="flex flex-col px-2">
              {MODULES.map((m) => {
                const active = m === mod;
                return (
                  <span
                    key={m}
                    className={
                      "px-2.5 py-[7px] rounded-md text-[11.5px] leading-tight " +
                      (active
                        ? "font-semibold text-carbon"
                        : "text-graphite/60")
                    }
                    style={{ background: active ? "#EFF2F7" : "transparent" }}
                  >
                    {m}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* work area */}
        <div className="flex-1 min-w-0">
          <div
            className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 flex-wrap"
            style={{ borderBottom: "1px solid #ECEDF1" }}
          >
            <span className="text-[14px] sm:text-[15px] font-semibold text-carbon tracking-[-0.01em]">
              {title}
            </span>
            {toolbar}
          </div>
          <div className="p-4 sm:p-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

/* ── small product-UI atoms ──────────────────────────────── */

/** A select-looking control. Static — it frames the demo, it isn't the demo. */
export function AppSelect({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 h-8 px-3 rounded-lg text-[11.5px] font-medium text-graphite/70"
      style={{ border: "1px solid #E4E6EC", background: "#FFFFFF" }}
    >
      {children}
      <svg viewBox="0 0 12 12" className="w-3 h-3 opacity-40" aria-hidden>
        <path
          d="M2.5 4.5 6 8l3.5-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function RagDot({ rag, size = 8 }: { rag: Rag; size?: number }) {
  return (
    <span
      className="rounded-full shrink-0 inline-block"
      style={{ width: size, height: size, background: RAG[rag].app }}
    />
  );
}

export function RagPill({ rag }: { rag: Rag }) {
  const c = RAG[rag];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-[3px] rounded-full text-[10px] font-mono font-bold tracking-[0.1em] uppercase"
      style={{ background: c.appBg, color: c.app }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: c.app }}
      />
      {c.label}
    </span>
  );
}

/* ── editorial layout primitives ─────────────────────────────
   The composition follows the RAMS IRDS reference layout: a chapter
   tag over a left-aligned heading, two-column splits, pill chains and
   captioned media. The tokens are ours — IBM Plex Sans headings,
   signal-orange, the site surfaces. See docs/typography.md.        */

/** Chapter number + ruled eyebrow + heading + lede. Left-aligned. */
export function ChapterHead({
  num,
  eyebrow,
  top,
  bottom,
  lede,
  tone = "light",
  center = false,
  className,
}: {
  num?: string;
  eyebrow: string;
  top: string;
  bottom?: string;
  lede?: string;
  tone?: Tone;
  center?: boolean;
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div
      className={
        (center ? "max-w-[900px] mx-auto text-center " : "max-w-[900px] ") +
        (className ?? "")
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className={
          "flex items-center gap-4 mb-6 " + (center ? "justify-center" : "")
        }
      >
        {num && (
          <span
            className={
              "text-[11.5px] font-mono font-semibold tracking-[0.16em] uppercase " +
              (dark ? "text-white/35" : "text-graphite/40")
            }
          >
            {num}
          </span>
        )}
        <span className="text-[11.5px] font-mono font-semibold tracking-[0.18em] uppercase text-signal-orange">
          {eyebrow}
        </span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.85, ease: EASE }}
        className={
          "text-[34px] sm:text-[46px] lg:text-[60px] font-bold tracking-[-0.032em] leading-[1.04] " +
          (dark ? "text-white" : "text-carbon")
        }
      >
        {top}
        {bottom && (
          <>
            <br />
            <span className={dark ? "text-white/45" : "text-graphite/45"}>
              {bottom}
            </span>
          </>
        )}
      </motion.h2>

      {lede && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
          className={
            "mt-6 text-[16px] sm:text-[18px] leading-[1.55] max-w-[62ch] " +
            (dark ? "text-white/55" : "text-graphite/65") +
            (center ? " mx-auto" : "")
          }
        >
          {lede}
        </motion.p>
      )}
    </div>
  );
}

/** Two-column editorial split. `rev` puts the copy second. */
export function Split({
  children,
  rev,
  className,
}: {
  children: React.ReactNode;
  rev?: boolean;
  className?: string;
}) {
  return (
    <div
      className={
        "grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center " +
        (rev ? "lg:[&>*:first-child]:order-2 " : "") +
        (className ?? "")
      }
    >
      {children}
    </div>
  );
}

/** A framed visual with the reference's caption bar. */
export function Media({
  children,
  left,
  right,
  tone = "dark",
  className,
}: {
  children: React.ReactNode;
  left?: string;
  right?: string;
  tone?: Tone;
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div
      className={"overflow-hidden " + (className ?? "")}
      style={{
        borderRadius: 20,
        background: dark ? "#0E0E11" : "#F5F5F7",
        border: `1px solid ${dark ? "rgba(255,255,255,0.10)" : "#E4E4E9"}`,
        boxShadow: dark
          ? "0 50px 100px -50px rgba(0,0,0,0.85)"
          : "0 30px 70px -40px rgba(14,14,15,0.18)",
      }}
    >
      {children}
      {(left || right) && (
        <div
          className="flex items-center justify-between gap-4 px-5 py-3.5"
          style={{
            borderTop: `1px solid ${dark ? "rgba(255,255,255,0.09)" : "#E4E4E9"}`,
          }}
        >
          <span
            className={
              "text-[10px] font-mono tracking-[0.1em] uppercase " +
              (dark ? "text-white/45" : "text-graphite/45")
            }
          >
            {left}
          </span>
          <span
            className={
              "text-[10px] font-mono tracking-[0.1em] uppercase " +
              (dark ? "text-white/30" : "text-graphite/35")
            }
          >
            {right}
          </span>
        </div>
      )}
    </div>
  );
}

/** Pill step chain: first step orange, arrows between. */
export function Flow({
  steps,
  tone = "light",
  size = "md",
  center,
  className,
}: {
  steps: string[];
  tone?: Tone;
  size?: "sm" | "md";
  center?: boolean;
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div
      className={
        "flex items-center flex-wrap gap-2 " +
        (center ? "justify-center " : "") +
        (className ?? "")
      }
    >
      {steps.map((s, i) => (
        <span key={s} className="flex items-center gap-2">
          {i > 0 && (
            <span
              className={
                "text-[13px] " + (dark ? "text-white/30" : "text-graphite/30")
              }
              aria-hidden
            >
              →
            </span>
          )}
          <span
            className={
              "font-mono font-semibold rounded-full whitespace-nowrap " +
              (size === "sm"
                ? "text-[11px] px-3.5 py-2 "
                : "text-[12px] px-4 py-2.5 ") +
              (i === 0
                ? "text-white"
                : dark
                  ? "text-white/80"
                  : "text-white")
            }
            style={{
              background: i === 0 ? "#FF6A00" : dark ? "rgba(255,255,255,0.08)" : "#0E0E0F",
            }}
          >
            {s}
          </span>
        </span>
      ))}
    </div>
  );
}

/** The short statement that closes a block. */
export function BigLine({
  children,
  tone = "light",
  center,
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  center?: boolean;
  className?: string;
}) {
  return (
    <p
      className={
        "font-rams-heading text-[22px] sm:text-[28px] lg:text-[32px] font-bold tracking-[-0.025em] leading-[1.2] max-w-[24ch] " +
        (tone === "dark" ? "text-white " : "text-carbon ") +
        (center ? "mx-auto text-center " : "") +
        (className ?? "")
      }
    >
      {children}
    </p>
  );
}

/** Mono caveat line. */
export function NoteLine({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <p
      className={
        "text-[12px] font-mono leading-[1.65] max-w-[64ch] " +
        (tone === "dark" ? "text-white/35 " : "text-graphite/45 ") +
        (className ?? "")
      }
    >
      {children}
    </p>
  );
}

/** Rounded pill chip. */
export function Pill({
  children,
  tone = "light",
  dashed,
}: {
  children: React.ReactNode;
  tone?: Tone;
  dashed?: boolean;
}) {
  const dark = tone === "dark";
  return (
    <span
      className={
        "inline-flex items-center px-3.5 py-2 rounded-full text-[12.5px] font-medium " +
        (dark ? "text-white/70" : "text-graphite/70")
      }
      style={{
        background: dark ? "rgba(255,255,255,0.04)" : "#F5F5F7",
        border: `1px ${dashed ? "dashed" : "solid"} ${
          dark ? "rgba(255,255,255,0.10)" : "#E4E4E9"
        }`,
      }}
    >
      {children}
    </span>
  );
}

/** Section wrapper — same rhythm as every other page. */
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
