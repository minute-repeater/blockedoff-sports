import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "a.espncdn.com",
        pathname: "/i/teamlogos/**",
      },
      {
        protocol: "https",
        hostname: "a.espncdn.com",
        pathname: "/combiner/i/**",
      },
      {
        protocol: "https",
        hostname: "media.formula1.com",
        pathname: "/content/dam/fom-website/teams/**",
      },
    ],
  },
};

export default nextConfig;
