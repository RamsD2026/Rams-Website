# RAMS Digital — design system

This is a **hard constraint, not inspiration.** The site it describes is built
and shipping across 39 routes. A design that introduces a font, a colour or a
button style not listed here is wrong, however good it looks.

The authoritative sources in the repo are `docs/section-header.md` and
`docs/typography.md`; the values below are read back out of them and out of the
shipped components.

---

## 1. Product context

**RAMS Digital** sells operational intelligence for large warehouses — rack
safety, MHE (forklift) safety and productivity, inventory accuracy, warehouse
execution, and a digital twin of the facility. Buyers are warehouse operations
directors, EHS/safety managers and plant engineers at 3PLs, manufacturers,
cold-storage and e-commerce fulfilment operators. The tone is engineered and
evidential, never playful: this is equipment that prevents a rack collapse or a
forklift striking a person.

**Site architecture:** `/solutions/*` (by business challenge) · `/platform/*`
(the software products: IRDS, MEPS, RTSS, IMDS, ATOS, AIMS, Digital Twin) ·
`/services/*` (inspection and audit engagements) · `/hardware/*` (the devices) ·
`/industries` · `/resources/*` · `/company/*`.

**The design target: `/hardware/ai-vision`.** The first page in the `/hardware`
namespace — every other hardware route is still a dead link. It covers the AI
Vision camera family: fixed multi-spectral AI cameras, in-cab driver monitoring,
and PPE detection.

**JTBD for this page:** a safety or operations manager needs to believe that a
camera system can see what actually happens on their floor — people, vehicles,
pallets, PPE — and turn it into something they can act on. The page must feel
like hardware: a physical device with real coverage, mounting and specs, not
another SaaS dashboard tour.

**What makes this page different from the platform pages:** the platform pages
show software screenshots through browser chrome (`ProductFrame`). This page
must show the **device**. Do not put a dashboard screenshot in the hero.

---

## 2. Colour — the single most violated rule

### The palette, weighted as the brand defines it

| Token | Hex | Share | Role |
|---|---|---|---|
| `carbon` | `#0E0E0F` | 45% | dominant dark, depth, foundation |
| `graphite` | `#33363A` | 20% | balance, secondary text |
| `steel` | `#D9DBDD` | 20% | structural surfaces, dividers |
| `off-white` | `#F3F1EC` | 10% | clarity, space |
| `signal-orange` | `#FF6A00` | **5%** | **CTAs and critical emphasis ONLY** |

### `signal-orange #FF6A00` is the only accent on this entire site

On light surfaces and dark surfaces alike. It is allowed on: the eyebrow label,
**one** word in a heading, a primary CTA, a live/active indicator, a thin rule
or a data highlight. It is **not** allowed on body copy, large fills, or
decoration. If more than roughly 5% of the pixels are orange, it is wrong.

**Forbidden outright — the design agent invents these if left unconstrained:**
no purple, no pink, no blue-to-purple gradients, no neon, no teal accent, no
serif display face, no glassmorphism pastel, no rainbow data colours, no second
accent hue of any kind. There is no "brand gradient" on this site other than the
dark radial surfaces and the white→transparent heading gradient defined below.

### Section surfaces — use these exact values

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

**Surfaces alternate down the page — no two adjacent sections share one.** Use
`darkTop` for the hero, `darkBottom` for the closing CTA.

### Text colour by tone — never a raw hex for text

| Role | Light section | Dark section |
|---|---|---|
| Title | `#0E0E0F` (carbon) | `#FFFFFF` |
| Body | `graphite @ 65%` | `white @ 55–60%` |
| Muted / label | `graphite @ 45%` | `white @ 35–40%` |
| Accent | `#FF6A00` | `#FF6A00` |

### Status colours — risk state only, never decorative

Dark surfaces: green `#54DE91` · amber `#FFBE47` · red `#FF6C6C`
Light surfaces: green `#16A34A` · amber `#D9A21B` · red `#C6413A`

These express a safety/risk reading (a RAG rating on a rack, a detection
severity). They are never used to colour-code decoration or categories.

### Hairlines and cards

- Light hairline `#E8E8ED` · dark hairline `rgba(255,255,255,0.10)`
- Light card: `border-radius: 12px`, `1px solid #E8E8ED`,
  `box-shadow: 0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)`,
  hover lifts `-4px`
