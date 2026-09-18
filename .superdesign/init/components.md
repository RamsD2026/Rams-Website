# Shared UI components

**Stack:** Next.js 16.2.12 (App Router) · React 19.2.4 · TypeScript strict ·
Tailwind CSS v4 (CSS-first `@theme inline`, no `tailwind.config`) ·
framer-motion 12 for all animation · lucide-react + @heroicons/react for icons ·
shadcn (style `base-nova`, baseColor neutral) scaffolded but barely used ·
three / @react-three/fiber / drei / ogl for the decorative 3D widgets.

## Read this first

The component library that actually governs this site's look is **not**
`src/components/ui/`. It is two files:

1. `src/components/sections/SectionHeader.tsx` — `<SectionHeader>` and
   `<PageHeader>`. Every section on every page opens with one of these.
2. `src/components/sections/rackiq/rackiq-shared.tsx` — surfaces, tone→colour
   tables, the `<Section>` wrapper, product chrome, chips, RAG pills. **209
   components across every page folder import from it.** Its doc comment claims
   it belongs to one page; that is out of date.

Anything new must be built out of these two. `src/components/ui/` is mostly
vendored decorative widgets (3D globes, shaders, particle fields).

---

## 1. Design-system primitives — use these

### `src/components/sections/SectionHeader.tsx`
The canonical section header (eyebrow → two-line heading → subline, centred) and the page hero header. Props: `eyebrow`, `top`, `bottom`, `body`, `tone` light|dark, `size` default|compact|long, `width`, `bodyWidth`, `align`. NEVER re-type these classes inline — see `docs/section-header.md`.

```tsx
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
   * `long` for a heading whose lines are long enough that `compact` would
   * wrap them — it keeps a two-line heading two lines.
   */
  size?: "default" | "compact" | "long";
  /** `wide` pairs with full-bleed visuals below the header. */
  width?: "default" | "wide";
  /**
   * Measure of the supporting sentence. `default` is 880px — two comfortable
   * lines. `wide` is 1140px, for the occasional subline that has to sit on
   * one. Opt-in, so existing headers are unaffected.
   */
  bodyWidth?: "default" | "wide";
  /**
   * `left` sets the header flush left, for the rare header that shares its
   * row with a visual rather than sitting above one. Opt-in, so existing
   * headers stay centred.
   */
  align?: "center" | "left";
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
  bodyWidth = "default",
  align = "center",
  className,
}: SectionHeaderProps) {
  const dark = tone === "dark";

  const centre = align === "left" ? "" : "mx-auto text-center ";
  const wrapper =
    width === "wide"
      ? `max-w-[1180px] ${centre}mb-16 sm:mb-20`
      : `max-w-[900px] ${centre}mb-20 sm:mb-24`;

  const headingSize =
    size === "long"
      ? "text-[30px] sm:text-[44px] lg:text-[56px] leading-[1.1]"
      : size === "compact"
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
            "mt-6 text-[14px] sm:text-[15px] leading-[1.55] " +
            (align === "left" ? "" : "mx-auto ") +
            (bodyWidth === "wide" ? "max-w-[1140px] " : "max-w-[880px] ") +
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
    <div
      className={
        "max-w-[1080px] mx-auto text-center" +
        (className ? " " + className : "")
      }
    >
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
```

### `src/components/sections/rackiq/rackiq-shared.tsx`
The de-facto design system. `EASE`, `SURFACE` (named backgrounds) + `toneOf()`, `T` (tone → text colour), `RAG`/`RagDot`/`RagPill`, `<Section>` (surface + container + vertical rhythm), `ProductFrame`/`ProductVideo`/`AppShell` (product chrome), `Kicker`, `Chip`, `Pill`, `Split`, `Media`, `Flow`, `ChapterHead`, `frameStyle`.

