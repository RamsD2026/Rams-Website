import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Who may load the dev server's own resources.
   *
   * Next refuses `/_next/*` requests in development from any origin but
   * localhost. Open the site on the LAN address instead — to check it on a
   * phone, or because that is the link that was shared — and the HTML still
   * renders, but the client bundle and the HMR socket are blocked. The page
   * therefore never hydrates: menus do not open, search does nothing, the
   * language control is dead, and anything with an entrance animation stays
   * at its `initial` opacity, which reads as missing text rather than as a
   * broken page. Nothing in the console says why unless you are looking at
   * the dev server's own log.
   *
   * This allows the machine's LAN address. It is a development-only setting
   * and has no effect on the deployed site.
   */
  allowedDevOrigins: ["192.168.1.150", "192.168.1.4", "localhost", "127.0.0.1"],

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
      /* ── Links that pointed at pages that were never built ───────────
         Forty-four routes in the navigation and the footer returned 404.
         Where the page the reader wanted already exists under another
         name — Support is the FAQ help centre, Documentation is Downloads,
         Blog is Insights — the link now lands on it. 307 rather than 308:
         these are the site catching up with its own navigation, and the
         real page may yet be built at the original path.

         The whole of /hardware/* goes to the holding page: nineteen links,
         no pages, and nothing truthful to send them to instead. */
      /* The Clients page lived at /industries while it carried the industry
         essays. It carries the customer portfolio now and the menu has said
         Clients for some time, so the path says Clients too. The fragment
         survives: a browser reapplies it after the redirect, so
         /industries#3pl lands on /clients#3pl. */
      { source: "/industries", destination: "/clients", permanent: true },
      { source: "/industries/:path*", destination: "/clients", permanent: true },

      { source: "/contact", destination: "/company/contact", permanent: false },
      { source: "/get-started", destination: "/company/contact", permanent: false },
      { source: "/find-your-starting-point", destination: "/solutions", permanent: false },
      { source: "/sitemap", destination: "/", permanent: false },

      { source: "/resources", destination: "/resources/case-studies", permanent: false },
      { source: "/resources/support", destination: "/resources/faqs", permanent: false },
      { source: "/resources/faq", destination: "/resources/faqs", permanent: false },
      { source: "/resources/docs", destination: "/resources/downloads", permanent: false },
      { source: "/resources/whitepapers", destination: "/resources/downloads", permanent: false },
      { source: "/resources/warehouse-ai-report-2026", destination: "/resources/downloads", permanent: false },
      { source: "/resources/blog", destination: "/resources/insights", permanent: false },
      { source: "/resources/compliance", destination: "/resources/compliance-guides", permanent: false },

      { source: "/platform", destination: "/platform/overview", permanent: false },
      { source: "/platform/ai-intelligence", destination: "/platform/ai-operational-intelligence", permanent: false },
      { source: "/platform/execution-engine", destination: "/platform/overview", permanent: false },
      { source: "/platform/integrations", destination: "/platform/overview", permanent: false },

      { source: "/solutions/rack-intelligence", destination: "/solutions/rack-safety-intelligence", permanent: false },

      { source: "/company", destination: "/company/about", permanent: false },
      { source: "/company/leadership", destination: "/company/about", permanent: false },
      { source: "/company/customers", destination: "/industries", permanent: false },

      { source: "/hardware/:slug+", destination: "/hardware", permanent: false },

      {
        // The inventory module was IROS, then IRTS, and is now IBIS — the
        // Inventory Behaviour Intelligence Suite. IRTS is now a separate
        // module with its own page, so only the IROS path redirects here.
        source: "/platform/iros",
        destination: "/platform/ibis",
        permanent: true,
      },
      {
        // The safety and operational assessment page was withdrawn; the
        // services index is what the path answers with now.
        source: "/services/operational-assessment",
        destination: "/services",
        permanent: true,
      },
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