- Dark glass card: `border-radius: 18px`,
  `background: linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015))`,
  `1px solid rgba(255,255,255,0.09)`

---

## 3. Typography

### Three families, no others

| Role | Family | Weights | Notes |
|---|---|---|---|
| Headings | **IBM Plex Sans** | 300–700 | every `h1`–`h6` |
| Body & UI | **Roboto** | 300, 400, 500, 700 | default for everything else |
| Labels | **Roboto Mono** | 300, 400, 500 | eyebrows, kickers, metric captions |

No serif anywhere. No decorative or display face. Only weights 400/500/600/700
are loaded — 800 and 900 render as synthetic bold and must not be used.

### The scale is arbitrary pixels, not a named scale

The site uses `text-[Npx]` (1,177 usages) rather than Tailwind's `text-xl` etc.
Half-pixel sizes (`10.5px`, `12.5px`, `14.5px`) are deliberate — keep them.

| Role | Size (mobile / sm / lg) | Weight | Tracking | Leading |
|---|---|---|---|---|
| Page `h1` — hero, one per page | `56 / 84 / 112px` | 700 | `-0.045em` | `0.98–1.06` |
| Section `h2` — default | `40 / 60 / 78px` | 700 | `-0.04em` | `1.0` |
| Section `h2` — compact (over a wide visual) | `36 / 54 / 68px` | 700 | `-0.04em` | `1.05` |
| CTA headline | `36 / 58 / 76px` | 700 | `-0.035em` | `1.02` |
| Sub-headline `h3` | `24–28px` | 600 | `-0.02em` | `1.15` |
| Card title | `20 / 22px` | 600 | `-0.02em` | `1.2` |
| Stat number (large) | `44 / 52px` | 700 | `-0.035em` | `0.95` |
| Stat number (band) | `30 / 34 / 38px` | 700 | `-0.02em` | `1.0` |
| Section subline | `14 / 15px` | 400 | — | `1.55` |
| Body paragraph | `15–16px` | 400 | — | `1.6–1.65` |
| Card body | `14.5px` | 400 | — | `1.6` |
| Dense body / list | `12.5–13px` | 400 | — | `1.55` |
| Button label | `14px` | 600 | — | — |
| **Eyebrow** | `11px` | 600 | `0.22em` | uppercase mono |
| Kicker | `10.5px` | 700 | `0.18–0.22em` | uppercase mono |
| Micro label | `9–9.5px` | 700 | `0.16em` | uppercase mono |

Type steps at `sm:` (640px) and `lg:` (1024px) **only** — no `md:`, no `xl:`.
Labels at 11px and below never scale. Anything ≤12px is always uppercase, mono
and letter-spaced. Any figure that animates or sits in a column of figures gets
`tabular-nums`.

**Tracking follows size:** big type tightens (`112px → -0.045em`,
`78px → -0.04em`, `22px → -0.02em`); small uppercase labels open up
(`11px → 0.22em`). Never letter-space a paragraph.

---

## 4. Layout

```
--page-max-width: 1280px
--page-padding-x: 24px    (≤768px → 20px, ≤640px → 16px)
--grid-gap:       24px
```

`.rams-container` = max-width 1280px, auto margins, those paddings.
**Usable content width is 1232px.** Design to it.

Header is fixed and 120px tall (40px announcement bar + 80px nav), so a hero
starts its padding below that: `pt-36 sm:pt-44 lg:pt-48`.

Section vertical rhythm:

```
default   pt-28 sm:pt-36 lg:pt-44    pb-28 sm:pb-36 lg:pb-44
tight     pt-20 sm:pt-24 lg:pt-28    pb-20 sm:pb-24 lg:pb-28
strip     pt-10 sm:pt-12 lg:pt-14    pb-10 sm:pb-12 lg:pb-14
```

Gap from a section header to its content: `mb-20 sm:mb-24` (default) or
`mb-16 sm:mb-20` when the visual beneath is full-bleed.

---

## 5. The section header — every section opens this way

Centred, three parts, in this order:

