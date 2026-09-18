# Theme & design tokens

Tailwind v4, CSS-first. There is **no `tailwind.config`** — every token is
declared in `@theme inline` inside `src/app/globals.css`.

---

## Part 1 — Compact token summary

### Brand palette (weighted 45 / 20 / 20 / 10 / 5 %)

| Token | Value | Role |
|---|---|---|
| `carbon` | `#0E0E0F` | 45% — dominant, depth, foundation |
| `graphite` | `#33363A` | 20% — balance, stability |
| `steel` | `#D9DBDD` | 20% — structural surfaces, dividers |
| `off-white` | `#F3F1EC` | 10% — clarity, space |
| `signal-orange` | `#FF6A00` | **5% — CTAs and critical emphasis only** |

**`signal-orange` is the only accent on the site**, on light and dark alike:
eyebrows, one word in a heading, a CTA, a live indicator. Not body copy, not
decoration. Do not introduce a new accent colour.

### Secondary (use selectively)

`electric-cyan #00C8FF` · `neon-lime #A6FF00` · `hazard-yellow #FFC107` ·
`forest-green #1E5B3A` · `warm-beige #E8E1D5`

### Dark surface scale

`surface-void #050506` · `surface-dark #0B0B0C` · `surface-card #101012` ·
`surface-elevated #101214` · `carbon-teal #0B1619`

### Named section surfaces (from `rackiq-shared.tsx` — use these, not raw hex)

| Key | Value | Tone |
|---|---|---|
| `white` | `#FFFFFF` | light |
| `offWhite` | `#F5F5F7` | light |
| `warm` | `rgba(245,245,247,0.6)` | light |
| `ink` | `#08080A` | dark |
| `inkTeal` | `#0B1619` | dark |
| `darkTop` | `radial-gradient(80% 100% at 50% 0%, #1D1D1F 0%, #0E0E0F 55%, #08080A 100%)` | dark |
| `darkMid` | `radial-gradient(80% 100% at 50% 0%, #1D1D1F 0%, #0E0E0F 60%, #08080A 100%)` | dark |
| `darkBottom` | `radial-gradient(80% 100% at 50% 100%, #1D1D1F 0%, #0E0E0F 55%, #08080A 100%)` | dark |

**Surfaces alternate — no two adjacent sections share one.** Where they must,
shorten the shared boundary with `paddingTop` **or** `paddingBottom`, never both.

### RAG risk tones — risk state ONLY, never decoration

Dark: `rag-green #54DE91` · `rag-amber #FFBE47` · `rag-red #FF6C6C`
Light: green `#16A34A` · amber `#D9A21B` · red `#C6413A`

### Text colour by tone (the `T` record in `rackiq-shared.tsx`)

| Role | Light section | Dark section |
|---|---|---|
| Title | `text-carbon` | `text-white` |
| Body | `text-graphite/65` | `text-white/55`–`/60` |
| Muted | `text-graphite/45` | `text-white/35`–`/40` |
| Accent | `text-signal-orange` | `text-signal-orange` |

Never use a raw hex for text.

### Typefaces

| Role | Family | Weights | Variable |
|---|---|---|---|
| Headings | IBM Plex Sans | 300–700 | `--font-heading` |
| Body & UI | Roboto | 300,400,500,700 | `--font-body` |
| Mono / labels | Roboto Mono | 300,400,500 | `--font-mono` |

`<h1>`–`<h6>` get IBM Plex Sans automatically from `@layer base`. Never set a
font-family on a heading. Only weights 400/500/600/700 are loaded.

> **Known defect:** `--font-mono` points at the undefined `--font-geist-mono`
> and `--font-sans` is self-referential, so both resolve to nothing. All ~200
> `font-mono` usages currently render in Roboto. Treat `font-mono` as "the label
> treatment" (uppercase + wide tracking), not guaranteed monospace. Never use
> `font-sans`.

### Type scale — arbitrary px, NOT Tailwind's named scale

1,177 `text-[Npx]` usages against 116 `text-xs`…`text-7xl`. Follow the majority.
Half-pixel sizes (`10.5px`, `12.5px`, `14.5px`) are intentional — keep them.

