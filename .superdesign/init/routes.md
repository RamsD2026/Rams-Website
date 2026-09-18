# Routes

File-based App Router. **Every `page.tsx` is a thin server component**: a
`metadata` export plus an ordered list of section components. No page file
carries `"use client"`; none holds markup. All design lives in
`src/components/sections/<prefix>/`, one folder per page, one file per section.

```tsx
export const metadata: Metadata = { title: "…", description: "…" };

export default function RackSafetyIntelligencePage() {
  return (<><IrdsHero /><IrdsStatsBand /><IrdsCapabilities />…</>);
}
```

Section components are almost all `"use client"` (385 of 428 files) because they
animate. That is the expected shape — do not push them to the server.

## The prefix map is not guessable

| Route | File | Section folder |
|---|---|---|
| `/` | `src/app/page.tsx` | `sections/*.tsx` (flat) via `HeroVersioned` + `SectionsVersioned` |
| `/hardware/ai-vision` | `src/app/hardware/ai-vision/page.tsx` | **empty — design target** |
| `/solutions/rack-safety-intelligence` | `…/solutions/rack-safety-intelligence/page.tsx` | `irds/` — **reference page** |
| `/solutions/inventory-intelligence` | `…/solutions/inventory-intelligence/page.tsx` | `inv/` — **reference page** |
| `/solutions/warehouse-execution` | `…/solutions/warehouse-execution/page.tsx` | `wex/` — **reference page** |
| `/solutions/mhe-intelligence` | `…/solutions/mhe-intelligence/page.tsx` | `mhe/` |
| `/solutions/mhe-diagnostics` | `…/solutions/mhe-diagnostics/page.tsx` | `dia/` |
| `/solutions/management-intelligence` | `…/solutions/management-intelligence/page.tsx` | `aims/` |
| `/platform/irds` | `…/platform/irds/page.tsx` | `rds/` |
| `/platform/digital-twin` | `…/platform/digital-twin/page.tsx` | `twin/` |
| `/platform/meps` | `…/platform/meps/page.tsx` | `meps/` |
| `/platform/rtss` | `…/platform/rtss/page.tsx` | `rts/` |
| `/platform/imds` | `…/platform/imds/page.tsx` | `imd/` |
| `/platform/ai-operational-intelligence` | `…/platform/ai-operational-intelligence/page.tsx` | `atos/` |
| `/platform/security` | `…/platform/security/page.tsx` | `ams/` |
| `/platform/iros` | `…/platform/iros/page.tsx` | `iros/` |
| `/platform/irds-0-1` | `…/platform/irds-0-1/page.tsx` | `irdsx/` |
| `/platform/overview` | `…/platform/overview/page.tsx` | `meps/` |
| `/roi-calculator` | `…/roi-calculator/page.tsx` | `meps/` |
| `/industries` | `…/industries/page.tsx` | `industries/` — one page, hash anchors |
| `/services (+6 children)` | `…/services/**/page.tsx` | `services/` — data + `ServiceShell` |
| `/company/about` | `…/company/about/page.tsx` | `about/` |
| `/company/partners` | `…/company/partners/page.tsx` | `partners/` |
| `/company/certifications` | `…/company/certifications/page.tsx` | `certifications/` |
| `/company/contact` | `…/company/contact/page.tsx` | `contact/` |
| `/company/careers` | `…/company/careers/page.tsx` | `careers/` |
| `/resources/case-studies` | `…/resources/case-studies/page.tsx` | `cases/` |
| `/resources/insights` | `…/resources/insights/page.tsx` | `newsroom/` |
| `/resources/compliance-guides` | `…/resources/compliance-guides/page.tsx` | `glossary/` + `technotes/` |
| `/resources/technical-notes` | `…/resources/technical-notes/page.tsx` | `technotes/` |
| `/resources/downloads` | `…/resources/downloads/page.tsx` | `downloads/` |
| `/resources/faqs` | `…/resources/faqs/page.tsx` | `faqs/` |
| `/resources/videos` | `…/resources/videos/page.tsx` | `videos/` |
| `/resources/webinars` | `…/resources/webinars/page.tsx` | `webinars/` |