```tsx
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
  /* Was a warm beige. Now the same neutral as offWhite, carried at less
     than full strength so the two light surfaces still read apart. */
  warm: "rgba(245, 245, 247, 0.6)",
  ink: "#08080A",
  /* Flat, no gradient, with the slight teal cast of `--color-carbon-teal`.
     For a section that should sit as one uniform plane behind light product
     panels — a radial there fights the panels for depth. Additive: nothing
     that shipped before uses it. */
  inkTeal: "#0B1619",
  darkTop:
    "radial-gradient(80% 100% at 50% 0%, #1D1D1F 0%, #0E0E0F 55%, #08080A 100%)",
  darkMid:
    "radial-gradient(80% 100% at 50% 0%, #1D1D1F 0%, #0E0E0F 60%, #08080A 100%)",
  darkBottom:
    "radial-gradient(80% 100% at 50% 100%, #1D1D1F 0%, #0E0E0F 55%, #08080A 100%)",
} as const;

export type SurfaceKey = keyof typeof SURFACE;
export type Tone = "light" | "dark";

const DARK_SURFACES: SurfaceKey[] = [
  "ink",
  "inkTeal",
  "darkTop",
  "darkMid",
  "darkBottom",
];
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
  {
    key: "design",
    label: "Design",
    note: "Engineering intent, capacity, configuration",
  },
  {
    key: "installation",
    label: "Installation",
    note: "Erection, anchoring, geometry, plumbness",
  },
  {
    key: "operation",
    label: "Operation",
    note: "Impact, loading, MHE interaction",
  },
  {
    key: "maintenance",
    label: "Maintenance",
    note: "Repair, replacement, unresolved action",
  },
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
  /** Off where the frame sits flat on the surface rather than above it. */
  shadow = true,
  className,
}: {
  src: string;
  path: string;
  poster?: string;
  tone?: Tone;
  shadow?: boolean;
  className?: string;
}) {
  return (
    <div
      className={"relative overflow-hidden " + (className ?? "")}
      style={{
        ...frameStyle(tone),
        ...(shadow ? null : { boxShadow: "none" }),
      }}
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
              (i === 0 ? "text-white" : dark ? "text-white/80" : "text-white")
            }
            style={{
              background:
                i === 0
                  ? "#FF6A00"
                  : dark
                    ? "rgba(255,255,255,0.08)"
                    : "#0E0E0F",
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

/**
 * Section wrapper — same rhythm as every other page.
 *
 * `padding="tight"` is the source documents' own `.sec-tight`: for sections
 * carrying one short block, where the standard rhythm leaves more air than
 * content.
 *
 * `padding="strip"` is tighter still — for a band that belongs to the section
 * above it rather than standing on its own. The standard rhythm assumes the
 * surface changes at every boundary; where two sections share a surface, the
 * two paddings meet with nothing between them and read as one void.
 *
 * `paddingTop` / `paddingBottom` override one edge only — for a section that
 * shares its surface with the section on one side and changes surface on the
 * other, so only the shared boundary needs shortening.
 *
 * `clip={false}` drops the overflow clip. Sections clip by default so a glow
 * or a full-bleed visual cannot widen the page — but an ancestor with
 * `overflow: hidden` also disables `position: sticky` inside it, so a section
 * with a pinned column has to opt out.
 *
 * All are opt-in, so every existing section is unaffected.
 */

const PAD_T = {
  strip: "pt-10 sm:pt-12 lg:pt-14",
  tight: "pt-20 sm:pt-24 lg:pt-28",
  default: "pt-28 sm:pt-36 lg:pt-44",
};

const PAD_B = {
  strip: "pb-10 sm:pb-12 lg:pb-14",
  tight: "pb-20 sm:pb-24 lg:pb-28",
  default: "pb-28 sm:pb-36 lg:pb-44",
};

type Padding = keyof typeof PAD_T;
export function Section({
  children,
  id,
  surface = "white",
  padding = "default",
  paddingTop,
  paddingBottom,
  clip = true,
  className,
}: {
  children: React.ReactNode;
  id?: string;
  surface?: SurfaceKey;
  padding?: Padding;
  paddingTop?: Padding;
  paddingBottom?: Padding;
  clip?: boolean;
  className?: string;
}) {
  const dark = toneOf(surface) === "dark";
  return (
    <section
      id={id}
      className={
        "relative " +
        (clip ? "overflow-hidden " : "") +
        (dark ? "text-white " : "") +
        (className ?? "")
      }
      style={{ background: SURFACE[surface] }}
    >
      <div
        className={
          "relative rams-container " +
          PAD_T[paddingTop ?? padding] +
          " " +
          PAD_B[paddingBottom ?? padding]
        }
      >
        {children}
      </div>
    </section>
  );
}
```

### `src/lib/utils.ts`
`cn()` — clsx + tailwind-merge. The only helper.

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### `src/components/ui/button.tsx`
shadcn button with cva variants. Present, but most CTAs on this site are hand-rolled anchors (`text-[14px] font-semibold px-6 py-3 rounded-lg`, page CTAs `rounded-full py-3.5`) rather than this component.

```tsx
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
```

### `src/components/ui/RAMSLogo.tsx`
The wordmark. Switches between the black and white SVG in `public/`.

```tsx
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface RAMSLogoProps {
  className?: string;
  asLink?: boolean;
  variant?: "dark" | "white";
}

export function RAMSLogo({ className, asLink = false, variant = "dark" }: RAMSLogoProps) {
  const logo = (
    <div className={cn("relative", className)}>
      <Image
        src={variant === "white" ? "/RAMS_Logo_White.svg" : "/RAMS_Logo_Black.svg"}
        alt="RAMS"
        width={120}
        height={48}
        priority
        className="h-full w-auto object-contain"
      />
    </div>
  );

  if (asLink) {
    return (
      <Link
        href="/"
        aria-label="RAMS — Return to homepage"
        className="inline-flex items-center outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] focus-visible:ring-offset-2 rounded"
      >
        {logo}
      </Link>
    );
  }

  return logo;
}
```


## 2. Effect layers used on real pages

### `src/components/ui/background-beams.tsx`
Animated SVG beams. Laid over the orange radial on dark heroes at `opacity-[0.5]`.