| Role | Size | Weight | Tracking | Leading |
|---|---|---|---|---|
| Page `h1` (hero, one per page) | `56 / 84 / 112px` | bold | `-0.045em` | `0.98` |
| Section `h2` default | `40 / 60 / 78px` | bold | `-0.04em` | `1.0` |
| Section `h2` compact | `36 / 54 / 68px` | bold | `-0.04em` | `1.05` |
| CTA headline | `36 / 58 / 76px` | bold | `-0.035em` | `1.02` |
| Sub-headline `h3` | `24–28px` | semibold | `-0.02em` | `1.15` |
| Card title | `20px sm:22px` | semibold | `-0.02em` | `1.2` |
| Stat number (large) | `44px sm:52px` | bold | `-0.035em` | `0.95` |
| Stat number (band) | `30 / 34 / 38px` | bold | `-0.02em` | `1.0` |
| Section subline | `14px sm:15px` | normal | — | `1.55` |
| Body paragraph | `15–16px` | normal | — | `1.6–1.65` |
| Card body | `14.5px` | normal | — | `1.6` |
| Dense body | `13px`, `12.5px` | normal | — | `1.55` |
| Button label | `14px` | semibold | — | — |
| **Eyebrow** | `11px` | semibold | `0.22em` | — |
| Kicker | `10.5px` | bold | `0.18–0.22em` | — |
| Micro label | `9–9.5px` | bold | `0.16em` | — |

Type scales at `sm:` (640px) and `lg:` (1024px) only — no `md:`, no `xl:`.
Labels at 11px and below never scale. Anything ≤12px is always uppercase, mono
and letter-spaced. Always add `tabular-nums` to a figure that animates or sits
in a column.

### Layout

```
--page-max-width: 1280px
--page-padding-x: 24px   (768px → 20px, 640px → 16px)
--grid-gap:       24px
```

`.rams-container` = max-width + auto margins + those paddings.
**Content width is therefore 1232px.**

