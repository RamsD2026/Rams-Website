# Typography & font system

The typographic half of the RAMS design system. Colour, spacing and section
rhythm live in [`section-header.md`](./section-header.md); this file covers
**which fonts we load, which tokens expose them, and what size every piece of
text on the site should be.**

Values are not aspirational — they were read back out of the shipped components
(Rack Safety Intelligence, Inventory Intelligence, Warehouse Execution, IRDS
Platform, Digital Twin), which are the reference for all new work.

---

## 1. The three typefaces

All three are loaded through `next/font/google` in `src/app/layout.tsx`, so they
are self-hosted, preloaded and subsetted at build time. There is no runtime
request to `fonts.googleapis.com`.

| Role | Family | Weights loaded | CSS variable |
|---|---|---|---|
| **Headings** | IBM Plex Sans | 300, 400, 500, 600, 700 | `--font-heading` |
| **Body & UI** | Roboto | 300, 400, 500, 700 | `--font-body` |
| **Mono / labels** | Roboto Mono | 300, 400, 500 | `--font-mono` |

```tsx
// src/app/layout.tsx
const ibmPlexSans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["300","400","500","600","700"], variable: "--font-heading", display: "swap" });
const roboto      = Roboto({        subsets: ["latin"], weight: ["300","400","500","700"],       variable: "--font-body",    display: "swap" });
const robotoMono  = Roboto_Mono({   subsets: ["latin"], weight: ["300","400","500"],             variable: "--font-mono",    display: "swap" });

<html className={`${ibmPlexSans.variable} ${roboto.variable} ${robotoMono.variable} antialiased`}>
```

All three variables are attached to `<html>`, so they are available everywhere.

**`display: "swap"`** is deliberate: text paints immediately in the fallback and
re-renders when the webfont lands. Never change this to `block` — the hero
headline is the largest element above the fold and must not be invisible.

### Why these three

- **IBM Plex Sans** — engineered, slightly technical, holds up at 112px without
  looking like a generic geometric sans. Used only for headings.
- **Roboto** — neutral and highly legible at 13–16px, which is where most of the
  site's text actually sits.
- **Roboto Mono** — used for *labels*, not for code: eyebrows, kickers, metric
  captions, file paths in the product chrome. The mono treatment plus wide
  letter-spacing is what makes a label read as a label.

### Weights that are actually used

```
font-bold      (700)  373 uses   — headings, stat numbers, eyebrows
font-semibold  (600)  213 uses   — card titles, buttons, nav links
font-medium    (500)   62 uses   — dense supporting text
font-normal    (400)   16 uses   — rare; body already defaults to 400
```

`font-light` (300), `font-extrabold` (800) and `font-black` (900) appear a
handful of times and are **not** part of the system. 800/900 aren't even loaded,
so they render as synthetic bold. Don't add new ones.

---

## 2. Font tokens

Defined in `src/app/globals.css`:

```css
@theme inline {
  --font-sans: var(--font-sans);              /* ⚠ see below */
  --font-mono: var(--font-geist-mono);        /* ⚠ see below */
  --font-rams-heading: var(--font-heading), system-ui, sans-serif;
  --font-rams-body:    var(--font-body),    system-ui, sans-serif;
}
```

Applied globally in `@layer base`:

```css
body            { font-family: var(--font-body),    system-ui, sans-serif; }
h1,h2,h3,h4,h5,h6 { font-family: var(--font-heading), system-ui, sans-serif; }
```

So **headings get IBM Plex Sans automatically** by virtue of being `<h1>`–`<h6>`.
You do not need a font utility on a heading, and none of the reference pages
uses one.

### ⚠ `font-mono` and `font-sans` are currently broken

Two tokens in the `@theme inline` block reference variables that **do not exist
anywhere in this project**:

| Token | Points at | Defined? |
|---|---|---|
| `--font-mono` | `var(--font-geist-mono)` | ❌ never defined — leftover from the Geist starter template |
| `--font-sans` | `var(--font-sans)` | ❌ self-referential cycle |

Because `@theme inline` inlines the *value* into the utility, the compiled CSS
is:

```css
.font-mono { font-family: var(--font-geist-mono); }   /* undefined  */
.font-sans { font-family: var(--font-sans); }         /* cycles     */
```

An undefined custom property makes the declaration invalid at computed-value
time, so `font-family` falls back to `inherit`. **All ~200 `font-mono` usages
across the site currently render in Roboto, not Roboto Mono.** Every eyebrow,
kicker and metric label is affected. It is not visually catastrophic — the
uppercase + `0.22em` tracking still reads as a label — but it is not the design.

The fix is one line each:

```css
--font-mono: var(--font-mono-family);   /* rename the next/font variable, or */
--font-mono: "Roboto Mono", ui-monospace, monospace;
--font-sans: var(--font-body), system-ui, sans-serif;
```

Note the name collision: `next/font` already writes `--font-mono: "Roboto Mono",
"Roboto Mono Fallback"` onto the `<html>` element, and the `@theme` block then
redefines `--font-mono` on `:root`. Renaming one side is the clean resolution.

