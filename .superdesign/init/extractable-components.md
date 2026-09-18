# Extractable components

Candidates for Superdesign `DraftComponent` extraction. Props listed are only
the state/navigation props that change per page — everything else (icons, copy,
CSS) is hardcoded and stays hardcoded.

## Layout components (appear on every page)

## Header
- Source: `src/components/layout/Header.tsx`
- Category: layout
- Description: Fixed shell — announcement bar + navbar, hide-on-scroll, hero-tone detection
- Extractable props: none (it derives everything from scroll position and the DOM)
- Hardcoded: scroll thresholds (40px, 80px), transition timing, `data-hero-tone` query

## Navbar
- Source: `src/components/layout/Navbar.tsx`
- Category: layout
- Description: 80px nav — logo, mega-menu triggers, search, ROI calculator, CTA
- Extractable props: `scrolled` (boolean), `heroMode` (boolean, default false — transparent with white links)
- Hardcoded: `NAV_CONFIG` items, hover delays (150/120ms), all CSS

## AnnouncementBar
- Source: `src/components/layout/AnnouncementBar.tsx`
- Category: layout
- Description: 40px bar above the navbar
- Extractable props: none
- Hardcoded: message text, link, colours

## Footer
- Source: `src/components/layout/Footer.tsx`
- Category: layout
- Description: Site footer — link columns, logo, legal row
- Extractable props: none
- Hardcoded: all column data inline (including five dead `/hardware/*` links)

## MegaMenuPanel
- Source: `src/components/layout/MegaMenuPanel.tsx`
- Category: layout
- Description: V1 mega-menu dropdown — link groups + featured card
- Extractable props: `item` (NavItemConfig), `open` (boolean)
- Hardcoded: layout variants (standard/hardware/industries/resources), motion

## MobileDrawer
- Source: `src/components/layout/MobileDrawer.tsx`
- Category: layout
- Description: Mobile nav drawer with submenu accordions
- Extractable props: `open` (boolean), `onClose` (fn)
- Hardcoded: nav data, animation

---

## Basic components (used across pages)

## SectionHeader
- Source: `src/components/sections/SectionHeader.tsx`
- Category: basic
- Description: **The** section header — eyebrow → two-line heading → subline, centred. On every section of every page.
- Extractable props: `eyebrow` (string), `top` (string), `bottom` (string?), `body` (string?), `tone` ("light"|"dark", default "light"), `size` ("default"|"compact"|"long"), `width` ("default"|"wide"), `bodyWidth` ("default"|"wide"), `align` ("center"|"left")
- Hardcoded: every type value, the orange eyebrow, the dark gradient on line two, all motion

## PageHeader
- Source: `src/components/sections/SectionHeader.tsx`
- Category: basic
- Description: Hero header — pill eyebrow → two-line h1 at 56/84/112px → subline. One per page, above the fold, so it uses `animate` not `whileInView`.
- Extractable props: `eyebrow`, `top`, `bottom`, `body` (string?), `children` (chips/bullets/CTAs)
- Hardcoded: the white→transparent gradient on line two, pill styling, motion

## Section
- Source: `src/components/sections/rackiq/rackiq-shared.tsx`
- Category: basic
- Description: Section wrapper — named surface background + `rams-container` + standard vertical rhythm
- Extractable props: `surface` (SurfaceKey, default "white"), `padding` ("strip"|"tight"|"default"), `paddingTop`, `paddingBottom`, `id`, `clip` (boolean, default true)
- Hardcoded: the `SURFACE` map, the padding scales, auto `text-white` on dark

## ProductFrame
- Source: `src/components/sections/rackiq/rackiq-shared.tsx`
- Category: basic
- Description: Browser chrome around a product screenshot from the `SHOTS` map
- Extractable props: `shot` (ShotKey), `path` (string — the fake URL bar), `priority` (boolean)
- Hardcoded: chrome styling, shadow, radius
- Note: **for screenshots, not devices.** A hardware render should be shown flat.

## RagPill / RagDot
- Source: `src/components/sections/rackiq/rackiq-shared.tsx`
- Category: basic
- Description: Traffic-light status pill / dot
- Extractable props: `rag` ("green"|"amber"|"red"), `size` (number, dot only, default 8)
- Hardcoded: the `RAG` colour table. **Risk state only — never decorative.**

## Kicker / Chip / Pill
- Source: `src/components/sections/rackiq/rackiq-shared.tsx`
- Category: basic
- Description: Mono caps label / bordered chip / rounded pill
- Extractable props: `tone` ("orange"|"muted") on Kicker; `children` on all
- Hardcoded: 10.5px mono bold, 0.2em tracking, uppercase

## RiqClients
- Source: `src/components/sections/rackiq/RiqClients.tsx`
- Category: basic
- Description: Dark customer-logo marquee under a hero. Used on ~16 heroes.
- Extractable props: none — the list comes from `src/data/clients.ts`
- Hardcoded: 46px row height, 0.5→0.9 hover opacity, edge fade mask
- Note: reads `public/clients-dark/` (flat-white cut-outs), not `public/clients/`

## Button
- Source: `src/components/ui/button.tsx`
- Category: basic
- Description: shadcn/cva button
- Extractable props: `variant`, `size`, `asChild`
- Note: **most CTAs on this site do not use it.** They are hand-rolled anchors:
  primary `bg-signal-orange text-white text-[14px] font-semibold px-6 py-3 rounded-lg hover:bg-signal-orange-hover`,
  secondary `border border-white/15 hover:bg-white/[0.06]`. Page CTAs use `rounded-full py-3.5`. No shadow on dark.

## RAMSLogo
- Source: `src/components/ui/RAMSLogo.tsx`
- Category: basic
- Description: The wordmark, black or white SVG
- Extractable props: `variant`/colour per usage
- Hardcoded: `public/RAMS_Logo_Black.svg`, `public/RAMS_Logo_White.svg`