Section vertical rhythm (the `Section` component's `padding` prop):

```
default  pt-28 sm:pt-36 lg:pt-44   pb-28 sm:pb-36 lg:pb-44
tight    pt-20 sm:pt-24 lg:pt-28   pb-20 sm:pb-24 lg:pb-28
strip    pt-10 sm:pt-12 lg:pt-14   pb-10 sm:pb-12 lg:pb-14
```

Header block margin below: `mb-20 sm:mb-24` (default) / `mb-16 sm:mb-20` (wide).

### Motion

`EASE = [0.22, 1, 0.36, 1]` — **every** transition on the site.

| Part | initial | duration | delay | viewport amount |
|---|---|---|---|---|
| Eyebrow | `y: 8` | 0.5 | — | 0.5 |
| Heading | `y: 20` | 0.85 | — | 0.4 |
| Subline | `y: 12` | 0.65 | 0.1 | 0.4 |

Sections use `whileInView` with `viewport={{ once: true }}` — they animate once
and never replay. The hero uses `animate` instead, because it is above the fold.

### Cards on a light surface

```
borderRadius  12
border        1px solid #E8E8ED
boxShadow     0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)
hover         -translate-y-1, plus the conic orange shine
```

Dark glass card: `borderRadius 18`, `linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015))`, `1px solid rgba(255,255,255,0.09)`.
Hairlines: light `#E8E8ED`, dark `rgba(255,255,255,0.10)`.

### Radius

`--radius: 0.625rem` with sm/md/lg/xl/2xl/3xl/4xl computed from it. In practice
sections use explicit values: 12 (light card), 18 (dark glass), `rounded-lg`
(buttons), `rounded-full` (pills, page CTAs).

---

## Part 2 — Raw source

### `src/app/globals.css`
The whole token system: `@theme inline`, shadcn `:root` mapping, header/layout tokens, `.rams-container`, and the `@layer base` element styles.

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

/* ═══════════════════════════════════════════════════════
   RAMS 2.0 — Design Tokens
   Source: RAMS Brand Palette (canonical, May 2026)
═══════════════════════════════════════════════════════ */

@theme inline {
  /* ── shadcn plumbing (required) ── */
  --color-background:               var(--background);
  --color-foreground:               var(--foreground);
  --font-sans:                      var(--font-sans);
  --font-mono:                      var(--font-geist-mono);
  --color-sidebar-ring:             var(--sidebar-ring);
  --color-sidebar-border:           var(--sidebar-border);
  --color-sidebar-accent-foreground:var(--sidebar-accent-foreground);
  --color-sidebar-accent:           var(--sidebar-accent);
  --color-sidebar-primary-foreground:var(--sidebar-primary-foreground);
  --color-sidebar-primary:          var(--sidebar-primary);
  --color-sidebar-foreground:       var(--sidebar-foreground);
  --color-sidebar:                  var(--sidebar);
  --color-chart-5:                  var(--chart-5);
  --color-chart-4:                  var(--chart-4);
  --color-chart-3:                  var(--chart-3);
  --color-chart-2:                  var(--chart-2);
  --color-chart-1:                  var(--chart-1);
  --color-ring:                     var(--ring);
  --color-input:                    var(--input);
  --color-border:                   var(--border);
  --color-destructive:              var(--destructive);
  --color-accent-foreground:        var(--accent-foreground);
  --color-accent:                   var(--accent);
  --color-muted-foreground:         var(--muted-foreground);
  --color-muted:                    var(--muted);
  --color-secondary-foreground:     var(--secondary-foreground);
  --color-secondary:                var(--secondary);
  --color-primary-foreground:       var(--primary-foreground);
  --color-primary:                  var(--primary);
  --color-popover-foreground:       var(--popover-foreground);
  --color-popover:                  var(--popover);
  --color-card-foreground:          var(--card-foreground);
  --color-card:                     var(--card);
  --radius-sm:  calc(var(--radius) * 0.6);
  --radius-md:  calc(var(--radius) * 0.8);
  --radius-lg:  var(--radius);
  --radius-xl:  calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);

  /* ── RAMS Primary Palette (45/20/20/10/5%) ── */
  --color-carbon:        #0E0E0F;   /* 45% — dominant, depth, foundation */
  --color-graphite:      #33363A;   /* 20% — balance, stability, reliability */
  --color-steel:         #D9DBDD;   /* 20% — structural surfaces, dividers */
  --color-off-white:     #F3F1EC;   /* 10% — clarity, simplicity, space */
  --color-signal-orange: #FF6A00;   /*  5% — CTAs, critical emphasis only */

  /* ── RAMS Secondary Palette (use selectively) ── */
  --color-electric-cyan: #00C8FF;   /* Intelligence, connectivity, data */
  --color-neon-lime:     #A6FF00;   /* Innovation, automation, future */
  --color-hazard-yellow: #FFC107;   /* Caution / amber-equivalent */
  --color-forest-green:  #1E5B3A;   /* Safety, compliance, verified */
  --color-warm-beige:    #E8E1D5;   /* Soft neutral, warm supporting tone */

  /* ── Extended dark surface scale (dark sections/cards) ── */
  --color-surface-void:      #050506;   /* deepest bg (immersive sections) */
  --color-surface-dark:      #0B0B0C;   /* primary dark bg */
  --color-surface-card:      #101012;   /* dark card fill */
  --color-surface-elevated:  #101214;   /* elevated dark surface */

  /* ── Signal-orange variants ── */
  --color-signal-orange-soft:   #FF9B4D;   /* text on dark, tinted labels */
  --color-signal-orange-warm:   #E88A5C;   /* warm accent */
  --color-signal-orange-deep:   #D96A2C;   /* deeper cta */

  /* ── Extended neutrals ── */
  --color-carbon-alt:      #1D1D1F;   /* deep neutral alt */
  --color-graphite-alt:    #6E6E73;   /* mid-neutral alt */
  --color-off-white-alt:   #F5F5F7;   /* near-white alt */
  --color-off-white-warm:  #F2F0EC;   /* warm near-white */
  --color-steel-soft:      #E2E2E0;   /* soft steel border */

  /* ── Success semantic ── */
  --color-success:  #22C55E;

  /* ── Extended cool/warm neutrals ── */
  --color-off-white-cool:   #F7F5F0;   /* cool near-white section bg */
  --color-off-white-hover:  #FAFAFA;   /* card hover bg */
  --color-steel-cool:       #E0E5E7;   /* cool border */
  --color-carbon-teal:      #0B1619;   /* deep teal-carbon */

  /* ── Signal-orange hover ── */
  --color-signal-orange-hover: #E55F00;

  /* ── RAG risk tones (fill + text) ── */
  --color-rag-green:        #54DE91;
  --color-rag-green-deep:   #2BCB74;
  --color-rag-amber:        #FFBE47;
  --color-rag-red:          #FF6C6C;

  /* ── Teal-dark surface variants (analytics dashboards) ── */
  --color-surface-teal-void:  #041216;
  --color-surface-teal-dark:  #071A1F;
  --color-surface-teal-card:  #0D2227;

  /* ── Semantic aliases ── */
  --color-rams-bg:        var(--color-off-white);
  --color-rams-surface:   #FFFFFF;
  --color-rams-text:      var(--color-carbon);
  --color-rams-subtle:    var(--color-graphite);
  --color-rams-divider:   var(--color-steel);
  --color-rams-cta:       var(--color-signal-orange);
  --color-rams-dark:      var(--color-carbon);

  /* ── Risk/Zone Visual ── */
  --color-risk-safe:     var(--color-forest-green);
  --color-risk-caution:  var(--color-hazard-yellow);
  --color-risk-critical: var(--color-signal-orange);

  /* ── Typography ── */
  --font-rams-heading: var(--font-heading), system-ui, sans-serif;
  --font-rams-body:    var(--font-body), system-ui, sans-serif;
}

