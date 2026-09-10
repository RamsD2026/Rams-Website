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
