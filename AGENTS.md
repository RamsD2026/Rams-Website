<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# The project

The RAMS Digital marketing site. Next.js 16 App Router, React 19, Tailwind v4,
TypeScript strict, framer-motion for all animation. No tests and no CI config —
the loop is `npm run dev` and reading the page.

```bash
npm run dev      # localhost:3000
npm run build    # the only real check; every route prerenders static
npm run lint     # read "Lint baseline" below before trusting the result
```

`scripts/*.mjs` are one-off asset generators run by hand
(`node scripts/gen-dark-clients.mjs`), not part of the build.

# Architecture

## A route is a manifest, not a page

Every `src/app/**/page.tsx` is a thin **server** component: `metadata`, then an
ordered list of section components. No page file carries `"use client"`, and
none holds markup. The design lives in `src/components/sections/<prefix>/`, one
folder per page, one file per section.

```tsx
export const metadata: Metadata = { title: "…", description: "…" };

export default function RackSafetyIntelligencePage() {
  return (<><IrdsHero /><IrdsStatsBand /><IrdsCapabilities />…</>);
}
```

Section components are almost all `"use client"` (385 of 428 files) because they
animate. That is the expected shape here — don't try to push them to the server.

## Folder prefixes are not guessable

The section folders are abbreviations, and several collide with product names
that mean something else on the route side. Read this table rather than
inferring:

| Route | Section folder |
|---|---|
| `/` | `sections/*.tsx` (flat), via `HeroVersioned` + `SectionsVersioned` |
| `/solutions/rack-safety-intelligence` | `irds/` |
| `/solutions/mhe-intelligence` | `mhe/` |
| `/solutions/inventory-intelligence` | `inv/` |
| `/solutions/warehouse-execution` | `wex/` |
| `/solutions/mhe-diagnostics` | `dia/` |
| `/solutions/management-intelligence` | `aims/` |
| `/platform/irds` | `rds/` |
| `/platform/irds-0-1` | `irdsx/` |
| `/platform/rtss` | `rts/` |
| `/platform/imds` | `imd/` |
| `/platform/digital-twin` | `twin/` |
| `/platform/ai-operational-intelligence` | `atos/` |
| `/platform/security` | `ams/` |
| `/platform/meps`, `/platform/overview`, `/roi-calculator` | `meps/` |
| `/industries`, `/services/*`, `/company/*`, `/resources/*` | folder of the same name — except `/resources/insights` → `newsroom/` and `/resources/compliance-guides` → `glossary/` |

**Dead folders — no route reaches them:** `dtw/`, `irdsp/`, `rtss/`, `imds/`,
and `rackiq/` apart from its shared files (below). They are earlier builds of
pages since rebuilt under a new prefix, kept on disk deliberately. Editing them
produces no visible change; don't delete them without asking.

## `rackiq/rackiq-shared.tsx` is the design system

Despite the folder name and its own doc comment, this file is the site's shared
primitive library — **209 components across every page folder import from it.**
Read it before building any section.

- `EASE = [0.22, 1, 0.36, 1]` — every transition on the site.
- `SURFACE` — the named backgrounds (`white`, `offWhite`, `warm`, `ink`,
  `inkTeal`, `darkTop`, `darkMid`, `darkBottom`) plus `toneOf()`.
- `T` — the tone → text-colour record (`title`/`body`/`muted`/`cardBg`/…). Use
  it instead of retyping `text-white/55`.
- `RAG`, `RagDot`, `RagPill` — risk state only, never decoration.
- `Section` — surface + `rams-container` + the standard vertical rhythm.
- `ProductFrame`, `ProductVideo`, `AppShell`, `Kicker`, `Chip`, `Pill`, `Split`,
  `Media`, `Flow`, `ChapterHead`.

`<Section surface="…">` is the current way to open a section (188 files). Older
components hand-roll `<section className="bg-white pt-28 sm:pt-36 lg:pt-44 …">`.
New work uses `Section`.

`RiqClients` (same folder) is the dark customer-logo strip, rendered in ~16
heroes. Its list is `src/data/clients.ts` — one list, one folder
(`public/clients/`, plus the generated `public/clients-dark/`). Read that file's
header comment before adding a logo; the strip has been cut back once already
for names that couldn't be verified.

## Data-driven pages

Where several routes are one page rendered N times, the copy is a typed data
file and the layout is a shell:

- `services/service-types.ts` + `service-data.ts` + `ServiceShell.tsx` — six
  service routes. A service carries an **ordered `sections` array of tagged
  blocks**, not fixed slots, and surfaces are *computed* by `surfacesFor` in the
  shell, never named in the data. Adding a service is a data change.