```tsx
"use client";
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BackgroundBeams = React.memo(
  ({ className }: { className?: string }) => {
    const reduceMotion = useReducedMotion();

    const paths = [
      "M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875",
      "M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867",
      "M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859",
      "M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851",
      "M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843",
      "M-345 -229C-345 -229 -277 176 187 303C651 430 719 835 719 835",
      "M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827",
      "M-331 -245C-331 -245 -263 160 201 287C665 414 733 819 733 819",
      "M-324 -253C-324 -253 -256 152 208 279C672 406 740 811 740 811",
      "M-317 -261C-317 -261 -249 144 215 271C679 398 747 803 747 803",
      "M-310 -269C-310 -269 -242 136 222 263C686 390 754 795 754 795",
      "M-303 -277C-303 -277 -235 128 229 255C693 382 761 787 761 787",
      "M-296 -285C-296 -285 -228 120 236 247C700 374 768 779 768 779",
      "M-289 -293C-289 -293 -221 112 243 239C707 366 775 771 775 771",
      "M-282 -301C-282 -301 -214 104 250 231C714 358 782 763 782 763",
      "M-275 -309C-275 -309 -207 96 257 223C721 350 789 755 789 755",
      "M-268 -317C-268 -317 -200 88 264 215C728 342 796 747 796 747",
      "M-261 -325C-261 -325 -193 80 271 207C735 334 803 739 803 739",
      "M-254 -333C-254 -333 -186 72 278 199C742 326 810 731 810 731",
      "M-247 -341C-247 -341 -179 64 285 191C749 318 817 723 817 723",
      "M-240 -349C-240 -349 -172 56 292 183C756 310 824 715 824 715",
      "M-233 -357C-233 -357 -165 48 299 175C763 302 831 707 831 707",
      "M-226 -365C-226 -365 -158 40 306 167C770 294 838 699 838 699",
      "M-219 -373C-219 -373 -151 32 313 159C777 286 845 691 845 691",
      "M-212 -381C-212 -381 -144 24 320 151C784 278 852 683 852 683",
      "M-205 -389C-205 -389 -137 16 327 143C791 270 859 675 859 675",
      "M-198 -397C-198 -397 -130 8 334 135C798 262 866 667 866 667",
      "M-191 -405C-191 -405 -123 0 341 127C805 254 873 659 873 659",
      "M-184 -413C-184 -413 -116 -8 348 119C812 246 880 651 880 651",
      "M-177 -421C-177 -421 -109 -16 355 111C819 238 887 643 887 643",
      "M-170 -429C-170 -429 -102 -24 362 103C826 230 894 635 894 635",
      "M-163 -437C-163 -437 -95 -32 369 95C833 222 901 627 901 627",
      "M-156 -445C-156 -445 -88 -40 376 87C840 214 908 619 908 619",
      "M-149 -453C-149 -453 -81 -48 383 79C847 206 915 611 915 611",
      "M-142 -461C-142 -461 -74 -56 390 71C854 198 922 603 922 603",
      "M-135 -469C-135 -469 -67 -64 397 63C861 190 929 595 929 595",
      "M-128 -477C-128 -477 -60 -72 404 55C868 182 936 587 936 587",
      "M-121 -485C-121 -485 -53 -80 411 47C875 174 943 579 943 579",
      "M-114 -493C-114 -493 -46 -88 418 39C882 166 950 571 950 571",
      "M-107 -501C-107 -501 -39 -96 425 31C889 158 957 563 957 563",
      "M-100 -509C-100 -509 -32 -104 432 23C896 150 964 555 964 555",
      "M-93 -517C-93 -517 -25 -112 439 15C903 142 971 547 971 547",
      "M-86 -525C-86 -525 -18 -120 446 7C910 134 978 539 978 539",
      "M-79 -533C-79 -533 -11 -128 453 -1C917 126 985 531 985 531",
      "M-72 -541C-72 -541 -4 -136 460 -9C924 118 992 523 992 523",
      "M-65 -549C-65 -549 3 -144 467 -17C931 110 999 515 999 515",
      "M-58 -557C-58 -557 10 -152 474 -25C938 102 1006 507 1006 507",
      "M-51 -565C-51 -565 17 -160 481 -33C945 94 1013 499 1013 499",
      "M-44 -573C-44 -573 24 -168 488 -41C952 86 1020 491 1020 491",
      "M-37 -581C-37 -581 31 -176 495 -49C959 78 1027 483 1027 483",
    ];
    // Stable per-beam timings — Math.random() in render would reshuffle the
    // whole field on every re-render.
    const timings = React.useMemo(
      () =>
        paths.map(() => ({
          y2: `${93 + Math.random() * 8}%`,
          duration: Math.random() * 10 + 10,
          delay: Math.random() * 10,
        })),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );

    return (
      <div
        className={cn(
          "absolute inset-0 flex h-full w-full items-center justify-center [mask-repeat:no-repeat] [mask-size:40px]",
          className,
        )}
      >
        <svg
          className="pointer-events-none absolute z-0 h-full w-full"
          width="100%"
          height="100%"
          viewBox="0 0 696 316"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843M-345 -229C-345 -229 -277 176 187 303C651 430 719 835 719 835M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827M-331 -245C-331 -245 -263 160 201 287C665 414 733 819 733 819M-324 -253C-324 -253 -256 152 208 279C672 406 740 811 740 811M-317 -261C-317 -261 -249 144 215 271C679 398 747 803 747 803M-310 -269C-310 -269 -242 136 222 263C686 390 754 795 754 795M-303 -277C-303 -277 -235 128 229 255C693 382 761 787 761 787M-296 -285C-296 -285 -228 120 236 247C700 374 768 779 768 779M-289 -293C-289 -293 -221 112 243 239C707 366 775 771 775 771M-282 -301C-282 -301 -214 104 250 231C714 358 782 763 782 763M-275 -309C-275 -309 -207 96 257 223C721 350 789 755 789 755M-268 -317C-268 -317 -200 88 264 215C728 342 796 747 796 747M-261 -325C-261 -325 -193 80 271 207C735 334 803 739 803 739M-254 -333C-254 -333 -186 72 278 199C742 326 810 731 810 731M-247 -341C-247 -341 -179 64 285 191C749 318 817 723 817 723M-240 -349C-240 -349 -172 56 292 183C756 310 824 715 824 715M-233 -357C-233 -357 -165 48 299 175C763 302 831 707 831 707M-226 -365C-226 -365 -158 40 306 167C770 294 838 699 838 699M-219 -373C-219 -373 -151 32 313 159C777 286 845 691 845 691M-212 -381C-212 -381 -144 24 320 151C784 278 852 683 852 683M-205 -389C-205 -389 -137 16 327 143C791 270 859 675 859 675M-198 -397C-198 -397 -130 8 334 135C798 262 866 667 866 667M-191 -405C-191 -405 -123 0 341 127C805 254 873 659 873 659M-184 -413C-184 -413 -116 -8 348 119C812 246 880 651 880 651M-177 -421C-177 -421 -109 -16 355 111C819 238 887 643 887 643M-170 -429C-170 -429 -102 -24 362 103C826 230 894 635 894 635M-163 -437C-163 -437 -95 -32 369 95C833 222 901 627 901 627M-156 -445C-156 -445 -88 -40 376 87C840 214 908 619 908 619M-149 -453C-149 -453 -81 -48 383 79C847 206 915 611 915 611M-142 -461C-142 -461 -74 -56 390 71C854 198 922 603 922 603M-135 -469C-135 -469 -67 -64 397 63C861 190 929 595 929 595M-128 -477C-128 -477 -60 -72 404 55C868 182 936 587 936 587M-121 -485C-121 -485 -53 -80 411 47C875 174 943 579 943 579M-114 -493C-114 -493 -46 -88 418 39C882 166 950 571 950 571M-107 -501C-107 -501 -39 -96 425 31C889 158 957 563 957 563M-100 -509C-100 -509 -32 -104 432 23C896 150 964 555 964 555M-93 -517C-93 -517 -25 -112 439 15C903 142 971 547 971 547M-86 -525C-86 -525 -18 -120 446 7C910 134 978 539 978 539M-79 -533C-79 -533 -11 -128 453 -1C917 126 985 531 985 531M-72 -541C-72 -541 -4 -136 460 -9C924 118 992 523 992 523M-65 -549C-65 -549 3 -144 467 -17C931 110 999 515 999 515M-58 -557C-58 -557 10 -152 474 -25C938 102 1006 507 1006 507M-51 -565C-51 -565 17 -160 481 -33C945 94 1013 499 1013 499M-44 -573C-44 -573 24 -168 488 -41C952 86 1020 491 1020 491M-37 -581C-37 -581 31 -176 495 -49C959 78 1027 483 1027 483M-30 -589C-30 -589 38 -184 502 -57C966 70 1034 475 1034 475M-23 -597C-23 -597 45 -192 509 -65C973 62 1041 467 1041 467M-16 -605C-16 -605 52 -200 516 -73C980 54 1048 459 1048 459M-9 -613C-9 -613 59 -208 523 -81C987 46 1055 451 1055 451M-2 -621C-2 -621 66 -216 530 -89C994 38 1062 443 1062 443M5 -629C5 -629 73 -224 537 -97C1001 30 1069 435 1069 435M12 -637C12 -637 80 -232 544 -105C1008 22 1076 427 1076 427M19 -645C19 -645 87 -240 551 -113C1015 14 1083 419 1083 419"
            stroke="url(#paint0_radial_242_278)"
            strokeOpacity="0.05"
            strokeWidth="0.5"
          ></path>

          {paths.map((path, index) => (
            <motion.path
              key={`path-` + index}
              d={path}
              stroke={`url(#linearGradient-${index})`}
              strokeOpacity="0.4"
              strokeWidth="0.5"
            ></motion.path>
          ))}
          <defs>
            {paths.map((path, index) => (
              <motion.linearGradient
                id={`linearGradient-${index}`}
                key={`gradient-${index}`}
                initial={
                  reduceMotion
                    ? { x1: "0%", x2: "95%", y1: "0%", y2: "95%" }
                    : { x1: "0%", x2: "0%", y1: "0%", y2: "0%" }
                }
                animate={
                  reduceMotion
                    ? { x1: "0%", x2: "95%", y1: "0%", y2: "95%" }
                    : {
                        x1: ["0%", "100%"],
                        x2: ["0%", "95%"],
                        y1: ["0%", "100%"],
                        y2: ["0%", timings[index].y2],
                      }
                }
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        duration: timings[index].duration,
                        ease: "easeInOut",
                        repeat: Infinity,
                        delay: timings[index].delay,
                      }
                }
              >
                <stop stopColor="#FF6A00" stopOpacity="0"></stop>
                <stop stopColor="#FF6A00"></stop>
                <stop offset="32.5%" stopColor="#FF9B4D"></stop>
                <stop offset="100%" stopColor="#FFC79A" stopOpacity="0"></stop>
              </motion.linearGradient>
            ))}

            <radialGradient
              id="paint0_radial_242_278"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(352 34) rotate(90) scale(555 1560.62)"
            >
              <stop offset="0.0666667" stopColor="#8A8A93"></stop>
              <stop offset="0.243243" stopColor="#8A8A93"></stop>
              <stop offset="0.43594" stopColor="white" stopOpacity="0"></stop>
            </radialGradient>
          </defs>
        </svg>
      </div>
    );
  },
);