**Dead section folders — no route reaches them:** `dtw/`, `irdsp/`, `rtss/`,
`imds/`, and `rackiq/` apart from its shared files. Earlier builds of pages
since rebuilt under a new prefix, kept on disk deliberately.

## The `/hardware` namespace is almost entirely unbuilt

`/hardware/ai-vision` is the **only** hardware route that exists, and it is
empty. Sixteen sibling slugs are linked from `lib/navigation.ts`,
`lib/navigation-v2.ts` and the footer with no route behind them:

```
/hardware              /hardware/omnibox          /hardware/lidar
/hardware/ai-cameras   /hardware/omnibox-edge     /hardware/rtls
/hardware/driver-monitoring  /hardware/omnibox-ai /hardware/indoor-positioning
/hardware/ppe-detection      /hardware/omnibox-motion  /hardware/location
/hardware/airscan      /hardware/omnibox-core     /hardware/inspection
/hardware/floorscan    /hardware/sensor-stack
```

"AI Vision" is additionally linked as `/platform/ai-vision` (from
`EcosystemSection`, `ChallengeProblemGrid`) and `/solutions/ai-vision` (from
`SolutionsGrid`). Both are 404s. Which namespace is canonical is undecided.

## Redirects

Renamed routes and sixteen never-built `/industries/*` slugs are redirects, not
pages. Check here before adding a route.

### `next.config.ts`
Redirects + remote image patterns.

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * The newsroom was built at `/company/newsroom`, which is where the footer
   * linked it, and moved to `/resources/insights`, which is where both mega
   * menus already pointed. 308 rather than 307: the move is permanent, and a
   * cached redirect is the right outcome for a path that is not coming back.
   *
   * The industry paths are the same case sixteen times over. Three nav files
   * spelled the same nine industries nine different ways between them and not
   * one of those routes was ever built; every one now lands on its section of
   * `/industries`. The nav links point straight at the hash, so these exist
   * only for anything outside the site that already had the old path.
   */
  redirects() {
    return [
      {
        // The V2 mega menu spells this one without the noun. The V1 menu, the
        // footer and the route itself use the full slug, so the short form is
        // redirected rather than a second route being added for it.
        source: "/services/mhe-productivity",
        destination: "/services/mhe-productivity-assessment",
        permanent: true,
      },
      {
        source: "/services/request-quote",
        destination: "/company/contact",
        permanent: false,
      },
      {
        source: "/company/newsroom",
        destination: "/resources/insights",
        permanent: true,
      },
      {
        source: "/industries/warehousing-distribution",
        destination: "/industries#warehousing",
        permanent: true,
      },
      {
        source: "/industries/warehousing",
        destination: "/industries#warehousing",
        permanent: true,
      },
      {
        source: "/industries/third-party-logistics",
        destination: "/industries#3pl",
        permanent: true,
      },
      {
        source: "/industries/3pl-logistics",
        destination: "/industries#3pl",
        permanent: true,
      },
      {
        source: "/industries/logistics-3pl",
        destination: "/industries#3pl",
        permanent: true,
      },
      {
        source: "/industries/ecommerce-fulfilment",
        destination: "/industries#ecommerce",
        permanent: true,
      },
      {
        source: "/industries/ecommerce",
        destination: "/industries#ecommerce",
        permanent: true,
      },
      {
        source: "/industries/retail",
        destination: "/industries#ecommerce",
        permanent: true,
      },
      {
        source: "/industries/cold-storage",
        destination: "/industries#cold-storage",
        permanent: true,
      },
      {
        source: "/industries/cold-chain",
        destination: "/industries#cold-storage",
        permanent: true,
      },
      {
        source: "/industries/manufacturing",
        destination: "/industries#manufacturing",
        permanent: true,
      },
      {
        source: "/industries/automotive",
        destination: "/industries#automotive",
        permanent: true,
      },
      {
        source: "/industries/fmcg",
        destination: "/industries#fmcg",
        permanent: true,
      },
      {
        source: "/industries/food-beverage",
        destination: "/industries#food-beverage",
        permanent: true,
      },
      {
        source: "/industries/pharmaceuticals",
        destination: "/industries#pharmaceuticals",
        permanent: true,
      },
      {
        source: "/industries/pharmaceutical",
        destination: "/industries#pharmaceuticals",
        permanent: true,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.rams.digital",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
```