- Same pattern, lighter: `cases/`, `certifications/`, `faqs/`, `industries/`,
  `technotes/`, `videos/`, `webinars/`, `downloads/`, `newsroom/`, `glossary/`,
  `iros/`, each with its own `*-data.ts`.
- Icons in data files are **string names** (lucide in `icon`, heroicons-solid in
  `hero`), resolved by a table in the shell, so the data files stay React-free.
  A typo costs an icon, never a render.

# Conventions that bite

## Surfaces alternate

No two adjacent sections share a background. Where they must, shorten the shared
boundary with `paddingTop` **or** `paddingBottom`, never both. Composed pages
enforce this by hand; the service pages compute it.

## `data-hero-tone`

The navbar goes transparent with white links while the page is at the top, which
only works over a dark hero. A hero declares its own tone with
`data-hero-tone="light"` on its root element and `Header` queries the DOM for one
on every navigation — there is no route list. A new light hero needs that
attribute and nothing else.

## The v1 / v2 nav experiment

`useNavVersion()` in `ui/VersionSwitcher.tsx` reads
`localStorage["rams-nav-version"]` and drives three things: which mega menu
`Navbar` renders (`lib/navigation.ts` vs `lib/navigation-v2.ts`), and which
homepage hero and section list render (`HeroVersioned`, `SectionsVersioned`).
**`<VersionSwitcher />` itself is not mounted anywhere**, so v1 is what ships and
v2 is reachable only by setting the key by hand. A homepage change almost always
means the v1 branch of `SectionsVersioned`.

## Redirects live in `next.config.ts`

Renamed routes and the sixteen never-built `/industries/*` slugs are redirects,
not pages — the nav files had spelled the same nine industries several different
ways. Check whether a redirect already claims a path before adding a route.
`/industries` is one page with hash anchors.

## Comment style

This codebase documents **why**, at length, in a header comment on nearly every
file and route: the trade-off considered, the alternative rejected, the source
document it was built from, the gotcha that cost an hour. Match that. A
one-sentence summary on a 900-line animated section is out of place here.

Commit subjects are sentence case and name the outcome —
`Rebuild the certifications page, refine the service pages, add dark-hero logos`.
Site copy is British English (`optimisation`, `prioritise`, `centred`).

## Lint baseline

`npm run lint` reports ~70 pre-existing problems (42 errors), confined to
`src/components/ui/` (the vendored shadcn / aceternity / react-bits widgets:
`globe.tsx`, `glowing-effect.tsx`, `Grainient.tsx`, the 3D widgets) and the older
flat homepage sections (`BentoGrid`, `IndustryModal`, `CustomerSuccess`,
`EcosystemSection`, `PlatformReveal`, `TechnologySystems`, `OperationShowcase`,
`ChallengeSelector`, `IndustriesCarousel`). Mostly `no-explicit-any` and
`react-hooks/exhaustive-deps`. **Don't read a dirty lint run as your own
regression** — check whether your files are in it. Don't add to it either.

# Design system docs — read before writing CSS

- `docs/section-header.md` — the canonical section header (eyebrow → two-line
  heading → subline, centred), the surface table, section rhythm, card
  treatment, and the don'ts. Use `<SectionHeader>` / `<PageHeader>` from
  `@/components/sections/SectionHeader` rather than re-typing the classes; a
  change there lands on every page at once.
- `docs/typography.md` — the three families (IBM Plex Sans / Roboto / Roboto
  Mono), the font tokens, and the full type scale: every size, weight, tracking
  and line-height on the site. The site uses arbitrary px values
  (`text-[14.5px]`), not Tailwind's named scale — 1,177 uses against 116. Check
  it before choosing a font size. It also records that `--font-mono` and
  `--font-sans` are dead tokens: `font-mono` currently renders as Roboto, and
  `font-sans` resolves to nothing.
- `docs/digital-twin-brief.md` — the build brief for `/platform/digital-twin`,
  and the clearest statement of the standard new pages are held to.
- `docs/irds-intelligence-animation.md` — an archived animation kept verbatim
  for re-use, with the framer-motion gotchas that came out of building it.

Colour tokens are in `src/app/globals.css` under `@theme inline`, as the RAMS
brand palette with its 45/20/20/10/5% weighting. `signal-orange` (`#FF6A00`) is
the **only** accent — CTAs, eyebrows, one word in a heading, a live indicator.
Not body copy, not decoration. Invent no colour that is not already on the site.

Layout width is global: `.rams-container` (`--page-max-width` 1280px minus 24px
padding a side = 1232px of content). Header heights are tokens too
(`--header-total: 120px`).