/* ── shadcn :root tokens (mapped to RAMS brand) ── */
:root {
  --background:           #FFFFFF;
  --foreground:           #0E0E0F;
  --card:                 #FFFFFF;
  --card-foreground:      #0E0E0F;
  --popover:              #FFFFFF;
  --popover-foreground:   #0E0E0F;
  --primary:              #0E0E0F;
  --primary-foreground:   #F3F1EC;
  --secondary:            #F3F1EC;
  --secondary-foreground: #0E0E0F;
  --muted:                #F3F1EC;
  --muted-foreground:     #33363A;
  --accent:               #E8E1D5;
  --accent-foreground:    #0E0E0F;
  --destructive:          #FF6A00;
  --border:               #D9DBDD;
  --input:                #D9DBDD;
  --ring:                 #33363A;
  --radius:               0.625rem;
  --chart-1:              #0E0E0F;
  --chart-2:              #33363A;
  --chart-3:              #D9DBDD;
  --chart-4:              #FF6A00;
  --chart-5:              #00C8FF;
  --sidebar:              #F3F1EC;
  --sidebar-foreground:   #0E0E0F;
  --sidebar-primary:      #0E0E0F;
  --sidebar-primary-foreground: #F3F1EC;
  --sidebar-accent:       #E8E1D5;
  --sidebar-accent-foreground: #0E0E0F;
  --sidebar-border:       #D9DBDD;
  --sidebar-ring:         #33363A;
}

/* Header height tokens — update here if header height changes */
:root {
  --header-announcement: 40px;
  --header-nav: 80px;
  --header-total: 120px; /* announcement + nav */
}

/* ═══════════════════════════════════════════════════════
   Global 12-column layout system
   Used by every page section to guarantee shared width,
   padding, and column rhythm.
═══════════════════════════════════════════════════════ */
:root {
  --page-max-width: 1280px;
  --page-padding-x: 24px;   /* 48px total → 24px each side */
  --grid-gap: 24px;
}

@media (max-width: 768px) {
  :root {
    --page-padding-x: 20px; /* 40px total */
    --grid-gap: 20px;
  }
}

@media (max-width: 640px) {
  :root {
    --page-padding-x: 16px; /* 32px total */
    --grid-gap: 16px;
  }
}

.rams-container {
  width: 100%;
  max-width: var(--page-max-width);
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--page-padding-x);
  padding-right: var(--page-padding-x);
  box-sizing: border-box;
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    background-color: #FFFFFF;
    color: #0E0E0F;
    font-family: var(--font-body), system-ui, sans-serif;
    font-size: 16px;
    line-height: 1.6;
    overflow-x: hidden;
    letter-spacing: 0.01em;
    word-spacing: 0.02em;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading), system-ui, sans-serif;
    line-height: 1.12;
    letter-spacing: 0em;
    word-spacing: 0em;
    font-weight: 700;
  }

  h1 { font-size: clamp(2.5rem, 5vw, 5rem);   font-weight: 700; line-height: 1.05; }
  h2 { font-size: clamp(2rem,   4vw, 3.25rem); font-weight: 700; line-height: 1.08; }
  h3 { font-size: clamp(1.5rem, 3vw, 2rem);    font-weight: 600; line-height: 1.15; }
  h4 { font-size: clamp(1.25rem, 2vw, 1.5rem); font-weight: 600; line-height: 1.2;  }
  h5 { font-size: 1.125rem; font-weight: 600; }
  h6 { font-size: 1rem;     font-weight: 600; }

  p {
    line-height: 1.65;
    letter-spacing: 0.01em;
  }

  html {
    scroll-behavior: smooth;
  }
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
```

### `src/app/layout.tsx`
Where the three font variables are defined and attached.

```tsx
import type { Metadata } from "next";
import { IBM_Plex_Sans, Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/* Headings — IBM Plex Sans (as used by Verity.net) */
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

/* Body & UI — Roboto */
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

/* Mono — Roboto Mono */
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RAMS 2.0 - Operational Intelligence for the Modern Warehouse",
  description:
    "RAMS delivers AI-powered warehouse intelligence, digital twin platforms, and enterprise automation solutions trusted by global operations teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${roboto.variable} ${robotoMono.variable} antialiased`}>
      <body className="min-h-screen">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```


