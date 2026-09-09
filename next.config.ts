import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * The newsroom was built at `/company/newsroom`, which is where the footer
   * linked it, and moved to `/resources/insights`, which is where both mega
   * menus already pointed. 308 rather than 307: the move is permanent, and a
   * cached redirect is the right outcome for a path that is not coming back.
   */
  redirects() {
    return [
      {
        source: "/company/newsroom",
        destination: "/resources/insights",
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