BackgroundBeams.displayName = "BackgroundBeams";
```

### `src/components/ui/glowing-effect.tsx`
Conic-gradient border glow that tracks the cursor. The light-card hover signature.

```tsx
"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { animate } from "framer-motion";

interface GlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  variant?: "default" | "white";
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
}
const GlowingEffect = memo(
  ({
    blur = 0,
    inactiveZone = 0.7,
    proximity = 0,
    spread = 20,
    variant = "default",
    glow = false,
    className,
    movementDuration = 2,
    borderWidth = 1,
    disabled = true,
  }: GlowingEffectProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lastPosition = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>(0);

    const handleMove = useCallback(
      (e?: MouseEvent | { x: number; y: number }) => {
        if (!containerRef.current) return;

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
          const element = containerRef.current;
          if (!element) return;

          const { left, top, width, height } = element.getBoundingClientRect();
          const mouseX = e?.x ?? lastPosition.current.x;
          const mouseY = e?.y ?? lastPosition.current.y;

          if (e) {
            lastPosition.current = { x: mouseX, y: mouseY };
          }

          const center = [left + width * 0.5, top + height * 0.5];
          const distanceFromCenter = Math.hypot(
            mouseX - center[0],
            mouseY - center[1]
          );
          const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;

          if (distanceFromCenter < inactiveRadius) {
            element.style.setProperty("--active", "0");
            return;
          }

          const isActive =
            mouseX > left - proximity &&
            mouseX < left + width + proximity &&
            mouseY > top - proximity &&
            mouseY < top + height + proximity;

          element.style.setProperty("--active", isActive ? "1" : "0");

          if (!isActive) return;

          const currentAngle =
            parseFloat(element.style.getPropertyValue("--start")) || 0;
          let targetAngle =
            (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) /
              Math.PI +
            90;

          const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
          const newAngle = currentAngle + angleDiff;

          animate(currentAngle, newAngle, {
            duration: movementDuration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (value: number) => {
              element.style.setProperty("--start", String(value));
            },
          });
        });
      },
      [inactiveZone, proximity, movementDuration]
    );

    useEffect(() => {
      if (disabled) return;

      const handleScroll = () => handleMove();
      const handlePointerMove = (e: PointerEvent) => handleMove(e);

      window.addEventListener("scroll", handleScroll, { passive: true });
      document.body.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        window.removeEventListener("scroll", handleScroll);
        document.body.removeEventListener("pointermove", handlePointerMove);
      };
    }, [handleMove, disabled]);

    return (
      <>
        <div
          className={cn(
            "pointer-events-none absolute -inset-px hidden rounded-[inherit] border opacity-0 transition-opacity",
            glow && "opacity-100",
            variant === "white" && "border-white",
            disabled && "!block"
          )}
        />
        <div
          ref={containerRef}
          style={
            {
              "--blur": `${blur}px`,
              "--spread": spread,
              "--start": "0",
              "--active": "0",
              "--glowingeffect-border-width": `${borderWidth}px`,
              "--repeating-conic-gradient-times": "5",
              "--gradient":
                variant === "white"
                  ? `repeating-conic-gradient(
                  from 236.84deg at 50% 50%,
                  var(--black),
                  var(--black) calc(25% / var(--repeating-conic-gradient-times))
                )`
                  : `radial-gradient(circle, #FF6A00 8%, transparent 18%),
                radial-gradient(circle at 30% 40%, #FF8A1F 6%, transparent 16%),
                radial-gradient(circle at 70% 60%, #FFD27A 8%, transparent 18%),
                radial-gradient(circle at 50% 50%, #E8E1D5 10%, transparent 22%),
                repeating-conic-gradient(
                  from 236.84deg at 50% 50%,
                  #FF6A00 0%,
                  #FF8A1F calc(25% / var(--repeating-conic-gradient-times)),
                  #FFC46A calc(50% / var(--repeating-conic-gradient-times)),
                  #E8E1D5 calc(75% / var(--repeating-conic-gradient-times)),
                  #FF6A00 calc(100% / var(--repeating-conic-gradient-times))
                )`,
            } as React.CSSProperties
          }
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity",
            glow && "opacity-100",
            blur > 0 && "blur-[var(--blur)] ",
            className,
            disabled && "!hidden"
          )}
        >
          <div
            className={cn(
              "glow",
              "rounded-[inherit]",
              'after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))]',
              "after:[border:var(--glowingeffect-border-width)_solid_transparent]",
              "after:[background:var(--gradient)] after:[background-attachment:fixed]",
              "after:opacity-[var(--active)] after:transition-opacity after:duration-300",
              "after:[mask-clip:padding-box,border-box]",
              "after:[mask-composite:intersect]",
              "after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]"
            )}
          />
        </div>
      </>
    );
  }
);