Until this is fixed, treat `font-mono` as *"the label treatment"* rather than
*"guaranteed monospace"*, and don't rely on character-width alignment.

### Which utility to use

| Want | Use |
|---|---|
| A heading | `<h1>`–`<h6>` — the family is automatic |
| A heading-styled `<div>`/`<span>` | `font-rams-heading` |
| Body text | nothing — `body` already sets it |
| A mono label | `font-mono` (see caveat above) |

Do **not** use bare `font-sans`. It resolves to nothing.

---

## 3. The type scale

The site uses **arbitrary pixel values**, not Tailwind's named scale:
1,177 `text-[Npx]` usages against 116 `text-xs`…`text-7xl`. Follow the majority —
mixing the two systems produces sizes that are almost-but-not-quite aligned.

### Display — page `<h1>`

Only the hero. One per page.

```
text-[56px] sm:text-[84px] lg:text-[112px]
font-bold leading-[0.98] tracking-[-0.045em]
```

Rendered by `<PageHeader>`. Animates with `animate` (not `whileInView`) because
it sits above the fold.

### Headline — section `<h2>`

```
Default   text-[40px] sm:text-[60px] lg:text-[78px]  leading-[1.0]
Compact   text-[36px] sm:text-[54px] lg:text-[68px]  leading-[1.05]
Both      font-bold tracking-[-0.04em]
```

Rendered by `<SectionHeader>`. Use `compact` when the section's visual is a wide
dashboard, so the heading doesn't overpower it.

### Everything else

| Role | Size | Weight | Tracking | Leading |
|---|---|---|---|---|
| CTA headline | `36 / 58 / 76px` | bold | `-0.035em` | `1.02` |
| Sub-headline (`h3`) | `24–28px` | semibold | `-0.02em` | `1.15` |
| Card title | `20px sm:22px` | semibold | `-0.02em` | `1.2` |
| Stat number (large) | `44px sm:52px` | bold | `-0.035em` | `0.95` |
| Stat number (band) | `30 / 34 / 38px` | bold | `-0.02em` | `1.0` |
| Section subline | `14px sm:15px` | normal | — | `1.55` |
| Body paragraph | `15–16px` | normal | — | `1.6–1.65` |
| Card body | `14.5px` | normal | — | `1.6` |
| Dense body / list item | `13px`, `12.5px` | normal | — | `1.55` |
| Button label | `14px` | semibold | — | — |
| Nav link | `12.5px`, `11.5px` | semibold | — | — |
| **Eyebrow** | `11px` | semibold | `0.22em` | — |
| Kicker / group label | `10.5px` | bold | `0.18–0.22em` | — |
| Micro label / axis | `9px`, `9.5px` | bold | `0.16em` | — |

Sizes below 12px are **always** uppercase, mono and letter-spaced. Lowercase
10px body text does not exist on this site.

### The half-pixel sizes

`10.5px`, `12.5px`, `13.5px`, `14.5px`, `11.5px` and `9.5px` are intentional and
common. They exist because the label sizes sit close together and a full pixel
step is too coarse to separate two adjacent tiers. Keep them.

---

## 4. Letter-spacing

Tracking carries as much of the identity as the families do. Two directions:

**Negative — large text.** The bigger the type, the tighter.

```
112px  →  tracking-[-0.045em]
 78px  →  tracking-[-0.04em]
 76px  →  tracking-[-0.035em]
 52px  →  tracking-[-0.035em]
 22px  →  tracking-[-0.02em]
 15px  →  tracking-[-0.01em]
```

**Positive — small uppercase labels.** The smaller the type, the wider.

```
Eyebrow (11px)          tracking-[0.22em]   ← the canonical value, 98 uses
Pill eyebrow (11px)     tracking-[0.18em]
Kicker (10.5px)         tracking-[0.18em] / [0.22em]
Micro label (9–9.5px)   tracking-[0.16em] / [0.14em]
```

Body text keeps the global default (`letter-spacing: 0.01em` on `body`). Never
add tracking to a paragraph.

---

## 5. Line-height

```
leading-[0.95]  stat numbers
leading-[0.98]  page h1
leading-[1.0]   section h2 (default)
leading-[1.05]  section h2 (compact)
leading-[1.15]  sub-headlines
leading-[1.2]   card titles
leading-[1.55]  sublines, dense body      ← most common
leading-[1.6]   card body
leading-[1.65]  paragraphs (global p default)
```

Rule of thumb: **display type is set solid or tighter; reading text never goes
below 1.5.**

---

## 6. Component recipes

Copy these rather than re-deriving them. The first two are components — use the
component, not the classes.

**Eyebrow** — `<SectionHeader eyebrow>`
```
text-[11px] font-mono font-semibold tracking-[0.22em] uppercase
text-signal-orange mb-5
```