```
EYEBROW                      11px mono caps, 0.22em tracking, #FF6A00
Heading line one             bold, tight
heading line two.            dimmed (light) / white→transparent gradient (dark)
Supporting sentence.         one or two lines, max-width 880px, centred
```

- Eyebrow: two or three words. `Capabilities`, `How it works`, `Built for`.
  Never a sentence, never punctuation. Always orange, on both tones.
- Heading: **two lines**, aim for **20–26 characters per line**. The first line
  carries the weight; the second completes the thought and is dimmed. Line two
  on light is `graphite @ 50%`; on dark it is
  `linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0.35))`
  clipped to the text. Never three lines.
- Subline: one or two lines. If it needs three, the heading is doing too little.
  Optional — many sections work with eyebrow + heading alone.
- Header wrapper: `max-width: 900px` centred (or `1180px` when the visual below
  is full-bleed).

**Do not** split the header left/right, or set it flush left. **Do not** wrap a
section in a card when the section already has its own background — one frame,
not two.

The page `h1` is not a section header: it is larger (56/84/112px) and animates
on load rather than on scroll, because it is above the fold.

---

## 6. Buttons and CTAs

```
Primary     background #FF6A00, white text, 14px/600, px-24 py-12, radius 8px
            hover → #E55F00
Secondary   transparent, 1px solid rgba(255,255,255,0.15) on dark
            (or #E8E8ED on light), same type, hover → rgba(255,255,255,0.06)
Page CTA    same but radius 999px (pill), py-14
```

No drop shadow on a button on a dark surface. Buttons sit in a row, centred,
gap 12px, and wrap on mobile.

---

## 7. Motion

`cubic-bezier(0.22, 1, 0.36, 1)` — **every** transition on this site.

| Element | from | duration | delay |
|---|---|---|---|
| Eyebrow | `opacity 0, y 8` | 0.5s | — |
| Heading | `opacity 0, y 20` | 0.85s | — |
| Subline | `opacity 0, y 12` | 0.65s | 0.10s |
| Hero visual | `opacity 0, y 28` | 1.0s | 0.50s |

Sections animate **once** on scroll-in and never replay. The hero animates on
load. Motion is restrained: fades and short upward translations. No parallax
carousels, no bouncing, no spring overshoot, no auto-playing carousels of
marketing claims.

---

## 8. Specific requirements for `/hardware/ai-vision`

1. **It is a hardware page.** Show the device. `public/AI Vision.png` is a
   RAMS-branded camera render — white housing with the RAMS mark, orange
   detection boxes over operators, pallets and a forklift in a dark warehouse.
   It is already on-palette and belongs in the hero.
2. **No browser chrome around a dashboard.** That treatment belongs to the
   platform pages.
3. The hero is dark (`darkTop`) with an orange radial glow at
   `radial-gradient(60% 60% at 50% 20%, rgba(255,106,0,0.22), transparent 70%)`.
4. Three product lines must be covered: **fixed AI cameras** (multi-spectral,
   on-device inference, zone coverage), **in-cab driver monitoring** (fatigue,
   distraction, unsafe behaviour), and **PPE detection** (automated compliance).
5. Hardware pages earn things software pages do not: mounting and coverage
   diagrams, a specification table, environmental ratings, an install/power
   story. These are welcome — rendered in the type and colour system above.
6. Copy must stay evidential. No invented customer names, no invented
   percentages, no certification claims. Placeholder metrics must read as
   placeholders.
7. British English: `optimisation`, `prioritise`, `centred`, `behaviour`.

---

## 9. Fidelity checklist — run before returning a design

- [ ] Only IBM Plex Sans, Roboto, Roboto Mono. No serif, no display face.
- [ ] `#FF6A00` is the only accent hue. No purple/pink/blue/teal/neon.
- [ ] Orange is roughly 5% of the pixels, not a fill colour.
- [ ] Every section opens with centred eyebrow → two-line heading → subline.
- [ ] Eyebrow is 11px mono caps at 0.22em, orange.
- [ ] Heading lines are 20–26 characters; never three lines.
- [ ] Surfaces alternate; no two adjacent sections share one.
- [ ] Content sits within 1232px.
- [ ] Every transition uses `cubic-bezier(0.22, 1, 0.36, 1)`.
- [ ] The hero shows the device, not a dashboard.