GlowingEffect.displayName = "GlowingEffect";

export { GlowingEffect };
```


## 3. AI-Vision-specific widgets (relevant to /hardware/ai-vision)

### `src/components/ui/AIVisionWidget.tsx`
A 252×252 inset card: detection-confidence line chart. Currently rendered inside `BentoGrid` on the v2 homepage only.

```tsx
"use client";
import { motion } from "framer-motion";

const W = 252, H = 252;
const FONT = "ui-sans-serif,system-ui,sans-serif";
const MONO = "ui-monospace,monospace";

const chartPts: [number, number][] = [
  [0,54],[14,48],[28,52],[42,38],[56,44],[70,30],[84,42],
  [98,22],[112,36],[126,18],[140,28],[154,12],[168,24],
  [182,8],[196,18],[210,6],[224,14],[232,10],
];


export default function AIVisionWidget() {
  const lineD = chartPts.map(([x,y],i) => `${i===0?"M":"L"} ${x} ${y}`).join(" ");
  const fillD = `${lineD} L ${chartPts[chartPts.length-1][0]} 62 L 0 62 Z`;

  return (
    <div className="absolute z-10 overflow-hidden"
      style={{
        top: 128, bottom: 16, left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 28px)",
        borderRadius: "16px",
        background: "transparent",
        border: "1px solid #E5E7EB",
      }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMin meet" style={{ display:"block" }}>
        <defs>
          <filter id="avf" x="-6%" y="-6%" width="112%" height="112%">
            <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="rgba(0,0,0,0.05)" />
          </filter>
          <linearGradient id="chartfill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(59,130,246,0.25)" />
            <stop offset="100%" stopColor="rgba(59,130,246,0.02)" />
          </linearGradient>
          <clipPath id="chartclip">
            <rect x={0} y={0} width={236} height={64} />
          </clipPath>
        </defs>

        {/* Card */}
        <motion.rect x={0} y={0} width={W} height={H} rx="16"
          fill="rgba(255,255,255,0.92)" filter="url(#avf)"
          initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.45 }}
        />

        {/* ── Header ── */}
        <text x={14} y={26} fontSize="8.5" fill="#0E0E0F" fontFamily={FONT} fontWeight="700">AI Detection</text>

        {/* ── Primary + Secondary stats ── */}
        <text x={14} y={52} fontSize="19" fill="#0E0E0F" fontFamily={FONT} fontWeight="700">1,284</text>
        <text x={14} y={63} fontSize="6" fill="#94A3B8" fontFamily={FONT}>Detections today</text>

        <text x={138} y={52} fontSize="14" fill="#0E0E0F" fontFamily={FONT} fontWeight="700">98%</text>
        <text x={138} y={63} fontSize="6" fill="#94A3B8" fontFamily={FONT}>Accuracy rate</text>

        {/* ── Chart area ── */}
        <rect x={8} y={72} width={W-16} height={72} rx="10" fill="#F8FAFC" />

        <g transform="translate(8, 76)" clipPath="url(#chartclip)">
          <path d={fillD} fill="url(#chartfill)" />
          <motion.path d={lineD} fill="none" stroke="#3B82F6" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength:0 }} animate={{ pathLength:1 }}
            transition={{ duration:1.4, delay:0.3, ease:"easeOut" }}
          />
          {/* Now indicator */}
          <motion.line x1={232} y1={0} x2={232} y2={62}
            stroke="#3B82F6" strokeWidth="1" strokeDasharray="3,3"
            animate={{ opacity:[0.4,1,0.4] }} transition={{ duration:1.5, repeat:Infinity }}
          />
          <circle cx={232} cy={10} r={3} fill="#3B82F6" />
        </g>

        {/* Time labels */}
        {["6 AM","10 AM","2 PM","NOW"].map((t, i) => (
          <text key={t} x={14 + i * 72} y={154} fontSize="5" fill="#CBD5E1"
            fontFamily={MONO} textAnchor={i === 3 ? "end" : "start"}>{t}</text>
        ))}

        {/* ── Status card ── */}
        <rect x={10} y={164} width={W-20} height={54} rx="10" fill="#F8FAFC" />
        <rect x={18} y={174} width={14} height={14} rx="4" fill="#F0FDF4" />
        <circle cx={25} cy={181} r={4} fill="#22C55E" opacity="0.3" />
        <circle cx={25} cy={181} r={2} fill="#22C55E" />
        <text x={38} y={179} fontSize="7" fill="#0E0E0F" fontFamily={FONT} fontWeight="700">All Zones Secure</text>
        <text x={38} y={191} fontSize="5.5" fill="#94A3B8" fontFamily={FONT}>No anomalies detected in the last</text>
        <text x={38} y={201} fontSize="5.5" fill="#94A3B8" fontFamily={FONT}>30 minutes across all aisles.</text>

      </svg>
    </div>
  );
}
```

### `src/components/ui/AIVisionScene.tsx`
A 360×330 SVG scene: floating detection chips over a warehouse vignette. Not currently rendered anywhere.

```tsx
"use client";
import { motion } from "framer-motion";