**Section heading** — `<SectionHeader top bottom>`
```
text-[40px] sm:text-[60px] lg:text-[78px] font-bold tracking-[-0.04em] leading-[1.0]
line 1 (light)  text-carbon        line 2 (light)  text-graphite/50
line 1 (dark)   text-white         line 2 (dark)   white→transparent gradient
```

**Subline**
```
mt-6 text-[14px] sm:text-[15px] leading-[1.55] max-w-[880px] mx-auto
light  text-graphite/65      dark  text-white/60
```

**Card title + body**
```
title  text-[20px] sm:text-[22px] font-semibold tracking-[-0.02em] leading-[1.2] text-carbon
body   text-[14.5px] leading-[1.6] text-graphite/65
```

**Stat / result number**
```
text-[44px] sm:text-[52px] font-bold leading-[0.95] tabular-nums tracking-[-0.035em]
label   text-[11px] font-mono font-bold tracking-[0.18em] uppercase text-carbon
sub     text-[11px] font-mono font-semibold tracking-[0.14em] uppercase text-graphite/50
```

**Always add `tabular-nums` to a figure that animates, counts up, or sits in a
column with other figures** — proportional digits shift width as they change and
the number visibly jitters. 29 components already do this.

**Button**
```
text-[14px] font-semibold px-6 py-3 rounded-lg          (page CTAs: rounded-full, py-3.5)
```
No shadow on dark surfaces.

**Mono chip / kicker**
```
text-[10.5px] font-mono font-bold tracking-[0.22em] uppercase
light  text-graphite/45      dark  text-white/40
```

---

## 7. Text colour by tone

Never use a raw hex for text. These pair with the surfaces in
`section-header.md`, and are centralised for the IRDS page in
`irdsp-shared.tsx` as the `T` record.

| Role | Light section | Dark section |
|---|---|---|
| Title | `text-carbon` | `text-white` |
| Body | `text-graphite/65` | `text-white/55` — `/60` |
| Muted / label | `text-graphite/45` | `text-white/35` — `/40` |
| Accent | `text-signal-orange` | `text-signal-orange` |

`signal-orange` (`#FF6A00`) is the only accent, on both tones. The brand palette
defines it as *"5% — CTAs, critical emphasis only"*: eyebrows, one word in a
heading, a CTA, a live indicator. Not body copy, not decoration. RAG colours
(`rag-green`, `rag-amber`, `rag-red`) express **risk state only** and are never
used typographically.

---

## 8. Responsive steps

Type scales at two breakpoints only — `sm:` (640px) and `lg:` (1024px). No `md:`,
no `xl:` steps for type.

```tsx
text-[40px] sm:text-[60px] lg:text-[78px]
```

Small text (≤15px) usually takes **one** step or none:

```tsx
text-[14px] sm:text-[15px]
```

Labels at 11px and below **never** scale — they're already at the floor.

---

## 9. Base element styles

Set once in `globals.css @layer base`. Ambient defaults, not a scale to design
against — every section overrides them with explicit classes.

```css
body { font-size: 16px; line-height: 1.6; letter-spacing: 0.01em; word-spacing: 0.02em;
       -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

h1 { font-size: clamp(2.5rem,  5vw, 5rem);    line-height: 1.05; font-weight: 700; }
h2 { font-size: clamp(2rem,    4vw, 3.25rem); line-height: 1.08; font-weight: 700; }
h3 { font-size: clamp(1.5rem,  3vw, 2rem);    line-height: 1.15; font-weight: 600; }
h4 { font-size: clamp(1.25rem, 2vw, 1.5rem);  line-height: 1.2;  font-weight: 600; }
h5 { font-size: 1.125rem; font-weight: 600; }
h6 { font-size: 1rem;     font-weight: 600; }

p  { line-height: 1.65; letter-spacing: 0.01em; }
```

The `clamp()` values are a safety net for unstyled headings. Every designed
heading sets its own `text-[Npx]`, which wins.

---

## 10. Don't

- **Don't** mix `text-xs`/`text-lg` into a component that uses `text-[Npx]`.
  Pick the px system — it's the one the reference pages use.
- **Don't** set a font-family on a heading. `<h2>` already gets IBM Plex Sans.
- **Don't** use `font-sans`. It resolves to nothing (§2).
- **Don't** add a weight outside 400/500/600/700. Anything else is synthesised.
- **Don't** letter-space body copy, and don't remove tracking from an uppercase
  label — that pairing is the whole point.
- **Don't** omit `tabular-nums` on a figure that changes or sits in a column.
- **Don't** let a section heading run to three lines. Aim for **20–26 characters
  per line** — longer wraps badly at 78px.
- **Don't** re-type the eyebrow/heading/subline classes inline. Use
  `<SectionHeader>` / `<PageHeader>`, so a change lands everywhere at once.

---

## Open items

1. **`--font-mono` / `--font-sans` are dead tokens** (§2). ~200 components are
   affected. One-line fix, not yet applied.
2. `--font-rams-heading` and `--font-rams-body` are defined but used once each —
   the base-layer rules cover almost every case. Either adopt them for
   non-heading elements that need heading type, or drop them.