const W = 360, H = 330;

/* Floating chip wrapper */
function Chip({ x, y, color, border, children, delay = 0 }: {
  x: number; y: number; color: string; border: string; children: React.ReactNode; delay?: number;
}) {
  return (
    <motion.g
      animate={{ y: [0, -4, 0], opacity: [0.88, 1, 0.88] }}
      transition={{ duration: 3 + delay * 0.4, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <rect x={x} y={y} width={80} height={15} rx="7.5"
        fill="rgba(6,10,18,0.95)" stroke={border} strokeWidth="0.8" />
      <circle cx={x + 10} cy={y + 7.5} r={2.6} fill={color} />
      {children}
    </motion.g>
  );
}

export default function AIVisionScene() {
  return (
    <div
      className="absolute bottom-0 right-0 z-10 overflow-hidden"
      style={{
        top: 128,
        left: 24,
        borderRadius: "20px 0 0 0",
        border: "1px solid #1E2D40",
        borderRight: "none",
        borderBottom: "none",
        background: "#070A12",
      }}
    >
      <svg
        width="100%" height="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block" }}
      >
        <defs>
          <pattern id="vdots" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="11" cy="11" r="0.55" fill="#0D1828" />
          </pattern>
          {/* Heatmap blobs */}
          <radialGradient id="heat-orange" cx="38%" cy="58%" r="28%">
            <stop offset="0%" stopColor="rgba(255,106,0,0.13)" />
            <stop offset="100%" stopColor="rgba(255,106,0,0)" />
          </radialGradient>
          <radialGradient id="heat-green" cx="64%" cy="44%" r="22%">
            <stop offset="0%" stopColor="rgba(34,197,94,0.09)" />
            <stop offset="100%" stopColor="rgba(34,197,94,0)" />
          </radialGradient>
          {/* Vertical scan gradient */}
          <linearGradient id="vscan" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%"   stopColor="rgba(34,197,94,0)" />
            <stop offset="42%"  stopColor="rgba(34,197,94,0.05)" />
            <stop offset="50%"  stopColor="rgba(34,197,94,0.22)" />
            <stop offset="58%"  stopColor="rgba(34,197,94,0.05)" />
            <stop offset="100%" stopColor="rgba(34,197,94,0)" />
          </linearGradient>
          {/* Soft glow filter */}
          <filter id="glow-sm" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Base background ── */}
        <rect width={W} height={H} fill="#070A12" />
        <rect width={W} height={H} fill="url(#vdots)" />
        <rect width={W} height={H} fill="url(#heat-orange)" />
        <rect width={W} height={H} fill="url(#heat-green)" />

        {/* ── Left rack column ── */}
        <rect x={0} y={0} width={72} height={H} fill="#0B1320" />
        {[52,104,156,208,260,312].map(y => (
          <line key={`lh-${y}`} x1={0} y1={y} x2={72} y2={y} stroke="#10202E" strokeWidth="1" />
        ))}
        {[26,78,130,182,234,286].map(cy =>
          [5,22,40,57].map(cx => (
            <rect key={`lp-${cx}-${cy}`} x={cx} y={cy - 6} width={13} height={10} rx="2"
              fill="#111E30" stroke="#192B40" strokeWidth="0.5" />
          ))
        )}
        <line x1={72} y1={0} x2={72} y2={H} stroke="#162438" strokeWidth="1.5" />

        {/* ── Right rack column ── */}
        <rect x={W - 72} y={0} width={72} height={H} fill="#0B1320" />
        {[52,104,156,208,260,312].map(y => (
          <line key={`rh-${y}`} x1={W - 72} y1={y} x2={W} y2={y} stroke="#10202E" strokeWidth="1" />
        ))}
        {[26,78,130,182,234,286].map(cy =>
          [W - 68, W - 51, W - 33, W - 16].map(cx => (
            <rect key={`rp-${cx}-${cy}`} x={cx} y={cy - 6} width={13} height={10} rx="2"
              fill="#111E30" stroke="#192B40" strokeWidth="0.5" />
          ))
        )}
        <line x1={W - 72} y1={0} x2={W - 72} y2={H} stroke="#162438" strokeWidth="1.5" />

        {/* ── Aisle centre line ── */}
        <line x1={W / 2} y1={20} x2={W / 2} y2={H - 20}
          stroke="#0C1826" strokeWidth="1" strokeDasharray="12,9" />

        {/* ── Camera FOV cone ── */}
        <path d={`M ${W / 2} 0 L ${W / 2 - 65} ${H * 0.4} L ${W / 2 + 65} ${H * 0.4} Z`}
          fill="rgba(34,197,94,0.02)" stroke="rgba(34,197,94,0.06)" strokeWidth="0.6" />

        {/* ── Camera indicators ── */}
        {[136, 224].map((cx, i) => (
          <g key={`cam-${i}`}>
            <rect x={cx - 11} y={4} width={22} height={13} rx="3"
              fill="#091520" stroke="rgba(34,197,94,0.4)" strokeWidth="0.7" opacity="0.6" />
            <motion.circle cx={cx - 4} cy={10.5} r={2.5} fill="#22C55E"
              animate={{ opacity: [1, 0.15, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.9 }}
            />
          </g>
        ))}

        {/* ── Vertical scanning line ── */}
        <motion.rect x={72} y={0} width={W - 144} height={H}
          fill="url(#vscan)"
          animate={{ y: [-H * 0.35, H * 0.35, -H * 0.35] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* ════════════════════════════════════════
            PERSON — left aisle
        ════════════════════════════════════════ */}
        <motion.g
          animate={{ y: [0, -38, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        >
          {/* Safety ellipse */}
          <motion.ellipse cx={128} cy={198} rx={26} ry={26}
            fill="rgba(96,165,250,0.06)" stroke="rgba(96,165,250,0.2)" strokeWidth="1" strokeDasharray="4,4"
            animate={{ rx: [26, 29, 26], ry: [26, 29, 26] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Body */}
          <circle cx={128} cy={192} r={8.5} fill="#93C5FD" opacity="0.92" />
          <ellipse cx={128} cy={205} rx={5.5} ry={8} fill="#60A5FA" opacity="0.88" />
          {/* Detection box */}
          <motion.rect x={113} y={179} width={30} height={42} rx="2"
            fill="none" stroke="#60A5FA" strokeWidth="1.1" strokeDasharray="4,3"
            animate={{ opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 1.9, repeat: Infinity }}
          />
          {/* Chip */}
          <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}>
            <rect x={88} y={163} width={80} height={14} rx="7"
              fill="rgba(6,10,20,0.96)" stroke="rgba(59,130,246,0.55)" strokeWidth="0.8" />
            <circle cx={99} cy={170} r={2.5} fill="#60A5FA" />
            <text x={105} y={174.5} fontSize="6.5" fill="#93C5FD"
              fontFamily="ui-monospace,monospace" fontWeight="600">Person • 98%</text>
          </motion.g>
        </motion.g>

        {/* ════════════════════════════════════════
            FORKLIFT — right aisle
        ════════════════════════════════════════ */}
        <motion.g
          animate={{ y: [0, 48, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Safety ellipse */}
          <motion.ellipse cx={222} cy={158} rx={32} ry={26}
            fill="rgba(34,197,94,0.05)" stroke="rgba(34,197,94,0.18)" strokeWidth="1" strokeDasharray="5,4"
            animate={{ rx: [32, 35, 32], opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Forklift body */}
          <rect x={203} y={144} width={34} height={24} rx="3" fill="#D97706" />
          <rect x={216} y={148} width={17} height={16} rx="2" fill="#B45309" />
          <rect x={194} y={150} width={10} height={3} rx="1" fill="#FBBF24" />
          <rect x={194} y={159} width={10} height={3} rx="1" fill="#FBBF24" />
          <circle cx={206} cy={145} r={3} fill="#92400E" />
          <circle cx={233} cy={145} r={3} fill="#92400E" />
          <circle cx={206} cy={166} r={3} fill="#92400E" />
          <circle cx={233} cy={166} r={3} fill="#92400E" />
          {/* Detection box */}
          <motion.rect x={190} y={136} width={54} height={44} rx="2"
            fill="none" stroke="#22C55E" strokeWidth="1.1" strokeDasharray="4,3"
            animate={{ opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
          {/* Chip */}
          <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}>
            <rect x={182} y={118} width={78} height={14} rx="7"
              fill="rgba(6,10,20,0.96)" stroke="rgba(34,197,94,0.55)" strokeWidth="0.8" />
            <circle cx={193} cy={125} r={2.5} fill="#22C55E" />
            <text x={199} y={129.5} fontSize="6.5" fill="#4ADE80"
              fontFamily="ui-monospace,monospace" fontWeight="600">Forklift • 99%</text>
          </motion.g>
        </motion.g>

        {/* ── Zone Clear chip ── */}
        <motion.g animate={{ y: [0, -4, 0], opacity: [0.88, 1, 0.88] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}>
          <rect x={108} y={248} width={72} height={15} rx="7.5"
            fill="rgba(4,12,6,0.96)" stroke="rgba(34,197,94,0.38)" strokeWidth="0.8" />
          <circle cx={119} cy={255.5} r={2.6} fill="#22C55E" />
          <text x={125} y={259.5} fontSize="6.5" fill="#4ADE80" fontFamily="ui-monospace,monospace">✓ Zone Clear</text>
        </motion.g>

        {/* ── Pallet chip ── */}
        <motion.g animate={{ y: [0, -3, 0], opacity: [0.82, 1, 0.82] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2.6 }}>
          <rect x={108} y={268} width={58} height={15} rx="7.5"
            fill="rgba(8,12,20,0.96)" stroke="rgba(100,116,139,0.35)" strokeWidth="0.8" />
          <circle cx={119} cy={275.5} r={2.6} fill="#64748B" />
          <text x={125} y={279.5} fontSize="6.5" fill="#94A3B8" fontFamily="ui-monospace,monospace">📦 Pallet</text>
        </motion.g>

        {/* ════════════════════════════════════════
            LIVE badge — top-left
        ════════════════════════════════════════ */}
        <rect x={8} y={7} width={80} height={18} rx="9"
          fill="rgba(7,10,18,0.94)" stroke="rgba(34,197,94,0.18)" strokeWidth="0.8" />
        <motion.circle cx={20} cy={16} r={3} fill="#22C55E" filter="url(#glow-sm)"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        <text x={28} y={20} fontSize="7" fill="#22C55E" fontFamily="ui-monospace,monospace" fontWeight="700">LIVE</text>
        <text x={52} y={20} fontSize="6.5" fill="#334155" fontFamily="ui-monospace,monospace">· 2 cams</text>

        {/* ════════════════════════════════════════
            Alert Toast — top-right
        ════════════════════════════════════════ */}
        <motion.g
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <rect x={W - 118} y={5} width={110} height={50} rx="9"
            fill="rgba(18,8,4,0.97)" stroke="rgba(251,146,60,0.28)" strokeWidth="0.8" />
          <rect x={W - 118} y={5} width={3} height={50} rx="1.5" fill="#FB923C" opacity="0.7" />
          <text x={W - 110} y={20} fontSize="7" fill="#FB923C" fontFamily="ui-monospace,monospace" fontWeight="700">⚠ Near Miss</text>
          <text x={W - 110} y={32} fontSize="6.5" fill="#64748B" fontFamily="ui-monospace,monospace">Aisle 07</text>
          <text x={W - 110} y={43} fontSize="6" fill="#334155" fontFamily="ui-monospace,monospace">2 sec ago</text>
          <motion.circle cx={W - 14} cy={14} r={3} fill="#FB923C"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        </motion.g>

        {/* ════════════════════════════════════════
            Activity Timeline — bottom-right
        ════════════════════════════════════════ */}
        <motion.g
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
        >
          <rect x={W - 122} y={H - 100} width={114} height={90} rx="10"
            fill="rgba(6,10,20,0.97)" stroke="rgba(22,36,56,0.9)" strokeWidth="0.8" />
          <text x={W - 111} y={H - 83} fontSize="7" fill="#64748B" fontFamily="ui-monospace,monospace" fontWeight="700">Recent Events</text>
          <line x1={W - 122} y1={H - 76} x2={W - 8} y2={H - 76} stroke="#0E1C2E" strokeWidth="0.8" />
          {/* Event rows */}
          {[
            { cy: H - 64, dot: "#22C55E", label: "✓ PPE Verified", time: "1m" },
            { cy: H - 48, dot: "#FB923C", label: "⚠ Speed Alert",  time: "2m" },
            { cy: H - 32, dot: "#22C55E", label: "✓ Zone Cleared", time: "5m" },
          ].map(({ cy, dot, label, time }) => (
            <g key={label}>
              <circle cx={W - 111} cy={cy} r={2.5} fill={dot} />
              <text x={W - 105} y={cy + 4} fontSize="6.5"
                fill={dot === "#22C55E" ? "#4ADE80" : "#FB923C"}
                fontFamily="ui-monospace,monospace">{label}</text>
              <text x={W - 14} y={cy + 4} textAnchor="end" fontSize="5.5"
                fill="#1E3A5F" fontFamily="ui-monospace,monospace">{time} ago</text>
            </g>
          ))}
        </motion.g>

        {/* ── Bottom status bar ── */}
        <rect x={0} y={H - 24} width={W} height={24} fill="rgba(4,6,12,0.98)" />
        <line x1={0} y1={H - 24} x2={W} y2={H - 24} stroke="#0E1A28" strokeWidth="1" />
        <motion.circle cx={13} cy={H - 12} r={2.5} fill="#22C55E"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
        <text x={21} y={H - 8} fontSize="6.5" fill="#22C55E" fontFamily="ui-monospace,monospace" fontWeight="700">AI VISION</text>
        <text x={W / 2} y={H - 8} textAnchor="middle" fontSize="6" fill="#1E3A5F" fontFamily="ui-monospace,monospace">RAMS Vision Engine 2.0</text>
        <text x={W - 8} y={H - 8} textAnchor="end" fontSize="6" fill="#1A2D40" fontFamily="ui-monospace,monospace">24 events</text>
      </svg>
    </div>
  );
}
```


## 4. Decorative / vendored — source omitted on purpose

These are large third-party or generated visual widgets (three.js, ogl shaders,
canvas particle fields). They carry no design tokens and should not be copied
into a new design. Read the file directly only if a design actually needs one.

| File | Lines | What it is |
|---|---|---|
| `src/components/ui/Orb.tsx` | 465 | ogl shader orb |
| `src/components/ui/terminal.tsx` | 497 | animated fake terminal |
| `src/components/ui/SoftAurora.tsx` | 353 | aurora gradient backdrop |
| `src/components/ui/Grainient.tsx` | 302 | grain + gradient backdrop (+ `Grainient.css`) |
| `src/components/ui/globe.tsx` | 207 | three-globe / react-three-fiber globe |
| `src/components/ui/WarehouseNetwork.tsx` | 141 | animated node/link network |
| `src/components/ui/ParticleRing.tsx` | 92 | three.js particle ring |
| `src/components/ui/DigitalTwinWidget.tsx` | 81 | small twin preview card |
| `src/components/ui/InventoryWidget.tsx` | 94 | small inventory preview card |
| `src/components/ui/VersionSwitcher.tsx` | 161 | v1/v2 nav toggle — **never mounted**; only its `useNavVersion()` hook is used |

